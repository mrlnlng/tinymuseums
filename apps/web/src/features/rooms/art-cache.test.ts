import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createArtCache } from './art-cache.ts'

function harness(fail: Set<string> = new Set()) {
  const loads: string[] = []
  const unloads: string[] = []
  const timers = new Map<number, () => void>()
  let nextTimer = 1
  const cache = createArtCache<string, string>({
    load: async (id) => {
      loads.push(id)
      if (fail.has(id)) throw new Error(`no ${id}`)
      return `${id}-art`
    },
    unload: (_id, art) => unloads.push(art),
    keepMs: 60_000,
    setTimer: (run) => {
      const id = nextTimer++
      timers.set(id, run)
      return id
    },
    clearTimer: (id) => timers.delete(id as number),
  })
  const elapse = async () => {
    for (const [id, run] of [...timers]) {
      timers.delete(id)
      run()
    }
    await new Promise((resolve) => setImmediate(resolve))
  }
  return { cache, loads, unloads, timers, elapse }
}

test('a prefetched room is reused by the room that opens and reports itself warm', async () => {
  const { cache, loads } = harness()
  cache.prefetch('atelier')
  await new Promise((resolve) => setImmediate(resolve))
  const held = cache.acquire('atelier')
  assert.equal(held.loaded, true)
  assert.deepEqual(await held.loading, { ok: true, art: 'atelier-art' })
  assert.deepEqual(loads, ['atelier'])
})

test('a room opened before its art arrives is cold', () => {
  const { cache } = harness()
  assert.equal(cache.acquire('hall').loaded, false)
})

test('art in use is never dropped, and stays for the keep time after release', async () => {
  const { cache, unloads, elapse } = harness()
  cache.prefetch('hall')
  cache.acquire('hall')
  await elapse()
  assert.equal(cache.has('hall'), true)

  cache.release('hall')
  assert.equal(cache.has('hall'), true)
  await elapse()
  assert.equal(cache.has('hall'), false)
  assert.deepEqual(unloads, ['hall-art'])
})

test('coming back within the keep time cancels the unload', async () => {
  const { cache, loads, unloads, elapse } = harness()
  cache.acquire('hall')
  cache.release('hall')
  cache.acquire('hall')
  await elapse()
  assert.equal(cache.has('hall'), true)
  assert.deepEqual(loads, ['hall'])
  assert.deepEqual(unloads, [])
})

test('an unused prefetch is unloaded after the keep time', async () => {
  const { cache, unloads, elapse } = harness()
  cache.prefetch('atelier')
  await elapse()
  assert.equal(cache.has('atelier'), false)
  assert.deepEqual(unloads, ['atelier-art'])
})

test('a failed load is forgotten so the next visit retries', async () => {
  const failing = new Set(['atelier'])
  const { cache, loads } = harness(failing)
  const held = cache.acquire('atelier')
  assert.equal((await held.loading).ok, false)
  assert.equal(cache.has('atelier'), false)
  cache.release('atelier')

  failing.clear()
  const retry = cache.acquire('atelier')
  assert.deepEqual(await retry.loading, { ok: true, art: 'atelier-art' })
  assert.deepEqual(loads, ['atelier', 'atelier'])
})

test('clear unloads everything, in use or not', async () => {
  const { cache, unloads } = harness()
  cache.acquire('hall')
  cache.prefetch('atelier')
  cache.clear()
  await new Promise((resolve) => setImmediate(resolve))
  assert.deepEqual(unloads.sort(), ['atelier-art', 'hall-art'])
  assert.equal(cache.has('hall'), false)
})
