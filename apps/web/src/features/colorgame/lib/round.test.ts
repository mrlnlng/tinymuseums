import assert from 'node:assert/strict'
import { test } from 'node:test'
import { deltaE, hexToOklab, inGamut } from './color.ts'
import { makeRound, separation, showMs } from './round.ts'

function seeded(seed: number): () => number {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

test('separation tightens with the streak and has a floor', () => {
  for (let streak = 0; streak < 200; streak++) {
    assert.ok(separation(streak) >= separation(streak + 1))
  }
  assert.ok(Math.abs(separation(0) - 0.05) < 1e-12)
  assert.equal(separation(500), 0.018)
})

test('show time shortens with the streak and has a floor', () => {
  for (let streak = 0; streak < 200; streak++) {
    assert.ok(showMs(streak) >= showMs(streak + 1))
  }
  assert.equal(showMs(0), 1400)
  assert.equal(showMs(500), 700)
})

test('rounds keep every option unique, in gamut, and correctly spaced', () => {
  let checked = 0
  for (let seed = 1; seed <= 20; seed++) {
    for (let streak = 0; streak <= 30; streak++) {
      const rng = seeded(seed * 1000 + streak)
      const round = makeRound(streak, rng)
      const distance = separation(streak)
      const targetLab = hexToOklab(round.target)

      assert.equal(round.options.length, 4)
      assert.equal(new Set(round.options).size, 4)
      assert.ok(round.answer >= 0 && round.answer < 4)
      assert.equal(round.options[round.answer], round.target)
      assert.match(round.target, /^#[0-9a-f]{6}$/)

      const labs = round.options.map((hex) => hexToOklab(hex))
      for (const [index, hex] of round.options.entries()) {
        assert.match(hex, /^#[0-9a-f]{6}$/)
        assert.ok(inGamut(labs[index]), `${hex} at streak ${streak}`)
      }

      for (let i = 0; i < 4; i++) {
        for (let j = i + 1; j < 4; j++) {
          assert.ok(
            deltaE(labs[i], labs[j]) >= 0.7 * distance,
            `options ${i} and ${j} too close at streak ${streak}`,
          )
        }
      }

      for (let index = 0; index < 4; index++) {
        if (index === round.answer) continue
        const actual = deltaE(targetLab, labs[index])
        assert.ok(
          Math.abs(actual - distance) <= distance * 0.1 + 1e-9,
          `distractor ${index} off by ${Math.abs(actual - distance)} at streak ${streak}`,
        )
      }
      checked++
    }
  }
  assert.equal(checked, 20 * 31)
})
