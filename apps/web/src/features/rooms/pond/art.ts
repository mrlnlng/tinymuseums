import * as THREE from 'three'
import { assetUrl } from '@/shared/lib/assets'
import { POND_LANDMARKS } from './landmarks'

/** The pond's art: the night garden at full resolution, its lily pad, and crisp woodland extensions. */
export interface PondArt {
  scene: THREE.Texture
  lily: THREE.Texture
  landmarks: Record<string, THREE.Texture>
  /** The woodland past the painting: original foliage and grass reused at full resolution. */
  edges: { left: THREE.Texture; right: THREE.Texture }
  /** Colours sampled from the scene, for the fill above and below the painting. */
  sky: string
  grass: string
}

const FALLBACK_SKY = '#141d31'
const FALLBACK_GRASS = '#6c972f'
const NIGHT = '13, 20, 46'
/** A unit of woodland width, as a fraction of the original painting. */
export const EDGE_BAND = 0.19
/** How many band widths the woodland covers, and how far it reaches back over the painting. */
export const EDGE_BANDS = 5
export const EDGE_OVERLAP = 0.85

function loadTexture(name: 'pond/scene' | 'pond/lily', renderer?: THREE.WebGLRenderer): Promise<THREE.Texture> {
  return new THREE.TextureLoader()
    .loadAsync(assetUrl(name, { density: 3 }))
    .then((texture) => {
      texture.colorSpace = THREE.SRGBColorSpace
      texture.anisotropy = renderer ? renderer.capabilities.getMaxAnisotropy() : 8
      texture.minFilter = THREE.LinearMipmapLinearFilter
      texture.magFilter = THREE.LinearFilter
      texture.needsUpdate = true
      return texture
    })
}

function imageOf(texture: THREE.Texture): HTMLImageElement | ImageBitmap | null {
  return (texture.image as HTMLImageElement | ImageBitmap | undefined) ?? null
}

function sizeOf(image: HTMLImageElement | ImageBitmap): { width: number; height: number } {
  return 'naturalWidth' in image
    ? { width: image.naturalWidth, height: image.naturalHeight }
    : { width: image.width, height: image.height }
}

/** An average colour over a strip of the image, so the fill past its edges matches the garden. */
function colorAt(texture: THREE.Texture, v: number, fallback: string): string {
  const image = imageOf(texture)
  if (!image) return fallback
  try {
    const { width, height } = sizeOf(image)
    if (!width || !height) return fallback
    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1
    const context = canvas.getContext('2d', { willReadFrequently: true })
    if (!context) return fallback
    context.drawImage(image, 0, Math.floor(v * height), width, 2, 0, 0, 1, 1)
    const [r, g, b] = context.getImageData(0, 0, 1, 1).data
    return `#${[r, g, b].map((value) => value.toString(16).padStart(2, '0')).join('')}`
  } catch {
    return fallback
  }
}

/**
 * Continue the original painting into woodland, using its full-width foliage above
 * the pond and its pond-free foreground grass below. No mirrored strips or blur:
 * the forest gets the same varied, crisp plants as the clearing. The source assets
 * are only sampled, never edited. The inner overlap meets the original pixels.
 */
function edgeTexture(texture: THREE.Texture, side: 'left' | 'right', fallback: string): THREE.Texture {
  const image = imageOf(texture)
  const { width, height } = image ? sizeOf(image) : { width: 2388, height: 1668 }
  const forestPx = Math.round(width * EDGE_BAND * EDGE_BANDS)
  const overlapPx = Math.round(width * EDGE_BAND * EDGE_OVERLAP)
  const canvas = document.createElement('canvas')
  canvas.width = forestPx + overlapPx
  canvas.height = height
  const ink = canvas.getContext('2d')
  if (!ink) return new THREE.CanvasTexture(canvas)

  ink.fillStyle = fallback
  ink.fillRect(0, 0, canvas.width, height)
  if (image) {
    // The original foreground below the water is all grass, across the full painting.
    ink.drawImage(image, 0, height * 0.89, width, height * 0.11,
      0, height * 0.6, canvas.width, height * 0.4)

    const foliage = document.createElement('canvas')
    foliage.width = canvas.width
    foliage.height = height
    const plants = foliage.getContext('2d')
    if (plants) {
      plants.drawImage(image, 0, 0, width, height * 0.69,
        0, 0, canvas.width, height * 0.69)
      plants.globalCompositeOperation = 'destination-in'
      const foot = plants.createLinearGradient(0, height * 0.61, 0, height * 0.69)
      foot.addColorStop(0, '#000')
      foot.addColorStop(1, 'transparent')
      plants.fillStyle = foot
      plants.fillRect(0, 0, canvas.width, height)
      ink.drawImage(foliage, 0, 0)
    }

    // Blend only the woodland's inner border onto the matching edge of the painting.
    const join = document.createElement('canvas')
    join.width = overlapPx
    join.height = height
    const seam = join.getContext('2d')
    if (seam) {
      const srcX = side === 'left' ? 0 : width - overlapPx
      seam.drawImage(image, srcX, 0, overlapPx, height, 0, 0, overlapPx, height)
      seam.globalCompositeOperation = 'destination-in'
      const blend = seam.createLinearGradient(0, 0, overlapPx, 0)
      blend.addColorStop(0, side === 'left' ? 'transparent' : '#000')
      blend.addColorStop(1, side === 'left' ? '#000' : 'transparent')
      seam.fillStyle = blend
      seam.fillRect(0, 0, overlapPx, height)
      ink.drawImage(join, side === 'left' ? forestPx : 0, 0)
    }
  }

  // The distant boundary meets the room's night fill; the walkable forest stays bright.
  const inner = side === 'left' ? canvas.width : 0
  const outer = side === 'left' ? 0 : canvas.width
  const night = ink.createLinearGradient(inner, 0, outer, 0)
  night.addColorStop(0, `rgba(${NIGHT}, 0)`)
  night.addColorStop(0.6, `rgba(${NIGHT}, 0)`)
  night.addColorStop(0.82, `rgba(${NIGHT}, 0.18)`)
  night.addColorStop(1, `rgba(${NIGHT}, 1)`)
  ink.fillStyle = night
  ink.fillRect(0, 0, canvas.width, height)

  const result = new THREE.CanvasTexture(canvas)
  result.colorSpace = THREE.SRGBColorSpace
  result.minFilter = THREE.LinearMipmapLinearFilter
  result.magFilter = THREE.LinearFilter
  return result
}

export async function loadPondArt(renderer?: THREE.WebGLRenderer): Promise<PondArt> {
  const loads = [
    loadTexture('pond/scene', renderer),
    loadTexture('pond/lily', renderer),
    ...POND_LANDMARKS.map(async (landmark) => {
      const texture = await new THREE.TextureLoader().loadAsync(landmark.image)
      texture.colorSpace = THREE.SRGBColorSpace
      texture.anisotropy = renderer ? renderer.capabilities.getMaxAnisotropy() : 4
      return texture
    }),
  ]
  const results = await Promise.allSettled(loads)
  const failed = results.find((result) => result.status === 'rejected')
  if (failed) {
    for (const result of results) if (result.status === 'fulfilled') result.value.dispose()
    throw failed.reason
  }
  const textures = results.map((result) => (result as PromiseFulfilledResult<THREE.Texture>).value)
  const [scene, lily] = textures
  const grass = colorAt(scene, 0.995, FALLBACK_GRASS)
  return {
    scene,
    lily,
    landmarks: Object.fromEntries(POND_LANDMARKS.map((landmark, index) => [landmark.kind, textures[index + 2]])),
    edges: { left: edgeTexture(scene, 'left', grass), right: edgeTexture(scene, 'right', grass) },
    sky: colorAt(scene, 0.005, FALLBACK_SKY),
    grass,
  }
}

/** The art cache owns the textures; the room only borrows them. */
export function disposePondArt(art: PondArt): void {
  art.scene.dispose()
  art.lily.dispose()
  art.edges.left.dispose()
  art.edges.right.dispose()
  for (const texture of Object.values(art.landmarks)) texture.dispose()
}
