import { coverFloorTransition } from '../lib/floor-transition.ts'
import type { Traversal } from './traversal'

/** Walk into a room doorway and cover the route change; both rooms stay on one level. */
export function createRoomPassage({ traversal, doorX, clearX, dip }: {
  traversal: Traversal
  doorX: number
  clearX: number
  dip: HTMLElement
}) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  let phase: 'idle' | 'approach' | 'fade' | 'parked' | 'arrive' = 'idle'
  let elapsed = 0
  let covered: (() => void) | null = null
  let door = { x: doorX, clearX }
  return {
    get busy() { return phase !== 'idle' },
    get locked() { return phase === 'fade' || phase === 'parked' },
    leave(done: () => void, at = door) {
      if (phase !== 'idle') return
      door = at
      covered = done
      phase = 'approach'
      traversal.hold(at.x, true)
    },
    arrive(at = door) {
      if (phase !== 'idle') return
      door = at
      traversal.reset(reduced ? at.clearX : at.x)
      if (!reduced) {
        traversal.hold(at.clearX, true)
        phase = 'arrive'
      }
    },
    reset() {
      phase = 'idle'
      elapsed = 0
      covered = null
      dip.hidden = true
      dip.style.opacity = '0'
    },
    update(dt: number) {
      if (phase === 'arrive') {
        if (traversal.isHeld || !traversal.isFollowing) {
          traversal.hold(null)
          phase = 'idle'
        }
      }
      if (phase === 'approach') {
        if (!traversal.isHeld && !traversal.isFollowing) {
          covered = null
          phase = 'idle'
        } else if (Math.abs(traversal.x - door.x) < 0.12) {
          traversal.reset(door.x)
          phase = 'fade'
          elapsed = 0
        }
      }
      if (phase === 'fade') {
        elapsed = Math.min(1, elapsed + dt / 0.45)
        dip.hidden = false
        dip.style.opacity = String(elapsed)
        if (elapsed >= 1) {
          const done = covered
          covered = null
          phase = 'parked'
          coverFloorTransition()
          done?.()
        }
      }
    },
    dispose() { dip.remove() },
  }
}
