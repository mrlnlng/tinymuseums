import assert from 'node:assert/strict'
import { test } from 'node:test'
import { stamp } from '@tiny/core/slots'
import { createStore } from './store.ts'
import {
  FakeEvents,
  FakeServer,
  FakeStorage,
  deferredFetch,
  fixture,
  fixtureRegistry,
  makeEnv,
  memberIdOf,
  memberKeyOf,
  sleep,
  storedDirty,
  storedFixture,
  waitFor,
} from './helpers.ts'

const A = { email: 'a@example.test', password: 'pw-a' }
const B = { email: 'b@example.test', password: 'pw-b' }

test('a claim merges anonymous data, wipes anon keys and drains', async () => {
  const server = new FakeServer(fixtureRegistry)
  const storage = new FakeStorage()
  const store = createStore(makeEnv({ server, storage }).env)
  const slot = store.getSlot(fixture)

  slot.update((doc) => ({ ...doc, best: 5, scores: { hall: 2 } }))
  assert.equal(storedDirty(storage, 'tm_slot:anon:test-fixture'), true)

  assert.equal(await store.signUp(A.email, A.password), null)
  const id = memberIdOf(server, A.email)
  await waitFor(() => server.rowDoc(id, fixture.name)?.best === 5)

  assert.deepEqual(storage.rawKeys(), ['tm_member', memberKeyOf(id, fixture.name)])
  assert.equal(storedDirty(storage, memberKeyOf(id, fixture.name)), false)
  assert.deepEqual(slot.snapshot(), { best: 5, scores: { hall: 2 }, items: {} })
})

test('sign-out removes the member namespace and keeps device-only slots', async () => {
  const server = new FakeServer(fixtureRegistry)
  const storage = new FakeStorage()
  const store = createStore(makeEnv({ server, storage }).env)
  const slot = store.getSlot(fixture)

  assert.equal(await store.signUp(A.email, A.password), null)
  const id = memberIdOf(server, A.email)
  await waitFor(() => server.row(id, fixture.name) !== null)
  slot.update((doc) => ({ ...doc, best: 6 }))
  await waitFor(() => server.rowDoc(id, fixture.name)?.best === 6)

  await store.signOut()
  assert.equal(storage.raw('tm_member'), null)
  assert.equal(store.getMemberSnapshot(), null)
  assert.equal(storage.raw(memberKeyOf(id, fixture.name)), null)
  assert.equal(slot.snapshot().best, 0)
})

test('401 keeps data dormant and the same member drains it on re-sign-in', async () => {
  const server = new FakeServer(fixtureRegistry)
  const storage = new FakeStorage()
  const lifecycle = new FakeEvents()
  const store = createStore(makeEnv({ server, storage, lifecycle }).env)
  const slot = store.getSlot(fixture)

  assert.equal(await store.signUp(A.email, A.password), null)
  const id = memberIdOf(server, A.email)
  slot.update((doc) => ({ ...doc, best: 4 }))
  await waitFor(() => server.rowDoc(id, fixture.name)?.best === 4)

  server.cookie = null
  const requestsBefore = server.requests.length
  lifecycle.dispatch('visibilitychange')
  await waitFor(() => server.requests.length > requestsBefore)
  await waitFor(() => storage.raw('tm_member') === null)
  assert.equal(storedFixture(storage, memberKeyOf(id, fixture.name))?.best, 4)

  slot.update((doc) => ({ ...doc, best: 11 }))
  assert.equal(storedFixture(storage, 'tm_slot:anon:test-fixture')?.best, 11)

  assert.equal(await store.signIn(A.email, A.password), true)
  await waitFor(() => server.rowDoc(id, fixture.name)?.best === 11)
  assert.equal(storedFixture(storage, memberKeyOf(id, fixture.name))?.best, 11)
})

test("a different member's claim uploads nothing of the previous member's", async () => {
  const server = new FakeServer(fixtureRegistry)
  const storage = new FakeStorage()
  const store = createStore(makeEnv({ server, storage }).env)
  const slot = store.getSlot(fixture)

  assert.equal(await store.signUp(A.email, A.password), null)
  const idA = memberIdOf(server, A.email)
  slot.update((doc) => ({ ...doc, best: 33, scores: { hall: 2 } }))
  await waitFor(() => server.rowDoc(idA, fixture.name)?.best === 33)

  assert.equal(await store.signUp(B.email, B.password), null)
  const idB = memberIdOf(server, B.email)
  await waitFor(() => server.row(idB, fixture.name) !== null)

  assert.deepEqual(slot.snapshot(), fixture.empty())
  assert.deepEqual(server.rowDoc(idB, fixture.name), fixture.empty())
  assert.deepEqual(storage.rawKeys(), ['tm_member', memberKeyOf(idB, fixture.name)])
  for (const request of server.requests) {
    if (request.method === 'PUT' && request.headers['x-tm-member'] === idB) {
      assert.deepEqual(request.body, { version: 2, doc: fixture.empty() })
    }
  }
})

test('two tabs, one storage: a late GET as A never contaminates B', async () => {
  const server = new FakeServer(fixtureRegistry)
  const storage = new FakeStorage()
  const events1 = new FakeEvents()
  const gate = deferredFetch(server, true)
  const tab2 = createStore(makeEnv({ server, storage }).env)
  const slot2 = tab2.getSlot(fixture)

  assert.equal(await tab2.signUp(A.email, A.password), null)
  const idA = memberIdOf(server, A.email)
  slot2.update((doc) => ({ ...doc, best: 11, scores: { hall: 5 } }))
  await waitFor(() => server.rowDoc(idA, fixture.name)?.best === 11)

  gate.hold()
  const tab1 = createStore(makeEnv({ server, storage, events: events1, fetchFn: gate.fetch }).env)
  const slot1 = tab1.getSlot(fixture)
  await waitFor(() => gate.heldCount() === 1, 'tab 1 GET held')
  assert.equal(slot1.snapshot().best, 11)

  await tab2.signOut()
  assert.equal(await tab2.signUp(B.email, B.password), null)
  const idB = memberIdOf(server, B.email)
  slot2.update((doc) => ({ ...doc, best: 22, scores: { cafe: 7 } }))
  await waitFor(() => server.rowDoc(idB, fixture.name)?.best === 22)

  await gate.release()
  gate.pass()
  await waitFor(() => storage.raw(memberKeyOf(idA, fixture.name)) !== null, 'stale write recreated m:A')

  const readsBefore = storage.reads.length
  events1.dispatch('storage', { key: 'tm_member', newValue: idB })
  events1.dispatch('storage', { key: memberKeyOf(idA, fixture.name), newValue: null })
  events1.dispatch('storage', {
    key: memberKeyOf(idB, fixture.name),
    newValue: storage.raw(memberKeyOf(idB, fixture.name)),
  })

  await waitFor(() => slot1.snapshot().best === 22)
  assert.deepEqual(slot1.snapshot(), { best: 22, scores: { cafe: 7 }, items: {} })
  assert.deepEqual(storedFixture(storage, memberKeyOf(idB, fixture.name)), { best: 22, scores: { cafe: 7 }, items: {} })
  assert.deepEqual(server.rowDoc(idB, fixture.name), { best: 22, scores: { cafe: 7 }, items: {} })

  const readsAfter = storage.reads.slice(readsBefore).filter((key) => key.startsWith(`tm_slot:m:${idA}:`))
  assert.deepEqual(readsAfter, [])

  await tab1.signOut()
  assert.equal(storage.raw(memberKeyOf(idA, fixture.name)), null)
})

test('a stale tab believing A gets member_mismatch on PUT and the server is unchanged', async () => {
  const server = new FakeServer(fixtureRegistry)
  const madeB = makeEnv({ server, storage: new FakeStorage(), debounceMs: 10_000 })
  const tabB = createStore(madeB.env)
  assert.equal(await tabB.signUp(B.email, B.password), null)
  const idB = memberIdOf(server, B.email)
  tabB.getSlot(fixture).update((doc) => ({ ...doc, best: 60 }))
  madeB.lifecycle.dispatch('visibilitychange')
  await waitFor(() => server.rowDoc(idB, fixture.name)?.best === 60)

  const tabA = createStore(makeEnv({ server, storage: new FakeStorage() }).env)
  assert.equal(await tabA.signUp(A.email, A.password), null)
  const idA = memberIdOf(server, A.email)
  await tabA.signOut()

  const storage = new FakeStorage()
  storage.map.set('tm_member', idA)
  storage.map.set(
    memberKeyOf(idA, fixture.name),
    JSON.stringify({ version: 2, doc: { best: 9, scores: {}, items: {} }, dirty: true }),
  )
  server.cookie = idA
  const gate = deferredFetch(server, false, (_, init) => init?.method === 'PUT')
  gate.hold()
  const store = createStore(makeEnv({ server, storage, fetchFn: gate.fetch }).env)
  const slot = store.getSlot(fixture)
  assert.equal(slot.snapshot().best, 9)
  await waitFor(() => gate.heldCount() === 1, 'PUT held')

  server.cookie = idB
  await gate.release()
  await waitFor(() => storage.raw('tm_member') === idB, 'recovery claimed B')
  await waitFor(() => gate.heldCount() === 1, "B's claim PUT held")
  gate.pass()
  await gate.release()

  await waitFor(() => slot.snapshot().best === 60)
  assert.deepEqual(server.rowDoc(idB, fixture.name), { best: 60, scores: {}, items: {} })
  const aRow = server.rowDoc(idA, fixture.name)
  assert.ok(aRow === null || aRow.best === 0) // A's own empty claim at most; the stale best:9 never landed
  assert.equal(storage.raw(memberKeyOf(idA, fixture.name)), null)
})

test('a stale tab gets member_mismatch on GET and recovers to the cookie member', async () => {
  const server = new FakeServer(fixtureRegistry)
  const tabB = createStore(makeEnv({ server, storage: new FakeStorage() }).env)
  assert.equal(await tabB.signUp(B.email, B.password), null)
  const idB = memberIdOf(server, B.email)
  tabB.getSlot(fixture).update((doc) => ({ ...doc, best: 60 }))
  await waitFor(() => server.rowDoc(idB, fixture.name)?.best === 60)

  const storage = new FakeStorage()
  storage.map.set('tm_member', 'stale-a')
  storage.map.set(
    memberKeyOf('stale-a', fixture.name),
    JSON.stringify({ version: 2, doc: { best: 9, scores: {}, items: {} }, dirty: false }),
  )
  const store = createStore(makeEnv({ server, storage }).env)
  const slot = store.getSlot(fixture)
  assert.equal(slot.snapshot().best, 9)

  await waitFor(() => storage.raw('tm_member') === idB)
  await waitFor(() => slot.snapshot().best === 60)
  assert.equal(storage.raw(memberKeyOf('stale-a', fixture.name)), null)
  assert.deepEqual(server.rowDoc(idB, fixture.name), { best: 60, scores: {}, items: {} })
})

test('delete from a stale tab gets member_mismatch and deletes nothing', async () => {
  const server = new FakeServer(fixtureRegistry)
  const tabB = createStore(makeEnv({ server, storage: new FakeStorage() }).env)
  assert.equal(await tabB.signUp(B.email, B.password), null)
  const idB = memberIdOf(server, B.email)
  await waitFor(() => server.requests.length >= 2)

  const gate = deferredFetch(server, false, (input) => String(input).includes('/api/me/delete'))
  const storage = new FakeStorage()
  const store = createStore(makeEnv({ server, storage, fetchFn: gate.fetch }).env)
  assert.equal(await store.signUp(A.email, A.password), null)
  const idA = memberIdOf(server, A.email)

  gate.hold()
  // the drain is served while the cookie is still A; only the delete is held
  const deleting = store.deleteAccount(A.password)
  await waitFor(() => gate.heldCount() === 1, 'delete POST held')
  server.cookie = idB
  await gate.release()

  assert.equal(await deleting, false)
  await waitFor(() => storage.raw('tm_member') === idB)
  assert.ok(server.members.has(idA))
  assert.ok(server.members.has(idB))
})

test('a removal beats a stale live add stamped by a clock a year ahead', async () => {
  const YEAR = 365 * 24 * 60 * 60 * 1000
  const server = new FakeServer(fixtureRegistry)
  const tab1 = createStore(makeEnv({ server, storage: new FakeStorage() }).env)
  const tab2 = createStore(makeEnv({ server, storage: new FakeStorage() }).env)
  const slot1 = tab1.getSlot(fixture)
  const slot2 = tab2.getSlot(fixture)

  assert.equal(await tab1.signUp(A.email, A.password), null)
  const id = memberIdOf(server, A.email)
  await waitFor(() => server.row(id, fixture.name) !== null)

  slot1.update((doc) => ({ ...doc, items: { ...doc.items, helm: { at: Date.now() + YEAR } } }))
  await waitFor(() => server.rowDoc(id, fixture.name)?.items.helm !== undefined)

  assert.equal(await tab2.signIn(A.email, A.password), true)
  await waitFor(() => slot2.snapshot().items.helm !== undefined)
  slot2.update((doc) => ({ ...doc, items: { ...doc.items, helm: { at: stamp(doc.items), removed: true } } }))
  await waitFor(() => server.rowDoc(id, fixture.name)?.items.helm?.removed === true)
  const removedAt = server.rowDoc(id, fixture.name)?.items.helm?.at

  slot1.update((doc) => ({ ...doc, best: 1 }))
  await waitFor(() => server.rowDoc(id, fixture.name)?.best === 1)
  assert.equal(server.rowDoc(id, fixture.name)?.items.helm?.removed, true)
  assert.equal(server.rowDoc(id, fixture.name)?.items.helm?.at, removedAt)
  await waitFor(() => slot1.snapshot().items.helm?.removed === true)
})

test('throwing storage still works in memory', async () => {
  const server = new FakeServer(fixtureRegistry)
  const storage = new FakeStorage()
  storage.throwing = true
  const store = createStore(makeEnv({ server, storage }).env)
  const slot = store.getSlot(fixture)

  slot.update((doc) => ({ ...doc, best: 3 }))
  assert.equal(slot.snapshot().best, 3)

  assert.equal(await store.signUp(A.email, A.password), null)
  const id = memberIdOf(server, A.email)
  await waitFor(() => server.rowDoc(id, fixture.name)?.best === 3)
  assert.equal(slot.snapshot().best, 3)
  assert.equal(store.getMemberSnapshot()?.id, id)
})

test('changePassword and deleteAccount follow the route contract', async () => {
  const server = new FakeServer(fixtureRegistry)
  const storage = new FakeStorage()
  const store = createStore(makeEnv({ server, storage }).env)
  const slot = store.getSlot(fixture)

  assert.equal(await store.signUp(A.email, A.password), null)
  const id = memberIdOf(server, A.email)
  await waitFor(() => server.row(id, fixture.name) !== null)

  assert.equal(await store.changePassword('wrong', 'new-pw'), false)
  assert.equal(await store.changePassword(A.password, 'new-pw'), true)

  const other = createStore(makeEnv({ server, storage: new FakeStorage() }).env)
  assert.equal(await other.signIn(A.email, 'new-pw'), true)
  assert.equal(await other.signIn(A.email, A.password), false)

  slot.update((doc) => ({ ...doc, best: 2 }))
  assert.equal(await store.deleteAccount('nope'), false)
  assert.equal(store.getMemberSnapshot()?.id, id)

  assert.equal(await store.deleteAccount('new-pw'), true)
  assert.equal(server.members.has(id), false)
  assert.equal(store.getMemberSnapshot(), null)
  assert.equal(storage.raw('tm_member'), null)
  assert.equal(storage.raw(memberKeyOf(id, fixture.name)), null)
})

test('refreshMember adopts the server member and handles sign-out elsewhere', async () => {
  const server = new FakeServer(fixtureRegistry)
  const storage = new FakeStorage()
  const store1 = createStore(makeEnv({ server, storage }).env)
  store1.getSlot(fixture)
  assert.equal(await store1.signUp(A.email, A.password), null)
  const id = memberIdOf(server, A.email)
  await waitFor(() => server.row(id, fixture.name) !== null)

  const store2 = createStore(makeEnv({ server, storage }).env)
  assert.equal(store2.getMemberSnapshot()?.id, id)
  assert.equal(store2.getMemberSnapshot()?.email, '')
  await store2.refreshMember()
  assert.equal(store2.getMemberSnapshot()?.email, A.email)

  server.cookie = null
  await store2.refreshMember()
  assert.equal(store2.getMemberSnapshot(), null)
  assert.equal(storage.raw('tm_member'), null)
  assert.notEqual(storage.raw(memberKeyOf(id, fixture.name)), null)
})

test('a signing tab drains dirty data even with storage throwing midway', async () => {
  const server = new FakeServer(fixtureRegistry)
  const storage = new FakeStorage()
  const store = createStore(makeEnv({ server, storage }).env)
  const slot = store.getSlot(fixture)

  slot.update((doc) => ({ ...doc, best: 7 }))
  storage.throwing = true
  assert.equal(await store.signUp(A.email, A.password), null)
  const id = memberIdOf(server, A.email)
  await waitFor(() => server.rowDoc(id, fixture.name)?.best === 7)
  await sleep(10)
})
