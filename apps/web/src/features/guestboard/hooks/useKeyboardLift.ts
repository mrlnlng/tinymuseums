'use client'

import { useEffect, type RefObject } from 'react'

// Below this a shrunken visual viewport is a browser bar, not a keyboard.
const KEYBOARD_MIN_PX = 120

// iOS leaves the layout viewport — and so 100dvh — at full height when the
// keyboard opens; only the visual viewport shrinks. Safari then scrolls the
// focused field into view on its own, which drags the whole board around, so
// the stage is lifted by hand instead and there is nothing left to scroll.
export function useKeyboardLift(stage: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const viewport = window.visualViewport
    const node = stage.current
    if (!viewport || !node) return

    const sync = (): void => {
      const lifted = Number.parseFloat(node.style.getPropertyValue('--lift')) || 0

      if (window.innerHeight - viewport.height < KEYBOARD_MIN_PX) {
        node.style.setProperty('--lift', '0px')
        return
      }

      const note = node.querySelector('.guestboard-held')
      const foot = node.querySelector('.guestboard-button--foot')
      if (!note || !foot) return

      const top = note.getBoundingClientRect().top + lifted
      const bottom = foot.getBoundingClientRect().bottom + lifted
      const middle = viewport.offsetTop + viewport.height / 2
      node.style.setProperty('--lift', `${Math.max(0, Math.round((top + bottom) / 2 - middle))}px`)
    }

    sync()
    viewport.addEventListener('resize', sync)
    viewport.addEventListener('scroll', sync)
    return () => {
      viewport.removeEventListener('resize', sync)
      viewport.removeEventListener('scroll', sync)
    }
  }, [stage])
}
