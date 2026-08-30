import { query, queryOne } from './db.ts'
import { pickDerivative } from './derivatives.ts'
import { enqueue } from './jobs.ts'
import { LAYOUTS, composeLayout } from './layouts.ts'
import { getStorage } from './storage.ts'
import type { ArtistPageDto, Derivative, DisplayDto, LayoutName, PieceDto, RegionMap } from './types.ts'

/**
 * Reads and writes for an artist's own work: their pieces, their display, and
 * the page a QR code lands on.
 */

interface PieceRow {
  id: string
  title: string
  description: string
  medium: string
  year: number | null
  dimensions: string | null
  order_index: number
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
    availability: row.availability,
    priceCents: row.price_cents,
    currency: row.currency,
  }
}

export async function listPieces(artistId: string): Promise<PieceDto[]> {
  const rows = await query<PieceRow>(
    `select p.id, p.title, p.description, p.medium, p.year, p.dimensions,
            p.order_index, p.availability, p.price_cents, p.currency,
            a.status as asset_status, a.derivatives
       from pieces p
       left join assets a on a.id = p.asset_id
      where p.artist_id = $1
        and not exists (
          select 1 from suppressions s
           where s.subject_type = 'piece' and s.subject_id = p.id
        )
      order by p.order_index, p.created_at`,
    [artistId],
  )
  return rows.map(toPieceDto)
}

interface DisplayRow {
  layout: LayoutName
  flattened_key: string | null
  flattened_width: number | null
  flattened_height: number | null
  region_map: RegionMap | null
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

  // The display and the pieces are independent once the artist is known.
  const [displayRow, pieces] = await Promise.all([
    queryOne<DisplayRow>(
      `select layout, flattened_key, flattened_width, flattened_height, region_map
         from displays where artist_id = $1`,
      [artist.id],
    ),
    listPieces(artist.id),
  ])

  let display: DisplayDto | null = null
  if (displayRow?.flattened_key) {
    display = {
      artistId: artist.id,
      slug: artist.slug,
      artistName: artist.display_name,
      statement: artist.statement,
      layout: displayRow.layout,
      canvas: LAYOUTS[displayRow.layout].canvas,
      image: {
        url: getStorage().urlFor(displayRow.flattened_key),
        width: displayRow.flattened_width ?? 0,
        height: displayRow.flattened_height ?? 0,
      },
      regionMap: displayRow.region_map ?? [],
    }
  }

  return {
    artistId: artist.id,
    slug: artist.slug,
    artistName: artist.display_name,
    statement: artist.statement,
    display,
    pieces,
  }
}

export interface StudioDisplay {
  layout: LayoutName
  hungPieceIds: string[]
  rendered: boolean
  imageUrl: string | null
  version: number
}

export async function getStudioDisplay(artistId: string): Promise<StudioDisplay> {
  const row = await queryOne<{
    layout: LayoutName
    hung_piece_ids: string[]
    flattened_key: string | null
    version: number
  }>(
    `select layout, hung_piece_ids, flattened_key, version
       from displays where artist_id = $1`,
    [artistId],
  )

  if (!row) {
    await query(`insert into displays (artist_id) values ($1) on conflict do nothing`, [artistId])
    return { layout: 'single', hungPieceIds: [], rendered: false, imageUrl: null, version: 0 }
  }

  return {
    layout: row.layout,
    hungPieceIds: row.hung_piece_ids ?? [],
    rendered: Boolean(row.flattened_key),
    imageUrl: row.flattened_key ? getStorage().urlFor(row.flattened_key) : null,
    version: row.version,
  }
}

/**
 * Saves which works hang and how they are arranged, then hands compositing to
 * the worker. The composition is stored rather than recomputed so a full
 * drag-and-place composer can later write the same field.
 */
export async function setDisplay(
  artistId: string,
  layout: LayoutName,
  pieceIds: string[],
): Promise<void> {
  const capacity = LAYOUTS[layout].capacity
  const hung = pieceIds.slice(0, capacity)

  // Only works this artist owns, and only ones with a processed image.
  const owned = await query<{ id: string }>(
    `select p.id
       from pieces p
       join assets a on a.id = p.asset_id
      where p.artist_id = $1 and p.id = any($2::uuid[]) and a.status = 'ready'`,
    [artistId, hung],
  )
  const allowed = new Set(owned.map((r) => r.id))
  const filtered = hung.filter((id) => allowed.has(id))

  const composition = composeLayout(layout, filtered)

  await query(
    `insert into displays (artist_id, layout, hung_piece_ids, composition, region_map, version, updated_at)
     values ($1, $2, $3::uuid[], $4::jsonb, $4::jsonb, 1, now())
     on conflict (artist_id) do update
        set layout = excluded.layout,
            hung_piece_ids = excluded.hung_piece_ids,
            composition = excluded.composition,
            region_map = excluded.region_map,
            version = displays.version + 1,
            updated_at = now()`,
    [artistId, layout, filtered, JSON.stringify(composition)],
  )

  await enqueue('render_display', { artistId })
}
