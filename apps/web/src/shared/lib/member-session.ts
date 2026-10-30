import { cookies } from 'next/headers'
import { memberForSession, type Member } from '@tiny/core'

export const MEMBER_COOKIE = 'tm_member'

// The §5 session result plus the raw token, so a handler seeing `renewed`
// can slide the browser cookie with the DB row.
export interface MemberSession {
  member: Member
  token: string
  expiresAt: Date
  renewed: boolean
}

export async function currentMember(): Promise<MemberSession | null> {
  const store = await cookies()
  const token = store.get(MEMBER_COOKIE)?.value
  if (!token) return null
  const session = await memberForSession(token)
  if (!session) return null
  return { ...session, token }
}

export async function setMemberCookie(token: string, expiresAt: Date): Promise<void> {
  const store = await cookies()
  store.set(MEMBER_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
    secure: process.env.NODE_ENV === 'production',
  })
}

export async function clearMemberCookie(): Promise<void> {
  const store = await cookies()
  store.delete(MEMBER_COOKIE)
}
