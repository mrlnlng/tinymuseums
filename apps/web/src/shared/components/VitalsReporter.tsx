'use client'

import { useEffect } from 'react'
import { useReportWebVitals } from 'next/web-vitals'
import { FIRST_PAINTING_MARK, MUSEUM_START_MARK } from '@/shared/lib/vitals-marks'

const SAMPLE_RATE = 0.25
const REPORTED = new Set(['TTFB', 'FCP', 'LCP', 'CLS', 'INP'])


interface Metric {
  name: string
  value: number
  rating?: string
}

const isSampled = typeof window !== 'undefined' && Math.random() < SAMPLE_RATE
const queue = new Map<string, Metric>()
let paintingReported = false

function firstPainting(): Metric | null {
  if (paintingReported) return null
  const start = performance.getEntriesByName(MUSEUM_START_MARK)[0]
  const shown = performance.getEntriesByName(FIRST_PAINTING_MARK)[0]
  if (!start || !shown) return null
  paintingReported = true
  return { name: 'first_painting', value: Math.round(shown.startTime - start.startTime) }
}

function flush(): void {
  const painting = firstPainting()
  if (painting) queue.set(painting.name, painting)
  if (queue.size === 0) return

  const connection = (navigator as { connection?: { effectiveType?: string } }).connection
  const body = JSON.stringify({
    page: window.location.pathname,
    device: window.matchMedia('(pointer: coarse)').matches ? 'mobile' : 'desktop',
    connection: connection?.effectiveType,
    metrics: [...queue.values()],
  })
  navigator.sendBeacon?.('/api/vitals', new Blob([body], { type: 'application/json' }))
  queue.clear()
}

export default function VitalsReporter() {
  useReportWebVitals((metric) => {
    if (!isSampled || !REPORTED.has(metric.name)) return
    queue.set(metric.id, { name: metric.name, value: metric.value, rating: metric.rating })
  })

  // Registered after useReportWebVitals so the final CLS and INP values are queued before this runs.
  useEffect(() => {
    if (!isSampled) return
    const onHidden = () => {
      if (document.visibilityState === 'hidden') flush()
    }
    document.addEventListener('visibilitychange', onHidden)
    window.addEventListener('pagehide', flush)
    return () => {
      document.removeEventListener('visibilitychange', onHidden)
      window.removeEventListener('pagehide', flush)
    }
  }, [])

  return null
}
