import { STARTER_PROPS } from '../economy/catalog.ts'
import { env } from '../infra/env.ts'
import { query, queryOne, transaction } from '../infra/db.ts'
import { mulberry32 } from '../infra/random.ts'
import { parsePlacements, validatePlacements, type Placement, type PlacementOwnership } from '../rooms/placements.ts'
import { THEMES, type ThemeId } from '../rooms/themes.ts'
import { newToken } from './auth.ts'
import { nameOf } from './members.ts'
import { sealEpoch } from './epoch.ts'

export type RoomKind = 'shared' | 'personal'
export type RoomVisibility = 'private' | 'link'

export interface RoomRow {
  slug: string
  theme: ThemeId
  kind: RoomKind
  ownerMemberId: string | null
  visibility: RoomVisibility
  shareToken: string | null
  draft: Placement[]
  draftVersion: number
  published: Placement[]
  publishedAt: Date | null
}

export interface RoomAccess {
  memberId?: string | null
  isOwnerArtist?: boolean
}

export type SaveDraftResult =
  | { ok: true; version: number }
  | { ok: false; reason: 'conflict'; version: number; draft: Placement[] }
  | { ok: false; reason: string; id?: string }

interface RoomDbRow {
  slug: string
  theme: string
  kind: RoomKind
  ownerMemberId: string | null
  visibility: RoomVisibility
  shareToken: string | null
  draft: unknown
  draftVersion: number
  published: unknown
  publishedAt: Date | null
}

const ROOM_COLUMNS = `slug, theme, kind,
  owner_member_id as "ownerMemberId", visibility,
  share_token as "shareToken", draft, draft_version as "draftVersion", published,
  published_at as "publishedAt"`

const SLUG_CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789'

function toRoom(row: RoomDbRow): RoomRow {
  return {
    slug: row.slug,
    theme: row.theme as ThemeId,
    kind: row.kind,
    ownerMemberId: row.ownerMemberId,
    visibility: row.visibility,
    shareToken: row.shareToken,
    draft: parsePlacements(row.draft) ?? [],
    draftVersion: row.draftVersion,
    published: parsePlacements(row.published) ?? [],
    publishedAt: row.publishedAt,
  }
}

function roomSlug(): string {
  const random = mulberry32(Math.floor(Math.random() * 0xffffffff))
  let slug = 'r-'
  for (let i = 0; i < 8; i++) slug += SLUG_CHARS[Math.floor(random() * SLUG_CHARS.length)]
  return slug
}

function starterPlacements(): Placement[] {
  return [
    { id: 'starter-shelf', kind: 'prop', ref: 'shelf', zone: 'wall', x: 4 },
    { id: 'starter-carpet', kind: 'prop', ref: 'carpet', zone: 'floor', x: 6.5 },
    { id: 'starter-pillow', kind: 'prop', ref: 'pillow-red', zone: 'floor', x: 8.2 },
  ]
}

export async function getRoom(slug: string): Promise<RoomRow | null> {
  const row = await queryOne<RoomDbRow>(`select ${ROOM_COLUMNS} from rooms where slug = $1`, [slug])
  return row ? toRoom(row) : null
}

export async function personalRoomFor(memberId: string): Promise<RoomRow> {
  return transaction(async (client) => {
    await client.query(`select pg_advisory_xact_lock(hashtext($1))`, [`personal-room:${memberId}`])
    const existing = await client.query<RoomDbRow>(
      `select ${ROOM_COLUMNS} from rooms where kind = 'personal' and owner_member_id = $1`,
      [memberId],
    )
    if (existing.rows[0]) return toRoom(existing.rows[0])

    for (const itemId of STARTER_PROPS) {
      await client.query(
        `insert into wallet_items (member_id, item_id, price) values ($1, $2, 0)
         on conflict do nothing`,
        [memberId, itemId],
      )
    }

    const placements = JSON.stringify(starterPlacements())
    let row: RoomDbRow | undefined
    for (let attempt = 0; attempt < 10 && !row; attempt++) {
      const inserted = await client.query<RoomDbRow>(
        `insert into rooms (slug, theme, kind, owner_member_id, draft, published, published_at)
         values ($1, 'cozy', 'personal', $2, $3::jsonb, $3::jsonb, now())
         on conflict (slug) do nothing
         returning ${ROOM_COLUMNS}`,
        [roomSlug(), memberId, placements],
      )
      row = inserted.rows[0]
    }
    if (!row) throw new Error('could not allocate a room slug')
    return toRoom(row)
  })
}

export function canView(
  room: RoomRow,
  access: RoomAccess & { shareToken?: string | null },
): boolean {
  if (room.kind === 'shared') return true
  if (access.memberId && room.ownerMemberId === access.memberId) return true
  return (
    room.visibility === 'link' &&
    room.shareToken !== null &&
    access.shareToken === room.shareToken
  )
}

export function canEdit(room: RoomRow, access: RoomAccess): boolean {
  if (room.kind === 'shared') return access.isOwnerArtist === true
  return access.memberId !== null && access.memberId !== undefined && room.ownerMemberId === access.memberId
}

async function ownershipFor(room: RoomRow): Promise<PlacementOwnership> {
  const owned = new Set<string>()
  if (room.kind === 'personal' && room.ownerMemberId) {
    const rows = await query<{ item_id: string }>(
      `select item_id from wallet_items where member_id = $1`,
      [room.ownerMemberId],
    )
    for (const row of rows) owned.add(row.item_id)
  }

  const paintings = await query<{ id: string }>(
    `select p.id
       from pieces p
       join artists a on a.id = p.artist_id
      where p.flattened_key is not null
        ${env.hallOwnerEmail ? 'and a.email = $1' : ''}`,
    env.hallOwnerEmail ? [env.hallOwnerEmail] : [],
  )

  const pieces = new Set(paintings.map((row) => row.id))
  return {
    ownsProp: (propId) => owned.has(`prop:${propId}`),
    hasPainting: (pieceId) => pieces.has(pieceId),
  }
}

/** `expectedVersion` is the draft version the editor last loaded; a newer one on the server is a conflict. */
export async function saveDraft(
  slug: string,
  placements: unknown,
  can: RoomAccess = {},
  expectedVersion?: number,
): Promise<SaveDraftResult> {
  const room = await getRoom(slug)
  if (!room) return { ok: false, reason: 'not_found' }

  if ('memberId' in can || 'isOwnerArtist' in can) {
    if (!canEdit(room, can)) return { ok: false, reason: 'forbidden' }
  }

  const parsed = parsePlacements(placements)
  if (!parsed) return { ok: false, reason: 'invalid' }

  const theme = THEMES[room.theme]
  if (!theme) return { ok: false, reason: 'unknown_theme' }

  const result = validatePlacements(theme, parsed, await ownershipFor(room))
  if (!result.ok) return result

  const row = await queryOne<{ draftVersion: number }>(
    `update rooms
        set draft = $2::jsonb, draft_version = draft_version + 1, updated_at = now()
      where slug = $1 and ($3::integer is null or draft_version = $3)
      returning draft_version as "draftVersion"`,
    [slug, JSON.stringify(parsed), expectedVersion ?? null],
  )
  if (row) return { ok: true, version: row.draftVersion }
  const latest = await getRoom(slug)
  if (!latest) return { ok: false, reason: 'not_found' }
  return { ok: false, reason: 'conflict', version: latest.draftVersion, draft: latest.draft }
}

/** With `expectedVersion`, publishes only if the draft is still the one the editor saw. */
export async function publish(slug: string, expectedVersion?: number): Promise<RoomRow | null> {
  const row = await queryOne<RoomDbRow>(
    `update rooms
        set published = draft, published_at = now(), updated_at = now()
      where slug = $1 and ($2::integer is null or draft_version = $2)
      returning ${ROOM_COLUMNS}`,
    [slug, expectedVersion ?? null],
  )
  if (!row) return null
  if (row.slug === 'hall') await sealEpoch()
  return toRoom(row)
}

export async function setSharing(slug: string, on: boolean): Promise<RoomRow | null> {
  const room = await getRoom(slug)
  if (!room) return null
  const token = on ? (room.visibility === 'link' && room.shareToken ? room.shareToken : newToken(18)) : null
  const row = await queryOne<RoomDbRow>(
    `update rooms
        set visibility = $2, share_token = $3, updated_at = now()
      where slug = $1
      returning ${ROOM_COLUMNS}`,
    [slug, on ? 'link' : 'private', token],
  )
  return row ? toRoom(row) : null
}

export interface RoomPageView {
  slug: string
  theme: ThemeId
  canView: boolean
  canEdit: boolean
  published: Placement[]
  ownerName: string | null
}

/**
 * What a room page shows, with access decided in SQL: the share token and owner id never leave
 * the database, so they cannot end up in a page's payload.
 */
export async function roomPageView(
  slug: string,
  access: RoomAccess & { shareToken?: string | null },
): Promise<RoomPageView | null> {
  const row = await queryOne<{
    slug: string
    theme: string
    published: unknown
    canView: boolean
    canEdit: boolean
    display_name: string | null
    name_seed: number | null
  }>(
    `select r.slug, r.theme, r.published,
            (r.kind = 'shared'
              or ($2::uuid is not null and r.owner_member_id = $2::uuid)
              or (r.visibility = 'link' and r.share_token is not null and r.share_token = $3)) as "canView",
            ((r.kind = 'shared' and $4::boolean)
              or (r.kind = 'personal' and $2::uuid is not null and r.owner_member_id = $2::uuid)) as "canEdit",
            m.display_name, m.name_seed
       from rooms r
       left join members m on m.id = r.owner_member_id
      where r.slug = $1`,
    [slug, access.memberId ?? null, access.shareToken ?? null, access.isOwnerArtist === true],
  )
  if (!row) return null
  return {
    slug: row.slug,
    theme: row.theme as ThemeId,
    canView: row.canView,
    canEdit: row.canEdit,
    published: row.canView ? parsePlacements(row.published) ?? [] : [],
    ownerName: row.canView && (row.display_name !== null || row.name_seed !== null) ? nameOf(row).name : null,
  }
}
