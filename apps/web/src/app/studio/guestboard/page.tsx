import Link from 'next/link'
import { listGuestNotes } from '@tiny/core'
import Message from '@/shared/components/Message'
import { requireHallOwner } from '@/shared/lib/session'
import { deleteGuestNoteAction } from '@/features/studio/actions'

export const dynamic = 'force-dynamic'

const dateFormat = new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' })

export default async function GuestBoardPage({
  searchParams,
}: {
  searchParams: Promise<{ m?: string; k?: string; cursor?: string }>
}) {
  const { m, k, cursor } = await searchParams
  await requireHallOwner()

  const { notes, nextCursor } = await listGuestNotes({ limit: 50, cursor })

  return (
    <>
      <h1 className="script page-title">Guest board</h1>
      <p className="muted lead">Notes visitors have pinned to the board, newest first.</p>

      <Message m={m} k={k} />

      {notes.length === 0 ? (
        <p className="muted">{cursor ? 'No older notes.' : 'No notes on the board.'}</p>
      ) : (
        notes.map((note) => (
          <div key={note.id} className="card guest-note-row">
            <div className="piece-fields">
              <p className="guest-note-meta">
                <strong>{note.name}</strong>{' '}
                <span className="small muted">{dateFormat.format(new Date(note.createdAt))}</span>
              </p>
              <p className="guest-note-message flush">{note.message}</p>
            </div>
            <form action={deleteGuestNoteAction}>
              <input type="hidden" name="id" value={note.id} />
              <button className="button quiet" type="submit">
                Delete
              </button>
            </form>
          </div>
        ))
      )}

      {cursor || nextCursor ? (
        <p className="small">
          {cursor ? <Link href="/studio/guestboard">Newest notes</Link> : null}
          {cursor && nextCursor ? ' · ' : null}
          {nextCursor ? (
            <Link href={`/studio/guestboard?cursor=${encodeURIComponent(nextCursor)}`}>
              Older notes
            </Link>
          ) : null}
        </p>
      ) : null}
    </>
  )
}
