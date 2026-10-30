export interface StorageLike {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
  keys(): string[]
}

export const MEMBER_KEY = 'tm_member'
export const ANON_PREFIX = 'tm_slot:anon:'
const MEMBER_NS = 'tm_slot:m:'

export function memberPrefix(memberId: string): string {
  return `${MEMBER_NS}${memberId}:`
}

export function anonKey(name: string): string {
  return `${ANON_PREFIX}${name}`
}

export function memberKey(memberId: string, name: string): string {
  return `${memberPrefix(memberId)}${name}`
}

export function deviceKey(name: string): string {
  return `tm_slot:${name}`
}

export function isMemberSlotKey(key: string): boolean {
  return key.startsWith(MEMBER_NS)
}

export function readStored(storage: StorageLike, key: string): string | null {
  try {
    return storage.getItem(key)
  } catch {
    return null
  }
}

// null = the read threw, so the result must not be mistaken for "absent"
export function tryReadStored(storage: StorageLike, key: string): { value: string | null } | null {
  try {
    return { value: storage.getItem(key) }
  } catch {
    return null
  }
}

export function writeStored(storage: StorageLike, key: string, value: string): boolean {
  try {
    storage.setItem(key, value)
    return true
  } catch {
    return false
  }
}

export function removeStored(storage: StorageLike, key: string): boolean {
  try {
    storage.removeItem(key)
    return true
  } catch {
    return false
  }
}

export function listKeys(storage: StorageLike): string[] {
  try {
    return storage.keys()
  } catch {
    return []
  }
}

export interface StoredSlot {
  version: number
  doc: unknown
  dirty: boolean
}

export function parseStored(raw: string | null): StoredSlot | null {
  if (raw === null) return null
  try {
    const value: unknown = JSON.parse(raw)
    if (value === null || typeof value !== 'object' || Array.isArray(value)) return null
    const record = value as Record<string, unknown>
    if (typeof record.version !== 'number' || !Number.isInteger(record.version) || record.version < 1) return null
    if (record.doc === null || typeof record.doc !== 'object' || Array.isArray(record.doc)) return null
    return { version: record.version, doc: record.doc, dirty: record.dirty === true }
  } catch {
    return null
  }
}

export function encodeStored(version: number, doc: unknown, dirty: boolean): string {
  return JSON.stringify({ version, doc, dirty })
}
