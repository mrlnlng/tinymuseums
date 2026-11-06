import * as THREE from 'three'
import type { Placement, ThemeSpec } from '@tiny/core'
import { THEMES } from '@tiny/core/rooms'
import manifest from '@/generated/asset-manifest.json'
import { CONFIG } from '@/features/hall/scene/config'
import { builtUrl } from '@/shared/lib/assets'

type AtelierImage = keyof typeof manifest.atelier

export interface CozyArt {
  wall: THREE.Texture
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
const ROOM_LEFT = 0.28
const ROOM_RIGHT = 13.72
const WALL_TILE = CONFIG.atelier.wall.tile
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

function sourceFor(ref: string): { image: AtelierImage } | { url: string } | { fish: string } | null {
  const image = ATELIER_PROPS[ref]
  if (image) return { image }
  if (ref === 'cat') return { url: CAT_URL }
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

/** A fish trophy on a small wooden plaque; the room has no art for these. */
function fishTexture(ref: string): THREE.Texture {
  const colors = FISH[ref]
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 192
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('A fish trophy could not be drawn.')

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

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  return texture
}

export async function loadCozyArt(): Promise<CozyArt> {
  const [wall, floor, props] = await Promise.all([
    loadTexture(builtUrl(manifest.atelier.wallpaper.src)),
    loadTexture(builtUrl(manifest.images.floor.x2.src)),
    Promise.all(
      Object.keys(THEMES.cozy.props).map(async (ref) => {
        const source = sourceFor(ref)
        if (!source) return null
        const texture = 'image' in source
          ? await loadTexture(builtUrl(manifest.atelier[source.image].src))
          : 'url' in source
            ? await loadTexture(builtUrl(source.url))
            : fishTexture(source.fish)
        return [ref, texture] as const
      }),
    ),
  ])
  return {
    wall,
    floor,
    props: Object.fromEntries(props.filter((entry): entry is readonly [string, THREE.Texture] => entry !== null)),
  }
}

export function disposeCozyArt(art: CozyArt): void {
  art.wall.dispose()
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


export function cozyZoneAnchor(zone: string): number {
  return zone === 'wall' ? WALL_Y : FEET_Y
}

export interface CozyBackdrop {
  dispose(): void
}

export function createCozyBackdrop(scene: THREE.Scene, art: CozyArt): CozyBackdrop {
  const span = ROOM_RIGHT - ROOM_LEFT + BACKDROP_OVERHANG * 2
  const centerX = (ROOM_LEFT + ROOM_RIGHT) / 2
  const wallAspect = manifest.atelier.wallpaper.width / manifest.atelier.wallpaper.height
  const floorAspect = manifest.images.floor.x2.w / manifest.images.floor.x2.h

  art.wall.wrapS = THREE.RepeatWrapping
  art.wall.wrapT = THREE.RepeatWrapping
  art.wall.repeat.set(span / WALL_TILE, WALL_HEIGHT / (WALL_TILE / wallAspect))
  art.floor.wrapS = THREE.RepeatWrapping
  art.floor.repeat.set(span / (FLOOR_HEIGHT * floorAspect), 1)

  const group = new THREE.Group()
  const wall = new THREE.Mesh(
    new THREE.PlaneGeometry(span, WALL_HEIGHT),
    new THREE.MeshBasicMaterial({ map: art.wall }),
  )
  wall.position.set(centerX, FEET_Y + WALL_HEIGHT / 2, -0.5)
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(span, FLOOR_HEIGHT),
    new THREE.MeshBasicMaterial({ map: art.floor }),
  )
  floor.position.set(centerX, FEET_Y - FLOOR_HEIGHT / 2, -0.4)
  group.add(wall, floor)
  scene.add(group)

  return {
    dispose() {
      scene.remove(group)
      for (const mesh of [wall, floor]) {
        mesh.geometry.dispose()
        ;(mesh.material as THREE.Material).dispose()
      }
    },
  }
}

export interface PlacementLayer {
  set(placements: Placement[]): void
  pick(raycaster: THREE.Raycaster): Placement | null
  ghost(placement: Placement | null): void
  highlight(zone: string | null, valid: boolean): void
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

export function createPlacementLayer<Art>(
  scene: THREE.Scene,
  art: Art,
  theme: PlacementTheme<Art>,
): PlacementLayer {
  const group = new THREE.Group()
  scene.add(group)
  const helpers = new THREE.Group()
  scene.add(helpers)
  let items: { mesh: THREE.Mesh; placement: Placement }[] = []
  let ghostMesh: THREE.Mesh | null = null
  let bandMesh: THREE.Mesh | null = null

  function dropMesh(mesh: THREE.Mesh | null): void {
    if (!mesh) return
    helpers.remove(mesh)
    mesh.geometry.dispose()
    ;(mesh.material as THREE.Material).dispose()
  }

  function clear(): void {
    for (const { mesh } of items) {
      group.remove(mesh)
      mesh.geometry.dispose()
      ;(mesh.material as THREE.Material).dispose()
    }
    items = []
  }

  return {
    set(placements) {
      clear()
      for (const placement of placements) {
        const prop = theme.spec.props[placement.ref]
        const texture = theme.propImage(placement.ref, art)
        if (!prop || !texture) continue
        const width = prop.width
        const height = width / aspectOf(texture)
        const mesh = new THREE.Mesh(
          new THREE.PlaneGeometry(width, height),
          new THREE.MeshBasicMaterial({ map: texture, transparent: true }),
        )
        mesh.position.set(
          placement.x,
          theme.zoneY(placement.zone, height, placement.ref),
          depthFor(placement.zone, placement.ref, width),
        )
        mesh.userData.placement = placement
        group.add(mesh)
        items.push({ mesh, placement })
      }
    },

    pick(raycaster) {
      const hit = raycaster.intersectObjects(items.map((item) => item.mesh), false)[0]
      return hit ? (hit.object.userData.placement as Placement | undefined) ?? null : null
    },

    ghost(placement) {
      dropMesh(ghostMesh)
      ghostMesh = null
      if (!placement) return
      const prop = theme.spec.props[placement.ref]
      const texture = theme.propImage(placement.ref, art)
      if (!prop || !texture) return
      const width = prop.width
      const height = width / aspectOf(texture)
      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(width, height),
        new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity: 0.62, depthWrite: false }),
      )
      mesh.position.set(
        placement.x,
        theme.zoneY(placement.zone, height, placement.ref),
        depthFor(placement.zone, placement.ref, width) + 0.05,
      )
      helpers.add(mesh)
      ghostMesh = mesh
    },

    highlight(zone, valid) {
      dropMesh(bandMesh)
      bandMesh = null
      if (!zone) return
      const band = theme.spec.zones[zone]
      if (!band) return
      const isWall = zone === 'wall'
      const bandHeight = isWall ? 4.6 : 2.4
      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(band.maxX - band.minX, bandHeight),
        new THREE.MeshBasicMaterial({
          color: valid ? 0x69b97c : 0xd45b45,
          transparent: true,
          opacity: 0.2,
          depthWrite: false,
        }),
      )
      mesh.position.set(
        (band.minX + band.maxX) / 2,
        isWall ? WALL_Y : FEET_Y - bandHeight / 2,
        isWall ? -0.05 : 0.12,
      )
      helpers.add(mesh)
      bandMesh = mesh
    },

    dispose() {
      clear()
      dropMesh(ghostMesh)
      dropMesh(bandMesh)
      ghostMesh = null
      bandMesh = null
      scene.remove(helpers)
      scene.remove(group)
    },
  }
}
