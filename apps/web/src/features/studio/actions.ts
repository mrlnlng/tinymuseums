'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import {
  createSession,
  deletePiece,
  destroySession,
  ensureQrToken,
  hashPassword,
  hangPiece,
  movePiece,
  publishArtist,
  query,
  queryOne,
  republishArtist,
  revokeQrToken,
  unhangPiece,
  uniqueSlug,
  unpublishArtist,
  verifyPassword,
} from '@tiny/core'
import { clearSessionCookie, requireArtist, setSessionCookie, SESSION_COOKIE } from '@/shared/lib/session'
import { cookies } from 'next/headers'

/*  Studio mutations — plain server actions that redirect with a message, rather than client state: the studio is a handful of forms, and every one of them is a navigation. */

function back(path: string, message: string, kind: 'ok' | 'bad' = 'ok'): never {
  redirect(`${path}?m=${encodeURIComponent(message)}&k=${kind}`)
}

// ---------------------------------------------------------------- identity

export async function registerAction(formData: FormData): Promise<void> {
  const name = String(formData.get('name') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  const password = String(formData.get('password') ?? '')

  if (name.length < 2) back('/studio/register', 'Tell us what to call you', 'bad')
  if (!email.includes('@')) back('/studio/register', 'That email does not look right', 'bad')
  if (password.length < 8) back('/studio/register', 'Use at least 8 characters', 'bad')

  const taken = await queryOne(`select 1 from artists where email = $1`, [email])
  if (taken) back('/studio/register', 'That email already has a wall', 'bad')

  const slug = await uniqueSlug(name)
  const artist = await queryOne<{ id: string }>(
    `insert into artists (slug, display_name, email, password_hash)
     values ($1, $2, $3, $4) returning id`,
    [slug, name, email, await hashPassword(password)],
  )
  if (!artist) back('/studio/register', 'Could not create your wall', 'bad')

  await query(`insert into displays (artist_id) values ($1) on conflict do nothing`, [artist.id])

  const session = await createSession(artist.id)
  await setSessionCookie(session.token, session.expiresAt)
  redirect('/studio')
}

export async function signInAction(formData: FormData): Promise<void> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  const password = String(formData.get('password') ?? '')

  const artist = await queryOne<{ id: string; password_hash: string }>(
    `select id, password_hash from artists where email = $1`,
    [email],
  )

  // Same message either way: this must not reveal which emails exist.
  if (!artist || !(await verifyPassword(password, artist.password_hash))) {
    back('/studio/sign-in', 'That email and password do not match', 'bad')
  }
  const session = await createSession(artist.id)
  await setSessionCookie(session.token, session.expiresAt)
  redirect('/studio')
}

export async function signOutAction(): Promise<void> {
  const store = await cookies()
  const token = store.get(SESSION_COOKIE)?.value
  if (token) await destroySession(token)
  await clearSessionCookie()
  redirect('/studio/sign-in')
}

// ---------------------------------------------------------------- works

const SHOP_URL = /^https?:\/\//i

export async function updatePieceAction(formData: FormData): Promise<void> {
  const artist = await requireArtist()
  const id = String(formData.get('id') ?? '')

  const shopUrl = String(formData.get('shopUrl') ?? '').trim() || null
  if (shopUrl && !SHOP_URL.test(shopUrl)) {
    back('/studio/gallery', 'The shop link must start with http:// or https://', 'bad')
  }

  await query(
    `update pieces
        set title = $3, description = $4, shop_url = $5
      where id = $1 and artist_id = $2`,
    [
      id,
      artist.id,
      String(formData.get('title') ?? '').trim(),
      String(formData.get('description') ?? '').trim(),
      shopUrl,
    ],
  )

  revalidatePath('/studio/gallery')
  back('/studio/gallery', 'Saved')
}

export async function deletePieceAction(formData: FormData): Promise<void> {
  const artist = await requireArtist()
  await deletePiece(artist.id, String(formData.get('id') ?? ''))
  revalidatePath('/studio/gallery')
  back('/studio/gallery', 'Removed')
}

// ---------------------------------------------------------------- arrange

/* These are called from the client controls (ArrangeControls) so a reorder
   keeps the visitor's scroll position — no redirect, no navigation. */

export async function movePieceAction(formData: FormData): Promise<void> {
  const artist = await requireArtist()
  const direction = formData.get('direction') === 'down' ? 'down' : 'up'
  await movePiece(artist.id, String(formData.get('id') ?? ''), direction)
  revalidatePath('/studio/gallery')
}

export async function unhangAction(formData: FormData): Promise<void> {
  const artist = await requireArtist()
  await unhangPiece(artist.id, String(formData.get('id') ?? ''))
  revalidatePath('/studio/gallery')
}

export async function hangAction(formData: FormData): Promise<{ error?: string }> {
  const artist = await requireArtist()
  const hung = await hangPiece(artist.id, String(formData.get('id') ?? ''))
  revalidatePath('/studio/gallery')
  if (!hung) return { error: 'The floor is full — unhang something first' }
  return {}
}

// ---------------------------------------------------------------- publish

export async function publishAction(): Promise<void> {
  const artist = await requireArtist()
  const report = await publishArtist(artist.id)

  if (!report.passed) back('/studio', 'Not quite ready — see the checklist', 'bad')

  await republishArtist(artist.id)
  revalidatePath('/studio')
  back('/studio', 'Published. You will appear in the hall at the next rotation.')
}

export async function unpublishAction(): Promise<void> {
  const artist = await requireArtist()
  await unpublishArtist(artist.id)
  revalidatePath('/studio')
  back('/studio', 'Taken down. Your wall is hidden immediately.')
}

// ---------------------------------------------------------------- qr codes

/* Called from the gallery's client CodesSection (scroll-preserving), so these
   return errors instead of redirecting with a banner. */

export async function createCodeAction(formData: FormData): Promise<{ error?: string }> {
  const artist = await requireArtist()
  const placement = String(formData.get('placement') ?? '').trim()
  if (!placement) return { error: 'Give the code a place' }

  const existing = await queryOne<{ token: string }>(
    `select token from qr_tokens
      where artist_id = $1 and placement = $2 and revoked_at is null`,
    [artist.id, placement],
  )
  if (existing) return { error: 'You already have a code for that placement' }

  await ensureQrToken(artist.id, placement)
  revalidatePath('/studio/gallery')
  return {}
}

export async function deleteCodeAction(formData: FormData): Promise<void> {
  const artist = await requireArtist()
  await revokeQrToken(artist.id, String(formData.get('token') ?? ''))
  revalidatePath('/studio/gallery')
}
