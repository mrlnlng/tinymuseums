import assert from 'node:assert/strict'
import { test } from 'node:test'
import { ITEMS } from '../economy/catalog.ts'
import { THEMES } from './themes.ts'
import { CLOSET_MESSES, buildSecondsFor, cleanItemId, cleanupFor, isRepair } from './work.ts'

test('every piece of closet junk and damage can be paid for', () => {
  let total = 0
  for (const mess of CLOSET_MESSES) {
    const item = ITEMS[cleanItemId(mess.id)]
    assert.equal(item?.kind, 'clean')
    assert.equal(item?.price, cleanupFor(mess.ref).price)
    total += item.price
  }
  assert.equal(total, 220)
})

test('bigger junk costs more and takes longer to clear; damage is repaired', () => {
  assert.ok(isRepair('stain') && isRepair('floor-wear') && !isRepair('cobweb') && !isRepair('boards'))
  assert.ok(cleanupFor('old-canvases').price > cleanupFor('old-paint').price)
  assert.ok(cleanupFor('old-canvases').seconds > cleanupFor('dust').seconds)
  for (const ref of Object.keys(THEMES.cozy.messes ?? {})) assert.ok(cleanupFor(ref).seconds >= 3)
})

test('building takes 2 to 8 seconds, longer for bigger things', () => {
  for (const ref of Object.keys(THEMES.cozy.props)) {
    const seconds = buildSecondsFor(ref)
    assert.ok(seconds >= 2 && seconds <= 8, ref)
  }
  assert.ok(buildSecondsFor('armchair') > buildSecondsFor('mug'))
})
