export type MinigameId = 'sketch' | 'color'

export interface Minigame {
  id: MinigameId
  title: string
  blurb: string
}

export const MINIGAMES = [
  {
    id: 'sketch',
    title: 'Sketch Guess',
    blurb: 'Draw, guess, and earn stars.',
  },
  {
    id: 'color',
    title: 'Color Recall',
    blurb: 'Hold a color in your mind and pick its match.',
  },
] as const satisfies readonly Minigame[]
