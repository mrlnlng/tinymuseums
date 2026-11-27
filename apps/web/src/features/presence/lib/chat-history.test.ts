import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  CHAT_HISTORY_LIMIT,
  CHAT_HISTORY_WINDOW_MS,
  appendChatMessage,
  chatHistoryKey,
  parseChatHistory,
  readChatHistory,
  type ChatMessage,
  type ChatStorage,
} from './chat-history.ts'

class MemoryStorage implements ChatStorage {
  private values = new Map<string, string>()
  getItem(key: string): string | null {
    return this.values.get(key) ?? null
  }
  setItem(key: string, value: string): void {
    this.values.set(key, value)
  }
}

const line = (index: number, at: number): ChatMessage => ({
  pid: `pid${index}`,
  name: `Name ${index}`,
  text: `message ${index}`,
  at,
})

test('history keeps the last twenty messages, oldest first', () => {
  const now = 100_000
  const stored = JSON.stringify(Array.from({ length: 25 }, (_, i) => line(i, now - 1000 + i)))
  const history = parseChatHistory(stored, now)
  assert.equal(history.length, CHAT_HISTORY_LIMIT)
  assert.equal(history[0].text, 'message 5')
  assert.equal(history.at(-1)?.text, 'message 24')
})

test('history drops messages outside the thirty-minute window', () => {
  const now = 10_000_000
  const stored = JSON.stringify([
    line(1, now - CHAT_HISTORY_WINDOW_MS - 1),
    line(2, now - CHAT_HISTORY_WINDOW_MS),
    line(3, now - 1000),
  ])
  assert.deepEqual(parseChatHistory(stored, now).map((message) => message.text), ['message 2', 'message 3'])
})

test('history ignores malformed entries and unreadable storage', () => {
  const now = 5000
  const stored = JSON.stringify([
    line(1, now - 100),
    { pid: 'x', name: 'x', text: '', at: now - 50 },
    { pid: 'x', name: 'x', text: 'no time' },
    null,
    line(2, now - 20),
  ])
  assert.deepEqual(parseChatHistory(stored, now).map((message) => message.text), ['message 1', 'message 2'])
  assert.deepEqual(parseChatHistory('{not json', now), [])
  assert.deepEqual(parseChatHistory('{}', now), [])
})

test('each room has its own history that survives reopening the panel', () => {
  const storage = new MemoryStorage()
  const now = 1_000_000
  const first = appendChatMessage(storage, 'atelier', line(1, now), now)
  assert.deepEqual(first.map((message) => message.text), ['message 1'])

  const reopened = readChatHistory(storage, 'atelier', now + 10)
  assert.deepEqual(reopened, first)
  assert.equal(storage.getItem(chatHistoryKey('atelier')), JSON.stringify(first))

  assert.deepEqual(readChatHistory(storage, 'pond', now + 10), [])
  appendChatMessage(storage, 'pond', line(2, now + 20), now + 20)
  assert.deepEqual(readChatHistory(storage, 'atelier', now + 30).map((message) => message.text), ['message 1'])
  assert.deepEqual(readChatHistory(storage, 'pond', now + 30).map((message) => message.text), ['message 2'])
})

test('appending keeps the buffer trimmed and still readable from storage', () => {
  const storage = new MemoryStorage()
  const now = 2_000_000
  for (let i = 0; i < CHAT_HISTORY_LIMIT + 5; i++) {
    appendChatMessage(storage, 'hall-e0', line(i, now + i), now + i)
  }
  const history = readChatHistory(storage, 'hall-e0', now + CHAT_HISTORY_LIMIT + 5)
  assert.equal(history.length, CHAT_HISTORY_LIMIT)
  assert.equal(history[0].text, 'message 5')
})

test('history still works in memory when storage is unavailable', () => {
  const now = 3_000_000
  const room = 'r-memory-test'
  appendChatMessage(null, room, line(1, now), now)
  assert.deepEqual(readChatHistory(null, room, now + 1).map((message) => message.text), ['message 1'])
})
