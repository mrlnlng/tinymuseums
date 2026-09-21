import type { GuestNoteDto } from '@tiny/core'
import PinnedNotes from '@/features/guestboard/components/PinnedNotes'

interface BoardScreenProps {
  notes: GuestNoteDto[]
  onClose: () => void
  onAddNote: () => void
  onOpenNote: (index: number) => void
}

export default function BoardScreen({ notes, onClose, onAddNote, onOpenNote }: BoardScreenProps) {
  return (
    <>
      <button type="button" className="guestboard-scrim" onClick={onClose} aria-label="Close the guest board" />
      <div className="guestboard-stage">
        <h2 className="guestboard-heading">Leave your mark on the wall</h2>

        <div className="guestboard-board guestboard-board--whole">
          <img className="guestboard-board-art" src="/assets/guestboard/board.webp" alt="" />
          <PinnedNotes notes={notes} onOpenNote={onOpenNote} />
        </div>

        <p className="guestboard-intro">
          Take a look at the guest board, connect with fellow visitors, and leave a piece of
          yourself behind before you go!
        </p>

        <button type="button" className="guestboard-button guestboard-button--add" onClick={onAddNote}>
          Add a note
        </button>
      </div>
    </>
  )
}
