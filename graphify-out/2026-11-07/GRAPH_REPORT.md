# Graph Report - tiny-museum  (2026-11-07)

## Corpus Check
- 473 files · ~244,246 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 78 file(s) not represented in the graph (top: .avif 39, .glb 30, .css 4)

## Summary
- 4067 nodes · 10529 edges · 201 communities (174 shown, 27 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 183 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1c49e8cd`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- personal/room.ts
- currentMember
- SketchGuess.tsx
- readJsonBody
- epoch.ts
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
- GuestBoard.tsx
- room-events.ts
- createAtelierRoom
- ref_node_assert
- amplify/package.json
- atelier.ts
- prepare-models.mjs
- Traversal
- core/package.json
- lib/assets.ts
- members.ts
- personal/room.ts
- Museum.tsx
- PersonalRoom.tsx
- core/src/index.ts
- Web Package Dependencies
- Gamifying Tiny Museum — genre direction & engagement research
- GameDesktop.tsx
- slots/store.ts
- risk.ts
- amplify/tsconfig.json
- 5. Customization menu — what other people are doing
- wallet.ts
- rules.ts
- Web TSConfig
- Root Package Manifest
- Confirmed issues
- pond-api.ts
- wire.ts
- Base TSConfig
- Amplify Build Spec
- RigPreview.tsx
- Multiplayer ("other visitors") — plan v2 (Cloudflare)
- FakeServer
- handlers.ts
- Water.tsx
- Worker Package Manifest
- Public Asset Manifest
- setPondState
- hitForVisitor
- compose-atelier.mjs
- logic.ts
- pond-format.ts
- CharacterKind
- economy/store.ts
- domain/sketch.ts
- room.ts
- minimap.ts
- query
- Handoff: move the Tiny Museum bunny from sprite frames to a rig
- Sound Effect Assets
- DecorDrawer.tsx
- Custom HTTP Headers
- Sharp Layer Package
- tab-turn.ts
- ticket/route.ts
- queryOne
- Context
- actions.ts
- Visits SQL Schema
- Bunny Walk Sprites
- Room Mockup Settings
- Service Worker Caching
- HallCallbacks
- overlay.ts
- createPresence
- members
- Frame Window Asset
- react
- presence/package.json
- sketchguess/lib/api.ts
- Asset pipeline: fast loading without losing sharpness
- Guest Board SQL Schema
- Landscape Frame Asset
- .webSocketMessage
- Bug Reports SQL Schema
- Vitals SQL Schema
- wallet/body.ts
- db.ts
- rooms/art.ts
- AccountSheet.tsx
- Run-Once Schema
- createStage
- createPlacementLayer
- ticket.ts
- plan.ts
- CoinToast.tsx
- Conn
- atelier-layout.ts
- pondgame/lib/api.ts
- worker/tsconfig.json
- core/tsconfig.json
- Tiny Museum
- How to Design for Failures — ByteByteGo Newsletter
- Worker instructions — DSH headless agents
- Backend
- protocol.ts
- Costume gallery doorway
- db-tests/pond.test.ts
- Fishing forest: painted asset pass
- audio/README.md
- .claude/CLAUDE.md
- earn
- useSound
- rig.ts
- Curating the paintings (2026-11-07)
- BountyPanel.tsx
- presence/tsconfig.json
- graftCostume
- tsconfig.test.json
- app/layout.tsx
- a/[slug]/page.tsx
- 4. Transport: Cloudflare Durable Objects
- perf.ts
- Low
- rooms/types.ts
- createHallRoom
- The Costume Atelier
- Cafe
- bug-reports.ts
- visits.ts
- media/storage.ts
- The Moonlit Pond — design
- Pond rework
- collage.ts
- Orchestration contract — you plan, DSH workers execute
- tables.ts
- rooms.ts
- hang-tag.ts
- pond-state.ts
- PondTicker.tsx
- domain/guestboard.ts
- Item
- xdog.ts
- createRemoteVisitors
- Walkthrough.tsx
- (hall)/page.tsx
- confirm/page.tsx
- Local end-to-end stress test — 2026-11-06
- ColorRecall.tsx
- Placement
- painting-open
- lib/presence.ts
- RevealCard.tsx
- visits/page.tsx
- SoundProvider.tsx
- Lobby
- icon-basket
- hit
- rooms/types.ts
- rooms/art.ts
- bunny-left
- Pedestal
- bunny-right
- CrowdPreview.tsx
- Sitting
- icon-home
- performance/page.tsx
- wardrobe.ts
- ticket
- messages.ts
- createDecorController
- usePondState
- icons.tsx
- vitals.ts
- media/storage.ts
- FilesystemStorage
- VisitTracker.tsx
- member-route.ts
- visit/route.ts
- DoorRef
- Rig
- Other visitors
- createPondRoom
- roomKit
- createCharacter
- Backdrop
- AtelierActions
- next.config.ts

## God Nodes (most connected - your core abstractions)
1. `react` - 73 edges
2. `json()` - 69 edges
3. `query()` - 68 edges
4. `hit()` - 55 edges
5. `limited()` - 49 edges
6. `next` - 44 edges
7. `three` - 41 edges
8. `SyncStore` - 41 edges
9. `Traversal` - 40 edges
10. `PersonalRoom()` - 37 edges

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

## Communities (201 total, 27 thin omitted)

### Community 0 - "personal/room.ts"
Cohesion: 0.21
Nodes (9): cozyLevel, cozyWorth(), createPersonalRoom(), showLevel(), DOOR_SIGN, NAME_SIGN, PersonalRoomOptions, cozyTheme (+1 more)

### Community 1 - "currentMember"
Cohesion: 0.15
Nodes (19): GET(), GET(), PER_MEMBER, BOARDS, GET(), oneOf(), PER_VISITOR, PERIODS (+11 more)

### Community 2 - "SketchGuess.tsx"
Cohesion: 0.08
Nodes (37): BunnyArtist(), BunnyMood, Pencil(), POSES, bestKeyFor(), BURST, clueUrl(), openingPlan() (+29 more)

### Community 3 - "readJsonBody"
Cohesion: 0.21
Nodes (13): roomEditor, PER_EDITOR, PUT(), versionOf(), PER_EDITOR, POST(), PER_MEMBER, POST() (+5 more)

### Community 4 - "epoch.ts"
Cohesion: 0.22
Nodes (15): GET(), intParam(), GET(), sketchPool, unavailable(), currentEpoch(), ensureEpoch(), epochById() (+7 more)

### Community 5 - "round.ts"
Cohesion: 0.16
Nodes (26): deltaE(), GAMUT_EPSILON, hexToOklab(), inGamut(), linearRgbToOklab(), linearToSrgb(), Oklab, oklabToLinearRgb() (+18 more)

### Community 6 - "floor.ts"
Cohesion: 0.13
Nodes (36): clone(), closestOnSegment(), contains(), cross(), crossVec(), depthAtY(), depthBounds(), depthT() (+28 more)

### Community 7 - "Core Asset Manifest"
Cohesion: 0.05
Nodes (41): artworks, audio, file, megabytes, seconds, sourceName, startedAt, bunny (+33 more)

### Community 8 - "scene/assets.ts"
Cohesion: 0.10
Nodes (36): AssetManifest, assetUrl(), blankImage(), CAFE_CAT_FRAMES, CompressedLoader, ENTRANCE_FILES, EntranceName, HELM_PEDESTAL_FILE (+28 more)

### Community 9 - "SyncStore"
Cohesion: 0.18
Nodes (6): encodeStored(), parseStored(), readStored(), writeStored(), SyncStore, upgrade()

### Community 10 - "machine.ts"
Cohesion: 0.12
Nodes (40): CAST_ERRORS, FishingView(), isTyping(), LOST, Toast, vibrate(), ReelMeter(), debugTokens() (+32 more)

### Community 11 - "PondRoom.tsx"
Cohesion: 0.08
Nodes (28): Loading(), metadata, PondPage(), PondGame(), PondLoading(), BOARD_TABS, PondOverlayKind, PondPanels() (+20 more)

### Community 12 - "Test Fakes and Helpers"
Cohesion: 0.12
Nodes (27): deferredFetch(), deviceSlot, FakeEvents, FakeStorage, fixture, fixtureB, fixtureRegistry, fixtureRegistryBoth (+19 more)

### Community 13 - "scene.ts"
Cohesion: 0.04
Nodes (34): MuseumProps, disposeDisplayTexture(), prefersAvif(), CoinWall, createHiddenCoin(), HiddenCoin, Spot, AlphaMap (+26 more)

### Community 14 - "cozy.ts"
Cohesion: 0.15
Nodes (21): ATELIER_PROPS, AtelierImage, canvasTexture(), CozyBackdrop, cozyPropImageUrl(), disposeCozyArt(), drawingOn(), FISH (+13 more)

### Community 15 - "GuestBoard.tsx"
Cohesion: 0.10
Nodes (30): BoardScreen(), BoardScreenProps, ComposeScreen(), ComposeScreenProps, blankDraft(), GuestBoard(), GuestBoardProps, View (+22 more)

### Community 16 - "room-events.ts"
Cohesion: 0.17
Nodes (28): ChatButton(), REFUSED, joinRoom(), Options, STANDING, emit(), getPeople(), isInRoom() (+20 more)

### Community 17 - "createAtelierRoom"
Cohesion: 0.47
Nodes (13): aspectOf(), createAtelierRoom(), buildCollection(), form(), buildEntrance(), buildRoom(), picture(), place() (+5 more)

### Community 18 - "ref_node_assert"
Cohesion: 0.10
Nodes (31): STAMP_SVG, valid, defineSlot(), docBytes(), SLOTS, byAtThenKey(), encoded(), latest (+23 more)

### Community 19 - "amplify/package.json"
Cohesion: 0.08
Nodes (26): amplifyDir, backend, everyMinutes, mediaBucket, missing, repoRoot, REQUIRED, setting() (+18 more)

### Community 20 - "atelier.ts"
Cohesion: 0.10
Nodes (17): AtelierImage, BuiltRoom, Cardigan, CARDIGAN_NAMES, CHARACTER_NAMES, Control, refresh(), disposeAtelierArt() (+9 more)

### Community 21 - "prepare-models.mjs"
Cohesion: 0.14
Nodes (18): paintedCostume(), atelier, bunny, floralOutfits(), goldOutfits(), HEADPIECES, image(), manifest (+10 more)

### Community 22 - "Traversal"
Cohesion: 0.09
Nodes (10): coverFloorTransition(), JumpPose, createRoomPassage(), fixture(), clamp(), JUMP_KEYS, Traversal, DecorLive (+2 more)

### Community 23 - "core/package.json"
Cohesion: 0.06
Nodes (41): dependencies, @aws-sdk/client-s3@^3.1121.0, @aws-sdk/s3-request-presigner@^3.1121.0, bcryptjs@^2.4.3, obscenity@^0.4.6, pg@^8.13.1, sharp@^0.33.5, thumbhash@^0.1.1 (+33 more)

### Community 24 - "lib/assets.ts"
Cohesion: 0.15
Nodes (19): Loading(), DENSITY_MEDIA, HallPreload(), HallSkeleton(), loadCompressed(), loadSheets(), assetCssVariables(), assetEntry (+11 more)

### Community 25 - "members.ts"
Cohesion: 0.11
Nodes (39): Code, 3.2 Chosen names (members), registry, started(), hashPassword(), verifyPassword(), canonicalEmail(), changePassword() (+31 more)

### Community 27 - "Museum.tsx"
Cohesion: 0.14
Nodes (25): motion@^13.1.1, Loading(), PinnedNotes(), AtelierLoading(), CoinFound, ColorRecall, GameDesktop, GuestBoard (+17 more)

### Community 28 - "PersonalRoom.tsx"
Cohesion: 0.13
Nodes (25): errorReason(), overDrawer(), PersonalRoom(), canPlaceNew(), carryEnd(), carryMove(), onCardKey(), onCardPointerDown() (+17 more)

### Community 29 - "core/src/index.ts"
Cohesion: 0.04
Nodes (130): addBait(), baitOf(), compare(), DexRow, displayName(), FeedRow, getPondFeed(), getPondLeaderboard() (+122 more)

### Community 30 - "Web Package Dependencies"
Cohesion: 0.08
Nodes (32): dependencies, embla-carousel-react@^8.6.0, next@^15.0.3, react@^19.0.0, react-dom@^19.0.0, swr@^2.5.1, three@^0.169.0, thumbhash@^0.1.1 (+24 more)

### Community 31 - "Gamifying Tiny Museum — genre direction & engagement research"
Cohesion: 0.10
Nodes (19): 0.1 The core experience, 0.2 Systems that make gamification cheap to build, 0.3 Constraints that shape any recommendation, 0. What the game is today (the deep dive), 1.1 The landscape (seven candidates, with verdicts), 1.2 Recommendation: a **cozy gallery life-sim** — "the gallery you live in", 1.3 The five design pillars the genre implies, 1. Genre direction (+11 more)

### Community 32 - "GameDesktop.tsx"
Cohesion: 0.27
Nodes (8): loadGameDesktop(), GameDesktop(), GameDesktopProps, MinigameFrame(), MinigameFrameProps, Minigame, MinigameId, MINIGAMES

### Community 33 - "slots/store.ts"
Cohesion: 0.12
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
Nodes (45): grantPearls(), member(), now, piece(), randomId(), today, applyClaim(), baitCounts() (+37 more)

### Community 38 - "rules.ts"
Cohesion: 0.16
Nodes (17): localDay(), at(), EXCHANGE_DAILY_STAMPS, EXCHANGE_PEARLS_PER_STAMP, exchangeClaimKey(), GAME_DAILY_CAP, GameId, GAMES (+9 more)

### Community 39 - "Web TSConfig"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 40 - "Root Package Manifest"
Cohesion: 0.07
Nodes (35): description, devDependencies, concurrently@^9.1.0, esbuild@^0.24.0, ktx2-encoder@^0.6.0, maxrects-packer@^2.7.3, playwright@^1.63.0, @types/node@^22.9.0 (+27 more)

### Community 41 - "Confirmed issues"
Cohesion: 0.11
Nodes (18): Confirmed issues, E2E-002 — Valid edge placement rejected through floating-point precision, E2E-003 — One owned prop can be placed multiple times, E2E-004 — Reload before autosave silently loses the latest placement, E2E-005 — Failed save and failed Done have no visible mobile explanation, E2E-006 — Restoring connectivity does not retry a failed draft save, E2E-007 — Keyboard activation cannot place drawer items, E2E-008 — Creating an account from My Room leaves the signed-in user on the sign-in prompt (+10 more)

### Community 42 - "pond-api.ts"
Cohesion: 0.17
Nodes (20): fetchPondLeaderboard(), PondBoardId, PondBoardPeriod, PondBoardRow, PondBounty, PondBountyClaim, PondDexCell, PondExchangeResult (+12 more)

### Community 43 - "wire.ts"
Cohesion: 0.12
Nodes (11): Entry, INTERPOLATION_DELAY_MS, PEER_TIMEOUT_MS, PeerTable, positionAt(), RemoteVisitor, Sample, look (+3 more)

### Community 44 - "Base TSConfig"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, lib, module, moduleResolution (+9 more)

### Community 45 - "Amplify Build Spec"
Cohesion: 0.12
Nodes (16): applications, appRoot, backend, frontend, baseDirectory, files, phases, commands (+8 more)

### Community 46 - "RigPreview.tsx"
Cohesion: 0.24
Nodes (12): RigPreviewPage(), NEXT, PROPS, RigPreview(), draw(), approach(), createRigState(), GROUNDED (+4 more)

### Community 47 - "Multiplayer ("other visitors") — plan v2 (Cloudflare)"
Cohesion: 0.14
Nodes (13): ScreenChrome(), 0. Summary, 10. Decisions, 1. Product contract changes (approved 2026-10-31), 2. What already exists that this builds on, 3.1 Generated names (everyone has one), 3. Names, 5.1 Emotes (v1) (+5 more)

### Community 48 - "FakeServer"
Cohesion: 0.18
Nodes (3): FakeServer, SlotState, SlotDef

### Community 49 - "handlers.ts"
Cohesion: 0.13
Nodes (27): confirmedFollowers(), handleDerivatives(), handleNotifyFollowers(), handleRenderDisplay(), handleSealEpoch(), renderPieceFrame(), renderPieceSketch(), runJob() (+19 more)

### Community 50 - "Water.tsx"
Cohesion: 0.10
Nodes (27): AmbientShadow, buildRod(), bunnyBox(), easeOut(), LILY_STYLE, makeAmbient(), PAW_IN_SPRITE, pawPoint() (+19 more)

### Community 51 - "Worker Package Manifest"
Cohesion: 0.14
Nodes (14): dependencies, @tiny/core@*, exports, ./lambda, @tiny/core, main, name, private (+6 more)

### Community 52 - "Public Asset Manifest"
Cohesion: 0.12
Nodes (15): artworks, bunny, size, floor, size, fonts, icon-no-photos, size (+7 more)

### Community 53 - "setPondState"
Cohesion: 0.27
Nodes (16): refreshWalletNow(), buyPondBait(), claimPondBounty(), errorOf(), exchangePondPearls(), isRecord(), isStateView(), memberId() (+8 more)

### Community 54 - "hitForVisitor"
Cohesion: 0.15
Nodes (22): POST(), POST(), POST(), GLOBAL, PER_IP, POST(), GLOBAL, PER_IP (+14 more)

### Community 55 - "compose-atelier.mjs"
Cohesion: 0.14
Nodes (9): body, dressLayer, dressWidth, floralWidth, MANNEQUIN_CANVAS, mask, root, sourceSize (+1 more)

### Community 56 - "logic.ts"
Cohesion: 0.13
Nodes (20): loadHallArranger(), HallArranger(), HallArrangerProps, Painting, categoryOf(), currentHallOrder(), DrawerCategory, hallPlacements() (+12 more)

### Community 57 - "pond-format.ts"
Cohesion: 0.13
Nodes (27): fetchPondDex(), PondDex, EXCHANGE_DAILY_STAMPS, EXCHANGE_PEARLS_PER_STAMP, fishArt(), formatPercent(), formatShortSizeCm(), ODDS_BAIT (+19 more)

### Community 58 - "CharacterKind"
Cohesion: 0.14
Nodes (4): AtelierRoom, Display, CollectionRoom, CharacterKind

### Community 59 - "economy/store.ts"
Cohesion: 0.08
Nodes (56): CARRY_CAP, carryAdd(), CarryEntry, carryPrune(), carryRemove(), chunk(), BuiltClaim, ClaimRequest (+48 more)

### Community 60 - "domain/sketch.ts"
Cohesion: 0.11
Nodes (28): listPieces(), pieceImageUrl(), PieceRow, toPieceDto(), GalleryRow, planSketchRound(), SKETCH_CHOICES, SketchCandidate (+20 more)

### Community 61 - "room.ts"
Cohesion: 0.14
Nodes (26): admitted(), Attachment, farewell(), GHOST_MS, HELLO_TIMEOUT_MS, holdsOf(), MAX_WAITING_PER_IP, newAttachment() (+18 more)

### Community 62 - "minimap.ts"
Cohesion: 0.07
Nodes (34): place(), ATELIER_DOOR, createMinimap(), draw(), drawRoom(), floors(), follow(), sketchOf() (+26 more)

### Community 63 - "query"
Cohesion: 0.23
Nodes (15): loop(), shutdown(), sleep(), sweepStale(), DrainResult, handler(), repairFrames(), repairUnframed() (+7 more)

### Community 64 - "Handoff: move the Tiny Museum bunny from sprite frames to a rig"
Cohesion: 0.15
Nodes (11): 1. What is in this bundle, 2. How the game draws the bunny today (read from the repo, not run), 3. The rig, 5. Blender-side work still to do (needs Blender; the author has it with an MCP bridge), 6. Open questions for the author, Handoff: move the Tiny Museum bunny from sprite frames to a rig, Approved v4 bunny in the hall, Assets (+3 more)

### Community 65 - "Sound Effect Assets"
Cohesion: 0.22
Nodes (9): file, kilobytes, seconds, file, kilobytes, seconds, soundEffects, click (+1 more)

### Community 66 - "DecorDrawer.tsx"
Cohesion: 0.29
Nodes (3): DecorDrawer, DecorDrawerProps, propLabel()

### Community 67 - "Custom HTTP Headers"
Cohesion: 0.25
Nodes (7): applications, appRoot, customHeaders, headers, pattern, key, value

### Community 68 - "Sharp Layer Package"
Cohesion: 0.33
Nodes (6): dependencies, sharp@^0.33.5, description, sharp, name, private

### Community 69 - "tab-turn.ts"
Cohesion: 0.16
Nodes (5): createTabTurn(), TabTurn, tab(), TurnEnv, TurnMessage

### Community 70 - "ticket/route.ts"
Cohesion: 0.30
Nodes (9): PER_MEMBER, PUT(), PER_IP, POST(), presenceUrl(), memberName, exportWallet(), validSeed() (+1 more)

### Community 71 - "queryOne"
Cohesion: 0.14
Nodes (17): ALLOWED, POST(), GET(), AnalyticsSummary, createInquiry(), EventKind, follow(), recordEvent() (+9 more)

### Community 73 - "actions.ts"
Cohesion: 0.05
Nodes (95): AnalyticsPage(), dynamic, BugReportsPage(), dateFormat, dynamic, summary(), dynamic, GalleryPage() (+87 more)

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

### Community 79 - "overlay.ts"
Cohesion: 0.06
Nodes (49): Assets, Scenery, createBackdrop(), CUTS, disposeBoards(), Mark, plane(), ROPE_CUTS (+41 more)

### Community 80 - "createPresence"
Cohesion: 0.19
Nodes (13): createPresence(), drop(), heartbeat(), maybeSend(), onPageHide(), receive(), scheduleRetry(), send() (+5 more)

### Community 81 - "members"
Cohesion: 0.12
Nodes (25): coin_claims, coin_claims_daily, wallet_bait, wallet_items, wallets, member_sessions, member_sessions_member, member_slots (+17 more)

### Community 82 - "Frame Window Asset"
Cohesion: 0.50
Nodes (4): frame, size, window, windowAspect

### Community 83 - "react"
Cohesion: 0.19
Nodes (16): BugReportHost(), BugReportSheet, BugReportSheet(), send(), Status, collectContext(), inAppBrowser(), onOpenBugReport() (+8 more)

### Community 84 - "presence/package.json"
Cohesion: 0.14
Nodes (16): dependencies, @tiny/core@*, devDependencies, @cloudflare/workers-types@5.20261016.1, wrangler@4.151.1, @tiny/core, name, private (+8 more)

### Community 85 - "sketchguess/lib/api.ts"
Cohesion: 0.33
Nodes (10): PreparedGame, decodeImage(), fetchBitmap(), fetchRound(), guarded(), LoadedRound, loadInk(), loadRound() (+2 more)

### Community 86 - "Asset pipeline: fast loading without losing sharpness"
Cohesion: 0.22
Nodes (8): Asset pipeline: fast loading without losing sharpness, Character rigs and the Costume Atelier, Completed, Ground rules, Phase 1: fingerprinted files at 2x and 3x, Phase 2: texture atlases for the hall sprites, Phase 3: KTX2 (Basis Universal), built and switched off, Phase 4: ThumbHash placeholders for paintings

### Community 87 - "Guest Board SQL Schema"
Cohesion: 0.67
Nodes (3): guest_notes, guest_notes_visible, rate_limits

### Community 88 - "Landscape Frame Asset"
Cohesion: 0.67
Nodes (3): frameLandscape, size, window

### Community 89 - ".webSocketMessage"
Cohesion: 0.40
Nodes (4): attachmentOf(), roomFull(), Room, sendTo()

### Community 93 - "wallet/body.ts"
Cohesion: 0.23
Nodes (12): PER_MEMBER, POST(), baitIdOf(), integerOffset(), isRecord(), itemIdOf(), MAX_CLAIM_BATCH, ParsedWalletClaim (+4 more)

### Community 94 - "db.ts"
Cohesion: 0.31
Nodes (5): getPool(), poolConfig(), sslFor(), RateLimitResult, RDS_CA_BUNDLE

### Community 95 - "rooms/art.ts"
Cohesion: 0.10
Nodes (24): ArtByRoom, colorAt(), disposePondArt(), EDGE_BAND, EDGE_BANDS, EDGE_OVERLAP, edgeTexture(), imageOf() (+16 more)

### Community 96 - "AccountSheet.tsx"
Cohesion: 0.06
Nodes (34): PresencePreviewPage(), AccountHost(), AccountSheet, AccountSheet(), continueAnyway(), doSignOut(), runDelete(), runName() (+26 more)

### Community 104 - "createStage"
Cohesion: 0.06
Nodes (36): ArtCache, ArtCacheOptions, createArtCache(), drop(), expireLater(), hold(), HeldArt, LoadResult (+28 more)

### Community 105 - "createPlacementLayer"
Cohesion: 0.18
Nodes (8): aspectOf(), createPlacementLayer(), drawOutline(), dropHelper(), sizeOf(), PlacementTheme, Phase 5: themes, zones and arrangements, ThemeSpec

### Community 106 - "ticket.ts"
Cohesion: 0.14
Nodes (18): fetch(), Env, parseRoom(), decoder, encoder, fromBase64Url(), HmacKey, isOwn() (+10 more)

### Community 107 - "plan.ts"
Cohesion: 0.17
Nodes (9): PlaceInfo, InkMap, planGame(), ROUND_SPREAD, createReveal(), compose(), PENCIL, SketchReveal (+1 more)

### Community 108 - "CoinToast.tsx"
Cohesion: 0.12
Nodes (23): MuseumLayout(), CoinToast(), Toast, Purse(), Stamp(), WalletProvider(), serverSnapshot, useEarnEvents() (+15 more)

### Community 109 - "Conn"
Cohesion: 0.35
Nodes (3): connectWebSocket(), SocketHandlers, Conn

### Community 110 - "atelier-layout.ts"
Cohesion: 0.19
Nodes (12): ATELIER_END_X, ATELIER_ROOMS, COLLECTIONS, ENTRANCE, FormBase, FormSpot, HeadpieceSpot, PlacedRoom (+4 more)

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

### Community 120 - "db-tests/pond.test.ts"
Cohesion: 0.15
Nodes (11): CatchExtra, clearCatches(), COLUMNS, grantPearls(), insertCatch(), member(), namedMember(), randomId() (+3 more)

### Community 121 - "Fishing forest: painted asset pass"
Cohesion: 0.12
Nodes (15): Assets, Fishing forest illustrations, Made by hand (not touched by the script), 1. Forest doorway, 2. Woodland noticeboard, 3. Fisherman and bait basket, 4. Fishing journal nook, 5. Current revision: original otter, bait stall and quiet exploration (+7 more)

### Community 124 - "earn"
Cohesion: 0.21
Nodes (13): buildClaim(), newRunId(), now, earn(), emit(), emitEarned(), maybeInvite(), writeSession() (+5 more)

### Community 125 - "useSound"
Cohesion: 0.22
Nodes (9): openBugReport(), fitWidth(), HelpGuide(), HelpGuideProps, POINTER_STEPS, TOUCH_STEPS, useSound(), SoundToggle() (+1 more)

### Community 126 - "rig.ts"
Cohesion: 0.13
Nodes (26): Layer, setCostumeVisibility(), canvasToModel(), createRenderer(), createRigLayer(), disposeRigLayer(), Frame, layerTemplates (+18 more)

### Community 127 - "Curating the paintings (2026-11-07)"
Cohesion: 0.13
Nodes (14): 1. The registry and the table, 2. The studio's Location picker, 3. The rooms draw what is placed, 4. Credits, 5. Retiring self-serve artists, Building it, Curating the paintings (2026-11-07), Decided (+6 more)

### Community 128 - "BountyPanel.tsx"
Cohesion: 0.36
Nodes (8): PondBounties, formatCountdown(), nextUtcMidnight(), utcDayLabel(), useCountdown(), useNow(), BountyPanel(), dayLabel()

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
Cohesion: 0.13
Nodes (16): bethEllen, inspiratiq, metadata, notoSans, RootLayout(), sniglet, viewport, ServiceWorker() (+8 more)

### Community 133 - "a/[slug]/page.tsx"
Cohesion: 0.31
Nodes (6): ArtistPage(), dynamic, generateMetadata(), GET(), FollowForm(), getArtistPage()

### Community 134 - "4. Transport: Cloudflare Durable Objects"
Cohesion: 0.25
Nodes (8): 4. Transport: Cloudflare Durable Objects, Decision (2026-10-31), Deploying, Identity cannot be forged, Local development and tests, Rooms and capacity, Shape of `apps/presence` (about 200 lines), main()

### Community 135 - "perf.ts"
Cohesion: 0.22
Nodes (4): createPerfMeter(), isEnabled(), PerfMeter, PerfSnapshot

### Community 136 - "Low"
Cohesion: 0.07
Nodes (27): 10. Long names run off the name sign, 11. The rooms API skips the stale-tab member check, 12. The bunny is dragged along while you pan in Decorate, 13. Pages that redirect or don't exist answer 200, 14. Error codes reveal which room slugs exist, 15. The name sign slides under the top-right buttons in Decorate, 16. Level-up celebrations can be farmed, 17. No hint of where things are after panning away (+19 more)

### Community 137 - "rooms/types.ts"
Cohesion: 0.05
Nodes (36): CameraRig, centerYFor(), createPixelRatioGovernor(), PIXEL_RATIO_STEPS, Pose, Room, RoomOptions, Entry (+28 more)

### Community 138 - "createHallRoom"
Cohesion: 0.12
Nodes (15): LobbySigns, createSitting(), hop(), createHallRoom(), buildRoom(), cafeRoom(), entranceRoom(), galleryRoom() (+7 more)

### Community 139 - "The Costume Atelier"
Cohesion: 0.13
Nodes (14): Adding a character, Adding a costume, Art not supplied as files, Bruce's Chronicles, Checked against the mocks (2026-11-07), Code, Costume fit review, Fitting clothes to other characters (+6 more)

### Community 141 - "bug-reports.ts"
Cohesion: 0.24
Nodes (11): BugReport, BugReportDto, BugReportRejected, BugRow, CONTEXT_KEYS, EVERYONE, normalizeBugPage(), parseBugReport() (+3 more)

### Community 142 - "visits.ts"
Cohesion: 0.24
Nodes (13): VisitState, currentSalts(), DEVICES, loadSalts(), Salts, summarizeVisits(), Visitor, VisitReport (+5 more)

### Community 143 - "media/storage.ts"
Cohesion: 0.20
Nodes (14): GET(), PaintingRow, GET(), POST(), UPLOADS_PER_ARTIST, POST(), UPLOADS_PER_ARTIST, StudioLayout() (+6 more)

### Community 144 - "The Moonlit Pond — design"
Cohesion: 0.09
Nodes (22): Art the pond needs from the artist, Build contract (decided 2026-11-07), Build phases, Collection and goals, Done, Done, Guardrails, Leaderboards (+14 more)

### Community 145 - "Pond rework"
Cohesion: 0.18
Nodes (10): Baits, Client, Decisions, Done, Notes, Pond rework, Server, Species (+2 more)

### Community 146 - "collage.ts"
Cohesion: 0.12
Nodes (14): admin, childEnv, client, database, fresh, migrations, target, SCHEMA_DIR (+6 more)

### Community 147 - "Orchestration contract — you plan, DSH workers execute"
Cohesion: 0.29
Nodes (6): Briefing a worker, Budget hygiene, graphify, Orchestration contract — you plan, DSH workers execute, The worker, When not to delegate

### Community 148 - "tables.ts"
Cohesion: 0.09
Nodes (38): FrameShape, PondGameProps, RevealCardProps, PondCatch, CatchView, debugSpecies(), debugVariant(), GuestRoll (+30 more)

### Community 149 - "rooms.ts"
Cohesion: 0.06
Nodes (64): Design for Phases 5–7 (2026-11-05), artist(), member(), piece(), randomId(), sealEpoch(), discardLocation(), hasUnpublished() (+56 more)

### Community 150 - "hang-tag.ts"
Cohesion: 0.17
Nodes (6): CARD, createHangTag(), HangTag, HangTagStyle, HOLE, KNOT

### Community 151 - "pond-state.ts"
Cohesion: 0.29
Nodes (12): fetchPondState(), PondStateView, PondTier, ensurePondStateStarted(), GUEST, listeners, LOADING, PondStateSnapshot (+4 more)

### Community 152 - "PondTicker.tsx"
Cohesion: 0.29
Nodes (11): fetchPondFeed(), PondFeedItem, catchLabel(), formatSizeCm(), speciesFor(), speciesName(), speciesTier(), isGolden() (+3 more)

### Community 153 - "domain/guestboard.ts"
Cohesion: 0.15
Nodes (19): GET(), decodeCursor(), encodeCursor(), enforceLimits(), GuestNoteInput, GuestNoteRateLimited, GuestNoteRejected, listGuestNotes() (+11 more)

### Community 154 - "Item"
Cohesion: 0.15
Nodes (3): Presence, Item, Refusal

### Community 155 - "xdog.ts"
Cohesion: 0.27
Nodes (7): renderSketch(), blur(), kernel(), toGray(), XDOG_DEFAULTS, xdogInk(), XdogOptions

### Community 156 - "createRemoteVisitors"
Cohesion: 0.24
Nodes (8): createRemoteVisitors(), ensureLayer(), load(), placeOwn(), show(), showProp(), sprite(), insideScreen()

### Community 157 - "Walkthrough.tsx"
Cohesion: 0.17
Nodes (17): MoreArrow(), NavArrow(), Props, SLIDE, Walkthrough(), XIcon(), decodedFrames, frameFor() (+9 more)

### Community 158 - "(hall)/page.tsx"
Cohesion: 0.21
Nodes (12): dynamic, Hall(), MuseumPage(), CurrentlyShowing(), dynamic, GUIDELINES, LandingPage(), EMPTY (+4 more)

### Community 159 - "confirm/page.tsx"
Cohesion: 0.33
Nodes (7): ConfirmFollow(), dynamic, dynamic, Unsubscribe(), FollowNotice(), confirmFollow(), unsubscribe()

### Community 160 - "Local end-to-end stress test — 2026-11-06"
Cohesion: 0.13
Nodes (14): sameOriginUrl(), bitmapTexture(), elementTexture(), fetchDisplayTexture(), loadDisplayTexture(), E2E-001 — Alternate local origin breaks artwork fallback URLs, Environment and coverage, Fix status (2026-11-06) (+6 more)

### Community 161 - "ColorRecall.tsx"
Cohesion: 0.27
Nodes (10): ColorRecall(), ColorRecallProps, Phase, readBest(), ColorRound, showMs(), loadColorRecall(), saveIfHigher() (+2 more)

### Community 162 - "Placement"
Cohesion: 0.12
Nodes (5): Carry, PersonalRoomProps, HallRoomData, PlacementLayer, Placement

### Community 163 - "painting-open"
Cohesion: 0.50
Nodes (4): file, kilobytes, seconds, painting-open

### Community 164 - "lib/presence.ts"
Cohesion: 0.09
Nodes (20): Outcome, Connect, fetchTicket, HEARTBEAT_MS, HIDDEN_LIMIT_MS, RETRY_MS, sameLook(), samePose() (+12 more)

### Community 165 - "RevealCard.tsx"
Cohesion: 0.13
Nodes (14): CONFETTI_COLORS, ConfettiPiece, makeConfetti(), RevealCard(), TIER_MS, TIER_SFX, useCountUp(), chainOffer (+6 more)

### Community 166 - "visits/page.tsx"
Cohesion: 0.27
Nodes (9): amount(), duration(), dynamic, LANDMARKS, PAGES, RANGES, share(), VisitsPage() (+1 more)

### Community 167 - "SoundProvider.tsx"
Cohesion: 0.10
Nodes (32): SoundContext, SoundProvider(), SoundState, BackgroundMusic, clampVolume(), isDocumentHidden(), Options, useBackgroundMusic() (+24 more)

### Community 169 - "icon-basket"
Cohesion: 0.67
Nodes (3): icon-basket, file, vector

### Community 170 - "hit"
Cohesion: 0.12
Nodes (43): POST(), POST(), POST(), PER_MEMBER, PUT(), PER_MEMBER, POST(), catchIdOf() (+35 more)

### Community 171 - "rooms/types.ts"
Cohesion: 0.06
Nodes (19): CharacterSprites, Attachment, Carried, CarriedState, createCarried(), Character, Perch, Pose (+11 more)

### Community 172 - "rooms/art.ts"
Cohesion: 0.21
Nodes (9): AtelierArt, loadGalleryDoor(), loadGalleryPillar(), loadImage(), AtelierArtwork, PersonalArt, ROOM_ART, RoomArt (+1 more)

### Community 174 - "Pedestal"
Cohesion: 0.13
Nodes (6): createNotes(), createPedestal(), Notes, Pedestal, PedestalVoice, VOICES

### Community 176 - "CrowdPreview.tsx"
Cohesion: 0.33
Nodes (7): CrowdPreviewPage(), CrowdPreview(), draw(), KINDS, Stats, Window, clearRigLayer()

### Community 179 - "performance/page.tsx"
Cohesion: 0.31
Nodes (8): dynamic, format(), grade(), METRICS, PAGES, PerformancePage(), RANGES, summarizeVitals()

### Community 180 - "wardrobe.ts"
Cohesion: 0.08
Nodes (44): AtelierPage(), dynamic, metadata, useWallet(), allowedCharacter(), OwnedSnapshot, owns(), walletReady() (+36 more)

### Community 182 - "messages.ts"
Cohesion: 0.31
Nodes (7): checkMessage(), INVISIBLE, MESSAGE_MAX, MessageCheck, normalizeMessage(), hasProfanity(), matcher

### Community 183 - "createDecorController"
Cohesion: 0.67
Nodes (4): createDecorController(), canvasRect(), targetRise(), toScreen()

### Community 184 - "usePondState"
Cohesion: 0.39
Nodes (6): fetchPondBounties(), getPondStateSnapshot(), subscribePondState(), usePondState(), PondHud(), PondHudProps

### Community 185 - "icons.tsx"
Cohesion: 0.24
Nodes (9): BaitTray(), BaitTrayProps, GuestRollOptions, BAIT, BaitId, GLYPHS, PearlIcon(), POND_CRIMSON (+1 more)

### Community 186 - "vitals.ts"
Cohesion: 0.31
Nodes (7): DEVICES, METRICS, normalizePage(), parseVitalsReport(), RATINGS, VitalRow, VitalSummary

### Community 187 - "media/storage.ts"
Cohesion: 0.09
Nodes (18): CONTENT_TYPES, GET(), PUT(), ACCEPTED, createAssetFromUpload(), MAX_UPLOAD_BYTES, presignUpload(), registerUpload() (+10 more)

### Community 189 - "VisitTracker.tsx"
Cohesion: 0.36
Nodes (6): state(), VisitTracker(), isPublicPage(), flush(), startVisit(), visibleMs()

### Community 190 - "member-route.ts"
Cohesion: 0.39
Nodes (5): GET(), GET(), LOOPBACK, memberFromRequest(), MemberRequest

### Community 191 - "visit/route.ts"
Cohesion: 0.43
Nodes (6): PER_VISITOR, POST(), count(), parseVisitReport(), recordVisit(), visitorHash()

### Community 193 - "Rig"
Cohesion: 0.33
Nodes (3): RigState, Rig, Shown

### Community 194 - "Other visitors"
Cohesion: 0.29
Nodes (6): How it plays, Other visitors, Privacy, Running it in production, Running it locally, Staying consistent

### Community 195 - "createPondRoom"
Cohesion: 0.53
Nodes (6): createPondRoom(), goTo(), nearest(), releaseSpot(), spotFree(), itemFor()

### Community 196 - "roomKit"
Cohesion: 0.70
Nodes (5): roomKit(), button(), glint(), headpiece(), priceTag()

### Community 197 - "createCharacter"
Cohesion: 0.60
Nodes (4): createCharacter(), contextLost(), loadKind(), loseRig()

## Knowledge Gaps
- **5 isolated node(s):** `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1260 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **27 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `CoinToast.tsx` to `BountyPanel.tsx`, `SketchGuess.tsx`, `app/layout.tsx`, `a/[slug]/page.tsx`, `machine.ts`, `PondRoom.tsx`, `Test Fakes and Helpers`, `GuestBoard.tsx`, `room-events.ts`, `PondTicker.tsx`, `Museum.tsx`, `PersonalRoom.tsx`, `Walkthrough.tsx`, `Web Package Dependencies`, `(hall)/page.tsx`, `GameDesktop.tsx`, `ColorRecall.tsx`, `risk.ts`, `RevealCard.tsx`, `SoundProvider.tsx`, `pond-api.ts`, `RigPreview.tsx`, `CrowdPreview.tsx`, `Water.tsx`, `wardrobe.ts`, `usePondState`, `icons.tsx`, `pond-format.ts`, `logic.ts`, `VisitTracker.tsx`, `actions.ts`, `react`, `AccountSheet.tsx`, `useSound`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **What connects `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json` to the rest of the system?**
  _5 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `SketchGuess.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08350951374207188 - nodes in this community are weakly interconnected._
- **Why does `three` connect `overlay.ts` to `perf.ts`, `scene/assets.ts`, `rooms/types.ts`, `rooms/types.ts`, `rooms/art.ts`, `scene.ts`, `Pedestal`, `cozy.ts`, `room-events.ts`, `atelier.ts`, `prepare-models.mjs`, `hang-tag.ts`, `Traversal`, `rig.ts`, `Web Package Dependencies`, `rooms/art.ts`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Should `floor.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12564102564102564 - nodes in this community are weakly interconnected._
- **Why does `defaultStore()` connect `AccountSheet.tsx` to `currentMember`, `slots/store.ts`, `createStage`, `rooms/types.ts`, `pond-api.ts`, `createHallRoom`, `SyncStore`, `pondgame/lib/api.ts`, `room-events.ts`, `overlay.ts`, `wardrobe.ts`, `setPondState`, `pond-state.ts`, `economy/store.ts`, `PersonalRoom.tsx`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Should `Core Asset Manifest` be split into smaller, more focused modules?**
  _Cohesion score 0.047619047619047616 - nodes in this community are weakly interconnected._