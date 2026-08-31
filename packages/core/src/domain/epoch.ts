import { env } from '../infra/env.ts'
import { query, queryOne, transaction } from '../infra/db.ts'
import { PX_PER_UNIT } from '../media/collage.ts'
import { getStorage } from '../media/storage.ts'
import { MAX_STANDS } from './gallery.ts'
import type { HallPieceDto, HallSliceDto } from '../types.ts'

/* The museum's ordering: an epoch is a sealed, deterministic permutation of every publishable display, so slices cache indefinitely. Suppression is checked at read time, outside that immutability — a takedown must not wait for the next boundary. */

export interface EpochRow {
  id: number
  seed: number
  display_count: number
  sealed_at: Date
  expires_at: Date
}

/** Retention is longer than the interval, so visitors mid-walk on the
 * previous epoch keep resolving rather than hitting a dead end. */
export async function sealEpoch(): Promise<EpochRow | null> {
  // A slot is a piece now: every arranged work (stands 1..30) of the hall's
  // owner is its own wall, hung in gallery order — order_index is the walk.
  // The hall is hard-coded to one artist per environment (HALL_OWNER_EMAIL);
  // a per-artist /{slug}/museum replaces that later.
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

  if (candidates.length === 0) return null

  const seed = Math.floor(Math.random() * 0x7fffffff)
  // Kept for the epoch's history; ordering no longer shuffles.
  const order = candidates.map((row) => row.id)

  const graceMinutes = Math.max(env.epochIntervalMinutes * 3, 30)

  return transaction(async (client) => {
    const { rows } = await client.query<EpochRow>(
      `insert into museum_epochs (seed, display_count, expires_at)
       values ($1, $2, now() + ($3 || ' minutes')::interval)
       returning id, seed, display_count, sealed_at, expires_at`,
      [seed, order.length, String(graceMinutes)],
    )
    const epoch = rows[0]

    // One statement rather than N inserts: unnest turns the ordered array into
    // rows with their index already attached.
    await client.query(
      `insert into epoch_slots (epoch_id, index, piece_id)
       select $1, ordinality - 1, piece_id
         from unnest($2::uuid[]) with ordinality as t(piece_id, ordinality)`,
      [epoch.id, order],
    )

    return epoch
  })
}

export async function currentEpoch(): Promise<EpochRow | null> {
  return queryOne<EpochRow>(
    `select id, seed, display_count, sealed_at, expires_at
       from museum_epochs
      where expires_at > now()
      order by id desc
      limit 1`,
  )
}

export async function epochById(id: number): Promise<EpochRow | null> {
  return queryOne<EpochRow>(
    `select id, seed, display_count, sealed_at, expires_at
       from museum_epochs
      where id = $1 and expires_at > now()`,
    [id],
  )
}

/** Ensures an epoch exists, sealing one if the museum has never been ordered. */
export async function ensureEpoch(): Promise<EpochRow | null> {
  return (await currentEpoch()) ?? (await sealEpoch())
}

interface SliceRow {
  index: number
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
}

export async function getHallSlice(
  epoch: EpochRow,
  fromIndex: number,
  limit: number,
): Promise<HallSliceDto> {
  const storage = getStorage()

  const rows = await query<SliceRow>(
    `select s.index,
            a.id            as artist_id,
            a.slug,
            a.display_name,
            a.statement,
            p.id            as piece_id,
            p.title,
            p.description,
            p.flattened_key,
            p.flattened_width,
            p.flattened_height
       from epoch_slots s
       join pieces   p on p.id = s.piece_id
       join artists  a on a.id = p.artist_id
      where s.epoch_id = $1
        and s.index >= $2
        and a.status = 'live'
        and p.flattened_key is not null
        -- Read-time takedown. Outside the epoch snapshot on purpose.
        and not exists (
          select 1 from suppressions sup
           where (sup.subject_type = 'artist' and sup.subject_id = a.id)
              or (sup.subject_type = 'piece'  and sup.subject_id = p.id)
        )
      order by s.index
      limit $3`,
    [epoch.id, fromIndex, limit],
  )

  // The slot count is the epoch's own display_count — one per sealed piece —
  // so the pagination end is already known without a second round trip.
  const totalSlots = epoch.display_count

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
        w: row.flattened_width / PX_PER_UNIT,
        h: row.flattened_height / PX_PER_UNIT,
      },
      image: {
        url: storage.urlFor(row.flattened_key),
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
