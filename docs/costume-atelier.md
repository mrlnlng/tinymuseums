# The Costume Atelier

A costume gallery room, reached through the fashion-themed archway to the left of the visitor centre. Visitors try on the
bow and dress from the mannequin, or a cardigan in one of four colours, and can walk as the
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
- **Loading.** The atelier opens on a maroon loading screen: a dress form being sewn, with Kiki's
  bow. It shows for at least 2.8 s, then until the art, the fonts and the visitor's rig are ready.
- **In the atelier**, left to right: the doorway and "Back to museum", the red
  curtains, the title on its gilt shelf with the plaque text, the cabinet with the jewellery box
  and perfume, two bunny portraits; then **The Kiki Collection**: the spotlit form wearing the
  dress, Kiki's broom, the Jiji portrait, the bow on a blue pillow, and the Kiki painting; then
  **The Cardigan Collection**: the spotlit form in a cardigan with four colour swatches on its
  platform, the otter portrait above an empty red pillow, a mirror and a last bare form.
- **Trying on.** Tap the dress (or the broom) or the bow. Each jiggles now and then as an
  invitation. A worn piece leaves its stand bare, as in 9.png; tap the bare form or the empty
  pillow to give it back. Either can be worn alone or both together. A swatch puts on that
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

Door positions are in `GALLERY_DOOR` (`scene/gallery-door.ts`); room positions are in
`CONFIG.atelier` (`scene/config.ts`). The atelier's are
in the mocks' own pixels (198 px per world unit; the bunny is about 270 px tall there), so a
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
4. Give it a form in `CONFIG.atelier` and the room. One form per costume, at most one worn
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
- **Otter:** the bunny's Kiki dress (no paw) 40 px lower and the bow smaller and further right,
  in place of the star; the cardigan 90 px lower and 12 % larger, sleeves moved to its shoulders.
  Both bodies draw under its head (order 7.5) so the collar does not cover its chin.

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
