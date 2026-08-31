import { query, queryOne } from '../infra/db.ts'
import { pickDerivative } from '../media/derivatives.ts'
import { getStorage } from '../media/storage.ts'
import type { ArtistPageDto, Derivative, PieceDto } from '../types.ts'

/*  Reads and writes for an artist's own work: their pieces, and the page a QR code lands on. */

interface PieceRow {
  id: string
  title: string
  description: string
  medium: string
  year: number | null
  dimensions: string | null
  order_index: number
  shop_url: string | null
  flattened_key: string | null
  flattened_width: number | null
  flattened_height: number | null
  availability: PieceDto['availability']
  price_cents: number | null
  currency: string | null
  asset_status: string | null
  derivatives: Derivative[] | null
}

/** Widest sensible size for the enlarged view; the ladder tops out below this. */
const ENLARGED_WIDTH = 1600

function pieceImageUrl(derivatives: Derivative[] | null): string | null {
  const chosen = pickDerivative(derivatives ?? [], ENLARGED_WIDTH)
  return chosen ? getStorage().urlFor(chosen.key) : null
}

function toPieceDto(row: PieceRow): PieceDto {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    medium: row.medium,
    year: row.year,
    dimensions: row.dimensions,
    orderIndex: row.order_index,
    imageUrl: pieceImageUrl(row.derivatives),
    shopUrl: row.shop_url,
    frameUrl: row.flattened_key ? getStorage().urlFor(row.flattened_key) : null,
    frameWidth: row.flattened_width,
    frameHeight: row.flattened_height,
    availability: row.availability,
    priceCents: row.price_cents,
    currency: row.currency,
  }
}

/** The public body of work: arranged works (stands 1..30) in order. Works in
 *  storage (order_index 0) are private and never listed. */
export async function listPieces(artistId: string): Promise<PieceDto[]> {
  const rows = await query<PieceRow>(
    `select p.id, p.title, p.description, p.medium, p.year, p.dimensions,
            p.order_index, p.shop_url, p.availability, p.price_cents, p.currency,
            p.flattened_key, p.flattened_width, p.flattened_height,
            a.status as asset_status, a.derivatives
       from pieces p
       left join assets a on a.id = p.asset_id
      where p.artist_id = $1
        and p.order_index between 1 and 30
        and not exists (
          select 1 from suppressions s
           where s.subject_type = 'piece' and s.subject_id = p.id
        )
      order by p.order_index, p.created_at`,
    [artistId],
  )
  return rows.map(toPieceDto)
}

export async function getArtistPage(slug: string): Promise<ArtistPageDto | null> {
  const artist = await queryOne<{
    id: string
    slug: string
    display_name: string
    statement: string
  }>(
    `select a.id, a.slug, a.display_name, a.statement
       from artists a
      where a.slug = $1
        and a.status = 'live'
        and not exists (
          select 1 from suppressions s
           where s.subject_type = 'artist' and s.subject_id = a.id
        )`,
    [slug],
  )
  if (!artist) return null

  const pieces = await listPieces(artist.id)

  return {
    artistId: artist.id,
    slug: artist.slug,
    artistName: artist.display_name,
    statement: artist.statement,
    pieces,
  }
}
