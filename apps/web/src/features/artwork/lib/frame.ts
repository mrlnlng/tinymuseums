import manifest from '../../../../public/assets/manifest.json'

export interface FrameShape {
  src: string
  window: { left: string; top: string; width: string; height: string }
  ratio: number
}

function shape(src: string, size: number[], window: number[]): FrameShape {
  const [x, y, w, h] = window
  const percent = (value: number) => `${(value * 100).toFixed(3)}%`
  return {
    src,
    window: { left: percent(x), top: percent(y), width: percent(w), height: percent(h) },
    ratio: size[0] / size[1],
  }
}

const PORTRAIT = shape('/assets/frame.webp', manifest.frame.size, manifest.frame.window)
const LANDSCAPE = shape(
  '/assets/frame-landscape.webp',
  manifest.frameLandscape.size,
  manifest.frameLandscape.window,
)

export function frameFor(aspect: number | null): FrameShape {
  return aspect !== null && aspect > 1 ? LANDSCAPE : PORTRAIT
}

export function preloadFrames(): void {
  if (typeof window === 'undefined') return
  for (const shape of [PORTRAIT, LANDSCAPE]) {
    const image = new Image()
    image.fetchPriority = 'low'
    image.decoding = 'async'
    image.onload = () => markFrameReady(shape.src)
    image.src = shape.src
  }
}

const decodedFrames = new Set<string>()

export function isFrameReady(src: string): boolean {
  return decodedFrames.has(src)
}

export function markFrameReady(src: string): void {
  decodedFrames.add(src)
}
