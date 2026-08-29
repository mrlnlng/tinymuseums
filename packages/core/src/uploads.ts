import { queryOne } from './db.ts'
import { enqueue } from './jobs.ts'
import { getStorage, originalKey, type PresignedUpload } from './storage.ts'

/**
 * Accepting an upload, in two steps.
 *
 * The file never passes through the application. The browser asks for a
 * presigned URL, PUTs the bytes straight to storage, and then tells us the key
 * it used. That keeps large uploads off request compute — which serverless
 * payload limits would reject outright — and means validation and the
 * derivative ladder stay where they belong, in the worker.
 */

const ACCEPTED = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
  ['image/avif', 'avif'],
  ['image/tiff', 'tif'],
])

export const MAX_UPLOAD_BYTES = 25 * 1024 * 1024

export class UploadRejected extends Error {}

const DIGEST = /^[0-9a-f]{32,64}$/

/** Step one: hand the browser somewhere to PUT the file. */
export async function presignUpload(
  artistId: string,
  mime: string,
  digest: string,
  bytes: number,
): Promise<PresignedUpload> {
  const extension = ACCEPTED.get(mime)
  if (!extension) throw new UploadRejected(`Unsupported image type: ${mime || 'unknown'}`)
  if (!DIGEST.test(digest)) throw new UploadRejected('Malformed content digest')
  if (!Number.isFinite(bytes) || bytes <= 0) throw new UploadRejected('The file is empty')
  if (bytes > MAX_UPLOAD_BYTES) {
    throw new UploadRejected(
      `File is ${(bytes / 1024 / 1024).toFixed(1)}MB; the limit is ${MAX_UPLOAD_BYTES / 1024 / 1024}MB`,
    )
  }

  const key = originalKey(artistId, digest.slice(0, 32), extension)
  return getStorage().presignPut(key, mime)
}

/**
 * Step two: record the object the browser uploaded.
 *
 * The key is re-derived from the session's artist id rather than trusted from
 * the request, so a client cannot register an object it does not own.
 */
export async function registerUpload(
  artistId: string,
  mime: string,
  digest: string,
): Promise<string> {
  const extension = ACCEPTED.get(mime)
  if (!extension) throw new UploadRejected(`Unsupported image type: ${mime || 'unknown'}`)
  if (!DIGEST.test(digest)) throw new UploadRejected('Malformed content digest')

  const key = originalKey(artistId, digest.slice(0, 32), extension)
  const bytes = await getStorage().sizeOf(key)

  if (bytes === null) throw new UploadRejected('The upload did not arrive; try again')
  if (bytes > MAX_UPLOAD_BYTES) throw new UploadRejected('That file is larger than the limit')

  // The same bytes uploaded twice land on the same key; reuse the asset row.
  const existing = await queryOne<{ id: string }>(
    `select id from assets where artist_id = $1 and storage_key = $2`,
    [artistId, key],
  )
  if (existing) return existing.id

  const row = await queryOne<{ id: string }>(
    `insert into assets (artist_id, storage_key, mime, bytes)
     values ($1, $2, $3, $4)
     returning id`,
    [artistId, key, mime, bytes],
  )
  if (!row) throw new UploadRejected('Could not record the upload')

  await enqueue('derivatives', { assetId: row.id })
  return row.id
}

/**
 * Server-side upload, kept for the seed script only.
 *
 * Real uploads go through presignUpload + registerUpload. Seeding generates
 * its images in-process and has no browser to presign for.
 */
export async function createAssetFromUpload(
  artistId: string,
  mime: string,
  body: Buffer,
): Promise<string> {
  const extension = ACCEPTED.get(mime)
  if (!extension) throw new UploadRejected(`Unsupported image type: ${mime || 'unknown'}`)

  const { digestOf } = await import('./storage.ts')
  const digest = digestOf(body)
  const key = originalKey(artistId, digest, extension)
  await getStorage().put(key, body, mime)

  return registerUpload(artistId, mime, digest)
}
