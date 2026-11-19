import assert from 'node:assert/strict'
import { test } from 'node:test'
import { JOBS } from './jobs.ts'
import { RESIDENT_IDS } from './cast.ts'
import { ROOM_KINDS } from './places.ts'
import type { NpcRoom } from './schedule.ts'

const ROOMS: readonly NpcRoom[] = ['hall', 'atelier', 'pond']

test('each room lists only the place kinds it actually builds', () => {
  assert.deepEqual(ROOM_KINDS.hall, ['painting', 'plinth', 'desk', 'board', 'door', 'end', 'seat'])
  assert.deepEqual(ROOM_KINDS.atelier, ['rail', 'painting', 'door', 'end'])
  assert.deepEqual(ROOM_KINDS.pond, ['water', 'desk', 'board', 'door', 'end'])
})

test('every room has a door and a floor end to arrive and leave by', () => {
  for (const room of ROOMS) {
    assert.ok(ROOM_KINDS[room].includes('door'), `${room} has no door`)
    assert.ok(ROOM_KINDS[room].includes('end'), `${room} has no floor end`)
  }
})

test('every resident has at least one room with work for its job', () => {
  for (const id of RESIDENT_IDS) {
    const job = JOBS[id]
    const rooms = ROOMS.filter((room) => ROOM_KINDS[room].some((kind) => job.visits.includes(kind)))
    assert.ok(rooms.length > 0, `${id} has no room to work in`)
  }
})
