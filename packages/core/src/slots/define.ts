export interface SlotDef<T> {
  name: string
  version: number
  empty(): T
  parse(raw: unknown): T | null
  migrations: Record<number, (old: unknown) => unknown>
  merge(a: T, b: T): T
  maxBytes: number
  sync: boolean
  samples: T[]
}

export function defineSlot<T>(def: SlotDef<T>): SlotDef<T> {
  return def
}

export function docBytes(doc: unknown): number {
  return new TextEncoder().encode(JSON.stringify(doc)).length
}
