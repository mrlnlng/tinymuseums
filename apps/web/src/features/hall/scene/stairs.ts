import * as THREE from 'three'
import { CONFIG } from './config'
import { lobbyFlight } from './flights'
import { extendLobbyStairArt } from './lobby-stair-art'
import { pickPainted } from './hit'
import { placeLabel, type Viewport } from './overlay'

export interface LobbyStairs {
  readonly railing: string
  hitTest(raycaster: THREE.Raycaster): boolean
  sync(camera: THREE.OrthographicCamera, viewport: Viewport, enabled: boolean): void
  dispose(): void
}

/** The mock's full-height flight: wooden steps rise out through the ceiling. */
export function createLobbyStairs(
  scene: THREE.Scene,
  textures: { stairs: THREE.Texture },
  host: HTMLElement,
  onClimb: () => void,
): LobbyStairs {
  const group = new THREE.Group()
  const art = extendLobbyStairArt(textures.stairs.image)
  const map = art.texture
  map.colorSpace = THREE.SRGBColorSpace
  map.anisotropy = 4
  const { width, height } = lobbyFlight
  const flight = new THREE.Mesh(new THREE.PlaneGeometry(width, height), new THREE.MeshBasicMaterial({ map, transparent: true}))
  flight.position.set(lobbyFlight.left + width / 2, lobbyFlight.base + height / 2, CONFIG.stairs.lobby.z)
  group.add(flight)
  scene.add(group)

  const cue = document.createElement('button')
  cue.className = 'stairs-cue'
  cue.type = 'button'
  cue.textContent = '↑ Costume atelier'
  cue.addEventListener('click', onClimb)
  host.append(cue)

  return {
    railing: art.railing,
    hitTest: (raycaster) => pickPainted(raycaster, [flight]) !== null,
    sync(camera, viewport, enabled) {
      cue.disabled = !enabled
      const perUnit = viewport.width / (camera.right - camera.left)
      const visible = placeLabel(cue, { x: -0.9, y: 3.65, width: 1.65 }, perUnit, camera, viewport, 0.075)
      cue.hidden = !visible
    },
    dispose() {
      cue.remove()
      scene.remove(group)
      group.traverse((node) => {
        if (!(node instanceof THREE.Mesh)) return
        node.geometry.dispose()
        ;(node.material as THREE.Material).dispose()
      })
      map.dispose()
      textures.stairs.dispose()
    },
  }
}
