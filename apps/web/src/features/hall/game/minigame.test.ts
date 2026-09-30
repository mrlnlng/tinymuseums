import assert from 'node:assert/strict'
import { test } from 'node:test'
import { activeMiniGame, launchMiniGame } from './minigame.ts'

function makeGame(running = true) {
  const ops: string[] = []
  const values = new Map<string, unknown>()
  let shutdown = (): void => {}

  const hall = {
    scene: {
      pause: (key: string) => ops.push(`pause:${key}`),
      resume: (key: string) => ops.push(`resume:${key}`),
      launch: (key: string) => ops.push(`launch:${key}`),
    },
  }
  const mini = {
    events: {
      once: (_event: string, callback: () => void) => {
        shutdown = callback
      },
    },
  }
  const game = {
    registry: {
      get: (key: string) => values.get(key) ?? null,
      set: (key: string, value: unknown) => {
        values.set(key, value)
      },
    },
    scene: {
      getScene: (key: string) => (key === 'hall' ? hall : key === 'demo' ? mini : null),
    },
    loop: {
      running,
      wake: () => ops.push('wake'),
    },
  }

  return { game, ops, triggerShutdown: () => shutdown() }
}

test('launchMiniGame pauses the hall, launches the mini-game and resumes on shutdown', () => {
  const { game, ops, triggerShutdown } = makeGame()

  launchMiniGame(game as never, 'demo', { level: 1 })

  assert.equal(activeMiniGame(game as never), 'demo')
  assert.deepEqual(ops, ['pause:hall', 'launch:demo'])

  triggerShutdown()

  assert.equal(activeMiniGame(game as never), null)
  assert.deepEqual(ops, ['pause:hall', 'launch:demo', 'resume:hall'])
})

test('launchMiniGame ignores a second launch while one is running', () => {
  const { game, ops } = makeGame()

  launchMiniGame(game as never, 'demo')
  launchMiniGame(game as never, 'demo')

  assert.deepEqual(ops, ['pause:hall', 'launch:demo'])
})

test('launchMiniGame wakes a sleeping loop and wakes it again on shutdown', () => {
  const { game, ops, triggerShutdown } = makeGame(false)

  launchMiniGame(game as never, 'demo')
  assert.deepEqual(ops, ['wake', 'pause:hall', 'launch:demo'])

  ops.length = 0
  triggerShutdown()
  assert.deepEqual(ops, ['resume:hall', 'wake'])
})
