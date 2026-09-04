import { query, queryOne } from './infra/db.ts'
import { FRAME_FORMAT, FRAME_VERSION, renderSinglePieceFrame } from './media/collage.ts'
import { sealEpoch } from './domain/epoch.ts'
import { ImageRejected, generateDerivatives } from './media/images.ts'
import { enqueue, type Job } from './infra/jobs.ts'
import { getMailer, newWorkNotice } from './infra/mail.ts'
import { pieceFrameKey, getStorage } from './media/storage.ts'
import { confirmedFollowers } from './domain/audience.ts'
import { MAX_STANDS } from './domain/gallery.ts'
import type { Derivative } from './types.ts'

/* Job handlers live in core so the seed script runs the same pipeline inline, and an SQS consumer changes only how a handler is invoked. */

export async function handleDerivatives(assetId: string): Promise<void> {
  const asset = await queryOne<{ id: string; artist_id: string; storage_key: string }>(
    `select id, artist_id, storage_key from assets where id = $1`,
    [assetId],
  )
  if (!asset) return

  const storage = getStorage()
  const original = await storage.get(asset.storage_key)

  try {
    const result = await generateDerivatives(original, asset.artist_id, asset.id, storage)
    await query(
      `update assets
          set status = 'ready', width = $2, height = $3, derivatives = $4::jsonb, error = null
        where id = $1`,
      [asset.id, result.width, result.height, JSON.stringify(result.derivatives)],
    )
    // The work may already be arranged (auto-hang on upload): frame it now
    // that the image is ready. The handler no-ops for pieces without a stand.
    await enqueue('render_display', { artistId: asset.artist_id })
  } catch (error) {
    if (!(error instanceof ImageRejected)) throw error
    // A rejected image is the artist's problem to fix, not a job to retry.
    await query(`update assets set status = 'failed', error = $2 where id = $1`, [
      asset.id,
      error.message,
    ])
  }
}

export async function handleRenderDisplay(artistId: string): Promise<void> {
  const rows = await query<{
    piece_id: string
    width: number
    height: number
    derivatives: Derivative[] | null
    flattened_key: string | null
    flattened_version: number
  }>(
    `select p.id as piece_id, a.width, a.height, a.derivatives,
            p.flattened_key, p.flattened_version
       from pieces p
       join assets a on a.id = p.asset_id
      where p.artist_id = $1
        and p.order_index between 1 and $2
        and a.status = 'ready'`,
    [artistId, MAX_STANDS],
  )
  if (rows.length === 0) return

  const storage = getStorage()

  // Each arranged work gets its own framed image for the hall, sized to the
  // work's own orientation so a landscape painting gets a landscape frame.
  // A frame is immutable for a given recipe, so a piece already rendered under
  // the current one is skipped — but a piece rendered under an older recipe is
  // rendered again, which is how a change to the frame reaches work that was
  // hung before it.
  for (const row of rows) {
    if (row.flattened_key && row.flattened_version === FRAME_VERSION) continue

    const aspect = row.width > 0 && row.height > 0 ? row.width / row.height : 0.7
    const output = await renderSinglePieceFrame({
      aspect,
      derivatives: row.derivatives ?? [],
      storage,
    })
    const key = pieceFrameKey(row.piece_id, FRAME_VERSION, FRAME_FORMAT.extension)
    await storage.put(key, output.buffer, FRAME_FORMAT.contentType)
    const stale = row.flattened_key
    await query(
      `update pieces
          set flattened_key = $2,
              flattened_width = $3,
              flattened_height = $4,
              flattened_version = $5
        where id = $1`,
      [row.piece_id, key, output.width, output.height, FRAME_VERSION],
    )
    // Only once the row points at the new object: an orphaned file is cheap,
    // a row pointing at a file that is gone hangs a blank wall.
    if (stale && stale !== key) await storage.remove(stale).catch(() => {})
  }
}

export async function handleSealEpoch(): Promise<void> {
  const epoch = await sealEpoch()
  if (epoch) {
    console.log(`[worker] sealed epoch ${epoch.id} over ${epoch.display_count} displays`)
  }
}

export async function handleNotifyFollowers(artistId: string): Promise<void> {
  const artist = await queryOne<{ display_name: string; slug: string }>(
    `select display_name, slug from artists where id = $1 and status = 'live'`,
    [artistId],
  )
  if (!artist) return

  const followers = await confirmedFollowers(artistId)
  const mailer = getMailer()

  for (const follower of followers) {
    const message = newWorkNotice(artist.display_name, artist.slug, follower.unsubscribe_token)
    await mailer.send({ to: follower.email, ...message })
  }
}

/** Dispatches a claimed job to its handler. */
export async function runJob(job: Job): Promise<void> {
  const payload = job.payload as { assetId?: string; artistId?: string }

  switch (job.kind) {
    case 'derivatives':
      if (payload.assetId) await handleDerivatives(payload.assetId)
      return
    case 'render_display':
      if (payload.artistId) await handleRenderDisplay(payload.artistId)
      return
    case 'seal_epoch':
      await handleSealEpoch()
      return
    case 'notify_followers':
      if (payload.artistId) await handleNotifyFollowers(payload.artistId)
      return
    default:
      throw new Error(`Unknown job kind: ${job.kind}`)
  }
}

/** Schedules the next epoch seal, so ordering keeps rotating on its own. */
export async function scheduleNextSeal(intervalMinutes: number): Promise<void> {
  const runAfter = new Date(Date.now() + intervalMinutes * 60 * 1000)
  await enqueue('seal_epoch', { reason: 'scheduled' }, runAfter)
}

/** Requeues frame rendering for any arranged work still missing its frame, or
 *  holding one from an older recipe — the first covers a piece whose image
 *  finished during a transition or a worker gap, the second is how a change to
 *  the frame itself reaches a hall that is already hanging. Deploying a new
 *  recipe therefore needs nothing run by hand: the worker notices within the
 *  repair interval and re-renders the museum a wall at a time.
 *  Idempotent: the render handler skips works already on the current recipe. */
export async function repairUnframed(): Promise<number> {
  const rows = await query<{ artist_id: string }>(
    `select distinct p.artist_id
       from pieces p
       join assets a on a.id = p.asset_id
      where p.order_index between 1 and $1
        and (p.flattened_key is null or p.flattened_version <> $2)
        and a.status = 'ready'`,
    [MAX_STANDS, FRAME_VERSION],
  )
  for (const row of rows) await enqueue('render_display', { artistId: row.artist_id })
  return rows.length
}
