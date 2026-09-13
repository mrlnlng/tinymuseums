import type { Derivative } from '../types.ts'

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
