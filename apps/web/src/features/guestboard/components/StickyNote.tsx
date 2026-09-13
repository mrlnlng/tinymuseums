import type { GuestNoteColor } from '@tiny/core'

/*  One sticky note, drawn the same way at every size: the paper, its message,
    and the name signed at the foot. The type inside is sized against the note's
    own width (a size container), so a note pinned up small on the board and the
    same note held up to read are one drawing at two scales. The board's small
    notes show only the name, as the mock draws them. */

/*  The mock's type fits about 130 characters on the paper, and a note may hold
    280, so a longer note is set smaller rather than cut off. Tiers rather than
    a fitted size, so a note reads at the same size every time it is shown and
    the type does not shrink under the visitor's fingers letter by letter. */
function messageLength(text: string): 'short' | 'medium' | 'long' {
  // A line break costs about half a line of the paper, so it counts as that many characters.
  const length = [...text].length + (text.split('\n').length - 1) * 12
  return length > 210 ? 'long' : length > 130 ? 'medium' : 'short'
}

interface StickyNoteProps {
  color: GuestNoteColor
  /** The message area — text to read, or the field it is written in. */
  message?: React.ReactNode
  /** What the message says, so the type can be sized to its length. */
  text?: string
  /** The signature — a name, or the field it is typed in. */
  name: React.ReactNode
  className?: string
}

export default function StickyNote({ color, message, text = '', name, className }: StickyNoteProps) {
  return (
    <div className={['sticky-note', `sticky-note--${color}`, className].filter(Boolean).join(' ')}>
      {message !== undefined ? (
        <div className="sticky-note-message" data-length={messageLength(text)}>
          {message}
        </div>
      ) : null}
      <div className="sticky-note-name">{name}</div>
    </div>
  )
}
