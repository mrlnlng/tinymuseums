import assert from 'node:assert/strict'
import { test } from 'node:test'
import { outfit as definition, type Outfit } from '@tiny/core/slots'
import { createWardrobe, followOutfit, lookOf } from './wardrobe.ts'
import type { Character, Look } from './character.ts'
import type { AtelierRoom } from './atelier.ts'
import type { SlotHandle } from '@/shared/lib/slots'

const dress = { slot: 'costume', id: 'kiki' } as const
const bow = { slot: 'bow', id: 'kiki' } as const
const navy = { slot: 'costume', id: 'cardigan-navy-blue' } as const

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
  const room = { setWorn(costume: string | null, bow: string | null) { worn.push([costume, bow]) }, setVisitor() {} } as unknown as AtelierRoom
  const misfits: string[] = []
  let idle: (() => void) | null = null
  const wardrobe = createWardrobe({
    character, room, outfit: slot, onChange() {}, onMisfit(item, kind) { misfits.push(`${item.id}:${kind}`) }, onIdle() { idle?.() },
  })
  const settled = async () => { for (let i = 0; i < 25 && wardrobe.busy; i++) await new Promise(resolve => setTimeout(resolve, 0)); assert.equal(wardrobe.busy, false) }
  return { slot, character, wardrobe, settled, worn, misfits, fail() { fail = true }, get attempts() { return attempts }, get opacity() { return opacity }, onIdle(fn: () => void) { idle = fn } }
}

test('bow and dress toggle independently and rapid actions retain their order', async () => {
  const s = setup()
  s.wardrobe.tapItem(bow)
  await s.settled()
  assert.deepEqual(s.character.look, { kind: 'bunny', costume: null, bow: 'kiki' })
  s.wardrobe.tapItem(dress)
  s.wardrobe.tapItem(bow)
  s.wardrobe.tapDisplay('cat')
  await s.settled()
  assert.deepEqual(s.character.look, { kind: 'cat', costume: 'kiki', bow: null })
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
  assert.deepEqual(s.character.look, { kind: 'bunny', costume: 'kiki', bow: null })
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

test('a cardigan replaces the dress, and changing colour swaps it', async () => {
  const s = setup()
  s.wardrobe.tapItem(dress)
  s.wardrobe.tapItem(navy)
  await s.settled()
  assert.deepEqual(s.character.look, { kind: 'bunny', costume: 'cardigan-navy-blue', bow: null })
  s.wardrobe.tapItem({ slot: 'costume', id: 'cardigan-red' })
  await s.settled()
  assert.equal(s.character.look.costume, 'cardigan-red')
  s.wardrobe.tapItem({ slot: 'costume', id: 'cardigan-red' })
  await s.settled()
  assert.equal(lookOf(s.slot.snapshot()).costume, null)
})

test('every character wears the same cardigan, and an unfitted piece only says so', async () => {
  const s = setup()
  s.wardrobe.tapItem(navy)
  s.wardrobe.tapDisplay('otter')
  await s.settled()
  assert.deepEqual(s.character.look, { kind: 'otter', costume: 'cardigan-navy-blue', bow: null })
  assert.deepEqual(s.worn.at(-1), ['cardigan-navy-blue', null])
  s.wardrobe.tapItem({ slot: 'costume', id: 'cape' })
  await s.settled()
  assert.deepEqual(s.misfits, ['cape:otter'])
  assert.equal(lookOf(s.slot.snapshot()).costume, 'cardigan-navy-blue')
})
