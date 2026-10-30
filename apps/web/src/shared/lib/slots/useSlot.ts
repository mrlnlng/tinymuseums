'use client'

import { useSyncExternalStore } from 'react'
import type { SlotDef } from '@tiny/core/slots'
import { defaultStore } from './store.ts'

const serverSnapshots = new WeakMap<SlotDef<unknown>, unknown>()

export function serverSnapshot<T>(def: SlotDef<T>): T {
  let cached = serverSnapshots.get(def)
  if (cached === undefined) {
    cached = def.empty()
    serverSnapshots.set(def, cached)
  }
  return cached as T
}

const noopSubscribe = () => () => {}

export function useSlot<T>(def: SlotDef<T>): [T, (fn: (current: T) => T) => void] {
  const handle = typeof window === 'undefined' ? null : defaultStore().getSlot(def)
  const server = () => serverSnapshot(def)
  const value = useSyncExternalStore(
    handle ? handle.subscribe : noopSubscribe,
    handle ? handle.snapshot : server,
    server,
  )
  return [value, handle ? handle.update : () => {}]
}
