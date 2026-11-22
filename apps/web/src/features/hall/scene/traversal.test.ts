import assert from 'node:assert/strict'
import { test } from 'node:test'
import { Traversal } from './traversal.ts'
import { CONFIG } from './config.ts'

const DT = 1 / 120

function fixture(direction = 1) {
  const listeners = new Map<string, (event: unknown) => void>()
  Object.assign(globalThis, {
    Element: class {},
    document: { querySelector: () => null },
    window: {
      addEventListener: (name: string, listener: (event: unknown) => void) => listeners.set(name, listener),
      removeEventListener: () => {},
    },
  })
  const traversal = new Traversal()
  traversal.attach({ addEventListener() {} } as unknown as HTMLElement)
  const key = (name: string, down = true) => listeners.get(down ? 'keydown' : 'keyup')!({
    key: name, repeat: false, target: null, preventDefault() {},
  })
  const tick = (seconds: number) => {
    for (let i = 0; i < Math.ceil(seconds / DT); i++) traversal.update(DT, -1000, 1000)
  }
  if (direction) key(direction > 0 ? 'ArrowRight' : 'ArrowLeft')
  tick(0.3)
  return { traversal, key, tick }
}

function jump(traversal: Traversal, mash = false, externalVelocity?: number) {
  const startX = traversal.x
  let peak = 0
  let flip = 0
  let launches = 0
  assert.ok(traversal.jump())
  for (let frame = 0; frame < 240; frame++) {
    traversal.update(DT, -1000, 1000, externalVelocity)
    if (traversal.takeJump()) launches++
    peak = Math.max(peak, traversal.height)
    const angle = traversal.jumpPose.flip ?? 0
    if (Math.abs(angle) > Math.abs(flip)) flip = angle
    if (launches && !traversal.isAirborne) {
      assert.equal(traversal.jumpPose.flip, 0)
      assert.equal(traversal.jumpSpeedMultiplier, 1)
      return { peak, flip, distance: Math.abs(traversal.x - startX), launches }
    }
    if (mash && traversal.isAirborne) assert.equal(traversal.jump(), false)
  }
  throw new Error('jump did not land')
}

test('the fourth moving jump is higher, travels farther, flips once and resets for the fifth', () => {
  for (const direction of [1, -1]) {
    const { traversal } = fixture(direction)
    const jumps = Array.from({ length: 5 }, () => jump(traversal))
    for (const index of [0, 1, 2, 4]) assert.equal(jumps[index].flip, 0)
    assert.ok(jumps[3].peak > jumps[0].peak * 1.25)
    assert.ok(jumps[3].distance > jumps[0].distance * 1.2)
    assert.ok(jumps[3].flip * direction > 350 && jumps[3].flip * direction < 360)
    assert.ok(Math.abs(jumps[4].peak - jumps[0].peak) < 0.01)
  }
})

test('stationary hops and repeated airborne presses cannot build a flip chain', () => {
  const standing = fixture(0)
  for (let i = 0; i < 5; i++) assert.equal(jump(standing.traversal).flip, 0)
  const moving = fixture()
  for (let i = 0; i < 3; i++) {
    const result = jump(moving.traversal, true)
    assert.equal(result.launches, 1)
    assert.equal(result.flip, 0)
  }
  assert.ok(jump(moving.traversal, true).flip > 350)
})

test('stopping, turning, waiting, suspension and room changes break the chain', () => {
  for (const interrupt of ['stop', 'turn', 'wait', 'suspend', 'reset']) {
    const { traversal, key, tick } = fixture()
    for (let i = 0; i < 3; i++) jump(traversal)
    if (interrupt === 'stop' || interrupt === 'turn') {
      key('ArrowRight', false)
      if (interrupt === 'turn') key('ArrowLeft')
      tick(0.5)
      if (interrupt === 'stop') key('ArrowRight')
    } else if (interrupt === 'wait') tick(CONFIG.jump.combo.windowSeconds + 0.1)
    else if (interrupt === 'suspend') {
      traversal.setSuspended(true)
      tick(0.1)
      traversal.setSuspended(false)
      key('ArrowRight')
    } else traversal.reset(0)
    tick(0.3)
    assert.equal(jump(traversal).flip, 0, interrupt)
  }
})

test('a boosted jump still respects walking bounds', () => {
  const { traversal } = fixture()
  for (let i = 0; i < 3; i++) jump(traversal)
  const end = traversal.x + 0.2
  traversal.jump()
  for (let i = 0; i < 160; i++) {
    traversal.update(DT, -1000, end)
    assert.ok(traversal.x <= end)
  }
})

test('depth-room movement can build the same chain using its own walking speed', () => {
  const { traversal } = fixture(0)
  for (let i = 0; i < 3; i++) assert.equal(jump(traversal, false, 2).flip, 0)
  assert.ok(jump(traversal, false, 2).flip > 350)
})

test('tapping or dragging to walk is as fast as walking with the keys', () => {
  // Measured mid-walk: the leash first brings a far bunny within reach, and it eases into its stop.
  const cruise = (traversal: Traversal, tick: (seconds: number) => void) => {
    tick(0.2)
    const from = traversal.x
    tick(0.4)
    return Math.abs(traversal.x - from) / 0.4
  }
  const keys = fixture(1)
  const byKeys = cruise(keys.traversal, keys.tick)
  const tapped = fixture(0)
  tapped.traversal.cameraX = 40
  const byTap = cruise(tapped.traversal, tapped.tick)
  assert.ok(Math.abs(byKeys - CONFIG.move.walkSpeed) < 0.05, `keys walk at ${byKeys}`)
  assert.ok(Math.abs(byTap - byKeys) < 0.05, `taps walk at ${byTap}, keys at ${byKeys}`)
})

test('four sideways flick-hops in a row walk the bunny and flip on the fourth, then it stops', () => {
  const { traversal, tick } = fixture(0)
  const startX = traversal.x
  let flip = 0
  for (let hop = 0; hop < 4; hop++) {
    assert.ok(traversal.hop(1), `hop ${hop + 1} should be allowed`)
    let launched = false
    for (let frame = 0; frame < 240; frame++) {
      traversal.update(DT, -1000, 1000)
      if (traversal.takeJump()) launched = true
      if (hop === 3) flip = Math.max(flip, Math.abs(traversal.jumpPose.flip ?? 0))
      if (launched && !traversal.isAirborne) break
    }
    tick(0.15)
  }
  assert.ok(flip > 300, `the fourth hop flips (turned ${flip.toFixed(0)}°)`)
  assert.ok(traversal.x - startX > 2, 'the hops carried the bunny along')
  tick(1.5)
  const resting = traversal.x
  tick(0.5)
  assert.ok(Math.abs(traversal.x - resting) < 0.01, 'with no more flicks the bunny stops, like a released key')
})

test('a straight-up flick hops in place', () => {
  const { traversal, tick } = fixture(0)
  const startX = traversal.x
  assert.ok(traversal.hop(0))
  tick(1)
  assert.ok(Math.abs(traversal.x - startX) < 0.01)
})
