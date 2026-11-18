import assert from 'node:assert/strict'
import { randomBytes } from 'node:crypto'
import { after, test } from 'node:test'
import {
  canEdit,
  canView,
  getRoom,
  personalRoomFor,
  publish,
  roomPageView,
  restartInCloset,
  saveDraft,
  setSharing,
} from '../src/domain/rooms.ts'
import { signUp } from '../src/domain/members.ts'
import { STARTER_PROPS } from '../src/economy/catalog.ts'
import { closePool, query, queryOne } from '../src/infra/db.ts'
import type { Placement } from '../src/rooms/placements.ts'

after(() => closePool())

const PASSWORD = 'correct horse'

function randomId(): string {
  return randomBytes(8).toString('hex')
}

/** The closet's junk, kept in a save that is about something else. */
function junkOf(draft: readonly Placement[]): Placement[] {
  return draft.filter((placement) => placement.kind === 'mess')
}

async function member(): Promise<string> {
  const result = await signUp(`rooms-${randomId()}@example.test`, PASSWORD)
  assert.ok('member' in result, `sign-up failed: ${JSON.stringify(result)}`)
  return result.member.id
}

async function artist(status: 'live' | 'draft' = 'live'): Promise<{ id: string; email: string }> {
  const name = `rooms-${randomId()}`
  const email = `${name}@example.test`
  const row = await queryOne<{ id: string }>(
    `insert into artists (slug, display_name, email, password_hash, status)
     values ($1, 'Rooms Test', $2, 'not-a-real-hash', $3)
     returning id`,
    [name, email, status],
  )
  assert.ok(row)
  return { id: row.id, email }
}

async function piece(artistId: string, title: string, orderIndex: number): Promise<string> {
  const row = await queryOne<{ id: string }>(
    `insert into pieces
       (artist_id, title, order_index, flattened_key, flattened_width, flattened_height)
     values ($1, $2, $3, $4, 800, 600)
     returning id`,
    [artistId, title, orderIndex, `rooms-test/${randomId()}.webp`],
  )
  assert.ok(row)
  return row.id
}

test('a personal room is created once, grants the starter props, and starts arranged', async () => {
  const memberId = await member()
  const first = await personalRoomFor(memberId)
  const second = await personalRoomFor(memberId)

  assert.equal(first.slug, second.slug)
  assert.match(first.slug, /^r-[a-z0-9]{8}$/)
  assert.equal(first.theme, 'cozy')
  assert.equal(first.kind, 'personal')
  assert.equal(first.ownerMemberId, memberId)
  assert.equal(first.visibility, 'private')
  assert.equal(first.shareToken, null)
  assert.equal(first.draft.length, 16)
  assert.equal(first.draft.filter((placement) => placement.kind === 'mess').length, 10)
  assert.deepEqual(second.draft, first.draft)
  assert.deepEqual(first.published, first.draft)
  assert.ok(first.publishedAt)

  const items = await query<{ item_id: string; price: number }>(
    `select item_id, price from wallet_items where member_id = $1 order by item_id`,
    [memberId],
  )
  assert.deepEqual(items.map((item) => item.item_id), [...STARTER_PROPS, 'room:closet'].sort())
  assert.ok(items.every((item) => item.price === 0))
})

test('a new room is the closet, refuses things past its wall, and grows when knocked through', async () => {
  const owner = await member()
  const room = await personalRoomFor(owner)
  const actor = { memberId: owner, isOwnerArtist: false }
  const cubby = (x: number) => [...junkOf(room.draft), { id: 'draft-cubby', kind: 'prop', ref: 'cubby', zone: 'floor', x }]

  assert.equal((await roomPageView(room.slug, { memberId: owner }))?.width, 6)
  assert.deepEqual(await saveDraft(room.slug, cubby(8), actor), { ok: false, reason: 'out_of_bounds', id: 'draft-cubby' })

  await query(`insert into wallet_items (member_id, item_id, price) values ($1, 'room:storeroom', 120)`, [owner])
  assert.equal((await roomPageView(room.slug, { memberId: owner }))?.width, 10)
  assert.equal((await saveDraft(room.slug, cubby(8), actor)).ok, true)
})

test('a room from before closets is full size', async () => {
  const owner = await member()
  const room = await personalRoomFor(owner)
  await query(`delete from wallet_items where member_id = $1 and item_id like 'room:%'`, [owner])
  await personalRoomFor(owner)
  const sizes = await query<{ item_id: string }>(
    `select item_id from wallet_items where member_id = $1 and item_id like 'room:%'`,
    [owner],
  )
  assert.deepEqual(sizes.map((row) => row.item_id), ['room:studio'])
  assert.equal((await roomPageView(room.slug, { memberId: owner }))?.width, 20)
})

test('starting over puts a full-size room back to a new closet and keeps what the member owns', async () => {
  const owner = await member()
  const room = await personalRoomFor(owner)
  await query(`insert into wallet_items (member_id, item_id, price) values ($1, 'room:studio', 450), ($1, 'prop:mirror', 45)`, [owner])
  await saveDraft(room.slug, [{ id: 'draft-mirror', kind: 'prop', ref: 'mirror', zone: 'wall', x: 12 }], { memberId: owner })

  const reset = await restartInCloset(owner)
  assert.equal(reset.slug, room.slug)
  assert.equal(reset.draft.filter((placement) => placement.kind === 'mess').length, 10)
  assert.deepEqual(reset.published, reset.draft)
  assert.equal((await roomPageView(room.slug, { memberId: owner }))?.width, 6)
  const owned = await query<{ item_id: string }>(`select item_id from wallet_items where member_id = $1`, [owner])
  assert.ok(owned.some((row) => row.item_id === 'prop:mirror'))
  assert.deepEqual(owned.filter((row) => row.item_id.startsWith('room:')).map((row) => row.item_id), ['room:closet'])
})

test('junk only leaves a saved draft once it has been paid for', async () => {
  const owner = await member()
  const room = await personalRoomFor(owner)
  const actor = { memberId: owner, isOwnerArtist: false }
  const withoutStain = room.draft.filter((placement) => placement.id !== 'mess-stain')

  assert.deepEqual(await saveDraft(room.slug, withoutStain, actor), { ok: false, reason: 'not_cleaned', id: 'mess-stain' })
  await query(`insert into wallet_items (member_id, item_id, price) values ($1, 'clean:mess-stain', 15)`, [owner])
  assert.equal((await saveDraft(room.slug, withoutStain, actor)).ok, true)
  // Gone from the saved draft, it stays gone without paying again; other junk still needs paying for.
  assert.equal((await saveDraft(room.slug, withoutStain, actor)).ok, true)
  const withoutDust = withoutStain.filter((placement) => placement.id !== 'mess-dust')
  assert.deepEqual(await saveDraft(room.slug, withoutDust, actor), { ok: false, reason: 'not_cleaned', id: 'mess-dust' })
})

test('starting over refunds paid cleaning and knocked-through walls', async () => {
  const owner = await member()
  await personalRoomFor(owner)
  const balance = async () => Number((await queryOne<{ balance: number }>(`select balance from wallets where member_id = $1`, [owner]))?.balance ?? 0)
  await query(
    `insert into wallet_items (member_id, item_id, price) values ($1, 'clean:mess-stain', 15), ($1, 'room:storeroom', 120)`,
    [owner],
  )
  const before = await balance()
  await restartInCloset(owner)
  assert.equal(await balance(), before + 135)
  const owned = await query<{ item_id: string }>(`select item_id from wallet_items where member_id = $1 and item_id like 'clean:%'`, [owner])
  assert.equal(owned.length, 0)
})

test('view and edit permissions follow the shared/personal and sharing rules', async () => {
  const owner = await member()
  const stranger = await member()
  const room = await personalRoomFor(owner)
  const hall = await getRoom('hall')
  assert.ok(hall)

  assert.equal(canView(hall, { memberId: null, isOwnerArtist: false }), true)
  assert.equal(canEdit(hall, { memberId: owner, isOwnerArtist: false }), false)
  assert.equal(canEdit(hall, { memberId: null, isOwnerArtist: true }), true)

  assert.equal(canView(room, { memberId: owner, isOwnerArtist: false }), true)
  assert.equal(canEdit(room, { memberId: owner, isOwnerArtist: false }), true)
  assert.equal(canView(room, { memberId: stranger, isOwnerArtist: false }), false)
  assert.equal(canEdit(room, { memberId: stranger, isOwnerArtist: false }), false)
  assert.equal(canView(room, { memberId: null, isOwnerArtist: true }), false)

  const shared = await setSharing(room.slug, true)
  assert.ok(shared)
  assert.equal(shared.visibility, 'link')
  assert.ok(shared.shareToken && /^[A-Za-z0-9_-]+$/.test(shared.shareToken))
  assert.equal(canView(shared, { memberId: stranger, shareToken: shared.shareToken }), true)
  assert.equal(canEdit(shared, { memberId: stranger, isOwnerArtist: false }), false)
  assert.equal(canView(shared, { memberId: stranger, shareToken: 'wrong' }), false)
  assert.equal(canView(shared, { memberId: null }), false)

  const token = shared.shareToken
  const privateRoom = await setSharing(room.slug, false)
  assert.ok(privateRoom)
  assert.equal(privateRoom.visibility, 'private')
  assert.equal(privateRoom.shareToken, null)
  assert.equal(canView(privateRoom, { memberId: stranger, shareToken: token }), false)
})

test('saving a draft rejects unowned props and accepts owned ones', async () => {
  const owner = await member()
  const room = await personalRoomFor(owner)
  const actor = { memberId: owner, isOwnerArtist: false }

  const junk = junkOf(room.draft)
  const unowned = await saveDraft(
    room.slug,
    [...junk, { id: 'draft-cabinet', kind: 'prop', ref: 'cabinet', zone: 'floor', x: 3 }],
    actor,
  )
  assert.deepEqual(unowned, { ok: false, reason: 'not_owned', id: 'draft-cabinet' })
  assert.deepEqual((await getRoom(room.slug))?.draft, room.draft)

  const starter = await saveDraft(
    room.slug,
    [...junk, { id: 'draft-carpet', kind: 'prop', ref: 'carpet', zone: 'floor', x: 3.2 }],
    actor,
  )
  assert.deepEqual(starter, { ok: true, version: room.draftVersion + 1 })
  assert.deepEqual((await getRoom(room.slug))?.draft, [
    ...junk,
    { id: 'draft-carpet', kind: 'prop', ref: 'carpet', zone: 'floor', x: 3.2 },
  ])

  await query(
    `insert into wallet_items (member_id, item_id, price) values ($1, 'prop:mirror', 45)`,
    [owner],
  )
  const bought = await saveDraft(
    room.slug,
    [...junk, { id: 'draft-mirror', kind: 'prop', ref: 'mirror', zone: 'wall', x: 3 }],
    actor,
  )
  assert.deepEqual(bought, { ok: true, version: room.draftVersion + 2 })

  const stranger = await member()
  const forbidden = await saveDraft(
    room.slug,
    [{ id: 'draft-mirror', kind: 'prop', ref: 'mirror', zone: 'wall', x: 2 }],
    { memberId: stranger, isOwnerArtist: false },
  )
  assert.deepEqual(forbidden, { ok: false, reason: 'forbidden' })
})

test('a save or publish from a stale draft version is a conflict', async () => {
  const owner = await member()
  const room = await personalRoomFor(owner)
  const actor = { memberId: owner, isOwnerArtist: false }
  const carpet = (x: number) => [...junkOf(room.draft), { id: 'draft-carpet', kind: 'prop', ref: 'carpet', zone: 'floor', x }]

  const first = await saveDraft(room.slug, carpet(3), actor, room.draftVersion)
  assert.deepEqual(first, { ok: true, version: room.draftVersion + 1 })

  const stale = await saveDraft(room.slug, carpet(4), actor, room.draftVersion)
  assert.deepEqual(stale, {
    ok: false,
    reason: 'conflict',
    version: room.draftVersion + 1,
    draft: carpet(3),
  })
  assert.deepEqual((await getRoom(room.slug))?.draft, carpet(3))

  assert.equal(await publish(room.slug, room.draftVersion), null)
  const published = await publish(room.slug, room.draftVersion + 1)
  assert.deepEqual(published?.published, carpet(3))
})

test('a room page view decides access without handing out the token or owner', async () => {
  const owner = await member()
  const stranger = await member()
  const room = await personalRoomFor(owner)
  const shared = await setSharing(room.slug, true)
  assert.ok(shared?.shareToken)

  const mine = await roomPageView(room.slug, { memberId: owner })
  assert.ok(mine)
  assert.equal(mine.canView, true)
  assert.equal(mine.canEdit, true)
  assert.deepEqual(mine.published, room.published)
  assert.ok(!('shareToken' in mine) && !('ownerMemberId' in mine))

  const visitor = await roomPageView(room.slug, { memberId: stranger, shareToken: shared.shareToken })
  assert.equal(visitor?.canView, true)
  assert.equal(visitor?.canEdit, false)

  const blocked = await roomPageView(room.slug, { memberId: null, shareToken: 'wrong' })
  assert.deepEqual(blocked && { canView: blocked.canView, published: blocked.published, ownerName: blocked.ownerName }, {
    canView: false,
    published: [],
    ownerName: null,
  })
  assert.equal(await roomPageView('r-missing0', { memberId: owner }), null)
})

test('publishing the hall seals an epoch in the published painting order', async () => {
  const hallOwner = await artist('live')
  const first = await piece(hallOwner.id, 'First', 1)
  const second = await piece(hallOwner.id, 'Second', 2)
  const third = await piece(hallOwner.id, 'Third', 3)

  const previous = process.env.HALL_OWNER_EMAIL
  process.env.HALL_OWNER_EMAIL = hallOwner.email
  try {
    const placements = [
      { id: 'hall-first', kind: 'painting' as const, ref: first, zone: 'wall', x: 30 },
      { id: 'hall-second', kind: 'painting' as const, ref: second, zone: 'wall', x: 10 },
      { id: 'hall-third', kind: 'painting' as const, ref: third, zone: 'wall', x: 20 },
    ]
    const saved = await saveDraft('hall', placements, { memberId: null, isOwnerArtist: true })
    assert.equal(saved.ok, true)
    assert.ok(await publish('hall'))

    const epoch = await queryOne<{ id: number }>(
      `select id from museum_epochs order by id desc limit 1`,
    )
    assert.ok(epoch)
    const slots = await query<{ piece_id: string }>(
      `select piece_id from epoch_slots where epoch_id = $1 order by index`,
      [epoch.id],
    )
    assert.deepEqual(
      slots.map((slot) => slot.piece_id),
      [second, third, first],
    )
  } finally {
    if (previous === undefined) delete process.env.HALL_OWNER_EMAIL
    else process.env.HALL_OWNER_EMAIL = previous
  }
})
