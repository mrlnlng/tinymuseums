# Graph Report - tiny-museum  (2026-11-08)

## Corpus Check
- 486 files · ~254,060 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 78 file(s) not represented in the graph (top: .avif 39, .glb 30, .css 4)

## Summary
- 4164 nodes · 10852 edges · 205 communities (174 shown, 31 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 189 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6ecbdbff`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- actions.ts
- currentArtist
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
- domain/pond.ts
- join-room.ts
- createAtelierRoom
- ref_node_assert
- amplify/package.json
- atelier.ts
- prepare-models.mjs
- Traversal
- core/package.json
- logic.ts
- character.ts
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
- domain/guestboard.ts
- LeaderboardPanel.tsx
- wire.ts
- Base TSConfig
- Amplify Build Spec
- confirm/page.tsx
- db-tests/pond.test.ts
- FakeServer
- handlers.ts
- Water.tsx
- Worker Package Manifest
- Public Asset Manifest
- pond-api.ts
- hitForVisitor
- compose-atelier.mjs
- overlay.ts
- pond-format.ts
- react
- economy/store.ts
- domain/sketch.ts
- room.ts
- minimap.ts
- .webSocketMessage
- Handoff: move the Tiny Museum bunny from sprite frames to a rig
- Sound Effect Assets
- db.ts
- Custom HTTP Headers
- Sharp Layer Package
- Wardrobe
- Other visitors
- gallery/page.tsx
- wallet/body.ts
- currentMember
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
- run.ts
- pond/room.ts
- ticket/route.ts
- Run-Once Schema
- createStage
- FishingView.tsx
- ticket.ts
- AssetImage
- AtelierKeeps.tsx
- Conn
- Placement
- pondgame/lib/api.ts
- worker/tsconfig.json
- core/tsconfig.json
- Tiny Museum
- How to Design for Failures — ByteByteGo Newsletter
- Worker instructions — DSH headless agents
- Backend
- protocol.ts
- Costume gallery doorway
- BountyPanel.tsx
- Fishing forest: painted asset pass
- audio/README.md
- .claude/CLAUDE.md
- reveal.ts
- PondPanels.tsx
- rig.ts
- Curating the paintings (2026-11-07)
- nearby.ts
- presence/tsconfig.json
- graftCostume
- tsconfig.test.json
- app/layout.tsx
- messages.ts
- lib/presence.ts
- audience.ts
- Confirmed issues
- stage.ts
- hall/room.ts
- epoch.ts
- depth.test.ts
- sketchguess/lib/api.ts
- visits.ts
- vitals.ts
- The Moonlit Pond — design
- Pond rework
- collage.ts
- Orchestration contract — you plan, DSH workers execute
- tables.ts
- The Costume Atelier
- personal/room.ts
- pond-state.ts
- ticket/route.ts
- AssetImage
- Context
- hit.ts
- CharacterKind
- Walkthrough.tsx
- createPondRoom
- db-tests/pond.test.ts
- VitalsReporter.tsx
- Placement
- backend.ts
- painting-open
- lib/presence.ts
- Multiplayer ("other visitors") — plan v2 (Cloudflare)
- SoundProvider.tsx
- useSound
- Lobby
- icon-basket
- outbox.test.ts
- createRemoteVisitors
- formatInteger
- bunny-left
- AccountSheet
- bunny-right
- import-fishing-assets.mjs
- lib/slots/index.ts
- icon-home
- AssetImage
- wardrobe.ts
- ticket
- vitals.ts
- CrowdPreview.tsx
- createRoomPassage
- PinnedNotes.tsx
- 4. Transport: Cloudflare Durable Objects
- getStorage
- Cafe
- DecorDrawer
- Building it
- SoundProvider.tsx
- Medium
- focus.ts
- Low
- Personal room: stress-test issues
- Local end-to-end stress test — 2026-11-06
- ArtCache
- PerfMeter
- Minimap
- presence/src/index.ts
- Notes
- createDecorController
- boundedCameraX
- EventTargetLike

## God Nodes (most connected - your core abstractions)
1. `react` - 74 edges
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

## Communities (205 total, 31 thin omitted)

### Community 0 - "actions.ts"
Cohesion: 0.07
Nodes (56): config, SECURITY_HEADERS, BugReportsPage(), dateFormat, dynamic, summary(), dateFormat, dynamic (+48 more)

### Community 1 - "currentArtist"
Cohesion: 0.15
Nodes (19): roomEditor, GET(), PaintingRow, PER_EDITOR, PUT(), versionOf(), GET(), dynamic (+11 more)

### Community 2 - "SketchGuess.tsx"
Cohesion: 0.11
Nodes (33): bestKeyFor(), BURST, clueUrl(), openingPlan(), Phase, pickAtRandom(), prepareSketchGame(), readDifficulty() (+25 more)

### Community 3 - "rooms.ts"
Cohesion: 0.05
Nodes (65): PlacementTheme, publishLocationAction(), 1. Items placed against a zone edge fail to save, and the whole draft reverts, 2. One owned item can be placed many times, 3. Any save rejection throws away all unsaved work, 4. Changes made just before leaving are lost, 5. Fish trophies can be claimed without playing, High (+57 more)

### Community 4 - "jobs.ts"
Cohesion: 0.13
Nodes (28): publishAction(), loop(), sleep(), sweepStale(), DrainResult, handler(), repairFrames(), deletePiece() (+20 more)

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
Cohesion: 0.07
Nodes (53): DENSITY_MEDIA, HallPreload(), AssetManifest, assetUrl(), bitmapTexture(), blankImage(), CAFE_CAT_FRAMES, CompressedLoader (+45 more)

### Community 9 - "SyncStore"
Cohesion: 0.16
Nodes (3): deepEq(), SyncStore, upgrade()

### Community 10 - "machine.ts"
Cohesion: 0.12
Nodes (32): ReelMeter(), armCast(), BITE_WINDOW, biteGap(), CHARGE_PERIOD, chargePower(), createReelState(), FLIGHT_SECONDS (+24 more)

### Community 11 - "PondRoom.tsx"
Cohesion: 0.19
Nodes (12): Loading(), metadata, PondPage(), POND_NAME, PondLoading(), PondOverlayKind, PondFishing(), PondGame (+4 more)

### Community 12 - "Test Fakes and Helpers"
Cohesion: 0.11
Nodes (28): deferredFetch(), deviceSlot, FakeEvents, FakeStorage, fixture, fixtureB, fixtureRegistry, fixtureRegistryBoth (+20 more)

### Community 13 - "scene.ts"
Cohesion: 0.06
Nodes (17): disposeDisplayTexture(), loadDisplayTexture(), prefersAvif(), HiddenCoin, createNotes(), createPedestal(), Pedestal, PedestalVoice (+9 more)

### Community 14 - "cozy.ts"
Cohesion: 0.11
Nodes (27): aspectOf(), ATELIER_PROPS, AtelierImage, canvasTexture(), CozyBackdrop, cozyPropImageUrl(), cozyTheme, createPlacementLayer() (+19 more)

### Community 15 - "domain/pond.ts"
Cohesion: 0.09
Nodes (40): addBait(), baitOf(), bountyCatches(), BountyCatchRow, bountyViews(), chainPondBait(), claimPondBounty(), exchangePearls() (+32 more)

### Community 16 - "join-room.ts"
Cohesion: 0.10
Nodes (31): ChatButton(), REFUSED, joinRoom(), STANDING, emit(), getPeople(), isInRoom(), isMuted() (+23 more)

### Community 17 - "createAtelierRoom"
Cohesion: 0.18
Nodes (23): aspectOf(), AtelierActions, createAtelierRoom(), buildCollection(), form(), buildEntrance(), buildRoom(), picture() (+15 more)

### Community 18 - "ref_node_assert"
Cohesion: 0.11
Nodes (28): defineSlot(), docBytes(), SLOTS, byAtThenKey(), encoded(), latest, mapOf(), maxNumber() (+20 more)

### Community 19 - "amplify/package.json"
Cohesion: 0.17
Nodes (14): devDependencies, @aws-amplify/backend@^1.14.0, @aws-amplify/backend-cli@^1.6.0, aws-cdk-lib@^2.180.0, constructs@^10.3.0, name, private, scripts (+6 more)

### Community 20 - "atelier.ts"
Cohesion: 0.05
Nodes (42): Assets, AtelierArt, AtelierImage, BuiltRoom, Cardigan, CARDIGAN_NAMES, Control, disposeAtelierArt() (+34 more)

### Community 21 - "prepare-models.mjs"
Cohesion: 0.15
Nodes (18): paintedCostume(), atelier, bunny, floralOutfits(), goldOutfits(), HEADPIECES, image(), manifest (+10 more)

### Community 22 - "Traversal"
Cohesion: 0.10
Nodes (5): clamp(), fixture(), jump(), Traversal, Stress-test fixes (2026-11-06)

### Community 23 - "core/package.json"
Cohesion: 0.06
Nodes (39): dependencies, @aws-sdk/client-s3@^3.1121.0, @aws-sdk/s3-request-presigner@^3.1121.0, bcryptjs@^2.4.3, obscenity@^0.4.6, sharp@^0.33.5, thumbhash@^0.1.1, devDependencies (+31 more)

### Community 24 - "logic.ts"
Cohesion: 0.14
Nodes (21): SharingState, Tab, TABS, categoryOf(), cozyLevel, cozyWorth(), currentHallOrder(), DrawerCategory (+13 more)

### Community 25 - "character.ts"
Cohesion: 0.12
Nodes (24): RigPreviewPage(), NEXT, PROPS, RigPreview(), draw(), createCharacter(), contextLost(), loadKind() (+16 more)

### Community 27 - "Museum.tsx"
Cohesion: 0.13
Nodes (25): Loading(), PinnedNotes(), AtelierLoading(), CoinFound, ColorRecall, GameDesktop, GuestBoard, HallArranger (+17 more)

### Community 28 - "PersonalRoom.tsx"
Cohesion: 0.12
Nodes (26): Carry, errorReason(), overDrawer(), PersonalRoom(), canPlaceNew(), carryEnd(), carryMove(), onCardKey() (+18 more)

### Community 29 - "core/src/index.ts"
Cohesion: 0.06
Nodes (57): castPond(), PondStateView, BOUNTY_POOL, bountySeed(), BountyTemplate, inverseNormal(), isPondFish(), isPondTier() (+49 more)

### Community 30 - "Web Package Dependencies"
Cohesion: 0.07
Nodes (33): dependencies, embla-carousel-react@^8.6.0, motion@^13.1.1, next@^15.0.3, react@^19.0.0, react-dom@^19.0.0, swr@^2.5.1, three@^0.169.0 (+25 more)

### Community 31 - "Gamifying Tiny Museum — genre direction & engagement research"
Cohesion: 0.10
Nodes (19): 0.1 The core experience, 0.2 Systems that make gamification cheap to build, 0.3 Constraints that shape any recommendation, 0. What the game is today (the deep dive), 1.1 The landscape (seven candidates, with verdicts), 1.2 Recommendation: a **cozy gallery life-sim** — "the gallery you live in", 1.3 The five design pillars the genre implies, 1. Genre direction (+11 more)

### Community 32 - "pond/art.ts"
Cohesion: 0.24
Nodes (12): ArtByRoom, colorAt(), disposePondArt(), EDGE_BAND, EDGE_BANDS, EDGE_OVERLAP, edgeTexture(), imageOf() (+4 more)

### Community 33 - "slots/store.ts"
Cohesion: 0.18
Nodes (19): ANON_PREFIX, anonKey(), deviceKey(), encodeStored(), isMemberSlotKey(), listKeys(), MEMBER_KEY, memberKey() (+11 more)

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
Cohesion: 0.15
Nodes (30): buyPondBait(), getPondBounties(), PondBaitResult, applyClaim(), baitCounts(), baitOf(), buy(), BuyResult (+22 more)

### Community 38 - "rules.ts"
Cohesion: 0.15
Nodes (18): localDay(), at(), EXCHANGE_DAILY_STAMPS, EXCHANGE_PEARLS_PER_STAMP, exchangeClaimKey(), GAME_DAILY_CAP, GameId, GAMES (+10 more)

### Community 39 - "Web TSConfig"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 40 - "Root Package Manifest"
Cohesion: 0.07
Nodes (35): description, devDependencies, concurrently@^9.1.0, esbuild@^0.24.0, ktx2-encoder@^0.6.0, maxrects-packer@^2.7.3, playwright@^1.63.0, @types/node@^22.9.0 (+27 more)

### Community 41 - "domain/guestboard.ts"
Cohesion: 0.09
Nodes (34): POST(), GET(), POST(), rateLimitedResponse(), rejectedResponse(), BugContext, BugReport, BugReportDto (+26 more)

### Community 42 - "LeaderboardPanel.tsx"
Cohesion: 0.14
Nodes (24): fetchPondFeed(), PondBoardId, PondBoardPeriod, PondBoardRow, PondFeedItem, PondLeaderboard, catchLabel(), formatOdds() (+16 more)

### Community 43 - "wire.ts"
Cohesion: 0.14
Nodes (7): INTERPOLATION_DELAY_MS, PEER_TIMEOUT_MS, PeerTable, positionAt(), Sample, look, Peer

### Community 44 - "Base TSConfig"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, lib, module, moduleResolution (+9 more)

### Community 45 - "Amplify Build Spec"
Cohesion: 0.12
Nodes (16): applications, appRoot, backend, frontend, baseDirectory, files, phases, commands (+8 more)

### Community 46 - "confirm/page.tsx"
Cohesion: 0.33
Nodes (7): ConfirmFollow(), dynamic, dynamic, Unsubscribe(), FollowNotice(), confirmFollow(), unsubscribe()

### Community 47 - "db-tests/pond.test.ts"
Cohesion: 0.12
Nodes (27): compare(), DexRow, displayName(), FeedRow, getPondFeed(), getPondLeaderboard(), NameRow, PondBoardId (+19 more)

### Community 48 - "FakeServer"
Cohesion: 0.18
Nodes (3): FakeServer, SlotState, SlotDef

### Community 49 - "handlers.ts"
Cohesion: 0.10
Nodes (31): confirmedFollowers(), sealEpoch(), handleDerivatives(), handleNotifyFollowers(), handleRenderDisplay(), handleSealEpoch(), renderPieceFrame(), renderPieceSketch() (+23 more)

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
Cohesion: 0.26
Nodes (18): buyPondBait(), claimPondBounty(), errorOf(), exchangePondPearls(), fetchPondBounties(), fetchPondDex(), fetchPondLeaderboard(), fetchPondState() (+10 more)

### Community 54 - "hitForVisitor"
Cohesion: 0.14
Nodes (23): GLOBAL, PER_IP, POST(), GLOBAL, PER_IP, POST(), POST(), GET() (+15 more)

### Community 55 - "compose-atelier.mjs"
Cohesion: 0.14
Nodes (9): body, dressLayer, dressWidth, floralWidth, MANNEQUIN_CANVAS, mask, root, sourceSize (+1 more)

### Community 56 - "overlay.ts"
Cohesion: 0.06
Nodes (33): Scenery, Backdrop, CUTS, Mark, ROPE_CUTS, CafeMarks, Carried, CarriedState (+25 more)

### Community 57 - "pond-format.ts"
Cohesion: 0.13
Nodes (26): PondDex, EXCHANGE_DAILY_STAMPS, EXCHANGE_PEARLS_PER_STAMP, FISH_ART, fishArt(), formatPercent(), formatShortSizeCm(), ODDS_BAIT (+18 more)

### Community 58 - "react"
Cohesion: 0.13
Nodes (19): openAccount(), openBugReport(), fitWidth(), HelpGuide(), HelpGuideProps, POINTER_STEPS, TOUCH_STEPS, loadGameDesktop() (+11 more)

### Community 59 - "economy/store.ts"
Cohesion: 0.09
Nodes (51): CARRY_CAP, carryAdd(), CarryEntry, carryPrune(), carryRemove(), chunk(), tzOffsetNow(), outboxDue() (+43 more)

### Community 60 - "domain/sketch.ts"
Cohesion: 0.09
Nodes (32): listPieces(), pieceImageUrl(), PieceRow, toPieceDto(), EpochRow, GalleryRow, planSketchRound(), SKETCH_CHOICES (+24 more)

### Community 61 - "room.ts"
Cohesion: 0.15
Nodes (27): admitted(), Attachment, farewell(), GHOST_MS, HELLO_TIMEOUT_MS, holdsOf(), MAX_WAITING_PER_IP, newAttachment() (+19 more)

### Community 62 - "minimap.ts"
Cohesion: 0.06
Nodes (40): place(), EXITS, LINKS, ATELIER_DOOR, createMinimap(), draw(), drawRoom(), floors() (+32 more)

### Community 63 - ".webSocketMessage"
Cohesion: 0.44
Nodes (3): attachmentOf(), Room, sendTo()

### Community 64 - "Handoff: move the Tiny Museum bunny from sprite frames to a rig"
Cohesion: 0.12
Nodes (15): BunnyArtist(), BunnyMood, Pencil(), POSES, 1. What is in this bundle, 3. The rig, 4. Suggested plan, 5. Blender-side work still to do (needs Blender; the author has it with an MCP bridge) (+7 more)

### Community 65 - "Sound Effect Assets"
Cohesion: 0.22
Nodes (9): file, kilobytes, seconds, file, kilobytes, seconds, soundEffects, click (+1 more)

### Community 66 - "db.ts"
Cohesion: 0.08
Nodes (29): shutdown(), artist(), member(), piece(), randomId(), grantPearls(), member(), now (+21 more)

### Community 67 - "Custom HTTP Headers"
Cohesion: 0.25
Nodes (7): applications, appRoot, customHeaders, headers, pattern, key, value

### Community 68 - "Sharp Layer Package"
Cohesion: 0.33
Nodes (6): dependencies, sharp@^0.33.5, description, sharp, name, private

### Community 70 - "Other visitors"
Cohesion: 0.29
Nodes (6): How it plays, Other visitors, Privacy, Running it in production, Running it locally, Staying consistent

### Community 71 - "gallery/page.tsx"
Cohesion: 0.11
Nodes (32): AnalyticsPage(), dynamic, dynamic, GalleryPage(), createCodeAction(), deleteCodeAction(), deletePieceAction(), hangAction() (+24 more)

### Community 72 - "wallet/body.ts"
Cohesion: 0.16
Nodes (17): PER_MEMBER, POST(), baitIdOf(), integerOffset(), isRecord(), itemIdOf(), MAX_CLAIM_BATCH, MAX_WALLET_BODY_BYTES (+9 more)

### Community 73 - "currentMember"
Cohesion: 0.16
Nodes (19): GET(), GET(), PER_MEMBER, BOARDS, GET(), oneOf(), PER_VISITOR, PERIODS (+11 more)

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
Nodes (11): FloorPoint, WalkArea, water, depthAtLift(), DEPTH_SPAN, depthOf(), PICTURE, pondFloor() (+3 more)

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
Cohesion: 0.12
Nodes (43): POST(), POST(), POST(), PER_MEMBER, PUT(), PER_MEMBER, POST(), catchIdOf() (+35 more)

### Community 94 - "run.ts"
Cohesion: 0.20
Nodes (7): admin, childEnv, client, database, fresh, migrations, target

### Community 95 - "pond/room.ts"
Cohesion: 0.11
Nodes (17): PondPath, FOREST_GATE, POND_LANDMARKS, PondLandmark, FLOOR, MOVE_KEYS, PlaneOptions, POND_ITEMS (+9 more)

### Community 96 - "ticket/route.ts"
Cohesion: 0.10
Nodes (41): Code, 3.2 Chosen names (members), registry, started(), AuthedArtist, hashPassword(), newToken(), verifyPassword() (+33 more)

### Community 104 - "createStage"
Cohesion: 0.16
Nodes (24): revealFloorTransition(), isDoor(), linkedDoor(), createNearby(), createStage(), closeEntry(), enter(), initialize() (+16 more)

### Community 105 - "FishingView.tsx"
Cohesion: 0.13
Nodes (14): CONFETTI_COLORS, ConfettiPiece, makeConfetti(), RevealCard(), TIER_MS, TIER_SFX, useCountUp(), chainOffer (+6 more)

### Community 106 - "ticket.ts"
Cohesion: 0.18
Nodes (15): decoder, encoder, fromBase64Url(), HmacKey, isOwn(), isTicket(), keyFor(), keys (+7 more)

### Community 107 - "AssetImage"
Cohesion: 0.18
Nodes (14): Loading(), dynamic, Hall(), MuseumPage(), CurrentlyShowing(), dynamic, GUIDELINES, LandingPage() (+6 more)

### Community 108 - "AtelierKeeps.tsx"
Cohesion: 0.09
Nodes (33): MuseumLayout(), CoinToast(), Toast, Purse(), Stamp(), WalletProvider(), serverSnapshot, useEarnEvents() (+25 more)

### Community 109 - "Conn"
Cohesion: 0.35
Nodes (3): connectWebSocket(), SocketHandlers, Conn

### Community 111 - "pondgame/lib/api.ts"
Cohesion: 0.17
Nodes (25): CAST_ERRORS, FishingView(), isTyping(), LOST, Toast, vibrate(), PondGame(), buyPondBait() (+17 more)

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
Cohesion: 0.31
Nodes (13): isItem(), isName(), isPid(), isSeq(), MAX_HOLDS, MAX_MESSAGE_BYTES, parseClientMessage(), parseLook() (+5 more)

### Community 119 - "Costume gallery doorway"
Cohesion: 0.50
Nodes (3): Costume gallery doorway, Curtain colour edit, Prompt

### Community 120 - "BountyPanel.tsx"
Cohesion: 0.18
Nodes (14): BaitTray(), BAIT, GLYPHS, PearlIcon(), POND_CRIMSON, PondIconName, PondBounties, formatCountdown() (+6 more)

### Community 121 - "Fishing forest: painted asset pass"
Cohesion: 0.11
Nodes (17): Assets, Bruce's collection refresh (2026-11-08), Fishing forest illustrations, Made by hand (not touched by the script), Monets Lily Pond (2026-11-08), 1. Forest doorway, 2. Woodland noticeboard, 3. Fisherman and bait basket (+9 more)

### Community 124 - "reveal.ts"
Cohesion: 0.17
Nodes (9): PlaceInfo, InkMap, planGame(), ROUND_SPREAD, createReveal(), compose(), PENCIL, SketchReveal (+1 more)

### Community 125 - "PondPanels.tsx"
Cohesion: 0.17
Nodes (12): getPondStateSnapshot(), usePondState(), PondHud(), PondHudProps, BOARD_TABS, PondPanels(), signIn(), PondPanelsProps (+4 more)

### Community 126 - "rig.ts"
Cohesion: 0.13
Nodes (24): Layer, setCostumeVisibility(), canvasToModel(), disposeRigLayer(), Frame, layerTemplates, loadRig(), dispose() (+16 more)

### Community 127 - "Curating the paintings (2026-11-07)"
Cohesion: 0.22
Nodes (8): Curating the paintings (2026-11-07), Decided, How it is built, Testing, The fashion area's spots, The idea, The model, Where things stand

### Community 128 - "nearby.ts"
Cohesion: 0.18
Nodes (5): Nearby, NearbyReach, RoomSpan, reach, strip

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
Nodes (15): bethEllen, inspiratiq, metadata, notoSans, RootLayout(), sniglet, viewport, AccountHost() (+7 more)

### Community 133 - "messages.ts"
Cohesion: 0.31
Nodes (7): checkMessage(), INVISIBLE, MESSAGE_MAX, MessageCheck, normalizeMessage(), hasProfanity(), matcher

### Community 134 - "lib/presence.ts"
Cohesion: 0.09
Nodes (17): Entry, RemoteVisitor, fetchTicket, Presence, RETRY_MS, sameLook(), samePose(), SAY_GAP_MS (+9 more)

### Community 135 - "audience.ts"
Cohesion: 0.08
Nodes (30): ArtistPage(), dynamic, generateMetadata(), GET(), ALLOWED, POST(), POST(), POST() (+22 more)

### Community 136 - "Confirmed issues"
Cohesion: 0.12
Nodes (17): Confirmed issues, E2E-002 — Valid edge placement rejected through floating-point precision, E2E-003 — One owned prop can be placed multiple times, E2E-004 — Reload before autosave silently loses the latest placement, E2E-005 — Failed save and failed Done have no visible mobile explanation, E2E-006 — Restoring connectivity does not retry a failed draft save, E2E-007 — Keyboard activation cannot place drawer items, E2E-008 — Creating an account from My Room leaves the signed-in user on the sign-in prompt (+9 more)

### Community 137 - "stage.ts"
Cohesion: 0.04
Nodes (39): CharacterSprites, CameraRig, cutRooms(), createPixelRatioGovernor(), PIXEL_RATIO_STEPS, Options, Pose, Room (+31 more)

### Community 138 - "hall/room.ts"
Cohesion: 0.06
Nodes (45): createBackdrop(), disposeBoards(), plane(), ropeSlices(), sliceOf(), stretchedBoard(), createCafe(), ComingSoon (+37 more)

### Community 139 - "epoch.ts"
Cohesion: 0.22
Nodes (15): GET(), intParam(), GET(), sketchPool, unavailable(), currentEpoch(), ensureEpoch(), epochById() (+7 more)

### Community 140 - "depth.test.ts"
Cohesion: 0.30
Nodes (11): FAR_LIFT, FAR_SCALE, liftAt(), pathHalfWidth(), pathX(), scaleAt(), path, pathSprite (+3 more)

### Community 141 - "sketchguess/lib/api.ts"
Cohesion: 0.23
Nodes (13): sameOriginUrl(), PreparedGame, decodeImage(), fetchBitmap(), fetchRound(), guarded(), LoadedRound, loadInk() (+5 more)

### Community 142 - "visits.ts"
Cohesion: 0.17
Nodes (19): state(), flush(), startVisit(), visibleMs(), VisitState, count(), currentSalts(), DEVICES (+11 more)

### Community 143 - "vitals.ts"
Cohesion: 0.27
Nodes (9): dynamic, format(), grade(), METRICS, PAGES, PerformancePage(), RANGES, summarizeVitals() (+1 more)

### Community 144 - "The Moonlit Pond — design"
Cohesion: 0.09
Nodes (22): Art the pond needs from the artist, Build contract (decided 2026-11-07), Build phases, Collection and goals, Done, Done, Guardrails, Leaderboards (+14 more)

### Community 145 - "Pond rework"
Cohesion: 0.18
Nodes (10): Baits, Client, Decisions, Done, Notes, Pond rework, Server, Species (+2 more)

### Community 146 - "collage.ts"
Cohesion: 0.20
Nodes (8): target, SCHEMA_DIR, isProduction(), presenceSecret(), repoRoot, required(), sessionSecret(), setting()

### Community 147 - "Orchestration contract — you plan, DSH workers execute"
Cohesion: 0.29
Nodes (6): Briefing a worker, Budget hygiene, graphify, Orchestration contract — you plan, DSH workers execute, The worker, When not to delegate

### Community 148 - "tables.ts"
Cohesion: 0.09
Nodes (41): FrameShape, BaitTrayProps, PondGameProps, RevealCardProps, PondCatch, CatchView, debugSpecies(), debugVariant() (+33 more)

### Community 149 - "The Costume Atelier"
Cohesion: 0.13
Nodes (14): Adding a character, Adding a costume, Art not supplied as files, Bruce's Chronicles, Checked against the mocks (2026-11-07), Code, Costume fit review, Fitting clothes to other characters (+6 more)

### Community 150 - "personal/room.ts"
Cohesion: 0.07
Nodes (13): ComingSoonNote, FunZoneSign, GiftShopSigns, GuestBoardNotes, LobbySigns, Placards, placeLabel(), toScreen() (+5 more)

### Community 151 - "pond-state.ts"
Cohesion: 0.29
Nodes (12): PondStateView, PondTier, ensurePondStateStarted(), GUEST, listeners, LOADING, PondStateSnapshot, publish() (+4 more)

### Community 152 - "ticket/route.ts"
Cohesion: 0.21
Nodes (12): GET(), PER_MEMBER, PUT(), GET(), PER_IP, POST(), presenceUrl(), memberFromRequest() (+4 more)

### Community 153 - "AssetImage"
Cohesion: 0.13
Nodes (23): BoardScreen(), ComposeScreen(), ComposeScreenProps, blankDraft(), GuestBoard(), GuestBoardProps, View, ReadScreen() (+15 more)

### Community 155 - "hit.ts"
Cohesion: 0.17
Nodes (12): CoinWall, createHiddenCoin(), Spot, AlphaMap, alphaMapFor(), alphaMaps, buildAlphaMap(), isPaintedAt() (+4 more)

### Community 156 - "CharacterKind"
Cohesion: 0.14
Nodes (4): AtelierRoom, Display, CollectionRoom, CharacterKind

### Community 157 - "Walkthrough.tsx"
Cohesion: 0.16
Nodes (18): MoreArrow(), NavArrow(), Props, SLIDE, Walkthrough(), XIcon(), decodedFrames, frameFor() (+10 more)

### Community 158 - "createPondRoom"
Cohesion: 0.31
Nodes (13): createPondRoom(), approach(), busy(), finishWalk(), goTo(), leave(), move(), nearest() (+5 more)

### Community 159 - "db-tests/pond.test.ts"
Cohesion: 0.14
Nodes (13): CatchExtra, clearCatches(), COLUMNS, grantPearls(), insertCatch(), member(), namedMember(), randomId() (+5 more)

### Community 160 - "VitalsReporter.tsx"
Cohesion: 0.31
Nodes (7): firstPainting(), flush(), Metric, queue, REPORTED, FIRST_PAINTING_MARK, MUSEUM_START_MARK

### Community 161 - "Placement"
Cohesion: 0.17
Nodes (9): loadHallArranger(), HallArranger(), HallArrangerProps, HallRoomData, Painting, hallPlacements(), reasonLabel(), PersonalRoomOptions (+1 more)

### Community 162 - "backend.ts"
Cohesion: 0.15
Nodes (12): amplifyDir, backend, everyMinutes, mediaBucket, missing, repoRoot, REQUIRED, setting() (+4 more)

### Community 163 - "painting-open"
Cohesion: 0.50
Nodes (4): file, kilobytes, seconds, painting-open

### Community 164 - "lib/presence.ts"
Cohesion: 0.18
Nodes (9): Connect, HEARTBEAT_MS, HIDDEN_LIMIT_MS, Clock, flush(), look, MemoryRooms, visitor() (+1 more)

### Community 165 - "Multiplayer ("other visitors") — plan v2 (Cloudflare)"
Cohesion: 0.14
Nodes (13): ScreenChrome(), 0. Summary, 10. Decisions, 1. Product contract changes (approved 2026-10-31), 2. What already exists that this builds on, 3.1 Generated names (everyone has one), 3. Names, 5.1 Emotes (v1) (+5 more)

### Community 166 - "SoundProvider.tsx"
Cohesion: 0.21
Nodes (7): StageOptions, RoomSound, SoundContext, SoundState, EffectName, STATIC_BASE, staticUrl()

### Community 167 - "useSound"
Cohesion: 0.32
Nodes (7): ColorRecall(), ColorRecallProps, Phase, readBest(), ColorRound, showMs(), loadColorRecall()

### Community 169 - "icon-basket"
Cohesion: 0.67
Nodes (3): icon-basket, file, vector

### Community 170 - "outbox.test.ts"
Cohesion: 0.29
Nodes (11): ClaimRequest, OUTBOX_CAP, outboxAdd(), OutboxEntry, outboxFail(), outboxRemove(), RETRY_BASE_MS, RETRY_MAX_MS (+3 more)

### Community 171 - "createRemoteVisitors"
Cohesion: 0.21
Nodes (10): createRenderer(), createRigLayer(), createRemoteVisitors(), ensureLayer(), load(), placeOwn(), show(), showProp() (+2 more)

### Community 172 - "formatInteger"
Cohesion: 0.50
Nodes (9): refreshWalletNow(), formatInteger(), setPondState(), claim(), BaitShop(), buy(), Exchange(), exchange() (+1 more)

### Community 174 - "AccountSheet"
Cohesion: 0.29
Nodes (9): AccountSheet(), continueAnyway(), doSignOut(), runDelete(), runName(), submit(), submitDelete(), submitName() (+1 more)

### Community 176 - "import-fishing-assets.mjs"
Cohesion: 0.22
Nodes (7): heights, layout, manifest, manifestPath, root, target, water

### Community 177 - "lib/slots/index.ts"
Cohesion: 0.09
Nodes (20): PresencePreviewPage(), Mode, NAME_ERRORS, Pending, View, KeepOnOtherDevices(), PresencePreview(), WalkAlone() (+12 more)

### Community 179 - "AssetImage"
Cohesion: 0.39
Nodes (6): coin, CoinFound(), CoinFoundProps, AssetImage(), ImgProps, pictureSources

### Community 180 - "wardrobe.ts"
Cohesion: 0.07
Nodes (50): AtelierPage(), dynamic, metadata, allowedCharacter(), OwnedSnapshot, owns(), walletReady(), getWalletSnapshot() (+42 more)

### Community 182 - "vitals.ts"
Cohesion: 0.36
Nodes (6): DEVICES, METRICS, normalizePage(), parseVitalsReport(), RATINGS, VitalRow

### Community 183 - "CrowdPreview.tsx"
Cohesion: 0.33
Nodes (7): CrowdPreviewPage(), CrowdPreview(), draw(), KINDS, Stats, Window, clearRigLayer()

### Community 184 - "createRoomPassage"
Cohesion: 0.60
Nodes (3): coverFloorTransition(), createRoomPassage(), fixture()

### Community 185 - "PinnedNotes.tsx"
Cohesion: 0.33
Nodes (6): BoardScreenProps, PinnedNotesProps, ReadScreenProps, NOTE_PLACES, NotePlace, GuestNoteDto

### Community 186 - "4. Transport: Cloudflare Durable Objects"
Cohesion: 0.25
Nodes (8): 4. Transport: Cloudflare Durable Objects, Decision (2026-10-31), Deploying, Identity cannot be forged, Local development and tests, Rooms and capacity, Shape of `apps/presence` (about 200 lines), main()

### Community 187 - "getStorage"
Cohesion: 0.08
Nodes (20): CONTENT_TYPES, GET(), POST(), UPLOADS_PER_ARTIST, PUT(), ACCEPTED, createAssetFromUpload(), MAX_UPLOAD_BYTES (+12 more)

### Community 190 - "Building it"
Cohesion: 0.33
Nodes (6): 1. The registry and the table, 2. The studio's Location picker, 3. The rooms draw what is placed, 4. Credits, 5. Retiring self-serve artists, Building it

### Community 191 - "SoundProvider.tsx"
Cohesion: 0.12
Nodes (26): BackgroundMusic, clampVolume(), isDocumentHidden(), Options, useBackgroundMusic(), VISIBILITY_EVENTS, EFFECTS, EffectSpec (+18 more)

### Community 192 - "Medium"
Cohesion: 0.25
Nodes (8): 10. Long names run off the name sign, 11. The rooms API skips the stale-tab member check, 12. The bunny is dragged along while you pan in Decorate, 6. Failed saves are nearly invisible, and nothing retries, 7. Two tabs editing the same room overwrite each other, 8. The drawer's card row can't be scrolled on touch screens, 9. Decorating can't be done with the keyboard, Medium

### Community 194 - "Low"
Cohesion: 0.25
Nodes (8): 13. Pages that redirect or don't exist answer 200, 14. Error codes reveal which room slugs exist, 15. The name sign slides under the top-right buttons in Decorate, 16. Level-up celebrations can be farmed, 17. No hint of where things are after panning away, 18. Too many items is only discovered by the server, 19. Development-only: page payloads include the full room row, Low

### Community 195 - "Personal room: stress-test issues"
Cohesion: 0.29
Nodes (5): Checked and fine, Not covered by this pass, Personal room: stress-test issues, Status (2026-11-06), Test data left in the local database

### Community 196 - "Local end-to-end stress test — 2026-11-06"
Cohesion: 0.29
Nodes (7): Environment and coverage, Follow-up coverage, Issue index, Local end-to-end stress test — 2026-11-06, Measured load, Passing checks and interpretation limits, Test data and cleanup

### Community 200 - "presence/src/index.ts"
Cohesion: 0.67
Nodes (3): fetch(), Env, parseRoom()

### Community 202 - "createDecorController"
Cohesion: 0.67
Nodes (4): createDecorController(), canvasRect(), targetRise(), toScreen()

## Knowledge Gaps
- **5 isolated node(s):** `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1293 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **31 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `currentArtist`, `SketchGuess.tsx`, `app/layout.tsx`, `audience.ts`, `PondRoom.tsx`, `Test Fakes and Helpers`, `join-room.ts`, `logic.ts`, `character.ts`, `AssetImage`, `Museum.tsx`, `PersonalRoom.tsx`, `Walkthrough.tsx`, `Web Package Dependencies`, `VitalsReporter.tsx`, `Placement`, `risk.ts`, `SoundProvider.tsx`, `useSound`, `LeaderboardPanel.tsx`, `lib/slots/index.ts`, `Water.tsx`, `AssetImage`, `wardrobe.ts`, `CrowdPreview.tsx`, `pond-format.ts`, `SoundProvider.tsx`, `gallery/page.tsx`, `bug-report.ts`, `FishingView.tsx`, `AssetImage`, `AtelierKeeps.tsx`, `pondgame/lib/api.ts`, `BountyPanel.tsx`, `PondPanels.tsx`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._
- **What connects `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json` to the rest of the system?**
  _5 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `actions.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07075873827791987 - nodes in this community are weakly interconnected._
- **Why does `three` connect `overlay.ts` to `pond/art.ts`, `scene/assets.ts`, `stage.ts`, `hall/room.ts`, `depth.test.ts`, `scene.ts`, `cozy.ts`, `remote-visitors.ts`, `join-room.ts`, `atelier.ts`, `prepare-models.mjs`, `minimap.ts`, `rig.ts`, `hit.ts`, `Web Package Dependencies`, `pond/room.ts`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Should `SketchGuess.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Why does `Traversal` connect `Traversal` to `createStage`, `stage.ts`, `join-room.ts`, `createRoomPassage`, `overlay.ts`, `minimap.ts`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Should `rooms.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._