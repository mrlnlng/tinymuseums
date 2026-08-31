import * as THREE from 'three'
import type { Assets } from './assets'

/*  The room: a flat cream wall and a tiled wood floor from the Tiny Museum art. Flat 2D and unlit — the sprites are already shaded by hand, and faking depth or lighting them again would fight the art. */

export interface Backdrop {
  dispose(): void
}

export function createBackdrop(scene: THREE.Scene, assets: Assets, hallLength: number): Backdrop {
  const span = hallLength + 120
  const centerX = hallLength / 2

  const wall = new THREE.Mesh(
    new THREE.PlaneGeometry(span, 30),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(assets.manifest.room.wallColor) }),
  )
  wall.position.set(centerX, 15, -0.5)
  scene.add(wall)

  const floorHeight = 2.6
  const floorTexture = assets.textures.floor.clone()
  floorTexture.wrapS = THREE.RepeatWrapping
  floorTexture.needsUpdate = true

  // Keep the planks at their painted proportions rather than stretching them.
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
