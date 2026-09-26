import type { SketchRoundDto } from '@tiny/core'
import { sameOriginUrl } from '@/features/hall/lib/media'

const TIMEOUT_MS = 10_000

export interface InkMap {
  width: number
  height: number
  ink: Uint8ClampedArray
}

export interface LoadedRound {
  round: SketchRoundDto
  ink: InkMap
}

// Written out by hand: AbortSignal.any and AbortSignal.timeout are missing from
// the older iOS Safari still in use.
async function guarded<T>(run: (signal: AbortSignal) => Promise<T>, outer?: AbortSignal): Promise<T> {
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(new DOMException('Timed out', 'TimeoutError')), TIMEOUT_MS)
  const abort = () => controller.abort(outer?.reason)
  if (outer?.aborted) abort()
  else outer?.addEventListener('abort', abort, { once: true })
  try {
    return await run(controller.signal)
  } finally {
    window.clearTimeout(timer)
    outer?.removeEventListener('abort', abort)
  }
}

function fetchRound(epochId: number, round: number, outer?: AbortSignal): Promise<SketchRoundDto> {
  return guarded(async (signal) => {
    const response = await fetch(`/api/sketch?epoch=${epochId}&round=${round}`, { signal })
    if (!response.ok) throw new Error(`sketch round ${response.status}`)
    return (await response.json()) as SketchRoundDto
  }, outer)
}

function fetchBitmap(url: string, outer?: AbortSignal): Promise<ImageBitmap> {
  return guarded(async (signal) => {
    const response = await fetch(url, { mode: 'cors', credentials: 'omit', signal })
    if (!response.ok) throw new Error(`sketch image ${response.status}`)
    return createImageBitmap(await response.blob())
  }, outer)
}

async function loadInk(url: string, signal?: AbortSignal): Promise<InkMap> {
  let bitmap: ImageBitmap
  try {
    bitmap = await fetchBitmap(url, signal)
  } catch (error) {
    const ownOrigin = sameOriginUrl(url)
    if (ownOrigin === null || signal?.aborted) throw error
    bitmap = await fetchBitmap(ownOrigin, signal)
  }

  const { width, height } = bitmap
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) throw new Error('Canvas 2D is unavailable')
  ctx.drawImage(bitmap, 0, 0)
  bitmap.close()

  const { data } = ctx.getImageData(0, 0, width, height)
  const ink = new Uint8ClampedArray(width * height)
  for (let i = 0; i < ink.length; i++) ink[i] = data[i * 4]
  return { width, height, ink }
}

export function decodeImage(url: string, signal?: AbortSignal): Promise<void> {
  return guarded(async (guard) => {
    const image = new Image()
    image.decoding = 'async'
    const abort = () => {
      image.src = ''
    }
    guard.addEventListener('abort', abort, { once: true })
    image.src = url
    try {
      await image.decode()
    } finally {
      guard.removeEventListener('abort', abort)
    }
    if (guard.aborted) throw guard.reason
  }, signal)
}

function warmImage(url: string): void {
  const image = new Image()
  image.decoding = 'async'
  image.src = url
}

export async function loadRound(epochId: number, round: number, signal?: AbortSignal): Promise<LoadedRound> {
  const data = await fetchRound(epochId, round, signal)
  const ink = await loadInk(data.answer.sketch.url, signal)
  warmImage(data.answer.image.url)
  return { round: data, ink }
}
