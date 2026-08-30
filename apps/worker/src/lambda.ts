import {
  claim,
  complete,
  env,
  fail,
  hasPendingJob,
  requeueStale,
} from '@tiny/core'
import { runJob, scheduleNextSeal } from '@tiny/core/worker'

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

/**
 * Keeps the museum's ordering rotating.
 *
 * The long-running worker does this with a timer it sets at startup. A
 * scheduled function has no such continuity, so the schedule lives in the
 * queue itself: as long as exactly one seal is always waiting, the rotation
 * carries on across invocations, deploys and cold starts alike.
 */
async function keepRotating(): Promise<void> {
  if (await hasPendingJob('seal_epoch')) return
  await scheduleNextSeal(env.epochIntervalMinutes)
}

export async function handler(): Promise<DrainResult> {
  const deadline = Date.now() + TIME_BUDGET_MS
  let processed = 0
  let failed = 0

  // Recover anything a previous invocation was killed in the middle of.
  await requeueStale()
  await keepRotating()

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
