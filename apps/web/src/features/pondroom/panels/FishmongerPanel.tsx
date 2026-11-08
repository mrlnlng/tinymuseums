'use client'

import { useEffect, useState } from 'react'
import { refreshWalletNow, useWallet } from '@/features/economy'
import {
  buyPondBait,
  exchangePondPearls,
  fetchPondState,
  type PondStateView,
} from '../lib/pond-api'
import {
  EXCHANGE_DAILY_STAMPS,
  EXCHANGE_PEARLS_PER_STAMP,
  ODDS_BAIT,
  POND_BAIT,
  POND_PITY_CERTAIN,
  POND_PITY_SOFT,
  POND_WAGER_DAILY_CAP,
  TIERS,
  VARIANT_ODDS,
  fishArt,
  formatInteger,
  formatPercent,
  variantLabel,
  type PondBaitId,
  type PondShopBaitId,
} from '../lib/pond-format'
import { setPondState } from '../lib/pond-state'
import { usePondState } from '../lib/use-pond-state'

type Tab = 'bait' | 'exchange' | 'odds'

const TABS: { id: Tab; label: string }[] = [
  { id: 'bait', label: 'Bait' },
  { id: 'exchange', label: 'Pearl exchange' },
  { id: 'odds', label: 'Fishing odds' },
]

type Tone = 'ok' | 'warn'

function BaitShop() {
  const snapshot = usePondState()
  const [busy, setBusy] = useState<PondShopBaitId | null>(null)
  const [notice, setNotice] = useState<{ tone: Tone; text: string } | null>(null)
  const pearls = snapshot.state?.pearls ?? 0

  async function buy(bait: PondShopBaitId, price: number, pack: number): Promise<void> {
    if (busy !== null) return
    setBusy(bait)
    setNotice(null)
    const result = await buyPondBait(bait)
    setBusy(null)
    if (!result.ok) {
      if (result.status === 401 || result.error === 'signed_out') {
        setNotice({ tone: 'warn', text: 'Sign in to buy bait. Guests fish with the free worm.' })
      } else if (result.error === 'insufficient') {
        setNotice({
          tone: 'warn',
          text: `Not enough pearls — that pack costs ${formatInteger(price)} and you have ${formatInteger(pearls)}.`,
        })
      } else {
        setNotice({ tone: 'warn', text: 'The fishmonger could not wrap that up just now.' })
      }
      return
    }
    setPondState(result.value)
    setNotice({
      tone: 'ok',
      text: `Bought ${pack} ${bait}${pack === 1 ? '' : 's'} for ${formatInteger(price)} pearls.`,
    })
    void refreshWalletNow()
  }

  return (
    <div className="pond-room-shop">
      {!snapshot.isMember ? (
        <p className="pond-room-note">Sign in to buy bait and keep your pearls between visits.</p>
      ) : null}
      {notice ? (
        <p className={`pond-room-notice is-${notice.tone}`} role="status">
          {notice.text}
        </p>
      ) : null}
      <article className="pond-room-bait is-free">
        <span className="pond-room-bait-emoji" aria-hidden="true">🪱</span>
        <div className="pond-room-bait-info">
          <h3 className="pond-room-bait-name">Worm</h3>
          <p className="pond-room-bait-favours">Any fish might bite</p>
          <p className="pond-room-bait-meta">Always free · never runs out</p>
        </div>
        <span className="pond-room-bait-free">Free</span>
      </article>
      {POND_BAIT.map((bait) => {
        const owned = snapshot.state?.bait[bait.id] ?? 0
        const short = snapshot.isMember && snapshot.state !== null && pearls < bait.price
        return (
          <article className={`pond-room-bait${short ? ' is-short' : ''}`} key={bait.id}>
            <span className="pond-room-bait-emoji" aria-hidden="true">
              {bait.emoji}
            </span>
            <div className="pond-room-bait-info">
              <h3 className="pond-room-bait-name">{bait.name}</h3>
              <p className="pond-room-bait-favours">{bait.favours}</p>
              <p className="pond-room-bait-meta">
                Pack of {bait.pack} · {formatInteger(bait.price)} pearls · <strong>{owned}</strong> owned
              </p>
            </div>
            <button
              type="button"
              className="pond-room-button pond-room-bait-buy"
              onClick={() => void buy(bait.id, bait.price, bait.pack)}
              disabled={!snapshot.isMember || busy !== null || short}
              title={!snapshot.isMember ? 'Sign in to buy bait' : short ? 'You need more pearls for this pack' : undefined}
            >
              {busy === bait.id ? 'Buying…' : short ? `Need ${formatInteger(bait.price - pearls)} more` : 'Buy'}
            </button>
          </article>
        )
      })}
      <p className="pond-room-fineprint">
        Packs go straight into your bait tin. Pearls come from catches, never from the shop.
      </p>
    </div>
  )
}

function Exchange() {
  const snapshot = usePondState()
  const wallet = useWallet()
  const [amount, setAmount] = useState(EXCHANGE_PEARLS_PER_STAMP)
  const [remaining, setRemaining] = useState(EXCHANGE_DAILY_STAMPS)
  const [confirmed, setConfirmed] = useState(false)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState<{ tone: Tone; text: string } | null>(null)

  const pearls = snapshot.state?.pearls ?? 0
  const byPearls = Math.floor(pearls / EXCHANGE_PEARLS_PER_STAMP) * EXCHANGE_PEARLS_PER_STAMP
  const max = Math.max(0, Math.min(byPearls, remaining * EXCHANGE_PEARLS_PER_STAMP))
  const stamps = amount / EXCHANGE_PEARLS_PER_STAMP
  const canExchange = snapshot.isMember && !busy && amount >= EXCHANGE_PEARLS_PER_STAMP && amount <= max

  useEffect(() => {
    setAmount((current) => {
      const stepped = Math.max(EXCHANGE_PEARLS_PER_STAMP, Math.round(current / EXCHANGE_PEARLS_PER_STAMP) * 10)
      return Math.min(stepped, Math.max(EXCHANGE_PEARLS_PER_STAMP, max))
    })
  }, [max])

  async function exchange(): Promise<void> {
    if (!canExchange) return
    setBusy(true)
    setNotice(null)
    const result = await exchangePondPearls(amount)
    setBusy(false)
    if (!result.ok) {
      if (result.status === 401 || result.error === 'signed_out') {
        setNotice({ tone: 'warn', text: 'Sign in to exchange pearls for stamps.' })
      } else if (result.error === 'insufficient') {
        setNotice({ tone: 'warn', text: 'Not enough pearls for that many stamps.' })
      } else {
        setNotice({ tone: 'warn', text: 'That exchange did not go through just now.' })
      }
      return
    }

    const { state, granted, capped } = result.value
    setRemaining((current) => (capped ? 0 : Math.max(0, current - granted)))
    setConfirmed(true)
    setAmount(EXCHANGE_PEARLS_PER_STAMP)
    setNotice({
      tone: capped && granted === 0 ? 'warn' : 'ok',
      text:
        granted === 0
          ? 'The stamp allowance for today is used up. Pearls stay in the pond.'
          : `Exchanged ${formatInteger(granted * EXCHANGE_PEARLS_PER_STAMP)} pearls for ${granted} stamp${
              granted === 1 ? '' : 's'
            }.${capped ? ' The daily stamp allowance is now used up.' : ''}`,
    })
    setPondState(state)
    await refreshWalletNow()
  }

  return (
    <div className="pond-room-exchange">
      <div className="pond-room-exchange-head">
        <span className="pond-room-pearl-icon" aria-hidden="true" />
        <span>
          {EXCHANGE_PEARLS_PER_STAMP} pearls <span aria-hidden="true">→</span> 1 stamp
        </span>
      </div>
      <p className="pond-room-exchange-balance">
        Pond pearls <strong>{formatInteger(pearls)}</strong>
        <span aria-hidden="true"> · </span>
        Museum wallet <strong>{formatInteger(wallet.balance ?? 0)}</strong> stamps
      </p>

      {!snapshot.isMember ? (
        <p className="pond-room-note">Sign in to turn pond pearls into museum stamps.</p>
      ) : null}
      {notice ? (
        <p className={`pond-room-notice is-${notice.tone}`} role="status">
          {notice.text}
        </p>
      ) : null}

      <div className="pond-room-stepper">
        <button
          type="button"
          className="pond-room-stepper-button"
          onClick={() => setAmount((current) => Math.max(EXCHANGE_PEARLS_PER_STAMP, current - EXCHANGE_PEARLS_PER_STAMP))}
          disabled={!snapshot.isMember || busy || amount <= EXCHANGE_PEARLS_PER_STAMP}
          aria-label={`${EXCHANGE_PEARLS_PER_STAMP} fewer pearls`}
        >
          −
        </button>
        <div className="pond-room-stepper-readout">
          <span className="pond-room-stepper-pearls">{formatInteger(amount)}</span>
          <span className="pond-room-stepper-label">pearls</span>
          <span className="pond-room-stepper-arrow" aria-hidden="true">
            →
          </span>
          <span className="pond-room-stepper-stamps">{stamps}</span>
          <span className="pond-room-stepper-label">stamp{stamps === 1 ? '' : 's'}</span>
        </div>
        <button
          type="button"
          className="pond-room-stepper-button"
          onClick={() => setAmount((current) => Math.min(max, current + EXCHANGE_PEARLS_PER_STAMP))}
          disabled={!snapshot.isMember || busy || amount >= max}
          aria-label={`${EXCHANGE_PEARLS_PER_STAMP} more pearls`}
        >
          +
        </button>
      </div>

      <div className="pond-room-exchange-actions">
        <button type="button" className="pond-room-button" onClick={() => void exchange()} disabled={!canExchange}>
          {busy ? 'Exchanging…' : `Exchange for ${stamps} stamp${stamps === 1 ? '' : 's'}`}
        </button>
        <span className="pond-room-fineprint">
          {confirmed
            ? `${remaining} of ${EXCHANGE_DAILY_STAMPS} stamps left today`
            : `Up to ${EXCHANGE_DAILY_STAMPS} stamps a day`}
        </span>
      </div>
      {snapshot.isMember && pearls < EXCHANGE_PEARLS_PER_STAMP ? (
        <p className="pond-room-fineprint">You need at least {EXCHANGE_PEARLS_PER_STAMP} pearls to make a stamp.</p>
      ) : null}
    </div>
  )
}

function Odds() {
  const snapshot = usePondState()
  const [bait, setBait] = useState<PondBaitId>('worm')
  const [view, setView] = useState<PondStateView | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle')

  useEffect(() => {
    if (!snapshot.isMember) {
      setView(null)
      setStatus('idle')
      return
    }
    let live = true
    setView(null)
    setStatus('loading')
    void fetchPondState(bait).then((result) => {
      if (!live) return
      if (result.ok) {
        setView(result.value)
        setStatus('ready')
      } else {
        setStatus('error')
      }
    })
    return () => {
      live = false
    }
  }, [bait, snapshot.isMember])

  const moon = view?.moon ?? snapshot.state?.moon ?? 'other'
  const pity = view?.pity ?? snapshot.state?.pity ?? 0
  const wagered = view?.wageredToday ?? snapshot.state?.wageredToday ?? 0
  const lucky = view?.lucky ?? snapshot.state?.lucky ?? 0
  const tiers = view?.odds.tiers ?? null
  const pityPercent = Math.min(100, Math.round((pity / POND_PITY_CERTAIN) * 100))
  const wagerPercent = Math.min(100, Math.round((wagered / POND_WAGER_DAILY_CAP) * 100))

  return (
    <div className="pond-room-odds">
      <div className="pond-room-odds-head">
        <span className="pond-room-odds-title">Tier odds</span>
        <div className="pond-room-odds-baits" role="group" aria-label="Bait for odds">
          {ODDS_BAIT.map((entry) => (
            <button
              key={entry.id}
              type="button"
              className={`pond-room-odds-bait${bait === entry.id ? ' is-active' : ''}`}
              aria-pressed={bait === entry.id}
              onClick={() => setBait(entry.id)}
            >
              {entry.name}
            </button>
          ))}
        </div>
      </div>

      {!snapshot.isMember ? (
        <p className="pond-room-note">Sign in to see the live tier odds for the bait in your tin.</p>
      ) : null}
      {status === 'loading' && snapshot.isMember ? <p className="pond-room-empty">Reading the water…</p> : null}
      {status === 'error' ? (
        <p className="pond-room-notice is-warn" role="status">
          The odds could not be fetched just now.
        </p>
      ) : null}

      {tiers ? (
        <div className="pond-room-tier-grid">
          {TIERS.map((tier) => (
            <div className={`pond-room-tier is-${tier}`} key={tier}>
              <span className="pond-room-tier-name">{variantLabel(tier)}</span>
              <strong className="pond-room-tier-value">{formatPercent(tiers[tier])}</strong>
            </div>
          ))}
        </div>
      ) : null}

      <section className="pond-room-odds-section" aria-labelledby="pond-room-variants-title">
        <h3 id="pond-room-variants-title" className="pond-room-odds-heading">
          Variants
        </h3>
        <ul className="pond-room-variant-list">
          {VARIANT_ODDS.map((variant) => {
            const fullMoon = variant.id === 'moonlit' && moon === 'full'
            const oneIn = fullMoon ? variant.fullMoonOdds : variant.odds
            return (
              <li className="pond-room-variant-row" key={variant.id}>
                <span className={`pond-room-variant-swatch pond-variant--${variant.id}`}>
                  <img src={fishArt('star-snapper')} alt="" width={28} height={28} loading="lazy" />
                </span>
                <span className="pond-room-variant-name">{variant.label}</span>
                <span className="pond-room-variant-odds">1 in {formatInteger(oneIn)}</span>
                <span className="pond-room-variant-note">
                  {variant.id === 'moonlit'
                    ? fullMoon
                      ? 'Full moon today'
                      : '1 in 150 on full-moon days'
                    : `×${variant.multiplier} pearls`}
                </span>
              </li>
            )
          })}
        </ul>
        <p className="pond-room-fineprint">
          {moon === 'full' ? 'The moon is full — moonlit fish are four times likelier today.' : 'The moon is not full today.'}
          {lucky > 0 ? ` A lucky charm triples every variant chance for ${lucky} more cast${lucky === 1 ? '' : 's'}.` : ''}
        </p>
      </section>

      <section className="pond-room-odds-section" aria-labelledby="pond-room-pity-title">
        <h3 id="pond-room-pity-title" className="pond-room-odds-heading">
          Legendary pity
        </h3>
        <p className="pond-room-odds-copy">
          A legendary is guaranteed by your {POND_PITY_CERTAIN}th cast without one. You are at{' '}
          <strong>{pity}</strong>. From cast {POND_PITY_SOFT} the chance grows with every cast.
        </p>
        <div
          className="pond-room-meter"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={POND_PITY_CERTAIN}
          aria-valuenow={Math.min(POND_PITY_CERTAIN, pity)}
          aria-label="Casts since the last legendary"
        >
          <span style={{ width: `${pityPercent}%` }} />
        </div>
        {pity >= POND_PITY_CERTAIN ? (
          <p className="pond-room-notice is-ok">Your next cast is guaranteed a legendary.</p>
        ) : null}
      </section>

      <section className="pond-room-odds-section" aria-labelledby="pond-room-wager-title">
        <h3 id="pond-room-wager-title" className="pond-room-odds-heading">
          Daily wager cap
        </h3>
        <p className="pond-room-odds-copy">
          {snapshot.isMember
            ? `${formatInteger(wagered)} of ${POND_WAGER_DAILY_CAP} pearls staked today (UTC).`
            : `Members can stake up to ${POND_WAGER_DAILY_CAP} pearls a day.`}
        </p>
        <div
          className="pond-room-meter is-wager"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={POND_WAGER_DAILY_CAP}
          aria-valuenow={Math.min(POND_WAGER_DAILY_CAP, wagered)}
          aria-label="Pearls wagered today"
        >
          <span style={{ width: `${wagerPercent}%` }} />
        </div>
      </section>
    </div>
  )
}

export default function FishmongerPanel() {
  const [tab, setTab] = useState<Tab>('bait')

  return (
    <div className="pond-room-fishmonger">
      <div className="pond-room-tabs" role="tablist" aria-label="Fishmonger">
        {TABS.map((entry) => (
          <button
            key={entry.id}
            type="button"
            role="tab"
            aria-selected={tab === entry.id}
            className={`pond-room-tab${tab === entry.id ? ' is-active' : ''}`}
            onClick={() => setTab(entry.id)}
          >
            {entry.label}
          </button>
        ))}
      </div>
      {tab === 'bait' ? <BaitShop /> : null}
      {tab === 'exchange' ? <Exchange /> : null}
      {tab === 'odds' ? <Odds /> : null}
    </div>
  )
}
