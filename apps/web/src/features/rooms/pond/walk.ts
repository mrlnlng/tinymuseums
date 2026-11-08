import { findPath, nearestInside, slide, type FloorPoint, type WalkArea } from '../floor.ts'
import { depthAtLift, scaleAt } from './depth.ts'

/**
 * The ground is walked in floor units: x across, and depth stretched to the length of grass
 * between the bank and the treeline, so a step into the picture is as long as one across it.
 */
export const DEPTH_SPAN = 2.6
/** The visitor stays in front of the props, which stand at depth 1. */
export const MAX_DEPTH = 0.9

const PICTURE = { height: 8, feet: 0.895 }

/** The pond and its mossy rim, traced from the painting as fractions of its width and height. */
const POND_SHORE: readonly [number, number][] = [
  [0.775, 0.69], [0.79, 0.73], [0.785, 0.76], [0.795, 0.79], [0.76, 0.81],
  [0.7, 0.83], [0.6, 0.855], [0.5, 0.875], [0.4, 0.872], [0.3, 0.862], [0.25, 0.835], [0.225, 0.8],
  [0.215, 0.775], [0.2, 0.75], [0.215, 0.73], [0.26, 0.69],
]
const SHORE_MARGIN = { x: 0.22, depth: 0.025 }

export const toFloor = (x: number, depth: number): FloorPoint => ({ x, d: depth * DEPTH_SPAN })
export const depthOf = (p: FloorPoint): number => p.d / DEPTH_SPAN

/** The grass from the bank back to the treeline, with the pond cut out of it and the gate's hedge closed off. */
export function pondFloor(sceneWidth: number, minX: number, maxX: number, hedge: number): WalkArea {
  const centre = 0.495 * sceneWidth
  const shore = POND_SHORE.map(([fx, fy]) => {
    const x = fx * sceneWidth
    const depth = depthAtLift((PICTURE.feet - fy) * PICTURE.height) - SHORE_MARGIN.depth
    return toFloor(x + Math.sign(x - centre) * SHORE_MARGIN.x, Math.min(MAX_DEPTH, Math.max(0.02, depth)))
  })
  // The rim's far corners reach the treeline, so the pond is a bay in the grass rather than an island.
  return {
    outline: [
      toFloor(minX, 0), toFloor(maxX, 0), toFloor(maxX, MAX_DEPTH),
      toFloor(shore[0].x, MAX_DEPTH), ...shore, toFloor(shore[shore.length - 1].x, MAX_DEPTH),
      // The forest gate is set into the hedge at the left end; nobody walks round behind it.
      toFloor(hedge, MAX_DEPTH), toFloor(hedge, 0.04), toFloor(minX, 0.04),
    ],
  }
}

/** A visitor walking the pond's ground: along a tapped route, or steered with the keys. */
export class Walker {
  at: FloorPoint
  route: FloorPoint[] = []
  /** Signed speed for the legs and facing, in world units per second. */
  stride = 0
  private faced: 1 | -1 = 1
  private readonly area: WalkArea

  constructor(area: WalkArea, x: number, depth = 0) {
    this.area = area
    this.at = nearestInside(area, toFloor(x, depth))
  }

  get x(): number {
    return this.at.x
  }

  get depth(): number {
    return depthOf(this.at)
  }

  get facing(): 1 | -1 {
    return this.faced
  }

  get walking(): boolean {
    return this.route.length > 0
  }

  place(x: number, depth = this.depth): void {
    this.at = nearestInside(this.area, toFloor(x, depth))
    this.route = []
  }

  walkTo(x: number, depth: number, via: FloorPoint[] = []): void {
    const stops = [...via, toFloor(x, depth)]
    const route: FloorPoint[] = []
    let from = this.at
    for (const stop of stops) {
      const leg = findPath(this.area, from, stop)
      route.push(...leg)
      if (leg.length > 0) from = leg[leg.length - 1]
    }
    this.route = route
  }

  stop(): void {
    this.route = []
  }

  /** Walk on along the route; far from the bank the visitor covers less of the picture. */
  step(dt: number, speed: number): boolean {
    const before = this.at
    let budget = speed * scaleAt(this.depth) * dt
    while (budget > 1e-6 && this.route.length > 0) {
      const next = this.route[0]
      const gap = Math.hypot(next.x - this.at.x, next.d - this.at.d)
      if (gap <= budget) {
        this.at = next
        this.route.shift()
        budget -= gap
      } else {
        const t = budget / gap
        this.at = slide(this.area, this.at, { x: this.at.x + (next.x - this.at.x) * t, d: this.at.d + (next.d - this.at.d) * t })
        budget = 0
      }
    }
    return this.settle(before, dt)
  }

  /** Steer with the keys: x across, depth into the picture, sliding round the pond. */
  steer(dt: number, across: number, into: number, speed: number): boolean {
    const before = this.at
    const length = Math.hypot(across, into) || 1
    const reach = speed * scaleAt(this.depth) * dt
    this.at = slide(this.area, this.at, {
      x: this.at.x + (across / length) * reach,
      d: this.at.d + (into / length) * reach,
    })
    this.route = []
    return this.settle(before, dt)
  }

  /** Follow x moved by something else (the camera's pull), keeping to the ground. */
  follow(x: number, dt: number): boolean {
    const before = this.at
    this.at = slide(this.area, this.at, { x, d: this.at.d })
    return this.settle(before, dt)
  }

  private settle(before: FloorPoint, dt: number): boolean {
    const dx = this.at.x - before.x
    const moved = Math.hypot(dx, this.at.d - before.d)
    if (Math.abs(dx) > 1e-4) this.faced = dx > 0 ? 1 : -1
    this.stride = dt > 0 && moved > 1e-5 ? (this.faced * moved) / dt : 0
    return moved > 1e-5
  }
}
