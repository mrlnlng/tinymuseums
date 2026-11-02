import {
  deltaE,
  hexToOklab,
  inGamut,
  oklchToOklab,
  toHex,
  type Oklab,
} from './color.ts'

export interface ColorRound {
  target: string
  options: string[]
  answer: number
}

const DISTRACTOR_KINDS = ['lightness', 'chroma', 'hue'] as const
type DistractorKind = (typeof DISTRACTOR_KINDS)[number]

const TARGET_ATTEMPTS = 200
const DISTRACTOR_ATTEMPTS = 80
const ROUND_ATTEMPTS = 24

export function separation(streak: number): number {
  return Math.max(0.018, 0.05 * 0.93 ** streak)
}

export function showMs(streak: number): number {
  return Math.max(700, 1400 - 50 * streak)
}

function randomBetween(rng: () => number, min: number, max: number): number {
  return min + Math.min(1, Math.max(0, rng())) * (max - min)
}

function randomTarget(rng: () => number): Oklab | null {
  for (let attempt = 0; attempt < TARGET_ATTEMPTS; attempt++) {
    const lab = oklchToOklab({
      L: randomBetween(rng, 0.45, 0.85),
      C: randomBetween(rng, 0.06, 0.17),
      h: randomBetween(rng, 0, 360),
    })
    if (inGamut(lab)) return lab
  }
  return null
}

function directionFor(kind: DistractorKind, base: Oklab, rng: () => number): Oklab {
  const sign = rng() < 0.5 ? -1 : 1
  const jitter = () => (rng() - 0.5) * 0.25
  let direction: Oklab

  if (kind === 'lightness') {
    direction = { L: sign, a: jitter(), b: jitter() }
  } else {
    const hue = Math.atan2(base.b, base.a)
    const cos = Math.cos(hue)
    const sin = Math.sin(hue)
    direction =
      kind === 'chroma'
        ? { L: jitter() * 0.5, a: cos * sign + jitter(), b: sin * sign + jitter() }
        : { L: jitter() * 0.5, a: -sin * sign + jitter(), b: cos * sign + jitter() }
  }

  const length = Math.hypot(direction.L, direction.a, direction.b)
  return {
    L: direction.L / length,
    a: direction.a / length,
    b: direction.b / length,
  }
}

interface Distractor {
  hex: string
  lab: Oklab
}

function makeDistractor(
  base: Oklab,
  distance: number,
  kind: DistractorKind,
  rng: () => number,
): Distractor | null {
  for (let attempt = 0; attempt < DISTRACTOR_ATTEMPTS; attempt++) {
    const direction = directionFor(kind, base, rng)
    const candidate = {
      L: base.L + direction.L * distance,
      a: base.a + direction.a * distance,
      b: base.b + direction.b * distance,
    }
    if (!inGamut(candidate)) continue

    const hex = toHex(candidate)
    const lab = hexToOklab(hex)
    if (!inGamut(lab)) continue

    const actual = deltaE(base, lab)
    if (Math.abs(actual - distance) > distance * 0.1 + 1e-9) continue
    return { hex, lab }
  }
  return null
}

function shuffled<T>(items: readonly T[], rng: () => number): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.min(1, Math.max(0, rng())) * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

// A fixed palette keeps a pathological rng from ever hanging the game.
function fallbackRound(distance: number, rng: () => number): ColorRound {
  const base = oklchToOklab({ L: 0.62, C: 0.06, h: 30 })
  const offsets = [
    { L: 1, a: 0, b: 0 },
    { L: 0, a: 1, b: 0 },
    { L: 0, a: 0, b: 1 },
  ]
  const hexes = [
    toHex(base),
    ...offsets.map((offset) =>
      toHex({
        L: base.L + offset.L * distance,
        a: base.a + offset.a * distance,
        b: base.b + offset.b * distance,
      }),
    ),
  ]
  const target = hexes[0]
  const options = shuffled(hexes, rng)
  return { target, options, answer: options.indexOf(target) }
}

export function makeRound(streak: number, rng: () => number): ColorRound {
  const distance = separation(streak)

  for (let attempt = 0; attempt < ROUND_ATTEMPTS; attempt++) {
    const targetLab = randomTarget(rng)
    if (!targetLab) break

    const target = toHex(targetLab)
    const base = hexToOklab(target)
    if (!inGamut(base)) continue

    const distractors: Distractor[] = []
    let valid = true

    for (const kind of DISTRACTOR_KINDS) {
      const candidate = makeDistractor(base, distance, kind, rng)
      if (!candidate) {
        valid = false
        break
      }
      const tooClose = distractors.some(
        (other) => deltaE(candidate.lab, other.lab) < 0.7 * distance,
      )
      if (tooClose) {
        valid = false
        break
      }
      distractors.push(candidate)
    }

    if (!valid) continue

    const options = shuffled([target, ...distractors.map((item) => item.hex)], rng)
    return { target, options, answer: options.indexOf(target) }
  }

  return fallbackRound(distance, rng)
}
