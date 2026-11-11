import * as THREE from 'three'
import { CONFIG } from './config'

const BEAM_SIZE = 256
/** The width the beam texture's top edge was drawn for; every beam reuses that shape. */
const NOMINAL_WIDTH = 2.6
const WARM_WHITE = [255, 244, 214] as const
const GLINT_COUNT = 3
const GLINT_SECONDS = 0.85
const TAU = Math.PI * 2

let beamMap: THREE.CanvasTexture | null = null
let glowMap: THREE.CanvasTexture | null = null
let starMap: THREE.CanvasTexture | null = null
let starMaterial: THREE.MeshBasicMaterial | null = null
let starGeometry: THREE.PlaneGeometry | null = null
let stillMode: boolean | null = null
let seed = 20261111

export interface PaintingLight {
  group: THREE.Group
  update(dt: number, level: number, t: number): void
  dispose(): void
}

function mulberry(seedValue: number): () => number {
  let state = seedValue
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function painted(width: number, height: number, draw: (ink: CanvasRenderingContext2D) => void): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ink = canvas.getContext('2d')
  if (ink) draw(ink)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.minFilter = THREE.LinearMipmapLinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.anisotropy = 4
  return texture
}

function getBeamMap(): THREE.CanvasTexture {
  if (beamMap) return beamMap
  const canvas = document.createElement('canvas')
  canvas.width = BEAM_SIZE
  canvas.height = BEAM_SIZE
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('spotlight needs a 2d canvas')

  const image = ctx.createImageData(BEAM_SIZE, BEAM_SIZE)
  const topFraction = CONFIG.spotlight.topWidth / (NOMINAL_WIDTH * CONFIG.spotlight.spread)
  for (let y = 0; y < BEAM_SIZE; y++) {
    const down = 1 - y / (BEAM_SIZE - 1)
    const vertical = down * down
    const half = (topFraction + (1 - topFraction) * (y / (BEAM_SIZE - 1))) / 2
    const left = (0.5 - half) * BEAM_SIZE
    const right = (0.5 + half) * BEAM_SIZE
    const beamWidth = right - left
    for (let x = 0; x < BEAM_SIZE; x++) {
      const u = (x + 0.5 - left) / beamWidth
      const edge = Math.max(0, Math.min(1, u / 0.25, (1 - u) / 0.25))
      const soft = edge * edge * (3 - 2 * edge)
      const at = (y * BEAM_SIZE + x) * 4
      image.data[at] = WARM_WHITE[0]
      image.data[at + 1] = WARM_WHITE[1]
      image.data[at + 2] = WARM_WHITE[2]
      image.data[at + 3] = Math.round(vertical * soft * 255)
    }
  }
  ctx.putImageData(image, 0, 0)
  beamMap = new THREE.CanvasTexture(canvas)
  beamMap.colorSpace = THREE.SRGBColorSpace
  beamMap.needsUpdate = true
  return beamMap
}

function getGlowMap(): THREE.CanvasTexture {
  glowMap ??= painted(64, 64, (ink) => {
    const glow = ink.createRadialGradient(32, 32, 0, 32, 32, 32)
    glow.addColorStop(0, 'rgba(255, 255, 255, 1)')
    glow.addColorStop(0.25, 'rgba(255, 255, 255, 0.55)')
    glow.addColorStop(1, 'rgba(255, 255, 255, 0)')
    ink.fillStyle = glow
    ink.fillRect(0, 0, 64, 64)
  })
  return glowMap
}

function getStarMap(): THREE.CanvasTexture {
  starMap ??= painted(64, 64, (ink) => {
    ink.fillStyle = '#fff4d6'
    ink.beginPath()
    ink.moveTo(32, 2)
    ink.quadraticCurveTo(38, 26, 62, 32)
    ink.quadraticCurveTo(38, 38, 32, 62)
    ink.quadraticCurveTo(26, 38, 2, 32)
    ink.quadraticCurveTo(26, 26, 32, 2)
    ink.fill()
  })
  return starMap
}

function getGlintAssets(): { geometry: THREE.PlaneGeometry; material: THREE.MeshBasicMaterial } {
  starGeometry ??= new THREE.PlaneGeometry(1, 1)
  starMaterial ??= new THREE.MeshBasicMaterial({
    map: getStarMap(),
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  return { geometry: starGeometry, material: starMaterial }
}

/** Read once per visit to the hall, so every rig agrees with the rest of the room. */
function reducedMotion(): boolean {
  if (stillMode === null) {
    stillMode = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }
  return stillMode
}

export function createPaintingLight(width: number, bottom: number, height: number): PaintingLight {
  const random = mulberry(seed++)
  const still = reducedMotion()
  const group = new THREE.Group()

  const top = CONFIG.spotlight.topY
  const lower = bottom + height * (1 - CONFIG.spotlight.reach)
  const beamGeometry = new THREE.PlaneGeometry(width * CONFIG.spotlight.spread, top - lower)
  const beamMaterial = new THREE.MeshBasicMaterial({
    map: getBeamMap(),
    transparent: true,
    opacity: CONFIG.spotlight.opacity,
    depthWrite: false,
  })
  const beam = new THREE.Mesh(beamGeometry, beamMaterial)
  beam.position.set(0, (top + lower) / 2, CONFIG.spotlight.z)
  group.add(beam)

  const haloGeometry = new THREE.PlaneGeometry(width * 1.55, height * 1.4)
  const haloMaterial = new THREE.MeshBasicMaterial({
    map: getGlowMap(),
    color: '#ffce8c',
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  const halo = new THREE.Mesh(haloGeometry, haloMaterial)
  halo.position.set(0, bottom + height / 2, -0.21)
  group.add(halo)

  const poolGeometry = new THREE.PlaneGeometry(width * 1.25, 0.62)
  const poolMaterial = new THREE.MeshBasicMaterial({
    map: getGlowMap(),
    color: '#ffc88c',
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  const pool = new THREE.Mesh(poolGeometry, poolMaterial)
  pool.position.set(0, -0.5, -0.38)
  group.add(pool)

  const glintAssets = getGlintAssets()
  const glints = Array.from({ length: GLINT_COUNT }, () => {
    const mesh = new THREE.Mesh(glintAssets.geometry, glintAssets.material)
    mesh.scale.setScalar(0)
    group.add(mesh)
    return {
      mesh,
      wait: 0.7 + random() * 1.9,
      age: GLINT_SECONDS,
      size: 0.1 + random() * 0.08,
      turn: random() * TAU,
    }
  })

  function startGlint(glint: (typeof glints)[number]): void {
    const side = Math.floor(random() * 4)
    const along = random() * 2 - 1
    const edge = 0.86 + random() * 0.12
    const halfWidth = (width / 2) * edge
    const halfHeight = (height / 2) * edge
    const x = side < 2 ? (side === 0 ? halfWidth : -halfWidth) : along * halfWidth
    const y = side < 2 ? along * halfHeight : (side === 2 ? halfHeight : -halfHeight)
    glint.mesh.position.set(x, bottom + height / 2 + y, 0.02)
    glint.mesh.rotation.z = glint.turn
    glint.mesh.scale.setScalar(0)
    glint.size = 0.1 + random() * 0.08
    glint.age = 0
    glint.wait = 0.7 + random() * 1.9
  }

  let current = 0
  const breathePhase = random() * TAU

  return {
    group,

    update(dt, level, t) {
      current += (level - current) * (1 - Math.exp(-dt / 0.1))
      const breathe = still ? 1 : 1 + 0.04 * Math.sin(t * 0.55 + breathePhase)
      beamMaterial.opacity = CONFIG.spotlight.opacity * (0.55 + 0.45 * current) * breathe
      haloMaterial.opacity = CONFIG.spotlight.halo * (0.4 + 0.6 * current)
      poolMaterial.opacity = CONFIG.spotlight.pool * (0.35 + 0.65 * current)

      const show = !still && current > 0.5
      for (const glint of glints) {
        if (!show) {
          glint.mesh.scale.setScalar(0)
          continue
        }
        if (glint.age < GLINT_SECONDS) {
          glint.age += dt
          const progress = Math.min(1, glint.age / GLINT_SECONDS)
          const scale = glint.size * Math.sin(Math.PI * progress)
          glint.mesh.scale.setScalar(scale)
          glint.mesh.rotation.z = glint.turn + (progress - 0.5) * 0.5
          continue
        }
        glint.wait -= dt
        if (glint.wait <= 0) startGlint(glint)
      }
    },

    dispose() {
      group.removeFromParent()
      beamGeometry.dispose()
      beamMaterial.dispose()
      haloGeometry.dispose()
      haloMaterial.dispose()
      poolGeometry.dispose()
      poolMaterial.dispose()
    },
  }
}

export function disposeSpotlights(): void {
  beamMap?.dispose()
  glowMap?.dispose()
  starMap?.dispose()
  starMaterial?.dispose()
  starGeometry?.dispose()
  beamMap = null
  glowMap = null
  starMap = null
  starMaterial = null
  starGeometry = null
  stillMode = null
}
