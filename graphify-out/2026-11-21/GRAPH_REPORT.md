# Graph Report - tiny-museum  (2026-11-21)

## Corpus Check
- 547 files · ~333,594 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 105 file(s) not represented in the graph (top: .avif 56, .glb 38, .css 6)

## Summary
- 4927 nodes · 12702 edges · 221 communities (189 shown, 32 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 254 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ded74a7c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- stage.ts
- Walker
- SketchGuess.tsx
- DecorController
- builtUrl
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
- media/storage.ts
- Placement
- session.ts
- LeaderboardPanel
- ambience.ts
- core/src/index.ts
- Web Package Dependencies
- Gamifying Tiny Museum — genre direction & engagement research
- atelier.ts
- remote-visitors.ts
- risk.ts
- amplify/tsconfig.json
- 5. Customization menu — what other people are doing
- gallery.ts
- handlers.ts
- Web TSConfig
- Root Package Manifest
- ref_node_assert
- createRemoteVisitors
- import-fishing-assets.mjs
- Base TSConfig
- Amplify Build Spec
- sketchguess/lib/api.ts
- src/types.ts
- slots/store.ts
- epoch.ts
- Water.tsx
- Worker Package Manifest
- Public Asset Manifest
- SlotDef
- vitals.ts
- compose-atelier.mjs
- lib/presence.ts
- pond-format.ts
- lib/slots/index.ts
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
- stage.ts
- scene/ambience.ts
- Confirmed issues
- PondRoom.tsx
- catalog.ts
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
- Hud.tsx
- Bug Reports SQL Schema
- Vitals SQL Schema
- json
- ClosetView.tsx
- pond/room.ts
- members.ts
- Run-Once Schema
- wardrobe.ts
- FishingView.tsx
- backend.ts
- ReadScreen.tsx
- hang-tag.ts
- wallet/body.ts
- graftCostume
- pondgame/lib/api.ts
- worker/tsconfig.json
- core/tsconfig.json
- import-landing-assets.mjs
- How to Design for Failures — ByteByteGo Newsletter
- Worker instructions — DSH headless agents
- Backend
- protocol.ts
- Costume gallery doorway
- layout.ts
- Fishing forest: painted asset pass
- audio/README.md
- .claude/CLAUDE.md
- The Costume Atelier
- hitForVisitor
- rig.ts
- Curating the paintings (2026-11-07)
- actions.ts
- presence/tsconfig.json
- wallet.ts
- tsconfig.test.json
- app/layout.tsx
- tab-turn.ts
- peers.ts
- run.ts
- bug-reports.ts
- npc-layer.ts
- import-home-assets.mjs
- room-places.ts
- visits/page.tsx
- locations.ts
- VitalsReporter.tsx
- env.ts
- The Moonlit Pond — design
- Pond rework
- createStage
- Orchestration contract — you plan, DSH workers execute
- tables.ts
- Conn
- .webSocketMessage
- pond-state.ts
- PondTicker.tsx
- AtelierRoom
- SoundProvider.tsx
- Atelier: the dressing mirror, and show-don't-tell keeping
- react
- Walkthrough.tsx
- createPondRoom
- useSoundEffects.ts
- BountyPanel.tsx
- LandingFx
- import-hall-assets.mjs
- painting-open
- npc-sheet.cjs
- Multiplayer ("other visitors") — plan v2 (Cloudflare)
- Lobby
- GameDesktop.tsx
- RigPreview.tsx
- icon-basket
- walk
- visits.ts
- Medium
- bunny-left
- Local end-to-end stress test — 2026-11-06
- bunny-right
- defaultStore
- memberFromRequest
- icon-home
- personal/room.ts
- ColorRecall.tsx
- ticket
- schedule.test.ts
- Storyline (draft, saved 2026-11-17)
- exports
- hit.ts
- Low
- Open rooms and the tip jar (design, 2026-11-21)
- draw.py
- Wardrobe
- walk
- audience.ts
- PerfMeter
- Monets Lily Pond: exploration, UX and multiplayer QA
- setPondState
- dependencies
- rooms.ts
- pond-api.ts
- ticket/route.ts
- Sitting
- Item
- messages.ts
- Cafe
- npcs/README.md
- 4. Transport: Cloudflare Durable Objects
- nearby.ts
- plan.ts
- themes.ts
- CrowdPreview.tsx
- createRigState
- MuseumStage.tsx
- createCharacter
- shopkeeper.ts
- Rig
- reveal.ts
- PlayerCard
- ArtCache
- BunnyArtist.tsx
- focus.ts
- Context

## God Nodes (most connected - your core abstractions)
1. `react` - 80 edges
2. `json()` - 72 edges
3. `query()` - 68 edges
4. `PersonalRoom()` - 67 edges
5. `hit()` - 58 edges
6. `limited()` - 52 edges
7. `three` - 48 edges
8. `next` - 44 edges
9. `Traversal` - 44 edges
10. `SyncStore` - 41 edges

## Surprising Connections (you probably didn't know these)
- `Code` --references--> `followOutfit()`  [INFERRED]
  docs/costume-atelier.md → apps/web/src/features/hall/scene/wardrobe.ts
- `1. What is in this bundle` --references--> `walk()`  [INFERRED]
  docs/bunny-rig-author-handoff.md → apps/web/src/features/landing/cat.ts
- `3. The rig` --references--> `walk()`  [INFERRED]
  docs/bunny-rig-author-handoff.md → apps/web/src/features/landing/cat.ts
- `Rendering and movement` --references--> `walk()`  [INFERRED]
  docs/bunny-rig-integration.md → apps/web/src/features/landing/cat.ts
- `E2E-009 — Room mutations ignore stale account identity` --references--> `memberFromRequest()`  [INFERRED]
  docs/testing/local-e2e-stress-2026-11-06.md → apps/web/src/shared/lib/member-route.ts

## Import Cycles
- None detected.

## Communities (221 total, 32 thin omitted)

### Community 0 - "stage.ts"
Cohesion: 0.03
Nodes (54): coverFloorTransition(), AtelierArt, disposeAtelierArt(), CameraRig, createPixelRatioGovernor(), PIXEL_RATIO_STEPS, createRoomPassage(), fixture() (+46 more)

### Community 1 - "Walker"
Cohesion: 0.21
Nodes (4): PondPlaceData, FloorPoint, WalkArea, Walker

### Community 2 - "SketchGuess.tsx"
Cohesion: 0.11
Nodes (30): bestKeyFor(), BURST, clueUrl(), Phase, pickAtRandom(), readDifficulty(), readMode(), saveIfHigher() (+22 more)

### Community 3 - "DecorController"
Cohesion: 0.08
Nodes (4): Job, DecorController, HighlightArea, WorkKind

### Community 4 - "builtUrl"
Cohesion: 0.17
Nodes (17): Loading(), dynamic, Hall(), MuseumPage(), [BRAND_OWNER, ...BRAND_REST], CurrentlyShowing(), Decor(), dynamic (+9 more)

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
Cohesion: 0.06
Nodes (53): AssetManifest, assetUrl(), bitmapTexture(), blankImage(), CAFE_CAT_FRAMES, CharacterSprites, CompressedLoader, elementTexture() (+45 more)

### Community 9 - "SyncStore"
Cohesion: 0.17
Nodes (6): encodeStored(), parseStored(), readStored(), writeStored(), SyncStore, upgrade()

### Community 10 - "machine.ts"
Cohesion: 0.09
Nodes (50): CAST_ERRORS, coarsePointer(), FishingView(), initialEasyReel(), isTyping(), LOST, PondGameProps, Toast (+42 more)

### Community 11 - "Museum.tsx"
Cohesion: 0.13
Nodes (27): PinnedNotes(), CoinFound, ColorRecall, GameDesktop, GuestBoard, HallArranger, HelpGuide, loadCoinFound() (+19 more)

### Community 12 - "Test Fakes and Helpers"
Cohesion: 0.12
Nodes (27): deferredFetch(), deviceSlot, FakeEvents, FakeStorage, fixture, fixtureB, fixtureRegistry, fixtureRegistryBoth (+19 more)

### Community 13 - "scene.ts"
Cohesion: 0.05
Nodes (27): disposeDisplayTexture(), HELM_PEDESTAL_FILE, prefersAvif(), HiddenCoin, createNotes(), createPedestal(), Notes, Pedestal (+19 more)

### Community 14 - "cozy.ts"
Cohesion: 0.06
Nodes (58): alphaCanvas(), ATELIER_PROPS, AtelierImage, atticWindowCanvas(), bareBulbCanvas(), boardsCanvas(), canvasTexture(), ceilingGeometry() (+50 more)

### Community 15 - "features/economy/index.ts"
Cohesion: 0.09
Nodes (35): MuseumLayout(), CoinToast(), Toast, Purse(), Stamp(), WalletProvider(), serverSnapshot, useEarnEvents() (+27 more)

### Community 16 - "room-events.ts"
Cohesion: 0.19
Nodes (25): ChatButton(), REFUSED, joinRoom(), emit(), getPeople(), isInRoom(), isMuted(), muted (+17 more)

### Community 17 - "schedule.ts"
Cohesion: 0.07
Nodes (55): addDwellEmotes(), addEmote(), addGap(), addStand(), addWalk(), along(), buildRoomTable(), buildStayPlan() (+47 more)

### Community 18 - "ref_node_assert"
Cohesion: 0.12
Nodes (26): defineSlot(), docBytes(), SLOTS, byAtThenKey(), encoded(), latest, mapOf(), maxNumber() (+18 more)

### Community 19 - "amplify/package.json"
Cohesion: 0.17
Nodes (14): devDependencies, @aws-amplify/backend@^1.14.0, @aws-amplify/backend-cli@^1.6.0, aws-cdk-lib@^2.180.0, constructs@^10.3.0, name, private, scripts (+6 more)

### Community 20 - "PersonalRoom.tsx"
Cohesion: 0.06
Nodes (84): errorReason(), Offer, overDrawer(), PersonalRoom(), canPlaceNew(), carriedTo(), carryEnd(), carryMove() (+76 more)

### Community 21 - "prepare-models.mjs"
Cohesion: 0.06
Nodes (43): paintedCostume(), alongArm(), ARMS, armTurn(), BODIES, bruce, BRUCE_FIT, BRUCE_PLACE (+35 more)

### Community 22 - "Traversal"
Cohesion: 0.11
Nodes (5): JumpPose, clamp(), fixture(), jump(), Traversal

### Community 23 - "core/package.json"
Cohesion: 0.16
Nodes (13): devDependencies, @types/bcryptjs@^2.4.6, @types/pg@^8.11.10, main, name, private, scripts, typecheck (+5 more)

### Community 24 - "media/storage.ts"
Cohesion: 0.09
Nodes (18): CONTENT_TYPES, GET(), PUT(), ACCEPTED, createAssetFromUpload(), MAX_UPLOAD_BYTES, presignUpload(), registerUpload() (+10 more)

### Community 25 - "Placement"
Cohesion: 0.04
Nodes (24): Carry, PersonalRoomProps, HallArranger(), HallArrangerProps, HallRoomData, Painting, currentHallOrder(), hallPlacements() (+16 more)

### Community 26 - "session.ts"
Cohesion: 0.16
Nodes (17): GET(), PaintingRow, POST(), UPLOADS_PER_ARTIST, POST(), UPLOADS_PER_ARTIST, dynamic, RoomPage() (+9 more)

### Community 27 - "LeaderboardPanel"
Cohesion: 0.25
Nodes (14): PondBoardId, PondBoardPeriod, PondBoardRow, PondLeaderboard, formatInteger(), formatOdds(), nextMondayUtc(), BoardRow() (+6 more)

### Community 28 - "ambience.ts"
Cohesion: 0.12
Nodes (29): blade(), bloom(), BLOOMS, createPondAmbience(), update(), fishTexture(), frond(), FRONT_ROWS (+21 more)

### Community 29 - "core/src/index.ts"
Cohesion: 0.05
Nodes (110): PER_MEMBER, POST(), STATUS, insertCatch(), addBait(), bountyCatches(), BountyCatchRow, bountyViews() (+102 more)

### Community 30 - "Web Package Dependencies"
Cohesion: 0.07
Nodes (33): dependencies, embla-carousel-react@^8.6.0, motion@^13.1.1, next@^15.0.3, react@^19.0.0, react-dom@^19.0.0, swr@^2.5.1, three@^0.169.0 (+25 more)

### Community 31 - "Gamifying Tiny Museum — genre direction & engagement research"
Cohesion: 0.10
Nodes (19): 0.1 The core experience, 0.2 Systems that make gamification cheap to build, 0.3 Constraints that shape any recommendation, 0. What the game is today (the deep dive), 1.1 The landscape (seven candidates, with verdicts), 1.2 Recommendation: a **cozy gallery life-sim** — "the gallery you live in", 1.3 The five design pillars the genre implies, 1. Genre direction (+11 more)

### Community 32 - "atelier.ts"
Cohesion: 0.08
Nodes (27): AtelierImage, BuiltRoom, Cardigan, CARDIGAN_NAMES, Control, refresh(), isCardigan(), itemName() (+19 more)

### Community 33 - "remote-visitors.ts"
Cohesion: 0.06
Nodes (59): Assets, Scenery, CUTS, disposeBoards(), Mark, plane(), ROPE_CUTS, ropeSlices() (+51 more)

### Community 34 - "risk.ts"
Cohesion: 0.20
Nodes (20): WagerPicker(), chooseTier(), WagerPickerProps, chainChipLabel(), clampWagerStake(), formatMultiplier(), formatPayout(), formatWagerPercent() (+12 more)

### Community 35 - "amplify/tsconfig.json"
Cohesion: 0.20
Nodes (9): compilerOptions, module, moduleResolution, noUnusedLocals, noUnusedParameters, exclude, extends, include (+1 more)

### Community 36 - "5. Customization menu — what other people are doing"
Cohesion: 0.12
Nodes (16): 1. The target: what "Claude Opus 5.5" actually means, 2. Where your harness stands today (live config I read), 3. The honest gap model, 4. Quality levers, ranked by leverage, 5. Customization menu — what other people are doing, 6. Recommended starting kit for *your* profile, 7. What I can apply for you right now (needs your go-ahead), A. Prompt & persona (most common quality customizations) (+8 more)

### Community 37 - "gallery.ts"
Cohesion: 0.17
Nodes (19): hangAction(), movePieceAction(), unhangAction(), FloorControls(), move(), unhang(), formFor(), StorageControls() (+11 more)

### Community 38 - "handlers.ts"
Cohesion: 0.07
Nodes (47): loop(), sleep(), sweepStale(), DrainResult, handler(), repairFrames(), confirmedFollowers(), GalleryRow (+39 more)

### Community 39 - "Web TSConfig"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 40 - "Root Package Manifest"
Cohesion: 0.06
Nodes (36): [, width, height], description, devDependencies, concurrently@^9.1.0, esbuild@^0.24.0, ktx2-encoder@^0.6.0, maxrects-packer@^2.7.3, playwright@^1.63.0 (+28 more)

### Community 41 - "ref_node_assert"
Cohesion: 0.20
Nodes (9): water, depthAtLift(), PROP_DEPTH, MAX_DEPTH, PICTURE, pondFloor(), SHORE_MARGIN, area (+1 more)

### Community 42 - "createRemoteVisitors"
Cohesion: 0.17
Nodes (11): createPlayerCard(), hide(), onPointerDown(), createRemoteVisitors(), ensureLayer(), load(), placeOwn(), show() (+3 more)

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
Cohesion: 0.23
Nodes (13): sameOriginUrl(), PreparedGame, decodeImage(), fetchBitmap(), fetchRound(), guarded(), LoadedRound, loadInk() (+5 more)

### Community 47 - "src/types.ts"
Cohesion: 0.14
Nodes (15): ArtistPage(), dynamic, generateMetadata(), GET(), FollowForm(), getArtistPage(), listPieces(), pieceImageUrl() (+7 more)

### Community 48 - "slots/store.ts"
Cohesion: 0.12
Nodes (18): ANON_PREFIX, anonKey(), deviceKey(), isMemberSlotKey(), listKeys(), MEMBER_KEY, memberKey(), memberPrefix() (+10 more)

### Community 49 - "epoch.ts"
Cohesion: 0.09
Nodes (34): GET(), intParam(), GET(), sketchPool, unavailable(), currentEpoch(), ensureEpoch(), epochById() (+26 more)

### Community 50 - "Water.tsx"
Cohesion: 0.07
Nodes (38): AmbientShadow, box(), BUCKET, bunnyBox(), easeOut(), Glint, LEFT_STYLE, lineColour() (+30 more)

### Community 51 - "Worker Package Manifest"
Cohesion: 0.14
Nodes (14): dependencies, @tiny/core@*, exports, ./lambda, @tiny/core, main, name, private (+6 more)

### Community 52 - "Public Asset Manifest"
Cohesion: 0.12
Nodes (15): artworks, bunny, size, floor, size, fonts, icon-no-photos, size (+7 more)

### Community 53 - "SlotDef"
Cohesion: 0.18
Nodes (3): FakeServer, SlotState, SlotDef

### Community 54 - "vitals.ts"
Cohesion: 0.16
Nodes (15): dynamic, format(), grade(), METRICS, PAGES, PerformancePage(), RANGES, DEVICES (+7 more)

### Community 55 - "compose-atelier.mjs"
Cohesion: 0.12
Nodes (10): body, dressLayer, dressWidth, floralWidth, hanger, MANNEQUIN_CANVAS, mask, root (+2 more)

### Community 56 - "lib/presence.ts"
Cohesion: 0.09
Nodes (22): Entry, Connect, fetchTicket, HEARTBEAT_MS, HIDDEN_LIMIT_MS, RETRY_MS, sameLook(), samePose() (+14 more)

### Community 57 - "pond-format.ts"
Cohesion: 0.14
Nodes (24): fetchPondDex(), EXCHANGE_DAILY_STAMPS, EXCHANGE_PEARLS_PER_STAMP, FISH_ART, fishArt(), formatPercent(), formatShortSizeCm(), ODDS_BAIT (+16 more)

### Community 58 - "lib/slots/index.ts"
Cohesion: 0.08
Nodes (26): PresencePreviewPage(), AccountSheet(), continueAnyway(), doSignOut(), runDelete(), runName(), submit(), submitDelete() (+18 more)

### Community 59 - "economy/store.ts"
Cohesion: 0.07
Nodes (62): CARRY_CAP, carryAdd(), CarryEntry, carryPrune(), carryRemove(), chunk(), buildClaim(), BuiltClaim (+54 more)

### Community 60 - "pond-boards.ts"
Cohesion: 0.10
Nodes (30): BOARDS, oneOf(), PER_VISITOR, PERIODS, compare(), DexRow, displayName(), FeedRow (+22 more)

### Community 61 - "room.ts"
Cohesion: 0.14
Nodes (29): admitted(), Attachment, farewell(), GHOST_MS, HELLO_TIMEOUT_MS, holdsOf(), homeOf(), MAX_WAITING_PER_IP (+21 more)

### Community 62 - "minimap.ts"
Cohesion: 0.06
Nodes (36): place(), ATELIER_DOOR, createMinimap(), draw(), drawRoom(), floors(), follow(), sketchOf() (+28 more)

### Community 63 - "personal/room.ts"
Cohesion: 0.07
Nodes (12): CafeLink, ComingSoonNote, FunZoneSign, GiftShopSigns, GuestBoardNotes, Placards, placeLabel(), toScreen() (+4 more)

### Community 64 - "domain/guestboard.ts"
Cohesion: 0.12
Nodes (25): BoardScreen(), ComposeScreen(), ComposeScreenProps, blankDraft(), GuestBoard(), GuestBoardProps, View, StickyNoteProps (+17 more)

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

### Community 69 - "stage.ts"
Cohesion: 0.05
Nodes (39): Attachment, Carried, CarriedState, createCarried(), Character, Perch, Pose, centerYFor() (+31 more)

### Community 70 - "scene/ambience.ts"
Cohesion: 0.13
Nodes (13): BULBS, createHallAmbience(), finish(), glowTexture(), HallAmbience, mulberry(), painted(), vignetteTexture() (+5 more)

### Community 71 - "Confirmed issues"
Cohesion: 0.11
Nodes (18): Confirmed issues, E2E-002 — Valid edge placement rejected through floating-point precision, E2E-003 — One owned prop can be placed multiple times, E2E-004 — Reload before autosave silently loses the latest placement, E2E-005 — Failed save and failed Done have no visible mobile explanation, E2E-006 — Restoring connectivity does not retry a failed draft save, E2E-007 — Keyboard activation cannot place drawer items, E2E-008 — Creating an account from My Room leaves the signed-in user on the sign-in prompt (+10 more)

### Community 72 - "PondRoom.tsx"
Cohesion: 0.11
Nodes (20): Loading(), metadata, PondPage(), revealFloorTransition(), POND_NAME, PondLoading(), BOARD_TABS, PondOverlayKind (+12 more)

### Community 73 - "catalog.ts"
Cohesion: 0.17
Nodes (19): confirmClean(), CatalogItem, CatalogKind, FREE_CHARACTERS, isBuyable(), isCatalogItem(), ITEMS, ItemSlot (+11 more)

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
Nodes (20): blank(), colorAt(), decoded(), disposePondArt(), EDGE_BAND, EDGE_BANDS, EDGE_OVERLAP, edgeTexture() (+12 more)

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
Cohesion: 0.10
Nodes (38): NpcRoomInfo, NpcFrame, StayContext, along(), beginNext(), beginWork(), between(), blockedAt() (+30 more)

### Community 84 - "presence/package.json"
Cohesion: 0.14
Nodes (16): dependencies, @tiny/core@*, devDependencies, @cloudflare/workers-types@5.20261016.1, wrangler@4.151.1, @tiny/core, name, private (+8 more)

### Community 85 - "createAtelierRoom"
Cohesion: 0.20
Nodes (17): aspectOf(), AtelierActions, createAtelierRoom(), buildCollection(), form(), buildEntrance(), buildMirror(), buildRoom() (+9 more)

### Community 86 - "Asset pipeline: fast loading without losing sharpness"
Cohesion: 0.22
Nodes (8): Asset pipeline: fast loading without losing sharpness, Character rigs and the Costume Atelier, Completed, Ground rules, Phase 1: fingerprinted files at 2x and 3x, Phase 2: texture atlases for the hall sprites, Phase 3: KTX2 (Basis Universal), built and switched off, Phase 4: ThumbHash placeholders for paintings

### Community 87 - "Guest Board SQL Schema"
Cohesion: 0.67
Nodes (3): guest_notes, guest_notes_visible, rate_limits

### Community 88 - "Landscape Frame Asset"
Cohesion: 0.67
Nodes (3): frameLandscape, size, window

### Community 89 - "Hud.tsx"
Cohesion: 0.17
Nodes (14): BaitTray(), BaitTrayProps, Hud(), HudProps, HudWagerChip, GuestRollOptions, BAIT, BaitId (+6 more)

### Community 93 - "json"
Cohesion: 0.08
Nodes (72): POST(), POST(), GET(), GLOBAL, PER_IP, POST(), POST(), GLOBAL (+64 more)

### Community 94 - "ClosetView.tsx"
Cohesion: 0.07
Nodes (35): ClosetView(), onKeyDown(), LISTS, PLACE, PODIUM_SRC, Props, Slot, SPOTLIGHT_SRC (+27 more)

### Community 95 - "pond/room.ts"
Cohesion: 0.12
Nodes (23): FAR_LIFT, FAR_SCALE, liftAt(), pathHalfWidth(), pathX(), PondPath, scaleAt(), path (+15 more)

### Community 96 - "members.ts"
Cohesion: 0.07
Nodes (48): allowedOrigin(), isSameOriginMutation(), LOOPBACK, shutdown(), registry, started(), CatchExtra, clearCatches() (+40 more)

### Community 104 - "wardrobe.ts"
Cohesion: 0.08
Nodes (46): AtelierPage(), dynamic, metadata, allowedCharacter(), OwnedSnapshot, owns(), walletReady(), Atelier() (+38 more)

### Community 105 - "FishingView.tsx"
Cohesion: 0.13
Nodes (14): CONFETTI_COLORS, ConfettiPiece, makeConfetti(), RevealCard(), TIER_MS, TIER_SFX, useCountUp(), chainOffer (+6 more)

### Community 106 - "backend.ts"
Cohesion: 0.15
Nodes (12): amplifyDir, backend, everyMinutes, mediaBucket, missing, repoRoot, REQUIRED, setting() (+4 more)

### Community 107 - "ReadScreen.tsx"
Cohesion: 0.25
Nodes (9): BoardScreenProps, PinnedNotesProps, ReadScreen(), ReadScreenProps, messageLength(), StickyNote(), NOTE_PLACES, NotePlace (+1 more)

### Community 108 - "hang-tag.ts"
Cohesion: 0.12
Nodes (8): CARD, createHangTag(), HangTag, HangTagStyle, HOLE, KNOT, What goes, and what replaces it, Refusal

### Community 109 - "wallet/body.ts"
Cohesion: 0.23
Nodes (13): PER_MEMBER, POST(), baitIdOf(), integerOffset(), isRecord(), itemIdOf(), MAX_CLAIM_BATCH, MAX_WALLET_BODY_BYTES (+5 more)

### Community 110 - "graftCostume"
Cohesion: 0.27
Nodes (14): canvasFit(), compose(), graftCostume(), copyAccessor(), copyMaterial(), copyMesh(), copyTexture(), copyView() (+6 more)

### Community 111 - "pondgame/lib/api.ts"
Cohesion: 0.16
Nodes (27): RevealCardProps, buyPondBait(), CastOptions, castPond(), chainPondBait(), errorOf(), fetchPondState(), isRecord() (+19 more)

### Community 112 - "worker/tsconfig.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 113 - "core/tsconfig.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 114 - "import-landing-assets.mjs"
Cohesion: 0.13
Nodes (9): socket(), CAT, drop, EXPECTED, manifest, manifestPath, masters, root (+1 more)

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
Cohesion: 0.12
Nodes (29): isHome(), isItem(), isName(), isPid(), isSeq(), MAX_HOLDS, MAX_MESSAGE_BYTES, parseClientMessage() (+21 more)

### Community 119 - "Costume gallery doorway"
Cohesion: 0.50
Nodes (3): Costume gallery doorway, Curtain colour edit, Prompt

### Community 120 - "layout.ts"
Cohesion: 0.21
Nodes (9): cafeAfterIndex(), comingSoonWidth(), computeLayout(), cutRooms(), HallLayout, HallRoomKind, HallRoomSpan, hasPedestal() (+1 more)

### Community 121 - "Fishing forest: painted asset pass"
Cohesion: 0.10
Nodes (18): Assets, Bruce's collection refresh (2026-11-08), Fishing forest illustrations, Made by hand (not touched by the script), Main hall v2 (2026-11-10), Monets Lily Pond (2026-11-08), 1. Forest doorway, 2. Woodland noticeboard (+10 more)

### Community 124 - "The Costume Atelier"
Cohesion: 0.14
Nodes (13): Adding a character, Adding a costume, Art not supplied as files, Bruce's Chronicles, Checked against the mocks (2026-11-07), Code, Costume fit review, Floral collection (+5 more)

### Community 125 - "hitForVisitor"
Cohesion: 0.09
Nodes (36): POST(), ALLOWED, PER_VISITOR, POST(), POST(), GET(), POST(), POST() (+28 more)

### Community 126 - "rig.ts"
Cohesion: 0.13
Nodes (25): Layer, setCostumeVisibility(), follow(), canvasToModel(), disposeRigLayer(), Frame, layerTemplates, loadRig() (+17 more)

### Community 127 - "Curating the paintings (2026-11-07)"
Cohesion: 0.13
Nodes (14): 1. The registry and the table, 2. The studio's Location picker, 3. The rooms draw what is placed, 4. Credits, 5. Retiring self-serve artists, Building it, Curating the paintings (2026-11-07), Decided (+6 more)

### Community 128 - "actions.ts"
Cohesion: 0.07
Nodes (63): BugReportsPage(), dateFormat, dynamic, summary(), dynamic, GalleryPage(), dateFormat, dynamic (+55 more)

### Community 129 - "presence/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, types, exclude, extends, include, ../../tsconfig.base.json

### Community 130 - "wallet.ts"
Cohesion: 0.07
Nodes (50): PER_MEMBER, POST(), member(), now, piece(), randomId(), today, baitOf() (+42 more)

### Community 131 - "tsconfig.test.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 132 - "app/layout.tsx"
Cohesion: 0.14
Nodes (15): bethEllen, inspiratiq, metadata, notoSans, RootLayout(), sniglet, viewport, SoundContext (+7 more)

### Community 133 - "tab-turn.ts"
Cohesion: 0.16
Nodes (5): createTabTurn(), TabTurn, tab(), TurnEnv, TurnMessage

### Community 134 - "peers.ts"
Cohesion: 0.11
Nodes (10): fetch(), Env, INTERPOLATION_DELAY_MS, PEER_TIMEOUT_MS, PeerTable, positionAt(), Sample, look (+2 more)

### Community 135 - "run.ts"
Cohesion: 0.17
Nodes (9): admin, childEnv, client, database, fresh, migrations, target, pg@^8.13.1 (+1 more)

### Community 136 - "bug-reports.ts"
Cohesion: 0.12
Nodes (26): BugReportHost(), BugReportSheet, BugReportSheet(), send(), Status, collectContext(), inAppBrowser(), onOpenBugReport() (+18 more)

### Community 137 - "npc-layer.ts"
Cohesion: 0.10
Nodes (36): BY_ID, CAST, castMember(), FRAME, IDLE, idleCel(), NPC_WALK_SPEED, NpcCharacter (+28 more)

### Community 138 - "import-home-assets.mjs"
Cohesion: 0.14
Nodes (11): DOOR, DOOR_BACKDROP, drop, FURNITURE, manifest, manifestPath, masters, ORNATE_PAPER (+3 more)

### Community 139 - "room-places.ts"
Cohesion: 0.20
Nodes (15): PlaceKind, atelierRoomInfo(), atelierX(), copy(), FurniturePlacement, hallCache, onGround(), PERSONAL_FURNITURE (+7 more)

### Community 140 - "visits/page.tsx"
Cohesion: 0.25
Nodes (10): amount(), duration(), dynamic, LANDMARKS, PAGES, RANGES, share(), VisitsPage() (+2 more)

### Community 141 - "locations.ts"
Cohesion: 0.21
Nodes (21): sealEpoch(), discardLocation(), hasUnpublished(), locationStates(), nudgeInRow(), OWNER, placePainting(), PlaceResult (+13 more)

### Community 142 - "VitalsReporter.tsx"
Cohesion: 0.29
Nodes (8): firstPainting(), flush(), Metric, queue, REPORTED, VitalsReporter(), FIRST_PAINTING_MARK, MUSEUM_START_MARK

### Community 143 - "env.ts"
Cohesion: 0.22
Nodes (8): target, SCHEMA_DIR, isProduction(), presenceSecret(), repoRoot, required(), sessionSecret(), setting()

### Community 144 - "The Moonlit Pond — design"
Cohesion: 0.09
Nodes (22): Art the pond needs from the artist, Build contract (decided 2026-11-07), Build phases, Collection and goals, Done, Done, Guardrails, Leaderboards (+14 more)

### Community 145 - "Pond rework"
Cohesion: 0.18
Nodes (10): Baits, Client, Decisions, Done, Notes, Pond rework, Server, Species (+2 more)

### Community 146 - "createStage"
Cohesion: 0.15
Nodes (22): boundedCameraX(), createNearby(), createStage(), closeEntry(), enter(), initialize(), aim(), drawFrame() (+14 more)

### Community 147 - "Orchestration contract — you plan, DSH workers execute"
Cohesion: 0.29
Nodes (6): Briefing a worker, Budget hygiene, graphify, Orchestration contract — you plan, DSH workers execute, The worker, When not to delegate

### Community 148 - "tables.ts"
Cohesion: 0.11
Nodes (30): FrameShape, CatchWagerView, debugSpecies(), debugVariant(), guestTreasure(), rollGuest(), BAIT_BY_ID, catchPearls() (+22 more)

### Community 149 - "Conn"
Cohesion: 0.31
Nodes (4): connectWebSocket(), SocketHandlers, Conn, message()

### Community 150 - ".webSocketMessage"
Cohesion: 0.44
Nodes (3): attachmentOf(), Room, sendTo()

### Community 151 - "pond-state.ts"
Cohesion: 0.24
Nodes (15): fetchPondState(), PondStateView, PondTier, ensurePondStateStarted(), getPondStateSnapshot(), GUEST, listeners, LOADING (+7 more)

### Community 152 - "PondTicker.tsx"
Cohesion: 0.29
Nodes (11): fetchPondFeed(), PondFeedItem, catchLabel(), formatSizeCm(), speciesFor(), speciesName(), speciesTier(), isGolden() (+3 more)

### Community 154 - "SoundProvider.tsx"
Cohesion: 0.33
Nodes (4): StageOptions, RoomSound, SoundState, EffectName

### Community 155 - "Atelier: the dressing mirror, and show-don't-tell keeping"
Cohesion: 0.13
Nodes (14): Atelier: the dressing mirror, and show-don't-tell keeping, Build order, Built (2026-11-20), Decisions (2026-11-19), Follow-ups (2026-11-20), Goal, In the room, Keeping (+6 more)

### Community 156 - "react"
Cohesion: 0.08
Nodes (30): config, SECURITY_HEADERS, Loading(), dynamic, HomePage(), AccountHost(), AccountSheet, AccountMode (+22 more)

### Community 157 - "Walkthrough.tsx"
Cohesion: 0.12
Nodes (25): BACKDROP_STYLE, MoreArrow(), NavArrow(), Props, SLIDE, Walkthrough(), XIcon(), decodedFrames (+17 more)

### Community 158 - "createPondRoom"
Cohesion: 0.32
Nodes (13): createPondRoom(), approach(), busy(), finishWalk(), goTo(), leave(), move(), nearest() (+5 more)

### Community 159 - "useSoundEffects.ts"
Cohesion: 0.12
Nodes (26): BackgroundMusic, clampVolume(), isDocumentHidden(), Options, useBackgroundMusic(), VISIBILITY_EVENTS, EFFECTS, EffectSpec (+18 more)

### Community 160 - "BountyPanel.tsx"
Cohesion: 0.30
Nodes (10): claimPondBounty(), PondBounties, formatCountdown(), nextUtcMidnight(), utcDayLabel(), useCountdown(), useNow(), BountyPanel() (+2 more)

### Community 161 - "LandingFx"
Cohesion: 0.24
Nodes (7): glowSprite(), LandingFx(), onClick(), onVisibility(), tick(), Mote, 9. Decorating can't be done with the keyboard

### Community 162 - "import-hall-assets.mjs"
Cohesion: 0.09
Nodes (17): BASEBOARD, CURTAIN, drop, EXPECTED, file(), manifest, manifestPath, masters (+9 more)

### Community 163 - "painting-open"
Cohesion: 0.50
Nodes (4): file, kilobytes, seconds, painting-open

### Community 164 - "npc-sheet.cjs"
Cohesion: 0.24
Nodes (8): CFG, closeEye(), eraseMouth(), inpaint(), sample(), sharp, [src, out, cfgPath], warp()

### Community 165 - "Multiplayer ("other visitors") — plan v2 (Cloudflare)"
Cohesion: 0.14
Nodes (13): ScreenChrome(), 0. Summary, 10. Decisions, 1. Product contract changes (approved 2026-10-31), 2. What already exists that this builds on, 3.1 Generated names (everyone has one), 3. Names, 5.1 Emotes (v1) (+5 more)

### Community 167 - "GameDesktop.tsx"
Cohesion: 0.33
Nodes (7): loadGameDesktop(), GameDesktop(), GameDesktopProps, MinigameFrame(), Minigame, MinigameId, MINIGAMES

### Community 168 - "RigPreview.tsx"
Cohesion: 0.27
Nodes (10): RigPreviewPage(), NEXT, PROPS, RigPreview(), draw(), approach(), GROUNDED, rigFacing() (+2 more)

### Community 169 - "icon-basket"
Cohesion: 0.67
Nodes (3): icon-basket, file, vector

### Community 170 - "walk"
Cohesion: 0.33
Nodes (8): between(), CAT, Edge, EDGES, runLandingCat(), choosePeeker(), peek(), walk()

### Community 171 - "visits.ts"
Cohesion: 0.16
Nodes (18): state(), flush(), visibleMs(), VisitState, count(), currentSalts(), DEVICES, loadSalts() (+10 more)

### Community 172 - "Medium"
Cohesion: 0.17
Nodes (12): 10. Long names run off the name sign, 11. The rooms API skips the stale-tab member check, 12. The bunny is dragged along while you pan in Decorate, 6. Failed saves are nearly invisible, and nothing retries, 7. Two tabs editing the same room overwrite each other, 8. The drawer's card row can't be scrolled on touch screens, Checked and fine, Medium (+4 more)

### Community 174 - "Local end-to-end stress test — 2026-11-06"
Cohesion: 0.22
Nodes (7): Environment and coverage, Follow-up coverage, Issue index, Local end-to-end stress test — 2026-11-06, Measured load, Passing checks and interpretation limits, Test data and cleanup

### Community 176 - "defaultStore"
Cohesion: 0.26
Nodes (15): buy(), ensureStarted(), isBuyReply(), memberChanged(), publish(), readSession(), undoAdminUnlock(), unlockEverything() (+7 more)

### Community 177 - "memberFromRequest"
Cohesion: 0.43
Nodes (6): GET(), GET(), memberFromRequest(), exportMember(), readSlots(), exportWallet()

### Community 179 - "personal/room.ts"
Cohesion: 0.09
Nodes (28): personalShade(), createPersonalRoom(), light(), shade(), showArrangement(), signFilter(), DOOR_SIGN, gloomFor() (+20 more)

### Community 180 - "ColorRecall.tsx"
Cohesion: 0.32
Nodes (7): ColorRecall(), ColorRecallProps, Phase, readBest(), ColorRound, showMs(), loadColorRecall()

### Community 182 - "schedule.test.ts"
Cohesion: 0.07
Nodes (28): RESIDENT_IDS, FloorSpot, Job, JOBS, NpcGround, Place, ROOM_KINDS, ROOMS (+20 more)

### Community 183 - "Storyline (draft, saved 2026-11-17)"
Cohesion: 0.15
Nodes (12): Arc (soft, no fail state), Built so far, How it ties to what exists, Locked (2026-11-21, the owner), Next tasks (when picked up), Open questions, Premise, Revision (2026-11-21, the owner) (+4 more)

### Community 184 - "exports"
Cohesion: 0.15
Nodes (13): exports, ./brand, ./bugs, ./economy, ./guestboard, ./presence, ./presence/messages, ./presence/wire (+5 more)

### Community 185 - "hit.ts"
Cohesion: 0.17
Nodes (12): CoinWall, createHiddenCoin(), Spot, AlphaMap, alphaMapFor(), alphaMaps, buildAlphaMap(), isPaintedAt() (+4 more)

### Community 186 - "Low"
Cohesion: 0.25
Nodes (8): 13. Pages that redirect or don't exist answer 200, 14. Error codes reveal which room slugs exist, 15. The name sign slides under the top-right buttons in Decorate, 16. Level-up celebrations can be farmed, 17. No hint of where things are after panning away, 18. Too many items is only discovered by the server, 19. Development-only: page payloads include the full room row, Low

### Community 187 - "Open rooms and the tip jar (design, 2026-11-21)"
Cohesion: 0.25
Nodes (7): Built (2026-11-21), Decisions, How it works, Numbers (first pass, to tune), Open questions, Open rooms and the tip jar (design, 2026-11-21), Story hooks

### Community 190 - "walk"
Cohesion: 0.17
Nodes (10): 1. What is in this bundle, 3. The rig, 5. Blender-side work still to do (needs Blender; the author has it with an MCP bridge), 6. Open questions for the author, Handoff: move the Tiny Museum bunny from sprite frames to a rig, Approved v4 bunny in the hall, Assets, Existing interactions and fallback (+2 more)

### Community 191 - "audience.ts"
Cohesion: 0.10
Nodes (22): ConfirmFollow(), dynamic, dynamic, Unsubscribe(), AnalyticsPage(), dynamic, FollowNotice(), BRAND (+14 more)

### Community 193 - "Monets Lily Pond: exploration, UX and multiplayer QA"
Cohesion: 0.29
Nodes (6): Browser and interaction coverage, Changes made from the walkthrough, Monets Lily Pond: exploration, UX and multiplayer QA, Multiplayer and load, Practical limits, Regression checks and cleanup

### Community 194 - "setPondState"
Cohesion: 0.50
Nodes (8): refreshWalletNow(), exchangePondPearls(), setPondState(), BaitShop(), buy(), Exchange(), exchange(), FishmongerPanel()

### Community 195 - "dependencies"
Cohesion: 0.15
Nodes (13): dependencies, @aws-sdk/client-s3@^3.1121.0, @aws-sdk/s3-request-presigner@^3.1121.0, bcryptjs@^2.4.3, obscenity@^0.4.6, sharp@^0.33.5, thumbhash@^0.1.1, sharp (+5 more)

### Community 196 - "rooms.ts"
Cohesion: 0.15
Nodes (22): artist(), member(), piece(), randomId(), ownershipFor(), personalRoomFor(), restartInCloset(), RoomDbRow (+14 more)

### Community 197 - "pond-api.ts"
Cohesion: 0.16
Nodes (19): buyPondBait(), errorOf(), fetchPondBounties(), fetchPondLeaderboard(), isRecord(), isStateView(), memberId(), mutationHeaders() (+11 more)

### Community 198 - "ticket/route.ts"
Cohesion: 0.10
Nodes (32): PER_MEMBER, PUT(), PER_IP, POST(), presenceUrl(), Code, How it plays, Other visitors (+24 more)

### Community 201 - "messages.ts"
Cohesion: 0.31
Nodes (6): checkMessage(), INVISIBLE, MESSAGE_MAX, MessageCheck, normalizeMessage(), hasProfanity()

### Community 204 - "4. Transport: Cloudflare Durable Objects"
Cohesion: 0.25
Nodes (8): 4. Transport: Cloudflare Durable Objects, Decision (2026-10-31), Deploying, Identity cannot be forged, Local development and tests, Rooms and capacity, Shape of `apps/presence` (about 200 lines), main()

### Community 205 - "nearby.ts"
Cohesion: 0.18
Nodes (5): Nearby, NearbyReach, RoomSpan, reach, strip

### Community 206 - "plan.ts"
Cohesion: 0.43
Nodes (5): openingPlan(), prepareSketchGame(), planGame(), randomRound(), ROUND_SPREAD

### Community 207 - "themes.ts"
Cohesion: 0.06
Nodes (35): Door, doorOf(), wallpaperOf(), Catalogue, Data model (core), 1. Items placed against a zone edge fail to save, and the whole draft reverts, 2. One owned item can be placed many times, 3. Any save rejection throws away all unsaved work (+27 more)

### Community 208 - "CrowdPreview.tsx"
Cohesion: 0.27
Nodes (9): CrowdPreviewPage(), CrowdPreview(), draw(), KINDS, Stats, Window, clearRigLayer(), createRenderer() (+1 more)

### Community 209 - "createRigState"
Cohesion: 0.43
Nodes (6): cache, queue, render(), snapshotLook(), trim(), createRigState()

### Community 210 - "MuseumStage.tsx"
Cohesion: 0.13
Nodes (10): EXITS, isDoor(), linkedDoor(), LINKS, ActiveRoom, StageContext, StageContextValue, Stage (+2 more)

### Community 211 - "createCharacter"
Cohesion: 0.36
Nodes (7): createCharacter(), contextLost(), loadFallbackWalk(), loadKind(), loseRig(), setFrame(), Angler()

### Community 212 - "shopkeeper.ts"
Cohesion: 0.25
Nodes (7): RigPiece, COATS, createShopkeeper(), GREETINGS, OUTFIT, recolourFur(), SHOPKEEPER_NAME

### Community 214 - "reveal.ts"
Cohesion: 0.29
Nodes (4): InkMap, createReveal(), PENCIL, SketchReveal

### Community 217 - "BunnyArtist.tsx"
Cohesion: 0.40
Nodes (5): BunnyArtist(), BunnyMood, Pencil(), POSES, 4. Suggested plan

## Knowledge Gaps
- **5 isolated node(s):** `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1602 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **32 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `actions.ts`, `SketchGuess.tsx`, `builtUrl`, `app/layout.tsx`, `bug-reports.ts`, `machine.ts`, `Museum.tsx`, `Test Fakes and Helpers`, `VitalsReporter.tsx`, `features/economy/index.ts`, `room-events.ts`, `PersonalRoom.tsx`, `pond-state.ts`, `PondTicker.tsx`, `Placement`, `LeaderboardPanel`, `Walkthrough.tsx`, `Web Package Dependencies`, `useSoundEffects.ts`, `BountyPanel.tsx`, `LandingFx`, `risk.ts`, `gallery.ts`, `RigPreview.tsx`, `src/types.ts`, `defaultStore`, `slots/store.ts`, `Water.tsx`, `ColorRecall.tsx`, `pond-format.ts`, `lib/slots/index.ts`, `domain/guestboard.ts`, `pond-api.ts`, `PondRoom.tsx`, `CrowdPreview.tsx`, `MuseumStage.tsx`, `Hud.tsx`, `ClosetView.tsx`, `wardrobe.ts`, `FishingView.tsx`, `ReadScreen.tsx`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._
- **What connects `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json` to the rest of the system?**
  _5 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `stage.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.030297029702970296 - nodes in this community are weakly interconnected._
- **Why does `three` connect `stage.ts` to `atelier.ts`, `remote-visitors.ts`, `stage.ts`, `npc-sheet.cjs`, `scene/ambience.ts`, `scene/assets.ts`, `npc-layer.ts`, `wardrobe.ts`, `hang-tag.ts`, `scene.ts`, `cozy.ts`, `pond/art.ts`, `hit.ts`, `rig.ts`, `ambience.ts`, `Web Package Dependencies`, `pond/room.ts`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Should `SketchGuess.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11260504201680673 - nodes in this community are weakly interconnected._
- **Why does `defaultStore()` connect `defaultStore` to `stage.ts`, `remote-visitors.ts`, `pond-api.ts`, `stage.ts`, `wardrobe.ts`, `SyncStore`, `pondgame/lib/api.ts`, `room-events.ts`, `slots/store.ts`, `createStage`, `PersonalRoom.tsx`, `pond-state.ts`, `lib/slots/index.ts`, `economy/store.ts`, `react`, `createPondRoom`, `pond/room.ts`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Should `DecorController` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._