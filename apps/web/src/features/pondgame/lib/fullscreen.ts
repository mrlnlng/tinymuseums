'use client'

import { useEffect, useState } from 'react'

/**
 * Getting the browser out of the way while fishing, without installing anything.
 *
 * - Where a page may go full screen (Android, iPad), the first tap in the fishing view does,
 *   and turns the screen sideways. Leaving the view gives the screen back.
 * - An iPhone never lets a page go full screen, but Safari folds its top bar away when the
 *   page is scrolled by a finger. The fishing view never scrolls, so while it is open the page
 *   is made a touch taller than the screen and a swipe strip (outside the game, so a swipe
 *   never casts) lets the visitor fold the bar. Returns whether that strip should show.
 */
export function useFishingFullscreen(): { swipe: boolean } {
  const [swipe, setSwipe] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    const touch = window.matchMedia('(pointer: coarse)').matches
    if (!touch) return
    const canFullscreen = typeof root.requestFullscreen === 'function' && document.fullscreenEnabled

    if (canFullscreen) {
      let asked = false
      // A pointerup is a user activation, which full screen needs; asking on the first one only
      // means a visitor who leaves full screen is not pulled back into it.
      const ask = () => {
        if (asked || document.fullscreenElement) return
        asked = true
        root.requestFullscreen({ navigationUI: 'hide' }).then(() => {
          const orientation = screen.orientation as ScreenOrientation & { lock?: (to: string) => Promise<void> }
          orientation.lock?.('landscape').catch(() => {})
        }).catch(() => {})
      }
      window.addEventListener('pointerup', ask, true)
      return () => {
        window.removeEventListener('pointerup', ask, true)
        const orientation = screen.orientation as ScreenOrientation & { unlock?: () => void }
        try { orientation.unlock?.() } catch { /* not locked */ }
        if (document.fullscreenElement) void document.exitFullscreen().catch(() => {})
      }
    }

    root.classList.add('pond-fold-bar')
    const folded = () => { if (window.scrollY > 0) setSwipe(false) }
    setSwipe(window.scrollY <= 0)
    window.addEventListener('scroll', folded, { passive: true })
    return () => {
      window.removeEventListener('scroll', folded)
      root.classList.remove('pond-fold-bar')
      window.scrollTo(0, 0)
    }
  }, [])

  return { swipe }
}
