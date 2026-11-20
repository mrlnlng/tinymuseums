'use client'

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import manifest from '@/generated/asset-manifest.json'
import { builtUrl } from '@/shared/lib/assets'
import { CONFIG } from '../scene/config'
import { CHARACTER_NAMES } from '../scene/atelier'
import { kindAt, MIRROR_KINDS, settle } from '../scene/mirror'
import { trapTab } from './dialog-keys'
import { snapshotLook } from '../scene/reflection'
import type { CharacterKind } from '../scene/rig'

const MIRROR_SRC = builtUrl(manifest.atelier.mirror.src)
const { glass, gems } = CONFIG.atelier.mirror
const HINT_KEY = 'tm:atelier:mirror-hint'
/** A reflection's width, and how far apart they stand, as fractions of the glass. */
const SLIDE = 0.7
const STEP = 0.66

interface Props {
  kind: CharacterKind
  costume: string | null
  bow: string | null
  kept: (kind: CharacterKind) => boolean
  onBecome: (kind: CharacterKind) => void
  onClose: () => void
}

/** The mirror, close up: one character at a time in the glass, the next ones peeking in at its edges. */
export default function MirrorView({ kind, costume, bow, kept, onBecome, onClose }: Props) {
  const [position, setPosition] = useState(() => MIRROR_KINDS.indexOf(kind))
  const [drag, setDrag] = useState(0)
  const [images, setImages] = useState<Partial<Record<CharacterKind, string>>>({})
  const [hint] = useState(() => {
    try {
      if (window.sessionStorage.getItem(HINT_KEY)) return false
      window.sessionStorage.setItem(HINT_KEY, '1')
    } catch {}
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })
  const glassRef = useRef<HTMLDivElement>(null)
  const centre = useRef<HTMLButtonElement>(null)
  const pointer = useRef<{ id: number; x: number; t: number; moved: boolean } | null>(null)
  // A swipe ends in a click on whatever is under the finger; that click must not choose.
  const swiped = useRef(false)
  const current = kindAt(position)

  useEffect(() => {
    let alive = true
    // The visitor's own reflection first, then the rest in swipe order.
    const order = [...MIRROR_KINDS].sort((a, b) => Number(b === kind) - Number(a === kind))
    for (const k of order) {
      void snapshotLook({ kind: k, costume, bow }).then((canvas) => {
        if (alive) setImages((all) => ({ ...all, [k]: canvas.toDataURL() }))
      }).catch((error) => console.warn('[atelier] Could not draw a reflection', error))
    }
    return () => { alive = false }
  }, [kind, costume, bow])

  useEffect(() => { centre.current?.focus({ preventScroll: true }) }, [position])

  function move(by: number): void {
    setDrag(0)
    setPosition((p) => p + by)
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key === 'Escape') { event.preventDefault(); onClose() }
    else if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1) }
    else if (event.key === 'ArrowRight') { event.preventDefault(); move(1) }
    else trapTab(event)
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>): void {
    // Leave the screen's edges to the phone's own back swipe.
    if (event.clientX < 20 || event.clientX > window.innerWidth - 20) return
    pointer.current = { id: event.pointerId, x: event.clientX, t: event.timeStamp, moved: false }
    swiped.current = false
  }
  function onPointerMove(event: PointerEvent<HTMLDivElement>): void {
    const p = pointer.current
    if (!p || p.id !== event.pointerId) return
    const dx = event.clientX - p.x
    if (!p.moved && Math.abs(dx) > 6) {
      p.moved = true
      // Captured only once it is a swipe, so a plain tap still lands on the reflection.
      event.currentTarget.setPointerCapture(event.pointerId)
    }
    if (p.moved) setDrag(dx)
  }
  function onPointerUp(event: PointerEvent<HTMLDivElement>): void {
    const p = pointer.current
    if (!p || p.id !== event.pointerId) return
    pointer.current = null
    const width = (glassRef.current?.clientWidth ?? 1) * STEP
    const dx = event.clientX - p.x
    if (!p.moved) {
      setDrag(0)
      return
    }
    swiped.current = true
    const velocity = dx / Math.max(1, event.timeStamp - p.t)
    setPosition((at) => settle(at, dx, width, velocity))
    setDrag(0)
  }

  const slides = [-2, -1, 0, 1, 2].map((offset) => position + offset)
  return (
    <div
      className="mirror-view"
      role="dialog"
      aria-modal="true"
      aria-label="The mirror"
      onKeyDown={onKeyDown}
      onClick={(event) => { if (event.target === event.currentTarget) onClose() }}
    >
      <button type="button" className="mirror-view-close" aria-label="Close the mirror" onClick={onClose}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
      </button>
      <button type="button" className="mirror-view-turn is-back" aria-label="Previous character" onClick={() => move(-1)}>
        <svg viewBox="0 0 16 24" aria-hidden="true"><path d="M12 3 3 12l9 9" /></svg>
      </button>
      <div className="mirror-view-frame">
        <img src={MIRROR_SRC} alt="" draggable={false} />
        <div className="mirror-view-gems" style={{ top: `${gems.y * 100}%`, width: `${gems.width * 100}%` }} aria-hidden="true">
          {MIRROR_KINDS.map((k) => (
            <span key={k} className={`mirror-view-gem${k === current ? ' is-lit' : ''}${kept(k) ? ' is-kept' : ''}`} />
          ))}
        </div>
        <div
          className={`mirror-view-glass${drag !== 0 ? ' is-dragging' : ''}`}
          ref={glassRef}
          style={{
            left: `${glass.left * 100}%`,
            right: `${(1 - glass.right) * 100}%`,
            top: `${glass.top * 100}%`,
            bottom: `${(1 - glass.bottom) * 100}%`,
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {slides.map((at) => {
            const k = kindAt(at)
            const offset = at - position
            const here = offset === 0
            return (
              <button
                key={at}
                type="button"
                ref={here ? centre : undefined}
                tabIndex={here ? 0 : -1}
                aria-hidden={!here}
                className={`mirror-view-reflection${here ? ' is-here' : ''}`}
                aria-label={`Become ${CHARACTER_NAMES[k]}`}
                style={{
                  width: `${SLIDE * 100}%`,
                  left: `${(1 - SLIDE) * 50}%`,
                  transform: `translateX(calc(${offset * (STEP / SLIDE) * 100}% + ${drag}px))`,
                }}
                onClick={() => {
                  if (swiped.current) { swiped.current = false; return }
                  if (here) onBecome(k)
                }}
              >
                {images[k] ? <img src={images[k]} alt="" draggable={false} /> : <span className="mirror-view-mist" />}
              </button>
            )
          })}
          {hint ? <span className="mirror-view-hand" aria-hidden="true" /> : null}
        </div>
      </div>
      <button type="button" className="mirror-view-turn" aria-label="Next character" onClick={() => move(1)}>
        <svg viewBox="0 0 16 24" aria-hidden="true"><path d="M4 3l9 9-9 9" /></svg>
      </button>
    </div>
  )
}
