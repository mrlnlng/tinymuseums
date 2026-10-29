# Handoff: move the Tiny Museum bunny from sprite frames to a rig

Repo: https://github.com/mrlnlng/tinymuseums (you have push access; the author's session did not).
Author's goal: **add costumes without redrawing the character.** The game should expect a rigged
character, not per-pose PNG frames. Costumes become extra layers on the rig.

Status when this was written (2026-10-26, second version of this bundle): the rig, a walk cycle and a
glTF export exist. **The rig and walk match the preview the author chose as the final look,
`rig_preview/walk_preview_v4.mp4`** (re-rendering this rig reproduces all 48 decoded video frames of that
file exactly). Nothing in the game repo has been changed. Treat everything below as a starting point to
verify, not as settled fact. An earlier, more elaborate variant (independent tail and arm motion, waist
locked) exists on the author's machine as `bunny_rig_v13_backup.blend`; it is not in this bundle and the
author picked the v4 preview as the final look.

---------------------------------------------------------------------------------------------------

## 1. What is in this bundle

| Path | What it is |
| --- | --- |
| `rig_export/bunny_rig.glb` | glTF export: 7 meshes, 1 skin (11 joints), 1 clip `walk` (0 to 1.0 s, loops). **Start here.** |
| `rig_export/rig_spec.json` | Bones (head/tail in canvas px, which ones drive geometry), meshes, draw order, torso data, notes. Machine-readable. |
| `bunny_rig.blend` | Blender 5.2 source for this look (the author's file is `bunny_rig_walk_v4.blend`). Textures are read from `bunny_master/` next to it (if Blender reports missing images: File > External Data > Find Missing Files). |
| `bunny_master/` | The author's 13 layer PNGs (all 1668x2388, same canvas, `*.png.png`) plus `torso_v4.png`, a flattened crop (tail + legs + body + belly curl + raised arm) used by the skinned torso. `bunny_tail`, `bunny_leg_*`, `bunny_body`, `bunny_arm_*` are source layers only (baked into the torso). `bowtie.png.png` is unused (removed from the bunny at the author's request; a costume candidate). |
| `rig_walk/` | 16 transparent 764x1186 PNG renders of this rig: `bunny-walk-{right,left}-{1..8}.png` (frames 1,4,...,22 of the 24-frame cycle). Left = right mirrored. Reference or fallback; the goal is to replace them. |
| `rig_preview/walk_preview_v4.mp4` | The approved look (cream background, 48 frames = two cycles). |

The old sprite art is still in the repo under `apps/web/public/assets/` (`bunny-*.png`). Keep it as a
fallback until the rig reaches parity.

---------------------------------------------------------------------------------------------------

## 2. How the game draws the bunny today (read from the repo, not run)

I read these files; I did not run the app, and I did **not** read `scene.ts`, `overlay.ts`,
`useHallScene.ts`, `Museum.tsx` or `hit.ts`. Read those before designing the render path.

- `apps/web/src/features/hall/scene/character.ts` (153 lines): the bunny is a plain `<img class="hall-bunny">`
  appended to a host element, not a Three.js object. `update()` projects a world point with the
  `OrthographicCamera`, then sets the img `height`, `transform`, and `src`. Walk frames come from
  `assets.walk[side]`, idle from `assets.bunnyIdle`; frame index =
  `floor(distance * CONFIG.character.cyclesPerUnit * frames.length)`, so any frame count works. The
  `Character` interface is `{ idleImage, perch(), attach(), update(), dispose() }`.
- `scene/assets.ts` (~line 280-345): walk frames are listed in `manifest.json` at
  `bunnyWalk.byFacing.{left,right}`; idle is `bunny-left.png` / `bunny-right.png`; seated is
  `bunny-sit.png` / `bunny-sit-helm.png` (loaded in `loadScenery`). Left walk frames load lazily.
- `scene/carried.ts`: `Attachment = { facing, width, walk:{x,y,rotation}, idle:{...}, sit:{x,y,rotation,width,flip} }`.
  Offsets are **pixels in the current bunny frame**, flipped when facing differs. `character.attach()` maps them to screen space.
- `scene/config.ts`: the helmet (`CONFIG.helm.worn`: width 446, walk {262,106,0}, idle {243.8,79.8,-9.2},
  sit {208,216,0,420,flip -1}) and the matcha cup (`CONFIG.matcha.held`) are hand-tuned pixel offsets.
  `CONFIG.character` has `height 1.36, centerY 0.12, z 0.7, cyclesPerUnit 0.9, bob 0.018`. (`z` is present;
  I did not see the DOM sprite use it.)
- `scene/helm.ts` + `scene/sitting.ts`: picking up the helmet flies a sprite onto the bunny; sitting swaps
  to `bunny-sit-helm.png` when the helmet is worn, and conceals the carried sprite.
- Other consumers of bunny images: `sketchguess/components/BunnyArtist.tsx` (`bunny-right`,
  `sketchguess/bunny`), CSS `.hall-bunny` (globals.css ~479) and `.visitor-bunny` (~1186).
- Pipeline (`ASSET_PIPELINE.md`, `apps/web/public/assets/README.md`): `scripts/prep_assets.py` and
  `scripts/optimize-assets.ts` are **gitignored and outside what I could read**. Files are content-hashed into
  `public/immutable/`, listed in `apps/web/src/generated/asset-manifest.json`; `manifest.json` is
  generated and must be copied to `packages/core/assets/`. "Bunny sprites stay at master size." A
  `KTX2Loader` path already exists (built, switched off). Budget notes: hall ~100 MB GPU vs iOS ~300-500 MB.

---------------------------------------------------------------------------------------------------

## 3. The rig

Authoring space: the 1668x2388 layer canvas. In Blender, 1 unit = 1000 px, centered on the canvas,
front view in the XZ plane (Blender +Y is depth; the camera looks along +Y). The art faces **right**;
left-facing is a horizontal mirror. After glTF export (Y-up) the character faces +X.

Bones (parent): `root` > `hips` > `chest` > `head` > `ear_L`, `ear_R`; `chest` > `arm_L`, `arm_R`;
`hips` > `leg_L`, `leg_R`, `tail`. Exact head/tail positions are in `rig_spec.json`.
**`arm_L`, `arm_R` and `tail` exist but drive nothing in this look** (their keys are zero): the tail, belly
curl and raised arm are painted into the torso texture and move with the body. They are useful as future
attachment points; do not expect them to animate.

Meshes in the glb: `bunny_torso` (skinned 64x54 grid over `torso_v4.png`, canvas bounds x 260-1530,
y 1068-2143; weights `hips`, `leg_L`, `leg_R` only) and rigid planes `bunny_ear_L/R`, `bunny_face`,
`bunny_eyes`, `bunny_nose`, `bunny_mouth`, each bone-parented. Each mesh node has `extras.draw_order`
(torso 3, ear_R 6, ear_L 7, face 8, eyes 9, nose 10, mouth 11). The planes are flat and nearly coplanar, so
**set draw order from `extras.draw_order` via `renderOrder`; do not rely on depth.**

Why the torso is one skinned mesh: the layers are slices of one flat drawing; each only has outline where it
was visible. Rotating legs/arms as separate rigid pieces exposed cut edges and doubled outlines. The torso is
therefore flattened and bent by weights. Do not "fix" this by splitting it back into pieces.

Walk clip (`walk`, 24 fps, 24 frames, key times 0 to 1.0 s, last key equals first so it loops):
- legs: stance alternately opens and narrows (about +/-7 degrees about the hip, twice per cycle) with a
  small same-direction sway, and each foot lifts in turn (about 18 px);
- hips: tiny bob (about 8 px) and 1.5 degree sway; chest counter-sways 1.5 degrees; head tilts 2 degrees;
  ears wiggle 4 degrees with a lag;
- arms and tail: no independent motion.
The author reviewed and approved this look. Do not change the motion without asking.

Materials: unlit look. In the glb the colour is in the **emissive texture** (base colour is black), alpha
mode BLEND. At runtime, replace each material with `MeshBasicMaterial({ map: m.emissiveMap, transparent: true,
depthWrite: false })` (set `map.colorSpace = SRGBColorSpace`). The glb has 14 images for 7 textures (each PNG is
embedded twice); dedupe or re-export to shrink it (currently ~1.4 MB).

**Known issues in the current export**
- Only a `walk` clip exists. **No idle, sit or cheer clips, no attachment sockets, and no costume yet.**
- Verified: the glb's JSON (nodes, skin with 11 joints, 7 meshes, one clip spanning exactly 0 to 1.0 s,
  extras), the PNG renders (looked at on a montage), and that this rig re-renders the approved preview
  frame for frame. **Not verified: the glb has not been loaded in Three.js yet.**
- No ground shadow (the old frames had one drawn in).
- The torso texture bakes the tail into the body; a costume that must sit *behind* the tail needs the layers
  split again.

---------------------------------------------------------------------------------------------------

## 4. Suggested plan

**Phase 0, spike (small, do first).** A standalone page: `GLTFLoader`, an `OrthographicCamera`, material
override as above, `AnimationMixer` playing `walk` at 1.0 s loop, draw order from extras. Confirm: outlines
look right (no doubled lines), alpha sorting is stable, mirroring with `scale.x = -1` works, clip loops
cleanly. If this fails, stop and report; do not touch the game.

**Phase 1, character swap behind the existing interface.** Implement a new `createCharacter(...)` that still
returns `{ idleImage, perch, attach, update, dispose }` so `helm.ts`, `sitting.ts`, `carried.ts` keep compiling.
Recommended first render path: a small dedicated WebGL canvas/overlay positioned with the same screen-space math
`character.ts` already does (keeps the "bunny is above the hall" layering). Moving the rig into the main scene is a
possible later step. Drive the walk with the existing `distance * cyclesPerUnit`; frame the model so apparent
size and feet position match the old sprite (`CONFIG.character.height` / `centerY` will need retuning). Keep the
old PNG path as a fallback until parity.

**Phase 2, attachments.** Replace pixel offsets in `CONFIG.helm`/`CONFIG.matcha` with named sockets (empties such
as `socket_head`, `socket_hand_R`, `socket_seat`) exported in the glb; `attach()` projects the socket's world
position. This needs Blender work (section 5).

**Phase 3, more clips.** idle, sit (replaces `bunny-sit*.png`), cheer (replaces `bunny-right` in `BunnyArtist`).
Needs Blender work.

**Phase 4, costumes.** Convention: extra meshes named `costume_<id>__<part>`, parented to the right bone, with
`extras = { layer: "costume", costume: "<id>", draw_order: N, hides: ["bunny_ear_L", ...] }`. Add
`setCostume(id | null)` to the character. First test costume: the helmet (source image in the repo:
`apps/web/public/assets/helm.png`, 480 px wide; the original `gladiator_hat.png` was not found on the author's
machine). Wire it to the existing helmet pick-up flow in `helm.ts`.

**Phase 5, cleanup.** Render the UI stills (sketch game, menus, landing) from the rig so there is one source of
truth. Remove the old frames, update `ASSET_PIPELINE.md`, add the glb to the optimiser/manifest flow (you will need
to edit the gitignored scripts locally, or ask the author for them). Check mobile memory and load time.

---------------------------------------------------------------------------------------------------

## 5. Blender-side work still to do (needs Blender; the author has it with an MCP bridge)

1. Add socket empties parented to bones (head top, hands, seat) and export them.
2. Author idle, sit and cheer actions; keep each a clean loop (or a hold).
3. Build the helmet as a costume layer on `head`, with `extras.hides` as above.
4. Re-export. Blender frames start at 1, so shift the action keys by -1 frame (frames 0..24) before exporting
   and shift them back afterwards; otherwise the clip starts at 0.0417 s and the loop pauses for one frame.
   The export used (Blender 5.2): select the armature and all visible meshes, then

```python
bpy.ops.export_scene.gltf(filepath=".../bunny_rig.glb", export_format='GLB', use_selection=True,
    export_animations=True, export_animation_mode='ACTIONS', export_skins=True,
    export_extras=True, export_yup=True, export_apply=False)
```

   Gotcha: the armature has `hide_render = True` (set for rendering). If your selection filters on
   `hide_render` the armature is skipped and the export has no skeleton or animation (this happened once).

---------------------------------------------------------------------------------------------------

## 6. Open questions for the author

- Left/right as a pure mirror: the author said yes (the star and other asymmetric details flip sides).
- Do the idle, sit and cheer poses need new drawing, or can they be posed from the existing parts? (Unknown: the torso is a baked flat drawing, so a very different pose may need redrawn layers.)
- Costume layers: will the author draw them as transparent PNGs on the same 1668x2388 canvas, and will some
  costumes (cape, long scarf) need soft, bendy parts?
