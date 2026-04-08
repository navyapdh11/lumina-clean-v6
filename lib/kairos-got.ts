const logger = {
  info: (...args: unknown[]) => console.log('[kairos-got]', ...args),
  warn: (...args: unknown[]) => console.warn('[kairos-got]', ...args),
  error: (...args: unknown[]) => console.error('[kairos-got]', ...args),
  debug: (...args: unknown[]) => console.debug('[kairos-got]', ...args),
};

export interface ThoughtNode {
  id: string;
  content: string;
  type: 'observation' | 'hypothesis' | 'decision' | 'action';
  confidence: number;
  dependencies: string[];
  timestamp: number;
  metadata?: Record<string, unknown>;
  mctsValue?: number;
  mctsVisits?: number;
}

export interface GoTGraph {
  nodes: Map<string, ThoughtNode>;
  edges: Map<string, string[]>;
}

export interface KairosGoTState {
  graph: GoTGraph;
  activeThoughts: string[];
  lastConsolidatedAt: number;
  sessionId: string;
  tickCount: number;
}

export interface GoTConfig {
  tickIntervalMs: number;
  minHoursBetweenConsolidation: number;
  minSessionsBetweenConsolidation: number;
  confidenceThreshold: number;
  pruneThreshold: number;
  maxActiveThoughts: number;
  enableMCTS: boolean;
  mctsIterations: number;
}

const DEFAULT_CONFIG: GoTConfig = {
  tickIntervalMs: 5 * 60 * 1000,
  minHoursBetweenConsolidation: 4,
  minSessionsBetweenConsolidation: 10,
  confidenceThreshold: 0.85,
  pruneThreshold: 0.3,
  maxActiveThoughts: 100,
  enableMCTS: true,
  mctsIterations: 100,
};

const generateId = (prefix: string): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function initializeState(sessionId: string): KairosGoTState {
  return {
    graph: {
      nodes: new Map(),
      edges: new Map(),
    },
    activeThoughts: [],
    lastConsolidatedAt: 0,
    sessionId,
    tickCount: 0,
  };
}

function addThoughtNode(state: KairosGoTState, node: ThoughtNode): void {
  state.graph.nodes.set(node.id, node);
  state.activeThoughts.push(node.id);
  if (state.activeThoughts.length > DEFAULT_CONFIG.maxActiveThoughts) {
    const removed = state.activeThoughts.shift();
    if (removed) {
      state.graph.nodes.delete(removed);
    }
  }
}

function addEdge(state: KairosGoTState, fromId: string, toId: string): void {
  const edges = state.graph.edges.get(fromId) || [];
  edges.push(toId);
  state.graph.edges.set(fromId, edges);
  const node = state.graph.nodes.get(toId);
  if (node && !node.dependencies.includes(fromId)) {
    node.dependencies.push(fromId);
  }
}

function findHighConfidenceDecision(state: KairosGoTState): ThoughtNode | null {
  for (const node of Array.from(state.graph.nodes.values())) {
    if (node.type === 'decision' && node.confidence >= DEFAULT_CONFIG.confidenceThreshold) {
      return node;
    }
  }
  return null;
}

function pruneLowConfidenceThoughts(state: KairosGoTState): number {
  let pruned = 0;
  const nodesArray = Array.from(state.graph.nodes.entries());
  for (const [id, node] of nodesArray) {
    if (node.confidence < DEFAULT_CONFIG.pruneThreshold && node.type !== 'observation') {
      state.graph.nodes.delete(id);
      state.activeThoughts = state.activeThoughts.filter((tid) => tid !== id);
      pruned++;
    }
  }
  return pruned;
}

function shouldTriggerGoTConsolidation(state: KairosGoTState): boolean {
  const hoursSince = (Date.now() - state.lastConsolidatedAt) / (1000 * 60 * 60);
  const sessionsSince = Math.floor(hoursSince);
  return hoursSince >= DEFAULT_CONFIG.minHoursBetweenConsolidation &&
    sessionsSince >= DEFAULT_CONFIG.minSessionsBetweenConsolidation;
}

interface ObservationGenerator {
  (sessionId: string, state: KairosGoTState): Promise<ThoughtNode>;
}

interface ReasoningGenerator {
  (recentThoughts: ThoughtNode[]): Promise<ThoughtNode[]>;
}

interface ActionExecutor {
  (action: string): Promise<void>;
}

interface SummaryGenerator {
  (thoughts: ThoughtNode[]): Promise<string>;
}

export interface GoTCallbacks {
  generateObservation?: ObservationGenerator;
  generateReasoning?: ReasoningGenerator;
  executeAction?: ActionExecutor;
  generateSummary?: SummaryGenerator;
}

const DEFAULT_OBSERVATION_GENERATOR: ObservationGenerator = async (sessionId, state) => {
  const observations = [
    'System latency within normal parameters',
    'User engagement metrics showing positive trend',
    'Cache hit rate above 80%',
    'Memory usage stable at 65%',
    'Active sessions at peak capacity',
  ];
  return {
    id: generateId('obs'),
    content: observations[Math.floor(Math.random() * observations.length)],
    type: 'observation',
    confidence: 0.7 + Math.random() * 0.3,
    dependencies: [],
    timestamp: Date.now(),
    metadata: { sessionId, tickCount: state.tickCount },
  };
};

const DEFAULT_REASONING_GENERATOR: ReasoningGenerator = async (recentThoughts) => {
  const types: ThoughtNode['type'][] = ['hypothesis', 'decision'];
  const contents = [
    'Cache optimization could reduce latency by 15%',
    'Increase max sessions to handle peak load',
    'Enable predictive prefetching for common queries',
    'Activate additional worker threads',
  ];
  const thoughts: ThoughtNode[] = [];
  for (let i = 0; i < 2; i++) {
    thoughts.push({
      id: generateId('thought'),
      content: contents[Math.floor(Math.random() * contents.length)],
      type: types[i % 2],
      confidence: 0.6 + Math.random() * 0.35,
      dependencies: [],
      timestamp: Date.now(),
    });
  }
  return thoughts;
};

const DEFAULT_ACTION_EXECUTOR: ActionExecutor = async (action) => {
  logger.info(`Executing action: ${action}`);
};

const DEFAULT_SUMMARY_GENERATOR: SummaryGenerator = async (thoughts) => {
  const summary = thoughts.slice(0, 5).map((t) => t.content).join('; ');
  return summary || 'Consolidated thoughts summary';
};

export async function runKairosGoTTickLoop(
  state: KairosGoTState,
  callbacks: GoTCallbacks = {}
): Promise<void> {
  const generateObservation = callbacks.generateObservation ?? DEFAULT_OBSERVATION_GENERATOR;
  const generateReasoning = callbacks.generateReasoning ?? DEFAULT_REASONING_GENERATOR;
  const executeAction = callbacks.executeAction ?? DEFAULT_ACTION_EXECUTOR;
  const generateSummary = callbacks.generateSummary ?? DEFAULT_SUMMARY_GENERATOR;

  state.tickCount++;

  const observation = await generateObservation(state.sessionId, state);
  addThoughtNode(state, observation);

  const recentThoughts = Array.from(Array.from(state.graph.nodes.values())).slice(-10);
  const reasoning = await generateReasoning(recentThoughts);

  for (const thought of reasoning) {
    addThoughtNode(state, thought);
    addEdge(state, observation.id, thought.id);
  }

  const highConfidenceDecision = findHighConfidenceDecision(state);
  if (highConfidenceDecision) {
    logger.info({ decision: highConfidenceDecision }, 'High confidence decision found');
    await executeAction(highConfidenceDecision.content);
  }

  if (shouldTriggerGoTConsolidation(state)) {
    await runGoTConsolidation(state, generateSummary);
  }

  const pruned = pruneLowConfidenceThoughts(state);
  if (pruned > 0) {
    logger.debug({ pruned }, 'Pruned low confidence thoughts');
  }
}

async function runGoTConsolidation(
  state: KairosGoTState,
  generateSummary: SummaryGenerator
): Promise<void> {
  logger.info('Starting GoT consolidation');
  const startTime = Date.now();

  const aggregated = aggregateThoughts(state);
  const resolved = resolveContradictions(state, aggregated);
  const summary = await generateSummary(resolved);

  const summaryNode: ThoughtNode = {
    id: generateId('summary'),
    content: summary,
    type: 'observation',
    confidence: 0.95,
    dependencies: resolved.map((t) => t.id),
    timestamp: Date.now(),
    metadata: { type: 'consolidated_summary' },
  };

  addThoughtNode(state, summaryNode);
  pruneConsolidatedThoughts(state, resolved);

  state.lastConsolidatedAt = Date.now();
  logger.info({ durationMs: Date.now() - startTime }, 'GoT consolidation complete');
}

function aggregateThoughts(state: KairosGoTState): ThoughtNode[] {
  return Array.from(Array.from(state.graph.nodes.values()))
    .filter((n) => n.type === 'observation')
    .slice(-20);
}

function resolveContradictions(state: KairosGoTState, thoughts: ThoughtNode[]): ThoughtNode[] {
  return thoughts.filter((t) => t.confidence > 0.5);
}

function pruneConsolidatedThoughts(state: KairosGoTState, consolidated: ThoughtNode[]): void {
  const toRemoveArray = consolidated.map((t) => t.id);
  for (const id of toRemoveArray) {
    state.graph.nodes.delete(id);
    state.activeThoughts = state.activeThoughts.filter((tid) => tid !== id);
  }
}

export interface TickLoopOptions {
  sessionId?: string;
  callbacks?: GoTCallbacks;
  config?: Partial<GoTConfig>;
  stopSignal?: AbortSignal;
}

export async function startKairosGoTDaemon(options: TickLoopOptions = {}): Promise<void> {
  const { sessionId = 'default', callbacks = {}, config = {}, stopSignal } = options;
  
  const state = initializeState(sessionId);
  const tickInterval = config.tickIntervalMs ?? DEFAULT_CONFIG.tickIntervalMs;

  logger.info({ sessionId, tickInterval }, 'Starting KAIROS GoT daemon');

  try {
    while (!stopSignal?.aborted) {
      await sleep(tickInterval);
      await runKairosGoTTickLoop(state, callbacks);
    }
  } catch (error) {
    logger.error({ error }, 'KAIROS GoT daemon error');
    throw error;
  }
}

export function serializeState(state: KairosGoTState): Record<string, unknown> {
  return {
    graph: {
      nodes: Array.from(state.graph.nodes.entries()),
      edges: Array.from(state.graph.edges.entries()),
    },
    activeThoughts: state.activeThoughts,
    lastConsolidatedAt: state.lastConsolidatedAt,
    sessionId: state.sessionId,
    tickCount: state.tickCount,
  };
}

export function deserializeState(data: Record<string, unknown>): KairosGoTState {
  const graphData = data.graph as { nodes: [string, ThoughtNode][]; edges: [string, string[]][] };
  return {
    graph: {
      nodes: new Map(graphData.nodes),
      edges: new Map(graphData.edges),
    },
    activeThoughts: data.activeThoughts as string[],
    lastConsolidatedAt: data.lastConsolidatedAt as number,
    sessionId: data.sessionId as string,
    tickCount: data.tickCount as number,
  };
}

export function getGraphSnapshot(state: KairosGoTState): ThoughtNode[] {
  return Array.from(Array.from(state.graph.nodes.values()));
}

export function getActiveThoughts(state: KairosGoTState): ThoughtNode[] {
  return state.activeThoughts
    .map((id) => state.graph.nodes.get(id))
    .filter((n): n is ThoughtNode => n !== undefined);
}

export const kairosGot = {
  initializeState,
  runKairosGoTTickLoop,
  startKairosGoTDaemon,
  serializeState,
  deserializeState,
  getGraphSnapshot,
  getActiveThoughts,
  config: DEFAULT_CONFIG,
};

export default kairosGot;
