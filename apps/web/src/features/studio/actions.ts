'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import {
  createSession,
  destroySession,
  ensureQrToken,
  hashPassword,
  isLayoutName,
  publishArtist,
  query,
  queryOne,
  republishArtist,
  setDisplay,
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

export async function updatePieceAction(formData: FormData): Promise<void> {
  const artist = await requireArtist()
  const id = String(formData.get('id') ?? '')

  await query(
    `update pieces
        set title = $3, description = $4, medium = $5, year = $6, dimensions = $7, availability = $8
      where id = $1 and artist_id = $2`,
    [
      id,
      artist.id,
      String(formData.get('title') ?? '').trim(),
      String(formData.get('description') ?? '').trim(),
      String(formData.get('medium') ?? '').trim(),
      Number(formData.get('year')) || null,
      String(formData.get('dimensions') ?? '').trim() || null,
      formData.get('forSale') ? 'available' : 'not_for_sale',
    ],
  )

  revalidatePath('/studio/pieces')
  back('/studio/pieces', 'Saved')
}

export async function deletePieceAction(formData: FormData): Promise<void> {
  const artist = await requireArtist()
  await query(`delete from pieces where id = $1 and artist_id = $2`, [
    String(formData.get('id') ?? ''),
    artist.id,
  ])
  revalidatePath('/studio/pieces')
  back('/studio/pieces', 'Removed')
}

// ---------------------------------------------------------------- display

export async function saveDisplayAction(formData: FormData): Promise<void> {
  const artist = await requireArtist()

  const layout = String(formData.get('layout') ?? 'single')
  if (!isLayoutName(layout)) back('/studio/display', 'Unknown layout', 'bad')

  const pieceIds = formData.getAll('piece').map(String).filter(Boolean)
  if (pieceIds.length === 0) back('/studio/display', 'Choose at least one work to hang', 'bad')

  await setDisplay(artist.id, layout, pieceIds)

  revalidatePath('/studio/display')
  back('/studio/display', 'Arranged. The compositor is putting it together.')
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

export async function createCodeAction(formData: FormData): Promise<void> {
  const artist = await requireArtist()
  const placement = String(formData.get('placement') ?? '').trim() || 'default'
  await ensureQrToken(artist.id, placement)
  revalidatePath('/studio/codes')
  back('/studio/codes', `Code ready for "${placement}"`)
}
