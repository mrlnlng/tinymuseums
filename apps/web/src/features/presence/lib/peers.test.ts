import assert from 'node:assert/strict'
import { test } from 'node:test'
import type { Peer } from '@tiny/core/presence/wire'
import { INTERPOLATION_DELAY_MS, PEER_TIMEOUT_MS, PeerTable } from './peers.ts'

const look = { kind: 'bunny', costume: null, bow: null } as const
const peer = (seq: number, x: number, vx = 0, pid = 'abcdEFGH1234'): Peer => ({ pid, name: 'Velvet Easel', x, vx, facing: 1, look, sit: false, helm: false, cup: false, seq })

test('visitors are drawn between their last two updates, a moment behind', () => {
  const table = new PeerTable()
  table.heard(peer(1, 0, 2), 1000)
  table.heard(peer(2, 0.4, 2), 1200)
  const [visitor] = table.visitors(1300 + INTERPOLATION_DELAY_MS - 200)
  assert.equal(visitor.name, 'Velvet Easel')
  assert.ok(Math.abs(visitor.x - 0.2) < 1e-9, String(visitor.x))
})

test('past the last update they carry on at their speed, but not far', () => {
  const table = new PeerTable()
  table.heard(peer(1, 0, 2), 1000)
  assert.ok(Math.abs(table.visitors(1000 + INTERPOLATION_DELAY_MS + 100)[0].x - 0.2) < 1e-9)
  assert.ok(Math.abs(table.visitors(1000 + INTERPOLATION_DELAY_MS + 5000)[0].x - 0.6) < 1e-9)
})

test('repeated or out-of-order updates are ignored', () => {
  const table = new PeerTable()
  table.heard(peer(5, 1), 0)
  table.heard(peer(4, 9), 10)
  table.heard(peer(5, 9), 10)
  assert.equal(table.visitors(1000)[0].x, 1)
})

test('silent visitors are forgotten; leaving removes them at once', () => {
  const table = new PeerTable()
  table.heard(peer(1, 0), 0)
  table.heard(peer(1, 0, 0, 'otherPID5678'), 5000)
  table.expire(PEER_TIMEOUT_MS + 1)
  assert.equal(table.size, 1)
  table.left('otherPID5678')
  assert.equal(table.size, 0)
})

test('a message is kept on its visitor with the time it arrived', () => {
  const table = new PeerTable()
  assert.equal(table.said('abcdEFGH1234', 'hello', 0), false)
  table.heard(peer(1, 0), 0)
  assert.equal(table.said('abcdEFGH1234', 'hello', 50), true)
  assert.deepEqual(table.visitors(100)[0].said, { text: 'hello', at: 50 })
  assert.equal(table.nameOf('abcdEFGH1234'), 'Velvet Easel')
})

test('after standing still, a visitor eases off from where they stood', () => {
  const table = new PeerTable()
  table.heard(peer(1, 5, 0), 0)
  table.heard(peer(2, 5.4, 2), 4000)
  // Drawn 200 ms behind: at 4000 they are still at 5, not most of the way to 5.4.
  assert.equal(table.visitors(4000)[0].x, 5)
  const halfway = table.visitors(4100)[0].x
  assert.ok(halfway > 5 && halfway < 5.4, String(halfway))
})

test('pose flags come through to the drawn visitor', () => {
  const table = new PeerTable()
  table.heard({ ...peer(1, 0), sit: true, helm: true }, 0)
  const [visitor] = table.visitors(100)
  assert.deepEqual([visitor.sit, visitor.helm, visitor.cup], [true, true, false])
})
