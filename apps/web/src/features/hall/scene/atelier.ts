import * as THREE from 'three'
import manifest from '@/generated/asset-manifest.json'
import { FREE_CHARACTERS, itemIdFor, priceOf } from '@tiny/core/economy'
import { STAMP_ASPECT, STAMP_URL } from '@/features/economy/lib/stamp'
import { builtUrl } from '@/shared/lib/assets'
import { plane, stretchedBoard } from './board'
import { CONFIG } from './config'
import { createGalleryDoor, GALLERY_DOOR } from './gallery-door'
import { createHangTag, type HangTag, type HangTagStyle } from './hang-tag'
import { pickPainted } from './hit'
import { placeLabel, type Viewport } from './overlay'
import type { SpotPainting } from '@tiny/core'
import type { CharacterKind } from './rig'
import { ATELIER_ROOMS, ROOM_TEMPLATE, SWAG_START, SWAG_STEP, type CollectionRoom, type FormSpot, type PlacedRoom } from './atelier-layout'
import { CARDIGANS, HIBISCUS } from './wardrobe'

const { atelier } = CONFIG
const { mock } = atelier
type AtelierImage = keyof typeof manifest.atelier
export type AtelierArt = Record<AtelierImage, THREE.Texture>

/** Mock pixels to world units. */
const wx = (px: number) => (px - mock.originX) / mock.unit
const wy = (py: number) => (mock.floorY - py) / mock.unit + mock.floorWorld
const units = (px: number) => px / mock.unit
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
  onCharacter(kind: CharacterKind): void
  onLeave(): void
}

export interface AtelierRoom {
  /** The fashion area's rooms, in world units, joined wall to wall. */
  readonly rooms: readonly { key: string; label: string; startX: number; endX: number }[]
  /** Builds one room's displays; the returned function takes them down again. */
  buildRoom(key: string): () => void
  setActions(actions: AtelierActions): void
  hitTestDoor(raycaster: THREE.Raycaster): boolean
  hitTestItem(raycaster: THREE.Raycaster): ClothingItem | null
  /** The character a portrait offers, if it is under the pointer. */
  hitTestDisplay(raycaster: THREE.Raycaster): CharacterKind | null
  /** What the visitor wears; a worn piece leaves its stand bare. */
  setWorn(costume: string | null, bow: string | null): void
  /** The member's owned catalog ids, or null while their wallet is still loading. */
  setOwned(items: readonly string[] | null): void
  /** The portraits show the characters the visitor is not. */
  setVisitor(kind: CharacterKind): void
  /** Says by the piece that it does not fit this character. */
  showMisfit(item: ClothingItem, kind: CharacterKind): void
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
  /** Where a note about the piece shows, in mock px. */
  at: { x: number; y: number }
  target: number
  shown: number
}

/** A portrait offering a character, or the bunny while the visitor is that character. */
interface Display {
  own: CharacterKind
  offered: CharacterKind
  shows: Partial<Record<CharacterKind, Painted>>
  spot: Spot
  rest: THREE.Vector3
  button: HTMLButtonElement
  near: boolean
  hop: number
}

interface BuiltRoom {
  pieces: Piece[]
  displays: Display[]
  glints: { node: HTMLDivElement; shown: () => boolean }[]
  refresh(): void
  dispose?(): void
}

export function createAtelierRoom(
  scene: THREE.Scene,
  art: AtelierArt,
  host: HTMLElement,
  image: HTMLImageElement,
  spots: Readonly<Record<string, SpotPainting>> = {},
): AtelierRoom {
  const shell = new THREE.Group()
  scene.add(shell)
  // Price tags are drawn into the scene in the buttons' font, with a stamp.
  const liveTags = new Set<HangTag>()
  let swayClock = 0
  const stamp = new Image()
  const tagStyle: HangTagStyle = { font: getComputedStyle(host).getPropertyValue('--font-button').trim() || 'sans-serif', stamp, stampAspect: STAMP_ASPECT }
  const redrawTags = () => { for (const tag of liveTags) tag.redraw() }
  stamp.addEventListener('load', redrawTags)
  stamp.src = STAMP_URL
  void document.fonts?.load(`30px ${tagStyle.font}`).then(redrawTags, () => {})
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
  const wallHeight = atelier.ceiling + 0.3 - mock.floorWorld
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

  const door = createGalleryDoor(shell, image, GALLERY_DOOR.atelierX, GALLERY_DOOR.atelierBase)
  const sign = CONFIG.lobby.sign
  const signY = sign.centerY - 0.16
  shell.add(stretchedBoard(art.plaque, aspectOf('plaque'), GALLERY_DOOR.atelierX,
    signY, sign.z, sign.width, sign.height))

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
  const exit = document.createElement('button')
  exit.type = 'button'
  exit.className = 'lobby-sign gallery-door-cue atelier-exit'
  exit.setAttribute('aria-label', 'Back to museum')
  exit.textContent = 'Back to museum'
  exit.addEventListener('click', () => actions?.onLeave())
  place(exit, {
    x: mock.originX + GALLERY_DOOR.atelierX * mock.unit,
    y: mock.floorY - (signY - mock.floorWorld) * mock.unit,
    width: sign.width * 0.76 * mock.unit,
  }, 0.12)

  const note = document.createElement('p')
  note.className = 'atelier-note'
  note.setAttribute('role', 'status')
  const noteSpot = place(note, { x: 0, y: 0, width: 260 }, 0.075).mark
  let noteFor = 0


  // What the visitor wears, owns and is; each room reads these when it is built.
  let worn: string | null = null
  let wornBow: string | null = null
  let reflected = false
  let owned: Set<string> | null = null
  let visitorKind: CharacterKind | null = null

  const built = new Map<string, BuiltRoom>()
  const teardowns = new Map<string, () => void>()
  const placed = new Map(ATELIER_ROOMS.map((room) => [room.key, room]))

  /** What every room builds its displays with: buttons, price tags, glints, and pieces to try on. */
  function roomKit(group: THREE.Group, own: (spot: Spot, node: HTMLElement, font: number) => void) {
    const pieces: Piece[] = []
    const displays: Display[] = []
    const glints: BuiltRoom['glints'] = []
    const priceTags: { tag: HangTag; item: () => string }[] = []
    const cleanup: (() => void)[] = []

    function button(label: string, className: string, spot: Spot, click: () => void): HTMLButtonElement {
      const node = document.createElement('button')
      node.type = 'button'
      node.className = className
      node.setAttribute('aria-label', label)
      node.addEventListener('click', click)
      own(spot, node, 0.09)
      return node
    }
    /** A price tag hanging from the piece by its string, tied at `knot` (mock px). */
    function priceTag(item: () => string, knot: { x: number; y: number }): void {
      const tag = createHangTag(tagStyle, { x: wx(knot.x), y: wy(knot.y) }, units(23), 0.45)
      tag.setVisible(false)
      group.add(tag.pivot)
      liveTags.add(tag)
      cleanup.push(() => { liveTags.delete(tag); tag.dispose() })
      priceTags.push({ tag, item })
    }
    // A few small stars twinkle over each piece still on its stand, and over each portrait.
    function glint(spot: Spot, aspect: number, shown: () => boolean): void {
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
      own(spot, node, 0.1)
      glints.push({ node, shown })
    }

    /** A headpiece resting on a cushion or a shelf; tapping where it lay gives it back. */
    function headpiece(spot: { id: string; image: string; y: number; width: number; rotation: number }, x: number, stand: Painted[]): void {
      const mesh = picture(group, spot.image as AtelierImage, { x, y: spot.y, width: spot.width, z: 0.36 })
      mesh.rotation.z = spot.rotation
      const item: ClothingItem = { slot: 'bow', id: spot.id }
      const node = button('', 'atelier-item atelier-item-bow', { x, y: spot.y, width: Math.min(220, spot.width + 10) }, () => actions?.onItem(item))
      const piece: Piece = {
        item: () => item,
        wornBy: (_, bow) => bow === spot.id,
        meshes: [mesh],
        bare: [...stand, mesh],
        button: node,
        at: { x, y: spot.y - 70 },
        target: 1,
        shown: 1,
      }
      pieces.push(piece)
      priceTag(() => itemIdFor('bow', spot.id), { x: x + spot.width * 0.28, y: spot.y + 8 })
      glint({ x, y: spot.y, width: Math.max(90, spot.width) }, 1.6, () => piece.target > 0)
    }

    function refresh(): void {
      for (const piece of pieces) {
        const wearing = piece.wornBy(worn, wornBow)
        piece.target = wearing ? 0 : 1
        piece.button.setAttribute('aria-pressed', String(wearing))
        piece.button.setAttribute('aria-label', `${wearing ? 'Return' : 'Try on'} ${itemName(piece.item()).toLowerCase()}`)
      }
      for (const display of displays) {
        display.offered = visitorKind === display.own ? 'bunny' : display.own
        for (const [shown, mesh] of Object.entries(display.shows)) mesh!.visible = shown === display.offered
        display.button.setAttribute('aria-label', `Walk as ${CHARACTER_NAMES[display.offered]}`)
      }
      for (const tag of priceTags) {
        const id = tag.item()
        const price = priceOf(id)
        const show = owned !== null && price !== null && !owned.has(id)
        tag.tag.setVisible(show)
        if (show && price !== null) tag.tag.setLabel(String(price))
      }
    }

    return { pieces, displays, button, priceTag, glint, headpiece, built: (): BuiltRoom => ({ pieces, displays, glints, refresh, dispose: () => { for (const fn of cleanup) fn() } }) }
  }

  function buildEntrance(group: THREE.Group, own: (spot: Spot, node: HTMLElement, font: number) => void): BuiltRoom {
    for (const name of ['shelf', 'cabinet', 'jewelryBox', 'perfume', 'portraitWink', 'portraitBunny', 'ribbon'] as const) {
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
    // Accessories without a room of their own rest in the cabinet's compartments.
    const kit = roomKit(group, own)
    for (const spot of atelier.cabinetPieces) {
      const { compartment } = spot
      const hollow = new THREE.Mesh(
        new THREE.PlaneGeometry(units(compartment.width), units(compartment.height)),
        new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }),
      ) as Painted
      hollow.position.set(wx(compartment.x), wy(compartment.y), 0.255)
      group.add(hollow)
      kit.headpiece(spot, spot.x, [hollow])
    }
    return kit.built()
  }

  function buildCollection(room: PlacedRoom & { collection: CollectionRoom; centerX: number }, group: THREE.Group, own: (spot: Spot, node: HTMLElement, font: number) => void): BuiltRoom {
    const { collection } = room
    const C = room.centerX
    const T = ROOM_TEMPLATE
    const kit = roomKit(group, own)
    const { pieces, displays, button, priceTag, glint } = kit

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
        at: { x, y: 150 },
        target: 1,
        shown: 1,
      }
      pieces.push(piece)
      priceTag(() => itemIdFor('costume', item.id), { x: x + 50, y: 262 })
      glint({ x, y: 300, width: 210 }, 0.95, () => piece.target > 0)
    }
    const formDx = collection.forms.length === 2 ? T.pair.formDx : 0
    collection.forms.forEach((spot, i) => form(spot, C + (i === 0 ? -formDx : formDx)))

    const { pillar } = collection
    const pillarX = C + T.pillar.dx + out
    standing(group, 'column', pillarX, atelier.column.bottomY, atelier.column.height, atelier.column.z)
    const pillow = picture(group, pillar.pillow.image, { x: pillarX, y: pillar.pillow.y, width: pillar.pillow.width, z: 0.34 })
    for (const spot of pillar.pieces) kit.headpiece(spot, pillarX + spot.dx, [pillow])
    if (pillar.fishBag) picture(group, 'fishBag', { ...atelier.fishBag, x: pillarX + atelier.fishBag.dx })

    const portrait = collection.portrait
    const portraitSpot = { x: C + T.portrait.dx + out, y: T.portrait.y, width: portrait.width }
    picture(group, collection.ribbon, { ...T.ribbon, x: C + T.ribbon.dx + out })
    if (collection.fish) picture(group, 'fishWall', { ...T.fish, x: C + T.fish.dx + out })
    const kind = portrait.own
    if (kind === null) {
      picture(group, portrait.image as AtelierImage, { ...portraitSpot, z: T.portrait.z })
    } else {
      const mine = picture(group, portrait.image as AtelierImage, { ...portraitSpot, z: T.portrait.z })
      const bunny = picture(group, 'portraitBunny', { ...portraitSpot, width: portrait.width * 0.92, z: T.portrait.z })
      bunny.visible = false
      const display: Display = {
        own: kind,
        offered: kind,
        shows: { [kind]: mine, bunny },
        spot: portraitSpot,
        rest: mine.position.clone(),
        button: button(`Walk as ${CHARACTER_NAMES[kind]}`, 'atelier-choice', portraitSpot, () => actions?.onCharacter(display.offered)),
        near: false,
        hop: -1,
      }
      displays.push(display)
      if (!(FREE_CHARACTERS as readonly string[]).includes(kind)) {
        priceTag(() => itemIdFor('character', kind), { x: portraitSpot.x + portrait.width * 0.38, y: portraitSpot.y + portrait.width * 0.4 })
      }
      glint(portraitSpot, 1, () => true)
    }

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
    const own = (spot: Spot, node: HTMLElement, font: number) => { owned.push(place(node, spot, font)) }
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

  const allPieces = () => [...built.values()].flatMap((room) => room.pieces)
  const allDisplays = () => [...built.values()].flatMap((room) => room.displays)
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
      return door.hitTest(raycaster)
    },

    hitTestItem(raycaster) {
      for (const piece of allPieces()) {
        if (pickPainted(raycaster, piece.target > 0 ? piece.meshes : piece.bare)) return piece.item()
      }
      return null
    },

    hitTestDisplay(raycaster) {
      for (const display of allDisplays()) {
        if (pickPainted(raycaster, [display.shows[display.offered]!])) return display.offered
      }
      return null
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

    showMisfit(item, kind) {
      note.textContent = `${itemName(item)} doesn't fit ${CHARACTER_NAMES[kind]} yet`
      const piece = allPieces().find((p) => p.item().id === item.id)
      if (piece) {
        noteSpot.x = wx(piece.at.x)
        noteSpot.y = wy(piece.at.y + 80)
      }
      noteFor = 2.6
    },

    sync(camera, viewport, enabled) {
      const half = (camera.right - camera.left) / 2
      if (half !== drapeForHalf) {
        drapeForHalf = half
        drape.position.x = atelier.max + Math.min(half, curtainDrape.widestHalf) - drapeWidth / 2
      }
      const perUnit = viewport.width / (camera.right - camera.left)
      note.hidden = noteFor <= 0
      for (const { node, mark, font } of controls) {
        if (node === note && note.hidden) continue
        const visible = placeLabel(node, mark, perUnit, camera, viewport, font)
        if (node instanceof HTMLButtonElement) {
          node.disabled = !enabled
          const at = new THREE.Vector3(mark.x, mark.y, 0).project(camera)
          node.hidden = !visible || at.x < -0.95 || at.x > 0.95
        }
      }
    },

    update(dt, visitorX) {
      // Price tags sway a little on their strings.
      swayClock += dt
      if (!reducedMotion) {
        for (const tag of liveTags) tag.pivot.rotation.z = 0.035 * Math.sin(swayClock * 1.2 + tag.pivot.position.x * 1.7)
      }
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
      for (const room of built.values()) for (const glint of room.glints) glint.node.hidden = !glint.shown()
      noteFor = Math.max(0, noteFor - dt)

      note.style.setProperty('--fade', String(Math.min(1, noteFor / 0.4)))

      // A portrait hops as the visitor comes near, an invitation to step into it.
      for (const display of allDisplays()) {
        const near = Math.abs(visitorX - wx(display.spot.x)) < 1.1
        if (near && !display.near && !reducedMotion) display.hop = 0
        display.near = near
        let lift = 0
        if (display.hop >= 0) {
          display.hop += dt
          const p = display.hop / 0.42
          lift = p < 1 ? 0.08 * Math.sin(Math.PI * p) : 0
          if (p >= 1) display.hop = -1
        }
        for (const mesh of Object.values(display.shows)) {
          mesh!.position.y = display.rest.y + lift
          mesh!.rotation.z = 0.05 * Math.sin(Math.PI * Math.max(0, Math.min(1, display.hop / 0.42)) * 2)
        }
      }
    },

    dispose() {
      for (const teardown of [...teardowns.values()]) teardown()
      scene.remove(shell)
      door.dispose()
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
