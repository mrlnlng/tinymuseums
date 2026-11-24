// The museum's doors, placed from the studio. A door stands on one room's floor and leads to
// another room: to the door it is paired with there, or, when it has no partner, in at that room's
// own entrance (the pond's gate back to the hall). Pairs are made and removed together, so every
// door into a room has a way back.

export type DoorRoom = 'hall' | 'atelier' | 'pond'
export type DoorStyle = 'gallery' | 'forest' | 'front'

export interface MuseumDoor {
  id: string
  room: DoorRoom
  /** World x of the door's centre on its room's floor. */
  x: number
  /** The sign over the door, and its name on the map; empty for a door with no sign. */
  label: string
  style: DoorStyle
  /** How big it stands, against the doors as the museum was built (1). */
  scale: number
  to: DoorRoom
  /** The paired door in `to`, or null to arrive at that room's entrance. */
  toDoor: string | null
  /** A hall door standing under a painting, which hangs higher to make room, instead of between paintings. */
  under: boolean
  /** A hall door kept by a guide: it does not open by itself; talking to the guide takes the visitor through. */
  guide: DoorGuide | null
}

export interface DoorGuide {
  /** The museum character who stands beside the door (an id from the cast). */
  npc: string
  /** What they say, one speech bubble each, before offering to take the visitor through. */
  lines: string[]
}

export const MAX_GUIDE_LINES = 6
export const MAX_GUIDE_LINE = 240

export interface DoorRoomSpec {
  id: DoorRoom
  label: string
  /** Where a door may stand, in world units; the hall's doors stay in the entrance, off the gallery walls. */
  minX: number
  maxX: number
}

export const DOOR_ROOMS: readonly DoorRoomSpec[] = [
  // The hall runs on as far as its paintings go; its paintings make room for the doors.
  { id: 'hall', label: 'The hall', minX: -3.6, maxX: 2000 },
  { id: 'atelier', label: 'The fashion area', minX: -3.1, maxX: 10.6 },
  { id: 'pond', label: 'The pond', minX: -5.6, maxX: 12.6 },
]

export const DOOR_STYLES: readonly { id: DoorStyle; label: string }[] = [
  { id: 'gallery', label: 'Gold curtain arch' },
  { id: 'forest', label: 'Forest gate' },
  { id: 'front', label: 'Pink door' },
]

/** The doors as the museum was built, before anything was moved in the studio. */
export const DEFAULT_DOORS: readonly MuseumDoor[] = [
  { id: 'atelier', room: 'hall', x: -3.6, label: 'Costume Atelier', style: 'gallery', scale: 1, to: 'atelier', toDoor: 'gallery', under: false, guide: null },
  { id: 'gallery', room: 'atelier', x: -3.1, label: 'To the hall', style: 'gallery', scale: 1, to: 'hall', toDoor: 'atelier', under: false, guide: null },
  { id: 'hall', room: 'pond', x: -5.6, label: 'To the museum', style: 'forest', scale: 1, to: 'hall', toDoor: null, under: false, guide: null },
]

export const MIN_DOOR_SCALE = 0.3
export const MAX_DOOR_SCALE = 1.6
/** A door's height at size 1, in world units, and each style's picture's width over its height. */
export const DOOR_HEIGHT = 2.8
export const DOOR_ASPECT: Record<DoorStyle, number> = { gallery: 1112 / 1590, forest: 1169 / 1740, front: 633 / 858 }

/** How wide a door stands on its wall. */
export function doorWidth(door: Pick<MuseumDoor, 'style' | 'scale'>): number {
  return DOOR_HEIGHT * door.scale * DOOR_ASPECT[door.style]
}

/** The pond's forest gate is painted into its hedge: it stays where it is, leads back to the hall, and cannot be taken away. */
export const FIXED_DOORS: readonly Pick<MuseumDoor, 'id' | 'room' | 'x' | 'to' | 'toDoor'>[] = [
  { id: 'hall', room: 'pond', x: -5.6, to: 'hall', toDoor: null },
]

export function isFixedDoor(door: Pick<MuseumDoor, 'id' | 'room'>): boolean {
  return FIXED_DOORS.some((fixed) => fixed.id === door.id && fixed.room === door.room)
}

export const MAX_DOORS = 24
const MAX_LABEL = 40
const ID = /^[a-z0-9-]{1,24}$/
/** Doors in one room keep at least this much wall between them, so neither hides the other. */
export const DOOR_GAP = 0.2

const tooClose = (a: Pick<MuseumDoor, 'x' | 'style' | 'scale'>, b: Pick<MuseumDoor, 'x' | 'style' | 'scale'>) =>
  Math.abs(a.x - b.x) < (doorWidth(a) + doorWidth(b)) / 2 + DOOR_GAP - 1e-6

export function doorRoom(id: string): DoorRoomSpec | null {
  return DOOR_ROOMS.find((room) => room.id === id) ?? null
}

const isStyle = (value: unknown): value is DoorStyle => DOOR_STYLES.some((style) => style.id === value)

function doorOf(value: unknown): MuseumDoor | null {
  if (typeof value !== 'object' || value === null) return null
  const { id, room, x, label, style, to, toDoor } = value as Record<string, unknown>
  // Doors saved before they had a size stand at size 1.
  const scale = (value as Record<string, unknown>).scale ?? 1
  if (typeof scale !== 'number' || !Number.isFinite(scale) || scale < MIN_DOOR_SCALE - 1e-6 || scale > MAX_DOOR_SCALE + 1e-6) return null
  if (typeof id !== 'string' || !ID.test(id)) return null
  const spec = typeof room === 'string' ? doorRoom(room) : null
  if (!spec || typeof to !== 'string' || !doorRoom(to) || to === room) return null
  if (typeof x !== 'number' || !Number.isFinite(x) || x < spec.minX - 1e-6 || x > spec.maxX + 1e-6) return null
  if (typeof label !== 'string' || label.length > MAX_LABEL) return null
  if (!isStyle(style)) return null
  if (toDoor !== null && (typeof toDoor !== 'string' || !ID.test(toDoor))) return null
  // Only a hall door can stand under a painting or have a guide; doors saved before these have neither.
  const under = spec.id === 'hall' && (value as Record<string, unknown>).under === true
  const rawGuide = (value as Record<string, unknown>).guide ?? null
  const guide = rawGuide === null ? null : guideOf(rawGuide)
  if (rawGuide !== null && (!guide || spec.id !== 'hall')) return null
  return { id, room: spec.id, x, label: label.trim(), style, scale, to: to as DoorRoom, toDoor, under, guide }
}

function guideOf(value: unknown): DoorGuide | null {
  if (typeof value !== 'object' || value === null) return null
  const { npc, lines } = value as Record<string, unknown>
  if (typeof npc !== 'string' || !/^[a-z]{1,24}$/.test(npc)) return null
  if (!Array.isArray(lines) || lines.length === 0 || lines.length > MAX_GUIDE_LINES) return null
  const kept = lines.map((line) => (typeof line === 'string' ? line.trim() : ''))
  if (kept.some((line) => line.length === 0 || line.length > MAX_GUIDE_LINE)) return null
  return { npc, lines: kept }
}

export type DoorsCheck = { ok: true; doors: MuseumDoor[] } | { ok: false; reason: string }

/** Parses and checks a whole set: ids unique, pairs pointing at each other, doors not on top of one another. */
export function checkDoors(raw: unknown): DoorsCheck {
  if (!Array.isArray(raw) || raw.length > MAX_DOORS) return { ok: false, reason: 'not_a_list' }
  const doors: MuseumDoor[] = []
  for (const value of raw) {
    const door = doorOf(value)
    if (!door) return { ok: false, reason: 'bad_door' }
    doors.push(door)
  }
  const byId = new Map(doors.map((door) => [door.id, door]))
  if (byId.size !== doors.length) return { ok: false, reason: 'duplicate_id' }
  for (const fixed of FIXED_DOORS) {
    const door = byId.get(fixed.id)
    if (!door || door.room !== fixed.room || door.x !== fixed.x || door.to !== fixed.to || door.toDoor !== fixed.toDoor) {
      return { ok: false, reason: 'fixed_door' }
    }
  }
  for (const door of doors) {
    if (door.toDoor === null) continue
    const partner = byId.get(door.toDoor)
    if (!partner || partner.room !== door.to || partner.to !== door.room || partner.toDoor !== door.id) {
      return { ok: false, reason: 'unpaired' }
    }
  }
  for (const a of doors) {
    for (const b of doors) {
      if (a !== b && a.room === b.room && tooClose(a, b)) return { ok: false, reason: 'too_close' }
    }
  }
  return { ok: true, doors }
}

function freshId(doors: readonly MuseumDoor[], base: string): string {
  const taken = new Set(doors.map((door) => door.id))
  for (let n = 1; ; n++) {
    const id = `${base}-${n}`
    if (!taken.has(id)) return id
  }
}

/** A place in `room` clear of its other doors, nearest the wanted x, for a door of the given look. */
export function freeSpot(
  doors: readonly MuseumDoor[],
  room: DoorRoom,
  wanted: number,
  look: Pick<MuseumDoor, 'style' | 'scale'> = { style: 'gallery', scale: 1 },
  ignore?: string,
): number | null {
  const spec = doorRoom(room)!
  const others = doors.filter((door) => door.room === room && door.id !== ignore)
  const fits = (x: number) => x >= spec.minX && x <= spec.maxX && others.every((other) => !tooClose(other, { ...look, x }))
  const start = Math.min(spec.maxX, Math.max(spec.minX, wanted))
  for (let step = 0; step <= 4000; step++) {
    for (const x of [start + step / 10, start - step / 10]) {
      const rounded = Math.round(x * 100) / 100
      if (fits(rounded)) return rounded
    }
  }
  return null
}

const ROOM_LABEL = (room: DoorRoom) => doorRoom(room)!.label.replace(/^The /, 'the ')

/** A guide's offer to take the visitor through their door. */
export function guideOffer(door: Pick<MuseumDoor, 'to'>): string {
  return `Take me to ${ROOM_LABEL(door.to)}`
}

/** What a door is called: its sign, or where it goes when it has none. */
export function doorName(door: Pick<MuseumDoor, 'label' | 'to'>): string {
  return door.label || `To ${ROOM_LABEL(door.to)}`
}

/** Adds a door in `room` to `to`, with its way back in `to`. */
export function addPassage(doors: readonly MuseumDoor[], room: DoorRoom, to: DoorRoom, x: number): DoorsCheck {
  if (room === to) return { ok: false, reason: 'same_room' }
  if (doors.length + 2 > MAX_DOORS) return { ok: false, reason: 'too_many' }
  const style: DoorStyle = to === 'pond' ? 'forest' : 'gallery'
  const backStyle: DoorStyle = room === 'pond' ? 'forest' : 'gallery'
  const here = freeSpot(doors, room, x, { style, scale: 1 })
  // A fixed door already leads back (the pond's gate to the hall): arrive at its entrance, add no second way back.
  if (FIXED_DOORS.some((fixed) => fixed.room === to && fixed.to === room)) {
    if (here === null) return { ok: false, reason: 'no_room' }
    const id = freshId(doors, `${room}-${to}`)
    return checkDoors([...doors, { id, room, x: here, label: `To ${ROOM_LABEL(to)}`, style, scale: 1, to, toDoor: null, under: false, guide: null }])
  }
  const there = freeSpot(doors, to, doorRoom(to)!.minX, { style: backStyle, scale: 1 })
  if (here === null || there === null) return { ok: false, reason: 'no_room' }
  const id = freshId(doors, `${room}-${to}`)
  const backId = freshId([...doors, { id } as MuseumDoor], `${to}-${room}`)
  return checkDoors([
    ...doors,
    { id, room, x: here, label: `To ${ROOM_LABEL(to)}`, style, scale: 1, to, toDoor: backId, under: false, guide: null },
    { id: backId, room: to, x: there, label: `To ${ROOM_LABEL(room)}`, style: backStyle, scale: 1, to: room, toDoor: id, under: false, guide: null },
  ])
}

/** Removes a door and its partner. */
export function removeDoor(doors: readonly MuseumDoor[], id: string): MuseumDoor[] {
  const door = doors.find((d) => d.id === id)
  if (!door || isFixedDoor(door) || doors.some((d) => d.id === door.toDoor && isFixedDoor(d))) return [...doors]
  return doors.filter((d) => d.id !== id && d.id !== door.toDoor)
}

/** Changes one door's place, sign or look; its partner is untouched. */
export function editDoor(
  doors: readonly MuseumDoor[],
  id: string,
  change: Partial<Pick<MuseumDoor, 'x' | 'label' | 'style' | 'scale' | 'under' | 'guide'>>,
): DoorsCheck {
  if (!doors.some((door) => door.id === id)) return { ok: false, reason: 'unknown_door' }
  return checkDoors(doors.map((door) => (door.id === id ? { ...door, ...change } : door)))
}

/** Where a door leads: its partner, or the entrance of the room it opens into. */
export function doorTarget(doors: readonly MuseumDoor[], room: string, id: string): { room: DoorRoom; door: string | null } | null {
  const door = doors.find((d) => d.room === room && d.id === id)
  return door ? { room: door.to, door: door.toDoor } : null
}
