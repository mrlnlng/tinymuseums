import { Suspense } from 'react'
import Link from 'next/link'
import { BRAND } from '@tiny/core'
import manifest from '@/generated/asset-manifest.json'
import MediaPreconnect from '@/shared/components/MediaPreconnect'
import { firstSlice } from '@/features/hall/lib/slice'
import AssetImage from '@/shared/components/AssetImage'
import LandingAccount from '@/features/landing/LandingAccount'
import LandingFx from '@/features/landing/LandingFx'
import { builtUrl } from '@/shared/lib/assets'

export const dynamic = 'force-dynamic'

const [BRAND_OWNER, ...BRAND_REST] = BRAND.split(' ')

function Decor({ name, className }: { name: keyof typeof manifest.atelier; className: string }) {
  const { src, width, height } = manifest.atelier[name]
  return <img className={className} src={builtUrl(src)} width={width} height={height} alt="" />
}

export default function LandingPage() {
  return (
    <main className="landing">
      <MediaPreconnect />

      <div className="landing-scene" aria-hidden="true">
        <div className="landing-wall" />

        <div className="landing-portrait is-wink" data-poke>
          <Decor name="portraitWink" className="landing-portrait-frame" />
        </div>
        <div className="landing-portrait is-jiji" data-poke>
          <Decor name="portraitJiji" className="landing-portrait-frame" />
        </div>
        <div className="landing-portrait is-bunny" data-poke>
          <Decor name="portraitBunny" className="landing-portrait-frame" />
          <Decor name="ribbon" className="landing-portrait-bow" />
        </div>
        <div className="landing-portrait is-bruce" data-poke>
          <Decor name="portraitBruce" className="landing-portrait-frame" />
          <Decor name="ribbonBlue" className="landing-portrait-bow" />
        </div>

        <div className="landing-floor" />
        <div className="landing-valance" />

        <div className="landing-prop is-cabinet">
          <Decor name="cabinet" className="landing-cabinet" />
          <Decor name="jewelryBox" className="landing-jewelry" />
          <Decor name="perfume" className="landing-perfume" />
        </div>
        <div className="landing-prop is-lectern">
          <Decor name="column" className="landing-column" />
          <AssetImage name="landing/book" className="landing-book" />
        </div>
        <div className="landing-prop is-cat">
          <AssetImage name="landing/cat" className="landing-cat" />
        </div>
      </div>

      <LandingFx />

      <div className="landing-body">
        <div className="welcome-plaque">
          <span className="welcome-kicker">Welcome to</span>
          <h1 className="script welcome-title">
            {BRAND_OWNER}
            <br />
            {BRAND_REST.join(' ')}
          </h1>
        </div>

        <p className="landing-tagline">
          <span className="landing-tagline-a">The guards went home....</span>
          <wbr />
          <span className="landing-tagline-b">The paintings woke up.</span>
        </p>

        <Link className="landing-button is-start" href="/museum" data-track="start_visit">
          Start visit
        </Link>
        <LandingAccount />
      </div>

      <Suspense fallback={null}>
        <CurrentlyShowing />
      </Suspense>
    </main>
  )
}

async function CurrentlyShowing() {
  const slice = await firstSlice(8)
  const showing = [...new Map(slice.slots.map((slot) => [slot.display.artistId, slot.display])).values()]

  return (
    <nav className="offscreen" aria-label="Artists currently showing">
      <h2>Currently showing</h2>
      {showing.length > 0 ? (
        <ul>
          {showing.map((display) => (
            <li key={display.artistId}>
              <Link href={`/a/${display.slug}`}>{display.artistName}</Link> — {display.statement}
            </li>
          ))}
        </ul>
      ) : (
        <p>Nothing is hanging yet.</p>
      )}
      <p>
        <Link href="/studio/sign-in">Artists: sign in</Link>
      </p>
    </nav>
  )
}
