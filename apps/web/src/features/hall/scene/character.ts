import * as THREE from 'three'
import type { Assets } from './assets'
import { CONFIG } from './config'
import type { Viewport } from './overlay'

/* The visitor: the Tiny Museum bunny with its drawn walk cycle, in the DOM rather than the WebGL scene — plaque text is real DOM above the canvas, so anything in the scene is painted underneath it. Positioned each frame by projecting its world position; the cycle advances on distance, not time. */

/*  Where the helm sits on the head this frame: its centre in CSS pixels, CSS
    pixels per source pixel of the current frame, and the head's tilt. */
export interface HeadPose {
  x: number
  y: number
  scale: number
  rotation: number
  facing: 'left' | 'right'
}

export interface Character {
  /** Rewritten in place every frame, after `update`. */
  readonly head: HeadPose
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
  /** Which way the bunny last moved. It keeps facing that way once stopped. */
  let facing: 'left' | 'right' = 'right'
  let currentSrc = idle.right.src
  let currentImage = idle.right
  const head: HeadPose = { x: 0, y: 0, scale: 1, rotation: 0, facing: 'right' }
  /*  The last values written to the sprite. Its height changes only with the
      window and its transform only while something is moving, but both were
      being assigned on every frame; an identical string still costs a CSSOM
      parse. */
  let currentHeight = ''
  let currentTransform = ''

  function setFrame(image: HTMLImageElement): void {
    currentImage = image
    if (currentSrc === image.src) return
    currentSrc = image.src
    sprite.src = image.src
  }

  return {
    head,

    update(dt, x, velocity, camera, viewport) {
      const speed = Math.abs(velocity)
      const moving = speed > 0.12

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

      const screenX = (projected.x * 0.5 + 0.5) * viewport.width
      const screenY = (-projected.y * 0.5 + 0.5) * viewport.height

      // World height converted to pixels: the ortho frustum maps to the
      // viewport height, so the bunny scales with the hall.
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

      // The sprite is centred on (screenX, screenY); placements mirror for the right.
      const place = moving ? CONFIG.helm.worn.walk : CONFIG.helm.worn.idle
      const { naturalWidth, naturalHeight } = currentImage
      const scale = heightPx / naturalHeight
      const drawnX = facing === 'left' ? place.x : naturalWidth - place.x
      head.x = screenX + (drawnX - naturalWidth / 2) * scale
      head.y = screenY + (place.y - naturalHeight / 2) * scale
      head.scale = scale
      head.rotation = place.rotation
      head.facing = facing
    },

    dispose() {
      sprite.remove()
    },
  }
}
