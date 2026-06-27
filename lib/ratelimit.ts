// In-memory token bucket. NOTE: per-instance only — on serverless (Vercel) each function
// instance has its own memory, so for real protection use Upstash/Redis. Baseline + honest.
type Bucket = { tokens: number; updated: number };
const buckets = new Map<string, Bucket>();

export function rateLimit(key: string, max = 20, refillPerSec = 1): boolean {
  const now = Date.now();
  const b = buckets.get(key) ?? { tokens: max, updated: now };
  const elapsed = (now - b.updated) / 1000;
  b.tokens = Math.min(max, b.tokens + elapsed * refillPerSec);
  b.updated = now;
  if (b.tokens < 1) {
    buckets.set(key, b);
    return false;
  }
  b.tokens -= 1;
  buckets.set(key, b);
  return true;
}
