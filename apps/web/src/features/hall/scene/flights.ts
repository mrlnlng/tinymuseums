import { CONFIG } from './config.ts'
import type { StairStep } from './stairway.ts'

const { stairs } = CONFIG

/** Where the standing character's feet are on flat floor, in front of the wall. */
export const FLOOR_FEET = CONFIG.character.centerY - CONFIG.character.height / 2
// The feet stand this far down a tread's top edge, on its surface.
const ON_TREAD = 0.12

/**
 * A straight flight in world units, running leftwards from its foot. Step 1 is the first step
 * from `floorY` at `foot`; each further step is one `stairs.rise` higher (or lower, going `down`
 * into a stairwell) and one `stairs.run` further left.
 */
export interface Flight {
  foot: number
  /** The top of step 0, which is the floor the flight starts from. */
  floorY: number
  down: boolean
  count: number
}

/** The x range and top edge of step `index` (1-based). */
export function stepBox(flight: Flight, index: number): { left: number; right: number; top: number } {
  const right = flight.foot - (index - 1) * stairs.run
  const top = flight.floorY + (flight.down ? -1 : 1) * index * stairs.rise
  return { left: right - stairs.run, right, top }
}

/** The floor beside the foot, then the middles of the first two steps. */
export function hopSteps(flight: Flight): StairStep[] {
  const middle = (index: number) => {
    const box = stepBox(flight, index)
    return { x: (box.left + box.right) / 2, feet: box.top - ON_TREAD }
  }
  return [{ x: flight.foot + stairs.clear, feet: FLOOR_FEET }, middle(1), middle(2)]
}

/** The lobby flight rises leftwards from a newel post just left of the door. */
export const lobbyFlight: Flight = {
  foot: stairs.lobbyFoot,
  floorY: FLOOR_FEET + ON_TREAD,
  down: false,
  count: 18,
}

/** Upstairs the flight goes down leftwards into a stairwell where the carpet ends. */
export function atelierFlight(edge: number): Flight {
  return { foot: edge, floorY: FLOOR_FEET + ON_TREAD, down: true, count: 9 }
}

export const lobbySteps = hopSteps(lobbyFlight)
