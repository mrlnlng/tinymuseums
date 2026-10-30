import assert from 'node:assert/strict'
import { test } from 'node:test'
import { outfit as definition, type Outfit } from '@tiny/core/slots'
import { createWardrobe, followOutfit, lookOf } from './wardrobe.ts'
import type { Character, Look } from './character.ts'
import type { AtelierRoom } from './atelier.ts'
import type { SlotHandle } from '@/shared/lib/slots'

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
  const room = { setDressed() {}, setVisitor() {} } as unknown as AtelierRoom
  let idle: (() => void) | null = null
  const wardrobe = createWardrobe({ character, room, outfit: slot, costume: 'kiki', onChange() {}, onIdle() { idle?.() } })
  const settled = async () => { for (let i = 0; i < 25 && wardrobe.busy; i++) await new Promise(resolve => setTimeout(resolve, 0)); assert.equal(wardrobe.busy, false) }
  return { slot, character, wardrobe, settled, fail() { fail = true }, get attempts() { return attempts }, get opacity() { return opacity }, onIdle(fn: () => void) { idle = fn } }
}

test('bow and dress toggle independently and rapid actions retain their order', async () => {
  const s = setup()
  s.wardrobe.tapFeatured('bow')
  await s.settled()
  assert.deepEqual(s.character.look, { kind: 'bunny', costume: null, bow: 'kiki' })
  s.wardrobe.tapFeatured('dress')
  s.wardrobe.tapFeatured('bow')
  s.wardrobe.tapDisplay('cat')
  await s.settled()
  assert.deepEqual(s.character.look, { kind: 'cat', costume: 'kiki', bow: null })
  assert.deepEqual(lookOf(s.slot.snapshot()), s.character.look)
  assert.equal(s.opacity, 1)
})

test('failed character change preserves the saved and visible outfit', async () => {
  const s = setup()
  s.wardrobe.tapFeatured('dress')
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
