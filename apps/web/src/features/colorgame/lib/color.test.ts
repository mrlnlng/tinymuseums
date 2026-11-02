import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  deltaE,
  hexToOklab,
  inGamut,
  linearToSrgb,
  oklchToOklab,
  srgbToLinear,
  srgbToOklab,
  toHex,
  type Oklab,
} from './color.ts'

test('hex colours survive the OKLab round trip', () => {
  const colours = ['#ff0000', '#00ff00', '#0000ff', '#8a8a8a', '#fff1d2', '#6d402e', '#c22252']
  for (const hex of colours) {
    const lab = hexToOklab(hex)
    assert.ok(inGamut(lab), hex)
    assert.ok(deltaE(lab, hexToOklab(toHex(lab))) < 0.002, hex)
  }
})

test('sRGB gamma encoding is the inverse of decoding', () => {
  for (const value of [0, 0.001, 0.04, 0.2, 0.5, 0.9, 1]) {
    assert.ok(Math.abs(linearToSrgb(srgbToLinear(value)) - value) < 1e-9)
  }
})

test('OKLCH and OKLab describe the same colour', () => {
  const lch = { L: 0.62, C: 0.12, h: 210 }
  const lab = oklchToOklab(lch)
  const expected: Oklab = {
    L: 0.62,
    a: 0.12 * Math.cos((210 * Math.PI) / 180),
    b: 0.12 * Math.sin((210 * Math.PI) / 180),
  }
  assert.ok(deltaE(lab, expected) < 1e-12)
})

test('deltaE is Euclidean distance in OKLab', () => {
  assert.equal(deltaE({ L: 0, a: 0, b: 0 }, { L: 3, a: 4, b: 0 }), 5)
})

test('sRGB to OKLab matches a known neutral', () => {
  const lab = srgbToOklab({ r: 1, g: 1, b: 1 })
  assert.ok(Math.abs(lab.L - 1) < 1e-4)
  assert.ok(Math.abs(lab.a) < 1e-4)
  assert.ok(Math.abs(lab.b) < 1e-4)
})
