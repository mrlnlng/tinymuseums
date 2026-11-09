import assert from 'node:assert/strict'
import { test } from 'node:test'
import layout from '../../../../public/assets/pond/layout.json' with { type: 'json' }
import { landingForPower } from '../../pondgame/lib/machine.ts'
import { contains } from '../floor.ts'
import { depthAtLift } from './depth.ts'
import { pondFloor, toFloor } from './walk.ts'

const water = { outline: layout.water.map(([x, y]) => ({ x, d: y })) }

test('every cast power lands inside the new water on both fishing layouts', () => {
  for (const narrow of [false, true]) for (let power = 0; power <= 100; power++) {
    const at = landingForPower(power / 100, narrow)
    assert.ok(contains(water, { x: at.x, d: at.y }), `${narrow ? 'phone' : 'wide'} cast ${power}`)
  }
})

test('the walkable grass never overlaps the water shown in the fishing view', () => {
  const width = 8 * layout.scene.width / layout.scene.height
  const floor = pondFloor(width, -5.6, 13, -4.35)
  for (let x = 0.2; x <= 0.82; x += 0.01) for (let y = 0.67; y <= 0.86; y += 0.01) {
    if (!contains(water, { x, d: y })) continue
    const depth = depthAtLift((layout.scene.feet - y) * 8)
    assert.ok(!contains(floor, toFloor(x * width, depth)), `water at ${x}, ${y} must be blocked`)
  }
})

test('the authored lily and splash positions belong to the water and all overlays fit the canvas', () => {
  for (const name of ['lily', 'splash', 'sparkles'] as const) {
    const box = layout[name]
    assert.ok(box.x >= 0 && box.y >= 0 && box.x + box.w <= 1 && box.y + box.h <= 1)
    if (name !== 'sparkles') assert.ok(contains(water, { x: box.x + box.w / 2, d: box.y + box.h * 0.86 }), name)
  }
})
