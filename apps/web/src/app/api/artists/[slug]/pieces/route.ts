import { getArtistPage } from '@tiny/core'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  const page = await getArtistPage(slug)

  if (!page) return Response.json({ error: 'Not found' }, { status: 404 })

  return Response.json(
    { artistId: page.artistId, artistName: page.artistName, pieces: page.pieces },
    { headers: { 'cache-control': 'public, max-age=60, stale-while-revalidate=300' } },
  )
}
