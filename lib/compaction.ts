const logger = {
  warn: (...args: unknown[]) => console.warn('[compaction]', ...args),
  debug: (...args: unknown[]) => console.debug('[compaction]', ...args),
  info: (...args: unknown[]) => console.log('[compaction]', ...args),
  error: (...args: unknown[]) => console.error('[compaction]', ...args),
};

interface CompactionConfig {
  proactiveThreshold: number;
  hardLimit: number;
  toolCallThreshold: number;
  minIntervalMs: number;
  maxRetries: number;
  backoffBaseMs: number;
  backoffMaxMs: number;
  importanceThresholds: {
    critical: number;
    important: number;
    normal: number;
    discardable: number;
  };
  tokenMultipliers: {
    system: number;
    user: number;
    assistant: number;
    tool: number;
    toolResult: number;
  };
  enableAutoSnapshot: boolean;
  snapshotIntervalMs: number;
  enableTelemetry: boolean;
}

const DEFAULT_CONFIG: CompactionConfig = {
  proactiveThreshold: 167_000,
  hardLimit: 195_000,
  toolCallThreshold: 50,
  minIntervalMs: 30_000,
  maxRetries: 3,
  backoffBaseMs: 1000,
  backoffMaxMs: 30_000,
  importanceThresholds: {
    critical: 0.9,
    important: 0.7,
    normal: 0.4,
    discardable: 0.2,
  },
  tokenMultipliers: {
    system: 2.0,
    user: 1.0,
    assistant: 1.2,
    tool: 1.5,
    toolResult: 0.8,
  },
  enableAutoSnapshot: true,
  snapshotIntervalMs: 300_000,
  enableTelemetry: true,
};

export interface Message {
  id: string;
  role: 'system' | 'user' | 'assistant' | 'tool' | 'tool_result';
  content: string;
  timestamp: number;
  importanceScore?: number;
  tokenCount?: number;
  metadata?: Record<string, unknown>;
}

export interface SessionState {
  messages: Message[];
  memoryIndex: number;
  sessionId: string;
  lastCompactedAt: number;
  compactionHistory: CompactionRecord[];
}

export interface CompactionRecord {
  id: string;
  timestamp: number;
  type: 'proactive' | 'reactive' | 'snip' | 'context_collapse';
  tokenBefore: number;
  tokenAfter: number;
  messagesRemoved: number;
  summary?: string;
  success: boolean;
  error?: string;
  durationMs: number;
  tokensSaved: number;
}

export interface TokenEstimate {
  total: number;
  byRole: Record<string, number>;
  weighted: number;
  breakdown: Array<{
    role: string;
    count: number;
    tokens: number;
    weighted: number;
  }>;
}

export interface BoundaryResult {
  index: number;
  messages: Message[];
  totalTokens: number;
  isSafe: boolean;
  reason: string;
}

export interface CompactionResult {
  success: boolean;
  newMessages: Message[];
  summary?: string;
  tokensSaved: number;
  error?: string;
}

export interface HealthCheckResult {
  healthy: boolean;
  checks: Array<{
    name: string;
    passed: boolean;
    message: string;
  }>;
}

export function estimateTokens(
  messages: Message[],
  config: CompactionConfig = DEFAULT_CONFIG
): TokenEstimate {
  const byRole: Record<string, number> = {};
  const breakdown: TokenEstimate['breakdown'] = [];
  
  let total = 0;
  let weighted = 0;

  for (const msg of messages) {
    const role = msg.role;
    const roleMultiplier = role === 'tool_result' ? 'toolResult' : role;
    const multiplier = (config.tokenMultipliers[roleMultiplier as keyof typeof config.tokenMultipliers] ?? 1.0);
    const metaName = typeof msg.metadata?.name === 'string' ? msg.metadata.name : '';
    const baseTokens = Math.ceil((msg.content.length + metaName.length) / 4);
    const weightedTokens = Math.ceil(baseTokens * multiplier);
    
    byRole[role] = (byRole[role] ?? 0) + weightedTokens;
    total += baseTokens;
    weighted += weightedTokens;
    
    breakdown.push({
      role,
      count: 1,
      tokens: baseTokens,
      weighted: weightedTokens,
    });
  }

  const memoryOverhead = Math.ceil(messages.length * 50);
  
  return {
    total: total + memoryOverhead,
    byRole,
    weighted: weighted + memoryOverhead,
    breakdown,
  };
}

export function needsCompaction(
  state: SessionState,
  config: CompactionConfig = DEFAULT_CONFIG
): boolean {
  const estimate = estimateTokens(state.messages, config);
  return estimate.weighted > config.proactiveThreshold;
}

export function calculateImportance(msg: Message): number {
  if (msg.importanceScore !== undefined) {
    return msg.importanceScore;
  }

  let score = 0.5;

  switch (msg.role) {
    case 'system':
      score = 1.0;
      break;
    case 'user':
      score = 0.8;
      break;
    case 'assistant':
      score = 0.6;
      break;
    case 'tool':
      score = 0.4;
      break;
    case 'tool_result':
      score = 0.3;
      break;
  }

  const content = msg.content.toLowerCase();
  const boostKeywords = ['important', 'critical', 'remember', 'must', 'never', 'always', 'warning', 'error', 'fix', 'bug', 'issue'];
  const penalizeKeywords = ['test', 'debug', 'log', 'trace', 'verbose', 'temp', 'tmp'];

  for (const kw of boostKeywords) {
    if (content.includes(kw)) score += 0.1;
  }
  for (const kw of penalizeKeywords) {
    if (content.includes(kw)) score -= 0.1;
  }

  return Math.max(0, Math.min(1, score));
}

export function isDiscardable(msg: Message, threshold = 0.2): boolean {
  return calculateImportance(msg) < threshold;
}

export function findCompactBoundary(
  messages: Message[],
  config: CompactionConfig = DEFAULT_CONFIG
): BoundaryResult {
  if (messages.length === 0) {
    return {
      index: 0,
      messages: [],
      totalTokens: 0,
      isSafe: true,
      reason: 'No messages to compact',
    };
  }

  const scored = messages.map((msg, idx) => ({
    msg,
    idx,
    importance: calculateImportance(msg),
  }));

  const importantThreshold = config.importanceThresholds.important;
  const criticalThreshold = config.importanceThresholds.critical;

  let boundaryIndex = 0;
  let foundCritical = false;

  for (let i = 0; i < scored.length; i++) {
    const item = scored[i];
    
    if (item.importance >= criticalThreshold) {
      foundCritical = true;
    }
    
    if (foundCritical && item.importance < importantThreshold) {
      boundaryIndex = i;
      break;
    }
    
    if (i === Math.floor(scored.length * 0.7)) {
      boundaryIndex = i;
    }
  }

  const boundaryMessages = messages.slice(0, boundaryIndex);
  const tokenEstimate = estimateTokens(boundaryMessages, config);

  const remainingMessages = messages.slice(boundaryIndex);
  const remainingTokens = estimateTokens(remainingMessages, config);
  const isSafe = remainingTokens.weighted < config.proactiveThreshold * 0.8;

  return {
    index: boundaryIndex,
    messages: boundaryMessages,
    totalTokens: tokenEstimate.weighted,
    isSafe,
    reason: isSafe 
      ? `Safe boundary at ${boundaryIndex} messages` 
      : `Unsafe: remaining would be ${remainingTokens.weighted} tokens`,
  };
}

type SummarizeFn = (messages: Message[]) => Promise<string>;

async function proactiveCompact(
  state: SessionState,
  summarizeFn: SummarizeFn,
  config: CompactionConfig = DEFAULT_CONFIG
): Promise<CompactionResult> {
  const boundary = findCompactBoundary(state.messages, config);
  
  if (boundary.index === 0) {
    return {
      success: false,
      newMessages: state.messages,
      error: 'No suitable boundary found',
      tokensSaved: 0,
    };
  }

  const tokenBefore = estimateTokens(state.messages, config).weighted;
  
  try {
    const summary = await summarizeFn(boundary.messages);
    
    const summaryMessage: Message = {
      id: `summary-${Date.now()}`,
      role: 'system',
      content: `[Compacted ${boundary.messages.length} messages]\n${summary}`,
      timestamp: Date.now(),
      importanceScore: 0.9,
      metadata: {
        originalCount: boundary.messages.length,
        originalTokens: boundary.totalTokens,
        type: 'compacted_summary',
      },
    };

    const newMessages = [summaryMessage, ...state.messages.slice(boundary.index)];
    const tokenAfter = estimateTokens(newMessages, config).weighted;

    return {
      success: true,
      newMessages,
      summary,
      tokensSaved: tokenBefore - tokenAfter,
    };
  } catch (error) {
    return {
      success: false,
      newMessages: state.messages,
      error: `Proactive compact failed: ${error}`,
      tokensSaved: 0,
    };
  }
}

async function reactiveCompact(
  state: SessionState,
  summarizeFn: SummarizeFn,
  config: CompactionConfig = DEFAULT_CONFIG
): Promise<CompactionResult> {
  const aggressiveBoundary = Math.floor(state.messages.length * 0.2);
  
  if (aggressiveBoundary < 2) {
    return {
      success: false,
      newMessages: state.messages,
      error: 'Not enough messages to compact',
      tokensSaved: 0,
    };
  }

  const toCompact = state.messages.slice(0, aggressiveBoundary);
  const tokenBefore = estimateTokens(state.messages, config).weighted;

  try {
    const summary = await summarizeFn(toCompact);
    
    const summaryMessage: Message = {
      id: `summary-${Date.now()}`,
      role: 'system',
      content: `[Force-compacted ${toCompact.length} messages]\n${summary}`,
      timestamp: Date.now(),
      importanceScore: 0.85,
      metadata: {
        originalCount: toCompact.length,
        type: 'force_compacted',
      },
    };

    const newMessages = [summaryMessage, ...state.messages.slice(aggressiveBoundary)];
    const tokenAfter = estimateTokens(newMessages, config).weighted;

    return {
      success: true,
      newMessages,
      summary,
      tokensSaved: tokenBefore - tokenAfter,
    };
  } catch (error) {
    return {
      success: false,
      newMessages: state.messages,
      error: `Reactive compact failed: ${error}`,
      tokensSaved: 0,
    };
  }
}

function snipCompact(
  state: SessionState,
  config: CompactionConfig = DEFAULT_CONFIG
): CompactionResult {
  const boundary = findCompactBoundary(state.messages, config);
  const tokenBefore = estimateTokens(state.messages, config).weighted;

  const keepFrom = Math.floor(state.messages.length * 0.5);
  const newMessages = state.messages.slice(keepFrom);
  
  const marker: Message = {
    id: `marker-${Date.now()}`,
    role: 'system',
    content: `[Truncated ${keepFrom} messages]`,
    timestamp: Date.now(),
    importanceScore: 0.7,
    metadata: { type: 'truncated' },
  };

  const tokenAfter = estimateTokens(newMessages, config).weighted;

  return {
    success: true,
    newMessages: [marker, ...newMessages],
    tokensSaved: tokenBefore - tokenAfter,
  };
}

function contextCollapse(
  state: SessionState,
  config: CompactionConfig = DEFAULT_CONFIG
): CompactionResult {
  const verboseTypes = ['tool_result'];
  let totalSaved = 0;
  
  const newMessages = state.messages.map(msg => {
    if (!verboseTypes.includes(msg.role)) return msg;
    
    const originalLen = msg.content.length;
    const compressed = compressVerboseContent(msg.content);
    const saved = originalLen - compressed.length;
    totalSaved += saved;
    
    return {
      ...msg,
      content: compressed,
      metadata: {
        ...msg.metadata,
        collapsed: true,
        originalLength: originalLen,
      },
    };
  });

  return {
    success: true,
    newMessages,
    tokensSaved: Math.ceil(totalSaved / 4),
  };
}

function compressVerboseContent(content: string): string {
  let compressed = content.replace(/\s+/g, ' ').trim();
  
  const lines = compressed.split('\n');
  const uniqueLines = lines.filter((line, idx, arr) => {
    if (idx === 0) return true;
    return line !== arr[idx - 1];
  });
  
  compressed = uniqueLines.join('\n');
  
  if (compressed.length > 2000) {
    compressed = compressed.slice(0, 2000) + '... [truncated]';
  }
  
  return compressed;
}

interface CompactionOptions {
  summarizeFn: SummarizeFn;
  mode?: 'proactive' | 'reactive' | 'snip' | 'auto';
  sdkSession?: boolean;
  flagEnabled?: (flag: string) => boolean;
  signal?: AbortSignal;
}

interface AutoCompactResult {
  compacted: boolean;
  state: SessionState;
  record?: CompactionRecord;
}

export async function autoCompactIfNeeded(
  state: SessionState,
  options: CompactionOptions
): Promise<AutoCompactResult> {
  const config = DEFAULT_CONFIG;
  const { summarizeFn, mode = 'auto', sdkSession = false, flagEnabled = () => false } = options;

  const health = await runHealthChecks(state, config);
  if (!health.healthy) {
    logger.warn({ checks: health.checks }, 'Health checks failed, skipping compaction');
  }

  const estimate = estimateTokens(state.messages, config);
  const toolCallCount = countToolCallsSinceLastCompact(state);

  const shouldTrigger = 
    estimate.weighted > config.proactiveThreshold ||
    toolCallCount > config.toolCallThreshold;

  if (!shouldTrigger) {
    return { compacted: false, state };
  }

  const timeSinceLastCompact = Date.now() - state.lastCompactedAt;
  if (timeSinceLastCompact < config.minIntervalMs) {
    logger.debug({ timeSinceLastCompact }, 'Rate limited, skipping compaction');
    return { compacted: false, state };
  }

  const startTime = Date.now();
  let result: CompactionResult | null = null;
  let type: CompactionRecord['type'] = 'proactive';

  try {
    if (mode === 'snip' || sdkSession) {
      result = snipCompact(state, config);
      type = 'snip';
    } else if (flagEnabled('marble_origami')) {
      result = contextCollapse(state, config);
      type = 'context_collapse';
    } else {
      result = await withExponentialBackoff(
        () => proactiveCompact(state, summarizeFn, config),
        config
      );
    }

    if (!result?.success) {
      result = await withExponentialBackoff(
        () => reactiveCompact(state, summarizeFn, config),
        config
      );
      type = 'reactive';
    }

    if (result?.success) {
      const record: CompactionRecord = {
        id: `compact-${Date.now()}`,
        timestamp: Date.now(),
        type,
        tokenBefore: estimate.weighted,
        tokenAfter: estimate.weighted - result.tokensSaved,
        messagesRemoved: state.messages.length - result.newMessages.length,
        summary: result.summary,
        success: true,
        durationMs: Date.now() - startTime,
        tokensSaved: result.tokensSaved,
      };

      state.messages = result.newMessages;
      state.lastCompactedAt = Date.now();
      state.compactionHistory.unshift(record);
      
      if (state.compactionHistory.length > 50) {
        state.compactionHistory = state.compactionHistory.slice(0, 50);
      }

      logger.info({ 
        type, 
        tokensSaved: result.tokensSaved,
        messagesBefore: state.messages.length + record.messagesRemoved,
        messagesAfter: state.messages.length,
      }, 'Compaction complete');

      return { compacted: true, state, record };
    }

    return { compacted: false, state };
  } catch (error) {
    const record: CompactionRecord = {
      id: `compact-${Date.now()}`,
      timestamp: Date.now(),
      type,
      tokenBefore: estimate.weighted,
      tokenAfter: estimate.weighted,
      messagesRemoved: 0,
      success: false,
      error: String(error),
      durationMs: Date.now() - startTime,
      tokensSaved: 0,
    };

    logger.error({ error }, 'Compaction failed');

    return { compacted: false, state, record };
  }
}

function countToolCallsSinceLastCompact(state: SessionState): number {
  const lastCompactTime = state.lastCompactedAt;
  return state.messages
    .filter(m => m.timestamp > lastCompactTime && (m.role === 'tool' || m.role === 'assistant'))
    .length;
}

async function runHealthChecks(
  state: SessionState,
  config: CompactionConfig
): Promise<HealthCheckResult> {
  const checks: HealthCheckResult['checks'] = [];
  let allPassed = true;

  const hasEnoughMessages = state.messages.length >= 5;
  checks.push({
    name: 'minimum_messages',
    passed: hasEnoughMessages,
    message: hasEnoughMessages 
      ? `${state.messages.length} messages available` 
      : 'Not enough messages to compact safely',
  });
  if (!hasEnoughMessages) allPassed = false;

  const timeSinceLastCompact = Date.now() - state.lastCompactedAt;
  const notRecentlyCompacted = timeSinceLastCompact >= config.minIntervalMs;
  checks.push({
    name: 'rate_limit',
    passed: notRecentlyCompacted,
    message: notRecentlyCompacted 
      ? `${Math.round(timeSinceLastCompact / 1000)}s since last compact` 
      : 'Too soon since last compaction',
  });
  if (!notRecentlyCompacted) allPassed = false;

  if (typeof process !== 'undefined' && process.memoryUsage) {
    const mem = process.memoryUsage();
    const heapUsedMB = mem.heapUsed / 1024 / 1024;
    const memoryHealthy = heapUsedMB < 500;
    checks.push({
      name: 'memory_health',
      passed: memoryHealthy,
      message: memoryHealthy 
        ? `${heapUsedMB.toFixed(0)}MB heap used` 
        : `High memory: ${heapUsedMB.toFixed(0)}MB`,
    });
    if (!memoryHealthy) allPassed = false;
  }

  return { healthy: allPassed, checks };
}

async function withExponentialBackoff<T>(
  fn: () => Promise<T>,
  config: CompactionConfig = DEFAULT_CONFIG
): Promise<T> {
  let lastError: Error | null = null;
  let delay = config.backoffBaseMs;

  for (let attempt = 0; attempt < config.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      logger.warn({ attempt, delay, error: lastError.message }, 'Compaction attempt failed');
      
      await new Promise(resolve => setTimeout(resolve, delay));
      delay = Math.min(delay * 2, config.backoffMaxMs);
    }
  }

  throw lastError;
}

export interface CompactionMetrics {
  totalCompactions: number;
  successRate: number;
  averageTokensSaved: number;
  byType: Record<string, number>;
  recentHistory: CompactionRecord[];
}

export function getMetrics(state: SessionState): CompactionMetrics {
  const history = state.compactionHistory;
  const total = history.length;
  const successful = history.filter(h => h.success).length;
  
  const byType: Record<string, number> = {};
  let totalTokensSaved = 0;

  for (const record of history) {
    byType[record.type] = (byType[record.type] ?? 0) + 1;
    totalTokensSaved += record.tokensSaved;
  }

  return {
    totalCompactions: total,
    successRate: total > 0 ? successful / total : 0,
    averageTokensSaved: total > 0 ? totalTokensSaved / total : 0,
    byType,
    recentHistory: history.slice(0, 10),
  };
}

export const compaction = {
  estimateTokens,
  needsCompaction,
  calculateImportance,
  findCompactBoundary,
  autoCompactIfNeeded,
  getMetrics,
  config: DEFAULT_CONFIG,
};

export default compaction;
