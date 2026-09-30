import assert from 'node:assert/strict'
import { test } from 'node:test'
import { CONFIG } from '../scene/config.ts'
import { giftShopGeometry } from './giftshop.ts'

const counter = { key: 'scenery', frame: 'gift-shop', aspect: 1104 / 836 }
const plaque = { key: 'entrance', frame: 'plaque', aspect: 811 / 400 }

function near(actual: number, expected: number): void {
  assert.ok(Math.abs(actual - expected) < 1e-9, `${actual} != ${expected}`)
}

test('gift shop counter and note reuse the Three widths', () => {
  const x = 30
  const g = giftShopGeometry(x, { counter, plaque })
  assert.equal(g.counter.width, CONFIG.giftShop.counter.height * counter.aspect)
  assert.equal(g.counter.height, CONFIG.giftShop.counter.height)
  assert.equal(g.counter.x, x + CONFIG.giftShop.counter.dx)
  assert.equal(g.counter.y, CONFIG.giftShop.counter.centerY)
  assert.equal(g.counter.z, CONFIG.giftShop.counter.z)
  assert.equal(g.note.width, CONFIG.giftShop.note.width)
  assert.equal(g.note.height, CONFIG.giftShop.note.height)
  assert.equal(g.note.x, x + CONFIG.giftShop.note.dx)
  assert.equal(g.note.y, CONFIG.giftShop.note.centerY)
})

test('gift shop sign stretches to the configured width with sliced plaque frames', () => {
  const x = 30
  const { sign } = CONFIG.giftShop
  const g = giftShopGeometry(x, { counter, plaque })
  const widths = g.signPlanes.map((p) => p.width)
  assert.ok(Math.abs(widths.reduce((a, b) => a + b, 0) - sign.width) < 1e-9)
  assert.deepEqual(g.signPlanes.map((p) => p.frame), [
    'plaque~0~0.28',
    'plaque~0.28~0.72',
    'plaque~0.72~1',
  ])
  near(g.signPlanes[1].x, x + sign.dx)
  near(g.signPlanes[0].x, x + sign.dx - (sign.width - widths[0]) / 2)
  near(g.signPlanes[2].x, x + sign.dx + (sign.width - widths[2]) / 2)
  for (const p of g.signPlanes) {
    assert.equal(p.y, sign.centerY)
    assert.equal(p.z, sign.z)
    assert.equal(p.height, sign.height)
  }
})

test('gift shop marks copy the overlay anchors', () => {
  const x = 30
  const { noteText, signText, button } = CONFIG.giftShop
  const g = giftShopGeometry(x, { counter, plaque })
  assert.deepEqual(g.marks.note, { x: x + noteText.dx, y: noteText.centerY, width: noteText.width })
  assert.deepEqual(g.marks.sign, { x: x + signText.dx, y: signText.centerY, width: signText.width })
  assert.deepEqual(g.marks.button, {
    x: x + button.dx,
    y: button.centerY,
    width: button.width,
    height: button.height,
  })
})
