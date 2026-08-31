import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BRAND, getArtistPage, recordEvent } from '@tiny/core'
import FollowForm from '@/features/audience/components/FollowForm'

/* An artist's own page: the QR destination. Server-rendered so it is fast on cellular, previewable when shared, and findable. */

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const page = await getArtistPage(slug)
  if (!page) return { title: 'Not in the museum' }

  return {
    title: `${page.artistName} — ${BRAND}`,
    description: page.statement,
    openGraph: {
      title: `${page.artistName} — ${BRAND}`,
      description: page.statement,
      images: page.display ? [page.display.image.url] : [],
    },
  }
}

export default async function ArtistPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ from?: string }>
}) {
  const { slug } = await params
  const { from } = await searchParams

  const page = await getArtistPage(slug)
  if (!page) notFound()

  await recordEvent('display_view', { artistId: page.artistId })

  return (
    <>
      <header className="topbar">
        <Link className="brand" href="/">
          {BRAND}
        </Link>
        <nav>
          <Link href="/museum">Walk the museum</Link>
        </nav>
      </header>

      <main className="page">
        {from === 'qr' ? (
          <p className="notice ok">
            You scanned {page.artistName}&rsquo;s code. This wall is theirs.
          </p>
        ) : null}

        <h1 className="script artist-name">{page.artistName}</h1>
        <p className="muted lead">{page.statement}</p>

        {page.display ? (
          <img
            src={page.display.image.url}
            width={page.display.image.width}
            height={page.display.image.height}
            alt={`${page.artistName}'s display`}
            className="display-image"
          />
        ) : (
          <p className="notice bad">This wall is being hung right now. Come back shortly.</p>
        )}

        <h2 className="section-title">Everything on this wall</h2>
        <div className="grid two">
          {page.pieces.map((piece) => (
            <article key={piece.id} className="card">
              <div
                className="thumb"
                style={
                  piece.imageUrl ? { backgroundImage: `url(${piece.imageUrl})` } : undefined
                }
                role="img"
                aria-label={piece.title}
              />
              <h3 className="piece-title">{piece.title}</h3>
              <p className="small muted piece-meta">
                {piece.medium}
                {piece.year ? `, ${piece.year}` : ''}
                {piece.dimensions ? ` · ${piece.dimensions}` : ''}
              </p>
              <p className="small piece-desc">{piece.description}</p>
            </article>
          ))}
        </div>

        <div className="follow-block">
          <FollowForm slug={page.slug} artistName={page.artistName} />
        </div>

        <p>
          <Link className="button secondary" href="/museum">
            Walk into the museum
          </Link>
        </p>
      </main>
    </>
  )
}
