'use client'

import { memo } from 'react'
import { PearlIcon, PondIcon } from '@/features/pondroom/lib/icons'
import { formatPayout, streakChip } from '../lib/risk.ts'
import { TIER_LABEL, type FishTier } from '../lib/tables.ts'

export interface HudWagerChip {
  tier: FishTier
  payout: number
  stake: number
}

export interface HudProps {
  pearls: number | null
  lucky: number
  streak: number
  streakFresh: boolean
  streakLost: boolean
  chain: { level: number; pot: number } | null
  wager: HudWagerChip | null
  isMember: boolean
  settingsOpen: boolean
  easyReel: boolean
  onToggleSettings: () => void
  onToggleEasyReel: () => void
  onClose: () => void
}

function Hud({
  pearls,
  lucky,
  streak,
  streakFresh,
  streakLost,
  chain,
  wager,
  isMember,
  settingsOpen,
  easyReel,
  onToggleSettings,
  onToggleEasyReel,
  onClose,
}: HudProps) {
  const chip = streakChip(streak)

  return (
    <header className="pond-hud" data-pond-ui>
      <div className="pond-hud-left">
        {isMember ? <div
          className={isMember ? 'pond-pearls' : 'pond-pearls is-guest'}
          aria-label={isMember && pearls !== null ? `${pearls} pearls` : 'Pearls'}
          title={isMember ? 'Pearls' : 'Sign in to collect pearls'}
        >
          <PearlIcon size={18} />
          <span className="pond-pearls-count">{isMember ? (pearls !== null ? pearls.toLocaleString() : '…') : 'Sign in'}</span>
        </div> : null}
        <div className="pond-chips" aria-live="polite">
          {streakLost ? (
            <span className="pond-chip is-streak is-lost" aria-label="Streak lost">
              <span aria-hidden="true">🔥</span> Streak lost
            </span>
          ) : chip ? (
            <span
              className={['pond-chip', 'is-streak', `tier-${chip.tier}`, streakFresh ? 'is-fresh' : ''].join(' ')}
              aria-label={`Hot streak ×${chip.multiplier}`}
              title={chip.hint}
            >
              <span aria-hidden="true">🔥</span> ×{chip.multiplier}
            </span>
          ) : null}
          {chain && chain.level > 0 ? (
            <span className="pond-chip is-chain" title="Your live bait rides on the next catch">
              <span aria-hidden="true">🪝</span> Chain {chain.level} · {chain.pot}
            </span>
          ) : null}
          {wager ? (
            <span className="pond-chip is-wager" aria-label={`Called ${TIER_LABEL[wager.tier]}`}>
              <span aria-hidden="true">🎯</span> {TIER_LABEL[wager.tier]} {formatPayout(wager.payout)} · {wager.stake}
            </span>
          ) : null}
          {lucky > 0 ? (
            <span className="pond-chip is-charm" title="Variant odds are tripled">
              <span aria-hidden="true">🍀</span> Lucky · {lucky}
            </span>
          ) : null}
        </div>
      </div>
      <div className="pond-hud-right">
        <button type="button" className="pond-bank-return" aria-label="Back to the pond bank" title="Back to the bank" onClick={onClose}>
          <span aria-hidden="true">←</span> Back to pond
        </button>
        <div className="pond-settings-wrap">
          <button
            type="button"
            className="pond-icon-button"
            aria-label="Fishing settings"
            title="Settings"
            aria-expanded={settingsOpen}
            onClick={onToggleSettings}
          >
            <PondIcon name="gear" />
          </button>
          {settingsOpen ? (
            <div className="pond-settings" role="dialog" aria-label="Fishing settings">
              <label className="pond-settings-row">
                <span>
                  Easy reel
                  <small>Wider safe band, gentler runs</small>
                </span>
                <input type="checkbox" checked={easyReel} onChange={onToggleEasyReel} />
              </label>
              <p className="pond-settings-note">Motion follows your device’s reduced-motion setting.</p>
            </div>
          ) : null}
        </div>

      </div>
    </header>
  )
}

export default memo(Hud)
