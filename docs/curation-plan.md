# Curating the paintings (2026-11-07)

The owner uploads every painting and decides where each one hangs, from the studio. Visitors
collect; they do not upload. If they ever do, it is one simple spot in their own personal
room, apart from the owner's library.

**Built:** the spot registry, the fashion area's spots, placing from the studio, publish and
discard per location, and the frames drawing what is published. **Not yet:** credits, and
retiring self-serve artists.

## The idea

Every place a painting can hang is a **spot** in a **location**. Spots are declared in code
next to the room that draws them, so adding a placeholder frame to a room is what makes it
appear in the studio. In the studio, each painting has a **Location** picker: choose a location
(the fashion area, the hall, a future room), then a spot in it. That painting hangs there in
production with no deploy. A new room brings its spots with it and shows up in the picker by
itself.

## Where things stand

| | Hall | Fashion area |
| --- | --- | --- |
| Where the paintings come from | Studio uploads (`/studio`), stored in S3 | Files in the repo, baked in at build time |
| Who places them | The `HALL_OWNER_EMAIL` account, with the hall arranger in the game | Code (`scene/atelier-layout.ts`) |
| Where the arrangement lives | `rooms` row `hall`, draft then published | Code |
| What visitors see | A sealed epoch of the published hall | The build |

The hall already shows only the owner's paintings (`sealEpoch` filters by `HALL_OWNER_EMAIL`).

## The model

1. **One library.** Every painting is a studio upload under the owner's account. The studio's
   upload, processing and S3 storage stay as they are.
2. **A registry of spots** (`packages/core/src/spots.ts`, shared by the game and the studio).
   Each location lists its spots with a label for the studio:

   ```ts
   export const LOCATIONS = [
     { id: 'atelier', label: 'The fashion area', kind: 'spots', spots: [
       { id: 'kiki.right', label: 'The Kiki Collection · right frame', aspect: 0.7 },
       { id: 'floral.left', label: 'The Floral Collection · left frame', aspect: 0.7 },
       ...
     ] },
     { id: 'hall', label: 'The hall', kind: 'row', spots: [] },
   ]
   ```

   A test keeps the fashion area's list and the frames in `atelier-layout.ts` in step. `aspect`
   is the frame's opening; a painting is cropped to fill it.
3. **Two kinds of location.**
   - **Fixed spots**, like the fashion area's frames: one painting each. Choosing a taken spot
     says which painting it replaces.
   - **An ordered row**, the hall: choose "Hall", then where in the row (at the end, or after a
     named painting). Gallery rooms grow to fit, as now.
4. **Where it is stored.** Each location is a shared `rooms` row (`hall`, `atelier`) with the
   draft and published placements rooms already have; a spot is a zone of the location's theme.
   Each fixed spot holds at most one painting, and each painting hangs in one place at a time.
   Publishing the hall still seals an epoch, so everyone in a multiplayer room sees the same hall.
5. **Credits.** A painting gets the artist it is by: a name and a handle (`@jazlynn.art`),
   shown in the painting view and, for a collection room, on its tag.

### The fashion area's spots

| Room | Left frame | Right frame |
| --- | --- | --- |
| Kiki | (the Kiki painting, its own frame) | `kiki.right` |
| Floral | `floral.left` | `floral.right` |
| Gold | `gold.left` | `gold.right` |
| Bruce's Chronicles | `bruce.left` | `bruce.right` |

An empty spot shows the placeholder canvas.

## Building it

### 1. The registry and the table

- `spots.ts` in `@tiny/core` lists the spots, and a test checks every painting frame in
  `atelier-layout.ts` has one and every spot id is unique.
- The `atelier` room row, with a theme whose zones are its spots. Saving checks the spot exists,
  the painting is the owner's, and the painting is ready.

### 2. The studio's Location picker

- On each painting in `/studio/gallery`: "Location: not placed", or where it hangs now.
- Choose opens a two-step picker: the location, then its spots, each showing what hangs there
  now (a thumbnail, or "empty"). For the hall, the row of paintings to place it among.
- A location's own page in the studio shows all its spots at once, filled and empty, so the
  owner can see a whole room and fill its gaps.
- Only the owner account sees any of this.

### 3. The rooms draw what is placed

- The atelier page reads its placements on the server, like the hall page reads its slice,
  and gives each spot its painting's image URL and size.
- The frames draw the painting's unframed copy, picked from its upload's resized derivatives
  with `pickDerivative` (as `domain/artists.ts` does), not the hall's framed image. It is
  cropped to the frame's opening, centred; the placeholder shows while it loads or if it fails.
- The hall seals its epoch from the hall's row of placements instead of the arranger's draft.
  The in-game hall arranger then goes, or becomes a shortcut to the studio's hall page.

### 4. Credits

- Add `artist_name` and `artist_handle` to `pieces`, edited in the studio.
- Show them in the painting view and on collection tags.

### 5. Retiring self-serve artists

Once nothing depends on them, remove public artist sign-up (`/studio/register`), the publish
checks (`domain/publish.ts`), and the artist's own display arrangement (`displays`). The studio
becomes the owner's tool. Check the analytics, guest board and bug pages before removing
anything they use.

## Decided

- **Publish per location.** Placing edits a location's draft; Publish puts it live, Discard
  goes back to what is live. The studio marks a location with unpublished changes.
- **Only paintings are spots.** A frame that does anything else (a portrait that changes your
  character) or is part of an artwork (the Kiki painting in its own gilt frame) is not a spot.
- **Collection titles and bylines stay in code** for now.

## How it is built

| Piece | Where |
| --- | --- |
| The registry: locations and their spots | `packages/core/src/rooms/spots.ts` |
| The fashion area's theme: one painting per frame (`capacity: 1`) | `rooms/themes.ts`, checked in `placements.ts` |
| Placing, moving along the hall, publish, discard; what each spot shows | `packages/core/src/domain/locations.ts` |
| The `atelier` room row | `packages/core/schema/rooms.sql` |
| The studio's Locations page and the picker on each painting | `app/studio/locations`, `features/studio/components/PlacePicker.tsx`, `features/studio/actions.ts` |
| The fashion rooms drawing published paintings | `app/museum/atelier/page.tsx` reads them; `scene/atelier.ts` (`hang`) crops each to its frame |

To add a spot: give a collection room a painting frame in `atelier-layout.ts` and its id in
`ATELIER_SPOTS`. A test fails until the two agree. A new location is a `LOCATIONS` entry, a
theme of the same id, and its room row.

A hall that was never arranged shows the studio floor's order. Its row in the studio starts from
that order (leaving out paintings already in a frame), so placing one painting adds to the hall
rather than replacing it. The in-game hall arranger edits the same draft and still works.

## Testing

The local `.env` sets `HALL_OWNER_EMAIL` to the local test artist. Checked in the browser: hanging
from the Locations page and from a painting's picker, replacing a frame's painting, moving one
from the hall to a frame, publishing, discarding, and the paintings in the fashion rooms' frames.
