import { claim, complete, fail, purgeRateLimits, requeueStale } from '@tiny/core'
import { repairUnframed, runJob } from '@tiny/core/worker'

const TIME_BUDGET_MS = 105_000

export interface DrainResult {
  processed: number
  failed: number
  drained: boolean
}

async function repairFrames(): Promise<void> {
  const artists = await repairUnframed()
  if (artists > 0) {
    console.log(`[worker] requeued frame rendering for ${artists} artist(s)`)
  }
}

export async function handler(): Promise<DrainResult> {
  const deadline = Date.now() + TIME_BUDGET_MS
  let processed = 0
  let failed = 0

  await requeueStale()
  await purgeRateLimits().catch((error) => console.error('[worker] rate limit purge failed', error))
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

  return { processed, failed, drained: false }
}
