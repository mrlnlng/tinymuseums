import sharp from 'sharp'
import type { Derivative } from '../types.ts'
import { pickDerivative } from './derivatives.ts'
import type { Storage } from './storage.ts'
import { toGray, xdogInk } from './xdog.ts'

// Bump whenever the rendered sketch changes; older sketches are re-rendered by the worker.
export const SKETCH_VERSION = 1

export const SKETCH_WIDTH = 400
export const SKETCH_COLOR_WIDTH = 640
export const SKETCH_DETAIL_WIDTH = 1080

const INK_LEVELS = 3

export interface SketchOutput {
  buffer: Buffer
  width: number
  height: number
}

// Palette PNG where each pixel's grey value is its ink strength, 0 for bare paper.
export async function renderSketch(derivatives: Derivative[], storage: Storage): Promise<SketchOutput | null> {
  const source = pickDerivative(derivatives, SKETCH_WIDTH, 'jpg')
  if (!source) return null

  const { data, info } = await sharp(await storage.get(source.key))
    .resize({ width: SKETCH_WIDTH, withoutEnlargement: false })
    .removeAlpha()
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const { width, height } = info
  const ink = xdogInk(toGray(data, width, height), width, height)
  const pixels = Buffer.alloc(width * height)
  for (let i = 0; i < ink.length; i++) pixels[i] = Math.round(ink[i] * INK_LEVELS) * (255 / INK_LEVELS)

  const buffer = await sharp(pixels, { raw: { width, height, channels: 1 } })
    .png({ compressionLevel: 9, palette: true, colours: INK_LEVELS + 1, dither: 0 })
    .toBuffer()

  return { buffer, width, height }
}
