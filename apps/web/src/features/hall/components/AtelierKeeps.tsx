'use client'

import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { outfit } from '@tiny/core/slots'
import { openAccount } from '@/features/account/lib/account'
import { buy, useWallet } from '@/features/economy'
import Stamp from '@/features/economy/components/Stamp'
import { stampLabel } from '@/features/economy/lib/stamp'
import { useSlot } from '@/shared/lib/slots'
import { CHARACTER_NAMES, keepName } from '../scene/atelier'
import { keepStamps, type KeepStamp } from '../scene/keep-stamps'
import { pieceUrl } from '../scene/piece-art'
import { lookOf } from '../scene/wardrobe'

const HOLD_MS = 900
const HINT_KEY = 'tm:atelier:keep-hint'

const pictureOf = (stamp: KeepStamp) => pieceUrl(stamp.part, stamp.id)
const nameOf = (stamp: KeepStamp) =>
  stamp.part === 'character' ? CHARACTER_NAMES[stamp.id as keyof typeof CHARACTER_NAMES] : keepName({ slot: stamp.part, id: stamp.id }).toLowerCase()

function labelOf(stamp: KeepStamp, balance: number): string {
  const name = nameOf(stamp)
  if (stamp.state === 'locked') return `Keep ${name}: join to keep things`
  if (stamp.state === 'short') return `Keep ${name}, ${stamp.price - balance} more stamps needed`
  return `Keep ${name}, ${stampLabel(stamp.price)}, press and hold`
}

/**
 * A keep stamp beside the visitor for each thing they wear but haven't kept. Pressing and holding
 * one fills its ring while the purse counts the price down; letting go early keeps nothing.
 */
export default function AtelierKeeps() {
  const wallet = useWallet()
  const [outfitDoc] = useSlot(outfit)
  const [justKept, setJustKept] = useState<KeepStamp | null>(null)
  const live = keepStamps(lookOf(outfitDoc), wallet)
  // A stamp just kept stays a moment longer, so its thunk is seen before it goes.
  const stamps = justKept && !live.some((s) => s.itemId === justKept.itemId) ? [...live, justKept] : live
  const balance = wallet.balance ?? 0
  const [hold, setHold] = useState<{ itemId: string; start: number } | null>(null)
  const [fill, setFill] = useState(0)
  const [busy, setBusy] = useState<string | null>(null)
  const [cue, setCue] = useState<{ itemId: string; kind: 'nudge' | 'shake' | 'kept' } | null>(null)
  const [purseShake, setPurseShake] = useState(0)
  const [hint, setHint] = useState(false)
  const follow = useRef<HTMLDivElement>(null)
  const any = stamps.length > 0

  // The stamps stand beside the visitor, on whichever side has room.
  useEffect(() => {
    if (!any) return
    let frame = 0
    const step = () => {
      frame = requestAnimationFrame(step)
      const node = follow.current
      const parent = node?.offsetParent as HTMLElement | null
      const figure = document.querySelector<HTMLElement>('.hall-bunny-rig:not([hidden]), .hall-bunny:not([hidden])')
      if (!node || !parent || !figure) return
      const at = figure.getBoundingClientRect()
      const origin = parent.getBoundingClientRect()
      const right = at.right - origin.left + 4
      const flip = right + node.offsetWidth > origin.width - 8
      const x = flip ? at.left - origin.left - node.offsetWidth - 4 : right
      const y = Math.max(8, at.top - origin.top + at.height * 0.15)
      node.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`
    }
    step()
    return () => cancelAnimationFrame(frame)
  }, [any])

  useEffect(() => {
    if (!any) return
    try {
      if (window.sessionStorage.getItem(HINT_KEY)) return
      window.sessionStorage.setItem(HINT_KEY, '1')
    } catch {}
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) setHint(true)
  }, [any])

  useEffect(() => {
    if (!hold) return
    let frame = 0
    const step = (now: number) => {
      const p = Math.min(1, (now - hold.start) / HOLD_MS)
      setFill(p)
      if (p >= 1) {
        setHold(null)
        void keep(hold.itemId)
        return
      }
      frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hold])

  function flash(itemId: string, kind: 'nudge' | 'shake' | 'kept'): void {
    setCue({ itemId, kind })
    window.setTimeout(() => setCue((c) => (c?.itemId === itemId && c.kind === kind ? null : c)), kind === 'kept' ? 700 : 450)
  }

  async function keep(itemId: string): Promise<void> {
    const stamp = stamps.find((s) => s.itemId === itemId)
    setBusy(itemId)
    const result = await buy(itemId)
    setBusy(null)
    setFill(0)
    if (result === 'ok') {
      if (stamp) {
        setJustKept({ ...stamp, progress: 1 })
        window.setTimeout(() => setJustKept((k) => (k?.itemId === itemId ? null : k)), 700)
      }
      flash(itemId, 'kept')
    }
    else if (result === 'insufficient') { setPurseShake((n) => n + 1); flash(itemId, 'shake') }
    else flash(itemId, 'shake')
  }

  function press(stamp: KeepStamp): void {
    setHint(false)
    if (busy) return
    if (stamp.state === 'locked') { openAccount(); return }
    if (stamp.state === 'short') { setPurseShake((n) => n + 1); flash(stamp.itemId, 'shake'); return }
    setHold({ itemId: stamp.itemId, start: performance.now() })
  }

  function release(stamp: KeepStamp): void {
    if (hold?.itemId !== stamp.itemId) return
    setHold(null)
    setFill(0)
    flash(stamp.itemId, 'nudge')
  }

  function onKey(event: KeyboardEvent<HTMLButtonElement>, stamp: KeepStamp): void {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    if (event.repeat) return
    // A key press is deliberate, so it keeps at once.
    if (stamp.state === 'ready' && !busy) void keep(stamp.itemId)
    else press(stamp)
  }

  const holding = hold ? stamps.find((s) => s.itemId === hold.itemId) : undefined
  const shown = holding ? Math.round(balance - holding.price * fill) : balance

  return (
    <>
      {wallet.isMember && wallet.balance !== null ? (
        <p key={purseShake} className={`atelier-purse${purseShake ? ' is-shaking' : ''}`} aria-label={stampLabel(shown)}>
          <Stamp className="atelier-purse-stamp" />
          <span>{shown}</span>
        </p>
      ) : null}
      {any ? (
        <div className="keep-stamps" ref={follow} role="group" aria-label="Keep what you are wearing">
          {stamps.map((stamp, i) => {
            const picture = pictureOf(stamp)
            const ring = hold?.itemId === stamp.itemId ? stamp.progress + (1 - stamp.progress) * fill : stamp.progress
            const flashing = cue?.itemId === stamp.itemId ? ` is-${cue.kind}` : ''
            return (
              <button
                key={stamp.itemId}
                type="button"
                className={`keep-stamp is-${stamp.state}${hold?.itemId === stamp.itemId ? ' is-holding' : ''}${flashing}`}
                aria-label={labelOf(stamp, balance)}
                aria-busy={busy === stamp.itemId}
                onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); press(stamp) }}
                onPointerUp={() => release(stamp)}
                onPointerCancel={() => release(stamp)}
                onKeyDown={(event) => onKey(event, stamp)}
                onContextMenu={(event) => event.preventDefault()}
              >
                <span className="keep-stamp-face">
                  <svg className="keep-stamp-ring" viewBox="0 0 48 48" aria-hidden="true">
                    <circle cx="24" cy="24" r="21" pathLength="1" className="keep-stamp-track" />
                    <circle cx="24" cy="24" r="21" pathLength="1" className="keep-stamp-fill" style={{ strokeDashoffset: 1 - ring }} />
                  </svg>
                  {picture ? <img src={picture} alt="" draggable={false} /> : null}
                  {stamp.state === 'locked' ? (
                    <svg className="keep-stamp-lock" viewBox="0 0 24 24" aria-hidden="true">
                      <rect x="5" y="10.5" width="14" height="10" rx="2.5" />
                      <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
                    </svg>
                  ) : null}
                  {hint && i === 0 ? <span className="keep-stamp-hint" aria-hidden="true" /> : null}
                </span>
                <span className="keep-stamp-price" aria-hidden="true">
                  <Stamp className="keep-stamp-glyph" />
                  {stamp.price}
                </span>
              </button>
            )
          })}
        </div>
      ) : null}
      <span className="sr-only" role="status" aria-live="polite">
        {cue?.kind === 'kept' ? 'Kept' : ''}
      </span>
    </>
  )
}
