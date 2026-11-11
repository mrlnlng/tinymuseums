'use client'

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { assetUrl } from '@/shared/lib/assets'
import { useModalFocus } from '@/shared/hooks/useModalFocus'
import type { CatchView } from '../lib/guest.ts'
import type { PondSfx, PondSfxName } from '../lib/sfx.ts'
import { chainOffer, missWagerLabel } from '../lib/risk.ts'
import {
  SPECIES_BY_ID,
  TIER_LABEL,
  VARIANT_BY_ID,
  treasureLabel,
  type FishTier,
} from '../lib/tables.ts'

const TIER_MS: Record<FishTier, number> = {
  common: 1000,
  uncommon: 1700,
  rare: 2700,
  legendary: 4400,
}

const TIER_SFX: Record<FishTier, PondSfxName> = {
  common: 'plink',
  uncommon: 'chime2',
  rare: 'chime3',
  legendary: 'fanfare',
}

function useCountUp(target: number, duration: number, instant: boolean): number {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (instant) {
      setValue(target)
      return
    }
    if (target <= 0) {
      setValue(0)
      return
    }
    let frame = 0
    const start = performance.now()
    const step = (now: number) => {
      const at = Math.min(1, (now - start) / duration)
      const eased = 1 - (1 - at) ** 3
      setValue(Math.round(target * eased))
      if (at < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [target, duration, instant])
  return value
}

interface ConfettiPiece {
  id: number
  x: number
  delay: number
  duration: number
  rotate: number
  color: string
}

const CONFETTI_COLORS = ['#f3d35c', '#f08aa6', '#7fd4c4', '#9ab8ff', '#ffb36b', '#fff2c6']

function makeConfetti(): ConfettiPiece[] {
  return Array.from({ length: 26 }, (_, id) => ({
    id,
    x: Math.random() * 100,
    delay: Math.random() * 1.2,
    duration: 1.8 + Math.random() * 1.8,
    rotate: Math.random() * 720 - 360,
    color: CONFETTI_COLORS[id % CONFETTI_COLORS.length],
  }))
}

export interface RevealCardProps {
  caught: CatchView
  reduced: boolean
  sfx: PondSfx
  chainLevel: number
  chainPot: number
  onUseAsBait: (catchId: string) => Promise<boolean>
  onDismiss: () => void
}

export default function RevealCard({
  caught,
  reduced,
  sfx,
  chainLevel,
  chainPot,
  onUseAsBait,
  onDismiss,
}: RevealCardProps) {
  const focusRef = useModalFocus()
  useEffect(() => {
    const frame = requestAnimationFrame(() => focusRef.current?.focus({ preventScroll: true }))
    return () => cancelAnimationFrame(frame)
  }, [focusRef])
  const [settled, setSettled] = useState(false)
  const [chaining, setChaining] = useState(false)
  const settledRef = useRef(false)
  const dismissRef = useRef(onDismiss)
  dismissRef.current = onDismiss
  const species = SPECIES_BY_ID[caught.species]
  const variant = VARIANT_BY_ID[caught.variant]
  const art = assetUrl(species.art)
  const pearlCount = useCountUp(caught.pearls, reduced ? 200 : 1100, settled)
  const confetti = useMemo(() => (caught.tier === 'legendary' && !reduced ? makeConfetti() : []), [caught.tier, reduced])
  const offer = chainOffer(chainLevel, chainPot, caught.pearls)
  const canChain =
    !caught.guest &&
    settled &&
    (caught.tier === 'common' || caught.tier === 'uncommon') &&
    chainLevel < 2
  const wager = caught.wager
  const wagerWon = wager !== null && wager.won > 0
  const wagerScale = wager
    ? Math.max(1, Math.min(2.4, 1 + Math.log2(Math.max(1, wager.won / Math.max(1, wager.stake)))))
    : 1

  const settle = useCallback(() => {
    if (settledRef.current) return
    settledRef.current = true
    setSettled(true)
  }, [])

  const advance = useCallback(() => {
    if (!settledRef.current) {
      settle()
      return
    }
    dismissRef.current()
  }, [settle])

  useEffect(() => {
    const duration = reduced ? Math.min(1300, TIER_MS[caught.tier]) : TIER_MS[caught.tier]
    const timer = window.setTimeout(settle, duration)
    sfx.play(TIER_SFX[caught.tier])
    const extra = window.setTimeout(() => {
      if (caught.treasure) sfx.play('treasure')
      else if (caught.variant !== 'normal') sfx.play('coin')
    }, Math.min(900, duration / 2))
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      if (caught.tier === 'legendary') navigator.vibrate([40, 50, 80, 50, 220])
      else if (caught.tier === 'rare') navigator.vibrate([30, 40, 60])
      else if (caught.tier === 'uncommon') navigator.vibrate(30)
    }
    return () => {
      window.clearTimeout(timer)
      window.clearTimeout(extra)
    }
  }, [caught.tier, caught.treasure, caught.variant, reduced, settle, sfx])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.repeat || !['Enter', ' ', 'Escape'].includes(event.key)) return
      if (event.key !== 'Escape' && event.target instanceof Element && event.target.closest('button, a, input, summary')) return
      event.preventDefault()
      event.stopImmediatePropagation()
      advance()
    }
    window.addEventListener('keydown', onKey, { capture: true })
    return () => window.removeEventListener('keydown', onKey, { capture: true })
  }, [advance])

  const maskStyle: CSSProperties = {
    WebkitMaskImage: `url("${art}")`,
    maskImage: `url("${art}")`,
    WebkitMaskSize: 'contain',
    maskSize: 'contain',
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
    WebkitMaskPosition: 'center',
    maskPosition: 'center',
  }

  const treasure = treasureLabel(caught.treasure)
  const badges: string[] = []
  if (caught.isNewSpecies || caught.isNewVariant) badges.push('NEW!')
  if (caught.personalBest) badges.push('Personal best!')
  if (caught.trophy) badges.push('Trophy size')

  return (
    <div
      className={[
        'pond-reveal',
        `tier-${caught.tier}`,
        `variant-${caught.variant}`,
        settled ? 'is-settled' : '',
        reduced ? 'is-still' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      data-pond-ui
      ref={focusRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label={`Caught a ${variant.label === 'Normal' ? '' : `${variant.label} `}${species.name}`}
      onClick={(event) => {
        event.stopPropagation()
        advance()
      }}
    >
      <span className={`pond-reveal-flash is-${caught.tier}`} aria-hidden="true" />
      <span className="pond-reveal-dim" aria-hidden="true" />
      {caught.tier === 'legendary' ? (
        <>
          <span className="pond-reveal-beam" aria-hidden="true" />
          <img className="pond-reveal-leap" src={art} alt="" draggable={false} />
        </>
      ) : null}
      {confetti.map((piece) => (
        <span
          key={piece.id}
          className="pond-confetti"
          style={
            {
              left: `${piece.x}%`,
              background: piece.color,
              animationDelay: `${piece.delay}s`,
              animationDuration: `${piece.duration}s`,
              '--spin': `${piece.rotate}deg`,
            } as CSSProperties
          }
          aria-hidden="true"
        />
      ))}

      <div
        className={[
          'pond-reveal-card',
          `tier-${caught.tier}`,
          `variant-${caught.variant}`,
          settled ? 'is-settled' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <div className="pond-reveal-card-top">
          <span className={`pond-reveal-tier is-${caught.tier}`}>{TIER_LABEL[caught.tier]}</span>
          {canChain && settled ? null : <span className="pond-reveal-close-hint">{settled ? 'Tap to continue' : 'Tap to skip'}</span>}
        </div>

        {caught.tier === 'legendary' ? <span className="pond-reveal-stamp">LEGENDARY</span> : null}

        <div className="pond-reveal-fishwrap">
        <span className={`pond-reveal-rays is-${caught.tier}`} aria-hidden="true" />
        {caught.variant !== 'normal' ? <span className={`pond-reveal-aura is-${caught.variant}`} aria-hidden="true" /> : null}
        <div className={`pond-reveal-fish is-${caught.variant}`} style={maskStyle}>
          <img src={art} alt="" draggable={false} />
          {caught.variant !== 'normal' ? <span className={`pond-reveal-sheen is-${caught.variant}`} aria-hidden="true" /> : null}
          {caught.variant === 'shiny'
            ? Array.from({ length: 7 }, (_, index) => (
                <span
                  key={index}
                  className="pond-sparkle"
                  style={
                    {
                      left: `${14 + ((index * 17) % 72)}%`,
                      top: `${12 + ((index * 23) % 70)}%`,
                      animationDelay: `${index * 0.14}s`,
                    } as CSSProperties
                  }
                  aria-hidden="true"
                />
              ))
            : null}
        </div>
        </div>

        <div className="pond-reveal-title">
          <h2>{species.name}</h2>
          {variant.id !== 'normal' ? <span className={`pond-variant-label is-${variant.id}`}>{variant.label}</span> : null}
        </div>
        <p className="pond-reveal-size">
          {caught.sizeCm.toFixed(1)} cm
          {caught.trophy ? <span className="pond-trophy-crown" title="Trophy size">♛</span> : null}
        </p>

        {badges.length > 0 ? (
          <div className="pond-reveal-badges">
            {badges.map((badge) => (
              <span key={badge} className={badge === 'NEW!' ? 'pond-badge is-new' : 'pond-badge'}>
                {badge}
              </span>
            ))}
          </div>
        ) : null}

        <div className="pond-reveal-pearls" aria-live="polite">
          <span className="pond-pearl-icon" aria-hidden="true" />
          <strong>+{pearlCount}</strong>
          <span>pearls</span>
        </div>
        <details className="pond-reveal-breakdown" onClick={(event) => event.stopPropagation()}>
          <summary>How it adds up</summary>
          base {caught.breakdown.base} × size {caught.breakdown.size.toFixed(2)} × variant{' '}
          {caught.breakdown.variant} × streak {caught.breakdown.streak}
        </details>

        {wagerWon && wager ? (
          <div
            className="pond-wager-burst"
            style={{ '--wager-scale': wagerScale } as CSSProperties}
            aria-live="polite"
          >
            <span className="pond-wager-burst-coins" aria-hidden="true">
              {Array.from({ length: 7 }, (_, index) => (
                <span key={index} style={{ '--coin-index': index } as CSSProperties} />
              ))}
            </span>
            <strong>+{wager.won} pearls!</strong>
            <span>Call landed</span>
          </div>
        ) : null}
        {caught.chainPaid !== null && caught.chainPaid > 0 ? (
          <div className="pond-chain-burst" aria-live="polite">
            <strong>+{caught.chainPaid} chain bonus!</strong>
            <span>The bait paid off</span>
          </div>
        ) : null}
        {wager && wager.won === 0 ? <p className="pond-reveal-extra is-missed">{missWagerLabel(wager.stake)}</p> : null}

        {treasure ? (
          <p className="pond-reveal-extra is-treasure">
            <span aria-hidden="true">🧰</span> Treasure: {treasure}
          </p>
        ) : null}
        {caught.trophyCollected ? (
          <p className="pond-reveal-room">New for your room: {species.name} trophy</p>
        ) : null}
        {caught.guest ? <p className="pond-reveal-guest">Guest catch — pearls and trophies are kept for members.</p> : null}

        {canChain ? (
          <div className="pond-reveal-actions">
            <p className="pond-chain-line">{offer.line}</p>
            <div className="pond-reveal-action-row">
              <button
                type="button"
                className="pond-reveal-button is-bank"
                onClick={(event) => {
                  event.stopPropagation()
                  onDismiss()
                }}
              >
                Bank it
              </button>
              <button
                type="button"
                className="pond-reveal-button is-bait"
                disabled={chaining}
                onClick={async (event) => {
                  event.stopPropagation()
                  if (chaining) return
                  setChaining(true)
                  const ok = await onUseAsBait(caught.id)
                  if (!ok) setChaining(false)
                }}
              >
                {chaining ? 'Hooking it up…' : 'Use as live bait'}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
