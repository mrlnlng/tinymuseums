import { env } from './env.ts'
import { query, queryOne, transaction } from './db.ts'
import { LAYOUTS } from './layouts.ts'
import { getStorage } from './storage.ts'
import type { DisplayDto, HallSliceDto, LayoutName, RegionMap } from './types.ts'

/**
 * The museum's ordering.
 *
 * Rotation and cursor stability are the same mechanism. An epoch is a sealed,
 * deterministic permutation of every publishable display; a cursor is
 * (epoch_id, index). Because the permutation never changes for the life of an
 * epoch, walking back shows the same hall you walked through, and slices are
 * safe to cache indefinitely.
 *
 * Suppression is checked here, at read time, deliberately outside that
 * immutability — a takedown must not wait for the next epoch boundary.
 */

function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export interface EpochRow {
  id: number
  seed: number
  display_count: number
  sealed_at: Date
  expires_at: Date
}

/**
 * Seals a new epoch over everything currently publishable.
 *
 * Retention is deliberately longer than the interval so visitors mid-walk on
 * the previous epoch keep resolving rather than hitting a dead end.
 */
export async function sealEpoch(): Promise<EpochRow | null> {
  const candidates = await query<{ id: string }>(
    `select a.id
       from artists a
       join displays d on d.artist_id = a.id
      where a.status = 'live'
        and d.flattened_key is not null
      order by a.id`,
  )

  if (candidates.length === 0) return null

  const seed = Math.floor(Math.random() * 0x7fffffff)
  const rng = mulberry32(seed)
  const order = candidates.map((row) => row.id)

  // Fisher-Yates. Every artist rotates through prime entrance positions over
  // time instead of position being decided once, forever, by insertion order.
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[order[i], order[j]] = [order[j], order[i]]
  }

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
      `insert into epoch_slots (epoch_id, index, artist_id)
       select $1, ordinality - 1, artist_id
         from unnest($2::uuid[]) with ordinality as t(artist_id, ordinality)`,
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
  layout: LayoutName
  flattened_key: string
  flattened_width: number
  flattened_height: number
  region_map: RegionMap
}

export async function getHallSlice(
  epochId: number,
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
            d.layout,
            d.flattened_key,
            d.flattened_width,
            d.flattened_height,
            d.region_map
       from epoch_slots s
       join artists  a on a.id = s.artist_id
       join displays d on d.artist_id = a.id
      where s.epoch_id = $1
        and s.index >= $2
        and a.status = 'live'
        and d.flattened_key is not null
        -- Read-time takedown. Outside the epoch snapshot on purpose.
        and not exists (
          select 1 from suppressions sup
           where sup.subject_type = 'artist' and sup.subject_id = a.id
        )
      order by s.index
      limit $3`,
    [epochId, fromIndex, limit],
  )

  const total = await queryOne<{ count: number }>(
    `select count(*)::int as count from epoch_slots where epoch_id = $1`,
    [epochId],
  )
  const totalSlots = total?.count ?? 0

  const slots = rows.map((row) => {
    const spec = LAYOUTS[row.layout]
    const display: DisplayDto = {
      artistId: row.artist_id,
      slug: row.slug,
      artistName: row.display_name,
      statement: row.statement,
      layout: row.layout,
      canvas: spec.canvas,
      image: {
        url: storage.urlFor(row.flattened_key),
        width: row.flattened_width,
        height: row.flattened_height,
      },
      regionMap: row.region_map ?? [],
    }
    return { index: row.index, display }
  })

  const lastIndex = slots.length > 0 ? slots[slots.length - 1].index : fromIndex - 1
  const nextIndex = lastIndex + 1 < totalSlots ? lastIndex + 1 : null

  return { epochId, slots, nextIndex, totalSlots }
}

/** Where an artist stands in the current epoch, for the QR exit into the hall. */
export async function slotForArtist(epochId: number, artistId: string): Promise<number | null> {
  const row = await queryOne<{ index: number }>(
    `select index from epoch_slots where epoch_id = $1 and artist_id = $2`,
    [epochId, artistId],
  )
  return row?.index ?? null
}
