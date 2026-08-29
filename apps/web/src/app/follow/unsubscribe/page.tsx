import Link from 'next/link'
import { unsubscribe } from '@tiny/core'

export const dynamic = 'force-dynamic'

export default async function Unsubscribe({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams
  const ok = token ? await unsubscribe(token) : false

  return (
    <main className="page">
      <h1 className="script" style={{ fontSize: 40 }}>
        {ok ? 'Unsubscribed' : 'Nothing to unsubscribe'}
      </h1>
      <p>
        {ok
          ? 'You will not hear from that wall again. No hard feelings.'
          : 'That link has already been used, or it was not one of ours.'}
      </p>
      <Link className="button" href="/">
        Walk the museum
      </Link>
    </main>
  )
}
