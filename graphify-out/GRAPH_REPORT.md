# Graph Report - tiny-museum  (2026-11-10)

## Corpus Check
- 488 files · ~262,874 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 78 file(s) not represented in the graph (top: .avif 39, .glb 30, .css 4)

## Summary
- 4241 nodes · 11010 edges · 191 communities (163 shown, 28 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 198 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d93888cf`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- actions.ts
- walk.ts
- SketchGuess.tsx
- themes.ts
- jobs.ts
- round.ts
- floor.ts
- Core Asset Manifest
- scene/assets.ts
- SyncStore
- machine.ts
- PondRoom.tsx
- Test Fakes and Helpers
- HallScene
- cozy.ts
- member-session.ts
- join-room.ts
- createAtelierRoom
- ref_node_assert
- amplify/package.json
- hang-tag.ts
- prepare-models.mjs
- Traversal
- core/package.json
- currentMember
- logic.ts
- DecorController
- Museum.tsx
- ambience.ts
- core/src/index.ts
- Web Package Dependencies
- Gamifying Tiny Museum — genre direction & engagement research
- wardrobe.test.ts
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
- pond-api.ts
- hitForVisitor
- compose-atelier.mjs
- locations.ts
- pond-format.ts
- AccountSheet.tsx
- economy/store.ts
- domain/sketch.ts
- room.ts
- minimap.ts
- domain/pond.ts
- Handoff: move the Tiny Museum bunny from sprite frames to a rig
- Sound Effect Assets
- rooms.ts
- Custom HTTP Headers
- Sharp Layer Package
- Confirmed issues
- Other visitors
- ArrangeControls.tsx
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
- db-tests/pond.test.ts
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
- LeaderboardPanel.tsx
- Fishing forest: painted asset pass
- audio/README.md
- .claude/CLAUDE.md
- The Costume Atelier
- formatInteger
- rig.ts
- Curating the paintings (2026-11-07)
- Pedestal
- presence/tsconfig.json
- memberFromRequest
- tsconfig.test.json
- app/layout.tsx
- messages.ts
- lib/presence.ts
- db.ts
- backend.ts
- stage.ts
- hall/room.ts
- epoch.ts
- Item
- sketchguess/lib/api.ts
- visits.ts
- Conn
- The Moonlit Pond — design
- Pond rework
- env.ts
- Orchestration contract — you plan, DSH workers execute
- tables.ts
- validatePlacements
- placeLabel
- pond-state.ts
- .webSocketMessage
- AssetImage
- output.test.ts
- share.ts
- Sitting
- Walkthrough.tsx
- createPondRoom
- createPlacementLayer
- a/[slug]/page.tsx
- performance/page.tsx
- Local end-to-end stress test — 2026-11-06
- painting-open
- Notes
- Multiplayer ("other visitors") — plan v2 (Cloudflare)
- next.config.ts
- BountyPanel.tsx
- audience.ts
- icon-basket
- reveal.ts
- next
- Backdrop
- bunny-left
- lib/slots/index.ts
- bunny-right
- icon-home
- confirm/page.tsx
- wardrobe.ts
- ticket
- run.ts
- 4. Transport: Cloudflare Durable Objects
- getStorage
- Cafe
- useSoundEffects.ts
- Low
- Monets Lily Pond: exploration, UX and multiplayer QA
- PerfMeter
- Lobby
- focus.ts
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

## Communities (191 total, 28 thin omitted)

### Community 0 - "actions.ts"
Cohesion: 0.07
Nodes (63): BugReportsPage(), dateFormat, dynamic, summary(), dynamic, GalleryPage(), dateFormat, dynamic (+55 more)

### Community 1 - "walk.ts"
Cohesion: 0.13
Nodes (13): FloorPoint, WalkArea, water, depthAtLift(), DEPTH_SPAN, depthOf(), MAX_DEPTH, PICTURE (+5 more)

### Community 2 - "SketchGuess.tsx"
Cohesion: 0.14
Nodes (25): bestKeyFor(), BURST, clueUrl(), openingPlan(), Phase, pickAtRandom(), prepareSketchGame(), readDifficulty() (+17 more)

### Community 3 - "themes.ts"
Cohesion: 0.10
Nodes (21): COLLECTIONS, GAMES, isRecord(), placementOf(), ownsAll, ownsNone, ATELIER_SPOTS, FRAME_ASPECT (+13 more)

### Community 4 - "jobs.ts"
Cohesion: 0.11
Nodes (31): loop(), shutdown(), sleep(), sweepStale(), DrainResult, handler(), repairFrames(), clearCatches() (+23 more)

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
Cohesion: 0.05
Nodes (67): AssetManifest, assetUrl(), bitmapTexture(), blankImage(), CAFE_CAT_FRAMES, CompressedLoader, disposeDisplayTexture(), elementTexture() (+59 more)

### Community 9 - "SyncStore"
Cohesion: 0.16
Nodes (7): encodeStored(), parseStored(), readStored(), writeStored(), deepEq(), SyncStore, upgrade()

### Community 10 - "machine.ts"
Cohesion: 0.10
Nodes (49): CAST_ERRORS, coarsePointer(), FishingView(), initialEasyReel(), isTyping(), LOST, PondGameProps, Toast (+41 more)

### Community 11 - "PondRoom.tsx"
Cohesion: 0.15
Nodes (12): Loading(), metadata, PondPage(), POND_NAME, PondLoading(), PondOverlayKind, PondFishing(), PondGame (+4 more)

### Community 12 - "Test Fakes and Helpers"
Cohesion: 0.12
Nodes (26): deferredFetch(), deviceSlot, FakeEvents, FakeStorage, fixture, fixtureB, fixtureRegistry, fixtureRegistryBoth (+18 more)

### Community 13 - "HallScene"
Cohesion: 0.09
Nodes (6): prefersAvif(), HiddenCoin, HallScene, markFirstPainting(), retryDelayMs(), wallSize()

### Community 14 - "cozy.ts"
Cohesion: 0.16
Nodes (20): ATELIER_PROPS, AtelierImage, canvasTexture(), CozyBackdrop, disposeCozyArt(), drawingOn(), FISH, fishTexture() (+12 more)

### Community 15 - "member-session.ts"
Cohesion: 0.19
Nodes (13): GET(), GLOBAL, PER_IP, POST(), GLOBAL, PER_IP, POST(), allowedOrigin() (+5 more)

### Community 16 - "join-room.ts"
Cohesion: 0.10
Nodes (30): ChatButton(), REFUSED, joinRoom(), emit(), getPeople(), isInRoom(), isMuted(), muted (+22 more)

### Community 17 - "createAtelierRoom"
Cohesion: 0.21
Nodes (20): aspectOf(), AtelierActions, createAtelierRoom(), buildCollection(), form(), buildEntrance(), buildRoom(), picture() (+12 more)

### Community 18 - "ref_node_assert"
Cohesion: 0.10
Nodes (30): valid, defineSlot(), docBytes(), SLOTS, byAtThenKey(), encoded(), latest, mapOf() (+22 more)

### Community 19 - "amplify/package.json"
Cohesion: 0.17
Nodes (14): devDependencies, @aws-amplify/backend@^1.14.0, @aws-amplify/backend-cli@^1.6.0, aws-cdk-lib@^2.180.0, constructs@^10.3.0, name, private, scripts (+6 more)

### Community 20 - "hang-tag.ts"
Cohesion: 0.20
Nodes (5): CARD, HangTag, HangTagStyle, HOLE, KNOT

### Community 21 - "prepare-models.mjs"
Cohesion: 0.15
Nodes (18): paintedCostume(), atelier, bunny, floralOutfits(), goldOutfits(), HEADPIECES, image(), manifest (+10 more)

### Community 22 - "Traversal"
Cohesion: 0.07
Nodes (16): coverFloorTransition(), centerYFor(), JumpPose, createRoomPassage(), fixture(), clamp(), JUMP_KEYS, fixture() (+8 more)

### Community 23 - "core/package.json"
Cohesion: 0.06
Nodes (40): dependencies, @aws-sdk/client-s3@^3.1121.0, @aws-sdk/s3-request-presigner@^3.1121.0, bcryptjs@^2.4.3, obscenity@^0.4.6, pg@^8.13.1, sharp@^0.33.5, thumbhash@^0.1.1 (+32 more)

### Community 24 - "currentMember"
Cohesion: 0.12
Nodes (26): roomEditor, GET(), PaintingRow, PER_EDITOR, PUT(), versionOf(), PER_EDITOR, POST() (+18 more)

### Community 25 - "logic.ts"
Cohesion: 0.06
Nodes (56): loadHallArranger(), errorReason(), overDrawer(), PersonalRoom(), canPlaceNew(), carryEnd(), carryMove(), onCardKey() (+48 more)

### Community 27 - "Museum.tsx"
Cohesion: 0.11
Nodes (29): motion@^13.1.1, Loading(), PinnedNotes(), AtelierLoading(), CoinFound, ColorRecall, GameDesktop, GuestBoard (+21 more)

### Community 28 - "ambience.ts"
Cohesion: 0.16
Nodes (25): blade(), bloom(), BLOOMS, createPondAmbience(), update(), fishTexture(), frontTexture(), glowTexture() (+17 more)

### Community 29 - "core/src/index.ts"
Cohesion: 0.06
Nodes (57): addBait(), PondStateView, reelPond(), BOUNTY_POOL, BountyTemplate, inverseNormal(), isPondFish(), issuePondTicket() (+49 more)

### Community 30 - "Web Package Dependencies"
Cohesion: 0.08
Nodes (32): dependencies, embla-carousel-react@^8.6.0, next@^15.0.3, react@^19.0.0, react-dom@^19.0.0, swr@^2.5.1, three@^0.169.0, thumbhash@^0.1.1 (+24 more)

### Community 31 - "Gamifying Tiny Museum — genre direction & engagement research"
Cohesion: 0.10
Nodes (19): 0.1 The core experience, 0.2 Systems that make gamification cheap to build, 0.3 Constraints that shape any recommendation, 0. What the game is today (the deep dive), 1.1 The landscape (seven candidates, with verdicts), 1.2 Recommendation: a **cozy gallery life-sim** — "the gallery you live in", 1.3 The five design pillars the genre implies, 1. Genre direction (+11 more)

### Community 32 - "wardrobe.test.ts"
Cohesion: 0.09
Nodes (9): AtelierRoom, createWardrobe(), enqueue(), reflect(), bow, dress, navy, setup() (+1 more)

### Community 33 - "slots/store.ts"
Cohesion: 0.13
Nodes (17): ANON_PREFIX, anonKey(), deviceKey(), isMemberSlotKey(), listKeys(), MEMBER_KEY, memberKey(), memberPrefix() (+9 more)

### Community 34 - "risk.ts"
Cohesion: 0.12
Nodes (30): BaitTray(), Hud(), HudProps, HudWagerChip, WagerPicker(), chooseTier(), WagerPickerProps, chainChipLabel() (+22 more)

### Community 35 - "amplify/tsconfig.json"
Cohesion: 0.20
Nodes (9): compilerOptions, module, moduleResolution, noUnusedLocals, noUnusedParameters, exclude, extends, include (+1 more)

### Community 36 - "5. Customization menu — what other people are doing"
Cohesion: 0.12
Nodes (16): 1. The target: what "Claude Opus 5.5" actually means, 2. Where your harness stands today (live config I read), 3. The honest gap model, 4. Quality levers, ranked by leverage, 5. Customization menu — what other people are doing, 6. Recommended starting kit for *your* profile, 7. What I can apply for you right now (needs your go-ahead), A. Prompt & persona (most common quality customizations) (+8 more)

### Community 37 - "wallet.ts"
Cohesion: 0.11
Nodes (38): grantPearls(), member(), now, piece(), randomId(), today, MergeResult, buyPondBait() (+30 more)

### Community 38 - "rules.ts"
Cohesion: 0.16
Nodes (17): localDay(), at(), EXCHANGE_DAILY_STAMPS, EXCHANGE_PEARLS_PER_STAMP, exchangeClaimKey(), GAME_DAILY_CAP, GameId, GAMES (+9 more)

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
Cohesion: 0.10
Nodes (13): CANVAS, clear, FONT, FRAME, heights, layer(), layout, lossless (+5 more)

### Community 44 - "Base TSConfig"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, lib, module, moduleResolution (+9 more)

### Community 45 - "Amplify Build Spec"
Cohesion: 0.12
Nodes (16): applications, appRoot, backend, frontend, baseDirectory, files, phases, commands (+8 more)

### Community 46 - "ColorRecall.tsx"
Cohesion: 0.16
Nodes (19): ColorRecall(), ColorRecallProps, Phase, readBest(), ColorRound, showMs(), loadColorRecall(), saveIfHigher() (+11 more)

### Community 47 - "db-tests/pond.test.ts"
Cohesion: 0.12
Nodes (26): compare(), DexRow, displayName(), FeedRow, getPondFeed(), getPondLeaderboard(), NameRow, PondBoardId (+18 more)

### Community 48 - "FakeServer"
Cohesion: 0.18
Nodes (3): FakeServer, SlotState, SlotDef

### Community 49 - "handlers.ts"
Cohesion: 0.07
Nodes (37): confirmedFollowers(), GalleryRow, SketchPieceRow, DisplayPieceRow, handleDerivatives(), handleNotifyFollowers(), handleRenderDisplay(), handleSealEpoch() (+29 more)

### Community 50 - "Water.tsx"
Cohesion: 0.08
Nodes (37): AmbientShadow, box(), BUCKET, bunnyBox(), easeOut(), Glint, LEFT_STYLE, lineColour() (+29 more)

### Community 51 - "Worker Package Manifest"
Cohesion: 0.14
Nodes (14): dependencies, @tiny/core@*, exports, ./lambda, @tiny/core, main, name, private (+6 more)

### Community 52 - "Public Asset Manifest"
Cohesion: 0.12
Nodes (15): artworks, bunny, size, floor, size, fonts, icon-no-photos, size (+7 more)

### Community 53 - "pond-api.ts"
Cohesion: 0.38
Nodes (12): buyPondBait(), claimPondBounty(), errorOf(), exchangePondPearls(), fetchPondBounties(), fetchPondDex(), fetchPondState(), isRecord() (+4 more)

### Community 54 - "hitForVisitor"
Cohesion: 0.10
Nodes (30): POST(), POST(), GET(), POST(), POST(), GET(), PER_VISITOR, BOARDS (+22 more)

### Community 55 - "compose-atelier.mjs"
Cohesion: 0.14
Nodes (9): body, dressLayer, dressWidth, floralWidth, MANNEQUIN_CANVAS, mask, root, sourceSize (+1 more)

### Community 56 - "locations.ts"
Cohesion: 0.26
Nodes (18): discardLocation(), hasUnpublished(), nudgeInRow(), OWNER, placePainting(), PlaceResult, PlaceTarget, publishLocation() (+10 more)

### Community 57 - "pond-format.ts"
Cohesion: 0.13
Nodes (26): PondDex, EXCHANGE_DAILY_STAMPS, EXCHANGE_PEARLS_PER_STAMP, FISH_ART, fishArt(), formatPercent(), formatShortSizeCm(), ODDS_BAIT (+18 more)

### Community 58 - "AccountSheet.tsx"
Cohesion: 0.09
Nodes (27): openAccount(), openBugReport(), fitWidth(), HelpGuide(), HelpGuideProps, POINTER_STEPS, TOUCH_STEPS, GameDesktop() (+19 more)

### Community 59 - "economy/store.ts"
Cohesion: 0.06
Nodes (78): serverSnapshot, useEarnEvents(), CARRY_CAP, carryAdd(), CarryEntry, carryPrune(), carryRemove(), chunk() (+70 more)

### Community 60 - "domain/sketch.ts"
Cohesion: 0.09
Nodes (30): listPieces(), pieceImageUrl(), PieceRow, toPieceDto(), getSketchRound(), planSketchRound(), SKETCH_CHOICES, SketchCandidate (+22 more)

### Community 61 - "room.ts"
Cohesion: 0.12
Nodes (28): socket(), admitted(), Attachment, farewell(), GHOST_MS, HELLO_TIMEOUT_MS, holdsOf(), MAX_WAITING_PER_IP (+20 more)

### Community 62 - "minimap.ts"
Cohesion: 0.06
Nodes (44): ATELIER_END_X, ATELIER_ROOMS, CollectionRoom, ENTRANCE, FormBase, FormSpot, HeadpieceSpot, place() (+36 more)

### Community 63 - "domain/pond.ts"
Cohesion: 0.09
Nodes (41): baitOf(), bountyCatches(), BountyCatchRow, bountyViews(), castPond(), chainPondBait(), claimPondBounty(), exchangePearls() (+33 more)

### Community 64 - "Handoff: move the Tiny Museum bunny from sprite frames to a rig"
Cohesion: 0.12
Nodes (15): BunnyArtist(), BunnyMood, Pencil(), POSES, 1. What is in this bundle, 3. The rig, 4. Suggested plan, 5. Blender-side work still to do (needs Blender; the author has it with an MCP bridge) (+7 more)

### Community 65 - "Sound Effect Assets"
Cohesion: 0.22
Nodes (9): file, kilobytes, seconds, file, kilobytes, seconds, soundEffects, click (+1 more)

### Community 66 - "rooms.ts"
Cohesion: 0.16
Nodes (21): artist(), member(), piece(), randomId(), sealEpoch(), ownershipFor(), personalRoomFor(), publish() (+13 more)

### Community 67 - "Custom HTTP Headers"
Cohesion: 0.25
Nodes (7): applications, appRoot, customHeaders, headers, pattern, key, value

### Community 68 - "Sharp Layer Package"
Cohesion: 0.33
Nodes (6): dependencies, sharp@^0.33.5, description, sharp, name, private

### Community 69 - "Confirmed issues"
Cohesion: 0.11
Nodes (18): Confirmed issues, E2E-002 — Valid edge placement rejected through floating-point precision, E2E-003 — One owned prop can be placed multiple times, E2E-004 — Reload before autosave silently loses the latest placement, E2E-005 — Failed save and failed Done have no visible mobile explanation, E2E-006 — Restoring connectivity does not retry a failed draft save, E2E-007 — Keyboard activation cannot place drawer items, E2E-008 — Creating an account from My Room leaves the signed-in user on the sign-in prompt (+10 more)

### Community 70 - "Other visitors"
Cohesion: 0.29
Nodes (6): How it plays, Other visitors, Privacy, Running it in production, Running it locally, Staying consistent

### Community 71 - "ArrangeControls.tsx"
Cohesion: 0.40
Nodes (9): hangAction(), movePieceAction(), unhangAction(), FloorControls(), move(), unhang(), formFor(), StorageControls() (+1 more)

### Community 72 - "wallet/body.ts"
Cohesion: 0.18
Nodes (15): PER_MEMBER, POST(), baitIdOf(), integerOffset(), isRecord(), itemIdOf(), MAX_CLAIM_BATCH, MAX_WALLET_BODY_BYTES (+7 more)

### Community 73 - "Placement"
Cohesion: 0.13
Nodes (4): Carry, PersonalRoomProps, PlacementLayer, Placement

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
Cohesion: 0.19
Nodes (13): createPresence(), drop(), heartbeat(), maybeSend(), onPageHide(), receive(), scheduleRetry(), send() (+5 more)

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
Cohesion: 0.18
Nodes (9): StageOptions, RoomSound, SoundContext, SoundProvider(), SoundState, EffectName, isPublicPage(), STATIC_BASE (+1 more)

### Community 86 - "Asset pipeline: fast loading without losing sharpness"
Cohesion: 0.22
Nodes (8): Asset pipeline: fast loading without losing sharpness, Character rigs and the Costume Atelier, Completed, Ground rules, Phase 1: fingerprinted files at 2x and 3x, Phase 2: texture atlases for the hall sprites, Phase 3: KTX2 (Basis Universal), built and switched off, Phase 4: ThumbHash placeholders for paintings

### Community 87 - "Guest Board SQL Schema"
Cohesion: 0.67
Nodes (3): guest_notes, guest_notes_visible, rate_limits

### Community 88 - "Landscape Frame Asset"
Cohesion: 0.67
Nodes (3): frameLandscape, size, window

### Community 89 - "db-tests/pond.test.ts"
Cohesion: 0.16
Nodes (11): CatchExtra, COLUMNS, insertCatch(), member(), namedMember(), randomId(), StatePatch, getPondDex() (+3 more)

### Community 93 - "json"
Cohesion: 0.12
Nodes (44): POST(), POST(), POST(), PER_MEMBER, PUT(), PER_MEMBER, POST(), catchIdOf() (+36 more)

### Community 94 - "outbox.test.ts"
Cohesion: 0.29
Nodes (10): OUTBOX_CAP, outboxAdd(), OutboxEntry, outboxFail(), outboxRemove(), RETRY_BASE_MS, RETRY_MAX_MS, retryDelay() (+2 more)

### Community 95 - "pond/room.ts"
Cohesion: 0.12
Nodes (23): FAR_LIFT, FAR_SCALE, liftAt(), pathHalfWidth(), pathX(), PondPath, scaleAt(), path (+15 more)

### Community 96 - "ticket/route.ts"
Cohesion: 0.10
Nodes (40): PER_MEMBER, PUT(), Code, 3.2 Chosen names (members), registry, started(), verifyPassword(), canonicalEmail() (+32 more)

### Community 104 - "createStage"
Cohesion: 0.05
Nodes (37): ArtCache, ArtCacheOptions, createArtCache(), drop(), expireLater(), hold(), HeldArt, LoadResult (+29 more)

### Community 105 - "FishingView.tsx"
Cohesion: 0.11
Nodes (18): CONFETTI_COLORS, ConfettiPiece, makeConfetti(), RevealCard(), RevealCardProps, TIER_MS, TIER_SFX, useCountUp() (+10 more)

### Community 106 - "ticket.ts"
Cohesion: 0.23
Nodes (12): decoder, encoder, fromBase64Url(), HmacKey, isOwn(), isTicket(), keyFor(), keys (+4 more)

### Community 107 - "catalog.ts"
Cohesion: 0.24
Nodes (12): refresh(), CatalogItem, CatalogKind, FREE_CHARACTERS, isBuyable(), isCatalogItem(), ITEMS, ItemSlot (+4 more)

### Community 108 - "MuseumStage.tsx"
Cohesion: 0.08
Nodes (22): MuseumLayout(), CoinToast(), Toast, Purse(), Stamp(), WalletProvider(), useWallet(), STAMP_SVG (+14 more)

### Community 109 - "lib/presence.ts"
Cohesion: 0.09
Nodes (21): Outcome, Connect, fetchTicket, HEARTBEAT_MS, HIDDEN_LIMIT_MS, RETRY_MS, sameLook(), samePose() (+13 more)

### Community 110 - "graftCostume"
Cohesion: 0.27
Nodes (14): canvasFit(), compose(), graftCostume(), copyAccessor(), copyMaterial(), copyMesh(), copyTexture(), copyView() (+6 more)

### Community 111 - "FishingView.tsx"
Cohesion: 0.18
Nodes (23): buyPondBait(), CastOptions, castPond(), chainPondBait(), errorOf(), fetchPondState(), isRecord(), memberId() (+15 more)

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
Cohesion: 0.19
Nodes (18): fetch(), Env, isItem(), isName(), isPid(), isSeq(), MAX_HOLDS, MAX_MESSAGE_BYTES (+10 more)

### Community 119 - "Costume gallery doorway"
Cohesion: 0.50
Nodes (3): Costume gallery doorway, Curtain colour edit, Prompt

### Community 120 - "LeaderboardPanel.tsx"
Cohesion: 0.17
Nodes (19): fetchPondLeaderboard(), PondBoardId, PondBoardPeriod, PondBoardRow, PondBounty, PondBountyClaim, PondDexCell, PondExchangeResult (+11 more)

### Community 121 - "Fishing forest: painted asset pass"
Cohesion: 0.11
Nodes (17): Assets, Bruce's collection refresh (2026-11-08), Fishing forest illustrations, Made by hand (not touched by the script), Monets Lily Pond (2026-11-08), 1. Forest doorway, 2. Woodland noticeboard, 3. Fisherman and bait basket (+9 more)

### Community 124 - "The Costume Atelier"
Cohesion: 0.13
Nodes (14): Adding a character, Adding a costume, Art not supplied as files, Bruce's Chronicles, Checked against the mocks (2026-11-07), Code, Costume fit review, Fitting clothes to other characters (+6 more)

### Community 125 - "formatInteger"
Cohesion: 0.50
Nodes (9): refreshWalletNow(), formatInteger(), setPondState(), claim(), BaitShop(), buy(), Exchange(), exchange() (+1 more)

### Community 126 - "rig.ts"
Cohesion: 0.04
Nodes (82): CrowdPreviewPage(), RigPreviewPage(), CrowdPreview(), draw(), KINDS, Stats, Window, NEXT (+74 more)

### Community 127 - "Curating the paintings (2026-11-07)"
Cohesion: 0.13
Nodes (14): 1. The registry and the table, 2. The studio's Location picker, 3. The rooms draw what is placed, 4. Credits, 5. Retiring self-serve artists, Building it, Curating the paintings (2026-11-07), Decided (+6 more)

### Community 128 - "Pedestal"
Cohesion: 0.14
Nodes (4): Helm, createNotes(), createPedestal(), Pedestal

### Community 129 - "presence/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, types, exclude, extends, include, ../../tsconfig.base.json

### Community 130 - "memberFromRequest"
Cohesion: 0.48
Nodes (5): GET(), GET(), memberFromRequest(), readSlots(), exportWallet()

### Community 131 - "tsconfig.test.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 132 - "app/layout.tsx"
Cohesion: 0.11
Nodes (19): bethEllen, inspiratiq, metadata, notoSans, RootLayout(), sniglet, viewport, AccountHost() (+11 more)

### Community 133 - "messages.ts"
Cohesion: 0.31
Nodes (7): checkMessage(), INVISIBLE, MESSAGE_MAX, MessageCheck, normalizeMessage(), hasProfanity(), matcher

### Community 134 - "lib/presence.ts"
Cohesion: 0.09
Nodes (12): Entry, INTERPOLATION_DELAY_MS, PEER_TIMEOUT_MS, PeerTable, positionAt(), RemoteVisitor, Sample, look (+4 more)

### Community 135 - "db.ts"
Cohesion: 0.21
Nodes (8): closePool(), getPool(), poolConfig(), sslFor(), RateLimit, RateLimitResult, RDS_CA_BUNDLE, pg

### Community 136 - "backend.ts"
Cohesion: 0.15
Nodes (12): amplifyDir, backend, everyMinutes, mediaBucket, missing, repoRoot, REQUIRED, setting() (+4 more)

### Community 137 - "stage.ts"
Cohesion: 0.03
Nodes (50): CameraRig, Carried, Character, cutRooms(), Matcha, Viewport, createPixelRatioGovernor(), PIXEL_RATIO_STEPS (+42 more)

### Community 138 - "hall/room.ts"
Cohesion: 0.06
Nodes (67): Assets, Scenery, createBackdrop(), CUTS, disposeBoards(), Mark, plane(), ROPE_CUTS (+59 more)

### Community 139 - "epoch.ts"
Cohesion: 0.23
Nodes (14): GET(), intParam(), GET(), sketchPool, unavailable(), currentEpoch(), ensureEpoch(), epochById() (+6 more)

### Community 140 - "Item"
Cohesion: 0.13
Nodes (4): Room, Presence, Item, Refusal

### Community 141 - "sketchguess/lib/api.ts"
Cohesion: 0.23
Nodes (13): sameOriginUrl(), PreparedGame, decodeImage(), fetchBitmap(), fetchRound(), guarded(), LoadedRound, loadInk() (+5 more)

### Community 142 - "visits.ts"
Cohesion: 0.08
Nodes (38): PER_VISITOR, POST(), amount(), duration(), dynamic, LANDMARKS, PAGES, RANGES (+30 more)

### Community 143 - "Conn"
Cohesion: 0.31
Nodes (4): connectWebSocket(), SocketHandlers, Conn, message()

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
Cohesion: 0.10
Nodes (33): BaitTrayProps, debugSpecies(), debugTokens(), debugVariant(), GuestRoll, GuestRollOptions, guestTreasure(), rollGuest() (+25 more)

### Community 149 - "validatePlacements"
Cohesion: 0.20
Nodes (10): prop(), 1. Items placed against a zone edge fail to save, and the whole draft reverts, 2. One owned item can be placed many times, 3. Any save rejection throws away all unsaved work, 4. Changes made just before leaving are lost, 5. Fish trophies can be claimed without playing, High, Design for Phases 5–7 (2026-11-05) (+2 more)

### Community 150 - "placeLabel"
Cohesion: 0.07
Nodes (13): CafeLink, ComingSoonNote, FunZoneSign, GiftShopSigns, GuestBoardNotes, Placards, placeLabel(), toScreen() (+5 more)

### Community 151 - "pond-state.ts"
Cohesion: 0.19
Nodes (16): PondStateView, PondTier, ensurePondStateStarted(), getPondStateSnapshot(), GUEST, listeners, LOADING, PondStateSnapshot (+8 more)

### Community 152 - ".webSocketMessage"
Cohesion: 0.44
Nodes (3): attachmentOf(), Room, sendTo()

### Community 153 - "AssetImage"
Cohesion: 0.08
Nodes (40): BoardScreen(), BoardScreenProps, ComposeScreen(), ComposeScreenProps, blankDraft(), GuestBoard(), GuestBoardProps, View (+32 more)

### Community 155 - "share.ts"
Cohesion: 0.33
Nodes (5): ShareOutcome, shareResult(), ShareSummary, shareText(), base

### Community 157 - "Walkthrough.tsx"
Cohesion: 0.11
Nodes (27): MoreArrow(), NavArrow(), Props, SLIDE, Walkthrough(), XIcon(), decodedFrames, frameFor() (+19 more)

### Community 158 - "createPondRoom"
Cohesion: 0.32
Nodes (13): createPondRoom(), approach(), busy(), finishWalk(), goTo(), leave(), move(), nearest() (+5 more)

### Community 159 - "createPlacementLayer"
Cohesion: 0.18
Nodes (8): aspectOf(), createPlacementLayer(), drawOutline(), dropHelper(), sizeOf(), PlacementTheme, Phase 5: themes, zones and arrangements, ThemeSpec

### Community 160 - "a/[slug]/page.tsx"
Cohesion: 0.31
Nodes (6): ArtistPage(), dynamic, generateMetadata(), GET(), FollowForm(), getArtistPage()

### Community 161 - "performance/page.tsx"
Cohesion: 0.27
Nodes (9): dynamic, format(), grade(), METRICS, PAGES, PerformancePage(), RANGES, summarizeVitals() (+1 more)

### Community 162 - "Local end-to-end stress test — 2026-11-06"
Cohesion: 0.22
Nodes (7): Environment and coverage, Follow-up coverage, Issue index, Local end-to-end stress test — 2026-11-06, Measured load, Passing checks and interpretation limits, Test data and cleanup

### Community 163 - "painting-open"
Cohesion: 0.50
Nodes (4): file, kilobytes, seconds, painting-open

### Community 165 - "Multiplayer ("other visitors") — plan v2 (Cloudflare)"
Cohesion: 0.14
Nodes (13): ScreenChrome(), 0. Summary, 10. Decisions, 1. Product contract changes (approved 2026-10-31), 2. What already exists that this builds on, 3.1 Generated names (everyone has one), 3. Names, 5.1 Emotes (v1) (+5 more)

### Community 167 - "BountyPanel.tsx"
Cohesion: 0.36
Nodes (8): PondBounties, formatCountdown(), nextUtcMidnight(), utcDayLabel(), useCountdown(), useNow(), BountyPanel(), dayLabel()

### Community 168 - "audience.ts"
Cohesion: 0.09
Nodes (29): ALLOWED, POST(), GET(), AnalyticsPage(), dynamic, registerAction(), BRAND, analyticsFor() (+21 more)

### Community 169 - "icon-basket"
Cohesion: 0.67
Nodes (3): icon-basket, file, vector

### Community 170 - "reveal.ts"
Cohesion: 0.17
Nodes (9): PlaceInfo, InkMap, planGame(), ROUND_SPREAD, createReveal(), compose(), PENCIL, SketchReveal (+1 more)

### Community 171 - "next"
Cohesion: 0.18
Nodes (15): Loading(), dynamic, Hall(), MuseumPage(), CurrentlyShowing(), dynamic, GUIDELINES, LandingPage() (+7 more)

### Community 174 - "lib/slots/index.ts"
Cohesion: 0.08
Nodes (27): PresencePreviewPage(), AccountSheet(), continueAnyway(), doSignOut(), runDelete(), runName(), submit(), submitDelete() (+19 more)

### Community 179 - "confirm/page.tsx"
Cohesion: 0.33
Nodes (7): ConfirmFollow(), dynamic, dynamic, Unsubscribe(), FollowNotice(), confirmFollow(), unsubscribe()

### Community 180 - "wardrobe.ts"
Cohesion: 0.06
Nodes (51): AtelierPage(), dynamic, metadata, allowedCharacter(), OwnedSnapshot, owns(), walletReady(), STAMP_ASPECT (+43 more)

### Community 183 - "run.ts"
Cohesion: 0.20
Nodes (7): admin, childEnv, client, database, fresh, migrations, target

### Community 186 - "4. Transport: Cloudflare Durable Objects"
Cohesion: 0.25
Nodes (8): 4. Transport: Cloudflare Durable Objects, Decision (2026-10-31), Deploying, Identity cannot be forged, Local development and tests, Rooms and capacity, Shape of `apps/presence` (about 200 lines), main()

### Community 187 - "getStorage"
Cohesion: 0.13
Nodes (15): CONTENT_TYPES, GET(), PUT(), ACCEPTED, createAssetFromUpload(), MAX_UPLOAD_BYTES, presignUpload(), registerUpload() (+7 more)

### Community 191 - "useSoundEffects.ts"
Cohesion: 0.18
Nodes (17): EFFECTS, EffectSpec, FOOTSTEPS, SoundEffects, useSoundEffects(), gestured(), OPTIONS, applyMix() (+9 more)

### Community 192 - "Low"
Cohesion: 0.10
Nodes (21): 10. Long names run off the name sign, 11. The rooms API skips the stale-tab member check, 12. The bunny is dragged along while you pan in Decorate, 13. Pages that redirect or don't exist answer 200, 14. Error codes reveal which room slugs exist, 15. The name sign slides under the top-right buttons in Decorate, 16. Level-up celebrations can be farmed, 17. No hint of where things are after panning away (+13 more)

### Community 193 - "Monets Lily Pond: exploration, UX and multiplayer QA"
Cohesion: 0.29
Nodes (6): Browser and interaction coverage, Changes made from the walkthrough, Monets Lily Pond: exploration, UX and multiplayer QA, Multiplayer and load, Practical limits, Regression checks and cleanup

## Knowledge Gaps
- **5 isolated node(s):** `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1332 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **28 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `AccountSheet.tsx` to `actions.ts`, `SketchGuess.tsx`, `app/layout.tsx`, `machine.ts`, `PondRoom.tsx`, `Test Fakes and Helpers`, `visits.ts`, `join-room.ts`, `tables.ts`, `pond-state.ts`, `logic.ts`, `AssetImage`, `Museum.tsx`, `Walkthrough.tsx`, `Web Package Dependencies`, `a/[slug]/page.tsx`, `slots/store.ts`, `risk.ts`, `BountyPanel.tsx`, `bug-reports.ts`, `PondTicker.tsx`, `next`, `lib/slots/index.ts`, `ColorRecall.tsx`, `Water.tsx`, `wardrobe.ts`, `pond-format.ts`, `economy/store.ts`, `useSoundEffects.ts`, `ArrangeControls.tsx`, `SoundProvider.tsx`, `FishingView.tsx`, `MuseumStage.tsx`, `LeaderboardPanel.tsx`, `rig.ts`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **What connects `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json` to the rest of the system?**
  _5 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `actions.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0710868079289132 - nodes in this community are weakly interconnected._
- **Why does `three` connect `hall/room.ts` to `scene/assets.ts`, `stage.ts`, `cozy.ts`, `pond/art.ts`, `hit.ts`, `wardrobe.ts`, `hang-tag.ts`, `Traversal`, `Web Package Dependencies`, `prepare-models.mjs`, `ambience.ts`, `rig.ts`, `pond/room.ts`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Should `walk.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12561576354679804 - nodes in this community are weakly interconnected._
- **Why does `esbuild` connect `Root Package Manifest` to `room.ts`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Should `SketchGuess.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1396011396011396 - nodes in this community are weakly interconnected._