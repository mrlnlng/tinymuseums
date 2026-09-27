import assert from 'node:assert/strict'
import { test } from 'node:test'
import { BugReportRejected, normalizeBugPage, parseBugReport } from './bug-reports.ts'

test('a report keeps its message, contact, page and known context', () => {
  const report = parseBugReport({
    message: '  The ticket covers the button\r\n\r\n\r\n\r\nin Instagram  ',
    contact: ' @someone ',
    page: '/museum?from=ig#top',
    context: { userAgent: 'Instagram 300', inApp: 'instagram', dpr: 3, touch: true, errors: ['boom'] },
  })
  assert.deepEqual(report, {
    message: 'The ticket covers the button\n\nin Instagram',
    contact: '@someone',
    page: '/museum',
    context: { userAgent: 'Instagram 300', inApp: 'instagram', dpr: 3, touch: true, errors: ['boom'] },
  })
})

test('an empty or oversized message is rejected', () => {
  assert.throws(() => parseBugReport({ message: '   ' }), BugReportRejected)
  assert.throws(() => parseBugReport({}), BugReportRejected)
  assert.throws(() => parseBugReport({ message: 'x'.repeat(2001) }), BugReportRejected)
})

test('unknown context keys, nested objects and bad values are dropped', () => {
  const { context, contact } = parseBugReport({
    message: 'hi',
    contact: '',
    context: {
      cookie: 'secret',
      viewport: { w: 1 },
      dpr: Number.NaN,
      screen: '402x874',
      errors: ['a', 2, 'b', ...Array.from({ length: 20 }, (_, i) => `e${i}`)],
    },
  })
  assert.equal(contact, null)
  assert.deepEqual(Object.keys(context).sort(), ['errors', 'screen'])
  assert.equal((context.errors as string[]).length, 10)
  assert.equal((context.errors as string[]).at(-1), 'e19')
})

test('pages lose query strings and never store access tokens', () => {
  assert.equal(normalizeBugPage('/a/some-artist?x=1'), '/a/some-artist')
  assert.equal(normalizeBugPage('/q/secret-token'), '/q/[token]')
  assert.equal(normalizeBugPage('https://evil.test/'), '/')
  assert.equal(normalizeBugPage(undefined), '/')
})
