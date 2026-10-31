import * as THREE from 'three'
import { CONFIG } from './config'
import { lobbyFlight } from './flights'
import { pickPainted } from './hit'
import { placeLabel, type Viewport } from './overlay'
import { drawStairs, type StairArt } from './stair-art'

export interface LobbyStairs {
  readonly art: StairArt
  hitTest(raycaster: THREE.Raycaster): boolean
  sync(camera: THREE.OrthographicCamera, viewport: Viewport, enabled: boolean): void
  dispose(): void
}

/** The lobby's flight rises leftwards from its newel post beside the door, out through the ceiling. */
export function createLobbyStairs(scene: THREE.Scene, host: HTMLElement, onClimb: () => void): LobbyStairs {
  const art = drawStairs(lobbyFlight)
  const map = new THREE.CanvasTexture(art.art)
  map.colorSpace = THREE.SRGBColorSpace
  map.anisotropy = 4
  const flight = new THREE.Mesh(new THREE.PlaneGeometry(art.width, art.height), new THREE.MeshBasicMaterial({ map, transparent: true }))
  flight.position.set(art.left + art.width / 2, art.base + art.height / 2, CONFIG.stairs.z)
  scene.add(flight)

  const cue = document.createElement('button')
  cue.className = 'stairs-cue'
  cue.type = 'button'
  cue.textContent = '↑ Costume atelier'
  cue.addEventListener('click', onClimb)
  host.append(cue)

  return {
    art,
    hitTest: (raycaster) => pickPainted(raycaster, [flight]) !== null,
    sync(camera, viewport, enabled) {
      cue.disabled = !enabled
      const perUnit = viewport.width / (camera.right - camera.left)
      const visible = placeLabel(cue, { x: lobbyFlight.foot - 1.3, y: 2.9, width: 1.5 }, perUnit, camera, viewport, 0.075)
      cue.hidden = !visible
    },
    dispose() {
      cue.remove()
      scene.remove(flight)
      flight.geometry.dispose()
      flight.material.dispose()
      map.dispose()
    },
  }
}
