import assert from 'node:assert/strict'
import { test } from 'node:test'
import { itemIdFor, priceOf } from '@tiny/core/economy'
import { choiceAt, HEADPIECES, OUTFITS, positionOf } from './closet.ts'

test('the closet offers every outfit and headpiece in the catalog, and nothing', () => {
  for (const id of OUTFITS) if (id !== null) assert.notEqual(priceOf(itemIdFor('costume', id)), null, id)
  for (const id of HEADPIECES) if (id !== null) assert.notEqual(priceOf(itemIdFor('bow', id)), null, id)
  assert.equal(OUTFITS[0], null)
  assert.equal(HEADPIECES[0], null)
  assert.equal(new Set(OUTFITS).size, OUTFITS.length)
})

test('the wheel turns any number of steps either way and finds each choice again', () => {
  for (const id of OUTFITS) assert.equal(choiceAt(OUTFITS, positionOf(OUTFITS, id)), id)
  assert.equal(choiceAt(OUTFITS, -1), 'tutu')
  assert.equal(choiceAt(HEADPIECES, HEADPIECES.length * 3 + 1), 'kiki')
  assert.equal(positionOf(HEADPIECES, 'cape'), 0)
})
