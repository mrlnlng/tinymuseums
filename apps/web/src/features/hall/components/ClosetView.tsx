'use client'

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { itemIdFor, priceOf } from '@tiny/core/economy'
import manifest from '@/generated/asset-manifest.json'
import Stamp from '@/features/economy/components/Stamp'
import { useSound } from '@/features/sound/components/SoundProvider'
import { reportQuestEvent } from '@/features/letters/events'
import { builtUrl } from '@/shared/lib/assets'
import { keepName } from '../scene/atelier'
import { choiceAt, HEADPIECES, OUTFITS, positionOf } from '../scene/closet'
import { isWorn, layerOf, putOn, settleClash, type Layer, type Layers } from '../scene/layers'
import { settle } from '../scene/mirror'
import { pieceUrl } from '../scene/piece-art'
import type { CharacterKind, Rig } from '../scene/rig'
import { createRigState, stepRigState } from '../scene/rig-motion'
import { trapTab } from './dialog-keys'

const PODIUM_SRC = builtUrl(manifest.atelier.platformBlue.src)
const SPOTLIGHT_SRC = builtUrl(manifest.atelier.spotlight.src)

type Slot = 'costume' | 'bow'
const LISTS: Record<Slot, readonly (string | null)[]> = { costume: OUTFITS, bow: HEADPIECES }
const PLACE: Record<Slot, string> = { costume: 'outfit', bow: 'headpiece' }
/** How far apart the wheel's choices stand, in pixels along its arc. */
const SPACING = 92

interface Props {
  kind: CharacterKind
  costume: string | null
  top: string | null
  bow: string | null
  kept: (itemId: string) => boolean
  onDone: (layers: Layers, bow: string | null) => void
  onClose: () => void
}

/**
 * The closet: the visitor on a podium under a spotlight, wearing whatever is chosen, over a wheel
 * of every outfit or headpiece. Clothes stack: turning a dress to the middle puts it on in place
 * of the last, while the cardigan goes on over it only when tapped, so browsing past it changes
 * nothing. Every worn piece wears a tick; tapping the worn piece in the middle takes it off, and
 * tapping the empty circle takes everything off. A price shows under the middle piece while unkept.
 */
export default function ClosetView({ kind, costume, top, bow, kept, onDone, onClose }: Props) {
  const { play } = useSound()
  const [slot, setSlot] = useState<Slot>('costume')
  const [position, setPosition] = useState({ costume: positionOf(OUTFITS, costume ?? top), bow: positionOf(HEADPIECES, bow) })
  // What is wished on each layer, and which was chosen last; settleClash decides what is worn.
  const [wish, setWish] = useState<Layers & { last: Layer }>({ costume, top, last: 'top' })
  const worn = settleClash(wish, wish.last)
  const [loaded, setLoaded] = useState(false)
  const stage = useRef<HTMLDivElement>(null)
  const rigRef = useRef<Rig | null>(null)
  const done = useRef<HTMLButtonElement>(null)
  const draft = { costume: worn.costume, top: worn.top, bow: choiceAt(HEADPIECES, position.bow) }

  // The visitor, alive on the podium: one rig, redressed as the wheel turns.
  useEffect(() => {
    const canvas = document.createElement('canvas')
    canvas.className = 'closet-figure'
    stage.current?.append(canvas)
    let disposed = false
    let frame = 0
    // Read on resize only: clientHeight in the draw loop forced a layout every frame.
    let stageHeight = stage.current?.clientHeight ?? 300
    const resized = new ResizeObserver(() => { stageHeight = stage.current?.clientHeight ?? stageHeight })
    if (stage.current) resized.observe(stage.current)
    void import('../scene/rig').then(({ loadRig }) => loadRig(canvas, kind)).then((rig) => {
      if (disposed) { rig.dispose(); return }
      rigRef.current = rig
      rig.setCostume(draft.costume, draft.bow, draft.top)
      setLoaded(true)
      const motion = createRigState()
      let previous = performance.now()
      const draw = (now: number) => {
        frame = requestAnimationFrame(draw)
        const dt = Math.min(0.05, (now - previous) / 1000)
        previous = now
        stepRigState(motion, dt, false, 'right', 0, rig.cycleSeconds)
        // The figure stands most of the stage tall, its feet on the podium.
        const canvasHeight = stageHeight * 0.74 * rig.spriteScale
        const size = `${canvasHeight.toFixed(1)}px`
        if (canvas.style.height !== size) {
          canvas.style.height = size
          canvas.style.bottom = `calc(var(--podium-top) - ${((1 - rig.feet) * canvasHeight).toFixed(1)}px)`
        }
        rig.render(motion, dt, canvasHeight, window.devicePixelRatio)
      }
      frame = requestAnimationFrame(draw)
    }).catch((error) => console.warn('[atelier] The closet could not show the visitor', error))
    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      resized.disconnect()
      rigRef.current?.dispose()
      rigRef.current = null
      canvas.remove()
    }
    // The rig is built once; the wheel redresses it below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind])

  useEffect(() => { rigRef.current?.setCostume(draft.costume, draft.bow, draft.top) }, [draft.costume, draft.bow, draft.top])
  useEffect(() => { done.current?.focus({ preventScroll: true }) }, [])

  // Landing on a dress (or the empty circle) sets the dress layer. A top goes on only when tapped.
  function wearAt(at: number, tapped: boolean): void {
    const id = choiceAt(OUTFITS, at)
    if (id !== null && layerOf(id) === 'top') {
      if (tapped) setWish((w) => ({ ...w, top: id, last: 'top' }))
      return
    }
    setWish((w) => ({ ...w, costume: id, last: 'costume' }))
  }

  const turn = (by: number, tapped = false) => {
    play('select')
    if (slot === 'costume') wearAt(position.costume + by, tapped)
    setPosition((p) => ({ ...p, [slot]: p[slot] + by }))
  }

  // The middle piece tapped: a worn one comes off, an unworn top goes on, the empty circle clears all.
  function tapMiddle(): void {
    if (slot !== 'costume') return
    const id = choiceAt(OUTFITS, position.costume)
    play('select')
    if (id === null) { setWish({ costume: null, top: null, last: 'costume' }); return }
    const place = layerOf(id)
    setWish((w) => (isWorn(worn, id) ? { ...w, [place]: null } : { ...w, [place]: id, last: place }))
  }

  function shuffle(): void {
    const pick = (list: readonly (string | null)[]) => list[Math.floor(Math.random() * list.length)]
    const dresses = OUTFITS.filter((id): id is string => id !== null && layerOf(id) === 'costume')
    const tops = OUTFITS.filter((id): id is string => id !== null && layerOf(id) === 'top')
    play('select')
    // A dress, and half the time a top over it.
    const dress = pick(dresses)!
    const next = Math.random() < 0.5 && tops.length > 0 ? putOn(putOn({ costume: null, top: null }, dress), pick(tops)!) : putOn({ costume: null, top: null }, dress)
    setWish({ ...next, last: next.top === null ? 'costume' : 'top' })
    setPosition((p) => ({
      costume: p.costume - (((p.costume % OUTFITS.length) + OUTFITS.length) % OUTFITS.length) + OUTFITS.indexOf(next.costume) + OUTFITS.length,
      bow: p.bow + 1 + Math.floor(Math.random() * (HEADPIECES.length - 1)),
    }))
  }

  function close(): void {
    play('close')
    onClose()
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key === 'Escape') { event.preventDefault(); close() }
    else if (event.key === 'ArrowLeft') { event.preventDefault(); turn(-1) }
    else if (event.key === 'ArrowRight') { event.preventDefault(); turn(1) }
    else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault()
      play('select')
      setSlot((s) => (s === 'costume' ? 'bow' : 'costume'))
    }
    else trapTab(event)
  }

  const chosen = slot === 'costume' ? choiceAt(OUTFITS, position.costume) : draft.bow
  const chosenId = chosen === null ? null : itemIdFor(slot, chosen)
  const price = chosenId === null || kept(chosenId) ? null : priceOf(chosenId)

  return (
    <div
      className="closet-view"
      role="dialog"
      aria-modal="true"
      aria-label="The closet"
      onKeyDown={onKeyDown}
      onClick={(event) => { if (event.target === event.currentTarget) close() }}
    >
      <button type="button" className="mirror-view-close" aria-label="Put everything back" onClick={close}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
      </button>

      <div className={`closet-stage${loaded ? '' : ' is-loading'}`} ref={stage}>
        <img className="closet-spotlight" src={SPOTLIGHT_SRC} alt="" draggable={false} />
        <img className="closet-podium" src={PODIUM_SRC} alt="" draggable={false} />
        <span className="closet-pop" key={`${draft.costume}|${draft.top}|${draft.bow}`} aria-hidden="true" />
      </div>

      <div className="closet-tabs" role="tablist" aria-label="What to change">
        {(['costume', 'bow'] as const).map((s) => (
          <button
            key={s}
            type="button"
            role="tab"
            aria-selected={slot === s}
            aria-label={`${PLACE[s][0].toUpperCase()}${PLACE[s].slice(1)}s`}
            className={`closet-tab${slot === s ? ' is-on' : ''}`}
            onClick={() => {
              if (slot !== s) play('select')
              setSlot(s)
            }}
          >
            {s === 'costume' ? (
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5.5a1.8 1.8 0 1 1 1.8 1.8c-.9 0-1.8.6-1.8 1.5v.7M12 9.5 3 16.5h18z" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12 5 8v8zM12 12l7-4v8zM10.5 12a1.5 1.5 0 1 0 3 0 1.5 1.5 0 1 0-3 0" /></svg>
            )}
          </button>
        ))}
      </div>

      <Wheel
        key={slot}
        slot={slot}
        position={position[slot]}
        kept={kept}
        worn={(id) => (slot === 'costume' ? isWorn(worn, id) : id !== null && id === draft.bow)}
        onTurn={turn}
        onTapMiddle={tapMiddle}
      />

      <div className="closet-price" aria-hidden="true">
        {price !== null ? (
          <span className="keep-stamp-price" key={chosenId}>
            <Stamp className="keep-stamp-glyph" />
            {price}
          </span>
        ) : null}
      </div>

      <div className="closet-actions">
        <button type="button" className="closet-round" aria-label="Surprise me" onClick={shuffle}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="4" y="4" width="16" height="16" rx="3.5" />
            <circle cx="8.5" cy="8.5" r="1.3" className="pip" /><circle cx="15.5" cy="15.5" r="1.3" className="pip" />
            <circle cx="12" cy="12" r="1.3" className="pip" /><circle cx="15.5" cy="8.5" r="1.3" className="pip" />
            <circle cx="8.5" cy="15.5" r="1.3" className="pip" />
          </svg>
        </button>
        <button type="button" className="closet-done" ref={done} aria-label="Wear this" onClick={() => { play('close'); reportQuestEvent('change-outfit'); onDone(worn, draft.bow) }}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
        </button>
      </div>
    </div>
  )
}

interface WheelProps {
  slot: Slot
  position: number
  kept: (itemId: string) => boolean
  worn: (id: string | null) => boolean
  /** `tapped` when a bubble beside the middle was tapped, which also puts a top on. */
  onTurn: (by: number, tapped?: boolean) => void
  onTapMiddle: () => void
}

/**
 * A curved wheel of choices. Swipe it, or tap a choice beside the middle to turn to it; tap the
 * middle one to take it off. Every piece being worn carries a tick.
 */
function Wheel({ slot, position, kept, worn, onTurn, onTapMiddle }: WheelProps) {
  const [drag, setDrag] = useState(0)
  const pointer = useRef<{ id: number; x: number; t: number; moved: boolean } | null>(null)
  const swiped = useRef(false)
  const list = LISTS[slot]
  const shift = drag / SPACING

  function onPointerDown(event: PointerEvent<HTMLDivElement>): void {
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
      event.currentTarget.setPointerCapture(event.pointerId)
    }
    if (p.moved) setDrag(dx)
  }
  function onPointerUp(event: PointerEvent<HTMLDivElement>): void {
    const p = pointer.current
    pointer.current = null
    if (!p || p.id !== event.pointerId || !p.moved) return
    swiped.current = true
    const dx = event.clientX - p.x
    // A long drag turns as many places as it crossed; a short one or a flick turns one.
    const steps = Math.round(-dx / SPACING)
    const by = steps !== 0 ? steps : settle(0, dx, SPACING, dx / Math.max(1, event.timeStamp - p.t))
    setDrag(0)
    if (by !== 0) onTurn(by)
  }

  return (
    <div
      className={`closet-wheel${drag !== 0 ? ' is-dragging' : ''}`}
      role="listbox"
      aria-label={`${PLACE[slot]}s`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {[-3, -2, -1, 0, 1, 2, 3].map((offset) => {
        const at = position + offset
        const id = choiceAt(list, at)
        const itemId = id === null ? null : itemIdFor(slot, id)
        const owned = itemId !== null && kept(itemId)
        const picture = id === null ? null : pieceUrl(slot, id)
        // Along the arc: further from the middle, lower, smaller and fainter.
        const t = offset + shift
        const angle = t * 0.5
        const here = offset === 0
        const wearing = worn(id)
        const name = id === null ? `No ${PLACE[slot]}` : `${keepName({ slot, id })}${wearing ? ', wearing' : ''}`
        return (
          <button
            key={at}
            type="button"
            role="option"
            aria-selected={here}
            aria-pressed={wearing}
            tabIndex={here ? 0 : -1}
            aria-label={name}
            className={`closet-bubble${here ? ' is-here' : ''}${wearing ? ' is-worn' : ''}`}
            style={{
              transform: `translate(-50%, -50%) translate(${(Math.sin(angle) * SPACING * 2).toFixed(1)}px, ${((1 - Math.cos(angle)) * 70).toFixed(1)}px) scale(${Math.max(0.45, 1 - Math.abs(t) * 0.24).toFixed(3)})`,
              opacity: Math.max(0, 1 - Math.max(0, Math.abs(t) - 1.4) * 0.6),
              zIndex: 10 - Math.round(Math.abs(t) * 2),
            }}
            onClick={() => {
              if (swiped.current) { swiped.current = false; return }
              if (!here) onTurn(offset, true)
              else onTapMiddle()
            }}
          >
            {picture ? <img src={picture} alt="" draggable={false} /> : <span className="closet-none" />}
            {owned ? <span className="closet-seal" /> : null}
            {wearing ? (
              <span className="closet-worn" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M5.5 12.5l4 4L18.5 7.5" /></svg>
              </span>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}
