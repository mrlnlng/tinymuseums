import * as THREE from 'three'
import type { Assets } from './assets'
import { CONFIG } from './config'
import type { Viewport } from './overlay'

/**
 * The visitor: the Tiny Museum bunny, with its drawn walk cycle.
 *
 * Drawn in the DOM rather than in the WebGL scene, and that is deliberate.
 * Plaque text is real DOM sitting above the canvas, so anything rendered in
 * the scene is painted *underneath* it — the bunny walked behind wall labels.
 * Putting the character in its own layer above the overlay puts it in front of
 * everything, which is where the visitor belongs.
 *
 * The cost is that the sprite has to be positioned by projecting its world
 * position each frame, which is the same trick the plaques already use.
 *
 * The frames do the animation, so there are no transform tricks — no hop, no
 * squash, no lean; they would fight the art. The cycle advances on distance
 * travelled, not time, so the bunny takes the same number of steps per metre
 * however fast it is moving. The sprites carry their own contact shadow.
 *
 * Facing is a change of cycle, not a mirror. The pack draws the bunny walking
 * left and walking right, and the two are not reflections of each other — the
 * bow sits on one side. Flipping with scaleX moved it across the chest.
 */

export interface Character {
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

  function setFrame(image: HTMLImageElement): void {
    if (currentSrc === image.src) return
    currentSrc = image.src
    sprite.src = image.src
  }

  return {
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

      // World height converted to pixels: the ortho frustum height maps to the
      // viewport height, so the bunny scales with the hall. Read from the
      // camera rather than the config — the frustum grows on tall screens.
      const frustumHeight = camera.top - camera.bottom
      const heightPx = (CONFIG.character.height / frustumHeight) * viewport.height
      sprite.style.height = `${heightPx.toFixed(1)}px`

      sprite.style.transform =
        `translate3d(${screenX.toFixed(1)}px, ${screenY.toFixed(1)}px, 0)` +
        ' translate(-50%, -50%)'
    },

    dispose() {
      sprite.remove()
    },
  }
}
