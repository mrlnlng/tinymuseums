/*  Where the notes sit on the board screen, as percentages of the board
    drawing (guestboard/board.png): left and top edges, and width — each note
    is square-ish, so its height follows from its width.

    Hand-placed rather than computed, because the mock's board reads as notes
    pinned up by hand: a little out of line, and not all quite the same size. The
    first two are the mock's own notes, where it put them. The rest keep clear
    of the "guest board" lettering and the scalloped edge, and of each other.

    The newest note takes the first place, so a note someone has just left
    appears in the spot the mock draws; the board holds as many as there are
    places, and every note, pinned up or not, can be read by stepping through
    them one at a time. */

export interface NotePlace {
  left: number
  top: number
  width: number
}

export const NOTE_PLACES: readonly NotePlace[] = [
  { left: 12.3, top: 54.5, width: 11.4 },
  { left: 28.2, top: 60.7, width: 13.2 },
  { left: 45.0, top: 52.0, width: 11.8 },
  { left: 61.0, top: 57.0, width: 12.8 },
  { left: 77.5, top: 51.5, width: 11.6 },
  { left: 19.5, top: 35.0, width: 12.4 },
  { left: 36.5, top: 36.5, width: 11.2 },
  { left: 53.5, top: 35.5, width: 11.4 },
  { left: 70.0, top: 34.5, width: 12.6 },
  { left: 11.0, top: 71.0, width: 12.0 },
  { left: 44.0, top: 70.5, width: 13.0 },
  { left: 61.5, top: 73.5, width: 11.2 },
  { left: 78.5, top: 70.0, width: 11.8 },
]
