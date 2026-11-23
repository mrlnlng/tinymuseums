import { DEFAULT_DOORS, doorName, doorRoom, type DoorRoom, type MuseumDoor } from '@tiny/core/rooms'
import type { DoorDef } from './types.ts'

// The doors the owner published from the studio. The museum layout sets them once per page load,
// before any room is built; until then (and in tests) they are the doors as the museum was built.

let current: readonly MuseumDoor[] = DEFAULT_DOORS

export function setMuseumDoors(doors: readonly MuseumDoor[]): void {
  current = doors
}

export function museumDoors(): readonly MuseumDoor[] {
  return current
}

export function doorsOf(room: DoorRoom): MuseumDoor[] {
  return current.filter((door) => door.room === room).sort((a, b) => a.x - b.x)
}

/** How far in from a door a visitor coming through it stops. */
const CLEAR = 0.85

/** A room's doors as the stage uses them; arriving, the visitor steps away from the nearer wall. */
export function doorDefs(room: DoorRoom): Record<string, DoorDef> {
  const spec = doorRoom(room)!
  return Object.fromEntries(doorsOf(room).map((door) => {
    const clearX = door.x + CLEAR <= spec.maxX + CLEAR / 2 ? door.x + CLEAR : door.x - CLEAR
    return [door.id, { x: door.x, clearX, label: doorName(door) }]
  }))
}
