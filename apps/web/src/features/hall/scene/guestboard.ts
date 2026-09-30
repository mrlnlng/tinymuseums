import * as THREE from 'three'
import type { Assets, Scenery } from './assets'
import { disposeBoards, plane, stretchedBoard, type Mark } from './board'
import { hitsAt, pickAt, pickPainted, type WorldPoint } from './hit'
import { CONFIG } from './config'

export interface Seat {
  x: number
  y: number
  height: number
}

export interface GuestBoard {
  x: number
  mark: Mark
  signMark: Mark
  seat: Seat
  hitTest(raycaster: THREE.Raycaster): boolean
  hitTestAt(point: WorldPoint): boolean
  hitTestBeanbag(raycaster: THREE.Raycaster, occupied: boolean): boolean
  hitTestBeanbagAt(point: WorldPoint, occupied: boolean): boolean
  hitTestDesktop(raycaster: THREE.Raycaster): boolean
  hitTestDesktopAt(point: WorldPoint): boolean
  dispose(): void
}

export function createGuestBoard(scene: THREE.Scene, assets: Assets, scenery: Scenery, x: number): GuestBoard {
  const { board, sign, signText, sitArea, seat } = CONFIG.guestBoard
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

  group.add(
    stretchedBoard(
      assets.textures.plaque,
      assets.aspect.plaque,
      x + sign.dx,
      sign.centerY,
      sign.z,
      sign.width,
      sign.height,
    ),
  )

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
  const { desktop } = sitArea

  function sitUv(raycaster: THREE.Raycaster): THREE.Vector2 | undefined {
    return raycaster.intersectObject(sitMesh, false)[0]?.uv
  }

  return {
    x,
    mark: { x: x + board.dx, y: board.centerY, width: board.width },
    signMark: { x: x + signText.dx, y: signText.centerY, width: signText.width },
    seat: { x: x + seat.dx, y: seat.centerY, height: seat.height },

    hitTest(raycaster) {
      return pickPainted(raycaster, [boardMesh]) !== null
    },

    hitTestAt(point) {
      return pickAt(point, [boardMesh]) !== null
    },

    hitTestBeanbag(raycaster, occupied) {
      const uv = sitUv(raycaster)
      const top = occupied ? occupiedTop : v[1]
      return !!uv && uv.x >= u[0] && uv.x <= u[1] && uv.y >= v[0] && uv.y <= top
    },

    hitTestBeanbagAt(point, occupied) {
      const uv = hitsAt(point, [sitMesh])[0]?.uv
      const top = occupied ? occupiedTop : v[1]
      return !!uv && uv.u >= u[0] && uv.u <= u[1] && uv.v >= v[0] && uv.v <= top
    },

    hitTestDesktop(raycaster) {
      const uv = sitUv(raycaster)
      return (
        !!uv &&
        uv.x >= desktop.u[0] &&
        uv.x <= desktop.u[1] &&
        uv.y >= desktop.v[0] &&
        uv.y <= desktop.v[1]
      )
    },

    hitTestDesktopAt(point) {
      const uv = hitsAt(point, [sitMesh])[0]?.uv
      return (
        !!uv &&
        uv.u >= desktop.u[0] &&
        uv.u <= desktop.u[1] &&
        uv.v >= desktop.v[0] &&
        uv.v <= desktop.v[1]
      )
    },

    dispose() {
      disposeBoards(scene, group)
    },
  }
}
