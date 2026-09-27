export interface ShareSummary {
  brand: string
  modeLabel: string
  difficulty: string
  scores: readonly number[]
  starsPerRound: number
  bonus: number
  url: string
}

export function shareText({ brand, modeLabel, difficulty, scores, starsPerRound, bonus, url }: ShareSummary): string {
  const earned = scores.reduce((sum, stars) => sum + stars, 0)
  const rounds = scores
    .map((stars) => '⭐'.repeat(stars) + '▫️'.repeat(Math.max(0, starsPerRound - stars)))
    .join(' ')
  const total = `${earned}/${scores.length * starsPerRound} stars`
  const streak = bonus > 0 ? ` +${bonus} streak ${bonus === 1 ? 'bonus' : 'bonuses'}` : ''
  return [
    `Guess the Painting at ${brand}`,
    `${modeLabel} · ${difficulty}`,
    rounds,
    `${total}${streak}`,
    url,
  ].join('\n')
}

export type ShareOutcome = 'shared' | 'copied' | 'cancelled' | 'failed'

export async function shareResult(text: string): Promise<ShareOutcome> {
  if (typeof navigator.share === 'function' && navigator.canShare?.({ text }) !== false) {
    try {
      await navigator.share({ text })
      return 'shared'
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return 'cancelled'
    }
  }
  try {
    await navigator.clipboard.writeText(text)
    return 'copied'
  } catch {
    return 'failed'
  }
}
