import * as THREE from 'three'
import type { Assets } from './assets'
import { CONFIG } from './config'
import { garlandRibbon } from './garland'

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
    wash.addColorStop(1, 'rgba(38, 4, 16, 0.06)')
    ink.fillStyle = wash
    ink.fillRect(0, 0, 8, 256)
  })
}

function floorShadeTexture(): THREE.CanvasTexture {
  return painted(8, 256, (ink) => {
    const shade = ink.createLinearGradient(0, 0, 0, 256)
    shade.addColorStop(0, 'rgba(36, 10, 6, 0.1)')
    shade.addColorStop(0.16 / FLOOR_HEIGHT, 'rgba(36, 10, 6, 0)')
    shade.addColorStop(0.7 / FLOOR_HEIGHT, 'rgba(30, 8, 6, 0)')
    shade.addColorStop(1, 'rgba(30, 8, 6, 0.06)')
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

  const garlandShape = { ...CONFIG.garland, aspect: assets.aspect.garland }
  const garlandGeometry = new THREE.BufferGeometry()
  const garland = new THREE.Mesh(
    garlandGeometry,
    new THREE.MeshBasicMaterial({ map: assets.textures.garland, transparent: true, depthWrite: false, side: THREE.DoubleSide }),
  )
  garland.frustumCulled = false
  scene.add(garland)
  let garlandLoops = 0

  /** The garland's loops over the view; built once for the span, then moved a whole loop at a time. */
  function hangGarland(left: number, originX: number): void {
    const loops = Math.ceil(span / garlandShape.loop) + 3
    if (loops > garlandLoops) {
      garlandLoops = loops
      const ribbon = garlandRibbon(garlandShape, loops)
      garlandGeometry.setAttribute('position', new THREE.BufferAttribute(ribbon.positions, 3))
      garlandGeometry.setAttribute('uv', new THREE.BufferAttribute(ribbon.uvs, 2))
      garlandGeometry.setIndex(new THREE.BufferAttribute(ribbon.indices, 1))
    }
    const first = Math.floor((left - originX) / garlandShape.loop) - 1
    garland.position.set(originX + first * garlandShape.loop, viewTopY - garlandShape.top, garlandShape.z)
  }

  const tiles: [THREE.Mesh, THREE.Texture, number][] = [
    [wall, wallTexture, wallTileWidth],
    [floor, floorTexture, FLOOR_HEIGHT * assets.aspect.floor],
    [baseboard, baseboardTexture, baseboardTileWidth],
  ]
  let span = 0
  let viewTopY = 0

  return {
    update(cameraX, viewWidth, viewTop) {
      const width = Math.max(1, viewWidth) * SPAN_SCREENS
      if (width !== span) {
        span = width
        for (const [mesh, texture, tile] of tiles) {
          mesh.scale.x = width
          texture.repeat.x = width / tile
        }
      }

      // The garland alone dresses the top of the wall now; it hangs from the view's top edge.
      const originX = PATTERN_ORIGIN_X

      const left = cameraX - span / 2
      for (const [mesh, texture, tile] of tiles) {
        mesh.position.x = cameraX
        texture.offset.x = ((left - PATTERN_ORIGIN_X) / tile) % 1
      }

      wallShade.scale.set(Math.max(1, viewWidth), viewTop, 1)
      wallShade.position.set(cameraX, viewTop / 2, WALL_SHADE_Z)
      floorShade.scale.set(Math.max(1, viewWidth), FLOOR_HEIGHT, 1)
      floorShade.position.set(cameraX, -FLOOR_HEIGHT / 2, FLOOR_SHADE_Z)

      viewTopY = viewTop
      hangGarland(left, originX)
    },
    dispose() {
      for (const [mesh, texture] of tiles) {
        scene.remove(mesh)
        mesh.geometry.dispose()
        ;(mesh.material as THREE.Material).dispose()
        texture.dispose()
      }
      scene.remove(garland)
      garlandGeometry.dispose()
      ;(garland.material as THREE.Material).dispose()
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
