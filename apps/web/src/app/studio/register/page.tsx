import Link from 'next/link'
import Message from '@/components/Message'
import { registerAction } from '../actions'

export default async function Register({
  searchParams,
}: {
  searchParams: Promise<{ m?: string; k?: string }>
}) {
  const { m, k } = await searchParams

  return (
    <>
      <h1 className="script" style={{ fontSize: 38 }}>
        Claim a wall
      </h1>
      <p className="muted">
        Anyone can have one. Nobody is turned away on taste — there is just a short list of
        things a wall needs before it can hang.
      </p>

      <Message m={m} k={k} />

      <form action={registerAction} className="card">
        <div className="field">
          <label htmlFor="name">What should we call you?</label>
          <input id="name" name="name" required autoComplete="name" />
          <span className="hint">This is the name on your plaque.</span>
        </div>
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
            minLength={8}
            autoComplete="new-password"
          />
          <span className="hint">At least 8 characters.</span>
        </div>
        <button className="button" type="submit">
          Claim it
        </button>
      </form>

      <p className="small muted">
        Already have one? <Link href="/studio/sign-in">Sign in</Link>.
      </p>
      <p className="small muted">
        <Link href="/">Back to the entrance</Link>
      </p>
    </>
  )
}
