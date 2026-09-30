import type Phaser from 'phaser'
import type { Mark } from '../scene/board.ts'
import { CONFIG } from '../scene/config.ts'
import { comingSoonWidth } from '../scene/layout.ts'
import type { GameAssets, GameFrame, GameScenery } from './assets.ts'
import { addPlane, destroyPlanes, ropeSlices, type Plane } from './board.ts'

export interface ComingSoon {
  noteMark: Mark
  dispose(): void
}

export interface ComingSoonPlaneSpec {
  key: string
  frame: string
  x: number
  y: number
  width: number
  height: number
  z: number
}

export interface ComingSoonGeometry {
  board: ComingSoonPlaneSpec
  ropes: ComingSoonPlaneSpec[]
  noteMark: Mark
}

const ROPE_CUTS = [0, 0.24, 0.78, 1] as const

export function comingSoonGeometry(
  x: number,
  frames: { comingSoon: GameFrame; rope: GameFrame },
): ComingSoonGeometry {
  const { note } = CONFIG.comingSoon
  const width = comingSoonWidth()
  const height = width / frames.comingSoon.aspect
  const { height: ropeHeight, centerY, z } = CONFIG.rope

  const naturalWidth = ropeHeight * frames.rope.aspect
  const ends = [
    (ROPE_CUTS[1] - ROPE_CUTS[0]) * naturalWidth,
    (ROPE_CUTS[3] - ROPE_CUTS[2]) * naturalWidth,
  ]
  const middle = Math.max((ROPE_CUTS[2] - ROPE_CUTS[1]) * naturalWidth, width - ends[0] - ends[1])
  const widths = [ends[0], middle, ends[1]]
  const total = widths[0] + widths[1] + widths[2]

  const ropes: ComingSoonPlaneSpec[] = []
  let cursorX = x - total / 2
  for (let i = 0; i < 3; i++) {
    ropes.push({
      key: frames.rope.key,
      frame: `${frames.rope.frame}~${ROPE_CUTS[i]}~${ROPE_CUTS[i + 1]}`,
      x: cursorX + widths[i] / 2,
      y: centerY,
      z,
      width: widths[i],
      height: ropeHeight,
    })
    cursorX += widths[i]
  }

  return {
    board: {
      key: frames.comingSoon.key,
      frame: frames.comingSoon.frame,
      x,
      y: CONFIG.displayBottomY + height / 2,
      z: 0,
      width,
      height,
    },
    ropes,
    noteMark: { x: x + note.dx, y: note.centerY, width: note.width },
  }
}

export function createComingSoon(
  scene: Phaser.Scene,
  assets: GameAssets,
  scenery: GameScenery,
  x: number,
): ComingSoon {
  const rope = assets.frameOf('rope.png')
  const geometry = comingSoonGeometry(x, {
    comingSoon: scenery.frameOf('coming-soon.png'),
    rope,
  })

  const planes: Plane[] = [
    addPlane(
      scene,
      { key: geometry.board.key, frame: geometry.board.frame },
      geometry.board.width,
      geometry.board.height,
      geometry.board.x,
      geometry.board.y,
      geometry.board.z,
    ),
  ]

  const slices = ropeSlices(
    scene,
    { key: rope.key, frame: rope.frame },
    rope.aspect,
    geometry.board.width,
    x,
  )
  planes.push(...slices.planes)

  return {
    noteMark: geometry.noteMark,
    dispose() {
      destroyPlanes(planes)
    },
  }
}
