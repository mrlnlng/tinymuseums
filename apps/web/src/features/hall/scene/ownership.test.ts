import assert from 'node:assert/strict'
import { test } from 'node:test'
import { ownedLook, shouldRewriteOutfit } from './wardrobe.ts'
import type { OwnedSnapshot } from '../../economy/lib/ownership.ts'

const look = { kind: 'otter', costume: 'kiki', bow: 'kiki' } as const
const nonMember: OwnedSnapshot = { isMember: false, balance: null, items: [] }
const loadingMember: OwnedSnapshot = { isMember: true, balance: null, items: [] }
const loadedMember: OwnedSnapshot = { isMember: true, balance: 120, items: ['bow:kiki'] }

test('a non-member immediately loses unowned pieces and characters', () => {
  assert.deepEqual(ownedLook(look, nonMember), { kind: 'bunny', costume: null, bow: null })
  assert.deepEqual(ownedLook({ ...look, kind: 'cat' }, nonMember), { kind: 'cat', costume: null, bow: null })
  assert.equal(shouldRewriteOutfit(look, nonMember), true)
})

test('a member still loading their wallet is left untouched', () => {
  assert.deepEqual(ownedLook(look, loadingMember), look)
  assert.equal(shouldRewriteOutfit(look, loadingMember), false)
})

test('a loaded member keeps only owned pieces and allowed characters', () => {
  assert.deepEqual(ownedLook(look, loadedMember), { kind: 'bunny', costume: null, bow: 'kiki' })
  assert.equal(shouldRewriteOutfit(look, loadedMember), true)
  assert.equal(shouldRewriteOutfit({ ...look, kind: 'cat', bow: 'kiki' }, loadedMember), true)
  assert.equal(
    shouldRewriteOutfit({ ...look, kind: 'cat', costume: null, bow: 'kiki' }, loadedMember),
    false,
  )
})

test('a loading member who owns everything is not rewritten', () => {
  const all: OwnedSnapshot = {
    isMember: true,
    balance: 60,
    items: ['costume:kiki', 'bow:kiki', 'character:otter'],
  }
  assert.deepEqual(ownedLook(look, all), look)
  assert.equal(shouldRewriteOutfit(look, all), false)
})
