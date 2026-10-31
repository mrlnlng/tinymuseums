import * as THREE from 'three'
import manifest from '@/generated/asset-manifest.json'
import { builtUrl } from '@/shared/lib/assets'
import { plane } from './board'
import { pickPainted } from './hit'

export const GALLERY_DOOR = {
  lobbyX: -3.6,
  atelierX: -3.1,
  height: 2.8,
  lobbyBase: -0.26,
  atelierBase: -0.42,
  clear: 0.85,
} as const

const pending = new Map<string, Promise<HTMLImageElement>>()
function loadImage(src: string): Promise<HTMLImageElement> {
  const existing = pending.get(src)
  if (existing) return existing
  const request = new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    // CDN images need CORS permission before WebGL can use them as textures.
    image.crossOrigin = 'anonymous'
    image.decoding = 'async'
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('The costume gallery doorway could not load.'))
    image.src = builtUrl(src)
  }).catch(error => { pending.delete(src); throw error })
  pending.set(src, request)
  return request
}

export const loadGalleryDoor = () => loadImage(manifest.galleryDoor.src)
export const loadGalleryPillar = () => loadImage(manifest.atelier.column.src)

export function createGalleryDoor(parent: THREE.Scene | THREE.Group, image: HTMLImageElement, x: number, base: number = GALLERY_DOOR.lobbyBase) {
  const texture = new THREE.Texture(image)
  texture.needsUpdate = true
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  const height = GALLERY_DOOR.height
  const width = height * image.naturalWidth / image.naturalHeight
  const mesh = plane(width, height, texture, x, base + height / 2, 0.2)
  parent.add(mesh)
  return {
    hitTest: (raycaster: THREE.Raycaster) => pickPainted(raycaster, [mesh]) !== null,
    dispose() {
      parent.remove(mesh)
      mesh.geometry.dispose()
      ;(mesh.material as THREE.Material).dispose()
      texture.dispose()
    },
  }
}
