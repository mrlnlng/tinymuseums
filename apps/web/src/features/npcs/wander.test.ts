import assert from 'node:assert/strict'
import { test } from 'node:test'
import type { FloorSpot, Job, NpcGround, NpcRoomInfo, Place } from './jobs.ts'
import { DEPTH_SPAN } from '../rooms/pond/walk.ts'
import type { WanderCtx } from './wander.ts'
import {
  createWanderer,
  standSpot,
  standX,
  startMeeting,
  stepWanderer,
  wantsToMeet,
} from './wander.ts'

function mulberry32(seed: number): () => number {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const BASE_JOB: Job = {
  visits: ['painting'],
  order: 'errand',
  dwell: [2, 3],
  emote: '✨',
  meet: '😊',
  stand: 0,
  roam: 0,
}

function job(overrides: Partial<Job> = {}): Job {
  return { ...BASE_JOB, ...overrides }
}

function room(overrides: Partial<NpcRoomInfo> = {}): NpcRoomInfo {
  return { minX: 0, maxX: 10, places: [], ...overrides }
}

function context(overrides: Partial<WanderCtx> = {}): WanderCtx {
  return {
    info: room(),
    playerX: null,
    others: [],
    speed: 1,
    rand: mulberry32(1),
    ...overrides,
  }
}

function startIdle(w: ReturnType<typeof createWanderer>): void {
  w.mode = 'idle'
  w.timer = 0
}

/** A simple walkable L: across at the start depth, then into depth at the target x. */
const L_GROUND: NpcGround = {
  route(from: FloorSpot, to: FloorSpot): readonly FloorSpot[] {
    if (Math.abs(from.x - to.x) < 1e-9 || Math.abs(from.d - to.d) < 1e-9) return [{ ...from }, { ...to }]
    return [{ ...from }, { x: to.x, d: from.d }, { ...to }]
  },
  place: (d: number) => ({ lift: d * 2, scale: 1 - d * 0.5 }),
  playerD: () => 0.2,
}

function groundDistance(a: FloorSpot, b: FloorSpot): number {
  return Math.hypot(b.x - a.x, (b.d - a.d) * DEPTH_SPAN)
}

function sameSpot(a: FloorSpot, b: FloorSpot): boolean {
  return Math.abs(a.x - b.x) < 1e-9 && Math.abs(a.d - b.d) < 1e-9
}

test('stays on the floor while working and walking for ten minutes', () => {
  const rand = mulberry32(0x5eed)
  const places: Place[] = [
    { x: 1, kind: 'painting' },
    { x: 9, kind: 'painting' },
    { x: 5, kind: 'desk' },
    { x: 9.7, kind: 'door', name: 'entrance' },
  ]
  const info = room({ places })
  const w = createWanderer('a', 5, rand, job({ dwell: [1, 2] }))
  const ctx = context({ rand, info })
  let moved = false
  let worked = false

  for (let i = 0; i < 10 * 60 * 60; i++) {
    const previous = w.x
    stepWanderer(w, 1 / 60, ctx)
    assert.ok(Number.isFinite(w.x), `step ${i}`)
    assert.ok(w.x >= info.minX && w.x <= info.maxX, `step ${i} left the floor at ${w.x}`)
    if (w.x !== previous) moved = true
    if (w.mode === 'work' && w.stop !== null) {
      worked = true
      assert.equal(w.x, standX(w.stop, w.job, info))
      assert.equal(w.stopX, standX(w.stop, w.job, info))
    }
    if (w.stopX !== null) {
      assert.ok(w.stopX >= info.minX && w.stopX <= info.maxX, `step ${i} stopX ${w.stopX}`)
    }
  }

  assert.equal(moved, true)
  assert.equal(worked, true)
})

test('stops only at its kinds and stands at standX', () => {
  const rand = mulberry32(10)
  const places: Place[] = [
    { x: 2, kind: 'desk' },
    { x: 7, kind: 'desk' },
    { x: 4, kind: 'painting' },
    { x: 9.5, kind: 'door', name: 'entrance' },
  ]
  const info = room({ places })
  const j = job({ visits: ['desk'], stand: 0.3, dwell: [0.5, 0.7] })
  const w = createWanderer('pip', 5, rand, j)
  const ctx = context({ rand, info })
  const visited = new Set<number>()

  startIdle(w)
  for (let i = 0; i < 120 * 60; i++) {
    stepWanderer(w, 1 / 60, ctx)
    if (w.mode === 'work' && w.stop !== null) {
      assert.equal(w.stop.kind, 'desk')
      assert.equal(w.x, standX(w.stop, j, info))
      assert.equal(w.stopX, standX(w.stop, j, info))
      visited.add(w.stop.x)
    }
    if ((w.mode === 'walk' || w.mode === 'leave') && w.stop !== null) {
      assert.equal(w.stop.kind, 'desk')
    }
  }

  assert.ok(visited.size >= 2, `only visited ${[...visited]}`)
})

test('never picks a stop too close to a neighbour x or stopX, or to the player', () => {
  const place: Place = { x: 5, kind: 'painting' }
  const j = job({ stand: 0.2 })

  {
    const rand = mulberry32(20)
    const w = createWanderer('a', 5, rand, j)
    const ctx = context({
      rand,
      info: room({ places: [place] }),
      others: [{ id: 'n', x: 0, canMeet: false, stopX: 5.6 }],
    })
    startIdle(w)
    stepWanderer(w, 1 / 60, ctx)
    assert.equal(w.mode, 'idle')
    assert.ok(w.timer >= 2 && w.timer <= 4, `wait ${w.timer}`)
    assert.equal(w.stopX, null)
    assert.equal(w.walk, null)
  }

  {
    const rand = mulberry32(21)
    const w = createWanderer('a', 5, rand, j)
    const ctx = context({
      rand,
      info: room({ places: [place] }),
      others: [{ id: 'n', x: 5.5, canMeet: false, stopX: null }],
    })
    startIdle(w)
    stepWanderer(w, 1 / 60, ctx)
    assert.equal(w.mode, 'idle')
    assert.equal(w.stopX, null)
  }

  {
    const rand = mulberry32(22)
    // Start far enough that the player is not also in greeting range.
    const w = createWanderer('a', 2, rand, j)
    const ctx = context({ rand, info: room({ places: [place] }), playerX: 5.9 })
    startIdle(w)
    stepWanderer(w, 1 / 60, ctx)
    assert.equal(w.mode, 'idle')
    assert.equal(w.stopX, null)
  }

  {
    const rand = mulberry32(23)
    const places: Place[] = [
      { x: 2, kind: 'painting' },
      { x: 7, kind: 'painting' },
    ]
    const w = createWanderer('a', 5, rand, job())
    const ctx = context({
      rand,
      info: room({ places }),
      others: [{ id: 'n', x: 0, canMeet: false, stopX: 2.3 }],
    })
    startIdle(w)
    stepWanderer(w, 1 / 60, ctx)
    assert.equal(w.mode, 'walk')
    assert.ok(w.stop !== null && Math.abs(w.stop.x - 7) < 1e-9)
    assert.equal(w.stopX, 7)
  }
})

test('arrives exactly at the target with no overshoot, even with dt = 0.25', () => {
  const rand = mulberry32(30)
  const place: Place = { x: 7.13, kind: 'painting' }
  const j = job({ stand: 0.24 })
  const info = room({ places: [place] })
  const target = standX(place, j, info)
  const w = createWanderer('a', 5, rand, j)
  const ctx = context({ rand, info, speed: 1 })
  let walked = false

  startIdle(w)
  for (let i = 0; i < 100 && w.mode !== 'work'; i++) {
    stepWanderer(w, 0.25, ctx)
    if (w.mode === 'walk') {
      walked = true
      assert.ok(w.walk !== null)
      assert.ok(w.x <= target + 1e-9, `overshot to ${w.x} before ${target}`)
    }
  }

  assert.equal(walked, true)
  assert.equal(w.mode, 'work')
  assert.equal(w.x, target)
  assert.equal(w.targetX, target)
  assert.equal(w.stopX, target)
  assert.equal(w.walk, null)
})

test('leaving ends exactly at the door and then becomes gone', () => {
  const rand = mulberry32(31)
  const door: Place = { x: 9.37, kind: 'door', name: 'entrance' }
  const info = room({ places: [door] })
  const w = createWanderer('a', 5, rand, job({ visits: ['painting'] }))
  const ctx = context({ rand, info, speed: 1 })

  startIdle(w)
  stepWanderer(w, 0.25, ctx)
  const startMode: string = w.mode
  assert.equal(startMode, 'leave')
  assert.equal(w.stop, null)
  assert.equal(w.targetX, door.x)
  assert.equal(w.stopX, door.x)
  assert.ok(w.walk !== null && w.walk.to.x === door.x && w.walk.to.d === 0)

  for (let i = 0; i < 100 && w.mode !== 'gone'; i++) {
    stepWanderer(w, 0.25, ctx)
    if (w.mode === 'leave') assert.ok(w.x <= door.x + 1e-9, `overshot door to ${w.x}`)
  }

  assert.equal(w.mode, 'gone')
  assert.equal(w.x, door.x)
  assert.equal(w.walk, null)
  assert.equal(w.stopX, null)
})

test('a room without any of its kinds makes it leave', () => {
  const rand = mulberry32(32)
  const info = room({
    places: [
      { x: 3, kind: 'painting' },
      { x: 1.5, kind: 'door', name: 'entrance' },
    ],
  })
  const w = createWanderer('a', 5, rand, job({ visits: ['desk'] }))
  const ctx = context({ rand, info })

  startIdle(w)
  stepWanderer(w, 1 / 60, ctx)
  assert.equal(w.mode, 'leave')
  assert.equal(w.targetX, 1.5)
  assert.equal(w.stop, null)
})

test('without its kinds or a door it takes a short calm stroll', () => {
  const rand = mulberry32(33)
  const info = room({ places: [{ x: 3, kind: 'painting' }] })
  const w = createWanderer('a', 5, rand, job({ visits: ['desk'] }))
  const ctx = context({ rand, info })

  startIdle(w)
  stepWanderer(w, 1 / 60, ctx)
  assert.equal(w.mode, 'walk')
  assert.equal(w.stop, null)
  const distance = Math.abs(w.targetX - w.x)
  assert.ok(distance >= 1 - 1e-9 && distance <= 2 + 1e-9, `stroll ${distance}`)
  const target = w.targetX

  for (let i = 0; i < 60 * 5 && w.mode === 'walk'; i++) stepWanderer(w, 1 / 60, ctx)
  assert.notEqual(w.mode, 'walk')
  assert.equal(w.x, target)
})

test('greets only when the player enters range, once per visit', () => {
  const rand = mulberry32(40)
  const w = createWanderer('a', 5, rand, job())
  const ctx = context({ rand })
  const dt = 0.05
  w.timer = 100

  stepWanderer(w, dt, ctx)
  assert.equal(w.playerNear, false)

  ctx.playerX = 5.5
  stepWanderer(w, dt, ctx)
  assert.equal(w.mode, 'greet')
  assert.equal(w.emote, '👋')
  assert.equal(w.timer, 2.5)
  assert.equal(w.facing, 1)
  assert.equal(w.greetCooldown, 25)

  let greets = 1
  for (let t = 0; t < 60; t += dt) {
    // Stay in range the whole time: only the first entry may greet.
    ctx.playerX = w.x + 0.5
    const wasGreeting = w.mode === 'greet'
    stepWanderer(w, dt, ctx)
    if (!wasGreeting && w.mode === 'greet') greets++
  }

  assert.equal(greets, 1)
  assert.equal(w.greetCooldown, 0)

  // Leaving and entering again after the cooldown is a fresh approach.
  ctx.playerX = null
  stepWanderer(w, dt, ctx)
  ctx.playerX = w.x + 0.5
  stepWanderer(w, dt, ctx)
  assert.equal(w.mode, 'greet')
  assert.equal(w.emote, '👋')
})

test('a greeting pauses work and resumes the remaining dwell', () => {
  const rand = mulberry32(41)
  const place: Place = { x: 5, kind: 'painting' }
  const j = job({ dwell: [7, 7], emote: '📜' })
  const w = createWanderer('a', 5, rand, j)
  const ctx = context({ rand, info: room({ places: [place] }), playerX: null })

  startIdle(w)
  stepWanderer(w, 1 / 60, ctx)
  assert.equal(w.mode, 'work')
  for (let t = 0; t < 2; t += 0.1) stepWanderer(w, 0.1, ctx)
  const remaining = w.timer

  ctx.playerX = w.x + 0.5
  stepWanderer(w, 0.1, ctx)
  assert.equal(w.mode, 'greet')
  assert.equal(w.resumeMode, 'work')
  assert.equal(w.resumeWork, remaining)

  for (let i = 0; i < 60 && w.mode === 'greet'; i++) {
    ctx.playerX = w.x + 0.5
    stepWanderer(w, 0.1, ctx)
  }

  assert.equal(w.mode, 'work')
  assert.ok(w.stop !== null)
  assert.equal(w.stop.x, 5)
  assert.ok(Math.abs(w.timer - remaining) < 1e-9)
})

test('work emote shows at arrival and just before leaving, and never mid-dwell', () => {
  const rand = mulberry32(50)
  const places: Place[] = [
    { x: 5, kind: 'painting' },
    { x: 8, kind: 'painting' },
  ]
  const j = job({ dwell: [7, 7], emote: '📜' })
  const info = room({ places })
  const w = createWanderer('a', 5, rand, j)
  const ctx = context({ rand, info })

  startIdle(w)
  stepWanderer(w, 0.01, ctx)
  assert.equal(w.mode, 'work')
  assert.equal(w.x, 5)
  assert.equal(w.emote, '📜')
  assert.equal(w.emoteTimer, 2.5)
  assert.ok(Math.abs(w.timer - 7) < 1e-9)

  for (let t = 0; t < 3; t += 0.1) stepWanderer(w, 0.1, ctx)
  assert.equal(w.emote, null, 'arrival emote cleared')

  for (let t = 0; t < 1.5; t += 0.1) stepWanderer(w, 0.1, ctx)
  assert.equal(w.mode, 'work')
  assert.equal(w.emote, null, 'no emote in the middle of the dwell')

  for (let i = 0; i < 100 && w.mode === 'work' && w.timer > 2; i++) stepWanderer(w, 0.1, ctx)
  assert.equal(w.mode, 'work')
  assert.equal(w.emote, '📜', 'exit emote appears just before leaving')
  assert.equal(w.emoteTimer, 2)

  for (let i = 0; i < 100 && w.mode === 'work'; i++) stepWanderer(w, 0.1, ctx)
  assert.equal(w.mode, 'walk')
  assert.ok(w.stop !== null && w.stop.x === 8)
  assert.equal(w.emote, null)
})

test('meeting shows a.meet first, then b.meet, and ends after 6-8 s', () => {
  const rand = mulberry32(60)
  const a = createWanderer('a', 2, rand, job({ meet: '😊' }))
  const b = createWanderer('b', 6, rand, job({ meet: '📚' }))
  const ctx = context({ rand })

  startMeeting(a, b, rand)
  assert.equal(a.mode, 'meet')
  assert.equal(b.mode, 'meet')
  assert.equal(a.partner, 'b')
  assert.equal(b.partner, 'a')
  assert.equal(a.facing, 1)
  assert.equal(b.facing, -1)
  assert.equal(a.emote, '😊')
  assert.equal(b.emote, null)
  assert.equal(b.meetEmoteIn, 2)
  assert.ok(a.timer >= 6 && a.timer <= 8)
  assert.equal(a.timer, b.timer)

  const dt = 0.1
  for (let i = 0; i < 19; i++) {
    stepWanderer(a, dt, ctx)
    stepWanderer(b, dt, ctx)
  }
  assert.equal(a.emote, '😊')
  assert.equal(b.emote, null)

  stepWanderer(a, dt, ctx)
  stepWanderer(b, dt, ctx)
  assert.equal(a.emote, null)
  assert.equal(b.emote, '📚')
  assert.equal(b.emoteTimer, 2)

  for (let t = 2; t < 8.1 && (a.mode === 'meet' || b.mode === 'meet'); t += dt) {
    stepWanderer(a, dt, ctx)
    stepWanderer(b, dt, ctx)
  }

  assert.notEqual(a.mode, 'meet')
  assert.notEqual(b.mode, 'meet')
  assert.equal(a.partner, null)
  assert.equal(b.partner, null)
  assert.ok(a.meetCooldown > 0)
  assert.ok(b.meetCooldown > 0)
})

test('a tour visits matching places in floor order and turns back at the ends', () => {
  const rand = mulberry32(70)
  const places: Place[] = [
    { x: 6, kind: 'painting' },
    { x: 2, kind: 'painting' },
    { x: 4, kind: 'painting' },
    { x: 8, kind: 'seat' },
  ]
  const w = createWanderer('dot', 0, rand, job({
    visits: ['painting'],
    order: 'tour',
    dwell: [0.5, 0.5],
    emote: '📋',
  }))
  const ctx = context({ rand, info: room({ places }) })
  const visited: number[] = []

  startIdle(w)
  for (let i = 0; i < 120 * 60 && visited.length < 5; i++) {
    const before = w.mode
    stepWanderer(w, 1 / 60, ctx)
    if (before !== 'work' && w.mode === 'work' && w.stop !== null) visited.push(w.stop.x)
  }

  assert.deepEqual(visited, [2, 4, 6, 4, 2])
})

test('with a ground, walks follow its route, keep depth in bounds and stop at the place depth', () => {
  const rand = mulberry32(90)
  const places: Place[] = [
    { x: 2, kind: 'desk', d: 0.1 },
    { x: 7, kind: 'desk', d: 0.45 },
    { x: 9.5, kind: 'door', name: 'entrance', d: 0 },
  ]
  const info = room({ places, ground: L_GROUND })
  const j = job({ visits: ['desk'], stand: 0.3, dwell: [0.3, 0.5], roam: 0 })
  const w = createWanderer('a', 5, rand, j)
  const ctx = context({ rand, info, speed: 0.8 })
  const dt = 1 / 60
  let walked = 0
  let worked = 0

  startIdle(w)
  for (let i = 0; i < 10 * 60 * 60; i++) {
    const before = { x: w.x, d: w.d }
    stepWanderer(w, dt, ctx)
    const moved = groundDistance(before, { x: w.x, d: w.d })
    assert.ok(moved <= ctx.speed * dt + 1e-9, `step ${i} jumped ${moved}`)
    assert.ok(w.d >= 0 && w.d <= 0.5, `step ${i} depth ${w.d} left the fixture ground`)

    if (w.walk) {
      walked += 1
      assert.ok(w.walk.done >= -1e-9 && w.walk.done <= w.walk.length + 1e-9)
      const lower = Math.min(w.walk.from.d, w.walk.to.d) - 1e-9
      const upper = Math.max(w.walk.from.d, w.walk.to.d) + 1e-9
      assert.ok(w.d >= lower && w.d <= upper, `step ${i} depth ${w.d} outside ${lower}..${upper}`)
      const across = Math.abs(w.d - w.walk.from.d) < 1e-6
      if (across) {
        assert.ok(w.x >= Math.min(w.walk.from.x, w.walk.to.x) - 1e-6 && w.x <= Math.max(w.walk.from.x, w.walk.to.x) + 1e-6)
      } else {
        assert.ok(Math.abs(w.x - w.walk.to.x) < 1e-6)
      }
    }

    if (w.mode === 'work' && w.stop !== null) {
      worked += 1
      const at = standSpot(w.stop, j, info)
      assert.equal(w.x, at.x)
      assert.equal(w.d, at.d)
    }
  }

  assert.ok(walked > 0, 'expected ground walks')
  assert.ok(worked > 0, 'expected ground work stops')
})

test('with a ground, a completed walk takes its route length divided by speed', () => {
  const rand = mulberry32(91)
  const places: Place[] = [
    { x: 2, kind: 'desk', d: 0.1 },
    { x: 7, kind: 'desk', d: 0.45 },
  ]
  const info = room({ places, ground: L_GROUND })
  const w = createWanderer('a', 5, rand, job({ visits: ['desk'], dwell: [0.3, 0.5], roam: 0 }))
  // Start at the second place's depth so the first leg is a real L.
  w.d = 0.45
  const ctx = context({ rand, info, speed: 0.8 })
  const dt = 1 / 60
  interface Run { from: FloorSpot; to: FloorSpot; length: number; started: number; last: number }
  let run: Run | null = null
  let checked = 0

  startIdle(w)
  for (let i = 0; i < 10 * 60 * 60; i++) {
    const time = i * dt
    stepWanderer(w, dt, ctx)
    if (w.walk) {
      if (!run || !sameSpot(run.from, w.walk.from) || !sameSpot(run.to, w.walk.to)) {
        run = { from: { ...w.walk.from }, to: { ...w.walk.to }, length: w.walk.length, started: time, last: time }
      } else {
        run.last = time
      }
      continue
    }
    if (!run) continue
    const finished = run
    run = null
    if (!sameSpot({ x: w.x, d: w.d }, finished.to)) continue
    const elapsed = finished.last - finished.started + dt
    const expected = finished.length / ctx.speed
    assert.ok(
      Math.abs(elapsed - expected) <= dt * 2 + 1e-9,
      `walk ${finished.length.toFixed(3)} took ${elapsed.toFixed(3)}s, expected ${expected.toFixed(3)}s`,
    )
    checked += 1
  }
  assert.ok(checked >= 2, `expected whole walks, checked ${checked}`)
})

test('flat rooms keep a walker at depth 0 and measure its walks along x', () => {
  const rand = mulberry32(92)
  const places: Place[] = [
    { x: 2, kind: 'desk' },
    { x: 7, kind: 'desk' },
  ]
  const info = room({ places })
  const w = createWanderer('a', 5, rand, job({ visits: ['desk'], dwell: [0.3, 0.5], roam: 0 }))
  const ctx = context({ rand, info, speed: 0.8 })
  let walked = 0

  startIdle(w)
  for (let i = 0; i < 5 * 60 * 60; i++) {
    stepWanderer(w, 1 / 60, ctx)
    assert.equal(w.d, 0)
    if (w.walk) {
      walked += 1
      assert.equal(w.walk.from.d, 0)
      assert.equal(w.walk.to.d, 0)
      assert.ok(Math.abs(w.walk.done - Math.abs(w.x - w.walk.from.x)) < 1e-6)
    }
  }
  assert.ok(walked > 0)
})

test('standX clamps to the floor margins', () => {
  const info = room({ minX: 0, maxX: 10 })
  assert.equal(standX({ x: 0.1, kind: 'painting' }, job({ stand: -1 }), info), 0.3)
  assert.equal(standX({ x: 9.9, kind: 'painting' }, job({ stand: 1 }), info), 9.7)
  assert.equal(standX({ x: 5, kind: 'painting' }, job({ stand: 0.25 }), info), 5.25)
})

test('wantsToMeet follows mode and cooldown', () => {
  const rand = mulberry32(80)
  const w = createWanderer('a', 5, rand, job())
  w.timer = 100
  assert.equal(wantsToMeet(w), true)
  w.mode = 'work'
  assert.equal(wantsToMeet(w), false)
  w.mode = 'idle'
  w.meetCooldown = 30
  assert.equal(wantsToMeet(w), false)
})
