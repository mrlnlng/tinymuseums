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

// Atlas sprites share one image (and a compressed texture has none to read), so
// their alpha comes from masks built with the assets, keyed by sprite name.
const spriteMasks = new Map<string, AlphaMap>()

export interface SpriteRegion {
  name: string
  u0: number
  v0: number
  du: number
  dv: number
}

export interface WorldPoint {
  x: number
  y: number
}

export interface Uv {
  u: number
  v: number
}

export interface WorldHit {
  object: THREE.Object3D
  uv: Uv
  z: number
}

export function registerSpriteMask(name: string, width: number, height: number, alpha: Uint8Array): void {
  spriteMasks.set(name, { width, height, data: spread(alpha, width, height), exact: alpha })
}

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

export function paintedAtUv(texture: THREE.Texture, u: number, v: number, exact: boolean): boolean {
  let map: AlphaMap | null | undefined
  let uu = u
  let vv = v
  const region = texture.userData.sprite as SpriteRegion | undefined
  if (region) {
    map = spriteMasks.get(region.name)
    uu = (texture.offset.x + u * texture.repeat.x - region.u0) / region.du
    vv = (texture.offset.y + v * texture.repeat.y - region.v0) / region.dv
  } else {
    const image = texture.image as TexImageSource | undefined
    map = image ? alphaMapFor(image) : null
  }
  if (!map) return true

  const x = Math.min(map.width - 1, Math.max(0, Math.floor(uu * map.width)))
  const y = Math.min(map.height - 1, Math.max(0, Math.floor((1 - vv) * map.height)))
  return (exact ? map.exact : map.data)[y * map.width + x] >= OPAQUE_ALPHA
}

export function paintedAtObject(
  object: THREE.Object3D,
  u: number | null | undefined,
  v: number | null | undefined,
  exact = false,
): boolean {
  if (u === null || u === undefined || v === null || v === undefined) return true

  const material = (object as THREE.Mesh).material as THREE.MeshBasicMaterial
  const texture = material.map
  if (!texture) return true

  return paintedAtUv(texture, u, v, exact)
}

export function isPaintedAt(hit: THREE.Intersection, exact = false): boolean {
  if (!hit.uv) return true
  return paintedAtObject(hit.object, hit.uv.x, hit.uv.y, exact)
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

const defaultLayers = new THREE.Layers()
const localPoint = new THREE.Vector3()
const worldAt = new THREE.Vector3()

function facesCamera(mesh: THREE.Mesh): boolean {
  const material = mesh.material as THREE.Material
  if (material.side === THREE.DoubleSide) return true
  const depth = mesh.matrixWorld.elements[10]
  return material.side === THREE.BackSide ? depth < 0 : depth > 0
}

export function meshUvAt(mesh: THREE.Mesh, point: WorldPoint): Uv | null {
  if (!mesh.layers.test(defaultLayers)) return null
  if (mesh.material === undefined) return null
  if (!facesCamera(mesh)) return null

  const { width, height } = (mesh.geometry as THREE.PlaneGeometry).parameters
  worldAt.set(point.x, point.y, mesh.matrixWorld.elements[14])
  localPoint.copy(worldAt)
  mesh.worldToLocal(localPoint)

  const u = localPoint.x / width + 0.5
  const v = localPoint.y / height + 0.5
  if (u < 0 || u > 1 || v < 0 || v > 1) return null
  return { u, v }
}

export function hitsAt(point: WorldPoint, meshes: readonly THREE.Object3D[]): WorldHit[] {
  const hits: WorldHit[] = []
  for (const object of meshes) {
    if (!(object instanceof THREE.Mesh)) continue
    const uv = meshUvAt(object, point)
    if (uv) hits.push({ object, uv, z: object.matrixWorld.elements[14] })
  }
  hits.sort((a, b) => b.z - a.z)
  return hits
}

export function pickAt(point: WorldPoint, meshes: readonly THREE.Object3D[]): WorldHit | null {
  if (meshes.length === 0) return null
  for (const hit of hitsAt(point, meshes)) {
    if (paintedAtObject(hit.object, hit.uv.u, hit.uv.v)) return hit
  }
  return null
}
