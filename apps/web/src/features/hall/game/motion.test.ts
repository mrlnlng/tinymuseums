import assert from 'node:assert/strict'
import { test } from 'node:test'
import { MOTION, prefersReducedMotion, tween } from './motion.ts'

test('prefersReducedMotion is false without a window', () => {
  assert.equal(prefersReducedMotion(), false)
})

test('tween merges the preset and forwards the props', () => {
  const calls: unknown[] = []
  const scene = {
    tweens: {
      add: (config: unknown) => {
        calls.push(config)
        return 'tween'
      },
    },
  }
  const target = { alpha: 0 }

  const result = tween(scene as never, target, MOTION.quick, { alpha: 1 })

  assert.equal(result, 'tween')
  assert.deepEqual(calls[0], {
    targets: target,
    duration: 180,
    ease: 'Sine.easeOut',
    alpha: 1,
  })
})

test('tween applies props instantly under reduced motion', () => {
  const holder = globalThis as { window?: unknown }
  const previous = holder.window
  holder.window = { matchMedia: () => ({ matches: true }) }

  try {
    const target = { alpha: 0, y: 10 }
    let completed = 0
    const scene = {
      tweens: {
        add: () => assert.fail('must not create a tween'),
      },
    }

    const result = tween(scene as never, target, MOTION.pop, {
      alpha: 1,
      y: 4,
      onComplete: () => {
        completed += 1
      },
    })

    assert.equal(result, null)
    assert.equal(target.alpha, 1)
    assert.equal(target.y, 4)
    assert.equal(completed, 1)
  } finally {
    if (previous === undefined) delete holder.window
    else holder.window = previous
  }
})
