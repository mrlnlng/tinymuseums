'use client'

import { useEffect, useState } from 'react'
import {
  clampWagerStake,
  formatPayout,
  formatWagerPercent,
  stepWagerStake,
  wagerLimits,
  WAGER_MIN,
  wagerRows,
  type WagerOdds,
} from '../lib/risk.ts'
import { type FishTier } from '../lib/tables.ts'

export interface WagerPickerProps {
  open: boolean
  odds: WagerOdds | null
  pearls: number
  wageredToday: number
  locked: { tier: FishTier; stake: number } | null
  onLock: (wager: { tier: FishTier; stake: number }) => void
  onCancel: () => void
}

/** Compact "Call your shot" picker. Odds and payouts come straight from the server state. */
export default function WagerPicker({
  open,
  odds,
  pearls,
  wageredToday,
  locked,
  onLock,
  onCancel,
}: WagerPickerProps) {
  const [tier, setTier] = useState<FishTier>('common')
  const [stake, setStake] = useState(0)
  const limits = wagerLimits(pearls, wageredToday)
  const rows = wagerRows(odds)

  useEffect(() => {
    if (!open) return
    setTier(locked?.tier ?? 'common')
    setStake(clampWagerStake(locked?.stake ?? 20, pearls, wageredToday))
  }, [open, locked?.tier, locked?.stake, pearls, wageredToday])

  if (!open) return null

  const payout = odds?.payouts[tier] ?? 0
  const canLock = limits.maxStake >= WAGER_MIN && stake >= WAGER_MIN && payout > 0
  const capBlocked = limits.leftToday < WAGER_MIN

  function chooseTier(next: FishTier): void {
    setTier(next)
    if (stake < 5) setStake(clampWagerStake(20, pearls, wageredToday))
  }

  return (
    <section className="pond-wager-picker" data-pond-ui role="dialog" aria-label="Call your shot">
      <div className="pond-wager-head">
        <span>Call your shot</span>
        <button type="button" className="pond-wager-close" onClick={onCancel} aria-label="Close the wager picker">
          ×
        </button>
      </div>
      <p className="pond-wager-note">Pick the tier you think will bite. The server locks the odds at the cast.</p>
      <div className="pond-wager-rows" role="group" aria-label="Fish tier">
        {rows.map((row) => (
          <button
            key={row.tier}
            type="button"
            className={[
              'pond-wager-row',
              `is-${row.tier}`,
              tier === row.tier ? 'is-selected' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            aria-pressed={tier === row.tier}
            disabled={row.payout <= 0}
            onClick={() => chooseTier(row.tier)}
          >
            <span className="pond-wager-tier">{row.label}</span>
            <span className="pond-wager-prob">{formatWagerPercent(row.probability)}</span>
            <span className="pond-wager-payout">{formatPayout(row.payout)}</span>
          </button>
        ))}
      </div>
      <div className="pond-wager-stake">
        <button
          type="button"
          className="pond-wager-step"
          aria-label="Decrease stake"
          disabled={limits.maxStake < WAGER_MIN || stake <= WAGER_MIN}
          onClick={() => setStake(stepWagerStake(stake, -1, pearls, wageredToday))}
        >
          −
        </button>
        <div className="pond-wager-stake-value">
          <span className="pond-pearl-icon" aria-hidden="true" />
          <strong>{stake}</strong>
          <span>stake</span>
        </div>
        <button
          type="button"
          className="pond-wager-step"
          aria-label="Increase stake"
          disabled={limits.maxStake < WAGER_MIN || stake >= limits.maxStake}
          onClick={() => setStake(stepWagerStake(stake, 1, pearls, wageredToday))}
        >
          +
        </button>
        <span className="pond-wager-left">{limits.leftToday} left today</span>
      </div>
      <div className="pond-wager-actions">
        <button type="button" className="pond-wager-cancel" onClick={onCancel}>
          Cancel
        </button>
        <button
          type="button"
          className="pond-wager-lock"
          disabled={!canLock}
          onClick={() => {
            if (canLock) onLock({ tier, stake })
          }}
        >
          {limits.maxStake < WAGER_MIN
            ? capBlocked
              ? 'Daily cap reached'
              : 'Not enough pearls'
            : `Lock in ${stake}`}
        </button>
      </div>
    </section>
  )
}
