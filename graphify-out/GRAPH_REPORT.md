# Graph Report - tiny-museum  (2026-11-11)

## Corpus Check
- 496 files · ~272,738 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 82 file(s) not represented in the graph (top: .avif 39, .glb 34, .css 4)

## Summary
- 4345 nodes · 11216 edges · 206 communities (179 shown, 27 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 215 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e05a4120`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- themes.ts
- walk.ts
- SketchGuess.tsx
- rooms.ts
- rules.ts
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
- room-events.ts
- stage.ts
- ref_node_assert
- amplify/package.json
- app/page.tsx
- prepare-models.mjs
- Traversal
- core/package.json
- currentMember
- earn
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
- PondPanels.tsx
- Web TSConfig
- Root Package Manifest
- bug-reports.ts
- PondTicker.tsx
- import-fishing-assets.mjs
- Base TSConfig
- Amplify Build Spec
- features/economy/index.ts
- bug-reports.ts
- FakeServer
- handlers.ts
- Water.tsx
- Worker Package Manifest
- Public Asset Manifest
- wardrobe.ts
- createAtelierRoom
- compose-atelier.mjs
- core/src/index.ts
- pond-format.ts
- react
- economy/store.ts
- backend.ts
- room.ts
- minimap.ts
- validatePlacements
- Handoff: move the Tiny Museum bunny from sprite frames to a rig
- Sound Effect Assets
- ticket/route.ts
- Custom HTTP Headers
- Sharp Layer Package
- atelier/room.ts
- scene/ambience.ts
- wallet/body.ts
- next
- import-landing-assets.mjs
- Visits SQL Schema
- Bunny Walk Sprites
- Room Mockup Settings
- Service Worker Caching
- HallCallbacks
- pond/art.ts
- createPresence
- members
- Frame Window Asset
- outbox.test.ts
- presence/package.json
- Rig
- Asset pipeline: fast loading without losing sharpness
- Guest Board SQL Schema
- Landscape Frame Asset
- epoch.ts
- Bug Reports SQL Schema
- Vitals SQL Schema
- json
- db-tests/pond.test.ts
- pond/room.ts
- ticket/route.ts
- Run-Once Schema
- locations.ts
- FishingView.tsx
- ticket.ts
- lib/assets.ts
- claimPondBounty
- createPlacementLayer
- graftCostume
- pondgame/lib/api.ts
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
- Confirmed issues
- rig.ts
- Curating the paintings (2026-11-07)
- domain/guestboard.ts
- presence/tsconfig.json
- run.ts
- tsconfig.test.json
- app/layout.tsx
- ArrangeControls.tsx
- lib/presence.ts
- Item
- DecorDrawer.tsx
- jobs.ts
- hall/room.ts
- ensureEpoch
- presence.test.ts
- art-cache.ts
- visits.ts
- writeStyle
- The Moonlit Pond — design
- Pond rework
- env.ts
- Orchestration contract — you plan, DSH workers execute
- tables.ts
- remote-visitors.ts
- createHallRoom
- pond-state.ts
- hit.ts
- Other visitors
- FilesystemStorage
- lib/slots/index.ts
- logic.ts
- Walkthrough.tsx
- createPondRoom
- Pedestal
- LandingFx
- frame.ts
- CoinToast.tsx
- painting-open
- tab-turn.ts
- Multiplayer ("other visitors") — plan v2 (Cloudflare)
- editor.ts
- exports
- query
- icon-basket
- nearby.ts
- .webSocketMessage
- BountyPanel.tsx
- bunny-left
- RigPreview.tsx
- bunny-right
- PersonalRoom.tsx
- CrowdPreview.tsx
- icon-home
- AccountSheet
- confirm/page.tsx
- ticket
- createRemoteVisitors
- perf.ts
- setPondState
- shopkeeper.ts
- dependencies
- S3Storage
- Cafe
- TreeSparkles
- memberFromRequest
- useSoundEffects.ts
- Angler.tsx
- Monets Lily Pond: exploration, UX and multiplayer QA
- messages.ts
- HelmShare
- Clock
- pond-api.ts
- ArtCache
- session.ts
- Notes
- Sitting
- Lobby
- profanity.ts
- CompressedLoader
- createStage

## God Nodes (most connected - your core abstractions)
1. `react` - 76 edges
2. `json()` - 69 edges
3. `query()` - 68 edges
4. `hit()` - 55 edges
5. `limited()` - 49 edges
6. `three` - 45 edges
7. `next` - 44 edges
8. `Traversal` - 44 edges
9. `SyncStore` - 41 edges
10. `FishingView()` - 39 edges

## Surprising Connections (you probably didn't know these)
- `Code` --references--> `followOutfit()`  [INFERRED]
  docs/costume-atelier.md → apps/web/src/features/hall/scene/wardrobe.ts
- `5.1 Emotes (v1)` --references--> `ScreenChrome()`  [INFERRED]
  docs/multiplayer-plan.md → apps/web/src/shared/components/ScreenChrome.tsx
- `E2E-009 — Room mutations ignore stale account identity` --references--> `memberFromRequest()`  [INFERRED]
  docs/testing/local-e2e-stress-2026-11-06.md → apps/web/src/shared/lib/member-route.ts
- `Where things stand` --references--> `sealEpoch()`  [INFERRED]
  docs/curation-plan.md → packages/core/src/domain/epoch.ts
- `19. Development-only: page payloads include the full room row` --references--> `getRoom()`  [INFERRED]
  docs/personal-room-issues.md → packages/core/src/domain/rooms.ts

## Import Cycles
- None detected.

## Communities (206 total, 27 thin omitted)

### Community 0 - "themes.ts"
Cohesion: 0.10
Nodes (22): COLLECTIONS, GAMES, isRecord(), parsePlacements(), placementOf(), ownsAll, ownsNone, ATELIER_SPOTS (+14 more)

### Community 1 - "walk.ts"
Cohesion: 0.12
Nodes (13): FloorPoint, WalkArea, water, POND_LANDMARKS, DEPTH_SPAN, depthOf(), MAX_DEPTH, PICTURE (+5 more)

### Community 2 - "SketchGuess.tsx"
Cohesion: 0.06
Nodes (55): sameOriginUrl(), bestKeyFor(), BURST, clueUrl(), openingPlan(), Phase, pickAtRandom(), PreparedGame (+47 more)

### Community 3 - "rooms.ts"
Cohesion: 0.10
Nodes (25): dynamic, HomePage(), dynamic, RoomPage(), HomeSignIn(), artist(), member(), piece() (+17 more)

### Community 4 - "rules.ts"
Cohesion: 0.16
Nodes (17): localDay(), at(), EXCHANGE_DAILY_STAMPS, EXCHANGE_PEARLS_PER_STAMP, exchangeClaimKey(), GAME_DAILY_CAP, GameId, GAMES (+9 more)

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
Cohesion: 0.10
Nodes (38): AssetManifest, assetUrl(), bitmapTexture(), blankImage(), CAFE_CAT_FRAMES, elementTexture(), ENTRANCE_FILES, EntranceName (+30 more)

### Community 9 - "SyncStore"
Cohesion: 0.15
Nodes (8): encodeStored(), parseStored(), readStored(), removeStored(), tryReadStored(), writeStored(), SyncStore, upgrade()

### Community 10 - "machine.ts"
Cohesion: 0.10
Nodes (47): CAST_ERRORS, coarsePointer(), FishingView(), initialEasyReel(), isTyping(), LOST, Toast, vibrate() (+39 more)

### Community 11 - "PondRoom.tsx"
Cohesion: 0.08
Nodes (28): Loading(), Loading(), metadata, PondPage(), AtelierLoading(), revealFloorTransition(), POND_NAME, PondLoading() (+20 more)

### Community 12 - "Test Fakes and Helpers"
Cohesion: 0.11
Nodes (28): deferredFetch(), deviceSlot, FakeEvents, FakeStorage, fixture, fixtureB, fixtureRegistry, fixtureRegistryBoth (+20 more)

### Community 13 - "scene.ts"
Cohesion: 0.05
Nodes (33): MuseumProps, disposeDisplayTexture(), prefersAvif(), HiddenCoin, cafeAfterIndex(), computeLayout(), cutRooms(), HallLayout (+25 more)

### Community 14 - "cozy.ts"
Cohesion: 0.15
Nodes (22): ATELIER_PROPS, AtelierImage, canvasTexture(), CozyBackdrop, cozyPropImageUrl(), cozyTheme, disposeCozyArt(), drawingOn() (+14 more)

### Community 15 - "actions.ts"
Cohesion: 0.08
Nodes (61): AnalyticsPage(), dynamic, dynamic, GalleryPage(), dynamic, LocationsPage(), dynamic, StudioHome() (+53 more)

### Community 16 - "room-events.ts"
Cohesion: 0.19
Nodes (25): ChatButton(), REFUSED, joinRoom(), emit(), getPeople(), isInRoom(), isMuted(), muted (+17 more)

### Community 17 - "stage.ts"
Cohesion: 0.04
Nodes (39): CameraRig, Look, Viewport, createPixelRatioGovernor(), PIXEL_RATIO_STEPS, Options, Pose, Room (+31 more)

### Community 18 - "ref_node_assert"
Cohesion: 0.12
Nodes (30): defineSlot(), docBytes(), SLOTS, byAtThenKey(), encoded(), latest, mapOf(), maxNumber() (+22 more)

### Community 19 - "amplify/package.json"
Cohesion: 0.17
Nodes (14): devDependencies, @aws-amplify/backend@^1.14.0, @aws-amplify/backend-cli@^1.6.0, aws-cdk-lib@^2.180.0, constructs@^10.3.0, name, private, scripts (+6 more)

### Community 20 - "app/page.tsx"
Cohesion: 0.20
Nodes (13): dynamic, Hall(), MuseumPage(), [BRAND_OWNER, ...BRAND_REST], CurrentlyShowing(), Decor(), dynamic, LandingPage() (+5 more)

### Community 21 - "prepare-models.mjs"
Cohesion: 0.10
Nodes (26): paintedCostume(), BODIES, bruce, BRUCE_FIT, BRUCE_PLACE, bunny, CARDIGAN_TIE, CROWN (+18 more)

### Community 22 - "Traversal"
Cohesion: 0.09
Nodes (11): coverFloorTransition(), JumpPose, createRoomPassage(), fixture(), clamp(), JUMP_KEYS, fixture(), jump() (+3 more)

### Community 23 - "core/package.json"
Cohesion: 0.16
Nodes (13): devDependencies, @types/bcryptjs@^2.4.6, @types/pg@^8.11.10, main, name, private, scripts, typecheck (+5 more)

### Community 24 - "currentMember"
Cohesion: 0.21
Nodes (15): GET(), BOARDS, GET(), oneOf(), PER_VISITOR, PERIODS, GET(), GET() (+7 more)

### Community 25 - "earn"
Cohesion: 0.26
Nodes (12): earn(), emit(), emitEarned(), maybeInvite(), writeSession(), blankDraft(), GuestBoard(), tap() (+4 more)

### Community 26 - "DecorController"
Cohesion: 0.05
Nodes (8): Carry, PersonalRoomProps, DecorController, HallRoomData, PersonalRoomOptions, GhostOptions, PlacementLayer, Placement

### Community 27 - "Museum.tsx"
Cohesion: 0.19
Nodes (19): CoinFound, ColorRecall, GameDesktop, GuestBoard, HallArranger, HelpGuide, loadCoinFound(), loadGuestBoard() (+11 more)

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
Cohesion: 0.04
Nodes (37): AtelierActions, AtelierImage, AtelierRoom, BuiltRoom, Cardigan, CARDIGAN_NAMES, ClothingItem, Control (+29 more)

### Community 33 - "slots/store.ts"
Cohesion: 0.13
Nodes (14): ANON_PREFIX, anonKey(), deviceKey(), isMemberSlotKey(), listKeys(), MEMBER_KEY, memberKey(), memberPrefix() (+6 more)

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
Nodes (47): grantPearls(), member(), now, piece(), randomId(), today, getPondBounties(), applyClaim() (+39 more)

### Community 38 - "PondPanels.tsx"
Cohesion: 0.11
Nodes (19): BaitTray(), BAIT, GLYPHS, PearlIcon(), POND_CRIMSON, PondIconName, fetchPondBounties(), getPondStateSnapshot() (+11 more)

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
Cohesion: 0.10
Nodes (12): CANVAS, clear, FONT, FRAME, heights, layout, lossless, manifest (+4 more)

### Community 44 - "Base TSConfig"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, lib, module, moduleResolution (+9 more)

### Community 45 - "Amplify Build Spec"
Cohesion: 0.12
Nodes (16): applications, appRoot, backend, frontend, baseDirectory, files, phases, commands (+8 more)

### Community 46 - "features/economy/index.ts"
Cohesion: 0.19
Nodes (18): serverSnapshot, useEarnEvents(), useWallet(), buildClaim(), BuiltClaim, EarnDetail, EarnSource, GameSource (+10 more)

### Community 47 - "bug-reports.ts"
Cohesion: 0.09
Nodes (32): POST(), POST(), POST(), GLOBAL, PER_IP, POST(), GET(), PER_VISITOR (+24 more)

### Community 48 - "FakeServer"
Cohesion: 0.20
Nodes (3): FakeServer, SlotState, SlotDef

### Community 49 - "handlers.ts"
Cohesion: 0.09
Nodes (33): confirmedFollowers(), sealEpoch(), DisplayPieceRow, handleDerivatives(), handleNotifyFollowers(), handleRenderDisplay(), handleSealEpoch(), renderPieceFrame() (+25 more)

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
Cohesion: 0.13
Nodes (29): Purse(), allowedCharacter(), OwnedSnapshot, owns(), walletReady(), stampLabel(), Atelier(), leave() (+21 more)

### Community 54 - "createAtelierRoom"
Cohesion: 0.29
Nodes (19): aspectOf(), createAtelierRoom(), buildCollection(), form(), buildEntrance(), buildRoom(), picture(), place() (+11 more)

### Community 55 - "compose-atelier.mjs"
Cohesion: 0.14
Nodes (9): body, dressLayer, dressWidth, floralWidth, MANNEQUIN_CANVAS, mask, root, sourceSize (+1 more)

### Community 56 - "core/src/index.ts"
Cohesion: 0.10
Nodes (39): PondBoardMe, PondBoardRow, PondFeedItem, Rep, BountyCatchRow, getPondState(), ONCE, PondBaitResult (+31 more)

### Community 57 - "pond-format.ts"
Cohesion: 0.13
Nodes (25): fetchPondDex(), PondDex, EXCHANGE_DAILY_STAMPS, EXCHANGE_PEARLS_PER_STAMP, FISH_ART, fishArt(), formatPercent(), formatShortSizeCm() (+17 more)

### Community 58 - "react"
Cohesion: 0.11
Nodes (25): ColorRecall(), ColorRecallProps, Phase, readBest(), ColorRound, showMs(), openBugReport(), fitWidth() (+17 more)

### Community 59 - "economy/store.ts"
Cohesion: 0.11
Nodes (40): CARRY_CAP, carryAdd(), CarryEntry, carryPrune(), carryRemove(), chunk(), ClaimRequest, tzOffsetNow() (+32 more)

### Community 60 - "backend.ts"
Cohesion: 0.15
Nodes (12): amplifyDir, backend, everyMinutes, mediaBucket, missing, repoRoot, REQUIRED, setting() (+4 more)

### Community 61 - "room.ts"
Cohesion: 0.15
Nodes (26): admitted(), Attachment, farewell(), GHOST_MS, HELLO_TIMEOUT_MS, holdsOf(), MAX_WAITING_PER_IP, newAttachment() (+18 more)

### Community 62 - "minimap.ts"
Cohesion: 0.07
Nodes (34): place(), ATELIER_DOOR, createMinimap(), draw(), drawRoom(), floors(), follow(), sketchOf() (+26 more)

### Community 63 - "validatePlacements"
Cohesion: 0.20
Nodes (10): prop(), 1. Items placed against a zone edge fail to save, and the whole draft reverts, 2. One owned item can be placed many times, 3. Any save rejection throws away all unsaved work, 4. Changes made just before leaving are lost, 5. Fish trophies can be claimed without playing, High, Design for Phases 5–7 (2026-11-05) (+2 more)

### Community 64 - "Handoff: move the Tiny Museum bunny from sprite frames to a rig"
Cohesion: 0.15
Nodes (15): between(), peek(), walk(), 1. What is in this bundle, 2. How the game draws the bunny today (read from the repo, not run), 3. The rig, 4. Suggested plan, 5. Blender-side work still to do (needs Blender; the author has it with an MCP bridge) (+7 more)

### Community 65 - "Sound Effect Assets"
Cohesion: 0.22
Nodes (9): file, kilobytes, seconds, file, kilobytes, seconds, soundEffects, click (+1 more)

### Community 66 - "ticket/route.ts"
Cohesion: 0.15
Nodes (23): PER_MEMBER, PUT(), PER_IP, POST(), presenceUrl(), allowedOrigin(), checkMutation(), Code (+15 more)

### Community 67 - "Custom HTTP Headers"
Cohesion: 0.25
Nodes (7): applications, appRoot, customHeaders, headers, pattern, key, value

### Community 68 - "Sharp Layer Package"
Cohesion: 0.33
Nodes (6): dependencies, sharp@^0.33.5, description, sharp, name, private

### Community 69 - "atelier/room.ts"
Cohesion: 0.10
Nodes (18): AtelierArt, disposeAtelierArt(), GALLERY_DOOR, loadGalleryDoor(), loadGalleryPillar(), loadImage(), pending, AtelierArtwork (+10 more)

### Community 70 - "scene/ambience.ts"
Cohesion: 0.13
Nodes (13): BULBS, createHallAmbience(), finish(), glowTexture(), HallAmbience, mulberry(), painted(), vignetteTexture() (+5 more)

### Community 71 - "wallet/body.ts"
Cohesion: 0.19
Nodes (16): PER_MEMBER, catchIdOf(), isRecord(), MAX_POND_BODY_BYTES, pearlsOf(), PER_MEMBER, POST(), baitIdOf() (+8 more)

### Community 72 - "next"
Cohesion: 0.12
Nodes (19): config, SECURITY_HEADERS, BugReportsPage(), dateFormat, dynamic, summary(), dateFormat, dynamic (+11 more)

### Community 73 - "import-landing-assets.mjs"
Cohesion: 0.13
Nodes (9): socket(), CAT, drop, EXPECTED, manifest, manifestPath, masters, root (+1 more)

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

### Community 83 - "outbox.test.ts"
Cohesion: 0.23
Nodes (14): OUTBOX_CAP, outboxAdd(), outboxDue(), OutboxEntry, outboxFail(), outboxRemove(), RETRY_BASE_MS, RETRY_MAX_MS (+6 more)

### Community 84 - "presence/package.json"
Cohesion: 0.14
Nodes (16): dependencies, @tiny/core@*, devDependencies, @cloudflare/workers-types@5.20261016.1, wrangler@4.151.1, @tiny/core, name, private (+8 more)

### Community 85 - "Rig"
Cohesion: 0.25
Nodes (3): RigState, Rig, Shown

### Community 86 - "Asset pipeline: fast loading without losing sharpness"
Cohesion: 0.22
Nodes (8): Asset pipeline: fast loading without losing sharpness, Character rigs and the Costume Atelier, Completed, Ground rules, Phase 1: fingerprinted files at 2x and 3x, Phase 2: texture atlases for the hall sprites, Phase 3: KTX2 (Basis Universal), built and switched off, Phase 4: ThumbHash placeholders for paintings

### Community 87 - "Guest Board SQL Schema"
Cohesion: 0.67
Nodes (3): guest_notes, guest_notes_visible, rate_limits

### Community 88 - "Landscape Frame Asset"
Cohesion: 0.67
Nodes (3): frameLandscape, size, window

### Community 89 - "epoch.ts"
Cohesion: 0.07
Nodes (46): CONTENT_TYPES, GET(), PUT(), listPieces(), pieceImageUrl(), PieceRow, toPieceDto(), EpochRow (+38 more)

### Community 93 - "json"
Cohesion: 0.12
Nodes (42): POST(), POST(), POST(), PER_MEMBER, PUT(), POST(), PER_MEMBER, POST() (+34 more)

### Community 94 - "db-tests/pond.test.ts"
Cohesion: 0.09
Nodes (28): CatchExtra, COLUMNS, insertCatch(), member(), namedMember(), randomId(), StatePatch, compare() (+20 more)

### Community 95 - "pond/room.ts"
Cohesion: 0.11
Nodes (24): depthAtLift(), FAR_LIFT, FAR_SCALE, liftAt(), pathHalfWidth(), pathX(), PondPath, scaleAt() (+16 more)

### Community 96 - "ticket/route.ts"
Cohesion: 0.16
Nodes (25): GLOBAL, PER_IP, POST(), registry, started(), hashPassword(), verifyPassword(), canonicalEmail() (+17 more)

### Community 104 - "locations.ts"
Cohesion: 0.20
Nodes (22): AtelierPage(), dynamic, metadata, discardLocation(), hasUnpublished(), locationStates(), nudgeInRow(), OWNER (+14 more)

### Community 105 - "FishingView.tsx"
Cohesion: 0.12
Nodes (15): CONFETTI_COLORS, ConfettiPiece, makeConfetti(), RevealCard(), TIER_MS, TIER_SFX, useCountUp(), chainOffer (+7 more)

### Community 106 - "ticket.ts"
Cohesion: 0.23
Nodes (12): decoder, encoder, fromBase64Url(), HmacKey, isOwn(), isTicket(), keyFor(), keys (+4 more)

### Community 107 - "lib/assets.ts"
Cohesion: 0.16
Nodes (19): Loading(), DENSITY_MEDIA, HallPreload(), HallSkeleton(), assetCssVariables(), assetEntry, AtlasGroup, AtlasSheet (+11 more)

### Community 108 - "claimPondBounty"
Cohesion: 0.21
Nodes (17): baitOf(), bountyCatches(), bountyViews(), buyPondBait(), chainPondBait(), claimPondBounty(), exchangePearls(), isRecord() (+9 more)

### Community 109 - "createPlacementLayer"
Cohesion: 0.18
Nodes (8): aspectOf(), createPlacementLayer(), drawOutline(), dropHelper(), sizeOf(), PlacementTheme, Phase 5: themes, zones and arrangements, ThemeSpec

### Community 110 - "graftCostume"
Cohesion: 0.27
Nodes (14): canvasFit(), compose(), graftCostume(), copyAccessor(), copyMaterial(), copyMesh(), copyTexture(), copyView() (+6 more)

### Community 111 - "pondgame/lib/api.ts"
Cohesion: 0.33
Nodes (14): buyPondBait(), castPond(), chainPondBait(), errorOf(), fetchPondState(), isRecord(), memberId(), PondCastReply (+6 more)

### Community 112 - "worker/tsconfig.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 113 - "core/tsconfig.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 114 - "import-hall-assets.mjs"
Cohesion: 0.10
Nodes (16): BASEBOARD, CURTAIN, drop, EXPECTED, file(), manifest, manifestPath, masters (+8 more)

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
Cohesion: 0.16
Nodes (21): fetch(), Env, isItem(), isName(), isPid(), isSeq(), MAX_HOLDS, MAX_INSTANCE (+13 more)

### Community 119 - "Costume gallery doorway"
Cohesion: 0.50
Nodes (3): Costume gallery doorway, Curtain colour edit, Prompt

### Community 120 - "pond-api.ts"
Cohesion: 0.25
Nodes (14): PondBoardId, PondBoardPeriod, PondBoardRow, PondLeaderboard, formatInteger(), formatOdds(), nextMondayUtc(), BoardRow() (+6 more)

### Community 121 - "Fishing forest: painted asset pass"
Cohesion: 0.10
Nodes (18): Assets, Bruce's collection refresh (2026-11-08), Fishing forest illustrations, Made by hand (not touched by the script), Main hall v2 (2026-11-10), Monets Lily Pond (2026-11-08), 1. Forest doorway, 2. Woodland noticeboard (+10 more)

### Community 124 - "The Costume Atelier"
Cohesion: 0.12
Nodes (15): Adding a character, Adding a costume, Art not supplied as files, Bruce's Chronicles, Checked against the mocks (2026-11-07), Code, Costume fit review, Fitting clothes to other characters (+7 more)

### Community 125 - "Confirmed issues"
Cohesion: 0.04
Nodes (47): onClick(), 10. Long names run off the name sign, 11. The rooms API skips the stale-tab member check, 12. The bunny is dragged along while you pan in Decorate, 13. Pages that redirect or don't exist answer 200, 14. Error codes reveal which room slugs exist, 15. The name sign slides under the top-right buttons in Decorate, 16. Level-up celebrations can be farmed (+39 more)

### Community 126 - "rig.ts"
Cohesion: 0.14
Nodes (23): Layer, setCostumeVisibility(), canvasToModel(), disposeRigLayer(), Frame, layerTemplates, loadRig(), dispose() (+15 more)

### Community 127 - "Curating the paintings (2026-11-07)"
Cohesion: 0.13
Nodes (14): 1. The registry and the table, 2. The studio's Location picker, 3. The rooms draw what is placed, 4. Credits, 5. Retiring self-serve artists, Building it, Curating the paintings (2026-11-07), Decided (+6 more)

### Community 128 - "domain/guestboard.ts"
Cohesion: 0.06
Nodes (48): GET(), BoardScreen(), BoardScreenProps, ComposeScreen(), ComposeScreenProps, GuestBoardProps, View, PinnedNotes() (+40 more)

### Community 129 - "presence/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, types, exclude, extends, include, ../../tsconfig.base.json

### Community 130 - "run.ts"
Cohesion: 0.17
Nodes (9): admin, childEnv, client, database, fresh, migrations, target, pg@^8.13.1 (+1 more)

### Community 131 - "tsconfig.test.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 132 - "app/layout.tsx"
Cohesion: 0.09
Nodes (24): bethEllen, inspiratiq, metadata, notoSans, RootLayout(), sniglet, viewport, StageOptions (+16 more)

### Community 133 - "ArrangeControls.tsx"
Cohesion: 0.27
Nodes (12): hangAction(), movePieceAction(), unhangAction(), FloorControls(), move(), unhang(), formFor(), StorageControls() (+4 more)

### Community 134 - "lib/presence.ts"
Cohesion: 0.12
Nodes (11): Entry, INTERPOLATION_DELAY_MS, PEER_TIMEOUT_MS, PeerTable, positionAt(), RemoteVisitor, Sample, look (+3 more)

### Community 135 - "Item"
Cohesion: 0.19
Nodes (3): Presence, Item, Refusal

### Community 136 - "DecorDrawer.tsx"
Cohesion: 0.17
Nodes (8): DecorDrawer, DecorDrawerProps, SharingState, Tab, TABS, DrawerCategory, propIds(), trayPropIds()

### Community 137 - "jobs.ts"
Cohesion: 0.22
Nodes (16): loop(), shutdown(), sleep(), sweepStale(), DrainResult, handler(), repairFrames(), repairUnframed() (+8 more)

### Community 138 - "hall/room.ts"
Cohesion: 0.07
Nodes (51): Assets, Scenery, CUTS, disposeBoards(), Mark, plane(), ROPE_CUTS, ropeSlices() (+43 more)

### Community 139 - "ensureEpoch"
Cohesion: 0.36
Nodes (9): GET(), intParam(), GET(), sketchPool, unavailable(), currentEpoch(), ensureEpoch(), epochById() (+1 more)

### Community 140 - "presence.test.ts"
Cohesion: 0.10
Nodes (21): Outcome, Connect, connectWebSocket(), fetchTicket, HEARTBEAT_MS, HIDDEN_LIMIT_MS, RETRY_MS, sameLook() (+13 more)

### Community 141 - "art-cache.ts"
Cohesion: 0.21
Nodes (9): ArtCacheOptions, createArtCache(), drop(), expireLater(), hold(), HeldArt, LoadResult, Slot (+1 more)

### Community 142 - "visits.ts"
Cohesion: 0.06
Nodes (47): state(), PER_VISITOR, POST(), dynamic, format(), grade(), METRICS, PAGES (+39 more)

### Community 143 - "writeStyle"
Cohesion: 0.12
Nodes (8): CafeLink, GuestBoardNotes, Placards, toScreen(), writeStyle(), createSitting(), hop(), raise()

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
Cohesion: 0.09
Nodes (39): BaitTrayProps, PondGameProps, PondGame(), RevealCardProps, PondCatch, CatchView, debugSpecies(), debugVariant() (+31 more)

### Community 149 - "remote-visitors.ts"
Cohesion: 0.06
Nodes (20): CharacterSprites, Attachment, Carried, CarriedState, Character, Perch, Pose, Matcha (+12 more)

### Community 150 - "createHallRoom"
Cohesion: 0.16
Nodes (14): createCarried(), createHelm(), createHallRoom(), buildRoom(), cafeRoom(), entranceRoom(), galleryRoom(), giftShopRoom() (+6 more)

### Community 151 - "pond-state.ts"
Cohesion: 0.29
Nodes (12): fetchPondState(), PondStateView, PondTier, ensurePondStateStarted(), GUEST, listeners, LOADING, PondStateSnapshot (+4 more)

### Community 152 - "hit.ts"
Cohesion: 0.17
Nodes (12): CoinWall, createHiddenCoin(), Spot, AlphaMap, alphaMapFor(), alphaMaps, buildAlphaMap(), isPaintedAt() (+4 more)

### Community 153 - "Other visitors"
Cohesion: 0.29
Nodes (6): How it plays, Other visitors, Privacy, Running it in production, Running it locally, Staying consistent

### Community 155 - "lib/slots/index.ts"
Cohesion: 0.07
Nodes (29): PresencePreviewPage(), AccountHost(), AccountSheet, NAME_ERRORS, Pending, View, KeepOnOtherDevices(), AccountMode (+21 more)

### Community 156 - "logic.ts"
Cohesion: 0.12
Nodes (24): loadHallArranger(), carryMove(), HallArranger(), HallArrangerProps, Painting, categoryOf(), clampX(), cozyWorth() (+16 more)

### Community 157 - "Walkthrough.tsx"
Cohesion: 0.22
Nodes (13): BACKDROP_STYLE, MoreArrow(), NavArrow(), Props, SLIDE, Walkthrough(), XIcon(), frameFor() (+5 more)

### Community 158 - "createPondRoom"
Cohesion: 0.32
Nodes (13): createPondRoom(), approach(), busy(), finishWalk(), goTo(), leave(), move(), nearest() (+5 more)

### Community 159 - "Pedestal"
Cohesion: 0.14
Nodes (4): Helm, createNotes(), createPedestal(), Pedestal

### Community 160 - "LandingFx"
Cohesion: 0.19
Nodes (10): CAT, Edge, EDGES, runLandingCat(), glowSprite(), LandingFx(), onVisibility(), tick() (+2 more)

### Community 161 - "frame.ts"
Cohesion: 0.22
Nodes (11): decodedFrames, FrameShape, LANDSCAPE, markFrameReady(), PORTRAIT, preloadFrames(), shape(), SPECIES (+3 more)

### Community 162 - "CoinToast.tsx"
Cohesion: 0.16
Nodes (10): MuseumLayout(), CoinToast(), Toast, Stamp(), WalletProvider(), STAMP_ASPECT, STAMP_SVG, STAMP_URL (+2 more)

### Community 163 - "painting-open"
Cohesion: 0.50
Nodes (4): file, kilobytes, seconds, painting-open

### Community 164 - "tab-turn.ts"
Cohesion: 0.16
Nodes (5): createTabTurn(), TabTurn, tab(), TurnEnv, TurnMessage

### Community 165 - "Multiplayer ("other visitors") — plan v2 (Cloudflare)"
Cohesion: 0.10
Nodes (19): 0. Summary, 10. Decisions, 1. Product contract changes (approved 2026-10-31), 2. What already exists that this builds on, 3.1 Generated names (everyone has one), 3. Names, 4. Transport: Cloudflare Durable Objects, 5.1 Emotes (v1) (+11 more)

### Community 166 - "editor.ts"
Cohesion: 0.18
Nodes (16): roomEditor, PER_EDITOR, PUT(), versionOf(), PER_EDITOR, POST(), PER_MEMBER, POST() (+8 more)

### Community 167 - "exports"
Cohesion: 0.15
Nodes (13): exports, ./brand, ./bugs, ./economy, ./guestboard, ./presence, ./presence/messages, ./presence/wire (+5 more)

### Community 168 - "query"
Cohesion: 0.09
Nodes (27): ArtistPage(), dynamic, generateMetadata(), GET(), ALLOWED, POST(), POST(), GET() (+19 more)

### Community 169 - "icon-basket"
Cohesion: 0.67
Nodes (3): icon-basket, file, vector

### Community 170 - "nearby.ts"
Cohesion: 0.18
Nodes (6): createNearby(), Nearby, NearbyReach, RoomSpan, reach, strip

### Community 171 - ".webSocketMessage"
Cohesion: 0.44
Nodes (3): attachmentOf(), Room, sendTo()

### Community 172 - "BountyPanel.tsx"
Cohesion: 0.30
Nodes (10): claimPondBounty(), PondBounties, formatCountdown(), nextUtcMidnight(), utcDayLabel(), useCountdown(), useNow(), BountyPanel() (+2 more)

### Community 174 - "RigPreview.tsx"
Cohesion: 0.29
Nodes (8): RigPreviewPage(), NEXT, PROPS, RigPreview(), draw(), approach(), stepRigState(), RigAttachmentPose

### Community 176 - "PersonalRoom.tsx"
Cohesion: 0.11
Nodes (27): errorReason(), overDrawer(), PersonalRoom(), canPlaceNew(), carryEnd(), onCardKey(), onCardPointerDown(), onSurfaceDown() (+19 more)

### Community 177 - "CrowdPreview.tsx"
Cohesion: 0.29
Nodes (8): CrowdPreviewPage(), CrowdPreview(), draw(), KINDS, Stats, Window, clearRigLayer(), layer()

### Community 179 - "AccountSheet"
Cohesion: 0.29
Nodes (9): AccountSheet(), continueAnyway(), doSignOut(), runDelete(), runName(), submit(), submitDelete(), submitName() (+1 more)

### Community 180 - "confirm/page.tsx"
Cohesion: 0.33
Nodes (7): ConfirmFollow(), dynamic, dynamic, Unsubscribe(), FollowNotice(), confirmFollow(), unsubscribe()

### Community 182 - "createRemoteVisitors"
Cohesion: 0.21
Nodes (9): createRenderer(), createRigLayer(), createRemoteVisitors(), ensureLayer(), load(), placeOwn(), show(), showProp() (+1 more)

### Community 183 - "perf.ts"
Cohesion: 0.22
Nodes (4): createPerfMeter(), isEnabled(), PerfMeter, PerfSnapshot

### Community 184 - "setPondState"
Cohesion: 0.50
Nodes (8): refreshWalletNow(), exchangePondPearls(), setPondState(), BaitShop(), buy(), Exchange(), exchange(), FishmongerPanel()

### Community 185 - "shopkeeper.ts"
Cohesion: 0.29
Nodes (6): RigPiece, COATS, createShopkeeper(), GREETINGS, OUTFIT, recolourFur()

### Community 186 - "dependencies"
Cohesion: 0.18
Nodes (11): dependencies, @aws-sdk/client-s3@^3.1121.0, @aws-sdk/s3-request-presigner@^3.1121.0, bcryptjs@^2.4.3, sharp@^0.33.5, thumbhash@^0.1.1, sharp, thumbhash (+3 more)

### Community 187 - "S3Storage"
Cohesion: 0.18
Nodes (3): S3Storage, S3StorageOptions, PresignedUpload

### Community 190 - "memberFromRequest"
Cohesion: 0.43
Nodes (6): GET(), GET(), memberFromRequest(), exportMember(), readSlots(), exportWallet()

### Community 191 - "useSoundEffects.ts"
Cohesion: 0.11
Nodes (27): BackgroundMusic, clampVolume(), isDocumentHidden(), Options, useBackgroundMusic(), VISIBILITY_EVENTS, EFFECTS, EffectSpec (+19 more)

### Community 192 - "Angler.tsx"
Cohesion: 0.20
Nodes (12): createCharacter(), contextLost(), loadKind(), loseRig(), setFrame(), createRigState(), FITS, Angler() (+4 more)

### Community 193 - "Monets Lily Pond: exploration, UX and multiplayer QA"
Cohesion: 0.29
Nodes (6): Browser and interaction coverage, Changes made from the walkthrough, Monets Lily Pond: exploration, UX and multiplayer QA, Multiplayer and load, Practical limits, Regression checks and cleanup

### Community 194 - "messages.ts"
Cohesion: 0.39
Nodes (6): checkMessage(), INVISIBLE, MESSAGE_MAX, MessageCheck, normalizeMessage(), hasProfanity()

### Community 197 - "pond-api.ts"
Cohesion: 0.21
Nodes (15): buyPondBait(), errorOf(), fetchPondLeaderboard(), isRecord(), isStateView(), memberId(), mutationHeaders(), PondBounty (+7 more)

### Community 199 - "session.ts"
Cohesion: 0.15
Nodes (21): GET(), PaintingRow, POST(), UPLOADS_PER_ARTIST, POST(), UPLOADS_PER_ARTIST, StudioLayout(), currentArtist() (+13 more)

### Community 203 - "profanity.ts"
Cohesion: 0.50
Nodes (3): obscenity@^0.4.6, matcher, obscenity

### Community 215 - "createStage"
Cohesion: 0.16
Nodes (21): boundedCameraX(), createStage(), closeEntry(), enter(), initialize(), aim(), drawFrame(), handleClick() (+13 more)

## Knowledge Gaps
- **5 isolated node(s):** `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1383 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **27 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `domain/guestboard.ts`, `SketchGuess.tsx`, `app/layout.tsx`, `ArrangeControls.tsx`, `DecorDrawer.tsx`, `machine.ts`, `PondRoom.tsx`, `Test Fakes and Helpers`, `actions.ts`, `room-events.ts`, `app/page.tsx`, `Museum.tsx`, `lib/slots/index.ts`, `Walkthrough.tsx`, `Web Package Dependencies`, `logic.ts`, `LandingFx`, `CoinToast.tsx`, `risk.ts`, `PondPanels.tsx`, `query`, `bug-reports.ts`, `PondTicker.tsx`, `BountyPanel.tsx`, `features/economy/index.ts`, `RigPreview.tsx`, `PersonalRoom.tsx`, `CrowdPreview.tsx`, `Water.tsx`, `wardrobe.ts`, `pond-format.ts`, `useSoundEffects.ts`, `Angler.tsx`, `next`, `FishingView.tsx`, `pond-api.ts`?**
  _High betweenness centrality (0.078) - this node is a cross-community bridge._
- **What connects `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json` to the rest of the system?**
  _5 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `themes.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0967741935483871 - nodes in this community are weakly interconnected._
- **Why does `three` connect `hall/room.ts` to `atelier.ts`, `atelier/room.ts`, `scene/ambience.ts`, `scene/assets.ts`, `scene.ts`, `cozy.ts`, `pond/art.ts`, `stage.ts`, `remote-visitors.ts`, `Traversal`, `perf.ts`, `hit.ts`, `prepare-models.mjs`, `rig.ts`, `ambience.ts`, `Web Package Dependencies`, `pond/room.ts`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **Should `walk.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1206896551724138 - nodes in this community are weakly interconnected._
- **Why does `Traversal` connect `Traversal` to `stage.ts`, `hall/room.ts`, `createStage`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Should `SketchGuess.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05879917184265011 - nodes in this community are weakly interconnected._