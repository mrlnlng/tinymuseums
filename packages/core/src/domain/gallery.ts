import { query, queryOne, transaction } from '../infra/db.ts'
import { enqueue } from '../infra/jobs.ts'
import { pickDerivative } from '../media/derivatives.ts'
import { frameAvifKey, getStorage } from '../media/storage.ts'
import type { Derivative } from '../types.ts'

export const MAX_STANDS = 30

export interface GalleryPiece {
  id: string
  title: string
  description: string
  orderIndex: number
  shopUrl: string | null
  status: string | null
  error: string | null
  imageUrl: string | null
  framed: boolean
}

interface GalleryRow {
  id: string
  title: string
  description: string
  order_index: number
  shop_url: string | null
  status: string | null
  error: string | null
  derivatives: Derivative[] | null
  framed: boolean
}

export async function getGallery(
  artistId: string,
): Promise<{ arranged: GalleryPiece[]; storage: GalleryPiece[] }> {
  const rows = await query<GalleryRow>(
    `select p.id, p.title, p.description, p.order_index, p.shop_url,
            a.status, a.error, a.derivatives,
            (p.flattened_key is not null) as framed
       from pieces p
       left join assets a on a.id = p.asset_id
      where p.artist_id = $1
      order by p.order_index, p.created_at`,
    [artistId],
  )

  const toPiece = (row: GalleryRow): GalleryPiece => {
    const small = pickDerivative(row.derivatives ?? [], 0)
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      orderIndex: row.order_index,
      shopUrl: row.shop_url,
      status: row.status,
      error: row.error,
      imageUrl: small ? getStorage().urlFor(small.key) : null,
      framed: row.framed,
    }
  }

  const arranged: GalleryPiece[] = []
  const storage: GalleryPiece[] = []
  for (const row of rows) {
    const piece = toPiece(row)
    if (row.order_index >= 1 && row.order_index <= MAX_STANDS) arranged.push(piece)
    else storage.push(piece)
  }
  return { arranged, storage }
}

export async function movePiece(
  artistId: string,
  pieceId: string,
  direction: 'up' | 'down',
): Promise<void> {
  await transaction(async (client) => {
    const { rows } = await client.query<{ id: string; order_index: number }>(
      `select id, order_index from pieces
        where artist_id = $1 and order_index between 1 and $2
       order by order_index`,
      [artistId, MAX_STANDS],
    )
    const at = rows.findIndex((r) => r.id === pieceId)
    if (at < 0) return
    const target = direction === 'up' ? at - 1 : at + 1
    if (target < 0 || target >= rows.length) return
    const other = rows[target]
    await client.query(`update pieces set order_index = 0 where id = $1`, [pieceId])
    await client.query(`update pieces set order_index = $2 where id = $1`, [other.id, rows[at].order_index])
    await client.query(`update pieces set order_index = $2 where id = $1`, [pieceId, other.order_index])
  })

  await enqueue('seal_epoch', { reason: 'rearranged' })
}

export async function hangPiece(artistId: string, pieceId: string): Promise<boolean> {
  return transaction(async (client) => {
    const piece = await client.query<{ order_index: number }>(
      `select order_index from pieces where id = $1 and artist_id = $2`,
      [pieceId, artistId],
    )
    const current = piece.rows[0]?.order_index
    if (current === undefined) return false
    if (current >= 1 && current <= MAX_STANDS) return true

    const max = await client.query<{ m: number | null }>(
      `select max(order_index) as m from pieces
        where artist_id = $1 and order_index between 1 and $2`,
      [artistId, MAX_STANDS],
    )
    const next = (max.rows[0]?.m ?? 0) + 1
    if (next > MAX_STANDS) return false

    await client.query(`update pieces set order_index = $3 where id = $1 and artist_id = $2`, [
      pieceId,
      artistId,
      next,
    ])
    await enqueue('seal_epoch', { reason: 'rearranged' })
    return true
  })
}

export async function unhangPiece(artistId: string, pieceId: string): Promise<void> {
  await transaction(async (client) => {
    const piece = await client.query<{ order_index: number }>(
      `select order_index from pieces where id = $1 and artist_id = $2`,
      [pieceId, artistId],
    )
    const removed = piece.rows[0]?.order_index
    if (!removed || removed < 1 || removed > MAX_STANDS) return

    await client.query(`update pieces set order_index = 0 where id = $1`, [pieceId])
    await client.query(
      `update pieces set order_index = order_index - 1
        where artist_id = $1 and id <> $2 and order_index > $3`,
      [artistId, pieceId, removed],
    )
    await enqueue('seal_epoch', { reason: 'rearranged' })
  })
}

export async function deletePiece(artistId: string, pieceId: string): Promise<void> {
  const piece = await queryOne<{
    asset_id: string | null
    flattened_key: string | null
    sketch_key: string | null
  }>(
    `select asset_id, flattened_key, sketch_key from pieces where id = $1 and artist_id = $2`,
    [pieceId, artistId],
  )
  if (!piece) return

  await query(`delete from pieces where id = $1 and artist_id = $2`, [pieceId, artistId])

  const storage = getStorage()
  if (piece.flattened_key) {
    await storage.remove(piece.flattened_key).catch(() => {})
    await storage.remove(frameAvifKey(piece.flattened_key)).catch(() => {})
  }
  if (piece.sketch_key) await storage.remove(piece.sketch_key).catch(() => {})

  if (piece.asset_id) {
    const refs = await queryOne<{ n: number }>(
      `select count(*)::int as n from pieces where asset_id = $1`,
      [piece.asset_id],
    )
    if ((refs?.n ?? 0) === 0) {
      const asset = await queryOne<{ storage_key: string; derivatives: Derivative[] | null }>(
        `select storage_key, derivatives from assets where id = $1`,
        [piece.asset_id],
      )
      if (asset) {
        await query(`delete from assets where id = $1`, [piece.asset_id])
        const keys = [asset.storage_key, ...(asset.derivatives ?? []).map((d) => d.key)]
        await Promise.all(keys.map((key) => storage.remove(key).catch(() => {})))
      }
    }
  }
}
