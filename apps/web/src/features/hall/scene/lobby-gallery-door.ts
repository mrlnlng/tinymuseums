import * as THREE from 'three'
import type { Assets } from './assets'
import { disposeBoards, plane, stretchedBoard } from './board'
import { CONFIG } from './config'
import { createGalleryDoor, GALLERY_DOOR, INSET_DOOR_Z } from './gallery-door'
import { placeLabel, type Viewport } from './overlay'

export interface HallDoor {
  id: string
  x: number
  /** The sign over it; empty for none. */
  label: string
  /** What it is called, sign or not. */
  name: string
  scale: number
  image: HTMLImageElement
  /** Kept by a guide: it does not open by itself. */
  locked: boolean
  /** Set into the wall under a painting, rather than standing out on the floor. */
  inset: boolean
}

/** How far the sign hangs above a door's top, as it does over the entrance's door. */
const SIGN_ABOVE = CONFIG.lobby.sign.centerY - (GALLERY_DOOR.lobbyBase + GALLERY_DOOR.height)

/** Doors to other places standing in one part of the hall, each with a labelled sign. */
export function createHallDoors(scene: THREE.Scene, host: HTMLElement, onEnter: (id: string) => void, doors: readonly HallDoor[], assets: Assets) {
  const group = new THREE.Group()
  const { sign } = CONFIG.lobby
  const built = doors.map((door) => {
    const mesh = createGalleryDoor(scene, door.image, door.x, GALLERY_DOOR.lobbyBase, door.scale, door.inset ? INSET_DOOR_Z : undefined)
    const height = GALLERY_DOOR.height * door.scale
    // A door without a sign keeps its button, unseen until focused, over the door itself.
    const signY = door.label ? GALLERY_DOOR.lobbyBase + height + SIGN_ABOVE : GALLERY_DOOR.lobbyBase + height / 2
    if (door.label) group.add(stretchedBoard(assets.textures.plaque, assets.aspect.plaque, door.x, signY, sign.z, sign.width, sign.height))
    const cue = document.createElement('button')
    cue.className = door.label ? 'lobby-sign gallery-door-cue' : 'lobby-sign gallery-door-cue is-unsigned'
    cue.type = 'button'
    cue.textContent = door.label || door.name
    cue.setAttribute('aria-label', `Go through the door: ${door.name}`)
    if (door.locked) {
      // Its guide is the way through, so the sign is only a sign.
      cue.tabIndex = -1
      cue.setAttribute('aria-hidden', 'true')
    } else {
      cue.addEventListener('click', () => onEnter(door.id))
    }
    host.append(cue)
    return { door, mesh, cue, signY }
  })
  scene.add(group)

  return {
    /** The door under the pointer, if any. */
    hitTest(raycaster: THREE.Raycaster): string | null {
      return built.find(({ door, mesh }) => !door.locked && mesh.hitTest(raycaster))?.door.id ?? null
    },
    sync(camera: THREE.OrthographicCamera, viewport: Viewport, enabled: boolean) {
      const perUnit = viewport.width / (camera.right - camera.left)
      for (const { door, cue, signY } of built) {
        if (cue.disabled !== (!enabled || door.locked)) cue.disabled = !enabled || door.locked
        // Written only on change, so the cue does not force a style recalc every frame.
        const hidden = !placeLabel(cue, { x: door.x, y: signY, width: sign.width * 0.76 }, perUnit, camera, viewport, 0.12)
        if (cue.hidden !== hidden) cue.hidden = hidden
      }
    },
    dispose() {
      for (const { cue, mesh } of built) { cue.remove(); mesh.dispose() }
      disposeBoards(scene, group)
    },
  }
}

/** The museum pillar left of the visitor centre. */
export function createLobbyPillar(scene: THREE.Scene, pillarImage: HTMLImageElement) {
  const group = new THREE.Group()
  const pillar = new THREE.Texture(pillarImage)
  pillar.needsUpdate = true
  pillar.colorSpace = THREE.SRGBColorSpace
  pillar.anisotropy = 4
  pillar.userData.ownedByBoard = true
  const height = CONFIG.atelier.column.height / CONFIG.atelier.mock.unit
  group.add(plane(height * pillarImage.naturalWidth / pillarImage.naturalHeight, height,
    pillar, -1.84, GALLERY_DOOR.lobbyBase + height / 2, 0.3))
  scene.add(group)
  return { dispose: () => disposeBoards(scene, group) }
}
