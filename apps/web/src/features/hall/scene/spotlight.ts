import * as THREE from 'three'
import { CONFIG } from './config'

const SIZE = 256
/** The width the texture's top edge was drawn for; every beam reuses that shape. */
const NOMINAL_WIDTH = 2.6
const WARM_WHITE = [255, 244, 214] as const

let texture: THREE.CanvasTexture | null = null
let material: THREE.MeshBasicMaterial | null = null

function beamTexture(): THREE.CanvasTexture {
  if (texture) return texture

  const canvas = document.createElement('canvas')
  canvas.width = SIZE
  canvas.height = SIZE
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('spotlight needs a 2d canvas')

  const image = ctx.createImageData(SIZE, SIZE)
  const topFraction = CONFIG.spotlight.topWidth / (NOMINAL_WIDTH * CONFIG.spotlight.spread)
  for (let y = 0; y < SIZE; y++) {
    const down = 1 - y / (SIZE - 1)
    const vertical = down * down
    const half = (topFraction + (1 - topFraction) * (y / (SIZE - 1))) / 2
    const left = (0.5 - half) * SIZE
    const right = (0.5 + half) * SIZE
    const beamWidth = right - left
    for (let x = 0; x < SIZE; x++) {
      const u = (x + 0.5 - left) / beamWidth
      const edge = Math.max(0, Math.min(1, u / 0.25, (1 - u) / 0.25))
      const soft = edge * edge * (3 - 2 * edge)
      const at = (y * SIZE + x) * 4
      image.data[at] = WARM_WHITE[0]
      image.data[at + 1] = WARM_WHITE[1]
      image.data[at + 2] = WARM_WHITE[2]
      image.data[at + 3] = Math.round(vertical * soft * 255)
    }
  }
  ctx.putImageData(image, 0, 0)

  texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.needsUpdate = true
  return texture
}

function beamMaterial(): THREE.MeshBasicMaterial {
  material ??= new THREE.MeshBasicMaterial({
    map: beamTexture(),
    transparent: true,
    opacity: CONFIG.spotlight.opacity,
    depthWrite: false,
  })
  return material
}

/** A beam reaching from above the view down past the top of a painting. */
export function createSpotlight(width: number, bottom: number, height: number): THREE.Mesh {
  const top = CONFIG.spotlight.topY
  const lower = bottom + height * (1 - CONFIG.spotlight.reach)
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(width * CONFIG.spotlight.spread, top - lower),
    beamMaterial(),
  )
  mesh.position.set(0, (top + lower) / 2, CONFIG.spotlight.z)
  return mesh
}

export function disposeSpotlights(): void {
  material?.dispose()
  texture?.dispose()
  material = null
  texture = null
}
