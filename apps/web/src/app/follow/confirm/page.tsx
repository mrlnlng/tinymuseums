import { confirmFollow } from '@tiny/core'
import FollowNotice from '@/features/audience/components/FollowNotice'

export const dynamic = 'force-dynamic'

export default async function ConfirmFollow({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams
  const ok = token ? await confirmFollow(token) : false

  return (
    <FollowNotice
      title={ok ? 'You are on the list' : 'That link has expired'}
      body={
        ok
          ? 'You will get one email when there is new work on that wall. Nothing else.'
          : 'It may already have been used. Ask to follow again from the artist’s page.'
      }
    />
  )
}
