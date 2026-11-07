# The Costume Atelier

A costume gallery room, reached through the fashion-themed archway to the left of the visitor centre. Visitors try on the
bow and dress from the mannequin, a cardigan in one of four colours, the blue floral dress, the floral dress with its red cardigan, the flower crown,
the gold sequin set with or without its cape, a hibiscus in blue, yellow or pink, the blue cap, or the daisy clip, and can walk as the
cat or the otter instead of the bunny. All
choices persist through the `outfit` slot, so they come back on the next visit, and they
sync across devices when the visitor has an account.

Mocks (the owner's source of truth): `costume_atelier_mock_scene/7.png`, `8.png` and `9.png`
from `costume_atelier_asset 2.zip` (plus `mock1.jpg`/`mock2.jpg`), and `3.png` for the lobby
staircase. 8.png continues 7.png 630 px to the right and 9.png continues it 1553 px to the right.

## How it plays

- **Two pages.** The atelier is its own page, `/museum/atelier`, with its own scene, so each
  room loads only its own art.
- **A room doorway.** Both rooms use a flat illustrated cream-and-rose museum archway,
  with red curtains, a bow and a hanger emblem. Its plaque uses the visitor centre's
  actual board artwork and lettering style, as does the room's Back to museum sign.
  One existing cream museum pillar sits between the two entrances; the collection
  stays in its original hall layout. The generated source is
  `public/assets/atelier/gallery-door-red.png`; its prompt and style reference are in
  `docs/gallery-door-imagegen-prompt.md`. Tap the doorway or its labelled sign to enter.
  The visitor walks to the entrance before the screen fades, then walks clear of the
  doorway on arrival. Reduced motion places the visitor directly clear of the door.
  The atelier carpet spans the whole room, without a stairwell opening.
- **Loading.** Going back to the museum shows the same screen titled Tiny Museum.
  The atelier opens on a maroon loading screen: a dress form being sewn, with Kiki's
  bow. It shows for at least 2.8 s, then until the art, the fonts and the visitor's rig are ready.
- **Rooms.** The fashion area is a row of rooms joined wall to wall, like the hall: the stage
  builds the ones near the camera and takes the rest down (`scene/atelier-layout.ts`). The
  **entrance** is mock 7: the doorway and "Back to museum", the red curtains, the title on its
  gilt shelf with the plaque text, the cabinet with the jewellery box and perfume, and two bunny
  portraits. Accessories without a room of their own rest in the cabinet's two compartments:
  the blue cap and the daisy clip (`CONFIG.atelier.cabinetPieces`). Then one room per collection, each laid out exactly like Bruce's booth
  (`bruce_mock_scene.png`, `ROOM_TEMPLATE`): a painting in the blue frame on the left wall, its
  name on a hanging tag lit from under the curtain, the form on a blue platform in flowers, a
  portrait over a ribbon, a painting in the cream frame, and a column with its cushion. A room
  with two forms stands them 150 px either side of centre and moves its walls out by 140 px,
  keeping the template's gaps. Each room hangs its own swags from its left wall, so every tag
  hangs under the curtain the same way. Paintings not yet supplied
  are a plain canvas (`placeholder-painting.png`). **The Kiki Collection**: the Kiki painting (in
  its own gilt frame), the dress with Kiki's broom, Jiji, the bow. **The Floral Collection**: the
  blue dress and the dress with its red cardigan, the otter, the flower crown.
  **The Gold Collection**: the gold sequin set alone and with its cape, the bunny portrait (no
  character), the three hibiscus. **Bruce's Chronicles**: the garden and pond paintings, the
  tutu, Bruce over a blue ribbon and a fish, the fish in a bag. The cardigans
  have no room now; one already worn or owned is still worn. Every headpiece
  shares the `bow` place, so wearing one gives back the one before. On the otter, a hibiscus or the daisy clip takes
  the place of its star. The gold set is supplied twice: upright for the form (`gold-sequin-*-display.png`) and on
  the bunny's tilted body for the rigs; headpieces are placed per character in `HEADPIECES` (`prepare-models.mjs`).
- **Hints.** Near a piece or portrait not yet tried, one pill says what a tap does. A change
  of outfit or character bursts sparkles over the visitor (not with reduced motion).
- **Trying on.** Tap the dress (or the broom) or the bow. A few small stars twinkle over every
  piece still on its stand and over the portraits (static with reduced motion). A worn piece leaves its stand bare, as in 9.png; tap the bare form or the empty
  pillow to give it back. Either can be worn alone or both together. The floral dresses use the same try-on/return
  behavior; the flower crown shares the headwear slot with Kiki's bow and can accompany any dress. A swatch puts on that
  colour of cardigan; the form keeps the last colour chosen. A cardigan replaces the dress, and
  the dress replaces a cardigan, since both are the outfit's `costume`.
- **What fits.** Every character wears every piece (`FITS` in `wardrobe.ts`). A piece missing
  from a character's rig would stay on its stand, with a short note by it when tapped.
- **Changing character.** Two portraits offer characters: Jiji in the Kiki Collection and the
  otter in the Cardigan Collection. A frame shows the bunny instead while the visitor is its own
  character. Tap one to change. Each hops as the visitor comes near. Clothing choices carry over.
- **Back in the museum** the outfit stays on. Sitting is painted only for the plain bunny, so the
  beanbag ignores other looks. The helmet and cup have anchors for both characters.

## Code

| File | What |
| --- | --- |
| `apps/web/src/app/museum/atelier/page.tsx`, `loading.tsx` | The atelier route. The route-level loading screen is the same fashion animation. |
| `features/hall/components/Atelier.tsx`, `AtelierLoading.tsx` | The page and its loading screen. |
| `features/hall/hooks/useAtelierScene.ts` | The atelier's scene: renderer, camera, visitor, taps, hover cursor, readiness. |
| `scene/atelier.ts` | The room: its art loader, the meshes, the displays, the title and plaque text, hit tests. |
| `scene/wardrobe.ts` | Try on and return, changing character at the displays, and `followOutfit`, which keeps both pages in the saved outfit. |
| `scene/room-passage.ts` | Approach, fade, route handoff and walking clear on arrival. Tested in `room-passage.test.ts`. |
| `scene/gallery-door.ts`, `scene/lobby-gallery-door.ts` | Load and place the generated doorway and its lobby sign. |
| `features/hall/lib/floor-transition.ts` | The transition cover retained across page changes. |
| `scene/rig.ts`, `scene/character.ts` | One rig renderer for either character, with costumes; the visitor's `wear(look)` and `ready`. |
| `packages/core/src/slots/outfit.ts` | The `outfit` slot: `character`, dress (`costume`), and `bow` as three last-write-wins registers. |
| `apps/web/src/app/dev/rig` | Development-only rig preview: either character, any costume, facing, walk pose, and the helmet and cup on the hall's anchors. |

Door positions are in `GALLERY_DOOR` (`scene/gallery-door.ts`). The rooms and what each
holds are in `scene/atelier-layout.ts`, and the shared sizes in `CONFIG.atelier`
(`scene/config.ts`). A one-form room is 1120 px wide, a two-form room 1400 px; positions inside a
room are offsets from its centre. All are in the mocks' own pixels (198 px per world unit; the bunny is about 270 px tall there), so a
change to the mock can be copied across directly.

## Adding a costume

1. Export it on both rigs the way kiki is: meshes with
   `extras = { layer: "costume", costume: "<id>", draw_order, hides }`. Put the new GLBs
   in `public/assets/` and point `prepare-models.mjs` at them, or add the meshes to the
   existing rigs.
2. Add its art under `public/assets/costumes/<id>/`. Extend `compose-atelier.mjs` to
   build its dressed form and its flying bundle, then run `npm run assets:models`.
3. Add `<id>` to `COSTUMES` in `wardrobe.ts`. The `outfit` slot already accepts any id,
   so no version bump is needed. Saved ids the code does not know are worn as none.
4. Give it a form in its collection's room in `atelier-layout.ts`, or a new room. One form per costume, at most one worn
   at a time. A form stands bare while its costume is worn.

## Adding a character

Add a spec to `SPECS` in `rig.ts` (frame, blink, feet, shadow), a model in
`prepare-models.mjs`, and the name to `CHARACTERS` in `outfit.ts`. Then give it helmet
and cup anchors in `config.ts` and check them in `/dev/rig`. Give it a display in
`CONFIG.atelier.displays`, with its standing sprite as the figure.

## The bunny rig

The bunny is the repainted v2 rig (`public/assets/bunny-rig-v2.glb`, from
`bunny_rig_v2_handoff`). It shares the first bunny's skeleton and 1668 × 2388 layer canvas, so
`tooling/graft-costume.mjs` moves the kiki costume layers from `bunny-rig-kiki.glb` onto it at
build time (`npm run assets:models`), with v2's own hanging paw repeated above the dress. The
red chest bow is still added at runtime (`bunny-rig-bow.png`). Its eyes are separate layers and
blink independently.

The cardigans come from `bunny_cardigan_rigs` (one bunny v2 export per colour,
`public/assets/bunny-rig-v2-cardigan-<colour>.glb`). The same graft adds each as its own costume
`cardigan-<colour>`, hiding the chest bow under the collar; `slimGlb` stores their shared
geometry once. Only the walk was fitted, which is all the rig plays. The cardigans on the form
(`atelier/mannequin-cardigan-<colour>.png`) are the handoff's source layers scaled onto the
form.

## The otter

`public/assets/otter-rig.glb` from `otter_rig_handoff`: the same skeleton, canvas and walk clip
as the others, drawn at the bunny's canvas scale so it stands a little shorter. It wears the
bunny's clothes, fitted at build time (below). Its portrait (`atelier/portrait-otter.png`) is
the Jiji frame with the otter's head layers painted in. Helmet and cup anchors are in `config.ts`.

## Fitting clothes to other characters

`graftCostume` takes a `fit` per part: a move and scale on the layer canvas, applied to the
skinned vertices or the rigid layer's matrix, so clothes drawn for the bunny sit on another
body. The numbers in `prepare-models.mjs` were matched by overlaying the layer masters:

- **Cat:** the cardigans as drawn, hiding Jiji's ribbon. Its Kiki outfit is the artist's cat
  version, broom included.
- **Otter:** Kiki's dress has an otter-specific vertex fit: after establishing the
  torso width, a separate bodice adjustment lifts the scooped neckline to the chin.
  The right skirt edge pulls inward and its hem drops around the hip, removing the
  sideways flare without shifting the entire dress. A local shoulder adjustment tucks
  the strap endpoint under the arm, and a smooth waist inset rounds the side seam. Its paws
  draw above the dress but below the head (order 7.8). The four cardigans share a fit:
  a slightly narrower, longer body and smaller sleeves fitted individually to its arms.
  The bow is two-thirds size on top of its head, in place of the star. The blue floral dress
  retains its original canvas fit, which already follows this torso well.

They hold through the walk, but they are refits of bunny art; drawings made for each body would
sit better.

## Art not supplied as files

Cut from the mocks (method in `ASSET_PIPELINE.md`) and kept as masters in
`public/assets/atelier/`: the two bunny portraits, the pink ribbon, the gilt shelf, the Kiki
painting and the mirror. The red
pillow is the blue pillow dyed. Larger masters of these would be sharper.

## Not done

- The mirror is a picture; it does not reflect the visitor.
- The mannequin master is 173 × 525 px, upscaled for the screen.

## Floral collection

The artist's new 1668 × 2388 exports are retained in `public/assets/atelier/`:
`blue-floral-dress.png` is the character layer; `blue-floral-dress-display.png`
is the mannequin layer; `floral-cardigan-mannequin.png` supplies the dressed
display, `red-cardigan-display.png` the cardigan painting, and `flower-crown.png`
the headwear. Source names were dressA, dressAMannequin, file4, file7, and file6.

`compose-atelier.mjs` retains the supplied floral mannequin's neck and stand and
reconstructs a matching bare torso. Bare, blue-dressed, and cardigan-dressed forms
share one canvas and floor position, so equipping a piece exposes its bare stand.

`painted-costume.mjs` adds the flat artist layers to each existing GLB skeleton.
The floral skirt blends chest and hip weights. The cardigan is fitted to the torso
angle; its sleeves follow the arm bones with overlapping joins along the painted
underarm seams. The crown follows the head bone and replaces the otter's star.
All three rigs contain `blue-floral`, `floral-cardigan`, and `flower-crown`.
The existing outfit slot persists and shares them in both museum rooms.

Browser review screenshots are in `output/floral-review/`, covering all three
characters, the real atelier displays, equipping/returning, and reload persistence.

### Costume fit review

The review captures every costume on bunny, cat, and otter at the start and two
points of the walk cycle, plus the opposite facing. A second pass equips each
piece through the actual atelier controls and walks away from and back toward its
stand. Screenshots and comparison sheets are under `output/fit-review/`.

The crown on the cushion uses a room-only rotation and lower centre to rest both
rose ends on the fabric; the character-worn crown keeps its original artwork and
head attachment.

## Bruce's Chronicles

From `costume_atelier_asset_v4`. The booth is the mock drawn at 0.82 of its own pixels around
the form, and is the template every collection room follows (`ROOM_TEMPLATE`). The form, column and platforms keep the room's sizes. The
blue ribbon is the pink one dyed. The chandelier in that pack is in no mock, so it is not hung.

**Bruce** is a character (250 coins), from `bruce_costume/rigs/bruce/bruce_v2_rig_tutu.glb`
(`public/assets/bruce-rig.glb`). It wears only the tutu so far (`FITS`); the other pieces stay on
their stands with a note until they are fitted to its body. Adding `bruce` to `CHARACTERS` means
the presence worker must be redeployed before other visitors can see Bruce.

**The tutu** is two rigid planes on the hips, drawn once for Bruce and scaled per body by the
artist (`bruce_costume/HANDOFF.md`, `fit.json`). `prepare-models.mjs` grafts it from the
handoff's bunny, cat and otter exports (`*-rig-*-tutu.glb`) and sets the bunny's and otter's
screen-left arm to draw order 3.2, behind the skirt, as the handoff asks. On the form it is
`tutu-display.png` over the floral form (`mannequin-tutu.png`).

## Checked against the mocks (2026-11-07)

Each mock was rendered at its own framing (the perf readout's `view`) and measured piece by
piece. In 7.png and 8.png Kiki's dress is drawn one mock pixel per art pixel, and the
spotlights are the art at 1:1 with their tops just above the screen. Both are drawn that way
now. The form canvas is wider (`padX` 62) so the larger dress fits. The tutu stands on the
plain form, as in Bruce's mock. The swags are sized and spaced as in Bruce's mock, with their
top band carried on above them for tall screens. The second spare form stands bare without a
platform or light, as in 9.png. `ribbon.png` lost a strip of the portrait frame that was cut
from the mock with it.

Deliberate differences: the doorway and "Back to museum" in place of 7.png's staircase rail
and "Back to first floor"; the price tags and hints; and the collections added after these
mocks (cardigan swatches, the otter portrait where 9.png has the bunny, floral, gold and
accessories).
