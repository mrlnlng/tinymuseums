'use client'

import { useEffect } from 'react'
import { ensureStarted } from '../store'
import CoinToast from './CoinToast'

export default function WalletProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    ensureStarted()
  }, [])

  return (
    <>
      {children}
      <CoinToast />
    </>
  )
}
