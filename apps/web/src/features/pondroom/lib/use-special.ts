'use client'

import { useEffect, useState } from 'react'
import { fetchPondSpecial, type PondSpecialToday } from './pond-api'

export function useTodaysSpecial(): PondSpecialToday | null {
  const [special, setSpecial] = useState<PondSpecialToday | null>(null)
  useEffect(() => {
    let live = true
    void fetchPondSpecial().then((result) => {
      if (live && result.ok) setSpecial(result.value)
    })
    return () => {
      live = false
    }
  }, [])
  return special
}
