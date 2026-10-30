# The Costume Atelier

A second floor, reached by the staircase behind the entrance door. Visitors try on the
bow and dress independently from the mannequin and can walk as the cat instead of the bunny. All
choices persist through the `outfit` slot, so they come back on the next visit, and they
sync across devices when the visitor has an account.

Mocks (the owner's source of truth): `costume_atelier_mock_scene/7.png`, `8.png`, and
`file3.png` for the lobby staircase.

## How it plays

- **Two pages.** The atelier is its own page, `/museum/atelier`, with its own scene, so each
  floor loads only its own art. The first floor does not preview the room above.
- **The lobby.** A full-height wooden flight stands on the floor left of the entrance and
  continues offscreen through the ceiling, following `file3.png`. There is no upstairs
  preview or added doorway. Tap the stairs or the “Costume atelier” sign to climb.
  The maroon transition cover survives navigation until the sewing loader is mounted.
  Both directions show that animation for at least 2.8 seconds.
- **Loading.** The atelier opens on a loading screen in its own maroon: a dress form whose
  outline is being sewn with running stitches and a travelling needle, and Kiki's bow
  bobbing at its neck. It shows for at least 2.8 s, then until the art, the fonts and the
  visitor's rig are ready. Then the character crests the stairs onto the landing.
- **Upstairs**, left to right: the landing, the title and plaque, a column, the spotlit form
  wearing Kiki, a column, the two character displays, a column, the bare unlit form, and a
  column. The floor extends to the banister post, covering the wedge under the landing.
  The floor hides the railing below its surface; only the rail above the floor and the open stairwell show.
- **Trying on.** Tap the bow or dress directly. Each gently jiggles occasionally as an
  invitation, with no visible boxes, pills or instructions. Either can be worn alone or both together. A worn item remains as a faint guide
  on the form so its return target stays clear. Clothes change while the visitor keeps
  moving; trying on never holds traversal or walks the visitor to a fixed point.
- **Changing character.** Tap a figure directly. The current rig stays visible
  while the replacement loads into a separate canvas; a failed load keeps the previous
  character and outfit. Changes are queued in click order. Both clothing choices carry
  over between characters. The active character's platform stands empty.
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
| `scene/stairs.ts`, `lobby-stair-art.ts`, `stair-foreground.ts` | The full-height lobby staircase and the foreground railing during climbs. |
| `features/hall/lib/floor-transition.ts` | The transition cover retained across page changes. |
| `scene/rig.ts`, `scene/character.ts` | One rig renderer for either character, with costumes; the visitor's `wear(look)` and `ready`. |
| `packages/core/src/slots/outfit.ts` | The `outfit` slot: `character`, dress (`costume`), and `bow` as three last-write-wins registers. |
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

- No label yet links Kiki to a work in the collection. That relationship is the owner's
  to state.
- The mannequin master is 173 x 525 px, upscaled for the screen; a larger master would
  be sharper.
- The figures on display are still sprites with breathing and a greeting hop, not live
  rigs, to avoid extra WebGL contexts.

The outfit slot is version 2. Its version 1 migration preserves an existing Kiki outfit as
both bow and dress. Each piece merges independently across devices. The rig uses costume
mesh `part` metadata: `bow` follows the bow register; body, paw and broom follow the dress.
