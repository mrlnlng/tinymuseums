/**
 * A photo of the room as the visitor sees it, without name tags, bubbles or UI. WebGL canvases are
 * only readable in the frame they were drawn, so `grabLayers` runs inside the stage's frame and
 * copies them; NPC sprites are plain CSS backgrounds and are painted in afterwards.
 */

type Rect = { x: number; y: number; w: number; h: number }

type Layer =
  | { kind: 'canvas'; image: HTMLCanvasElement; at: Rect }
  | { kind: 'sprite'; url: string; at: Rect; source: Rect; sheet: { w: number; h: number }; flip: boolean; alpha: number }
  // Plaque lettering lives in the HTML overlay, so it has to be re-drawn into the photo.
  | { kind: 'text'; text: string; at: Rect; font: string; fontSize: number; color: string; lineHeight: number; align: CanvasTextAlign; alpha: number }

export interface Grab {
  width: number
  height: number
  layers: Layer[]
}

function relative(rect: DOMRect, origin: DOMRect): Rect {
  return { x: rect.left - origin.left, y: rect.top - origin.top, w: rect.width, h: rect.height }
}

function copyCanvas(source: HTMLCanvasElement): HTMLCanvasElement {
  const copy = document.createElement('canvas')
  copy.width = source.width
  copy.height = source.height
  copy.getContext('2d')?.drawImage(source, 0, 0)
  return copy
}

function visible(element: Element): boolean {
  if ((element as HTMLElement).hidden) return false
  const style = getComputedStyle(element)
  return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) > 0
}

function px(value: string): number[] {
  return value.split(' ').map((part) => Number.parseFloat(part) || 0)
}

function spriteLayer(element: HTMLElement, origin: DOMRect): Layer | null {
  const style = getComputedStyle(element)
  const url = /url\("?([^")]+)"?\)/.exec(style.backgroundImage)?.[1]
  if (!url || element.offsetWidth === 0) return null
  const [sheetW, sheetH] = px(style.backgroundSize)
  const [posX, posY] = px(style.backgroundPosition)
  if (!sheetW || !sheetH) return null
  const flip = new DOMMatrix(style.transform === 'none' ? undefined : style.transform).a < 0
  return {
    kind: 'sprite',
    url,
    at: relative(element.getBoundingClientRect(), origin),
    source: { x: -posX, y: -posY, w: element.offsetWidth, h: element.offsetHeight },
    sheet: { w: sheetW, h: sheetH },
    flip,
    alpha: Number(style.opacity),
  }
}

/** The painted lettering on a plaque or title, which the WebGL scene itself does not draw. */
function textLayer(element: HTMLElement, origin: DOMRect): Layer | null {
  const text = (element.textContent ?? '').trim()
  const rect = element.getBoundingClientRect()
  if (!text || rect.width < 1 || rect.height < 1) return null
  const style = getComputedStyle(element)
  const fontSize = Number.parseFloat(style.fontSize) || 12
  const lineHeight = Number.parseFloat(style.lineHeight) || fontSize * 1.2
  const align: CanvasTextAlign = style.textAlign === 'left' || style.textAlign === 'right' ? style.textAlign : 'center'
  return {
    kind: 'text',
    text,
    at: relative(rect, origin),
    font: `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`,
    fontSize,
    color: style.color,
    lineHeight,
    align,
    alpha: Number(style.opacity),
  }
}

/** Paint order: scene, other drawn props, townsfolk, other visitors, then the visitor. */
export function grabLayers(main: HTMLCanvasElement): Grab {
  const origin = main.getBoundingClientRect()
  const root = main.closest('.museum') ?? document.body
  const canvasLayer = (canvas: HTMLCanvasElement): Layer => ({
    kind: 'canvas',
    image: copyCanvas(canvas),
    at: relative(canvas.getBoundingClientRect(), origin),
  })
  const canvases = [...root.querySelectorAll('canvas')].filter((canvas) => canvas !== main && visible(canvas))
  const isVisitor = (canvas: HTMLCanvasElement) => canvas.classList.contains('hall-bunny-rig')
  const isCrowd = (canvas: HTMLCanvasElement) => canvas.classList.contains('visitor-layer')
  const props = canvases.filter((canvas) => !isVisitor(canvas) && !isCrowd(canvas))
  const sprites = [...root.querySelectorAll<HTMLElement>('.npc-sprite')].filter(visible)
  const text = [...root.querySelectorAll<HTMLElement>('.placard, .placard-title')]
    .filter(visible)
    .map((element) => textLayer(element, origin))
    .filter((layer): layer is Layer => layer !== null)

  return {
    width: origin.width,
    height: origin.height,
    layers: [
      canvasLayer(main),
      ...props.map(canvasLayer),
      ...text,
      ...sprites.map((sprite) => spriteLayer(sprite, origin)).filter((layer): layer is Layer => layer !== null),
      ...canvases.filter(isCrowd).map(canvasLayer),
      ...canvases.filter(isVisitor).map(canvasLayer),
    ],
  }
}

function loadImage(url: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.onload = () => resolve(image)
    image.onerror = () => resolve(null)
    image.src = url
  })
}

/** Break text into lines that fit `maxWidth`, keeping words whole unless one is wider than the plaque. */
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = []
  let line = ''
  const push = (word: string): void => {
    const next = line ? `${line} ${word}` : word
    if (ctx.measureText(next).width <= maxWidth || !line) {
      line = next
      return
    }
    lines.push(line)
    line = word
  }
  for (const word of text.split(/\s+/)) {
    if (ctx.measureText(word).width > maxWidth) {
      if (line) {
        lines.push(line)
        line = ''
      }
      let piece = ''
      for (const char of word) {
        if (piece && ctx.measureText(piece + char).width > maxWidth) {
          lines.push(piece)
          piece = char
        } else {
          piece += char
        }
      }
      line = piece
    } else {
      push(word)
    }
  }
  if (line) lines.push(line)
  return lines.length > 0 ? lines : [text]
}

async function paint(grab: Grab, scale: number, withSprites: boolean): Promise<HTMLCanvasElement> {
  const out = document.createElement('canvas')
  out.width = Math.round(grab.width * scale)
  out.height = Math.round(grab.height * scale)
  const ctx = out.getContext('2d')!
  ctx.scale(scale, scale)
  for (const layer of grab.layers) {
    const { x, y, w, h } = layer.at
    if (layer.kind === 'canvas') {
      ctx.drawImage(layer.image, x, y, w, h)
      continue
    }
    if (layer.kind === 'text') {
      ctx.save()
      ctx.globalAlpha = layer.alpha
      ctx.font = layer.font
      ctx.fillStyle = layer.color
      ctx.textAlign = layer.align
      ctx.textBaseline = 'top'
      // Match the overlay's clipping so long descriptions stay within their plaque.
      ctx.beginPath()
      ctx.rect(x, y, w, h)
      ctx.clip()
      const lines = wrapText(ctx, layer.text, w)
      const tx = layer.align === 'center' ? x + w / 2 : layer.align === 'right' ? x + w : x
      const leading = Math.max(0, (layer.lineHeight - layer.fontSize) / 2)
      for (let i = 0; i < lines.length; i++) {
        // The title's ink is vertically centred in its line box, as the browser does.
        ctx.fillText(lines[i], tx, y + i * layer.lineHeight + leading)
      }
      ctx.restore()
      continue
    }
    if (!withSprites) continue
    const image = await loadImage(layer.url)
    if (!image) continue
    const kx = image.naturalWidth / layer.sheet.w
    const ky = image.naturalHeight / layer.sheet.h
    ctx.save()
    ctx.globalAlpha = layer.alpha
    if (layer.flip) {
      ctx.translate(x + w, y)
      ctx.scale(-1, 1)
    } else ctx.translate(x, y)
    ctx.drawImage(image, layer.source.x * kx, layer.source.y * ky, layer.source.w * kx, layer.source.h * ky, 0, 0, w, h)
    ctx.restore()
  }
  return out
}

function toJpeg(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((resolve) => {
    try {
      canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.86)
    } catch {
      resolve(null)
    }
  })
}

/** A JPEG no wider than `maxWidth`; townsfolk are dropped if their art cannot be read back. */
export async function composeJpeg(grab: Grab, maxWidth = 1600): Promise<Blob | null> {
  const scale = Math.min(2, maxWidth / grab.width)
  return (await toJpeg(await paint(grab, scale, true))) ?? toJpeg(await paint(grab, scale, false))
}
