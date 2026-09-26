import * as THREE from 'three'
import type { Assets } from './assets'
import { CONFIG } from './config'

export interface Backdrop {
  dispose(): void
}

export function createBackdrop(scene: THREE.Scene, assets: Assets, hallLength: number): Backdrop {
  const span = hallLength + 120
  const centerX = hallLength / 2

  const wallTexture = assets.textures.wallpaper.clone()
  wallTexture.wrapS = THREE.RepeatWrapping
  wallTexture.repeat.set(span / CONFIG.wallpaper.stripePairWidth, 1)
  wallTexture.needsUpdate = true

  const wall = new THREE.Mesh(
    new THREE.PlaneGeometry(span, 30),
    new THREE.MeshBasicMaterial({ map: wallTexture }),
  )
  wall.position.set(centerX, 15, -0.5)
  scene.add(wall)

  const floorHeight = 2.6
  const floorTexture = assets.textures.floor.clone()
  floorTexture.wrapS = THREE.RepeatWrapping
  floorTexture.needsUpdate = true

  const tileWidth = floorHeight * assets.aspect.floor
  floorTexture.repeat.set(span / tileWidth, 1)

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(span, floorHeight),
    new THREE.MeshBasicMaterial({ map: floorTexture }),
  )
  floor.position.set(centerX, -floorHeight / 2, -0.4)
  scene.add(floor)

  return {
    dispose() {
      for (const mesh of [wall, floor]) {
        mesh.geometry.dispose()
        const material = mesh.material as THREE.MeshBasicMaterial
        material.map?.dispose()
        material.dispose()
        scene.remove(mesh)
      }
    },
  }
}
