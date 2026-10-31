'use client'

import { useEffect, useRef, useState } from 'react'
import { EMOTES } from '@tiny/core/presence/wire'
import { EMOTE_LABELS, EMOTE_NAMES, isInRoom, onInRoomChange, requestEmote } from '../lib/emote-events'

/** Shown only while this page shares a room, so there is someone who could see it. */
export default function EmoteButton() {
  const [inRoom, setInRoom] = useState(false)
  const [open, setOpen] = useState(false)
  const control = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setInRoom(isInRoom())
    return onInRoomChange(() => setInRoom(isInRoom()))
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    const onPointer = (event: PointerEvent) => {
      if (!control.current?.contains(event.target as Node)) setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onPointer)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onPointer)
    }
  }, [open])

  if (!inRoom) return null
  return (
    <div className="emote-control" ref={control}>
      <button
        type="button"
        className="chrome-button emote-toggle"
        onClick={() => setOpen(!open)}
        aria-label="Wave to other visitors"
        aria-expanded={open}
        title="Wave to other visitors"
      >
        <svg viewBox="0 0 75 75" aria-hidden="true">
          <mask id="emote-toggle-cutout">
            <rect width="75" height="75" fill="white" />
            <path d="M37.5,56 C24,46 17,38.5 17,30 A10.5,10.5 0 0 1 37.5,25 A10.5,10.5 0 0 1 58,30 C58,38.5 51,46 37.5,56z" fill="black" />
          </mask>
          <circle cx="37.5" cy="37.5" r="37.5" mask="url(#emote-toggle-cutout)" />
        </svg>
      </button>
      {open ? (
        <div className="emote-fan" role="group" aria-label="Emotes">
          {EMOTES.map((e, i) => (
            <button
              key={e}
              type="button"
              className="emote-choice"
              aria-label={EMOTE_NAMES[e]}
              title={`${EMOTE_NAMES[e]} (${i + 1})`}
              onClick={() => {
                requestEmote(e)
                setOpen(false)
              }}
            >
              {EMOTE_LABELS[e]}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
