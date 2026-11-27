/**
 * The client half of the pond's catch window.
 *
 * The server refuses a reel report that arrives sooner than its cast-to-reel
 * window, and a report can also fail because a phone lost signal for a moment.
 * A landed fish is the valuable case: it must wait for the window and be retried
 * rather than thrown away, otherwise a catch can skip the reveal and the journal.
 */

export const MIN_REPORT_MS = 1900
export const MAX_REPORT_RETRIES = 2

/** How long to wait before reporting, so the server has had its minimum window. */
export function reportDelay(castReplyAt: number, now: number, minReportMs = MIN_REPORT_MS): number {
  return Math.max(0, castReplyAt + minReportMs - now)
}

export interface ReelFailure {
  error: string
  status: number
}

/**
 * A landed catch is retried after a timing or transient network failure.
 * Returns the wait in milliseconds, or null when the reply should be treated as
 * final (a bad ticket or an expired cast cannot be fixed by asking again).
 */
export function landedRetryDelay(
  failure: ReelFailure,
  attempt: number,
  castReplyAt: number,
  now: number,
  minReportMs = MIN_REPORT_MS,
): number | null {
  if (attempt >= MAX_REPORT_RETRIES) return null
  // Ask again only after the server's minimum window has passed.
  if (failure.error === 'too_soon') return Math.max(80, reportDelay(castReplyAt, now, minReportMs))
  // The request never reached the pond, or a proxy/rate limit answered instead.
  if (failure.status === 0 || failure.error === 'offline') return 350 * (attempt + 1)
  if (failure.status === 429 || failure.error === 'rate_limited') return 900 * (attempt + 1)
  if (failure.status >= 500) return 350 * (attempt + 1)
  return null
}
