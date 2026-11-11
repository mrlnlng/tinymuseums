# Graph Report - tiny-museum  (2026-11-10)

## Corpus Check
- 488 files · ~256,635 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 78 file(s) not represented in the graph (top: .avif 39, .glb 30, .css 4)

## Summary
- 4181 nodes · 10890 edges · 202 communities (174 shown, 28 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 192 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e2bd51f8`
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
- rooms.ts
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
- react
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
- names.ts
- Handoff: move the Tiny Museum bunny from sprite frames to a rig
- Sound Effect Assets
- locations.ts
- Custom HTTP Headers
- Sharp Layer Package
- spots.ts
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
- domain/guestboard.ts
- pond/room.ts
- ticket/route.ts
- Run-Once Schema
- createStage
- FishingView.tsx
- ticket.ts
- (hall)/page.tsx
- AtelierKeeps.tsx
- Conn
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
- usePondState
- rig.ts
- Curating the paintings (2026-11-07)
- nearby.ts
- presence/tsconfig.json
- graftCostume
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
- The Costume Atelier
- writeStyle
- pond-state.ts
- createRemoteVisitors
- AssetImage
- Context
- hit.ts
- CharacterKind
- Walkthrough.tsx
- createPondRoom
- links.ts
- VitalsReporter.tsx
- HallArranger.tsx
- createPlacementLayer
- painting-open
- overlay.ts
- Multiplayer ("other visitors") — plan v2 (Cloudflare)
- SoundProvider.tsx
- CatchView
- a/[slug]/page.tsx
- icon-basket
- outbox.test.ts
- ArrangeControls.tsx
- validatePlacements
- bunny-left
- useMember
- bunny-right
- CrowdPreview.tsx
- shopkeeper.ts
- icon-home
- mail.ts
- wardrobe.ts
- ticket
- CodesSection.tsx
- Medium
- lib/assets.ts
- ColorRecall.tsx
- 4. Transport: Cloudflare Durable Objects
- getStorage
- Cafe
- DecorDrawer
- createStage
- SoundProvider.tsx
- Low
- Monets Lily Pond: exploration, UX and multiplayer QA
- Clock
- ArtCache
- Wardrobe
- Notes
- PerfMeter
- createDecorController
- boundedCameraX
- PondControl

## God Nodes (most connected - your core abstractions)
1. `react` - 75 edges
2. `json()` - 69 edges
3. `query()` - 68 edges
4. `hit()` - 55 edges
5. `limited()` - 49 edges
6. `next` - 44 edges
7. `Traversal` - 44 edges
8. `three` - 42 edges
9. `SyncStore` - 41 edges
10. `PersonalRoom()` - 37 edges

## Surprising Connections (you probably didn't know these)
- `Code` --references--> `followOutfit()`  [INFERRED]
  docs/costume-atelier.md → apps/web/src/features/hall/scene/wardrobe.ts
- `4. Suggested plan` --references--> `BunnyArtist()`  [INFERRED]
  docs/bunny-rig-author-handoff.md → apps/web/src/features/sketchguess/components/BunnyArtist.tsx
- `5.1 Emotes (v1)` --references--> `ScreenChrome()`  [INFERRED]
  docs/multiplayer-plan.md → apps/web/src/shared/components/ScreenChrome.tsx
- `E2E-009 — Room mutations ignore stale account identity` --references--> `memberFromRequest()`  [INFERRED]
  docs/testing/local-e2e-stress-2026-11-06.md → apps/web/src/shared/lib/member-route.ts
- `Fitting clothes to other characters` --references--> `graftCostume()`  [INFERRED]
  docs/costume-atelier.md → apps/web/tooling/graft-costume.mjs

## Import Cycles
- None detected.

## Communities (202 total, 28 thin omitted)

### Community 0 - "actions.ts"
Cohesion: 0.12
Nodes (34): BugReportsPage(), dateFormat, dynamic, summary(), dateFormat, dynamic, GuestBoardPage(), dynamic (+26 more)

### Community 1 - "tab-turn.ts"
Cohesion: 0.16
Nodes (5): createTabTurn(), TabTurn, tab(), TurnEnv, TurnMessage

### Community 2 - "SketchGuess.tsx"
Cohesion: 0.07
Nodes (41): bestKeyFor(), BURST, clueUrl(), openingPlan(), Phase, pickAtRandom(), prepareSketchGame(), readDifficulty() (+33 more)

### Community 3 - "themes.ts"
Cohesion: 0.15
Nodes (13): GAMES, isRecord(), parsePlacements(), placementOf(), ownsAll, ownsNone, COZY_FLOOR_PROPS, COZY_TROPHIES (+5 more)

### Community 4 - "jobs.ts"
Cohesion: 0.23
Nodes (15): loop(), shutdown(), sleep(), sweepStale(), DrainResult, handler(), repairFrames(), repairUnframed() (+7 more)

### Community 5 - "round.ts"
Cohesion: 0.16
Nodes (27): deltaE(), GAMUT_EPSILON, hexToOklab(), inGamut(), linearRgbToOklab(), linearToSrgb(), Oklab, oklabToLinearRgb() (+19 more)

### Community 6 - "floor.ts"
Cohesion: 0.13
Nodes (34): clone(), closestOnSegment(), contains(), cross(), crossVec(), depthAtY(), depthBounds(), depthT() (+26 more)

### Community 7 - "Core Asset Manifest"
Cohesion: 0.05
Nodes (41): artworks, audio, file, megabytes, seconds, sourceName, startedAt, bunny (+33 more)

### Community 8 - "scene/assets.ts"
Cohesion: 0.09
Nodes (41): AssetManifest, assetUrl(), bitmapTexture(), blankImage(), CAFE_CAT_FRAMES, CompressedLoader, elementTexture(), ENTRANCE_FILES (+33 more)

### Community 9 - "SyncStore"
Cohesion: 0.16
Nodes (7): encodeStored(), parseStored(), readStored(), removeStored(), writeStored(), SyncStore, upgrade()

### Community 10 - "machine.ts"
Cohesion: 0.11
Nodes (43): CAST_ERRORS, FishingView(), isTyping(), LOST, Toast, vibrate(), ReelMeter(), armCast() (+35 more)

### Community 11 - "PondRoom.tsx"
Cohesion: 0.11
Nodes (21): Loading(), metadata, PondPage(), revealFloorTransition(), Minigame, MINIGAMES, POND_NAME, PondLoading() (+13 more)

### Community 12 - "Test Fakes and Helpers"
Cohesion: 0.12
Nodes (27): deferredFetch(), deviceSlot, FakeEvents, FakeStorage, fixture, fixtureB, fixtureRegistry, fixtureRegistryBoth (+19 more)

### Community 13 - "scene.ts"
Cohesion: 0.06
Nodes (17): disposeDisplayTexture(), prefersAvif(), HiddenCoin, Helm, createNotes(), createPedestal(), Pedestal, PedestalVoice (+9 more)

### Community 14 - "cozy.ts"
Cohesion: 0.15
Nodes (22): ATELIER_PROPS, AtelierImage, canvasTexture(), CozyBackdrop, cozyPropImageUrl(), cozyTheme, disposeCozyArt(), drawingOn() (+14 more)

### Community 15 - "currentMember"
Cohesion: 0.14
Nodes (23): GET(), GET(), PER_MEMBER, GET(), PER_MEMBER, GET(), PER_MEMBER, PER_MEMBER (+15 more)

### Community 16 - "join-room.ts"
Cohesion: 0.19
Nodes (26): ChatButton(), REFUSED, joinRoom(), STANDING, emit(), getPeople(), isInRoom(), isMuted() (+18 more)

### Community 17 - "createAtelierRoom"
Cohesion: 0.22
Nodes (23): aspectOf(), createAtelierRoom(), buildCollection(), form(), buildEntrance(), buildRoom(), picture(), place() (+15 more)

### Community 18 - "ref_node_assert"
Cohesion: 0.12
Nodes (28): valid, defineSlot(), docBytes(), SLOTS, byAtThenKey(), encoded(), latest, mapOf() (+20 more)

### Community 19 - "amplify/package.json"
Cohesion: 0.08
Nodes (26): amplifyDir, backend, everyMinutes, mediaBucket, missing, repoRoot, REQUIRED, setting() (+18 more)

### Community 20 - "atelier.ts"
Cohesion: 0.07
Nodes (28): AtelierImage, BuiltRoom, Cardigan, CARDIGAN_NAMES, Control, ATELIER_END_X, ATELIER_ROOMS, COLLECTIONS (+20 more)

### Community 21 - "prepare-models.mjs"
Cohesion: 0.15
Nodes (18): paintedCostume(), atelier, bunny, floralOutfits(), goldOutfits(), HEADPIECES, image(), manifest (+10 more)

### Community 22 - "Traversal"
Cohesion: 0.11
Nodes (5): JumpPose, clamp(), fixture(), jump(), Traversal

### Community 23 - "core/package.json"
Cohesion: 0.06
Nodes (39): dependencies, @aws-sdk/client-s3@^3.1121.0, @aws-sdk/s3-request-presigner@^3.1121.0, bcryptjs@^2.4.3, obscenity@^0.4.6, sharp@^0.33.5, thumbhash@^0.1.1, devDependencies (+31 more)

### Community 24 - "rooms.ts"
Cohesion: 0.12
Nodes (24): roomEditor, PER_EDITOR, PUT(), versionOf(), PER_EDITOR, POST(), PER_MEMBER, POST() (+16 more)

### Community 25 - "logic.ts"
Cohesion: 0.13
Nodes (23): SharingState, Tab, TABS, categoryOf(), cozyLevel, cozyWorth(), currentHallOrder(), DrawerCategory (+15 more)

### Community 26 - "personal/room.ts"
Cohesion: 0.05
Nodes (7): Carry, PersonalRoomProps, DecorController, PersonalRoomOptions, GhostOptions, PlacementLayer, Placement

### Community 27 - "Museum.tsx"
Cohesion: 0.12
Nodes (28): Loading(), PinnedNotes(), AtelierLoading(), coin, CoinFoundProps, CoinFound, ColorRecall, GameDesktop (+20 more)

### Community 28 - "PersonalRoom.tsx"
Cohesion: 0.13
Nodes (24): errorReason(), overDrawer(), PersonalRoom(), canPlaceNew(), carryEnd(), carryMove(), onCardKey(), onCardPointerDown() (+16 more)

### Community 29 - "core/src/index.ts"
Cohesion: 0.05
Nodes (112): addBait(), baitOf(), PondBoardMe, PondBoardRow, PondFeedItem, Rep, bountyCatches(), BountyCatchRow (+104 more)

### Community 30 - "Web Package Dependencies"
Cohesion: 0.07
Nodes (33): dependencies, embla-carousel-react@^8.6.0, motion@^13.1.1, next@^15.0.3, react@^19.0.0, react-dom@^19.0.0, swr@^2.5.1, three@^0.169.0 (+25 more)

### Community 31 - "Gamifying Tiny Museum — genre direction & engagement research"
Cohesion: 0.10
Nodes (19): 0.1 The core experience, 0.2 Systems that make gamification cheap to build, 0.3 Constraints that shape any recommendation, 0. What the game is today (the deep dive), 1.1 The landscape (seven candidates, with verdicts), 1.2 Recommendation: a **cozy gallery life-sim** — "the gallery you live in", 1.3 The five design pillars the genre implies, 1. Genre direction (+11 more)

### Community 32 - "pond/art.ts"
Cohesion: 0.25
Nodes (10): ArtByRoom, colorAt(), disposePondArt(), EDGE_BAND, EDGE_BANDS, EDGE_OVERLAP, edgeTexture(), imageOf() (+2 more)

### Community 33 - "slots/store.ts"
Cohesion: 0.11
Nodes (20): ANON_PREFIX, anonKey(), deviceKey(), isMemberSlotKey(), listKeys(), MEMBER_KEY, memberKey(), memberPrefix() (+12 more)

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
Nodes (43): grantPearls(), member(), now, piece(), randomId(), today, pg@^8.13.1, applyClaim() (+35 more)

### Community 38 - "rules.ts"
Cohesion: 0.11
Nodes (25): buildClaim(), BuiltClaim, EarnDetail, GameSource, newRunId(), now, localDay(), at() (+17 more)

### Community 39 - "Web TSConfig"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 40 - "Root Package Manifest"
Cohesion: 0.07
Nodes (35): description, devDependencies, concurrently@^9.1.0, esbuild@^0.24.0, ktx2-encoder@^0.6.0, maxrects-packer@^2.7.3, playwright@^1.63.0, @types/node@^22.9.0 (+27 more)

### Community 41 - "bug-reports.ts"
Cohesion: 0.12
Nodes (24): POST(), POST(), rateLimitedResponse(), rejectedResponse(), BugReport, BugReportDto, BugReportRateLimited, BugReportRejected (+16 more)

### Community 42 - "PondTicker.tsx"
Cohesion: 0.29
Nodes (11): fetchPondFeed(), PondFeedItem, catchLabel(), formatSizeCm(), speciesFor(), speciesName(), speciesTier(), isGolden() (+3 more)

### Community 43 - "react"
Cohesion: 0.14
Nodes (14): openAccount(), ActiveRoom, StageContext, StageContextValue, COPY, RoomNoticeProps, Stage, SoundContext (+6 more)

### Community 44 - "Base TSConfig"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, lib, module, moduleResolution (+9 more)

### Community 45 - "Amplify Build Spec"
Cohesion: 0.12
Nodes (16): applications, appRoot, backend, frontend, baseDirectory, files, phases, commands (+8 more)

### Community 46 - "next"
Cohesion: 0.16
Nodes (18): config, SECURITY_HEADERS, GET(), PaintingRow, POST(), UPLOADS_PER_ARTIST, dynamic, RoomPage() (+10 more)

### Community 47 - "db-tests/pond.test.ts"
Cohesion: 0.09
Nodes (27): CatchExtra, clearCatches(), COLUMNS, grantPearls(), insertCatch(), member(), namedMember(), randomId() (+19 more)

### Community 48 - "FakeServer"
Cohesion: 0.20
Nodes (3): FakeServer, SlotState, SlotDef

### Community 49 - "handlers.ts"
Cohesion: 0.10
Nodes (32): Design for Phases 5–7 (2026-11-05), confirmedFollowers(), sealEpoch(), handleDerivatives(), handleNotifyFollowers(), handleRenderDisplay(), handleSealEpoch(), renderPieceFrame() (+24 more)

### Community 50 - "Water.tsx"
Cohesion: 0.11
Nodes (26): AmbientShadow, buildRod(), bunnyBox(), easeOut(), LILY_STYLE, makeAmbient(), PAW_IN_SPRITE, pawPoint() (+18 more)

### Community 51 - "Worker Package Manifest"
Cohesion: 0.14
Nodes (14): dependencies, @tiny/core@*, exports, ./lambda, @tiny/core, main, name, private (+6 more)

### Community 52 - "Public Asset Manifest"
Cohesion: 0.12
Nodes (15): artworks, bunny, size, floor, size, fonts, icon-no-photos, size (+7 more)

### Community 53 - "pond-api.ts"
Cohesion: 0.15
Nodes (25): refreshWalletNow(), buyPondBait(), errorOf(), exchangePondPearls(), fetchPondDex(), fetchPondLeaderboard(), isRecord(), isStateView() (+17 more)

### Community 54 - "hitForVisitor"
Cohesion: 0.16
Nodes (20): POST(), POST(), GET(), PER_VISITOR, BOARDS, GET(), oneOf(), PER_VISITOR (+12 more)

### Community 55 - "compose-atelier.mjs"
Cohesion: 0.14
Nodes (9): body, dressLayer, dressWidth, floralWidth, MANNEQUIN_CANVAS, mask, root, sourceSize (+1 more)

### Community 56 - "Character"
Cohesion: 0.10
Nodes (6): Carried, Character, Matcha, hop(), DecorLive, 2. How the game draws the bunny today (read from the repo, not run)

### Community 57 - "pond-format.ts"
Cohesion: 0.12
Nodes (26): PondDex, EXCHANGE_DAILY_STAMPS, EXCHANGE_PEARLS_PER_STAMP, FISH_ART, formatPercent(), formatShortSizeCm(), ODDS_BAIT, POND_BAIT (+18 more)

### Community 58 - "AccountSheet.tsx"
Cohesion: 0.13
Nodes (17): Mode, NAME_ERRORS, Pending, View, openBugReport(), fitWidth(), HelpGuide(), HelpGuideProps (+9 more)

### Community 59 - "economy/store.ts"
Cohesion: 0.09
Nodes (52): CARRY_CAP, carryAdd(), CarryEntry, carryPrune(), carryRemove(), chunk(), ClaimRequest, tzOffsetNow() (+44 more)

### Community 60 - "domain/sketch.ts"
Cohesion: 0.13
Nodes (22): listPieces(), pieceImageUrl(), PieceRow, toPieceDto(), GalleryRow, planSketchRound(), SKETCH_CHOICES, SketchCandidate (+14 more)

### Community 61 - "room.ts"
Cohesion: 0.11
Nodes (32): attachmentOf(), socket(), admitted(), Attachment, farewell(), GHOST_MS, HELLO_TIMEOUT_MS, holdsOf() (+24 more)

### Community 62 - "minimap.ts"
Cohesion: 0.07
Nodes (34): place(), ATELIER_DOOR, createMinimap(), draw(), drawRoom(), floors(), follow(), sketchOf() (+26 more)

### Community 63 - "names.ts"
Cohesion: 0.14
Nodes (20): PresencePreviewPage(), PresencePreview(), WalkAlone(), announceNameChange(), NameError, useVisitorName(), VisitorName, useSlot() (+12 more)

### Community 64 - "Handoff: move the Tiny Museum bunny from sprite frames to a rig"
Cohesion: 0.15
Nodes (11): 1. What is in this bundle, 3. The rig, 4. Suggested plan, 5. Blender-side work still to do (needs Blender; the author has it with an MCP bridge), 6. Open questions for the author, Handoff: move the Tiny Museum bunny from sprite frames to a rig, Approved v4 bunny in the hall, Assets (+3 more)

### Community 65 - "Sound Effect Assets"
Cohesion: 0.22
Nodes (9): file, kilobytes, seconds, file, kilobytes, seconds, soundEffects, click (+1 more)

### Community 66 - "locations.ts"
Cohesion: 0.24
Nodes (19): discardLocation(), hasUnpublished(), nudgeInRow(), OWNER, placePainting(), PlaceResult, PlaceTarget, publishLocation() (+11 more)

### Community 67 - "Custom HTTP Headers"
Cohesion: 0.25
Nodes (7): applications, appRoot, customHeaders, headers, pattern, key, value

### Community 68 - "Sharp Layer Package"
Cohesion: 0.33
Nodes (6): dependencies, sharp@^0.33.5, description, sharp, name, private

### Community 69 - "spots.ts"
Cohesion: 0.24
Nodes (8): ATELIER_SPOTS, FRAME_ASPECT, LOCATIONS, LocationSpec, spotPlacementId(), SpotSpec, ownsAll, painting()

### Community 70 - "Other visitors"
Cohesion: 0.29
Nodes (6): How it plays, Other visitors, Privacy, Running it in production, Running it locally, Staying consistent

### Community 71 - "gallery/page.tsx"
Cohesion: 0.17
Nodes (18): dynamic, GalleryPage(), dynamic, LocationsPage(), placePaintingAction(), returnTo(), PlacePicker(), PlacePickerProps (+10 more)

### Community 72 - "wallet/body.ts"
Cohesion: 0.26
Nodes (12): baitIdOf(), integerOffset(), isRecord(), itemIdOf(), MAX_CLAIM_BATCH, ParsedWalletClaim, parseWalletClaim(), routeBanned() (+4 more)

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
Nodes (10): Attachment, RigState, Rig, RigAttachment, FLAT, MAX_SHOWN, Prop, RemoteVisitors (+2 more)

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
Cohesion: 0.13
Nodes (12): FloorPoint, WalkArea, water, DEPTH_SPAN, depthOf(), MAX_DEPTH, PICTURE, pondFloor() (+4 more)

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
Cohesion: 0.09
Nodes (59): POST(), PER_MEMBER, PUT(), POST(), GLOBAL, PER_IP, POST(), POST() (+51 more)

### Community 94 - "domain/guestboard.ts"
Cohesion: 0.15
Nodes (18): GET(), decodeCursor(), encodeCursor(), GuestNoteInput, listGuestNotes(), NoteRow, PER_VISITOR, toDto() (+10 more)

### Community 95 - "pond/room.ts"
Cohesion: 0.12
Nodes (26): depthAtLift(), FAR_LIFT, FAR_SCALE, liftAt(), pathHalfWidth(), pathX(), PondPath, scaleAt() (+18 more)

### Community 96 - "ticket/route.ts"
Cohesion: 0.11
Nodes (36): GET(), GET(), memberFromRequest(), 3.2 Chosen names (members), registry, started(), artist(), member() (+28 more)

### Community 104 - "createStage"
Cohesion: 0.29
Nodes (12): initialize(), aim(), drawFrame(), handleClick(), handlePointerDown(), handlePointerMove(), handlePointerUp(), prefetchNearDoors() (+4 more)

### Community 105 - "FishingView.tsx"
Cohesion: 0.13
Nodes (14): CONFETTI_COLORS, ConfettiPiece, makeConfetti(), RevealCard(), TIER_MS, TIER_SFX, useCountUp(), chainOffer (+6 more)

### Community 106 - "ticket.ts"
Cohesion: 0.23
Nodes (12): decoder, encoder, fromBase64Url(), HmacKey, isOwn(), isTicket(), keyFor(), keys (+4 more)

### Community 107 - "(hall)/page.tsx"
Cohesion: 0.15
Nodes (18): Loading(), dynamic, Hall(), MuseumPage(), CurrentlyShowing(), dynamic, GUIDELINES, LandingPage() (+10 more)

### Community 108 - "AtelierKeeps.tsx"
Cohesion: 0.14
Nodes (21): MuseumLayout(), CoinToast(), Toast, Purse(), Stamp(), WalletProvider(), serverSnapshot, useEarnEvents() (+13 more)

### Community 109 - "Conn"
Cohesion: 0.31
Nodes (4): connectWebSocket(), SocketHandlers, Conn, message()

### Community 110 - "RigPreview.tsx"
Cohesion: 0.17
Nodes (17): RigPreviewPage(), NEXT, PROPS, RigPreview(), draw(), createCharacter(), contextLost(), loadKind() (+9 more)

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
Cohesion: 0.19
Nodes (18): fetch(), Env, isItem(), isName(), isPid(), isSeq(), MAX_HOLDS, MAX_MESSAGE_BYTES (+10 more)

### Community 119 - "Costume gallery doorway"
Cohesion: 0.50
Nodes (3): Costume gallery doorway, Curtain colour edit, Prompt

### Community 120 - "LeaderboardPanel.tsx"
Cohesion: 0.27
Nodes (14): fishArt(), formatCountdown(), formatInteger(), formatOdds(), nextMondayUtc(), useCountdown(), useNow(), BoardRow() (+6 more)

### Community 121 - "Fishing forest: painted asset pass"
Cohesion: 0.11
Nodes (17): Assets, Bruce's collection refresh (2026-11-08), Fishing forest illustrations, Made by hand (not touched by the script), Monets Lily Pond (2026-11-08), 1. Forest doorway, 2. Woodland noticeboard, 3. Fisherman and bait basket (+9 more)

### Community 124 - "xdog.ts"
Cohesion: 0.33
Nodes (6): blur(), kernel(), toGray(), XDOG_DEFAULTS, xdogInk(), XdogOptions

### Community 125 - "usePondState"
Cohesion: 0.20
Nodes (14): GLYPHS, PearlIcon(), POND_CRIMSON, PondIconName, claimPondBounty(), fetchPondBounties(), PondBounties, nextUtcMidnight() (+6 more)

### Community 126 - "rig.ts"
Cohesion: 0.13
Nodes (24): Layer, setCostumeVisibility(), canvasToModel(), disposeRigLayer(), Frame, layerTemplates, loadRig(), dispose() (+16 more)

### Community 127 - "Curating the paintings (2026-11-07)"
Cohesion: 0.13
Nodes (14): 1. The registry and the table, 2. The studio's Location picker, 3. The rooms draw what is placed, 4. Credits, 5. Retiring self-serve artists, Building it, Curating the paintings (2026-11-07), Decided (+6 more)

### Community 128 - "nearby.ts"
Cohesion: 0.18
Nodes (6): createNearby(), Nearby, NearbyReach, RoomSpan, reach, strip

### Community 129 - "presence/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, types, exclude, extends, include, ../../tsconfig.base.json

### Community 130 - "graftCostume"
Cohesion: 0.27
Nodes (14): canvasFit(), compose(), graftCostume(), copyAccessor(), copyMaterial(), copyMesh(), copyTexture(), copyView() (+6 more)

### Community 131 - "tsconfig.test.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 132 - "app/layout.tsx"
Cohesion: 0.14
Nodes (16): bethEllen, inspiratiq, metadata, notoSans, RootLayout(), sniglet, viewport, AccountHost() (+8 more)

### Community 133 - "messages.ts"
Cohesion: 0.27
Nodes (7): checkMessage(), INVISIBLE, MESSAGE_MAX, MessageCheck, normalizeMessage(), hasProfanity(), matcher

### Community 134 - "lib/presence.ts"
Cohesion: 0.06
Nodes (28): Entry, INTERPOLATION_DELAY_MS, PEER_TIMEOUT_MS, PeerTable, positionAt(), RemoteVisitor, Sample, look (+20 more)

### Community 135 - "query"
Cohesion: 0.07
Nodes (49): ALLOWED, POST(), ConfirmFollow(), dynamic, dynamic, Unsubscribe(), GET(), AnalyticsPage() (+41 more)

### Community 136 - "Confirmed issues"
Cohesion: 0.08
Nodes (25): Confirmed issues, E2E-002 — Valid edge placement rejected through floating-point precision, E2E-003 — One owned prop can be placed multiple times, E2E-004 — Reload before autosave silently loses the latest placement, E2E-005 — Failed save and failed Done have no visible mobile explanation, E2E-006 — Restoring connectivity does not retry a failed draft save, E2E-007 — Keyboard activation cannot place drawer items, E2E-008 — Creating an account from My Room leaves the signed-in user on the sign-in prompt (+17 more)

### Community 137 - "stage.ts"
Cohesion: 0.04
Nodes (46): coverFloorTransition(), CharacterSprites, CameraRig, cutRooms(), createPixelRatioGovernor(), PIXEL_RATIO_STEPS, createRoomPassage(), fixture() (+38 more)

### Community 138 - "hall/room.ts"
Cohesion: 0.04
Nodes (52): createBackdrop(), CUTS, disposeBoards(), plane(), ROPE_CUTS, ropeSlices(), sliceOf(), stretchedBoard() (+44 more)

### Community 139 - "epoch.ts"
Cohesion: 0.22
Nodes (15): GET(), intParam(), GET(), sketchPool, unavailable(), currentEpoch(), ensureEpoch(), epochById() (+7 more)

### Community 140 - "Item"
Cohesion: 0.13
Nodes (4): Room, Presence, Item, Refusal

### Community 141 - "sketchguess/lib/api.ts"
Cohesion: 0.23
Nodes (13): sameOriginUrl(), PreparedGame, decodeImage(), fetchBitmap(), fetchRound(), guarded(), LoadedRound, loadInk() (+5 more)

### Community 142 - "visits.ts"
Cohesion: 0.11
Nodes (27): state(), amount(), duration(), dynamic, LANDMARKS, PAGES, RANGES, share() (+19 more)

### Community 143 - "vitals.ts"
Cohesion: 0.16
Nodes (15): dynamic, format(), grade(), METRICS, PAGES, PerformancePage(), RANGES, DEVICES (+7 more)

### Community 144 - "The Moonlit Pond — design"
Cohesion: 0.09
Nodes (22): Art the pond needs from the artist, Build contract (decided 2026-11-07), Build phases, Collection and goals, Done, Done, Guardrails, Leaderboards (+14 more)

### Community 145 - "Pond rework"
Cohesion: 0.18
Nodes (10): Baits, Client, Decisions, Done, Notes, Pond rework, Server, Species (+2 more)

### Community 146 - "env.ts"
Cohesion: 0.08
Nodes (22): target, heights, layout, manifest, manifestPath, root, target, water (+14 more)

### Community 147 - "Orchestration contract — you plan, DSH workers execute"
Cohesion: 0.29
Nodes (6): Briefing a worker, Budget hygiene, graphify, Orchestration contract — you plan, DSH workers execute, The worker, When not to delegate

### Community 148 - "tables.ts"
Cohesion: 0.09
Nodes (35): FrameShape, BaitTray(), BaitTrayProps, debugSpecies(), debugTokens(), debugVariant(), GuestRollOptions, guestTreasure() (+27 more)

### Community 149 - "The Costume Atelier"
Cohesion: 0.13
Nodes (14): Adding a character, Adding a costume, Art not supplied as files, Bruce's Chronicles, Checked against the mocks (2026-11-07), Code, Costume fit review, Fitting clothes to other characters (+6 more)

### Community 150 - "writeStyle"
Cohesion: 0.17
Nodes (5): CafeLink, GuestBoardNotes, Placards, toScreen(), writeStyle()

### Community 151 - "pond-state.ts"
Cohesion: 0.24
Nodes (15): fetchPondState(), PondStateView, PondTier, ensurePondStateStarted(), getPondStateSnapshot(), GUEST, listeners, LOADING (+7 more)

### Community 152 - "createRemoteVisitors"
Cohesion: 0.21
Nodes (10): createRenderer(), createRigLayer(), createRemoteVisitors(), ensureLayer(), load(), placeOwn(), show(), showProp() (+2 more)

### Community 153 - "AssetImage"
Cohesion: 0.12
Nodes (23): BoardScreen(), BoardScreenProps, ComposeScreen(), ComposeScreenProps, blankDraft(), GuestBoard(), GuestBoardProps, View (+15 more)

### Community 155 - "hit.ts"
Cohesion: 0.21
Nodes (10): createHiddenCoin(), AlphaMap, alphaMapFor(), alphaMaps, buildAlphaMap(), isPaintedAt(), registerSpriteMask(), spread() (+2 more)

### Community 156 - "CharacterKind"
Cohesion: 0.11
Nodes (5): AtelierActions, AtelierRoom, Display, CollectionRoom, CharacterKind

### Community 157 - "Walkthrough.tsx"
Cohesion: 0.11
Nodes (24): MoreArrow(), NavArrow(), Props, SLIDE, Walkthrough(), XIcon(), decodedFrames, frameFor() (+16 more)

### Community 158 - "createPondRoom"
Cohesion: 0.32
Nodes (13): createPondRoom(), approach(), busy(), finishWalk(), goTo(), leave(), move(), nearest() (+5 more)

### Community 159 - "links.ts"
Cohesion: 0.18
Nodes (6): EXITS, isDoor(), linkedDoor(), LINKS, StageHandlers, DoorRef

### Community 160 - "VitalsReporter.tsx"
Cohesion: 0.31
Nodes (7): firstPainting(), flush(), Metric, queue, REPORTED, FIRST_PAINTING_MARK, MUSEUM_START_MARK

### Community 161 - "HallArranger.tsx"
Cohesion: 0.27
Nodes (7): loadHallArranger(), HallArranger(), HallArrangerProps, HallRoomData, Painting, hallPlacements(), reasonLabel()

### Community 162 - "createPlacementLayer"
Cohesion: 0.18
Nodes (8): aspectOf(), createPlacementLayer(), drawOutline(), dropHelper(), sizeOf(), PlacementTheme, Phase 5: themes, zones and arrangements, ThemeSpec

### Community 163 - "painting-open"
Cohesion: 0.50
Nodes (4): file, kilobytes, seconds, painting-open

### Community 164 - "overlay.ts"
Cohesion: 0.09
Nodes (27): Assets, Scenery, Backdrop, Mark, CafeMarks, CarriedState, Perch, Pose (+19 more)

### Community 165 - "Multiplayer ("other visitors") — plan v2 (Cloudflare)"
Cohesion: 0.15
Nodes (12): 0. Summary, 10. Decisions, 1. Product contract changes (approved 2026-10-31), 2. What already exists that this builds on, 3.1 Generated names (everyone has one), 3. Names, 5.1 Emotes (v1), 5. Protocol (`packages/core/src/presence/protocol.ts`) (+4 more)

### Community 166 - "SoundProvider.tsx"
Cohesion: 0.33
Nodes (4): StageOptions, RoomSound, SoundState, EffectName

### Community 167 - "CatchView"
Cohesion: 0.24
Nodes (10): PondGameProps, PondGame(), RevealCardProps, PondCatch, CatchView, GuestRoll, FishId, FishVariant (+2 more)

### Community 168 - "a/[slug]/page.tsx"
Cohesion: 0.31
Nodes (6): ArtistPage(), dynamic, generateMetadata(), GET(), FollowForm(), getArtistPage()

### Community 169 - "icon-basket"
Cohesion: 0.67
Nodes (3): icon-basket, file, vector

### Community 170 - "outbox.test.ts"
Cohesion: 0.27
Nodes (12): OUTBOX_CAP, outboxAdd(), outboxDue(), OutboxEntry, outboxFail(), outboxRemove(), RETRY_BASE_MS, RETRY_MAX_MS (+4 more)

### Community 171 - "ArrangeControls.tsx"
Cohesion: 0.40
Nodes (9): hangAction(), movePieceAction(), unhangAction(), FloorControls(), move(), unhang(), formFor(), StorageControls() (+1 more)

### Community 172 - "validatePlacements"
Cohesion: 0.24
Nodes (8): 1. Items placed against a zone edge fail to save, and the whole draft reverts, 2. One owned item can be placed many times, 3. Any save rejection throws away all unsaved work, 4. Changes made just before leaving are lost, 5. Fish trophies can be claimed without playing, High, PlacementOwnership, validatePlacements()

### Community 174 - "useMember"
Cohesion: 0.11
Nodes (12): AccountSheet(), continueAnyway(), doSignOut(), runDelete(), runName(), submit(), submitDelete(), submitName() (+4 more)

### Community 176 - "CrowdPreview.tsx"
Cohesion: 0.33
Nodes (7): CrowdPreviewPage(), CrowdPreview(), draw(), KINDS, Stats, Window, clearRigLayer()

### Community 177 - "shopkeeper.ts"
Cohesion: 0.25
Nodes (7): RigPiece, COATS, createShopkeeper(), GREETINGS, OUTFIT, recolourFur(), SHOPKEEPER_NAME

### Community 179 - "mail.ts"
Cohesion: 0.33
Nodes (5): ConsoleMailer, FileMailer, getMailer(), Mailer, Message

### Community 180 - "wardrobe.ts"
Cohesion: 0.08
Nodes (45): AtelierPage(), dynamic, metadata, allowedCharacter(), OwnedSnapshot, owns(), walletReady(), Atelier() (+37 more)

### Community 182 - "CodesSection.tsx"
Cohesion: 0.39
Nodes (7): createCodeAction(), deleteCodeAction(), CodeRow, CodesSection(), create(), remove(), revokeQrToken()

### Community 183 - "Medium"
Cohesion: 0.25
Nodes (8): 10. Long names run off the name sign, 11. The rooms API skips the stale-tab member check, 12. The bunny is dragged along while you pan in Decorate, 6. Failed saves are nearly invisible, and nothing retries, 7. Two tabs editing the same room overwrite each other, 8. The drawer's card row can't be scrolled on touch screens, 9. Decorating can't be done with the keyboard, Medium

### Community 184 - "lib/assets.ts"
Cohesion: 0.06
Nodes (32): AtelierArt, disposeAtelierArt(), GALLERY_DOOR, loadGalleryDoor(), loadGalleryPillar(), loadImage(), pending, GiftShopSigns (+24 more)

### Community 185 - "ColorRecall.tsx"
Cohesion: 0.33
Nodes (6): ColorRecall(), ColorRecallProps, Phase, readBest(), ColorRound, loadColorRecall()

### Community 186 - "4. Transport: Cloudflare Durable Objects"
Cohesion: 0.25
Nodes (8): 4. Transport: Cloudflare Durable Objects, Decision (2026-10-31), Deploying, Identity cannot be forged, Local development and tests, Rooms and capacity, Shape of `apps/presence` (about 200 lines), main()

### Community 187 - "getStorage"
Cohesion: 0.10
Nodes (19): CONTENT_TYPES, GET(), POST(), UPLOADS_PER_ARTIST, PUT(), ACCEPTED, createAssetFromUpload(), MAX_UPLOAD_BYTES (+11 more)

### Community 190 - "createStage"
Cohesion: 0.43
Nodes (7): createStage(), closeEntry(), enter(), isCurrent(), open(), showMap(), syncJoined()

### Community 191 - "SoundProvider.tsx"
Cohesion: 0.11
Nodes (27): BackgroundMusic, clampVolume(), isDocumentHidden(), Options, useBackgroundMusic(), VISIBILITY_EVENTS, EFFECTS, EffectSpec (+19 more)

### Community 192 - "Low"
Cohesion: 0.13
Nodes (13): 13. Pages that redirect or don't exist answer 200, 14. Error codes reveal which room slugs exist, 15. The name sign slides under the top-right buttons in Decorate, 16. Level-up celebrations can be farmed, 17. No hint of where things are after panning away, 18. Too many items is only discovered by the server, 19. Development-only: page payloads include the full room row, Checked and fine (+5 more)

### Community 193 - "Monets Lily Pond: exploration, UX and multiplayer QA"
Cohesion: 0.29
Nodes (6): Browser and interaction coverage, Changes made from the walkthrough, Monets Lily Pond: exploration, UX and multiplayer QA, Multiplayer and load, Practical limits, Regression checks and cleanup

### Community 199 - "createDecorController"
Cohesion: 0.67
Nodes (4): createDecorController(), canvasRect(), targetRise(), toScreen()

## Knowledge Gaps
- **5 isolated node(s):** `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1302 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **28 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `SketchGuess.tsx`, `app/layout.tsx`, `machine.ts`, `PondRoom.tsx`, `Test Fakes and Helpers`, `join-room.ts`, `tables.ts`, `pond-state.ts`, `AssetImage`, `logic.ts`, `Museum.tsx`, `PersonalRoom.tsx`, `Walkthrough.tsx`, `Web Package Dependencies`, `VitalsReporter.tsx`, `HallArranger.tsx`, `risk.ts`, `slots/store.ts`, `a/[slug]/page.tsx`, `PondTicker.tsx`, `ArrangeControls.tsx`, `CrowdPreview.tsx`, `Water.tsx`, `wardrobe.ts`, `CodesSection.tsx`, `ColorRecall.tsx`, `AccountSheet.tsx`, `pond-format.ts`, `names.ts`, `SoundProvider.tsx`, `gallery/page.tsx`, `bug-report.ts`, `FishingView.tsx`, `(hall)/page.tsx`, `AtelierKeeps.tsx`, `RigPreview.tsx`, `LeaderboardPanel.tsx`, `usePondState`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **What connects `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json` to the rest of the system?**
  _5 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `actions.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11707317073170732 - nodes in this community are weakly interconnected._
- **Why does `createPresence()` connect `createPresence` to `messages.ts`, `lib/presence.ts`, `react`, `join-room.ts`, `protocol.ts`, `names.ts`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Should `SketchGuess.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0746606334841629 - nodes in this community are weakly interconnected._
- **Why does `defaultStore()` connect `slots/store.ts` to `stage.ts`, `hall/room.ts`, `SyncStore`, `currentMember`, `join-room.ts`, `pond-state.ts`, `PersonalRoom.tsx`, `createPondRoom`, `overlay.ts`, `react`, `useMember`, `wardrobe.ts`, `pond-api.ts`, `economy/store.ts`, `createStage`, `names.ts`, `pond/room.ts`, `createStage`, `pondgame/lib/api.ts`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Should `floor.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1337126600284495 - nodes in this community are weakly interconnected._