import assert from 'node:assert/strict'
import { test } from 'node:test'
import { latest, restamp } from './merge.ts'
import { outfit } from './outfit.ts'

test('latest keeps the later choice and breaks equal stamps the same way on every device', () => {
  const a = { v: 'cat', at: 10 }
  const b = { v: 'bunny', at: 12 }
  assert.equal(latest(a, b), b)
  assert.equal(latest(b, a), b)
  const tieA = { v: 'cat', at: 10 }
  const tieB = { v: 'bunny', at: 10 }
  assert.deepEqual(latest(tieA, tieB), latest(tieB, tieA))
})

test('restamp always moves forward, even when the clock is behind the stored choice', () => {
  const future = { v: 'cat' as const, at: Date.now() + 86_400_000 }
  assert.ok(restamp(future, 'bunny').at > future.at)
})

test('outfit parse accepts unknown costume ids and rejects unknown characters and stray fields', () => {
  assert.ok(outfit.parse({ character: { v: 'cat', at: 1 }, costume: { v: 'a-new-costume', at: 2 } }))
  assert.equal(outfit.parse({ character: { v: 'dog', at: 1 }, costume: { v: null, at: 2 } }), null)
  assert.equal(outfit.parse({ character: { v: 'cat', at: -1 }, costume: { v: null, at: 2 } }), null)
  assert.equal(outfit.parse({ character: { v: 'cat', at: 1 }, costume: { v: 'Bad Id', at: 2 } }), null)
  assert.equal(outfit.parse({ character: { v: 'cat', at: 1 }, costume: { v: null, at: 2 }, extra: 1 }), null)
  assert.equal(outfit.parse({ character: { v: 'cat', at: 1, extra: 1 }, costume: { v: null, at: 2 } }), null)
})

test('merging two devices keeps each field\'s own latest choice', () => {
  const phone = { character: { v: 'cat' as const, at: 20 }, costume: { v: null, at: 5 } }
  const laptop = { character: { v: 'bunny' as const, at: 10 }, costume: { v: 'kiki', at: 30 } }
  assert.deepEqual(outfit.merge(phone, laptop), { character: { v: 'cat', at: 20 }, costume: { v: 'kiki', at: 30 } })
})
