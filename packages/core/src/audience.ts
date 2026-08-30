import { newToken } from './auth.ts'
import { query, queryOne } from './db.ts'
import { followConfirmation, getMailer, inquiryNotice } from './mail.ts'

/**
 * Everything a visitor can do: arrive by QR code, follow an artist, and ask
 * about a work.
 *
 * Visitors have no accounts. Following captures an email and confirms it;
 * inquiring sends a message to the artist and gets out of the way. The
 * platform never touches the transaction.
 */

export type EventKind = 'display_view' | 'piece_view' | 'scan' | 'inquiry'

export async function recordEvent(
  kind: EventKind,
  input: { artistId?: string; pieceId?: string; placement?: string },
): Promise<void> {
  await query(
    `insert into events (kind, artist_id, piece_id, placement) values ($1, $2, $3, $4)`,
    [kind, input.artistId ?? null, input.pieceId ?? null, input.placement ?? null],
  )
}

// ---------------------------------------------------------------- qr codes

export interface ResolvedToken {
  artistId: string
  slug: string
  placement: string
}

export async function resolveQrToken(token: string): Promise<ResolvedToken | null> {
  return queryOne<ResolvedToken>(
    `select q.artist_id as "artistId", a.slug, q.placement
       from qr_tokens q
       join artists a on a.id = q.artist_id
      where q.token = $1 and q.revoked_at is null`,
    [token],
  )
}

export async function listQrTokens(artistId: string) {
  return query<{ token: string; placement: string; scans: number; revoked: boolean }>(
    `select q.token,
            q.placement,
            (select count(*)::int from events e
              where e.kind = 'scan' and e.artist_id = q.artist_id and e.placement = q.placement) as scans,
            (q.revoked_at is not null) as revoked
       from qr_tokens q
      where q.artist_id = $1
      order by q.created_at`,
    [artistId],
  )
}

/**
 * A code per placement, so "the café poster outperforms the business card" is
 * answerable. Reusing an existing token keeps already-printed codes valid.
 */
export async function ensureQrToken(artistId: string, placement: string): Promise<string> {
  const existing = await queryOne<{ token: string }>(
    `select token from qr_tokens
      where artist_id = $1 and placement = $2 and revoked_at is null`,
    [artistId, placement],
  )
  if (existing) return existing.token

  const token = newToken(9)
  await query(`insert into qr_tokens (token, artist_id, placement) values ($1, $2, $3)`, [
    token,
    artistId,
    placement,
  ])
  return token
}

// ---------------------------------------------------------------- following

export async function follow(artistSlug: string, email: string): Promise<'sent' | 'unknown'> {
  const artist = await queryOne<{ id: string; display_name: string }>(
    `select id, display_name from artists where slug = $1 and status = 'live'`,
    [artistSlug],
  )
  if (!artist) return 'unknown'

  const confirmToken = newToken(24)
  const unsubscribeToken = newToken(24)

  // Re-following an artist reissues the confirmation rather than erroring, so
  // a visitor who lost the email can simply ask again.
  const row = await queryOne<{ confirm_token: string; confirmed_at: Date | null }>(
    `insert into follows (artist_id, email, confirm_token, unsubscribe_token)
     values ($1, $2, $3, $4)
     on conflict (artist_id, email) do update set confirm_token = excluded.confirm_token
     returning confirm_token, confirmed_at`,
    [artist.id, email, confirmToken, unsubscribeToken],
  )

  if (row && !row.confirmed_at) {
    const message = followConfirmation(artist.display_name, row.confirm_token)
    await getMailer().send({ to: email, ...message })
  }
  return 'sent'
}

export async function confirmFollow(token: string): Promise<boolean> {
  const rows = await query(
    `update follows set confirmed_at = now()
      where confirm_token = $1 and confirmed_at is null
      returning id`,
    [token],
  )
  return rows.length > 0
}

export async function unsubscribe(token: string): Promise<boolean> {
  const rows = await query(`delete from follows where unsubscribe_token = $1 returning id`, [token])
  return rows.length > 0
}

export async function confirmedFollowers(artistId: string): Promise<
  Array<{ email: string; unsubscribe_token: string }>
> {
  return query(
    `select email, unsubscribe_token from follows
      where artist_id = $1 and confirmed_at is not null`,
    [artistId],
  )
}

// ---------------------------------------------------------------- inquiries

export async function createInquiry(
  pieceId: string,
  fromEmail: string,
  message: string,
): Promise<boolean> {
  const piece = await queryOne<{ title: string; artist_id: string; artist_email: string }>(
    `select p.title, p.artist_id, a.email as artist_email
       from pieces p
       join artists a on a.id = p.artist_id
      where p.id = $1 and a.status = 'live'`,
    [pieceId],
  )
  if (!piece) return false

  await query(`insert into inquiries (piece_id, from_email, message) values ($1, $2, $3)`, [
    pieceId,
    fromEmail,
    message,
  ])
  await recordEvent('inquiry', { artistId: piece.artist_id, pieceId })

  const notice = inquiryNotice(piece.title, fromEmail, message)
  await getMailer().send({ to: piece.artist_email, ...notice })
  return true
}

// ---------------------------------------------------------------- analytics

export interface AnalyticsSummary {
  displayViews: number
  pieceViews: number
  inquiries: number
  followers: number
  scansByPlacement: Array<{ placement: string; scans: number }>
  topPieces: Array<{ pieceId: string; title: string; views: number }>
}

export async function analyticsFor(artistId: string): Promise<AnalyticsSummary> {
  // Four independent queries: run them concurrently so the dashboard pays one
  // round-trip of latency, not four in series.
  const [totals, followers, scansByPlacement, topPieces] = await Promise.all([
    queryOne<{
      display_views: number
      piece_views: number
      inquiries: number
    }>(
      `select count(*) filter (where kind = 'display_view')::int as display_views,
              count(*) filter (where kind = 'piece_view')::int   as piece_views,
              count(*) filter (where kind = 'inquiry')::int      as inquiries
         from events where artist_id = $1`,
      [artistId],
    ),
    queryOne<{ count: number }>(
      `select count(*)::int as count from follows where artist_id = $1 and confirmed_at is not null`,
      [artistId],
    ),
    query<{ placement: string; scans: number }>(
      `select coalesce(placement, 'unknown') as placement, count(*)::int as scans
         from events
        where artist_id = $1 and kind = 'scan'
        group by 1
        order by scans desc`,
      [artistId],
    ),
    query<{ pieceId: string; title: string; views: number }>(
      `select p.id as "pieceId", p.title, count(e.id)::int as views
         from pieces p
         left join events e on e.piece_id = p.id and e.kind = 'piece_view'
        where p.artist_id = $1
        group by p.id, p.title
        order by views desc, p.title
        limit 10`,
      [artistId],
    ),
  ])

  return {
    displayViews: totals?.display_views ?? 0,
    pieceViews: totals?.piece_views ?? 0,
    inquiries: totals?.inquiries ?? 0,
    followers: followers?.count ?? 0,
    scansByPlacement,
    topPieces,
  }
}
