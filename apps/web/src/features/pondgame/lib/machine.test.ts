import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  BITE_WINDOW,
  REEL_GRACE_SECONDS,
  CHARGE_PERIOD,
  FLIGHT_SECONDS,
  GOLD_BAND,
  NIBBLE_SECONDS,
  PERFECT_HOOK_WINDOW,
  SWEET_HIGH,
  SWEET_LOW,
  armCast,
  chargePower,
  createFishingState,
  createReelState,
  landingForPower,
  releaseCast,
  safeBand,
  startCharge,
  stepReel,
  tap,
  tick,
  tickCharge,
  type ReelState,
} from './machine.ts'

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

function playReel(
  fight: number,
  options: { treasure?: boolean; easy?: boolean; seconds?: number; seed?: number } = {},
): { reel: ReelState; seconds: number } {
  const random = seeded(options.seed ?? 7)
  const easy = options.easy ?? false
  let reel = createReelState({
    fight,
    treasure: options.treasure ?? false,
    perfectHook: true,
    random,
  })
  let seconds = 0
  const dt = 1 / 60
  const limit = options.seconds ?? 30
  while (!reel.outcome && seconds < limit) {
    const high = reel.runActive ? 0.58 : safeBand(easy).high - 0.03
    const holding = reel.tension < high
    reel = stepReel(reel, { holding, easy }, dt, random)
    seconds += dt
  }
  return { reel, seconds }
}

test('the charge meter sweeps 0 → 1 → 0 on a 1.4s period', () => {
  const period = CHARGE_PERIOD
  assert.ok(Math.abs(chargePower(0) - 0) < 1e-9)
  assert.ok(Math.abs(chargePower(period / 2) - 1) < 1e-9)
  assert.ok(Math.abs(chargePower(period) - 0) < 1e-9)
  assert.ok(Math.abs(chargePower(period * 1.25) - 0.5) < 1e-9)

  let state = startCharge(createFishingState('shrimp'))
  assert.equal(state.phase, 'charging')
  state = tickCharge(state, 0.6)
  assert.ok(state.power > 0.8 && state.power < 0.9)
  const cast = releaseCast(state)
  assert.equal(cast.phase, 'flying')
  assert.equal(cast.perfectCast, true)
  assert.ok(SWEET_LOW <= state.power && state.power <= SWEET_HIGH)
})

test('a release outside the sweet zone is not a perfect cast and lands nearer', () => {
  let state = startCharge(createFishingState())
  state = tickCharge(state, 0.2)
  const short = releaseCast(state)
  assert.equal(short.perfectCast, false)
  assert.ok(short.landing.x < landingForPower(0.85).x)

  let over = startCharge(createFishingState())
  over = tickCharge(over, 0.68)
  const full = releaseCast(over)
  assert.equal(full.perfectCast, false)
  assert.ok(full.power > SWEET_HIGH)
  assert.ok(full.landing.x < landingForPower(SWEET_HIGH).x)
})

test('portrait casts land inside the visible left-bank crop', () => {
  for (const power of [0, 0.4, SWEET_LOW, 0.85, SWEET_HIGH, 1]) {
    const point = landingForPower(power, true)
    assert.ok(point.x >= 0.3 && point.x <= 0.48, `${power}: ${point.x}`)
    assert.ok(point.y >= 0.76 && point.y <= 0.84, `${power}: ${point.y}`)
    assert.ok(point.x < landingForPower(power, false).x)
  }
})

test('the waiting state schedules 0.6–1.4s nibbles and a tap during one spooks the fish', () => {
  for (const roll of [0, 0.5, 0.999]) {
    let state = armCast(
      releaseCast(startCharge(createFishingState())),
      { shadow: 'small', nibbles: 2, fight: 1, treasure: false },
      () => roll,
    )
    const gap = state.nibbleIn
    assert.ok(gap >= 0.6 && gap <= 1.4)
    state = tick(state, FLIGHT_SECONDS + 0.01)
    assert.equal(state.phase, 'waiting')
    state = tick(state, gap)
    assert.equal(state.nibbleActive, true)
    const tapped = tap(state)
    assert.equal(tapped.phase, 'lost')
    assert.equal(tapped.lostReason, 'spooked')
  }

  let state = armCast(
    releaseCast(startCharge(createFishingState())),
    { shadow: 'big', nibbles: 1, fight: 2, treasure: false },
    () => 0,
  )
  state = tick(state, FLIGHT_SECONDS + 0.01)
  state = tick(state, 0.6)
  assert.equal(state.nibbleActive, true)
  state = tick(state, NIBBLE_SECONDS + 0.01)
  assert.equal(state.nibbleActive, false)
  assert.equal(state.nibblesLeft, 0)
  assert.ok(state.biteIn > 0)
})

test('a tap inside the first 250ms of the bite is a perfect hook and starts line in hand', () => {
  let state = armCast(
    releaseCast(startCharge(createFishingState())),
    { shadow: 'huge', nibbles: 0, fight: 3, treasure: true },
    () => 0,
  )
  state = tick(state, FLIGHT_SECONDS + 0.01)
  state = tick(state, 0.9)
  assert.equal(state.phase, 'bite')
  const hooked = tap(state)
  assert.equal(hooked.phase, 'reeling')
  assert.equal(hooked.perfectHook, true)
  assert.equal(hooked.reel?.progress, 0.2)
  assert.ok(PERFECT_HOOK_WINDOW > 0)
  assert.equal(BITE_WINDOW, 1.25)
})

test('a late bite tap hooks normally and missing the window loses the fish', () => {
  let state = armCast(
    releaseCast(startCharge(createFishingState())),
    { shadow: 'small', nibbles: 0, fight: 0, treasure: false },
    () => 0,
  )
  state = tick(state, FLIGHT_SECONDS + 0.01)
  state = tick(state, 0.9)
  state = tick(state, 0.3)
  const late = tap(state)
  assert.equal(late.phase, 'reeling')
  assert.equal(late.perfectHook, false)
  assert.equal(late.reel?.progress, 0.12)

  let missed = armCast(
    releaseCast(startCharge(createFishingState())),
    { shadow: 'small', nibbles: 0, fight: 0, treasure: false },
    () => 0,
  )
  missed = tick(missed, FLIGHT_SECONDS + 0.01)
  missed = tick(missed, 0.9)
  missed = tick(missed, BITE_WINDOW + 0.01)
  assert.equal(missed.phase, 'lost')
  assert.equal(missed.lostReason, 'missed')
})

test('fight 0 lands in roughly 2–3 seconds while the tension is managed', () => {
  const { reel, seconds } = playReel(0, { seed: 11 })
  assert.equal(reel.outcome, 'landed')
  assert.ok(seconds >= 1.8 && seconds <= 3.4, `landed in ${seconds.toFixed(2)}s`)
})

test('holding forever snaps the line, and slack after the grace period escapes', () => {
  const random = seeded(5)
  let reel = createReelState({ fight: 0, treasure: false, perfectHook: false, random })
  for (let i = 0; i < 60 * 5 && !reel.outcome; i++) {
    reel = stepReel(reel, { holding: true, easy: false }, 1 / 60, random)
  }
  assert.equal(reel.outcome, 'snapped')
  assert.equal(reel.tension, 1)

  let slack = createReelState({ fight: 0, treasure: false, perfectHook: false, random })
  for (let i = 0; i < 60 * 5 && !slack.outcome; i++) {
    slack = stepReel(slack, { holding: false, easy: false }, 1 / 60, random)
  }
  assert.equal(slack.outcome, 'escaped')
  assert.ok(slack.elapsed > REEL_GRACE_SECONDS)
  assert.equal(slack.progress, 0)
})

test('fight 3 makes 4–6 runs, takes longer than a common, and can still be landed', () => {
  const common = playReel(0, { seed: 4 })
  const legendary = playReel(3, { seed: 4, seconds: 40 })
  assert.equal(legendary.reel.outcome, 'landed')
  assert.ok(legendary.reel.runCount >= 4 && legendary.reel.runCount <= 6)
  assert.ok(legendary.seconds > common.seconds, `${legendary.seconds} vs ${common.seconds}`)
  assert.equal(legendary.reel.lateTell, 'gold')
})

test('the easy reel widens the safe band and tames runs', () => {
  assert.ok(safeBand(true).high - safeBand(true).low > safeBand(false).high - safeBand(false).low)
  const eager = playReel(3, { seed: 9, seconds: 40 })
  const easy = playReel(3, { seed: 9, seconds: 40, easy: true })
  assert.equal(easy.reel.outcome, 'landed')
  assert.ok(easy.seconds <= eager.seconds, `${easy.seconds} vs ${eager.seconds}`)
})

test('treasure needs 1.5s cumulative inside the gold tension band', () => {
  const random = seeded(13)
  let reel = createReelState({ fight: 0, treasure: true, perfectHook: true, random })
  assert.ok(GOLD_BAND.low > safeBand(false).low && GOLD_BAND.high < safeBand(false).high)
  reel = { ...reel, progress: 0.1, treasureRevealed: true, treasureHeld: 0 }
  let seconds = 0
  const dt = 1 / 60
  while (!reel.treasureGrabbed && seconds < 2) {
    const holding = reel.tension < 0.53
    reel = stepReel(reel, { holding, easy: false }, dt, random)
    seconds += dt
  }
  assert.equal(reel.treasureGrabbed, true)
  assert.ok(seconds >= 1.5 && seconds < 1.7, `${seconds}`)
  assert.equal(reel.treasureHeld, 1.5)

  let dry = createReelState({ fight: 0, treasure: false, perfectHook: true, random })
  dry = { ...dry, progress: 0.1 }
  for (let i = 0; i < 120; i++) dry = stepReel(dry, { holding: true, easy: false }, dt, random)
  assert.equal(dry.treasureGrabbed, false)
})

test('late tells only appear in the last 20% and scale with the fight', () => {
  const random = seeded(17)
  for (const fight of [0, 1, 2, 3]) {
    let reel = createReelState({ fight, treasure: false, perfectHook: true, random })
    reel = stepReel({ ...reel, progress: 0.79, tension: 0.5 }, { holding: false, easy: false }, 0.001, random)
    assert.equal(reel.lateTell, 'none')
    reel = stepReel({ ...reel, progress: 0.81, tension: 0.5 }, { holding: false, easy: false }, 0.001, random)
    assert.equal(reel.lateTell, fight >= 3 ? 'gold' : fight === 2 ? 'blue' : 'none')
  }
})
