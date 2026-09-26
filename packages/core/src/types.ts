export type ArtistStatus = 'draft' | 'live' | 'suspended'
export type AssetStatus = 'pending' | 'ready' | 'failed'
export type Availability = 'not_for_sale' | 'available' | 'sold'

export interface Derivative {
  variant: string
  key: string
  width: number
  height: number
  format: string
  bytes: number
}

export interface HallPieceDto {
  pieceId: string
  artistId: string
  slug: string
  artistName: string
  title: string
  statement: string
  description: string
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
  shopUrl: string | null
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
  pieces: PieceDto[]
}

export type GuestNoteColor = 'pink' | 'green'

export interface GuestNoteDto {
  id: string
  name: string
  message: string
  color: GuestNoteColor
  createdAt: string
}

export interface GuestNotePageDto {
  notes: GuestNoteDto[]
  nextCursor: string | null
}

export interface SketchRoundDto {
  epochId: number
  round: number
  poolSize: number
  answer: {
    pieceId: string
    title: string
    artistName: string
    slug: string
    sketch: { url: string; width: number; height: number }
    image: { url: string }
    detail: { url: string }
  }
  choices: { pieceId: string; title: string }[]
}
