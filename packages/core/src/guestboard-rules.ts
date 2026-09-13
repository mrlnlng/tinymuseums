// Imported by the browser through @tiny/core/guestboard, so it must not pull in any server code.
import type { GuestNoteColor } from './types.ts'

export const GUEST_NOTE_COLORS = ['pink', 'green'] as const satisfies readonly GuestNoteColor[]
export const MAX_GUEST_NAME = 40
export const MAX_GUEST_MESSAGE = 280
