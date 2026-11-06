import type { DoorRef } from './types'

const LINKS: readonly (readonly [DoorRef, DoorRef])[] = [
  [{ room: 'hall', door: 'atelier' }, { room: 'atelier', door: 'gallery' }],
]

const isDoor = (door: DoorRef, room: DoorRef['room'], name: string) => door.room === room && door.door === name

export function linkedDoor(from: DoorRef): DoorRef | null {
  for (const [a, b] of LINKS) {
    if (isDoor(from, a.room, a.door)) return b
    if (isDoor(from, b.room, b.door)) return a
  }
  return null
}

export function hrefFor(to: DoorRef): string {
  if (isDoor(to, 'hall', 'atelier')) return '/museum?from=atelier'
  if (isDoor(to, 'atelier', 'gallery')) return '/museum/atelier'
  return '/museum'
}
