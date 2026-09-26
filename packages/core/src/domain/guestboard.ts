import { query, queryOne } from '../infra/db.ts'
import { hit, hitForVisitor, type RateLimit } from '../infra/rate-limit.ts'
import { GUEST_NOTE_COLORS, MAX_GUEST_MESSAGE, MAX_GUEST_NAME } from '../guestboard-rules.ts'
import type { GuestNoteColor, GuestNoteDto, GuestNotePageDto } from '../types.ts'

const MAX_GUEST_NOTES_PAGE = 100

const PER_VISITOR: RateLimit = { limit: 5, windowSeconds: 60 * 60 }
const WHOLE_BOARD: RateLimit = { limit: 120, windowSeconds: 60 * 60 }

export class GuestNoteRejected extends Error {}

export class GuestNoteRateLimited extends Error {
  readonly retryAfterSeconds: number

  constructor(retryAfterSeconds: number) {
    super('Too many notes for now — try again a little later.')
    this.retryAfterSeconds = retryAfterSeconds
  }
}

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

function encodeCursor(row: NoteRow): string {
  return Buffer.from(`${row.created_at.toISOString()}|${row.id}`).toString('base64url')
}

function decodeCursor(cursor: string): { createdAt: string; id: string } | null {
  const [createdAt, id] = Buffer.from(cursor, 'base64url').toString('utf8').split('|')
  if (!createdAt || !id || Number.isNaN(Date.parse(createdAt))) return null
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null
  return { createdAt, id }
}

export async function listGuestNotes(
  options: { limit?: number; cursor?: string | null } = {},
): Promise<GuestNotePageDto> {
  const limit = Math.min(MAX_GUEST_NOTES_PAGE, Math.max(1, options.limit ?? 50))
  const after = options.cursor ? decodeCursor(options.cursor) : null

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

export interface GuestNoteInput {
  name?: unknown
  message?: unknown
  color?: unknown
}

export async function postGuestNote(
  input: GuestNoteInput,
  visitor: { ip: string | null },
): Promise<GuestNoteDto> {
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
  if ([...name].length > MAX_GUEST_NAME) {
    throw new GuestNoteRejected(`Names can be up to ${MAX_GUEST_NAME} characters`)
  }
  if ([...message].length > MAX_GUEST_MESSAGE) {
    throw new GuestNoteRejected(`Notes can be up to ${MAX_GUEST_MESSAGE} characters`)
  }

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

function clean(value: unknown, { multiline }: { multiline: boolean }): string {
  if (typeof value !== 'string') return ''
  let text = value.normalize('NFC').replace(/\r\n?/g, '\n')
  text = multiline
    ? text.replace(/[^\P{Cc}\n]/gu, '').replace(/\n{3,}/g, '\n\n')
    : text.replace(/\p{Cc}/gu, ' ').replace(/\s+/g, ' ')
  return text.trim()
}

async function enforceLimits(ip: string | null): Promise<void> {
  const visitor = await hitForVisitor('guestboard', ip, PER_VISITOR)
  if (!visitor.allowed) throw new GuestNoteRateLimited(visitor.retryAfterSeconds)

  const board = await hit('guestboard:all', WHOLE_BOARD)
  if (!board.allowed) throw new GuestNoteRateLimited(board.retryAfterSeconds)
}

export async function hideGuestNote(id: string): Promise<void> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return
  await query(`update guest_notes set hidden_at = now() where id = $1 and hidden_at is null`, [id])
}
