import sharp from 'sharp'
import { derivativeKey, type Storage } from './storage.ts'
import type { Derivative } from '../types.ts'

export const DERIVATIVE_WIDTHS = [320, 640, 1080, 1600, 2400]

const FORMATS: Array<{ ext: string; format: 'webp' | 'jpeg' }> = [
  { ext: 'webp', format: 'webp' },
  { ext: 'jpg', format: 'jpeg' },
]

export const MIN_LONG_EDGE = 1200

export interface ProcessedAsset {
  width: number
  height: number
  derivatives: Derivative[]
}

export class ImageRejected extends Error {}

export async function generateDerivatives(
  original: Buffer,
  artistId: string,
  assetId: string,
  storage: Storage,
): Promise<ProcessedAsset> {
  const metadata = await sharp(original).metadata()
  const width = metadata.width ?? 0
  const height = metadata.height ?? 0

  if (!width || !height) throw new ImageRejected('Could not read image dimensions')
  if (Math.max(width, height) < MIN_LONG_EDGE) {
    throw new ImageRejected(
      `Image is ${width}x${height}; the long edge must be at least ${MIN_LONG_EDGE}px`,
    )
  }

  const derivatives: Derivative[] = []

  for (const targetWidth of DERIVATIVE_WIDTHS) {
    if (targetWidth > width) continue

    for (const { ext, format } of FORMATS) {
      const pipeline = sharp(original)
        .rotate()
        .resize({ width: targetWidth, withoutEnlargement: true })

      const buffer =
        format === 'webp'
          ? await pipeline.webp({ quality: 82 }).toBuffer()
          : await pipeline.jpeg({ quality: 84, mozjpeg: true }).toBuffer()

      const info = await sharp(buffer).metadata()
      const variant = `w${targetWidth}`
      const key = derivativeKey(artistId, assetId, variant, ext)
      await storage.put(key, buffer, format === 'webp' ? 'image/webp' : 'image/jpeg')

      derivatives.push({
        variant,
        key,
        width: info.width ?? targetWidth,
        height: info.height ?? 0,
        format: ext,
        bytes: buffer.length,
      })
    }
  }

  if (derivatives.length === 0) throw new ImageRejected('No derivatives could be produced')

  return { width, height, derivatives }
}
