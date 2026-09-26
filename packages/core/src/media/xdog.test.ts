import assert from 'node:assert/strict'
import { test } from 'node:test'
import { XDOG_DEFAULTS, xdogInk } from './xdog.ts'

function noise(width: number, height: number): Float32Array {
  let state = 42
  return Float32Array.from({ length: width * height }, () => {
    state = (state * 1103515245 + 12345) >>> 0
    return (state >>> 8) / 0xffffff
  })
}

test('a busy image is held to the ink coverage cap', () => {
  const width = 120
  const height = 90
  const ink = xdogInk(noise(width, height), width, height)
  const inked = ink.filter((value) => value > 0.5).length / ink.length
  assert.ok(inked <= XDOG_DEFAULTS.maxCoverage + 0.01, `covered ${inked}`)
})

test('a flat image leaves the page blank', () => {
  const ink = xdogInk(new Float32Array(64 * 64).fill(0.6), 64, 64)
  assert.ok(ink.every((value) => value < 0.5))
})

test('a hard edge is inked', () => {
  const width = 64
  const gray = Float32Array.from({ length: width * width }, (_, i) => (i % width < width / 2 ? 0.1 : 0.9))
  const ink = xdogInk(gray, width, width)
  assert.ok(ink.some((value) => value > 0.5))
})
