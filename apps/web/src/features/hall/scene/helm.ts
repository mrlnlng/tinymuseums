import { createCarried } from './carried'
import type { Character } from './character'
import { CONFIG } from './config'
import type { Projector } from './projector'

export interface HelmScenery {
  helm: HTMLImageElement
}

export interface HelmStand {
  setBareHelmStand(index: number | null): void
  helmStandPoint(
    index: number,
    out: { x: number; y: number; z: number },
  ): { x: number; y: number; z: number } | null
}

export interface HelmPedestal {
  index: number
  holdsHelm: boolean
}

export interface Helm {
  readonly worn: boolean
  conceal(hidden: boolean): void
  accepts(pedestal: HelmPedestal): boolean
  take(pedestal: HelmPedestal): void
  update(dt: number, character: Character, projector: Projector): void
  dispose(): void
}

export function createHelm(scenery: HelmScenery, host: HTMLElement, hall: HelmStand): Helm {
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

    accepts(pedestal) {
      return pedestal.holdsHelm
    },

    take(pedestal) {
      if (helm.state === 'away') {
        standIndex = pedestal.index
        hall.setBareHelmStand(standIndex)
        helm.take()
      } else if (pedestal.index === standIndex) {
        helm.giveBack()
      }
    },

    update(dt, character, projector) {
      if (helm.update(dt, character, projector)) hall.setBareHelmStand(null)
    },

    dispose() {
      helm.dispose()
    },
  }
}
