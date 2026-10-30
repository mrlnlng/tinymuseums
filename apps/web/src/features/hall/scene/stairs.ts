import * as THREE from 'three'
import { CONFIG } from './config'
import { flightHeight, flightRise, flightWidth, lobbyFlight } from './flights'
import { pickPainted } from './hit'

const { stairs } = CONFIG

export interface LobbyStairs {
  hitTest(raycaster: THREE.Raycaster): boolean
  dispose(): void
}

interface Textures {
  stairs: THREE.Texture
  /** The atelier's damask, seen through the cut-away above the ceiling. */
  upstairsWall: THREE.Texture
  floor: THREE.Texture
  floorAspect: number
}

/**
 * The lobby staircase and the floor above it, drawn as a cut-away: the flight climbs into the
 * upstairs floor slab, whose top is the landing, and the atelier's wall shows above it.
 */
export function createLobbyStairs(scene: THREE.Scene, textures: Textures): LobbyStairs {
  const group = new THREE.Group()
  const owned: THREE.Texture[] = []

  const map = textures.stairs
  map.colorSpace = THREE.SRGBColorSpace
  map.anisotropy = 4
  const flight = new THREE.Mesh(
    new THREE.PlaneGeometry(flightWidth, flightHeight),
    new THREE.MeshBasicMaterial({ map, transparent: true }),
  )
  flight.position.set(lobbyFlight.left + flightWidth / 2, lobbyFlight.base + flightHeight / 2, stairs.lobby.z)
  group.add(flight)

  const { thickness, right, z } = stairs.ceiling
  const left = lobbyFlight.left - 14
  const width = right - left
  const top = lobbyFlight.base + flightRise
  const upstairsHeight = 8

  const wall = textures.upstairsWall
  wall.colorSpace = THREE.SRGBColorSpace
  wall.wrapS = THREE.RepeatWrapping
  wall.wrapT = THREE.RepeatWrapping
  const [tileW, tileH] = CONFIG.atelier.wallTile
  wall.repeat.set(width / tileW, upstairsHeight / tileH)
  owned.push(wall)
  const upstairs = new THREE.Mesh(new THREE.PlaneGeometry(width, upstairsHeight), new THREE.MeshBasicMaterial({ map: wall }))
  upstairs.position.set(left + width / 2, top + upstairsHeight / 2, stairs.lobby.z - 0.05)
  group.add(upstairs)

  // The slab's face is the hall's own planks, so the floor upstairs reads as the same wood.
  const planks = textures.floor.clone()
  planks.wrapS = THREE.RepeatWrapping
  planks.repeat.set(width / (thickness * 3 * textures.floorAspect), thickness / 2.6)
  planks.offset.y = 1 - thickness / 2.6
  planks.needsUpdate = true
  owned.push(planks)
  const slab = new THREE.Mesh(new THREE.PlaneGeometry(width, thickness), new THREE.MeshBasicMaterial({ map: planks }))
  slab.position.set(left + width / 2, top - thickness / 2, z)
  group.add(slab)

  const trim = new THREE.Mesh(new THREE.PlaneGeometry(width, 0.05), new THREE.MeshBasicMaterial({ color: 0x5a3122 }))
  trim.position.set(left + width / 2, top - thickness, z + 0.01)
  group.add(trim)

  // Where the floor above ends, its wall comes down to meet the slab.
  const end = new THREE.Mesh(new THREE.PlaneGeometry(0.12, upstairsHeight + thickness), new THREE.MeshBasicMaterial({ color: 0x5a3122 }))
  end.position.set(right - 0.06, top - thickness + (upstairsHeight + thickness) / 2, z + 0.01)
  group.add(end)

  scene.add(group)

  return {
    hitTest(raycaster) {
      return pickPainted(raycaster, [flight]) !== null
    },
    dispose() {
      scene.remove(group)
      group.traverse((node) => {
        if (!(node instanceof THREE.Mesh)) return
        node.geometry.dispose()
        ;(node.material as THREE.MeshBasicMaterial).dispose()
      })
      for (const texture of owned) texture.dispose()
      map.dispose()
    },
  }
}
