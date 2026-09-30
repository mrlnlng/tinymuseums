export interface WorldPoint {
  x: number
  y: number
}

export interface Uv {
  u: number
  v: number
}

export interface SpriteMaskRef {
  sprite: string
}

export interface ImageMaskRef {
  image: TexImageSource
}

export type PlaneMask = SpriteMaskRef | ImageMaskRef | null

export interface PlaneLike {
  x: number
  y: number
  width: number
  height: number
  z: number
  flipX: boolean
  mask: PlaneMask
}

export interface PlaneHit<P extends PlaneLike = PlaneLike> {
  plane: P
  uv: Uv
  z: number
}

const MAX_SIDE = 128

const REACH = 3

const OPAQUE_ALPHA = 32

interface AlphaMap {
  width: number
  height: number
  data: Uint8Array
  exact: Uint8Array
}

const alphaMaps = new WeakMap<TexImageSource, AlphaMap | null>()

const spriteMasks = new Map<string, AlphaMap>()

export function registerSpriteMask(name: string, width: number, height: number, alpha: Uint8Array): void {
  spriteMasks.set(name, { width, height, data: spread(alpha, width, height), exact: alpha })
}

function alphaMapFor(image: TexImageSource): AlphaMap | null {
  const cached = alphaMaps.get(image)
  if (cached !== undefined) return cached

  const map = buildAlphaMap(image)
  alphaMaps.set(image, map)
  return map
}

function buildAlphaMap(image: TexImageSource): AlphaMap | null {
  const source = image as HTMLImageElement
  const sourceWidth = source.naturalWidth ?? source.width
  const sourceHeight = source.naturalHeight ?? source.height
  if (!sourceWidth || !sourceHeight) return null

  const scale = Math.min(1, MAX_SIDE / Math.max(sourceWidth, sourceHeight))
  const width = Math.max(1, Math.round(sourceWidth * scale))
  const height = Math.max(1, Math.round(sourceHeight * scale))

  try {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return null
    ctx.drawImage(source, 0, 0, width, height)

    const { data: rgba } = ctx.getImageData(0, 0, width, height)
    const data = new Uint8Array(width * height)
    for (let i = 0; i < data.length; i++) data[i] = rgba[i * 4 + 3]
    return { width, height, data: spread(data, width, height), exact: data }
  } catch {
    return null
  }
}

function spread(source: Uint8Array, width: number, height: number): Uint8Array {
  const across = new Uint8Array(source.length)
  for (let y = 0; y < height; y++) {
    const row = y * width
    for (let x = 0; x < width; x++) {
      let strongest = 0
      const from = Math.max(0, x - REACH)
      const to = Math.min(width - 1, x + REACH)
      for (let k = from; k <= to; k++) strongest = Math.max(strongest, source[row + k])
      across[row + x] = strongest
    }
  }

  const down = new Uint8Array(source.length)
  for (let y = 0; y < height; y++) {
    const from = Math.max(0, y - REACH)
    const to = Math.min(height - 1, y + REACH)
    for (let x = 0; x < width; x++) {
      let strongest = 0
      for (let k = from; k <= to; k++) strongest = Math.max(strongest, across[k * width + x])
      down[y * width + x] = strongest
    }
  }
  return down
}

function painted(map: AlphaMap | null | undefined, u: number, v: number, exact: boolean): boolean {
  if (!map) return true

  const x = Math.min(map.width - 1, Math.max(0, Math.floor(u * map.width)))
  const y = Math.min(map.height - 1, Math.max(0, Math.floor((1 - v) * map.height)))
  return (exact ? map.exact : map.data)[y * map.width + x] >= OPAQUE_ALPHA
}

export function paintedAtSprite(name: string, u: number, v: number, exact: boolean): boolean {
  return painted(spriteMasks.get(name), u, v, exact)
}

export function paintedAtImage(image: TexImageSource, u: number, v: number, exact: boolean): boolean {
  return painted(alphaMapFor(image), u, v, exact)
}

export function planeUvAt(plane: PlaneLike, point: WorldPoint): Uv | null {
  const left = plane.x - plane.width / 2
  const bottom = plane.y - plane.height / 2

  let u = (point.x - left) / plane.width
  const v = (point.y - bottom) / plane.height
  if (plane.flipX) u = 1 - u
  if (u < 0 || u > 1 || v < 0 || v > 1) return null
  return { u, v }
}

export function hitsAt<P extends PlaneLike>(point: WorldPoint, planes: readonly P[]): PlaneHit<P>[] {
  const hits: PlaneHit<P>[] = []
  for (const plane of planes) {
    const uv = planeUvAt(plane, point)
    if (uv) hits.push({ plane, uv, z: plane.z })
  }
  hits.sort((a, b) => b.z - a.z)
  return hits
}

export function isPaintedAt(hit: PlaneHit, exact = false): boolean {
  const mask = hit.plane.mask
  if (!mask) return true
  if ('sprite' in mask) return paintedAtSprite(mask.sprite, hit.uv.u, hit.uv.v, exact)
  return paintedAtImage(mask.image, hit.uv.u, hit.uv.v, exact)
}

export function pickAt<P extends PlaneLike>(
  point: WorldPoint,
  planes: readonly P[],
  exact = false,
): PlaneHit<P> | null {
  for (const hit of hitsAt(point, planes)) {
    if (isPaintedAt(hit, exact)) return hit
  }
  return null
}
