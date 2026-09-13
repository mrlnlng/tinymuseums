import type { GuestNoteDto } from '@tiny/core'
import StickyNote from '@/features/guestboard/components/StickyNote'
import { NOTE_PLACES } from '@/features/guestboard/lib/placement'

/*  The newest notes, pinned in their places on the board drawing. Laid out in
    percentages of the drawing's canvas, so it is one layout wherever the board
    is shown — on the guest board screen, and small on the board in the hall —
    and a note sits in the same spot on both.

    With `onOpenNote` each note is a button that opens it; without, the notes
    are only drawn, as they are in the hall, where tapping the board opens it. */

interface PinnedNotesProps {
  notes: GuestNoteDto[]
  onOpenNote?: (index: number) => void
}

export default function PinnedNotes({ notes, onOpenNote }: PinnedNotesProps) {
  return (
    <ul className="guestboard-pins" aria-label={onOpenNote ? 'Notes from other visitors' : undefined}>
      {notes.slice(0, NOTE_PLACES.length).map((note, index) => {
        const place = NOTE_PLACES[index]!
        const drawn = <StickyNote color={note.color} name={note.name} />
        return (
          <li
            key={note.id}
            className="guestboard-pin"
            style={{ left: `${place.left}%`, top: `${place.top}%`, width: `${place.width}%` }}
          >
            {onOpenNote ? (
              <button
                type="button"
                className="guestboard-pin-button"
                onClick={() => onOpenNote(index)}
                aria-label={`Read ${note.name}'s note`}
              >
                {drawn}
              </button>
            ) : (
              drawn
            )}
          </li>
        )
      })}
    </ul>
  )
}
