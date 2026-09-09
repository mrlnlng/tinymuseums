import {
  claim,
  complete,
  env,
  fail,
  hasPendingJob,
  requeueStale,
} from '@tiny/core'
import { repairUnframed, runJob, scheduleNextSeal } from '@tiny/core/worker'

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

/*  Brings work hung under an older frame recipe onto the current one. The
    long-running worker has always done this on a timer; this function is the
    same thing on the only clock a scheduled function has, which is its own
    invocation — and without it the deployment simply never ran the repair at
    all. A change to the recipe therefore reached new uploads and nothing else,
    and the hall went on serving frames rendered by whatever recipe happened to
    be deployed the last time each artist published.

    Skipped while any render is already queued or running, the same guard
    `keepRotating` uses above. `repairUnframed` enqueues one job per artist with
    stale work and `enqueue` does not deduplicate, so without this the catch-up
    would add another round of jobs on every invocation while the first round
    was still being worked through. The renders themselves are already
    idempotent — a piece on the current recipe is skipped — so the cost would be
    wasted queue rather than wasted rendering, but there is no reason to pay it.
    Anything missed comes back on the next invocation. */
async function repairFrames(): Promise<void> {
  if (await hasPendingJob('render_display')) return
  const artists = await repairUnframed()
  if (artists > 0) {
    console.log(`[worker] requeued frame rendering for ${artists} artist(s)`)
  }
}

export async function handler(): Promise<DrainResult> {
  const deadline = Date.now() + TIME_BUDGET_MS
  let processed = 0
  let failed = 0

  // Recover anything a previous invocation was killed in the middle of.
  await requeueStale()
  await keepRotating()
  // Before the drain, not after: what it enqueues is then worked through by
  // this invocation rather than waiting for the next one.
  await repairFrames()

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
