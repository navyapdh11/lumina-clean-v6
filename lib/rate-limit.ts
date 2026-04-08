import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Rate limiting middleware for API routes
// Usage: import { withRateLimit } from '@/lib/rate-limit';

let ratelimit: Ratelimit | null = null;

function getRatelimit() {
  if (ratelimit) return ratelimit;

  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    console.warn('[Rate Limit] Upstash not configured — rate limiting disabled');
    return null;
  }

  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  // 10 requests per 10 seconds for public APIs
  ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '10 s'),
    analytics: true,
    prefix: 'lumina_ratelimit',
  });

  return ratelimit;
}

export async function checkRateLimit(options: { identifier: string; limit?: number }): Promise<{ success: boolean; remaining: number; reset: number }> {
  const rl = getRatelimit();
  if (!rl) return { success: true, remaining: 999, reset: 0 };

  const result = await rl.limit(options.identifier);
  return {
    success: result.success,
    remaining: result.remaining,
    reset: result.reset,
  };
}

export function getRateLimitHeaders(remaining: number, reset: number): Headers {
  const headers = new Headers();
  headers.set('X-RateLimit-Limit', '10');
  headers.set('X-RateLimit-Remaining', String(remaining));
  headers.set('X-RateLimit-Reset', String(reset));
  return headers;
}
