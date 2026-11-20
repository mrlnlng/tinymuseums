import type { CharacterKind } from './rig'

/** The characters the mirror shows, in the order the gems and the swipe run. */
export const MIRROR_KINDS: readonly CharacterKind[] = ['bunny', 'cat', 'otter', 'bruce']

export const wrap = (i: number, n: number) => ((i % n) + n) % n

export const kindAt = (position: number) => MIRROR_KINDS[wrap(position, MIRROR_KINDS.length)]

/**
 * Where a swipe lands: one character along for a drag past a fifth of a reflection's width or a
 * quick flick, never more than one, so a long drag can't skip anyone.
 */
export function settle(position: number, dragPx: number, slideWidth: number, velocityPxPerMs = 0): number {
  const far = Math.abs(dragPx) > slideWidth * 0.2
  const flick = Math.abs(velocityPxPerMs) > 0.4 && Math.sign(velocityPxPerMs) === Math.sign(dragPx)
  if (dragPx === 0 || (!far && !flick)) return position
  return position - Math.sign(dragPx)
}
