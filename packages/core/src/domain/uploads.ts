import { queryOne } from '../infra/db.ts'
import { enqueue } from '../infra/jobs.ts'
import { digestOf, getStorage, originalKey, type PresignedUpload } from '../media/storage.ts'

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

export async function createAssetFromUpload(
  artistId: string,
  mime: string,
  body: Buffer,
): Promise<string> {
  const extension = ACCEPTED.get(mime)
  if (!extension) throw new UploadRejected(`Unsupported image type: ${mime || 'unknown'}`)

  const digest = digestOf(body)
  const key = originalKey(artistId, digest, extension)
  await getStorage().put(key, body, mime)

  return registerUpload(artistId, mime, digest)
}
