import assert from 'node:assert/strict'
import { test } from 'node:test'
import type { ClientMessage, Ticket } from '@tiny/core/presence/wire'
import { GHOST_MS, HELLO_TIMEOUT_MS, MAX_WAITING_PER_IP, admitted, farewell, holdsOf, newAttachment, onMessage, peerOf, roomFull, stale, tooManyWaiting, type Attachment } from './room-logic.ts'

const ticket: Ticket = { pid: 'pid-12345678', name: 'Velvet Easel', room: 'hall-e3', exp: Date.now() + 60_000, own: ['bow:kiki'] }
const look = { kind: 'cat', costume: null, bow: 'kiki' } as const
const state = (seq: number, x = 1): ClientMessage => ({ t: 'state', x, vx: 0, facing: 1, look, sit: false, helm: false, cup: false, seq })

function joined(now = 0, who: Ticket = ticket): Attachment {
  const attachment = admitted(newAttachment('hall-e3-s1', now), who)
  assert.ok(attachment)
  return attachment as Attachment
}

const other = (pid: string, holds: Attachment['holds'] = []) => ({ ...joined(0, { ...ticket, pid, name: pid }), holds })

test('a ticket admits a socket only to its own room base', () => {
  assert.equal(admitted(newAttachment('hall-e3-s1', 0), null), null)
  assert.equal(admitted(newAttachment('hall-e4-s0', 0), ticket), null)
  assert.equal(admitted(newAttachment('atelier-s0', 0), ticket), null)
  assert.equal(joined().pid, ticket.pid)
})

test('nothing but hello is accepted before admission', () => {
  assert.ok(onMessage(newAttachment('hall-e3-s0', 0), state(1), 0, []).close)
})

test('states are stamped with the ticket identity, whatever the client sent', () => {
  const outcome = onMessage(joined(), state(1, 42), 0, [])
  assert.deepEqual(outcome.send, {
    to: 'others',
    message: { t: 'state', pid: ticket.pid, name: ticket.name, x: 42, vx: 0, facing: 1, look, sit: false, helm: false, cup: false, seq: 1 },
  })
  assert.equal(peerOf(outcome.attachment)?.x, 42)
})

test('others see only the pieces and characters in the signed own list', () => {
  const owned = { ...ticket, own: ['costume:kiki', 'bow:kiki'] }
  const dressed = { ...state(1), look: { kind: 'otter', costume: 'kiki', bow: 'kiki' } } as ClientMessage
  const outcome = onMessage(joined(0, owned), dressed, 0, [])
  assert.deepEqual(outcome.send?.message, {
    t: 'state', pid: ticket.pid, name: ticket.name, x: 1, vx: 0, facing: 1,
    look: { kind: 'bunny', costume: 'kiki', bow: 'kiki' }, sit: false, helm: false, cup: false, seq: 1,
  })
})

test('free characters always pass, and unowned pieces become none', () => {
  const none = { ...ticket, own: [] }
  const dressed = { ...state(1), look: { kind: 'cat', costume: 'kiki', bow: 'kiki' } } as ClientMessage
  const outcome = onMessage(joined(0, none), dressed, 0, [])
  assert.equal(outcome.send?.message.t, 'state')
  if (outcome.send?.message.t === 'state') {
    assert.deepEqual(outcome.send.message.look, { kind: 'cat', costume: null, bow: null })
  }
})

test('out-of-order states are dropped', () => {
  const first = onMessage(joined(), state(5), 0, []).attachment
  assert.equal(onMessage(first, state(5), 100, []).send, undefined)
  assert.equal(onMessage(first, state(4), 100, []).send, undefined)
  assert.ok(onMessage(first, state(6), 100, []).send)
})

test('states beyond about six a second are dropped, and a flood closes the socket', () => {
  let attachment = joined()
  let sent = 0
  let closed = false
  for (let i = 1; i <= 200 && !closed; i++) {
    const outcome = onMessage(attachment, state(i), i, [])
    attachment = outcome.attachment
    if (outcome.send) sent++
    closed = !!outcome.close
  }
  assert.ok(sent >= 10 && sent <= 12, `sent ${sent}`)
  assert.ok(closed)
})

test('a steady 5 Hz never trips the limit', () => {
  let attachment = joined()
  for (let i = 1; i <= 300; i++) {
    const outcome = onMessage(attachment, state(i), i * 200, [])
    assert.ok(outcome.send, `message ${i}`)
    attachment = outcome.attachment
  }
})

test('a message goes to the others, tidied and stamped with the sender', () => {
  const outcome = onMessage(joined(), { t: 'say', text: '  hello   there ', seq: 1 }, 10_000, [])
  assert.deepEqual(outcome.send, { to: 'others', message: { t: 'said', pid: ticket.pid, text: 'hello there' } })
})

test('messages are spaced at least 1.5 s apart; the sender hears why one is held back', () => {
  const first = onMessage(joined(), { t: 'say', text: 'hi', seq: 1 }, 10_000, [])
  assert.deepEqual(onMessage(first.attachment, { t: 'say', text: 'again', seq: 2 }, 11_000, []).send, { to: 'self', message: { t: 'refused', reason: 'too-soon' } })
  assert.equal(onMessage(first.attachment, { t: 'say', text: 'again', seq: 2 }, 11_500, []).send?.to, 'others')
})

test('links, profanity and empty messages reach nobody but their sender, without a strike', () => {
  for (const [text, reason] of [['visit example.com', 'contact'], ['fuck this', 'blocked'], ['   ', 'empty'], ['x'.repeat(101), 'long']] as const) {
    const outcome = onMessage(joined(), { t: 'say', text, seq: 1 }, 10_000, [])
    assert.deepEqual(outcome.send, { to: 'self', message: { t: 'refused', reason } }, text)
    assert.equal(outcome.attachment.strikes, 0)
  }
})

test('a flood of messages is cut off like any other', () => {
  let attachment = joined()
  let closed = false
  for (let i = 1; i <= 200 && !closed; i++) {
    const outcome = onMessage(attachment, { t: 'say', text: 'spam', seq: i }, 10_000 + i, [])
    attachment = outcome.attachment
    closed = !!outcome.close
  }
  assert.ok(closed)
})

test('a free item goes to the first claim, and everyone hears who has it', () => {
  const outcome = onMessage(joined(), { t: 'claim', item: 'seat' }, 0, [other('someoneElse1')])
  assert.deepEqual(outcome.send, { to: 'all', message: { t: 'held', item: 'seat', pid: ticket.pid } })
  assert.deepEqual(outcome.attachment.holds, ['seat'])
})

test('a held item is refused, and only the claimant hears who has it', () => {
  const outcome = onMessage(joined(), { t: 'claim', item: 'seat' }, 0, [other('sitterPID01', ['seat'])])
  assert.deepEqual(outcome.send, { to: 'self', message: { t: 'held', item: 'seat', pid: 'sitterPID01' } })
  assert.deepEqual(outcome.attachment.holds, [])
})

test('claims settle one at a time: the second of two claimants is refused', () => {
  const a = joined(0, { ...ticket, pid: 'claimantA001' })
  const b = joined(0, { ...ticket, pid: 'claimantB001' })
  const first = onMessage(a, { t: 'claim', item: 'helm-4' }, 0, [b])
  const second = onMessage(b, { t: 'claim', item: 'helm-4' }, 0, [first.attachment])
  assert.equal(first.send?.to, 'all')
  assert.deepEqual(second.send, { to: 'self', message: { t: 'held', item: 'helm-4', pid: 'claimantA001' } })
})

test('a holder claiming again just hears it is theirs; a third hold is refused', () => {
  const seated = { ...joined(), holds: ['seat', 'helm-1'] as Attachment['holds'] }
  assert.deepEqual(onMessage(seated, { t: 'claim', item: 'seat' }, 0, []).send, { to: 'self', message: { t: 'held', item: 'seat', pid: ticket.pid } })
  const third = onMessage(seated, { t: 'claim', item: 'helm-2' }, 0, [])
  assert.equal(third.send, undefined)
  assert.deepEqual(third.attachment.holds, ['seat', 'helm-1'])
})

test('only the holder can release, and everyone hears the item is free', () => {
  const seated = { ...joined(), holds: ['seat'] as Attachment['holds'] }
  const released = onMessage(seated, { t: 'release', item: 'seat' }, 0, [])
  assert.deepEqual(released.send, { to: 'all', message: { t: 'held', item: 'seat', pid: null } })
  assert.deepEqual(released.attachment.holds, [])
  assert.equal(onMessage(joined(), { t: 'release', item: 'seat' }, 0, []).send, undefined)
})

test('a departing visitor leaves, and lets go of what they held', () => {
  assert.deepEqual(farewell({ ...joined(), holds: ['seat'] }), [
    { t: 'leave', pid: ticket.pid },
    { t: 'held', item: 'seat', pid: null },
  ])
  assert.deepEqual(farewell({ ...joined(), gone: true }), [])
  assert.deepEqual(farewell(newAttachment('hall-e3-s0', 0)), [])
})

test('holds and peers come only from visitors still in the room', () => {
  const leaving = { ...other('leavingPID01', ['seat']), gone: true }
  assert.deepEqual(holdsOf([leaving, other('wearerPID001', ['helm-2'])]), { 'helm-2': 'wearerPID001' })
  assert.equal(peerOf({ ...onMessage(joined(), state(1), 0, []).attachment, gone: true }), null)
})

test('silent sockets go stale: no hello in 5 s, or nothing heard for 15 s', () => {
  assert.equal(stale(newAttachment('atelier-s0', 0), HELLO_TIMEOUT_MS - 1), false)
  assert.equal(stale(newAttachment('atelier-s0', 0), HELLO_TIMEOUT_MS), true)
  const heard = onMessage(joined(), state(1), 1000, []).attachment
  assert.equal(stale(heard, 1000 + GHOST_MS - 1), false)
  assert.equal(stale(heard, 1000 + GHOST_MS), true)
})

test('garbage counts as a strike, and leave closes cleanly', () => {
  assert.equal(onMessage(joined(), null, 0, []).attachment.strikes, 1)
  assert.equal(onMessage(joined(), { t: 'leave' }, 0, []).close?.code, 1000)
})

test('only admitted visitors take room places, so unticketed sockets cannot fill a room', () => {
  const waiting = Array.from({ length: 8 }, () => newAttachment('atelier-s0', 0, '203.0.113.9'))
  assert.equal(roomFull(waiting, 8), false)
  const visitors = Array.from({ length: 8 }, (_, i) => other(`visitor${String(i).padStart(5, '0')}`))
  assert.equal(roomFull(visitors, 8), true)
  assert.equal(roomFull([...visitors.slice(1), { ...visitors[0], gone: true }], 8), false)
})

test('one address may hold only a few sockets waiting for their ticket', () => {
  const waiting = Array.from({ length: MAX_WAITING_PER_IP }, () => newAttachment('atelier-s0', 0, '203.0.113.9'))
  assert.equal(tooManyWaiting(waiting, '203.0.113.9'), true)
  assert.equal(tooManyWaiting(waiting, '198.51.100.7'), false)
  assert.equal(tooManyWaiting(waiting.slice(1), '203.0.113.9'), false)
  assert.equal(tooManyWaiting([...waiting.slice(1), { ...waiting[0], pid: 'admitted0001' }], '203.0.113.9'), false)
})
