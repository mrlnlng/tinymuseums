import assert from 'node:assert/strict'
import { test } from 'node:test'
import { CONFIG } from './config.ts'
import { FLOOR_FEET, atelierFlight, atelierSteps, lobbyFlight, lobbySteps } from './flights.ts'

test('the lobby flight rises rightwards to its post left of the door', () => {
  const doorLeft = CONFIG.lobby.door.x - 1.03
  assert.ok(CONFIG.stairs.lobby.postX < doorLeft)
  assert.ok(lobbyFlight.left < lobbySteps[0].x && lobbySteps[0].x < lobbySteps[1].x && lobbySteps[1].x < lobbySteps[2].x)
})

test('the lobby hops start on the floor and climb a step each', () => {
  assert.equal(lobbySteps[0].feet, FLOOR_FEET)
  assert.ok(lobbySteps[1].feet > lobbySteps[0].feet + 0.2)
  assert.ok(lobbySteps[2].feet > lobbySteps[1].feet + 0.2)
})

test('upstairs the hops go down and left from the landing, which ends at the stairwell edge', () => {
  const flight = atelierFlight(-1, -0.25)
  const steps = atelierSteps(flight)
  assert.equal(steps[0].feet, FLOOR_FEET)
  assert.ok(steps[0].x < -1 && steps[1].x < steps[0].x && steps[2].x < steps[1].x)
  assert.ok(steps[1].feet < steps[0].feet && steps[2].feet < steps[1].feet)
})
