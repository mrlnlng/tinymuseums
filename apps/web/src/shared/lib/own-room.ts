import { useSyncExternalStore } from 'react'

/**
 * Whether the page shows the visitor's own room. Their room lives at /museum/r/<slug>, so the
 * path alone cannot tell; the room says so while it is open.
 */
let inOwnRoom = false
const listeners = new Set<() => void>()

export function setInOwnRoom(next: boolean): void {
  if (next === inOwnRoom) return
  inOwnRoom = next
  for (const listener of listeners) listener()
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useInOwnRoom(): boolean {
  return useSyncExternalStore(subscribe, () => inOwnRoom, () => false)
}
