import * as THREE from 'three'
import { CONFIG } from './config'

const BEAM_SIZE = 256
/** The width the beam texture's top edge was drawn for; every beam reuses that shape. */
const NOMINAL_WIDTH = 2.6
const WARM_WHITE = [255, 244, 214] as const

let beamMap: THREE.CanvasTexture | null = null
let glowMap: THREE.CanvasTexture | null = null

export interface PaintingLight {
  group: THREE.Group
  update(dt: number, level: number): void
  dispose(): void
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

export function createPaintingLight(width: number, bottom: number, height: number): PaintingLight {
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

  let current = 0

  return {
    group,

    update(dt, level) {
      current += (level - current) * (1 - Math.exp(-dt / 0.6))
      beamMaterial.opacity = CONFIG.spotlight.opacity * (0.8 + 0.2 * current)
      haloMaterial.opacity = CONFIG.spotlight.halo * (0.6 + 0.4 * current)
      poolMaterial.opacity = CONFIG.spotlight.pool * (0.6 + 0.4 * current)
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
  beamMap = null
  glowMap = null
}
