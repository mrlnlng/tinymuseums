/** Table and formatting facts for the pond room's panels. Kept client-side only. */
import { assetUrl } from '@/shared/lib/assets'

export const POND_SPECIES = [
  { id: 'star-snapper', name: 'Star snapper', tier: 'common', medianCm: 22 },
  { id: 'crab', name: 'Crab', tier: 'uncommon', medianCm: 18 },
  { id: 'puffer', name: 'Pufferfish', tier: 'rare', medianCm: 26 },
  { id: 'blobfish', name: 'Sir Blobfish', tier: 'legendary', medianCm: 35 },
] as const

export type PondFishId = (typeof POND_SPECIES)[number]['id']
export type PondTier = (typeof POND_SPECIES)[number]['tier']

export const POND_VARIANTS = ['normal', 'shiny', 'golden', 'moonlit', 'prismatic'] as const
export type PondVariant = (typeof POND_VARIANTS)[number]

export const POND_BAIT = [
  {
    id: 'shrimp',
    name: 'Shrimp',
    emoji: '🦐',
    favours: 'Crabs love shrimp',
    pack: 5,
    price: 20,
  },
  {
    id: 'berry',
    name: 'Berry',
    emoji: '🫐',
    favours: 'Puffers love berries',
    pack: 5,
    price: 20,
  },
  {
    id: 'cupcake',
    name: 'Cupcake',
    emoji: '🧁',
    favours: 'Blobfish love cupcakes',
    pack: 3,
    price: 40,
  },
] as const

export type PondShopBaitId = (typeof POND_BAIT)[number]['id']
export type PondBaitId = PondShopBaitId | 'worm'

export const ODDS_BAIT: readonly { id: PondBaitId; name: string }[] = [
  { id: 'worm', name: 'Worm' },
  ...POND_BAIT.map(({ id, name }) => ({ id, name })),
]

export const VARIANT_ODDS = [
  { id: 'shiny', label: 'Shiny', odds: 40, fullMoonOdds: 40, multiplier: 2 },
  { id: 'golden', label: 'Golden', odds: 200, fullMoonOdds: 200, multiplier: 5 },
  { id: 'moonlit', label: 'Moonlit', odds: 600, fullMoonOdds: 150, multiplier: 10 },
  { id: 'prismatic', label: 'Prismatic', odds: 2500, fullMoonOdds: 2500, multiplier: 25 },
] as const

export const TIERS: readonly PondTier[] = ['common', 'uncommon', 'rare', 'legendary']

export const EXCHANGE_PEARLS_PER_STAMP = 10
export const EXCHANGE_DAILY_STAMPS = 20
export const POND_WAGER_DAILY_CAP = 200
export const POND_PITY_SOFT = 60
export const POND_PITY_CERTAIN = 120

export function speciesFor(id: string | null | undefined): (typeof POND_SPECIES)[number] | null {
  return POND_SPECIES.find((species) => species.id === id) ?? null
}

export function speciesName(id: string | null | undefined): string {
  return speciesFor(id)?.name ?? (id ? id.replace(/-/g, ' ') : 'A mystery fish')
}

export function speciesTier(id: string | null | undefined): PondTier | null {
  return speciesFor(id)?.tier ?? null
}

export function variantLabel(variant: string | null | undefined): string {
  if (!variant || variant === 'normal') return 'Normal'
  return variant.charAt(0).toUpperCase() + variant.slice(1)
}

/** "Golden Crab", or just "Crab" for a normal one. */
export function catchLabel(species: string | null | undefined, variant: string | null | undefined): string {
  const name = speciesName(species)
  return variant && variant !== 'normal' ? `${variantLabel(variant)} ${name}` : name
}

const FISH_ART = ['star-snapper', 'crab', 'puffer', 'blobfish'] as const

/** The catch's drawing from the asset manifest; species without their own art show the snapper. */
export function fishArt(species: string | null | undefined): string {
  const art = FISH_ART.find((id) => id === species) ?? 'star-snapper'
  return assetUrl(`pond/fish-${art}`)
}

export function formatInteger(value: number): string {
  return new Intl.NumberFormat('en-US').format(Math.round(value))
}

export function formatSizeCm(value: number | null | undefined): string {
  if (typeof value !== 'number' || !Number.isFinite(value)) return '—'
  return `${value.toFixed(1)} cm`
}

export function formatShortSizeCm(value: number | null | undefined): string {
  if (typeof value !== 'number' || !Number.isFinite(value)) return '—'
  return `${value.toFixed(1)}cm`
}

/** Board odds arrive as a probability, so turn 0.00008 into "1 in 12,500". */
export function formatOdds(probability: number): string {
  if (!Number.isFinite(probability) || probability <= 0) return '1 in —'
  const oneIn = Math.max(1, Math.round(1 / probability))
  return `1 in ${formatInteger(oneIn)}`
}

export function formatPercent(probability: number): string {
  if (!Number.isFinite(probability) || probability < 0) return '—'
  const percent = probability * 100
  if (percent >= 1) return `${percent.toFixed(1)}%`
  return `${percent.toFixed(2)}%`
}

const MINUTE = 60_000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

export function formatCountdown(ms: number, options: { seconds?: boolean } = {}): string {
  const remaining = Math.max(0, ms)
  const days = Math.floor(remaining / DAY)
  const hours = Math.floor((remaining % DAY) / HOUR)
  const minutes = Math.floor((remaining % HOUR) / MINUTE)
  const seconds = Math.floor((remaining % MINUTE) / 1000)
  const parts: string[] = []
  if (days > 0) parts.push(`${days}d`)
  if (hours > 0 || days > 0) parts.push(`${hours}h`)
  parts.push(`${minutes}m`)
  if (options.seconds && days === 0 && hours === 0) parts.push(`${seconds}s`)
  return parts.join(' ')
}

/** Next Monday 00:00 UTC (the weekly board reset). */
export function nextMondayUtc(now = new Date()): Date {
  const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
  const day = date.getUTCDay()
  const untilMonday = (8 - day) % 7 || 7
  date.setUTCDate(date.getUTCDate() + untilMonday)
  return date
}

/** Next UTC midnight (the daily boards and bounties reset). */
export function nextUtcMidnight(now = new Date()): Date {
  const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1))
  return date
}

export function utcDayLabel(now = new Date()): string {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  }).format(now)
}
