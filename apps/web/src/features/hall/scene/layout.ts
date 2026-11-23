import { DOOR_HEIGHT, doorWidth, type MuseumDoor } from '@tiny/core/rooms'
import { CONFIG } from './config.ts'

export interface HallLayout {
  centerX: number[]
  /** How much higher than usual each painting hangs, to clear a door standing under it. */
  lift: number[]
  pedestalX: number[]
  totalLength: number
  known: number
  giftShopX: number | null
  cafeX: number | null
  guestBoardX: number | null
  comingSoonX: number | null
  /** The rooms the hall is made of, joined wall to wall; they tile the floor end to end. */
  rooms: HallRoomSpan[]
}

export type HallRoomKind = 'entrance' | 'gallery' | 'cafe' | 'giftShop'

export interface HallRoomSpan {
  key: string
  kind: HallRoomKind
  startX: number
  endX: number
}

interface Span {
  kind: HallRoomKind
  startX: number
  endX: number
}

/**
 * Groups the hall's pieces into rooms: the entrance, the cafe and the gift shop are rooms of their
 * own, and runs of paintings between them are split into galleries no wider than
 * `CONFIG.galleryRoom.maxWidth`. Joins fall in the middle of the gaps, so nothing straddles one.
 * Adding paintings only grows the last gallery or adds new ones, so keys stay stable.
 */
export function cutRooms(spans: Span[]): HallRoomSpan[] {
  const rooms: HallRoomSpan[] = []
  let galleries = 0
  let open: HallRoomSpan | null = null

  for (let i = 0; i < spans.length; i++) {
    const span = spans[i]
    const previous = spans[i - 1]
    const cut = previous ? (previous.endX + span.startX) / 2 : span.startX
    const fits = open !== null && span.kind === 'gallery' && span.endX - open.startX <= CONFIG.galleryRoom.maxWidth
    if (fits) {
      open!.endX = span.endX
      continue
    }
    if (rooms.length > 0) rooms[rooms.length - 1].endX = cut
    const key = span.kind === 'gallery' ? `gallery-${++galleries}` : span.kind
    open = { key, kind: span.kind, startX: cut, endX: span.endX }
    rooms.push(open)
    if (span.kind !== 'gallery') open = null
  }
  return rooms
}

function cafeAfterIndex(widths: number[], isComplete: boolean): number | null {
  if (widths.length > 10) return 9
  if (isComplete) return widths.length - 1
  return null
}

export function comingSoonWidth(): number {
  return CONFIG.comingSoon.canvas.w * CONFIG.piece.scale
}

/**
 * A door standing in the hall: its centre and width. Paintings and rooms step round it, unless it
 * stands under a painting (`top`, the height of its top): then that painting hangs higher instead.
 */
export interface DoorSpan {
  x: number
  width: number
  top?: number
}

/** Where the hall's doors stand: their foot, just below the floor line. */
export const HALL_DOOR_FOOT = -0.26

export function hallDoorSpan(door: Pick<MuseumDoor, 'x' | 'style' | 'scale' | 'under'>): DoorSpan {
  return { x: door.x, width: doorWidth(door), top: door.under ? HALL_DOOR_FOOT + DOOR_HEIGHT * door.scale : undefined }
}

/** Space kept on either side of a door, so a frame never touches it. */
const DOOR_CLEARANCE = 0.45
/** Wall kept between a door's top and the painting above it, for the painting's plaque. */
const UNDER_ROOM = 0.62

export function computeLayout(paintings: number[], isComplete = false, doors: readonly DoorSpan[] = []): HallLayout {
  const widths = isComplete ? [...paintings, comingSoonWidth()] : paintings
  const blocked = doors
    .filter((door) => door.top === undefined)
    .map(({ x, width }) => ({ start: x - width / 2 - DOOR_CLEARANCE, end: x + width / 2 + DOOR_CLEARANCE }))
    .sort((a, b) => a.start - b.start)
  /** The first place at or after `start` where something `width` wide clears every door. */
  function clear(start: number, width: number): number {
    for (const door of blocked) {
      if (start < door.end && start + width > door.start) start = door.end
    }
    return start
  }
  const centerX: number[] = []
  const pedestalX: number[] = []
  let cafeX: number | null = null
  let guestBoardX: number | null = null
  const spans: Span[] = [{ kind: 'entrance', startX: CONFIG.lobby.minX, endX: CONFIG.lobby.length }]

  function placeCafe(from: number): number {
    const start = clear(from, CONFIG.cafe.lead + CONFIG.cafe.trail + CONFIG.guestBoard.lead + CONFIG.guestBoard.trail)
    cafeX = start + CONFIG.cafe.lead
    const afterCafe = cafeX + CONFIG.cafe.trail
    guestBoardX = afterCafe + CONFIG.guestBoard.lead
    const end = guestBoardX + CONFIG.guestBoard.trail
    spans.push({ kind: 'cafe', startX: start, endX: end })
    return end
  }

  let cursor = CONFIG.lobby.length
  const after = cafeAfterIndex(widths, isComplete)
  widths.forEach((w, i) => {
    cursor = clear(cursor, w)
    centerX.push(cursor + w / 2)
    spans.push({ kind: 'gallery', startX: cursor, endX: cursor + w })
    cursor += w
    if (i >= widths.length - 1) return

    if (after === i) {
      cursor = placeCafe(cursor)
    } else {
      const pedestal = cursor + CONFIG.piece.gap / 2
      const freeFloor = doors.every((door) => Math.abs(door.x - pedestal) > door.width / 2 + DOOR_CLEARANCE)
      if (hasPedestal(i) && freeFloor) pedestalX.push(pedestal)
      cursor += CONFIG.piece.gap
    }
  })

  if (isComplete && after === widths.length - 1) cursor = placeCafe(cursor)

  if (isComplete) cursor = clear(cursor, CONFIG.giftShop.length * 2)
  const giftShopX = isComplete ? cursor + CONFIG.giftShop.length : null

  const comingSoonX = isComplete ? centerX.pop()! : null
  const lift = centerX.map((x, i) => Math.max(0, ...doors
    .filter((door) => door.top !== undefined && Math.abs(door.x - x) < (widths[i] + door.width) / 2)
    .map((door) => door.top! + UNDER_ROOM - CONFIG.displayBottomY)))
  if (giftShopX !== null) {
    spans.push({ kind: 'giftShop', startX: giftShopX - CONFIG.giftShop.length, endX: giftShopX + CONFIG.giftShop.length })
  }

  // A door past the last painting known so far still needs floor to stand on.
  const pastDoors = blocked.length > 0 ? blocked[blocked.length - 1].end : -Infinity
  return {
    centerX,
    lift,
    pedestalX,
    totalLength: giftShopX ?? Math.max(cursor + CONFIG.piece.gap, pastDoors),
    known: paintings.length,
    giftShopX,
    cafeX,
    guestBoardX,
    comingSoonX,
    rooms: cutRooms(spans),
  }
}

function hasPedestal(index: number): boolean {
  const noise = Math.sin((index + 1) * 12.9898) * 43758.5453
  return noise - Math.floor(noise) < CONFIG.pedestal.frequency
}
