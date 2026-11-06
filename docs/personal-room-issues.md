# Personal room: stress-test issues

Found 2026-11-05 by an end-to-end pass on the local dev server (localhost:3000, Docker Postgres).
The pass had two layers:
- **API:** 55 scripted checks run as two members and an anonymous visitor: permissions, validation,
  concurrency, rate limits, sharing, economy and presence tickets.
- **Browser:** tapping, dragging, undo, reloads, failing saves, back navigation, edit-mode cycles,
  visitor views.

Severity: **High** means data is lost or wrong, or players can exploit it. **Medium** means real
players will hit it. **Low** means polish or edge cases.

## Status (2026-11-06)

All 19 issues are addressed in the working tree; `docs/rooms.md` ("Stress-test fixes") has the design.

| # | Fix | Checked |
| --- | --- | --- |
| 1 | x rounded to 0.001; 1e-6 edge slack on the server | Browser: carpet at 3.1 saved |
| 2 | Server rejects a repeated prop `ref`; client ignores a card whose thing is out | API 400 `duplicate_prop`; unit test |
| 3 | A refusal names the placement; only it is put back | Browser, with a faked 400 |
| 4 | Keepalive flush on `pagehide`, tab hidden and unmount | Browser: keyboard place, reload at once, saved |
| 5 | Server-signed cast ticket; the server rolls the fish | API: old request and early ticket refused; unit tests. Not done: a full catch in the browser, to avoid granting a real trophy |
| 6 | Save dot always visible, notice on Done, backoff retries and retry on `online` | Browser, with fetch failing then restored |
| 7 | `draft_version` and 409 `conflict` on save and publish | Browser and DB test |
| 8 | Cards are `touch-action: pan-x`; only an upward drag picks one up | Not checked on a real touch device |
| 9 | Enter/Space places a card; "In room" list selects and pans to a thing | Browser |
| 10 | Long names shrink, and the sign wraps past 15em | Browser |
| 11 | Rooms routes require `X-TM-Member` to match on personal rooms | API 409 `member_mismatch` |
| 12 | Leash off while decorating; view glides back after Done | Browser |
| 13 | Loading screen scoped to the hall, so rooms answer 404 / redirect | curl: missing room 404 |
| 14 | Not editable answers 404 whether or not the room exists | API |
| 15 | Name sign hidden in Decorate | Browser |
| 16 | A level celebrates only the first time per visit | Code only |
| 17 | Edge markers ("‹ 2") and the In room list | Browser |
| 18 | "In room n/24" counter; placing at the cap says why | Code only |
| 19 | `roomPageView` decides access in SQL | Page payload has no `shareToken`/`ownerMemberId` |

## High

### 1. Items placed against a zone edge fail to save, and the whole draft reverts
- **Repro:** enter Decorate near the door and tap the Carpet card. It lands at
  `x = 3.0999999999999996`. The server computes its left edge as `1.8999999999999995`, which is
  below the zone's `minX` of 1.9, and rejects the save with `out_of_bounds`. The client shows "That
  does not fit there" and reverts everything since the last save.
- **Why:** floating-point error in `clampX` (client) against a strict `<` check in
  `validatePlacements` (server).
- **Fix:** round x to 3 decimals on the client, and allow ~1e-6 tolerance in the server's bounds check.

### 2. One owned item can be placed many times
- **Repro (UI):** tap the same drawer card twice before React re-renders (a fast double-tap). The
  room gets two Red pillows from one owned pillow, and the server saves both.
- **Repro (API):** PUT a draft with the same `ref` twice. The server returns 200.
- **Fix:** `validatePlacements` should reject a prop `ref` that appears more than once (each
  item is owned once). On the client, ignore a tap on a card whose item is already in
  `draftRef.current`.

### 3. Any save rejection throws away all unsaved work
- **Repro:** cause any 400 (for example issue 1). `persist` resets the draft to `savedRef`, so
  every change since the last successful save is lost, not just the bad one.
- **Fix:** reject only the offending change (undo the last step), or keep the draft and highlight
  the bad item.

### 4. Changes made just before leaving are lost
- **Repro:** place an item, then reload or navigate within 700 ms (the autosave debounce). The
  draft on the server doesn't include it.
- **Fix:** flush the pending save on `pagehide`/`visibilitychange` with `fetch(..., { keepalive: true })`,
  and on unmount when there are unsaved changes.

### 5. Fish trophies can be claimed without playing
- **Repro:** `POST /api/wallet/collect { item: 'prop:fish-golden-koi', source: 'pond' }` as any
  member returns `collected: true`.
- **Why:** the server trusts the client that a fish was caught (the same trust model as game
  scores). Trophies are worth the most cozy points.
- **Fix:** have the server roll the catch (a server-issued cast token, then a reel that returns
  the fish), or at least rate-limit to one collect per few seconds and log it.

## Medium

### 6. Failed saves are nearly invisible, and nothing retries
- **Repro:** make room saves fail (offline). The status reads "Not saved yet", Done does nothing,
  and no notice explains why. The phone layout hides `.decor-status` entirely. When the network
  returns, nothing retries until you change something else.
- **Fix:** show a notice when Done can't save, keep the status visible on phones (an icon is
  enough), and retry on `online` and on an interval while unsaved.

### 7. Two tabs editing the same room overwrite each other
- **Repro:** 20 concurrent draft PUTs. The last write wins and nothing warns either tab.
- **Fix:** store a draft version. PUT sends the version it loaded, and the server returns 409 on
  a mismatch, so the client can reload or merge.

### 8. The drawer's card row can't be scrolled on touch screens
- **Why:** `.decor-card` sets `touch-action: none`, and pointerdown starts a carry. A horizontal
  swipe across the cards picks up an item instead of scrolling the row. With more than about four
  items, the rest are unreachable on phones.
- **Fix:** start a carry only once the finger moves mostly upward (or after a short hold). A
  horizontal move should scroll (`touch-action: pan-x` on cards).
- Not checked on a real device; inferred from the code and the CSS.

### 9. Decorating can't be done with the keyboard
- **Why:** drawer cards only handle `onPointerDown`, so Enter or Space does nothing. Placed items
  can only be selected with a pointer. Placed items aren't announced to screen readers either.
- **Fix:** give cards an `onClick` that does the tap-to-place, and add Tab/arrow cycling through
  placed items to select them (the existing arrow, F and Delete shortcuts then work).

### 10. Long names run off the name sign
- **Repro:** a member named "Wanderingmarshmallowfoxglove Q". The sign reads
  "Wanderingmarshmallowfoxglove Q's room" and runs off the right edge of the screen.
- **Fix:** cap the sign's width (for example 5 world units) and wrap to two lines, or shrink the font for long names.

### 11. The rooms API skips the stale-tab member check
- **Repro:** a draft PUT with `X-TM-Member` set to a different member still succeeds (200).
  Wallet routes return 409 `member_mismatch` in that case.
- **Risk:** a tab left open from a previous account can save into whoever is signed in now.
- **Fix:** have the client send `X-TM-Member` and the rooms mutations check it, as the wallet does.

### 12. The bunny is dragged along while you pan in Decorate
- **Repro:** in Decorate, drag empty space to pan. The faded bunny follows (Traversal's leash),
  so after Done it stands somewhere you never walked to.
- **Fix:** skip the leash while suspended, or put the camera back at the bunny when leaving edit.

## Low

### 13. Pages that redirect or don't exist answer 200
- `/museum/home` redirects on the client after the loading shell streams, so the HTTP status is
  200 rather than 307.
- `/museum/r/<missing>` returns 200 and renders not-found on the client.
- **Cause:** both come from the `app/museum/loading.tsx` streaming boundary.
- **Fix (if it matters):** move the room pages outside that boundary, or check rooms in middleware.

### 14. Error codes reveal which room slugs exist
- **Repro:** an anonymous draft PUT returns 404 for a missing room and 403 for a private one.
- **Risk:** slugs are 8 random base-36 characters, so it's hard to exploit.
- **Fix:** return 404 for both.

### 15. The name sign slides under the top-right buttons in Decorate
- **Repro:** when the camera lifts for the drawer, the sign ends up behind the home and settings buttons.
- **Fix:** hide the sign in edit mode, or anchor it lower.

### 16. Level-up celebrations can be farmed
- **Repro:** put an item away and place it again to cross a level, and the harp and toast fire
  each time.
- **Fix:** celebrate a level only the first time it's reached in a session (or ever, stored per room).

### 17. No hint of where things are after panning away
- **Repro:** in a 20-unit room you can pan to an empty stretch with no clue where your items are.
- **Fix:** add small markers at the edges of the view pointing to off-screen items, or a simple minimap strip.

### 18. Too many items is only discovered by the server
- **Repro:** the 24-item cap (`maxPlacements`) has no counter in the drawer. Going past it gets a
  400, which then hits issue 3.
- **Fix:** show "12/24" in the drawer and disable placing at the cap.

### 19. Development-only: page payloads include the full room row
- **Repro:** in `next dev`, React's async debug info in the RSC payload carries the awaited
  `getRoom` row (`shareToken`, `ownerMemberId`), even when the page shows "This room is private".
- **Risk:** production builds strip this, so it's a reminder rather than a leak.
- **Fix:** check a production build, and consider selecting only the fields the page needs.

## Checked and fine
- Permissions:
  - Strangers and anonymous visitors can't view, edit, publish or toggle sharing on a private room (403 or 404).
  - Members can't edit or publish the hall, and can't list paintings.
  - A share key grants view-only access with no draft in the response. A wrong key gets 404.
  - Turning sharing off and on again rotates the token, and the old link stops working.
- Validation rejects:
  - non-arrays and missing placements
  - duplicate ids and bad id characters
  - a non-boolean `flip`
  - huge or negative x
  - unknown props, wrong zones and unowned props
  - painting or game placements in a personal room
  - more than 24 items, bodies over 128 KB, bad JSON, the wrong content type, and cross-origin requests

  Unknown fields are dropped before storing.
- Concurrency:
  - Creating your room twice at once returns the same room.
  - 20 parallel saves leave one intact arrangement.
  - Three parallel publishes all succeed.
- Draft saves are rate-limited (429 after about 120 a minute).
- Economy: you can't buy what you can't afford (402) or buy fish (400), and re-buying something you own doesn't charge again.
- Presence tickets for a private room: 403 for strangers and anonymous visitors, 200 with the share key.
- In the browser:
  - Undo spam stops cleanly at the start of history.
  - Browser Back out of edit mode leaves the next room walkable, with the bunny at full opacity and no leftover drawer or signs.
  - 15 edit/Done cycles left no leftover DOM (signs, puffs, toolbars) and no heap growth (170 MB → 169 MB).
  - Visitors with a share link get no Decorate button.

## Not covered by this pass
- **Real touch devices:** issue 8 is inferred, and drag feel on phones is unverified.
- **Frame rate:** Chrome capped the automated window at about 21 fps with no long tasks, so performance couldn't be measured.
- **Two visitors in one personal room:** this also needs the presence worker redeployed for `r-*` room names.
- **The owner's Arrange hall panel:** `HALL_OWNER_EMAIL` isn't set locally.
- **Signing in from `/museum/home`:** whether the page moves on to the room by itself afterwards.

## Test data left in the local database
- Members `room-test-c83a52@example.test` (room `r-i5nqmw7z`) and `room-test-b-41b0e3@example.test`
  (room `r-ixnq3303`, display name "Wanderingmarshmallowfoxglove Q", sharing on).
- The owner's own room `r-ws3wnwq0` was changed during the pass and then restored exactly: the
  mirror only, the same share token, and the same balance.
