import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto'
import { mulberry32 } from '../infra/random.ts'

/** Legacy cast odds kept for the phase-2 client; the server uses POND_SPECIES. */
export const POND_FISH = [
  { id: 'star-snapper', weight: 45 },
  { id: 'crab', weight: 30 },
  { id: 'puffer', weight: 20 },
  { id: 'blobfish', weight: 5 },
] as const

export type PondFishId = (typeof POND_FISH)[number]['id']

/** Legacy bait table; POND_BAIT_COST carries the pearl prices. */
export const POND_BAIT = {
  worm: { pack: 0, price: 0, boost: {} },
  shrimp: { pack: 5, price: 5, boost: { crab: 3 } },
  berry: { pack: 5, price: 5, boost: { puffer: 3 } },
  cupcake: { pack: 3, price: 9, boost: { blobfish: 4 } },
} as const satisfies Record<
  string,
  { pack: number; price: number; boost: Partial<Record<PondFishId, number>> }
>

export type PondBaitId = keyof typeof POND_BAIT

export const POND_BAIT_COST = {
  worm: { pack: 0, cost: 0 },
  shrimp: { pack: 5, cost: 20 },
  berry: { pack: 5, cost: 20 },
  cupcake: { pack: 3, cost: 40 },
} as const satisfies Record<PondBaitId, { pack: number; cost: number }>

export function isPondBait(value: unknown): value is PondBaitId {
  return typeof value === 'string' && Object.hasOwn(POND_BAIT, value)
}

export type PondTier = 'common' | 'uncommon' | 'rare' | 'legendary'

export interface PondSpecies {
  id: PondFishId
  tier: PondTier
  weight: number
  pearls: number
  medianCm: number
  minCm: number
  maxCm: number
  fight: number
}

export const POND_SPECIES = [
  { id: 'star-snapper', tier: 'common', weight: 55, pearls: 2, medianCm: 22, minCm: 14, maxCm: 40, fight: 0 },
  { id: 'crab', tier: 'uncommon', weight: 28, pearls: 4, medianCm: 18, minCm: 10, maxCm: 34, fight: 1 },
  { id: 'puffer', tier: 'rare', weight: 14, pearls: 8, medianCm: 26, minCm: 15, maxCm: 45, fight: 2 },
  { id: 'blobfish', tier: 'legendary', weight: 3, pearls: 40, medianCm: 35, minCm: 22, maxCm: 60, fight: 3 },
] as const satisfies readonly PondSpecies[]

export const POND_SIGMA = 0.18
export const POND_TROPHY_Z = 2.326
export const POND_PITY_SOFT = 60
export const POND_PITY_CERTAIN = 120
export const POND_PITY_STEP = 3
export const POND_CHAIN_MAX = 2
export const POND_WAGER_MIN = 5
export const POND_WAGER_MAX = 100
export const POND_WAGER_DAILY_CAP = 200
export const POND_TREASURE_CHANCE = 0.2
export const POND_LUCKY_CASTS = 5

export const POND_VARIANTS = ['normal', 'shiny', 'golden', 'moonlit', 'prismatic'] as const

export type PondVariant = (typeof POND_VARIANTS)[number]

interface RareVariant {
  id: Exclude<PondVariant, 'normal'>
  odds: number
  fullMoonOdds: number
  multiplier: number
}

const RARE_VARIANTS = [
  { id: 'prismatic', odds: 1 / 2500, fullMoonOdds: 1 / 2500, multiplier: 25 },
  { id: 'moonlit', odds: 1 / 600, fullMoonOdds: 1 / 150, multiplier: 10 },
  { id: 'golden', odds: 1 / 200, fullMoonOdds: 1 / 200, multiplier: 5 },
  { id: 'shiny', odds: 1 / 40, fullMoonOdds: 1 / 40, multiplier: 2 },
] as const satisfies readonly RareVariant[]

export const POND_VARIANT_MULTIPLIER: Record<PondVariant, number> = {
  normal: 1,
  shiny: 2,
  golden: 5,
  moonlit: 10,
  prismatic: 25,
}

export interface PondOddsConfig {
  bait: PondBaitId
  chainLevel: number
  pity: number
}

export interface PondOdds {
  tiers: Record<PondTier, number>
  payouts: Record<PondTier, number>
}

export function pondSpeciesById(id: PondFishId): PondSpecies {
  return POND_SPECIES.find((species) => species.id === id) ?? POND_SPECIES[0]
}

export function isPondFish(value: unknown): value is PondFishId {
  return typeof value === 'string' && POND_SPECIES.some((species) => species.id === value)
}

export function isPondTier(value: unknown): value is PondTier {
  return value === 'common' || value === 'uncommon' || value === 'rare' || value === 'legendary'
}

export function pondChainMultiplier(level: number): number {
  if (level >= 2) return 3
  return level === 1 ? 2 : 1
}

/** Weight of one species, with bait, chain and pity boosts of this cast. */
export function pondSpeciesWeights(
  config: PondOddsConfig,
): { id: PondFishId; tier: PondTier; weight: number }[] {
  if (config.pity >= POND_PITY_CERTAIN) {
    return POND_SPECIES.map((species) => ({
      id: species.id,
      tier: species.tier,
      weight: species.tier === 'legendary' ? 1 : 0,
    }))
  }

  const boost = POND_BAIT[config.bait].boost as Partial<Record<PondFishId, number>>
  const chain = pondChainMultiplier(config.chainLevel)
  return POND_SPECIES.map((species) => {
    const pity =
      species.tier === 'legendary' && config.pity >= POND_PITY_SOFT
        ? (config.pity - POND_PITY_SOFT + 1) * POND_PITY_STEP
        : 0
    const chainBoost = species.tier === 'rare' || species.tier === 'legendary' ? chain : 1
    return {
      id: species.id,
      tier: species.tier,
      weight: (species.weight + pity) * (boost[species.id] ?? 1) * chainBoost,
    }
  })
}

export function pondTierOdds(config: PondOddsConfig): Record<PondTier, number> {
  const weights = pondSpeciesWeights(config)
  const total = weights.reduce((sum, species) => sum + species.weight, 0)
  const tiers: Record<PondTier, number> = { common: 0, uncommon: 0, rare: 0, legendary: 0 }
  if (total <= 0) return tiers
  for (const species of weights) tiers[species.tier] += species.weight / total
  return tiers
}

export function pondSpeciesProbability(config: PondOddsConfig, id: PondFishId): number {
  const weights = pondSpeciesWeights(config)
  const total = weights.reduce((sum, species) => sum + species.weight, 0)
  const weight = weights.find((species) => species.id === id)?.weight ?? 0
  return total > 0 ? weight / total : 0
}

/** Fair odds less the fishmonger's 10% cut, floored to one decimal. */
export function pondPayoutMultiplier(probability: number): number {
  if (!(probability > 0)) return 0
  return Math.floor((0.9 / probability) * 10) / 10
}

export function pondOdds(config: PondOddsConfig): PondOdds {
  const tiers = pondTierOdds(config)
  return {
    tiers,
    payouts: {
      common: pondPayoutMultiplier(tiers.common),
      uncommon: pondPayoutMultiplier(tiers.uncommon),
      rare: pondPayoutMultiplier(tiers.rare),
      legendary: pondPayoutMultiplier(tiers.legendary),
    },
  }
}

export function pondSpeciesFor(roll: number, config: PondOddsConfig): PondFishId {
  const weights = pondSpeciesWeights(config)
  const total = weights.reduce((sum, species) => sum + species.weight, 0)
  let at = Math.max(0, Math.min(0.999999, roll)) * total
  for (const species of weights) {
    if (at < species.weight) return species.id
    at -= species.weight
  }
  return weights[weights.length - 1].id
}

export function pondStreakMultiplier(streak: number): number {
  if (streak >= 5) return 3
  if (streak === 4) return 2
  if (streak === 3) return 1.5
  if (streak === 2) return 1.25
  return 1
}

export function pondVariantOdds(
  lucky = false,
  fullMoon = false,
): { variant: PondVariant; multiplier: number; probability: number }[] {
  const scale = lucky ? 3 : 1
  let remaining = 1
  const rows: { variant: PondVariant; multiplier: number; probability: number }[] = []
  for (const variant of RARE_VARIANTS) {
    const odds = fullMoon && variant.id === 'moonlit' ? variant.fullMoonOdds : variant.odds
    const probability = Math.min(remaining, odds * scale)
    rows.push({ variant: variant.id, multiplier: variant.multiplier, probability })
    remaining -= probability
  }
  rows.push({ variant: 'normal', multiplier: 1, probability: remaining })
  return rows
}

export function pondVariantFor(roll: number, lucky = false, fullMoon = false): PondVariant {
  let at = Math.max(0, Math.min(0.999999, roll))
  for (const row of pondVariantOdds(lucky, fullMoon)) {
    if (at < row.probability) return row.variant
    at -= row.probability
  }
  return 'normal'
}

function inverseNormal(input: number): number {
  const p = Math.max(1e-9, Math.min(1 - 1e-9, input))
  const a = [-3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2, 1.38357751867269e2, -3.066479806614716e1, 2.506628277459239]
  const b = [-5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2, 6.680131188771972e1, -1.328068155288572e1]
  const c = [-7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783]
  const d = [7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996, 3.754408661907416]
  if (p < 0.02425) {
    const q = Math.sqrt(-2 * Math.log(p))
    return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
  }
  if (p <= 1 - 0.02425) {
    const q = p - 0.5
    const r = q * q
    return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q /
      (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1)
  }
  const q = Math.sqrt(-2 * Math.log(1 - p))
  return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
    ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
}

export function pondSizeFor(
  roll: number,
  speciesId: PondFishId,
  perfectCast = false,
): { sizeCm: number; z: number; trophy: boolean } {
  const species = pondSpeciesById(speciesId)
  const z = inverseNormal(roll)
  const raw = species.medianCm * Math.exp(POND_SIGMA * z) * (perfectCast ? 1.1 : 1)
  const sizeCm = Math.round(Math.min(species.maxCm, Math.max(species.minCm, raw)) * 10) / 10
  return { sizeCm, z, trophy: z > POND_TROPHY_Z }
}

export function pondCatchPearls(
  speciesId: PondFishId,
  sizeCm: number,
  variant: PondVariant,
  streak: number,
): { pearls: number; breakdown: { base: number; size: number; variant: number; streak: number } } {
  const species = pondSpeciesById(speciesId)
  const size = (sizeCm / species.medianCm) ** 2
  const variantFactor = POND_VARIANT_MULTIPLIER[variant]
  const streakFactor = pondStreakMultiplier(streak)
  const pearls = Math.max(
    1,
    Math.round(species.pearls * size * variantFactor * streakFactor),
  )
  return { pearls, breakdown: { base: species.pearls, size, variant: variantFactor, streak: streakFactor } }
}

export function pondChainPayout(pot: number, level: number): number {
  if (level <= 0 || pot <= 0) return 0
  return Math.round(pot * (level >= 2 ? 2 : 1.5))
}

export type PondTreasure =
  | { kind: 'pearls'; pearls: number }
  | { kind: 'bait'; bait: PondBaitId; count: number }
  | { kind: 'charm'; casts: number }

export function pondTreasureLoot(roll: number, detail: number): PondTreasure {
  const bucket = Math.max(0, Math.min(0.999999, roll))
  if (bucket < 0.8) return { kind: 'pearls', pearls: 10 + Math.floor(Math.max(0, Math.min(0.999999, detail)) * 31) }
  if (bucket < 0.95) {
    const baitId = detail < 0.5 ? 'shrimp' : 'berry'
    return { kind: 'bait', bait: baitId, count: POND_BAIT_COST[baitId].pack }
  }
  return { kind: 'charm', casts: POND_LUCKY_CASTS }
}

export type PondBountyKind = 'fish' | 'crab' | 'puffer' | 'variant' | 'trophy' | 'species' | 'pearls'

export interface PondBounty {
  id: string
  kind: PondBountyKind
  text: string
  target: number
  reward: number
}

export interface PondBountyCatch {
  species: PondFishId
  tier: PondTier
  variant: PondVariant
  sizeCm: number
  trophy: boolean
  pearls: number
}

interface BountyTemplate {
  kind: PondBountyKind
  target: number | readonly [number, number]
  reward: number | ((target: number) => number)
  text: (target: number) => string
  id: (target: number) => string
}

const BOUNTY_POOL: readonly BountyTemplate[] = [
  {
    kind: 'fish',
    target: [5, 15],
    reward: (target) => 15 + Math.round(((target - 5) / 10) * 45),
    text: (target) => `Land ${target} fish`,
    id: (target) => `fish-${target}`,
  },
  { kind: 'crab', target: 1, reward: 25, text: () => 'Land a crab at least 25 cm', id: () => 'crab-25' },
  { kind: 'puffer', target: 1, reward: 30, text: () => 'Land a pufferfish', id: () => 'puffer' },
  { kind: 'variant', target: 1, reward: 45, text: () => 'Land a shiny or rarer variant', id: () => 'variant-shiny' },
  { kind: 'trophy', target: 1, reward: 40, text: () => 'Land a trophy-size fish', id: () => 'trophy' },
  { kind: 'species', target: 3, reward: 35, text: () => 'Land 3 different species', id: () => 'species-3' },
  { kind: 'pearls', target: 60, reward: 50, text: () => 'Earn 60 pearls from catches', id: () => 'pearls-60' },
]

function bountySeed(day: string): number {
  let hash = 2166136261
  for (let index = 0; index < day.length; index++) {
    hash ^= day.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

/** Three distinct goals seeded by the UTC day, so every visitor sees the same board. */
export function pondBountiesFor(utcDay: string): PondBounty[] {
  const random = mulberry32(bountySeed(utcDay))
  const pool = BOUNTY_POOL.slice()
  for (let index = 0; index < 3; index++) {
    const swap = index + Math.floor(random() * (pool.length - index))
    const temporary = pool[index]
    pool[index] = pool[swap]
    pool[swap] = temporary
  }
  return pool.slice(0, 3).map((template) => {
    const target =
      typeof template.target === 'number'
        ? template.target
        : template.target[0] + Math.floor(random() * (template.target[1] - template.target[0] + 1))
    const reward =
      typeof template.reward === 'function' ? template.reward(target) : template.reward
    return {
      id: template.id(target),
      kind: template.kind,
      text: template.text(target),
      target,
      reward,
    }
  })
}

export function pondBountyProgress(
  bounty: Pick<PondBounty, 'kind' | 'target'>,
  catches: readonly PondBountyCatch[],
): number {
  let progress = 0
  switch (bounty.kind) {
    case 'fish':
      progress = catches.length
      break
    case 'crab':
      progress = catches.some((fish) => fish.species === 'crab' && fish.sizeCm >= 25) ? 1 : 0
      break
    case 'puffer':
      progress = catches.some((fish) => fish.species === 'puffer') ? 1 : 0
      break
    case 'variant':
      progress = catches.some((fish) => fish.variant !== 'normal') ? 1 : 0
      break
    case 'trophy':
      progress = catches.some((fish) => fish.trophy) ? 1 : 0
      break
    case 'species':
      progress = new Set(catches.map((fish) => fish.species)).size
      break
    case 'pearls':
      progress = catches.reduce((sum, fish) => sum + fish.pearls, 0)
      break
  }
  return Math.max(0, Math.min(bounty.target, progress))
}

const SYNODIC_MONTH = 29.530588853
const REFERENCE_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14)

export function pondMoon(now: Date): 'full' | 'other' {
  const days = (now.getTime() - REFERENCE_NEW_MOON) / 86_400_000
  const age = ((days % SYNODIC_MONTH) + SYNODIC_MONTH) % SYNODIC_MONTH
  const fromFull = Math.abs(age - SYNODIC_MONTH / 2)
  const distance = Math.min(fromFull, SYNODIC_MONTH - fromFull)
  return distance <= 1 ? 'full' : 'other'
}

export function isoWeek(now: Date): string {
  const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
  const day = date.getUTCDay() || 7
  date.setUTCDate(date.getUTCDate() + 4 - day)
  const yearStart = Date.UTC(date.getUTCFullYear(), 0, 1)
  const week = Math.ceil(((date.getTime() - yearStart) / 86_400_000 + 1) / 7)
  return `${date.getUTCFullYear()}-W${String(week).padStart(2, '0')}`
}

export function pondRoll(secret: string, roll: string, nonce: string): number {
  const digest = createHmac('sha256', secret).update(`pond-${roll}:${nonce}`).digest()
  return digest.readUInt32BE(0) / 2 ** 32
}

export function pondNonce(): string {
  return randomBytes(12).toString('base64url')
}

export type PondShadow = 'tiny' | 'small' | 'big' | 'huge'

/** Rarer fish cast bigger shadows; now and then a common one looks big, an honest near-miss. */
const SHADOWS: Record<PondTier, readonly (readonly [number, PondShadow])[]> = {
  common: [[0.55, 'tiny'], [0.9, 'small'], [1, 'big']],
  uncommon: [[0.5, 'small'], [0.92, 'big'], [1, 'huge']],
  rare: [[0.6, 'big'], [1, 'huge']],
  legendary: [[1, 'huge']],
}

export function pondShadowFor(roll: number, tier: PondTier): PondShadow {
  for (const [below, shadow] of SHADOWS[tier]) if (roll < below) return shadow
  return SHADOWS[tier][SHADOWS[tier].length - 1][1]
}

export function pondNibblesFor(roll: number): number {
  return Math.max(0, Math.min(3, Math.floor(roll * 4)))
}

export function pondTreasureFor(roll: number): boolean {
  return roll < POND_TREASURE_CHANCE
}

/** A cast takes at least this long to get a bite (0.5 s cast plus a 1.5 s minimum wait), less some slack. */
export const POND_MIN_REEL_MS = 1800
export const POND_MAX_REEL_MS = 120_000
const POND_MAX_TICKET = 300

export interface PondWager {
  tier: PondTier
  stake: number
  multiplier: number
}

export interface PondTicketOptions {
  nonce?: string
  species?: PondFishId
  wager?: PondWager | null
  chainLevel?: number
  chainPot?: number
  lucky?: boolean
  treasure?: boolean
}

interface TicketBody {
  m: string
  n: string
  t: number
  b: PondBaitId
  k?: PondFishId
  w?: [PondTier, number, number]
  c?: number
  p?: number
  l?: boolean
  tr?: boolean
}

function sign(secret: string, payload: string): string {
  return createHmac('sha256', secret).update(`pond-ticket:${payload}`).digest('base64url')
}

export function issuePondTicket(
  secret: string,
  memberId: string,
  now: number,
  bait: PondBaitId = 'worm',
  options: PondTicketOptions = {},
): string {
  const nonce = options.nonce ?? pondNonce()
  const species = options.species ?? pondFishFor(pondRoll(secret, 'fish', nonce), bait)
  const body: TicketBody = { m: memberId, n: nonce, t: now, b: bait, k: species }
  if (options.wager) body.w = [options.wager.tier, options.wager.stake, options.wager.multiplier]
  if (options.chainLevel) body.c = options.chainLevel
  if (options.chainPot) body.p = options.chainPot
  if (options.lucky) body.l = true
  if (options.treasure) body.tr = true
  const payload = Buffer.from(JSON.stringify(body)).toString('base64url')
  return `${payload}.${sign(secret, payload)}`
}

export type TicketCheck =
  | {
      ok: true
      nonce: string
      fish: PondFishId
      species: PondFishId
      bait: PondBaitId
      wager: PondWager | null
      chainLevel: number
      chainPot: number
      lucky: boolean
      treasure: boolean
    }
  | { ok: false; reason: 'invalid' | 'too_soon' | 'expired' }

/** Checks a cast ticket and rolls its fish from the secret, so the client cannot pick one. */
export function readPondTicket(secret: string, ticket: unknown, memberId: string, now: number): TicketCheck {
  if (typeof ticket !== 'string' || ticket.length > POND_MAX_TICKET) return { ok: false, reason: 'invalid' }
  const [payload, signature, extra] = ticket.split('.')
  if (!payload || !signature || extra !== undefined) return { ok: false, reason: 'invalid' }
  const expected = Buffer.from(sign(secret, payload))
  const given = Buffer.from(signature)
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return { ok: false, reason: 'invalid' }

  let body: TicketBody
  try {
    body = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as TicketBody
  } catch {
    return { ok: false, reason: 'invalid' }
  }
  if (
    body.m !== memberId ||
    typeof body.n !== 'string' ||
    typeof body.t !== 'number' ||
    !isPondBait(body.b)
  ) {
    return { ok: false, reason: 'invalid' }
  }
  const age = now - body.t
  if (age < POND_MIN_REEL_MS) return { ok: false, reason: 'too_soon' }
  if (age > POND_MAX_REEL_MS) return { ok: false, reason: 'expired' }

  let species: PondFishId
  if (body.k !== undefined) {
    if (!isPondFish(body.k)) return { ok: false, reason: 'invalid' }
    species = body.k
  } else {
    species = pondFishFor(pondRoll(secret, 'fish', body.n), body.b)
  }

  let wager: PondWager | null = null
  if (body.w !== undefined && body.w !== null) {
    if (!Array.isArray(body.w) || body.w.length !== 3) return { ok: false, reason: 'invalid' }
    const [tier, stake, multiplier] = body.w
    if (
      !isPondTier(tier) ||
      !Number.isSafeInteger(stake) ||
      (stake as number) < POND_WAGER_MIN ||
      (stake as number) > POND_WAGER_MAX ||
      typeof multiplier !== 'number' ||
      !Number.isFinite(multiplier) ||
      multiplier <= 0
    ) {
      return { ok: false, reason: 'invalid' }
    }
    wager = { tier, stake: stake as number, multiplier }
  }

  const chainLevel = body.c === undefined ? 0 : body.c
  const chainPot = body.p === undefined ? 0 : body.p
  if (!Number.isInteger(chainLevel) || chainLevel < 0 || chainLevel > POND_CHAIN_MAX) {
    return { ok: false, reason: 'invalid' }
  }
  if (!Number.isSafeInteger(chainPot) || chainPot < 0) return { ok: false, reason: 'invalid' }

  return {
    ok: true,
    nonce: body.n,
    fish: species,
    species,
    bait: body.b,
    wager,
    chainLevel,
    chainPot,
    lucky: body.l === true,
    treasure: body.tr === true,
  }
}

export function pondWeights(bait: PondBaitId = 'worm'): { id: PondFishId; weight: number }[] {
  const boost = POND_BAIT[bait].boost as Partial<Record<PondFishId, number>>
  return POND_FISH.map((fish) => ({ id: fish.id, weight: fish.weight * (boost[fish.id] ?? 1) }))
}

export function pondFishFor(roll: number, bait: PondBaitId = 'worm'): PondFishId {
  const weights = pondWeights(bait)
  const total = weights.reduce((sum, fish) => sum + fish.weight, 0)
  let at = Math.max(0, Math.min(0.999999, roll)) * total
  for (const fish of weights) {
    if (at < fish.weight) return fish.id
    at -= fish.weight
  }
  return weights[weights.length - 1].id
}
