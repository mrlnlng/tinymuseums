import assert from 'node:assert/strict'
import { test } from 'node:test'

// Set before env.ts loads, so a local .env cannot change the site origin under test.
process.env.PUBLIC_BASE_URL = 'https://museum.example'
const { isSameOriginMutation } = await import('./mutation-guard.ts')

function post(headers: Record<string, string>): Request {
  return new Request('https://museum.example/api/wallet/buy', { method: 'POST', headers })
}

const JSON_TYPE = 'application/json; charset=utf-8'

test('a cross-site post is refused', () => {
  assert.equal(isSameOriginMutation(post({ origin: 'https://evil.example', 'content-type': JSON_TYPE }), true), false)
})

test('a post without an Origin is refused', () => {
  assert.equal(isSameOriginMutation(post({ 'content-type': JSON_TYPE }), true), false)
})

test('a same-origin JSON post passes', () => {
  assert.equal(isSameOriginMutation(post({ origin: 'https://museum.example', 'content-type': JSON_TYPE }), true), true)
})

test('a same-origin form or text post is refused when JSON is required', () => {
  for (const type of ['text/plain', 'application/x-www-form-urlencoded', '']) {
    assert.equal(isSameOriginMutation(post({ origin: 'https://museum.example', 'content-type': type }), true), false)
  }
})

test('a bodyless same-origin post passes when JSON is not required', () => {
  assert.equal(isSameOriginMutation(post({ origin: 'https://museum.example' }), false), true)
})

test('loopback is accepted only for the host the request was sent to', () => {
  assert.equal(isSameOriginMutation(post({ origin: 'http://localhost:3000', host: 'localhost:3000' }), false), true)
  assert.equal(isSameOriginMutation(post({ origin: 'http://localhost:3000', host: 'localhost:4000' }), false), false)
})
