/**
 * Seeds a browsable museum.
 *
 * Runs the real pipeline inline — upload, derivatives, compose, publish, seal —
 * rather than inserting pre-baked rows, so seeding also exercises every step
 * the worker performs. If seeding succeeds, the pipeline works.
 */

import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { closePool, ensureQrToken, query, queryOne, repoRoot } from '../packages/core/src/index.ts'
import { hashPassword, uniqueSlug } from '../packages/core/src/auth.ts'
import { createAssetFromUpload } from '../packages/core/src/uploads.ts'
import { setDisplay } from '../packages/core/src/artists.ts'
import { publishArtist } from '../packages/core/src/publish.ts'
import { layoutForCount } from '../packages/core/src/layouts.ts'
import { handleDerivatives, handleRenderDisplay, handleSealEpoch } from '../packages/core/src/handlers.ts'
import { mulberry32 } from '../packages/core/src/random.ts'

const PASSWORD = 'tinymuseum'

interface ArtistSeed {
  name: string
  statement: string
  hue: number
  medium: string
  works: number
}

const ARTISTS: ArtistSeed[] = [
  { name: 'Wen Li', statement: 'Ponds, swans, and the friends who sat with me while I painted them.', hue: 158, medium: 'Gouache on paper', works: 5 },
  { name: 'Mira Halloway', statement: 'Coastal light, painted from memory rather than from the shore.', hue: 196, medium: 'Oil on linen', works: 4 },
  { name: 'Tobias Renn', statement: 'Big machines, drawn small and soft until they stop being frightening.', hue: 24, medium: 'Acrylic on board', works: 6 },
  { name: 'Yusra Adeyemi', statement: 'People caught mid-thought, never once sitting still for me.', hue: 340, medium: 'Charcoal and wash', works: 3 },
  { name: 'Constance Iwu', statement: 'Plants I started drawing accurately and gave up on halfway.', hue: 128, medium: 'Watercolour and ink', works: 5 },
  { name: 'Petra Kalmár', statement: 'Rooms I have slept in, remembered as shapes instead of places.', hue: 42, medium: 'Screenprint', works: 4 },
  { name: 'Halvard Sten', statement: 'Places that only exist after midnight, and only for a moment.', hue: 232, medium: 'Silver gelatin print', works: 3 },
  { name: 'Nell Bracewell', statement: 'Very small paintings of very large weather.', hue: 8, medium: 'Gouache on paper', works: 4 },
]

const DESCRIPTIONS = [
  'This one was painted in a garden I was not strictly supposed to be sitting in.',
  'Worked on over eleven months, mostly at the end of the day when the light had already gone.',
  'The third attempt at this composition. The first two are still underneath it.',
  'Made from a photograph I took and then deliberately never looked at again.',
  'One of a pair. The other one lives with a friend now, which feels right.',
  'Started outdoors and finished from memory, which is why the proportions are a little wrong.',
  'Sanded back four times. What is left is mostly the fourth version of it.',
  'Painted quickly, in one sitting, after a long stretch of not painting at all.',
]

/**
 * The real paintings shipped in the asset pack.
 *
 * There are five, and the publish bar needs three works per artist, so they
 * repeat across artists — each artist gets a distinct set of three, offset so
 * no two walls are identical. Obviously seed data, but it is real art in a real
 * frame, which is what makes the hall worth looking at while tuning it.
 */
interface Artwork {
  title: string
  bytes: Buffer
}

async function loadArtworks(): Promise<Artwork[]> {
  const dir = join(repoRoot, 'apps/web/public/assets')
  const manifest = JSON.parse(await readFile(join(dir, 'manifest.json'), 'utf8')) as {
    artworks?: Array<{ file: string; title: string }>
  }

  if (!manifest.artworks || manifest.artworks.length === 0) {
    throw new Error('No artworks in the asset manifest — run scripts/prep_assets.py first')
  }

  return Promise.all(
    manifest.artworks.map(async (entry) => ({
      title: entry.title,
      bytes: await readFile(join(dir, entry.file)),
    })),
  )
}

// ---------------------------------------------------------------- seeding

const existing = await queryOne<{ count: number }>(`select count(*)::int as count from artists`)
if ((existing?.count ?? 0) > 0) {
  console.log('[seed] artists already exist — nothing to do (npm run db:reset to start over)')
  await closePool()
  process.exit(0)
}

const ARTWORKS = await loadArtworks()
console.log(`[seed] ${ARTWORKS.length} artworks: ${ARTWORKS.map((a) => a.title).join(', ')}`)

let artistIndex = 0

for (const seed of ARTISTS) {
  const rng = mulberry32(seed.hue * 7919)
  // Offset each artist's set so no two walls hang the same three works.
  const offset = artistIndex++ * 2
  const slug = await uniqueSlug(seed.name)
  const email = `${slug}@example.com`

  const artist = await queryOne<{ id: string }>(
    `insert into artists (slug, display_name, statement, email, password_hash)
     values ($1, $2, $3, $4, $5)
     returning id`,
    [slug, seed.name, seed.statement, email, await hashPassword(PASSWORD)],
  )
  if (!artist) throw new Error(`Could not create ${seed.name}`)

  const pieceIds: string[] = []

  for (let i = 0; i < seed.works; i++) {
    const artwork = ARTWORKS[(offset + i) % ARTWORKS.length]
    const assetId = await createAssetFromUpload(artist.id, 'image/jpeg', artwork.bytes)

    // Run the derivative job inline rather than waiting for a worker.
    await handleDerivatives(assetId)

    const piece = await queryOne<{ id: string }>(
      `insert into pieces (artist_id, asset_id, title, description, medium, year, dimensions, order_index, availability)
       values ($1, $2, $3, $4, $5, $6, $7, $8, 'available')
       returning id`,
      [
        artist.id,
        assetId,
        artwork.title,
        DESCRIPTIONS[Math.floor(rng() * DESCRIPTIONS.length)],
        seed.medium,
        2016 + Math.floor(rng() * 10),
        `${30 + Math.floor(rng() * 60)} x ${40 + Math.floor(rng() * 70)} cm`,
        i,
      ],
    )
    if (piece) pieceIds.push(piece.id)
  }

  // Hang a couple of works so the hall shows a mix of layouts.
  const hangCount = Math.min(pieceIds.length, 1 + Math.floor(rng() * 3))
  await setDisplay(artist.id, layoutForCount(hangCount), pieceIds.slice(0, hangCount))
  await handleRenderDisplay(artist.id)

  const report = await publishArtist(artist.id)
  if (!report.passed) {
    const failed = report.checks.filter((c) => !c.ok).map((c) => c.code).join(', ')
    console.warn(`[seed] ${seed.name} did not clear the publish bar: ${failed}`)
  }

  await ensureQrToken(artist.id, 'cafe poster')
  await ensureQrToken(artist.id, 'business card')

  console.log(`[seed] ${seed.name} — ${pieceIds.length} works, ${hangCount} hanging, /a/${slug}`)
}

// Clear the seal jobs publishing enqueued; we seal once, here.
await query(`update jobs set status = 'done' where kind = 'seal_epoch' and status = 'pending'`)
await handleSealEpoch()

console.log(`\n[seed] done. Sign in to the studio with any of:`)
for (const seed of ARTISTS.slice(0, 3)) {
  const row = await queryOne<{ slug: string }>(`select slug from artists where display_name = $1`, [
    seed.name,
  ])
  console.log(`         ${row?.slug}@example.com / ${PASSWORD}`)
}

await closePool()
