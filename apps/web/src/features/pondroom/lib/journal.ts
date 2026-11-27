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

// The crown, chest and most deep-sea art are not drawn yet; their PNGs are grey stand-ins with the same ids.
export const JOURNAL_FAMILIES: readonly JournalFamily[] = [
  {
    species: 'star-snapper',
    label: 'Fish',
    rarity: 'common',
    catches: [
      c('star-snapper', 'Snapper Fish'),
      c('puffer', 'Pufferfish'),
      c('party-clownfish', 'Clown Fish'),
      c('starry-goldfish', 'Starry Night Fish'),
      c('salmon-nigiri', 'Sashimi Bao'),
    ],
  },
  {
    species: 'crab',
    label: 'Shellfish',
    rarity: 'uncommon',
    catches: [
      c('painter-shrimp', 'Shrimp Artist'),
      c('hermit-crab', 'Hermit Palette'),
      c('crab', 'Starry Crab'),
      c('venus-cat', 'The Birth of Venus'),
      c('tempura-shrimp', 'Tempura Bao'),
    ],
  },
  {
    species: 'puffer',
    label: 'Sunken treasures',
    rarity: 'rare',
    catches: [
      c('mp3-player', 'Ipod'),
      c('camera', 'Digi-Cam'),
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

/** The Basic and Fine sunken treasures are gadgets a member keeps and uses from the gadget button. */
export const KEEPSAKES = [
  { id: 'mp3-player', name: 'Ipod', action: 'Listen' },
  { id: 'camera', name: 'Digi-Cam', action: 'Take photos' },
] as const

export type KeepsakeId = (typeof KEEPSAKES)[number]['id']

export function ownedKeepsakes(items: readonly string[]): KeepsakeId[] {
  return KEEPSAKES.filter((item) => items.includes(`keepsake:${item.id}`)).map((item) => item.id)
}
