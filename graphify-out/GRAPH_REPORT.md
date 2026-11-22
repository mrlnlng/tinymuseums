# Graph Report - tiny-museum  (2026-11-21)

## Corpus Check
- 551 files · ~337,279 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 111 file(s) not represented in the graph (top: .avif 56, .glb 38, .css 6)

## Summary
- 5025 nodes · 12845 edges · 228 communities (195 shown, 33 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 258 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d992ee6e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- revealFloorTransition
- Walker
- SketchGuess.tsx
- DecorController
- builtUrl
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
- features/economy/index.ts
- room-events.ts
- schedule.ts
- ref_node_assert
- amplify/package.json
- logic.ts
- prepare-models.mjs
- Traversal
- core/package.json
- media/storage.ts
- PlacementLayer
- domain/guestboard.ts
- pond-api.ts
- ambience.ts
- core/src/index.ts
- Web Package Dependencies
- Gamifying Tiny Museum — genre direction & engagement research
- DecorDrawer.tsx
- remote-visitors.ts
- risk.ts
- amplify/tsconfig.json
- 5. Customization menu — what other people are doing
- gallery.ts
- handlers.ts
- Web TSConfig
- Root Package Manifest
- basis_transcoder.js
- AccountSheet.tsx
- import-fishing-assets.mjs
- Base TSConfig
- Amplify Build Spec
- sketchguess/lib/api.ts
- a/[slug]/page.tsx
- slots/store.ts
- domain/sketch.ts
- Water.tsx
- Worker Package Manifest
- Public Asset Manifest
- SlotDef
- vitals.ts
- compose-atelier.mjs
- lib/presence.ts
- pond-format.ts
- lib/slots/index.ts
- economy/store.ts
- pond-boards.ts
- room.ts
- minimap.ts
- wander.test.ts
- domain/guestboard.ts
- Sound Effect Assets
- art-cache.ts
- Custom HTTP Headers
- Sharp Layer Package
- stage.ts
- scene/ambience.ts
- Confirmed issues
- PondRoom.tsx
- PersonalRoom
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
- usePondState
- Bug Reports SQL Schema
- Vitals SQL Schema
- json
- ClosetView.tsx
- pond/room.ts
- members.ts
- Run-Once Schema
- wardrobe.ts
- FishingView.tsx
- PersonalRoom.tsx
- npc-layer.ts
- hang-tag.ts
- wallet/body.ts
- graftCostume
- pondgame/lib/api.ts
- worker/tsconfig.json
- core/tsconfig.json
- import-landing-assets.mjs
- How to Design for Failures — ByteByteGo Newsletter
- Worker instructions — DSH headless agents
- Backend
- protocol.ts
- Costume gallery doorway
- infra/jobs.ts
- Fishing forest: painted asset pass
- audio/README.md
- .claude/CLAUDE.md
- The Costume Atelier
- hitForVisitor
- rig.ts
- Curating the paintings (2026-11-07)
- actions.ts
- presence/tsconfig.json
- wallet.ts
- tsconfig.test.json
- app/layout.tsx
- tab-turn.ts
- peers.ts
- run.ts
- bug-reports.ts
- npc-layer.ts
- import-home-assets.mjs
- room-places.ts
- visits/page.tsx
- Storage
- VitalsReporter.tsx
- env.ts
- The Moonlit Pond — design
- Pond rework
- createStage
- Orchestration contract — you plan, DSH workers execute
- tables.ts
- outbox.test.ts
- .webSocketMessage
- pond-state.ts
- PondTicker.tsx
- AtelierRoom
- SoundProvider.tsx
- Atelier: the dressing mirror, and show-don't-tell keeping
- react
- Walkthrough.tsx
- createPondRoom
- useSoundEffects.ts
- BountyPanel.tsx
- LandingFx
- import-hall-assets.mjs
- painting-open
- npc-sheet.cjs
- Multiplayer ("other visitors") — plan v2 (Cloudflare)
- Lobby
- ExceptionInfo
- darknessAt
- icon-basket
- scripts
- visits.ts
- Medium
- bunny-left
- Local end-to-end stress test — 2026-11-06
- bunny-right
- writeLocal
- ticket.ts
- icon-home
- createPlacementLayer
- createCozyBackdrop
- ticket
- schedule.test.ts
- Storyline (draft, saved 2026-11-17)
- HallArranger.tsx
- bake-pond-path.mjs
- Low
- Open rooms and the tip jar (design, 2026-11-21)
- draw.py
- Personal room: stress-test issues
- walk
- confirm/page.tsx
- perf.ts
- Monets Lily Pond: exploration, UX and multiplayer QA
- createWasm
- earn
- rooms.ts
- Your Room: a room you can freely furnish
- ticket/route.ts
- mail.ts
- Item
- messages.ts
- FilesystemStorage
- npcs/README.md
- xdog.ts
- nearby.ts
- postRun
- ref_node_assert
- HomeSignIn.tsx
- AtelierKeeps
- MuseumStage.tsx
- Other visitors
- Clock
- instantiateArrayBuffer
- reveal.ts
- PlayerCard
- PresencePreview.tsx
- presence/src/index.ts
- craftInvokerFunction
- Context
- RegisteredPointer_fromWireType
- Notes
- createDecorController
- mutation-guard.ts
- next.config.ts
- PondControl

## God Nodes (most connected - your core abstractions)
1. `react` - 80 edges
2. `json()` - 72 edges
3. `query()` - 68 edges
4. `PersonalRoom()` - 67 edges
5. `hit()` - 58 edges
6. `limited()` - 52 edges
7. `three` - 48 edges
8. `next` - 44 edges
9. `Traversal` - 44 edges
10. `SyncStore` - 41 edges

## Surprising Connections (you probably didn't know these)
- `Code` --references--> `followOutfit()`  [INFERRED]
  docs/costume-atelier.md → apps/web/src/features/hall/scene/wardrobe.ts
- `E2E-009 — Room mutations ignore stale account identity` --references--> `memberFromRequest()`  [INFERRED]
  docs/testing/local-e2e-stress-2026-11-06.md → apps/web/src/shared/lib/member-route.ts
- `Where things stand` --references--> `sealEpoch()`  [INFERRED]
  docs/curation-plan.md → packages/core/src/domain/epoch.ts
- `19. Development-only: page payloads include the full room row` --references--> `getRoom()`  [INFERRED]
  docs/personal-room-issues.md → packages/core/src/domain/rooms.ts
- `Server` --references--> `readPondTicket()`  [INFERRED]
  docs/pond-rework.md → packages/core/src/economy/pond.ts

## Import Cycles
- None detected.

## Communities (228 total, 33 thin omitted)

### Community 0 - "revealFloorTransition"
Cohesion: 0.33
Nodes (6): Loading(), AtelierLoading(), coverFloorTransition(), revealFloorTransition(), createRoomPassage(), fixture()

### Community 1 - "Walker"
Cohesion: 0.17
Nodes (4): PondPlaceData, FloorPoint, WalkArea, Walker

### Community 2 - "SketchGuess.tsx"
Cohesion: 0.08
Nodes (38): BunnyArtist(), BunnyMood, Pencil(), POSES, bestKeyFor(), BURST, clueUrl(), openingPlan() (+30 more)

### Community 3 - "DecorController"
Cohesion: 0.08
Nodes (3): DecorController, PersonalRoomOptions, HighlightArea

### Community 4 - "builtUrl"
Cohesion: 0.11
Nodes (29): GET(), intParam(), GET(), sketchPool, unavailable(), Loading(), dynamic, Hall() (+21 more)

### Community 5 - "round.ts"
Cohesion: 0.12
Nodes (33): ColorRecall(), ColorRecallProps, Phase, readBest(), deltaE(), GAMUT_EPSILON, hexToOklab(), inGamut() (+25 more)

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
Cohesion: 0.17
Nodes (6): encodeStored(), parseStored(), readStored(), writeStored(), SyncStore, upgrade()

### Community 10 - "machine.ts"
Cohesion: 0.12
Nodes (35): CastMeter(), ReelMeter(), armCast(), BITE_WINDOW, biteGap(), CHARGE_PERIOD, chargePower(), createFishingState() (+27 more)

### Community 11 - "Museum.tsx"
Cohesion: 0.11
Nodes (30): CoinFound, ColorRecall, GameDesktop, GuestBoard, HallArranger, HelpGuide, loadCoinFound(), loadGameDesktop() (+22 more)

### Community 12 - "Test Fakes and Helpers"
Cohesion: 0.11
Nodes (24): deferredFetch(), deviceSlot, FakeEvents, FakeStorage, fixture, fixtureB, fixtureRegistry, fixtureRegistryBoth (+16 more)

### Community 13 - "scene.ts"
Cohesion: 0.04
Nodes (36): disposeDisplayTexture(), HELM_PEDESTAL_FILE, prefersAvif(), HiddenCoin, cafeAfterIndex(), computeLayout(), cutRooms(), HallLayout (+28 more)

### Community 14 - "cozy.ts"
Cohesion: 0.07
Nodes (46): ATELIER_PROPS, AtelierImage, atticWindowCanvas(), bareBulbCanvas(), boardsCanvas(), canvasTexture(), ceilingTexture(), cobwebCanvas() (+38 more)

### Community 15 - "features/economy/index.ts"
Cohesion: 0.09
Nodes (28): MuseumLayout(), CoinToast(), Toast, Purse(), Stamp(), WalletProvider(), serverSnapshot, useEarnEvents() (+20 more)

### Community 16 - "room-events.ts"
Cohesion: 0.19
Nodes (26): ChatButton(), REFUSED, joinRoom(), announceNameChange(), emit(), getPeople(), isInRoom(), isMuted() (+18 more)

### Community 17 - "schedule.ts"
Cohesion: 0.07
Nodes (55): addDwellEmotes(), addEmote(), addGap(), addStand(), addWalk(), along(), buildRoomTable(), buildStayPlan() (+47 more)

### Community 18 - "ref_node_assert"
Cohesion: 0.11
Nodes (30): defineSlot(), docBytes(), SLOTS, byAtThenKey(), encoded(), latest, mapOf(), maxNumber() (+22 more)

### Community 19 - "amplify/package.json"
Cohesion: 0.08
Nodes (26): amplifyDir, backend, everyMinutes, mediaBucket, missing, repoRoot, REQUIRED, setting() (+18 more)

### Community 20 - "logic.ts"
Cohesion: 0.14
Nodes (27): carriedTo(), nudged(), baseOf(), clampX(), clampY(), FINISH_NAMES, freeX(), intoSpan() (+19 more)

### Community 21 - "prepare-models.mjs"
Cohesion: 0.06
Nodes (43): paintedCostume(), alongArm(), ARMS, armTurn(), BODIES, bruce, BRUCE_FIT, BRUCE_PLACE (+35 more)

### Community 22 - "Traversal"
Cohesion: 0.05
Nodes (17): clamp(), fixture(), jump(), Traversal, RoomContents, Decisions (2026-11-05), Follow-ups after Phases 4–7, Model (`apps/web/src/features/rooms/types.ts`) (+9 more)

### Community 23 - "core/package.json"
Cohesion: 0.06
Nodes (40): dependencies, @aws-sdk/client-s3@^3.1121.0, @aws-sdk/s3-request-presigner@^3.1121.0, bcryptjs@^2.4.3, obscenity@^0.4.6, pg@^8.13.1, sharp@^0.33.5, thumbhash@^0.1.1 (+32 more)

### Community 24 - "media/storage.ts"
Cohesion: 0.19
Nodes (16): CONTENT_TYPES, GET(), PUT(), ACCEPTED, createAssetFromUpload(), MAX_UPLOAD_BYTES, presignUpload(), registerUpload() (+8 more)

### Community 26 - "domain/guestboard.ts"
Cohesion: 0.10
Nodes (26): GET(), BugReport, BugReportDto, BugReportRejected, BugRow, CONTEXT_KEYS, EVERYONE, normalizeBugPage() (+18 more)

### Community 27 - "pond-api.ts"
Cohesion: 0.15
Nodes (27): buyPondBait(), claimPondBounty(), errorOf(), exchangePondPearls(), fetchPondLeaderboard(), isRecord(), isStateView(), mutationHeaders() (+19 more)

### Community 28 - "ambience.ts"
Cohesion: 0.12
Nodes (30): blade(), bloom(), BLOOMS, createPondAmbience(), update(), fishTexture(), frond(), FRONT_ROWS (+22 more)

### Community 29 - "core/src/index.ts"
Cohesion: 0.05
Nodes (113): addBait(), PondBoardMe, PondBoardRow, PondFeedItem, Rep, bountyCatches(), BountyCatchRow, bountyViews() (+105 more)

### Community 30 - "Web Package Dependencies"
Cohesion: 0.07
Nodes (33): dependencies, embla-carousel-react@^8.6.0, next@^15.0.3, react@^19.0.0, react-dom@^19.0.0, swr@^2.5.1, three@^0.169.0, thumbhash@^0.1.1 (+25 more)

### Community 31 - "Gamifying Tiny Museum — genre direction & engagement research"
Cohesion: 0.10
Nodes (19): 0.1 The core experience, 0.2 Systems that make gamification cheap to build, 0.3 Constraints that shape any recommendation, 0. What the game is today (the deep dive), 1.1 The landscape (seven candidates, with verdicts), 1.2 Recommendation: a **cozy gallery life-sim** — "the gallery you live in", 1.3 The five design pillars the genre implies, 1. Genre direction (+11 more)

### Community 32 - "DecorDrawer.tsx"
Cohesion: 0.11
Nodes (22): useWallet(), stampLabel(), DecorDrawer, DecorDrawerProps, SLOT_LABELS, Tab, TABS, categoryOf() (+14 more)

### Community 33 - "remote-visitors.ts"
Cohesion: 0.04
Nodes (70): Assets, Scenery, CUTS, disposeBoards(), Mark, plane(), ROPE_CUTS, ropeSlices() (+62 more)

### Community 34 - "risk.ts"
Cohesion: 0.12
Nodes (33): Hud(), HudProps, HudWagerChip, WagerPicker(), chooseTier(), WagerPickerProps, CastOptions, PondStateView (+25 more)

### Community 35 - "amplify/tsconfig.json"
Cohesion: 0.20
Nodes (9): compilerOptions, module, moduleResolution, noUnusedLocals, noUnusedParameters, exclude, extends, include (+1 more)

### Community 36 - "5. Customization menu — what other people are doing"
Cohesion: 0.12
Nodes (16): 1. The target: what "Claude Opus 5.5" actually means, 2. Where your harness stands today (live config I read), 3. The honest gap model, 4. Quality levers, ranked by leverage, 5. Customization menu — what other people are doing, 6. Recommended starting kit for *your* profile, 7. What I can apply for you right now (needs your go-ahead), A. Prompt & persona (most common quality customizations) (+8 more)

### Community 37 - "gallery.ts"
Cohesion: 0.27
Nodes (10): deletePiece(), GalleryPiece, hangPiece(), MAX_STANDS, movePiece(), unhangPiece(), PublishCheck, PublishReport (+2 more)

### Community 38 - "handlers.ts"
Cohesion: 0.13
Nodes (27): handleDerivatives(), handleNotifyFollowers(), handleRenderDisplay(), handleSealEpoch(), renderPieceFrame(), renderPieceSketch(), runJob(), getMailer() (+19 more)

### Community 39 - "Web TSConfig"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 40 - "Root Package Manifest"
Cohesion: 0.10
Nodes (22): [, width, height], description, devDependencies, concurrently@^9.1.0, esbuild@^0.24.0, ktx2-encoder@^0.6.0, maxrects-packer@^2.7.3, playwright@^1.63.0 (+14 more)

### Community 41 - "basis_transcoder.js"
Cohesion: 0.07
Nodes (3): onComplete(), registerType(), sharedRegisterType()

### Community 42 - "AccountSheet.tsx"
Cohesion: 0.12
Nodes (19): AccountHost(), AccountSheet, AccountSheet(), continueAnyway(), doSignOut(), runDelete(), runName(), submit() (+11 more)

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
Cohesion: 0.23
Nodes (13): sameOriginUrl(), PreparedGame, decodeImage(), fetchBitmap(), fetchRound(), guarded(), LoadedRound, loadInk() (+5 more)

### Community 47 - "a/[slug]/page.tsx"
Cohesion: 0.31
Nodes (6): ArtistPage(), dynamic, generateMetadata(), GET(), FollowForm(), getArtistPage()

### Community 48 - "slots/store.ts"
Cohesion: 0.19
Nodes (14): ANON_PREFIX, anonKey(), deviceKey(), isMemberSlotKey(), listKeys(), MEMBER_KEY, memberKey(), memberPrefix() (+6 more)

### Community 49 - "domain/sketch.ts"
Cohesion: 0.10
Nodes (30): listPieces(), pieceImageUrl(), PieceRow, toPieceDto(), EpochRow, GalleryRow, planSketchRound(), SKETCH_CHOICES (+22 more)

### Community 50 - "Water.tsx"
Cohesion: 0.07
Nodes (39): AmbientShadow, box(), BUCKET, bunnyBox(), easeOut(), Glint, LEFT_STYLE, lineColour() (+31 more)

### Community 51 - "Worker Package Manifest"
Cohesion: 0.14
Nodes (14): dependencies, @tiny/core@*, exports, ./lambda, @tiny/core, main, name, private (+6 more)

### Community 52 - "Public Asset Manifest"
Cohesion: 0.12
Nodes (15): artworks, bunny, size, floor, size, fonts, icon-no-photos, size (+7 more)

### Community 53 - "SlotDef"
Cohesion: 0.18
Nodes (3): FakeServer, SlotState, SlotDef

### Community 54 - "vitals.ts"
Cohesion: 0.16
Nodes (15): dynamic, format(), grade(), METRICS, PAGES, PerformancePage(), RANGES, DEVICES (+7 more)

### Community 55 - "compose-atelier.mjs"
Cohesion: 0.12
Nodes (10): body, dressLayer, dressWidth, floralWidth, hanger, MANNEQUIN_CANVAS, mask, root (+2 more)

### Community 56 - "lib/presence.ts"
Cohesion: 0.12
Nodes (18): Outcome, Connect, connectWebSocket(), fetchTicket, HEARTBEAT_MS, HIDDEN_LIMIT_MS, RETRY_MS, SAY_GAP_MS (+10 more)

### Community 57 - "pond-format.ts"
Cohesion: 0.12
Nodes (28): fetchPondDex(), PondDex, EXCHANGE_DAILY_STAMPS, EXCHANGE_PEARLS_PER_STAMP, FISH_ART, fishArt(), formatPercent(), formatShortSizeCm() (+20 more)

### Community 58 - "lib/slots/index.ts"
Cohesion: 0.09
Nodes (12): KeepOnOtherDevices(), A, Probe(), StoredSlot, createStore(), EventTargetLike, MemberInfo, SlotHandle (+4 more)

### Community 59 - "economy/store.ts"
Cohesion: 0.12
Nodes (39): CARRY_CAP, carryAdd(), CarryEntry, carryPrune(), carryRemove(), chunk(), ClaimRequest, tzOffsetNow() (+31 more)

### Community 60 - "pond-boards.ts"
Cohesion: 0.16
Nodes (18): compare(), DexRow, displayName(), FeedRow, getPondDex(), getPondFeed(), getPondLeaderboard(), NameRow (+10 more)

### Community 61 - "room.ts"
Cohesion: 0.15
Nodes (27): admitted(), Attachment, farewell(), GHOST_MS, HELLO_TIMEOUT_MS, holdsOf(), homeOf(), MAX_WAITING_PER_IP (+19 more)

### Community 62 - "minimap.ts"
Cohesion: 0.07
Nodes (35): place(), ATELIER_DOOR, createMinimap(), draw(), drawRoom(), floors(), follow(), sketchOf() (+27 more)

### Community 63 - "wander.test.ts"
Cohesion: 0.12
Nodes (17): FloorSpot, Job, Place, Phase, ResidentState, Run, WalkPath, WalkState (+9 more)

### Community 64 - "domain/guestboard.ts"
Cohesion: 0.11
Nodes (27): BoardScreen(), BoardScreenProps, ComposeScreen(), ComposeScreenProps, blankDraft(), GuestBoard(), GuestBoardProps, View (+19 more)

### Community 65 - "Sound Effect Assets"
Cohesion: 0.22
Nodes (9): file, kilobytes, seconds, file, kilobytes, seconds, soundEffects, click (+1 more)

### Community 66 - "art-cache.ts"
Cohesion: 0.13
Nodes (10): ArtCache, ArtCacheOptions, createArtCache(), drop(), expireLater(), hold(), HeldArt, LoadResult (+2 more)

### Community 67 - "Custom HTTP Headers"
Cohesion: 0.25
Nodes (7): applications, appRoot, customHeaders, headers, pattern, key, value

### Community 68 - "Sharp Layer Package"
Cohesion: 0.33
Nodes (6): dependencies, sharp@^0.33.5, description, sharp, name, private

### Community 69 - "stage.ts"
Cohesion: 0.04
Nodes (41): subscribeWallet(), CameraRig, Carried, CarriedState, createCarried(), Character, centerYFor(), CONFIG (+33 more)

### Community 70 - "scene/ambience.ts"
Cohesion: 0.13
Nodes (13): BULBS, createHallAmbience(), finish(), glowTexture(), HallAmbience, mulberry(), painted(), vignetteTexture() (+5 more)

### Community 71 - "Confirmed issues"
Cohesion: 0.11
Nodes (18): Confirmed issues, E2E-002 — Valid edge placement rejected through floating-point precision, E2E-003 — One owned prop can be placed multiple times, E2E-004 — Reload before autosave silently loses the latest placement, E2E-005 — Failed save and failed Done have no visible mobile explanation, E2E-006 — Restoring connectivity does not retry a failed draft save, E2E-007 — Keyboard activation cannot place drawer items, E2E-008 — Creating an account from My Room leaves the signed-in user on the sign-in prompt (+10 more)

### Community 72 - "PondRoom.tsx"
Cohesion: 0.12
Nodes (21): Loading(), metadata, PondPage(), POND_NAME, PondLoading(), BOARD_TABS, PondOverlayKind, PondPanels() (+13 more)

### Community 73 - "PersonalRoom"
Cohesion: 0.16
Nodes (22): overDrawer(), PersonalRoom(), canPlaceNew(), carryEnd(), carryMove(), finishJob(), later(), offerWear() (+14 more)

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
Nodes (22): ArtByRoom, colorAt(), decoded(), disposePondArt(), EDGE_BAND, EDGE_BANDS, EDGE_OVERLAP, edgeTexture() (+14 more)

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
Cohesion: 0.17
Nodes (28): along(), beginNext(), beginWork(), between(), blockedAt(), chooseStop(), clamp(), doorsIn() (+20 more)

### Community 84 - "presence/package.json"
Cohesion: 0.14
Nodes (16): dependencies, @tiny/core@*, devDependencies, @cloudflare/workers-types@5.20261016.1, wrangler@4.151.1, @tiny/core, name, private (+8 more)

### Community 85 - "createAtelierRoom"
Cohesion: 0.20
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

### Community 89 - "usePondState"
Cohesion: 0.23
Nodes (10): GLYPHS, PearlIcon(), POND_CRIMSON, PondIconName, fetchPondBounties(), getPondStateSnapshot(), subscribePondState(), usePondState() (+2 more)

### Community 93 - "json"
Cohesion: 0.09
Nodes (60): POST(), POST(), GET(), GLOBAL, PER_IP, POST(), POST(), GLOBAL (+52 more)

### Community 94 - "ClosetView.tsx"
Cohesion: 0.05
Nodes (60): pictureOf(), ClosetView(), onKeyDown(), LISTS, PLACE, PODIUM_SRC, Slot, SPOTLIGHT_SRC (+52 more)

### Community 95 - "pond/room.ts"
Cohesion: 0.11
Nodes (30): water, depthAtLift(), FAR_LIFT, FAR_SCALE, liftAt(), PondPath, PROP_DEPTH, scaleAt() (+22 more)

### Community 96 - "members.ts"
Cohesion: 0.05
Nodes (71): GET(), VisitorName, registerAction(), Code, 3.1 Generated names (everyone has one), 3.2 Chosen names (members), 3. Names, registry (+63 more)

### Community 104 - "wardrobe.ts"
Cohesion: 0.07
Nodes (50): AtelierPage(), dynamic, metadata, allowedCharacter(), OwnedSnapshot, owns(), walletReady(), getWalletSnapshot() (+42 more)

### Community 105 - "FishingView.tsx"
Cohesion: 0.12
Nodes (14): CONFETTI_COLORS, ConfettiPiece, makeConfetti(), RevealCard(), TIER_MS, TIER_SFX, useCountUp(), AudioContextClass (+6 more)

### Community 106 - "PersonalRoom.tsx"
Cohesion: 0.11
Nodes (18): Carry, errorReason(), Job, Offer, PersonalRoomProps, Puff, readSeen(), RETRY_MS (+10 more)

### Community 107 - "npc-layer.ts"
Cohesion: 0.15
Nodes (18): BY_ID, CAST, FRAME, IDLE, idleCel(), NPC_WALK_SPEED, NpcCharacter, WANDERER_IDS (+10 more)

### Community 108 - "hang-tag.ts"
Cohesion: 0.12
Nodes (8): CARD, createHangTag(), HangTag, HangTagStyle, HOLE, KNOT, What goes, and what replaces it, Refusal

### Community 109 - "wallet/body.ts"
Cohesion: 0.13
Nodes (22): PER_MEMBER, POST(), PER_MEMBER, POST(), catchIdOf(), isRecord(), MAX_POND_BODY_BYTES, pearlsOf() (+14 more)

### Community 110 - "graftCostume"
Cohesion: 0.27
Nodes (14): canvasFit(), compose(), graftCostume(), copyAccessor(), copyMaterial(), copyMesh(), copyTexture(), copyView() (+6 more)

### Community 111 - "pondgame/lib/api.ts"
Cohesion: 0.15
Nodes (28): CAST_ERRORS, coarsePointer(), FishingView(), initialEasyReel(), isTyping(), LOST, PondGameProps, Toast (+20 more)

### Community 112 - "worker/tsconfig.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 113 - "core/tsconfig.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 114 - "import-landing-assets.mjs"
Cohesion: 0.08
Nodes (11): socket(), target, CAT, drop, EXPECTED, manifest, manifestPath, masters (+3 more)

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
Cohesion: 0.23
Nodes (16): isItem(), isName(), isPid(), isSeq(), MAX_HOLDS, MAX_INSTANCE, MAX_MESSAGE_BYTES, parseClientMessage() (+8 more)

### Community 119 - "Costume gallery doorway"
Cohesion: 0.50
Nodes (3): Costume gallery doorway, Curtain colour edit, Prompt

### Community 120 - "infra/jobs.ts"
Cohesion: 0.23
Nodes (15): loop(), shutdown(), sleep(), sweepStale(), DrainResult, handler(), repairFrames(), repairUnframed() (+7 more)

### Community 121 - "Fishing forest: painted asset pass"
Cohesion: 0.10
Nodes (18): Assets, Bruce's collection refresh (2026-11-08), Fishing forest illustrations, Made by hand (not touched by the script), Main hall v2 (2026-11-10), Monets Lily Pond (2026-11-08), 1. Forest doorway, 2. Woodland noticeboard (+10 more)

### Community 124 - "The Costume Atelier"
Cohesion: 0.14
Nodes (13): Adding a character, Adding a costume, Art not supplied as files, Bruce's Chronicles, Checked against the mocks (2026-11-07), Code, Costume fit review, Floral collection (+5 more)

### Community 125 - "hitForVisitor"
Cohesion: 0.10
Nodes (32): POST(), ALLOWED, PER_VISITOR, POST(), POST(), POST(), POST(), GET() (+24 more)

### Community 126 - "rig.ts"
Cohesion: 0.03
Nodes (102): CrowdPreviewPage(), RigPreviewPage(), CrowdPreview(), draw(), KINDS, Stats, Window, NEXT (+94 more)

### Community 127 - "Curating the paintings (2026-11-07)"
Cohesion: 0.13
Nodes (14): 1. The registry and the table, 2. The studio's Location picker, 3. The rooms draw what is placed, 4. Credits, 5. Retiring self-serve artists, Building it, Curating the paintings (2026-11-07), Decided (+6 more)

### Community 128 - "actions.ts"
Cohesion: 0.05
Nodes (84): GET(), PaintingRow, GET(), POST(), UPLOADS_PER_ARTIST, POST(), UPLOADS_PER_ARTIST, dynamic (+76 more)

### Community 129 - "presence/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, types, exclude, extends, include, ../../tsconfig.base.json

### Community 130 - "wallet.ts"
Cohesion: 0.07
Nodes (45): grantPearls(), member(), now, piece(), randomId(), today, baitOf(), applyClaim() (+37 more)

### Community 131 - "tsconfig.test.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 132 - "app/layout.tsx"
Cohesion: 0.14
Nodes (15): bethEllen, inspiratiq, metadata, notoSans, RootLayout(), sniglet, viewport, SoundContext (+7 more)

### Community 133 - "tab-turn.ts"
Cohesion: 0.16
Nodes (5): createTabTurn(), TabTurn, tab(), TurnEnv, TurnMessage

### Community 134 - "peers.ts"
Cohesion: 0.13
Nodes (9): Entry, INTERPOLATION_DELAY_MS, PEER_TIMEOUT_MS, PeerTable, positionAt(), Sample, look, Look (+1 more)

### Community 135 - "run.ts"
Cohesion: 0.20
Nodes (7): admin, childEnv, client, database, fresh, migrations, target

### Community 136 - "bug-reports.ts"
Cohesion: 0.20
Nodes (15): BugReportHost(), BugReportSheet, BugReportSheet(), send(), Status, collectContext(), inAppBrowser(), onOpenBugReport() (+7 more)

### Community 137 - "npc-layer.ts"
Cohesion: 0.18
Nodes (21): castMember(), createNpcLayer(), createResidentView(), createView(), departedRecently(), draw(), fadeOut(), glyphWidth() (+13 more)

### Community 138 - "import-home-assets.mjs"
Cohesion: 0.10
Nodes (17): file(), DOOR, DOOR_BACKDROP, drop, FURNITURE, manifest, manifestPath, masters (+9 more)

### Community 139 - "room-places.ts"
Cohesion: 0.08
Nodes (35): AtelierArt, disposeAtelierArt(), loadGalleryDoor(), loadGalleryPillar(), loadImage(), atelierRoomInfo(), atelierX(), copy() (+27 more)

### Community 140 - "visits/page.tsx"
Cohesion: 0.27
Nodes (9): amount(), duration(), dynamic, LANDMARKS, PAGES, RANGES, share(), VisitsPage() (+1 more)

### Community 142 - "VitalsReporter.tsx"
Cohesion: 0.29
Nodes (8): firstPainting(), flush(), Metric, queue, REPORTED, VitalsReporter(), FIRST_PAINTING_MARK, MUSEUM_START_MARK

### Community 143 - "env.ts"
Cohesion: 0.15
Nodes (14): main(), SCHEMA_DIR, closePool(), getPool(), poolConfig(), sslFor(), isProduction(), presenceSecret() (+6 more)

### Community 144 - "The Moonlit Pond — design"
Cohesion: 0.09
Nodes (22): Art the pond needs from the artist, Build contract (decided 2026-11-07), Build phases, Collection and goals, Done, Done, Guardrails, Leaderboards (+14 more)

### Community 145 - "Pond rework"
Cohesion: 0.18
Nodes (10): Baits, Client, Decisions, Done, Notes, Pond rework, Server, Species (+2 more)

### Community 146 - "createStage"
Cohesion: 0.16
Nodes (21): boundedCameraX(), createNearby(), createStage(), closeEntry(), enter(), initialize(), aim(), drawFrame() (+13 more)

### Community 147 - "Orchestration contract — you plan, DSH workers execute"
Cohesion: 0.29
Nodes (6): Briefing a worker, Budget hygiene, graphify, Orchestration contract — you plan, DSH workers execute, The worker, When not to delegate

### Community 148 - "tables.ts"
Cohesion: 0.09
Nodes (40): FrameShape, BaitTray(), BaitTrayProps, RevealCardProps, PondCatch, CatchView, debugSpecies(), debugVariant() (+32 more)

### Community 149 - "outbox.test.ts"
Cohesion: 0.27
Nodes (12): OUTBOX_CAP, outboxAdd(), outboxDue(), OutboxEntry, outboxFail(), outboxRemove(), RETRY_BASE_MS, RETRY_MAX_MS (+4 more)

### Community 150 - ".webSocketMessage"
Cohesion: 0.44
Nodes (3): attachmentOf(), Room, sendTo()

### Community 151 - "pond-state.ts"
Cohesion: 0.24
Nodes (15): fetchPondState(), memberId(), PondStateView, PondTier, ensurePondStateStarted(), GUEST, listeners, LOADING (+7 more)

### Community 152 - "PondTicker.tsx"
Cohesion: 0.29
Nodes (11): fetchPondFeed(), PondFeedItem, catchLabel(), formatSizeCm(), speciesFor(), speciesName(), speciesTier(), isGolden() (+3 more)

### Community 154 - "SoundProvider.tsx"
Cohesion: 0.33
Nodes (4): StageOptions, RoomSound, SoundState, EffectName

### Community 155 - "Atelier: the dressing mirror, and show-don't-tell keeping"
Cohesion: 0.13
Nodes (14): Atelier: the dressing mirror, and show-don't-tell keeping, Build order, Built (2026-11-20), Decisions (2026-11-19), Follow-ups (2026-11-20), Goal, In the room, Keeping (+6 more)

### Community 156 - "react"
Cohesion: 0.16
Nodes (15): motion@^13.1.1, openBugReport(), fitWidth(), HelpGuide(), HelpGuideProps, POINTER_STEPS, TOUCH_STEPS, MinigameFrameProps (+7 more)

### Community 157 - "Walkthrough.tsx"
Cohesion: 0.11
Nodes (25): BACKDROP_STYLE, MoreArrow(), NavArrow(), Props, SLIDE, Walkthrough(), XIcon(), decodedFrames (+17 more)

### Community 158 - "createPondRoom"
Cohesion: 0.30
Nodes (14): pathX(), createPondRoom(), approach(), busy(), finishWalk(), goTo(), leave(), move() (+6 more)

### Community 159 - "useSoundEffects.ts"
Cohesion: 0.12
Nodes (26): BackgroundMusic, clampVolume(), isDocumentHidden(), Options, useBackgroundMusic(), VISIBILITY_EVENTS, EFFECTS, EffectSpec (+18 more)

### Community 160 - "BountyPanel.tsx"
Cohesion: 0.24
Nodes (16): refreshWalletNow(), PondBounties, formatCountdown(), formatInteger(), nextUtcMidnight(), utcDayLabel(), setPondState(), useCountdown() (+8 more)

### Community 161 - "LandingFx"
Cohesion: 0.17
Nodes (12): between(), CAT, Edge, EDGES, runLandingCat(), choosePeeker(), peek(), glowSprite() (+4 more)

### Community 162 - "import-hall-assets.mjs"
Cohesion: 0.13
Nodes (11): BASEBOARD, CURTAIN, drop, EXPECTED, manifest, manifestPath, masters, root (+3 more)

### Community 163 - "painting-open"
Cohesion: 0.50
Nodes (4): file, kilobytes, seconds, painting-open

### Community 164 - "npc-sheet.cjs"
Cohesion: 0.27
Nodes (8): CFG, closeEye(), eraseMouth(), inpaint(), sample(), sharp, [src, out, cfgPath], warp()

### Community 165 - "Multiplayer ("other visitors") — plan v2 (Cloudflare)"
Cohesion: 0.11
Nodes (18): ScreenChrome(), 0. Summary, 10. Decisions, 1. Product contract changes (approved 2026-10-31), 2. What already exists that this builds on, 4. Transport: Cloudflare Durable Objects, 5.1 Emotes (v1), 5. Protocol (`packages/core/src/presence/protocol.ts`) (+10 more)

### Community 168 - "darknessAt"
Cohesion: 0.19
Nodes (7): CozyBackdrop, CEILING, darknessAt(), pool(), RoomLight, smooth(), dirty

### Community 169 - "icon-basket"
Cohesion: 0.67
Nodes (3): icon-basket, file, vector

### Community 170 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, db:schema, deploy:backend, dev, dev:presence, dev:web, dev:worker (+6 more)

### Community 171 - "visits.ts"
Cohesion: 0.15
Nodes (22): state(), PER_VISITOR, POST(), flush(), visibleMs(), VisitState, count(), currentSalts() (+14 more)

### Community 172 - "Medium"
Cohesion: 0.22
Nodes (9): onClick(), 10. Long names run off the name sign, 11. The rooms API skips the stale-tab member check, 12. The bunny is dragged along while you pan in Decorate, 6. Failed saves are nearly invisible, and nothing retries, 7. Two tabs editing the same room overwrite each other, 8. The drawer's card row can't be scrolled on touch screens, 9. Decorating can't be done with the keyboard (+1 more)

### Community 174 - "Local end-to-end stress test — 2026-11-06"
Cohesion: 0.22
Nodes (7): Environment and coverage, Follow-up coverage, Issue index, Local end-to-end stress test — 2026-11-06, Measured load, Passing checks and interpretation limits, Test data and cleanup

### Community 176 - "writeLocal"
Cohesion: 0.19
Nodes (14): openAccount(), undoAdminUnlock(), unlockEverything(), SoundToggle(), AdminTools(), restartInCloset(), turnOff(), turnOn() (+6 more)

### Community 177 - "ticket.ts"
Cohesion: 0.22
Nodes (13): isHome(), decoder, encoder, fromBase64Url(), HmacKey, isOwn(), isTicket(), keyFor() (+5 more)

### Community 179 - "createPlacementLayer"
Cohesion: 0.31
Nodes (8): aspectOf(), createPlacementLayer(), drawOutline(), dropGhosts(), dropHelper(), extrasFor(), silhouette(), sizeOf()

### Community 180 - "createCozyBackdrop"
Cohesion: 0.23
Nodes (13): alphaCanvas(), ceilingGeometry(), createCozyBackdrop(), clearGlows(), glow(), paintShade(), placeGlows(), placeSides() (+5 more)

### Community 182 - "schedule.test.ts"
Cohesion: 0.08
Nodes (20): RESIDENT_IDS, JOBS, NpcGround, PlaceKind, ROOM_KINDS, ROOMS, PlaceInput, NpcRoom (+12 more)

### Community 183 - "Storyline (draft, saved 2026-11-17)"
Cohesion: 0.15
Nodes (12): Arc (soft, no fail state), Built so far, How it ties to what exists, Locked (2026-11-21, the owner), Next tasks (when picked up), Open questions, Premise, Revision (2026-11-21, the owner) (+4 more)

### Community 184 - "HallArranger.tsx"
Cohesion: 0.23
Nodes (9): loadHallArranger(), HallArranger(), HallArrangerProps, HallRoomData, Painting, currentHallOrder(), hallPlacements(), paintingOrder() (+1 more)

### Community 185 - "bake-pond-path.mjs"
Cohesion: 0.21
Nodes (7): blank(), manifest, manifestPath, ORIGINAL_SOURCE, originalPath(), root, softened()

### Community 186 - "Low"
Cohesion: 0.25
Nodes (8): 13. Pages that redirect or don't exist answer 200, 14. Error codes reveal which room slugs exist, 15. The name sign slides under the top-right buttons in Decorate, 16. Level-up celebrations can be farmed, 17. No hint of where things are after panning away, 18. Too many items is only discovered by the server, 19. Development-only: page payloads include the full room row, Low

### Community 187 - "Open rooms and the tip jar (design, 2026-11-21)"
Cohesion: 0.20
Nodes (9): cozyLevel, cozyWorth(), Built (2026-11-21), Decisions, How it works, Numbers (first pass, to tune), Open questions, Open rooms and the tip jar (design, 2026-11-21) (+1 more)

### Community 189 - "Personal room: stress-test issues"
Cohesion: 0.18
Nodes (11): 1. Items placed against a zone edge fail to save, and the whole draft reverts, 2. One owned item can be placed many times, 3. Any save rejection throws away all unsaved work, 4. Changes made just before leaving are lost, 5. Fish trophies can be claimed without playing, Checked and fine, High, Not covered by this pass (+3 more)

### Community 190 - "walk"
Cohesion: 0.18
Nodes (12): walk(), 1. What is in this bundle, 3. The rig, 4. Suggested plan, 5. Blender-side work still to do (needs Blender; the author has it with an MCP bridge), 6. Open questions for the author, Handoff: move the Tiny Museum bunny from sprite frames to a rig, Approved v4 bunny in the hall (+4 more)

### Community 191 - "confirm/page.tsx"
Cohesion: 0.33
Nodes (7): ConfirmFollow(), dynamic, dynamic, Unsubscribe(), FollowNotice(), confirmFollow(), unsubscribe()

### Community 192 - "perf.ts"
Cohesion: 0.22
Nodes (4): createPerfMeter(), isEnabled(), PerfMeter, PerfSnapshot

### Community 193 - "Monets Lily Pond: exploration, UX and multiplayer QA"
Cohesion: 0.29
Nodes (6): Browser and interaction coverage, Changes made from the walkthrough, Monets Lily Pond: exploration, UX and multiplayer QA, Multiplayer and load, Practical limits, Regression checks and cleanup

### Community 194 - "createWasm"
Cohesion: 0.22
Nodes (10): addOnInit(), addRunDependency(), createWasm(), receiveInstance(), receiveInstantiationResult(), findWasmBinary(), getWasmImports(), locateFile() (+2 more)

### Community 195 - "earn"
Cohesion: 0.31
Nodes (10): earn(), emit(), emitEarned(), maybeInvite(), writeSession(), tap(), enterAtelier(), tap() (+2 more)

### Community 196 - "rooms.ts"
Cohesion: 0.05
Nodes (68): GhostOptions, PlacementTheme, placePaintingAction(), returnTo(), Catalogue, Data model (core), The closet: where every room starts (2026-11-17), Design for Phases 5–7 (2026-11-05) (+60 more)

### Community 197 - "Your Room: a room you can freely furnish"
Cohesion: 0.20
Nodes (9): Admin mode (gamma), Decisions (2026-11-17, with the user), Editor (web, `features/rooms/decorate/*`, `PersonalRoom.tsx`), Room look (web, `features/rooms/themes/cozy.ts`, `features/rooms/personal/room.ts`), Scale, Testing locally, What other games do (research, 2026-11-17), Work plan (+1 more)

### Community 198 - "ticket/route.ts"
Cohesion: 0.18
Nodes (15): GET(), PER_MEMBER, PUT(), GET(), PER_IP, POST(), presenceUrl(), memberFromRequest() (+7 more)

### Community 199 - "mail.ts"
Cohesion: 0.27
Nodes (5): BRAND, ConsoleMailer, FileMailer, Mailer, Message

### Community 200 - "Item"
Cohesion: 0.15
Nodes (3): Room, Presence, Item

### Community 201 - "messages.ts"
Cohesion: 0.36
Nodes (6): checkMessage(), INVISIBLE, MESSAGE_MAX, MessageCheck, normalizeMessage(), hasProfanity()

### Community 204 - "xdog.ts"
Cohesion: 0.39
Nodes (5): blur(), kernel(), XDOG_DEFAULTS, xdogInk(), XdogOptions

### Community 205 - "nearby.ts"
Cohesion: 0.18
Nodes (5): Nearby, NearbyReach, RoomSpan, reach, strip

### Community 206 - "postRun"
Cohesion: 0.29
Nodes (7): addOnPostRun(), addOnPreRun(), initRuntime(), postRun(), preRun(), run(), doRun()

### Community 207 - "ref_node_assert"
Cohesion: 0.05
Nodes (43): confirmClean(), kiki, otter, Door, doorOf(), wallpaperOf(), valid, buy() (+35 more)

### Community 208 - "HomeSignIn.tsx"
Cohesion: 0.38
Nodes (5): dynamic, HomePage(), COPY, HomeSignIn(), RoomNoticeProps

### Community 209 - "AtelierKeeps"
Cohesion: 0.57
Nodes (7): buy(), AtelierKeeps(), flash(), keep(), onKey(), press(), release()

### Community 210 - "MuseumStage.tsx"
Cohesion: 0.12
Nodes (12): EXITS, isDoor(), linkedDoor(), LINKS, ActiveRoom, RoomOptions, StageContext, StageContextValue (+4 more)

### Community 211 - "Other visitors"
Cohesion: 0.29
Nodes (6): How it plays, Other visitors, Privacy, Running it in production, Running it locally, Staying consistent

### Community 213 - "instantiateArrayBuffer"
Cohesion: 0.40
Nodes (5): abort(), getBinaryPromise(), getBinarySync(), instantiateArrayBuffer(), instantiateAsync()

### Community 214 - "reveal.ts"
Cohesion: 0.17
Nodes (9): PlaceInfo, InkMap, planGame(), ROUND_SPREAD, createReveal(), compose(), PENCIL, SketchReveal (+1 more)

### Community 216 - "PresencePreview.tsx"
Cohesion: 0.70
Nodes (3): PresencePreviewPage(), PresencePreview(), useVisitorName()

### Community 217 - "presence/src/index.ts"
Cohesion: 0.67
Nodes (3): fetch(), Env, parseRoom()

### Community 218 - "craftInvokerFunction"
Cohesion: 0.67
Nodes (4): craftInvokerFunction(), createJsInvoker(), newFunc(), usesDestructorStack()

### Community 221 - "RegisteredPointer_fromWireType"
Cohesion: 0.50
Nodes (3): destructor(), getPointee(), RegisteredPointer_fromWireType()

### Community 223 - "createDecorController"
Cohesion: 0.67
Nodes (4): createDecorController(), canvasRect(), targetRise(), toScreen()

### Community 224 - "mutation-guard.ts"
Cohesion: 0.67
Nodes (3): allowedOrigin(), isSameOriginMutation(), LOOPBACK

## Knowledge Gaps
- **5 isolated node(s):** `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1652 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **33 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `revealFloorTransition`, `actions.ts`, `SketchGuess.tsx`, `builtUrl`, `round.ts`, `app/layout.tsx`, `bug-reports.ts`, `Museum.tsx`, `VitalsReporter.tsx`, `features/economy/index.ts`, `room-events.ts`, `tables.ts`, `PondTicker.tsx`, `pond-api.ts`, `Walkthrough.tsx`, `Web Package Dependencies`, `useSoundEffects.ts`, `BountyPanel.tsx`, `LandingFx`, `risk.ts`, `DecorDrawer.tsx`, `AccountSheet.tsx`, `a/[slug]/page.tsx`, `writeLocal`, `Water.tsx`, `HallArranger.tsx`, `pond-format.ts`, `lib/slots/index.ts`, `domain/guestboard.ts`, `PondRoom.tsx`, `HomeSignIn.tsx`, `MuseumStage.tsx`, `PresencePreview.tsx`, `usePondState`, `ClosetView.tsx`, `members.ts`, `wardrobe.ts`, `FishingView.tsx`, `PersonalRoom.tsx`, `pondgame/lib/api.ts`, `rig.ts`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **What connects `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json` to the rest of the system?**
  _5 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `SketchGuess.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08484848484848485 - nodes in this community are weakly interconnected._
- **Why does `three` connect `remote-visitors.ts` to `perf.ts`, `stage.ts`, `scene/ambience.ts`, `scene/assets.ts`, `wardrobe.ts`, `npc-layer.ts`, `hang-tag.ts`, `scene.ts`, `room-places.ts`, `pond/art.ts`, `cozy.ts`, `prepare-models.mjs`, `ClosetView.tsx`, `rig.ts`, `ambience.ts`, `Web Package Dependencies`, `pond/room.ts`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Should `DecorController` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Why does `context()` connect `wander.test.ts` to `basis_transcoder.js`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **Should `builtUrl` be split into smaller, more focused modules?**
  _Cohesion score 0.1066066066066066 - nodes in this community are weakly interconnected._