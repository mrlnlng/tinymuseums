import type Phaser from 'phaser'
import { CONFIG } from '@/features/hall/scene/config'
import { PPU, toPhaser, type View } from './view'
import type { GameAssets } from './assets'

export interface Backdrop {
  sync(cameraX: number, view: View): void
  dispose(): void
}

const WALL_HEIGHT = 30
const FLOOR_HEIGHT = 2.6

interface Strip {
  key: string
  tileWidth: number
  centerY: number
  height: number
  depth: number
  tiles: Phaser.GameObjects.Image[]
}

// Three draws the backdrop with an opaque material, which ignores the images' alpha;
// their edge columns are partly transparent and would otherwise show the clear colour.
export function addOpaqueTexture(scene: Phaser.Scene, key: string, image: HTMLImageElement): void {
  if (scene.textures.exists(key)) return
  const canvas = document.createElement('canvas')
  canvas.width = image.naturalWidth
  canvas.height = image.naturalHeight
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) {
    scene.textures.addImage(key, image)
    return
  }
  ctx.drawImage(image, 0, 0)
  const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height)
  for (let i = 3; i < pixels.data.length; i += 4) pixels.data[i] = 255
  ctx.putImageData(pixels, 0, 0)
  scene.textures.addCanvas(key, canvas)
}

export function createBackdrop(
  scene: Phaser.Scene,
  assets: GameAssets,
  hallLength: number,
): Backdrop {
  const originX = hallLength / 2 - (hallLength + 120) / 2

  const strips: Strip[] = [
    {
      key: 'hall-wallpaper',
      tileWidth: CONFIG.wallpaper.stripePairWidth,
      centerY: WALL_HEIGHT / 2,
      height: WALL_HEIGHT,
      depth: -0.5,
      tiles: [],
    },
    {
      key: 'hall-floor',
      tileWidth: FLOOR_HEIGHT * (assets.floor.naturalWidth / assets.floor.naturalHeight),
      centerY: -FLOOR_HEIGHT / 2,
      height: FLOOR_HEIGHT,
      depth: -0.4,
      tiles: [],
    },
  ]

  function layout(strip: Strip, cameraX: number, view: View): void {
    const left = cameraX - view.viewWidth / 2
    const first = Math.floor((left - originX) / strip.tileWidth)
    const count = Math.ceil(view.viewWidth / strip.tileWidth) + 2

    while (strip.tiles.length < count) {
      strip.tiles.push(
        scene.add
          .image(0, toPhaser(0, strip.centerY).y, strip.key)
          .setDisplaySize(strip.tileWidth * PPU, strip.height * PPU)
          .setDepth(strip.depth),
      )
    }

    strip.tiles.forEach((tile, i) => {
      const visible = i < count
      tile.setVisible(visible)
      if (visible) tile.setX((originX + (first + i + 0.5) * strip.tileWidth) * PPU)
    })
  }

  return {
    sync(cameraX, view) {
      for (const strip of strips) layout(strip, cameraX, view)
    },

    dispose() {
      for (const strip of strips) for (const tile of strip.tiles) tile.destroy()
    },
  }
}
