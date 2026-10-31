import { CONFIG } from './config.ts'
import type { StairStep } from './stairway.ts'

const { stairs } = CONFIG
const [drawingWidth, drawingHeight] = stairs.drawing
// Both floors draw the flight at the same size, so it reads as one staircase.
const s = stairs.unitsPerPx * stairs.scale
// On a tread the feet sit just in front of the step's edge.
const TREAD_DEPTH = -0.12
const RISER = 74

/** Where the standing character's feet are on flat floor, in front of the wall. */
export const FLOOR_FEET = CONFIG.character.centerY - CONFIG.character.height / 2

// Keep the mock's step size while continuing the flight above the visible ceiling.
export const LOBBY_EXTENSION = 400
export const lobbyTreads: [number, number][] = stairs.treads.map(([x, y]) => [x, y + LOBBY_EXTENSION])
for (let i = 0; i < 8; i++) {
  const [x, y] = lobbyTreads[lobbyTreads.length - 1]
  lobbyTreads.push([x + 94, y - RISER])
}
export const lobbyDrawing: [number, number] = [lobbyTreads[lobbyTreads.length - 1][0] + 94, drawingHeight + LOBBY_EXTENSION]

/** One placement of a staircase drawing, in world units. */
export interface Flight {
  left: number
  base: number
  width: number
  height: number
}

const at = (flight: Flight, px: number) => flight.left + px * s

/** The lobby's flight rises rightwards from its foot to the post beside the door (mock 3.png). */
export const lobbyFlight: Flight = {
  left: stairs.lobby.postX - stairs.post * s,
  base: stairs.lobby.baseY,
  width: lobbyDrawing[0] * s,
  height: lobbyDrawing[1] * s,
}

const lobbyTread = (index: number) => lobbyFlight.base + (lobbyDrawing[1] - lobbyTreads[index][1]) * s + TREAD_DEPTH
const middle = (index: number) => (lobbyTreads[index][0] + lobbyTreads[index + 1][0]) / 2

/** The floor at the foot of the lobby flight, then the first two steps up. */
export const lobbySteps: StairStep[] = [
  { x: at(lobbyFlight, 40), feet: FLOOR_FEET },
  { x: at(lobbyFlight, middle(1)), feet: lobbyTread(1) },
  { x: at(lobbyFlight, middle(2)), feet: lobbyTread(2) },
]

/** Upstairs, the top of the same flight comes up through a stairwell; its landing meets the floor. */
export function atelierFlight(landingRight: number, floorY: number): Flight {
  return {
    left: landingRight - drawingWidth * s,
    base: floorY - (drawingHeight - stairs.landing.y) * s,
    width: drawingWidth * s,
    height: drawingHeight * s,
  }
}

/** The landing, then two steps down. The feet keep the floor's depth in front of each tread. */
export function atelierSteps(flight: Flight): StairStep[] {
  const treads = stairs.treads
  const last = treads.length - 1
  return [
    { x: at(flight, stairs.landing.x + 110), feet: FLOOR_FEET },
    { x: at(flight, (treads[last - 1][0] + treads[last][0]) / 2), feet: FLOOR_FEET - RISER * s },
    { x: at(flight, (treads[last - 2][0] + treads[last - 1][0]) / 2), feet: FLOOR_FEET - 2 * RISER * s },
  ]
}

