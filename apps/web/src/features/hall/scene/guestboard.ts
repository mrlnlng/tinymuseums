import * as THREE from 'three'
import type { Scenery } from './assets'
import { disposeBoards, plane, type Mark } from './board'
import { pickPainted } from './hit'
import { CONFIG } from './config'

export interface Seat {
  x: number
  y: number
  height: number
}

export interface GuestBoard {
  x: number
  mark: Mark
  seat: Seat
  hitTest(raycaster: THREE.Raycaster): boolean
  hitTestBeanbag(raycaster: THREE.Raycaster, occupied: boolean): boolean
  hitTestSketchBox(raycaster: THREE.Raycaster): boolean
  dispose(): void
}

export function createGuestBoard(scene: THREE.Scene, scenery: Scenery, x: number): GuestBoard {
  const { board, sitArea, seat } = CONFIG.guestBoard
  const group = new THREE.Group()

  const boardMesh = plane(
    board.width,
    board.width / scenery.aspect.guestBoard,
    scenery.textures.guestBoard,
    x + board.dx,
    board.centerY,
    board.z,
  )
  group.add(boardMesh)

  const sitMesh = plane(
    sitArea.height * scenery.aspect.sitArea,
    sitArea.height,
    scenery.textures.sitArea,
    x + sitArea.dx,
    sitArea.centerY,
    sitArea.z,
  )
  group.add(sitMesh)
  scene.add(group)

  const { u, v, occupiedTop } = sitArea.beanbag
  const { sketchBox } = sitArea

  function sitUv(raycaster: THREE.Raycaster): THREE.Vector2 | undefined {
    return raycaster.intersectObject(sitMesh, false)[0]?.uv
  }

  return {
    x,
    mark: { x: x + board.dx, y: board.centerY, width: board.width },
    seat: { x: x + seat.dx, y: seat.centerY, height: seat.height },

    hitTest(raycaster) {
      return pickPainted(raycaster, [boardMesh]) !== null
    },

    hitTestBeanbag(raycaster, occupied) {
      const uv = sitUv(raycaster)
      const top = occupied ? occupiedTop : v[1]
      return !!uv && uv.x >= u[0] && uv.x <= u[1] && uv.y >= v[0] && uv.y <= top
    },

    hitTestSketchBox(raycaster) {
      const uv = sitUv(raycaster)
      return (
        !!uv &&
        uv.x >= sketchBox.u[0] &&
        uv.x <= sketchBox.u[1] &&
        uv.y >= sketchBox.v[0] &&
        uv.y <= sketchBox.v[1]
      )
    },

    dispose() {
      disposeBoards(scene, group)
    },
  }
}
