import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { artistForSession, type AuthedArtist } from '@tiny/core'

/*  Studio sessions: one httpOnly cookie holding an opaque token; the session row in Postgres is the source of truth. Cognito replaces artistForSession later and nothing else here changes. */

export const SESSION_COOKIE = 'tm_session'

export async function currentArtist(): Promise<AuthedArtist | null> {
  const store = await cookies()
  return artistForSession(store.get(SESSION_COOKIE)?.value)
}

/** For studio pages: redirects to sign-in rather than returning null. */
export async function requireArtist(): Promise<AuthedArtist> {
  const artist = await currentArtist()
  if (!artist) redirect('/studio/sign-in')
  return artist
}

export async function setSessionCookie(token: string, expiresAt: Date): Promise<void> {
  const store = await cookies()
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
    secure: process.env.NODE_ENV === 'production',
  })
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies()
  store.delete(SESSION_COOKIE)
}
