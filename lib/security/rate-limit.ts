type Entry = { count: number; expiresAt: number };

const attempts = new Map<string, Entry>();
const WINDOW_MS = 60_000;
const MAX_ATTEMPTS = 10;

export function enforceLoginRateLimit(key: string): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  const current = attempts.get(key);

  if (!current || current.expiresAt < now) {
    attempts.set(key, { count: 1, expiresAt: now + WINDOW_MS });
    return { ok: true, retryAfter: 0 };
  }

  if (current.count >= MAX_ATTEMPTS) {
    return { ok: false, retryAfter: Math.max(0, current.expiresAt - now) };
  }

  current.count += 1;
  attempts.set(key, current);
  return { ok: true, retryAfter: 0 };
}
