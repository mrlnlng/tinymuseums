import type Phaser from 'phaser'
import { CONFIG } from '@/features/hall/scene/config'
import { PPU, toPhaser } from './view'
import type { GameAssets } from './assets'

export interface Backdrop {
  dispose(): void
}

const WALL_HEIGHT = 30
const FLOOR_HEIGHT = 2.6

export function createBackdrop(
  scene: Phaser.Scene,
  assets: GameAssets,
  hallLength: number,
): Backdrop {
  const span = hallLength + 120
  const centerX = hallLength / 2

  const wallAt = toPhaser(centerX, WALL_HEIGHT / 2)
  const wall = scene.add
    .tileSprite(wallAt.x, wallAt.y, span * PPU, WALL_HEIGHT * PPU, 'hall-wallpaper')
    .setTileScale(
      (CONFIG.wallpaper.stripePairWidth * PPU) / assets.wallpaper.naturalWidth,
      (WALL_HEIGHT * PPU) / assets.wallpaper.naturalHeight,
    )
    .setDepth(-0.5)

  const floorAt = toPhaser(centerX, -FLOOR_HEIGHT / 2)
  const floorScale = (FLOOR_HEIGHT * PPU) / assets.floor.naturalHeight
  const floor = scene.add
    .tileSprite(floorAt.x, floorAt.y, span * PPU, FLOOR_HEIGHT * PPU, 'hall-floor')
    .setTileScale(floorScale, floorScale)
    .setDepth(-0.4)

  return {
    dispose() {
      wall.destroy()
      floor.destroy()
    },
  }
}
