# Other visitors

Visitors in the same room see each other walk, in their own character and outfit, with a name
tag, and can say short things to each other in speech bubbles. Nothing they walk or say is stored. The design
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
- **Messages.** The large two-bubble button at the bottom right shows while you share a room;
  Enter opens it too. A message is one line of up to 100 characters.
  - It shows in a bubble over the sender, with a small hop, for 3–8 s depending on length,
    then it is gone. There is no log and nothing is stored.
  - The room allows one every 1.5 s per visitor and decides what goes out (`messages.ts`,
    the same check the browser makes first for an instant answer). Profanity (the `obscenity`
    list, look-alikes included), links, emails and phone numbers are refused, and only the
    sender is told why.
  - Screen readers hear "Name says: …".
- **Mute.** The message panel lists who's here, each with Mute. A muted visitor still walks
  about, but their messages don't show or get read out. It lasts until the page closes.
- **Walk alone.** A switch in the account sheet, kept on this device. It leaves the room: you
  see nobody and nobody sees you, and the message button hides.
- **Screen readers** hear "Another visitor is here" when someone arrives, at most every 30 s.
- **Sharing the hall.** The room decides who has the one beanbag and each pedestal's helmet,
  first claim wins:
  - Others see the sitter on the beanbag, and a worn helmet on its wearer with its pedestal
    bare.
  - While it's taken, tapping it does nothing and standing idle beside it doesn't sit you down.
  - If two visitors go for it at once, the one who lost steps back, or gets up, or the helmet
    flies home.
  - It comes free when its holder gets up, puts the helmet back, or leaves.
- **Cups aren't contested.** The café serves everyone, so cups aren't held by the room;
  others just see the cup in your paw.
- **Costumes and the coin stay per visitor.** The forms are a display rack, and the coin is
  a personal find.

## Staying consistent

- **Holds survive the room hibernating.** They are kept on each socket's attachment, so they
  go with their socket, and a claim is settled in one synchronous step against everyone
  else's.
- **A reconnecting tab replaces its old socket** (same ticket id), keeping its holds and
  without telling the others it left. After any reconnect, the client claims again what it
  was holding; if someone else took it meanwhile, it gives it up.
- **Ghosts are swept.** Every 10 s the room closes sockets silent for 15 s (a phone that lost
  signal without closing), and frees what they held.
- **Hidden tabs keep their heartbeat** on a timer while the page gets no animation frames,
  then leave after 60 s hidden.
- **A new name reaches the others at once.** Changing it, or signing in or out, takes a fresh
  ticket.
- **One visitor per device.** Of a browser's museum tabs, only the one in use is in the room
  (`tab-turn.ts`, over a `BroadcastChannel`). Showing or focusing a tab takes the turn. The tab
  in the room closing hands it to a tab still in view.
- **Room places go to visitors with a ticket.** Capacity is counted at admission, after the
  ticket is verified and before anything else awaits, so two at once can't both take the last
  place. One address may hold at most 4 sockets that haven't shown a ticket.
- **Walking off after standing still eases off** from where the visitor stood, rather than
  lurching from a point seconds back.

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
