import { query, transaction } from './db.ts'

/**
 * Background work queue.
 *
 * Stands in for SQS. Claims use FOR UPDATE SKIP LOCKED so several workers can
 * run without stepping on each other, and so handlers are written the same way
 * they will be against a real queue: claim, do, acknowledge.
 */

export type JobKind = 'derivatives' | 'render_display' | 'seal_epoch' | 'notify_followers'

export interface Job {
  id: number
  kind: JobKind
  payload: Record<string, unknown>
  attempts: number
}

const MAX_ATTEMPTS = 5

export async function enqueue(
  kind: JobKind,
  payload: Record<string, unknown> = {},
  runAfter?: Date,
): Promise<void> {
  await query(
    `insert into jobs (kind, payload, run_after)
     values ($1, $2::jsonb, coalesce($3, now()))`,
    [kind, JSON.stringify(payload), runAfter ?? null],
  )
}

/** Claims one due job, or null when there is nothing to do. */
export async function claim(): Promise<Job | null> {
  return transaction(async (client) => {
    const { rows } = await client.query<Job>(
      `select id, kind, payload, attempts
         from jobs
        where status = 'pending' and run_after <= now()
        order by id
        for update skip locked
        limit 1`,
    )
    const job = rows[0]
    if (!job) return null

    await client.query(
      `update jobs
          set status = 'running', locked_at = now(), attempts = attempts + 1
        where id = $1`,
      [job.id],
    )
    return job
  })
}

export async function complete(id: number): Promise<void> {
  await query(`update jobs set status = 'done', locked_at = null where id = $1`, [id])
}

/**
 * Fails a job with exponential backoff, giving up after MAX_ATTEMPTS so a
 * permanently broken payload cannot spin forever.
 */
export async function fail(id: number, attempts: number, error: unknown): Promise<void> {
  const message = error instanceof Error ? error.message : String(error)
  const exhausted = attempts >= MAX_ATTEMPTS
  const backoffSeconds = Math.min(300, 2 ** attempts * 5)

  await query(
    `update jobs
        set status = $2,
            last_error = $3,
            locked_at = null,
            run_after = now() + ($4 || ' seconds')::interval
      where id = $1`,
    [id, exhausted ? 'failed' : 'pending', message, String(backoffSeconds)],
  )
}

/**
 * True when a job of this kind is already waiting or being worked on.
 *
 * The long-running worker keeps the epoch rotation going with a timer it sets
 * at startup. A scheduled Lambda has no such continuity — it wakes, drains,
 * and forgets — so it keeps the schedule in the queue instead, and needs to
 * know whether one is already there before adding another.
 */
export async function hasPendingJob(kind: JobKind): Promise<boolean> {
  const rows = await query<{ id: number }>(
    `select id from jobs where kind = $1 and status in ('pending', 'running') limit 1`,
    [kind],
  )
  return rows.length > 0
}

/**
 * Recovers jobs whose worker died mid-run.
 *
 * The threshold must comfortably exceed the function's timeout: an invocation
 * killed mid-job leaves the claim `running` and locked for as long as the
 * timeout, and recovering it any sooner risks double-processing a live job.
 */
export async function requeueStale(olderThanMinutes = 3): Promise<number> {
  const rows = await query<{ id: number }>(
    `update jobs
        set status = 'pending', locked_at = null
      where status = 'running'
        and locked_at < now() - ($1 || ' minutes')::interval
      returning id`,
    [String(olderThanMinutes)],
  )
  return rows.length
}
