import { test } from 'node:test'
import assert from 'node:assert/strict'
import { addPassage, checkDoors, DEFAULT_DOORS, doorName, doorTarget, editDoor, removeDoor } from './doors.ts'

test('the museum as built is a valid set of doors', () => {
  assert.equal(checkDoors(DEFAULT_DOORS).ok, true)
  assert.deepEqual(doorTarget(DEFAULT_DOORS, 'hall', 'atelier'), { room: 'atelier', door: 'gallery' })
  assert.deepEqual(doorTarget(DEFAULT_DOORS, 'pond', 'hall'), { room: 'hall', door: null })
})

test('a new door comes with its way back, and both go together', () => {
  const added = addPassage(DEFAULT_DOORS, 'hall', 'pond', 3)
  assert.ok(added.ok)
  const there = added.doors.find((d) => d.room === 'hall' && d.to === 'pond')!
  const back = added.doors.find((d) => d.id === there.toDoor)!
  assert.equal(back.room, 'pond')
  assert.equal(back.toDoor, there.id)
  // The pond's own gate already stands at its left end, so the way back is placed clear of it.
  assert.ok(Math.abs(back.x - -5.6) >= 1.2)
  assert.deepEqual(removeDoor(added.doors, back.id), [...DEFAULT_DOORS])
})

test('doors cannot stand on top of each other, leave their room, or lose their partner', () => {
  assert.equal(editDoor(DEFAULT_DOORS, 'atelier', { x: 2 }).ok, true)
  assert.equal(editDoor(DEFAULT_DOORS, 'atelier', { x: 5000 }).ok, false)
  assert.equal(editDoor(DEFAULT_DOORS, 'gallery', { x: 40 }).ok, false)
  const two = addPassage(DEFAULT_DOORS, 'hall', 'pond', 2)
  assert.ok(two.ok)
  assert.equal(editDoor(two.doors, 'atelier', { x: two.doors.find((d) => d.room === 'hall' && d.to === 'pond')!.x + 0.5 }).ok, false)
  assert.equal(checkDoors(DEFAULT_DOORS.filter((d) => d.id !== 'gallery')).ok, false)
  assert.equal(editDoor(DEFAULT_DOORS, 'atelier', { label: 'x'.repeat(41) }).ok, false)
})

test('a door can have no sign, and only a hall door can stand under a painting', () => {
  const bare = editDoor(DEFAULT_DOORS, 'atelier', { label: '', scale: 0.3, under: true })
  assert.ok(bare.ok)
  const door = bare.doors.find((d) => d.id === 'atelier')!
  assert.equal(door.label, '')
  assert.equal(doorName(door), 'To the fashion area')
  assert.equal(door.under, true)
  const inAtelier = editDoor(DEFAULT_DOORS, 'gallery', { under: true })
  assert.ok(inAtelier.ok && inAtelier.doors.find((d) => d.id === 'gallery')!.under === false)
  assert.equal(editDoor(DEFAULT_DOORS, 'atelier', { scale: 0.2 }).ok, false)
})

test('a door can be made bigger or smaller, and a bigger door needs more room', () => {
  assert.equal(editDoor(DEFAULT_DOORS, 'atelier', { scale: 1.5 }).ok, true)
  assert.equal(editDoor(DEFAULT_DOORS, 'atelier', { scale: 3 }).ok, false)
  const two = addPassage(DEFAULT_DOORS, 'hall', 'pond', -1)
  assert.ok(two.ok)
  const pond = two.doors.find((d) => d.room === 'hall' && d.to === 'pond')!
  // Side by side at size 1, they no longer fit once the first is made much bigger.
  const near = editDoor(two.doors, pond.id, { x: -3.6 + 2.2 })
  assert.ok(near.ok)
  assert.equal(editDoor(near.doors, 'atelier', { scale: 1.6 }).ok, false)
  // Doors saved before sizes existed read as size 1.
  const old = DEFAULT_DOORS.map(({ scale: _scale, ...rest }) => rest)
  const read = checkDoors(old)
  assert.ok(read.ok && read.doors.every((d) => d.scale === 1))
})

test("the pond's gate is part of its scenery and stays put", () => {
  assert.equal(editDoor(DEFAULT_DOORS, 'hall', { x: 0 }).ok, false)
  assert.equal(editDoor(DEFAULT_DOORS, 'hall', { label: 'Home' }).ok, true)
  assert.deepEqual(removeDoor(DEFAULT_DOORS, 'hall'), [...DEFAULT_DOORS])
})
