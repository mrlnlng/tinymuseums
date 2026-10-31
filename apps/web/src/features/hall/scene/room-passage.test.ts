import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createRoomPassage } from './room-passage.ts'
import type { Traversal } from './traversal.ts'

function fixture(reduced = false) {
  Object.assign(globalThis, {
    window: { matchMedia: () => ({ matches: reduced }) },
    document: { getElementById: () => ({}), querySelector: () => null },
  })
  const walker = {
    x: 2, isHeld: false, isFollowing: false,
    target: null as number | null,
    hold(x: number | null) { this.target = x; this.isFollowing = x !== null },
    reset(x: number) { this.x = x; this.isFollowing = false; this.isHeld = false },
  }
  const dip = { hidden: true, style: { opacity: '0' }, remove() {} }
  const passage = createRoomPassage({ traversal: walker as unknown as Traversal, doorX: -2, clearX: -1, dip: dip as unknown as HTMLElement })
  return { walker, dip, passage }
}

test('room entry approaches the doorway before fading and navigates exactly once', () => {
  const { walker, dip, passage } = fixture()
  let navigations = 0
  passage.leave(() => navigations++)
  passage.leave(() => { throw new Error('duplicate entry') })
  passage.update(1)
  assert.equal(walker.target, -2)
  assert.equal(dip.hidden, true)
  assert.equal(navigations, 0)
  walker.x = -2
  passage.update(0.2)
  assert.equal(passage.locked, true)
  assert.equal(dip.hidden, false)
  assert.ok(Number(dip.style.opacity) < 1)
  passage.update(0.3)
  passage.update(1)
  assert.equal(navigations, 1)
  assert.equal(dip.style.opacity, '1')
})

test('arrival walks clear of the doorway and restores visitor control', () => {
  const { walker, passage } = fixture()
  passage.arrive()
  assert.equal(walker.x, -2)
  assert.equal(walker.target, -1)
  assert.equal(passage.busy, true)
  walker.x = -1
  walker.isHeld = true
  passage.update(0.1)
  assert.equal(passage.busy, false)
  assert.equal(passage.locked, false)
  assert.equal(walker.target, null)
})

test('reduced motion arrives directly clear of the doorway', () => {
  const { walker, passage } = fixture(true)
  passage.arrive()
  assert.equal(walker.x, -1)
  assert.equal(passage.busy, false)
})

test('interrupted approach cancels entry without leaving a busy room', () => {
  const { walker, dip, passage } = fixture()
  passage.leave(() => { throw new Error('cancelled entry') })
  walker.isFollowing = false
  passage.update(0.1)
  assert.equal(passage.busy, false)
  assert.equal(dip.hidden, true)
})
