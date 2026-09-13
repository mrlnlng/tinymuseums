import * as THREE from 'three'
import type { Assets } from './assets'
import { disposeBoards, plane, type Mark } from './board'
import { pickPainted } from './hit'
import { CONFIG } from './config'

/*  The guest board, hung past the gift shop where the walk ends. In the hall it
    is the artist's board with the newest notes pinned to it, drawn over it as
    DOM in the same places the guest board screen pins them (see GuestBoardNotes
    in overlay.ts). The notes are read and written on the screens it opens,
    which is where there is room for them.

    Built the way the gift shop is, and on the same condition — the first frame
    the layout knows where the hall ends. */

export interface GuestBoard {
  x: number
  /** The board drawing's canvas, centred, which the pinned notes are laid out against. */
  mark: Mark
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
    mark: { x: x + board.dx, y: board.centerY, width: board.width },

    // By its drawn alpha, so the transparent canvas around the board is not a target.
    hitTest(raycaster) {
      return pickPainted(raycaster, [boardMesh]) !== null
    },

    dispose() {
      disposeBoards(scene, group)
    },
  }
}
