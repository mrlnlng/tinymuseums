import assert from 'node:assert/strict'
import { test } from 'node:test'
import { NPC_WALK_SPEED, RESIDENT_IDS } from './cast.ts'
import { JOBS } from './jobs.ts'
import type { NpcRoomInfo, Place } from './jobs.ts'
import { ROOM_KINDS } from './places.ts'
import { DEPTH_SPAN } from '../rooms/pond/walk.ts'
import { ROOM_DOORS, SCHEDULE_SEED, SLOT_MS, residentsAt, type NpcRoom, type ResidentState } from './schedule.ts'
import type { FloorSpot, NpcGround } from './jobs.ts'

const STEP_MS = 250
const FINE_MS = 5
const HOUR_MS = 60 * 60 * 1000
const COVERAGE_MS = 2 * HOUR_MS
const CONTINUITY_MS = 3 * HOUR_MS
const DAY_MS = 24 * HOUR_MS

const HALL_INFO: NpcRoomInfo = {
  minX: -4,
  maxX: 32,
  places: [
    { x: -3.7, kind: 'end' },
    { x: -3.6, kind: 'door', name: 'atelier' },
    { x: -0.1, kind: 'door', name: 'entrance' },
    { x: 0.165, kind: 'board' },
    { x: 1, kind: 'painting' },
    { x: 3, kind: 'plinth' },
    { x: 4.39, kind: 'desk' },
    { x: 5, kind: 'painting' },
    { x: 6.1, kind: 'board' },
    { x: 7, kind: 'plinth' },
    { x: 9, kind: 'painting' },
    { x: 11, kind: 'plinth' },
    { x: 13, kind: 'painting' },
    { x: 17, kind: 'painting' },
    { x: 21, kind: 'painting' },
    { x: 25, kind: 'painting' },
    { x: 29, kind: 'painting' },
    { x: 31.7, kind: 'end' },
  ],
}

const ATELIER_INFO: NpcRoomInfo = {
  minX: -3.1,
  maxX: 8.5,
  places: [
    { x: -3.1, kind: 'door', name: 'gallery' },
    { x: -3, kind: 'end' },
    { x: 1.5, kind: 'rail' },
    { x: 2.6, kind: 'painting' },
    { x: 3.8, kind: 'painting' },
    { x: 5, kind: 'painting' },
    { x: 6.2, kind: 'painting' },
    { x: 7.4, kind: 'painting' },
    { x: 8.4, kind: 'end' },
  ],
}

const POND_INFO: NpcRoomInfo = {
  minX: -5.6,
  maxX: 13,
  places: [
    { x: -5.6, kind: 'door', name: 'hall' },
    { x: -5.5, kind: 'end' },
    { x: -2.7, kind: 'board' },
    { x: 0.6, kind: 'desk' },
    { x: 1.1, kind: 'water' },
    { x: 3.2, kind: 'water' },
    { x: 5.3, kind: 'water' },
    { x: 12.6, kind: 'board' },
    { x: 12.9, kind: 'end' },
  ],
}

/** A simple walkable L: across at the start depth, then into depth at the target x. */
const FIXTURE_GROUND: NpcGround = {
  route(from: FloorSpot, to: FloorSpot): readonly FloorSpot[] {
    if (Math.abs(from.x - to.x) < 1e-9 || Math.abs(from.d - to.d) < 1e-9) return [{ ...from }, { ...to }]
    return [{ ...from }, { x: to.x, d: from.d }, { ...to }]
  },
  place: (d: number) => ({ lift: d * 2, scale: 1 - d * 0.5 }),
  playerD: () => 0.2,
}

const GROUND_INFO: NpcRoomInfo = {
  minX: -5.6,
  maxX: 13,
  places: [
    { x: -5.6, kind: 'door', name: 'hall', d: 0 },
    { x: -5.5, kind: 'end', d: 0 },
    { x: -1.8, kind: 'board', d: 0.43 },
    { x: 2.25, kind: 'desk', d: 0.43 },
    { x: 5.3, kind: 'water', d: 0 },
    { x: 11.3, kind: 'board', d: 0.43 },
    { x: 12.9, kind: 'end', d: 0 },
  ],
  ground: FIXTURE_GROUND,
}

const INFOS: Record<NpcRoom, NpcRoomInfo> = {
  hall: HALL_INFO,
  atelier: ATELIER_INFO,
  pond: POND_INFO,
}

const VIEWS: Record<NpcRoom, { room: NpcRoom; info: NpcRoomInfo }> = {
  hall: { room: 'hall', info: HALL_INFO },
  atelier: { room: 'atelier', info: ATELIER_INFO },
  pond: { room: 'pond', info: POND_INFO },
}

const ROOMS: readonly NpcRoom[] = ['hall', 'atelier', 'pond']
const CAPS: Record<NpcRoom, number> = { hall: 3, atelier: 2, pond: 2 }

function standX(place: Place, id: string, info: NpcRoomInfo): number {
  const job = JOBS[id]
  const min = info.minX + 0.3
  const max = Math.max(min, info.maxX - 0.3)
  return Math.min(max, Math.max(min, place.x + job.stand))
}

function roomCounts(states: readonly ResidentState[]): Record<NpcRoom, number> {
  const counts: Record<NpcRoom, number> = { hall: 0, atelier: 0, pond: 0 }
  for (const state of states) if (state.room) counts[state.room] += 1
  return counts
}

test('residentsAt is deterministic and room assignment ignores the view', () => {
  for (const time of [0, 1, STEP_MS, 123_456, 7_654_321]) {
    const base = residentsAt(time, VIEWS.hall)
    assert.deepEqual(residentsAt(time, VIEWS.hall), base)
    assert.deepEqual(residentsAt(time, VIEWS.hall, SCHEDULE_SEED), base)
    for (const room of ROOMS) assert.deepEqual(residentsAt(time, VIEWS[room]).map((state) => state.room), base.map((state) => state.room))
    assert.deepEqual(residentsAt(time, null).map((state) => state.room), base.map((state) => state.room))
  }

  for (const state of residentsAt(1234, null)) {
    assert.equal(state.x, null)
    assert.equal(state.walk, null)
  }
  for (const state of residentsAt(1234, VIEWS.atelier)) {
    if (state.room === 'atelier') assert.notEqual(state.x, null)
    else assert.equal(state.x, null)
  }
})

test('room caps hold, every move is hall <-> side through null, and both side rooms stay busy for 24h', () => {
  const last = new Map<string, NpcRoom>()
  const sawNull = new Map<string, boolean>()
  let atelierSamples = 0
  let pondSamples = 0
  let samples = 0
  let transitions = 0

  for (let time = 0; time < DAY_MS; time += 1000) {
    const states = residentsAt(time, VIEWS.hall)
    const counts = roomCounts(states)
    for (const room of ROOMS) assert.ok(counts[room] <= CAPS[room], `${counts[room]} residents in ${room} at ${time}`)
    if (counts.atelier > 0) atelierSamples += 1
    if (counts.pond > 0) pondSamples += 1
    samples += 1

    for (const state of states) {
      if (state.room === null) {
        if (last.has(state.id)) sawNull.set(state.id, true)
        continue
      }
      const before = last.get(state.id)
      if (before !== undefined && before !== state.room) {
        assert.ok(sawNull.get(state.id) ?? false, `${state.id} moved ${before} -> ${state.room} without null`)
        assert.ok(
          (before === 'hall') !== (state.room === 'hall'),
          `${state.id} skipped a room: ${before} -> ${state.room}`,
        )
        transitions += 1
      }
      if (before !== state.room) sawNull.set(state.id, false)
      last.set(state.id, state.room)
    }
  }

  assert.ok(transitions > 0, 'expected residents to move rooms')
  assert.ok(atelierSamples / samples >= 0.7, `atelier busy ${(100 * atelierSamples / samples).toFixed(1)}%`)
  assert.ok(pondSamples / samples >= 0.7, `pond busy ${(100 * pondSamples / samples).toFixed(1)}%`)
})

test('positions stay continuous across slot and stay boundaries', () => {
  for (const room of ROOMS) {
    const view = VIEWS[room]
    const previous = new Map<string, { room: NpcRoom | null; x: number | null }>()
    for (let time = 0; time <= CONTINUITY_MS; time += STEP_MS) {
      for (const state of residentsAt(time, view)) {
        const last = previous.get(state.id)
        if (last && last.room !== null && last.room === state.room && last.x !== null && state.x !== null) {
          const allowed = NPC_WALK_SPEED * (STEP_MS / 1000) + 1e-6
          assert.ok(
            Math.abs(state.x - last.x) <= allowed,
            `${state.id} jumped ${Math.abs(state.x - last.x)} > ${allowed} at ${time} in ${room}`,
          )
        }
        if (state.walk) {
          const direction = state.walk.to.x >= state.walk.from.x ? 1 : -1
          assert.equal(state.facing, direction, `${state.id} faces the wrong way at ${time}`)
        }
        previous.set(state.id, { room: state.room, x: state.x })
      }
    }
  }
})

test('standing residents only stop at places of their job kinds', () => {
  let checked = 0
  for (const room of ROOMS) {
    const view = VIEWS[room]
    for (let time = 0; time <= COVERAGE_MS; time += STEP_MS) {
      for (const state of residentsAt(time, view)) {
        if (state.room !== room || state.x === null || state.walk !== null || state.meetingWith !== null) continue
        const job = JOBS[state.id]
        const atPlace = view.info.places.some((place) =>
          job.visits.includes(place.kind) && Math.abs(standX(place, state.id, view.info) - state.x!) < 1e-6)
        const atDoor = view.info.places.some((place) =>
          place.kind === 'door' && Math.abs(place.x - state.x!) < 1e-6)
        assert.ok(atPlace || atDoor, `${state.id} stands at ${state.x} in ${room}, away from a visited place`)
        if (atPlace) checked += 1
      }
    }
  }
  assert.ok(checked > 0, 'expected residents to stand at their places')
})

test('hall residents who are not meeting are rarely within 0.4 of each other', () => {
  let residentSamples = 0
  let closeSamples = 0
  for (let time = 0; time < DAY_MS; time += 1000) {
    const community = residentsAt(time, VIEWS.hall)
      .filter((state) => state.room === 'hall' && state.x !== null && state.meetingWith === null)
    residentSamples += community.length
    for (let i = 0; i < community.length; i++) {
      for (let j = i + 1; j < community.length; j++) {
        if (Math.abs(community[i].x! - community[j].x!) < 0.4) closeSamples += 1
      }
    }
  }
  assert.ok(residentSamples > 0)
  assert.ok(closeSamples / residentSamples < 0.1, `close ${(100 * closeSamples / residentSamples).toFixed(1)}%`)
})

test('no one parks at a stop for longer than a dwell plus the longest walk', () => {
  const maxDwell = Math.max(...RESIDENT_IDS.map((id) => JOBS[id].dwell[1])) * 1000

  for (const room of ROOMS) {
    const view = VIEWS[room]
    const maxWalk = (view.info.maxX - view.info.minX) / NPC_WALK_SPEED * 1000
    const limit = maxDwell + maxWalk + 2000
    const since = new Map<string, { x: number; time: number }>()
    for (let time = 0; time <= COVERAGE_MS; time += 1000) {
      for (const state of residentsAt(time, view)) {
        const atDoor = state.x !== null && view.info.places.some((place) =>
          place.kind === 'door' && Math.abs(place.x - state.x!) < 1e-6)
        if (state.room !== room || state.x === null || state.walk !== null || state.meetingWith !== null || atDoor) {
          since.delete(state.id)
          continue
        }
        const previous = since.get(state.id)
        if (previous && Math.abs(previous.x - state.x) < 1e-6) {
          assert.ok(time - previous.time <= limit, `${state.id} stood at ${state.x} for ${time - previous.time} ms`)
        } else {
          since.set(state.id, { x: state.x, time })
        }
      }
    }
  }
})

function groundDistance(a: FloorSpot, b: FloorSpot): number {
  return Math.hypot(b.x - a.x, (b.d - a.d) * DEPTH_SPAN)
}

function sameSpot(a: FloorSpot, b: FloorSpot): boolean {
  return Math.abs(a.x - b.x) < 1e-9 && Math.abs(a.d - b.d) < 1e-9
}

test('with a ground, walks follow its route, keep depth in bounds, and never jump faster than walk speed', () => {
  const view = { room: 'pond' as const, info: GROUND_INFO }
  const previous = new Map<string, FloorSpot>()
  let walkingSamples = 0

  for (let time = 0; time <= 10 * 60 * 1000; time += FINE_MS) {
    for (const state of residentsAt(time, view)) {
      if (state.room !== view.room || state.x === null || state.d === null) continue
      const at = { x: state.x, d: state.d }
      const before = previous.get(state.id)
      if (before) {
        const moved = groundDistance(before, at)
        assert.ok(moved <= NPC_WALK_SPEED * (FINE_MS / 1000) + 1e-5, `${state.id} jumped ${moved} at ${time}`)
      }
      previous.set(state.id, at)

      if (!state.walk) {
        if (state.meetingWith !== null) continue
        const job = JOBS[state.id]
        const place = GROUND_INFO.places.find((candidate) =>
          job.visits.includes(candidate.kind) && Math.abs(standX(candidate, state.id, GROUND_INFO) - state.x!) < 1e-6)
        if (place) assert.equal(state.d, place.d ?? 0, `${state.id} stopped off its place depth`)
        continue
      }
      walkingSamples += 1
      const walk = state.walk
      assert.ok(walk.done >= -1e-9 && walk.done <= walk.length + 1e-9, `${state.id} done ${walk.done}/${walk.length}`)
      const lower = Math.min(walk.from.d, walk.to.d) - 1e-9
      const upper = Math.max(walk.from.d, walk.to.d) + 1e-9
      assert.ok(state.d >= lower && state.d <= upper, `${state.id} depth ${state.d} outside ${lower}..${upper}`)
      // The L route runs across at from.d, then along to.x.
      const across = Math.abs(state.d - walk.from.d) < 1e-6
      if (across) {
        assert.ok(
          state.x >= Math.min(walk.from.x, walk.to.x) - 1e-6 && state.x <= Math.max(walk.from.x, walk.to.x) + 1e-6,
          `${state.id} off the first leg at ${at.x},${at.d}`,
        )
      } else {
        assert.ok(Math.abs(state.x - walk.to.x) < 1e-6, `${state.id} off the depth leg at ${at.x},${at.d}`)
      }
    }
  }
  assert.ok(walkingSamples > 0, 'expected ground walks')
})

test('with a ground, a completed walk takes its route length divided by walk speed', () => {
  const view = { room: 'pond' as const, info: GROUND_INFO }
  interface Run { from: FloorSpot; to: FloorSpot; length: number; started: number; last: number; done: number }
  const runs = new Map<string, Run>()
  let checked = 0

  for (let time = 0; time <= 30 * 60 * 1000; time += FINE_MS) {
    const states = residentsAt(time, view)
    const live = new Set<string>()
    for (const state of states) {
      if (state.room !== view.room || state.x === null || state.d === null) continue
      live.add(state.id)
      const at = { x: state.x, d: state.d }
      const run = runs.get(state.id)
      if (state.walk) {
        if (!run || !sameSpot(run.from, state.walk.from) || !sameSpot(run.to, state.walk.to)) {
          runs.set(state.id, {
            from: { ...state.walk.from },
            to: { ...state.walk.to },
            length: state.walk.length,
            started: time,
            last: time,
            done: state.walk.done,
          })
        } else {
          run.last = time
          run.done = state.walk.done
        }
        continue
      }
      if (!run) continue
      runs.delete(state.id)
      // Only a walk that actually arrived at its target tests a whole-leg duration.
      if (!sameSpot(at, run.to)) continue
      const elapsed = run.last - run.started + FINE_MS
      const expected = (run.length / NPC_WALK_SPEED) * 1000
      assert.ok(
        Math.abs(elapsed - expected) <= FINE_MS * 2 + 1e-6,
        `${state.id} walk ${run.length.toFixed(3)} took ${elapsed}ms, expected ${expected.toFixed(1)}ms`,
      )
      checked += 1
    }
    for (const id of runs.keys()) if (!live.has(id)) runs.delete(id)
  }
  assert.ok(checked >= 2, `expected whole walks, checked ${checked}`)
})

test('flat rooms keep depth at 0, so their schedule is unchanged', () => {
  for (const room of ['hall', 'atelier', 'pond'] as const) {
    const view = VIEWS[room]
    for (let time = 0; time <= 60 * 60 * 1000; time += 1000) {
      for (const state of residentsAt(time, view)) {
        if (state.x === null) {
          assert.equal(state.d, null)
          assert.equal(state.walk, null)
          continue
        }
        assert.equal(state.d, 0, `${state.id} has depth in flat ${room}`)
        if (state.walk) {
          assert.equal(state.walk.from.d, 0)
          assert.equal(state.walk.to.d, 0)
          const fromX = state.walk.from.x
          const expected = Math.abs(state.x - fromX)
          assert.ok(Math.abs(state.walk.done - expected) < 1e-6)
        }
      }
    }
  }
})

test('meetings pair two standing residents, face them, and use their job meets', () => {
  const allowedEmotes = new Set<string>()
  for (const job of Object.values(JOBS)) {
    allowedEmotes.add(job.emote)
    allowedEmotes.add(job.meet)
  }

  let meetingSamples = 0
  const pairsPerSlot = new Map<string, Set<string>>()
  const met = new Set<string>()
  for (const room of ROOMS) {
    const view = VIEWS[room]
    for (let time = 0; time <= COVERAGE_MS; time += STEP_MS) {
      const states = residentsAt(time, view)
      const byId = new Map(states.map((state) => [state.id, state]))
      for (const state of states) {
        if (state.emote !== null) assert.ok(allowedEmotes.has(state.emote), `${state.id} showed ${state.emote}`)
        if (state.meetingWith === null) continue
        const partner = byId.get(state.meetingWith)
        assert.ok(partner, `${state.id} meets unknown ${state.meetingWith}`)
        assert.equal(partner.meetingWith, state.id)
        assert.equal(partner.room, state.room)
        assert.ok(state.walk === null && partner.walk === null, 'meeting residents must stand')
        assert.ok(Math.abs(state.x! - partner.x!) >= 0.55 && Math.abs(state.x! - partner.x!) <= 0.65)
        const first = state.id < partner.id ? state.id : partner.id
        const second = first === state.id ? partner.id : state.id
        const slotKey = `${state.room}|${Math.floor(time / SLOT_MS)}`
        const pairKey = `${first}|${second}`
        const pairs = pairsPerSlot.get(slotKey) ?? new Set<string>()
        pairs.add(pairKey)
        pairsPerSlot.set(slotKey, pairs)
        met.add(first)
        met.add(second)
        meetingSamples += 1
      }
    }
  }

  assert.ok(meetingSamples > 0, 'expected meetings within two hours')
  assert.ok(met.size >= 2, 'expected more than one resident to meet')
  for (const [slot, pairs] of pairsPerSlot) {
    assert.ok(pairs.size <= 1, `two meetings in ${slot}`)
  }
})

test('residents only take rooms whose kinds their job visits', () => {
  for (let time = 0; time < DAY_MS; time += 5000) {
    for (const state of residentsAt(time, null)) {
      if (state.room === null) continue
      const shares = ROOM_KINDS[state.room].some((kind) => JOBS[state.id].visits.includes(kind))
      assert.ok(shares, `${state.id} was sent to ${state.room} at ${time}`)
    }
  }
  for (const [room, roomDoors] of Object.entries(ROOM_DOORS)) {
    for (const [target, name] of Object.entries(roomDoors)) {
      assert.ok(room in INFOS && target in INFOS, `${room} door ${name} points at a known room`)
    }
  }
})
