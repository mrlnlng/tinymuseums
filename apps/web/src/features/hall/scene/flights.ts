import { CONFIG } from './config.ts'

const { stairs } = CONFIG
const [drawingWidth, drawingHeight] = stairs.drawing
const s = stairs.unitsPerPx
const RISER_EASE = 0.16
const RISER_PX = 74

/** Where the standing character's feet are on flat floor, in front of the wall. */
export const FLOOR_FEET = CONFIG.character.centerY - CONFIG.character.height / 2

/** One placement of the staircase drawing: its left edge and its bottom edge in world units. */
export interface Flight {
  left: number
  base: number
  /** Whether a floor meets the bottom step; upstairs the flight rises out of an open stairwell. */
  footOnFloor: boolean
}

export const flightWidth = drawingWidth * s
export const flightHeight = drawingHeight * s
export const flightRise = (drawingHeight - stairs.landing.y) * s

export const lobbyFlight: Flight = {
  left: stairs.lobby.postX - stairs.post * s,
  base: stairs.lobby.baseY,
  footOnFloor: true,
}

/** Upstairs the drawing ends at the atelier's local origin, its landing level with the floor. */
export function atelierFlight(originX: number): Flight {
  return { left: originX - flightWidth, base: -flightRise, footOnFloor: false }
}

export function stairX(flight: Flight, px: number): number {
  return flight.left + px * s
}

const smooth = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t))

// On the treads the feet sit just in front of each step's edge; on the floor they stand further
// forward, so the walk eases between the two over the first step and across the landing.
const TREAD_DEPTH = -0.12
const ONTO_STAIRS = 0.45

/**
 * Feet height at x on a flight: the floor before the first step, then each tread, easing up
 * across every riser, then the floor again past the landing. Both ends meet the floor's own
 * standing height, so a climb starts and ends with no jump.
 */
export function feetOn(flight: Flight, x: number): number {
  const tread = (py: number) => flight.base + (drawingHeight - py) * s
  let top = tread(stairs.treads[0][1])
  let previous = stairs.treads[0][1]
  for (const [px, py] of stairs.treads.slice(1)) {
    const riser = stairX(flight, px)
    // A taller riser (the bottom block is two steps high) is climbed over a longer stride.
    const ease = RISER_EASE * Math.max(1, (previous - py) / RISER_PX)
    top += (tread(py) - top) * smooth((x - riser + ease / 2) / ease)
    previous = py
  }
  const landingLeft = stairX(flight, stairs.landing.x)
  const landingRight = flight.left + flightWidth
  const ontoFirstStep = flight.footOnFloor ? smooth((x - flight.left) / ONTO_STAIRS) : 1
  const onStairs = ontoFirstStep * (1 - smooth((x - landingLeft) / (landingRight - landingLeft)))
  return FLOOR_FEET + (top + TREAD_DEPTH - FLOOR_FEET) * onStairs
}

/** The walk up a flight, from the floor at its foot to the floor just past its landing. */
export function climbSpan(flight: Flight): { from: number; to: number } {
  return { from: flight.left - 0.1, to: flight.left + flightWidth + 0.1 }
}
