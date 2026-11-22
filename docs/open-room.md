# Open rooms and the tip jar (design, 2026-11-21)

Passive income for personal rooms. Decided with the owner; nothing built yet. Story context is in
`docs/storyline.md` (the previous owner failed because nobody ever came in).

## Decisions

- **Open sign.** A sign on your door, tapped to flip between Open and Closed (in the scene, no menu
  toggle). Open means NPCs and players can come in. Closed means nobody comes and nothing is earned.
  The sign stays as you left it when you go offline.
- **NPCs visit while you're away.** The server works visits out from how long the room has been
  open. Nothing is simulated or reported by the client.
- **Tip jar.** Every visitor drops stamps into a jar in your room. You tap the jar to collect them.
  A full jar stops earning.
- **Player card, no asking.** Tap another player and a card shows a window onto their room, its
  coziness hearts and a door button: lit if their sign says Open, grey and untappable if Closed.
  Tap the lit door and you're in. The sign is the permission; the owner doesn't approve each visit.
- **The owner doesn't need to be there.** Not in the room, not online. You can visit an Open room
  any time, alongside whatever NPCs are visiting.
- **Arrival.** You step out of their door with a short circle-wipe and a plaque naming the room.

## Built (2026-11-21)

The sign, the card and the arrival are in; the tip jar and NPC income are not yet.

- `rooms.visibility` is `'private' | 'open'`; `share_token` and `POST /sharing` are gone, and
  link-shared rooms went back to private. `POST /api/rooms/[slug]/open {open}` turns the sign.
- The sign art is `public/assets/home/door-sign-{open,closed}.png`, drawn in the name board's flat
  style; the word is DOM text in the title font, and the board spins on its nail when turned.
- Presence tickets carry the member's room slug as `home`, and the room server relays it on each
  peer. **Deploy the presence worker before the site**: an older worker refuses tickets with `home`.
- `presence/scene/player-card.ts` asks `GET /api/rooms/[slug]` each time the card opens: 200 with
  `open: true` lights the door, anything else greys it.
- **The private share link is replaced by the Open sign.** `POST /api/rooms/[slug]/sharing`, the
  `visibility: 'link'` rooms and share tokens go away.
  Rooms shared by link today are removed, not migrated (they aren't real players' rooms).
- **Tipping is optional for real visitors.** A guest can tap the jar to tip; nobody has to.
- **The guestboard stays** where it is in the shared game area.

## Numbers (first pass, to tune)

Visitors come at a rate set by the room's coziness level (`cozyLevel` in
`apps/web/src/features/rooms/decorate/logic.ts`):

| Level | Score | Visitors per hour |
| --- | --- | --- |
| Bare | 0 | 0 |
| Settling in | 3 | 1 |
| Snug | 8 | 2 |
| Cozy | 15 | 3 |
| Dreamy | 24 | 4 |
| Legendary | 36 | 5 |

Each NPC visitor tips 1 stamp. Jar size grows with the room:

| Room | Jar holds |
| --- | --- |
| Closet | 6 |
| Storeroom | 12 |
| Back room | 20 |
| Studio | 30 |

A player visiting in person may tip from their own stamps by tapping the jar. That moves stamps
from guest to owner, so it creates nothing and needs no farming cap. Today's capped sources pay about 60 stamps a day, so a Studio
emptied once a day adds up to half again.

## How it works

- Store on the room: `open` and `opened_at`, plus the jar's contents and when they were last settled.
- **Settling:** whenever the jar is read (the owner enters the room, collects, flips the sign or
  changes coziness), add `rate × hours open since last settle`, capped at the jar size, then reset
  the clock. Settle before any coziness change, so the new rate only counts from then on.
- Coziness must be computed on the server from the saved room, so `cozyWorth` and `cozyLevel`
  move into `packages/core` and the web app imports them from there.
- **While the owner is in the room,** the NPC wander layer brings visitors in at the same rate.
  They look at placed things, and a tip clinks into the jar. These are just for show; the server's
  count is the truth.
- **Visiting** checks the room is Open on the server when the guest enters (the room GET), so a
  Closed room can't be reached by URL. Guests in the same room see each other over presence as usual.
- **Closing while guests are inside:** open question below.

## Story hooks

- Letter 6 triggers on the first flip to Open (it used to be "room published or shared").
- Letter 7 triggers on the first visitor: an NPC or a player.
- A Bare room gets no visitors, the way the previous owner's room never did.

## Open questions

- [x] What tapping a player shows: the player card (mocks: https://claude.ai/artifact/SV2cCfkMBA8EaY9nWKkJ4J, frames 1–3).
- [ ] How to reach an Open room whose owner is offline, since there's no one to tap. Candidates: a
  board of open rooms in the Hall, or names on the guestboard opening the same card.
- [ ] What happens to guests when the owner flips the sign to Closed: sent out, or allowed to finish.
- [ ] How much a guest tip is (fixed 1, or a choice), and whether it can overflow a full jar.
