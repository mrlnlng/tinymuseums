import type Phaser from 'phaser'
import type { Attachment, Carried, CarriedState } from '../scene/carried.ts'
import type { Character, Pose } from '../scene/character.ts'
import { CONFIG } from '../scene/config.ts'
import type { Projector } from '../scene/projector.ts'
import { fromPhaser, PPU, toPhaser } from './view.ts'

export interface HomePoint {
  x: number
  y: number
  z: number
}

export interface CarriedStats {
  name: string
  x: number
  y: number
  width: number
  height: number
  angle: number
  rotation: number
  flip: number
  visible: boolean
  state: CarriedState
  src: string
}

export interface SpriteCarried extends Carried {
  stats(): CarriedStats
}

const DEPTH = CONFIG.character.z + 0.01

export function createCarriedSprite(
  scene: Phaser.Scene,
  name: string,
  image: HTMLImageElement,
  attachment: Attachment,
  home: (out: HomePoint) => number,
): SpriteCarried {
  const { flightSeconds, arcLift, spin } = CONFIG.carry
  const aspect = image.naturalHeight / image.naturalWidth
  const textureKey = image.src
  let addedTexture = false
  if (!scene.textures.exists(textureKey) && scene.textures.addImage(textureKey, image)) {
    addedTexture = true
  }

  const sprite = scene.add
    .image(0, 0, textureKey)
    .setOrigin(0.5, 0.5)
    .setDepth(DEPTH)
    .setVisible(false)

  let state: CarriedState = 'away'
  let concealed = false
  let elapsed = 0
  let projector: Projector | null = null
  let rotation = 0
  const world: HomePoint = { x: 0, y: 0, z: 0 }
  const onBunny: Pose = { x: 0, y: 0, width: 0, rotation: 0, flip: 1 }
  const atHome: Pose = { x: 0, y: 0, width: 0, rotation: 0, flip: 1 }
  const flying: Pose = { x: 0, y: 0, width: 0, rotation: 0, flip: 1 }

  function place(pose: Pose, at: Projector): void {
    projector = at
    rotation = pose.rotation
    const point = at.toWorld(pose.x, pose.y)
    const position = toPhaser(point.x, point.y)
    const displayWidth = (pose.width / at.pxPerUnit) * PPU
    sprite.setPosition(position.x, position.y)
    sprite.setDisplaySize(displayWidth, displayWidth * aspect)
    sprite.setAngle(pose.rotation * pose.flip)
    sprite.setFlipX(pose.flip < 0)
  }

  function between(
    from: Pose,
    to: Pose,
    progress: number,
    viewport: Projector['viewport'],
  ): Pose {
    const t = progress < 0.5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2
    const u = 1 - t
    const controlX = (from.x + to.x) / 2
    const controlY = Math.min(from.y, to.y) - 2 * arcLift * viewport.height
    flying.x = u * u * from.x + 2 * u * t * controlX + t * t * to.x
    flying.y = u * u * from.y + 2 * u * t * controlY + t * t * to.y
    flying.width = from.width + (to.width - from.width) * t
    flying.flip = t < 0.5 ? from.flip : to.flip
    const turn = (to.x >= from.x ? 1 : -1) * spin * 360 * t
    flying.rotation = from.rotation + (to.rotation - from.rotation) * t + turn
    return flying
  }

  return {
    get state() {
      return state
    },

    conceal(hidden) {
      concealed = hidden
      sprite.setVisible(!(state === 'away' || (state === 'held' && concealed)))
    },

    take() {
      if (state !== 'away') return
      state = 'to-bunny'
      elapsed = 0
      sprite.setVisible(true)
    },

    giveBack() {
      if (state !== 'held') return
      state = 'back'
      elapsed = 0
    },

    update(dt, character: Character, nextProjector: Projector) {
      if (state === 'away') return false

      character.attach(attachment, onBunny)
      if (state === 'held') {
        sprite.setVisible(!concealed)
        place(onBunny, nextProjector)
        return false
      }
      sprite.setVisible(true)

      const width = home(world)
      const at = nextProjector.toScreen(world.x, world.y)
      atHome.x = at.x
      atHome.y = at.y
      atHome.width = (width * nextProjector.viewport.height) / nextProjector.viewHeight
      elapsed += dt
      const progress = Math.min(1, elapsed / flightSeconds)

      if (state === 'to-bunny') {
        place(between(atHome, onBunny, progress, nextProjector.viewport), nextProjector)
        if (progress >= 1) state = 'held'
        return false
      }

      place(between(onBunny, atHome, progress, nextProjector.viewport), nextProjector)
      if (progress < 1) return false
      state = 'away'
      sprite.setVisible(false)
      return true
    },

    stats() {
      const bounds = sprite.getBounds()
      const topLeft = fromPhaser(bounds.x, bounds.y)
      const bottomRight = fromPhaser(bounds.x + bounds.width, bounds.y + bounds.height)
      const a = projector?.toScreen(topLeft.x, topLeft.y) ?? { x: 0, y: 0 }
      const b = projector?.toScreen(bottomRight.x, bottomRight.y) ?? { x: 0, y: 0 }
      return {
        name,
        x: Math.min(a.x, b.x),
        y: Math.min(a.y, b.y),
        width: Math.abs(b.x - a.x),
        height: Math.abs(b.y - a.y),
        angle: sprite.angle,
        rotation,
        flip: sprite.flipX ? -1 : 1,
        visible: sprite.visible,
        state,
        src: image.src,
      }
    },

    dispose() {
      sprite.destroy()
      if (addedTexture && scene.textures.exists(textureKey)) scene.textures.remove(textureKey)
    },
  }
}
