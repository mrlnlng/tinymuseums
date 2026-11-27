export type ItemSlot = 'bow' | 'costume' | 'character'
import { CLOSET_MESSES, cleanItemId, cleanupFor } from '../rooms/work.ts'

export type CatalogKind = 'piece' | 'character' | 'prop' | 'finish' | 'room' | 'clean' | 'keepsake'

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
  'costume:tutu': { price: 120, kind: 'piece', collection: 'dress' },

  'character:otter': { price: 250, kind: 'character', collection: 'character' },
  'character:bruce': { price: 250, kind: 'character', collection: 'character' },

  'prop:mirror': { price: 45, kind: 'prop', collection: 'wall' },
  'prop:painting': { price: 55, kind: 'prop', collection: 'wall' },
  'prop:portrait-bunny': { price: 40, kind: 'prop', collection: 'wall' },
  'prop:portrait-jiji': { price: 40, kind: 'prop', collection: 'wall' },
  'prop:portrait-otter': { price: 40, kind: 'prop', collection: 'wall' },
  'prop:portrait-wink': { price: 40, kind: 'prop', collection: 'wall' },
  'prop:shelf': { price: 0, kind: 'prop', collection: 'wall', starter: true },
  'prop:window': { price: 0, kind: 'prop', collection: 'wall', starter: true },
  'prop:wall-hooks': { price: 0, kind: 'prop', collection: 'wall', starter: true },
  'prop:wall-shelf': { price: 0, kind: 'prop', collection: 'wall', starter: true },
  'prop:gold-frame': { price: 50, kind: 'prop', collection: 'wall' },
  'prop:pressed-fern': { price: 40, kind: 'prop', collection: 'wall' },
  'prop:midnight-study': { price: 50, kind: 'prop', collection: 'wall' },
  'prop:hanger': { price: 25, kind: 'prop', collection: 'wall' },
  'prop:bare-bulb': { price: 0, kind: 'prop', collection: 'wall', starter: true },
  'prop:attic-window': { price: 0, kind: 'prop', collection: 'wall', starter: true },

  'prop:cabinet': { price: 110, kind: 'prop', collection: 'furniture' },
  'prop:carpet': { price: 0, kind: 'prop', collection: 'furniture', starter: true },
  'prop:pillow-blue': { price: 35, kind: 'prop', collection: 'furniture' },
  'prop:pillow-red': { price: 0, kind: 'prop', collection: 'furniture', starter: true },
  'prop:column': { price: 75, kind: 'prop', collection: 'furniture' },
  'prop:jewelry-box': { price: 40, kind: 'prop', collection: 'furniture' },
  'prop:perfume': { price: 30, kind: 'prop', collection: 'furniture' },
  'prop:broom': { price: 35, kind: 'prop', collection: 'furniture' },
  'prop:cat': { price: 80, kind: 'prop', collection: 'furniture' },
  'prop:cubby': { price: 0, kind: 'prop', collection: 'furniture', starter: true },
  'prop:round-table': { price: 0, kind: 'prop', collection: 'furniture', starter: true },
  'prop:side-table': { price: 70, kind: 'prop', collection: 'furniture' },
  'prop:chair': { price: 60, kind: 'prop', collection: 'furniture' },
  'prop:armchair': { price: 120, kind: 'prop', collection: 'furniture' },
  'prop:rug': { price: 70, kind: 'prop', collection: 'furniture' },
  'prop:patchwork-mat': { price: 20, kind: 'prop', collection: 'furniture' },
  'prop:gallery-runner': { price: 40, kind: 'prop', collection: 'furniture' },
  'prop:moonwake-rug': { price: 50, kind: 'prop', collection: 'furniture' },
  'prop:lily-stitch-rug': { price: 30, kind: 'prop', collection: 'furniture' },
  'prop:studio-stripe-carpet': { price: 45, kind: 'prop', collection: 'furniture' },
  'prop:faded-floral-carpet': { price: 55, kind: 'prop', collection: 'furniture' },

  'prop:plant': { price: 55, kind: 'prop', collection: 'decor' },
  'prop:mug': { price: 20, kind: 'prop', collection: 'decor' },
  'prop:tulip-vase': { price: 0, kind: 'prop', collection: 'decor', starter: true },
  'prop:reading-lamp': { price: 35, kind: 'prop', collection: 'decor' },
  'prop:sketchbooks': { price: 25, kind: 'prop', collection: 'decor' },
  'prop:ammonite-display': { price: 45, kind: 'prop', collection: 'decor' },
  'prop:opening-night-invite': { price: 15, kind: 'prop', collection: 'decor' },
  'prop:paint-stained-palette': { price: 25, kind: 'prop', collection: 'decor' },
  'prop:storeroom-letter': { price: 15, kind: 'prop', collection: 'decor' },

  'prop:fish-minnow': { price: 0, kind: 'prop', collection: 'fish', earnedBy: 'pond' },
  'prop:fish-perch': { price: 0, kind: 'prop', collection: 'fish', earnedBy: 'pond' },
  'prop:fish-carp': { price: 0, kind: 'prop', collection: 'fish', earnedBy: 'pond' },
  'prop:fish-koi': { price: 0, kind: 'prop', collection: 'fish', earnedBy: 'pond' },
  'prop:fish-golden-koi': { price: 0, kind: 'prop', collection: 'fish', earnedBy: 'pond' },
  'prop:fish-star-snapper': { price: 0, kind: 'prop', collection: 'fish', earnedBy: 'pond' },
  'prop:fish-crab': { price: 0, kind: 'prop', collection: 'fish', earnedBy: 'pond' },
  'prop:fish-puffer': { price: 0, kind: 'prop', collection: 'fish', earnedBy: 'pond' },
  'prop:fish-blobfish': { price: 0, kind: 'prop', collection: 'fish', earnedBy: 'pond' },

  'keepsake:mp3-player': { price: 0, kind: 'keepsake', collection: 'keepsake', earnedBy: 'pond' },
  'keepsake:camera': { price: 0, kind: 'keepsake', collection: 'keepsake', earnedBy: 'pond' },

  'finish:wallpaper-cream': { price: 0, kind: 'finish', collection: 'wallpaper', starter: true },
  'finish:wallpaper-plaster': { price: 0, kind: 'finish', collection: 'wallpaper', starter: true },
  'finish:wallpaper-peach-stripes': { price: 0, kind: 'finish', collection: 'wallpaper', starter: true },
  'finish:wallpaper-pink-stripes': { price: 90, kind: 'finish', collection: 'wallpaper' },
  'finish:wallpaper-blue-floral': { price: 120, kind: 'finish', collection: 'wallpaper' },
  'finish:wallpaper-ornate': { price: 120, kind: 'finish', collection: 'wallpaper' },
  'finish:baseboard-tall': { price: 0, kind: 'finish', collection: 'baseboard', starter: true },
  'finish:baseboard-short': { price: 0, kind: 'finish', collection: 'baseboard', starter: true },

  // Knocking the closet through to a bigger room, one step at a time (see rooms/sizes.ts).
  'room:closet': { price: 0, kind: 'room', collection: 'room' },
  'room:storeroom': { price: 120, kind: 'room', collection: 'room' },
  'room:backroom': { price: 250, kind: 'room', collection: 'room' },
  'room:studio': { price: 450, kind: 'room', collection: 'room' },

  // Clearing each piece of the closet's junk (see rooms/work.ts).
  ...Object.fromEntries(
    CLOSET_MESSES.map((mess) => [cleanItemId(mess.id), { price: cleanupFor(mess.ref).price, kind: 'clean', collection: 'clean' } as const]),
  ),
}

export const STARTER_PROPS = [
  'prop:carpet',
  'prop:pillow-red',
  'prop:shelf',
  'prop:window',
  'prop:wall-hooks',
  'prop:wall-shelf',
  'prop:cubby',
  'prop:round-table',
  'prop:tulip-vase',
  'prop:bare-bulb',
  'prop:attic-window',
  'finish:wallpaper-cream',
  'finish:wallpaper-plaster',
  'finish:wallpaper-peach-stripes',
  'finish:baseboard-tall',
  'finish:baseboard-short',
] as const

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
