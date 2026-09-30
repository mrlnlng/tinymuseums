import * as THREE from 'three'
import type { Assets, Scenery } from './assets'
import { disposeBoards, plane, stretchedBoard, type Mark } from './board'
import { hitsAt, pickAt, type WorldPoint } from './hit'
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
  hitTestAt(point: WorldPoint): boolean
  hitTestBeanbagAt(point: WorldPoint, occupied: boolean): boolean
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

  return {
    x,
    mark: { x: x + board.dx, y: board.centerY, width: board.width },
    signMark: { x: x + signText.dx, y: signText.centerY, width: signText.width },
    seat: { x: x + seat.dx, y: seat.centerY, height: seat.height },

    hitTestAt(point) {
      return pickAt(point, [boardMesh]) !== null
    },

    hitTestBeanbagAt(point, occupied) {
      const uv = hitsAt(point, [sitMesh])[0]?.uv
      const top = occupied ? occupiedTop : v[1]
      return !!uv && uv.u >= u[0] && uv.u <= u[1] && uv.v >= v[0] && uv.v <= top
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
