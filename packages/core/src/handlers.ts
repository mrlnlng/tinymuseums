import { query, queryOne } from './infra/db.ts'
import { FRAME_FORMAT, FRAME_VERSION, renderSinglePieceFrame } from './media/collage.ts'
import { sealEpoch } from './domain/epoch.ts'
import { ImageRejected, generateDerivatives } from './media/images.ts'
import { enqueue, type Job } from './infra/jobs.ts'
import { getMailer, newWorkNotice } from './infra/mail.ts'
import { SKETCH_VERSION, renderSketch } from './media/sketch.ts'
import { frameAvifKey, pieceFrameKey, pieceSketchKey, getStorage, type Storage } from './media/storage.ts'
import { confirmedFollowers } from './domain/audience.ts'
import { MAX_STANDS } from './domain/gallery.ts'
import type { Derivative } from './types.ts'

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
    await enqueue('render_display', { artistId: asset.artist_id })
  } catch (error) {
    if (!(error instanceof ImageRejected)) throw error
    await query(`update assets set status = 'failed', error = $2 where id = $1`, [
      asset.id,
      error.message,
    ])
  }
}

interface DisplayPieceRow {
  piece_id: string
  width: number
  height: number
  derivatives: Derivative[] | null
  flattened_key: string | null
  flattened_version: number
  sketch_key: string | null
  sketch_version: number
}

export async function handleRenderDisplay(artistId: string): Promise<void> {
  const rows = await query<DisplayPieceRow>(
    `select p.id as piece_id, a.width, a.height, a.derivatives,
            p.flattened_key, p.flattened_version,
            p.sketch_key, p.sketch_version
       from pieces p
       join assets a on a.id = p.asset_id
      where p.artist_id = $1
        and p.order_index between 1 and $2
        and a.status = 'ready'`,
    [artistId, MAX_STANDS],
  )
  if (rows.length === 0) return

  const storage = getStorage()

  for (const row of rows) {
    await renderPieceFrame(row, storage)
    await renderPieceSketch(row, storage)
  }
}

async function renderPieceFrame(row: DisplayPieceRow, storage: Storage): Promise<void> {
  if (row.flattened_key && row.flattened_version === FRAME_VERSION) return

  const aspect = row.width > 0 && row.height > 0 ? row.width / row.height : 0.7
  const output = await renderSinglePieceFrame({
    aspect,
    derivatives: row.derivatives ?? [],
    storage,
  })
  const key = pieceFrameKey(row.piece_id, FRAME_VERSION, FRAME_FORMAT.extension)
  await storage.put(key, output.buffer, FRAME_FORMAT.contentType)
  await storage.put(frameAvifKey(key), output.avif, 'image/avif')
  // Point the row at the new object before removing the old one: an orphaned file is harmless, a dangling key is not.
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
  if (stale && stale !== key) {
    await storage.remove(stale).catch(() => {})
    await storage.remove(frameAvifKey(stale)).catch(() => {})
  }
}

async function renderPieceSketch(row: DisplayPieceRow, storage: Storage): Promise<void> {
  if (row.sketch_key && row.sketch_version === SKETCH_VERSION) return

  const output = await renderSketch(row.derivatives ?? [], storage)
  if (!output) return

  const key = pieceSketchKey(row.piece_id, SKETCH_VERSION)
  await storage.put(key, output.buffer, 'image/png')
  await query(
    `update pieces
        set sketch_key = $2,
            sketch_width = $3,
            sketch_height = $4,
            sketch_version = $5
      where id = $1`,
    [row.piece_id, key, output.width, output.height, SKETCH_VERSION],
  )
  if (row.sketch_key && row.sketch_key !== key) await storage.remove(row.sketch_key).catch(() => {})
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

export async function scheduleNextSeal(intervalMinutes: number): Promise<void> {
  const runAfter = new Date(Date.now() + intervalMinutes * 60 * 1000)
  await enqueue('seal_epoch', { reason: 'scheduled' }, runAfter)
}

export async function repairUnframed(): Promise<number> {
  const rows = await query<{ artist_id: string }>(
    `select distinct p.artist_id
       from pieces p
       join assets a on a.id = p.asset_id
      where p.order_index between 1 and $1
        and (p.flattened_key is null or p.flattened_version <> $2
             or p.sketch_key is null or p.sketch_version <> $3)
        and a.status = 'ready'`,
    [MAX_STANDS, FRAME_VERSION, SKETCH_VERSION],
  )
  for (const row of rows) await enqueue('render_display', { artistId: row.artist_id })
  return rows.length
}
