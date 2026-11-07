import assert from 'node:assert/strict'
import { test } from 'node:test'
import { doorPoint, MAP_PLACES, MAP_SCALE, panTo, planMap, roomAt, type FloorSketch } from './minimap.ts'

const rooms = [
  { key: 'entrance', startX: -5, endX: 4 },
  { key: 'gallery-1', startX: 4, endX: 20 },
  { key: 'cafe', startX: 20, endX: 30 },
]

const hall: FloorSketch = {
  id: 'hall',
  rooms: [
    { key: 'entrance', tint: 'entrance', startX: -3.6, endX: 4.75 },
    { key: 'gallery-1', tint: 'gallery', startX: 4.75, endX: 20 },
    { key: 'cafe', tint: 'cafe', startX: 20, endX: 30 },
  ],
  doors: { atelier: { x: -3.6, clearX: -2.75 } },
}
const atelier = MAP_PLACES.atelier!.sketch()

test('the map names the room the visitor stands in, the next one from its first wall', () => {
  assert.equal(roomAt(rooms, 0)?.key, 'entrance')
  assert.equal(roomAt(rooms, 4)?.key, 'gallery-1')
  assert.equal(roomAt(rooms, 19.99)?.key, 'gallery-1')
  assert.equal(roomAt(rooms, 20)?.key, 'cafe')
})

test('beyond the rooms the map names the nearest end, and with none it names nothing', () => {
  assert.equal(roomAt(rooms, -9)?.key, 'entrance')
  assert.equal(roomAt(rooms, 35)?.key, 'cafe')
  assert.equal(roomAt([], 1), null)
})

test('a door meets its room in the doorway, kept clear of the corner', () => {
  const point = doorPoint(hall, 'atelier')!
  assert.ok(point > -3.6 && point < 4.75)
  assert.ok((point - -3.6) * MAP_SCALE >= 8)
  assert.equal(doorPoint(hall, 'nowhere'), null)
})

test('the fashion area sits behind the hall, its door straight across from the hall\'s', () => {
  const plan = planMap([hall, atelier])
  assert.ok(plan.rowY.get('atelier')! < plan.rowY.get('hall')!)
  const hallDoor = (doorPoint(hall, 'atelier')! + plan.offsets.get('hall')!) * MAP_SCALE
  const atelierDoor = (doorPoint(atelier, 'gallery')! + plan.offsets.get('atelier')!) * MAP_SCALE
  assert.ok(Math.abs(hallDoor - atelierDoor) < 1e-6)
})

test('a passage joins the two entrances through the door, and joined rooms open into each other', () => {
  const plan = planMap([hall, atelier])
  assert.equal(plan.passages.length, 1)
  const [passage] = plan.passages
  assert.deepEqual([passage.from.place, passage.from.key, passage.to.place, passage.to.key], ['hall', 'entrance', 'atelier', 'entrance'])
  assert.equal(passage.y, passage.to.y + passage.to.h)
  assert.equal(passage.y + passage.h, passage.from.y)
  assert.equal(plan.openings.length, hall.rooms.length - 1 + atelier.rooms.length - 1)
})

test('before the hall is visited the map shows its entrance and a faint way on', () => {
  const sketch = MAP_PLACES.hall!.sketch()
  assert.equal(sketch.rooms[0].key, 'entrance')
  assert.equal(sketch.rooms[sketch.rooms.length - 1].unknown, true)
  assert.equal(planMap([sketch, atelier]).passages.length, 1)
})

test('the window follows the pin but never shows past the plan, and centres a small plan', () => {
  assert.equal(panTo(500, 200, 0, 1000, 8), -400)
  assert.equal(panTo(10, 200, 0, 1000, 8), 8)
  assert.equal(panTo(995, 200, 0, 1000, 8), -808)
  assert.equal(panTo(50, 200, 0, 100, 8), 50)
})
