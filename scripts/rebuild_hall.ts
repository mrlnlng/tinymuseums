/**
 * Rebuilds the hall against a live database.
 *
 * A one-off for the per-piece change. After the 002 schema migration, no piece
 * has a per-piece frame yet (they were composited as collages under the old
 * code), so `sealEpoch` finds nothing and the hall is empty until every live
 * artist's hanging pieces are re-rendered and a fresh epoch is sealed over
 * pieces. Run it against the production database after the new worker code is
 * deployed, once:
 *
 *   DATABASE_URL='...' NODE_ENV=production STORAGE_DRIVER=s3 S3_BUCKET='...' \
 *   MEDIA_BASE_URL='...' node --experimental-strip-types scripts/rebuild_hall.ts
 *
 * It is safe to re-run: it re-renders the same pieces and seals a new epoch.
 * It runs as a plain process, so it is not bound by the Lambda timeout that
 * made the worker appear stuck on a display with several works.
 */
import { query, closePool } from '../packages/core/src/db.ts'
import { handleRenderDisplay, handleSealEpoch } from '../packages/core/src/handlers.ts'

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
