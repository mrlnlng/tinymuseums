import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  FREE_CHARACTERS,
  ITEMS,
  isCatalogItem,
  itemIdFor,
  priceOf,
  type ItemSlot,
} from './catalog.ts'

const expected: Record<string, number> = {
  'bow:kiki': 60,
  'bow:flower-crown': 60,
  'bow:hibiscus-blue': 60,
  'bow:hibiscus-yellow': 60,
  'bow:hibiscus-pink': 60,
  'bow:blue-cap': 60,
  'bow:daisy-clip': 60,
  'costume:cardigan-red': 80,
  'costume:cardigan-forest-green': 80,
  'costume:cardigan-navy-blue': 80,
  'costume:cardigan-butter-yellow': 80,
  'costume:kiki': 120,
  'costume:blue-floral': 120,
  'costume:floral-cardigan': 120,
  'costume:gold-sequin': 120,
  'costume:gold-cape': 180,
  'character:otter': 250,
}

const slots: readonly ItemSlot[] = ['bow', 'costume', 'character']

test('the catalog is exactly the wardrobe list, keyed by slot:id', () => {
  assert.deepEqual(Object.keys(ITEMS).sort(), Object.keys(expected).sort())
  for (const [itemId, price] of Object.entries(expected)) {
    const [slot, id, ...extra] = itemId.split(':')
    assert.equal(extra.length, 0, itemId)
    assert.ok(slots.includes(slot as ItemSlot), itemId)
    assert.ok(id.length > 0, itemId)
    assert.equal(itemIdFor(slot as ItemSlot, id), itemId)
    assert.equal(priceOf(itemId), price)
    assert.ok(isCatalogItem(itemId))
  }
})

test('every catalog price is a positive integer', () => {
  for (const [itemId, item] of Object.entries(ITEMS)) {
    assert.ok(Number.isSafeInteger(item.price), itemId)
    assert.ok(item.price > 0, itemId)
  }
})

test('unknown items have no price and are not catalog items', () => {
  for (const itemId of ['', 'bow:unknown', 'costume:unknown', 'character:bunny', 'kiki']) {
    assert.equal(priceOf(itemId), null)
    assert.equal(isCatalogItem(itemId), false)
  }
})

test('bunny and cat are the free characters', () => {
  assert.deepEqual([...FREE_CHARACTERS].sort(), ['bunny', 'cat'])
  for (const id of FREE_CHARACTERS) assert.equal(isCatalogItem(itemIdFor('character', id)), false)
})
