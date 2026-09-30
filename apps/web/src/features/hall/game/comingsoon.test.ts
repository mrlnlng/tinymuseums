import assert from 'node:assert/strict'
import { test } from 'node:test'
import { CONFIG } from '../scene/config.ts'
import { comingSoonWidth } from '../scene/layout.ts'
import { comingSoonGeometry } from './comingsoon.ts'

const comingSoon = { key: 'scenery', frame: 'coming-soon', aspect: 736 / 1040 }
const rope = { key: 'entrance', frame: 'rope', aspect: 472 / 380 }

function near(actual: number, expected: number): void {
  assert.ok(Math.abs(actual - expected) < 1e-9, `${actual} != ${expected}`)
}

test('coming soon board hangs on the display bottom at the assigned x', () => {
  const x = 42
  const g = comingSoonGeometry(x, { comingSoon, rope })
  const width = CONFIG.comingSoon.canvas.w * CONFIG.piece.scale
  const height = width / comingSoon.aspect
  assert.equal(width, comingSoonWidth())
  assert.equal(g.board.width, width)
  assert.equal(g.board.height, height)
  assert.equal(g.board.x, x)
  assert.equal(g.board.y, CONFIG.displayBottomY + height / 2)
  assert.equal(g.board.z, 0)
  assert.equal(g.board.frame, 'coming-soon')
})

test('coming soon ropes span the board and show the Three cuts', () => {
  const x = 42
  const g = comingSoonGeometry(x, { comingSoon, rope })
  const widths = g.ropes.map((p) => p.width)
  assert.ok(Math.abs(widths.reduce((a, b) => a + b, 0) - g.board.width) < 1e-9)
  assert.deepEqual(g.ropes.map((p) => p.frame), ['rope~0~0.24', 'rope~0.24~0.78', 'rope~0.78~1'])
  const total = widths.reduce((a, b) => a + b, 0)
  near(g.ropes[0].x - widths[0] / 2, x - total / 2)
  near(g.ropes[2].x + widths[2] / 2, x + total / 2)
  near(g.ropes[0].x + widths[0] / 2, g.ropes[1].x - widths[1] / 2)
  near(g.ropes[1].x + widths[1] / 2, g.ropes[2].x - widths[2] / 2)
  for (const p of g.ropes) {
    assert.equal(p.y, CONFIG.rope.centerY)
    assert.equal(p.z, CONFIG.rope.z)
    assert.equal(p.height, CONFIG.rope.height)
  }
})

test('coming soon note mark copies the overlay anchor', () => {
  const x = 42
  const g = comingSoonGeometry(x, { comingSoon, rope })
  assert.deepEqual(g.noteMark, {
    x: x + CONFIG.comingSoon.note.dx,
    y: CONFIG.comingSoon.note.centerY,
    width: CONFIG.comingSoon.note.width,
  })
})
