import * as THREE from 'three'
import type { Assets } from './assets'
import { disposeBoards, plane } from './board'
import { pickPainted } from './hit'
import { CONFIG } from './config'

/*  The guest board, hung past the gift shop where the walk ends. In the hall it
    is only the artist's board on the wall; the notes themselves are read and
    written on the guest board screens it opens, which is where there is room
    for them.

    Built the way the gift shop is, and on the same condition — the first frame
    the layout knows where the hall ends. */

export interface GuestBoard {
  x: number
  /** Whether a tap landed on the board where it is actually drawn. */
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

    // By its drawn alpha, so the transparent canvas around the board is not a target.
    hitTest(raycaster) {
      return pickPainted(raycaster, [boardMesh]) !== null
    },

    dispose() {
      disposeBoards(scene, group)
    },
  }
}
