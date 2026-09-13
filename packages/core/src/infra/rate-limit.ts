import { createHmac } from 'node:crypto'
import { queryOne } from './db.ts'
import { env } from './env.ts'

export interface RateLimit {
  limit: number
  windowSeconds: number
}

export interface RateLimitResult {
  allowed: boolean
  retryAfterSeconds: number
}

// One atomic upsert: concurrent requests serialise on the bucket's row lock instead of racing.
export async function hit(bucket: string, { limit, windowSeconds }: RateLimit): Promise<RateLimitResult> {
  const row = await queryOne<{ hits: number; retry_after: number }>(
    `insert into rate_limits as r (bucket, window_start, hits)
     values ($1, now(), 1)
     on conflict (bucket) do update set
       window_start = case when r.window_start <= now() - make_interval(secs => $2)
                           then now() else r.window_start end,
       hits         = case when r.window_start <= now() - make_interval(secs => $2)
                           then 1 else r.hits + 1 end
     returning hits,
               greatest(1, ceil(extract(epoch from
                 r.window_start + make_interval(secs => $2) - now())))::int as retry_after`,
    [bucket, windowSeconds],
  )

  const hits = row?.hits ?? limit + 1
  return { allowed: hits <= limit, retryAfterSeconds: row?.retry_after ?? windowSeconds }
}

// Addresses are stored only as a keyed hash. Without an address there is nothing to limit by.
export async function hitForVisitor(
  scope: string,
  ip: string | null,
  rateLimit: RateLimit,
): Promise<RateLimitResult> {
  if (!ip) return { allowed: true, retryAfterSeconds: 0 }
  const fingerprint = createHmac('sha256', env.sessionSecret).update(ip).digest('base64url').slice(0, 22)
  return hit(`${scope}:ip:${fingerprint}`, rateLimit)
}
