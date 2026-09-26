import assert from 'node:assert/strict'
import { test } from 'node:test'
import { planSketchRound, SKETCH_CHOICES, type SketchCandidate } from './sketch.ts'

const pool: SketchCandidate[] = Array.from({ length: 9 }, (_, i) => ({ id: `p${i}`, title: `Piece ${i}` }))

test('the same epoch seed and round always plan the same round', () => {
  assert.deepEqual(planSketchRound(pool, 1234, 5), planSketchRound(pool, 1234, 5))
})

test('different seeds or rounds give different rounds', () => {
  const rounds = new Set(
    [0, 1, 2, 3].flatMap((round) => [11, 22].map((seed) => JSON.stringify(planSketchRound(pool, seed, round)))),
  )
  assert.ok(rounds.size > 4)
})

test('a round offers four distinct choices that include the answer', () => {
  for (let round = 0; round < 40; round++) {
    const plan = planSketchRound(pool, 99, round)
    assert.ok(plan)
    assert.equal(plan.choiceIds.length, SKETCH_CHOICES)
    assert.equal(new Set(plan.choiceIds).size, SKETCH_CHOICES)
    assert.ok(plan.choiceIds.includes(plan.answerId))
  }
})

test('consecutive rounds do not repeat an answer until the pool runs out', () => {
  const answers = Array.from({ length: pool.length }, (_, round) => planSketchRound(pool, 7, round)!.answerId)
  assert.equal(new Set(answers).size, pool.length)
})

test('pieces sharing a title are offered once, so no two choices read the same', () => {
  const twins = [...pool.slice(0, 3), { id: 'dup', title: ' piece 0 ' }]
  assert.equal(planSketchRound(twins, 1, 0), null)
  const plan = planSketchRound([...pool, { id: 'dup', title: 'PIECE 1' }], 3, 0)!
  assert.ok(!plan.choiceIds.includes('dup'))
})

test('fewer than four distinct pieces cannot make a round', () => {
  assert.equal(planSketchRound(pool.slice(0, 3), 1, 0), null)
})

test('the answer is spread evenly across the four positions', () => {
  const positions = [0, 0, 0, 0]
  for (let seed = 1; seed < 200; seed++) {
    for (let round = 0; round < 20; round++) {
      const plan = planSketchRound(pool, seed * 7919, round)!
      positions[plan.choiceIds.indexOf(plan.answerId)]++
    }
  }
  const expected = (199 * 20) / 4
  for (const count of positions) assert.ok(Math.abs(count - expected) < expected * 0.1, `${positions}`)
})
