import * as THREE from 'three'
import { paintedAtImage, paintedAtSprite, registerSpriteMask } from '../game/hit.ts'

export { paintedAtImage, paintedAtSprite, registerSpriteMask }

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

export function paintedAtUv(texture: THREE.Texture, u: number, v: number, exact: boolean): boolean {
  const region = texture.userData.sprite as SpriteRegion | undefined
  if (region) {
    const uu = (texture.offset.x + u * texture.repeat.x - region.u0) / region.du
    const vv = (texture.offset.y + v * texture.repeat.y - region.v0) / region.dv
    return paintedAtSprite(region.name, uu, vv, exact)
  }

  const image = texture.image as TexImageSource | undefined
  return image ? paintedAtImage(image, u, v, exact) : true
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
