import type * as THREE from 'three'
import type { Scenery } from './assets'
import { createCarried } from './carried'
import type { Character } from './character'
import { CONFIG } from './config'
import type { Viewport } from './overlay'
import type { Pedestal } from './pedestal'
import type { HallScene } from './scene'

export interface Helm {
  readonly worn: boolean
  conceal(hidden: boolean): void
  tap(pedestal: Pedestal): boolean
  update(dt: number, character: Character, camera: THREE.OrthographicCamera, viewport: Viewport): void
  dispose(): void
}

/** The room's say over each pedestal's helmet; without a room, every helmet is ours to take. */
export interface HelmShare {
  taken(stand: number): boolean
  claim(stand: number, on: boolean): void
}

export function createHelm(
  scenery: Scenery,
  host: HTMLElement,
  hall: HallScene,
  share: HelmShare = { taken: () => false, claim: () => {} },
): Helm {
  const { worn, stand } = CONFIG.helm
  const pedestalWidth = CONFIG.pedestal.height * (stand.drawing[0] / stand.drawing[1])
  let standIndex = -1
  const helm = createCarried(host, scenery.helm, worn, (out) => {
    hall.helmStandPoint(standIndex, out)
    return (stand.width / stand.drawing[0]) * pedestalWidth
  })

  return {
    get worn() {
      return helm.state === 'held'
    },

    conceal: helm.conceal,

    tap(pedestal) {
      if (!pedestal.holdsHelm) return false
      if (helm.state === 'away') {
        // Someone else is wearing this one.
        if (share.taken(pedestal.index)) return true
        standIndex = pedestal.index
        share.claim(standIndex, true)
        hall.setBareHelmStand(standIndex)
        helm.take()
      } else if (pedestal.index === standIndex) {
        helm.giveBack()
      }
      return true
    },

    update(dt, character, camera, viewport) {
      // Another visitor claimed it first: it goes back to its stand.
      if (helm.state === 'held' && share.taken(standIndex)) helm.giveBack()
      if (helm.update(dt, character, camera, viewport)) {
        hall.setBareHelmStand(null)
        share.claim(standIndex, false)
      }
    },

    dispose() {
      helm.dispose()
    },
  }
}
