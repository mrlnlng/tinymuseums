import * as THREE from 'three'
import type { Placement, ThemeSpec } from '@tiny/core'
import { THEMES } from '@tiny/core/rooms'
import manifest from '@/generated/asset-manifest.json'
import { CONFIG } from '@/features/hall/scene/config'
import { assetUrl, builtUrl, type AssetName } from '@/shared/lib/assets'

type AtelierImage = keyof typeof manifest.atelier

export interface CozyArt {
  wall: THREE.Texture
  wainscot: THREE.Texture
  post: THREE.Texture
  floor: THREE.Texture
  props: Record<string, THREE.Texture>
}

export interface PlacementTheme<Art> {
  spec: ThemeSpec
  load(): Promise<Art>
  propImage(ref: string, art: Art): THREE.Texture | null
  zoneY(zone: string, height: number, ref?: string): number
}

const FEET_Y = CONFIG.character.centerY - CONFIG.character.height / 2
const WALL_Y = 2.3
const FLOOR_HEIGHT = 2.6
const WALL_HEIGHT = 9
/** The backdrop runs past the walkable room so a wide view never shows its edge. */
const BACKDROP_OVERHANG = 14
const ROOM_LEFT = 0.1
const ROOM_RIGHT = 19.9
const STRIPE_PAIR = CONFIG.wallpaper.stripePairWidth
const WAINSCOT_HEIGHT = 0.95
const WAINSCOT_PANEL = 1.4
const POST_WIDTH = 0.34
/** Share of the carpet that lies below the feet line, so it reads as lying on the floor. */
const CARPET_SINK = 0.7

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

function sourceFor(ref: string): { image: AtelierImage } | { url: string } | { fish: string } | { pond: AssetName } | null {
  const image = ATELIER_PROPS[ref]
  if (image) return { image }
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

/** One pair of the museum's cream stripes, warmed toward peach for a home. */
function wallpaperTexture(): THREE.Texture {
  const [canvas, ctx] = drawingOn(128, 128)
  ctx.fillStyle = '#fcf0dc'
  ctx.fillRect(0, 0, 128, 128)
  ctx.fillStyle = '#f7dfc6'
  ctx.fillRect(64, 0, 64, 128)
  ctx.fillStyle = 'rgba(214, 160, 128, 0.35)'
  ctx.fillRect(62, 0, 2, 128)
  ctx.fillRect(126, 0, 2, 128)
  const texture = canvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  return texture
}

/** A run of wooden panels below a chair rail. */
function wainscotTexture(): THREE.Texture {
  const [canvas, ctx] = drawingOn(224, 152)
  ctx.fillStyle = '#c98f6d'
  ctx.fillRect(0, 0, 224, 152)
  ctx.fillStyle = '#8b5641'
  ctx.fillRect(0, 0, 224, 12)
  ctx.fillStyle = '#a86d50'
  ctx.fillRect(0, 12, 224, 4)
  ctx.fillStyle = '#9a6248'
  ctx.fillRect(0, 138, 224, 14)
  roundedRect(ctx, 18, 30, 188, 94, 10)
  ctx.fillStyle = '#d29d7c'
  ctx.fill()
  ctx.lineWidth = 4
  ctx.strokeStyle = '#a5694c'
  ctx.stroke()
  ctx.fillStyle = 'rgba(255, 238, 214, 0.25)'
  ctx.fillRect(26, 36, 172, 6)
  const texture = canvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  return texture
}

/** A tall wooden post that closes the room at each end. */
function postTexture(): THREE.Texture {
  const [canvas, ctx] = drawingOn(64, 512)
  ctx.fillStyle = '#b97e5e'
  ctx.fillRect(0, 0, 64, 512)
  ctx.fillStyle = '#d29d7c'
  ctx.fillRect(10, 0, 30, 512)
  ctx.fillStyle = '#8b5641'
  ctx.fillRect(0, 0, 5, 512)
  ctx.fillRect(59, 0, 5, 512)
  return canvasTexture(canvas)
}

export async function loadCozyArt(): Promise<CozyArt> {
  const [wall, floor, props] = await Promise.all([
    wallpaperTexture(),
    loadTexture(builtUrl(manifest.images.floor.x2.src)),
    Promise.all(
      Object.keys(THEMES.cozy.props).map(async (ref) => {
        const source = sourceFor(ref)
        if (!source) return null
        const texture = 'image' in source
          ? await loadTexture(builtUrl(manifest.atelier[source.image].src))
          : 'url' in source
            ? await loadTexture(builtUrl(source.url))
            : 'pond' in source
              ? await pondTrophyTexture(ref, source.pond)
              : fishTexture(source.fish)
        return [ref, texture] as const
      }),
    ),
  ])
  return {
    wall,
    wainscot: wainscotTexture(),
    post: postTexture(),
    floor,
    props: Object.fromEntries(props.filter((entry): entry is readonly [string, THREE.Texture] => entry !== null)),
  }
}

export function disposeCozyArt(art: CozyArt): void {
  art.wall.dispose()
  art.wainscot.dispose()
  art.post.dispose()
  art.floor.dispose()
  const seen = new Set<THREE.Texture>()
  for (const texture of Object.values(art.props)) {
    if (seen.has(texture)) continue
    seen.add(texture)
    texture.dispose()
  }
}

export const cozyTheme: PlacementTheme<CozyArt> = {
  spec: THEMES.cozy,

  load: loadCozyArt,

  propImage(ref, art) {
    return art.props[ref] ?? null
  },

  zoneY(zone, height, ref) {
    if (zone === 'wall') return WALL_Y
    const bottom = FEET_Y - (ref === 'carpet' ? CARPET_SINK * height : 0)
    return bottom + height / 2
  },
}


export interface CozyBackdrop {
  dispose(): void
}

export function createCozyBackdrop(scene: THREE.Scene, art: CozyArt): CozyBackdrop {
  const span = ROOM_RIGHT - ROOM_LEFT + BACKDROP_OVERHANG * 2
  const centerX = (ROOM_LEFT + ROOM_RIGHT) / 2
  const floorAspect = manifest.images.floor.x2.w / manifest.images.floor.x2.h

  art.wall.repeat.set(span / STRIPE_PAIR, WALL_HEIGHT / STRIPE_PAIR)
  art.wainscot.repeat.set(span / WAINSCOT_PANEL, 1)
  art.floor.wrapS = THREE.RepeatWrapping
  art.floor.repeat.set(span / (FLOOR_HEIGHT * floorAspect), 1)

  const group = new THREE.Group()
  const meshes: THREE.Mesh[] = []
  const add = (width: number, height: number, material: THREE.Material, x: number, y: number, z: number) => {
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), material)
    mesh.position.set(x, y, z)
    group.add(mesh)
    meshes.push(mesh)
  }

  // As in the hall, the floor's back edge sits at y = 0, above the visitors' feet, so they stand on it.
  add(span, WALL_HEIGHT, new THREE.MeshBasicMaterial({ map: art.wall }), centerX, WALL_HEIGHT / 2, -0.5)
  add(span, WAINSCOT_HEIGHT, new THREE.MeshBasicMaterial({ map: art.wainscot }), centerX, WAINSCOT_HEIGHT / 2, -0.48)
  add(span, FLOOR_HEIGHT, new THREE.MeshBasicMaterial({ map: art.floor }), centerX, -FLOOR_HEIGHT / 2, -0.4)

  // Past the posts the room is shaded, so its ends read as walls rather than more room.
  const outside = BACKDROP_OVERHANG
  const shade = new THREE.MeshBasicMaterial({ color: '#3a1d12', transparent: true, opacity: 0.32, depthWrite: false })
  const height = WALL_HEIGHT + FLOOR_HEIGHT
  const y = WALL_HEIGHT / 2 - FLOOR_HEIGHT / 2
  add(outside, height, shade, ROOM_LEFT - outside / 2, y, -0.3)
  add(outside, height, shade, ROOM_RIGHT + outside / 2, y, -0.3)
  const post = new THREE.MeshBasicMaterial({ map: art.post })
  add(POST_WIDTH, WALL_HEIGHT, post, ROOM_LEFT, WALL_HEIGHT / 2, -0.28)
  add(POST_WIDTH, WALL_HEIGHT, post, ROOM_RIGHT, WALL_HEIGHT / 2, -0.28)
  scene.add(group)

  return {
    dispose() {
      scene.remove(group)
      const materials = new Set<THREE.Material>()
      for (const mesh of meshes) {
        mesh.geometry.dispose()
        materials.add(mesh.material as THREE.Material)
      }
      for (const material of materials) material.dispose()
    },
  }
}

export interface GhostOptions {
  valid: boolean
  /** Radians; the drag's sway. */
  tilt: number
}

export interface PlacementBounds {
  x: number
  top: number
  bottom: number
}

export interface PlacementLayer {
  set(placements: Placement[]): void
  pick(raycaster: THREE.Raycaster): Placement | null
  /** Leaves one placement out while it is being carried. */
  hide(id: string | null): void
  ghost(placement: Placement | null, options?: GhostOptions): void
  highlight(zone: string | null, valid: boolean): void
  select(id: string | null): void
  /** A squash and settle, as when something is set down. */
  bounce(id: string): void
  bounds(id: string): PlacementBounds | null
  update(now: number): void
  dispose(): void
}

const PROP_IMAGE_CACHE = new Map<string, string>()

/** The exact image the cozy room uses for a prop, as a URL for the tray. */
export function cozyPropImageUrl(ref: string): string | null {
  const cached = PROP_IMAGE_CACHE.get(ref)
  if (cached) return cached
  const source = sourceFor(ref)
  if (!source) return null
  let url: string
  if ('image' in source) {
    url = builtUrl(manifest.atelier[source.image].src)
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

function depthFor(zone: string, ref: string, width: number): number {
  if (zone === 'wall') return 0.05
  if (ref === 'carpet') return 0.08
  return 0.16 + Math.max(0, Math.min(0.36, (3 - width) * 0.09))
}

function aspectOf(texture: THREE.Texture): number {
  const image = texture.image as { naturalWidth?: number; naturalHeight?: number; width?: number; height?: number } | undefined
  const width = image?.naturalWidth ?? image?.width ?? 1
  const height = image?.naturalHeight ?? image?.height ?? 1
  return width > 0 && height > 0 ? width / height : 1
}

const BOUNCE_MS = 420
const LIFT = 0.16

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
): PlacementLayer {
  const group = new THREE.Group()
  scene.add(group)
  const helpers = new THREE.Group()
  scene.add(helpers)
  let items: { mesh: THREE.Mesh; placement: Placement; height: number; baseY: number }[] = []
  let hidden: string | null = null
  let ghostMesh: THREE.Mesh | null = null
  let shadowMesh: THREE.Mesh | null = null
  let bandMesh: THREE.Mesh | null = null
  let outline: THREE.LineSegments | null = null
  let selected: string | null = null
  const bouncing = new Map<string, number>()

  function dropHelper(object: THREE.Mesh | THREE.LineSegments | null): void {
    if (!object) return
    helpers.remove(object)
    object.geometry.dispose()
    ;(object.material as THREE.Material).dispose()
  }

  function clear(): void {
    for (const { mesh } of items) {
      group.remove(mesh)
      mesh.geometry.dispose()
      ;(mesh.material as THREE.Material).dispose()
    }
    items = []
  }

  function sizeOf(placement: Placement): { width: number; height: number; texture: THREE.Texture } | null {
    const prop = theme.spec.props[placement.ref]
    const texture = theme.propImage(placement.ref, art)
    if (!prop || !texture) return null
    return { width: prop.width, height: prop.width / aspectOf(texture), texture }
  }

  function drawOutline(): void {
    dropHelper(outline)
    outline = null
    const item = selected === null ? undefined : items.find((entry) => entry.placement.id === selected)
    if (!item || item.placement.id === hidden) return
    const prop = theme.spec.props[item.placement.ref]
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
    line.position.set(item.mesh.position.x, item.baseY, item.mesh.position.z + 0.01)
    helpers.add(line)
    outline = line
  }

  return {
    set(placements) {
      clear()
      for (const placement of placements) {
        const size = sizeOf(placement)
        if (!size) continue
        const mesh = new THREE.Mesh(
          new THREE.PlaneGeometry(size.width, size.height),
          new THREE.MeshBasicMaterial({ map: size.texture, transparent: true }),
        )
        const baseY = theme.zoneY(placement.zone, size.height, placement.ref)
        mesh.position.set(placement.x, baseY, depthFor(placement.zone, placement.ref, size.width))
        mesh.scale.x = placement.flip ? -1 : 1
        mesh.visible = placement.id !== hidden
        mesh.userData.placement = placement
        group.add(mesh)
        items.push({ mesh, placement, height: size.height, baseY })
      }
      drawOutline()
    },

    pick(raycaster) {
      const visible = items.filter((item) => item.mesh.visible).map((item) => item.mesh)
      const hit = raycaster.intersectObjects(visible, false)[0]
      return hit ? (hit.object.userData.placement as Placement | undefined) ?? null : null
    },

    hide(id) {
      hidden = id
      for (const item of items) item.mesh.visible = item.placement.id !== id
      drawOutline()
    },

    ghost(placement, options = { valid: true, tilt: 0 }) {
      dropHelper(ghostMesh)
      dropHelper(shadowMesh)
      ghostMesh = null
      shadowMesh = null
      if (!placement) return
      const size = sizeOf(placement)
      if (!size) return
      const baseY = theme.zoneY(placement.zone, size.height, placement.ref)
      const z = depthFor(placement.zone, placement.ref, size.width) + 0.3
      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(size.width, size.height),
        new THREE.MeshBasicMaterial({
          map: size.texture,
          transparent: true,
          opacity: options.valid ? 0.96 : 0.42,
          depthWrite: false,
        }),
      )
      mesh.position.set(placement.x, baseY + LIFT, z)
      mesh.rotation.z = options.tilt
      mesh.scale.set(placement.flip ? -1.06 : 1.06, 1.06, 1)
      helpers.add(mesh)
      ghostMesh = mesh

      // Where it will land: a soft shadow on the floor, or on the wall behind it.
      const shadow = new THREE.Mesh(
        new THREE.CircleGeometry(0.5, 32),
        new THREE.MeshBasicMaterial({ color: 0x3a1d12, transparent: true, opacity: options.valid ? 0.22 : 0.08, depthWrite: false }),
      )
      const onWall = placement.zone === 'wall'
      shadow.scale.set(size.width * 0.9, onWall ? size.height * 0.9 : 0.22, 1)
      shadow.position.set(placement.x + (onWall ? 0.06 : 0), onWall ? baseY - 0.06 : baseY - size.height / 2 + 0.02, z - 0.02)
      helpers.add(shadow)
      shadowMesh = shadow
    },

    highlight(zone, valid) {
      dropHelper(bandMesh)
      bandMesh = null
      if (!zone) return
      const band = theme.spec.zones[zone]
      if (!band) return
      const isWall = zone === 'wall'
      const bandHeight = isWall ? 3.3 : 1.2
      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(band.maxX - band.minX, bandHeight),
        new THREE.MeshBasicMaterial({
          color: valid ? 0x7fcf93 : 0xe0705b,
          transparent: true,
          opacity: 0.18,
          depthWrite: false,
        }),
      )
      mesh.position.set(
        (band.minX + band.maxX) / 2,
        isWall ? WALL_Y : FEET_Y + 0.15,
        isWall ? -0.05 : 0.02,
      )
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

    bounds(id) {
      const item = items.find((entry) => entry.placement.id === id)
      if (!item) return null
      return { x: item.mesh.position.x, top: item.baseY + item.height / 2, bottom: item.baseY - item.height / 2 }
    },

    update(now) {
      for (const [id, startedAt] of bouncing) {
        const item = items.find((entry) => entry.placement.id === id)
        const t = (now - startedAt) / BOUNCE_MS
        if (!item) {
          bouncing.delete(id)
          continue
        }
        const { x, y } = settle(Math.min(1, t))
        const flip = item.placement.flip ? -1 : 1
        item.mesh.scale.set(x * flip, y, 1)
        // Squash from the base, so a floor item stays standing on the floor.
        item.mesh.position.y = item.baseY - (item.height * (1 - y)) / 2
        if (t >= 1) bouncing.delete(id)
      }
      if (bandMesh) (bandMesh.material as THREE.MeshBasicMaterial).opacity = 0.14 + Math.sin(now / 260) * 0.06
      if (outline) (outline.material as THREE.LineDashedMaterial).opacity = 0.7 + Math.sin(now / 200) * 0.25
    },

    dispose() {
      clear()
      dropHelper(ghostMesh)
      dropHelper(shadowMesh)
      dropHelper(bandMesh)
      dropHelper(outline)
      scene.remove(helpers)
      scene.remove(group)
    },
  }
}
