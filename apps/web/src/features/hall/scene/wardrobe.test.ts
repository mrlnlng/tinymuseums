import assert from 'node:assert/strict'
import { test } from 'node:test'
import { outfit as definition, type Outfit } from '@tiny/core/slots'
import { createWardrobe, followOutfit, lookOf, toggleWorn } from './wardrobe.ts'
import type { Character, Look } from './character.ts'
import type { AtelierRoom } from './atelier.ts'
import type { SlotHandle } from '@/shared/lib/slots'

const dress = { slot: 'costume', id: 'kiki' } as const
const bow = { slot: 'bow', id: 'kiki' } as const
const cardigan = { slot: 'costume', id: 'cardigan-red' } as const

function setup() {
  let doc = definition.empty()
  const listeners = new Set<() => void>()
  const slot = {
    snapshot: () => doc,
    update(fn: (value: Outfit) => Outfit) { doc = fn(doc); for (const fn of listeners) fn() },
    subscribe(fn: () => void) { listeners.add(fn); return () => listeners.delete(fn) },
  } as unknown as SlotHandle<Outfit>
  let look = lookOf(doc)
  let fail = false
  let attempts = 0
  let opacity = 1
  const character = {
    get look() { return look },
    async wear(next: Look) { attempts++; if (fail) return false; look = next; return true },
    setOpacity(value: number) { opacity = value },
  } as unknown as Character
  const worn: (string | null)[][] = []
  const room = { setWorn(costume: string | null, bow: string | null, top: string | null = null) { worn.push(top === null ? [costume, bow] : [costume, bow, top]) }, setVisitor() {} } as unknown as AtelierRoom
  let idle: (() => void) | null = null
  const wardrobe = createWardrobe({
    character, room, outfit: slot, onChange() {}, onIdle() { idle?.() },
  })
  const settled = async () => { for (let i = 0; i < 25 && wardrobe.busy; i++) await new Promise(resolve => setTimeout(resolve, 0)); assert.equal(wardrobe.busy, false) }
  return { slot, character, wardrobe, settled, worn, fail() { fail = true }, get attempts() { return attempts }, get opacity() { return opacity }, onIdle(fn: () => void) { idle = fn } }
}

test('bow and dress toggle independently and rapid actions retain their order', async () => {
  const s = setup()
  s.wardrobe.tapItem(bow)
  await s.settled()
  assert.deepEqual(s.character.look, { kind: 'bunny', costume: null, bow: 'kiki', top: null })
  s.wardrobe.tapItem(dress)
  s.wardrobe.tapItem(bow)
  s.wardrobe.tapDisplay('cat')
  await s.settled()
  assert.deepEqual(s.character.look, { kind: 'cat', costume: 'kiki', bow: null, top: null })
  assert.deepEqual(lookOf(s.slot.snapshot()), s.character.look)
  assert.equal(s.opacity, 1)
})

test('failed character change preserves the saved and visible outfit', async () => {
  const s = setup()
  s.wardrobe.tapItem(dress)
  await s.settled()
  s.fail()
  s.wardrobe.tapDisplay('cat')
  await s.settled()
  assert.deepEqual(s.character.look, { kind: 'bunny', costume: 'kiki', bow: null, top: null })
  assert.deepEqual(lookOf(s.slot.snapshot()), s.character.look)
  assert.equal(s.opacity, 1)
})

test('a saved character whose model fails does not retry in an infinite loop', async () => {
  const s = setup()
  s.fail()
  const follower = followOutfit(s.character, s.slot, () => false, () => {})
  s.slot.update(o => ({ ...o, character: { v: 'cat', at: 1 } }))
  await new Promise(resolve => setTimeout(resolve, 10))
  follower.sync()
  assert.equal(s.attempts, 1)
  follower.dispose()
})

test('the cardigan goes on over the dress, comes off alone, and a retired colour is not worn', async () => {
  const s = setup()
  s.wardrobe.tapItem(dress)
  s.wardrobe.tapItem(cardigan)
  await s.settled()
  assert.deepEqual(s.character.look, { kind: 'bunny', costume: 'kiki', bow: null, top: 'cardigan-red' })
  assert.deepEqual(lookOf(s.slot.snapshot()), s.character.look)
  s.wardrobe.tapItem({ slot: 'costume', id: 'cardigan-navy-blue' })
  await s.settled()
  assert.equal(s.character.look.top, 'cardigan-red')
  // A new dress swaps only the dress; the cardigan stays on over it.
  s.wardrobe.tapItem({ slot: 'costume', id: 'blue-floral' })
  await s.settled()
  assert.deepEqual(s.character.look, { kind: 'bunny', costume: 'blue-floral', bow: null, top: 'cardigan-red' })
  s.wardrobe.tapItem(cardigan)
  await s.settled()
  assert.deepEqual(lookOf(s.slot.snapshot()), { kind: 'bunny', costume: 'blue-floral', bow: null, top: null })
})

test('the gold cape and the cardigan swap instead of stacking', async () => {
  const s = setup()
  s.wardrobe.tapItem({ slot: 'costume', id: 'gold-cape' })
  s.wardrobe.tapItem(cardigan)
  await s.settled()
  assert.deepEqual(s.character.look, { kind: 'bunny', costume: null, bow: null, top: 'cardigan-red' })
  s.wardrobe.tapItem({ slot: 'costume', id: 'gold-cape' })
  await s.settled()
  assert.deepEqual(lookOf(s.slot.snapshot()), { kind: 'bunny', costume: 'gold-cape', bow: null, top: null })
})

test('every character wears the same cardigan, and an unknown piece changes nothing', async () => {
  const s = setup()
  s.wardrobe.tapItem(cardigan)
  s.wardrobe.tapDisplay('otter')
  await s.settled()
  assert.deepEqual(s.character.look, { kind: 'otter', costume: null, bow: null, top: 'cardigan-red' })
  assert.deepEqual(s.worn.at(-1), [null, null, 'cardigan-red'])
  s.wardrobe.tapItem({ slot: 'costume', id: 'cape' })
  await s.settled()
  assert.equal(lookOf(s.slot.snapshot()).top, 'cardigan-red')
})

test('the floral dress and crown equip, persist, carry across characters, and return independently', async () => {
  const s = setup()
  const floral = { slot: 'costume', id: 'blue-floral' } as const
  const crown = { slot: 'bow', id: 'flower-crown' } as const
  s.wardrobe.tapItem(floral)
  s.wardrobe.tapItem(crown)
  await s.settled()
  assert.deepEqual(lookOf(s.slot.snapshot()), { kind: 'bunny', costume: 'blue-floral', bow: 'flower-crown', top: null })
  for (const kind of ['cat', 'otter', 'bunny'] as const) {
    s.wardrobe.tapDisplay(kind)
    await s.settled()
    assert.deepEqual(s.character.look, { kind, costume: 'blue-floral', bow: 'flower-crown', top: null })
    assert.deepEqual(s.worn.at(-1), ['blue-floral', 'flower-crown'])
  }
  s.wardrobe.tapItem(crown)
  await s.settled()
  assert.deepEqual(lookOf(s.slot.snapshot()), { kind: 'bunny', costume: 'blue-floral', bow: null, top: null })
  s.wardrobe.tapItem(floral)
  await s.settled()
  assert.deepEqual(s.worn.at(-1), [null, null])
})

test('a headpiece replaces the one worn before it, and the gold set keeps it', async () => {
  const s = setup()
  s.wardrobe.tapItem({ slot: 'costume', id: 'gold-cape' })
  s.wardrobe.tapItem({ slot: 'bow', id: 'hibiscus-pink' })
  s.wardrobe.tapItem({ slot: 'bow', id: 'blue-cap' })
  await s.settled()
  assert.deepEqual(lookOf(s.slot.snapshot()), { kind: 'bunny', costume: 'gold-cape', bow: 'blue-cap', top: null })
  s.wardrobe.tapItem({ slot: 'costume', id: 'gold-sequin' })
  s.wardrobe.tapItem({ slot: 'bow', id: 'blue-cap' })
  await s.settled()
  assert.deepEqual(s.worn.at(-1), ['gold-sequin', null])
})

test('the closet dresses an outfit and headpiece together, and can take both off', async () => {
  const s = setup()
  s.wardrobe.dress({ costume: 'gold-cape', top: null }, 'hibiscus-pink')
  await s.settled()
  assert.deepEqual(lookOf(s.slot.snapshot()), { kind: 'bunny', costume: 'gold-cape', bow: 'hibiscus-pink', top: null })
  assert.deepEqual(s.worn.at(-1), ['gold-cape', 'hibiscus-pink'])
  s.wardrobe.dress({ costume: 'unknown', top: null }, null)
  await s.settled()
  assert.deepEqual(lookOf(s.slot.snapshot()), { kind: 'bunny', costume: null, bow: null, top: null })
})


test('clothing stacks by place: one item each, a new one replaces only its place, a worn one comes off', () => {
  const fits = () => true
  let look: Look = { kind: 'bunny', costume: null, bow: null, top: null }
  look = toggleWorn(look, { slot: 'costume', id: 'kiki' }, fits)!
  look = toggleWorn(look, { slot: 'bow', id: 'flower-crown' }, fits)!
  assert.deepEqual(look, { kind: 'bunny', costume: 'kiki', bow: 'flower-crown', top: null })
  // A second costume replaces the first, leaving the crown alone.
  look = toggleWorn(look, { slot: 'costume', id: 'blue-floral' }, fits)!
  assert.deepEqual(look, { kind: 'bunny', costume: 'blue-floral', bow: 'flower-crown', top: null })
  // A second headpiece replaces the crown, leaving the dress alone.
  look = toggleWorn(look, { slot: 'bow', id: 'blue-cap' }, fits)!
  assert.deepEqual(look, { kind: 'bunny', costume: 'blue-floral', bow: 'blue-cap', top: null })
  // Tapping what is already worn takes only that piece off.
  look = toggleWorn(look, { slot: 'costume', id: 'blue-floral' }, fits)!
  assert.deepEqual(look, { kind: 'bunny', costume: null, bow: 'blue-cap', top: null })
  // A piece that doesn't fit this character changes nothing.
  assert.equal(toggleWorn(look, { slot: 'bow', id: 'cape' }, () => false), null)
})

test('the closet leaves the other place exactly as it was', async () => {
  const s = setup()
  s.wardrobe.dress({ costume: 'kiki', top: null }, 'flower-crown')
  await s.settled()
  const before = s.slot.snapshot()
  s.wardrobe.dress({ costume: 'blue-floral', top: null }, 'flower-crown')
  await s.settled()
  const after = s.slot.snapshot()
  assert.equal(after.costume.v, 'blue-floral')
  assert.deepEqual(after.bow, before.bow)
  assert.equal(after.costume.at > before.costume.at, true)
})

test('the closet dresses both layers at once and restamps only the layer that changed', async () => {
  const s = setup()
  s.wardrobe.dress({ costume: 'blue-floral', top: 'cardigan-red' }, null)
  await s.settled()
  assert.deepEqual(lookOf(s.slot.snapshot()), { kind: 'bunny', costume: 'blue-floral', bow: null, top: 'cardigan-red' })
  assert.deepEqual(s.worn.at(-1), ['blue-floral', null, 'cardigan-red'])
  const before = s.slot.snapshot()
  s.wardrobe.dress({ costume: 'tutu', top: 'cardigan-red' }, null)
  await s.settled()
  const after = s.slot.snapshot()
  assert.equal(after.costume.v, 'tutu')
  assert.deepEqual(after.top, before.top)
})

test('a tap on a stacked look takes off only the piece tapped', () => {
  const fits = () => true
  let look: Look = { kind: 'cat', costume: 'kiki', bow: 'kiki', top: 'cardigan-red' }
  look = toggleWorn(look, { slot: 'costume', id: 'kiki' }, fits)!
  assert.deepEqual(look, { kind: 'cat', costume: null, bow: 'kiki', top: 'cardigan-red' })
  look = toggleWorn(look, { slot: 'costume', id: 'gold-sequin' }, fits)!
  assert.deepEqual(look, { kind: 'cat', costume: 'gold-sequin', bow: 'kiki', top: 'cardigan-red' })
})
