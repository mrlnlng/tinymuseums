import { DEPTH_SPAN } from '../rooms/pond/walk.ts'
import type { FloorSpot, Job, NpcRoomInfo, Place, PlaceKind } from './jobs.ts'

export type Emote = string
export type WanderMode = 'idle' | 'walk' | 'greet' | 'meet' | 'leave' | 'gone' | 'work'

export interface Wanderer {
  id: string
  x: number
  /** Depth into a room with ground; 0 in every flat room. */
  d: number
  facing: 1 | -1
  mode: WanderMode
  targetX: number
  targetD: number
  timer: number          // seconds left in the current idle/greet/meet/work
  emote: Emote | null
  emoteTimer: number     // seconds the current emote keeps showing
  partner: string | null // id of the NPC it is meeting
  greetCooldown: number  // seconds before it may greet the player again
  meetCooldown: number
  job: Job
  walkTime: number       // seconds into the current walk/leave; animation only, never a target
  stop: Place | null     // the place it is walking to or working at
  tourDir: 1 | -1        // direction along a tour, so the ends turn back
  resumeWork: number | null // dwell left when a greeting/meeting interrupts work
  resumeMode: 'idle' | 'walk' | 'work' | null // what to go back to after a greeting/meeting
  walk: { from: FloorSpot; to: FloorSpot; length: number; done: number } | null // null when standing still
  walkRoute: readonly FloorSpot[] // the route this leg follows, for sampling by distance
  stopX: number | null   // where it is heading or working, if known
  playerNear: boolean    // whether the player was within greeting range on the previous step
  dwellSeconds: number   // full dwell picked for the current work stop
  workExitEmote: boolean // whether the emote before leaving has been shown
  meetEmoteIn: number    // seconds until this NPC's own meet emote starts; -1 when none is pending
}

export interface Neighbour {
  id: string
  x: number
  canMeet: boolean
  stopX: number | null // where it is heading or working, if known
}

export interface WanderCtx {
  info: NpcRoomInfo
  playerX: number | null
  others: readonly Neighbour[]
  speed: number          // world units / second
  rand(): number         // [0,1)
  /** Keep this local wanderer in the room instead of letting it roam out through a door. */
  stay?: boolean
}

const IDLE_MIN = 3
const IDLE_MAX = 8
const WAIT_MIN = 2
const WAIT_MAX = 4
const GREET_SECONDS = 2.5
const GREET_RADIUS = 1.2
const GREET_COOLDOWN = 25
const MEET_SECONDS_MIN = 6
const MEET_SECONDS_MAX = 8
const MEET_EMOTE_SECONDS = 2
const MEET_COOLDOWN = 30
const WORK_EMOTE_SECONDS = 2.5
const WORK_EXIT_EMOTE_SECONDS = 2
const WORK_EXIT_WINDOW = 2
const WORK_LONG_DWELL = 6
const STROLL_MIN = 1
const STROLL_MAX = 2
const NEIGHBOUR_CLEARANCE = 0.6
const PLAYER_CLEARANCE = 0.8
const EDGE_MARGIN = 0.3
const MAX_DT = 0.25

function between(rand: () => number, min: number, max: number): number {
  return min + (max - min) * rand()
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function idleSeconds(rand: () => number): number {
  return between(rand, IDLE_MIN, IDLE_MAX)
}

function faceToward(from: number, to: number, fallback: 1 | -1): 1 | -1 {
  if (to === from) return fallback
  return to > from ? 1 : -1
}

/** Ground distance in x and the pond's floor d units, matching the resident schedule. */
function floorDistance(a: FloorSpot, b: FloorSpot): number {
  return Math.hypot(b.x - a.x, (b.d - a.d) * DEPTH_SPAN)
}

function routeLength(route: readonly FloorSpot[]): number {
  let length = 0
  for (let i = 1; i < route.length; i++) length += floorDistance(route[i - 1], route[i])
  return length
}

function along(route: readonly FloorSpot[], length: number, distance: number): FloorSpot {
  if (route.length === 0) return { x: 0, d: 0 }
  let left = clamp(distance, 0, length)
  for (let i = 1; i < route.length; i++) {
    const a = route[i - 1]
    const b = route[i]
    const gap = floorDistance(a, b)
    if (left <= gap || i === route.length - 1) {
      const t = gap > 1e-9 ? left / gap : 1
      return { x: a.x + (b.x - a.x) * t, d: a.d + (b.d - a.d) * t }
    }
    left -= gap
  }
  return route[route.length - 1]
}

/** Where a wanderer stands for a place: the job's x offset, at the place's own depth. */
export function standSpot(place: Place, job: Job, info: NpcRoomInfo): FloorSpot {
  const wanted = { x: standX(place, job, info), d: place.d ?? 0 }
  if (!info.ground) return wanted
  // A stand offset can reach past a path edge; the route ends on the nearest walkable spot.
  const from = { x: place.x, d: place.d ?? 0 }
  const route = info.ground.route(from, wanted)
  return route[route.length - 1] ?? wanted
}

function isVisited(job: Job, kind: PlaceKind): boolean {
  return job.visits.includes(kind)
}

function samePlace(a: Place, b: Place): boolean {
  return a === b || (a.kind === b.kind && a.x === b.x && a.name === b.name)
}

function doorsIn(info: NpcRoomInfo): Place[] {
  return info.places.filter((place) => place.kind === 'door')
}

/** Where a NPC stands for a place, kept off the floor edges. */
export function standX(place: Place, job: Job, info: NpcRoomInfo): number {
  const low = info.minX + EDGE_MARGIN
  const high = info.maxX - EDGE_MARGIN
  if (low <= high) return clamp(place.x + job.stand, low, high)
  // Room narrower than two margins: stay inside the floor rather than outside it.
  return clamp(place.x + job.stand, info.minX, info.maxX)
}

function blockedAt(x: number, w: Wanderer, ctx: WanderCtx): boolean {
  // shortcut: reserves resting spots only, not paths; upgrade if walkers need right-of-way.
  if (ctx.playerX !== null && Math.abs(ctx.playerX - x) < PLAYER_CLEARANCE) return true
  for (const other of ctx.others) {
    if (other.id === w.id) continue
    if (Math.abs(other.x - x) < NEIGHBOUR_CLEARANCE) return true
    if (other.stopX !== null && Math.abs(other.stopX - x) < NEIGHBOUR_CLEARANCE) return true
  }
  return false
}

function wait(w: Wanderer, ctx: WanderCtx): void {
  w.mode = 'idle'
  w.timer = between(ctx.rand, WAIT_MIN, WAIT_MAX)
  w.targetX = w.x
  w.targetD = w.d
  w.walk = null
  w.walkRoute = []
  w.walkTime = 0
  w.stopX = null
  w.emote = null
  w.emoteTimer = 0
}

function strollTarget(w: Wanderer, ctx: WanderCtx): FloorSpot | null {
  const low = ctx.info.minX + EDGE_MARGIN
  const high = ctx.info.maxX - EDGE_MARGIN
  if (low > high) return null
  const directions: readonly (1 | -1)[] = ctx.rand() < 0.5 ? [1, -1] : [-1, 1]
  for (const direction of directions) {
    const x = clamp(w.x + direction * between(ctx.rand, STROLL_MIN, STROLL_MAX), low, high)
    // Against a wall the clamped target can collapse onto the current spot; try the other way.
    if (Math.abs(x - w.x) < 0.05) continue
    if (!blockedAt(x, w, ctx)) return { x, d: w.d }
  }
  return null
}

function startWalk(w: Wanderer, to: FloorSpot, mode: 'walk' | 'leave', stop: Place | null, ctx: WanderCtx): void {
  const from = { x: w.x, d: w.d }
  const route = ctx.info.ground ? ctx.info.ground.route(from, to) : [from, to]
  const length = routeLength(route)
  w.mode = mode
  w.targetX = to.x
  w.targetD = to.d
  w.stop = stop
  w.stopX = to.x
  w.walk = { from, to, length, done: 0 }
  w.walkRoute = route
  w.walkTime = 0
  w.facing = faceToward(w.x, to.x, w.facing)
  w.emote = null
  w.emoteTimer = 0
}

function beginWork(w: Wanderer, stop: Place, ctx: WanderCtx): void {
  const timer = between(ctx.rand, w.job.dwell[0], w.job.dwell[1])
  const at = standSpot(stop, w.job, ctx.info)
  w.mode = 'work'
  w.stop = stop
  w.stopX = at.x
  w.x = at.x
  w.d = at.d
  w.targetX = w.x
  w.targetD = w.d
  w.walk = null
  w.walkRoute = []
  w.walkTime = 0
  w.timer = timer
  w.dwellSeconds = timer
  w.workExitEmote = false
  w.resumeMode = null
  w.resumeWork = null
  w.emote = w.job.emote
  w.emoteTimer = WORK_EMOTE_SECONDS
}

function chooseStop(w: Wanderer, ctx: WanderCtx): Place | null {
  const matching = ctx.info.places.filter((place) => isVisited(w.job, place.kind))
  if (matching.length === 0) return null

  const sorted = [...matching].sort((a, b) => a.x - b.x)
  const free = sorted.filter((place) => !blockedAt(standX(place, w.job, ctx.info), w, ctx))
  if (free.length === 0) return null

  if (w.job.order === 'errand') {
    const different = w.stop === null ? free : free.filter((place) => !samePlace(place, w.stop!))
    const choices = different.length > 0 ? different : free
    return choices[Math.min(choices.length - 1, Math.floor(ctx.rand() * choices.length))]
  }

  const current = w.stop === null ? null : sorted.find((place) => samePlace(place, w.stop!)) ?? null
  if (current === null) {
    if (w.tourDir === 1) return free.find((place) => place.x >= w.x) ?? free[free.length - 1]
    for (let i = free.length - 1; i >= 0; i--) {
      if (free[i].x <= w.x) return free[i]
    }
    return free[0]
  }

  if (w.tourDir === 1) {
    const next = free.find((place) => place.x > current.x)
    if (next) return next
    w.tourDir = -1
    for (let i = free.length - 1; i >= 0; i--) {
      if (free[i].x < current.x) return free[i]
    }
  } else {
    let previous: Place | null = null
    for (let i = free.length - 1; i >= 0; i--) {
      if (free[i].x < current.x) {
        previous = free[i]
        break
      }
    }
    if (previous) return previous
    w.tourDir = 1
    const next = free.find((place) => place.x > current.x)
    if (next) return next
  }

  // Only this place is free: keep working it instead of waiting forever.
  return free.find((place) => samePlace(place, current)) ?? null
}

function startLeave(w: Wanderer, ctx: WanderCtx): void {
  const doors = doorsIn(ctx.info)
  if (doors.length === 0) return
  const door = doors[Math.min(doors.length - 1, Math.floor(ctx.rand() * doors.length))]
  startWalk(w, { x: door.x, d: 0 }, 'leave', null, ctx)
}

function beginNext(w: Wanderer, ctx: WanderCtx): void {
  w.emote = null
  w.emoteTimer = 0
  w.targetX = w.x
  w.targetD = w.d
  w.walk = null
  w.walkRoute = []
  w.walkTime = 0

  const matching = ctx.info.places.filter((place) => isVisited(w.job, place.kind))
  if (matching.length === 0) {
    // This is not one of its rooms: head out, or stroll if it has no door.
    w.stop = null
    w.stopX = null
    if (!ctx.stay && doorsIn(ctx.info).length > 0) {
      startLeave(w, ctx)
      return
    }
    const stroll = strollTarget(w, ctx)
    if (stroll !== null) startWalk(w, stroll, 'walk', null, ctx)
    else wait(w, ctx)
    return
  }

  const next = chooseStop(w, ctx)
  if (next === null) {
    // Every place of its kinds is taken or too close to the player; try again shortly.
    wait(w, ctx)
    return
  }

  if (!ctx.stay && doorsIn(ctx.info).length > 0 && ctx.rand() < w.job.roam) {
    w.stop = null
    w.stopX = null
    startLeave(w, ctx)
    return
  }

  const target = standSpot(next, w.job, ctx.info)
  if (Math.abs(w.x - target.x) < 1e-9 && Math.abs(w.d - target.d) < 1e-9) {
    beginWork(w, next, ctx)
    return
  }
  startWalk(w, target, 'walk', next, ctx)
}

function resume(w: Wanderer, ctx: WanderCtx): void {
  const mode = w.resumeMode ?? 'idle'
  const work = w.resumeWork
  w.resumeMode = null
  w.resumeWork = null
  w.emote = null
  w.emoteTimer = 0

  if (mode === 'work' && w.stop !== null) {
    w.mode = 'work'
    w.timer = work ?? 0
    w.targetX = w.x
    w.targetD = w.d
    w.walk = null
    w.walkRoute = []
    w.walkTime = 0
    return
  }

  if (mode === 'walk') {
    const target = { x: w.targetX, d: w.targetD }
    if (w.stop !== null && Math.abs(target.x - w.x) < 1e-9 && Math.abs(target.d - w.d) < 1e-9) {
      beginWork(w, w.stop, ctx)
    } else {
      startWalk(w, target, 'walk', w.stop, ctx)
    }
    return
  }

  w.mode = 'idle'
  w.timer = idleSeconds(ctx.rand)
  w.targetX = w.x
  w.targetD = w.d
  w.walk = null
  w.walkRoute = []
  w.walkTime = 0
}

function startGreet(w: Wanderer, playerX: number): void {
  w.resumeMode = w.mode === 'work' ? 'work' : w.mode === 'walk' ? 'walk' : 'idle'
  w.resumeWork = w.mode === 'work' ? w.timer : null
  w.mode = 'greet'
  w.timer = GREET_SECONDS
  w.walk = null
  w.walkRoute = []
  w.walkTime = 0
  w.facing = faceToward(w.x, playerX, w.facing)
  w.emote = '👋'
  w.emoteTimer = GREET_SECONDS
  w.greetCooldown = GREET_COOLDOWN
}

export function createWanderer(id: string, x: number, rand: () => number, job: Job): Wanderer {
  return {
    id,
    x,
    d: 0,
    facing: 1,
    mode: 'idle',
    targetX: x,
    targetD: 0,
    timer: idleSeconds(rand),
    emote: null,
    emoteTimer: 0,
    partner: null,
    greetCooldown: 0,
    meetCooldown: 0,
    job,
    walkTime: 0,
    stop: null,
    tourDir: 1,
    resumeWork: null,
    resumeMode: null,
    walk: null,
    walkRoute: [],
    stopX: null,
    playerNear: false,
    dwellSeconds: 0,
    workExitEmote: false,
    meetEmoteIn: -1,
  }
}

export function wantsToMeet(w: Wanderer): boolean {
  return (w.mode === 'idle' || w.mode === 'walk') && w.meetCooldown <= 0
}

export function startMeeting(a: Wanderer, b: Wanderer, rand: () => number): void {
  const seconds = between(rand, MEET_SECONDS_MIN, MEET_SECONDS_MAX)

  for (const w of [a, b]) {
    w.resumeMode = w.mode === 'work' ? 'work' : w.mode === 'walk' ? 'walk' : 'idle'
    w.resumeWork = w.mode === 'work' ? w.timer : null
    w.mode = 'meet'
    w.timer = seconds
    w.walk = null
    w.walkTime = 0
    w.emote = null
    w.emoteTimer = 0
    w.meetEmoteIn = -1
  }

  a.partner = b.id
  b.partner = a.id
  a.facing = faceToward(a.x, b.x, 1)
  b.facing = faceToward(b.x, a.x, -1)

  // a speaks first, then stepWanderer starts b's emote after its stored delay.
  a.emote = a.job.meet
  a.emoteTimer = MEET_EMOTE_SECONDS
  b.meetEmoteIn = MEET_EMOTE_SECONDS
}

export function stepWanderer(w: Wanderer, dt: number, ctx: WanderCtx): void {
  // A backgrounded tab can deliver one huge frame; consume it in capped slices.
  const step = clamp(dt, 0, MAX_DT)
  if (step === 0) return

  w.greetCooldown = Math.max(0, w.greetCooldown - step)
  w.meetCooldown = Math.max(0, w.meetCooldown - step)

  if (w.emoteTimer > 0) {
    w.emoteTimer = Math.max(0, w.emoteTimer - step)
    if (w.emoteTimer === 0) w.emote = null
  }

  if (w.mode === 'gone') return

  const near = ctx.playerX !== null && Math.abs(ctx.playerX - w.x) <= GREET_RADIUS
  const entered = near && !w.playerNear
  w.playerNear = near

  if (
    entered
    && w.greetCooldown <= 0
    && (w.mode === 'idle' || w.mode === 'walk' || w.mode === 'work')
  ) {
    startGreet(w, ctx.playerX!)
    return
  }

  if (w.mode === 'greet') {
    w.timer -= step
    if (w.timer <= 0) resume(w, ctx)
    return
  }

  if (w.mode === 'meet') {
    if (w.meetEmoteIn > 0) {
      w.meetEmoteIn = Math.max(0, w.meetEmoteIn - step)
      if (w.meetEmoteIn === 0) {
        w.emote = w.job.meet
        w.emoteTimer = MEET_EMOTE_SECONDS
        w.meetEmoteIn = -1
      }
    }
    w.timer -= step
    if (w.timer <= 0) {
      w.partner = null
      w.meetCooldown = MEET_COOLDOWN
      w.meetEmoteIn = -1
      w.emote = null
      w.emoteTimer = 0
      resume(w, ctx)
    }
    return
  }

  if (w.mode === 'work') {
    w.timer -= step
    if (w.timer <= 0) {
      beginNext(w, ctx)
      return
    }
    if (!w.workExitEmote && w.dwellSeconds >= WORK_LONG_DWELL && w.timer <= WORK_EXIT_WINDOW) {
      w.workExitEmote = true
      w.emote = w.job.emote
      w.emoteTimer = WORK_EXIT_EMOTE_SECONDS
    }
    return
  }

  if (w.mode === 'idle') {
    w.timer -= step
    if (w.timer <= 0) beginNext(w, ctx)
    return
  }

  if (w.mode === 'walk' || w.mode === 'leave') {
    w.walkTime += step
    const walk = w.walk
    if (walk === null) {
      w.mode = 'idle'
      w.timer = idleSeconds(ctx.rand)
      return
    }
    const travel = Math.max(0, ctx.speed) * step
    const left = walk.length - walk.done
    if (left <= travel) {
      // Land exactly on the target: no snapping to a walk loop, no stopping short.
      walk.done = walk.length
      w.x = walk.to.x
      w.d = walk.to.d
      w.walk = null
      w.walkRoute = []
      w.walkTime = 0
      w.targetX = w.x
      w.targetD = w.d
      if (w.mode === 'leave') {
        w.mode = 'gone'
        w.stop = null
        w.stopX = null
        w.emote = null
        w.emoteTimer = 0
      } else if (w.stop !== null) {
        beginWork(w, w.stop, ctx)
      } else {
        w.mode = 'idle'
        w.timer = idleSeconds(ctx.rand)
        w.stopX = null
      }
      return
    }
    walk.done += travel
    const before = w.x
    const at = along(w.walkRoute, walk.length, walk.done)
    w.x = at.x
    w.d = at.d
    // Mostly-depth moves keep the facing they had.
    if (Math.abs(w.x - before) > 1e-9) w.facing = w.x > before ? 1 : -1
  }
}
