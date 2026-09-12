import * as THREE from 'three'
import type { Character, Pose } from './character'
import { CONFIG } from './config'
import type { Viewport } from './overlay'

/*  Something the bunny can be handed from the scenery: the helm off its stand,
    the matcha off the cafe menu. It is DOM, like the bunny, so it is never
    painted under the plaque overlay. `take` flies it from where it was drawn in
    the scene onto the bunny, where it follows every frame; `giveBack` flies it
    home again. Both ends are re-read every frame, so it lands on a bunny that
    walks off mid-flight. */

export type CarriedState = 'away' | 'to-bunny' | 'held' | 'back'

export interface Carried {
  readonly state: CarriedState
  take(): void
  giveBack(): void
  /** Advances it. True the frame it lands back home. */
  update(dt: number, character: Character, camera: THREE.OrthographicCamera, viewport: Viewport): boolean
  dispose(): void
}

/** Where the item sits on the bunny: see `Character.attach`. */
export interface Attachment {
  /** The frames the placements were measured on; the other direction mirrors them. */
  facing: 'left' | 'right'
  /** The drawing's width, in the bunny's source pixels. */
  width: number
  walk: { x: number; y: number; rotation: number }
  idle: { x: number; y: number; rotation: number }
}

/*  `home` writes where the item is drawn in the scene, in world units, and
    returns its width there. */
export function createCarried(
  host: HTMLElement,
  image: HTMLImageElement,
  attachment: Attachment,
  home: (out: THREE.Vector3) => number,
): Carried {
  const { flightSeconds, arcLift, spin } = CONFIG.carry
  const aspect = image.naturalHeight / image.naturalWidth

  const sprite = document.createElement('img')
  sprite.className = 'hall-carried'
  sprite.alt = ''
  sprite.setAttribute('aria-hidden', 'true')
  sprite.src = image.src
  sprite.hidden = true
  host.appendChild(sprite)

  let state: CarriedState = 'away'
  let elapsed = 0
  const world = new THREE.Vector3()
  const onBunny: Pose = { x: 0, y: 0, width: 0, rotation: 0, flip: 1 }
  const atHome: Pose = { x: 0, y: 0, width: 0, rotation: 0, flip: 1 }
  const flying: Pose = { x: 0, y: 0, width: 0, rotation: 0, flip: 1 }
  let currentTransform = ''
  let currentWidth = ''

  function place(pose: Pose): void {
    const width = `${pose.width.toFixed(1)}px`
    if (width !== currentWidth) {
      currentWidth = width
      sprite.style.width = width
    }
    const transform =
      `translate3d(${pose.x.toFixed(1)}px, ${pose.y.toFixed(1)}px, 0)` +
      ` scale(${pose.flip}, 1) rotate(${pose.rotation.toFixed(1)}deg)` +
      ` translate(${(-pose.width / 2).toFixed(1)}px, ${((-pose.width * aspect) / 2).toFixed(1)}px)`
    if (transform !== currentTransform) {
      currentTransform = transform
      sprite.style.transform = transform
    }
  }

  /*  Eased along a quadratic arc with a spin. The mirror changes over at the
      top, mid-spin, where it is hidden; easing it through zero left the item a
      sliver at the moment it was most in view. */
  function between(from: Pose, to: Pose, progress: number, viewport: Viewport): Pose {
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

    take() {
      if (state !== 'away') return
      state = 'to-bunny'
      elapsed = 0
      sprite.hidden = false
    },

    giveBack() {
      if (state !== 'held') return
      state = 'back'
      elapsed = 0
    },

    update(dt, character, camera, viewport) {
      if (state === 'away') return false

      character.attach(attachment, onBunny)
      if (state === 'held') {
        place(onBunny)
        return false
      }

      const width = home(world)
      world.project(camera)
      atHome.x = (world.x * 0.5 + 0.5) * viewport.width
      atHome.y = (-world.y * 0.5 + 0.5) * viewport.height
      atHome.width = (width * viewport.height) / (camera.top - camera.bottom)
      elapsed += dt
      const progress = Math.min(1, elapsed / flightSeconds)

      if (state === 'to-bunny') {
        place(between(atHome, onBunny, progress, viewport))
        if (progress >= 1) state = 'held'
        return false
      }

      place(between(onBunny, atHome, progress, viewport))
      if (progress < 1) return false
      state = 'away'
      sprite.hidden = true
      return true
    },

    dispose() {
      sprite.remove()
    },
  }
}
