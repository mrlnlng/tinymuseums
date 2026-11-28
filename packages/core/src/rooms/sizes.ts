import type { ThemeSpec } from './themes.ts'

export interface RoomSize {
  id: 'closet' | 'storeroom' | 'backroom' | 'studio'
  label: string
  /** The room's length in world units, from the left wall. */
  width: number
}

/**
 * A personal room starts as the storeroom closet and is knocked through, one wall at a time, to the
 * full studio. Each step is a `room:<id>` wallet item; the closet's marks a room that started small.
 */
export const ROOM_SIZES: readonly RoomSize[] = [
  // The closet is as wide as a widescreen view, so even the first room fills the screen edge to edge.
  { id: 'closet', label: 'Closet', width: 12 },
  { id: 'storeroom', label: 'Storeroom', width: 15 },
  { id: 'backroom', label: 'Back room', width: 17.5 },
  { id: 'studio', label: 'Studio', width: 20 },
]

export const FULL_ROOM_WIDTH = ROOM_SIZES[ROOM_SIZES.length - 1].width
/** Things keep this far from the room's ends. */
const END_GAP = 0.3

/** The room size a member's items give them. Rooms from before closets own no size and are full size. */
export function roomSizeFor(items: Iterable<string>): RoomSize {
  let best: RoomSize | null = null
  for (const item of items) {
    if (!item.startsWith('room:')) continue
    const size = ROOM_SIZES.find((entry) => `room:${entry.id}` === item)
    if (size && (!best || size.width > best.width)) best = size
  }
  return best ?? ROOM_SIZES[ROOM_SIZES.length - 1]
}

export function nextRoomSize(current: RoomSize): RoomSize | null {
  const index = ROOM_SIZES.findIndex((entry) => entry.id === current.id)
  return ROOM_SIZES[index + 1] ?? null
}

/** The theme with its zones ending at this room's right wall. */
export function sizedTheme(theme: ThemeSpec, width: number): ThemeSpec {
  if (theme.kind !== 'personal') return theme
  const maxX = width - END_GAP
  return {
    ...theme,
    zones: Object.fromEntries(
      Object.entries(theme.zones).map(([id, zone]) => [id, zone.maxX > maxX ? { ...zone, maxX } : zone]),
    ),
  }
}
