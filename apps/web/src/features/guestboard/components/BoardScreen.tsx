import type { GuestNoteDto } from '@tiny/core'
import PinnedNotes from '@/features/guestboard/components/PinnedNotes'

/*  Mock 1: the board with the latest notes pinned to it, and the way to add one.

    Laid out as one stage at the mock's own 1080x1920 proportions, like the coin
    screen, with every position below the mock's as a share of that stage. The
    mock draws no way out, so the bare wall around the stage is the way out: a
    tap there closes the board, as a tap closes the coin screen. */

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
          <img className="guestboard-board-art" src="/assets/guestboard/board.png" alt="" />
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
