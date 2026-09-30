import type Phaser from 'phaser'
import { prefersReducedMotion } from './motion.ts'
import { toPhaser } from './view.ts'

const SPARKLE_TEXTURE = 'hall-sparkle'

export interface EffectTexture {
  key: string
  frame?: string
  scale: number
}

let emitters = 0
let playing = 0

export function particleEmitterCount(): number {
  return emitters
}

export function effectsPlaying(): boolean {
  return playing > 0
}

function coinRef(scene: Phaser.Scene): { key: string; frame: string } | null {
  for (const key of scene.textures.getTextureKeys()) {
    if (scene.textures.get(key).has('coin')) return { key, frame: 'coin' }
  }
  return null
}

function sparkTexture(scene: Phaser.Scene): string {
  if (!scene.textures.exists(SPARKLE_TEXTURE)) {
    const graphics = scene.add.graphics()
    graphics.fillStyle(0xffffff, 1)
    graphics.fillCircle(4, 4, 4)
    graphics.generateTexture(SPARKLE_TEXTURE, 8, 8)
    graphics.destroy()
  }
  return SPARKLE_TEXTURE
}

export function effectTexture(scene: Phaser.Scene): EffectTexture {
  const coin = coinRef(scene)
  if (coin) return { ...coin, scale: 0.18 }

  if (!scene.textures.exists(SPARKLE_TEXTURE)) {
    const graphics = scene.add.graphics()
    graphics.fillStyle(0xffffff, 1)
    graphics.fillCircle(4, 4, 4)
    graphics.generateTexture(SPARKLE_TEXTURE, 8, 8)
    graphics.destroy()
  }
  return { key: SPARKLE_TEXTURE, scale: 1 }
}

export function coinSparkle(scene: Phaser.Scene, worldX: number, worldY: number): void {
  if (prefersReducedMotion()) return

  const ref = effectTexture(scene)
  const at = toPhaser(worldX, worldY)
  emitters += 1

  const spark = sparkTexture(scene)
  const emitter = scene.add.particles(at.x, at.y, spark, {
    speed: { min: 60, max: 220 },
    lifespan: 600,
    scale: { start: 1.2, end: 0 },
    alpha: { start: 1, end: 0 },
    angle: { min: 0, max: 360 },
    tint: [0xfff4b0, 0xffd966, 0xffffff],
    emitting: false,
  })
  emitter.setDepth(1000)
  playing += 1
  emitter.explode(24)
  emitter.once('complete', () => {
    playing -= 1
    emitter.destroy()
  })
}
