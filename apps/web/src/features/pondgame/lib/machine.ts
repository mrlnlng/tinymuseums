/**
 * Pure state machines for the fishing view. No DOM, no timers, no React: the
 * orchestrator feeds elapsed seconds in and renders the result. That keeps the
 * beats testable with node:test and makes the 60fps loop a thin adapter.
 */

import type { ShadowSize } from './tables.ts'

export type FishingPhase =
  | 'idle'
  | 'charging'
  | 'flying'
  | 'waiting'
  | 'bite'
  | 'reeling'
  | 'landing'
  | 'reveal'
  | 'lost'

export type LostReason = 'spooked' | 'missed' | 'snap' | 'escaped' | null

export const CHARGE_PERIOD = 1.4
export const SWEET_LOW = 0.78
export const SWEET_HIGH = 0.92
export const FLIGHT_SECONDS = 0.45
export const NIBBLE_SECONDS = 0.26
export const BITE_WINDOW = 1.25
/** A fresh hook does not slip away while a new player works out to hold. */
export const REEL_GRACE_SECONDS = 2.5
export const PERFECT_HOOK_WINDOW = 0.25
export const TREASURE_HOLD_SECONDS = 1.5

export interface FishPoint {
  x: number
  y: number
}

export interface CastArm {
  shadow: ShadowSize
  nibbles: number
  fight: number
  treasure: boolean
}

export interface ReelState {
  progress: number
  tension: number
  elapsed: number
  holding: boolean
  fight: number
  runActive: boolean
  runRemaining: number
  runIn: number
  runDirection: 1 | -1
  runCount: number
  runsLeft: number
  puffIn: number
  treasure: boolean
  treasureRevealed: boolean
  treasureHeld: number
  treasureGrabbed: boolean
  lateTell: 'none' | 'blue' | 'gold'
  outcome: 'landed' | 'snapped' | 'escaped' | null
}

export interface FishingState {
  phase: FishingPhase
  bait: string
  elapsed: number
  chargeTime: number
  power: number
  perfectCast: boolean
  landing: FishPoint
  shadow: ShadowSize | null
  armed: boolean
  waitElapsed: number
  nibblesLeft: number
  nibbleIn: number
  nibbleActive: boolean
  nibbleElapsed: number
  biteIn: number
  biteElapsed: number
  perfectHook: boolean
  fight: number
  treasure: boolean
  reel: ReelState | null
  lostReason: LostReason
}

export interface SafeBand {
  low: number
  high: number
}

export const GOLD_BAND: SafeBand = { low: 0.46, high: 0.59 }

export function safeBand(easy: boolean): SafeBand {
  return easy ? { low: 0.24, high: 0.84 } : { low: 0.32, high: 0.72 }
}

export function createFishingState(bait = 'worm'): FishingState {
  return {
    phase: 'idle',
    bait,
    elapsed: 0,
    chargeTime: 0,
    power: 0,
    perfectCast: false,
    landing: { x: 0.5, y: 0.81 },
    shadow: null,
    armed: false,
    waitElapsed: 0,
    nibblesLeft: 0,
    nibbleIn: 0,
    nibbleActive: false,
    nibbleElapsed: 0,
    biteIn: 0,
    biteElapsed: 0,
    perfectHook: false,
    fight: 0,
    treasure: false,
    reel: null,
    lostReason: null,
  }
}

export function startCharge(state: FishingState): FishingState {
  if (state.phase !== 'idle') return state
  return {
    ...createFishingState(state.bait),
    phase: 'charging',
    chargeTime: 0,
    power: 0,
  }
}

/** The meter sweeps 0 → 1 → 0 once every CHARGE_PERIOD seconds. */
export function chargePower(chargeTime: number): number {
  const cycle = ((chargeTime % CHARGE_PERIOD) + CHARGE_PERIOD) % CHARGE_PERIOD
  const half = CHARGE_PERIOD / 2
  return cycle <= half ? cycle / half : (CHARGE_PERIOD - cycle) / half
}

export function tickCharge(state: FishingState, dt: number): FishingState {
  if (state.phase !== 'charging' || !(dt > 0)) return state
  const chargeTime = state.chargeTime + dt
  return { ...state, chargeTime, power: chargePower(chargeTime) }
}

export function isPerfectPower(power: number): boolean {
  return power >= SWEET_LOW && power <= SWEET_HIGH
}

/** Overcharging plops the bobber short again, so the sweet zone is the deep cast. */
export function landingForPower(power: number, narrow = false): FishPoint {
  const clamped = Math.max(0, Math.min(1, power))
  const reach = clamped <= SWEET_HIGH ? clamped : SWEET_HIGH - (clamped - SWEET_HIGH) * 1.4
  if (narrow) {
    return { x: 0.3 + reach * 0.18, y: 0.83 - reach * 0.06 }
  }
  // The deepest cast stops short of the lily pad (x 0.58 to 0.77), so the bobber never sits on it.
  return { x: 0.34 + reach * 0.25, y: 0.835 - reach * 0.055 }
}

export function releaseCast(state: FishingState, narrow = false): FishingState {
  if (state.phase !== 'charging') return state
  return {
    ...state,
    phase: 'flying',
    elapsed: 0,
    perfectCast: isPerfectPower(state.power),
    landing: landingForPower(state.power, narrow),
  }
}

function waitGap(random: () => number): number {
  return 0.6 + Math.max(0, Math.min(1, random())) * 0.8
}

function biteGap(random: () => number): number {
  return 0.9 + Math.max(0, Math.min(1, random())) * 1.2
}

function scheduleNext(state: FishingState, random: () => number): FishingState {
  if (state.nibblesLeft > 0) return { ...state, nibbleIn: waitGap(random), biteIn: 0 }
  return { ...state, nibbleIn: 0, biteIn: biteGap(random) }
}

export function armCast(
  state: FishingState,
  arm: CastArm,
  random: () => number = Math.random,
): FishingState {
  const armed: FishingState = {
    ...state,
    armed: true,
    shadow: arm.shadow,
    nibblesLeft: Math.max(0, Math.min(3, Math.round(arm.nibbles))),
    fight: Math.max(0, Math.min(3, Math.round(arm.fight))),
    treasure: arm.treasure,
    nibbleActive: false,
    nibbleElapsed: 0,
  }
  return scheduleNext(armed, random)
}

function lost(state: FishingState, reason: Exclude<LostReason, null>): FishingState {
  return { ...state, phase: 'lost', lostReason: reason, reel: null }
}

export function tap(state: FishingState, random: () => number = Math.random): FishingState {
  if (state.phase === 'waiting' && state.armed && state.nibbleActive) {
    return lost(state, 'spooked')
  }
  if (state.phase === 'bite') {
    const perfectHook = state.biteElapsed <= PERFECT_HOOK_WINDOW
    return {
      ...state,
      phase: 'reeling',
      perfectHook,
      reel: createReelState({
        fight: state.fight,
        treasure: state.treasure,
        perfectHook,
        random,
      }),
    }
  }
  return state
}

export function tick(
  state: FishingState,
  dt: number,
  random: () => number = Math.random,
): FishingState {
  if (!(dt > 0)) return state
  if (state.phase === 'bite') {
    const biteElapsed = state.biteElapsed + dt
    if (biteElapsed >= BITE_WINDOW) return lost(state, 'missed')
    return { ...state, biteElapsed }
  }
  if (state.phase === 'flying') {
    const elapsed = state.elapsed + dt
    if (elapsed < FLIGHT_SECONDS) return { ...state, elapsed }
    return { ...state, phase: 'waiting', elapsed: 0, waitElapsed: 0 }
  }
  if (state.phase !== 'waiting') return state
  if (!state.armed) return state

  let next: FishingState = { ...state, waitElapsed: state.waitElapsed + dt }

  if (next.nibbleActive) {
    const nibbleElapsed = next.nibbleElapsed + dt
    if (nibbleElapsed < NIBBLE_SECONDS) return { ...next, nibbleElapsed }
    next = { ...next, nibbleActive: false, nibbleElapsed: 0 }
    return scheduleNext(next, random)
  }

  if (next.nibblesLeft > 0) {
    const nibbleIn = next.nibbleIn - dt
    if (nibbleIn > 0) return { ...next, nibbleIn }
    return {
      ...next,
      nibbleActive: true,
      nibbleElapsed: 0,
      nibblesLeft: next.nibblesLeft - 1,
      nibbleIn: 0,
    }
  }

  const biteIn = next.biteIn - dt
  if (biteIn > 0) return { ...next, biteIn }
  return { ...next, phase: 'bite', biteIn: 0, biteElapsed: 0 }
}

const PROGRESS_RATE = [0.45, 0.36, 0.32, 0.3]

export function createReelState({
  fight,
  treasure,
  perfectHook,
  random = Math.random,
}: {
  fight: number
  treasure: boolean
  perfectHook: boolean
  random?: () => number
}): ReelState {
  const clampedFight = Math.max(0, Math.min(3, Math.round(fight)))
  let runs = 0
  if (clampedFight === 1) runs = random() < 0.5 ? 2 : 1
  if (clampedFight === 2) runs = random() < 0.5 ? 3 : 2
  if (clampedFight === 3) runs = 4 + Math.floor(Math.max(0, Math.min(0.999999, random())) * 3)

  return {
    progress: perfectHook ? 0.2 : 0.12,
    tension: perfectHook ? 0.5 : 0.44,
    elapsed: 0,
    holding: false,
    fight: clampedFight,
    runActive: false,
    runRemaining: 0,
    runIn: runs > 0 ? (clampedFight === 3 ? 0.7 + random() * 0.8 : 1.1 + random() * 1.1) : Infinity,
    runDirection: random() < 0.5 ? -1 : 1,
    runCount: runs,
    runsLeft: runs,
    puffIn: 0.3 + random() * 0.5,
    treasure,
    treasureRevealed: false,
    treasureHeld: 0,
    treasureGrabbed: false,
    lateTell: 'none',
    outcome: null,
  }
}

export interface ReelInput {
  holding: boolean
  easy: boolean
}

export function stepReel(
  reel: ReelState,
  input: ReelInput,
  dt: number,
  random: () => number = Math.random,
): ReelState {
  if (reel.outcome || !(dt > 0)) return reel
  const band = safeBand(input.easy)
  const runScale = input.easy ? 0.65 : 1

  let next: ReelState = {
    ...reel,
    elapsed: reel.elapsed + dt,
    holding: input.holding,
  }

  if (next.runActive) {
    const runRemaining = next.runRemaining - dt
    if (runRemaining <= 0) {
      next = { ...next, runActive: false, runRemaining: 0 }
      if (next.runsLeft > 0) {
        next = {
          ...next,
          runIn: next.fight === 3 ? 0.55 + random() * 0.8 : 0.9 + random() * 0.9,
        }
      }
    } else {
      next = { ...next, runRemaining }
    }
  } else if (next.runsLeft > 0 && next.progress > 0.08 && next.progress < 0.92) {
    const runIn = next.runIn - dt
    if (runIn <= 0) {
      const duration =
        next.fight === 3 ? 0.55 + random() * 0.75 : 0.75 + random() * 0.75
      next = {
        ...next,
        runActive: true,
        runRemaining: duration,
        runIn: 0,
        runsLeft: next.runsLeft - 1,
        runDirection: random() < 0.5 ? -1 : 1,
        puffIn: 0.25 + random() * 0.4,
      }
    } else {
      next = { ...next, runIn }
    }
  }

  let tension = next.tension
  if (input.holding) {
    let rate = 0.4
    if (next.runActive) rate = (1.15 + next.fight * 0.1) * runScale
    tension += rate * dt
  } else {
    tension -= (next.runActive ? 0.9 : 0.62) * dt
  }

  if (next.runActive && next.fight >= 2) {
    const puffIn = next.puffIn - dt
    if (puffIn <= 0) {
      tension += (0.12 + next.fight * 0.03) * runScale
      next = { ...next, puffIn: 0.4 + random() * 0.5 }
    } else {
      next = { ...next, puffIn }
    }
  }
  tension = Math.max(0, Math.min(1.2, tension))

  let progress = next.progress
  if (input.holding) {
    let rate = PROGRESS_RATE[next.fight]
    if (next.runActive) rate *= 0.35
    if (tension > band.high) rate *= 0.45
    else if (tension < band.low) rate *= 0.5
    progress += rate * dt
  } else {
    progress -= (next.runActive ? 0.15 : 0.05) * dt
  }
  progress = Math.max(0, Math.min(1, progress))

  let treasureHeld = next.treasureHeld
  let treasureRevealed = next.treasureRevealed
  let treasureGrabbed = next.treasureGrabbed
  if (next.treasure && !treasureGrabbed) {
    if (!treasureRevealed && progress >= 0.45) treasureRevealed = true
    if (treasureRevealed && tension >= GOLD_BAND.low && tension <= GOLD_BAND.high) {
      treasureHeld += dt
      if (treasureHeld >= TREASURE_HOLD_SECONDS) {
        treasureHeld = TREASURE_HOLD_SECONDS
        treasureGrabbed = true
      }
    }
  }

  const lateTell: ReelState['lateTell'] =
    progress >= 0.8 ? (next.fight >= 3 ? 'gold' : next.fight === 2 ? 'blue' : 'none') : 'none'

  let outcome: ReelState['outcome'] = null
  if (tension >= 1) outcome = 'snapped'
  else if (progress >= 1) outcome = 'landed'
  else if (next.elapsed > REEL_GRACE_SECONDS && progress <= 0) outcome = 'escaped'

  next = {
    ...next,
    tension,
    progress,
    treasureHeld,
    treasureRevealed,
    treasureGrabbed,
    lateTell,
    outcome,
  }
  if (outcome === 'snapped') next = { ...next, tension: 1 }
  if (outcome === 'landed') next = { ...next, progress: 1 }
  return next
}

/** Runs the reel one frame and advances the fishing phase when it ends. */
export function stepReeling(
  state: FishingState,
  input: ReelInput,
  dt: number,
  random: () => number = Math.random,
): FishingState {
  if (state.phase !== 'reeling' || !state.reel) return state
  const reel = stepReel(state.reel, input, dt, random)
  if (reel.outcome === 'landed') return { ...state, phase: 'landing', reel }
  if (reel.outcome === 'snapped') return lost({ ...state, reel }, 'snap')
  if (reel.outcome === 'escaped') return lost({ ...state, reel }, 'escaped')
  return { ...state, reel }
}
