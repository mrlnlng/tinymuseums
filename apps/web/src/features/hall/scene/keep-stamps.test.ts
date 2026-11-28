import assert from 'node:assert/strict'
import { test } from 'node:test'
import { itemIdFor, priceOf } from '@tiny/core/economy'
import { keepStamps } from './keep-stamps.ts'

const otter = itemIdFor('character', 'otter')
const kiki = itemIdFor('costume', 'kiki')
const otterPrice = priceOf(otter)!
const member = (balance: number, items: string[] = []) => ({ isMember: true, balance, items })

test('nothing to keep while the wallet loads, or when everything worn is kept or free', () => {
  assert.deepEqual(keepStamps({ kind: 'otter', costume: 'kiki', bow: null, top: null }, null), [])
  assert.deepEqual(keepStamps({ kind: 'otter', costume: null, bow: null, top: null }, { isMember: true, balance: null, items: [] }), [])
  assert.deepEqual(keepStamps({ kind: 'bunny', costume: null, bow: null, top: null }, member(0)), [])
  assert.deepEqual(keepStamps({ kind: 'otter', costume: 'kiki', bow: null, top: null }, member(0, [otter, kiki])), [])
})

test('one stamp per unkept thing, each with its own price', () => {
  const stamps = keepStamps({ kind: 'otter', costume: 'kiki', bow: 'flower-crown', top: null }, member(10_000))
  assert.deepEqual(stamps.map((s) => s.part), ['character', 'costume', 'bow'])
  assert.ok(stamps.every((s) => s.state === 'ready' && s.progress === 1 && s.price === priceOf(s.itemId)))
})

test('short of stamps shows how far along the purse is; guests see a lock', () => {
  const [short] = keepStamps({ kind: 'otter', costume: null, bow: null, top: null }, member(otterPrice / 2))
  assert.equal(short.state, 'short')
  assert.equal(short.progress, 0.5)
  const [locked] = keepStamps({ kind: 'otter', costume: null, bow: null, top: null }, { isMember: false, balance: null, items: [] })
  assert.equal(locked.state, 'locked')
})
