import {
  findPath,
  nearestInside,
  slide,
  type DepthView,
  type FloorPoint,
  type WalkArea,
} from '../../rooms/floor.ts'

export const POND_CENTRE: FloorPoint = { x: 6, d: 2.1 }
export const POND_RADIUS_X = 3.2
export const POND_RADIUS_D = 1.2
export const WALK_SPEED = 2.2
export const CAST_REACH = 0.45
export const CAST_INTO = 1.0
/** The stone rim drawn around the water; the walkable hole includes it. */
export const POND_RIM_X = 0.42
export const POND_RIM_D = 0.25
const EDGE_X = POND_RADIUS_X + POND_RIM_X
const EDGE_D = POND_RADIUS_D + POND_RIM_D

function pondHole(): FloorPoint[] {
  const points: FloorPoint[] = []
  for (let i = 0; i < 20; i++) {
    const angle = (i / 20) * Math.PI * 2
    points.push({
      x: POND_CENTRE.x + Math.cos(angle) * EDGE_X,
      d: POND_CENTRE.d + Math.sin(angle) * EDGE_D,
    })
  }
  return points
}

export const POND_AREA: WalkArea = {
  outline: [
    { x: 0, d: 0 },
    { x: 12, d: 0 },
    { x: 12, d: 4 },
    { x: 0, d: 4 },
  ],
  holes: [pondHole()],
}

export const POND_VIEW: DepthView = { depth: 4, nearY: 0.3, farY: 5.2, farScale: 0.55 }

export const POND_PLAYER_START: FloorPoint = { x: 1.6, d: 0.6 }

export interface PondInput {
  dx: number
  dd: number
}

export type Facing = 'left' | 'right'

export interface PondWorld {
  player: FloorPoint
  path: FloorPoint[]
  facing: Facing
  moving: boolean
}

function ellipsePoint(angle: number): FloorPoint {
  return {
    x: POND_CENTRE.x + Math.cos(angle) * EDGE_X,
    d: POND_CENTRE.d + Math.sin(angle) * EDGE_D,
  }
}

function distance(a: FloorPoint, b: FloorPoint): number {
  return Math.hypot(a.x - b.x, a.d - b.d)
}

function closestOnPondEdge(p: FloorPoint): FloorPoint {
  const samples = 240
  const span = (Math.PI * 2) / samples
  let bestAngle = 0
  let bestDistance = Infinity
  for (let i = 0; i < samples; i++) {
    const angle = i * span
    const d = distance(ellipsePoint(angle), p)
    if (d < bestDistance) {
      bestDistance = d
      bestAngle = angle
    }
  }

  let lo = bestAngle - span
  let hi = bestAngle + span
  for (let i = 0; i < 32; i++) {
    const midLo = lo + (hi - lo) / 3
    const midHi = hi - (hi - lo) / 3
    if (distance(ellipsePoint(midLo), p) <= distance(ellipsePoint(midHi), p)) hi = midHi
    else lo = midLo
  }
  return ellipsePoint((lo + hi) / 2)
}

/** The water point to cast at when standing within reach of the pond, otherwise null. */
export function castSpot(p: FloorPoint): FloorPoint | null {
  const edge = closestOnPondEdge(p)
  if (distance(edge, p) > CAST_REACH + 1e-6) return null
  const dx = POND_CENTRE.x - edge.x
  const dd = POND_CENTRE.d - edge.d
  const length = Math.hypot(dx, dd)
  if (length < 1e-9) return null
  return { x: edge.x + (dx / length) * CAST_INTO, d: edge.d + (dd / length) * CAST_INTO }
}

export function createPondWorld(player: FloorPoint = POND_PLAYER_START): PondWorld {
  return {
    player: nearestInside(POND_AREA, player),
    path: [],
    facing: 'right',
    moving: false,
  }
}

/** Replace the followed path with a route to the nearest walkable point to target. */
export function walkTo(world: PondWorld, target: FloorPoint): PondWorld {
  const path = findPath(POND_AREA, world.player, target)
  return { ...world, path, moving: path.length > 0 }
}

function clampInput(value: number): number {
  if (!Number.isFinite(value)) return 0
  return Math.max(-1, Math.min(1, value))
}

function facingAfter(from: FloorPoint, to: FloorPoint, facing: Facing): Facing {
  if (to.x < from.x - 1e-6) return 'left'
  if (to.x > from.x + 1e-6) return 'right'
  return facing
}

/** Advance one frame: manual input wins and cancels a path; otherwise follow the path. */
export function step(world: PondWorld, input: PondInput, dt: number): PondWorld {
  if (!(dt > 0)) return world

  let dx = clampInput(input.dx)
  let dd = clampInput(input.dd)
  if (dx !== 0 || dd !== 0) {
    const length = Math.hypot(dx, dd)
    if (length > 1) {
      dx /= length
      dd /= length
    }
    const to = { x: world.player.x + dx * WALK_SPEED * dt, d: world.player.d + dd * WALK_SPEED * dt }
    const player = slide(POND_AREA, world.player, to)
    return {
      ...world,
      player,
      path: [],
      facing: facingAfter(world.player, player, world.facing),
      moving: distance(world.player, player) > 1e-5,
    }
  }

  if (world.path.length === 0) {
    return world.moving ? { ...world, moving: false } : world
  }

  let player = world.player
  let path = world.path
  let facing = world.facing
  let remaining = WALK_SPEED * dt

  while (remaining > 1e-9 && path.length > 0) {
    const target = path[0]
    const dxToTarget = target.x - player.x
    const ddToTarget = target.d - player.d
    const gap = Math.hypot(dxToTarget, ddToTarget)
    if (gap <= 1e-9) {
      path = path.slice(1)
      continue
    }
    const travel = Math.min(remaining, gap)
    const to = {
      x: player.x + (dxToTarget / gap) * travel,
      d: player.d + (ddToTarget / gap) * travel,
    }
    const moved = slide(POND_AREA, player, to)
    const travelled = distance(player, moved)
    facing = facingAfter(player, moved, facing)
    player = moved
    remaining -= travelled
    if (gap <= travel + 1e-9) path = path.slice(1)
    else if (travelled < travel * 0.25) {
      path = []
      break
    }
  }

  return { ...world, player, path, facing, moving: path.length > 0 }
}
