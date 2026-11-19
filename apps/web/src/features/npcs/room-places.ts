// What each room tells the NPCs about its floor, built from the same layout the room draws.

import { ATELIER_ROOMS, ROOM_TEMPLATE } from '../hall/scene/atelier-layout.ts'
import { CONFIG } from '../hall/scene/config.ts'
import type { HallLayout } from '../hall/scene/layout.ts'
import { PROP_DEPTH } from '../rooms/pond/depth.ts'
import { contains, nearestInside, type WalkArea } from '../rooms/floor.ts'
import { depthOf, toFloor } from '../rooms/pond/walk.ts'
import type { NpcGround, NpcRoomInfo, Place, PlaceKind } from './jobs.ts'

/** A place before it is sorted and clipped to the floor. */
export interface PlaceInput {
  x: number
  kind: PlaceKind
  name?: string
  /** How far into the picture it stands, in the room's depth units; absent means the front line. */
  d?: number
}

export interface RoomPlacesInput {
  minX: number
  maxX: number
  places: readonly PlaceInput[]
}

export interface FurniturePlacement {
  kind: string
  ref: string
  x: number
}

export interface PondPlaceData {
  minX: number
  maxX: number
  doorX: number
  /** Bank x of each fishing spot; not its ripple out over the water. */
  spots: readonly { x: number }[]
  landmarks: readonly { kind: string; x: number; standX?: number; depth?: number }[]
  /** The pond's walkable ground, so a bank spot never ends up out on the water. */
  area?: WalkArea
  ground?: NpcGround
}

/** How far inside the floor each end place stands. */
const END_INSET = 0.6
/** An end this close to a door would leave the NPC in the doorway. */
const DOOR_CLEARANCE = 1.5

// shortcut: only the cozy props that clearly read as a seat, desk or board; upgrade when NPCs
// should use every piece of furniture.
const PERSONAL_FURNITURE: Readonly<Record<string, PlaceKind>> = {
  chair: 'seat',
  armchair: 'seat',
  'pillow-blue': 'seat',
  'pillow-red': 'seat',
  'round-table': 'desk',
  'side-table': 'desk',
  cabinet: 'desk',
  cubby: 'desk',
  mirror: 'board',
  shelf: 'board',
  'wall-shelf': 'board',
  'wall-hooks': 'board',
}

function copy(place: PlaceInput): Place {
  const at = place.d === undefined ? { x: place.x, kind: place.kind } : { x: place.x, kind: place.kind, d: place.d }
  return place.name === undefined ? at : { ...at, name: place.name }
}

/** Just in front of a prop at PROP_DEPTH, matching the pond room's STAND_DEPTH. */
const STAND_DEPTH = PROP_DEPTH * 0.86

/** A place on the pond's ground, nudged back onto it if depth or a x puts it in the water. */
function onGround(area: WalkArea | undefined, place: PlaceInput): PlaceInput {
  if (!area) return place
  const at = toFloor(place.x, place.d ?? 0)
  if (contains(area, at)) return place
  const near = nearestInside(area, at)
  return { ...place, x: near.x, d: depthOf(near) }
}

function textOrder(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0
}

/** Sorted, clipped places plus the two floor ends, skipping an end beside a door. */
export function roomPlaces({ minX, maxX, places }: RoomPlacesInput): NpcRoomInfo {
  const kept = places
    .filter((place) => Number.isFinite(place.x) && place.x >= minX && place.x <= maxX)
    .map(copy)
  const doors = kept.filter((place) => place.kind === 'door')

  if (maxX - minX >= END_INSET * 2) {
    for (const x of [minX + END_INSET, maxX - END_INSET]) {
      if (doors.some((door) => Math.abs(door.x - x) < DOOR_CLEARANCE)) continue
      kept.push({ x, kind: 'end' })
    }
  }

  kept.sort((a, b) => a.x - b.x || textOrder(a.kind, b.kind) || textOrder(a.name ?? '', b.name ?? ''))
  return { minX, maxX, places: kept }
}

const hallCache = new WeakMap<HallLayout, NpcRoomInfo>()

/** The hall's live layout, with its entrance opening where a visitor arriving from outside appears. */
export function hallRoomInfo(layout: HallLayout, atelierX: number): NpcRoomInfo {
  const cached = hallCache.get(layout)
  if (cached) return cached

  const places: PlaceInput[] = [
    { x: atelierX, kind: 'door', name: 'atelier' },
    { x: CONFIG.lobby.startX, kind: 'door', name: 'entrance' },
    ...layout.centerX.map((x) => ({ x, kind: 'painting' as const })),
    ...layout.pedestalX.map((x) => ({ x, kind: 'plinth' as const })),
    { x: CONFIG.lobby.booth.x, kind: 'desk' },
    { x: CONFIG.lobby.sign.x, kind: 'board' },
    { x: CONFIG.lobby.post.x, kind: 'board' },
  ]
  if (layout.cafeX !== null) places.push({ x: layout.cafeX, kind: 'desk' })
  if (layout.giftShopX !== null) places.push({ x: layout.giftShopX, kind: 'desk' })
  if (layout.guestBoardX !== null) {
    places.push({ x: layout.guestBoardX, kind: 'board' })
    places.push({ x: layout.guestBoardX + CONFIG.guestBoard.seat.dx, kind: 'seat' })
  }

  const info = roomPlaces({ minX: CONFIG.lobby.minX, maxX: layout.totalLength, places })
  hallCache.set(layout, info)
  return info
}

const atelierX = (px: number): number => (px - CONFIG.atelier.mock.originX) / CONFIG.atelier.mock.unit

let atelierCache: { doorX: number; info: NpcRoomInfo } | null = null

/** Each collection's three wall paintings, its wardrobe rail and the door back to the hall. */
export function atelierRoomInfo(doorX: number): NpcRoomInfo {
  if (atelierCache?.doorX === doorX) return atelierCache.info

  const places: PlaceInput[] = [
    { x: doorX, kind: 'door', name: 'gallery' },
    { x: atelierX(CONFIG.atelier.wardrobe.x), kind: 'rail' },
  ]
  for (const room of ATELIER_ROOMS) {
    if (!room.collection || room.centerX === null) continue
    const out = room.spread
    places.push(
      { x: atelierX(room.centerX + ROOM_TEMPLATE.leftFrame.dx - out), kind: 'painting' },
      { x: atelierX(room.centerX + ROOM_TEMPLATE.portrait.dx + out), kind: 'painting' },
      { x: atelierX(room.centerX + ROOM_TEMPLATE.rightFrame.dx + out), kind: 'painting' },
    )
  }

  const info = roomPlaces({ minX: doorX, maxX: CONFIG.atelier.max - 0.45, places })
  atelierCache = { doorX, info }
  return info
}

/** The bank spots, Marlow's counter, the noticeboards and the gate. */
export function pondRoomInfo({ minX, maxX, doorX, spots, landmarks, area, ground }: PondPlaceData): NpcRoomInfo {
  const places: PlaceInput[] = [
    onGround(area, { x: doorX, kind: 'door', name: 'hall', d: 0 }),
    ...spots.map((spot) => onGround(area, { x: spot.x, kind: 'water' as const, d: 0 })),
  ]
  for (const landmark of landmarks) {
    // Stand where the visitor stands to use it, just in front of the prop up its path.
    const x = landmark.standX ?? landmark.x
    if (landmark.kind === 'fishmonger') places.push(onGround(area, { x, kind: 'desk', d: STAND_DEPTH }))
    else if (landmark.kind === 'bounties' || landmark.kind === 'fishdex') {
      places.push(onGround(area, { x, kind: 'board', d: STAND_DEPTH }))
    }
  }
  return { ...roomPlaces({ minX, maxX, places }), ...(ground ? { ground } : {}) }
}

let personalCache: {
  doors: Readonly<Record<string, { x: number }>>
  placements: readonly FurniturePlacement[]
  minX: number
  maxX: number
  info: NpcRoomInfo
} | null = null

/** A personal room's doors and the furniture that gives an NPC somewhere to sit or work. */
export function personalRoomInfo({
  doors,
  placements,
  minX,
  maxX,
}: {
  doors: Readonly<Record<string, { x: number }>>
  placements: readonly FurniturePlacement[]
  minX: number
  maxX: number
}): NpcRoomInfo {
  if (
    personalCache?.doors === doors &&
    personalCache.placements === placements &&
    personalCache.minX === minX &&
    personalCache.maxX === maxX
  ) return personalCache.info

  const places: PlaceInput[] = Object.entries(doors).map(([name, door]) => ({ x: door.x, kind: 'door', name }))
  for (const placement of placements) {
    if (placement.kind !== 'prop') continue
    const kind = PERSONAL_FURNITURE[placement.ref]
    if (kind) places.push({ x: placement.x, kind })
  }

  const info = roomPlaces({ minX, maxX, places })
  personalCache = { doors, placements, minX, maxX, info }
  return info
}

/**
 * The filter the personal room puts on its player at a darkness and gloom, or null when the room
 * leaves them fully lit, matching character.setShade's own cut-off.
 */
export function personalShade(dark: number, gloom: number): string | null {
  const brightness = 1 - dark * 0.72
  const warmth = gloom > 0 ? 0.12 + dark * 0.35 : dark * 0.3
  if (brightness >= 0.995 && warmth <= 0.005) return null
  return `brightness(${brightness.toFixed(2)}) sepia(${warmth.toFixed(2)})`
}
