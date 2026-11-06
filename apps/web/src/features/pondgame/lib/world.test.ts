import assert from 'node:assert/strict'
import { test } from 'node:test'
import { contains } from '../../rooms/floor.ts'
import {
  castSpot,
  createPondWorld,
  POND_AREA,
  POND_CENTRE,
  POND_PLAYER_START,
  POND_RADIUS_D,
  POND_RADIUS_X,
  POND_RIM_D,
  POND_RIM_X,
  CAST_INTO,
  POND_VIEW,
  step,
  walkTo,
  WALK_SPEED,
} from './world.ts'

test('the pond walks around a deep hole in a wide meadow', () => {
  assert.equal(POND_AREA.outline.length, 4)
  assert.equal(POND_AREA.holes?.length, 1)
  assert.equal(POND_AREA.holes?.[0].length, 20)
  assert.equal(contains(POND_AREA, POND_CENTRE), false)
  assert.equal(contains(POND_AREA, { x: 1, d: 1 }), true)
  assert.equal(contains(POND_AREA, { x: 12, d: 4 }), true)
  assert.equal(contains(POND_AREA, { x: 13, d: 2 }), false)
  assert.equal(contains(POND_AREA, { x: 6, d: 2.1 + POND_RADIUS_D }), false)
  assert.equal(contains(POND_AREA, { x: 6, d: 2.1 + POND_RADIUS_D + POND_RIM_D + 0.02 }), true)
  assert.equal(contains(POND_AREA, { x: 6 + POND_RADIUS_X + POND_RIM_X + 0.02, d: 2.1 }), true)
  assert.equal(contains(POND_AREA, { x: 6, d: 2.1 }), false)
  assert.deepEqual(POND_VIEW, { depth: 4, nearY: 0.3, farY: 5.2, farScale: 0.55 })
  assert.equal(contains(POND_AREA, POND_PLAYER_START), true)
})

test('castSpot only reaches the edge and lands inside the water', () => {
  const rimBack = 2.1 + POND_RADIUS_D + POND_RIM_D
  const bottom = castSpot({ x: 6, d: rimBack + 0.25 })
  assert.ok(bottom)
  assert.ok(Math.abs(bottom.x - 6) < 0.02)
  assert.ok(bottom.d < 2.1 + POND_RADIUS_D && bottom.d > 2.1 - POND_RADIUS_D)
  assert.ok(Math.abs(Math.hypot(bottom.x - 6, bottom.d - rimBack) - CAST_INTO) < 0.05)

  const rimFront = 2.1 - POND_RADIUS_D - POND_RIM_D
  const top = castSpot({ x: 6, d: rimFront - 0.25 })
  assert.ok(top)
  assert.ok(top.d > rimFront)

  assert.equal(castSpot({ x: 6, d: rimFront - 0.6 }), null)
  assert.equal(castSpot({ x: 1, d: 1 }), null)
  assert.equal(castSpot({ x: 0.4, d: 0.4 }), null)
})

test('step walks at a steady speed and keeps the bunny on the meadow', () => {
  const start = createPondWorld({ x: 1, d: 1 })
  const moved = step(start, { dx: 1, dd: 0 }, 1)
  assert.ok(Math.abs(moved.player.x - (1 + WALK_SPEED)) < 1e-9)
  assert.equal(moved.facing, 'right')
  assert.equal(moved.moving, true)
  assert.ok(contains(POND_AREA, moved.player))

  const diagonal = step(start, { dx: 1, dd: 1 }, 1)
  assert.ok(Math.hypot(diagonal.player.x - start.player.x, diagonal.player.d - start.player.d) <= WALK_SPEED + 1e-9)

  let pushed = createPondWorld({ x: 11.5, d: 2 })
  for (let i = 0; i < 20; i++) pushed = step(pushed, { dx: 1, dd: 0 }, 0.5)
  assert.ok(contains(POND_AREA, pushed.player))
  assert.ok(pushed.player.x <= 12)
})

test('a tap route follows findPath around the pond and manual input cancels it', () => {
  let world = createPondWorld({ x: 1, d: 2 })
  world = walkTo(world, { x: 11, d: 2 })
  assert.ok(world.path.length > 0)
  assert.equal(world.moving, true)

  let guard = 0
  while (world.path.length > 0 && guard++ < 1000) {
    world = step(world, { dx: 0, dd: 0 }, 0.1)
    assert.ok(contains(POND_AREA, world.player))
  }
  assert.ok(guard < 1000)
  assert.ok(Math.hypot(world.player.x - 11, world.player.d - 2) < 0.2)

  let rerouted = walkTo(createPondWorld({ x: 1, d: 2 }), { x: 11, d: 2 })
  rerouted = step(rerouted, { dx: -1, dd: 0 }, 0.1)
  assert.deepEqual(rerouted.path, [])
  assert.equal(rerouted.facing, 'left')
})
