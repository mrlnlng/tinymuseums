import * as THREE from 'three'
import type { Assets } from './assets'
import { disposeBoards, plane, stretchedBoard, type Mark } from './board'
import { CONFIG } from './config'

/*  The gift shop, at the far end of the hall — the last thing on the walk and,
    like the visitor centre at the other end, scenery rather than art: the
    counter with its shelves, a note closing the exhibition, the shop's board,
    and the link out to the print shop.

    It cannot be built with the rest of the scene the way the visitor centre is,
    because the hall arrives a slice at a time and until the last slice lands
    there is no last painting for the shop to stand past. So the frame loop
    builds it the moment the layout knows where it goes, and from then on it
    behaves exactly as the visitor centre does: a handful of planes, left
    standing rather than virtualised. */

export interface GiftShopMarks {
  /** The paper the closing note is written on. */
  note: Mark
  /** The board over the counter. */
  sign: Mark
  /** The pill under the board — the link out to the shop. */
  button: Mark & { height: number }
}

export interface GiftShop {
  /** Where the camera parks, and what everything here is measured against. */
  x: number
  marks: GiftShopMarks
  dispose(): void
}

export function createGiftShop(scene: THREE.Scene, assets: Assets, x: number): GiftShop {
  const { counter, note, sign, button, noteText, signText } = CONFIG.giftShop
  const group = new THREE.Group()

  // --- the counter ---------------------------------------------------------
  group.add(
    plane(
      counter.height * assets.aspect.giftShop,
      counter.height,
      assets.textures.giftShop,
      x + counter.dx,
      counter.centerY,
      counter.z,
    ),
  )

  /*  The note. One plane, not three: at this width the drawing is within a
      percent of the proportions it was painted at, so there is nothing to
      stretch and the pegs in its corners stay round. */
  group.add(
    plane(note.width, note.height, assets.textures.plaque, x + note.dx, note.centerY, note.z),
  )

  // --- the board over the counter -----------------------------------------
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

  scene.add(group)

  return {
    x,

    marks: {
      note: { x: x + noteText.dx, y: noteText.centerY, width: noteText.width },
      sign: { x: x + signText.dx, y: signText.centerY, width: signText.width },
      button: {
        x: x + button.dx,
        y: button.centerY,
        width: button.width,
        height: button.height,
      },
    },

    dispose() {
      disposeBoards(scene, group)
    },
  }
}
