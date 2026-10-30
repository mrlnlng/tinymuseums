import { defineSlot } from './define.ts'
import { mapOf, maxNumber, record, topTombSet, type TombSet } from './merge.ts'

const SCORE_KEYS = ['hall', 'cafe', 'garden', 'shop'] as const
const MAX_SCORE = 999
const MAX_ITEMS = 3
const ITEM_KEY = /^[a-z]{1,12}$/

export interface TestFixture {
  best: number
  scores: Record<string, number>
  items: TombSet
}

function isTombSet(value: unknown, cap: number): value is TombSet {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  const entries = Object.entries(value)
  if (entries.length > cap) return false
  for (const [key, entry] of entries) {
    if (!ITEM_KEY.test(key)) return false
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) return false
    const tomb = entry as Record<string, unknown>
    if (typeof tomb.at !== 'number' || !Number.isSafeInteger(tomb.at) || tomb.at <= 0) return false
    if (tomb.removed !== undefined && tomb.removed !== true) return false
  }
  return true
}

function isTestFixture(raw: unknown): raw is TestFixture {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return false
  const doc = raw as Record<string, unknown>
  if (typeof doc.best !== 'number' || !Number.isFinite(doc.best) || doc.best < 0 || doc.best > MAX_SCORE) return false
  if (!doc.scores || typeof doc.scores !== 'object' || Array.isArray(doc.scores)) return false
  const scores = doc.scores as Record<string, unknown>
  for (const key of Object.keys(scores)) {
    if (!(SCORE_KEYS as readonly string[]).includes(key)) return false
    const score = scores[key]
    if (typeof score !== 'number' || !Number.isFinite(score) || score < 0 || score > MAX_SCORE) return false
  }
  return isTombSet(doc.items, MAX_ITEMS)
}

function parseTestFixture(raw: unknown): TestFixture | null {
  return isTestFixture(raw) ? raw : null
}

export const testFixture = defineSlot<TestFixture>({
  name: 'test-fixture',
  version: 2,
  maxBytes: 2048,
  sync: true,
  empty: () => ({ best: 0, scores: {}, items: {} }),
  parse: parseTestFixture,
  migrations: {
    1: (old) => {
      const v1 = old as { best: unknown; scores: unknown }
      return { best: v1.best, scores: v1.scores, items: {} }
    },
  },
  merge: record<TestFixture>({
    best: maxNumber,
    scores: mapOf(maxNumber),
    items: topTombSet(MAX_ITEMS),
  }),
  samples: [
    { best: 0, scores: {}, items: {} },
    { best: 12, scores: { hall: 3, cafe: 9 }, items: { helm: { at: 100 } } },
    { best: 40, scores: { cafe: 10, garden: 2 }, items: { helm: { at: 150, removed: true }, coin: { at: 160 } } },
    {
      best: MAX_SCORE,
      scores: { hall: MAX_SCORE, cafe: MAX_SCORE, garden: MAX_SCORE, shop: MAX_SCORE },
      items: { aa: { at: 900 }, bb: { at: 901 }, cc: { at: 902, removed: true } },
    },
    {
      best: 7,
      scores: { hall: 1, cafe: MAX_SCORE, garden: 2, shop: 3 },
      items: { cc: { at: 903 }, dd: { at: 904 }, ee: { at: 905 } },
    },
  ],
})
