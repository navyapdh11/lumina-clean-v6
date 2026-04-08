import { describe, it, expect, beforeEach } from 'vitest';
import { SemanticCache, semanticCache, type CacheEntry } from '../lib/semantic-cache';

describe('semantic-cache', () => {
  let cache: SemanticCache<string>;

  beforeEach(() => {
    cache = new SemanticCache<string>();
  });

  describe('SemanticCache', () => {
    it('should store and retrieve values', async () => {
      await cache.set('test-key', 'test-value');
      const result = await cache.get('test-key');
      
      expect(result).toBe('test-value');
    });

    it('should return null for non-existent key', async () => {
      const result = await cache.get('non-existent');
      expect(result).toBeNull();
    });

    it('should track access count', async () => {
      await cache.set('test-key', 'test-value');
      await cache.get('test-key');
      await cache.get('test-key');
      
      const stats = cache.stats();
      expect(stats.hits).toBeGreaterThan(0);
    });

    it('should clear all entries', async () => {
      await cache.set('key1', 'value1');
      await cache.set('key2', 'value2');
      
      await cache.clear();
      
      const stats = cache.stats();
      expect(stats.size).toBe(0);
    });

    it('should invalidate by pattern', async () => {
      await cache.set('api:users', 'value1');
      await cache.set('api:posts', 'value2');
      await cache.set('other:key', 'value3');
      
      const count = await cache.invalidate('api:*');
      
      expect(count).toBe(2);
    });

    it('should respect TTL', async () => {
      await cache.set('test-key', 'test-value', 1);
      
      await new Promise(resolve => setTimeout(resolve, 1100));
      
      const result = await cache.get('test-key');
      expect(result).toBeNull();
    });
  });

  describe('semanticCache helper', () => {
    it('should return cached value if exists', async () => {
      const computeFn = vi.fn().mockResolvedValue('computed');
      
      const result1 = await semanticCache('query', computeFn, 3600, cache);
      const result2 = await semanticCache('query', computeFn, 3600, cache);
      
      expect(result1).toBe('computed');
      expect(result2).toBe('computed');
      expect(computeFn).toHaveBeenCalledTimes(1);
    });

    it('should compute and cache on miss', async () => {
      const computeFn = vi.fn().mockResolvedValue('new-value');
      
      const result = await semanticCache('new-query', computeFn, 3600, cache);
      
      expect(result).toBe('new-value');
      expect(computeFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('stats', () => {
    it('should return cache statistics', async () => {
      await cache.set('key1', 'value1');
      await cache.set('key2', 'value2');
      await cache.get('key1');
      await cache.get('missing-key');
      
      const stats = cache.stats();
      
      expect(stats.size).toBe(2);
      expect(stats.hits).toBeGreaterThan(0);
    });
  });
});
