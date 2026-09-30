import type Phaser from 'phaser'
import type { PhaserModule } from './HallGameScene.ts'
import { coinSparkle, effectTexture } from './effects.ts'
import type { HallDemoStats } from './harness.ts'
import { MOTION, tween } from './motion.ts'
import { fromPhaser, PPU } from './view.ts'

export const DEMO_KEY = 'hall-demo'

const BACKDROP_LENGTH = 600
const FLOOR_HEIGHT = 2.6
const FLOOR_LEFT = BACKDROP_LENGTH / 2 - (BACKDROP_LENGTH + 120) / 2
const COIN_SCALE = 0.35
const COIN_GRAVITY = 2000
const COIN_GAP = 70

interface HallFloorScene {
  floor?: Phaser.Physics.Arcade.StaticBody | null
}

export interface DemoGameSceneLike {
  coinStats(): HallDemoStats
}

export function createDemoGameScene(P: PhaserModule) {
  return class DemoGameScene extends P.Scene implements DemoGameSceneLike {
    private coins: Phaser.Physics.Arcade.Image[] = []
    private close = (): void => {}

    constructor() {
      super({ key: DEMO_KEY })
    }

    init(): void {
      this.coins = []
    }

    create(): void {
      const hall = this.scene.get('hall')
      const hallCam = hall.cameras.main
      const camera = this.cameras.main
      camera.setOrigin(0, 0).setZoom(hallCam.zoom).setScroll(hallCam.scrollX, hallCam.scrollY)

      const viewWidth = this.scale.width / camera.zoom
      const viewHeight = this.scale.height / camera.zoom
      const centerX = camera.scrollX + viewWidth / 2
      const centerY = camera.scrollY + viewHeight / 2

      const floor = (hall as unknown as HallFloorScene).floor ?? this.createFloor()
      const ref = effectTexture(this)

      const label = this.add
        .text(centerX, centerY, 'tap to close', {
          fontFamily: 'sans-serif',
          fontSize: '16px',
          color: '#ffffff',
          backgroundColor: 'rgba(0,0,0,0.6)',
          padding: { x: 10, y: 6 },
          resolution: window.devicePixelRatio,
        })
        .setOrigin(0.5)
        .setAlpha(0)
        .setDepth(2000)
      tween(this, label, MOTION.quick, { alpha: 1 })

      for (let i = 0; i < 3; i++) {
        const coin = this.physics.add
          .image(centerX + (i - 1) * COIN_GAP, camera.scrollY + 40, ref.key, ref.frame)
          .setOrigin(0.5, 1)
          .setScale(COIN_SCALE)
          .setBounce(0.5)
          .setGravityY(COIN_GRAVITY)
        ;(coin.body as Phaser.Physics.Arcade.Body).setOffset(0, 0)
        coin.setData('landed', false)
        this.physics.add.collider(coin, floor, () => this.onLand(coin))
        this.coins.push(coin)
      }

      this.close = () => this.scene.stop()
      this.game.canvas.addEventListener('pointerdown', this.close)
      this.events.once('shutdown', () => {
        this.game.canvas.removeEventListener('pointerdown', this.close)
        this.coins = []
      })
    }

    coinStats(): HallDemoStats {
      return {
        floorY: 0,
        coins: this.coins.flatMap((coin) => {
          const body = coin.body as Phaser.Physics.Arcade.Body | null
          if (!body) return []
          return [{ x: coin.x, y: coin.y, bottom: body.bottom, resting: body.blocked.down }]
        }),
      }
    }

    private onLand(coin: Phaser.Physics.Arcade.Image): void {
      if (coin.getData('landed') === true) return
      coin.setData('landed', true)
      const body = coin.body as Phaser.Physics.Arcade.Body
      const world = fromPhaser(body.center.x, body.center.y)
      coinSparkle(this, world.x, world.y)
    }

    private createFloor(): Phaser.Physics.Arcade.StaticBody {
      return this.physics.add.staticBody(
        FLOOR_LEFT * PPU,
        0,
        BACKDROP_LENGTH * PPU,
        FLOOR_HEIGHT * PPU,
      )
    }
  }
}
