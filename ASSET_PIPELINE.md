# Asset pipeline: fast loading without losing sharpness

Five changes, chosen after researching how mobile web games handle images
(Poki and CrazyGames requirements, PixiJS density variants, Don McCurdy on
KTX2, PlayCanvas texture compression, ThumbHash). Built in this order, one
commit per phase, each checked in the browser before moving on.

Measured starting point: the hall's 49 sprite files are 837KB to download and
about 68MB of GPU memory once decoded, plus about 29MB for the paintings on
screen. Budgets from the research: Poki wants under 5MB initial and loading
under 10s; iOS Safari starts crashing WebGL pages around 300-500MB.

## Ground rules

- `scripts/optimize-assets.ts` is gitignored; only its output is committed.
- Never run `npm run build` or a second `next dev` in `apps/web` while the
  dev server is up: both write `.next` and break the running server.
- Every generated file name carries a content hash, so it can be cached
  forever and a changed file always gets a new URL.

## Phase 1: fingerprinted files at 2x and 3x

- [x] Optimiser writes every served image to `public/immutable/` as
      `<name>@<density>.<hash>.<ext>` (svg copied with a hash too).
- [x] One height table: the pixel height each image needs at 3x. Hall sprites
      are 1.5x their old caps, overlay images keep their 3x caps. The 2x
      variant is two thirds of that; images whose master is too small for a
      separate 3x variant ship one size. Bunny sprites stay at master size.
- [x] Same format choice as today per variant (best webp, png fallback, AVIF
      only when as faithful), done for each density.
- [x] Manifest at `apps/web/src/generated/asset-manifest.json` (bundled, so
      no extra request) replaces `public/assets/optimized.json`.
- [x] `shared/lib/assets.ts`: URL lookup by name and density, `<picture>`
      srcsets with 2x/3x descriptors, CSS `image-set()` strings.
- [x] Migrate every consumer: landing, loading still, walkthrough frame,
      guest board, coin screen, sketch game, bunny artist, home icon, the
      gift shop link's basket, the hall loader, and the six `url()`s in
      `globals.css` (via CSS variables set from the manifest).
- [x] Hall picks 3x when `devicePixelRatio > 2`, else 2x.
- [x] Delete the old unhashed outputs and `optimized.json`.
- [x] `customHttp.yml`: `/immutable/*` immutable for a year.
- [x] Service worker: `/immutable/` cache-first; bump its version so the
      old stale-while-revalidate copies are dropped.

## Phase 2: texture atlases for the hall sprites

- [x] Pack hall sprites into two atlases by when they load: entrance (door,
      help centre and its cat frames, rope, plaque, coin, pedestals, bare
      helm stand) and scenery (café, gift shop, guest board, sitting area,
      café cat frames). Floor and wallpaper repeat, so they stay standalone.
- [x] Packed separately per density (2x and 3x) with padding and 2px edge
      extrusion against mipmap bleed; each sprite's rectangle in the manifest.
- [x] One sheet per encoder setting (AVIF q62/q70, near-lossless and
      lossless webp...), each checked sprite by sprite against that sprite's
      own standalone fidelity. A single sheet per group forced every sprite
      to the strictest sprite's setting (entrance went 306KB -> 464KB).
      Result: entrance 17 requests -> 4 and 306KB -> 247KB at 2x; scenery 12
      -> 3 at about the same size (389KB vs 345KB at 3x).
- [x] Sprite textures are clones of the atlas texture with offset/repeat, so
      they share one GPU upload.
- [x] Board slicing (plaque, rope) composes its slice with the sprite's own
      offset/repeat instead of overwriting it.
- [x] Hit testing: per-sprite alpha masks packed into one small PNG at build
      time, looked up through the texture's offset/repeat (a compressed or
      atlased texture cannot be read back).

## Phase 3: KTX2 (Basis Universal) for the atlases and floor

- [ ] Optimiser encodes each atlas and the floor to KTX2 with `ktx2-encoder`
      (Binomial's encoder as WASM), Y-flipped, sRGB, with mipmaps.
- [ ] Try ETC1S and UASTC; measure fidelity against the source with the same
      SSIM check as AVIF, and download size against the AVIF atlas. Keep the
      choice that passes, record it in the manifest, and report the numbers.
- [ ] Runtime: three's `KTX2Loader` with the transcoder copied into
      `public/immutable/basis-<three version>/`; fall back to the AVIF/WebP
      atlas if KTX2 is unsupported or fails.

## Phase 4: ThumbHash placeholders for paintings

- [ ] Worker computes a ThumbHash (with alpha) of each framed painting and
      stores it on the piece; `FRAME_VERSION` 6 re-renders every frame.
- [ ] Hall API returns it with the image.
- [ ] Hall mounts a painting as soon as it is in range, drawn from the
      ThumbHash, and crossfades to the full image when it arrives.

## Completed

(filled in as phases land)
