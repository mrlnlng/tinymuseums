import * as THREE from 'three'
import { assetUrl } from '@/shared/lib/assets'
import { POND_LANDMARKS } from './landmarks'
import layout from '../../../../public/assets/pond/layout.json'

/** The daytime garden, its aligned overlays, and crisp woodland extensions. */
export interface PondArt {
  scene: THREE.Texture
  /** The painted garden that continues the scene to its left. */
  left: THREE.Texture
  bridge: THREE.Texture
  path: THREE.Texture
  lily: THREE.Texture
  sparkles: THREE.Texture
  landmarks: Record<string, THREE.Texture>
  /** The gate's sign, kept apart from the gate so it can swing on its chains. */
  gateSign: THREE.Texture
  /** The woodland past the painting: original foliage and grass reused at full resolution. */
  edges: { left: THREE.Texture; right: THREE.Texture }
  /** Colours sampled from the scene, for the fill above and below the painting. */
  sky: string
  grass: string
}

const FALLBACK_SKY = '#38592c'
const FALLBACK_GRASS = '#6c972f'
const FOREST = '32, 69, 35'
/** A unit of woodland width, as a fraction of the original painting. */
export const EDGE_BAND = 0.19
/** How many band widths the woodland covers, and how far it reaches back over the painting. */
export const EDGE_BANDS = 5
export const EDGE_OVERLAP = 0.85

function loadTexture(name: 'pond/forest-door-sign' | 'pond/scene' | 'pond/scene-left' | 'pond/bridge' | 'pond/stone-path' | 'pond/lily' | 'pond/sparkles', renderer?: THREE.WebGLRenderer): Promise<THREE.Texture> {
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
function edgeTexture(texture: THREE.Texture, side: 'left' | 'right', fallback: string, neighbour: THREE.Texture = texture): THREE.Texture {
  const image = imageOf(texture)
  const beside = imageOf(neighbour)
  const { width, height } = image ? sizeOf(image) : layout.scene
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
      const foliageBottom = Math.min(...layout.water.map(([, y]) => y)) - 0.02
      plants.drawImage(image, 0, 0, width, height * foliageBottom,
        0, 0, canvas.width, height * foliageBottom)
      plants.globalCompositeOperation = 'destination-in'
      const foot = plants.createLinearGradient(0, height * (foliageBottom - 0.08), 0, height * foliageBottom)
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
    if (seam && beside) {
      const besideSize = sizeOf(beside)
      const srcWidth = overlapPx * (besideSize.height / height)
      const srcX = side === 'left' ? 0 : besideSize.width - srcWidth
      seam.drawImage(beside, srcX, 0, srcWidth, besideSize.height, 0, 0, overlapPx, height)
      seam.globalCompositeOperation = 'destination-in'
      const blend = seam.createLinearGradient(0, 0, overlapPx, 0)
      blend.addColorStop(0, side === 'left' ? 'transparent' : '#000')
      blend.addColorStop(1, side === 'left' ? '#000' : 'transparent')
      seam.fillStyle = blend
      seam.fillRect(0, 0, overlapPx, height)
      ink.drawImage(join, side === 'left' ? forestPx : 0, 0)
    }
  }

  // The distant boundary meets the canopy's green shade; the walkable forest stays bright.
  const inner = side === 'left' ? canvas.width : 0
  const outer = side === 'left' ? 0 : canvas.width
  const shade = ink.createLinearGradient(inner, 0, outer, 0)
  shade.addColorStop(0, `rgba(${FOREST}, 0)`)
  shade.addColorStop(0.6, `rgba(${FOREST}, 0)`)
  shade.addColorStop(0.82, `rgba(${FOREST}, 0.18)`)
  shade.addColorStop(1, `rgba(${FOREST}, 1)`)
  ink.fillStyle = shade
  ink.fillRect(0, 0, canvas.width, height)

  const result = new THREE.CanvasTexture(canvas)
  result.colorSpace = THREE.SRGBColorSpace
  result.minFilter = THREE.LinearMipmapLinearFilter
  result.magFilter = THREE.LinearFilter
  return result
}

function blank(width: number, height: number): [HTMLCanvasElement, CanvasRenderingContext2D | null] {
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(width))
  canvas.height = Math.max(1, Math.round(height))
  return [canvas, canvas.getContext('2d')]
}

/** A soft copy of a layer: shrunk and drawn back up, which blurs in every browser. */
function softened(source: HTMLCanvasElement, factor: number): HTMLCanvasElement {
  const [small, shrink] = blank(source.width / factor, source.height / factor)
  const [out, grow] = blank(source.width, source.height)
  if (!shrink || !grow) return source
  shrink.imageSmoothingQuality = 'high'
  shrink.drawImage(source, 0, 0, small.width, small.height)
  grow.imageSmoothingQuality = 'high'
  grow.drawImage(small, 0, 0, out.width, out.height)
  return out
}

const STONE_SHADE = [104, 112, 92]
const STONE_LIGHT = [222, 216, 194]
const TUFT = [150, 190, 72]

/**
 * The stepping stones arrive on a flat lime backing that sits on the painting like a sticker.
 * Keep only the stones, warmed and dabbed with moss, set into the lawn by their own shadow
 * and a faint trodden trail, so the painted grass shows between them.
 */
function pathTexture(texture: THREE.Texture): THREE.Texture {
  const image = imageOf(texture)
  if (!image) return texture
  const { width, height } = sizeOf(image)
  const [source, read] = blank(width, height)
  const [stones, stoneInk] = blank(width, height)
  const [tufts, tuftInk] = blank(width, height)
  const [trail, trailInk] = blank(width, height)
  const [out, ink] = blank(width, height)
  if (!read || !stoneInk || !tuftInk || !trailInk || !ink) return texture
  let pixels: ImageData
  try {
    read.drawImage(image, 0, 0)
    pixels = read.getImageData(0, 0, width, height)
  } catch {
    return texture
  }
  const stone = stoneInk.createImageData(width, height)
  const tuft = tuftInk.createImageData(width, height)
  const worn = trailInk.createImageData(width, height)
  const data = pixels.data
  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3]
    if (alpha === 0) continue
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const max = Math.max(r, g, b)
    const saturation = max ? (max - Math.min(r, g, b)) / max : 0
    const stoniness = Math.min(1, Math.max(0, (0.62 - saturation) / 0.4))
    worn.data[i + 3] = alpha
    if (stoniness > 0) {
      // Far stones sit in haze: lighter and flatter than the ones underfoot.
      const near = (i / 4 / width) / height
      const light = Math.min(1, Math.max(0, (max / 255 - 0.5) / 0.3)) * (0.82 + 0.18 * near) + 0.14 * (1 - near)
      for (let c = 0; c < 3; c++) stone.data[i + c] = STONE_SHADE[c] + (STONE_LIGHT[c] - STONE_SHADE[c]) * Math.min(1, light)
      stone.data[i + 3] = alpha * stoniness
    } else if (r > 182) {
      for (let c = 0; c < 3; c++) tuft.data[i + c] = TUFT[c]
      tuft.data[i + 3] = alpha * 0.9
    }
  }
  stoneInk.putImageData(stone, 0, 0)
  tuftInk.putImageData(tuft, 0, 0)
  trailInk.putImageData(worn, 0, 0)

  // Brush dabs keep the stones from reading as flat vector shapes.
  stoneInk.globalCompositeOperation = 'source-atop'
  let seed = 7
  const random = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646
  const unit = width / 2400
  for (let i = 0; i < 520; i++) {
    const x = random() * width
    const y = random() * height
    const moss = random() < 0.4
    stoneInk.fillStyle = moss ? `rgba(118, 150, 70, ${0.1 + random() * 0.14})` : `rgba(255, 250, 232, ${0.06 + random() * 0.12})`
    stoneInk.beginPath()
    stoneInk.ellipse(x, y, (18 + random() * 46) * unit, (5 + random() * 9) * unit, (random() - 0.5) * 0.5, 0, Math.PI * 2)
    stoneInk.fill()
  }
  stoneInk.globalCompositeOperation = 'source-over'

  const tinted = (layer: HTMLCanvasElement, colour: string): HTMLCanvasElement => {
    const [copy, paint] = blank(width, height)
    if (!paint) return layer
    paint.drawImage(layer, 0, 0)
    paint.globalCompositeOperation = 'source-in'
    paint.fillStyle = colour
    paint.fillRect(0, 0, width, height)
    return copy
  }
  ink.globalAlpha = 0.2
  ink.drawImage(softened(softened(tinted(trail, '#c9c27a'), 24), 12), 0, 0)
  ink.globalAlpha = 0.55
  ink.drawImage(softened(tinted(stones, '#2f5a22'), 10), 0, 14 * unit)
  ink.globalAlpha = 1
  ink.drawImage(stones, 0, 0)
  ink.drawImage(tufts, 0, 0)

  const result = new THREE.CanvasTexture(out)
  result.colorSpace = THREE.SRGBColorSpace
  result.anisotropy = texture.anisotropy
  result.minFilter = THREE.LinearMipmapLinearFilter
  result.magFilter = THREE.LinearFilter
  texture.dispose()
  return result
}

export async function loadPondArt(renderer?: THREE.WebGLRenderer): Promise<PondArt> {
  const loads = [
    loadTexture('pond/scene', renderer),
    loadTexture('pond/lily', renderer),
    loadTexture('pond/sparkles', renderer),
    loadTexture('pond/scene-left', renderer),
    loadTexture('pond/bridge', renderer),
    loadTexture('pond/stone-path', renderer),
    loadTexture('pond/forest-door-sign', renderer),
    ...POND_LANDMARKS.map(async (landmark) => {
      const texture = await new THREE.TextureLoader().loadAsync(assetUrl(landmark.image))
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
  const [scene, lily, sparkles, left, bridge, path, gateSign] = textures
  const grass = colorAt(scene, 0.995, FALLBACK_GRASS)
  return {
    scene,
    left,
    bridge,
    path: pathTexture(path),
    lily,
    sparkles,
    gateSign,
    landmarks: Object.fromEntries(POND_LANDMARKS.map((landmark, index) => [landmark.kind, textures[index + 7]])),
    edges: { left: edgeTexture(scene, 'left', grass, left), right: edgeTexture(scene, 'right', grass) },
    sky: colorAt(scene, 0.005, FALLBACK_SKY),
    grass,
  }
}

/** The art cache owns the textures; the room only borrows them. */
export function disposePondArt(art: PondArt): void {
  art.scene.dispose()
  art.left.dispose()
  art.bridge.dispose()
  art.path.dispose()
  art.lily.dispose()
  art.sparkles.dispose()
  art.gateSign.dispose()
  art.edges.left.dispose()
  art.edges.right.dispose()
  for (const texture of Object.values(art.landmarks)) texture.dispose()
}
