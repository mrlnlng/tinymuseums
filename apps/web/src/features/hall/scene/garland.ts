export interface GarlandShape {
  /** Thickness of the garland, in world units. */
  height: number
  /** Width of one loop, from hanging point to hanging point. */
  loop: number
  /** How far each loop sags below its hanging points. */
  dip: number
  /** The garland image's width over its height. */
  aspect: number
  /** Painted lengths per loop; even, so every other length is turned round and the pattern repeats each loop. */
  lengthsPerLoop: number
}

export interface Ribbon {
  positions: Float32Array
  uvs: Float32Array
  indices: Uint32Array
}

const SAMPLES_PER_LOOP = 256
const SEGMENTS_PER_LENGTH = 40

/** The hanging curve at `x`: 0 at each hanging point, -dip at the bottom of each loop. */
export function sag(x: number, { loop, dip }: Pick<GarlandShape, 'loop' | 'dip'>): number {
  const f = (((x % loop) + loop) % loop) / loop
  return -dip * Math.sin(Math.PI * f)
}

/**
 * The garland bent along its loops by arc length, so it keeps its thickness through the curve:
 * `loops` loops starting at x = 0, built from painted lengths that overlap where they meet.
 */
export function garlandRibbon(shape: GarlandShape, loops: number): Ribbon {
  const { height, aspect, lengthsPerLoop } = shape
  // One loop's curve, with the arc length at each sample.
  const xs = new Float64Array(SAMPLES_PER_LOOP + 1)
  const ss = new Float64Array(SAMPLES_PER_LOOP + 1)
  for (let i = 1; i <= SAMPLES_PER_LOOP; i++) {
    xs[i] = (i / SAMPLES_PER_LOOP) * shape.loop
    ss[i] = ss[i - 1] + Math.hypot(xs[i] - xs[i - 1], sag(xs[i], shape) - sag(xs[i - 1], shape))
  }
  const arc = ss[SAMPLES_PER_LOOP]
  const step = arc / lengthsPerLoop
  const width = Math.max(step, height * aspect)

  /** The point and upward normal at arc length `s` along the whole garland. */
  function at(s: number): [number, number, number, number] {
    const k = Math.floor(s / arc)
    const local = s - k * arc
    let lo = 0
    let hi = SAMPLES_PER_LOOP
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1
      if (ss[mid] <= local) lo = mid
      else hi = mid
    }
    const t = (local - ss[lo]) / (ss[hi] - ss[lo] || 1)
    const x = xs[lo] + t * (xs[hi] - xs[lo])
    const dx = xs[hi] - xs[lo]
    const dy = sag(xs[hi], shape) - sag(xs[lo], shape)
    const length = Math.hypot(dx, dy) || 1
    return [x + k * shape.loop, sag(x, shape), -dy / length, dx / length]
  }

  // Each length is centred on its share of the arc and reaches past it into its neighbours.
  const lengths = loops * lengthsPerLoop
  const perLength = (SEGMENTS_PER_LENGTH + 1) * 2
  const positions = new Float32Array(lengths * perLength * 3)
  const uvs = new Float32Array(lengths * perLength * 2)
  const indices = new Uint32Array(lengths * SEGMENTS_PER_LENGTH * 6)
  let v = 0
  let n = 0
  for (let i = 0; i < lengths; i++) {
    const start = (i + 0.5) * step - width / 2
    const flipped = i % 2 === 1
    const base = v
    for (let j = 0; j <= SEGMENTS_PER_LENGTH; j++) {
      const along = j / SEGMENTS_PER_LENGTH
      // Before the first hanging point the curve carries on, so the first length bends too.
      const [x, y, nx, ny] = at(start + along * width)
      const u = flipped ? 1 - along : along
      for (const side of [0, 1]) {
        const off = (side - 0.5) * height
        positions.set([x + nx * off, y + ny * off, 0], v * 3)
        uvs.set([u, side], v * 2)
        v++
      }
    }
    for (let j = 0; j < SEGMENTS_PER_LENGTH; j++) {
      const a = base + j * 2
      indices.set([a, a + 2, a + 1, a + 1, a + 2, a + 3], n)
      n += 6
    }
  }
  return { positions, uvs, indices }
}
