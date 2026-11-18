# Graph Report - tiny-museum  (2026-11-17)

## Corpus Check
- 511 files · ~299,942 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 82 file(s) not represented in the graph (top: .avif 39, .glb 34, .css 4)

## Summary
- 4561 nodes · 11792 edges · 208 communities (183 shown, 25 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 239 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `21f0bd22`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- three
- walk.ts
- SketchGuess.tsx
- themes.ts
- rules.ts
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
- actions.ts
- room-events.ts
- outbox.test.ts
- ref_node_assert
- amplify/package.json
- PersonalRoom.tsx
- prepare-models.mjs
- Traversal
- core/package.json
- ensureEpoch
- domain/sketch.ts
- pond-boards.ts
- LeaderboardPanel.tsx
- ambience.ts
- core/src/index.ts
- Web Package Dependencies
- Gamifying Tiny Museum — genre direction & engagement research
- atelier.ts
- gallery/page.tsx
- risk.ts
- amplify/tsconfig.json
- 5. Customization menu — what other people are doing
- core/src/index.ts
- DecorController
- Web TSConfig
- Root Package Manifest
- hall/room.ts
- query
- import-fishing-assets.mjs
- Base TSConfig
- Amplify Build Spec
- sketchguess/lib/api.ts
- MuseumStage.tsx
- FakeServer
- placeLabel
- Water.tsx
- Worker Package Manifest
- Public Asset Manifest
- wardrobe.ts
- Hud.tsx
- compose-atelier.mjs
- Other visitors
- pond-format.ts
- stage.ts
- economy/store.ts
- RigPreview.tsx
- room.ts
- minimap.ts
- catalog.ts
- domain/guestboard.ts
- Sound Effect Assets
- art-cache.ts
- Custom HTTP Headers
- Sharp Layer Package
- personal/room.ts
- scene/ambience.ts
- nearby.ts
- .webSocketMessage
- import-landing-assets.mjs
- Visits SQL Schema
- Bunny Walk Sprites
- Room Mockup Settings
- Service Worker Caching
- HallCallbacks
- pond/art.ts
- createPresence
- members
- Frame Window Asset
- features/economy/index.ts
- presence/package.json
- createAtelierRoom
- Asset pipeline: fast loading without losing sharpness
- Guest Board SQL Schema
- Landscape Frame Asset
- jobs.ts
- Bug Reports SQL Schema
- Vitals SQL Schema
- hit
- HallArranger.tsx
- pond/room.ts
- members.ts
- Run-Once Schema
- confirm/page.tsx
- FishingView.tsx
- ticket.ts
- visits/page.tsx
- react
- locations.ts
- graftCostume
- pondgame/lib/api.ts
- worker/tsconfig.json
- core/tsconfig.json
- import-hall-assets.mjs
- How to Design for Failures — ByteByteGo Newsletter
- Worker instructions — DSH headless agents
- Backend
- protocol.ts
- Costume gallery doorway
- performance/page.tsx
- Fishing forest: painted asset pass
- audio/README.md
- .claude/CLAUDE.md
- The Costume Atelier
- Confirmed issues
- rig.ts
- Curating the paintings (2026-11-07)
- ticket/route.ts
- presence/tsconfig.json
- import-home-assets.mjs
- tsconfig.test.json
- app/layout.tsx
- writeLocal
- lib/presence.ts
- Item
- bug-report.ts
- backend.ts
- hall/room.ts
- handlers.ts
- lib/presence.ts
- initialize
- visits.ts
- vitals.ts
- The Moonlit Pond — design
- Pond rework
- env.ts
- Orchestration contract — you plan, DSH workers execute
- tables.ts
- tab-turn.ts
- domain/guestboard.ts
- pond-state.ts
- layout.ts
- shopkeeper.ts
- setCostumeVisibility
- lib/slots/index.ts
- PerfMeter
- Walkthrough.tsx
- createPondRoom
- SoundProvider.tsx
- Medium
- Conn
- AccountSheet.tsx
- painting-open
- rooms.ts
- Multiplayer ("other visitors") — plan v2 (Cloudflare)
- Lobby
- run.ts
- Medium
- icon-basket
- CrowdPreview.tsx
- SoundProvider.tsx
- app/page.tsx
- bunny-left
- AssetImage
- bunny-right
- PersonalRoom.tsx
- createMinimap
- icon-home
- createPlacementLayer
- a/[slug]/page.tsx
- ticket
- GameDesktop.tsx
- Storyline (draft, saved 2026-11-17)
- cat.ts
- walk
- Local end-to-end stress test — 2026-11-06
- media/storage.ts
- draw.py
- RoomSound
- revealFloorTransition
- useSoundEffects.ts
- Minimap
- Monets Lily Pond: exploration, UX and multiplayer QA
- createRemoteVisitors
- session.ts
- Low
- pond-api.ts
- AccountSheet
- Notes
- Rig
- Context
- 4. Transport: Cloudflare Durable Objects
- createCharacter
- ArtCache
- PondRoom.tsx
- Cafe
- messages.ts

## God Nodes (most connected - your core abstractions)
1. `react` - 77 edges
2. `json()` - 74 edges
3. `query()` - 68 edges
4. `PersonalRoom()` - 63 edges
5. `hit()` - 60 edges
6. `limited()` - 54 edges
7. `three` - 45 edges
8. `next` - 44 edges
9. `Traversal` - 44 edges
10. `SyncStore` - 41 edges

## Surprising Connections (you probably didn't know these)
- `Code` --references--> `followOutfit()`  [INFERRED]
  docs/costume-atelier.md → apps/web/src/features/hall/scene/wardrobe.ts
- `5.1 Emotes (v1)` --references--> `ScreenChrome()`  [INFERRED]
  docs/multiplayer-plan.md → apps/web/src/shared/components/ScreenChrome.tsx
- `E2E-009 — Room mutations ignore stale account identity` --references--> `memberFromRequest()`  [INFERRED]
  docs/testing/local-e2e-stress-2026-11-06.md → apps/web/src/shared/lib/member-route.ts
- `Where things stand` --references--> `sealEpoch()`  [INFERRED]
  docs/curation-plan.md → packages/core/src/domain/epoch.ts
- `19. Development-only: page payloads include the full room row` --references--> `getRoom()`  [INFERRED]
  docs/personal-room-issues.md → packages/core/src/domain/rooms.ts

## Import Cycles
- None detected.

## Communities (208 total, 25 thin omitted)

### Community 0 - "three"
Cohesion: 0.04
Nodes (49): CharacterSprites, CameraRig, Attachment, Carried, CarriedState, createCarried(), Character, Perch (+41 more)

### Community 1 - "walk.ts"
Cohesion: 0.12
Nodes (13): FloorPoint, WalkArea, water, POND_LANDMARKS, DEPTH_SPAN, depthOf(), MAX_DEPTH, PICTURE (+5 more)

### Community 2 - "SketchGuess.tsx"
Cohesion: 0.07
Nodes (41): bestKeyFor(), BURST, clueUrl(), openingPlan(), Phase, pickAtRandom(), prepareSketchGame(), readDifficulty() (+33 more)

### Community 3 - "themes.ts"
Cohesion: 0.04
Nodes (48): COLLECTIONS, Admin mode (gamma), Catalogue, Data model (core), Decisions (2026-11-17, with the user), Room look (web, `features/rooms/themes/cozy.ts`, `features/rooms/personal/room.ts`), Scale, Testing locally (+40 more)

### Community 4 - "rules.ts"
Cohesion: 0.14
Nodes (18): localDay(), at(), EXCHANGE_DAILY_STAMPS, EXCHANGE_PEARLS_PER_STAMP, exchangeClaimKey(), GAME_DAILY_CAP, GameId, GAMES (+10 more)

### Community 5 - "round.ts"
Cohesion: 0.12
Nodes (33): ColorRecall(), ColorRecallProps, Phase, readBest(), deltaE(), GAMUT_EPSILON, hexToOklab(), inGamut() (+25 more)

### Community 6 - "floor.ts"
Cohesion: 0.13
Nodes (34): clone(), closestOnSegment(), contains(), cross(), crossVec(), depthAtY(), depthBounds(), depthT() (+26 more)

### Community 7 - "Core Asset Manifest"
Cohesion: 0.05
Nodes (41): artworks, audio, file, megabytes, seconds, sourceName, startedAt, bunny (+33 more)

### Community 8 - "scene/assets.ts"
Cohesion: 0.06
Nodes (52): AssetManifest, assetUrl(), bitmapTexture(), blankImage(), CAFE_CAT_FRAMES, CompressedLoader, elementTexture(), ENTRANCE_FILES (+44 more)

### Community 9 - "SyncStore"
Cohesion: 0.11
Nodes (20): ANON_PREFIX, anonKey(), deviceKey(), encodeStored(), isMemberSlotKey(), listKeys(), MEMBER_KEY, memberKey() (+12 more)

### Community 10 - "machine.ts"
Cohesion: 0.10
Nodes (46): CAST_ERRORS, coarsePointer(), FishingView(), initialEasyReel(), isTyping(), LOST, Toast, vibrate() (+38 more)

### Community 11 - "Museum.tsx"
Cohesion: 0.17
Nodes (20): CoinFound, ColorRecall, GameDesktop, GuestBoard, HallArranger, HelpGuide, loadCoinFound(), loadGuestBoard() (+12 more)

### Community 12 - "Test Fakes and Helpers"
Cohesion: 0.11
Nodes (28): deferredFetch(), deviceSlot, FakeEvents, FakeStorage, fixture, fixtureB, fixtureRegistry, fixtureRegistryBoth (+20 more)

### Community 13 - "scene.ts"
Cohesion: 0.05
Nodes (25): disposeDisplayTexture(), prefersAvif(), HiddenCoin, Helm, createNotes(), createPedestal(), Pedestal, PedestalVoice (+17 more)

### Community 14 - "cozy.ts"
Cohesion: 0.05
Nodes (65): alphaCanvas(), ATELIER_PROPS, AtelierImage, atticWindowCanvas(), bareBulbCanvas(), BOARDS, boardsTexture(), canvasTexture() (+57 more)

### Community 15 - "actions.ts"
Cohesion: 0.09
Nodes (44): config, SECURITY_HEADERS, BugReportsPage(), dateFormat, dynamic, summary(), dateFormat, dynamic (+36 more)

### Community 16 - "room-events.ts"
Cohesion: 0.14
Nodes (30): ChatButton(), REFUSED, joinRoom(), announceNameChange(), emit(), getPeople(), isInRoom(), isMuted() (+22 more)

### Community 17 - "outbox.test.ts"
Cohesion: 0.29
Nodes (11): ClaimRequest, OUTBOX_CAP, outboxAdd(), OutboxEntry, outboxFail(), outboxRemove(), RETRY_BASE_MS, RETRY_MAX_MS (+3 more)

### Community 18 - "ref_node_assert"
Cohesion: 0.12
Nodes (28): defineSlot(), docBytes(), SLOTS, byAtThenKey(), encoded(), latest, mapOf(), maxNumber() (+20 more)

### Community 19 - "amplify/package.json"
Cohesion: 0.17
Nodes (14): devDependencies, @aws-amplify/backend@^1.14.0, @aws-amplify/backend-cli@^1.6.0, aws-cdk-lib@^2.180.0, constructs@^10.3.0, name, private, scripts (+6 more)

### Community 20 - "PersonalRoom.tsx"
Cohesion: 0.09
Nodes (58): errorReason(), overDrawer(), PersonalRoom(), canPlaceNew(), carriedTo(), carryEnd(), carryMove(), finishJob() (+50 more)

### Community 21 - "prepare-models.mjs"
Cohesion: 0.10
Nodes (26): paintedCostume(), BODIES, bruce, BRUCE_FIT, BRUCE_PLACE, bunny, CARDIGAN_TIE, CROWN (+18 more)

### Community 22 - "Traversal"
Cohesion: 0.09
Nodes (9): coverFloorTransition(), JumpPose, createRoomPassage(), fixture(), clamp(), fixture(), jump(), Traversal (+1 more)

### Community 23 - "core/package.json"
Cohesion: 0.06
Nodes (40): dependencies, @aws-sdk/client-s3@^3.1121.0, @aws-sdk/s3-request-presigner@^3.1121.0, bcryptjs@^2.4.3, obscenity@^0.4.6, pg@^8.13.1, sharp@^0.33.5, thumbhash@^0.1.1 (+32 more)

### Community 24 - "ensureEpoch"
Cohesion: 0.16
Nodes (19): GET(), intParam(), GET(), sketchPool, unavailable(), EMPTY, firstSlice(), memo (+11 more)

### Community 25 - "domain/sketch.ts"
Cohesion: 0.13
Nodes (18): planSketchRound(), SKETCH_CHOICES, SketchCandidate, SketchPieceRow, SketchRoundPlan, pool, renderSketch(), SKETCH_COLOR_WIDTH (+10 more)

### Community 26 - "pond-boards.ts"
Cohesion: 0.13
Nodes (21): BOARDS, GET(), oneOf(), PER_VISITOR, PERIODS, compare(), DexRow, displayName() (+13 more)

### Community 27 - "LeaderboardPanel.tsx"
Cohesion: 0.20
Nodes (16): PondBoardId, PondBoardPeriod, PondBoardRow, PondLeaderboard, formatCountdown(), formatOdds(), nextMondayUtc(), useCountdown() (+8 more)

### Community 28 - "ambience.ts"
Cohesion: 0.13
Nodes (30): blade(), bloom(), BLOOMS, createPondAmbience(), update(), fishTexture(), frond(), FRONT_ROWS (+22 more)

### Community 29 - "core/src/index.ts"
Cohesion: 0.05
Nodes (121): CatchExtra, COLUMNS, insertCatch(), member(), namedMember(), randomId(), StatePatch, addBait() (+113 more)

### Community 30 - "Web Package Dependencies"
Cohesion: 0.07
Nodes (33): dependencies, embla-carousel-react@^8.6.0, motion@^13.1.1, next@^15.0.3, react@^19.0.0, react-dom@^19.0.0, swr@^2.5.1, three@^0.169.0 (+25 more)

### Community 31 - "Gamifying Tiny Museum — genre direction & engagement research"
Cohesion: 0.10
Nodes (19): 0.1 The core experience, 0.2 Systems that make gamification cheap to build, 0.3 Constraints that shape any recommendation, 0. What the game is today (the deep dive), 1.1 The landscape (seven candidates, with verdicts), 1.2 Recommendation: a **cozy gallery life-sim** — "the gallery you live in", 1.3 The five design pillars the genre implies, 1. Genre direction (+11 more)

### Community 32 - "atelier.ts"
Cohesion: 0.03
Nodes (45): AtelierImage, AtelierRoom, BuiltRoom, Cardigan, CARDIGAN_NAMES, CHARACTER_NAMES, ClothingItem, Control (+37 more)

### Community 33 - "gallery/page.tsx"
Cohesion: 0.10
Nodes (33): AnalyticsPage(), dynamic, dynamic, GalleryPage(), createCodeAction(), deleteCodeAction(), deletePieceAction(), hangAction() (+25 more)

### Community 34 - "risk.ts"
Cohesion: 0.20
Nodes (20): WagerPicker(), chooseTier(), WagerPickerProps, chainChipLabel(), clampWagerStake(), formatMultiplier(), formatPayout(), formatWagerPercent() (+12 more)

### Community 35 - "amplify/tsconfig.json"
Cohesion: 0.20
Nodes (9): compilerOptions, module, moduleResolution, noUnusedLocals, noUnusedParameters, exclude, extends, include (+1 more)

### Community 36 - "5. Customization menu — what other people are doing"
Cohesion: 0.12
Nodes (16): 1. The target: what "Claude Opus 5.5" actually means, 2. Where your harness stands today (live config I read), 3. The honest gap model, 4. Quality levers, ranked by leverage, 5. Customization menu — what other people are doing, 6. Recommended starting kit for *your* profile, 7. What I can apply for you right now (needs your go-ahead), A. Prompt & persona (most common quality customizations) (+8 more)

### Community 37 - "core/src/index.ts"
Cohesion: 0.09
Nodes (41): member(), now, piece(), randomId(), today, applyClaim(), baitCounts(), baitOf() (+33 more)

### Community 38 - "DecorController"
Cohesion: 0.05
Nodes (10): Carry, Job, PersonalRoomProps, DecorController, PersonalRoomOptions, GhostOptions, HighlightArea, PlacementLayer (+2 more)

### Community 39 - "Web TSConfig"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 40 - "Root Package Manifest"
Cohesion: 0.06
Nodes (36): [, width, height], description, devDependencies, concurrently@^9.1.0, esbuild@^0.24.0, ktx2-encoder@^0.6.0, maxrects-packer@^2.7.3, playwright@^1.63.0 (+28 more)

### Community 41 - "hall/room.ts"
Cohesion: 0.07
Nodes (36): earn(), getWalletSnapshot(), subscribeWallet(), MuseumProps, GALLERY_DOOR, GiftShop, createHelm(), createMatcha() (+28 more)

### Community 42 - "query"
Cohesion: 0.10
Nodes (31): publishAction(), clearCatches(), grantPearls(), setState(), grantPearls(), listPieces(), pieceImageUrl(), PieceRow (+23 more)

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
Cohesion: 0.23
Nodes (13): sameOriginUrl(), PreparedGame, decodeImage(), fetchBitmap(), fetchRound(), guarded(), LoadedRound, loadInk() (+5 more)

### Community 47 - "MuseumStage.tsx"
Cohesion: 0.11
Nodes (19): Atelier(), leave(), createWardrobe(), enqueue(), reflect(), sync(), lookOf(), setup() (+11 more)

### Community 48 - "FakeServer"
Cohesion: 0.18
Nodes (3): FakeServer, SlotState, SlotDef

### Community 49 - "placeLabel"
Cohesion: 0.08
Nodes (10): CafeLink, ComingSoonNote, FunZoneSign, GiftShopSigns, GuestBoardNotes, LobbySigns, Placards, placeLabel() (+2 more)

### Community 50 - "Water.tsx"
Cohesion: 0.08
Nodes (37): AmbientShadow, box(), BUCKET, bunnyBox(), easeOut(), Glint, LEFT_STYLE, lineColour() (+29 more)

### Community 51 - "Worker Package Manifest"
Cohesion: 0.14
Nodes (14): dependencies, @tiny/core@*, exports, ./lambda, @tiny/core, main, name, private (+6 more)

### Community 52 - "Public Asset Manifest"
Cohesion: 0.12
Nodes (15): artworks, bunny, size, floor, size, fonts, icon-no-photos, size (+7 more)

### Community 53 - "wardrobe.ts"
Cohesion: 0.19
Nodes (17): allowedCharacter(), OwnedSnapshot, owns(), walletReady(), loadedMember, loadingMember, look, nonMember (+9 more)

### Community 54 - "Hud.tsx"
Cohesion: 0.24
Nodes (9): Hud(), HudProps, GLYPHS, PearlIcon(), POND_CRIMSON, PondIcon(), PondIconName, PondHud() (+1 more)

### Community 55 - "compose-atelier.mjs"
Cohesion: 0.12
Nodes (10): body, dressLayer, dressWidth, floralWidth, hanger, MANNEQUIN_CANVAS, mask, root (+2 more)

### Community 56 - "Other visitors"
Cohesion: 0.29
Nodes (6): How it plays, Other visitors, Privacy, Running it in production, Running it locally, Staying consistent

### Community 57 - "pond-format.ts"
Cohesion: 0.10
Nodes (37): fetchPondFeed(), PondDex, PondFeedItem, catchLabel(), EXCHANGE_DAILY_STAMPS, EXCHANGE_PEARLS_PER_STAMP, FISH_ART, fishArt() (+29 more)

### Community 58 - "stage.ts"
Cohesion: 0.05
Nodes (23): Pose, Room, RoomOptions, Entry, Arrival, JoinedContents, RoomContents, RoomContext (+15 more)

### Community 59 - "economy/store.ts"
Cohesion: 0.11
Nodes (39): CARRY_CAP, carryAdd(), CarryEntry, carryPrune(), carryRemove(), chunk(), tzOffsetNow(), outboxDue() (+31 more)

### Community 60 - "RigPreview.tsx"
Cohesion: 0.24
Nodes (10): RigPreviewPage(), NEXT, PROPS, RigPreview(), draw(), approach(), GROUNDED, rigFacing() (+2 more)

### Community 61 - "room.ts"
Cohesion: 0.13
Nodes (28): socket(), admitted(), Attachment, farewell(), GHOST_MS, HELLO_TIMEOUT_MS, holdsOf(), MAX_WAITING_PER_IP (+20 more)

### Community 62 - "minimap.ts"
Cohesion: 0.09
Nodes (26): ATELIER_DOOR, follow(), doorPoint(), FALLBACK_TINT, FloorSketch, ICONS, MAP_PLACES, MAP_SCALE (+18 more)

### Community 63 - "catalog.ts"
Cohesion: 0.21
Nodes (16): confirmClean(), CatalogItem, CatalogKind, FREE_CHARACTERS, isCatalogItem(), ITEMS, ItemSlot, priceOf() (+8 more)

### Community 64 - "domain/guestboard.ts"
Cohesion: 0.11
Nodes (29): BoardScreen(), BoardScreenProps, ComposeScreen(), ComposeScreenProps, blankDraft(), GuestBoard(), GuestBoardProps, View (+21 more)

### Community 65 - "Sound Effect Assets"
Cohesion: 0.22
Nodes (9): file, kilobytes, seconds, file, kilobytes, seconds, soundEffects, click (+1 more)

### Community 66 - "art-cache.ts"
Cohesion: 0.21
Nodes (9): ArtCacheOptions, createArtCache(), drop(), expireLater(), hold(), HeldArt, LoadResult, Slot (+1 more)

### Community 67 - "Custom HTTP Headers"
Cohesion: 0.25
Nodes (7): applications, appRoot, customHeaders, headers, pattern, key, value

### Community 68 - "Sharp Layer Package"
Cohesion: 0.33
Nodes (6): dependencies, sharp@^0.33.5, description, sharp, name, private

### Community 69 - "personal/room.ts"
Cohesion: 0.12
Nodes (17): AtelierArt, disposeAtelierArt(), loadGalleryDoor(), loadGalleryPillar(), loadImage(), pending, AtelierArtwork, HallArt (+9 more)

### Community 70 - "scene/ambience.ts"
Cohesion: 0.13
Nodes (13): BULBS, createHallAmbience(), finish(), glowTexture(), HallAmbience, mulberry(), painted(), vignetteTexture() (+5 more)

### Community 71 - "nearby.ts"
Cohesion: 0.18
Nodes (5): Nearby, NearbyReach, RoomSpan, reach, strip

### Community 72 - ".webSocketMessage"
Cohesion: 0.44
Nodes (3): attachmentOf(), Room, sendTo()

### Community 73 - "import-landing-assets.mjs"
Cohesion: 0.18
Nodes (8): CAT, drop, EXPECTED, manifest, manifestPath, masters, root, target

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

### Community 83 - "features/economy/index.ts"
Cohesion: 0.18
Nodes (16): serverSnapshot, useEarnEvents(), buildClaim(), BuiltClaim, EarnDetail, EarnSource, GameSource, newRunId() (+8 more)

### Community 84 - "presence/package.json"
Cohesion: 0.14
Nodes (16): dependencies, @tiny/core@*, devDependencies, @cloudflare/workers-types@5.20261016.1, wrangler@4.151.1, @tiny/core, name, private (+8 more)

### Community 85 - "createAtelierRoom"
Cohesion: 0.18
Nodes (25): aspectOf(), AtelierActions, createAtelierRoom(), buildCollection(), form(), buildEntrance(), buildRoom(), buildWardrobe() (+17 more)

### Community 86 - "Asset pipeline: fast loading without losing sharpness"
Cohesion: 0.22
Nodes (8): Asset pipeline: fast loading without losing sharpness, Character rigs and the Costume Atelier, Completed, Ground rules, Phase 1: fingerprinted files at 2x and 3x, Phase 2: texture atlases for the hall sprites, Phase 3: KTX2 (Basis Universal), built and switched off, Phase 4: ThumbHash placeholders for paintings

### Community 87 - "Guest Board SQL Schema"
Cohesion: 0.67
Nodes (3): guest_notes, guest_notes_visible, rate_limits

### Community 88 - "Landscape Frame Asset"
Cohesion: 0.67
Nodes (3): frameLandscape, size, window

### Community 89 - "jobs.ts"
Cohesion: 0.23
Nodes (15): loop(), shutdown(), sleep(), sweepStale(), DrainResult, handler(), repairFrames(), repairUnframed() (+7 more)

### Community 93 - "hit"
Cohesion: 0.07
Nodes (80): POST(), PER_MEMBER, PUT(), POST(), GET(), POST(), POST(), GLOBAL (+72 more)

### Community 94 - "HallArranger.tsx"
Cohesion: 0.25
Nodes (8): HallArranger(), HallArrangerProps, HallRoomData, Painting, currentHallOrder(), hallPlacements(), paintingOrder(), reasonLabel()

### Community 95 - "pond/room.ts"
Cohesion: 0.11
Nodes (24): depthAtLift(), FAR_LIFT, FAR_SCALE, liftAt(), pathHalfWidth(), pathX(), PondPath, scaleAt() (+16 more)

### Community 96 - "members.ts"
Cohesion: 0.07
Nodes (53): GET(), GLOBAL, PER_IP, GET(), PER_IP, POST(), presenceUrl(), memberFromRequest() (+45 more)

### Community 104 - "confirm/page.tsx"
Cohesion: 0.33
Nodes (7): ConfirmFollow(), dynamic, dynamic, Unsubscribe(), FollowNotice(), confirmFollow(), unsubscribe()

### Community 105 - "FishingView.tsx"
Cohesion: 0.12
Nodes (15): CONFETTI_COLORS, ConfettiPiece, makeConfetti(), RevealCard(), TIER_MS, TIER_SFX, useCountUp(), chainOffer (+7 more)

### Community 106 - "ticket.ts"
Cohesion: 0.14
Nodes (18): fetch(), Env, parseRoom(), decoder, encoder, fromBase64Url(), HmacKey, isOwn() (+10 more)

### Community 107 - "visits/page.tsx"
Cohesion: 0.28
Nodes (8): duration(), dynamic, LANDMARKS, PAGES, RANGES, share(), VisitsPage(), VISIT_FEATURES

### Community 108 - "react"
Cohesion: 0.11
Nodes (23): AccountHost(), AccountSheet, NAME_ERRORS, Pending, View, KeepOnOtherDevices(), AccountMode, onOpenAccount() (+15 more)

### Community 109 - "locations.ts"
Cohesion: 0.18
Nodes (19): AtelierPage(), dynamic, metadata, hasUnpublished(), nudgeInRow(), OWNER, placePainting(), PlaceResult (+11 more)

### Community 110 - "graftCostume"
Cohesion: 0.27
Nodes (14): canvasFit(), compose(), graftCostume(), copyAccessor(), copyMaterial(), copyMesh(), copyTexture(), copyView() (+6 more)

### Community 111 - "pondgame/lib/api.ts"
Cohesion: 0.12
Nodes (32): PondGameProps, HudWagerChip, PondGame(), RevealCardProps, buyPondBait(), CastOptions, castPond(), chainPondBait() (+24 more)

### Community 112 - "worker/tsconfig.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 113 - "core/tsconfig.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 114 - "import-hall-assets.mjs"
Cohesion: 0.13
Nodes (11): BASEBOARD, CURTAIN, drop, EXPECTED, manifest, manifestPath, masters, root (+3 more)

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

### Community 120 - "performance/page.tsx"
Cohesion: 0.27
Nodes (9): dynamic, format(), grade(), METRICS, PAGES, PerformancePage(), RANGES, summarizeVitals() (+1 more)

### Community 121 - "Fishing forest: painted asset pass"
Cohesion: 0.10
Nodes (18): Assets, Bruce's collection refresh (2026-11-08), Fishing forest illustrations, Made by hand (not touched by the script), Main hall v2 (2026-11-10), Monets Lily Pond (2026-11-08), 1. Forest doorway, 2. Woodland noticeboard (+10 more)

### Community 124 - "The Costume Atelier"
Cohesion: 0.12
Nodes (15): Adding a character, Adding a costume, Art not supplied as files, Bruce's Chronicles, Checked against the mocks (2026-11-07), Code, Costume fit review, Fitting clothes to other characters (+7 more)

### Community 125 - "Confirmed issues"
Cohesion: 0.12
Nodes (17): Confirmed issues, E2E-002 — Valid edge placement rejected through floating-point precision, E2E-003 — One owned prop can be placed multiple times, E2E-004 — Reload before autosave silently loses the latest placement, E2E-005 — Failed save and failed Done have no visible mobile explanation, E2E-006 — Restoring connectivity does not retry a failed draft save, E2E-007 — Keyboard activation cannot place drawer items, E2E-008 — Creating an account from My Room leaves the signed-in user on the sign-in prompt (+9 more)

### Community 126 - "rig.ts"
Cohesion: 0.16
Nodes (21): canvasToModel(), disposeRigLayer(), Frame, layerTemplates, loadRig(), dispose(), poseJump(), rotateInPlane() (+13 more)

### Community 127 - "Curating the paintings (2026-11-07)"
Cohesion: 0.13
Nodes (14): 1. The registry and the table, 2. The studio's Location picker, 3. The rooms draw what is placed, 4. Credits, 5. Retiring self-serve artists, Building it, Curating the paintings (2026-11-07), Decided (+6 more)

### Community 128 - "ticket/route.ts"
Cohesion: 0.09
Nodes (35): POST(), ALLOWED, POST(), POST(), POST(), POST(), GET(), PER_VISITOR (+27 more)

### Community 129 - "presence/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, types, exclude, extends, include, ../../tsconfig.base.json

### Community 130 - "import-home-assets.mjs"
Cohesion: 0.09
Nodes (18): target, file(), DOOR, DOOR_BACKDROP, drop, FURNITURE, manifest, manifestPath (+10 more)

### Community 131 - "tsconfig.test.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 132 - "app/layout.tsx"
Cohesion: 0.13
Nodes (16): bethEllen, inspiratiq, metadata, notoSans, RootLayout(), sniglet, viewport, ServiceWorker() (+8 more)

### Community 133 - "writeLocal"
Cohesion: 0.24
Nodes (15): buy(), ensureStarted(), isBuyReply(), memberChanged(), publish(), readSession(), undoAdminUnlock(), unlockEverything() (+7 more)

### Community 134 - "lib/presence.ts"
Cohesion: 0.14
Nodes (7): INTERPOLATION_DELAY_MS, PEER_TIMEOUT_MS, PeerTable, positionAt(), Sample, look, Peer

### Community 135 - "Item"
Cohesion: 0.11
Nodes (7): PresencePreviewPage(), PresencePreview(), RemoteVisitor, Presence, RemoteVisitors, Item, Refusal

### Community 136 - "bug-report.ts"
Cohesion: 0.10
Nodes (29): BugReportHost(), BugReportSheet, BugReportSheet(), send(), Status, collectContext(), inAppBrowser(), onOpenBugReport() (+21 more)

### Community 137 - "backend.ts"
Cohesion: 0.15
Nodes (12): amplifyDir, backend, everyMinutes, mediaBucket, missing, repoRoot, REQUIRED, setting() (+4 more)

### Community 138 - "hall/room.ts"
Cohesion: 0.09
Nodes (36): Assets, Scenery, CUTS, disposeBoards(), Mark, plane(), ROPE_CUTS, ropeSlices() (+28 more)

### Community 139 - "handlers.ts"
Cohesion: 0.10
Nodes (30): confirmedFollowers(), handleDerivatives(), handleNotifyFollowers(), handleRenderDisplay(), handleSealEpoch(), renderPieceFrame(), renderPieceSketch(), runJob() (+22 more)

### Community 140 - "lib/presence.ts"
Cohesion: 0.09
Nodes (22): Entry, Connect, fetchTicket, HEARTBEAT_MS, HIDDEN_LIMIT_MS, RETRY_MS, sameLook(), samePose() (+14 more)

### Community 141 - "initialize"
Cohesion: 0.15
Nodes (23): boundedCameraX(), isDoor(), linkedDoor(), createNearby(), createStage(), closeEntry(), enter(), initialize() (+15 more)

### Community 142 - "visits.ts"
Cohesion: 0.17
Nodes (19): PER_VISITOR, POST(), VisitState, count(), currentSalts(), DEVICES, loadSalts(), parseVisitReport() (+11 more)

### Community 143 - "vitals.ts"
Cohesion: 0.36
Nodes (6): DEVICES, METRICS, normalizePage(), parseVitalsReport(), RATINGS, VitalRow

### Community 144 - "The Moonlit Pond — design"
Cohesion: 0.09
Nodes (22): Art the pond needs from the artist, Build contract (decided 2026-11-07), Build phases, Collection and goals, Done, Done, Guardrails, Leaderboards (+14 more)

### Community 145 - "Pond rework"
Cohesion: 0.18
Nodes (10): Baits, Client, Decisions, Done, Notes, Pond rework, Server, Species (+2 more)

### Community 146 - "env.ts"
Cohesion: 0.14
Nodes (12): SCHEMA_DIR, BRAND, isProduction(), presenceSecret(), repoRoot, required(), sessionSecret(), setting() (+4 more)

### Community 147 - "Orchestration contract — you plan, DSH workers execute"
Cohesion: 0.29
Nodes (6): Briefing a worker, Budget hygiene, graphify, Orchestration contract — you plan, DSH workers execute, The worker, When not to delegate

### Community 148 - "tables.ts"
Cohesion: 0.09
Nodes (35): FrameShape, BaitTray(), BaitTrayProps, debugSpecies(), debugTokens(), debugVariant(), GuestRollOptions, guestTreasure() (+27 more)

### Community 149 - "tab-turn.ts"
Cohesion: 0.16
Nodes (5): createTabTurn(), TabTurn, tab(), TurnEnv, TurnMessage

### Community 150 - "domain/guestboard.ts"
Cohesion: 0.23
Nodes (11): GET(), decodeCursor(), encodeCursor(), GuestNoteInput, GuestNoteRejected, listGuestNotes(), PER_VISITOR, toDto() (+3 more)

### Community 151 - "pond-state.ts"
Cohesion: 0.25
Nodes (14): PondStateView, PondTier, ensurePondStateStarted(), getPondStateSnapshot(), GUEST, listeners, LOADING, PondStateSnapshot (+6 more)

### Community 152 - "layout.ts"
Cohesion: 0.21
Nodes (9): cafeAfterIndex(), comingSoonWidth(), computeLayout(), cutRooms(), HallLayout, HallRoomKind, HallRoomSpan, hasPedestal() (+1 more)

### Community 153 - "shopkeeper.ts"
Cohesion: 0.25
Nodes (7): RigPiece, COATS, createShopkeeper(), GREETINGS, OUTFIT, recolourFur(), SHOPKEEPER_NAME

### Community 154 - "setCostumeVisibility"
Cohesion: 0.50
Nodes (3): Layer, setCostumeVisibility(), setCostume()

### Community 155 - "lib/slots/index.ts"
Cohesion: 0.09
Nodes (13): WalkAlone(), Probe(), StoredSlot, defaultEnv(), defaultStore(), EventTargetLike, MemberInfo, SlotHandle (+5 more)

### Community 157 - "Walkthrough.tsx"
Cohesion: 0.14
Nodes (20): BACKDROP_STYLE, MoreArrow(), NavArrow(), Props, SLIDE, Walkthrough(), XIcon(), decodedFrames (+12 more)

### Community 158 - "createPondRoom"
Cohesion: 0.32
Nodes (13): createPondRoom(), approach(), busy(), finishWalk(), goTo(), leave(), move(), nearest() (+5 more)

### Community 159 - "SoundProvider.tsx"
Cohesion: 0.20
Nodes (8): EFFECTS, EffectSpec, FOOTSTEPS, SoundEffects, gestured(), OPTIONS, STATIC_BASE, staticUrl()

### Community 160 - "Medium"
Cohesion: 0.24
Nodes (7): glowSprite(), LandingFx(), onClick(), onVisibility(), tick(), Mote, 9. Decorating can't be done with the keyboard

### Community 161 - "Conn"
Cohesion: 0.31
Nodes (4): connectWebSocket(), SocketHandlers, Conn, message()

### Community 162 - "AccountSheet.tsx"
Cohesion: 0.15
Nodes (16): MuseumLayout(), CoinToast(), Toast, Purse(), Stamp(), WalletProvider(), useWallet(), STAMP_SVG (+8 more)

### Community 163 - "painting-open"
Cohesion: 0.50
Nodes (4): file, kilobytes, seconds, painting-open

### Community 164 - "rooms.ts"
Cohesion: 0.10
Nodes (38): roomEditor, PER_EDITOR, PUT(), versionOf(), PER_EDITOR, POST(), GET(), PER_MEMBER (+30 more)

### Community 165 - "Multiplayer ("other visitors") — plan v2 (Cloudflare)"
Cohesion: 0.14
Nodes (13): 0. Summary, 10. Decisions, 1. Product contract changes (approved 2026-10-31), 2. What already exists that this builds on, 3.1 Generated names (everyone has one), 3. Names, 5.1 Emotes (v1), 5. Protocol (`packages/core/src/presence/protocol.ts`) (+5 more)

### Community 167 - "run.ts"
Cohesion: 0.20
Nodes (7): admin, childEnv, client, database, fresh, migrations, target

### Community 168 - "Medium"
Cohesion: 0.17
Nodes (12): 10. Long names run off the name sign, 11. The rooms API skips the stale-tab member check, 12. The bunny is dragged along while you pan in Decorate, 6. Failed saves are nearly invisible, and nothing retries, 7. Two tabs editing the same room overwrite each other, 8. The drawer's card row can't be scrolled on touch screens, Checked and fine, Medium (+4 more)

### Community 169 - "icon-basket"
Cohesion: 0.67
Nodes (3): icon-basket, file, vector

### Community 170 - "CrowdPreview.tsx"
Cohesion: 0.29
Nodes (8): CrowdPreviewPage(), CrowdPreview(), draw(), KINDS, Stats, Window, clearRigLayer(), layer()

### Community 171 - "SoundProvider.tsx"
Cohesion: 0.27
Nodes (8): state(), SoundContext, SoundProvider(), VisitTracker(), isPublicPage(), flush(), startVisit(), visibleMs()

### Community 172 - "app/page.tsx"
Cohesion: 0.11
Nodes (26): Loading(), dynamic, Hall(), MuseumPage(), [BRAND_OWNER, ...BRAND_REST], CurrentlyShowing(), Decor(), dynamic (+18 more)

### Community 174 - "AssetImage"
Cohesion: 0.24
Nodes (9): coin, CoinFound(), CoinFoundProps, BunnyArtist(), BunnyMood, Pencil(), POSES, AssetImage() (+1 more)

### Community 176 - "PersonalRoom.tsx"
Cohesion: 0.12
Nodes (18): DecorDrawer, DecorDrawerProps, SharingState, SLOT_LABELS, Tab, TABS, categoryOf(), DrawerCategory (+10 more)

### Community 177 - "createMinimap"
Cohesion: 0.31
Nodes (9): place(), createMinimap(), draw(), drawRoom(), floors(), sketchOf(), readCollapsed(), svg() (+1 more)

### Community 179 - "createPlacementLayer"
Cohesion: 0.11
Nodes (18): cozyLevel, cozyWorth(), createPersonalRoom(), light(), shade(), showArrangement(), showLevel(), signFilter() (+10 more)

### Community 180 - "a/[slug]/page.tsx"
Cohesion: 0.31
Nodes (6): ArtistPage(), dynamic, generateMetadata(), GET(), FollowForm(), getArtistPage()

### Community 182 - "GameDesktop.tsx"
Cohesion: 0.33
Nodes (7): loadGameDesktop(), GameDesktop(), GameDesktopProps, MinigameFrame(), Minigame, MinigameId, MINIGAMES

### Community 183 - "Storyline (draft, saved 2026-11-17)"
Cohesion: 0.18
Nodes (10): Arc (soft, no fail state), Built so far, How it ties to what exists, Mystery hook, Next tasks (when picked up), Open questions, Premise, Seed (the owner's words) (+2 more)

### Community 184 - "cat.ts"
Cohesion: 0.32
Nodes (7): between(), CAT, Edge, EDGES, runLandingCat(), choosePeeker(), peek()

### Community 185 - "walk"
Cohesion: 0.18
Nodes (12): walk(), 1. What is in this bundle, 3. The rig, 4. Suggested plan, 5. Blender-side work still to do (needs Blender; the author has it with an MCP bridge), 6. Open questions for the author, Handoff: move the Tiny Museum bunny from sprite frames to a rig, Approved v4 bunny in the hall (+4 more)

### Community 186 - "Local end-to-end stress test — 2026-11-06"
Cohesion: 0.22
Nodes (7): Environment and coverage, Follow-up coverage, Issue index, Local end-to-end stress test — 2026-11-06, Measured load, Passing checks and interpretation limits, Test data and cleanup

### Community 187 - "media/storage.ts"
Cohesion: 0.09
Nodes (18): CONTENT_TYPES, GET(), PUT(), ACCEPTED, createAssetFromUpload(), MAX_UPLOAD_BYTES, presignUpload(), registerUpload() (+10 more)

### Community 189 - "RoomSound"
Cohesion: 0.33
Nodes (4): StageOptions, RoomSound, SoundState, EffectName

### Community 190 - "revealFloorTransition"
Cohesion: 0.70
Nodes (3): Loading(), AtelierLoading(), revealFloorTransition()

### Community 191 - "useSoundEffects.ts"
Cohesion: 0.17
Nodes (20): BackgroundMusic, clampVolume(), isDocumentHidden(), Options, useBackgroundMusic(), VISIBILITY_EVENTS, useSoundEffects(), applyMix() (+12 more)

### Community 193 - "Monets Lily Pond: exploration, UX and multiplayer QA"
Cohesion: 0.29
Nodes (6): Browser and interaction coverage, Changes made from the walkthrough, Monets Lily Pond: exploration, UX and multiplayer QA, Multiplayer and load, Practical limits, Regression checks and cleanup

### Community 194 - "createRemoteVisitors"
Cohesion: 0.21
Nodes (10): createRenderer(), createRigLayer(), createRemoteVisitors(), ensureLayer(), load(), placeOwn(), show(), showProp() (+2 more)

### Community 195 - "session.ts"
Cohesion: 0.12
Nodes (23): GET(), PaintingRow, POST(), UPLOADS_PER_ARTIST, POST(), UPLOADS_PER_ARTIST, dynamic, HomePage() (+15 more)

### Community 196 - "Low"
Cohesion: 0.25
Nodes (8): 13. Pages that redirect or don't exist answer 200, 14. Error codes reveal which room slugs exist, 15. The name sign slides under the top-right buttons in Decorate, 16. Level-up celebrations can be farmed, 17. No hint of where things are after panning away, 18. Too many items is only discovered by the server, 19. Development-only: page payloads include the full room row, Low

### Community 197 - "pond-api.ts"
Cohesion: 0.15
Nodes (33): amount(), refreshWalletNow(), buyPondBait(), claimPondBounty(), errorOf(), exchangePondPearls(), fetchPondBounties(), fetchPondDex() (+25 more)

### Community 198 - "AccountSheet"
Cohesion: 0.29
Nodes (9): AccountSheet(), continueAnyway(), doSignOut(), runDelete(), runName(), submit(), submitDelete(), submitName() (+1 more)

### Community 200 - "Rig"
Cohesion: 0.25
Nodes (3): RigState, Rig, Shown

### Community 205 - "4. Transport: Cloudflare Durable Objects"
Cohesion: 0.25
Nodes (8): 4. Transport: Cloudflare Durable Objects, Decision (2026-10-31), Deploying, Identity cannot be forged, Local development and tests, Rooms and capacity, Shape of `apps/presence` (about 200 lines), main()

### Community 206 - "createCharacter"
Cohesion: 0.36
Nodes (7): createCharacter(), contextLost(), loadKind(), loseRig(), setFrame(), createRigState(), Angler()

### Community 210 - "PondRoom.tsx"
Cohesion: 0.13
Nodes (19): Loading(), metadata, PondPage(), POND_NAME, PondLoading(), BOARD_TABS, PondOverlayKind, PondPanels() (+11 more)

### Community 219 - "messages.ts"
Cohesion: 0.43
Nodes (5): checkMessage(), INVISIBLE, MESSAGE_MAX, MessageCheck, normalizeMessage()

## Knowledge Gaps
- **5 isolated node(s):** `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1460 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **25 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `SketchGuess.tsx`, `app/layout.tsx`, `round.ts`, `writeLocal`, `Item`, `bug-report.ts`, `machine.ts`, `Museum.tsx`, `Test Fakes and Helpers`, `room-events.ts`, `PersonalRoom.tsx`, `tables.ts`, `pond-state.ts`, `LeaderboardPanel.tsx`, `lib/slots/index.ts`, `Walkthrough.tsx`, `Web Package Dependencies`, `SoundProvider.tsx`, `Medium`, `gallery/page.tsx`, `AccountSheet.tsx`, `risk.ts`, `CrowdPreview.tsx`, `SoundProvider.tsx`, `app/page.tsx`, `AssetImage`, `MuseumStage.tsx`, `PersonalRoom.tsx`, `Water.tsx`, `a/[slug]/page.tsx`, `wardrobe.ts`, `Hud.tsx`, `pond-format.ts`, `RigPreview.tsx`, `revealFloorTransition`, `useSoundEffects.ts`, `domain/guestboard.ts`, `session.ts`, `pond-api.ts`, `PondRoom.tsx`, `features/economy/index.ts`, `HallArranger.tsx`, `FishingView.tsx`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._
- **What connects `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json` to the rest of the system?**
  _5 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `three` be split into smaller, more focused modules?**
  _Cohesion score 0.04397222806648433 - nodes in this community are weakly interconnected._
- **Why does `three` connect `three` to `atelier.ts`, `personal/room.ts`, `scene/ambience.ts`, `scene/assets.ts`, `hall/room.ts`, `hall/room.ts`, `scene.ts`, `cozy.ts`, `pond/art.ts`, `prepare-models.mjs`, `rig.ts`, `ambience.ts`, `Web Package Dependencies`, `pond/room.ts`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Should `walk.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1206896551724138 - nodes in this community are weakly interconnected._
- **Why does `defaultStore()` connect `lib/slots/index.ts` to `three`, `session.ts`, `writeLocal`, `pond-api.ts`, `hall/room.ts`, `SyncStore`, `initialize`, `pondgame/lib/api.ts`, `room-events.ts`, `PersonalRoom.tsx`, `wardrobe.ts`, `pond-state.ts`, `economy/store.ts`, `createPondRoom`, `pond/room.ts`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Should `SketchGuess.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07402031930333818 - nodes in this community are weakly interconnected._