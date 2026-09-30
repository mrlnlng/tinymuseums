import type Phaser from 'phaser'
import { CONFIG } from '../scene/config.ts'
import type { PlaneLike, PlaneMask } from './hit.ts'
import { PPU, toPhaser } from './view.ts'

export interface Plane extends PlaneLike {
  image: Phaser.GameObjects.Image
}

export interface PlaneRef {
  key: string
  frame?: string
  mask?: PlaneMask
}

export function planeMask(scene: Phaser.Scene, ref: PlaneRef): PlaneMask {
  if (ref.mask !== undefined) return ref.mask
  if (ref.frame && ref.frame !== '__BASE') return { sprite: ref.frame }

  const image = scene.textures.getFrame(ref.key, ref.frame)?.source?.image
  return image ? { image: image as unknown as TexImageSource } : null
}

export function addPlane(
  scene: Phaser.Scene,
  ref: PlaneRef,
  width: number,
  height: number,
  x: number,
  y: number,
  z: number,
): Plane {
  const at = toPhaser(x, y)
  const image = scene.add
    .image(at.x, at.y, ref.key, ref.frame)
    .setDisplaySize(width * PPU, height * PPU)
    .setDepth(z)
  return { image, x, y, width, height, z, flipX: image.flipX, mask: planeMask(scene, ref) }
}

function sliceFrame(
  scene: Phaser.Scene,
  key: string,
  frame: string,
  from: number,
  to: number,
): string {
  const source = scene.textures.getFrame(key, frame)
  const name = `${frame}~${from}~${to}`
  const texture = scene.textures.get(key)
  if (!texture.has(name)) {
    texture.add(
      name,
      source.sourceIndex,
      source.cutX + from * source.cutWidth,
      source.cutY,
      (to - from) * source.cutWidth,
      source.cutHeight,
    )
  }
  return name
}

const CUTS = [0, 0.28, 0.72, 1] as const

export interface Board {
  planes: Plane[]
  widths: number[]
  total: number
}

export function stretchedBoard(
  scene: Phaser.Scene,
  ref: PlaneRef,
  aspect: number,
  x: number,
  y: number,
  z: number,
  width: number,
  height: number,
): Board {
  const natural = height * aspect
  const ends = [(CUTS[1] - CUTS[0]) * natural, (CUTS[3] - CUTS[2]) * natural]
  const middle = Math.max((CUTS[2] - CUTS[1]) * natural, width - ends[0] - ends[1])
  const widths = [ends[0], middle, ends[1]]
  const total = widths[0] + widths[1] + widths[2]
  const mask = planeMask(scene, ref)
  const planes: Plane[] = []

  let cursor = x - total / 2
  for (let i = 0; i < 3; i++) {
    const frame = sliceFrame(scene, ref.key, ref.frame ?? '__BASE', CUTS[i], CUTS[i + 1])
    planes.push(addPlane(scene, { key: ref.key, frame, mask }, widths[i], height, cursor + widths[i] / 2, y, z))
    cursor += widths[i]
  }

  return { planes, widths, total }
}

const ROPE_CUTS = [0, 0.24, 0.78, 1] as const

export function ropeSlices(
  scene: Phaser.Scene,
  ref: PlaneRef,
  aspect: number,
  span: number,
  x = 0,
): Board {
  const { height, centerY, z } = CONFIG.rope
  const naturalWidth = height * aspect
  const ends = [
    (ROPE_CUTS[1] - ROPE_CUTS[0]) * naturalWidth,
    (ROPE_CUTS[3] - ROPE_CUTS[2]) * naturalWidth,
  ]
  const middle = Math.max((ROPE_CUTS[2] - ROPE_CUTS[1]) * naturalWidth, span - ends[0] - ends[1])
  const widths = [ends[0], middle, ends[1]]
  const total = widths[0] + widths[1] + widths[2]
  const mask = planeMask(scene, ref)
  const planes: Plane[] = []

  let cursorX = x - total / 2
  for (let i = 0; i < 3; i++) {
    const frame = sliceFrame(scene, ref.key, ref.frame ?? '__BASE', ROPE_CUTS[i], ROPE_CUTS[i + 1])
    planes.push(addPlane(scene, { key: ref.key, frame, mask }, widths[i], height, cursorX + widths[i] / 2, centerY, z))
    cursorX += widths[i]
  }

  return { planes, widths, total }
}

export function destroyPlanes(planes: readonly Plane[]): void {
  for (const plane of planes) plane.image.destroy()
}
