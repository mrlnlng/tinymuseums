'use client'

import { useWallet } from '../hooks'
import { stampLabel } from '../lib/stamp'
import Stamp from './Stamp'
import styles from './Purse.module.css'

export default function Purse({ className }: { className?: string }) {
  const { isMember, balance } = useWallet()
  if (!isMember || balance === null) return null
  return (
    <p className={className ? `${styles.purse} ${className}` : styles.purse} aria-label={stampLabel(balance)}>
      <span className={styles.coinWrap}>
        <Stamp className={styles.coin} />
      </span>
      <span>{stampLabel(balance)}</span>
    </p>
  )
}
