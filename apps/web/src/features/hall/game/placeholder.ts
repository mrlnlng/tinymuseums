import type Phaser from 'phaser'
import { thumbHashToRGBA } from 'thumbhash'

export function placeholderTexture(
  scene: Phaser.Scene,
  key: string,
  hash: string,
): Phaser.Textures.CanvasTexture | null {
  if (scene.textures.exists(key)) return null

  const bytes = Uint8Array.from(atob(hash), (c) => c.charCodeAt(0))
  const { w, h, rgba } = thumbHashToRGBA(bytes)

  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  const image = ctx.createImageData(w, h)
  image.data.set(rgba)
  ctx.putImageData(image, 0, 0)

  return scene.textures.addCanvas(key, canvas)
}
