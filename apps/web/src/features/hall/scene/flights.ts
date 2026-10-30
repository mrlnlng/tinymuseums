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
  /** The lobby continues beyond the ceiling; upstairs uses the compact landing drawing. */
  scale?: number
  drawing?: readonly [number, number]
  treads?: readonly (readonly [number, number])[]
  landing?: { x: number; y: number }
}

export const flightWidth = drawingWidth * s
export const flightHeight = drawingHeight * s
export const flightRise = (drawingHeight - stairs.landing.y) * s

// Keep the mock's step size while continuing the flight above the visible ceiling.
export const LOBBY_EXTENSION = 400
export const lobbyTreads: [number, number][] = stairs.treads.map(([x, y]) => [x, y + LOBBY_EXTENSION])
for (let i = 0; i < 8; i++) {
  const [x, y] = lobbyTreads[lobbyTreads.length - 1]
  lobbyTreads.push([x + 94, y - 74])
}
export const lobbyDrawing: [number, number] = [lobbyTreads[lobbyTreads.length - 1][0] + 94, drawingHeight + LOBBY_EXTENSION]

export const lobbyFlight: Flight = {
  left: stairs.lobby.postX - stairs.post * s * stairs.lobby.scale,
  base: stairs.lobby.baseY,
  footOnFloor: true,
  scale: stairs.lobby.scale,
  drawing: lobbyDrawing,
  treads: lobbyTreads,
  landing: { x: lobbyTreads.at(-1)![0], y: lobbyTreads.at(-1)![1] },
}

/** Upstairs the drawing ends at the atelier's local origin, its landing level with the floor. */
export function atelierFlight(originX: number): Flight {
  return { left: originX - flightWidth, base: -flightRise, footOnFloor: false }
}

export function stairX(flight: Flight, px: number): number {
  return flight.left + px * s * (flight.scale ?? 1)
}

const smooth = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t))

// On the treads the feet sit just in front of each step's edge; on the floor they stand further
// forward, so the walk eases between the two over the first step and across the landing.
const TREAD_DEPTH = -0.12
const ONTO_STAIRS = 0.45

/**
 * Feet height at x on a flight: the floor before the first step, then each tread, easing up
 * across every riser, then the upper floor past the landing. The upstairs drawing meets its local
 * floor smoothly; the lobby flight continues upward until the page transition.
 */
export function feetOn(flight: Flight, x: number): number {
  const scale = flight.scale ?? 1
  const height = flight.drawing?.[1] ?? drawingHeight
  const treads = flight.treads ?? stairs.treads
  const landing = flight.landing ?? stairs.landing
  const tread = (py: number) => flight.base + (height - py) * s * scale
  let top = tread(treads[0][1])
  let previous = treads[0][1]
  for (const [px, py] of treads.slice(1)) {
    const riser = stairX(flight, px)
    // A taller riser (the bottom block is two steps high) is climbed over a longer stride.
    const ease = RISER_EASE * scale * Math.max(1, (previous - py) / RISER_PX)
    top += (tread(py) - top) * smooth((x - riser + ease / 2) / ease)
    previous = py
  }
  const landingLeft = stairX(flight, flight.footOnFloor ? landing.x : stairs.post)
  const landingRight = flight.footOnFloor ? flight.left + flightSize(flight).width : stairX(flight, landing.x)
  const ontoFirstStep = flight.footOnFloor ? smooth((x - flight.left) / ONTO_STAIRS) : 1
  // The lobby's far end is a higher floor, not a drop back to the lobby's floor.
  const onStairs = ontoFirstStep * (flight.footOnFloor ? 1 : 1 - smooth((x - landingLeft) / (landingRight - landingLeft)))
  return FLOOR_FEET + (top + TREAD_DEPTH - FLOOR_FEET) * onStairs
}

/** The walk up a flight, from the floor at its foot to the floor just past its landing. */
export function climbSpan(flight: Flight): { from: number; to: number } {
  return { from: flight.left - 0.1, to: flight.left + flightSize(flight).width + 0.1 }
}

/** The room's front floor meets the post, covering the open wedge under the landing. */
export function atelierFloorEdge(flight: Flight): number {
  return stairX(flight, stairs.post) - 0.025
}

export function flightSize(flight: Flight): { width: number; height: number } {
  const [width, height] = flight.drawing ?? stairs.drawing
  const scale = s * (flight.scale ?? 1)
  return { width: width * scale, height: height * scale }
}
