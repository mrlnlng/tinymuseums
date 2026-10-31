import { coverFloorTransition } from '../lib/floor-transition'
import { CONFIG } from './config'
import { FLOOR_FEET } from './flights'
import type { Traversal } from './traversal'

/** Where the character is while the stairs drive it. */
export interface StairMotion {
  x: number
  centerY: number
  velocity: number
  /** How far the camera has risen (or sunk) with the climb. */
  rise: number
}

/** A standing place: x and the height of the feet. */
export interface StairStep {
  x: number
  feet: number
}

export interface Stairway {
  /** True from the first step of a leave or arrival until the character is back on the floor. */
  readonly busy: boolean
  /** True while the stairs, not the visitor, move the character. */
  readonly locked: boolean
  /** Walk to the stairs and hop onto them; once the dip covers the screen, `covered` runs. */
  leave(covered: () => void): void
  /** Appear on the stairs and hop down onto this floor, then step clear. */
  arrive(): void
  update(dt: number): StairMotion | null
  dispose(): void
}

type Phase = 'idle' | 'approach' | 'hop' | 'settle' | 'parked'

interface Options {
  traversal: Traversal
  /** This floor's foot of the stairs, then each step towards the other floor. */
  steps: readonly StairStep[]
  /** Where the character stands once clear of the stairs. */
  clearX: number
  dip: HTMLElement
}

const { stairs } = CONFIG
const smooth = (t: number) => t * t * (3 - 2 * t)

export function createStairway({ traversal, steps, clearX, dip }: Options): Stairway {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const last = steps.length - 1
  let phase: Phase = 'idle'
  // The hop runs from steps[at] to steps[at + direction].
  let at = 0
  let direction = 1
  let t = 0
  let covered: (() => void) | null = null
  let dipOpacity = 0
  // The first hop leaves from wherever the walk to the stairs ended.
  let takeoff: number | null = null
  const motion: StairMotion = { x: 0, centerY: 0, velocity: 0, rise: 0 }

  function setDip(opacity: number): void {
    dipOpacity = opacity
    dip.hidden = opacity <= 0.001
    dip.style.opacity = opacity.toFixed(3)
  }

  function place(x: number, feet: number, velocity: number): StairMotion {
    motion.x = x
    motion.centerY = CONFIG.character.centerY + (feet - FLOOR_FEET)
    motion.velocity = velocity
    motion.rise = (feet - FLOOR_FEET) * stairs.cameraRise
    return motion
  }

  return {
    get busy() {
      return phase !== 'idle'
    },

    get locked() {
      return phase === 'hop' || phase === 'parked'
    },

    leave(onCovered) {
      if (phase !== 'idle') return
      covered = onCovered
      phase = 'approach'
      traversal.hold(steps[0].x, true)
    },

    arrive() {
      if (phase !== 'idle') return
      covered = null
      if (reduced) {
        traversal.reset(clearX)
        return
      }
      phase = 'hop'
      takeoff = null
      at = last
      direction = -1
      t = 0
    },

    update(dt) {
      if (phase === 'approach') {
        if (!traversal.isFollowing && !traversal.isHeld) {
          phase = 'idle'
          traversal.hold(null)
          return null
        }
        // Hop as soon as the walk nears the stairs, rather than after its slow final creep.
        if (!traversal.isHeld && Math.abs(traversal.x - steps[0].x) > 0.3) return null
        takeoff = traversal.x
        phase = 'hop'
        at = 0
        direction = 1
        t = 0
      }

      if (phase === 'settle') {
        if (!traversal.isHeld) return null
        traversal.hold(null)
        phase = 'idle'
        return null
      }

      // A finished leave stays on the stairs behind the dip while the page changes.
      if (phase === 'parked') return motion
      if (phase !== 'hop') return null

      if (reduced && covered) {
        // No hops: stand at the stairs while the dip fades in.
        setDip(Math.min(1, dipOpacity + dt / stairs.dipSeconds))
      } else {
        t = Math.min(1, t + dt / stairs.hopSeconds)
      }
      const from = at === 0 && takeoff !== null ? { x: takeoff, feet: steps[0].feet } : steps[at]
      const to = steps[reduced && covered ? at : at + direction]
      const k = smooth(t)
      const x = from.x + (to.x - from.x) * k
      const feet = from.feet + (to.feet - from.feet) * k + stairs.hopLift * Math.sin(Math.PI * t)
      const velocity = ((to.x - from.x) * 6 * t * (1 - t)) / stairs.hopSeconds
      place(x, feet, velocity)

      if (covered) {
        // The dip covers the last hop, so the page changes behind solid colour.
        if (!reduced && at + direction === last) setDip(Math.max(dipOpacity, t))
        if (t >= 1 && at + direction < last) {
          takeoff = null
          at += direction
          t = 0
        } else if ((t >= 1 || reduced) && dipOpacity >= 1) {
          const done = covered
          covered = null
          phase = 'parked'
          place(to.x, to.feet, 0)
          coverFloorTransition()
          done()
        }
        return motion
      }

      if (t >= 1) {
        at += direction
        t = 0
        if (at === 0) {
          // Back on the floor: step clear of the stairs.
          traversal.reset(to.x)
          traversal.hold(clearX, true)
          phase = 'settle'
          place(to.x, to.feet, 0)
        }
      }
      return motion
    },

    dispose() {
      dip.remove()
    },
  }
}
