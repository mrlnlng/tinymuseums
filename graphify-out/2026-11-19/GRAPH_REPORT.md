# Graph Report - tiny-museum  (2026-11-19)

## Corpus Check
- 539 files · ~326,701 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 95 file(s) not represented in the graph (top: .avif 52, .glb 34, .css 4)

## Summary
- 4850 nodes · 12571 edges · 216 communities (187 shown, 29 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 250 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `48b418be`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- MuseumStage.tsx
- Walker
- SketchGuess.tsx
- themes.ts
- lib/assets.ts
- round.ts
- floor.ts
- Core Asset Manifest
- scene/assets.ts
- SyncStore
- machine.ts
- Museum.tsx
- Test Fakes and Helpers
- scene.ts
- cozy.ts
- features/economy/index.ts
- room-events.ts
- schedule.ts
- ref_node_assert
- amplify/package.json
- PersonalRoom.tsx
- prepare-models.mjs
- Traversal
- core/package.json
- wardrobe.ts
- Placement
- ClosetView.tsx
- LeaderboardPanel.tsx
- ambience.ts
- core/src/index.ts
- Web Package Dependencies
- Gamifying Tiny Museum — genre direction & engagement research
- atelier.ts
- remote-visitors.ts
- risk.ts
- amplify/tsconfig.json
- 5. Customization menu — what other people are doing
- wallet.ts
- handlers.ts
- Web TSConfig
- Root Package Manifest
- actions.ts
- npc-layer.ts
- import-fishing-assets.mjs
- Base TSConfig
- Amplify Build Spec
- sketchguess/lib/api.ts
- audience.ts
- slots/store.ts
- createHallRoom
- Water.tsx
- Worker Package Manifest
- Public Asset Manifest
- SlotDef
- wander.test.ts
- compose-atelier.mjs
- lib/presence.ts
- pond-format.ts
- react
- economy/store.ts
- pond-boards.ts
- room.ts
- minimap.ts
- personal/room.ts
- domain/guestboard.ts
- Sound Effect Assets
- createStage
- Custom HTTP Headers
- Sharp Layer Package
- currentMember
- scene/ambience.ts
- layout.ts
- remote-visitors.ts
- DecorController
- Visits SQL Schema
- Bunny Walk Sprites
- Room Mockup Settings
- Service Worker Caching
- HallCallbacks
- pond/art.ts
- createPresence
- members
- Frame Window Asset
- wander.ts
- presence/package.json
- createAtelierRoom
- Asset pipeline: fast loading without losing sharpness
- Guest Board SQL Schema
- Landscape Frame Asset
- names.ts
- Bug Reports SQL Schema
- Vitals SQL Schema
- json
- CharacterKind
- pond/room.ts
- members.ts
- Run-Once Schema
- MuseumStage.tsx
- FishingView.tsx
- ticket.ts
- bug-reports.ts
- reveal.ts
- hit.ts
- graftCostume
- pondgame/lib/api.ts
- worker/tsconfig.json
- core/tsconfig.json
- Atelier: the dressing mirror, and show-don't-tell keeping
- How to Design for Failures — ByteByteGo Newsletter
- Worker instructions — DSH headless agents
- Backend
- protocol.ts
- Costume gallery doorway
- useBackgroundMusic.ts
- Fishing forest: painted asset pass
- audio/README.md
- .claude/CLAUDE.md
- The Costume Atelier
- Confirmed issues
- rig.ts
- Curating the paintings (2026-11-07)
- hitForVisitor
- presence/tsconfig.json
- run.ts
- tsconfig.test.json
- app/layout.tsx
- ColorRecall.tsx
- peers.ts
- gallery.ts
- bug-reports.ts
- npc-layer.ts
- SoundProvider.tsx
- room-places.ts
- Conn
- db-tests/pond.test.ts
- createRemoteVisitors
- rooms/art.ts
- The Moonlit Pond — design
- Pond rework
- dependencies
- Orchestration contract — you plan, DSH workers execute
- tables.ts
- infra/jobs.ts
- exports
- pond-state.ts
- Cafe
- AtelierRoom
- visits/page.tsx
- performance/page.tsx
- Your Room: a room you can freely furnish
- Walkthrough.tsx
- createPondRoom
- useSoundEffects.ts
- .webSocketMessage
- LandingFx
- import-landing-assets.mjs
- painting-open
- CrowdPreview.tsx
- Multiplayer ("other visitors") — plan v2 (Cloudflare)
- Lobby
- SoundProvider.tsx
- confirm/page.tsx
- icon-basket
- query
- visits.ts
- shopkeeper.ts
- bunny-left
- 4. Transport: Cloudflare Durable Objects
- bunny-right
- logic.ts
- Wardrobe
- icon-home
- createPersonalRoom
- BunnyArtist.tsx
- ticket
- schedule.test.ts
- Storyline (draft, saved 2026-11-17)
- PondTicker.tsx
- hall/room.ts
- Low
- AccountSheet
- draw.py
- epoch.ts
- BountyPanel.tsx
- Item
- perf.ts
- Monets Lily Pond: exploration, UX and multiplayer QA
- Rig
- High
- import-hall-assets.mjs
- pond-api.ts
- AccountSheet.tsx
- Local end-to-end stress test — 2026-11-06
- Atelier: the dressing mirror, and show-don't-tell keeping
- setCostumeVisibility
- Notes
- npcs/README.md
- Other visitors
- master
- media/storage.ts
- rooms.ts
- mutation-guard.ts
- vitals.ts
- PondRoom.tsx
- darknessAt
- next.config.ts
- HelmShare
- Sitting
- createDecorController

## God Nodes (most connected - your core abstractions)
1. `react` - 80 edges
2. `json()` - 72 edges
3. `query()` - 68 edges
4. `PersonalRoom()` - 67 edges
5. `hit()` - 58 edges
6. `limited()` - 52 edges
7. `three` - 47 edges
8. `next` - 44 edges
9. `Traversal` - 44 edges
10. `SyncStore` - 41 edges

## Surprising Connections (you probably didn't know these)
- `Checked and fine` --references--> `flip()`  [INFERRED]
  docs/personal-room-issues.md → apps/web/src/features/hall/scene/closet.ts
- `Code` --references--> `followOutfit()`  [INFERRED]
  docs/costume-atelier.md → apps/web/src/features/hall/scene/wardrobe.ts
- `5.1 Emotes (v1)` --references--> `ScreenChrome()`  [INFERRED]
  docs/multiplayer-plan.md → apps/web/src/shared/components/ScreenChrome.tsx
- `E2E-009 — Room mutations ignore stale account identity` --references--> `memberFromRequest()`  [INFERRED]
  docs/testing/local-e2e-stress-2026-11-06.md → apps/web/src/shared/lib/member-route.ts
- `Where things stand` --references--> `sealEpoch()`  [INFERRED]
  docs/curation-plan.md → packages/core/src/domain/epoch.ts

## Import Cycles
- None detected.

## Communities (216 total, 29 thin omitted)

### Community 0 - "MuseumStage.tsx"
Cohesion: 0.06
Nodes (21): Pose, Room, Entry, Arrival, JoinedContents, RoomContents, RoomDef, Decisions (2026-11-05) (+13 more)

### Community 2 - "SketchGuess.tsx"
Cohesion: 0.09
Nodes (32): bestKeyFor(), BURST, clueUrl(), Phase, pickAtRandom(), PreparedGame, readDifficulty(), readMode() (+24 more)

### Community 3 - "themes.ts"
Cohesion: 0.06
Nodes (41): confirmClean(), ownershipFor(), ownsAll, ownsNone, GAMES, isRecord(), parsePlacements(), placementOf() (+33 more)

### Community 4 - "lib/assets.ts"
Cohesion: 0.13
Nodes (24): Loading(), dynamic, Hall(), MuseumPage(), [BRAND_OWNER, ...BRAND_REST], CurrentlyShowing(), Decor(), dynamic (+16 more)

### Community 5 - "round.ts"
Cohesion: 0.15
Nodes (27): deltaE(), GAMUT_EPSILON, hexToOklab(), inGamut(), linearRgbToOklab(), linearToSrgb(), Oklab, oklabToLinearRgb() (+19 more)

### Community 6 - "floor.ts"
Cohesion: 0.13
Nodes (34): clone(), closestOnSegment(), contains(), cross(), crossVec(), depthAtY(), depthBounds(), depthT() (+26 more)

### Community 7 - "Core Asset Manifest"
Cohesion: 0.05
Nodes (41): artworks, audio, file, megabytes, seconds, sourceName, startedAt, bunny (+33 more)

### Community 8 - "scene/assets.ts"
Cohesion: 0.09
Nodes (40): AssetManifest, assetUrl(), bitmapTexture(), blankImage(), CAFE_CAT_FRAMES, CompressedLoader, elementTexture(), ENTRANCE_FILES (+32 more)

### Community 9 - "SyncStore"
Cohesion: 0.16
Nodes (8): encodeStored(), parseStored(), readStored(), removeStored(), tryReadStored(), writeStored(), SyncStore, upgrade()

### Community 10 - "machine.ts"
Cohesion: 0.12
Nodes (36): CastMeter(), ReelMeter(), armCast(), BITE_WINDOW, biteGap(), CHARGE_PERIOD, chargePower(), createFishingState() (+28 more)

### Community 11 - "Museum.tsx"
Cohesion: 0.10
Nodes (33): PinnedNotes(), CoinFound, ColorRecall, GameDesktop, GuestBoard, HallArranger, HelpGuide, loadCoinFound() (+25 more)

### Community 12 - "Test Fakes and Helpers"
Cohesion: 0.12
Nodes (27): deferredFetch(), deviceSlot, FakeEvents, FakeStorage, fixture, fixtureB, fixtureRegistry, fixtureRegistryBoth (+19 more)

### Community 13 - "scene.ts"
Cohesion: 0.05
Nodes (27): MuseumProps, disposeDisplayTexture(), prefersAvif(), HiddenCoin, createNotes(), createPedestal(), Pedestal, PedestalVoice (+19 more)

### Community 14 - "cozy.ts"
Cohesion: 0.07
Nodes (48): alphaCanvas(), ATELIER_PROPS, AtelierImage, atticWindowCanvas(), bareBulbCanvas(), boardsCanvas(), canvasTexture(), ceilingTexture() (+40 more)

### Community 15 - "features/economy/index.ts"
Cohesion: 0.11
Nodes (28): CoinToast(), Toast, Purse(), Stamp(), WalletProvider(), serverSnapshot, useEarnEvents(), useWallet() (+20 more)

### Community 16 - "room-events.ts"
Cohesion: 0.10
Nodes (30): ChatButton(), REFUSED, joinRoom(), emit(), getPeople(), isInRoom(), isMuted(), muted (+22 more)

### Community 17 - "schedule.ts"
Cohesion: 0.08
Nodes (54): addDwellEmotes(), addEmote(), addGap(), addStand(), addWalk(), along(), buildRoomTable(), buildStayPlan() (+46 more)

### Community 18 - "ref_node_assert"
Cohesion: 0.10
Nodes (31): STAMP_SVG, valid, defineSlot(), docBytes(), SLOTS, byAtThenKey(), encoded(), latest (+23 more)

### Community 19 - "amplify/package.json"
Cohesion: 0.08
Nodes (26): amplifyDir, backend, everyMinutes, mediaBucket, missing, repoRoot, REQUIRED, setting() (+18 more)

### Community 20 - "PersonalRoom.tsx"
Cohesion: 0.10
Nodes (46): errorReason(), Offer, overDrawer(), PersonalRoom(), canPlaceNew(), carriedTo(), carryEnd(), carryMove() (+38 more)

### Community 21 - "prepare-models.mjs"
Cohesion: 0.10
Nodes (21): BODIES, bruce, BRUCE_FIT, BRUCE_PLACE, bunny, CARDIGAN_TIE, CROWN, CROWN_MIDDLE (+13 more)

### Community 22 - "Traversal"
Cohesion: 0.09
Nodes (8): coverFloorTransition(), JumpPose, createRoomPassage(), fixture(), clamp(), fixture(), jump(), Traversal

### Community 23 - "core/package.json"
Cohesion: 0.16
Nodes (13): devDependencies, @types/bcryptjs@^2.4.6, @types/pg@^8.11.10, main, name, private, scripts, typecheck (+5 more)

### Community 24 - "wardrobe.ts"
Cohesion: 0.07
Nodes (51): AtelierPage(), dynamic, metadata, allowedCharacter(), OwnedSnapshot, owns(), walletReady(), Atelier() (+43 more)

### Community 25 - "Placement"
Cohesion: 0.09
Nodes (8): Carry, PersonalRoomProps, GhostOptions, PlacementLayer, PlacementTheme, The closet: where every room starts (2026-11-17), Phase 5: themes, zones and arrangements, Placement

### Community 26 - "ClosetView.tsx"
Cohesion: 0.10
Nodes (27): AtelierKeeps(), flash(), keep(), onKey(), press(), release(), labelOf(), nameOf() (+19 more)

### Community 27 - "LeaderboardPanel.tsx"
Cohesion: 0.20
Nodes (16): PondBoardId, PondBoardPeriod, PondBoardRow, PondLeaderboard, formatCountdown(), formatOdds(), nextMondayUtc(), useCountdown() (+8 more)

### Community 28 - "ambience.ts"
Cohesion: 0.12
Nodes (29): blade(), bloom(), BLOOMS, createPondAmbience(), update(), fishTexture(), frond(), FRONT_ROWS (+21 more)

### Community 29 - "core/src/index.ts"
Cohesion: 0.05
Nodes (112): addBait(), PondBoardMe, PondBoardRow, PondFeedItem, Rep, bountyCatches(), BountyCatchRow, bountyViews() (+104 more)

### Community 30 - "Web Package Dependencies"
Cohesion: 0.07
Nodes (33): dependencies, embla-carousel-react@^8.6.0, motion@^13.1.1, next@^15.0.3, react@^19.0.0, react-dom@^19.0.0, swr@^2.5.1, three@^0.169.0 (+25 more)

### Community 31 - "Gamifying Tiny Museum — genre direction & engagement research"
Cohesion: 0.10
Nodes (19): 0.1 The core experience, 0.2 Systems that make gamification cheap to build, 0.3 Constraints that shape any recommendation, 0. What the game is today (the deep dive), 1.1 The landscape (seven candidates, with verdicts), 1.2 Recommendation: a **cozy gallery life-sim** — "the gallery you live in", 1.3 The five design pillars the genre implies, 1. Genre direction (+11 more)

### Community 32 - "atelier.ts"
Cohesion: 0.07
Nodes (29): AtelierActions, AtelierImage, BuiltRoom, Cardigan, CARDIGAN_NAMES, Control, refresh(), disposeAtelierArt() (+21 more)

### Community 33 - "remote-visitors.ts"
Cohesion: 0.05
Nodes (36): CharacterSprites, CameraRig, Carried, CarriedState, Character, Perch, Pose, centerYFor() (+28 more)

### Community 34 - "risk.ts"
Cohesion: 0.11
Nodes (34): Hud(), HudProps, HudWagerChip, WagerPicker(), chooseTier(), WagerPickerProps, CastOptions, PondStateView (+26 more)

### Community 35 - "amplify/tsconfig.json"
Cohesion: 0.20
Nodes (9): compilerOptions, module, moduleResolution, noUnusedLocals, noUnusedParameters, exclude, extends, include (+1 more)

### Community 36 - "5. Customization menu — what other people are doing"
Cohesion: 0.12
Nodes (16): 1. The target: what "Claude Opus 5.5" actually means, 2. Where your harness stands today (live config I read), 3. The honest gap model, 4. Quality levers, ranked by leverage, 5. Customization menu — what other people are doing, 6. Recommended starting kit for *your* profile, 7. What I can apply for you right now (needs your go-ahead), A. Prompt & persona (most common quality customizations) (+8 more)

### Community 37 - "wallet.ts"
Cohesion: 0.06
Nodes (53): grantPearls(), member(), now, piece(), randomId(), today, baitOf(), applyClaim() (+45 more)

### Community 38 - "handlers.ts"
Cohesion: 0.07
Nodes (40): target, SCHEMA_DIR, confirmedFollowers(), handleDerivatives(), handleNotifyFollowers(), handleRenderDisplay(), handleSealEpoch(), renderPieceFrame() (+32 more)

### Community 39 - "Web TSConfig"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 40 - "Root Package Manifest"
Cohesion: 0.06
Nodes (36): [, width, height], description, devDependencies, concurrently@^9.1.0, esbuild@^0.24.0, ktx2-encoder@^0.6.0, maxrects-packer@^2.7.3, playwright@^1.63.0 (+28 more)

### Community 41 - "actions.ts"
Cohesion: 0.06
Nodes (78): AnalyticsPage(), dynamic, BugReportsPage(), dateFormat, dynamic, summary(), dynamic, GalleryPage() (+70 more)

### Community 42 - "npc-layer.ts"
Cohesion: 0.15
Nodes (18): BY_ID, CAST, FRAME, IDLE, idleCel(), NPC_WALK_SPEED, NpcCharacter, WANDERER_IDS (+10 more)

### Community 43 - "import-fishing-assets.mjs"
Cohesion: 0.10
Nodes (12): CANVAS, clear, FONT, FRAME, heights, layout, lossless, manifest (+4 more)

### Community 44 - "Base TSConfig"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, lib, module, moduleResolution (+9 more)

### Community 45 - "Amplify Build Spec"
Cohesion: 0.12
Nodes (16): applications, appRoot, backend, frontend, baseDirectory, files, phases, commands (+8 more)

### Community 46 - "sketchguess/lib/api.ts"
Cohesion: 0.30
Nodes (10): sameOriginUrl(), decodeImage(), fetchBitmap(), fetchRound(), guarded(), loadInk(), loadRound(), warmImage() (+2 more)

### Community 47 - "audience.ts"
Cohesion: 0.11
Nodes (22): ArtistPage(), dynamic, generateMetadata(), GET(), GET(), FollowForm(), getArtistPage(), AnalyticsSummary (+14 more)

### Community 48 - "slots/store.ts"
Cohesion: 0.13
Nodes (16): ANON_PREFIX, anonKey(), deviceKey(), isMemberSlotKey(), listKeys(), MEMBER_KEY, memberKey(), memberPrefix() (+8 more)

### Community 49 - "createHallRoom"
Cohesion: 0.11
Nodes (17): createCarried(), createHelm(), createMatcha(), createSitting(), hop(), createHallRoom(), buildRoom(), cafeRoom() (+9 more)

### Community 50 - "Water.tsx"
Cohesion: 0.08
Nodes (37): AmbientShadow, box(), BUCKET, bunnyBox(), easeOut(), Glint, LEFT_STYLE, lineColour() (+29 more)

### Community 51 - "Worker Package Manifest"
Cohesion: 0.14
Nodes (14): dependencies, @tiny/core@*, exports, ./lambda, @tiny/core, main, name, private (+6 more)

### Community 52 - "Public Asset Manifest"
Cohesion: 0.12
Nodes (15): artworks, bunny, size, floor, size, fonts, icon-no-photos, size (+7 more)

### Community 53 - "SlotDef"
Cohesion: 0.14
Nodes (5): FakeServer, SlotState, serverSnapshot(), serverSnapshots, SlotDef

### Community 54 - "wander.test.ts"
Cohesion: 0.12
Nodes (17): FloorSpot, Job, Place, Phase, ResidentState, Run, WalkPath, WalkState (+9 more)

### Community 55 - "compose-atelier.mjs"
Cohesion: 0.12
Nodes (10): body, dressLayer, dressWidth, floralWidth, hanger, MANNEQUIN_CANVAS, mask, root (+2 more)

### Community 56 - "lib/presence.ts"
Cohesion: 0.09
Nodes (22): Entry, Connect, fetchTicket, HEARTBEAT_MS, HIDDEN_LIMIT_MS, RETRY_MS, sameLook(), samePose() (+14 more)

### Community 57 - "pond-format.ts"
Cohesion: 0.14
Nodes (25): EXCHANGE_DAILY_STAMPS, EXCHANGE_PEARLS_PER_STAMP, FISH_ART, fishArt(), formatPercent(), formatShortSizeCm(), ODDS_BAIT, POND_BAIT (+17 more)

### Community 58 - "react"
Cohesion: 0.19
Nodes (13): openBugReport(), fitWidth(), HelpGuide(), HelpGuideProps, POINTER_STEPS, TOUCH_STEPS, MinigameFrameProps, useSound() (+5 more)

### Community 59 - "economy/store.ts"
Cohesion: 0.08
Nodes (63): CARRY_CAP, carryAdd(), CarryEntry, carryPrune(), carryRemove(), chunk(), ClaimRequest, tzOffsetNow() (+55 more)

### Community 60 - "pond-boards.ts"
Cohesion: 0.13
Nodes (21): BOARDS, GET(), oneOf(), PER_VISITOR, PERIODS, compare(), DexRow, displayName() (+13 more)

### Community 61 - "room.ts"
Cohesion: 0.12
Nodes (29): socket(), admitted(), Attachment, farewell(), GHOST_MS, HELLO_TIMEOUT_MS, holdsOf(), MAX_WAITING_PER_IP (+21 more)

### Community 62 - "minimap.ts"
Cohesion: 0.07
Nodes (34): place(), ATELIER_DOOR, createMinimap(), draw(), drawRoom(), floors(), follow(), sketchOf() (+26 more)

### Community 63 - "personal/room.ts"
Cohesion: 0.11
Nodes (14): CafeLink, GuestBoardNotes, Placards, toScreen(), writeStyle(), createPersonalRoom(), light(), shade() (+6 more)

### Community 64 - "domain/guestboard.ts"
Cohesion: 0.08
Nodes (40): GET(), BoardScreen(), BoardScreenProps, ComposeScreen(), ComposeScreenProps, blankDraft(), GuestBoard(), GuestBoardProps (+32 more)

### Community 65 - "Sound Effect Assets"
Cohesion: 0.22
Nodes (9): file, kilobytes, seconds, file, kilobytes, seconds, soundEffects, click (+1 more)

### Community 66 - "createStage"
Cohesion: 0.05
Nodes (39): Loading(), AtelierLoading(), revealFloorTransition(), ArtCache, ArtCacheOptions, createArtCache(), drop(), expireLater() (+31 more)

### Community 67 - "Custom HTTP Headers"
Cohesion: 0.25
Nodes (7): applications, appRoot, customHeaders, headers, pattern, key, value

### Community 68 - "Sharp Layer Package"
Cohesion: 0.33
Nodes (6): dependencies, sharp@^0.33.5, description, sharp, name, private

### Community 69 - "currentMember"
Cohesion: 0.07
Nodes (44): GET(), GET(), PER_MEMBER, GET(), PER_MEMBER, GET(), PER_MEMBER, roomEditor (+36 more)

### Community 70 - "scene/ambience.ts"
Cohesion: 0.13
Nodes (13): BULBS, createHallAmbience(), finish(), glowTexture(), HallAmbience, mulberry(), painted(), vignetteTexture() (+5 more)

### Community 71 - "layout.ts"
Cohesion: 0.15
Nodes (10): cafeAfterIndex(), computeLayout(), cutRooms(), HallLayout, HallRoomKind, HallRoomSpan, hasPedestal(), Span (+2 more)

### Community 72 - "remote-visitors.ts"
Cohesion: 0.10
Nodes (23): RigPreviewPage(), NEXT, PROPS, RigPreview(), draw(), Attachment, createCharacter(), contextLost() (+15 more)

### Community 73 - "DecorController"
Cohesion: 0.08
Nodes (5): Job, DecorController, PersonalRoomOptions, HighlightArea, WorkKind

### Community 74 - "Visits SQL Schema"
Cohesion: 0.47
Nodes (5): visit_period_salts, visit_salts, visits, visits_day_visitor, visits_recorded_at

### Community 75 - "Bunny Walk Sprites"
Cohesion: 0.40
Nodes (5): bunnyWalk, byFacing, size, left, right

### Community 76 - "Room Mockup Settings"
Cohesion: 0.40
Nodes (5): room, floorColor, floorTopRatio, mockupSize, wallColor

### Community 77 - "Service Worker Caching"
Cohesion: 0.70
Nodes (4): cacheable(), cacheFirst(), staleWhileRevalidate(), trim()

### Community 79 - "pond/art.ts"
Cohesion: 0.17
Nodes (20): ArtByRoom, blank(), colorAt(), disposePondArt(), EDGE_BAND, EDGE_BANDS, EDGE_OVERLAP, edgeTexture() (+12 more)

### Community 80 - "createPresence"
Cohesion: 0.19
Nodes (13): createPresence(), drop(), heartbeat(), maybeSend(), onPageHide(), receive(), scheduleRetry(), send() (+5 more)

### Community 81 - "members"
Cohesion: 0.12
Nodes (25): coin_claims, coin_claims_daily, wallet_bait, wallet_items, wallets, member_sessions, member_sessions_member, member_slots (+17 more)

### Community 82 - "Frame Window Asset"
Cohesion: 0.50
Nodes (4): frame, size, window, windowAspect

### Community 83 - "wander.ts"
Cohesion: 0.17
Nodes (28): along(), beginNext(), beginWork(), between(), blockedAt(), chooseStop(), clamp(), doorsIn() (+20 more)

### Community 84 - "presence/package.json"
Cohesion: 0.14
Nodes (16): dependencies, @tiny/core@*, devDependencies, @cloudflare/workers-types@5.20261016.1, wrangler@4.151.1, @tiny/core, name, private (+8 more)

### Community 85 - "createAtelierRoom"
Cohesion: 0.29
Nodes (20): aspectOf(), createAtelierRoom(), buildCollection(), form(), buildEntrance(), buildMirror(), buildRoom(), buildWardrobe() (+12 more)

### Community 86 - "Asset pipeline: fast loading without losing sharpness"
Cohesion: 0.22
Nodes (8): Asset pipeline: fast loading without losing sharpness, Character rigs and the Costume Atelier, Completed, Ground rules, Phase 1: fingerprinted files at 2x and 3x, Phase 2: texture atlases for the hall sprites, Phase 3: KTX2 (Basis Universal), built and switched off, Phase 4: ThumbHash placeholders for paintings

### Community 87 - "Guest Board SQL Schema"
Cohesion: 0.67
Nodes (3): guest_notes, guest_notes_visible, rate_limits

### Community 88 - "Landscape Frame Asset"
Cohesion: 0.67
Nodes (3): frameLandscape, size, window

### Community 89 - "names.ts"
Cohesion: 0.31
Nodes (7): checkMessage(), INVISIBLE, MESSAGE_MAX, MessageCheck, normalizeMessage(), hasProfanity(), matcher

### Community 93 - "json"
Cohesion: 0.09
Nodes (60): POST(), PER_MEMBER, PUT(), POST(), POST(), POST(), PER_MEMBER, PUT() (+52 more)

### Community 94 - "CharacterKind"
Cohesion: 0.12
Nodes (19): Props, MIRROR_SRC, MirrorView(), move(), onKeyDown(), onPointerUp(), Props, CollectionRoom (+11 more)

### Community 95 - "pond/room.ts"
Cohesion: 0.11
Nodes (26): FAR_LIFT, FAR_SCALE, liftAt(), pathHalfWidth(), pathX(), PondPath, PROP_DEPTH, scaleAt() (+18 more)

### Community 96 - "members.ts"
Cohesion: 0.08
Nodes (48): GET(), GET(), PER_IP, POST(), presenceUrl(), memberFromRequest(), Code, 3.2 Chosen names (members) (+40 more)

### Community 104 - "MuseumStage.tsx"
Cohesion: 0.14
Nodes (9): MuseumLayout(), ActiveRoom, MuseumStage(), RoomOptions, StageContext, StageContextValue, Stage, StageHandlers (+1 more)

### Community 105 - "FishingView.tsx"
Cohesion: 0.13
Nodes (13): CONFETTI_COLORS, ConfettiPiece, makeConfetti(), RevealCard(), TIER_MS, TIER_SFX, useCountUp(), AudioContextClass (+5 more)

### Community 106 - "ticket.ts"
Cohesion: 0.23
Nodes (12): decoder, encoder, fromBase64Url(), HmacKey, isOwn(), isTicket(), keyFor(), keys (+4 more)

### Community 107 - "bug-reports.ts"
Cohesion: 0.19
Nodes (13): BugReport, BugReportDto, BugReportRejected, BugRow, CONTEXT_KEYS, countOpenBugReports(), EVERYONE, normalizeBugPage() (+5 more)

### Community 108 - "reveal.ts"
Cohesion: 0.14
Nodes (12): PlaceInfo, openingPlan(), prepareSketchGame(), InkMap, planGame(), randomRound(), ROUND_SPREAD, createReveal() (+4 more)

### Community 109 - "hit.ts"
Cohesion: 0.17
Nodes (12): CoinWall, createHiddenCoin(), Spot, AlphaMap, alphaMapFor(), alphaMaps, buildAlphaMap(), isPaintedAt() (+4 more)

### Community 110 - "graftCostume"
Cohesion: 0.27
Nodes (14): canvasFit(), compose(), graftCostume(), copyAccessor(), copyMaterial(), copyMesh(), copyTexture(), copyView() (+6 more)

### Community 111 - "pondgame/lib/api.ts"
Cohesion: 0.15
Nodes (28): CAST_ERRORS, coarsePointer(), FishingView(), initialEasyReel(), isTyping(), LOST, PondGameProps, Toast (+20 more)

### Community 112 - "worker/tsconfig.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 113 - "core/tsconfig.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 114 - "Atelier: the dressing mirror, and show-don't-tell keeping"
Cohesion: 0.14
Nodes (13): Atelier: the dressing mirror, and show-don't-tell keeping, Build order, Built (2026-11-20), Decisions (2026-11-19), Goal, In the room, Keeping, Later phases (not this plan) (+5 more)

### Community 115 - "How to Design for Failures — ByteByteGo Newsletter"
Cohesion: 0.40
Nodes (4): How to Design for Failures — ByteByteGo Newsletter, Preview, What the article covers, Where the paywall starts

### Community 116 - "Worker instructions — DSH headless agents"
Cohesion: 0.40
Nodes (4): graphify-first codebase navigation, Keep the graph current, Product and design direction, Worker instructions — DSH headless agents

### Community 117 - "Backend"
Cohesion: 0.50
Nodes (3): AWS prerequisites, Backend, Deploying by hand

### Community 118 - "protocol.ts"
Cohesion: 0.19
Nodes (18): fetch(), Env, isItem(), isName(), isPid(), isSeq(), MAX_HOLDS, MAX_MESSAGE_BYTES (+10 more)

### Community 119 - "Costume gallery doorway"
Cohesion: 0.50
Nodes (3): Costume gallery doorway, Curtain colour edit, Prompt

### Community 120 - "useBackgroundMusic.ts"
Cohesion: 0.17
Nodes (10): BackgroundMusic, clampVolume(), isDocumentHidden(), Options, useBackgroundMusic(), VISIBILITY_EVENTS, isRouted(), setGainLevel() (+2 more)

### Community 121 - "Fishing forest: painted asset pass"
Cohesion: 0.10
Nodes (18): Assets, Bruce's collection refresh (2026-11-08), Fishing forest illustrations, Made by hand (not touched by the script), Main hall v2 (2026-11-10), Monets Lily Pond (2026-11-08), 1. Forest doorway, 2. Woodland noticeboard (+10 more)

### Community 124 - "The Costume Atelier"
Cohesion: 0.14
Nodes (13): Adding a character, Adding a costume, Art not supplied as files, Bruce's Chronicles, Checked against the mocks (2026-11-07), Code, Costume fit review, Floral collection (+5 more)

### Community 125 - "Confirmed issues"
Cohesion: 0.11
Nodes (18): Confirmed issues, E2E-002 — Valid edge placement rejected through floating-point precision, E2E-003 — One owned prop can be placed multiple times, E2E-004 — Reload before autosave silently loses the latest placement, E2E-005 — Failed save and failed Done have no visible mobile explanation, E2E-006 — Restoring connectivity does not retry a failed draft save, E2E-007 — Keyboard activation cannot place drawer items, E2E-008 — Creating an account from My Room leaves the signed-in user on the sign-in prompt (+10 more)

### Community 126 - "rig.ts"
Cohesion: 0.14
Nodes (25): loadKind(), setFrame(), follow(), canvasToModel(), disposeRigLayer(), Frame, layerTemplates, loadRig() (+17 more)

### Community 127 - "Curating the paintings (2026-11-07)"
Cohesion: 0.13
Nodes (14): 1. The registry and the table, 2. The studio's Location picker, 3. The rooms draw what is placed, 4. Credits, 5. Retiring self-serve artists, Building it, Curating the paintings (2026-11-07), Decided (+6 more)

### Community 128 - "hitForVisitor"
Cohesion: 0.09
Nodes (35): POST(), ALLOWED, PER_VISITOR, POST(), POST(), POST(), GLOBAL, PER_IP (+27 more)

### Community 129 - "presence/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, types, exclude, extends, include, ../../tsconfig.base.json

### Community 130 - "run.ts"
Cohesion: 0.17
Nodes (9): admin, childEnv, client, database, fresh, migrations, target, pg@^8.13.1 (+1 more)

### Community 131 - "tsconfig.test.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 132 - "app/layout.tsx"
Cohesion: 0.13
Nodes (16): bethEllen, inspiratiq, metadata, notoSans, RootLayout(), sniglet, viewport, ServiceWorker() (+8 more)

### Community 133 - "ColorRecall.tsx"
Cohesion: 0.20
Nodes (16): ColorRecall(), ColorRecallProps, Phase, readBest(), showMs(), undoAdminUnlock(), loadColorRecall(), saveIfHigher() (+8 more)

### Community 134 - "peers.ts"
Cohesion: 0.14
Nodes (7): INTERPOLATION_DELAY_MS, PEER_TIMEOUT_MS, PeerTable, positionAt(), Sample, look, Peer

### Community 135 - "gallery.ts"
Cohesion: 0.09
Nodes (32): listPieces(), pieceImageUrl(), PieceRow, toPieceDto(), EpochRow, GalleryRow, planSketchRound(), SKETCH_CHOICES (+24 more)

### Community 136 - "bug-reports.ts"
Cohesion: 0.20
Nodes (15): BugReportHost(), BugReportSheet, BugReportSheet(), send(), Status, collectContext(), inAppBrowser(), onOpenBugReport() (+7 more)

### Community 137 - "npc-layer.ts"
Cohesion: 0.19
Nodes (20): castMember(), createNpcLayer(), createResidentView(), createView(), departedRecently(), draw(), fadeOut(), glyphWidth() (+12 more)

### Community 138 - "SoundProvider.tsx"
Cohesion: 0.21
Nodes (10): state(), SoundContext, SoundProvider(), VisitTracker(), isPublicPage(), STATIC_BASE, staticUrl(), flush() (+2 more)

### Community 139 - "room-places.ts"
Cohesion: 0.15
Nodes (23): atelierRoomInfo(), atelierX(), copy(), FurniturePlacement, hallCache, hallRoomInfo(), onGround(), PERSONAL_FURNITURE (+15 more)

### Community 140 - "Conn"
Cohesion: 0.31
Nodes (4): connectWebSocket(), SocketHandlers, Conn, message()

### Community 141 - "db-tests/pond.test.ts"
Cohesion: 0.16
Nodes (10): CatchExtra, clearCatches(), COLUMNS, grantPearls(), insertCatch(), member(), namedMember(), randomId() (+2 more)

### Community 142 - "createRemoteVisitors"
Cohesion: 0.21
Nodes (10): createRenderer(), createRigLayer(), createRemoteVisitors(), ensureLayer(), load(), placeOwn(), show(), showProp() (+2 more)

### Community 143 - "rooms/art.ts"
Cohesion: 0.18
Nodes (11): AtelierArt, loadGalleryDoor(), loadGalleryPillar(), loadImage(), AtelierArtwork, HallArt, PersonalArt, ROOM_ART (+3 more)

### Community 144 - "The Moonlit Pond — design"
Cohesion: 0.09
Nodes (22): Art the pond needs from the artist, Build contract (decided 2026-11-07), Build phases, Collection and goals, Done, Done, Guardrails, Leaderboards (+14 more)

### Community 145 - "Pond rework"
Cohesion: 0.18
Nodes (10): Baits, Client, Decisions, Done, Notes, Pond rework, Server, Species (+2 more)

### Community 146 - "dependencies"
Cohesion: 0.15
Nodes (13): dependencies, @aws-sdk/client-s3@^3.1121.0, @aws-sdk/s3-request-presigner@^3.1121.0, bcryptjs@^2.4.3, obscenity@^0.4.6, sharp@^0.33.5, thumbhash@^0.1.1, sharp (+5 more)

### Community 147 - "Orchestration contract — you plan, DSH workers execute"
Cohesion: 0.29
Nodes (6): Briefing a worker, Budget hygiene, graphify, Orchestration contract — you plan, DSH workers execute, The worker, When not to delegate

### Community 148 - "tables.ts"
Cohesion: 0.09
Nodes (40): FrameShape, BaitTray(), BaitTrayProps, RevealCardProps, PondCatch, CatchView, debugSpecies(), debugVariant() (+32 more)

### Community 149 - "infra/jobs.ts"
Cohesion: 0.22
Nodes (16): loop(), shutdown(), sleep(), sweepStale(), DrainResult, handler(), repairFrames(), repairUnframed() (+8 more)

### Community 150 - "exports"
Cohesion: 0.15
Nodes (13): exports, ./brand, ./bugs, ./economy, ./guestboard, ./presence, ./presence/messages, ./presence/wire (+5 more)

### Community 151 - "pond-state.ts"
Cohesion: 0.25
Nodes (14): PondStateView, PondTier, ensurePondStateStarted(), getPondStateSnapshot(), GUEST, listeners, LOADING, PondStateSnapshot (+6 more)

### Community 154 - "visits/page.tsx"
Cohesion: 0.27
Nodes (9): amount(), duration(), dynamic, LANDMARKS, PAGES, RANGES, share(), VisitsPage() (+1 more)

### Community 155 - "performance/page.tsx"
Cohesion: 0.27
Nodes (9): dynamic, format(), grade(), METRICS, PAGES, PerformancePage(), RANGES, summarizeVitals() (+1 more)

### Community 156 - "Your Room: a room you can freely furnish"
Cohesion: 0.15
Nodes (12): Admin mode (gamma), Catalogue, Data model (core), Decisions (2026-11-17, with the user), Editor (web, `features/rooms/decorate/*`, `PersonalRoom.tsx`), Room look (web, `features/rooms/themes/cozy.ts`, `features/rooms/personal/room.ts`), Scale, Testing locally (+4 more)

### Community 157 - "Walkthrough.tsx"
Cohesion: 0.11
Nodes (24): BACKDROP_STYLE, MoreArrow(), NavArrow(), Props, SLIDE, Walkthrough(), XIcon(), decodedFrames (+16 more)

### Community 158 - "createPondRoom"
Cohesion: 0.32
Nodes (13): createPondRoom(), approach(), busy(), finishWalk(), goTo(), leave(), move(), nearest() (+5 more)

### Community 159 - "useSoundEffects.ts"
Cohesion: 0.18
Nodes (17): EFFECTS, EffectSpec, FOOTSTEPS, SoundEffects, useSoundEffects(), gestured(), OPTIONS, applyMix() (+9 more)

### Community 160 - ".webSocketMessage"
Cohesion: 0.44
Nodes (3): attachmentOf(), Room, sendTo()

### Community 161 - "LandingFx"
Cohesion: 0.15
Nodes (14): between(), CAT, Edge, EDGES, runLandingCat(), choosePeeker(), peek(), glowSprite() (+6 more)

### Community 162 - "import-landing-assets.mjs"
Cohesion: 0.18
Nodes (8): CAT, drop, EXPECTED, manifest, manifestPath, masters, root, target

### Community 163 - "painting-open"
Cohesion: 0.50
Nodes (4): file, kilobytes, seconds, painting-open

### Community 164 - "CrowdPreview.tsx"
Cohesion: 0.29
Nodes (8): CrowdPreviewPage(), CrowdPreview(), draw(), KINDS, Stats, Window, clearRigLayer(), layer()

### Community 165 - "Multiplayer ("other visitors") — plan v2 (Cloudflare)"
Cohesion: 0.14
Nodes (13): 0. Summary, 10. Decisions, 1. Product contract changes (approved 2026-10-31), 2. What already exists that this builds on, 3.1 Generated names (everyone has one), 3. Names, 5.1 Emotes (v1), 5. Protocol (`packages/core/src/presence/protocol.ts`) (+5 more)

### Community 167 - "SoundProvider.tsx"
Cohesion: 0.33
Nodes (4): StageOptions, RoomSound, SoundState, EffectName

### Community 168 - "confirm/page.tsx"
Cohesion: 0.33
Nodes (7): ConfirmFollow(), dynamic, dynamic, Unsubscribe(), FollowNotice(), confirmFollow(), unsubscribe()

### Community 169 - "icon-basket"
Cohesion: 0.67
Nodes (3): icon-basket, file, vector

### Community 170 - "query"
Cohesion: 0.16
Nodes (19): SliceRow, deletePiece(), GalleryPiece, hangPiece(), MAX_STANDS, movePiece(), unhangPiece(), publishArtist() (+11 more)

### Community 171 - "visits.ts"
Cohesion: 0.17
Nodes (19): PER_VISITOR, POST(), VisitState, count(), currentSalts(), DEVICES, loadSalts(), parseVisitReport() (+11 more)

### Community 172 - "shopkeeper.ts"
Cohesion: 0.25
Nodes (7): RigPiece, COATS, createShopkeeper(), GREETINGS, OUTFIT, recolourFur(), SHOPKEEPER_NAME

### Community 174 - "4. Transport: Cloudflare Durable Objects"
Cohesion: 0.25
Nodes (8): 4. Transport: Cloudflare Durable Objects, Decision (2026-10-31), Deploying, Identity cannot be forged, Local development and tests, Rooms and capacity, Shape of `apps/presence` (about 200 lines), main()

### Community 176 - "logic.ts"
Cohesion: 0.06
Nodes (45): loadHallArranger(), DecorDrawer, DecorDrawerProps, SharingState, SLOT_LABELS, Tab, TABS, HallArranger() (+37 more)

### Community 179 - "createPersonalRoom"
Cohesion: 0.31
Nodes (8): aspectOf(), createPlacementLayer(), drawOutline(), dropGhosts(), dropHelper(), extrasFor(), silhouette(), sizeOf()

### Community 180 - "BunnyArtist.tsx"
Cohesion: 0.13
Nodes (16): walk(), BunnyArtist(), BunnyMood, Pencil(), POSES, 1. What is in this bundle, 3. The rig, 4. Suggested plan (+8 more)

### Community 182 - "schedule.test.ts"
Cohesion: 0.09
Nodes (20): RESIDENT_IDS, JOBS, NpcGround, PlaceKind, ROOM_KINDS, ROOMS, PlaceInput, NpcRoom (+12 more)

### Community 183 - "Storyline (draft, saved 2026-11-17)"
Cohesion: 0.18
Nodes (10): Arc (soft, no fail state), Built so far, How it ties to what exists, Mystery hook, Next tasks (when picked up), Open questions, Premise, Seed (the owner's words) (+2 more)

### Community 184 - "PondTicker.tsx"
Cohesion: 0.29
Nodes (11): fetchPondFeed(), PondFeedItem, catchLabel(), formatSizeCm(), speciesFor(), speciesName(), speciesTier(), isGolden() (+3 more)

### Community 185 - "hall/room.ts"
Cohesion: 0.06
Nodes (46): Assets, Scenery, CUTS, disposeBoards(), Mark, plane(), ROPE_CUTS, ropeSlices() (+38 more)

### Community 186 - "Low"
Cohesion: 0.10
Nodes (20): 10. Long names run off the name sign, 11. The rooms API skips the stale-tab member check, 12. The bunny is dragged along while you pan in Decorate, 13. Pages that redirect or don't exist answer 200, 14. Error codes reveal which room slugs exist, 15. The name sign slides under the top-right buttons in Decorate, 16. Level-up celebrations can be farmed, 17. No hint of where things are after panning away (+12 more)

### Community 187 - "AccountSheet"
Cohesion: 0.29
Nodes (9): AccountSheet(), continueAnyway(), doSignOut(), runDelete(), runName(), submit(), submitDelete(), submitName() (+1 more)

### Community 189 - "epoch.ts"
Cohesion: 0.21
Nodes (15): GET(), intParam(), GET(), sketchPool, unavailable(), EMPTY, firstSlice(), memo (+7 more)

### Community 190 - "BountyPanel.tsx"
Cohesion: 0.18
Nodes (20): refreshWalletNow(), GLYPHS, PearlIcon(), POND_CRIMSON, PondIconName, fetchPondBounties(), PondBounties, formatInteger() (+12 more)

### Community 191 - "Item"
Cohesion: 0.13
Nodes (6): PresencePreviewPage(), PresencePreview(), RemoteVisitor, Presence, RemoteVisitors, Item

### Community 192 - "perf.ts"
Cohesion: 0.22
Nodes (4): createPerfMeter(), isEnabled(), PerfMeter, PerfSnapshot

### Community 193 - "Monets Lily Pond: exploration, UX and multiplayer QA"
Cohesion: 0.29
Nodes (6): Browser and interaction coverage, Changes made from the walkthrough, Monets Lily Pond: exploration, UX and multiplayer QA, Multiplayer and load, Practical limits, Regression checks and cleanup

### Community 195 - "High"
Cohesion: 0.33
Nodes (6): 1. Items placed against a zone edge fail to save, and the whole draft reverts, 2. One owned item can be placed many times, 3. Any save rejection throws away all unsaved work, 4. Changes made just before leaving are lost, 5. Fish trophies can be claimed without playing, High

### Community 196 - "import-hall-assets.mjs"
Cohesion: 0.06
Nodes (28): BASEBOARD, CURTAIN, drop, EXPECTED, file(), manifest, manifestPath, masters (+20 more)

### Community 197 - "pond-api.ts"
Cohesion: 0.25
Nodes (18): buyPondBait(), claimPondBounty(), errorOf(), exchangePondPearls(), fetchPondDex(), fetchPondLeaderboard(), fetchPondState(), isRecord() (+10 more)

### Community 198 - "AccountSheet.tsx"
Cohesion: 0.09
Nodes (18): AccountHost(), AccountSheet, NAME_ERRORS, Pending, View, KeepOnOtherDevices(), AccountMode, onOpenAccount() (+10 more)

### Community 199 - "Local end-to-end stress test — 2026-11-06"
Cohesion: 0.22
Nodes (7): Environment and coverage, Follow-up coverage, Issue index, Local end-to-end stress test — 2026-11-06, Measured load, Passing checks and interpretation limits, Test data and cleanup

### Community 200 - "Atelier: the dressing mirror, and show-don't-tell keeping"
Cohesion: 0.12
Nodes (8): CARD, createHangTag(), HangTag, HangTagStyle, HOLE, KNOT, What goes, and what replaces it, Refusal

### Community 201 - "setCostumeVisibility"
Cohesion: 0.50
Nodes (3): Layer, setCostumeVisibility(), setCostume()

### Community 204 - "Other visitors"
Cohesion: 0.29
Nodes (6): How it plays, Other visitors, Privacy, Running it in production, Running it locally, Staying consistent

### Community 205 - "master"
Cohesion: 0.32
Nodes (7): paintedCostume(), floralOutfits(), goldOutfits(), master(), placed(), Fitting clothes to other characters, Headpieces

### Community 206 - "media/storage.ts"
Cohesion: 0.08
Nodes (22): CONTENT_TYPES, GET(), POST(), UPLOADS_PER_ARTIST, PUT(), isHttpUrl(), ACCEPTED, createAssetFromUpload() (+14 more)

### Community 207 - "rooms.ts"
Cohesion: 0.12
Nodes (37): artist(), member(), piece(), randomId(), sealEpoch(), discardLocation(), hasUnpublished(), locationStates() (+29 more)

### Community 208 - "mutation-guard.ts"
Cohesion: 0.67
Nodes (3): allowedOrigin(), isSameOriginMutation(), LOOPBACK

### Community 209 - "vitals.ts"
Cohesion: 0.36
Nodes (6): DEVICES, METRICS, normalizePage(), parseVitalsReport(), RATINGS, VitalRow

### Community 210 - "PondRoom.tsx"
Cohesion: 0.11
Nodes (21): Loading(), metadata, PondPage(), POND_NAME, FishmongerPanel(), PondLoading(), BOARD_TABS, PondOverlayKind (+13 more)

### Community 211 - "darknessAt"
Cohesion: 0.11
Nodes (18): ceilingGeometry(), CozyBackdrop, createCozyBackdrop(), clearGlows(), glow(), paintShade(), placeGlows(), placeSides() (+10 more)

### Community 219 - "createDecorController"
Cohesion: 0.67
Nodes (4): createDecorController(), canvasRect(), targetRise(), toScreen()

## Knowledge Gaps
- **5 isolated node(s):** `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1556 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **29 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `SketchGuess.tsx`, `lib/assets.ts`, `ColorRecall.tsx`, `app/layout.tsx`, `bug-reports.ts`, `SoundProvider.tsx`, `Museum.tsx`, `Test Fakes and Helpers`, `features/economy/index.ts`, `room-events.ts`, `PersonalRoom.tsx`, `tables.ts`, `pond-state.ts`, `wardrobe.ts`, `ClosetView.tsx`, `LeaderboardPanel.tsx`, `Walkthrough.tsx`, `Web Package Dependencies`, `useSoundEffects.ts`, `LandingFx`, `risk.ts`, `CrowdPreview.tsx`, `actions.ts`, `audience.ts`, `logic.ts`, `slots/store.ts`, `Water.tsx`, `SlotDef`, `PondTicker.tsx`, `pond-format.ts`, `BountyPanel.tsx`, `Item`, `domain/guestboard.ts`, `createStage`, `currentMember`, `AccountSheet.tsx`, `remote-visitors.ts`, `PondRoom.tsx`, `CharacterKind`, `MuseumStage.tsx`, `FishingView.tsx`, `pondgame/lib/api.ts`, `useBackgroundMusic.ts`?**
  _High betweenness centrality (0.089) - this node is a cross-community bridge._
- **What connects `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json` to the rest of the system?**
  _5 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `MuseumStage.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.059233449477351915 - nodes in this community are weakly interconnected._
- **Why does `three` connect `remote-visitors.ts` to `scene/assets.ts`, `scene.ts`, `cozy.ts`, `rooms/art.ts`, `wardrobe.ts`, `ambience.ts`, `Web Package Dependencies`, `atelier.ts`, `npc-layer.ts`, `hall/room.ts`, `perf.ts`, `scene/ambience.ts`, `Atelier: the dressing mirror, and show-don't-tell keeping`, `remote-visitors.ts`, `master`, `pond/art.ts`, `pond/room.ts`, `hit.ts`, `rig.ts`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **Should `SketchGuess.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09176788124156546 - nodes in this community are weakly interconnected._
- **Why does `defaultStore()` connect `wardrobe.ts` to `remote-visitors.ts`, `createStage`, `pond-api.ts`, `currentMember`, `ColorRecall.tsx`, `AccountSheet.tsx`, `SyncStore`, `pondgame/lib/api.ts`, `room-events.ts`, `createHallRoom`, `slots/store.ts`, `PersonalRoom.tsx`, `SlotDef`, `pond-state.ts`, `hall/room.ts`, `economy/store.ts`, `createPondRoom`, `pond/room.ts`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Should `themes.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05837173579109063 - nodes in this community are weakly interconnected._