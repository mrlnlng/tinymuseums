import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BRAND, getArtistPage, recordEvent } from '@tiny/core'
import FollowForm from '@/components/FollowForm'

/**
 * An artist's own page: the QR destination.
 *
 * Server-rendered because this is what a stranger scanning a café poster
 * lands on. It has to be fast on cellular, it has to preview properly when
 * shared, and it has to be findable — none of which a client-only canvas can
 * do. The hall is discovery; this is the artist's own front door.
 */

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

        <h1 className="script" style={{ fontSize: 46, marginBottom: 6 }}>
          {page.artistName}
        </h1>
        <p className="muted" style={{ marginTop: 0 }}>
          {page.statement}
        </p>

        {page.display ? (
          <img
            src={page.display.image.url}
            width={page.display.image.width}
            height={page.display.image.height}
            alt={`${page.artistName}'s display`}
            style={{ width: '100%', height: 'auto', margin: '18px 0 26px' }}
          />
        ) : (
          <p className="notice bad">This wall is being hung right now. Come back shortly.</p>
        )}

        <h2 style={{ fontSize: 20 }}>Everything on this wall</h2>
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
              <h3 style={{ fontSize: 15, margin: '12px 0 2px' }}>{piece.title}</h3>
              <p className="small muted" style={{ margin: '0 0 8px' }}>
                {piece.medium}
                {piece.year ? `, ${piece.year}` : ''}
                {piece.dimensions ? ` · ${piece.dimensions}` : ''}
              </p>
              <p className="small" style={{ margin: 0 }}>
                {piece.description}
              </p>
            </article>
          ))}
        </div>

        <div style={{ marginTop: 30 }}>
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
