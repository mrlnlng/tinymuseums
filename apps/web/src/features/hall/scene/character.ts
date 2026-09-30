import type { Assets } from './assets'
import type { Attachment } from './carried'
import { CONFIG } from './config'
import type { Projector } from './projector'

export interface Pose {
  x: number
  y: number
  width: number
  rotation: number
  flip: number
}

export interface Perch {
  image: HTMLImageElement
  x: number
  y: number
  height: number
  seated: boolean
}

export interface Character {
  readonly idleImage: HTMLImageElement
  perch(perch: Perch | null): void
  attach(attachment: Attachment, out: Pose): Pose
  update(dt: number, x: number, velocity: number, projector: Projector): void
  dispose(): void
}

export function createCharacter(assets: Assets, host: HTMLElement): Character {
  const idle = assets.bunnyIdle
  const cycle = (side: 'left' | 'right'): HTMLImageElement[] =>
    assets.walk[side].length > 0 ? assets.walk[side] : [idle[side]]

  const sprite = document.createElement('img')
  sprite.className = 'hall-bunny'
  sprite.alt = ''
  sprite.setAttribute('aria-hidden', 'true')
  sprite.src = idle.right.src
  host.appendChild(sprite)

  let distance = 0
  let facing: 'left' | 'right' = 'right'
  let currentSrc = idle.right.src
  let currentImage = idle.right
  let moving = false
  let screenX = 0
  let screenY = 0
  let scale = 1
  let currentHeight = ''
  let currentTransform = ''
  let perched: Perch | null = null

  function setFrame(image: HTMLImageElement): void {
    currentImage = image
    if (currentSrc === image.src) return
    currentSrc = image.src
    sprite.src = image.src
  }

  return {
    get idleImage() {
      return idle[facing]
    },

    perch(perch) {
      perched = perch
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

    update(dt, x, velocity, projector) {
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

      const at = perched
        ? projector.toScreen(perched.x, perched.y)
        : projector.toScreen(x, CONFIG.character.centerY + float)

      screenX = at.x
      screenY = at.y

      const worldHeight = perched ? perched.height : CONFIG.character.height
      const heightPx = (worldHeight / projector.viewHeight) * projector.viewport.height
      const height = `${heightPx.toFixed(1)}px`
      if (height !== currentHeight) {
        currentHeight = height
        sprite.style.height = height
      }

      const transform =
        `translate3d(${screenX.toFixed(1)}px, ${screenY.toFixed(1)}px, 0)` +
        ' translate(-50%, -50%)'
      if (transform !== currentTransform) {
        currentTransform = transform
        sprite.style.transform = transform
      }
      scale = heightPx / currentImage.naturalHeight
    },

    dispose() {
      sprite.remove()
    },
  }
}
