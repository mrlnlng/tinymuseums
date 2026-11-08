'use client'

import { Fragment, useEffect, useState } from 'react'
import { fetchPondDex, type PondDex } from '../lib/pond-api'
import {
  POND_SPECIES,
  POND_VARIANTS,
  fishArt,
  formatShortSizeCm,
  variantLabel,
} from '../lib/pond-format'

export default function FishdexPanel() {
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

  const found = dex?.totals.found ?? 0
  const possible = dex?.totals.possible ?? POND_SPECIES.length * POND_VARIANTS.length

  return (
    <div className="pond-room-dex">
      <div className="pond-room-dex-head">
        <span className="pond-room-dex-count">
          Found <strong>{dex ? found : '…'}</strong> / {possible}
        </span>
        <span className="pond-room-dex-sub">Four fish, five coats each</span>
      </div>

      {status === 'loading' ? <p className="pond-room-empty">Opening the fishdex…</p> : null}
      {status === 'guest' ? (
        <p className="pond-room-note">Sign in to keep a fishdex. Guests can fish the pond, but the book stays empty.</p>
      ) : null}
      {status === 'error' ? (
        <div className="pond-room-empty">
          <p>The fishdex could not be fetched just now.</p>
          <button type="button" className="pond-room-button is-quiet" onClick={() => setReload((n) => n + 1)}>
            Try again
          </button>
        </div>
      ) : null}

      {status === 'ready' && dex ? (
        <div className="pond-room-dex-grid" role="group" aria-label="Fishdex">
          <span className="pond-room-dex-corner" aria-hidden="true" />
          {POND_VARIANTS.map((variant) => (
            <span className="pond-room-dex-col" key={variant}>
              {variantLabel(variant)}
            </span>
          ))}
          {POND_SPECIES.map((species) => (
            <Fragment key={species.id}>
              <span className="pond-room-dex-species">
                <span className="pond-room-dex-species-name">{species.name}</span>
                <span className="pond-room-dex-species-tier">{species.tier}</span>
              </span>
              {POND_VARIANTS.map((variant) => {
                const cell = dex.entries[species.id]?.[variant]
                const isFound = cell !== undefined && cell.count > 0
                const label = isFound
                  ? `${variantLabel(variant)} ${species.name}: ${cell.count} caught, best ${formatShortSizeCm(cell.bestCm)}`
                  : `${variantLabel(variant)} ${species.name}: not caught yet`
                return (
                  <div
                    className={`pond-room-dex-cell pond-variant--${variant}${isFound ? ' is-found' : ' is-unknown'}`}
                    key={`${species.id}-${variant}`}
                    aria-label={label}
                  >
                    <span className="pond-room-dex-cell-art" aria-hidden="true">
                      <img src={fishArt(species.id)} alt="" width={40} height={40} loading="lazy" />
                    </span>
                    {isFound ? (
                      <span className="pond-room-dex-cell-stats" aria-hidden="true">
                        <span className="pond-room-dex-cell-count">×{cell.count}</span>
                        <span className="pond-room-dex-cell-best">{formatShortSizeCm(cell.bestCm)}</span>
                      </span>
                    ) : (
                      <span className="pond-room-dex-cell-question" aria-hidden="true">
                        ?
                      </span>
                    )}
                  </div>
                )
              })}
            </Fragment>
          ))}
        </div>
      ) : null}

      <p className="pond-room-fineprint">
        Cells show how many of each species and coat you have landed, and the best size. Silhouettes are still out
        there.
      </p>
    </div>
  )
}
