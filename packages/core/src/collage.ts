import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import sharp from 'sharp'
import { repoRoot } from './env.ts'
import { pickDerivative } from './derivatives.ts'
import { LAYOUTS } from './layouts.ts'
import type { Storage } from './storage.ts'
import type { Derivative, LayoutName, Placement, RegionMap } from './types.ts'

/**
 * The collage compositor. Worker-only.
 *
 * Flattens an artist's hung works into a single image and emits a region map
 * beside it. This is the decision the whole design rests on: the hall fetches
 * ONE image per display instead of a dozen, and hit testing runs against
 * coordinates rather than per-piece geometry.
 */

/**
 * Where frame.png and manifest.json live.
 *
 * Anchored to the repo root rather than to this file's own URL. A bundler
 * flattens the module graph into one file, so `import.meta.url` no longer
 * points anywhere near packages/core — and under a CJS bundle it is not
 * defined at all. CORE_ASSETS_DIR is how a deployment says where it put them;
 * see amplify/backend.ts, which copies them beside the function bundle.
 */
const ASSETS_DIR =
  process.env.CORE_ASSETS_DIR || join(repoRoot, 'packages', 'core', 'assets')

/** Canvas resolution. 300px per world unit keeps a single display near 900x960. */
export const PX_PER_UNIT = 300

interface FrameManifest {
  frame: {
    size: [number, number]
    /** [x, y, w, h] normalised: where artwork sits inside the frame. */
    window: [number, number, number, number]
  }
}

let manifestCache: FrameManifest | null = null
let frameCache: Buffer | null = null

async function loadFrameAssets(): Promise<{ manifest: FrameManifest; frame: Buffer }> {
  if (!manifestCache) {
    manifestCache = JSON.parse(
      await readFile(join(ASSETS_DIR, 'manifest.json'), 'utf8'),
    ) as FrameManifest
  }
  if (!frameCache) frameCache = await readFile(join(ASSETS_DIR, 'frame.png'))
  return { manifest: manifestCache, frame: frameCache }
}

export interface CollageInput {
  layout: LayoutName
  composition: Placement[]
  /** Derivatives for each hung piece, keyed by piece id. */
  derivativesByPiece: Map<string, Derivative[]>
  storage: Storage
}

export interface CollageOutput {
  buffer: Buffer
  width: number
  height: number
  regionMap: RegionMap
}

export async function renderDisplayCollage({
  layout,
  composition,
  derivativesByPiece,
  storage,
}: CollageInput): Promise<CollageOutput> {
  const spec = LAYOUTS[layout]
  const width = Math.round(spec.canvas.w * PX_PER_UNIT)
  const height = Math.round(spec.canvas.h * PX_PER_UNIT)

  const { manifest, frame } = await loadFrameAssets()
  const [winX, winY, winW, winH] = manifest.frame.window

  const tiles: sharp.OverlayOptions[] = []

  for (const place of composition) {
    const frameW = Math.max(1, Math.round(place.w * width))
    const frameH = Math.max(1, Math.round(place.h * height))
    const left = Math.round(place.x * width)
    const top = Math.round(place.y * height)

    const windowLeft = Math.round(winX * frameW)
    const windowTop = Math.round(winY * frameH)
    const windowW = Math.max(1, Math.round(winW * frameW))
    const windowH = Math.max(1, Math.round(winH * frameH))

    const overlays: sharp.OverlayOptions[] = []

    const derivatives = derivativesByPiece.get(place.pieceId) ?? []
    const source = pickDerivative(derivatives, windowW, 'jpg')
    if (source) {
      const artwork = await storage.get(source.key)
      const fitted = await sharp(artwork)
        .resize(windowW, windowH, { fit: 'cover', position: 'centre' })
        .png()
        .toBuffer()
      overlays.push({ input: fitted, left: windowLeft, top: windowTop })
    }

    // The frame goes on last: its ornament overlaps the artwork's edges.
    const framed = await sharp(frame).resize(frameW, frameH, { fit: 'fill' }).png().toBuffer()
    overlays.push({ input: framed, left: 0, top: 0 })

    const tile = await sharp({
      create: {
        width: frameW,
        height: frameH,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite(overlays)
      .png()
      .toBuffer()

    tiles.push({ input: tile, left, top })
  }

  // Transparent outside the frames, so the hall's wall colour shows through.
  const buffer = await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite(tiles)
    .png({ compressionLevel: 9 })
    .toBuffer()

  return {
    buffer,
    width,
    height,
    // The region map is the composition's geometry, shipped separately so the
    // client can hit test without needing the composition itself.
    regionMap: composition.map((p) => ({ ...p })),
  }
}
