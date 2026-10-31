'use client'

import { useEffect } from 'react'
import { startVisit } from '@/shared/lib/visit'
import { isPublicPage } from '@/shared/lib/public-page'

export default function VisitTracker() {
  useEffect(() => {
    const landing = window.location.pathname
    if (!isPublicPage(landing)) return
    return startVisit(landing)
  }, [])

  return null
}
