import { UploadRejected, queryOne, registerUpload } from '@tiny/core'
import { currentArtist } from '@/shared/lib/session'
import { isHttpUrl } from '@/shared/lib/validate'

export async function POST(request: Request) {
  const artist = await currentArtist()
  if (!artist) return Response.json({ error: 'Sign in first' }, { status: 401 })

  let body: {
    contentType?: string
    digest?: string
    title?: string
    description?: string
    shopUrl?: string
  }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const title = String(body.title ?? '').trim()
  if (!title) return Response.json({ error: 'Give the work a title' }, { status: 400 })

  const shopUrl = String(body.shopUrl ?? '').trim() || null
  if (shopUrl && !isHttpUrl(shopUrl)) {
    return Response.json({ error: 'The shop link must start with http:// or https://' }, { status: 400 })
  }

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
    `select case
              when coalesce(max(order_index), 0) >= 30 then 0
              else coalesce(max(order_index), 0) + 1
            end::int as next
       from pieces where artist_id = $1`,
    [artist.id],
  )

  const piece = await queryOne<{ id: string }>(
    `insert into pieces (artist_id, asset_id, title, description, order_index, shop_url)
     values ($1, $2, $3, $4, $5, $6)
     returning id`,
    [
      artist.id,
      assetId,
      title,
      String(body.description ?? '').trim(),
      next?.next ?? 0,
      shopUrl,
    ],
  )

  return Response.json({ ok: true, pieceId: piece?.id })
}
