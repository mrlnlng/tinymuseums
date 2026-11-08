import type { AssetName } from '@/shared/lib/assets'

/**
 * The pond's client-side copy of the server tables.
 *
 * `packages/core/src/economy/pond.ts` imports `node:crypto`, so client code must
 * never import its runtime values. Keep this file in sync; `tables.test.ts`
 * asserts parity with `POND_SPECIES`, the variant odds/multipliers and
 * `POND_BAIT_COST` straight from core.
 */

export type FishId = 'star-snapper' | 'crab' | 'puffer' | 'blobfish'
export type BaitId = 'worm' | 'shrimp' | 'berry' | 'cupcake'
export type FishTier = 'common' | 'uncommon' | 'rare' | 'legendary'
export type FishVariant = 'normal' | 'shiny' | 'golden' | 'moonlit' | 'prismatic'
export type ShadowSize = 'tiny' | 'small' | 'big' | 'huge'

export type PondTreasure =
  | { kind: 'pearls'; pearls: number }
  | { kind: 'bait'; bait: BaitId; count: number }
  | { kind: 'charm'; casts: number }

export interface Species {
  id: FishId
  name: string
  art: AssetName
  tier: FishTier
  weight: number
  pearls: number
  medianCm: number
  minCm: number
  maxCm: number
  fight: number
}

export const SPECIES: readonly Species[] = [
  {
    id: 'star-snapper',
    name: 'Star snapper',
    art: 'pond/fish-star-snapper',
    tier: 'common',
    weight: 55,
    pearls: 2,
    medianCm: 22,
    minCm: 14,
    maxCm: 40,
    fight: 0,
  },
  {
    id: 'crab',
    name: 'Crab',
    art: 'pond/fish-crab',
    tier: 'uncommon',
    weight: 28,
    pearls: 4,
    medianCm: 18,
    minCm: 10,
    maxCm: 34,
    fight: 1,
  },
  {
    id: 'puffer',
    name: 'Pufferfish',
    art: 'pond/fish-puffer',
    tier: 'rare',
    weight: 14,
    pearls: 8,
    medianCm: 26,
    minCm: 15,
    maxCm: 45,
    fight: 2,
  },
  {
    id: 'blobfish',
    name: 'Sir Blobfish',
    art: 'pond/fish-blobfish',
    tier: 'legendary',
    weight: 3,
    pearls: 40,
    medianCm: 35,
    minCm: 22,
    maxCm: 60,
    fight: 3,
  },
]

export const SPECIES_BY_ID: Record<FishId, Species> = Object.fromEntries(
  SPECIES.map((species) => [species.id, species]),
) as Record<FishId, Species>

export const TIER_LABEL: Record<FishTier, string> = {
  common: 'Common',
  uncommon: 'Uncommon',
  rare: 'Rare',
  legendary: 'Legendary',
}

export const TIER_RANK: Record<FishTier, number> = {
  common: 0,
  uncommon: 1,
  rare: 2,
  legendary: 3,
}

export interface Variant {
  id: FishVariant
  label: string
  odds: number
  fullMoonOdds: number
  multiplier: number
}

/** Display order; the roll order below matches core's rare-first draw. */
export const VARIANTS: readonly Variant[] = [
  { id: 'normal', label: 'Normal', odds: 1, fullMoonOdds: 1, multiplier: 1 },
  { id: 'shiny', label: 'Shiny', odds: 1 / 40, fullMoonOdds: 1 / 40, multiplier: 2 },
  { id: 'golden', label: 'Golden', odds: 1 / 200, fullMoonOdds: 1 / 200, multiplier: 5 },
  { id: 'moonlit', label: 'Moonlit', odds: 1 / 600, fullMoonOdds: 1 / 150, multiplier: 10 },
  { id: 'prismatic', label: 'Prismatic', odds: 1 / 2500, fullMoonOdds: 1 / 2500, multiplier: 25 },
]

export const VARIANT_BY_ID: Record<FishVariant, Variant> = Object.fromEntries(
  VARIANTS.map((variant) => [variant.id, variant]),
) as Record<FishVariant, Variant>

const RARE_ROLL_ORDER: readonly Exclude<FishVariant, 'normal'>[] = [
  'prismatic',
  'moonlit',
  'golden',
  'shiny',
]

export interface Bait {
  id: BaitId
  name: string
  glyph: string
  pack: number
  cost: number
  boost: Partial<Record<FishId, number>>
}

export const BAIT: readonly Bait[] = [
  { id: 'worm', name: 'Worm', glyph: '🪱', pack: 0, cost: 0, boost: {} },
  { id: 'shrimp', name: 'Shrimp', glyph: '🦐', pack: 5, cost: 20, boost: { crab: 3 } },
  { id: 'berry', name: 'Berry', glyph: '🫐', pack: 5, cost: 20, boost: { puffer: 3 } },
  { id: 'cupcake', name: 'Cupcake', glyph: '🧁', pack: 3, cost: 40, boost: { blobfish: 4 } },
]

export const BAIT_BY_ID: Record<BaitId, Bait> = Object.fromEntries(
  BAIT.map((bait) => [bait.id, bait]),
) as Record<BaitId, Bait>

export interface VariantOddsRow {
  variant: FishVariant
  multiplier: number
  probability: number
}

/** Mirrors core's rare-first draw and its normal remainder. */
export function variantOdds(lucky = false, fullMoon = false): VariantOddsRow[] {
  const scale = lucky ? 3 : 1
  let remaining = 1
  const rows: VariantOddsRow[] = []
  for (const id of RARE_ROLL_ORDER) {
    const variant = VARIANT_BY_ID[id]
    const odds = fullMoon && id === 'moonlit' ? variant.fullMoonOdds : variant.odds
    const probability = Math.min(remaining, odds * scale)
    rows.push({ variant: id, multiplier: variant.multiplier, probability })
    remaining -= probability
  }
  rows.push({ variant: 'normal', multiplier: 1, probability: remaining })
  return rows
}

export function pickVariant(
  random: () => number = Math.random,
  lucky = false,
  fullMoon = false,
): FishVariant {
  let at = Math.max(0, Math.min(0.999999, random()))
  for (const row of variantOdds(lucky, fullMoon)) {
    if (at < row.probability) return row.variant
    at -= row.probability
  }
  return 'normal'
}

export function speciesWeights(bait: BaitId = 'worm'): { id: FishId; weight: number }[] {
  const boost = BAIT_BY_ID[bait].boost
  return SPECIES.map((species) => ({
    id: species.id,
    weight: species.weight * (boost[species.id] ?? 1),
  }))
}

export function pickSpecies(bait: BaitId = 'worm', random: () => number = Math.random): FishId {
  const weights = speciesWeights(bait)
  const total = weights.reduce((sum, entry) => sum + entry.weight, 0)
  let at = Math.max(0, Math.min(0.999999, random())) * total
  for (const entry of weights) {
    if (at < entry.weight) return entry.id
    at -= entry.weight
  }
  return weights[weights.length - 1].id
}

function gaussian(random: () => number): number {
  const first = Math.max(1e-9, Math.min(1 - 1e-9, random()))
  const second = random()
  return Math.sqrt(-2 * Math.log(first)) * Math.cos(2 * Math.PI * second)
}

export const POND_SIGMA = 0.18
export const POND_TROPHY_Z = 2.326

export function rollSize(
  speciesId: FishId,
  perfectCast = false,
  random: () => number = Math.random,
): { sizeCm: number; z: number; trophy: boolean } {
  const species = SPECIES_BY_ID[speciesId]
  const z = gaussian(random)
  const raw = species.medianCm * Math.exp(POND_SIGMA * z) * (perfectCast ? 1.1 : 1)
  const sizeCm = Math.round(Math.min(species.maxCm, Math.max(species.minCm, raw)) * 10) / 10
  return { sizeCm, z, trophy: z > POND_TROPHY_Z }
}

export function streakMultiplier(streak: number): number {
  if (streak >= 5) return 3
  if (streak === 4) return 2
  if (streak === 3) return 1.5
  if (streak === 2) return 1.25
  return 1
}

export interface PearlBreakdown {
  base: number
  size: number
  variant: number
  streak: number
}

export function catchPearls(
  speciesId: FishId,
  sizeCm: number,
  variant: FishVariant,
  streak: number,
): { pearls: number; breakdown: PearlBreakdown } {
  const species = SPECIES_BY_ID[speciesId]
  const size = (sizeCm / species.medianCm) ** 2
  const variantFactor = VARIANT_BY_ID[variant].multiplier
  const streakFactor = streakMultiplier(streak)
  const pearls = Math.max(1, Math.round(species.pearls * size * variantFactor * streakFactor))
  return { pearls, breakdown: { base: species.pearls, size, variant: variantFactor, streak: streakFactor } }
}

const SHADOWS: Record<FishTier, readonly (readonly [number, ShadowSize])[]> = {
  common: [
    [0.55, 'tiny'],
    [0.9, 'small'],
    [1, 'big'],
  ],
  uncommon: [
    [0.5, 'small'],
    [0.92, 'big'],
    [1, 'huge'],
  ],
  rare: [
    [0.6, 'big'],
    [1, 'huge'],
  ],
  legendary: [[1, 'huge']],
}

export function shadowFor(random: () => number, tier: FishTier): ShadowSize {
  const roll = Math.max(0, Math.min(0.999999, random()))
  for (const [below, shadow] of SHADOWS[tier]) if (roll < below) return shadow
  return SHADOWS[tier][SHADOWS[tier].length - 1][1]
}

export function nibblesFor(random: () => number): number {
  return Math.max(0, Math.min(3, Math.floor(Math.max(0, Math.min(0.999999, random())) * 4)))
}

export function treasureFor(random: () => number): boolean {
  return Math.max(0, Math.min(0.999999, random())) < 0.2
}

export function treasureLoot(random: () => number, detail: () => number): PondTreasure {
  const bucket = Math.max(0, Math.min(0.999999, random()))
  if (bucket < 0.8) {
    return { kind: 'pearls', pearls: 10 + Math.floor(Math.max(0, Math.min(0.999999, detail())) * 31) }
  }
  if (bucket < 0.95) {
    const bait: BaitId = detail() < 0.5 ? 'shrimp' : 'berry'
    return { kind: 'bait', bait, count: BAIT_BY_ID[bait].pack }
  }
  return { kind: 'charm', casts: 5 }
}

export function treasureLabel(treasure: PondTreasure | null | undefined): string | null {
  if (!treasure) return null
  if (treasure.kind === 'pearls') return `${treasure.pearls} pearls`
  if (treasure.kind === 'bait') return `${treasure.count} ${BAIT_BY_ID[treasure.bait].name.toLowerCase()}`
  return `Lucky charm (${treasure.casts} casts)`
}

export function isFishId(value: string): value is FishId {
  return Object.hasOwn(SPECIES_BY_ID, value)
}

export function isBaitId(value: string): value is BaitId {
  return Object.hasOwn(BAIT_BY_ID, value)
}

export function isFishVariant(value: string): value is FishVariant {
  return Object.hasOwn(VARIANT_BY_ID, value)
}
