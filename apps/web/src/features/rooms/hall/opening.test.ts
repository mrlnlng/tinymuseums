import assert from 'node:assert/strict'
import { test } from 'node:test'
import { hallIsReady, type Opening } from './opening.ts'

const at = (patch: Partial<Opening>): boolean =>
  hallIsReady({ waitedMs: 100, viaDoor: false, warm: false, fontsReady: true, art: 'none', ...patch })

test('with no painting in the first view, the hall waits only for its fonts', () => {
  assert.equal(at({ art: 'none' }), true)
  assert.equal(at({ art: 'none', fontsReady: false }), false)
})

test('a painting in the first view is waited for, up to the cap', () => {
  assert.equal(at({ art: 'loading' }), false)
  assert.equal(at({ art: 'ready' }), true)
  assert.equal(at({ art: 'pending' }), false, 'a scene not yet laid out is not an empty view')
  assert.equal(at({ art: 'loading', waitedMs: 5001 }), true)
})

test('fonts that never load still open the hall at the cap', () => {
  assert.equal(at({ fontsReady: false, waitedMs: 5001 }), true)
})

test('a cold door arrival holds its cover; a warm one does not', () => {
  assert.equal(at({ viaDoor: true, waitedMs: 2000 }), false)
  assert.equal(at({ viaDoor: true, waitedMs: 2900 }), true)
  assert.equal(at({ viaDoor: true, warm: true, waitedMs: 100 }), true)
})
