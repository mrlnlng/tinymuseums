import assert from 'node:assert/strict'
import { test } from 'node:test'
import { flickDirection, isUpwardFlick } from './flick.ts'

test('a quick, mostly upward flick counts; sideways swipes, slow drags and down-flicks do not', () => {
  assert.equal(isUpwardFlick(5, -60, 150), true)
  assert.equal(isUpwardFlick(-20, -45, 300), true)
  assert.equal(isUpwardFlick(0, -20, 100), false, 'too short to tell from a tap')
  assert.equal(isUpwardFlick(80, -60, 150), false, 'a sideways swipe scrolls the scene')
  assert.equal(isUpwardFlick(0, -80, 600), false, 'a slow drag is not a flick')
  assert.equal(isUpwardFlick(0, 60, 150), false, 'downward')
})

test('a flick leaning sideways hops that way; a straight one hops in place', () => {
  assert.equal(flickDirection(30), 1)
  assert.equal(flickDirection(-25), -1)
  assert.equal(flickDirection(6), 0)
})
