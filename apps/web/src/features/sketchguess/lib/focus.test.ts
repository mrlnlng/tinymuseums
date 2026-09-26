import assert from 'node:assert/strict'
import { test } from 'node:test'
import { pickFocus } from './focus.ts'

test('the zoom lands on the busy part of the painting', () => {
  const width = 60
  const height = 60
  const ink = new Uint8Array(width * height)
  for (let y = 30; y < 40; y++) for (let x = 30; x < 40; x++) ink[y * width + x] = 255
  for (let i = 0; i < 50; i++) {
    const focus = pickFocus(ink, width, height)
    assert.ok(focus.x > 0.4 && focus.x < 0.8, `x ${focus.x}`)
    assert.ok(focus.y > 0.4 && focus.y < 0.8, `y ${focus.y}`)
  }
})

test('the zoom never centres on the outer edge', () => {
  const ink = new Uint8Array(40 * 40).fill(255)
  for (let i = 0; i < 100; i++) {
    const { x, y } = pickFocus(ink, 40, 40)
    assert.ok(x > 1 / 6 && x < 5 / 6 && y > 1 / 6 && y < 5 / 6)
  }
})

test('a blank ink map still gives a usable centre', () => {
  const { x, y } = pickFocus(new Uint8Array(30 * 30), 30, 30, () => 0)
  assert.ok(x > 0 && x < 1 && y > 0 && y < 1)
})
