import { createHmac } from 'node:crypto'
import { query, queryOne } from '../infra/db.ts'
import { env } from '../infra/env.ts'
import { hit, type RateLimit } from '../infra/rate-limit.ts'
import type { GuestNoteColor, GuestNoteDto, GuestNotePageDto } from '../types.ts'

/* The guest board: sticky notes left by visitors, who have no accounts. Anyone can post, so every rule about what a note may contain, and how often one may be left, lives here — the route only translates HTTP. */

export const GUEST_NOTE_COLORS = ['pink', 'green'] as const satisfies readonly GuestNoteColor[]
export const MAX_GUEST_NAME = 40
export const MAX_GUEST_MESSAGE = 280
export const MAX_GUEST_NOTES_PAGE = 100

/* Two limits, because a client's address is only as trustworthy as the proxy headers it came from: the per-visitor limit is the friendly one, and the board-wide ceiling holds even if an address is spoofed. */
const PER_VISITOR: RateLimit = { limit: 5, windowSeconds: 60 * 60 }
const WHOLE_BOARD: RateLimit = { limit: 120, windowSeconds: 60 * 60 }

export class GuestNoteRejected extends Error {}

// A plain field rather than a constructor parameter property: the scripts run
// this source under Node's type stripping, which does not support those.
export class GuestNoteRateLimited extends Error {
  readonly retryAfterSeconds: number

  constructor(retryAfterSeconds: number) {
    super('Too many notes for now — try again a little later.')
    this.retryAfterSeconds = retryAfterSeconds
  }
}

// ---------------------------------------------------------------- reading

interface NoteRow {
  id: string
  name: string
  message: string
  color: GuestNoteColor
  created_at: Date
}

const NOTE_COLUMNS = `id, author_name as name, message, color, created_at`

function toDto(row: NoteRow): GuestNoteDto {
  return {
    id: row.id,
    name: row.name,
    message: row.message,
    color: row.color,
    createdAt: row.created_at.toISOString(),
  }
}

/* The cursor is opaque to clients: the (created_at, id) of the last note served, so paging stays stable while new notes arrive at the top. created_at is stored at millisecond precision, so it survives the round-trip through an ISO string exactly. */
function encodeCursor(row: NoteRow): string {
  return Buffer.from(`${row.created_at.toISOString()}|${row.id}`).toString('base64url')
}

function decodeCursor(cursor: string): { createdAt: string; id: string } | null {
  const [createdAt, id] = Buffer.from(cursor, 'base64url').toString('utf8').split('|')
  if (!createdAt || !id || Number.isNaN(Date.parse(createdAt))) return null
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null
  return { createdAt, id }
}

/** Visible notes, newest first. An unreadable cursor starts from the top. */
export async function listGuestNotes(
  options: { limit?: number; cursor?: string | null } = {},
): Promise<GuestNotePageDto> {
  const limit = Math.min(MAX_GUEST_NOTES_PAGE, Math.max(1, options.limit ?? 50))
  const after = options.cursor ? decodeCursor(options.cursor) : null

  // One extra row says whether there is another page without a count query.
  const rows = await query<NoteRow>(
    `select ${NOTE_COLUMNS}
       from guest_notes
      where hidden_at is null
        and ($1::timestamptz is null
             or (created_at, id) < ($1::timestamptz, $2::uuid))
      order by created_at desc, id desc
      limit $3`,
    [after?.createdAt ?? null, after?.id ?? null, limit + 1],
  )

  const page = rows.slice(0, limit)
  const last = page.at(-1)
  return {
    notes: page.map(toDto),
    nextCursor: rows.length > limit && last ? encodeCursor(last) : null,
  }
}

// ---------------------------------------------------------------- posting

export interface GuestNoteInput {
  name?: unknown
  message?: unknown
  color?: unknown
}

/** Leaves a note. Throws GuestNoteRejected for content that cannot be posted
 *  and GuestNoteRateLimited when the visitor or the board is over its limit. */
export async function postGuestNote(
  input: GuestNoteInput,
  visitor: { ip: string | null },
): Promise<GuestNoteDto> {
  // Validate before counting, so a typo does not spend one of the visitor's notes.
  const note = validate(input)

  await enforceLimits(visitor.ip)

  const row = await queryOne<NoteRow>(
    `insert into guest_notes (author_name, message, color)
     values ($1, $2, $3)
     returning ${NOTE_COLUMNS}`,
    [note.name, note.message, note.color],
  )
  if (!row) throw new Error('Inserting a guest note returned no row')
  return toDto(row)
}

function validate(input: GuestNoteInput): { name: string; message: string; color: GuestNoteColor } {
  const name = clean(input.name, { multiline: false })
  const message = clean(input.message, { multiline: true })

  if (!name) throw new GuestNoteRejected('Sign your note with a name')
  if (!message) throw new GuestNoteRejected('Write something on your note')
  // Counted in code points, so an emoji is one character, as the visitor sees it.
  if ([...name].length > MAX_GUEST_NAME) {
    throw new GuestNoteRejected(`Names can be up to ${MAX_GUEST_NAME} characters`)
  }
  if ([...message].length > MAX_GUEST_MESSAGE) {
    throw new GuestNoteRejected(`Notes can be up to ${MAX_GUEST_MESSAGE} characters`)
  }

  // No colour means the board picks one; an unknown colour is a client bug, not a choice.
  let color: GuestNoteColor
  if (input.color === undefined || input.color === null || input.color === '') {
    color = GUEST_NOTE_COLORS[Math.floor(Math.random() * GUEST_NOTE_COLORS.length)]!
  } else if (GUEST_NOTE_COLORS.includes(input.color as GuestNoteColor)) {
    color = input.color as GuestNoteColor
  } else {
    throw new GuestNoteRejected('Unknown note colour')
  }

  return { name, message, color }
}

/** Normalises free text: NFC, no control characters, trimmed, and at most one
 *  blank line in a row — a note is small and a wall of newlines is not a message. */
function clean(value: unknown, { multiline }: { multiline: boolean }): string {
  if (typeof value !== 'string') return ''
  let text = value.normalize('NFC').replace(/\r\n?/g, '\n')
  text = multiline
    ? text.replace(/[^\P{Cc}\n]/gu, '').replace(/\n{3,}/g, '\n\n')
    : text.replace(/\p{Cc}/gu, ' ').replace(/\s+/g, ' ')
  return text.trim()
}

/* The visitor's own limit is checked first, so a visitor who is already over it does not also use up the board-wide allowance. Addresses are stored as a keyed hash, never raw: the counter only needs to tell visitors apart. */
async function enforceLimits(ip: string | null): Promise<void> {
  if (ip) {
    const visitor = await hit(`guestboard:ip:${fingerprint(ip)}`, PER_VISITOR)
    if (!visitor.allowed) throw new GuestNoteRateLimited(visitor.retryAfterSeconds)
  }

  const board = await hit('guestboard:all', WHOLE_BOARD)
  if (!board.allowed) throw new GuestNoteRateLimited(board.retryAfterSeconds)
}

function fingerprint(ip: string): string {
  return createHmac('sha256', env.sessionSecret).update(ip).digest('base64url').slice(0, 22)
}
