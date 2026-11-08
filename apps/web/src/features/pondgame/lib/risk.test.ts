import assert from 'node:assert/strict'
import test from 'node:test'
import {
  chainChipLabel,
  chainOffer,
  clampWagerStake,
  formatPayout,
  formatWagerPercent,
  missWagerLabel,
  stepWagerStake,
  streakChip,
  wagerChipLabel,
  wagerLimits,
  wagerRows,
} from './risk.ts'

test('wager limits respect purse, max stake and the daily cap', () => {
  assert.deepEqual(wagerLimits(155, 45), { leftToday: 155, maxStake: 100 })
  assert.deepEqual(wagerLimits(12, 0), { leftToday: 200, maxStake: 10 })
  assert.deepEqual(wagerLimits(500, 198), { leftToday: 2, maxStake: 0 })
  assert.deepEqual(wagerLimits(500, 195), { leftToday: 5, maxStake: 5 })
  assert.deepEqual(wagerLimits(3, 0), { leftToday: 200, maxStake: 0 })
})

test('wager stakes snap to 5 and stay within the limits', () => {
  assert.equal(clampWagerStake(37, 100, 0), 35)
  assert.equal(clampWagerStake(120, 100, 0), 100)
  assert.equal(clampWagerStake(3, 100, 0), 5)
  assert.equal(clampWagerStake(50, 8, 0), 5)
  assert.equal(clampWagerStake(50, 4, 0), 0)
  assert.equal(stepWagerStake(100, 1, 100, 0), 100)
  assert.equal(stepWagerStake(5, -1, 100, 0), 5)
  assert.equal(stepWagerStake(20, 1, 22, 0), 20)
  assert.equal(stepWagerStake(20, 1, 25, 0), 25)
})

test('payout and probability formatting is honest', () => {
  assert.equal(formatPayout(30), '×30.0')
  assert.equal(formatPayout(3.6), '×3.6')
  assert.equal(formatPayout(0), '—')
  assert.equal(formatWagerPercent(0.03), '3.0%')
  assert.equal(formatWagerPercent(0.135), '13.5%')
  assert.equal(formatWagerPercent(0.0004), '0.04%')
  assert.equal(formatWagerPercent(0), '—')
})

test('wager rows keep the server order and odds', () => {
  const rows = wagerRows({
    tiers: { common: 0.55, uncommon: 0.28, rare: 0.14, legendary: 0.03 },
    payouts: { common: 1.6, uncommon: 3.2, rare: 6.4, legendary: 30 },
  })
  assert.deepEqual(
    rows.map((row) => row.label),
    ['Common', 'Uncommon', 'Rare', 'Legendary'],
  )
  assert.equal(rows[3].probability, 0.03)
  assert.equal(rows[3].payout, 30)
  assert.deepEqual(wagerRows(null), [])
})

test('streak chip grows by tier and hints at the next multiplier', () => {
  assert.equal(streakChip(1), null)
  assert.deepEqual(streakChip(2), { tier: 1, multiplier: 1.25, next: 1.5, hint: '1 more → ×1.5' })
  assert.deepEqual(streakChip(3), { tier: 2, multiplier: 1.5, next: 2, hint: '1 more → ×2' })
  assert.deepEqual(streakChip(4), { tier: 3, multiplier: 2, next: 3, hint: '1 more → ×3' })
  assert.deepEqual(streakChip(5), { tier: 4, multiplier: 3, next: null, hint: 'Max streak' })
  assert.deepEqual(streakChip(9), { tier: 4, multiplier: 3, next: null, hint: 'Max streak' })
})

test('chip and danger copy', () => {
  assert.equal(wagerChipLabel('legendary', 30, 20), '🎯 Legendary ×30.0 · 20 pearls')
  assert.equal(chainChipLabel(1, 12), '🪝 Chain 1 · pot 12')
  assert.equal(missWagerLabel(20), 'Missed the call (−20)')
})

test('chain offer doubles rare odds then triples on the second link', () => {
  const first = chainOffer(0, 0, 12)
  assert.equal(first.nextLevel, 1)
  assert.equal(first.rareOdds, '×2')
  assert.equal(first.payout, '×1.5')
  assert.equal(first.pot, 12)
  assert.match(first.line, /rare odds ×2/)
  assert.match(first.line, /12 pearls/)
  const second = chainOffer(1, 24, 8)
  assert.equal(second.nextLevel, 2)
  assert.equal(second.rareOdds, '×3')
  assert.equal(second.payout, '×2')
  assert.equal(second.pot, 32)
  assert.match(chainOffer(0, 0, 1).line, /1 pearl ride along/)
})
