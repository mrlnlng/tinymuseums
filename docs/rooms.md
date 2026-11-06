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
- **Depth uses walkable areas.** Rooms with depth (a pond to walk around)
  define walkable polygons on the floor, which may have holes. The visitor
  moves in x and depth, is drawn smaller and higher further back, and is
  depth-sorted against props. This is the walkbox approach from 2D adventure
  games. Today's flat rooms are a `strip` floor, the zero-depth case.

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
- placement: `{ id, kind: 'prop' | 'painting' | 'game', ref, zone, x, depth }`.
  `ref` points at a catalog prop, a piece, or a game id.
- Member inventory: the items a member owns. This extends the existing wallet
  `items`, which already tracks owned costume pieces.

- **Personal rooms are private by default.** The owner can share a link or
  invite friends, who then walk the room with presence, as in shared rooms.
- **The studio stays as it is for now.** The owner's studio account is
  effectively the admin: it is how art gets uploaded before being placed.

Open questions:
- Credit for artists whose work hangs in shared rooms: plaque and link, as today?
- Admin roles: is the owner's studio account enough, or is a proper admin flag needed when decorating shared rooms?

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

### Phase 4: depth
- [ ] `AreaFloor`: walkable polygons with holes; `Traversal` gains depth, with movement clamped to the area
- [ ] Depth projection: screen y and scale from depth; character and props sorted by depth
- [ ] Input: W/S and up/down for depth; tap-to-walk with pathing around holes on touch
- [ ] Presence carries depth (a protocol change; keep old clients working)
- [ ] Sandbox room to tune the projection, then the pond room

### Phase 5: themes, zones and arrangements
- [ ] Split `RoomDef` into a theme (zones, prop catalog, fixed features) plus an arrangement it renders
- [ ] Generic placement renderer for props, paintings and games from an arrangement, depth-sorted
- [ ] `rooms` table, with core domain functions and API routes
- [ ] The hall as a shared room with hand-placed paintings, replacing the epoch feed
- [ ] Door links come from room data instead of `links.ts`

### Phase 6: decorating mode
- [ ] Edit mode on the stage: a tray on the right holding the catalog's props and the owner's paintings
- [ ] Drag to place with zone highlighting and snapping; move and remove
- [ ] Draft → publish, and permissions (owner: shared rooms; member: their own room)

### Phase 7: personal rooms
- [ ] A personal room per member, made from a starter theme and created on first visit
- [ ] Member inventory of collectibles: earned in play or bought with florins
- [ ] A door into your own room from the shared rooms
- [ ] Share link / invite to visit a personal room
