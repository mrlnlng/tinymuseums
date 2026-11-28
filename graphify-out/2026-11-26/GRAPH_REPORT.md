# Graph Report - tiny-museum  (2026-11-26)

## Corpus Check
- 586 files · ~355,538 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 110 file(s) not represented in the graph (top: .avif 60, .glb 38, .css 7)

## Summary
- 5207 nodes · 13581 edges · 234 communities (200 shown, 34 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 267 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `bfc57e89`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- AtelierKeeps.tsx
- locations.ts
- SketchGuess.tsx
- DoorEditor.tsx
- app/page.tsx
- round.ts
- floor.ts
- Core Asset Manifest
- scene/assets.ts
- stage.ts
- machine.ts
- Museum.tsx
- Test Fakes and Helpers
- scene.ts
- cozy.ts
- logic.ts
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
- getStorage
- pond-api.ts
- ambience.ts
- core/src/index.ts
- Web Package Dependencies
- Gamifying Tiny Museum — genre direction & engagement research
- AssetImage
- hall/room.ts
- risk.ts
- amplify/tsconfig.json
- 5. Customization menu — what other people are doing
- createDecorController
- domain/sketch.ts
- Web TSConfig
- Root Package Manifest
- query
- currentMember
- import-fishing-assets.mjs
- Base TSConfig
- Amplify Build Spec
- epoch.ts
- actions.ts
- Placement
- env.ts
- Water.tsx
- Worker Package Manifest
- Public Asset Manifest
- museum/layout.tsx
- atelier.ts
- compose-atelier.mjs
- rules.ts
- pond-format.ts
- editor.ts
- economy/store.ts
- sketchguess/lib/api.ts
- room.ts
- minimap.ts
- ticket/route.ts
- domain/guestboard.ts
- Sound Effect Assets
- art-cache.ts
- Custom HTTP Headers
- Sharp Layer Package
- LandingFx
- scene/ambience.ts
- claim.ts
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
- createNpcLayer
- snapshot.ts
- pond/room.ts
- Other visitors
- Run-Once Schema
- pond/room.ts
- FishingView.tsx
- AtelierRoom
- hang-tag.ts
- createHallRoom
- json
- graftCostume
- pondgame/lib/api.ts
- worker/tsconfig.json
- core/tsconfig.json
- import-home-assets.mjs
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
- PondRoom.tsx
- bug-reports.ts
- ClosetView.tsx
- wallet/body.ts
- presence/tsconfig.json
- wallet.ts
- tsconfig.test.json
- rooms.ts
- BunnyArtist.tsx
- peers.ts
- run.ts
- useVisitorName.ts
- Tasks
- Conn
- room-places.ts
- bug-reports.ts
- outbox.test.ts
- RoomContents
- Walker
- The Moonlit Pond — design
- Pond rework
- initialize
- Orchestration contract — you plan, DSH workers execute
- tables.ts
- lib/presence.ts
- useBackgroundMusic.ts
- defaultStore
- SlotDef
- pond-boards.ts
- createMinimap
- import-hall-assets.mjs
- getStorage
- Walkthrough.tsx
- createPondRoom
- garlandRibbon
- createPlacementLayer
- Atelier: the dressing mirror, and show-don't-tell keeping
- personal/room.ts
- import-landing-assets.mjs
- Personal room: stress-test issues
- Multiplayer ("other visitors") — plan v2 (Cloudflare)
- Lobby
- createCozyBackdrop
- infra/jobs.ts
- boundedCameraX
- Medium
- HallArranger.tsx
- ticket.ts
- a/[slug]/page.tsx
- frame-clock.test.ts
- LeaderboardPanel.tsx
- react
- visits.ts
- paintedCostume
- Your Room: a room you can freely furnish
- performance/page.tsx
- perf.ts
- schedule.test.ts
- Storyline (draft, saved 2026-11-17)
- Local end-to-end stress test — 2026-11-06
- bake-pond-path.mjs
- personal/room.ts
- themes.ts
- draw.py
- VitalsReporter.tsx
- createPixelRatioGovernor
- SyncStore
- pond-photos.ts
- Monets Lily Pond: exploration, UX and multiplayer QA
- GameDesktop.tsx
- .webSocketMessage
- AccountSheet
- scripts
- PondPanels.tsx
- handlers.ts
- playwright
- ref_node_assert
- rig.ts
- npcs/README.md
- member-route.ts
- nearby.ts
- Low
- links.ts
- useSound
- app/layout.tsx
- lib/slots/index.ts
- TreeSparkles
- esbuild
- RoomSound
- Open rooms and the tip jar (design, 2026-11-21)
- createRoomPassage
- ref_sharp
- ArtCache
- Minimap
- doors.sql
- createStage
- Notes
- gesture.ts
- next.config.ts
- painting-open
- HelmShare
- Context
- EventTargetLike
- icon-basket
- bunny-left
- bunny-right
- icon-home
- ticket

## God Nodes (most connected - your core abstractions)
1. `react` - 87 edges
2. `json()` - 77 edges
3. `query()` - 72 edges
4. `PersonalRoom()` - 67 edges
5. `hit()` - 63 edges
6. `limited()` - 57 edges
7. `three` - 49 edges
8. `Traversal` - 48 edges
9. `next` - 47 edges
10. `createHallRoom()` - 47 edges

## Surprising Connections (you probably didn't know these)
- `Code` --references--> `followOutfit()`  [INFERRED]
  docs/costume-atelier.md → apps/web/src/features/hall/scene/wardrobe.ts
- `E2E-009 — Room mutations ignore stale account identity` --references--> `memberFromRequest()`  [INFERRED]
  docs/testing/local-e2e-stress-2026-11-06.md → apps/web/src/shared/lib/member-route.ts
- `Where things stand` --references--> `sealEpoch()`  [INFERRED]
  docs/curation-plan.md → packages/core/src/domain/epoch.ts
- `Checked against the mocks (2026-11-07)` --references--> `view()`  [INFERRED]
  docs/costume-atelier.md → packages/core/src/domain/pond-photos.ts
- `19. Development-only: page payloads include the full room row` --references--> `getRoom()`  [INFERRED]
  docs/personal-room-issues.md → packages/core/src/domain/rooms.ts

## Import Cycles
- None detected.

## Communities (234 total, 34 thin omitted)

### Community 0 - "AtelierKeeps.tsx"
Cohesion: 0.12
Nodes (29): CoinToast(), Toast, Purse(), Stamp(), serverSnapshot, useEarnEvents(), useWallet(), EarnSource (+21 more)

### Community 1 - "locations.ts"
Cohesion: 0.18
Nodes (27): AtelierPage(), dynamic, metadata, discardLocation(), hangableOnly(), hasUnpublished(), inUse(), locationStates() (+19 more)

### Community 2 - "SketchGuess.tsx"
Cohesion: 0.07
Nodes (44): PlaceInfo, BunnyArtist(), BunnyMood, Pencil(), POSES, bestKeyFor(), BURST, clueUrl() (+36 more)

### Community 3 - "DoorEditor.tsx"
Cohesion: 0.07
Nodes (49): saveDoorsAction(), DoorEditor(), add(), apply(), commitSlide(), nudge(), pick(), pointerDown() (+41 more)

### Community 4 - "app/page.tsx"
Cohesion: 0.15
Nodes (19): Loading(), dynamic, Hall(), MuseumPage(), [BRAND_OWNER, ...BRAND_REST], CurrentlyShowing(), Decor(), dynamic (+11 more)

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
Nodes (54): AssetManifest, assetUrl(), bitmapTexture(), blankImage(), CAFE_CAT_FRAMES, CharacterSprites, CompressedLoader, disposeDisplayTexture() (+46 more)

### Community 9 - "stage.ts"
Cohesion: 0.04
Nodes (40): CameraRig, Carried, Character, Options, Pose, STANDING, VisitorScenery, ROOM_ART (+32 more)

### Community 10 - "machine.ts"
Cohesion: 0.10
Nodes (47): CAST_ERRORS, coarsePointer(), FishingView(), initialEasyReel(), isTyping(), LOST, Toast, vibrate() (+39 more)

### Community 11 - "Museum.tsx"
Cohesion: 0.12
Nodes (28): motion@^13.1.1, Loading(), AtelierLoading(), CoinFound, ColorRecall, GameDesktop, GuestBoard, HallArranger (+20 more)

### Community 12 - "Test Fakes and Helpers"
Cohesion: 0.12
Nodes (27): deferredFetch(), deviceSlot, FakeEvents, FakeStorage, fixture, fixtureB, fixtureRegistry, fixtureRegistryBoth (+19 more)

### Community 13 - "scene.ts"
Cohesion: 0.06
Nodes (17): HiddenCoin, HallScene, markFirstPainting(), wallSize(), createPaintingLight(), disposeSpotlights(), getBeamMap(), getGlowMap() (+9 more)

### Community 14 - "cozy.ts"
Cohesion: 0.07
Nodes (45): ATELIER_PROPS, AtelierImage, atticWindowCanvas(), bareBulbCanvas(), boardsCanvas(), canvasTexture(), ceilingTexture(), cobwebCanvas() (+37 more)

### Community 15 - "logic.ts"
Cohesion: 0.14
Nodes (15): DecorDrawer, DecorDrawerProps, SLOT_LABELS, Tab, TABS, categoryOf(), DrawerCategory, FINISH_SLOTS (+7 more)

### Community 16 - "room-events.ts"
Cohesion: 0.10
Nodes (30): ChatButton(), REFUSED, joinRoom(), emit(), getPeople(), isInRoom(), isMuted(), muted (+22 more)

### Community 17 - "schedule.ts"
Cohesion: 0.07
Nodes (55): addDwellEmotes(), addEmote(), addGap(), addStand(), addWalk(), along(), buildRoomTable(), buildStayPlan() (+47 more)

### Community 18 - "ref_node_assert"
Cohesion: 0.13
Nodes (27): defineSlot(), docBytes(), SLOTS, byAtThenKey(), encoded(), latest, mapOf(), maxNumber() (+19 more)

### Community 19 - "amplify/package.json"
Cohesion: 0.08
Nodes (26): amplifyDir, backend, everyMinutes, mediaBucket, missing, repoRoot, REQUIRED, setting() (+18 more)

### Community 20 - "PersonalRoom.tsx"
Cohesion: 0.07
Nodes (69): errorReason(), Offer, overDrawer(), PersonalRoom(), canPlaceNew(), carriedTo(), carryEnd(), carryMove() (+61 more)

### Community 21 - "prepare-models.mjs"
Cohesion: 0.06
Nodes (40): alongArm(), ARMS, armTurn(), BODIES, bruce, BRUCE_FIT, BRUCE_PLACE, BRUCE_SLEEVES (+32 more)

### Community 22 - "Traversal"
Cohesion: 0.11
Nodes (4): clamp(), fixture(), jump(), Traversal

### Community 23 - "core/package.json"
Cohesion: 0.06
Nodes (40): dependencies, @aws-sdk/client-s3@^3.1121.0, @aws-sdk/s3-request-presigner@^3.1121.0, bcryptjs@^2.4.3, obscenity@^0.4.6, pg@^8.13.1, sharp@^0.33.5, thumbhash@^0.1.1 (+32 more)

### Community 24 - "hitForVisitor"
Cohesion: 0.10
Nodes (32): POST(), ALLOWED, PER_VISITOR, POST(), POST(), POST(), GLOBAL, PER_IP (+24 more)

### Community 25 - "members.ts"
Cohesion: 0.13
Nodes (33): Code, 3.2 Chosen names (members), registry, started(), hashPassword(), hashToken(), verifyPassword(), canonicalEmail() (+25 more)

### Community 26 - "getStorage"
Cohesion: 0.18
Nodes (15): GET(), PaintingRow, POST(), UPLOADS_PER_ARTIST, POST(), UPLOADS_PER_ARTIST, StudioLayout(), Badge() (+7 more)

### Community 27 - "pond-api.ts"
Cohesion: 0.14
Nodes (33): refreshWalletNow(), AlbumPanel(), remove(), buyPondBait(), claimPondBounty(), deletePondPhoto(), errorOf(), exchangePondPearls() (+25 more)

### Community 28 - "ambience.ts"
Cohesion: 0.12
Nodes (29): blade(), bloom(), BLOOMS, createPondAmbience(), update(), fishTexture(), frond(), FRONT_ROWS (+21 more)

### Community 29 - "core/src/index.ts"
Cohesion: 0.05
Nodes (111): addBait(), PondBoardMe, PondBoardRow, PondFeedItem, Rep, bountyCatches(), BountyCatchRow, bountyViews() (+103 more)

### Community 30 - "Web Package Dependencies"
Cohesion: 0.07
Nodes (34): dependencies, embla-carousel-react@^8.6.0, next@^15.0.3, react@^19.0.0, react-dom@^19.0.0, swr@^2.5.1, three@^0.169.0, thumbhash@^0.1.1 (+26 more)

### Community 31 - "Gamifying Tiny Museum — genre direction & engagement research"
Cohesion: 0.10
Nodes (19): 0.1 The core experience, 0.2 Systems that make gamification cheap to build, 0.3 Constraints that shape any recommendation, 0. What the game is today (the deep dive), 1.1 The landscape (seven candidates, with verdicts), 1.2 Recommendation: a **cozy gallery life-sim** — "the gallery you live in", 1.3 The five design pillars the genre implies, 1. Genre direction (+11 more)

### Community 32 - "AssetImage"
Cohesion: 0.16
Nodes (17): BoardScreen(), BoardScreenProps, PinnedNotes(), PinnedNotesProps, ReadScreen(), ReadScreenProps, messageLength(), StickyNote() (+9 more)

### Community 33 - "hall/room.ts"
Cohesion: 0.04
Nodes (74): Assets, Scenery, CUTS, disposeBoards(), Mark, plane(), ROPE_CUTS, ropeSlices() (+66 more)

### Community 34 - "risk.ts"
Cohesion: 0.12
Nodes (32): Hud(), HudProps, HudWagerChip, WagerPicker(), chooseTier(), WagerPickerProps, CastOptions, PondStateView (+24 more)

### Community 35 - "amplify/tsconfig.json"
Cohesion: 0.20
Nodes (9): compilerOptions, module, moduleResolution, noUnusedLocals, noUnusedParameters, exclude, extends, include (+1 more)

### Community 36 - "5. Customization menu — what other people are doing"
Cohesion: 0.12
Nodes (16): 1. The target: what "Claude Opus 5.5" actually means, 2. Where your harness stands today (live config I read), 3. The honest gap model, 4. Quality levers, ranked by leverage, 5. Customization menu — what other people are doing, 6. Recommended starting kit for *your* profile, 7. What I can apply for you right now (needs your go-ahead), A. Prompt & persona (most common quality customizations) (+8 more)

### Community 37 - "createDecorController"
Cohesion: 0.67
Nodes (4): createDecorController(), canvasRect(), targetRise(), toScreen()

### Community 38 - "domain/sketch.ts"
Cohesion: 0.11
Nodes (23): listPieces(), pieceImageUrl(), PieceRow, toPieceDto(), planSketchRound(), SKETCH_CHOICES, SketchCandidate, SketchPieceRow (+15 more)

### Community 39 - "Web TSConfig"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 40 - "Root Package Manifest"
Cohesion: 0.14
Nodes (17): description, devDependencies, concurrently@^9.1.0, ktx2-encoder@^0.6.0, maxrects-packer@^2.7.3, @types/node@^22.9.0, typescript@^5.6.3, typescript (+9 more)

### Community 41 - "query"
Cohesion: 0.08
Nodes (40): ConfirmFollow(), dynamic, dynamic, Unsubscribe(), AnalyticsPage(), dynamic, FollowNotice(), clearCatches() (+32 more)

### Community 42 - "currentMember"
Cohesion: 0.14
Nodes (17): GET(), PER_MEMBER, BOARDS, GET(), oneOf(), PER_VISITOR, PERIODS, PER_MEMBER (+9 more)

### Community 43 - "import-fishing-assets.mjs"
Cohesion: 0.10
Nodes (12): CANVAS, clear, FONT, FRAME, heights, layout, lossless, manifest (+4 more)

### Community 44 - "Base TSConfig"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, lib, module, moduleResolution (+9 more)

### Community 45 - "Amplify Build Spec"
Cohesion: 0.12
Nodes (16): applications, appRoot, backend, frontend, baseDirectory, files, phases, commands (+8 more)

### Community 46 - "epoch.ts"
Cohesion: 0.22
Nodes (15): GET(), intParam(), GET(), sketchPool, unavailable(), currentEpoch(), ensureEpoch(), epochById() (+7 more)

### Community 47 - "actions.ts"
Cohesion: 0.05
Nodes (82): BugReportsPage(), dateFormat, dynamic, summary(), DoorsPage(), dynamic, hallPaintings(), dateFormat (+74 more)

### Community 48 - "Placement"
Cohesion: 0.06
Nodes (22): dynamic, RoomPage(), Carry, PersonalRoomProps, GhostOptions, PlacementLayer, PlacementTheme, Catalogue (+14 more)

### Community 49 - "env.ts"
Cohesion: 0.08
Nodes (15): bodyTextures, COATS, { json, bin }, manifest, maps, target, manifest, isProduction() (+7 more)

### Community 50 - "Water.tsx"
Cohesion: 0.07
Nodes (38): AmbientShadow, box(), BUCKET, bunnyBox(), easeOut(), Glint, LEFT_STYLE, lineColour() (+30 more)

### Community 51 - "Worker Package Manifest"
Cohesion: 0.14
Nodes (14): dependencies, @tiny/core@*, exports, ./lambda, @tiny/core, main, name, private (+6 more)

### Community 52 - "Public Asset Manifest"
Cohesion: 0.12
Nodes (15): artworks, bunny, size, floor, size, fonts, icon-no-photos, size (+7 more)

### Community 53 - "museum/layout.tsx"
Cohesion: 0.31
Nodes (7): MuseumLayout(), WalletProvider(), setMuseumDoors(), MuseumDoors(), MuseumStage(), publishedDoors(), MuseumDoor

### Community 54 - "atelier.ts"
Cohesion: 0.05
Nodes (56): AtelierArt, AtelierDoor, AtelierImage, BuiltRoom, Cardigan, CARDIGAN_NAMES, Control, disposeAtelierArt() (+48 more)

### Community 55 - "compose-atelier.mjs"
Cohesion: 0.12
Nodes (10): body, dressLayer, dressWidth, floralWidth, hanger, MANNEQUIN_CANVAS, mask, root (+2 more)

### Community 56 - "rules.ts"
Cohesion: 0.16
Nodes (17): localDay(), at(), EXCHANGE_DAILY_STAMPS, EXCHANGE_PEARLS_PER_STAMP, exchangeClaimKey(), GAME_DAILY_CAP, GameId, GAMES (+9 more)

### Community 57 - "pond-format.ts"
Cohesion: 0.12
Nodes (27): gradeLabel(), fetchPondState(), EXCHANGE_DAILY_STAMPS, EXCHANGE_PEARLS_PER_STAMP, fishArt(), formatPercent(), ODDS_BAIT, POND_BAIT (+19 more)

### Community 58 - "editor.ts"
Cohesion: 0.20
Nodes (14): roomEditor, PER_EDITOR, PUT(), versionOf(), PER_MEMBER, POST(), PER_EDITOR, POST() (+6 more)

### Community 59 - "economy/store.ts"
Cohesion: 0.11
Nodes (42): outboxDue(), buy(), BuyOutcome, cappedTracked, EMPTY_BAIT, EMPTY_TODAY, ensureStarted(), eventListeners (+34 more)

### Community 60 - "sketchguess/lib/api.ts"
Cohesion: 0.14
Nodes (17): sameOriginUrl(), PreparedGame, prepareSketchGame(), decodeImage(), fetchBitmap(), fetchRound(), guarded(), InkMap (+9 more)

### Community 61 - "room.ts"
Cohesion: 0.12
Nodes (30): socket(), admitted(), Attachment, farewell(), GHOST_MS, HELLO_TIMEOUT_MS, holdsOf(), homeOf() (+22 more)

### Community 62 - "minimap.ts"
Cohesion: 0.14
Nodes (18): doorPoint(), FALLBACK_TINT, ICONS, MAP_PLACES, MAP_SCALE, MapPlan, MapRoomSketch, MapTheme (+10 more)

### Community 63 - "ticket/route.ts"
Cohesion: 0.20
Nodes (13): GET(), PER_MEMBER, PUT(), GET(), PER_IP, POST(), presenceUrl(), memberFromRequest() (+5 more)

### Community 64 - "domain/guestboard.ts"
Cohesion: 0.09
Nodes (34): GET(), ComposeScreen(), ComposeScreenProps, blankDraft(), GuestBoard(), GuestBoardProps, View, StickyNoteProps (+26 more)

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
Cohesion: 0.17
Nodes (8): createHallAmbience(), finish(), glowTexture(), HallAmbience, mulberry(), painted(), vignetteTexture(), Backdrop

### Community 71 - "claim.ts"
Cohesion: 0.16
Nodes (19): CARRY_CAP, carryAdd(), CarryEntry, carryPrune(), carryRemove(), chunk(), buildClaim(), BuiltClaim (+11 more)

### Community 72 - "Confirmed issues"
Cohesion: 0.11
Nodes (18): Confirmed issues, E2E-002 — Valid edge placement rejected through floating-point precision, E2E-003 — One owned prop can be placed multiple times, E2E-004 — Reload before autosave silently loses the latest placement, E2E-005 — Failed save and failed Done have no visible mobile explanation, E2E-006 — Restoring connectivity does not retry a failed draft save, E2E-007 — Keyboard activation cannot place drawer items, E2E-008 — Creating an account from My Room leaves the signed-in user on the sign-in prompt (+10 more)

### Community 73 - "Placement"
Cohesion: 0.07
Nodes (4): Job, DecorController, HighlightArea, WorkKind

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
Cohesion: 0.15
Nodes (20): colorAt(), decoded(), disposePondArt(), EDGE_BAND, EDGE_BANDS, EDGE_OVERLAP, edgeTexture(), imageOf() (+12 more)

### Community 80 - "createPresence"
Cohesion: 0.16
Nodes (14): createPresence(), drop(), heartbeat(), maybeSend(), onPageHide(), receive(), scheduleRetry(), send() (+6 more)

### Community 81 - "members"
Cohesion: 0.11
Nodes (27): coin_claims, coin_claims_daily, wallet_bait, wallet_items, wallets, member_sessions, member_sessions_member, member_slots (+19 more)

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
Cohesion: 0.09
Nodes (33): aspectOf(), AtelierActions, createAtelierRoom(), buildCollection(), form(), hang(), buildEntrance(), buildMirror() (+25 more)

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
Cohesion: 0.12
Nodes (26): FrameShape, GuideTalk(), createDoorGuides(), HallGuide, PROJECTED, BY_ID, CAST, castMember() (+18 more)

### Community 93 - "createNpcLayer"
Cohesion: 0.19
Nodes (19): createNpcLayer(), createResidentView(), createView(), departedRecently(), draw(), fadeOut(), glyphWidth(), hideAll() (+11 more)

### Community 94 - "snapshot.ts"
Cohesion: 0.23
Nodes (14): PondCamera(), snap(), composeJpeg(), copyCanvas(), grabLayers(), Layer, loadImage(), paint() (+6 more)

### Community 95 - "pond/room.ts"
Cohesion: 0.14
Nodes (23): water, depthAtLift(), FAR_LIFT, FAR_SCALE, liftAt(), pathHalfWidth(), pathX(), PondPath (+15 more)

### Community 96 - "Other visitors"
Cohesion: 0.29
Nodes (6): How it plays, Other visitors, Privacy, Running it in production, Running it locally, Staying consistent

### Community 104 - "pond/room.ts"
Cohesion: 0.05
Nodes (69): allowedCharacter(), OwnedSnapshot, owns(), walletReady(), getWalletSnapshot(), Atelier(), leave(), Props (+61 more)

### Community 105 - "FishingView.tsx"
Cohesion: 0.12
Nodes (16): CONFETTI_COLORS, ConfettiPiece, makeConfetti(), RevealCard(), TIER_MS, TIER_SFX, useCountUp(), chainOffer (+8 more)

### Community 107 - "hang-tag.ts"
Cohesion: 0.14
Nodes (7): CARD, createHangTag(), HangTag, HangTagStyle, HOLE, KNOT, What goes, and what replaces it

### Community 108 - "createHallRoom"
Cohesion: 0.07
Nodes (36): createBackdrop(), hangGarland(), floorShadeTexture(), painted(), wallShadeTexture(), cafeAfterIndex(), comingSoonWidth(), computeLayout() (+28 more)

### Community 109 - "json"
Cohesion: 0.12
Nodes (42): PER_MEMBER, PUT(), PER_MEMBER, POST(), catchIdOf(), isRecord(), MAX_POND_BODY_BYTES, pearlsOf() (+34 more)

### Community 110 - "graftCostume"
Cohesion: 0.27
Nodes (14): canvasFit(), compose(), graftCostume(), copyAccessor(), copyMaterial(), copyMesh(), copyTexture(), copyView() (+6 more)

### Community 111 - "pondgame/lib/api.ts"
Cohesion: 0.18
Nodes (23): PondGameProps, RevealCardProps, buyPondBait(), castPond(), chainPondBait(), errorOf(), fetchPondState(), isRecord() (+15 more)

### Community 112 - "worker/tsconfig.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 113 - "core/tsconfig.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 114 - "import-home-assets.mjs"
Cohesion: 0.14
Nodes (11): DOOR, DOOR_BACKDROP, drop, FURNITURE, manifest, manifestPath, masters, ORNATE_PAPER (+3 more)

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

### Community 120 - "Item"
Cohesion: 0.14
Nodes (3): Room, Presence, Item

### Community 121 - "Fishing forest: painted asset pass"
Cohesion: 0.10
Nodes (18): Assets, Bruce's collection refresh (2026-11-08), Fishing forest illustrations, Made by hand (not touched by the script), Main hall v2 (2026-11-10), Monets Lily Pond (2026-11-08), 1. Forest doorway, 2. Woodland noticeboard (+10 more)

### Community 124 - "The Costume Atelier"
Cohesion: 0.14
Nodes (13): Adding a character, Adding a costume, Art not supplied as files, Bruce's Chronicles, Checked against the mocks (2026-11-07), Code, Costume fit review, Floral collection (+5 more)

### Community 125 - "PondRoom.tsx"
Cohesion: 0.13
Nodes (14): Loading(), metadata, PondPage(), revealFloorTransition(), PondGame(), PondMusic(), POND_NAME, PondLoading() (+6 more)

### Community 126 - "bug-reports.ts"
Cohesion: 0.24
Nodes (11): BugReport, BugReportDto, BugReportRejected, BugRow, CONTEXT_KEYS, EVERYONE, normalizeBugPage(), parseBugReport() (+3 more)

### Community 127 - "ClosetView.tsx"
Cohesion: 0.09
Nodes (31): ClosetView(), onKeyDown(), LISTS, PLACE, PODIUM_SRC, Slot, SPOTLIGHT_SRC, Wheel() (+23 more)

### Community 128 - "wallet/body.ts"
Cohesion: 0.22
Nodes (13): PER_MEMBER, POST(), baitIdOf(), integerOffset(), isRecord(), itemIdOf(), MAX_CLAIM_BATCH, MAX_WALLET_BODY_BYTES (+5 more)

### Community 129 - "presence/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, types, exclude, extends, include, ../../tsconfig.base.json

### Community 130 - "wallet.ts"
Cohesion: 0.09
Nodes (40): member(), now, piece(), randomId(), today, baitOf(), applyClaim(), baitCounts() (+32 more)

### Community 131 - "tsconfig.test.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 132 - "rooms.ts"
Cohesion: 0.11
Nodes (26): artist(), member(), piece(), randomId(), main(), SCHEMA_DIR, getPondBounties(), personalRoomFor() (+18 more)

### Community 133 - "BunnyArtist.tsx"
Cohesion: 0.16
Nodes (13): walk(), 1. What is in this bundle, 2. How the game draws the bunny today (read from the repo, not run), 3. The rig, 4. Suggested plan, 5. Blender-side work still to do (needs Blender; the author has it with an MCP bridge), 6. Open questions for the author, Handoff: move the Tiny Museum bunny from sprite frames to a rig (+5 more)

### Community 134 - "peers.ts"
Cohesion: 0.14
Nodes (7): INTERPOLATION_DELAY_MS, PEER_TIMEOUT_MS, PeerTable, positionAt(), Sample, look, Peer

### Community 135 - "run.ts"
Cohesion: 0.18
Nodes (8): admin, childEnv, client, database, fresh, migrations, target, pg

### Community 136 - "useVisitorName.ts"
Cohesion: 0.24
Nodes (8): PresencePreviewPage(), PresencePreview(), announceNameChange(), useVisitorName(), VisitorName, NameCheck, randomSeed(), presence

### Community 137 - "Tasks"
Cohesion: 0.15
Nodes (10): Decisions (2026-11-05), Follow-ups after Phases 4–7, Personal room polish (2026-11-05), Phase 3: one persistent stage, Phase 6: decorating mode, Phase 7: personal rooms, Rooms, Stress-test fixes (2026-11-06) (+2 more)

### Community 138 - "Conn"
Cohesion: 0.31
Nodes (4): connectWebSocket(), SocketHandlers, Conn, message()

### Community 139 - "room-places.ts"
Cohesion: 0.22
Nodes (16): HallLayout, atelierRoomInfo(), atelierX(), copy(), FurniturePlacement, hallCache, hallRoomInfo(), onGround() (+8 more)

### Community 140 - "bug-reports.ts"
Cohesion: 0.20
Nodes (15): BugReportHost(), BugReportSheet, BugReportSheet(), send(), Status, collectContext(), inAppBrowser(), onOpenBugReport() (+7 more)

### Community 141 - "outbox.test.ts"
Cohesion: 0.29
Nodes (10): OUTBOX_CAP, outboxAdd(), OutboxEntry, outboxFail(), outboxRemove(), RETRY_BASE_MS, RETRY_MAX_MS, retryDelay() (+2 more)

### Community 142 - "RoomContents"
Cohesion: 0.18
Nodes (3): RoomContents, Model (`apps/web/src/features/rooms/types.ts`), Phase 2: hall on the stage

### Community 143 - "Walker"
Cohesion: 0.17
Nodes (4): PondPlaceData, FloorPoint, WalkArea, Walker

### Community 144 - "The Moonlit Pond — design"
Cohesion: 0.09
Nodes (22): Art the pond needs from the artist, Build contract (decided 2026-11-07), Build phases, Collection and goals, Done, Done, Guardrails, Leaderboards (+14 more)

### Community 145 - "Pond rework"
Cohesion: 0.18
Nodes (10): Baits, Client, Decisions, Done, Notes, Pond rework, Server, Species (+2 more)

### Community 146 - "initialize"
Cohesion: 0.21
Nodes (14): initialize(), aim(), drawFrame(), handleClick(), handlePointerDown(), handlePointerMove(), isResting(), prefetchNearDoors() (+6 more)

### Community 147 - "Orchestration contract — you plan, DSH workers execute"
Cohesion: 0.29
Nodes (6): Briefing a worker, Budget hygiene, graphify, Orchestration contract — you plan, DSH workers execute, The worker, When not to delegate

### Community 148 - "tables.ts"
Cohesion: 0.11
Nodes (30): BaitTray(), BaitTrayProps, debugSpecies(), debugVariant(), GuestRollOptions, guestTreasure(), rollGuest(), BAIT (+22 more)

### Community 149 - "lib/presence.ts"
Cohesion: 0.09
Nodes (22): Entry, Connect, fetchTicket, HEARTBEAT_MS, HIDDEN_LIMIT_MS, RETRY_MS, sameLook(), samePose() (+14 more)

### Community 150 - "useBackgroundMusic.ts"
Cohesion: 0.13
Nodes (26): SoundContext, SoundProvider(), BackgroundMusic, clampVolume(), isDocumentHidden(), Options, useBackgroundMusic(), VISIBILITY_EVENTS (+18 more)

### Community 151 - "defaultStore"
Cohesion: 0.15
Nodes (20): GLYPHS, PearlIcon(), POND_CRIMSON, PondIconName, PondStateView, PondTier, ensurePondStateStarted(), getPondStateSnapshot() (+12 more)

### Community 152 - "SlotDef"
Cohesion: 0.14
Nodes (5): FakeServer, SlotState, serverSnapshot(), serverSnapshots, SlotDef

### Community 153 - "pond-boards.ts"
Cohesion: 0.09
Nodes (29): CatchExtra, COLUMNS, insertCatch(), member(), namedMember(), randomId(), StatePatch, compare() (+21 more)

### Community 154 - "createMinimap"
Cohesion: 0.24
Nodes (11): place(), createMinimap(), draw(), drawRoom(), floors(), follow(), sketchOf(), panTo() (+3 more)

### Community 155 - "import-hall-assets.mjs"
Cohesion: 0.09
Nodes (17): BASEBOARD, CURTAIN, drop, EXPECTED, file(), manifest, manifestPath, masters (+9 more)

### Community 156 - "getStorage"
Cohesion: 0.09
Nodes (18): CONTENT_TYPES, GET(), PUT(), ACCEPTED, createAssetFromUpload(), MAX_UPLOAD_BYTES, presignUpload(), registerUpload() (+10 more)

### Community 157 - "Walkthrough.tsx"
Cohesion: 0.14
Nodes (20): BACKDROP_STYLE, MoreArrow(), NavArrow(), Props, SLIDE, Walkthrough(), XIcon(), decodedFrames (+12 more)

### Community 158 - "createPondRoom"
Cohesion: 0.32
Nodes (13): createPondRoom(), approach(), busy(), finishWalk(), goTo(), leave(), move(), nearest() (+5 more)

### Community 159 - "garlandRibbon"
Cohesion: 0.39
Nodes (6): garlandRibbon(), at(), GarlandShape, Ribbon, sag(), shape

### Community 160 - "createPlacementLayer"
Cohesion: 0.31
Nodes (8): aspectOf(), createPlacementLayer(), drawOutline(), dropGhosts(), dropHelper(), extrasFor(), silhouette(), sizeOf()

### Community 161 - "Atelier: the dressing mirror, and show-don't-tell keeping"
Cohesion: 0.13
Nodes (14): Atelier: the dressing mirror, and show-don't-tell keeping, Build order, Built (2026-11-20), Decisions (2026-11-19), Follow-ups (2026-11-20), Goal, In the room, Keeping (+6 more)

### Community 162 - "personal/room.ts"
Cohesion: 0.08
Nodes (22): PersonalArt, createPersonalRoom(), light(), shade(), showArrangement(), signFilter(), DOOR_SIGN, gloomFor() (+14 more)

### Community 163 - "import-landing-assets.mjs"
Cohesion: 0.18
Nodes (8): CAT, drop, EXPECTED, manifest, manifestPath, masters, root, target

### Community 164 - "Personal room: stress-test issues"
Cohesion: 0.18
Nodes (11): 1. Items placed against a zone edge fail to save, and the whole draft reverts, 2. One owned item can be placed many times, 3. Any save rejection throws away all unsaved work, 4. Changes made just before leaving are lost, 5. Fish trophies can be claimed without playing, Checked and fine, High, Not covered by this pass (+3 more)

### Community 165 - "Multiplayer ("other visitors") — plan v2 (Cloudflare)"
Cohesion: 0.10
Nodes (20): ScreenChrome(), 0. Summary, 10. Decisions, 1. Product contract changes (approved 2026-10-31), 2. What already exists that this builds on, 3.1 Generated names (everyone has one), 3. Names, 4. Transport: Cloudflare Durable Objects (+12 more)

### Community 167 - "createCozyBackdrop"
Cohesion: 0.23
Nodes (13): alphaCanvas(), ceilingGeometry(), createCozyBackdrop(), clearGlows(), glow(), paintShade(), placeGlows(), placeSides() (+5 more)

### Community 168 - "infra/jobs.ts"
Cohesion: 0.23
Nodes (15): loop(), shutdown(), sleep(), sweepStale(), DrainResult, handler(), repairFrames(), repairUnframed() (+7 more)

### Community 170 - "Medium"
Cohesion: 0.22
Nodes (9): onClick(), 10. Long names run off the name sign, 11. The rooms API skips the stale-tab member check, 12. The bunny is dragged along while you pan in Decorate, 6. Failed saves are nearly invisible, and nothing retries, 7. Two tabs editing the same room overwrite each other, 8. The drawer's card row can't be scrolled on touch screens, 9. Decorating can't be done with the keyboard (+1 more)

### Community 171 - "HallArranger.tsx"
Cohesion: 0.27
Nodes (7): loadHallArranger(), HallArranger(), HallArrangerProps, HallRoomData, Painting, hallPlacements(), reasonLabel()

### Community 172 - "ticket.ts"
Cohesion: 0.23
Nodes (12): decoder, encoder, fromBase64Url(), HmacKey, isOwn(), isTicket(), keyFor(), keys (+4 more)

### Community 173 - "a/[slug]/page.tsx"
Cohesion: 0.31
Nodes (6): ArtistPage(), dynamic, generateMetadata(), GET(), FollowForm(), getArtistPage()

### Community 174 - "frame-clock.test.ts"
Cohesion: 0.36
Nodes (6): MAX_CATCH_UP_SECONDS, MAX_STEP_SECONDS, movementSteps(), RESTING_TICK_MS, shouldTick(), walker()

### Community 175 - "LeaderboardPanel.tsx"
Cohesion: 0.13
Nodes (26): fetchPondFeed(), PondBoardId, PondBoardPeriod, PondBoardRow, PondFeedItem, PondLeaderboard, catchLabel(), formatCountdown() (+18 more)

### Community 176 - "react"
Cohesion: 0.14
Nodes (19): openBugReport(), fitWidth(), HelpGuide(), HelpGuideProps, POINTER_STEPS, TOUCH_STEPS, MinigameFrameProps, KeepsakeFound() (+11 more)

### Community 177 - "visits.ts"
Cohesion: 0.08
Nodes (39): state(), PER_VISITOR, POST(), amount(), duration(), dynamic, LANDMARKS, PAGES (+31 more)

### Community 178 - "paintedCostume"
Cohesion: 0.40
Nodes (3): paintedCostume(), Fitting clothes to other characters, Headpieces

### Community 179 - "Your Room: a room you can freely furnish"
Cohesion: 0.20
Nodes (9): Admin mode (gamma), Decisions (2026-11-17, with the user), Editor (web, `features/rooms/decorate/*`, `PersonalRoom.tsx`), Room look (web, `features/rooms/themes/cozy.ts`, `features/rooms/personal/room.ts`), Scale, Testing locally, What other games do (research, 2026-11-17), Work plan (+1 more)

### Community 180 - "performance/page.tsx"
Cohesion: 0.31
Nodes (8): dynamic, format(), grade(), METRICS, PAGES, PerformancePage(), RANGES, summarizeVitals()

### Community 181 - "perf.ts"
Cohesion: 0.22
Nodes (5): createPerfMeter(), snapshot(), isEnabled(), PerfMeter, PerfSnapshot

### Community 182 - "schedule.test.ts"
Cohesion: 0.07
Nodes (29): FloorSpot, Job, JOBS, NpcGround, Place, PlaceKind, ROOM_KINDS, ROOMS (+21 more)

### Community 183 - "Storyline (draft, saved 2026-11-17)"
Cohesion: 0.15
Nodes (12): Arc (soft, no fail state), Built so far, How it ties to what exists, Locked (2026-11-21, the owner), Next tasks (when picked up), Open questions, Premise, Revision (2026-11-21, the owner) (+4 more)

### Community 184 - "Local end-to-end stress test — 2026-11-06"
Cohesion: 0.22
Nodes (7): Environment and coverage, Follow-up coverage, Issue index, Local end-to-end stress test — 2026-11-06, Measured load, Passing checks and interpretation limits, Test data and cleanup

### Community 185 - "bake-pond-path.mjs"
Cohesion: 0.21
Nodes (7): blank(), manifest, manifestPath, ORIGINAL_SOURCE, originalPath(), root, softened()

### Community 186 - "personal/room.ts"
Cohesion: 0.06
Nodes (13): CafeLink, ComingSoonNote, FunZoneSign, GiftShopSigns, GuestBoardNotes, LobbySigns, Placards, placeLabel() (+5 more)

### Community 187 - "themes.ts"
Cohesion: 0.06
Nodes (35): confirmClean(), Door, doorOf(), PlayerCard, wallpaperOf(), ownsAll, ownsNone, GAMES (+27 more)

### Community 189 - "VitalsReporter.tsx"
Cohesion: 0.29
Nodes (8): firstPainting(), flush(), Metric, queue, REPORTED, VitalsReporter(), FIRST_PAINTING_MARK, MUSEUM_START_MARK

### Community 190 - "createPixelRatioGovernor"
Cohesion: 0.33
Nodes (7): createPixelRatioGovernor(), reset(), stepTo(), PIXEL_RATIO_STEPS, pixelRatioSteps(), Renderer, governor()

### Community 191 - "SyncStore"
Cohesion: 0.11
Nodes (22): ANON_PREFIX, anonKey(), deviceKey(), encodeStored(), isMemberSlotKey(), listKeys(), MEMBER_KEY, memberKey() (+14 more)

### Community 192 - "pond-photos.ts"
Cohesion: 0.29
Nodes (9): addPondPhoto(), AddPondPhotoResult, isJpeg(), listPondPhotos(), POND_PHOTO_LIMIT, POND_PHOTO_MAX_BYTES, PondPhoto, view() (+1 more)

### Community 193 - "Monets Lily Pond: exploration, UX and multiplayer QA"
Cohesion: 0.29
Nodes (6): Browser and interaction coverage, Changes made from the walkthrough, Monets Lily Pond: exploration, UX and multiplayer QA, Multiplayer and load, Practical limits, Regression checks and cleanup

### Community 194 - "GameDesktop.tsx"
Cohesion: 0.33
Nodes (7): loadGameDesktop(), GameDesktop(), GameDesktopProps, MinigameFrame(), Minigame, MinigameId, MINIGAMES

### Community 195 - ".webSocketMessage"
Cohesion: 0.44
Nodes (3): attachmentOf(), Room, sendTo()

### Community 196 - "AccountSheet"
Cohesion: 0.29
Nodes (9): AccountSheet(), continueAnyway(), doSignOut(), runDelete(), runName(), submit(), submitDelete(), submitName() (+1 more)

### Community 197 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, db:schema, deploy:backend, dev, dev:presence, dev:web, dev:worker (+6 more)

### Community 198 - "PondPanels.tsx"
Cohesion: 0.10
Nodes (26): SONG, catchArt(), JOURNAL_FAMILIES, JOURNAL_GRADES, JOURNAL_SIZE, journalFamily, KeepsakeId, KEEPSAKES (+18 more)

### Community 199 - "handlers.ts"
Cohesion: 0.08
Nodes (38): Design for Phases 5–7 (2026-11-05), confirmedFollowers(), sealEpoch(), DisplayPieceRow, handleDerivatives(), handleNotifyFollowers(), handleRenderDisplay(), handleSealEpoch() (+30 more)

### Community 200 - "playwright"
Cohesion: 0.40
Nodes (3): [, width, height], playwright@^1.63.0, playwright

### Community 201 - "ref_node_assert"
Cohesion: 0.15
Nodes (12): valid, checkMessage(), INVISIBLE, MESSAGE_MAX, MessageCheck, normalizeMessage(), ADJECTIVES, NAME_LIMITS (+4 more)

### Community 202 - "rig.ts"
Cohesion: 0.04
Nodes (82): CrowdPreviewPage(), RigPreviewPage(), CrowdPreview(), draw(), KINDS, Stats, Window, NEXT (+74 more)

### Community 204 - "member-route.ts"
Cohesion: 0.16
Nodes (18): POST(), POST(), POST(), POST(), readCapped(), READS, UPLOADS, checkPasswordRateLimit() (+10 more)

### Community 205 - "nearby.ts"
Cohesion: 0.18
Nodes (5): Nearby, NearbyReach, RoomSpan, reach, strip

### Community 206 - "Low"
Cohesion: 0.25
Nodes (8): 13. Pages that redirect or don't exist answer 200, 14. Error codes reveal which room slugs exist, 15. The name sign slides under the top-right buttons in Decorate, 16. Level-up celebrations can be farmed, 17. No hint of where things are after panning away, 18. Too many items is only discovered by the server, 19. Development-only: page payloads include the full room row, Low

### Community 207 - "links.ts"
Cohesion: 0.43
Nodes (6): museumDoors(), EXITS, isDoor(), linkedDoor(), ROOM_PATH, doorTarget()

### Community 208 - "useSound"
Cohesion: 0.16
Nodes (17): ColorRecall(), ColorRecallProps, Phase, readBest(), ColorRound, showMs(), earn(), emit() (+9 more)

### Community 209 - "app/layout.tsx"
Cohesion: 0.16
Nodes (12): bethEllen, inspiratiq, metadata, notoSans, RootLayout(), sniglet, viewport, ServiceWorker() (+4 more)

### Community 210 - "lib/slots/index.ts"
Cohesion: 0.09
Nodes (16): AccountHost(), AccountSheet, NAME_ERRORS, Pending, View, KeepOnOtherDevices(), AccountMode, onOpenAccount() (+8 more)

### Community 213 - "RoomSound"
Cohesion: 0.33
Nodes (4): StageOptions, RoomSound, SoundState, EffectName

### Community 214 - "Open rooms and the tip jar (design, 2026-11-21)"
Cohesion: 0.29
Nodes (6): Built (2026-11-21), Decisions, Numbers (first pass, to tune), Open questions, Open rooms and the tip jar (design, 2026-11-21), Story hooks

### Community 215 - "createRoomPassage"
Cohesion: 0.60
Nodes (3): coverFloorTransition(), createRoomPassage(), fixture()

### Community 216 - "ref_sharp"
Cohesion: 0.31
Nodes (8): CFG, closeEye(), eraseMouth(), inpaint(), sample(), sharp, [src, out, cfgPath], warp()

### Community 221 - "createStage"
Cohesion: 0.25
Nodes (12): FLICK, flickDirection(), isUpwardFlick(), createNearby(), createStage(), closeEntry(), enter(), handlePointerUp() (+4 more)

### Community 225 - "painting-open"
Cohesion: 0.50
Nodes (4): file, kilobytes, seconds, painting-open

### Community 230 - "icon-basket"
Cohesion: 0.67
Nodes (3): icon-basket, file, vector

## Knowledge Gaps
- **5 isolated node(s):** `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1674 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **34 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `AtelierKeeps.tsx`, `SketchGuess.tsx`, `DoorEditor.tsx`, `app/page.tsx`, `useVisitorName.ts`, `stage.ts`, `machine.ts`, `Museum.tsx`, `bug-reports.ts`, `Test Fakes and Helpers`, `logic.ts`, `room-events.ts`, `PersonalRoom.tsx`, `tables.ts`, `useBackgroundMusic.ts`, `defaultStore`, `SlotDef`, `pond-api.ts`, `Walkthrough.tsx`, `Web Package Dependencies`, `AssetImage`, `risk.ts`, `HallArranger.tsx`, `a/[slug]/page.tsx`, `LeaderboardPanel.tsx`, `actions.ts`, `Water.tsx`, `museum/layout.tsx`, `pond-format.ts`, `economy/store.ts`, `VitalsReporter.tsx`, `domain/guestboard.ts`, `LandingFx`, `PondPanels.tsx`, `rig.ts`, `useSound`, `app/layout.tsx`, `lib/slots/index.ts`, `GuideTalk.tsx`, `pond/room.ts`, `FishingView.tsx`, `PondRoom.tsx`, `ClosetView.tsx`?**
  _High betweenness centrality (0.091) - this node is a cross-community bridge._
- **What connects `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json` to the rest of the system?**
  _5 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `AtelierKeeps.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11666666666666667 - nodes in this community are weakly interconnected._
- **Why does `three` connect `hall/room.ts` to `scene/ambience.ts`, `scene/assets.ts`, `stage.ts`, `rig.ts`, `hang-tag.ts`, `createHallRoom`, `scene.ts`, `pond/room.ts`, `pond/art.ts`, `cozy.ts`, `paintedCostume`, `perf.ts`, `atelier.ts`, `GuideTalk.tsx`, `ambience.ts`, `Web Package Dependencies`, `ClosetView.tsx`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Should `SketchGuess.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06936026936026936 - nodes in this community are weakly interconnected._
- **Why does `defaultStore()` connect `pond/room.ts` to `hall/room.ts`, `economy/store.ts`, `stage.ts`, `currentMember`, `createHallRoom`, `pondgame/lib/api.ts`, `room-events.ts`, `lib/slots/index.ts`, `initialize`, `PersonalRoom.tsx`, `defaultStore`, `SlotDef`, `pond-api.ts`, `createStage`, `createPondRoom`, `SyncStore`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Should `DoorEditor.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07474747474747474 - nodes in this community are weakly interconnected._