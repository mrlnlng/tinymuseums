import * as THREE from 'three'

let texture: THREE.CanvasTexture | null = null
let material: THREE.MeshBasicMaterial | null = null

function shadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 64
  const ink = canvas.getContext('2d')
  if (ink) {
    ink.translate(64, 32)
    ink.scale(1, 0.5)
    const shade = ink.createRadialGradient(0, 0, 0, 0, 0, 64)
    shade.addColorStop(0, 'rgba(34, 9, 6, 0.55)')
    shade.addColorStop(0.55, 'rgba(34, 9, 6, 0.25)')
    shade.addColorStop(1, 'rgba(34, 9, 6, 0)')
    ink.fillStyle = shade
    ink.fillRect(-64, -64, 128, 128)
  }
  const map = new THREE.CanvasTexture(canvas)
  map.colorSpace = THREE.SRGBColorSpace
  map.minFilter = THREE.LinearMipmapLinearFilter
  map.magFilter = THREE.LinearFilter
  map.anisotropy = 4
  return map
}

function shadowMaterial(): THREE.MeshBasicMaterial {
  material ??= new THREE.MeshBasicMaterial({
    map: (texture ??= shadowTexture()),
    transparent: true,
    depthWrite: false,
  })
  return material
}

/** A soft contact shadow on the floor, with geometry per prop and shared painting resources. */
export function groundShadow(width: number, x: number, y: number): THREE.Mesh {
  const height = Math.max(0.07, width * 0.2)
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), shadowMaterial())
  mesh.position.set(x, y, -0.36)
  mesh.userData.sharedGroundShadow = true
  return mesh
}

export function disposeGroundShadows(): void {
  material?.dispose()
  texture?.dispose()
  material = null
  texture = null
}
