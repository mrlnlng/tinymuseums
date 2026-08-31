/* One-off rebuild for the per-piece change: re-renders every live artist's hanging pieces and seals a fresh epoch. Safe to re-run; not bound by the Lambda timeout. */
import { query, closePool } from '@tiny/core'
import { handleRenderDisplay, handleSealEpoch } from '@tiny/core/worker'

const artists = await query<{ id: string; name: string }>(
  `select a.id, a.display_name as name
     from artists a
     join displays d on d.artist_id = a.id
    where a.status = 'live'
      and d.hung_piece_ids is not null
      and array_length(d.hung_piece_ids, 1) > 0
    order by a.id`,
)

if (artists.length === 0) {
  console.log('[rebuild] no live artists with a hanging display — nothing to re-render')
}

let ok = 0
let failed = 0

for (const artist of artists) {
  const started = performance.now()
  try {
    await handleRenderDisplay(artist.id)
    const pieces = await query<{ c: number }>(
      `select count(*)::int as c from pieces where artist_id = $1 and flattened_key is not null`,
      [artist.id],
    )
    console.log(
      `[rebuild] ${artist.name}: re-rendered ${pieces[0]?.c ?? 0} piece(s) in ${Math.round(
        performance.now() - started,
      )}ms`,
    )
    ok++
  } catch (error) {
    console.error(
      `[rebuild] ${artist.name}: FAILED — ${error instanceof Error ? error.message : error}`,
    )
    failed++
  }
}

await handleSealEpoch()
console.log(`[rebuild] done: ${ok} re-rendered, ${failed} failed; sealed a fresh epoch`)
await closePool()
