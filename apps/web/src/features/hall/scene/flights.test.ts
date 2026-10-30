import assert from 'node:assert/strict'
import { test } from 'node:test'
import { CONFIG } from './config.ts'
import { FLOOR_FEET, atelierFlight, climbSpan, feetOn, lobbyFlight, stairX } from './flights.ts'

const upstairs = atelierFlight(0)

test('a climb leaves the lobby floor and reaches the atelier floor at standing height', () => {
  assert.ok(Math.abs(feetOn(lobbyFlight, climbSpan(lobbyFlight).from) - FLOOR_FEET) < 1e-6)
  assert.ok(Math.abs(feetOn(upstairs, climbSpan(upstairs).to) - FLOOR_FEET) < 1e-6)
})

test('the feet never jump between neighbouring points on either flight', () => {
  for (const flight of [lobbyFlight, upstairs]) {
    const { from, to } = climbSpan(flight)
    let last = feetOn(flight, from)
    for (let x = from; x <= to; x += 0.01) {
      const feet = feetOn(flight, x)
      assert.ok(Math.abs(feet - last) < 0.06, `jump of ${(feet - last).toFixed(3)} at ${x.toFixed(2)}`)
      last = feet
    }
  }
})

test('climbing never goes down before the landing', () => {
  const landing = stairX(lobbyFlight, CONFIG.stairs.landing.x)
  let last = -Infinity
  for (let x = climbSpan(lobbyFlight).from; x <= landing; x += 0.01) {
    const feet = feetOn(lobbyFlight, x)
    assert.ok(feet >= last - 1e-9, `dips at ${x.toFixed(2)}`)
    last = feet
  }
})
