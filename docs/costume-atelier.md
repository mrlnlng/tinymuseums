# The Costume Atelier

A second floor, reached by the staircase behind the entrance door. Visitors try on the
bow and dress independently from the mannequin and can walk as the cat instead of the bunny. All
choices persist through the `outfit` slot, so they come back on the next visit, and they
sync across devices when the visitor has an account.

Mocks (the owner's source of truth): `costume_atelier_mock_scene/7.png`, `8.png` and `9.png`
from `costume_atelier_asset 2.zip` (plus `mock1.jpg`/`mock2.jpg`), and `3.png` for the lobby
staircase. 8.png continues 7.png 630 px to the right and 9.png continues it 1553 px to the right.

## How it plays

- **Two pages.** The atelier is its own page, `/museum/atelier`, with its own scene, so each
  floor loads only its own art.
- **The stairs are two hops.** Both floors draw one staircase in code (`scene/stair-art.ts`): a
  wooden flight with tread highlights, a gold handrail, balusters and a newel post, built from
  the same step size the hops use, so every hop lands on a tread. In the lobby the flight stands
  on the floor and rises leftwards from its newel just left of the door, out through the
  ceiling. Upstairs the carpet ends at a stairwell and the flight goes down into it. Tapping the
  stairs (or the cue, or "Back to first floor") walks the character to the newel; it hops two
  steps up or down, the camera following, and the screen dips into the other floor's loading
  screen. Arriving runs the same two hops the other way. Reduced motion skips the hops and only dips.
- **Loading.** The atelier opens on a maroon loading screen: a dress form being sewn, with Kiki's
  bow. It shows for at least 2.8 s, then until the art, the fonts and the visitor's rig are ready.
- **Upstairs**, left to right: the stairwell and "Back to first floor", the red
  curtains, the title on its gilt shelf with the plaque text, the cabinet with the jewellery box
  and perfume, two bunny portraits; then **The Kiki Collection**: the spotlit form wearing the
  dress, Kiki's broom, the Jiji portrait, the bow on a blue pillow, and the Kiki painting; then a
  spotlit bare form, an empty red pillow, a mirror and a last bare form.
- **Trying on.** Tap the dress (or the broom) or the bow. Each jiggles now and then as an
  invitation. A worn piece leaves its stand bare, as in 9.png; tap the bare form or the empty
  pillow to give it back. Either can be worn alone or both together.
- **Changing character.** The portrait in the Kiki Collection shows the character the visitor is
  not: Jiji while walking as the bunny, the bunny while walking as Jiji. Tap it to change. It hops
  as the visitor comes near. Both clothing choices carry over between characters.
- **Downstairs** the outfit stays on. Sitting is painted only for the plain bunny, so the
  beanbag ignores other looks. The helmet and cup have anchors for both characters.

## Code

| File | What |
| --- | --- |
| `apps/web/src/app/museum/atelier/page.tsx`, `loading.tsx` | The atelier route. The route-level loading screen is the same fashion animation. |
| `features/hall/components/Atelier.tsx`, `AtelierLoading.tsx` | The page and its loading screen. |
| `features/hall/hooks/useAtelierScene.ts` | The atelier's scene: renderer, camera, visitor, taps, hover cursor, readiness. |
| `scene/atelier.ts` | The room: its art loader, the meshes, the displays, the title and plaque text, hit tests. |
| `scene/wardrobe.ts` | Try on and return, changing character at the displays, and `followOutfit`, which keeps both pages in the saved outfit. |
| `scene/stairway.ts` | Leaving a floor by its stairs (approach, two hops, dip, then the page change) and arriving by them. |
| `scene/flights.ts` | The flight on each floor (step size, foot, direction) and its hop steps. Tested in `flights.test.ts`. |
| `scene/stair-art.ts`, `scene/stairs.ts`, `stair-foreground.ts` | The drawn staircase, the lobby's flight, and its railing drawn in front of the character on the stairs. |
| `features/hall/lib/floor-transition.ts` | The transition cover retained across page changes. |
| `scene/rig.ts`, `scene/character.ts` | One rig renderer for either character, with costumes; the visitor's `wear(look)` and `ready`. |
| `packages/core/src/slots/outfit.ts` | The `outfit` slot: `character`, dress (`costume`), and `bow` as three last-write-wins registers. |
| `apps/web/src/app/dev/rig` | Development-only rig preview: either character, any costume, facing, walk pose, and the helmet and cup on the hall's anchors. |

All positions are in `CONFIG.stairs` and `CONFIG.atelier` (`scene/config.ts`). The atelier's are
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

## Art not supplied as files

Cut from the mocks (method in `ASSET_PIPELINE.md`) and kept as masters in
`public/assets/atelier/`: the two bunny portraits, the pink ribbon, the gilt shelf, the Kiki
painting and the mirror. The red
pillow is the blue pillow dyed. Larger masters of these would be sharper.

## Not done

- The mirror is a picture; it does not reflect the visitor.
- The mannequin master is 173 × 525 px, upscaled for the screen.
