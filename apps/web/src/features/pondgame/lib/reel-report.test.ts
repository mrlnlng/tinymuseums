import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  landedRetryDelay,
  MIN_REPORT_MS,
  reportDelay,
} from './reel-report.ts'

const replyAt = 10_000

test('every reel report, landed or lost, waits out the server minimum window', () => {
  assert.equal(reportDelay(replyAt, replyAt), MIN_REPORT_MS)
  assert.equal(reportDelay(replyAt, replyAt + 500), MIN_REPORT_MS - 500)
  assert.equal(reportDelay(replyAt, replyAt + MIN_REPORT_MS), 0)
  assert.equal(reportDelay(replyAt, replyAt + MIN_REPORT_MS + 20), 0)
})

test('a landed catch reported too soon is retried, not thrown away', () => {
  const wait = landedRetryDelay({ error: 'too_soon', status: 400 }, 0, replyAt, replyAt)
  assert.equal(typeof wait, 'number')
  assert.ok(wait !== null && wait >= MIN_REPORT_MS)
  // The retry itself is final once the window is comfortably past.
  assert.equal(landedRetryDelay({ error: 'too_soon', status: 400 }, 0, replyAt, replyAt + 5000), 80)
})

test('a lost signal or a busy pond retries a landed catch a couple of times', () => {
  assert.equal(landedRetryDelay({ error: 'offline', status: 0 }, 0, replyAt, replyAt), 350)
  assert.equal(landedRetryDelay({ error: 'offline', status: 0 }, 1, replyAt, replyAt), 700)
  assert.equal(landedRetryDelay({ error: 'offline', status: 0 }, 2, replyAt, replyAt), null)

  assert.equal(landedRetryDelay({ error: 'rate_limited', status: 429 }, 0, replyAt, replyAt), 900)
  assert.equal(landedRetryDelay({ error: 'http_500', status: 500 }, 0, replyAt, replyAt), 350)
})

test('a bad or expired ticket is final rather than retried forever', () => {
  for (const error of ['invalid_ticket', 'expired', 'used_ticket', 'signed_out', 'invalid']) {
    assert.equal(landedRetryDelay({ error, status: 400 }, 0, replyAt, replyAt), null, error)
  }
})
