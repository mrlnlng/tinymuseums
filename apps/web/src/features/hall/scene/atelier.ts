import * as THREE from 'three'
import { itemIdFor } from '@tiny/core/economy'
import manifest from '@/generated/asset-manifest.json'
import { builtUrl } from '@/shared/lib/assets'
import { plane } from './board'
import { CONFIG } from './config'
import { createGalleryDoor, GALLERY_DOOR } from './gallery-door'
import { pickPainted } from './hit'
import { placeLabel, type Viewport } from './overlay'
import type { SpotPainting } from '@tiny/core'
import type { CharacterKind } from './rig'
import { ATELIER_ROOMS, ROOM_TEMPLATE, SWAG_START, SWAG_STEP, type CollectionRoom, type FormSpot, type PlacedRoom } from './atelier-layout'
import { CARDIGANS, COSTUMES, HIBISCUS } from './wardrobe'
import { MIRROR_KINDS } from './mirror'
import { pieceUrl } from './piece-art'

// Reused each frame for placing the room's buttons, instead of a new vector per button per frame.
const projected = new THREE.Vector3()

const { atelier } = CONFIG
const { mock } = atelier
type AtelierImage = keyof typeof manifest.atelier
export type AtelierArt = Record<AtelierImage, THREE.Texture>

/** Mock pixels to world units. */
const wx = (px: number) => (px - mock.originX) / mock.unit
const wy = (py: number) => (mock.floorY - py) / mock.unit + mock.floorWorld
const units = (px: number) => px / mock.unit
/** Tall enough for the tallest phone's view, as the hall's wall is. */
const WALL_HEIGHT = 12
const aspectOf = (name: AtelierImage) => manifest.atelier[name].width / manifest.atelier[name].height

function load(url: string): Promise<THREE.Texture> {
  return new THREE.TextureLoader().loadAsync(url).then((texture) => {
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = 4
    return texture
  })
}

/** Everything the atelier draws; a failure frees whatever did load. */
export async function loadAtelierArt(): Promise<AtelierArt> {
  const names = Object.keys(manifest.atelier) as AtelierImage[]
  const settled = await Promise.allSettled(names.map((name) => load(builtUrl(manifest.atelier[name].src))))
  const failed = settled.find((result) => result.status === 'rejected')
  if (failed) {
    for (const result of settled) if (result.status === 'fulfilled') result.value.dispose()
    throw failed.reason
  }
  return Object.fromEntries(names.map((name, i) => [name, (settled[i] as PromiseFulfilledResult<THREE.Texture>).value])) as AtelierArt
}

export function disposeAtelierArt(art: AtelierArt): void {
  for (const texture of Object.values(art)) texture.dispose()
}

/** A costume id worn in one of the outfit's two places. */
export interface ClothingItem {
  slot: 'costume' | 'bow'
  id: string
}

type Cardigan = (typeof CARDIGANS)[number]
const CARDIGAN_NAMES: Record<Cardigan, string> = {
  'cardigan-red': 'red',
  'cardigan-forest-green': 'forest green',
  'cardigan-navy-blue': 'navy blue',
  'cardigan-butter-yellow': 'butter yellow',
}
const isCardigan = (id: string | null): id is Cardigan => (CARDIGANS as readonly (string | null)[]).includes(id)
export const CHARACTER_NAMES: Record<CharacterKind, string> = { bunny: 'the bunny', cat: 'Jiji', otter: 'the otter', bruce: 'Bruce' }

export function itemName({ slot, id }: ClothingItem): string {
  if (isCardigan(id)) return `The ${CARDIGAN_NAMES[id]} cardigan`
  if (id === 'blue-floral') return 'The blue floral dress'
  if (id === 'floral-cardigan') return 'The floral dress and cardigan'
  if (id === 'flower-crown') return 'The flower crown'
  if (id === 'gold-sequin') return 'The gold sequin set'
  if (id === 'gold-cape') return 'The gold sequin set and cape'
  if ((HIBISCUS as readonly string[]).includes(id)) return `The ${id.slice('hibiscus-'.length)} hibiscus`
  if (id === 'blue-cap') return 'The blue cap'
  if (id === 'daisy-clip') return 'The daisy clip'
  if (id === 'tutu') return "Bruce's tutu"
  return slot === 'bow' ? "Kiki's bow" : "Kiki's dress"
}

export function keepName(item: ClothingItem): string {
  const name = itemName(item)
  return name.startsWith('The ') ? name.slice(4) : name
}

export interface AtelierActions {
  onItem(item: ClothingItem): void
  /** The visitor tapped the wardrobe: the closet opens. */
  onWardrobe(): void
  /** The visitor tapped the mirror's glass. */
  onMirror(): void
  onLeave(door: string): void
}

export interface AtelierRoom {
  /** The fashion area's rooms, in world units, joined wall to wall. */
  readonly rooms: readonly { key: string; label: string; startX: number; endX: number }[]
  /** Builds one room's displays; the returned function takes them down again. */
  buildRoom(key: string): () => void
  setActions(actions: AtelierActions): void
  /** The door under the pointer, if any. */
  hitTestDoor(raycaster: THREE.Raycaster): string | null
  hitTestItem(raycaster: THREE.Raycaster): ClothingItem | null
  /** Whether the mirror's glass is under the pointer. */
  hitTestMirror(raycaster: THREE.Raycaster): boolean
  /** Whether the wardrobe is under the pointer. */
  hitTestWardrobe(raycaster: THREE.Raycaster): boolean
  /** Opens the wardrobe's doors while the closet is up, and shuts them after. */
  setWardrobeOpen(open: boolean): void
  /** What the visitor wears; a worn piece leaves its stand bare. */
  setWorn(costume: string | null, bow: string | null): void
  /** The member's owned catalog ids, or null while their wallet is still loading. */
  setOwned(items: readonly string[] | null): void
  /** Who the visitor is; the mirror reflects them and lights their gem. */
  setVisitor(kind: CharacterKind): void
  /** The mirror's glass in world units, while the entrance is built. */
  mirrorGlass(): { left: number; right: number; top: number; bottom: number } | null
  /** The mirror has been opened, so its glint can rest. */
  markMirrorSeen(): void
  /**
   * Sends each unkept thing from the visitor (`from`, in page pixels) back to where it lives: a
   * costume to the wardrobe or its form, a headpiece to its stand, a character into the mirror.
   * Returns how long the flight takes, 0 when there is nothing to show.
   */
  flyHome(things: readonly { part: 'character' | 'costume' | 'bow'; id: string }[], from: DOMRect): number
  sync(camera: THREE.OrthographicCamera, viewport: Viewport, enabled: boolean): void
  update(dt: number, visitorX: number): void
  dispose(): void
}

type Painted = THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>
type Spot = { x: number; y: number; width: number }
interface Control { node: HTMLElement; mark: { x: number; y: number; width: number }; font: number }

/** A piece on a form or a cushion: shown on its stand until worn, then its stand gives it back. */
interface Piece {
  item(): ClothingItem
  wornBy(costume: string | null, bow: string | null): boolean
  /** Drawn on the stand while it is there to try on. */
  meshes: Painted[]
  /** What a tap on the empty stand hits, to give the piece back. */
  bare: Painted[]
  button: HTMLButtonElement
  target: number
  shown: number
}

interface BuiltRoom {
  pieces: Piece[]
  glints: { node: HTMLDivElement; shown: () => boolean }[]
  /** The wardrobe's body, where a tap opens or closes it. */
  wardrobe?: Painted
  /** The mirror, whose glass a tap opens. */
  mirror?: Painted
  refresh(): void
  dispose?(): void
}

type Own = (spot: Spot, node: HTMLElement, font: number) => Control

export interface AtelierDoor {
  id: string
  x: number
  label: string
  scale: number
  image: HTMLImageElement
}

export function createAtelierRoom(
  scene: THREE.Scene,
  art: AtelierArt,
  host: HTMLElement,
  doors: readonly AtelierDoor[],
  spots: Readonly<Record<string, SpotPainting>> = {},
): AtelierRoom {
  const shell = new THREE.Group()
  scene.add(shell)
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  /** A picture by its centre and width in mock px. */
  function picture(group: THREE.Group, name: AtelierImage, spot: { x: number; y: number; width: number; z: number }): Painted {
    const width = units(spot.width)
    const mesh = plane(width, width / aspectOf(name), art[name], wx(spot.x), wy(spot.y), spot.z) as Painted
    group.add(mesh)
    return mesh
  }

  /** A picture standing on the floor at mock px x, its foot at mock px y. */
  function standing(group: THREE.Group, name: AtelierImage, x: number, footY: number, height: number, z: number): Painted {
    const h = units(height)
    const mesh = plane(h * aspectOf(name), h, art[name], wx(x), wy(footY) + h / 2, z) as Painted
    group.add(mesh)
    return mesh
  }

  const { wall } = atelier
  const wallHeight = WALL_HEIGHT
  const wallMap = art.wallpaper
  wallMap.wrapS = THREE.RepeatWrapping
  wallMap.wrapT = THREE.RepeatWrapping
  wallMap.repeat.set((wall.right - wall.left) / wall.tile, wallHeight / (wall.tile / aspectOf('wallpaper')))
  const wallMesh = new THREE.Mesh(new THREE.PlaneGeometry(wall.right - wall.left, wallHeight), new THREE.MeshBasicMaterial({ map: wallMap }))
  wallMesh.position.set((wall.left + wall.right) / 2, mock.floorWorld + wallHeight / 2, -0.5)
  shell.add(wallMesh)

  const carpetHeight = atelier.carpet.height
  const carpetMap = art.carpet
  carpetMap.wrapS = THREE.RepeatWrapping
  carpetMap.repeat.set((wall.right - wall.left) / (carpetHeight * aspectOf('carpet')), 1)
  const carpet = new THREE.Mesh(new THREE.PlaneGeometry(wall.right - wall.left, carpetHeight), new THREE.MeshBasicMaterial({ map: carpetMap }))
  carpet.position.set((wall.left + wall.right) / 2, mock.floorWorld - carpetHeight / 2, 0.15)
  shell.add(carpet)
  const carpetDepth = atelier.carpet.depth - carpetHeight
  const carpetFill = new THREE.Mesh(new THREE.PlaneGeometry(wall.right - wall.left, carpetDepth), new THREE.MeshBasicMaterial({ color: atelier.carpet.color }))
  carpetFill.position.set((wall.left + wall.right) / 2, mock.floorWorld - carpetHeight - carpetDepth / 2 + 0.01, 0.14)
  shell.add(carpetFill)

  const doorMeshes = doors.map((door) => ({ door, mesh: createGalleryDoor(shell, door.image, door.x, GALLERY_DOOR.lobbyBase, door.scale) }))

  const { curtains } = atelier
  const curtainWidth = units(curtains.width)
  const curtainHeight = curtainWidth / aspectOf('curtains')
  shell.add(plane(curtainWidth, curtainHeight, art.curtains, wx(curtains.left) + curtainWidth / 2, atelier.ceiling - curtainHeight / 2, curtains.z))

  const { curtainDrape, curtainSwags } = atelier
  const drapeWidth = units(curtainDrape.width)
  const drapeHeight = drapeWidth / aspectOf('curtainDrape')
  // The drape closes the far end at the screen's edge, so sync() places it once the view's width is known.
  const drape = plane(drapeWidth, drapeHeight, art.curtainDrape, atelier.max, atelier.ceiling - drapeHeight / 2, curtainDrape.z)
  drape.scale.x = -1
  shell.add(drape)
  let drapeForHalf = -1
  const drapeRight = atelier.max + curtainDrape.widestHalf

  const swagWidth = units(curtainSwags.width)
  const swagHeight = swagWidth / aspectOf('curtainSwag')
  const swagStep = swagWidth - units(curtainSwags.overlap)
  const swagsFrom = wx(curtains.left) + curtainWidth - units(curtainSwags.overlap)
  const swagsTo = drapeRight - drapeWidth + units(curtainSwags.overlap)
  // The swags run on behind the drape to where the widest screen ends.
  const swagAnchor = wx(curtainSwags.startX)
  const firstSwag = swagAnchor - Math.ceil((swagAnchor - swagsFrom) / swagStep) * swagStep
  // The shell hangs the entrance's swags; each collection room hangs its own from its left wall.
  const entranceEnd = wx(ATELIER_ROOMS[1].startX)
  for (let left = firstSwag; left < entranceEnd; left += swagStep) {
    shell.add(plane(swagWidth, swagHeight, art.curtainSwag, left + swagWidth / 2, wy(curtainSwags.top) - swagHeight / 2, curtainSwags.z))
  }
  // Tall screens see above the swags; their top band carries on in its own colour.
  // It sits in front by a few pixels, over the art's lighter top rows.
  const bandBottom = wy(curtainSwags.top) - 0.025
  const bandTop = atelier.ceiling + 2
  const band = new THREE.Mesh(new THREE.PlaneGeometry(swagsTo - firstSwag, bandTop - bandBottom), new THREE.MeshBasicMaterial({ color: 0x951806 }))
  band.position.set((firstSwag + swagsTo) / 2, (bandTop + bandBottom) / 2, curtainSwags.z + 0.001)
  shell.add(band)
  // Left of the swags the same band starts at the ceiling the entrance's curtain hangs from.
  const lintel = new THREE.Mesh(new THREE.PlaneGeometry(firstSwag - wall.left, bandTop - atelier.ceiling), new THREE.MeshBasicMaterial({ color: 0x951806 }))
  lintel.position.set((wall.left + firstSwag) / 2, (bandTop + atelier.ceiling) / 2, curtainSwags.z + 0.001)
  shell.add(lintel)

  // Overlay nodes, placed each frame; a room's own come and go with it.
  const controls: Control[] = []
  function place(node: HTMLElement, spot: Spot, font: number): Control {
    host.append(node)
    const control = { node, mark: { x: wx(spot.x), y: wy(spot.y), width: units(spot.width) }, font }
    controls.push(control)
    return control
  }
  function unplace(owned: Control[]): void {
    for (const control of owned) {
      control.node.remove()
      const i = controls.indexOf(control)
      if (i >= 0) controls.splice(i, 1)
    }
  }

  let actions: AtelierActions | null = null
  // The door itself is the way out; this unseen button over it lets keyboards and screen readers leave too.
  const doorGlows = doors.map(({ id, x, label, scale, image }) => {
    const aspect = image.naturalWidth / image.naturalHeight
    const height = GALLERY_DOOR.height * scale
    const at = { x: mock.originX + x * mock.unit, y: mock.floorY - (height / 2) * mock.unit }
    const exit = document.createElement('button')
    exit.type = 'button'
    exit.className = 'atelier-item atelier-exit'
    exit.setAttribute('aria-label', label)
    exit.style.aspectRatio = String(aspect)
    exit.addEventListener('click', () => actions?.onLeave(id))
    place(exit, { ...at, width: height * aspect * mock.unit }, 0.12)
    // The door's fairy lights breathe so it reads as the way out from across the room, and brighten close by.
    const glow = document.createElement('div')
    glow.className = 'atelier-door-glow'
    glow.setAttribute('aria-hidden', 'true')
    glow.style.aspectRatio = String(aspect)
    place(glow, { ...at, width: height * aspect * mock.unit * 1.15 }, 0.12)
    return { x, glow }
  })
  let lastCamera: THREE.OrthographicCamera | null = null
  let lastViewport: Viewport | null = null

  // What the visitor wears, owns and is; each room reads these when it is built.
  let worn: string | null = null
  let wornBow: string | null = null
  let reflected = false
  let owned: Set<string> | null = null
  let visitorKind: CharacterKind | null = null
  // The wardrobe stays open or closed as left, even once the entrance is rebuilt.
  let wardrobeOpen = false

  const built = new Map<string, BuiltRoom>()
  const teardowns = new Map<string, () => void>()
  const placed = new Map(ATELIER_ROOMS.map((room) => [room.key, room]))

  /** What every room builds its displays with: buttons, price tags, glints, and pieces to try on. */
  function roomKit(group: THREE.Group, own: Own) {
    const pieces: Piece[] = []
    const glints: BuiltRoom['glints'] = []
    const cleanup: (() => void)[] = []
    const refreshers: (() => void)[] = []

    function button(label: string, className: string, spot: Spot, click: () => void): HTMLButtonElement {
      const node = document.createElement('button')
      node.type = 'button'
      node.className = className
      node.setAttribute('aria-label', label)
      node.addEventListener('click', click)
      own(spot, node, 0.09)
      return node
    }
    // A few small stars twinkle over each piece still on its stand, and over each portrait.
    function glint(spot: Spot, aspect: number, shown: () => boolean): Control {
      const node = document.createElement('div')
      node.className = 'atelier-glint'
      node.setAttribute('aria-hidden', 'true')
      node.style.aspectRatio = String(aspect)
      const seed = (spot.x * 0.013) % 2.6
      for (const [x, y, size] of [[16, 20, 1], [84, 38, 0.75], [30, 82, 0.6]]) {
        const star = document.createElement('span')
        star.style.left = `${x}%`
        star.style.top = `${y}%`
        star.style.setProperty('--size', String(size))
        star.style.animationDelay = `${-((seed + x * 0.031) % 2.6).toFixed(2)}s`
        node.append(star)
      }
      const control = own(spot, node, 0.1)
      glints.push({ node, shown })
      return control
    }

    /** A small gold seal on a piece the member has kept, in place of the price it no longer needs. */
    function seal(spot: Spot, itemId: string, shown: () => boolean = () => true): void {
      const node = document.createElement('div')
      node.className = 'atelier-seal'
      node.setAttribute('aria-hidden', 'true')
      own(spot, node, 0.1)
      glints.push({ node, shown: () => owned !== null && owned.has(itemId) && shown() })
    }

    function refresh(): void {
      for (const piece of pieces) {
        const wearing = piece.wornBy(worn, wornBow)
        piece.target = wearing ? 0 : 1
        piece.button.setAttribute('aria-pressed', String(wearing))
        piece.button.setAttribute('aria-label', `${wearing ? 'Return' : 'Try on'} ${itemName(piece.item()).toLowerCase()}`)
      }
      for (const fn of refreshers) fn()
    }

    return {
      pieces, button, glint, seal,
      onRefresh: (fn: () => void) => { refreshers.push(fn) },
      onDispose: (fn: () => void) => { cleanup.push(fn) },
      built: (extra: { wardrobe?: Painted; mirror?: Painted } = {}): BuiltRoom => ({ pieces, glints, ...extra, refresh, dispose: () => { for (const fn of cleanup) fn() } }),
    }
  }

  /** The wardrobe at the entrance's end. A tap opens the closet; its doors stand open while it is up. */
  function buildWardrobe(group: THREE.Group, kit: ReturnType<typeof roomKit>): Painted {
    const { wardrobe } = atelier
    const W = wardrobe.width
    const H = W / aspectOf('wardrobeOpen')
    const top = wardrobe.bottomY - H
    const body = plane(units(W), units(H), art.wardrobeClosed, wx(wardrobe.x), wy(top + H / 2), wardrobe.z) as Painted
    group.add(body)
    kit.button('Open the closet', 'atelier-item atelier-wardrobe', { x: wardrobe.x, y: top + H / 2, width: W * 0.92 }, () => actions?.onWardrobe())
    kit.glint({ x: wardrobe.x, y: top + wardrobe.handles.y * H, width: wardrobe.handles.width }, 1.4, () => !wardrobeOpen)
    kit.onRefresh(() => { body.material.map = wardrobeOpen ? art.wardrobeOpen : art.wardrobeClosed })
    return body
  }

  /**
   * The dressing mirror. Four gems along its frame show the characters, the visitor's lit; the
   * visitor's live reflection is drawn over its glass by the room. It glints until first opened.
   */
  function buildMirror(group: THREE.Group, kit: ReturnType<typeof roomKit>): Painted {
    const { mirror: spec } = atelier
    const H = spec.height
    const W = H * aspectOf('mirror')
    const top = spec.bottomY - H
    const body = standing(group, 'mirror', spec.x, spec.bottomY, H, spec.z)
    const glassWidth = (glass.right - glass.left) * W
    const glassX = spec.x - W / 2 + (glass.left + glass.right) / 2 * W

    // The gems: a small painted strip, redrawn when the visitor changes or keeps a character.
    const gemCanvas = document.createElement('canvas')
    gemCanvas.width = 256
    gemCanvas.height = 64
    const gemMap = new THREE.CanvasTexture(gemCanvas)
    gemMap.colorSpace = THREE.SRGBColorSpace
    const gemWidth = W * spec.gems.width
    const gems = plane(units(gemWidth), units(gemWidth / 4), gemMap, wx(spec.x), wy(top + spec.gems.y * H), spec.z + 0.003) as Painted
    gems.material.transparent = true
    group.add(gems)
    function paintGems(): void {
      const paint = gemCanvas.getContext('2d')!
      paint.clearRect(0, 0, 256, 64)
      MIRROR_KINDS.forEach((kind, i) => {
        const x = 32 + i * 64
        const lit = kind === visitorKind
        paint.beginPath()
        paint.arc(x, 32, lit ? 20 : 15, 0, Math.PI * 2)
        paint.fillStyle = lit ? '#ffd9ec' : '#7a1f3a'
        paint.shadowColor = lit ? '#ffe7a3' : 'transparent'
        paint.shadowBlur = lit ? 16 : 0
        paint.fill()
        paint.shadowBlur = 0
        paint.lineWidth = 5
        paint.strokeStyle = '#d9a441'
        paint.stroke()
      })
      gemMap.needsUpdate = true
    }

    kit.button('Look in the mirror', 'atelier-item atelier-mirror', { x: glassX, y: top + (glass.top + glass.bottom) / 2 * H, width: glassWidth }, () => actions?.onMirror())
    kit.glint({ x: spec.x, y: top + H * 0.3, width: W * 0.8 }, 0.8, () => !mirrorSeen)
    kit.onRefresh(paintGems)
    kit.onDispose(() => {
      gemMap.dispose()
    })
    return body
  }

  function buildEntrance(group: THREE.Group, own: Own): BuiltRoom {
    for (const name of ['shelf', 'cabinet', 'jewelryBox', 'perfume'] as const) {
      picture(group, name, atelier[name])
    }
    const title = document.createElement('div')
    title.className = 'atelier-title'
    title.textContent = 'The Costume Atelier'
    own(atelier.title, title, 0.088)
    const plaque = document.createElement('p')
    plaque.className = 'atelier-plaque'
    plaque.textContent = "Costumes that inspired the works of Tiny Museum's permanent collection, presented here to be worn."
    own(atelier.plaque, plaque, 0.058)
    // Every accessory lives in the closet now; the cabinet keeps only its jewelry box and perfume.
    const kit = roomKit(group, own)
    return kit.built({ wardrobe: buildWardrobe(group, kit), mirror: buildMirror(group, kit) })
  }

  function buildCollection(room: PlacedRoom & { collection: CollectionRoom; centerX: number }, group: THREE.Group, own: Own): BuiltRoom {
    const { collection } = room
    const C = room.centerX
    const T = ROOM_TEMPLATE
    const kit = roomKit(group, own)
    const { pieces, button, glint } = kit

    // A frame the owner has filled shows that painting, cropped to fill the frame's opening;
    // the placeholder shows until it loads, or if it cannot.
    let alive = true
    const loaded: THREE.Texture[] = []
    function hang(mesh: Painted, spotId: string): void {
      const painting = spots[spotId]
      if (!painting) return
      const opening = mesh.geometry.parameters.width / mesh.geometry.parameters.height
      new THREE.TextureLoader().loadAsync(painting.imageUrl).then((texture) => {
        if (!alive) {
          texture.dispose()
          return
        }
        texture.colorSpace = THREE.SRGBColorSpace
        texture.anisotropy = 4
        const ratio = painting.width / painting.height
        if (ratio > opening) {
          texture.repeat.set(opening / ratio, 1)
          texture.offset.set((1 - opening / ratio) / 2, 0)
        } else {
          texture.repeat.set(1, ratio / opening)
          texture.offset.set(0, (1 - ratio / opening) / 2)
        }
        loaded.push(texture)
        mesh.material.map = texture
        mesh.material.needsUpdate = true
      }).catch(() => {})
    }

    // The tag hangs from under the curtain, lit from above.
    const tag = { x: C + T.tag.dx, y: T.tag.y, width: T.tag.width, z: T.tag.z }
    picture(group, collection.tagImage, tag)
    if (collection.tagImage === 'tagBlank') {
      const name = document.createElement('div')
      name.className = 'atelier-tag-name'
      name.textContent = collection.title
      own({ x: tag.x, y: tag.y + T.tagText.dy, width: T.tagText.width }, name, 0.088)
    }
    const spotlightHeight = units(atelier.spotlight.height)
    const light = plane(spotlightHeight * aspectOf('spotlight'), spotlightHeight, art.spotlight,
      wx(C + T.spotlight.dx), wy(T.spotlight.top) - spotlightHeight / 2, atelier.spotlight.z)
    ;(light.material as THREE.MeshBasicMaterial).depthWrite = false
    group.add(light)

    // The curtain over this room, overlapping its neighbours'; the last room's runs on behind the drape.
    const index = ATELIER_ROOMS.indexOf(room)
    const swagsEnd = index === ATELIER_ROOMS.length - 1 ? swagsTo : wx(room.endX)
    for (let left = wx(room.startX + SWAG_START - SWAG_STEP); left < swagsEnd; left += swagStep) {
      group.add(plane(swagWidth, swagHeight, art.curtainSwag, left + swagWidth / 2, wy(curtainSwags.top) - swagHeight / 2,
        curtainSwags.z - 0.002 * (1 + (index % 2))))
    }

    // The walls stand out by the room's spread, so two forms fit between them.
    const out = room.spread
    const { leftFrame, rightFrame } = T
    if (collection.left.framed) {
      picture(group, collection.left.painting as AtelierImage, { x: C + leftFrame.dx - out, ...collection.left.framed, z: 0.2 })
    } else {
      const spot = { x: C + leftFrame.dx - out, y: leftFrame.y }
      hang(picture(group, collection.left.painting as AtelierImage, { ...spot, width: leftFrame.width * leftFrame.fill, z: 0.19 }), `${collection.key}.left`)
      picture(group, 'bruceFrameBlue', { ...spot, width: leftFrame.width, z: 0.2 })
    }
    const rightSpot = { x: C + rightFrame.dx + out, y: rightFrame.y }
    hang(picture(group, collection.right.painting as AtelierImage, { ...rightSpot, width: rightFrame.width * rightFrame.fill, z: 0.19 }), `${collection.key}.right`)
    picture(group, 'bruceFrameCream', { ...rightSpot, width: rightFrame.width, z: 0.2 })

    const { mannequin } = atelier
    const unit = units(mannequin.height) / mannequin.canvas.form[1]
    const canvasWidth = (mannequin.canvas.form[0] + 2 * mannequin.canvas.padX) * unit
    const canvasHeight = (mannequin.canvas.form[1] + mannequin.canvas.padTop) * unit
    const platform = atelier.platformBlue

    function form(spot: FormSpot, x: number): void {
      const bare = plane(canvasWidth, canvasHeight, art[spot.base], wx(x), wy(mannequin.feetY) + canvasHeight / 2, mannequin.z) as Painted
      group.add(bare)
      const pw = units(platform.width)
      group.add(plane(pw, pw / aspectOf('platformBlue'), art.platformBlue, wx(x), wy(platform.y), platform.z))
      if (collection.flowers) picture(group, 'flowerBush', { ...atelier.bush, x: x + atelier.bush.dx })
      const dress = plane(canvasWidth, canvasHeight, art[spot.image as AtelierImage], bare.position.x, bare.position.y, mannequin.z + 0.01) as Painted
      dress.material.depthWrite = false
      group.add(dress)
      const meshes = [dress]
      if (spot.broom) meshes.push(picture(group, 'broom', { ...atelier.broom, x: x + atelier.broom.dx }))
      const item: ClothingItem = { slot: 'costume', id: spot.costume }
      const node = button('', 'atelier-item atelier-item-dress', { x, y: 330, width: 210 }, () => actions?.onItem(item))
      const piece: Piece = {
        item: () => item,
        wornBy: (costume) => costume === spot.costume,
        meshes,
        bare: [bare],
        button: node,
        target: 1,
        shown: 1,
      }
      pieces.push(piece)
      glint({ x, y: 300, width: 210 }, 0.95, () => piece.target > 0)
      kit.seal({ x: x + 70, y: 200, width: 30 }, itemIdFor('costume', spot.costume), () => piece.target > 0)
    }
    const formDx = collection.forms.length === 2 ? T.pair.formDx : 0
    collection.forms.forEach((spot, i) => form(spot, C + (i === 0 ? -formDx : formDx)))

    const { pillar } = collection
    const pillarX = C + T.pillar.dx + out
    standing(group, 'column', pillarX, atelier.column.bottomY, atelier.column.height, atelier.column.z)
    picture(group, pillar.pillow.image, { x: pillarX, y: pillar.pillow.y, width: pillar.pillow.width, z: 0.34 })
    // The cushion's flowers are Bruce's own decoration; they are tried on from the closet.
    for (const spot of pillar.pieces) {
      picture(group, spot.image as AtelierImage, { x: pillarX + spot.dx, y: spot.y, width: spot.width, z: 0.36 }).rotation.z = spot.rotation
    }

    const portrait = collection.portrait
    const portraitSpot = { x: C + T.portrait.dx + out, y: T.portrait.y, width: portrait.width }
    picture(group, collection.ribbon, { ...T.ribbon, x: C + T.ribbon.dx + out })
    picture(group, portrait.image as AtelierImage, { ...portraitSpot, z: T.portrait.z })

    const contents = kit.built()
    return {
      ...contents,
      dispose() {
        alive = false
        for (const texture of loaded) texture.dispose()
        contents.dispose?.()
      },
    }
  }

  function buildRoom(key: string): () => void {
    const room = placed.get(key)
    if (!room || built.has(key)) return () => {}
    const group = new THREE.Group()
    const owned: Control[] = []
    const own: Own = (spot, node, font) => {
      const control = place(node, spot, font)
      owned.push(control)
      return control
    }
    const contents = room.collection && room.centerX !== null
      ? buildCollection(room as PlacedRoom & { collection: CollectionRoom; centerX: number }, group, own)
      : buildEntrance(group, own)
    contents.refresh()
    // A room built mid-visit opens as things stand, not as a change to animate.
    for (const piece of contents.pieces) {
      piece.shown = piece.target
      for (const mesh of piece.meshes) { mesh.material.opacity = piece.shown; mesh.visible = piece.shown > 0.01 }
    }
    shell.add(group)
    built.set(key, contents)
    const teardown = () => {
      if (built.get(key) !== contents) return
      built.delete(key)
      teardowns.delete(key)
      contents.dispose?.()
      unplace(owned)
      shell.remove(group)
      group.traverse((node) => {
        if (!(node instanceof THREE.Mesh)) return
        node.geometry.dispose()
        ;(node.material as THREE.Material).dispose()
      })
    }
    teardowns.set(key, teardown)
    return teardown
  }

  const MIRROR_SEEN = 'tm:atelier:mirror-seen'
  let mirrorSeen = false
  try { mirrorSeen = window.sessionStorage.getItem(MIRROR_SEEN) === '1' } catch {}
  const { glass } = atelier.mirror
  const onGlass = (u: number, v: number) => u >= glass.left && u <= glass.right && v >= glass.top && v <= glass.bottom

  const allPieces = () => [...built.values()].flatMap((room) => room.pieces)
  const refreshAll = () => { for (const room of built.values()) room.refresh() }

  return {
    rooms: ATELIER_ROOMS.map(({ key, startX, endX, collection }) => ({ key, label: collection?.title ?? 'The entrance', startX: wx(startX), endX: wx(endX) })),
    buildRoom,

    setActions(next) { actions = next },

    setOwned(items) {
      owned = items === null ? null : new Set(items)
      refreshAll()
    },

    hitTestDoor(raycaster) {
      return doorMeshes.find(({ mesh }) => mesh.hitTest(raycaster))?.door.id ?? null
    },

    hitTestItem(raycaster) {
      for (const piece of allPieces()) {
        if (pickPainted(raycaster, piece.target > 0 ? piece.meshes : piece.bare)) return piece.item()
      }
      return null
    },

    hitTestWardrobe(raycaster) {
      for (const room of built.values()) {
        if (room.wardrobe && pickPainted(raycaster, [room.wardrobe])) return true
      }
      return false
    },

    setWardrobeOpen(open) {
      if (open === wardrobeOpen) return
      wardrobeOpen = open
      refreshAll()
    },

    hitTestMirror(raycaster) {
      for (const room of built.values()) {
        if (!room.mirror) continue
        const uv = raycaster.intersectObject(room.mirror)[0]?.uv
        if (uv && onGlass(uv.x, 1 - uv.y)) return true
      }
      return false
    },

    setWorn(costume, bowId) {
      worn = costume
      wornBow = bowId
      refreshAll()
      // The first reflection is how the room opens, not a change to animate.
      if (!reflected) for (const piece of allPieces()) piece.shown = piece.target
      reflected = true
    },

    setVisitor(kind) {
      visitorKind = kind
      refreshAll()
    },

    mirrorGlass() {
      if (!built.get('entrance')?.mirror) return null
      const { mirror: spec } = atelier
      const W = spec.height * aspectOf('mirror')
      const left = spec.x - W / 2
      const top = spec.bottomY - spec.height
      return {
        left: wx(left + glass.left * W),
        right: wx(left + glass.right * W),
        top: wy(top + glass.top * spec.height),
        bottom: wy(top + glass.bottom * spec.height),
      }
    },

    markMirrorSeen() {
      mirrorSeen = true
      try { window.sessionStorage.setItem(MIRROR_SEEN, '1') } catch {}
    },

    sync(camera, viewport, enabled) {
      lastCamera = camera
      lastViewport = viewport
      const half = (camera.right - camera.left) / 2
      if (half !== drapeForHalf) {
        drapeForHalf = half
        drape.position.x = atelier.max + Math.min(half, curtainDrape.widestHalf) - drapeWidth / 2
      }
      const perUnit = viewport.width / (camera.right - camera.left)
      for (const { node, mark, font } of controls) {
        const visible = placeLabel(node, mark, perUnit, camera, viewport, font)
        if (node instanceof HTMLButtonElement) {
          // Written only on change: rewriting these every frame forced a style recalc each frame.
          if (node.disabled !== !enabled) node.disabled = !enabled
          const at = projected.set(mark.x, mark.y, 0).project(camera)
          const hidden = !visible || at.x < -0.95 || at.x > 0.95
          if (node.hidden !== hidden) node.hidden = hidden
        }
      }
    },

    update(dt, visitorX) {
      for (const { x, glow } of doorGlows) glow.classList.toggle('is-near', Math.abs(visitorX - x) < 1.4)
      // Taking or returning a piece fades it off or onto its stand.
      const fade = reducedMotion ? 1 : Math.min(1, dt / 0.25)
      const pieces = allPieces()
      for (const piece of pieces) {
        piece.shown += (piece.target - piece.shown) * fade
        for (const mesh of piece.meshes) {
          mesh.material.opacity = piece.shown
          mesh.visible = piece.shown > 0.01
        }
      }
      for (const room of built.values()) {
        for (const glint of room.glints) {
          const hidden = !glint.shown()
          if (glint.node.hidden !== hidden) glint.node.hidden = hidden
        }
      }
    },

    flyHome(things, from) {
      if (reducedMotion || !lastCamera || !lastViewport || things.length === 0) return 0
      const camera = lastCamera
      const viewport = lastViewport
      const origin = host.getBoundingClientRect()
      // A piece with a stand of its own goes back to it; everything else lives in the closet.
      const home = (part: string, id: string): THREE.Vector3 | null => {
        const room = built.get('entrance')
        if (part === 'character') return room?.mirror?.position.clone() ?? null
        const piece = allPieces().find((p) => p.item().id === id && p.item().slot === (part === 'bow' ? 'bow' : 'costume'))
        return piece ? piece.bare[0].position.clone() : room?.wardrobe?.position.clone() ?? null
      }
      let flying = 0
      things.forEach((thing, i) => {
        const at = home(thing.part, thing.id)
        const src = pieceUrl(thing.part, thing.id)
        if (!at || !src) return
        at.project(camera)
        const toX = viewport.left + (at.x * 0.5 + 0.5) * viewport.width
        const toY = viewport.top + (-at.y * 0.5 + 0.5) * viewport.height
        const fromX = from.left + from.width / 2 - origin.left
        const fromY = from.top + from.height * (thing.part === 'bow' ? 0.2 : 0.5) - origin.top
        const node = document.createElement('img')
        node.src = src
        node.alt = ''
        node.className = 'atelier-flying'
        node.style.translate = `${fromX}px ${fromY}px`
        node.style.transitionDelay = `${i * 90}ms`
        host.append(node)
        requestAnimationFrame(() => requestAnimationFrame(() => {
          node.style.translate = `${toX}px ${toY}px`
          node.classList.add('is-home')
        }))
        window.setTimeout(() => node.remove(), 900 + i * 90)
        flying = Math.max(flying, 650 + i * 90)
      })
      return flying
    },

    dispose() {
      for (const { glow } of doorGlows) glow.remove()
      for (const teardown of [...teardowns.values()]) teardown()
      scene.remove(shell)
      for (const { mesh } of doorMeshes) mesh.dispose()
      shell.traverse((node) => {
        if (!(node instanceof THREE.Mesh)) return
        node.geometry.dispose()
        const material = node.material as THREE.MeshBasicMaterial
        if (material.map?.userData.ownedByBoard) material.map.dispose()
        material.dispose()
      })
      unplace([...controls])
    },
  }
}
