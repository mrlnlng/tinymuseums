import assert from 'node:assert/strict'
import { test } from 'node:test'
import { latest, restamp } from './merge.ts'
import { outfit } from './outfit.ts'
import { upgrade } from './index.ts'

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

test('outfit parse accepts unknown clothing ids and validates each register', () => {
  const valid = { character: { v: 'cat', at: 1 }, costume: { v: 'a-new-costume', at: 2 }, bow: { v: null, at: 0 }, top: { v: null, at: 0 } }
  assert.ok(outfit.parse(valid))
  assert.equal(outfit.parse({ ...valid, character: { v: 'dog', at: 1 } }), null)
  assert.equal(outfit.parse({ ...valid, character: { v: 'cat', at: -1 } }), null)
  assert.equal(outfit.parse({ ...valid, costume: { v: 'Bad Id', at: 2 } }), null)
  assert.equal(outfit.parse({ ...valid, bow: { v: 'Bad Bow', at: 2 } }), null)
  assert.equal(outfit.parse({ ...valid, bow: { v: null, at: -1 } }), null)
  assert.equal(outfit.parse({ ...valid, top: { v: 'Bad Top', at: 2 } }), null)
  assert.equal(outfit.parse({ ...valid, extra: 1 }), null)
  const { top: _top, ...withoutTop } = valid
  assert.equal(outfit.parse(withoutTop), null)
  assert.equal(outfit.parse({ ...valid, character: { v: 'cat', at: 1, extra: 1 } }), null)
})

test('merging two devices keeps each field\'s own latest choice', () => {
  const phone = { character: { v: 'cat' as const, at: 20 }, costume: { v: null, at: 5 }, bow: { v: 'kiki', at: 40 }, top: { v: 'cardigan-red', at: 50 } }
  const laptop = { character: { v: 'bunny' as const, at: 10 }, costume: { v: 'kiki', at: 30 }, bow: { v: null, at: 10 }, top: { v: null, at: 60 } }
  assert.deepEqual(outfit.merge(phone, laptop), { character: { v: 'cat', at: 20 }, costume: { v: 'kiki', at: 30 }, bow: { v: 'kiki', at: 40 }, top: { v: null, at: 60 } })
})

test('version one outfits retain both Kiki pieces when upgraded', () => {
  assert.deepEqual(upgrade(outfit, 1, { character: { v: 'cat', at: 2 }, costume: { v: 'kiki', at: 7 } }), {
    character: { v: 'cat', at: 2 }, costume: { v: 'kiki', at: 7 }, bow: { v: 'kiki', at: 7 }, top: { v: null, at: 0 },
  })
  assert.deepEqual(upgrade(outfit, 1, { character: { v: 'bunny', at: 2 }, costume: { v: null, at: 7 } }), {
    character: { v: 'bunny', at: 2 }, costume: { v: null, at: 7 }, bow: { v: null, at: 7 }, top: { v: null, at: 0 },
  })
  assert.equal(upgrade(outfit, 1, { character: { v: 'dog', at: 2 }, costume: { v: null, at: 7 } }), null)
})

test('version two outfits move a worn cardigan onto the top layer over no dress', () => {
  assert.deepEqual(upgrade(outfit, 2, { character: { v: 'otter', at: 2 }, costume: { v: 'cardigan-red', at: 9 }, bow: { v: 'kiki', at: 4 } }), {
    character: { v: 'otter', at: 2 }, costume: { v: null, at: 9 }, bow: { v: 'kiki', at: 4 }, top: { v: 'cardigan-red', at: 9 },
  })
  // A retired colour moves too; the wardrobe then simply doesn't wear an unknown piece.
  assert.equal((upgrade(outfit, 2, { character: { v: 'cat', at: 1 }, costume: { v: 'cardigan-navy-blue', at: 3 }, bow: { v: null, at: 0 } }) as { top: { v: string } }).top.v, 'cardigan-navy-blue')
  assert.deepEqual(upgrade(outfit, 2, { character: { v: 'cat', at: 1 }, costume: { v: 'blue-floral', at: 3 }, bow: { v: null, at: 0 } }), {
    character: { v: 'cat', at: 1 }, costume: { v: 'blue-floral', at: 3 }, bow: { v: null, at: 0 }, top: { v: null, at: 0 },
  })
  assert.equal(upgrade(outfit, 2, { character: { v: 'cat', at: 1 }, costume: { v: null, at: 3 } }), null)
})
