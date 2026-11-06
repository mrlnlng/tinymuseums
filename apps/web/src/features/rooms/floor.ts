export interface FloorPoint { x: number; d: number }
export interface WalkArea { outline: FloorPoint[]; holes?: FloorPoint[][] }
export interface DepthView { depth: number; nearY: number; farY: number; farScale: number }

interface Edge { a: FloorPoint; b: FloorPoint; poly: FloorPoint[]; index: number; hole: boolean }

const EPS = 1e-9
const NUDGE = 1e-4
const VERTEX_NUDGE = 1e-3
const HIT_EPS = 1e-7
const CROSS_EPS = 1e-12

function clone(p: FloorPoint): FloorPoint {
  return { x: p.x, d: p.d }
}

function distanceSq(a: FloorPoint, b: FloorPoint): number {
  const dx = b.x - a.x
  const dd = b.d - a.d
  return dx * dx + dd * dd
}

function cross(a: FloorPoint, b: FloorPoint, c: FloorPoint): number {
  return (b.x - a.x) * (c.d - a.d) - (b.d - a.d) * (c.x - a.x)
}

function crossVec(u: FloorPoint, v: FloorPoint): number {
  return u.x * v.d - u.d * v.x
}

function dot(u: FloorPoint, v: FloorPoint): number {
  return u.x * v.x + u.d * v.d
}

function polygonEdges(poly: FloorPoint[], hole: boolean): Edge[] {
  const edges: Edge[] = []
  for (let i = 0; i < poly.length; i++) {
    edges.push({ a: poly[i], b: poly[(i + 1) % poly.length], poly, index: i, hole })
  }
  return edges
}

function edgesOf(area: WalkArea): Edge[] {
  const edges = polygonEdges(area.outline, false)
  for (const hole of area.holes ?? []) edges.push(...polygonEdges(hole, true))
  return edges
}

function pointOnSegment(a: FloorPoint, b: FloorPoint, p: FloorPoint): boolean {
  const dx = b.x - a.x
  const dd = b.d - a.d
  const lenSq = dx * dx + dd * dd
  if (lenSq <= EPS * EPS) return distanceSq(a, p) <= EPS * EPS
  if (Math.abs(cross(a, b, p)) > EPS * Math.sqrt(lenSq)) return false
  const along = (p.x - a.x) * dx + (p.d - a.d) * dd
  return along >= -EPS && along <= lenSq + EPS
}

function pointInPolygon(poly: FloorPoint[], p: FloorPoint): 'inside' | 'boundary' | 'outside' {
  if (poly.length < 3) return 'outside'
  let inside = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[j]
    const b = poly[i]
    if (pointOnSegment(a, b, p)) return 'boundary'
    if ((a.d > p.d) !== (b.d > p.d)) {
      const x = a.x + ((p.d - a.d) * (b.x - a.x)) / (b.d - a.d)
      if (p.x < x) inside = !inside
    }
  }
  return inside ? 'inside' : 'outside'
}

/** True when p is inside the outline and not strictly inside a hole. */
export function contains(area: WalkArea, p: FloorPoint): boolean {
  if (pointInPolygon(area.outline, p) === 'outside') return false
  for (const hole of area.holes ?? []) {
    if (pointInPolygon(hole, p) === 'inside') return false
  }
  return true
}

function closestOnSegment(a: FloorPoint, b: FloorPoint, p: FloorPoint): FloorPoint {
  const dx = b.x - a.x
  const dd = b.d - a.d
  const lenSq = dx * dx + dd * dd
  if (lenSq <= EPS * EPS) return clone(a)
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.d - a.d) * dd) / lenSq))
  return { x: a.x + dx * t, d: a.d + dd * t }
}

/** p itself when inside, otherwise the closest walkable point on a boundary edge. */
export function nearestInside(area: WalkArea, p: FloorPoint): FloorPoint {
  if (contains(area, p)) return clone(p)

  let best: FloorPoint | null = null
  let bestDist = Infinity
  let fallback: FloorPoint | null = null
  let fallbackDist = Infinity

  for (const edge of edgesOf(area)) {
    const q = closestOnSegment(edge.a, edge.b, p)
    const dist = distanceSq(q, p)
    if (dist < fallbackDist) {
      fallbackDist = dist
      fallback = q
    }
    const dx = edge.b.x - edge.a.x
    const dd = edge.b.d - edge.a.d
    const len = Math.hypot(dx, dd)
    if (len <= EPS) {
      if (contains(area, q) && dist < bestDist) {
        bestDist = dist
        best = clone(q)
      }
      continue
    }
    const nx = -dd / len
    const nd = dx / len
    const candidates = [
      { x: q.x + nx * NUDGE, d: q.d + nd * NUDGE },
      { x: q.x - nx * NUDGE, d: q.d - nd * NUDGE },
    ]
    if (distanceSq(q, edge.a) <= EPS * EPS) {
      const direction = vertexDirection(edge.poly, edge.index, edge.hole)
      if (direction) candidates.push({ x: q.x + direction.x * NUDGE, d: q.d + direction.d * NUDGE })
    }
    if (distanceSq(q, edge.b) <= EPS * EPS) {
      const direction = vertexDirection(edge.poly, (edge.index + 1) % edge.poly.length, edge.hole)
      if (direction) candidates.push({ x: q.x + direction.x * NUDGE, d: q.d + direction.d * NUDGE })
    }
    for (const candidate of candidates) {
      if (contains(area, candidate) && dist < bestDist) {
        bestDist = dist
        best = candidate
      }
    }
  }

  if (best) return best
  if (fallback && contains(area, fallback)) return clone(fallback)
  return clone(p)
}

function segmentHitParam(p: FloorPoint, q: FloorPoint, a: FloorPoint, b: FloorPoint): number | null {
  const r = { x: q.x - p.x, d: q.d - p.d }
  const s = { x: b.x - a.x, d: b.d - a.d }
  const qp = { x: a.x - p.x, d: a.d - p.d }
  const denom = crossVec(r, s)

  if (Math.abs(denom) <= CROSS_EPS) {
    if (Math.abs(crossVec(qp, r)) > EPS) return null
    const rr = dot(r, r)
    if (rr <= EPS * EPS) return pointOnSegment(a, b, p) ? 0 : null
    let t0 = dot(qp, r) / rr
    let t1 = dot({ x: b.x - p.x, d: b.d - p.d }, r) / rr
    if (t0 > t1) [t0, t1] = [t1, t0]
    const lo = Math.max(0, t0)
    const hi = Math.min(1, t1)
    return lo <= hi + EPS ? Math.max(0, Math.min(1, lo)) : null
  }

  const t = crossVec(qp, s) / denom
  const u = crossVec(qp, r) / denom
  if (t < -EPS || t > 1 + EPS || u < -EPS || u > 1 + EPS) return null
  return Math.max(0, Math.min(1, t))
}

function properCrossing(a: FloorPoint, b: FloorPoint, c: FloorPoint, d: FloorPoint): boolean {
  const o1 = cross(a, b, c)
  const o2 = cross(a, b, d)
  const o3 = cross(c, d, a)
  const o4 = cross(c, d, b)
  if (Math.abs(o1) <= CROSS_EPS || Math.abs(o2) <= CROSS_EPS) return false
  if (Math.abs(o3) <= CROSS_EPS || Math.abs(o4) <= CROSS_EPS) return false
  return (o1 > 0) !== (o2 > 0) && (o3 > 0) !== (o4 > 0)
}

function lineOfSight(area: WalkArea, a: FloorPoint, b: FloorPoint): boolean {
  const mid = { x: (a.x + b.x) / 2, d: (a.d + b.d) / 2 }
  if (!contains(area, mid)) return false
  for (const edge of edgesOf(area)) {
    if (properCrossing(a, b, edge.a, edge.b)) return false
  }
  return true
}

/** One movement step, sliding along the first boundary edge it hits. */
export function slide(area: WalkArea, from: FloorPoint, to: FloorPoint): FloorPoint {
  const start = clone(from)
  const end = clone(to)
  if (distanceSq(start, end) <= EPS * EPS) return start
  if (contains(area, end) && lineOfSight(area, start, end)) return end

  const movement = { x: end.x - start.x, d: end.d - start.d }
  const total = Math.hypot(movement.x, movement.d)

  let hitT = Infinity
  let hitEdge: Edge | null = null
  for (const edge of edgesOf(area)) {
    const t = segmentHitParam(start, end, edge.a, edge.b)
    if (t !== null && t > HIT_EPS && t < hitT) {
      hitT = t
      hitEdge = edge
    }
  }

  let hit: FloorPoint
  let backoff: number
  if (hitEdge && Number.isFinite(hitT)) {
    hit = { x: start.x + movement.x * hitT, d: start.d + movement.d * hitT }
    backoff = Math.min(NUDGE, hitT * total)
  } else {
    hit = start
    backoff = 0
    hitEdge = edgesOf(area).find((edge) => pointOnSegment(edge.a, edge.b, start)) ?? null
    if (!hitEdge) return start
  }

  const backedOff = backoff > 0
    ? {
        x: hit.x - (movement.x / total) * backoff,
        d: hit.d - (movement.d / total) * backoff,
      }
    : clone(hit)

  const ex = hitEdge.b.x - hitEdge.a.x
  const ed = hitEdge.b.d - hitEdge.a.d
  const edgeLen = Math.hypot(ex, ed)
  if (edgeLen <= EPS) return contains(area, backedOff) ? backedOff : start

  const ux = ex / edgeLen
  const ud = ed / edgeLen
  const remaining = { x: end.x - hit.x, d: end.d - hit.d }
  const projected = dot(remaining, { x: ux, d: ud })
  const result = { x: backedOff.x + ux * projected, d: backedOff.d + ud * projected }

  if (contains(area, result) && lineOfSight(area, backedOff, result)) return result
  return contains(area, backedOff) ? backedOff : start
}

function signedArea(poly: FloorPoint[]): number {
  let sum = 0
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i]
    const b = poly[(i + 1) % poly.length]
    sum += a.x * b.d - b.x * a.d
  }
  return sum / 2
}

function vertexDirection(poly: FloorPoint[], index: number, hole: boolean): FloorPoint | null {
  const area = signedArea(poly)
  if (Math.abs(area) <= EPS) return null
  const previous = poly[(index + poly.length - 1) % poly.length]
  const current = poly[index]
  const next = poly[(index + 1) % poly.length]

  const incoming = { x: current.x - previous.x, d: current.d - previous.d }
  const outgoing = { x: next.x - current.x, d: next.d - current.d }
  const inLen = Math.hypot(incoming.x, incoming.d)
  const outLen = Math.hypot(outgoing.x, outgoing.d)
  if (inLen <= EPS || outLen <= EPS) return null

  const orientation = area > 0 ? 1 : -1
  let nx = (-incoming.d / inLen + -outgoing.d / outLen) * orientation
  let nd = (incoming.x / inLen + outgoing.x / outLen) * orientation
  let len = Math.hypot(nx, nd)
  if (len <= EPS) {
    nx = (-incoming.d / inLen) * orientation
    nd = (incoming.x / inLen) * orientation
    len = Math.hypot(nx, nd)
  }
  if (len <= EPS) return null
  nx /= len
  nd /= len
  if (hole) {
    nx = -nx
    nd = -nd
  }
  return { x: nx, d: nd }
}

function nudgeVertex(poly: FloorPoint[], index: number, hole: boolean): FloorPoint | null {
  const direction = vertexDirection(poly, index, hole)
  if (!direction) return null
  return {
    x: poly[index].x + direction.x * VERTEX_NUDGE,
    d: poly[index].d + direction.d * VERTEX_NUDGE,
  }
}

function pathNodes(area: WalkArea, start: FloorPoint, goal: FloorPoint): FloorPoint[] {
  const nodes = [clone(start), clone(goal)]
  const addVertices = (poly: FloorPoint[], hole: boolean) => {
    for (let i = 0; i < poly.length; i++) {
      const nudged = nudgeVertex(poly, i, hole)
      if (nudged && contains(area, nudged)) nodes.push(nudged)
    }
  }
  addVertices(area.outline, false)
  for (const hole of area.holes ?? []) addVertices(hole, true)
  return nodes
}

function shortestPath(area: WalkArea, nodes: FloorPoint[]): FloorPoint[] {
  const count = nodes.length
  const dist = new Array<number>(count).fill(Infinity)
  const previous = new Array<number>(count).fill(-1)
  const used = new Array<boolean>(count).fill(false)
  dist[0] = 0

  for (let step = 0; step < count; step++) {
    let current = -1
    let best = Infinity
    for (let i = 0; i < count; i++) {
      if (!used[i] && dist[i] < best) {
        best = dist[i]
        current = i
      }
    }
    if (current === -1) break
    if (current === 1) break
    used[current] = true

    for (let next = 0; next < count; next++) {
      if (next === current || used[next]) continue
      const weight = Math.sqrt(distanceSq(nodes[current], nodes[next]))
      if (dist[current] + weight >= dist[next]) continue
      if (!lineOfSight(area, nodes[current], nodes[next])) continue
      dist[next] = dist[current] + weight
      previous[next] = current
    }
  }

  if (!Number.isFinite(dist[1])) return []
  const reversed: FloorPoint[] = []
  for (let node = 1; node !== -1; node = previous[node]) reversed.push(clone(nodes[node]))
  reversed.reverse()
  return reversed.slice(1)
}

/** Shortest boundary-following route from from to the nearest walkable point to to. */
export function findPath(area: WalkArea, from: FloorPoint, to: FloorPoint): FloorPoint[] {
  const start = nearestInside(area, from)
  const goal = nearestInside(area, to)
  if (lineOfSight(area, start, goal)) return [clone(goal)]
  return shortestPath(area, pathNodes(area, start, goal))
}

/** Bounds of the walkable outline. */
export function depthBounds(area: WalkArea): { minX: number; maxX: number; minD: number; maxD: number } {
  if (area.outline.length === 0) return { minX: 0, maxX: 0, minD: 0, maxD: 0 }
  let minX = Infinity
  let maxX = -Infinity
  let minD = Infinity
  let maxD = -Infinity
  for (const p of area.outline) {
    if (p.x < minX) minX = p.x
    if (p.x > maxX) maxX = p.x
    if (p.d < minD) minD = p.d
    if (p.d > maxD) maxD = p.d
  }
  return { minX, maxX, minD, maxD }
}

function depthT(view: DepthView, d: number): number {
  if (view.depth <= 0) return d <= 0 ? 0 : 1
  return Math.max(0, Math.min(1, d / view.depth))
}

/** Screen y of a floor depth, interpolated from nearY at the front edge to farY at the back. */
export function feetY(view: DepthView, d: number): number {
  const t = depthT(view, d)
  return view.nearY + (view.farY - view.nearY) * t
}

/** Scale of a figure at a floor depth. */
export function scaleAt(view: DepthView, d: number): number {
  const t = depthT(view, d)
  return 1 + (view.farScale - 1) * t
}

/** Floor depth under a screen y, the inverse of feetY clamped to the view depth. */
export function depthAtY(view: DepthView, y: number): number {
  if (view.farY === view.nearY) return y <= view.nearY ? 0 : view.depth
  const t = Math.max(0, Math.min(1, (y - view.nearY) / (view.farY - view.nearY)))
  return t * view.depth
}
