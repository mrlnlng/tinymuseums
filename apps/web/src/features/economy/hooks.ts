'use client'

import { useEffect, useRef, useSyncExternalStore } from 'react'
import {
  getWalletSnapshot,
  subscribeEvents,
  subscribeWallet,
  type EarnedEvent,
  type WalletSnapshot,
} from './store'

const serverSnapshot: WalletSnapshot = { isMember: false, balance: null, items: [], today: null }

export function useWallet(): WalletSnapshot {
  return useSyncExternalStore(subscribeWallet, getWalletSnapshot, () => serverSnapshot)
}

export function useEarnEvents(listener: (event: EarnedEvent) => void): void {
  const latest = useRef(listener)
  latest.current = listener
  useEffect(
    () =>
      subscribeEvents((event) => {
        if (event.type === 'earned') latest.current(event)
      }),
    [],
  )
}
