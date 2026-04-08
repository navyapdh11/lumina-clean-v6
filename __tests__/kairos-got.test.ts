import { describe, it, expect, beforeEach } from 'vitest';
import {
  initializeState,
  runKairosGoTTickLoop,
  serializeState,
  deserializeState,
  getGraphSnapshot,
  type KairosGoTState,
  type ThoughtNode
} from '../lib/kairos-got';

describe('kairos-got', () => {
  describe('initializeState', () => {
    it('should create state with default values', () => {
      const state = initializeState('test-session');
      
      expect(state.sessionId).toBe('test-session');
      expect(state.graph.nodes.size).toBe(0);
      expect(state.graph.edges.size).toBe(0);
      expect(state.activeThoughts).toEqual([]);
      expect(state.lastConsolidatedAt).toBe(0);
      expect(state.tickCount).toBe(0);
    });
  });

  describe('serializeState / deserializeState', () => {
    it('should serialize and deserialize state correctly', () => {
      const original = initializeState('test');
      original.tickCount = 5;
      original.lastConsolidatedAt = Date.now();
      
      const serialized = serializeState(original);
      const deserialized = deserializeState(serialized as unknown as Record<string, unknown>);
      
      expect(deserialized.sessionId).toBe(original.sessionId);
      expect(deserialized.tickCount).toBe(original.tickCount);
    });
  });

  describe('runKairosGoTTickLoop', () => {
    it('should increment tick count', async () => {
      const state = initializeState('test');
      const initialTickCount = state.tickCount;
      
      await runKairosGoTTickLoop(state);
      
      expect(state.tickCount).toBe(initialTickCount + 1);
    });

    it('should add observation and reasoning thoughts', async () => {
      const state = initializeState('test');
      
      await runKairosGoTTickLoop(state);
      
      const snapshot = getGraphSnapshot(state);
      expect(snapshot.length).toBeGreaterThan(0);
      
      const types = snapshot.map(t => t.type);
      expect(types).toContain('observation');
    });

    it('should track active thoughts', async () => {
      const state = initializeState('test');
      
      await runKairosGoTTickLoop(state);
      await runKairosGoTTickLoop(state);
      
      expect(state.activeThoughts.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('getGraphSnapshot', () => {
    it('should return empty array for fresh state', () => {
      const state = initializeState('test');
      const snapshot = getGraphSnapshot(state);
      
      expect(snapshot).toEqual([]);
    });

    it('should return all thoughts after ticks', async () => {
      const state = initializeState('test');
      await runKairosGoTTickLoop(state);
      
      const snapshot = getGraphSnapshot(state);
      expect(snapshot.length).toBeGreaterThan(0);
    });
  });
});
