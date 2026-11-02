'use client'

import AssetImage from '@/shared/components/AssetImage'
import { useWallet } from '../hooks'
import { florinLabel } from '../lib/claim'
import styles from './Purse.module.css'

export default function Purse({ className }: { className?: string }) {
  const { isMember, balance } = useWallet()
  if (!isMember || balance === null) return null
  return (
    <p className={className ? `${styles.purse} ${className}` : styles.purse} aria-label={florinLabel(balance)}>
      <span className={styles.coinWrap}>
        <AssetImage name="coin-large" className={styles.coin} />
      </span>
      <span>{florinLabel(balance)}</span>
    </p>
  )
}
