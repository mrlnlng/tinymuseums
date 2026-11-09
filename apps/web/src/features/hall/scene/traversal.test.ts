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
