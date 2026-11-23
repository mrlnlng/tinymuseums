'use server'

import { revalidatePath } from 'next/cache'
import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import {
  createSession,
  deletePiece,
  discardDoors,
  doorsState,
  publishDoors,
  saveDoorsDraft,
  type MuseumDoor,
  destroySession,
  discardLocation,
  locationStates,
  nudgeInRow,
  placePainting,
  publishLocation,
  ensureQrToken,
  env,
  hideGuestNote,
  setBugReportResolved,
  hitForVisitor,
  publishArtist,
  query,
  queryOne,
  republishArtist,
  revokeQrToken,
  unpublishArtist,
  verifyPassword,
} from '@tiny/core'
import { clientIp } from '@/shared/lib/client-ip'
import { checkPasswordRateLimit } from '@/shared/lib/member-route'
import {
  clearSessionCookie,
  requireArtist,
  requireHallOwner,
  setSessionCookie,
  SESSION_COOKIE,
} from '@/shared/lib/session'
import { isHttpUrl } from '@/shared/lib/validate'

function back(path: string, message: string, kind: 'ok' | 'bad' = 'ok'): never {
  redirect(`${path}${path.includes('?') ? '&' : '?'}m=${encodeURIComponent(message)}&k=${kind}`)
}

async function isThrottled(scope: string, limit: number, windowSeconds: number): Promise<boolean> {
  const result = await hitForVisitor(scope, clientIp(await headers()), { limit, windowSeconds })
  return !result.allowed
}

export async function signInAction(formData: FormData): Promise<void> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  const password = String(formData.get('password') ?? '')

  if (await isThrottled('sign-in', 10, 15 * 60)) {
    back('/studio/sign-in', 'Too many attempts. Try again in a few minutes.', 'bad')
  }
  if (await checkPasswordRateLimit(email)) {
    back('/studio/sign-in', 'Too many attempts. Try again in a few minutes.', 'bad')
  }

  const artist = await queryOne<{ id: string; password_hash: string }>(
    `select id, password_hash from artists where email = $1`,
    [email],
  )

  if (!artist || !(await verifyPassword(password, artist.password_hash))) {
    back('/studio/sign-in', 'That email and password do not match', 'bad')
  }
  const owner = env.hallOwnerEmail.trim().toLowerCase()
  if (owner === '' || email !== owner) back('/studio/sign-in', 'The studio is for the museum owner only', 'bad')
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
  const here = `/studio/paintings?id=${encodeURIComponent(id)}`
  if (!title) back(here, 'Give the work a title', 'bad')

  const shopUrl = String(formData.get('shopUrl') ?? '').trim() || null
  if (shopUrl && !isHttpUrl(shopUrl)) {
    back(here, 'The shop link must start with http:// or https://', 'bad')
  }

  const wallpaperUrl = String(formData.get('wallpaperUrl') ?? '').trim() || null
  if (wallpaperUrl && !isHttpUrl(wallpaperUrl)) {
    back(here, 'The wallpaper link must start with http:// or https://', 'bad')
  }

  await query(
    `update pieces
        set title = $3, description = $4, shop_url = $5, wallpaper_url = $6
      where id = $1 and artist_id = $2`,
    [
      id,
      artist.id,
      title,
      String(formData.get('description') ?? '').trim(),
      shopUrl,
      wallpaperUrl,
    ],
  )

  revalidatePath('/studio', 'layout')
  back(here, 'Saved')
}

export async function deletePieceAction(formData: FormData): Promise<void> {
  const artist = await requireArtist()
  await deletePiece(artist.id, String(formData.get('id') ?? ''))
  revalidatePath('/studio', 'layout')
  back('/studio/paintings', 'Removed')
}




export async function publishAction(): Promise<void> {
  const artist = await requireArtist()
  const report = await publishArtist(artist.id)

  if (!report.passed) back('/studio', 'Not quite ready — see the checklist', 'bad')

  await republishArtist(artist.id)
  revalidatePath('/studio')
  back('/studio', 'Published. You will appear in the hall in a few minutes.')
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
  revalidatePath('/studio', 'layout')
  return {}
}

export async function deleteCodeAction(formData: FormData): Promise<void> {
  const artist = await requireArtist()
  await revokeQrToken(artist.id, String(formData.get('token') ?? ''))
  revalidatePath('/studio', 'layout')
}

export async function deleteGuestNoteAction(formData: FormData): Promise<void> {
  await requireHallOwner()
  await hideGuestNote(String(formData.get('id') ?? ''))
  revalidatePath('/studio/guestboard')
  back('/studio/guestboard', 'Note deleted')
}

export async function setBugReportResolvedAction(formData: FormData): Promise<void> {
  await requireHallOwner()
  const resolved = formData.get('resolved') === 'true'
  await setBugReportResolved(String(formData.get('id') ?? ''), resolved)
  revalidatePath('/studio/bugs')
  back('/studio/bugs', resolved ? 'Marked fixed' : 'Reopened')
}


// Placing paintings: the owner chooses a spot for a painting, then publishes each location.
const PLACE_ERRORS: Record<string, string> = {
  unknown_painting: 'That painting is not ready to hang yet',
  zone_full: 'That frame already holds a painting',
  unknown_spot: 'That spot no longer exists',
  unknown_location: 'That location no longer exists',
}

function returnTo(formData: FormData, fallback: string): string {
  const path = String(formData.get('back') ?? '')
  return path.startsWith('/studio/') ? path : fallback
}

/** `target` is `none`, `<location>|end` for a row, or `<location>|<spot>` for a frame. */
export async function placePaintingAction(formData: FormData): Promise<void> {
  await requireHallOwner()
  const id = String(formData.get('id') ?? '')
  const target = String(formData.get('target') ?? '')
  const path = returnTo(formData, '/studio/paintings')
  const [location, spot] = target.split('|')
  const states = await locationStates()
  const state = states.find((s) => s.id === location)
  if (target !== 'none' && !state) back(path, 'Choose where it should hang', 'bad')
  const result = await placePainting(
    id,
    target === 'none' ? null : state!.kind === 'row' ? { location, after: spot === 'end' ? null : spot } : { location, spot },
  )
  if (!result.ok) back(path, PLACE_ERRORS[result.reason] ?? `Could not place it (${result.reason})`, 'bad')
  revalidatePath('/studio', 'layout')
  back(path, target === 'none' ? 'Taken down in the draft. Publish its location to make it live.' : `Placed in ${state!.label} as a draft. Publish it to make it live.`)
}

export async function nudgeInRowAction(formData: FormData): Promise<void> {
  await requireHallOwner()
  const location = String(formData.get('location') ?? '')
  const result = await nudgeInRow(location, String(formData.get('id') ?? ''), formData.get('by') === 'up' ? -1 : 1)
  if (!result.ok) back('/studio/hang', `Could not move it (${result.reason})`, 'bad')
  revalidatePath('/studio', 'layout')
  redirect(`/studio/hang?room=${location}`)
}

export async function publishLocationAction(formData: FormData): Promise<void> {
  await requireHallOwner()
  const location = String(formData.get('location') ?? '')
  const label = (await locationStates()).find((s) => s.id === location)?.label ?? location
  if (!(await publishLocation(location))) back('/studio/hang', `Could not publish ${label}`, 'bad')
  revalidatePath('/studio', 'layout')
  revalidatePath('/museum', 'layout')
  back(`/studio/hang?room=${location}`, `${label} is live`)
}

export async function discardLocationAction(formData: FormData): Promise<void> {
  await requireHallOwner()
  const location = String(formData.get('location') ?? '')
  const result = await discardLocation(location)
  if (!result.ok) back('/studio/hang', `Could not discard (${result.reason})`, 'bad')
  revalidatePath('/studio', 'layout')
  back(`/studio/hang?room=${location}`, 'Back to what is live')
}

// Doors: the editor changes its own copy with the rules in rooms/doors.ts and saves the whole set
// as a draft; the server checks it again before keeping it.
export async function saveDoorsAction(doors: MuseumDoor[]): Promise<{ ok: boolean }> {
  await requireHallOwner()
  const ok = await saveDoorsDraft(doors)
  revalidatePath('/studio/doors')
  revalidatePath('/studio')
  return { ok }
}

export async function publishDoorsAction(): Promise<void> {
  await requireHallOwner()
  await publishDoors()
  revalidatePath('/museum', 'layout')
  back('/studio/doors', 'The doors are live')
}

export async function discardDoorsAction(): Promise<void> {
  await requireHallOwner()
  await discardDoors()
  revalidatePath('/studio/doors')
  back('/studio/doors', 'Back to the doors that are live')
}

/** Puts every waiting change live: each location's paintings and the doors. */
export async function publishAllAction(): Promise<void> {
  await requireHallOwner()
  for (const state of await locationStates()) {
    if (state.unpublished && !(await publishLocation(state.id))) back('/studio', `Could not publish ${state.label}`, 'bad')
  }
  if ((await doorsState()).unpublished) await publishDoors()
  revalidatePath('/museum', 'layout')
  revalidatePath('/studio', 'layout')
  back('/studio', 'Everything is live')
}
