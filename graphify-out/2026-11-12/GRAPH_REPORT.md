# Graph Report - tiny-museum  (2026-11-12)

## Corpus Check
- 498 files · ~274,750 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 82 file(s) not represented in the graph (top: .avif 39, .glb 34, .css 4)

## Summary
- 4364 nodes · 11235 edges · 210 communities (187 shown, 23 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 215 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `04753ee7`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- themes.ts
- walk.ts
- SketchGuess.tsx
- rooms.ts
- rules.ts
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
- gallery/page.tsx
- room-events.ts
- stage.ts
- ref_node_assert
- amplify/package.json
- transaction
- prepare-models.mjs
- Traversal
- core/package.json
- actions.ts
- three
- DecorController
- Museum.tsx
- ambience.ts
- economy/pond.ts
- Web Package Dependencies
- Gamifying Tiny Museum — genre direction & engagement research
- atelier.ts
- slots/store.ts
- risk.ts
- amplify/tsconfig.json
- 5. Customization menu — what other people are doing
- core/src/index.ts
- layout.ts
- Web TSConfig
- Root Package Manifest
- hit
- PondTicker.tsx
- import-fishing-assets.mjs
- Base TSConfig
- Amplify Build Spec
- sketchguess/lib/api.ts
- hitForVisitor
- FakeServer
- handlers.ts
- Water.tsx
- Worker Package Manifest
- Public Asset Manifest
- wardrobe.ts
- Placement
- compose-atelier.mjs
- json
- pond-format.ts
- AccountSheet.tsx
- economy/store.ts
- backend.ts
- room.ts
- minimap.ts
- placements.ts
- walk
- Sound Effect Assets
- ticket/route.ts
- Custom HTTP Headers
- Sharp Layer Package
- domain/guestboard.ts
- scene/ambience.ts
- wallet/body.ts
- AssetImage
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
- next
- presence/package.json
- db-tests/pond.test.ts
- Asset pipeline: fast loading without losing sharpness
- Guest Board SQL Schema
- Landscape Frame Asset
- domain/sketch.ts
- Bug Reports SQL Schema
- Vitals SQL Schema
- json
- pond-boards.ts
- pond/room.ts
- members.ts
- Run-Once Schema
- locations.ts
- FishingView.tsx
- ticket.ts
- lib/assets.ts
- remote-visitors.ts
- queryOne
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
- pond-api.ts
- Fishing forest: painted asset pass
- audio/README.md
- .claude/CLAUDE.md
- The Costume Atelier
- Confirmed issues
- rig.ts
- Curating the paintings (2026-11-07)
- domain/guestboard.ts
- presence/tsconfig.json
- CameraRig
- tsconfig.test.json
- app/layout.tsx
- app/page.tsx
- lib/presence.ts
- Item
- bug-report.ts
- jobs.ts
- lobby.ts
- epoch.ts
- lib/presence.ts
- art-cache.ts
- visits.ts
- personal/room.ts
- The Moonlit Pond — design
- Pond rework
- env.ts
- Orchestration contract — you plan, DSH workers execute
- tables.ts
- AtelierRoom
- hall/room.ts
- pond-state.ts
- hit.ts
- Other visitors
- FilesystemStorage
- useMember
- personal/room.ts
- Walkthrough.tsx
- createPondRoom
- RigPreview.tsx
- audience.ts
- useBackgroundMusic.ts
- features/economy/index.ts
- painting-open
- tab-turn.ts
- Multiplayer ("other visitors") — plan v2 (Cloudflare)
- createRemoteVisitors
- run.ts
- AccountSheet
- icon-basket
- nearby.ts
- .webSocketMessage
- Local end-to-end stress test — 2026-11-06
- bunny-left
- Medium
- bunny-right
- PersonalRoom.tsx
- LandingFx
- icon-home
- SoundProvider.tsx
- confirm/page.tsx
- ticket
- reveal.ts
- createPlacementLayer
- Low
- domain/sketch.ts
- BountyPanel.tsx
- media/storage.ts
- draw.py
- visits/page.tsx
- Approved v4 bunny in the hall
- useSoundEffects.ts
- db.ts
- Monets Lily Pond: exploration, UX and multiplayer QA
- messages.ts
- a/[slug]/page.tsx
- performance/page.tsx
- pond-api.ts
- ArtCache
- perf.ts
- VitalsReporter.tsx
- CrowdPreview.tsx
- shopkeeper.ts
- Context
- createRigState
- CodesSection.tsx
- share.ts
- Clock
- BunnyArtist.tsx
- createStage

## God Nodes (most connected - your core abstractions)
1. `react` - 76 edges
2. `json()` - 69 edges
3. `query()` - 68 edges
4. `hit()` - 55 edges
5. `limited()` - 49 edges
6. `three` - 45 edges
7. `next` - 44 edges
8. `Traversal` - 44 edges
9. `SyncStore` - 41 edges
10. `FishingView()` - 39 edges

## Surprising Connections (you probably didn't know these)
- `Code` --references--> `followOutfit()`  [INFERRED]
  docs/costume-atelier.md → apps/web/src/features/hall/scene/wardrobe.ts
- `Rendering and movement` --references--> `walk()`  [INFERRED]
  docs/bunny-rig-integration.md → apps/web/src/features/landing/cat.ts
- `E2E-009 — Room mutations ignore stale account identity` --references--> `memberFromRequest()`  [INFERRED]
  docs/testing/local-e2e-stress-2026-11-06.md → apps/web/src/shared/lib/member-route.ts
- `19. Development-only: page payloads include the full room row` --references--> `getRoom()`  [INFERRED]
  docs/personal-room-issues.md → packages/core/src/domain/rooms.ts
- `Done` --references--> `useBait()`  [INFERRED]
  docs/pond-rework.md → packages/core/src/domain/wallet.ts

## Import Cycles
- None detected.

## Communities (210 total, 23 thin omitted)

### Community 0 - "themes.ts"
Cohesion: 0.13
Nodes (15): COLLECTIONS, ATELIER_SPOTS, FRAME_ASPECT, LOCATIONS, LocationSpec, spotPlacementId(), SpotSpec, ownsAll (+7 more)

### Community 1 - "walk.ts"
Cohesion: 0.11
Nodes (14): FloorPoint, WalkArea, water, FOREST_GATE, POND_LANDMARKS, DEPTH_SPAN, depthOf(), MAX_DEPTH (+6 more)

### Community 2 - "SketchGuess.tsx"
Cohesion: 0.12
Nodes (27): bestKeyFor(), BURST, clueUrl(), openingPlan(), Phase, pickAtRandom(), prepareSketchGame(), readDifficulty() (+19 more)

### Community 3 - "rooms.ts"
Cohesion: 0.16
Nodes (18): artist(), member(), piece(), randomId(), ownershipFor(), personalRoomFor(), RoomAccess, RoomDbRow (+10 more)

### Community 4 - "rules.ts"
Cohesion: 0.16
Nodes (17): localDay(), at(), EXCHANGE_DAILY_STAMPS, EXCHANGE_PEARLS_PER_STAMP, exchangeClaimKey(), GAME_DAILY_CAP, GameId, GAMES (+9 more)

### Community 5 - "round.ts"
Cohesion: 0.09
Nodes (41): ColorRecall(), ColorRecallProps, Phase, readBest(), deltaE(), GAMUT_EPSILON, hexToOklab(), inGamut() (+33 more)

### Community 6 - "floor.ts"
Cohesion: 0.13
Nodes (34): clone(), closestOnSegment(), contains(), cross(), crossVec(), depthAtY(), depthBounds(), depthT() (+26 more)

### Community 7 - "Core Asset Manifest"
Cohesion: 0.05
Nodes (41): artworks, audio, file, megabytes, seconds, sourceName, startedAt, bunny (+33 more)

### Community 8 - "scene/assets.ts"
Cohesion: 0.10
Nodes (37): AssetManifest, assetUrl(), bitmapTexture(), blankImage(), CAFE_CAT_FRAMES, CharacterSprites, CompressedLoader, elementTexture() (+29 more)

### Community 9 - "SyncStore"
Cohesion: 0.16
Nodes (6): encodeStored(), parseStored(), readStored(), writeStored(), SyncStore, upgrade()

### Community 10 - "machine.ts"
Cohesion: 0.10
Nodes (47): CAST_ERRORS, coarsePointer(), FishingView(), initialEasyReel(), isTyping(), LOST, Toast, vibrate() (+39 more)

### Community 11 - "PondRoom.tsx"
Cohesion: 0.11
Nodes (21): Loading(), metadata, PondPage(), revealFloorTransition(), PondGame(), POND_NAME, PondLoading(), BOARD_TABS (+13 more)

### Community 12 - "Test Fakes and Helpers"
Cohesion: 0.11
Nodes (28): deferredFetch(), deviceSlot, FakeEvents, FakeStorage, fixture, fixtureB, fixtureRegistry, fixtureRegistryBoth (+20 more)

### Community 13 - "scene.ts"
Cohesion: 0.05
Nodes (27): disposeDisplayTexture(), HELM_PEDESTAL_FILE, prefersAvif(), HiddenCoin, createNotes(), createPedestal(), Notes, Pedestal (+19 more)

### Community 14 - "cozy.ts"
Cohesion: 0.17
Nodes (20): ATELIER_PROPS, AtelierImage, canvasTexture(), CozyBackdrop, cozyPropImageUrl(), drawingOn(), FISH, fishTexture() (+12 more)

### Community 15 - "gallery/page.tsx"
Cohesion: 0.13
Nodes (24): dynamic, GalleryPage(), LocationsPage(), deletePieceAction(), hangAction(), movePieceAction(), unhangAction(), FloorControls() (+16 more)

### Community 16 - "room-events.ts"
Cohesion: 0.19
Nodes (26): ChatButton(), REFUSED, joinRoom(), STANDING, emit(), getPeople(), isInRoom(), isMuted() (+18 more)

### Community 17 - "stage.ts"
Cohesion: 0.03
Nodes (48): Character, hop(), Options, Pose, VisitorScenery, RoomArt, EXITS, hrefFor() (+40 more)

### Community 18 - "ref_node_assert"
Cohesion: 0.12
Nodes (29): defineSlot(), docBytes(), SLOTS, byAtThenKey(), encoded(), latest, mapOf(), maxNumber() (+21 more)

### Community 19 - "amplify/package.json"
Cohesion: 0.17
Nodes (14): devDependencies, @aws-amplify/backend@^1.14.0, @aws-amplify/backend-cli@^1.6.0, aws-cdk-lib@^2.180.0, constructs@^10.3.0, name, private, scripts (+6 more)

### Community 20 - "transaction"
Cohesion: 0.17
Nodes (26): addBait(), baitOf(), buyPondBait(), castPond(), chainPondBait(), exchangePearls(), getPondState(), isRecord() (+18 more)

### Community 21 - "prepare-models.mjs"
Cohesion: 0.10
Nodes (26): paintedCostume(), BODIES, bruce, BRUCE_FIT, BRUCE_PLACE, bunny, CARDIGAN_TIE, CROWN (+18 more)

### Community 22 - "Traversal"
Cohesion: 0.10
Nodes (6): JumpPose, clamp(), fixture(), jump(), Traversal, Stress-test fixes (2026-11-06)

### Community 23 - "core/package.json"
Cohesion: 0.06
Nodes (40): dependencies, @aws-sdk/client-s3@^3.1121.0, @aws-sdk/s3-request-presigner@^3.1121.0, bcryptjs@^2.4.3, obscenity@^0.4.6, pg@^8.13.1, sharp@^0.33.5, thumbhash@^0.1.1 (+32 more)

### Community 24 - "actions.ts"
Cohesion: 0.14
Nodes (30): dynamic, back(), deleteGuestNoteAction(), discardLocationAction(), isThrottled(), nudgeInRowAction(), PLACE_ERRORS, placePaintingAction() (+22 more)

### Community 25 - "three"
Cohesion: 0.08
Nodes (22): Scenery, Carried, CarriedState, createCarried(), Perch, Pose, centerYFor(), CONFIG (+14 more)

### Community 27 - "Museum.tsx"
Cohesion: 0.15
Nodes (23): motion@^13.1.1, Loading(), AtelierLoading(), CoinFound, ColorRecall, GameDesktop, GuestBoard, HallArranger (+15 more)

### Community 28 - "ambience.ts"
Cohesion: 0.13
Nodes (30): blade(), bloom(), BLOOMS, createPondAmbience(), update(), fishTexture(), frond(), FRONT_ROWS (+22 more)

### Community 29 - "economy/pond.ts"
Cohesion: 0.06
Nodes (80): PondBoardMe, PondBoardRow, PondFeedItem, Rep, BountyCatchRow, ONCE, PondBaitResult, PondBountiesView (+72 more)

### Community 30 - "Web Package Dependencies"
Cohesion: 0.08
Nodes (32): dependencies, embla-carousel-react@^8.6.0, next@^15.0.3, react@^19.0.0, react-dom@^19.0.0, swr@^2.5.1, three@^0.169.0, thumbhash@^0.1.1 (+24 more)

### Community 31 - "Gamifying Tiny Museum — genre direction & engagement research"
Cohesion: 0.10
Nodes (19): 0.1 The core experience, 0.2 Systems that make gamification cheap to build, 0.3 Constraints that shape any recommendation, 0. What the game is today (the deep dive), 1.1 The landscape (seven candidates, with verdicts), 1.2 Recommendation: a **cozy gallery life-sim** — "the gallery you live in", 1.3 The five design pillars the genre implies, 1. Genre direction (+11 more)

### Community 32 - "atelier.ts"
Cohesion: 0.06
Nodes (51): aspectOf(), AtelierActions, AtelierImage, BuiltRoom, Cardigan, CARDIGAN_NAMES, Control, createAtelierRoom() (+43 more)

### Community 33 - "slots/store.ts"
Cohesion: 0.15
Nodes (17): ANON_PREFIX, anonKey(), deviceKey(), isMemberSlotKey(), listKeys(), MEMBER_KEY, memberKey(), memberPrefix() (+9 more)

### Community 34 - "risk.ts"
Cohesion: 0.16
Nodes (25): Hud(), HudProps, HudWagerChip, WagerPicker(), chooseTier(), WagerPickerProps, chainChipLabel(), clampWagerStake() (+17 more)

### Community 35 - "amplify/tsconfig.json"
Cohesion: 0.20
Nodes (9): compilerOptions, module, moduleResolution, noUnusedLocals, noUnusedParameters, exclude, extends, include (+1 more)

### Community 36 - "5. Customization menu — what other people are doing"
Cohesion: 0.12
Nodes (16): 1. The target: what "Claude Opus 5.5" actually means, 2. Where your harness stands today (live config I read), 3. The honest gap model, 4. Quality levers, ranked by leverage, 5. Customization menu — what other people are doing, 6. Recommended starting kit for *your* profile, 7. What I can apply for you right now (needs your go-ahead), A. Prompt & persona (most common quality customizations) (+8 more)

### Community 37 - "core/src/index.ts"
Cohesion: 0.08
Nodes (40): grantPearls(), member(), now, piece(), randomId(), today, applyClaim(), baitCounts() (+32 more)

### Community 38 - "layout.ts"
Cohesion: 0.21
Nodes (9): cafeAfterIndex(), comingSoonWidth(), computeLayout(), cutRooms(), HallLayout, HallRoomKind, HallRoomSpan, hasPedestal() (+1 more)

### Community 39 - "Web TSConfig"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 40 - "Root Package Manifest"
Cohesion: 0.06
Nodes (36): [, width, height], description, devDependencies, concurrently@^9.1.0, esbuild@^0.24.0, ktx2-encoder@^0.6.0, maxrects-packer@^2.7.3, playwright@^1.63.0 (+28 more)

### Community 41 - "hit"
Cohesion: 0.13
Nodes (26): roomEditor, GET(), PaintingRow, PER_EDITOR, PUT(), versionOf(), PER_EDITOR, POST() (+18 more)

### Community 42 - "PondTicker.tsx"
Cohesion: 0.29
Nodes (11): fetchPondFeed(), PondFeedItem, catchLabel(), formatSizeCm(), speciesFor(), speciesName(), speciesTier(), isGolden() (+3 more)

### Community 43 - "import-fishing-assets.mjs"
Cohesion: 0.10
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

### Community 47 - "hitForVisitor"
Cohesion: 0.15
Nodes (21): POST(), POST(), POST(), GLOBAL, PER_IP, POST(), POST(), PER_VISITOR (+13 more)

### Community 48 - "FakeServer"
Cohesion: 0.18
Nodes (3): FakeServer, SlotState, SlotDef

### Community 49 - "handlers.ts"
Cohesion: 0.11
Nodes (29): confirmedFollowers(), handleDerivatives(), handleNotifyFollowers(), handleRenderDisplay(), handleSealEpoch(), renderPieceFrame(), renderPieceSketch(), runJob() (+21 more)

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
Cohesion: 0.06
Nodes (55): AtelierPage(), dynamic, metadata, useWallet(), allowedCharacter(), OwnedSnapshot, owns(), walletReady() (+47 more)

### Community 54 - "Placement"
Cohesion: 0.12
Nodes (6): Carry, PersonalRoomProps, DecorLive, HallRoomData, PlacementLayer, Placement

### Community 55 - "compose-atelier.mjs"
Cohesion: 0.14
Nodes (9): body, dressLayer, dressWidth, floralWidth, MANNEQUIN_CANVAS, mask, root, sourceSize (+1 more)

### Community 56 - "json"
Cohesion: 0.10
Nodes (32): GET(), GET(), GET(), GET(), PER_MEMBER, GET(), PER_MEMBER, BOARDS (+24 more)

### Community 57 - "pond-format.ts"
Cohesion: 0.13
Nodes (25): PondDex, EXCHANGE_DAILY_STAMPS, EXCHANGE_PEARLS_PER_STAMP, FISH_ART, formatPercent(), formatShortSizeCm(), ODDS_BAIT, POND_BAIT (+17 more)

### Community 58 - "AccountSheet.tsx"
Cohesion: 0.13
Nodes (16): NAME_ERRORS, Pending, View, openBugReport(), fitWidth(), HelpGuide(), HelpGuideProps, POINTER_STEPS (+8 more)

### Community 59 - "economy/store.ts"
Cohesion: 0.07
Nodes (63): CARRY_CAP, carryAdd(), CarryEntry, carryPrune(), carryRemove(), chunk(), ClaimRequest, tzOffsetNow() (+55 more)

### Community 60 - "backend.ts"
Cohesion: 0.15
Nodes (12): amplifyDir, backend, everyMinutes, mediaBucket, missing, repoRoot, REQUIRED, setting() (+4 more)

### Community 61 - "room.ts"
Cohesion: 0.11
Nodes (32): fetch(), Env, admitted(), Attachment, farewell(), GHOST_MS, HELLO_TIMEOUT_MS, holdsOf() (+24 more)

### Community 62 - "minimap.ts"
Cohesion: 0.07
Nodes (37): place(), ATELIER_DOOR, createMinimap(), draw(), drawRoom(), floors(), follow(), sketchOf() (+29 more)

### Community 63 - "placements.ts"
Cohesion: 0.11
Nodes (19): prop(), Where things stand, 1. Items placed against a zone edge fail to save, and the whole draft reverts, 2. One owned item can be placed many times, 3. Any save rejection throws away all unsaved work, 4. Changes made just before leaving are lost, 5. Fish trophies can be claimed without playing, High (+11 more)

### Community 64 - "walk"
Cohesion: 0.17
Nodes (14): between(), CAT, Edge, EDGES, runLandingCat(), peek(), walk(), 1. What is in this bundle (+6 more)

### Community 65 - "Sound Effect Assets"
Cohesion: 0.22
Nodes (9): file, kilobytes, seconds, file, kilobytes, seconds, soundEffects, click (+1 more)

### Community 66 - "ticket/route.ts"
Cohesion: 0.15
Nodes (24): PER_MEMBER, PUT(), PER_IP, POST(), presenceUrl(), allowedOrigin(), checkMutation(), Code (+16 more)

### Community 67 - "Custom HTTP Headers"
Cohesion: 0.25
Nodes (7): applications, appRoot, customHeaders, headers, pattern, key, value

### Community 68 - "Sharp Layer Package"
Cohesion: 0.33
Nodes (6): dependencies, sharp@^0.33.5, description, sharp, name, private

### Community 69 - "domain/guestboard.ts"
Cohesion: 0.18
Nodes (14): BugReport, BugReportDto, BugReportRateLimited, BugReportRejected, BugRow, CONTEXT_KEYS, countOpenBugReports(), EVERYONE (+6 more)

### Community 70 - "scene/ambience.ts"
Cohesion: 0.13
Nodes (13): BULBS, createHallAmbience(), finish(), glowTexture(), HallAmbience, mulberry(), painted(), vignetteTexture() (+5 more)

### Community 71 - "wallet/body.ts"
Cohesion: 0.16
Nodes (18): PER_MEMBER, POST(), baitIdOf(), integerOffset(), isRecord(), itemIdOf(), MAX_CLAIM_BATCH, MAX_WALLET_BODY_BYTES (+10 more)

### Community 72 - "AssetImage"
Cohesion: 0.16
Nodes (15): BoardScreen(), BoardScreenProps, PinnedNotes(), PinnedNotesProps, ReadScreenProps, messageLength(), StickyNote(), NOTE_PLACES (+7 more)

### Community 73 - "import-landing-assets.mjs"
Cohesion: 0.13
Nodes (9): socket(), CAT, drop, EXPECTED, manifest, manifestPath, masters, root (+1 more)

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
Cohesion: 0.16
Nodes (15): createPresence(), drop(), heartbeat(), maybeSend(), onPageHide(), receive(), scheduleRetry(), send() (+7 more)

### Community 81 - "members"
Cohesion: 0.12
Nodes (25): coin_claims, coin_claims_daily, wallet_bait, wallet_items, wallets, member_sessions, member_sessions_member, member_slots (+17 more)

### Community 82 - "Frame Window Asset"
Cohesion: 0.50
Nodes (4): frame, size, window, windowAspect

### Community 83 - "next"
Cohesion: 0.16
Nodes (15): config, SECURITY_HEADERS, BugReportsPage(), dateFormat, dynamic, summary(), dateFormat, dynamic (+7 more)

### Community 84 - "presence/package.json"
Cohesion: 0.14
Nodes (16): dependencies, @tiny/core@*, devDependencies, @cloudflare/workers-types@5.20261016.1, wrangler@4.151.1, @tiny/core, name, private (+8 more)

### Community 85 - "db-tests/pond.test.ts"
Cohesion: 0.15
Nodes (15): CatchExtra, COLUMNS, member(), namedMember(), randomId(), StatePatch, getPondDex(), bountyCatches() (+7 more)

### Community 86 - "Asset pipeline: fast loading without losing sharpness"
Cohesion: 0.22
Nodes (8): Asset pipeline: fast loading without losing sharpness, Character rigs and the Costume Atelier, Completed, Ground rules, Phase 1: fingerprinted files at 2x and 3x, Phase 2: texture atlases for the hall sprites, Phase 3: KTX2 (Basis Universal), built and switched off, Phase 4: ThumbHash placeholders for paintings

### Community 87 - "Guest Board SQL Schema"
Cohesion: 0.67
Nodes (3): guest_notes, guest_notes_visible, rate_limits

### Community 88 - "Landscape Frame Asset"
Cohesion: 0.67
Nodes (3): frameLandscape, size, window

### Community 89 - "domain/sketch.ts"
Cohesion: 0.13
Nodes (22): listPieces(), pieceImageUrl(), PieceRow, toPieceDto(), deletePiece(), GalleryPiece, GalleryRow, hangPiece() (+14 more)

### Community 93 - "json"
Cohesion: 0.12
Nodes (32): POST(), POST(), PER_MEMBER, PUT(), PER_MEMBER, POST(), catchIdOf(), isRecord() (+24 more)

### Community 94 - "pond-boards.ts"
Cohesion: 0.13
Nodes (21): insertCatch(), compare(), DexRow, displayName(), FeedRow, getPondFeed(), getPondLeaderboard(), NameRow (+13 more)

### Community 95 - "pond/room.ts"
Cohesion: 0.10
Nodes (26): FrameShape, SPECIES, depthAtLift(), FAR_LIFT, FAR_SCALE, liftAt(), pathHalfWidth(), pathX() (+18 more)

### Community 96 - "members.ts"
Cohesion: 0.16
Nodes (25): POST(), GLOBAL, PER_IP, POST(), checkPasswordRateLimit(), registry, started(), hashPassword() (+17 more)

### Community 104 - "locations.ts"
Cohesion: 0.25
Nodes (20): discardLocation(), hasUnpublished(), locationStates(), nudgeInRow(), OWNER, placePainting(), PlaceResult, PlaceTarget (+12 more)

### Community 105 - "FishingView.tsx"
Cohesion: 0.12
Nodes (15): CONFETTI_COLORS, ConfettiPiece, makeConfetti(), RevealCard(), TIER_MS, TIER_SFX, useCountUp(), chainOffer (+7 more)

### Community 106 - "ticket.ts"
Cohesion: 0.17
Nodes (16): roomName(), decoder, encoder, fromBase64Url(), HmacKey, isOwn(), isTicket(), keyFor() (+8 more)

### Community 107 - "lib/assets.ts"
Cohesion: 0.13
Nodes (22): Loading(), DENSITY_MEDIA, HallPreload(), HallSkeleton(), loadCompressed(), loadSheets(), assetCssVariables(), assetEntry (+14 more)

### Community 108 - "remote-visitors.ts"
Cohesion: 0.13
Nodes (9): Attachment, RigState, Rig, RigAttachment, FLAT, MAX_SHOWN, Prop, Shown (+1 more)

### Community 109 - "queryOne"
Cohesion: 0.20
Nodes (15): AnalyticsPage(), dynamic, dynamic, StudioHome(), publishAction(), unpublishAction(), requireArtist(), analyticsFor() (+7 more)

### Community 110 - "graftCostume"
Cohesion: 0.27
Nodes (14): canvasFit(), compose(), graftCostume(), copyAccessor(), copyMaterial(), copyMesh(), copyTexture(), copyView() (+6 more)

### Community 111 - "pondgame/lib/api.ts"
Cohesion: 0.14
Nodes (30): PondGameProps, RevealCardProps, buyPondBait(), CastOptions, castPond(), chainPondBait(), errorOf(), fetchPondState() (+22 more)

### Community 112 - "worker/tsconfig.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 113 - "core/tsconfig.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 114 - "import-hall-assets.mjs"
Cohesion: 0.09
Nodes (17): BASEBOARD, CURTAIN, drop, EXPECTED, file(), manifest, manifestPath, masters (+9 more)

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

### Community 120 - "pond-api.ts"
Cohesion: 0.25
Nodes (15): fetchPondLeaderboard(), fishArt(), formatCountdown(), formatInteger(), formatOdds(), nextMondayUtc(), useCountdown(), useNow() (+7 more)

### Community 121 - "Fishing forest: painted asset pass"
Cohesion: 0.10
Nodes (18): Assets, Bruce's collection refresh (2026-11-08), Fishing forest illustrations, Made by hand (not touched by the script), Main hall v2 (2026-11-10), Monets Lily Pond (2026-11-08), 1. Forest doorway, 2. Woodland noticeboard (+10 more)

### Community 124 - "The Costume Atelier"
Cohesion: 0.12
Nodes (15): Adding a character, Adding a costume, Art not supplied as files, Bruce's Chronicles, Checked against the mocks (2026-11-07), Code, Costume fit review, Fitting clothes to other characters (+7 more)

### Community 125 - "Confirmed issues"
Cohesion: 0.11
Nodes (18): Confirmed issues, E2E-002 — Valid edge placement rejected through floating-point precision, E2E-003 — One owned prop can be placed multiple times, E2E-004 — Reload before autosave silently loses the latest placement, E2E-005 — Failed save and failed Done have no visible mobile explanation, E2E-006 — Restoring connectivity does not retry a failed draft save, E2E-007 — Keyboard activation cannot place drawer items, E2E-008 — Creating an account from My Room leaves the signed-in user on the sign-in prompt (+10 more)

### Community 126 - "rig.ts"
Cohesion: 0.14
Nodes (23): Layer, setCostumeVisibility(), canvasToModel(), disposeRigLayer(), Frame, layerTemplates, loadRig(), dispose() (+15 more)

### Community 127 - "Curating the paintings (2026-11-07)"
Cohesion: 0.14
Nodes (13): 1. The registry and the table, 2. The studio's Location picker, 3. The rooms draw what is placed, 4. Credits, 5. Retiring self-serve artists, Building it, Curating the paintings (2026-11-07), Decided (+5 more)

### Community 128 - "domain/guestboard.ts"
Cohesion: 0.10
Nodes (29): GET(), ComposeScreen(), ComposeScreenProps, blankDraft(), GuestBoard(), GuestBoardProps, View, ReadScreen() (+21 more)

### Community 129 - "presence/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, types, exclude, extends, include, ../../tsconfig.base.json

### Community 130 - "CameraRig"
Cohesion: 0.17
Nodes (8): coverFloorTransition(), CameraRig, createPixelRatioGovernor(), PIXEL_RATIO_STEPS, createRoomPassage(), fixture(), Runtime, Phase 1: stage + atelier

### Community 131 - "tsconfig.test.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 132 - "app/layout.tsx"
Cohesion: 0.16
Nodes (12): bethEllen, inspiratiq, metadata, notoSans, RootLayout(), sniglet, viewport, AccountHost() (+4 more)

### Community 133 - "app/page.tsx"
Cohesion: 0.26
Nodes (11): dynamic, Hall(), MuseumPage(), [BRAND_OWNER, ...BRAND_REST], CurrentlyShowing(), Decor(), dynamic, LandingPage() (+3 more)

### Community 134 - "lib/presence.ts"
Cohesion: 0.09
Nodes (13): PresencePreviewPage(), PresencePreview(), Entry, INTERPOLATION_DELAY_MS, PEER_TIMEOUT_MS, PeerTable, positionAt(), RemoteVisitor (+5 more)

### Community 135 - "Item"
Cohesion: 0.12
Nodes (4): Room, Presence, Item, Refusal

### Community 136 - "bug-report.ts"
Cohesion: 0.20
Nodes (15): BugReportHost(), BugReportSheet, BugReportSheet(), send(), Status, collectContext(), inAppBrowser(), onOpenBugReport() (+7 more)

### Community 137 - "jobs.ts"
Cohesion: 0.23
Nodes (15): loop(), shutdown(), sleep(), sweepStale(), DrainResult, handler(), repairFrames(), repairUnframed() (+7 more)

### Community 138 - "lobby.ts"
Cohesion: 0.11
Nodes (30): Assets, CUTS, disposeBoards(), plane(), ROPE_CUTS, ropeSlices(), sliceOf(), stretchedBoard() (+22 more)

### Community 139 - "epoch.ts"
Cohesion: 0.15
Nodes (20): GET(), intParam(), GET(), sketchPool, unavailable(), MuseumProps, EMPTY, memo (+12 more)

### Community 140 - "lib/presence.ts"
Cohesion: 0.12
Nodes (17): Connect, connectWebSocket(), fetchTicket, HEARTBEAT_MS, HIDDEN_LIMIT_MS, RETRY_MS, SAY_GAP_MS, Self (+9 more)

### Community 141 - "art-cache.ts"
Cohesion: 0.21
Nodes (9): ArtCacheOptions, createArtCache(), drop(), expireLater(), hold(), HeldArt, LoadResult, Slot (+1 more)

### Community 142 - "visits.ts"
Cohesion: 0.10
Nodes (29): state(), PER_VISITOR, POST(), VisitTracker(), flush(), startVisit(), visibleMs(), VisitState (+21 more)

### Community 143 - "personal/room.ts"
Cohesion: 0.06
Nodes (19): Mark, CafeMarks, ComingSoon, GiftShopMarks, GuestBoard, LobbyMarks, CafeLink, ComingSoonNote (+11 more)

### Community 144 - "The Moonlit Pond — design"
Cohesion: 0.09
Nodes (22): Art the pond needs from the artist, Build contract (decided 2026-11-07), Build phases, Collection and goals, Done, Done, Guardrails, Leaderboards (+14 more)

### Community 145 - "Pond rework"
Cohesion: 0.18
Nodes (10): Baits, Client, Decisions, Done, Notes, Pond rework, Server, Species (+2 more)

### Community 146 - "env.ts"
Cohesion: 0.22
Nodes (8): target, SCHEMA_DIR, isProduction(), presenceSecret(), repoRoot, required(), sessionSecret(), setting()

### Community 147 - "Orchestration contract — you plan, DSH workers execute"
Cohesion: 0.29
Nodes (6): Briefing a worker, Budget hygiene, graphify, Orchestration contract — you plan, DSH workers execute, The worker, When not to delegate

### Community 148 - "tables.ts"
Cohesion: 0.11
Nodes (30): BaitTray(), BaitTrayProps, debugSpecies(), debugVariant(), GuestRollOptions, guestTreasure(), rollGuest(), BAIT (+22 more)

### Community 149 - "AtelierRoom"
Cohesion: 0.14
Nodes (4): AtelierRoom, Display, CollectionRoom, CharacterKind

### Community 150 - "hall/room.ts"
Cohesion: 0.07
Nodes (27): AtelierArt, Cafe, GALLERY_DOOR, loadAtelierDoor(), loadGalleryDoor(), loadGalleryPillar(), loadImage(), pending (+19 more)

### Community 151 - "pond-state.ts"
Cohesion: 0.24
Nodes (15): fetchPondState(), PondStateView, PondTier, ensurePondStateStarted(), getPondStateSnapshot(), GUEST, listeners, LOADING (+7 more)

### Community 152 - "hit.ts"
Cohesion: 0.18
Nodes (11): CoinWall, createHiddenCoin(), Spot, AlphaMap, alphaMapFor(), alphaMaps, buildAlphaMap(), isPaintedAt() (+3 more)

### Community 153 - "Other visitors"
Cohesion: 0.29
Nodes (6): How it plays, Other visitors, Privacy, Running it in production, Running it locally, Staying consistent

### Community 155 - "useMember"
Cohesion: 0.11
Nodes (9): KeepOnOtherDevices(), openAccount(), openAccountCreation(), useSound(), SoundToggle(), SettingsMenu(), Probe(), MemberInfo (+1 more)

### Community 156 - "personal/room.ts"
Cohesion: 0.18
Nodes (11): PersonalArt, cozyLevel, cozyWorth(), createPersonalRoom(), showLevel(), DOOR_SIGN, NAME_SIGN, PersonalRoomOptions (+3 more)

### Community 157 - "Walkthrough.tsx"
Cohesion: 0.14
Nodes (20): BACKDROP_STYLE, MoreArrow(), NavArrow(), Props, SLIDE, Walkthrough(), XIcon(), decodedFrames (+12 more)

### Community 158 - "createPondRoom"
Cohesion: 0.32
Nodes (13): createPondRoom(), approach(), busy(), finishWalk(), goTo(), leave(), move(), nearest() (+5 more)

### Community 159 - "RigPreview.tsx"
Cohesion: 0.27
Nodes (10): RigPreviewPage(), NEXT, PROPS, RigPreview(), draw(), approach(), GROUNDED, rigFacing() (+2 more)

### Community 160 - "audience.ts"
Cohesion: 0.12
Nodes (20): ALLOWED, POST(), GET(), BRAND, AnalyticsSummary, createInquiry(), ensureQrToken(), EventKind (+12 more)

### Community 161 - "useBackgroundMusic.ts"
Cohesion: 0.29
Nodes (10): saveIfHigher(), BackgroundMusic, clampVolume(), isDocumentHidden(), Options, useBackgroundMusic(), VISIBILITY_EVENTS, suspendGain() (+2 more)

### Community 162 - "features/economy/index.ts"
Cohesion: 0.10
Nodes (27): MuseumLayout(), CoinToast(), Toast, Purse(), Stamp(), WalletProvider(), serverSnapshot, useEarnEvents() (+19 more)

### Community 163 - "painting-open"
Cohesion: 0.50
Nodes (4): file, kilobytes, seconds, painting-open

### Community 164 - "tab-turn.ts"
Cohesion: 0.16
Nodes (5): createTabTurn(), TabTurn, tab(), TurnEnv, TurnMessage

### Community 165 - "Multiplayer ("other visitors") — plan v2 (Cloudflare)"
Cohesion: 0.09
Nodes (21): ScreenChrome(), 0. Summary, 10. Decisions, 1. Product contract changes (approved 2026-10-31), 2. What already exists that this builds on, 3.1 Generated names (everyone has one), 3. Names, 4. Transport: Cloudflare Durable Objects (+13 more)

### Community 166 - "createRemoteVisitors"
Cohesion: 0.21
Nodes (10): createRenderer(), createRigLayer(), createRemoteVisitors(), ensureLayer(), load(), placeOwn(), show(), showProp() (+2 more)

### Community 167 - "run.ts"
Cohesion: 0.20
Nodes (7): admin, childEnv, client, database, fresh, migrations, target

### Community 168 - "AccountSheet"
Cohesion: 0.29
Nodes (9): AccountSheet(), continueAnyway(), doSignOut(), runDelete(), runName(), submit(), submitDelete(), submitName() (+1 more)

### Community 169 - "icon-basket"
Cohesion: 0.67
Nodes (3): icon-basket, file, vector

### Community 170 - "nearby.ts"
Cohesion: 0.18
Nodes (5): Nearby, NearbyReach, RoomSpan, reach, strip

### Community 171 - ".webSocketMessage"
Cohesion: 0.40
Nodes (4): attachmentOf(), roomFull(), Room, sendTo()

### Community 172 - "Local end-to-end stress test — 2026-11-06"
Cohesion: 0.22
Nodes (7): Environment and coverage, Follow-up coverage, Issue index, Local end-to-end stress test — 2026-11-06, Measured load, Passing checks and interpretation limits, Test data and cleanup

### Community 174 - "Medium"
Cohesion: 0.22
Nodes (9): onClick(), 10. Long names run off the name sign, 11. The rooms API skips the stale-tab member check, 12. The bunny is dragged along while you pan in Decorate, 6. Failed saves are nearly invisible, and nothing retries, 7. Two tabs editing the same room overwrite each other, 8. The drawer's card row can't be scrolled on touch screens, 9. Decorating can't be done with the keyboard (+1 more)

### Community 176 - "PersonalRoom.tsx"
Cohesion: 0.06
Nodes (51): loadHallArranger(), errorReason(), overDrawer(), PersonalRoom(), canPlaceNew(), carryEnd(), carryMove(), onCardKey() (+43 more)

### Community 177 - "LandingFx"
Cohesion: 0.32
Nodes (5): glowSprite(), LandingFx(), onVisibility(), tick(), Mote

### Community 179 - "SoundProvider.tsx"
Cohesion: 0.36
Nodes (5): SoundContext, SoundProvider(), SoundState, EffectName, isPublicPage()

### Community 180 - "confirm/page.tsx"
Cohesion: 0.33
Nodes (7): ConfirmFollow(), dynamic, dynamic, Unsubscribe(), FollowNotice(), confirmFollow(), unsubscribe()

### Community 182 - "reveal.ts"
Cohesion: 0.23
Nodes (7): InkMap, planGame(), ROUND_SPREAD, createReveal(), PENCIL, SketchReveal, shuffle()

### Community 183 - "createPlacementLayer"
Cohesion: 0.18
Nodes (8): aspectOf(), createPlacementLayer(), drawOutline(), dropHelper(), sizeOf(), PlacementTheme, Phase 5: themes, zones and arrangements, ThemeSpec

### Community 184 - "Low"
Cohesion: 0.15
Nodes (13): 13. Pages that redirect or don't exist answer 200, 14. Error codes reveal which room slugs exist, 15. The name sign slides under the top-right buttons in Decorate, 16. Level-up celebrations can be farmed, 17. No hint of where things are after panning away, 18. Too many items is only discovered by the server, 19. Development-only: page payloads include the full room row, Checked and fine (+5 more)

### Community 185 - "domain/sketch.ts"
Cohesion: 0.13
Nodes (18): EpochRow, planSketchRound(), SKETCH_CHOICES, SketchCandidate, SketchRoundPlan, pool, renderSketch(), SKETCH_COLOR_WIDTH (+10 more)

### Community 186 - "BountyPanel.tsx"
Cohesion: 0.20
Nodes (14): GLYPHS, PearlIcon(), POND_CRIMSON, PondIconName, claimPondBounty(), fetchPondBounties(), PondBounties, nextUtcMidnight() (+6 more)

### Community 187 - "media/storage.ts"
Cohesion: 0.11
Nodes (17): CONTENT_TYPES, GET(), PUT(), ACCEPTED, createAssetFromUpload(), MAX_UPLOAD_BYTES, presignUpload(), registerUpload() (+9 more)

### Community 189 - "visits/page.tsx"
Cohesion: 0.25
Nodes (10): amount(), duration(), dynamic, LANDMARKS, PAGES, RANGES, share(), VisitsPage() (+2 more)

### Community 190 - "Approved v4 bunny in the hall"
Cohesion: 0.29
Nodes (5): Approved v4 bunny in the hall, Assets, Existing interactions and fallback, Local review and checks, Rendering and movement

### Community 191 - "useSoundEffects.ts"
Cohesion: 0.14
Nodes (19): EFFECTS, EffectSpec, FOOTSTEPS, SoundEffects, useSoundEffects(), gestured(), OPTIONS, applyMix() (+11 more)

### Community 192 - "db.ts"
Cohesion: 0.19
Nodes (8): closePool(), getPool(), poolConfig(), sslFor(), RateLimit, RateLimitResult, RDS_CA_BUNDLE, pg

### Community 193 - "Monets Lily Pond: exploration, UX and multiplayer QA"
Cohesion: 0.29
Nodes (6): Browser and interaction coverage, Changes made from the walkthrough, Monets Lily Pond: exploration, UX and multiplayer QA, Multiplayer and load, Practical limits, Regression checks and cleanup

### Community 194 - "messages.ts"
Cohesion: 0.31
Nodes (7): checkMessage(), INVISIBLE, MESSAGE_MAX, MessageCheck, normalizeMessage(), hasProfanity(), matcher

### Community 195 - "a/[slug]/page.tsx"
Cohesion: 0.31
Nodes (6): ArtistPage(), dynamic, generateMetadata(), GET(), FollowForm(), getArtistPage()

### Community 196 - "performance/page.tsx"
Cohesion: 0.27
Nodes (9): dynamic, format(), grade(), METRICS, PAGES, PerformancePage(), RANGES, summarizeVitals() (+1 more)

### Community 197 - "pond-api.ts"
Cohesion: 0.15
Nodes (25): refreshWalletNow(), buyPondBait(), errorOf(), exchangePondPearls(), fetchPondDex(), isRecord(), isStateView(), memberId() (+17 more)

### Community 199 - "perf.ts"
Cohesion: 0.22
Nodes (4): createPerfMeter(), isEnabled(), PerfMeter, PerfSnapshot

### Community 200 - "VitalsReporter.tsx"
Cohesion: 0.29
Nodes (8): firstPainting(), flush(), Metric, queue, REPORTED, VitalsReporter(), FIRST_PAINTING_MARK, MUSEUM_START_MARK

### Community 201 - "CrowdPreview.tsx"
Cohesion: 0.33
Nodes (7): CrowdPreviewPage(), CrowdPreview(), draw(), KINDS, Stats, Window, clearRigLayer()

### Community 202 - "shopkeeper.ts"
Cohesion: 0.25
Nodes (7): RigPiece, COATS, createShopkeeper(), GREETINGS, OUTFIT, recolourFur(), SHOPKEEPER_NAME

### Community 204 - "createRigState"
Cohesion: 0.36
Nodes (7): createCharacter(), contextLost(), loadKind(), loseRig(), setFrame(), createRigState(), Angler()

### Community 205 - "CodesSection.tsx"
Cohesion: 0.39
Nodes (7): createCodeAction(), deleteCodeAction(), CodeRow, CodesSection(), create(), remove(), revokeQrToken()

### Community 206 - "share.ts"
Cohesion: 0.33
Nodes (5): ShareOutcome, shareResult(), ShareSummary, shareText(), base

### Community 208 - "BunnyArtist.tsx"
Cohesion: 0.50
Nodes (4): BunnyArtist(), BunnyMood, Pencil(), POSES

### Community 215 - "createStage"
Cohesion: 0.15
Nodes (22): boundedCameraX(), createNearby(), createStage(), closeEntry(), enter(), initialize(), aim(), drawFrame() (+14 more)

## Knowledge Gaps
- **5 isolated node(s):** `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1394 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **23 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `PondRoom.tsx` to `domain/guestboard.ts`, `SketchGuess.tsx`, `app/layout.tsx`, `app/page.tsx`, `round.ts`, `lib/presence.ts`, `bug-report.ts`, `machine.ts`, `Test Fakes and Helpers`, `visits.ts`, `gallery/page.tsx`, `room-events.ts`, `stage.ts`, `tables.ts`, `pond-state.ts`, `Museum.tsx`, `useMember`, `Walkthrough.tsx`, `Web Package Dependencies`, `RigPreview.tsx`, `useBackgroundMusic.ts`, `features/economy/index.ts`, `risk.ts`, `PondTicker.tsx`, `PersonalRoom.tsx`, `LandingFx`, `Water.tsx`, `SoundProvider.tsx`, `wardrobe.ts`, `json`, `pond-format.ts`, `AccountSheet.tsx`, `BountyPanel.tsx`, `useSoundEffects.ts`, `a/[slug]/page.tsx`, `AssetImage`, `CrowdPreview.tsx`, `VitalsReporter.tsx`, `CodesSection.tsx`, `FishingView.tsx`, `pond-api.ts`?**
  _High betweenness centrality (0.074) - this node is a cross-community bridge._
- **What connects `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json` to the rest of the system?**
  _5 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `themes.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12554112554112554 - nodes in this community are weakly interconnected._
- **Why does `three` connect `three` to `CameraRig`, `scene/assets.ts`, `lobby.ts`, `scene.ts`, `cozy.ts`, `personal/room.ts`, `room-events.ts`, `stage.ts`, `prepare-models.mjs`, `hall/room.ts`, `hit.ts`, `ambience.ts`, `Web Package Dependencies`, `atelier.ts`, `scene/ambience.ts`, `perf.ts`, `pond/art.ts`, `pond/room.ts`, `remote-visitors.ts`, `rig.ts`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **Should `walk.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11494252873563218 - nodes in this community are weakly interconnected._
- **Why does `defaultStore()` connect `wardrobe.ts` to `slots/store.ts`, `pond-api.ts`, `SyncStore`, `useMember`, `pondgame/lib/api.ts`, `PersonalRoom.tsx`, `room-events.ts`, `stage.ts`, `hall/room.ts`, `pond-state.ts`, `json`, `createStage`, `economy/store.ts`, `createPondRoom`, `pond/room.ts`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Should `SketchGuess.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12043010752688173 - nodes in this community are weakly interconnected._