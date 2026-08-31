import {
  claim,
  complete,
  env,
  fail,
  hasPendingJob,
  requeueStale,
} from '@tiny/core'
import { runJob, scheduleNextSeal } from '@tiny/core/worker'

/* The worker as an Amplify scheduled function: same handlers, but it drains the queue until empty or out of time. The pool is module-scoped because Lambda reuses warm containers. */

/** Leave headroom below the function's configured timeout to finish cleanly. */
const TIME_BUDGET_MS = 105_000

export interface DrainResult {
  processed: number
  failed: number
  drained: boolean
}

/* Keeps the museum's ordering rotating — the schedule lives in the queue itself, so exactly one seal always waiting carries rotation across invocations and cold starts. */
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
