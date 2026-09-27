import * as THREE from 'three'
import { thumbHashToRGBA } from 'thumbhash'

// Rows are flipped by hand: UNPACK_FLIP_Y does not reliably apply to typed-array uploads.
export function placeholderTexture(hash: string): THREE.DataTexture {
  const bytes = Uint8Array.from(atob(hash), (c) => c.charCodeAt(0))
  const { w, h, rgba } = thumbHashToRGBA(bytes)
  const flipped = new Uint8Array(rgba.length)
  const row = w * 4
  for (let y = 0; y < h; y++) flipped.set(rgba.subarray(y * row, (y + 1) * row), (h - 1 - y) * row)

  const texture = new THREE.DataTexture(flipped, w, h, THREE.RGBAFormat)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.magFilter = THREE.LinearFilter
  texture.minFilter = THREE.LinearFilter
  texture.generateMipmaps = false
  texture.userData.ownedByDisplay = true
  texture.needsUpdate = true
  return texture
}
