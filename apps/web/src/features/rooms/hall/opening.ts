/** The art in the first view: not yet known, nothing there to wait for, still coming, or shown. */
export type ViewArt = 'pending' | 'none' | 'loading' | 'ready'

/** A cold arrival through a door keeps its cover this long, so the walk through it reads. */
export const COLD_DOOR_HOLD_MS = 2800
/** However the art is doing, the hall opens after this long. */
export const OPENING_MAX_WAIT_MS = 5000

export interface Opening {
  waitedMs: number
  viaDoor: boolean
  warm: boolean
  fontsReady: boolean
  art: ViewArt
}

export function hallIsReady({ waitedMs, viaDoor, warm, fontsReady, art }: Opening): boolean {
  if (viaDoor && !warm && waitedMs < COLD_DOOR_HOLD_MS) return false
  if (waitedMs > OPENING_MAX_WAIT_MS) return true
  return fontsReady && (art === 'none' || art === 'ready')
}
