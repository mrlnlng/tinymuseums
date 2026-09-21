'use client'

import { useEffect, useState } from 'react'

// Nothing in the sound stack may fetch before the visitor interacts: browsers
// block playback until then anyway, and the hall's intro walk would otherwise
// pull every clip while the scene is still downloading.
let hasGestured = false
const waiting = new Set<() => void>()

function arm(): void {
  if (hasGestured) return
  hasGestured = true
  for (const notify of waiting) notify()
  waiting.clear()
}

export function gestured(): boolean {
  return hasGestured
}

const OPTIONS = { once: true, passive: true, capture: true } as const

export function useFirstGesture(): boolean {
  const [ready, setReady] = useState(hasGestured)

  useEffect(() => {
    if (hasGestured) {
      setReady(true)
      return
    }
    const notify = () => setReady(true)
    waiting.add(notify)
    document.addEventListener('pointerdown', arm, OPTIONS)
    document.addEventListener('keydown', arm, OPTIONS)
    return () => {
      waiting.delete(notify)
      document.removeEventListener('pointerdown', arm, OPTIONS)
      document.removeEventListener('keydown', arm, OPTIONS)
    }
  }, [])

  return ready
}
