# Graph Report - tiny-museum  (2026-11-19)

## Corpus Check
- 526 files · ~315,715 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 95 file(s) not represented in the graph (top: .avif 52, .glb 34, .css 4)

## Summary
- 4723 nodes · 12235 edges · 211 communities (180 shown, 31 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 247 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `af052d94`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- stage.ts
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
- ArrangeControls.tsx
- room-events.ts
- schedule.ts
- ref_node_assert
- amplify/package.json
- PersonalRoom.tsx
- prepare-models.mjs
- Traversal
- core/package.json
- wardrobe.ts
- DecorController
- catalog.ts
- LeaderboardPanel.tsx
- ambience.ts
- core/src/index.ts
- Web Package Dependencies
- Gamifying Tiny Museum — genre direction & engagement research
- atelier.ts
- remote-visitors.ts
- risk.ts
- amplify/tsconfig.json
- 5. Customization menu — what other people are doing
- wallet.ts
- handlers.ts
- Web TSConfig
- Root Package Manifest
- RigPreview.tsx
- createCozyBackdrop
- import-fishing-assets.mjs
- Base TSConfig
- Amplify Build Spec
- sketchguess/lib/api.ts
- audience.ts
- slots/store.ts
- actions.ts
- Water.tsx
- Worker Package Manifest
- Public Asset Manifest
- SlotDef
- wander.test.ts
- compose-atelier.mjs
- lib/presence.ts
- pond-format.ts
- pond-boards.ts
- economy/store.ts
- links.ts
- room.ts
- minimap.ts
- .webSocketMessage
- domain/guestboard.ts
- Sound Effect Assets
- initialize
- Custom HTTP Headers
- Sharp Layer Package
- memberFromRequest
- scene/ambience.ts
- BountyPanel.tsx
- PondTicker.tsx
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
- names.ts
- Bug Reports SQL Schema
- Vitals SQL Schema
- json
- createRemoteVisitors
- pond/room.ts
- query
- Run-Once Schema
- nearby.ts
- FishingView.tsx
- ticket.ts
- import-hall-assets.mjs
- reveal.ts
- createMinimap
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
- ticket/route.ts
- presence/tsconfig.json
- env.ts
- tsconfig.test.json
- app/layout.tsx
- react
- peers.ts
- domain/sketch.ts
- bug-reports.ts
- schedule.test.ts
- writeStyle
- personal/room.ts
- Conn
- setPondState
- domain/guestboard.ts
- Local end-to-end stress test — 2026-11-06
- The Moonlit Pond — design
- Pond rework
- rooms/art.ts
- Orchestration contract — you plan, DSH workers execute
- tables.ts
- db.ts
- Medium
- pond-state.ts
- Cafe
- ArtCache
- createNpcLayer
- RemoteVisitors
- PerfMeter
- Walkthrough.tsx
- createPondRoom
- useSoundEffects.ts
- BunnyArtist.tsx
- walk
- MuseumStage.tsx
- painting-open
- locations.ts
- Multiplayer ("other visitors") — plan v2 (Cloudflare)
- Lobby
- run.ts
- Tiny Museum
- icon-basket
- media/storage.ts
- visits.ts
- lib/assets.ts
- bunny-left
- Sitting
- bunny-right
- DecorDrawer.tsx
- TreeSparkles
- icon-home
- createPersonalRoom
- PondControl
- ticket
- places.ts
- Storyline (draft, saved 2026-11-17)
- bug-reports.ts
- hall/room.ts
- Low
- backend.ts
- draw.py
- ensureEpoch
- import-home-assets.mjs
- Monets Lily Pond: exploration, UX and multiplayer QA
- performance/page.tsx
- pond-api.ts
- lib/slots/index.ts
- minimap.test.ts
- VitalsReporter.tsx
- GameDesktop.tsx
- npcs/README.md
- Other visitors
- FilesystemStorage
- rooms.ts
- shopkeeper.ts
- PondRoom.tsx
- 4. Transport: Cloudflare Durable Objects
- Clock
- setCostumeVisibility
- Minimap
- Item
- HelmShare
- ref_node_assert

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

## Communities (211 total, 31 thin omitted)

### Community 0 - "stage.ts"
Cohesion: 0.03
Nodes (51): coverFloorTransition(), CameraRig, Viewport, createPixelRatioGovernor(), PIXEL_RATIO_STEPS, createRoomPassage(), fixture(), JUMP_KEYS (+43 more)

### Community 1 - "walk.ts"
Cohesion: 0.17
Nodes (4): FloorPoint, WalkArea, depthOf(), Walker

### Community 2 - "SketchGuess.tsx"
Cohesion: 0.10
Nodes (31): bestKeyFor(), BURST, clueUrl(), openingPlan(), Phase, pickAtRandom(), prepareSketchGame(), readDifficulty() (+23 more)

### Community 3 - "themes.ts"
Cohesion: 0.07
Nodes (29): Catalogue, Data model (core), 1. Items placed against a zone edge fail to save, and the whole draft reverts, 2. One owned item can be placed many times, 3. Any save rejection throws away all unsaved work, 4. Changes made just before leaving are lost, 5. Fish trophies can be claimed without playing, High (+21 more)

### Community 4 - "Rig"
Cohesion: 0.25
Nodes (3): RigState, Rig, Shown

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
Cohesion: 0.07
Nodes (49): AssetManifest, assetUrl(), bitmapTexture(), blankImage(), CAFE_CAT_FRAMES, CompressedLoader, elementTexture(), ENTRANCE_FILES (+41 more)

### Community 9 - "SyncStore"
Cohesion: 0.16
Nodes (7): encodeStored(), parseStored(), readStored(), writeStored(), deepEq(), SyncStore, upgrade()

### Community 10 - "machine.ts"
Cohesion: 0.10
Nodes (47): CAST_ERRORS, coarsePointer(), FishingView(), initialEasyReel(), isTyping(), LOST, Toast, vibrate() (+39 more)

### Community 11 - "Museum.tsx"
Cohesion: 0.16
Nodes (23): PinnedNotes(), CoinFound, ColorRecall, GameDesktop, GuestBoard, HallArranger, HelpGuide, loadCoinFound() (+15 more)

### Community 12 - "Test Fakes and Helpers"
Cohesion: 0.12
Nodes (26): deferredFetch(), deviceSlot, FakeEvents, FakeStorage, fixture, fixtureB, fixtureRegistry, fixtureRegistryBoth (+18 more)

### Community 13 - "scene.ts"
Cohesion: 0.05
Nodes (29): disposeDisplayTexture(), prefersAvif(), HiddenCoin, createNotes(), createPedestal(), Notes, Pedestal, PedestalVoice (+21 more)

### Community 14 - "cozy.ts"
Cohesion: 0.07
Nodes (48): alphaCanvas(), ATELIER_PROPS, AtelierImage, atticWindowCanvas(), bareBulbCanvas(), boardsCanvas(), canvasTexture(), ceilingTexture() (+40 more)

### Community 15 - "ArrangeControls.tsx"
Cohesion: 0.40
Nodes (9): hangAction(), movePieceAction(), unhangAction(), FloorControls(), move(), unhang(), formFor(), StorageControls() (+1 more)

### Community 16 - "room-events.ts"
Cohesion: 0.07
Nodes (39): ChatButton(), REFUSED, joinRoom(), emit(), getPeople(), isInRoom(), isMuted(), muted (+31 more)

### Community 17 - "schedule.ts"
Cohesion: 0.12
Nodes (39): Emote, Anchors, anchorsFor(), buildSlot(), clamp(), cloneSpot(), doorSpot(), dwellMs() (+31 more)

### Community 18 - "ref_node_assert"
Cohesion: 0.12
Nodes (30): defineSlot(), docBytes(), SLOTS, byAtThenKey(), encoded(), latest, mapOf(), maxNumber() (+22 more)

### Community 19 - "amplify/package.json"
Cohesion: 0.17
Nodes (14): devDependencies, @aws-amplify/backend@^1.14.0, @aws-amplify/backend-cli@^1.6.0, aws-cdk-lib@^2.180.0, constructs@^10.3.0, name, private, scripts (+6 more)

### Community 20 - "PersonalRoom.tsx"
Cohesion: 0.07
Nodes (71): errorReason(), Offer, overDrawer(), PersonalRoom(), canPlaceNew(), carriedTo(), carryEnd(), carryMove() (+63 more)

### Community 21 - "prepare-models.mjs"
Cohesion: 0.10
Nodes (26): paintedCostume(), BODIES, bruce, BRUCE_FIT, BRUCE_PLACE, bunny, CARDIGAN_TIE, CROWN (+18 more)

### Community 22 - "Traversal"
Cohesion: 0.11
Nodes (5): JumpPose, clamp(), fixture(), jump(), Traversal

### Community 23 - "core/package.json"
Cohesion: 0.06
Nodes (39): dependencies, @aws-sdk/client-s3@^3.1121.0, @aws-sdk/s3-request-presigner@^3.1121.0, bcryptjs@^2.4.3, obscenity@^0.4.6, pg@^8.13.1, sharp@^0.33.5, thumbhash@^0.1.1 (+31 more)

### Community 24 - "wardrobe.ts"
Cohesion: 0.07
Nodes (51): AtelierPage(), dynamic, metadata, serverSnapshot, useEarnEvents(), useWallet(), allowedCharacter(), OwnedSnapshot (+43 more)

### Community 25 - "DecorController"
Cohesion: 0.04
Nodes (11): Carry, Job, PersonalRoomProps, DecorController, PersonalRoomOptions, GhostOptions, HighlightArea, PlacementLayer (+3 more)

### Community 26 - "catalog.ts"
Cohesion: 0.17
Nodes (18): confirmClean(), CatalogItem, CatalogKind, FREE_CHARACTERS, isCatalogItem(), ITEMS, ItemSlot, priceOf() (+10 more)

### Community 27 - "LeaderboardPanel.tsx"
Cohesion: 0.25
Nodes (14): PondBoardId, PondBoardPeriod, PondBoardRow, PondLeaderboard, formatInteger(), formatOdds(), nextMondayUtc(), BoardRow() (+6 more)

### Community 28 - "ambience.ts"
Cohesion: 0.12
Nodes (30): blade(), bloom(), BLOOMS, createPondAmbience(), update(), fishTexture(), frond(), FRONT_ROWS (+22 more)

### Community 29 - "core/src/index.ts"
Cohesion: 0.05
Nodes (113): addBait(), PondBoardMe, PondBoardRow, PondFeedItem, Rep, bountyCatches(), BountyCatchRow, bountyViews() (+105 more)

### Community 30 - "Web Package Dependencies"
Cohesion: 0.07
Nodes (33): dependencies, embla-carousel-react@^8.6.0, motion@^13.1.1, next@^15.0.3, react@^19.0.0, react-dom@^19.0.0, swr@^2.5.1, three@^0.169.0 (+25 more)

### Community 31 - "Gamifying Tiny Museum — genre direction & engagement research"
Cohesion: 0.10
Nodes (19): 0.1 The core experience, 0.2 Systems that make gamification cheap to build, 0.3 Constraints that shape any recommendation, 0. What the game is today (the deep dive), 1.1 The landscape (seven candidates, with verdicts), 1.2 Recommendation: a **cozy gallery life-sim** — "the gallery you live in", 1.3 The five design pillars the genre implies, 1. Genre direction (+11 more)

### Community 32 - "atelier.ts"
Cohesion: 0.03
Nodes (37): STAMP_ASPECT, AtelierActions, AtelierImage, AtelierRoom, BuiltRoom, Cardigan, CARDIGAN_NAMES, CHARACTER_NAMES (+29 more)

### Community 33 - "remote-visitors.ts"
Cohesion: 0.05
Nodes (21): CharacterSprites, Attachment, Carried, CarriedState, Character, Perch, Pose, centerYFor() (+13 more)

### Community 34 - "risk.ts"
Cohesion: 0.16
Nodes (25): Hud(), HudProps, HudWagerChip, WagerPicker(), chooseTier(), WagerPickerProps, chainChipLabel(), clampWagerStake() (+17 more)

### Community 35 - "amplify/tsconfig.json"
Cohesion: 0.20
Nodes (9): compilerOptions, module, moduleResolution, noUnusedLocals, noUnusedParameters, exclude, extends, include (+1 more)

### Community 36 - "5. Customization menu — what other people are doing"
Cohesion: 0.12
Nodes (16): 1. The target: what "Claude Opus 5.5" actually means, 2. Where your harness stands today (live config I read), 3. The honest gap model, 4. Quality levers, ranked by leverage, 5. Customization menu — what other people are doing, 6. Recommended starting kit for *your* profile, 7. What I can apply for you right now (needs your go-ahead), A. Prompt & persona (most common quality customizations) (+8 more)

### Community 37 - "wallet.ts"
Cohesion: 0.07
Nodes (44): PER_MEMBER, ADMIN_MODE, ADMIN_STAMPS, member(), now, piece(), randomId(), today (+36 more)

### Community 38 - "handlers.ts"
Cohesion: 0.07
Nodes (54): listPieces(), pieceImageUrl(), PieceRow, toPieceDto(), getHallSlice(), sealEpoch(), SliceRow, deletePiece() (+46 more)

### Community 39 - "Web TSConfig"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 40 - "Root Package Manifest"
Cohesion: 0.06
Nodes (36): [, width, height], description, devDependencies, concurrently@^9.1.0, esbuild@^0.24.0, ktx2-encoder@^0.6.0, maxrects-packer@^2.7.3, playwright@^1.63.0 (+28 more)

### Community 41 - "RigPreview.tsx"
Cohesion: 0.27
Nodes (10): RigPreviewPage(), NEXT, PROPS, RigPreview(), draw(), approach(), GROUNDED, rigFacing() (+2 more)

### Community 42 - "createCozyBackdrop"
Cohesion: 0.11
Nodes (18): ceilingGeometry(), CozyBackdrop, createCozyBackdrop(), clearGlows(), glow(), paintShade(), placeGlows(), placeSides() (+10 more)

### Community 43 - "import-fishing-assets.mjs"
Cohesion: 0.09
Nodes (13): CANVAS, clear, FONT, FRAME, heights, layer(), layout, lossless (+5 more)

### Community 44 - "Base TSConfig"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, lib, module, moduleResolution (+9 more)

### Community 45 - "Amplify Build Spec"
Cohesion: 0.12
Nodes (16): applications, appRoot, backend, frontend, baseDirectory, files, phases, commands (+8 more)

### Community 46 - "sketchguess/lib/api.ts"
Cohesion: 0.28
Nodes (11): sameOriginUrl(), PreparedGame, decodeImage(), fetchBitmap(), fetchRound(), guarded(), LoadedRound, loadInk() (+3 more)

### Community 47 - "audience.ts"
Cohesion: 0.06
Nodes (39): ArtistPage(), dynamic, generateMetadata(), GET(), ConfirmFollow(), dynamic, dynamic, Unsubscribe() (+31 more)

### Community 48 - "slots/store.ts"
Cohesion: 0.13
Nodes (17): ANON_PREFIX, anonKey(), deviceKey(), isMemberSlotKey(), listKeys(), MEMBER_KEY, memberKey(), memberPrefix() (+9 more)

### Community 49 - "actions.ts"
Cohesion: 0.06
Nodes (75): config, SECURITY_HEADERS, BugReportsPage(), dateFormat, dynamic, summary(), dynamic, GalleryPage() (+67 more)

### Community 50 - "Water.tsx"
Cohesion: 0.08
Nodes (37): AmbientShadow, box(), BUCKET, bunnyBox(), easeOut(), Glint, LEFT_STYLE, lineColour() (+29 more)

### Community 51 - "Worker Package Manifest"
Cohesion: 0.14
Nodes (14): dependencies, @tiny/core@*, exports, ./lambda, @tiny/core, main, name, private (+6 more)

### Community 52 - "Public Asset Manifest"
Cohesion: 0.12
Nodes (15): artworks, bunny, size, floor, size, fonts, icon-no-photos, size (+7 more)

### Community 53 - "SlotDef"
Cohesion: 0.18
Nodes (3): FakeServer, SlotState, SlotDef

### Community 54 - "wander.test.ts"
Cohesion: 0.18
Nodes (11): Job, JOBS, Place, PlaceKind, PlaceInput, BASE_JOB, context(), mulberry32() (+3 more)

### Community 55 - "compose-atelier.mjs"
Cohesion: 0.12
Nodes (10): body, dressLayer, dressWidth, floralWidth, hanger, MANNEQUIN_CANVAS, mask, root (+2 more)

### Community 56 - "lib/presence.ts"
Cohesion: 0.12
Nodes (18): Outcome, PresencePreviewPage(), PresencePreview(), RemoteVisitor, Connect, fetchTicket, HEARTBEAT_MS, HIDDEN_LIMIT_MS (+10 more)

### Community 57 - "pond-format.ts"
Cohesion: 0.14
Nodes (25): EXCHANGE_DAILY_STAMPS, EXCHANGE_PEARLS_PER_STAMP, FISH_ART, fishArt(), formatPercent(), formatShortSizeCm(), ODDS_BAIT, POND_BAIT (+17 more)

### Community 58 - "pond-boards.ts"
Cohesion: 0.13
Nodes (22): BOARDS, GET(), oneOf(), PER_VISITOR, PERIODS, compare(), DexRow, displayName() (+14 more)

### Community 59 - "economy/store.ts"
Cohesion: 0.06
Nodes (76): CARRY_CAP, carryAdd(), CarryEntry, carryPrune(), carryRemove(), chunk(), buildClaim(), BuiltClaim (+68 more)

### Community 60 - "links.ts"
Cohesion: 0.18
Nodes (6): EXITS, isDoor(), linkedDoor(), LINKS, StageHandlers, DoorRef

### Community 61 - "room.ts"
Cohesion: 0.14
Nodes (27): socket(), admitted(), Attachment, farewell(), GHOST_MS, HELLO_TIMEOUT_MS, holdsOf(), MAX_WAITING_PER_IP (+19 more)

### Community 62 - "minimap.ts"
Cohesion: 0.12
Nodes (17): ATELIER_DOOR, FALLBACK_TINT, FloorSketch, ICONS, MapPlace, MapPlan, MapRoomSketch, MapTheme (+9 more)

### Community 63 - ".webSocketMessage"
Cohesion: 0.44
Nodes (3): attachmentOf(), Room, sendTo()

### Community 64 - "domain/guestboard.ts"
Cohesion: 0.11
Nodes (26): BoardScreen(), BoardScreenProps, ComposeScreen(), ComposeScreenProps, blankDraft(), GuestBoard(), GuestBoardProps, View (+18 more)

### Community 65 - "Sound Effect Assets"
Cohesion: 0.22
Nodes (9): file, kilobytes, seconds, file, kilobytes, seconds, soundEffects, click (+1 more)

### Community 66 - "initialize"
Cohesion: 0.18
Nodes (21): createNearby(), createStage(), closeEntry(), enter(), initialize(), aim(), drawFrame(), handleClick() (+13 more)

### Community 67 - "Custom HTTP Headers"
Cohesion: 0.25
Nodes (7): applications, appRoot, customHeaders, headers, pattern, key, value

### Community 68 - "Sharp Layer Package"
Cohesion: 0.33
Nodes (6): dependencies, sharp@^0.33.5, description, sharp, name, private

### Community 69 - "memberFromRequest"
Cohesion: 0.43
Nodes (6): GET(), GET(), memberFromRequest(), exportMember(), readSlots(), exportWallet()

### Community 70 - "scene/ambience.ts"
Cohesion: 0.13
Nodes (13): BULBS, createHallAmbience(), finish(), glowTexture(), HallAmbience, mulberry(), painted(), vignetteTexture() (+5 more)

### Community 71 - "BountyPanel.tsx"
Cohesion: 0.18
Nodes (14): GLYPHS, PearlIcon(), POND_CRIMSON, PondIconName, PondBounties, formatCountdown(), nextUtcMidnight(), utcDayLabel() (+6 more)

### Community 72 - "PondTicker.tsx"
Cohesion: 0.29
Nodes (11): fetchPondFeed(), PondFeedItem, catchLabel(), formatSizeCm(), speciesFor(), speciesName(), speciesTier(), isGolden() (+3 more)

### Community 73 - "createCharacter"
Cohesion: 0.36
Nodes (7): createCharacter(), contextLost(), loadKind(), loseRig(), setFrame(), createRigState(), Angler()

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
Cohesion: 0.19
Nodes (18): blank(), colorAt(), disposePondArt(), EDGE_BAND, EDGE_BANDS, EDGE_OVERLAP, edgeTexture(), imageOf() (+10 more)

### Community 80 - "createPresence"
Cohesion: 0.15
Nodes (16): createPresence(), drop(), heartbeat(), maybeSend(), onPageHide(), receive(), scheduleRetry(), send() (+8 more)

### Community 81 - "members"
Cohesion: 0.12
Nodes (25): coin_claims, coin_claims_daily, wallet_bait, wallet_items, wallets, member_sessions, member_sessions_member, member_slots (+17 more)

### Community 82 - "Frame Window Asset"
Cohesion: 0.50
Nodes (4): frame, size, window, windowAspect

### Community 83 - "wander.ts"
Cohesion: 0.19
Nodes (25): NpcRoomInfo, beginNext(), beginWork(), between(), blockedAt(), chooseStop(), clamp(), doorsIn() (+17 more)

### Community 84 - "presence/package.json"
Cohesion: 0.14
Nodes (16): dependencies, @tiny/core@*, devDependencies, @cloudflare/workers-types@5.20261016.1, wrangler@4.151.1, @tiny/core, name, private (+8 more)

### Community 85 - "createAtelierRoom"
Cohesion: 0.32
Nodes (20): aspectOf(), createAtelierRoom(), buildCollection(), form(), buildEntrance(), buildRoom(), buildWardrobe(), picture() (+12 more)

### Community 86 - "Asset pipeline: fast loading without losing sharpness"
Cohesion: 0.22
Nodes (8): Asset pipeline: fast loading without losing sharpness, Character rigs and the Costume Atelier, Completed, Ground rules, Phase 1: fingerprinted files at 2x and 3x, Phase 2: texture atlases for the hall sprites, Phase 3: KTX2 (Basis Universal), built and switched off, Phase 4: ThumbHash placeholders for paintings

### Community 87 - "Guest Board SQL Schema"
Cohesion: 0.67
Nodes (3): guest_notes, guest_notes_visible, rate_limits

### Community 88 - "Landscape Frame Asset"
Cohesion: 0.67
Nodes (3): frameLandscape, size, window

### Community 89 - "names.ts"
Cohesion: 0.18
Nodes (14): checkMessage(), INVISIBLE, MESSAGE_MAX, MessageCheck, normalizeMessage(), ADJECTIVES, checkDisplayName(), NAME_LIMITS (+6 more)

### Community 93 - "json"
Cohesion: 0.07
Nodes (76): POST(), POST(), GET(), POST(), POST(), PER_MEMBER, PUT(), PER_MEMBER (+68 more)

### Community 94 - "createRemoteVisitors"
Cohesion: 0.21
Nodes (10): createRenderer(), createRigLayer(), createRemoteVisitors(), ensureLayer(), load(), placeOwn(), show(), showProp() (+2 more)

### Community 95 - "pond/room.ts"
Cohesion: 0.10
Nodes (31): water, depthAtLift(), FAR_LIFT, FAR_SCALE, liftAt(), PondPath, PROP_DEPTH, scaleAt() (+23 more)

### Community 96 - "query"
Cohesion: 0.08
Nodes (38): registry, started(), CatchExtra, COLUMNS, insertCatch(), member(), namedMember(), randomId() (+30 more)

### Community 104 - "nearby.ts"
Cohesion: 0.18
Nodes (5): Nearby, NearbyReach, RoomSpan, reach, strip

### Community 105 - "FishingView.tsx"
Cohesion: 0.12
Nodes (15): CONFETTI_COLORS, ConfettiPiece, makeConfetti(), RevealCard(), TIER_MS, TIER_SFX, useCountUp(), chainOffer (+7 more)

### Community 106 - "ticket.ts"
Cohesion: 0.23
Nodes (12): decoder, encoder, fromBase64Url(), HmacKey, isOwn(), isTicket(), keyFor(), keys (+4 more)

### Community 107 - "import-hall-assets.mjs"
Cohesion: 0.13
Nodes (11): BASEBOARD, CURTAIN, drop, EXPECTED, manifest, manifestPath, masters, root (+3 more)

### Community 108 - "reveal.ts"
Cohesion: 0.23
Nodes (7): InkMap, planGame(), ROUND_SPREAD, createReveal(), PENCIL, SketchReveal, shuffle()

### Community 109 - "createMinimap"
Cohesion: 0.31
Nodes (9): place(), createMinimap(), draw(), drawRoom(), floors(), sketchOf(), readCollapsed(), svg() (+1 more)

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

### Community 114 - "CrowdPreview.tsx"
Cohesion: 0.33
Nodes (7): CrowdPreviewPage(), CrowdPreview(), draw(), KINDS, Stats, Window, clearRigLayer()

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
Cohesion: 0.15
Nodes (21): fetch(), Env, isItem(), isName(), isPid(), isSeq(), MAX_HOLDS, MAX_INSTANCE (+13 more)

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
Cohesion: 0.16
Nodes (21): canvasToModel(), disposeRigLayer(), Frame, layerTemplates, loadRig(), dispose(), poseJump(), rotateInPlane() (+13 more)

### Community 127 - "Curating the paintings (2026-11-07)"
Cohesion: 0.13
Nodes (14): 1. The registry and the table, 2. The studio's Location picker, 3. The rooms draw what is placed, 4. Credits, 5. Retiring self-serve artists, Building it, Curating the paintings (2026-11-07), Decided (+6 more)

### Community 128 - "ticket/route.ts"
Cohesion: 0.07
Nodes (49): POST(), ALLOWED, PER_VISITOR, POST(), POST(), POST(), PER_MEMBER, PUT() (+41 more)

### Community 129 - "presence/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, types, exclude, extends, include, ../../tsconfig.base.json

### Community 130 - "env.ts"
Cohesion: 0.27
Nodes (7): SCHEMA_DIR, isProduction(), presenceSecret(), repoRoot, required(), sessionSecret(), setting()

### Community 131 - "tsconfig.test.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 132 - "app/layout.tsx"
Cohesion: 0.18
Nodes (11): bethEllen, inspiratiq, metadata, notoSans, RootLayout(), sniglet, viewport, SoundProvider() (+3 more)

### Community 133 - "react"
Cohesion: 0.10
Nodes (30): Loading(), ColorRecall(), ColorRecallProps, Phase, readBest(), showMs(), unlockEverything(), openBugReport() (+22 more)

### Community 134 - "peers.ts"
Cohesion: 0.13
Nodes (8): Entry, INTERPOLATION_DELAY_MS, PEER_TIMEOUT_MS, PeerTable, positionAt(), Sample, look, Peer

### Community 135 - "domain/sketch.ts"
Cohesion: 0.13
Nodes (18): EpochRow, planSketchRound(), SKETCH_CHOICES, SketchCandidate, SketchPieceRow, SketchRoundPlan, pool, SKETCH_COLOR_WIDTH (+10 more)

### Community 136 - "bug-reports.ts"
Cohesion: 0.20
Nodes (15): BugReportHost(), BugReportSheet, BugReportSheet(), send(), Status, collectContext(), inAppBrowser(), onOpenBugReport() (+7 more)

### Community 137 - "schedule.test.ts"
Cohesion: 0.14
Nodes (21): BY_ID, CAST, EMOTES, FRAME, IDLE, idleCel(), NPC_WALK_SPEED, NpcCharacter (+13 more)

### Community 138 - "writeStyle"
Cohesion: 0.08
Nodes (20): CafeLink, GuestBoardNotes, Placards, toScreen(), writeStyle(), createSitting(), hop(), createHallRoom() (+12 more)

### Community 139 - "personal/room.ts"
Cohesion: 0.09
Nodes (25): cafeAfterIndex(), computeLayout(), cutRooms(), HallLayout, HallRoomKind, HallRoomSpan, hasPedestal(), Span (+17 more)

### Community 140 - "Conn"
Cohesion: 0.31
Nodes (4): connectWebSocket(), SocketHandlers, Conn, message()

### Community 141 - "setPondState"
Cohesion: 0.46
Nodes (8): refreshWalletNow(), setPondState(), claim(), BaitShop(), buy(), Exchange(), exchange(), FishmongerPanel()

### Community 142 - "domain/guestboard.ts"
Cohesion: 0.16
Nodes (17): GET(), decodeCursor(), encodeCursor(), enforceLimits(), GuestNoteInput, GuestNoteRateLimited, GuestNoteRejected, listGuestNotes() (+9 more)

### Community 143 - "Local end-to-end stress test — 2026-11-06"
Cohesion: 0.20
Nodes (8): Environment and coverage, Fix status (2026-11-06), Follow-up coverage, Issue index, Local end-to-end stress test — 2026-11-06, Measured load, Passing checks and interpretation limits, Test data and cleanup

### Community 144 - "The Moonlit Pond — design"
Cohesion: 0.09
Nodes (22): Art the pond needs from the artist, Build contract (decided 2026-11-07), Build phases, Collection and goals, Done, Done, Guardrails, Leaderboards (+14 more)

### Community 145 - "Pond rework"
Cohesion: 0.18
Nodes (10): Baits, Client, Decisions, Done, Notes, Pond rework, Server, Species (+2 more)

### Community 146 - "rooms/art.ts"
Cohesion: 0.16
Nodes (13): AtelierArt, disposeAtelierArt(), loadGalleryDoor(), loadGalleryPillar(), loadImage(), ArtByRoom, AtelierArtwork, PersonalArt (+5 more)

### Community 147 - "Orchestration contract — you plan, DSH workers execute"
Cohesion: 0.29
Nodes (6): Briefing a worker, Budget hygiene, graphify, Orchestration contract — you plan, DSH workers execute, The worker, When not to delegate

### Community 148 - "tables.ts"
Cohesion: 0.11
Nodes (30): BaitTray(), BaitTrayProps, debugSpecies(), debugVariant(), GuestRollOptions, guestTreasure(), rollGuest(), BAIT (+22 more)

### Community 149 - "db.ts"
Cohesion: 0.23
Nodes (15): loop(), shutdown(), sleep(), sweepStale(), DrainResult, handler(), repairFrames(), repairUnframed() (+7 more)

### Community 150 - "Medium"
Cohesion: 0.13
Nodes (14): glowSprite(), LandingFx(), onClick(), onVisibility(), tick(), Mote, 10. Long names run off the name sign, 11. The rooms API skips the stale-tab member check (+6 more)

### Community 151 - "pond-state.ts"
Cohesion: 0.25
Nodes (14): PondStateView, PondTier, ensurePondStateStarted(), getPondStateSnapshot(), GUEST, listeners, LOADING, PondStateSnapshot (+6 more)

### Community 154 - "createNpcLayer"
Cohesion: 0.23
Nodes (14): castMember(), createNpcLayer(), createResidentView(), createView(), draw(), hideAll(), hideView(), spawnAtDoor() (+6 more)

### Community 157 - "Walkthrough.tsx"
Cohesion: 0.10
Nodes (29): BACKDROP_STYLE, MoreArrow(), NavArrow(), Props, SLIDE, Walkthrough(), XIcon(), decodedFrames (+21 more)

### Community 158 - "createPondRoom"
Cohesion: 0.30
Nodes (14): pathX(), createPondRoom(), approach(), busy(), finishWalk(), goTo(), leave(), move() (+6 more)

### Community 159 - "useSoundEffects.ts"
Cohesion: 0.13
Nodes (26): BackgroundMusic, clampVolume(), isDocumentHidden(), Options, useBackgroundMusic(), VISIBILITY_EVENTS, EFFECTS, EffectSpec (+18 more)

### Community 160 - "BunnyArtist.tsx"
Cohesion: 0.50
Nodes (4): BunnyArtist(), BunnyMood, Pencil(), POSES

### Community 161 - "walk"
Cohesion: 0.11
Nodes (20): between(), CAT, Edge, EDGES, runLandingCat(), choosePeeker(), peek(), walk() (+12 more)

### Community 162 - "MuseumStage.tsx"
Cohesion: 0.13
Nodes (16): MuseumLayout(), CoinToast(), Toast, Purse(), Stamp(), WalletProvider(), STAMP_SVG, STAMP_URL (+8 more)

### Community 163 - "painting-open"
Cohesion: 0.50
Nodes (4): file, kilobytes, seconds, painting-open

### Community 164 - "locations.ts"
Cohesion: 0.16
Nodes (21): hasUnpublished(), nudgeInRow(), OWNER, placePainting(), PlaceResult, PlaceTarget, publishLocation(), rowPlacements() (+13 more)

### Community 165 - "Multiplayer ("other visitors") — plan v2 (Cloudflare)"
Cohesion: 0.14
Nodes (13): ScreenChrome(), 0. Summary, 10. Decisions, 1. Product contract changes (approved 2026-10-31), 2. What already exists that this builds on, 3.1 Generated names (everyone has one), 3. Names, 5.1 Emotes (v1) (+5 more)

### Community 167 - "run.ts"
Cohesion: 0.20
Nodes (7): admin, childEnv, client, database, fresh, migrations, target

### Community 168 - "Tiny Museum"
Cohesion: 0.40
Nodes (4): Deployment, Layout, Running locally, Tiny Museum

### Community 169 - "icon-basket"
Cohesion: 0.67
Nodes (3): icon-basket, file, vector

### Community 170 - "media/storage.ts"
Cohesion: 0.11
Nodes (17): CONTENT_TYPES, GET(), PUT(), ACCEPTED, createAssetFromUpload(), MAX_UPLOAD_BYTES, presignUpload(), registerUpload() (+9 more)

### Community 171 - "visits.ts"
Cohesion: 0.09
Nodes (34): state(), amount(), duration(), dynamic, LANDMARKS, PAGES, RANGES, share() (+26 more)

### Community 172 - "lib/assets.ts"
Cohesion: 0.10
Nodes (28): Loading(), dynamic, Hall(), MuseumPage(), [BRAND_OWNER, ...BRAND_REST], CurrentlyShowing(), Decor(), dynamic (+20 more)

### Community 176 - "DecorDrawer.tsx"
Cohesion: 0.10
Nodes (21): DecorDrawer, DecorDrawerProps, SharingState, SLOT_LABELS, Tab, TABS, categoryOf(), DrawerCategory (+13 more)

### Community 179 - "createPersonalRoom"
Cohesion: 0.16
Nodes (17): cozyLevel, cozyWorth(), createPersonalRoom(), light(), shade(), showArrangement(), showLevel(), signFilter() (+9 more)

### Community 182 - "places.ts"
Cohesion: 0.18
Nodes (11): ATELIER_PAINTINGS, ATELIER_PLACES, atelierX(), HALL_PAINTINGS, HALL_PLACES, POND_PLACES, POND_SPOT_X, ROOM_MIN_X (+3 more)

### Community 183 - "Storyline (draft, saved 2026-11-17)"
Cohesion: 0.18
Nodes (10): Arc (soft, no fail state), Built so far, How it ties to what exists, Mystery hook, Next tasks (when picked up), Open questions, Premise, Seed (the owner's words) (+2 more)

### Community 184 - "bug-reports.ts"
Cohesion: 0.22
Nodes (12): BugContext, BugReport, BugReportDto, BugReportRejected, BugRow, CONTEXT_KEYS, countOpenBugReports(), EVERYONE (+4 more)

### Community 185 - "hall/room.ts"
Cohesion: 0.06
Nodes (50): Assets, Scenery, CUTS, disposeBoards(), Mark, plane(), ROPE_CUTS, ropeSlices() (+42 more)

### Community 186 - "Low"
Cohesion: 0.15
Nodes (13): 13. Pages that redirect or don't exist answer 200, 14. Error codes reveal which room slugs exist, 15. The name sign slides under the top-right buttons in Decorate, 16. Level-up celebrations can be farmed, 17. No hint of where things are after panning away, 18. Too many items is only discovered by the server, 19. Development-only: page payloads include the full room row, Checked and fine (+5 more)

### Community 187 - "backend.ts"
Cohesion: 0.15
Nodes (12): amplifyDir, backend, everyMinutes, mediaBucket, missing, repoRoot, REQUIRED, setting() (+4 more)

### Community 189 - "ensureEpoch"
Cohesion: 0.18
Nodes (16): GET(), intParam(), GET(), sketchPool, unavailable(), MuseumProps, EMPTY, firstSlice() (+8 more)

### Community 191 - "import-home-assets.mjs"
Cohesion: 0.07
Nodes (22): target, file(), DOOR, DOOR_BACKDROP, drop, FURNITURE, manifest, manifestPath (+14 more)

### Community 193 - "Monets Lily Pond: exploration, UX and multiplayer QA"
Cohesion: 0.29
Nodes (6): Browser and interaction coverage, Changes made from the walkthrough, Monets Lily Pond: exploration, UX and multiplayer QA, Multiplayer and load, Practical limits, Regression checks and cleanup

### Community 195 - "performance/page.tsx"
Cohesion: 0.27
Nodes (9): dynamic, format(), grade(), METRICS, PAGES, PerformancePage(), RANGES, summarizeVitals() (+1 more)

### Community 197 - "pond-api.ts"
Cohesion: 0.24
Nodes (19): buyPondBait(), claimPondBounty(), errorOf(), exchangePondPearls(), fetchPondBounties(), fetchPondDex(), fetchPondLeaderboard(), fetchPondState() (+11 more)

### Community 198 - "lib/slots/index.ts"
Cohesion: 0.06
Nodes (33): AccountHost(), AccountSheet, AccountSheet(), continueAnyway(), doSignOut(), runDelete(), runName(), submit() (+25 more)

### Community 199 - "minimap.test.ts"
Cohesion: 0.21
Nodes (11): follow(), doorPoint(), MAP_PLACES, MAP_SCALE, panTo(), planMap(), roomAt(), atelier (+3 more)

### Community 200 - "VitalsReporter.tsx"
Cohesion: 0.29
Nodes (8): firstPainting(), flush(), Metric, queue, REPORTED, VitalsReporter(), FIRST_PAINTING_MARK, MUSEUM_START_MARK

### Community 202 - "GameDesktop.tsx"
Cohesion: 0.33
Nodes (7): loadGameDesktop(), GameDesktop(), GameDesktopProps, MinigameFrame(), Minigame, MinigameId, MINIGAMES

### Community 204 - "Other visitors"
Cohesion: 0.29
Nodes (6): How it plays, Other visitors, Privacy, Running it in production, Running it locally, Staying consistent

### Community 207 - "rooms.ts"
Cohesion: 0.07
Nodes (52): roomEditor, GET(), PaintingRow, PER_EDITOR, PUT(), versionOf(), PER_EDITOR, POST() (+44 more)

### Community 208 - "shopkeeper.ts"
Cohesion: 0.25
Nodes (7): RigPiece, COATS, createShopkeeper(), GREETINGS, OUTFIT, recolourFur(), SHOPKEEPER_NAME

### Community 210 - "PondRoom.tsx"
Cohesion: 0.12
Nodes (20): Loading(), metadata, PondPage(), revealFloorTransition(), PondGame(), POND_NAME, PondLoading(), BOARD_TABS (+12 more)

### Community 211 - "4. Transport: Cloudflare Durable Objects"
Cohesion: 0.25
Nodes (8): 4. Transport: Cloudflare Durable Objects, Decision (2026-10-31), Deploying, Identity cannot be forged, Local development and tests, Rooms and capacity, Shape of `apps/presence` (about 200 lines), main()

### Community 217 - "setCostumeVisibility"
Cohesion: 0.50
Nodes (3): Layer, setCostumeVisibility(), setCostume()

### Community 219 - "Item"
Cohesion: 0.19
Nodes (3): Presence, Item, Refusal

### Community 221 - "ref_node_assert"
Cohesion: 0.09
Nodes (15): ATELIER_END_X, ATELIER_ROOMS, COLLECTIONS, ENTRANCE, FormBase, HeadpieceSpot, ROOM_TEMPLATE, SWAG_STEP (+7 more)

## Knowledge Gaps
- **5 isolated node(s):** `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1498 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **31 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `SketchGuess.tsx`, `app/layout.tsx`, `bug-reports.ts`, `machine.ts`, `Museum.tsx`, `Test Fakes and Helpers`, `ArrangeControls.tsx`, `room-events.ts`, `PersonalRoom.tsx`, `tables.ts`, `Medium`, `pond-state.ts`, `wardrobe.ts`, `LeaderboardPanel.tsx`, `Walkthrough.tsx`, `Web Package Dependencies`, `useSoundEffects.ts`, `MuseumStage.tsx`, `risk.ts`, `RigPreview.tsx`, `lib/assets.ts`, `audience.ts`, `DecorDrawer.tsx`, `actions.ts`, `Water.tsx`, `slots/store.ts`, `lib/presence.ts`, `pond-format.ts`, `domain/guestboard.ts`, `lib/slots/index.ts`, `BountyPanel.tsx`, `PondTicker.tsx`, `VitalsReporter.tsx`, `PondRoom.tsx`, `FishingView.tsx`, `CrowdPreview.tsx`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._
- **What connects `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json` to the rest of the system?**
  _5 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `stage.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.033934707903780066 - nodes in this community are weakly interconnected._
- **Why does `defaultStore()` connect `economy/store.ts` to `stage.ts`, `initialize`, `pond-api.ts`, `lib/slots/index.ts`, `react`, `SyncStore`, `writeStyle`, `pondgame/lib/api.ts`, `room-events.ts`, `rooms.ts`, `slots/store.ts`, `PersonalRoom.tsx`, `pond-state.ts`, `wardrobe.ts`, `hall/room.ts`, `createPondRoom`, `pond/room.ts`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Should `SketchGuess.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10476190476190476 - nodes in this community are weakly interconnected._
- **Why does `three` connect `hall/room.ts` to `atelier.ts`, `remote-visitors.ts`, `stage.ts`, `import-home-assets.mjs`, `scene/ambience.ts`, `scene/assets.ts`, `schedule.test.ts`, `scene.ts`, `cozy.ts`, `pond/art.ts`, `rooms/art.ts`, `rig.ts`, `ambience.ts`, `Web Package Dependencies`, `pond/room.ts`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Should `themes.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06868686868686869 - nodes in this community are weakly interconnected._