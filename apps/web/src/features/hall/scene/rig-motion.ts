const WALK_BLEND_SECONDS = 0.18
const TURN_SECONDS = 0.18
const MIN_STEP_RATE = 0.6
const AIR_BLEND_SECONDS = 0.08
// Keyboard walking is faster than the hall's top speed; the steps keep up so the feet do not slide.
const MAX_STEP_RATE = 1.5

/** Motion the caller advances with stepRigState and hands to render each frame. */
export interface RigState {
  phase: number
  /** 0 at rest, 1 fully walking. */
  walk: number
  /** 1 faces right, -1 faces left; between is mid-turn. */
  turn: number
  /** Walking speed as a fraction of the hall's top speed. */
  speed: number
  /** Below 0 squashes the body, above 0 stretches it, as a fraction of its height. */
  squash: number
  /** 1 rising at take-off speed, -1 falling as fast, 0 at the top of a jump. */
  rise: number
  /** 0 on the floor, 1 fully in the air; blends the jumping pose in and out. */
  air: number
  /** How far off the floor, as a fraction of the jump's height. */
  lift: number
  /** Extra in-plane turns in degrees, counterclockwise for a right-facing rig, for NPC idles. */
  bend?: { head?: number; armBack?: number; armFront?: number; tail?: number }
}

/** The jump as the traversal sees it, handed to stepRigState each frame. */
export interface JumpPose {
  squash: number
  rise: number
  lift: number
  airborne: boolean
}

export const GROUNDED: JumpPose = { squash: 0, rise: 0, lift: 0, airborne: false }

export function createRigState(facing: 'left' | 'right' = 'right'): RigState {
  return { phase: 0, walk: 0, turn: facing === 'right' ? 1 : -1, speed: 0, squash: 0, rise: 0, air: 0, lift: 0 }
}

export function rigFacing(state: RigState): 'left' | 'right' {
  return state.turn >= 0 ? 'right' : 'left'
}

const approach = (value: number, target: number, step: number) =>
  value < target ? Math.min(target, value + step) : Math.max(target, value - step)

export function stepRigState(
  state: RigState,
  dt: number,
  moving: boolean,
  facing: 'left' | 'right',
  speed: number,
  cycleSeconds: number,
  jump: JumpPose = GROUNDED,
): void {
  if (moving && state.walk === 0) state.phase = 0
  state.walk = approach(state.walk, moving ? 1 : 0, dt / WALK_BLEND_SECONDS)
  state.speed = moving ? speed : 0
  // The steps slow as the bunny eases in and quicken with its speed.
  const rate = Math.min(MAX_STEP_RATE, Math.max(MIN_STEP_RATE, speed))
  if (state.walk > 0) state.phase = (state.phase + (dt / cycleSeconds) * rate) % 1
  state.turn = approach(state.turn, facing === 'right' ? 1 : -1, (dt * 2) / TURN_SECONDS)
  state.squash = jump.squash
  state.rise = jump.rise
  state.lift = jump.lift
  state.air = approach(state.air, jump.airborne ? 1 : 0, dt / AIR_BLEND_SECONDS)
}
