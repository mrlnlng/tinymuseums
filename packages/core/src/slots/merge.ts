export const maxNumber = (a: number, b: number): number => Math.max(a, b)

export const record =
  <T>(fields: { [K in keyof T]: (a: T[K], b: T[K]) => T[K] }): ((a: T, b: T) => T) =>
  (a, b) => {
    const out = {} as T
    for (const key of Object.keys(fields)) {
      const field = key as keyof T
      out[field] = fields[field](a[field], b[field])
    }
    return out
  }

// defineProperty rather than assignment, so a "__proto__" key cannot reach the prototype
const put = <V>(target: Record<string, V>, key: string, value: V): void => {
  Object.defineProperty(target, key, { value, enumerable: true, writable: true, configurable: true })
}

export const mapOf =
  <V>(inner: (a: V, b: V) => V): ((a: Record<string, V>, b: Record<string, V>) => Record<string, V>) =>
  (a, b) => {
    const out: Record<string, V> = {}
    for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) {
      const hasA = Object.hasOwn(a, key)
      const value = hasA ? (Object.hasOwn(b, key) ? inner(a[key], b[key]) : a[key]) : b[key]
      put(out, key, value)
    }
    return out
  }

export type TombSet = Record<string, { at: number; removed?: true }>

type TombEntry = TombSet[string]

const winEntry = (va: TombEntry | undefined, vb: TombEntry | undefined): TombEntry | undefined => {
  if (!va) return vb
  if (!vb) return va
  if (va.at !== vb.at) return va.at > vb.at ? va : vb
  if (va.removed === vb.removed) return va
  return va.removed ? va : vb
}

const byAtThenKey = ([ka, ea]: [string, TombEntry], [kb, eb]: [string, TombEntry]): number =>
  ea.at !== eb.at ? eb.at - ea.at : kb < ka ? -1 : 1

export const topTombSet =
  (cap: number): ((a: TombSet, b: TombSet) => TombSet) =>
  (a, b) => {
    const union: TombSet = {}
    for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) {
      const entry = winEntry(
        Object.hasOwn(a, key) ? a[key] : undefined,
        Object.hasOwn(b, key) ? b[key] : undefined,
      )
      if (entry) put(union, key, entry)
    }
    const out: TombSet = {}
    const kept = Object.entries(union).sort(byAtThenKey).slice(0, Math.max(0, cap))
    for (const [key, entry] of kept) put(out, key, entry)
    return out
  }

export const stamp = (set: TombSet): number => {
  let highest = 0
  for (const entry of Object.values(set)) if (entry.at > highest) highest = entry.at
  return Math.max(Date.now(), highest + 1)
}

export type Latest<V> = { v: V; at: number }

const encoded = (value: unknown): string => JSON.stringify(value) ?? ''

// The later choice wins; equal stamps fall back to the encoded value, so every device agrees.
export const latest = <V>(a: Latest<V>, b: Latest<V>): Latest<V> => {
  if (a.at !== b.at) return a.at > b.at ? a : b
  return encoded(a.v) >= encoded(b.v) ? a : b
}

export const restamp = <V>(current: Latest<V>, v: V): Latest<V> => ({ v, at: Math.max(Date.now(), current.at + 1) })
