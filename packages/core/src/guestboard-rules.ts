import type { GuestNoteColor } from './types.ts'

/* What a guest note may be, shared by the server that enforces it and the browser that shapes its form around it. Nothing here may import anything with a runtime: the web client reaches this through "@tiny/core/guestboard", which must not drag the database driver into its bundle. */

export const GUEST_NOTE_COLORS = ['pink', 'green'] as const satisfies readonly GuestNoteColor[]
export const MAX_GUEST_NAME = 40
export const MAX_GUEST_MESSAGE = 280
