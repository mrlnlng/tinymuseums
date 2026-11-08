import { TIER_LABEL, streakMultiplier, type FishTier } from './tables.ts'

/**
 * Pure formatting and limits for the pond's risk layer: the hot-streak chip,
 * the live-bait chip and the call-your-shot picker. No React, no DOM.
 */

export const WAGER_MIN = 5
export const WAGER_MAX = 100
export const WAGER_STEP = 5
export const WAGER_DAILY_CAP = 200

export interface WagerLimits {
  /** The daily allowance still unspent. */
  leftToday: number
  /** The largest stake the stepper may reach (0 when nothing is affordable). */
  maxStake: number
}

export function wagerLimits(pearls: number, wageredToday: number): WagerLimits {
  const spent = Number.isFinite(wageredToday) ? Math.max(0, Math.floor(wageredToday)) : 0
  const leftToday = Math.max(0, WAGER_DAILY_CAP - spent)
  const purse = Number.isFinite(pearls) ? Math.max(0, Math.floor(pearls)) : 0
  const affordable = Math.min(purse, WAGER_MAX, leftToday)
  const maxStake = affordable < WAGER_MIN ? 0 : Math.floor(affordable / WAGER_STEP) * WAGER_STEP
  return { leftToday, maxStake }
}

/** Snap a stake to the 5-pearl grid and keep it inside the purse and daily cap. */
export function clampWagerStake(stake: number, pearls: number, wageredToday: number): number {
  const { maxStake } = wagerLimits(pearls, wageredToday)
  if (maxStake < WAGER_MIN) return 0
  const stepped = Math.round((Number.isFinite(stake) ? stake : WAGER_MIN) / WAGER_STEP) * WAGER_STEP
  return Math.max(WAGER_MIN, Math.min(maxStake, stepped))
}

/** One tap of the minus/plus buttons. Direction is clamped to -1 or +1. */
export function stepWagerStake(
  stake: number,
  direction: number,
  pearls: number,
  wageredToday: number,
): number {
  const { maxStake } = wagerLimits(pearls, wageredToday)
  if (maxStake < WAGER_MIN) return 0
  const current = clampWagerStake(stake, pearls, wageredToday)
  const next = current + (direction < 0 ? -WAGER_STEP : WAGER_STEP)
  return Math.max(WAGER_MIN, Math.min(maxStake, next))
}

export function formatPayout(multiplier: number): string {
  if (!Number.isFinite(multiplier) || multiplier <= 0) return '—'
  return `×${multiplier.toFixed(1)}`
}

export function formatWagerPercent(probability: number): string {
  if (!Number.isFinite(probability) || probability <= 0) return '—'
  const percent = probability * 100
  return `${percent.toFixed(percent >= 0.1 ? 1 : 2)}%`
}

export interface WagerOdds {
  tiers: Record<FishTier, number>
  payouts: Record<FishTier, number>
}

export interface WagerRow {
  tier: FishTier
  label: string
  probability: number
  payout: number
}

export const WAGER_TIERS: readonly FishTier[] = ['common', 'uncommon', 'rare', 'legendary']

export function wagerRows(odds: WagerOdds | null | undefined): WagerRow[] {
  if (!odds) return []
  return WAGER_TIERS.map((tier) => ({
    tier,
    label: TIER_LABEL[tier],
    probability: odds.tiers[tier] ?? 0,
    payout: odds.payouts[tier] ?? 0,
  }))
}

export function wagerChipLabel(tier: FishTier, payout: number, stake: number): string {
  return `🎯 ${TIER_LABEL[tier]} ${formatPayout(payout)} · ${stake} pearls`
}

export function formatMultiplier(multiplier: number): string {
  return Number.isInteger(multiplier) ? String(multiplier) : String(Math.round(multiplier * 100) / 100)
}

export interface StreakChip {
  tier: 1 | 2 | 3 | 4
  multiplier: number
  next: number | null
  hint: string
}

/** Chip copy and tier for the hot streak. Streaks below 2 don't show a chip. */
export function streakChip(streak: number): StreakChip | null {
  if (!Number.isFinite(streak) || streak < 2) return null
  const multiplier = streakMultiplier(streak)
  if (streak >= 5) {
    return { tier: 4, multiplier, next: null, hint: 'Max streak' }
  }
  const tier = Math.max(1, Math.min(3, Math.floor(streak) - 1)) as 1 | 2 | 3
  const next = streakMultiplier(Math.floor(streak) + 1)
  return { tier, multiplier, next, hint: `1 more → ×${formatMultiplier(next)}` }
}

export function chainChipLabel(level: number, pot: number): string {
  return `🪝 Chain ${level} · pot ${pot}`
}

export interface ChainOffer {
  nextLevel: number
  rareOdds: string
  payout: string
  pot: number
  line: string
}

/** The honest line under "Use as live bait". */
export function chainOffer(level: number, pot: number, catchPearls: number): ChainOffer {
  const nextLevel = Math.min(2, Math.max(1, level + 1))
  const rareOdds = nextLevel >= 2 ? '×3' : '×2'
  const payout = nextLevel >= 2 ? '×2' : '×1.5'
  const totalPot = Math.max(0, pot) + Math.max(0, catchPearls)
  const pearlLabel = totalPot === 1 ? '1 pearl' : `${totalPot} pearls`
  return {
    nextLevel,
    rareOdds,
    payout,
    pot: totalPot,
    line: `Live bait gives rare odds ${rareOdds} on your next cast. Your ${pearlLabel} ride along: land it for ${payout}, lose it and they swim off.`,
  }
}

/** The reveal's quiet "Missed the call" line. */
export function missWagerLabel(stake: number): string {
  return `Missed the call (−${stake})`
}
