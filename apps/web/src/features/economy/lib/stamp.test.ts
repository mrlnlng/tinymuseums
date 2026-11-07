import assert from 'node:assert/strict'
import { test } from 'node:test'
import { STAMP_SVG, stampLabel } from './stamp.ts'

test('amounts are counted in stamps, one stamp alone', () => {
  assert.equal(stampLabel(1), '1 stamp')
  assert.equal(stampLabel(0), '0 stamps')
  assert.equal(stampLabel(42), '42 stamps')
})

test('the stamp is a perforated SVG with no stray numbers in its path', () => {
  assert.match(STAMP_SVG, /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)
  assert.doesNotMatch(STAMP_SVG, /NaN|undefined/)
})
