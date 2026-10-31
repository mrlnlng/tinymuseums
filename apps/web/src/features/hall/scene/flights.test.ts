import assert from 'node:assert/strict'
import { test } from 'node:test'
import { CONFIG } from './config.ts'
import { FLOOR_FEET, atelierFlight, hopSteps, lobbyFlight, lobbySteps, stepBox } from './flights.ts'

test('the lobby flight rises leftwards from its foot left of the door', () => {
  assert.ok(lobbyFlight.foot < CONFIG.lobby.door.x - 1.03)
  assert.ok(stepBox(lobbyFlight, 2).top > stepBox(lobbyFlight, 1).top)
  assert.ok(stepBox(lobbyFlight, 2).right <= stepBox(lobbyFlight, 1).left + 1e-9)
})

test('each hop lands on the middle of the next step, one riser apart', () => {
  for (const [flight, steps] of [[lobbyFlight, lobbySteps], [atelierFlight(-1), hopSteps(atelierFlight(-1))]] as const) {
    assert.equal(steps[0].feet, FLOOR_FEET)
    for (const i of [1, 2]) {
      const box = stepBox(flight, i)
      assert.ok(steps[i].x > box.left && steps[i].x < box.right)
      assert.ok(Math.abs(Math.abs(steps[i].feet - steps[i - 1].feet) - CONFIG.stairs.rise) < 1e-9)
    }
  }
})

test('upstairs the steps go down into the stairwell', () => {
  const steps = hopSteps(atelierFlight(-1))
  assert.ok(steps[1].feet < steps[0].feet && steps[2].feet < steps[1].feet)
  assert.ok(steps[0].x > -1 && steps[1].x < -1)
})
