const logger = {
  debug: (...args: unknown[]) => console.debug('[semantic-cache]', ...args),
  info: (...args: unknown[]) => console.log('[semantic-cache]', ...args),
  warn: (...args: unknown[]) => console.warn('[semantic-cache]', ...args),
  error: (...args: unknown[]) => console.error('[semantic-cache]', ...args),
};

export interface CacheEntry<T> {
  key: string;
  value: T;
  embedding: number[];
  timestamp: number;
  ttl: number;
  accessCount: number;
  metadata?: Record<string, unknown>;
}

export interface SemanticCacheConfig {
  similarityThreshold: number;
  defaultTtl: number;
  maxCacheSize: number;
  embeddingDimension: number;
  enableBatchOps: boolean;
  enablePrefixInvalidation: boolean;
  staleWhileRevalidate: number;
}

const DEFAULT_CONFIG: SemanticCacheConfig = {
  similarityThreshold: 0.85,
  defaultTtl: 3600,
  maxCacheSize: 1000,
  embeddingDimension: 1536,
  enableBatchOps: true,
  enablePrefixInvalidation: true,
  staleWhileRevalidate: 300,
};

interface EmbeddingFunction {
  (text: string): Promise<number[]>;
}

const DEFAULT_EMBEDDING_FN: EmbeddingFunction = async (text) => {
  const hash = simpleHash(text);
  const seed = hash % 1000;
  const embedding: number[] = [];
  for (let i = 0; i < DEFAULT_CONFIG.embeddingDimension; i++) {
    const value = Math.sin(seed * i * 0.1) * Math.cos(seed * i * 0.05);
    embedding.push(value);
  }
  normalize(embedding);
  return embedding;
};

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function normalize(vec: number[]): void {
  const magnitude = Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0));
  if (magnitude > 0) {
    for (let i = 0; i < vec.length; i++) {
      vec[i] /= magnitude;
    }
  }
}

function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  let dotProduct = 0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
  }
  return dotProduct;
}

interface CacheStore<T> {
  get(key: string): CacheEntry<T> | undefined;
  set(key: string, value: CacheEntry<T>): void;
  delete(key: string): boolean;
  keys(): string[];
  clear(): void;
}

class InMemoryCache<T> implements CacheStore<T> {
  private store = new Map<string, CacheEntry<T>>();

  get(key: string): CacheEntry<T> | undefined {
    return this.store.get(key);
  }

  set(key: string, value: CacheEntry<T>): void {
    if (this.store.size >= DEFAULT_CONFIG.maxCacheSize) {
      const oldestKey = this.findOldestKey();
      if (oldestKey) this.store.delete(oldestKey);
    }
    this.store.set(key, value);
  }

  delete(key: string): boolean {
    return this.store.delete(key);
  }

  keys(): string[] {
    return Array.from(this.store.keys());
  }

  clear(): void {
    this.store.clear();
  }

  private findOldestKey(): string | null {
    let oldestKey: string | null = null;
    let oldestTime = Infinity;
    const entries = Array.from(this.store.entries());
    for (const [key, entry] of entries) {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp;
        oldestKey = key;
      }
    }
    return oldestKey;
  }
}

export class SemanticCache<T> {
  private cache: CacheStore<T>;
  private embeddingFn: EmbeddingFunction;
  private config: SemanticCacheConfig;

  constructor(
    embeddingFn?: EmbeddingFunction,
    config?: Partial<SemanticCacheConfig>
  ) {
    this.cache = new InMemoryCache<T>();
    this.embeddingFn = embeddingFn ?? DEFAULT_EMBEDDING_FN;
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  async get(query: string): Promise<T | null> {
    const cacheKey = `exact:${this.hashQuery(query)}`;
    const exactHit = this.cache.get(cacheKey);

    if (exactHit && this.isValid(exactHit)) {
      exactHit.accessCount++;
      logger.debug({ key: cacheKey, hit: 'exact' }, 'Cache hit (exact)');
      return exactHit.value;
    }

    const queryEmbedding = await this.embeddingFn(query);
    const similarEntry = await this.findSimilarEmbedding(queryEmbedding);

    if (similarEntry) {
      logger.debug({ key: cacheKey, hit: 'similar', similarity: similarEntry.similarity }, 'Cache hit (similar)');
      return similarEntry.entry.value;
    }

    logger.debug({ key: cacheKey }, 'Cache miss');
    return null;
  }

  async set(query: string, value: T, ttl?: number): Promise<void> {
    const cacheKey = `exact:${this.hashQuery(query)}`;
    const queryEmbedding = await this.embeddingFn(query);

    const entry: CacheEntry<T> = {
      key: cacheKey,
      value,
      embedding: queryEmbedding,
      timestamp: Date.now(),
      ttl: ttl ?? this.config.defaultTtl,
      accessCount: 0,
    };

    this.cache.set(cacheKey, entry);
    await this.storeEmbedding(cacheKey, queryEmbedding);
    logger.debug({ key: cacheKey }, 'Cached');
  }

  async invalidate(pattern: string): Promise<number> {
    let count = 0;
    const keys = this.cache.keys();
    const regex = this.patternToRegex(pattern);

    for (const key of keys) {
      if (regex.test(key)) {
        this.cache.delete(key);
        count++;
      }
    }

    logger.info({ pattern, count }, 'Invalidated cache entries');
    return count;
  }

  async clear(): Promise<void> {
    this.cache.clear();
    logger.info('Cache cleared');
  }

  stats(): { size: number; hits: number; misses: number } {
    let totalAccess = 0;
    for (const key of this.cache.keys()) {
      const entry = this.cache.get(key);
      if (entry) totalAccess += entry.accessCount;
    }
    return {
      size: this.cache.keys().length,
      hits: totalAccess,
      misses: 0,
    };
  }

  private hashQuery(query: string): string {
    let hash = 0;
    for (let i = 0; i < query.length; i++) {
      const char = query.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }

  private isValid(entry: CacheEntry<T>): boolean {
    const age = (Date.now() - entry.timestamp) / 1000;
    return age < entry.ttl;
  }

  private async findSimilarEmbedding(
    queryEmbedding: number[]
  ): Promise<{ entry: CacheEntry<T>; similarity: number } | null> {
    const embeddingKeys = this.cache.keys().filter(k => k.startsWith('emb:'));
    
    let bestMatch: { entry: CacheEntry<T>; similarity: number } | null = null;

    for (const embKey of embeddingKeys) {
      const key = embKey.replace('emb:', '');
      const entry = this.cache.get(key);
      if (!entry || !this.isValid(entry)) continue;

      const similarity = cosineSimilarity(queryEmbedding, entry.embedding);
      if (similarity > this.config.similarityThreshold) {
        if (!bestMatch || similarity > bestMatch.similarity) {
          bestMatch = { entry, similarity };
        }
      }
    }

    return bestMatch;
  }

  private async storeEmbedding(key: string, embedding: number[]): Promise<void> {
    const embKey = `emb:${key}`;
    const entry: CacheEntry<T> = {
      key: embKey,
      value: null as unknown as T,
      embedding,
      timestamp: Date.now(),
      ttl: this.config.defaultTtl * 2,
      accessCount: 0,
    };
    this.cache.set(embKey, entry);
  }

  private patternToRegex(pattern: string): RegExp {
    const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(escaped.replace(/\*/g, '.*'));
  }
}

export interface CachedItem<T> {
  key: string;
  value: T;
  embedding: number[];
  timestamp: number;
  ttl: number;
  accessCount: number;
}

export async function semanticCache<T>(
  query: string,
  fn: () => Promise<T>,
  ttl = DEFAULT_CONFIG.defaultTtl,
  cache?: SemanticCache<T>
): Promise<T> {
  const semanticCache = cache ?? new SemanticCache<T>();
  
  const cached = await semanticCache.get(query);
  if (cached !== null) {
    return cached;
  }

  const result = await fn();
  await semanticCache.set(query, result, ttl);
  return result;
}

export const semanticCacheConfig = DEFAULT_CONFIG;

export default SemanticCache;
