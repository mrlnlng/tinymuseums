import manifest from '@/generated/asset-manifest.json'
import { builtUrl } from '@/shared/lib/assets'

type AtelierImage = keyof typeof manifest.atelier

/** A small picture of each thing the atelier offers: a character's portrait, a costume on its hanger, a headpiece. */
const PICTURE: Record<string, AtelierImage> = {
  'character:otter': 'portraitOtter',
  'character:bruce': 'portraitBruce',
  'character:cat': 'portraitJiji',
  'costume:kiki': 'hangerKiki',
  'costume:tutu': 'hangerTutu',
  'costume:blue-floral': 'hangerBlueFloral',
  'costume:floral-cardigan': 'hangerFloralCardigan',
  'costume:gold-sequin': 'hangerGoldSequin',
  'costume:gold-cape': 'hangerGoldCape',
  'costume:cardigan-red': 'hangerCardiganRed',
  'costume:cardigan-forest-green': 'hangerCardiganForestGreen',
  'costume:cardigan-navy-blue': 'hangerCardiganNavyBlue',
  'costume:cardigan-butter-yellow': 'hangerCardiganButterYellow',
  'bow:kiki': 'bow',
  'bow:flower-crown': 'flowerCrown',
  'bow:hibiscus-blue': 'hibiscusBlue',
  'bow:hibiscus-yellow': 'hibiscusYellow',
  'bow:hibiscus-pink': 'hibiscusPink',
  'bow:blue-cap': 'blueCap',
  'bow:daisy-clip': 'daisyClip',
}

export function pieceUrl(part: 'character' | 'costume' | 'bow', id: string): string | null {
  const name = PICTURE[`${part}:${id}`]
  return name ? builtUrl(manifest.atelier[name].src) : null
}
