import assert from 'node:assert/strict'
import { test } from 'node:test'
import { CONFIG } from './config.ts'
import { Traversal } from './traversal.ts'

const DT = 1 / 60

test('reset puts the camera and bunny at the given x at rest', () => {
  const t = new Traversal()
  t.reset(3)
  assert.equal(t.cameraX, 3)
  assert.equal(t.x, 3)
  assert.equal(t.velocity, 0)
  assert.equal(t.walkVelocity, 0)
  assert.equal(t.isIntro, false)
  assert.equal(t.isHeld, false)
})

test('a nudge smaller than followStartDistance leaves the bunny still', () => {
  const t = new Traversal()
  t.reset(0)
  t.cameraX = CONFIG.character.followStartDistance / 2
  for (let i = 0; i < 240; i++) {
    t.update(DT, 100)
    assert.equal(t.x, 0)
    assert.equal(t.walkVelocity, 0)
  }
})

test('a nudge beyond followStartDistance walks until followStopDistance and snaps', () => {
  const t = new Traversal()
  t.reset(0)
  const target = CONFIG.character.followStartDistance * 2
  t.cameraX = target
  for (let i = 0; i < 240 && t.x !== target; i++) t.update(DT, 100)
  assert.equal(t.x, target)
  assert.equal(t.cameraX, target)
  assert.equal(t.walkVelocity, 0)
})

test('walkVelocity never exceeds the configured max speed', () => {
  const t = new Traversal()
  t.reset(0)
  t.cameraX = CONFIG.character.maxTrailDistance
  for (let i = 0; i < 600; i++) {
    t.update(DT, 100)
    assert.ok(
      t.walkVelocity <= CONFIG.move.maxSpeed + 1e-9,
      `frame ${i} walkVelocity ${t.walkVelocity}`,
    )
  }
  assert.equal(t.x, t.cameraX)
})

test('the leash caps how far the bunny trails the camera', () => {
  const t = new Traversal()
  t.reset(0)
  t.cameraX = CONFIG.character.maxTrailDistance + CONFIG.character.followStartDistance
  t.update(DT, t.cameraX + 10)
  assert.ok(Math.abs(t.cameraX - t.x - CONFIG.character.maxTrailDistance) < 1e-9)
})

test('playIntro locks input while the bunny walks to the target', () => {
  const t = new Traversal()
  t.playIntro(0, 2)
  assert.equal(t.isIntro, true)
  assert.equal(t.cameraX, 2)
  assert.equal(t.x, 0)
  t.velocity = CONFIG.move.maxScrollSpeed
  for (let i = 0; i < 240 && t.isIntro; i++) {
    t.update(DT, 100)
    if (t.isIntro) assert.equal(t.cameraX, 2)
  }
  assert.equal(t.isIntro, false)
  assert.equal(t.cameraX, 2)
  assert.equal(t.x, 2)
  assert.equal(t.walkVelocity, 0)
})

test('setSuspended stops input and walking', () => {
  const t = new Traversal()
  t.reset(0)
  t.cameraX = 2
  t.velocity = CONFIG.move.maxScrollSpeed
  t.setSuspended(true)
  assert.equal(t.velocity, 0)
  t.update(DT, 100)
  assert.equal(t.x, 0)
  assert.equal(t.walkVelocity, 0)
})

test('cameraX clamps at the hall bounds and zeroes velocity', () => {
  const t = new Traversal()
  t.reset(0)
  t.velocity = -CONFIG.move.maxScrollSpeed
  t.update(DT, 100)
  assert.equal(t.cameraX, 0)
  assert.equal(t.velocity, 0)

  const length = 50
  t.reset(length)
  t.velocity = CONFIG.move.maxScrollSpeed
  t.update(DT, length)
  assert.equal(t.cameraX, length)
  assert.equal(t.velocity, 0)
})

test('momentum decays and the camera advances while it does', () => {
  const t = new Traversal()
  t.reset(0)
  t.velocity = CONFIG.move.maxScrollSpeed
  let previous = t.velocity
  let advanced = false
  for (let i = 0; i < 600; i++) {
    t.update(DT, 1000)
    assert.ok(t.velocity <= previous + 1e-9, `frame ${i} velocity ${t.velocity}`)
    if (t.velocity > 0.01 && t.cameraX > 0) advanced = true
    previous = t.velocity
  }
  assert.ok(t.velocity >= 0 && t.velocity < 0.01, `velocity ${t.velocity}`)
  assert.ok(advanced)
})

test('idleSeconds accumulates only while fully at rest', () => {
  const t = new Traversal()
  t.reset(0)
  for (let i = 0; i < 30; i++) t.update(DT, 100)
  assert.ok(t.idleSeconds > 0)

  t.cameraX = CONFIG.character.followStartDistance * 2
  for (let i = 0; i < 5; i++) {
    t.update(DT, 100)
    assert.equal(t.idleSeconds, 0)
  }
  assert.ok(t.walkVelocity > 0)

  for (let i = 0; i < 240 && t.walkVelocity > 0; i++) t.update(DT, 100)
  t.update(DT, 100)
  assert.ok(t.idleSeconds > 0)
})

test('hold walks the bunny to the held spot and isHeld reports arrival', () => {
  const t = new Traversal()
  t.reset(0)
  t.hold(1.5)
  assert.equal(t.isHeld, false)
  for (let i = 0; i < 240 && !t.isHeld; i++) t.update(DT, 100)
  assert.equal(t.isHeld, true)
  assert.equal(t.x, 1.5)
  assert.equal(t.cameraX, 0)
  t.hold(null)
  assert.equal(t.isHeld, false)
})

test('reset does not release a hold', () => {
  const t = new Traversal()
  t.reset(0)
  t.hold(1.5)
  for (let i = 0; i < 240 && !t.isHeld; i++) t.update(DT, 100)
  assert.equal(t.isHeld, true)
  t.reset(0)
  assert.equal(t.isHeld, false)
  for (let i = 0; i < 240 && !t.isHeld; i++) t.update(DT, 100)
  assert.equal(t.isHeld, true)
  assert.equal(t.x, 1.5)
})
