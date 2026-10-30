# Approved v4 bunny in the hall

The model is the author's unchanged `rig_export/bunny_rig.glb` from
`/home/shan/Downloads/mocks/bunny_rig_handoff_v4`. The source handoff is retained in
[bunny-rig-author-handoff.md](bunny-rig-author-handoff.md).

## Rendering and movement

- `scene/rig.ts` (formerly `bunny-rig.ts`, now shared with the cat) loads the actual skin, bones, and `walk` action with
  `GLTFLoader` / `AnimationMixer`. The skinned torso remains intact.
- Its transparent canvas occupies the existing character overlay and uses the same
  world-to-screen placement as the former sprite. The camera matches the supplied
  764 × 1186 renders: orthographic height 2.5, centered at the origin.
- Materials use `emissiveMap` as their unlit colour map, sRGB textures, and explicit
  `draw_order` from the GLB extras. Depth testing/writing are disabled for these
  intentionally ordered painted layers. Mirroring the root provides left-facing motion.
- Mipmaps are disabled for these cutout textures: their transparent black pixels
  otherwise create a gray fringe along the white face/torso join. Linear filtering,
  clamped texture edges, and a 2–3× supersampled canvas retain smooth silhouettes
  without exposing that artificial layer boundary. This issue is also described in
  [Three.js issue 28238](https://github.com/mrdoob/three.js/issues/28238).
- The approved one-second clip plays at its authored speed while walking. The old
  distance-based sprite clock could drive it at 2.16 cycles/sec at normal maximum
  character speed. No extra sprite bob is applied. At rest, phase zero is held;
  this is a neutral hold, not an additional idle action.

## Existing interactions and fallback

The `Character` interface is preserved. A missing model, failed rig renderer, or
lost avatar WebGL context falls back to the old sprites. During sitting/hopping,
the existing perch images are used because the handoff contains no seated action.
The helmet and matcha keep their existing pickup/return flow. Runtime attachment
points follow the head and hips respectively; the cup follows hips because the
approved raised arm is baked into the hips-skinned torso. Old pixel offsets are
retained for the sprite/seated fallback. These runtime anchors are not newly
exported Blender sockets or a complete costume system.

The renderer disposes geometry, materials, skeleton buffers and textures, closes
decoded bitmaps, and releases the renderer on character teardown. The unused
base-colour texture copies in this export are released after material replacement.

## Assets

The bunny now loads from `apps/web/public/assets/bunny-rig-kiki.glb`, the same v4 rig plus
the kiki costume; see `ASSET_PIPELINE.md`. Run
`npm run assets:models --workspace @tiny/web` after replacing it, or after an
image-only optimisation run. The tracked helper fingerprints it into
`public/immutable/` and updates `models.bunnyRig` in the generated asset manifest.
The current model is 1,427,168 bytes and is byte-identical to the supplied file.

## Local review and checks

- Museum: `http://localhost:3000/museum`.
- Isolated rig: `http://localhost:3000/dev/rig` (development only). Its pose
  slider and facing toggle use the same renderer as the hall.
- `npm run typecheck --workspace @tiny/web` passes. A production build is deliberately
  not run alongside the development server because both write `.next`.
- Browser checks cover both walking directions, visibly changing walk frames,
  a held idle pose, mobile resizing, exactly one visible bunny, loading failure,
  WebGL context loss, and navigation teardown.
- The start/end loop poses render identically. Four poses were compared at native
  resolution against decoded frames 1, 7, 13, and 19 of the supplied
  `rig_preview/walk_preview_v4.mp4`, including the white neck region that exposed
  the filtering artifact.

Screenshots, video comparisons, and browser-check reports are saved locally under
`output/bunny-rig-integration/`. Existing gallery-media placeholder/load issues are
outside this character replacement.
