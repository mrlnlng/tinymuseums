# Graph Report - tiny-museum  (2026-11-11)

## Corpus Check
- 496 files · ~272,979 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 78 file(s) not represented in the graph (top: .avif 39, .glb 30, .css 4)

## Summary
- 4346 nodes · 11222 edges · 202 communities (171 shown, 31 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 208 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d68f6edd`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- gallery.ts
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
- Context
- ref_node_assert
- amplify/package.json
- lib/assets.ts
- prepare-models.mjs
- Traversal
- core/package.json
- art-cache.ts
- themes.ts
- DecorController
- Museum.tsx
- ambience.ts
- core/src/index.ts
- Web Package Dependencies
- Gamifying Tiny Museum — genre direction & engagement research
- atelier.ts
- slots/store.ts
- risk.ts
- amplify/tsconfig.json
- 5. Customization menu — what other people are doing
- wallet.ts
- BountyPanel.tsx
- Web TSConfig
- Root Package Manifest
- bug-reports.ts
- PondTicker.tsx
- import-fishing-assets.mjs
- Base TSConfig
- Amplify Build Spec
- CharacterKind
- hitForVisitor
- FakeServer
- handlers.ts
- Water.tsx
- Worker Package Manifest
- Public Asset Manifest
- wardrobe.ts
- features/economy/index.ts
- compose-atelier.mjs
- layout.ts
- pond-format.ts
- react
- economy/store.ts
- backend.ts
- room.ts
- minimap.ts
- logic.ts
- Handoff: move the Tiny Museum bunny from sprite frames to a rig
- Sound Effect Assets
- createAtelierRoom
- Custom HTTP Headers
- Sharp Layer Package
- bug-reports.ts
- scene/ambience.ts
- wallet/body.ts
- ReadScreen.tsx
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
- .webSocketMessage
- presence/package.json
- outbox.test.ts
- Asset pipeline: fast loading without losing sharpness
- Guest Board SQL Schema
- Landscape Frame Asset
- nearby.ts
- Bug Reports SQL Schema
- Vitals SQL Schema
- json
- db-tests/pond.test.ts
- pond/room.ts
- ticket/route.ts
- Run-Once Schema
- createStage
- FishingView.tsx
- ticket.ts
- LandingFx
- Conn
- personal/room.ts
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
- useSound
- wire.ts
- Item
- PlacementLayer
- CatchView
- hall/room.ts
- epoch.ts
- lib/presence.ts
- sketchguess/lib/api.ts
- visits.ts
- placeLabel
- The Moonlit Pond — design
- Pond rework
- env.ts
- Orchestration contract — you plan, DSH workers execute
- tables.ts
- a/[slug]/page.tsx
- earn
- pond-state.ts
- PerfMeter
- Other visitors
- FilesystemStorage
- lib/slots/index.ts
- HallArranger.tsx
- Walkthrough.tsx
- createPondRoom
- createPlacementLayer
- High
- domain/sketch.ts
- CoinToast.tsx
- painting-open
- PresenceOptions
- Multiplayer ("other visitors") — plan v2 (Cloudflare)
- createMinimap
- Medium
- query
- icon-basket
- reveal.ts
- Sitting
- Carried
- bunny-left
- AccountSheet
- bunny-right
- PersonalRoom.tsx
- Low
- icon-home
- RoomSound
- Personal room: stress-test issues
- ticket
- Local end-to-end stress test — 2026-11-06
- foreground.ts
- Angler.tsx
- Minimap
- presence/src/index.ts
- media/storage.ts
- Cafe
- Notes
- TreeSparkles
- useSoundEffects.ts
- boundedCameraX
- Monets Lily Pond: exploration, UX and multiplayer QA
- rooms/types.ts
- pond-api.ts
- next
- Lobby
- VitalsReporter.tsx
- 4. Transport: Cloudflare Durable Objects
- stage.ts
- ArtCache

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

## Communities (202 total, 31 thin omitted)

### Community 0 - "gallery.ts"
Cohesion: 0.27
Nodes (12): hangAction(), movePieceAction(), unhangAction(), FloorControls(), move(), unhang(), formFor(), StorageControls() (+4 more)

### Community 1 - "walk.ts"
Cohesion: 0.13
Nodes (13): FloorPoint, WalkArea, water, depthAtLift(), DEPTH_SPAN, depthOf(), MAX_DEPTH, PICTURE (+5 more)

### Community 2 - "SketchGuess.tsx"
Cohesion: 0.09
Nodes (36): bestKeyFor(), BURST, clueUrl(), openingPlan(), Phase, pickAtRandom(), prepareSketchGame(), readDifficulty() (+28 more)

### Community 3 - "rooms.ts"
Cohesion: 0.11
Nodes (38): artist(), member(), piece(), randomId(), discardLocation(), hasUnpublished(), nudgeInRow(), OWNER (+30 more)

### Community 4 - "rules.ts"
Cohesion: 0.15
Nodes (18): localDay(), at(), EXCHANGE_DAILY_STAMPS, EXCHANGE_PEARLS_PER_STAMP, exchangeClaimKey(), GAME_DAILY_CAP, GameId, GAMES (+10 more)

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
Nodes (47): AssetManifest, assetUrl(), bitmapTexture(), blankImage(), CAFE_CAT_FRAMES, CompressedLoader, elementTexture(), ENTRANCE_FILES (+39 more)

### Community 9 - "SyncStore"
Cohesion: 0.16
Nodes (7): encodeStored(), parseStored(), readStored(), removeStored(), writeStored(), SyncStore, upgrade()

### Community 10 - "machine.ts"
Cohesion: 0.10
Nodes (46): CAST_ERRORS, coarsePointer(), FishingView(), initialEasyReel(), isTyping(), LOST, Toast, vibrate() (+38 more)

### Community 11 - "PondRoom.tsx"
Cohesion: 0.13
Nodes (18): Loading(), metadata, PondPage(), POND_NAME, PondLoading(), BOARD_TABS, PondOverlayKind, PondPanels() (+10 more)

### Community 12 - "Test Fakes and Helpers"
Cohesion: 0.11
Nodes (28): deferredFetch(), deviceSlot, FakeEvents, FakeStorage, fixture, fixtureB, fixtureRegistry, fixtureRegistryBoth (+20 more)

### Community 13 - "scene.ts"
Cohesion: 0.05
Nodes (30): disposeDisplayTexture(), prefersAvif(), HiddenCoin, createHelm(), Helm, createNotes(), createPedestal(), Pedestal (+22 more)

### Community 14 - "cozy.ts"
Cohesion: 0.16
Nodes (21): ATELIER_PROPS, AtelierImage, canvasTexture(), CozyBackdrop, cozyPropImageUrl(), disposeCozyArt(), drawingOn(), FISH (+13 more)

### Community 15 - "actions.ts"
Cohesion: 0.07
Nodes (63): BugReportsPage(), dateFormat, dynamic, summary(), dynamic, GalleryPage(), dateFormat, dynamic (+55 more)

### Community 16 - "room-events.ts"
Cohesion: 0.10
Nodes (30): ChatButton(), REFUSED, joinRoom(), emit(), getPeople(), isInRoom(), isMuted(), muted (+22 more)

### Community 18 - "ref_node_assert"
Cohesion: 0.12
Nodes (29): defineSlot(), docBytes(), SLOTS, byAtThenKey(), encoded(), latest, mapOf(), maxNumber() (+21 more)

### Community 19 - "amplify/package.json"
Cohesion: 0.17
Nodes (14): devDependencies, @aws-amplify/backend@^1.14.0, @aws-amplify/backend-cli@^1.6.0, aws-cdk-lib@^2.180.0, constructs@^10.3.0, name, private, scripts (+6 more)

### Community 20 - "lib/assets.ts"
Cohesion: 0.10
Nodes (30): Loading(), dynamic, Hall(), MuseumPage(), [BRAND_OWNER, ...BRAND_REST], CurrentlyShowing(), Decor(), dynamic (+22 more)

### Community 21 - "prepare-models.mjs"
Cohesion: 0.15
Nodes (18): paintedCostume(), atelier, bunny, floralOutfits(), goldOutfits(), HEADPIECES, image(), manifest (+10 more)

### Community 22 - "Traversal"
Cohesion: 0.11
Nodes (4): clamp(), fixture(), jump(), Traversal

### Community 23 - "core/package.json"
Cohesion: 0.06
Nodes (40): dependencies, @aws-sdk/client-s3@^3.1121.0, @aws-sdk/s3-request-presigner@^3.1121.0, bcryptjs@^2.4.3, obscenity@^0.4.6, pg@^8.13.1, sharp@^0.33.5, thumbhash@^0.1.1 (+32 more)

### Community 24 - "art-cache.ts"
Cohesion: 0.21
Nodes (9): ArtCacheOptions, createArtCache(), drop(), expireLater(), hold(), HeldArt, LoadResult, Slot (+1 more)

### Community 25 - "themes.ts"
Cohesion: 0.09
Nodes (23): COLLECTIONS, GAMES, isRecord(), placementOf(), PlacementOwnership, ownsAll, ownsNone, validatePlacements() (+15 more)

### Community 27 - "Museum.tsx"
Cohesion: 0.14
Nodes (24): motion@^13.1.1, Loading(), preloadFrames(), AtelierLoading(), CoinFound, ColorRecall, GameDesktop, GuestBoard (+16 more)

### Community 28 - "ambience.ts"
Cohesion: 0.13
Nodes (30): blade(), bloom(), BLOOMS, createPondAmbience(), update(), fishTexture(), frond(), FRONT_ROWS (+22 more)

### Community 29 - "core/src/index.ts"
Cohesion: 0.05
Nodes (121): CatchExtra, COLUMNS, insertCatch(), member(), namedMember(), randomId(), StatePatch, addBait() (+113 more)

### Community 30 - "Web Package Dependencies"
Cohesion: 0.08
Nodes (32): dependencies, embla-carousel-react@^8.6.0, next@^15.0.3, react@^19.0.0, react-dom@^19.0.0, swr@^2.5.1, three@^0.169.0, thumbhash@^0.1.1 (+24 more)

### Community 31 - "Gamifying Tiny Museum — genre direction & engagement research"
Cohesion: 0.10
Nodes (19): 0.1 The core experience, 0.2 Systems that make gamification cheap to build, 0.3 Constraints that shape any recommendation, 0. What the game is today (the deep dive), 1.1 The landscape (seven candidates, with verdicts), 1.2 Recommendation: a **cozy gallery life-sim** — "the gallery you live in", 1.3 The five design pillars the genre implies, 1. Genre direction (+11 more)

### Community 32 - "atelier.ts"
Cohesion: 0.05
Nodes (38): AtelierArt, AtelierImage, BuiltRoom, Cardigan, CARDIGAN_NAMES, Control, disposeAtelierArt(), ATELIER_END_X (+30 more)

### Community 33 - "slots/store.ts"
Cohesion: 0.14
Nodes (16): ANON_PREFIX, anonKey(), deviceKey(), isMemberSlotKey(), listKeys(), MEMBER_KEY, memberKey(), memberPrefix() (+8 more)

### Community 34 - "risk.ts"
Cohesion: 0.12
Nodes (31): Hud(), HudProps, HudWagerChip, WagerPicker(), chooseTier(), WagerPickerProps, CastOptions, PondStateView (+23 more)

### Community 35 - "amplify/tsconfig.json"
Cohesion: 0.20
Nodes (9): compilerOptions, module, moduleResolution, noUnusedLocals, noUnusedParameters, exclude, extends, include (+1 more)

### Community 36 - "5. Customization menu — what other people are doing"
Cohesion: 0.12
Nodes (16): 1. The target: what "Claude Opus 5.5" actually means, 2. Where your harness stands today (live config I read), 3. The honest gap model, 4. Quality levers, ranked by leverage, 5. Customization menu — what other people are doing, 6. Recommended starting kit for *your* profile, 7. What I can apply for you right now (needs your go-ahead), A. Prompt & persona (most common quality customizations) (+8 more)

### Community 37 - "wallet.ts"
Cohesion: 0.07
Nodes (50): grantPearls(), member(), now, piece(), randomId(), today, applyClaim(), baitCounts() (+42 more)

### Community 38 - "BountyPanel.tsx"
Cohesion: 0.15
Nodes (22): GLYPHS, PearlIcon(), POND_CRIMSON, PondIcon(), PondIconName, fetchPondBounties(), memberId(), PondBounties (+14 more)

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
Cohesion: 0.33
Nodes (10): fetchPondFeed(), catchLabel(), formatSizeCm(), speciesFor(), speciesName(), speciesTier(), isGolden(), PondTicker() (+2 more)

### Community 43 - "import-fishing-assets.mjs"
Cohesion: 0.10
Nodes (12): CANVAS, clear, FONT, FRAME, heights, layout, lossless, manifest (+4 more)

### Community 44 - "Base TSConfig"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, lib, module, moduleResolution (+9 more)

### Community 45 - "Amplify Build Spec"
Cohesion: 0.12
Nodes (16): applications, appRoot, backend, frontend, baseDirectory, files, phases, commands (+8 more)

### Community 46 - "CharacterKind"
Cohesion: 0.09
Nodes (7): AtelierRoom, ClothingItem, Display, CharacterKind, Options, Wardrobe, SlotHandle

### Community 47 - "hitForVisitor"
Cohesion: 0.16
Nodes (18): POST(), POST(), POST(), POST(), GET(), PER_VISITOR, PER_VISITOR, POST() (+10 more)

### Community 48 - "FakeServer"
Cohesion: 0.20
Nodes (3): FakeServer, SlotState, SlotDef

### Community 49 - "handlers.ts"
Cohesion: 0.08
Nodes (44): loop(), shutdown(), sleep(), sweepStale(), DrainResult, handler(), repairFrames(), confirmedFollowers() (+36 more)

### Community 50 - "Water.tsx"
Cohesion: 0.07
Nodes (39): setFrame(), Angler(), AmbientShadow, box(), BUCKET, bunnyBox(), easeOut(), Glint (+31 more)

### Community 51 - "Worker Package Manifest"
Cohesion: 0.14
Nodes (14): dependencies, @tiny/core@*, exports, ./lambda, @tiny/core, main, name, private (+6 more)

### Community 52 - "Public Asset Manifest"
Cohesion: 0.12
Nodes (15): artworks, bunny, size, floor, size, fonts, icon-no-photos, size (+7 more)

### Community 53 - "wardrobe.ts"
Cohesion: 0.09
Nodes (43): AtelierPage(), dynamic, metadata, useWallet(), allowedCharacter(), OwnedSnapshot, owns(), walletReady() (+35 more)

### Community 54 - "features/economy/index.ts"
Cohesion: 0.24
Nodes (13): serverSnapshot, useEarnEvents(), buildClaim(), BuiltClaim, EarnDetail, EarnSource, GameSource, newRunId() (+5 more)

### Community 55 - "compose-atelier.mjs"
Cohesion: 0.14
Nodes (9): body, dressLayer, dressWidth, floralWidth, MANNEQUIN_CANVAS, mask, root, sourceSize (+1 more)

### Community 56 - "layout.ts"
Cohesion: 0.15
Nodes (11): cafeAfterIndex(), comingSoonWidth(), computeLayout(), cutRooms(), HallLayout, HallRoomKind, HallRoomSpan, hasPedestal() (+3 more)

### Community 57 - "pond-format.ts"
Cohesion: 0.13
Nodes (26): fetchPondDex(), EXCHANGE_DAILY_STAMPS, EXCHANGE_PEARLS_PER_STAMP, FISH_ART, fishArt(), formatPercent(), formatShortSizeCm(), ODDS_BAIT (+18 more)

### Community 58 - "react"
Cohesion: 0.15
Nodes (17): openBugReport(), fitWidth(), HelpGuide(), HelpGuideProps, POINTER_STEPS, TOUCH_STEPS, loadGameDesktop(), GameDesktop() (+9 more)

### Community 59 - "economy/store.ts"
Cohesion: 0.11
Nodes (39): CARRY_CAP, carryAdd(), CarryEntry, carryPrune(), carryRemove(), chunk(), ClaimRequest, tzOffsetNow() (+31 more)

### Community 60 - "backend.ts"
Cohesion: 0.15
Nodes (12): amplifyDir, backend, everyMinutes, mediaBucket, missing, repoRoot, REQUIRED, setting() (+4 more)

### Community 61 - "room.ts"
Cohesion: 0.14
Nodes (28): admitted(), Attachment, farewell(), GHOST_MS, HELLO_TIMEOUT_MS, holdsOf(), MAX_WAITING_PER_IP, newAttachment() (+20 more)

### Community 62 - "minimap.ts"
Cohesion: 0.10
Nodes (24): ATELIER_DOOR, doorPoint(), FALLBACK_TINT, FloorSketch, ICONS, MAP_PLACES, MAP_SCALE, MapPlace (+16 more)

### Community 63 - "logic.ts"
Cohesion: 0.12
Nodes (20): DecorDrawer, DecorDrawerProps, SharingState, Tab, TABS, categoryOf(), currentHallOrder(), DrawerCategory (+12 more)

### Community 64 - "Handoff: move the Tiny Museum bunny from sprite frames to a rig"
Cohesion: 0.15
Nodes (11): 1. What is in this bundle, 2. How the game draws the bunny today (read from the repo, not run), 3. The rig, 5. Blender-side work still to do (needs Blender; the author has it with an MCP bridge), 6. Open questions for the author, Handoff: move the Tiny Museum bunny from sprite frames to a rig, Approved v4 bunny in the hall, Assets (+3 more)

### Community 65 - "Sound Effect Assets"
Cohesion: 0.22
Nodes (9): file, kilobytes, seconds, file, kilobytes, seconds, soundEffects, click (+1 more)

### Community 66 - "createAtelierRoom"
Cohesion: 0.17
Nodes (24): aspectOf(), AtelierActions, createAtelierRoom(), buildCollection(), form(), buildEntrance(), buildRoom(), picture() (+16 more)

### Community 67 - "Custom HTTP Headers"
Cohesion: 0.25
Nodes (7): applications, appRoot, customHeaders, headers, pattern, key, value

### Community 68 - "Sharp Layer Package"
Cohesion: 0.33
Nodes (6): dependencies, sharp@^0.33.5, description, sharp, name, private

### Community 69 - "bug-reports.ts"
Cohesion: 0.18
Nodes (14): BugContext, BugReport, BugReportDto, BugReportRateLimited, BugReportRejected, BugRow, CONTEXT_KEYS, EVERYONE (+6 more)

### Community 70 - "scene/ambience.ts"
Cohesion: 0.13
Nodes (13): BULBS, createHallAmbience(), finish(), glowTexture(), HallAmbience, mulberry(), painted(), vignetteTexture() (+5 more)

### Community 71 - "wallet/body.ts"
Cohesion: 0.26
Nodes (11): PER_MEMBER, POST(), baitIdOf(), integerOffset(), isRecord(), itemIdOf(), MAX_CLAIM_BATCH, ParsedWalletClaim (+3 more)

### Community 72 - "ReadScreen.tsx"
Cohesion: 0.13
Nodes (21): BoardScreen(), BoardScreenProps, PinnedNotes(), PinnedNotesProps, ReadScreen(), ReadScreenProps, messageLength(), StickyNote() (+13 more)

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
Cohesion: 0.18
Nodes (19): ArtByRoom, blank(), colorAt(), disposePondArt(), EDGE_BAND, EDGE_BANDS, EDGE_OVERLAP, edgeTexture() (+11 more)

### Community 80 - "createPresence"
Cohesion: 0.14
Nodes (21): createPresence(), drop(), heartbeat(), maybeSend(), onPageHide(), receive(), scheduleRetry(), send() (+13 more)

### Community 81 - "members"
Cohesion: 0.12
Nodes (25): coin_claims, coin_claims_daily, wallet_bait, wallet_items, wallets, member_sessions, member_sessions_member, member_slots (+17 more)

### Community 82 - "Frame Window Asset"
Cohesion: 0.50
Nodes (4): frame, size, window, windowAspect

### Community 83 - ".webSocketMessage"
Cohesion: 0.40
Nodes (4): attachmentOf(), roomFull(), Room, sendTo()

### Community 84 - "presence/package.json"
Cohesion: 0.14
Nodes (16): dependencies, @tiny/core@*, devDependencies, @cloudflare/workers-types@5.20261016.1, wrangler@4.151.1, @tiny/core, name, private (+8 more)

### Community 85 - "outbox.test.ts"
Cohesion: 0.20
Nodes (16): OUTBOX_CAP, outboxAdd(), outboxDue(), OutboxEntry, outboxFail(), outboxRemove(), RETRY_BASE_MS, RETRY_MAX_MS (+8 more)

### Community 86 - "Asset pipeline: fast loading without losing sharpness"
Cohesion: 0.22
Nodes (8): Asset pipeline: fast loading without losing sharpness, Character rigs and the Costume Atelier, Completed, Ground rules, Phase 1: fingerprinted files at 2x and 3x, Phase 2: texture atlases for the hall sprites, Phase 3: KTX2 (Basis Universal), built and switched off, Phase 4: ThumbHash placeholders for paintings

### Community 87 - "Guest Board SQL Schema"
Cohesion: 0.67
Nodes (3): guest_notes, guest_notes_visible, rate_limits

### Community 88 - "Landscape Frame Asset"
Cohesion: 0.67
Nodes (3): frameLandscape, size, window

### Community 89 - "nearby.ts"
Cohesion: 0.18
Nodes (6): createNearby(), Nearby, NearbyReach, RoomSpan, reach, strip

### Community 93 - "json"
Cohesion: 0.07
Nodes (86): POST(), PER_MEMBER, PUT(), POST(), GET(), GLOBAL, PER_IP, POST() (+78 more)

### Community 94 - "db-tests/pond.test.ts"
Cohesion: 0.13
Nodes (21): BOARDS, oneOf(), PER_VISITOR, PERIODS, compare(), DexRow, displayName(), FeedRow (+13 more)

### Community 95 - "pond/room.ts"
Cohesion: 0.11
Nodes (24): FAR_LIFT, FAR_SCALE, liftAt(), pathHalfWidth(), pathX(), PondPath, scaleAt(), path (+16 more)

### Community 96 - "ticket/route.ts"
Cohesion: 0.09
Nodes (44): GET(), GET(), memberFromRequest(), Code, 3.2 Chosen names (members), registry, started(), AuthedArtist (+36 more)

### Community 104 - "createStage"
Cohesion: 0.16
Nodes (23): revealFloorTransition(), isDoor(), linkedDoor(), createStage(), closeEntry(), enter(), initialize(), aim() (+15 more)

### Community 105 - "FishingView.tsx"
Cohesion: 0.13
Nodes (14): CONFETTI_COLORS, ConfettiPiece, makeConfetti(), RevealCard(), TIER_MS, TIER_SFX, useCountUp(), chainOffer (+6 more)

### Community 106 - "ticket.ts"
Cohesion: 0.17
Nodes (16): validRoomBase(), decoder, encoder, fromBase64Url(), HmacKey, isOwn(), isTicket(), keyFor() (+8 more)

### Community 107 - "LandingFx"
Cohesion: 0.20
Nodes (11): glowSprite(), LandingFx(), burst(), onClick(), onVisibility(), tick(), twinkle(), Mote (+3 more)

### Community 108 - "Conn"
Cohesion: 0.31
Nodes (4): connectWebSocket(), SocketHandlers, Conn, message()

### Community 109 - "personal/room.ts"
Cohesion: 0.21
Nodes (9): cozyLevel, cozyWorth(), createPersonalRoom(), showLevel(), DOOR_SIGN, NAME_SIGN, PersonalRoomOptions, cozyTheme (+1 more)

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
Cohesion: 0.35
Nodes (12): isItem(), isName(), isPid(), isSeq(), MAX_MESSAGE_BYTES, parseClientMessage(), parseLook(), parseMotion() (+4 more)

### Community 119 - "Costume gallery doorway"
Cohesion: 0.50
Nodes (3): Costume gallery doorway, Curtain colour edit, Prompt

### Community 120 - "pond-api.ts"
Cohesion: 0.20
Nodes (16): PondBoardId, PondBoardPeriod, PondBoardRow, PondLeaderboard, formatCountdown(), formatOdds(), nextMondayUtc(), useCountdown() (+8 more)

### Community 121 - "Fishing forest: painted asset pass"
Cohesion: 0.10
Nodes (18): Assets, Bruce's collection refresh (2026-11-08), Fishing forest illustrations, Made by hand (not touched by the script), Main hall v2 (2026-11-10), Monets Lily Pond (2026-11-08), 1. Forest doorway, 2. Woodland noticeboard (+10 more)

### Community 124 - "The Costume Atelier"
Cohesion: 0.13
Nodes (14): Adding a character, Adding a costume, Art not supplied as files, Bruce's Chronicles, Checked against the mocks (2026-11-07), Code, Costume fit review, Fitting clothes to other characters (+6 more)

### Community 125 - "Confirmed issues"
Cohesion: 0.11
Nodes (18): Confirmed issues, E2E-002 — Valid edge placement rejected through floating-point precision, E2E-003 — One owned prop can be placed multiple times, E2E-004 — Reload before autosave silently loses the latest placement, E2E-005 — Failed save and failed Done have no visible mobile explanation, E2E-006 — Restoring connectivity does not retry a failed draft save, E2E-007 — Keyboard activation cannot place drawer items, E2E-008 — Creating an account from My Room leaves the signed-in user on the sign-in prompt (+10 more)

### Community 126 - "rig.ts"
Cohesion: 0.05
Nodes (52): CrowdPreviewPage(), CrowdPreview(), draw(), KINDS, Stats, Window, Layer, setCostumeVisibility() (+44 more)

### Community 127 - "Curating the paintings (2026-11-07)"
Cohesion: 0.13
Nodes (14): 1. The registry and the table, 2. The studio's Location picker, 3. The rooms draw what is placed, 4. Credits, 5. Retiring self-serve artists, Building it, Curating the paintings (2026-11-07), Decided (+6 more)

### Community 128 - "domain/guestboard.ts"
Cohesion: 0.10
Nodes (29): GET(), ComposeScreen(), ComposeScreenProps, blankDraft(), GuestBoard(), GuestBoardProps, View, StickyNoteProps (+21 more)

### Community 129 - "presence/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, types, exclude, extends, include, ../../tsconfig.base.json

### Community 130 - "run.ts"
Cohesion: 0.20
Nodes (7): admin, childEnv, client, database, fresh, migrations, target

### Community 131 - "tsconfig.test.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 132 - "app/layout.tsx"
Cohesion: 0.19
Nodes (9): bethEllen, inspiratiq, metadata, notoSans, RootLayout(), sniglet, viewport, ServiceWorker() (+1 more)

### Community 133 - "useSound"
Cohesion: 0.25
Nodes (9): ColorRecall(), ColorRecallProps, Phase, readBest(), ColorRound, showMs(), loadColorRecall(), useSound() (+1 more)

### Community 134 - "wire.ts"
Cohesion: 0.14
Nodes (7): INTERPOLATION_DELAY_MS, PEER_TIMEOUT_MS, PeerTable, positionAt(), Sample, look, Peer

### Community 135 - "Item"
Cohesion: 0.15
Nodes (4): RemoteVisitor, Presence, RemoteVisitors, Item

### Community 136 - "PlacementLayer"
Cohesion: 0.13
Nodes (4): Carry, PersonalRoomProps, PlacementLayer, Placement

### Community 137 - "CatchView"
Cohesion: 0.24
Nodes (10): PondGameProps, PondGame(), RevealCardProps, PondCatch, CatchView, GuestRoll, FishId, FishVariant (+2 more)

### Community 138 - "hall/room.ts"
Cohesion: 0.06
Nodes (57): Assets, Scenery, CUTS, disposeBoards(), Mark, plane(), ROPE_CUTS, ropeSlices() (+49 more)

### Community 139 - "epoch.ts"
Cohesion: 0.14
Nodes (23): GET(), intParam(), GET(), sketchPool, unavailable(), MuseumProps, EMPTY, firstSlice() (+15 more)

### Community 140 - "lib/presence.ts"
Cohesion: 0.10
Nodes (19): Entry, Connect, fetchTicket, HEARTBEAT_MS, HIDDEN_LIMIT_MS, RETRY_MS, SAY_GAP_MS, Self (+11 more)

### Community 141 - "sketchguess/lib/api.ts"
Cohesion: 0.23
Nodes (13): sameOriginUrl(), PreparedGame, decodeImage(), fetchBitmap(), fetchRound(), guarded(), LoadedRound, loadInk() (+5 more)

### Community 142 - "visits.ts"
Cohesion: 0.06
Nodes (49): state(), PER_VISITOR, POST(), dynamic, format(), grade(), METRICS, PAGES (+41 more)

### Community 143 - "placeLabel"
Cohesion: 0.08
Nodes (9): ComingSoonNote, FunZoneSign, GiftShopSigns, GuestBoardNotes, LobbySigns, Placards, placeLabel(), toScreen() (+1 more)

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
Nodes (32): BaitTray(), BaitTrayProps, debugSpecies(), debugTokens(), debugVariant(), GuestRollOptions, guestTreasure(), rollGuest() (+24 more)

### Community 149 - "a/[slug]/page.tsx"
Cohesion: 0.31
Nodes (6): ArtistPage(), dynamic, generateMetadata(), GET(), FollowForm(), getArtistPage()

### Community 150 - "earn"
Cohesion: 0.31
Nodes (10): earn(), emit(), emitEarned(), maybeInvite(), writeSession(), tap(), enterAtelier(), tap() (+2 more)

### Community 151 - "pond-state.ts"
Cohesion: 0.24
Nodes (15): fetchPondState(), PondStateView, PondTier, ensurePondStateStarted(), getPondStateSnapshot(), GUEST, listeners, LOADING (+7 more)

### Community 153 - "Other visitors"
Cohesion: 0.29
Nodes (6): How it plays, Other visitors, Privacy, Running it in production, Running it locally, Staying consistent

### Community 155 - "lib/slots/index.ts"
Cohesion: 0.08
Nodes (24): PresencePreviewPage(), AccountHost(), AccountSheet, NAME_ERRORS, Pending, View, KeepOnOtherDevices(), AccountMode (+16 more)

### Community 156 - "HallArranger.tsx"
Cohesion: 0.27
Nodes (7): loadHallArranger(), HallArranger(), HallArrangerProps, HallRoomData, Painting, hallPlacements(), reasonLabel()

### Community 157 - "Walkthrough.tsx"
Cohesion: 0.13
Nodes (21): BACKDROP_STYLE, MoreArrow(), NavArrow(), Props, SLIDE, Walkthrough(), XIcon(), decodedFrames (+13 more)

### Community 158 - "createPondRoom"
Cohesion: 0.32
Nodes (13): createPondRoom(), approach(), busy(), finishWalk(), goTo(), leave(), move(), nearest() (+5 more)

### Community 159 - "createPlacementLayer"
Cohesion: 0.18
Nodes (8): aspectOf(), createPlacementLayer(), drawOutline(), dropHelper(), sizeOf(), PlacementTheme, Phase 5: themes, zones and arrangements, ThemeSpec

### Community 160 - "High"
Cohesion: 0.33
Nodes (6): 1. Items placed against a zone edge fail to save, and the whole draft reverts, 2. One owned item can be placed many times, 3. Any save rejection throws away all unsaved work, 4. Changes made just before leaving are lost, 5. Fish trophies can be claimed without playing, High

### Community 161 - "domain/sketch.ts"
Cohesion: 0.08
Nodes (36): listPieces(), pieceImageUrl(), PieceRow, toPieceDto(), deletePiece(), GalleryPiece, GalleryRow, planSketchRound() (+28 more)

### Community 162 - "CoinToast.tsx"
Cohesion: 0.17
Nodes (12): MuseumLayout(), CoinToast(), Toast, Purse(), Stamp(), WalletProvider(), STAMP_ASPECT, STAMP_SVG (+4 more)

### Community 163 - "painting-open"
Cohesion: 0.50
Nodes (4): file, kilobytes, seconds, painting-open

### Community 165 - "Multiplayer ("other visitors") — plan v2 (Cloudflare)"
Cohesion: 0.14
Nodes (13): ScreenChrome(), 0. Summary, 10. Decisions, 1. Product contract changes (approved 2026-10-31), 2. What already exists that this builds on, 3.1 Generated names (everyone has one), 3. Names, 5.1 Emotes (v1) (+5 more)

### Community 166 - "createMinimap"
Cohesion: 0.36
Nodes (9): place(), createMinimap(), draw(), drawRoom(), floors(), follow(), sketchOf(), panTo() (+1 more)

### Community 167 - "Medium"
Cohesion: 0.25
Nodes (8): 10. Long names run off the name sign, 11. The rooms API skips the stale-tab member check, 12. The bunny is dragged along while you pan in Decorate, 6. Failed saves are nearly invisible, and nothing retries, 7. Two tabs editing the same room overwrite each other, 8. The drawer's card row can't be scrolled on touch screens, 9. Decorating can't be done with the keyboard, Medium

### Community 168 - "query"
Cohesion: 0.08
Nodes (31): ALLOWED, POST(), ConfirmFollow(), dynamic, dynamic, Unsubscribe(), GET(), AnalyticsPage() (+23 more)

### Community 169 - "icon-basket"
Cohesion: 0.67
Nodes (3): icon-basket, file, vector

### Community 170 - "reveal.ts"
Cohesion: 0.23
Nodes (7): InkMap, planGame(), ROUND_SPREAD, createReveal(), PENCIL, SketchReveal, shuffle()

### Community 174 - "AccountSheet"
Cohesion: 0.29
Nodes (9): AccountSheet(), continueAnyway(), doSignOut(), runDelete(), runName(), submit(), submitDelete(), submitName() (+1 more)

### Community 176 - "PersonalRoom.tsx"
Cohesion: 0.11
Nodes (28): errorReason(), overDrawer(), PersonalRoom(), canPlaceNew(), carryEnd(), carryMove(), onCardKey(), onCardPointerDown() (+20 more)

### Community 177 - "Low"
Cohesion: 0.25
Nodes (8): 13. Pages that redirect or don't exist answer 200, 14. Error codes reveal which room slugs exist, 15. The name sign slides under the top-right buttons in Decorate, 16. Level-up celebrations can be farmed, 17. No hint of where things are after panning away, 18. Too many items is only discovered by the server, 19. Development-only: page payloads include the full room row, Low

### Community 179 - "RoomSound"
Cohesion: 0.33
Nodes (4): StageOptions, RoomSound, SoundState, EffectName

### Community 180 - "Personal room: stress-test issues"
Cohesion: 0.29
Nodes (5): Checked and fine, Not covered by this pass, Personal room: stress-test issues, Status (2026-11-06), Test data left in the local database

### Community 182 - "Local end-to-end stress test — 2026-11-06"
Cohesion: 0.29
Nodes (7): Environment and coverage, Follow-up coverage, Issue index, Local end-to-end stress test — 2026-11-06, Measured load, Passing checks and interpretation limits, Test data and cleanup

### Community 183 - "foreground.ts"
Cohesion: 0.40
Nodes (3): createHallForeground(), HallForeground, mulberry()

### Community 184 - "Angler.tsx"
Cohesion: 0.40
Nodes (4): FITS, Box, GRIP, HAT

### Community 186 - "presence/src/index.ts"
Cohesion: 0.67
Nodes (3): fetch(), Env, parseRoom()

### Community 187 - "media/storage.ts"
Cohesion: 0.10
Nodes (19): CONTENT_TYPES, GET(), POST(), UPLOADS_PER_ARTIST, PUT(), ACCEPTED, createAssetFromUpload(), MAX_UPLOAD_BYTES (+11 more)

### Community 191 - "useSoundEffects.ts"
Cohesion: 0.10
Nodes (30): SoundContext, SoundProvider(), BackgroundMusic, clampVolume(), isDocumentHidden(), Options, useBackgroundMusic(), VISIBILITY_EVENTS (+22 more)

### Community 193 - "Monets Lily Pond: exploration, UX and multiplayer QA"
Cohesion: 0.29
Nodes (6): Browser and interaction coverage, Changes made from the walkthrough, Monets Lily Pond: exploration, UX and multiplayer QA, Multiplayer and load, Practical limits, Regression checks and cleanup

### Community 195 - "rooms/types.ts"
Cohesion: 0.05
Nodes (53): RigPreviewPage(), NEXT, PROPS, RigPreview(), draw(), Attachment, CarriedState, createCarried() (+45 more)

### Community 197 - "pond-api.ts"
Cohesion: 0.24
Nodes (16): buyPondBait(), claimPondBounty(), errorOf(), exchangePondPearls(), fetchPondLeaderboard(), isRecord(), isStateView(), mutationHeaders() (+8 more)

### Community 199 - "next"
Cohesion: 0.09
Nodes (30): config, SECURITY_HEADERS, GET(), PaintingRow, POST(), UPLOADS_PER_ARTIST, dynamic, HomePage() (+22 more)

### Community 211 - "VitalsReporter.tsx"
Cohesion: 0.31
Nodes (7): firstPainting(), flush(), Metric, queue, REPORTED, FIRST_PAINTING_MARK, MUSEUM_START_MARK

### Community 212 - "4. Transport: Cloudflare Durable Objects"
Cohesion: 0.25
Nodes (8): 4. Transport: Cloudflare Durable Objects, Decision (2026-10-31), Deploying, Identity cannot be forged, Local development and tests, Rooms and capacity, Shape of `apps/presence` (about 200 lines), main()

### Community 215 - "stage.ts"
Cohesion: 0.03
Nodes (46): coverFloorTransition(), CharacterSprites, CameraRig, createPixelRatioGovernor(), PIXEL_RATIO_STEPS, createRoomPassage(), fixture(), Room (+38 more)

## Knowledge Gaps
- **5 isolated node(s):** `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1380 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **31 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `domain/guestboard.ts`, `gallery.ts`, `SketchGuess.tsx`, `app/layout.tsx`, `useSound`, `machine.ts`, `PondRoom.tsx`, `Test Fakes and Helpers`, `visits.ts`, `actions.ts`, `room-events.ts`, `lib/assets.ts`, `a/[slug]/page.tsx`, `tables.ts`, `pond-state.ts`, `Museum.tsx`, `lib/slots/index.ts`, `Walkthrough.tsx`, `Web Package Dependencies`, `HallArranger.tsx`, `CoinToast.tsx`, `risk.ts`, `BountyPanel.tsx`, `bug-reports.ts`, `PondTicker.tsx`, `PersonalRoom.tsx`, `Water.tsx`, `wardrobe.ts`, `features/economy/index.ts`, `Angler.tsx`, `pond-format.ts`, `logic.ts`, `useSoundEffects.ts`, `rooms/types.ts`, `next`, `ReadScreen.tsx`, `VitalsReporter.tsx`, `stage.ts`, `FishingView.tsx`, `LandingFx`, `pond-api.ts`, `rig.ts`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **What connects `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json` to the rest of the system?**
  _5 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `walk.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12561576354679804 - nodes in this community are weakly interconnected._
- **Why does `three` connect `rooms/types.ts` to `atelier.ts`, `scene/ambience.ts`, `scene/assets.ts`, `hall/room.ts`, `scene.ts`, `cozy.ts`, `pond/art.ts`, `prepare-models.mjs`, `stage.ts`, `rig.ts`, `ambience.ts`, `Web Package Dependencies`, `pond/room.ts`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **Should `SketchGuess.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08879492600422834 - nodes in this community are weakly interconnected._
- **Why does `defaultStore()` connect `wardrobe.ts` to `slots/store.ts`, `rooms/types.ts`, `pond-api.ts`, `BountyPanel.tsx`, `next`, `createStage`, `SyncStore`, `hall/room.ts`, `lib/slots/index.ts`, `pondgame/lib/api.ts`, `PersonalRoom.tsx`, `room-events.ts`, `pond-state.ts`, `Angler.tsx`, `stage.ts`, `economy/store.ts`, `createPondRoom`, `pond/room.ts`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Should `rooms.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10569105691056911 - nodes in this community are weakly interconnected._