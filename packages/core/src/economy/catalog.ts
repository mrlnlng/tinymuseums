export type ItemSlot = 'bow' | 'costume' | 'character'
export type CatalogKind = 'piece' | 'character'

export interface CatalogItem {
  price: number
  kind: CatalogKind
  collection: string
}

export const ITEMS: Record<string, CatalogItem> = {
  'bow:kiki': { price: 60, kind: 'piece', collection: 'bow' },
  'bow:flower-crown': { price: 60, kind: 'piece', collection: 'bow' },
  'bow:hibiscus-blue': { price: 60, kind: 'piece', collection: 'bow' },
  'bow:hibiscus-yellow': { price: 60, kind: 'piece', collection: 'bow' },
  'bow:hibiscus-pink': { price: 60, kind: 'piece', collection: 'bow' },
  'bow:blue-cap': { price: 60, kind: 'piece', collection: 'bow' },
  'bow:daisy-clip': { price: 60, kind: 'piece', collection: 'bow' },

  'costume:cardigan-red': { price: 80, kind: 'piece', collection: 'cardigan' },
  'costume:cardigan-forest-green': { price: 80, kind: 'piece', collection: 'cardigan' },
  'costume:cardigan-navy-blue': { price: 80, kind: 'piece', collection: 'cardigan' },
  'costume:cardigan-butter-yellow': { price: 80, kind: 'piece', collection: 'cardigan' },

  'costume:kiki': { price: 120, kind: 'piece', collection: 'dress' },
  'costume:blue-floral': { price: 120, kind: 'piece', collection: 'dress' },
  'costume:floral-cardigan': { price: 120, kind: 'piece', collection: 'dress' },
  'costume:gold-sequin': { price: 120, kind: 'piece', collection: 'dress' },
  'costume:gold-cape': { price: 180, kind: 'piece', collection: 'set' },

  'character:otter': { price: 250, kind: 'character', collection: 'character' },
}

export const FREE_CHARACTERS = ['bunny', 'cat'] as const

export function itemIdFor(slot: ItemSlot, id: string): string {
  return `${slot}:${id}`
}

export function isCatalogItem(itemId: string): boolean {
  return Object.hasOwn(ITEMS, itemId)
}

export function priceOf(itemId: string): number | null {
  return isCatalogItem(itemId) ? ITEMS[itemId].price : null
}
