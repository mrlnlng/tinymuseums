import assert from 'node:assert/strict'
import { test } from 'node:test'
import { CAST_SFX, catchSfx, lossSfx } from './sfx.ts'
import type { FishTier } from './tables.ts'

test('each catch tier has its own sound, growing with rarity', () => {
  assert.equal(catchSfx('common'), 'plink')
  assert.equal(catchSfx('uncommon'), 'chime2')
  assert.equal(catchSfx('rare'), 'chime3')
  assert.equal(catchSfx('legendary'), 'fanfare')
  const tiers: FishTier[] = ['common', 'uncommon', 'rare', 'legendary']
  assert.equal(new Set(tiers.map((tier) => catchSfx(tier))).size, 4)
})

test('a snapped line cracks and every other loss falls gently', () => {
  assert.equal(lossSfx('snap'), 'snap')
  for (const reason of ['spooked', 'missed', 'escaped', null] as const) assert.equal(lossSfx(reason), 'lost')
})

test('a cast has its whoosh', () => {
  assert.equal(CAST_SFX, 'cast')
})
