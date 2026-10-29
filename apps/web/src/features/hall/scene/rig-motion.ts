const WALK_BLEND_SECONDS = 0.18
const TURN_SECONDS = 0.18
const MIN_STEP_RATE = 0.6

/** Motion the caller advances with stepRigState and hands to render each frame. */
export interface RigState {
  phase: number
  /** 0 at rest, 1 fully walking. */
  walk: number
  /** 1 faces right, -1 faces left; between is mid-turn. */
  turn: number
  /** Walking speed as a fraction of the hall's top speed. */
  speed: number
}

export function createRigState(facing: 'left' | 'right' = 'right'): RigState {
  return { phase: 0, walk: 0, turn: facing === 'right' ? 1 : -1, speed: 0 }
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
): void {
  if (moving && state.walk === 0) state.phase = 0
  state.walk = approach(state.walk, moving ? 1 : 0, dt / WALK_BLEND_SECONDS)
  state.speed = moving ? speed : 0
  // Slow the steps as the bunny eases in, but never above the approved pace.
  const rate = Math.min(1, Math.max(MIN_STEP_RATE, speed))
  if (state.walk > 0) state.phase = (state.phase + (dt / cycleSeconds) * rate) % 1
  state.turn = approach(state.turn, facing === 'right' ? 1 : -1, (dt * 2) / TURN_SECONDS)
}
