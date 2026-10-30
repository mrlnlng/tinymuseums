# The Costume Atelier

A second floor, reached by the staircase behind the entrance door. Visitors try on the
featured costume from its mannequin and can walk as the cat instead of the bunny. Both
choices persist through the `outfit` slot, so they come back on the next visit, and they
sync across devices when the visitor has an account.

Mocks (the owner's source of truth): `costume_atelier_mock_scene/7.png`, `8.png`, and
`file3.png` for the lobby staircase.

## How it plays

- **Two pages.** The atelier is its own page, `/museum/atelier`, with its own scene, so each
  floor loads only its own art. The lobby carries just the staircase and a glimpse of the
  floor above.
- **The lobby.** The staircase stands left of the door. It climbs into the lobby's ceiling,
  drawn as a cut-away: the slab is the upstairs floor, level with the landing, and the
  atelier's damask shows above it with the banister rising into it. The ceiling ends with
  the lobby. Tap the stairs and the character walks to the bottom step and climbs. Partway
  up, the screen dips to maroon and the atelier page opens.
- **Loading.** The atelier opens on a loading screen in its own maroon: a dress form whose
  outline is being sewn with running stitches and a travelling needle, and Kiki's bow
  bobbing at its neck. It shows for at least 1.2 s, then until the art, the fonts and the
  visitor's rig are ready. Then the character crests the stairs onto the landing.
- **Upstairs**, left to right: the landing, the title and plaque, a column, the spotlit form
  wearing Kiki, a column, the two character displays, a column, the bare unlit form, and a
  column. The floor is drawn in front of the stair art, so the landing sits flush and only
  the open stairwell shows.
- **Trying on.** Tap the form. There are no buttons. The character walks up, the costume
  lifts off and settles on, and the form stands bare. Tap it again to give the costume back.
- **Changing character.** The bunny and the cat stand on display on spotlit platforms. The
  visitor's own platform stands empty, as the form does while its costume is worn. Tap the
  other figure: the visitor walks up in front of it, the two dissolve, and the visitor takes
  its place while their old self appears back on its own platform. Switching back is the
  same tap. Figures hop as the visitor comes near, and under a mouse the cursor becomes a
  pointer over anything that answers a tap.
- **Back down.** Tap the stairs. The character descends into the stairwell, the screen dips,
  and the hall opens with the character stepping off the bottom of the lobby staircase
  (`/museum?from=atelier`) rather than walking in at the door.
- **Downstairs** the outfit stays on. Sitting is painted only for the plain bunny, so the
  beanbag ignores other looks. The helmet and cup have anchors for both characters.
- **Reduced motion** replaces each climb with a short dissolve.

## Code

| File | What |
| --- | --- |
| `apps/web/src/app/museum/atelier/page.tsx`, `loading.tsx` | The atelier route. The route-level loading screen is the same fashion animation. |
| `features/hall/components/Atelier.tsx`, `AtelierLoading.tsx` | The page and its loading screen. |
| `features/hall/hooks/useAtelierScene.ts` | The atelier's scene: renderer, camera, visitor, taps, hover cursor, readiness. |
| `scene/atelier.ts` | The room: its art loader, the meshes, the displays, the title and plaque text, hit tests. |
| `scene/wardrobe.ts` | Try on and return, changing character at the displays, and `followOutfit`, which keeps both pages in the saved outfit. |
| `scene/stairway.ts` | Leaving a floor by its stairs (approach, climb, dip, then the page change) and arriving by them. |
| `scene/flights.ts` | Staircase geometry shared by both floors. Tested in `flights.test.ts`. |
| `scene/stairs.ts` | The lobby staircase and the cut-away ceiling. |
| `scene/rig.ts`, `scene/character.ts` | One rig renderer for either character, with costumes; the visitor's `wear(look)` and `ready`. |
| `packages/core/src/slots/outfit.ts` | The `outfit` slot: `character` and `costume` as two last-write-wins registers. |
| `apps/web/src/app/dev/rig` | Development-only rig preview: either character, any costume, facing, walk pose, and the helmet and cup on the hall's anchors. |

All positions are in `CONFIG.stairs` and `CONFIG.atelier` (`scene/config.ts`),
measured from the mocks at about 198 mock px per world unit (the bunny is about 270 px
tall there).

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

## Not done

- The banister does not occlude the character during the crest; the character is
  drawn on its own canvas above the room.
- No label yet links Kiki to a work in the collection. That relationship is the owner's
  to state.
- The mannequin master is 173 x 525 px, upscaled for the screen; a larger master would
  be sharper.
- The figures on display are still sprites with breathing and a greeting hop, not live
  rigs, to avoid extra WebGL contexts.
