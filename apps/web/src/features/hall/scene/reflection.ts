import type { Look } from './character'
import { createRigState } from './rig-motion'

const cache = new Map<string, Promise<HTMLCanvasElement>>()
let queue: Promise<unknown> = Promise.resolve()

/** The character standing still in the look, trimmed to its outline. One at a time, so only one extra WebGL context is ever open. */
export function snapshotLook(look: Look, height = 360): Promise<HTMLCanvasElement> {
  const key = `${look.kind}|${look.costume}|${look.bow}|${height}`
  const hit = cache.get(key)
  if (hit) return hit
  const shot = queue.then(() => render(look, height))
  queue = shot.catch(() => {})
  cache.set(key, shot)
  shot.catch(() => cache.delete(key))
  return shot
}

async function render(look: Look, height: number): Promise<HTMLCanvasElement> {
  const { loadRig } = await import('./rig')
  const gl = document.createElement('canvas')
  const rig = await loadRig(gl, look.kind)
  try {
    rig.setCostume(look.costume, look.bow)
    rig.render(createRigState(), 0, height, 2)
    const full = document.createElement('canvas')
    full.width = gl.width
    full.height = gl.height
    const paint = full.getContext('2d', { willReadFrequently: true })!
    paint.drawImage(gl, 0, 0)
    return trim(full, paint)
  } finally {
    rig.dispose()
  }
}

function trim(canvas: HTMLCanvasElement, paint: CanvasRenderingContext2D): HTMLCanvasElement {
  const { width, height } = canvas
  const alpha = paint.getImageData(0, 0, width, height).data
  let top = height, bottom = -1, left = width, right = -1
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (alpha[(y * width + x) * 4 + 3] < 8) continue
      if (y < top) top = y
      if (y > bottom) bottom = y
      if (x < left) left = x
      if (x > right) right = x
    }
  }
  if (bottom < 0) return canvas
  const out = document.createElement('canvas')
  out.width = right - left + 1
  out.height = bottom - top + 1
  out.getContext('2d')!.drawImage(canvas, left, top, out.width, out.height, 0, 0, out.width, out.height)
  return out
}
