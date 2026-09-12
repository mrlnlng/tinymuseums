import type * as THREE from 'three'
import type { Assets } from './assets'
import type { Cafe } from './cafe'
import { createCarried } from './carried'
import type { Character } from './character'
import { CONFIG } from './config'
import type { Viewport } from './overlay'

/*  The matcha easter egg: tap the matcha column of the cafe menu and a cup
    flies from the menu into the bunny's hand; tap it again and it flies back. */

export interface Matcha {
  /** True if the tap landed on the menu's matcha column. */
  tap(raycaster: THREE.Raycaster): boolean
  update(dt: number, character: Character, camera: THREE.OrthographicCamera, viewport: Viewport): void
  dispose(): void
}

export function createMatcha(assets: Assets, host: HTMLElement, cafe: () => Cafe | null): Matcha {
  const cup = createCarried(host, assets.matcha, CONFIG.matcha.held, (out) => {
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
