import { notFound } from 'next/navigation'
import { canEdit, canView, getRoom } from '@tiny/core'
import PersonalRoom from '@/features/hall/components/PersonalRoom'
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
  const actor = {
    memberId: session?.member.id ?? null,
    isOwnerArtist: artist ? isHallOwner(artist) : false,
  }

  const room = await getRoom(slug)
  if (!room || !canView(room, { ...actor, shareToken: key })) notFound()

  return (
    <PersonalRoom
      slug={room.slug}
      theme={room.theme}
      placements={room.published}
      shareKey={key ?? undefined}
      canEdit={canEdit(room, actor)}
    />
  )
}
