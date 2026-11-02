import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  MAX_CLAIM_BATCH,
  itemIdOf,
  parseWalletClaim,
  tzOffsetOf,
} from './body.ts'

test('tzOffsetOf reads minutes east of UTC and rejects bad values', () => {
  assert.equal(tzOffsetOf(120), 120)
  assert.equal(tzOffsetOf('-480'), -480)
  assert.equal(tzOffsetOf(0), 0)
  for (const value of [1.5, Number.NaN, Number.POSITIVE_INFINITY, '', null, undefined, {}]) {
    assert.equal(tzOffsetOf(value), 0)
  }
})

test('a single claim gets the body or query tzOffset', () => {
  assert.deepEqual(parseWalletClaim({ source: 'coin', tzOffset: 60 }, null), {
    kind: 'single',
    request: { source: 'coin', tzOffset: 60 },
  })
  assert.deepEqual(parseWalletClaim({ source: 'coin' }, '-480'), {
    kind: 'single',
    request: { source: 'coin', tzOffset: -480 },
  })
})

test('the claim route refuses welcome and note', () => {
  for (const source of ['welcome', 'note']) {
    assert.deepEqual(parseWalletClaim({ source }, null), { error: 'invalid' })
    assert.deepEqual(parseWalletClaim({ batch: [{ source }] }, null), { error: 'invalid' })
  }
})

test('a batch threads one tzOffset through every request and skips non-objects', () => {
  assert.deepEqual(
    parseWalletClaim(
      {
        batch: [
          { source: 'secret', feature: 'statue', tzOffset: 999 },
          null,
          { source: 'game', game: 'sketch', runId: 'run-12345678', score: 4 },
        ],
        tzOffset: 120,
      },
      null,
    ),
    {
      kind: 'batch',
      requests: [
        { source: 'secret', feature: 'statue', tzOffset: 120 },
        { source: 'game', game: 'sketch', runId: 'run-12345678', score: 4, tzOffset: 120 },
      ],
    },
  )
})

test('a batch over the limit and a non-object body are invalid', () => {
  assert.deepEqual(
    parseWalletClaim({ batch: Array.from({ length: MAX_CLAIM_BATCH + 1 }, () => ({})) }, null),
    { error: 'invalid' },
  )
  for (const body of [null, [], 'claim', 7]) {
    assert.deepEqual(parseWalletClaim(body, null), { error: 'invalid' })
  }
})

test('buy reads a non-empty string item id only', () => {
  assert.equal(itemIdOf({ itemId: 'bow:kiki' }), 'bow:kiki')
  for (const body of [{}, { itemId: '' }, { itemId: 7 }, null, []]) {
    assert.equal(itemIdOf(body), null)
  }
})
