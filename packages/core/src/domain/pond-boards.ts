import {
  POND_SPECIES,
  POND_VARIANTS,
  isoWeek,
  type PondFishId,
  type PondVariant,
} from '../economy/pond.ts'
import { nameFromSeed } from '../presence/names.ts'
import { query } from '../infra/db.ts'

export type PondBoardId = 'biggest' | 'haul' | 'rarest'
export type PondBoardPeriod = 'week' | 'all'

export interface PondBoardRow {
  rank: number
  name: string
  value: number
  species: PondFishId | null
  variant: PondVariant | null
  sizeCm: number | null
}

export interface PondBoardMe extends PondBoardRow {
  above: PondBoardRow[]
}

export interface PondLeaderboard {
  rows: PondBoardRow[]
  me: PondBoardMe | null
  week: string
}

interface NameRow {
  member_id: string
  display_name: string | null
  name_seed: number | null
}

interface RepRow extends NameRow {
  value: number
  species: string | null
  variant: string | null
  size_cm: number | null
}

interface Rep {
  memberId: string
  name: string
  value: number
  species: PondFishId | null
  variant: PondVariant | null
  sizeCm: number | null
}

function seedFromId(id: string): number {
  let hash = 0
  for (let index = 0; index < id.length; index++) {
    hash = (Math.imul(hash, 31) + id.charCodeAt(index)) >>> 0
  }
  return hash % 2 ** 31
}

function displayName(row: NameRow): string {
  if (row.display_name !== null) return row.display_name
  return nameFromSeed(row.name_seed ?? seedFromId(row.member_id))
}

function whereWeek(week: string | null): { clause: string; params: unknown[] } {
  return week === null ? { clause: '', params: [] } : { clause: 'where c.week = $1', params: [week] }
}

async function representatives(
  board: PondBoardId,
  week: string | null,
): Promise<Rep[]> {
  const { clause, params } = whereWeek(week)
  let rows: RepRow[]
  if (board === 'haul') {
    rows = await query<RepRow>(
      `select c.member_id, sum(c.pearls)::int as value,
              null::text as species, null::text as variant, null::double precision as size_cm,
              m.display_name, m.name_seed
         from pond_catches c
         join members m on m.id = c.member_id
        ${clause}
        group by c.member_id, m.display_name, m.name_seed`,
      params,
    )
  } else if (board === 'rarest') {
    rows = await query<RepRow>(
      `select distinct on (c.member_id)
              c.member_id, c.odds as value, c.species, c.variant, c.size_cm,
              m.display_name, m.name_seed
         from pond_catches c
         join members m on m.id = c.member_id
        ${clause}
        order by c.member_id, c.odds asc, c.size_cm desc, c.at asc, c.id asc`,
      params,
    )
  } else {
    rows = await query<RepRow>(
      `select distinct on (c.member_id)
              c.member_id, coalesce(c.score, c.pearls) as value,
              c.species, c.variant, c.size_cm,
              m.display_name, m.name_seed
         from pond_catches c
         join members m on m.id = c.member_id
        ${clause}
        order by c.member_id, coalesce(c.score, c.pearls) desc,
                 c.size_cm desc, c.at asc, c.id asc`,
      params,
    )
  }
  return rows.map((row) => ({
    memberId: row.member_id,
    name: displayName(row),
    value: row.value,
    species: row.species as PondFishId | null,
    variant: row.variant as PondVariant | null,
    sizeCm: row.size_cm,
  }))
}

function compare(board: PondBoardId, a: Rep, b: Rep): number {
  if (board === 'rarest') {
    if (a.value !== b.value) return a.value - b.value
    return (b.sizeCm ?? 0) - (a.sizeCm ?? 0) || a.name.localeCompare(b.name)
  }
  if (a.value !== b.value) return b.value - a.value
  return (b.sizeCm ?? 0) - (a.sizeCm ?? 0) || a.name.localeCompare(b.name)
}

function toRow(rep: Rep, rank: number): PondBoardRow {
  return {
    rank,
    name: rep.name,
    value: rep.value,
    species: rep.species,
    variant: rep.variant,
    sizeCm: rep.sizeCm,
  }
}

export async function getPondLeaderboard(
  board: PondBoardId,
  period: PondBoardPeriod,
  memberId: string | null,
  now = new Date(),
): Promise<PondLeaderboard> {
  const week = isoWeek(now)
  const reps = await representatives(board, period === 'week' ? week : null)
  reps.sort((a, b) => compare(board, a, b))

  let rank = 0
  let previousValue: number | null = null
  let previousSize: number | null = null
  const ranked: (Rep & { rank: number })[] = reps.map((rep, index) => {
    const tied =
      previousValue !== null &&
      rep.value === previousValue &&
      (board !== 'rarest' || rep.sizeCm === previousSize)
    if (!tied) rank = index + 1
    previousValue = rep.value
    previousSize = rep.sizeCm
    return { ...rep, rank }
  })

  const mine = memberId === null ? undefined : ranked.find((rep) => rep.memberId === memberId)
  const above = mine
    ? ranked
        .filter((rep) => rep.rank < mine.rank)
        .slice(-2)
        .map((rep) => toRow(rep, rep.rank))
    : []

  return {
    rows: ranked.slice(0, 10).map((rep) => toRow(rep, rep.rank)),
    me: mine ? { ...toRow(mine, mine.rank), above } : null,
    week,
  }
}

export interface PondFeedItem {
  id: string
  name: string
  species: PondFishId
  variant: PondVariant
  sizeCm: number
  trophy: boolean
  at: string
}

interface FeedRow extends NameRow {
  id: string
  species: string
  variant: string
  size_cm: number
  trophy: boolean
  at: Date
}

export async function getPondFeed(limit = 20): Promise<PondFeedItem[]> {
  const rows = await query<FeedRow>(
    `select c.id, c.member_id, c.species, c.variant, c.size_cm, c.trophy, c.at,
            m.display_name, m.name_seed
       from pond_catches c
       join members m on m.id = c.member_id
      where c.tier in ('rare', 'legendary') or c.variant <> 'normal'
      order by c.at desc, c.id desc
      limit $1`,
    [limit],
  )
  return rows.map((row) => ({
    id: row.id,
    name: displayName(row),
    species: row.species as PondFishId,
    variant: row.variant as PondVariant,
    sizeCm: row.size_cm,
    trophy: row.trophy,
    at: row.at.toISOString(),
  }))
}

export interface PondDexCell {
  count: number
  bestCm: number
}

export interface PondDex {
  entries: Record<string, Record<string, PondDexCell>>
  totals: { found: number; possible: number }
}

interface DexRow {
  species: string
  variant: string
  count: number
  best_cm: number
}

export async function getPondDex(memberId: string): Promise<PondDex> {
  const rows = await query<DexRow>(
    `select species, variant, count(*)::int as count, max(size_cm) as best_cm
       from pond_catches
      where member_id = $1
      group by species, variant`,
    [memberId],
  )
  const entries: Record<string, Record<string, PondDexCell>> = {}
  let found = 0
  for (const row of rows) {
    entries[row.species] ??= {}
    entries[row.species][row.variant] = { count: row.count, bestCm: row.best_cm }
    found += 1
  }
  return {
    entries,
    totals: { found, possible: POND_SPECIES.length * POND_VARIANTS.length },
  }
}
