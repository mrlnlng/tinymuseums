import type { Refusal } from '@tiny/core/presence/wire'

// The chat panel lives in the screen chrome, the room in the scene; they meet here.

let inRoom = false
let people: Person[] = []
const muted = new Set<string>()

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
