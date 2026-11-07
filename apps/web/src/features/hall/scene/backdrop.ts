import * as THREE from 'three'
import type { Assets } from './assets'
import { CONFIG } from './config'

export interface Backdrop {
  /** Keeps the wall and floor under the camera, however long the room is. */
  update(cameraX: number, viewWidth: number): void
  dispose(): void
}

/** Where the wallpaper and floorboards are anchored, so their pattern stays put in the world. */
const PATTERN_ORIGIN_X = -60
/** The wall and floor span this many view widths, so their ends never come into view. */
const SPAN_SCREENS = 3
const FLOOR_HEIGHT = 2.6

/**
 * One wall and one floor that travel with the camera. Their textures scroll the other way by
 * the same amount, so the stripes and boards look fixed to the room while the meshes move.
 */
export function createBackdrop(scene: THREE.Scene, assets: Assets): Backdrop {
  const wallTexture = assets.textures.wallpaper.clone()
  wallTexture.wrapS = THREE.RepeatWrapping
  wallTexture.needsUpdate = true
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(1, 30), new THREE.MeshBasicMaterial({ map: wallTexture }))
  wall.position.set(0, 15, -0.5)
  scene.add(wall)

  const floorTexture = assets.textures.floor.clone()
  floorTexture.wrapS = THREE.RepeatWrapping
  floorTexture.needsUpdate = true
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(1, FLOOR_HEIGHT),
    new THREE.MeshBasicMaterial({ map: floorTexture }),
  )
  floor.position.set(0, -FLOOR_HEIGHT / 2, -0.4)
  scene.add(floor)

  const tiles: [THREE.Mesh, THREE.Texture, number][] = [
    [wall, wallTexture, CONFIG.wallpaper.stripePairWidth],
    [floor, floorTexture, FLOOR_HEIGHT * assets.aspect.floor],
  ]
  let span = 0

  return {
    update(cameraX, viewWidth) {
      const width = Math.max(1, viewWidth) * SPAN_SCREENS
      if (width !== span) {
        span = width
        for (const [mesh, texture, tile] of tiles) {
          mesh.scale.x = width
          texture.repeat.x = width / tile
        }
      }
      const left = cameraX - width / 2
      for (const [mesh, texture, tile] of tiles) {
        mesh.position.x = cameraX
        texture.offset.x = ((left - PATTERN_ORIGIN_X) / tile) % 1
      }
    },
    dispose() {
      for (const [mesh, texture] of tiles) {
        scene.remove(mesh)
        mesh.geometry.dispose()
        ;(mesh.material as THREE.Material).dispose()
        texture.dispose()
      }
    },
  }
}
