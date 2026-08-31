import { unsubscribe } from '@tiny/core'
import FollowNotice from '@/features/audience/components/FollowNotice'

export const dynamic = 'force-dynamic'

export default async function Unsubscribe({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams
  const ok = token ? await unsubscribe(token) : false

  return (
    <FollowNotice
      title={ok ? 'Unsubscribed' : 'Nothing to unsubscribe'}
      body={
        ok
          ? 'You will not hear from that wall again. No hard feelings.'
          : 'That link has already been used, or it was not one of ours.'
      }
    />
  )
}
