import { env } from '../infra/env.ts'
import { query } from '../infra/db.ts'
import { MAX_STANDS } from './gallery.ts'
import { pickDerivative } from '../media/derivatives.ts'
import { getStorage } from '../media/storage.ts'
import { orderedPaintings, type Placement } from '../rooms/placements.ts'
import { LOCATIONS, locationById, spotPlacementId } from '../rooms/spots.ts'
import type { Derivative } from '../types.ts'
import { getRoom, publish, saveDraft, type RoomRow } from './rooms.ts'

// The owner places paintings from the studio. Each location is a shared room row: placing edits
// its draft, and the location goes live when it is published.

export type PlaceTarget =
  | { location: string; spot: string }
  | { location: string; after: string | null }

const OWNER = { isOwnerArtist: true }

/** What the owner is working on: the draft once one was saved, else the published copy. */
export function workingCopy(room: RoomRow): Placement[] {
  return room.draftVersion > 0 ? room.draft : room.published
}

export function hasUnpublished(room: RoomRow): boolean {
  return JSON.stringify(workingCopy(room)) !== JSON.stringify(room.published)
}

/** The hall's row as placements, in the order given; the same ids the hall arranger writes. */
export function rowPlacements(order: readonly string[]): Placement[] {
  return order.map((pieceId, index) => ({
    id: `p-${pieceId.replace(/-/g, '').slice(0, 12)}`,
    kind: 'painting',
    ref: pieceId,
    zone: 'wall',
    x: index * 10,
  }))
}

/**
 * A hall that was never arranged shows the studio floor's order (`sealEpoch`). Its row starts from
 * that order, so placing one painting adds to the hall rather than leaving only that one.
 */
async function startingRow(room: RoomRow): Promise<Placement[]> {
  const working = workingCopy(room)
  // While nothing is published, an empty row is the floor order visitors see, not an empty hall.
  if (room.slug !== 'hall' || working.length > 0 || room.published.length > 0) return working
  const rows = await query<{ id: string }>(
    `select p.id
       from pieces p
       join artists a on a.id = p.artist_id
      where a.status = 'live'
        and p.flattened_key is not null
        and p.order_index between 1 and $1
        ${env.hallOwnerEmail ? 'and a.email = $2' : ''}
      order by p.order_index, p.created_at`,
    env.hallOwnerEmail ? [MAX_STANDS, env.hallOwnerEmail] : [MAX_STANDS],
  )
  // A painting already in a frame elsewhere hangs there, not here as well.
  const framed = new Set<string>()
  for (const location of LOCATIONS) {
    if (location.kind !== 'spots') continue
    const other = await getRoom(location.id)
    for (const placement of other ? workingCopy(other) : []) framed.add(placement.ref)
  }
  return rowPlacements(rows.map((row) => row.id).filter((id) => !framed.has(id)))
}

function without(placements: Placement[], pieceId: string, rowLocation: boolean): Placement[] {
  const kept = placements.filter((placement) => !(placement.kind === 'painting' && placement.ref === pieceId))
  return rowLocation ? rowPlacements(orderedPaintings(kept)) : kept
}

export type PlaceResult = { ok: true } | { ok: false; reason: string }

/**
 * Hangs a painting at a spot, or takes it down with `null`. A painting hangs in one place at a
 * time, so it leaves wherever else it was in the drafts; a fixed spot's painting is replaced.
 */
export async function placePainting(pieceId: string, target: PlaceTarget | null): Promise<PlaceResult> {
  const destination = target ? locationById(target.location) : null
  if (target && !destination) return { ok: false, reason: 'unknown_location' }
  if (target && destination?.kind === 'spots' && !('spot' in target && destination.spots.some((s) => s.id === target.spot))) {
    return { ok: false, reason: 'unknown_spot' }
  }

  for (const location of LOCATIONS) {
    const room = await getRoom(location.id)
    if (!room) continue
    const before = location.kind === 'row' ? await startingRow(room) : workingCopy(room)
    let next = without(before, pieceId, location.kind === 'row')
    if (target && location.id === target.location) {
      if ('spot' in target) {
        next = next.filter((placement) => placement.zone !== target.spot)
        next.push({ id: spotPlacementId(target.spot), kind: 'painting', ref: pieceId, zone: target.spot, x: 0 })
      } else {
        const order = orderedPaintings(next)
        const at = target.after === null ? order.length : order.indexOf(target.after) + 1
        order.splice(at <= 0 && target.after !== null ? order.length : at, 0, pieceId)
        next = rowPlacements(order)
      }
    }
    if (JSON.stringify(next) === JSON.stringify(before)) continue
    const saved = await saveDraft(location.id, next, OWNER)
    if (!saved.ok) return { ok: false, reason: saved.reason }
  }
  return { ok: true }
}

/** Moves a painting one place along the hall's row. */
export async function nudgeInRow(location: string, pieceId: string, by: -1 | 1): Promise<PlaceResult> {
  const room = await getRoom(location)
  if (!room) return { ok: false, reason: 'not_found' }
  const order = orderedPaintings(await startingRow(room))
  const from = order.indexOf(pieceId)
  const to = from + by
  if (from < 0 || to < 0 || to >= order.length) return { ok: true }
  ;[order[from], order[to]] = [order[to], order[from]]
  const saved = await saveDraft(location, rowPlacements(order), OWNER)
  return saved.ok ? { ok: true } : { ok: false, reason: saved.reason }
}

export async function publishLocation(location: string): Promise<boolean> {
  const room = await getRoom(location)
  if (!room || !locationById(location)) return false
  if (room.draftVersion === 0) return true
  return (await publish(location)) !== null
}

/** Throws the draft away, back to what is live. */
export async function discardLocation(location: string): Promise<PlaceResult> {
  const room = await getRoom(location)
  if (!room) return { ok: false, reason: 'not_found' }
  const saved = await saveDraft(location, room.published, OWNER)
  return saved.ok ? { ok: true } : { ok: false, reason: saved.reason }
}

export interface SpotPainting {
  pieceId: string
  title: string
  imageUrl: string
  width: number
  height: number
}

/** The frame-sized copy: the upload itself, resized, not the hall's framed image. */
const SPOT_IMAGE_WIDTH = 800

/** The paintings in a location's fixed spots, published or (for the studio) as drafted. */
export async function spotPaintings(location: string, which: 'published' | 'working' = 'published'): Promise<Record<string, SpotPainting>> {
  const room = await getRoom(location)
  if (!room) return {}
  const placements = (which === 'published' ? room.published : workingCopy(room)).filter((p) => p.kind === 'painting')
  if (placements.length === 0) return {}
  const rows = await query<{ id: string; title: string; derivatives: Derivative[] | null }>(
    `select p.id, p.title, a.derivatives
       from pieces p
       join assets a on a.id = p.asset_id
      where p.id = any($1::uuid[]) and a.status = 'ready'`,
    [placements.map((p) => p.ref)],
  )
  const byId = new Map(rows.map((row) => [row.id, row]))
  const storage = getStorage()
  const spots: Record<string, SpotPainting> = {}
  for (const placement of placements) {
    const row = byId.get(placement.ref)
    const image = row ? pickDerivative(row.derivatives ?? [], SPOT_IMAGE_WIDTH) : null
    if (!row || !image) continue
    spots[placement.zone] = { pieceId: row.id, title: row.title, imageUrl: storage.urlFor(image.key), width: image.width, height: image.height }
  }
  return spots
}

export interface SpotState {
  id: string
  label: string
  /** The painting drafted here, and the one live here now. */
  pieceId: string | null
  livePieceId: string | null
}

export interface LocationState {
  id: string
  label: string
  kind: 'spots' | 'row'
  spots: SpotState[]
  /** A row's paintings in order, drafted and live. */
  row: string[]
  liveRow: string[]
  unpublished: boolean
}

export async function locationStates(): Promise<LocationState[]> {
  const states: LocationState[] = []
  for (const location of LOCATIONS) {
    const room = await getRoom(location.id)
    const working = room ? (location.kind === 'row' ? await startingRow(room) : workingCopy(room)) : []
    const live = room?.published ?? []
    const inSpot = (placements: Placement[], spot: string) =>
      placements.find((p) => p.kind === 'painting' && p.zone === spot)?.ref ?? null
    states.push({
      id: location.id,
      label: location.label,
      kind: location.kind,
      spots: location.spots.map((spot) => ({ id: spot.id, label: spot.label, pieceId: inSpot(working, spot.id), livePieceId: inSpot(live, spot.id) })),
      row: location.kind === 'row' ? orderedPaintings(working) : [],
      // Nothing published yet means visitors see the starting row itself.
      liveRow: location.kind === 'row' ? (live.length > 0 ? orderedPaintings(live) : orderedPaintings(working)) : [],
      unpublished: room ? hasUnpublished(room) : false,
    })
  }
  return states
}

/** Where a painting hangs in the drafts, as the studio says it. */
export function whereHung(states: readonly LocationState[], pieceId: string): string | null {
  for (const state of states) {
    const spot = state.spots.find((s) => s.pieceId === pieceId)
    if (spot) return `${state.label} · ${spot.label}`
    const at = state.row.indexOf(pieceId)
    if (at >= 0) return `${state.label} · number ${at + 1} of ${state.row.length}`
  }
  return null
}
