export type ItemSlot = 'bow' | 'costume' | 'character'
export type CatalogKind = 'piece' | 'character' | 'prop'

export interface CatalogItem {
  price: number
  kind: CatalogKind
  collection: string
  starter?: boolean
  earnedBy?: 'pond'
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

  'prop:mirror': { price: 45, kind: 'prop', collection: 'wall' },
  'prop:painting': { price: 55, kind: 'prop', collection: 'wall' },
  'prop:portrait-bunny': { price: 40, kind: 'prop', collection: 'wall' },
  'prop:portrait-jiji': { price: 40, kind: 'prop', collection: 'wall' },
  'prop:portrait-otter': { price: 40, kind: 'prop', collection: 'wall' },
  'prop:portrait-wink': { price: 40, kind: 'prop', collection: 'wall' },
  'prop:shelf': { price: 0, kind: 'prop', collection: 'wall', starter: true },

  'prop:cabinet': { price: 110, kind: 'prop', collection: 'furniture' },
  'prop:carpet': { price: 0, kind: 'prop', collection: 'furniture', starter: true },
  'prop:pillow-blue': { price: 35, kind: 'prop', collection: 'furniture' },
  'prop:pillow-red': { price: 0, kind: 'prop', collection: 'furniture', starter: true },
  'prop:column': { price: 75, kind: 'prop', collection: 'furniture' },
  'prop:jewelry-box': { price: 40, kind: 'prop', collection: 'furniture' },
  'prop:perfume': { price: 30, kind: 'prop', collection: 'furniture' },
  'prop:broom': { price: 35, kind: 'prop', collection: 'furniture' },
  'prop:cat': { price: 80, kind: 'prop', collection: 'furniture' },

  'prop:fish-minnow': { price: 0, kind: 'prop', collection: 'fish', earnedBy: 'pond' },
  'prop:fish-perch': { price: 0, kind: 'prop', collection: 'fish', earnedBy: 'pond' },
  'prop:fish-carp': { price: 0, kind: 'prop', collection: 'fish', earnedBy: 'pond' },
  'prop:fish-koi': { price: 0, kind: 'prop', collection: 'fish', earnedBy: 'pond' },
  'prop:fish-golden-koi': { price: 0, kind: 'prop', collection: 'fish', earnedBy: 'pond' },
}

export const STARTER_PROPS = ['prop:carpet', 'prop:pillow-red', 'prop:shelf'] as const

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

export function isBuyable(itemId: string): boolean {
  return isCatalogItem(itemId) && ITEMS[itemId].earnedBy === undefined
}
