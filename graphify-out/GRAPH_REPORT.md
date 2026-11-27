# Graph Report - tiny-museum  (2026-11-27)

## Corpus Check
- 592 files · ~357,290 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 110 file(s) not represented in the graph (top: .avif 60, .glb 38, .css 7)

## Summary
- 5241 nodes · 13679 edges · 229 communities (196 shown, 33 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 267 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3092c307`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- AtelierKeeps.tsx
- rooms.ts
- SketchGuess.tsx
- DoorEditor
- lib/assets.ts
- round.ts
- floor.ts
- Core Asset Manifest
- scene/assets.ts
- remote-visitors.ts
- machine.ts
- Museum.tsx
- Test Fakes and Helpers
- scene.ts
- cozy.ts
- DecorDrawer.tsx
- room-events.ts
- schedule.ts
- ref_node_assert
- amplify/package.json
- PersonalRoom.tsx
- prepare-models.mjs
- Traversal
- core/package.json
- hitForVisitor
- members.ts
- currentMember
- pond-api.ts
- ambience.ts
- core/src/index.ts
- Web Package Dependencies
- Gamifying Tiny Museum — genre direction & engagement research
- src/rooms/doors.ts
- hall/room.ts
- risk.ts
- amplify/tsconfig.json
- 5. Customization menu — what other people are doing
- rooms/art.ts
- src/types.ts
- Web TSConfig
- Root Package Manifest
- member-route.ts
- createHallRoom
- import-fishing-assets.mjs
- Base TSConfig
- Amplify Build Spec
- stage.ts
- paintings/page.tsx
- pond-boards.ts
- db.ts
- Water.tsx
- Worker Package Manifest
- Public Asset Manifest
- catalog.ts
- atelier.ts
- compose-atelier.mjs
- writeLocal
- pond-format.ts
- actions.ts
- economy/store.ts
- createNpcLayer
- room.ts
- minimap.ts
- useEscapeKey
- GuestBoard.tsx
- Sound Effect Assets
- art-cache.ts
- Custom HTTP Headers
- Sharp Layer Package
- LandingFx
- scene/ambience.ts
- ticket/route.ts
- Confirmed issues
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
- wander.ts
- presence/package.json
- createAtelierRoom
- Asset pipeline: fast loading without losing sharpness
- Guest Board SQL Schema
- Landscape Frame Asset
- GuideTalk.tsx
- Bug Reports SQL Schema
- Vitals SQL Schema
- features/rooms/doors.ts
- snapshot.ts
- pond/room.ts
- Other visitors
- Run-Once Schema
- pond/room.ts
- FishingView.tsx
- slots/store.ts
- hang-tag.ts
- wallet/body.ts
- json
- graftCostume
- pondgame/lib/api.ts
- worker/tsconfig.json
- core/tsconfig.json
- wander.test.ts
- How to Design for Failures — ByteByteGo Newsletter
- Worker instructions — DSH headless agents
- Backend
- protocol.ts
- Costume gallery doorway
- Item
- Fishing forest: painted asset pass
- audio/README.md
- .claude/CLAUDE.md
- The Costume Atelier
- PondPanels.tsx
- db-tests/pond.test.ts
- ClosetView.tsx
- sketchguess/lib/api.ts
- presence/tsconfig.json
- wallet.ts
- tsconfig.test.json
- epoch.ts
- links.ts
- peers.ts
- reveal.ts
- Atelier: the dressing mirror, and show-don't-tell keeping
- doors/page.tsx
- presence.test.ts
- room-places.ts
- bug-reports.ts
- confirm/page.tsx
- ref_node_assert
- Walker
- The Moonlit Pond — design
- Pond rework
- createStage
- Orchestration contract — you plan, DSH workers execute
- tables.ts
- LeaderboardPanel.tsx
- useBackgroundMusic.ts
- readJsonBody
- SlotDef
- HallArranger.tsx
- Personal room: stress-test issues
- import-hall-assets.mjs
- pond-photos.ts
- Walkthrough.tsx
- createPondRoom
- queryOne
- player-card.ts
- defaultStore
- createCozyBackdrop
- import-home-assets.mjs
- getStorage
- react
- Lobby
- FilesystemStorage
- infra/jobs.ts
- Your Room: a room you can freely furnish
- Medium
- Tasks
- layout.ts
- a/[slug]/page.tsx
- Curating the paintings (2026-11-07)
- hit.ts
- Local end-to-end stress test — 2026-11-06
- visits.ts
- Context
- createPlacementLayer
- import-landing-assets.mjs
- perf.ts
- schedule.test.ts
- Storyline (draft, saved 2026-11-17)
- guestboard/route.ts
- bake-pond-path.mjs
- createPersonalRoom
- Pedestal
- draw.py
- DoorEditor.tsx
- createPixelRatioGovernor
- SyncStore
- scripts
- Monets Lily Pond: exploration, UX and multiplayer QA
- Cafe
- createStage
- gallery.ts
- ticket.ts
- journal.ts
- handlers.ts
- Sitting
- messages.ts
- rig.ts
- npcs/README.md
- walk
- nearby.ts
- Low
- ArtCache
- AssetImage
- app/layout.tsx
- AccountSheet.tsx
- TreeSparkles
- .webSocketMessage
- Rig
- icons.tsx
- createMinimap
- npc-sheet.cjs
- Minimap
- boundedCameraX
- doors.sql
- Notes
- painting-open
- HelmShare
- icon-basket
- bunny-left
- bunny-right
- icon-home
- ticket

## God Nodes (most connected - your core abstractions)
1. `react` - 89 edges
2. `json()` - 77 edges
3. `query()` - 72 edges
4. `PersonalRoom()` - 67 edges
5. `hit()` - 63 edges
6. `limited()` - 57 edges
7. `three` - 49 edges
8. `next` - 48 edges
9. `Traversal` - 48 edges
10. `createHallRoom()` - 47 edges

## Surprising Connections (you probably didn't know these)
- `E2E-009 — Room mutations ignore stale account identity` --references--> `memberFromRequest()`  [INFERRED]
  docs/testing/local-e2e-stress-2026-11-06.md → apps/web/src/shared/lib/member-route.ts
- `Where things stand` --references--> `sealEpoch()`  [INFERRED]
  docs/curation-plan.md → packages/core/src/domain/epoch.ts
- `19. Development-only: page payloads include the full room row` --references--> `getRoom()`  [INFERRED]
  docs/personal-room-issues.md → packages/core/src/domain/rooms.ts
- `Server` --references--> `readPondTicket()`  [INFERRED]
  docs/pond-rework.md → packages/core/src/economy/pond.ts
- `3. The rooms draw what is placed` --references--> `pickDerivative()`  [INFERRED]
  docs/curation-plan.md → packages/core/src/media/derivatives.ts

## Import Cycles
- None detected.

## Communities (229 total, 33 thin omitted)

### Community 0 - "AtelierKeeps.tsx"
Cohesion: 0.10
Nodes (25): MuseumLayout(), openAccount(), openAccountCreation(), CoinToast(), Toast, Purse(), Stamp(), WalletProvider() (+17 more)

### Community 1 - "rooms.ts"
Cohesion: 0.05
Nodes (79): COLLECTIONS, Catalogue, Data model (core), The closet: where every room starts (2026-11-17), artist(), member(), piece(), randomId() (+71 more)

### Community 2 - "SketchGuess.tsx"
Cohesion: 0.10
Nodes (32): bestKeyFor(), BURST, clueUrl(), openingPlan(), Phase, pickAtRandom(), prepareSketchGame(), readDifficulty() (+24 more)

### Community 3 - "DoorEditor"
Cohesion: 0.24
Nodes (15): saveDoorsAction(), DoorEditor(), add(), apply(), commitSlide(), nudge(), pick(), pointerDown() (+7 more)

### Community 4 - "lib/assets.ts"
Cohesion: 0.09
Nodes (31): Loading(), dynamic, Hall(), MuseumPage(), [BRAND_OWNER, ...BRAND_REST], CurrentlyShowing(), Decor(), dynamic (+23 more)

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
Nodes (40): AssetManifest, assetUrl(), bitmapTexture(), blankImage(), CAFE_CAT_FRAMES, CompressedLoader, elementTexture(), ENTRANCE_FILES (+32 more)

### Community 9 - "remote-visitors.ts"
Cohesion: 0.06
Nodes (19): CharacterSprites, Attachment, Carried, CarriedState, createCarried(), Character, Perch, Pose (+11 more)

### Community 10 - "machine.ts"
Cohesion: 0.10
Nodes (47): CAST_ERRORS, coarsePointer(), FishingView(), initialEasyReel(), isTyping(), LOST, Toast, vibrate() (+39 more)

### Community 11 - "Museum.tsx"
Cohesion: 0.10
Nodes (31): Loading(), AtelierLoading(), CoinFound, ColorRecall, GameDesktop, GuestBoard, HallArranger, HelpGuide (+23 more)

### Community 12 - "Test Fakes and Helpers"
Cohesion: 0.09
Nodes (29): fixture(), deferredFetch(), deviceSlot, FakeEvents, FakeStorage, fixture, fixtureB, fixtureRegistry (+21 more)

### Community 13 - "scene.ts"
Cohesion: 0.05
Nodes (27): MuseumProps, disposeDisplayTexture(), prefersAvif(), HiddenCoin, hallDoorSpan(), PedestalVoice, placeholderTexture(), hallDoorSpans() (+19 more)

### Community 14 - "cozy.ts"
Cohesion: 0.07
Nodes (45): alphaCanvas(), ATELIER_PROPS, AtelierImage, atticWindowCanvas(), bareBulbCanvas(), boardsCanvas(), canvasTexture(), ceilingTexture() (+37 more)

### Community 15 - "DecorDrawer.tsx"
Cohesion: 0.10
Nodes (29): DecorDrawer, DecorDrawerProps, SLOT_LABELS, Tab, TABS, categoryOf(), DrawerCategory, FINISH_NAMES (+21 more)

### Community 16 - "room-events.ts"
Cohesion: 0.05
Nodes (50): ChatButton(), REFUSED, joinRoom(), emit(), getPeople(), isInRoom(), isMuted(), muted (+42 more)

### Community 17 - "schedule.ts"
Cohesion: 0.07
Nodes (56): addDwellEmotes(), addEmote(), addGap(), addStand(), addWalk(), along(), buildRoomTable(), buildStayPlan() (+48 more)

### Community 18 - "ref_node_assert"
Cohesion: 0.11
Nodes (32): mergeSlot(), defineSlot(), docBytes(), slotDef(), SLOTS, byAtThenKey(), encoded(), latest (+24 more)

### Community 19 - "amplify/package.json"
Cohesion: 0.08
Nodes (26): amplifyDir, backend, everyMinutes, mediaBucket, missing, repoRoot, REQUIRED, setting() (+18 more)

### Community 20 - "PersonalRoom.tsx"
Cohesion: 0.09
Nodes (53): errorReason(), Offer, overDrawer(), PersonalRoom(), canPlaceNew(), carriedTo(), carryEnd(), carryMove() (+45 more)

### Community 21 - "prepare-models.mjs"
Cohesion: 0.06
Nodes (43): paintedCostume(), alongArm(), ARMS, armTurn(), BODIES, bruce, BRUCE_FIT, BRUCE_PLACE (+35 more)

### Community 22 - "Traversal"
Cohesion: 0.08
Nodes (10): JumpPose, clamp(), fixture(), jump(), Traversal, MAX_CATCH_UP_SECONDS, MAX_STEP_SECONDS, movementSteps() (+2 more)

### Community 23 - "core/package.json"
Cohesion: 0.06
Nodes (39): dependencies, @aws-sdk/client-s3@^3.1121.0, @aws-sdk/s3-request-presigner@^3.1121.0, bcryptjs@^2.4.3, obscenity@^0.4.6, pg@^8.13.1, sharp@^0.33.5, thumbhash@^0.1.1 (+31 more)

### Community 24 - "hitForVisitor"
Cohesion: 0.14
Nodes (24): ALLOWED, PER_VISITOR, POST(), POST(), GLOBAL, PER_IP, POST(), GLOBAL (+16 more)

### Community 25 - "members.ts"
Cohesion: 0.11
Nodes (38): Code, 3.2 Chosen names (members), registry, started(), hashPassword(), hashToken(), verifyPassword(), canonicalEmail() (+30 more)

### Community 26 - "currentMember"
Cohesion: 0.16
Nodes (19): GET(), PaintingRow, GET(), POST(), UPLOADS_PER_ARTIST, POST(), UPLOADS_PER_ARTIST, dynamic (+11 more)

### Community 27 - "pond-api.ts"
Cohesion: 0.21
Nodes (23): buyPondBait(), claimPondBounty(), errorOf(), exchangePondPearls(), fetchPondBounties(), fetchPondDex(), fetchPondLeaderboard(), fetchPondPhotos() (+15 more)

### Community 28 - "ambience.ts"
Cohesion: 0.12
Nodes (29): blade(), bloom(), BLOOMS, createPondAmbience(), update(), fishTexture(), frond(), FRONT_ROWS (+21 more)

### Community 29 - "core/src/index.ts"
Cohesion: 0.05
Nodes (105): GET(), addBait(), PondFeedItem, Rep, BountyCatchRow, castPond(), isRecord(), ONCE (+97 more)

### Community 30 - "Web Package Dependencies"
Cohesion: 0.07
Nodes (35): dependencies, embla-carousel-react@^8.6.0, motion@^13.1.1, next@^15.0.3, react@^19.0.0, react-dom@^19.0.0, swr@^2.5.1, three@^0.169.0 (+27 more)

### Community 31 - "Gamifying Tiny Museum — genre direction & engagement research"
Cohesion: 0.10
Nodes (19): 0.1 The core experience, 0.2 Systems that make gamification cheap to build, 0.3 Constraints that shape any recommendation, 0. What the game is today (the deep dive), 1.1 The landscape (seven candidates, with verdicts), 1.2 Recommendation: a **cozy gallery life-sim** — "the gallery you live in", 1.3 The five design pillars the genre implies, 1. Genre direction (+11 more)

### Community 32 - "src/rooms/doors.ts"
Cohesion: 0.16
Nodes (20): DoorsRow, parsed(), saveDoorsDraft(), addPassage(), checkDoors(), DEFAULT_DOORS, DOOR_ASPECT, DOOR_GAP (+12 more)

### Community 33 - "hall/room.ts"
Cohesion: 0.09
Nodes (45): Assets, Scenery, CUTS, disposeBoards(), Mark, plane(), ROPE_CUTS, ropeSlices() (+37 more)

### Community 34 - "risk.ts"
Cohesion: 0.16
Nodes (25): Hud(), HudProps, HudWagerChip, WagerPicker(), chooseTier(), WagerPickerProps, chainChipLabel(), clampWagerStake() (+17 more)

### Community 35 - "amplify/tsconfig.json"
Cohesion: 0.20
Nodes (9): compilerOptions, module, moduleResolution, noUnusedLocals, noUnusedParameters, exclude, extends, include (+1 more)

### Community 36 - "5. Customization menu — what other people are doing"
Cohesion: 0.12
Nodes (16): 1. The target: what "Claude Opus 5.5" actually means, 2. Where your harness stands today (live config I read), 3. The honest gap model, 4. Quality levers, ranked by leverage, 5. Customization menu — what other people are doing, 6. Recommended starting kit for *your* profile, 7. What I can apply for you right now (needs your go-ahead), A. Prompt & persona (most common quality customizations) (+8 more)

### Community 37 - "rooms/art.ts"
Cohesion: 0.15
Nodes (14): AtelierArt, disposeAtelierArt(), loadGalleryDoor(), loadGalleryPillar(), loadImage(), AtelierArtwork, HallArt, PersonalArt (+6 more)

### Community 38 - "src/types.ts"
Cohesion: 0.09
Nodes (34): listPieces(), pieceImageUrl(), PieceRow, toPieceDto(), GalleryRow, getSketchRound(), planSketchRound(), SKETCH_CHOICES (+26 more)

### Community 39 - "Web TSConfig"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 40 - "Root Package Manifest"
Cohesion: 0.10
Nodes (22): [, width, height], description, devDependencies, concurrently@^9.1.0, esbuild@^0.24.0, ktx2-encoder@^0.6.0, maxrects-packer@^2.7.3, playwright@^1.63.0 (+14 more)

### Community 41 - "member-route.ts"
Cohesion: 0.14
Nodes (22): POST(), POST(), GET(), POST(), GET(), POST(), readCapped(), READS (+14 more)

### Community 42 - "createHallRoom"
Cohesion: 0.09
Nodes (25): createHelm(), createSitting(), hop(), COLD_DOOR_HOLD_MS, hallIsReady(), Opening, OPENING_MAX_WAIT_MS, at() (+17 more)

### Community 43 - "import-fishing-assets.mjs"
Cohesion: 0.10
Nodes (12): CANVAS, clear, FONT, FRAME, heights, layout, lossless, manifest (+4 more)

### Community 44 - "Base TSConfig"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, lib, module, moduleResolution (+9 more)

### Community 45 - "Amplify Build Spec"
Cohesion: 0.12
Nodes (16): applications, appRoot, backend, frontend, baseDirectory, files, phases, commands (+8 more)

### Community 46 - "stage.ts"
Cohesion: 0.03
Nodes (50): coverFloorTransition(), CameraRig, Viewport, createRoomPassage(), JUMP_KEYS, JOBS, NpcRoomInfo, FLAT (+42 more)

### Community 47 - "paintings/page.tsx"
Cohesion: 0.09
Nodes (35): dateFormat, dynamic, GuestBoardPage(), dynamic, HangPage(), dynamic, StudioHome(), dynamic (+27 more)

### Community 48 - "pond-boards.ts"
Cohesion: 0.15
Nodes (19): compare(), DexRow, displayName(), FeedRow, getPondFeed(), getPondLeaderboard(), NameRow, PondBoardId (+11 more)

### Community 49 - "db.ts"
Cohesion: 0.05
Nodes (30): bodyTextures, COATS, { json, bin }, manifest, maps, target, manifest, admin (+22 more)

### Community 50 - "Water.tsx"
Cohesion: 0.07
Nodes (38): AmbientShadow, box(), BUCKET, bunnyBox(), easeOut(), Glint, LEFT_STYLE, lineColour() (+30 more)

### Community 51 - "Worker Package Manifest"
Cohesion: 0.14
Nodes (14): dependencies, @tiny/core@*, exports, ./lambda, @tiny/core, main, name, private (+6 more)

### Community 52 - "Public Asset Manifest"
Cohesion: 0.12
Nodes (15): artworks, bunny, size, floor, size, fonts, icon-no-photos, size (+7 more)

### Community 53 - "catalog.ts"
Cohesion: 0.17
Nodes (19): CatalogItem, CatalogKind, FREE_CHARACTERS, isBuyable(), isCatalogItem(), ITEMS, ItemSlot, priceOf() (+11 more)

### Community 54 - "atelier.ts"
Cohesion: 0.04
Nodes (34): Props, AtelierDoor, AtelierImage, AtelierRoom, BuiltRoom, Cardigan, CARDIGAN_NAMES, ClothingItem (+26 more)

### Community 55 - "compose-atelier.mjs"
Cohesion: 0.12
Nodes (10): body, dressLayer, dressWidth, floralWidth, hanger, MANNEQUIN_CANVAS, mask, root (+2 more)

### Community 56 - "writeLocal"
Cohesion: 0.19
Nodes (16): ColorRecall(), ColorRecallProps, Phase, readBest(), ColorRound, showMs(), loadColorRecall(), saveIfHigher() (+8 more)

### Community 57 - "pond-format.ts"
Cohesion: 0.09
Nodes (40): refreshWalletNow(), PondBounties, EXCHANGE_DAILY_STAMPS, EXCHANGE_PEARLS_PER_STAMP, formatCountdown(), formatInteger(), formatPercent(), nextUtcMidnight() (+32 more)

### Community 58 - "actions.ts"
Cohesion: 0.09
Nodes (47): BugReportsPage(), dateFormat, dynamic, summary(), back(), createCodeAction(), deleteCodeAction(), deleteGuestNoteAction() (+39 more)

### Community 59 - "economy/store.ts"
Cohesion: 0.06
Nodes (81): serverSnapshot, useEarnEvents(), CARRY_CAP, carryAdd(), CarryEntry, carryPrune(), carryRemove(), chunk() (+73 more)

### Community 60 - "createNpcLayer"
Cohesion: 0.17
Nodes (21): createNpcLayer(), createResidentView(), createView(), departedRecently(), draw(), fadeOut(), glyphWidth(), hideAll() (+13 more)

### Community 61 - "room.ts"
Cohesion: 0.15
Nodes (27): admitted(), Attachment, farewell(), GHOST_MS, HELLO_TIMEOUT_MS, holdsOf(), homeOf(), MAX_WAITING_PER_IP (+19 more)

### Community 62 - "minimap.ts"
Cohesion: 0.09
Nodes (25): follow(), doorPoint(), FALLBACK_TINT, FloorSketch, ICONS, MAP_PLACES, MAP_SCALE, MapPlace (+17 more)

### Community 63 - "useEscapeKey"
Cohesion: 0.12
Nodes (26): GuideTalk(), AlbumPanel(), remove(), CameraView, onOpenCamera(), openCamera(), AlbumOverlay(), Gadgets() (+18 more)

### Community 64 - "GuestBoard.tsx"
Cohesion: 0.08
Nodes (40): GET(), BoardScreen(), BoardScreenProps, ComposeScreen(), ComposeScreenProps, blankDraft(), GuestBoard(), GuestBoardProps (+32 more)

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

### Community 69 - "LandingFx"
Cohesion: 0.17
Nodes (12): between(), CAT, Edge, EDGES, runLandingCat(), choosePeeker(), peek(), glowSprite() (+4 more)

### Community 70 - "scene/ambience.ts"
Cohesion: 0.14
Nodes (13): createHallAmbience(), finish(), glowTexture(), HallAmbience, mulberry(), painted(), vignetteTexture(), Backdrop (+5 more)

### Community 71 - "ticket/route.ts"
Cohesion: 0.19
Nodes (14): GET(), PER_MEMBER, PUT(), GET(), PER_IP, POST(), presenceUrl(), memberFromRequest() (+6 more)

### Community 72 - "Confirmed issues"
Cohesion: 0.11
Nodes (18): Confirmed issues, E2E-002 — Valid edge placement rejected through floating-point precision, E2E-003 — One owned prop can be placed multiple times, E2E-004 — Reload before autosave silently loses the latest placement, E2E-005 — Failed save and failed Done have no visible mobile explanation, E2E-006 — Restoring connectivity does not retry a failed draft save, E2E-007 — Keyboard activation cannot place drawer items, E2E-008 — Creating an account from My Room leaves the signed-in user on the sign-in prompt (+10 more)

### Community 73 - "Placement"
Cohesion: 0.04
Nodes (16): Carry, Job, PersonalRoomProps, createDecorController(), canvasRect(), targetRise(), toScreen(), DecorController (+8 more)

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
Cohesion: 0.14
Nodes (21): ArtByRoom, colorAt(), decoded(), EDGE_BAND, EDGE_BANDS, EDGE_OVERLAP, edgeTexture(), imageOf() (+13 more)

### Community 80 - "createPresence"
Cohesion: 0.19
Nodes (13): createPresence(), drop(), heartbeat(), maybeSend(), onPageHide(), receive(), scheduleRetry(), send() (+5 more)

### Community 81 - "members"
Cohesion: 0.11
Nodes (28): coin_claims, coin_claims_daily, wallet_bait, wallet_items, wallets, member_sessions, member_sessions_member, member_slots (+20 more)

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
Cohesion: 0.21
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

### Community 89 - "GuideTalk.tsx"
Cohesion: 0.20
Nodes (13): createDoorGuides(), HallGuide, PROJECTED, BY_ID, CAST, castMember(), FRAME, IDLE (+5 more)

### Community 93 - "features/rooms/doors.ts"
Cohesion: 0.19
Nodes (13): doorArtUrl(), loadDoorArt(), loadRoomDoorArt(), pending, doorDefs(), doorsOf(), setMuseumDoors(), GuideTalk (+5 more)

### Community 94 - "snapshot.ts"
Cohesion: 0.24
Nodes (13): snap(), composeJpeg(), copyCanvas(), grabLayers(), Layer, loadImage(), paint(), px() (+5 more)

### Community 95 - "pond/room.ts"
Cohesion: 0.10
Nodes (33): water, depthAtLift(), FAR_LIFT, FAR_SCALE, liftAt(), pathHalfWidth(), pathX(), PondPath (+25 more)

### Community 96 - "Other visitors"
Cohesion: 0.29
Nodes (6): How it plays, Other visitors, Privacy, Running it in production, Running it locally, Staying consistent

### Community 104 - "pond/room.ts"
Cohesion: 0.08
Nodes (45): AtelierPage(), dynamic, metadata, useWallet(), allowedCharacter(), OwnedSnapshot, owns(), walletReady() (+37 more)

### Community 105 - "FishingView.tsx"
Cohesion: 0.13
Nodes (14): CONFETTI_COLORS, ConfettiPiece, makeConfetti(), RevealCard(), TIER_MS, TIER_SFX, useCountUp(), chainOffer (+6 more)

### Community 106 - "slots/store.ts"
Cohesion: 0.10
Nodes (21): Options, bow, dress, navy, ANON_PREFIX, anonKey(), deviceKey(), isMemberSlotKey() (+13 more)

### Community 107 - "hang-tag.ts"
Cohesion: 0.12
Nodes (8): CARD, createHangTag(), HangTag, HangTagStyle, HOLE, KNOT, What goes, and what replaces it, Refusal

### Community 108 - "wallet/body.ts"
Cohesion: 0.22
Nodes (13): PER_MEMBER, POST(), baitIdOf(), integerOffset(), isRecord(), itemIdOf(), MAX_CLAIM_BATCH, MAX_WALLET_BODY_BYTES (+5 more)

### Community 109 - "json"
Cohesion: 0.11
Nodes (44): PER_MEMBER, PUT(), PER_MEMBER, POST(), catchIdOf(), isRecord(), MAX_POND_BODY_BYTES, pearlsOf() (+36 more)

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

### Community 114 - "wander.test.ts"
Cohesion: 0.13
Nodes (15): FloorSpot, Job, Place, Phase, ResidentState, Run, WalkPath, WalkState (+7 more)

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
Cohesion: 0.17
Nodes (20): fetch(), Env, isHome(), isItem(), isName(), isPid(), isSeq(), MAX_HOLDS (+12 more)

### Community 119 - "Costume gallery doorway"
Cohesion: 0.50
Nodes (3): Costume gallery doorway, Curtain colour edit, Prompt

### Community 121 - "Fishing forest: painted asset pass"
Cohesion: 0.10
Nodes (18): Assets, Bruce's collection refresh (2026-11-08), Fishing forest illustrations, Made by hand (not touched by the script), Main hall v2 (2026-11-10), Monets Lily Pond (2026-11-08), 1. Forest doorway, 2. Woodland noticeboard (+10 more)

### Community 124 - "The Costume Atelier"
Cohesion: 0.17
Nodes (11): Adding a character, Adding a costume, Art not supplied as files, Bruce's Chronicles, Costume fit review, Floral collection, How it plays, Not done (+3 more)

### Community 125 - "PondPanels.tsx"
Cohesion: 0.10
Nodes (22): Loading(), metadata, PondPage(), revealFloorTransition(), PondGame(), POND_NAME, PondLoading(), BOARD_TABS (+14 more)

### Community 126 - "db-tests/pond.test.ts"
Cohesion: 0.12
Nodes (24): CatchExtra, COLUMNS, insertCatch(), member(), namedMember(), randomId(), StatePatch, getPondDex() (+16 more)

### Community 127 - "ClosetView.tsx"
Cohesion: 0.10
Nodes (27): ClosetView(), onKeyDown(), LISTS, PLACE, PODIUM_SRC, Props, Slot, SPOTLIGHT_SRC (+19 more)

### Community 128 - "sketchguess/lib/api.ts"
Cohesion: 0.23
Nodes (13): sameOriginUrl(), PreparedGame, decodeImage(), fetchBitmap(), fetchRound(), guarded(), LoadedRound, loadInk() (+5 more)

### Community 129 - "presence/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, types, exclude, extends, include, ../../tsconfig.base.json

### Community 130 - "wallet.ts"
Cohesion: 0.07
Nodes (47): grantPearls(), member(), now, piece(), randomId(), today, baitOf(), applyClaim() (+39 more)

### Community 131 - "tsconfig.test.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 132 - "epoch.ts"
Cohesion: 0.23
Nodes (14): GET(), intParam(), GET(), sketchPool, unavailable(), currentEpoch(), ensureEpoch(), epochById() (+6 more)

### Community 133 - "links.ts"
Cohesion: 0.36
Nodes (7): guides(), museumDoors(), EXITS, isDoor(), linkedDoor(), ROOM_PATH, doorTarget()

### Community 134 - "peers.ts"
Cohesion: 0.12
Nodes (10): Entry, INTERPOLATION_DELAY_MS, PEER_TIMEOUT_MS, PeerTable, positionAt(), Sample, look, Self (+2 more)

### Community 135 - "reveal.ts"
Cohesion: 0.23
Nodes (7): InkMap, planGame(), ROUND_SPREAD, createReveal(), PENCIL, SketchReveal, shuffle()

### Community 136 - "Atelier: the dressing mirror, and show-don't-tell keeping"
Cohesion: 0.13
Nodes (14): Atelier: the dressing mirror, and show-don't-tell keeping, Build order, Built (2026-11-20), Decisions (2026-11-19), Follow-ups (2026-11-20), Goal, In the room, Keeping (+6 more)

### Community 137 - "doors/page.tsx"
Cohesion: 0.21
Nodes (11): DoorsPage(), dynamic, hallPaintings(), StudioLayout(), HallPainting, Badge(), Icon(), ICONS (+3 more)

### Community 138 - "presence.test.ts"
Cohesion: 0.08
Nodes (24): Outcome, Connect, connectWebSocket(), fetchTicket, HEARTBEAT_MS, HIDDEN_LIMIT_MS, RETRY_MS, sameLook() (+16 more)

### Community 139 - "room-places.ts"
Cohesion: 0.14
Nodes (19): NpcGround, PlaceKind, atelierRoomInfo(), atelierX(), copy(), FurniturePlacement, hallCache, hallRoomInfo() (+11 more)

### Community 140 - "bug-reports.ts"
Cohesion: 0.12
Nodes (26): BugReportHost(), BugReportSheet, BugReportSheet(), send(), Status, collectContext(), inAppBrowser(), onOpenBugReport() (+18 more)

### Community 141 - "confirm/page.tsx"
Cohesion: 0.33
Nodes (7): ConfirmFollow(), dynamic, dynamic, Unsubscribe(), FollowNotice(), confirmFollow(), unsubscribe()

### Community 142 - "ref_node_assert"
Cohesion: 0.33
Nodes (7): shape(), garlandRibbon(), at(), GarlandShape, Ribbon, sag(), shape

### Community 143 - "Walker"
Cohesion: 0.19
Nodes (3): FloorPoint, WalkArea, Walker

### Community 144 - "The Moonlit Pond — design"
Cohesion: 0.09
Nodes (22): Art the pond needs from the artist, Build contract (decided 2026-11-07), Build phases, Collection and goals, Done, Done, Guardrails, Leaderboards (+14 more)

### Community 145 - "Pond rework"
Cohesion: 0.18
Nodes (10): Baits, Client, Decisions, Done, Notes, Pond rework, Server, Species (+2 more)

### Community 146 - "createStage"
Cohesion: 0.21
Nodes (15): shouldTick(), initialize(), aim(), drawFrame(), handleClick(), handlePointerDown(), handlePointerMove(), isResting() (+7 more)

### Community 147 - "Orchestration contract — you plan, DSH workers execute"
Cohesion: 0.29
Nodes (6): Briefing a worker, Budget hygiene, graphify, Orchestration contract — you plan, DSH workers execute, The worker, When not to delegate

### Community 148 - "tables.ts"
Cohesion: 0.11
Nodes (29): FrameShape, debugSpecies(), debugVariant(), guestTreasure(), rollGuest(), BAIT_BY_ID, catchPearls(), gaussian() (+21 more)

### Community 149 - "LeaderboardPanel.tsx"
Cohesion: 0.15
Nodes (22): fetchPondFeed(), PondBoardId, PondBoardPeriod, PondBoardRow, PondFeedItem, PondLeaderboard, catchLabel(), formatOdds() (+14 more)

### Community 150 - "useBackgroundMusic.ts"
Cohesion: 0.12
Nodes (26): BackgroundMusic, clampVolume(), isDocumentHidden(), Options, useBackgroundMusic(), VISIBILITY_EVENTS, EFFECTS, EffectSpec (+18 more)

### Community 151 - "readJsonBody"
Cohesion: 0.21
Nodes (13): roomEditor, PER_EDITOR, PUT(), versionOf(), PER_MEMBER, POST(), PER_EDITOR, POST() (+5 more)

### Community 152 - "SlotDef"
Cohesion: 0.20
Nodes (3): FakeServer, SlotState, SlotDef

### Community 153 - "HallArranger.tsx"
Cohesion: 0.23
Nodes (9): loadHallArranger(), HallArranger(), HallArrangerProps, HallRoomData, Painting, currentHallOrder(), hallPlacements(), paintingOrder() (+1 more)

### Community 154 - "Personal room: stress-test issues"
Cohesion: 0.18
Nodes (11): 1. Items placed against a zone edge fail to save, and the whole draft reverts, 2. One owned item can be placed many times, 3. Any save rejection throws away all unsaved work, 4. Changes made just before leaving are lost, 5. Fish trophies can be claimed without playing, Checked and fine, High, Not covered by this pass (+3 more)

### Community 155 - "import-hall-assets.mjs"
Cohesion: 0.13
Nodes (11): BASEBOARD, CURTAIN, drop, EXPECTED, manifest, manifestPath, masters, root (+3 more)

### Community 156 - "pond-photos.ts"
Cohesion: 0.24
Nodes (9): snapshot(), Checked against the mocks (2026-11-07), addPondPhoto(), AddPondPhotoResult, isJpeg(), POND_PHOTO_LIMIT, POND_PHOTO_MAX_BYTES, PondPhoto (+1 more)

### Community 157 - "Walkthrough.tsx"
Cohesion: 0.16
Nodes (18): BACKDROP_STYLE, MoreArrow(), NavArrow(), Props, SLIDE, Walkthrough(), XIcon(), decodedFrames (+10 more)

### Community 158 - "createPondRoom"
Cohesion: 0.32
Nodes (13): createPondRoom(), approach(), busy(), finishWalk(), goTo(), leave(), move(), nearest() (+5 more)

### Community 159 - "queryOne"
Cohesion: 0.11
Nodes (24): GET(), AnalyticsPage(), dynamic, BRAND, analyticsFor(), AnalyticsSummary, createInquiry(), ensureQrToken() (+16 more)

### Community 160 - "player-card.ts"
Cohesion: 0.09
Nodes (17): createPlayerCard(), hide(), onPointerDown(), Door, doorOf(), PlayerCard, wallpaperOf(), cozyLevel (+9 more)

### Community 161 - "defaultStore"
Cohesion: 0.18
Nodes (18): PondStateView, PondTier, ensurePondStateStarted(), getPondStateSnapshot(), GUEST, listeners, LOADING, PondStateSnapshot (+10 more)

### Community 162 - "createCozyBackdrop"
Cohesion: 0.11
Nodes (18): ceilingGeometry(), CozyBackdrop, createCozyBackdrop(), clearGlows(), glow(), paintShade(), placeGlows(), placeSides() (+10 more)

### Community 163 - "import-home-assets.mjs"
Cohesion: 0.10
Nodes (17): file(), DOOR, DOOR_BACKDROP, drop, FURNITURE, manifest, manifestPath, masters (+9 more)

### Community 164 - "getStorage"
Cohesion: 0.11
Nodes (18): CONTENT_TYPES, GET(), PUT(), ACCEPTED, createAssetFromUpload(), MAX_UPLOAD_BYTES, presignUpload(), registerUpload() (+10 more)

### Community 165 - "react"
Cohesion: 0.17
Nodes (13): openBugReport(), fitWidth(), HelpGuide(), HelpGuideProps, POINTER_STEPS, TOUCH_STEPS, MinigameFrameProps, SoundContext (+5 more)

### Community 168 - "infra/jobs.ts"
Cohesion: 0.23
Nodes (15): loop(), shutdown(), sleep(), sweepStale(), DrainResult, handler(), repairFrames(), repairUnframed() (+7 more)

### Community 169 - "Your Room: a room you can freely furnish"
Cohesion: 0.20
Nodes (9): Admin mode (gamma), Decisions (2026-11-17, with the user), Editor (web, `features/rooms/decorate/*`, `PersonalRoom.tsx`), Room look (web, `features/rooms/themes/cozy.ts`, `features/rooms/personal/room.ts`), Scale, Testing locally, What other games do (research, 2026-11-17), Work plan (+1 more)

### Community 170 - "Medium"
Cohesion: 0.22
Nodes (9): onClick(), 10. Long names run off the name sign, 11. The rooms API skips the stale-tab member check, 12. The bunny is dragged along while you pan in Decorate, 6. Failed saves are nearly invisible, and nothing retries, 7. Two tabs editing the same room overwrite each other, 8. The drawer's card row can't be scrolled on touch screens, 9. Decorating can't be done with the keyboard (+1 more)

### Community 171 - "Tasks"
Cohesion: 0.11
Nodes (14): JoinedRoom, Decisions (2026-11-05), Design for Phases 5–7 (2026-11-05), Follow-ups after Phases 4–7, Personal room polish (2026-11-05), Phase 2: hall on the stage, Phase 3: one persistent stage, Phase 6: decorating mode (+6 more)

### Community 172 - "layout.ts"
Cohesion: 0.17
Nodes (13): cafeAfterIndex(), comingSoonWidth(), computeLayout(), clear(), placeCafe(), cutRooms(), DoorSpan, HALL_DOOR_FOOT (+5 more)

### Community 173 - "a/[slug]/page.tsx"
Cohesion: 0.31
Nodes (6): ArtistPage(), dynamic, generateMetadata(), GET(), FollowForm(), getArtistPage()

### Community 174 - "Curating the paintings (2026-11-07)"
Cohesion: 0.12
Nodes (15): hang(), 1. The registry and the table, 2. The studio's Location picker, 3. The rooms draw what is placed, 4. Credits, 5. Retiring self-serve artists, Building it, Curating the paintings (2026-11-07) (+7 more)

### Community 175 - "hit.ts"
Cohesion: 0.17
Nodes (12): CoinWall, createHiddenCoin(), Spot, AlphaMap, alphaMapFor(), alphaMaps, buildAlphaMap(), isPaintedAt() (+4 more)

### Community 176 - "Local end-to-end stress test — 2026-11-06"
Cohesion: 0.22
Nodes (7): Environment and coverage, Follow-up coverage, Issue index, Local end-to-end stress test — 2026-11-06, Measured load, Passing checks and interpretation limits, Test data and cleanup

### Community 177 - "visits.ts"
Cohesion: 0.06
Nodes (49): state(), PER_VISITOR, POST(), dynamic, format(), grade(), METRICS, PAGES (+41 more)

### Community 179 - "createPlacementLayer"
Cohesion: 0.27
Nodes (9): aspectOf(), createPlacementLayer(), drawOutline(), dropGhosts(), dropHelper(), extrasFor(), silhouette(), sizeOf() (+1 more)

### Community 180 - "import-landing-assets.mjs"
Cohesion: 0.13
Nodes (9): socket(), CAT, drop, EXPECTED, manifest, manifestPath, masters, root (+1 more)

### Community 181 - "perf.ts"
Cohesion: 0.25
Nodes (4): createPerfMeter(), isEnabled(), PerfMeter, PerfSnapshot

### Community 182 - "schedule.test.ts"
Cohesion: 0.10
Nodes (16): RESIDENT_IDS, ROOM_KINDS, ROOMS, NpcRoom, ROOM_DOORS, SCHEDULE_SEED, SLOT_MS, ATELIER_INFO (+8 more)

### Community 183 - "Storyline (draft, saved 2026-11-17)"
Cohesion: 0.15
Nodes (12): Arc (soft, no fail state), Built so far, How it ties to what exists, Locked (2026-11-21, the owner), Next tasks (when picked up), Open questions, Premise, Revision (2026-11-21, the owner) (+4 more)

### Community 184 - "guestboard/route.ts"
Cohesion: 0.26
Nodes (10): POST(), POST(), rateLimitedResponse(), rejectedResponse(), BugReportRateLimited, postBugReport(), enforceLimits(), GuestNoteRateLimited (+2 more)

### Community 185 - "bake-pond-path.mjs"
Cohesion: 0.21
Nodes (7): blank(), manifest, manifestPath, ORIGINAL_SOURCE, originalPath(), root, softened()

### Community 186 - "createPersonalRoom"
Cohesion: 0.06
Nodes (26): CafeMarks, CafeLink, ComingSoonNote, FunZoneSign, GiftShopSigns, GuestBoardNotes, LobbySigns, Placards (+18 more)

### Community 187 - "Pedestal"
Cohesion: 0.14
Nodes (4): Helm, createNotes(), createPedestal(), Pedestal

### Community 189 - "DoorEditor.tsx"
Cohesion: 0.15
Nodes (13): ENTRANCE, firstLines(), linesOf(), PIXELS, REASONS, roomLabel(), DOOR_HEIGHT, DOOR_ROOMS (+5 more)

### Community 190 - "createPixelRatioGovernor"
Cohesion: 0.33
Nodes (7): createPixelRatioGovernor(), reset(), stepTo(), PIXEL_RATIO_STEPS, pixelRatioSteps(), Renderer, governor()

### Community 191 - "SyncStore"
Cohesion: 0.16
Nodes (7): encodeStored(), parseStored(), readStored(), removeStored(), writeStored(), SyncStore, upgrade()

### Community 192 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, db:schema, deploy:backend, dev, dev:presence, dev:web, dev:worker (+6 more)

### Community 193 - "Monets Lily Pond: exploration, UX and multiplayer QA"
Cohesion: 0.29
Nodes (6): Browser and interaction coverage, Changes made from the walkthrough, Monets Lily Pond: exploration, UX and multiplayer QA, Multiplayer and load, Practical limits, Regression checks and cleanup

### Community 195 - "createStage"
Cohesion: 0.28
Nodes (11): FLICK, flickDirection(), isUpwardFlick(), createNearby(), createStage(), closeEntry(), enter(), handlePointerUp() (+3 more)

### Community 196 - "gallery.ts"
Cohesion: 0.24
Nodes (11): deletePiece(), GalleryPiece, hangPiece(), MAX_STANDS, movePiece(), unhangPiece(), evaluatePublishBar(), PublishCheck (+3 more)

### Community 197 - "ticket.ts"
Cohesion: 0.23
Nodes (12): decoder, encoder, fromBase64Url(), HmacKey, isOwn(), isTicket(), keyFor(), keys (+4 more)

### Community 198 - "journal.ts"
Cohesion: 0.10
Nodes (23): PondMusic(), SONG, POND_SIGN_NAME, catchArt(), gradeLabel(), JOURNAL_FAMILIES, JOURNAL_GRADES, JOURNAL_SIZE (+15 more)

### Community 199 - "handlers.ts"
Cohesion: 0.10
Nodes (28): confirmedFollowers(), handleDerivatives(), handleNotifyFollowers(), handleRenderDisplay(), handleSealEpoch(), renderPieceFrame(), renderPieceSketch(), runJob() (+20 more)

### Community 201 - "messages.ts"
Cohesion: 0.43
Nodes (5): checkMessage(), INVISIBLE, MESSAGE_MAX, MessageCheck, normalizeMessage()

### Community 202 - "rig.ts"
Cohesion: 0.05
Nodes (72): CrowdPreviewPage(), RigPreviewPage(), CrowdPreview(), draw(), KINDS, Stats, Window, NEXT (+64 more)

### Community 204 - "walk"
Cohesion: 0.16
Nodes (13): walk(), 1. What is in this bundle, 2. How the game draws the bunny today (read from the repo, not run), 3. The rig, 4. Suggested plan, 5. Blender-side work still to do (needs Blender; the author has it with an MCP bridge), 6. Open questions for the author, Handoff: move the Tiny Museum bunny from sprite frames to a rig (+5 more)

### Community 205 - "nearby.ts"
Cohesion: 0.18
Nodes (5): Nearby, NearbyReach, RoomSpan, reach, strip

### Community 206 - "Low"
Cohesion: 0.25
Nodes (8): 13. Pages that redirect or don't exist answer 200, 14. Error codes reveal which room slugs exist, 15. The name sign slides under the top-right buttons in Decorate, 16. Level-up celebrations can be farmed, 17. No hint of where things are after panning away, 18. Too many items is only discovered by the server, 19. Development-only: page payloads include the full room row, Low

### Community 208 - "AssetImage"
Cohesion: 0.24
Nodes (10): coin, CoinFound(), CoinFoundProps, BunnyArtist(), BunnyMood, Pencil(), POSES, AssetImage() (+2 more)

### Community 209 - "app/layout.tsx"
Cohesion: 0.08
Nodes (25): config, SECURITY_HEADERS, bethEllen, inspiratiq, metadata, notoSans, RootLayout(), sniglet (+17 more)

### Community 210 - "AccountSheet.tsx"
Cohesion: 0.07
Nodes (26): PresencePreviewPage(), AccountSheet(), continueAnyway(), doSignOut(), runDelete(), runName(), submit(), submitDelete() (+18 more)

### Community 212 - ".webSocketMessage"
Cohesion: 0.44
Nodes (3): attachmentOf(), Room, sendTo()

### Community 213 - "Rig"
Cohesion: 0.17
Nodes (3): GlassRect, LiveReflection, Rig

### Community 214 - "icons.tsx"
Cohesion: 0.24
Nodes (9): BaitTray(), BaitTrayProps, GuestRollOptions, BAIT, BaitId, GLYPHS, PearlIcon(), POND_CRIMSON (+1 more)

### Community 215 - "createMinimap"
Cohesion: 0.31
Nodes (9): place(), createMinimap(), draw(), drawRoom(), floors(), sketchOf(), readCollapsed(), svg() (+1 more)

### Community 216 - "npc-sheet.cjs"
Cohesion: 0.24
Nodes (8): CFG, closeEye(), eraseMouth(), inpaint(), sample(), sharp, [src, out, cfgPath], warp()

### Community 225 - "painting-open"
Cohesion: 0.50
Nodes (4): file, kilobytes, seconds, painting-open

### Community 230 - "icon-basket"
Cohesion: 0.67
Nodes (3): icon-basket, file, vector

## Knowledge Gaps
- **5 isolated node(s):** `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1683 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **33 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `AtelierKeeps.tsx`, `SketchGuess.tsx`, `lib/assets.ts`, `machine.ts`, `Museum.tsx`, `bug-reports.ts`, `Test Fakes and Helpers`, `DecorDrawer.tsx`, `room-events.ts`, `PersonalRoom.tsx`, `LeaderboardPanel.tsx`, `useBackgroundMusic.ts`, `HallArranger.tsx`, `currentMember`, `pond-api.ts`, `Walkthrough.tsx`, `Web Package Dependencies`, `defaultStore`, `risk.ts`, `a/[slug]/page.tsx`, `stage.ts`, `paintings/page.tsx`, `visits.ts`, `Water.tsx`, `writeLocal`, `pond-format.ts`, `actions.ts`, `economy/store.ts`, `DoorEditor.tsx`, `useEscapeKey`, `GuestBoard.tsx`, `LandingFx`, `journal.ts`, `rig.ts`, `AssetImage`, `app/layout.tsx`, `AccountSheet.tsx`, `icons.tsx`, `pond/room.ts`, `FishingView.tsx`, `slots/store.ts`, `PondPanels.tsx`, `ClosetView.tsx`?**
  _High betweenness centrality (0.082) - this node is a cross-community bridge._
- **What connects `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json` to the rest of the system?**
  _5 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `AtelierKeeps.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10384615384615385 - nodes in this community are weakly interconnected._
- **Why does `three` connect `hall/room.ts` to `scene/assets.ts`, `remote-visitors.ts`, `scene.ts`, `cozy.ts`, `ambience.ts`, `Web Package Dependencies`, `rooms/art.ts`, `stage.ts`, `hit.ts`, `perf.ts`, `atelier.ts`, `createPersonalRoom`, `scene/ambience.ts`, `Placement`, `rig.ts`, `pond/art.ts`, `npc-sheet.cjs`, `GuideTalk.tsx`, `pond/room.ts`, `pond/room.ts`, `hang-tag.ts`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Should `rooms.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0462046204620462 - nodes in this community are weakly interconnected._
- **Why does `createPresence()` connect `createPresence` to `peers.ts`, `messages.ts`, `presence.test.ts`, `stage.ts`, `room-events.ts`, `AccountSheet.tsx`, `protocol.ts`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Should `SketchGuess.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09815078236130868 - nodes in this community are weakly interconnected._