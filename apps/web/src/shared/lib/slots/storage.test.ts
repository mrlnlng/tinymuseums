import assert from 'node:assert/strict'
import { test } from 'node:test'
import { anonKey, deviceKey, isMemberSlotKey, memberKey, parseStored } from './storage.ts'

test('parseStored accepts valid records and rejects garbage', () => {
  assert.deepEqual(parseStored(JSON.stringify({ version: 2, doc: { a: 1 }, dirty: true })), {
    version: 2,
    doc: { a: 1 },
    dirty: true,
  })
  assert.equal(parseStored(JSON.stringify({ version: 1, doc: {} }))?.dirty, false)
  assert.equal(parseStored(null), null)
  assert.equal(parseStored('not json'), null)
  assert.equal(parseStored(JSON.stringify([1, 2])), null)
  assert.equal(parseStored(JSON.stringify({ version: 0, doc: {} })), null)
  assert.equal(parseStored(JSON.stringify({ version: 1.5, doc: {} })), null)
  assert.equal(parseStored(JSON.stringify({ version: '1', doc: {} })), null)
  assert.equal(parseStored(JSON.stringify({ doc: {} })), null)
  assert.equal(parseStored(JSON.stringify({ version: 1, doc: [] })), null)
  assert.equal(parseStored(JSON.stringify({ version: 1, doc: null })), null)
  assert.equal(parseStored(JSON.stringify({ version: 1, doc: 3 })), null)
})

test('slot keys keep namespaces apart', () => {
  assert.equal(anonKey('x'), 'tm_slot:anon:x')
  assert.equal(memberKey('m1', 'x'), 'tm_slot:m:m1:x')
  assert.equal(deviceKey('x'), 'tm_slot:x')
  assert.ok(isMemberSlotKey('tm_slot:m:m1:x'))
  assert.ok(!isMemberSlotKey('tm_slot:m1:x'))
  assert.ok(!isMemberSlotKey('tm_slot:anon:x'))
  assert.ok(!isMemberSlotKey('tm_member'))
})
