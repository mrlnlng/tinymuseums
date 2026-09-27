import assert from 'node:assert/strict'
import { test } from 'node:test'
import { shareText } from './share.ts'

const base = {
  brand: 'Tiny Museum',
  modeLabel: 'Zoom in',
  difficulty: 'hard',
  starsPerRound: 3,
  url: 'https://example.test/museum',
}

test('each round shows its stars out of three', () => {
  const text = shareText({ ...base, scores: [3, 1, 0], bonus: 0 })
  assert.equal(
    text,
    [
      'Guess the Painting at Tiny Museum',
      'Zoom in · hard',
      '⭐⭐⭐ ⭐▫️▫️ ▫️▫️▫️',
      '4/9 stars',
      'https://example.test/museum',
    ].join('\n'),
  )
})

test('streak bonuses are counted on the total line', () => {
  assert.match(shareText({ ...base, scores: [3, 3, 3], bonus: 1 }), /^9\/9 stars \+1 streak bonus$/m)
  assert.match(shareText({ ...base, scores: [3, 3, 3], bonus: 2 }), /\+2 streak bonuses$/m)
})
