import assert from 'node:assert/strict'
import { randomBytes } from 'node:crypto'
import { after, test } from 'node:test'
import {
  canEdit,
  canView,
  getRoom,
  personalRoomFor,
  publish,
  saveDraft,
  setSharing,
} from '../src/domain/rooms.ts'
import { signUp } from '../src/domain/members.ts'
import { STARTER_PROPS } from '../src/economy/catalog.ts'
import { closePool, query, queryOne } from '../src/infra/db.ts'

after(() => closePool())

const PASSWORD = 'correct horse'

function randomId(): string {
  return randomBytes(8).toString('hex')
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
  assert.equal(first.draft.length, STARTER_PROPS.length)
  assert.deepEqual(second.draft, first.draft)
  assert.deepEqual(first.published, first.draft)
  assert.ok(first.publishedAt)

  const items = await query<{ item_id: string; price: number }>(
    `select item_id, price from wallet_items where member_id = $1 order by item_id`,
    [memberId],
  )
  assert.deepEqual(items.map((item) => item.item_id), [...STARTER_PROPS].sort())
  assert.ok(items.every((item) => item.price === 0))
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

  const unowned = await saveDraft(
    room.slug,
    [{ id: 'draft-cabinet', kind: 'prop', ref: 'cabinet', zone: 'floor', x: 7 }],
    actor,
  )
  assert.deepEqual(unowned, { ok: false, reason: 'not_owned' })
  assert.deepEqual((await getRoom(room.slug))?.draft, room.draft)

  const starter = await saveDraft(
    room.slug,
    [{ id: 'draft-carpet', kind: 'prop', ref: 'carpet', zone: 'floor', x: 6.5 }],
    actor,
  )
  assert.deepEqual(starter, { ok: true })
  assert.deepEqual((await getRoom(room.slug))?.draft, [
    { id: 'draft-carpet', kind: 'prop', ref: 'carpet', zone: 'floor', x: 6.5 },
  ])

  await query(
    `insert into wallet_items (member_id, item_id, price) values ($1, 'prop:mirror', 45)`,
    [owner],
  )
  const bought = await saveDraft(
    room.slug,
    [{ id: 'draft-mirror', kind: 'prop', ref: 'mirror', zone: 'wall', x: 3 }],
    actor,
  )
  assert.deepEqual(bought, { ok: true })

  const stranger = await member()
  const forbidden = await saveDraft(
    room.slug,
    [{ id: 'draft-mirror', kind: 'prop', ref: 'mirror', zone: 'wall', x: 2 }],
    { memberId: stranger, isOwnerArtist: false },
  )
  assert.deepEqual(forbidden, { ok: false, reason: 'forbidden' })
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
    assert.deepEqual(
      await saveDraft('hall', placements, { memberId: null, isOwnerArtist: true }),
      { ok: true },
    )
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
