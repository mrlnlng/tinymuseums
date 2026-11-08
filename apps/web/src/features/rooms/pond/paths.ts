import * as THREE from 'three'
import { liftAt, pathHalfWidth, pathX, scaleAt, type PondPath } from './depth'

const PX_PER_UNIT = 220
/** The path runs a little past the bank toward the viewer before it fades into the grass. */
const NEAR_DEPTH = -0.2
const STEPS = 72

export interface PathSprite {
  texture: THREE.Texture
  /** World-space centre and size of the plane, relative to the bank's feet line. */
  x: number
  lift: number
  width: number
  height: number
}

/** A seeded random, so each path keeps its pebbles and tufts on every visit. */
function random(seed: number): () => number {
  let state = seed >>> 0 || 1
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0
    return state / 4294967296
  }
}

/** A worn sandy track through the grass, drawn once per path in the painting's soft palette. */
export function pathSprite(path: PondPath, grass: string): PathSprite {
  const samples = Array.from({ length: STEPS + 1 }, (_, i) => {
    const d = NEAR_DEPTH + ((1 - NEAR_DEPTH) * i) / STEPS
    return { d, x: pathX(path, d), lift: liftAt(d), half: pathHalfWidth(path, d) }
  })
  const margin = 0.3
  const left = Math.min(...samples.map((s) => s.x - s.half)) - margin
  const right = Math.max(...samples.map((s) => s.x + s.half)) + margin
  const bottom = liftAt(NEAR_DEPTH) - margin
  const top = liftAt(1) + margin
  const width = right - left
  const height = top - bottom

  const canvas = document.createElement('canvas')
  canvas.width = Math.ceil(width * PX_PER_UNIT)
  canvas.height = Math.ceil(height * PX_PER_UNIT)
  const ink = canvas.getContext('2d')
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  const sprite = { texture, x: left + width / 2, lift: bottom + height / 2, width, height }
  if (!ink) return sprite

  const px = (x: number) => (x - left) * PX_PER_UNIT
  const py = (lift: number) => (top - lift) * PX_PER_UNIT
  const shape = (grow: number) => {
    ink.beginPath()
    samples.forEach((s, i) => {
      const reach = s.half * grow
      if (i === 0) ink.moveTo(px(s.x - reach), py(s.lift))
      else ink.lineTo(px(s.x - reach), py(s.lift))
    })
    for (let i = samples.length - 1; i >= 0; i--) {
      const s = samples[i]
      ink.lineTo(px(s.x + s.half * grow), py(s.lift))
    }
    ink.closePath()
  }

  // Soft edges from stacked passes, so the track sinks into the grass rather than sitting on it.
  const passes = [
    { grow: 1.28, color: 'rgba(58, 86, 24, 0.16)' },
    { grow: 1.1, color: 'rgba(176, 160, 98, 0.26)' },
    { grow: 0.96, color: 'rgba(196, 180, 124, 0.38)' },
    { grow: 0.74, color: 'rgba(212, 198, 146, 0.32)' },
    { grow: 0.4, color: 'rgba(222, 210, 164, 0.2)' },
  ]
  for (const pass of passes) {
    ink.fillStyle = pass.color
    shape(pass.grow)
    ink.fill()
  }

  const rand = random(Math.round(path.foot * 1000 + path.end * 7919))

  // Worn dimples down the middle of the track.
  for (const s of samples) {
    if (rand() > 0.55) continue
    const scale = scaleAt(s.d) * PX_PER_UNIT
    const offset = (rand() - 0.5) * s.half * 1.2
    ink.fillStyle = `rgba(150, 128, 76, ${(0.1 + rand() * 0.12).toFixed(2)})`
    ink.beginPath()
    ink.ellipse(px(s.x + offset), py(s.lift), scale * (0.04 + rand() * 0.06), scale * (0.012 + rand() * 0.014), 0, 0, Math.PI * 2)
    ink.fill()
  }

  // A few outlined pebbles, as the props are outlined.
  for (let i = 0; i < 7; i++) {
    const s = samples[Math.floor(4 + rand() * (samples.length - 10))]
    const scale = scaleAt(s.d) * PX_PER_UNIT
    const side = rand() < 0.5 ? -1 : 1
    const x = px(s.x + side * s.half * (0.55 + rand() * 0.4))
    const y = py(s.lift)
    ink.fillStyle = rand() < 0.5 ? '#e4dcc6' : '#cdc2a8'
    ink.strokeStyle = 'rgba(80, 41, 29, 0.6)'
    ink.lineWidth = Math.max(1, scale * 0.012)
    ink.beginPath()
    ink.ellipse(x, y, scale * (0.035 + rand() * 0.03), scale * (0.018 + rand() * 0.012), 0, 0, Math.PI * 2)
    ink.fill()
    ink.stroke()
  }

  // Grass tufts leaning over both edges.
  const blades = ['#4d7f1f', '#5f9327', grass, '#8fc23d']
  samples.forEach((s, i) => {
    if (i % 2 === 1) return
    const scale = scaleAt(s.d) * PX_PER_UNIT
    for (const side of [-1, 1]) {
      if (rand() < 0.3) continue
      const baseX = px(s.x + side * s.half * (0.92 + rand() * 0.16))
      const baseY = py(s.lift)
      const count = 2 + Math.floor(rand() * 3)
      for (let b = 0; b < count; b++) {
        const tall = scale * (0.07 + rand() * 0.08)
        const lean = side * -scale * (0.01 + rand() * 0.04)
        ink.strokeStyle = blades[Math.floor(rand() * blades.length)]
        ink.lineWidth = Math.max(1, scale * 0.014)
        ink.lineCap = 'round'
        ink.beginPath()
        const x = baseX + (b - count / 2) * scale * 0.018
        ink.moveTo(x, baseY)
        ink.quadraticCurveTo(x + lean * 0.3, baseY - tall * 0.6, x + lean, baseY - tall)
        ink.stroke()
      }
    }
  })

  // Fade the near end into the bank's grass.
  ink.globalCompositeOperation = 'destination-in'
  const fade = ink.createLinearGradient(0, py(-0.08), 0, py(-0.62))
  fade.addColorStop(0, '#000')
  fade.addColorStop(1, 'transparent')
  ink.fillStyle = fade
  ink.fillRect(0, 0, canvas.width, canvas.height)
  ink.globalCompositeOperation = 'source-over'

  texture.needsUpdate = true
  return sprite
}
