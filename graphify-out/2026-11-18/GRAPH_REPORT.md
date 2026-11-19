# Graph Report - tiny-museum  (2026-11-18)

## Corpus Check
- 520 files · ~308,758 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 95 file(s) not represented in the graph (top: .avif 52, .glb 34, .css 4)

## Summary
- 4664 nodes · 12044 edges · 219 communities (186 shown, 33 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 244 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `af052d94`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- remote-visitors.ts
- walk.ts
- SketchGuess.tsx
- themes.ts
- Rig
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
- actions.ts
- room-events.ts
- schedule.ts
- ref_node_assert
- amplify/package.json
- PersonalRoom.tsx
- prepare-models.mjs
- Traversal
- core/package.json
- wardrobe.ts
- Placement
- catalog.ts
- LeaderboardPanel.tsx
- ambience.ts
- core/src/index.ts
- Web Package Dependencies
- Gamifying Tiny Museum — genre direction & engagement research
- atelier.ts
- editor.ts
- risk.ts
- amplify/tsconfig.json
- 5. Customization menu — what other people are doing
- wallet.test.ts
- query
- Web TSConfig
- Root Package Manifest
- RigPreview.tsx
- xdog.ts
- import-fishing-assets.mjs
- Base TSConfig
- Amplify Build Spec
- sketchguess/lib/api.ts
- rooms/art.ts
- FakeServer
- writeStyle
- Water.tsx
- Worker Package Manifest
- Public Asset Manifest
- MuseumStage.tsx
- rules.ts
- compose-atelier.mjs
- messages.ts
- pond-format.ts
- db-tests/pond.test.ts
- economy/store.ts
- LandingFx
- room.ts
- minimap.ts
- Notes
- domain/guestboard.ts
- Sound Effect Assets
- initialize
- Custom HTTP Headers
- Sharp Layer Package
- currentMember
- scene/ambience.ts
- import-home-assets.mjs
- member-route.ts
- createCharacter
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
- ticket/route.ts
- Bug Reports SQL Schema
- Vitals SQL Schema
- json
- createRemoteVisitors
- pond/room.ts
- members.ts
- Run-Once Schema
- LandingFx
- FishingView.tsx
- ticket.ts
- import-hall-assets.mjs
- react
- backend.ts
- graftCostume
- pondgame/lib/api.ts
- worker/tsconfig.json
- core/tsconfig.json
- CrowdPreview.tsx
- How to Design for Failures — ByteByteGo Newsletter
- Worker instructions — DSH headless agents
- Backend
- protocol.ts
- Costume gallery doorway
- art-cache.ts
- Fishing forest: painted asset pass
- audio/README.md
- .claude/CLAUDE.md
- The Costume Atelier
- Confirmed issues
- rig.ts
- Curating the paintings (2026-11-07)
- limited
- presence/tsconfig.json
- env.ts
- tsconfig.test.json
- app/layout.tsx
- writeLocal
- lib/presence.ts
- Item
- bug-reports.ts
- schedule.test.ts
- hall/room.ts
- layout.ts
- lib/presence.ts
- tab-turn.ts
- guestboard/route.ts
- Local end-to-end stress test — 2026-11-06
- The Moonlit Pond — design
- Pond rework
- hit.ts
- Orchestration contract — you plan, DSH workers execute
- tables.ts
- jobs.ts
- locations.ts
- pond-state.ts
- plan.ts
- app/page.tsx
- createNpcLayer
- wallet.ts
- outbox.test.ts
- Walkthrough.tsx
- createPondRoom
- useSoundEffects.ts
- nearby.ts
- RoomSound
- features/economy/index.ts
- painting-open
- rooms.ts
- Multiplayer ("other visitors") — plan v2 (Cloudflare)
- Lobby
- run.ts
- wallet/body.ts
- icon-basket
- S3Storage
- visits.ts
- lib/assets.ts
- bunny-left
- AssetImage
- bunny-right
- logic.ts
- confirm/page.tsx
- icon-home
- createCozyBackdrop
- audience.ts
- ticket
- AccountSheet
- Storyline (draft, saved 2026-11-17)
- createMinimap
- Cafe
- Low
- perf.ts
- draw.py
- ensureEpoch
- createHallRoom
- Context
- GameDesktop.tsx
- Monets Lily Pond: exploration, UX and multiplayer QA
- VitalsReporter.tsx
- .webSocketMessage
- Your Room: a room you can freely furnish
- pond-api.ts
- lib/slots/index.ts
- Placement
- 4. Transport: Cloudflare Durable Objects
- import-landing-assets.mjs
- reveal.ts
- npcs/README.md
- Other visitors
- visits/page.tsx
- FilesystemStorage
- performance/page.tsx
- createPlacementLayer
- ArtCache
- PondRoom.tsx
- revealFloorTransition
- Sitting
- Minimap
- boundedCameraX
- HelmShare
- TreeSparkles
- PlaceInfo
- lib/presence.ts

## God Nodes (most connected - your core abstractions)
1. `react` - 77 edges
2. `json()` - 72 edges
3. `query()` - 68 edges
4. `PersonalRoom()` - 67 edges
5. `hit()` - 58 edges
6. `limited()` - 52 edges
7. `three` - 46 edges
8. `next` - 44 edges
9. `Traversal` - 44 edges
10. `SyncStore` - 41 edges

## Surprising Connections (you probably didn't know these)
- `E2E-001 — Alternate local origin breaks artwork fallback URLs` --references--> `sameOriginUrl()`  [INFERRED]
  docs/testing/local-e2e-stress-2026-11-06.md → apps/web/src/features/hall/lib/media.ts
- `Code` --references--> `followOutfit()`  [INFERRED]
  docs/costume-atelier.md → apps/web/src/features/hall/scene/wardrobe.ts
- `E2E-009 — Room mutations ignore stale account identity` --references--> `memberFromRequest()`  [INFERRED]
  docs/testing/local-e2e-stress-2026-11-06.md → apps/web/src/shared/lib/member-route.ts
- `Where things stand` --references--> `sealEpoch()`  [INFERRED]
  docs/curation-plan.md → packages/core/src/domain/epoch.ts
- `19. Development-only: page payloads include the full room row` --references--> `getRoom()`  [INFERRED]
  docs/personal-room-issues.md → packages/core/src/domain/rooms.ts

## Import Cycles
- None detected.

## Communities (219 total, 33 thin omitted)

### Community 0 - "remote-visitors.ts"
Cohesion: 0.05
Nodes (45): CharacterSprites, CameraRig, Attachment, Carried, CarriedState, Character, Perch, Pose (+37 more)

### Community 1 - "walk.ts"
Cohesion: 0.12
Nodes (14): FloorPoint, WalkArea, water, depthAtLift(), PROP_DEPTH, DEPTH_SPAN, depthOf(), MAX_DEPTH (+6 more)

### Community 2 - "SketchGuess.tsx"
Cohesion: 0.10
Nodes (30): bestKeyFor(), BURST, clueUrl(), Phase, pickAtRandom(), readDifficulty(), readMode(), saveIfHigher() (+22 more)

### Community 3 - "themes.ts"
Cohesion: 0.05
Nodes (38): COLLECTIONS, Catalogue, Data model (core), 1. Items placed against a zone edge fail to save, and the whole draft reverts, 2. One owned item can be placed many times, 3. Any save rejection throws away all unsaved work, 4. Changes made just before leaving are lost, 5. Fish trophies can be claimed without playing (+30 more)

### Community 4 - "Rig"
Cohesion: 0.25
Nodes (3): RigState, Rig, Shown

### Community 5 - "round.ts"
Cohesion: 0.15
Nodes (27): deltaE(), GAMUT_EPSILON, hexToOklab(), inGamut(), linearRgbToOklab(), linearToSrgb(), Oklab, oklabToLinearRgb() (+19 more)

### Community 6 - "floor.ts"
Cohesion: 0.13
Nodes (34): clone(), closestOnSegment(), contains(), cross(), crossVec(), depthAtY(), depthBounds(), depthT() (+26 more)

### Community 7 - "Core Asset Manifest"
Cohesion: 0.05
Nodes (41): artworks, audio, file, megabytes, seconds, sourceName, startedAt, bunny (+33 more)

### Community 8 - "scene/assets.ts"
Cohesion: 0.09
Nodes (40): AssetManifest, assetUrl(), bitmapTexture(), blankImage(), CAFE_CAT_FRAMES, CompressedLoader, elementTexture(), ENTRANCE_FILES (+32 more)

### Community 9 - "SyncStore"
Cohesion: 0.10
Nodes (22): ANON_PREFIX, anonKey(), deviceKey(), encodeStored(), isMemberSlotKey(), listKeys(), MEMBER_KEY, memberKey() (+14 more)

### Community 10 - "machine.ts"
Cohesion: 0.10
Nodes (47): CAST_ERRORS, coarsePointer(), FishingView(), initialEasyReel(), isTyping(), LOST, Toast, vibrate() (+39 more)

### Community 11 - "Museum.tsx"
Cohesion: 0.14
Nodes (25): PinnedNotes(), CoinFound, ColorRecall, GameDesktop, GuestBoard, HallArranger, HelpGuide, loadCoinFound() (+17 more)

### Community 12 - "Test Fakes and Helpers"
Cohesion: 0.12
Nodes (26): deferredFetch(), deviceSlot, FakeEvents, FakeStorage, fixture, fixtureB, fixtureRegistry, fixtureRegistryBoth (+18 more)

### Community 13 - "scene.ts"
Cohesion: 0.05
Nodes (24): disposeDisplayTexture(), prefersAvif(), HiddenCoin, createNotes(), createPedestal(), Pedestal, PedestalVoice, placeholderTexture() (+16 more)

### Community 14 - "cozy.ts"
Cohesion: 0.06
Nodes (58): alphaCanvas(), ATELIER_PROPS, AtelierImage, atticWindowCanvas(), bareBulbCanvas(), boardsCanvas(), canvasTexture(), ceilingGeometry() (+50 more)

### Community 15 - "actions.ts"
Cohesion: 0.06
Nodes (79): config, SECURITY_HEADERS, BugReportsPage(), dateFormat, dynamic, summary(), dynamic, GalleryPage() (+71 more)

### Community 16 - "room-events.ts"
Cohesion: 0.19
Nodes (25): ChatButton(), REFUSED, joinRoom(), emit(), getPeople(), isInRoom(), isMuted(), muted (+17 more)

### Community 17 - "schedule.ts"
Cohesion: 0.11
Nodes (35): Emote, ambientEmotes(), Anchors, anchorsFor(), buildSlot(), clamp(), cloneSpot(), doorSpot() (+27 more)

### Community 18 - "ref_node_assert"
Cohesion: 0.10
Nodes (31): fixtureRegistry, defineSlot(), docBytes(), SLOTS, byAtThenKey(), encoded(), latest, mapOf() (+23 more)

### Community 19 - "amplify/package.json"
Cohesion: 0.17
Nodes (14): devDependencies, @aws-amplify/backend@^1.14.0, @aws-amplify/backend-cli@^1.6.0, aws-cdk-lib@^2.180.0, constructs@^10.3.0, name, private, scripts (+6 more)

### Community 20 - "PersonalRoom.tsx"
Cohesion: 0.08
Nodes (54): errorReason(), Job, Offer, overDrawer(), PersonalRoom(), canPlaceNew(), carriedTo(), carryEnd() (+46 more)

### Community 21 - "prepare-models.mjs"
Cohesion: 0.10
Nodes (26): paintedCostume(), BODIES, bruce, BRUCE_FIT, BRUCE_PLACE, bunny, CARDIGAN_TIE, CROWN (+18 more)

### Community 22 - "Traversal"
Cohesion: 0.09
Nodes (8): coverFloorTransition(), JumpPose, createRoomPassage(), fixture(), clamp(), fixture(), jump(), Traversal

### Community 23 - "core/package.json"
Cohesion: 0.06
Nodes (40): dependencies, @aws-sdk/client-s3@^3.1121.0, @aws-sdk/s3-request-presigner@^3.1121.0, bcryptjs@^2.4.3, obscenity@^0.4.6, pg@^8.13.1, sharp@^0.33.5, thumbhash@^0.1.1 (+32 more)

### Community 24 - "wardrobe.ts"
Cohesion: 0.07
Nodes (42): AtelierPage(), dynamic, metadata, OwnedSnapshot, walletReady(), getWalletSnapshot(), subscribeWallet(), Atelier() (+34 more)

### Community 26 - "catalog.ts"
Cohesion: 0.16
Nodes (21): confirmClean(), CatalogItem, CatalogKind, FREE_CHARACTERS, isBuyable(), isCatalogItem(), ITEMS, ItemSlot (+13 more)

### Community 27 - "LeaderboardPanel.tsx"
Cohesion: 0.20
Nodes (17): PondBoardId, PondBoardPeriod, PondBoardRow, PondLeaderboard, formatCountdown(), formatInteger(), formatOdds(), nextMondayUtc() (+9 more)

### Community 28 - "ambience.ts"
Cohesion: 0.12
Nodes (29): blade(), bloom(), BLOOMS, createPondAmbience(), update(), fishTexture(), frond(), FRONT_ROWS (+21 more)

### Community 29 - "core/src/index.ts"
Cohesion: 0.05
Nodes (118): addBait(), baitOf(), PondBoardMe, PondBoardRow, PondFeedItem, Rep, bountyCatches(), BountyCatchRow (+110 more)

### Community 30 - "Web Package Dependencies"
Cohesion: 0.07
Nodes (33): dependencies, embla-carousel-react@^8.6.0, motion@^13.1.1, next@^15.0.3, react@^19.0.0, react-dom@^19.0.0, swr@^2.5.1, three@^0.169.0 (+25 more)

### Community 31 - "Gamifying Tiny Museum — genre direction & engagement research"
Cohesion: 0.10
Nodes (19): 0.1 The core experience, 0.2 Systems that make gamification cheap to build, 0.3 Constraints that shape any recommendation, 0. What the game is today (the deep dive), 1.1 The landscape (seven candidates, with verdicts), 1.2 Recommendation: a **cozy gallery life-sim** — "the gallery you live in", 1.3 The five design pillars the genre implies, 1. Genre direction (+11 more)

### Community 32 - "atelier.ts"
Cohesion: 0.04
Nodes (40): AtelierActions, AtelierImage, AtelierRoom, BuiltRoom, Cardigan, CARDIGAN_NAMES, CHARACTER_NAMES, Control (+32 more)

### Community 33 - "editor.ts"
Cohesion: 0.18
Nodes (17): roomEditor, PER_EDITOR, PUT(), versionOf(), PER_EDITOR, POST(), PER_MEMBER, POST() (+9 more)

### Community 34 - "risk.ts"
Cohesion: 0.16
Nodes (24): Hud(), HudProps, HudWagerChip, WagerPicker(), chooseTier(), WagerPickerProps, chainChipLabel(), clampWagerStake() (+16 more)

### Community 35 - "amplify/tsconfig.json"
Cohesion: 0.20
Nodes (9): compilerOptions, module, moduleResolution, noUnusedLocals, noUnusedParameters, exclude, extends, include (+1 more)

### Community 36 - "5. Customization menu — what other people are doing"
Cohesion: 0.12
Nodes (16): 1. The target: what "Claude Opus 5.5" actually means, 2. Where your harness stands today (live config I read), 3. The honest gap model, 4. Quality levers, ranked by leverage, 5. Customization menu — what other people are doing, 6. Recommended starting kit for *your* profile, 7. What I can apply for you right now (needs your go-ahead), A. Prompt & persona (most common quality customizations) (+8 more)

### Community 37 - "wallet.test.ts"
Cohesion: 0.12
Nodes (22): GLOBAL, PER_IP, POST(), PER_MEMBER, POST(), grantPearls(), member(), now (+14 more)

### Community 38 - "query"
Cohesion: 0.04
Nodes (95): CONTENT_TYPES, GET(), listPieces(), pieceImageUrl(), PieceRow, toPieceDto(), confirmedFollowers(), currentEpoch() (+87 more)

### Community 39 - "Web TSConfig"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 40 - "Root Package Manifest"
Cohesion: 0.06
Nodes (36): [, width, height], description, devDependencies, concurrently@^9.1.0, esbuild@^0.24.0, ktx2-encoder@^0.6.0, maxrects-packer@^2.7.3, playwright@^1.63.0 (+28 more)

### Community 41 - "RigPreview.tsx"
Cohesion: 0.15
Nodes (18): RigPreviewPage(), NEXT, PROPS, RigPreview(), draw(), approach(), createRigState(), GROUNDED (+10 more)

### Community 42 - "xdog.ts"
Cohesion: 0.39
Nodes (5): blur(), kernel(), XDOG_DEFAULTS, xdogInk(), XdogOptions

### Community 43 - "import-fishing-assets.mjs"
Cohesion: 0.10
Nodes (12): CANVAS, clear, FONT, FRAME, heights, layout, lossless, manifest (+4 more)

### Community 44 - "Base TSConfig"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, lib, module, moduleResolution (+9 more)

### Community 45 - "Amplify Build Spec"
Cohesion: 0.12
Nodes (16): applications, appRoot, backend, frontend, baseDirectory, files, phases, commands (+8 more)

### Community 46 - "sketchguess/lib/api.ts"
Cohesion: 0.28
Nodes (11): sameOriginUrl(), PreparedGame, decodeImage(), fetchBitmap(), fetchRound(), guarded(), LoadedRound, loadInk() (+3 more)

### Community 47 - "rooms/art.ts"
Cohesion: 0.24
Nodes (8): AtelierArt, loadGalleryDoor(), loadGalleryPillar(), loadImage(), pending, AtelierArtwork, ROOM_ART, RoomArt

### Community 49 - "writeStyle"
Cohesion: 0.24
Nodes (4): GuestBoardNotes, Placards, toScreen(), writeStyle()

### Community 50 - "Water.tsx"
Cohesion: 0.08
Nodes (37): AmbientShadow, box(), BUCKET, bunnyBox(), easeOut(), Glint, LEFT_STYLE, lineColour() (+29 more)

### Community 51 - "Worker Package Manifest"
Cohesion: 0.14
Nodes (14): dependencies, @tiny/core@*, exports, ./lambda, @tiny/core, main, name, private (+6 more)

### Community 52 - "Public Asset Manifest"
Cohesion: 0.12
Nodes (15): artworks, bunny, size, floor, size, fonts, icon-no-photos, size (+7 more)

### Community 53 - "MuseumStage.tsx"
Cohesion: 0.05
Nodes (29): Pose, EXITS, LINKS, ActiveRoom, RoomOptions, StageContext, StageContextValue, Entry (+21 more)

### Community 54 - "rules.ts"
Cohesion: 0.15
Nodes (18): localDay(), at(), EXCHANGE_DAILY_STAMPS, EXCHANGE_PEARLS_PER_STAMP, exchangeClaimKey(), GAME_DAILY_CAP, GameId, GAMES (+10 more)

### Community 55 - "compose-atelier.mjs"
Cohesion: 0.12
Nodes (10): body, dressLayer, dressWidth, floralWidth, hanger, MANNEQUIN_CANVAS, mask, root (+2 more)

### Community 56 - "messages.ts"
Cohesion: 0.31
Nodes (7): checkMessage(), INVISIBLE, MESSAGE_MAX, MessageCheck, normalizeMessage(), hasProfanity(), matcher

### Community 57 - "pond-format.ts"
Cohesion: 0.10
Nodes (35): fetchPondFeed(), PondDex, PondFeedItem, catchLabel(), EXCHANGE_DAILY_STAMPS, EXCHANGE_PEARLS_PER_STAMP, FISH_ART, fishArt() (+27 more)

### Community 58 - "db-tests/pond.test.ts"
Cohesion: 0.07
Nodes (29): CatchExtra, clearCatches(), COLUMNS, grantPearls(), insertCatch(), member(), namedMember(), randomId() (+21 more)

### Community 59 - "economy/store.ts"
Cohesion: 0.09
Nodes (52): CARRY_CAP, carryAdd(), CarryEntry, carryPrune(), carryRemove(), chunk(), tzOffsetNow(), outboxDue() (+44 more)

### Community 60 - "LandingFx"
Cohesion: 0.10
Nodes (23): between(), CAT, Edge, EDGES, runLandingCat(), choosePeeker(), peek(), walk() (+15 more)

### Community 61 - "room.ts"
Cohesion: 0.13
Nodes (28): socket(), admitted(), Attachment, farewell(), GHOST_MS, HELLO_TIMEOUT_MS, holdsOf(), MAX_WAITING_PER_IP (+20 more)

### Community 62 - "minimap.ts"
Cohesion: 0.10
Nodes (24): ATELIER_DOOR, follow(), doorPoint(), FALLBACK_TINT, FloorSketch, ICONS, MAP_PLACES, MAP_SCALE (+16 more)

### Community 64 - "domain/guestboard.ts"
Cohesion: 0.10
Nodes (30): GET(), BoardScreen(), ComposeScreen(), ComposeScreenProps, blankDraft(), GuestBoard(), GuestBoardProps, View (+22 more)

### Community 65 - "Sound Effect Assets"
Cohesion: 0.22
Nodes (9): file, kilobytes, seconds, file, kilobytes, seconds, soundEffects, click (+1 more)

### Community 66 - "initialize"
Cohesion: 0.16
Nodes (23): isDoor(), linkedDoor(), createNearby(), createStage(), closeEntry(), enter(), initialize(), aim() (+15 more)

### Community 67 - "Custom HTTP Headers"
Cohesion: 0.25
Nodes (7): applications, appRoot, customHeaders, headers, pattern, key, value

### Community 68 - "Sharp Layer Package"
Cohesion: 0.33
Nodes (6): dependencies, sharp@^0.33.5, description, sharp, name, private

### Community 69 - "currentMember"
Cohesion: 0.40
Nodes (7): GET(), GET(), currentMember(), MEMBER_COOKIE, MemberSession, setMemberCookie(), Member

### Community 70 - "scene/ambience.ts"
Cohesion: 0.13
Nodes (13): BULBS, createHallAmbience(), finish(), glowTexture(), HallAmbience, mulberry(), painted(), vignetteTexture() (+5 more)

### Community 71 - "import-home-assets.mjs"
Cohesion: 0.14
Nodes (11): DOOR, DOOR_BACKDROP, drop, FURNITURE, manifest, manifestPath, masters, ORNATE_PAPER (+3 more)

### Community 72 - "member-route.ts"
Cohesion: 0.42
Nodes (7): POST(), POST(), POST(), checkPasswordRateLimit(), empty(), clearMemberCookie(), validCredentials()

### Community 73 - "createCharacter"
Cohesion: 0.47
Nodes (5): createCharacter(), contextLost(), loadKind(), loseRig(), setFrame()

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
Cohesion: 0.19
Nodes (13): createPresence(), drop(), heartbeat(), maybeSend(), onPageHide(), receive(), scheduleRetry(), send() (+5 more)

### Community 81 - "members"
Cohesion: 0.12
Nodes (25): coin_claims, coin_claims_daily, wallet_bait, wallet_items, wallets, member_sessions, member_sessions_member, member_slots (+17 more)

### Community 82 - "Frame Window Asset"
Cohesion: 0.50
Nodes (4): frame, size, window, windowAspect

### Community 83 - "wander.ts"
Cohesion: 0.23
Nodes (17): AMBIENT, between(), clamp(), createWanderer(), Emote, faceToward(), idleSeconds(), Neighbour (+9 more)

### Community 84 - "presence/package.json"
Cohesion: 0.14
Nodes (16): dependencies, @tiny/core@*, devDependencies, @cloudflare/workers-types@5.20261016.1, wrangler@4.151.1, @tiny/core, name, private (+8 more)

### Community 85 - "createAtelierRoom"
Cohesion: 0.23
Nodes (24): aspectOf(), createAtelierRoom(), buildCollection(), form(), buildEntrance(), buildRoom(), buildWardrobe(), picture() (+16 more)

### Community 86 - "Asset pipeline: fast loading without losing sharpness"
Cohesion: 0.22
Nodes (8): Asset pipeline: fast loading without losing sharpness, Character rigs and the Costume Atelier, Completed, Ground rules, Phase 1: fingerprinted files at 2x and 3x, Phase 2: texture atlases for the hall sprites, Phase 3: KTX2 (Basis Universal), built and switched off, Phase 4: ThumbHash placeholders for paintings

### Community 87 - "Guest Board SQL Schema"
Cohesion: 0.67
Nodes (3): guest_notes, guest_notes_visible, rate_limits

### Community 88 - "Landscape Frame Asset"
Cohesion: 0.67
Nodes (3): frameLandscape, size, window

### Community 89 - "ticket/route.ts"
Cohesion: 0.20
Nodes (12): GET(), PER_MEMBER, GET(), PER_IP, POST(), presenceUrl(), memberFromRequest(), exportMember() (+4 more)

### Community 93 - "json"
Cohesion: 0.12
Nodes (40): PUT(), PER_MEMBER, PUT(), PER_MEMBER, POST(), catchIdOf(), isRecord(), MAX_POND_BODY_BYTES (+32 more)

### Community 94 - "createRemoteVisitors"
Cohesion: 0.24
Nodes (7): createRemoteVisitors(), ensureLayer(), load(), placeOwn(), show(), showProp(), insideScreen()

### Community 95 - "pond/room.ts"
Cohesion: 0.12
Nodes (23): FAR_LIFT, FAR_SCALE, liftAt(), pathHalfWidth(), pathX(), PondPath, scaleAt(), path (+15 more)

### Community 96 - "members.ts"
Cohesion: 0.12
Nodes (33): Code, 3.2 Chosen names (members), registry, started(), hashToken(), verifyPassword(), changePassword(), chooseName() (+25 more)

### Community 104 - "LandingFx"
Cohesion: 0.22
Nodes (8): glowSprite(), LandingFx(), onClick(), onVisibility(), tick(), Mote, sprite(), 9. Decorating can't be done with the keyboard

### Community 105 - "FishingView.tsx"
Cohesion: 0.13
Nodes (14): CONFETTI_COLORS, ConfettiPiece, makeConfetti(), RevealCard(), TIER_MS, TIER_SFX, useCountUp(), chainOffer (+6 more)

### Community 106 - "ticket.ts"
Cohesion: 0.14
Nodes (18): fetch(), Env, parseRoom(), decoder, encoder, fromBase64Url(), HmacKey, isOwn() (+10 more)

### Community 107 - "import-hall-assets.mjs"
Cohesion: 0.09
Nodes (17): BASEBOARD, CURTAIN, drop, EXPECTED, file(), manifest, manifestPath, masters (+9 more)

### Community 108 - "react"
Cohesion: 0.10
Nodes (25): AccountHost(), AccountSheet, NAME_ERRORS, Pending, View, AccountMode, onOpenAccount(), openAccount() (+17 more)

### Community 109 - "backend.ts"
Cohesion: 0.15
Nodes (12): amplifyDir, backend, everyMinutes, mediaBucket, missing, repoRoot, REQUIRED, setting() (+4 more)

### Community 110 - "graftCostume"
Cohesion: 0.27
Nodes (14): canvasFit(), compose(), graftCostume(), copyAccessor(), copyMaterial(), copyMesh(), copyTexture(), copyView() (+6 more)

### Community 111 - "pondgame/lib/api.ts"
Cohesion: 0.12
Nodes (31): PondGameProps, PondGame(), RevealCardProps, buyPondBait(), CastOptions, castPond(), chainPondBait(), errorOf() (+23 more)

### Community 112 - "worker/tsconfig.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 113 - "core/tsconfig.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 114 - "CrowdPreview.tsx"
Cohesion: 0.29
Nodes (8): CrowdPreviewPage(), CrowdPreview(), draw(), KINDS, Stats, Window, clearRigLayer(), layer()

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
Nodes (13): isItem(), isName(), isPid(), isSeq(), MAX_HOLDS, MAX_MESSAGE_BYTES, parseClientMessage(), parseLook() (+5 more)

### Community 119 - "Costume gallery doorway"
Cohesion: 0.50
Nodes (3): Costume gallery doorway, Curtain colour edit, Prompt

### Community 120 - "art-cache.ts"
Cohesion: 0.21
Nodes (9): ArtCacheOptions, createArtCache(), drop(), expireLater(), hold(), HeldArt, LoadResult, Slot (+1 more)

### Community 121 - "Fishing forest: painted asset pass"
Cohesion: 0.10
Nodes (18): Assets, Bruce's collection refresh (2026-11-08), Fishing forest illustrations, Made by hand (not touched by the script), Main hall v2 (2026-11-10), Monets Lily Pond (2026-11-08), 1. Forest doorway, 2. Woodland noticeboard (+10 more)

### Community 124 - "The Costume Atelier"
Cohesion: 0.12
Nodes (15): Adding a character, Adding a costume, Art not supplied as files, Bruce's Chronicles, Checked against the mocks (2026-11-07), Code, Costume fit review, Fitting clothes to other characters (+7 more)

### Community 125 - "Confirmed issues"
Cohesion: 0.11
Nodes (19): Confirmed issues, E2E-001 — Alternate local origin breaks artwork fallback URLs, E2E-002 — Valid edge placement rejected through floating-point precision, E2E-003 — One owned prop can be placed multiple times, E2E-004 — Reload before autosave silently loses the latest placement, E2E-005 — Failed save and failed Done have no visible mobile explanation, E2E-006 — Restoring connectivity does not retry a failed draft save, E2E-007 — Keyboard activation cannot place drawer items (+11 more)

### Community 126 - "rig.ts"
Cohesion: 0.13
Nodes (26): Layer, setCostumeVisibility(), canvasToModel(), createRenderer(), createRigLayer(), disposeRigLayer(), Frame, layerTemplates (+18 more)

### Community 127 - "Curating the paintings (2026-11-07)"
Cohesion: 0.13
Nodes (14): 1. The registry and the table, 2. The studio's Location picker, 3. The rooms draw what is placed, 4. Credits, 5. Retiring self-serve artists, Building it, Curating the paintings (2026-11-07), Decided (+6 more)

### Community 128 - "limited"
Cohesion: 0.12
Nodes (28): ALLOWED, PER_VISITOR, POST(), POST(), GLOBAL, PER_IP, POST(), POST() (+20 more)

### Community 129 - "presence/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, types, exclude, extends, include, ../../tsconfig.base.json

### Community 130 - "env.ts"
Cohesion: 0.20
Nodes (8): target, SCHEMA_DIR, isProduction(), presenceSecret(), repoRoot, required(), sessionSecret(), setting()

### Community 131 - "tsconfig.test.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 132 - "app/layout.tsx"
Cohesion: 0.14
Nodes (15): bethEllen, inspiratiq, metadata, notoSans, RootLayout(), sniglet, viewport, SoundContext (+7 more)

### Community 133 - "writeLocal"
Cohesion: 0.21
Nodes (16): ColorRecall(), ColorRecallProps, Phase, readBest(), showMs(), undoAdminUnlock(), unlockEverything(), loadColorRecall() (+8 more)

### Community 134 - "lib/presence.ts"
Cohesion: 0.14
Nodes (7): INTERPOLATION_DELAY_MS, PEER_TIMEOUT_MS, PeerTable, positionAt(), Sample, look, Peer

### Community 135 - "Item"
Cohesion: 0.14
Nodes (4): Room, Presence, Item, Refusal

### Community 136 - "bug-reports.ts"
Cohesion: 0.11
Nodes (28): BugReportHost(), BugReportSheet, BugReportSheet(), send(), Status, collectContext(), inAppBrowser(), onOpenBugReport() (+20 more)

### Community 137 - "schedule.test.ts"
Cohesion: 0.15
Nodes (19): BY_ID, CAST, EMOTES, FRAME, IDLE, NPC_WALK_SPEED, NpcCharacter, RESIDENT_IDS (+11 more)

### Community 138 - "hall/room.ts"
Cohesion: 0.06
Nodes (48): Assets, Scenery, CUTS, disposeBoards(), Mark, plane(), ROPE_CUTS, ropeSlices() (+40 more)

### Community 139 - "layout.ts"
Cohesion: 0.15
Nodes (10): cafeAfterIndex(), computeLayout(), cutRooms(), HallLayout, HallRoomKind, HallRoomSpan, hasPedestal(), Span (+2 more)

### Community 140 - "lib/presence.ts"
Cohesion: 0.13
Nodes (13): Connect, connectWebSocket(), HEARTBEAT_MS, HIDDEN_LIMIT_MS, SocketHandlers, Clock, Conn, flush() (+5 more)

### Community 141 - "tab-turn.ts"
Cohesion: 0.16
Nodes (5): createTabTurn(), TabTurn, tab(), TurnEnv, TurnMessage

### Community 142 - "guestboard/route.ts"
Cohesion: 0.26
Nodes (10): POST(), POST(), rateLimitedResponse(), rejectedResponse(), BugReportRateLimited, postBugReport(), enforceLimits(), GuestNoteRateLimited (+2 more)

### Community 143 - "Local end-to-end stress test — 2026-11-06"
Cohesion: 0.20
Nodes (8): Environment and coverage, Fix status (2026-11-06), Follow-up coverage, Issue index, Local end-to-end stress test — 2026-11-06, Measured load, Passing checks and interpretation limits, Test data and cleanup

### Community 144 - "The Moonlit Pond — design"
Cohesion: 0.09
Nodes (22): Art the pond needs from the artist, Build contract (decided 2026-11-07), Build phases, Collection and goals, Done, Done, Guardrails, Leaderboards (+14 more)

### Community 145 - "Pond rework"
Cohesion: 0.18
Nodes (10): Baits, Client, Decisions, Done, Notes, Pond rework, Server, Species (+2 more)

### Community 146 - "hit.ts"
Cohesion: 0.17
Nodes (12): CoinWall, createHiddenCoin(), Spot, AlphaMap, alphaMapFor(), alphaMaps, buildAlphaMap(), isPaintedAt() (+4 more)

### Community 147 - "Orchestration contract — you plan, DSH workers execute"
Cohesion: 0.29
Nodes (6): Briefing a worker, Budget hygiene, graphify, Orchestration contract — you plan, DSH workers execute, The worker, When not to delegate

### Community 148 - "tables.ts"
Cohesion: 0.11
Nodes (31): BaitTray(), BaitTrayProps, debugSpecies(), debugVariant(), GuestRollOptions, guestTreasure(), rollGuest(), BAIT (+23 more)

### Community 149 - "jobs.ts"
Cohesion: 0.26
Nodes (15): loop(), shutdown(), sleep(), sweepStale(), DrainResult, handler(), repairFrames(), repairUnframed() (+7 more)

### Community 150 - "locations.ts"
Cohesion: 0.28
Nodes (15): hasUnpublished(), locationStates(), nudgeInRow(), OWNER, placePainting(), PlaceResult, PlaceTarget, publishLocation() (+7 more)

### Community 151 - "pond-state.ts"
Cohesion: 0.24
Nodes (15): fetchPondState(), PondStateView, PondTier, ensurePondStateStarted(), getPondStateSnapshot(), GUEST, listeners, LOADING (+7 more)

### Community 152 - "plan.ts"
Cohesion: 0.43
Nodes (5): openingPlan(), prepareSketchGame(), planGame(), randomRound(), ROUND_SPREAD

### Community 153 - "app/page.tsx"
Cohesion: 0.21
Nodes (13): dynamic, Hall(), MuseumPage(), [BRAND_OWNER, ...BRAND_REST], CurrentlyShowing(), Decor(), dynamic, LandingPage() (+5 more)

### Community 154 - "createNpcLayer"
Cohesion: 0.23
Nodes (14): castMember(), idleCel(), createNpcLayer(), createResidentView(), createView(), draw(), hideAll(), hideView() (+6 more)

### Community 155 - "wallet.ts"
Cohesion: 0.17
Nodes (14): applyClaim(), baitCounts(), BuyResult, ClaimBatchResult, ClaimOutcome, ensureWallet(), getWallet(), itemsOf() (+6 more)

### Community 156 - "outbox.test.ts"
Cohesion: 0.29
Nodes (11): ClaimRequest, OUTBOX_CAP, outboxAdd(), OutboxEntry, outboxFail(), outboxRemove(), RETRY_BASE_MS, RETRY_MAX_MS (+3 more)

### Community 157 - "Walkthrough.tsx"
Cohesion: 0.12
Nodes (23): BACKDROP_STYLE, MoreArrow(), NavArrow(), Props, SLIDE, Walkthrough(), XIcon(), decodedFrames (+15 more)

### Community 158 - "createPondRoom"
Cohesion: 0.32
Nodes (13): createPondRoom(), approach(), busy(), finishWalk(), goTo(), leave(), move(), nearest() (+5 more)

### Community 159 - "useSoundEffects.ts"
Cohesion: 0.12
Nodes (26): BackgroundMusic, clampVolume(), isDocumentHidden(), Options, useBackgroundMusic(), VISIBILITY_EVENTS, EFFECTS, EffectSpec (+18 more)

### Community 160 - "nearby.ts"
Cohesion: 0.18
Nodes (5): Nearby, NearbyReach, RoomSpan, reach, strip

### Community 161 - "RoomSound"
Cohesion: 0.33
Nodes (4): StageOptions, RoomSound, SoundState, EffectName

### Community 162 - "features/economy/index.ts"
Cohesion: 0.09
Nodes (35): MuseumLayout(), CoinToast(), Toast, Purse(), Stamp(), WalletProvider(), serverSnapshot, useEarnEvents() (+27 more)

### Community 163 - "painting-open"
Cohesion: 0.50
Nodes (4): file, kilobytes, seconds, painting-open

### Community 164 - "rooms.ts"
Cohesion: 0.09
Nodes (38): GET(), PaintingRow, GET(), POST(), UPLOADS_PER_ARTIST, POST(), UPLOADS_PER_ARTIST, dynamic (+30 more)

### Community 165 - "Multiplayer ("other visitors") — plan v2 (Cloudflare)"
Cohesion: 0.14
Nodes (13): ScreenChrome(), 0. Summary, 10. Decisions, 1. Product contract changes (approved 2026-10-31), 2. What already exists that this builds on, 3.1 Generated names (everyone has one), 3. Names, 5.1 Emotes (v1) (+5 more)

### Community 167 - "run.ts"
Cohesion: 0.20
Nodes (7): admin, childEnv, client, database, fresh, migrations, target

### Community 168 - "wallet/body.ts"
Cohesion: 0.24
Nodes (12): PER_MEMBER, POST(), baitIdOf(), integerOffset(), isRecord(), itemIdOf(), MAX_CLAIM_BATCH, MAX_WALLET_BODY_BYTES (+4 more)

### Community 169 - "icon-basket"
Cohesion: 0.67
Nodes (3): icon-basket, file, vector

### Community 171 - "visits.ts"
Cohesion: 0.16
Nodes (18): state(), flush(), visibleMs(), VisitState, count(), currentSalts(), DEVICES, loadSalts() (+10 more)

### Community 172 - "lib/assets.ts"
Cohesion: 0.19
Nodes (14): Loading(), DENSITY_MEDIA, HallPreload(), HallSkeleton(), assetCssVariables(), AtlasGroup, AtlasSheet, BuiltImage (+6 more)

### Community 174 - "AssetImage"
Cohesion: 0.17
Nodes (14): BoardScreenProps, PinnedNotesProps, ReadScreen(), ReadScreenProps, messageLength(), StickyNote(), NOTE_PLACES, NotePlace (+6 more)

### Community 176 - "logic.ts"
Cohesion: 0.09
Nodes (33): DecorDrawer, DecorDrawerProps, SLOT_LABELS, Tab, TABS, categoryOf(), cozyLevel, cozyWorth() (+25 more)

### Community 177 - "confirm/page.tsx"
Cohesion: 0.33
Nodes (7): ConfirmFollow(), dynamic, dynamic, Unsubscribe(), FollowNotice(), confirmFollow(), unsubscribe()

### Community 179 - "createCozyBackdrop"
Cohesion: 0.09
Nodes (22): PersonalArt, createPersonalRoom(), light(), shade(), showArrangement(), showLevel(), signFilter(), DOOR_SIGN (+14 more)

### Community 180 - "audience.ts"
Cohesion: 0.09
Nodes (26): ArtistPage(), dynamic, generateMetadata(), GET(), GET(), AnalyticsPage(), dynamic, FollowForm() (+18 more)

### Community 182 - "AccountSheet"
Cohesion: 0.29
Nodes (9): AccountSheet(), continueAnyway(), doSignOut(), runDelete(), runName(), submit(), submitDelete(), submitName() (+1 more)

### Community 183 - "Storyline (draft, saved 2026-11-17)"
Cohesion: 0.18
Nodes (10): Arc (soft, no fail state), Built so far, How it ties to what exists, Mystery hook, Next tasks (when picked up), Open questions, Premise, Seed (the owner's words) (+2 more)

### Community 184 - "createMinimap"
Cohesion: 0.31
Nodes (9): place(), createMinimap(), draw(), drawRoom(), floors(), sketchOf(), readCollapsed(), svg() (+1 more)

### Community 186 - "Low"
Cohesion: 0.10
Nodes (20): 10. Long names run off the name sign, 11. The rooms API skips the stale-tab member check, 12. The bunny is dragged along while you pan in Decorate, 13. Pages that redirect or don't exist answer 200, 14. Error codes reveal which room slugs exist, 15. The name sign slides under the top-right buttons in Decorate, 16. Level-up celebrations can be farmed, 17. No hint of where things are after panning away (+12 more)

### Community 187 - "perf.ts"
Cohesion: 0.22
Nodes (4): createPerfMeter(), isEnabled(), PerfMeter, PerfSnapshot

### Community 189 - "ensureEpoch"
Cohesion: 0.31
Nodes (11): GET(), intParam(), GET(), sketchPool, unavailable(), ensureEpoch(), epochById(), getHallSlice() (+3 more)

### Community 190 - "createHallRoom"
Cohesion: 0.11
Nodes (18): createCarried(), createHelm(), createMatcha(), createSitting(), hop(), createHallRoom(), buildRoom(), cafeRoom() (+10 more)

### Community 192 - "GameDesktop.tsx"
Cohesion: 0.33
Nodes (7): loadGameDesktop(), GameDesktop(), GameDesktopProps, MinigameFrame(), Minigame, MinigameId, MINIGAMES

### Community 193 - "Monets Lily Pond: exploration, UX and multiplayer QA"
Cohesion: 0.29
Nodes (6): Browser and interaction coverage, Changes made from the walkthrough, Monets Lily Pond: exploration, UX and multiplayer QA, Multiplayer and load, Practical limits, Regression checks and cleanup

### Community 194 - "VitalsReporter.tsx"
Cohesion: 0.29
Nodes (8): firstPainting(), flush(), Metric, queue, REPORTED, VitalsReporter(), FIRST_PAINTING_MARK, MUSEUM_START_MARK

### Community 195 - ".webSocketMessage"
Cohesion: 0.44
Nodes (3): attachmentOf(), Room, sendTo()

### Community 196 - "Your Room: a room you can freely furnish"
Cohesion: 0.22
Nodes (8): Admin mode (gamma), Decisions (2026-11-17, with the user), Room look (web, `features/rooms/themes/cozy.ts`, `features/rooms/personal/room.ts`), Scale, Testing locally, What other games do (research, 2026-11-17), Work plan, Your Room: a room you can freely furnish

### Community 197 - "pond-api.ts"
Cohesion: 0.12
Nodes (33): PearlIcon(), buyPondBait(), claimPondBounty(), errorOf(), exchangePondPearls(), fetchPondBounties(), fetchPondDex(), fetchPondLeaderboard() (+25 more)

### Community 198 - "lib/slots/index.ts"
Cohesion: 0.09
Nodes (14): KeepOnOtherDevices(), announceNameChange(), useVisitorName(), VisitorName, Probe(), StoredSlot, defaultEnv(), defaultStore() (+6 more)

### Community 199 - "Placement"
Cohesion: 0.07
Nodes (14): loadHallArranger(), Carry, PersonalRoomProps, HallArranger(), HallArrangerProps, HallRoomData, Painting, hallPlacements() (+6 more)

### Community 200 - "4. Transport: Cloudflare Durable Objects"
Cohesion: 0.25
Nodes (8): 4. Transport: Cloudflare Durable Objects, Decision (2026-10-31), Deploying, Identity cannot be forged, Local development and tests, Rooms and capacity, Shape of `apps/presence` (about 200 lines), main()

### Community 201 - "import-landing-assets.mjs"
Cohesion: 0.18
Nodes (8): CAT, drop, EXPECTED, manifest, manifestPath, masters, root, target

### Community 202 - "reveal.ts"
Cohesion: 0.29
Nodes (4): InkMap, createReveal(), PENCIL, SketchReveal

### Community 204 - "Other visitors"
Cohesion: 0.29
Nodes (6): How it plays, Other visitors, Privacy, Running it in production, Running it locally, Staying consistent

### Community 205 - "visits/page.tsx"
Cohesion: 0.25
Nodes (10): amount(), duration(), dynamic, LANDMARKS, PAGES, RANGES, share(), VisitsPage() (+2 more)

### Community 206 - "FilesystemStorage"
Cohesion: 0.18
Nodes (5): PUT(), MAX_UPLOAD_BYTES, FilesystemStorage, signUpload(), verifyUploadSignature()

### Community 207 - "performance/page.tsx"
Cohesion: 0.16
Nodes (15): dynamic, format(), grade(), METRICS, PAGES, PerformancePage(), RANGES, DEVICES (+7 more)

### Community 208 - "createPlacementLayer"
Cohesion: 0.31
Nodes (8): aspectOf(), createPlacementLayer(), drawOutline(), dropGhosts(), dropHelper(), extrasFor(), silhouette(), sizeOf()

### Community 210 - "PondRoom.tsx"
Cohesion: 0.09
Nodes (24): Loading(), metadata, PondPage(), GLYPHS, POND_CRIMSON, PondIcon(), PondIconName, POND_NAME (+16 more)

### Community 211 - "revealFloorTransition"
Cohesion: 0.70
Nodes (3): Loading(), AtelierLoading(), revealFloorTransition()

### Community 219 - "lib/presence.ts"
Cohesion: 0.09
Nodes (17): PresencePreviewPage(), PresencePreview(), Entry, RemoteVisitor, fetchTicket, RETRY_MS, sameLook(), samePose() (+9 more)

## Knowledge Gaps
- **5 isolated node(s):** `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1483 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **33 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `SketchGuess.tsx`, `app/layout.tsx`, `writeLocal`, `bug-reports.ts`, `machine.ts`, `Museum.tsx`, `Test Fakes and Helpers`, `actions.ts`, `room-events.ts`, `PersonalRoom.tsx`, `tables.ts`, `pond-state.ts`, `wardrobe.ts`, `app/page.tsx`, `LeaderboardPanel.tsx`, `Walkthrough.tsx`, `Web Package Dependencies`, `useSoundEffects.ts`, `features/economy/index.ts`, `risk.ts`, `RigPreview.tsx`, `AssetImage`, `logic.ts`, `Water.tsx`, `audience.ts`, `MuseumStage.tsx`, `pond-format.ts`, `domain/guestboard.ts`, `VitalsReporter.tsx`, `pond-api.ts`, `lib/slots/index.ts`, `Placement`, `PondRoom.tsx`, `revealFloorTransition`, `lib/presence.ts`, `LandingFx`, `FishingView.tsx`, `CrowdPreview.tsx`?**
  _High betweenness centrality (0.098) - this node is a cross-community bridge._
- **What connects `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json` to the rest of the system?**
  _5 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `remote-visitors.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.04581580177653109 - nodes in this community are weakly interconnected._
- **Why does `defaultStore()` connect `lib/slots/index.ts` to `remote-visitors.ts`, `initialize`, `rooms.ts`, `pond-api.ts`, `writeLocal`, `createPondRoom`, `SyncStore`, `hall/room.ts`, `react`, `pondgame/lib/api.ts`, `room-events.ts`, `PersonalRoom.tsx`, `pond-state.ts`, `wardrobe.ts`, `economy/store.ts`, `createHallRoom`, `pond/room.ts`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Should `walk.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12183908045977011 - nodes in this community are weakly interconnected._
- **Why does `three` connect `remote-visitors.ts` to `atelier.ts`, `scene/ambience.ts`, `scene/assets.ts`, `schedule.test.ts`, `hall/room.ts`, `scene.ts`, `cozy.ts`, `rooms/art.ts`, `pond/art.ts`, `hit.ts`, `prepare-models.mjs`, `rig.ts`, `perf.ts`, `ambience.ts`, `Web Package Dependencies`, `pond/room.ts`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Should `SketchGuess.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10158730158730159 - nodes in this community are weakly interconnected._