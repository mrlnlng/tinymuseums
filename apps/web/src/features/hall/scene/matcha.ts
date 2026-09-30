import { createCarried, type Attachment, type Carried } from './carried'
import type { Character } from './character'
import { CONFIG } from './config'
import type { Projector } from './projector'

export type CarriedFactory = (
  host: HTMLElement,
  image: HTMLImageElement,
  attachment: Attachment,
  home: (out: { x: number; y: number; z?: number }) => number,
) => Carried

export interface MatchaScenery {
  matcha: HTMLImageElement
}

export interface MatchaCafe {
  matchaPoint(
    out: { x: number; y: number; z?: number },
  ): { x: number; y: number; z?: number }
}

export interface Matcha {
  toggle(): void
  update(dt: number, character: Character, projector: Projector): void
  dispose(): void
}

export function createMatcha(
  scenery: MatchaScenery,
  host: HTMLElement,
  cafe: () => MatchaCafe | null,
  make: CarriedFactory = createCarried,
): Matcha {
  const cup = make(host, scenery.matcha, CONFIG.matcha.held, (out) => {
    cafe()?.matchaPoint(out)
    return CONFIG.matcha.cup.width
  })

  return {
    toggle() {
      if (cup.state === 'away') cup.take()
      else cup.giveBack()
    },

    update: cup.update,

    dispose: cup.dispose,
  }
}
