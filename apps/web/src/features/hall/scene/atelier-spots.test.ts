import assert from 'node:assert/strict'
import { test } from 'node:test'
import { ATELIER_SPOTS } from '../../../../../../packages/core/src/rooms/spots.ts'
import { COLLECTIONS } from './atelier-layout.ts'

test('every painting frame in the fashion rooms is a studio spot, and nothing else is', () => {
  const frames = COLLECTIONS.flatMap((room) => [
    ...(room.left.framed ? [] : [`${room.key}.left`]),
    `${room.key}.right`,
  ])
  assert.deepEqual(frames.sort(), ATELIER_SPOTS.map((spot) => spot.id).sort())
})
