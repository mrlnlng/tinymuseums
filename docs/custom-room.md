# Your Room: a room you can freely furnish

Started 2026-11-17 from the mocks in `~/Downloads/mocks/2026-11-17/custom_home/custom_home`
(a finished room `mock_basic_home.png`, 14 furniture cut-outs, 3 wallpapers, 2 baseboards).
Builds on the personal room in `docs/rooms.md` (Phases 5–7, polish and stress-test fixes).

## Decisions (2026-11-17, with the user)

- **Basic set free, the rest from the shop.** Every member, new or existing, owns the mock's basic
  home: plain cream wall, both baseboards, window, wall hooks, cubby, wall shelf, round table and
  tulip vase. Other furniture and wallpapers are bought with stamps.
- **The old props stay.** The atelier-art props and fish trophies stay in Your things and the shop
  beside the new furniture.
- **Wall free, plus surfaces.** Wall things go anywhere on the wall, at any height. Small things sit
  on the floor or on tables and shelves, and move with the furniture under them. Floor
  furniture slides along the floor and may overlap. Layering is automatic.
- **No grey ends.** The room ends at its illustrated edges like every other room: the camera is
  clamped (`cameraBounds`), and the dark shade and end posts beyond the walls are gone.

## What other games do (research, 2026-11-17)

- **Wallpaper and flooring are swapped, not placed.** Animal Crossing, Webkinz and Club Penguin
  sell wallpaper and flooring as their own item kind that replaces the room's surface in one tap.
  Animal Crossing ships them as sets that match the furniture.
  → Here wallpapers and baseboards are *finishes*: one per slot, chosen from a swatch row.
- **Grids lost to free placement.** Webkinz Next dropped its floor grid ("objects in their room with
  reduced limitations"); Cozy Room Decorator has no snapping by design; the Lord of the Rings life
  sim skips a grid for "clutter-core". Players still complain when centring is fiddly
  (Webkinz rugs in front of couches).
  → Free x/y, soft snapping only where it helps: onto a surface, and to the floor line.
- **Surfaces are where small things live.** Unpacking draws placement grids on floors, shelves
  and inside cupboards, and early playtesters found strict rules frustrating, so it loosened them.
  Room planners (Sweet Home 3D's drop-on-top) rest an item on whatever is under it.
  → Furniture declares surfaces. A small item dropped over one rests on it and rides along when
  the furniture moves. It is never refused; it falls back to the floor.
- **Layering confuses players when it is manual** (Club Penguin igloo players asking why things
  float). → Depth is automatic: wall < rugs < furniture (smaller in front) < things on surfaces.
- **Most players stay in the simple mode** (WoW housing: about 80% use Basic, which snaps).
  → One mode, no grid toggle, no rotation, just flip.
- **Try before you buy.** Cozy games preview wallpaper on the room before purchase.
  → Tapping a shop finish previews it; it reverts unless bought.

Sources: Game Developer on Unpacking's placement grids; Webkinz Newz "Advanced Editing in Webkinz
Next"; Nookipedia / Animal Crossing wiki on wallpaper and flooring; Cozy Room Decorator on Steam;
GamesRadar on WoW housing UX and the LotR life sim.

## Scale

The mock maps to the room at about **186 mock px per world unit**. The mock door (520 px) is the
game door's 2.8 units, and its skirting (33 px) comes out at 0.18, which matches the hall's 0.17
baseboard. The wall meets the floor at y = 0. Visitors' feet are at y = −0.56 (`FEET_Y`).

| Band | World y |
| --- | --- |
| Short baseboard (dark wood skirting) | 0 → 0.18 |
| Tall baseboard (panelling, its own darker foot) | 0.18 → 1.01 |
| Wall things may sit with their base at | 0.25 → top at most 4.4 |
| Floor (planks, drawn like the mock) | 0 → −2.6 |

## Data model (core)

`Placement` gains two optional fields:

```ts
interface Placement {
  id: string
  kind: 'prop' | 'painting' | 'game' | 'finish'
  ref: string
  zone: string            // 'wall' | 'floor' | 'top' | 'wallpaper' | 'baseboard' | …
  x: number
  /** World y of the thing's bottom edge. Wall and top placements; absent elsewhere. */
  y?: number
  /** The placement this one rests on (zone 'top'). */
  on?: string
  flip?: boolean
}
```

- **Wall** placements with no `y` are legacy. They draw centred at the old band (y 2.3), so the base is
  `2.3 − height / 2`. The editor writes `y` on the next move.
- **Top** placements need `y` and `on`. The server checks that `on` names a placement in the same
  list whose prop has surfaces, and that `y` lies inside the room (floorY…wall top). It does not
  check the exact surface height, because that is cosmetic and strict checks caused the
  `out_of_bounds` save failures before.
- **Finish** placements: zone `wallpaper` or `baseboard`, capacity 1, `x: 0`, `ref` is the finish id
  (`wallpaper-pink-stripes`). Ownership is the item `finish:<ref>`. A slot with no placement uses the
  default (`wallpaper-cream`, `baseboard-tall`), so rooms saved before this change look like the
  mock without a migration.

`PropSpec` gains `height` (world units, from the art's aspect), optional `surfaces`, and `rests`:

```ts
interface SurfaceSpec {
  /** Height of the resting line, as a share of the prop's height from its bottom. */
  y: number
  /** Usable span, as shares of the prop's width from its left edge (as painted, unflipped). */
  from: number
  to: number
  /** Tallest thing that fits, in world units; omitted means no limit. */
  clearance?: number
}
interface PropSpec { zones: string[]; width: number; height: number; surfaces?: SurfaceSpec[]; rests?: boolean }
```

`ThemeSpec` gains `floorY` (−0.56), wall `minY`/`maxY` on the wall zone (base ≥ 0.25, top ≤ 4.4),
and `finishes: Record<'wallpaper' | 'baseboard', { ids: string[]; default: string }>`.
`maxPlacements` goes from 24 to 40.

### Catalogue

New props (art in `apps/web/public/assets/home/`, manifest `images['home/<id>']`):

| id | zones | width | height | surfaces (y, from–to, clearance) | rests | price |
| --- | --- | --- | --- | --- | --- | --- |
| window | wall | 1.45 | 1.84 | | | starter |
| wall-hooks | wall | 0.86 | 0.40 | | | starter |
| wall-shelf | wall | 1.43 | 0.19 | 0.95, 0.02–0.98 | | starter |
| gold-frame | wall | 0.95 | 1.12 | | | 50 |
| hanger | wall | 0.60 | 0.34 | | | 25 |
| cubby | floor | 1.07 | 1.36 | 0.97, 0.04–0.96 · 0.68, 0.13–0.87, 0.36 · 0.40, 0.13–0.87, 0.36 · 0.07, 0.13–0.87, 0.36 | | starter |
| round-table | floor | 1.38 | 0.93 | 0.86, 0.14–0.86 | | starter |
| side-table | floor | 0.72 | 1.01 | 0.93, 0.12–0.88 | | 70 |
| chair | floor | 0.78 | 1.22 | 0.53, 0.10–0.90 | | 60 |
| armchair | floor | 1.40 | 1.39 | 0.44, 0.22–0.80 | | 120 |
| rug | floor | 2.30 | 0.75 | | | 70 |
| plant | floor, top | 0.85 | 1.20 | | yes | 55 |
| mug | floor, top | 0.24 | 0.19 | | yes | 20 |
| tulip-vase | floor, top | 0.34 | 0.45 | | yes | starter |

Old props gain heights and, where they have a flat top, surfaces: `cabinet` (0.84, 0.04–0.96),
`column` (0.98, 0.30–0.70), `shelf` (0.95, 0.03–0.97). `jewelry-box`, `perfume`, `pillow-blue`
and `pillow-red` gain `rests` and the `top` zone. Heights: mirror 2.25, painting 1.53, portraits
0.80/0.78/0.78/0.67 (bunny/jiji/otter/wink), shelf 0.20, cabinet 0.91, carpet 0.49, pillows 0.42,
column 0.80, jewelry-box 0.38, perfume 0.40, broom 1.11, cat 1.37, trophies 0.53.

Finishes (`finish:<id>` items, kind `finish`):

| id | price |
| --- | --- |
| wallpaper-cream | starter (default) |
| wallpaper-peach-stripes | starter (the room's look until now) |
| wallpaper-pink-stripes | 90 |
| wallpaper-blue-floral | 120 |
| wallpaper-ornate | 120 |
| baseboard-tall | starter (default) |
| baseboard-short | starter |

Starters are granted idempotently every time `personalRoomFor` runs (`on conflict do nothing`), so
existing members get the basic set on their next visit. New rooms start furnished like the mock:

| id | ref | zone | x | y | on |
| --- | --- | --- | --- | --- | --- |
| starter-hooks | wall-hooks | wall | 2.45 | 1.71 | |
| starter-cubby | cubby | floor | 2.48 | | |
| starter-window | window | wall | 3.90 | 1.16 | |
| starter-table | round-table | floor | 4.96 | | |
| starter-vase | tulip-vase | top | 4.92 | table top | starter-table |
| starter-wall-shelf | wall-shelf | wall | 6.39 | 1.44 | |

(The vase's y is `floorY + 0.86 × 0.93`.)

## Room look (web, `features/rooms/themes/cozy.ts`, `features/rooms/personal/room.ts`)

- Wall: the chosen wallpaper tiled across the wall. Plain cream is `#fae1bd`, the mock's wall. Peach
  stripes is the room's earlier procedural texture. The art tiles are seamless: pink stripes 380 px,
  floral 1497×569, ornate 745×741. On the wall, a pink tile (two stripe pairs) is 1.2 wide, a floral
  tile 5.4 and an ornate tile 2.1, chosen by eye against the bunny.
- Tall baseboard: `home/baseboard-tall` tiled at 0.18 → 1.01. Short baseboard: `home/baseboard-short`
  at 0 → 0.18 with a mirrored repeat (its grain never repeats). Choosing `baseboard-short` drops the
  panelling, so the wallpaper runs down to the skirting.
- Floor: planks drawn like the mock: `#8b5641` with darker plank lines `#6d402e` every ~0.2,
  staggered joints, and a soft shadow line under the skirting.
- Door: `home/door`, cut from the mock, 2.8 tall (1.50 wide) at x 1.0, base −0.02. The "Museum" sign
  sits on its brass plate.
- Room ends: `cameraBounds { minX: 0, maxX: 20 }`. The dark shade and the posts are gone, and the
  backdrop still overhangs so a window wider than the room shows more wall, not a void.
- Depth: wall 0.05, rugs/carpet 0.08, furniture 0.16 + up to 0.36 (smaller in front), a thing
  resting on a surface its parent's depth + 0.04. Ties go to whatever was placed later (+0.0005 per
  index), so the thing in front is also the one a tap picks.

## Editor (web, `features/rooms/decorate/*`, `PersonalRoom.tsx`)

- **Wall drag** moves in x and y, clamped to the wall rect. Arrow Up/Down nudge y by 0.1 for wall
  and top things.
- **Resting drag** (props with `rests`): while carried, the nearest surface under the pointer wins
  if the pointer is within the surface span and between `surfaceY − 0.25` and
  `surfaceY + itemHeight + 0.45`, and the item fits the clearance. The ghost snaps onto it, and the
  highlight is that surface's span. Otherwise it goes to the floor. A thing can't rest on itself.
- **Riding along**: moving a placement that has surfaces moves everything with `on` = its id by the
  same dx (and dy for wall shelves). Putting it away drops its riders to the floor at their x.
  Flipping it mirrors their x within its span.
- **Tap to place** puts a resting thing on the first free surface in view if one exists, else on
  the floor (`freeX`).
- **Walls tab** in the drawer: a swatch row per slot (Wallpaper, Baseboard). Owned swatches apply on
  tap; it is an undoable draft change. Shop swatches preview on tap (the room shows them, nothing is
  saved), with a Buy button; leaving the tab or tapping elsewhere reverts the preview.
- Drawer tabs: All · Furniture · Wall · Small things · Trophies · Walls · In room · Shop. The shop
  lists finishes as swatches before the props.
- The "In room" count and the cap count things only: 38, the 40 placements less the two finish
  slots. Edge markers ignore finishes too.
- Selecting a floor thing tints the floor band. Selecting a wall or resting thing tints nothing;
  the wall and surface tints show only while carrying.
- Cozy worth: new furniture 3 (armchair 4), small things 2, a non-default finish 3.

## Work plan

All done 2026-11-17:

1. Assets: `node apps/web/tooling/import-home-assets.mjs <custom_home dir>`. Let it run to the end:
   piping it into `head` kills it before it writes the manifest.
2. Core: types, theme, validation, catalogue, starters, tests (`custom-room.test.ts`).
3. Room look: backdrop finishes, plank floor, door from the mock, camera bounds, y/top rendering, depth.
4. Editor: wall y, surfaces, riders, finishes UI with try-on, tabs, labels (`logic.test.ts`).
5. Checked in headless Chromium against the local dev server: desktop and 390×844, decorating
   (drawer → table, table carrying its riders, vase → cubby top, window up the wall), finishes,
   try-on, Done, the published view, and both room ends.

Not done:
- A real touch device.
- A flooring finish (the mock ships only one floor).

## Testing locally

Members sign up through `/api/me/sign-up`. A raw API sign-up does not write the `tm_member`
localStorage marker the real sign-in flow writes, so a test session must set it, or the drawer
sees an empty wallet.

## Admin mode (gamma)

Settings → Admin mode → "Unlock everything + 1,000 stamps" gives the signed-in member every catalog
item for free and adds stamps for trying the shop. That covers room items, wallpapers, baseboards,
costumes, characters and fish trophies. It shows only where `ADMIN_MODE` is on
(`shared/lib/admin-mode.ts`): the gamma build (its `NEXT_PUBLIC_TEST_SWITCHES`) and local
development. `POST /api/wallet/admin` answers 404 everywhere else. Items go in at price 0, and the
stamps are an `admin` coin claim, so the wallet ledger still adds up. It can be pressed again for
more stamps.

## The closet: where every room starts (2026-11-17)

From `docs/storyline.md`: you're a struggling artist secretly living in the storeroom behind your
exhibit. A new room is that storeroom's closet: small, dirty, dark. You clean it and then knock
it through to a bigger room.

Decisions (with the owner): growing costs stamps; dirt is cleaned by tapping it.

**Sizes** (`packages/core/src/rooms/sizes.ts`), each a `room:<id>` wallet item:

| Size | Width | Price |
| --- | --- | --- |
| Closet | 6 | free, given to every new room |
| Storeroom | 10 | 120 |
| Back room | 15 | 250 |
| Studio | 20 | 450 (today's full room) |

A player earns at most about 60 stamps a day, so the steps take roughly 2, 4 and 8 days. A
member's room is as wide as the biggest size they own. Rooms from before closets own no size;
the next `personalRoomFor` gives them `room:studio`, and `roomSizeFor` treats "no size" as full,
so they never shrink. `sizedTheme(theme, width)` ends the zones 0.3 short of the right wall, and
saves are validated against it. `roomPageView` returns the width for visitors; the owner's page
follows their wallet, so a knock-through shows at once.

**Look:** past either end of the room, the walls end in a plaster edge with darkness beyond. That
shows only when the screen is wider than the room; a full-size room on a normal screen never shows
it. Until the room is full size, boards are nailed across the wall at its right end. Knocking
through moves them, with a dust puff, a fanfare, a toast and a pan into the new space.

**Dirt** (`kind: 'mess'`, `ThemeSpec.messes`): cobwebs, a water stain, wallpaper peeled back to
brick (no curled strip), dust, the last tenant's old canvases under a dust sheet, and an old paint tin. All are drawn
on canvases in `cozy.ts`. A new closet starts with seven. In Decorate,
tapping one cleans it (undoable); the drawer says so while any is left. Dirt is never placed, only
left or removed, and it doesn't count as a thing or toward coziness.

**Light (the look, 2026-11-17, from the owner's reference):** a dusty attic studio at golden hour.
- A new closet has bare aged plaster (`wallpaper-plaster`, a free finish), skirting only, and a
  small grimy arched **attic window** (`attic-window`, a free starter prop) set high in the wall.
- No visible light rays: no sunbeam, no floor sun patch, no glow under the door (owner's call,
  2026-11-17). Windows and bulbs only lift the dark softly around them; bulbs glow and flicker a little.
- Darkness is spread across the whole room (`themes/room-light.ts`, `darknessAt`). The dirt sets an
  ambient dark (`gloom` is `0.4 + 0.07 × dirt`, at most 0.86, 0 once clean). Corners, the ceiling,
  the floor nearest the viewer, the wall's foot and the side walls are darker. It is painted into
  a canvas alpha map whenever the lights move. A clean room keeps a softer version.
- The visitor and the room's signs take the light where they stand, from the same map.
- The room is a box in one-point perspective: side walls (papered and skirted like the back wall)
  and a boarded ceiling at y 4.55 (`CEILING`). In a full-size room the side walls sit outside the
  camera's bounds.
- A bare bulb's cord always runs up into the ceiling. Cobwebs always show in the top corners,
  whichever side their saved x is nearer (`PlacementTheme.pose`), and move when the room grows.
- Furniture stands against the wall: the cozy theme's `floorY` is the wall's foot (-0.05), not the
  visitors' feet. Rugs and dust still lie out on the floor. Anything standing casts a soft shadow
  on the wall behind it and on the floor at its feet. Things on the wall cast a faint offset
  shadow; the bulb doesn't.
- The floor is worn: grain, knots, nails at the joints, scuffs, scratches, a water ring and a crack.

**Paying to clean, and work takes time (2026-11-17):**
- Tapping junk in Decorate opens a card over it: its name, its price in stamps and how long it takes.
  "Clean up" buys `clean:<placement id>` (one catalog item per piece of the closet's junk, see
  `rooms/work.ts`, `CLOSET_MESSES`), then the junk is scrubbed away over its time with a ring
  counting down. The whole closet costs 220 stamps.
  Price is `5 × round(area × 4)` (at least 5); time is `3 + area × 6` seconds.
- The server enforces it: a saved draft may drop junk only if its owner owns that `clean:` item
  (`saveDraft`, reason `not_cleaned`). Paid-for junk that wasn't finished (the page closed) shows
  "Finish cleaning" for free next time. Cleaning can't be undone.
- Junk is cleaned up; damage (the damp stain, the peeling paper, and wall and floor wear) is
  repaired (`isRepair`): same flow, the card and buttons say "Repair".
- The boards over the closet's far end are junk too (`mess-boards`, 40 stamps, 16s). They always
  show at the room's right end (`PlacementTheme.pose`), so after a knock-through they move to the
  new end until taken down. They used to be part of the backdrop.
- Wear is fixed a surface at a time. `mess-wall-wear` (cracks, chips, nail holes, scuffs) and
  `mess-floor-wear` (scratches, scuffs, knots' rings, a water ring, a crack) are drawn as covers over
  the whole wall or floor (`PlacementTheme.cover`), not as things you can pick. Tapping bare wall
  or bare floor in Decorate offers to repair all of it (30 stamps, 15s); the card and ring sit
  where you tapped, and the cover fades as the work goes. A tap that only closes an open card or
  selection doesn't open it. Wear doesn't add to the room's darkness. The plaster and floor
  textures no longer carry the cracks and scratches themselves.
- Putting a new thing in the room builds it: it rises from its base over `2 + area × 1.5` seconds
  (2 to 8, `buildSecondsFor`), with a ring, then settles with a puff. It can't be picked up until
  it's built. Moving things already in the room is instant.
- Done waits while anything is being paid for, built or cleaned.
- Timers are shown in the browser, not stored; payment is what the server checks. Admin mode
  doesn't unlock cleaning, so its stamps can try it; "Start over in the closet" refunds paid
  cleaning and knocked-through walls.

**Reach:** the wall's top limit is now 3.8. In Decorate the view drops to clear the drawer, so a
vertical drag on empty space now looks up the wall (`DecorController.panBy(dx, dy)`), back as far
as the normal view.

**Admin mode** unlocks everything except room sizes, so its 1,000 stamps can try each
knock-through (120 + 250 + 450). Its "Start over in the closet" button (tap twice) resets the
member's room to a new closet: size, dirt and arrangement. Owned things stay owned
(`restartInCloset`, `POST /api/rooms/closet`, 404 outside gamma and local development).

**Turning admin mode off** (Settings, tap twice) puts the account back to how anyone else would play:
it starts the room over in the closet (refunding knock-throughs and cleaning), then takes back
everything the unlocks gave and their stamps (`undoAdminUnlock`, `DELETE /api/wallet/admin`).
An unlock's free items are found by sharing its stamp claim's transaction time; starter things
stay. If admin stamps were already spent, the newest purchases since the unlock go too, until the
books balance. The admin tools then hide on that browser (`tm_admin_off` in localStorage) behind a
"Turn admin mode back on" button; turning it on again only shows the tools.

Not done yet:
- Art for the dirt, the boards, the window and the bare bulb is drawn in code; real art would replace it.
- Cleaning gives no stamps, which would need an idempotent claim per mess.
- Other visitors in the room (presence) aren't shaded yet; only your own character is.
