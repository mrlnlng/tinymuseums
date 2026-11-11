# Graph Report - tiny-museum  (2026-11-10)

## Corpus Check
- 487 files · ~257,722 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 78 file(s) not represented in the graph (top: .avif 39, .glb 30, .css 4)

## Summary
- 4206 nodes · 10914 edges · 188 communities (158 shown, 30 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 197 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d93888cf`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- actions.ts
- tab-turn.ts
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
- scene.ts
- cozy.ts
- currentMember
- join-room.ts
- createAtelierRoom
- ref_node_assert
- amplify/package.json
- atelier.ts
- prepare-models.mjs
- Traversal
- core/package.json
- hit
- logic.ts
- personal/room.ts
- Museum.tsx
- PersonalRoom.tsx
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
- next
- db-tests/pond.test.ts
- FakeServer
- handlers.ts
- Water.tsx
- Worker Package Manifest
- Public Asset Manifest
- pond-api.ts
- hitForVisitor
- compose-atelier.mjs
- Carried
- pond-format.ts
- AccountSheet.tsx
- economy/store.ts
- domain/sketch.ts
- room.ts
- minimap.ts
- db-tests/pond.test.ts
- Handoff: move the Tiny Museum bunny from sprite frames to a rig
- Sound Effect Assets
- locations.ts
- Custom HTTP Headers
- Sharp Layer Package
- earn
- Other visitors
- ArrangeControls.tsx
- wallet/body.ts
- FilesystemStorage
- Visits SQL Schema
- Bunny Walk Sprites
- Room Mockup Settings
- Service Worker Caching
- HallCallbacks
- RemoteVisitors
- createPresence
- members
- Frame Window Asset
- bug-report.ts
- presence/package.json
- features/economy/index.ts
- Asset pipeline: fast loading without losing sharpness
- Guest Board SQL Schema
- Landscape Frame Asset
- art-cache.ts
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
- lib/assets.ts
- AtelierKeeps.tsx
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
- PondPanels.tsx
- rig.ts
- Curating the paintings (2026-11-07)
- nearby.ts
- presence/tsconfig.json
- limited
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
- carry.test.ts
- The Moonlit Pond — design
- Pond rework
- env.ts
- Orchestration contract — you plan, DSH workers execute
- tables.ts
- RoomContents
- placeLabel
- pond-state.ts
- .webSocketMessage
- AssetImage
- Context
- share.ts
- Sitting
- Walkthrough.tsx
- createPondRoom
- MuseumStage.tsx
- gesture.ts
- EventTargetLike
- painting-open
- Multiplayer ("other visitors") — plan v2 (Cloudflare)
- BountyPanel.tsx
- audience.ts
- icon-basket
- reveal.ts
- next
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
- Confirmed issues
- Monets Lily Pond: exploration, UX and multiplayer QA
- PerfMeter
- Lobby
- Minimap
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
8. `three` - 41 edges
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
- `Where things stand` --references--> `sealEpoch()`  [INFERRED]
  docs/curation-plan.md → packages/core/src/domain/epoch.ts

## Import Cycles
- None detected.

## Communities (188 total, 30 thin omitted)

### Community 0 - "actions.ts"
Cohesion: 0.06
Nodes (74): AnalyticsPage(), dynamic, BugReportsPage(), dateFormat, dynamic, summary(), dynamic, GalleryPage() (+66 more)

### Community 1 - "tab-turn.ts"
Cohesion: 0.16
Nodes (5): createTabTurn(), TabTurn, tab(), TurnEnv, TurnMessage

### Community 2 - "SketchGuess.tsx"
Cohesion: 0.14
Nodes (25): bestKeyFor(), BURST, clueUrl(), openingPlan(), Phase, pickAtRandom(), prepareSketchGame(), readDifficulty() (+17 more)

### Community 3 - "themes.ts"
Cohesion: 0.07
Nodes (30): COLLECTIONS, 1. Items placed against a zone edge fail to save, and the whole draft reverts, 2. One owned item can be placed many times, 3. Any save rejection throws away all unsaved work, 4. Changes made just before leaving are lost, 5. Fish trophies can be claimed without playing, High, GAMES (+22 more)

### Community 4 - "jobs.ts"
Cohesion: 0.23
Nodes (16): loop(), shutdown(), sleep(), sweepStale(), DrainResult, handler(), repairFrames(), repairUnframed() (+8 more)

### Community 5 - "round.ts"
Cohesion: 0.16
Nodes (26): deltaE(), GAMUT_EPSILON, hexToOklab(), inGamut(), linearRgbToOklab(), linearToSrgb(), Oklab, oklabToLinearRgb() (+18 more)

### Community 6 - "floor.ts"
Cohesion: 0.07
Nodes (47): clone(), closestOnSegment(), contains(), cross(), crossVec(), depthAtY(), depthBounds(), depthT() (+39 more)

### Community 7 - "Core Asset Manifest"
Cohesion: 0.05
Nodes (41): artworks, audio, file, megabytes, seconds, sourceName, startedAt, bunny (+33 more)

### Community 8 - "scene/assets.ts"
Cohesion: 0.07
Nodes (51): AssetManifest, assetUrl(), bitmapTexture(), blankImage(), CAFE_CAT_FRAMES, CompressedLoader, elementTexture(), ENTRANCE_FILES (+43 more)

### Community 9 - "SyncStore"
Cohesion: 0.16
Nodes (3): deepEq(), SyncStore, upgrade()

### Community 10 - "machine.ts"
Cohesion: 0.12
Nodes (35): CastMeter(), ReelMeter(), armCast(), BITE_WINDOW, biteGap(), CHARGE_PERIOD, chargePower(), createFishingState() (+27 more)

### Community 11 - "PondRoom.tsx"
Cohesion: 0.11
Nodes (19): Loading(), Loading(), metadata, PondPage(), AtelierLoading(), revealFloorTransition(), Minigame, MINIGAMES (+11 more)

### Community 12 - "Test Fakes and Helpers"
Cohesion: 0.11
Nodes (28): deferredFetch(), deviceSlot, FakeEvents, FakeStorage, fixture, fixtureB, fixtureRegistry, fixtureRegistryBoth (+20 more)

### Community 13 - "scene.ts"
Cohesion: 0.04
Nodes (29): disposeDisplayTexture(), HELM_PEDESTAL_FILE, prefersAvif(), HiddenCoin, Helm, cafeAfterIndex(), comingSoonWidth(), computeLayout() (+21 more)

### Community 14 - "cozy.ts"
Cohesion: 0.09
Nodes (29): aspectOf(), ATELIER_PROPS, AtelierImage, canvasTexture(), CozyBackdrop, cozyPropImageUrl(), createPlacementLayer(), drawOutline() (+21 more)

### Community 15 - "currentMember"
Cohesion: 0.15
Nodes (22): GET(), GET(), PER_MEMBER, GET(), PER_MEMBER, GET(), PER_MEMBER, PER_MEMBER (+14 more)

### Community 16 - "join-room.ts"
Cohesion: 0.19
Nodes (25): ChatButton(), REFUSED, joinRoom(), emit(), getPeople(), isInRoom(), isMuted(), muted (+17 more)

### Community 17 - "createAtelierRoom"
Cohesion: 0.21
Nodes (20): aspectOf(), AtelierActions, createAtelierRoom(), buildCollection(), form(), buildEntrance(), buildRoom(), picture() (+12 more)

### Community 18 - "ref_node_assert"
Cohesion: 0.11
Nodes (28): defineSlot(), docBytes(), SLOTS, byAtThenKey(), encoded(), latest, mapOf(), maxNumber() (+20 more)

### Community 19 - "amplify/package.json"
Cohesion: 0.17
Nodes (14): devDependencies, @aws-amplify/backend@^1.14.0, @aws-amplify/backend-cli@^1.6.0, aws-cdk-lib@^2.180.0, constructs@^10.3.0, name, private, scripts (+6 more)

### Community 20 - "atelier.ts"
Cohesion: 0.05
Nodes (38): AtelierArt, AtelierImage, BuiltRoom, Cardigan, CARDIGAN_NAMES, CHARACTER_NAMES, Control, refresh() (+30 more)

### Community 21 - "prepare-models.mjs"
Cohesion: 0.15
Nodes (18): paintedCostume(), atelier, bunny, floralOutfits(), goldOutfits(), HEADPIECES, image(), manifest (+10 more)

### Community 22 - "Traversal"
Cohesion: 0.10
Nodes (7): coverFloorTransition(), createRoomPassage(), fixture(), clamp(), fixture(), jump(), Traversal

### Community 23 - "core/package.json"
Cohesion: 0.06
Nodes (41): dependencies, @aws-sdk/client-s3@^3.1121.0, @aws-sdk/s3-request-presigner@^3.1121.0, bcryptjs@^2.4.3, obscenity@^0.4.6, pg@^8.13.1, sharp@^0.33.5, thumbhash@^0.1.1 (+33 more)

### Community 24 - "hit"
Cohesion: 0.23
Nodes (14): GET(), GET(), roomEditor, PER_EDITOR, PUT(), versionOf(), PER_EDITOR, POST() (+6 more)

### Community 25 - "logic.ts"
Cohesion: 0.08
Nodes (32): loadHallArranger(), DecorDrawer, DecorDrawerProps, SharingState, Tab, TABS, HallArranger(), HallArrangerProps (+24 more)

### Community 26 - "personal/room.ts"
Cohesion: 0.05
Nodes (10): Carry, PersonalRoomProps, DecorController, DOOR_SIGN, NAME_SIGN, PersonalRoomOptions, cozyTheme, GhostOptions (+2 more)

### Community 27 - "Museum.tsx"
Cohesion: 0.12
Nodes (28): fetchPage(), Options, PostRejected, useGuestNotes(), CoinFound, ColorRecall, GameDesktop, GuestBoard (+20 more)

### Community 28 - "PersonalRoom.tsx"
Cohesion: 0.11
Nodes (28): errorReason(), overDrawer(), PersonalRoom(), canPlaceNew(), carryEnd(), carryMove(), onCardKey(), onCardPointerDown() (+20 more)

### Community 29 - "core/src/index.ts"
Cohesion: 0.06
Nodes (85): PondBoardMe, PondBoardRow, PondFeedItem, Rep, BountyCatchRow, getPondBounties(), ONCE, PondBaitResult (+77 more)

### Community 30 - "Web Package Dependencies"
Cohesion: 0.07
Nodes (33): dependencies, embla-carousel-react@^8.6.0, motion@^13.1.1, next@^15.0.3, react@^19.0.0, react-dom@^19.0.0, swr@^2.5.1, three@^0.169.0 (+25 more)

### Community 31 - "Gamifying Tiny Museum — genre direction & engagement research"
Cohesion: 0.10
Nodes (19): 0.1 The core experience, 0.2 Systems that make gamification cheap to build, 0.3 Constraints that shape any recommendation, 0. What the game is today (the deep dive), 1.1 The landscape (seven candidates, with verdicts), 1.2 Recommendation: a **cozy gallery life-sim** — "the gallery you live in", 1.3 The five design pillars the genre implies, 1. Genre direction (+11 more)

### Community 32 - "wardrobe.test.ts"
Cohesion: 0.07
Nodes (12): AtelierRoom, ClothingItem, createWardrobe(), enqueue(), reflect(), Options, bow, dress (+4 more)

### Community 33 - "slots/store.ts"
Cohesion: 0.18
Nodes (19): ANON_PREFIX, anonKey(), deviceKey(), encodeStored(), isMemberSlotKey(), listKeys(), MEMBER_KEY, memberKey() (+11 more)

### Community 34 - "risk.ts"
Cohesion: 0.13
Nodes (28): Hud(), HudProps, HudWagerChip, WagerPicker(), chooseTier(), WagerPickerProps, chainChipLabel(), clampWagerStake() (+20 more)

### Community 35 - "amplify/tsconfig.json"
Cohesion: 0.20
Nodes (9): compilerOptions, module, moduleResolution, noUnusedLocals, noUnusedParameters, exclude, extends, include (+1 more)

### Community 36 - "5. Customization menu — what other people are doing"
Cohesion: 0.12
Nodes (16): 1. The target: what "Claude Opus 5.5" actually means, 2. Where your harness stands today (live config I read), 3. The honest gap model, 4. Quality levers, ranked by leverage, 5. Customization menu — what other people are doing, 6. Recommended starting kit for *your* profile, 7. What I can apply for you right now (needs your go-ahead), A. Prompt & persona (most common quality customizations) (+8 more)

### Community 37 - "wallet.ts"
Cohesion: 0.08
Nodes (43): member(), now, piece(), randomId(), today, applyClaim(), baitCounts(), baitOf() (+35 more)

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
Cohesion: 0.08
Nodes (37): POST(), GET(), POST(), rateLimitedResponse(), rejectedResponse(), MAX_BUG_CONTACT, MAX_BUG_ERRORS, MAX_BUG_MESSAGE (+29 more)

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

### Community 46 - "next"
Cohesion: 0.17
Nodes (17): GET(), PaintingRow, POST(), UPLOADS_PER_ARTIST, POST(), UPLOADS_PER_ARTIST, dynamic, RoomPage() (+9 more)

### Community 47 - "db-tests/pond.test.ts"
Cohesion: 0.09
Nodes (29): CatchExtra, COLUMNS, insertCatch(), member(), namedMember(), randomId(), StatePatch, compare() (+21 more)

### Community 48 - "FakeServer"
Cohesion: 0.18
Nodes (3): FakeServer, SlotState, SlotDef

### Community 49 - "handlers.ts"
Cohesion: 0.07
Nodes (30): sealEpoch(), handleDerivatives(), handleRenderDisplay(), handleSealEpoch(), renderPieceFrame(), renderPieceSketch(), FRAME_FORMAT, FRAME_VERSION (+22 more)

### Community 50 - "Water.tsx"
Cohesion: 0.07
Nodes (38): AmbientShadow, box(), BUCKET, bunnyBox(), easeOut(), Glint, LEFT_STYLE, lineColour() (+30 more)

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
Cohesion: 0.17
Nodes (19): POST(), GLOBAL, PER_IP, POST(), POST(), GET(), PER_VISITOR, BOARDS (+11 more)

### Community 55 - "compose-atelier.mjs"
Cohesion: 0.14
Nodes (9): body, dressLayer, dressWidth, floralWidth, MANNEQUIN_CANVAS, mask, root, sourceSize (+1 more)

### Community 57 - "pond-format.ts"
Cohesion: 0.13
Nodes (26): PondDex, EXCHANGE_DAILY_STAMPS, EXCHANGE_PEARLS_PER_STAMP, FISH_ART, fishArt(), formatPercent(), formatShortSizeCm(), ODDS_BAIT (+18 more)

### Community 58 - "AccountSheet.tsx"
Cohesion: 0.08
Nodes (32): AccountHost(), AccountSheet, onOpenAccount(), openAccount(), ColorRecall(), ColorRecallProps, Phase, readBest() (+24 more)

### Community 59 - "economy/store.ts"
Cohesion: 0.15
Nodes (30): buy(), cappedTracked, EMPTY_BAIT, EMPTY_TODAY, ensureStarted(), eventListeners, flushOnce(), flushOutbox() (+22 more)

### Community 60 - "domain/sketch.ts"
Cohesion: 0.09
Nodes (34): listPieces(), pieceImageUrl(), PieceRow, toPieceDto(), GalleryPiece, GalleryRow, planSketchRound(), SKETCH_CHOICES (+26 more)

### Community 61 - "room.ts"
Cohesion: 0.12
Nodes (28): socket(), admitted(), Attachment, farewell(), GHOST_MS, HELLO_TIMEOUT_MS, holdsOf(), MAX_WAITING_PER_IP (+20 more)

### Community 62 - "minimap.ts"
Cohesion: 0.09
Nodes (33): place(), ATELIER_DOOR, createMinimap(), draw(), drawRoom(), floors(), follow(), sketchOf() (+25 more)

### Community 63 - "db-tests/pond.test.ts"
Cohesion: 0.16
Nodes (28): addBait(), baitOf(), bountyCatches(), bountyViews(), buyPondBait(), castPond(), chainPondBait(), claimPondBounty() (+20 more)

### Community 64 - "Handoff: move the Tiny Museum bunny from sprite frames to a rig"
Cohesion: 0.15
Nodes (11): 1. What is in this bundle, 2. How the game draws the bunny today (read from the repo, not run), 3. The rig, 5. Blender-side work still to do (needs Blender; the author has it with an MCP bridge), 6. Open questions for the author, Handoff: move the Tiny Museum bunny from sprite frames to a rig, Approved v4 bunny in the hall, Assets (+3 more)

### Community 65 - "Sound Effect Assets"
Cohesion: 0.22
Nodes (9): file, kilobytes, seconds, file, kilobytes, seconds, soundEffects, click (+1 more)

### Community 66 - "locations.ts"
Cohesion: 0.12
Nodes (37): artist(), member(), piece(), randomId(), discardLocation(), hasUnpublished(), locationStates(), nudgeInRow() (+29 more)

### Community 67 - "Custom HTTP Headers"
Cohesion: 0.25
Nodes (7): applications, appRoot, customHeaders, headers, pattern, key, value

### Community 68 - "Sharp Layer Package"
Cohesion: 0.33
Nodes (6): dependencies, sharp@^0.33.5, description, sharp, name, private

### Community 69 - "earn"
Cohesion: 0.31
Nodes (10): earn(), emit(), emitEarned(), maybeInvite(), writeSession(), tap(), enterAtelier(), tap() (+2 more)

### Community 70 - "Other visitors"
Cohesion: 0.29
Nodes (6): How it plays, Other visitors, Privacy, Running it in production, Running it locally, Staying consistent

### Community 71 - "ArrangeControls.tsx"
Cohesion: 0.27
Nodes (12): hangAction(), movePieceAction(), unhangAction(), FloorControls(), move(), unhang(), formFor(), StorageControls() (+4 more)

### Community 72 - "wallet/body.ts"
Cohesion: 0.18
Nodes (16): PER_MEMBER, POST(), baitIdOf(), integerOffset(), isRecord(), itemIdOf(), MAX_CLAIM_BATCH, MAX_WALLET_BODY_BYTES (+8 more)

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

### Community 80 - "createPresence"
Cohesion: 0.16
Nodes (15): createPresence(), drop(), heartbeat(), maybeSend(), onPageHide(), receive(), scheduleRetry(), send() (+7 more)

### Community 81 - "members"
Cohesion: 0.12
Nodes (25): coin_claims, coin_claims_daily, wallet_bait, wallet_items, wallets, member_sessions, member_sessions_member, member_slots (+17 more)

### Community 82 - "Frame Window Asset"
Cohesion: 0.50
Nodes (4): frame, size, window, windowAspect

### Community 83 - "bug-report.ts"
Cohesion: 0.23
Nodes (13): BugReportHost(), BugReportSheet, BugReportSheet(), send(), Status, collectContext(), inAppBrowser(), onOpenBugReport() (+5 more)

### Community 84 - "presence/package.json"
Cohesion: 0.14
Nodes (16): dependencies, @tiny/core@*, devDependencies, @cloudflare/workers-types@5.20261016.1, wrangler@4.151.1, @tiny/core, name, private (+8 more)

### Community 85 - "features/economy/index.ts"
Cohesion: 0.18
Nodes (17): serverSnapshot, useEarnEvents(), buildClaim(), BuiltClaim, EarnDetail, EarnSource, GameSource, newRunId() (+9 more)

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
Cohesion: 0.13
Nodes (10): ArtCache, ArtCacheOptions, createArtCache(), drop(), expireLater(), hold(), HeldArt, LoadResult (+2 more)

### Community 93 - "json"
Cohesion: 0.13
Nodes (34): POST(), POST(), GLOBAL, PER_IP, POST(), POST(), PER_MEMBER, PUT() (+26 more)

### Community 94 - "outbox.test.ts"
Cohesion: 0.27
Nodes (12): ClaimRequest, OUTBOX_CAP, outboxAdd(), outboxDue(), OutboxEntry, outboxFail(), outboxRemove(), RETRY_BASE_MS (+4 more)

### Community 95 - "pond/room.ts"
Cohesion: 0.08
Nodes (34): ArtByRoom, colorAt(), disposePondArt(), EDGE_BAND, EDGE_BANDS, EDGE_OVERLAP, edgeTexture(), imageOf() (+26 more)

### Community 96 - "ticket/route.ts"
Cohesion: 0.10
Nodes (41): Code, 3.2 Chosen names (members), registry, started(), AuthedArtist, hashPassword(), newToken(), uniqueSlug() (+33 more)

### Community 104 - "createStage"
Cohesion: 0.15
Nodes (22): boundedCameraX(), createNearby(), createStage(), closeEntry(), enter(), initialize(), aim(), drawFrame() (+14 more)

### Community 105 - "FishingView.tsx"
Cohesion: 0.12
Nodes (15): CONFETTI_COLORS, ConfettiPiece, makeConfetti(), RevealCard(), TIER_MS, TIER_SFX, useCountUp(), chainOffer (+7 more)

### Community 106 - "ticket.ts"
Cohesion: 0.14
Nodes (18): fetch(), Env, parseRoom(), decoder, encoder, fromBase64Url(), HmacKey, isOwn() (+10 more)

### Community 107 - "lib/assets.ts"
Cohesion: 0.17
Nodes (15): Loading(), DENSITY_MEDIA, HallPreload(), HallSkeleton(), assetCssVariables(), assetEntry, AtlasGroup, AtlasSheet (+7 more)

### Community 108 - "AtelierKeeps.tsx"
Cohesion: 0.17
Nodes (12): MuseumLayout(), CoinToast(), Toast, Purse(), Stamp(), WalletProvider(), STAMP_ASPECT, STAMP_SVG (+4 more)

### Community 109 - "lib/presence.ts"
Cohesion: 0.13
Nodes (13): Connect, connectWebSocket(), HEARTBEAT_MS, HIDDEN_LIMIT_MS, SocketHandlers, Clock, Conn, flush() (+5 more)

### Community 110 - "graftCostume"
Cohesion: 0.27
Nodes (14): canvasFit(), compose(), graftCostume(), copyAccessor(), copyMaterial(), copyMesh(), copyTexture(), copyView() (+6 more)

### Community 111 - "FishingView.tsx"
Cohesion: 0.11
Nodes (42): CAST_ERRORS, coarsePointer(), FishingView(), initialEasyReel(), isTyping(), LOST, PondGameProps, Toast (+34 more)

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
Cohesion: 0.28
Nodes (14): isItem(), isName(), isPid(), isSeq(), MAX_HOLDS, MAX_INSTANCE, MAX_MESSAGE_BYTES, parseClientMessage() (+6 more)

### Community 119 - "Costume gallery doorway"
Cohesion: 0.50
Nodes (3): Costume gallery doorway, Curtain colour edit, Prompt

### Community 120 - "LeaderboardPanel.tsx"
Cohesion: 0.25
Nodes (14): PondBoardId, PondBoardPeriod, PondBoardRow, PondLeaderboard, formatInteger(), formatOdds(), nextMondayUtc(), BoardRow() (+6 more)

### Community 121 - "Fishing forest: painted asset pass"
Cohesion: 0.11
Nodes (17): Assets, Bruce's collection refresh (2026-11-08), Fishing forest illustrations, Made by hand (not touched by the script), Monets Lily Pond (2026-11-08), 1. Forest doorway, 2. Woodland noticeboard, 3. Fisherman and bait basket (+9 more)

### Community 124 - "The Costume Atelier"
Cohesion: 0.13
Nodes (14): Adding a character, Adding a costume, Art not supplied as files, Bruce's Chronicles, Checked against the mocks (2026-11-07), Code, Costume fit review, Fitting clothes to other characters (+6 more)

### Community 125 - "PondPanels.tsx"
Cohesion: 0.18
Nodes (13): PearlIcon(), getPondStateSnapshot(), subscribePondState(), usePondState(), FishmongerPanel(), PondHud(), PondHudProps, BOARD_TABS (+5 more)

### Community 126 - "rig.ts"
Cohesion: 0.04
Nodes (72): CrowdPreviewPage(), RigPreviewPage(), CrowdPreview(), draw(), KINDS, Stats, Window, NEXT (+64 more)

### Community 127 - "Curating the paintings (2026-11-07)"
Cohesion: 0.13
Nodes (14): 1. The registry and the table, 2. The studio's Location picker, 3. The rooms draw what is placed, 4. Credits, 5. Retiring self-serve artists, Building it, Curating the paintings (2026-11-07), Decided (+6 more)

### Community 128 - "nearby.ts"
Cohesion: 0.18
Nodes (5): Nearby, NearbyReach, RoomSpan, reach, strip

### Community 129 - "presence/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, types, exclude, extends, include, ../../tsconfig.base.json

### Community 130 - "limited"
Cohesion: 0.27
Nodes (11): PER_MEMBER, PUT(), PER_IP, POST(), presenceUrl(), allowedOrigin(), checkMutation(), memberName (+3 more)

### Community 131 - "tsconfig.test.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 132 - "app/layout.tsx"
Cohesion: 0.08
Nodes (27): bethEllen, inspiratiq, metadata, notoSans, RootLayout(), sniglet, viewport, StageOptions (+19 more)

### Community 133 - "messages.ts"
Cohesion: 0.33
Nodes (6): checkMessage(), INVISIBLE, MESSAGE_MAX, MessageCheck, normalizeMessage(), hasProfanity()

### Community 134 - "lib/presence.ts"
Cohesion: 0.08
Nodes (20): PresencePreviewPage(), PresencePreview(), Entry, INTERPOLATION_DELAY_MS, PEER_TIMEOUT_MS, PeerTable, positionAt(), RemoteVisitor (+12 more)

### Community 135 - "db.ts"
Cohesion: 0.43
Nodes (4): getPool(), poolConfig(), sslFor(), RDS_CA_BUNDLE

### Community 136 - "backend.ts"
Cohesion: 0.15
Nodes (12): amplifyDir, backend, everyMinutes, mediaBucket, missing, repoRoot, REQUIRED, setting() (+4 more)

### Community 137 - "stage.ts"
Cohesion: 0.05
Nodes (48): CharacterSprites, Scenery, CafeMarks, Attachment, CarriedState, createCarried(), Character, Look (+40 more)

### Community 138 - "hall/room.ts"
Cohesion: 0.05
Nodes (57): Assets, Backdrop, createBackdrop(), CUTS, disposeBoards(), Mark, plane(), ROPE_CUTS (+49 more)

### Community 139 - "epoch.ts"
Cohesion: 0.22
Nodes (15): GET(), intParam(), GET(), sketchPool, unavailable(), currentEpoch(), ensureEpoch(), epochById() (+7 more)

### Community 140 - "Item"
Cohesion: 0.19
Nodes (3): Presence, Item, Refusal

### Community 141 - "sketchguess/lib/api.ts"
Cohesion: 0.23
Nodes (13): sameOriginUrl(), PreparedGame, decodeImage(), fetchBitmap(), fetchRound(), guarded(), LoadedRound, loadInk() (+5 more)

### Community 142 - "visits.ts"
Cohesion: 0.06
Nodes (46): state(), PER_VISITOR, POST(), dynamic, format(), grade(), METRICS, PAGES (+38 more)

### Community 143 - "carry.test.ts"
Cohesion: 0.29
Nodes (10): CARRY_CAP, carryAdd(), CarryEntry, carryPrune(), carryRemove(), chunk(), tzOffsetNow(), claimCarryOver() (+2 more)

### Community 144 - "The Moonlit Pond — design"
Cohesion: 0.09
Nodes (22): Art the pond needs from the artist, Build contract (decided 2026-11-07), Build phases, Collection and goals, Done, Done, Guardrails, Leaderboards (+14 more)

### Community 145 - "Pond rework"
Cohesion: 0.18
Nodes (10): Baits, Client, Decisions, Done, Notes, Pond rework, Server, Species (+2 more)

### Community 146 - "env.ts"
Cohesion: 0.20
Nodes (8): target, SCHEMA_DIR, isProduction(), presenceSecret(), repoRoot, required(), sessionSecret(), setting()

### Community 147 - "Orchestration contract — you plan, DSH workers execute"
Cohesion: 0.29
Nodes (6): Briefing a worker, Budget hygiene, graphify, Orchestration contract — you plan, DSH workers execute, The worker, When not to delegate

### Community 148 - "tables.ts"
Cohesion: 0.11
Nodes (30): BaitTray(), BaitTrayProps, debugSpecies(), debugVariant(), GuestRollOptions, guestTreasure(), rollGuest(), BAIT (+22 more)

### Community 149 - "RoomContents"
Cohesion: 0.05
Nodes (23): CameraRig, Room, Entry, Arrival, RoomContents, RoomContext, RoomDef, prop() (+15 more)

### Community 150 - "placeLabel"
Cohesion: 0.10
Nodes (9): GiftShopMarks, CafeLink, ComingSoonNote, GiftShopSigns, GuestBoardNotes, Placards, placeLabel(), toScreen() (+1 more)

### Community 151 - "pond-state.ts"
Cohesion: 0.32
Nodes (11): PondStateView, PondTier, ensurePondStateStarted(), GUEST, listeners, LOADING, PondStateSnapshot, publish() (+3 more)

### Community 152 - ".webSocketMessage"
Cohesion: 0.44
Nodes (3): attachmentOf(), Room, sendTo()

### Community 153 - "AssetImage"
Cohesion: 0.08
Nodes (35): BoardScreen(), BoardScreenProps, ComposeScreen(), ComposeScreenProps, blankDraft(), GuestBoard(), GuestBoardProps, View (+27 more)

### Community 155 - "share.ts"
Cohesion: 0.33
Nodes (5): ShareOutcome, shareResult(), ShareSummary, shareText(), base

### Community 157 - "Walkthrough.tsx"
Cohesion: 0.13
Nodes (21): MoreArrow(), NavArrow(), Props, SLIDE, Walkthrough(), XIcon(), decodedFrames, frameFor() (+13 more)

### Community 158 - "createPondRoom"
Cohesion: 0.32
Nodes (13): createPondRoom(), approach(), busy(), finishWalk(), goTo(), leave(), move(), nearest() (+5 more)

### Community 159 - "MuseumStage.tsx"
Cohesion: 0.13
Nodes (11): EXITS, isDoor(), linkedDoor(), LINKS, ActiveRoom, RoomOptions, StageContext, StageContextValue (+3 more)

### Community 163 - "painting-open"
Cohesion: 0.50
Nodes (4): file, kilobytes, seconds, painting-open

### Community 165 - "Multiplayer ("other visitors") — plan v2 (Cloudflare)"
Cohesion: 0.17
Nodes (11): 0. Summary, 10. Decisions, 1. Product contract changes (approved 2026-10-31), 2. What already exists that this builds on, 3.1 Generated names (everyone has one), 3. Names, 5.1 Emotes (v1), 5. Protocol (`packages/core/src/presence/protocol.ts`) (+3 more)

### Community 167 - "BountyPanel.tsx"
Cohesion: 0.22
Nodes (15): refreshWalletNow(), PondBounties, formatCountdown(), nextUtcMidnight(), utcDayLabel(), setPondState(), useCountdown(), useNow() (+7 more)

### Community 168 - "audience.ts"
Cohesion: 0.09
Nodes (27): ArtistPage(), dynamic, generateMetadata(), GET(), ALLOWED, POST(), GET(), FollowForm() (+19 more)

### Community 169 - "icon-basket"
Cohesion: 0.67
Nodes (3): icon-basket, file, vector

### Community 170 - "reveal.ts"
Cohesion: 0.17
Nodes (9): PlaceInfo, InkMap, planGame(), ROUND_SPREAD, createReveal(), compose(), PENCIL, SketchReveal (+1 more)

### Community 171 - "next"
Cohesion: 0.18
Nodes (14): config, SECURITY_HEADERS, dynamic, Hall(), MuseumPage(), CurrentlyShowing(), dynamic, GUIDELINES (+6 more)

### Community 174 - "lib/slots/index.ts"
Cohesion: 0.07
Nodes (27): AccountSheet(), continueAnyway(), doSignOut(), runDelete(), runName(), submit(), submitDelete(), submitName() (+19 more)

### Community 179 - "confirm/page.tsx"
Cohesion: 0.33
Nodes (7): ConfirmFollow(), dynamic, dynamic, Unsubscribe(), FollowNotice(), confirmFollow(), unsubscribe()

### Community 180 - "wardrobe.ts"
Cohesion: 0.11
Nodes (36): AtelierPage(), dynamic, metadata, useWallet(), allowedCharacter(), OwnedSnapshot, owns(), walletReady() (+28 more)

### Community 183 - "run.ts"
Cohesion: 0.20
Nodes (7): admin, childEnv, client, database, fresh, migrations, target

### Community 186 - "4. Transport: Cloudflare Durable Objects"
Cohesion: 0.25
Nodes (8): 4. Transport: Cloudflare Durable Objects, Decision (2026-10-31), Deploying, Identity cannot be forged, Local development and tests, Rooms and capacity, Shape of `apps/presence` (about 200 lines), main()

### Community 187 - "getStorage"
Cohesion: 0.22
Nodes (15): CONTENT_TYPES, GET(), PUT(), deletePiece(), ACCEPTED, createAssetFromUpload(), MAX_UPLOAD_BYTES, presignUpload() (+7 more)

### Community 191 - "useSoundEffects.ts"
Cohesion: 0.12
Nodes (27): saveIfHigher(), BackgroundMusic, clampVolume(), isDocumentHidden(), Options, useBackgroundMusic(), VISIBILITY_EVENTS, EFFECTS (+19 more)

### Community 192 - "Confirmed issues"
Cohesion: 0.04
Nodes (46): 10. Long names run off the name sign, 11. The rooms API skips the stale-tab member check, 12. The bunny is dragged along while you pan in Decorate, 13. Pages that redirect or don't exist answer 200, 14. Error codes reveal which room slugs exist, 15. The name sign slides under the top-right buttons in Decorate, 16. Level-up celebrations can be farmed, 17. No hint of where things are after panning away (+38 more)

### Community 193 - "Monets Lily Pond: exploration, UX and multiplayer QA"
Cohesion: 0.29
Nodes (6): Browser and interaction coverage, Changes made from the walkthrough, Monets Lily Pond: exploration, UX and multiplayer QA, Multiplayer and load, Practical limits, Regression checks and cleanup

## Knowledge Gaps
- **5 isolated node(s):** `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1323 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **30 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `AccountSheet.tsx` to `actions.ts`, `SketchGuess.tsx`, `app/layout.tsx`, `lib/presence.ts`, `PondRoom.tsx`, `Test Fakes and Helpers`, `join-room.ts`, `tables.ts`, `AssetImage`, `logic.ts`, `Museum.tsx`, `PersonalRoom.tsx`, `Walkthrough.tsx`, `Web Package Dependencies`, `MuseumStage.tsx`, `risk.ts`, `BountyPanel.tsx`, `audience.ts`, `PondTicker.tsx`, `next`, `lib/slots/index.ts`, `Water.tsx`, `wardrobe.ts`, `pond-format.ts`, `useSoundEffects.ts`, `ArrangeControls.tsx`, `bug-report.ts`, `features/economy/index.ts`, `FishingView.tsx`, `AtelierKeeps.tsx`, `FishingView.tsx`, `LeaderboardPanel.tsx`, `PondPanels.tsx`, `rig.ts`?**
  _High betweenness centrality (0.074) - this node is a cross-community bridge._
- **What connects `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json` to the rest of the system?**
  _5 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `actions.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05880780539962577 - nodes in this community are weakly interconnected._
- **Why does `three` connect `stage.ts` to `scene/assets.ts`, `hall/room.ts`, `scene.ts`, `cozy.ts`, `atelier.ts`, `prepare-models.mjs`, `rig.ts`, `Web Package Dependencies`, `pond/room.ts`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Should `SketchGuess.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1396011396011396 - nodes in this community are weakly interconnected._
- **Why does `Traversal` connect `Traversal` to `createStage`, `stage.ts`, `RoomContents`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Should `themes.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07317073170731707 - nodes in this community are weakly interconnected._