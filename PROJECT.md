# Inspiratiq's Tiny Museum — project state

Everything decided, everything built, and everything left. Kept next to the code so it
can be updated as tasks close.

- **Status:** running locally, end to end. Not deployed.
- **Stack:** TypeScript, Next.js 15 (App Router, React 19), Node worker, Postgres, sharp,
  Three.js. Amplify Hosting + Amplify Gen 2 for deployment.
- **Companion docs:** `README.md` (how to run it), `docs/` (none yet).

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
| Visitor | A **character** (the bunny) walked left/right | Camera follows through a deadzone |
| Ordering | **Epoch rotation** — deterministic permutation, reseeded on a schedule | Fair entrance position, no artist buried forever |
| Cursor stability | **Epoch snapshot**; cursor is `(epoch_id, index)` | Walking back shows the same hall |
| Takedown | Read-time suppression, outside the epoch snapshot | A takedown cannot wait for the next boundary |
| Admission | Open signup + an objective **publish bar** | Nobody judged on taste |
| Accounts | Artists full; visitors anonymous, email-only to follow | Following is a row, not an account |
| Sales | **Inquiry only** — emails the artist | Platform takes no revenue and is not party to the sale |
| Commerce schema | Modelled now, inert | Stripe lands additively |
| Screens | **One 9:16 frame** in CSS; no page sets its own size | Matches the 1080×1920 mockups |
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

### B. Pacing and feel (needs A done)
- [ ] **B1.** Tune `statue.minDwellMs` (currently 700ms) against a warm cache
- [ ] **B2.** Tune `statueSpan` (2.9u) and `move.maxSpeed` (2.4 u/s) — about 1.2s of
      walking between displays at present
- [ ] **B3.** Tune `camera.followDeadzone` (0.5u); try 0 to feel why it exists
- [ ] **B4.** Tune `character.cyclesPerUnit` (0.9) until the feet stop sliding
- [ ] **B5.** Decide snap-to-display on or off
- [ ] **B6.** Decide prefetch runway (`prefetchAheadUnits` 9u) and mount radius (14u)

### C. Product decisions still open
- [ ] **C1.** **One work per wall, or several?** Templates go to four; the mockups show
      exactly one. Both work today
- [ ] **C2.** Whether a QR visitor can walk out into the hall, and where they land
- [ ] **C3.** Whether the enlarged view needs true deep zoom (tiled pyramid) or whether
      the 1600px derivative is enough
- [ ] **C4.** Whether artists can reorder their walk-through (currently `order_index`
      exists but nothing sets it)

### D. Deployment (Amplify)
- [ ] **D1.** **Confirm whether Amplify Hosting SSR compute can reach a VPC.** This
      decides D2. My knowledge of it is past its cutoff
- [ ] **D2.** Database: Aurora Serverless v2 + Data API (HTTP, no VPC) *or* RDS + RDS
      Proxy. `pg.Pool` per process is wrong across many serverless instances either way
- [ ] **D3.** Scaffold the Gen 2 backend with `npm create amplify@latest` — do not
      hand-write `defineFunction` / `defineStorage` / `defineAuth`
- [ ] **D4.** Wire the worker as a scheduled Gen 2 function using `apps/worker/src/lambda.ts`
- [ ] **D5.** Verify `amplify.yml` — written from the monorepo spec, never run. The
      `cd ../..` in both phases matters or the workspace link will not exist
- [ ] **D6.** Create the S3 bucket, set `STORAGE_DRIVER=s3` + `S3_BUCKET`, point
      `MEDIA_BASE_URL` at CloudFront
- [ ] **D7.** Verify `S3Storage` against a real bucket, presigned PUT included
- [ ] **D8.** Move mail to SES; verify the sending domain
- [ ] **D9.** Decide whether sessions move to Cognito or stay in Postgres for now
- [ ] **D10.** Set a real `SESSION_SECRET` in the Amplify environment
      (`openssl rand -hex 32`). The app now *refuses to start* in production without one,
      and refuses the published dev value, so this cannot be forgotten silently

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
