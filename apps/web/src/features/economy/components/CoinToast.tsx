'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import AssetImage from '@/shared/components/AssetImage'
import { openAccount } from '@/features/account/lib/account'
import { useSound } from '@/features/sound/components/SoundProvider'
import { florinLabel } from '../lib/claim'
import { subscribeEvents, type EconomyEvent } from '../store'
import styles from './CoinToast.module.css'

type Toast = { kind: 'earned'; amount: number } | { kind: 'capped' } | { kind: 'invite' }

const SHOW_MS = 1600

export default function CoinToast() {
  const { play } = useSound()
  const playRef = useRef(play)
  playRef.current = play
  const [toast, setToast] = useState<Toast | null>(null)
  const timerRef = useRef<number | null>(null)
  const cappedRef = useRef(new Set<string>())

  const show = useCallback((next: Toast) => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    setToast(next)
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null
      setToast(null)
    }, SHOW_MS)
  }, [])

  useEffect(
    () =>
      subscribeEvents((event: EconomyEvent) => {
        if (event.type === 'invite') {
          show({ kind: 'invite' })
          return
        }
        if (event.already) return
        if (event.granted > 0) {
          playRef.current('coin')
          show({ kind: 'earned', amount: event.granted })
          return
        }
        if (event.capped && !cappedRef.current.has(event.source)) {
          cappedRef.current.add(event.source)
          show({ kind: 'capped' })
        }
      }),
    [show],
  )

  useEffect(
    () => () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    },
    [],
  )

  if (toast === null) return null

  return (
    <div className={styles.toast} role="status" aria-live="polite">
      {toast.kind === 'earned' ? (
        <>
          <span className={styles.coinWrap}>
            <AssetImage name="coin-large" className={styles.coin} />
          </span>
          <span>+{florinLabel(toast.amount)}</span>
        </>
      ) : toast.kind === 'capped' ? (
        <span>The piggy bank is full for today</span>
      ) : (
        <button type="button" className={styles.invite} onClick={openAccount}>
          Members collect florins for this. <span className={styles.join}>Join to keep them.</span>
        </button>
      )}
    </div>
  )
}
