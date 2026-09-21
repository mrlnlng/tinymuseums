'use client'

// Nothing in the sound stack may fetch before the visitor interacts: browsers
// block playback until then anyway, and the hall's intro walk would otherwise
// pull every clip while the scene is still downloading.
//
// The listeners arm on import rather than from a hook, so this cannot go quiet
// just because no component happens to subscribe.
let hasGestured = false

function arm(): void {
  hasGestured = true
}

const OPTIONS = { once: true, passive: true, capture: true } as const

if (typeof document !== 'undefined') {
  document.addEventListener('pointerdown', arm, OPTIONS)
  document.addEventListener('keydown', arm, OPTIONS)
}

export function gestured(): boolean {
  return hasGestured
}
