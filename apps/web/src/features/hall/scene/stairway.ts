import { coverFloorTransition } from '../lib/floor-transition'
import { CONFIG } from './config'
import { FLOOR_FEET, climbSpan, feetOn, type Flight } from './flights'
import type { Traversal } from './traversal'

/** Where the character and camera are while the stairs drive them. */
export interface StairMotion {
  x: number
  centerY: number
  velocity: number
  /** How far the camera has risen above the floor's usual framing. */
  rise: number
}

export interface Stairway {
  /** True from the first step of a leave or arrival until the character is back on the floor. */
  readonly busy: boolean
  /** True while the stairs, not the visitor, move the character. */
  readonly locked: boolean
  /**
   * Walk to this floor's end of the flight and climb towards the other floor; once the dip
   * covers the screen, `covered` runs (the caller changes page).
   */
  leave(covered: () => void): void
  /** Appear part-way along the flight and climb onto this floor, then step clear. */
  arrive(): void
  update(dt: number): StairMotion | null
  dispose(): void
}

type Phase = 'idle' | 'approach' | 'climb' | 'settle'

interface Options {
  traversal: Traversal
  flight: Flight
  /** Which way this floor's end of the flight lies: the lobby is at its foot, the atelier at its top. */
  end: 'foot' | 'top'
  /** Where the character stands once clear of the stairs. */
  clearX: number
  dip: HTMLElement
}

const { stairs } = CONFIG

export function createStairway({ traversal, flight, end, clearX, dip }: Options): Stairway {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const span = climbSpan(flight)
  const near = end === 'foot' ? 0 : 1
  const far = end === 'foot' ? stairs.dipAt : 1 - stairs.dipAt
  let phase: Phase = 'idle'
  let from = 0
  let to = 0
  let t = 0
  let covered: (() => void) | null = null
  let dipOpacity = 0
  let lastX = 0
  const motion: StairMotion = { x: 0, centerY: 0, velocity: 0, rise: 0 }

  function setDip(opacity: number): void {
    dipOpacity = opacity
    dip.hidden = opacity <= 0.001
    dip.style.opacity = opacity.toFixed(3)
  }

  const xAt = (progress: number) => span.from + (span.to - span.from) * progress

  function climb(start: number, finish: number): void {
    phase = 'climb'
    from = start
    to = finish
    t = 0
    lastX = xAt(start)
  }

  return {
    get busy() {
      return phase !== 'idle'
    },

    get locked() {
      return phase === 'climb'
    },

    leave(onCovered) {
      if (phase !== 'idle') return
      covered = onCovered
      phase = 'approach'
      traversal.hold(xAt(near), true)
    },

    arrive() {
      if (phase !== 'idle') return
      covered = null
      if (reduced) {
        traversal.reset(clearX)
        return
      }
      climb(far, near)
    },

    update(dt) {
      if (phase === 'approach') {
        if (!traversal.isFollowing && !traversal.isHeld) {
          phase = 'idle'
          traversal.hold(null)
          return null
        }
        if (!traversal.isHeld) return null
        if (reduced) {
          // No climb: stand at the stairs while the dip fades in.
          climb(near, near)
        } else {
          climb(near, far)
        }
      }

      if (phase === 'settle') {
        if (!traversal.isHeld) return null
        traversal.hold(null)
        phase = 'idle'
        return null
      }

      if (phase !== 'climb') return null

      const length = Math.abs(to - from)
      const seconds = length > 0 ? stairs.climbSeconds * length : stairs.dipSeconds
      t = Math.min(1, t + dt / seconds)
      const progress = from + (to - from) * t

      // Leaving dips over its last stretch, so the page changes behind solid colour.
      if (covered) {
        const remaining = (1 - t) * seconds
        setDip(Math.min(1, Math.max(dipOpacity, 1 - remaining / stairs.dipSeconds)))
        if (t >= 1 && dipOpacity >= 1) {
          const done = covered
          covered = null
          coverFloorTransition()
          done()
        }
      }

      const x = xAt(progress)
      const feet = feetOn(flight, x)
      motion.x = x
      motion.centerY = CONFIG.character.centerY + (feet - FLOOR_FEET)
      motion.rise = feet - FLOOR_FEET
      motion.velocity = dt > 0 ? (x - lastX) / dt : 0
      lastX = x

      // A finished leave stays parked here behind the dip while the page changes.
      if (t >= 1 && covered === null && dipOpacity < 1) {
        // An arrival ends on the floor; step clear of the stairs.
        traversal.reset(x)
        traversal.hold(clearX, true)
        phase = 'settle'
      }
      return motion
    },

    dispose() {
      dip.remove()
    },
  }
}
