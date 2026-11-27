'use client'

import { useEffect, useState } from 'react'
import { openAccount } from '@/features/account/lib/account'
import { JOURNAL_SIZE } from '../lib/journal'
import { POND_SIGN_NAME } from '../lib/identity'
import { fetchPondDex, type PondDex } from '../lib/pond-api'
import FishJournal, { journalFound } from './FishJournal'

interface FishdexPanelProps {
  onClose(): void
  special?: { species: string; variant: string } | null
}

/** The whole journal card, laid out as the 2026-11-26 mock. */
export default function FishdexPanel({ onClose, special = null }: FishdexPanelProps) {
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

  const entries = dex?.entries ?? {}
  const found = journalFound(entries)

  return (
    <>
      <header className="pond-journal-head">
        <div className="pond-journal-heading">
          <p className="pond-journal-place">{POND_SIGN_NAME}</p>
          <h2 id="pond-room-panel-title" className="pond-journal-title">
            Fish journal
          </h2>
          <p className="pond-journal-intro">Every fish you’ve collected so far</p>
        </div>
        <div className="pond-journal-progress">
          <span>
            {status === 'loading' ? '…' : found} / {JOURNAL_SIZE} found
          </span>
          <span className="pond-journal-bar" role="progressbar" aria-label="Journal progress" aria-valuemin={0} aria-valuemax={JOURNAL_SIZE} aria-valuenow={found}>
            <span style={{ width: `${(found / JOURNAL_SIZE) * 100}%` }} />
          </span>
        </div>
        <button type="button" className="pond-journal-close" onClick={onClose} aria-label="Close the fish journal">
          ×
        </button>
      </header>

      <div className="pond-journal-body">
        {status === 'guest' ? (
          <p className="pond-journal-notice">
            <button type="button" className="pond-journal-link" onClick={openAccount}>
              Sign in
            </button>{' '}
            to keep a fish journal. Guests can fish the pond, but the book stays empty.
          </p>
        ) : null}
        {status === 'error' ? (
          <p className="pond-journal-notice">
            The journal could not be fetched just now.{' '}
            <button type="button" className="pond-journal-link" onClick={() => setReload((n) => n + 1)}>
              Try again
            </button>
          </p>
        ) : null}
        <FishJournal entries={entries} special={special} />
      </div>

      <footer className="pond-journal-foot">
        <button type="button" className="pond-journal-back" onClick={onClose}>
          Back to the pond
        </button>
      </footer>
    </>
  )
}
