import { staticUrl } from '@/shared/lib/static'

/**
 * The fish journal: four families (the server's species rows) by five grades (the server's coats).
 * A catch is one cell, so a saved "shiny puffer" is the Fine sunken treasure.
 */
export const JOURNAL_GRADES = [
  { variant: 'normal', label: 'Basic' },
  { variant: 'shiny', label: 'Fine' },
  { variant: 'golden', label: 'Premium' },
  { variant: 'moonlit', label: 'Master\u00ADpiece' },
  { variant: 'prismatic', label: 'Sashimi grade' },
] as const

export interface JournalCatch {
  id: string
  name: string
}

export interface JournalFamily {
  species: 'star-snapper' | 'crab' | 'puffer' | 'blobfish'
  label: string
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary'
  catches: readonly [JournalCatch, JournalCatch, JournalCatch, JournalCatch, JournalCatch]
}

const c = (id: string, name: string): JournalCatch => ({ id, name })

// Treasure and most deep-sea art is not drawn yet; their PNGs are grey stand-ins with the same ids.
export const JOURNAL_FAMILIES: readonly JournalFamily[] = [
  {
    species: 'star-snapper',
    label: 'Fish',
    rarity: 'common',
    catches: [
      c('star-snapper', 'Star snapper'),
      c('puffer', 'Pufferfish'),
      c('party-clownfish', 'Party clownfish'),
      c('starry-goldfish', 'Starry goldfish'),
      c('salmon-nigiri', 'Salmon nigiri bunny'),
    ],
  },
  {
    species: 'crab',
    label: 'Shellfish',
    rarity: 'uncommon',
    catches: [
      c('painter-shrimp', 'Painter shrimp'),
      c('hermit-crab', 'Hermit crab'),
      c('crab', 'Crab'),
      c('venus-cat', 'Venus in her shell'),
      c('tempura-shrimp', 'Tempura bunny'),
    ],
  },
  {
    species: 'puffer',
    label: 'Sunken treasures',
    rarity: 'rare',
    catches: [
      c('old-boot', 'Old boot'),
      c('pearl-string', 'String of pearls'),
      c('sunken-crown', 'Sunken crown'),
      c('treasure-chest', 'Treasure chest'),
      c('treasure-sashimi', 'Golden sashimi'),
    ],
  },
  {
    species: 'blobfish',
    label: 'Deep sea creatures',
    rarity: 'legendary',
    catches: [
      c('anglerfish', 'Anglerfish'),
      c('deep-fine', 'Lantern eel'),
      c('blobfish', 'Sir Blobfish'),
      c('deep-masterpiece', 'Abyssal muse'),
      c('deep-sashimi', 'Midnight sashimi'),
    ],
  },
]

export const JOURNAL_SIZE = JOURNAL_FAMILIES.length * JOURNAL_GRADES.length

export function journalFamily(species: string | null | undefined): JournalFamily {
  return JOURNAL_FAMILIES.find((family) => family.species === species) ?? JOURNAL_FAMILIES[0]
}

export function gradeLabel(variant: string | null | undefined): string {
  return JOURNAL_GRADES.find((grade) => grade.variant === variant)?.label ?? 'Basic'
}

export function journalCatch(species: string | null | undefined, variant: string | null | undefined): JournalCatch {
  const index = Math.max(0, JOURNAL_GRADES.findIndex((grade) => grade.variant === variant))
  return journalFamily(species).catches[index]
}

export function catchArt(item: { id: string }): string {
  return staticUrl(`/assets/pond/catch/${item.id}.png`)
}

/** Rare treasure finds the visitor keeps and can use, shown under the grid. */
export const KEEPSAKES = [
  { id: 'mp3-player', name: 'MP3 player', action: 'Play' },
  { id: 'camera', name: 'Tiny camera', action: 'Snap' },
] as const

export type KeepsakeId = (typeof KEEPSAKES)[number]['id']
