'use client'

import { useEffect } from 'react'

export default function ServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) return
    const idle = window.requestIdleCallback ?? ((fn: () => void) => window.setTimeout(fn, 3000))
    idle(() => {
      navigator.serviceWorker.register('/sw.js').catch(() => {})
    })
  }, [])

  return null
}
