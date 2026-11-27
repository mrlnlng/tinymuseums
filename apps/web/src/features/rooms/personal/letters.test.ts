import assert from 'node:assert/strict'
import { test } from 'node:test'
import { LETTERS, letterById, fillName } from '../../letters/letters.ts'
import {
  emptyProgress,
  openLetterProgress,
  questView,
  recordEvent,
  startProgress,
  unopenedLetters,
} from '../../letters/progress.ts'

test('all eight letters are data, available flags and chain are explicit', () => {
  assert.equal(LETTERS.length, 8)
  assert.deepEqual(
    LETTERS.map((letter) => letter.id),
    [0, 1, 2, 3, 4, 5, 6, 7],
  )
  assert.deepEqual(
    LETTERS.map((letter) => letter.available),
    [true, true, true, true, true, false, false, false],
  )
  for (const letter of LETTERS) {
    assert.match(letter.body, /\[Name\]/)
    assert.ok(letter.body.endsWith('\nWally'))
  }
  assert.equal(letterById(0)?.next, 1)
  assert.equal(letterById(4)?.next, 5)
  assert.equal(letterById(7)?.next, null)
  assert.equal(fillName(letterById(1)!.body, 'Ada'), letterById(1)!.body.replace('[Name]', 'Ada'))
})

test('letter 0 arrives at the start, before any quest event', () => {
  const progress = startProgress()
  assert.deepEqual(progress.delivered, [0])
  assert.deepEqual(progress.completed, [])
  assert.deepEqual(unopenedLetters(progress).map((letter) => letter.id), [0])
})

test('cleaning the room completes letter 0 and hands over letter 1', () => {
  const progress = recordEvent(startProgress(), 'room-clean')
  assert.deepEqual(progress.completed, [0])
  assert.deepEqual(progress.delivered, [0, 1])
})

test('placing a decoration completes letter 1 and hands over letter 2', () => {
  const cleaned = recordEvent(startProgress(), 'room-clean')
  const decorated = recordEvent(cleaned, 'place-decoration')
  assert.deepEqual(decorated.completed, [0, 1])
  assert.deepEqual(decorated.delivered, [0, 1, 2])
})

test('viewing artwork counts distinct pieces and needs three', () => {
  let progress = recordEvent(startProgress(), 'room-clean')
  progress = recordEvent(progress, 'place-decoration')
  progress = recordEvent(progress, 'view-artwork', 'piece-a')
  progress = recordEvent(progress, 'view-artwork', 'piece-b')
  assert.deepEqual(progress.completed, [0, 1])
  assert.equal(progress.counters['view-artwork'], 2)
  assert.equal(questView(progress, letterById(2)!).done, 2)

  progress = recordEvent(progress, 'view-artwork', 'piece-c')
  assert.deepEqual(progress.completed, [0, 1, 2])
  assert.deepEqual(progress.delivered, [0, 1, 2, 3])
  assert.equal(questView(progress, letterById(2)!).done, 3)
})

test('the chain stops at the first unavailable letter', () => {
  let progress = startProgress()
  progress = recordEvent(progress, 'room-clean')
  progress = recordEvent(progress, 'place-decoration')
  for (const piece of ['a', 'b', 'c']) progress = recordEvent(progress, 'view-artwork', piece)
  progress = recordEvent(progress, 'finish-minigame')
  progress = recordEvent(progress, 'change-outfit')
  assert.deepEqual(progress.completed, [0, 1, 2, 3, 4])
  assert.deepEqual(progress.delivered, [0, 1, 2, 3, 4])
  assert.ok(!progress.delivered.includes(5))
})

test('a repeated event is idempotent, counted and plain alike', () => {
  const cleaned = recordEvent(startProgress(), 'room-clean')
  const again = recordEvent(cleaned, 'room-clean')
  assert.equal(again, cleaned)

  let progress = recordEvent(startProgress(), 'room-clean')
  progress = recordEvent(progress, 'place-decoration')
  progress = recordEvent(progress, 'view-artwork', 'piece-a')
  const duplicate = recordEvent(progress, 'view-artwork', 'piece-a')
  assert.equal(duplicate, progress)
  assert.equal(duplicate.counters['view-artwork'], 1)
})

test('an early event is kept and completes as soon as its letter arrives', () => {
  // A visitor decorates before opening letter 1; cleaning then hands over 1 and 2 together.
  let progress = recordEvent(startProgress(), 'place-decoration')
  assert.deepEqual(progress.delivered, [0])
  progress = recordEvent(progress, 'room-clean')
  assert.deepEqual(progress.completed, [0, 1])
  assert.deepEqual(progress.delivered, [0, 1, 2])
})

test('opening a letter is recorded once and does not invent an unavailable next letter', () => {
  let progress = startProgress()
  progress = openLetterProgress(progress, 0)
  assert.deepEqual(progress.opened, [0])
  assert.equal(openLetterProgress(progress, 0), progress)
  assert.equal(openLetterProgress(progress, 3), progress)
})

test('empty progress has no delivered letters', () => {
  assert.deepEqual(emptyProgress().delivered, [])
})
