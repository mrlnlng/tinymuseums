import * as THREE from 'three'
import type { Assets } from './assets'
import { disposeBoards, plane, stretchedBoard } from './board'
import { CONFIG } from './config'
import { createGalleryDoor, GALLERY_DOOR } from './gallery-door'
import { placeLabel, type Viewport } from './overlay'

/** A labelled entrance left of the visitor centre, with one shared museum pillar. */
export function createLobbyGalleryDoor(scene: THREE.Scene, host: HTMLElement, onEnter: () => void, image: HTMLImageElement, pillarImage: HTMLImageElement, assets: Assets) {
  const door = createGalleryDoor(scene, image, GALLERY_DOOR.lobbyX)
  const group = new THREE.Group()
  const { sign } = CONFIG.lobby
  group.add(stretchedBoard(assets.textures.plaque, assets.aspect.plaque,
    GALLERY_DOOR.lobbyX, sign.centerY, sign.z, sign.width, sign.height))

  const pillar = new THREE.Texture(pillarImage)
  pillar.needsUpdate = true
  pillar.colorSpace = THREE.SRGBColorSpace
  pillar.anisotropy = 4
  pillar.userData.ownedByBoard = true
  const height = CONFIG.atelier.column.height / CONFIG.atelier.mock.unit
  group.add(plane(height * pillarImage.naturalWidth / pillarImage.naturalHeight, height,
    pillar, -1.84, GALLERY_DOOR.lobbyBase + height / 2, 0.3))
  scene.add(group)

  const cue = document.createElement('button')
  cue.className = 'lobby-sign gallery-door-cue'
  cue.type = 'button'
  cue.textContent = 'Costume Atelier'
  cue.setAttribute('aria-label', 'Enter the costume atelier')
  cue.addEventListener('click', onEnter)
  host.append(cue)
  return {
    hitTest: door.hitTest,
    sync(camera: THREE.OrthographicCamera, viewport: Viewport, enabled: boolean) {
      cue.disabled = !enabled
      const perUnit = viewport.width / (camera.right - camera.left)
      cue.hidden = !placeLabel(cue, { x: GALLERY_DOOR.lobbyX, y: sign.centerY, width: sign.width * 0.76 }, perUnit, camera, viewport, 0.12)
    },
    dispose() { cue.remove(); door.dispose(); disposeBoards(scene, group) },
  }
}
