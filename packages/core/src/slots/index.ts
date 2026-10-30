import { defineSlot, docBytes, type SlotDef } from './define.ts'
import { outfit } from './outfit.ts'

export { defineSlot, docBytes, type SlotDef }
export * from './merge.ts'
export { CHARACTERS, outfit, type CharacterChoice, type Outfit } from './outfit.ts'

export const SLOTS: Record<string, SlotDef<unknown>> = {
  [outfit.name]: outfit as SlotDef<unknown>,
}

export function slotDef(
  name: string,
  registry: Record<string, SlotDef<unknown>> = SLOTS,
): SlotDef<unknown> | null {
  return Object.hasOwn(registry, name) ? registry[name] : null
}

export function upgrade(def: SlotDef<unknown>, version: number, raw: unknown): unknown | null {
  if (version > def.version) return null
  let doc = raw
  try {
    for (let v = version; v < def.version; v++) {
      const migrate = def.migrations[v]
      if (!migrate) return null
      doc = migrate(doc)
    }
  } catch {
    return null
  }
  return def.parse(doc)
}
