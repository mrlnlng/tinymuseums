import * as THREE from 'three'
import type { Placement, ThemeSpec } from '@tiny/core'
import { THEMES } from '@tiny/core/rooms'
import manifest from '@/generated/asset-manifest.json'
import { CONFIG } from '@/features/hall/scene/config'
import { assetUrl, builtUrl, type AssetName } from '@/shared/lib/assets'
import { CEILING, type RoomLight, darknessAt } from './room-light'
import { WEAR } from '@tiny/core/rooms'

export type { RoomLight } from './room-light'

type AtelierImage = keyof typeof manifest.atelier

export interface CozyArt {
  /** Wallpaper and baseboard textures by finish id; plain cream has none. */
  finishes: Record<string, THREE.Texture>
  floor: THREE.Texture
  /** Wear drawn over the whole wall or floor, by mess ref. */
  wear: Record<string, THREE.Texture>
  door: HTMLImageElement
  props: Record<string, THREE.Texture>
}

export interface PlacementTheme<Art> {
  spec: ThemeSpec
  load(): Promise<Art>
  propImage(ref: string, art: Art): THREE.Texture | null
  /** World y of a placement's bottom edge; `all` is the arrangement it belongs to. */
  baseY(placement: Placement, height: number, all: readonly Placement[]): number
  depth(placement: Placement, width: number, all: readonly Placement[]): number
  /** Where a thing shows regardless of its saved spot, given the room's length (cobwebs keep to the corners). */
  pose?(placement: Placement, size: { width: number; height: number }, roomWidth: number): { x: number; baseY: number; flip: boolean } | null
  /** Something drawn over a whole surface instead of as a thing in the room (wear on the wall or floor). */
  cover?(placement: Placement, art: Art, roomWidth: number): { mesh: THREE.Mesh; baseY: number; height: number } | null
}

const FEET_Y = CONFIG.character.centerY - CONFIG.character.height / 2
/** Furniture stands back against the wall, its feet just onto the boards. */
const WALL_FOOT = THEMES.cozy.floorY
/** Where legacy wall things, saved before they had a height, are centred. */
const WALL_Y = 2.3
const FLOOR_HEIGHT = 2.6
const WALL_HEIGHT = 9
/** The backdrop runs past the room so a view wider than the room shows more wall, not a void. */
const BACKDROP_OVERHANG = 14
const ROOM_LEFT = 0
const ROOM_RIGHT = 20
const STRIPE_PAIR = CONFIG.wallpaper.stripePairWidth
const SKIRTING = { bottom: 0, top: 0.18, tile: 4.95 }
const PANELLING = { bottom: 0.18, top: 1.01 }
/** Share of a rug that lies below the feet line, so it reads as lying on the floor. */
const CARPET_SINK = 0.7
const CREAM = '#fae1bd'

const ATELIER_PROPS: Record<string, AtelierImage> = {
  mirror: 'mirror',
  painting: 'painting',
  'portrait-bunny': 'portraitBunny',
  'portrait-jiji': 'portraitJiji',
  'portrait-otter': 'portraitOtter',
  'portrait-wink': 'portraitWink',
  shelf: 'shelf',
  cabinet: 'cabinet',
  carpet: 'carpet',
  'pillow-blue': 'pillowBlue',
  'pillow-red': 'pillowRed',
  column: 'column',
  'jewelry-box': 'jewelryBox',
  perfume: 'perfume',
  broom: 'broom',
}

const HOME_PROPS = [
  'window',
  'wall-hooks',
  'wall-shelf',
  'gold-frame',
  'hanger',
  'cubby',
  'round-table',
  'side-table',
  'chair',
  'armchair',
  'rug',
  'plant',
  'mug',
  'tulip-vase',
  'reading-lamp',
  'sketchbooks',
  'ammonite-display',
  'pressed-fern',
  'patchwork-mat',
  'gallery-runner',
  'moonwake-rug',
  'lily-stitch-rug',
  'studio-stripe-carpet',
  'faded-floral-carpet',
  'opening-night-invite',
  'paint-stained-palette',
  'storeroom-letter',
  'midnight-study',
] as const

/** Art finishes: the tile, and how wide one tile is on the wall in world units. */
const FINISH_TILES: Record<string, { image: AssetName; width: number; mirrored?: boolean }> = {
  'wallpaper-pink-stripes': { image: 'home/wallpaper-pink-stripes', width: 1.2 },
  'wallpaper-blue-floral': { image: 'home/wallpaper-blue-floral', width: 5.4 },
  'wallpaper-ornate': { image: 'home/wallpaper-ornate', width: 2.1 },
  'baseboard-tall': { image: 'home/baseboard-tall', width: (PANELLING.top - PANELLING.bottom) * (627 / 180) },
  'baseboard-short': { image: 'home/baseboard-short', width: SKIRTING.tile, mirrored: true },
}

// The standing cat is in public/immutable but predates the atelier manifest group.
const CAT_URL = 'atelier-cat-standing.ffabd19e7e.webp'

const FISH: Record<string, { body: string; belly: string; fin: string; patches?: string }> = {
  'fish-minnow': { body: '#8b97a1', belly: '#c5ccd1', fin: '#6c7983' },
  'fish-perch': { body: '#8f9b45', belly: '#d1d28a', fin: '#6e7a2f' },
  'fish-carp': { body: '#b0793f', belly: '#d7ae78', fin: '#8a5826' },
  'fish-koi': { body: '#e8834a', belly: '#f4d7c2', fin: '#c95b2e', patches: '#fff4e8' },
  'fish-golden-koi': { body: '#e8b93e', belly: '#f8e6a3', fin: '#c7951e', patches: '#fff3c4' },
}

// The pond fish are drawn art, so they hang beside the older painted plaques.
const POND_TROPHIES: Record<string, AssetName> = {
  'fish-star-snapper': 'pond/fish-star-snapper',
  'fish-crab': 'pond/fish-crab',
  'fish-puffer': 'pond/fish-puffer',
  'fish-blobfish': 'pond/fish-blobfish',
}

const PLAQUE_WIDTH = 256
const PLAQUE_HEIGHT = 192
/** The room left inside the plaque's frame for a fish drawing. */
const PLAQUE_ART_WIDTH = 216
const PLAQUE_ART_HEIGHT = 140

type PropSource =
  | { image: AtelierImage }
  | { url: string }
  | { fish: string }
  | { pond: AssetName }
  | { home: AssetName }

function sourceFor(ref: string): PropSource | null {
  const image = ATELIER_PROPS[ref]
  if (image) return { image }
  if ((HOME_PROPS as readonly string[]).includes(ref)) return { home: `home/${ref}` as AssetName }
  if (ref === 'cat') return { url: CAT_URL }
  const pond = POND_TROPHIES[ref]
  if (pond) return { pond }
  if (ref in FISH) return { fish: ref }
  return null
}

function loadTexture(url: string): Promise<THREE.Texture> {
  return new THREE.TextureLoader().loadAsync(url).then((texture) => {
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = 4
    return texture
  })
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    // CDN images need CORS permission before WebGL can use them as textures.
    image.crossOrigin = 'anonymous'
    image.decoding = 'async'
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('The room’s door could not load.'))
    image.src = url
  })
}

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number): void {
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
  ctx.lineTo(x + width, y + height - radius)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  ctx.lineTo(x + radius, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
}

/** The wooden plaque that every fish trophy hangs on. */
function plaqueCanvas(): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const [canvas, ctx] = drawingOn(PLAQUE_WIDTH, PLAQUE_HEIGHT)

  roundedRect(ctx, 8, 12, 240, 168, 14)
  ctx.fillStyle = '#8c5a33'
  ctx.fill()
  ctx.lineWidth = 5
  ctx.strokeStyle = '#5f3a1f'
  ctx.stroke()
  ctx.save()
  roundedRect(ctx, 8, 12, 240, 168, 14)
  ctx.clip()
  ctx.strokeStyle = 'rgba(91, 55, 29, 0.3)'
  ctx.lineWidth = 2
  for (let y = 32; y < 180; y += 20) {
    ctx.beginPath()
    ctx.moveTo(10, y)
    ctx.bezierCurveTo(76, y - 5, 180, y + 5, 246, y)
    ctx.stroke()
  }
  ctx.restore()

  return [canvas, ctx]
}

/** A fish trophy painted on the plaque; the older room has no art for these. */
function fishTexture(ref: string): THREE.Texture {
  const colors = FISH[ref]
  const [canvas, ctx] = plaqueCanvas()

  ctx.save()
  ctx.translate(4, 0)
  ctx.fillStyle = colors.fin
  ctx.beginPath()
  ctx.moveTo(78, 96)
  ctx.lineTo(38, 68)
  ctx.lineTo(38, 124)
  ctx.closePath()
  ctx.fill()
  ctx.beginPath()
  ctx.moveTo(142, 63)
  ctx.quadraticCurveTo(156, 42, 172, 58)
  ctx.quadraticCurveTo(158, 66, 142, 63)
  ctx.fill()
  ctx.beginPath()
  ctx.moveTo(140, 130)
  ctx.quadraticCurveTo(154, 151, 170, 135)
  ctx.quadraticCurveTo(156, 127, 140, 130)
  ctx.fill()

  ctx.beginPath()
  ctx.ellipse(138, 96, 64, 35, 0, 0, Math.PI * 2)
  ctx.fillStyle = colors.body
  ctx.fill()
  ctx.save()
  ctx.clip()
  ctx.fillStyle = colors.belly
  ctx.beginPath()
  ctx.ellipse(138, 128, 70, 22, 0, 0, Math.PI * 2)
  ctx.fill()
  if (colors.patches) {
    ctx.fillStyle = colors.patches
    ctx.beginPath()
    ctx.ellipse(116, 82, 22, 17, -0.3, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(162, 108, 17, 13, 0.35, 0, Math.PI * 2)
    ctx.fill()
  }
  if (ref === 'fish-perch') {
    ctx.strokeStyle = colors.fin
    ctx.lineWidth = 4
    for (let x = 112; x <= 168; x += 14) {
      ctx.beginPath()
      ctx.moveTo(x, 66)
      ctx.lineTo(x - 8, 124)
      ctx.stroke()
    }
  }
  ctx.restore()
  ctx.beginPath()
  ctx.arc(184, 85, 5.5, 0, Math.PI * 2)
  ctx.fillStyle = '#2d2119'
  ctx.fill()
  ctx.beginPath()
  ctx.arc(186, 83, 1.8, 0, Math.PI * 2)
  ctx.fillStyle = '#fff8e8'
  ctx.fill()
  ctx.restore()

  return canvasTexture(canvas)
}

/** A pond catch drawn on the same plaque, keeping the art's own aspect ratio. */
async function pondTrophyTexture(ref: string, name: AssetName): Promise<THREE.Texture> {
  const art = await loadTexture(assetUrl(name))
  const [canvas, ctx] = plaqueCanvas()
  const image = art.image as HTMLImageElement
  const width = image.naturalWidth || image.width
  const height = image.naturalHeight || image.height
  if (width > 0 && height > 0) {
    const scale = Math.min(PLAQUE_ART_WIDTH / width, PLAQUE_ART_HEIGHT / height)
    const drawWidth = width * scale
    const drawHeight = height * scale
    ctx.drawImage(
      image,
      (PLAQUE_WIDTH - drawWidth) / 2,
      (PLAQUE_HEIGHT - drawHeight) / 2,
      drawWidth,
      drawHeight,
    )
  }
  art.dispose()
  const texture = canvasTexture(canvas)
  PROP_IMAGE_CACHE.set(ref, canvas.toDataURL())
  return texture
}

function canvasTexture(canvas: HTMLCanvasElement): THREE.CanvasTexture {
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  return texture
}

function drawingOn(width: number, height: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('The room could not be drawn.')
  return [canvas, ctx]
}

/** One pair of the museum's cream stripes, warmed toward peach: the room's look before finishes. */
function peachStripesCanvas(): HTMLCanvasElement {
  const [canvas, ctx] = drawingOn(128, 128)
  ctx.fillStyle = '#fcf0dc'
  ctx.fillRect(0, 0, 128, 128)
  ctx.fillStyle = '#f7dfc6'
  ctx.fillRect(64, 0, 64, 128)
  ctx.fillStyle = 'rgba(214, 160, 128, 0.35)'
  ctx.fillRect(62, 0, 2, 128)
  ctx.fillRect(126, 0, 2, 128)
  return canvas
}

function creamCanvas(): HTMLCanvasElement {
  const [canvas, ctx] = drawingOn(64, 64)
  ctx.fillStyle = CREAM
  ctx.fillRect(0, 0, 64, 64)
  return canvas
}

/** Pixels per world unit in the plank floor's canvas. */
const FLOOR_PX = 160
const FLOOR_TILE = 6
/** The wall's wear repeats every this many units. */
const WALL_WEAR = { tile: 4 }

/** Wide planks laid along the room, drawn the way the mock draws its floor. */
function floorTexture(): THREE.Texture {
  const width = FLOOR_TILE * FLOOR_PX
  const height = FLOOR_HEIGHT * FLOOR_PX
  const [canvas, ctx] = drawingOn(width, height)
  ctx.fillStyle = '#8b5641'
  ctx.fillRect(0, 0, width, height)

  // Rows widen a little toward the viewer.
  let top = 0
  let row = 0
  let seed = 7
  const random = () => {
    seed = (seed * 16807) % 2147483647
    return seed / 2147483647
  }
  while (top < height) {
    const rowHeight = (0.19 + row * 0.012) * FLOOR_PX
    const bottom = Math.min(height, top + rowHeight)
    ctx.fillStyle = row % 2 === 0 ? 'rgba(255, 220, 190, 0.035)' : 'rgba(60, 25, 10, 0.035)'
    ctx.fillRect(0, top, width, bottom - top)
    ctx.fillStyle = '#6d402e'
    ctx.fillRect(0, bottom - 2, width, 2.5)
    // Joints, staggered row to row; the first sits where it wraps cleanly.
    const plank = 3 * FLOOR_PX
    const offset = (row * 1.15 * FLOOR_PX) % plank
    for (let x = offset; x < width; x += plank) {
      const jitter = Math.round((random() - 0.5) * 0.2 * FLOOR_PX)
      const at = Math.max(4, Math.min(width - 4, x + (x === offset ? 0 : jitter)))
      ctx.fillStyle = 'rgba(109, 64, 46, 0.7)'
      ctx.fillRect(at, top + 3, 2, bottom - top - 5)
      // A nail either side of the joint.
      ctx.fillStyle = 'rgba(45, 25, 18, 0.3)'
      for (const nx of [at - 8, at + 10]) {
        if (nx < 6 || nx > width - 6) continue
        ctx.beginPath()
        ctx.ellipse(nx, (top + bottom) / 2, 1.8, 1.3, 0, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    // Grain running along the boards.
    ctx.strokeStyle = 'rgba(60, 25, 10, 0.09)'
    ctx.lineWidth = 1.5
    for (let line = 0; line < 3; line++) {
      const y = top + (bottom - top) * (0.25 + line * 0.25) + (random() - 0.5) * 6
      ctx.beginPath()
      ctx.moveTo(0, y)
      for (let x = 0; x <= width; x += 120) ctx.lineTo(x, y + Math.sin(x * 0.01 + row + line) * 2.5)
      ctx.stroke()
    }
    top = bottom
    row++
  }

  // The skirting's soft shadow on the boards just in front of the wall.
  const shade = ctx.createLinearGradient(0, 0, 0, 0.12 * FLOOR_PX)
  shade.addColorStop(0, 'rgba(50, 18, 10, 0.45)')
  shade.addColorStop(1, 'rgba(50, 18, 10, 0)')
  ctx.fillStyle = shade
  ctx.fillRect(0, 0, width, 0.12 * FLOOR_PX)

  const texture = canvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  return texture
}

/** Years of scratches and scuffs on the boards, fixed all at once; kept clear of the tile's ends so the repeat has no seam. */
function floorWearCanvas(): HTMLCanvasElement {
  const width = FLOOR_TILE * FLOOR_PX
  const height = FLOOR_HEIGHT * FLOOR_PX
  const [canvas, ctx] = drawingOn(width, height)
  let seed = 23
  const random = () => {
    seed = (seed * 16807) % 2147483647
    return seed / 2147483647
  }
  const anywhere = () => 40 + random() * (width - 80)
  const depthwise = () => 0.1 * FLOOR_PX + random() * (height - 0.2 * FLOOR_PX)

  // Scuffs: soft dark smudges, wider than tall.
  for (let i = 0; i < 14; i++) {
    const x = anywhere()
    const y = depthwise()
    const r = (0.12 + random() * 0.25) * FLOOR_PX
    ctx.save()
    ctx.translate(x, y)
    ctx.scale(1, 0.35)
    const smudge = ctx.createRadialGradient(0, 0, 0, 0, 0, r)
    smudge.addColorStop(0, `rgba(45, 20, 10, ${0.16 + random() * 0.16})`)
    smudge.addColorStop(1, 'rgba(45, 20, 10, 0)')
    ctx.fillStyle = smudge
    ctx.fillRect(-r, -r, r * 2, r * 2)
    ctx.restore()
  }

  // Knots, each a dark eye with a ring or two around it.
  for (let i = 0; i < 9; i++) {
    const x = anywhere()
    const y = depthwise()
    const rx = 5 + random() * 6
    ctx.fillStyle = 'rgba(70, 35, 20, 0.5)'
    ctx.beginPath()
    ctx.ellipse(x, y, rx, rx * 0.45, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = 'rgba(70, 35, 20, 0.22)'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.ellipse(x, y, rx * 2.2, rx * 0.95, 0, 0, Math.PI * 2)
    ctx.stroke()
  }

  // Scratches along the grain: pale where they cut the finish, dark where dirt has settled in.
  for (let i = 0; i < 90; i++) {
    const x = anywhere()
    const y = depthwise()
    const length = 14 + random() * 70
    const slant = (random() - 0.5) * 0.25
    ctx.strokeStyle = random() < 0.6 ? `rgba(240, 200, 165, ${0.18 + random() * 0.18})` : `rgba(40, 18, 10, ${0.22 + random() * 0.18})`
    ctx.lineWidth = 0.8 + random() * 1.2
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.quadraticCurveTo(x + length / 2, y + slant * length + (random() - 0.5) * 3, x + length, y + slant * length * 2)
    ctx.stroke()
  }

  // An old water ring, and a crack splitting one board.
  ctx.strokeStyle = 'rgba(50, 22, 12, 0.18)'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.ellipse(4.6 * FLOOR_PX, 1.55 * FLOOR_PX, 0.3 * FLOOR_PX, 0.09 * FLOOR_PX, 0.05, 0.3, Math.PI * 2.1)
  ctx.stroke()
  ctx.strokeStyle = 'rgba(35, 15, 8, 0.6)'
  ctx.lineWidth = 1.6
  ctx.beginPath()
  let crackX = 1.2 * FLOOR_PX
  let crackY = 1.28 * FLOOR_PX
  ctx.moveTo(crackX, crackY)
  for (let i = 0; i < 9; i++) {
    crackX += 12 + random() * 14
    crackY += (random() - 0.5) * 5
    ctx.lineTo(crackX, crackY)
  }
  ctx.stroke()

  return canvas
}

/** Cracks, chips, nail holes and scuffs across the wall, fixed all at once. */
function wallWearCanvas(): HTMLCanvasElement {
  const width = WALL_WEAR.tile * FLOOR_PX
  const height = (CEILING - SKIRTING.top) * FLOOR_PX
  const [canvas, ctx] = drawingOn(width, height)
  let seed = 31
  const random = () => {
    seed = (seed * 16807) % 2147483647
    return seed / 2147483647
  }
  const anywhere = () => 40 + random() * (width - 80)
  // Hairline cracks wandering down from the ceiling and up from the skirting.
  ctx.lineCap = 'round'
  for (let i = 0; i < 6; i++) {
    let x = anywhere()
    let y = i % 2 === 0 ? random() * 30 : height - random() * 30
    const down = i % 2 === 0 ? 1 : -1
    ctx.strokeStyle = 'rgba(105, 70, 42, 0.3)'
    ctx.lineWidth = 1.3
    ctx.beginPath()
    ctx.moveTo(x, y)
    const steps = 6 + Math.floor(random() * 6)
    for (let step = 0; step < steps; step++) {
      x = Math.max(10, Math.min(width - 10, x + (random() - 0.4) * 26))
      y += down * (12 + random() * 20)
      ctx.lineTo(x, y)
      if (random() < 0.25) {
        ctx.moveTo(x, y)
        ctx.lineTo(x + (random() - 0.5) * 30, y + down * (8 + random() * 14))
        ctx.moveTo(x, y)
      }
    }
    ctx.stroke()
  }
  // Chipped plaster: a pale bite with a dark edge.
  for (let i = 0; i < 7; i++) {
    const x = anywhere()
    const y = 30 + random() * (height - 60)
    const r = 4 + random() * 6
    ctx.fillStyle = 'rgba(232, 206, 168, 0.75)'
    ctx.beginPath()
    for (let k = 0; k < 7; k++) {
      const angle = (k / 7) * Math.PI * 2
      const reach = r * (0.6 + random() * 0.5)
      const px = x + Math.cos(angle) * reach
      const py = y + Math.sin(angle) * reach * 0.8
      if (k === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.closePath()
    ctx.fill()
    ctx.strokeStyle = 'rgba(105, 70, 42, 0.32)'
    ctx.lineWidth = 1
    ctx.stroke()
  }
  // Old nail holes, some in pairs where a picture once hung.
  ctx.fillStyle = 'rgba(60, 38, 24, 0.55)'
  for (let i = 0; i < 10; i++) {
    const x = anywhere()
    const y = 60 + random() * (height * 0.6)
    ctx.beginPath()
    ctx.arc(x, y, 2.2, 0, Math.PI * 2)
    ctx.fill()
    if (random() < 0.4) {
      ctx.beginPath()
      ctx.arc(x + 40 + random() * 30, y + (random() - 0.5) * 4, 2.2, 0, Math.PI * 2)
      ctx.fill()
    }
  }
  // Grey scuffs low down where things were dragged along the wall, and grubby smudges.
  for (let i = 0; i < 9; i++) {
    const low = i < 5
    const x = anywhere()
    const y = low ? height - 20 - random() * 70 : 80 + random() * (height - 240)
    const r = (low ? 30 : 18) + random() * 30
    ctx.save()
    ctx.translate(x, y)
    ctx.scale(1, low ? 0.3 : 0.7)
    const smudge = ctx.createRadialGradient(0, 0, 0, 0, 0, r)
    smudge.addColorStop(0, `rgba(80, 60, 45, ${0.12 + random() * 0.1})`)
    smudge.addColorStop(1, 'rgba(80, 60, 45, 0)')
    ctx.fillStyle = smudge
    ctx.fillRect(-r, -r, r * 2, r * 2)
    ctx.restore()
  }
  return canvas
}

function repeating(texture: THREE.Texture, mirrored = false): THREE.Texture {
  texture.wrapS = mirrored ? THREE.MirroredRepeatWrapping : THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.needsUpdate = true
  return texture
}

const INK = '#5b3a2a'

/** A corner web: threads fanning from the top left, joined by sagging rings. */
function cobwebCanvas(): HTMLCanvasElement {
  const [canvas, ctx] = drawingOn(264, 228)
  ctx.lineCap = 'round'
  const spokes = Array.from({ length: 7 }, (_, i) => (i / 6) * (Math.PI / 2))
  ctx.strokeStyle = 'rgba(246, 240, 230, 0.85)'
  ctx.lineWidth = 2.4
  for (const angle of spokes) {
    ctx.beginPath()
    ctx.moveTo(4, 4)
    ctx.lineTo(4 + Math.cos(angle) * 250, 4 + Math.sin(angle) * 214)
    ctx.stroke()
  }
  ctx.lineWidth = 1.8
  for (let ring = 1; ring <= 5; ring++) {
    const r = ring * 44
    ctx.beginPath()
    spokes.forEach((angle, i) => {
      const x = 4 + Math.cos(angle) * r
      const y = 4 + Math.sin(angle) * r * 0.86
      if (i === 0) ctx.moveTo(x, y)
      else {
        const mid = (angle + spokes[i - 1]) / 2
        // Each strand sags toward the corner between spokes.
        ctx.quadraticCurveTo(4 + Math.cos(mid) * r * 0.82, 4 + Math.sin(mid) * r * 0.7, x, y)
      }
    })
    ctx.stroke()
  }
  ctx.fillStyle = 'rgba(246, 240, 230, 0.5)'
  ctx.beginPath()
  ctx.ellipse(150, 150, 30, 14, 0.7, 0, Math.PI * 2)
  ctx.fill()
  return canvas
}

/** An old water stain: a pale bloom with darker tide-lines where it dried, ring inside ring. */
function stainCanvas(): HTMLCanvasElement {
  const [canvas, ctx] = drawingOn(260, 220)
  const blob = (scale: number) => {
    ctx.beginPath()
    const points = 14
    for (let i = 0; i <= points; i++) {
      const angle = (i / points) * Math.PI * 2
      const wobble = 1 + Math.sin(angle * 3 + 0.6) * 0.12 + Math.cos(angle * 5) * 0.07
      const x = 130 + Math.cos(angle) * 108 * scale * wobble
      const y = 104 + Math.sin(angle) * 86 * scale * wobble + (Math.sin(angle) > 0 ? 18 * scale : 0)
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.closePath()
  }
  for (const [scale, fill, line] of [
    [1, 'rgba(140, 96, 52, 0.12)', 'rgba(110, 70, 36, 0.22)'],
    [0.62, 'rgba(140, 96, 52, 0.1)', 'rgba(110, 70, 36, 0.12)'],
  ] as const) {
    blob(scale)
    ctx.fillStyle = fill
    ctx.fill()
    ctx.strokeStyle = line
    ctx.lineWidth = 4
    ctx.stroke()
  }
  return canvas
}

/** Wallpaper torn back to the brick behind it, with a strip curling off the top edge. */
function peelingCanvas(): HTMLCanvasElement {
  const [canvas, ctx] = drawingOn(220, 230)
  const hole = [[22, 40], [70, 18], [132, 30], [176, 22], [196, 84], [182, 150], [196, 206], [118, 214], [62, 196], [16, 140]]
  ctx.save()
  ctx.beginPath()
  hole.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)))
  ctx.closePath()
  ctx.fillStyle = '#b98a68'
  ctx.fill()
  ctx.clip()
  // Brick courses, staggered, with dark mortar.
  ctx.fillStyle = '#9e6248'
  for (let row = 0; row < 9; row++) {
    const y = 14 + row * 24
    for (let x = (row % 2) * -30; x < 220; x += 60) ctx.fillRect(x + 3, y + 3, 54, 18)
  }
  ctx.restore()
  ctx.strokeStyle = 'rgba(91, 58, 42, 0.55)'
  ctx.lineWidth = 3
  ctx.beginPath()
  hole.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)))
  ctx.closePath()
  ctx.stroke()
  return canvas
}

/** A drift of dust on the boards, with a dust bunny or two. */
function dustCanvas(): HTMLCanvasElement {
  const [canvas, ctx] = drawingOn(240, 90)
  ctx.fillStyle = 'rgba(150, 130, 120, 0.75)'
  ctx.beginPath()
  ctx.moveTo(6, 86)
  ctx.quadraticCurveTo(60, 40, 120, 50)
  ctx.quadraticCurveTo(190, 38, 234, 86)
  ctx.closePath()
  ctx.fill()
  ctx.fillStyle = 'rgba(190, 172, 160, 0.9)'
  for (const [x, y, r] of [[70, 54, 15], [168, 50, 12], [118, 42, 10]] as const) {
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = 'rgba(120, 100, 92, 0.6)'
    ctx.lineWidth = 1.5
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2
      ctx.beginPath()
      ctx.moveTo(x + Math.cos(angle) * r * 0.6, y + Math.sin(angle) * r * 0.6)
      ctx.lineTo(x + Math.cos(angle) * (r + 5), y + Math.sin(angle) * (r + 5))
      ctx.stroke()
    }
  }
  return canvas
}

function stretcher(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number): void {
  // A canvas turned to the wall: raw linen edges and the wooden stretcher bars across its back.
  ctx.fillStyle = '#e9dcc3'
  ctx.strokeStyle = INK
  ctx.lineWidth = 4
  ctx.fillRect(x, y, width, height)
  ctx.strokeRect(x, y, width, height)
  ctx.fillStyle = '#c99a62'
  const bar = 12
  ctx.fillRect(x + 6, y + 6, width - 12, bar)
  ctx.fillRect(x + 6, y + height - 6 - bar, width - 12, bar)
  ctx.fillRect(x + 6, y + 6, bar, height - 12)
  ctx.fillRect(x + width - 6 - bar, y + 6, bar, height - 12)
  ctx.fillRect(x + width / 2 - bar / 2, y + 6, bar, height - 12)
  ctx.lineWidth = 2
  ctx.strokeStyle = 'rgba(91, 58, 42, 0.6)'
  ctx.strokeRect(x + 6, y + 6, width - 12, height - 12)
}

/** The last tenant's canvases, stacked against the wall: two turned away, one half under a dust sheet. */
function oldCanvasesCanvas(): HTMLCanvasElement {
  const [canvas, ctx] = drawingOn(330, 280)
  ctx.save()
  ctx.translate(40, 276)
  ctx.rotate(-0.1)
  stretcher(ctx, 0, -250, 170, 240)
  ctx.restore()
  ctx.save()
  ctx.translate(150, 278)
  ctx.rotate(-0.05)
  // One faces out: a muddy landscape, half finished.
  ctx.fillStyle = '#8fa8a0'
  ctx.strokeStyle = INK
  ctx.lineWidth = 4
  ctx.fillRect(0, -190, 150, 180)
  ctx.fillStyle = '#b7a06a'
  ctx.beginPath()
  ctx.moveTo(0, -80)
  ctx.quadraticCurveTo(60, -120, 150, -90)
  ctx.lineTo(150, -10)
  ctx.lineTo(0, -10)
  ctx.closePath()
  ctx.fill()
  ctx.fillStyle = '#f0e2c4'
  ctx.fillRect(96, -190, 54, 70)
  ctx.strokeRect(0, -190, 150, 180)
  ctx.restore()
  ctx.save()
  ctx.translate(8, 278)
  ctx.rotate(0.06)
  stretcher(ctx, 0, -150, 120, 140)
  ctx.restore()
  // The dust sheet over the front of the stack.
  ctx.fillStyle = 'rgba(226, 214, 192, 0.97)'
  ctx.strokeStyle = 'rgba(91, 58, 42, 0.6)'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(2, 160)
  ctx.quadraticCurveTo(70, 140, 150, 168)
  ctx.quadraticCurveTo(178, 230, 170, 278)
  ctx.lineTo(2, 278)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()
  ctx.strokeStyle = 'rgba(150, 128, 100, 0.5)'
  ctx.lineWidth = 2
  for (const [x1, x2] of [[40, 30], [90, 96], [130, 148]] as const) {
    ctx.beginPath()
    ctx.moveTo(x1, 170)
    ctx.quadraticCurveTo((x1 + x2) / 2 + 8, 220, x2, 276)
    ctx.stroke()
  }
  return canvas
}

/** A small, grimy window set high in the wall, sun pouring through. */
function atticWindowCanvas(): HTMLCanvasElement {
  const [canvas, ctx] = drawingOn(262, 324)
  ctx.lineJoin = 'round'
  // Frame, arched at the top.
  const arch = (inset: number) => {
    ctx.beginPath()
    ctx.moveTo(20 + inset, 316 - inset)
    ctx.lineTo(20 + inset, 120)
    ctx.arc(131, 120, 111 - inset, Math.PI, 0)
    ctx.lineTo(242 - inset, 316 - inset)
    ctx.closePath()
  }
  arch(0)
  ctx.fillStyle = '#7a5236'
  ctx.fill()
  ctx.strokeStyle = INK
  ctx.lineWidth = 5
  ctx.stroke()
  arch(18)
  const sky = ctx.createLinearGradient(0, 30, 0, 300)
  sky.addColorStop(0, '#fff3c8')
  sky.addColorStop(0.55, '#ffd27a')
  sky.addColorStop(1, '#f2a85a')
  ctx.fillStyle = sky
  ctx.fill()
  ctx.save()
  arch(18)
  ctx.clip()
  // Grime gathered in the corners of the panes.
  const grime = ctx.createRadialGradient(131, 170, 40, 131, 170, 170)
  grime.addColorStop(0, 'rgba(120, 80, 40, 0)')
  grime.addColorStop(1, 'rgba(120, 80, 40, 0.45)')
  ctx.fillStyle = grime
  ctx.fillRect(0, 0, 262, 324)
  ctx.fillStyle = 'rgba(255, 255, 240, 0.45)'
  ctx.beginPath()
  ctx.moveTo(60, 300)
  ctx.lineTo(110, 60)
  ctx.lineTo(130, 60)
  ctx.lineTo(80, 300)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
  // Glazing bars.
  ctx.fillStyle = '#7a5236'
  ctx.strokeStyle = INK
  ctx.lineWidth = 3
  ctx.fillRect(124, 24, 14, 290)
  ctx.strokeRect(124, 24, 14, 290)
  ctx.fillRect(38, 176, 186, 14)
  ctx.strokeRect(38, 176, 186, 14)
  // The sill.
  ctx.fillStyle = '#8d6240'
  ctx.lineWidth = 4
  ctx.fillRect(6, 300, 250, 20)
  ctx.strokeRect(6, 300, 250, 20)
  return canvas
}

/** Old plaster: warm, blotched and cracked. Wraps so it tiles. */
function plasterCanvas(): HTMLCanvasElement {
  const size = 256
  const [canvas, ctx] = drawingOn(size, size)
  ctx.fillStyle = '#e2c49b'
  ctx.fillRect(0, 0, size, size)
  let seed = 11
  const random = () => {
    seed = (seed * 16807) % 2147483647
    return seed / 2147483647
  }
  // Blotches drawn at every wrap offset, so the tile's edges meet.
  const wrapped = (draw: (x: number, y: number) => void, x: number, y: number) => {
    for (const dx of [-size, 0, size]) for (const dy of [-size, 0, size]) draw(x + dx, y + dy)
  }
  for (let i = 0; i < 26; i++) {
    const x = random() * size
    const y = random() * size
    const r = 14 + random() * 46
    const squash = 0.55 + random() * 0.4
    const turn = random() * Math.PI
    const dark = random() < 0.6
    wrapped((cx, cy) => {
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(turn)
      ctx.scale(1, squash)
      const blotch = ctx.createRadialGradient(0, 0, 0, 0, 0, r)
      blotch.addColorStop(0, dark ? 'rgba(160, 112, 64, 0.14)' : 'rgba(255, 238, 205, 0.2)')
      blotch.addColorStop(1, 'rgba(160, 112, 64, 0)')
      ctx.fillStyle = blotch
      ctx.beginPath()
      ctx.arc(0, 0, r, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }, x, y)
  }
  return canvas
}

/** A dried-up paint tin with its brush, crusted in someone else's colours. */
function oldPaintCanvas(): HTMLCanvasElement {
  const [canvas, ctx] = drawingOn(170, 120)
  ctx.strokeStyle = INK
  ctx.lineWidth = 3.5
  ctx.fillStyle = '#9ea4a8'
  ctx.beginPath()
  ctx.moveTo(30, 34)
  ctx.lineTo(30, 108)
  ctx.quadraticCurveTo(70, 118, 110, 108)
  ctx.lineTo(110, 34)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()
  ctx.fillStyle = '#d98ba0'
  ctx.beginPath()
  ctx.ellipse(70, 34, 40, 10, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()
  for (const [x, length, color] of [[42, 40, '#d98ba0'], [88, 26, '#8fb8d8'], [64, 52, '#d98ba0']] as const) {
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.moveTo(x - 6, 38)
    ctx.lineTo(x + 6, 38)
    ctx.lineTo(x + 4, 38 + length)
    ctx.arc(x, 38 + length, 4, 0, Math.PI)
    ctx.closePath()
    ctx.fill()
  }
  ctx.save()
  ctx.translate(132, 86)
  ctx.rotate(-0.5)
  ctx.fillStyle = '#c99357'
  ctx.fillRect(-6, -60, 12, 50)
  ctx.strokeRect(-6, -60, 12, 50)
  ctx.fillStyle = '#8fb8d8'
  ctx.fillRect(-10, -12, 20, 26)
  ctx.strokeRect(-10, -12, 20, 26)
  ctx.restore()
  return canvas
}

/** A bare bulb on a long cord, glowing warm. */
function bareBulbCanvas(): HTMLCanvasElement {
  const [canvas, ctx] = drawingOn(110, 392)
  const glow = ctx.createRadialGradient(55, 330, 6, 55, 330, 56)
  glow.addColorStop(0, 'rgba(255, 226, 150, 0.75)')
  glow.addColorStop(1, 'rgba(255, 226, 150, 0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 270, 110, 122)
  ctx.strokeStyle = '#3a2a24'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(55, 0)
  ctx.lineTo(55, 296)
  ctx.stroke()
  ctx.fillStyle = '#4a3a34'
  ctx.strokeStyle = INK
  ctx.lineWidth = 3
  ctx.fillRect(45, 294, 20, 18)
  ctx.strokeRect(45, 294, 20, 18)
  ctx.fillStyle = '#ffe9a6'
  ctx.beginPath()
  ctx.moveTo(47, 312)
  ctx.quadraticCurveTo(30, 330, 40, 348)
  ctx.quadraticCurveTo(55, 362, 70, 348)
  ctx.quadraticCurveTo(80, 330, 63, 312)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()
  ctx.strokeStyle = 'rgba(201, 120, 40, 0.8)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(50, 316)
  ctx.lineTo(53, 334)
  ctx.lineTo(57, 326)
  ctx.lineTo(60, 334)
  ctx.lineTo(62, 316)
  ctx.stroke()
  return canvas
}

const DRAWN: Record<string, () => HTMLCanvasElement> = {
  cobweb: cobwebCanvas,
  stain: stainCanvas,
  'peeling-paper': peelingCanvas,
  dust: dustCanvas,
  'old-canvases': oldCanvasesCanvas,
  'attic-window': atticWindowCanvas,
  'old-paint': oldPaintCanvas,
  'bare-bulb': bareBulbCanvas,
  boards: boardsCanvas,
}

/** Boards nailed across where the next room will be knocked through. */
function boardsCanvas(): HTMLCanvasElement {
  const [canvas, ctx] = drawingOn(256, 728)
  const planks = [
    { y: 43, tilt: -0.05, color: '#8d6240' },
    { y: 170, tilt: 0.04, color: '#9b6d47' },
    { y: 304, tilt: -0.02, color: '#87603f' },
    { y: 426, tilt: 0.06, color: '#9a6a43' },
    { y: 557, tilt: -0.04, color: '#8b5f3c' },
  ]
  for (const plank of planks) {
    ctx.save()
    ctx.translate(128, plank.y + 48)
    ctx.rotate(plank.tilt)
    ctx.fillStyle = plank.color
    ctx.strokeStyle = INK
    ctx.lineWidth = 5
    ctx.fillRect(-124, -44, 248, 88)
    ctx.strokeRect(-124, -44, 248, 88)
    ctx.strokeStyle = 'rgba(70, 40, 25, 0.35)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(-110, -10)
    ctx.bezierCurveTo(-40, -18, 30, 4, 112, -8)
    ctx.moveTo(-100, 14)
    ctx.bezierCurveTo(-20, 6, 50, 22, 108, 12)
    ctx.stroke()
    ctx.fillStyle = '#3a2a24'
    for (const nx of [-106, 106]) {
      ctx.beginPath()
      ctx.arc(nx, 0, 5, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.restore()
  }
  return canvas
}

export async function loadCozyArt(): Promise<CozyArt> {
  const [props, finishes, door] = await Promise.all([
    Promise.all(
      [...Object.keys(THEMES.cozy.props), ...Object.keys(THEMES.cozy.messes ?? {})].map(async (ref) => {
        const drawn = DRAWN[ref]
        if (drawn) return [ref, canvasTexture(drawn())] as const
        const source = sourceFor(ref)
        if (!source) return null
        const texture = 'image' in source
          ? await loadTexture(builtUrl(manifest.atelier[source.image].src))
          : 'home' in source
            ? await loadTexture(assetUrl(source.home))
            : 'url' in source
              ? await loadTexture(builtUrl(source.url))
              : 'pond' in source
                ? await pondTrophyTexture(ref, source.pond)
                : fishTexture(source.fish)
        return [ref, texture] as const
      }),
    ),
    Promise.all(
      Object.entries(FINISH_TILES).map(async ([id, tile]) => [id, repeating(await loadTexture(assetUrl(tile.image)), tile.mirrored)] as const),
    ),
    loadImage(assetUrl('home/door')),
  ])
  return {
    finishes: {
      ...Object.fromEntries(finishes),
      'wallpaper-cream': repeating(canvasTexture(creamCanvas())),
      'wallpaper-plaster': repeating(canvasTexture(plasterCanvas())),
      'wallpaper-peach-stripes': repeating(canvasTexture(peachStripesCanvas())),
    },
    floor: floorTexture(),
    wear: {
      'wall-wear': repeating(canvasTexture(wallWearCanvas())),
      'floor-wear': repeating(canvasTexture(floorWearCanvas())),
    },
    door,
    props: Object.fromEntries(props.filter((entry): entry is readonly [string, THREE.Texture] => entry !== null)),
  }
}

export function disposeCozyArt(art: CozyArt): void {
  for (const texture of Object.values(art.finishes)) texture.dispose()
  art.floor.dispose()
  for (const texture of Object.values(art.wear)) texture.dispose()
  const seen = new Set<THREE.Texture>()
  for (const texture of Object.values(art.props)) {
    if (seen.has(texture)) continue
    seen.add(texture)
    texture.dispose()
  }
}

function propHeight(ref: string): number {
  return THEMES.cozy.props[ref]?.height ?? THEMES.cozy.messes?.[ref]?.height ?? 0
}

/** World y of a placement's bottom edge, from the theme's numbers alone. */
export function cozyPlacementBase(placement: Placement, height = propHeight(placement.ref)): number {
  if (placement.zone === 'wall') return placement.y ?? WALL_Y - height / 2
  if (placement.zone === 'top') return placement.y ?? WALL_FOOT
  if (THEMES.cozy.props[placement.ref]?.floorCovering) return FEET_Y - CARPET_SINK * height
  if (placement.ref === 'dust') return FEET_Y - 0.35 * height
  return WALL_FOOT
}

function floorDepth(ref: string, width: number): number {
  if (ref === 'dust' || THEMES.cozy.props[ref]?.floorCovering) return 0.08
  return 0.16 + Math.max(0, Math.min(0.36, (3 - width) * 0.09))
}

export const cozyTheme: PlacementTheme<CozyArt> = {
  spec: THEMES.cozy,

  load: loadCozyArt,

  propImage(ref, art) {
    return art.props[ref] ?? null
  },

  baseY(placement, height) {
    return cozyPlacementBase(placement, height)
  },

  depth(placement, width, all) {
    // Dirt on the wall is part of the wall, behind anything hung on it.
    if (placement.zone === 'wall') return placement.kind === 'mess' ? 0.03 : 0.05
    if (placement.zone === 'top') {
      const parent = all.find((entry) => entry.id === placement.on)
      const parentSpec = parent ? THEMES.cozy.props[parent.ref] : undefined
      if (!parent || !parentSpec) return floorDepth(placement.ref, width)
      const under = parent.zone === 'wall' ? 0.05 : floorDepth(parent.ref, parentSpec.width)
      return under + 0.04
    }
    return floorDepth(placement.ref, width)
  },

  pose(placement, size, roomWidth) {
    if (placement.kind !== 'mess' || !Number.isFinite(roomWidth)) return null
    // The boards are nailed over the far end, where the next room will be knocked through.
    if (placement.ref === 'boards') return { x: roomWidth - size.width / 2 - 0.05, baseY: 0.1, flip: false }
    if (placement.ref !== 'cobweb') return null
    const left = placement.x < roomWidth / 2
    return { x: left ? size.width / 2 : roomWidth - size.width / 2, baseY: CEILING - size.height, flip: !left }
  },

  cover(placement, art, roomWidth) {
    const surface = placement.kind === 'mess' ? WEAR[placement.ref] : undefined
    const texture = art.wear[placement.ref]
    if (!surface || !texture || !Number.isFinite(roomWidth)) return null
    const bottom = surface === 'wall' ? SKIRTING.top : -FLOOR_HEIGHT
    const top = surface === 'wall' ? CEILING : 0
    texture.repeat.set(roomWidth / (surface === 'wall' ? WALL_WEAR.tile : FLOOR_TILE), 1)
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(roomWidth, top - bottom),
      new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false }),
    )
    // Just over the wallpaper or the boards, under anything in the room.
    mesh.position.set(roomWidth / 2, (top + bottom) / 2, surface === 'wall' ? -0.46 : -0.39)
    return { mesh, baseY: bottom, height: top - bottom }
  },
}

/** The finish a slot shows: its placement, or the theme's default. */
export function finishIn(placements: readonly Placement[], zone: 'wallpaper' | 'baseboard'): string {
  const chosen = placements.find((placement) => placement.kind === 'finish' && placement.zone === zone)?.ref
  const slot = THEMES.cozy.finishes?.[zone]
  return chosen && slot?.ids.includes(chosen) ? chosen : slot?.default ?? ''
}

export interface CozyBackdrop {
  setFinishes(placements: readonly Placement[]): void
  /** The room's right wall: boarded up until the room is full size. */
  setWidth(width: number): void
  setLight(light: RoomLight): void
  /** Dust drifting in the air and the bulbs' flicker. */
  update(now: number): void
  dispose(): void
}

/** The side walls recede toward the eye: how high it is, how far back, and how far toward it they come. */
const EYE = { y: 1.4, distance: 6, reach: 4.6 }
const SIDE_STRIPS = 28
/** The darkness is painted over the room and this far past its ends. */
const SHADE = { columns: 320, rows: 112, margin: 12, bottom: -3, top: 7, z: 3, color: '#22100a' }
const BULBLIGHT = '#ffd58a'
const AIR_MOTES = 70

function alphaCanvas(width: number, height: number, paint: (ctx: CanvasRenderingContext2D) => void): THREE.Texture {
  const [canvas, ctx] = drawingOn(width, height)
  paint(ctx)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.NoColorSpace
  return texture
}

function glowTexture(): THREE.Texture {
  return alphaCanvas(128, 128, (ctx) => {
    const glow = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
    glow.addColorStop(0, 'rgb(255, 255, 255)')
    glow.addColorStop(0.4, 'rgb(110, 110, 110)')
    glow.addColorStop(1, 'rgb(0, 0, 0)')
    ctx.fillStyle = glow
    ctx.fillRect(0, 0, 128, 128)
  })
}

/** One tile of a finish, in world units. */
function tileSize(id: string, texture: THREE.Texture): { width: number; height: number } {
  const image = texture.image as { width?: number; height?: number; naturalWidth?: number; naturalHeight?: number }
  const pixelsWide = image.naturalWidth || image.width || 1
  const pixelsHigh = image.naturalHeight || image.height || 1
  const width = FINISH_TILES[id]?.width ?? (id === 'wallpaper-peach-stripes' ? STRIPE_PAIR : id === 'wallpaper-plaster' ? 1.7 : 1)
  return { width, height: width * (pixelsHigh / pixelsWide) }
}

/**
 * A side wall seen in perspective, from `bottom` to `top` on the back wall's end, coming toward
 * the viewer. Thin strips keep the texture close to perspective-correct; uv is in world units.
 */
function sideWallGeometry(edge: number, centre: number, bottom: number, top: number): THREE.BufferGeometry {
  const positions: number[] = []
  const uvs: number[] = []
  const colors: number[] = []
  const index: number[] = []
  for (let i = 0; i <= SIDE_STRIPS; i++) {
    const depth = (EYE.reach * i) / SIDE_STRIPS
    const scale = EYE.distance / (EYE.distance - depth)
    const x = centre + scale * (edge - centre)
    // Side walls face across the room, away from the window: darker, and darker still nearer the viewer.
    const shade = 0.68 - 0.2 * (i / SIDE_STRIPS)
    for (const y of [bottom, top]) {
      positions.push(x, EYE.y + scale * (y - EYE.y), 0)
      uvs.push(depth, y)
      colors.push(shade, shade * 0.96, shade * 0.92)
    }
    if (i > 0) {
      const a = (i - 1) * 2
      index.push(a, a + 2, a + 1, a + 1, a + 2, a + 3)
    }
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
  geometry.setIndex(index)
  return geometry
}

/** The ceiling's boards, running along the room, with a joist across every few. */
function ceilingTexture(): THREE.Texture {
  const [canvas, ctx] = drawingOn(256, 256)
  const colors = ['#6e4a35', '#654330', '#73503a', '#5f3f2d']
  colors.forEach((color, i) => {
    ctx.fillStyle = color
    ctx.fillRect(0, i * 64, 256, 64)
    ctx.fillStyle = 'rgba(40, 20, 12, 0.7)'
    ctx.fillRect(0, i * 64 + 61, 256, 3)
  })
  ctx.strokeStyle = 'rgba(40, 20, 12, 0.25)'
  ctx.lineWidth = 1.5
  for (let i = 0; i < 12; i++) {
    ctx.beginPath()
    ctx.moveTo(0, 8 + i * 21)
    ctx.bezierCurveTo(80, 4 + i * 21, 170, 14 + i * 21, 256, 8 + i * 21)
    ctx.stroke()
  }
  const texture = canvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  return texture
}

/** The ceiling seen from below, from the back wall's top toward the viewer, between the side walls. */
function ceilingGeometry(left: number, right: number, centre: number): THREE.BufferGeometry {
  const positions: number[] = []
  const uvs: number[] = []
  const colors: number[] = []
  const index: number[] = []
  for (let i = 0; i <= SIDE_STRIPS; i++) {
    const depth = (EYE.reach * i) / SIDE_STRIPS
    const scale = EYE.distance / (EYE.distance - depth)
    const y = EYE.y + scale * (CEILING - EYE.y)
    const shade = 0.82 - 0.25 * (i / SIDE_STRIPS)
    for (const x of [left, right]) {
      positions.push(centre + scale * (x - centre), y, 0)
      uvs.push(x / 2.2, depth / 1.1)
      colors.push(shade, shade * 0.96, shade * 0.92)
    }
    if (i > 0) {
      const a = (i - 1) * 2
      index.push(a, a + 2, a + 1, a + 1, a + 2, a + 3)
    }
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
  geometry.setIndex(index)
  return geometry
}

export function createCozyBackdrop(scene: THREE.Scene, art: CozyArt, width = ROOM_RIGHT): CozyBackdrop {
  const span = ROOM_RIGHT - ROOM_LEFT + BACKDROP_OVERHANG * 2
  const centerX = (ROOM_LEFT + ROOM_RIGHT) / 2
  const left = centerX - span / 2

  // Each tile keeps its own aspect and lines up with the room's left end and the wall's foot.
  for (const [id, texture] of Object.entries(art.finishes)) {
    const tile = tileSize(id, texture)
    const isSkirting = id === 'baseboard-short'
    const isPanelling = id === 'baseboard-tall'
    const height = isSkirting ? SKIRTING.top - SKIRTING.bottom : isPanelling ? PANELLING.top - PANELLING.bottom : WALL_HEIGHT
    texture.repeat.set(span / tile.width, isSkirting || isPanelling ? 1 : height / tile.height)
    texture.offset.set((left - ROOM_LEFT) / tile.width, 0)
  }
  art.floor.repeat.set(span / FLOOR_TILE, 1)
  art.floor.offset.set((left - ROOM_LEFT) / FLOOR_TILE, 0)

  const group = new THREE.Group()
  const meshes: THREE.Mesh[] = []
  const add = (height: number, material: THREE.MeshBasicMaterial, y: number, z: number) => {
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(span, height), material)
    mesh.position.set(centerX, y, z)
    group.add(mesh)
    meshes.push(mesh)
    return mesh
  }

  // As in the hall, the floor's back edge sits at y = 0, above the visitors' feet, so they stand on it.
  const wall = new THREE.MeshBasicMaterial({ map: art.finishes['wallpaper-cream'] })
  add(WALL_HEIGHT, wall, WALL_HEIGHT / 2, -0.5)
  const panelling = add(
    PANELLING.top - PANELLING.bottom,
    new THREE.MeshBasicMaterial({ map: art.finishes['baseboard-tall'], transparent: true }),
    (PANELLING.top + PANELLING.bottom) / 2,
    -0.48,
  )
  add(
    SKIRTING.top - SKIRTING.bottom,
    new THREE.MeshBasicMaterial({ map: art.finishes['baseboard-short'], transparent: true }),
    (SKIRTING.top + SKIRTING.bottom) / 2,
    -0.47,
  )
  add(FLOOR_HEIGHT, new THREE.MeshBasicMaterial({ map: art.floor }), -FLOOR_HEIGHT / 2, -0.4)


  // The room's ends are walls too, receding toward the viewer, papered and skirted like the back wall.
  const sideMaps = new Map<THREE.Texture, THREE.Texture>()
  function sideMap(texture: THREE.Texture, id: string, band?: { bottom: number; top: number }): THREE.Texture {
    const known = sideMaps.get(texture)
    if (known) return known
    const tile = tileSize(id, texture)
    const copy = texture.clone()
    copy.repeat.set(1 / tile.width, band ? 1 / (band.top - band.bottom) : 1 / tile.height)
    copy.offset.set(0, band ? -band.bottom / (band.top - band.bottom) : 0)
    copy.needsUpdate = true
    sideMaps.set(texture, copy)
    return copy
  }
  const sidePaper = new THREE.MeshBasicMaterial({
    map: sideMap(art.finishes['wallpaper-cream'], 'wallpaper-cream'),
    vertexColors: true,
    side: THREE.DoubleSide,
  })
  const sideSkirting = new THREE.MeshBasicMaterial({
    map: sideMap(art.finishes['baseboard-short'], 'baseboard-short', SKIRTING),
    vertexColors: true,
    transparent: true,
    side: THREE.DoubleSide,
  })
  const sidePanelling = new THREE.MeshBasicMaterial({
    map: sideMap(art.finishes['baseboard-tall'], 'baseboard-tall', PANELLING),
    vertexColors: true,
    transparent: true,
    side: THREE.DoubleSide,
  })
  const sides: THREE.Mesh[] = []
  const ceilingMap = ceilingTexture()
  // In front of anything hung on the wall, so a bulb's cord vanishes into it.
  const ceiling = new THREE.Mesh(
    new THREE.BufferGeometry(),
    new THREE.MeshBasicMaterial({ map: ceilingMap, vertexColors: true, side: THREE.DoubleSide }),
  )
  ceiling.position.z = 0.12
  ceiling.frustumCulled = false
  group.add(ceiling)
  meshes.push(ceiling)
  function placeSides(right: number): void {
    ceiling.geometry.dispose()
    ceiling.geometry = ceilingGeometry(ROOM_LEFT, right, (ROOM_LEFT + right) / 2)
    for (const mesh of sides) {
      group.remove(mesh)
      mesh.geometry.dispose()
    }
    sides.length = 0
    const centre = (ROOM_LEFT + right) / 2
    for (const edge of [ROOM_LEFT, right]) {
      const layers: [number, number, THREE.MeshBasicMaterial, number][] = [
        [0, CEILING, sidePaper, -0.3],
        [PANELLING.bottom, PANELLING.top, sidePanelling, -0.29],
        [SKIRTING.bottom, SKIRTING.top, sideSkirting, -0.28],
      ]
      for (const [bottom, top, material, z] of layers) {
        const mesh = new THREE.Mesh(sideWallGeometry(edge, centre, bottom, top), material)
        mesh.position.z = z
        mesh.frustumCulled = false
        if (material === sidePanelling) mesh.visible = panelling.visible
        group.add(mesh)
        sides.push(mesh)
      }
    }
  }

  // The dark, painted over everything from what the room's lights reach.
  const shadeCanvas = document.createElement('canvas')
  shadeCanvas.width = SHADE.columns
  shadeCanvas.height = SHADE.rows
  const shadeContext = shadeCanvas.getContext('2d')
  const shadePixels = shadeContext?.createImageData(SHADE.columns, SHADE.rows) ?? null
  const shadeMap = new THREE.CanvasTexture(shadeCanvas)
  shadeMap.colorSpace = THREE.NoColorSpace
  const shade = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({ color: SHADE.color, alphaMap: shadeMap, transparent: true, depthWrite: false, depthTest: false }),
  )
  shade.renderOrder = 10
  shade.frustumCulled = false
  group.add(shade)
  meshes.push(shade)

  // The bulbs' glow, rebuilt whenever the lights move.
  const glowAlpha = glowTexture()
  const glows = new THREE.Group()
  group.add(glows)
  const lightMaterial = (color: string, alphaMap: THREE.Texture, opacity: number) =>
    new THREE.MeshBasicMaterial({
      color,
      alphaMap,
      opacity,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
    })
  function glow(color: string, opacity: number, x: number, y: number, width: number, height: number, alphaMap = glowAlpha): THREE.Mesh {
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), lightMaterial(color, alphaMap, opacity))
    mesh.position.set(x, y, SHADE.z + 0.05)
    mesh.scale.set(width, height, 1)
    mesh.renderOrder = 11
    mesh.frustumCulled = false
    glows.add(mesh)
    return mesh
  }
  function clearGlows(): void {
    for (const child of [...glows.children]) {
      const mesh = child as THREE.Mesh
      glows.remove(mesh)
      mesh.geometry.dispose()
      ;(mesh.material as THREE.Material).dispose()
    }
  }
  let bulbs: { mesh: THREE.Mesh; base: number; phase: number }[] = []

  const moteDot = alphaCanvas(32, 32, (ctx) => {
    const dot = ctx.createRadialGradient(16, 16, 0, 16, 16, 16)
    dot.addColorStop(0, 'rgb(255, 255, 255)')
    dot.addColorStop(1, 'rgb(0, 0, 0)')
    ctx.fillStyle = dot
    ctx.fillRect(0, 0, 32, 32)
  })
  const moteMaterial = (size: number) =>
    new THREE.PointsMaterial({
      color: '#ffe6b0',
      size,
      sizeAttenuation: false,
      alphaMap: moteDot,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
    })
  const motes = [AIR_MOTES].map((count) => {
    const positions = new Float32Array(count * 3)
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const points = new THREE.Points(geometry, moteMaterial(2.5))
    points.renderOrder = 12
    points.visible = false
    points.frustumCulled = false
    group.add(points)
    return { points, positions, geometry, material: points.material as THREE.PointsMaterial }
  })
  const [airMotes] = motes
  let seed = 3
  const random = () => {
    seed = (seed * 16807) % 2147483647
    return seed / 2147483647
  }
  const drift = (count: number) => Array.from({ length: count }, () => ({ along: random(), across: random(), speed: 0.4 + random(), phase: random() * 6.28 }))
  const airDrift = drift(AIR_MOTES)

  let right = width
  let lit: RoomLight = { gloom: 0, suns: [], lamps: [] }

  function paintShade(): void {
    const minX = ROOM_LEFT - SHADE.margin
    const maxX = right + SHADE.margin
    if (shadeContext && shadePixels) {
      const data = shadePixels.data
      for (let row = 0; row < SHADE.rows; row++) {
        const y = SHADE.top - ((row + 0.5) / SHADE.rows) * (SHADE.top - SHADE.bottom)
        for (let column = 0; column < SHADE.columns; column++) {
          const x = minX + ((column + 0.5) / SHADE.columns) * (maxX - minX)
          const value = Math.round(darknessAt(lit, right, x, y) * 255)
          const at = (row * SHADE.columns + column) * 4
          data[at] = value
          data[at + 1] = value
          data[at + 2] = value
          data[at + 3] = 255
        }
      }
      shadeContext.putImageData(shadePixels, 0, 0)
      shadeMap.needsUpdate = true
    }
    shade.scale.set(maxX - minX, SHADE.top - SHADE.bottom, 1)
    shade.position.set((minX + maxX) / 2, (SHADE.top + SHADE.bottom) / 2, SHADE.z)
  }

  function placeGlows(): void {
    clearGlows()
    bulbs = []
    const dirty = Math.max(0, Math.min(1, lit.gloom))
    for (const lamp of lit.lamps) {
      const halo = glow(BULBLIGHT, 0, lamp.x, lamp.y, 2.2, 2.2)
      const core = glow(BULBLIGHT, 0, lamp.x, lamp.y, 0.42, 0.46)
      bulbs.push({ mesh: halo, base: 0.16 + 0.22 * dirty, phase: random() * 6.28 }, { mesh: core, base: 0.85, phase: random() * 6.28 })
    }
    airMotes.points.visible = dirty > 0.01
    airMotes.material.opacity = 0.32 * dirty
  }

  function setWidth(next: number): void {
    right = next
    placeSides(next)
    paintShade()
  }
  setWidth(width)
  scene.add(group)

  return {
    setWidth,

    setLight(light) {
      lit = light
      paintShade()
      placeGlows()
    },

    update(now) {
      for (const bulb of bulbs) {
        // An old bulb on a tired wire: a slow breath and the odd stutter.
        const stutter = Math.sin(now * 0.013 + bulb.phase) > 0.985 ? 0.6 : 1
        ;(bulb.mesh.material as THREE.MeshBasicMaterial).opacity = bulb.base * (0.9 + 0.1 * Math.sin(now * 0.002 + bulb.phase)) * stutter
      }
      if (airMotes.points.visible) {
        airDrift.forEach((mote, i) => {
          // Dust hangs all through a shut-up room, wandering more than falling.
          const x = ROOM_LEFT + 0.2 + (right - 0.4) * ((mote.across + Math.sin(now * 0.00005 * mote.speed + mote.phase) * 0.04 + 1) % 1)
          const y = -0.6 + 4.4 * ((mote.along - now * 0.000006 * mote.speed + 10) % 1)
          airMotes.positions[i * 3] = x + Math.sin(now * 0.0005 * mote.speed + mote.phase) * 0.12
          airMotes.positions[i * 3 + 1] = y + Math.cos(now * 0.0004 + mote.phase) * 0.08
          airMotes.positions[i * 3 + 2] = SHADE.z + 0.1
        })
        airMotes.geometry.getAttribute('position').needsUpdate = true
      }
    },

    setFinishes(placements) {
      const paperId = finishIn(placements, 'wallpaper')
      const paper = art.finishes[paperId] ?? art.finishes['wallpaper-cream']
      if (wall.map !== paper) {
        wall.map = paper
        wall.needsUpdate = true
        sidePaper.map = sideMap(paper, art.finishes[paperId] ? paperId : 'wallpaper-cream')
        sidePaper.needsUpdate = true
      }
      panelling.visible = finishIn(placements, 'baseboard') === 'baseboard-tall'
      for (const mesh of sides) if (mesh.material === sidePanelling) mesh.visible = panelling.visible
    },

    dispose() {
      scene.remove(group)
      clearGlows()
      for (const mesh of [...meshes, ...sides]) {
        mesh.geometry.dispose()
        if (!sides.includes(mesh)) (mesh.material as THREE.Material).dispose()
      }
      for (const material of [sidePaper, sideSkirting, sidePanelling]) material.dispose()
      for (const { geometry, material } of motes) {
        geometry.dispose()
        material.dispose()
      }
      for (const texture of [shadeMap, glowAlpha, ceilingMap, moteDot, ...sideMaps.values()]) texture.dispose()
    },
  }
}

export interface GhostOptions {
  valid: boolean
  /** Radians; the drag's sway. */
  tilt: number
  /** Things resting on the carried one, already moved to where they would land. */
  riders?: Placement[]
}

export interface HighlightArea {
  minX: number
  maxX: number
  /** A surface's resting line; drawn as a thin band. */
  y?: number
  minY?: number
  maxY?: number
}

export interface PlacementBounds {
  x: number
  top: number
  bottom: number
}

export type WorkKind = 'build' | 'clean'

export interface PlacementLayer {
  set(placements: Placement[]): void
  pick(raycaster: THREE.Raycaster): Placement | null
  /** Leaves placements out while they are being carried. */
  hide(ids: string | readonly string[] | null): void
  ghost(placement: Placement | null, options?: GhostOptions): void
  highlight(zone: string | null, valid: boolean, area?: HighlightArea): void
  select(id: string | null): void
  /** A squash and settle, as when something is set down. */
  bounce(id: string): void
  /** Something being built (rising from its base) or cleaned away (scrubbed and fading), `t` from 0 to 1; null when done. */
  work(id: string, kind: WorkKind, t: number | null): void
  bounds(id: string): PlacementBounds | null
  update(now: number): void
  dispose(): void
}

const PROP_IMAGE_CACHE = new Map<string, string>()

/** The exact image the cozy room uses for a prop, as a URL for the tray. */
export function cozyPropImageUrl(ref: string): string | null {
  const cached = PROP_IMAGE_CACHE.get(ref)
  if (cached) return cached
  const drawn = DRAWN[ref]
  if (drawn) {
    const url = drawn().toDataURL()
    PROP_IMAGE_CACHE.set(ref, url)
    return url
  }
  const source = sourceFor(ref)
  if (!source) return null
  let url: string
  if ('image' in source) {
    url = builtUrl(manifest.atelier[source.image].src)
  } else if ('home' in source) {
    url = assetUrl(source.home)
  } else if ('url' in source) {
    url = builtUrl(source.url)
  } else if ('pond' in source) {
    // Until the plaque is drawn, show the raw catch rather than no picture.
    return assetUrl(source.pond)
  } else {
    const texture = fishTexture(source.fish)
    url = (texture.image as HTMLCanvasElement).toDataURL()
    texture.dispose()
  }
  PROP_IMAGE_CACHE.set(ref, url)
  return url
}

/** A swatch of a wallpaper or baseboard, for the drawer. */
export function cozyFinishImageUrl(ref: string): string | null {
  const cached = PROP_IMAGE_CACHE.get(`finish:${ref}`)
  if (cached) return cached
  let url: string | null = null
  if (ref === 'wallpaper-cream') url = creamCanvas().toDataURL()
  else if (ref === 'wallpaper-plaster') url = plasterCanvas().toDataURL()
  else if (ref === 'wallpaper-peach-stripes') url = peachStripesCanvas().toDataURL()
  else if (FINISH_TILES[ref]) url = assetUrl(FINISH_TILES[ref].image)
  if (url) PROP_IMAGE_CACHE.set(`finish:${ref}`, url)
  return url
}

function aspectOf(texture: THREE.Texture): number {
  const image = texture.image as { naturalWidth?: number; naturalHeight?: number; width?: number; height?: number } | undefined
  const width = image?.naturalWidth ?? image?.width ?? 1
  const height = image?.naturalHeight ?? image?.height ?? 1
  return width > 0 && height > 0 ? width / height : 1
}

const BOUNCE_MS = 420
const LIFT = 0.16
const WALL_ZONE = THEMES.cozy.zones.wall

function settle(t: number): { x: number; y: number } {
  // A quick squash, a small overshoot, then rest.
  if (t >= 1) return { x: 1, y: 1 }
  const wave = Math.sin(t * Math.PI * 2.4) * (1 - t) * (1 - t)
  return { x: 1 + wave * 0.16, y: 1 - wave * 0.2 }
}

export function createPlacementLayer<Art>(
  scene: THREE.Scene,
  art: Art,
  theme: PlacementTheme<Art>,
  roomWidth: () => number = () => Infinity,
): PlacementLayer {
  const group = new THREE.Group()
  scene.add(group)
  const helpers = new THREE.Group()
  scene.add(helpers)
  let items: { mesh: THREE.Mesh; placement: Placement; height: number; baseY: number; flip: boolean; x: number; cover?: boolean }[] = []
  const working = new Map<string, { kind: WorkKind; t: number }>()
  let shownWidth = roomWidth()
  let current: Placement[] = []
  let hidden = new Set<string>()
  let ghosts: THREE.Mesh[] = []
  let shadowMesh: THREE.Mesh | null = null
  let bandMesh: THREE.Mesh | null = null
  let outline: THREE.LineSegments | null = null
  let selected: string | null = null
  const bouncing = new Map<string, number>()
  const contact = alphaCanvas(64, 32, (ctx) => {
    const soft = ctx.createRadialGradient(32, 16, 0, 32, 16, 32)
    soft.addColorStop(0, 'rgb(255, 255, 255)')
    soft.addColorStop(0.5, 'rgb(150, 150, 150)')
    soft.addColorStop(1, 'rgb(0, 0, 0)')
    ctx.setTransform(1, 0, 0, 0.5, 0, 8)
    ctx.fillStyle = soft
    ctx.fillRect(0, 0, 64, 64)
  })

  const SHADOW_COLOR = 0x2a140c
  /** A thing's own outline, darkened and nudged down and right: its shadow on the wall behind it. */
  function silhouette(size: { width: number; height: number; texture: THREE.Texture }, flip: boolean, dx: number, dy: number, opacity: number): THREE.Mesh {
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(size.width, size.height),
      new THREE.MeshBasicMaterial({ color: SHADOW_COLOR, map: size.texture, transparent: true, opacity, depthWrite: false }),
    )
    mesh.position.set(flip ? -dx : dx, dy, -0.006)
    return mesh
  }

  /** What hangs off a thing besides its picture: shadows, and a bulb's cord up to the ceiling. */
  function extrasFor(placement: Placement, size: { width: number; height: number; texture: THREE.Texture }, flip: boolean): THREE.Mesh[] {
    if (placement.ref === 'bare-bulb') {
      const top = (theme.baseY(placement, size.height, current) + size.height)
      const reach = Math.max(0, CEILING + 0.05 - top)
      const cord = new THREE.Mesh(new THREE.PlaneGeometry(0.012, reach), new THREE.MeshBasicMaterial({ color: 0x3a2a24 }))
      cord.position.set(0, size.height / 2 + reach / 2, 0)
      return [cord]
    }
    if (placement.zone === 'wall') return placement.kind === 'prop' ? [silhouette(size, flip, 0.05, -0.07, 0.3)] : []
    if (placement.ref === 'dust' || theme.spec.props[placement.ref]?.floorCovering) return []
    const extras = [silhouette(size, flip, 0.07, -0.03, placement.zone === 'top' ? 0.14 : 0.2)]
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({ color: SHADOW_COLOR, alphaMap: contact, transparent: true, opacity: 0.55, depthWrite: false }),
    )
    ground.scale.set(size.width * 1.08, Math.min(0.24, 0.1 + size.width * 0.05), 1)
    ground.position.set(0, -size.height / 2 + 0.02, -0.004)
    extras.push(ground)
    return extras
  }

  function dropHelper(object: THREE.Mesh | THREE.LineSegments | null): void {
    if (!object) return
    helpers.remove(object)
    object.geometry.dispose()
    ;(object.material as THREE.Material).dispose()
  }

  function clear(): void {
    for (const { mesh } of items) {
      for (const child of mesh.children as THREE.Mesh[]) {
        child.geometry.dispose()
        ;(child.material as THREE.Material).dispose()
      }
      group.remove(mesh)
      mesh.geometry.dispose()
      ;(mesh.material as THREE.Material).dispose()
    }
    items = []
  }

  function sizeOf(placement: Placement): { width: number; height: number; texture: THREE.Texture } | null {
    const prop =
      placement.kind === 'prop' ? theme.spec.props[placement.ref] : placement.kind === 'mess' ? theme.spec.messes?.[placement.ref] : undefined
    const texture = theme.propImage(placement.ref, art)
    if (!prop || !texture) return null
    return { width: prop.width, height: prop.width / aspectOf(texture), texture }
  }

  function drawOutline(): void {
    dropHelper(outline)
    outline = null
    const item = selected === null ? undefined : items.find((entry) => entry.placement.id === selected)
    if (!item || hidden.has(item.placement.id)) return
    const prop = item.placement.kind === 'mess' ? theme.spec.messes?.[item.placement.ref] : theme.spec.props[item.placement.ref]
    if (!prop) return
    const pad = 0.08
    const halfW = prop.width / 2 + pad
    const halfH = item.height / 2 + pad
    const geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-halfW, -halfH, 0), new THREE.Vector3(halfW, -halfH, 0),
      new THREE.Vector3(halfW, -halfH, 0), new THREE.Vector3(halfW, halfH, 0),
      new THREE.Vector3(halfW, halfH, 0), new THREE.Vector3(-halfW, halfH, 0),
      new THREE.Vector3(-halfW, halfH, 0), new THREE.Vector3(-halfW, -halfH, 0),
    ])
    const line = new THREE.LineSegments(
      geometry,
      new THREE.LineDashedMaterial({ color: 0xffffff, dashSize: 0.09, gapSize: 0.06, transparent: true, opacity: 0.95 }),
    )
    line.computeLineDistances()
    line.position.set(item.mesh.position.x, item.baseY + item.height / 2, item.mesh.position.z + 0.01)
    helpers.add(line)
    outline = line
  }

  function dropGhosts(): void {
    for (const mesh of ghosts) dropHelper(mesh)
    ghosts = []
    dropHelper(shadowMesh)
    shadowMesh = null
  }

  return {
    set(placements) {
      clear()
      current = placements
      for (const [index, placement] of placements.entries()) {
        const cover = theme.cover?.(placement, art, shownWidth) ?? null
        if (cover) {
          cover.mesh.userData.placement = placement
          cover.mesh.visible = !hidden.has(placement.id)
          group.add(cover.mesh)
          items.push({ mesh: cover.mesh, placement, height: cover.height, baseY: cover.baseY, flip: false, x: cover.mesh.position.x, cover: true })
          continue
        }
        const size = sizeOf(placement)
        if (!size) continue
        const mesh = new THREE.Mesh(
          new THREE.PlaneGeometry(size.width, size.height),
          new THREE.MeshBasicMaterial({ map: size.texture, transparent: true }),
        )
        const pose = theme.pose?.(placement, size, shownWidth) ?? null
        const baseY = pose?.baseY ?? theme.baseY(placement, size.height, placements)
        const flip = pose?.flip ?? placement.flip === true
        // Of two things at the same depth, the one placed later is in front, as drawn and as picked.
        mesh.position.set(pose?.x ?? placement.x, baseY + size.height / 2, theme.depth(placement, size.width, placements) + index * 0.0005)
        mesh.scale.x = flip ? -1 : 1
        mesh.visible = !hidden.has(placement.id)
        mesh.userData.placement = placement
        for (const extra of extrasFor(placement, size, flip)) mesh.add(extra)
        group.add(mesh)
        items.push({ mesh, placement, height: size.height, baseY, flip, x: mesh.position.x })
      }
      drawOutline()
    },

    pick(raycaster) {
      const visible = items.filter((item) => item.mesh.visible && !item.cover && !working.has(item.placement.id)).map((item) => item.mesh)
      const hit = raycaster.intersectObjects(visible, false)[0]
      return hit ? (hit.object.userData.placement as Placement | undefined) ?? null : null
    },

    hide(ids) {
      hidden = new Set(ids === null ? [] : typeof ids === 'string' ? [ids] : ids)
      for (const item of items) item.mesh.visible = !hidden.has(item.placement.id)
      drawOutline()
    },

    ghost(placement, options = { valid: true, tilt: 0 }) {
      dropGhosts()
      if (!placement) return
      const size = sizeOf(placement)
      if (!size) return
      // Riders look up the carried thing as their parent, so it joins the arrangement they are drawn against.
      const all = [placement, ...(options.riders ?? []), ...current.filter((entry) => entry.id !== placement.id)]
      const baseY = theme.baseY(placement, size.height, all)
      const z = theme.depth(placement, size.width, all) + 0.3
      const centerY = baseY + size.height / 2
      for (const entry of [placement, ...(options.riders ?? [])]) {
        const entrySize = entry === placement ? size : sizeOf(entry)
        if (!entrySize) continue
        const entryBase = entry === placement ? baseY : theme.baseY(entry, entrySize.height, all)
        const mesh = new THREE.Mesh(
          new THREE.PlaneGeometry(entrySize.width, entrySize.height),
          new THREE.MeshBasicMaterial({
            map: entrySize.texture,
            transparent: true,
            opacity: options.valid ? 0.96 : 0.42,
            depthWrite: false,
          }),
        )
        // Riders sway with the thing under them, about its centre.
        const dx = entry.x - placement.x
        const dy = entryBase + entrySize.height / 2 - centerY
        const cos = Math.cos(options.tilt)
        const sin = Math.sin(options.tilt)
        mesh.position.set(placement.x + dx * cos - dy * sin, centerY + LIFT + dx * sin + dy * cos, z + (entry === placement ? 0 : 0.04))
        mesh.rotation.z = options.tilt
        mesh.scale.set(entry.flip ? -1.06 : 1.06, 1.06, 1)
        helpers.add(mesh)
        ghosts.push(mesh)
      }

      // Where it will land: a soft shadow on the floor or a surface, or on the wall behind it.
      const shadow = new THREE.Mesh(
        new THREE.CircleGeometry(0.5, 32),
        new THREE.MeshBasicMaterial({ color: 0x3a1d12, transparent: true, opacity: options.valid ? 0.22 : 0.08, depthWrite: false }),
      )
      const onWall = placement.zone === 'wall'
      shadow.scale.set(size.width * 0.9, onWall ? size.height * 0.9 : 0.22, 1)
      shadow.position.set(placement.x + (onWall ? 0.06 : 0), onWall ? centerY - 0.06 : baseY + 0.02, z - 0.02)
      helpers.add(shadow)
      shadowMesh = shadow
    },

    highlight(zone, valid, area) {
      dropHelper(bandMesh)
      bandMesh = null
      if (!zone) return
      const band = theme.spec.zones[zone]
      if (!band) return
      const minX = area?.minX ?? band.minX
      const maxX = area?.maxX ?? band.maxX
      let bottom: number
      let top: number
      let z: number
      if (area?.y !== undefined) {
        bottom = area.y - 0.03
        top = area.y + 0.09
        z = 0.6
      } else if (zone === 'wall') {
        bottom = area?.minY ?? WALL_ZONE.minY ?? 0.25
        top = area?.maxY ?? WALL_ZONE.maxY ?? 3.8
        z = -0.05
      } else {
        bottom = WALL_FOOT - 0.35
        top = WALL_FOOT + 0.85
        z = 0.02
      }
      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(Math.max(0.01, maxX - minX), Math.max(0.01, top - bottom)),
        new THREE.MeshBasicMaterial({
          color: valid ? 0x7fcf93 : 0xe0705b,
          transparent: true,
          opacity: 0.18,
          depthWrite: false,
        }),
      )
      mesh.position.set((minX + maxX) / 2, (bottom + top) / 2, z)
      mesh.userData.surface = area?.y !== undefined
      helpers.add(mesh)
      bandMesh = mesh
    },

    select(id) {
      selected = id
      drawOutline()
    },

    bounce(id) {
      bouncing.set(id, performance.now())
    },

    work(id, kind, t) {
      if (t !== null) {
        working.set(id, { kind, t: Math.max(0, Math.min(1, t)) })
        return
      }
      working.delete(id)
      const item = items.find((entry) => entry.placement.id === id)
      if (!item) return
      item.mesh.scale.set(item.flip ? -1 : 1, 1, 1)
      item.mesh.position.set(item.x, item.baseY + item.height / 2, item.mesh.position.z)
      item.mesh.rotation.z = 0
      ;(item.mesh.material as THREE.MeshBasicMaterial).opacity = 1
    },

    bounds(id) {
      const item = items.find((entry) => entry.placement.id === id)
      if (!item) return null
      return { x: item.mesh.position.x, top: item.baseY + item.height, bottom: item.baseY }
    },

    update(now) {
      if (roomWidth() !== shownWidth) {
        shownWidth = roomWidth()
        this.set(current)
      }
      for (const [id, job] of working) {
        const item = items.find((entry) => entry.placement.id === id)
        if (!item) continue
        const flip = item.flip ? -1 : 1
        const material = item.mesh.material as THREE.MeshBasicMaterial
        if (item.cover) {
          material.opacity = 1 - job.t
          continue
        }
        if (job.kind === 'build') {
          // Put together from the floor up, wobbling until it settles.
          const rise = 0.12 + 0.88 * (1 - (1 - job.t) ** 2)
          item.mesh.scale.set(flip, rise, 1)
          item.mesh.position.set(item.x, item.baseY + (item.height * rise) / 2, item.mesh.position.z)
          item.mesh.rotation.z = Math.sin(now / 90) * 0.03 * (1 - job.t)
          material.opacity = 0.45 + 0.55 * job.t
        } else {
          // Scrubbed at, shrinking and fading away.
          const shrink = 1 - 0.18 * job.t
          item.mesh.scale.set(flip * shrink, shrink, 1)
          item.mesh.position.set(item.x + Math.sin(now / 45) * 0.02 * (1 - job.t * 0.5), item.baseY + (item.height * shrink) / 2, item.mesh.position.z)
          material.opacity = 1 - 0.85 * job.t
        }
      }
      for (const [id, startedAt] of bouncing) {
        const item = items.find((entry) => entry.placement.id === id)
        const t = (now - startedAt) / BOUNCE_MS
        if (!item) {
          bouncing.delete(id)
          continue
        }
        const { x, y } = settle(Math.min(1, t))
        item.mesh.scale.set(x * (item.flip ? -1 : 1), y, 1)
        // Squash from the base, so a thing stays standing on whatever is under it.
        item.mesh.position.y = item.baseY + (item.height * y) / 2
        if (t >= 1) bouncing.delete(id)
      }
      if (bandMesh) {
        const strong = bandMesh.userData.surface === true
        ;(bandMesh.material as THREE.MeshBasicMaterial).opacity = (strong ? 0.42 : 0.14) + Math.sin(now / 260) * 0.06
      }
      if (outline) (outline.material as THREE.LineDashedMaterial).opacity = 0.7 + Math.sin(now / 200) * 0.25
    },

    dispose() {
      clear()
      dropGhosts()
      dropHelper(bandMesh)
      dropHelper(outline)
      contact.dispose()
      scene.remove(helpers)
      scene.remove(group)
    },
  }
}
