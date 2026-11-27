'use client'

import { useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import { useSound } from '@/features/sound/components/SoundProvider'
import { useVisitorName } from '@/features/presence/lib/useVisitorName'
import { QUEST_LABEL, fillName, letterById, type Letter, type LetterId } from '../letters.ts'
import {
  emptyProgress,
  getLetterProgress,
  questView,
  subscribeLetters,
  unopenedLetters,
  type LetterProgress,
} from '../progress.ts'
import { openCuratorLetter, startCuratorLetters } from '../events.ts'

const SERVER_PROGRESS: LetterProgress = emptyProgress()

interface LetterMailboxProps {
  /** The room owner's display name, used until the visitor-name hook resolves. */
  ownerName?: string | null
}

function latestLetter(progress: LetterProgress): Letter | null {
  const latest = [...progress.delivered].sort((a, b) => b - a)[0]
  return latest === undefined ? null : letterById(latest)
}

export default function LetterMailbox({ ownerName }: LetterMailboxProps) {
  const { play } = useSound()
  const visitor = useVisitorName()
  const progress = useSyncExternalStore(subscribeLetters, getLetterProgress, () => SERVER_PROGRESS)
  const [openId, setOpenId] = useState<LetterId | null>(null)
  const name = visitor.name ?? ownerName ?? 'friend'

  useEffect(() => {
    startCuratorLetters()
  }, [])

  const waiting = useMemo(() => unopenedLetters(progress), [progress])
  const shown = openId === null ? null : letterById(openId)

  function open(letter: Letter | null): void {
    if (!letter) return
    setOpenId(letter.id)
    openCuratorLetter(letter.id)
    play('open')
  }

  function close(): void {
    setOpenId(null)
    play('close')
  }

  function openNext(): void {
    open(waiting[0] ?? latestLetter(progress))
  }

  return (
    <>
      <button
        type="button"
        className={`letter-mailbox${waiting.length > 0 ? ' has-new' : ''}`}
        onClick={() => open(waiting[0] ?? latestLetter(progress))}
        aria-label={
          waiting.length > 0
            ? `${waiting.length === 1 ? 'A new letter' : `${waiting.length} new letters`} from Wally`
            : 'Letters from Wally'
        }
        title="Letters from Wally"
      >
        <svg viewBox="0 0 48 36" aria-hidden="true" focusable="false">
          <rect x="2" y="4" width="44" height="28" rx="5" fill="#fff6e5" stroke="#5b3a2a" strokeWidth="2.5" />
          <path d="M4 8l20 15L44 8" fill="none" stroke="#5b3a2a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="38" cy="8" r="7" fill="#c22252" stroke="#fff6e5" strokeWidth="2" />
          <path d="M38 4.5v4M38 11.2v.6" stroke="#fff6e5" strokeWidth="2" strokeLinecap="round" />
        </svg>
        {waiting.length > 0 ? (
          <span className="letter-mailbox-badge" aria-hidden="true">
            {waiting.length}
          </span>
        ) : null}
        <span className="letter-mailbox-label">Letters</span>
      </button>

      {shown ? (
        <div
          className="letter-sheet-scrim"
          role="dialog"
          aria-modal="true"
          aria-labelledby="letter-sheet-title"
          onClick={(event) => {
            if (event.target === event.currentTarget) close()
          }}
        >
          <article className="letter-sheet">
            <button type="button" className="letter-sheet-close" onClick={close} aria-label="Close the letter">
              {'×'}
            </button>
            <p className="letter-sheet-kicker">A letter from Wally</p>
            <h2 id="letter-sheet-title" className="letter-sheet-title">
              {shown.title}
            </h2>
            <div className="letter-sheet-body">
              {fillName(shown.body, name)
                .split('\n')
                .filter((line) => line.length > 0)
                .map((line, index) =>
                  line === 'Wally' ? (
                    <p key={index} className="letter-sheet-signature">
                      Wally
                    </p>
                  ) : (
                    <p key={index}>{line}</p>
                  ),
                )}
            </div>
            <QuestLine progress={progress} letter={shown} />
            {waiting.length > 0 ? (
              <button type="button" className="letter-sheet-next" onClick={openNext}>
                Next letter ({waiting.length} waiting)
              </button>
            ) : null}
          </article>
        </div>
      ) : null}
    </>
  )
}

function QuestLine({ progress, letter }: { progress: LetterProgress; letter: Letter }) {
  const quest = questView(progress, letter)
  return (
    <p className={`letter-quest${quest.completed ? ' is-done' : ''}`}>
      <span className="letter-quest-label">Quest</span>
      <span className="letter-quest-text">{QUEST_LABEL[letter.condition.kind]}</span>
      {quest.count !== null ? (
        <span className="letter-quest-count">
          {quest.done}/{quest.count}
        </span>
      ) : null}
      {quest.completed ? <span className="letter-quest-done">Done!</span> : null}
    </p>
  )
}
