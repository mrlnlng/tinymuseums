import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createStore } from './store.ts'
import {
  FakeEvents,
  FakeServer,
  FakeStorage,
  deferredFetch,
  deviceSlot,
  fixture,
  fixtureRegistry,
  makeEnv,
  memberIdOf,
  memberKeyOf,
  putCount,
  sleep,
  storedDirty,
  storedDoc,
  storedFixture,
  waitFor,
} from './helpers.ts'

const A = { email: 'a@example.test', password: 'pw-a' }

test('an update during an in-flight PUT stays dirty and is re-sent', async () => {
  const server = new FakeServer(fixtureRegistry)
  const storage = new FakeStorage()
  const gate = deferredFetch(server, false, (_, init) => init?.method === 'PUT')
  const store = createStore(makeEnv({ server, storage, fetchFn: gate.fetch }).env)
  const slot = store.getSlot(fixture)

  assert.equal(await store.signUp(A.email, A.password), null)
  const id = memberIdOf(server, A.email)
  await waitFor(() => server.row(id, fixture.name) !== null)

  gate.hold()
  slot.update((doc) => ({ ...doc, best: 5 }))
  await waitFor(() => gate.heldCount() === 1, 'first PUT held')
  slot.update((doc) => ({ ...doc, best: 9 }))
  await gate.release()

  await waitFor(() => gate.heldCount() === 1, 're-PUT held')
  assert.equal(storedDirty(storage, memberKeyOf(id, fixture.name)), true)
  await gate.release()
  gate.pass()

  await waitFor(() => server.rowDoc(id, fixture.name)?.best === 9)
  await waitFor(() => storedDirty(storage, memberKeyOf(id, fixture.name)) === false)
  assert.equal(server.rowDoc(id, fixture.name)?.best, 9)
})

test('two clients converge through the server', async () => {
  const server = new FakeServer(fixtureRegistry)
  const made1 = makeEnv({ server, storage: new FakeStorage() })
  const made2 = makeEnv({ server, storage: new FakeStorage() })
  const client1 = createStore(made1.env)
  const client2 = createStore(made2.env)
  const slot1 = client1.getSlot(fixture)
  const slot2 = client2.getSlot(fixture)

  assert.equal(await client1.signUp(A.email, A.password), null)
  const id = memberIdOf(server, A.email)
  slot1.update((doc) => ({ ...doc, best: 7, scores: { hall: 3 } }))
  await waitFor(() => server.rowDoc(id, fixture.name)?.best === 7)

  assert.equal(await client2.signIn(A.email, A.password), true)
  await waitFor(() => slot2.snapshot().best === 7)
  slot2.update((doc) => ({ ...doc, best: 12, scores: { cafe: 4 } }))
  await waitFor(() => server.rowDoc(id, fixture.name)?.best === 12)

  made1.lifecycle.dispatch('visibilitychange')
  await waitFor(() => slot1.snapshot().best === 12)
  assert.deepEqual(server.rowDoc(id, fixture.name), { best: 12, scores: { hall: 3, cafe: 4 }, items: {} })
  assert.deepEqual(slot1.snapshot(), { best: 12, scores: { hall: 3, cafe: 4 }, items: {} })
  assert.deepEqual(slot2.snapshot(), { best: 12, scores: { hall: 3, cafe: 4 }, items: {} })
})

test('version_ahead keeps the slot dirty for a later retry', async () => {
  const server = new FakeServer(fixtureRegistry)
  const storage = new FakeStorage()
  const lifecycle = new FakeEvents()
  const store = createStore(makeEnv({ server, storage, lifecycle }).env)
  const slot = store.getSlot(fixture)

  assert.equal(await store.signUp(A.email, A.password), null)
  const id = memberIdOf(server, A.email)
  await waitFor(() => server.row(id, fixture.name) !== null)

  server.versionAhead = true
  slot.update((doc) => ({ ...doc, best: 3 }))
  const key = memberKeyOf(id, fixture.name)
  await waitFor(() => putCount(server, fixture.name) >= 2)
  assert.equal(storedDirty(storage, key), true)

  server.versionAhead = false
  const before = putCount(server, fixture.name)
  lifecycle.dispatch('visibilitychange')
  await waitFor(() => putCount(server, fixture.name) > before)
  await waitFor(() => server.rowDoc(id, fixture.name)?.best === 3)
  await waitFor(() => storedDirty(storage, key) === false)
})

test('an anonymous tab makes no account requests', async () => {
  const server = new FakeServer(fixtureRegistry)
  const storage = new FakeStorage()
  const lifecycle = new FakeEvents()
  const store = createStore(makeEnv({ server, storage, lifecycle }).env)
  const slot = store.getSlot(fixture)
  const device = store.getSlot(deviceSlot)

  slot.update((doc) => ({ ...doc, best: 1 }))
  device.update((doc) => ({ ...doc, n: 2 }))
  await sleep(30)
  lifecycle.dispatch('visibilitychange')
  lifecycle.dispatch('online')
  await sleep(20)

  assert.equal(server.requests.length, 0)
  assert.equal(storedFixture(storage, 'tm_slot:anon:test-fixture')?.best, 1)
  assert.equal(storedDoc(storage, 'tm_slot:device-only')?.n, 2)
})

test('an update schedules a debounced drain that PUTs', async () => {
  const server = new FakeServer(fixtureRegistry)
  const store = createStore(makeEnv({ server, storage: new FakeStorage() }).env)
  const slot = store.getSlot(fixture)

  assert.equal(await store.signUp(A.email, A.password), null)
  const id = memberIdOf(server, A.email)
  await waitFor(() => server.row(id, fixture.name) !== null)

  const before = putCount(server, fixture.name)
  slot.update((doc) => ({ ...doc, best: 2 }))
  await waitFor(() => putCount(server, fixture.name) > before)
  await waitFor(() => server.rowDoc(id, fixture.name)?.best === 2)
})

test('hiding flushes dirty slots with keepalive', async () => {
  const server = new FakeServer(fixtureRegistry)
  const storage = new FakeStorage()
  const made = makeEnv({ server, storage, debounceMs: 10_000 })
  const store = createStore(made.env)
  const slot = store.getSlot(fixture)

  assert.equal(await store.signUp(A.email, A.password), null)
  const id = memberIdOf(server, A.email)
  await waitFor(() => server.row(id, fixture.name) !== null)

  slot.update((doc) => ({ ...doc, best: 4 }))
  made.setVisible(false)
  made.lifecycle.dispatch('visibilitychange')
  await waitFor(() => server.rowDoc(id, fixture.name)?.best === 4)
  await waitFor(() => storedDirty(storage, memberKeyOf(id, fixture.name)) === false)

  const put = server.requests.find((r) => r.method === 'PUT' && r.body !== null && (r.body as { doc?: { best?: number } }).doc?.best === 4)
  assert.ok(put)
  assert.equal(put.init?.keepalive, true)
  assert.equal(put.headers['x-tm-member'], id)
})

test('storage events under the current prefix merge into memory', async () => {
  const server = new FakeServer(fixtureRegistry)
  const storage = new FakeStorage()
  const events = new FakeEvents()
  const store = createStore(makeEnv({ server, storage, events }).env)
  const slot = store.getSlot(fixture)

  storage.map.set(
    'tm_slot:anon:test-fixture',
    JSON.stringify({ version: 2, doc: { best: 6, scores: { hall: 2 }, items: {} }, dirty: true }),
  )
  events.dispatch('storage', { key: 'tm_slot:anon:test-fixture', newValue: storage.raw('tm_slot:anon:test-fixture') })
  assert.equal(slot.snapshot().best, 6)

  events.dispatch('storage', { key: 'tm_slot:anon:test-fixture', newValue: null })
  assert.equal(slot.snapshot().best, 6)

  events.dispatch('storage', {
    key: 'tm_slot:m:someone:test-fixture',
    newValue: JSON.stringify({ version: 2, doc: { best: 99, scores: {}, items: {} }, dirty: false }),
  })
  assert.equal(slot.snapshot().best, 6)
})

test('a tm_member storage event moves a tab to the new member namespace', async () => {
  const server = new FakeServer(fixtureRegistry)
  const storage = new FakeStorage()
  const events = new FakeEvents()
  const store = createStore(makeEnv({ server, storage, events }).env)
  const slot = store.getSlot(fixture)

  assert.equal(await store.signUp(A.email, A.password), null)
  const idA = memberIdOf(server, A.email)
  await waitFor(() => server.row(idA, fixture.name) !== null)
  slot.update((doc) => ({ ...doc, best: 8 }))
  await waitFor(() => server.rowDoc(idA, fixture.name)?.best === 8)

  storage.map.set('tm_member', 'other-member')
  storage.map.set(
    'tm_slot:m:other-member:test-fixture',
    JSON.stringify({ version: 2, doc: { best: 42, scores: {}, items: {} }, dirty: false }),
  )
  server.cookie = 'other-member'
  server.members.set('other-member', { id: 'other-member', email: 'other@example.test', password: 'pw' })

  events.dispatch('storage', { key: 'tm_member', newValue: 'other-member' })
  await waitFor(() => slot.snapshot().best === 42)
  assert.equal(store.getMemberSnapshot()?.id, 'other-member')
  await waitFor(() => server.rowDoc('other-member', fixture.name)?.best === 42)
})

test('device-only slots stay local and survive sign-out', async () => {
  const server = new FakeServer(fixtureRegistry)
  const storage = new FakeStorage()
  const store = createStore(makeEnv({ server, storage }).env)
  const device = store.getSlot(deviceSlot)
  const slot = store.getSlot(fixture)

  device.update((doc) => ({ ...doc, n: 5 }))
  assert.equal(await store.signUp(A.email, A.password), null)
  await waitFor(() => server.requests.length >= 3)

  await store.signOut()
  assert.equal(store.getSlot(deviceSlot).snapshot().n, 5)
  assert.equal(storedDoc(storage, 'tm_slot:device-only')?.n, 5)
  assert.equal(store.getSlot(fixture).snapshot().best, 0)
  assert.equal(server.requests.some((r) => r.url === '/api/me/slots/device-only'), false)
  assert.deepEqual(storage.rawKeys(), ['tm_slot:device-only'])
})
