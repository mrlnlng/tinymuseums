import type { PieceDto } from '@tiny/core'

const FRESH_MS = 60_000

const cache = new Map<string, { at: number; pieces: Promise<PieceDto[]> }>()

export function loadArtistPieces(slug: string): Promise<PieceDto[]> {
  const cached = cache.get(slug)
  if (cached && performance.now() - cached.at < FRESH_MS) return cached.pieces

  const pieces = fetch(`/api/artists/${slug}/pieces`)
    .then((response) => {
      if (!response.ok) throw new Error(`artist pieces ${response.status}`)
      return response.json() as Promise<{ pieces: PieceDto[] }>
    })
    .then((data) => [...data.pieces].sort((a, b) => a.orderIndex - b.orderIndex))
  const entry = { at: performance.now(), pieces }
  cache.set(slug, entry)
  pieces.catch(() => {
    if (cache.get(slug) === entry) cache.delete(slug)
  })
  return pieces
}
