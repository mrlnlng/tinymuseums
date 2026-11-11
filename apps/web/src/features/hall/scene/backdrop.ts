import * as THREE from 'three'
import type { Assets } from './assets'
import { CONFIG } from './config'

export interface Backdrop {
  /** Keeps the wall, floor and dressings under the camera, however long the room is. */
  update(cameraX: number, viewWidth: number, viewTop: number): void
  dispose(): void
}

/** Where the wallpaper and floorboards are anchored, so their pattern stays put in the world. */
const PATTERN_ORIGIN_X = -60
/** The backdrop spans this many view widths, so its ends never come into view. */
const SPAN_SCREENS = 3
const FLOOR_HEIGHT = 2.6
const WALL_HEIGHT = 30
const CURTAIN_BAND_HEIGHT = 4

/**
 * One wall, floor and its dressings that travel with the camera. Their textures scroll the other
 * way by the same amount, so the pattern looks fixed to the room while the meshes move.
 */
export function createBackdrop(scene: THREE.Scene, assets: Assets): Backdrop {
  const wallTexture = assets.textures.wallpaper.clone()
  wallTexture.wrapS = THREE.RepeatWrapping
  wallTexture.wrapT = THREE.RepeatWrapping
  wallTexture.needsUpdate = true
  const wallTileWidth = CONFIG.wall.tileWidth
  const wallTileHeight = wallTileWidth / assets.aspect.wallpaper
  wallTexture.repeat.y = WALL_HEIGHT / wallTileHeight
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(1, WALL_HEIGHT), new THREE.MeshBasicMaterial({ map: wallTexture }))
  wall.position.set(0, WALL_HEIGHT / 2, -0.5)
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

  const baseboardTexture = assets.textures.baseboard.clone()
  baseboardTexture.wrapS = THREE.RepeatWrapping
  baseboardTexture.needsUpdate = true
  const baseboardTileWidth = CONFIG.baseboard.height * assets.aspect.baseboard
  const baseboard = new THREE.Mesh(
    new THREE.PlaneGeometry(1, CONFIG.baseboard.height),
    new THREE.MeshBasicMaterial({ map: baseboardTexture, transparent: true }),
  )
  baseboard.position.set(0, CONFIG.baseboard.height / 2, CONFIG.baseboard.z)
  scene.add(baseboard)

  const curtainTexture = assets.textures.curtain.clone()
  curtainTexture.wrapS = THREE.RepeatWrapping
  curtainTexture.wrapT = THREE.ClampToEdgeWrapping
  curtainTexture.needsUpdate = true
  const curtain = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({ map: curtainTexture, transparent: true }),
  )
  curtain.position.z = CONFIG.curtain.z
  scene.add(curtain)

  const band = new THREE.Mesh(
    new THREE.PlaneGeometry(1, CURTAIN_BAND_HEIGHT),
    new THREE.MeshBasicMaterial({ color: CONFIG.curtain.bandColor }),
  )
  band.position.z = CONFIG.curtain.z
  scene.add(band)

  const tiles: [THREE.Mesh, THREE.Texture, number][] = [
    [wall, wallTexture, wallTileWidth],
    [floor, floorTexture, FLOOR_HEIGHT * assets.aspect.floor],
    [baseboard, baseboardTexture, baseboardTileWidth],
    [curtain, curtainTexture, 0],
  ]
  let span = 0
  let curtainTop = Number.NaN
  let curtainHeight = 0
  let curtainTile = 0

  return {
    update(cameraX, viewWidth, viewTop) {
      const width = Math.max(1, viewWidth) * SPAN_SCREENS
      const nextHeight = THREE.MathUtils.clamp(
        viewTop - CONFIG.curtain.clearY,
        CONFIG.curtain.minHeight,
        CONFIG.curtain.height,
      )
      if (width !== span) {
        span = width
        for (const [mesh, texture, tile] of tiles) {
          mesh.scale.x = width
          if (mesh !== curtain) texture.repeat.x = width / tile
        }
        if (curtainTile > 0) curtainTexture.repeat.x = width / curtainTile
        band.scale.x = width
      }
      if (viewTop !== curtainTop || nextHeight !== curtainHeight) {
        curtainTop = viewTop
        curtainHeight = nextHeight
        curtainTile = curtainHeight * assets.aspect.curtain
        curtain.scale.y = curtainHeight
        curtain.position.y = viewTop - curtainHeight / 2
        curtainTexture.repeat.x = span / curtainTile
        band.position.y = viewTop + CURTAIN_BAND_HEIGHT / 2
      }
      const left = cameraX - span / 2
      for (const [mesh, texture, tile] of tiles) {
        mesh.position.x = cameraX
        const tileWidth = mesh === curtain ? curtainTile : tile
        texture.offset.x = ((left - PATTERN_ORIGIN_X) / tileWidth) % 1
      }
      band.position.x = cameraX
    },
    dispose() {
      for (const [mesh, texture] of tiles) {
        scene.remove(mesh)
        mesh.geometry.dispose()
        ;(mesh.material as THREE.Material).dispose()
        texture.dispose()
      }
      scene.remove(band)
      band.geometry.dispose()
      ;(band.material as THREE.Material).dispose()
    },
  }
}
