import manifest from '../../../../public/assets/manifest.json'
import { supportsAvif } from '@/shared/lib/avif'
import { pictureSources, preloadImage, type AssetName } from '@/shared/lib/assets'

export interface FrameShape {
  name: AssetName
  src: string
  window: { left: string; top: string; width: string; height: string }
  ratio: number
}

function shape(name: AssetName, size: number[], window: number[]): FrameShape {
  const [x, y, w, h] = window
  const percent = (value: number) => `${(value * 100).toFixed(3)}%`
  return {
    name,
    src: pictureSources(name).src,
    window: { left: percent(x), top: percent(y), width: percent(w), height: percent(h) },
    ratio: size[0] / size[1],
  }
}

const PORTRAIT = shape('frame', manifest.frame.size, manifest.frame.window)
const LANDSCAPE = shape('frame-landscape', manifest.frameLandscape.size, manifest.frameLandscape.window)

export function frameFor(aspect: number | null): FrameShape {
  return aspect !== null && aspect > 1 ? LANDSCAPE : PORTRAIT
}

export async function preloadFrames(): Promise<void> {
  if (typeof window === 'undefined') return
  const avif = await supportsAvif()
  for (const shape of [PORTRAIT, LANDSCAPE]) {
    const image = preloadImage(shape.name, avif, 'low')
    image.onload = () => markFrameReady(shape.src)
  }
}

const decodedFrames = new Set<string>()

export function isFrameReady(src: string): boolean {
  return decodedFrames.has(src)
}

export function markFrameReady(src: string): void {
  decodedFrames.add(src)
}
