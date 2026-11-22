import { yieldToMain } from '@/shared/lib/yield'

function blank(width: number, height: number): [HTMLCanvasElement, CanvasRenderingContext2D | null] {
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(width))
  canvas.height = Math.max(1, Math.round(height))
  return [canvas, canvas.getContext('2d')]
}

/** A soft copy of a layer: shrunk and drawn back up, which blurs in every browser. */
function softened(source: HTMLCanvasElement, factor: number): HTMLCanvasElement {
  const [small, shrink] = blank(source.width / factor, source.height / factor)
  const [out, grow] = blank(source.width, source.height)
  if (!shrink || !grow) return source
  shrink.imageSmoothingQuality = 'high'
  shrink.drawImage(source, 0, 0, small.width, small.height)
  grow.imageSmoothingQuality = 'high'
  grow.drawImage(small, 0, 0, out.width, out.height)
  return out
}

const STONE_SHADE = [104, 112, 92]
const STONE_LIGHT = [222, 216, 194]
const TUFT = [150, 190, 72]

/**
 * The stepping stones arrive on a flat lime backing that sits on the painting like a sticker.
 * Keep only the stones, warmed and dabbed with moss, set into the lawn by their own shadow
 * and a faint trodden trail, so the painted grass shows between them.
 */
export async function bakeStonePath(image: CanvasImageSource, width: number, height: number): Promise<HTMLCanvasElement> {
  const [source, read] = blank(width, height)
  const [stones, stoneInk] = blank(width, height)
  const [tufts, tuftInk] = blank(width, height)
  const [trail, trailInk] = blank(width, height)
  const [out, ink] = blank(width, height)
  if (!read || !stoneInk || !tuftInk || !trailInk || !ink) throw new Error('stone path needs a 2D canvas')
  let pixels: ImageData
  try {
    read.drawImage(image, 0, 0, width, height)
    pixels = read.getImageData(0, 0, width, height)
  } catch (error) {
    throw new Error('stone path could not be read', { cause: error })
  }
  const stone = stoneInk.createImageData(width, height)
  const tuft = tuftInk.createImageData(width, height)
  const worn = trailInk.createImageData(width, height)
  const data = pixels.data
  const slice = width * 4 * Math.ceil(height / 24)
  for (let i = 0; i < data.length; i += 4) {
    if (i > 0 && i % slice === 0) await yieldToMain()
    const alpha = data[i + 3]
    if (alpha === 0) continue
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const max = Math.max(r, g, b)
    const saturation = max ? (max - Math.min(r, g, b)) / max : 0
    const stoniness = Math.min(1, Math.max(0, (0.62 - saturation) / 0.4))
    worn.data[i + 3] = alpha
    if (stoniness > 0) {
      // Far stones sit in haze: lighter and flatter than the ones underfoot.
      const near = (i / 4 / width) / height
      const light = Math.min(1, Math.max(0, (max / 255 - 0.5) / 0.3)) * (0.82 + 0.18 * near) + 0.14 * (1 - near)
      for (let c = 0; c < 3; c++) stone.data[i + c] = STONE_SHADE[c] + (STONE_LIGHT[c] - STONE_SHADE[c]) * Math.min(1, light)
      stone.data[i + 3] = alpha * stoniness
    } else if (r > 182) {
      for (let c = 0; c < 3; c++) tuft.data[i + c] = TUFT[c]
      tuft.data[i + 3] = alpha * 0.9
    }
  }
  stoneInk.putImageData(stone, 0, 0)
  tuftInk.putImageData(tuft, 0, 0)
  trailInk.putImageData(worn, 0, 0)
  await yieldToMain()

  // Brush dabs keep the stones from reading as flat vector shapes.
  stoneInk.globalCompositeOperation = 'source-atop'
  let seed = 7
  const random = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646
  const unit = width / 2400
  for (let i = 0; i < 520; i++) {
    const x = random() * width
    const y = random() * height
    const moss = random() < 0.4
    stoneInk.fillStyle = moss ? `rgba(118, 150, 70, ${0.1 + random() * 0.14})` : `rgba(255, 250, 232, ${0.06 + random() * 0.12})`
    stoneInk.beginPath()
    stoneInk.ellipse(x, y, (18 + random() * 46) * unit, (5 + random() * 9) * unit, (random() - 0.5) * 0.5, 0, Math.PI * 2)
    stoneInk.fill()
  }
  stoneInk.globalCompositeOperation = 'source-over'

  const tinted = (layer: HTMLCanvasElement, colour: string): HTMLCanvasElement => {
    const [copy, paint] = blank(width, height)
    if (!paint) return layer
    paint.drawImage(layer, 0, 0)
    paint.globalCompositeOperation = 'source-in'
    paint.fillStyle = colour
    paint.fillRect(0, 0, width, height)
    return copy
  }
  await yieldToMain()
  ink.globalAlpha = 0.2
  ink.drawImage(softened(softened(tinted(trail, '#c9c27a'), 24), 12), 0, 0)
  await yieldToMain()
  ink.globalAlpha = 0.55
  ink.drawImage(softened(tinted(stones, '#2f5a22'), 10), 0, 14 * unit)
  ink.globalAlpha = 1
  ink.drawImage(stones, 0, 0)
  ink.drawImage(tufts, 0, 0)
  return out
}
