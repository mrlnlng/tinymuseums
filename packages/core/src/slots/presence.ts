import { validSeed } from '../presence/names.ts'
import { defineSlot } from './define.ts'
import { latest, record, type Latest } from './merge.ts'

export interface PresencePrefs {
  /** The device's generated name. Set once; the lower seed wins, so two tabs settle on one. */
  seed: number | null
  walkAlone: Latest<boolean>
}

const firstSeed = (a: number | null, b: number | null): number | null =>
  a === null ? b : b === null ? a : Math.min(a, b)

function parsePresence(raw: unknown): PresencePrefs | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null
  const doc = raw as Record<string, unknown>
  if (Object.keys(doc).length !== 2) return null
  if (doc.seed !== null && !validSeed(doc.seed)) return null
  const walkAlone = doc.walkAlone as Record<string, unknown> | null
  if (!walkAlone || typeof walkAlone !== 'object' || Object.keys(walkAlone).length !== 2) return null
  if (typeof walkAlone.v !== 'boolean' || !Number.isSafeInteger(walkAlone.at) || (walkAlone.at as number) < 0) return null
  return doc as unknown as PresencePrefs
}

/** Device-only: never registered in SLOTS, so it is never sent to the server. */
export const presence = defineSlot<PresencePrefs>({
  name: 'presence',
  version: 1,
  maxBytes: 128,
  sync: false,
  empty: () => ({ seed: null, walkAlone: { v: false, at: 0 } }),
  parse: parsePresence,
  migrations: {},
  merge: record<PresencePrefs>({ seed: firstSeed, walkAlone: latest }),
  samples: [
    { seed: null, walkAlone: { v: false, at: 0 } },
    { seed: 0, walkAlone: { v: true, at: 5 } },
    { seed: 2 ** 31 - 1, walkAlone: { v: false, at: 5 } },
    { seed: 4096, walkAlone: { v: true, at: 9 } },
  ],
})
