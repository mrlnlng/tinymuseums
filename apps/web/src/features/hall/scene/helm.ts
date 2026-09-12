import * as THREE from 'three'
import type { Assets } from './assets'
import type { HeadPose } from './character'
import { CONFIG } from './config'
import type { Viewport } from './overlay'
import type { Pedestal } from './pedestal'
import type { HallScene } from './scene'

/*  The helmet easter egg: tap the helmet pedestal and its helm flies onto the
    bunny's head and stays there as the visitor walks; tap the bare stand and it
    flies back.

    The helm is DOM, like the bunny, so it is never painted under the plaque
    overlay. On its stand it is part of the pedestal's drawing, so the pedestal
    swaps to a bare-stand drawing while the helm is away.

    The flight's far end is re-read every frame, so a helm thrown at a bunny
    that walks off still lands on its head. */

type State = 'on-stand' | 'to-head' | 'worn' | 'to-stand'

/** The helm drawing's centre on screen, its width, and which way it faces. */
interface Pose {
  x: number
  y: number
  width: number
  /** CSS degrees, applied before the mirror. */
  rotation: number
  /** 1 as drawn (facing left), -1 mirrored. */
  flip: number
}

export interface Helm {
  /** Offers a tapped pedestal to the easter egg. True if the tap was the helm's. */
  tap(pedestal: Pedestal): boolean
  update(dt: number, head: HeadPose, camera: THREE.OrthographicCamera, viewport: Viewport): void
  dispose(): void
}

export function createHelm(assets: Assets, host: HTMLElement, hall: HallScene): Helm {
  const { worn, stand, flightSeconds, arcLift, spin } = CONFIG.helm
  const aspect = assets.helm.naturalHeight / assets.helm.naturalWidth
  const pedestalWidth = CONFIG.pedestal.height * (stand.drawing[0] / stand.drawing[1])

  const sprite = document.createElement('img')
  sprite.className = 'hall-helm'
  sprite.alt = ''
  sprite.setAttribute('aria-hidden', 'true')
  sprite.src = assets.helm.src
  sprite.hidden = true
  host.appendChild(sprite)

  let state: State = 'on-stand'
  let elapsed = 0
  /** The stand the helm came off, and goes back to. */
  let standIndex = -1

  const world = new THREE.Vector3()
  const headPose: Pose = { x: 0, y: 0, width: 0, rotation: 0, flip: 1 }
  const standPose: Pose = { x: 0, y: 0, width: 0, rotation: 0, flip: 1 }
  const flying: Pose = { x: 0, y: 0, width: 0, rotation: 0, flip: 1 }
  let currentTransform = ''
  let currentWidth = ''

  function readStand(camera: THREE.OrthographicCamera, viewport: Viewport): void {
    hall.helmStandPoint(standIndex, world)?.project(camera)
    standPose.x = (world.x * 0.5 + 0.5) * viewport.width
    standPose.y = (-world.y * 0.5 + 0.5) * viewport.height
    const pixelsPerUnit = viewport.height / (camera.top - camera.bottom)
    standPose.width = (stand.width / stand.drawing[0]) * pedestalWidth * pixelsPerUnit
  }

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
      top, mid-spin, where it is hidden; easing it through zero left the helm a
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

  function fly(next: State): void {
    state = next
    elapsed = 0
    sprite.hidden = false
  }

  return {
    tap(pedestal) {
      if (!pedestal.holdsHelm) return false
      if (state === 'on-stand') {
        standIndex = pedestal.index
        hall.setBareHelmStand(standIndex)
        fly('to-head')
      } else if (state === 'worn' && pedestal.index === standIndex) {
        fly('to-stand')
      }
      // Otherwise mid-flight, or another helmet pedestal while one is worn.
      return true
    },

    update(dt, head, camera, viewport) {
      if (state === 'on-stand') return

      headPose.x = head.x
      headPose.y = head.y
      headPose.width = worn.width * head.scale
      headPose.rotation = head.rotation
      headPose.flip = head.facing === 'left' ? 1 : -1

      if (state === 'worn') {
        place(headPose)
        return
      }

      readStand(camera, viewport)
      elapsed += dt
      const progress = Math.min(1, elapsed / flightSeconds)

      if (state === 'to-head') {
        place(between(standPose, headPose, progress, viewport))
        if (progress >= 1) state = 'worn'
        return
      }

      place(between(headPose, standPose, progress, viewport))
      if (progress >= 1) {
        hall.setBareHelmStand(null)
        state = 'on-stand'
        sprite.hidden = true
      }
    },

    dispose() {
      sprite.remove()
    },
  }
}
