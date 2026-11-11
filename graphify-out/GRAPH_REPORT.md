# Graph Report - tiny-museum  (2026-11-10)

## Corpus Check
- 487 files · ~257,307 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 78 file(s) not represented in the graph (top: .avif 39, .glb 30, .css 4)

## Summary
- 4201 nodes · 10906 edges · 206 communities (178 shown, 28 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 196 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0f4e7e33`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- actions.ts
- tab-turn.ts
- SketchGuess.tsx
- themes.ts
- jobs.ts
- round.ts
- floor.ts
- Core Asset Manifest
- scene/assets.ts
- SyncStore
- machine.ts
- PondRoom.tsx
- Test Fakes and Helpers
- scene.ts
- cozy.ts
- currentMember
- join-room.ts
- createAtelierRoom
- ref_node_assert
- amplify/package.json
- atelier.ts
- prepare-models.mjs
- Traversal
- core/package.json
- hit
- logic.ts
- personal/room.ts
- Museum.tsx
- PersonalRoom.tsx
- core/src/index.ts
- Web Package Dependencies
- Gamifying Tiny Museum — genre direction & engagement research
- pond/art.ts
- slots/store.ts
- risk.ts
- amplify/tsconfig.json
- 5. Customization menu — what other people are doing
- wallet.ts
- rules.ts
- Web TSConfig
- Root Package Manifest
- bug-reports.ts
- PondTicker.tsx
- import-fishing-assets.mjs
- Base TSConfig
- Amplify Build Spec
- next
- db-tests/pond.test.ts
- FakeServer
- handlers.ts
- Water.tsx
- Worker Package Manifest
- Public Asset Manifest
- pond-api.ts
- hitForVisitor
- compose-atelier.mjs
- Character
- pond-format.ts
- AccountSheet.tsx
- economy/store.ts
- domain/sketch.ts
- room.ts
- minimap.ts
- db-tests/pond.test.ts
- Handoff: move the Tiny Museum bunny from sprite frames to a rig
- Sound Effect Assets
- locations.ts
- Custom HTTP Headers
- Sharp Layer Package
- createHallRoom
- Other visitors
- gallery/page.tsx
- wallet/body.ts
- FilesystemStorage
- Visits SQL Schema
- Bunny Walk Sprites
- Room Mockup Settings
- Service Worker Caching
- HallCallbacks
- remote-visitors.ts
- createPresence
- members
- Frame Window Asset
- bug-report.ts
- presence/package.json
- walk.ts
- Asset pipeline: fast loading without losing sharpness
- Guest Board SQL Schema
- Landscape Frame Asset
- art-cache.ts
- Bug Reports SQL Schema
- Vitals SQL Schema
- json
- next
- pond/room.ts
- ticket/route.ts
- Run-Once Schema
- createStage
- FishingView.tsx
- ticket.ts
- (hall)/page.tsx
- AtelierKeeps.tsx
- lib/presence.ts
- RigPreview.tsx
- pondgame/lib/api.ts
- worker/tsconfig.json
- core/tsconfig.json
- Tiny Museum
- How to Design for Failures — ByteByteGo Newsletter
- Worker instructions — DSH headless agents
- Backend
- protocol.ts
- Costume gallery doorway
- LeaderboardPanel.tsx
- Fishing forest: painted asset pass
- audio/README.md
- .claude/CLAUDE.md
- xdog.ts
- icons.tsx
- rig.ts
- Curating the paintings (2026-11-07)
- nearby.ts
- presence/tsconfig.json
- limited
- tsconfig.test.json
- app/layout.tsx
- messages.ts
- lib/presence.ts
- query
- Confirmed issues
- stage.ts
- hall/room.ts
- epoch.ts
- Item
- sketchguess/lib/api.ts
- visits.ts
- vitals.ts
- The Moonlit Pond — design
- Pond rework
- env.ts
- Orchestration contract — you plan, DSH workers execute
- tables.ts
- layout.ts
- placeLabel
- pond-state.ts
- createRemoteVisitors
- AssetImage
- useBackgroundMusic.ts
- hit.ts
- walk.ts
- Walkthrough.tsx
- createPondRoom
- links.ts
- VitalsReporter.tsx
- HallArranger.tsx
- createPlacementLayer
- painting-open
- Backdrop
- Multiplayer ("other visitors") — plan v2 (Cloudflare)
- SoundProvider.tsx
- BountyPanel.tsx
- a/[slug]/page.tsx
- icon-basket
- reveal.ts
- AssetImage
- floor.test.ts
- bunny-left
- lib/slots/index.ts
- bunny-right
- CrowdPreview.tsx
- shopkeeper.ts
- icon-home
- confirm/page.tsx
- wardrobe.ts
- ticket
- AccountSheet
- run.ts
- rooms/art.ts
- S3Storage
- 4. Transport: Cloudflare Durable Objects
- getStorage
- Cafe
- visits/page.tsx
- createMinimap
- SoundProvider.tsx
- Low
- Monets Lily Pond: exploration, UX and multiplayer QA
- Rig
- ArtCache
- Local end-to-end stress test — 2026-11-06
- Notes
- PerfMeter
- publish.ts
- BunnyArtist.tsx
- setCostumeVisibility
- Lobby
- Minimap
- focus.ts
- HelmShare

## God Nodes (most connected - your core abstractions)
1. `react` - 75 edges
2. `json()` - 69 edges
3. `query()` - 68 edges
4. `hit()` - 55 edges
5. `limited()` - 49 edges
6. `next` - 44 edges
7. `Traversal` - 44 edges
8. `three` - 41 edges
9. `SyncStore` - 41 edges
10. `FishingView()` - 39 edges

## Surprising Connections (you probably didn't know these)
- `Code` --references--> `followOutfit()`  [INFERRED]
  docs/costume-atelier.md → apps/web/src/features/hall/scene/wardrobe.ts
- `E2E-009 — Room mutations ignore stale account identity` --references--> `memberFromRequest()`  [INFERRED]
  docs/testing/local-e2e-stress-2026-11-06.md → apps/web/src/shared/lib/member-route.ts
- `19. Development-only: page payloads include the full room row` --references--> `getRoom()`  [INFERRED]
  docs/personal-room-issues.md → packages/core/src/domain/rooms.ts
- `Done` --references--> `useBait()`  [INFERRED]
  docs/pond-rework.md → packages/core/src/domain/wallet.ts
- `Server` --references--> `readPondTicket()`  [INFERRED]
  docs/pond-rework.md → packages/core/src/economy/pond.ts

## Import Cycles
- None detected.

## Communities (206 total, 28 thin omitted)

### Community 0 - "actions.ts"
Cohesion: 0.13
Nodes (28): dateFormat, dynamic, GuestBoardPage(), dynamic, LocationsPage(), back(), deleteGuestNoteAction(), deletePieceAction() (+20 more)

### Community 1 - "tab-turn.ts"
Cohesion: 0.16
Nodes (5): createTabTurn(), TabTurn, tab(), TurnEnv, TurnMessage

### Community 2 - "SketchGuess.tsx"
Cohesion: 0.10
Nodes (31): bestKeyFor(), BURST, clueUrl(), openingPlan(), Phase, pickAtRandom(), prepareSketchGame(), readDifficulty() (+23 more)

### Community 3 - "themes.ts"
Cohesion: 0.08
Nodes (29): 1. Items placed against a zone edge fail to save, and the whole draft reverts, 2. One owned item can be placed many times, 3. Any save rejection throws away all unsaved work, 4. Changes made just before leaving are lost, 5. Fish trophies can be claimed without playing, High, GAMES, isRecord() (+21 more)

### Community 4 - "jobs.ts"
Cohesion: 0.25
Nodes (15): loop(), shutdown(), sleep(), sweepStale(), DrainResult, handler(), repairFrames(), repairUnframed() (+7 more)

### Community 5 - "round.ts"
Cohesion: 0.12
Nodes (33): ColorRecall(), ColorRecallProps, Phase, readBest(), deltaE(), GAMUT_EPSILON, hexToOklab(), inGamut() (+25 more)

### Community 6 - "floor.ts"
Cohesion: 0.21
Nodes (25): clone(), closestOnSegment(), contains(), cross(), crossVec(), DepthView, distanceSq(), dot() (+17 more)

### Community 7 - "Core Asset Manifest"
Cohesion: 0.05
Nodes (41): artworks, audio, file, megabytes, seconds, sourceName, startedAt, bunny (+33 more)

### Community 8 - "scene/assets.ts"
Cohesion: 0.07
Nodes (48): AssetManifest, assetUrl(), bitmapTexture(), blankImage(), CAFE_CAT_FRAMES, CompressedLoader, elementTexture(), ENTRANCE_FILES (+40 more)

### Community 9 - "SyncStore"
Cohesion: 0.16
Nodes (6): encodeStored(), parseStored(), readStored(), writeStored(), SyncStore, upgrade()

### Community 10 - "machine.ts"
Cohesion: 0.09
Nodes (52): CAST_ERRORS, coarsePointer(), FishingView(), initialEasyReel(), isTyping(), LOST, PondGameProps, Toast (+44 more)

### Community 11 - "PondRoom.tsx"
Cohesion: 0.12
Nodes (21): Loading(), metadata, PondPage(), POND_NAME, PondLoading(), BOARD_TABS, PondOverlayKind, PondPanels() (+13 more)

### Community 12 - "Test Fakes and Helpers"
Cohesion: 0.11
Nodes (28): deferredFetch(), deviceSlot, FakeEvents, FakeStorage, fixture, fixtureB, fixtureRegistry, fixtureRegistryBoth (+20 more)

### Community 13 - "scene.ts"
Cohesion: 0.05
Nodes (21): MuseumProps, disposeDisplayTexture(), loadDisplayTexture(), prefersAvif(), createHiddenCoin(), HiddenCoin, createNotes(), createPedestal() (+13 more)

### Community 14 - "cozy.ts"
Cohesion: 0.15
Nodes (22): ATELIER_PROPS, AtelierImage, canvasTexture(), CozyBackdrop, cozyPropImageUrl(), cozyTheme, disposeCozyArt(), drawingOn() (+14 more)

### Community 15 - "currentMember"
Cohesion: 0.14
Nodes (27): GET(), GET(), GET(), GET(), PER_MEMBER, GET(), PER_MEMBER, BOARDS (+19 more)

### Community 16 - "join-room.ts"
Cohesion: 0.13
Nodes (31): ChatButton(), REFUSED, joinRoom(), STANDING, announceNameChange(), emit(), getPeople(), isInRoom() (+23 more)

### Community 17 - "createAtelierRoom"
Cohesion: 0.18
Nodes (23): aspectOf(), AtelierActions, createAtelierRoom(), buildCollection(), form(), buildEntrance(), buildRoom(), picture() (+15 more)

### Community 18 - "ref_node_assert"
Cohesion: 0.12
Nodes (29): defineSlot(), docBytes(), SLOTS, byAtThenKey(), encoded(), latest, mapOf(), maxNumber() (+21 more)

### Community 19 - "amplify/package.json"
Cohesion: 0.08
Nodes (26): amplifyDir, backend, everyMinutes, mediaBucket, missing, repoRoot, REQUIRED, setting() (+18 more)

### Community 20 - "atelier.ts"
Cohesion: 0.05
Nodes (29): AtelierImage, AtelierRoom, BuiltRoom, Cardigan, CARDIGAN_NAMES, Control, Display, ATELIER_END_X (+21 more)

### Community 21 - "prepare-models.mjs"
Cohesion: 0.06
Nodes (46): canvasFit(), compose(), graftCostume(), copyAccessor(), copyMaterial(), copyMesh(), copyTexture(), copyView() (+38 more)

### Community 22 - "Traversal"
Cohesion: 0.11
Nodes (5): JumpPose, clamp(), fixture(), jump(), Traversal

### Community 23 - "core/package.json"
Cohesion: 0.06
Nodes (40): dependencies, @aws-sdk/client-s3@^3.1121.0, @aws-sdk/s3-request-presigner@^3.1121.0, bcryptjs@^2.4.3, obscenity@^0.4.6, pg@^8.13.1, sharp@^0.33.5, thumbhash@^0.1.1 (+32 more)

### Community 24 - "hit"
Cohesion: 0.29
Nodes (11): roomEditor, PER_EDITOR, PUT(), versionOf(), PER_EDITOR, POST(), PER_MEMBER, POST() (+3 more)

### Community 25 - "logic.ts"
Cohesion: 0.10
Nodes (26): DecorDrawer, DecorDrawerProps, SharingState, Tab, TABS, categoryOf(), cozyLevel, cozyWorth() (+18 more)

### Community 26 - "personal/room.ts"
Cohesion: 0.05
Nodes (7): Carry, PersonalRoomProps, DecorController, PersonalRoomOptions, GhostOptions, PlacementLayer, Placement

### Community 27 - "Museum.tsx"
Cohesion: 0.15
Nodes (22): Loading(), AtelierLoading(), CoinFound, ColorRecall, GameDesktop, GuestBoard, HallArranger, HelpGuide (+14 more)

### Community 28 - "PersonalRoom.tsx"
Cohesion: 0.12
Nodes (27): errorReason(), overDrawer(), PersonalRoom(), canPlaceNew(), carryEnd(), carryMove(), onCardKey(), onCardPointerDown() (+19 more)

### Community 29 - "core/src/index.ts"
Cohesion: 0.06
Nodes (97): addBait(), PondBoardMe, PondBoardRow, PondFeedItem, Rep, BountyCatchRow, castPond(), isRecord() (+89 more)

### Community 30 - "Web Package Dependencies"
Cohesion: 0.07
Nodes (33): dependencies, embla-carousel-react@^8.6.0, motion@^13.1.1, next@^15.0.3, react@^19.0.0, react-dom@^19.0.0, swr@^2.5.1, three@^0.169.0 (+25 more)

### Community 31 - "Gamifying Tiny Museum — genre direction & engagement research"
Cohesion: 0.10
Nodes (19): 0.1 The core experience, 0.2 Systems that make gamification cheap to build, 0.3 Constraints that shape any recommendation, 0. What the game is today (the deep dive), 1.1 The landscape (seven candidates, with verdicts), 1.2 Recommendation: a **cozy gallery life-sim** — "the gallery you live in", 1.3 The five design pillars the genre implies, 1. Genre direction (+11 more)

### Community 32 - "pond/art.ts"
Cohesion: 0.27
Nodes (12): colorAt(), disposePondArt(), EDGE_BAND, EDGE_BANDS, EDGE_OVERLAP, edgeTexture(), imageOf(), loadPondArt() (+4 more)

### Community 33 - "slots/store.ts"
Cohesion: 0.15
Nodes (17): ANON_PREFIX, anonKey(), deviceKey(), isMemberSlotKey(), listKeys(), MEMBER_KEY, memberKey(), memberPrefix() (+9 more)

### Community 34 - "risk.ts"
Cohesion: 0.12
Nodes (32): Hud(), HudProps, HudWagerChip, WagerPicker(), chooseTier(), WagerPickerProps, CastOptions, PondStateView (+24 more)

### Community 35 - "amplify/tsconfig.json"
Cohesion: 0.20
Nodes (9): compilerOptions, module, moduleResolution, noUnusedLocals, noUnusedParameters, exclude, extends, include (+1 more)

### Community 36 - "5. Customization menu — what other people are doing"
Cohesion: 0.12
Nodes (16): 1. The target: what "Claude Opus 5.5" actually means, 2. Where your harness stands today (live config I read), 3. The honest gap model, 4. Quality levers, ranked by leverage, 5. Customization menu — what other people are doing, 6. Recommended starting kit for *your* profile, 7. What I can apply for you right now (needs your go-ahead), A. Prompt & persona (most common quality customizations) (+8 more)

### Community 37 - "wallet.ts"
Cohesion: 0.08
Nodes (44): grantPearls(), member(), now, piece(), randomId(), today, applyClaim(), baitCounts() (+36 more)

### Community 38 - "rules.ts"
Cohesion: 0.15
Nodes (18): localDay(), at(), EXCHANGE_DAILY_STAMPS, EXCHANGE_PEARLS_PER_STAMP, exchangeClaimKey(), GAME_DAILY_CAP, GameId, GAMES (+10 more)

### Community 39 - "Web TSConfig"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 40 - "Root Package Manifest"
Cohesion: 0.07
Nodes (35): description, devDependencies, concurrently@^9.1.0, esbuild@^0.24.0, ktx2-encoder@^0.6.0, maxrects-packer@^2.7.3, playwright@^1.63.0, @types/node@^22.9.0 (+27 more)

### Community 41 - "bug-reports.ts"
Cohesion: 0.10
Nodes (26): GET(), BugReport, BugReportDto, BugReportRateLimited, BugReportRejected, BugRow, CONTEXT_KEYS, EVERYONE (+18 more)

### Community 42 - "PondTicker.tsx"
Cohesion: 0.29
Nodes (11): fetchPondFeed(), PondFeedItem, catchLabel(), formatSizeCm(), speciesFor(), speciesName(), speciesTier(), isGolden() (+3 more)

### Community 43 - "import-fishing-assets.mjs"
Cohesion: 0.05
Nodes (26): CANVAS, clear, FONT, FRAME, heights, layer(), layout, lossless (+18 more)

### Community 44 - "Base TSConfig"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, lib, module, moduleResolution (+9 more)

### Community 45 - "Amplify Build Spec"
Cohesion: 0.12
Nodes (16): applications, appRoot, backend, frontend, baseDirectory, files, phases, commands (+8 more)

### Community 46 - "next"
Cohesion: 0.13
Nodes (21): GET(), PaintingRow, POST(), UPLOADS_PER_ARTIST, POST(), UPLOADS_PER_ARTIST, dynamic, HomePage() (+13 more)

### Community 47 - "db-tests/pond.test.ts"
Cohesion: 0.13
Nodes (21): insertCatch(), compare(), DexRow, displayName(), FeedRow, getPondDex(), getPondFeed(), getPondLeaderboard() (+13 more)

### Community 48 - "FakeServer"
Cohesion: 0.18
Nodes (3): FakeServer, SlotState, SlotDef

### Community 49 - "handlers.ts"
Cohesion: 0.09
Nodes (32): Where things stand, confirmedFollowers(), sealEpoch(), DisplayPieceRow, handleDerivatives(), handleNotifyFollowers(), handleRenderDisplay(), handleSealEpoch() (+24 more)

### Community 50 - "Water.tsx"
Cohesion: 0.09
Nodes (32): AmbientShadow, box(), BUCKET, bunnyBox(), easeOut(), LEFT_STYLE, makeAmbient(), PAW_IN_SPRITE (+24 more)

### Community 51 - "Worker Package Manifest"
Cohesion: 0.14
Nodes (14): dependencies, @tiny/core@*, exports, ./lambda, @tiny/core, main, name, private (+6 more)

### Community 52 - "Public Asset Manifest"
Cohesion: 0.12
Nodes (15): artworks, bunny, size, floor, size, fonts, icon-no-photos, size (+7 more)

### Community 53 - "pond-api.ts"
Cohesion: 0.24
Nodes (19): buyPondBait(), claimPondBounty(), errorOf(), exchangePondPearls(), fetchPondBounties(), fetchPondDex(), fetchPondLeaderboard(), fetchPondState() (+11 more)

### Community 54 - "hitForVisitor"
Cohesion: 0.13
Nodes (23): POST(), ALLOWED, POST(), POST(), POST(), POST(), GET(), PER_VISITOR (+15 more)

### Community 55 - "compose-atelier.mjs"
Cohesion: 0.14
Nodes (9): body, dressLayer, dressWidth, floralWidth, MANNEQUIN_CANVAS, mask, root, sourceSize (+1 more)

### Community 56 - "Character"
Cohesion: 0.07
Nodes (8): Carried, Character, Helm, Matcha, createSitting(), hop(), DecorLive, ScreenBox

### Community 57 - "pond-format.ts"
Cohesion: 0.14
Nodes (25): EXCHANGE_DAILY_STAMPS, EXCHANGE_PEARLS_PER_STAMP, FISH_ART, fishArt(), formatPercent(), formatShortSizeCm(), ODDS_BAIT, POND_BAIT (+17 more)

### Community 58 - "AccountSheet.tsx"
Cohesion: 0.13
Nodes (19): openAccount(), openBugReport(), fitWidth(), HelpGuide(), HelpGuideProps, POINTER_STEPS, TOUCH_STEPS, loadGameDesktop() (+11 more)

### Community 59 - "economy/store.ts"
Cohesion: 0.08
Nodes (56): CARRY_CAP, carryAdd(), CarryEntry, carryPrune(), carryRemove(), chunk(), ClaimRequest, tzOffsetNow() (+48 more)

### Community 60 - "domain/sketch.ts"
Cohesion: 0.12
Nodes (25): listPieces(), pieceImageUrl(), PieceRow, toPieceDto(), planSketchRound(), SKETCH_CHOICES, SketchCandidate, SketchPieceRow (+17 more)

### Community 61 - "room.ts"
Cohesion: 0.10
Nodes (33): attachmentOf(), socket(), admitted(), Attachment, farewell(), GHOST_MS, HELLO_TIMEOUT_MS, holdsOf() (+25 more)

### Community 62 - "minimap.ts"
Cohesion: 0.11
Nodes (22): ATELIER_DOOR, doorPoint(), FALLBACK_TINT, FloorSketch, ICONS, MAP_PLACES, MAP_SCALE, MapPlace (+14 more)

### Community 63 - "db-tests/pond.test.ts"
Cohesion: 0.12
Nodes (26): CatchExtra, clearCatches(), COLUMNS, grantPearls(), member(), namedMember(), randomId(), setState() (+18 more)

### Community 64 - "Handoff: move the Tiny Museum bunny from sprite frames to a rig"
Cohesion: 0.15
Nodes (11): 1. What is in this bundle, 2. How the game draws the bunny today (read from the repo, not run), 3. The rig, 5. Blender-side work still to do (needs Blender; the author has it with an MCP bridge), 6. Open questions for the author, Handoff: move the Tiny Museum bunny from sprite frames to a rig, Approved v4 bunny in the hall, Assets (+3 more)

### Community 65 - "Sound Effect Assets"
Cohesion: 0.22
Nodes (9): file, kilobytes, seconds, file, kilobytes, seconds, soundEffects, click (+1 more)

### Community 66 - "locations.ts"
Cohesion: 0.21
Nodes (23): publishLocationAction(), discardLocation(), hasUnpublished(), locationStates(), nudgeInRow(), OWNER, placePainting(), PlaceResult (+15 more)

### Community 67 - "Custom HTTP Headers"
Cohesion: 0.25
Nodes (7): applications, appRoot, customHeaders, headers, pattern, key, value

### Community 68 - "Sharp Layer Package"
Cohesion: 0.33
Nodes (6): dependencies, sharp@^0.33.5, description, sharp, name, private

### Community 69 - "createHallRoom"
Cohesion: 0.16
Nodes (21): state(), earn(), createHallRoom(), buildRoom(), cafeRoom(), tap(), enterAtelier(), entranceRoom() (+13 more)

### Community 70 - "Other visitors"
Cohesion: 0.29
Nodes (6): How it plays, Other visitors, Privacy, Running it in production, Running it locally, Staying consistent

### Community 71 - "gallery/page.tsx"
Cohesion: 0.12
Nodes (27): AnalyticsPage(), dynamic, dynamic, GalleryPage(), createCodeAction(), deleteCodeAction(), hangAction(), movePieceAction() (+19 more)

### Community 72 - "wallet/body.ts"
Cohesion: 0.16
Nodes (17): PER_MEMBER, POST(), baitIdOf(), integerOffset(), isRecord(), itemIdOf(), MAX_CLAIM_BATCH, MAX_WALLET_BODY_BYTES (+9 more)

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

### Community 79 - "remote-visitors.ts"
Cohesion: 0.10
Nodes (11): Attachment, createCharacter(), contextLost(), loseRig(), rigFacing(), RigAttachment, FLAT, MAX_SHOWN (+3 more)

### Community 80 - "createPresence"
Cohesion: 0.19
Nodes (13): createPresence(), drop(), heartbeat(), maybeSend(), onPageHide(), receive(), scheduleRetry(), send() (+5 more)

### Community 81 - "members"
Cohesion: 0.12
Nodes (25): coin_claims, coin_claims_daily, wallet_bait, wallet_items, wallets, member_sessions, member_sessions_member, member_slots (+17 more)

### Community 82 - "Frame Window Asset"
Cohesion: 0.50
Nodes (4): frame, size, window, windowAspect

### Community 83 - "bug-report.ts"
Cohesion: 0.20
Nodes (15): BugReportHost(), BugReportSheet, BugReportSheet(), send(), Status, collectContext(), inAppBrowser(), onOpenBugReport() (+7 more)

### Community 84 - "presence/package.json"
Cohesion: 0.14
Nodes (16): dependencies, @tiny/core@*, devDependencies, @cloudflare/workers-types@5.20261016.1, wrangler@4.151.1, @tiny/core, name, private (+8 more)

### Community 85 - "walk.ts"
Cohesion: 0.19
Nodes (4): FloorPoint, WalkArea, depthOf(), Walker

### Community 86 - "Asset pipeline: fast loading without losing sharpness"
Cohesion: 0.22
Nodes (8): Asset pipeline: fast loading without losing sharpness, Character rigs and the Costume Atelier, Completed, Ground rules, Phase 1: fingerprinted files at 2x and 3x, Phase 2: texture atlases for the hall sprites, Phase 3: KTX2 (Basis Universal), built and switched off, Phase 4: ThumbHash placeholders for paintings

### Community 87 - "Guest Board SQL Schema"
Cohesion: 0.67
Nodes (3): guest_notes, guest_notes_visible, rate_limits

### Community 88 - "Landscape Frame Asset"
Cohesion: 0.67
Nodes (3): frameLandscape, size, window

### Community 89 - "art-cache.ts"
Cohesion: 0.21
Nodes (9): ArtCacheOptions, createArtCache(), drop(), expireLater(), hold(), HeldArt, LoadResult, Slot (+1 more)

### Community 93 - "json"
Cohesion: 0.11
Nodes (34): POST(), POST(), GLOBAL, PER_IP, POST(), POST(), PER_MEMBER, PUT() (+26 more)

### Community 94 - "next"
Cohesion: 0.17
Nodes (14): config, SECURITY_HEADERS, BugReportsPage(), dateFormat, dynamic, summary(), dynamic, StudioHome() (+6 more)

### Community 95 - "pond/room.ts"
Cohesion: 0.11
Nodes (22): FAR_LIFT, FAR_SCALE, liftAt(), pathHalfWidth(), PondPath, scaleAt(), path, FOREST_GATE (+14 more)

### Community 96 - "ticket/route.ts"
Cohesion: 0.11
Nodes (37): Code, 3.2 Chosen names (members), registry, started(), hashPassword(), verifyPassword(), canonicalEmail(), changePassword() (+29 more)

### Community 104 - "createStage"
Cohesion: 0.16
Nodes (21): boundedCameraX(), createNearby(), createStage(), closeEntry(), enter(), initialize(), aim(), drawFrame() (+13 more)

### Community 105 - "FishingView.tsx"
Cohesion: 0.12
Nodes (16): CONFETTI_COLORS, ConfettiPiece, makeConfetti(), RevealCard(), RevealCardProps, TIER_MS, TIER_SFX, useCountUp() (+8 more)

### Community 106 - "ticket.ts"
Cohesion: 0.14
Nodes (18): fetch(), Env, parseRoom(), decoder, encoder, fromBase64Url(), HmacKey, isOwn() (+10 more)

### Community 107 - "(hall)/page.tsx"
Cohesion: 0.38
Nodes (7): Loading(), dynamic, Hall(), MuseumPage(), DENSITY_MEDIA, HallPreload(), HallSkeleton()

### Community 108 - "AtelierKeeps.tsx"
Cohesion: 0.10
Nodes (28): MuseumLayout(), CoinToast(), Toast, Purse(), Stamp(), WalletProvider(), serverSnapshot, useEarnEvents() (+20 more)

### Community 109 - "lib/presence.ts"
Cohesion: 0.08
Nodes (22): Connect, connectWebSocket(), fetchTicket, HEARTBEAT_MS, HIDDEN_LIMIT_MS, RETRY_MS, sameLook(), samePose() (+14 more)

### Community 110 - "RigPreview.tsx"
Cohesion: 0.26
Nodes (9): RigPreviewPage(), NEXT, PROPS, RigPreview(), draw(), approach(), GROUNDED, stepRigState() (+1 more)

### Community 111 - "pondgame/lib/api.ts"
Cohesion: 0.33
Nodes (14): buyPondBait(), castPond(), chainPondBait(), errorOf(), fetchPondState(), isRecord(), memberId(), PondCastReply (+6 more)

### Community 112 - "worker/tsconfig.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 113 - "core/tsconfig.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 114 - "Tiny Museum"
Cohesion: 0.33
Nodes (5): Deployment, Known gaps, Layout, Running locally, Tiny Museum

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
Cohesion: 0.35
Nodes (12): isItem(), isName(), isPid(), isSeq(), MAX_MESSAGE_BYTES, parseClientMessage(), parseLook(), parseMotion() (+4 more)

### Community 119 - "Costume gallery doorway"
Cohesion: 0.50
Nodes (3): Costume gallery doorway, Curtain colour edit, Prompt

### Community 120 - "LeaderboardPanel.tsx"
Cohesion: 0.20
Nodes (16): PondBoardId, PondBoardPeriod, PondBoardRow, PondLeaderboard, formatCountdown(), formatOdds(), nextMondayUtc(), useCountdown() (+8 more)

### Community 121 - "Fishing forest: painted asset pass"
Cohesion: 0.11
Nodes (17): Assets, Bruce's collection refresh (2026-11-08), Fishing forest illustrations, Made by hand (not touched by the script), Monets Lily Pond (2026-11-08), 1. Forest doorway, 2. Woodland noticeboard, 3. Fisherman and bait basket (+9 more)

### Community 124 - "xdog.ts"
Cohesion: 0.39
Nodes (5): blur(), kernel(), XDOG_DEFAULTS, xdogInk(), XdogOptions

### Community 125 - "icons.tsx"
Cohesion: 0.31
Nodes (6): GLYPHS, PearlIcon(), POND_CRIMSON, PondIconName, PondHud(), PondHudProps

### Community 126 - "rig.ts"
Cohesion: 0.16
Nodes (22): loadKind(), canvasToModel(), disposeRigLayer(), Frame, layerTemplates, loadRig(), dispose(), poseJump() (+14 more)

### Community 127 - "Curating the paintings (2026-11-07)"
Cohesion: 0.14
Nodes (13): 1. The registry and the table, 2. The studio's Location picker, 3. The rooms draw what is placed, 4. Credits, 5. Retiring self-serve artists, Building it, Curating the paintings (2026-11-07), Decided (+5 more)

### Community 128 - "nearby.ts"
Cohesion: 0.18
Nodes (5): Nearby, NearbyReach, RoomSpan, reach, strip

### Community 129 - "presence/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, types, exclude, extends, include, ../../tsconfig.base.json

### Community 130 - "limited"
Cohesion: 0.22
Nodes (14): PER_MEMBER, PUT(), GLOBAL, PER_IP, POST(), PER_IP, POST(), presenceUrl() (+6 more)

### Community 131 - "tsconfig.test.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 132 - "app/layout.tsx"
Cohesion: 0.16
Nodes (13): bethEllen, inspiratiq, metadata, notoSans, RootLayout(), sniglet, viewport, SoundContext (+5 more)

### Community 133 - "messages.ts"
Cohesion: 0.31
Nodes (7): checkMessage(), INVISIBLE, MESSAGE_MAX, MessageCheck, normalizeMessage(), hasProfanity(), matcher

### Community 134 - "lib/presence.ts"
Cohesion: 0.10
Nodes (13): PresencePreviewPage(), PresencePreview(), Entry, INTERPOLATION_DELAY_MS, PEER_TIMEOUT_MS, PeerTable, positionAt(), RemoteVisitor (+5 more)

### Community 135 - "query"
Cohesion: 0.08
Nodes (41): GET(), registerAction(), artist(), member(), piece(), randomId(), analyticsFor(), AnalyticsSummary (+33 more)

### Community 136 - "Confirmed issues"
Cohesion: 0.11
Nodes (18): Confirmed issues, E2E-002 — Valid edge placement rejected through floating-point precision, E2E-003 — One owned prop can be placed multiple times, E2E-004 — Reload before autosave silently loses the latest placement, E2E-005 — Failed save and failed Done have no visible mobile explanation, E2E-006 — Restoring connectivity does not retry a failed draft save, E2E-007 — Keyboard activation cannot place drawer items, E2E-008 — Creating an account from My Room leaves the signed-in user on the sign-in prompt (+10 more)

### Community 137 - "stage.ts"
Cohesion: 0.04
Nodes (39): coverFloorTransition(), CharacterSprites, CameraRig, Viewport, createPixelRatioGovernor(), PIXEL_RATIO_STEPS, createRoomPassage(), fixture() (+31 more)

### Community 138 - "hall/room.ts"
Cohesion: 0.07
Nodes (51): Assets, Scenery, createBackdrop(), CUTS, disposeBoards(), Mark, plane(), ROPE_CUTS (+43 more)

### Community 139 - "epoch.ts"
Cohesion: 0.16
Nodes (19): GET(), intParam(), GET(), sketchPool, unavailable(), EMPTY, firstSlice(), memo (+11 more)

### Community 140 - "Item"
Cohesion: 0.13
Nodes (4): Room, Presence, Item, Refusal

### Community 141 - "sketchguess/lib/api.ts"
Cohesion: 0.23
Nodes (13): sameOriginUrl(), PreparedGame, decodeImage(), fetchBitmap(), fetchRound(), guarded(), LoadedRound, loadInk() (+5 more)

### Community 142 - "visits.ts"
Cohesion: 0.11
Nodes (25): PER_VISITOR, POST(), VisitState, count(), currentSalts(), DEVICES, loadSalts(), parseVisitReport() (+17 more)

### Community 143 - "vitals.ts"
Cohesion: 0.27
Nodes (9): dynamic, format(), grade(), METRICS, PAGES, PerformancePage(), RANGES, summarizeVitals() (+1 more)

### Community 144 - "The Moonlit Pond — design"
Cohesion: 0.09
Nodes (22): Art the pond needs from the artist, Build contract (decided 2026-11-07), Build phases, Collection and goals, Done, Done, Guardrails, Leaderboards (+14 more)

### Community 145 - "Pond rework"
Cohesion: 0.18
Nodes (10): Baits, Client, Decisions, Done, Notes, Pond rework, Server, Species (+2 more)

### Community 146 - "env.ts"
Cohesion: 0.13
Nodes (13): target, SCHEMA_DIR, isProduction(), presenceSecret(), repoRoot, required(), sessionSecret(), setting() (+5 more)

### Community 147 - "Orchestration contract — you plan, DSH workers execute"
Cohesion: 0.29
Nodes (6): Briefing a worker, Budget hygiene, graphify, Orchestration contract — you plan, DSH workers execute, The worker, When not to delegate

### Community 148 - "tables.ts"
Cohesion: 0.10
Nodes (37): BaitTray(), BaitTrayProps, PondCatch, CatchView, debugSpecies(), debugVariant(), GuestRoll, GuestRollOptions (+29 more)

### Community 149 - "layout.ts"
Cohesion: 0.17
Nodes (10): cafeAfterIndex(), comingSoonWidth(), computeLayout(), cutRooms(), HallLayout, HallRoomKind, HallRoomSpan, hasPedestal() (+2 more)

### Community 150 - "placeLabel"
Cohesion: 0.10
Nodes (8): ComingSoonNote, GiftShopSigns, GuestBoardNotes, LobbySigns, Placards, placeLabel(), toScreen(), writeStyle()

### Community 151 - "pond-state.ts"
Cohesion: 0.25
Nodes (14): PondStateView, PondTier, ensurePondStateStarted(), getPondStateSnapshot(), GUEST, listeners, LOADING, PondStateSnapshot (+6 more)

### Community 152 - "createRemoteVisitors"
Cohesion: 0.21
Nodes (10): createRenderer(), createRigLayer(), createRemoteVisitors(), ensureLayer(), load(), placeOwn(), show(), showProp() (+2 more)

### Community 153 - "AssetImage"
Cohesion: 0.11
Nodes (28): BoardScreen(), BoardScreenProps, ComposeScreen(), ComposeScreenProps, blankDraft(), GuestBoard(), GuestBoardProps, View (+20 more)

### Community 154 - "useBackgroundMusic.ts"
Cohesion: 0.17
Nodes (10): BackgroundMusic, clampVolume(), isDocumentHidden(), Options, useBackgroundMusic(), VISIBILITY_EVENTS, isRouted(), setGainLevel() (+2 more)

### Community 155 - "hit.ts"
Cohesion: 0.29
Nodes (9): AlphaMap, alphaMapFor(), alphaMaps, buildAlphaMap(), isPaintedAt(), registerSpriteMask(), spread(), spriteMasks (+1 more)

### Community 156 - "walk.ts"
Cohesion: 0.23
Nodes (10): water, depthAtLift(), POND_LANDMARKS, DEPTH_SPAN, MAX_DEPTH, PICTURE, pondFloor(), SHORE_MARGIN (+2 more)

### Community 157 - "Walkthrough.tsx"
Cohesion: 0.13
Nodes (22): MoreArrow(), NavArrow(), Props, SLIDE, Walkthrough(), XIcon(), decodedFrames, frameFor() (+14 more)

### Community 158 - "createPondRoom"
Cohesion: 0.30
Nodes (14): pathX(), createPondRoom(), approach(), busy(), finishWalk(), goTo(), leave(), move() (+6 more)

### Community 159 - "links.ts"
Cohesion: 0.40
Nodes (5): EXITS, isDoor(), linkedDoor(), LINKS, prefetchNearDoors()

### Community 160 - "VitalsReporter.tsx"
Cohesion: 0.29
Nodes (8): firstPainting(), flush(), Metric, queue, REPORTED, VitalsReporter(), FIRST_PAINTING_MARK, MUSEUM_START_MARK

### Community 161 - "HallArranger.tsx"
Cohesion: 0.27
Nodes (7): loadHallArranger(), HallArranger(), HallArrangerProps, HallRoomData, Painting, hallPlacements(), reasonLabel()

### Community 162 - "createPlacementLayer"
Cohesion: 0.18
Nodes (8): aspectOf(), createPlacementLayer(), drawOutline(), dropHelper(), sizeOf(), PlacementTheme, Phase 5: themes, zones and arrangements, ThemeSpec

### Community 163 - "painting-open"
Cohesion: 0.50
Nodes (4): file, kilobytes, seconds, painting-open

### Community 165 - "Multiplayer ("other visitors") — plan v2 (Cloudflare)"
Cohesion: 0.14
Nodes (13): ScreenChrome(), 0. Summary, 10. Decisions, 1. Product contract changes (approved 2026-10-31), 2. What already exists that this builds on, 3.1 Generated names (everyone has one), 3. Names, 5.1 Emotes (v1) (+5 more)

### Community 166 - "SoundProvider.tsx"
Cohesion: 0.33
Nodes (4): StageOptions, RoomSound, SoundState, EffectName

### Community 167 - "BountyPanel.tsx"
Cohesion: 0.30
Nodes (14): refreshWalletNow(), PondBounties, formatInteger(), nextUtcMidnight(), utcDayLabel(), setPondState(), BountyPanel(), claim() (+6 more)

### Community 168 - "a/[slug]/page.tsx"
Cohesion: 0.31
Nodes (6): ArtistPage(), dynamic, generateMetadata(), GET(), FollowForm(), getArtistPage()

### Community 169 - "icon-basket"
Cohesion: 0.67
Nodes (3): icon-basket, file, vector

### Community 170 - "reveal.ts"
Cohesion: 0.17
Nodes (9): PlaceInfo, InkMap, planGame(), ROUND_SPREAD, createReveal(), compose(), PENCIL, SketchReveal (+1 more)

### Community 171 - "AssetImage"
Cohesion: 0.22
Nodes (10): CurrentlyShowing(), dynamic, GUIDELINES, LandingPage(), coin, CoinFound(), CoinFoundProps, AssetImage() (+2 more)

### Community 172 - "floor.test.ts"
Cohesion: 0.21
Nodes (9): depthAtY(), depthBounds(), depthT(), feetY(), scaleAt(), AREA, cross(), hasLineOfSight() (+1 more)

### Community 174 - "lib/slots/index.ts"
Cohesion: 0.09
Nodes (17): AccountHost(), AccountSheet, Mode, NAME_ERRORS, Pending, View, KeepOnOtherDevices(), onOpenAccount() (+9 more)

### Community 176 - "CrowdPreview.tsx"
Cohesion: 0.33
Nodes (7): CrowdPreviewPage(), CrowdPreview(), draw(), KINDS, Stats, Window, clearRigLayer()

### Community 177 - "shopkeeper.ts"
Cohesion: 0.20
Nodes (10): setFrame(), createRigState(), RigPiece, Angler(), COATS, createShopkeeper(), GREETINGS, OUTFIT (+2 more)

### Community 179 - "confirm/page.tsx"
Cohesion: 0.33
Nodes (7): ConfirmFollow(), dynamic, dynamic, Unsubscribe(), FollowNotice(), confirmFollow(), unsubscribe()

### Community 180 - "wardrobe.ts"
Cohesion: 0.06
Nodes (52): AtelierPage(), dynamic, metadata, useWallet(), allowedCharacter(), OwnedSnapshot, owns(), walletReady() (+44 more)

### Community 182 - "AccountSheet"
Cohesion: 0.29
Nodes (9): AccountSheet(), continueAnyway(), doSignOut(), runDelete(), runName(), submit(), submitDelete(), submitName() (+1 more)

### Community 183 - "run.ts"
Cohesion: 0.20
Nodes (7): admin, childEnv, client, database, fresh, migrations, target

### Community 184 - "rooms/art.ts"
Cohesion: 0.11
Nodes (20): AtelierArt, disposeAtelierArt(), load(), loadAtelierArt(), GALLERY_DOOR, loadGalleryDoor(), loadGalleryPillar(), loadImage() (+12 more)

### Community 186 - "4. Transport: Cloudflare Durable Objects"
Cohesion: 0.25
Nodes (8): 4. Transport: Cloudflare Durable Objects, Decision (2026-10-31), Deploying, Identity cannot be forged, Local development and tests, Rooms and capacity, Shape of `apps/presence` (about 200 lines), main()

### Community 187 - "getStorage"
Cohesion: 0.12
Nodes (25): CONTENT_TYPES, GET(), PUT(), deletePiece(), GalleryPiece, GalleryRow, getGallery(), hangPiece() (+17 more)

### Community 189 - "visits/page.tsx"
Cohesion: 0.31
Nodes (8): amount(), duration(), dynamic, LANDMARKS, PAGES, RANGES, share(), VisitsPage()

### Community 190 - "createMinimap"
Cohesion: 0.36
Nodes (9): place(), createMinimap(), draw(), drawRoom(), floors(), follow(), sketchOf(), panTo() (+1 more)

### Community 191 - "SoundProvider.tsx"
Cohesion: 0.15
Nodes (19): EFFECTS, EffectSpec, FOOTSTEPS, SoundEffects, useSoundEffects(), gestured(), OPTIONS, applyMix() (+11 more)

### Community 192 - "Low"
Cohesion: 0.10
Nodes (21): 10. Long names run off the name sign, 11. The rooms API skips the stale-tab member check, 12. The bunny is dragged along while you pan in Decorate, 13. Pages that redirect or don't exist answer 200, 14. Error codes reveal which room slugs exist, 15. The name sign slides under the top-right buttons in Decorate, 16. Level-up celebrations can be farmed, 17. No hint of where things are after panning away (+13 more)

### Community 193 - "Monets Lily Pond: exploration, UX and multiplayer QA"
Cohesion: 0.29
Nodes (6): Browser and interaction coverage, Changes made from the walkthrough, Monets Lily Pond: exploration, UX and multiplayer QA, Multiplayer and load, Practical limits, Regression checks and cleanup

### Community 194 - "Rig"
Cohesion: 0.25
Nodes (3): RigState, Rig, Shown

### Community 196 - "Local end-to-end stress test — 2026-11-06"
Cohesion: 0.22
Nodes (7): Environment and coverage, Follow-up coverage, Issue index, Local end-to-end stress test — 2026-11-06, Measured load, Passing checks and interpretation limits, Test data and cleanup

### Community 199 - "publish.ts"
Cohesion: 0.38
Nodes (6): publishAction(), evaluatePublishBar(), publishArtist(), PublishCheck, PublishReport, republishArtist()

### Community 200 - "BunnyArtist.tsx"
Cohesion: 0.40
Nodes (5): BunnyArtist(), BunnyMood, Pencil(), POSES, 4. Suggested plan

### Community 201 - "setCostumeVisibility"
Cohesion: 0.50
Nodes (3): Layer, setCostumeVisibility(), setCostume()

## Knowledge Gaps
- **5 isolated node(s):** `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1321 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **28 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `AccountSheet.tsx` to `SketchGuess.tsx`, `app/layout.tsx`, `round.ts`, `lib/presence.ts`, `stage.ts`, `machine.ts`, `PondRoom.tsx`, `Test Fakes and Helpers`, `join-room.ts`, `tables.ts`, `pond-state.ts`, `AssetImage`, `logic.ts`, `Museum.tsx`, `PersonalRoom.tsx`, `Walkthrough.tsx`, `Web Package Dependencies`, `useBackgroundMusic.ts`, `VitalsReporter.tsx`, `HallArranger.tsx`, `risk.ts`, `BountyPanel.tsx`, `a/[slug]/page.tsx`, `PondTicker.tsx`, `AssetImage`, `lib/slots/index.ts`, `next`, `CrowdPreview.tsx`, `Water.tsx`, `wardrobe.ts`, `pond-format.ts`, `SoundProvider.tsx`, `gallery/page.tsx`, `bug-report.ts`, `FishingView.tsx`, `(hall)/page.tsx`, `AtelierKeeps.tsx`, `RigPreview.tsx`, `LeaderboardPanel.tsx`, `icons.tsx`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._
- **What connects `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json` to the rest of the system?**
  _5 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `actions.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12903225806451613 - nodes in this community are weakly interconnected._
- **Why does `createStage()` connect `createStage` to `scene/assets.ts`, `stage.ts`, `AtelierKeeps.tsx`, `lib/slots/index.ts`, `remote-visitors.ts`, `join-room.ts`, `wardrobe.ts`, `art-cache.ts`, `Museum.tsx`, `createMinimap`, `links.ts`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Should `SketchGuess.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10317460317460317 - nodes in this community are weakly interconnected._
- **Why does `defaultStore()` connect `lib/slots/index.ts` to `slots/store.ts`, `createHallRoom`, `createStage`, `stage.ts`, `hall/room.ts`, `SyncStore`, `next`, `pondgame/lib/api.ts`, `join-room.ts`, `wardrobe.ts`, `pond-api.ts`, `pond-state.ts`, `economy/store.ts`, `PersonalRoom.tsx`, `createPondRoom`, `pond/room.ts`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Should `themes.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07692307692307693 - nodes in this community are weakly interconnected._