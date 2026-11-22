import { NPC_WALK_SPEED, RESIDENT_IDS } from './cast.ts'
import { JOBS } from './jobs.ts'
import { ROOM_KINDS } from './places.ts'
import { DEPTH_SPAN } from '../rooms/pond/walk.ts'
import type { FloorSpot, Job, NpcRoomInfo, Place } from './jobs.ts'

export type NpcRoom = 'hall' | 'atelier' | 'pond'

export interface ResidentState {
  id: string
  room: NpcRoom | null
  /** World x, only when room is the room being viewed. */
  x: number | null
  /** Depth into a room with ground, in the same units as Place.d and walker.depth; null away from the view. */
  d: number | null
  facing: 1 | -1
  /** The current walk leg and the distance covered along its route; null while standing. */
  walk: { from: FloorSpot; to: FloorSpot; length: number; done: number } | null
  meetingWith: string | null
  emote: string | null
}

export const ROOM_DOORS: Record<NpcRoom, Partial<Record<NpcRoom, string>>> = {
  hall: { atelier: 'atelier', pond: 'entrance' },
  atelier: { hall: 'gallery' },
  pond: { hall: 'hall' },
}

// One time slice of the shared schedule. Slots let meetings be one pair per room per slice.
export const SLOT_MS = 45_000

// Rooms change only every few slots, so a resident gets a real visit rather than a hop.
const BLOCK_SLOTS = 3
const BLOCK_MS = SLOT_MS * BLOCK_SLOTS
const TRANSITION_MS = 3000
const MEETING_SETTLE_MS = 250
const MEETING_MS = 4000
const MEETING_CHANCE = 0.5
const ARRIVE_EMOTE_MS = 2500
const LEAVE_EMOTE_MS = 2000
const LEAVE_EMOTE_AFTER_MS = 6000
const LEAVE_MARGIN_MS = 2000
const MEETING_END_GAP_MS = 1000

export const SCHEDULE_SEED = 0x5eed1a7e

interface Phase {
  start: number
  end: number
  room: NpcRoom | null
  from: FloorSpot | null
  to: FloorSpot | null
  /** The walked route, for turning done distance back into a spot. */
  route: readonly FloorSpot[]
  /** World-unit length of the route, in x and the floor d units from toFloor. */
  length: number
  facing: 1 | -1
  meetingWith: string | null
}

interface EmoteEvent {
  start: number
  end: number
  emote: string
}

interface ResidentPlan {
  phases: Phase[]
  emotes: EmoteEvent[]
}

interface StayPlan {
  byIndex: Map<number, ResidentPlan>
}

interface StayContext {
  room: NpcRoom
  info: NpcRoomInfo
  seed: number
  startMs: number
  endMs: number
}

interface WalkState {
  index: number
  job: Job
  path: readonly Place[]
  x: number
  d: number
  facing: 1 | -1
  atPlace: Place | null
  lastPlace: Place | null
  dwellStartMs: number
  dwellDurationMs: number
  dwellLeftMs: number
  target: Place | null
  cursor: number
  stopOrdinal: number
  exitX: number
  availableAt: number
  room: NpcRoom
  plan: ResidentPlan
}

interface WalkTableRow {
  rooms: readonly NpcRoom[]
}

interface RoomRun {
  startPos: number
  length: number
  rooms: readonly NpcRoom[]
}

function mix32(value: number): number {
  let x = (value + 0x9e3779b9) | 0
  x = Math.imul(x ^ (x >>> 16), 0x21f0aaad)
  x = Math.imul(x ^ (x >>> 15), 0x735a2d97)
  return (x ^ (x >>> 15)) >>> 0
}

function hash32(a: number, b: number, c: number, d = 0): number {
  let h = mix32(a >>> 0)
  h = mix32(h ^ (b >>> 0))
  h = mix32(h ^ (c >>> 0))
  return mix32(h ^ (d >>> 0))
}

function unit(value: number): number {
  return value / 0x100000000
}

function fnv1a(text: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 0x01000193) >>> 0
  }
  return h
}

const ID_HASH = RESIDENT_IDS.map(fnv1a)
const INDEX = new Map<string, number>(RESIDENT_IDS.map((id, index) => [id, index]))
const ROOM_HASH: Record<NpcRoom, number> = { hall: 1, atelier: 2, pond: 3 }

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function posMod(value: number, size: number): number {
  return ((value % size) + size) % size
}

function innerX(value: number, info: NpcRoomInfo): number {
  const min = info.minX + 0.3
  const max = Math.max(min, info.maxX - 0.3)
  return clamp(value, min, max)
}

const EPS = 1e-9

/** A walk's ground distance: x across, and d stretched by the pond's DEPTH_SPAN to floor units. */
function floorDistance(a: FloorSpot, b: FloorSpot): number {
  return Math.hypot(b.x - a.x, (b.d - a.d) * DEPTH_SPAN)
}

interface WalkPath {
  from: FloorSpot
  to: FloorSpot
  route: readonly FloorSpot[]
  length: number
}

/** The route between two spots; a flat room keeps the old straight line along x. */
function pathFor(info: NpcRoomInfo, from: FloorSpot, to: FloorSpot): WalkPath {
  if (!info.ground) return { from, to, route: [from, to], length: Math.abs(to.x - from.x) }
  const route = info.ground.route(from, to)
  let length = 0
  for (let i = 1; i < route.length; i++) length += floorDistance(route[i - 1], route[i])
  return route.length === 0
    ? { from, to, route: [from], length: 0 }
    : { from: route[0], to: route[route.length - 1], route, length }
}

/** The spot `distance` world units along a route. */
function along(path: WalkPath, distance: number): FloorSpot {
  let left = clamp(distance, 0, path.length)
  for (let i = 1; i < path.route.length; i++) {
    const a = path.route[i - 1]
    const b = path.route[i]
    const gap = floorDistance(a, b)
    if (left <= gap || i === path.route.length - 1) {
      const t = gap > EPS ? left / gap : 1
      return { x: a.x + (b.x - a.x) * t, d: a.d + (b.d - a.d) * t }
    }
    left -= gap
  }
  return path.to
}

/** The first `distance` world units of a route, for a leg cut short by the end of a stay. */
function truncated(path: WalkPath, distance: number): WalkPath {
  if (distance >= path.length - EPS) return path
  const route: FloorSpot[] = [path.route[0] ?? path.from]
  let left = Math.max(0, distance)
  for (let i = 1; i < path.route.length; i++) {
    const a = path.route[i - 1]
    const b = path.route[i]
    const gap = floorDistance(a, b)
    if (left >= gap - EPS) {
      route.push(b)
      left = Math.max(0, left - gap)
      continue
    }
    if (left > EPS && gap > EPS) {
      const t = left / gap
      route.push({ x: a.x + (b.x - a.x) * t, d: a.d + (b.d - a.d) * t })
    }
    break
  }
  return { from: route[0], to: route[route.length - 1], route, length: Math.min(distance, path.length) }
}

function walkMs(info: NpcRoomInfo, from: FloorSpot, to: FloorSpot): number {
  return (pathFor(info, from, to).length / NPC_WALK_SPEED) * 1000
}

function facingOf(from: FloorSpot, to: FloorSpot, fallback: 1 | -1): 1 | -1 {
  const dx = to.x - from.x
  return Math.abs(dx) > 1e-6 ? (dx > 0 ? 1 : -1) : fallback
}

function standingSpot(place: Place, job: Job, info: NpcRoomInfo): FloorSpot {
  const wanted = { x: standingX(place, job, info), d: place.d ?? 0 }
  if (!info.ground) return wanted
  // A stand offset can reach past a path edge; the route ends on the nearest walkable spot.
  const from = { x: place.x, d: place.d ?? 0 }
  const route = info.ground.route(from, wanted)
  return route[route.length - 1] ?? wanted
}

function roomOffers(id: string, room: NpcRoom): boolean {
  const job = JOBS[id]
  return job ? ROOM_KINDS[room].some((kind) => job.visits.includes(kind)) : false
}

// A side group is exactly half the cast, so the hall keeps three residents and each side room one
// or two. Groups swap whole visits, which keeps every move a side-room <-> hall move.
const SIDE_A: readonly (readonly [string, NpcRoom])[] = [
  ['clove', 'atelier'],
  ['pearl', 'atelier'],
  ['mabel', 'pond'],
]

const SIDE_B_OPTIONS: readonly (readonly (readonly [string, NpcRoom])[])[] = [
  [['nell', 'atelier'], ['percy', 'pond'], ['hazel', 'atelier']],
  [['nell', 'pond'], ['percy', 'pond'], ['hazel', 'atelier']],
]

const SIDE_B = SIDE_B_OPTIONS.filter((option) => option.every(([id, room]) => roomOffers(id, room)))
const SIDE_B_SAFE = SIDE_B.length > 0 ? SIDE_B : [SIDE_B_OPTIONS[0]]

function averageRoam(ids: readonly string[]): number {
  return ids.reduce((sum, id) => sum + (JOBS[id]?.roam ?? 0), 0) / ids.length
}

const ROAM_A = averageRoam(SIDE_A.map(([id]) => id))
const ROAM_B = averageRoam(SIDE_B_SAFE[0].map(([id]) => id))

const VISITS = 48

/** A low-roam group lingers on its side visit; a roamier one comes back to the hall sooner. */
function sideVisitBlocks(sideA: boolean, visit: number): number {
  const roam = sideA ? ROAM_A : ROAM_B
  const extra = roam < 0.16 ? 2 : 1
  return 1 + (hash32(SCHEDULE_SEED, visit, sideA ? 0x10 : 0x11, 0) % (extra + 1))
}

function sideForVisit(visit: number): readonly (readonly [string, NpcRoom])[] {
  if (visit % 2 === 0) return SIDE_A
  return SIDE_B_SAFE[hash32(SCHEDULE_SEED, visit, 0x2b, 0) % SIDE_B_SAFE.length]
}

const ROOM_TABLE: readonly WalkTableRow[] = buildRoomTable()

function buildRoomTable(): WalkTableRow[] {
  const table: WalkTableRow[] = []
  for (let visit = 0; visit < VISITS; visit++) {
    const side = sideForVisit(visit)
    const length = sideVisitBlocks(visit % 2 === 0, visit)
    for (let step = 0; step < length; step++) {
      const rooms: NpcRoom[] = RESIDENT_IDS.map(() => 'hall')
      for (const [id, room] of side) {
        const index = INDEX.get(id)
        if (index !== undefined && roomOffers(id, room)) rooms[index] = room
      }
      table.push({ rooms })
    }
  }
  return table
}

function sameRooms(a: readonly NpcRoom[], b: readonly NpcRoom[]): boolean {
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false
  return true
}

const RUN_BY_POS: RoomRun[] = []

for (let pos = 0; pos < ROOM_TABLE.length;) {
  const rooms = ROOM_TABLE[pos].rooms
  let length = 1
  while (pos + length < ROOM_TABLE.length && sameRooms(ROOM_TABLE[pos + length].rooms, rooms)) length++
  const run: RoomRun = { startPos: pos, length, rooms }
  for (let step = 0; step < length; step++) RUN_BY_POS[pos + step] = run
  pos += length
}

function seedOffset(seed: number): number {
  return mix32(seed ^ 0x5eed) % ROOM_TABLE.length
}

function roomAtBlock(block: number, seed: number): readonly NpcRoom[] {
  return ROOM_TABLE[posMod(block + seedOffset(seed), ROOM_TABLE.length)].rooms
}

/** A named door wins; the shared doors all sit on the left wall, so a missing one falls back there. */
function doorX(info: NpcRoomInfo, room: NpcRoom, from: NpcRoom): number {
  const name = ROOM_DOORS[room][from]
  if (name) {
    const door = info.places.find((place) => place.kind === 'door' && place.name === name)
    if (door) return clamp(door.x, info.minX, info.maxX)
  }
  return info.minX
}

function standingX(place: Place, job: Job, info: NpcRoomInfo): number {
  return innerX(place.x + job.stand, info)
}

/** The places a resident works at, split into sorted-id chunks when the room can spare them. */
function stopPath(id: string, job: Job, info: NpcRoomInfo, roomIds: readonly string[]): Place[] {
  const places = info.places
    .filter((place) => job.visits.includes(place.kind))
    .slice()
    .sort((a, b) => a.x - b.x)
  const rank = roomIds.indexOf(id)
  const count = roomIds.length
  // Two places each keeps a tour moving; below that, share the places and let stand offsets separate them.
  const subset = places.length >= count * 2 && count > 0 && rank >= 0
    ? places.slice(
      Math.floor((rank * places.length) / count),
      Math.floor(((rank + 1) * places.length) / count),
    )
    : places
  if (job.order !== 'tour') return subset

  const path: Place[] = []
  for (let i = 0; i < subset.length; i++) path.push(subset[i])
  for (let i = subset.length - 2; i > 0; i--) path.push(subset[i])
  return path
}

function dwellFor(index: number, ordinal: number, seed: number): number {
  const job = JOBS[RESIDENT_IDS[index]]
  const [min, max] = job?.dwell ?? [3, 6]
  return (min + unit(hash32(seed, ID_HASH[index], ordinal, 0x4a00)) * (max - min)) * 1000
}

function addEmote(plan: ResidentPlan, start: number, end: number, emote: string): void {
  if (end > start) plan.emotes.push({ start, end, emote })
}

function addDwellEmotes(
  state: WalkState,
  start: number,
  end: number,
  dwellStart: number,
  dwellDuration: number,
): void {
  const arrivalEnd = Math.min(dwellStart + ARRIVE_EMOTE_MS, dwellStart + dwellDuration)
  const arriveFrom = Math.max(start, dwellStart)
  const arriveTo = Math.min(end, arrivalEnd)
  if (arriveTo > arriveFrom) addEmote(state.plan, arriveFrom, arriveTo, state.job.emote)

  if (dwellDuration >= LEAVE_EMOTE_AFTER_MS) {
    const leaveFrom = Math.max(start, dwellStart + dwellDuration - LEAVE_EMOTE_MS)
    const leaveTo = Math.min(end, dwellStart + dwellDuration)
    if (leaveTo > leaveFrom) addEmote(state.plan, leaveFrom, leaveTo, state.job.emote)
  }
}

function addStand(
  state: WalkState,
  start: number,
  end: number,
  at: FloorSpot,
  facing: 1 | -1,
  meetingWith: string | null = null,
  dwell?: { start: number; duration: number },
): void {
  if (end <= start) return
  state.plan.phases.push({ start, end, room: state.room, from: at, to: at, route: [at], length: 0, facing, meetingWith })
  if (dwell) addDwellEmotes(state, start, end, dwell.start, dwell.duration)
}

function addWalk(state: WalkState, start: number, end: number, path: WalkPath, facing: 1 | -1): void {
  if (end <= start) return
  if (path.length < 1e-9) {
    addStand(state, start, end, path.from, facing)
    return
  }
  state.plan.phases.push({
    start,
    end,
    room: state.room,
    from: path.from,
    to: path.to,
    route: path.route,
    length: path.length,
    facing,
    meetingWith: null,
  })
}

function addGap(plan: ResidentPlan, start: number, end: number): void {
  plan.phases.push({ start, end, room: null, from: null, to: null, route: [], length: 0, facing: 1, meetingWith: null })
}

function chooseNext(state: WalkState, seed: number, attempt = 0): Place | null {
  const length = state.path.length
  if (length === 0) return null
  if (state.job.order === 'tour') {
    state.cursor = (state.cursor + 1) % length
    return state.path[state.cursor]
  }
  if (length === 1) return state.path[0]
  let index = hash32(seed, ID_HASH[state.index], state.stopOrdinal + attempt, 0x1b00) % length
  if (state.lastPlace && state.path[index] === state.lastPlace) index = (index + 1) % length
  state.cursor = index
  return state.path[index]
}

function canReturn(
  state: WalkState,
  context: StayContext,
  target: FloorSpot,
  dwell: number,
  time: number,
): boolean {
  const here = { x: state.x, d: state.d }
  const there = walkMs(context.info, here, target)
  const back = walkMs(context.info, target, { x: state.exitX, d: 0 })
  return time + there + dwell + back <= context.endMs - 500
}

/** Walk out to the door and wait there, so the stay ends at the door rather than mid-floor. */
function planExit(state: WalkState, context: StayContext, time: number, limit: number): void {
  state.target = null
  state.dwellLeftMs = 0
  const here = { x: state.x, d: state.d }
  const exit = { x: state.exitX, d: 0 }
  const need = walkMs(context.info, here, exit)
  let at = time

  const walk = Math.min(need, limit - at)
  if (walk > 0) {
    const path = truncated(pathFor(context.info, here, exit), NPC_WALK_SPEED * (walk / 1000))
    const facing = facingOf(here, path.to, state.facing)
    addWalk(state, at, at + walk, path, facing)
    state.x = path.to.x
    state.d = path.to.d
    state.facing = facing
    state.atPlace = null
    at += walk
  }
  if (at < limit) addStand(state, at, limit, { x: state.x, d: state.d }, state.facing)
}

function planNormal(state: WalkState, context: StayContext, start: number, limit: number): void {
  let time = Math.max(start, state.availableAt)
  while (time < limit - 1e-9) {
    const here = { x: state.x, d: state.d }
    const toExit = walkMs(context.info, here, { x: state.exitX, d: 0 })
    if (context.endMs - time <= toExit + LEAVE_MARGIN_MS) {
      planExit(state, context, time, limit)
      return
    }

    if (state.dwellLeftMs > 1e-9) {
      const duration = Math.min(state.dwellLeftMs, limit - time)
      addStand(state, time, time + duration, here, state.facing, null, {
        start: state.dwellStartMs,
        duration: state.dwellDurationMs,
      })
      time += duration
      state.dwellLeftMs -= duration
      if (state.dwellLeftMs <= 1e-9) {
        state.atPlace = null
        state.dwellStartMs = 0
        state.dwellDurationMs = 0
      }
      continue
    }

    if (state.target) {
      const target = standingSpot(state.target, state.job, context.info)
      const need = walkMs(context.info, here, target)
      if (time + need > limit) {
        const duration = limit - time
        const path = truncated(pathFor(context.info, here, target), NPC_WALK_SPEED * (duration / 1000))
        const facing = facingOf(here, path.to, state.facing)
        addWalk(state, time, limit, path, facing)
        state.x = path.to.x
        state.d = path.to.d
        state.facing = facing
        return
      }
      if (need > 0) {
        const path = pathFor(context.info, here, target)
        const facing = facingOf(here, target, state.facing)
        addWalk(state, time, time + need, path, facing)
        state.x = target.x
        state.d = target.d
        state.facing = facing
        time += need
      }
      state.atPlace = state.target
      state.lastPlace = state.target
      state.target = null
      state.stopOrdinal += 1
      state.dwellStartMs = time
      state.dwellDurationMs = dwellFor(state.index, state.stopOrdinal, context.seed)
      state.dwellLeftMs = state.dwellDurationMs
      continue
    }

    let next = chooseNext(state, context.seed)
    let attempt = 0
    while (next && !canReturn(state, context, standingSpot(next, state.job, context.info),
      dwellFor(state.index, state.stopOrdinal + 1, context.seed), time) && attempt < state.path.length) {
      attempt += 1
      next = chooseNext(state, context.seed, attempt)
    }
    if (!next || !canReturn(state, context, standingSpot(next, state.job, context.info),
      dwellFor(state.index, state.stopOrdinal + 1, context.seed), time)) {
      planExit(state, context, time, limit)
      return
    }
    state.target = next
  }
}

function planMeeting(
  context: StayContext,
  a: WalkState,
  b: WalkState,
  first: WalkState,
  second: WalkState,
  meetingStart: number,
  left: number,
  right: number,
  slotStart: number,
  slotEnd: number,
): void {
  const meetingEnd = meetingStart + MEETING_MS
  // Each resident meets at its own depth; flat rooms keep both spots on the front line.
  const spots = new Map<WalkState, FloorSpot>([
    [a, { x: a.x <= b.x ? left : right, d: a.d }],
    [b, { x: a.x <= b.x ? right : left, d: b.d }],
  ])
  const walks = new Map<WalkState, number>()
  for (const state of [a, b]) {
    const spot = spots.get(state)!
    walks.set(state, walkMs(context.info, { x: state.x, d: state.d }, spot))
  }

  for (const state of [a, b]) {
    const partner = state === a ? b : a
    const spot = spots.get(state)!
    const other = spots.get(partner)!
    const walk = walks.get(state)!
    const depart = Math.max(slotStart, meetingStart - MEETING_SETTLE_MS - walk)
    const arrival = depart + walk
    const facing: 1 | -1 = facingTo(spot.x, other.x)

    if (depart > slotStart) {
      addStand(state, slotStart, depart, { x: state.x, d: state.d }, state.facing, null,
        state.dwellLeftMs > 0 ? { start: state.dwellStartMs, duration: state.dwellDurationMs } : undefined)
    }
    state.dwellLeftMs = 0
    if (walk > 0) {
      const path = pathFor(context.info, { x: state.x, d: state.d }, spot)
      addWalk(state, depart, arrival, path, facingOf({ x: state.x, d: state.d }, spot, state.facing))
      state.x = spot.x
      state.d = spot.d
    }
    if (arrival < meetingStart) {
      addStand(state, arrival, meetingStart, spot, facing, RESIDENT_IDS[partner.index])
    }
    state.x = spot.x
    state.d = spot.d
    state.facing = facing
    state.atPlace = null
    state.target = null
  }

  addStand(a, meetingStart, meetingStart + 2000, spots.get(a)!, facingTo(spots.get(a)!.x, spots.get(b)!.x), RESIDENT_IDS[b.index])
  addStand(a, meetingStart + 2000, meetingEnd, spots.get(a)!, facingTo(spots.get(a)!.x, spots.get(b)!.x), RESIDENT_IDS[b.index])
  addStand(b, meetingStart, meetingStart + 2000, spots.get(b)!, facingTo(spots.get(b)!.x, spots.get(a)!.x), RESIDENT_IDS[a.index])
  addStand(b, meetingStart + 2000, meetingEnd, spots.get(b)!, facingTo(spots.get(b)!.x, spots.get(a)!.x), RESIDENT_IDS[a.index])

  addEmote(first.plan, meetingStart, meetingStart + 2000, first.job.meet)
  addEmote(second.plan, meetingStart + 2000, meetingEnd, second.job.meet)

  planNormal(a, context, meetingEnd, slotEnd)
  planNormal(b, context, meetingEnd, slotEnd)
}

function facingTo(from: number, to: number): 1 | -1 {
  return to >= from ? 1 : -1
}

function chooseMeeting(
  context: StayContext,
  states: readonly WalkState[],
  slotStart: number,
  slotEnd: number,
): [WalkState, WalkState, number, number, number] | null {
  const slot = Math.floor(slotStart / SLOT_MS)
  if (unit(hash32(context.seed, slot, ROOM_HASH[context.room], 0x6001)) >= MEETING_CHANCE) return null

  const candidates = states.filter((state) =>
    state.availableAt <= slotStart && state.target === null && state.atPlace !== null)
  if (candidates.length < 2) return null

  const pairs: [WalkState, WalkState][] = []
  for (let i = 0; i < candidates.length; i++) {
    for (let j = i + 1; j < candidates.length; j++) pairs.push([candidates[i], candidates[j]])
  }
  const pair = pairs[hash32(context.seed, slot, ROOM_HASH[context.room], 0x6002) % pairs.length]
  const [a, b] = pair

  const center = clamp(
    (a.x + b.x) / 2,
    context.info.minX + 0.6,
    Math.max(context.info.minX + 0.6, context.info.maxX - 0.6),
  )
  let left = center - 0.3
  let right = center + 0.3
  const min = context.info.minX + 0.3
  const max = Math.max(min, context.info.maxX - 0.3)
  if (left < min) {
    left = min
    right = Math.min(max, left + 0.6)
  }
  if (right > max) {
    right = max
    left = Math.max(min, right - 0.6)
  }

  const walkA = walkMs(context.info, { x: a.x, d: a.d }, { x: a.x <= b.x ? left : right, d: a.d })
  const walkB = walkMs(context.info, { x: b.x, d: b.d }, { x: a.x <= b.x ? right : left, d: b.d })
  const meetingStart = slotStart + Math.max(walkA, walkB) + MEETING_SETTLE_MS
  const meetingEnd = meetingStart + MEETING_MS
  if (meetingEnd > slotEnd - MEETING_END_GAP_MS || meetingEnd > context.endMs - LEAVE_MARGIN_MS) return null
  return [a, b, meetingStart, left, right]
}

function planSlot(context: StayContext, states: readonly WalkState[], slotStart: number, slotEnd: number): void {
  const meeting = chooseMeeting(context, states, slotStart, slotEnd)
  if (meeting) {
    const [a, b, meetingStart, left, right] = meeting
    const first = a.index <= b.index ? a : b
    const second = first === a ? b : a
    planMeeting(context, a, b, first, second, meetingStart, left, right, slotStart, slotEnd)
  }
  for (const state of states) {
    if (meeting && (state === meeting[0] || state === meeting[1])) continue
    planNormal(state, context, Math.max(slotStart, state.availableAt), slotEnd)
  }
}

function buildStayPlan(
  room: NpcRoom,
  info: NpcRoomInfo,
  seed: number,
  startBlock: number,
  endBlock: number,
  residents: readonly number[],
  buildUntil: number,
): StayPlan {
  const context: StayContext = {
    room,
    info,
    seed,
    startMs: startBlock * BLOCK_MS,
    endMs: endBlock * BLOCK_MS,
  }
  const previous = roomAtBlock(startBlock - 1, seed)
  const next = roomAtBlock(endBlock, seed)
  const roomIds = residents.map((index) => RESIDENT_IDS[index]).sort()
  const states: WalkState[] = []

  for (const index of residents) {
    const id = RESIDENT_IDS[index]
    const job = JOBS[id]
    if (!job) continue
    const enters = previous[index] !== room
    const entryX = doorX(info, room, previous[index])
    const exitX = doorX(info, room, next[index])
    const plan: ResidentPlan = { phases: [], emotes: [] }
    if (enters) addGap(plan, context.startMs, context.startMs + TRANSITION_MS)
    states.push({
      index,
      job,
      path: stopPath(id, job, info, roomIds),
      x: entryX,
      d: 0,
      facing: 1,
      atPlace: null,
      lastPlace: null,
      dwellStartMs: 0,
      dwellDurationMs: 0,
      dwellLeftMs: 0,
      target: null,
      cursor: -1,
      stopOrdinal: 0,
      exitX,
      availableAt: context.startMs + (enters ? TRANSITION_MS : 0),
      room,
      plan,
    })
  }

  const statesByIndex = new Map(states.map((state) => [state.index, state]))
  let slotStart = context.startMs
  const limit = Math.min(context.endMs, buildUntil)
  while (slotStart < limit) {
    const slotEnd = Math.min(slotStart + SLOT_MS, context.endMs)
    const live = states.filter((state) => state.availableAt < slotEnd)
    planSlot(context, live, slotStart, slotEnd)
    slotStart = slotEnd
  }

  return { byIndex: new Map([...statesByIndex].map(([index, state]) => [index, state.plan])) }
}

function stateFromPlan(plan: ResidentPlan, time: number, id: string): ResidentState {
  let phase = plan.phases[plan.phases.length - 1]
  for (const candidate of plan.phases) {
    if (time < candidate.end) {
      phase = candidate
      break
    }
  }
  const progress = phase.end > phase.start
    ? clamp((time - phase.start) / (phase.end - phase.start), 0, 1)
    : 1
  const hasSpot = phase.room !== null && phase.from !== null && phase.to !== null
  const done = phase.length * progress
  const at = hasSpot
    ? along({ from: phase.from!, to: phase.to!, route: phase.route, length: phase.length }, done)
    : null
  const x = at?.x ?? null
  const d = at?.d ?? null
  const walk = hasSpot && phase.length > 1e-9
    ? { from: { ...phase.from! }, to: { ...phase.to! }, length: phase.length, done }
    : null

  let emote: string | null = null
  for (const event of plan.emotes) {
    if (time >= event.start && time < event.end) {
      emote = event.emote
      break
    }
  }

  return {
    id,
    room: phase.room,
    x,
    d,
    facing: phase.facing,
    walk,
    meetingWith: phase.meetingWith,
    emote,
  }
}

// A room publishes a new info object when its walkable layout changes. Positions and
// emotes still interpolate every frame; the underlying itinerary changes once per slot.
const plans = new WeakMap<NpcRoomInfo, { room: NpcRoom; seed: number; slot: number; plan: StayPlan }>()

/** Every resident's state at one wall-clock instant; pure and independent of the browser. */
export function residentsAt(
  timeMs: number,
  view: { room: NpcRoom; info: NpcRoomInfo } | null,
  seed = SCHEDULE_SEED,
): ResidentState[] {
  const block = Math.floor(timeMs / BLOCK_MS)
  const blockStart = block * BLOCK_MS
  const rooms = roomAtBlock(block, seed)
  const previous = roomAtBlock(block - 1, seed)

  let plan: StayPlan | null = null
  if (view && rooms.some((room) => room === view.room)) {
    const slot = Math.floor(timeMs / SLOT_MS)
    const cached = plans.get(view.info)
    if (cached && cached.room === view.room && cached.seed === seed && cached.slot === slot) {
      plan = cached.plan
    } else {
      const pos = posMod(block + seedOffset(seed), ROOM_TABLE.length)
      const run = RUN_BY_POS[pos]
      const startBlock = block - (pos - run.startPos)
      const endBlock = startBlock + run.length
      const residents = RESIDENT_IDS.map((_, index) => index).filter((index) => rooms[index] === view.room)
      plan = buildStayPlan(view.room, view.info, seed, startBlock, endBlock, residents, (slot + 1) * SLOT_MS)
      plans.set(view.info, { room: view.room, seed, slot, plan })
    }
  }

  return RESIDENT_IDS.map((id, index) => {
    const room = rooms[index]
    if (plan && view && view.room === room) {
      const resident = plan.byIndex.get(index)
      if (resident) return stateFromPlan(resident, timeMs, id)
    }
    const inGap = room !== previous[index] && timeMs < blockStart + TRANSITION_MS
    return {
      id,
      room: inGap ? null : room,
      x: null,
      d: null,
      facing: 1,
      walk: null,
      meetingWith: null,
      emote: null,
    }
  })
}
