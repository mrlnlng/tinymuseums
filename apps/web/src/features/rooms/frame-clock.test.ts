import assert from 'node:assert/strict'
import { test } from 'node:test'
import { Traversal } from '../hall/scene/traversal.ts'
import { movementSteps, shouldTick } from './frame-clock.ts'

test('a resting stage ticks at about 30Hz on any display, and never halves a slow one', () => {
  const ticksPerSecond = (frameMs: number, resting: boolean) => {
    let ticks = 0
    let lastTick = 0
    for (let frame = 1; frame * frameMs <= 1000 + 1e-6; frame++) {
      const now = frame * frameMs
      if (shouldTick(resting, now - lastTick, frameMs)) {
        ticks++
        lastTick = now
      }
    }
    return ticks
  }
  assert.equal(ticksPerSecond(1000 / 60, false), 60)
  assert.ok(Math.abs(ticksPerSecond(1000 / 60, true) - 30) <= 1)
  assert.ok(Math.abs(ticksPerSecond(1000 / 120, true) - 30) <= 1)
  assert.equal(ticksPerSecond(1000 / 30, true), 30)
  assert.equal(ticksPerSecond(1000 / 40, true), 40)
})

test('waking (input, a page opening) runs the very next frame', () => {
  assert.equal(shouldTick(false, 1, 16.7), true)
})

test('slow frames are moved in short steps; a pause is not caught up', () => {
  assert.deepEqual(movementSteps(0.15), { count: 3, dt: 0.15 / 3 })
  assert.deepEqual(movementSteps(1 / 60), { count: 1, dt: 1 / 60 })
  assert.deepEqual(movementSteps(5), { count: 1, dt: 0.05 })
  assert.deepEqual(movementSteps(0), { count: 1, dt: 0 })
})

function walker() {
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
  const key = (name: string, down = true) =>
    listeners.get(down ? 'keydown' : 'keyup')!({ key: name, repeat: false, target: null, preventDefault() {} })
  let floorMax = 1000
  /** Frames of `frameMs` for `seconds`, moved as the stage moves them. */
  const run = (frameMs: number, seconds: number) => {
    for (let t = 0; t < seconds * 1000 - 1e-6; t += frameMs) {
      const steps = movementSteps(frameMs / 1000)
      for (let i = 0; i < steps.count; i++) traversal.update(steps.dt, -1000, floorMax)
    }
  }
  return { traversal, key, run, setWall: (x: number) => (floorMax = x) }
}

test('eight seconds of walking covers the same ground at 60, 30, 20 and 7 frames a second', () => {
  const distance = (frameMs: number) => {
    const { traversal, key, run } = walker()
    key('ArrowRight')
    run(frameMs, 8)
    return traversal.x
  }
  const reference = distance(1000 / 60)
  assert.ok(reference > 5)
  for (const frameMs of [1000 / 30, 50, 150]) {
    // Within 3%: speed ramps up over the first frames, which slower frames sample more coarsely.
    assert.ok(Math.abs(distance(frameMs) - reference) / reference < 0.03, `${frameMs}ms covered ${distance(frameMs)} vs ${reference}`)
  }
})

test('a pause is not replayed as a leap, and walls still stop the visitor', () => {
  const { traversal, key, run, setWall } = walker()
  key('ArrowRight')
  run(150, 1)
  const before = traversal.x
  const steps = movementSteps(5)
  traversal.update(steps.dt, -1000, 1000)
  key('ArrowRight', false)
  assert.ok(traversal.x - before < 0.5)
  const wall = traversal.x + 1
  setWall(wall)
  key('ArrowRight')
  run(150, 4)
  assert.ok(traversal.x <= wall)
})
