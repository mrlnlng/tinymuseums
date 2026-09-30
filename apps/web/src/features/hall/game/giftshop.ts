import type Phaser from 'phaser'
import type { Mark } from '../scene/board.ts'
import { CONFIG } from '../scene/config.ts'
import type { GameAssets, GameFrame, GameScenery } from './assets.ts'
import { addPlane, destroyPlanes, stretchedBoard, type Plane } from './board.ts'

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

export interface GiftShopPlaneSpec {
  key: string
  frame: string
  x: number
  y: number
  width: number
  height: number
  z: number
}

export interface GiftShopSignSpec {
  key: string
  frame: string
  aspect: number
  x: number
  y: number
  z: number
  width: number
  height: number
}

export interface GiftShopGeometry {
  counter: GiftShopPlaneSpec
  note: GiftShopPlaneSpec
  sign: GiftShopSignSpec
  signPlanes: GiftShopPlaneSpec[]
  marks: GiftShopMarks
}

const CUTS = [0, 0.28, 0.72, 1] as const

export function giftShopGeometry(
  x: number,
  frames: { counter: GameFrame; plaque: GameFrame },
): GiftShopGeometry {
  const { counter, note, sign, button, noteText, signText } = CONFIG.giftShop

  const natural = sign.height * frames.plaque.aspect
  const ends = [(CUTS[1] - CUTS[0]) * natural, (CUTS[3] - CUTS[2]) * natural]
  const middle = Math.max((CUTS[2] - CUTS[1]) * natural, sign.width - ends[0] - ends[1])
  const widths = [ends[0], middle, ends[1]]
  const total = widths[0] + widths[1] + widths[2]

  const signSpec: GiftShopSignSpec = {
    key: frames.plaque.key,
    frame: frames.plaque.frame,
    aspect: frames.plaque.aspect,
    x: x + sign.dx,
    y: sign.centerY,
    z: sign.z,
    width: sign.width,
    height: sign.height,
  }

  const signPlanes: GiftShopPlaneSpec[] = []
  let cursor = signSpec.x - total / 2
  for (let i = 0; i < 3; i++) {
    signPlanes.push({
      key: frames.plaque.key,
      frame: `${frames.plaque.frame}~${CUTS[i]}~${CUTS[i + 1]}`,
      x: cursor + widths[i] / 2,
      y: sign.centerY,
      z: sign.z,
      width: widths[i],
      height: sign.height,
    })
    cursor += widths[i]
  }

  return {
    counter: {
      key: frames.counter.key,
      frame: frames.counter.frame,
      x: x + counter.dx,
      y: counter.centerY,
      z: counter.z,
      width: counter.height * frames.counter.aspect,
      height: counter.height,
    },
    note: {
      key: frames.plaque.key,
      frame: frames.plaque.frame,
      x: x + note.dx,
      y: note.centerY,
      z: note.z,
      width: note.width,
      height: note.height,
    },
    sign: signSpec,
    signPlanes,
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
  }
}

export function createGiftShop(
  scene: Phaser.Scene,
  assets: GameAssets,
  scenery: GameScenery,
  x: number,
): GiftShop {
  const geometry = giftShopGeometry(x, {
    counter: scenery.frameOf('gift-shop.png'),
    plaque: assets.frameOf('plaque.png'),
  })

  const planes: Plane[] = [
    addPlane(
      scene,
      { key: geometry.counter.key, frame: geometry.counter.frame },
      geometry.counter.width,
      geometry.counter.height,
      geometry.counter.x,
      geometry.counter.y,
      geometry.counter.z,
    ),
    addPlane(
      scene,
      { key: geometry.note.key, frame: geometry.note.frame },
      geometry.note.width,
      geometry.note.height,
      geometry.note.x,
      geometry.note.y,
      geometry.note.z,
    ),
  ]

  const sign = stretchedBoard(
    scene,
    { key: geometry.sign.key, frame: geometry.sign.frame },
    geometry.sign.aspect,
    geometry.sign.x,
    geometry.sign.y,
    geometry.sign.z,
    geometry.sign.width,
    geometry.sign.height,
  )
  planes.push(...sign.planes)

  return {
    x,
    marks: geometry.marks,
    dispose() {
      destroyPlanes(planes)
    },
  }
}
