import * as THREE from 'three'
import type { Assets } from './assets'
import type { Attachment } from './carried'
import { CONFIG } from './config'
import type { Viewport } from './overlay'

export interface Pose {
  x: number
  y: number
  width: number
  rotation: number
  flip: number
}

export interface Character {
  attach(attachment: Attachment, out: Pose): Pose
  update(
    dt: number,
    x: number,
    velocity: number,
    camera: THREE.OrthographicCamera,
    viewport: Viewport,
  ): void
  dispose(): void
}

export function createCharacter(assets: Assets, host: HTMLElement): Character {
  const cycles = {
    left: assets.walk.left.length > 0 ? assets.walk.left : [assets.bunnyIdle.left],
    right: assets.walk.right.length > 0 ? assets.walk.right : [assets.bunnyIdle.right],
  }
  const idle = assets.bunnyIdle

  const sprite = document.createElement('img')
  sprite.className = 'hall-bunny'
  sprite.alt = ''
  sprite.setAttribute('aria-hidden', 'true')
  sprite.src = idle.right.src
  host.appendChild(sprite)

  const projected = new THREE.Vector3()

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

  function setFrame(image: HTMLImageElement): void {
    currentImage = image
    if (currentSrc === image.src) return
    currentSrc = image.src
    sprite.src = image.src
  }

  return {
    attach(attachment, out) {
      const place = moving ? attachment.walk : attachment.idle
      const { naturalWidth, naturalHeight } = currentImage
      const asDrawn = facing === attachment.facing
      const drawnX = asDrawn ? place.x : naturalWidth - place.x
      out.x = screenX + (drawnX - naturalWidth / 2) * scale
      out.y = screenY + (place.y - naturalHeight / 2) * scale
      out.width = attachment.width * scale
      out.rotation = place.rotation
      out.flip = asDrawn ? 1 : -1
      return out
    },

    update(dt, x, velocity, camera, viewport) {
      const speed = Math.abs(velocity)
      moving = speed > 0.12

      distance += speed * dt

      if (moving) {
        facing = velocity > 0 ? 'right' : 'left'
        const frames = cycles[facing]
        const step = Math.floor(distance * CONFIG.character.cyclesPerUnit * frames.length)
        setFrame(frames[((step % frames.length) + frames.length) % frames.length])
      } else {
        setFrame(idle[facing])
      }

      const float = moving
        ? Math.sin(distance * CONFIG.character.cyclesPerUnit * Math.PI * 2) * CONFIG.character.bob
        : 0

      projected.set(x, CONFIG.character.centerY + float, 0)
      projected.project(camera)

      screenX = (projected.x * 0.5 + 0.5) * viewport.width
      screenY = (-projected.y * 0.5 + 0.5) * viewport.height

      const frustumHeight = camera.top - camera.bottom
      const heightPx = (CONFIG.character.height / frustumHeight) * viewport.height
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
