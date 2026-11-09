'use client'

import { useEffect, useRef, type ReactNode } from 'react'
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
  hint: string
  warning?: boolean
  notice?: { message: string; note?: string } | null
  extras?: ReactNode
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
  hint,
  warning,
  notice,
  extras,
  children,
}: BaitTrayProps) {
  const pouchRef = useRef<HTMLDetailsElement>(null)
  useEffect(() => {
    if (disabled && pouchRef.current) pouchRef.current.open = false
  }, [disabled])
  const bait = BAIT.find((entry) => entry.id === selected) ?? BAIT[0]
  const count = bait.id === 'worm' ? '∞' : String(counts[bait.id] ?? 0)
  return (
    <section className="pond-panel pond-panel-compact" aria-label="Bait and casting">
      <div className={warning ? 'pond-panel-bar is-warn' : 'pond-panel-bar'} role="status" aria-live="polite">
        <span className="pond-panel-instruction">{notice ? <>{notice.message}{notice.note ? ` ${notice.note}` : ''}</> : hint}</span>
      </div>
      <div className="pond-panel-body">
        {isMember ? <details className="pond-bait-pouch" ref={pouchRef}>
          <summary aria-label="Choose bait" aria-disabled={disabled} onClick={(event) => { if (disabled) event.preventDefault() }}>
            <span aria-hidden="true">{bait.glyph}</span>
            <span>{bait.name}<small>{count} · Bait pouch</small></span>
          </summary>
          <div className="pond-bait-options">
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
                  if (pouchRef.current) pouchRef.current.open = false
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
          {extras}
          </div>
        </details> : <div className="pond-free-bait" aria-label="Free unlimited worms">
          <span aria-hidden="true">🪱</span><span>Worm<small>Always free</small></span>
        </div>}
        {children}
      </div>
    </section>
  )
}
