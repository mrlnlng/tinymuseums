import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  BAIT,
  BAIT_BY_ID,
  SPECIES,
  SPECIES_BY_ID,
  VARIANTS,
  VARIANT_BY_ID,
  catchPearls,
  nibblesFor,
  pickSpecies,
  rollSize,
  shadowFor,
  speciesWeights,
  treasureFor,
  treasureLoot,
  variantOdds,
} from './tables.ts'

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

test('the client species table matches core POND_SPECIES exactly', async () => {
  const core = await import('../../../../../../packages/core/src/economy/pond.ts')
  assert.deepEqual(
    SPECIES.map(({ id, tier, weight, pearls, medianCm, minCm, maxCm, fight }) => ({
      id,
      tier,
      weight,
      pearls,
      medianCm,
      minCm,
      maxCm,
      fight,
    })),
    core.POND_SPECIES.map(({ id, tier, weight, pearls, medianCm, minCm, maxCm, fight }) => ({
      id,
      tier,
      weight,
      pearls,
      medianCm,
      minCm,
      maxCm,
      fight,
    })),
  )
  assert.deepEqual(
    SPECIES.map((species) => species.name),
    ['Star snapper', 'Crab', 'Pufferfish', 'Sir Blobfish'],
  )
})

test('the client bait table matches POND_BAIT_COST and POND_BAIT boosts', async () => {
  const core = await import('../../../../../../packages/core/src/economy/pond.ts')
  assert.deepEqual(
    BAIT.map(({ id, pack, cost }) => ({ id, pack, cost })),
    Object.entries(core.POND_BAIT_COST).map(([id, entry]) => ({ id, pack: entry.pack, cost: entry.cost })),
  )
  assert.deepEqual(
    BAIT.map(({ id, boost }) => ({ id, boost })),
    Object.entries(core.POND_BAIT).map(([id, entry]) => ({ id, boost: entry.boost })),
  )
})

test('the client variant table matches core odds, full-moon odds and multipliers', async () => {
  const core = await import('../../../../../../packages/core/src/economy/pond.ts')
  for (const variant of VARIANTS) {
    assert.equal(variant.multiplier, core.POND_VARIANT_MULTIPLIER[variant.id], variant.id)
  }
  const normal = core.pondVariantOdds(false, false)
  const full = core.pondVariantOdds(false, true)
  assert.deepEqual(
    variantOdds(false, false).map(({ variant, probability }) => ({ variant, probability })),
    normal.map(({ variant, probability }) => ({ variant, probability })),
  )
  assert.deepEqual(
    variantOdds(false, true).map(({ variant, probability }) => ({ variant, probability })),
    full.map(({ variant, probability }) => ({ variant, probability })),
  )
})

test('species weights and rolls follow the bait boosts', () => {
  assert.deepEqual(
    speciesWeights('worm').map((entry) => entry.weight),
    [55, 28, 14, 3],
  )
  assert.deepEqual(
    speciesWeights('shrimp').map((entry) => entry.weight),
    [55, 84, 14, 3],
  )
  assert.deepEqual(
    speciesWeights('berry').map((entry) => entry.weight),
    [55, 28, 42, 3],
  )
  assert.deepEqual(
    speciesWeights('cupcake').map((entry) => entry.weight),
    [55, 28, 14, 12],
  )
  assert.equal(pickSpecies('worm', () => 0), 'star-snapper')
  assert.equal(pickSpecies('worm', () => 0.999999), 'blobfish')
})

test('sizes stay inside the species clamp and perfect casts raise them', () => {
  const random = seeded(3)
  for (const species of SPECIES) {
    for (let i = 0; i < 200; i++) {
      const size = rollSize(species.id, false, random)
      assert.ok(size.sizeCm >= species.minCm && size.sizeCm <= species.maxCm, species.id)
    }
  }
  const plain = rollSize('star-snapper', false, () => 0.5)
  const perfect = rollSize('star-snapper', true, () => 0.5)
  assert.ok(perfect.sizeCm > plain.sizeCm)
})

test('catch pearls match core for the four rolls', async () => {
  const core = await import('../../../../../../packages/core/src/economy/pond.ts')
  for (const species of SPECIES) {
    for (const variant of VARIANTS) {
      for (const streak of [0, 1, 2, 3, 4, 5, 8]) {
        const sizeCm = species.medianCm * 1.12
        assert.deepEqual(
          catchPearls(species.id, sizeCm, variant.id, streak),
          core.pondCatchPearls(species.id, sizeCm, variant.id, streak),
          `${species.id} ${variant.id} ${streak}`,
        )
      }
    }
  }
})

test('shadows, nibbles and treasure follow the contract distributions', async () => {
  const core = await import('../../../../../../packages/core/src/economy/pond.ts')
  const random = seeded(21)
  for (const species of SPECIES) {
    for (let i = 0; i < 100; i++) {
      const roll = random()
      assert.equal(shadowFor(() => roll, species.tier), core.pondShadowFor(roll, species.tier), species.id)
    }
  }
  assert.equal(shadowFor(() => 0.999, 'legendary'), 'huge')
  assert.deepEqual([0, 0.25, 0.5, 0.75, 0.99].map((roll) => nibblesFor(() => roll)), [0, 1, 2, 3, 3])
  assert.equal(treasureFor(() => 0.19), true)
  assert.equal(treasureFor(() => 0.2), false)
  assert.deepEqual(treasureLoot(() => 0.1, () => 0.5), { kind: 'pearls', pearls: 25 })
  assert.deepEqual(treasureLoot(() => 0.9, () => 0.9), { kind: 'bait', bait: 'berry', count: 5 })
  assert.deepEqual(treasureLoot(() => 0.99, () => 0), { kind: 'charm', casts: 5 })
  assert.equal(SPECIES_BY_ID.puffer.fight, 2)
  assert.equal(BAIT_BY_ID.cupcake.cost, 40)
  assert.equal(VARIANT_BY_ID.prismatic.multiplier, 25)
})
