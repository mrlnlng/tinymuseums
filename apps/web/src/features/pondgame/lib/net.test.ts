import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  NET_COOLDOWN_MS,
  NET_SHADOWS,
  SCOOP_REACH,
  SCOOP_SPOT,
  netShadowHits,
  netShadowPoint,
  scoopHit,
} from './net.ts'

test('a shadow over the scoop spot is a hit and one outside it is not', () => {
  const spot = SCOOP_SPOT
  assert.equal(netShadowHits(spot), true)
  assert.equal(netShadowHits({ x: spot.x + SCOOP_REACH.x - 0.001, y: spot.y }), true)
  assert.equal(netShadowHits({ x: spot.x + SCOOP_REACH.x + 0.001, y: spot.y }), false)
  assert.equal(netShadowHits({ x: spot.x, y: spot.y + SCOOP_REACH.y + 0.001 }), false)
})

test('the shadows drift across the spot on a slow, repeatable loop', () => {
  for (const spec of NET_SHADOWS) {
    let near = false
    for (let step = 0; step <= 1000; step += 1) {
      const point = netShadowPoint(spec, (step / 1000) * spec.period)
      if (Math.abs(point.x - SCOOP_SPOT.x) <= 0.002) near = true
    }
    assert.ok(near, `shadow ${spec.id} should pass the scoop spot`)
  }
})

test('the opening moment has one catchable shadow and the rest are away', () => {
  assert.equal(scoopHit(0), 0)
})

test('the client waits at least as long as the server between scoops', () => {
  assert.equal(NET_COOLDOWN_MS, 2500)
})
