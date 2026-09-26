import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import sharp from 'sharp'
import { repoRoot } from '../infra/env.ts'
import { pickDerivative } from './derivatives.ts'
import type { Storage } from './storage.ts'
import type { Derivative } from '../types.ts'

// Not import.meta.url: bundling the worker moves this module away from packages/core.
const ASSETS_DIR =
  process.env.CORE_ASSETS_DIR || join(repoRoot, 'packages', 'core', 'assets')

export const PX_PER_UNIT = 300

// Bump whenever the rendered frame changes; frames from older versions are re-rendered by the worker.
export const FRAME_VERSION = 3

export const FRAME_FORMAT = { extension: 'webp', contentType: 'image/webp' } as const

const ARTWORK_OVERSCAN = 1.2

interface FrameManifest {
  frame: {
    size: [number, number]
    window: [number, number, number, number]
  }
  frameLandscape: {
    size: [number, number]
    window: [number, number, number, number]
  }
}

interface FrameSpec {
  buffer: Buffer
  window: [number, number, number, number]
  aspect: number
}

let manifestCache: FrameManifest | null = null
let frameCache: Buffer | null = null
let landscapeFrameCache: Buffer | null = null

async function loadFrameAssets(): Promise<{ manifest: FrameManifest; frame: Buffer }> {
  if (!manifestCache) {
    manifestCache = JSON.parse(
      await readFile(join(ASSETS_DIR, 'manifest.json'), 'utf8'),
    ) as FrameManifest
  }
  if (!frameCache) frameCache = await readFile(join(ASSETS_DIR, 'frame.png'))
  return { manifest: manifestCache, frame: frameCache }
}

async function loadPieceFrames(): Promise<{ portrait: FrameSpec; landscape: FrameSpec }> {
  const { manifest, frame } = await loadFrameAssets()
  if (!landscapeFrameCache) {
    landscapeFrameCache = await readFile(join(ASSETS_DIR, 'frame-landscape.png'))
  }
  const [fw, fh] = manifest.frame.size
  const [lw, lh] = manifest.frameLandscape.size
  return {
    portrait: { buffer: frame, window: manifest.frame.window, aspect: fw / fh },
    landscape: {
      buffer: landscapeFrameCache,
      window: manifest.frameLandscape.window,
      aspect: lw / lh,
    },
  }
}

export interface SinglePieceInput {
  aspect: number
  derivatives: Derivative[]
  storage: Storage
}

export interface SinglePieceOutput {
  buffer: Buffer
  width: number
  height: number
  canvas: { w: number; h: number }
}

export async function renderSinglePieceFrame({
  aspect,
  derivatives,
  storage,
}: SinglePieceInput): Promise<SinglePieceOutput> {
  const { portrait, landscape } = await loadPieceFrames()
  const isLandscape = aspect > 1
  const spec = isLandscape ? landscape : portrait
  const [winX, winY, winW, winH] = spec.window

  const TARGET = 2.9
  const canvasW = isLandscape ? TARGET : TARGET * spec.aspect
  const canvasH = isLandscape ? TARGET / spec.aspect : TARGET
  const width = Math.max(1, Math.round(canvasW * PX_PER_UNIT))
  const height = Math.max(1, Math.round(canvasH * PX_PER_UNIT))

  const windowLeft = Math.round(winX * width)
  const windowTop = Math.round(winY * height)
  const windowW = Math.max(1, Math.round(winW * width))
  const windowH = Math.max(1, Math.round(winH * height))

  const overlays: sharp.OverlayOptions[] = []

  const source = pickDerivative(derivatives, windowW, 'jpg')
  if (source) {
    const drawW = Math.round(windowW * ARTWORK_OVERSCAN)
    const drawH = Math.round(windowH * ARTWORK_OVERSCAN)
    const left = Math.max(0, Math.min(width - drawW, windowLeft - Math.round((drawW - windowW) / 2)))
    const top = Math.max(0, Math.min(height - drawH, windowTop - Math.round((drawH - windowH) / 2)))

    const artwork = await storage.get(source.key)
    const fitted = await sharp(artwork)
      .resize(drawW, drawH, { fit: 'cover', position: 'centre' })
      .png()
      .toBuffer()
    overlays.push({ input: fitted, left, top })
  }

  const framed = await sharp(spec.buffer)
    .resize(width, height, { fit: 'fill' })
    .png()
    .toBuffer()
  overlays.push({ input: framed, left: 0, top: 0 })

  const buffer = await sharp({
    create: { width, height, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite(overlays)
    .webp({ quality: 80, alphaQuality: 80 })
    .toBuffer()

  return { buffer, width, height, canvas: { w: canvasW, h: canvasH } }
}
