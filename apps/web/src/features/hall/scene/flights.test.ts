import assert from 'node:assert/strict'
import { test } from 'node:test'
import { CONFIG } from './config.ts'
import { FLOOR_FEET, atelierFlight, atelierFloorEdge, climbSpan, feetOn, flightRise, lobbyFlight, stairX } from './flights.ts'

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
  const landing = stairX(lobbyFlight, lobbyFlight.landing!.x)
  let last = -Infinity
  for (let x = climbSpan(lobbyFlight).from; x <= landing; x += 0.01) {
    const feet = feetOn(lobbyFlight, x)
    assert.ok(feet >= last - 1e-9, `dips at ${x.toFixed(2)}`)
    last = feet
  }
})


test('the lobby stairs sit on the floor and the upstairs landing is flush with its floor', () => {
  const firstTread = lobbyFlight.base + (lobbyFlight.drawing![1] - lobbyFlight.treads![0][1]) * CONFIG.stairs.unitsPerPx * (lobbyFlight.scale ?? 1)
  assert.ok(Math.abs(firstTread) < 1e-6)
  assert.ok(Math.abs(upstairs.base + flightRise) < 1e-6)
})


test('the upstairs floor reaches the banister post and closes the landing wedge', () => {
  assert.ok(atelierFloorEdge(upstairs) <= stairX(upstairs, CONFIG.stairs.post))
  assert.ok(atelierFloorEdge(upstairs) < stairX(upstairs, CONFIG.stairs.landing.x))
  assert.equal(feetOn(upstairs, stairX(upstairs, CONFIG.stairs.landing.x)), FLOOR_FEET)
})
