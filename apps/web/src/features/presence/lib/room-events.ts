import type { Refusal } from '@tiny/core/presence/wire'
import { readLocal, writeLocal } from '@/shared/lib/browser-storage'
import { appendChatMessage, readChatHistory, type ChatMessage } from './chat-history'

// The chat panel lives in the screen chrome, the room in the scene; they meet here.

let inRoom = false
let people: Person[] = []
const muted = new Set<string>()
let room: string | null = null
let history: ChatMessage[] = []

const CHAT_MUTED_KEY = 'tiny:chat-muted'
let chatMuted =
  typeof window !== 'undefined' && readLocal(CHAT_MUTED_KEY) === '1'

export interface Person {
  pid: string
  name: string
}

export type SayResult = { ok: true } | { ok: false; reason: Refusal | 'closed' }

const SAY = 'tiny:say'
const SAY_RESULT = 'tiny:say-result'
const ROOM = 'tiny:presence'
const PEOPLE = 'tiny:people'
const MUTED = 'tiny:muted'
const CHAT_MUTED = 'tiny:chat-muted-changed'
const MESSAGES = 'tiny:chat-messages'
const OPEN_CHAT = 'tiny:open-chat'
const NAME = 'tiny:name-changed'

function on<T>(type: string, listener: (detail: T) => void): () => void {
  const handle = (event: Event) => listener((event as CustomEvent<T>).detail)
  window.addEventListener(type, handle)
  return () => window.removeEventListener(type, handle)
}

const emit = <T>(type: string, detail?: T) => window.dispatchEvent(new CustomEvent(type, { detail }))

export const requestSay = (text: string) => emit(SAY, text)
export const onSayRequest = (listener: (text: string) => void) => on(SAY, listener)
/** The room's answer: sent, or why not (including the room's own refusal, which arrives later). */
export const reportSay = (result: SayResult) => emit(SAY_RESULT, result)
export const onSayResult = (listener: (result: SayResult) => void) => on(SAY_RESULT, listener)

/** Whether this page is in a room, so the chat button shows only when someone could read it. */
export function setInRoom(value: boolean): void {
  if (value === inRoom) return
  inRoom = value
  emit(ROOM)
}
export const isInRoom = () => inRoom
export const onInRoomChange = (listener: () => void) => on(ROOM, listener)

/** Who else is in the room, for the panel's list. */
export function setPeople(next: readonly Person[]): void {
  if (next.length === people.length && next.every((p, i) => p.pid === people[i].pid && p.name === people[i].name)) return
  // Publish a stable snapshot only when names or membership change, not on every walk frame.
  people = next.map(({ pid, name }) => ({ pid, name }))
  emit(PEOPLE)
}
export const getPeople = () => people
export const onPeopleChange = (listener: () => void) => on(PEOPLE, listener)

function sessionStorage(): { getItem(key: string): string | null; setItem(key: string, value: string): void } | null {
  try {
    return typeof window === 'undefined' ? null : window.sessionStorage
  } catch {
    return null
  }
}

/** The room whose short history the panel should show, and its saved lines for this tab. */
export function setRoom(next: string | null): void {
  if (next === room) return
  room = next
  history = next === null ? [] : readChatHistory(sessionStorage(), next, Date.now())
  emit(MESSAGES)
}

/** Leaving one room must not clear the history of a room that has just replaced it. */
export function leaveRoom(value: string): void {
  if (room !== value) return
  room = null
  history = []
  emit(MESSAGES)
}

export function recordMessage(pid: string, name: string, text: string): void {
  if (room === null || text.length === 0) return
  const now = Date.now()
  history = appendChatMessage(sessionStorage(), room, { pid, name, text, at: now }, now)
  emit(MESSAGES)
}

export const getChatHistory = () => history

/** Re-reads the room's saved lines, so opening the panel after a while drops expired ones. */
export function refreshChatHistory(): ChatMessage[] {
  history = room === null ? [] : readChatHistory(sessionStorage(), room, Date.now())
  return history
}
export const onChatHistoryChange = (listener: () => void) => on(MESSAGES, listener)

/** Hides incoming chat, here and in the scene; kept on this device. */
export function setChatMuted(value: boolean): void {
  if (value === chatMuted) return
  chatMuted = value
  if (typeof window !== 'undefined') writeLocal(CHAT_MUTED_KEY, value ? '1' : '0')
  emit(CHAT_MUTED)
}
export const isChatMuted = () => chatMuted
export const onChatMutedChange = (listener: () => void) => on(CHAT_MUTED, listener)

/** Muted visitors' messages are hidden on this page; it lasts until the page closes. */
export function setMuted(pid: string, value: boolean): void {
  if (value === muted.has(pid)) return
  if (value) muted.add(pid)
  else muted.delete(pid)
  emit(MUTED)
}
export const isMuted = (pid: string) => muted.has(pid)
export const onMutedChange = (listener: () => void) => on(MUTED, listener)

/** Enter in the scene opens the panel with its text box focused. */
export const openChat = () => emit(OPEN_CHAT)
export const onOpenChat = (listener: () => void) => on(OPEN_CHAT, listener)

/** The visitor's own name changed; the room reconnects so the others see the new one. */
export const announceNameChange = () => emit(NAME)
export const onNameChange = (listener: () => void) => on(NAME, listener)
