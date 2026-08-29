import Link from 'next/link'
import { confirmFollow } from '@tiny/core'

export const dynamic = 'force-dynamic'

export default async function ConfirmFollow({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams
  const ok = token ? await confirmFollow(token) : false

  return (
    <main className="page">
      <h1 className="script" style={{ fontSize: 40 }}>
        {ok ? 'You are on the list' : 'That link has expired'}
      </h1>
      <p>
        {ok
          ? 'You will get one email when there is new work on that wall. Nothing else.'
          : 'It may already have been used. Ask to follow again from the artist’s page.'}
      </p>
      <Link className="button" href="/">
        Walk the museum
      </Link>
    </main>
  )
}
