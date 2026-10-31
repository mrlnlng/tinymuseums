import * as THREE from 'three'
import manifest from '@/generated/asset-manifest.json'
import { builtUrl } from '@/shared/lib/assets'
import { plane, stretchedBoard } from './board'
import { CONFIG } from './config'
import { createGalleryDoor, GALLERY_DOOR } from './gallery-door'
import { pickPainted } from './hit'
import { placeLabel, type Viewport } from './overlay'
import type { CharacterKind } from './rig'
import { CARDIGANS } from './wardrobe'

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
const CHARACTER_NAMES: Record<CharacterKind, string> = { bunny: 'the bunny', cat: 'Jiji', otter: 'the otter' }

function itemName({ slot, id }: ClothingItem): string {
  if (isCardigan(id)) return `The ${CARDIGAN_NAMES[id]} cardigan`
  return slot === 'bow' ? "Kiki's bow" : "Kiki's dress"
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
  for (const spare of spares) form(spare.x, spare.feetY, spare.platform, spare.platform)
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
  text('div', 'atelier-collection', 'The Cardigan Collection', atelier.cardigans.label, 0.2)
  const kikiDress: ClothingItem = { slot: 'costume', id: 'kiki' }
  const kikiBow: ClothingItem = { slot: 'bow', id: 'kiki' }
  const itemButtons = {
    dress: control("Try on Kiki's dress", 'atelier-item atelier-item-dress', { x: featuredX, y: 330, width: 200 }, () => actions?.onItem(kikiDress)),
    bow: control("Try on Kiki's bow", 'atelier-item atelier-item-bow', atelier.bowPillar.bow, () => actions?.onItem(kikiBow)),
    cardigan: control('Try on the red cardigan', 'atelier-item atelier-item-dress', { x: cardiganStand.x, y: 330, width: 200 }, () => actions?.onItem(cardiganItem())),
  }
  const { swatches } = atelier.cardigans
  const swatchButtons = CARDIGANS.map((id, i) => {
    const node = control(`Try on the ${CARDIGAN_NAMES[id]} cardigan`, `atelier-swatch atelier-swatch-${id}`, {
      x: cardiganStand.x + (i - (CARDIGANS.length - 1) / 2) * swatches.gap,
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

  // The form offers its colour; once worn, the bare form gives it back.
  function cardiganItem(): ClothingItem {
    return { slot: 'costume', id: isCardigan(worn) ? worn : onForm }
  }


  return {
    setActions(next) { actions = next },

    hitTestDoor(raycaster) {
      return door.hitTest(raycaster)
    },

    hitTestItem(raycaster) {
      if (pickPainted(raycaster, target.bow > 0 ? [bow] : [bow, bowPillow])) return kikiBow
      if (pickPainted(raycaster, target.dress > 0 ? [dress, broom] : [featured])) return kikiDress
      if (pickPainted(raycaster, [target.cardigan > 0 ? cardigan : cardiganForm])) return cardiganItem()
      return null
    },

    hitTestDisplay(raycaster) {
      for (const frame of frames) {
        if (pickPainted(raycaster, [frame.shows[frame.offered]!])) return frame.offered
      }
      return null
    },

    setWorn(costume, bowId) {
      worn = costume
      if (isCardigan(costume) && costume !== onForm) {
        onForm = costume
        cardigan.material.map = art[CARDIGAN_ART[costume]]
      }
      target.dress = costume === 'kiki' ? 0 : 1
      target.bow = bowId === 'kiki' ? 0 : 1
      target.cardigan = isCardigan(costume) ? 0 : 1
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
    },

    setVisitor(kind) {
      frames.forEach((frame, i) => {
        frame.offered = kind === frame.own ? 'bunny' : frame.own
        for (const [shown, mesh] of Object.entries(frame.shows)) mesh!.visible = shown === frame.offered
        portraitButtons[i].setAttribute('aria-label', `Walk as ${CHARACTER_NAMES[frame.offered]}`)
      })
    },

    showMisfit(item, kind) {
      note.textContent = `${itemName(item)} doesn't fit ${CHARACTER_NAMES[kind]} yet`
      const spot = item.id === 'kiki'
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
      noteFor = Math.max(0, noteFor - dt)
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
