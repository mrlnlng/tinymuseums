/*  Wire and domain types shared by the web app and the worker — the shapes the hall client consumes, so changing them is a contract change. */

export type ArtistStatus = 'draft' | 'live' | 'suspended'
export type AssetStatus = 'pending' | 'ready' | 'failed'
export type Availability = 'not_for_sale' | 'available' | 'sold'

/** A derivative produced by the image pipeline. */
export interface Derivative {
  variant: string
  key: string
  width: number
  height: number
  format: string
  bytes: number
}

/* One painting, hung on its own wall in the hall — unlike a DisplayDto, each slot is a single framed work rendered to its own image, so a landscape work gets a landscape frame; the client tags it with pieceId for hit testing. */
export interface HallPieceDto {
  pieceId: string
  artistId: string
  slug: string
  artistName: string
  title: string
  /** The artist's own blurb (crawlable lists); the plaque shows `description`. */
  statement: string
  /** The work's description — what a visitor reads standing in front of it. */
  description: string
  /** The framed painting's size in world units. */
  canvas: { w: number; h: number }
  image: { url: string; width: number; height: number }
}

export interface HallSlotDto {
  index: number
  display: HallPieceDto
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
  /** Where "Shop print" goes, if the artist set one. */
  shopUrl: string | null
  /** The work's own framed image (what hangs in the hall). */
  frameUrl: string | null
  frameWidth: number | null
  frameHeight: number | null
  availability: Availability
  priceCents: number | null
  currency: string | null
}

export interface ArtistPageDto {
  artistId: string
  slug: string
  artistName: string
  statement: string
  /** The arranged works (stands 1..30) in order — what a visitor can see. */
  pieces: PieceDto[]
}
