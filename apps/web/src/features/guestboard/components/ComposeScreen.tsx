import { useState } from 'react'
import { MAX_GUEST_MESSAGE, MAX_GUEST_NAME } from '@tiny/core/guestboard'
import StickyNote from '@/features/guestboard/components/StickyNote'
import { PostRejected, type NoteDraft } from '@/features/guestboard/hooks/useGuestNotes'

/*  Mock 2: the board up close, and a blank note to write on — the message on
    the paper, the name signed at its foot, exactly where they will be read.

    The fields draw nothing of their own, so what is typed is set in the note's
    own type. The mock draws no way back, so as on the board, a tap on the bare
    board beside the note steps back; the draft is kept for when the visitor
    returns. */

interface ComposeScreenProps {
  draft: NoteDraft
  onChange: (draft: NoteDraft) => void
  onPublish: () => Promise<void>
  onBack: () => void
}

export default function ComposeScreen({ draft, onChange, onPublish, onBack }: ComposeScreenProps) {
  const [isPosting, setIsPosting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canPublish = draft.message.trim() !== '' && draft.name.trim() !== '' && !isPosting

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!canPublish) return
    setIsPosting(true)
    setError(null)
    try {
      await onPublish()
    } catch (postError) {
      setError(
        postError instanceof PostRejected
          ? postError.message
          : 'Your note could not be pinned up. Check your connection and try again.',
      )
      setIsPosting(false)
    }
  }

  return (
    <>
      <button type="button" className="guestboard-scrim" onClick={onBack} aria-label="Back to the guest board" />
      <form className="guestboard-stage" onSubmit={handleSubmit}>
        <div className="guestboard-board guestboard-board--close">
          <img className="guestboard-board-art" src="/assets/guestboard/board.png" alt="" />
        </div>

        <p className="guestboard-reminder">
          A gentle reminder: Tiny Museum is a shared space for everyone. Please keep all notes,
          suggestions, and interactions kind, supportive, and respectful.
        </p>

        <StickyNote
          className="guestboard-held guestboard-held--compose"
          color={draft.color}
          text={draft.message}
          message={
            <textarea
              className="sticky-note-field sticky-note-field--message"
              value={draft.message}
              onChange={(e) => onChange({ ...draft, message: e.target.value })}
              maxLength={MAX_GUEST_MESSAGE}
              placeholder="Write your note…"
              aria-label="Your note"
              autoFocus
              required
            />
          }
          name={
            <input
              className="sticky-note-field sticky-note-field--name"
              value={draft.name}
              onChange={(e) => onChange({ ...draft, name: e.target.value })}
              maxLength={MAX_GUEST_NAME}
              placeholder="Your name"
              aria-label="Your name"
              autoComplete="name"
              required
            />
          }
        />

        {error ? (
          <p className="guestboard-error" role="alert">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          className="guestboard-button guestboard-button--foot"
          disabled={!canPublish}
          aria-busy={isPosting}
        >
          Publish
        </button>
      </form>
    </>
  )
}
