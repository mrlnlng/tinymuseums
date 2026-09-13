'use client'

import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { GUEST_NOTE_COLORS } from '@tiny/core/guestboard'
import BoardScreen from '@/features/guestboard/components/BoardScreen'
import ComposeScreen from '@/features/guestboard/components/ComposeScreen'
import ReadScreen from '@/features/guestboard/components/ReadScreen'
import { useGuestNotes, type NoteDraft } from '@/features/guestboard/hooks/useGuestNotes'

/*  The guest board, opened from the board at the end of the hall: the board
    with everyone's notes (mock 1), a note being written (mock 2), and a note
    held up to read, one after another (mock 3).

    One dialog with three screens rather than three dialogs, so the notes are
    fetched once and the draft outlives stepping away from it: going back to
    the board and returning finds the note as it was left. */

type View = { screen: 'board' } | { screen: 'compose' } | { screen: 'read'; index: number }

interface GuestBoardProps {
  onClose: () => void
}

function blankDraft(): NoteDraft {
  // The colour is chosen as the note is started, so what is written on is what gets pinned up.
  const color = GUEST_NOTE_COLORS[Math.floor(Math.random() * GUEST_NOTE_COLORS.length)]!
  return { name: '', message: '', color }
}

export default function GuestBoard({ onClose }: GuestBoardProps) {
  const { notes, hasMore, loadMore, post } = useGuestNotes()
  const [view, setView] = useState<View>({ screen: 'board' })
  const [draft, setDraft] = useState<NoteDraft>(blankDraft)

  const toBoard = useCallback(() => setView({ screen: 'board' }), [])

  // Escape steps back one screen, and closes from the board.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (view.screen === 'board') onClose()
      else toBoard()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [view.screen, onClose, toBoard])

  const publish = useCallback(async () => {
    await post(draft)
    setDraft(blankDraft())
    toBoard()
  }, [draft, post, toBoard])

  return (
    <motion.div
      className="guestboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      role="dialog"
      aria-modal="true"
      aria-label="Guest board"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={view.screen}
          className="guestboard-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          {view.screen === 'board' ? (
            <BoardScreen
              notes={notes}
              onClose={onClose}
              onAddNote={() => setView({ screen: 'compose' })}
              onOpenNote={(index) => setView({ screen: 'read', index })}
            />
          ) : view.screen === 'compose' ? (
            <ComposeScreen draft={draft} onChange={setDraft} onPublish={publish} onBack={toBoard} />
          ) : (
            <ReadScreen
              notes={notes}
              startIndex={view.index}
              hasMore={hasMore}
              onNeedMore={loadMore}
              onBack={toBoard}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}
