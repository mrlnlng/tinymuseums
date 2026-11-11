import * as THREE from 'three'
import type { Assets, Scenery } from './assets'
import { disposeBoards, plane, stretchedBoard, type Mark } from './board'
import { CONFIG } from './config'
import { groundShadow } from './shadow'

export interface GiftShopMarks {
  note: Mark
  sign: Mark
  button: Mark & { height: number }
}

export interface GiftShop {
  x: number
  marks: GiftShopMarks
  dispose(): void
}

export function createGiftShop(
  scene: THREE.Scene,
  assets: Assets,
  scenery: Scenery,
  x: number,
): GiftShop {
  const { counter, note, sign, button, noteText, signText } = CONFIG.giftShop
  const group = new THREE.Group()
  const shadows: THREE.Mesh[] = []
  const counterWidth = counter.height * scenery.aspect.giftShop

  group.add(
    plane(
      counterWidth,
      counter.height,
      scenery.textures.giftShop,
      x + counter.dx,
      counter.centerY,
      counter.z,
    ),
  )
  shadows.push(groundShadow(counterWidth * 0.9, x + counter.dx, Math.min(-0.02, counter.centerY - counter.height / 2 + 0.03)))
  group.add(shadows[shadows.length - 1])

  group.add(
    plane(note.width, note.height, assets.textures.plaque, x + note.dx, note.centerY, note.z),
  )

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
      for (const shadow of shadows) {
        group.remove(shadow)
        shadow.geometry.dispose()
      }
      disposeBoards(scene, group)
    },
  }
}
