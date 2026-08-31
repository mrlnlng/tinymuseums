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

  // Social preview: the first arranged work's framed image.
  const first = page.pieces[0]

  return {
    title: `${page.artistName} — ${BRAND}`,
    description: page.statement,
    openGraph: {
      title: `${page.artistName} — ${BRAND}`,
      description: page.statement,
      images: first?.frameUrl ? [first.frameUrl] : first?.imageUrl ? [first.imageUrl] : [],
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

  // The wall: each arranged work's framed image, in gallery order. Works still
  // processing (no frame yet) wait for their frame to appear here.
  const framed = page.pieces.filter((piece) => piece.frameUrl)

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

        {framed.length > 0 ? (
          <div className="wall-grid">
            {framed.map((piece) => (
              <img
                key={piece.id}
                src={piece.frameUrl ?? undefined}
                width={piece.frameWidth ?? undefined}
                height={piece.frameHeight ?? undefined}
                alt={`${piece.title}, framed`}
                className="wall-frame"
                loading="lazy"
              />
            ))}
          </div>
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
