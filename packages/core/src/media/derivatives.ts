import type { Derivative } from '../types.ts'

/* Picks a derivative from the ladder: `minWidth` 0 is the smallest, any other value is "smallest at or above, else largest". */

export function pickDerivative(
  derivatives: Derivative[],
  minWidth: number,
  format = 'jpg',
): Derivative | null {
  const candidates = derivatives
    .filter((d) => d.format === format)
    .sort((a, b) => a.width - b.width)
  if (candidates.length === 0) return null
  return candidates.find((d) => d.width >= minWidth) ?? candidates[candidates.length - 1]
}
