/**
 * The one call any feature makes when a quest step happens. No React, no props:
 * a mini-game, the closet, the artwork card and the personal room all report here.
 */

import type { QuestKind } from './letters.ts'
import {
  ensureLettersStarted,
  markLetterOpened,
  recordQuestEvent,
  type LetterProgress,
} from './progress.ts'
import type { LetterId } from './letters.ts'

/** Start (or resume) the letters. Letter 0 arrives the first time this runs. */
export function startCuratorLetters(): LetterProgress {
  return ensureLettersStarted()
}

/** A quest step: clean room, decoration placed, artwork viewed, game finished, outfit changed. */
export function reportQuestEvent(kind: QuestKind, detail?: string): LetterProgress {
  return recordQuestEvent(kind, detail)
}

/** Reading a letter. Opening letter 6 can hand letter 7 over when that chapter exists. */
export function openCuratorLetter(letter: LetterId): LetterProgress {
  return markLetterOpened(letter)
}
