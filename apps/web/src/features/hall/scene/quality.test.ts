import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createPixelRatioGovernor, pixelRatioSteps } from './quality.ts'

function governor(devicePixelRatio = 3) {
  const set: number[] = []
  const g = createPixelRatioGovernor({ setPixelRatio: (ratio) => set.push(ratio) }, devicePixelRatio)
  const run = (frameMs: number, frames: number, settled = true) => {
    for (let i = 0; i < frames; i++) g.sample(frameMs, settled)
  }
  return { g, set, run }
}

test('a device holding its budget, or a steady 30fps cap, keeps full resolution', () => {
  for (const ms of [16.7, 33.3]) {
    const { g, set, run } = governor()
    run(ms, 600)
    assert.equal(g.ratio, 3)
    assert.deepEqual(set, [3])
  }
})

test('every frame far too slow steps down promptly, all the way to 1', () => {
  const { g, set, run } = governor()
  run(150, 15)
  assert.ok(g.ratio < 3, 'one short run of slow frames is enough')
  assert.ok(g.ratio <= 1.5, 'the first step aims for the frame budget, not one notch')
  run(150, 60)
  assert.equal(g.ratio, 1)
  assert.equal(set.length, new Set(set).size, 'the canvas is resized only when the ratio changes')
})

test('moderately slow frames under the old 100ms cut-off still step down', () => {
  const { g, run } = governor()
  run(70, 30)
  assert.ok(g.ratio < 3)
})

test('one long pause, a hidden tab, or unsettled frames never count', () => {
  const pause = governor()
  pause.run(16.7, 100)
  pause.g.sample(500, true)
  pause.run(16.7, 100)
  assert.equal(pause.g.ratio, 3)

  // Slow frames broken up by resumes from a hidden tab never form a run.
  const hidden = governor()
  for (let i = 0; i < 20; i++) {
    hidden.run(150, 8)
    hidden.g.sample(5000, true)
  }
  assert.equal(hidden.g.ratio, 3)

  const early = governor()
  early.run(150, 200, false)
  assert.equal(early.g.ratio, 3)
})

test('a reset (resize, resume) forgets the frames so far', () => {
  const { g, run } = governor()
  run(150, 10)
  g.reset()
  run(150, 10)
  assert.equal(g.ratio, 3)
})

test('already at 1 stays at 1', () => {
  const { g, set, run } = governor(1)
  run(150, 200)
  assert.equal(g.ratio, 1)
  assert.deepEqual(set, [1])
})

test('fractional and zoomed device ratios start at the device ratio and only step down', () => {
  assert.deepEqual(pixelRatioSteps(2.625), [2.625, 2.5, 2, 1.5, 1.25, 1])
  assert.deepEqual(pixelRatioSteps(1.25), [1.25, 1])
  assert.deepEqual(pixelRatioSteps(4), [3, 2.5, 2, 1.5, 1.25, 1])
  assert.deepEqual(pixelRatioSteps(0.8), [0.8])
  const { g, run } = governor(0.8)
  run(150, 100)
  assert.equal(g.ratio, 0.8)
})
