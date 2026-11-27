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
  'prop:window': 0,
  'prop:wall-hooks': 0,
  'prop:wall-shelf': 0,
  'prop:gold-frame': 50,
  'prop:pressed-fern': 40,
  'prop:midnight-study': 50,
  'prop:hanger': 25,
  'prop:bare-bulb': 0,
  'prop:attic-window': 0,
  'prop:cabinet': 110,
  'prop:carpet': 0,
  'prop:pillow-blue': 35,
  'prop:pillow-red': 0,
  'prop:column': 75,
  'prop:jewelry-box': 40,
  'prop:perfume': 30,
  'prop:broom': 35,
  'prop:cat': 80,
  'prop:cubby': 0,
  'prop:round-table': 0,
  'prop:side-table': 70,
  'prop:chair': 60,
  'prop:armchair': 120,
  'prop:rug': 70,
  'prop:patchwork-mat': 20,
  'prop:gallery-runner': 40,
  'prop:moonwake-rug': 50,
  'prop:lily-stitch-rug': 30,
  'prop:studio-stripe-carpet': 45,
  'prop:faded-floral-carpet': 55,
  'prop:plant': 55,
  'prop:mug': 20,
  'prop:tulip-vase': 0,
  'prop:reading-lamp': 35,
  'prop:sketchbooks': 25,
  'prop:ammonite-display': 45,
  'prop:opening-night-invite': 15,
  'prop:paint-stained-palette': 25,
  'prop:storeroom-letter': 15,
  'prop:fish-minnow': 0,
  'prop:fish-perch': 0,
  'prop:fish-carp': 0,
  'prop:fish-koi': 0,
  'prop:fish-golden-koi': 0,
  'prop:fish-star-snapper': 0,
  'prop:fish-crab': 0,
  'prop:fish-puffer': 0,
  'prop:fish-blobfish': 0,
  'keepsake:mp3-player': 0,
  'keepsake:camera': 0,
  'finish:wallpaper-cream': 0,
  'finish:wallpaper-plaster': 0,
  'finish:wallpaper-peach-stripes': 0,
  'finish:wallpaper-pink-stripes': 90,
  'finish:wallpaper-blue-floral': 120,
  'finish:wallpaper-ornate': 120,
  'finish:baseboard-tall': 0,
  'finish:baseboard-short': 0,
  'room:closet': 0,
  'room:storeroom': 120,
  'room:backroom': 250,
  'room:studio': 450,
  'clean:mess-cobweb-door': 20,
  'clean:mess-cobweb-corner': 20,
  'clean:mess-peeling': 15,
  'clean:mess-stain': 15,
  'clean:mess-canvases': 40,
  'clean:mess-paint': 5,
  'clean:mess-dust': 5,
  'clean:mess-boards': 40,
  'clean:mess-wall-wear': 30,
  'clean:mess-floor-wear': 30,
}

const slots: readonly string[] = ['bow', 'costume', 'character', 'prop', 'finish', 'room', 'clean', 'keepsake']

test('the catalog is exactly the wardrobe and prop list, keyed by slot:id', () => {
  assert.deepEqual(Object.keys(ITEMS).sort(), Object.keys(expected).sort())
  for (const [itemId, price] of Object.entries(expected)) {
    const [slot, id, ...extra] = itemId.split(':')
    assert.equal(extra.length, 0, itemId)
    assert.ok(slots.includes(slot), itemId)
    assert.ok(id.length > 0, itemId)
    if (slot !== 'prop' && slot !== 'finish' && slot !== 'room' && slot !== 'clean' && slot !== 'keepsake') assert.equal(itemIdFor(slot as ItemSlot, id), itemId)
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
  assert.deepEqual([...STARTER_PROPS].sort(), [
    'finish:baseboard-short',
    'finish:baseboard-tall',
    'finish:wallpaper-cream',
    'finish:wallpaper-peach-stripes',
    'finish:wallpaper-plaster',
    'prop:attic-window',
    'prop:bare-bulb',
    'prop:carpet',
    'prop:cubby',
    'prop:pillow-red',
    'prop:round-table',
    'prop:shelf',
    'prop:tulip-vase',
    'prop:wall-hooks',
    'prop:wall-shelf',
    'prop:window',
  ])
  for (const itemId of STARTER_PROPS) {
    assert.equal(ITEMS[itemId].price, 0)
    assert.equal(ITEMS[itemId].starter, true)
    assert.ok(ITEMS[itemId].kind === 'prop' || ITEMS[itemId].kind === 'finish', itemId)
  }
})

test('every cozy prop except the fish has a catalog item', () => {
  for (const propId of Object.keys(THEMES.cozy.props)) {
    if (propId.startsWith('fish-')) continue
    assert.ok(isCatalogItem(`prop:${propId}`), propId)
  }
})

test('every cozy finish has a finish catalog item', () => {
  for (const slot of Object.values(THEMES.cozy.finishes ?? {})) {
    if (!slot) continue
    for (const finishId of slot.ids) {
      const itemId = `finish:${finishId}`
      assert.ok(isCatalogItem(itemId), itemId)
      assert.equal(ITEMS[itemId].kind, 'finish')
      assert.equal(isBuyable(itemId), true)
    }
  }
})

test('pond keepsakes are earned at the pond and cannot be bought', () => {
  for (const itemId of ['keepsake:mp3-player', 'keepsake:camera']) {
    assert.equal(ITEMS[itemId].earnedBy, 'pond')
    assert.equal(isBuyable(itemId), false)
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
    if (!itemId.startsWith('prop:fish-') && !itemId.startsWith('keepsake:')) assert.equal(isBuyable(itemId), true)
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
