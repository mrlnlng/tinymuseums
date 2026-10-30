import * as THREE from 'three'
import manifest from '@/generated/asset-manifest.json'
import { assetUrl, builtUrl } from '@/shared/lib/assets'
import type { CharacterSprites } from './assets'
import { plane, stretchedBoard } from './board'
import { CONFIG } from './config'
import { atelierFlight, flightHeight, flightWidth, stairX, type Flight } from './flights'
import { pickPainted } from './hit'
import { placeLabel, type Viewport } from './overlay'
import type { CharacterKind } from './rig'

const { atelier } = CONFIG
const KINDS: CharacterKind[] = ['bunny', 'cat']
type AtelierImage = keyof typeof manifest.atelier

export interface AtelierArt {
  maps: Record<AtelierImage, THREE.Texture>
  floor: THREE.Texture
  floorAspect: number
  plaque: THREE.Texture
  plaqueAspect: number
}

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
  const urls = [...names.map((name) => builtUrl(manifest.atelier[name].src)), assetUrl('floor'), assetUrl('plaque')]
  const settled = await Promise.allSettled(urls.map(load))
  const failed = settled.find((result) => result.status === 'rejected')
  if (failed) {
    for (const result of settled) if (result.status === 'fulfilled') result.value.dispose()
    throw failed.reason
  }
  const loaded = settled.map((result) => (result as PromiseFulfilledResult<THREE.Texture>).value)
  const floor = loaded[names.length]
  const plaque = loaded[names.length + 1]
  const ratio = (texture: THREE.Texture) => {
    const image = texture.image as { width: number; height: number }
    return image.width / image.height
  }
  return {
    maps: Object.fromEntries(names.map((name, i) => [name, loaded[i]])) as Record<AtelierImage, THREE.Texture>,
    floor,
    floorAspect: ratio(floor),
    plaque,
    plaqueAspect: ratio(plaque),
  }
}

export interface AtelierRoom {
  readonly flight: Flight
  hitTestStairs(raycaster: THREE.Raycaster): boolean
  hitTestFeatured(raycaster: THREE.Raycaster): boolean
  /** The character on display under the pointer, if any. */
  hitTestDisplay(raycaster: THREE.Raycaster): CharacterKind | null
  /** Whether the featured form wears its costume; it stands bare while the visitor wears it. */
  setDressed(dressed: boolean): void
  /** The visitor's own platform stands empty. */
  setVisitor(kind: CharacterKind): void
  setFigureOpacity(kind: CharacterKind, opacity: number): void
  displayX(kind: CharacterKind): number
  /** Where the costume sits on the form, and its width there. */
  costumePoint(out: THREE.Vector3): number
  sync(camera: THREE.OrthographicCamera, viewport: Viewport): void
  update(dt: number, visitorX: number): void
  dispose(): void
}

const aspectOf = (name: AtelierImage) => manifest.atelier[name].width / manifest.atelier[name].height

interface Figure {
  mesh: THREE.Mesh
  material: THREE.MeshBasicMaterial
  hop: number
  near: boolean
  opacity: number
  empty: boolean
}

export function createAtelierRoom(
  scene: THREE.Scene,
  art: AtelierArt,
  sprites: CharacterSprites,
  host: HTMLElement,
): AtelierRoom {
  const { maps } = art
  const flight = atelierFlight(0)
  const group = new THREE.Group()
  const owned: THREE.Texture[] = []

  const wallLeft = -14
  const wallRight = 20
  const [tileW, tileH] = atelier.wallTile
  const wallMap = maps.wallpaper
  wallMap.wrapS = THREE.RepeatWrapping
  wallMap.wrapT = THREE.RepeatWrapping
  wallMap.repeat.set((wallRight - wallLeft) / tileW, 34 / tileH)
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(wallRight - wallLeft, 34), new THREE.MeshBasicMaterial({ map: wallMap }))
  wall.position.set((wallLeft + wallRight) / 2, 11, -0.5)
  group.add(wall)

  // The floor lies in front of the flight from the landing on, so the landing sits flush with it
  // and only the open stairwell to its left shows the steps below.
  const floorLeft = stairX(flight, CONFIG.stairs.landing.x)
  const floorHeight = 2.6
  const floorMap = art.floor
  floorMap.wrapS = THREE.RepeatWrapping
  floorMap.repeat.set((wallRight - floorLeft) / (floorHeight * art.floorAspect), 1)
  floorMap.needsUpdate = true
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(wallRight - floorLeft, floorHeight), new THREE.MeshBasicMaterial({ map: floorMap }))
  floor.position.set((floorLeft + wallRight) / 2, -floorHeight / 2, 0.15)
  group.add(floor)

  const stairs = plane(flightWidth, flightHeight, maps.staircase, flight.left + flightWidth / 2, flight.base + flightHeight / 2, 0.1)
  group.add(stairs)

  const { plaque } = atelier
  group.add(stretchedBoard(art.plaque, art.plaqueAspect, plaque.x, plaque.y, plaque.z, plaque.width, plaque.height))

  const { column } = atelier
  for (const x of atelier.columns) {
    group.add(plane(column.height * aspectOf('column'), column.height, maps.column, x, column.bottom + column.height / 2, column.z))
  }

  const { mannequin, platform, spotlight } = atelier
  const unit = mannequin.height / mannequin.canvas.form[1]
  const canvasWidth = (mannequin.canvas.form[0] + 2 * mannequin.canvas.padX) * unit
  const canvasHeight = (mannequin.canvas.form[1] + mannequin.canvas.padTop) * unit
  const formY = mannequin.feetY + canvasHeight / 2
  const platformHeight = platform.width / aspectOf('platform')
  const spotlightWidth = spotlight.height * aspectOf('spotlight')

  function stage(x: number): void {
    group.add(plane(platform.width, platformHeight, maps.platform, x, platform.centerY, platform.z))
    const light = plane(spotlightWidth, spotlight.height, maps.spotlight, x, spotlight.top - spotlight.height / 2, spotlight.z)
    ;(light.material as THREE.MeshBasicMaterial).depthWrite = false
    group.add(light)
  }

  const featuredMaterial = new THREE.MeshBasicMaterial({ map: maps.mannequinDressed, transparent: true })
  const featured = new THREE.Mesh(new THREE.PlaneGeometry(canvasWidth, canvasHeight), featuredMaterial)
  featured.position.set(atelier.featured.x, formY, mannequin.z)
  group.add(featured)
  stage(atelier.featured.x)

  const bare = plane(canvasWidth, canvasHeight, maps.mannequin, atelier.bare.x, formY, mannequin.z)
  // Out of the light, the spare form reads as unlit.
  ;(bare.material as THREE.MeshBasicMaterial).color.setRGB(0.62, 0.55, 0.53)
  group.add(bare)

  const bunnyMap = new THREE.Texture(sprites.bunnyIdle.left)
  bunnyMap.colorSpace = THREE.SRGBColorSpace
  bunnyMap.needsUpdate = true
  owned.push(bunnyMap)
  const figureArt: Record<CharacterKind, { map: THREE.Texture; aspect: number }> = {
    bunny: { map: bunnyMap, aspect: sprites.bunnyIdle.left.naturalWidth / sprites.bunnyIdle.left.naturalHeight },
    cat: { map: maps.catStanding, aspect: aspectOf('catStanding') },
  }
  const figureHeight = CONFIG.character.height
  const figures = {} as Record<CharacterKind, Figure>
  for (const kind of KINDS) {
    const material = new THREE.MeshBasicMaterial({ map: figureArt[kind].map, transparent: true })
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(figureHeight * figureArt[kind].aspect, figureHeight), material)
    mesh.position.set(atelier.displays[kind], mannequin.feetY + figureHeight / 2, mannequin.z)
    group.add(mesh)
    stage(atelier.displays[kind])
    figures[kind] = { mesh, material, hop: -1, near: false, opacity: 1, empty: false }
  }

  function showFigure(kind: CharacterKind): void {
    const figure = figures[kind]
    figure.material.opacity = figure.empty ? 0 : figure.opacity
    figure.mesh.visible = figure.material.opacity > 0.001
  }

  scene.add(group)

  const title = document.createElement('div')
  title.className = 'atelier-title'
  title.textContent = 'The Costume Atelier'
  const plaqueText = document.createElement('p')
  plaqueText.className = 'atelier-plaque'
  plaqueText.textContent =
    "An exhibition dedicated to clothing that has inspired the artworks displayed in Tiny Museum's main collection"
  host.append(title, plaqueText)

  let clock = 0

  return {
    flight,

    hitTestStairs(raycaster) {
      return pickPainted(raycaster, [stairs]) !== null
    },

    hitTestFeatured(raycaster) {
      return pickPainted(raycaster, [featured]) !== null
    },

    hitTestDisplay(raycaster) {
      for (const kind of KINDS) {
        const { mesh } = figures[kind]
        if (mesh.visible && pickPainted(raycaster, [mesh])) return kind
      }
      return null
    },

    setDressed(dressed) {
      featuredMaterial.map = dressed ? maps.mannequinDressed : maps.mannequin
      featuredMaterial.needsUpdate = true
    },

    setVisitor(kind) {
      for (const other of KINDS) {
        figures[other].empty = other === kind
        showFigure(other)
      }
    },

    setFigureOpacity(kind, opacity) {
      figures[kind].opacity = opacity
      showFigure(kind)
    },

    displayX(kind) {
      return atelier.displays[kind]
    },

    costumePoint(out) {
      // The flying bundle (bow over dress) is centred 297.5 form px above the feet on the form's canvas.
      out.set(atelier.featured.x, mannequin.feetY + 297.5 * unit, mannequin.z)
      return 215 * unit
    },

    sync(camera, viewport) {
      const perUnit = viewport.width / (camera.right - camera.left)
      placeLabel(title, atelier.title, perUnit, camera, viewport, 0.1)
      placeLabel(plaqueText, { x: plaque.x, y: plaque.y, width: plaque.textWidth }, perUnit, camera, viewport, 0.068)
    },

    update(dt, visitorX) {
      clock += dt
      for (const kind of KINDS) {
        const figure = figures[kind]
        // Each figure greets the visitor with a small hop as they come near.
        const near = Math.abs(visitorX - atelier.displays[kind]) < atelier.displays.near
        if (near && !figure.near && !figure.empty) figure.hop = 0
        figure.near = near
        let lift = 0
        if (figure.hop >= 0) {
          figure.hop += dt
          const t = figure.hop / 0.42
          lift = t < 1 ? 0.12 * Math.sin(Math.PI * t) : 0
          if (t >= 1) figure.hop = -1
        }
        const breath = 1 + 0.012 * Math.sin((clock * Math.PI * 2) / 3.1 + (kind === 'cat' ? 1.3 : 0))
        figure.mesh.scale.y = breath
        figure.mesh.position.y = mannequin.feetY + (figureHeight * breath) / 2 + lift
      }
    },

    dispose() {
      scene.remove(group)
      group.traverse((node) => {
        if (!(node instanceof THREE.Mesh)) return
        node.geometry.dispose()
        const material = node.material as THREE.MeshBasicMaterial
        if (material.map?.userData.ownedByBoard) material.map.dispose()
        material.dispose()
      })
      for (const texture of [...Object.values(maps), art.floor, art.plaque, ...owned]) texture.dispose()
      title.remove()
      plaqueText.remove()
    },
  }
}
