import assert from 'node:assert/strict'
import { test } from 'node:test'
import { CONFIG } from '../scene/config.ts'
import { computeLayout } from '../scene/layout.ts'
import { displayGeometry, pieceSize, ropeRects } from './world.ts'
import { pedestalGeometry } from './pedestal.ts'
import { coinGeometry } from './coin.ts'

const PLAQUE_ASPECT = 1.4
const ROPE_ASPECT = 6.5

test('pieceSize scales the canvas by the piece scale', () => {
  assert.deepEqual(pieceSize({ w: 0.8, h: 1.2 }), {
    width: 0.8 * CONFIG.piece.scale,
    height: 1.2 * CONFIG.piece.scale,
  })
})

test('displayGeometry lays the painting, plaque and marks out as the Three module does', () => {
  const geometry = displayGeometry(3, { w: 1, h: 0.75 }, 12.5, PLAQUE_ASPECT, ROPE_ASPECT)
  const height = 0.75 * CONFIG.piece.scale
  const plaqueHeight = CONFIG.plaque.width / PLAQUE_ASPECT

  assert.equal(geometry.painting.x, 12.5)
  assert.equal(geometry.painting.y, CONFIG.displayBottomY + height / 2)
  assert.equal(geometry.painting.width, CONFIG.piece.scale)
  assert.equal(geometry.painting.height, height)
  assert.equal(geometry.painting.z, 0)
  assert.equal(geometry.plaque.y, CONFIG.displayBottomY - CONFIG.plaque.gap - plaqueHeight / 2)
  assert.equal(geometry.plaque.z, CONFIG.plaque.z)
  assert.equal(geometry.plaque.height, plaqueHeight)
  assert.equal(geometry.titleY, CONFIG.displayBottomY + height + CONFIG.displayTitleGap)
})

test('ropeRects keeps the end slices natural and stretches the middle to the span', () => {
  const span = 4
  const natural = CONFIG.rope.height * ROPE_ASPECT
  const rects = ropeRects(ROPE_ASPECT, span, 7)

  assert.equal(rects.length, 3)
  assert.equal(rects[0].width, (0.24 - 0) * natural)
  assert.equal(rects[2].width, (1 - 0.78) * natural)
  assert.equal(rects[1].width, Math.max((0.78 - 0.24) * natural, span - rects[0].width - rects[2].width))
  assert.equal(rects[0].height, CONFIG.rope.height)
  assert.equal(rects[0].y, CONFIG.rope.centerY)
  assert.equal(rects[0].z, CONFIG.rope.z)

  const total = rects[0].width + rects[1].width + rects[2].width
  assert.ok(Math.abs(rects[0].x - (7 - total / 2 + rects[0].width / 2)) < 1e-9)
  assert.ok(Math.abs(rects[2].x - (7 + total / 2 - rects[2].width / 2)) < 1e-9)
})

test('coinGeometry mirrors the frame, rope and pedestal placements', () => {
  const wall = {
    index: 1,
    centerX: 10,
    width: 2,
    height: 1.5,
    bottom: CONFIG.displayBottomY,
    pedestalDx: 1.1,
  }
  const spec = CONFIG.coin
  const aspect = 0.8

  const frameRight = coinGeometry(wall, 'frame', 1, aspect)
  const marginRight = spec.frame.margin[1] * wall.width
  const hidden = (1 - spec.frame.peek) * spec.width
  assert.equal(frameRight.x, 10 + (wall.width / 2 - marginRight - hidden + spec.width / 2))
  assert.equal(frameRight.y, wall.bottom + wall.height * spec.frame.heightRatio)
  assert.equal(frameRight.z, spec.frame.z)
  assert.equal(frameRight.height, spec.width / aspect)

  const frameLeft = coinGeometry(wall, 'frame', -1, aspect)
  const marginLeft = spec.frame.margin[0] * wall.width
  assert.equal(frameLeft.x, 10 - (wall.width / 2 - marginLeft - hidden + spec.width / 2))

  const rope = coinGeometry(wall, 'rope', 1, aspect)
  assert.equal(rope.x, 10 + (wall.width / 2 - spec.rope.inset))
  assert.equal(rope.y, spec.rope.y)
  assert.equal(rope.z, spec.rope.z)
  assert.equal(rope.width, spec.rope.width)

  const pedestal = coinGeometry(wall, 'pedestal', -1, aspect)
  assert.equal(pedestal.x, 10 + wall.pedestalDx - spec.pedestal.dx)
  assert.equal(pedestal.y, spec.pedestal.y)
  assert.equal(pedestal.z, spec.pedestal.z)

  const fallback = coinGeometry({ ...wall, pedestalDx: null }, 'pedestal', 1, aspect)
  assert.deepEqual(fallback, coinGeometry({ ...wall, pedestalDx: null }, 'frame', 1, aspect))
})

test('pedestalGeometry sizes the sprite and only voices get notes', () => {
  const sprite = pedestalGeometry('pedestal-2.png', 0.58, 3, 1.2)
  assert.equal(sprite.sprite.x, 3)
  assert.equal(sprite.sprite.y, CONFIG.pedestal.centerY)
  assert.equal(sprite.sprite.width, CONFIG.pedestal.height * 0.58)
  assert.equal(sprite.sprite.height, CONFIG.pedestal.height)
  assert.equal(sprite.sprite.z, CONFIG.pedestal.z)
  assert.equal(sprite.voice, null)
  assert.equal(sprite.notes, null)
  assert.equal(sprite.holdsHelm, false)

  const owl = pedestalGeometry('pedestal-1.png', 0.62, 3, 1.2)
  assert.equal(owl.voice, 'owl')
  assert.equal(owl.notes?.width, CONFIG.pedestal.notes.width)
  assert.equal(owl.notes?.height, CONFIG.pedestal.notes.width / 1.2)
  assert.equal(owl.notes?.z, CONFIG.pedestal.z + CONFIG.pedestal.notes.z)

  const helm = pedestalGeometry('pedestal-4.png', 0.64, 3, 1.2)
  assert.equal(helm.holdsHelm, true)
})

test('layout places displays and pedestals from the same widths the world uses', () => {
  const widths = [1.0, 1.4, 0.8]
  const layout = computeLayout(widths, false)
  const first = displayGeometry(0, { w: 1, h: 1 }, layout.centerX[0], PLAQUE_ASPECT, ROPE_ASPECT)
  assert.equal(first.painting.x, CONFIG.lobby.length + widths[0] / 2)
  assert.equal(layout.known, 3)
})
