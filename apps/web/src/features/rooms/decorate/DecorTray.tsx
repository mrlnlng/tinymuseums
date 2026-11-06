'use client'

import { useEffect, useRef, useState } from 'react'
import type { Placement } from '@tiny/core'
import { priceOf } from '@tiny/core/economy'
import { buy, florinLabel, useWallet } from '@/features/economy'
import { cozyPropImageUrl } from '../themes/cozy'
import { propLabel, shopPropIds, trayPropIds } from './logic'

export interface SharingState {
  on: boolean
  token: string | null
}

interface DecorTrayProps {
  slug: string
  placements: Placement[]
  status: string
  sharing: SharingState | null
  sharingBusy: boolean
  publishing: boolean
  notice: string | null
  onPublish(): void
  onDone(): void
  onSharingChange(on: boolean): void
  onTilePointerDown(ref: string, event: React.PointerEvent<HTMLButtonElement>): void
}

export default function DecorTray({
  slug,
  placements,
  status,
  sharing,
  sharingBusy,
  publishing,
  notice,
  onPublish,
  onDone,
  onSharingChange,
  onTilePointerDown,
}: DecorTrayProps) {
  const wallet = useWallet()
  const [tab, setTab] = useState<'things' | 'shop'>('things')
  const [buying, setBuying] = useState<string | null>(null)
  const [shopNote, setShopNote] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const copyRef = useRef<HTMLInputElement>(null)
  const copyTimer = useRef<number | null>(null)

  useEffect(
    () => () => {
      if (copyTimer.current !== null) window.clearTimeout(copyTimer.current)
    },
    [],
  )

  const things = trayPropIds(wallet.items, placements)
  const shop = shopPropIds(wallet.items)
  const shareUrl =
    sharing?.on && sharing.token
      ? `${typeof window === 'undefined' ? '' : window.location.origin}/museum/r/${slug}?key=${sharing.token}`
      : null

  async function keep(ref: string): Promise<void> {
    const itemId = `prop:${ref}`
    setBuying(itemId)
    setShopNote(null)
    const outcome = await buy(itemId)
    setBuying(null)
    setShopNote(
      outcome === 'ok'
        ? `${propLabel(ref)} is yours. It is in Your things.`
        : outcome === 'insufficient'
          ? 'Not enough florins for that yet.'
          : "That could not be bought just now.",
    )
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
    if (copyTimer.current !== null) window.clearTimeout(copyTimer.current)
    copyTimer.current = window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <aside className="decor-tray" aria-label="Decorate your room">
      <header className="decor-tray-head">
        <div className="decor-tray-top">
          <h2 className="decor-tray-title">Decorate</h2>
          {status ? (
            <span className="decor-status" role="status">
              {status}
            </span>
          ) : null}
        </div>

        <div className="decor-tray-actions">
          <button type="button" className="button decor-btn" onClick={onPublish} disabled={publishing}>
            {publishing ? 'Publishing…' : 'Publish'}
          </button>
          <button type="button" className="button quiet decor-btn" onClick={onDone}>
            Done
          </button>
        </div>

        {sharing ? (
          <div className="decor-share">
            <label className="decor-share-toggle">
              <input
                type="checkbox"
                checked={sharing.on}
                disabled={sharingBusy}
                onChange={(event) => onSharingChange(event.target.checked)}
              />
              <span>Share link</span>
            </label>
            {shareUrl ? (
              <div className="decor-share-row">
                <input ref={copyRef} className="decor-share-url" readOnly value={shareUrl} aria-label="Share link" />
                <button type="button" className="decor-copy" onClick={() => void copyLink()}>
                  {copied ? 'Copied' : 'Copy'}
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
      </header>

      <div className="decor-tabs" role="tablist" aria-label="Things to put in the room">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'things'}
          className={tab === 'things' ? 'is-selected' : undefined}
          onClick={() => setTab('things')}
        >
          Your things
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'shop'}
          className={tab === 'shop' ? 'is-selected' : undefined}
          onClick={() => setTab('shop')}
        >
          Shop
        </button>
      </div>

      <div className="decor-tray-body">
        {tab === 'things' ? (
          things.length === 0 ? (
            <p className="decor-empty">Everything you own is already out. Visit the shop or play in the pond.</p>
          ) : (
            <div className="decor-grid">
              {things.map((ref) => {
                const image = cozyPropImageUrl(ref)
                return (
                  <button
                    key={ref}
                    type="button"
                    className="decor-tile"
                    onPointerDown={(event) => onTilePointerDown(ref, event)}
                  >
                    {image ? <img src={image} alt="" draggable={false} /> : null}
                    <span>{propLabel(ref)}</span>
                  </button>
                )
              })}
            </div>
          )
        ) : shop.length === 0 ? (
          <p className="decor-empty">You have every thing in the shop.</p>
        ) : (
          <>
            {shopNote ? (
              <p className="decor-shop-note" role="status">
                {shopNote}
              </p>
            ) : null}
            <div className="decor-grid">
              {shop.map((ref) => {
                const itemId = `prop:${ref}`
                const price = priceOf(itemId) ?? 0
                const image = cozyPropImageUrl(ref)
                return (
                  <div key={ref} className="decor-shop-tile">
                    {image ? <img src={image} alt="" draggable={false} /> : null}
                    <span className="decor-shop-name">{propLabel(ref)}</span>
                    <span className="decor-shop-price">{florinLabel(price)}</span>
                    <button
                      type="button"
                      className="decor-buy"
                      disabled={buying !== null || !wallet.isMember || (wallet.balance ?? 0) < price}
                      onClick={() => void keep(ref)}
                    >
                      {buying === itemId ? 'Buying…' : 'Buy'}
                    </button>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </aside>
  )
}
