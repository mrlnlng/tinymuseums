import * as THREE from 'three'
import type { Assets } from './assets'
import { disposeBoards, plane, type Mark } from './board'
import { pickPainted } from './hit'
import { CONFIG } from './config'

export interface GuestBoard {
  x: number
  mark: Mark
  hitTest(raycaster: THREE.Raycaster): boolean
  dispose(): void
}

export function createGuestBoard(scene: THREE.Scene, assets: Assets, x: number): GuestBoard {
  const { board } = CONFIG.guestBoard
  const group = new THREE.Group()

  const boardMesh = plane(
    board.width,
    board.width / assets.aspect.guestBoard,
    assets.textures.guestBoard,
    x + board.dx,
    board.centerY,
    board.z,
  )
  group.add(boardMesh)
  scene.add(group)

  return {
    x,
    mark: { x: x + board.dx, y: board.centerY, width: board.width },

    hitTest(raycaster) {
      return pickPainted(raycaster, [boardMesh]) !== null
    },

    dispose() {
      disposeBoards(scene, group)
    },
  }
}
