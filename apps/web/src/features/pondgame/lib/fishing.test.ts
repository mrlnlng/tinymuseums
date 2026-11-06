import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  BITE_SECONDS,
  CAST_SECONDS,
  cast,
  createFishingState,
  FISH,
  FISH_WEIGHT_TOTAL,
  pickFish,
  reel,
  RESULT_SECONDS,
  tick,
  WAIT_MAX_SECONDS,
  WAIT_MIN_SECONDS,
} from './fishing.ts'

function seeded(seed: number): () => number {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function atBite(random: () => number) {
  let state = cast(createFishingState())
  state = tick(state, CAST_SECONDS, random)
  state = tick(state, state.waitFor, random)
  return state
}

test('the fish table carries names, colours, sizes and weights', () => {
  assert.equal(FISH_WEIGHT_TOTAL, 100)
  assert.deepEqual(
    FISH.map((fish) => fish.weight),
    [50, 28, 15, 6, 1],
  )
  for (const fish of FISH) {
    assert.ok(fish.name.length > 0)
    assert.match(fish.colour, /^#[0-9a-f]{6}$/)
    assert.ok(fish.minSize > 0 && fish.maxSize > fish.minSize)
  }
})

test('casting waits, bites, and a reel in the window catches a fish', () => {
  const random = seeded(7)
  let state = createFishingState()
  assert.equal(state.phase, 'idle')

  state = cast(state)
  assert.equal(state.phase, 'casting')
  assert.equal(cast(state), state)

  state = tick(state, CAST_SECONDS - 0.01, random)
  assert.equal(state.phase, 'casting')
  state = tick(state, 0.02, random)
  assert.equal(state.phase, 'waiting')
  assert.ok(state.waitFor >= WAIT_MIN_SECONDS && state.waitFor <= WAIT_MAX_SECONDS)

  state = tick(state, state.waitFor, random)
  assert.equal(state.phase, 'bite')
  assert.ok(state.fish)
  assert.ok(state.size >= state.fish.minSize && state.size <= state.fish.maxSize)
  const fish = state.fish

  state = reel(state)
  assert.equal(state.phase, 'caught')
  assert.equal(state.fish, fish)
  assert.equal(state.escape, null)

  state = tick(state, RESULT_SECONDS, random)
  assert.equal(state.phase, 'idle')
})

test('reeling before the bite escapes too early', () => {
  const random = seeded(11)
  let state = cast(createFishingState())
  state = tick(state, 0.2, random)
  state = reel(state)
  assert.equal(state.phase, 'escaped')
  assert.equal(state.escape, 'early')
  assert.equal(state.fish, null)

  let waiting = tick(cast(createFishingState()), CAST_SECONDS, random)
  waiting = tick(waiting, 0.1, random)
  waiting = reel(waiting)
  assert.equal(waiting.phase, 'escaped')
  assert.equal(waiting.escape, 'early')
})

test('missing the bite window escapes, then the state resets to idle', () => {
  const random = seeded(13)
  let state = atBite(random)
  assert.equal(state.phase, 'bite')

  state = tick(state, BITE_SECONDS - 0.01, random)
  assert.equal(state.phase, 'bite')
  state = tick(state, 0.02, random)
  assert.equal(state.phase, 'escaped')
  assert.equal(state.escape, 'missed')
  assert.ok(state.fish)

  state = tick(state, RESULT_SECONDS, random)
  assert.equal(state.phase, 'idle')
  assert.equal(cast(state).phase, 'casting')
})

test('the weighted fish pick roughly matches the table', () => {
  const random = seeded(0x5eed)
  const counts = new Map<string, number>()
  const runs = 50000
  for (let i = 0; i < runs; i++) {
    const fish = pickFish(random)
    counts.set(fish.id, (counts.get(fish.id) ?? 0) + 1)
  }
  for (const fish of FISH) {
    const share = (counts.get(fish.id) ?? 0) / runs
    assert.ok(Math.abs(share - fish.weight / FISH_WEIGHT_TOTAL) < 0.012, `${fish.id}: ${share}`)
  }
  assert.equal(pickFish(() => 0).id, 'minnow')
  assert.equal(pickFish(() => 1).id, 'golden-koi')
})
