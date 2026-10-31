import assert from 'node:assert/strict'
import { test } from 'node:test'
import { MESSAGE_MAX, checkMessage } from './messages.ts'

test('ordinary messages pass, tidied', () => {
  assert.deepEqual(checkMessage('  hello   there! '), { ok: true, text: 'hello there!' })
  assert.deepEqual(checkMessage('I love this one. The blues!'), { ok: true, text: 'I love this one. The blues!' })
  assert.deepEqual(checkMessage('e.g. the 3rd painting, 2 rooms down'), { ok: true, text: 'e.g. the 3rd painting, 2 rooms down' })
  assert.deepEqual(checkMessage('Ｗｏｗ ✨'), { ok: true, text: 'Wow ✨' })
  assert.deepEqual(checkMessage('a\nb‮c'), { ok: true, text: 'a b c' })
  assert.equal(checkMessage('Scunthorpe is lovely').ok, true)
})

test('empty and overlong messages are refused', () => {
  assert.deepEqual(checkMessage('   '), { ok: false, reason: 'empty' })
  assert.deepEqual(checkMessage('x'.repeat(MESSAGE_MAX + 1)), { ok: false, reason: 'long' })
  assert.equal(checkMessage('x'.repeat(MESSAGE_MAX)).ok, true)
})

test('links, emails and phone numbers are refused', () => {
  for (const text of ['see example.com', 'www.thing', 'https://x', 'mail me@here', 'call 555 123 4567', 'dm 5551234567', 'my.site.art']) {
    assert.deepEqual(checkMessage(text), { ok: false, reason: 'contact' }, text)
  }
  assert.equal(checkMessage('room 101, 2026').ok, true)
})

test('profanity is refused, look-alikes too', () => {
  assert.deepEqual(checkMessage('what the fuck'), { ok: false, reason: 'blocked' })
  assert.deepEqual(checkMessage('sh1t'), { ok: false, reason: 'blocked' })
})
