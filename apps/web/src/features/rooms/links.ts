import { doorTarget } from '@tiny/core/rooms'
import { museumDoors } from './doors.ts'
import type { DoorRef } from './types.ts'

/** Doors that leave the room system for a page of their own. */
const EXITS: readonly (readonly [DoorRef, DoorRef])[] = [
  [{ room: 'personal', door: 'hall' }, { room: 'hall', door: 'entrance' }],
]

const isDoor = (door: DoorRef, room: DoorRef['room'], name: string) => door.room === room && door.door === name

/** Where a door leads: the door paired with it, or `entrance` for the room's own way in. */
export function linkedDoor(from: DoorRef): DoorRef | null {
  for (const [exit, to] of EXITS) {
    if (isDoor(from, exit.room, exit.door)) return to
  }
  const to = doorTarget(museumDoors(), from.room, from.door)
  return to ? { room: to.room, door: to.door ?? 'entrance' } : null
}

const ROOM_PATH: Partial<Record<DoorRef['room'], string>> = {
  hall: '/museum',
  atelier: '/museum/atelier',
  pond: '/museum/pond',
}

export function hrefFor(to: DoorRef): string {
  const path = ROOM_PATH[to.room] ?? '/museum'
  return to.door === 'entrance' || !ROOM_PATH[to.room] ? path : `${path}?from=${encodeURIComponent(to.door)}`
}
