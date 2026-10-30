import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { createStore } from './store.ts'
import { serverSnapshot, useSlot } from './useSlot.ts'
import { useMember, type UseMember } from './useMember.ts'
import {
  FakeEvents,
  FakeServer,
  FakeStorage,
  deferredFetch,
  fixture,
  fixtureB,
  fixtureRegistry,
  fixtureRegistryBoth,
  makeEnv,
  memberIdOf,
  memberKeyOf,
  putCount,
  sleep,
  waitFor,
} from './helpers.ts'

const A = { email: 'a@example.test', password: 'pw-a' }

test('a claim merges anon data for registry slots the tab has not mounted yet', async () => {
  const server = new FakeServer(fixtureRegistry)
  const storage = new FakeStorage()
  storage.map.set(
    'tm_slot:anon:test-fixture',
    JSON.stringify({ version: 2, doc: { best: 4, scores: {}, items: {} }, dirty: true }),
  )
  const store = createStore(makeEnv({ server, storage }).env)

  assert.equal(await store.signUp(A.email, A.password), null)
  const id = memberIdOf(server, A.email)
  assert.equal(storage.raw('tm_slot:anon:test-fixture'), null)

  const slot = store.getSlot(fixture) // mounted only after the claim
  assert.equal(slot.snapshot().best, 4)
  await waitFor(() => server.rowDoc(id, fixture.name)?.best === 4)
})

test('mounting a slot while signed in rescues leftover anon data', async () => {
  const server = new FakeServer(fixtureRegistry)
  const storage = new FakeStorage()
  const store = createStore(makeEnv({ server, storage, registry: {} }).env) // the slot is not in the registry

  assert.equal(await store.signUp(A.email, A.password), null)
  const id = memberIdOf(server, A.email)
  storage.map.set(
    'tm_slot:anon:test-fixture',
    JSON.stringify({ version: 2, doc: { best: 6, scores: {}, items: {} }, dirty: true }),
  )

  const slot = store.getSlot(fixture)
  assert.equal(slot.snapshot().best, 6)
  assert.equal(storage.raw('tm_slot:anon:test-fixture'), null)
  await waitFor(() => server.rowDoc(id, fixture.name)?.best === 6)
})

test('a drain uploads an unmounted registry slot after a claim and signOut proceeds', async () => {
  const server = new FakeServer(fixtureRegistry)
  const storage = new FakeStorage()
  storage.map.set(
    'tm_slot:anon:test-fixture',
    JSON.stringify({ version: 2, doc: { best: 7, scores: {}, items: {} }, dirty: true }),
  )
  const store = createStore(makeEnv({ server, storage }).env)

  assert.equal(await store.signUp(A.email, A.password), null)
  const id = memberIdOf(server, A.email)
  // the slot is never mounted; the claim's drain must still upload the merged anon data
  await waitFor(() => server.rowDoc(id, fixture.name)?.best === 7)
  assert.equal(store.hasDirty(), false)
  assert.equal(storage.raw('tm_slot:anon:test-fixture'), null)

  assert.equal(await store.signOut(), 'ok')
  assert.equal(storage.raw('tm_member'), null)
  assert.equal(storage.raw(memberKeyOf(id, fixture.name)), null)
  assert.equal(server.rowDoc(id, fixture.name)?.best, 7)
})

test('an unmounted slot that cannot upload keeps signOut from losing its data', async () => {
  const server = new FakeServer(fixtureRegistry)
  const storage = new FakeStorage()
  storage.map.set(
    'tm_slot:anon:test-fixture',
    JSON.stringify({ version: 2, doc: { best: 7, scores: {}, items: {} }, dirty: true }),
  )
  server.throttled = true
  const store = createStore(makeEnv({ server, storage }).env)

  assert.equal(await store.signUp(A.email, A.password), null)
  const id = memberIdOf(server, A.email)
  await waitFor(() => putCount(server, fixture.name) >= 1)

  assert.equal(store.hasDirty(), true)
  assert.equal(await store.signOut(), 'dirty')
  assert.equal(storage.raw('tm_member'), id)
  assert.ok(storage.raw(memberKeyOf(id, fixture.name)) !== null)
})

test('a storage write failure does not lose an update made during an in-flight PUT', async () => {
  const server = new FakeServer(fixtureRegistry)
  const storage = new FakeStorage()
  const gate = deferredFetch(server, false, (_, init) => init?.method === 'PUT')
  const store = createStore(makeEnv({ server, storage, fetchFn: gate.fetch }).env)
  const slot = store.getSlot(fixture)

  assert.equal(await store.signUp(A.email, A.password), null)
  const id = memberIdOf(server, A.email)
  await waitFor(() => server.row(id, fixture.name) !== null)

  gate.hold()
  slot.update((doc) => ({ ...doc, best: 1 }))
  await waitFor(() => gate.heldCount() === 1, 'first PUT held')
  storage.writesThrow = true
  slot.update((doc) => ({ ...doc, best: 5 }))
  await gate.release()

  await waitFor(() => gate.heldCount() === 1, 're-PUT held')
  assert.equal(slot.snapshot().best, 5)
  await gate.release()
  gate.pass()
  await waitFor(() => server.rowDoc(id, fixture.name)?.best === 5)
  assert.equal(slot.snapshot().best, 5)
})

test('signOut refuses while a slot is dirty and force proceeds', async () => {
  const server = new FakeServer(fixtureRegistry)
  const storage = new FakeStorage()
  const store = createStore(makeEnv({ server, storage }).env)
  const slot = store.getSlot(fixture)

  assert.equal(await store.signUp(A.email, A.password), null)
  const id = memberIdOf(server, A.email)
  await waitFor(() => server.row(id, fixture.name) !== null)

  server.throttled = true
  slot.update((doc) => ({ ...doc, best: 8 }))
  await waitFor(() => putCount(server, fixture.name) >= 2)

  assert.equal(store.hasDirty(), true)
  assert.equal(await store.signOut(), 'dirty')
  assert.equal(storage.raw('tm_member'), id)
  assert.ok(storage.raw(memberKeyOf(id, fixture.name)) !== null)

  server.throttled = false
  assert.equal(await store.signOut({ force: true }), 'ok')
  assert.equal(storage.raw('tm_member'), null)
  assert.equal(storage.raw(memberKeyOf(id, fixture.name)), null)
})

test('deleteAccount refuses while dirty unless forced', async () => {
  const server = new FakeServer(fixtureRegistry)
  const storage = new FakeStorage()
  const store = createStore(makeEnv({ server, storage }).env)
  const slot = store.getSlot(fixture)

  assert.equal(await store.signUp(A.email, A.password), null)
  const id = memberIdOf(server, A.email)
  await waitFor(() => server.row(id, fixture.name) !== null)

  server.throttled = true
  slot.update((doc) => ({ ...doc, best: 9 }))
  await waitFor(() => putCount(server, fixture.name) >= 2)

  assert.equal(await store.deleteAccount(A.password), 'dirty')
  assert.ok(server.members.has(id))

  server.throttled = false
  assert.equal(await store.deleteAccount(A.password, { force: true }), true)
  assert.ok(!server.members.has(id))
})

test('exportData downloads the export and a 401 signs the tab out', async () => {
  const server = new FakeServer(fixtureRegistry)
  const storage = new FakeStorage()
  const store = createStore(makeEnv({ server, storage }).env)
  const slot = store.getSlot(fixture)

  assert.equal(await store.signUp(A.email, A.password), null)
  slot.update((doc) => ({ ...doc, best: 2 }))
  const id = memberIdOf(server, A.email)
  await waitFor(() => server.rowDoc(id, fixture.name)?.best === 2)

  const blob = await store.exportData()
  assert.ok(blob !== null)
  assert.ok((await blob.text()).includes('a@example.test'))

  server.cookie = null
  assert.equal(await store.exportData(), null)
  await waitFor(() => storage.raw('tm_member') === null)
})

test('a drain that loses scope stops sending slots under the old member', async () => {
  const server = new FakeServer(fixtureRegistryBoth)
  const storage = new FakeStorage()
  const events = new FakeEvents()
  const gate = deferredFetch(server, false, (_, init) => init?.method === 'PUT')
  const store = createStore(
    makeEnv({ server, storage, events, fetchFn: gate.fetch, registry: fixtureRegistryBoth }).env,
  )
  const slotA = store.getSlot(fixture)
  const slotB = store.getSlot(fixtureB)

  assert.equal(await store.signUp(A.email, A.password), null)
  const idA = memberIdOf(server, A.email)
  await waitFor(() => server.row(idA, fixture.name) !== null)

  gate.hold()
  slotA.update((doc) => ({ ...doc, best: 1 }))
  slotB.update((doc) => ({ ...doc, best: 2 }))
  await waitFor(() => gate.heldCount() === 1, "first slot's PUT held")

  const other = { id: 'other-member', email: 'other@example.test', password: 'pw' }
  server.members.set(other.id, other)
  server.cookie = other.id
  storage.map.set('tm_member', other.id)
  storage.map.set(
    memberKeyOf(other.id, fixture.name),
    JSON.stringify({ version: 2, doc: { best: 0, scores: {}, items: {} }, dirty: false }),
  )
  storage.map.set(
    memberKeyOf(other.id, fixtureB.name),
    JSON.stringify({ version: 2, doc: { best: 99, scores: {}, items: {} }, dirty: false }),
  )
  events.dispatch('storage', { key: 'tm_member', newValue: other.id })
  await waitFor(() => store.getMemberSnapshot()?.id === other.id)

  await gate.release() // the held PUT settles against the new cookie
  await sleep(30)

  // neither the pending slot's own doc nor the new scope's doc was sent under A's header
  const sent = server.requests.filter(
    (r) =>
      r.method === 'PUT' &&
      r.headers['x-tm-member'] === idA &&
      r.body !== null &&
      ((r.body as { doc?: { best?: number } }).doc?.best ?? -1) >= 2,
  )
  assert.equal(sent.length, 0)
  assert.equal(server.rowDoc(idA, fixtureB.name)?.best === 99, false)
})

test('a storage read failure does not sign the tab out', async () => {
  const server = new FakeServer(fixtureRegistry)
  const storage = new FakeStorage()
  const events = new FakeEvents()
  const store = createStore(makeEnv({ server, storage, events }).env)
  const slot = store.getSlot(fixture)

  assert.equal(await store.signUp(A.email, A.password), null)
  const id = memberIdOf(server, A.email)
  await waitFor(() => server.row(id, fixture.name) !== null)

  storage.readThrows = true
  slot.update((doc) => ({ ...doc, best: 3 }))
  assert.equal(store.getMemberSnapshot()?.id, id)
  events.dispatch('storage', { key: 'tm_member', newValue: null })
  assert.equal(store.getMemberSnapshot()?.id, id)

  storage.readThrows = false
  await waitFor(() => server.rowDoc(id, fixture.name)?.best === 3)
})

test('a claim sets tm_member before deleting the anon keys', async () => {
  const server = new FakeServer(fixtureRegistry)
  const storage = new FakeStorage()
  const store = createStore(makeEnv({ server, storage }).env)
  const slot = store.getSlot(fixture)

  slot.update((doc) => ({ ...doc, best: 1 }))
  storage.writes.length = 0
  assert.equal(await store.signUp(A.email, A.password), null)
  const setMarker = storage.writes.indexOf('set:tm_member')
  const removeAnon = storage.writes.indexOf('remove:tm_slot:anon:test-fixture')
  assert.ok(setMarker !== -1 && removeAnon !== -1)
  assert.ok(setMarker < removeAnon)
  assert.equal(slot.snapshot().best, 1)
})

test('useSlot caches one server snapshot per def', () => {
  assert.equal(serverSnapshot(fixture), serverSnapshot(fixture))
  assert.notEqual(serverSnapshot(fixture), serverSnapshot(fixtureB))
})

test('useSlot and useMember render server snapshots without a store during SSR', async () => {
  const state: { slot: unknown; api: UseMember | null } = { slot: null, api: null }
  function Probe() {
    const [value] = useSlot(fixture)
    state.slot = value
    state.api = useMember()
    return null
  }
  renderToString(createElement(Probe))
  assert.deepEqual(state.slot, fixture.empty())
  assert.equal(state.api?.member, null)
  assert.equal(state.api?.hasDirty(), false)
  assert.equal(await state.api?.signOut(), 'ok')
  assert.equal(await state.api?.signUp(A.email, A.password), 'invalid')
  assert.equal(await state.api?.exportData(), null)
})
