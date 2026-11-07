# Rooms

Rooms are interchangeable pieces of the museum that are linked by doors. A room
only describes its own contents. One shared **stage** owns everything else:
the renderer, camera, visitor, movement, taps, the door fade, presence and loading.

## Decisions (2026-11-05)

- **One persistent stage; rooms swap in place.** The stage lives in
  `app/museum/layout.tsx`, which the App Router keeps mounted across
  `/museum` ↔ `/museum/atelier`. Each page only names the active room, so URLs,
  deep links and the back button keep working without rebuilding the WebGL
  canvas or the character.
- **The museum stays side-scrolling; depth lives in minigames.** Shared and
  themed rooms keep today's 2D left-right style (polished, not reinvented),
  so the museum stays consistent. Rooms can offer minigames; joining one opens
  a modal in the museum's style, and inside it the 2D style is free to change,
  including depth (a pond to walk around). Depth there uses walkable areas:
  floor polygons with holes, the walkbox approach from 2D adventure games
  (`features/rooms/floor.ts`). (Changed 2026-11-05: an earlier plan put
  depth on the main stage.)

## Themes and arrangements (decided 2026-11-05)

Tiny Museum is turning into a cozy game for artists, not an art-upload site.
Rooms follow that.

A room has two layers:

- **Theme** (code, authored by the museum owner): backdrop art, fixed features
  (the pond), the walkable floor, **zones** (wall band, floor area, water
  edge…), and a **prop catalog** (dock, fishing house, lamps) saying which
  zones each prop fits. Phase 1's `RoomDef` grows into the theme.
- **Arrangement** (data, saved in the database): which theme a room uses, who
  owns it, and its placements. Visitors walk the published arrangement; the
  decorating mode edits a draft.

There are two kinds of room:

- **Shared rooms**: only the owner curates them. The owner places every
  painting, prop and game (sitting-area computers, minigames). Artists send
  their art to the owner, and the owner hangs it; artists no longer hang their
  own walls or own rooms. The hall is one of these shared rooms, and its
  paintings become hand-placed too.
- **Personal rooms**: each signed-in member has one. It stores what they collect
  in the game and is decorated with it. Items can be earned in play or bought
  with florins.

Decisions:
- **Placement is free within zones.** Items drag anywhere inside a zone that
  accepts them and snap to it; a prop can't leave its allowed zones.
- **One decorating mode for both kinds**, with different permissions: the owner
  edits shared rooms, and a member edits only their own room.
- **Door links are made by hand** for now.

Sketch of the data:
- `rooms`: id, slug, theme, kind (`shared` | `personal`), owner member (personal
  only), draft and published placements, door links.
- placement: `{ id, kind: 'prop' | 'painting' | 'game', ref, zone, x }`.
  `ref` points at a catalog prop, a piece, or a game id.
- Member inventory: the items a member owns. This extends the existing wallet
  `items`, which already tracks owned costume pieces.

- **Personal rooms are private by default.** The owner can share a link or
  invite friends, who then walk the room with presence, as in shared rooms.
- **The studio stays as it is for now.** The owner's studio account is
  effectively the admin: it is how art gets uploaded before being placed.

Open questions:
- Credit for artists whose work hangs in shared rooms: plaque and link, as today? (Kept as today for now.)
- Admin roles: settled for now. The owner is the studio artist whose email matches
  `HALL_OWNER_EMAIL` (`isHallOwner` in `shared/lib/session.ts`); the hall already shows only their pieces.

## Model (`apps/web/src/features/rooms/types.ts`)

- `RoomDef`: `id`, `clearColor`, `doors`, `load()` for art, `build(ctx, art)` that returns `RoomContents`.
- `RoomContents`: `floor`, `presence` key/pose, `hitTest(ray) → Interaction`, `update(frame)`, `dispose()`, plus optional `isReady` and `onShown`.
- `RoomContext`: what the stage gives a room: scene, overlay host, character, traversal, camera, arrival, `leave(door)`, `isQuiet()`.
- Doors: each room declares `doors: { [id]: { x, clearX } }`. A shared link table pairs
  `{room, door}` ↔ `{room, door}`. Arriving means "start at door X", which replaces `?from=atelier`.

## Tasks

### Phase 1: stage + atelier
- [x] Core types in `features/rooms/types.ts`
- [x] `features/rooms/stage.ts`: renderer, pixel ratio, `CameraRig`, viewport resize, `Traversal`, character, dip + `createRoomPassage`, tap/click/hover, frame loop, `joinRoom`, loading gate, teardown, built from what `useAtelierScene` does today
- [x] `features/rooms/links.ts`: door link table and route per room
- [x] Atelier as a `RoomDef` (`features/rooms/atelier/`), with the wardrobe wiring moved out of the hook
- [x] `Atelier.tsx` runs on the stage; delete `useAtelierScene.ts`
- [x] Browser check: load, walk, try on, leave through the door

### Phase 2: hall on the stage
- [x] Hall as a `RoomDef`: slices, lobby, cafe, guest board, sitting, helm, matcha, overlays, intro walk (`onShown`)
- [x] `Museum.tsx` modals stay React and are opened through room callbacks; `isSuspended` goes through the stage
- [x] Delete `useHallScene.ts`

### Phase 3: one persistent stage
- [x] Mount the stage in `app/museum/layout.tsx`; pages set the active room
- [x] Room swap: passage fade → dispose contents → load and build the next room → arrive at the linked door, with no renderer or character rebuild
- [x] Per-room loading curtains and the `/museum` server slice handed to the hall room

### Phase 4: minigame modals, depth inside them
Rooms stay flat strips. A room prop (like the sitting-area computer today)
opens a minigame in a museum-styled modal with its own canvas and its own 2D
style.

- [x] Walkable-area geometry for minigames with depth: `features/rooms/floor.ts`
  (`contains`, `nearestInside`, `slide`, `findPath`, linear `DepthView` for feet y and scale), with tests
- [x] Minigame frame: `features/minigames/components/MinigameFrame.tsx`, the shared modal shell
  (overlay, card, header, close, Escape). The room is paused underneath by `isSuspended`, and
  rewards go through `earn('game', …)`
- [x] Computer desktop and Color Recall use the frame. SketchGuess keeps its own markup, because its
  animated bunny sits above the header
- [x] First depth minigame, Pond (`features/pondgame`): walk around a pond with arrows/WASD or by
  tapping, cast at the rim, and reel on the bite. Weighted fish table; florins on close
  (`game: 'pond'`). Opens from the computer desktop
- [ ] Later, if a game needs it: multiplayer inside minigames (presence would then carry depth)

### Design for Phases 5–7 (2026-11-05)
- **Theme specs live in core** (`packages/core/src/rooms/themes.ts`), as data with no art, so the
  server can validate placements: `{ id, width, zones: { [zone]: { minX, maxX, accepts } },
  props: { [propId]: { zones, width } } }`. The art and drawing for each theme live in the web app
  (`features/rooms/themes/<id>`).
- **Placements** are JSON on the room: `{ id, kind: 'prop' | 'painting' | 'game', ref, zone, x }`.
  `validatePlacements` checks that the zone exists and accepts the kind, that the prop fits the zone,
  that x is inside the zone, the count limit, and ownership (in a personal room, props must be items the member owns).
- **`rooms` table** (`schema/rooms.sql`): slug, theme, kind, owner member (personal rooms only),
  visibility (`private` | `link`), share token, draft and published placements, and timestamps.
  Shared rooms are seeded rows (`hall`).
- **The hall** stays a strip laid out by the existing hall code. Its painting placements give the
  *order* of the pieces. Publishing the hall seals a new epoch from those placements
  (`sealEpoch` reads them when they exist and otherwise falls back to the studio order), so the
  hall's client code, presence keys and sketch rounds keep working.
- **Decorating**: `/museum/<room>?edit=1` (or the edit button) shows a tray on the right.
  Drag from the tray onto the room to place an item; it snaps to the nearest zone that accepts
  it. Drag an item to move it, or drop it on the tray to remove it. The draft autosaves, and
  Publish copies the draft to the published placements. Shared rooms can only be edited by the
  owner's studio session; a personal room only by its member.
- **Personal rooms**: theme `cozy` (atelier wallpaper, floor, and props reused from atelier art).
  The route is `/museum/home`, which creates the member's room on first visit and redirects to
  `/museum/r/<slug>`. Rooms are private by default. The owner can turn on a share link
  (`?key=<token>`), and anyone with the link can visit, including in presence. A home button in
  the museum HUD leads there for now, standing in for a door; a door can be drawn later.
- **Collectibles**: catalog items with kind `prop` (`prop:cabinet`, …). The starter props are
  free and granted when the room is created; the rest are bought with florins through the
  existing `buy`. Fish from the pond game are collectible props too, granted on first catch.

### Phase 5: themes, zones and arrangements
- [x] Themes as data in core (`packages/core/src/rooms/themes.ts`: zones, prop catalog), with art and
  drawing in the web app (`features/rooms/themes/cozy.ts`, a `PlacementTheme`); rooms render their arrangement
- [x] Generic placement layer (`createPlacementLayer`) for props. The hall's paintings are placed
  through the epoch as before; game placements are allowed by the rules but not drawn yet
- [x] `rooms` table (`schema/rooms.sql`), `domain/rooms.ts`, and `/api/rooms/*` (room, draft, publish,
  sharing, home, paintings)
- [x] The hall as a shared room: publishing its painting order seals a new epoch from it
  (`sealEpoch`), falling back to the studio order
- [ ] Later: door links from room data instead of `links.ts` (kept hand-made for now, as decided).
  `links.ts` gained one-way exits (personal room → hall)

### Phase 6: decorating mode
- [x] Edit mode for personal rooms (`PersonalRoom.tsx` + `features/rooms/decorate/`): a tray on the right
  (a bottom sheet on narrow screens) with Your things and a florin Shop
- [x] Drag to place with zone highlighting and clamping; move, pan, select, Put away, and arrow-key nudge
- [x] Autosaved draft → Publish; the server checks permissions (owner artist: shared rooms; member:
  their own room). The owner's hall gets a list-based Arrange hall panel (`HallArranger.tsx`)

### Phase 7: personal rooms
- [x] A personal room per member (`cozy` theme), created on the first visit to `/museum/home` with
  starter props (shelf, carpet, red pillow)
- [x] Collectibles: `prop:*` catalog items bought with florins; fish trophies granted on the first catch in
  Pond (`/api/wallet/collect`)
- [x] A My room button in the hall's top-right chrome (standing in for a drawn door), and a door
  back to the hall inside the room
- [x] Share link (`?key=`) for personal rooms; presence tickets for `r-*` rooms check the same access

### Personal room polish (2026-11-05)
Decorating follows the usual pattern from cozy decorating games: a bottom drawer of item cards
with categories, tap or drag to place, drag back to the drawer to put away, and quick, layered
feedback (lift and tilt on pick-up, squash and sparkles on drop, green or red zone tints).
- Look: cream stripes like the museum, a wood wainscot, a floor with depth (visitors stand on it),
  end posts with shade beyond, a "Museum" sign on the door, and the owner's name sign with
  their cozy level.
- The room is 20 units wide. Fish trophies hang on the wall or lean on the floor, chosen by drag
  height.
- Decorate mode: the camera lifts the floor above the drawer (`RoomContents.cameraRise`). Tap a
  card and the thing lands in the nearest free spot. A toolbar flips (`placement.flip`) or puts
  away the selected thing. Undo (button or Ctrl+Z). Done saves and publishes in one step.
- Progress: a cozy meter (Bare → Settling in → Snug → Cozy → Dreamy → Legendary) with a
  level-up toast. "New!" badges mark things not placed yet.
- A private room shows a friendly "This room is private" card instead of a 404, including for its
  owner after signing out.

### Stress-test fixes (2026-11-06)
Fixes for `docs/personal-room-issues.md` and `docs/testing/local-e2e-stress-2026-11-06.md`:
- Saving: x is rounded to a thousandth and the server allows 1e-6 of edge slack. A prop `ref`
  may be placed once (`duplicate_prop`). A refused save names the placement (`id`), and the
  editor puts back only that one. Saves run one at a time, retry with backoff and on `online`,
  and are flushed with `keepalive` on `pagehide`, on tab hiding and on leaving the room.
- Two tabs: `rooms.draft_version` goes up on every save. The draft PUT and the publish POST take
  `{ version }` and answer 409 `conflict` (the PUT with the newest draft) when it is stale.
- Room mutations go through `app/api/rooms/editor.ts`: a room the caller can't edit is 404
  whether or not it exists, and a personal room needs `X-TM-Member` to match the session.
- Pond: `POST /api/pond/cast` gives a signed ticket; `POST /api/wallet/collect { ticket }` rolls
  the fish on the server (`packages/core/src/economy/pond.ts`), at least 1.8 s and at most 2 min
  after the cast, once per ticket. The client no longer names the fish it caught.
- Drawer: always-visible save dot (with text when offline), an "In room n/24" list that pans to a
  thing, edge markers for things out of view, keyboard placing (Enter/Space on a card), and touch
  swipes that scroll the cards (an upward drag picks one up). Levels are celebrated once per visit.
- The name sign hides while decorating and shrinks long names. After Done the view glides back to
  the bunny; the leash is off while decorating (`Traversal.setLeashed`).
- The room page reads `roomPageView`, which decides access in SQL, so the share token and owner id
  never reach the page payload. The hall's loading screen moved into `app/museum/(hall)/`, so
  room pages answer real 404s and redirects.

### Follow-ups after Phases 4–7
- Deploy: apply `schema/rooms.sql` (`npm run db:schema`; it now also adds `draft_version`) and redeploy the presence worker. Until
  then, the deployed room server rejects `r-*` room names, so personal rooms have no presence.
- Art: the cozy room's wallpaper and wainscot are drawn in code. Its door is the atelier doorway
  with a "Museum" sign over the hanger, and fish trophies are drawn in code. A drawn door and
  trophies would read better.
- The hall arranger has not been checked in a browser locally, because `HALL_OWNER_EMAIL` isn't
  set in `.env`. Its logic is unit-tested, and publishing the hall is covered by `db-tests/rooms.test.ts`.
- Game placements (`kind: 'game'`) pass validation, but no theme draws them yet.

### Rooms as the one building block (decided 2026-11-06)
- **Everything is built from rooms, joined in two ways.** A **door** leads to a different place
  (hall ↔ fashion room, hall ↔ personal room): a change of theme and mood, so it keeps the fade
  and, on a cold visit, the loading animation. Rooms **joined wall to wall** have no transition
  at all: the wall and floor run straight through, so a row of joined rooms reads as one long
  room. The hall is such a row: entrance → gallery 1 … n → cafe (with the guest board and
  beanbag) → gift shop.
- **The stage builds the joined rooms near the camera** (`RoomContents.joined()`, `JoinedRoom`,
  `features/rooms/nearby.ts`). A joined room is built once it is within one view width beyond
  the edge of the screen and removed beyond two, so walking back and forth at a join doesn't
  rebuild it. Taps go to the entered room first, then to each joined room; an interaction that
  returns `false` from `activate` passes the tap on.
- **The hall's rooms** (`hall/scene/layout.ts` `cutRooms`): gallery rooms hold paintings up to
  `CONFIG.galleryRoom.maxWidth` (16 units, about 4 paintings) and join in the middle of a gap.
  Adding paintings only grows the last gallery or adds new ones, so room keys stay stable.
  What belongs to the whole hall stays with the hall: the painting loader (`HallScene`, which
  keeps only the slots of built gallery rooms), the coin, pedestals and helmets, the matcha,
  presence, and the far-hall art. The cafe room builds the cafe, guest board and beanbag.
- **The wall and floor travel with the camera** (`hall/scene/backdrop.ts`): one wall and one floor
  three view widths wide, with their textures scrolled the other way so the pattern stays fixed
  to the world. There is no length limit (the old fixed 600-unit backdrop ended near 170 paintings).
- **Painting textures are freed when their room goes.** The old radius code took a painting's
  mesh down at 9 units but only freed its texture past 15 units if the mesh was still up, so
  every texture leaked until leaving the hall. Walking a 100-painting hall: 112 textures held
  before, at most 21 now.
- **Loading ahead of doors** (`features/rooms/art.ts`, `art-cache.ts`): every room's art comes from
  `ROOM_ART[id]`, never from the room itself, and rooms build from it without disposing it. The
  stage loads the art behind a door once the visitor is within 1.5 screens of it (and the page
  behind it through `router.prefetch`), and keeps a room's art for 60 s after leaving. A room
  whose art was already loaded (`RoomContext.warm`) skips its minimum loading time.
- **Perf readout**: `?perf` (remembered; `?perf=off` clears it) shows the room, camera x, fps,
  frame time, the stage's own time per frame, draw calls, textures, geometries, overlay nodes,
  heap, and how long the last room took to open. `window.__tmPerf.snapshot()` returns the same.
  Gamma's hall always repeats its paintings to 100, to try a long hall (`?paintings=N` sets
  another count; `?paintings=0` shows the real hall). In development the same needs
  `/museum?paintings=100`. Production never repeats them.
- Kept hall-wide on purpose: helmet stand numbers, the hidden coin and painting progress. All three
  belong to an epoch (presence joins `hall-e<epoch>`), so their numbers can't shift under anyone,
  and per-room numbers would need a presence protocol change. One presence channel per hall, so
  visitors are visible across joins.

Next:
- [ ] Arranging the hall room by room (replacing the list arranger), once rooms are saved as data.
- [ ] Split the far-hall art (`loadScenery`) per room, so the cafe and gift shop art loads with its
  room instead of all at once (worth it only if `?perf` shows that load is heavy).
- [ ] Optional: `staleTimes.dynamic` so returning to the hall reuses its page for ~30 s
  (applies to every dynamic page).

## The map

The hall and the fashion area show a map in the top-left corner (`features/rooms/minimap.ts`,
styles under `.minimap` in `globals.css`): the museum seen from above, like a dungeon map. The
stage shows it when the place is ready, moves its pin with the visitor every frame, and hides it
when the place closes.

- **The plan:** each room is a box with walls, as wide as the room is long. Rooms joined wall to
  wall open into each other through a gap in the wall they share. A door to another place is a
  short passage with a pink door across it, since a door leads into another room, not up a floor.
- **Where places go:** every place has its own row (`MAP_PLACES[id].row`). The hall is the front
  row; the fashion area, through the door in the entrance's back wall, is the row behind it.
  `planMap` lines each place up so the two ends of a door face each other (`doorPoint`, which
  keeps a passage clear of a room's corners).
- **The window:** the plan is drawn at a fixed scale (`MAP_SCALE`) and the map is a window onto it
  that follows the pin (`panTo`), never showing past the plan's ends. A plan that fits is centred.
- **What it shows:** the place's name and the room the visitor is in, which lights up. Each room
  carries a small icon for its kind (entrance, gallery, café, gift shop, the fashion area's
  doorway, collections, Bruce's fish), and each place keeps its own colours wherever it appears:
  the hall cream with brown walls, the fashion area damask red with gold.
- **Places not yet visited:** the fashion area's rooms are fixed, so the map knows them from the
  start. The hall's grow with its paintings, so before a visit it shows only the entrance and a
  faint way on. The map remembers each place as last seen for the stage's lifetime.
- **What a place gives it:** `MAP_PLACES` names each place, its look, its row and what it looks
  like before a visit; a place not listed there, such as a personal room, has no map. Joined rooms
  give their `label` and `tint`, and doors are paired by `links.ts`.
- **Looks:** the hall's map is a cream sign with the script title. The fashion area's is dark
  red with a gold rim, and its purse sits below the map.
- **Growing halls:** the hall's map redraws when its rooms or length change as paintings arrive.
- **Tests:** `minimap.test.ts` covers which room is named, where doors meet their rooms, how the
  places are laid out and joined, the hall before a visit, and how the window follows the pin.
