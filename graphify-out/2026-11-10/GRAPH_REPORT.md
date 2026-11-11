# Graph Report - tiny-museum  (2026-11-10)

## Corpus Check
- 488 files · ~263,742 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 78 file(s) not represented in the graph (top: .avif 39, .glb 30, .css 4)

## Summary
- 4242 nodes · 11013 edges · 186 communities (160 shown, 26 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 198 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `06cdc454`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- gallery/page.tsx
- walk.ts
- SketchGuess.tsx
- rooms.ts
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
- actions.ts
- join-room.ts
- createAtelierRoom
- ref_node_assert
- amplify/package.json
- hang-tag.ts
- prepare-models.mjs
- Traversal
- core/package.json
- readJsonBody
- PersonalRoom.tsx
- DecorController
- Museum.tsx
- ambience.ts
- core/src/index.ts
- Web Package Dependencies
- Gamifying Tiny Museum — genre direction & engagement research
- atelier-layout.ts
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
- ColorRecall.tsx
- db-tests/pond.test.ts
- FakeServer
- handlers.ts
- Water.tsx
- Worker Package Manifest
- Public Asset Manifest
- wardrobe.ts
- hitForVisitor
- compose-atelier.mjs
- RoomContents
- pond-format.ts
- AccountSheet.tsx
- economy/store.ts
- domain/sketch.ts
- room.ts
- minimap.ts
- logic.ts
- Handoff: move the Tiny Museum bunny from sprite frames to a rig
- Sound Effect Assets
- personalRoomFor
- Custom HTTP Headers
- Sharp Layer Package
- session.ts
- Other visitors
- AssetImage
- wallet/body.ts
- Placement
- Visits SQL Schema
- Bunny Walk Sprites
- Room Mockup Settings
- Service Worker Caching
- HallCallbacks
- pond/art.ts
- createPresence
- members
- Frame Window Asset
- hit.ts
- presence/package.json
- SoundProvider.tsx
- Asset pipeline: fast loading without losing sharpness
- Guest Board SQL Schema
- Landscape Frame Asset
- features/economy/index.ts
- Bug Reports SQL Schema
- Vitals SQL Schema
- json
- outbox.test.ts
- pond/room.ts
- ticket/route.ts
- Run-Once Schema
- createStage
- FishingView.tsx
- ticket.ts
- catalog.ts
- MuseumStage.tsx
- lib/presence.ts
- graftCostume
- FishingView.tsx
- worker/tsconfig.json
- core/tsconfig.json
- Tiny Museum
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
- tab-turn.ts
- rig.ts
- Curating the paintings (2026-11-07)
- domain/guestboard.ts
- presence/tsconfig.json
- ticket/route.ts
- tsconfig.test.json
- app/layout.tsx
- names.ts
- lib/presence.ts
- dependencies
- exports
- stage.ts
- hall/room.ts
- epoch.ts
- Item
- sketchguess/lib/api.ts
- visits.ts
- personal/room.ts
- The Moonlit Pond — design
- Pond rework
- env.ts
- Orchestration contract — you plan, DSH workers execute
- tables.ts
- xdog.ts
- AccountSheet
- pond-state.ts
- FilesystemStorage
- GuestBoard.tsx
- GameDesktop.tsx
- DecorDrawer
- bugs/page.tsx
- Walkthrough.tsx
- createPondRoom
- createPlacementLayer
- a/[slug]/page.tsx
- Carried
- painting-open
- Multiplayer ("other visitors") — plan v2 (Cloudflare)
- audience.ts
- icon-basket
- reveal.ts
- next
- Backdrop
- bunny-left
- useMember
- bunny-right
- icon-home
- confirm/page.tsx
- atelier.ts
- ticket
- run.ts
- 4. Transport: Cloudflare Durable Objects
- media/storage.ts
- Cafe
- useSoundEffects.ts
- Confirmed issues
- Monets Lily Pond: exploration, UX and multiplayer QA
- PerfMeter
- Lobby
- HelmShare

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
10. `FishingView()` - 39 edges

## Surprising Connections (you probably didn't know these)
- `Code` --references--> `followOutfit()`  [INFERRED]
  docs/costume-atelier.md → apps/web/src/features/hall/scene/wardrobe.ts
- `E2E-009 — Room mutations ignore stale account identity` --references--> `memberFromRequest()`  [INFERRED]
  docs/testing/local-e2e-stress-2026-11-06.md → apps/web/src/shared/lib/member-route.ts
- `Fitting clothes to other characters` --references--> `graftCostume()`  [INFERRED]
  docs/costume-atelier.md → apps/web/tooling/graft-costume.mjs
- `Where things stand` --references--> `sealEpoch()`  [INFERRED]
  docs/curation-plan.md → packages/core/src/domain/epoch.ts
- `19. Development-only: page payloads include the full room row` --references--> `getRoom()`  [INFERRED]
  docs/personal-room-issues.md → packages/core/src/domain/rooms.ts

## Import Cycles
- None detected.

## Communities (186 total, 26 thin omitted)

### Community 0 - "gallery/page.tsx"
Cohesion: 0.10
Nodes (32): dynamic, GalleryPage(), dateFormat, dynamic, GuestBoardPage(), dynamic, LocationsPage(), Register() (+24 more)

### Community 1 - "walk.ts"
Cohesion: 0.11
Nodes (15): FloorPoint, WalkArea, water, depthAtLift(), FOREST_GATE, POND_LANDMARKS, DEPTH_SPAN, depthOf() (+7 more)

### Community 2 - "SketchGuess.tsx"
Cohesion: 0.08
Nodes (38): BunnyArtist(), BunnyMood, Pencil(), POSES, bestKeyFor(), BURST, clueUrl(), openingPlan() (+30 more)

### Community 3 - "rooms.ts"
Cohesion: 0.06
Nodes (57): 1. Items placed against a zone edge fail to save, and the whole draft reverts, 2. One owned item can be placed many times, 3. Any save rejection throws away all unsaved work, 4. Changes made just before leaving are lost, 5. Fish trophies can be claimed without playing, High, discardLocation(), hasUnpublished() (+49 more)

### Community 4 - "jobs.ts"
Cohesion: 0.23
Nodes (15): loop(), shutdown(), sleep(), sweepStale(), DrainResult, handler(), repairFrames(), repairUnframed() (+7 more)

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
Nodes (55): AssetManifest, assetUrl(), bitmapTexture(), blankImage(), CAFE_CAT_FRAMES, CharacterSprites, CompressedLoader, elementTexture() (+47 more)

### Community 9 - "SyncStore"
Cohesion: 0.15
Nodes (7): encodeStored(), parseStored(), readStored(), writeStored(), deepEq(), SyncStore, upgrade()

### Community 10 - "machine.ts"
Cohesion: 0.10
Nodes (48): BaitTray(), CAST_ERRORS, coarsePointer(), FishingView(), initialEasyReel(), isTyping(), LOST, Toast (+40 more)

### Community 11 - "PondRoom.tsx"
Cohesion: 0.12
Nodes (19): Loading(), metadata, PondPage(), POND_NAME, PondLoading(), BOARD_TABS, PondOverlayKind, PondPanels() (+11 more)

### Community 12 - "Test Fakes and Helpers"
Cohesion: 0.12
Nodes (26): deferredFetch(), deviceSlot, FakeEvents, FakeStorage, fixture, fixtureB, fixtureRegistry, fixtureRegistryBoth (+18 more)

### Community 13 - "scene.ts"
Cohesion: 0.04
Nodes (29): disposeDisplayTexture(), HELM_PEDESTAL_FILE, prefersAvif(), HiddenCoin, Helm, cafeAfterIndex(), comingSoonWidth(), computeLayout() (+21 more)

### Community 14 - "cozy.ts"
Cohesion: 0.16
Nodes (20): ATELIER_PROPS, AtelierImage, canvasTexture(), CozyBackdrop, disposeCozyArt(), drawingOn(), FISH, fishTexture() (+12 more)

### Community 15 - "actions.ts"
Cohesion: 0.09
Nodes (54): AnalyticsPage(), dynamic, dynamic, StudioHome(), back(), deleteGuestNoteAction(), deletePieceAction(), discardLocationAction() (+46 more)

### Community 16 - "join-room.ts"
Cohesion: 0.19
Nodes (26): ChatButton(), REFUSED, joinRoom(), announceNameChange(), emit(), getPeople(), isInRoom(), isMuted() (+18 more)

### Community 17 - "createAtelierRoom"
Cohesion: 0.28
Nodes (20): aspectOf(), createAtelierRoom(), buildCollection(), form(), buildEntrance(), buildRoom(), picture(), place() (+12 more)

### Community 18 - "ref_node_assert"
Cohesion: 0.11
Nodes (31): valid, defineSlot(), docBytes(), SLOTS, byAtThenKey(), encoded(), latest, mapOf() (+23 more)

### Community 19 - "amplify/package.json"
Cohesion: 0.08
Nodes (26): amplifyDir, backend, everyMinutes, mediaBucket, missing, repoRoot, REQUIRED, setting() (+18 more)

### Community 20 - "hang-tag.ts"
Cohesion: 0.20
Nodes (5): CARD, HangTag, HangTagStyle, HOLE, KNOT

### Community 21 - "prepare-models.mjs"
Cohesion: 0.15
Nodes (18): paintedCostume(), atelier, bunny, floralOutfits(), goldOutfits(), HEADPIECES, image(), manifest (+10 more)

### Community 22 - "Traversal"
Cohesion: 0.11
Nodes (5): JumpPose, clamp(), fixture(), jump(), Traversal

### Community 23 - "core/package.json"
Cohesion: 0.16
Nodes (13): devDependencies, @types/bcryptjs@^2.4.6, @types/pg@^8.11.10, main, name, private, scripts, typecheck (+5 more)

### Community 24 - "readJsonBody"
Cohesion: 0.18
Nodes (16): roomEditor, PER_EDITOR, PUT(), versionOf(), PER_EDITOR, POST(), PER_MEMBER, POST() (+8 more)

### Community 25 - "PersonalRoom.tsx"
Cohesion: 0.11
Nodes (30): errorReason(), overDrawer(), PersonalRoom(), canPlaceNew(), carryEnd(), carryMove(), onCardKey(), onCardPointerDown() (+22 more)

### Community 27 - "Museum.tsx"
Cohesion: 0.15
Nodes (24): CoinFound, ColorRecall, GameDesktop, GuestBoard, HallArranger, HelpGuide, loadCoinFound(), loadGuestBoard() (+16 more)

### Community 28 - "ambience.ts"
Cohesion: 0.15
Nodes (26): blade(), bloom(), BLOOMS, createPondAmbience(), update(), fishTexture(), frontTexture(), glowTexture() (+18 more)

### Community 29 - "core/src/index.ts"
Cohesion: 0.05
Nodes (115): addBait(), baitOf(), PondBoardMe, PondBoardRow, PondFeedItem, Rep, bountyCatches(), BountyCatchRow (+107 more)

### Community 30 - "Web Package Dependencies"
Cohesion: 0.07
Nodes (33): dependencies, embla-carousel-react@^8.6.0, motion@^13.1.1, next@^15.0.3, react@^19.0.0, react-dom@^19.0.0, swr@^2.5.1, three@^0.169.0 (+25 more)

### Community 31 - "Gamifying Tiny Museum — genre direction & engagement research"
Cohesion: 0.10
Nodes (19): 0.1 The core experience, 0.2 Systems that make gamification cheap to build, 0.3 Constraints that shape any recommendation, 0. What the game is today (the deep dive), 1.1 The landscape (seven candidates, with verdicts), 1.2 Recommendation: a **cozy gallery life-sim** — "the gallery you live in", 1.3 The five design pillars the genre implies, 1. Genre direction (+11 more)

### Community 32 - "atelier-layout.ts"
Cohesion: 0.05
Nodes (21): AtelierActions, AtelierRoom, ClothingItem, Display, ATELIER_END_X, ATELIER_ROOMS, CollectionRoom, COLLECTIONS (+13 more)

### Community 33 - "slots/store.ts"
Cohesion: 0.12
Nodes (20): ANON_PREFIX, anonKey(), deviceKey(), isMemberSlotKey(), listKeys(), MEMBER_KEY, memberKey(), memberPrefix() (+12 more)

### Community 34 - "risk.ts"
Cohesion: 0.16
Nodes (24): Hud(), HudProps, HudWagerChip, WagerPicker(), chooseTier(), WagerPickerProps, chainChipLabel(), clampWagerStake() (+16 more)

### Community 35 - "amplify/tsconfig.json"
Cohesion: 0.20
Nodes (9): compilerOptions, module, moduleResolution, noUnusedLocals, noUnusedParameters, exclude, extends, include (+1 more)

### Community 36 - "5. Customization menu — what other people are doing"
Cohesion: 0.12
Nodes (16): 1. The target: what "Claude Opus 5.5" actually means, 2. Where your harness stands today (live config I read), 3. The honest gap model, 4. Quality levers, ranked by leverage, 5. Customization menu — what other people are doing, 6. Recommended starting kit for *your* profile, 7. What I can apply for you right now (needs your go-ahead), A. Prompt & persona (most common quality customizations) (+8 more)

### Community 37 - "wallet.ts"
Cohesion: 0.14
Nodes (27): applyClaim(), baitCounts(), baitOf(), buy(), BuyResult, claim(), claimBatch(), ClaimBatchResult (+19 more)

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
Cohesion: 0.20
Nodes (15): BugReportHost(), BugReportSheet, BugReportSheet(), send(), Status, collectContext(), inAppBrowser(), onOpenBugReport() (+7 more)

### Community 42 - "PondTicker.tsx"
Cohesion: 0.29
Nodes (11): fetchPondFeed(), PondFeedItem, catchLabel(), formatSizeCm(), speciesFor(), speciesName(), speciesTier(), isGolden() (+3 more)

### Community 43 - "import-fishing-assets.mjs"
Cohesion: 0.09
Nodes (15): CANVAS, clear, FONT, FRAME, heights, layer(), layout, lossless (+7 more)

### Community 44 - "Base TSConfig"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, lib, module, moduleResolution (+9 more)

### Community 45 - "Amplify Build Spec"
Cohesion: 0.12
Nodes (16): applications, appRoot, backend, frontend, baseDirectory, files, phases, commands (+8 more)

### Community 46 - "ColorRecall.tsx"
Cohesion: 0.17
Nodes (17): ColorRecall(), ColorRecallProps, Phase, readBest(), ColorRound, showMs(), loadColorRecall(), saveIfHigher() (+9 more)

### Community 47 - "db-tests/pond.test.ts"
Cohesion: 0.08
Nodes (29): BOARDS, GET(), oneOf(), PER_VISITOR, PERIODS, CatchExtra, COLUMNS, insertCatch() (+21 more)

### Community 48 - "FakeServer"
Cohesion: 0.20
Nodes (3): FakeServer, SlotState, SlotDef

### Community 49 - "handlers.ts"
Cohesion: 0.11
Nodes (29): confirmedFollowers(), sealEpoch(), handleDerivatives(), handleNotifyFollowers(), handleRenderDisplay(), handleSealEpoch(), renderPieceFrame(), renderPieceSketch() (+21 more)

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
Cohesion: 0.08
Nodes (42): AtelierPage(), dynamic, metadata, useWallet(), OwnedSnapshot, walletReady(), getWalletSnapshot(), subscribeWallet() (+34 more)

### Community 54 - "hitForVisitor"
Cohesion: 0.10
Nodes (31): POST(), POST(), POST(), POST(), GET(), PER_VISITOR, clientIp(), rateLimitedResponse() (+23 more)

### Community 55 - "compose-atelier.mjs"
Cohesion: 0.14
Nodes (9): body, dressLayer, dressWidth, floralWidth, MANNEQUIN_CANVAS, mask, root, sourceSize (+1 more)

### Community 56 - "RoomContents"
Cohesion: 0.08
Nodes (16): Pose, JoinedRoom, RoomContents, Decisions (2026-11-05), Follow-ups after Phases 4–7, Model (`apps/web/src/features/rooms/types.ts`), Personal room polish (2026-11-05), Phase 2: hall on the stage (+8 more)

### Community 57 - "pond-format.ts"
Cohesion: 0.13
Nodes (26): fetchPondDex(), PondDex, EXCHANGE_DAILY_STAMPS, EXCHANGE_PEARLS_PER_STAMP, FISH_ART, fishArt(), formatPercent(), formatShortSizeCm() (+18 more)

### Community 58 - "AccountSheet.tsx"
Cohesion: 0.11
Nodes (22): config, SECURITY_HEADERS, openAccount(), openBugReport(), fitWidth(), HelpGuide(), HelpGuideProps, POINTER_STEPS (+14 more)

### Community 59 - "economy/store.ts"
Cohesion: 0.09
Nodes (51): CARRY_CAP, carryAdd(), CarryEntry, carryPrune(), carryRemove(), chunk(), tzOffsetNow(), outboxDue() (+43 more)

### Community 60 - "domain/sketch.ts"
Cohesion: 0.11
Nodes (26): listPieces(), pieceImageUrl(), PieceRow, toPieceDto(), GalleryRow, planSketchRound(), SKETCH_CHOICES, SketchCandidate (+18 more)

### Community 61 - "room.ts"
Cohesion: 0.11
Nodes (32): attachmentOf(), socket(), admitted(), Attachment, farewell(), GHOST_MS, HELLO_TIMEOUT_MS, holdsOf() (+24 more)

### Community 62 - "minimap.ts"
Cohesion: 0.07
Nodes (34): place(), ATELIER_DOOR, createMinimap(), draw(), drawRoom(), floors(), follow(), sketchOf() (+26 more)

### Community 63 - "logic.ts"
Cohesion: 0.12
Nodes (22): loadHallArranger(), SharingState, Tab, TABS, HallArranger(), HallArrangerProps, Painting, categoryOf() (+14 more)

### Community 64 - "Handoff: move the Tiny Museum bunny from sprite frames to a rig"
Cohesion: 0.15
Nodes (11): 1. What is in this bundle, 2. How the game draws the bunny today (read from the repo, not run), 3. The rig, 5. Blender-side work still to do (needs Blender; the author has it with an MCP bridge), 6. Open questions for the author, Handoff: move the Tiny Museum bunny from sprite frames to a rig, Approved v4 bunny in the hall, Assets (+3 more)

### Community 65 - "Sound Effect Assets"
Cohesion: 0.22
Nodes (9): file, kilobytes, seconds, file, kilobytes, seconds, soundEffects, click (+1 more)

### Community 66 - "personalRoomFor"
Cohesion: 0.38
Nodes (6): dynamic, HomePage(), HomeSignIn(), personalRoomFor(), roomSlug(), starterPlacements()

### Community 67 - "Custom HTTP Headers"
Cohesion: 0.25
Nodes (7): applications, appRoot, customHeaders, headers, pattern, key, value

### Community 68 - "Sharp Layer Package"
Cohesion: 0.33
Nodes (6): dependencies, sharp@^0.33.5, description, sharp, name, private

### Community 69 - "session.ts"
Cohesion: 0.18
Nodes (17): GET(), PaintingRow, GET(), POST(), UPLOADS_PER_ARTIST, dynamic, RoomPage(), StudioLayout() (+9 more)

### Community 70 - "Other visitors"
Cohesion: 0.29
Nodes (6): How it plays, Other visitors, Privacy, Running it in production, Running it locally, Staying consistent

### Community 71 - "AssetImage"
Cohesion: 0.17
Nodes (16): BoardScreen(), BoardScreenProps, PinnedNotes(), PinnedNotesProps, ReadScreenProps, messageLength(), StickyNote(), NOTE_PLACES (+8 more)

### Community 72 - "wallet/body.ts"
Cohesion: 0.26
Nodes (11): PER_MEMBER, POST(), baitIdOf(), integerOffset(), isRecord(), itemIdOf(), MAX_CLAIM_BATCH, ParsedWalletClaim (+3 more)

### Community 73 - "Placement"
Cohesion: 0.12
Nodes (5): Carry, PersonalRoomProps, HallRoomData, PlacementLayer, Placement

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
Cohesion: 0.17
Nodes (14): createPresence(), drop(), heartbeat(), maybeSend(), onPageHide(), receive(), scheduleRetry(), send() (+6 more)

### Community 81 - "members"
Cohesion: 0.12
Nodes (25): coin_claims, coin_claims_daily, wallet_bait, wallet_items, wallets, member_sessions, member_sessions_member, member_slots (+17 more)

### Community 82 - "Frame Window Asset"
Cohesion: 0.50
Nodes (4): frame, size, window, windowAspect

### Community 83 - "hit.ts"
Cohesion: 0.17
Nodes (12): CoinWall, createHiddenCoin(), Spot, AlphaMap, alphaMapFor(), alphaMaps, buildAlphaMap(), isPaintedAt() (+4 more)

### Community 84 - "presence/package.json"
Cohesion: 0.14
Nodes (16): dependencies, @tiny/core@*, devDependencies, @cloudflare/workers-types@5.20261016.1, wrangler@4.151.1, @tiny/core, name, private (+8 more)

### Community 85 - "SoundProvider.tsx"
Cohesion: 0.21
Nodes (7): StageOptions, RoomSound, SoundContext, SoundState, EffectName, STATIC_BASE, staticUrl()

### Community 86 - "Asset pipeline: fast loading without losing sharpness"
Cohesion: 0.22
Nodes (8): Asset pipeline: fast loading without losing sharpness, Character rigs and the Costume Atelier, Completed, Ground rules, Phase 1: fingerprinted files at 2x and 3x, Phase 2: texture atlases for the hall sprites, Phase 3: KTX2 (Basis Universal), built and switched off, Phase 4: ThumbHash placeholders for paintings

### Community 87 - "Guest Board SQL Schema"
Cohesion: 0.67
Nodes (3): guest_notes, guest_notes_visible, rate_limits

### Community 88 - "Landscape Frame Asset"
Cohesion: 0.67
Nodes (3): frameLandscape, size, window

### Community 89 - "features/economy/index.ts"
Cohesion: 0.20
Nodes (15): serverSnapshot, useEarnEvents(), buildClaim(), BuiltClaim, EarnDetail, EarnSource, GameSource, newRunId() (+7 more)

### Community 93 - "json"
Cohesion: 0.08
Nodes (66): POST(), PER_MEMBER, PUT(), POST(), GET(), GLOBAL, PER_IP, POST() (+58 more)

### Community 94 - "outbox.test.ts"
Cohesion: 0.29
Nodes (11): ClaimRequest, OUTBOX_CAP, outboxAdd(), OutboxEntry, outboxFail(), outboxRemove(), RETRY_BASE_MS, RETRY_MAX_MS (+3 more)

### Community 95 - "pond/room.ts"
Cohesion: 0.10
Nodes (24): FrameShape, FAR_LIFT, FAR_SCALE, liftAt(), pathHalfWidth(), pathX(), PondPath, scaleAt() (+16 more)

### Community 96 - "ticket/route.ts"
Cohesion: 0.08
Nodes (44): Code, 3.2 Chosen names (members), registry, started(), artist(), member(), piece(), randomId() (+36 more)

### Community 104 - "createStage"
Cohesion: 0.05
Nodes (40): Loading(), AtelierLoading(), revealFloorTransition(), ArtCache, ArtCacheOptions, createArtCache(), drop(), expireLater() (+32 more)

### Community 105 - "FishingView.tsx"
Cohesion: 0.13
Nodes (14): CONFETTI_COLORS, ConfettiPiece, makeConfetti(), RevealCard(), TIER_MS, TIER_SFX, useCountUp(), chainOffer (+6 more)

### Community 106 - "ticket.ts"
Cohesion: 0.23
Nodes (12): decoder, encoder, fromBase64Url(), HmacKey, isOwn(), isTicket(), keyFor(), keys (+4 more)

### Community 107 - "catalog.ts"
Cohesion: 0.27
Nodes (11): CatalogItem, CatalogKind, FREE_CHARACTERS, isBuyable(), isCatalogItem(), ITEMS, ItemSlot, priceOf() (+3 more)

### Community 108 - "MuseumStage.tsx"
Cohesion: 0.13
Nodes (11): EXITS, isDoor(), linkedDoor(), LINKS, ActiveRoom, RoomOptions, StageContext, StageContextValue (+3 more)

### Community 109 - "lib/presence.ts"
Cohesion: 0.09
Nodes (21): Connect, connectWebSocket(), fetchTicket, HEARTBEAT_MS, HIDDEN_LIMIT_MS, RETRY_MS, SAY_GAP_MS, Socket (+13 more)

### Community 110 - "graftCostume"
Cohesion: 0.27
Nodes (14): canvasFit(), compose(), graftCostume(), copyAccessor(), copyMaterial(), copyMesh(), copyTexture(), copyView() (+6 more)

### Community 111 - "FishingView.tsx"
Cohesion: 0.12
Nodes (31): PondGameProps, PondGame(), RevealCardProps, buyPondBait(), CastOptions, castPond(), chainPondBait(), errorOf() (+23 more)

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
Cohesion: 0.18
Nodes (19): fetch(), Env, isItem(), isName(), isPid(), isSeq(), MAX_HOLDS, MAX_MESSAGE_BYTES (+11 more)

### Community 119 - "Costume gallery doorway"
Cohesion: 0.50
Nodes (3): Costume gallery doorway, Curtain colour edit, Prompt

### Community 120 - "pond-api.ts"
Cohesion: 0.09
Nodes (47): refreshWalletNow(), buyPondBait(), claimPondBounty(), errorOf(), exchangePondPearls(), fetchPondLeaderboard(), fetchPondState(), isRecord() (+39 more)

### Community 121 - "Fishing forest: painted asset pass"
Cohesion: 0.11
Nodes (17): Assets, Bruce's collection refresh (2026-11-08), Fishing forest illustrations, Made by hand (not touched by the script), Monets Lily Pond (2026-11-08), 1. Forest doorway, 2. Woodland noticeboard, 3. Fisherman and bait basket (+9 more)

### Community 124 - "The Costume Atelier"
Cohesion: 0.13
Nodes (14): Adding a character, Adding a costume, Art not supplied as files, Bruce's Chronicles, Checked against the mocks (2026-11-07), Code, Costume fit review, Fitting clothes to other characters (+6 more)

### Community 125 - "tab-turn.ts"
Cohesion: 0.16
Nodes (5): createTabTurn(), TabTurn, tab(), TurnEnv, TurnMessage

### Community 126 - "rig.ts"
Cohesion: 0.04
Nodes (79): CrowdPreviewPage(), RigPreviewPage(), CrowdPreview(), draw(), KINDS, Stats, Window, NEXT (+71 more)

### Community 127 - "Curating the paintings (2026-11-07)"
Cohesion: 0.13
Nodes (14): 1. The registry and the table, 2. The studio's Location picker, 3. The rooms draw what is placed, 4. Credits, 5. Retiring self-serve artists, Building it, Curating the paintings (2026-11-07), Decided (+6 more)

### Community 128 - "domain/guestboard.ts"
Cohesion: 0.20
Nodes (13): GET(), StickyNoteProps, decodeCursor(), encodeCursor(), GuestNoteInput, GuestNoteRejected, listGuestNotes(), NoteRow (+5 more)

### Community 129 - "presence/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, types, exclude, extends, include, ../../tsconfig.base.json

### Community 130 - "ticket/route.ts"
Cohesion: 0.29
Nodes (10): GET(), PER_IP, POST(), presenceUrl(), exportMember(), memberName, exportWallet(), nameFromSeed() (+2 more)

### Community 131 - "tsconfig.test.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 132 - "app/layout.tsx"
Cohesion: 0.08
Nodes (27): bethEllen, inspiratiq, metadata, notoSans, RootLayout(), sniglet, viewport, AccountHost() (+19 more)

### Community 133 - "names.ts"
Cohesion: 0.12
Nodes (18): NameError, VisitorName, checkMessage(), INVISIBLE, MESSAGE_MAX, MessageCheck, normalizeMessage(), ADJECTIVES (+10 more)

### Community 134 - "lib/presence.ts"
Cohesion: 0.09
Nodes (15): PresencePreviewPage(), PresencePreview(), Entry, INTERPOLATION_DELAY_MS, PEER_TIMEOUT_MS, PeerTable, positionAt(), RemoteVisitor (+7 more)

### Community 135 - "dependencies"
Cohesion: 0.15
Nodes (13): dependencies, @aws-sdk/client-s3@^3.1121.0, @aws-sdk/s3-request-presigner@^3.1121.0, bcryptjs@^2.4.3, obscenity@^0.4.6, sharp@^0.33.5, thumbhash@^0.1.1, sharp (+5 more)

### Community 136 - "exports"
Cohesion: 0.15
Nodes (13): exports, ./brand, ./bugs, ./economy, ./guestboard, ./presence, ./presence/messages, ./presence/wire (+5 more)

### Community 137 - "stage.ts"
Cohesion: 0.04
Nodes (39): coverFloorTransition(), CameraRig, Character, loadGalleryDoor(), loadGalleryPillar(), loadImage(), Matcha, createPixelRatioGovernor() (+31 more)

### Community 138 - "hall/room.ts"
Cohesion: 0.04
Nodes (68): Assets, Scenery, createBackdrop(), CUTS, disposeBoards(), Mark, plane(), ROPE_CUTS (+60 more)

### Community 139 - "epoch.ts"
Cohesion: 0.22
Nodes (15): GET(), intParam(), GET(), sketchPool, unavailable(), currentEpoch(), ensureEpoch(), epochById() (+7 more)

### Community 140 - "Item"
Cohesion: 0.19
Nodes (3): Presence, Item, Refusal

### Community 141 - "sketchguess/lib/api.ts"
Cohesion: 0.23
Nodes (13): sameOriginUrl(), PreparedGame, decodeImage(), fetchBitmap(), fetchRound(), guarded(), LoadedRound, loadInk() (+5 more)

### Community 142 - "visits.ts"
Cohesion: 0.06
Nodes (46): state(), PER_VISITOR, POST(), dynamic, format(), grade(), METRICS, PAGES (+38 more)

### Community 143 - "personal/room.ts"
Cohesion: 0.21
Nodes (9): cozyLevel, cozyWorth(), createPersonalRoom(), showLevel(), DOOR_SIGN, NAME_SIGN, PersonalRoomOptions, cozyTheme (+1 more)

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
Nodes (31): BaitTrayProps, debugSpecies(), debugVariant(), GuestRollOptions, guestTreasure(), rollGuest(), BAIT, BAIT_BY_ID (+23 more)

### Community 149 - "xdog.ts"
Cohesion: 0.27
Nodes (7): renderSketch(), blur(), kernel(), toGray(), XDOG_DEFAULTS, xdogInk(), XdogOptions

### Community 150 - "AccountSheet"
Cohesion: 0.29
Nodes (9): AccountSheet(), continueAnyway(), doSignOut(), runDelete(), runName(), submit(), submitDelete(), submitName() (+1 more)

### Community 151 - "pond-state.ts"
Cohesion: 0.13
Nodes (22): GLYPHS, PearlIcon(), POND_CRIMSON, PondIcon(), PondIconName, fetchPondBounties(), PondStateView, PondTier (+14 more)

### Community 153 - "GuestBoard.tsx"
Cohesion: 0.17
Nodes (16): ComposeScreen(), ComposeScreenProps, blankDraft(), GuestBoard(), GuestBoardProps, View, ReadScreen(), fetchPage() (+8 more)

### Community 154 - "GameDesktop.tsx"
Cohesion: 0.33
Nodes (7): loadGameDesktop(), GameDesktop(), GameDesktopProps, MinigameFrame(), Minigame, MinigameId, MINIGAMES

### Community 156 - "bugs/page.tsx"
Cohesion: 0.38
Nodes (6): BugReportsPage(), dateFormat, dynamic, summary(), BugContext, listBugReports()

### Community 157 - "Walkthrough.tsx"
Cohesion: 0.14
Nodes (20): MoreArrow(), NavArrow(), Props, SLIDE, Walkthrough(), XIcon(), decodedFrames, frameFor() (+12 more)

### Community 158 - "createPondRoom"
Cohesion: 0.32
Nodes (13): createPondRoom(), approach(), busy(), finishWalk(), goTo(), leave(), move(), nearest() (+5 more)

### Community 159 - "createPlacementLayer"
Cohesion: 0.20
Nodes (7): aspectOf(), createPlacementLayer(), drawOutline(), dropHelper(), sizeOf(), PlacementTheme, Phase 5: themes, zones and arrangements

### Community 160 - "a/[slug]/page.tsx"
Cohesion: 0.31
Nodes (6): ArtistPage(), dynamic, generateMetadata(), GET(), FollowForm(), getArtistPage()

### Community 163 - "painting-open"
Cohesion: 0.50
Nodes (4): file, kilobytes, seconds, painting-open

### Community 165 - "Multiplayer ("other visitors") — plan v2 (Cloudflare)"
Cohesion: 0.14
Nodes (13): ScreenChrome(), 0. Summary, 10. Decisions, 1. Product contract changes (approved 2026-10-31), 2. What already exists that this builds on, 3.1 Generated names (everyone has one), 3. Names, 5.1 Emotes (v1) (+5 more)

### Community 168 - "audience.ts"
Cohesion: 0.14
Nodes (17): ALLOWED, POST(), GET(), AnalyticsSummary, createInquiry(), EventKind, follow(), recordEvent() (+9 more)

### Community 169 - "icon-basket"
Cohesion: 0.67
Nodes (3): icon-basket, file, vector

### Community 170 - "reveal.ts"
Cohesion: 0.23
Nodes (7): InkMap, planGame(), ROUND_SPREAD, createReveal(), PENCIL, SketchReveal, shuffle()

### Community 171 - "next"
Cohesion: 0.17
Nodes (16): Loading(), dynamic, Hall(), MuseumPage(), CurrentlyShowing(), dynamic, GUIDELINES, LandingPage() (+8 more)

### Community 174 - "useMember"
Cohesion: 0.18
Nodes (3): KeepOnOtherDevices(), Probe(), useMember

### Community 179 - "confirm/page.tsx"
Cohesion: 0.33
Nodes (7): ConfirmFollow(), dynamic, dynamic, Unsubscribe(), FollowNotice(), confirmFollow(), unsubscribe()

### Community 180 - "atelier.ts"
Cohesion: 0.06
Nodes (34): MuseumLayout(), CoinToast(), Toast, Purse(), Stamp(), WalletProvider(), allowedCharacter(), owns() (+26 more)

### Community 183 - "run.ts"
Cohesion: 0.17
Nodes (9): admin, childEnv, client, database, fresh, migrations, target, pg@^8.13.1 (+1 more)

### Community 186 - "4. Transport: Cloudflare Durable Objects"
Cohesion: 0.25
Nodes (8): 4. Transport: Cloudflare Durable Objects, Decision (2026-10-31), Deploying, Identity cannot be forged, Local development and tests, Rooms and capacity, Shape of `apps/presence` (about 200 lines), main()

### Community 187 - "media/storage.ts"
Cohesion: 0.10
Nodes (19): CONTENT_TYPES, GET(), POST(), UPLOADS_PER_ARTIST, PUT(), ACCEPTED, createAssetFromUpload(), MAX_UPLOAD_BYTES (+11 more)

### Community 191 - "useSoundEffects.ts"
Cohesion: 0.12
Nodes (20): EFFECTS, EffectSpec, FOOTSTEPS, SoundEffects, useSoundEffects(), gestured(), OPTIONS, applyMix() (+12 more)

### Community 192 - "Confirmed issues"
Cohesion: 0.04
Nodes (46): 10. Long names run off the name sign, 11. The rooms API skips the stale-tab member check, 12. The bunny is dragged along while you pan in Decorate, 13. Pages that redirect or don't exist answer 200, 14. Error codes reveal which room slugs exist, 15. The name sign slides under the top-right buttons in Decorate, 16. Level-up celebrations can be farmed, 17. No hint of where things are after panning away (+38 more)

### Community 193 - "Monets Lily Pond: exploration, UX and multiplayer QA"
Cohesion: 0.29
Nodes (6): Browser and interaction coverage, Changes made from the walkthrough, Monets Lily Pond: exploration, UX and multiplayer QA, Multiplayer and load, Practical limits, Regression checks and cleanup

## Knowledge Gaps
- **5 isolated node(s):** `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1332 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **26 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `AccountSheet.tsx` to `gallery/page.tsx`, `SketchGuess.tsx`, `app/layout.tsx`, `names.ts`, `lib/presence.ts`, `machine.ts`, `PondRoom.tsx`, `Test Fakes and Helpers`, `join-room.ts`, `pond-state.ts`, `GuestBoard.tsx`, `PersonalRoom.tsx`, `Museum.tsx`, `Walkthrough.tsx`, `Web Package Dependencies`, `a/[slug]/page.tsx`, `slots/store.ts`, `risk.ts`, `bug-reports.ts`, `PondTicker.tsx`, `next`, `ColorRecall.tsx`, `Water.tsx`, `atelier.ts`, `wardrobe.ts`, `pond-format.ts`, `logic.ts`, `useSoundEffects.ts`, `AssetImage`, `SoundProvider.tsx`, `features/economy/index.ts`, `createStage`, `FishingView.tsx`, `MuseumStage.tsx`, `pond-api.ts`, `rig.ts`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **What connects `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json` to the rest of the system?**
  _5 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `gallery/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09878048780487805 - nodes in this community are weakly interconnected._
- **Why does `three` connect `hall/room.ts` to `scene/assets.ts`, `stage.ts`, `scene.ts`, `cozy.ts`, `pond/art.ts`, `hit.ts`, `atelier.ts`, `hang-tag.ts`, `prepare-models.mjs`, `Web Package Dependencies`, `ambience.ts`, `rig.ts`, `pond/room.ts`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Should `walk.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11397849462365592 - nodes in this community are weakly interconnected._
- **Why does `esbuild` connect `Root Package Manifest` to `room.ts`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Should `SketchGuess.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07922705314009662 - nodes in this community are weakly interconnected._