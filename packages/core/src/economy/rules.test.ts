import assert from 'node:assert/strict'
import { test } from 'node:test'
import { GAME_DAILY_CAP, GAMES, SECRET_FEATURES, validateClaim } from './rules.ts'

const now = new Date('2026-11-01T12:00:00Z')
const at = (request: unknown) => validateClaim(request, now)

test('the welcome purse is a fixed once-ever claim', () => {
  assert.deepEqual(at({ source: 'welcome' }), {
    source: 'welcome',
    claimKey: 'welcome',
    day: null,
    requested: 60,
    dailyCap: null,
  })
})

test('the hidden coin is one 10-coin claim per local day', () => {
  assert.deepEqual(at({ source: 'coin', tzOffsetMinutes: 0 }), {
    source: 'coin',
    claimKey: 'coin:2026-11-01',
    day: '2026-11-01',
    requested: 10,
    dailyCap: 10,
  })
  assert.equal(at({ source: 'coin', tzOffsetMinutes: 840 })?.day, '2026-11-02')
  assert.equal(at({ source: 'coin', tzOffset: 840 })?.day, '2026-11-02')
})

test('every allowed secret pays 10 once, keyed by its feature', () => {
  for (const feature of SECRET_FEATURES) {
    assert.deepEqual(at({ source: 'secret', feature }), {
      source: 'secret',
      claimKey: `secret:${feature}`,
      day: null,
      requested: 10,
      dailyCap: null,
    })
  }
})

test('secrets outside the allow-list are invalid', () => {
  for (const feature of ['', 'unknown', 'statue ', 'STATUE', null, 7]) {
    assert.equal(at({ source: 'secret', feature }), null)
  }
})

test('a painting pays 5 once per piece id', () => {
  assert.deepEqual(at({ source: 'art', pieceId: 'piece-123' }), {
    source: 'art',
    claimKey: 'art:piece-123',
    day: null,
    requested: 5,
    dailyCap: null,
  })
  for (const pieceId of ['', null, 7, 'x'.repeat(101)]) {
    assert.equal(at({ source: 'art', pieceId }), null)
  }
})

test('games pay one per score point, keyed by day and run', () => {
  for (const game of GAMES) {
    assert.deepEqual(at({ source: 'game', game, runId: 'run-12345678', score: 17, tzOffsetMinutes: 0 }), {
      source: 'game',
      claimKey: 'game:2026-11-01:run-12345678',
      day: '2026-11-01',
      requested: 17,
      dailyCap: GAME_DAILY_CAP,
    })
  }
  assert.equal(GAME_DAILY_CAP, 25)
  assert.equal(at({ source: 'game', game: 'colorrecall', runId: 'run-12345678', score: 0 })?.requested, 0)
})

test('games reject unknown games, bad run ids and impossible scores', () => {
  const base = { source: 'game', game: 'colorrecall', runId: 'run-12345678', score: 5 }
  for (const game of ['colorgame', 'sketchguess', '', null]) {
    assert.equal(at({ ...base, game }), null)
  }
  for (const runId of ['short', 'x'.repeat(41), 'has space', 'has$dollar', '', null]) {
    assert.equal(at({ ...base, runId }), null)
  }
  for (const score of [-1, 101, 1.5, Number.NaN, Number.POSITIVE_INFINITY, '5', null]) {
    assert.equal(at({ ...base, score }), null)
  }
})

test('a guest note pays 5 once per local day', () => {
  assert.deepEqual(at({ source: 'note', tzOffsetMinutes: -480 }), {
    source: 'note',
    claimKey: 'note:2026-11-01',
    day: '2026-11-01',
    requested: 5,
    dailyCap: 5,
  })
})

test('malformed requests and unknown sources are invalid', () => {
  for (const request of [null, undefined, [], 'welcome', 7, {}, { source: 'bogus' }, { source: 7 }]) {
    assert.equal(at(request), null)
  }
})

test('the exchange source turns a multiple of ten pearls into stamps, capped daily', () => {
  assert.deepEqual(
    at({ source: 'exchange', pearls: 30, claimId: 'exchange-1', tzOffsetMinutes: 0 }),
    {
      source: 'exchange',
      claimKey: 'exchange:2026-11-01:exchange-1',
      day: '2026-11-01',
      requested: 3,
      dailyCap: 20,
    },
  )
  assert.equal(at({ source: 'exchange', pearls: 30 })?.requested, 3)
  for (const pearls of [0, -10, 15, 10.5, Number.NaN, '20', null]) {
    assert.equal(at({ source: 'exchange', pearls }), null)
  }
})
