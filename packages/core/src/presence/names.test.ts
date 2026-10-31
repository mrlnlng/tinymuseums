import assert from 'node:assert/strict'
import { test } from 'node:test'
import { ADJECTIVES, NAME_LIMITS, NAME_SEEDS, NOUNS, checkDisplayName, nameFromSeed, randomSeed, validSeed } from './names.ts'

test('the word lists hold 64 distinct words each, and no word is in both', () => {
  assert.equal(new Set(ADJECTIVES).size, 64)
  assert.equal(new Set(NOUNS).size, 64)
  assert.deepEqual(ADJECTIVES.filter((word) => (NOUNS as readonly string[]).includes(word)), [])
})

test('every generated name fits the chosen-name limit and passes its checks', () => {
  for (let seed = 0; seed < ADJECTIVES.length * NOUNS.length; seed++) {
    const name = nameFromSeed(seed)
    assert.ok(name.length <= NAME_LIMITS.max, name)
    assert.deepEqual(checkDisplayName(name), { ok: true, name })
  }
})

test('nameFromSeed is deterministic and covers all 4,096 names', () => {
  assert.equal(nameFromSeed(0), 'Velvet Easel')
  assert.equal(nameFromSeed(12345), nameFromSeed(12345))
  const names = new Set<string>()
  for (let seed = 0; seed < 4096; seed++) names.add(nameFromSeed(seed))
  assert.equal(names.size, 4096)
  assert.equal(nameFromSeed(NAME_SEEDS - 1), nameFromSeed((NAME_SEEDS - 1) % 4096))
})

test('seeds are integers in [0, 2^31)', () => {
  for (let i = 0; i < 100; i++) assert.ok(validSeed(randomSeed()))
  for (const bad of [-1, NAME_SEEDS, 1.5, '3', null, Number.NaN]) assert.equal(validSeed(bad), false)
})

test('chosen names are normalised before they are checked', () => {
  assert.deepEqual(checkDisplayName('  Moss   Painter '), { ok: true, name: 'Moss Painter' })
  assert.deepEqual(checkDisplayName('Ｆｕｌｌ'), { ok: true, name: 'Full' })
  assert.deepEqual(checkDisplayName("Zoë O'Hara-Li"), { ok: true, name: "Zoë O'Hara-Li" })
  assert.deepEqual(checkDisplayName('桜'.repeat(2)), { ok: true, name: '桜桜' })
})

test('chosen names keep to 2–20 characters with at least one letter', () => {
  assert.deepEqual(checkDisplayName('A'), { ok: false, reason: 'length' })
  assert.deepEqual(checkDisplayName('x'.repeat(21)), { ok: false, reason: 'length' })
  assert.equal(checkDisplayName('x'.repeat(20)).ok, true)
  assert.deepEqual(checkDisplayName('1234'), { ok: false, reason: 'characters' })
  assert.deepEqual(checkDisplayName('hi <b>'), { ok: false, reason: 'characters' })
  assert.deepEqual(checkDisplayName('me@x'), { ok: false, reason: 'characters' })
  assert.deepEqual(checkDisplayName('😀 smile'), { ok: false, reason: 'characters' })
})

test('chosen names cannot carry contact details', () => {
  assert.deepEqual(checkDisplayName('visit foo.com'), { ok: false, reason: 'contact' })
  assert.deepEqual(checkDisplayName('call 55512'), { ok: false, reason: 'contact' })
  assert.equal(checkDisplayName('Room 101').ok, true)
})

test('chosen names cannot pose as the museum', () => {
  for (const name of ['Curator', 'museum admin', 'Tiny Museum', 'tiny-museum', 'Inspiratiq', 'Staff Pick']) {
    assert.deepEqual(checkDisplayName(name), { ok: false, reason: 'reserved' }, name)
  }
})

test('chosen names are checked against the profanity list, including look-alikes', () => {
  assert.deepEqual(checkDisplayName('fuck off'), { ok: false, reason: 'blocked' })
  assert.deepEqual(checkDisplayName('fuuuck'), { ok: false, reason: 'blocked' })
  assert.deepEqual(checkDisplayName('sh1t'), { ok: false, reason: 'blocked' })
  assert.equal(checkDisplayName('Scunthorpe').ok, true)
})
