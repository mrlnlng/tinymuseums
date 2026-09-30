import type { WorldPoint } from './hit.ts'
import type { Pedestal } from './pedestal.ts'

export interface TapPainting {
  slug: string
  artistId: string
  pieceId: string
}

export type TapIntent =
  | { kind: 'leave' }
  | { kind: 'help' }
  | { kind: 'coin' }
  | { kind: 'painting'; slug: string; artistId: string; pieceId: string }
  | { kind: 'helm'; pedestal: Pedestal }
  | { kind: 'statue'; pedestal: Pedestal }
  | { kind: 'matcha' }
  | { kind: 'cafe-cat' }
  | { kind: 'sketch' }
  | { kind: 'beanbag' }
  | { kind: 'guest-board' }

export interface TapWorld {
  hitDoor(point: WorldPoint): boolean
  hitLobbyCat(point: WorldPoint): boolean
  hitCoin(point: WorldPoint): boolean
  hitPainting(point: WorldPoint): TapPainting | null
  hitPedestal(point: WorldPoint): Pedestal | null
  acceptsHelm(pedestal: Pedestal): boolean
  hitMatcha(point: WorldPoint): boolean
  hitCafeCat(point: WorldPoint): boolean
  hitDesktop(point: WorldPoint): boolean
  hitBeanbag(point: WorldPoint): boolean
  hitGuestBoard(point: WorldPoint): boolean
}

export function routeTap(point: WorldPoint, world: TapWorld): TapIntent | null {
  if (world.hitDoor(point)) return { kind: 'leave' }
  if (world.hitLobbyCat(point)) return { kind: 'help' }
  if (world.hitCoin(point)) return { kind: 'coin' }

  const painting = world.hitPainting(point)
  if (painting) return { kind: 'painting', ...painting }

  const pedestal = world.hitPedestal(point)
  if (pedestal && world.acceptsHelm(pedestal)) return { kind: 'helm', pedestal }
  if (pedestal?.voice) return { kind: 'statue', pedestal }

  if (world.hitMatcha(point)) return { kind: 'matcha' }
  if (world.hitCafeCat(point)) return { kind: 'cafe-cat' }
  if (world.hitDesktop(point)) return { kind: 'sketch' }
  if (world.hitBeanbag(point)) return { kind: 'beanbag' }
  if (world.hitGuestBoard(point)) return { kind: 'guest-board' }

  return null
}
