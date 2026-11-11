# Graph Report - tiny-museum  (2026-11-11)

## Corpus Check
- 490 files · ~266,275 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 78 file(s) not represented in the graph (top: .avif 39, .glb 30, .css 4)

## Summary
- 4268 nodes · 11056 edges · 221 communities (194 shown, 27 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 200 edges (avg confidence: 0.89)
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
- lib/assets.ts
- prepare-models.mjs
- Traversal
- core/package.json
- art-cache.ts
- PersonalRoom.tsx
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
- wallet.ts
- rules.ts
- Web TSConfig
- Root Package Manifest
- bug-reports.ts
- PondTicker.tsx
- import-fishing-assets.mjs
- Base TSConfig
- Amplify Build Spec
- useSound
- hitForVisitor
- FakeServer
- handlers.ts
- Water.tsx
- Worker Package Manifest
- Public Asset Manifest
- wardrobe.ts
- guestboard/route.ts
- compose-atelier.mjs
- layout.ts
- pond-format.ts
- AccountSheet.tsx
- economy/store.ts
- backend.ts
- room.ts
- minimap.ts
- logic.ts
- Handoff: move the Tiny Museum bunny from sprite frames to a rig
- Sound Effect Assets
- CharacterKind
- Custom HTTP Headers
- Sharp Layer Package
- isHallOwner
- hall/room.ts
- AssetImage
- Conn
- core/src/index.ts
- Visits SQL Schema
- Bunny Walk Sprites
- Room Mockup Settings
- Service Worker Caching
- HallCallbacks
- pond/art.ts
- createPresence
- members
- Frame Window Asset
- .webSocketMessage
- presence/package.json
- SoundProvider.tsx
- Asset pipeline: fast loading without losing sharpness
- Guest Board SQL Schema
- Landscape Frame Asset
- nearby.ts
- Bug Reports SQL Schema
- Vitals SQL Schema
- json
- db-tests/pond.test.ts
- pond/room.ts
- ticket/route.ts
- Run-Once Schema
- createStage
- FishingView.tsx
- ticket.ts
- createMinimap
- currentMember
- Clock
- graftCostume
- FishingView.tsx
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
- Medium
- rig.ts
- Curating the paintings (2026-11-07)
- domain/guestboard.ts
- presence/tsconfig.json
- Low
- tsconfig.test.json
- app/layout.tsx
- messages.ts
- lib/presence.ts
- dependencies
- exports
- stage.ts
- three
- epoch.ts
- lib/presence.ts
- sketchguess/lib/api.ts
- visits.ts
- personal/room.ts
- The Moonlit Pond — design
- Pond rework
- env.ts
- Orchestration contract — you plan, DSH workers execute
- tables.ts
- Personal room: stress-test issues
- Local end-to-end stress test — 2026-11-06
- pond-state.ts
- Minimap
- Storage
- GameDesktop.tsx
- transaction
- next
- Walkthrough.tsx
- createPondRoom
- createPlacementLayer
- High
- domain/sketch.ts
- features/economy/index.ts
- painting-open
- boundedCameraX
- Multiplayer ("other visitors") — plan v2 (Cloudflare)
- Context
- member-route.ts
- audience.ts
- icon-basket
- reveal.ts
- next
- config.ts
- bunny-left
- lib/slots/index.ts
- bunny-right
- carry.test.ts
- ticket/route.ts
- icon-home
- wallet/body.ts
- atelier.ts
- ticket
- hit.ts
- run.ts
- tab-turn.ts
- outbox.test.ts
- Angler.tsx
- media/storage.ts
- Cafe
- src/types.ts
- themes.ts
- useSoundEffects.ts
- Confirmed issues
- Monets Lily Pond: exploration, UX and multiplayer QA
- createRemoteVisitors
- RigPreview.tsx
- hang-tag.ts
- request
- PerfMeter
- currentArtist
- visits/page.tsx
- icons.tsx
- Lobby
- confirm/page.tsx
- AccountSheet
- BountyPanel.tsx
- FilesystemStorage
- CrowdPreview.tsx
- formatInteger
- Rig
- shopkeeper.ts
- VitalsReporter.tsx
- 4. Transport: Cloudflare Durable Objects
- vitals.ts
- createStage
- RoomSound
- share.ts
- db.ts
- ArtCache
- setCostumeVisibility
- GuestBoard

## God Nodes (most connected - your core abstractions)
1. `react` - 75 edges
2. `json()` - 69 edges
3. `query()` - 68 edges
4. `hit()` - 55 edges
5. `limited()` - 49 edges
6. `next` - 44 edges
7. `Traversal` - 44 edges
8. `three` - 43 edges
9. `SyncStore` - 41 edges
10. `FishingView()` - 39 edges

## Surprising Connections (you probably didn't know these)
- `Code` --references--> `followOutfit()`  [INFERRED]
  docs/costume-atelier.md → apps/web/src/features/hall/scene/wardrobe.ts
- `5.1 Emotes (v1)` --references--> `ScreenChrome()`  [INFERRED]
  docs/multiplayer-plan.md → apps/web/src/shared/components/ScreenChrome.tsx
- `E2E-009 — Room mutations ignore stale account identity` --references--> `memberFromRequest()`  [INFERRED]
  docs/testing/local-e2e-stress-2026-11-06.md → apps/web/src/shared/lib/member-route.ts
- `Fitting clothes to other characters` --references--> `graftCostume()`  [INFERRED]
  docs/costume-atelier.md → apps/web/tooling/graft-costume.mjs
- `19. Development-only: page payloads include the full room row` --references--> `getRoom()`  [INFERRED]
  docs/personal-room-issues.md → packages/core/src/domain/rooms.ts

## Import Cycles
- None detected.

## Communities (221 total, 27 thin omitted)

### Community 0 - "gallery/page.tsx"
Cohesion: 0.17
Nodes (20): dynamic, GalleryPage(), dynamic, LocationsPage(), hangAction(), movePieceAction(), unhangAction(), FloorControls() (+12 more)

### Community 1 - "walk.ts"
Cohesion: 0.11
Nodes (14): FloorPoint, WalkArea, water, FOREST_GATE, POND_LANDMARKS, DEPTH_SPAN, depthOf(), MAX_DEPTH (+6 more)

### Community 2 - "SketchGuess.tsx"
Cohesion: 0.11
Nodes (30): bestKeyFor(), BURST, clueUrl(), openingPlan(), Phase, pickAtRandom(), prepareSketchGame(), readDifficulty() (+22 more)

### Community 3 - "rooms.ts"
Cohesion: 0.06
Nodes (57): AtelierPage(), dynamic, metadata, COLLECTIONS, publishLocationAction(), artist(), member(), piece() (+49 more)

### Community 4 - "jobs.ts"
Cohesion: 0.23
Nodes (16): loop(), shutdown(), sleep(), sweepStale(), DrainResult, handler(), repairFrames(), repairUnframed() (+8 more)

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
Nodes (40): AssetManifest, assetUrl(), bitmapTexture(), blankImage(), CAFE_CAT_FRAMES, CharacterSprites, CompressedLoader, elementTexture() (+32 more)

### Community 9 - "SyncStore"
Cohesion: 0.16
Nodes (6): encodeStored(), parseStored(), readStored(), writeStored(), SyncStore, upgrade()

### Community 10 - "machine.ts"
Cohesion: 0.10
Nodes (48): CAST_ERRORS, coarsePointer(), FishingView(), initialEasyReel(), isTyping(), LOST, Toast, vibrate() (+40 more)

### Community 11 - "PondRoom.tsx"
Cohesion: 0.13
Nodes (18): Loading(), metadata, PondPage(), POND_NAME, PondLoading(), BOARD_TABS, PondOverlayKind, PondPanels() (+10 more)

### Community 12 - "Test Fakes and Helpers"
Cohesion: 0.11
Nodes (27): deferredFetch(), deviceSlot, FakeEvents, FakeStorage, fixture, fixtureB, fixtureRegistry, fixtureRegistryBoth (+19 more)

### Community 13 - "scene.ts"
Cohesion: 0.05
Nodes (27): MuseumProps, disposeDisplayTexture(), HELM_PEDESTAL_FILE, prefersAvif(), HiddenCoin, createNotes(), createPedestal(), Notes (+19 more)

### Community 14 - "cozy.ts"
Cohesion: 0.16
Nodes (21): ATELIER_PROPS, AtelierImage, canvasTexture(), CozyBackdrop, cozyPropImageUrl(), disposeCozyArt(), drawingOn(), FISH (+13 more)

### Community 15 - "actions.ts"
Cohesion: 0.09
Nodes (51): AnalyticsPage(), dynamic, dynamic, StudioHome(), back(), createCodeAction(), deleteCodeAction(), deletePieceAction() (+43 more)

### Community 16 - "join-room.ts"
Cohesion: 0.17
Nodes (28): ChatButton(), REFUSED, joinRoom(), Options, STANDING, emit(), getPeople(), isInRoom() (+20 more)

### Community 17 - "createAtelierRoom"
Cohesion: 0.33
Nodes (18): aspectOf(), createAtelierRoom(), buildCollection(), form(), buildEntrance(), buildRoom(), picture(), place() (+10 more)

### Community 18 - "ref_node_assert"
Cohesion: 0.12
Nodes (30): defineSlot(), docBytes(), SLOTS, byAtThenKey(), encoded(), latest, mapOf(), maxNumber() (+22 more)

### Community 19 - "amplify/package.json"
Cohesion: 0.17
Nodes (14): devDependencies, @aws-amplify/backend@^1.14.0, @aws-amplify/backend-cli@^1.6.0, aws-cdk-lib@^2.180.0, constructs@^10.3.0, name, private, scripts (+6 more)

### Community 20 - "lib/assets.ts"
Cohesion: 0.14
Nodes (19): Loading(), DENSITY_MEDIA, HallPreload(), HallSkeleton(), loadPondArt(), loadTexture(), assetCssVariables(), assetEntry (+11 more)

### Community 21 - "prepare-models.mjs"
Cohesion: 0.15
Nodes (18): paintedCostume(), atelier, bunny, floralOutfits(), goldOutfits(), HEADPIECES, image(), manifest (+10 more)

### Community 22 - "Traversal"
Cohesion: 0.10
Nodes (6): JumpPose, clamp(), fixture(), jump(), Traversal, Stress-test fixes (2026-11-06)

### Community 23 - "core/package.json"
Cohesion: 0.16
Nodes (13): devDependencies, @types/bcryptjs@^2.4.6, @types/pg@^8.11.10, main, name, private, scripts, typecheck (+5 more)

### Community 24 - "art-cache.ts"
Cohesion: 0.21
Nodes (9): ArtCacheOptions, createArtCache(), drop(), expireLater(), hold(), HeldArt, LoadResult, Slot (+1 more)

### Community 25 - "PersonalRoom.tsx"
Cohesion: 0.10
Nodes (30): Carry, errorReason(), overDrawer(), PersonalRoom(), canPlaceNew(), carryEnd(), carryMove(), onCardKey() (+22 more)

### Community 26 - "DecorController"
Cohesion: 0.06
Nodes (4): DecorController, GhostOptions, PlacementLayer, Placement

### Community 27 - "Museum.tsx"
Cohesion: 0.08
Nodes (36): Loading(), AtelierLoading(), CoinFound, ColorRecall, GameDesktop, GuestBoard, HallArranger, HelpGuide (+28 more)

### Community 28 - "ambience.ts"
Cohesion: 0.13
Nodes (30): blade(), bloom(), BLOOMS, createPondAmbience(), update(), fishTexture(), frond(), FRONT_ROWS (+22 more)

### Community 29 - "economy/pond.ts"
Cohesion: 0.07
Nodes (54): addBait(), castPond(), reelPond(), BOUNTY_POOL, BountyTemplate, inverseNormal(), isPondFish(), isPondTier() (+46 more)

### Community 30 - "Web Package Dependencies"
Cohesion: 0.07
Nodes (33): dependencies, embla-carousel-react@^8.6.0, motion@^13.1.1, next@^15.0.3, react@^19.0.0, react-dom@^19.0.0, swr@^2.5.1, three@^0.169.0 (+25 more)

### Community 31 - "Gamifying Tiny Museum — genre direction & engagement research"
Cohesion: 0.10
Nodes (19): 0.1 The core experience, 0.2 Systems that make gamification cheap to build, 0.3 Constraints that shape any recommendation, 0. What the game is today (the deep dive), 1.1 The landscape (seven candidates, with verdicts), 1.2 Recommendation: a **cozy gallery life-sim** — "the gallery you live in", 1.3 The five design pillars the genre implies, 1. Genre direction (+11 more)

### Community 32 - "atelier.ts"
Cohesion: 0.08
Nodes (28): AtelierImage, BuiltRoom, Cardigan, CARDIGAN_NAMES, CHARACTER_NAMES, Control, refresh(), disposeAtelierArt() (+20 more)

### Community 33 - "slots/store.ts"
Cohesion: 0.19
Nodes (14): ANON_PREFIX, anonKey(), deviceKey(), isMemberSlotKey(), listKeys(), MEMBER_KEY, memberKey(), memberPrefix() (+6 more)

### Community 34 - "risk.ts"
Cohesion: 0.15
Nodes (27): Hud(), HudProps, HudWagerChip, WagerPicker(), chooseTier(), WagerPickerProps, chainChipLabel(), clampWagerStake() (+19 more)

### Community 35 - "amplify/tsconfig.json"
Cohesion: 0.20
Nodes (9): compilerOptions, module, moduleResolution, noUnusedLocals, noUnusedParameters, exclude, extends, include (+1 more)

### Community 36 - "5. Customization menu — what other people are doing"
Cohesion: 0.12
Nodes (16): 1. The target: what "Claude Opus 5.5" actually means, 2. Where your harness stands today (live config I read), 3. The honest gap model, 4. Quality levers, ranked by leverage, 5. Customization menu — what other people are doing, 6. Recommended starting kit for *your* profile, 7. What I can apply for you right now (needs your go-ahead), A. Prompt & persona (most common quality customizations) (+8 more)

### Community 37 - "wallet.ts"
Cohesion: 0.07
Nodes (46): grantPearls(), member(), now, piece(), randomId(), today, applyClaim(), baitCounts() (+38 more)

### Community 38 - "rules.ts"
Cohesion: 0.20
Nodes (14): EXCHANGE_DAILY_STAMPS, EXCHANGE_PEARLS_PER_STAMP, exchangeClaimKey(), GAME_DAILY_CAP, GameId, GAMES, includes(), isRecord() (+6 more)

### Community 39 - "Web TSConfig"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 40 - "Root Package Manifest"
Cohesion: 0.07
Nodes (35): description, devDependencies, concurrently@^9.1.0, esbuild@^0.24.0, ktx2-encoder@^0.6.0, maxrects-packer@^2.7.3, playwright@^1.63.0, @types/node@^22.9.0 (+27 more)

### Community 41 - "bug-reports.ts"
Cohesion: 0.11
Nodes (28): BugReportHost(), BugReportSheet, BugReportSheet(), send(), Status, collectContext(), inAppBrowser(), onOpenBugReport() (+20 more)

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

### Community 46 - "useSound"
Cohesion: 0.32
Nodes (7): ColorRecall(), ColorRecallProps, Phase, readBest(), ColorRound, showMs(), loadColorRecall()

### Community 47 - "hitForVisitor"
Cohesion: 0.13
Nodes (25): ALLOWED, POST(), POST(), GLOBAL, PER_IP, POST(), GLOBAL, PER_IP (+17 more)

### Community 48 - "FakeServer"
Cohesion: 0.20
Nodes (3): FakeServer, SlotState, SlotDef

### Community 49 - "handlers.ts"
Cohesion: 0.14
Nodes (26): confirmedFollowers(), GalleryRow, SketchPieceRow, DisplayPieceRow, handleDerivatives(), handleNotifyFollowers(), Job, newWorkNotice() (+18 more)

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
Cohesion: 0.17
Nodes (22): allowedCharacter(), OwnedSnapshot, owns(), walletReady(), Atelier(), leave(), loadedMember, loadingMember (+14 more)

### Community 54 - "guestboard/route.ts"
Cohesion: 0.36
Nodes (7): POST(), POST(), rateLimitedResponse(), rejectedResponse(), enforceLimits(), GuestNoteRateLimited, postGuestNote()

### Community 55 - "compose-atelier.mjs"
Cohesion: 0.14
Nodes (9): body, dressLayer, dressWidth, floralWidth, MANNEQUIN_CANVAS, mask, root, sourceSize (+1 more)

### Community 56 - "layout.ts"
Cohesion: 0.18
Nodes (9): cafeAfterIndex(), computeLayout(), cutRooms(), HallLayout, HallRoomKind, HallRoomSpan, hasPedestal(), Span (+1 more)

### Community 57 - "pond-format.ts"
Cohesion: 0.13
Nodes (26): PondDex, EXCHANGE_DAILY_STAMPS, EXCHANGE_PEARLS_PER_STAMP, FISH_ART, fishArt(), formatPercent(), formatShortSizeCm(), ODDS_BAIT (+18 more)

### Community 58 - "AccountSheet.tsx"
Cohesion: 0.09
Nodes (28): AccountHost(), AccountSheet, Mode, NAME_ERRORS, Pending, View, KeepOnOtherDevices(), onOpenAccount() (+20 more)

### Community 59 - "economy/store.ts"
Cohesion: 0.13
Nodes (33): buy(), cappedTracked, emit(), emitEarned(), EMPTY_BAIT, EMPTY_TODAY, ensureStarted(), eventListeners (+25 more)

### Community 60 - "backend.ts"
Cohesion: 0.15
Nodes (12): amplifyDir, backend, everyMinutes, mediaBucket, missing, repoRoot, REQUIRED, setting() (+4 more)

### Community 61 - "room.ts"
Cohesion: 0.13
Nodes (29): admitted(), Attachment, farewell(), GHOST_MS, HELLO_TIMEOUT_MS, holdsOf(), MAX_WAITING_PER_IP, newAttachment() (+21 more)

### Community 62 - "minimap.ts"
Cohesion: 0.12
Nodes (23): ATELIER_DOOR, doorPoint(), FALLBACK_TINT, FloorSketch, ICONS, MAP_PLACES, MAP_SCALE, MapPlace (+15 more)

### Community 63 - "logic.ts"
Cohesion: 0.09
Nodes (27): loadHallArranger(), DecorDrawer, DecorDrawerProps, SharingState, Tab, TABS, HallArranger(), HallArrangerProps (+19 more)

### Community 64 - "Handoff: move the Tiny Museum bunny from sprite frames to a rig"
Cohesion: 0.12
Nodes (15): BunnyArtist(), BunnyMood, Pencil(), POSES, 1. What is in this bundle, 3. The rig, 4. Suggested plan, 5. Blender-side work still to do (needs Blender; the author has it with an MCP bridge) (+7 more)

### Community 65 - "Sound Effect Assets"
Cohesion: 0.22
Nodes (9): file, kilobytes, seconds, file, kilobytes, seconds, soundEffects, click (+1 more)

### Community 66 - "CharacterKind"
Cohesion: 0.09
Nodes (8): AtelierActions, AtelierRoom, ClothingItem, Display, CollectionRoom, CharacterKind, Options, Wardrobe

### Community 67 - "Custom HTTP Headers"
Cohesion: 0.25
Nodes (7): applications, appRoot, customHeaders, headers, pattern, key, value

### Community 68 - "Sharp Layer Package"
Cohesion: 0.33
Nodes (6): dependencies, sharp@^0.33.5, description, sharp, name, private

### Community 69 - "isHallOwner"
Cohesion: 0.21
Nodes (11): dynamic, HomePage(), dynamic, RoomPage(), StudioLayout(), COPY, HomeSignIn(), RoomNoticeProps (+3 more)

### Community 70 - "hall/room.ts"
Cohesion: 0.06
Nodes (43): earn(), getWalletSnapshot(), subscribeWallet(), AtelierArt, createBackdrop(), GALLERY_DOOR, loadGalleryDoor(), loadGalleryPillar() (+35 more)

### Community 71 - "AssetImage"
Cohesion: 0.10
Nodes (32): BoardScreen(), BoardScreenProps, ComposeScreen(), ComposeScreenProps, blankDraft(), GuestBoard(), GuestBoardProps, View (+24 more)

### Community 72 - "Conn"
Cohesion: 0.31
Nodes (4): connectWebSocket(), SocketHandlers, Conn, message()

### Community 73 - "core/src/index.ts"
Cohesion: 0.11
Nodes (36): PondBoardMe, PondBoardRow, PondFeedItem, Rep, BountyCatchRow, ONCE, PondBaitResult, PondBountiesView (+28 more)

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
Cohesion: 0.15
Nodes (16): createPresence(), drop(), heartbeat(), maybeSend(), onPageHide(), receive(), scheduleRetry(), send() (+8 more)

### Community 81 - "members"
Cohesion: 0.12
Nodes (25): coin_claims, coin_claims_daily, wallet_bait, wallet_items, wallets, member_sessions, member_sessions_member, member_slots (+17 more)

### Community 82 - "Frame Window Asset"
Cohesion: 0.50
Nodes (4): frame, size, window, windowAspect

### Community 83 - ".webSocketMessage"
Cohesion: 0.40
Nodes (4): attachmentOf(), roomFull(), Room, sendTo()

### Community 84 - "presence/package.json"
Cohesion: 0.14
Nodes (16): dependencies, @tiny/core@*, devDependencies, @cloudflare/workers-types@5.20261016.1, wrangler@4.151.1, @tiny/core, name, private (+8 more)

### Community 85 - "SoundProvider.tsx"
Cohesion: 0.16
Nodes (13): SoundContext, SoundProvider(), EFFECTS, EffectSpec, FOOTSTEPS, SoundEffects, useSoundEffects(), gestured() (+5 more)

### Community 86 - "Asset pipeline: fast loading without losing sharpness"
Cohesion: 0.22
Nodes (8): Asset pipeline: fast loading without losing sharpness, Character rigs and the Costume Atelier, Completed, Ground rules, Phase 1: fingerprinted files at 2x and 3x, Phase 2: texture atlases for the hall sprites, Phase 3: KTX2 (Basis Universal), built and switched off, Phase 4: ThumbHash placeholders for paintings

### Community 87 - "Guest Board SQL Schema"
Cohesion: 0.67
Nodes (3): guest_notes, guest_notes_visible, rate_limits

### Community 88 - "Landscape Frame Asset"
Cohesion: 0.67
Nodes (3): frameLandscape, size, window

### Community 89 - "nearby.ts"
Cohesion: 0.18
Nodes (5): Nearby, NearbyReach, RoomSpan, reach, strip

### Community 93 - "json"
Cohesion: 0.13
Nodes (41): POST(), POST(), POST(), PER_MEMBER, PUT(), PER_MEMBER, POST(), catchIdOf() (+33 more)

### Community 94 - "db-tests/pond.test.ts"
Cohesion: 0.09
Nodes (29): CatchExtra, COLUMNS, insertCatch(), member(), namedMember(), randomId(), StatePatch, compare() (+21 more)

### Community 95 - "pond/room.ts"
Cohesion: 0.10
Nodes (25): FrameShape, depthAtLift(), FAR_LIFT, FAR_SCALE, liftAt(), pathHalfWidth(), pathX(), PondPath (+17 more)

### Community 96 - "ticket/route.ts"
Cohesion: 0.08
Nodes (48): announceNameChange(), useVisitorName(), VisitorName, Code, How it plays, Other visitors, 3.2 Chosen names (members), Privacy (+40 more)

### Community 104 - "createStage"
Cohesion: 0.22
Nodes (14): initialize(), aim(), drawFrame(), handleClick(), handlePointerDown(), handlePointerMove(), handlePointerUp(), prefetchNearDoors() (+6 more)

### Community 105 - "FishingView.tsx"
Cohesion: 0.11
Nodes (17): CONFETTI_COLORS, ConfettiPiece, makeConfetti(), RevealCard(), RevealCardProps, TIER_MS, TIER_SFX, useCountUp() (+9 more)

### Community 106 - "ticket.ts"
Cohesion: 0.14
Nodes (18): fetch(), Env, parseRoom(), decoder, encoder, fromBase64Url(), HmacKey, isOwn() (+10 more)

### Community 107 - "createMinimap"
Cohesion: 0.36
Nodes (9): place(), createMinimap(), draw(), drawRoom(), floors(), follow(), sketchOf(), panTo() (+1 more)

### Community 108 - "currentMember"
Cohesion: 0.16
Nodes (18): GET(), GET(), PER_MEMBER, BOARDS, GET(), oneOf(), PER_VISITOR, PERIODS (+10 more)

### Community 110 - "graftCostume"
Cohesion: 0.27
Nodes (14): canvasFit(), compose(), graftCostume(), copyAccessor(), copyMaterial(), copyMesh(), copyTexture(), copyView() (+6 more)

### Community 111 - "FishingView.tsx"
Cohesion: 0.17
Nodes (22): PondGameProps, PondGame(), buyPondBait(), CastOptions, castPond(), chainPondBait(), errorOf(), fetchPondState() (+14 more)

### Community 112 - "worker/tsconfig.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 113 - "core/tsconfig.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 114 - "import-hall-assets.mjs"
Cohesion: 0.08
Nodes (17): socket(), BASEBOARD, CURTAIN, drop, EXPECTED, file(), manifest, manifestPath (+9 more)

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
Nodes (13): isItem(), isName(), isPid(), isSeq(), MAX_INSTANCE, MAX_MESSAGE_BYTES, parseClientMessage(), parseLook() (+5 more)

### Community 119 - "Costume gallery doorway"
Cohesion: 0.50
Nodes (3): Costume gallery doorway, Curtain colour edit, Prompt

### Community 120 - "pond-api.ts"
Cohesion: 0.17
Nodes (19): fetchPondLeaderboard(), PondBoardId, PondBoardPeriod, PondBoardRow, PondBounty, PondBountyClaim, PondDexCell, PondExchangeResult (+11 more)

### Community 121 - "Fishing forest: painted asset pass"
Cohesion: 0.10
Nodes (18): Assets, Bruce's collection refresh (2026-11-08), Fishing forest illustrations, Made by hand (not touched by the script), Main hall v2 (2026-11-10), Monets Lily Pond (2026-11-08), 1. Forest doorway, 2. Woodland noticeboard (+10 more)

### Community 124 - "The Costume Atelier"
Cohesion: 0.13
Nodes (14): Adding a character, Adding a costume, Art not supplied as files, Bruce's Chronicles, Checked against the mocks (2026-11-07), Code, Costume fit review, Fitting clothes to other characters (+6 more)

### Community 125 - "Medium"
Cohesion: 0.25
Nodes (8): 10. Long names run off the name sign, 11. The rooms API skips the stale-tab member check, 12. The bunny is dragged along while you pan in Decorate, 6. Failed saves are nearly invisible, and nothing retries, 7. Two tabs editing the same room overwrite each other, 8. The drawer's card row can't be scrolled on touch screens, 9. Decorating can't be done with the keyboard, Medium

### Community 126 - "rig.ts"
Cohesion: 0.16
Nodes (21): canvasToModel(), disposeRigLayer(), Frame, layerTemplates, loadRig(), dispose(), poseJump(), rotateInPlane() (+13 more)

### Community 127 - "Curating the paintings (2026-11-07)"
Cohesion: 0.14
Nodes (13): 1. The registry and the table, 2. The studio's Location picker, 3. The rooms draw what is placed, 4. Credits, 5. Retiring self-serve artists, Building it, Curating the paintings (2026-11-07), Decided (+5 more)

### Community 128 - "domain/guestboard.ts"
Cohesion: 0.15
Nodes (16): GET(), decodeCursor(), encodeCursor(), GuestNoteInput, GuestNoteRejected, listGuestNotes(), PER_VISITOR, toDto() (+8 more)

### Community 129 - "presence/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, types, exclude, extends, include, ../../tsconfig.base.json

### Community 130 - "Low"
Cohesion: 0.25
Nodes (8): 13. Pages that redirect or don't exist answer 200, 14. Error codes reveal which room slugs exist, 15. The name sign slides under the top-right buttons in Decorate, 16. Level-up celebrations can be farmed, 17. No hint of where things are after panning away, 18. Too many items is only discovered by the server, 19. Development-only: page payloads include the full room row, Low

### Community 131 - "tsconfig.test.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 132 - "app/layout.tsx"
Cohesion: 0.17
Nodes (11): bethEllen, inspiratiq, metadata, notoSans, RootLayout(), sniglet, viewport, ServiceWorker() (+3 more)

### Community 133 - "messages.ts"
Cohesion: 0.31
Nodes (7): checkMessage(), INVISIBLE, MESSAGE_MAX, MessageCheck, normalizeMessage(), hasProfanity(), matcher

### Community 134 - "lib/presence.ts"
Cohesion: 0.13
Nodes (8): Entry, INTERPOLATION_DELAY_MS, PEER_TIMEOUT_MS, PeerTable, positionAt(), Sample, look, Peer

### Community 135 - "dependencies"
Cohesion: 0.17
Nodes (12): dependencies, @aws-sdk/client-s3@^3.1121.0, @aws-sdk/s3-request-presigner@^3.1121.0, bcryptjs@^2.4.3, obscenity@^0.4.6, sharp@^0.33.5, thumbhash@^0.1.1, sharp (+4 more)

### Community 136 - "exports"
Cohesion: 0.15
Nodes (13): exports, ./brand, ./bugs, ./economy, ./guestboard, ./presence, ./presence/messages, ./presence/wire (+5 more)

### Community 137 - "stage.ts"
Cohesion: 0.04
Nodes (39): coverFloorTransition(), CameraRig, Look, createPixelRatioGovernor(), PIXEL_RATIO_STEPS, createRoomPassage(), fixture(), Pose (+31 more)

### Community 138 - "three"
Cohesion: 0.08
Nodes (37): Assets, Scenery, CUTS, disposeBoards(), Mark, plane(), ROPE_CUTS, ropeSlices() (+29 more)

### Community 139 - "epoch.ts"
Cohesion: 0.18
Nodes (18): GET(), intParam(), GET(), sketchPool, unavailable(), Where things stand, currentEpoch(), ensureEpoch() (+10 more)

### Community 140 - "lib/presence.ts"
Cohesion: 0.08
Nodes (19): PresencePreviewPage(), PresencePreview(), RemoteVisitor, Connect, fetchTicket, HEARTBEAT_MS, HIDDEN_LIMIT_MS, Presence (+11 more)

### Community 141 - "sketchguess/lib/api.ts"
Cohesion: 0.23
Nodes (13): sameOriginUrl(), PreparedGame, decodeImage(), fetchBitmap(), fetchRound(), guarded(), LoadedRound, loadInk() (+5 more)

### Community 142 - "visits.ts"
Cohesion: 0.16
Nodes (19): state(), flush(), visibleMs(), VisitState, count(), currentSalts(), DEVICES, loadSalts() (+11 more)

### Community 143 - "personal/room.ts"
Cohesion: 0.13
Nodes (13): Placards, placeLabel(), toScreen(), writeStyle(), cozyLevel, cozyWorth(), createPersonalRoom(), showLevel() (+5 more)

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
Nodes (30): CatchWagerView, debugSpecies(), debugVariant(), GuestRoll, guestTreasure(), rollGuest(), BAIT_BY_ID, catchPearls() (+22 more)

### Community 149 - "Personal room: stress-test issues"
Cohesion: 0.29
Nodes (5): Checked and fine, Not covered by this pass, Personal room: stress-test issues, Status (2026-11-06), Test data left in the local database

### Community 150 - "Local end-to-end stress test — 2026-11-06"
Cohesion: 0.29
Nodes (7): Environment and coverage, Follow-up coverage, Issue index, Local end-to-end stress test — 2026-11-06, Measured load, Passing checks and interpretation limits, Test data and cleanup

### Community 151 - "pond-state.ts"
Cohesion: 0.19
Nodes (16): PondStateView, PondTier, ensurePondStateStarted(), getPondStateSnapshot(), GUEST, listeners, LOADING, PondStateSnapshot (+8 more)

### Community 153 - "Storage"
Cohesion: 0.09
Nodes (8): renderPieceFrame(), renderPieceSketch(), S3Storage, S3StorageOptions, pieceFrameKey(), pieceSketchKey(), Storage, @aws-sdk/client-s3

### Community 154 - "GameDesktop.tsx"
Cohesion: 0.33
Nodes (7): loadGameDesktop(), GameDesktop(), GameDesktopProps, MinigameFrame(), Minigame, MinigameId, MINIGAMES

### Community 155 - "transaction"
Cohesion: 0.15
Nodes (24): hangPiece(), movePiece(), unhangPiece(), baitOf(), bountyCatches(), bountyViews(), buyPondBait(), chainPondBait() (+16 more)

### Community 156 - "next"
Cohesion: 0.10
Nodes (26): config, SECURITY_HEADERS, BugReportsPage(), dateFormat, dynamic, summary(), dateFormat, dynamic (+18 more)

### Community 157 - "Walkthrough.tsx"
Cohesion: 0.16
Nodes (18): MoreArrow(), NavArrow(), Props, SLIDE, Walkthrough(), XIcon(), decodedFrames, frameFor() (+10 more)

### Community 158 - "createPondRoom"
Cohesion: 0.32
Nodes (13): createPondRoom(), approach(), busy(), finishWalk(), goTo(), leave(), move(), nearest() (+5 more)

### Community 159 - "createPlacementLayer"
Cohesion: 0.18
Nodes (8): aspectOf(), createPlacementLayer(), drawOutline(), dropHelper(), sizeOf(), PlacementTheme, Phase 5: themes, zones and arrangements, ThemeSpec

### Community 160 - "High"
Cohesion: 0.33
Nodes (6): 1. Items placed against a zone edge fail to save, and the whole draft reverts, 2. One owned item can be placed many times, 3. Any save rejection throws away all unsaved work, 4. Changes made just before leaving are lost, 5. Fish trophies can be claimed without playing, High

### Community 161 - "domain/sketch.ts"
Cohesion: 0.13
Nodes (17): planSketchRound(), SKETCH_CHOICES, SketchCandidate, SketchRoundPlan, pool, renderSketch(), SKETCH_COLOR_WIDTH, SKETCH_DETAIL_WIDTH (+9 more)

### Community 162 - "features/economy/index.ts"
Cohesion: 0.17
Nodes (17): serverSnapshot, useEarnEvents(), buildClaim(), BuiltClaim, EarnDetail, EarnSource, GameSource, newRunId() (+9 more)

### Community 163 - "painting-open"
Cohesion: 0.50
Nodes (4): file, kilobytes, seconds, painting-open

### Community 165 - "Multiplayer ("other visitors") — plan v2 (Cloudflare)"
Cohesion: 0.15
Nodes (12): 0. Summary, 10. Decisions, 1. Product contract changes (approved 2026-10-31), 2. What already exists that this builds on, 3.1 Generated names (everyone has one), 3. Names, 5.1 Emotes (v1), 5. Protocol (`packages/core/src/presence/protocol.ts`) (+4 more)

### Community 167 - "member-route.ts"
Cohesion: 0.24
Nodes (12): roomEditor, PER_EDITOR, PUT(), versionOf(), PER_EDITOR, POST(), PER_MEMBER, POST() (+4 more)

### Community 168 - "audience.ts"
Cohesion: 0.11
Nodes (21): ArtistPage(), dynamic, generateMetadata(), GET(), GET(), FollowForm(), BRAND, getArtistPage() (+13 more)

### Community 169 - "icon-basket"
Cohesion: 0.67
Nodes (3): icon-basket, file, vector

### Community 170 - "reveal.ts"
Cohesion: 0.17
Nodes (9): PlaceInfo, InkMap, planGame(), ROUND_SPREAD, createReveal(), compose(), PENCIL, SketchReveal (+1 more)

### Community 171 - "next"
Cohesion: 0.24
Nodes (11): dynamic, Hall(), MuseumPage(), CurrentlyShowing(), dynamic, GUIDELINES, LandingPage(), EMPTY (+3 more)

### Community 172 - "config.ts"
Cohesion: 0.05
Nodes (30): Backdrop, Attachment, Carried, CarriedState, createCarried(), Character, Perch, Pose (+22 more)

### Community 174 - "lib/slots/index.ts"
Cohesion: 0.09
Nodes (11): Probe(), StoredSlot, defaultEnv(), defaultStore(), EventTargetLike, MemberInfo, SlotHandle, useMember (+3 more)

### Community 176 - "carry.test.ts"
Cohesion: 0.22
Nodes (13): CARRY_CAP, carryAdd(), CarryEntry, carryPrune(), carryRemove(), chunk(), ClaimRequest, tzOffsetNow() (+5 more)

### Community 177 - "ticket/route.ts"
Cohesion: 0.21
Nodes (12): GET(), PER_MEMBER, PUT(), GET(), PER_IP, POST(), presenceUrl(), memberFromRequest() (+4 more)

### Community 179 - "wallet/body.ts"
Cohesion: 0.23
Nodes (12): PER_MEMBER, POST(), baitIdOf(), integerOffset(), isRecord(), itemIdOf(), MAX_CLAIM_BATCH, ParsedWalletClaim (+4 more)

### Community 180 - "atelier.ts"
Cohesion: 0.15
Nodes (15): MuseumLayout(), CoinToast(), Toast, Purse(), Stamp(), WalletProvider(), useWallet(), STAMP_SVG (+7 more)

### Community 182 - "hit.ts"
Cohesion: 0.17
Nodes (12): CoinWall, createHiddenCoin(), Spot, AlphaMap, alphaMapFor(), alphaMaps, buildAlphaMap(), isPaintedAt() (+4 more)

### Community 183 - "run.ts"
Cohesion: 0.17
Nodes (9): admin, childEnv, client, database, fresh, migrations, target, pg@^8.13.1 (+1 more)

### Community 184 - "tab-turn.ts"
Cohesion: 0.16
Nodes (5): createTabTurn(), TabTurn, tab(), TurnEnv, TurnMessage

### Community 185 - "outbox.test.ts"
Cohesion: 0.27
Nodes (12): OUTBOX_CAP, outboxAdd(), outboxDue(), OutboxEntry, outboxFail(), outboxRemove(), RETRY_BASE_MS, RETRY_MAX_MS (+4 more)

### Community 186 - "Angler.tsx"
Cohesion: 0.19
Nodes (12): createCharacter(), contextLost(), loadKind(), loseRig(), setFrame(), createRigState(), RigAttachmentPose, FITS (+4 more)

### Community 187 - "media/storage.ts"
Cohesion: 0.16
Nodes (20): CONTENT_TYPES, GET(), PUT(), deletePiece(), GalleryPiece, ACCEPTED, createAssetFromUpload(), MAX_UPLOAD_BYTES (+12 more)

### Community 189 - "src/types.ts"
Cohesion: 0.23
Nodes (11): listPieces(), pieceImageUrl(), PieceRow, toPieceDto(), pickDerivative(), ArtistPageDto, ArtistStatus, AssetStatus (+3 more)

### Community 190 - "themes.ts"
Cohesion: 0.15
Nodes (9): ownsAll, ownsNone, COZY_FLOOR_PROPS, COZY_TROPHIES, COZY_WALL_PROPS, PlacementKind, PropSpec, THEMES (+1 more)

### Community 191 - "useSoundEffects.ts"
Cohesion: 0.17
Nodes (18): BackgroundMusic, clampVolume(), isDocumentHidden(), Options, useBackgroundMusic(), VISIBILITY_EVENTS, AudioContextCtor, decodeClip() (+10 more)

### Community 192 - "Confirmed issues"
Cohesion: 0.11
Nodes (18): Confirmed issues, E2E-002 — Valid edge placement rejected through floating-point precision, E2E-003 — One owned prop can be placed multiple times, E2E-004 — Reload before autosave silently loses the latest placement, E2E-005 — Failed save and failed Done have no visible mobile explanation, E2E-006 — Restoring connectivity does not retry a failed draft save, E2E-007 — Keyboard activation cannot place drawer items, E2E-008 — Creating an account from My Room leaves the signed-in user on the sign-in prompt (+10 more)

### Community 193 - "Monets Lily Pond: exploration, UX and multiplayer QA"
Cohesion: 0.29
Nodes (6): Browser and interaction coverage, Changes made from the walkthrough, Monets Lily Pond: exploration, UX and multiplayer QA, Multiplayer and load, Practical limits, Regression checks and cleanup

### Community 194 - "createRemoteVisitors"
Cohesion: 0.21
Nodes (10): createRenderer(), createRigLayer(), createRemoteVisitors(), ensureLayer(), load(), placeOwn(), show(), showProp() (+2 more)

### Community 195 - "RigPreview.tsx"
Cohesion: 0.30
Nodes (9): RigPreviewPage(), NEXT, PROPS, RigPreview(), draw(), approach(), GROUNDED, rigFacing() (+1 more)

### Community 196 - "hang-tag.ts"
Cohesion: 0.17
Nodes (6): CARD, createHangTag(), HangTag, HangTagStyle, HOLE, KNOT

### Community 197 - "request"
Cohesion: 0.38
Nodes (12): buyPondBait(), claimPondBounty(), errorOf(), exchangePondPearls(), fetchPondBounties(), fetchPondDex(), fetchPondState(), isRecord() (+4 more)

### Community 199 - "currentArtist"
Cohesion: 0.25
Nodes (8): GET(), PaintingRow, POST(), UPLOADS_PER_ARTIST, POST(), UPLOADS_PER_ARTIST, currentArtist(), isHttpUrl()

### Community 200 - "visits/page.tsx"
Cohesion: 0.25
Nodes (10): amount(), duration(), dynamic, LANDMARKS, PAGES, RANGES, share(), VisitsPage() (+2 more)

### Community 201 - "icons.tsx"
Cohesion: 0.24
Nodes (9): BaitTray(), BaitTrayProps, GuestRollOptions, BAIT, BaitId, GLYPHS, PearlIcon(), POND_CRIMSON (+1 more)

### Community 203 - "confirm/page.tsx"
Cohesion: 0.33
Nodes (7): ConfirmFollow(), dynamic, dynamic, Unsubscribe(), FollowNotice(), confirmFollow(), unsubscribe()

### Community 204 - "AccountSheet"
Cohesion: 0.29
Nodes (9): AccountSheet(), continueAnyway(), doSignOut(), runDelete(), runName(), submit(), submitDelete(), submitName() (+1 more)

### Community 205 - "BountyPanel.tsx"
Cohesion: 0.36
Nodes (8): PondBounties, formatCountdown(), nextUtcMidnight(), utcDayLabel(), useCountdown(), useNow(), BountyPanel(), dayLabel()

### Community 207 - "CrowdPreview.tsx"
Cohesion: 0.33
Nodes (7): CrowdPreviewPage(), CrowdPreview(), draw(), KINDS, Stats, Window, clearRigLayer()

### Community 208 - "formatInteger"
Cohesion: 0.50
Nodes (9): refreshWalletNow(), formatInteger(), setPondState(), claim(), BaitShop(), buy(), Exchange(), exchange() (+1 more)

### Community 209 - "Rig"
Cohesion: 0.25
Nodes (3): RigState, Rig, Shown

### Community 210 - "shopkeeper.ts"
Cohesion: 0.25
Nodes (7): RigPiece, COATS, createShopkeeper(), GREETINGS, OUTFIT, recolourFur(), SHOPKEEPER_NAME

### Community 211 - "VitalsReporter.tsx"
Cohesion: 0.31
Nodes (7): firstPainting(), flush(), Metric, queue, REPORTED, FIRST_PAINTING_MARK, MUSEUM_START_MARK

### Community 212 - "4. Transport: Cloudflare Durable Objects"
Cohesion: 0.25
Nodes (8): 4. Transport: Cloudflare Durable Objects, Decision (2026-10-31), Deploying, Identity cannot be forged, Local development and tests, Rooms and capacity, Shape of `apps/presence` (about 200 lines), main()

### Community 213 - "vitals.ts"
Cohesion: 0.36
Nodes (6): DEVICES, METRICS, normalizePage(), parseVitalsReport(), RATINGS, VitalRow

### Community 214 - "createStage"
Cohesion: 0.52
Nodes (7): createNearby(), createStage(), closeEntry(), enter(), isCurrent(), isQuiet(), open()

### Community 215 - "RoomSound"
Cohesion: 0.33
Nodes (4): StageOptions, RoomSound, SoundState, EffectName

### Community 216 - "share.ts"
Cohesion: 0.33
Nodes (5): ShareOutcome, shareResult(), ShareSummary, shareText(), base

### Community 217 - "db.ts"
Cohesion: 0.43
Nodes (4): getPool(), poolConfig(), sslFor(), RDS_CA_BUNDLE

### Community 219 - "setCostumeVisibility"
Cohesion: 0.50
Nodes (3): Layer, setCostumeVisibility(), setCostume()

## Knowledge Gaps
- **5 isolated node(s):** `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1349 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **27 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `AccountSheet.tsx` to `gallery/page.tsx`, `SketchGuess.tsx`, `app/layout.tsx`, `machine.ts`, `PondRoom.tsx`, `lib/presence.ts`, `Test Fakes and Helpers`, `actions.ts`, `join-room.ts`, `pond-state.ts`, `PersonalRoom.tsx`, `Museum.tsx`, `Walkthrough.tsx`, `Web Package Dependencies`, `features/economy/index.ts`, `risk.ts`, `audience.ts`, `bug-reports.ts`, `PondTicker.tsx`, `next`, `useSound`, `lib/slots/index.ts`, `Water.tsx`, `atelier.ts`, `pond-format.ts`, `Angler.tsx`, `logic.ts`, `useSoundEffects.ts`, `RigPreview.tsx`, `isHallOwner`, `AssetImage`, `icons.tsx`, `BountyPanel.tsx`, `CrowdPreview.tsx`, `VitalsReporter.tsx`, `SoundProvider.tsx`, `ticket/route.ts`, `FishingView.tsx`, `pond-api.ts`?**
  _High betweenness centrality (0.078) - this node is a cross-community bridge._
- **What connects `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json` to the rest of the system?**
  _5 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `walk.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11494252873563218 - nodes in this community are weakly interconnected._
- **Why does `three` connect `three` to `atelier.ts`, `hang-tag.ts`, `hall/room.ts`, `scene/assets.ts`, `stage.ts`, `config.ts`, `scene.ts`, `cozy.ts`, `pond/art.ts`, `join-room.ts`, `prepare-models.mjs`, `hit.ts`, `rig.ts`, `ambience.ts`, `Web Package Dependencies`, `pond/room.ts`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Should `SketchGuess.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11428571428571428 - nodes in this community are weakly interconnected._
- **Why does `pg` connect `run.ts` to `core/src/index.ts`, `db.ts`, `wallet.ts`, `core/package.json`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Should `rooms.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06453028972783142 - nodes in this community are weakly interconnected._