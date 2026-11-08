# Pond rework

> Superseded by `docs/pond-room-design.md` (the pond is now its own room). Kept for history.

The Pond minigame moves from a walk-around canvas pond to one fixed, side-on
scene drawn from the 2026-11-07 art drop, with a bait tray underneath (the feel
of a cosy pet-sim fishing spot: character at the water's edge, rod out, a tray
of bait tiles with counts). The species list is replaced by the four drawn
catches, and bait is bought with stamps.

Source art (outside the repo): `~/Downloads/mocks/2026-11-07/`

| File | What it is | Notes |
| --- | --- | --- |
| `fishing_scene/Untitled_Artwork-122.png` | night garden with a pond, 2388×1668 | the whole background, opaque |
| `fishing_scene/Untitled_Artwork-123.png` | lily pad + lotus | **opaque white background**; art bbox 0.582–0.765 x, 0.692–0.850 y of the scene |
| `fishing_scene/Untitled_Artwork-124.png` | small water splash | **opaque white background**; art bbox 0.365–0.439 x, 0.737–0.850 y |
| `fish_caught/Untitled_Artwork-125.png` | pink fish with a yellow star | 881×640, transparent |
| `fish_caught/Untitled_Artwork-126.png` | red crab | 881×640, transparent |
| `fish_caught/Untitled_Artwork-127.png` | blue pufferfish | 881×640, transparent |
| `fish_caught/Untitled_Artwork-128.png` | blobfish in a top hat and bow tie | 881×640, transparent |

The water in 122 spans roughly 0.21–0.79 x and 0.71–0.875 y of the image.

## Decisions

- **Species are replaced.** New ids, odds and trophies. The five old trophies
  (`fish-minnow` … `fish-golden-koi`) stay in the catalog so members who own them
  keep them, but no cast can roll them any more.
- **Fixed scene, no walking.** `pondgame/lib/world.ts` and its test go away.
- **Bait costs stamps and is used up one per cast.** Worms are free and
  unlimited, so guests and members with no stamps can always fish. Guests only
  get worms; the other tiles say "Sign in to buy bait".
- Bait art does not exist yet. Tiles use a placeholder glyph until it is drawn.

## Species

| id | Name | Art | Base weight |
| --- | --- | --- | --- |
| `star-snapper` | Star snapper | 125 | 45 |
| `crab` | Crab | 126 | 30 |
| `puffer` | Pufferfish | 127 | 20 |
| `blobfish` | Sir Blobfish | 128 | 5 |

## Baits

| id | Name | Placeholder | Pack | Price (stamps) | Effect |
| --- | --- | --- | --- | --- | --- |
| `worm` | Worm | 🪱 | free, unlimited | 0 | base weights |
| `shrimp` | Shrimp | 🦐 | 5 | 5 | crab ×3 |
| `berry` | Sea berry | 🫐 | 5 | 5 | puffer ×3 |
| `cupcake` | Cupcake | 🧁 | 3 | 9 | blobfish ×4 |

The weights a bait uses are the base weights with its species multiplied. The
game daily stamp cap is 25, so a pack is a real choice but not a wall.

## Server

- `packages/core/src/economy/pond.ts` holds `POND_FISH`, `POND_BAIT` and
  `pondWeights(bait)`. The cast ticket body gains `b: <bait id>`, and
  `readPondTicket` rolls with that bait's weights.
- New table `wallet_bait (member_id, bait_id, count >= 0, pk(member_id, bait_id))`
  in `schema/economy.sql`.
- `buyBait(memberId, baitId)`: one pack, debits the balance, adds to the count;
  `insufficient` if the balance is too low; `unknown_bait` for worm or a bad id.
- `POST /api/pond/cast` takes `{ bait }`. Worm needs no stock. For any other
  bait it decrements the count in the same transaction and refuses with
  402 `no_bait` when the count is 0.
- `POST /api/wallet/bait` `{ bait }` buys a pack and returns the wallet.
- The wallet view (`GET /api/wallet` and buy/collect replies) carries
  `bait: Record<baitId, number>`.
- Catalog gains `prop:fish-<id>` for the four new species (`earnedBy: 'pond'`).

## Client

- `pondgame/lib/fishing.ts`: species list from the table above (with art
  names), cast/wait/bite/reel timings unchanged, `pickFish(bait, random)` uses
  the same weights as the server for the guest roll.
- `economy/store.ts`: `bait` in the wallet snapshot, `buyBait(id)`,
  `castLine(bait)`.
- `PondGame.tsx` scene, back to front: background 122 fitted to the stage width
  (aspect 2388:1668), the bunny standing on the left bank at the water's edge
  with a drawn rod and line, the line ending in a bobber on the water, the lily
  pad layer gently bobbing, the splash at the bobber when it lands and on a bite.
  When something is caught, a card pops over the scene with its drawing, its
  name and "New for your room: … trophy" when it is new.
- Under the scene: a brown "Select bait" bar, then one row of bait tiles with a
  count badge ("x5", worm shows "∞"). Tap a tile to choose it. A chosen bait with
  a count of 0 shows "Buy N for P stamps" instead of "Cast".
- Rooms: the cozy theme's fish trophies draw the species art on the wooden
  plaque for the new ids; old ids keep their drawn colours.

## Tasks

### Done
- [x] Explore the art drop, measure the overlays and the pond
- [x] Decide species, gameplay and bait model
- [x] Core: species, bait table, weights, ticket bait, `buyBait`/`useBait`, wallet `bait`, schema, tests
- [x] API: cast takes bait (reply is the ticket plus the full wallet), `/api/wallet/bait`
- [x] Assets: masters in `apps/web/public/assets/pond/`, white knocked out of the
      lily and splash (the lily with a steep alpha curve so the light pink lotus
      stays opaque), registered in `scripts/optimize-assets.ts`
- [x] Client: fishing.ts, store.ts, PondGame rewrite, bait tray, caught card, CSS
- [x] Rooms: species art on the new trophy plaques, `COZY_TROPHIES` gains new ids
- [x] Remove `pondgame/lib/world.ts` and its test
- [x] Browser check as a member: cast, bite, catch card with the trophy note,
      buy a shrimp pack (42 → 37 stamps, 0 → 5), cast with it (5 → 4)
- [x] The stage crops the top 24% of the sky so the bank and pond read larger

### To do
- [ ] Draw bait art (needs the artist); tiles use emoji placeholders until then
- [ ] Look at the guest view (worm only, other tiles locked) in the browser
- [ ] Look at a pond trophy hung in a personal room
- [ ] Optional: a fishing pose for the bunny; it currently uses the standing `bunny-right` sprite

### Notes
- `scripts/optimize-assets.ts` empties `public/immutable/` and rebuilds it, and
  it also adds every `atelier/*` master to the manifest. For this change only
  the `pond/*` entries were spliced into the manifest and the other new files
  were removed; deleted tracked files were restored from git.
