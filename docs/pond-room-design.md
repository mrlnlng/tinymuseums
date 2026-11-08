# The Moonlit Pond — design

Supersedes the "fixed scene in a modal" pass in `docs/pond-rework.md` (its server
work — species, tickets, bait stock — is kept and built on).

The pond stops being a small minigame card. You walk out of the museum into a
room of its own, a moonlit garden pond, where other visitors fish beside you, a
leaderboard stands on the bank, and the fishing itself fills the screen. Every
cast is a small gamble with a skill test in the middle, and a rare catch is an
event the whole room sees.

## What the research says (and what we take from it)

| Finding | Source | What we do with it |
| --- | --- | --- |
| The loop that holds people is predictable cast → suspenseful wait → reactive bite → skill-tested reel → variable reward | [picoo](https://picoo.io/how-to-make/roblox-fishing-system), [Aversa's taxonomy](https://www.davideaversa.it/blog/game-design-taxonomy-fishing-mini-games/) | Every stage of a cast gets its own beat: a charged cast, shadows and nibbles, a timed hook, a tension reel, a tiered reveal |
| Rarer fish should pull harder, so rarity is also difficulty | [Fish On wiki](https://wiki.fishonmc.net/doku.php?id=fishing), [itch devlog](https://itch.io/devlog/1472486/fishing-engine-overhaul.amp) | Per-species tension profiles; the legendary fights |
| Tension minigames fatigue players if every catch is a fight | [Aversa](https://www.davideaversa.it/blog/game-design-taxonomy-fishing-mini-games/), [Steam thread](https://steamcommunity.com/app/427410/discussions/5/4697909208477157530/) | Commons land in 2–3 s; only rare and up fight for real |
| Variable-ratio rewards produce the steadiest engagement | [serious-games study](https://journal.seriousgamessociety.org/index.php/IJSG/article/view/47), [overview](https://www.explorepsychology.com/variable-ratio-schedule/) | Four independent rolls per catch: species, size, variant, treasure |
| Mutations/shiny variants multiply a small roster into a long chase and give bragging rights | [Fisch wiki: Mutations](https://fisch.fandom.com/wiki/Mutations), [Shiny](https://fisch.fandom.com/wiki/Shiny) | Variants drawn as treatments over the existing art: 4 species × 5 variants = 20 collectibles with no new art |
| A shadow before the bite builds anticipation; size and rarity are separate axes | [Nookipedia shadows](https://nookipedia.com/wiki/List_of_fish_by_shadow_size) | The cast reply carries only a shadow size; the species shows at the end |
| Treasure mid-reel is a risk you choose: chase it and you may lose the fish | [Stardew wiki: treasure](https://stardewvalleywiki.com/Fishing_Treasure_Chest) | Treasure bubbles during the reel |
| Reveal fanfare should scale with rarity; the tell should come late, not early | [game juice guide](https://gamejuice.pages.dev/articles/reward-progression-juice-levelups-loot), [card reveal UX](https://medium.com/n3twork/choreographed-emotion-6-steps-to-a-great-card-reveal-ux-a6e6bb8487dd), [Kotaku on Duelyst](https://kotaku.com/1793450096) | Five reveal tiers; the rarity glow starts only in the last stretch of the reel; commons stay quick; reveals stay skippable |
| Push-your-luck works when risk and reward rise together and a bust isn't total | [BGDF thread](https://www.bgdf.com/forum/game-creation/design-theory/balancing-push-your-luck-games), [push-your-luck primer](https://boardgamedesigncourse.com/game-mechanics-sometimes-you-want-to-push-your-luck/) | Live-bait chains, hot streaks and wagers, each with a soft floor |
| Independent rolls are memoryless; pity timers rescue the unluckiest players | [OSRS bad luck mitigation](https://oldschool.runescape.wiki/w/Bad_luck_mitigation), [loot calculator](https://ziva.sh/tools/loot-table-calculator) | Soft and hard pity on the legendary, persisted server side |
| Weekly boards plus an all-time view beat one global board; show "around me" | [Yu-kai Chou](https://yukaichou.com/gamification-analysis/leaderboard-design-definitive-guide-octalysis/), [Kyda](https://www.kydagames.com/blog/designing-competitive-leaderboards-repeat-visits.html) | Weekly reset Monday 00:00 UTC, all-time tab, your rank always shown |
| A leaderboard is only as honest as the server check behind it | [Crux](https://crux.supercraft.host/blog/leaderboard-cheating-public-leaderboard-server-validation-2026/), [Unity thread](https://discussions.unity.com/t/preventing-fake-score-submissions/1528096) | The server rolls every outcome that ranks; the client only reports bounded skill |
| Odds disclosure and spend limits are the baseline for chance mechanics | [Ukie principles](https://techraptor.net/gaming/news/new-uk-loot-box-guidelines) | A public odds page; daily wager cap; the pond currency can never be bought |

## The room

- **Getting there.** A "To the pond" door in the hall (and the computer
  desktop's Pond entry) runs the usual passage fade to `/museum/pond`. It is a
  real room on the shared stage, so your character, outfit and presence come
  with you, and the back button works.
- **Layout.** A side-on strip built from the night-garden art: the flowers and
  sky as the backdrop, a grassy bank you walk along, the pond in front. Three
  **fishing spots** on the bank (a little dock, a rock, the lily-pad side) are
  claimed through presence's existing `claim`, so first come first served and
  you see who is fishing where.
- **Furniture.** A wooden **leaderboard** board, a **bounty board** with
  today's goals, and the **fishmonger's stall** (shop: bait, charms; the odds
  page). Each opens an overlay in the museum's style.
- **Fishing view.** Step onto a spot and tap Fish: the camera eases in and the
  fishing view fills the screen (HTML over the stage, not a card). Leaving
  returns you to the bank.
- **Big-catch ticker.** A thin banner across the room and the fishing view:
  "Jazlyn landed a Golden Sir Blobfish (48 cm)!", fed by the server's catch
  log, so it can't be faked.

## One cast, beat by beat

1. **Charge the cast.** Hold to charge, release. A meter sweeps; releasing in
   the sweet spot is a **Perfect cast**: the bobber lands in deep water, where
   fish run bigger (size ×1.1). Overcharging plops it short. Skill changes size,
   never rarity, so wager odds can be priced before the cast.
2. **The wait.** Fish shadows drift under the surface. The cast reply tells the
   client the shadow size of the fish that will bite (tiny / small / big /
   huge-with-fin), never the species. 0–3 **nibbles** (twitches) come before
   the bite; hooking on a nibble scares the fish off.
3. **The bite.** The bobber plunges, splash, thunk, phone buzz
   (`navigator.vibrate`). Hook within the window; the first 250 ms is a
   **Perfect hook** (the reel starts with more line in hand).
4. **The reel.** Hold to reel (line comes in, tension rises), release to give
   slack (tension falls, the fish takes line). The fish makes **runs**:
   tension spikes you must ease off for. Max tension snaps the line; running
   out of line loses the fish. Commons have no runs and land in 2–3 s; a
   legendary makes 4–6 erratic runs over ~10 s.
   **Treasure bubbles** sometimes rise during a reel: keep the tension inside
   a narrow gold band for 1.5 s to grab it, and you get a chest — but only if
   you still land the fish.
5. **The reveal**, scaled by rarity (below).

## What a catch is made of (four independent rolls, all server side)

**Species (tier)** — base weights with a worm:

| Species | Tier | Weight | Base pearls | Fight |
| --- | --- | --- | --- | --- |
| Star snapper | Common | 55 | 2 | none |
| Crab | Uncommon | 28 | 4 | 1–2 sideways runs |
| Pufferfish | Rare | 14 | 8 | 2–3 runs, puffs (tension jumps) |
| Sir Blobfish | Legendary | 3 | 40 | 4–6 erratic runs |

Legendary pity: from the 60th cast without one its weight climbs each cast; the
120th is guaranteed. The counter lives in the database.

**Size** — log-normal per species, in cm. The top 1% is **Trophy size** (a
crown). Value scales with (size ÷ median)².

**Variant** — drawn as treatments on the same art:

| Variant | Odds | Look | Value |
| --- | --- | --- | --- |
| Normal | — | as drawn | ×1 |
| Shiny | 1 in 40 | sparkles, slight hue shift | ×2 |
| Golden | 1 in 200 | gold sheen | ×5 |
| Moonlit | 1 in 600 (1 in 150 on full-moon days) | pale glow, translucent edges | ×10 |
| Prismatic | 1 in 2,500 | slowly cycling rainbow | ×25 |

A Prismatic Sir Blobfish is roughly 1 in 80,000 casts: the brag item.

**Treasure** — a chest from a grabbed bubble: pearls (most), bait, or a rare
**Lucky charm** (next 5 casts: variant odds ×3).

## The reveal ladder

| Tier | Sequence |
| --- | --- |
| Common | Fish pops out, small plink, card slides in, ~1 s |
| Uncommon | Plus a green glint and a two-note chime |
| Rare | Blue flash, bobber shake, rising three-note chime, card holds longer |
| Legendary | The water glows in the last 20% of the reel (the late tell), slow-motion leap, screen dims, gold beam, card flips, LEGENDARY stamp, fanfare, confetti, long buzz, room ticker |
| Variant | Layers on top: sparkles, gold shimmer, moon glow, rainbow sweep |
| Extras | "NEW!" for a first catch, "Personal best!" stamp, "Trophy size" crown |

An honest near-miss is part of it: a huge shadow can still be a big snapper
("Just a chunky snapper!"). We never fake one.

## Risk and reward

All stakes are in **pearls**, the pond's own currency (like Stardew's Qi coins):
earned only by fishing, never bought with money.

1. **Hot streak.** Each fish landed in a row raises a multiplier on pearls:
   ×1, ×1.25, ×1.5, ×2, ×3 (cap). One lost fish resets it. Chasing treasure on
   a ×3 streak is a real decision.
2. **Live-bait chain** (push your luck). After landing a common or uncommon you
   can **bank it** or **use it as live bait**: big fish eat little fish. The
   next cast's rare-and-up weights double, then triple on a second link. Land
   it and the chain pays out everything; lose it and the bait fish are gone
   (you keep pearls already banked, so the bust is never total).
3. **Call your shot** (wager). Before casting, stake pearls on a tier. The
   payout is shown before you commit (fair odds less a 10% fishmonger cut, the
   game's pearl sink). Cap: 200 pearls staked per day.
4. **Treasure** (above): risk the fish for the chest.

**Pearls in, pearls out.** In: catches (base × size × variant × streak),
treasure, bounties. Out: bait, charms, wagers, cosmetic rods and bobbers later.
**Exchange:** 10 pearls → 1 stamp, up to 20 stamps a day, so the pond can feed
the museum shop without breaking its economy.

## Leaderboards

- Boards: **Biggest catch** (one fish's score), **Pearl haul** (pearls earned
  from catches this week, not from wagers), **Rarest catch** (lowest odds).
- **Weekly**, resetting Monday 00:00 UTC, plus an **All-time** tab. Top 10, and
  your own rank and the two above you always shown.
- Weekly top 3 get a champion plaque prop for their room and a crown by their
  name in the pond that week.
- Members only (guests can fish and look). Names are presence display names.

**Honesty.** The server already rolls the species from a signed ticket. It also
rolls size, variant, treasure and live-bait outcomes from the same secret, and
records every catch in `pond_catches`. The client reports only bounded skill
(perfect cast/hook: capped bonuses) and whether it landed the fish. A cheater
can land every fish but can't pick what bites, and casts are already rate
limited with a minimum cast-to-reel time.

## Collection and goals

- **Fishdex**: species × variant grid with silhouettes for undiscovered ones,
  counts and best size; completing a row grants a plaque.
- **Bounty board**: three daily goals ("Land a crab over 30 cm", "Hit a ×2
  streak", "Catch anything Shiny") for pearls.
- **Trophies**: the first of each species and variant goes to your room.

## Guardrails

Pearls can't be bought. Odds are on a public page at the fishmonger. Pity
guarantees the legendary. Wagers are capped per day. No fake near-misses, no
"one more" nags. Reveals are skippable. Reduced motion turns the juice into
gentle fades; the reel has an easier mode (wider safe band).

## Art the pond needs from the artist

1. More species — 8 to 12 is a proper collection (variants carry it until then)
2. The bunny holding a rod (and ideally a reeling pose)
3. A "To the pond" door or sign for the hall
4. The leaderboard board, bounty board and fishmonger's stall
5. Bait icons, a treasure chest, a lucky charm, a pearl icon
6. A wider version of the garden backdrop for a walkable strip (the current one is 2388×1668)

## Build phases

1. **Room**: `pond` RoomDef on the stage, route and door links, bank floor,
   three claimable spots, full-screen fishing view, placeholder furniture.
2. **Loop**: charged cast, shadows and nibbles, hook window, tension reel,
   treasure bubbles, tiered reveal, variant treatments, sizes.
3. **Server**: `pond_catches`, pity counter, size/variant/treasure rolls in the
   ticket, pearls ledger and exchange, catch reply with everything.
4. **Social**: leaderboard API and board, big-catch feed and ticker, Fishdex.
5. **Risk**: hot streak, live-bait chain, wagers, bounties, moon phase.

Each phase ships and is checked in the browser before the next.

## Build contract (decided 2026-11-07)

Decisions from the owner: pearls are a separate pond currency (bait moves from
stamps to pearls); all four risk mechanics; code-drawn variants; all five phases.

### Numbers

Species (worm weights; sizes are log-normal, sigma 0.18, clamped):

| id | tier | weight | pearls | median cm | min–max cm | fight |
| --- | --- | --- | --- | --- | --- | --- |
| star-snapper | common | 55 | 2 | 22 | 14–40 | 0 |
| crab | uncommon | 28 | 4 | 18 | 10–34 | 1 |
| puffer | rare | 14 | 8 | 26 | 15–45 | 2 |
| blobfish | legendary | 3 | 40 | 35 | 22–60 | 3 |

Variants: normal; shiny 1/40 ×2; golden 1/200 ×5; moonlit 1/600 ×10 (1/150 on
full-moon days, ±1 day of full by a synodic-month approximation); prismatic
1/2500 ×25. A lucky charm triples every variant chance for its remaining casts.

Catch pearls = round(base × (size ÷ median)² × variant × streak), at least 1.
Trophy size = top 1% (z > 2.326). Perfect cast: size ×1.1 before clamping.

Bait (pearls): shrimp 5 for 20 (crab ×3), berry 5 for 20 (puffer ×3), cupcake
3 for 40 (blobfish ×4). Worm free.

Pity: casts since the last legendary; from 60 the legendary weight gains +3 per
cast; at 120 it is certain. Live-bait chain: link 1 doubles rare and legendary
weights, link 2 triples them; max 2 links; only a common or uncommon from the
last landed catch can become bait.

Hot streak multipliers by landed-in-a-row count: 1→×1, 2→×1.25, 3→×1.5,
4→×2, 5+→×3. A lost fish (snap, escape, early hook) resets it to 0.

Wager: stake 5–100 on a tier; payout multiplier = floor(0.9 ÷ p × 10) ÷ 10,
where p is that tier's probability with every boost of that cast (bait, chain,
pity). The stake is taken at cast; a landed fish of that tier pays
stake × multiplier. At most 200 pearls staked per member per UTC day.

Treasure: 1 cast in 5 carries a bubble. Contents: 80% 10–40 pearls, 15% a
bait pack (shrimp or berry), 5% a lucky charm (5 casts). Paid only if the fish
is landed and the client reports the bubble grabbed.

Live-bait chain pot: using a catch as bait moves that catch's pearls into the
chain pot. Landing the next fish pays pot × 1.5 (link 1) or × 2 (link 2) on top
of the new catch; losing it empties the pot.

Exchange: 10 pearls → 1 stamp, at most 20 stamps per member per local day,
through the existing claim system as a new source.

Every roll comes from HMAC(secret, `pond-<roll>:<nonce>`), so the client can
neither choose nor predict outcomes.

### Server API (members; guests get 401 and fish locally without pearls)

- `GET /api/pond/state` → `{ pearls, bait, streak, chain: { level, pot }, lucky, pity, wageredToday, moon: 'full'|'other', odds: { tiers: {common,uncommon,rare,legendary}, payouts: {...} } }`
  `?bait=<id>&chain=1` recomputes `odds` for that setup.
- `POST /api/pond/cast` `{ bait, wager?: { tier, stake }, chain?: boolean }` →
  `{ ticket, shadow: 'tiny'|'small'|'big'|'huge', nibbles: 0–3, fight: 0–3, treasure: boolean, wager: { tier, stake, multiplier } | null, state }`.
  402 `no_bait`, 402 `insufficient`, 400 `wager_cap`, 400 `no_chain`.
- `POST /api/pond/reel` `{ ticket, landed, perfectCast, perfectHook, treasureGrabbed }` →
  landed: `{ catch: { id, species, tier, variant, sizeCm, trophy, pearls, breakdown: { base, size, variant, streak }, isNewSpecies, isNewVariant, personalBest }, treasure: {...} | null, wagerWon: number | null, chainPaid: number | null, trophyCollected: boolean, state }`;
  lost: `{ lost: true, state }`. Once per ticket; same timing window as today.
- `POST /api/pond/bait-chain` `{ catchId }` → `{ state }` (400 `not_chainable`).
- `POST /api/pond/bait` `{ bait }` → `{ state }` (402 `insufficient`).
- `POST /api/pond/exchange` `{ pearls }` (multiple of 10) → `{ state, balance, granted, capped }`.
- `GET /api/pond/leaderboard?board=biggest|haul|rarest&period=week|all` → `{ rows: [{ rank, name, value, species, variant, sizeCm }], me: {...} | null, week }`. Weekly = ISO week, UTC.
- `GET /api/pond/feed` → last 20 catches that are rare, legendary or non-normal variant: `{ name, species, variant, sizeCm, at }`.
- `GET /api/pond/dex` → `{ entries: { [species]: { [variant]: { count, bestCm } } } }`.
- `GET /api/pond/bounties` → three daily goals (deterministic from the UTC date) with progress; `POST /api/pond/bounties/claim` `{ id }`.

Names on boards and the feed are members' display names (`members.display_name`, or the generated name).

### Tables

- `pond_state (member_id pk, pearls ≥ 0, streak, pity, lucky, chain_level, chain_pot, chain_catch, wagered_day, wagered_today)`
- `pond_catches (id uuid pk, member_id, species, tier, variant, size_cm, pearls, odds, week, at, chained bool)` with indexes for the boards
- `pond_bounty_claims (member_id, day, bounty_id, pk all three)`
- `wallet_bait` stays; buying it now spends pearls.

## Status (2026-11-07)

### Done
- [x] Phase 1 — `pond` room on the stage (`features/rooms/pond/`, `features/pondroom/`, `/museum/pond`):
      8-unit-tall scene framed so the whole pond shows, mirrored side bands for width, museum door,
      three spots claimed through presence (`pond-spot-1..3`; core protocol accepts `pond`)
- [x] Phase 2 — full-screen fishing view (`features/pondgame/`): charged cast, shadows + nibbles,
      hook window, tension reel with runs, treasure bubbles, tiered reveal, variant auras, sizes
- [x] Phase 3 — server (`domain/pond.ts`, `domain/pond-boards.ts`, `schema/pond.sql`, `/api/pond/*`):
      pearls, catches, pity, every roll from the ticket nonce, shadows that hint at the tier
- [x] Phase 4 — leaderboard, fishmonger (bait, exchange, odds), bounty board, Fishdex, ticker, pearl purse
- [x] Phase 5 — hot streak, live-bait chain, call your shot, treasure feedback
- [x] Checks: 377 unit tests, 57 DB tests, typecheck; member cast → reel → pearls → streak →
      leaderboard verified against the running server; every screen looked at in screenshots

### To do
- [ ] Art from the artist (list above): more species, a bunny with a rod, the hall door, board/stall art,
      bait/chest/pearl icons, and a wider backdrop to replace the mirrored side bands
- [ ] A "To the pond" door in the hall; today the computer desktop's Pond tile takes you there
- [ ] Play it in a foreground browser window (a background Chrome window runs the stage at 1 fps)
- [ ] Remove the dev-seeded members and catches from the local database before demoing, if unwanted
- [ ] Tune the economy after real play: pearls per hour, bait prices, wager cap, exchange cap
- [ ] The live-bait win burst has not been seen on screen yet (the server pays it; the loss path was checked)

## Visual polish pass (2026-11-07, done by hand)

Owner feedback: concepts and mechanics are good; the look needed work (buttons out of place,
door didn't match, blurry background, pole + "Fish" label disliked, rod looked wrong, splash unused).

### Done
- [x] Sharpness: the scene master is the full 2388×1668 original; room and fishing view load the 3x
      variant (they were loading the 866 px 2x one). Lily and splash ship at source size.
- [x] Splash: recut with an opaque interior (colour-to-alpha had left it ~25% opaque), shown on the
      landing, each nibble and the bite, base on the waterline, above the line; timers fixed so they clear
- [x] Rod: tapered bamboo with node bands, cork grip and reel, anchored in the sprite's measured
      raised paw (350, 238), drawn under the bunny so the paw holds it; winds back while charging,
      whips forward on release, bends toward the fish under tension
- [x] Line and bobber come from one position each frame (flight arc, bob, nibble, plunge, runs),
      so the line always ends on the bobber; the line sags with slack
- [x] Fish shadows clipped to the traced shoreline
- [x] Fishing UI: museum crimson icons (`pondroom/lib/icons.tsx`), cream plates, a bait panel in the
      reference's style (wood bar, white tiles, leaf-green borders, count badges), a crimson action
      button with the charge meter and gold zone inside it, a cream reel gauge, short hints
- [x] Fishing view sits inside the museum frame like the room; no floating title
- [x] Room: no museum door, no mirrored bands, no CSS boards or posts. The painting's ends fade into
      a blurred night garden; ripples on the water mark the spots; one speech bubble over the bunny
      offers "Fish here" or "Back to the museum" (tap, Enter or E); a crimson icon row opens the
      Leaderboard, Bounties (dot when a reward is ready), Fishmonger and Fishdex; pearl pill beside
      the museum's icons; catches arrive as one-at-a-time toasts
- [x] Checked in screenshots at 1280×800@2 and 390×844@3, guest and member

### Still wanted from the artist
- [ ] Bait icons (emoji stand in), a bunny holding a rod, a wider backdrop for the room's ends
