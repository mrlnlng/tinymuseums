import assert from 'node:assert/strict'
import { test } from 'node:test'
import { ROOM_SIZES, nextRoomSize, roomSizeFor, sizedTheme } from './sizes.ts'
import { THEMES } from './themes.ts'
import { validatePlacements, type Placement } from './placements.ts'

const owns = { ownsProp: () => true, hasPainting: () => false, ownsFinish: () => true }

test('a room is as big as the biggest size its owner has knocked through to', () => {
  assert.equal(roomSizeFor(['room:closet']).id, 'closet')
  assert.equal(roomSizeFor(['room:closet', 'room:backroom', 'prop:cubby']).id, 'backroom')
  assert.equal(roomSizeFor(['room:studio', 'room:closet']).width, 20)
})

test('a room from before closets owns no size and stays full size', () => {
  assert.equal(roomSizeFor([]).id, 'studio')
  assert.equal(roomSizeFor(['prop:cubby']).id, 'studio')
})

test('sizes grow one step at a time and stop at the studio', () => {
  const widths = ROOM_SIZES.map((size) => size.width)
  assert.deepEqual([...widths].sort((a, b) => a - b), widths)
  assert.equal(nextRoomSize(ROOM_SIZES[0])?.id, 'storeroom')
  assert.equal(nextRoomSize(ROOM_SIZES[ROOM_SIZES.length - 1]), null)
})

test('a closet refuses things past its right wall', () => {
  const closet = sizedTheme(THEMES.cozy, 6)
  const near: Placement = { id: 'near-1', kind: 'prop', ref: 'cubby', zone: 'floor', x: 5.1 }
  const far: Placement = { id: 'far-1', kind: 'prop', ref: 'cubby', zone: 'floor', x: 9 }
  assert.deepEqual(validatePlacements(closet, [near], owns), { ok: true })
  assert.equal(validatePlacements(closet, [far], owns).ok, false)
  assert.deepEqual(validatePlacements(sizedTheme(THEMES.cozy, 20), [far], owns), { ok: true })
})

test('dirt can stay where it is but must be a known mess', () => {
  const cozy = THEMES.cozy
  const cobweb: Placement = { id: 'mess-1', kind: 'mess', ref: 'cobweb', zone: 'wall', x: 3, y: 3 }
  assert.deepEqual(validatePlacements(cozy, [cobweb], owns), { ok: true })
  assert.equal(validatePlacements(cozy, [{ ...cobweb, ref: 'gold-bar' }], owns).ok, false)
  assert.equal(validatePlacements(cozy, [{ ...cobweb, zone: 'top' }], owns).ok, false)
})
