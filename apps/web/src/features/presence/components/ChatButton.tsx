'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useEscapeKey } from '@/shared/hooks/useEscapeKey'
import { useSound } from '@/features/sound/components/SoundProvider'
import { MESSAGE_MAX } from '@tiny/core/presence/messages'
import type { ChatMessage } from '../lib/chat-history'
import WalkAlone from './WalkAlone'
import { presence as presenceSlot } from '@tiny/core/slots'
import { useSlot } from '@/shared/lib/slots'
import {
  hasRoom,
  getChatHistory,
  getPeople,
  isChatMuted,
  isInRoom,
  isMuted,
  onChatHistoryChange,
  onChatMutedChange,
  onInRoomChange,
  onMutedChange,
  onOpenChat,
  onPeopleChange,
  onSayResult,
  refreshChatHistory,
  requestSay,
  setChatMuted as setChatMutedPreference,
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
  const { play } = useSound()
  const [inRoom, setInRoom] = useState(false)
  const [roomShown, setRoomShown] = useState(false)
  const [prefs] = useSlot(presenceSlot)
  const walkingAlone = prefs.walkAlone.v
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')
  const [note, setNote] = useState<string | null>(null)
  const [people, setPeople] = useState(getPeople)
  const [history, setHistory] = useState<ChatMessage[]>(getChatHistory)
  const [chatMuted, setChatMuted] = useState(isChatMuted)
  const [, setMutes] = useState(0)
  const control = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const openRef = useRef(false)

  const playChatSound = useCallback(
    (name: 'open' | 'close' | 'confirm' | 'error') => {
      if (!isChatMuted()) play(name)
    },
    [play],
  )

  const openPanel = useCallback(() => {
    if (openRef.current) return
    openRef.current = true
    setHistory(refreshChatHistory())
    setOpen(true)
    playChatSound('open')
  }, [playChatSound])

  const closePanel = useCallback(() => {
    if (!openRef.current) return
    openRef.current = false
    setOpen(false)
    playChatSound('close')
  }, [playChatSound])

  useEffect(() => {
    setInRoom(isInRoom())
    setRoomShown(hasRoom())
    setHistory(getChatHistory())
    const stops = [
      onInRoomChange(() => {
        setInRoom(isInRoom())
        // Losing the connection (walking alone, another tab, a reconnect) keeps the panel open
        // so the visitor can see why; only leaving the room closes it.
        if (!isInRoom() && !hasRoom()) {
          openRef.current = false
          setOpen(false)
        }
      }),
      onPeopleChange(() => setPeople(getPeople())),
      onChatHistoryChange(() => {
        setHistory(getChatHistory())
        setRoomShown(hasRoom())
        if (!hasRoom() && !isInRoom()) {
          openRef.current = false
          setOpen(false)
        }
      }),
      onChatMutedChange(() => setChatMuted(isChatMuted())),
      onMutedChange(() => setMutes((n) => n + 1)),
      onOpenChat(() => {
        if (isInRoom() || hasRoom()) openPanel()
      }),
      onSayResult((result) => {
        if (result.ok) {
          playChatSound('confirm')
          openRef.current = false
          setText('')
          setNote(null)
          setOpen(false)
        } else {
          playChatSound('error')
          setNote(REFUSED[result.reason])
        }
      }),
    ]
    return () => stops.forEach((stop) => stop())
  }, [openPanel, playChatSound])

  useEffect(() => {
    if (!open) return
    input.current?.focus()
    const onPointer = (event: PointerEvent) => {
      if (!control.current?.contains(event.target as Node)) closePanel()
    }
    window.addEventListener('pointerdown', onPointer)
    return () => {
      window.removeEventListener('pointerdown', onPointer)
    }
  }, [open, closePanel])

  useEscapeKey(closePanel, open)

  if (!inRoom && !roomShown) return null
  const here = people.length + 1
  // Muted chat, or a muted visitor, stays out of the history list as well as the bubbles.
  const shownHistory = chatMuted
    ? history.filter((m) => m.pid === 'self')
    : history.filter((m) => m.pid === 'self' || !isMuted(m.pid))

  return (
    <div className="chat-control" ref={control}>
      <button
        type="button"
        className="chrome-button chat-toggle"
        data-sound
        onClick={() => {
          setNote(null)
          if (open) closePanel()
          else openPanel()
        }}
        aria-label={inRoom ? `Say something to other visitors. ${here} here` : 'Chat'}
        aria-expanded={open}
        title={inRoom ? `Say something — ${here} here` : 'Chat'}
      >
        <svg viewBox="0 0 75 75" aria-hidden="true">
          <mask id="chat-toggle-cutout">
            <rect width="75" height="75" fill="white" />
            <path
              d="M17,18 H42 A7,7 0 0 1 49,25 V35 A7,7 0 0 1 42,42 H28 L20,49 L21,42 H17 A7,7 0 0 1 10,35 V25 A7,7 0 0 1 17,18z"
              fill="black"
            />
            <path
              d="M34,32 H58 A7,7 0 0 1 65,39 V48 A7,7 0 0 1 58,55 H56 L57,62 L49,55 H34 A7,7 0 0 1 27,48 V39 A7,7 0 0 1 34,32z"
              fill="black"
              stroke="white"
              strokeWidth="3.5"
            />
          </mask>
          <circle cx="37.5" cy="37.5" r="37.5" mask="url(#chat-toggle-cutout)" />
        </svg>
        {inRoom ? (
          <span className="chat-count" aria-hidden="true">
            {here}
          </span>
        ) : null}
      </button>
      {open ? (
        <div className="chat-panel">
          {inRoom ? null : (
            <p className="chat-offline" role="status">
              {walkingAlone
                ? 'You are visiting alone, so nobody can see you or your messages. Switch it off to chat.'
                : 'Finding the other visitors…'}
            </p>
          )}
          {inRoom ? (
            <>
              <div className="chat-head">
                <p className="chat-here">{here} here</p>
                <button
                  type="button"
                  role="switch"
                  aria-checked={chatMuted}
                  className="chat-mute-all"
                  onClick={() => setChatMutedPreference(!chatMuted)}
                  title={chatMuted ? 'Show and hear incoming chat again' : 'Hide and silence incoming chat'}
                >
                  {chatMuted ? 'Unmute chat' : 'Mute chat'}
                </button>
              </div>
              <ol className="chat-history" aria-label="Recent messages in this room">
                {shownHistory.length === 0 ? (
                  <li className="chat-empty">{chatMuted ? 'Chat is muted.' : 'No messages yet.'}</li>
                ) : (
                  shownHistory.map((message, index) => (
                    <li
                      key={`${message.at}-${index}`}
                      className="chat-line"
                      data-self={message.pid === 'self' ? '' : undefined}
                    >
                      <span className="chat-who">{message.name}</span> <span className="chat-text">{message.text}</span>
                    </li>
                  ))
                )}
              </ol>
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
            </>
          ) : null}
          <WalkAlone label="Visit alone" />
        </div>
      ) : null}
    </div>
  )
}
