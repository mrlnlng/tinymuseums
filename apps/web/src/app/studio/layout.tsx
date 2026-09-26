import Link from 'next/link'
import { BRAND } from '@tiny/core'
import { currentArtist, isHallOwner } from '@/shared/lib/session'
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
            <Link href="/studio/gallery">Gallery</Link>
            <Link href="/studio/analytics">Visitors</Link>
            {isHallOwner(artist) ? <Link href="/studio/guestboard">Guest board</Link> : null}
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
