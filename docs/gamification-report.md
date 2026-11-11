# Gamifying Tiny Museum — genre direction & engagement research

A deep dive into what the game is today, the genre it should grow toward, and what the
research says about keeping visitors coming back. Written for the owner as a decision
document, not a menu.

---

## 0. What the game is today (the deep dive)

### 0.1 The core experience

Tiny Museum is a **mobile-first, hand-painted virtual gallery hall**. A visitor walks the
hall as the bunny (or the cat, or the otter), stops at artists' displays, and looks at one
work at a time. The hall is one continuous side-scrolling world (WebGL — Three.js in the
code today, with a Phaser 4 migration documented in `.agents/PHASER_PLAN.md` — plus DOM
overlays), beginning in a visitor centre with a door, help booth, café, gift-shop link and
guest board.

What exists that games are made of:

| Piece | What it is | Game-mechanics value |
| --- | --- | --- |
| The walk | Input drives the camera; the bunny walks after it, with walk cycle, momentum, hysteresis, leash | The primary verb — already feels like a character, not a cursor |
| Costume Atelier | A second room where you try on dresses, cardigans, crowns, bows; switch bunny/cat/otter | Cosmetic self-expression; persists in the `outfit` slot, syncs with an account |
| Co-presence | Up to 8 real visitors walk the same hall; name tags, 4 emotes, short speech bubbles, walk-alone toggle | Social proof of life; the "other people are here" feeling |
| Shared toys | A gladiator helmet on a pedestal and a matcha cup that only ONE visitor in the room can carry at a time | Social object play — the helm/cup are conversation starters |
| Secrets | One hidden coin per visit (frame/rope/pedestal, wiggles), a singing statue, a café cat, a beanbag you can sit on | Discoverable delight; the coin is found-once-per-visit, not persistent |
| SketchGuess | 3-round minigame: guess the painting from partial sketch / zoomed detail / colour blur; 3 modes × 3 difficulties; stars, streaks, share results | A real scoring loop with local bests and a share hook |
| Guest board | Sticky notes visitors pin; artists read them in the studio | A light message-in-a-bottle social loop |
| Artist side | Claim a wall, upload, arrange into a display, publish, get a QR code, see analytics (views, inquiries, followers, scans), follow-by-email | The supply side; artists are the second audience to retain |
| Epoch rotation | Hall order reseeds on a schedule; deterministic, cursor-stable | Scheduled "new arrangement" — a natural content-refresh cadence |

### 0.2 Systems that make gamification cheap to build

- **Slots** (`packages/core/src/slots/`) — a generic, versioned, merge-safe JSON
  persistence layer. Anonymous visitors keep slots in localStorage; members sync them to
  Postgres. `outfit` and `presence` already use it. A `collection` or `visit-journal` slot
  is a documented recipe (`.agents/ACCOUNTS_PLAN.md` §9) — **no new table, no new route
  pattern, no profile needed**.
- **Events** (`packages/core/src/visit-features.ts`) — every interaction is already
  tracked anonymously: 30+ feature events, furthest landmark, paintings reached, visible
  duration, heartbeat. Funnels and cohorts are queryable today. The `visits` table even
  carries a **salted per-period visitor id** (`period_visitor` + `visit_period_salts`), so
  D1/D7/D30-style cohort retention is computable *anonymously* — no identity system
  needed, just a query.
- **Epochs** — the hall already has a "what's new" rhythm built in; it is just not told to
  anyone yet.
- **Presence** — real-time rooms exist (Cloudflare Durable Objects, rooms of 8, ephemeral).

### 0.3 Constraints that shape any recommendation

1. **The tiebreaker.** "The feeling of walking out of a real gallery — unhurried,
   considered, one thing at a time. Pacing over density, restraint over engagement."
   There is deliberately no feed, no profiles, no follower counts, no badges.
   Gamification must deepen the calm, not replace it.
2. **The design north star (owner tenet, 2026-11-01): "a place you belong."** Tiny Museum
   should evoke Stardew Valley's emotional feeling — belonging, familiarity, gentle
   anticipation, meaningful small efforts, personal freedom, attachment that grows over
   time. The guiding question for every feature: **"What would make someone miss this
   place?"** Principles: *familiar people and places* (characters and the life of the
   museum take priority over a large collection system); *small efforts leave a trace*;
   *gentle anticipation* (absence is never punished); *freedom and personal attachment*
   (satisfying alone, keepsakes hold memories); *art gives this community its identity*.
   Engagement grows through affection, curiosity and expression — **longer sessions alone
   are not the goal**.
3. **Anonymous by default.** Visitors are anonymous with device-local persistence;
   accounts are optional and private. Progress must feel meaningful without an account,
   and must not nag for one.
4. **The follow promise.** "One email when there is new work. Nothing else." Any
   notification/return loop must honour this spirit.
5. **One uniform 9:16 screen; phone-first.** Mechanics must survive one-handed,
   short-session use.
6. **Traffic today:** ~145 visits/30 days, ~5m56s average session. Every suggestion is
   judged against near-zero traffic: systems must be delightful for the 3 visitors who
   overlap, not only for 3,000.
7. **Not yet deployed.** This is the cheapest possible moment to pick a direction.

---

## 1. Genre direction

### 1.1 The landscape (seven candidates, with verdicts)

1. **Walking simulator / ambient exploration** — Firewatch sold a million copies in its
   first year on "a place you inhabit"; Journey proved anonymous co-presence deepens it
   ([Firewatch sales](https://www.shacknews.com/article/98363/firewatch-has-sold-one-million-copies),
   [Journey at ten years](https://gamerant.com/journey-anniversary-ten-years-thatgamecompany/)).
   This is Tiny Museum's *native feel*, but the genre is finite, single-purchase and has no
   return loop. **Verdict: keep as texture, never the genre.**
2. **Cozy game / cozy life-sim** — Animal Crossing: New Horizons sold [47.44 million
   copies](https://gamerant.com/nintendo-switch-best-selling-games-list-2025/) on dress-up
   + collect + decorate + check on villagers. [Cozy Grove](https://thenextweb.com/news/review-cozy-grove-is-what-happens-when-game-developers-give-a-damn-about-players)
   is explicitly built for short daily visits — it even [locks time-travel](https://support.spryfox.com/hc/en-us/articles/1500006739102-Time-traveling-changing-the-system-clock-to-play-more-Cozy-Grove)
   so players can't grind past the designed pace. [Neko Atsume](https://www.animenewsnetwork.com/news/2017-09-19/neko-atsume-smartphone-app-gets-ps-vr-game-in-2018/.121559)
   had 19M downloads by 2017 on almost nothing: leave food, close the app, cats visit while
   you're gone — *leaving is part of playing*. [Usagi Shima](https://automaton-media.com/articles/newsjp/20261031-476893/)
   (2023) proves the formula still lands. **Verdict: this is the destination.**
3. **Social virtual world / "third place" hangout** — Club Penguin (200M accounts, Disney
   acquisition) ran on minigames → coins → clothing and monthly parties; Habbo's 9M users
   halved in weeks when [moderation failed in 2012](https://techcrunch.com/2012/11/27/after-losing-over-half-its-9m-users-in-a-pedophile-scandal-habbo-hotel-hopes-for-new-life-as-a-gaming-platform/);
   Gather's $50M Series B met [cooling pandemic demand](https://forbesjapan.com/articles/detail/48787/page2).
   The counter-example that matters is [Kind Words](https://www.engadget.com/gaming/pc/kind-words-2-takes-cozy-letter-writing-to-the-city-on-october-7-215127953.html):
   6M+ letters over five years with no chat log, no density, no events. **Verdict: keep the
   *grammar* of low-stakes co-presence, decline the social-world business model** — a
   145-visits/month social world is an empty lobby, and free-form chat is a moderation
   liability.
4. **Collection-and-curation game** — Pokédex / ACNH Critterpedia / the museum donation
   loop. A DiGRA paper on ACNH's museum frames it as a [Wunderkammer](https://dl.digra.org/index.php/dl/article/download/2757/2741/2801):
   donating works because the museum *displays your collection* — progress is a place, not
   a number. Tiny Museum has the best collection object in games: art itself.
   **Verdict: the borrowed spine, not the identity.**
5. **Art / creativity game** — Passpartout's [50k first month](https://www.flamebaitgames.com/passpartout-press-release-indie-studios-first-game-sells-50-000-copies-its-first-month/)
   shows the ceiling; a real creation tool is a different product (canvas tech, export,
   moderation). **Verdict: SketchGuess stays a shareable garnish; artists' walls stay
   content, not gameplay.**
6. **Digital museum / virtual gallery platform** — the cautionary tale is Occupy White
   Walls, the most ambitious art-gallery MMO ever, [sunsetting in 2026 after eight
   years](https://massivelyop.com/2026/02/16/art-gallery-mmorpg-occupy-white-walls-is-sunsetting-after-eight-years-of-weird-art/).
   Google Arts & Culture solved scale, not engagement: scholarship describes visitors
   [navigating reproductions rather than dwelling on works](https://intellectdiscover.com/docserver/fulltext/jcs/11/1/jcs.11.1.4_Wasielewski.pdf?expires=1786778463&id=id&accname=guest&checksum=54D7DE40B67DBFEBDB8358D459AF1DD2),
   and [a visit without a reason to return is a one-time act](https://openresearch.ocadu.ca/id/eprint/3362/1/Milne_Victoria_2021_MA_CADN_MRP.pdf).
   **Verdict: artists' tooling is the *business model*, not the genre.** Be a game artists
   want to exhibit in.
7. **Light RPG with quests** — Sky: Children of the Light passed [300M downloads](https://www.kitguru.net/gaming/mustafa-mahmoud/sky-children-of-the-light-surpasses-300-million-downloads-as-thatgamecompany-celebrates-20th-anniversary/)
   on emote-first social grammar (strangers as silhouettes, friendship unlocked gradually),
   with measured [generosity contagion in its economy](https://ar5iv.labs.arxiv.org/html/2207.10615) —
   the closest cousin to Tiny Museum's 8-visitor co-presence. But Sky runs on quests,
   seasons and a candle economy: a live-ops treadmill. **Verdict: steal the social
   etiquette, decline the quest structure.**

### 1.2 Recommendation: a **cozy gallery life-sim** — "the gallery you live in"

**Tiny Museum should position itself as the gallery you live in — Cozy Grove's pacing
inside a hand-painted hall.** Primary genre: cozy life-sim (Cozy Grove / Neko Atsume /
Usagi Shima lineage). Collection-completion is the borrowed retention spine. Co-presence
is the ambient garnish, and walking-sim stillness is the tone guarantee.

Why this direction, specifically:

1. **Every asset is already on-genre.** Hall = island; artists = villagers; costumes = the
   wardrobe; secrets = collectibles; guest board = the letter box; café and beanbag =
   "being" verbs; epoch rotation = seasons; SketchGuess = the café minigame; co-presence =
   quiet neighbours. Every other direction demands reworking 2–4 features; this one asks
   for reframing plus one new progression layer.
2. **It works at real traffic.** Cozy games are solo-first by design: a 145-visits/month
   cozy world is a beloved small town where a social world would feel abandoned. And the
   5m56s average session is already the genre's natural unit (Neko Atsume's five-minute
   check-in; Cozy Grove's short daily day).
3. **It is the tiebreaker, literalised.** The genre's entire retention trick *is*
   restraint: Cozy Grove locks time-travel so you can't rush; Neko Atsume rewards you for
   leaving. Kind Words 2 proves calm social + tiny world + no feed is durable, not a mood
   board.
4. **It dodges the proven dead ends.** OWW (museum-as-platform) just died; Google Arts &
   Culture (museum-as-archive) goes unvisited; Sky (museum-as-quest) needs a live-ops
   machine. "Museum-as-home" is unoccupied, and the bunny-in-a-hand-painted-hall is
   already closer to Usagi Shima than to any gallery platform.

### 1.3 The five design pillars the genre implies

*(Ordered by the north star — characters and the life of the museum come before collection.)*

1. **Familiar characters with lives.** A recurring curator character (present near works,
   quiet remarks, remembers returning visitors — the evidence for why this works is in
   §2.5: a 2026 study found [85% of players satisfied with Animal Crossing's Blathers
   curator](https://www.tandfonline.com/doi/full/10.1080/14626268.2026.2624408)), and
   artists who become villagers rather than vendors. The hall should feel *inhabited*.
2. **Small efforts leave a trace.** Guest-board threads, artist replies, an exhibition
   that visibly takes shape across visits — participation with lasting, visible
   consequences. Never wipe what a visitor made (the IKEA effect dies if the work feels
   destroyed; §2.2).
3. **Gentle anticipation.** Multi-visit stories, a new wall in each epoch, "today at the
   museum" shown only on arrival. Nothing expires, nothing punishes absence, no red dots.
   Returning is a pleasure; missing a day costs nothing.
4. **The hall is a character.** More "being" verbs (sit, listen, linger, wave, watch the
   light change) and more secrets like the singing statue and café cat; quiet co-presence
   rituals. The test for every future feature: *does this make standing still in the hall
   better?*
5. **Expression and keepsakes.** The atelier as the reward room; a visit keepsake album
   (works seen, stamps, saved postcards — a record that grows, never resets). Collection
   is explicitly **secondary** to characters and the life of the museum, per the north
   star; the Pokédex framing stays light.

**Explicit avoids (non-negotiables):** no feed; no leaderboards; no energy/FOMO expiry;
no chat log (bubbles evaporate, as today); no notification-driven dailies; no streaks
that punish absence; SketchGuess never becomes the core loop.

**First 90 days, concretely:** ship the keepsake album and an arrival-time "today at the
museum" (both low-effort, zero new art) → design the curator character and one
multi-visit story → deepen guest-board threads (artist replies, "new since last visit").
Do not add chat, leaderboards, quests, or notifications. Measure one number: % of monthly
visitors who return in month two.

---

## 2. What the research says about engagement and time spent

### 2.1 Reframe the goal: session length is already good; frequency and return are the levers

From [GameAnalytics' 2025 Mobile Gaming Benchmarks](https://www.gameanalytics.com/reports/2025-mobile-gaming-benchmarks)
(11,600 games, ~1.48B MAU, full-year 2024):

- **Tiny Museum's 5m56s average session already beats casual-genre norms** (3.5–4.0 min)
  and matches puzzle/board games (5.6–7.4 min). The global median is 5–6 min.
- **D1 retention:** top quartile 26.5–27.7%, median ~17–18.5%. **D7:** top quartile
  7–8%, median 3.4–3.9%. **D28:** 75% of games fail to exceed 3% — GameAnalytics names
  "content pacing and progression" as the recurring weak spot.
- **The structural model to copy is board/card**, not multiplayer: moderate sessions,
  *high session count* (4–5/day), and the best D7/D28 in the casual spectrum — quick,
  rewarding loops with frequent short visits. Notably, **multiplayer has the longest
  sessions (9.3–9.8 min) and the worst retention of any genre**: long social sessions
  without relationship scaffolding retain poorly. Social deepening must build lightweight
  relationships, not just presence.
- Secondary [Adjust/Sensor Tower ranges via Genzopia](https://www.genzopia.com/blog/player-retention-engagement-statistics-2026):
  current realistic baselines ≈ 35/15/5 (D1/D7/D30); the old 40/20/10 rule overstates LTV
  by 30–50%. Industry-wide, **sessions +12% and time-spent +8% while downloads fell** —
  engagement per existing player is rising, which rewards live-ops over acquisition.

**Implication:** don't chase raw session length (the north star says the same: "longer
sessions alone are not the goal"). Optimise **voluntary return frequency and D7/D28**.
Realistic stretch targets for a calm web game: top-quartile D1 ≈ 27%, D7 ≈ 7–8% — only
reachable with a habit layer that matches the vibe.

### 2.2 Motivation science: what makes people stay, without manipulation

- **Self-Determination Theory** ([Ryan & Deci 2000](https://selfdeterminationtheory.org/SDT/documents/2000_RyanDeci_SDT.pdf)):
  sustained engagement flows from **autonomy, competence, relatedness** — and controlling
  extrinsic rewards undermine intrinsic motivation. Never attach reward schedules to
  looking at art, walking, or leaving notes; the calm walk *is* the intrinsic reward.
- **The overjustification effect** ([Lepper, Greene & Nisbett 1973](https://files.eric.ed.gov/fulltext/ED084210.pdf)):
  expected tangible rewards make people do the thing *less* afterward. Stars in
  SketchGuess are fine as competence feedback; reward schedules on viewing are not.
- **Quantic Foundry's Gamer Motivation Model** ([Yee 2016, ACM](https://dl.acm.org/doi/pdf/10.1145/2967934.2967937);
  [GDC 2020 segments](https://quanticfoundry.com/wp-content/uploads/2020/08/GDC-2020-Slides-Player-Segments-Quantic-Foundry.pdf),
  450k+ surveyed) — Tiny Museum's natural audience clusters on **Discovery** (hidden
  coin, helmet, matcha cup, singing statue), **Design** (atelier), **Completion** (light
  catalogue), **Community** (notes, co-presence), **Story** (artist bios, curator).
  Anti-fit: Competition, Destruction, Excitement, Power — the model formally rules out
  leaderboards and countdown pressure.
- **The IKEA effect** ([Norton, Mochon & Ariely 2012](https://pubwww.hbs.edu/faculty/Pages/item.aspx?num=40026))
  and **endowment** ([Kahneman, Knetsch & Thaler 1990](https://beta.explore.openaire.eu/search/publication?pid=10.1017%2Fcbo9781139175197.009);
  [Knetsch 1989](http://archive.org/download/environmentalval00knetuoft/environmentalval00knetuoft.pdf)):
  people value what they made and what they own (88% kept their mug over a trade).
  Sticky notes, outfits and keepsakes are Tiny Museum's strongest non-manipulative return
  hooks — provided the work is never wiped (the effect dies if it feels destroyed).

### 2.3 Habit and return mechanics, with the calm translation

- **Streaks work but burn; the calm form is a keepsake, not a streak.** Duolingo's
  company data: next-day retention rose 13% → 55% after streaks; 7-day streakers are
  3.6× more likely to finish; a streak-wager A/B raised D7 +14%; freezes and amulets lift
  returns ([Duolingo blog](https://blog.duolingo.com/how-streaks-keep-duolingo-learners-committed-to-their-language-goals/),
  [habit research](https://blog.duolingo.com/how-duolingo-streak-builds-habit/), compiled
  in [Yu-kai Chou's streak design analysis](https://yukaichou.com/gamification-study/master-the-art-of-streak-design-for-short-term-engagement-and-long-term-success/)).
  Independent anchors: [Silverman & Barasch 2023](https://udspace.udel.edu/items/42ce576b-8e1f-429a-8541-e29e48dbcfbb)
  (an *intact* record sustains behavior; a *broken* one demotivates resumption) and
  [Beshears et al. 2021, Management Science](https://pubsonline.informs.org/doi/abs/10.1287/mnsc.2020.3706)
  (loss framing drives ~0.31 more gym visits/week — evidence loss works, which is exactly
  why the north star forbids it). [Lally et al. 2010](https://www.ucl.ac.uk/news/2009/aug/how-long-does-it-take-form-habit):
  habits take ~66 days, and **one missed day doesn't hurt**. → *Tiny Museum: a visit
  keepsake album that grows and never resets; no streak to defend.*
- **Variable rewards without loss.** Skinner's variable-ratio schedules produce the most
  persistent behavior ([explainer](https://www.oxmag.co.uk/articles/reward-schedules-and-their-impact-on-engagement/));
  Eyal's Hooked model is Trigger → Action → **Variable Reward** → Investment
  ([Nir & Far](https://www.nirandfar.com/how-to-manufacture-desire/)). The four light
  secrets are already gentle variable rewards — add *mild, silent* unpredictability
  (a new secret appears, the statue performs, an unannounced note). Serendipity, never a
  slot machine.
- **Dailies → "gentle anticipation".** Progressive daily rewards appear in nearly half
  of the iOS US Top-Grossing 100 vs under a third outside it
  ([GameRefinery](https://www.gamerefinery.com/feature-spotlight-progression-daily-rewards/)) —
  the calm translation is "today at the museum" shown only on arrival: anticipation with
  no obligation and nothing lost by skipping. (Honest gap: no rigorous causal study
  isolates WoW-style dailies' retention effect.)
- **Zeigarnik effect** ([1927, PsycNet](https://psycnet.apa.org/record/2007-10344-025)):
  unfinished things are remembered better and pull you back. Quiet open loops — an
  unread note thread, a story left mid-chapter — are the calm alternative to countdowns.
- **Goal gradient and endowed progress** ([Kivetz, Urminsky & Zheng 2006](https://business.columbia.edu/faculty/research/goal-gradient-hypothesis-resurrected-purchase-acceleration-illusionary-goal);
  [Nunes & Drèze 2006](https://www.psychologyofgames.com/2010/11/endowed-progress-effect-and-game-quests/)):
  effort accelerates near a goal, and **pre-stamping 2 of 10 slots doubled completion
  (34% vs 19%)**. → Pre-seed the keepsake album and count "since your last visit" items
  toward the next stamp.
- **Events retain when nothing is lost.** 95% of studios run live-service games; top
  games run 150+ events in days ([GameRefinery](https://www.gamerefinery.com/how-to-build-better-live-events-with-the-gamerefinery-live-events-tracker/)).
  → A monthly guest exhibition, archived never deleted: event-driven return with zero
  FOMO.

### 2.4 Social presence: "doing virtually nothing" together

- [Moore, Ducheneaut & Nickell 2007 (CSCW)](https://dl.acm.org/doi/abs/10.1007/s10606-006-9021-4):
  MMOG players log in and stay just to be *near* others — awareness of co-presence
  sustains presence without interaction. [Ducheneaut et al. 2006](https://journals.sagepub.com/doi/abs/10.1177/1555412006292613):
  WoW play is largely solitary but socially embedded; social players invest more time.
- Sky: Children of the Light built 100M+ downloads on altruism and friendliness
  ([PocketGamer.biz](https://www.pocketgamer.biz/thatgamecompany-receives-160-million-investment/),
  [altruism deep dive](https://www.gamedeveloper.com/design/deep-dive-altruism-in-online-multiplayer-video-games-with-kind-words-and-sky-children-of-the-light/));
  Gather.town studies find co-presence beats video calls on connectedness
  ([KCI study](https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART003074504)).
- Duolingo company data: Friend Quests raised app opens ~10%; following 3+ friends ≈ 2×
  6-month retention ([Gitnux](https://gitnux.org/duolingo-user-statistics/)).

→ Tiny Museum's 8 visible visitors are a retention asset most games pay for. Deepen with
lightweight, opt-in rituals (a quiet "golden hour", waves, the statue performing for
whoever is present, occasional gatherings) — never chat pressure. Being in the hall
together silently *is* the feature.

### 2.5 Virtual museums, specifically

- [Zhao et al. 2019 (HKUST)](https://ar5iv.labs.arxiv.org/html/1902.03527): in a
  150-participant experiment, **passive guiding questions asked *after* viewing** made
  visitors browse significantly farther *and* deeper (p<0.01), while mid-view
  interruptions did not. This is the single most directly applicable session-deepening
  finding for the hall.
- [Sylaiou et al. 2010 (IJHCS)](https://dl.acm.org/doi/10.1016/j.ijhcs.2009.11.002):
  presence correlates with enjoyment in virtual museums — the embodied bunny walk is
  doing retention work; don't flatten it into menus.
- A 2026 study of Nintendo museum games found [85% satisfaction with the Blathers
  curator character](https://www.tandfonline.com/doi/full/10.1080/14626268.2026.2624408) —
  the empirical case for a curator NPC.
- **Honest gap:** the virtual-museum literature measures engagement, presence and
  comprehension, not D1/D7 retention. Extrapolate cautiously; treat Zhao et al. as
  session-quality evidence, not retention evidence.

---

## 3. What to build: 18 mechanics ranked, mapped to this codebase

Ranked by evidence × expected lift × north-star fit. V = visitor-facing, A =
artist-facing. Each entry answers the north star's questions: which feeling it supports,
what lasting change it offers, why a visitor would look forward to returning.

| # | Mechanic | North-star feeling | Evidence anchor | Lift / Vibe / Effort | Codebase touchpoint |
| --- | --- | --- | --- | --- | --- |
| 1 | **V — Recurring curator character** with a life beyond tasks: near works, quiet remarks, remembers returning visitors | Familiar people; belonging | Blathers 85% satisfaction; SDT relatedness; Moore et al. | M-H / H / M-H | New painted sprite + scripted lines in `features/hall/scene/` (character/rig pattern); return-visit greeting reads a new `visit-count` slot |
| 2 | **V — Multi-visit stories**: a corner visibly takes shape across visits (a wall being hung, a thread growing, a light changing) | Gentle anticipation; small efforts leave a trace | Zeigarnik; Zhao passive guidance; GameAnalytics "content pacing" = the D28 weakness | H / H / M-H | `domain/epoch.ts` for staged world state + a `story` slot; visible in `lobby.ts`/`cafe.ts`; events already tracked |
| 3 | **V — Guest-board depth**: note threads, artist replies, "new since your last visit" | Belonging; traces | SDT relatedness; Duolingo friends data | M-H / H / M | `domain/guestboard.ts` + schema (reply column or thread id); `GuestBoard.tsx` already has board/read/compose screens |
| 4 | **V+A — Monthly guest exhibition** (artist-in-residence), archived never deleted | Gentle anticipation; art as identity | Live-ops event evidence (95% of studios; 150+ events) | H / H / M | Epoch/curation flags (G5 in PROJECT.md); publish flow already gates admission |
| 5 | **V — Guiding questions after viewing** (skippable, passive) | Curiosity; attention | Zhao et al. 2019 (p<0.01, passive > active) | M-H / H / M | `features/artwork/components/Walkthrough.tsx` close path + new `VISIT_FEATURES` event |
| 6 | **V — Visit keepsake album**: works seen, stamps, saved postcards; grows, never resets, zero push | Keepsakes hold memories; freedom | Silverman & Barasch (intact records) minus loss framing; Lally (one miss doesn't matter) | M-H / H / L | **New slot `album`** (ACCOUNTS_PLAN §9 recipe); seen-work data already flows through `visit.ts`; render as a museum-journal page |
| 7 | **V — Co-presence rituals**: quiet "golden hour", waves, the statue performing for whoever is present, opt-in gatherings | Belonging | Moore et al. 2007; Gather.town; Sky | M / H / M-H | `presence/protocol.ts` event types + `scene/remote-visitors.ts`; statue logic exists in `scene.ts` |
| 8 | **V — Atelier self-creation**: assemble costumes from found materials; wear them in shared rooms | Freedom; expression | IKEA effect; endowment (88%) | M / H / M | `scene/wardrobe.ts` + `slots/outfit.ts` already persist looks; add found-material combos |
| 9 | **V — "One more room" breadcrumbs + return recap** ("seen 12 of 30; 2 new since") | Gentle anticipation | Goal gradient; Zeigarnik; endowed progress | M / H / L | `scene/config.ts` exit affordance + counts from existing events/slot |
| 10 | **V — Optional daily "sketchbook challenge"**: one artwork/day in SketchGuess; stars; freeze; no push | Meaningful small efforts at own pace | Duolingo daily loop; SDT competence | M / M-H / L-M | `features/sketchguess/lib/plan.ts` + date-seeded round pick; minigame fully built |
| 11 | **V — Light catalogue + secrets checklist** (pre-seeded, no timers) — secondary to characters | Gentle completion | Nunes & Drèze (34% vs 19%); Kivetz | M / H / L | Slot + page, same recipe as #6; secrets already emit events (`coin`, `statue`…) |
| 12 | **V — Artist of the week story cards** | Story; art as identity | Quantic Foundry Story/Discovery | M / H / M | SSR artist page (`studio/gallery`, `artists.ts`) + a lobby board |
| 13 | **V — Postcard share** (a work + your note) | Expression | Duolingo share data | L-M / H / L | Reuse `features/sketchguess/lib/share.ts` pattern; canvas-composed postcard |
| 14 | **A — Artist dashboard depth**: dwell time per work, note replies, gentle weekly digest | Artists belong too; competence | SDT feedback; artists = the content pipeline behind the D28 weakness | H / H / M | `audience.ts` analytics + `studio/performance`; add per-piece dwell event |
| 15 | **A — Artist autonomy**: choose hang order, lighting; reply to visitor notes | Freedom | SDT autonomy; IKEA ownership | M-H / H / M-H | `order_index` exists, nothing sets it (PROJECT.md C4); compose UI |
| 16 | **A — Seasonal group shows** (invited themes, shared openings) | Community identity | Live-ops events; Completion/Community | M / H / M | Curation wings (G5) + publish flags |
| 17 | **A — Artist–visitor dialogue surface**: artist replies surfaced; "you helped this exhibition take shape" | Traces; relationships | SDT relatedness; Duolingo friends | M / H / M | Guest-board replies (#3) surfaced on artist page |
| 18 | **V — "Today at the museum" on arrival only** (one new work/note/tidbit; no push) | Gentle anticipation | GameRefinery progressive dailies, without loss | M / H / L | `Museum.tsx` intro overlay + latest-work/epoch query |

**Core bundle if only six get built:** #1 curator, #2 multi-visit stories, #4 monthly
guest exhibition, #3 guest-board depth, #5 passive viewing questions, #14+#15 artist
depth. *(The two cheapest quick wins — #6 keepsake album and #18 arrival note — can ship
alongside with almost no risk.)*

**Explicitly avoid:** leaderboards; ranked minigame ladders; countdown timers; content
that expires and is lost; guilt notifications; infinite streaks; anything that punishes
absence. For every mechanic, the owner's test applies: *"What would make someone miss
this place?"* — affection, curiosity and expression only.

### 3.1 How to measure it

- **Cohort retention today, anonymously:** the `visits` table already stores a salted
  `period_visitor` (`visit_period_salts`), so D1/D7/D28 cohort queries are pure SQL — no
  identity system needed. Add this as the first dashboard query alongside the existing
  studio analytics.
- **Feature events:** every mechanic above maps onto `VISIT_FEATURES` events that mostly
  already exist (`guest_note_*`, `sketch_*`, `coin`, `statue`, `costume_on`, …). Add one
  event per new mechanic and watch per-visit feature rates, not just counts.
- **North-star metrics:** the owner's tenet says to evaluate *remembered characters,
  attachment, voluntary return, and enjoyment* alongside time spent. Operationalise:
  month-over-month returning-visitor rate; % of visitors who read a note and then post
  one; curator re-greeting rate (return visits that encounter the curator); share rate
  (postcards/SketchGuess); follow-confirmation rate. Session length is a *secondary*
  health check, never the KPI.

## 4. Decision summary

1. **Genre: cozy gallery life-sim** — "the gallery you live in" (Cozy Grove's pacing,
   Neko Atsume's check-in loop, Stardew's belonging, all inside the hand-painted hall).
   Collection is the borrowed spine; co-presence is ambience; walking-sim stillness is
   the tone guarantee. This is the only direction where every existing asset stays and
   the 145-visits/month reality is a strength.
2. **Engagement lever: voluntary return, not session length.** Your 5m56s sessions
   already beat casual norms; copy the board/card pattern (frequent short visits) and
   target top-quartile D1 ≈ 27%, D7 ≈ 7–8% once deployed.
3. **First moves:** keepsake album + arrival note (cheap) → curator character + one
   multi-visit story + guest-board threads (the heart of "a place you belong") → monthly
   guest exhibition (the cadence). Never: streaks, leaderboards, expiring content,
   push-driven dailies.

## Sources

Genre landscape: [ACNH sales](https://gamerant.com/nintendo-switch-best-selling-games-list-2025/) ·
[Cozy Grove review](https://thenextweb.com/news/review-cozy-grove-is-what-happens-when-game-developers-give-a-damn-about-players/) ·
[Cozy Grove time-travel lock](https://support.spryfox.com/hc/en-us/articles/1500006739102-Time-traveling-changing-the-system-clock-to-play-more-Cozy-Grove) ·
[Neko Atsume 19M](https://www.animenewsnetwork.com/news/2017-09-19/neko-atsume-smartphone-app-gets-ps-vr-game-in-2018/.121559) ·
[Usagi Shima](https://automaton-media.com/articles/newsjp/20261031-476893/) ·
[Firewatch 1M](https://www.shacknews.com/article/98363/firewatch-has-sold-one-million-copies) ·
[Journey at 10](https://gamerant.com/journey-anniversary-ten-years-thatgamecompany/) ·
[Kind Words](https://www.engadget.com/gaming/pc/kind-words-2-takes-cozy-letter-writing-to-the-city-on-october-7-215127953.html) ·
[Habbo moderation failure](https://techcrunch.com/2012/11/27/after-losing-over-half-its-9m-users-in-a-pedophile-scandal-habbo-hotel-hopes-for-new-life-as-a-gaming-platform/) ·
[Gather's post-pandemic cooling](https://forbesjapan.com/articles/detail/48787/page2) ·
[ACNH museum as Wunderkammer (DiGRA)](https://dl.digra.org/index.php/dl/article/download/2757/2741/2801) ·
[Passpartout 50k](https://www.flamebaitgames.com/passpartout-press-release-indie-studios-first-game-sells-50-000-copies-its-first-month/) ·
[Occupy White Walls sunset](https://massivelyop.com/2026/02/16/art-gallery-mmorpg-occupy-white-walls-is-sunsetting-after-eight-years-of-weird-art/) ·
[Google Arts & Culture scholarship](https://intellectdiscover.com/docserver/fulltext/jcs/11/1/jcs.11.1.4_Wasielewski.pdf?expires=1786778463&id=id&accname=guest&checksum=54D7DE40B67DBFEBDB8358D459AF1DD2) ·
[one-time visits thesis](https://openresearch.ocadu.ca/id/eprint/3362/1/Milne_Victoria_2021_MA_CADN_MRP.pdf) ·
[Sky 300M downloads](https://www.kitguru.net/gaming/mustafa-mahmoud/sky-children-of-the-light-surpasses-300-million-downloads-as-thatgamecompany-celebrates-20th-anniversary/) ·
[Sky generosity contagion](https://ar5iv.labs.arxiv.org/html/2207.10615)

Engagement & retention: [GameAnalytics 2025 benchmarks](https://www.gameanalytics.com/reports/2025-mobile-gaming-benchmarks) ·
[Genzopia retention stats](https://www.genzopia.com/blog/player-retention-engagement-statistics-2026) ·
[Ryan & Deci 2000 (SDT)](https://selfdeterminationtheory.org/SDT/documents/2000_RyanDeci_SDT.pdf) ·
[Lepper, Greene & Nisbett 1973](https://files.eric.ed.gov/fulltext/ED084210.pdf) ·
[Yee 2016 (ACM)](https://dl.acm.org/doi/pdf/10.1145/2967934.2967937) ·
[Quantic Foundry GDC 2020](https://quanticfoundry.com/wp-content/uploads/2020/08/GDC-2020-Slides-Player-Segments-Quantic-Foundry.pdf) ·
[IKEA effect (HBS)](https://pubwww.hbs.edu/faculty/Pages/item.aspx?num=40026) ·
[Kahneman et al. 1990](https://beta.explore.openaire.eu/search/publication?pid=10.1017%2Fcbo9781139175197.009) ·
[Knetsch 1989](http://archive.org/download/environmentalval00knetuoft/environmentalval00knetuoft.pdf) ·
[Duolingo streaks](https://blog.duolingo.com/how-streaks-keep-duolingo-learners-committed-to-their-language-goals/) ·
[Duolingo habit research](https://blog.duolingo.com/how-duolingo-streak-builds-habit/) ·
[Chou streak design](https://yukaichou.com/gamification-study/master-the-art-of-streak-design-for-short-term-engagement-and-long-term-success/) ·
[Silverman & Barasch 2023](https://udspace.udel.edu/items/42ce576b-8e1f-429a-8541-e29e48dbcfbb) ·
[Beshears et al. 2021](https://pubsonline.informs.org/doi/abs/10.1287/mnsc.2020.3706) ·
[Lally et al. 2010](https://www.ucl.ac.uk/news/2009/aug/how-long-does-it-take-form-habit) ·
[Reward schedules explainer](https://www.oxmag.co.uk/articles/reward-schedules-and-their-impact-on-engagement/) ·
[Hooked model](https://www.nirandfar.com/how-to-manufacture-desire/) ·
[GameRefinery daily rewards](https://www.gamerefinery.com/feature-spotlight-progression-daily-rewards/) ·
[Zeigarnik 1927](https://psycnet.apa.org/record/2007-10344-025) ·
[Kivetz et al. 2006](https://business.columbia.edu/faculty/research/goal-gradient-hypothesis-resurrected-purchase-acceleration-illusionary-goal) ·
[Nunes & Drèze endowed progress](https://www.psychologyofgames.com/2010/11/endowed-progress-effect-and-game-quests/) ·
[GameRefinery live events](https://www.gamerefinery.com/how-to-build-better-live-events-with-the-gamerefinery-live-events-tracker/) ·
[Moore et al. 2007 (CSCW)](https://dl.acm.org/doi/abs/10.1007/s10606-006-9021-4) ·
[Ducheneaut et al. 2006](https://journals.sagepub.com/doi/abs/10.1177/1555412006292613) ·
[Sky investment](https://www.pocketgamer.biz/thatgamecompany-receives-160-million-investment/) ·
[Sky altruism deep dive](https://www.gamedeveloper.com/design/deep-dive-altruism-in-online-multiplayer-video-games-with-kind-words-and-sky-children-of-the-light/) ·
[Gather.town vs Zoom study](https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART003074504) ·
[Duolingo stats aggregation](https://gitnux.org/duolingo-user-statistics/) ·
[Zhao et al. 2019 (arXiv)](https://ar5iv.labs.arxiv.org/html/1902.03527) ·
[Sylaiou et al. 2010](https://dl.acm.org/doi/10.1016/j.ijhcs.2009.11.002) ·
[Blathers satisfaction study 2026](https://www.tandfonline.com/doi/full/10.1080/14626268.2026.2624408)
