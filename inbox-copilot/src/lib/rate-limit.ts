const buckets = new Map<string, { tokens: number; last: number }>();

export function checkRateLimit(key: string, limit = 60, windowMs = 60 * 60 * 1000) {
  const now = Date.now();
  const b = buckets.get(key) ?? { tokens: limit, last: now };
  const refill = Math.floor(((now - b.last) / windowMs) * limit);
  b.tokens = Math.min(limit, b.tokens + Math.max(0, refill));
  b.last = now;
  if (b.tokens <= 0) {
    buckets.set(key, b);
    return false;
  }
  b.tokens -= 1;
  buckets.set(key, b);
  return true;
}


