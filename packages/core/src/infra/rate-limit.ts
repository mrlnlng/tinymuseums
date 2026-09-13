import { queryOne } from './db.ts'

/* Fixed-window rate limiting in Postgres — one atomic upsert per check, so concurrent requests serialise on the bucket's row lock instead of racing, and nothing new has to be run beside the database. */

export interface RateLimit {
  /** Most hits allowed in one window. */
  limit: number
  windowSeconds: number
}

export interface RateLimitResult {
  allowed: boolean
  /** Seconds until the current window ends — what a Retry-After header wants. */
  retryAfterSeconds: number
}

/** Counts one hit against `bucket` and reports whether it was within the limit.
 *  A hit past the limit still counts, so hammering a closed window does not
 *  reopen it early. */
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

  // The upsert always returns its row; the fallback only satisfies the type.
  const hits = row?.hits ?? limit + 1
  return { allowed: hits <= limit, retryAfterSeconds: row?.retry_after ?? windowSeconds }
}
