'use client'

import { useSyncExternalStore } from 'react'
import { getPondStateSnapshot, subscribePondState } from './pond-state'

export function usePondState() {
  return useSyncExternalStore(subscribePondState, getPondStateSnapshot, getPondStateSnapshot)
}
