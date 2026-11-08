'use client'

import { PearlIcon } from '../lib/icons'
import { useEffect, useState } from 'react'
import { claimPondBounty, fetchPondBounties, type PondBounties } from '../lib/pond-api'
import { formatInteger, nextUtcMidnight, utcDayLabel } from '../lib/pond-format'
import { setPondState } from '../lib/pond-state'
import { useCountdown } from '../lib/use-countdown'

function dayLabel(day: string): string {
  const date = new Date(`${day}T00:00:00.000Z`)
  return Number.isNaN(date.getTime()) ? 'Today' : utcDayLabel(date)
}

export default function BountyPanel() {
  const [data, setData] = useState<PondBounties | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'guest' | 'error'>('loading')
  const [claiming, setClaiming] = useState<string | null>(null)
  const [reload, setReload] = useState(0)
  const [notice, setNotice] = useState<{ tone: 'ok' | 'warn'; text: string } | null>(null)
  const resetIn = useCountdown(nextUtcMidnight(), { seconds: true })

  useEffect(() => {
    let live = true
    setStatus('loading')
    void fetchPondBounties().then((result) => {
      if (!live) return
      if (result.ok) {
        setData(result.value)
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

  async function claim(id: string): Promise<void> {
    if (claiming !== null) return
    setClaiming(id)
    setNotice(null)
    const result = await claimPondBounty(id)
    setClaiming(null)
    if (!result.ok) {
      if (result.error === 'already_claimed') {
        setNotice({ tone: 'warn', text: 'That bounty was already claimed today.' })
      } else if (result.error === 'not_done') {
        setNotice({ tone: 'warn', text: 'That bounty is not finished yet.' })
      } else {
        setNotice({ tone: 'warn', text: 'The bounty could not be claimed just now.' })
      }
      return
    }
    setData(result.value.bounties)
    setPondState(result.value.state)
    const claimed = result.value.bounties.bounties.find((bounty) => bounty.id === id)
    setNotice({
      tone: 'ok',
      text: `Bounty claimed${claimed ? ` — ${formatInteger(claimed.reward)} pearls` : ''}.`,
    })
  }

  return (
    <div className="pond-room-bounties">
      <div className="pond-room-bounty-meta">
        <span>{data ? dayLabel(data.day) : 'Today'} · three small goals</span>
        <span className="pond-room-bounty-reset">New bounties in {resetIn}</span>
      </div>

      {status === 'loading' ? <p className="pond-room-empty">Reading today&apos;s notices…</p> : null}
      {status === 'guest' ? (
        <p className="pond-room-note">
          Sign in to take on today&apos;s bounties. Guests can still fish with the free worm.
        </p>
      ) : null}
      {status === 'error' ? (
        <div className="pond-room-empty">
          <p>The bounty board could not be fetched just now.</p>
          <button type="button" className="pond-room-button is-quiet" onClick={() => setReload((n) => n + 1)}>
            Try again
          </button>
        </div>
      ) : null}

      {notice ? (
        <p className={`pond-room-notice is-${notice.tone}`} role="status">
          {notice.text}
        </p>
      ) : null}

      {status === 'ready' && data ? (
        <ol className="pond-room-bounty-list">
          {data.bounties.map((bounty) => {
            const percent = Math.min(100, Math.round((bounty.progress / bounty.target) * 100))
            return (
              <li
                className={`pond-room-bounty${bounty.done ? ' is-done' : ''}${bounty.claimed ? ' is-claimed' : ''}`}
                key={bounty.id}
              >
                <div className="pond-room-bounty-head">
                  <h3 className="pond-room-bounty-text">{bounty.text}</h3>
                  <span className="pond-room-bounty-reward">
                    <PearlIcon size={15} />
                    {formatInteger(bounty.reward)}
                  </span>
                </div>
                <div
                  className="pond-room-meter is-bounty"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={bounty.target}
                  aria-valuenow={Math.min(bounty.target, bounty.progress)}
                  aria-label={bounty.text}
                >
                  <span style={{ width: `${percent}%` }} />
                </div>
                <div className="pond-room-bounty-foot">
                  <span className="pond-room-bounty-progress">
                    {formatInteger(Math.min(bounty.target, bounty.progress))} / {formatInteger(bounty.target)}
                  </span>
                  {bounty.claimed ? (
                    <span className="pond-room-bounty-done">Claimed today</span>
                  ) : bounty.done ? (
                    <button
                      type="button"
                      className="pond-room-button pond-room-bounty-claim"
                      onClick={() => void claim(bounty.id)}
                      disabled={claiming !== null}
                    >
                      {claiming === bounty.id ? 'Claiming…' : 'Claim'}
                    </button>
                  ) : (
                    <span className="pond-room-bounty-pending">In progress</span>
                  )}
                </div>
              </li>
            )
          })}
        </ol>
      ) : null}
    </div>
  )
}
