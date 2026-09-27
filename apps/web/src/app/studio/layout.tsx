import Link from 'next/link'
import { BRAND, countOpenBugReports } from '@tiny/core'
import { currentArtist, isHallOwner } from '@/shared/lib/session'
import { signOutAction } from '@/features/studio/actions'

export default async function StudioLayout({ children }: { children: React.ReactNode }) {
  const artist = await currentArtist()
  const openBugs = artist && isHallOwner(artist) ? await countOpenBugReports() : 0

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
            {isHallOwner(artist) ? (
              <>
                <Link href="/studio/guestboard">Guest board</Link>
                <Link href="/studio/visits">Visits</Link>
                <Link href="/studio/performance">Performance</Link>
                <Link href="/studio/bugs">Bug reports{openBugs > 0 ? ` (${openBugs})` : ''}</Link>
              </>
            ) : null}
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
