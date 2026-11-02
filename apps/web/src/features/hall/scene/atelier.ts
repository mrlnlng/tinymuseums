import * as THREE from 'three'
import manifest from '@/generated/asset-manifest.json'
import { FREE_CHARACTERS, itemIdFor, priceOf } from '@tiny/core/economy'
import { florinLabel } from '@/features/economy/lib/claim'
import { builtUrl } from '@/shared/lib/assets'
import { plane, stretchedBoard } from './board'
import { CONFIG } from './config'
import { createGalleryDoor, GALLERY_DOOR } from './gallery-door'
import { pickPainted } from './hit'
import { placeLabel, type Viewport } from './overlay'
import type { CharacterKind } from './rig'
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
const CARDIGAN_ART: Record<Cardigan, AtelierImage> = {
  'cardigan-red': 'cardiganRed',
  'cardigan-forest-green': 'cardiganForestGreen',
  'cardigan-navy-blue': 'cardiganNavyBlue',
  'cardigan-butter-yellow': 'cardiganButterYellow',
}
const CARDIGAN_NAMES: Record<Cardigan, string> = {
  'cardigan-red': 'red',
  'cardigan-forest-green': 'forest green',
  'cardigan-navy-blue': 'navy blue',
  'cardigan-butter-yellow': 'butter yellow',
}
const isCardigan = (id: string | null): id is Cardigan => (CARDIGANS as readonly (string | null)[]).includes(id)
export const CHARACTER_NAMES: Record<CharacterKind, string> = { bunny: 'the bunny', cat: 'Jiji', otter: 'the otter' }

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

export function createAtelierRoom(scene: THREE.Scene, art: AtelierArt, host: HTMLElement, image: HTMLImageElement): AtelierRoom {
  const group = new THREE.Group()

  /** A picture by its centre and width in mock px. */
  function picture(name: AtelierImage, spot: { x: number; y: number; width: number; z: number }): Painted {
    const width = units(spot.width)
    const mesh = plane(width, width / aspectOf(name), art[name], wx(spot.x), wy(spot.y), spot.z) as Painted
    group.add(mesh)
    return mesh
  }

  /** A picture standing on the floor at mock px x, its foot at mock px y. */
  function standing(name: AtelierImage, x: number, footY: number, height: number, z: number): Painted {
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
  group.add(wallMesh)

  const carpetHeight = atelier.carpet.height
  const carpetMap = art.carpet
  carpetMap.wrapS = THREE.RepeatWrapping
  carpetMap.repeat.set((wall.right - wall.left) / (carpetHeight * aspectOf('carpet')), 1)
  const carpet = new THREE.Mesh(new THREE.PlaneGeometry(wall.right - wall.left, carpetHeight), new THREE.MeshBasicMaterial({ map: carpetMap }))
  carpet.position.set((wall.left + wall.right) / 2, mock.floorWorld - carpetHeight / 2, 0.15)
  group.add(carpet)

  const door = createGalleryDoor(group, image, GALLERY_DOOR.atelierX, GALLERY_DOOR.atelierBase)
  const sign = CONFIG.lobby.sign
  const signY = sign.centerY - 0.16
  group.add(stretchedBoard(art.plaque, aspectOf('plaque'), GALLERY_DOOR.atelierX,
    signY, sign.z, sign.width, sign.height))

  const spotlightWidth = atelier.spotlight.height * aspectOf('spotlight')
  function spotlight(x: number): void {
    const light = plane(spotlightWidth, atelier.spotlight.height, art.spotlight, wx(x), atelier.ceiling - atelier.spotlight.height / 2, atelier.spotlight.z)
    ;(light.material as THREE.MeshBasicMaterial).depthWrite = false
    group.add(light)
  }

  const { curtains } = atelier
  const curtainWidth = units(curtains.width)
  const curtainHeight = curtainWidth / aspectOf('curtains')
  group.add(plane(curtainWidth, curtainHeight, art.curtains, wx(curtains.left) + curtainWidth / 2, atelier.ceiling - curtainHeight / 2, curtains.z))

  picture('shelf', atelier.shelf)
  picture('cabinet', atelier.cabinet)
  picture('jewelryBox', atelier.jewelryBox)
  picture('perfume', atelier.perfume)
  picture('portraitWink', atelier.portraitWink)
  picture('portraitBunny', atelier.portraitBunny)
  picture('ribbon', atelier.ribbon)
  picture('painting', atelier.painting)
  picture('mirror', atelier.mirror)

  const { column } = atelier
  const pillar = (x: number) => standing('column', x, column.bottomY, column.height, column.z)
  pillar(atelier.bowPillar.x)
  pillar(atelier.redPillar.x)
  const bowPillow = picture('pillowBlue', { x: atelier.bowPillar.x, ...atelier.bowPillar.pillow, z: 0.34 })
  picture('pillowRed', { x: atelier.redPillar.x, ...atelier.redPillar.pillow, z: 0.34 })
  const bow = picture('bow', { ...atelier.bowPillar.bow, z: 0.36 })

  const { mannequin, platform } = atelier
  const unit = units(mannequin.height) / mannequin.canvas.form[1]
  const canvasWidth = (mannequin.canvas.form[0] + 2 * mannequin.canvas.padX) * unit
  const canvasHeight = (mannequin.canvas.form[1] + mannequin.canvas.padTop) * unit
  const platformWidth = units(platform.width)
  function form(x: number, feetY: number, onPlatform: boolean, lit: boolean): Painted {
    const mesh = plane(canvasWidth, canvasHeight, art.mannequin, wx(x), wy(feetY) + canvasHeight / 2, mannequin.z) as Painted
    group.add(mesh)
    if (onPlatform) group.add(plane(platformWidth, platformWidth / aspectOf('platform'), art.platform, wx(x), wy(platform.y), platform.z))
    if (lit) spotlight(x)
    return mesh
  }
  const featuredX = atelier.featured.x
  const featured = form(featuredX, mannequin.feetY, true, true)
  const dress = new THREE.Mesh(
    new THREE.PlaneGeometry(canvasWidth, canvasHeight),
    new THREE.MeshBasicMaterial({ map: art.mannequinDress, transparent: true, depthWrite: false }),
  )
  dress.position.copy(featured.position)
  dress.position.z += 0.01
  group.add(dress)
  const broom = picture('broom', atelier.broom)
  const [cardiganStand, ...spares] = atelier.forms
  const cardiganForm = form(cardiganStand.x, cardiganStand.feetY, cardiganStand.platform, cardiganStand.platform)
  const floralPieces = spares.map((spare) => {
    const bare = form(spare.x, spare.feetY, spare.platform, spare.platform)
    bare.material.map = art.floralMannequin
    const mesh = plane(canvasWidth, canvasHeight, art.blueFloral, bare.position.x, bare.position.y, mannequin.z + 0.01) as Painted
    mesh.material.depthWrite = false
    group.add(mesh)
    return { item: { slot: 'costume', id: 'blue-floral' } as ClothingItem, mesh, bare, x: spare.x, y: 330, width: 220, shown: 1, target: 1 }
  })
  const floralBare = form(atelier.floralDisplay.x, atelier.floralDisplay.feetY, true, true)
  floralBare.material.map = art.floralMannequin
  const floralCardigan = plane(canvasWidth, canvasHeight, art.floralCardigan, floralBare.position.x, floralBare.position.y, mannequin.z + 0.01) as Painted
  floralCardigan.material.depthWrite = false
  group.add(floralCardigan)
  floralPieces.push({ item: { slot: 'costume', id: 'floral-cardigan' }, mesh: floralCardigan, bare: floralBare, x: atelier.floralDisplay.x, y: 330, width: 220, shown: 1, target: 1 })
  pillar(atelier.crownPillar.x)
  const crownPillow = picture('pillowBlue', { x: atelier.crownPillar.x, ...atelier.crownPillar.pillow, z: 0.34 })
  const crown = picture('flowerCrown', atelier.flowerCrown)
  crown.rotation.z = atelier.flowerCrown.rotation
  floralPieces.push({ item: { slot: 'bow', id: 'flower-crown' }, mesh: crown, bare: crownPillow, x: atelier.flowerCrown.x, y: atelier.flowerCrown.y, width: 190, shown: 1, target: 1 })
  for (const { x, id, image } of atelier.goldForms) {
    const bare = form(x, mannequin.feetY, true, true)
    bare.material.map = art.floralMannequin
    const mesh = plane(canvasWidth, canvasHeight, art[image], bare.position.x, bare.position.y, mannequin.z + 0.01) as Painted
    mesh.material.depthWrite = false
    group.add(mesh)
    floralPieces.push({ item: { slot: 'costume', id }, mesh, bare, x, y: 330, width: 220, shown: 1, target: 1 })
  }
  // A worn headpiece leaves its cushion to give it back; the hibiscus share theirs.
  for (const stand of atelier.accessories) {
    pillar(stand.x)
    const pillow = picture(stand.pillow, { x: stand.x, ...atelier.crownPillar.pillow, z: 0.34 })
    for (const { id, image, dx, y, width, rotation } of stand.pieces) {
      const mesh = picture(image, { x: stand.x + dx, y, width, z: 0.36 })
      mesh.rotation.z = rotation
      floralPieces.push({ item: { slot: 'bow', id }, mesh, bare: pillow, x: stand.x + dx, y, width: Math.min(190, width + 10), shown: 1, target: 1 })
    }
  }
  const cardigan = new THREE.Mesh(
    new THREE.PlaneGeometry(canvasWidth, canvasHeight),
    new THREE.MeshBasicMaterial({ map: art.cardiganRed, transparent: true, depthWrite: false }),
  )
  cardigan.position.copy(cardiganForm.position)
  cardigan.position.z += 0.01
  group.add(cardigan)
  // The colour on the form: the last one chosen, shown again once it is given back.
  let onForm: Cardigan = 'cardigan-red'

  // Each frame offers its own character, or the bunny while the visitor is that character.
  const frames = atelier.portraits.map(({ own, image, ...spot }) => {
    const mine = picture(image, spot)
    const bunny = picture('portraitBunny', { ...spot, width: spot.width * 0.92 })
    bunny.visible = false
    const shows: Partial<Record<CharacterKind, Painted>> = { [own]: mine, bunny }
    return { own: own as CharacterKind, spot, shows, offered: own as CharacterKind, rest: mine.position.clone(), near: false, hop: -1 }
  })

  scene.add(group)

  let actions: AtelierActions | null = null
  const controls: { node: HTMLElement; mark: { x: number; y: number; width: number }; font: number }[] = []
  function place(node: HTMLElement, spot: { x: number; y: number; width: number }, font: number): void {
    host.append(node)
    controls.push({ node, mark: { x: wx(spot.x), y: wy(spot.y), width: units(spot.width) }, font })
  }
  function control(label: string, className: string, spot: { x: number; y: number; width: number }, click: () => void): HTMLButtonElement {
    const node = document.createElement('button')
    node.type = 'button'
    node.className = className
    node.setAttribute('aria-label', label)
    node.addEventListener('click', click)
    place(node, spot, 0.09)
    return node
  }
  function text(tag: 'div' | 'p', className: string, content: string, spot: { x: number; y: number; width: number }, font: number): void {
    const node = document.createElement(tag)
    node.className = className
    node.textContent = content
    place(node, spot, font)
  }
  text('div', 'atelier-title', 'The Costume Atelier', atelier.title, 0.088)
  text('p', 'atelier-plaque', "Costumes that inspired the works of Tiny Museum's permanent collection, presented here to be worn.", atelier.plaque, 0.058)
  text('div', 'atelier-collection', 'The Kiki Collection', atelier.collection, 0.2)
  text('div', 'atelier-collection', 'The Cardigan Collection', atelier.cardigans.label, 0.12)
  text('div', 'atelier-collection', 'The Floral Collection', atelier.floralCollection, 0.2)
  text('div', 'atelier-collection', 'The Gold Collection', atelier.goldCollection, 0.2)
  text('div', 'atelier-collection', 'The Accessory Collection', atelier.accessoryCollection, 0.2)
  const kikiDress: ClothingItem = { slot: 'costume', id: 'kiki' }
  const kikiBow: ClothingItem = { slot: 'bow', id: 'kiki' }
  const itemButtons = {
    dress: control("Try on Kiki's dress", 'atelier-item atelier-item-dress', { x: featuredX, y: 330, width: 200 }, () => actions?.onItem(kikiDress)),
    bow: control("Try on Kiki's bow", 'atelier-item atelier-item-bow', atelier.bowPillar.bow, () => actions?.onItem(kikiBow)),
    cardigan: control('Try on the red cardigan', 'atelier-item atelier-item-dress', { x: cardiganStand.x, y: 330, width: 200 }, () => actions?.onItem(cardiganItem())),
  }
  const floralButtons = floralPieces.map((piece) => control(
    `Try on ${itemName(piece.item).toLowerCase()}`,
    piece.item.slot === 'bow' ? 'atelier-item atelier-item-bow' : 'atelier-item atelier-item-dress',
    { x: piece.x, y: piece.y, width: piece.width },
    () => actions?.onItem(piece.item),
  ))
  const { swatches } = atelier.cardigans
  const swatchButtons = CARDIGANS.map((id, i) => {
    const node = control(`Try on the ${CARDIGAN_NAMES[id]} cardigan`, `atelier-swatch atelier-swatch-${id}`, {
      x: swatches.x + (i - (CARDIGANS.length - 1) / 2) * swatches.gap,
      y: swatches.y,
      width: swatches.width,
    }, () => actions?.onItem({ slot: 'costume', id }))
    return node
  })
  const portraitButtons = frames.map((frame) =>
    control(`Walk as ${CHARACTER_NAMES[frame.own]}`, 'atelier-choice', frame.spot, () => actions?.onCharacter(frame.offered)))
  const note = document.createElement('p')
  note.className = 'atelier-note'
  note.setAttribute('role', 'status')
  place(note, { x: 0, y: 0, width: 260 }, 0.075)
  const noteSpot = controls[controls.length - 1].mark
  let noteFor = 0

  // One hint, by the nearest piece the visitor has not tried yet.
  const hint = document.createElement('p')
  hint.className = 'atelier-hint'
  hint.setAttribute('aria-hidden', 'true')
  place(hint, { x: 0, y: 0, width: 300 }, 0.085)
  const hintSpot = controls[controls.length - 1].mark
  type HintKey = 'dress' | 'bow' | 'cardigan' | 'portrait0' | 'portrait1'
  const hintSpots: { key: HintKey; x: number; y: number }[] = [
    { key: 'dress', x: featuredX, y: 140 },
    { key: 'bow', x: atelier.bowPillar.bow.x, y: 318 },
    { key: 'portrait0', x: frames[0].spot.x, y: frames[0].spot.y + 72 },
    { key: 'cardigan', x: cardiganStand.x, y: 232 },
    { key: 'portrait1', x: frames[1].spot.x, y: frames[1].spot.y - 78 },
  ]
  const tried = new Set<HintKey>()
  function hintText(key: HintKey): string {
    if (key === 'dress') return target.dress > 0 ? 'Tap the dress to try it on' : 'Tap the form to give it back'
    if (key === 'bow') return target.bow > 0 ? 'Tap the bow to try it on' : 'Tap the cushion to give it back'
    if (key === 'cardigan') return target.cardigan > 0 ? 'Tap to try it on, or pick a colour' : 'Tap the form to give it back'
    return `Tap to walk as ${CHARACTER_NAMES[frames[key === 'portrait0' ? 0 : 1].offered]}`
  }
  const exit = control('Back to museum', 'lobby-sign gallery-door-cue atelier-exit', {
    x: mock.originX + GALLERY_DOOR.atelierX * mock.unit,
    y: mock.floorY - (signY - mock.floorWorld) * mock.unit,
    width: sign.width * 0.76 * mock.unit,
  }, () => actions?.onLeave())
  exit.textContent = 'Back to museum'
  controls[controls.length - 1].font = 0.12

  let clock = 0
  let jiggle = -1
  let nextJiggle = 3.2
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const rest = {
    dress: dress.position.clone(),
    bow: bow.position.clone(),
    cardigan: cardigan.position.clone(),
  }
  const shown = { dress: 1, bow: 1, cardigan: 1 }
  let reflected = false
  const target = { dress: 1, bow: 1, cardigan: 1 }
  let worn: string | null = null
  let visitorKind: CharacterKind | null = null

  // The form offers its colour; once worn, the bare form gives it back.
  function cardiganItem(): ClothingItem {
    return { slot: 'costume', id: isCardigan(worn) ? worn : onForm }
  }

  const priceTags: { node: HTMLDivElement; label: HTMLSpanElement; item: () => string }[] = []
  function priceTag(item: () => string, spot: { x: number; y: number; width: number }): void {
    const node = document.createElement('div')
    node.className = 'atelier-price'
    node.hidden = true
    const icon = document.createElement('img')
    icon.className = 'atelier-price-coin'
    icon.alt = ''
    icon.src = builtUrl(manifest.images['coin-large'].x2.src)
    const label = document.createElement('span')
    node.append(icon, label)
    place(node, spot, 0.062)
    priceTags.push({ node, label, item })
  }
  priceTag(() => itemIdFor('costume', 'kiki'), { x: featuredX, y: 250, width: 150 })
  priceTag(() => itemIdFor('bow', 'kiki'), { x: atelier.bowPillar.bow.x, y: 248, width: 140 })
  priceTag(() => itemIdFor('costume', cardiganItem().id), { x: cardiganStand.x, y: 250, width: 150 })
  for (const piece of floralPieces) {
    priceTag(() => itemIdFor(piece.item.slot, piece.item.id), { x: piece.x, y: piece.y + 58, width: 125 })
  }
  for (const frame of frames) {
    if ((FREE_CHARACTERS as readonly string[]).includes(frame.own)) continue
    priceTag(() => itemIdFor('character', frame.own), { x: frame.spot.x, y: frame.spot.y + 86, width: 120 })
  }

  let owned: Set<string> | null = null
  function refreshPriceTags(): void {
    for (const tag of priceTags) {
      const id = tag.item()
      const price = priceOf(id)
      const show = owned !== null && price !== null && !owned.has(id)
      tag.node.hidden = !show
      if (show && price !== null) tag.label.textContent = florinLabel(price)
    }
  }
  refreshPriceTags()

  return {
    setActions(next) { actions = next },

    setOwned(items) {
      owned = items === null ? null : new Set(items)
      refreshPriceTags()
    },

    hitTestDoor(raycaster) {
      return door.hitTest(raycaster)
    },

    hitTestItem(raycaster) {
      if (pickPainted(raycaster, target.bow > 0 ? [bow] : [bow, bowPillow])) return kikiBow
      if (pickPainted(raycaster, target.dress > 0 ? [dress, broom] : [featured])) return kikiDress
      if (pickPainted(raycaster, [target.cardigan > 0 ? cardigan : cardiganForm])) return cardiganItem()
      for (const piece of floralPieces) {
        if (pickPainted(raycaster, [piece.target > 0 ? piece.mesh : piece.bare])) return piece.item
      }
      return null
    },

    hitTestDisplay(raycaster) {
      for (const frame of frames) {
        if (pickPainted(raycaster, [frame.shows[frame.offered]!])) return frame.offered
      }
      return null
    },

    setWorn(costume, bowId) {
      if (reflected) {
        if ((worn === 'kiki') !== (costume === 'kiki')) tried.add('dress')
        if (isCardigan(worn) || isCardigan(costume)) { if (worn !== costume) tried.add('cardigan') }
        if ((target.bow === 0) !== (bowId === 'kiki')) tried.add('bow')
      }
      worn = costume
      if (isCardigan(costume) && costume !== onForm) {
        onForm = costume
        cardigan.material.map = art[CARDIGAN_ART[costume]]
      }
      target.dress = costume === 'kiki' ? 0 : 1
      target.bow = bowId === 'kiki' ? 0 : 1
      target.cardigan = isCardigan(costume) ? 0 : 1
      floralPieces.forEach((piece, i) => {
        const wearing = (piece.item.slot === 'bow' ? bowId : costume) === piece.item.id
        piece.target = wearing ? 0 : 1
        if (!reflected) piece.shown = piece.target
        floralButtons[i].setAttribute('aria-pressed', String(wearing))
        floralButtons[i].setAttribute('aria-label', `${wearing ? 'Return' : 'Try on'} ${itemName(piece.item).toLowerCase()}`)
      })
      // The first reflection is how the room opens, not a change to animate.
      if (!reflected) Object.assign(shown, target)
      reflected = true
      for (const part of ['dress', 'bow'] as const) {
        const available = target[part] > 0
        const node = itemButtons[part]
        node.setAttribute('aria-label', `${available ? 'Try on' : 'Return'} Kiki's ${part}`)
        node.setAttribute('aria-pressed', String(!available))
      }
      const offer = cardiganItem()
      itemButtons.cardigan.setAttribute('aria-label', `${target.cardigan > 0 ? 'Try on' : 'Return'} ${itemName(offer).toLowerCase()}`)
      itemButtons.cardigan.setAttribute('aria-pressed', String(target.cardigan === 0))
      CARDIGANS.forEach((id, i) => {
        swatchButtons[i].setAttribute('aria-pressed', String(costume === id))
        swatchButtons[i].setAttribute('aria-label', `${costume === id ? 'Return' : 'Try on'} the ${CARDIGAN_NAMES[id]} cardigan`)
      })
      refreshPriceTags()
    },

    setVisitor(kind) {
      if (visitorKind && visitorKind !== kind) { tried.add('portrait0'); tried.add('portrait1') }
      visitorKind = kind
      frames.forEach((frame, i) => {
        frame.offered = kind === frame.own ? 'bunny' : frame.own
        for (const [shown, mesh] of Object.entries(frame.shows)) mesh!.visible = shown === frame.offered
        portraitButtons[i].setAttribute('aria-label', `Walk as ${CHARACTER_NAMES[frame.offered]}`)
      })
    },

    showMisfit(item, kind) {
      note.textContent = `${itemName(item)} doesn't fit ${CHARACTER_NAMES[kind]} yet`
      const floral = floralPieces.find(piece => piece.item.id === item.id)
      const spot = floral ? { x: floral.x, y: floral.y } : item.id === 'kiki'
        ? item.slot === 'bow' ? atelier.bowPillar.bow : { x: featuredX, y: 250 }
        : { x: cardiganStand.x, y: 250 }
      noteSpot.x = wx(spot.x)
      noteSpot.y = wy(spot.y - 70)
      noteFor = 2.6
    },

    sync(camera, viewport, enabled) {
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
      clock += dt
      if (!reducedMotion && clock >= nextJiggle) {
        jiggle = 0
        nextJiggle = clock + 6.5
      }
      if (jiggle >= 0) {
        jiggle += dt
        if (jiggle > 0.8) jiggle = -1
      }
      const t = jiggle < 0 ? 1 : jiggle / 0.8
      const wobble = reducedMotion || t >= 1 ? 0 : Math.sin(t * Math.PI * 6) * Math.sin(t * Math.PI)

      // Taking or returning a piece fades it off or onto its stand.
      const fade = reducedMotion ? 1 : Math.min(1, dt / 0.25)
      for (const part of ['dress', 'bow', 'cardigan'] as const) shown[part] += (target[part] - shown[part]) * fade
      for (const piece of floralPieces) {
        piece.shown += (piece.target - piece.shown) * fade
        piece.mesh.material.opacity = piece.shown
        piece.mesh.visible = piece.shown > 0.01
      }
      noteFor = Math.max(0, noteFor - dt)
      let nearest: { key: HintKey; x: number; y: number } | null = null
      for (const spot of hintSpots) {
        const distance = Math.abs(visitorX - wx(spot.x))
        if (tried.has(spot.key) || distance > 1.5) continue
        if (!nearest || distance < Math.abs(visitorX - wx(nearest.x)) - 0.05) nearest = spot
      }
      if (nearest) {
        hint.textContent = hintText(nearest.key)
        hintSpot.x = wx(nearest.x)
        hintSpot.y = wy(nearest.y)
      }
      const nearbyFloral = floralPieces.find(piece => Math.abs(visitorX - wx(piece.x)) < 1.25)
      if (nearbyFloral && !nearest) {
        hint.textContent = nearbyFloral.target > 0
          ? `Tap to try on ${itemName(nearbyFloral.item).toLowerCase()}`
          : nearbyFloral.item.slot === 'bow' ? 'Tap the cushion to give it back' : 'Tap the form to give it back'
        hintSpot.x = wx(nearbyFloral.x)
        hintSpot.y = wy(nearbyFloral.item.slot === 'bow' ? 310 : 160)
      }
      hint.style.setProperty('--show', (nearest || nearbyFloral) && noteFor <= 0 ? '1' : '0')
      note.style.setProperty('--fade', String(Math.min(1, noteFor / 0.4)))
      cardigan.material.opacity = shown.cardigan
      cardigan.visible = shown.cardigan > 0.01
      cardigan.scale.x = 1 + 0.035 * wobble
      cardigan.position.x = rest.cardigan.x - 0.022 * wobble
      dress.material.opacity = shown.dress
      dress.visible = shown.dress > 0.01
      broom.material.opacity = shown.dress
      broom.visible = dress.visible
      bow.material.opacity = shown.bow
      bow.visible = shown.bow > 0.01

      dress.scale.x = 1 + 0.035 * wobble
      dress.position.x = rest.dress.x - 0.022 * wobble
      broom.rotation.z = 0.04 * wobble
      bow.scale.x = 1 + 0.05 * wobble
      bow.position.y = rest.bow.y + 0.02 * Math.abs(wobble)

      // A portrait hops as the visitor comes near, an invitation to step into it.
      for (const frame of frames) {
        const near = Math.abs(visitorX - wx(frame.spot.x)) < 1.1
        if (near && !frame.near && !reducedMotion) frame.hop = 0
        frame.near = near
        let lift = 0
        if (frame.hop >= 0) {
          frame.hop += dt
          const p = frame.hop / 0.42
          lift = p < 1 ? 0.08 * Math.sin(Math.PI * p) : 0
          if (p >= 1) frame.hop = -1
        }
        for (const mesh of Object.values(frame.shows)) {
          mesh!.position.y = frame.rest.y + lift
          mesh!.rotation.z = 0.05 * Math.sin(Math.PI * Math.max(0, Math.min(1, frame.hop / 0.42)) * 2)
        }
      }
    },

    dispose() {
      scene.remove(group)
      door.dispose()
      group.traverse((node) => {
        if (!(node instanceof THREE.Mesh)) return
        node.geometry.dispose()
        const material = node.material as THREE.MeshBasicMaterial
        if (material.map?.userData.ownedByBoard) material.map.dispose()
        material.dispose()
      })
      disposeAtelierArt(art)
      for (const { node } of controls) node.remove()
    },
  }
}
