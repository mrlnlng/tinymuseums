/**
 * Wire and domain types shared by the web app and the worker.
 *
 * These are the shapes the hall client consumes, so changing them is a
 * contract change rather than an implementation detail.
 */

export type ArtistStatus = 'draft' | 'live' | 'suspended'
export type AssetStatus = 'pending' | 'ready' | 'failed'
export type Availability = 'not_for_sale' | 'available' | 'sold'
export type LayoutName = 'single' | 'pair' | 'trio' | 'quad'

/**
 * One framed piece's placement on the display canvas, in normalised
 * coordinates. Origin top-left, both axes 0..1. The rect covers the whole
 * frame including its ornament — that is what a visitor actually taps.
 */
export interface Placement {
  pieceId: string
  x: number
  y: number
  w: number
  h: number
}

export type RegionMap = Placement[]

/** A derivative produced by the image pipeline. */
export interface Derivative {
  variant: string
  key: string
  width: number
  height: number
  format: string
  bytes: number
}

export interface DisplayDto {
  artistId: string
  slug: string
  artistName: string
  statement: string
  layout: LayoutName
  /** Display canvas size in world units, so the renderer can size the plane. */
  canvas: { w: number; h: number }
  /** The flattened collage: one image for the whole display. */
  image: { url: string; width: number; height: number }
  regionMap: RegionMap
}

export interface HallSlotDto {
  index: number
  display: DisplayDto
}

export interface HallSliceDto {
  epochId: number
  slots: HallSlotDto[]
  /** Next index to request, or null at the end of the hall. */
  nextIndex: number | null
  totalSlots: number
}

export interface PieceDto {
  id: string
  title: string
  description: string
  medium: string
  year: number | null
  dimensions: string | null
  orderIndex: number
  imageUrl: string | null
  availability: Availability
  priceCents: number | null
  currency: string | null
}

export interface ArtistPageDto {
  artistId: string
  slug: string
  artistName: string
  statement: string
  display: DisplayDto | null
  pieces: PieceDto[]
}
