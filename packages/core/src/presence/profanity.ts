import { englishDataset, englishRecommendedTransformers, RegExpMatcher } from 'obscenity'

// One matcher for names and messages; it catches look-alikes ("sh1t") without "Scunthorpe".
// Built on first use, not at import, since every page imports it.
let matcher: RegExpMatcher | null = null

export function hasProfanity(text: string): boolean {
  matcher ??= new RegExpMatcher({ ...englishDataset.build(), ...englishRecommendedTransformers })
  return matcher.hasMatch(text)
}
