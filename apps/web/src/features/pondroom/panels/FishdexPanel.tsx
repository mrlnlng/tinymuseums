'use client'

import { useEffect, useState } from 'react'
import { useWallet } from '@/features/economy/hooks'
import { KEEPSAKES, type KeepsakeId } from '../lib/journal'
import { fetchPondDex, type PondDex } from '../lib/pond-api'
import FishJournal from './FishJournal'

export function ownedKeepsakes(items: readonly string[]): KeepsakeId[] {
  return KEEPSAKES.filter((item) => items.includes(`keepsake:${item.id}`)).map((item) => item.id)
}

export default function FishdexPanel({ onUseKeepsake }: { onUseKeepsake?(id: KeepsakeId): void }) {
  const wallet = useWallet()
  const [dex, setDex] = useState<PondDex | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'guest' | 'error'>('loading')
  const [reload, setReload] = useState(0)

  useEffect(() => {
    let live = true
    setStatus('loading')
    void fetchPondDex().then((result) => {
      if (!live) return
      if (result.ok) {
        setDex(result.value)
        setStatus('ready')
      } else if (result.status === 401 || result.error === 'signed_out') {
        setStatus('guest')
      } else {
        setStatus('error')
      }
    })
    return () => {
      live = false
    }
  }, [reload])

  return (
    <div className="pond-room-dex">
      {status === 'loading' ? <p className="pond-room-empty">Opening the journal…</p> : null}
      {status === 'guest' ? (
        <p className="pond-room-note">Sign in to keep a fish journal. Guests can fish the pond, but the book stays empty.</p>
      ) : null}
      {status === 'error' ? (
        <div className="pond-room-empty">
          <p>The journal could not be fetched just now.</p>
          <button type="button" className="pond-room-button is-quiet" onClick={() => setReload((n) => n + 1)}>
            Try again
          </button>
        </div>
      ) : null}

      {status === 'ready' && dex ? <FishJournal entries={dex.entries} keepsakes={ownedKeepsakes(wallet.items)} onUseKeepsake={onUseKeepsake} /> : null}
    </div>
  )
}
