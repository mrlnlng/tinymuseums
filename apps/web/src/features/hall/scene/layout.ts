import { CONFIG } from './config.ts'

export interface HallLayout {
  centerX: number[]
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

export function computeLayout(paintings: number[], isComplete = false): HallLayout {
  const widths = isComplete ? [...paintings, comingSoonWidth()] : paintings
  const centerX: number[] = []
  const pedestalX: number[] = []
  let cafeX: number | null = null
  let guestBoardX: number | null = null
  const spans: Span[] = [{ kind: 'entrance', startX: CONFIG.lobby.minX, endX: CONFIG.lobby.length }]

  function placeCafe(start: number): number {
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
    centerX.push(cursor + w / 2)
    spans.push({ kind: 'gallery', startX: cursor, endX: cursor + w })
    cursor += w
    if (i >= widths.length - 1) return

    if (after === i) {
      cursor = placeCafe(cursor)
    } else {
      if (hasPedestal(i)) pedestalX.push(cursor + CONFIG.piece.gap / 2)
      cursor += CONFIG.piece.gap
    }
  })

  if (isComplete && after === widths.length - 1) cursor = placeCafe(cursor)

  const giftShopX = isComplete ? cursor + CONFIG.giftShop.length : null

  const comingSoonX = isComplete ? centerX.pop()! : null
  if (giftShopX !== null) {
    spans.push({ kind: 'giftShop', startX: giftShopX - CONFIG.giftShop.length, endX: giftShopX + CONFIG.giftShop.length })
  }

  return {
    centerX,
    pedestalX,
    totalLength: giftShopX ?? cursor + CONFIG.piece.gap,
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
