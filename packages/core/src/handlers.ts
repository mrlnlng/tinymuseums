import { query, queryOne } from './db.ts'
import { renderDisplayCollage, renderSinglePieceFrame } from './collage.ts'
import { sealEpoch } from './epoch.ts'
import { ImageRejected, generateDerivatives } from './images.ts'
import { enqueue, type Job } from './jobs.ts'
import { getMailer, newWorkNotice } from './mail.ts'
import { collageKey, pieceFrameKey, getStorage } from './storage.ts'
import { confirmedFollowers } from './audience.ts'
import type { Derivative, LayoutName, Placement } from './types.ts'

/**
 * Job handlers.
 *
 * These live in core rather than in the worker app so the seed script can run
 * the same pipeline inline, and so swapping the polling loop for an SQS
 * consumer changes only how a handler is invoked, never what it does.
 */

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
  const display = await queryOne<{
    layout: LayoutName
    hung_piece_ids: string[]
    composition: Placement[]
    version: number
  }>(
    `select layout, hung_piece_ids, composition, version from displays where artist_id = $1`,
    [artistId],
  )
  if (!display || display.composition.length === 0) return

  const rows = await query<{
    piece_id: string
    width: number
    height: number
    derivatives: Derivative[] | null
  }>(
    `select p.id as piece_id, a.width, a.height, a.derivatives
       from pieces p
       join assets a on a.id = p.asset_id
      where p.id = any($1::uuid[]) and a.status = 'ready'`,
    [display.hung_piece_ids],
  )

  const derivativesByPiece = new Map<string, Derivative[]>()
  for (const row of rows) derivativesByPiece.set(row.piece_id, row.derivatives ?? [])

  const storage = getStorage()

  // Each hanging work gets its own framed image for the hall, sized to the
  // work's own orientation so a landscape painting gets a landscape frame.
  const version = display.version
  for (const row of rows) {
    const aspect = row.width > 0 && row.height > 0 ? row.width / row.height : 0.7
    const output = await renderSinglePieceFrame({
      aspect,
      derivatives: derivativesByPiece.get(row.piece_id) ?? [],
      storage,
    })
    const key = pieceFrameKey(row.piece_id, version)
    await storage.put(key, output.buffer, 'image/png')
    await query(
      `update pieces
          set flattened_key = $2,
              flattened_width = $3,
              flattened_height = $4,
              flattened_version = $5
        where id = $1`,
      [row.piece_id, key, output.width, output.height, version],
    )
  }

  // The collage is still produced for the artist page and the studio preview.
  const output = await renderDisplayCollage({
    layout: display.layout,
    composition: display.composition,
    derivativesByPiece,
    storage,
  })

  // Versioned key: a republish writes a new immutable object rather than
  // mutating one a CDN may already be serving.
  const key = collageKey(artistId, display.version)
  await storage.put(key, output.buffer, 'image/png')

  await query(
    `update displays
        set flattened_key = $2,
            flattened_width = $3,
            flattened_height = $4,
            region_map = $5::jsonb,
            rendered_at = now()
      where artist_id = $1`,
    [artistId, key, output.width, output.height, JSON.stringify(output.regionMap)],
  )
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
