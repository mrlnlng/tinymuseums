# Local end-to-end stress test — 2026-11-06

Status: fixes made on 2026-11-06 (see the Fix status table below and `docs/rooms.md`). Originally findings only. Tested the current working tree, including the personal-room changes already present when testing started.

## Environment and coverage

- Local Next.js development server on port 3000, Postgres on 5433, presence on 8787.
- Tested both `http://localhost:3000` and the configured local origin, `http://192.168.1.66:3000`. The latter matters for the media-origin bug below.
- Node 22.23.2; headless Chromium from the installed `chromium-1248` cache, driven through Playwright. The default Playwright browser revision was absent, so the installed executable was selected explicitly.
- Desktop browser emulation at 390×844, plus layout checks at 320×568, 844×390 and 1440×900. These are browser viewport checks, not physical-device testing.
- Local fixture: one artist, five paintings, no guest-board notes. Load results do not establish capacity with a large collection or guest board.
- Covered landing and hall loading, walking to the end, room creation, account creation/sign-out/sign-in, room editing, pointer versus keyboard placement, undo, publication/reload, sharing and revocation, failed saves, immediate reload, repeated editing, malformed API inputs, and concurrent readers/visitors.
- Existing tests: `npm test` passed (43 reported tests); `npm run typecheck` passed for all workspaces; database integration tests passed (35 tests, schema applied twice).
- Database integration tests used a separate local database, `tiny_museum_test_stress_20261106`, rather than recreating the app database.

Raw JSON and screenshots: [`output/e2e-stress-2026-11-06/`](../../output/e2e-stress-2026-11-06/). That output directory is local evidence and may be untracked; this Markdown file is the durable findings log. Existing, more focused room findings are in [`docs/personal-room-issues.md`](../personal-room-issues.md); overlapping issues are explicitly identified below.

## Measured load

Each API stage sent 120 reads, distributed evenly across `/api/hall`, `/api/guestboard?limit=5`, `/api/artists/test-artist/pieces`, and `/api/rooms/hall`.

| Concurrent requests | Total requests | Stage duration | p50 | p95 | Maximum | Responses |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 120 | 2,145 ms | 11 ms | 64 ms | 79 ms | 120 × 200 |
| 8 | 120 | 1,653 ms | 123 ms | 153 ms | 192 ms | 120 × 200 |
| 24 | 120 | 1,325 ms | 286 ms | 347 ms | 365 ms | 120 × 200 |
| 48 | 120 | 989 ms | 364 ms | 484 ms | 489 ms | 120 × 200 |

All 480 normal reads succeeded. Malformed-input failures below were separate probes, not failures of this read-load run. These measurements are from development mode on a shared local machine, not a production throughput benchmark.

Four separate browser contexts also visited the configured local origin concurrently, waited for loading, and walked the hall. All four finished with no page exceptions, no HTTP errors, no loading curtain remaining, and a presence WebSocket to `/room/hall-e24-s0`. The roughly 21-second scenarios included deliberate 15-second and 5-second waits; that is not a measured load time. Evidence: `concurrent-browser-results.json` and `concurrent-visitor-*.png`.

## Issue index

Every issue below is open. P1 = data loss, ownership violation, or a blocked core experience; P2 = functional, validation, or recovery defect; P3 = development noise or polish.

| ID | Priority | Issue |
| --- | --- | --- |
| E2E-001 | P1 | Alternate local origin breaks artwork fallback URLs |
| E2E-002 | P1 | Valid edge placement rejected through floating-point precision |
| E2E-003 | P1 | One owned prop can be placed multiple times |
| E2E-004 | P1 | Reload before autosave silently loses the latest placement |
| E2E-005 | P2 | Failed save and failed Done have no visible mobile explanation |
| E2E-006 | P2 | Restoring connectivity does not retry a failed draft save |
| E2E-007 | P2 | Keyboard activation cannot place drawer items |
| E2E-008 | P2 | Creating an account from My Room leaves the signed-in user on the sign-in prompt |
| E2E-009 | P2 | Room mutations ignore stale account identity |
| E2E-010 | P2 | Fish trophies can be granted without playing Pond |
| E2E-011 | P2 | Invalid hall pagination reaches SQL and returns 500 |
| E2E-012 | P2 | Fractional guest-board limit returns 500 |
| E2E-013 | P2 | Follow endpoint crashes on null or non-string fields |
| E2E-014 | P2 | Event endpoint crashes on a null JSON body |
| E2E-015 | P2 | Event endpoint returns 500 for well-formed but nonexistent IDs |
| E2E-016 | P3 | Landing artist list repeats an artist and uses duplicate React keys |
| E2E-017 | P2 | Documented local database startup cannot run with the installed dependencies |
| E2E-018 | P3 | Browser favicon request returns 404 |

## Fix status (2026-11-06)

| ID | Fix | Checked |
| --- | --- | --- |
| E2E-001 | `sameOriginUrl` keeps a path that already starts with `/api/media/` | Code only; LAN-origin setup not rerun |
| E2E-002 | Rounding plus server edge slack | Browser and unit test |
| E2E-003 | `duplicate_prop` on the server, guard on the client | API and unit test |
| E2E-004 | Keepalive flush on leaving | Browser |
| E2E-005 | Visible save dot and a Done notice on phones | Browser |
| E2E-006 | Retry on `online` and with backoff | Browser |
| E2E-007 | Keyboard clicks on cards place them | Browser |
| E2E-008 | `HomeSignIn` refreshes the page once a member appears | Code only |
| E2E-009 | `X-TM-Member` checked on room mutations | API |
| E2E-010 | Server-rolled catch from a signed cast ticket | API and unit tests |
| E2E-011 | Hall `after`/`limit` must be in-range integers, else 400 | curl |
| E2E-012 | Guest-board `limit` must be a positive integer, else 400 | curl |
| E2E-013 | Follow validates field types | curl: 400 |
| E2E-014 | Events reject non-object bodies | curl: 400 |
| E2E-015 | Events with unknown artist or work are dropped (204) | curl |
| E2E-016 | Landing list deduplicated by artist | curl: Test Artist listed once |
| E2E-017 | README uses `docker compose`; `embedded-postgres` stays optional | Docs |
| E2E-018 | `app/favicon.ico` and `app/apple-icon.png` | curl: 200 |

## Confirmed issues

### E2E-001 — Alternate local origin breaks artwork fallback URLs

- **Reproduce:** with `MEDIA_BASE_URL=http://192.168.1.66:3000/api/media`, open `http://localhost:3000/museum` and walk through the paintings.
- **Observed:** WebGL image fetches to the LAN origin are blocked by CORS. The fallback requests `/api/media/api/media/pieces/<id>/frame/v6.avif`, which returns 404. Repeated attempts create more failed requests.
- **Expected:** the same artwork loads when visiting either supported local address.
- **Evidence:** `probe-events.json`, `browser-results.json`. A direct request to `/api/media/pieces/49c20d22-0d32-4240-b3a4-e9221df320bd/frame/v6.avif` returned 200; the duplicated-prefix version returned 404. The configured-origin browser run had no corresponding media HTTP failures.
- **Location:** [`sameOriginUrl`](../../apps/web/src/features/hall/lib/media.ts:4) blindly prefixes `/api/media` to a pathname that can already contain it.
- **Follow-up:** normalize the existing media pathname before applying the same-origin prefix; check hall, sketch and enlarged-art consumers.

### E2E-002 — Valid edge placement rejected through floating-point precision

- **Reproduce:** in your own room, PUT `/api/rooms/<slug>/draft` with `{"placements":[{"id":"edge-carpet","kind":"prop","ref":"carpet","zone":"floor","x":3.0999999999999996}]}`.
- **Observed:** 400 with `{"error":"invalid","reason":"out_of_bounds"}`. This is the floating-point representation produced at the carpet's left placement boundary.
- **Expected:** numerical noise at a permitted boundary does not reject the arrangement.
- **Evidence:** `rooms-results.json`, `save-edge-precision`. This independently repeats personal-room issue 1; that earlier report includes the UI tap reproduction.
- **Follow-up:** reconcile client clamping with server bounds, including a small numerical tolerance. This interacts with the draft rollback described in the earlier report's issue 3.

### E2E-003 — One owned prop can be placed multiple times

- **Reproduce:** save two placements with different IDs, both `ref: "pillow-red"`, at floor x=5 and x=7, while owning one red pillow.
- **Observed:** draft PUT returned 200, and a subsequent GET contained both placements.
- **Expected:** the server enforces the single owned instance represented by inventory.
- **Evidence:** `rooms-results.json`, `duplicate-ownership`. Reconfirms personal-room issue 2.
- **Follow-up:** validate per-prop inventory limits on the server and guard rapid repeat placement on the client.

### E2E-004 — Reload before autosave silently loses the latest placement

- **Reproduce:** open Decorate with the red pillow available, click its card, and immediately reload before the 700 ms autosave delay expires.
- **Observed:** the room's draft was still empty after reload. The visible placement had never reached the server.
- **Expected:** pending changes are flushed on navigation/page hiding, or leaving clearly warns about losing them.
- **Evidence:** `rooms-results.json`, `rapid-place-and-reload`. Reconfirms personal-room issue 4.
- **Location:** autosave timer and abort cleanup in [`PersonalRoom.tsx`](../../apps/web/src/features/hall/components/PersonalRoom.tsx:270).

### E2E-005 — Failed save and failed Done have no visible mobile explanation

- **Reproduce:** at 390×844, abort requests matching `**/api/rooms/*/draft`, place an item, wait for autosave, then click Done.
- **Observed:** the editor remained open with no explanatory notice. `.decor-status` was not visible. The drawer still looked usable, and the new arrangement was not saved.
- **Expected:** an accessible, visible error explains that the arrangement is unsaved and that Done could not finish.
- **Evidence:** `rooms-results.json`, `offline-save-and-recovery`, and `offline-save-mobile.png`. Reconfirms part of personal-room issue 6.
- **Location:** network failure only sets status in [`PersonalRoom.tsx`](../../apps/web/src/features/hall/components/PersonalRoom.tsx:250); the mobile layout hides that status.

### E2E-006 — Restoring connectivity does not retry a failed draft save

- **Reproduce:** follow E2E-005, remove the request interception, dispatch the browser's `online` event, and wait three seconds without changing the arrangement.
- **Observed:** the server draft still contained only the previously saved pillow, not the newly placed shelf. Clicking Done again saved both.
- **Expected:** dirty changes retry on connectivity restoration or the UI gives an explicit retry action.
- **Evidence:** `rooms-results.json`, the `before`, `afterRecovery`, and `afterManualRetry` fields. Reconfirms the other part of personal-room issue 6.
- **Follow-up:** keep a dirty-save state and retry on recovery with bounded backoff.

### E2E-007 — Keyboard activation cannot place drawer items

- **Reproduce:** open Decorate with an unplaced red pillow, Tab/focus its card, press Enter and Space, then wait for autosave.
- **Observed:** the focused card remained available and the draft stayed empty. A subsequent pointer click placed and saved the pillow.
- **Expected:** a button's standard keyboard activation performs the same action as tapping it.
- **Evidence:** `rooms-results.json`, `keyboard-placement` and `pointer-placement`. Reconfirms personal-room issue 9.
- **Location:** drawer cards only attach [`onPointerDown`](../../apps/web/src/features/rooms/decorate/DecorDrawer.tsx:244).

### E2E-008 — Creating an account from My Room leaves the signed-in user on the sign-in prompt

- **Reproduce:** anonymously open `/museum/home`, click Open account, create an account, then close the account dialog.
- **Observed:** the account was successfully created, but `/museum/home` still said “Sign in to get your own room” and displayed Open account. Calling the home endpoint and navigating to its room worked.
- **Expected:** successful authentication refreshes the server-rendered home page or takes the member to their room.
- **Evidence:** `browser-results.json`, `anonymous-home-signup`; `signup-from-home.png`.
- **Location:** [`HomeSignIn.tsx`](../../apps/web/src/features/rooms/personal/HomeSignIn.tsx) opens the account dialog but does not react to successful authentication; the redirect in the home page runs on the server.

### E2E-009 — Room mutations ignore stale account identity

- **Reproduce:** while authenticated, PUT your room's draft with `X-TM-Member: 00000000-0000-0000-0000-000000000001`, different from the authenticated member.
- **Observed:** the room draft mutation succeeded with 200. A wallet claim mutation with the same mismatched header correctly returned 409 `member_mismatch`.
- **Expected:** a tab associated with another member cannot mutate the currently signed-in member's room through a shared cookie session.
- **Evidence:** `member-api-results.json`, `stale-mutations`. Reconfirms personal-room issue 11. The earlier supplemental wallet GET was not a valid guard comparison; the POST comparison is the relevant evidence.
- **Location:** [`draft/route.ts`](../../apps/web/src/app/api/rooms/[slug]/draft/route.ts) reads the cookie session directly, bypassing `memberFromRequest`'s identity check. The room client also needs to send its expected identity.

### E2E-010 — Fish trophies can be granted without playing Pond

- **Reproduce:** as a member, POST `/api/wallet/collect` with `{"item":"prop:fish-golden-koi","source":"pond"}`, without making a cast or catching anything.
- **Observed:** 200, `collected: true`, and the golden koi appeared in inventory. Repeating the request returned `collected: false`, so duplication protection works but catch verification is absent.
- **Expected:** an earned trophy corresponds to a verified game outcome, if trophy scarcity is intended.
- **Evidence:** `member-api-results.json`, `fake-fish-collect`. Reconfirms personal-room issue 5.
- **Location:** [`collect/route.ts`](../../apps/web/src/app/api/wallet/collect/route.ts) verifies only that the client-provided source string matches the catalog.
- **Follow-up:** decide whether trusting local game outcomes is intentional; otherwise issue and validate a server-side catch token. No florins were awarded by these probes.

### E2E-011 — Invalid hall pagination reaches SQL and returns 500

- **Reproduce:** GET `/api/hall?after=1.5`, `?after=Infinity`, `?after=2147483648`, `?after=1e100`, or `?limit=2.5`.
- **Observed:** each returned 500 with an empty response body. Ordinary requests succeeded immediately before/after.
- **Expected:** invalid pagination returns a controlled 400 or is normalized to a supported integer range.
- **Evidence:** `api-results.json` and `extra-api-results.json`.
- **Location:** [`hall/route.ts`](../../apps/web/src/app/api/hall/route.ts:9) clamps numbers without checking finite integers or database integer range.

### E2E-012 — Fractional guest-board limit returns 500

- **Reproduce:** GET `/api/guestboard?limit=2.5`.
- **Observed:** 500 with an empty response body, even with no notes in the database.
- **Expected:** a controlled 400 or integer normalization.
- **Evidence:** `api-results.json`.
- **Location:** [`guestboard/route.ts`](../../apps/web/src/app/api/guestboard/route.ts:14) converts the query value to a number without validating it as an integer before the database limit.

### E2E-013 — Follow endpoint crashes on null or non-string fields

- **Reproduce:** POST JSON `null` to `/api/follow`; also try `{"slug":123,"email":"x@example.test"}` or `{"slug":"test-artist","email":123}`.
- **Observed:** all returned 500. Malformed JSON itself was correctly rejected, so this is a parsed-body validation gap.
- **Expected:** 400 with the existing validation message.
- **Evidence:** `api-results.json`, `extra-api-results.json`.
- **Location:** [`follow/route.ts`](../../apps/web/src/app/api/follow/route.ts:13) dereferences the body and calls `.trim()` on unvalidated values.

### E2E-014 — Event endpoint crashes on a null JSON body

- **Reproduce:** POST JSON `null` to `/api/events`.
- **Observed:** 500; `{}` and unsupported event kinds were rejected with 400.
- **Expected:** a null/non-object body is rejected with 400.
- **Evidence:** `api-results.json`.
- **Location:** [`events/route.ts`](../../apps/web/src/app/api/events/route.ts:14) reads `body.kind` without first checking the parsed value.

### E2E-015 — Event endpoint returns 500 for well-formed but nonexistent IDs

- **Reproduce:** POST `{"kind":"piece_view","artistId":"00000000-0000-0000-0000-000000000001"}` to `/api/events`; also try the real test artist ID with a nonexistent piece UUID.
- **Observed:** both returned 500.
- **Expected:** unknown references are rejected or ignored in a controlled way, rather than surfacing an unhandled server failure.
- **Evidence:** `extra-api-results.json`.
- **Location:** [`events/route.ts`](../../apps/web/src/app/api/events/route.ts:19) validates UUID syntax, then writes without handling nonexistent references.

### E2E-016 — Landing artist list repeats an artist and uses duplicate React keys

- **Reproduce:** visit `/` with the existing fixture of five paintings by Test Artist.
- **Observed:** the “Artists currently showing” navigation listed Test Artist five times. The browser console repeatedly reported duplicate React keys for that artist ID.
- **Expected:** a list of artists contains unique artists, and rendered list keys are unique.
- **Evidence:** `probe-events.json` and the landing page's captured text in `probe.log`. This list is offscreen accessibility/SEO content; no visible painting duplication was established.
- **Location:** [`CurrentlyShowing`](../../apps/web/src/app/page.tsx:70) maps paintings but keys each entry by artist ID.

### E2E-017 — Documented local database startup cannot run with the installed dependencies

- **Reproduce:** run the README command `node --experimental-strip-types scripts/db.ts` in this checkout.
- **Observed:** `ERR_MODULE_NOT_FOUND: Cannot find package 'embedded-postgres'`. It is not declared in the root manifest. Existing local Postgres was already available, allowing testing to proceed.
- **Expected:** documented setup commands have installable, declared dependencies, or accurately describe the required external database setup.
- **Evidence:** `database-startup.log`; [`README.md`](../../README.md:7), [`package.json`](../../package.json). The separate startup failure inside the earlier restricted sandbox was environmental and is not counted as an app issue.
- **Follow-up:** align the README, ignored tooling, and dependency/bootstrap story. `.agents/PROJECT.md` also contains older `npm run db`/migration/seed examples that are not root package scripts.

### E2E-018 — Browser favicon request returns 404

- **Reproduce:** GET `/favicon.ico` from the local server.
- **Observed:** 404; fresh browser visits also logged a failed resource request.
- **Expected:** a favicon is served or declared through app metadata.
- **Evidence:** direct HTTP check and initial browser console output. Low impact; keep this separate from artwork failures.

## Passing checks and interpretation limits

- Pointer placement, undo, Done/publication, and reload persistence passed when allowed to complete normally.
- Ten concurrent home-creation requests returned the same room slug.
- Sharing API checks passed: anonymous view via share key returned 200 with `canEdit: false`; attempted editing returned 403; after disabling sharing, the old key returned 404.
- Account creation, sign-out, and sign-in passed. This does not cover password recovery; the application already explicitly documents that no recovery flow exists.
- The hall computer opened all three games. Color Recall reached its four-option selection phase after Start; Pond rendered and accepted movement input; Sketch Guess displayed its mode/difficulty chooser. No uncaught exceptions or HTTP failures were captured in this configured-origin game pass. Evidence: `minigame-results.json` and `minigame-*.png`. Completing rounds/catches and checking reward totals was not covered.
- Fifteen repeated edit/Done cycles left two canvases and no leftover drawer at sampled boundaries. Heap samples rose from about 104 MB to 119 MB without forced garbage collection; this is an observation, not proof of a memory leak.
- Initial responsive checks found no document overflow at the three viewport sizes above and kept Done within the viewport. A later rapid-cycle run ended with a generic save notice and an open editor; the publish endpoint has a 20/minute limit. The exact response was not captured in that run, so it is not recorded as a separate confirmed defect.
- An initial room script incorrectly expected unplaced starter items in a fresh room, where all three starter props are already placed. Those missing-locator errors are test setup failures. The corrected supplemental run explicitly emptied only its disposable room before testing placement.
- The checkbox UI sharing attempt used Playwright's immediate checked-state assertion against an asynchronous server-controlled checkbox and failed that assertion. Server/API sharing was independently verified; that assertion failure is not evidence of broken sharing.
- Some atelier tests targeted controls before walking near their virtualized exhibits. Those missing-locator failures are not recorded as product bugs.
- Initial computer-opening attempts clicked the wrong canvas coordinates. A corrected attempt opened the computer and the three games. A later rapid modal-cycle attempt did not reopen Color Recall after a forced click during transitions; because that test bypassed normal click stability checks, it remains inconclusive rather than a confirmed defect.
- A first concurrent-buy probe used `item` instead of the endpoint's expected `itemId` and correctly got 400. It does not demonstrate a purchase defect or establish successful purchase concurrency.
- Headless GPU warnings, navigation-aborted audio requests, and the expected reduced-motion warning were not counted as application defects.

## Follow-up coverage

- Real touch hardware, especially scrolling the decoration cards versus picking them up. The existing room report's touch concern remains unverified here.
- Owner-only studio upload/processing/publish/curation, moderation, and real mail delivery. This pass did not alter the owner's gallery or submit inquiries/follows to real recipients.
- A full game completion/score/reward audit, larger data fixtures, long-duration soak, and production build performance remain separate coverage needs.
- Rejected-save whole-draft rollback, overlapping edits in two tabs, and sign layout problems are already tracked in the earlier personal-room report; they were not independently reproduced through the UI in this pass.

## Test data and cleanup

- Disposable browser/API members `stress-1793949307603@example.test` and `stress-rooms-1793949397807@example.test` were deleted through `/api/me/delete`; both returned 204. Their test room/inventory data was confined to those accounts.
- Read-only load traffic and browser visits generated normal local visit/analytics/presence activity. Malformed event requests did not intentionally add valid art-view events.
- The separate `tiny_museum_test_stress_20261106` integration database remains available for inspection. No app database recreation was performed.
- Browser processes created for these tests are closed after each run. Existing local app/database/presence services are left running.
- Ran `graphify update .` successfully after the session; the AST graph was refreshed (3,211 nodes, 8,131 edges). Application source files were not edited for this testing pass.
