export type Mode = 'sketch' | 'zoom' | 'colour'
export type Difficulty = 'easy' | 'medium' | 'hard'

export const MODE_ORDER: Mode[] = ['sketch', 'zoom', 'colour']
export const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard']

export const STARS_BY_STEP = [3, 2, 1, 1]
export const LAST_STEP = STARS_BY_STEP.length - 1

interface ModeSpec {
  label: string
  question: string
  more: string
  // One value per reveal step. Sketch: fraction of strokes drawn (strokes overlap, so medium
  // uncovers roughly 20%, 45%, 70% and all of the drawing). Zoom: magnification. Colour: blur
  // as a fraction of the page width.
  steps: Record<Difficulty, readonly number[]>
}

export const MODES: Record<Mode, ModeSpec> = {
  sketch: {
    label: 'Sketch',
    question: 'Which painting is being drawn?',
    more: 'Reveal more',
    steps: {
      easy: [0.045, 0.11, 0.2, 1],
      medium: [0.02, 0.06, 0.13, 1],
      hard: [0.008, 0.022, 0.05, 1],
    },
  },
  zoom: {
    label: 'Zoom in',
    question: 'Which painting is this a close-up of?',
    more: 'Zoom out',
    steps: {
      easy: [2.6, 1.8, 1.3, 1],
      medium: [4, 2.6, 1.7, 1],
      hard: [6, 4, 2.5, 1],
    },
  },
  colour: {
    label: 'Colour only',
    question: 'Which painting has these colours?',
    more: 'Sharpen',
    steps: {
      easy: [0.03, 0.018, 0.009, 0],
      medium: [0.05, 0.03, 0.015, 0],
      hard: [0.08, 0.05, 0.025, 0],
    },
  },
}

export const LEVEL_HINTS: Record<Difficulty, string> = {
  easy: 'Plenty to go on',
  medium: 'A fair challenge',
  hard: 'Barely a clue',
}

export function isMode(value: unknown): value is Mode {
  return MODE_ORDER.includes(value as Mode)
}

export function isDifficulty(value: unknown): value is Difficulty {
  return DIFFICULTIES.includes(value as Difficulty)
}
