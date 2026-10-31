import assert from 'node:assert/strict'
import { test } from 'node:test'
import type { ClientMessage, Ticket } from '@tiny/core/presence/wire'
import { admitted, newAttachment, onMessage, peerOf, type Attachment } from './room-logic.ts'

const ticket: Ticket = { pid: 'pid-12345678', name: 'Velvet Easel', room: 'hall-e3', exp: Date.now() + 60_000 }
const look = { kind: 'cat', costume: null, bow: 'kiki' } as const
const state = (seq: number, x = 1): ClientMessage => ({ t: 'state', x, vx: 0, facing: 1, look, seq })

function joined(now = 0): Attachment {
  const attachment = admitted(newAttachment('hall-e3-s1', now), ticket)
  assert.ok(attachment)
  return attachment as Attachment
}

test('a ticket admits a socket only to its own room base', () => {
  assert.equal(admitted(newAttachment('hall-e3-s1', 0), null), null)
  assert.equal(admitted(newAttachment('hall-e4-s0', 0), ticket), null)
  assert.equal(admitted(newAttachment('atelier-s0', 0), ticket), null)
  assert.equal(joined().pid, ticket.pid)
})

test('nothing but hello is accepted before admission', () => {
  const outcome = onMessage(newAttachment('hall-e3-s0', 0), state(1), 0)
  assert.equal(outcome.kind, 'close')
})

test('states are stamped with the ticket identity, whatever the client sent', () => {
  const outcome = onMessage(joined(), state(1, 42), 0)
  assert.equal(outcome.kind, 'broadcast')
  if (outcome.kind !== 'broadcast') return
  assert.deepEqual(outcome.message, { t: 'state', pid: ticket.pid, name: ticket.name, x: 42, vx: 0, facing: 1, look, seq: 1 })
  assert.deepEqual(peerOf(outcome.attachment), { pid: ticket.pid, name: ticket.name, x: 42, vx: 0, facing: 1, look, seq: 1 })
})

test('out-of-order states are dropped', () => {
  const first = onMessage(joined(), state(5), 0).attachment
  assert.equal(onMessage(first, state(5), 100).kind, 'ignore')
  assert.equal(onMessage(first, state(4), 100).kind, 'ignore')
  assert.equal(onMessage(first, state(6), 100).kind, 'broadcast')
})

test('states beyond about six a second are dropped, and a flood closes the socket', () => {
  let attachment = joined()
  let sent = 0
  let closed = false
  for (let i = 1; i <= 200 && !closed; i++) {
    const outcome = onMessage(attachment, state(i), i) // 200 messages in 0.2 s
    attachment = outcome.attachment
    if (outcome.kind === 'broadcast') sent++
    closed = outcome.kind === 'close'
  }
  assert.ok(sent >= 10 && sent <= 12, `sent ${sent}`)
  assert.ok(closed)
})

test('a steady 5 Hz never trips the limit', () => {
  let attachment = joined()
  for (let i = 1; i <= 300; i++) {
    const outcome = onMessage(attachment, state(i), i * 200)
    assert.equal(outcome.kind, 'broadcast', `message ${i}`)
    attachment = outcome.attachment
  }
})

test('emotes are spaced at least 1.5 s apart', () => {
  const first = onMessage(joined(), { t: 'emote', e: 'wave', seq: 1 }, 10_000)
  if (first.kind !== 'broadcast') return assert.fail(first.kind)
  assert.deepEqual(first.message, { t: 'emote', pid: ticket.pid, e: 'wave' })
  assert.equal(onMessage(first.attachment, { t: 'emote', e: 'heart', seq: 2 }, 11_000).kind, 'ignore')
  assert.equal(onMessage(first.attachment, { t: 'emote', e: 'heart', seq: 2 }, 11_500).kind, 'broadcast')
})

test('garbage counts as a strike, and leave closes cleanly', () => {
  assert.equal(onMessage(joined(), null, 0).attachment.strikes, 1)
  const leave = onMessage(joined(), { t: 'leave' }, 0)
  if (leave.kind !== 'close') return assert.fail(leave.kind)
  assert.equal(leave.code, 1000)
})
