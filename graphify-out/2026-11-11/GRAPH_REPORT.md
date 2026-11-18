# Graph Report - tiny-museum  (2026-11-11)

## Corpus Check
- 496 files · ~272,981 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 82 file(s) not represented in the graph (top: .avif 39, .glb 34, .css 4)

## Summary
- 4349 nodes · 11222 edges · 205 communities (173 shown, 32 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 215 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `dbf1c3c1`
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
- actions.ts
- room-events.ts
- stage.ts
- ref_node_assert
- amplify/package.json
- domain/pond.ts
- prepare-models.mjs
- Traversal
- core/package.json
- FishingView.tsx
- Character
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
- member-route.ts
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
- currentMember
- pond-format.ts
- react
- economy/store.ts
- backend.ts
- room.ts
- minimap.ts
- Personal room: stress-test issues
- walk
- Sound Effect Assets
- ticket/route.ts
- Custom HTTP Headers
- Sharp Layer Package
- atelier/room.ts
- scene/ambience.ts
- wallet/body.ts
- createAtelierRoom
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
- outbox.test.ts
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
- dependencies
- exports
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
- createMinimap
- tsconfig.test.json
- bug-reports.ts
- catalog.ts
- lib/presence.ts
- Item
- DecorDrawer.tsx
- jobs.ts
- hall/room.ts
- epoch.ts
- presence.test.ts
- art-cache.ts
- visits.ts
- personal/room.ts
- The Moonlit Pond — design
- Pond rework
- env.ts
- Orchestration contract — you plan, DSH workers execute
- tables.ts
- AtelierRoom
- createHallRoom
- pond-state.ts
- hit.ts
- Other visitors
- FilesystemStorage
- lib/slots/index.ts
- logic.ts
- Walkthrough.tsx
- createPondRoom
- Pedestal
- audience.ts
- ColorRecall.tsx
- features/economy/index.ts
- painting-open
- tab-turn.ts
- Multiplayer ("other visitors") — plan v2 (Cloudflare)
- hang-tag.ts
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
- 4. Transport: Cloudflare Durable Objects
- confirm/page.tsx
- ticket
- Minimap
- perf.ts
- Low
- xdog.ts
- createStage
- media/storage.ts
- Cafe
- TreeSparkles
- Approved v4 bunny in the hall
- useSoundEffects.ts
- db.ts
- Monets Lily Pond: exploration, UX and multiplayer QA
- messages.ts
- HelmShare
- AtelierActions
- pond-api.ts
- ArtCache
- boundedCameraX
- Notes
- Sitting
- Lobby
- Context
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
- `5.1 Emotes (v1)` --references--> `ScreenChrome()`  [INFERRED]
  docs/multiplayer-plan.md → apps/web/src/shared/components/ScreenChrome.tsx
- `E2E-009 — Room mutations ignore stale account identity` --references--> `memberFromRequest()`  [INFERRED]
  docs/testing/local-e2e-stress-2026-11-06.md → apps/web/src/shared/lib/member-route.ts
- `Where things stand` --references--> `sealEpoch()`  [INFERRED]
  docs/curation-plan.md → packages/core/src/domain/epoch.ts

## Import Cycles
- None detected.

## Communities (205 total, 32 thin omitted)

### Community 0 - "themes.ts"
Cohesion: 0.09
Nodes (24): COLLECTIONS, GAMES, isRecord(), parsePlacements(), placementOf(), PlacementOwnership, ownsAll, ownsNone (+16 more)

### Community 1 - "walk.ts"
Cohesion: 0.13
Nodes (13): FloorPoint, WalkArea, water, depthAtLift(), DEPTH_SPAN, depthOf(), MAX_DEPTH, PICTURE (+5 more)

### Community 2 - "SketchGuess.tsx"
Cohesion: 0.08
Nodes (40): BunnyArtist(), BunnyMood, Pencil(), POSES, bestKeyFor(), BURST, clueUrl(), openingPlan() (+32 more)

### Community 3 - "rooms.ts"
Cohesion: 0.12
Nodes (21): GET(), PaintingRow, GET(), POST(), UPLOADS_PER_ARTIST, POST(), UPLOADS_PER_ARTIST, dynamic (+13 more)

### Community 4 - "rules.ts"
Cohesion: 0.15
Nodes (18): localDay(), at(), EXCHANGE_DAILY_STAMPS, EXCHANGE_PEARLS_PER_STAMP, exchangeClaimKey(), GAME_DAILY_CAP, GameId, GAMES (+10 more)

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
Cohesion: 0.08
Nodes (43): sameOriginUrl(), AssetManifest, assetUrl(), bitmapTexture(), blankImage(), CAFE_CAT_FRAMES, CompressedLoader, elementTexture() (+35 more)

### Community 9 - "SyncStore"
Cohesion: 0.17
Nodes (6): encodeStored(), parseStored(), readStored(), writeStored(), SyncStore, upgrade()

### Community 10 - "machine.ts"
Cohesion: 0.12
Nodes (34): armCast(), BITE_WINDOW, biteGap(), CHARGE_PERIOD, chargePower(), createFishingState(), createReelState(), DANGER_TENSION (+26 more)

### Community 11 - "PondRoom.tsx"
Cohesion: 0.09
Nodes (25): Loading(), Loading(), metadata, PondPage(), AtelierLoading(), revealFloorTransition(), PondGame(), POND_NAME (+17 more)

### Community 12 - "Test Fakes and Helpers"
Cohesion: 0.12
Nodes (27): deferredFetch(), deviceSlot, FakeEvents, FakeStorage, fixture, fixtureB, fixtureRegistry, fixtureRegistryBoth (+19 more)

### Community 13 - "scene.ts"
Cohesion: 0.07
Nodes (14): disposeDisplayTexture(), prefersAvif(), HiddenCoin, HallScene, markFirstPainting(), retryDelayMs(), wallSize(), createPaintingLight() (+6 more)

### Community 14 - "cozy.ts"
Cohesion: 0.09
Nodes (29): aspectOf(), ATELIER_PROPS, AtelierImage, canvasTexture(), CozyBackdrop, cozyPropImageUrl(), createPlacementLayer(), drawOutline() (+21 more)

### Community 15 - "actions.ts"
Cohesion: 0.05
Nodes (80): config, SECURITY_HEADERS, AnalyticsPage(), dynamic, BugReportsPage(), dateFormat, dynamic, summary() (+72 more)

### Community 16 - "room-events.ts"
Cohesion: 0.19
Nodes (25): ChatButton(), REFUSED, joinRoom(), emit(), getPeople(), isInRoom(), isMuted(), muted (+17 more)

### Community 17 - "stage.ts"
Cohesion: 0.03
Nodes (53): CharacterSprites, AtelierArt, CameraRig, Viewport, createPixelRatioGovernor(), PIXEL_RATIO_STEPS, Options, Pose (+45 more)

### Community 18 - "ref_node_assert"
Cohesion: 0.11
Nodes (29): valid, defineSlot(), docBytes(), SLOTS, byAtThenKey(), encoded(), latest, mapOf() (+21 more)

### Community 19 - "amplify/package.json"
Cohesion: 0.17
Nodes (14): devDependencies, @aws-amplify/backend@^1.14.0, @aws-amplify/backend-cli@^1.6.0, aws-cdk-lib@^2.180.0, constructs@^10.3.0, name, private, scripts (+6 more)

### Community 20 - "domain/pond.ts"
Cohesion: 0.09
Nodes (40): baitOf(), bountyCatches(), BountyCatchRow, bountyViews(), castPond(), chainPondBait(), claimPondBounty(), exchangePearls() (+32 more)

### Community 21 - "prepare-models.mjs"
Cohesion: 0.10
Nodes (26): paintedCostume(), BODIES, bruce, BRUCE_FIT, BRUCE_PLACE, bunny, CARDIGAN_TIE, CROWN (+18 more)

### Community 22 - "Traversal"
Cohesion: 0.09
Nodes (9): coverFloorTransition(), JumpPose, createRoomPassage(), fixture(), clamp(), fixture(), jump(), Traversal (+1 more)

### Community 23 - "core/package.json"
Cohesion: 0.16
Nodes (13): devDependencies, @types/bcryptjs@^2.4.6, @types/pg@^8.11.10, main, name, private, scripts, typecheck (+5 more)

### Community 24 - "FishingView.tsx"
Cohesion: 0.12
Nodes (26): BaitTray(), CAST_ERRORS, coarsePointer(), FishingView(), initialEasyReel(), isTyping(), LOST, Toast (+18 more)

### Community 25 - "Character"
Cohesion: 0.09
Nodes (11): Carried, Character, centerYFor(), Matcha, hop(), createDecorController(), canvasRect(), targetRise() (+3 more)

### Community 27 - "Museum.tsx"
Cohesion: 0.18
Nodes (20): PinnedNotes(), CoinFound, ColorRecall, GameDesktop, GuestBoard, HallArranger, HelpGuide, loadCoinFound() (+12 more)

### Community 28 - "ambience.ts"
Cohesion: 0.13
Nodes (30): blade(), bloom(), BLOOMS, createPondAmbience(), update(), fishTexture(), frond(), FRONT_ROWS (+22 more)

### Community 29 - "economy/pond.ts"
Cohesion: 0.06
Nodes (56): addBait(), PondStateView, reelPond(), BOUNTY_POOL, BountyTemplate, inverseNormal(), isPondFish(), isPondTier() (+48 more)

### Community 30 - "Web Package Dependencies"
Cohesion: 0.07
Nodes (33): dependencies, embla-carousel-react@^8.6.0, motion@^13.1.1, next@^15.0.3, react@^19.0.0, react-dom@^19.0.0, swr@^2.5.1, three@^0.169.0 (+25 more)

### Community 31 - "Gamifying Tiny Museum — genre direction & engagement research"
Cohesion: 0.10
Nodes (19): 0.1 The core experience, 0.2 Systems that make gamification cheap to build, 0.3 Constraints that shape any recommendation, 0. What the game is today (the deep dive), 1.1 The landscape (seven candidates, with verdicts), 1.2 Recommendation: a **cozy gallery life-sim** — "the gallery you live in", 1.3 The five design pillars the genre implies, 1. Genre direction (+11 more)

### Community 32 - "atelier.ts"
Cohesion: 0.07
Nodes (30): AtelierImage, BuiltRoom, Cardigan, CARDIGAN_NAMES, CHARACTER_NAMES, Control, refresh(), Display (+22 more)

### Community 33 - "slots/store.ts"
Cohesion: 0.15
Nodes (16): ANON_PREFIX, anonKey(), deviceKey(), isMemberSlotKey(), listKeys(), MEMBER_KEY, memberKey(), memberPrefix() (+8 more)

### Community 34 - "risk.ts"
Cohesion: 0.18
Nodes (22): WagerPicker(), chooseTier(), WagerPickerProps, chainChipLabel(), chainOffer, clampWagerStake(), formatMultiplier(), formatPayout() (+14 more)

### Community 35 - "amplify/tsconfig.json"
Cohesion: 0.20
Nodes (9): compilerOptions, module, moduleResolution, noUnusedLocals, noUnusedParameters, exclude, extends, include (+1 more)

### Community 36 - "5. Customization menu — what other people are doing"
Cohesion: 0.12
Nodes (16): 1. The target: what "Claude Opus 5.5" actually means, 2. Where your harness stands today (live config I read), 3. The honest gap model, 4. Quality levers, ranked by leverage, 5. Customization menu — what other people are doing, 6. Recommended starting kit for *your* profile, 7. What I can apply for you right now (needs your go-ahead), A. Prompt & persona (most common quality customizations) (+8 more)

### Community 37 - "core/src/index.ts"
Cohesion: 0.15
Nodes (32): buyPondBait(), getPondBounties(), PondBaitResult, applyClaim(), baitCounts(), baitOf(), buy(), BuyResult (+24 more)

### Community 38 - "layout.ts"
Cohesion: 0.10
Nodes (17): cafeAfterIndex(), comingSoonWidth(), computeLayout(), cutRooms(), HallLayout, HallRoomKind, HallRoomSpan, hasPedestal() (+9 more)

### Community 39 - "Web TSConfig"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 40 - "Root Package Manifest"
Cohesion: 0.07
Nodes (35): description, devDependencies, concurrently@^9.1.0, esbuild@^0.24.0, ktx2-encoder@^0.6.0, maxrects-packer@^2.7.3, playwright@^1.63.0, @types/node@^22.9.0 (+27 more)

### Community 41 - "member-route.ts"
Cohesion: 0.18
Nodes (16): GLOBAL, PER_IP, roomEditor, PER_EDITOR, PUT(), versionOf(), PER_EDITOR, POST() (+8 more)

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
Cohesion: 0.14
Nodes (16): PlaceInfo, PreparedGame, decodeImage(), fetchBitmap(), fetchRound(), guarded(), InkMap, LoadedRound (+8 more)

### Community 47 - "hitForVisitor"
Cohesion: 0.10
Nodes (28): POST(), ALLOWED, POST(), POST(), POST(), GLOBAL, PER_IP, POST() (+20 more)

### Community 48 - "FakeServer"
Cohesion: 0.14
Nodes (5): FakeServer, SlotState, serverSnapshot(), serverSnapshots, SlotDef

### Community 49 - "handlers.ts"
Cohesion: 0.07
Nodes (51): prop(), Design for Phases 5–7 (2026-11-05), confirmedFollowers(), sealEpoch(), SliceRow, deletePiece(), GalleryPiece, hangPiece() (+43 more)

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
Cohesion: 0.09
Nodes (38): AtelierPage(), dynamic, metadata, allowedCharacter(), OwnedSnapshot, owns(), walletReady(), buy() (+30 more)

### Community 54 - "Placement"
Cohesion: 0.12
Nodes (6): Carry, PersonalRoomProps, HallRoomData, PersonalRoomOptions, PlacementLayer, Placement

### Community 55 - "compose-atelier.mjs"
Cohesion: 0.14
Nodes (9): body, dressLayer, dressWidth, floralWidth, MANNEQUIN_CANVAS, mask, root, sourceSize (+1 more)

### Community 56 - "currentMember"
Cohesion: 0.18
Nodes (15): GET(), POST(), BOARDS, GET(), oneOf(), PER_VISITOR, PERIODS, GET() (+7 more)

### Community 57 - "pond-format.ts"
Cohesion: 0.13
Nodes (26): EXCHANGE_DAILY_STAMPS, EXCHANGE_PEARLS_PER_STAMP, FISH_ART, fishArt(), formatPercent(), formatShortSizeCm(), ODDS_BAIT, POND_BAIT (+18 more)

### Community 58 - "react"
Cohesion: 0.12
Nodes (20): openBugReport(), fitWidth(), HelpGuide(), HelpGuideProps, POINTER_STEPS, TOUCH_STEPS, loadGameDesktop(), GameDesktop() (+12 more)

### Community 59 - "economy/store.ts"
Cohesion: 0.09
Nodes (48): CARRY_CAP, carryAdd(), CarryEntry, carryPrune(), carryRemove(), chunk(), buildClaim(), BuiltClaim (+40 more)

### Community 60 - "backend.ts"
Cohesion: 0.15
Nodes (12): amplifyDir, backend, everyMinutes, mediaBucket, missing, repoRoot, REQUIRED, setting() (+4 more)

### Community 61 - "room.ts"
Cohesion: 0.12
Nodes (29): admitted(), Attachment, farewell(), GHOST_MS, HELLO_TIMEOUT_MS, holdsOf(), MAX_WAITING_PER_IP, newAttachment() (+21 more)

### Community 62 - "minimap.ts"
Cohesion: 0.10
Nodes (25): ATELIER_DOOR, follow(), doorPoint(), FALLBACK_TINT, FloorSketch, ICONS, MAP_PLACES, MAP_SCALE (+17 more)

### Community 63 - "Personal room: stress-test issues"
Cohesion: 0.20
Nodes (10): 2. One owned item can be placed many times, 3. Any save rejection throws away all unsaved work, 4. Changes made just before leaving are lost, 5. Fish trophies can be claimed without playing, Checked and fine, High, Not covered by this pass, Personal room: stress-test issues (+2 more)

### Community 64 - "walk"
Cohesion: 0.19
Nodes (13): between(), CAT, Edge, EDGES, runLandingCat(), peek(), walk(), 1. What is in this bundle (+5 more)

### Community 65 - "Sound Effect Assets"
Cohesion: 0.22
Nodes (9): file, kilobytes, seconds, file, kilobytes, seconds, soundEffects, click (+1 more)

### Community 66 - "ticket/route.ts"
Cohesion: 0.21
Nodes (12): GET(), PER_MEMBER, PUT(), GET(), PER_IP, POST(), presenceUrl(), memberFromRequest() (+4 more)

### Community 67 - "Custom HTTP Headers"
Cohesion: 0.25
Nodes (7): applications, appRoot, customHeaders, headers, pattern, key, value

### Community 68 - "Sharp Layer Package"
Cohesion: 0.33
Nodes (6): dependencies, sharp@^0.33.5, description, sharp, name, private

### Community 69 - "atelier/room.ts"
Cohesion: 0.15
Nodes (13): earn(), emit(), emitEarned(), maybeInvite(), writeSession(), followOutfit(), sync(), Wardrobe (+5 more)

### Community 70 - "scene/ambience.ts"
Cohesion: 0.13
Nodes (13): BULBS, createHallAmbience(), finish(), glowTexture(), HallAmbience, mulberry(), painted(), vignetteTexture() (+5 more)

### Community 71 - "wallet/body.ts"
Cohesion: 0.18
Nodes (15): PER_MEMBER, POST(), baitIdOf(), integerOffset(), isRecord(), itemIdOf(), MAX_CLAIM_BATCH, MAX_WALLET_BODY_BYTES (+7 more)

### Community 72 - "createAtelierRoom"
Cohesion: 0.32
Nodes (19): aspectOf(), createAtelierRoom(), buildCollection(), form(), buildEntrance(), buildRoom(), picture(), place() (+11 more)

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
Cohesion: 0.18
Nodes (16): ArtByRoom, blank(), colorAt(), disposePondArt(), EDGE_BAND, EDGE_BANDS, EDGE_OVERLAP, edgeTexture() (+8 more)

### Community 80 - "createPresence"
Cohesion: 0.16
Nodes (15): createPresence(), drop(), heartbeat(), maybeSend(), onPageHide(), receive(), scheduleRetry(), send() (+7 more)

### Community 81 - "members"
Cohesion: 0.12
Nodes (25): coin_claims, coin_claims_daily, wallet_bait, wallet_items, wallets, member_sessions, member_sessions_member, member_slots (+17 more)

### Community 82 - "Frame Window Asset"
Cohesion: 0.50
Nodes (4): frame, size, window, windowAspect

### Community 83 - "outbox.test.ts"
Cohesion: 0.25
Nodes (12): OUTBOX_CAP, outboxAdd(), outboxDue(), OutboxEntry, outboxFail(), outboxRemove(), RETRY_BASE_MS, RETRY_MAX_MS (+4 more)

### Community 84 - "presence/package.json"
Cohesion: 0.14
Nodes (16): dependencies, @tiny/core@*, devDependencies, @cloudflare/workers-types@5.20261016.1, wrangler@4.151.1, @tiny/core, name, private (+8 more)

### Community 85 - "db-tests/pond.test.ts"
Cohesion: 0.13
Nodes (14): CatchExtra, clearCatches(), COLUMNS, grantPearls(), insertCatch(), member(), namedMember(), randomId() (+6 more)

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
Cohesion: 0.10
Nodes (28): listPieces(), pieceImageUrl(), PieceRow, toPieceDto(), EpochRow, GalleryRow, planSketchRound(), SKETCH_CHOICES (+20 more)

### Community 93 - "json"
Cohesion: 0.13
Nodes (39): POST(), POST(), POST(), PER_MEMBER, PUT(), PER_MEMBER, POST(), catchIdOf() (+31 more)

### Community 94 - "pond-boards.ts"
Cohesion: 0.12
Nodes (27): compare(), DexRow, displayName(), FeedRow, getPondFeed(), getPondLeaderboard(), NameRow, PondBoardId (+19 more)

### Community 95 - "pond/room.ts"
Cohesion: 0.12
Nodes (23): FAR_LIFT, FAR_SCALE, liftAt(), pathHalfWidth(), pathX(), PondPath, scaleAt(), path (+15 more)

### Community 96 - "members.ts"
Cohesion: 0.08
Nodes (46): Code, 3.2 Chosen names (members), registry, started(), grantPearls(), member(), now, piece() (+38 more)

### Community 104 - "locations.ts"
Cohesion: 0.11
Nodes (39): placePaintingAction(), returnTo(), artist(), member(), piece(), randomId(), discardLocation(), hasUnpublished() (+31 more)

### Community 105 - "FishingView.tsx"
Cohesion: 0.12
Nodes (13): CONFETTI_COLORS, ConfettiPiece, makeConfetti(), RevealCard(), TIER_MS, TIER_SFX, useCountUp(), AudioContextClass (+5 more)

### Community 106 - "ticket.ts"
Cohesion: 0.17
Nodes (16): validRoomBase(), decoder, encoder, fromBase64Url(), HmacKey, isOwn(), isTicket(), keyFor() (+8 more)

### Community 107 - "lib/assets.ts"
Cohesion: 0.10
Nodes (31): Loading(), dynamic, Hall(), MuseumPage(), [BRAND_OWNER, ...BRAND_REST], CurrentlyShowing(), Decor(), dynamic (+23 more)

### Community 108 - "dependencies"
Cohesion: 0.15
Nodes (13): dependencies, @aws-sdk/client-s3@^3.1121.0, @aws-sdk/s3-request-presigner@^3.1121.0, bcryptjs@^2.4.3, obscenity@^0.4.6, sharp@^0.33.5, thumbhash@^0.1.1, sharp (+5 more)

### Community 109 - "exports"
Cohesion: 0.15
Nodes (13): exports, ./brand, ./bugs, ./economy, ./guestboard, ./presence, ./presence/messages, ./presence/wire (+5 more)

### Community 110 - "graftCostume"
Cohesion: 0.27
Nodes (14): canvasFit(), compose(), graftCostume(), copyAccessor(), copyMaterial(), copyMesh(), copyTexture(), copyView() (+6 more)

### Community 111 - "pondgame/lib/api.ts"
Cohesion: 0.21
Nodes (20): buyPondBait(), CastOptions, castPond(), chainPondBait(), errorOf(), fetchPondState(), isRecord(), memberId() (+12 more)

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
Cohesion: 0.27
Nodes (13): fetchPondLeaderboard(), formatCountdown(), formatOdds(), nextMondayUtc(), useCountdown(), useNow(), BoardRow(), BOARDS (+5 more)

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
Cohesion: 0.04
Nodes (82): CrowdPreviewPage(), RigPreviewPage(), CrowdPreview(), draw(), KINDS, Stats, Window, NEXT (+74 more)

### Community 127 - "Curating the paintings (2026-11-07)"
Cohesion: 0.13
Nodes (14): 1. The registry and the table, 2. The studio's Location picker, 3. The rooms draw what is placed, 4. Credits, 5. Retiring self-serve artists, Building it, Curating the paintings (2026-11-07), Decided (+6 more)

### Community 128 - "domain/guestboard.ts"
Cohesion: 0.07
Nodes (44): GET(), BoardScreen(), BoardScreenProps, ComposeScreen(), ComposeScreenProps, blankDraft(), GuestBoard(), GuestBoardProps (+36 more)

### Community 129 - "presence/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, types, exclude, extends, include, ../../tsconfig.base.json

### Community 130 - "createMinimap"
Cohesion: 0.31
Nodes (9): place(), createMinimap(), draw(), drawRoom(), floors(), sketchOf(), readCollapsed(), svg() (+1 more)

### Community 131 - "tsconfig.test.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 132 - "bug-reports.ts"
Cohesion: 0.06
Nodes (44): bethEllen, inspiratiq, metadata, notoSans, RootLayout(), sniglet, viewport, BugReportHost() (+36 more)

### Community 133 - "catalog.ts"
Cohesion: 0.27
Nodes (11): CatalogItem, CatalogKind, FREE_CHARACTERS, isBuyable(), isCatalogItem(), ITEMS, ItemSlot, priceOf() (+3 more)

### Community 134 - "lib/presence.ts"
Cohesion: 0.07
Nodes (20): fetch(), Env, Entry, INTERPOLATION_DELAY_MS, PEER_TIMEOUT_MS, PeerTable, positionAt(), RemoteVisitor (+12 more)

### Community 135 - "Item"
Cohesion: 0.21
Nodes (3): Presence, Item, Refusal

### Community 136 - "DecorDrawer.tsx"
Cohesion: 0.29
Nodes (3): DecorDrawer, DecorDrawerProps, categoryOf()

### Community 137 - "jobs.ts"
Cohesion: 0.25
Nodes (14): loop(), shutdown(), sleep(), sweepStale(), DrainResult, handler(), repairFrames(), repairUnframed() (+6 more)

### Community 138 - "hall/room.ts"
Cohesion: 0.06
Nodes (62): MuseumProps, Assets, Scenery, CUTS, disposeBoards(), Mark, plane(), ROPE_CUTS (+54 more)

### Community 139 - "epoch.ts"
Cohesion: 0.21
Nodes (14): GET(), intParam(), GET(), sketchPool, unavailable(), EMPTY, memo, currentEpoch() (+6 more)

### Community 140 - "presence.test.ts"
Cohesion: 0.13
Nodes (13): Connect, connectWebSocket(), HEARTBEAT_MS, HIDDEN_LIMIT_MS, SocketHandlers, Clock, Conn, flush() (+5 more)

### Community 141 - "art-cache.ts"
Cohesion: 0.21
Nodes (9): ArtCacheOptions, createArtCache(), drop(), expireLater(), hold(), HeldArt, LoadResult, Slot (+1 more)

### Community 142 - "visits.ts"
Cohesion: 0.06
Nodes (48): state(), PER_VISITOR, POST(), dynamic, format(), grade(), METRICS, PAGES (+40 more)

### Community 143 - "personal/room.ts"
Cohesion: 0.07
Nodes (18): GALLERY_DOOR, loadGalleryDoor(), loadGalleryPillar(), loadImage(), pending, CafeLink, ComingSoonNote, GiftShopSigns (+10 more)

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
Cohesion: 0.10
Nodes (36): BaitTrayProps, PondGameProps, RevealCardProps, PondCatch, CatchView, debugSpecies(), debugVariant(), GuestRoll (+28 more)

### Community 150 - "createHallRoom"
Cohesion: 0.10
Nodes (18): FunZoneSign, LobbySigns, createSitting(), createHallRoom(), buildRoom(), cafeRoom(), raise(), enterAtelier() (+10 more)

### Community 151 - "pond-state.ts"
Cohesion: 0.20
Nodes (16): ensurePondStateStarted(), getPondStateSnapshot(), GUEST, listeners, LOADING, PondStateSnapshot, publish(), readMemberId() (+8 more)

### Community 152 - "hit.ts"
Cohesion: 0.21
Nodes (10): createHiddenCoin(), AlphaMap, alphaMapFor(), alphaMaps, buildAlphaMap(), isPaintedAt(), registerSpriteMask(), spread() (+2 more)

### Community 153 - "Other visitors"
Cohesion: 0.29
Nodes (6): How it plays, Other visitors, Privacy, Running it in production, Running it locally, Staying consistent

### Community 155 - "lib/slots/index.ts"
Cohesion: 0.09
Nodes (21): PresencePreviewPage(), AccountHost(), AccountSheet, NAME_ERRORS, Pending, View, KeepOnOtherDevices(), AccountMode (+13 more)

### Community 156 - "logic.ts"
Cohesion: 0.12
Nodes (23): loadHallArranger(), HallArranger(), HallArrangerProps, Painting, cozyLevel, cozyWorth(), currentHallOrder(), DrawerCategory (+15 more)

### Community 157 - "Walkthrough.tsx"
Cohesion: 0.12
Nodes (23): BACKDROP_STYLE, MoreArrow(), NavArrow(), Props, SLIDE, Walkthrough(), XIcon(), decodedFrames (+15 more)

### Community 158 - "createPondRoom"
Cohesion: 0.32
Nodes (13): createPondRoom(), approach(), busy(), finishWalk(), goTo(), leave(), move(), nearest() (+5 more)

### Community 160 - "audience.ts"
Cohesion: 0.11
Nodes (20): ArtistPage(), dynamic, generateMetadata(), GET(), GET(), FollowForm(), getArtistPage(), AnalyticsSummary (+12 more)

### Community 161 - "ColorRecall.tsx"
Cohesion: 0.27
Nodes (10): ColorRecall(), ColorRecallProps, Phase, readBest(), ColorRound, showMs(), loadColorRecall(), saveIfHigher() (+2 more)

### Community 162 - "features/economy/index.ts"
Cohesion: 0.12
Nodes (25): MuseumLayout(), CoinToast(), Toast, Purse(), Stamp(), WalletProvider(), serverSnapshot, useEarnEvents() (+17 more)

### Community 163 - "painting-open"
Cohesion: 0.50
Nodes (4): file, kilobytes, seconds, painting-open

### Community 164 - "tab-turn.ts"
Cohesion: 0.16
Nodes (5): createTabTurn(), TabTurn, tab(), TurnEnv, TurnMessage

### Community 165 - "Multiplayer ("other visitors") — plan v2 (Cloudflare)"
Cohesion: 0.17
Nodes (11): 0. Summary, 10. Decisions, 1. Product contract changes (approved 2026-10-31), 2. What already exists that this builds on, 3.1 Generated names (everyone has one), 3. Names, 5.1 Emotes (v1), 5. Protocol (`packages/core/src/presence/protocol.ts`) (+3 more)

### Community 166 - "hang-tag.ts"
Cohesion: 0.17
Nodes (6): CARD, createHangTag(), HangTag, HangTagStyle, HOLE, KNOT

### Community 167 - "run.ts"
Cohesion: 0.17
Nodes (9): admin, childEnv, client, database, fresh, migrations, target, pg@^8.13.1 (+1 more)

### Community 168 - "AccountSheet"
Cohesion: 0.29
Nodes (9): AccountSheet(), continueAnyway(), doSignOut(), runDelete(), runName(), submit(), submitDelete(), submitName() (+1 more)

### Community 169 - "icon-basket"
Cohesion: 0.67
Nodes (3): icon-basket, file, vector

### Community 170 - "nearby.ts"
Cohesion: 0.33
Nodes (4): NearbyReach, RoomSpan, reach, strip

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
Cohesion: 0.12
Nodes (26): errorReason(), overDrawer(), PersonalRoom(), canPlaceNew(), carryEnd(), carryMove(), onCardKey(), onCardPointerDown() (+18 more)

### Community 177 - "LandingFx"
Cohesion: 0.32
Nodes (5): glowSprite(), LandingFx(), onVisibility(), tick(), Mote

### Community 179 - "4. Transport: Cloudflare Durable Objects"
Cohesion: 0.25
Nodes (8): 4. Transport: Cloudflare Durable Objects, Decision (2026-10-31), Deploying, Identity cannot be forged, Local development and tests, Rooms and capacity, Shape of `apps/presence` (about 200 lines), main()

### Community 180 - "confirm/page.tsx"
Cohesion: 0.33
Nodes (7): ConfirmFollow(), dynamic, dynamic, Unsubscribe(), FollowNotice(), confirmFollow(), unsubscribe()

### Community 183 - "perf.ts"
Cohesion: 0.22
Nodes (4): createPerfMeter(), isEnabled(), PerfMeter, PerfSnapshot

### Community 184 - "Low"
Cohesion: 0.25
Nodes (8): 13. Pages that redirect or don't exist answer 200, 14. Error codes reveal which room slugs exist, 15. The name sign slides under the top-right buttons in Decorate, 16. Level-up celebrations can be farmed, 17. No hint of where things are after panning away, 18. Too many items is only discovered by the server, 19. Development-only: page payloads include the full room row, Low

### Community 185 - "xdog.ts"
Cohesion: 0.39
Nodes (5): blur(), kernel(), XDOG_DEFAULTS, xdogInk(), XdogOptions

### Community 186 - "createStage"
Cohesion: 0.52
Nodes (7): createNearby(), createStage(), closeEntry(), enter(), isCurrent(), isQuiet(), open()

### Community 187 - "media/storage.ts"
Cohesion: 0.10
Nodes (17): CONTENT_TYPES, GET(), PUT(), ACCEPTED, createAssetFromUpload(), MAX_UPLOAD_BYTES, presignUpload(), registerUpload() (+9 more)

### Community 190 - "Approved v4 bunny in the hall"
Cohesion: 0.29
Nodes (5): Approved v4 bunny in the hall, Assets, Existing interactions and fallback, Local review and checks, Rendering and movement

### Community 191 - "useSoundEffects.ts"
Cohesion: 0.10
Nodes (31): SoundContext, SoundProvider(), SoundState, BackgroundMusic, clampVolume(), isDocumentHidden(), Options, useBackgroundMusic() (+23 more)

### Community 192 - "db.ts"
Cohesion: 0.43
Nodes (4): getPool(), poolConfig(), sslFor(), RDS_CA_BUNDLE

### Community 193 - "Monets Lily Pond: exploration, UX and multiplayer QA"
Cohesion: 0.29
Nodes (6): Browser and interaction coverage, Changes made from the walkthrough, Monets Lily Pond: exploration, UX and multiplayer QA, Multiplayer and load, Practical limits, Regression checks and cleanup

### Community 194 - "messages.ts"
Cohesion: 0.31
Nodes (7): checkMessage(), INVISIBLE, MESSAGE_MAX, MessageCheck, normalizeMessage(), hasProfanity(), matcher

### Community 197 - "pond-api.ts"
Cohesion: 0.12
Nodes (36): buyPondBait(), claimPondBounty(), errorOf(), exchangePondPearls(), fetchPondBounties(), fetchPondDex(), fetchPondState(), isRecord() (+28 more)

### Community 215 - "createStage"
Cohesion: 0.22
Nodes (14): initialize(), aim(), drawFrame(), handleClick(), handlePointerDown(), handlePointerMove(), handlePointerUp(), prefetchNearDoors() (+6 more)

## Knowledge Gaps
- **5 isolated node(s):** `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1385 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **32 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `domain/guestboard.ts`, `SketchGuess.tsx`, `rooms.ts`, `bug-reports.ts`, `PondRoom.tsx`, `Test Fakes and Helpers`, `visits.ts`, `actions.ts`, `room-events.ts`, `stage.ts`, `tables.ts`, `pond-state.ts`, `FishingView.tsx`, `Museum.tsx`, `lib/slots/index.ts`, `Walkthrough.tsx`, `Web Package Dependencies`, `logic.ts`, `audience.ts`, `ColorRecall.tsx`, `features/economy/index.ts`, `risk.ts`, `PondTicker.tsx`, `PersonalRoom.tsx`, `LandingFx`, `Water.tsx`, `FakeServer`, `wardrobe.ts`, `pond-format.ts`, `useSoundEffects.ts`, `pond-api.ts`, `FishingView.tsx`, `lib/assets.ts`, `pond-api.ts`, `rig.ts`?**
  _High betweenness centrality (0.083) - this node is a cross-community bridge._
- **What connects `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json` to the rest of the system?**
  _5 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `themes.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08888888888888889 - nodes in this community are weakly interconnected._
- **Why does `three` connect `hall/room.ts` to `atelier.ts`, `scene/ambience.ts`, `hang-tag.ts`, `scene/assets.ts`, `scene.ts`, `cozy.ts`, `personal/room.ts`, `pond/art.ts`, `stage.ts`, `perf.ts`, `prepare-models.mjs`, `Web Package Dependencies`, `hit.ts`, `Character`, `ambience.ts`, `rig.ts`, `pond/room.ts`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **Should `walk.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12561576354679804 - nodes in this community are weakly interconnected._
- **Why does `Traversal` connect `Traversal` to `layout.ts`, `hall/room.ts`, `stage.ts`, `createStage`, `Character`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Should `SketchGuess.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07510204081632653 - nodes in this community are weakly interconnected._