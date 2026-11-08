import {
  SPECIES_BY_ID,
  catchPearls,
  nibblesFor,
  pickSpecies,
  pickVariant,
  rollSize,
  shadowFor,
  treasureFor,
  treasureLoot,
  type BaitId,
  type FishId,
  type FishTier,
  type FishVariant,
  type PearlBreakdown,
  type PondTreasure,
  type ShadowSize,
} from './tables.ts'

export interface CatchWagerView {
  tier: FishTier
  stake: number
  multiplier: number
  won: number
}

/** A catch as the reveal card needs it, whether it came from the server or a guest roll. */
export interface CatchView {
  id: string
  species: FishId
  tier: FishTier
  variant: FishVariant
  sizeCm: number
  trophy: boolean
  pearls: number
  breakdown: PearlBreakdown
  isNewSpecies: boolean
  isNewVariant: boolean
  personalBest: boolean
  treasure: PondTreasure | null
  trophyCollected: boolean
  wager: CatchWagerView | null
  chainPaid: number | null
  guest: boolean
}

export interface GuestRoll {
  species: FishId
  tier: FishTier
  variant: FishVariant
  sizeCm: number
  trophy: boolean
  fight: number
  shadow: ShadowSize
  nibbles: number
  treasure: boolean
  pearls: number
  breakdown: PearlBreakdown
}

export interface GuestRollOptions {
  bait: BaitId
  perfectCast: boolean
  streak: number
  debug: ReadonlySet<string>
  random?: () => number
}

/** Dev-only `?pondDebug=` tokens. They only touch guest local rolls. */
export function debugTokens(): Set<string> {
  if (process.env.NODE_ENV === 'production' || typeof window === 'undefined') return new Set()
  const raw = new URLSearchParams(window.location.search).get('pondDebug')
  if (!raw) return new Set()
  return new Set(
    raw
      .split(/[,|+]/)
      .map((token) => token.trim().toLowerCase())
      .filter(Boolean),
  )
}

function debugSpecies(tokens: ReadonlySet<string>): FishId | null {
  if (tokens.has('legendary') || tokens.has('blobfish')) return 'blobfish'
  if (tokens.has('rare') || tokens.has('puffer')) return 'puffer'
  if (tokens.has('uncommon') || tokens.has('crab')) return 'crab'
  if (tokens.has('common') || tokens.has('snapper')) return 'star-snapper'
  return null
}

function debugVariant(tokens: ReadonlySet<string>): FishVariant | null {
  for (const variant of ['prismatic', 'moonlit', 'golden', 'shiny', 'normal'] as const) {
    if (tokens.has(variant)) return variant
  }
  return null
}

export interface DebugVisuals {
  streak: number
  chain: { level: number; pot: number } | null
  wager: { tier: FishTier; stake: number; multiplier: number } | null
}

/**
 * Dev-only visual seeds for screenshots (`?pondDebug=streak4,chain1,wager`).
 * They change what a guest's HUD displays, never a server roll or a member's state.
 */
export function debugVisuals(tokens: ReadonlySet<string>): DebugVisuals {
  let streak = 0
  let chain: DebugVisuals['chain'] = null
  let wager: DebugVisuals['wager'] = null
  if (tokens.has('streak')) streak = 4
  for (const token of tokens) {
    const streakMatch = /^streak(\d+)$/.exec(token)
    if (streakMatch) streak = Math.max(0, Math.min(9, Number(streakMatch[1])))
    const chainMatch = /^chain(\d+)$/.exec(token)
    if (chainMatch) {
      const level = Math.max(1, Math.min(2, Number(chainMatch[1])))
      chain = { level, pot: level === 1 ? 12 : 30 }
    }
    if (token === 'chain') chain = { level: 1, pot: 12 }
    if (token === 'wager' || token === 'wagerwin') wager = { tier: 'legendary', stake: 20, multiplier: 30 }
    if (token === 'wagercommon') wager = { tier: 'common', stake: 20, multiplier: 1.6 }
  }
  return { streak, chain, wager }
}

export function rollGuest({
  bait,
  perfectCast,
  streak,
  debug,
  random = Math.random,
}: GuestRollOptions): GuestRoll {
  const speciesId = debugSpecies(debug) ?? pickSpecies(bait, random)
  const species = SPECIES_BY_ID[speciesId]
  const variant = debugVariant(debug) ?? pickVariant(random, false, false)
  let size = rollSize(speciesId, perfectCast, random)
  if (debug.has('trophy')) size = { ...size, trophy: true, sizeCm: Math.round(species.medianCm * 1.7 * 10) / 10 }
  const { pearls, breakdown } = catchPearls(speciesId, size.sizeCm, variant, streak + 1)
  return {
    species: speciesId,
    tier: species.tier,
    variant,
    sizeCm: size.sizeCm,
    trophy: size.trophy,
    fight: species.fight,
    shadow: shadowFor(random, species.tier),
    nibbles: nibblesFor(random),
    treasure: treasureFor(random),
    pearls,
    breakdown,
  }
}

export function guestTreasure(
  random: () => number = Math.random,
  detail: () => number = Math.random,
): PondTreasure {
  return treasureLoot(random, detail)
}
