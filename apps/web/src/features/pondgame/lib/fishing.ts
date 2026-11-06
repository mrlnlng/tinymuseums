export type FishingPhase = 'idle' | 'casting' | 'waiting' | 'bite' | 'caught' | 'escaped'
export type EscapeReason = 'early' | 'missed' | null

export interface FishSpecies {
  id: string
  name: string
  colour: string
  weight: number
  minSize: number
  maxSize: number
}

export const FISH = [
  { id: 'minnow', name: 'Minnow', colour: '#c4d1bd', weight: 50, minSize: 4, maxSize: 9 },
  { id: 'perch', name: 'Perch', colour: '#d9a45f', weight: 28, minSize: 12, maxSize: 28 },
  { id: 'carp', name: 'Carp', colour: '#b78a5a', weight: 15, minSize: 30, maxSize: 65 },
  { id: 'koi', name: 'Koi', colour: '#e8825f', weight: 6, minSize: 35, maxSize: 70 },
  { id: 'golden-koi', name: 'Golden Koi', colour: '#e6b64a', weight: 1, minSize: 45, maxSize: 80 },
] as const satisfies readonly FishSpecies[]

export type FishId = (typeof FISH)[number]['id']

export const FISH_WEIGHT_TOTAL = FISH.reduce((total, fish) => total + fish.weight, 0)
export const CAST_SECONDS = 0.5
export const WAIT_MIN_SECONDS = 1.5
export const WAIT_MAX_SECONDS = 5
export const BITE_SECONDS = 0.9
export const RESULT_SECONDS = 1.1

export interface FishingState {
  phase: FishingPhase
  elapsed: number
  waitFor: number
  fish: FishSpecies | null
  size: number
  escape: EscapeReason
}

export function createFishingState(): FishingState {
  return { phase: 'idle', elapsed: 0, waitFor: 0, fish: null, size: 0, escape: null }
}

function unitRandom(random: () => number): number {
  const value = random()
  if (!Number.isFinite(value)) return 0
  return Math.max(0, Math.min(0.999999, value))
}

export function pickFish(random: () => number = Math.random): FishSpecies {
  const roll = unitRandom(random) * FISH_WEIGHT_TOTAL
  let total = 0
  for (const fish of FISH) {
    total += fish.weight
    if (roll < total) return fish
  }
  return FISH[FISH.length - 1]
}

export function cast(state: FishingState): FishingState {
  if (state.phase !== 'idle') return state
  return { ...createFishingState(), phase: 'casting' }
}

export function reel(state: FishingState): FishingState {
  if (state.phase === 'bite') {
    return { ...state, phase: 'caught', elapsed: 0, escape: null }
  }
  if (state.phase === 'casting' || state.phase === 'waiting') {
    return { ...state, phase: 'escaped', elapsed: 0, fish: null, size: 0, escape: 'early' }
  }
  return state
}

export function tick(state: FishingState, dt: number, random: () => number = Math.random): FishingState {
  if (!(dt > 0)) return state
  let next: FishingState = { ...state, elapsed: state.elapsed + dt }

  for (let guard = 0; guard < 8; guard++) {
    switch (next.phase) {
      case 'idle':
        return next
      case 'casting':
        if (next.elapsed < CAST_SECONDS) return next
        next = {
          ...next,
          phase: 'waiting',
          elapsed: next.elapsed - CAST_SECONDS,
          waitFor: WAIT_MIN_SECONDS + (WAIT_MAX_SECONDS - WAIT_MIN_SECONDS) * unitRandom(random),
        }
        break
      case 'waiting':
        if (next.elapsed < next.waitFor) return next
        next = {
          ...next,
          phase: 'bite',
          elapsed: next.elapsed - next.waitFor,
          fish: pickFish(random),
          size: 0,
        }
        next = {
          ...next,
          size: next.fish
            ? next.fish.minSize + (next.fish.maxSize - next.fish.minSize) * unitRandom(random)
            : 0,
        }
        break
      case 'bite':
        if (next.elapsed < BITE_SECONDS) return next
        next = {
          ...next,
          phase: 'escaped',
          elapsed: next.elapsed - BITE_SECONDS,
          escape: 'missed',
        }
        break
      case 'caught':
      case 'escaped':
        if (next.elapsed < RESULT_SECONDS) return next
        next = { ...createFishingState(), elapsed: next.elapsed - RESULT_SECONDS }
        break
    }
  }
  return next
}
