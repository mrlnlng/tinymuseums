# Graph Report - tiny-museum  (2026-11-17)

## Corpus Check
- 512 files · ~301,077 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 82 file(s) not represented in the graph (top: .avif 39, .glb 34, .css 4)

## Summary
- 4568 nodes · 11800 edges · 206 communities (180 shown, 26 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 241 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a1f59cae`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- character.ts
- walk.ts
- SketchGuess.tsx
- themes.ts
- remote-visitors.ts
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
- outbox.test.ts
- ref_node_assert
- amplify/package.json
- PersonalRoom.tsx
- prepare-models.mjs
- Traversal
- core/package.json
- ensureEpoch
- DecorController
- pond-boards.ts
- LeaderboardPanel.tsx
- ambience.ts
- core/src/index.ts
- Web Package Dependencies
- Gamifying Tiny Museum — genre direction & engagement research
- atelier.ts
- hit
- risk.ts
- amplify/tsconfig.json
- 5. Customization menu — what other people are doing
- core/src/index.ts
- Placement
- Web TSConfig
- Root Package Manifest
- RigPreview.tsx
- domain/sketch.ts
- import-fishing-assets.mjs
- Base TSConfig
- Amplify Build Spec
- sketchguess/lib/api.ts
- stage.ts
- FakeServer
- writeStyle
- Water.tsx
- Worker Package Manifest
- Public Asset Manifest
- wardrobe.ts
- rules.ts
- compose-atelier.mjs
- Other visitors
- pond-format.ts
- atelier/room.ts
- economy/store.ts
- LandingFx
- room.ts
- minimap.ts
- catalog.ts
- domain/guestboard.ts
- Sound Effect Assets
- art-cache.ts
- Custom HTTP Headers
- Sharp Layer Package
- currentMember
- scene/ambience.ts
- nearby.ts
- .webSocketMessage
- Angler.tsx
- Visits SQL Schema
- Bunny Walk Sprites
- Room Mockup Settings
- Service Worker Caching
- HallCallbacks
- pond/art.ts
- createPresence
- members
- Frame Window Asset
- features/economy/index.ts
- presence/package.json
- createAtelierRoom
- Asset pipeline: fast loading without losing sharpness
- Guest Board SQL Schema
- Landscape Frame Asset
- jobs.ts
- Bug Reports SQL Schema
- Vitals SQL Schema
- hit
- createRemoteVisitors
- pond/room.ts
- members.ts
- Run-Once Schema
- confirm/page.tsx
- FishingView.tsx
- ticket.ts
- visits/page.tsx
- react
- a/[slug]/page.tsx
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
- performance/page.tsx
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
- master
- hall/room.ts
- handlers.ts
- lib/presence.ts
- initialize
- vitals.ts
- Local end-to-end stress test — 2026-11-06
- The Moonlit Pond — design
- Pond rework
- controller.ts
- Orchestration contract — you plan, DSH workers execute
- tables.ts
- tab-turn.ts
- guestboard/route.ts
- pond-state.ts
- layout.ts
- app/page.tsx
- hit.ts
- lib/slots/index.ts
- createStage
- Walkthrough.tsx
- createPondRoom
- SoundProvider.tsx
- Medium
- RoomSound
- CoinToast.tsx
- painting-open
- rooms.ts
- Multiplayer ("other visitors") — plan v2 (Cloudflare)
- Lobby
- run.ts
- wallet/body.ts
- icon-basket
- Personal room: stress-test issues
- visits.ts
- lib/assets.ts
- bunny-left
- AssetImage
- bunny-right
- logic.ts
- carry.test.ts
- icon-home
- personal/room.ts
- audience.ts
- ticket
- Clock
- Storyline (draft, saved 2026-11-17)
- PondTicker.tsx
- walk
- Low
- media/storage.ts
- draw.py
- ArtCache
- earn
- useSoundEffects.ts
- revealFloorTransition
- Monets Lily Pond: exploration, UX and multiplayer QA
- Notes
- editor.ts
- VitalsReporter.tsx
- pond-api.ts
- AccountSheet.tsx
- Your Room: a room you can freely furnish
- Sitting
- boundedCameraX
- FilesystemStorage
- 4. Transport: Cloudflare Durable Objects
- PondRoom.tsx
- messages.ts

## God Nodes (most connected - your core abstractions)
1. `react` - 77 edges
2. `json()` - 72 edges
3. `query()` - 68 edges
4. `PersonalRoom()` - 67 edges
5. `hit()` - 58 edges
6. `limited()` - 52 edges
7. `three` - 45 edges
8. `next` - 44 edges
9. `Traversal` - 44 edges
10. `SyncStore` - 41 edges

## Surprising Connections (you probably didn't know these)
- `E2E-001 — Alternate local origin breaks artwork fallback URLs` --references--> `sameOriginUrl()`  [INFERRED]
  docs/testing/local-e2e-stress-2026-11-06.md → apps/web/src/features/hall/lib/media.ts
- `Code` --references--> `followOutfit()`  [INFERRED]
  docs/costume-atelier.md → apps/web/src/features/hall/scene/wardrobe.ts
- `5.1 Emotes (v1)` --references--> `ScreenChrome()`  [INFERRED]
  docs/multiplayer-plan.md → apps/web/src/shared/components/ScreenChrome.tsx
- `E2E-009 — Room mutations ignore stale account identity` --references--> `memberFromRequest()`  [INFERRED]
  docs/testing/local-e2e-stress-2026-11-06.md → apps/web/src/shared/lib/member-route.ts
- `Where things stand` --references--> `sealEpoch()`  [INFERRED]
  docs/curation-plan.md → packages/core/src/domain/epoch.ts

## Import Cycles
- None detected.

## Communities (206 total, 26 thin omitted)

### Community 0 - "character.ts"
Cohesion: 0.06
Nodes (18): Cafe, Carried, CarriedState, createCarried(), Character, Look, Perch, Pose (+10 more)

### Community 1 - "walk.ts"
Cohesion: 0.13
Nodes (13): FloorPoint, WalkArea, water, depthAtLift(), DEPTH_SPAN, depthOf(), MAX_DEPTH, PICTURE (+5 more)

### Community 2 - "SketchGuess.tsx"
Cohesion: 0.09
Nodes (36): bestKeyFor(), BURST, clueUrl(), openingPlan(), Phase, pickAtRandom(), PreparedGame, prepareSketchGame() (+28 more)

### Community 3 - "themes.ts"
Cohesion: 0.05
Nodes (39): COLLECTIONS, Catalogue, Data model (core), 1. Items placed against a zone edge fail to save, and the whole draft reverts, 2. One owned item can be placed many times, 3. Any save rejection throws away all unsaved work, 4. Changes made just before leaving are lost, 5. Fish trophies can be claimed without playing (+31 more)

### Community 4 - "remote-visitors.ts"
Cohesion: 0.10
Nodes (10): Attachment, RigState, Rig, RigAttachment, FLAT, MAX_SHOWN, Prop, RemoteVisitors (+2 more)

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
Cohesion: 0.09
Nodes (41): AssetManifest, assetUrl(), bitmapTexture(), blankImage(), CAFE_CAT_FRAMES, CompressedLoader, elementTexture(), ENTRANCE_FILES (+33 more)

### Community 9 - "SyncStore"
Cohesion: 0.13
Nodes (18): ANON_PREFIX, anonKey(), deviceKey(), encodeStored(), isMemberSlotKey(), listKeys(), MEMBER_KEY, memberKey() (+10 more)

### Community 10 - "machine.ts"
Cohesion: 0.12
Nodes (36): CastMeter(), ReelMeter(), armCast(), BITE_WINDOW, biteGap(), CHARGE_PERIOD, chargePower(), createFishingState() (+28 more)

### Community 11 - "Museum.tsx"
Cohesion: 0.17
Nodes (21): PinnedNotes(), CoinFound, ColorRecall, GameDesktop, GuestBoard, HallArranger, HelpGuide, loadCoinFound() (+13 more)

### Community 12 - "Test Fakes and Helpers"
Cohesion: 0.10
Nodes (27): deferredFetch(), deviceSlot, FakeEvents, FakeStorage, fixture, fixtureB, fixtureRegistry, fixtureRegistryBoth (+19 more)

### Community 13 - "scene.ts"
Cohesion: 0.05
Nodes (24): disposeDisplayTexture(), prefersAvif(), HiddenCoin, createNotes(), createPedestal(), Pedestal, PedestalVoice, placeholderTexture() (+16 more)

### Community 14 - "cozy.ts"
Cohesion: 0.06
Nodes (59): alphaCanvas(), ATELIER_PROPS, AtelierImage, atticWindowCanvas(), bareBulbCanvas(), boardsCanvas(), canvasTexture(), ceilingGeometry() (+51 more)

### Community 15 - "actions.ts"
Cohesion: 0.05
Nodes (85): config, SECURITY_HEADERS, GET(), AnalyticsPage(), dynamic, BugReportsPage(), dateFormat, dynamic (+77 more)

### Community 16 - "room-events.ts"
Cohesion: 0.18
Nodes (27): ChatButton(), REFUSED, joinRoom(), STANDING, emit(), getPeople(), isInRoom(), isMuted() (+19 more)

### Community 17 - "outbox.test.ts"
Cohesion: 0.29
Nodes (10): OUTBOX_CAP, outboxAdd(), OutboxEntry, outboxFail(), outboxRemove(), RETRY_BASE_MS, RETRY_MAX_MS, retryDelay() (+2 more)

### Community 18 - "ref_node_assert"
Cohesion: 0.12
Nodes (31): defineSlot(), docBytes(), SLOTS, byAtThenKey(), encoded(), latest, mapOf(), maxNumber() (+23 more)

### Community 19 - "amplify/package.json"
Cohesion: 0.08
Nodes (26): amplifyDir, backend, everyMinutes, mediaBucket, missing, repoRoot, REQUIRED, setting() (+18 more)

### Community 20 - "PersonalRoom.tsx"
Cohesion: 0.08
Nodes (53): errorReason(), Job, Offer, overDrawer(), PersonalRoom(), canPlaceNew(), carriedTo(), carryEnd() (+45 more)

### Community 21 - "prepare-models.mjs"
Cohesion: 0.10
Nodes (21): BODIES, bruce, BRUCE_FIT, BRUCE_PLACE, bunny, CARDIGAN_TIE, CROWN, CROWN_MIDDLE (+13 more)

### Community 22 - "Traversal"
Cohesion: 0.11
Nodes (5): JumpPose, clamp(), fixture(), jump(), Traversal

### Community 23 - "core/package.json"
Cohesion: 0.06
Nodes (40): dependencies, @aws-sdk/client-s3@^3.1121.0, @aws-sdk/s3-request-presigner@^3.1121.0, bcryptjs@^2.4.3, obscenity@^0.4.6, pg@^8.13.1, sharp@^0.33.5, thumbhash@^0.1.1 (+32 more)

### Community 24 - "ensureEpoch"
Cohesion: 0.14
Nodes (22): GET(), intParam(), GET(), sketchPool, unavailable(), MuseumProps, EMPTY, firstSlice() (+14 more)

### Community 26 - "pond-boards.ts"
Cohesion: 0.08
Nodes (30): CatchExtra, clearCatches(), COLUMNS, grantPearls(), insertCatch(), member(), namedMember(), randomId() (+22 more)

### Community 27 - "LeaderboardPanel.tsx"
Cohesion: 0.20
Nodes (17): PondBoardId, PondBoardPeriod, PondBoardRow, PondLeaderboard, formatCountdown(), formatInteger(), formatOdds(), nextMondayUtc() (+9 more)

### Community 28 - "ambience.ts"
Cohesion: 0.13
Nodes (30): blade(), bloom(), BLOOMS, createPondAmbience(), update(), fishTexture(), frond(), FRONT_ROWS (+22 more)

### Community 29 - "core/src/index.ts"
Cohesion: 0.05
Nodes (111): addBait(), PondBoardMe, PondBoardRow, PondFeedItem, Rep, bountyCatches(), BountyCatchRow, bountyViews() (+103 more)

### Community 30 - "Web Package Dependencies"
Cohesion: 0.07
Nodes (33): dependencies, embla-carousel-react@^8.6.0, motion@^13.1.1, next@^15.0.3, react@^19.0.0, react-dom@^19.0.0, swr@^2.5.1, three@^0.169.0 (+25 more)

### Community 31 - "Gamifying Tiny Museum — genre direction & engagement research"
Cohesion: 0.10
Nodes (19): 0.1 The core experience, 0.2 Systems that make gamification cheap to build, 0.3 Constraints that shape any recommendation, 0. What the game is today (the deep dive), 1.1 The landscape (seven candidates, with verdicts), 1.2 Recommendation: a **cozy gallery life-sim** — "the gallery you live in", 1.3 The five design pillars the genre implies, 1. Genre direction (+11 more)

### Community 32 - "atelier.ts"
Cohesion: 0.03
Nodes (43): AtelierActions, AtelierImage, AtelierRoom, BuiltRoom, Cardigan, CARDIGAN_NAMES, CHARACTER_NAMES, ClothingItem (+35 more)

### Community 33 - "hit"
Cohesion: 0.15
Nodes (16): PER_MEMBER, POST(), GET(), PaintingRow, POST(), UPLOADS_PER_ARTIST, POST(), UPLOADS_PER_ARTIST (+8 more)

### Community 34 - "risk.ts"
Cohesion: 0.11
Nodes (34): Hud(), HudProps, HudWagerChip, WagerPicker(), chooseTier(), WagerPickerProps, CastOptions, PondStateView (+26 more)

### Community 35 - "amplify/tsconfig.json"
Cohesion: 0.20
Nodes (9): compilerOptions, module, moduleResolution, noUnusedLocals, noUnusedParameters, exclude, extends, include (+1 more)

### Community 36 - "5. Customization menu — what other people are doing"
Cohesion: 0.12
Nodes (16): 1. The target: what "Claude Opus 5.5" actually means, 2. Where your harness stands today (live config I read), 3. The honest gap model, 4. Quality levers, ranked by leverage, 5. Customization menu — what other people are doing, 6. Recommended starting kit for *your* profile, 7. What I can apply for you right now (needs your go-ahead), A. Prompt & persona (most common quality customizations) (+8 more)

### Community 37 - "core/src/index.ts"
Cohesion: 0.09
Nodes (36): grantPearls(), member(), now, piece(), randomId(), today, baitOf(), applyClaim() (+28 more)

### Community 38 - "Placement"
Cohesion: 0.07
Nodes (13): dynamic, RoomPage(), Carry, PersonalRoomProps, DecorLive, GhostOptions, PlacementLayer, PlacementTheme (+5 more)

### Community 39 - "Web TSConfig"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 40 - "Root Package Manifest"
Cohesion: 0.06
Nodes (36): [, width, height], description, devDependencies, concurrently@^9.1.0, esbuild@^0.24.0, ktx2-encoder@^0.6.0, maxrects-packer@^2.7.3, playwright@^1.63.0 (+28 more)

### Community 41 - "RigPreview.tsx"
Cohesion: 0.16
Nodes (17): RigPreviewPage(), NEXT, PROPS, RigPreview(), draw(), approach(), createRigState(), GROUNDED (+9 more)

### Community 42 - "domain/sketch.ts"
Cohesion: 0.09
Nodes (29): listPieces(), pieceImageUrl(), PieceRow, toPieceDto(), planSketchRound(), SKETCH_CHOICES, SketchCandidate, SketchRoundPlan (+21 more)

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
Cohesion: 0.18
Nodes (13): sameOriginUrl(), decodeImage(), fetchBitmap(), fetchRound(), guarded(), InkMap, loadInk(), loadRound() (+5 more)

### Community 47 - "stage.ts"
Cohesion: 0.03
Nodes (49): coverFloorTransition(), CharacterSprites, CameraRig, createPixelRatioGovernor(), PIXEL_RATIO_STEPS, createRoomPassage(), fixture(), Options (+41 more)

### Community 48 - "FakeServer"
Cohesion: 0.18
Nodes (3): FakeServer, SlotState, SlotDef

### Community 49 - "writeStyle"
Cohesion: 0.18
Nodes (5): CafeLink, GuestBoardNotes, Placards, toScreen(), writeStyle()

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
Cohesion: 0.08
Nodes (40): Purse(), useWallet(), allowedCharacter(), OwnedSnapshot, owns(), walletReady(), stampLabel(), Atelier() (+32 more)

### Community 54 - "rules.ts"
Cohesion: 0.15
Nodes (18): localDay(), at(), EXCHANGE_DAILY_STAMPS, EXCHANGE_PEARLS_PER_STAMP, exchangeClaimKey(), GAME_DAILY_CAP, GameId, GAMES (+10 more)

### Community 55 - "compose-atelier.mjs"
Cohesion: 0.12
Nodes (10): body, dressLayer, dressWidth, floralWidth, hanger, MANNEQUIN_CANVAS, mask, root (+2 more)

### Community 56 - "Other visitors"
Cohesion: 0.29
Nodes (6): How it plays, Other visitors, Privacy, Running it in production, Running it locally, Staying consistent

### Community 57 - "pond-format.ts"
Cohesion: 0.12
Nodes (27): PondDex, EXCHANGE_DAILY_STAMPS, EXCHANGE_PEARLS_PER_STAMP, FISH_ART, fishArt(), formatPercent(), formatShortSizeCm(), ODDS_BAIT (+19 more)

### Community 58 - "atelier/room.ts"
Cohesion: 0.16
Nodes (12): AtelierArt, disposeAtelierArt(), loadGalleryDoor(), loadGalleryPillar(), loadImage(), pending, AtelierArtwork, HallArt (+4 more)

### Community 59 - "economy/store.ts"
Cohesion: 0.16
Nodes (26): outboxDue(), cappedTracked, emit(), emitEarned(), EMPTY_BAIT, EMPTY_TODAY, eventListeners, flushOnce() (+18 more)

### Community 60 - "LandingFx"
Cohesion: 0.17
Nodes (12): between(), CAT, Edge, EDGES, runLandingCat(), choosePeeker(), peek(), glowSprite() (+4 more)

### Community 61 - "room.ts"
Cohesion: 0.12
Nodes (29): fetch(), Env, admitted(), Attachment, farewell(), GHOST_MS, HELLO_TIMEOUT_MS, holdsOf() (+21 more)

### Community 62 - "minimap.ts"
Cohesion: 0.07
Nodes (36): ATELIER_DOOR, createMinimap(), draw(), drawRoom(), floors(), follow(), sketchOf(), doorPoint() (+28 more)

### Community 63 - "catalog.ts"
Cohesion: 0.14
Nodes (21): confirmClean(), startJob(), The closet: where every room starts (2026-11-17), ownershipFor(), CatalogItem, CatalogKind, FREE_CHARACTERS, ITEMS (+13 more)

### Community 64 - "domain/guestboard.ts"
Cohesion: 0.10
Nodes (31): BoardScreen(), ComposeScreen(), ComposeScreenProps, blankDraft(), GuestBoard(), GuestBoardProps, View, fetchPage() (+23 more)

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

### Community 69 - "currentMember"
Cohesion: 0.13
Nodes (28): GET(), GET(), GET(), GET(), PER_MEMBER, GET(), PER_MEMBER, BOARDS (+20 more)

### Community 70 - "scene/ambience.ts"
Cohesion: 0.13
Nodes (13): BULBS, createHallAmbience(), finish(), glowTexture(), HallAmbience, mulberry(), painted(), vignetteTexture() (+5 more)

### Community 71 - "nearby.ts"
Cohesion: 0.18
Nodes (5): Nearby, NearbyReach, RoomSpan, reach, strip

### Community 72 - ".webSocketMessage"
Cohesion: 0.40
Nodes (4): attachmentOf(), roomFull(), Room, sendTo()

### Community 73 - "Angler.tsx"
Cohesion: 0.18
Nodes (12): createCharacter(), contextLost(), loadKind(), loseRig(), setFrame(), RigAttachmentPose, FITS, Angler() (+4 more)

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
Cohesion: 0.19
Nodes (13): createPresence(), drop(), heartbeat(), maybeSend(), onPageHide(), receive(), scheduleRetry(), send() (+5 more)

### Community 81 - "members"
Cohesion: 0.12
Nodes (25): coin_claims, coin_claims_daily, wallet_bait, wallet_items, wallets, member_sessions, member_sessions_member, member_slots (+17 more)

### Community 82 - "Frame Window Asset"
Cohesion: 0.50
Nodes (4): frame, size, window, windowAspect

### Community 83 - "features/economy/index.ts"
Cohesion: 0.18
Nodes (17): serverSnapshot, useEarnEvents(), buildClaim(), BuiltClaim, EarnDetail, EarnSource, GameSource, newRunId() (+9 more)

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

### Community 89 - "jobs.ts"
Cohesion: 0.23
Nodes (15): loop(), shutdown(), sleep(), sweepStale(), DrainResult, handler(), repairFrames(), repairUnframed() (+7 more)

### Community 93 - "hit"
Cohesion: 0.13
Nodes (30): POST(), POST(), POST(), PER_MEMBER, PUT(), PER_MEMBER, POST(), catchIdOf() (+22 more)

### Community 94 - "createRemoteVisitors"
Cohesion: 0.24
Nodes (8): createRemoteVisitors(), ensureLayer(), load(), placeOwn(), show(), showProp(), sprite(), insideScreen()

### Community 95 - "pond/room.ts"
Cohesion: 0.11
Nodes (24): FAR_LIFT, FAR_SCALE, liftAt(), pathHalfWidth(), pathX(), PondPath, scaleAt(), path (+16 more)

### Community 96 - "members.ts"
Cohesion: 0.10
Nodes (47): registerAction(), Code, 3.2 Chosen names (members), registry, started(), ensureQrToken(), artistForSession(), createSession() (+39 more)

### Community 104 - "confirm/page.tsx"
Cohesion: 0.33
Nodes (7): ConfirmFollow(), dynamic, dynamic, Unsubscribe(), FollowNotice(), confirmFollow(), unsubscribe()

### Community 105 - "FishingView.tsx"
Cohesion: 0.13
Nodes (13): CONFETTI_COLORS, ConfettiPiece, makeConfetti(), RevealCard(), TIER_MS, TIER_SFX, useCountUp(), AudioContextClass (+5 more)

### Community 106 - "ticket.ts"
Cohesion: 0.18
Nodes (16): isCatalogItem(), decoder, encoder, fromBase64Url(), HmacKey, isOwn(), isTicket(), keyFor() (+8 more)

### Community 107 - "visits/page.tsx"
Cohesion: 0.29
Nodes (9): amount(), duration(), dynamic, LANDMARKS, PAGES, RANGES, share(), VisitsPage() (+1 more)

### Community 108 - "react"
Cohesion: 0.13
Nodes (19): openBugReport(), fitWidth(), HelpGuide(), HelpGuideProps, POINTER_STEPS, TOUCH_STEPS, loadGameDesktop(), GameDesktop() (+11 more)

### Community 109 - "a/[slug]/page.tsx"
Cohesion: 0.31
Nodes (6): ArtistPage(), dynamic, generateMetadata(), GET(), FollowForm(), getArtistPage()

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
Cohesion: 0.35
Nodes (12): isItem(), isName(), isPid(), isSeq(), MAX_MESSAGE_BYTES, parseClientMessage(), parseLook(), parseMotion() (+4 more)

### Community 119 - "Costume gallery doorway"
Cohesion: 0.50
Nodes (3): Costume gallery doorway, Curtain colour edit, Prompt

### Community 120 - "performance/page.tsx"
Cohesion: 0.27
Nodes (9): dynamic, format(), grade(), METRICS, PAGES, PerformancePage(), RANGES, summarizeVitals() (+1 more)

### Community 121 - "Fishing forest: painted asset pass"
Cohesion: 0.10
Nodes (18): Assets, Bruce's collection refresh (2026-11-08), Fishing forest illustrations, Made by hand (not touched by the script), Main hall v2 (2026-11-10), Monets Lily Pond (2026-11-08), 1. Forest doorway, 2. Woodland noticeboard (+10 more)

### Community 124 - "The Costume Atelier"
Cohesion: 0.14
Nodes (13): Adding a character, Adding a costume, Art not supplied as files, Bruce's Chronicles, Checked against the mocks (2026-11-07), Code, Costume fit review, Floral collection (+5 more)

### Community 125 - "Confirmed issues"
Cohesion: 0.11
Nodes (18): Confirmed issues, E2E-001 — Alternate local origin breaks artwork fallback URLs, E2E-002 — Valid edge placement rejected through floating-point precision, E2E-003 — One owned prop can be placed multiple times, E2E-004 — Reload before autosave silently loses the latest placement, E2E-005 — Failed save and failed Done have no visible mobile explanation, E2E-006 — Restoring connectivity does not retry a failed draft save, E2E-007 — Keyboard activation cannot place drawer items (+10 more)

### Community 126 - "rig.ts"
Cohesion: 0.13
Nodes (26): Layer, setCostumeVisibility(), canvasToModel(), createRenderer(), createRigLayer(), disposeRigLayer(), Frame, layerTemplates (+18 more)

### Community 127 - "Curating the paintings (2026-11-07)"
Cohesion: 0.13
Nodes (14): 1. The registry and the table, 2. The studio's Location picker, 3. The rooms draw what is placed, 4. Credits, 5. Retiring self-serve artists, Building it, Curating the paintings (2026-11-07), Decided (+6 more)

### Community 128 - "limited"
Cohesion: 0.12
Nodes (30): ALLOWED, PER_VISITOR, POST(), POST(), PER_MEMBER, PUT(), GLOBAL, PER_IP (+22 more)

### Community 129 - "presence/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, types, exclude, extends, include, ../../tsconfig.base.json

### Community 130 - "env.ts"
Cohesion: 0.04
Nodes (45): socket(), target, BASEBOARD, CURTAIN, drop, EXPECTED, file(), manifest (+37 more)

### Community 131 - "tsconfig.test.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 132 - "app/layout.tsx"
Cohesion: 0.15
Nodes (14): bethEllen, inspiratiq, metadata, notoSans, RootLayout(), sniglet, viewport, SoundContext (+6 more)

### Community 133 - "writeLocal"
Cohesion: 0.22
Nodes (17): ensureStarted(), memberChanged(), publish(), readSession(), refreshWallet(), syncMember(), undoAdminUnlock(), unlockEverything() (+9 more)

### Community 134 - "lib/presence.ts"
Cohesion: 0.11
Nodes (13): PresencePreviewPage(), PresencePreview(), Entry, INTERPOLATION_DELAY_MS, PEER_TIMEOUT_MS, PeerTable, positionAt(), RemoteVisitor (+5 more)

### Community 135 - "Item"
Cohesion: 0.19
Nodes (3): Presence, Item, Refusal

### Community 136 - "bug-reports.ts"
Cohesion: 0.11
Nodes (28): BugReportHost(), BugReportSheet, BugReportSheet(), send(), Status, collectContext(), inAppBrowser(), onOpenBugReport() (+20 more)

### Community 137 - "master"
Cohesion: 0.32
Nodes (7): paintedCostume(), floralOutfits(), goldOutfits(), master(), placed(), Fitting clothes to other characters, Headpieces

### Community 138 - "hall/room.ts"
Cohesion: 0.05
Nodes (67): Assets, Scenery, CUTS, disposeBoards(), Mark, plane(), ROPE_CUTS, ropeSlices() (+59 more)

### Community 139 - "handlers.ts"
Cohesion: 0.10
Nodes (33): confirmedFollowers(), GalleryRow, SketchPieceRow, DisplayPieceRow, handleDerivatives(), handleNotifyFollowers(), handleRenderDisplay(), handleSealEpoch() (+25 more)

### Community 140 - "lib/presence.ts"
Cohesion: 0.10
Nodes (22): Outcome, Connect, connectWebSocket(), fetchTicket, HEARTBEAT_MS, HIDDEN_LIMIT_MS, RETRY_MS, sameLook() (+14 more)

### Community 141 - "initialize"
Cohesion: 0.22
Nodes (14): initialize(), aim(), drawFrame(), handleClick(), handlePointerDown(), handlePointerMove(), handlePointerUp(), prefetchNearDoors() (+6 more)

### Community 142 - "vitals.ts"
Cohesion: 0.36
Nodes (6): DEVICES, METRICS, normalizePage(), parseVitalsReport(), RATINGS, VitalRow

### Community 143 - "Local end-to-end stress test — 2026-11-06"
Cohesion: 0.25
Nodes (8): Environment and coverage, Fix status (2026-11-06), Follow-up coverage, Issue index, Local end-to-end stress test — 2026-11-06, Measured load, Passing checks and interpretation limits, Test data and cleanup

### Community 144 - "The Moonlit Pond — design"
Cohesion: 0.09
Nodes (22): Art the pond needs from the artist, Build contract (decided 2026-11-07), Build phases, Collection and goals, Done, Done, Guardrails, Leaderboards (+14 more)

### Community 145 - "Pond rework"
Cohesion: 0.18
Nodes (10): Baits, Client, Decisions, Done, Notes, Pond rework, Server, Species (+2 more)

### Community 146 - "controller.ts"
Cohesion: 0.43
Nodes (6): centerYFor(), createDecorController(), canvasRect(), targetRise(), toScreen(), ScreenBox

### Community 147 - "Orchestration contract — you plan, DSH workers execute"
Cohesion: 0.29
Nodes (6): Briefing a worker, Budget hygiene, graphify, Orchestration contract — you plan, DSH workers execute, The worker, When not to delegate

### Community 148 - "tables.ts"
Cohesion: 0.09
Nodes (40): FrameShape, BaitTray(), BaitTrayProps, RevealCardProps, PondCatch, CatchView, debugSpecies(), debugVariant() (+32 more)

### Community 149 - "tab-turn.ts"
Cohesion: 0.16
Nodes (5): createTabTurn(), TabTurn, tab(), TurnEnv, TurnMessage

### Community 150 - "guestboard/route.ts"
Cohesion: 0.36
Nodes (7): POST(), GET(), POST(), rateLimitedResponse(), rejectedResponse(), BugReportRateLimited, postBugReport()

### Community 151 - "pond-state.ts"
Cohesion: 0.16
Nodes (19): GLYPHS, PearlIcon(), POND_CRIMSON, PondIconName, PondStateView, ensurePondStateStarted(), getPondStateSnapshot(), GUEST (+11 more)

### Community 152 - "layout.ts"
Cohesion: 0.21
Nodes (9): cafeAfterIndex(), comingSoonWidth(), computeLayout(), cutRooms(), HallLayout, HallRoomKind, HallRoomSpan, hasPedestal() (+1 more)

### Community 153 - "app/page.tsx"
Cohesion: 0.13
Nodes (20): Loading(), dynamic, Hall(), MuseumPage(), [BRAND_OWNER, ...BRAND_REST], CurrentlyShowing(), Decor(), dynamic (+12 more)

### Community 154 - "hit.ts"
Cohesion: 0.21
Nodes (10): createHiddenCoin(), AlphaMap, alphaMapFor(), alphaMaps, buildAlphaMap(), isPaintedAt(), registerSpriteMask(), spread() (+2 more)

### Community 155 - "lib/slots/index.ts"
Cohesion: 0.06
Nodes (18): dynamic, HomePage(), KeepOnOtherDevices(), COPY, HomeSignIn(), RoomNoticeProps, Probe(), StorageLike (+10 more)

### Community 156 - "createStage"
Cohesion: 0.52
Nodes (7): createNearby(), createStage(), closeEntry(), enter(), isCurrent(), isQuiet(), open()

### Community 157 - "Walkthrough.tsx"
Cohesion: 0.15
Nodes (19): BACKDROP_STYLE, MoreArrow(), NavArrow(), Props, SLIDE, Walkthrough(), XIcon(), decodedFrames (+11 more)

### Community 158 - "createPondRoom"
Cohesion: 0.32
Nodes (13): createPondRoom(), approach(), busy(), finishWalk(), goTo(), leave(), move(), nearest() (+5 more)

### Community 159 - "SoundProvider.tsx"
Cohesion: 0.20
Nodes (8): EFFECTS, EffectSpec, FOOTSTEPS, SoundEffects, gestured(), OPTIONS, STATIC_BASE, staticUrl()

### Community 160 - "Medium"
Cohesion: 0.22
Nodes (9): onClick(), 10. Long names run off the name sign, 11. The rooms API skips the stale-tab member check, 12. The bunny is dragged along while you pan in Decorate, 6. Failed saves are nearly invisible, and nothing retries, 7. Two tabs editing the same room overwrite each other, 8. The drawer's card row can't be scrolled on touch screens, 9. Decorating can't be done with the keyboard (+1 more)

### Community 161 - "RoomSound"
Cohesion: 0.33
Nodes (4): StageOptions, RoomSound, SoundState, EffectName

### Community 162 - "CoinToast.tsx"
Cohesion: 0.16
Nodes (10): MuseumLayout(), CoinToast(), Toast, Stamp(), WalletProvider(), STAMP_ASPECT, STAMP_SVG, STAMP_URL (+2 more)

### Community 163 - "painting-open"
Cohesion: 0.50
Nodes (4): file, kilobytes, seconds, painting-open

### Community 164 - "rooms.ts"
Cohesion: 0.09
Nodes (43): AtelierPage(), dynamic, metadata, artist(), member(), piece(), randomId(), sealEpoch() (+35 more)

### Community 165 - "Multiplayer ("other visitors") — plan v2 (Cloudflare)"
Cohesion: 0.15
Nodes (12): 0. Summary, 10. Decisions, 1. Product contract changes (approved 2026-10-31), 2. What already exists that this builds on, 3.1 Generated names (everyone has one), 3. Names, 5.1 Emotes (v1), 5. Protocol (`packages/core/src/presence/protocol.ts`) (+4 more)

### Community 167 - "run.ts"
Cohesion: 0.20
Nodes (7): admin, childEnv, client, database, fresh, migrations, target

### Community 168 - "wallet/body.ts"
Cohesion: 0.18
Nodes (16): PER_MEMBER, POST(), baitIdOf(), integerOffset(), isRecord(), itemIdOf(), MAX_CLAIM_BATCH, MAX_WALLET_BODY_BYTES (+8 more)

### Community 169 - "icon-basket"
Cohesion: 0.67
Nodes (3): icon-basket, file, vector

### Community 170 - "Personal room: stress-test issues"
Cohesion: 0.29
Nodes (5): Checked and fine, Not covered by this pass, Personal room: stress-test issues, Status (2026-11-06), Test data left in the local database

### Community 171 - "visits.ts"
Cohesion: 0.14
Nodes (23): state(), PER_VISITOR, POST(), flush(), startVisit(), visibleMs(), VisitState, count() (+15 more)

### Community 172 - "lib/assets.ts"
Cohesion: 0.25
Nodes (7): assetEntry, assetVariant(), AtlasGroup, AtlasSheet, BuiltImage, CSS_IMAGES, images

### Community 174 - "AssetImage"
Cohesion: 0.13
Nodes (19): BoardScreenProps, PinnedNotesProps, ReadScreen(), ReadScreenProps, messageLength(), StickyNote(), StickyNoteProps, NOTE_PLACES (+11 more)

### Community 176 - "logic.ts"
Cohesion: 0.07
Nodes (41): buy(), DecorDrawer, DecorDrawerProps, SLOT_LABELS, Tab, TABS, HallArranger(), HallArrangerProps (+33 more)

### Community 177 - "carry.test.ts"
Cohesion: 0.29
Nodes (11): CARRY_CAP, carryAdd(), CarryEntry, carryPrune(), carryRemove(), chunk(), ClaimRequest, tzOffsetNow() (+3 more)

### Community 179 - "personal/room.ts"
Cohesion: 0.07
Nodes (29): cozyLevel, cozyWorth(), createPersonalRoom(), light(), shade(), showArrangement(), showLevel(), signFilter() (+21 more)

### Community 180 - "audience.ts"
Cohesion: 0.22
Nodes (10): AnalyticsSummary, follow(), ResolvedToken, ConsoleMailer, FileMailer, followConfirmation(), getMailer(), inquiryNotice() (+2 more)

### Community 183 - "Storyline (draft, saved 2026-11-17)"
Cohesion: 0.18
Nodes (10): Arc (soft, no fail state), Built so far, How it ties to what exists, Mystery hook, Next tasks (when picked up), Open questions, Premise, Seed (the owner's words) (+2 more)

### Community 184 - "PondTicker.tsx"
Cohesion: 0.29
Nodes (11): fetchPondFeed(), PondFeedItem, catchLabel(), formatSizeCm(), speciesFor(), speciesName(), speciesTier(), isGolden() (+3 more)

### Community 185 - "walk"
Cohesion: 0.18
Nodes (12): walk(), 1. What is in this bundle, 3. The rig, 4. Suggested plan, 5. Blender-side work still to do (needs Blender; the author has it with an MCP bridge), 6. Open questions for the author, Handoff: move the Tiny Museum bunny from sprite frames to a rig, Approved v4 bunny in the hall (+4 more)

### Community 186 - "Low"
Cohesion: 0.25
Nodes (8): 13. Pages that redirect or don't exist answer 200, 14. Error codes reveal which room slugs exist, 15. The name sign slides under the top-right buttons in Decorate, 16. Level-up celebrations can be farmed, 17. No hint of where things are after panning away, 18. Too many items is only discovered by the server, 19. Development-only: page payloads include the full room row, Low

### Community 187 - "media/storage.ts"
Cohesion: 0.10
Nodes (24): CONTENT_TYPES, GET(), PUT(), deletePiece(), GalleryPiece, hangPiece(), movePiece(), unhangPiece() (+16 more)

### Community 190 - "earn"
Cohesion: 0.36
Nodes (9): earn(), maybeInvite(), writeSession(), createAtelierRoomDef(), tap(), enterAtelier(), tap(), tap() (+1 more)

### Community 191 - "useSoundEffects.ts"
Cohesion: 0.14
Nodes (21): BackgroundMusic, clampVolume(), isDocumentHidden(), Options, useBackgroundMusic(), VISIBILITY_EVENTS, useSoundEffects(), applyMix() (+13 more)

### Community 192 - "revealFloorTransition"
Cohesion: 0.70
Nodes (3): Loading(), AtelierLoading(), revealFloorTransition()

### Community 193 - "Monets Lily Pond: exploration, UX and multiplayer QA"
Cohesion: 0.29
Nodes (6): Browser and interaction coverage, Changes made from the walkthrough, Monets Lily Pond: exploration, UX and multiplayer QA, Multiplayer and load, Practical limits, Regression checks and cleanup

### Community 195 - "editor.ts"
Cohesion: 0.21
Nodes (13): roomEditor, PER_EDITOR, PUT(), versionOf(), PER_EDITOR, POST(), PER_MEMBER, POST() (+5 more)

### Community 196 - "VitalsReporter.tsx"
Cohesion: 0.29
Nodes (8): firstPainting(), flush(), Metric, queue, REPORTED, VitalsReporter(), FIRST_PAINTING_MARK, MUSEUM_START_MARK

### Community 197 - "pond-api.ts"
Cohesion: 0.16
Nodes (30): refreshWalletNow(), buyPondBait(), claimPondBounty(), errorOf(), exchangePondPearls(), fetchPondBounties(), fetchPondDex(), fetchPondLeaderboard() (+22 more)

### Community 198 - "AccountSheet.tsx"
Cohesion: 0.11
Nodes (21): AccountHost(), AccountSheet, AccountSheet(), continueAnyway(), doSignOut(), runDelete(), runName(), submit() (+13 more)

### Community 199 - "Your Room: a room you can freely furnish"
Cohesion: 0.22
Nodes (8): Admin mode (gamma), Decisions (2026-11-17, with the user), Room look (web, `features/rooms/themes/cozy.ts`, `features/rooms/personal/room.ts`), Scale, Testing locally, What other games do (research, 2026-11-17), Work plan, Your Room: a room you can freely furnish

### Community 205 - "4. Transport: Cloudflare Durable Objects"
Cohesion: 0.25
Nodes (8): 4. Transport: Cloudflare Durable Objects, Decision (2026-10-31), Deploying, Identity cannot be forged, Local development and tests, Rooms and capacity, Shape of `apps/presence` (about 200 lines), main()

### Community 210 - "PondRoom.tsx"
Cohesion: 0.12
Nodes (21): Loading(), metadata, PondPage(), openAccount(), POND_NAME, FishmongerPanel(), PondLoading(), BOARD_TABS (+13 more)

### Community 219 - "messages.ts"
Cohesion: 0.31
Nodes (7): checkMessage(), INVISIBLE, MESSAGE_MAX, MessageCheck, normalizeMessage(), hasProfanity(), matcher

## Knowledge Gaps
- **5 isolated node(s):** `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1465 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **26 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `SketchGuess.tsx`, `app/layout.tsx`, `round.ts`, `lib/presence.ts`, `writeLocal`, `bug-reports.ts`, `Museum.tsx`, `Test Fakes and Helpers`, `actions.ts`, `room-events.ts`, `PersonalRoom.tsx`, `tables.ts`, `pond-state.ts`, `app/page.tsx`, `lib/slots/index.ts`, `LeaderboardPanel.tsx`, `Walkthrough.tsx`, `Web Package Dependencies`, `SoundProvider.tsx`, `CoinToast.tsx`, `risk.ts`, `RigPreview.tsx`, `AssetImage`, `logic.ts`, `Water.tsx`, `wardrobe.ts`, `PondTicker.tsx`, `pond-format.ts`, `LandingFx`, `useSoundEffects.ts`, `domain/guestboard.ts`, `revealFloorTransition`, `VitalsReporter.tsx`, `pond-api.ts`, `AccountSheet.tsx`, `Angler.tsx`, `PondRoom.tsx`, `features/economy/index.ts`, `FishingView.tsx`, `a/[slug]/page.tsx`, `pondgame/lib/api.ts`, `CrowdPreview.tsx`?**
  _High betweenness centrality (0.087) - this node is a cross-community bridge._
- **What connects `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json` to the rest of the system?**
  _5 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `character.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05568627450980392 - nodes in this community are weakly interconnected._
- **Why does `defaultStore()` connect `lib/slots/index.ts` to `writeLocal`, `pond-api.ts`, `createPondRoom`, `Angler.tsx`, `hall/room.ts`, `SyncStore`, `initialize`, `pondgame/lib/api.ts`, `room-events.ts`, `stage.ts`, `PersonalRoom.tsx`, `wardrobe.ts`, `pond-state.ts`, `atelier/room.ts`, `economy/store.ts`, `createStage`, `earn`, `pond/room.ts`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Should `walk.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12561576354679804 - nodes in this community are weakly interconnected._
- **Why does `three` connect `hall/room.ts` to `atelier.ts`, `character.ts`, `rig.ts`, `remote-visitors.ts`, `scene/ambience.ts`, `hit.ts`, `scene/assets.ts`, `master`, `scene.ts`, `cozy.ts`, `stage.ts`, `room-events.ts`, `pond/art.ts`, `controller.ts`, `atelier/room.ts`, `ambience.ts`, `Web Package Dependencies`, `pond/room.ts`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Should `SketchGuess.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08668076109936575 - nodes in this community are weakly interconnected._