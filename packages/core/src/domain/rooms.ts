import { STARTER_PROPS } from '../economy/catalog.ts'
import { env } from '../infra/env.ts'
import { query, queryOne, transaction } from '../infra/db.ts'
import { mulberry32 } from '../infra/random.ts'
import { parsePlacements, validatePlacements, type Placement, type PlacementOwnership } from '../rooms/placements.ts'
import { FULL_ROOM_WIDTH, roomSizeFor, sizedTheme } from '../rooms/sizes.ts'
import { THEMES, type ThemeId } from '../rooms/themes.ts'
import { CLOSET_MESSES, cleanItemId } from '../rooms/work.ts'
import { nameOf } from './members.ts'
import { sealEpoch } from './epoch.ts'

export type RoomKind = 'shared' | 'personal'
/** 'open' is the sign on the door: anyone may come in, whether or not the owner is there. */
export type RoomVisibility = 'private' | 'open'

export interface RoomRow {
  slug: string
  theme: ThemeId
  kind: RoomKind
  ownerMemberId: string | null
  visibility: RoomVisibility
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
  draft: unknown
  draftVersion: number
  published: unknown
  publishedAt: Date | null
}

const ROOM_COLUMNS = `slug, theme, kind,
  owner_member_id as "ownerMemberId", visibility, draft, draft_version as "draftVersion", published,
  published_at as "publishedAt"`

const SLUG_CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789'

function toRoom(row: RoomDbRow): RoomRow {
  return {
    slug: row.slug,
    theme: row.theme as ThemeId,
    kind: row.kind,
    ownerMemberId: row.ownerMemberId,
    visibility: row.visibility,
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

/** A new room is the storeroom closet: bare plaster, a grimy window, a few starter things, and dirt. */
function starterPlacements(): Placement[] {
  return [
    { id: 'finish-wallpaper', kind: 'finish', ref: 'wallpaper-plaster', zone: 'wallpaper', x: 0 },
    { id: 'finish-baseboard', kind: 'finish', ref: 'baseboard-short', zone: 'baseboard', x: 0 },
    { id: 'starter-hooks', kind: 'prop', ref: 'wall-hooks', zone: 'wall', x: 2.35, y: 1.55 },
    { id: 'starter-cubby', kind: 'prop', ref: 'cubby', zone: 'floor', x: 2.6 },
    { id: 'starter-bulb', kind: 'prop', ref: 'bare-bulb', zone: 'wall', x: 3.3, y: 2.3 },
    { id: 'starter-window', kind: 'prop', ref: 'attic-window', zone: 'wall', x: 4.2, y: 2.25 },
    ...CLOSET_MESSES,
  ]
}

export async function getRoom(slug: string): Promise<RoomRow | null> {
  const row = await queryOne<RoomDbRow>(`select ${ROOM_COLUMNS} from rooms where slug = $1`, [slug])
  return row ? toRoom(row) : null
}

/**
 * For trying the closet on a test deployment: the member's room goes back to a new closet. Things
 * they own stay owned; only the room's size and arrangement reset. Callers must refuse this outside
 * test deployments.
 */
export async function restartInCloset(memberId: string): Promise<RoomRow> {
  const room = await personalRoomFor(memberId)
  return transaction(async (client) => {
    await client.query(`select pg_advisory_xact_lock(hashtext($1))`, [`personal-room:${memberId}`])
    // Sizes and paid cleaning go back, with their stamps, so the closet can be grown and cleaned again.
    await client.query(`insert into wallets (member_id) values ($1) on conflict do nothing`, [memberId])
    await client.query(`select balance from wallets where member_id = $1 for update`, [memberId])
    const refunded = await client.query<{ price: number }>(
      `delete from wallet_items where member_id = $1 and (item_id like 'room:%' or item_id like 'clean:%') returning price`,
      [memberId],
    )
    const refund = refunded.rows.reduce((sum, row) => sum + Number(row.price), 0)
    if (refund > 0) await client.query(`update wallets set balance = balance + $2 where member_id = $1`, [memberId, refund])
    await client.query(
      `insert into wallet_items (member_id, item_id, price) values ($1, 'room:closet', 0)`,
      [memberId],
    )
    const placements = JSON.stringify(starterPlacements())
    const updated = await client.query<RoomDbRow>(
      `update rooms
          set draft = $2::jsonb, published = $2::jsonb, draft_version = draft_version + 1,
              published_at = now(), updated_at = now()
        where slug = $1
        returning ${ROOM_COLUMNS}`,
      [room.slug, placements],
    )
    return toRoom(updated.rows[0])
  })
}

export async function personalRoomFor(memberId: string): Promise<RoomRow> {
  return transaction(async (client) => {
    await client.query(`select pg_advisory_xact_lock(hashtext($1))`, [`personal-room:${memberId}`])
    const existing = await client.query<RoomDbRow>(
      `select ${ROOM_COLUMNS} from rooms where kind = 'personal' and owner_member_id = $1`,
      [memberId],
    )
    // Rooms from before closets were already full size; a new one starts as the closet.
    const size = existing.rows[0] ? 'room:studio' : 'room:closet'
    const sized = await client.query(
      `select 1 from wallet_items where member_id = $1 and item_id like 'room:%' limit 1`,
      [memberId],
    )
    if (sized.rows.length === 0) {
      await client.query(
        `insert into wallet_items (member_id, item_id, price) values ($1, $2, 0) on conflict do nothing`,
        [memberId, size],
      )
    }
    for (const itemId of STARTER_PROPS) {
      await client.query(
        `insert into wallet_items (member_id, item_id, price) values ($1, $2, 0)
         on conflict do nothing`,
        [memberId, itemId],
      )
    }

    if (existing.rows[0]) return toRoom(existing.rows[0])

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

export function canView(room: RoomRow, access: RoomAccess): boolean {
  if (room.kind === 'shared' || room.visibility === 'open') return true
  return Boolean(access.memberId && room.ownerMemberId === access.memberId)
}

export function canEdit(room: RoomRow, access: RoomAccess): boolean {
  if (room.kind === 'shared') return access.isOwnerArtist === true
  return access.memberId !== null && access.memberId !== undefined && room.ownerMemberId === access.memberId
}

/** The paintings a museum room may hold: the hall owner's, once framed. */
export async function hangablePaintings(): Promise<Set<string>> {
  const paintings = await query<{ id: string }>(
    `select p.id
       from pieces p
       join artists a on a.id = p.artist_id
      where p.flattened_key is not null
        ${env.hallOwnerEmail ? 'and a.email = $1' : ''}`,
    env.hallOwnerEmail ? [env.hallOwnerEmail] : [],
  )
  return new Set(paintings.map((row) => row.id))
}

async function ownershipFor(room: RoomRow): Promise<PlacementOwnership & { width: number; cleaned(placementId: string): boolean }> {
  const owned = new Set<string>()
  if (room.kind === 'personal' && room.ownerMemberId) {
    const rows = await query<{ item_id: string }>(
      `select item_id from wallet_items where member_id = $1`,
      [room.ownerMemberId],
    )
    for (const row of rows) owned.add(row.item_id)
  }

  const pieces = await hangablePaintings()
  return {
    ownsProp: (propId) => owned.has(`prop:${propId}`),
    hasPainting: (pieceId) => pieces.has(pieceId),
    ownsFinish: (finishId) => owned.has(`finish:${finishId}`),
    width: room.kind === 'personal' ? roomSizeFor(owned).width : FULL_ROOM_WIDTH,
    cleaned: (placementId) => owned.has(cleanItemId(placementId)),
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

  const ownership = await ownershipFor(room)
  const result = validatePlacements(sizedTheme(theme, ownership.width), parsed, ownership)
  if (!result.ok) return result
  // Junk only goes once it has been paid for.
  const kept = new Set(parsed.map((placement) => placement.id))
  const unpaid = room.draft.find((placement) => placement.kind === 'mess' && !kept.has(placement.id) && !ownership.cleaned(placement.id))
  if (unpaid) return { ok: false, reason: 'not_cleaned', id: unpaid.id }

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

export async function setOpen(slug: string, open: boolean): Promise<RoomRow | null> {
  const row = await queryOne<RoomDbRow>(
    `update rooms
        set visibility = $2, updated_at = now()
      where slug = $1 and kind = 'personal'
      returning ${ROOM_COLUMNS}`,
    [slug, open ? 'open' : 'private'],
  )
  return row ? toRoom(row) : null
}

/** The member's own room slug, without creating one. */
export async function homeSlugOf(memberId: string): Promise<string | null> {
  const row = await queryOne<{ slug: string }>(
    `select slug from rooms where kind = 'personal' and owner_member_id = $1`,
    [memberId],
  )
  return row?.slug ?? null
}

export interface RoomPageView {
  slug: string
  theme: ThemeId
  canView: boolean
  canEdit: boolean
  published: Placement[]
  ownerName: string | null
  /** The sign on the door says Open. */
  open: boolean
  /** The room's length; a personal room grows from the closet as it is knocked through. */
  width: number
}

/**
 * What a room page shows, with access decided in SQL: the owner id never leaves the database, so
 * it cannot end up in a page's payload.
 */
export async function roomPageView(
  slug: string,
  access: RoomAccess,
): Promise<RoomPageView | null> {
  const row = await queryOne<{
    slug: string
    theme: string
    published: unknown
    canView: boolean
    canEdit: boolean
    open: boolean
    display_name: string | null
    name_seed: number | null
    sizes: string[] | null
  }>(
    `select r.slug, r.theme, r.published,
            (r.kind = 'shared'
              or ($2::uuid is not null and r.owner_member_id = $2::uuid)
              or r.visibility = 'open') as "canView",
            r.visibility = 'open' as open,
            ((r.kind = 'shared' and $3::boolean)
              or (r.kind = 'personal' and $2::uuid is not null and r.owner_member_id = $2::uuid)) as "canEdit",
            m.display_name, m.name_seed,
            (select array_agg(w.item_id) from wallet_items w
              where w.member_id = r.owner_member_id and w.item_id like 'room:%') as sizes
       from rooms r
       left join members m on m.id = r.owner_member_id
      where r.slug = $1`,
    [slug, access.memberId ?? null, access.isOwnerArtist === true],
  )
  if (!row) return null
  return {
    slug: row.slug,
    theme: row.theme as ThemeId,
    canView: row.canView,
    canEdit: row.canEdit,
    published: row.canView ? parsePlacements(row.published) ?? [] : [],
    ownerName: row.canView && (row.display_name !== null || row.name_seed !== null) ? nameOf(row).name : null,
    open: row.open,
    width: row.theme === 'cozy' ? roomSizeFor(row.sizes ?? []).width : FULL_ROOM_WIDTH,
  }
}
