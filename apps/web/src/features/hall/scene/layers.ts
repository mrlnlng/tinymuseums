import { CLASHES_WITH_TOP, isTopPiece } from '@tiny/core/slots'

/** The two clothing layers: a dress or set, and a top such as a cardigan worn over it. */
export interface Layers {
  costume: string | null
  top: string | null
}

export type Layer = keyof Layers

/** Which layer a clothing piece goes on. */
export function layerOf(id: string): Layer {
  return isTopPiece(id) ? 'top' : 'costume'
}

/**
 * Puts a piece on its layer, leaving the other layer as it is. Outerwear that clashes with a top
 * (the gold cape) takes the top off, and a top takes it off, instead of the two stacking.
 */
export function putOn(layers: Layers, id: string): Layers {
  if (layerOf(id) === 'top') {
    return { costume: CLASHES_WITH_TOP.includes(layers.costume ?? '') ? null : layers.costume, top: id }
  }
  return { costume: id, top: CLASHES_WITH_TOP.includes(id) ? null : layers.top }
}

/** Takes a piece off if it is worn; otherwise nothing changes. */
export function takeOff(layers: Layers, id: string): Layers {
  return {
    costume: layers.costume === id ? null : layers.costume,
    top: layers.top === id ? null : layers.top,
  }
}

export function isWorn(layers: Layers, id: string | null): boolean {
  return id !== null && (layers.costume === id || layers.top === id)
}

/** A tap on a piece: off if it is worn, on otherwise. */
export function toggle(layers: Layers, id: string): Layers {
  return isWorn(layers, id) ? takeOff(layers, id) : putOn(layers, id)
}

/**
 * A wish for each layer, which may clash (the cape under a cardigan): the layer chosen last wins
 * and the other waits, so browsing past the cape does not lose the cardigan for good.
 */
export function settleClash(layers: Layers, last: Layer): Layers {
  if (layers.top === null || !CLASHES_WITH_TOP.includes(layers.costume ?? '')) return layers
  return last === 'top' ? { costume: null, top: layers.top } : { costume: layers.costume, top: null }
}
