import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createTabTurn } from './tab-turn.ts'

const flush = () => new Promise((resolve) => setTimeout(resolve, 10))

/** A tab: its own BroadcastChannel (Node delivers between instances) and its own events. */
function tab(visible: boolean) {
  const listeners = new Map<string, () => void>()
  const state = { visible }
  const turn = createTabTurn({
    channel: new BroadcastChannel('tiny-presence-turn') as never,
    inUse: () => state.visible,
    listen: (event, run) => {
      listeners.set(event, run)
      return () => listeners.delete(event)
    },
  })
  return {
    turn,
    show() {
      state.visible = true
      listeners.get('visibilitychange')?.()
    },
    hide() {
      state.visible = false
      listeners.get('visibilitychange')?.()
    },
    focus: () => listeners.get('focus')?.(),
    close() {
      listeners.get('pagehide')?.()
      turn.dispose()
    },
  }
}

test('of two tabs, only the one opened last in view is in the room', async () => {
  const first = tab(true)
  await flush()
  const second = tab(true)
  await flush()
  assert.equal(first.turn.active(), false)
  assert.equal(second.turn.active(), true)
  first.close()
  second.close()
})

test('switching back to a tab gives it the turn', async () => {
  const first = tab(true)
  await flush()
  const second = tab(true)
  await flush()
  second.hide()
  first.show()
  await flush()
  assert.equal(first.turn.active(), true)
  assert.equal(second.turn.active(), false)
  first.close()
  second.close()
})

test('focusing a window side by side with another takes the turn', async () => {
  const left = tab(true)
  await flush()
  const right = tab(true)
  await flush()
  left.focus()
  await flush()
  assert.equal(left.turn.active(), true)
  assert.equal(right.turn.active(), false)
  left.close()
  right.close()
})

test('when the tab in the room closes, a tab still in view takes over; a hidden one does not', async () => {
  const shown = tab(true)
  await flush()
  const hidden = tab(true)
  hidden.hide()
  await flush()
  const active = tab(true)
  await flush()
  active.close()
  await flush()
  assert.equal(shown.turn.active(), true)
  assert.equal(hidden.turn.active(), false)
  shown.close()
  hidden.close()
})

test('without BroadcastChannel every tab joins, as before', () => {
  const turn = createTabTurn({ channel: null, inUse: () => false, listen: () => () => {} })
  assert.equal(turn.active(), true)
})
