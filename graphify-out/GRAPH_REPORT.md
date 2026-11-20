# Graph Report - tiny-museum  (2026-11-19)

## Corpus Check
- 539 files · ~327,219 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 95 file(s) not represented in the graph (top: .avif 52, .glb 34, .css 4)

## Summary
- 4856 nodes · 12584 edges · 221 communities (194 shown, 27 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 249 edges (avg confidence: 0.89)
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
- gallery/page.tsx
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
- a/[slug]/page.tsx
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
- art-cache.ts
- Custom HTTP Headers
- Sharp Layer Package
- currentMember
- scene/ambience.ts
- layout.ts
- RigPreview.tsx
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
- ClosetView.tsx
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
- Context
- Fishing forest: painted asset pass
- audio/README.md
- .claude/CLAUDE.md
- The Costume Atelier
- Confirmed issues
- rig.ts
- Curating the paintings (2026-11-07)
- hitForVisitor
- presence/tsconfig.json
- catalog.ts
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
- AssetImage
- createRemoteVisitors
- stage.ts
- The Moonlit Pond — design
- Pond rework
- createStage
- Orchestration contract — you plan, DSH workers execute
- tables.ts
- infra/jobs.ts
- wallet/body.ts
- pond-state.ts
- tab-turn.ts
- AtelierRoom
- visits/page.tsx
- performance/page.tsx
- Your Room: a room you can freely furnish
- Walkthrough.tsx
- createPondRoom
- useSoundEffects.ts
- .webSocketMessage
- LandingFx
- env.ts
- painting-open
- CrowdPreview.tsx
- Multiplayer ("other visitors") — plan v2 (Cloudflare)
- Lobby
- assetUrl
- confirm/page.tsx
- icon-basket
- query
- visits.ts
- shopkeeper.ts
- bunny-left
- outbox.test.ts
- bunny-right
- DecorDrawer.tsx
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
- locations.ts
- draw.py
- app/page.tsx
- BountyPanel.tsx
- Item
- perf.ts
- Monets Lily Pond: exploration, UX and multiplayer QA
- remote-visitors.ts
- createRigState
- import-hall-assets.mjs
- pond-api.ts
- AccountSheet.tsx
- Local end-to-end stress test — 2026-11-06
- Atelier: the dressing mirror, and show-don't-tell keeping
- Tasks
- import-home-assets.mjs
- npcs/README.md
- Other visitors
- nearby.ts
- media/storage.ts
- rooms.ts
- revealFloorTransition
- GameDesktop.tsx
- PondRoom.tsx
- createCozyBackdrop
- next
- HallArranger.tsx
- VitalsReporter.tsx
- darknessAt
- share.ts
- Tiny Museum
- Sitting
- CozyBackdrop
- LiveReflection

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
- `E2E-001 — Alternate local origin breaks artwork fallback URLs` --references--> `sameOriginUrl()`  [INFERRED]
  docs/testing/local-e2e-stress-2026-11-06.md → apps/web/src/features/hall/lib/media.ts
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

## Communities (221 total, 27 thin omitted)

### Community 0 - "MuseumStage.tsx"
Cohesion: 0.06
Nodes (16): CameraRig, Pose, Room, Entry, Floor, Frame, Interaction, JoinedContents (+8 more)

### Community 1 - "Walker"
Cohesion: 0.17
Nodes (4): PondPlaceData, FloorPoint, WalkArea, Walker

### Community 2 - "SketchGuess.tsx"
Cohesion: 0.12
Nodes (27): bestKeyFor(), BURST, clueUrl(), openingPlan(), Phase, pickAtRandom(), prepareSketchGame(), readDifficulty() (+19 more)

### Community 3 - "themes.ts"
Cohesion: 0.06
Nodes (37): Catalogue, Data model (core), 1. Items placed against a zone edge fail to save, and the whole draft reverts, 2. One owned item can be placed many times, 3. Any save rejection throws away all unsaved work, 4. Changes made just before leaving are lost, 5. Fish trophies can be claimed without playing, High (+29 more)

### Community 4 - "lib/assets.ts"
Cohesion: 0.13
Nodes (21): Loading(), DENSITY_MEDIA, HallPreload(), HallSkeleton(), AtelierImage, PICTURE, pieceUrl(), assetCssVariables() (+13 more)

### Community 5 - "round.ts"
Cohesion: 0.16
Nodes (26): deltaE(), GAMUT_EPSILON, hexToOklab(), inGamut(), linearRgbToOklab(), linearToSrgb(), Oklab, oklabToLinearRgb() (+18 more)

### Community 6 - "floor.ts"
Cohesion: 0.13
Nodes (34): clone(), closestOnSegment(), contains(), cross(), crossVec(), depthAtY(), depthBounds(), depthT() (+26 more)

### Community 7 - "Core Asset Manifest"
Cohesion: 0.05
Nodes (41): artworks, audio, file, megabytes, seconds, sourceName, startedAt, bunny (+33 more)

### Community 8 - "scene/assets.ts"
Cohesion: 0.09
Nodes (39): AssetManifest, assetUrl(), bitmapTexture(), blankImage(), CAFE_CAT_FRAMES, CharacterSprites, CompressedLoader, elementTexture() (+31 more)

### Community 9 - "SyncStore"
Cohesion: 0.17
Nodes (6): encodeStored(), parseStored(), readStored(), writeStored(), SyncStore, upgrade()

### Community 10 - "machine.ts"
Cohesion: 0.10
Nodes (49): CAST_ERRORS, coarsePointer(), FishingView(), initialEasyReel(), isTyping(), LOST, Toast, vibrate() (+41 more)

### Community 11 - "Museum.tsx"
Cohesion: 0.16
Nodes (23): PinnedNotes(), CoinFound, ColorRecall, GameDesktop, GuestBoard, HallArranger, HelpGuide, loadCoinFound() (+15 more)

### Community 12 - "Test Fakes and Helpers"
Cohesion: 0.10
Nodes (27): deferredFetch(), deviceSlot, FakeEvents, FakeStorage, fixture, fixtureB, fixtureRegistry, fixtureRegistryBoth (+19 more)

### Community 13 - "scene.ts"
Cohesion: 0.05
Nodes (30): disposeDisplayTexture(), HELM_PEDESTAL_FILE, prefersAvif(), HiddenCoin, createNotes(), createPedestal(), Notes, Pedestal (+22 more)

### Community 14 - "cozy.ts"
Cohesion: 0.08
Nodes (30): ATELIER_PROPS, AtelierImage, atticWindowCanvas(), bareBulbCanvas(), boardsCanvas(), cobwebCanvas(), cozyFinishImageUrl(), creamCanvas() (+22 more)

### Community 15 - "features/economy/index.ts"
Cohesion: 0.08
Nodes (41): MuseumLayout(), CoinToast(), Toast, Purse(), Stamp(), WalletProvider(), serverSnapshot, useEarnEvents() (+33 more)

### Community 16 - "room-events.ts"
Cohesion: 0.17
Nodes (28): ChatButton(), REFUSED, joinRoom(), Options, STANDING, emit(), getPeople(), isInRoom() (+20 more)

### Community 17 - "schedule.ts"
Cohesion: 0.08
Nodes (54): addDwellEmotes(), addEmote(), addGap(), addStand(), addWalk(), along(), buildRoomTable(), buildStayPlan() (+46 more)

### Community 18 - "ref_node_assert"
Cohesion: 0.12
Nodes (28): defineSlot(), docBytes(), SLOTS, byAtThenKey(), encoded(), latest, mapOf(), maxNumber() (+20 more)

### Community 19 - "amplify/package.json"
Cohesion: 0.08
Nodes (26): amplifyDir, backend, everyMinutes, mediaBucket, missing, repoRoot, REQUIRED, setting() (+18 more)

### Community 20 - "PersonalRoom.tsx"
Cohesion: 0.07
Nodes (67): errorReason(), Offer, overDrawer(), PersonalRoom(), canPlaceNew(), carriedTo(), carryEnd(), carryMove() (+59 more)

### Community 21 - "prepare-models.mjs"
Cohesion: 0.10
Nodes (26): paintedCostume(), BODIES, bruce, BRUCE_FIT, BRUCE_PLACE, bunny, CARDIGAN_TIE, CROWN (+18 more)

### Community 22 - "Traversal"
Cohesion: 0.11
Nodes (5): JumpPose, clamp(), fixture(), jump(), Traversal

### Community 23 - "core/package.json"
Cohesion: 0.06
Nodes (40): dependencies, @aws-sdk/client-s3@^3.1121.0, @aws-sdk/s3-request-presigner@^3.1121.0, bcryptjs@^2.4.3, obscenity@^0.4.6, pg@^8.13.1, sharp@^0.33.5, thumbhash@^0.1.1 (+32 more)

### Community 24 - "wardrobe.ts"
Cohesion: 0.07
Nodes (50): AtelierPage(), dynamic, metadata, allowedCharacter(), OwnedSnapshot, owns(), walletReady(), getWalletSnapshot() (+42 more)

### Community 25 - "Placement"
Cohesion: 0.09
Nodes (8): Carry, PersonalRoomProps, DecorLive, GhostOptions, PlacementLayer, PlacementTheme, The closet: where every room starts (2026-11-17), Placement

### Community 26 - "gallery/page.tsx"
Cohesion: 0.10
Nodes (33): AnalyticsPage(), dynamic, dynamic, GalleryPage(), createCodeAction(), deleteCodeAction(), hangAction(), movePieceAction() (+25 more)

### Community 27 - "LeaderboardPanel.tsx"
Cohesion: 0.25
Nodes (14): PondBoardId, PondBoardPeriod, PondBoardRow, PondLeaderboard, formatInteger(), formatOdds(), nextMondayUtc(), BoardRow() (+6 more)

### Community 28 - "ambience.ts"
Cohesion: 0.12
Nodes (29): blade(), bloom(), BLOOMS, createPondAmbience(), update(), fishTexture(), frond(), FRONT_ROWS (+21 more)

### Community 29 - "core/src/index.ts"
Cohesion: 0.04
Nodes (105): CatchExtra, COLUMNS, insertCatch(), member(), namedMember(), randomId(), StatePatch, addBait() (+97 more)

### Community 30 - "Web Package Dependencies"
Cohesion: 0.07
Nodes (33): dependencies, embla-carousel-react@^8.6.0, motion@^13.1.1, next@^15.0.3, react@^19.0.0, react-dom@^19.0.0, swr@^2.5.1, three@^0.169.0 (+25 more)

### Community 31 - "Gamifying Tiny Museum — genre direction & engagement research"
Cohesion: 0.10
Nodes (19): 0.1 The core experience, 0.2 Systems that make gamification cheap to build, 0.3 Constraints that shape any recommendation, 0. What the game is today (the deep dive), 1.1 The landscape (seven candidates, with verdicts), 1.2 Recommendation: a **cozy gallery life-sim** — "the gallery you live in", 1.3 The five design pillars the genre implies, 1. Genre direction (+11 more)

### Community 32 - "atelier.ts"
Cohesion: 0.06
Nodes (36): AtelierActions, AtelierArt, AtelierImage, BuiltRoom, Cardigan, CARDIGAN_NAMES, Control, refresh() (+28 more)

### Community 33 - "remote-visitors.ts"
Cohesion: 0.05
Nodes (31): Scenery, ENTRANCE, Cafe, CafeMarks, Attachment, Carried, CarriedState, createCarried() (+23 more)

### Community 34 - "risk.ts"
Cohesion: 0.12
Nodes (31): HudProps, HudWagerChip, WagerPicker(), chooseTier(), WagerPickerProps, CastOptions, PondStateView, PondWagerView (+23 more)

### Community 35 - "amplify/tsconfig.json"
Cohesion: 0.20
Nodes (9): compilerOptions, module, moduleResolution, noUnusedLocals, noUnusedParameters, exclude, extends, include (+1 more)

### Community 36 - "5. Customization menu — what other people are doing"
Cohesion: 0.12
Nodes (16): 1. The target: what "Claude Opus 5.5" actually means, 2. Where your harness stands today (live config I read), 3. The honest gap model, 4. Quality levers, ranked by leverage, 5. Customization menu — what other people are doing, 6. Recommended starting kit for *your* profile, 7. What I can apply for you right now (needs your go-ahead), A. Prompt & persona (most common quality customizations) (+8 more)

### Community 37 - "wallet.ts"
Cohesion: 0.06
Nodes (51): member(), now, piece(), randomId(), today, baitOf(), applyClaim(), baitCounts() (+43 more)

### Community 38 - "handlers.ts"
Cohesion: 0.09
Nodes (34): confirmedFollowers(), GalleryRow, SketchPieceRow, DisplayPieceRow, handleDerivatives(), handleNotifyFollowers(), handleRenderDisplay(), handleSealEpoch() (+26 more)

### Community 39 - "Web TSConfig"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 40 - "Root Package Manifest"
Cohesion: 0.06
Nodes (36): [, width, height], description, devDependencies, concurrently@^9.1.0, esbuild@^0.24.0, ktx2-encoder@^0.6.0, maxrects-packer@^2.7.3, playwright@^1.63.0 (+28 more)

### Community 41 - "actions.ts"
Cohesion: 0.09
Nodes (44): BugReportsPage(), dateFormat, dynamic, summary(), dateFormat, dynamic, GuestBoardPage(), dynamic (+36 more)

### Community 42 - "npc-layer.ts"
Cohesion: 0.15
Nodes (18): BY_ID, CAST, FRAME, IDLE, idleCel(), NPC_WALK_SPEED, NpcCharacter, WANDERER_IDS (+10 more)

### Community 43 - "import-fishing-assets.mjs"
Cohesion: 0.09
Nodes (13): CANVAS, clear, FONT, FRAME, heights, layer(), layout, lossless (+5 more)

### Community 44 - "Base TSConfig"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, lib, module, moduleResolution (+9 more)

### Community 45 - "Amplify Build Spec"
Cohesion: 0.12
Nodes (16): applications, appRoot, backend, frontend, baseDirectory, files, phases, commands (+8 more)

### Community 46 - "sketchguess/lib/api.ts"
Cohesion: 0.28
Nodes (11): sameOriginUrl(), PreparedGame, decodeImage(), fetchBitmap(), fetchRound(), guarded(), LoadedRound, loadInk() (+3 more)

### Community 47 - "a/[slug]/page.tsx"
Cohesion: 0.31
Nodes (6): ArtistPage(), dynamic, generateMetadata(), GET(), FollowForm(), getArtistPage()

### Community 48 - "slots/store.ts"
Cohesion: 0.14
Nodes (17): ANON_PREFIX, anonKey(), deviceKey(), isMemberSlotKey(), listKeys(), MEMBER_KEY, memberKey(), memberPrefix() (+9 more)

### Community 49 - "createHallRoom"
Cohesion: 0.09
Nodes (19): createHelm(), LobbyMarks, FunZoneSign, LobbySigns, createSitting(), hop(), createHallRoom(), buildRoom() (+11 more)

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
Cohesion: 0.18
Nodes (3): FakeServer, SlotState, SlotDef

### Community 54 - "wander.test.ts"
Cohesion: 0.12
Nodes (17): FloorSpot, Job, Place, Phase, ResidentState, Run, WalkPath, WalkState (+9 more)

### Community 55 - "compose-atelier.mjs"
Cohesion: 0.12
Nodes (10): body, dressLayer, dressWidth, floralWidth, hanger, MANNEQUIN_CANVAS, mask, root (+2 more)

### Community 56 - "lib/presence.ts"
Cohesion: 0.08
Nodes (23): Entry, Connect, fetchTicket, HEARTBEAT_MS, HIDDEN_LIMIT_MS, RETRY_MS, sameLook(), samePose() (+15 more)

### Community 57 - "pond-format.ts"
Cohesion: 0.12
Nodes (29): PondDex, catchLabel(), EXCHANGE_DAILY_STAMPS, EXCHANGE_PEARLS_PER_STAMP, FISH_ART, fishArt(), formatPercent(), formatShortSizeCm() (+21 more)

### Community 58 - "react"
Cohesion: 0.18
Nodes (11): openBugReport(), fitWidth(), HelpGuide(), HelpGuideProps, POINTER_STEPS, TOUCH_STEPS, ScreenChrome(), SettingsMenu() (+3 more)

### Community 59 - "economy/store.ts"
Cohesion: 0.09
Nodes (51): CARRY_CAP, carryAdd(), CarryEntry, carryPrune(), carryRemove(), chunk(), tzOffsetNow(), outboxDue() (+43 more)

### Community 60 - "pond-boards.ts"
Cohesion: 0.10
Nodes (31): BOARDS, GET(), oneOf(), PER_VISITOR, PERIODS, compare(), DexRow, displayName() (+23 more)

### Community 61 - "room.ts"
Cohesion: 0.12
Nodes (28): socket(), admitted(), Attachment, farewell(), GHOST_MS, HELLO_TIMEOUT_MS, holdsOf(), MAX_WAITING_PER_IP (+20 more)

### Community 62 - "minimap.ts"
Cohesion: 0.07
Nodes (37): place(), ATELIER_DOOR, createMinimap(), draw(), drawRoom(), floors(), follow(), sketchOf() (+29 more)

### Community 63 - "personal/room.ts"
Cohesion: 0.07
Nodes (20): CafeLink, ComingSoonNote, GiftShopSigns, GuestBoardNotes, Placards, placeLabel(), toScreen(), writeStyle() (+12 more)

### Community 64 - "domain/guestboard.ts"
Cohesion: 0.11
Nodes (28): GET(), BoardScreen(), ComposeScreen(), ComposeScreenProps, blankDraft(), GuestBoard(), GuestBoardProps, View (+20 more)

### Community 65 - "Sound Effect Assets"
Cohesion: 0.22
Nodes (9): file, kilobytes, seconds, file, kilobytes, seconds, soundEffects, click (+1 more)

### Community 66 - "art-cache.ts"
Cohesion: 0.13
Nodes (10): ArtCache, ArtCacheOptions, createArtCache(), drop(), expireLater(), hold(), HeldArt, LoadResult (+2 more)

### Community 67 - "Custom HTTP Headers"
Cohesion: 0.25
Nodes (7): applications, appRoot, customHeaders, headers, pattern, key, value

### Community 68 - "Sharp Layer Package"
Cohesion: 0.33
Nodes (6): dependencies, sharp@^0.33.5, description, sharp, name, private

### Community 69 - "currentMember"
Cohesion: 0.17
Nodes (18): GET(), GET(), PER_MEMBER, GET(), PER_MEMBER, GET(), PER_MEMBER, PER_MEMBER (+10 more)

### Community 70 - "scene/ambience.ts"
Cohesion: 0.13
Nodes (13): BULBS, createHallAmbience(), finish(), glowTexture(), HallAmbience, mulberry(), painted(), vignetteTexture() (+5 more)

### Community 71 - "layout.ts"
Cohesion: 0.17
Nodes (10): cafeAfterIndex(), computeLayout(), cutRooms(), HallLayout, HallRoomKind, HallRoomSpan, hasPedestal(), Span (+2 more)

### Community 72 - "RigPreview.tsx"
Cohesion: 0.27
Nodes (10): RigPreviewPage(), NEXT, PROPS, RigPreview(), draw(), approach(), GROUNDED, rigFacing() (+2 more)

### Community 73 - "DecorController"
Cohesion: 0.08
Nodes (4): Job, DecorController, HighlightArea, WorkKind

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
Cohesion: 0.18
Nodes (18): ArtByRoom, blank(), colorAt(), disposePondArt(), EDGE_BAND, EDGE_BANDS, EDGE_OVERLAP, edgeTexture() (+10 more)

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
Cohesion: 0.27
Nodes (7): checkMessage(), INVISIBLE, MESSAGE_MAX, MessageCheck, normalizeMessage(), hasProfanity(), matcher

### Community 93 - "json"
Cohesion: 0.09
Nodes (62): POST(), PER_MEMBER, PUT(), POST(), GLOBAL, PER_IP, POST(), POST() (+54 more)

### Community 94 - "ClosetView.tsx"
Cohesion: 0.09
Nodes (28): ClosetView(), onKeyDown(), LISTS, PLACE, PODIUM_SRC, Props, Slot, SPOTLIGHT_SRC (+20 more)

### Community 95 - "pond/room.ts"
Cohesion: 0.10
Nodes (32): water, depthAtLift(), FAR_LIFT, FAR_SCALE, liftAt(), pathHalfWidth(), pathX(), PondPath (+24 more)

### Community 96 - "members.ts"
Cohesion: 0.08
Nodes (56): GET(), GET(), GET(), memberFromRequest(), Code, 3.2 Chosen names (members), registry, started() (+48 more)

### Community 104 - "MuseumStage.tsx"
Cohesion: 0.11
Nodes (13): EXITS, isDoor(), linkedDoor(), LINKS, ActiveRoom, RoomOptions, StageContext, StageContextValue (+5 more)

### Community 105 - "FishingView.tsx"
Cohesion: 0.11
Nodes (15): CONFETTI_COLORS, ConfettiPiece, makeConfetti(), RevealCard(), TIER_MS, TIER_SFX, useCountUp(), AudioContextClass (+7 more)

### Community 106 - "ticket.ts"
Cohesion: 0.14
Nodes (18): fetch(), Env, parseRoom(), decoder, encoder, fromBase64Url(), HmacKey, isOwn() (+10 more)

### Community 107 - "bug-reports.ts"
Cohesion: 0.16
Nodes (16): Status, MAX_BUG_CONTACT, MAX_BUG_ERRORS, MAX_BUG_MESSAGE, BugContext, BugReport, BugReportDto, BugReportRejected (+8 more)

### Community 108 - "reveal.ts"
Cohesion: 0.23
Nodes (7): InkMap, planGame(), ROUND_SPREAD, createReveal(), PENCIL, SketchReveal, shuffle()

### Community 109 - "hit.ts"
Cohesion: 0.17
Nodes (12): CoinWall, createHiddenCoin(), Spot, AlphaMap, alphaMapFor(), alphaMaps, buildAlphaMap(), isPaintedAt() (+4 more)

### Community 110 - "graftCostume"
Cohesion: 0.27
Nodes (14): canvasFit(), compose(), graftCostume(), copyAccessor(), copyMaterial(), copyMesh(), copyTexture(), copyView() (+6 more)

### Community 111 - "pondgame/lib/api.ts"
Cohesion: 0.18
Nodes (23): PondGameProps, RevealCardProps, buyPondBait(), castPond(), chainPondBait(), errorOf(), fetchPondState(), isRecord() (+15 more)

### Community 112 - "worker/tsconfig.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 113 - "core/tsconfig.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 114 - "Atelier: the dressing mirror, and show-don't-tell keeping"
Cohesion: 0.13
Nodes (14): Atelier: the dressing mirror, and show-don't-tell keeping, Build order, Built (2026-11-20), Decisions (2026-11-19), Follow-ups (2026-11-20), Goal, In the room, Keeping (+6 more)

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
Cohesion: 0.31
Nodes (13): isItem(), isName(), isPid(), isSeq(), MAX_HOLDS, MAX_MESSAGE_BYTES, parseClientMessage(), parseLook() (+5 more)

### Community 119 - "Costume gallery doorway"
Cohesion: 0.50
Nodes (3): Costume gallery doorway, Curtain colour edit, Prompt

### Community 121 - "Fishing forest: painted asset pass"
Cohesion: 0.10
Nodes (18): Assets, Bruce's collection refresh (2026-11-08), Fishing forest illustrations, Made by hand (not touched by the script), Main hall v2 (2026-11-10), Monets Lily Pond (2026-11-08), 1. Forest doorway, 2. Woodland noticeboard (+10 more)

### Community 124 - "The Costume Atelier"
Cohesion: 0.12
Nodes (15): Adding a character, Adding a costume, Art not supplied as files, Bruce's Chronicles, Checked against the mocks (2026-11-07), Code, Costume fit review, Fitting clothes to other characters (+7 more)

### Community 125 - "Confirmed issues"
Cohesion: 0.11
Nodes (19): Confirmed issues, E2E-001 — Alternate local origin breaks artwork fallback URLs, E2E-002 — Valid edge placement rejected through floating-point precision, E2E-003 — One owned prop can be placed multiple times, E2E-004 — Reload before autosave silently loses the latest placement, E2E-005 — Failed save and failed Done have no visible mobile explanation, E2E-006 — Restoring connectivity does not retry a failed draft save, E2E-007 — Keyboard activation cannot place drawer items (+11 more)

### Community 126 - "rig.ts"
Cohesion: 0.13
Nodes (24): Layer, setCostumeVisibility(), follow(), canvasToModel(), disposeRigLayer(), Frame, layerTemplates, loadRig() (+16 more)

### Community 127 - "Curating the paintings (2026-11-07)"
Cohesion: 0.13
Nodes (14): 1. The registry and the table, 2. The studio's Location picker, 3. The rooms draw what is placed, 4. Credits, 5. Retiring self-serve artists, Building it, Curating the paintings (2026-11-07), Decided (+6 more)

### Community 128 - "hitForVisitor"
Cohesion: 0.08
Nodes (41): POST(), ALLOWED, PER_VISITOR, POST(), POST(), POST(), POST(), GET() (+33 more)

### Community 129 - "presence/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, types, exclude, extends, include, ../../tsconfig.base.json

### Community 130 - "catalog.ts"
Cohesion: 0.17
Nodes (19): confirmClean(), CatalogItem, CatalogKind, FREE_CHARACTERS, isCatalogItem(), ITEMS, ItemSlot, priceOf() (+11 more)

### Community 131 - "tsconfig.test.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 132 - "app/layout.tsx"
Cohesion: 0.18
Nodes (11): bethEllen, inspiratiq, metadata, notoSans, RootLayout(), sniglet, viewport, SoundProvider() (+3 more)

### Community 133 - "ColorRecall.tsx"
Cohesion: 0.19
Nodes (17): ColorRecall(), ColorRecallProps, Phase, readBest(), ColorRound, showMs(), unlockEverything(), loadColorRecall() (+9 more)

### Community 134 - "peers.ts"
Cohesion: 0.14
Nodes (7): INTERPOLATION_DELAY_MS, PEER_TIMEOUT_MS, PeerTable, positionAt(), Sample, look, Peer

### Community 135 - "gallery.ts"
Cohesion: 0.08
Nodes (38): GET(), intParam(), GET(), sketchPool, unavailable(), currentEpoch(), ensureEpoch(), epochById() (+30 more)

### Community 136 - "bug-reports.ts"
Cohesion: 0.27
Nodes (11): BugReportHost(), BugReportSheet, BugReportSheet(), send(), collectContext(), inAppBrowser(), onOpenBugReport(), recentErrors (+3 more)

### Community 137 - "npc-layer.ts"
Cohesion: 0.19
Nodes (20): castMember(), createNpcLayer(), createResidentView(), createView(), departedRecently(), draw(), fadeOut(), glyphWidth() (+12 more)

### Community 138 - "SoundProvider.tsx"
Cohesion: 0.32
Nodes (5): SoundContext, SoundState, EffectName, STATIC_BASE, staticUrl()

### Community 139 - "room-places.ts"
Cohesion: 0.23
Nodes (15): atelierRoomInfo(), atelierX(), copy(), FurniturePlacement, hallCache, hallRoomInfo(), onGround(), PERSONAL_FURNITURE (+7 more)

### Community 140 - "Conn"
Cohesion: 0.31
Nodes (4): connectWebSocket(), SocketHandlers, Conn, message()

### Community 141 - "AssetImage"
Cohesion: 0.16
Nodes (15): BoardScreenProps, PinnedNotesProps, ReadScreen(), ReadScreenProps, messageLength(), StickyNote(), StickyNoteProps, NOTE_PLACES (+7 more)

### Community 142 - "createRemoteVisitors"
Cohesion: 0.21
Nodes (10): createRenderer(), createRigLayer(), createRemoteVisitors(), ensureLayer(), load(), placeOwn(), show(), showProp() (+2 more)

### Community 143 - "stage.ts"
Cohesion: 0.11
Nodes (12): createPixelRatioGovernor(), PIXEL_RATIO_STEPS, ROOM_ART, RoomArt, boundedCameraX(), JOINED_REACH, Runtime, StageHosts (+4 more)

### Community 144 - "The Moonlit Pond — design"
Cohesion: 0.09
Nodes (22): Art the pond needs from the artist, Build contract (decided 2026-11-07), Build phases, Collection and goals, Done, Done, Guardrails, Leaderboards (+14 more)

### Community 145 - "Pond rework"
Cohesion: 0.18
Nodes (10): Baits, Client, Decisions, Done, Notes, Pond rework, Server, Species (+2 more)

### Community 146 - "createStage"
Cohesion: 0.19
Nodes (20): createNearby(), createStage(), closeEntry(), enter(), initialize(), aim(), drawFrame(), handleClick() (+12 more)

### Community 147 - "Orchestration contract — you plan, DSH workers execute"
Cohesion: 0.29
Nodes (6): Briefing a worker, Budget hygiene, graphify, Orchestration contract — you plan, DSH workers execute, The worker, When not to delegate

### Community 148 - "tables.ts"
Cohesion: 0.11
Nodes (30): BaitTray(), BaitTrayProps, debugSpecies(), debugVariant(), GuestRollOptions, guestTreasure(), rollGuest(), BAIT (+22 more)

### Community 149 - "infra/jobs.ts"
Cohesion: 0.23
Nodes (15): loop(), shutdown(), sleep(), sweepStale(), DrainResult, handler(), repairFrames(), repairUnframed() (+7 more)

### Community 150 - "wallet/body.ts"
Cohesion: 0.22
Nodes (13): PER_MEMBER, POST(), baitIdOf(), integerOffset(), isRecord(), itemIdOf(), MAX_CLAIM_BATCH, ParsedWalletClaim (+5 more)

### Community 151 - "pond-state.ts"
Cohesion: 0.25
Nodes (14): PondStateView, PondTier, ensurePondStateStarted(), getPondStateSnapshot(), GUEST, listeners, LOADING, PondStateSnapshot (+6 more)

### Community 152 - "tab-turn.ts"
Cohesion: 0.16
Nodes (5): createTabTurn(), TabTurn, tab(), TurnEnv, TurnMessage

### Community 154 - "visits/page.tsx"
Cohesion: 0.29
Nodes (9): amount(), duration(), dynamic, LANDMARKS, PAGES, RANGES, share(), VisitsPage() (+1 more)

### Community 155 - "performance/page.tsx"
Cohesion: 0.16
Nodes (15): dynamic, format(), grade(), METRICS, PAGES, PerformancePage(), RANGES, DEVICES (+7 more)

### Community 156 - "Your Room: a room you can freely furnish"
Cohesion: 0.22
Nodes (8): Admin mode (gamma), Decisions (2026-11-17, with the user), Room look (web, `features/rooms/themes/cozy.ts`, `features/rooms/personal/room.ts`), Scale, Testing locally, What other games do (research, 2026-11-17), Work plan, Your Room: a room you can freely furnish

### Community 157 - "Walkthrough.tsx"
Cohesion: 0.11
Nodes (24): BACKDROP_STYLE, MoreArrow(), NavArrow(), Props, SLIDE, Walkthrough(), XIcon(), decodedFrames (+16 more)

### Community 158 - "createPondRoom"
Cohesion: 0.32
Nodes (13): createPondRoom(), approach(), busy(), finishWalk(), goTo(), leave(), move(), nearest() (+5 more)

### Community 159 - "useSoundEffects.ts"
Cohesion: 0.12
Nodes (26): BackgroundMusic, clampVolume(), isDocumentHidden(), Options, useBackgroundMusic(), VISIBILITY_EVENTS, EFFECTS, EffectSpec (+18 more)

### Community 160 - ".webSocketMessage"
Cohesion: 0.44
Nodes (3): attachmentOf(), Room, sendTo()

### Community 161 - "LandingFx"
Cohesion: 0.17
Nodes (12): between(), CAT, Edge, EDGES, runLandingCat(), choosePeeker(), peek(), glowSprite() (+4 more)

### Community 162 - "env.ts"
Cohesion: 0.06
Nodes (28): target, CAT, drop, EXPECTED, manifest, manifestPath, masters, root (+20 more)

### Community 163 - "painting-open"
Cohesion: 0.50
Nodes (4): file, kilobytes, seconds, painting-open

### Community 164 - "CrowdPreview.tsx"
Cohesion: 0.33
Nodes (7): CrowdPreviewPage(), CrowdPreview(), draw(), KINDS, Stats, Window, clearRigLayer()

### Community 165 - "Multiplayer ("other visitors") — plan v2 (Cloudflare)"
Cohesion: 0.10
Nodes (20): 0. Summary, 10. Decisions, 1. Product contract changes (approved 2026-10-31), 2. What already exists that this builds on, 3.1 Generated names (everyone has one), 3. Names, 4. Transport: Cloudflare Durable Objects, 5.1 Emotes (v1) (+12 more)

### Community 167 - "assetUrl"
Cohesion: 0.19
Nodes (16): canvasTexture(), ceilingTexture(), cozyPropImageUrl(), fishTexture(), floorTexture(), floorWearCanvas(), loadCozyArt(), loadImage() (+8 more)

### Community 168 - "confirm/page.tsx"
Cohesion: 0.33
Nodes (7): ConfirmFollow(), dynamic, dynamic, Unsubscribe(), FollowNotice(), confirmFollow(), unsubscribe()

### Community 169 - "icon-basket"
Cohesion: 0.67
Nodes (3): icon-basket, file, vector

### Community 170 - "query"
Cohesion: 0.17
Nodes (18): deletePieceAction(), clearCatches(), grantPearls(), setState(), grantPearls(), deletePiece(), GalleryPiece, hangPiece() (+10 more)

### Community 171 - "visits.ts"
Cohesion: 0.17
Nodes (18): state(), flush(), startVisit(), visibleMs(), VisitState, count(), currentSalts(), DEVICES (+10 more)

### Community 172 - "shopkeeper.ts"
Cohesion: 0.25
Nodes (7): RigPiece, COATS, createShopkeeper(), GREETINGS, OUTFIT, recolourFur(), SHOPKEEPER_NAME

### Community 174 - "outbox.test.ts"
Cohesion: 0.26
Nodes (12): ClaimRequest, OUTBOX_CAP, outboxAdd(), OutboxEntry, outboxFail(), outboxRemove(), RETRY_BASE_MS, RETRY_MAX_MS (+4 more)

### Community 176 - "DecorDrawer.tsx"
Cohesion: 0.12
Nodes (19): DecorDrawer, DecorDrawerProps, SharingState, SLOT_LABELS, Tab, TABS, categoryOf(), DrawerCategory (+11 more)

### Community 179 - "createPersonalRoom"
Cohesion: 0.27
Nodes (9): aspectOf(), createPlacementLayer(), drawOutline(), dropGhosts(), dropHelper(), extrasFor(), silhouette(), sizeOf() (+1 more)

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
Cohesion: 0.43
Nodes (7): fetchPondFeed(), PondFeedItem, formatSizeCm(), isGolden(), PondTicker(), load(), PondTickerProps

### Community 185 - "hall/room.ts"
Cohesion: 0.09
Nodes (36): Assets, CUTS, disposeBoards(), Mark, plane(), ROPE_CUTS, ropeSlices(), sliceOf() (+28 more)

### Community 186 - "Low"
Cohesion: 0.09
Nodes (22): onClick(), 10. Long names run off the name sign, 11. The rooms API skips the stale-tab member check, 12. The bunny is dragged along while you pan in Decorate, 13. Pages that redirect or don't exist answer 200, 14. Error codes reveal which room slugs exist, 15. The name sign slides under the top-right buttons in Decorate, 16. Level-up celebrations can be farmed (+14 more)

### Community 187 - "locations.ts"
Cohesion: 0.30
Nodes (14): hasUnpublished(), locationStates(), nudgeInRow(), OWNER, placePainting(), PlaceResult, PlaceTarget, rowPlacements() (+6 more)

### Community 189 - "app/page.tsx"
Cohesion: 0.21
Nodes (13): dynamic, Hall(), MuseumPage(), [BRAND_OWNER, ...BRAND_REST], CurrentlyShowing(), Decor(), dynamic, LandingPage() (+5 more)

### Community 190 - "BountyPanel.tsx"
Cohesion: 0.17
Nodes (17): GLYPHS, PearlIcon(), POND_CRIMSON, PondIconName, claimPondBounty(), fetchPondBounties(), formatCountdown(), nextUtcMidnight() (+9 more)

### Community 192 - "perf.ts"
Cohesion: 0.22
Nodes (4): createPerfMeter(), isEnabled(), PerfMeter, PerfSnapshot

### Community 193 - "Monets Lily Pond: exploration, UX and multiplayer QA"
Cohesion: 0.29
Nodes (6): Browser and interaction coverage, Changes made from the walkthrough, Monets Lily Pond: exploration, UX and multiplayer QA, Multiplayer and load, Practical limits, Regression checks and cleanup

### Community 194 - "remote-visitors.ts"
Cohesion: 0.11
Nodes (8): RigState, Rig, RemoteVisitor, FLAT, MAX_SHOWN, RemoteVisitors, Shown, Sprite

### Community 195 - "createRigState"
Cohesion: 0.21
Nodes (12): createCharacter(), contextLost(), loadKind(), loseRig(), setFrame(), cache, queue, render() (+4 more)

### Community 196 - "import-hall-assets.mjs"
Cohesion: 0.13
Nodes (11): BASEBOARD, CURTAIN, drop, EXPECTED, manifest, manifestPath, masters, root (+3 more)

### Community 197 - "pond-api.ts"
Cohesion: 0.17
Nodes (23): refreshWalletNow(), buyPondBait(), errorOf(), exchangePondPearls(), fetchPondDex(), fetchPondLeaderboard(), fetchPondState(), isRecord() (+15 more)

### Community 198 - "AccountSheet.tsx"
Cohesion: 0.06
Nodes (34): PresencePreviewPage(), AccountHost(), AccountSheet, AccountSheet(), continueAnyway(), doSignOut(), runDelete(), runName() (+26 more)

### Community 199 - "Local end-to-end stress test — 2026-11-06"
Cohesion: 0.20
Nodes (8): Environment and coverage, Fix status (2026-11-06), Follow-up coverage, Issue index, Local end-to-end stress test — 2026-11-06, Measured load, Passing checks and interpretation limits, Test data and cleanup

### Community 200 - "Atelier: the dressing mirror, and show-don't-tell keeping"
Cohesion: 0.12
Nodes (8): CARD, createHangTag(), HangTag, HangTagStyle, HOLE, KNOT, What goes, and what replaces it, Refusal

### Community 201 - "Tasks"
Cohesion: 0.14
Nodes (11): Decisions (2026-11-05), Design for Phases 5–7 (2026-11-05), Follow-ups after Phases 4–7, Personal room polish (2026-11-05), Phase 3: one persistent stage, Phase 6: decorating mode, Phase 7: personal rooms, Rooms (+3 more)

### Community 202 - "import-home-assets.mjs"
Cohesion: 0.14
Nodes (11): DOOR, DOOR_BACKDROP, drop, FURNITURE, manifest, manifestPath, masters, ORNATE_PAPER (+3 more)

### Community 204 - "Other visitors"
Cohesion: 0.29
Nodes (6): How it plays, Other visitors, Privacy, Running it in production, Running it locally, Staying consistent

### Community 205 - "nearby.ts"
Cohesion: 0.18
Nodes (5): Nearby, NearbyReach, RoomSpan, reach, strip

### Community 206 - "media/storage.ts"
Cohesion: 0.08
Nodes (23): CONTENT_TYPES, GET(), PUT(), listPieces(), pieceImageUrl(), PieceRow, toPieceDto(), ACCEPTED (+15 more)

### Community 207 - "rooms.ts"
Cohesion: 0.12
Nodes (31): GET(), artist(), member(), piece(), randomId(), sealEpoch(), discardLocation(), publishLocation() (+23 more)

### Community 208 - "revealFloorTransition"
Cohesion: 0.33
Nodes (6): Loading(), AtelierLoading(), coverFloorTransition(), revealFloorTransition(), createRoomPassage(), fixture()

### Community 209 - "GameDesktop.tsx"
Cohesion: 0.27
Nodes (8): loadGameDesktop(), GameDesktop(), GameDesktopProps, MinigameFrame(), MinigameFrameProps, Minigame, MinigameId, MINIGAMES

### Community 210 - "PondRoom.tsx"
Cohesion: 0.10
Nodes (21): Loading(), metadata, PondPage(), PondGame(), POND_NAME, FishmongerPanel(), PondLoading(), BOARD_TABS (+13 more)

### Community 211 - "createCozyBackdrop"
Cohesion: 0.23
Nodes (13): alphaCanvas(), ceilingGeometry(), createCozyBackdrop(), clearGlows(), glow(), paintShade(), placeGlows(), placeSides() (+5 more)

### Community 212 - "next"
Cohesion: 0.12
Nodes (22): config, SECURITY_HEADERS, GET(), PaintingRow, POST(), UPLOADS_PER_ARTIST, POST(), UPLOADS_PER_ARTIST (+14 more)

### Community 213 - "HallArranger.tsx"
Cohesion: 0.27
Nodes (7): loadHallArranger(), HallArranger(), HallArrangerProps, HallRoomData, Painting, hallPlacements(), reasonLabel()

### Community 214 - "VitalsReporter.tsx"
Cohesion: 0.29
Nodes (8): firstPainting(), flush(), Metric, queue, REPORTED, VitalsReporter(), FIRST_PAINTING_MARK, MUSEUM_START_MARK

### Community 215 - "darknessAt"
Cohesion: 0.39
Nodes (6): CEILING, darknessAt(), pool(), RoomLight, smooth(), dirty

### Community 216 - "share.ts"
Cohesion: 0.33
Nodes (5): ShareOutcome, shareResult(), ShareSummary, shareText(), base

### Community 217 - "Tiny Museum"
Cohesion: 0.29
Nodes (6): file(), Deployment, Known gaps, Layout, Running locally, Tiny Museum

## Knowledge Gaps
- **5 isolated node(s):** `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1562 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **27 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `domain/guestboard.ts` to `SketchGuess.tsx`, `app/layout.tsx`, `ColorRecall.tsx`, `bug-reports.ts`, `machine.ts`, `Museum.tsx`, `SoundProvider.tsx`, `AssetImage`, `Test Fakes and Helpers`, `features/economy/index.ts`, `room-events.ts`, `PersonalRoom.tsx`, `tables.ts`, `pond-state.ts`, `wardrobe.ts`, `gallery/page.tsx`, `LeaderboardPanel.tsx`, `Walkthrough.tsx`, `Web Package Dependencies`, `useSoundEffects.ts`, `LandingFx`, `risk.ts`, `CrowdPreview.tsx`, `a/[slug]/page.tsx`, `DecorDrawer.tsx`, `Water.tsx`, `PondTicker.tsx`, `pond-format.ts`, `react`, `app/page.tsx`, `BountyPanel.tsx`, `AccountSheet.tsx`, `RigPreview.tsx`, `revealFloorTransition`, `GameDesktop.tsx`, `PondRoom.tsx`, `next`, `HallArranger.tsx`, `VitalsReporter.tsx`, `ClosetView.tsx`, `MuseumStage.tsx`, `FishingView.tsx`, `bug-reports.ts`?**
  _High betweenness centrality (0.092) - this node is a cross-community bridge._
- **What connects `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json` to the rest of the system?**
  _5 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `MuseumStage.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05550416281221091 - nodes in this community are weakly interconnected._
- **Why does `three` connect `remote-visitors.ts` to `MuseumStage.tsx`, `scene/assets.ts`, `scene.ts`, `cozy.ts`, `stage.ts`, `room-events.ts`, `prepare-models.mjs`, `wardrobe.ts`, `ambience.ts`, `Web Package Dependencies`, `atelier.ts`, `npc-layer.ts`, `hall/room.ts`, `perf.ts`, `remote-visitors.ts`, `scene/ambience.ts`, `Atelier: the dressing mirror, and show-don't-tell keeping`, `pond/art.ts`, `pond/room.ts`, `hit.ts`, `rig.ts`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Should `SketchGuess.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12043010752688173 - nodes in this community are weakly interconnected._
- **Why does `createPresence()` connect `createPresence` to `Multiplayer ("other visitors") — plan v2 (Cloudflare)`, `peers.ts`, `AccountSheet.tsx`, `room-events.ts`, `protocol.ts`, `lib/presence.ts`, `names.ts`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Should `themes.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05513784461152882 - nodes in this community are weakly interconnected._