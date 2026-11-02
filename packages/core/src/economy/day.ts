const MIN_OFFSET = -14 * 60
const MAX_OFFSET = 14 * 60

/**
 * Minutes east of UTC, exactly what `-new Date().getTimezoneOffset()` returns.
 * The member's local calendar day, as the server stores it (YYYY-MM-DD).
 */
export function localDay(tzOffset: number, now: Date): string {
  const valid =
    typeof tzOffset === 'number' &&
    Number.isFinite(tzOffset) &&
    Number.isInteger(tzOffset)
  const offset = valid ? Math.max(MIN_OFFSET, Math.min(MAX_OFFSET, tzOffset)) : 0
  const local = new Date(now.getTime() + offset * 60_000)
  return local.toISOString().slice(0, 10)
}
