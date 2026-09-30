import type Phaser from 'phaser'
import type { Character, Perch } from '../scene/character.ts'
import { CONFIG } from '../scene/config.ts'
import type { Projector } from '../scene/projector.ts'
import type { GameAssets } from './assets.ts'
import { fromPhaser, PPU, toPhaser } from './view.ts'

export interface BunnyStats {
  x: number
  y: number
  width: number
  height: number
  src: string
}

export interface SpriteCharacter extends Character {
  bunny(): BunnyStats
}

export function createSpriteCharacter(scene: Phaser.Scene, assets: GameAssets): SpriteCharacter {
  const idle = assets.bunnyIdle
  const cycle = (side: 'left' | 'right'): HTMLImageElement[] =>
    assets.walk[side].length > 0 ? assets.walk[side] : [idle[side]]

  const added = new Set<string>()

  function textureFor(image: HTMLImageElement): string {
    const key = image.src
    if (!scene.textures.exists(key) && scene.textures.addImage(key, image)) added.add(key)
    return key
  }

  let currentImage = idle.right
  let currentSrc = idle.right.src

  const sprite = scene.add
    .image(0, 0, textureFor(currentImage))
    .setOrigin(0.5, 0.5)
    .setDepth(CONFIG.character.z)

  let distance = 0
  let facing: 'left' | 'right' = 'right'
  let moving = false
  let screenX = 0
  let screenY = 0
  let scale = 1
  let perched: Perch | null = null
  let projector: Projector | null = null

  function setFrame(image: HTMLImageElement): void {
    currentImage = image
    if (currentSrc === image.src) return
    currentSrc = image.src
    sprite.setTexture(textureFor(image))
  }

  function rect(): Omit<BunnyStats, 'src'> {
    if (!projector) {
      const height = currentImage.naturalHeight * scale
      const width = currentImage.naturalWidth * scale
      return { x: screenX - width / 2, y: screenY - height / 2, width, height }
    }

    const bounds = sprite.getBounds()
    const topLeft = fromPhaser(bounds.x, bounds.y)
    const bottomRight = fromPhaser(bounds.x + bounds.width, bounds.y + bounds.height)
    const a = projector.toScreen(topLeft.x, topLeft.y)
    const b = projector.toScreen(bottomRight.x, bottomRight.y)
    return {
      x: Math.min(a.x, b.x),
      y: Math.min(a.y, b.y),
      width: Math.abs(b.x - a.x),
      height: Math.abs(b.y - a.y),
    }
  }

  return {
    get idleImage() {
      return idle[facing]
    },

    perch(next) {
      perched = next
    },

    attach(attachment, out) {
      const { naturalWidth, naturalHeight } = currentImage
      if (perched?.seated) {
        const { sit } = attachment
        out.x = screenX + (sit.x - naturalWidth / 2) * scale
        out.y = screenY + (sit.y - naturalHeight / 2) * scale
        out.width = sit.width * scale
        out.rotation = sit.rotation
        out.flip = sit.flip
        return out
      }

      const place = moving ? attachment.walk : attachment.idle
      const asDrawn = facing === attachment.facing
      const drawnX = asDrawn ? place.x : naturalWidth - place.x
      out.x = screenX + (drawnX - naturalWidth / 2) * scale
      out.y = screenY + (place.y - naturalHeight / 2) * scale
      out.width = attachment.width * scale
      out.rotation = place.rotation
      out.flip = asDrawn ? 1 : -1
      return out
    },

    update(dt, x, velocity, nextProjector) {
      const speed = Math.abs(velocity)
      moving = !perched && speed > 0.12

      distance += speed * dt

      if (perched) {
        setFrame(perched.image)
      } else if (moving) {
        facing = velocity > 0 ? 'right' : 'left'
        const frames = cycle(facing)
        const step = Math.floor(distance * CONFIG.character.cyclesPerUnit * frames.length)
        setFrame(frames[((step % frames.length) + frames.length) % frames.length])
      } else {
        setFrame(idle[facing])
      }

      const float = moving
        ? Math.sin(distance * CONFIG.character.cyclesPerUnit * Math.PI * 2) * CONFIG.character.bob
        : 0

      const worldX = perched ? perched.x : x
      const worldY = perched ? perched.y : CONFIG.character.centerY + float
      const at = nextProjector.toScreen(worldX, worldY)
      screenX = at.x
      screenY = at.y

      projector = nextProjector
      const worldHeight = perched ? perched.height : CONFIG.character.height
      scale = ((worldHeight / nextProjector.viewHeight) * nextProjector.viewport.height) / currentImage.naturalHeight

      const displayHeight = worldHeight * PPU
      const displayWidth = (displayHeight * currentImage.naturalWidth) / currentImage.naturalHeight
      const position = toPhaser(worldX, worldY)
      sprite.setPosition(position.x, position.y)
      sprite.setDisplaySize(displayWidth, displayHeight)
    },

    bunny() {
      return { ...rect(), src: currentSrc }
    },

    dispose() {
      sprite.destroy()
      for (const key of added) if (scene.textures.exists(key)) scene.textures.remove(key)
      added.clear()
    },
  }
}
