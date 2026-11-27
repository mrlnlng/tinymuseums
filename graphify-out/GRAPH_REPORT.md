# Graph Report - tiny-museum  (2026-11-26)

## Corpus Check
- 588 files · ~355,871 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 110 file(s) not represented in the graph (top: .avif 60, .glb 38, .css 7)

## Summary
- 5215 nodes · 13617 edges · 225 communities (191 shown, 34 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 267 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `bfc57e89`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- AtelierKeeps.tsx
- locations.ts
- SketchGuess.tsx
- DoorEditor.tsx
- builtUrl
- round.ts
- floor.ts
- Core Asset Manifest
- scene/assets.ts
- stage.ts
- machine.ts
- Museum.tsx
- Test Fakes and Helpers
- scene.ts
- cozy.ts
- logic.ts
- room-events.ts
- schedule.ts
- ref_node_assert
- amplify/package.json
- PersonalRoom.tsx
- prepare-models.mjs
- Traversal
- core/package.json
- hitForVisitor
- members.ts
- getStorage
- pond-api.ts
- ambience.ts
- core/src/index.ts
- Web Package Dependencies
- Gamifying Tiny Museum — genre direction & engagement research
- AssetImage
- hall/room.ts
- risk.ts
- amplify/tsconfig.json
- 5. Customization menu — what other people are doing
- personal/room.ts
- domain/sketch.ts
- Web TSConfig
- Root Package Manifest
- query
- createHallRoom
- import-fishing-assets.mjs
- Base TSConfig
- Amplify Build Spec
- sketch/route.ts
- actions.ts
- themes.ts
- env.ts
- Water.tsx
- Worker Package Manifest
- Public Asset Manifest
- catalog.ts
- atelier.ts
- compose-atelier.mjs
- defaultStore
- pond-format.ts
- tab-turn.ts
- economy/store.ts
- sketchguess/lib/api.ts
- room.ts
- minimap.ts
- wander.test.ts
- domain/guestboard.ts
- Sound Effect Assets
- art-cache.ts
- Custom HTTP Headers
- Sharp Layer Package
- walk
- scene/ambience.ts
- reveal.ts
- Confirmed issues
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
- wander.ts
- presence/package.json
- createAtelierRoom
- Asset pipeline: fast loading without losing sharpness
- Guest Board SQL Schema
- Landscape Frame Asset
- GuideTalk.tsx
- Bug Reports SQL Schema
- Vitals SQL Schema
- createNpcLayer
- snapshot.ts
- pond/room.ts
- Other visitors
- Run-Once Schema
- pond/room.ts
- FishingView.tsx
- AtelierRoom
- hang-tag.ts
- layout.ts
- json
- graftCostume
- pondgame/lib/api.ts
- worker/tsconfig.json
- core/tsconfig.json
- import-home-assets.mjs
- How to Design for Failures — ByteByteGo Newsletter
- Worker instructions — DSH headless agents
- Backend
- protocol.ts
- Costume gallery doorway
- Item
- Fishing forest: painted asset pass
- audio/README.md
- .claude/CLAUDE.md
- The Costume Atelier
- PondRoom.tsx
- bug-reports.ts
- ClosetView.tsx
- wallet/body.ts
- presence/tsconfig.json
- wallet.ts
- tsconfig.test.json
- rooms.ts
- Approved v4 bunny in the hall
- peers.ts
- exports
- visits/page.tsx
- ensureEpoch
- Conn
- room-places.ts
- bug-reports.ts
- confirm/page.tsx
- PondTicker.tsx
- Walker
- The Moonlit Pond — design
- Pond rework
- initialize
- Orchestration contract — you plan, DSH workers execute
- tables.ts
- lib/presence.ts
- useBackgroundMusic.ts
- defaultStore
- SlotDef
- LandingFx
- CodesSection.tsx
- import-hall-assets.mjs
- getStorage
- Walkthrough.tsx
- createPondRoom
- ref_node_assert
- bake-shopkeeper.mjs
- Atelier: the dressing mirror, and show-don't-tell keeping
- createCozyBackdrop
- import-landing-assets.mjs
- ktx2-atlases.mjs
- Multiplayer ("other visitors") — plan v2 (Cloudflare)
- Lobby
- 4. Transport: Cloudflare Durable Objects
- infra/jobs.ts
- boundedCameraX
- Medium
- HallArranger.tsx
- app/page.tsx
- a/[slug]/page.tsx
- Wardrobe
- LeaderboardPanel.tsx
- HelpGuide.tsx
- visits.ts
- share.ts
- createPlacementLayer
- next
- PerfMeter
- schedule.test.ts
- Storyline (draft, saved 2026-11-17)
- Local end-to-end stress test — 2026-11-06
- bake-pond-path.mjs
- createPersonalRoom
- themes.ts
- draw.py
- VitalsReporter.tsx
- createPixelRatioGovernor
- SyncStore
- db.ts
- Monets Lily Pond: exploration, UX and multiplayer QA
- Cafe
- BunnyArtist.tsx
- AccountSheet
- scripts
- PondPanels.tsx
- handlers.ts
- Sitting
- messages.ts
- rig.ts
- npcs/README.md
- LiveReflection
- nearby.ts
- Low
- MuseumStage.tsx
- SoundProvider.tsx
- app/layout.tsx
- lib/slots/index.ts
- TreeSparkles
- ref_sharp
- doors.sql
- createStage
- Notes
- painting-open
- HelmShare
- slots/store.ts
- icon-basket
- bunny-left
- bunny-right
- icon-home
- ticket

## God Nodes (most connected - your core abstractions)
1. `react` - 88 edges
2. `json()` - 77 edges
3. `query()` - 72 edges
4. `PersonalRoom()` - 67 edges
5. `hit()` - 63 edges
6. `limited()` - 57 edges
7. `three` - 49 edges
8. `next` - 48 edges
9. `Traversal` - 48 edges
10. `createHallRoom()` - 47 edges

## Surprising Connections (you probably didn't know these)
- `Code` --references--> `followOutfit()`  [INFERRED]
  docs/costume-atelier.md → apps/web/src/features/hall/scene/wardrobe.ts
- `Rendering and movement` --references--> `walk()`  [INFERRED]
  docs/bunny-rig-integration.md → apps/web/src/features/landing/cat.ts
- `E2E-009 — Room mutations ignore stale account identity` --references--> `memberFromRequest()`  [INFERRED]
  docs/testing/local-e2e-stress-2026-11-06.md → apps/web/src/shared/lib/member-route.ts
- `Where things stand` --references--> `sealEpoch()`  [INFERRED]
  docs/curation-plan.md → packages/core/src/domain/epoch.ts
- `Checked against the mocks (2026-11-07)` --references--> `view()`  [INFERRED]
  docs/costume-atelier.md → packages/core/src/domain/pond-photos.ts

## Import Cycles
- None detected.

## Communities (225 total, 34 thin omitted)

### Community 0 - "AtelierKeeps.tsx"
Cohesion: 0.11
Nodes (33): openAccount(), CoinToast(), Toast, Purse(), Stamp(), WalletProvider(), serverSnapshot, useEarnEvents() (+25 more)

### Community 1 - "locations.ts"
Cohesion: 0.24
Nodes (23): discardLocation(), hangableOnly(), hasUnpublished(), inUse(), locationStates(), nudgeInRow(), OWNER, placePainting() (+15 more)

### Community 2 - "SketchGuess.tsx"
Cohesion: 0.13
Nodes (24): bestKeyFor(), BURST, clueUrl(), Phase, pickAtRandom(), readDifficulty(), readMode(), SketchGuess() (+16 more)

### Community 3 - "DoorEditor.tsx"
Cohesion: 0.06
Nodes (68): MuseumLayout(), DoorsPage(), dynamic, hallDoorSpan(), doorArtUrl(), loadDoorArt(), loadRoomDoorArt(), pending (+60 more)

### Community 4 - "builtUrl"
Cohesion: 0.29
Nodes (10): Loading(), dynamic, Hall(), MuseumPage(), DENSITY_MEDIA, HallPreload(), HallSkeleton(), MediaPreconnect() (+2 more)

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
Cohesion: 0.06
Nodes (53): AssetManifest, assetUrl(), bitmapTexture(), blankImage(), CAFE_CAT_FRAMES, CompressedLoader, elementTexture(), ENTRANCE_FILES (+45 more)

### Community 9 - "stage.ts"
Cohesion: 0.03
Nodes (54): coverFloorTransition(), CharacterSprites, CameraRig, Carried, Character, Matcha, Viewport, createRoomPassage() (+46 more)

### Community 10 - "machine.ts"
Cohesion: 0.12
Nodes (35): CastMeter(), ReelMeter(), armCast(), BITE_WINDOW, biteGap(), CHARGE_PERIOD, chargePower(), createFishingState() (+27 more)

### Community 11 - "Museum.tsx"
Cohesion: 0.14
Nodes (24): CoinFound, ColorRecall, GameDesktop, GuestBoard, HallArranger, HelpGuide, loadCoinFound(), loadGuestBoard() (+16 more)

### Community 12 - "Test Fakes and Helpers"
Cohesion: 0.12
Nodes (27): deferredFetch(), deviceSlot, FakeEvents, FakeStorage, fixture, fixtureB, fixtureRegistry, fixtureRegistryBoth (+19 more)

### Community 13 - "scene.ts"
Cohesion: 0.04
Nodes (30): MuseumProps, disposeDisplayTexture(), prefersAvif(), HiddenCoin, Helm, createNotes(), createPedestal(), Pedestal (+22 more)

### Community 14 - "cozy.ts"
Cohesion: 0.07
Nodes (47): alphaCanvas(), ATELIER_PROPS, AtelierImage, atticWindowCanvas(), bareBulbCanvas(), boardsCanvas(), canvasTexture(), ceilingTexture() (+39 more)

### Community 15 - "logic.ts"
Cohesion: 0.16
Nodes (10): DecorDrawer, DecorDrawerProps, SLOT_LABELS, Tab, TABS, DrawerCategory, FINISH_SLOTS, FinishSlot (+2 more)

### Community 16 - "room-events.ts"
Cohesion: 0.19
Nodes (25): ChatButton(), REFUSED, joinRoom(), emit(), getPeople(), isInRoom(), isMuted(), muted (+17 more)

### Community 17 - "schedule.ts"
Cohesion: 0.07
Nodes (55): addDwellEmotes(), addEmote(), addGap(), addStand(), addWalk(), along(), buildRoomTable(), buildStayPlan() (+47 more)

### Community 18 - "ref_node_assert"
Cohesion: 0.12
Nodes (27): defineSlot(), docBytes(), SLOTS, byAtThenKey(), encoded(), latest, mapOf(), maxNumber() (+19 more)

### Community 19 - "amplify/package.json"
Cohesion: 0.08
Nodes (26): amplifyDir, backend, everyMinutes, mediaBucket, missing, repoRoot, REQUIRED, setting() (+18 more)

### Community 20 - "PersonalRoom.tsx"
Cohesion: 0.07
Nodes (69): errorReason(), Offer, overDrawer(), PersonalRoom(), canPlaceNew(), carriedTo(), carryEnd(), carryMove() (+61 more)

### Community 21 - "prepare-models.mjs"
Cohesion: 0.06
Nodes (43): paintedCostume(), alongArm(), ARMS, armTurn(), BODIES, bruce, BRUCE_FIT, BRUCE_PLACE (+35 more)

### Community 22 - "Traversal"
Cohesion: 0.08
Nodes (11): JumpPose, clamp(), fixture(), jump(), Traversal, MAX_CATCH_UP_SECONDS, MAX_STEP_SECONDS, movementSteps() (+3 more)

### Community 23 - "core/package.json"
Cohesion: 0.09
Nodes (27): dependencies, @aws-sdk/client-s3@^3.1121.0, @aws-sdk/s3-request-presigner@^3.1121.0, bcryptjs@^2.4.3, obscenity@^0.4.6, pg@^8.13.1, sharp@^0.33.5, thumbhash@^0.1.1 (+19 more)

### Community 24 - "hitForVisitor"
Cohesion: 0.07
Nodes (50): POST(), ALLOWED, PER_VISITOR, POST(), POST(), POST(), POST(), GET() (+42 more)

### Community 25 - "members.ts"
Cohesion: 0.08
Nodes (52): GET(), PER_MEMBER, PUT(), PER_IP, POST(), presenceUrl(), Code, 3.1 Generated names (everyone has one) (+44 more)

### Community 26 - "getStorage"
Cohesion: 0.14
Nodes (19): GET(), PaintingRow, POST(), UPLOADS_PER_ARTIST, POST(), UPLOADS_PER_ARTIST, dynamic, RoomPage() (+11 more)

### Community 27 - "pond-api.ts"
Cohesion: 0.19
Nodes (25): AlbumPanel(), remove(), openCamera(), buyPondBait(), claimPondBounty(), deletePondPhoto(), errorOf(), exchangePondPearls() (+17 more)

### Community 28 - "ambience.ts"
Cohesion: 0.12
Nodes (30): blade(), bloom(), BLOOMS, createPondAmbience(), update(), fishTexture(), frond(), FRONT_ROWS (+22 more)

### Community 29 - "core/src/index.ts"
Cohesion: 0.04
Nodes (140): CatchExtra, COLUMNS, insertCatch(), member(), namedMember(), randomId(), StatePatch, addBait() (+132 more)

### Community 30 - "Web Package Dependencies"
Cohesion: 0.07
Nodes (35): dependencies, embla-carousel-react@^8.6.0, motion@^13.1.1, next@^15.0.3, react@^19.0.0, react-dom@^19.0.0, swr@^2.5.1, three@^0.169.0 (+27 more)

### Community 31 - "Gamifying Tiny Museum — genre direction & engagement research"
Cohesion: 0.10
Nodes (19): 0.1 The core experience, 0.2 Systems that make gamification cheap to build, 0.3 Constraints that shape any recommendation, 0. What the game is today (the deep dive), 1.1 The landscape (seven candidates, with verdicts), 1.2 Recommendation: a **cozy gallery life-sim** — "the gallery you live in", 1.3 The five design pillars the genre implies, 1. Genre direction (+11 more)

### Community 32 - "AssetImage"
Cohesion: 0.16
Nodes (17): BoardScreen(), BoardScreenProps, PinnedNotes(), PinnedNotesProps, ReadScreenProps, messageLength(), StickyNote(), StickyNoteProps (+9 more)

### Community 33 - "hall/room.ts"
Cohesion: 0.06
Nodes (61): Assets, Scenery, CUTS, disposeBoards(), Mark, plane(), ROPE_CUTS, ropeSlices() (+53 more)

### Community 34 - "risk.ts"
Cohesion: 0.12
Nodes (32): Hud(), HudProps, HudWagerChip, WagerPicker(), chooseTier(), WagerPickerProps, CastOptions, PondStateView (+24 more)

### Community 35 - "amplify/tsconfig.json"
Cohesion: 0.20
Nodes (9): compilerOptions, module, moduleResolution, noUnusedLocals, noUnusedParameters, exclude, extends, include (+1 more)

### Community 36 - "5. Customization menu — what other people are doing"
Cohesion: 0.12
Nodes (16): 1. The target: what "Claude Opus 5.5" actually means, 2. Where your harness stands today (live config I read), 3. The honest gap model, 4. Quality levers, ranked by leverage, 5. Customization menu — what other people are doing, 6. Recommended starting kit for *your* profile, 7. What I can apply for you right now (needs your go-ahead), A. Prompt & persona (most common quality customizations) (+8 more)

### Community 37 - "personal/room.ts"
Cohesion: 0.10
Nodes (23): AtelierArt, INSET_DOOR_Z, loadGalleryDoor(), loadGalleryPillar(), loadImage(), pending, HALL_DOOR_FOOT, AtelierArtwork (+15 more)

### Community 38 - "domain/sketch.ts"
Cohesion: 0.10
Nodes (25): listPieces(), pieceImageUrl(), PieceRow, toPieceDto(), GalleryRow, toPiece(), planSketchRound(), SKETCH_CHOICES (+17 more)

### Community 39 - "Web TSConfig"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 40 - "Root Package Manifest"
Cohesion: 0.10
Nodes (22): [, width, height], description, devDependencies, concurrently@^9.1.0, esbuild@^0.24.0, ktx2-encoder@^0.6.0, maxrects-packer@^2.7.3, playwright@^1.63.0 (+14 more)

### Community 41 - "query"
Cohesion: 0.08
Nodes (38): GET(), AnalyticsPage(), dynamic, clearCatches(), grantPearls(), setState(), grantPearls(), analyticsFor() (+30 more)

### Community 42 - "createHallRoom"
Cohesion: 0.14
Nodes (19): COLD_DOOR_HOLD_MS, hallIsReady(), Opening, OPENING_MAX_WAIT_MS, at(), createHallRoom(), buildRoom(), buildRoomContents() (+11 more)

### Community 43 - "import-fishing-assets.mjs"
Cohesion: 0.10
Nodes (12): CANVAS, clear, FONT, FRAME, heights, layout, lossless, manifest (+4 more)

### Community 44 - "Base TSConfig"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, lib, module, moduleResolution (+9 more)

### Community 45 - "Amplify Build Spec"
Cohesion: 0.12
Nodes (16): applications, appRoot, backend, frontend, baseDirectory, files, phases, commands (+8 more)

### Community 46 - "sketch/route.ts"
Cohesion: 0.57
Nodes (6): GET(), sketchPool, unavailable(), epochById(), getSketchPool(), getSketchRound()

### Community 47 - "actions.ts"
Cohesion: 0.06
Nodes (67): BugReportsPage(), dateFormat, dynamic, summary(), dateFormat, dynamic, GuestBoardPage(), dynamic (+59 more)

### Community 48 - "themes.ts"
Cohesion: 0.09
Nodes (23): COLLECTIONS, Catalogue, Data model (core), FULL_ROOM_WIDTH, nextRoomSize(), ROOM_SIZES, RoomSize, roomSizeFor() (+15 more)

### Community 49 - "env.ts"
Cohesion: 0.12
Nodes (14): admin, childEnv, client, database, fresh, migrations, target, SCHEMA_DIR (+6 more)

### Community 50 - "Water.tsx"
Cohesion: 0.07
Nodes (39): AmbientShadow, box(), BUCKET, bunnyBox(), easeOut(), Glint, LEFT_STYLE, lineColour() (+31 more)

### Community 51 - "Worker Package Manifest"
Cohesion: 0.14
Nodes (14): dependencies, @tiny/core@*, exports, ./lambda, @tiny/core, main, name, private (+6 more)

### Community 52 - "Public Asset Manifest"
Cohesion: 0.12
Nodes (15): artworks, bunny, size, floor, size, fonts, icon-no-photos, size (+7 more)

### Community 53 - "catalog.ts"
Cohesion: 0.19
Nodes (17): confirmClean(), CatalogItem, CatalogKind, FREE_CHARACTERS, ITEMS, ItemSlot, expected, slots (+9 more)

### Community 54 - "atelier.ts"
Cohesion: 0.06
Nodes (32): AtelierDoor, AtelierImage, BuiltRoom, Cardigan, CARDIGAN_NAMES, Control, refresh(), disposeAtelierArt() (+24 more)

### Community 55 - "compose-atelier.mjs"
Cohesion: 0.12
Nodes (10): body, dressLayer, dressWidth, floralWidth, hanger, MANNEQUIN_CANVAS, mask, root (+2 more)

### Community 56 - "defaultStore"
Cohesion: 0.24
Nodes (16): ensureStarted(), memberChanged(), publish(), readSession(), undoAdminUnlock(), unlockEverything(), saveIfHigher(), AdminTools() (+8 more)

### Community 57 - "pond-format.ts"
Cohesion: 0.13
Nodes (25): gradeLabel(), EXCHANGE_DAILY_STAMPS, EXCHANGE_PEARLS_PER_STAMP, fishArt(), formatPercent(), ODDS_BAIT, POND_BAIT, POND_PITY_CERTAIN (+17 more)

### Community 58 - "tab-turn.ts"
Cohesion: 0.16
Nodes (5): createTabTurn(), TabTurn, tab(), TurnEnv, TurnMessage

### Community 59 - "economy/store.ts"
Cohesion: 0.07
Nodes (64): CARRY_CAP, carryAdd(), CarryEntry, carryPrune(), carryRemove(), chunk(), buildClaim(), BuiltClaim (+56 more)

### Community 60 - "sketchguess/lib/api.ts"
Cohesion: 0.23
Nodes (13): sameOriginUrl(), PreparedGame, decodeImage(), fetchBitmap(), fetchRound(), guarded(), LoadedRound, loadInk() (+5 more)

### Community 61 - "room.ts"
Cohesion: 0.11
Nodes (32): attachmentOf(), socket(), admitted(), Attachment, farewell(), GHOST_MS, HELLO_TIMEOUT_MS, holdsOf() (+24 more)

### Community 62 - "minimap.ts"
Cohesion: 0.07
Nodes (34): createMinimap(), draw(), drawRoom(), floors(), follow(), sketchOf(), doorPoint(), FALLBACK_TINT (+26 more)

### Community 63 - "wander.test.ts"
Cohesion: 0.15
Nodes (10): NpcRoomInfo, NpcFrame, StayContext, BASE_JOB, context(), L_GROUND, mulberry32(), room() (+2 more)

### Community 64 - "domain/guestboard.ts"
Cohesion: 0.09
Nodes (32): GET(), ComposeScreen(), ComposeScreenProps, blankDraft(), GuestBoard(), GuestBoardProps, View, ReadScreen() (+24 more)

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

### Community 69 - "walk"
Cohesion: 0.18
Nodes (14): between(), CAT, Edge, EDGES, runLandingCat(), choosePeeker(), peek(), walk() (+6 more)

### Community 70 - "scene/ambience.ts"
Cohesion: 0.14
Nodes (13): createHallAmbience(), finish(), glowTexture(), HallAmbience, mulberry(), painted(), vignetteTexture(), Backdrop (+5 more)

### Community 71 - "reveal.ts"
Cohesion: 0.18
Nodes (10): openingPlan(), prepareSketchGame(), InkMap, planGame(), randomRound(), ROUND_SPREAD, createReveal(), PENCIL (+2 more)

### Community 72 - "Confirmed issues"
Cohesion: 0.11
Nodes (18): Confirmed issues, E2E-002 — Valid edge placement rejected through floating-point precision, E2E-003 — One owned prop can be placed multiple times, E2E-004 — Reload before autosave silently loses the latest placement, E2E-005 — Failed save and failed Done have no visible mobile explanation, E2E-006 — Restoring connectivity does not retry a failed draft save, E2E-007 — Keyboard activation cannot place drawer items, E2E-008 — Creating an account from My Room leaves the signed-in user on the sign-in prompt (+10 more)

### Community 73 - "Placement"
Cohesion: 0.05
Nodes (9): Carry, Job, PersonalRoomProps, DecorController, GhostOptions, HighlightArea, PlacementLayer, WorkKind (+1 more)

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
Cohesion: 0.13
Nodes (23): ArtByRoom, colorAt(), decoded(), disposePondArt(), EDGE_BAND, EDGE_BANDS, EDGE_OVERLAP, edgeTexture() (+15 more)

### Community 80 - "createPresence"
Cohesion: 0.15
Nodes (16): createPresence(), drop(), heartbeat(), maybeSend(), onPageHide(), receive(), scheduleRetry(), send() (+8 more)

### Community 81 - "members"
Cohesion: 0.11
Nodes (27): coin_claims, coin_claims_daily, wallet_bait, wallet_items, wallets, member_sessions, member_sessions_member, member_slots (+19 more)

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
Cohesion: 0.10
Nodes (32): aspectOf(), AtelierActions, createAtelierRoom(), buildCollection(), form(), hang(), buildEntrance(), buildMirror() (+24 more)

### Community 86 - "Asset pipeline: fast loading without losing sharpness"
Cohesion: 0.22
Nodes (8): Asset pipeline: fast loading without losing sharpness, Character rigs and the Costume Atelier, Completed, Ground rules, Phase 1: fingerprinted files at 2x and 3x, Phase 2: texture atlases for the hall sprites, Phase 3: KTX2 (Basis Universal), built and switched off, Phase 4: ThumbHash placeholders for paintings

### Community 87 - "Guest Board SQL Schema"
Cohesion: 0.67
Nodes (3): guest_notes, guest_notes_visible, rate_limits

### Community 88 - "Landscape Frame Asset"
Cohesion: 0.67
Nodes (3): frameLandscape, size, window

### Community 89 - "GuideTalk.tsx"
Cohesion: 0.10
Nodes (32): GuideTalk(), createDoorGuides(), HallGuide, PROJECTED, BY_ID, CAST, castMember(), FRAME (+24 more)

### Community 93 - "createNpcLayer"
Cohesion: 0.19
Nodes (19): idleCel(), createNpcLayer(), createResidentView(), departedRecently(), draw(), fadeOut(), glyphWidth(), hideAll() (+11 more)

### Community 94 - "snapshot.ts"
Cohesion: 0.12
Nodes (24): CameraView, onOpenCamera(), ERRORS, Polaroid(), keep(), PondCamera(), snap(), Shot (+16 more)

### Community 95 - "pond/room.ts"
Cohesion: 0.11
Nodes (30): water, depthAtLift(), FAR_LIFT, FAR_SCALE, liftAt(), PondPath, PROP_DEPTH, scaleAt() (+22 more)

### Community 96 - "Other visitors"
Cohesion: 0.29
Nodes (6): How it plays, Other visitors, Privacy, Running it in production, Running it locally, Staying consistent

### Community 104 - "pond/room.ts"
Cohesion: 0.08
Nodes (48): AtelierPage(), dynamic, metadata, allowedCharacter(), OwnedSnapshot, owns(), walletReady(), getWalletSnapshot() (+40 more)

### Community 105 - "FishingView.tsx"
Cohesion: 0.12
Nodes (15): CONFETTI_COLORS, ConfettiPiece, makeConfetti(), RevealCard(), TIER_MS, TIER_SFX, useCountUp(), chainOffer (+7 more)

### Community 107 - "hang-tag.ts"
Cohesion: 0.12
Nodes (8): CARD, createHangTag(), HangTag, HangTagStyle, HOLE, KNOT, What goes, and what replaces it, Refusal

### Community 108 - "layout.ts"
Cohesion: 0.17
Nodes (12): cafeAfterIndex(), comingSoonWidth(), computeLayout(), clear(), placeCafe(), cutRooms(), DoorSpan, HallRoomKind (+4 more)

### Community 109 - "json"
Cohesion: 0.07
Nodes (84): POST(), POST(), GET(), GLOBAL, PER_IP, POST(), POST(), GLOBAL (+76 more)

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

### Community 114 - "import-home-assets.mjs"
Cohesion: 0.09
Nodes (18): target, file(), DOOR, DOOR_BACKDROP, drop, FURNITURE, manifest, manifestPath (+10 more)

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
Cohesion: 0.12
Nodes (29): isHome(), isItem(), isName(), isPid(), isSeq(), MAX_MESSAGE_BYTES, parseClientMessage(), parseLook() (+21 more)

### Community 119 - "Costume gallery doorway"
Cohesion: 0.50
Nodes (3): Costume gallery doorway, Curtain colour edit, Prompt

### Community 121 - "Fishing forest: painted asset pass"
Cohesion: 0.10
Nodes (18): Assets, Bruce's collection refresh (2026-11-08), Fishing forest illustrations, Made by hand (not touched by the script), Main hall v2 (2026-11-10), Monets Lily Pond (2026-11-08), 1. Forest doorway, 2. Woodland noticeboard (+10 more)

### Community 124 - "The Costume Atelier"
Cohesion: 0.14
Nodes (13): Adding a character, Adding a costume, Art not supplied as files, Bruce's Chronicles, Checked against the mocks (2026-11-07), Code, Costume fit review, Floral collection (+5 more)

### Community 125 - "PondRoom.tsx"
Cohesion: 0.09
Nodes (24): Loading(), Loading(), metadata, PondPage(), AtelierLoading(), loadGameDesktop(), revealFloorTransition(), GameDesktop() (+16 more)

### Community 126 - "bug-reports.ts"
Cohesion: 0.16
Nodes (16): Status, MAX_BUG_CONTACT, MAX_BUG_ERRORS, MAX_BUG_MESSAGE, BugContext, BugReport, BugReportDto, BugReportRejected (+8 more)

### Community 127 - "ClosetView.tsx"
Cohesion: 0.08
Nodes (31): ClosetView(), onKeyDown(), LISTS, PLACE, PODIUM_SRC, Props, Slot, SPOTLIGHT_SRC (+23 more)

### Community 128 - "wallet/body.ts"
Cohesion: 0.27
Nodes (11): baitIdOf(), integerOffset(), isRecord(), itemIdOf(), MAX_CLAIM_BATCH, MAX_WALLET_BODY_BYTES, ParsedWalletClaim, parseWalletClaim() (+3 more)

### Community 129 - "presence/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, types, exclude, extends, include, ../../tsconfig.base.json

### Community 130 - "wallet.ts"
Cohesion: 0.07
Nodes (47): member(), now, piece(), randomId(), today, baitOf(), applyClaim(), baitCounts() (+39 more)

### Community 131 - "tsconfig.test.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 132 - "rooms.ts"
Cohesion: 0.12
Nodes (24): GET(), dynamic, HomePage(), artist(), member(), piece(), randomId(), canEdit() (+16 more)

### Community 133 - "Approved v4 bunny in the hall"
Cohesion: 0.29
Nodes (5): Approved v4 bunny in the hall, Assets, Existing interactions and fallback, Local review and checks, Rendering and movement

### Community 134 - "peers.ts"
Cohesion: 0.11
Nodes (10): fetch(), Env, INTERPOLATION_DELAY_MS, PEER_TIMEOUT_MS, PeerTable, positionAt(), Sample, look (+2 more)

### Community 135 - "exports"
Cohesion: 0.15
Nodes (13): exports, ./brand, ./bugs, ./economy, ./guestboard, ./presence, ./presence/messages, ./presence/wire (+5 more)

### Community 136 - "visits/page.tsx"
Cohesion: 0.25
Nodes (10): amount(), duration(), dynamic, LANDMARKS, PAGES, RANGES, share(), VisitsPage() (+2 more)

### Community 137 - "ensureEpoch"
Cohesion: 0.36
Nodes (8): GET(), intParam(), hallPaintings(), EMPTY, firstSlice(), memo, ensureEpoch(), getHallSlice()

### Community 138 - "Conn"
Cohesion: 0.31
Nodes (4): connectWebSocket(), SocketHandlers, Conn, message()

### Community 139 - "room-places.ts"
Cohesion: 0.15
Nodes (18): HallLayout, NpcGround, atelierRoomInfo(), atelierX(), copy(), FurniturePlacement, hallCache, hallRoomInfo() (+10 more)

### Community 140 - "bug-reports.ts"
Cohesion: 0.27
Nodes (11): BugReportHost(), BugReportSheet, BugReportSheet(), send(), collectContext(), inAppBrowser(), onOpenBugReport(), recentErrors (+3 more)

### Community 141 - "confirm/page.tsx"
Cohesion: 0.33
Nodes (7): ConfirmFollow(), dynamic, dynamic, Unsubscribe(), FollowNotice(), confirmFollow(), unsubscribe()

### Community 142 - "PondTicker.tsx"
Cohesion: 0.36
Nodes (9): fetchPondFeed(), PondFeedItem, catchLabel(), formatSizeCm(), speciesTier(), isGolden(), PondTicker(), load() (+1 more)

### Community 143 - "Walker"
Cohesion: 0.19
Nodes (3): FloorPoint, WalkArea, Walker

### Community 144 - "The Moonlit Pond — design"
Cohesion: 0.09
Nodes (22): Art the pond needs from the artist, Build contract (decided 2026-11-07), Build phases, Collection and goals, Done, Done, Guardrails, Leaderboards (+14 more)

### Community 145 - "Pond rework"
Cohesion: 0.18
Nodes (10): Baits, Client, Decisions, Done, Notes, Pond rework, Server, Species (+2 more)

### Community 146 - "initialize"
Cohesion: 0.24
Nodes (13): initialize(), aim(), drawFrame(), handleClick(), handlePointerDown(), handlePointerMove(), isResting(), renderFrame() (+5 more)

### Community 147 - "Orchestration contract — you plan, DSH workers execute"
Cohesion: 0.29
Nodes (6): Briefing a worker, Budget hygiene, graphify, Orchestration contract — you plan, DSH workers execute, The worker, When not to delegate

### Community 148 - "tables.ts"
Cohesion: 0.09
Nodes (39): BaitTray(), BaitTrayProps, RevealCardProps, PondCatch, CatchView, debugSpecies(), debugVariant(), GuestRoll (+31 more)

### Community 149 - "lib/presence.ts"
Cohesion: 0.09
Nodes (20): Entry, Connect, fetchTicket, HEARTBEAT_MS, HIDDEN_LIMIT_MS, RETRY_MS, SAY_GAP_MS, Self (+12 more)

### Community 150 - "useBackgroundMusic.ts"
Cohesion: 0.11
Nodes (27): BackgroundMusic, clampVolume(), isDocumentHidden(), Options, useBackgroundMusic(), VISIBILITY_EVENTS, EFFECTS, EffectSpec (+19 more)

### Community 151 - "defaultStore"
Cohesion: 0.15
Nodes (20): GLYPHS, PearlIcon(), POND_CRIMSON, PondIconName, PondStateView, PondTier, ensurePondStateStarted(), getPondStateSnapshot() (+12 more)

### Community 152 - "SlotDef"
Cohesion: 0.18
Nodes (3): FakeServer, SlotState, SlotDef

### Community 153 - "LandingFx"
Cohesion: 0.28
Nodes (6): glowSprite(), LandingFx(), onVisibility(), tick(), Mote, sprite()

### Community 154 - "CodesSection.tsx"
Cohesion: 0.39
Nodes (7): createCodeAction(), deleteCodeAction(), CodeRow, CodesSection(), create(), remove(), revokeQrToken()

### Community 155 - "import-hall-assets.mjs"
Cohesion: 0.13
Nodes (11): BASEBOARD, CURTAIN, drop, EXPECTED, manifest, manifestPath, masters, root (+3 more)

### Community 156 - "getStorage"
Cohesion: 0.09
Nodes (18): CONTENT_TYPES, GET(), PUT(), ACCEPTED, createAssetFromUpload(), MAX_UPLOAD_BYTES, presignUpload(), registerUpload() (+10 more)

### Community 157 - "Walkthrough.tsx"
Cohesion: 0.15
Nodes (19): BACKDROP_STYLE, MoreArrow(), NavArrow(), Props, SLIDE, Walkthrough(), XIcon(), decodedFrames (+11 more)

### Community 158 - "createPondRoom"
Cohesion: 0.30
Nodes (14): pathX(), createPondRoom(), approach(), busy(), finishWalk(), goTo(), leave(), move() (+6 more)

### Community 159 - "ref_node_assert"
Cohesion: 0.17
Nodes (9): shape(), STAMP_SVG, garlandRibbon(), at(), GarlandShape, Ribbon, sag(), shape (+1 more)

### Community 160 - "bake-shopkeeper.mjs"
Cohesion: 0.25
Nodes (5): bodyTextures, COATS, { json, bin }, manifest, maps

### Community 161 - "Atelier: the dressing mirror, and show-don't-tell keeping"
Cohesion: 0.13
Nodes (14): Atelier: the dressing mirror, and show-don't-tell keeping, Build order, Built (2026-11-20), Decisions (2026-11-19), Follow-ups (2026-11-20), Goal, In the room, Keeping (+6 more)

### Community 162 - "createCozyBackdrop"
Cohesion: 0.11
Nodes (18): ceilingGeometry(), CozyBackdrop, createCozyBackdrop(), clearGlows(), glow(), paintShade(), placeGlows(), placeSides() (+10 more)

### Community 163 - "import-landing-assets.mjs"
Cohesion: 0.18
Nodes (8): CAT, drop, EXPECTED, manifest, manifestPath, masters, root, target

### Community 165 - "Multiplayer ("other visitors") — plan v2 (Cloudflare)"
Cohesion: 0.17
Nodes (11): ScreenChrome(), 0. Summary, 10. Decisions, 1. Product contract changes (approved 2026-10-31), 2. What already exists that this builds on, 5.1 Emotes (v1), 5. Protocol (`packages/core/src/presence/protocol.ts`), 8.1 Expected cost (+3 more)

### Community 167 - "4. Transport: Cloudflare Durable Objects"
Cohesion: 0.25
Nodes (8): 4. Transport: Cloudflare Durable Objects, Decision (2026-10-31), Deploying, Identity cannot be forged, Local development and tests, Rooms and capacity, Shape of `apps/presence` (about 200 lines), main()

### Community 168 - "infra/jobs.ts"
Cohesion: 0.23
Nodes (15): loop(), shutdown(), sleep(), sweepStale(), DrainResult, handler(), repairFrames(), repairUnframed() (+7 more)

### Community 170 - "Medium"
Cohesion: 0.22
Nodes (9): onClick(), 10. Long names run off the name sign, 11. The rooms API skips the stale-tab member check, 12. The bunny is dragged along while you pan in Decorate, 6. Failed saves are nearly invisible, and nothing retries, 7. Two tabs editing the same room overwrite each other, 8. The drawer's card row can't be scrolled on touch screens, 9. Decorating can't be done with the keyboard (+1 more)

### Community 171 - "HallArranger.tsx"
Cohesion: 0.29
Nodes (7): HallArranger(), HallArrangerProps, HallRoomData, Painting, currentHallOrder(), hallPlacements(), reasonLabel()

### Community 172 - "app/page.tsx"
Cohesion: 0.43
Nodes (6): [BRAND_OWNER, ...BRAND_REST], CurrentlyShowing(), Decor(), dynamic, LandingPage(), LandingAccount()

### Community 173 - "a/[slug]/page.tsx"
Cohesion: 0.31
Nodes (6): ArtistPage(), dynamic, generateMetadata(), GET(), FollowForm(), getArtistPage()

### Community 175 - "LeaderboardPanel.tsx"
Cohesion: 0.13
Nodes (29): refreshWalletNow(), PondBoardId, PondBoardPeriod, PondBoardRow, PondBounties, PondLeaderboard, formatCountdown(), formatInteger() (+21 more)

### Community 176 - "HelpGuide.tsx"
Cohesion: 0.40
Nodes (5): fitWidth(), HelpGuide(), HelpGuideProps, POINTER_STEPS, TOUCH_STEPS

### Community 177 - "visits.ts"
Cohesion: 0.18
Nodes (16): state(), flush(), visibleMs(), VisitState, count(), currentSalts(), DEVICES, loadSalts() (+8 more)

### Community 178 - "share.ts"
Cohesion: 0.33
Nodes (5): ShareOutcome, shareResult(), ShareSummary, shareText(), base

### Community 179 - "createPlacementLayer"
Cohesion: 0.08
Nodes (20): aspectOf(), createPlacementLayer(), drawOutline(), dropGhosts(), dropHelper(), extrasFor(), silhouette(), sizeOf() (+12 more)

### Community 180 - "next"
Cohesion: 0.13
Nodes (12): config, SECURITY_HEADERS, dynamic, format(), grade(), METRICS, PAGES, PerformancePage() (+4 more)

### Community 182 - "schedule.test.ts"
Cohesion: 0.08
Nodes (29): RESIDENT_IDS, FloorSpot, Job, JOBS, Place, PlaceKind, ROOM_KINDS, ROOMS (+21 more)

### Community 183 - "Storyline (draft, saved 2026-11-17)"
Cohesion: 0.15
Nodes (12): Arc (soft, no fail state), Built so far, How it ties to what exists, Locked (2026-11-21, the owner), Next tasks (when picked up), Open questions, Premise, Revision (2026-11-21, the owner) (+4 more)

### Community 184 - "Local end-to-end stress test — 2026-11-06"
Cohesion: 0.22
Nodes (7): Environment and coverage, Follow-up coverage, Issue index, Local end-to-end stress test — 2026-11-06, Measured load, Passing checks and interpretation limits, Test data and cleanup

### Community 185 - "bake-pond-path.mjs"
Cohesion: 0.21
Nodes (7): blank(), manifest, manifestPath, ORIGINAL_SOURCE, originalPath(), root, softened()

### Community 186 - "createPersonalRoom"
Cohesion: 0.11
Nodes (12): CafeLink, GuestBoardNotes, Placards, toScreen(), writeStyle(), createSitting(), raise(), createPersonalRoom() (+4 more)

### Community 187 - "themes.ts"
Cohesion: 0.05
Nodes (30): Door, doorOf(), PlayerCard, wallpaperOf(), cozyLevel, cozyWorth(), Built (2026-11-21), Decisions (+22 more)

### Community 189 - "VitalsReporter.tsx"
Cohesion: 0.29
Nodes (8): firstPainting(), flush(), Metric, queue, REPORTED, VitalsReporter(), FIRST_PAINTING_MARK, MUSEUM_START_MARK

### Community 190 - "createPixelRatioGovernor"
Cohesion: 0.33
Nodes (7): createPixelRatioGovernor(), reset(), stepTo(), PIXEL_RATIO_STEPS, pixelRatioSteps(), Renderer, governor()

### Community 191 - "SyncStore"
Cohesion: 0.16
Nodes (6): encodeStored(), parseStored(), readStored(), writeStored(), SyncStore, upgrade()

### Community 192 - "db.ts"
Cohesion: 0.10
Nodes (21): allowedOrigin(), isSameOriginMutation(), LOOPBACK, addPondPhoto(), AddPondPhotoResult, deletePondPhoto(), isJpeg(), listPondPhotos() (+13 more)

### Community 193 - "Monets Lily Pond: exploration, UX and multiplayer QA"
Cohesion: 0.29
Nodes (6): Browser and interaction coverage, Changes made from the walkthrough, Monets Lily Pond: exploration, UX and multiplayer QA, Multiplayer and load, Practical limits, Regression checks and cleanup

### Community 195 - "BunnyArtist.tsx"
Cohesion: 0.40
Nodes (5): BunnyArtist(), BunnyMood, Pencil(), POSES, 4. Suggested plan

### Community 196 - "AccountSheet"
Cohesion: 0.29
Nodes (9): AccountSheet(), continueAnyway(), doSignOut(), runDelete(), runName(), submit(), submitDelete(), submitName() (+1 more)

### Community 197 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, db:schema, deploy:backend, dev, dev:presence, dev:web, dev:worker (+6 more)

### Community 198 - "PondPanels.tsx"
Cohesion: 0.11
Nodes (26): KeepsakeFound(), USE_HINT, catchArt(), JOURNAL_FAMILIES, JOURNAL_GRADES, JOURNAL_SIZE, journalFamily, KeepsakeId (+18 more)

### Community 199 - "handlers.ts"
Cohesion: 0.07
Nodes (40): Design for Phases 5–7 (2026-11-05), BRAND, confirmedFollowers(), sealEpoch(), handleDerivatives(), handleNotifyFollowers(), handleRenderDisplay(), handleSealEpoch() (+32 more)

### Community 201 - "messages.ts"
Cohesion: 0.31
Nodes (6): checkMessage(), INVISIBLE, MESSAGE_MAX, MessageCheck, normalizeMessage(), hasProfanity()

### Community 202 - "rig.ts"
Cohesion: 0.04
Nodes (88): CrowdPreviewPage(), RigPreviewPage(), CrowdPreview(), draw(), KINDS, Stats, Window, NEXT (+80 more)

### Community 205 - "nearby.ts"
Cohesion: 0.18
Nodes (6): createNearby(), Nearby, NearbyReach, RoomSpan, reach, strip

### Community 206 - "Low"
Cohesion: 0.15
Nodes (13): 13. Pages that redirect or don't exist answer 200, 14. Error codes reveal which room slugs exist, 15. The name sign slides under the top-right buttons in Decorate, 16. Level-up celebrations can be farmed, 17. No hint of where things are after panning away, 18. Too many items is only discovered by the server, 19. Development-only: page payloads include the full room row, Checked and fine (+5 more)

### Community 207 - "MuseumStage.tsx"
Cohesion: 0.12
Nodes (13): guides(), museumDoors(), EXITS, isDoor(), linkedDoor(), ROOM_PATH, ActiveRoom, RoomOptions (+5 more)

### Community 208 - "SoundProvider.tsx"
Cohesion: 0.12
Nodes (17): ColorRecall(), ColorRecallProps, Phase, readBest(), ColorRound, showMs(), loadColorRecall(), PondMusic() (+9 more)

### Community 209 - "app/layout.tsx"
Cohesion: 0.15
Nodes (14): bethEllen, inspiratiq, metadata, notoSans, RootLayout(), sniglet, viewport, SoundProvider() (+6 more)

### Community 210 - "lib/slots/index.ts"
Cohesion: 0.07
Nodes (29): PresencePreviewPage(), AccountHost(), AccountSheet, NAME_ERRORS, Pending, View, KeepOnOtherDevices(), AccountMode (+21 more)

### Community 216 - "ref_sharp"
Cohesion: 0.31
Nodes (8): CFG, closeEye(), eraseMouth(), inpaint(), sample(), sharp, [src, out, cfgPath], warp()

### Community 221 - "createStage"
Cohesion: 0.30
Nodes (10): FLICK, flickDirection(), isUpwardFlick(), createStage(), closeEntry(), enter(), handlePointerUp(), isCurrent() (+2 more)

### Community 225 - "painting-open"
Cohesion: 0.50
Nodes (4): file, kilobytes, seconds, painting-open

### Community 228 - "slots/store.ts"
Cohesion: 0.15
Nodes (17): ANON_PREFIX, anonKey(), deviceKey(), isMemberSlotKey(), listKeys(), MEMBER_KEY, memberKey(), memberPrefix() (+9 more)

### Community 230 - "icon-basket"
Cohesion: 0.67
Nodes (3): icon-basket, file, vector

## Knowledge Gaps
- **5 isolated node(s):** `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1675 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **34 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `lib/slots/index.ts` to `AtelierKeeps.tsx`, `SketchGuess.tsx`, `DoorEditor.tsx`, `builtUrl`, `Museum.tsx`, `bug-reports.ts`, `Test Fakes and Helpers`, `PondTicker.tsx`, `logic.ts`, `room-events.ts`, `PersonalRoom.tsx`, `tables.ts`, `useBackgroundMusic.ts`, `defaultStore`, `LandingFx`, `CodesSection.tsx`, `pond-api.ts`, `Walkthrough.tsx`, `Web Package Dependencies`, `AssetImage`, `risk.ts`, `HallArranger.tsx`, `app/page.tsx`, `a/[slug]/page.tsx`, `LeaderboardPanel.tsx`, `HelpGuide.tsx`, `actions.ts`, `Water.tsx`, `defaultStore`, `pond-format.ts`, `VitalsReporter.tsx`, `domain/guestboard.ts`, `PondPanels.tsx`, `rig.ts`, `MuseumStage.tsx`, `SoundProvider.tsx`, `app/layout.tsx`, `GuideTalk.tsx`, `snapshot.ts`, `pond/room.ts`, `FishingView.tsx`, `pondgame/lib/api.ts`, `PondRoom.tsx`, `bug-reports.ts`, `ClosetView.tsx`?**
  _High betweenness centrality (0.092) - this node is a cross-community bridge._
- **What connects `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json` to the rest of the system?**
  _5 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `AtelierKeeps.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10782241014799154 - nodes in this community are weakly interconnected._
- **Why does `three` connect `hall/room.ts` to `personal/room.ts`, `scene/ambience.ts`, `scene/assets.ts`, `stage.ts`, `rig.ts`, `hang-tag.ts`, `pond/room.ts`, `scene.ts`, `cozy.ts`, `pond/art.ts`, `prepare-models.mjs`, `atelier.ts`, `GuideTalk.tsx`, `ambience.ts`, `Web Package Dependencies`, `pond/room.ts`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **Should `SketchGuess.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12962962962962962 - nodes in this community are weakly interconnected._
- **Why does `createPresence()` connect `createPresence` to `Multiplayer ("other visitors") — plan v2 (Cloudflare)`, `peers.ts`, `stage.ts`, `messages.ts`, `room-events.ts`, `lib/slots/index.ts`, `lib/presence.ts`, `protocol.ts`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Should `DoorEditor.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05510388437217705 - nodes in this community are weakly interconnected._