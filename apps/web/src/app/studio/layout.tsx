import Link from 'next/link'
import { BRAND } from '@tiny/core'
import { currentArtist } from '@/shared/lib/session'
import { signOutAction } from '@/features/studio/actions'

export default async function StudioLayout({ children }: { children: React.ReactNode }) {
  const artist = await currentArtist()

  return (
    <>
      <header className="topbar">
        <Link className="brand" href="/">
          {BRAND}
        </Link>
        {artist ? (
          <nav>
            <Link href="/studio">Wall</Link>
            <Link href="/studio/pieces">Works</Link>
            <Link href="/studio/display">Arrange</Link>
            <Link href="/studio/codes">Codes</Link>
            <Link href="/studio/analytics">Visitors</Link>
            <Link href={`/a/${artist.slug}`}>View</Link>
            <form action={signOutAction}>
              <button type="submit" className="nav-button">
                Sign out
              </button>
            </form>
          </nav>
        ) : (
          <nav>
            <Link href="/studio/sign-in">Sign in</Link>
            <Link href="/studio/register">Claim a wall</Link>
          </nav>
        )}
      </header>
      <main className="page">{children}</main>
    </>
  )
}
