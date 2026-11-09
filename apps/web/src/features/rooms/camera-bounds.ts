/** Keep the visible window inside the room's illustrated edges, including after a resize. */
export function boundedCameraX(x: number, viewWidth: number, left: number, right: number): number {
  // A room narrower than the window stays centred rather than oscillating between its ends.
  const inset = Math.min(viewWidth / 2, (right - left) / 2)
  return Math.max(left + inset, Math.min(right - inset, x))
}
