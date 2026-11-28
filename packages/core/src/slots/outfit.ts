import { defineSlot } from './define.ts'
import { latest, record, type Latest } from './merge.ts'

export const CHARACTERS = ['bunny', 'cat', 'otter', 'bruce'] as const
export type CharacterChoice = (typeof CHARACTERS)[number]

export interface Outfit {
  character: Latest<CharacterChoice>
  /** The base layer: a dress or a set. */
  costume: Latest<string | null>
  bow: Latest<string | null>
  /** The outer layer worn over the dress, such as a cardigan. */
  top: Latest<string | null>
}

/** Pieces worn over the dress rather than in place of it. */
export function isTopPiece(id: string | null): boolean {
  return id !== null && id.startsWith('cardigan-')
}

/** Outerwear of its own: it takes a top off, and a top takes it off, instead of stacking. */
export const CLASHES_WITH_TOP: readonly string[] = ['gold-cape']

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
  if (Object.keys(doc).length !== 4) return null
  const character = isLatest(doc.character, (v) => (CHARACTERS as readonly unknown[]).includes(v))
  // Costume ids stay open so a new costume needs no version bump; unknown ones are worn as none.
  const costume = isLatest(doc.costume, (v) => v === null || (typeof v === 'string' && COSTUME_ID.test(v)))
  const bow = isLatest(doc.bow, (v) => v === null || (typeof v === 'string' && COSTUME_ID.test(v)))
  const top = isLatest(doc.top, (v) => v === null || (typeof v === 'string' && COSTUME_ID.test(v)))
  return character && costume && bow && top ? (doc as unknown as Outfit) : null
}

export const outfit = defineSlot<Outfit>({
  name: 'outfit',
  version: 3,
  maxBytes: 384,
  sync: true,
  empty: () => ({
    character: { v: 'bunny', at: 0 },
    costume: { v: null, at: 0 },
    bow: { v: null, at: 0 },
    top: { v: null, at: 0 },
  }),
  parse: parseOutfit,
  migrations: {
    1: (raw) => {
      if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null
      const old = raw as Record<string, unknown>
      if (Object.keys(old).length !== 2) return null
      const costume = old.costume as Latest<string | null> | undefined
      return { ...old, bow: { v: costume?.v === 'kiki' ? 'kiki' : null, at: costume?.at ?? 0 } }
    },
    // Clothes stack: a cardigan worn in the outfit's place moves to the top layer over the dress.
    2: (raw) => {
      if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null
      const old = raw as Record<string, unknown>
      if (Object.keys(old).length !== 3) return null
      const costume = old.costume as Latest<string | null> | undefined
      if (!costume || !isTopPiece(costume.v)) return { ...old, top: { v: null, at: 0 } }
      return { ...old, costume: { v: null, at: costume.at }, top: { v: costume.v, at: costume.at } }
    },
  },
  merge: record<Outfit>({ character: latest, costume: latest, bow: latest, top: latest }),
  samples: [
    { character: { v: 'bunny', at: 0 }, costume: { v: null, at: 0 }, bow: { v: null, at: 0 }, top: { v: null, at: 0 } },
    { character: { v: 'cat', at: 5 }, costume: { v: 'kiki', at: 7 }, bow: { v: 'kiki', at: 8 }, top: { v: null, at: 0 } },
    { character: { v: 'bunny', at: 5 }, costume: { v: null, at: 7 }, bow: { v: 'kiki', at: 9 }, top: { v: null, at: 0 } },
    { character: { v: 'cat', at: 9 }, costume: { v: 'some-future-costume', at: 3 }, bow: { v: null, at: 4 }, top: { v: null, at: 0 } },
    { character: { v: 'otter', at: 4 }, costume: { v: 'blue-floral', at: 6 }, bow: { v: null, at: 0 }, top: { v: 'cardigan-red', at: 7 } },
  ],
})
