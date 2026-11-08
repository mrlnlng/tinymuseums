import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  FREE_CHARACTERS,
  ITEMS,
  STARTER_PROPS,
  isBuyable,
  isCatalogItem,
  itemIdFor,
  priceOf,
  type ItemSlot,
} from './catalog.ts'
import { THEMES } from '../rooms/themes.ts'

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
  'costume:tutu': 120,
  'character:otter': 250,
  'character:bruce': 250,
  'prop:mirror': 45,
  'prop:painting': 55,
  'prop:portrait-bunny': 40,
  'prop:portrait-jiji': 40,
  'prop:portrait-otter': 40,
  'prop:portrait-wink': 40,
  'prop:shelf': 0,
  'prop:cabinet': 110,
  'prop:carpet': 0,
  'prop:pillow-blue': 35,
  'prop:pillow-red': 0,
  'prop:column': 75,
  'prop:jewelry-box': 40,
  'prop:perfume': 30,
  'prop:broom': 35,
  'prop:cat': 80,
  'prop:fish-minnow': 0,
  'prop:fish-perch': 0,
  'prop:fish-carp': 0,
  'prop:fish-koi': 0,
  'prop:fish-golden-koi': 0,
  'prop:fish-star-snapper': 0,
  'prop:fish-crab': 0,
  'prop:fish-puffer': 0,
  'prop:fish-blobfish': 0,
}

const slots: readonly string[] = ['bow', 'costume', 'character', 'prop']

test('the catalog is exactly the wardrobe and prop list, keyed by slot:id', () => {
  assert.deepEqual(Object.keys(ITEMS).sort(), Object.keys(expected).sort())
  for (const [itemId, price] of Object.entries(expected)) {
    const [slot, id, ...extra] = itemId.split(':')
    assert.equal(extra.length, 0, itemId)
    assert.ok(slots.includes(slot), itemId)
    assert.ok(id.length > 0, itemId)
    if (slot !== 'prop') assert.equal(itemIdFor(slot as ItemSlot, id), itemId)
    assert.equal(priceOf(itemId), price)
    assert.ok(isCatalogItem(itemId))
  }
})

test('every catalog price is a non-negative integer', () => {
  for (const [itemId, item] of Object.entries(ITEMS)) {
    assert.ok(Number.isSafeInteger(item.price), itemId)
    assert.ok(item.price >= 0, itemId)
  }
})

test('the starter props are free and flagged', () => {
  assert.deepEqual([...STARTER_PROPS].sort(), ['prop:carpet', 'prop:pillow-red', 'prop:shelf'])
  for (const itemId of STARTER_PROPS) {
    assert.equal(ITEMS[itemId].price, 0)
    assert.equal(ITEMS[itemId].starter, true)
    assert.equal(ITEMS[itemId].kind, 'prop')
  }
})

test('every cozy prop except the fish has a catalog item', () => {
  for (const propId of Object.keys(THEMES.cozy.props)) {
    if (propId.startsWith('fish-')) continue
    assert.ok(isCatalogItem(`prop:${propId}`), propId)
  }
})

test('fish are collectible props that cannot be bought', () => {
  for (const [itemId, item] of Object.entries(ITEMS)) {
    if (!itemId.startsWith('prop:fish-')) continue
    assert.equal(item.kind, 'prop')
    assert.equal(item.collection, 'fish')
    assert.equal(item.price, 0)
    assert.equal(item.earnedBy, 'pond')
    assert.equal(isBuyable(itemId), false)
  }
  for (const itemId of Object.keys(ITEMS)) {
    if (!itemId.startsWith('prop:fish-')) assert.equal(isBuyable(itemId), true)
  }
})

test('unknown items have no price and are not catalog items or buyable', () => {
  for (const itemId of ['', 'bow:unknown', 'costume:unknown', 'character:bunny', 'kiki']) {
    assert.equal(priceOf(itemId), null)
    assert.equal(isCatalogItem(itemId), false)
    assert.equal(isBuyable(itemId), false)
  }
})

test('bunny and cat are the free characters', () => {
  assert.deepEqual([...FREE_CHARACTERS].sort(), ['bunny', 'cat'])
  for (const id of FREE_CHARACTERS) assert.equal(isCatalogItem(itemIdFor('character', id)), false)
})
