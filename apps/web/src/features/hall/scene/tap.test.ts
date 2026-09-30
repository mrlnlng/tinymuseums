import assert from 'node:assert/strict'
import { test } from 'node:test'
import { routeTap, type TapIntent, type TapWorld } from './tap.ts'
import type { Pedestal } from './pedestal.ts'

const point = { x: 0, y: 0 }

function makePedestal(voice: 'harp' | 'owl' | null): Pedestal {
  return { index: 0, voice, holdsHelm: false } as unknown as Pedestal
}

const owl = makePedestal('owl')
const mute = makePedestal(null)

function world(overrides: Partial<TapWorld> = {}): TapWorld {
  return {
    hitDoor: () => false,
    hitLobbyCat: () => false,
    hitCoin: () => false,
    hitPainting: () => null,
    hitPedestal: () => null,
    acceptsHelm: () => false,
    hitMatcha: () => false,
    hitCafeCat: () => false,
    hitDesktop: () => false,
    hitBeanbag: () => false,
    hitGuestBoard: () => false,
    ...overrides,
  }
}

function both(a: TapWorld, b: TapWorld): TapWorld {
  return {
    hitDoor: (p) => a.hitDoor(p) || b.hitDoor(p),
    hitLobbyCat: (p) => a.hitLobbyCat(p) || b.hitLobbyCat(p),
    hitCoin: (p) => a.hitCoin(p) || b.hitCoin(p),
    hitPainting: (p) => a.hitPainting(p) ?? b.hitPainting(p),
    hitPedestal: (p) => a.hitPedestal(p) ?? b.hitPedestal(p),
    acceptsHelm: (pedestal) => a.acceptsHelm(pedestal) || b.acceptsHelm(pedestal),
    hitMatcha: (p) => a.hitMatcha(p) || b.hitMatcha(p),
    hitCafeCat: (p) => a.hitCafeCat(p) || b.hitCafeCat(p),
    hitDesktop: (p) => a.hitDesktop(p) || b.hitDesktop(p),
    hitBeanbag: (p) => a.hitBeanbag(p) || b.hitBeanbag(p),
    hitGuestBoard: (p) => a.hitGuestBoard(p) || b.hitGuestBoard(p),
  }
}

const paintingHit = { slug: 'slug', artistId: 'artist', pieceId: 'piece' }
const painting: TapIntent = { kind: 'painting', ...paintingHit }

const ladder: { intent: TapIntent; world: TapWorld }[] = [
  { intent: { kind: 'leave' }, world: world({ hitDoor: () => true }) },
  { intent: { kind: 'help' }, world: world({ hitLobbyCat: () => true }) },
  { intent: { kind: 'coin' }, world: world({ hitCoin: () => true }) },
  { intent: painting, world: world({ hitPainting: () => paintingHit }) },
  { intent: { kind: 'helm', pedestal: owl }, world: world({ hitPedestal: () => owl, acceptsHelm: () => true }) },
  { intent: { kind: 'statue', pedestal: owl }, world: world({ hitPedestal: () => owl }) },
  { intent: { kind: 'matcha' }, world: world({ hitMatcha: () => true }) },
  { intent: { kind: 'cafe-cat' }, world: world({ hitCafeCat: () => true }) },
  { intent: { kind: 'sketch' }, world: world({ hitDesktop: () => true }) },
  { intent: { kind: 'beanbag' }, world: world({ hitBeanbag: () => true }) },
  { intent: { kind: 'guest-board' }, world: world({ hitGuestBoard: () => true }) },
]

test('every earlier branch outranks every later branch', () => {
  for (let i = 0; i < ladder.length; i++) {
    for (let j = i + 1; j < ladder.length; j++) {
      const combined = both(ladder[i].world, ladder[j].world)
      assert.deepEqual(routeTap(point, combined), ladder[i].intent, `${i} should outrank ${j}`)
    }
  }
})

test('nothing hit routes nowhere', () => {
  assert.equal(routeTap(point, world()), null)
})

test('a pedestal with no helm and no voice falls through', () => {
  assert.equal(routeTap(point, world({ hitPedestal: () => mute })), null)
  assert.deepEqual(routeTap(point, world({ hitPedestal: () => mute, hitMatcha: () => true })), {
    kind: 'matcha',
  })
})

test('a pedestal the helm accepts routes to helm even with a voice', () => {
  assert.deepEqual(routeTap(point, world({ hitPedestal: () => owl, acceptsHelm: () => true })), {
    kind: 'helm',
    pedestal: owl,
  })
})

test('a pedestal the helm rejects routes to its voice', () => {
  assert.deepEqual(routeTap(point, world({ hitPedestal: () => owl })), { kind: 'statue', pedestal: owl })
})

test('a found coin falls through to the painting behind it', () => {
  assert.deepEqual(routeTap(point, world({ hitCoin: () => false, hitPainting: () => paintingHit })), painting)
})

test('absent late objects are skipped', () => {
  assert.deepEqual(routeTap(point, world({ hitDoor: () => true })), { kind: 'leave' })
  assert.equal(routeTap(point, world()), null)
})
