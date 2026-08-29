import { UploadRejected, queryOne, registerUpload } from '@tiny/core'
import { currentArtist } from '@/lib/session'

/**
 * Step two of an upload: record the object the browser PUT, and hang metadata
 * on it. The worker takes it from here — validation, EXIF stripping, and the
 * derivative ladder all happen out of band.
 */
export async function POST(request: Request) {
  const artist = await currentArtist()
  if (!artist) return Response.json({ error: 'Sign in first' }, { status: 401 })

  let body: {
    contentType?: string
    digest?: string
    title?: string
    description?: string
    medium?: string
    year?: number
    dimensions?: string
    forSale?: boolean
  }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const title = String(body.title ?? '').trim()
  if (!title) return Response.json({ error: 'Give the work a title' }, { status: 400 })

  let assetId: string
  try {
    assetId = await registerUpload(
      artist.id,
      String(body.contentType ?? ''),
      String(body.digest ?? ''),
    )
  } catch (error) {
    if (error instanceof UploadRejected) {
      return Response.json({ error: error.message }, { status: 400 })
    }
    throw error
  }

  const next = await queryOne<{ next: number }>(
    `select coalesce(max(order_index) + 1, 0)::int as next from pieces where artist_id = $1`,
    [artist.id],
  )

  const piece = await queryOne<{ id: string }>(
    `insert into pieces (artist_id, asset_id, title, description, medium, year, dimensions, order_index, availability)
     values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     returning id`,
    [
      artist.id,
      assetId,
      title,
      String(body.description ?? '').trim(),
      String(body.medium ?? '').trim(),
      Number(body.year) || null,
      String(body.dimensions ?? '').trim() || null,
      next?.next ?? 0,
      body.forSale ? 'available' : 'not_for_sale',
    ],
  )

  return Response.json({ ok: true, pieceId: piece?.id })
}
