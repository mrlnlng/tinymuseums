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
  - About 64 adjectives: Velvet, Gilded, Tiny, Sleepy, Pastel, Dappled, Lacquered, Mossy, Rosy,
    Quiet, Painted…
  - About 64 gallery nouns: Easel, Teacup, Brushstroke, Pigment, Plinth, Gouache, Sketchbook,
    Frame, Palette, Curator, Muse, Pastel…
  - 64 × 64 gives 4,096 names. Both lists are reviewed by hand, so no combination reads badly.
- `nameFromSeed(seed: number): string` is deterministic.
- The seed is a random uint32. It lives in a **device-only slot `presence`** (`sync: false`) as
  `{ seed, walkAlone }`. A member's seed is copied to the server at sign-up (§3.2), so their
  generated name follows them until they choose one.
- Anonymous visitors cannot change their name: the seed is fixed for the device. Only a member
  can choose a name or reroll (a die button, still picking from the list).
- Two visitors in a room with the same name get a "·2" suffix when rendered. The suffix is
  computed per client, so there is no global uniqueness.

### 3.2 Chosen names (members)

- Schema (idempotent, in `members.sql`):
  ```sql
  alter table members add column if not exists display_name text;
  alter table members add column if not exists name_seed bigint;
  ```
  When `display_name` is null, the member uses `nameFromSeed(name_seed)`.
- `PUT /api/me/name` takes `{ name }` or `{ seed }`. `domain/members.ts` adds `setDisplayName`.
- Validation lives in core and is shared by the client and the route (`presence/names.ts`,
  `validDisplayName`):
  - NFKC-normalise, trim, and collapse runs of spaces.
  - 2–20 characters from letters (any script), digits, spaces and `' - . _`.
  - No URLs, no `@`, no strings of digits that look like phone numbers.
  - A blocklist (an existing npm list such as `obscenity`, checked under "prior art") plus our
    own reserved words: curator, staff, admin, moderator, tiny museum, inspiratiq.
  - Names are not unique, which avoids squatting and the "is taken" UX.
- An owner can reset a name with `display_name = null`. A one-line SQL command in
  `docs/multiplayer.md` covers this for v1; v2 adds a "report this name" action into the
  existing `bug_reports`.
- UI: a "Your name in the museum" row in `AccountSheet.tsx`.
  - Members get a text field and the die.
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
   - Resolves the name: the chosen name, else `nameFromSeed(member.name_seed ?? seed)`.
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

A client can lie about its position, but not about who it is or its name. Signing (node:crypto)
and verifying (Web Crypto) share a test vector in core, so the two can't drift.

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
- `.env.example`: `NEXT_PUBLIC_PRESENCE_URL=ws://localhost:8787` and a dev `PRESENCE_SECRET`.
- A `PresenceTransport` interface in the client has a `websocket` implementation (dev and
  production alike) and a `memory` one for tests.
- If `NEXT_PUBLIC_PRESENCE_URL` is unset, presence is off. Current behaviour stays the default
  until the feature ships.

### Deploying

One-time, done by the owner (about 20 minutes; Claude cannot create accounts or sign in):
1. Create a free Cloudflare account. No domain or card is needed; the Worker gets
   `*.workers.dev`.
2. `npx wrangler login`.
3. Generate `PRESENCE_SECRET`. Set it with `wrangler secret put PRESENCE_SECRET --env <env>`
   and as an Amplify branch variable of the same name.
4. In Amplify, set `NEXT_PUBLIC_PRESENCE_URL=wss://tiny-museum-presence-<env>.<account>.workers.dev`.
   It is baked in at build time, like the other variables (`.agents/DEPLOYMENT.md` §4).
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
- **`RigPool`.** One shared offscreen `WebGLRenderer`.
  - Each kind's GLB is parsed once and cloned per avatar with `SkeletonUtils.clone`.
  - Each remote avatar is drawn into its own 2D `<canvas>` with `drawImage`, from the shared
    renderer.
  - Refactor `loadRig` so the renderer is injected. The local visitor keeps its current path.
- **Budget.**
  - Show at most **8** others (decided): the nearest by `|x − self.x|`.
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
  lib/transport.ts        PresenceTransport + websocket/memory
  lib/presence.ts         createPresence({ room, outfitSlot, traversal }): send loop, peer table, interpolation
  lib/ticket.ts           fetch + refresh the ticket before exp
  scene/remote-visitors.ts  RigPool-backed avatars + name tags; update(dt, camera, viewport)
  components/WalkAlone.tsx  toggle in ScreenChrome/AccountSheet
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
messages per visitor-minute with company, 15 alone, and 2–10 ms per message.

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
- To be measured in the spike: real handler time per message, and whether a busy room
  hibernates between messages.

Product note: at this traffic most visits will meet nobody. Two visitors overlap mostly in
the start-of-month burst. Nothing in the UI should point out that the museum is empty (no
"0 online").

## 9. Phases

Each phase ends green on `npm run typecheck` and `npm test` and is checked in the browser.

0. **Spike (decide before building).**
   - `apps/presence` skeleton under `wrangler dev`: hello and ticket check, stamping (confirm a
     forged name is replaced), and the full-room handoff. Measure handler time per message.
   - `RigPool` prototype: 8 remote otters and cats in costumes on a mid-range Android at
     60 fps. If it fails, fall back to baked sprite strips per look.
1. **Names.**
   - `presence/names.ts` with tests: determinism, validation, blocklist.
   - The `presence` device slot.
   - Schema columns, `PUT /api/me/name`, and the account sheet row.
   - Shippable alone.
2. **Protocol and the presence Worker.**
   - `protocol.ts` and the shared HMAC test vector, with tests.
   - The ticket route (`PRESENCE_SECRET`).
   - `apps/presence`: Room, `room-logic.ts` with node tests, `dev:presence` in `npm run dev`.
   - `createPresence` with a memory-transport test that two peers converge and a timeout
     removes a peer.
3. **Remote visitors on screen.**
   - `RigPool` and the `loadRig` refactor, plus `remote-visitors.ts` and name tags.
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
