import type { Derivative } from '../types.ts'

export function pickDerivative(
  derivatives: Derivative[],
  minWidth: number,
  format = 'jpg',
): Derivative | null {
  let suitable: Derivative | null = null
  let largest: Derivative | null = null
  for (const derivative of derivatives) {
    if (derivative.format !== format) continue
    if (!largest || derivative.width >= largest.width) largest = derivative
    if (derivative.width >= minWidth && (!suitable || derivative.width < suitable.width)) {
      suitable = derivative
    }
  }
  return suitable ?? largest
}
