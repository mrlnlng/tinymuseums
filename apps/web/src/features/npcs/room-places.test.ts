import assert from 'node:assert/strict'
import { test } from 'node:test'
import layout from '../../../public/assets/pond/layout.json' with { type: 'json' }
import type { HallLayout } from '../hall/scene/layout.ts'
import { contains } from '../rooms/floor.ts'
import { pondFloor, toFloor } from '../rooms/pond/walk.ts'
import {
  atelierRoomInfo,
  hallRoomInfo,
  personalRoomInfo,
  personalShade,
  pondRoomInfo,
  roomPlaces,
} from './room-places.ts'

test('places are clipped to the floor, sorted by x and kept deterministic', () => {
  const input = {
    minX: -3,
    maxX: 10,
    places: [
      { x: 8, kind: 'painting' as const },
      { x: -3, kind: 'door' as const, name: 'left' },
      { x: 2, kind: 'desk' as const },
      { x: 2, kind: 'board' as const },
      { x: 12, kind: 'painting' as const },
    ],
  }
  const info = roomPlaces(input)

  assert.equal(info.minX, -3)
  assert.equal(info.maxX, 10)
  assert.deepEqual(info.places.map((place) => place.x), [-3, 2, 2, 8, 9.4])
  assert.deepEqual(info.places.filter((place) => place.kind === 'door'), [{ x: -3, kind: 'door', name: 'left' }])
  assert.ok(info.places.every((place) => place.x >= info.minX && place.x <= info.maxX))
  assert.deepEqual(roomPlaces(input), info)
})

test('an end near a door is skipped, and a floor with no doors keeps both ends', () => {
  const withDoor = roomPlaces({
    minX: 0,
    maxX: 10,
    places: [{ x: 9.9, kind: 'door', name: 'right' }],
  })
  assert.deepEqual(withDoor.places.filter((place) => place.kind === 'end'), [{ x: 0.6, kind: 'end' }])

  const open = roomPlaces({ minX: 0, maxX: 10, places: [] })
  assert.deepEqual(open.places, [
    { x: 0.6, kind: 'end' },
    { x: 9.4, kind: 'end' },
  ])
})

test('the hall lists every gallery painting, its desks, boards, seat and both doors once', () => {
  const layout: HallLayout = {
    centerX: [6, 9, 14],
    pedestalX: [7.5],
    totalLength: 20,
    known: 3,
    giftShopX: 20,
    cafeX: 14.5,
    guestBoardX: 16,
    comingSoonX: null,
    rooms: [],
  }
  const info = hallRoomInfo(layout, -3.6)

  assert.equal(info.minX, -3.6)
  assert.equal(info.maxX, 20)
  for (const x of layout.centerX) assert.ok(info.places.some((place) => place.kind === 'painting' && place.x === x))
  assert.ok(info.places.some((place) => place.kind === 'plinth' && place.x === 7.5))
  assert.ok(info.places.some((place) => place.kind === 'desk' && place.x === 14.5))
  assert.ok(info.places.some((place) => place.kind === 'desk' && place.x === 20))
  assert.ok(info.places.some((place) => place.kind === 'board' && place.x === 16))
  assert.ok(info.places.some((place) => place.kind === 'seat' && place.x === 16 - 1.119))
  assert.deepEqual(
    info.places.filter((place) => place.kind === 'door').map((place) => place.name),
    ['atelier', 'entrance'],
  )
  assert.ok(info.places.every((place) => place.x >= info.minX && place.x <= info.maxX))
  assert.equal(hallRoomInfo(layout, -3.6), info)
})

test('the atelier lists its wall paintings by collection, the rail and the gallery door', () => {
  const info = atelierRoomInfo(-3.1)
  assert.ok(info.places.filter((place) => place.kind === 'painting').length >= 12)
  assert.ok(info.places.some((place) => place.kind === 'rail'))
  assert.deepEqual(info.places.filter((place) => place.kind === 'door'), [{ x: -3.1, kind: 'door', name: 'gallery' }])
  assert.ok(info.places.every((place) => place.x >= info.minX && place.x <= info.maxX))
})

test('the pond keeps its water on the bank and names its counter, boards and gate', () => {
  const sceneWidth = 8 * (layout.scene.width / layout.scene.height)
  const area = pondFloor(sceneWidth, -5.6, 13, -5.6 + 1.25)
  const info = pondRoomInfo({
    minX: -5.6,
    maxX: 13,
    doorX: -5.6,
    spots: [{ x: 3 }, { x: 6 }, { x: 9 }],
    landmarks: [
      { kind: 'exit', x: -5.6, depth: 0 },
      { kind: 'bounties', x: -2.7, standX: -1.8, depth: 0.5 },
      { kind: 'fishmonger', x: 0.6, standX: 2.25, depth: 0.5 },
      { kind: 'fishdex', x: 12.6, standX: 11.3, depth: 0.5 },
    ],
    area,
  })
  const standDepth = 0.5 * 0.86
  assert.deepEqual(info.places.filter((place) => place.kind === 'water').map((place) => place.x), [3, 6, 9])
  assert.ok(info.places.some((place) => place.kind === 'desk' && place.x === 2.25 && place.d === standDepth))
  assert.deepEqual(
    info.places.filter((place) => place.kind === 'board').map((place) => [place.x, place.d]),
    [[-1.8, standDepth], [11.3, standDepth]],
  )
  assert.deepEqual(info.places.filter((place) => place.kind === 'door'), [{ x: -5.6, kind: 'door', name: 'hall', d: 0 }])
  // Every pond place stands on the pond's own walkable ground, never in the water.
  for (const place of info.places) {
    assert.ok(
      contains(area, toFloor(place.x, place.d ?? 0)),
      `${place.kind} at ${place.x}, depth ${place.d ?? 0} is over the water`,
    )
  }
})

test('a personal room turns its named doors and furniture into places, and shades only where dim', () => {
  const doors = { hall: { x: 1 } }
  const placements = [
    { kind: 'prop', ref: 'chair', x: 3 },
    { kind: 'prop', ref: 'round-table', x: 5 },
    { kind: 'prop', ref: 'carpet', x: 4 },
    { kind: 'prop', ref: 'mirror', x: 2 },
    { kind: 'painting', ref: 'piece', x: 6 },
  ]
  const info = personalRoomInfo({ doors, placements, minX: 0.6, maxX: 9.4 })

  assert.deepEqual(info.places.filter((place) => place.kind === 'door'), [{ x: 1, kind: 'door', name: 'hall' }])
  assert.ok(info.places.some((place) => place.kind === 'seat' && place.x === 3))
  assert.ok(info.places.some((place) => place.kind === 'desk' && place.x === 5))
  assert.ok(info.places.some((place) => place.kind === 'board' && place.x === 2))
  assert.ok(!info.places.some((place) => place.kind === 'painting'))
  assert.equal(personalRoomInfo({ doors, placements, minX: 0.6, maxX: 9.4 }), info)

  assert.equal(personalShade(0, 0), null)
  assert.match(personalShade(0.5, 0) ?? '', /^brightness\(0\.64\) sepia\(0\.15\)$/)
  assert.ok(personalShade(0.5, 1)?.startsWith('brightness(0.64) sepia('))
})
