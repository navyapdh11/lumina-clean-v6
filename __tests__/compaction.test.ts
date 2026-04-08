import { describe, it, expect, beforeEach } from 'vitest';
import { 
  estimateTokens, 
  needsCompaction, 
  calculateImportance, 
  findCompactBoundary,
  type Message,
  type SessionState 
} from '../lib/compaction';

describe('compaction', () => {
  const createMessage = (overrides: Partial<Message> = {}): Message => ({
    id: 'msg-1',
    role: 'user',
    content: 'Test message content',
    timestamp: Date.now(),
    ...overrides,
  });

  const createSession = (messages: Message[] = []): SessionState => ({
    messages,
    memoryIndex: 0,
    sessionId: 'test-session',
    lastCompactedAt: 0,
    compactionHistory: [],
  });

  describe('estimateTokens', () => {
    it('should estimate tokens for empty messages', () => {
      const result = estimateTokens([]);
      expect(result.total).toBe(0);
      expect(result.weighted).toBe(0);
    });

    it('should apply token multipliers by role', () => {
      const messages = [
        createMessage({ role: 'system', content: 'System prompt' }),
        createMessage({ role: 'user', content: 'User message' }),
        createMessage({ role: 'assistant', content: 'Assistant response' }),
      ];
      
      const result = estimateTokens(messages);
      
      expect(result.byRole.system).toBeGreaterThan(result.byRole.user);
      expect(result.byRole.assistant).toBeGreaterThan(result.byRole.user);
    });

    it('should include memory overhead', () => {
      const messages = [createMessage(), createMessage()];
      const result = estimateTokens(messages);
      
      expect(result.total).toBeGreaterThan(messages.length * 10);
    });
  });

  describe('needsCompaction', () => {
    it('should return false when under threshold', () => {
      const state = createSession([
        createMessage({ content: 'Short message' }),
      ]);
      expect(needsCompaction(state)).toBe(false);
    });

    it('should return true when over threshold', () => {
      const longContent = 'A'.repeat(50000);
      const state = createSession([
        createMessage({ content: longContent }),
        createMessage({ content: longContent }),
        createMessage({ content: longContent }),
      ]);
      expect(needsCompaction(state)).toBe(true);
    });
  });

  describe('calculateImportance', () => {
    it('should assign highest importance to system messages', () => {
      const msg = createMessage({ role: 'system', content: 'Important system prompt' });
      expect(calculateImportance(msg)).toBe(1.0);
    });

    it('should assign high importance to user messages', () => {
      const msg = createMessage({ role: 'user', content: 'User request' });
      expect(calculateImportance(msg)).toBeGreaterThanOrEqual(0.7);
    });

    it('should boost importance for critical keywords', () => {
      const msg = createMessage({ content: 'This is critical and important' });
      expect(calculateImportance(msg)).toBeGreaterThan(0.5);
    });

    it('should penalize verbose/debug content', () => {
      const msg = createMessage({ content: 'Debug log trace verbose test temp tmp' });
      expect(calculateImportance(msg)).toBeLessThan(0.5);
    });

    it('should use explicit importanceScore when provided', () => {
      const msg = createMessage({ importanceScore: 0.95 });
      expect(calculateImportance(msg)).toBe(0.95);
    });
  });

  describe('findCompactBoundary', () => {
    it('should return safe boundary for empty messages', () => {
      const result = findCompactBoundary([]);
      expect(result.index).toBe(0);
      expect(result.isSafe).toBe(true);
    });

    it('should preserve critical messages in boundary', () => {
      const messages = [
        createMessage({ role: 'system', content: 'System prompt' }),
        createMessage({ role: 'user', content: 'Old user message' }),
        createMessage({ role: 'user', content: 'Recent message' }),
      ];
      
      const result = findCompactBoundary(messages);
      expect(result.isSafe).toBe(true);
    });
  });
});
