# Inspiratiq's Tiny Museum — project state

Everything decided, everything built, and everything left. Kept next to the code so it
can be updated as tasks close.

- **Status:** running locally, end to end. Not deployed.
- **Stack:** TypeScript, Next.js 15 (App Router, React 19), Node worker, Postgres, sharp,
  Three.js, Motion (Framer Motion v13). Amplify Hosting + Amplify Gen 2 for deployment.
- **Companion docs:** `README.md` (how to run it), `apps/web/public/assets/README.md`
  (generated assets), `apps/web/public/audio/README.md` (the music clip).

---

## 1. What this is

A virtual gallery hall. Artists claim a wall, hang their work, and get a QR code that
leads a stranger straight to it. Visitors walk the hall as the bunny, stop at what catches
them, and look at one work at a time.

**The tiebreaker for close decisions:** the feeling of walking out of a real gallery —
unhurried, considered, one thing at a time. In practice that means pacing over density and
restraint over engagement, and it is why there is deliberately no feed anywhere.

**Two entrances, two intents.** A QR scan is the artist's own funnel, bringing someone who
already cares about that artist to their page. The root domain is the discovery product:
you arrive with no artist in mind and wander.

---

## 2. Decisions locked

| Decision | Choice | Why it matters |
| --- | --- | --- |
| Unit of exhibition | **Display**, not room. Artist:display strictly 1:1 | One continuous hall, no doorways |
| Display contents | Artist-composed collage of framed works | Server flattens it to one image |
| Layout control | **Layout templates** (single / pair / trio / quad) | Full composer is an upgrade to the same data, not a rewrite |
| Viewing | One piece at a time, in the artist's order | Where the product's promise actually lives |
| Rendering | **Flat 2D**, WebGL scene + DOM overlay | Art is painted for 2D; text stays real DOM |
| Visitor | A **character** (the bunny). Input drives the *camera*; the bunny walks after it | Dragging the character makes it move at finger speed, which no walk cycle can match |
| Ordering | **Epoch rotation** — deterministic permutation, reseeded on a schedule | Fair entrance position, no artist buried forever |
| Cursor stability | **Epoch snapshot**; cursor is `(epoch_id, index)` | Walking back shows the same hall |
| Takedown | Read-time suppression, outside the epoch snapshot | A takedown cannot wait for the next boundary |
| Admission | Open signup + an objective **publish bar** | Nobody judged on taste |
| Accounts | Artists full; visitors anonymous, email-only to follow | Following is a row, not an account |
| Sales | **Inquiry only** — emails the artist | Platform takes no revenue and is not party to the sale |
| Commerce schema | Modelled now, inert | Stripe lands additively |
| Screens | **One 9:16 frame** in CSS; no page sets its own size | Matches the 1080×1920 mockups |
| UI animation | **Motion** (Framer Motion) for React surfaces only | The 60fps hall loop stays imperative; Motion never touches it |
| Hall entrance | The visitor **walks in** from off-screen left | The hall is revealed as arrival, not as a page load |
| Deployment | Amplify Hosting + Gen 2 (auth/storage/functions), **keep Postgres** | Relational model does not port to DynamoDB |

**Rejected, with reasons:** DynamoDB (keyset epoch pagination, `uuid[]`, `SKIP LOCKED`,
aggregate analytics are all relational); a separate API tier (Amplify runs our server
code, so the API *is* the backend); GPU-compressed textures (the collage model removed the
memory pressure that justified them).

---

## 3. Current state

Running locally with real data: 8 artists, ~34 works, 5 real paintings, published and
sealed into an epoch.

```bash
npm run db        # terminal 1 — Postgres, leave running
npm run db:migrate
npm run db:seed
npm run dev       # web :3000 + worker
```

Seeded artists sign in at `/studio/sign-in` with `<slug>@example.com` / `tinymuseum`.

**Verified working:** every route serves; the hall API returns epoch-scoped slices with
region maps; media serves and refuses path traversal; QR scan redirects and attributes the
scan to its placement; follow + confirm + inquiry all send mail; presigned upload works
with no session cookie and a tampered signature gets a 403; the worker drains its queue;
epoch sealing rotates the entrance.

**Never verified:** anything requiring a browser. See §7.

---

## 4. Architecture map

```
packages/core          domain logic, shared by web and worker
  brand.ts             the museum's name, in one place
  env.ts               config; finds the repo root and anchors relative paths
  db.ts                pg pool, plain SQL
  types.ts             wire + domain types
  storage.ts           Storage interface, FilesystemStorage       <- the S3 seam
  s3-storage.ts        S3Storage                                   (written, unverified)
  uploads.ts           presign + register (browser PUTs directly)
  images.ts            derivative ladder (sharp)                   worker-only
  collage.ts           flattens a display to one image + region map worker-only
  layouts.ts           layout templates -> placements
  epoch.ts             sealing, slices, cursor stability
  publish.ts           the publish bar
  artists.ts           artist page, pieces, display
  audience.ts          QR codes, follows, inquiries, analytics
  auth.ts              password hashing, sessions                  <- the Cognito seam
  mail.ts              Mailer interface, console/file              <- the SES seam
  jobs.ts              DB-backed queue, SKIP LOCKED                <- the SQS seam
  handlers.ts          job handlers (seed runs the same pipeline)

apps/web               Next.js: SSR pages, route handlers, hall renderer
  app/                 22 routes (see §5)
  components/          Museum, Walkthrough, UploadWork, FollowForm, Message
  hall/                Three.js renderer — zero React imports
  lib/session.ts       cookie <-> session

apps/worker
  index.ts             local polling loop
  lambda.ts            the same handlers as a scheduled function

db/migrations/001_init.sql   14 tables
scripts/                     db, migrate, seed, prep_assets.py
```

**The React boundary:** React owns the document; it does not own the frame loop.
`apps/web/src/hall/` has no React imports. The scene runs imperatively inside one
`useEffect`, plaque text is raw DOM positioned by writing transforms each frame, and the
only bridge is `setOpen(...)` when a work is tapped. Routing camera position through React
state at 60fps makes overlays visibly swim.

---

## 5. Completed

### Product & design
- [x] Product interrogation: promise, audience, artist success, return loop, QR placement
- [x] High-level design document (published artifact, `§Decisions locked` supersedes parts)
- [x] Geometry prototype (`~/gallery-poc`) for placement, pacing, camera feel
- [x] Settled 2D vs 2.5D vs perspective by building all three and choosing
- [x] Established that the visitor is a character, not a camera

### Assets
- [x] `scripts/prep_assets.py` — measures source art, emits `manifest.json`
- [x] Frame inner window detected from the asset (`x .199, y .155, w .590, h .659`)
- [x] Room palette and floor line (77.66%) measured from mockup 9
- [x] Sprites cropped to alpha bounds; pedestal sheet split
- [x] Walk cycle: 5 frames cropped to a **shared** box so the sprite cannot jitter
- [x] 5 pedestal variants, picked by index for stability
- [x] 5 real paintings downsized to 2400px long edge, titles from filenames
- [x] Palette + fonts taken from `specs.md` (Beth Ellen, Sniglet, exact hexes)

### Database
- [x] Schema: artists, sessions, assets, pieces, displays, museum_epochs, epoch_slots,
      qr_tokens, follows, inquiries, suppressions, events, jobs, schema_migrations
- [x] Plain-SQL migration runner, one transaction per migration
- [x] Seed that runs the real pipeline inline (so seeding *is* a pipeline test)
- [x] Local Postgres without Docker or root (`embedded-postgres`), same `DATABASE_URL`

### Backend
- [x] Storage interface + filesystem implementation + S3 implementation
- [x] Presigned direct-to-S3 uploads (browser hashes, presigns, PUTs, registers)
- [x] HMAC-signed local PUT endpoint so dev is not an open write endpoint
- [x] Derivative ladder: EXIF-stripped, 5 widths, WebP + JPEG
- [x] Server-side collage compositor: frame + artwork -> one PNG + region map
- [x] Layout templates producing deterministic placements
- [x] Epoch sealing, hall slices, keyset cursor, grace window
- [x] Read-time suppression so takedown is immediate
- [x] Publish bar (min works, images ready, descriptions, display arranged + composed)
- [x] Job queue with SKIP LOCKED claims, backoff, stale sweep
- [x] Worker: local polling loop **and** Lambda handler sharing the same handlers
- [x] Auth: bcrypt, server-side sessions, unique slugs
- [x] Mailer interface + console/file transports
- [x] Analytics: wall views, piece views, inquiries, followers, scans by placement

### Frontend
- [x] Landing page from mockup 1 — plaque, taped guidelines, props, wood floor
- [x] Two buttons on the floor: Start visit / Claim a wall (no inline expansion)
- [x] The hall: WebGL, walk, momentum, deadzone camera follow, drawn walk cycle
- [x] Streaming slices, mount/dispose by distance, texture disposal
- [x] Pedestal dwell floor so transitions read as sculpture, not a flicker
- [x] Region-map hit testing; tap a work to enlarge
- [x] Enlarged view: one piece at a time, real frame, plaque, prev/next, inquiry
- [x] Artist page (the QR destination), SSR, with OG metadata
- [x] Follow form, confirm and unsubscribe pages
- [x] Studio: register, sign in, upload, arrange, publish/unpublish, codes, analytics
- [x] One uniform 9:16 screen frame; no page sets its own size
- [x] Consistent branding via a single `BRAND` constant
- [x] Crawlable artist index on the landing page, off-screen
- [x] Background music system: one persistent `<audio>` in the root layout,
      gesture-unlocked playback, volume fades, preference in localStorage,
      speaker toggle drawn from `sound_icon.svg`, hidden when no track exists
- [x] Screen chrome: home + speaker paired top-right as in the mockups, rendered
      once in the root layout, hidden on the studio and home hidden on the landing

### Motion and entrance polish (latest pass)

- [x] Motion (Framer Motion v13) added to `@tiny/web` for React-side animation
- [x] **Hall entrance sequence.** The museum starts at opacity 0 and stays hidden until
      the first display is actually mounted; then it fades in over 600ms and the visitor
      **walks in automatically** from 8 world units left of the first display
- [x] `Traversal.playIntro(startX, targetX)` — an automated walk that ignores input;
      pointer, wheel and tap-to-open are all gated on the new `isIntro` flag, and the
      camera holds on the destination rather than trailing the visitor in
- [x] Enlarged view animates in and out (spring), and slides **directionally** between
      works — forward and back are visually distinct
- [x] `AnimatePresence` around the enlarged view, so closing it animates out instead of
      vanishing
- [x] Screen chrome slides down and fades in on mount, after a 0.5s delay
- [x] Upload form: animated error/success notices and an animated button label that
      tracks the hashing → uploading → saving phases
- [x] Follow form: animated swap between the form and its confirmation
- [x] Per-display fade-in on mount **removed** — displays now appear at full opacity,
      since the whole hall fades in as one
- [x] Fixed a typecheck break in the new slide animation: `initial`/`exit` were passed
      functions, which is not a valid Motion API. Dynamic values must be *variants*
      keyed by label, with `custom` supplying the direction — now `SLIDE` in
      `Walkthrough.tsx`. It neither compiled nor animated before the fix

### Enlarged-view layout

- [x] **Root cause found: viewport units inside a non-viewport container.** The title,
      gaps, padding, frame height (`min(50vh, 500px)`) and description size were all
      measured against the viewport, but they live inside `.screen`, whose height is
      `min(100dvh - 24px, width * 16/9)`. On a wide or short window the container is far
      shorter than `100dvh`, so the pieces were spending from a budget none of them could
      see — which is why adjusting one covered another
- [x] Second cause: nothing claimed the leftover space. `.wt-stage` had `min-height: 0`
      (permission to shrink) but no `flex` value (no claim on the remainder), so every
      child was intrinsically sized and the total simply overflowed
- [x] `.wt` is now a **size container**; every child measures in `cqh`/`cqi` against the
      screen frame. No viewport units remain in the enlarged view
- [x] `.wt-stage` is the single flexible row (`flex: 1 1 0` + `min-height: 0`); title,
      plaque, meta and actions are `flex: none` and cannot be squeezed
- [x] The frame fits **both** axes: `height: min(100cqh, 100cqi / var(--frame-aspect))`.
      The ratio arrives from the manifest as a number (`FRAME_RATIO`), since
      `aspect-ratio` alone needs one dimension given to derive the other
- [x] Title clamped to two lines; description grows the plaque and scrolls inside it past
      a cap — so neither text can crowd out the artwork
- [x] Stage reserves horizontal room for the arrows, so they never overlap the frame

### Mobile

This is primarily a phone product, so the desktop letterbox is a preview device, not
the target.

- [x] **The frame is the phone.** Below 460px (or any coarse pointer under 900px) the
      screen goes full-bleed — `100dvw` × `100dvh`, no margin, radius or shadow. Phones
      are 19.5:9 and 20:9, so forcing 9:16 banded away a third of the screen
- [x] `viewport-fit=cover` via Next's `viewport` export, plus `env(safe-area-inset-*)`
      on the chrome, the enlarged view, the landing floor and content pages — without
      `cover` the safe-area values are all zero and the notch sits on the UI
- [x] `overscroll-behavior: none` so pull-to-refresh cannot steal a horizontal swipe
- [x] Touch targets raised to 44px (arrows) and 40px (chrome, back) on coarse pointers
- [x] **The camera fits by width, not just height.** A height-driven frustum leaves only
      ~2.95 world units visible at 19.5:9 — barely one display. The frustum now grows on
      tall screens to keep `minVisibleWidth` (3.6u) on screen: 6.4 at 9:16, 7.8 at
      19.5:9, 8.0 at 20:9. The view zooms out rather than cropping the corridor
- [x] **Fixed: the bunny did not animate while dragging.** `pointermove` moved `x`
      directly but never set `velocity`, and the walk cycle reads `velocity` — so on
      touch, the primary gesture, the hall slid past a motionless rabbit. Traversal now
      exposes `apparentVelocity`, measured from real displacement per frame, so keys,
      drag, flick momentum and the intro walk all drive the animation identically
- [x] **Drag is 1:1 with the wall.** `worldPerPixel` is computed from the live camera and
      viewport instead of a hardcoded `dragScale`, so a finger moves exactly the wall it
      is touching at any screen size. Wheel stays deliberately below 1:1
- [x] Tap-vs-drag slop is finger-sized on touch (12px) and mouse-sized otherwise (6px) —
      a thumb tap routinely travels several pixels and was being swallowed as a drag

### The walking mechanic, inverted

The first attempt — measuring the visitor's real displacement so the walk cycle matched
it — was treating the symptom. The cause was that **the bunny was the thing being
dragged**, so it moved at finger speed. No walk animation can match a finger, and no
amount of tuning fixes that.

- [x] **Input now drives the camera; the bunny walks after it.** A drag scrolls the hall
      like scrolling anything else on a phone. The bunny notices it has been left behind
      and walks over at its own pace, so its feet always agree with its speed
- [x] `Traversal.cameraX` is the value input moves; `x` (the bunny) is derived. Keys,
      drag, wheel, momentum, snapping and the hall bounds all act on the camera
- [x] The bunny follows with **hysteresis** — sets off once `followStartDistance` (0.7u)
      behind, keeps going until within `followStopDistance` (0.05u). A bare deadzone
      leaves it twitching in and out of the walk cycle on every small nudge
- [x] Two speed ceilings, and the split is the point: the view may scroll at
      `maxScrollSpeed` (7 u/s) but the bunny never exceeds `maxSpeed` (2.4 u/s). A flick
      throws the hall along and the bunny arrives on foot a moment later
- [x] The opening walk-in is no longer a special animation path — it is the ordinary
      follow behaviour with the camera parked on the first display and input held off
- [x] Grabbing the hall stops its momentum dead, the way grabbing a scrolling list does
- [x] Prefetching, mounting and view-counting now key off the camera rather than the
      bunny — you should be loading what is coming into view, not what the character has
      reached
- [x] **Leashed at 4.8u.** A flick scrolls faster than anything can walk, so the bunny is
      pulled forward once it falls further behind than that — invisibly, since it is
      already off-screen at that distance — and still walks the last stretch once the
      hall stops. Worst case is two seconds of catching up
- [x] The opening walk-in now starts at exactly `maxTrailDistance`, so the entrance and
      the leash are one number rather than two that can drift apart

---

## 6. Remaining work

Ordered roughly by what blocks what.

### A. Verify what has never been seen (do first — it is cheap and everything rests on it)
- [ ] **A1.** Open `/` and check the landing page against mockup 1 — plaque, sticky note
      tape, prop scale, whether it fits the frame without clipping at common heights
- [ ] **A2.** Open `/museum` and check the hall renders: wall, floor, frames, plaques,
      ropes, pedestals, bunny
- [ ] **A3.** Watch the walk cycle — feet sliding, jitter between frames, facing flip
- [ ] **A4.** Tap a work; check the region map hits the right piece and the enlarged view
      composites artwork into the frame window correctly
- [ ] **A5.** Drive the studio by hand: register, upload, arrange, publish. **Server
      actions were never exercised** — they cannot be driven by curl
- [ ] **A6.** Check the frame at desktop, tablet and phone sizes
- [ ] **A7.** With a track in place: confirm music starts on the first gesture, survives
      the walk from `/` into `/museum` without restarting, fades rather than cuts, and
      that the preference persists across a reload
- [ ] **A8.** The intro walk-in: does the hall fade in at the right moment, does the
      bunny's automated walk read as arriving rather than as lag, and is the 8-unit
      start distance right? (`Museum.tsx`, `firstCenter - 8`)
- [ ] **A9.** The enlarged view's directional slide — forward and back should feel
      distinct; check the artwork does not visibly re-load between works
- [ ] **A11.** The reworked enlarged-view layout: resize the window through tall, short
      and wide shapes and confirm title, artwork and description stay visible with no
      scrolling and nothing overlapping. Then check a long title (2-line clamp) and a
      long description (plaque grows, then scrolls internally)
- [ ] **A12.** **On a real phone**, not just a narrow browser window. Emulators do not
      reproduce safe areas, momentum, or the address bar collapsing. Check the hall, the
      landing page, the enlarged view and the studio on at least one notched iPhone and
      one Android
- [ ] **A13.** Swipe the hall and watch the bunny: it should stay put on a small drag,
      then set off walking and arrive a beat after a bigger one. It should never slide —
      if it looks like it is gliding rather than walking, `arriveSeconds` or
      `maxSpeed` is the knob
- [ ] **A14.** Confirm drag feels 1:1 — the wall should track the finger exactly, not
      lag or overshoot
- [ ] **A15.** Landscape on a phone: the frame becomes very wide and short. Untested,
      and the fit-by-width rule does nothing there — decide whether to support it, lock
      to portrait, or show a rotate prompt
- [ ] **A10.** Confirm input is genuinely dead during the intro (drag, wheel, tapping a
      work) and becomes live the instant it ends

### B. Pacing and feel (needs A done)
- [ ] **B1.** Tune `statue.minDwellMs` (currently 700ms) against a warm cache
- [ ] **B2.** Tune `statueSpan` (2.9u) and `move.maxSpeed` (2.4 u/s) — about 1.2s of
      walking between displays at present
- [ ] **B3.** Tune `camera.followDeadzone` (0.5u); try 0 to feel why it exists
- [ ] **B4.** Tune `character.cyclesPerUnit` (0.9) until the feet stop sliding
- [ ] **B5.** Decide snap-to-display on or off
- [ ] **B6.** Decide prefetch runway (`prefetchAheadUnits` 9u) and mount radius (14u)
- [ ] **B7.** Tune the intro: start distance (8u), the 0.8× speed cap during it, and the
      600ms hall fade — all in `Museum.tsx` / `Traversal.playIntro`
- [ ] **B8.** Decide whether the intro should replay on every entry to `/museum` or only
      on a visitor's first arrival
- [ ] **B9.** Tune the follow. `followStartDistance` (0.7u) is how far the bunny may
      drift before setting off — larger means it ignores small drags, smaller means it
      is more eagerly at your heels. `arriveSeconds` (0.5) is how briskly it closes the
      last of the gap. `maxScrollSpeed` (7 u/s) vs `maxSpeed` (2.4 u/s) sets how far
      behind a hard flick leaves it
- [ ] **B12.** ~~Decide what happens when the bunny is a long way behind.~~ **Decided:**
      a leash of `maxTrailDistance` = 4.8u. Still worth feeling on a device — at a phone's
      3.6u of visible hall that is 1.33 screens back, so a leashed bunny is just out of
      sight and two seconds' walk from the middle
- [ ] **B10.** Decide whether a first-time visitor needs a swipe hint. The intro walk-in
      demonstrates rightward motion, which may be enough; a persistent affordance would
      fight the calm the hall is going for
- [ ] **B11.** Re-check `minVisibleWidth` (3.6u) against a `cluster` display (5.4u wide).
      A four-work wall will not fit on screen at once on any phone — decide whether that
      is acceptable or whether phones should cap the layout template

### C. Product decisions still open
- [ ] **C1.** **One work per wall, or several?** Templates go to four; the mockups show
      exactly one. Both work today
- [ ] **C2.** Whether a QR visitor can walk out into the hall, and where they land
- [ ] **C3.** Whether the enlarged view needs true deep zoom (tiled pyramid) or whether
      the 1600px derivative is enough
- [ ] **C4.** Whether artists can reorder their walk-through (currently `order_index`
      exists but nothing sets it)

### D. Deployment (Amplify)
- [x] **D1.** **Amplify Hosting SSR compute cannot join a VPC.** Confirmed. The
      database must therefore be reachable over the public internet with TLS. The Gen 2
      worker *can* join a VPC (it is plain CDK), but there is no point in it reaching a
      database the web tier cannot
- [ ] **D2.** Database: Aurora Serverless v2 with public access, or a hosted Postgres
      (Neon and similar). `pg.Pool` per process is still wrong across many serverless
      instances — RDS Proxy or a pooling endpoint is the answer, not a smaller pool
- [x] **D3/D4.** Gen 2 backend written by hand as plain CDK in `amplify/backend.ts`.
      `defineFunction` was rejected deliberately: it gives no control over bundling, and
      sharp ships a native binary that must be excluded from the bundle and supplied by a
      linux/x64 layer. `defineBackend({})` + `createStack` is the documented escape hatch
- [x] **D5.** `amplify.yml` fixed and verified. Amplify runs every phase in ONE shell, so
      the old bare `cd ../..` leaked from preBuild into build and overshot the repo root.
      Every cd is now in a subshell. The exact command sequence was run in a clean
      worktree: `next build` completes with no env vars and no database
- [ ] **D6.** Create the S3 bucket, set `STORAGE_DRIVER=s3` + `S3_BUCKET`, point
      `MEDIA_BASE_URL` at CloudFront. `amplify/backend.ts` grants the worker
      Get/Put/Delete on `$S3_BUCKET/*` as soon as that variable is set
- [ ] **D7.** Verify `S3Storage` against a real bucket, presigned PUT included
- [ ] **D8.** Move mail to SES; verify the sending domain
- [ ] **D9.** Decide whether sessions move to Cognito or stay in Postgres for now
- [ ] **D10.** Set a real `SESSION_SECRET` in the Amplify environment
      (`openssl rand -hex 32`). The app now *refuses to start* in production without one,
      and refuses the published dev value, so this cannot be forgotten silently

#### D11. The app is deployed as a static site and must be switched to SSR
The 404 at `https://tinymuseums.com/` is not a build problem. Every response comes back
`server: AmazonS3`, and `/build-manifest.json`, `/required-server-files.json` and
`/server/app/page.js` all return 200 — Amplify uploaded the raw `.next` directory to S3
and is serving it as a static bucket. A Next.js app whose routes are all dynamic produces
no `index.html`, so every URL 404s.

The cause is almost certainly framework detection at connect time: Amplify reads the
**root** `package.json`, and ours declares only `concurrently`, `typescript` and
`embedded-postgres`. No `next`, so the app was classified static. It is an app attribute,
not a repo one, and no buildspec change fixes it.

- [ ] **D11a.** `aws amplify update-app --app-id d1wkk955zsue1z --platform WEB_COMPUTE`
- [ ] **D11b.** `aws amplify update-branch --app-id d1wkk955zsue1z --branch-name main
      --framework "Next.js - SSR"`
- [ ] **D11c.** Set `AMPLIFY_MONOREPO_APP_ROOT=apps/web` in the branch environment
- [ ] **D11d.** Redeploy, then confirm `/` returns 200 or 500 — anything but 404 means
      SSR is live. A 500 is expected until D2 lands
- [ ] **D11e.** Fallback if the platform will not flip: delete and recreate the app with
      the monorepo app root set to `apps/web` *at connect time*, so detection reads
      `apps/web/package.json`. Cost is re-doing the `tinymuseums.com` domain association
- [ ] **D11f.** Note: while the app is static, the whole server bundle is publicly
      downloadable. No secrets are in it — `required-server-files.json` shows `"env": {}`,
      because `env.ts` reads through getters at the point of use and bakes nothing at
      build time — but it is source disclosure until D11a lands

#### D12. Deploying the Gen 2 worker (written, never deployed)
`amplify/backend.ts` defines one scheduled function that drains the job queue. What is
verified locally: the handler bundles clean with esbuild, loads, exports `handler`,
resolves sharp from the layer, and runs end to end against local Postgres — twice, adding
no duplicate seal the second time.

- [ ] **D12a.** CDK bootstrap the account/region if it has never been bootstrapped
- [ ] **D12b.** Give the Amplify service role permission to deploy the backend
- [ ] **D12c.** Set the branch secrets `DATABASE_URL` and `SESSION_SECRET` — Amplify
      stores them at `/amplify/<app-id>/<branch>/`, which is what `SECRETS_SSM_PATH`
      points the function at. They are fetched at runtime, never baked into the
      function's configuration, because Lambda environment variables are readable by
      anyone with `lambda:GetFunctionConfiguration`
- [ ] **D12d.** Set the branch variables `S3_BUCKET`, `MEDIA_BASE_URL`, `PUBLIC_BASE_URL`,
      `STORAGE_DRIVER=s3`, `EPOCH_INTERVAL_MINUTES`. `backend.ts` reads these at synth
      time and bakes them in; they are not secret
- [ ] **D12e.** First deploy will exercise the one thing that could not be checked here:
      whether `defineBackend({})` with no Amplify-native resources synthesises. If it
      objects, the fix is to give it a resource rather than to abandon the CDK stack
- [ ] **D12f.** Confirm the EventBridge rule fires and CloudWatch shows
      `processed=… failed=… drained=…`

### E. Product gaps
- [ ] **E1.** Password reset — there is none
- [ ] **E2.** Email verification for artists at signup
- [ ] **E3.** Artist profile editing (statement, display name, slug)
- [ ] **E4.** Piece reordering in the studio
- [ ] **E5.** Moderation surface: a report button, and an admin view over `suppressions`
- [ ] **E6.** Rate limiting on inquiry, follow, and register
- [ ] **E7.** **No music track exists.** The whole sound system is built and waiting;
      drop a seamless loop at `apps/web/public/audio/hall.mp3` and it works. See that
      folder's README for what the track needs to be
- [ ] **E8.** `icon-no-photos.png` and `bunny_accessory.png` are prepped but unused
- [ ] **E10.** Empty and error states for the hall when a slice fails repeatedly
- [ ] **E12.** **The hall's error message is currently invisible.** `.hall-error` sits
      inside the `motion.div` that stays at `opacity: 0` until `ready` flips true — and
      `ready` only flips once a display mounts. So the exact failure it exists to report
      (assets or the first slice not loading) leaves a blank cream screen with no message
      and no way forward. Either hoist the error outside the fading container, or treat
      an error as a reason to reveal the hall
- [ ] **E13.** **`prefers-reduced-motion` no longer covers the UI.** The global CSS rule
      kills CSS transitions and animations, but Motion drives transforms from JavaScript
      and ignores it entirely — so the intro walk-in, the slide between works and the
      chrome entrance all still play for someone who asked for less motion. Wrap the app
      in `<MotionConfig reducedMotion="user">` and gate the intro walk on
      `useReducedMotion()`
- [ ] **E11.** Decide whether music defaults on or off for a first-time visitor
      (`DEFAULT_ENABLED` in `SoundProvider.tsx`, currently on)

### F. Engineering hygiene
- [ ] **F1.** **No tests exist.** Highest-value first: `composeLayout`, `hitTestRegionMap`,
      epoch permutation determinism, publish-bar evaluation, job claim under contention
- [ ] **F2.** No CI
- [ ] **F3.** Structured logging; request ids
- [ ] **F4.** `registerAction`'s `returnTo` has no caller since the landing form was
      removed — keep or strip
- [ ] **F5.** Lint is disabled during builds (`eslint.ignoreDuringBuilds`)
- [ ] **F6.** Licence Lazy Dog (specs.md) or commit to uppercase Sniglet for all-caps
- [ ] **F7.** The seed's five paintings repeat across artists — fine for seed, worth
      knowing before showing anyone
- [ ] **F8.** Dead code left by removing the per-display fade: `REVEAL_MS` is unused,
      `MountedDisplay.mountedAt` is written and never read, and `HallScene.fadeOf()` now
      returns a constant `1` — which makes the `fadeOf` callback threaded through
      `Placards.sync` pointless indirection. Either delete the plumbing or reinstate the
      fade; leaving a function that always returns 1 invites someone to trust it
- [ ] **F9.** `Museum.tsx` and `Walkthrough.tsx` have `import` statements partway down
      the file, below other declarations. Valid, but they hide from the import block
      where everyone looks

### G. Later
- [ ] **G1.** Stripe checkout — schema fields exist and are inert
- [ ] **G2.** Full drag-and-place composer, writing the same `Placement[]`
- [ ] **G3.** Deep zoom / tiled pyramids
- [ ] **G4.** Video and audio works
- [ ] **G5.** Curated wings, if open signup dilutes the hall

---

## 7. Known risks

**The composer is the quality lever.** These frames are ornate and opinionated. An artist
arranging four badly will look much worse than one placed well. The publish bar filters
careless walls; it cannot make a bad arrangement good. Templates buy time, not a solution.

**Open signup versus the gallery feeling.** Felt quality trends toward the average
submission. Isolated displays help — a weak wall never sits beside a strong one — and
epoch rotation spreads attention. If it still dilutes, §G5 is the lever.

**Amplify's VPC limitation (D1) is the one unknown that could reshape deployment.**
Everything else on the list is work; that one is a fork.

**No tests.** The riskiest untested logic is the epoch permutation and the job claim —
both are correctness-critical and neither fails loudly.

**The hall now fails silently.** Gating the whole hall on `ready` means any failure
before the first display mounts shows a blank screen rather than an error (E12). It is a
small fix, but until it lands, "nothing happens" is the failure mode a visitor sees for
a dead API, a missing asset, or an empty epoch alike.

**Motion is a second animation system.** CSS transitions and Motion now coexist. They do
not share the reduced-motion setting (E13), and only one of them is visible to the
stylesheet. Worth keeping the boundary sharp: Motion for React surfaces, CSS for
everything else, and neither anywhere near the 60fps hall loop.

---

## 8. Where things live

| Thing | Path |
| --- | --- |
| App | `~/tiny-museum` — GitHub: `mrlnlng/tinymuseums` |
| Geometry prototype | `~/gallery-poc` (not in the repo) |
| Source art | `~/Desktop/tiny_museum_assets` — **deliberately not in git** |
| Prepared assets | `apps/web/public/assets` (generated) + `packages/core/assets` (frame + manifest only) |
| Local media (S3 stand-in) | `.data/media` |
| Local Postgres cluster | `.data/pgdata` |
| Design doc (artifact) | <https://claude.ai/code/artifact/f22f1968-b9c9-4fd5-9c5d-b9ecc80c1549> |
