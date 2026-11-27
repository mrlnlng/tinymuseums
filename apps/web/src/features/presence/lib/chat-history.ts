/**
 * A short, tab-local chat history. The rooms only relay messages, so this is a convenience for
 * the visitor: recent lines survive closing the panel and moving between rooms in this tab.
 */
export interface ChatMessage {
  pid: string
  name: string
  text: string
  at: number
}

export const CHAT_HISTORY_LIMIT = 20
export const CHAT_HISTORY_WINDOW_MS = 30 * 60 * 1000
const KEY_PREFIX = 'tiny:chat-history:'

export interface ChatStorage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

/** A fallback for private browsing or a blocked sessionStorage: works until the tab closes. */
const memory = new Map<string, string>()

function raw(storage: ChatStorage | null, key: string): string | null {
  // The in-memory copy is freshest: a blocked or over-quota setItem must not hide a line we kept.
  const cached = memory.get(key)
  if (cached !== undefined) return cached
  if (storage) {
    try {
      const stored = storage.getItem(key)
      if (stored !== null) return stored
    } catch {}
  }
  return null
}

function save(storage: ChatStorage | null, key: string, value: string): void {
  memory.set(key, value)
  if (!storage) return
  try {
    storage.setItem(key, value)
  } catch {}
}

export function chatHistoryKey(room: string): string {
  return `${KEY_PREFIX}${room}`
}

function isMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== 'object') return false
  const message = value as Record<string, unknown>
  return (
    typeof message.pid === 'string' &&
    typeof message.name === 'string' &&
    typeof message.text === 'string' &&
    message.text.length > 0 &&
    typeof message.at === 'number' &&
    Number.isFinite(message.at)
  )
}

/** The recent messages in the window, oldest first, capped at the limit. */
export function parseChatHistory(
  stored: string | null,
  now: number,
  windowMs = CHAT_HISTORY_WINDOW_MS,
  limit = CHAT_HISTORY_LIMIT,
): ChatMessage[] {
  if (!stored) return []
  let parsed: unknown
  try {
    parsed = JSON.parse(stored)
  } catch {
    return []
  }
  if (!Array.isArray(parsed)) return []
  const oldest = now - windowMs
  return parsed.filter(isMessage).filter((message) => message.at >= oldest).slice(-limit)
}

export function readChatHistory(
  storage: ChatStorage | null,
  room: string,
  now: number,
  windowMs = CHAT_HISTORY_WINDOW_MS,
  limit = CHAT_HISTORY_LIMIT,
): ChatMessage[] {
  return parseChatHistory(raw(storage, chatHistoryKey(room)), now, windowMs, limit)
}

/** Adds one line and returns the new recent history. */
export function appendChatMessage(
  storage: ChatStorage | null,
  room: string,
  message: ChatMessage,
  now: number,
  windowMs = CHAT_HISTORY_WINDOW_MS,
  limit = CHAT_HISTORY_LIMIT,
): ChatMessage[] {
  const key = chatHistoryKey(room)
  const next = [...parseChatHistory(raw(storage, key), now, windowMs, limit), message].slice(-limit)
  save(storage, key, JSON.stringify(next))
  return next
}
