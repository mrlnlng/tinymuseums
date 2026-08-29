import { claim, complete, fail, requeueStale } from '@tiny/core'
import { runJob } from '@tiny/core/worker'

/**
 * The worker, as an Amplify Gen 2 scheduled function.
 *
 * Same handlers as the local loop — only the thing that drives them changes.
 * Instead of polling forever, this drains the queue until it is empty or the
 * time budget runs out, and gets invoked again on a schedule.
 *
 * The database pool is module-scoped on purpose: Lambda reuses a warm
 * container between invocations, so reconnecting per invocation would cost a
 * round trip every time and churn Postgres connections for no reason.
 */

/** Leave headroom below the function's configured timeout to finish cleanly. */
const TIME_BUDGET_MS = 50_000

export interface DrainResult {
  processed: number
  failed: number
  drained: boolean
}

export async function handler(): Promise<DrainResult> {
  const deadline = Date.now() + TIME_BUDGET_MS
  let processed = 0
  let failed = 0

  // Recover anything a previous invocation was killed in the middle of.
  await requeueStale()

  while (Date.now() < deadline) {
    const job = await claim()
    if (!job) {
      return { processed, failed, drained: true }
    }

    try {
      await runJob(job)
      await complete(job.id)
      processed++
    } catch (error) {
      console.error(`[worker] ${job.kind} #${job.id} failed`, error)
      await fail(job.id, job.attempts, error)
      failed++
    }
  }

  // Out of time with work left: the next scheduled run picks up where this
  // one stopped, which is why claims are atomic rather than advisory.
  return { processed, failed, drained: false }
}
