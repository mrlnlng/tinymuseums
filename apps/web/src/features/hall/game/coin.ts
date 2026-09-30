import type Phaser from 'phaser'
import { CONFIG } from '../scene/config.ts'
import { addPlane, type Plane } from './board.ts'
import { hitsAt, isPaintedAt, type PlaneLike, type WorldPoint } from './hit.ts'
import type { GameAssets } from './assets.ts'
import { PPU } from './view.ts'

export type CoinSpot = 'frame' | 'rope' | 'pedestal'

const COIN_FILE = 'coin.png'

export interface CoinWall {
  index: number
  centerX: number
  width: number
  height: number
  bottom: number
  pedestalDx: number | null
}

export interface CoinPlane {
  x: number
  y: number
  width: number
  height: number
  z: number
}

export function coinGeometry(
  wall: CoinWall,
  spot: CoinSpot,
  side: number,
  aspect: number,
): CoinPlane {
  const spec = CONFIG.coin
  const here = spot === 'pedestal' && wall.pedestalDx === null ? 'frame' : spot

  let width = spec.width
  let x: number
  let y: number
  let z: number

  if (here === 'frame') {
    const margin = spec.frame.margin[side < 0 ? 0 : 1] * wall.width
    const hidden = (1 - spec.frame.peek) * spec.width
    x = wall.centerX + side * (wall.width / 2 - margin - hidden + spec.width / 2)
    y = wall.bottom + wall.height * spec.frame.heightRatio
    z = spec.frame.z
  } else if (here === 'rope') {
    width = spec.rope.width
    x = wall.centerX + side * (wall.width / 2 - spec.rope.inset)
    y = spec.rope.y
    z = spec.rope.z
  } else {
    x = wall.centerX + wall.pedestalDx! + side * spec.pedestal.dx
    y = spec.pedestal.y
    z = spec.pedestal.z
  }

  return { x, y, width, height: width / aspect, z }
}

export interface HiddenCoin {
  readonly index: number | null
  choose(totalWalls: number): void
  attach(wall: CoinWall): void
  detach(index: number): void
  hitAt(point: WorldPoint, blockers: readonly PlaneLike[]): boolean
  markFound(): void
  release(): void
  move(dx: number): void
  update(dt: number): void
  position(): { x: number; y: number } | null
}

export function createHiddenCoin(scene: Phaser.Scene, assets: GameAssets): HiddenCoin {
  const spec = CONFIG.coin
  const frame = assets.frameOf(COIN_FILE)
  const ref = { key: frame.key, frame: frame.frame }
  const aspect = frame.aspect

  let index: number | null = null
  let spot: CoinSpot = 'frame'
  const side = Math.random() < 0.5 ? -1 : 1
  let state: 'hidden' | 'found' | 'vanishing' | 'gone' = 'hidden'
  let mesh: Plane | null = null
  let elapsed = 0

  function hitAt(point: WorldPoint, blockers: readonly PlaneLike[]): boolean {
    if (state !== 'hidden' || !mesh) return false
    const coin = mesh
    for (const hit of hitsAt(point, [coin, ...blockers])) {
      if (hit.plane === coin) return isPaintedAt(hit)
      if (isPaintedAt(hit, true)) return false
    }
    return false
  }

  return {
    get index() {
      return index
    },

    choose(totalWalls) {
      if (index !== null || totalWalls <= 0) return
      index = Math.floor(Math.random() * totalWalls)
      spot = (['frame', 'rope', 'pedestal'] as const)[Math.floor(Math.random() * 3)]
    },

    attach(wall) {
      if (state === 'gone' || wall.index !== index || mesh) return
      const at = coinGeometry(wall, spot, side, aspect)
      mesh = addPlane(scene, ref, at.width, at.height, at.x, at.y, at.z)
    },

    detach(wallIndex) {
      if (wallIndex !== index) return
      mesh?.image.destroy()
      mesh = null
      if (state === 'vanishing') state = 'gone'
    },

    hitAt,

    markFound() {
      if (state !== 'hidden' || !mesh) return
      state = 'found'
    },

    position() {
      return mesh ? { x: mesh.x, y: mesh.y } : null
    },

    release() {
      if (state !== 'found') return
      state = 'vanishing'
      elapsed = 0
    },

    move(dx) {
      if (!mesh || dx === 0) return
      mesh.x += dx
      mesh.image.setX(mesh.image.x + dx * PPU)
    },

    update(dt) {
      if (!mesh) return
      elapsed += dt

      if (state === 'vanishing') {
        const left = Math.max(0, 1 - elapsed / spec.vanishSeconds)
        mesh.image.setScale(left)
        mesh.image.rotation += dt * 9
        if (left === 0) {
          mesh.image.destroy()
          mesh = null
          state = 'gone'
        }
        return
      }

      const t = elapsed % spec.wiggleEverySeconds
      mesh.image.rotation = Math.sin(t * 28) * 0.18 * (Math.max(0, 0.45 - t) / 0.45)
    },
  }
}
