import * as THREE from 'three'

const MAX_SIDE = 128

const REACH = 3

interface AlphaMap {
  width: number
  height: number
  data: Uint8Array
  exact: Uint8Array
}

const alphaMaps = new WeakMap<TexImageSource, AlphaMap | null>()

const OPAQUE_ALPHA = 32

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
    // A cross-origin image taints the canvas and cannot be read back.
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

export function isPaintedAt(hit: THREE.Intersection, exact = false): boolean {
  if (!hit.uv) return true

  const material = (hit.object as THREE.Mesh).material as THREE.MeshBasicMaterial
  const image = material.map?.image as TexImageSource | undefined
  if (!image) return true

  const map = alphaMapFor(image)
  if (!map) return true

  const x = Math.min(map.width - 1, Math.max(0, Math.floor(hit.uv.x * map.width)))
  const y = Math.min(map.height - 1, Math.max(0, Math.floor((1 - hit.uv.y) * map.height)))
  return (exact ? map.exact : map.data)[y * map.width + x] >= OPAQUE_ALPHA
}

export function pickPainted(
  raycaster: THREE.Raycaster,
  meshes: readonly THREE.Object3D[],
): THREE.Intersection | null {
  if (meshes.length === 0) return null
  for (const hit of raycaster.intersectObjects(meshes as THREE.Object3D[], false)) {
    if (isPaintedAt(hit)) return hit
  }
  return null
}
