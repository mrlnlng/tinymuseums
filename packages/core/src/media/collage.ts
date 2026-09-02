import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import sharp from 'sharp'
import { repoRoot } from '../infra/env.ts'
import { pickDerivative } from './derivatives.ts'
import type { Storage } from './storage.ts'
import type { Derivative } from '../types.ts'

/* The frame compositor (worker-only): renders each arranged work into its own
   framed image for the hall — one painting per stand, portrait or landscape to
   match the work. There is no per-artist collage any more. */

/* Where frame.png and manifest.json live, anchored to the repo root — a bundler flattens the module graph, so import.meta.url points nowhere near packages/core. CORE_ASSETS_DIR overrides it in deployments. */
const ASSETS_DIR =
  process.env.CORE_ASSETS_DIR || join(repoRoot, 'packages', 'core', 'assets')

/** Canvas resolution. 300px per world unit keeps a single display near 900x960. */
export const PX_PER_UNIT = 300

/** How much larger than its window the artwork is drawn, so no edge shows. */
const ARTWORK_OVERSCAN = 1.1

interface FrameManifest {
  frame: {
    size: [number, number]
    /** [x, y, w, h] normalised: where artwork sits inside the frame. */
    window: [number, number, number, number]
  }
  /** The same frame turned a quarter-turn, for work wider than it is tall. */
  frameLandscape: {
    size: [number, number]
    window: [number, number, number, number]
  }
}

interface FrameSpec {
  buffer: Buffer
  window: [number, number, number, number]
  /** Frame width / height, so the frame is rendered without distorting it. */
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

/** The portrait and landscape frame drawings together, for a single piece. */
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
  /** The artwork's own width/height, to choose the frame orientation. */
  aspect: number
  derivatives: Derivative[]
  storage: Storage
}

export interface SinglePieceOutput {
  buffer: Buffer
  width: number
  height: number
  /** The framed painting's size in world units, so the client can size it. */
  canvas: { w: number; h: number }
}

/*  Renders one painting into its own framed image, portrait or landscape to match the work rather than letterboxing it; the canvas is sized to the frame's own proportion at a target dimension. */
export async function renderSinglePieceFrame({
  aspect,
  derivatives,
  storage,
}: SinglePieceInput): Promise<SinglePieceOutput> {
  const { portrait, landscape } = await loadPieceFrames()
  const isLandscape = aspect > 1
  const spec = isLandscape ? landscape : portrait
  const [winX, winY, winW, winH] = spec.window

  // Target the frame so its long edge is a consistent on-screen size: a
  // portrait work is sized by height, a landscape one by width, so neither is
  // forced into the other's shape and both read about the same size.
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
    /*  Laid a tenth larger than the window and centred on it, so the artwork's
        edges run underneath the frame's painted border rather than stopping
        just short of it and leaving a hairline of wall showing through. The
        enlarged view does the same thing to the same picture with a transform;
        this is the hall's copy of that decision. Clamped so a frame measured
        with less margin around its window cannot push the overlay off the
        canvas, which sharp refuses outright. */
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

  // The frame goes on last: its ornament overlaps the artwork's edges.
  const framed = await sharp(spec.buffer)
    .resize(width, height, { fit: 'fill' })
    .png()
    .toBuffer()
  overlays.push({ input: framed, left: 0, top: 0 })

  const buffer = await sharp({
    create: { width, height, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite(overlays)
    .png({ compressionLevel: 6 })
    .toBuffer()

  return { buffer, width, height, canvas: { w: canvasW, h: canvasH } }
}
