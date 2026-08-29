import { claim, complete, closePool, env, fail, requeueStale } from '@tiny/core'
import { runJob, scheduleNextSeal } from '@tiny/core/worker'

/**
 * The worker loop.
 *
 * Polls the jobs table, claims one at a time, and dispatches. Deliberately
 * boring: the interesting logic lives in the handlers, so replacing this loop
 * with an SQS consumer later is a change to this file only.
 */

const IDLE_DELAY_MS = 750
const STALE_SWEEP_MS = 60_000

let running = true

async function sweepStale(): Promise<void> {
  try {
    const recovered = await requeueStale()
    if (recovered > 0) console.log(`[worker] requeued ${recovered} stale job(s)`)
  } catch (error) {
    console.error('[worker] stale sweep failed', error)
  }
}

async function loop(): Promise<void> {
  while (running) {
    let job
    try {
      job = await claim()
    } catch (error) {
      console.error('[worker] could not claim a job', error)
      await sleep(2000)
      continue
    }

    if (!job) {
      await sleep(IDLE_DELAY_MS)
      continue
    }

    const started = Date.now()
    try {
      await runJob(job)
      await complete(job.id)
      console.log(`[worker] ${job.kind} #${job.id} in ${Date.now() - started}ms`)
    } catch (error) {
      console.error(`[worker] ${job.kind} #${job.id} failed`, error)
      await fail(job.id, job.attempts, error)
    }
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function shutdown(): Promise<void> {
  if (!running) return
  running = false
  console.log('\n[worker] stopping')
  await closePool()
  process.exit(0)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)

console.log('[worker] started')

// Keep the museum's ordering rotating without anything having to ask.
await scheduleNextSeal(env.epochIntervalMinutes)
setInterval(() => void scheduleNextSeal(env.epochIntervalMinutes), env.epochIntervalMinutes * 60_000)
setInterval(() => void sweepStale(), STALE_SWEEP_MS)

await loop()
