'use client'

import { useEffect, useRef, useState } from 'react'
import { outfit } from '@tiny/core/slots'
import { itemIdFor, priceOf } from '@tiny/core/economy'
import { openAccount } from '@/features/account/lib/account'
import { useWallet, buy, Purse, allowedCharacter, owns, walletReady } from '@/features/economy'
import { florinLabel } from '@/features/economy/lib/claim'
import { useSlot } from '@/shared/lib/slots'
import { CHARACTER_NAMES, keepName } from '../scene/atelier'
import { lookOf } from '../scene/wardrobe'

interface Thing {
  itemId: string
  name: string
  price: number
}

export default function AtelierKeeps() {
  const wallet = useWallet()
  const [outfitDoc] = useSlot(outfit)
  const [buying, setBuying] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const timerRef = useRef<number | null>(null)

  useEffect(
    () => () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    },
    [],
  )

  function say(text: string): void {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    setNotice(text)
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null
      setNotice(null)
    }, 1600)
  }

  if (!walletReady(wallet)) return null

  const look = lookOf(outfitDoc)
  const things: Thing[] = []
  const add = (slot: 'costume' | 'bow', id: string | null): void => {
    if (id === null) return
    const itemId = itemIdFor(slot, id)
    if (owns(wallet, itemId)) return
    const price = priceOf(itemId)
    if (price !== null) things.push({ itemId, name: keepName({ slot, id }), price })
  }
  add('costume', look.costume)
  add('bow', look.bow)
  if (!allowedCharacter(wallet, look.kind)) {
    const itemId = itemIdFor('character', look.kind)
    const price = priceOf(itemId)
    if (price !== null) things.push({ itemId, name: CHARACTER_NAMES[look.kind], price })
  }

  if (things.length === 0) {
    if (wallet.isMember && notice) {
      return (
        <div className="atelier-keeps" role="status">
          <span className="atelier-keeps-note">{notice}</span>
        </div>
      )
    }
    return wallet.isMember ? (
      <div className="atelier-purse">
        <Purse />
      </div>
    ) : null
  }

  if (!wallet.isMember) {
    return (
      <div className="atelier-keeps">
        <button type="button" className="atelier-keeps-invite" onClick={openAccount}>
          Members can keep pieces
        </button>
      </div>
    )
  }

  const balance = wallet.balance ?? 0
  return (
    <div className="atelier-keeps" role="region" aria-label="Keep what you are wearing">
      <div className="atelier-keeps-head">
        <Purse />
        {notice ? (
          <span className="atelier-keeps-note" role="status">
            {notice}
          </span>
        ) : null}
      </div>
      <div className="atelier-keeps-actions">
        {things.map((thing) => {
          const enough = balance >= thing.price
          return (
            <button
              key={thing.itemId}
              type="button"
              className="atelier-keep"
              disabled={!enough || buying !== null}
              onClick={() => {
                void (async () => {
                  setBuying(thing.itemId)
                  const result = await buy(thing.itemId)
                  setBuying(null)
                  say(result === 'ok' ? 'Kept!' : result === 'insufficient' ? 'Not enough florins yet' : "Couldn't keep that")
                })()
              }}
            >
              {enough
                ? `Keep ${thing.name} · ${florinLabel(thing.price)}`
                : `${thing.name} · ${thing.price - balance} more ${thing.price - balance === 1 ? 'florin' : 'florins'} to keep`}
            </button>
          )
        })}
      </div>
    </div>
  )
}
