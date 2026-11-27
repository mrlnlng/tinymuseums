/**
 * Pond copy that depends on what just happened, kept out of the components so the
 * wording is testable. Kids read these; keep them warm and plain.
 */

/** How far the player is through the cast/collect loop. */
export type CastStage =
  /** Nothing has finished yet, so the first cast keeps its gentle invitation. */
  | 'first'
  /** A cast just ended without a fish. */
  | 'again'
  /** A fish was collected since the last cast. */
  | 'caught'

export interface CastPrompt {
  label: string
  sub: string
}

export const EASY_REEL_NOTE = 'The green zone is bigger, so fish are easier to catch.'

export const HOOK_TUTORIAL_KEY = 'tm:pond:hook-tip'
export const HOOK_TUTORIAL_COPY = 'Keep holding to stay in the green zone!'

/** The first hook shows the tip once; the flag is written on the way in. */
export function hookTutorialNeeded(seen: string | null): boolean {
  return seen !== '1'
}

export function idlePrompt(touch: boolean, stage: CastStage): CastPrompt {
  if (stage === 'first') {
    return { label: 'Cast', sub: touch ? 'Tap to start' : 'Hold to charge' }
  }
  if (stage === 'caught') {
    return { label: 'Keep fishing', sub: touch ? 'Tap to cast again' : 'Hold to cast again' }
  }
  return { label: 'Cast again', sub: touch ? 'Tap to cast again' : 'Hold to cast again' }
}

export function idleHint(touch: boolean, stage: CastStage): string {
  if (stage === 'first') {
    return touch ? 'Tap anywhere to cast' : 'Hold the button, then let go in the gold zone'
  }
  return touch ? 'Tap anywhere to cast again' : 'Hold to cast again when you’re ready'
}
