import Link from 'next/link'
import Message from '@/components/Message'
import { signInAction } from '../actions'

export default async function SignIn({
  searchParams,
}: {
  searchParams: Promise<{ m?: string; k?: string }>
}) {
  const { m, k } = await searchParams

  return (
    <>
      <h1 className="script" style={{ fontSize: 38 }}>
        Sign in
      </h1>
      <Message m={m} k={k} />

      <form action={signInAction} className="card">
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required autoComplete="email" />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
          />
        </div>
        <button className="button" type="submit">
          Sign in
        </button>
      </form>

      <p className="small muted">
        No wall yet? <Link href="/studio/register">Claim one</Link>.
        {/* The seed password is a development convenience; it has no business
            being printed on a production sign-in page. */}
        {process.env.NODE_ENV === 'production' ? null : (
          <>
            {' '}
            Seeded accounts use the password <code className="token">tinymuseum</code>.
          </>
        )}
      </p>
    </>
  )
}
