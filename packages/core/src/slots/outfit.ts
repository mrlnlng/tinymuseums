import { defineSlot } from './define.ts'
import { latest, record, type Latest } from './merge.ts'

export const CHARACTERS = ['bunny', 'cat', 'otter'] as const
export type CharacterChoice = (typeof CHARACTERS)[number]

export interface Outfit {
  character: Latest<CharacterChoice>
  costume: Latest<string | null>
  bow: Latest<string | null>
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
  if (Object.keys(doc).length !== 3) return null
  const character = isLatest(doc.character, (v) => (CHARACTERS as readonly unknown[]).includes(v))
  // Costume ids stay open so a new costume needs no version bump; unknown ones are worn as none.
  const costume = isLatest(doc.costume, (v) => v === null || (typeof v === 'string' && COSTUME_ID.test(v)))
  const bow = isLatest(doc.bow, (v) => v === null || (typeof v === 'string' && COSTUME_ID.test(v)))
  return character && costume && bow ? (doc as unknown as Outfit) : null
}

export const outfit = defineSlot<Outfit>({
  name: 'outfit',
  version: 2,
  maxBytes: 384,
  sync: true,
  empty: () => ({ character: { v: 'bunny', at: 0 }, costume: { v: null, at: 0 }, bow: { v: null, at: 0 } }),
  parse: parseOutfit,
  migrations: {
    1: (raw) => {
      if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null
      const old = raw as Record<string, unknown>
      if (Object.keys(old).length !== 2) return null
      const costume = old.costume as Latest<string | null> | undefined
      return { ...old, bow: { v: costume?.v === 'kiki' ? 'kiki' : null, at: costume?.at ?? 0 } }
    },
  },
  merge: record<Outfit>({ character: latest, costume: latest, bow: latest }),
  samples: [
    { character: { v: 'bunny', at: 0 }, costume: { v: null, at: 0 }, bow: { v: null, at: 0 } },
    { character: { v: 'cat', at: 5 }, costume: { v: 'kiki', at: 7 }, bow: { v: 'kiki', at: 8 } },
    { character: { v: 'bunny', at: 5 }, costume: { v: null, at: 7 }, bow: { v: 'kiki', at: 9 } },
    { character: { v: 'cat', at: 9 }, costume: { v: 'some-future-costume', at: 3 }, bow: { v: null, at: 4 } },
    { character: { v: 'otter', at: 4 }, costume: { v: 'cardigan-navy-blue', at: 6 }, bow: { v: null, at: 0 } },
  ],
})
