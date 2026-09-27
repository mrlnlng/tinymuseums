import { env } from '../infra/env.ts'
import { query, queryOne, transaction } from '../infra/db.ts'
import { FRAME_AVIF_SINCE, framePxPerUnit } from '../media/collage.ts'
import { frameAvifKey, getStorage } from '../media/storage.ts'
import { MAX_STANDS } from './gallery.ts'
import type { HallPieceDto, HallSliceDto } from '../types.ts'

export interface EpochRow {
  id: number
  seed: number
  display_count: number
  sealed_at: Date
}

export async function sealEpoch(): Promise<EpochRow> {
  const candidates = await query<{ id: string }>(
    `select p.id
       from pieces p
       join artists a on a.id = p.artist_id
      where a.status = 'live'
        and p.flattened_key is not null
        and p.order_index between 1 and $1
        ${env.hallOwnerEmail ? `and a.email = $2` : ''}
      order by p.order_index, p.created_at`,
    env.hallOwnerEmail ? [MAX_STANDS, env.hallOwnerEmail] : [MAX_STANDS],
  )

  const seed = Math.floor(Math.random() * 0x7fffffff)
  const order = candidates.map((row) => row.id)

  return transaction(async (client) => {
    const { rows } = await client.query<EpochRow>(
      `insert into museum_epochs (seed, display_count)
       values ($1, $2)
       returning id, seed, display_count, sealed_at`,
      [seed, order.length],
    )
    const epoch = rows[0]

    await client.query(
      `insert into epoch_slots (epoch_id, index, piece_id)
       select $1, ordinality - 1, piece_id
         from unnest($2::uuid[]) with ordinality as t(piece_id, ordinality)`,
      [epoch.id, order],
    )

    return epoch
  })
}

async function currentEpoch(): Promise<EpochRow | null> {
  return queryOne<EpochRow>(
    `select id, seed, display_count, sealed_at
       from museum_epochs
      order by id desc
      limit 1`,
  )
}

export async function epochById(id: number): Promise<EpochRow | null> {
  return queryOne<EpochRow>(
    `select id, seed, display_count, sealed_at
       from museum_epochs
      where id = $1`,
    [id],
  )
}

export async function ensureEpoch(): Promise<EpochRow> {
  return (await currentEpoch()) ?? (await sealEpoch())
}

interface SliceRow {
  index: number
  total: number
  artist_id: string
  slug: string
  display_name: string
  statement: string
  piece_id: string
  title: string
  description: string
  flattened_key: string
  flattened_width: number
  flattened_height: number
  flattened_version: number
  flattened_thumbhash: string | null
}

export async function getHallSlice(
  epoch: EpochRow,
  fromIndex: number,
  limit: number,
): Promise<HallSliceDto> {
  const storage = getStorage()

  const rows = await query<SliceRow>(
    `with visible as (
       select (row_number() over (order by s.index) - 1)::int as index,
              count(*) over ()::int as total,
              a.id            as artist_id,
              a.slug,
              a.display_name,
              a.statement,
              p.id            as piece_id,
              p.title,
              p.description,
              p.flattened_key,
              p.flattened_width,
              p.flattened_height,
              p.flattened_version,
              p.flattened_thumbhash
         from epoch_slots s
         join pieces   p on p.id = s.piece_id
         join artists  a on a.id = p.artist_id
        where s.epoch_id = $1
          and a.status = 'live'
          and p.flattened_key is not null
          -- Read-time takedown. Outside the epoch snapshot on purpose.
          and not exists (
            select 1 from suppressions sup
             where (sup.subject_type = 'artist' and sup.subject_id = a.id)
                or (sup.subject_type = 'piece'  and sup.subject_id = p.id)
          )
     )
     select * from visible
      where index >= $2
      order by index
      limit $3`,
    [epoch.id, fromIndex, limit],
  )

  const totalSlots = rows[0]?.total ?? fromIndex

  const slots = rows.map((row) => {
    const display: HallPieceDto = {
      pieceId: row.piece_id,
      artistId: row.artist_id,
      slug: row.slug,
      artistName: row.display_name,
      title: row.title,
      statement: row.statement,
      description: row.description,
      canvas: {
        w: row.flattened_width / framePxPerUnit(row.flattened_version),
        h: row.flattened_height / framePxPerUnit(row.flattened_version),
      },
      image: {
        url: storage.urlFor(row.flattened_key),
        avifUrl:
          row.flattened_version >= FRAME_AVIF_SINCE
            ? storage.urlFor(frameAvifKey(row.flattened_key))
            : undefined,
        thumbhash: row.flattened_thumbhash ?? undefined,
        width: row.flattened_width,
        height: row.flattened_height,
      },
    }
    return { index: row.index, display }
  })

  const lastIndex = slots.length > 0 ? slots[slots.length - 1].index : fromIndex - 1
  const nextIndex = lastIndex + 1 < totalSlots ? lastIndex + 1 : null

  return { epochId: epoch.id, slots, nextIndex, totalSlots }
}
