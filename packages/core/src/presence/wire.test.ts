import assert from 'node:assert/strict'
import { test } from 'node:test'
import { parseClientMessage, parseRoom, roomName } from './protocol.ts'
import { signTicket, verifyTicket, type Ticket } from './ticket.ts'

const SECRET = 'test-secret'
const ticket: Ticket = { pid: 'abcdEFGH1234', name: 'Velvet Easel', room: 'hall-e12', exp: Date.now() + 60_000 }

test('a signed ticket verifies, and any change to it does not', async () => {
  const token = await signTicket(ticket, SECRET)
  assert.deepEqual(await verifyTicket(token, SECRET), ticket)
  assert.equal(await verifyTicket(token, 'other-secret'), null)
  const [body, signature] = token.split('.')
  const forged = btoa(JSON.stringify({ ...ticket, name: 'Admin' })).replace(/=+$/, '')
  assert.equal(await verifyTicket(`${forged}.${signature}`, SECRET), null)
  assert.equal(await verifyTicket(`${body}.${signature}x`, SECRET), null)
  assert.equal(await verifyTicket(`${body}`, SECRET), null)
  assert.equal(await verifyTicket(`${token}.extra`, SECRET), null)
})

test('an expired ticket does not verify', async () => {
  const token = await signTicket({ ...ticket, exp: 1000 }, SECRET)
  assert.ok(await verifyTicket(token, SECRET, 999))
  assert.equal(await verifyTicket(token, SECRET, 1000), null)
})

test('a ticket must carry exactly the expected fields', async () => {
  const extra = await signTicket({ ...ticket, admin: true } as unknown as Ticket, SECRET)
  assert.equal(await verifyTicket(extra, SECRET), null)
  const badPid = await signTicket({ ...ticket, pid: 'short' }, SECRET)
  assert.equal(await verifyTicket(badPid, SECRET), null)
})

test('room names are a known base plus an instance', () => {
  assert.deepEqual(parseRoom('hall-e12-s0'), { base: 'hall-e12', instance: 0 })
  assert.deepEqual(parseRoom('atelier-s3'), { base: 'atelier', instance: 3 })
  assert.equal(roomName('atelier', 3), 'atelier-s3')
  for (const bad of ['hall-s0', 'atelier', 'lobby-s0', 'atelier-s100', 'hall-e1-s0/../x']) assert.equal(parseRoom(bad), null, bad)
})

const look = { kind: 'otter', costume: 'cardigan-red', bow: null }

test('state messages are validated and stripped of anything extra', () => {
  const state = { t: 'state', x: 12.5, vx: -3, facing: -1, look, sit: false, helm: true, cup: false, seq: 4 }
  assert.deepEqual(parseClientMessage(JSON.stringify({ ...state, pid: 'someone', name: 'Admin' })), state)
  const { sit: _s, helm: _h, cup: _c, ...older } = state
  assert.deepEqual(parseClientMessage(JSON.stringify(older)), { ...older, sit: false, helm: false, cup: false })
  assert.equal(parseClientMessage(JSON.stringify({ ...state, sit: 'yes' })), null)
  assert.equal(parseClientMessage(JSON.stringify({ ...state, x: Number.MAX_VALUE })), null)
  assert.equal(parseClientMessage(JSON.stringify({ ...state, facing: 0 })), null)
  assert.equal(parseClientMessage(JSON.stringify({ ...state, look: { ...look, kind: 'dog' } })), null)
  assert.equal(parseClientMessage(JSON.stringify({ ...state, look: { ...look, costume: '<b>' } })), null)
  assert.equal(parseClientMessage(JSON.stringify({ ...state, seq: -1 })), null)
})

test('only the four emotes, hello, and leave are accepted besides state', () => {
  assert.deepEqual(parseClientMessage('{"t":"emote","e":"wave","seq":1}'), { t: 'emote', e: 'wave', seq: 1 })
  assert.equal(parseClientMessage('{"t":"emote","e":"rude","seq":1}'), null)
  assert.deepEqual(parseClientMessage('{"t":"hello","v":1,"ticket":"a.b"}'), { t: 'hello', v: 1, ticket: 'a.b' })
  assert.deepEqual(parseClientMessage('{"t":"leave"}'), { t: 'leave' })
  assert.deepEqual(parseClientMessage('{"t":"claim","item":"seat"}'), { t: 'claim', item: 'seat' })
  assert.deepEqual(parseClientMessage('{"t":"release","item":"helm-12"}'), { t: 'release', item: 'helm-12' })
  for (const item of ['cup', 'helm-', 'helm-x', 'helm-12345', '__proto__']) assert.equal(parseClientMessage(JSON.stringify({ t: 'claim', item })), null, item)
  for (const bad of ['', 'nope', '[]', '{"t":"chat","text":"hi"}', 'x'.repeat(2000)]) assert.equal(parseClientMessage(bad), null)
})

test('server messages are checked on the client too', async () => {
  const { parseServerMessage } = await import('./protocol.ts')
  const peer = { pid: 'abcdEFGH1234', name: 'Velvet Easel', x: 1, vx: 0, facing: 1, look, sit: true, helm: false, cup: false, seq: 2 }
  const holds = { seat: 'abcdEFGH1234' }
  assert.deepEqual(parseServerMessage(JSON.stringify({ t: 'welcome', pid: 'abcdEFGH5678', peers: [peer], holds })), { t: 'welcome', pid: 'abcdEFGH5678', peers: [peer], holds })
  assert.equal(parseServerMessage(JSON.stringify({ t: 'welcome', pid: 'abcdEFGH5678', peers: [], holds: { cup: 'abcdEFGH1234' } })), null)
  assert.deepEqual(parseServerMessage('{"t":"held","item":"seat","pid":null}'), { t: 'held', item: 'seat', pid: null })
  assert.deepEqual(parseServerMessage('{"t":"held","item":"helm-3","pid":"abcdEFGH1234"}'), { t: 'held', item: 'helm-3', pid: 'abcdEFGH1234' })
  assert.deepEqual(parseServerMessage(JSON.stringify({ t: 'state', ...peer })), { t: 'state', ...peer })
  assert.equal(parseServerMessage(JSON.stringify({ t: 'state', ...peer, name: '' })), null)
  assert.equal(parseServerMessage(JSON.stringify({ t: 'welcome', pid: 'abcdEFGH5678', peers: [{ ...peer, x: 'far' }] })), null)
  assert.deepEqual(parseServerMessage('{"t":"full"}'), { t: 'full' })
  assert.deepEqual(parseServerMessage('{"t":"leave","pid":"abcdEFGH1234"}'), { t: 'leave', pid: 'abcdEFGH1234' })
  assert.equal(parseServerMessage('{"t":"emote","pid":"abcdEFGH1234","e":"rude"}'), null)
})
