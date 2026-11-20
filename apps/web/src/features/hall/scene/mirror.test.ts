import assert from 'node:assert/strict'
import { test } from 'node:test'
import { kindAt, MIRROR_KINDS, settle, wrap } from './mirror.ts'

test('the mirror runs round all four characters in both directions', () => {
  assert.equal(MIRROR_KINDS.length, 4)
  assert.equal(kindAt(0), 'bunny')
  assert.equal(kindAt(-1), 'bruce')
  assert.equal(kindAt(5), 'cat')
  assert.equal(wrap(-9, 4), 3)
})

test('a swipe moves one character, only once it is clearly a swipe', () => {
  assert.equal(settle(2, -10, 300), 2)
  assert.equal(settle(2, -80, 300), 3)
  assert.equal(settle(2, 80, 300), 1)
  assert.equal(settle(2, -900, 300), 3)
  assert.equal(settle(2, -20, 300, -0.8), 3)
  assert.equal(settle(2, 20, 300, -0.8), 2)
  assert.equal(settle(2, 0, 300, 1), 2)
})
