import Link from 'next/link'
import { BRAND, countOpenBugReports, doorsState, locationStates } from '@tiny/core'
import StudioNav from '@/features/studio/components/StudioNav'
import { currentArtist, isHallOwner } from '@/shared/lib/session'
import '../../styles/studio.css'

export default async function StudioLayout({ children }: { children: React.ReactNode }) {
  const signedIn = await currentArtist()
  const owner = signedIn && isHallOwner(signedIn)

  if (!owner) {
    return (
      <>
        <header className="topbar">
          <Link className="brand" href="/">{BRAND}</Link>
          <nav><Link href="/studio/sign-in">Sign in</Link></nav>
        </header>
        <main className="page">{children}</main>
      </>
    )
  }

  const [openBugs, states, doors] = await Promise.all([countOpenBugReports(), locationStates(), doorsState()])
  return (
    <div className="st-shell">
      <StudioNav
        waiting={{ hang: states.filter((state) => state.unpublished).length, doors: doors.unpublished ? 1 : 0 }}
        openBugs={openBugs}
      />
      <main className="st-main">{children}</main>
    </div>
  )
}
