'use client'

import { useEffect, useRef, useState } from 'react'
import { useEscapeKey } from '@/shared/hooks/useEscapeKey'
import { MESSAGE_MAX } from '@tiny/core/presence/messages'
import {
  getPeople,
  isInRoom,
  isMuted,
  onInRoomChange,
  onMutedChange,
  onOpenChat,
  onPeopleChange,
  onSayResult,
  requestSay,
  setMuted,
  type SayResult,
} from '../lib/room-events'

const REFUSED: Record<Exclude<SayResult, { ok: true }>['reason'], string> = {
  empty: 'Type something first.',
  long: `Keep it to ${MESSAGE_MAX} characters.`,
  contact: "Messages can't include links, emails or phone numbers.",
  blocked: "That message isn't allowed.",
  'too-soon': 'One moment — that was quick.',
  closed: "There's nobody here to hear it right now.",
}

/** Shown only while this page shares a room, so there is someone who could read it. */
export default function ChatButton() {
  const [inRoom, setInRoom] = useState(false)
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')
  const [note, setNote] = useState<string | null>(null)
  const [people, setPeople] = useState(getPeople)
  const [, setMutes] = useState(0)
  const control = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setInRoom(isInRoom())
    const stops = [
      onInRoomChange(() => {
        setInRoom(isInRoom())
        if (!isInRoom()) setOpen(false)
      }),
      onPeopleChange(() => setPeople(getPeople())),
      onMutedChange(() => setMutes((n) => n + 1)),
      onOpenChat(() => {
        if (isInRoom()) setOpen(true)
      }),
      onSayResult((result) => {
        if (result.ok) {
          setText('')
          setNote(null)
          setOpen(false)
        } else {
          setNote(REFUSED[result.reason])
        }
      }),
    ]
    return () => stops.forEach((stop) => stop())
  }, [])

  useEffect(() => {
    if (!open) return
    input.current?.focus()
    const onPointer = (event: PointerEvent) => {
      if (!control.current?.contains(event.target as Node)) setOpen(false)
    }
    window.addEventListener('pointerdown', onPointer)
    return () => {
      window.removeEventListener('pointerdown', onPointer)
    }
  }, [open])

  useEscapeKey(() => setOpen(false), open)

  if (!inRoom) return null
  return (
    <div className="chat-control" ref={control}>
      <button
        type="button"
        className="chrome-button chat-toggle"
        onClick={() => {
          setOpen(!open)
          setNote(null)
        }}
        aria-label="Say something to other visitors"
        aria-expanded={open}
        title="Say something"
      >
        <svg viewBox="0 0 75 75" aria-hidden="true">
          <mask id="chat-toggle-cutout">
            <rect width="75" height="75" fill="white" />
            <path d="M17,18 H42 A7,7 0 0 1 49,25 V35 A7,7 0 0 1 42,42 H28 L20,49 L21,42 H17 A7,7 0 0 1 10,35 V25 A7,7 0 0 1 17,18z" fill="black" />
            <path d="M34,32 H58 A7,7 0 0 1 65,39 V48 A7,7 0 0 1 58,55 H56 L57,62 L49,55 H34 A7,7 0 0 1 27,48 V39 A7,7 0 0 1 34,32z" fill="black" stroke="white" strokeWidth="3.5" />
          </mask>
          <circle cx="37.5" cy="37.5" r="37.5" mask="url(#chat-toggle-cutout)" />
        </svg>
      </button>
      {open ? (
        <div className="chat-panel">
          <form
            className="chat-form"
            onSubmit={(event) => {
              event.preventDefault()
              requestSay(text)
            }}
          >
            <input
              ref={input}
              className="chat-input"
              value={text}
              onChange={(event) => {
                setText(event.target.value)
                setNote(null)
              }}
              maxLength={MESSAGE_MAX}
              placeholder="Say something…"
              aria-label="Say something to other visitors"
              enterKeyHint="send"
              autoComplete="off"
            />
            <button type="submit" className="chat-send">
              Send
            </button>
          </form>
          <p className="chat-note" role="status" hidden={note === null}>
            {note}
          </p>
          {people.length > 0 ? (
            <ul className="chat-people" aria-label="Here with you">
              {people.map((person) => (
                <li key={person.pid}>
                  <span>{person.name}</span>
                  <button
                    type="button"
                    className="chat-mute"
                    aria-pressed={isMuted(person.pid)}
                    onClick={() => setMuted(person.pid, !isMuted(person.pid))}
                  >
                    {isMuted(person.pid) ? 'Unmute' : 'Mute'}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
