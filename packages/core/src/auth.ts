import { randomBytes } from 'node:crypto'
import bcrypt from 'bcryptjs'
import { query, queryOne } from './db.ts'

/**
 * Artist authentication.
 *
 * Email and password with server-side sessions, because artists upload and
 * publish and need a durable identity. Visitors deliberately have none — the
 * only thing a visitor does that needs identity is follow an artist, and that
 * is an email row, not an account.
 *
 * Cognito replaces this later; the session lookup is the seam.
 */

const SESSION_DAYS = 30

export interface AuthedArtist {
  id: string
  slug: string
  displayName: string
  email: string
  status: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 11)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function newToken(bytes = 32): string {
  return randomBytes(bytes).toString('base64url')
}

export async function createSession(artistId: string): Promise<{ token: string; expiresAt: Date }> {
  const token = newToken()
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000)
  await query(`insert into sessions (token, artist_id, expires_at) values ($1, $2, $3)`, [
    token,
    artistId,
    expiresAt,
  ])
  return { token, expiresAt }
}

export async function artistForSession(token: string | undefined): Promise<AuthedArtist | null> {
  if (!token) return null
  return queryOne<AuthedArtist>(
    `select a.id, a.slug, a.display_name as "displayName", a.email, a.status
       from sessions s
       join artists a on a.id = s.artist_id
      where s.token = $1 and s.expires_at > now()`,
    [token],
  )
}

export async function destroySession(token: string): Promise<void> {
  await query(`delete from sessions where token = $1`, [token])
}

/** URL-safe, collision-checked slug derived from the artist's name. */
export async function uniqueSlug(displayName: string): Promise<string> {
  const base =
    displayName
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 48) || 'artist'

  for (let attempt = 0; attempt < 50; attempt++) {
    const candidate = attempt === 0 ? base : `${base}-${attempt + 1}`
    const taken = await queryOne(`select 1 from artists where slug = $1`, [candidate])
    if (!taken) return candidate
  }
  return `${base}-${newToken(4)}`
}
