'use client'

import { forwardRef, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import type { Placement } from '@tiny/core/rooms'
import { priceOf } from '@tiny/core/economy'
import { buy, STAMP_URL, stampLabel, useWallet } from '@/features/economy'
import { useSound } from '@/features/sound/components/SoundProvider'
import { THEMES, type RoomSize } from '@tiny/core/rooms'
import { cozyFinishImageUrl, cozyPropImageUrl } from '../themes/cozy'
import {
  categoryOf,
  cozyLevel,
  FINISH_SLOTS,
  finishLabel,
  finishOf,
  ownedFinishIds,
  propLabel,
  shopFinishIds,
  shopPropIds,
  slotOf,
  thingsIn,
  trayPropIds,
  type DrawerCategory,
  type FinishSlot,
} from './logic'

type Tab = DrawerCategory | 'walls' | 'room' | 'shop'

const TABS: { id: Tab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'furniture', label: 'Furniture' },
  { id: 'wall', label: 'Wall' },
  { id: 'small', label: 'Small things' },
  { id: 'fish', label: 'Trophies' },
  { id: 'walls', label: 'Room' },
  { id: 'room', label: 'In room' },
  { id: 'shop', label: 'Shop' },
]

const SLOT_LABELS: Record<FinishSlot, string> = { wallpaper: 'Wallpaper', baseboard: 'Baseboard' }

interface DecorDrawerProps {
  slug: string
  placements: Placement[]
  saveState: 'saved' | 'saving' | 'unsaved' | 'offline'
  saveLabel: string
  maxPlacements: number
  notice: string | null
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
  onBought(ref: string): void
  /** Puts up a wallpaper or baseboard the member owns. */
  onFinish(zone: FinishSlot, ref: string): void
  /** Shows a shop finish on the room without keeping it; null puts the room back. */
  onPreviewFinish(zone: FinishSlot, ref: string | null): void
  roomSize: RoomSize
  /** The next wall to knock through, if the room can still grow. */
  nextSize: RoomSize | null
  /** Bits of dirt left to clean up. */
  dirt: number
}

const DecorDrawer = forwardRef<HTMLElement, DecorDrawerProps>(function DecorDrawer(
  {
    slug,
    placements,
    saveState,
    saveLabel,
    maxPlacements,
    notice,
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
    onBought,
    onFinish,
    onPreviewFinish,
    roomSize,
    nextSize,
    dirt,
  },
  ref,
) {
  const wallet = useWallet()
  const { play } = useSound()
  const [tab, setTab] = useState<Tab>('all')
  const [buying, setBuying] = useState<string | null>(null)
  const [justBought, setJustBought] = useState<{ name: string; where: string } | null>(null)
  const [trying, setTrying] = useState<{ zone: FinishSlot; ref: string } | null>(null)
  const [shopNote, setShopNote] = useState<string | null>(null)
  const timers = useRef<number[]>([])

  useEffect(() => () => timers.current.forEach((timer) => window.clearTimeout(timer)), [])

  // A try-on lasts only while the shop is open.
  const tryingRef = useRef(trying)
  tryingRef.current = trying
  const previewRef = useRef(onPreviewFinish)
  previewRef.current = onPreviewFinish
  useEffect(() => {
    if (tab === 'shop') return
    const shown = tryingRef.current
    if (shown) {
      previewRef.current(shown.zone, null)
      setTrying(null)
    }
  }, [tab])
  useEffect(
    () => () => {
      const shown = tryingRef.current
      if (shown) previewRef.current(shown.zone, null)
    },
    [],
  )

  function later(fn: () => void, ms: number): void {
    timers.current.push(window.setTimeout(fn, ms))
  }

  const owned = trayPropIds(wallet.items, placements)
  const things = tab === 'all' || tab === 'shop' || tab === 'room' || tab === 'walls' ? owned : owned.filter((ref) => categoryOf(ref) === tab)
  const finishesOwned = ownedFinishIds(wallet.items)
  const finishShop = shopFinishIds(wallet.items)
  const placed = placements.filter((placement) => placement.kind === 'prop').slice().sort((a, b) => a.x - b.x)
  const isFull = thingsIn(placements) >= maxPlacements
  const shop = shopPropIds(wallet.items)
  const level = cozyLevel(placements)

  /** `bought` is the "is yours" note; null when the room celebrates the purchase itself. */
  async function purchase(itemId: string, bought: { name: string; where: string } | null, then: () => void): Promise<void> {
    setBuying(itemId)
    setShopNote(null)
    const outcome = await buy(itemId)
    setBuying(null)
    if (outcome === 'ok') {
      play('coin')
      then()
      if (bought) {
        setJustBought(bought)
        later(() => setJustBought((current) => (current === bought ? null : current)), 1800)
      }
      return
    }
    setShopNote(outcome === 'insufficient' ? 'Not enough stamps for that yet.' : 'That could not be bought just now.')
  }

  function keep(itemRef: string): void {
    void purchase(`prop:${itemRef}`, { name: propLabel(itemRef), where: 'All' }, () => onBought(itemRef))
  }

  function knockThrough(size: RoomSize): void {
    void purchase(`room:${size.id}`, null, () => {})
  }

  function keepFinish(finish: string): void {
    const zone = slotOf(finish)
    if (!zone) return
    void purchase(`finish:${finish}`, { name: finishLabel(finish), where: 'Walls' }, () => {
      setTrying(null)
      onFinish(zone, finish)
    })
  }

  function tryOn(finish: string): void {
    const zone = slotOf(finish)
    if (!zone) return
    if (trying?.ref === finish) {
      setTrying(null)
      onPreviewFinish(zone, null)
      return
    }
    if (trying && trying.zone !== zone) onPreviewFinish(trying.zone, null)
    setTrying({ zone, ref: finish })
    onPreviewFinish(zone, finish)
    play('click')
  }

  function swatch(finish: string): React.CSSProperties {
    const image = cozyFinishImageUrl(finish)
    return image ? { backgroundImage: `url(${image})` } : {}
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
          <button type="button" className="button decor-done" onClick={onDone} disabled={saving}>
            {saving ? 'Saving…' : 'Done ✓'}
          </button>
        </div>
      </header>

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
                {thingsIn(placements)}/{maxPlacements}
              </span>
            ) : null}
            {entry.id === 'shop' && wallet.isMember ? (
              <span className="decor-chip-coins" aria-label={stampLabel(balance)}>
                <img src={STAMP_URL} alt="" className="decor-chip-stamp" /> {balance}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {dirt > 0 ? (
        <p className="decor-hint">
          Tap junk to clear it and damage to repair it, for stamps. Tap the bare wall or floor to fix all its wear at once.
        </p>
      ) : null}

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
        ) : tab === 'walls' ? (
          [
            <span key="size-label" className="decor-group-label">
              Size
            </span>,
            <div key="size" className="decor-card is-size is-current" aria-label={`Your room is the ${roomSize.label.toLowerCase()}`}>
              <span className="decor-card-art decor-size-art" aria-hidden="true">
                <span style={{ width: `${(roomSize.width / 20) * 100}%` }} />
              </span>
              <span className="decor-card-name">{roomSize.label}</span>
            </div>,
            nextSize ? (
              <div key="next-size" className={`decor-card is-size is-shop${balance < (priceOf(`room:${nextSize.id}`) ?? 0) ? ' is-short' : ''}`}>
                <span className="decor-card-art decor-size-art is-next" aria-hidden="true">
                  <span style={{ width: `${(roomSize.width / 20) * 100}%` }} />
                  <i style={{ width: `${((nextSize.width - roomSize.width) / 20) * 100}%` }} />
                </span>
                <span className="decor-card-name">{nextSize.label}</span>
                <button
                  type="button"
                  className="decor-buy"
                  disabled={buying !== null || balance < (priceOf(`room:${nextSize.id}`) ?? 0)}
                  onClick={() => knockThrough(nextSize)}
                  aria-label={`Knock through to the ${nextSize.label.toLowerCase()} for ${stampLabel(priceOf(`room:${nextSize.id}`) ?? 0)}`}
                >
                  {buying === `room:${nextSize.id}` ? '…' : `Knock through · ${stampLabel(priceOf(`room:${nextSize.id}`) ?? 0)}`}
                </button>
              </div>
            ) : null,
            ...FINISH_SLOTS.map((zone) => {
            const current = finishOf(placements, zone)
            const ids = (THEMES.cozy.finishes?.[zone]?.ids ?? []).filter((finish) => finishesOwned.has(finish) || finish === current)
            return [
              <span key={`${zone}-label`} className="decor-group-label">
                {SLOT_LABELS[zone]}
              </span>,
              ...ids.map((finish) => (
                <button
                  key={finish}
                  type="button"
                  className={`decor-card is-swatch is-${zone}${finish === current ? ' is-current' : ''}`}
                  onClick={() => {
                    if (finish !== current) onFinish(zone, finish)
                  }}
                  aria-pressed={finish === current}
                  aria-label={`${SLOT_LABELS[zone]}: ${finishLabel(finish)}`}
                >
                  <span className="decor-card-art decor-swatch" style={swatch(finish)} />
                  <span className="decor-card-name">{finishLabel(finish)}</span>
                </button>
              )),
            ]
          }),
          ]
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
        ) : shop.length === 0 && finishShop.length === 0 ? (
          <p className="decor-empty">You have everything in the shop. What a collection!</p>
        ) : (
          [
            ...finishShop.map((finish) => {
              const itemId = `finish:${finish}`
              const price = priceOf(itemId) ?? 0
              const short = Math.max(0, price - balance)
              const isTrying = trying?.ref === finish
              return (
                <div key={finish} className={`decor-card is-shop is-swatch${short > 0 ? ' is-short' : ''}${isTrying ? ' is-trying' : ''}`}>
                  <button
                    type="button"
                    className="decor-card-art decor-swatch decor-try"
                    style={swatch(finish)}
                    onClick={() => tryOn(finish)}
                    aria-pressed={isTrying}
                    aria-label={isTrying ? `Stop trying ${finishLabel(finish)}` : `Try ${finishLabel(finish)} on your room`}
                  >
                    <span className="decor-try-label">{isTrying ? 'Trying' : 'Try'}</span>
                  </button>
                  <span className="decor-card-name">{finishLabel(finish)}</span>
                  <button type="button" className="decor-buy" disabled={buying !== null || short > 0} onClick={() => keepFinish(finish)}>
                    {buying === itemId ? '…' : short > 0 ? stampLabel(price) : `Buy · ${stampLabel(price)}`}
                  </button>
                </div>
              )
            }),
            ...shop.map((itemRef) => {
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
                  onClick={() => keep(itemRef)}
                >
                  {buying === itemId ? '…' : short > 0 ? stampLabel(price) : `Buy · ${stampLabel(price)}`}
                </button>
              </div>
            )
            }),
          ]
        )}
        {justBought ? (
          <p className="decor-bought" role="status">
            {justBought.name} is yours! Find it under {justBought.where}.
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
