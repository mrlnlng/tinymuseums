import assert from 'node:assert/strict'
import { test } from 'node:test'
import { planGame, ROUND_SPREAD } from './plan.ts'

test('a game never shows the same painting twice', () => {
  for (let i = 0; i < 200; i++) {
    const rounds = planGame(5, 3)
    assert.equal(rounds.length, 3)
    assert.equal(new Set(rounds.map((round) => round % 5)).size, 3)
  }
})

test('the first round is kept and the rest avoid its painting', () => {
  for (let i = 0; i < 200; i++) {
    const rounds = planGame(4, 3, { first: 9 })
    assert.equal(rounds[0], 9)
    assert.ok(rounds.slice(1).every((round) => round % 4 !== 9 % 4))
  }
})

test('paintings from the last game are skipped while others remain', () => {
  const avoid = new Set([0, 1, 2])
  for (let i = 0; i < 200; i++) {
    const rounds = planGame(6, 3, { avoid })
    assert.ok(rounds.every((round) => !avoid.has(round % 6)))
  }
})

test('with a small pool, recently seen paintings fill the remaining rounds', () => {
  const rounds = planGame(4, 3, { avoid: new Set([0, 1, 2]) })
  assert.equal(new Set(rounds.map((round) => round % 4)).size, 3)
})

test('rounds stay inside the cacheable range', () => {
  for (const size of [4, 7, 30, 999, 1500]) {
    for (const round of planGame(size, 3)) assert.ok(round >= 0 && round < Math.max(ROUND_SPREAD, size))
  }
})

test('games come out in different orders', () => {
  const games = new Set(Array.from({ length: 50 }, () => planGame(8, 3).map((r) => r % 8).join()))
  assert.ok(games.size > 20)
})
