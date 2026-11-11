import * as THREE from 'three'
import type { Assets } from './assets'
import { CONFIG } from './config'

export interface Backdrop {
  /** Keeps the wall, floor and dressings under the camera, however long the room is. */
  update(cameraX: number, viewWidth: number, viewTop: number): void
  /** The valance's current placement, so the string lights can sit on its painted bulbs. */
  curtain(): { top: number; height: number; tile: number; originX: number; z: number }
  dispose(): void
}

/** Where the wallpaper and floorboards are anchored, so their pattern stays put in the world. */
const PATTERN_ORIGIN_X = -60
/** The backdrop spans this many view widths, so its ends never come into view. */
const SPAN_SCREENS = 3
const FLOOR_HEIGHT = 2.6
const WALL_HEIGHT = 30
const CURTAIN_BAND_HEIGHT = 4
const WALL_SHADE_Z = -0.47
const FLOOR_SHADE_Z = -0.39

/** Painted at a few times its nominal size so the washes stay smooth on dense screens. */
function painted(width: number, height: number, draw: (ink: CanvasRenderingContext2D) => void): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ink = canvas.getContext('2d')
  if (ink) draw(ink)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.minFilter = THREE.LinearMipmapLinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.anisotropy = 4
  return texture
}

function wallShadeTexture(): THREE.CanvasTexture {
  return painted(8, 256, (ink) => {
    const wash = ink.createLinearGradient(0, 0, 0, 256)
    wash.addColorStop(0, 'rgba(255, 196, 128, 0.08)')
    wash.addColorStop(0.5, 'rgba(255, 196, 128, 0)')
    wash.addColorStop(0.72, 'rgba(38, 4, 16, 0)')
    wash.addColorStop(1, 'rgba(38, 4, 16, 0.2)')
    ink.fillStyle = wash
    ink.fillRect(0, 0, 8, 256)
  })
}

function floorShadeTexture(): THREE.CanvasTexture {
  return painted(8, 256, (ink) => {
    const shade = ink.createLinearGradient(0, 0, 0, 256)
    shade.addColorStop(0, 'rgba(36, 10, 6, 0.28)')
    shade.addColorStop(0.16 / FLOOR_HEIGHT, 'rgba(36, 10, 6, 0)')
    shade.addColorStop(0.7 / FLOOR_HEIGHT, 'rgba(30, 8, 6, 0)')
    shade.addColorStop(1, 'rgba(30, 8, 6, 0.16)')
    ink.fillStyle = shade
    ink.fillRect(0, 0, 8, 256)
  })
}

/**
 * One wall, floor and its dressings that travel with the camera. Their textures scroll the other
 * way, so the pattern looks fixed to the room while the meshes move.
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
  const curtainGeometry = new THREE.PlaneGeometry(1, 1)
  const curtainMaterial = new THREE.MeshBasicMaterial({ map: curtainTexture, transparent: true })
  const curtain = new THREE.Mesh(curtainGeometry, curtainMaterial)
  curtain.matrixAutoUpdate = false
  scene.add(curtain)

  const shadowMaterial = new THREE.MeshBasicMaterial({
    map: curtainTexture,
    color: '#000000',
    transparent: true,
    opacity: CONFIG.curtain.shadow.opacity,
    depthWrite: false,
  })
  const shadow = new THREE.Mesh(curtainGeometry, shadowMaterial)
  shadow.matrixAutoUpdate = false
  scene.add(shadow)

  const band = new THREE.Mesh(
    new THREE.PlaneGeometry(1, CURTAIN_BAND_HEIGHT),
    new THREE.MeshBasicMaterial({ color: CONFIG.curtain.bandColor }),
  )
  band.position.z = CONFIG.curtain.z
  scene.add(band)

  const wallShadeMap = wallShadeTexture()
  const wallShade = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({ map: wallShadeMap, transparent: true, depthWrite: false }),
  )
  wallShade.position.z = WALL_SHADE_Z
  scene.add(wallShade)

  const floorShadeMap = floorShadeTexture()
  const floorShade = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({ map: floorShadeMap, transparent: true, depthWrite: false }),
  )
  floorShade.position.z = FLOOR_SHADE_Z
  scene.add(floorShade)

  const tiles: [THREE.Mesh, THREE.Texture, number][] = [
    [wall, wallTexture, wallTileWidth],
    [floor, floorTexture, FLOOR_HEIGHT * assets.aspect.floor],
    [baseboard, baseboardTexture, baseboardTileWidth],
  ]
  const state = { top: 0, height: 0, tile: 0, originX: PATTERN_ORIGIN_X, z: CONFIG.curtain.z }
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
          texture.repeat.x = width / tile
        }
        if (curtainTile > 0) curtainTexture.repeat.x = width / curtainTile
        band.scale.x = width
      }
      if (viewTop !== curtainTop || nextHeight !== curtainHeight) {
        curtainTop = viewTop
        curtainHeight = nextHeight
        curtainTile = curtainHeight * assets.aspect.curtain
        curtainTexture.repeat.x = span / curtainTile
        band.position.y = viewTop + CURTAIN_BAND_HEIGHT / 2
      }

      const originX = PATTERN_ORIGIN_X - cameraX * CONFIG.curtain.parallax
      const baseY = viewTop - nextHeight / 2
      curtain.matrix.set(
        width, 0, 0, cameraX,
        0, nextHeight, 0, baseY,
        0, 0, 1, CONFIG.curtain.z,
        0, 0, 0, 1,
      )
      curtain.matrixWorldNeedsUpdate = true
      const shadowY = baseY - CONFIG.curtain.shadow.drop * nextHeight
      shadow.matrix.set(
        width, 0, 0, cameraX,
        0, nextHeight, 0, shadowY,
        0, 0, 1, CONFIG.curtain.z - 0.02,
        0, 0, 0, 1,
      )
      shadow.matrixWorldNeedsUpdate = true

      const left = cameraX - span / 2
      for (const [mesh, texture, tile] of tiles) {
        mesh.position.x = cameraX
        texture.offset.x = ((left - PATTERN_ORIGIN_X) / tile) % 1
      }
      curtainTexture.offset.x = ((left - originX) / curtainTile) % 1
      band.position.x = cameraX

      wallShade.scale.set(Math.max(1, viewWidth), viewTop, 1)
      wallShade.position.set(cameraX, viewTop / 2, WALL_SHADE_Z)
      floorShade.scale.set(Math.max(1, viewWidth), FLOOR_HEIGHT, 1)
      floorShade.position.set(cameraX, -FLOOR_HEIGHT / 2, FLOOR_SHADE_Z)

      state.top = viewTop
      state.height = nextHeight
      state.tile = curtainTile
      state.originX = originX
    },
    curtain() {
      return state
    },
    dispose() {
      for (const [mesh, texture] of tiles) {
        scene.remove(mesh)
        mesh.geometry.dispose()
        ;(mesh.material as THREE.Material).dispose()
        texture.dispose()
      }
      scene.remove(curtain)
      scene.remove(shadow)
      curtainGeometry.dispose()
      curtainMaterial.dispose()
      shadowMaterial.dispose()
      curtainTexture.dispose()
      scene.remove(band)
      band.geometry.dispose()
      ;(band.material as THREE.Material).dispose()
      scene.remove(wallShade)
      wallShade.geometry.dispose()
      ;(wallShade.material as THREE.Material).dispose()
      wallShadeMap.dispose()
      scene.remove(floorShade)
      floorShade.geometry.dispose()
      ;(floorShade.material as THREE.Material).dispose()
      floorShadeMap.dispose()
    },
  }
}
