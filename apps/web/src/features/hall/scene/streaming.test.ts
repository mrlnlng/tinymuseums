import assert from 'node:assert/strict'
import { test } from 'node:test'
import type { HallSliceDto } from '@tiny/core'
import {
  needsMore,
  planStreaming,
  SliceFeed,
  type SlotSnapshot,
  type StreamingInput,
  type StreamAction,
} from './streaming.ts'

function input(overrides: Partial<StreamingInput> = {}): StreamingInput {
  return {
    slots: [],
    mounts: [],
    cameraX: 0,
    now: 1000,
    inFlight: 0,
    mountRadiusUnits: 1,
    loadRadiusUnits: 2,
    minDwellMs: 100,
    maxConcurrentLoads: 2,
    maxTextureAttempts: 4,
    ...overrides,
  }
}

function slot(overrides: Partial<SlotSnapshot> & { index: number }): SlotSnapshot {
  return {
    status: 'idle',
    hasThumbhash: true,
    hasTexture: false,
    attempts: 0,
    retryAt: 0,
    readyAt: undefined,
    inRangeAt: undefined,
    centerX: overrides.index,
    ...overrides,
  }
}

function kinds(actions: StreamAction[], kind: StreamAction['kind']): StreamAction[] {
  return actions.filter((action) => action.kind === kind)
}

function flush(): Promise<void> {
  return new Promise((resolve) => setImmediate(resolve))
}

test('at most one slot mounts per frame', () => {
  const actions = planStreaming(
    input({ slots: [slot({ index: 0, centerX: 0 }), slot({ index: 1, centerX: 0.5 })] }),
  )
  assert.deepEqual(kinds(actions, 'mount'), [{ kind: 'mount', index: 0 }])
})

test('a placeholder mount requires a thumbhash', () => {
  const missing = planStreaming(input({ slots: [slot({ index: 0, hasThumbhash: false })] }))
  assert.deepEqual(kinds(missing, 'mount'), [])

  const present = planStreaming(input({ slots: [slot({ index: 0, hasThumbhash: true })] }))
  assert.deepEqual(kinds(present, 'mount'), [{ kind: 'mount', index: 0 }])
})

test('the dwell floor delays a ready mount', () => {
  const entering = planStreaming(
    input({ now: 1000, slots: [slot({ index: 0, status: 'ready', hasTexture: true, readyAt: 900 })] }),
  )
  assert.deepEqual(entering, [{ kind: 'enterRange', index: 0 }])

  const early = planStreaming(
    input({
      now: 1099,
      slots: [slot({ index: 0, status: 'ready', hasTexture: true, readyAt: 900, inRangeAt: 1000 })],
    }),
  )
  assert.deepEqual(kinds(early, 'mount'), [])

  const due = planStreaming(
    input({
      now: 1100,
      slots: [slot({ index: 0, status: 'ready', hasTexture: true, readyAt: 900, inRangeAt: 1000 })],
    }),
  )
  assert.deepEqual(kinds(due, 'mount'), [{ kind: 'mount', index: 0 }])
})

test('a placeholder-mounted slot fades in when its texture is ready', () => {
  const actions = planStreaming(
    input({
      slots: [slot({ index: 0, status: 'ready', hasTexture: true, inRangeAt: 0 })],
      mounts: [{ index: 0, showsPlaceholder: true, fading: false }],
    }),
  )
  assert.deepEqual(kinds(actions, 'fade'), [{ kind: 'fade', index: 0 }])
})

test('beyond the load radius an error slot is unmounted', () => {
  const actions = planStreaming(
    input({ loadRadiusUnits: 2, slots: [slot({ index: 0, status: 'error', centerX: 5 })] }),
  )
  assert.deepEqual(actions, [{ kind: 'unmount', index: 0 }])
})

test('between the mount and load radii a ready slot only loses its mesh', () => {
  const actions = planStreaming(
    input({
      mountRadiusUnits: 1,
      loadRadiusUnits: 2,
      slots: [slot({ index: 0, status: 'ready', hasTexture: true, centerX: 1.5 })],
      mounts: [{ index: 0, showsPlaceholder: false, fading: false }],
    }),
  )
  assert.deepEqual(actions, [{ kind: 'unmountMesh', index: 0 }])
})

test('loads are nearest-first and capped by the in-flight limit', () => {
  const slots = [
    slot({ index: 0, centerX: 3 }),
    slot({ index: 1, centerX: 1 }),
    slot({ index: 2, centerX: 2 }),
  ]

  const actions = planStreaming(input({ slots, mountRadiusUnits: 0.5, loadRadiusUnits: 5 }))
  assert.deepEqual(kinds(actions, 'load'), [
    { kind: 'load', index: 1 },
    { kind: 'load', index: 2 },
  ])

  const alreadyBusy = planStreaming(
    input({ slots, mountRadiusUnits: 0.5, loadRadiusUnits: 5, inFlight: 1 }),
  )
  assert.deepEqual(kinds(alreadyBusy, 'load'), [{ kind: 'load', index: 1 }])
})

test('an error slot retries only while attempts remain and the delay has passed', () => {
  const error = { index: 0, status: 'error' as const, attempts: 1, retryAt: 1000, centerX: 3 }

  const eligible = planStreaming(input({ now: 1000, loadRadiusUnits: 5, slots: [slot(error)] }))
  assert.deepEqual(kinds(eligible, 'load'), [{ kind: 'load', index: 0 }])

  const tooEarly = planStreaming(input({ now: 999, loadRadiusUnits: 5, slots: [slot(error)] }))
  assert.deepEqual(kinds(tooEarly, 'load'), [])

  const exhausted = planStreaming(
    input({ now: 1000, loadRadiusUnits: 5, slots: [slot({ ...error, attempts: 4 })] }),
  )
  assert.deepEqual(kinds(exhausted, 'load'), [])
})

test('enterRange is emitted only while inRangeAt is unset', () => {
  const fresh = planStreaming(input({ slots: [slot({ index: 0, status: 'loading', centerX: 0 })] }))
  assert.deepEqual(kinds(fresh, 'enterRange'), [{ kind: 'enterRange', index: 0 }])

  const seen = planStreaming(
    input({ slots: [slot({ index: 0, status: 'loading', centerX: 0, inRangeAt: 5 })] }),
  )
  assert.deepEqual(kinds(seen, 'enterRange'), [])
})

test('needsMore follows the prefetch threshold', () => {
  const base = { nextIndex: 3, known: 2, centerX: [1, 5], prefetchAheadUnits: 16 }
  assert.equal(needsMore({ ...base, nextIndex: null, visitorX: 100 }), false)
  assert.equal(needsMore({ ...base, known: 0, centerX: [], visitorX: -100 }), true)
  assert.equal(needsMore({ ...base, visitorX: -11 }), false)
  assert.equal(needsMore({ ...base, visitorX: -10 }), true)
  assert.equal(needsMore({ ...base, visitorX: -12 }), false)
})

test('SliceFeed backs off 500ms, 1000ms, 2000ms ... capped at 10000ms', async () => {
  let now = 0
  const feed = new SliceFeed({
    sliceSize: 6,
    now: () => now,
    fetchSlice: () => Promise.reject(new Error('offline')),
    onSlice: () => {},
  })

  const delays: number[] = []
  for (let i = 0; i < 7; i++) {
    now = feed.retryAt
    feed.maybeFetch(0, 0)
    await flush()
    delays.push(feed.retryAt - now)
  }
  assert.deepEqual(delays, [500, 1000, 2000, 4000, 8000, 10000, 10000])
})

test('SliceFeed resets its failure count after a successful slice', async () => {
  let now = 0
  let reject = true
  const received: HallSliceDto[] = []
  const feed = new SliceFeed({
    sliceSize: 6,
    now: () => now,
    fetchSlice: () =>
      reject ? Promise.reject(new Error('offline')) : Promise.resolve({} as HallSliceDto),
    onSlice: (slice) => received.push(slice),
  })

  feed.maybeFetch(0, 0)
  await flush()
  assert.equal(feed.failures, 1)

  now = feed.retryAt
  reject = false
  feed.maybeFetch(0, 0)
  await flush()
  assert.equal(feed.failures, 0)
  assert.equal(received.length, 1)
})

test('SliceFeed never starts a second fetch while one is in flight', async () => {
  let calls = 0
  let settle: (value: HallSliceDto) => void = () => {}
  const feed = new SliceFeed({
    sliceSize: 6,
    now: () => 0,
    fetchSlice: () => {
      calls += 1
      return new Promise<HallSliceDto>((resolve) => {
        settle = resolve
      })
    },
    onSlice: () => {},
  })

  feed.maybeFetch(0, 0)
  feed.maybeFetch(0, 0)
  feed.maybeFetch(0, 0)
  assert.equal(calls, 1)
  assert.equal(feed.isFetching, true)

  settle({} as HallSliceDto)
  await flush()
  assert.equal(feed.isFetching, false)
})

test('SliceFeed does not fetch without a next index', () => {
  let calls = 0
  const feed = new SliceFeed({
    sliceSize: 6,
    now: () => 0,
    fetchSlice: () => {
      calls += 1
      return Promise.resolve({} as HallSliceDto)
    },
    onSlice: () => {},
  })

  feed.maybeFetch(0, null)
  assert.equal(calls, 0)
  assert.equal(feed.isFetching, false)
})

test('SliceFeed passes the epoch, cursor and slice size to fetchSlice', async () => {
  const calls: [number, number, number][] = []
  const feed = new SliceFeed({
    sliceSize: 6,
    now: () => 0,
    fetchSlice: (epochId, after, limit) => {
      calls.push([epochId, after, limit])
      return Promise.resolve({} as HallSliceDto)
    },
    onSlice: () => {},
  })

  feed.maybeFetch(7, 3)
  await flush()
  assert.deepEqual(calls, [[7, 3, 6]])
})
