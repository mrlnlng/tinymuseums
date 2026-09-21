import type * as THREE from 'three'
import type { Scenery } from './assets'
import type { Cafe } from './cafe'
import { createCarried } from './carried'
import type { Character } from './character'
import { CONFIG } from './config'
import type { Viewport } from './overlay'

export interface Matcha {
  tap(raycaster: THREE.Raycaster): boolean
  update(dt: number, character: Character, camera: THREE.OrthographicCamera, viewport: Viewport): void
  dispose(): void
}

export function createMatcha(scenery: Scenery, host: HTMLElement, cafe: () => Cafe | null): Matcha {
  const cup = createCarried(host, scenery.matcha, CONFIG.matcha.held, (out) => {
    cafe()?.matchaPoint(out)
    return CONFIG.matcha.menuWidth
  })

  return {
    tap(raycaster) {
      if (!cafe()?.hitTestMatcha(raycaster)) return false
      if (cup.state === 'away') cup.take()
      else cup.giveBack()
      return true
    },

    update: cup.update,

    dispose: cup.dispose,
  }
}
