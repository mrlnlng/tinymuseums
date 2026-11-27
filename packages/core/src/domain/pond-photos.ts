import { randomUUID } from 'node:crypto'
import { query, transaction } from '../infra/db.ts'
import { getStorage } from '../media/storage.ts'
import { pondKeepsakeItem } from '../economy/pond.ts'

export const POND_PHOTO_LIMIT = 24
export const POND_PHOTO_MAX_BYTES = 1_500_000

export interface PondPhoto {
  id: string
  url: string
  at: string
}

export type AddPondPhotoResult =
  | { ok: true; photo: PondPhoto }
  | { ok: false; error: 'no_camera' | 'invalid' | 'too_large' | 'album_full' }

function isJpeg(body: Buffer): boolean {
  return body.length > 3 && body[0] === 0xff && body[1] === 0xd8 && body[2] === 0xff
}

function view(row: { id: string; key: string; at: Date }): PondPhoto {
  return { id: row.id, url: getStorage().urlFor(row.key), at: row.at.toISOString() }
}

export async function listPondPhotos(memberId: string): Promise<PondPhoto[]> {
  const rows = await query<{ id: string; key: string; at: Date }>(
    `select id, key, at from pond_photos where member_id = $1 order by at desc`,
    [memberId],
  )
  return rows.map(view)
}

export async function addPondPhoto(memberId: string, body: Buffer): Promise<AddPondPhotoResult> {
  if (body.length > POND_PHOTO_MAX_BYTES) return { ok: false, error: 'too_large' }
  if (!isJpeg(body)) return { ok: false, error: 'invalid' }

  const key = `members/${memberId}/photos/${randomUUID()}.jpg`
  const storage = getStorage()
  await storage.put(key, body, 'image/jpeg')
  try {
    const result = await transaction(async (client): Promise<AddPondPhotoResult> => {
      await client.query(`select pg_advisory_xact_lock(hashtext($1))`, [`pond-photos:${memberId}`])
      const camera = await client.query(`select 1 from wallet_items where member_id = $1 and item_id = $2`, [
        memberId,
        pondKeepsakeItem('camera'),
      ])
      if (camera.rows.length === 0) return { ok: false, error: 'no_camera' }
      const count = await client.query<{ n: number }>(`select count(*)::int as n from pond_photos where member_id = $1`, [memberId])
      if (count.rows[0].n >= POND_PHOTO_LIMIT) return { ok: false, error: 'album_full' }
      const inserted = await client.query<{ id: string; key: string; at: Date }>(
        `insert into pond_photos (member_id, key) values ($1, $2) returning id, key, at`,
        [memberId, key],
      )
      return { ok: true, photo: view(inserted.rows[0]) }
    })
    if (!result.ok) await storage.remove(key)
    return result
  } catch (error) {
    await storage.remove(key).catch(() => {})
    throw error
  }
}

export async function deletePondPhoto(memberId: string, photoId: string): Promise<boolean> {
  const rows = await query<{ key: string }>(
    `delete from pond_photos where id = $1 and member_id = $2 returning key`,
    [photoId, memberId],
  )
  if (rows.length === 0) return false
  await getStorage().remove(rows[0].key)
  return true
}

/** The member row's cascade drops the records; this clears the files they pointed at. */
export async function removePondPhotoFiles(memberId: string): Promise<void> {
  const rows = await query<{ key: string }>(`select key from pond_photos where member_id = $1`, [memberId])
  const storage = getStorage()
  await Promise.all(rows.map((row) => storage.remove(row.key).catch(() => {})))
}
