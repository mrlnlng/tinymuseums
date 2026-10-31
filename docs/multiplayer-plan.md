# Multiplayer ("other visitors") — plan v2 (Cloudflare)

## 0. Summary

Visitors in the same room see each other walking in the hall and the atelier. Each visitor
appears as their own character and outfit, with a small name tag. A member chooses their
display name. An anonymous visitor gets a cute, gallery-themed name generated from a seed,
such as "Velvet Easel" or "Gilded Teacup".

Presence is **ephemeral and cosmetic**. Nothing about where anyone walks is stored. Positions
are not authoritative, and there is no chat in v1. The hall keeps working, unchanged and
offline, if the realtime service is down.

## 1. Product contract changes (approved 2026-10-31)

Multiplayer changes three things that are currently written down:

- `.agents/PROJECT.md` §2, Accounts: "an optional private account that only keeps their
  things across devices". A display name makes part of a member public.
- `.agents/ACCOUNTS_PLAN.md` §1: "No profile, display name, avatar…". Amend it to allow one
  public field, `display_name`, with nothing else added.
- The account sheet's copy: "nothing about where you walk". The new line: "While you're here,
  other visitors see your character and name walking with them. Nothing is kept."

The "restraint over engagement" tiebreaker sets these limits:

- No chat, no follower counts, no "N people online" banners.
- A visitor can **walk alone**, which hides others and stops broadcasting. One toggle, kept in
  a device-only slot.
- A fixed set of four emotes ships in v1 (§5.1). Free text never.

## 2. What already exists that this builds on

| Piece | Where | Use |
| --- | --- | --- |
| Members, sessions | `packages/core/schema/members.sql`, `domain/members.ts`, `app/api/me/*` | Who is signed in; add `display_name` |
| `outfit` slot | `packages/core/src/slots/outfit.ts` | The look broadcast to others: `character`, `costume`, `bow` |
| Slots (device-only) | `slots/define.ts` with `sync: false` | Anonymous name seed, the walk-alone toggle |
| Traversal | `features/hall/scene/traversal.ts` | 1-D `x` and `walkVelocity` (what we send) |
| Character / rig | `scene/character.ts`, `scene/rig.ts` | Remote avatars. **Problem: one WebGL context per character** (§6) |
| Rooms | `/museum` (hall), `/museum/atelier` | Presence channel per room |
| Epochs | `domain/epoch.ts`, hall slice `epochId` | Hall `x` only means the same place within one epoch, so the channel includes the epoch |
| Hosting | Amplify SSR (Lambda) + Gen 2 CDK stack in `amplify/backend.ts` | **Cannot hold WebSockets**, so realtime runs on Cloudflare Durable Objects (§4) |

## 3. Names

### 3.1 Generated names (everyone has one)

- `packages/core/src/presence/names.ts` is browser-safe. It holds two curated word lists:
  - 64 adjectives: Velvet, Gilded, Tiny, Sleepy, Dappled, Lacquered, Mossy, Rosy, Quiet,
    Painted…
  - 64 gallery nouns and small creatures: Easel, Teacup, Brushstroke, Pigment, Plinth, Gouache, Sketchbook,
    Frame, Palette, Curator, Muse, Pastel…
  - 64 × 64 gives 4,096 names. Both lists are reviewed by hand, so no combination reads badly.
- `nameFromSeed(seed: number): string` is deterministic.
- The seed is a random integer in [0, 2^31). It lives in a **device-only slot `presence`**
  (`slots/presence.ts`, `sync: false`, never registered in `SLOTS`) as `{ seed, walkAlone }`.
  Seeds merge as "lowest wins", so two tabs settle on one and the name never changes after.
- A member with no seed takes the seed of the first device that asks for their name (§3.2), so
  their generated name follows them to other devices until they choose one.
- Anonymous visitors cannot change their name: the seed is fixed for the device. Only a member
  can choose a name or reroll ("Pick a name for me", still picking from the list).
- Two visitors in a room with the same name get a "·2" suffix when rendered. The suffix is
  computed per client, so there is no global uniqueness.

### 3.2 Chosen names (members)

- Schema (idempotent, in `members.sql`):
  ```sql
  alter table members add column if not exists display_name text;
  alter table members add column if not exists name_seed integer;
  ```
  When `display_name` is null, the member uses `nameFromSeed(name_seed)`.
- `PUT /api/me/name` takes one of `{ device }` (read the name, adopting that seed if the member
  has none), `{ name }` (choose) or `{ seed }` (reroll). `domain/members.ts` adds `memberName`,
  `chooseName` and `rerollName`. The export includes the display name.
- Validation lives in core and is shared by the client and the route (`presence/names.ts`,
  `checkDisplayName`):
  - NFKC-normalise, trim, and collapse runs of spaces.
  - 2–20 characters from letters (any script), digits, spaces and `' - . _`.
  - No URLs, no `@`, no strings of digits that look like phone numbers.
  - The `obscenity` blocklist (MIT; catches look-alikes like "sh1t" without flagging
    "Scunthorpe") plus our
    own reserved words: curator, staff, admin, moderator, tiny museum, inspiratiq.
  - Names are not unique, which avoids squatting and the "is taken" UX.
- An owner can reset a name with `display_name = null`. A one-line SQL command in
  `docs/multiplayer.md` covers this for v1; v2 adds a "report this name" action into the
  existing `bug_reports`.
- UI: a "Your name in the museum" row in `AccountSheet.tsx`.
  - Members get "Change name": a text field and "Pick a name for me".
  - Anonymous visitors see their generated name (read-only) and the passive
    `<KeepOnOtherDevices />` link ("Sign in to choose your own name"). It is not a nag.

## 4. Transport: Cloudflare Durable Objects

### Decision (2026-10-31)

A new workspace, `apps/presence`, deploys as a Cloudflare Worker. Each room instance is
one Durable Object, `Room`, holding the room's WebSockets with the **Hibernation API**.

Why Cloudflare:
- Outgoing messages are free, and incoming messages bill at 20:1. The bill does not grow with
  room size (§8.1): **$0 now, $0–5 a month at 10k visits**, against $12–53 on AppSync.
- The room is ordinary TypeScript: ticket check, name stamping, validation and rate limits
  live in one place.
- `wrangler dev` runs the same code locally, so there is no separate dev relay.

Alternatives considered:
- **AWS AppSync Events.** Stays in AWS, but bills per delivery (~$12–53 at 10k visits). It
  needs a Lambda authorizer plus an APPSYNC_JS handler, and cannot run locally.
- **A small Node `ws` relay on Lightsail.** $5 flat, but it is a server to patch and keep up.
- **Hosted pub/sub (Ably, Pusher, Supabase, Firebase).** About $15–29+ at 10k visits.
- **WebRTC peer-to-peer.** Needs TURN for many phone networks, and is unreliable on mobile.
- **Polling, or Postgres LISTEN/NOTIFY.** Choppy, or needs a long-lived process.

### Shape of `apps/presence` (about 200 lines)

```
apps/presence/
  wrangler.jsonc        name, DO binding ROOM, migrations: new_sqlite_classes ["Room"],
                        envs: gamma, production (separate workers, so they never share rooms)
  src/index.ts          fetch: Origin allowlist, upgrade check, route /room/<base> to a Room
  src/room.ts           Room DO: acceptWebSocket, webSocketMessage, webSocketClose
  src/room-logic.ts     pure: hello/ticket check, stamping, validation, rate limits (node --test)
```

- Protocol types and validation come from `@tiny/core/presence` (browser-safe, no `node:`
  imports), so web, room and tests share one definition.
- On the free plan a Durable Object class must be SQLite-backed. `Room` stores nothing; the
  migration entry is all that is needed.
- `serializeAttachment` keeps each socket's `{ pid, name, lastSeq, budget }` across
  hibernation, so a woken room still knows who is who.

### Identity cannot be forged

1. The client calls `POST /api/presence/ticket` (Next route, Amplify) with `{ room, seed }`.
   The route:
   - Reads the member session, if there is one.
   - Resolves the name: a member's via `memberName(id, seed)`, else `nameFromSeed(seed)`.
   - Issues an HMAC-SHA256 ticket, `{ pid, name, room, exp }`, valid for 10 minutes, signed
     with **`PRESENCE_SECRET`**. That is a new secret, not `SESSION_SECRET`, so Cloudflare
     never holds the session key. `pid` is a random id per tab; it is never the member id.
   - Rate-limited per IP.
2. The client opens `wss://<presence>/room/<base>` and sends the ticket as its **first
   message** (`hello`). It is not put in the URL, so it stays out of logs.
3. The Room verifies the HMAC with Web Crypto, checks `exp` and that the room matches, and
   closes the socket if no valid hello arrives within 5 s.
4. On every later message the Room **overwrites** `pid` and `name` from the socket's
   attachment, checks the shape, enforces the rate limits, and then broadcasts to the others.

A client can lie about its position, but not about who it is or its name. Signing and verifying
both use Web Crypto through the same code in `@tiny/core/presence/wire`, so the two can't drift.

### Rooms and capacity

- Room bases: `hall-e<epochId>` and `atelier`. Visitors on different epochs never meet, which
  is correct because their halls differ.
- Instances `-s0`, `-s1`, … hold **at most 8** visitors each, matching the visible cap.
  A full Room answers `{ t: 'full' }` and the client tries the next instance. No directory
  service is needed.
- On join, the Room sends the newcomer the last state of everyone present (kept in memory and
  in attachments), so they appear at once instead of after the next heartbeat.

### Local development and tests

- `npm run dev` gains `dev:presence` (`wrangler dev`, port 8787) beside web and worker. It
  needs no Cloudflare account.
- `.env.example`: `PRESENCE_URL=ws://localhost:8787` and a dev `PRESENCE_SECRET`. Both are
  server-only. The ticket route returns the room's address with the ticket, so nothing is baked
  into the browser bundle. In development, a page opened by LAN address gets the room on that
  same host, so phones work.
- If either is unset, the ticket route answers 404 and the client goes quiet for that page.
  Current behaviour stays the default until the feature ships.

### Deploying

One-time, done by the owner (about 20 minutes; Claude cannot create accounts or sign in):
1. Create a free Cloudflare account. No domain or card is needed; the Worker gets
   `*.workers.dev`.
2. `npx wrangler login`.
3. Generate `PRESENCE_SECRET`. Set it with `wrangler secret put PRESENCE_SECRET --env <env>`
   and as an Amplify branch variable of the same name.
4. In Amplify, set `PRESENCE_URL=wss://tiny-museum-presence-<env>.<account>.workers.dev`.
   `amplify.yml` already bakes it and `PRESENCE_SECRET` into `.env.production`, like the other
   variables (`.agents/DEPLOYMENT.md` §4).
5. Optional: connect the GitHub repo in **Workers Builds**, with root `apps/presence` and
   branch `gamma` deploying to the gamma env and `main` to production. Otherwise deploy with
   `npm run deploy --workspace @tiny/presence -- --env <env>`.

Ongoing:
- The presence code rarely changes; its deploys are separate from Amplify's.
- `wrangler tail` streams logs, and the dashboard shows requests and errors.
- Rotating `PRESENCE_SECRET` means updating both sides. Tickets fail until they match, and
  visitors then just walk alone.

## 5. Protocol (`packages/core/src/presence/protocol.ts`)

Browser-safe, versioned, and validated on both ends.

```ts
type PresenceEvent =
  | { t: 'state'; v: 1; pid: string; name: string; look: Look; x: number; vx: number; facing: 1 | -1; seq: number }
  | { t: 'emote'; v: 1; pid: string; e: Emote; seq: number }
  | { t: 'leave'; v: 1; pid: string }
```

Sending:
- Throttled to **5 Hz while moving**.
- A heartbeat every **4 s** while idle.
- `leave` on `pagehide`, on route change, and when walk-alone turns on.
- The look is sent in every state event: it is small, and late joiners need no snapshot request.

Receiving:
- Drop out-of-order `seq`.
- Forget a visitor after 12 s of silence.
- Interpolate `x` with a buffer of about 200 ms. Extrapolate with `vx` for at most 300 ms.
- Remote walk animation follows the interpolated velocity, so the rig's walk cycle matches.
- **Quiet when alone.** A client that has heard no peer sends only the 4 s heartbeat, even
  while walking. Hearing any peer switches it to 5 Hz. A newcomer publishes at once, so others
  wake within one message.

### 5.1 Emotes (v1)

- Four, fixed in core (`EMOTES` in `protocol.ts`): **wave**, **heart**, **sparkle**, **ooh**
  (admiring a piece).
- Shown as a small painted bubble above the head for about 2 s, plus a little hop of the rig
  (the same squash used for the portraits' hop). The sparkle reuses the atelier's
  `.atelier-sparkle` burst. The sender sees their own emote at once.
- UI: one emote button by the account and sound buttons in `ScreenChrome`. A tap opens four
  choices in a small fan. Keys 1–4 on a keyboard. The button is hidden while walking alone.
- Limit: one emote per 1.5 s on the client; the Room drops faster ones.
- Bubble art: four icons drawn in the museum style (cream bubble, maroon outline), cut like
  the other atelier art. Placeholder SVGs until then.
- Emotes can be sent while alone; nobody sees them, and that costs nothing extra.

## 6. Rendering other visitors (the main technical risk)

Today every `Character` creates its own `THREE.WebGLRenderer` (`rig.ts`, `loadRig`). Browsers
cap live WebGL contexts at about 8–16, fewer on phones, so N remote characters cannot each get
a context.

Plan:
- **One rig layer.** A single transparent WebGL canvas over the hall (`createRigLayer` in
  `rig.ts`). It is cleared once a frame, then each remote rig draws into its own rectangle
  (`loadRig(null, kind, layer)`, `render(..., { left, top })`). The whole crowd costs one context
  and no readback. The local visitor keeps its own context and path.
  - Rejected in the spike: one shared renderer copying each rig into its own 2D canvas with
    `drawImage`. On a real GPU every copy is a GPU→CPU readback ("GPU stall due to
    ReadPixels"): 7.7 ms a frame for 8 rigs, 45 fps with the CPU slowed 4×.
  - Each character type's model is parsed and uploaded once per layer, and cloned per
    visitor with `SkeletonUtils.clone` (`sharedTemplate` in `rig.ts`; `disposeRigLayer` frees
    them).
  - The layer sits behind the local visitor. Remote visitors are all on one layer, so they
    can't interleave individually with DOM exhibits.
- **Budget.**
  - Show at most **8** others (decided): the nearest by `|x − self.x|`.
  - Measured (`/dev/crowd`, 390 × 844 at 2×, RTX 4070, CPU slowed 4× as Chrome's mid-tier
    mobile preset): 8 rigs on the layer hold 60 fps with 1.7 ms of script a frame, and 16
    hold 60 fps with 4.0 ms. Separate contexts drop to 55 fps at 16. A real mid-range phone
    still needs checking: open `/dev/crowd` from the phone on the LAN.
  - Re-render a remote rig only while it is on screen or within half a screen of the edge.
  - Throttle off-screen avatars to 12 fps.
  - Fall back to the static idle sprite (`assets.bunnyIdle`) when the pool reaches its cap or
    WebGL fails.
- **Layering.**
  - Others draw behind the local visitor, at 0.9 opacity, so your own character always reads
    first.
  - Others do not collide; they walk through each other.
  - Exhibits and occlusion behave as for the local character.
- **Name tag.** A DOM pill above the head, positioned with the overlay's world-to-screen
  helper (`scene/overlay.ts`).
  - Hidden for others who are far away.
  - `aria-hidden`.
  - A single live region announces "3 other visitors here" at most once on arrival.
- **Not mirrored in v1:** sitting on the beanbag, carried helmet and cup, and the atelier
  dissolve. A remote visitor in those states just stands at their `x`. These are v2 events.
- `prefers-reduced-motion` turns interpolation into a fade-in at the new position for large
  jumps.

## 7. Client module layout

```
apps/web/src/features/presence/
  lib/presence.ts         createPresence({ room, seed, self, walkAlone, visible }): ticket, connect,
                          send policy, reconnects, room overflow; tick() once a frame
  lib/peers.ts            PeerTable: updates, 200 ms interpolation, 12 s timeout, emotes
  lib/useVisitorName.ts   the visitor's own name (phase 1)
  components/PresencePreview.tsx  /dev/presence: two windows meet without the scene
  lib/join-room.ts        joinRoom({ room, host, character, traversal }): the one call each scene makes
  lib/emote-events.ts     emote button ↔ scene events, and the placeholder bubble labels
  scene/remote-visitors.ts  rig-layer avatars, name tags, bubbles, hop, arrival announcement
  components/EmoteButton.tsx  the chrome button and its four choices; shown only while in a room
  components/WalkAlone.tsx  (phase 5) toggle in ScreenChrome/AccountSheet
```

Wiring:
- `useHallScene.ts` and `useAtelierScene.ts` each gain about 5 lines: create, `update` in
  `renderFrame`, and dispose in teardown.
- Like accounts, presence never blocks loading. It connects after `ready`.

## 8. Privacy, abuse, cost

- **Data kept:** none. The pid is per tab. Member id and email never leave the server. No
  presence data reaches `visits`/`events` (analytics stay anonymous).
- **Abuse:**
  - Names are validated on the server, and identity is stamped by the Room (§4).
  - Position spam is bounded by the Room's rate limits (about 6 states/s, 1 emote per 1.5 s;
    persistent offenders are disconnected) and by rooms of 8.
  - Only the site's own origins (Amplify domains, localhost in dev) may connect.
  - Walk alone is the escape hatch.
- **Cost guard:**
  - Disconnect after 5 min with no input and the tab hidden. Reconnect on focus.
  - Quiet when alone (§5).
  - The free plan fails closed: past its daily limits, presence errors and visitors walk
    alone. On the paid plan, set a Cloudflare usage notification.

### 8.1 Expected cost

Cloudflare Durable Objects ([pricing](https://developers.cloudflare.com/durable-objects/platform/pricing/)):
- **Requests:** a WebSocket connect is 1 request. Incoming messages bill at **20:1**. Outgoing
  messages and protocol pings are **free**.
- **Duration:** with the Hibernation API, billed only while a handler runs, at 128 MB per
  object.
- **Free plan:** 100,000 requests and 13,000 GB-s **per day**. Past either, calls error
  until 00:00 UTC.
- **Paid plan:** $5 a month minimum. It includes 1M requests and 400,000 GB-s a month, then
  $0.15 per million requests and $12.50 per million GB-s.

Traffic from the analytics (30 days: 145 visits, average 5 m 56 s). Assumed: about 100 incoming
messages per visitor-minute with company, 15 alone, and 2–10 ms per message. The spike measured
0.35 ms on average (2 ms at most) under `wrangler dev`, so duration is lower still (§9, phase 0).

| | Average month (145 visits) | Busy month (500) | 10k visits |
| --- | --- | --- | --- |
| Visitor-minutes | ~860 | ~2,970 | ~59,300 |
| Incoming messages | < 0.1M | ~0.1–0.3M | ~5.9M |
| Billed requests (÷ 20, plus connects) | ~5k | ~15k | ~320k |
| Duration | negligible | negligible | ~1.5–7k GB-s |
| **Cost** | **$0** (free) | **$0** (free) | **$0** (free, if no day passes 100k requests) / **$5** (paid) |

- At 10k visits, a day would need about 2M incoming messages to reach the free plan's limit.
  That is roughly 20,000 minutes of visitors walking together in one day. Move to paid ($5)
  when a start-of-month burst gets near it.
- Room size no longer drives cost, but rooms stay at 8 so phones download only what they draw.
- Still to measure once deployed: handler time on Cloudflare itself, and whether a busy room
  hibernates between messages.

Product note: at this traffic most visits will meet nobody. Two visitors overlap mostly in
the start-of-month burst. Nothing in the UI should point out that the museum is empty (no
"0 online").

## 9. Phases

Each phase ends green on `npm run typecheck` and `npm test` and is checked in the browser.

0. **Spike.** Done 2026-10-31.
   - `apps/presence` runs under `wrangler dev` (port 8787) and passed every check against
     real WebSockets:
     - a foreign Origin gets 403;
     - a forged `name`/`pid` and extra fields are replaced by the ticket's identity;
     - a newcomer is sent present peers;
     - forged, expired and wrong-room tickets are denied;
     - a socket with no hello is closed at 5.0 s;
     - leave reaches others;
     - the 9th visitor is told `full` and joins `-s1`;
     - a flood is cut to 10 messages and closed;
     - 7 visitors at 5 Hz for 20 s delivered 4,200/4,200 updates at p50 2.1 ms, p99 3.3 ms.

     Handler time averaged 0.35 ms.
   - Rendering: the rig layer (§6) holds 60 fps for 8 and 16 visitors. Copying into 2D
     canvases was rejected.
   - Not yet done: a real mid-range phone, and Cloudflare's own timings.
1. **Names.** Done 2026-10-31.
   - `presence/names.ts` with tests: determinism, validation, blocklist.
   - The `presence` device slot.
   - Schema columns, `PUT /api/me/name`, and the account sheet row.
   - Shippable alone.
2. **Protocol and the presence Worker.** Done 2026-10-31. Checked in two real browsers on
   `/dev/presence`, one by `localhost` and one by LAN address:
   - each saw the other's name;
   - a 1.5 s walk arrived at the same x (14.55);
   - a wave arrived;
   - a closed tab vanished from the other;
   - a member's chosen name ("Moss Painter") reached the other window.
   - `protocol.ts` and the shared HMAC test vector, with tests.
   - The ticket route (`PRESENCE_SECRET`).
   - `apps/presence`: Room, `room-logic.ts` with node tests, `dev:presence` in `npm run dev`.
   - `createPresence` with a memory-transport test that two peers converge and a timeout
     removes a peer.
3. **Remote visitors on screen.** Done 2026-10-31. Checked with two browsers in `/museum` and
   `/museum/atelier`:
   - each saw the other's name tag;
   - B walking right moved B across A's screen;
   - key 1 and the emote button's heart reached the other;
   - B's red cardigan showed on A's screen;
   - a closed tab removed B.

   Visitors who arrive at the same spot stand behind each other, so the one behind has no
   name tag until someone steps away.
   - Shared GLB templates per kind, `remote-visitors.ts` on the rig layer, and name tags.
   - Wired into the hall and atelier.
   - Emotes: the protocol event, the `ScreenChrome` button and fan, bubbles and hop.
   - Playwright e2e: two browser contexts on `/museum`. A sees B's name tag move when B walks,
     B's costume change in the atelier shows on A, and B's wave shows over B on A's screen.
4. **Production.**
   - Owner: the one-time Cloudflare setup (§4, Deploying).
   - Gamma and production envs in `wrangler.jsonc`, Amplify variables, optional Workers
     Builds.
   - Deploy to gamma, then a two-phone test.
5. **Polish.**
   - Walk-alone toggle, copy changes, `docs/multiplayer.md`.
   - Tune room capacity if 8 feels empty or crowded.
   - Sitting and carried items (v2).

## 10. Decisions

Decided 2026-10-31:
- Transport: **Cloudflare Durable Objects** (replaces AppSync, for cost and simplicity; §4, §8.1).
- Contract: **amend** PROJECT.md §2, ACCOUNTS_PLAN.md §1 and the account sheet copy as in §1, with the **walk alone** switch.

- Anonymous visitors **cannot** change their generated name; members choose or reroll.
- At most **8** other visitors shown. **Rooms of 8**, overflowing to the next instance.
- **Emotes in v1**: wave, heart, sparkle, ooh.

Sources:
- [Cloudflare Durable Objects pricing](https://developers.cloudflare.com/durable-objects/platform/pricing/)
- [Durable Objects WebSocket best practices](https://developers.cloudflare.com/durable-objects/best-practices/websockets/)
- [AWS AppSync pricing](https://aws.amazon.com/appsync/pricing/) (the option not chosen)
