import type { InkMap } from './api'

const PENCIL = [74, 52, 40] as const
const SEED_STRIDE = 3
const STROKE_LENGTH = 11
const STROKE_WIDTH = 7
const INK_OPACITY = 0.92

export interface SketchReveal {
  draw(progress: number): void
  finish(): void
}

function shuffle<T>(items: T[]): T[] {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[items[i], items[j]] = [items[j], items[i]]
  }
  return items
}

export function createReveal(canvas: HTMLCanvasElement, map: InkMap): SketchReveal {
  const { width, height, ink } = map
  canvas.width = width
  canvas.height = height
  const view = canvas.getContext('2d')
  if (!view) throw new Error('Canvas 2D is unavailable')

  const sketch = document.createElement('canvas')
  sketch.width = width
  sketch.height = height
  const sketchCtx = sketch.getContext('2d')!
  const pixels = sketchCtx.createImageData(width, height)
  const seeds: number[] = []
  for (let i = 0; i < ink.length; i++) {
    const o = i * 4
    pixels.data[o] = PENCIL[0]
    pixels.data[o + 1] = PENCIL[1]
    pixels.data[o + 2] = PENCIL[2]
    pixels.data[o + 3] = Math.round(ink[i] * INK_OPACITY)
    if (ink[i] > 127 && i % SEED_STRIDE === 0) seeds.push(i)
  }
  sketchCtx.putImageData(pixels, 0, 0)
  shuffle(seeds)

  const mask = document.createElement('canvas')
  mask.width = width
  mask.height = height
  const maskCtx = mask.getContext('2d')!
  maskCtx.lineCap = 'round'
  maskCtx.lineWidth = STROKE_WIDTH
  maskCtx.strokeStyle = '#000'

  let drawn = 0

  function compose(): void {
    view!.clearRect(0, 0, width, height)
    view!.globalCompositeOperation = 'source-over'
    view!.drawImage(mask, 0, 0)
    view!.globalCompositeOperation = 'source-in'
    view!.drawImage(sketch, 0, 0)
    view!.globalCompositeOperation = 'source-over'
  }

  return {
    draw(progress) {
      const target = Math.floor(Math.min(1, Math.max(0, progress)) * seeds.length)
      if (target <= drawn) return
      maskCtx.beginPath()
      for (; drawn < target; drawn++) {
        const seed = seeds[drawn]
        const x = seed % width
        const y = (seed - x) / width
        const angle = Math.random() * Math.PI
        const dx = (Math.cos(angle) * STROKE_LENGTH) / 2
        const dy = (Math.sin(angle) * STROKE_LENGTH) / 2
        maskCtx.moveTo(x - dx, y - dy)
        maskCtx.lineTo(x + dx, y + dy)
      }
      maskCtx.stroke()
      compose()
    },

    finish() {
      drawn = seeds.length
      view.clearRect(0, 0, width, height)
      view.drawImage(sketch, 0, 0)
    },
  }
}
