import { redirect } from 'next/navigation'
import { personalRoomFor } from '@tiny/core'
import HomeSignIn from '@/features/rooms/personal/HomeSignIn'
import { currentMember } from '@/shared/lib/member-session'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const session = await currentMember()
  if (session) {
    const room = await personalRoomFor(session.member.id)
    redirect(`/museum/r/${room.slug}`)
  }
  return <HomeSignIn />
}
