import type { GuestNoteColor } from '@tiny/core'

function messageLength(text: string): 'short' | 'medium' | 'long' {
  const length = [...text].length + (text.split('\n').length - 1) * 12
  return length > 210 ? 'long' : length > 130 ? 'medium' : 'short'
}

interface StickyNoteProps {
  color: GuestNoteColor
  message?: React.ReactNode
  text?: string
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
