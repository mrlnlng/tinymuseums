# Graph Report - tiny-museum  (2026-11-17)

## Corpus Check
- 511 files · ~301,427 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 82 file(s) not represented in the graph (top: .avif 39, .glb 34, .css 4)

## Summary
- 4573 nodes · 11821 edges · 211 communities (188 shown, 23 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 242 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `21f0bd22`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Character
- walk.ts
- SketchGuess.tsx
- themes.ts
- query
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
- xdog.ts
- pond-boards.ts
- LeaderboardPanel.tsx
- ambience.ts
- core/src/index.ts
- Web Package Dependencies
- Gamifying Tiny Museum — genre direction & engagement research
- atelier.ts
- gallery/page.tsx
- risk.ts
- amplify/tsconfig.json
- 5. Customization menu — what other people are doing
- core/src/index.ts
- DecorController
- Web TSConfig
- Root Package Manifest
- createHallRoom
- domain/sketch.ts
- import-fishing-assets.mjs
- Base TSConfig
- Amplify Build Spec
- sketchguess/lib/api.ts
- stage.ts
- FakeServer
- placeLabel
- Water.tsx
- Worker Package Manifest
- Public Asset Manifest
- wardrobe.ts
- usePondState
- compose-atelier.mjs
- Other visitors
- pond-format.ts
- stage.ts
- economy/store.ts
- CharacterKind
- room.ts
- minimap.ts
- catalog.ts
- domain/guestboard.ts
- Sound Effect Assets
- art-cache.ts
- Custom HTTP Headers
- Sharp Layer Package
- currentMember
- hall/room.ts
- nearby.ts
- .webSocketMessage
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
- slots/store.ts
- pond/room.ts
- members.ts
- Run-Once Schema
- confirm/page.tsx
- FishingView.tsx
- ticket.ts
- visits/page.tsx
- react
- next
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
- performance/page.tsx
- Fishing forest: painted asset pass
- audio/README.md
- .claude/CLAUDE.md
- The Costume Atelier
- Confirmed issues
- rig.ts
- Curating the paintings (2026-11-07)
- ticket/route.ts
- presence/tsconfig.json
- import-home-assets.mjs
- tsconfig.test.json
- app/layout.tsx
- writeLocal
- lib/presence.ts
- Item
- bug-reports.ts
- backend.ts
- hall/room.ts
- handlers.ts
- lib/presence.ts
- initialize
- visits.ts
- ticket/route.ts
- The Moonlit Pond — design
- Pond rework
- env.ts
- Orchestration contract — you plan, DSH workers execute
- tables.ts
- tab-turn.ts
- domain/guestboard.ts
- pond-state.ts
- layout.ts
- app/page.tsx
- hit.ts
- lib/slots/index.ts
- perf.ts
- Walkthrough.tsx
- createPondRoom
- SoundProvider.tsx
- Medium
- Conn
- stampLabel
- painting-open
- rooms.ts
- Multiplayer ("other visitors") — plan v2 (Cloudflare)
- Lobby
- run.ts
- wallet/body.ts
- icon-basket
- reveal.ts
- visit.ts
- app/page.tsx
- bunny-left
- AssetImage
- bunny-right
- logic.ts
- carry.test.ts
- icon-home
- personal/room.ts
- audience.ts
- ticket
- CameraRig
- Storyline (draft, saved 2026-11-17)
- PondTicker.tsx
- BunnyArtist.tsx
- Local end-to-end stress test — 2026-11-06
- media/storage.ts
- draw.py
- Storage
- earn
- useSoundEffects.ts
- BountyPanel.tsx
- Monets Lily Pond: exploration, UX and multiplayer QA
- ArrangeControls.tsx
- member-route.ts
- VitalsReporter.tsx
- pond-api.ts
- AccountSheet
- Your Room: a room you can freely furnish
- S3Storage
- Context
- FilesystemStorage
- formatInteger
- bugs/page.tsx
- 4. Transport: Cloudflare Durable Objects
- scripts
- memberFromRequest
- HallAmbience
- PondRoom.tsx
- messages.ts

## God Nodes (most connected - your core abstractions)
1. `react` - 77 edges
2. `json()` - 74 edges
3. `query()` - 68 edges
4. `PersonalRoom()` - 67 edges
5. `hit()` - 60 edges
6. `limited()` - 54 edges
7. `three` - 45 edges
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
- `Catalogue` --references--> `personalRoomFor()`  [INFERRED]
  docs/custom-room.md → packages/core/src/domain/rooms.ts

## Import Cycles
- None detected.

## Communities (211 total, 23 thin omitted)

### Community 0 - "Character"
Cohesion: 0.09
Nodes (4): Carried, Character, Helm, Matcha

### Community 1 - "walk.ts"
Cohesion: 0.13
Nodes (13): FloorPoint, WalkArea, water, depthAtLift(), DEPTH_SPAN, depthOf(), MAX_DEPTH, PICTURE (+5 more)

### Community 2 - "SketchGuess.tsx"
Cohesion: 0.10
Nodes (32): bestKeyFor(), BURST, clueUrl(), openingPlan(), Phase, pickAtRandom(), prepareSketchGame(), readDifficulty() (+24 more)

### Community 3 - "themes.ts"
Cohesion: 0.06
Nodes (37): Catalogue, Data model (core), 1. Items placed against a zone edge fail to save, and the whole draft reverts, 2. One owned item can be placed many times, 3. Any save rejection throws away all unsaved work, 4. Changes made just before leaving are lost, 5. Fish trophies can be claimed without playing, High (+29 more)

### Community 4 - "query"
Cohesion: 0.07
Nodes (40): AnalyticsPage(), dynamic, CatchExtra, clearCatches(), COLUMNS, grantPearls(), member(), namedMember() (+32 more)

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
Cohesion: 0.09
Nodes (40): AssetManifest, assetUrl(), bitmapTexture(), blankImage(), CAFE_CAT_FRAMES, CharacterSprites, CompressedLoader, elementTexture() (+32 more)

### Community 9 - "SyncStore"
Cohesion: 0.17
Nodes (6): encodeStored(), parseStored(), readStored(), writeStored(), SyncStore, upgrade()

### Community 10 - "machine.ts"
Cohesion: 0.12
Nodes (35): CastMeter(), ReelMeter(), armCast(), BITE_WINDOW, biteGap(), CHARGE_PERIOD, chargePower(), createFishingState() (+27 more)

### Community 11 - "Museum.tsx"
Cohesion: 0.14
Nodes (26): Loading(), PinnedNotes(), AtelierLoading(), CoinFound, ColorRecall, GameDesktop, GuestBoard, HallArranger (+18 more)

### Community 12 - "Test Fakes and Helpers"
Cohesion: 0.12
Nodes (27): deferredFetch(), deviceSlot, FakeEvents, FakeStorage, fixture, fixtureB, fixtureRegistry, fixtureRegistryBoth (+19 more)

### Community 13 - "scene.ts"
Cohesion: 0.05
Nodes (27): disposeDisplayTexture(), HELM_PEDESTAL_FILE, prefersAvif(), HiddenCoin, createNotes(), createPedestal(), Notes, Pedestal (+19 more)

### Community 14 - "cozy.ts"
Cohesion: 0.06
Nodes (60): alphaCanvas(), ATELIER_PROPS, AtelierImage, atticWindowCanvas(), bareBulbCanvas(), boardsCanvas(), canvasTexture(), ceilingGeometry() (+52 more)

### Community 15 - "actions.ts"
Cohesion: 0.17
Nodes (25): dynamic, LocationsPage(), back(), deleteGuestNoteAction(), discardLocationAction(), isThrottled(), nudgeInRowAction(), PLACE_ERRORS (+17 more)

### Community 16 - "room-events.ts"
Cohesion: 0.17
Nodes (28): ChatButton(), REFUSED, joinRoom(), Options, STANDING, emit(), getPeople(), isInRoom() (+20 more)

### Community 17 - "outbox.test.ts"
Cohesion: 0.27
Nodes (12): OUTBOX_CAP, outboxAdd(), outboxDue(), OutboxEntry, outboxFail(), outboxRemove(), RETRY_BASE_MS, RETRY_MAX_MS (+4 more)

### Community 18 - "ref_node_assert"
Cohesion: 0.12
Nodes (28): defineSlot(), docBytes(), SLOTS, byAtThenKey(), encoded(), latest, mapOf(), maxNumber() (+20 more)

### Community 19 - "amplify/package.json"
Cohesion: 0.17
Nodes (14): devDependencies, @aws-amplify/backend@^1.14.0, @aws-amplify/backend-cli@^1.6.0, aws-cdk-lib@^2.180.0, constructs@^10.3.0, name, private, scripts (+6 more)

### Community 20 - "PersonalRoom.tsx"
Cohesion: 0.09
Nodes (52): errorReason(), Offer, overDrawer(), PersonalRoom(), canPlaceNew(), carriedTo(), carryEnd(), carryMove() (+44 more)

### Community 21 - "prepare-models.mjs"
Cohesion: 0.10
Nodes (26): paintedCostume(), BODIES, bruce, BRUCE_FIT, BRUCE_PLACE, bunny, CARDIGAN_TIE, CROWN (+18 more)

### Community 22 - "Traversal"
Cohesion: 0.11
Nodes (4): clamp(), fixture(), jump(), Traversal

### Community 23 - "core/package.json"
Cohesion: 0.06
Nodes (40): dependencies, @aws-sdk/client-s3@^3.1121.0, @aws-sdk/s3-request-presigner@^3.1121.0, bcryptjs@^2.4.3, obscenity@^0.4.6, pg@^8.13.1, sharp@^0.33.5, thumbhash@^0.1.1 (+32 more)

### Community 24 - "ensureEpoch"
Cohesion: 0.22
Nodes (15): GET(), intParam(), GET(), sketchPool, unavailable(), currentEpoch(), ensureEpoch(), epochById() (+7 more)

### Community 25 - "xdog.ts"
Cohesion: 0.27
Nodes (7): renderSketch(), blur(), kernel(), toGray(), XDOG_DEFAULTS, xdogInk(), XdogOptions

### Community 26 - "pond-boards.ts"
Cohesion: 0.13
Nodes (21): insertCatch(), compare(), DexRow, displayName(), FeedRow, getPondFeed(), getPondLeaderboard(), NameRow (+13 more)

### Community 27 - "LeaderboardPanel.tsx"
Cohesion: 0.24
Nodes (13): PondBoardId, PondBoardPeriod, PondBoardRow, PondLeaderboard, formatOdds(), nextMondayUtc(), BoardRow(), BOARDS (+5 more)

### Community 28 - "ambience.ts"
Cohesion: 0.13
Nodes (30): blade(), bloom(), BLOOMS, createPondAmbience(), update(), fishTexture(), frond(), FRONT_ROWS (+22 more)

### Community 29 - "core/src/index.ts"
Cohesion: 0.05
Nodes (111): addBait(), baitOf(), PondBoardMe, PondBoardRow, PondFeedItem, Rep, bountyCatches(), BountyCatchRow (+103 more)

### Community 30 - "Web Package Dependencies"
Cohesion: 0.10
Nodes (27): dependencies, embla-carousel-react@^8.6.0, motion@^13.1.1, next@^15.0.3, react@^19.0.0, react-dom@^19.0.0, swr@^2.5.1, three@^0.169.0 (+19 more)

### Community 31 - "Gamifying Tiny Museum — genre direction & engagement research"
Cohesion: 0.10
Nodes (19): 0.1 The core experience, 0.2 Systems that make gamification cheap to build, 0.3 Constraints that shape any recommendation, 0. What the game is today (the deep dive), 1.1 The landscape (seven candidates, with verdicts), 1.2 Recommendation: a **cozy gallery life-sim** — "the gallery you live in", 1.3 The five design pillars the genre implies, 1. Genre direction (+11 more)

### Community 32 - "atelier.ts"
Cohesion: 0.05
Nodes (39): AtelierImage, BuiltRoom, Cardigan, CARDIGAN_NAMES, CHARACTER_NAMES, Control, refresh(), disposeAtelierArt() (+31 more)

### Community 33 - "gallery/page.tsx"
Cohesion: 0.15
Nodes (21): dynamic, GalleryPage(), createCodeAction(), deleteCodeAction(), deletePieceAction(), updatePieceAction(), CodeRow, CodesSection() (+13 more)

### Community 34 - "risk.ts"
Cohesion: 0.13
Nodes (28): Hud(), HudProps, HudWagerChip, WagerPicker(), chooseTier(), WagerPickerProps, chainChipLabel(), clampWagerStake() (+20 more)

### Community 35 - "amplify/tsconfig.json"
Cohesion: 0.20
Nodes (9): compilerOptions, module, moduleResolution, noUnusedLocals, noUnusedParameters, exclude, extends, include (+1 more)

### Community 36 - "5. Customization menu — what other people are doing"
Cohesion: 0.12
Nodes (16): 1. The target: what "Claude Opus 5.5" actually means, 2. Where your harness stands today (live config I read), 3. The honest gap model, 4. Quality levers, ranked by leverage, 5. Customization menu — what other people are doing, 6. Recommended starting kit for *your* profile, 7. What I can apply for you right now (needs your go-ahead), A. Prompt & persona (most common quality customizations) (+8 more)

### Community 37 - "core/src/index.ts"
Cohesion: 0.06
Nodes (53): member(), now, piece(), randomId(), today, applyClaim(), baitCounts(), baitOf() (+45 more)

### Community 38 - "DecorController"
Cohesion: 0.04
Nodes (18): Carry, Job, PersonalRoomProps, createDecorController(), canvasRect(), targetRise(), toScreen(), DecorController (+10 more)

### Community 39 - "Web TSConfig"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 40 - "Root Package Manifest"
Cohesion: 0.06
Nodes (36): [, width, height], description, devDependencies, concurrently@^9.1.0, esbuild@^0.24.0, ktx2-encoder@^0.6.0, maxrects-packer@^2.7.3, playwright@^1.63.0 (+28 more)

### Community 41 - "createHallRoom"
Cohesion: 0.16
Nodes (14): createSitting(), hop(), createHallRoom(), buildRoom(), cafeRoom(), entranceRoom(), galleryRoom(), giftShopRoom() (+6 more)

### Community 42 - "domain/sketch.ts"
Cohesion: 0.11
Nodes (26): listPieces(), pieceImageUrl(), PieceRow, toPieceDto(), GalleryRow, planSketchRound(), SKETCH_CHOICES, SketchCandidate (+18 more)

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
Cohesion: 0.23
Nodes (13): sameOriginUrl(), PreparedGame, decodeImage(), fetchBitmap(), fetchRound(), guarded(), LoadedRound, loadInk() (+5 more)

### Community 47 - "stage.ts"
Cohesion: 0.06
Nodes (31): ROOM_ART, RoomArt, EXITS, isDoor(), linkedDoor(), LINKS, ActiveRoom, RoomOptions (+23 more)

### Community 48 - "FakeServer"
Cohesion: 0.18
Nodes (3): FakeServer, SlotState, SlotDef

### Community 49 - "placeLabel"
Cohesion: 0.07
Nodes (18): Mark, CafeMarks, GiftShopMarks, GuestBoard, LobbyMarks, CafeLink, ComingSoonNote, FunZoneSign (+10 more)

### Community 50 - "Water.tsx"
Cohesion: 0.07
Nodes (38): AmbientShadow, box(), BUCKET, bunnyBox(), easeOut(), Glint, LEFT_STYLE, lineColour() (+30 more)

### Community 51 - "Worker Package Manifest"
Cohesion: 0.14
Nodes (14): dependencies, @tiny/core@*, exports, ./lambda, @tiny/core, main, name, private (+6 more)

### Community 52 - "Public Asset Manifest"
Cohesion: 0.12
Nodes (15): artworks, bunny, size, floor, size, fonts, icon-no-photos, size (+7 more)

### Community 53 - "wardrobe.ts"
Cohesion: 0.09
Nodes (43): AtelierPage(), dynamic, metadata, useWallet(), allowedCharacter(), OwnedSnapshot, owns(), walletReady() (+35 more)

### Community 54 - "usePondState"
Cohesion: 0.39
Nodes (6): PearlIcon(), getPondStateSnapshot(), subscribePondState(), usePondState(), PondHud(), PondHudProps

### Community 55 - "compose-atelier.mjs"
Cohesion: 0.12
Nodes (10): body, dressLayer, dressWidth, floralWidth, hanger, MANNEQUIN_CANVAS, mask, root (+2 more)

### Community 56 - "Other visitors"
Cohesion: 0.29
Nodes (6): How it plays, Other visitors, Privacy, Running it in production, Running it locally, Staying consistent

### Community 57 - "pond-format.ts"
Cohesion: 0.13
Nodes (26): PondDex, EXCHANGE_DAILY_STAMPS, EXCHANGE_PEARLS_PER_STAMP, FISH_ART, fishArt(), formatPercent(), formatShortSizeCm(), ODDS_BAIT (+18 more)

### Community 58 - "stage.ts"
Cohesion: 0.09
Nodes (14): Pose, RoomContents, Decisions (2026-11-05), Follow-ups after Phases 4–7, Model (`apps/web/src/features/rooms/types.ts`), Personal room polish (2026-11-05), Phase 2: hall on the stage, Phase 3: one persistent stage (+6 more)

### Community 59 - "economy/store.ts"
Cohesion: 0.15
Nodes (30): buy(), cappedTracked, EMPTY_BAIT, EMPTY_TODAY, ensureStarted(), eventListeners, flushOutbox(), isBaitCounts() (+22 more)

### Community 60 - "CharacterKind"
Cohesion: 0.07
Nodes (9): AtelierActions, AtelierRoom, ClothingItem, Display, CollectionRoom, CharacterKind, Options, Wardrobe (+1 more)

### Community 61 - "room.ts"
Cohesion: 0.14
Nodes (28): admitted(), Attachment, farewell(), GHOST_MS, HELLO_TIMEOUT_MS, holdsOf(), MAX_WAITING_PER_IP, newAttachment() (+20 more)

### Community 62 - "minimap.ts"
Cohesion: 0.07
Nodes (36): place(), ATELIER_DOOR, createMinimap(), draw(), drawRoom(), floors(), follow(), sketchOf() (+28 more)

### Community 63 - "catalog.ts"
Cohesion: 0.19
Nodes (16): CatalogItem, CatalogKind, FREE_CHARACTERS, isBuyable(), isCatalogItem(), ITEMS, ItemSlot, priceOf() (+8 more)

### Community 64 - "domain/guestboard.ts"
Cohesion: 0.16
Nodes (19): BoardScreen(), ComposeScreen(), ComposeScreenProps, blankDraft(), GuestBoard(), GuestBoardProps, View, ReadScreen() (+11 more)

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

### Community 69 - "currentMember"
Cohesion: 0.12
Nodes (21): GET(), POST(), PER_MEMBER, PER_MEMBER, BOARDS, GET(), oneOf(), PER_VISITOR (+13 more)

### Community 70 - "hall/room.ts"
Cohesion: 0.07
Nodes (28): MuseumProps, BULBS, createHallAmbience(), finish(), glowTexture(), mulberry(), painted(), vignetteTexture() (+20 more)

### Community 71 - "nearby.ts"
Cohesion: 0.18
Nodes (5): Nearby, NearbyReach, RoomSpan, reach, strip

### Community 72 - ".webSocketMessage"
Cohesion: 0.40
Nodes (4): attachmentOf(), roomFull(), Room, sendTo()

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
Nodes (18): ArtByRoom, blank(), colorAt(), disposePondArt(), EDGE_BAND, EDGE_BANDS, EDGE_OVERLAP, edgeTexture() (+10 more)

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
Cohesion: 0.13
Nodes (21): MuseumLayout(), CoinToast(), Toast, WalletProvider(), serverSnapshot, useEarnEvents(), buildClaim(), BuiltClaim (+13 more)

### Community 84 - "presence/package.json"
Cohesion: 0.14
Nodes (16): dependencies, @tiny/core@*, devDependencies, @cloudflare/workers-types@5.20261016.1, wrangler@4.151.1, @tiny/core, name, private (+8 more)

### Community 85 - "createAtelierRoom"
Cohesion: 0.28
Nodes (21): aspectOf(), createAtelierRoom(), buildCollection(), form(), buildEntrance(), buildRoom(), buildWardrobe(), picture() (+13 more)

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
Cohesion: 0.25
Nodes (15): loop(), shutdown(), sleep(), sweepStale(), DrainResult, handler(), repairFrames(), repairUnframed() (+7 more)

### Community 93 - "hit"
Cohesion: 0.12
Nodes (46): POST(), POST(), POST(), PER_MEMBER, PUT(), PER_MEMBER, POST(), catchIdOf() (+38 more)

### Community 94 - "slots/store.ts"
Cohesion: 0.15
Nodes (16): ANON_PREFIX, anonKey(), deviceKey(), isMemberSlotKey(), listKeys(), MEMBER_KEY, memberKey(), memberPrefix() (+8 more)

### Community 95 - "pond/room.ts"
Cohesion: 0.11
Nodes (24): FAR_LIFT, FAR_SCALE, liftAt(), pathHalfWidth(), pathX(), PondPath, scaleAt(), path (+16 more)

### Community 96 - "members.ts"
Cohesion: 0.10
Nodes (41): Code, 3.2 Chosen names (members), registry, started(), hashPassword(), verifyPassword(), canonicalEmail(), changePassword() (+33 more)

### Community 104 - "confirm/page.tsx"
Cohesion: 0.33
Nodes (7): ConfirmFollow(), dynamic, dynamic, Unsubscribe(), FollowNotice(), confirmFollow(), unsubscribe()

### Community 105 - "FishingView.tsx"
Cohesion: 0.12
Nodes (15): CONFETTI_COLORS, ConfettiPiece, makeConfetti(), RevealCard(), TIER_MS, TIER_SFX, useCountUp(), chainOffer (+7 more)

### Community 106 - "ticket.ts"
Cohesion: 0.14
Nodes (18): fetch(), Env, parseRoom(), decoder, encoder, fromBase64Url(), HmacKey, isOwn() (+10 more)

### Community 107 - "visits/page.tsx"
Cohesion: 0.29
Nodes (9): amount(), duration(), dynamic, LANDMARKS, PAGES, RANGES, share(), VisitsPage() (+1 more)

### Community 108 - "react"
Cohesion: 0.12
Nodes (23): BugReportHost(), BugReportSheet, BugReportSheet(), Status, collectContext(), inAppBrowser(), onOpenBugReport(), openBugReport() (+15 more)

### Community 109 - "next"
Cohesion: 0.17
Nodes (13): config, SECURITY_HEADERS, dateFormat, dynamic, GuestBoardPage(), dynamic, StudioHome(), Register() (+5 more)

### Community 110 - "graftCostume"
Cohesion: 0.27
Nodes (14): canvasFit(), compose(), graftCostume(), copyAccessor(), copyMaterial(), copyMesh(), copyTexture(), copyView() (+6 more)

### Community 111 - "pondgame/lib/api.ts"
Cohesion: 0.11
Nodes (42): CAST_ERRORS, coarsePointer(), FishingView(), initialEasyReel(), isTyping(), LOST, PondGameProps, Toast (+34 more)

### Community 112 - "worker/tsconfig.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 113 - "core/tsconfig.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 114 - "import-hall-assets.mjs"
Cohesion: 0.13
Nodes (11): BASEBOARD, CURTAIN, drop, EXPECTED, manifest, manifestPath, masters, root (+3 more)

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
Cohesion: 0.12
Nodes (15): Adding a character, Adding a costume, Art not supplied as files, Bruce's Chronicles, Checked against the mocks (2026-11-07), Code, Costume fit review, Fitting clothes to other characters (+7 more)

### Community 125 - "Confirmed issues"
Cohesion: 0.11
Nodes (18): Confirmed issues, E2E-002 — Valid edge placement rejected through floating-point precision, E2E-003 — One owned prop can be placed multiple times, E2E-004 — Reload before autosave silently loses the latest placement, E2E-005 — Failed save and failed Done have no visible mobile explanation, E2E-006 — Restoring connectivity does not retry a failed draft save, E2E-007 — Keyboard activation cannot place drawer items, E2E-008 — Creating an account from My Room leaves the signed-in user on the sign-in prompt (+10 more)

### Community 126 - "rig.ts"
Cohesion: 0.04
Nodes (81): CrowdPreviewPage(), RigPreviewPage(), CrowdPreview(), draw(), KINDS, Stats, Window, NEXT (+73 more)

### Community 127 - "Curating the paintings (2026-11-07)"
Cohesion: 0.13
Nodes (14): 1. The registry and the table, 2. The studio's Location picker, 3. The rooms draw what is placed, 4. Credits, 5. Retiring self-serve artists, Building it, Curating the paintings (2026-11-07), Decided (+6 more)

### Community 128 - "ticket/route.ts"
Cohesion: 0.10
Nodes (29): POST(), POST(), POST(), GLOBAL, PER_IP, POST(), GET(), PER_VISITOR (+21 more)

### Community 129 - "presence/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, types, exclude, extends, include, ../../tsconfig.base.json

### Community 130 - "import-home-assets.mjs"
Cohesion: 0.10
Nodes (17): file(), DOOR, DOOR_BACKDROP, drop, FURNITURE, manifest, manifestPath, masters (+9 more)

### Community 131 - "tsconfig.test.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 132 - "app/layout.tsx"
Cohesion: 0.15
Nodes (14): bethEllen, inspiratiq, metadata, notoSans, RootLayout(), sniglet, viewport, SoundContext (+6 more)

### Community 133 - "writeLocal"
Cohesion: 0.20
Nodes (16): ColorRecall(), ColorRecallProps, Phase, readBest(), ColorRound, undoAdminUnlock(), loadColorRecall(), saveIfHigher() (+8 more)

### Community 134 - "lib/presence.ts"
Cohesion: 0.14
Nodes (7): INTERPOLATION_DELAY_MS, PEER_TIMEOUT_MS, PeerTable, positionAt(), Sample, look, Peer

### Community 135 - "Item"
Cohesion: 0.13
Nodes (4): Room, Presence, Item, Refusal

### Community 136 - "bug-reports.ts"
Cohesion: 0.16
Nodes (16): MAX_BUG_CONTACT, MAX_BUG_ERRORS, MAX_BUG_MESSAGE, BugReport, BugReportDto, BugReportRejected, BugRow, CONTEXT_KEYS (+8 more)

### Community 137 - "backend.ts"
Cohesion: 0.15
Nodes (12): amplifyDir, backend, everyMinutes, mediaBucket, missing, repoRoot, REQUIRED, setting() (+4 more)

### Community 138 - "hall/room.ts"
Cohesion: 0.09
Nodes (40): Assets, AtelierArt, CUTS, disposeBoards(), plane(), ROPE_CUTS, ropeSlices(), sliceOf() (+32 more)

### Community 139 - "handlers.ts"
Cohesion: 0.15
Nodes (22): confirmedFollowers(), handleDerivatives(), handleNotifyFollowers(), handleSealEpoch(), Job, newWorkNotice(), FRAME_FORMAT, FRAME_VERSION (+14 more)

### Community 140 - "lib/presence.ts"
Cohesion: 0.09
Nodes (22): Entry, Connect, fetchTicket, HEARTBEAT_MS, HIDDEN_LIMIT_MS, RETRY_MS, sameLook(), samePose() (+14 more)

### Community 141 - "initialize"
Cohesion: 0.13
Nodes (24): createPixelRatioGovernor(), PIXEL_RATIO_STEPS, boundedCameraX(), createNearby(), createStage(), closeEntry(), enter(), initialize() (+16 more)

### Community 142 - "visits.ts"
Cohesion: 0.15
Nodes (14): count(), currentSalts(), DEVICES, loadSalts(), parseVisitReport(), Salts, valid, Visitor (+6 more)

### Community 143 - "ticket/route.ts"
Cohesion: 0.15
Nodes (15): PER_MEMBER, PUT(), GLOBAL, PER_IP, POST(), PER_IP, POST(), presenceUrl() (+7 more)

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
Cohesion: 0.11
Nodes (30): BaitTray(), BaitTrayProps, debugSpecies(), debugVariant(), GuestRollOptions, guestTreasure(), rollGuest(), BAIT (+22 more)

### Community 149 - "tab-turn.ts"
Cohesion: 0.16
Nodes (5): createTabTurn(), TabTurn, tab(), TurnEnv, TurnMessage

### Community 150 - "domain/guestboard.ts"
Cohesion: 0.17
Nodes (15): GET(), decodeCursor(), encodeCursor(), GuestNoteInput, GuestNoteRejected, listGuestNotes(), PER_VISITOR, toDto() (+7 more)

### Community 151 - "pond-state.ts"
Cohesion: 0.27
Nodes (13): PondStateView, PondTier, ensurePondStateStarted(), GUEST, listeners, LOADING, PondStateSnapshot, publish() (+5 more)

### Community 152 - "layout.ts"
Cohesion: 0.17
Nodes (10): cafeAfterIndex(), comingSoonWidth(), computeLayout(), cutRooms(), HallLayout, HallRoomKind, HallRoomSpan, hasPedestal() (+2 more)

### Community 153 - "app/page.tsx"
Cohesion: 0.21
Nodes (13): dynamic, Hall(), MuseumPage(), [BRAND_OWNER, ...BRAND_REST], CurrentlyShowing(), Decor(), dynamic, LandingPage() (+5 more)

### Community 154 - "hit.ts"
Cohesion: 0.17
Nodes (12): CoinWall, createHiddenCoin(), Spot, AlphaMap, alphaMapFor(), alphaMaps, buildAlphaMap(), isPaintedAt() (+4 more)

### Community 155 - "lib/slots/index.ts"
Cohesion: 0.07
Nodes (26): PresencePreviewPage(), AccountHost(), AccountSheet, NAME_ERRORS, Pending, View, KeepOnOtherDevices(), AccountMode (+18 more)

### Community 156 - "perf.ts"
Cohesion: 0.22
Nodes (4): createPerfMeter(), isEnabled(), PerfMeter, PerfSnapshot

### Community 157 - "Walkthrough.tsx"
Cohesion: 0.13
Nodes (22): BACKDROP_STYLE, MoreArrow(), NavArrow(), Props, SLIDE, Walkthrough(), XIcon(), decodedFrames (+14 more)

### Community 158 - "createPondRoom"
Cohesion: 0.32
Nodes (13): createPondRoom(), approach(), busy(), finishWalk(), goTo(), leave(), move(), nearest() (+5 more)

### Community 159 - "SoundProvider.tsx"
Cohesion: 0.20
Nodes (8): EFFECTS, EffectSpec, FOOTSTEPS, SoundEffects, gestured(), OPTIONS, STATIC_BASE, staticUrl()

### Community 160 - "Medium"
Cohesion: 0.13
Nodes (14): glowSprite(), LandingFx(), onClick(), onVisibility(), tick(), Mote, 10. Long names run off the name sign, 11. The rooms API skips the stale-tab member check (+6 more)

### Community 161 - "Conn"
Cohesion: 0.27
Nodes (5): send(), connectWebSocket(), SocketHandlers, Conn, message()

### Community 162 - "stampLabel"
Cohesion: 0.29
Nodes (6): Purse(), Stamp(), STAMP_ASPECT, STAMP_SVG, STAMP_URL, stampLabel()

### Community 163 - "painting-open"
Cohesion: 0.50
Nodes (4): file, kilobytes, seconds, painting-open

### Community 164 - "rooms.ts"
Cohesion: 0.11
Nodes (41): artist(), member(), piece(), randomId(), sealEpoch(), discardLocation(), hasUnpublished(), nudgeInRow() (+33 more)

### Community 165 - "Multiplayer ("other visitors") — plan v2 (Cloudflare)"
Cohesion: 0.14
Nodes (13): ScreenChrome(), 0. Summary, 10. Decisions, 1. Product contract changes (approved 2026-10-31), 2. What already exists that this builds on, 3.1 Generated names (everyone has one), 3. Names, 5.1 Emotes (v1) (+5 more)

### Community 167 - "run.ts"
Cohesion: 0.20
Nodes (7): admin, childEnv, client, database, fresh, migrations, target

### Community 168 - "wallet/body.ts"
Cohesion: 0.26
Nodes (11): PER_MEMBER, POST(), baitIdOf(), integerOffset(), isRecord(), itemIdOf(), MAX_CLAIM_BATCH, ParsedWalletClaim (+3 more)

### Community 169 - "icon-basket"
Cohesion: 0.67
Nodes (3): icon-basket, file, vector

### Community 170 - "reveal.ts"
Cohesion: 0.17
Nodes (9): PlaceInfo, InkMap, planGame(), ROUND_SPREAD, createReveal(), compose(), PENCIL, SketchReveal (+1 more)

### Community 171 - "visit.ts"
Cohesion: 0.26
Nodes (12): state(), flush(), startVisit(), visibleMs(), VisitState, VisitReport, VisitSummary, isVisitFeature() (+4 more)

### Community 172 - "app/page.tsx"
Cohesion: 0.18
Nodes (14): Loading(), DENSITY_MEDIA, HallPreload(), HallSkeleton(), assetEntry, assetVariant(), AtlasGroup, AtlasSheet (+6 more)

### Community 174 - "AssetImage"
Cohesion: 0.19
Nodes (11): BoardScreenProps, PinnedNotesProps, ReadScreenProps, NOTE_PLACES, NotePlace, coin, CoinFound(), CoinFoundProps (+3 more)

### Community 176 - "logic.ts"
Cohesion: 0.07
Nodes (42): loadHallArranger(), DecorDrawer, DecorDrawerProps, SLOT_LABELS, Tab, TABS, HallArranger(), HallArrangerProps (+34 more)

### Community 177 - "carry.test.ts"
Cohesion: 0.29
Nodes (11): CARRY_CAP, carryAdd(), CarryEntry, carryPrune(), carryRemove(), chunk(), ClaimRequest, tzOffsetNow() (+3 more)

### Community 179 - "personal/room.ts"
Cohesion: 0.07
Nodes (29): createPersonalRoom(), light(), shade(), showArrangement(), showLevel(), signFilter(), DOOR_SIGN, gloomFor() (+21 more)

### Community 180 - "audience.ts"
Cohesion: 0.10
Nodes (24): ArtistPage(), dynamic, generateMetadata(), GET(), ALLOWED, POST(), GET(), FollowForm() (+16 more)

### Community 182 - "CameraRig"
Cohesion: 0.21
Nodes (6): coverFloorTransition(), CameraRig, createRoomPassage(), fixture(), Runtime, Phase 1: stage + atelier

### Community 183 - "Storyline (draft, saved 2026-11-17)"
Cohesion: 0.18
Nodes (10): Arc (soft, no fail state), Built so far, How it ties to what exists, Mystery hook, Next tasks (when picked up), Open questions, Premise, Seed (the owner's words) (+2 more)

### Community 184 - "PondTicker.tsx"
Cohesion: 0.29
Nodes (11): fetchPondFeed(), PondFeedItem, catchLabel(), formatSizeCm(), speciesFor(), speciesName(), speciesTier(), isGolden() (+3 more)

### Community 185 - "BunnyArtist.tsx"
Cohesion: 0.09
Nodes (24): between(), CAT, Edge, EDGES, runLandingCat(), choosePeeker(), peek(), walk() (+16 more)

### Community 186 - "Local end-to-end stress test — 2026-11-06"
Cohesion: 0.09
Nodes (20): 13. Pages that redirect or don't exist answer 200, 14. Error codes reveal which room slugs exist, 15. The name sign slides under the top-right buttons in Decorate, 16. Level-up celebrations can be farmed, 17. No hint of where things are after panning away, 18. Too many items is only discovered by the server, 19. Development-only: page payloads include the full room row, Checked and fine (+12 more)

### Community 187 - "media/storage.ts"
Cohesion: 0.14
Nodes (22): CONTENT_TYPES, GET(), POST(), UPLOADS_PER_ARTIST, PUT(), deletePiece(), ACCEPTED, createAssetFromUpload() (+14 more)

### Community 189 - "Storage"
Cohesion: 0.20
Nodes (5): renderPieceFrame(), renderPieceSketch(), pieceFrameKey(), pieceSketchKey(), Storage

### Community 190 - "earn"
Cohesion: 0.31
Nodes (10): earn(), emit(), emitEarned(), maybeInvite(), writeSession(), tap(), enterAtelier(), tap() (+2 more)

### Community 191 - "useSoundEffects.ts"
Cohesion: 0.17
Nodes (20): BackgroundMusic, clampVolume(), isDocumentHidden(), Options, useBackgroundMusic(), VISIBILITY_EVENTS, useSoundEffects(), applyMix() (+12 more)

### Community 192 - "BountyPanel.tsx"
Cohesion: 0.36
Nodes (8): PondBounties, formatCountdown(), nextUtcMidnight(), utcDayLabel(), useCountdown(), useNow(), BountyPanel(), dayLabel()

### Community 193 - "Monets Lily Pond: exploration, UX and multiplayer QA"
Cohesion: 0.29
Nodes (6): Browser and interaction coverage, Changes made from the walkthrough, Monets Lily Pond: exploration, UX and multiplayer QA, Multiplayer and load, Practical limits, Regression checks and cleanup

### Community 194 - "ArrangeControls.tsx"
Cohesion: 0.40
Nodes (9): hangAction(), movePieceAction(), unhangAction(), FloorControls(), move(), unhang(), formFor(), StorageControls() (+1 more)

### Community 195 - "member-route.ts"
Cohesion: 0.15
Nodes (22): roomEditor, GET(), PaintingRow, PER_EDITOR, PUT(), versionOf(), PER_EDITOR, POST() (+14 more)

### Community 196 - "VitalsReporter.tsx"
Cohesion: 0.29
Nodes (8): firstPainting(), flush(), Metric, queue, REPORTED, VitalsReporter(), FIRST_PAINTING_MARK, MUSEUM_START_MARK

### Community 197 - "pond-api.ts"
Cohesion: 0.26
Nodes (18): buyPondBait(), claimPondBounty(), errorOf(), exchangePondPearls(), fetchPondBounties(), fetchPondDex(), fetchPondLeaderboard(), fetchPondState() (+10 more)

### Community 198 - "AccountSheet"
Cohesion: 0.29
Nodes (9): AccountSheet(), continueAnyway(), doSignOut(), runDelete(), runName(), submit(), submitDelete(), submitName() (+1 more)

### Community 199 - "Your Room: a room you can freely furnish"
Cohesion: 0.20
Nodes (9): Admin mode (gamma), Decisions (2026-11-17, with the user), Editor (web, `features/rooms/decorate/*`, `PersonalRoom.tsx`), Room look (web, `features/rooms/themes/cozy.ts`, `features/rooms/personal/room.ts`), Scale, Testing locally, What other games do (research, 2026-11-17), Work plan (+1 more)

### Community 203 - "formatInteger"
Cohesion: 0.50
Nodes (9): refreshWalletNow(), formatInteger(), setPondState(), claim(), BaitShop(), buy(), Exchange(), exchange() (+1 more)

### Community 204 - "bugs/page.tsx"
Cohesion: 0.38
Nodes (6): BugReportsPage(), dateFormat, dynamic, summary(), BugContext, listBugReports()

### Community 205 - "4. Transport: Cloudflare Durable Objects"
Cohesion: 0.25
Nodes (8): 4. Transport: Cloudflare Durable Objects, Decision (2026-10-31), Deploying, Identity cannot be forged, Local development and tests, Rooms and capacity, Shape of `apps/presence` (about 200 lines), main()

### Community 206 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, assets:models, build, dev, start, typecheck

### Community 207 - "memberFromRequest"
Cohesion: 0.53
Nodes (4): GET(), GET(), memberFromRequest(), exportWallet()

### Community 210 - "PondRoom.tsx"
Cohesion: 0.10
Nodes (25): Loading(), metadata, PondPage(), loadGameDesktop(), GameDesktop(), GameDesktopProps, MinigameFrame(), Minigame (+17 more)

### Community 219 - "messages.ts"
Cohesion: 0.43
Nodes (5): checkMessage(), INVISIBLE, MESSAGE_MAX, MessageCheck, normalizeMessage()

## Knowledge Gaps
- **5 isolated node(s):** `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1464 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **23 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `SketchGuess.tsx`, `app/layout.tsx`, `writeLocal`, `Museum.tsx`, `Test Fakes and Helpers`, `room-events.ts`, `PersonalRoom.tsx`, `tables.ts`, `app/page.tsx`, `lib/slots/index.ts`, `LeaderboardPanel.tsx`, `Walkthrough.tsx`, `Web Package Dependencies`, `SoundProvider.tsx`, `Medium`, `gallery/page.tsx`, `risk.ts`, `AssetImage`, `stage.ts`, `logic.ts`, `Water.tsx`, `audience.ts`, `wardrobe.ts`, `usePondState`, `PondTicker.tsx`, `pond-format.ts`, `useSoundEffects.ts`, `domain/guestboard.ts`, `BountyPanel.tsx`, `ArrangeControls.tsx`, `VitalsReporter.tsx`, `PondRoom.tsx`, `features/economy/index.ts`, `FishingView.tsx`, `pondgame/lib/api.ts`, `rig.ts`?**
  _High betweenness centrality (0.092) - this node is a cross-community bridge._
- **What connects `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json` to the rest of the system?**
  _5 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Character` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._
- **Why does `defaultStore()` connect `pond-state.ts` to `pond-api.ts`, `hall/room.ts`, `currentMember`, `writeLocal`, `createHallRoom`, `SyncStore`, `lib/slots/index.ts`, `initialize`, `pondgame/lib/api.ts`, `room-events.ts`, `stage.ts`, `PersonalRoom.tsx`, `wardrobe.ts`, `slots/store.ts`, `economy/store.ts`, `createPondRoom`, `pond/room.ts`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Should `walk.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12561576354679804 - nodes in this community are weakly interconnected._
- **Why does `three` connect `hall/room.ts` to `atelier.ts`, `DecorController`, `scene/assets.ts`, `hall/room.ts`, `scene.ts`, `initialize`, `ambience.ts`, `room-events.ts`, `placeLabel`, `pond/art.ts`, `stage.ts`, `cozy.ts`, `prepare-models.mjs`, `Web Package Dependencies`, `hit.ts`, `perf.ts`, `rig.ts`, `pond/room.ts`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Should `SketchGuess.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09815078236130868 - nodes in this community are weakly interconnected._