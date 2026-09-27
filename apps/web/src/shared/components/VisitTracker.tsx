'use client'

import { useEffect } from 'react'
import { startVisit } from '@/shared/lib/visit'

function isPublicPage(path: string): boolean {
  return path === '/' || path === '/museum' || path.startsWith('/a/')
}

export default function VisitTracker() {
  useEffect(() => {
    const landing = window.location.pathname
    if (!isPublicPage(landing)) return
    return startVisit(landing)
  }, [])

  return null
}
