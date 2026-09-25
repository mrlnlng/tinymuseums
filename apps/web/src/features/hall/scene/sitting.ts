import type * as THREE from 'three'
import type { Scenery } from './assets'
import type { Character, Perch } from './character'
import { CONFIG } from './config'
import type { GuestBoard } from './guestboard'
import type { Helm } from './helm'
import type { Traversal } from './traversal'

type SittingState = 'free' | 'approaching' | 'rising' | 'seated' | 'leaving'

export interface Sitting {
  tap(raycaster: THREE.Raycaster): boolean
  update(dt: number, cameraX: number, halfViewWidth: number): void
  dispose(): void
}

export function createSitting(
  scenery: Scenery,
  board: GuestBoard,
  traversal: Traversal,
  character: Character,
  helm: () => Helm | null,
  sound: { prepare(): void; hop(): void },
): Sitting {
  const { hopSeconds, hopLift, idleSeconds, nearDistance } = CONFIG.sit
  const stand = CONFIG.character
  const { seat } = board
  const { naturalWidth, naturalHeight } = scenery.bunnySit.plain
  const seatHalfWidth = (seat.height * naturalWidth) / naturalHeight / 2

  let state: SittingState = 'free'
  let progress = 0
  const perch: Perch = { image: scenery.bunnySit.plain, x: seat.x, y: 0, height: 0, seated: false }

  function approach(follow: boolean): void {
    state = 'approaching'
    sound.prepare()
    traversal.hold(seat.x, follow)
  }

  function hop(t: number): void {
    const eased = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2
    const worn = helm()?.worn ?? false
    perch.y = stand.centerY + (seat.y - stand.centerY) * eased + hopLift * 4 * t * (1 - t)
    perch.height = stand.height + (seat.height - stand.height) * eased
    perch.seated = t >= 0.5
    perch.image = !perch.seated
      ? character.idleImage
      : worn
        ? scenery.bunnySit.helm
        : scenery.bunnySit.plain
    character.perch(perch)
    helm()?.conceal(perch.seated && worn)
  }

  function standUp(): void {
    state = 'free'
    character.perch(null)
    helm()?.conceal(false)
    traversal.hold(null)
  }

  return {
    tap(raycaster) {
      if (!board.hitTestBeanbag(raycaster, state !== 'free' && state !== 'approaching')) return false
      if (state === 'free') approach(false)
      else if (state === 'approaching') standUp()
      else if (state === 'seated') {
        state = 'leaving'
        progress = 0
      }
      return true
    },

    update(dt, cameraX, halfViewWidth) {
      if (state === 'free') {
        const near = Math.abs(traversal.x - board.x) <= nearDistance
        if (near && traversal.idleSeconds >= idleSeconds) approach(true)
        return
      }

      if (state === 'approaching') {
        if (!traversal.isHeld) return
        state = 'rising'
        progress = 0
        sound.hop()
      }

      if (state === 'seated') {
        hop(1)
        if (Math.abs(cameraX - seat.x) > halfViewWidth + seatHalfWidth) {
          state = 'leaving'
          progress = 0
        }
        return
      }

      progress = Math.min(1, progress + dt / hopSeconds)
      hop(state === 'rising' ? progress : 1 - progress)
      if (progress < 1) return
      if (state === 'rising') state = 'seated'
      else standUp()
    },

    dispose() {
      if (state !== 'free') standUp()
    },
  }
}
