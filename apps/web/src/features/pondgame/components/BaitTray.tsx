'use client'

import type { ReactNode } from 'react'
import { PearlIcon } from '@/features/pondroom/lib/icons'
import { BAIT, type BaitId } from '../lib/tables.ts'

export interface BaitTrayProps {
  counts: Record<string, number>
  selected: BaitId
  isMember: boolean
  pearls: number | null
  disabled: boolean
  buying: BaitId | null
  onSelect: (bait: BaitId) => void
  onBuy: (bait: BaitId) => void
  /** The cast and call-your-shot buttons, which sit in the panel beside the bait. */
  children?: ReactNode
}

export default function BaitTray({
  counts,
  selected,
  isMember,
  pearls,
  disabled,
  buying,
  onSelect,
  onBuy,
  children,
}: BaitTrayProps) {
  return (
    <section className="pond-panel" aria-label="Bait and casting">
      <div className="pond-panel-bar">
        <span className="pond-panel-title">Select bait</span>
        <span className="pond-panel-note">{isMember ? 'Run out? Tap a bait to buy a pack' : 'Guests fish with worms'}</span>
      </div>
      <div className="pond-panel-body">
        <div className="pond-bait-row" role="group" aria-label="Choose bait">
          {BAIT.map((bait) => {
            const locked = !isMember && bait.id !== 'worm'
            const count = bait.id === 'worm' ? Infinity : counts[bait.id] ?? 0
            const empty = isMember && bait.id !== 'worm' && count <= 0
            const affordable = pearls !== null && pearls >= bait.cost
            const isSelected = bait.id === selected
            const isBuying = buying === bait.id
            return (
              <button
                key={bait.id}
                type="button"
                className={[
                  'pond-bait-tile',
                  isSelected ? 'is-selected' : '',
                  empty ? 'is-empty' : '',
                  locked ? 'is-locked' : '',
                  isBuying ? 'is-buying' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                disabled={disabled || isBuying || locked}
                aria-pressed={isSelected}
                aria-label={
                  locked
                    ? `${bait.name}, sign in to use`
                    : empty
                      ? `Buy ${bait.pack} ${bait.name.toLowerCase()} for ${bait.cost} pearls`
                      : `${bait.name}, ${count === Infinity ? 'unlimited' : `${count} left`}`
                }
                title={locked ? 'Sign in to use bait' : empty && !affordable ? 'Not enough pearls yet' : bait.name}
                onClick={() => {
                  if (empty) onBuy(bait.id)
                  else onSelect(bait.id)
                }}
              >
                <span className="pond-bait-glyph" aria-hidden="true">
                  {bait.glyph}
                </span>
                <span className="pond-bait-name">{bait.name}</span>
                {locked ? (
                  <span className="pond-bait-badge is-lock" aria-hidden="true">
                    <svg viewBox="0 0 12 12" width="9" height="9">
                      <path d="M3.5 5V3.8a2.5 2.5 0 0 1 5 0V5" fill="none" stroke="#fff" strokeWidth="1.4" />
                      <rect x="2.4" y="5" width="7.2" height="5.4" rx="1.2" fill="#fff" />
                    </svg>
                  </span>
                ) : empty ? (
                  <span className={affordable ? 'pond-bait-badge is-buy' : 'pond-bait-badge is-buy is-poor'}>
                    {bait.cost}
                    <PearlIcon size={11} />
                  </span>
                ) : (
                  <span className="pond-bait-badge">{count === Infinity ? '∞' : `x${count}`}</span>
                )}
              </button>
            )
          })}
        </div>
        {children}
      </div>
    </section>
  )
}
