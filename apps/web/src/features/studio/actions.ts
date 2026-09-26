'use server'

import { revalidatePath } from 'next/cache'
import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import {
  createSession,
  deletePiece,
  destroySession,
  ensureQrToken,
  hashPassword,
  hideGuestNote,
  hangPiece,
  hitForVisitor,
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
import { clientIp } from '@/shared/lib/client-ip'
import {
  clearSessionCookie,
  requireArtist,
  requireHallOwner,
  setSessionCookie,
  SESSION_COOKIE,
} from '@/shared/lib/session'
import { isEmail, isHttpUrl } from '@/shared/lib/validate'

function back(path: string, message: string, kind: 'ok' | 'bad' = 'ok'): never {
  redirect(`${path}?m=${encodeURIComponent(message)}&k=${kind}`)
}

async function isThrottled(scope: string, limit: number, windowSeconds: number): Promise<boolean> {
  const result = await hitForVisitor(scope, clientIp(await headers()), { limit, windowSeconds })
  return !result.allowed
}

export async function registerAction(formData: FormData): Promise<void> {
  const name = String(formData.get('name') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  const password = String(formData.get('password') ?? '')

  if (name.length < 2) back('/studio/register', 'Tell us what to call you', 'bad')
  if (!isEmail(email)) back('/studio/register', 'That email does not look right', 'bad')
  if (password.length < 8) back('/studio/register', 'Use at least 8 characters', 'bad')
  if (await isThrottled('register', 5, 60 * 60)) {
    back('/studio/register', 'Too many attempts. Try again later.', 'bad')
  }

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

  if (await isThrottled('sign-in', 10, 15 * 60)) {
    back('/studio/sign-in', 'Too many attempts. Try again in a few minutes.', 'bad')
  }

  const artist = await queryOne<{ id: string; password_hash: string }>(
    `select id, password_hash from artists where email = $1`,
    [email],
  )

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

export async function updatePieceAction(formData: FormData): Promise<void> {
  const artist = await requireArtist()
  const id = String(formData.get('id') ?? '')
  const title = String(formData.get('title') ?? '').trim()
  if (!title) back('/studio/gallery', 'Give the work a title', 'bad')

  const shopUrl = String(formData.get('shopUrl') ?? '').trim() || null
  if (shopUrl && !isHttpUrl(shopUrl)) {
    back('/studio/gallery', 'The shop link must start with http:// or https://', 'bad')
  }

  await query(
    `update pieces
        set title = $3, description = $4, shop_url = $5
      where id = $1 and artist_id = $2`,
    [
      id,
      artist.id,
      title,
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

export async function deleteGuestNoteAction(formData: FormData): Promise<void> {
  await requireHallOwner()
  await hideGuestNote(String(formData.get('id') ?? ''))
  revalidatePath('/studio/guestboard')
  back('/studio/guestboard', 'Note deleted')
}
