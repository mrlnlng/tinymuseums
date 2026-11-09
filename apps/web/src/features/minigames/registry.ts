import { POND_NAME } from '@/features/pondroom/lib/identity'

export type MinigameId = 'sketch' | 'color' | 'pond'

export interface Minigame {
  id: MinigameId
  title: string
  blurb: string
  icon: string
}

export const MINIGAMES = [
  {
    id: 'sketch',
    title: 'Sketch Guess',
    blurb: 'Draw, guess, and earn stars.',
    icon: '✎',
  },
  {
    id: 'color',
    title: 'Color Recall',
    blurb: 'Hold a color in your mind and pick its match.',
    icon: '◐',
  },
  {
    id: 'pond',
    title: POND_NAME,
    blurb: 'Follow the garden path to the lily pond.',
    icon: '🎣',
  },
] as const satisfies readonly Minigame[]
