'use client'

import { forwardRef, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import type { Placement } from '@tiny/core/rooms'
import { priceOf } from '@tiny/core/economy'
import { buy, florinLabel, useWallet } from '@/features/economy'
import { useSound } from '@/features/sound/components/SoundProvider'
import { cozyPropImageUrl } from '../themes/cozy'
import { categoryOf, cozyLevel, propLabel, shopPropIds, trayPropIds, type DrawerCategory } from './logic'

export interface SharingState {
  on: boolean
  token: string | null
}

type Tab = DrawerCategory | 'room' | 'shop'

const TABS: { id: Tab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'wall', label: 'Wall' },
  { id: 'floor', label: 'Floor' },
  { id: 'fish', label: 'Trophies' },
  { id: 'room', label: 'In room' },
  { id: 'shop', label: 'Shop' },
]

interface DecorDrawerProps {
  slug: string
  placements: Placement[]
  saveState: 'saved' | 'saving' | 'unsaved' | 'offline'
  saveLabel: string
  maxPlacements: number
  notice: string | null
  sharing: SharingState | null
  sharingBusy: boolean
  saving: boolean
  canUndo: boolean
  /** A placed thing is being carried; the drawer takes it back. */
  dropActive: boolean
  /** Over the drawer right now, while carrying. */
  dropHover: boolean
  newRefs: ReadonlySet<string>
  onCardPointerDown(ref: string, event: ReactPointerEvent<HTMLButtonElement>): void
  /** Enter or Space on a card. */
  onCardKey(ref: string): void
  /** A placed thing picked from the In room list. */
  onFocusPlaced(id: string): void
  onUndo(): void
  onDone(): void
  onSharingChange(on: boolean): void
  onBought(ref: string): void
}

const DecorDrawer = forwardRef<HTMLElement, DecorDrawerProps>(function DecorDrawer(
  {
    slug,
    placements,
    saveState,
    saveLabel,
    maxPlacements,
    notice,
    sharing,
    sharingBusy,
    saving,
    canUndo,
    dropActive,
    dropHover,
    newRefs,
    onCardPointerDown,
    onCardKey,
    onFocusPlaced,
    onUndo,
    onDone,
    onSharingChange,
    onBought,
  },
  ref,
) {
  const wallet = useWallet()
  const { play } = useSound()
  const [tab, setTab] = useState<Tab>('all')
  const [buying, setBuying] = useState<string | null>(null)
  const [justBought, setJustBought] = useState<string | null>(null)
  const [shopNote, setShopNote] = useState<string | null>(null)
  const [isShareOpen, setIsShareOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const copyRef = useRef<HTMLInputElement>(null)
  const timers = useRef<number[]>([])

  useEffect(() => () => timers.current.forEach((timer) => window.clearTimeout(timer)), [])

  function later(fn: () => void, ms: number): void {
    timers.current.push(window.setTimeout(fn, ms))
  }

  const owned = trayPropIds(wallet.items, placements)
  const things = tab === 'all' || tab === 'shop' || tab === 'room' ? owned : owned.filter((ref) => categoryOf(ref) === tab)
  const placed = placements.filter((placement) => placement.kind === 'prop').slice().sort((a, b) => a.x - b.x)
  const isFull = placements.length >= maxPlacements
  const shop = shopPropIds(wallet.items)
  const level = cozyLevel(placements)
  const shareUrl =
    sharing?.on && sharing.token
      ? `${typeof window === 'undefined' ? '' : window.location.origin}/museum/r/${slug}?key=${sharing.token}`
      : null

  async function keep(itemRef: string): Promise<void> {
    const itemId = `prop:${itemRef}`
    setBuying(itemId)
    setShopNote(null)
    const outcome = await buy(itemId)
    setBuying(null)
    if (outcome === 'ok') {
      play('coin')
      setJustBought(itemRef)
      onBought(itemRef)
      later(() => setJustBought((current) => (current === itemRef ? null : current)), 1400)
      return
    }
    setShopNote(outcome === 'insufficient' ? 'Not enough florins for that yet.' : 'That could not be bought just now.')
  }

  async function copyLink(): Promise<void> {
    if (!shareUrl) return
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
    } catch {
      const input = copyRef.current
      if (input) {
        input.focus()
        input.select()
        try {
          if (document.execCommand('copy')) setCopied(true)
        } catch {}
      }
    }
    later(() => setCopied(false), 1800)
  }

  const balance = wallet.balance ?? 0

  return (
    <section
      ref={ref}
      className={`decor-drawer${dropActive ? ' is-catching' : ''}${dropHover ? ' is-over' : ''}`}
      aria-label="Decorate your room"
    >
      <header className="decor-drawer-head">
        <div className="decor-meter" title={level.next ? `Next: ${level.next}` : 'As cozy as it gets'}>
          <span className="decor-meter-hearts" aria-hidden="true">
            {Array.from({ length: level.maxHearts }, (_, i) => (
              <span key={i} className={i < level.hearts ? 'is-full' : undefined}>
                {i < level.hearts ? '♥' : '♡'}
              </span>
            ))}
          </span>
          <span className="decor-meter-name">{level.name}</span>
          <span className="decor-meter-bar" aria-hidden="true">
            <span style={{ width: `${Math.round(level.progress * 100)}%` }} />
          </span>
          <span className="decor-sr">
            Your room is {level.name}.{level.next ? ` Keep decorating to reach ${level.next}.` : ''}
          </span>
        </div>

        <div className="decor-head-actions">
          <span className={`decor-status is-${saveState}`} role="status" title={saveLabel}>
            <span className="decor-status-dot" aria-hidden="true" />
            <span className="decor-status-text">{saveLabel}</span>
          </span>
          <button type="button" className="decor-icon-btn" onClick={onUndo} disabled={!canUndo} aria-label="Undo">
            {'↶'}
          </button>
          {sharing ? (
            <button
              type="button"
              className={`decor-icon-btn${sharing.on ? ' is-on' : ''}`}
              onClick={() => setIsShareOpen((open) => !open)}
              aria-expanded={isShareOpen}
              aria-label="Share your room"
            >
              {'\u{1F517}'}
            </button>
          ) : null}
          <button type="button" className="button decor-done" onClick={onDone} disabled={saving}>
            {saving ? 'Saving…' : 'Done ✓'}
          </button>
        </div>
      </header>

      {isShareOpen && sharing ? (
        <div className="decor-share">
          <label className="decor-share-toggle">
            <input
              type="checkbox"
              checked={sharing.on}
              disabled={sharingBusy}
              onChange={(event) => onSharingChange(event.target.checked)}
            />
            <span>Anyone with the link can visit</span>
          </label>
          {shareUrl ? (
            <div className="decor-share-row">
              <input ref={copyRef} className="decor-share-url" readOnly value={shareUrl} aria-label="Share link" />
              <button type="button" className="decor-copy" onClick={() => void copyLink()}>
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          ) : null}
        </div>
      ) : null}

      {notice ? (
        <p className="decor-notice" role="alert">
          {notice}
        </p>
      ) : null}

      <div className="decor-chips" role="tablist" aria-label="Kinds of things">
        {TABS.map((entry) => (
          <button
            key={entry.id}
            type="button"
            role="tab"
            aria-selected={tab === entry.id}
            className={`decor-chip${tab === entry.id ? ' is-selected' : ''}${entry.id === 'shop' ? ' is-shop' : ''}`}
            onClick={() => setTab(entry.id)}
          >
            {entry.label}
            {entry.id === 'room' ? (
              <span className={`decor-chip-count${isFull ? ' is-full' : ''}`}>
                {placements.length}/{maxPlacements}
              </span>
            ) : null}
            {entry.id === 'shop' && wallet.isMember ? (
              <span className="decor-chip-coins" aria-label={florinLabel(balance)}>
                {'\u0192'} {balance}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      <div className="decor-cards">
        {tab === 'room' ? (
          placed.length === 0 ? (
            <p className="decor-empty">Nothing is out yet. Place something from All.</p>
          ) : (
            placed.map((placement) => {
              const image = cozyPropImageUrl(placement.ref)
              return (
                <button
                  key={placement.id}
                  type="button"
                  className={`decor-card is-placed is-${categoryOf(placement.ref)}`}
                  onClick={() => onFocusPlaced(placement.id)}
                  aria-label={`Find the ${propLabel(placement.ref).toLowerCase()} in your room`}
                >
                  <span className="decor-card-art">{image ? <img src={image} alt="" draggable={false} /> : null}</span>
                  <span className="decor-card-name">{propLabel(placement.ref)}</span>
                </button>
              )
            })
          )
        ) : tab !== 'shop' ? (
          things.length === 0 ? (
            <p className="decor-empty">
              {owned.length === 0
                ? 'Everything you own is out in the room. Find more in the Shop, or catch fish in the Pond.'
                : 'Nothing of that kind left to place.'}
            </p>
          ) : (
            things.map((itemRef) => {
              const image = cozyPropImageUrl(itemRef)
              return (
                <button
                  key={itemRef}
                  type="button"
                  className={`decor-card is-${categoryOf(itemRef)}${isFull ? ' is-full' : ''}`}
                  onPointerDown={(event) => onCardPointerDown(itemRef, event)}
                  onClick={(event) => {
                    // detail is 0 for a click made with the keyboard; pointer taps are handled on pointerdown.
                    if (event.detail === 0) onCardKey(itemRef)
                  }}
                  aria-label={`Place the ${propLabel(itemRef).toLowerCase()}`}
                >
                  {newRefs.has(itemRef) ? <span className="decor-new">New!</span> : null}
                  <span className="decor-card-art">{image ? <img src={image} alt="" draggable={false} /> : null}</span>
                  <span className="decor-card-name">{propLabel(itemRef)}</span>
                </button>
              )
            })
          )
        ) : !wallet.isMember ? (
          <p className="decor-empty">Sign in to shop for your room.</p>
        ) : shop.length === 0 ? (
          <p className="decor-empty">You have everything in the shop. What a collection!</p>
        ) : (
          shop.map((itemRef) => {
            const itemId = `prop:${itemRef}`
            const price = priceOf(itemId) ?? 0
            const image = cozyPropImageUrl(itemRef)
            const short = Math.max(0, price - balance)
            return (
              <div key={itemRef} className={`decor-card is-shop${short > 0 ? ' is-short' : ''}`}>
                <span className="decor-card-art">{image ? <img src={image} alt="" draggable={false} /> : null}</span>
                <span className="decor-card-name">{propLabel(itemRef)}</span>
                <button
                  type="button"
                  className="decor-buy"
                  disabled={buying !== null || short > 0}
                  onClick={() => void keep(itemRef)}
                >
                  {buying === itemId ? '…' : short > 0 ? `${florinLabel(price)}` : `Buy · ${florinLabel(price)}`}
                </button>
              </div>
            )
          })
        )}
        {justBought ? (
          <p className="decor-bought" role="status">
            {propLabel(justBought)} is yours! Find it under All.
          </p>
        ) : shopNote && tab === 'shop' ? (
          <p className="decor-bought" role="status">
            {shopNote}
          </p>
        ) : null}
      </div>

      {dropActive ? (
        <div className="decor-catch" aria-hidden="true">
          Drop here to put it away
        </div>
      ) : null}
    </section>
  )
})

export default DecorDrawer
