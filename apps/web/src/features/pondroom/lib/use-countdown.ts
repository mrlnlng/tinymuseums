'use client'

import { useEffect, useState } from 'react'
import { formatCountdown } from './pond-format'

/** A ticking clock for reset countdowns; paused automatically when the tab is hidden by the browser. */
export function useNow(intervalMs = 1000): number {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), intervalMs)
    return () => window.clearInterval(timer)
  }, [intervalMs])
  return now
}

export function useCountdown(target: Date, options: { seconds?: boolean } = {}): string {
  const now = useNow(options.seconds ? 1000 : 30_000)
  return formatCountdown(target.getTime() - now, options)
}
