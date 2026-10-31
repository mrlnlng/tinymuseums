'use client'

import { useEffect } from 'react'

/** Subscribe only while an overlay is active; callers retain control of focus and propagation. */
export function useEscapeKey(onEscape: (event: KeyboardEvent) => void, enabled = true): void {
  useEffect(() => {
    if (!enabled) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onEscape(event)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onEscape, enabled])
}
