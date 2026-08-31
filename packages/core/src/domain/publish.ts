import { query, queryOne } from '../infra/db.ts'
import { enqueue } from '../infra/jobs.ts'

/* The publish bar: objective gates — enough works, a description on each, images large enough — that filter empty and careless displays without anyone exercising taste. */

export const MIN_PIECES = 3
export const MIN_DESCRIPTION_CHARS = 20

export interface PublishCheck {
  code: string
  label: string
  ok: boolean
  detail: string
}

export interface PublishReport {
  passed: boolean
  checks: PublishCheck[]
}

export async function evaluatePublishBar(artistId: string): Promise<PublishReport> {
  // The two lookups are independent; run them together so the studio home pays
  // one round-trip of latency rather than two.
  const [counts, display] = await Promise.all([
    queryOne<{
      total: number
      ready: number
      described: number
    }>(
      `select count(*)::int                                              as total,
              count(*) filter (where asset.status = 'ready')::int        as ready,
              count(*) filter (where length(trim(p.description)) >= $2)::int as described
         from pieces p
         left join assets asset on asset.id = p.asset_id
        where p.artist_id = $1`,
      [artistId, MIN_DESCRIPTION_CHARS],
    ),
    queryOne<{ hung: number; rendered: boolean }>(
      `select coalesce(array_length(hung_piece_ids, 1), 0)::int as hung,
              (flattened_key is not null)                      as rendered
         from displays
        where artist_id = $1`,
      [artistId],
    ),
  ])

  const total = counts?.total ?? 0
  const ready = counts?.ready ?? 0
  const described = counts?.described ?? 0

  const checks: PublishCheck[] = [
    {
      code: 'min_pieces',
      label: `At least ${MIN_PIECES} works`,
      ok: total >= MIN_PIECES,
      detail: `${total} uploaded`,
    },
    {
      code: 'images_ready',
      label: 'Every work has a processed image',
      ok: total > 0 && ready === total,
      detail: `${ready} of ${total} ready`,
    },
    {
      code: 'descriptions',
      label: `Every work has a description of ${MIN_DESCRIPTION_CHARS}+ characters`,
      ok: total > 0 && described === total,
      detail: `${described} of ${total} written`,
    },
    {
      code: 'display_arranged',
      label: 'A display has been arranged',
      ok: (display?.hung ?? 0) > 0,
      detail: display ? `${display.hung} hanging` : 'not arranged yet',
    },
    {
      code: 'display_rendered',
      label: 'The display has been composed',
      ok: Boolean(display?.rendered),
      detail: display?.rendered ? 'ready' : 'waiting for the compositor',
    },
  ]

  return { passed: checks.every((c) => c.ok), checks }
}

/* Takes a display live — visible at the next epoch, the cost of snapshot ordering; sealing is enqueued immediately so the wait is seconds. */
export async function publishArtist(artistId: string): Promise<PublishReport> {
  const report = await evaluatePublishBar(artistId)
  if (!report.passed) return report

  await query(
    `update artists
        set status = 'live',
            published_at = coalesce(published_at, now())
      where id = $1`,
    [artistId],
  )
  await enqueue('seal_epoch', { reason: 'publish', artistId })

  return report
}

export async function unpublishArtist(artistId: string): Promise<void> {
  await query(`update artists set status = 'draft' where id = $1`, [artistId])
  // Suppression is what makes this immediate; the epoch snapshot alone would
  // keep the display visible until the next boundary.
  await query(
    `insert into suppressions (subject_type, subject_id, reason)
     values ('artist', $1, 'unpublished by artist')
     on conflict (subject_type, subject_id) do nothing`,
    [artistId],
  )
}

export async function republishArtist(artistId: string): Promise<void> {
  await query(`delete from suppressions where subject_type = 'artist' and subject_id = $1`, [
    artistId,
  ])
}
