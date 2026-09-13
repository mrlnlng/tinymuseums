import type * as THREE from 'three'
import type { Assets } from './assets'
import { createCarried } from './carried'
import type { Character } from './character'
import { CONFIG } from './config'
import type { Viewport } from './overlay'
import type { Pedestal } from './pedestal'
import type { HallScene } from './scene'

export interface Helm {
  tap(pedestal: Pedestal): boolean
  update(dt: number, character: Character, camera: THREE.OrthographicCamera, viewport: Viewport): void
  dispose(): void
}

export function createHelm(assets: Assets, host: HTMLElement, hall: HallScene): Helm {
  const { worn, stand } = CONFIG.helm
  const pedestalWidth = CONFIG.pedestal.height * (stand.drawing[0] / stand.drawing[1])
  let standIndex = -1
  const helm = createCarried(host, assets.helm, worn, (out) => {
    hall.helmStandPoint(standIndex, out)
    return (stand.width / stand.drawing[0]) * pedestalWidth
  })

  return {
    tap(pedestal) {
      if (!pedestal.holdsHelm) return false
      if (helm.state === 'away') {
        standIndex = pedestal.index
        hall.setBareHelmStand(standIndex)
        helm.take()
      } else if (pedestal.index === standIndex) {
        helm.giveBack()
      }
      return true
    },

    update(dt, character, camera, viewport) {
      if (helm.update(dt, character, camera, viewport)) hall.setBareHelmStand(null)
    },

    dispose() {
      helm.dispose()
    },
  }
}
