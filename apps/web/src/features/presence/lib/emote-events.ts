import type { Emote } from '@tiny/core/presence/wire'

// The emote button lives in the screen chrome, the room in the scene; they meet through events.
const EMOTE_EVENT = 'tiny:emote'
const PRESENCE_EVENT = 'tiny:presence'
let inRoom = false

// Placeholder bubbles until the painted ones arrive.
export const EMOTE_LABELS: Record<Emote, string> = { wave: 'hi!', heart: '♥', sparkle: '✦', ooh: 'ooh!' }
export const EMOTE_NAMES: Record<Emote, string> = { wave: 'Wave', heart: 'Heart', sparkle: 'Sparkle', ooh: 'Ooh' }

export function requestEmote(e: Emote): void {
  window.dispatchEvent(new CustomEvent<Emote>(EMOTE_EVENT, { detail: e }))
}

export function onEmoteRequest(listener: (e: Emote) => void): () => void {
  const handle = (event: Event) => listener((event as CustomEvent<Emote>).detail)
  window.addEventListener(EMOTE_EVENT, handle)
  return () => window.removeEventListener(EMOTE_EVENT, handle)
}

/** Whether this page is in a room, so the emote button shows only when someone could see it. */
export function setInRoom(value: boolean): void {
  if (value === inRoom) return
  inRoom = value
  window.dispatchEvent(new Event(PRESENCE_EVENT))
}

export function isInRoom(): boolean {
  return inRoom
}

export function onInRoomChange(listener: () => void): () => void {
  window.addEventListener(PRESENCE_EVENT, listener)
  return () => window.removeEventListener(PRESENCE_EVENT, listener)
}
