import { hasProfanity } from './profanity.ts'

// 64 × 64 names. Adjectives stay within 9 letters and nouns within 10, so every name fits
// the 20-character limit a chosen name has.
export const ADJECTIVES = [
  'Velvet', 'Gilded', 'Tiny', 'Sleepy', 'Dappled', 'Lacquered', 'Mossy', 'Rosy',
  'Quiet', 'Painted', 'Dusty', 'Golden', 'Silver', 'Amber', 'Ivory', 'Cobalt',
  'Crimson', 'Sage', 'Peachy', 'Minty', 'Lilac', 'Honey', 'Plum', 'Cozy',
  'Gentle', 'Curious', 'Dreamy', 'Wandering', 'Twinkly', 'Glossy', 'Speckled', 'Marbled',
  'Inky', 'Chalky', 'Dewy', 'Misty', 'Sunny', 'Breezy', 'Fuzzy', 'Fluffy',
  'Little', 'Merry', 'Jolly', 'Bashful', 'Humble', 'Patient', 'Clever', 'Brave',
  'Bright', 'Shy', 'Sparkly', 'Starry', 'Moonlit', 'Woven', 'Pressed', 'Tinted',
  'Pearly', 'Rustic', 'Snowy', 'Toasty', 'Sugared', 'Polished', 'Buttery', 'Petite',
] as const

export const NOUNS = [
  'Easel', 'Teacup', 'Pigment', 'Plinth', 'Gouache', 'Sketchbook', 'Frame', 'Palette',
  'Muse', 'Canvas', 'Crayon', 'Pastel', 'Charcoal', 'Inkwell', 'Quill', 'Chisel',
  'Mosaic', 'Fresco', 'Tapestry', 'Etching', 'Doodle', 'Portrait', 'Vase', 'Teapot',
  'Locket', 'Ribbon', 'Button', 'Thimble', 'Spool', 'Bonnet', 'Brooch', 'Cameo',
  'Pedestal', 'Lantern', 'Postcard', 'Marble', 'Atelier', 'Sketch', 'Swatch', 'Bauble',
  'Trinket', 'Teaspoon', 'Biscuit', 'Macaron', 'Croissant', 'Muffin', 'Bunny', 'Kitten',
  'Otter', 'Sparrow', 'Moth', 'Snail', 'Hedgehog', 'Duckling', 'Fawn', 'Mouse',
  'Owl', 'Robin', 'Magpie', 'Squirrel', 'Pinecone', 'Acorn', 'Clover', 'Daisy',
] as const

export const NAME_SEEDS = 2 ** 31

export function validSeed(seed: unknown): seed is number {
  return typeof seed === 'number' && Number.isInteger(seed) && seed >= 0 && seed < NAME_SEEDS
}

export function randomSeed(): number {
  return crypto.getRandomValues(new Uint32Array(1))[0] % NAME_SEEDS
}

export function nameFromSeed(seed: number): string {
  const adjective = ADJECTIVES[seed % ADJECTIVES.length]
  const noun = NOUNS[Math.floor(seed / ADJECTIVES.length) % NOUNS.length]
  return `${adjective} ${noun}`
}

export const NAME_LIMITS = { min: 2, max: 20 }

export type NameCheck =
  | { ok: true; name: string }
  | { ok: false; reason: 'length' | 'characters' | 'contact' | 'reserved' | 'blocked' }

const RESERVED = ['curator', 'staff', 'admin', 'moderator', 'tinymuseum', 'inspiratiq', 'official', 'support']

export function normalizeDisplayName(raw: string): string {
  return raw.normalize('NFKC').trim().replace(/\s+/gu, ' ')
}

export function checkDisplayName(raw: string): NameCheck {
  const name = normalizeDisplayName(raw)
  const length = [...name].length
  if (length < NAME_LIMITS.min || length > NAME_LIMITS.max) return { ok: false, reason: 'length' }
  if (!/^[\p{L}\p{M}\p{N}' ._-]+$/u.test(name) || !/\p{L}/u.test(name)) return { ok: false, reason: 'characters' }
  // A dot between letters reads as a web address; five digits as a phone number or handle.
  if (/[\p{L}\p{N}]\.[\p{L}\p{N}]/u.test(name) || (name.match(/\p{N}/gu)?.length ?? 0) >= 5) {
    return { ok: false, reason: 'contact' }
  }
  const squashed = name.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '')
  if (RESERVED.some((word) => squashed.includes(word))) return { ok: false, reason: 'reserved' }
  if (hasProfanity(name)) return { ok: false, reason: 'blocked' }
  return { ok: true, name }
}
