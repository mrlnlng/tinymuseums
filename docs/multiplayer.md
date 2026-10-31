# Other visitors

Visitors in the same room see each other walk, in their own character and outfit, with a name
tag. They can send one of four emotes. Nothing about where anyone walks is stored. The design
and its decisions are in `docs/multiplayer-plan.md`; this page is how it works now.

## How it plays

- **Rooms.** The hall (one room per epoch, since each epoch's hall differs) and the atelier.
  A room holds 8 visitors; the 9th starts the next one (`-s1`, `-s2`, …).
- **Who you see.** The 8 nearest other visitors, behind your own character, each with a cream
  name tag. A visitor standing right behind you has no tag until one of you steps away, so a
  stranger's name never sits over your head.
- **Names.** Everyone has a generated name from a fixed device seed ("Silver Sparrow").
  Anonymous visitors can't change it. Members keep it on sign-up and can choose their own or
  pick another generated one in the account sheet. Chosen names are 2–20 characters, with no
  web addresses, phone numbers, reserved words (curator, staff, admin, tiny museum, …) or
  profanity (the `obscenity` list).
- **Emotes.** The heart button in the top bar shows while you share a room. It and keys 1–4
  send hi! / ♥ / ✦ / ooh!. Each pops a bubble over the sender for 2 s with a small hop (no hop
  under reduced motion). One every 1.5 s. The bubbles are text placeholders until painted art
  arrives.
- **Walk alone.** A switch in the account sheet, kept on this device. It leaves the room: you
  see nobody and nobody sees you, and the emote button hides.
- **Screen readers** hear "Another visitor is here" when someone arrives, at most every 30 s.
- **Not mirrored:** sitting on the beanbag, and the carried helmet and cup. Other visitors in
  those states just stand where they are.

## Privacy

A visitor's ticket carries only a random per-tab id and their name, never a member id or email.
The room keeps each visitor's last position in memory while they are connected, and nothing
after. No presence data reaches the visits analytics.

## Code

| File | What |
| --- | --- |
| `packages/core/src/presence/names.ts` | Word lists, `nameFromSeed`, `checkDisplayName`. |
| `packages/core/src/presence/protocol.ts`, `ticket.ts` | Messages both ways with their checks; signed tickets (Web Crypto). Exported without the names as `@tiny/core/presence/wire`. |
| `packages/core/src/slots/presence.ts` | Device-only slot: the name seed and walk alone. |
| `packages/core/src/domain/members.ts` | `memberName`, `chooseName`, `rerollName`; columns `display_name`, `name_seed`. |
| `apps/web/src/app/api/me/name` | A member reads, chooses or rerolls their name. |
| `apps/web/src/app/api/presence/ticket` | Signs a ticket and returns the room's address. |
| `apps/presence` | The Cloudflare Worker and its `Room` Durable Object (Hibernation API). Decisions are in `room-logic.ts`. |
| `features/presence/lib/presence.ts`, `peers.ts` | The client: connect, send, reconnect, overflow; other visitors 200 ms behind. |
| `features/presence/lib/join-room.ts` | The one call each scene makes once ready. |
| `features/presence/scene/remote-visitors.ts` | Drawing on one shared WebGL layer (`createRigLayer` in `rig.ts`), tags, bubbles. |
| `features/presence/components/` | `EmoteButton`, `WalkAlone`, and the `/dev/presence` page. |
| `apps/web/src/app/dev/crowd` | Development only: 8 or 16 rigs on the layer or in separate contexts, with fps. |

## Running it locally

`npm run dev` runs web, worker and the room (`wrangler dev` on port 8787); no Cloudflare
account is needed. `.env` needs `PRESENCE_URL=ws://localhost:8787` and `PRESENCE_SECRET`. A
phone on the LAN gets the room on the same host as the page. Open `/dev/presence` in two
windows to see two visitors meet without the scene.

## Running it in production

Deploying is in `docs/multiplayer-plan.md` §4. In short: Cloudflare account, `wrangler login`,
`wrangler secret put PRESENCE_SECRET`, then `PRESENCE_URL` and `PRESENCE_SECRET` as Amplify
branch variables.

- **Turn it off:** unset `PRESENCE_URL` in Amplify and redeploy. The ticket route answers 404
  and pages stay quiet.
- **Reset a name:** `update members set display_name = null where display_name = '<name>';` The
  member goes back to their generated name on their next ticket.
- **Cost:** about $0 at today's traffic and $0–5 a month at 10k visits (plan §8.1). On the free
  plan, a day past 100,000 requests turns presence off until midnight UTC.
