import { getStorage, query } from '@tiny/core'
import { json } from '@/shared/lib/member-route'
import { currentArtist, isHallOwner } from '@/shared/lib/session'

interface PaintingRow {
  id: string
  title: string
  flattened_key: string
  flattened_width: number | null
  flattened_height: number | null
}

export async function GET() {
  const artist = await currentArtist()
  if (!artist) return json({ error: 'unauthorized' }, 401)
  if (!isHallOwner(artist)) return json({ error: 'forbidden' }, 403)

  const rows = await query<PaintingRow>(
    `select p.id, p.title, p.flattened_key, p.flattened_width, p.flattened_height
       from pieces p
      where p.artist_id = $1
        and p.flattened_key is not null
      order by p.order_index, p.created_at`,
    [artist.id],
  )

  const storage = getStorage()
  return json({
    paintings: rows.map((row) => ({
      id: row.id,
      title: row.title,
      imageUrl: storage.urlFor(row.flattened_key),
      width: row.flattened_width ?? 0,
      height: row.flattened_height ?? 0,
    })),
  })
}
