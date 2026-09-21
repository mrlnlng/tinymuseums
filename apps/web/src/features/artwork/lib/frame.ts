import manifest from '../../../../public/assets/manifest.json'
import optimized from '../../../../public/assets/optimized.json'
import { supportsAvif } from '@/shared/lib/avif'

const AVIF = new Set<string>(optimized.avif)

export interface FrameShape {
  src: string
  avif: string | null
  window: { left: string; top: string; width: string; height: string }
  ratio: number
}

function shape(stem: string, size: number[], window: number[]): FrameShape {
  const [x, y, w, h] = window
  const percent = (value: number) => `${(value * 100).toFixed(3)}%`
  return {
    src: `/assets/${stem}.webp`,
    avif: AVIF.has(stem) ? `/assets/${stem}.avif` : null,
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
    const image = new Image()
    image.fetchPriority = 'low'
    image.decoding = 'async'
    image.onload = () => markFrameReady(shape.src)
    image.src = avif && shape.avif ? shape.avif : shape.src
  }
}

const decodedFrames = new Set<string>()

export function isFrameReady(src: string): boolean {
  return decodedFrames.has(src)
}

export function markFrameReady(src: string): void {
  decodedFrames.add(src)
}
