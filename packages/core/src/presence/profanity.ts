import { englishDataset, englishRecommendedTransformers, RegExpMatcher } from 'obscenity'

// One matcher for names and messages; it catches look-alikes ("sh1t") without "Scunthorpe".
const matcher = new RegExpMatcher({ ...englishDataset.build(), ...englishRecommendedTransformers })

export function hasProfanity(text: string): boolean {
  return matcher.hasMatch(text)
}
