import { defineSlot } from './define.ts'
import { latest, record, type Latest } from './merge.ts'

export const CHARACTERS = ['bunny', 'cat'] as const
export type CharacterChoice = (typeof CHARACTERS)[number]

export interface Outfit {
  character: Latest<CharacterChoice>
  costume: Latest<string | null>
}

const COSTUME_ID = /^[a-z][a-z0-9-]{0,31}$/

function isStamp(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0
}

function isLatest(value: unknown, valid: (v: unknown) => boolean): boolean {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  const register = value as Record<string, unknown>
  return Object.keys(register).length === 2 && isStamp(register.at) && valid(register.v)
}

function parseOutfit(raw: unknown): Outfit | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null
  const doc = raw as Record<string, unknown>
  if (Object.keys(doc).length !== 2) return null
  const character = isLatest(doc.character, (v) => (CHARACTERS as readonly unknown[]).includes(v))
  // Costume ids stay open so a new costume needs no version bump; unknown ones are worn as none.
  const costume = isLatest(doc.costume, (v) => v === null || (typeof v === 'string' && COSTUME_ID.test(v)))
  return character && costume ? (doc as unknown as Outfit) : null
}

export const outfit = defineSlot<Outfit>({
  name: 'outfit',
  version: 1,
  maxBytes: 256,
  sync: true,
  empty: () => ({ character: { v: 'bunny', at: 0 }, costume: { v: null, at: 0 } }),
  parse: parseOutfit,
  migrations: {},
  merge: record<Outfit>({ character: latest, costume: latest }),
  samples: [
    { character: { v: 'bunny', at: 0 }, costume: { v: null, at: 0 } },
    { character: { v: 'cat', at: 5 }, costume: { v: 'kiki', at: 7 } },
    { character: { v: 'bunny', at: 5 }, costume: { v: null, at: 7 } },
    { character: { v: 'cat', at: 9 }, costume: { v: 'some-future-costume', at: 3 } },
  ],
})
