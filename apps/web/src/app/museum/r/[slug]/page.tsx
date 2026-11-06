import { notFound } from 'next/navigation'
import { roomPageView } from '@tiny/core'
import PersonalRoom from '@/features/hall/components/PersonalRoom'
import HomeSignIn from '@/features/rooms/personal/HomeSignIn'
import { currentMember } from '@/shared/lib/member-session'
import { currentArtist, isHallOwner } from '@/shared/lib/session'

export const dynamic = 'force-dynamic'

export default async function RoomPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ key?: string | string[] }>
}) {
  const { slug } = await params
  const requested = (await searchParams).key
  const key = typeof requested === 'string' ? requested : null

  const session = await currentMember()
  const artist = await currentArtist()
  const view = await roomPageView(slug, {
    memberId: session?.member.id ?? null,
    isOwnerArtist: artist ? isHallOwner(artist) : false,
    shareToken: key,
  })
  if (!view) notFound()
  // A private room says so, rather than a bare 404 (also what its owner sees after signing out).
  if (!view.canView) return <HomeSignIn variant="private" isSignedIn={session !== null} />

  return (
    <PersonalRoom
      slug={view.slug}
      theme={view.theme}
      placements={view.published}
      ownerName={view.ownerName}
      shareKey={key ?? undefined}
      canEdit={view.canEdit}
    />
  )
}
