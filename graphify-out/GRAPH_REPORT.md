# Graph Report - tiny-museum  (2026-11-27)

## Corpus Check
- 592 files · ~359,012 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 110 file(s) not represented in the graph (top: .avif 60, .glb 38, .css 7)

## Summary
- 5256 nodes · 13791 edges · 223 communities (194 shown, 29 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 273 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `995f987a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- AtelierKeeps.tsx
- themes.ts
- SketchGuess.tsx
- DoorEditor
- builtUrl
- round.ts
- floor.ts
- Core Asset Manifest
- scene/assets.ts
- config.ts
- machine.ts
- Museum.tsx
- Test Fakes and Helpers
- scene.ts
- cozy.ts
- DecorDrawer.tsx
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
- currentMember
- pond-api.ts
- ambience.ts
- core/src/index.ts
- Web Package Dependencies
- Gamifying Tiny Museum — genre direction & engagement research
- src/rooms/doors.ts
- hall/room.ts
- risk.ts
- amplify/tsconfig.json
- 5. Customization menu — what other people are doing
- rooms.ts
- epoch.ts
- Web TSConfig
- Root Package Manifest
- currentMember
- createHallRoom
- import-fishing-assets.mjs
- Base TSConfig
- Amplify Build Spec
- stage.ts
- actions.ts
- DecorController
- env.ts
- Water.tsx
- Worker Package Manifest
- Public Asset Manifest
- db-tests/pond.test.ts
- atelier.ts
- compose-atelier.mjs
- AtelierRoom
- pond-format.ts
- planNormal
- economy/store.ts
- createNpcLayer
- room.ts
- minimap.ts
- RevealCard.tsx
- GuestBoard.tsx
- Sound Effect Assets
- art-cache.ts
- Custom HTTP Headers
- Sharp Layer Package
- LandingFx
- scene/ambience.ts
- memberFromRequest
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
- npc-layer.ts
- Bug Reports SQL Schema
- Vitals SQL Schema
- museum/layout.tsx
- snapshot.ts
- pond/room.ts
- paintings/page.tsx
- Run-Once Schema
- pond/room.ts
- FishingView.tsx
- slots/store.ts
- hang-tag.ts
- wallet/body.ts
- json
- graftCostume
- pondgame/lib/api.ts
- worker/tsconfig.json
- core/tsconfig.json
- wander.test.ts
- How to Design for Failures — ByteByteGo Newsletter
- Worker instructions — DSH headless agents
- Backend
- protocol.ts
- Costume gallery doorway
- tab-turn.ts
- Fishing forest: painted asset pass
- Audio
- .claude/CLAUDE.md
- The Costume Atelier
- PondPanels.tsx
- rules.ts
- ClosetView.tsx
- sketchguess/lib/api.ts
- presence/tsconfig.json
- wallet.ts
- tsconfig.test.json
- BugReportSheet.tsx
- AssetImage
- peers.ts
- plan.ts
- Atelier: the dressing mirror, and show-don't-tell keeping
- Multiplayer ("other visitors") — plan v2 (Cloudflare)
- presence.test.ts
- room-places.ts
- bug-reports.ts
- confirm/page.tsx
- ref_node_assert
- Walker
- The Moonlit Pond — design
- Pond rework
- createStage
- Orchestration contract — you plan, DSH workers execute
- tables.ts
- ClosetView.tsx
- useBackgroundMusic.ts
- readJsonBody
- SlotDef
- Item
- run.ts
- Curating the paintings (2026-11-07)
- hit.ts
- Walkthrough.tsx
- pond/room.ts
- Message
- player-card.ts
- domain/guestboard.ts
- writeLocal
- import-home-assets.mjs
- db.ts
- CrowdPreview.tsx
- createRemoteVisitors
- FilesystemStorage
- app/page.tsx
- empty
- Medium
- layout.ts
- xdog.ts
- src/types.ts
- Wardrobe
- frame-clock.test.ts
- Local end-to-end stress test — 2026-11-06
- visits.ts
- master
- createPlacementLayer
- Local end-to-end stress test — 2026-11-06
- messages.ts
- schedule.test.ts
- Storyline (draft, saved 2026-11-17)
- createCharacter
- bake-pond-path.mjs
- personal/room.ts
- DoorRef
- draw.py
- Rig
- createPixelRatioGovernor
- SyncStore
- scripts
- Monets Lily Pond: exploration, UX and multiplayer QA
- Cafe
- opening.ts
- createRoomPassage
- paintedCostume
- journal.ts
- handlers.ts
- playwright
- ticket/route.ts
- rig.ts
- npcs/README.md
- walk
- nearby.ts
- createReveal
- LiveReflection
- BunnyArtist.tsx
- react
- lib/slots/index.ts
- Context
- esbuild
- RigPreview.tsx
- npc-sheet.cjs
- doors.sql
- painting-open
- icon-basket
- bunny-left
- bunny-right
- icon-home
- ticket

## God Nodes (most connected - your core abstractions)
1. `react` - 91 edges
2. `useSound()` - 84 edges
3. `json()` - 77 edges
4. `query()` - 72 edges
5. `PersonalRoom()` - 67 edges
6. `hit()` - 63 edges
7. `limited()` - 57 edges
8. `three` - 49 edges
9. `next` - 48 edges
10. `Traversal` - 48 edges

## Surprising Connections (you probably didn't know these)
- `Code` --references--> `followOutfit()`  [INFERRED]
  docs/costume-atelier.md → apps/web/src/features/hall/scene/wardrobe.ts
- `5.1 Emotes (v1)` --references--> `ScreenChrome()`  [INFERRED]
  docs/multiplayer-plan.md → apps/web/src/shared/components/ScreenChrome.tsx
- `E2E-009 — Room mutations ignore stale account identity` --references--> `memberFromRequest()`  [INFERRED]
  docs/testing/local-e2e-stress-2026-11-06.md → apps/web/src/shared/lib/member-route.ts
- `Where things stand` --references--> `sealEpoch()`  [INFERRED]
  docs/curation-plan.md → packages/core/src/domain/epoch.ts
- `Checked against the mocks (2026-11-07)` --references--> `view()`  [INFERRED]
  docs/costume-atelier.md → packages/core/src/domain/pond-photos.ts

## Import Cycles
- None detected.

## Communities (223 total, 29 thin omitted)

### Community 0 - "AtelierKeeps.tsx"
Cohesion: 0.09
Nodes (39): CoinToast(), Toast, Purse(), Stamp(), serverSnapshot, useEarnEvents(), useWallet(), EarnSource (+31 more)

### Community 1 - "themes.ts"
Cohesion: 0.06
Nodes (38): Catalogue, Data model (core), 1. Items placed against a zone edge fail to save, and the whole draft reverts, 2. One owned item can be placed many times, 3. Any save rejection throws away all unsaved work, 4. Changes made just before leaving are lost, 5. Fish trophies can be claimed without playing, High (+30 more)

### Community 2 - "SketchGuess.tsx"
Cohesion: 0.10
Nodes (31): bestKeyFor(), BURST, clueUrl(), Phase, pickAtRandom(), PreparedGame, readDifficulty(), readMode() (+23 more)

### Community 3 - "DoorEditor"
Cohesion: 0.09
Nodes (39): DoorsPage(), dynamic, hallPaintings(), hallDoorSpan(), CAST, doorArtUrl(), loadDoorArt(), loadRoomDoorArt() (+31 more)

### Community 4 - "builtUrl"
Cohesion: 0.21
Nodes (13): Loading(), dynamic, Hall(), MuseumPage(), DENSITY_MEDIA, HallPreload(), HallSkeleton(), EMPTY (+5 more)

### Community 5 - "round.ts"
Cohesion: 0.15
Nodes (27): deltaE(), GAMUT_EPSILON, hexToOklab(), inGamut(), linearRgbToOklab(), linearToSrgb(), Oklab, oklabToLinearRgb() (+19 more)

### Community 6 - "floor.ts"
Cohesion: 0.13
Nodes (34): clone(), closestOnSegment(), contains(), cross(), crossVec(), depthAtY(), depthBounds(), depthT() (+26 more)

### Community 7 - "Core Asset Manifest"
Cohesion: 0.05
Nodes (41): artworks, audio, file, megabytes, seconds, sourceName, startedAt, bunny (+33 more)

### Community 8 - "scene/assets.ts"
Cohesion: 0.08
Nodes (43): AssetManifest, assetUrl(), bitmapTexture(), blankImage(), CAFE_CAT_FRAMES, CharacterSprites, CompressedLoader, elementTexture() (+35 more)

### Community 9 - "config.ts"
Cohesion: 0.04
Nodes (34): Attachment, Carried, CarriedState, createCarried(), Character, Perch, Pose, centerYFor() (+26 more)

### Community 10 - "machine.ts"
Cohesion: 0.09
Nodes (50): CAST_ERRORS, coarsePointer(), FishingView(), initialEasyReel(), isTyping(), LOST, PondGameProps, Toast (+42 more)

### Community 11 - "Museum.tsx"
Cohesion: 0.06
Nodes (46): Loading(), ColorRecall(), ColorRecallProps, Phase, readBest(), showMs(), AtelierLoading(), CoinFound (+38 more)

### Community 12 - "Test Fakes and Helpers"
Cohesion: 0.10
Nodes (28): deferredFetch(), deviceSlot, FakeEvents, FakeStorage, fixture, fixtureB, fixtureRegistry, fixtureRegistryBoth (+20 more)

### Community 13 - "scene.ts"
Cohesion: 0.04
Nodes (32): MuseumProps, disposeDisplayTexture(), prefersAvif(), HiddenCoin, createNotes(), createPedestal(), Notes, Pedestal (+24 more)

### Community 14 - "cozy.ts"
Cohesion: 0.07
Nodes (47): alphaCanvas(), ATELIER_PROPS, AtelierImage, atticWindowCanvas(), bareBulbCanvas(), boardsCanvas(), canvasTexture(), ceilingTexture() (+39 more)

### Community 15 - "DecorDrawer.tsx"
Cohesion: 0.10
Nodes (24): DecorDrawer, DecorDrawerProps, SLOT_LABELS, Tab, TABS, categoryOf(), DrawerCategory, FINISH_SLOTS (+16 more)

### Community 16 - "room-events.ts"
Cohesion: 0.18
Nodes (27): ChatButton(), REFUSED, joinRoom(), STANDING, announceNameChange(), emit(), getPeople(), isInRoom() (+19 more)

### Community 17 - "schedule.ts"
Cohesion: 0.08
Nodes (41): addGap(), along(), buildRoomTable(), buildStayPlan(), chooseMeeting(), chooseNext(), clamp(), doorX() (+33 more)

### Community 18 - "ref_node_assert"
Cohesion: 0.12
Nodes (27): defineSlot(), docBytes(), SLOTS, byAtThenKey(), encoded(), latest, mapOf(), maxNumber() (+19 more)

### Community 19 - "amplify/package.json"
Cohesion: 0.08
Nodes (26): amplifyDir, backend, everyMinutes, mediaBucket, missing, repoRoot, REQUIRED, setting() (+18 more)

### Community 20 - "PersonalRoom.tsx"
Cohesion: 0.06
Nodes (75): errorReason(), Offer, overDrawer(), PersonalRoom(), canPlaceNew(), carriedTo(), carryEnd(), carryMove() (+67 more)

### Community 21 - "prepare-models.mjs"
Cohesion: 0.07
Nodes (29): alongArm(), ARMS, armTurn(), BODIES, bruce, BRUCE_FIT, BRUCE_PLACE, BRUCE_SLEEVES (+21 more)

### Community 22 - "Traversal"
Cohesion: 0.10
Nodes (6): clamp(), fixture(), jump(), Traversal, walker(), Stress-test fixes (2026-11-06)

### Community 23 - "core/package.json"
Cohesion: 0.06
Nodes (40): dependencies, @aws-sdk/client-s3@^3.1121.0, @aws-sdk/s3-request-presigner@^3.1121.0, bcryptjs@^2.4.3, obscenity@^0.4.6, pg@^8.13.1, sharp@^0.33.5, thumbhash@^0.1.1 (+32 more)

### Community 24 - "hitForVisitor"
Cohesion: 0.12
Nodes (28): POST(), ALLOWED, PER_VISITOR, POST(), POST(), POST(), GLOBAL, PER_IP (+20 more)

### Community 25 - "members.ts"
Cohesion: 0.11
Nodes (36): registry, started(), AnalyticsSummary, ensureQrToken(), EventKind, follow(), ResolvedToken, artistForSession() (+28 more)

### Community 26 - "currentMember"
Cohesion: 0.15
Nodes (20): GET(), PaintingRow, GET(), POST(), UPLOADS_PER_ARTIST, POST(), UPLOADS_PER_ARTIST, StudioLayout() (+12 more)

### Community 27 - "pond-api.ts"
Cohesion: 0.09
Nodes (41): AlbumPanel(), remove(), CameraView, openCamera(), deletePondPhoto(), errorOf(), fetchPondFeed(), fetchPondLeaderboard() (+33 more)

### Community 28 - "ambience.ts"
Cohesion: 0.12
Nodes (29): blade(), bloom(), BLOOMS, createPondAmbience(), update(), fishTexture(), frond(), FRONT_ROWS (+21 more)

### Community 29 - "core/src/index.ts"
Cohesion: 0.05
Nodes (123): GET(), addBait(), PondBoardMe, PondBoardRow, PondFeedItem, Rep, bountyCatches(), BountyCatchRow (+115 more)

### Community 30 - "Web Package Dependencies"
Cohesion: 0.07
Nodes (35): dependencies, embla-carousel-react@^8.6.0, motion@^13.1.1, next@^15.0.3, react@^19.0.0, react-dom@^19.0.0, swr@^2.5.1, three@^0.169.0 (+27 more)

### Community 31 - "Gamifying Tiny Museum — genre direction & engagement research"
Cohesion: 0.10
Nodes (19): 0.1 The core experience, 0.2 Systems that make gamification cheap to build, 0.3 Constraints that shape any recommendation, 0. What the game is today (the deep dive), 1.1 The landscape (seven candidates, with verdicts), 1.2 Recommendation: a **cozy gallery life-sim** — "the gallery you live in", 1.3 The five design pillars the genre implies, 1. Genre direction (+11 more)

### Community 32 - "src/rooms/doors.ts"
Cohesion: 0.10
Nodes (28): GuideTalk, discardDoors(), DoorsRow, doorsState, parsed(), saveDoorsDraft(), addPassage(), checkDoors() (+20 more)

### Community 33 - "hall/room.ts"
Cohesion: 0.05
Nodes (54): Assets, Scenery, CUTS, disposeBoards(), Mark, plane(), ROPE_CUTS, ropeSlices() (+46 more)

### Community 34 - "risk.ts"
Cohesion: 0.12
Nodes (29): Hud(), HudProps, HudWagerChip, WagerPicker(), chooseTier(), stepStake(), WagerPickerProps, chainChipLabel() (+21 more)

### Community 35 - "amplify/tsconfig.json"
Cohesion: 0.20
Nodes (9): compilerOptions, module, moduleResolution, noUnusedLocals, noUnusedParameters, exclude, extends, include (+1 more)

### Community 36 - "5. Customization menu — what other people are doing"
Cohesion: 0.12
Nodes (16): 1. The target: what "Claude Opus 5.5" actually means, 2. Where your harness stands today (live config I read), 3. The honest gap model, 4. Quality levers, ranked by leverage, 5. Customization menu — what other people are doing, 6. Recommended starting kit for *your* profile, 7. What I can apply for you right now (needs your go-ahead), A. Prompt & persona (most common quality customizations) (+8 more)

### Community 37 - "rooms.ts"
Cohesion: 0.11
Nodes (43): artist(), member(), piece(), randomId(), discardLocation(), hangableOnly(), hasUnpublished(), inUse() (+35 more)

### Community 38 - "epoch.ts"
Cohesion: 0.11
Nodes (29): GET(), intParam(), GET(), sketchPool, unavailable(), currentEpoch(), ensureEpoch(), epochById() (+21 more)

### Community 39 - "Web TSConfig"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 40 - "Root Package Manifest"
Cohesion: 0.14
Nodes (17): description, devDependencies, concurrently@^9.1.0, ktx2-encoder@^0.6.0, maxrects-packer@^2.7.3, @types/node@^22.9.0, typescript@^5.6.3, typescript (+9 more)

### Community 41 - "currentMember"
Cohesion: 0.11
Nodes (25): GET(), BOARDS, GET(), oneOf(), PER_VISITOR, PERIODS, GET(), POST() (+17 more)

### Community 42 - "createHallRoom"
Cohesion: 0.16
Nodes (21): earn(), maybeInvite(), writeSession(), createHallRoom(), buildRoom(), buildRoomContents(), cafeRoom(), tap() (+13 more)

### Community 43 - "import-fishing-assets.mjs"
Cohesion: 0.10
Nodes (12): CANVAS, clear, FONT, FRAME, heights, layout, lossless, manifest (+4 more)

### Community 44 - "Base TSConfig"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, lib, module, moduleResolution (+9 more)

### Community 45 - "Amplify Build Spec"
Cohesion: 0.12
Nodes (16): applications, appRoot, backend, frontend, baseDirectory, files, phases, commands (+8 more)

### Community 46 - "stage.ts"
Cohesion: 0.03
Nodes (54): CameraRig, Viewport, JOBS, NpcRoomInfo, FLAT, NpcFrame, NpcView, PROJECTED (+46 more)

### Community 47 - "actions.ts"
Cohesion: 0.10
Nodes (41): AnalyticsPage(), dynamic, dynamic, HangPage(), dynamic, StudioHome(), back(), deleteGuestNoteAction() (+33 more)

### Community 48 - "DecorController"
Cohesion: 0.07
Nodes (10): Job, createDecorController(), canvasRect(), targetRise(), toScreen(), DecorController, ScreenBox, GhostOptions (+2 more)

### Community 49 - "env.ts"
Cohesion: 0.05
Nodes (27): bodyTextures, COATS, { json, bin }, manifest, maps, target, CAT, drop (+19 more)

### Community 50 - "Water.tsx"
Cohesion: 0.07
Nodes (38): AmbientShadow, box(), BUCKET, bunnyBox(), easeOut(), Glint, LEFT_STYLE, lineColour() (+30 more)

### Community 51 - "Worker Package Manifest"
Cohesion: 0.14
Nodes (14): dependencies, @tiny/core@*, exports, ./lambda, @tiny/core, main, name, private (+6 more)

### Community 52 - "Public Asset Manifest"
Cohesion: 0.12
Nodes (15): artworks, bunny, size, floor, size, fonts, icon-no-photos, size (+7 more)

### Community 53 - "db-tests/pond.test.ts"
Cohesion: 0.09
Nodes (28): CatchExtra, clearCatches(), COLUMNS, grantPearls(), insertCatch(), member(), namedMember(), randomId() (+20 more)

### Community 54 - "atelier.ts"
Cohesion: 0.05
Nodes (44): AtelierArt, AtelierDoor, AtelierImage, BuiltRoom, Cardigan, CARDIGAN_NAMES, Control, refresh() (+36 more)

### Community 55 - "compose-atelier.mjs"
Cohesion: 0.12
Nodes (10): body, dressLayer, dressWidth, floralWidth, hanger, MANNEQUIN_CANVAS, mask, root (+2 more)

### Community 56 - "AtelierRoom"
Cohesion: 0.07
Nodes (9): AtelierRoom, createWardrobe(), enqueue(), reflect(), bow, dress, navy, setup() (+1 more)

### Community 57 - "pond-format.ts"
Cohesion: 0.07
Nodes (66): refreshWalletNow(), PearlIcon(), buyPondBait(), claimPondBounty(), exchangePondPearls(), fetchPondBounties(), fetchPondState(), isRecord() (+58 more)

### Community 58 - "planNormal"
Cohesion: 0.30
Nodes (15): addDwellEmotes(), addEmote(), addStand(), addWalk(), canReturn(), facingOf(), facingTo(), floorDistance() (+7 more)

### Community 59 - "economy/store.ts"
Cohesion: 0.09
Nodes (49): CARRY_CAP, carryAdd(), CarryEntry, carryPrune(), carryRemove(), chunk(), ClaimRequest, tzOffsetNow() (+41 more)

### Community 60 - "createNpcLayer"
Cohesion: 0.19
Nodes (19): createNpcLayer(), createResidentView(), createView(), departedRecently(), draw(), fadeOut(), glyphWidth(), hideAll() (+11 more)

### Community 61 - "room.ts"
Cohesion: 0.11
Nodes (33): attachmentOf(), socket(), admitted(), Attachment, farewell(), GHOST_MS, HELLO_TIMEOUT_MS, holdsOf() (+25 more)

### Community 62 - "minimap.ts"
Cohesion: 0.06
Nodes (41): place(), museumDoors(), EXITS, isDoor(), linkedDoor(), ROOM_PATH, createMinimap(), draw() (+33 more)

### Community 63 - "RevealCard.tsx"
Cohesion: 0.09
Nodes (34): AccountSheet(), continueAnyway(), doSignOut(), runDelete(), runName(), submit(), submitDelete(), submitName() (+26 more)

### Community 64 - "GuestBoard.tsx"
Cohesion: 0.14
Nodes (22): ComposeScreen(), ComposeScreenProps, blankDraft(), GuestBoard(), GuestBoardProps, View, ReadScreen(), messageLength() (+14 more)

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

### Community 69 - "LandingFx"
Cohesion: 0.17
Nodes (12): between(), CAT, Edge, EDGES, runLandingCat(), choosePeeker(), peek(), glowSprite() (+4 more)

### Community 70 - "scene/ambience.ts"
Cohesion: 0.14
Nodes (13): createHallAmbience(), finish(), glowTexture(), HallAmbience, mulberry(), painted(), vignetteTexture(), Backdrop (+5 more)

### Community 71 - "memberFromRequest"
Cohesion: 0.43
Nodes (6): GET(), GET(), memberFromRequest(), exportMember(), readSlots(), exportWallet()

### Community 72 - "Confirmed issues"
Cohesion: 0.12
Nodes (17): Confirmed issues, E2E-002 — Valid edge placement rejected through floating-point precision, E2E-003 — One owned prop can be placed multiple times, E2E-004 — Reload before autosave silently loses the latest placement, E2E-005 — Failed save and failed Done have no visible mobile explanation, E2E-006 — Restoring connectivity does not retry a failed draft save, E2E-007 — Keyboard activation cannot place drawer items, E2E-008 — Creating an account from My Room leaves the signed-in user on the sign-in prompt (+9 more)

### Community 73 - "Placement"
Cohesion: 0.06
Nodes (17): Carry, PersonalRoomProps, DecorLive, HallRoomData, PlacementLayer, PlacementTheme, Admin mode (gamma), Decisions (2026-11-17, with the user) (+9 more)

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
Cohesion: 0.15
Nodes (20): colorAt(), decoded(), disposePondArt(), EDGE_BAND, EDGE_BANDS, EDGE_OVERLAP, edgeTexture(), imageOf() (+12 more)

### Community 80 - "createPresence"
Cohesion: 0.19
Nodes (13): createPresence(), drop(), heartbeat(), maybeSend(), onPageHide(), receive(), scheduleRetry(), send() (+5 more)

### Community 81 - "members"
Cohesion: 0.11
Nodes (28): coin_claims, coin_claims_daily, wallet_bait, wallet_items, wallets, member_sessions, member_sessions_member, member_slots (+20 more)

### Community 82 - "Frame Window Asset"
Cohesion: 0.50
Nodes (4): frame, size, window, windowAspect

### Community 83 - "wander.ts"
Cohesion: 0.17
Nodes (29): along(), beginNext(), beginWork(), between(), blockedAt(), chooseStop(), clamp(), createWanderer() (+21 more)

### Community 84 - "presence/package.json"
Cohesion: 0.14
Nodes (16): dependencies, @tiny/core@*, devDependencies, @cloudflare/workers-types@5.20261016.1, wrangler@4.151.1, @tiny/core, name, private (+8 more)

### Community 85 - "createAtelierRoom"
Cohesion: 0.21
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

### Community 89 - "npc-layer.ts"
Cohesion: 0.12
Nodes (25): GuideTalk(), createDoorGuides(), HallGuide, PROJECTED, BY_ID, castMember(), FRAME, IDLE (+17 more)

### Community 93 - "museum/layout.tsx"
Cohesion: 0.39
Nodes (6): MuseumLayout(), WalletProvider(), setMuseumDoors(), MuseumDoors(), MuseumStage(), publishedDoors()

### Community 94 - "snapshot.ts"
Cohesion: 0.24
Nodes (13): snap(), composeJpeg(), copyCanvas(), grabLayers(), Layer, loadImage(), paint(), px() (+5 more)

### Community 95 - "pond/room.ts"
Cohesion: 0.14
Nodes (23): water, depthAtLift(), FAR_LIFT, FAR_SCALE, liftAt(), pathHalfWidth(), pathX(), PondPath (+15 more)

### Community 96 - "paintings/page.tsx"
Cohesion: 0.11
Nodes (23): dynamic, PaintingsPage(), createCodeAction(), deleteCodeAction(), deletePieceAction(), updatePieceAction(), CodeRow, CodesSection() (+15 more)

### Community 104 - "pond/room.ts"
Cohesion: 0.09
Nodes (43): AtelierPage(), dynamic, metadata, allowedCharacter(), OwnedSnapshot, owns(), walletReady(), Atelier() (+35 more)

### Community 105 - "FishingView.tsx"
Cohesion: 0.12
Nodes (15): CONFETTI_COLORS, ConfettiPiece, makeConfetti(), RevealCard(), RevealCardProps, TIER_MS, TIER_SFX, useCountUp() (+7 more)

### Community 106 - "slots/store.ts"
Cohesion: 0.14
Nodes (17): ANON_PREFIX, anonKey(), deviceKey(), isMemberSlotKey(), listKeys(), MEMBER_KEY, memberKey(), memberPrefix() (+9 more)

### Community 107 - "hang-tag.ts"
Cohesion: 0.12
Nodes (8): CARD, createHangTag(), HangTag, HangTagStyle, HOLE, KNOT, What goes, and what replaces it, Refusal

### Community 108 - "wallet/body.ts"
Cohesion: 0.18
Nodes (15): PER_MEMBER, POST(), baitIdOf(), integerOffset(), isRecord(), itemIdOf(), MAX_CLAIM_BATCH, MAX_WALLET_BODY_BYTES (+7 more)

### Community 109 - "json"
Cohesion: 0.11
Nodes (42): PER_MEMBER, PUT(), PER_MEMBER, POST(), catchIdOf(), isRecord(), MAX_POND_BODY_BYTES, pearlsOf() (+34 more)

### Community 110 - "graftCostume"
Cohesion: 0.27
Nodes (14): canvasFit(), compose(), graftCostume(), copyAccessor(), copyMaterial(), copyMesh(), copyTexture(), copyView() (+6 more)

### Community 111 - "pondgame/lib/api.ts"
Cohesion: 0.17
Nodes (26): buyPondBait(), CastOptions, castPond(), chainPondBait(), errorOf(), fetchPondState(), isRecord(), memberId() (+18 more)

### Community 112 - "worker/tsconfig.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 113 - "core/tsconfig.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 114 - "wander.test.ts"
Cohesion: 0.12
Nodes (17): FloorSpot, Job, Place, Phase, ResidentState, Run, WalkPath, WalkState (+9 more)

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
Cohesion: 0.11
Nodes (32): fetch(), Env, isHome(), isItem(), isName(), isPid(), isSeq(), MAX_HOLDS (+24 more)

### Community 119 - "Costume gallery doorway"
Cohesion: 0.50
Nodes (3): Costume gallery doorway, Curtain colour edit, Prompt

### Community 120 - "tab-turn.ts"
Cohesion: 0.16
Nodes (5): createTabTurn(), TabTurn, tab(), TurnEnv, TurnMessage

### Community 121 - "Fishing forest: painted asset pass"
Cohesion: 0.10
Nodes (18): Assets, Bruce's collection refresh (2026-11-08), Fishing forest illustrations, Made by hand (not touched by the script), Main hall v2 (2026-11-10), Monets Lily Pond (2026-11-08), 1. Forest doorway, 2. Woodland noticeboard (+10 more)

### Community 122 - "Audio"
Cohesion: 0.50
Nodes (3): Audio, Pond, personal room and MP3 player music, UI effects (`ui/`)

### Community 124 - "The Costume Atelier"
Cohesion: 0.14
Nodes (13): Adding a character, Adding a costume, Art not supplied as files, Bruce's Chronicles, Checked against the mocks (2026-11-07), Code, Costume fit review, Floral collection (+5 more)

### Community 125 - "PondPanels.tsx"
Cohesion: 0.11
Nodes (20): Loading(), metadata, PondPage(), POND_NAME, PondLoading(), BOARD_TABS, PondOverlayKind, PondPanels() (+12 more)

### Community 126 - "rules.ts"
Cohesion: 0.11
Nodes (25): buildClaim(), BuiltClaim, EarnDetail, GameSource, newRunId(), now, localDay(), at() (+17 more)

### Community 127 - "ClosetView.tsx"
Cohesion: 0.13
Nodes (18): ClosetView(), close(), onKeyDown(), Wheel(), onPointerUp(), trapTab(), MIRROR_SRC, MirrorView() (+10 more)

### Community 128 - "sketchguess/lib/api.ts"
Cohesion: 0.18
Nodes (13): sameOriginUrl(), decodeImage(), fetchBitmap(), fetchRound(), guarded(), InkMap, loadInk(), loadRound() (+5 more)

### Community 129 - "presence/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, types, exclude, extends, include, ../../tsconfig.base.json

### Community 130 - "wallet.ts"
Cohesion: 0.07
Nodes (42): shutdown(), grantPearls(), member(), now, piece(), randomId(), today, main() (+34 more)

### Community 131 - "tsconfig.test.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 132 - "BugReportSheet.tsx"
Cohesion: 0.14
Nodes (21): BugReportHost(), BugReportSheet, BugReportSheet(), send(), Status, collectContext(), inAppBrowser(), onOpenBugReport() (+13 more)

### Community 133 - "AssetImage"
Cohesion: 0.18
Nodes (14): BoardScreen(), BoardScreenProps, PinnedNotes(), PinnedNotesProps, ReadScreenProps, NOTE_PLACES, NotePlace, coin (+6 more)

### Community 134 - "peers.ts"
Cohesion: 0.14
Nodes (7): INTERPOLATION_DELAY_MS, PEER_TIMEOUT_MS, PeerTable, positionAt(), Sample, look, Peer

### Community 135 - "plan.ts"
Cohesion: 0.43
Nodes (5): openingPlan(), prepareSketchGame(), planGame(), randomRound(), ROUND_SPREAD

### Community 136 - "Atelier: the dressing mirror, and show-don't-tell keeping"
Cohesion: 0.13
Nodes (14): Atelier: the dressing mirror, and show-don't-tell keeping, Build order, Built (2026-11-20), Decisions (2026-11-19), Follow-ups (2026-11-20), Goal, In the room, Keeping (+6 more)

### Community 137 - "Multiplayer ("other visitors") — plan v2 (Cloudflare)"
Cohesion: 0.10
Nodes (19): 0. Summary, 10. Decisions, 1. Product contract changes (approved 2026-10-31), 2. What already exists that this builds on, 3.1 Generated names (everyone has one), 3. Names, 4. Transport: Cloudflare Durable Objects, 5.1 Emotes (v1) (+11 more)

### Community 138 - "presence.test.ts"
Cohesion: 0.07
Nodes (26): Entry, Connect, connectWebSocket(), fetchTicket, HEARTBEAT_MS, HIDDEN_LIMIT_MS, RETRY_MS, sameLook() (+18 more)

### Community 139 - "room-places.ts"
Cohesion: 0.14
Nodes (19): NpcGround, PlaceKind, atelierRoomInfo(), atelierX(), copy(), FurniturePlacement, hallCache, hallRoomInfo() (+11 more)

### Community 140 - "bug-reports.ts"
Cohesion: 0.20
Nodes (13): BugReport, BugReportDto, BugReportRateLimited, BugReportRejected, BugRow, CONTEXT_KEYS, EVERYONE, normalizeBugPage() (+5 more)

### Community 141 - "confirm/page.tsx"
Cohesion: 0.33
Nodes (7): ConfirmFollow(), dynamic, dynamic, Unsubscribe(), FollowNotice(), confirmFollow(), unsubscribe()

### Community 142 - "ref_node_assert"
Cohesion: 0.39
Nodes (6): garlandRibbon(), at(), GarlandShape, Ribbon, sag(), shape

### Community 143 - "Walker"
Cohesion: 0.19
Nodes (3): FloorPoint, WalkArea, Walker

### Community 144 - "The Moonlit Pond — design"
Cohesion: 0.09
Nodes (22): Art the pond needs from the artist, Build contract (decided 2026-11-07), Build phases, Collection and goals, Done, Done, Guardrails, Leaderboards (+14 more)

### Community 145 - "Pond rework"
Cohesion: 0.18
Nodes (10): Baits, Client, Decisions, Done, Notes, Pond rework, Server, Species (+2 more)

### Community 146 - "createStage"
Cohesion: 0.12
Nodes (27): boundedCameraX(), FLICK, flickDirection(), isUpwardFlick(), createNearby(), createStage(), closeEntry(), enter() (+19 more)

### Community 147 - "Orchestration contract — you plan, DSH workers execute"
Cohesion: 0.29
Nodes (6): Briefing a worker, Budget hygiene, graphify, Orchestration contract — you plan, DSH workers execute, The worker, When not to delegate

### Community 148 - "tables.ts"
Cohesion: 0.10
Nodes (33): BaitTray(), BaitTrayProps, CatchWagerView, debugSpecies(), debugVariant(), GuestRollOptions, guestTreasure(), rollGuest() (+25 more)

### Community 149 - "ClosetView.tsx"
Cohesion: 0.16
Nodes (14): LISTS, PLACE, PODIUM_SRC, Props, Slot, SPOTLIGHT_SRC, choiceAt(), HEADPIECES (+6 more)

### Community 150 - "useBackgroundMusic.ts"
Cohesion: 0.12
Nodes (26): BackgroundMusic, clampVolume(), isDocumentHidden(), Options, useBackgroundMusic(), VISIBILITY_EVENTS, EFFECTS, EffectSpec (+18 more)

### Community 151 - "readJsonBody"
Cohesion: 0.20
Nodes (14): roomEditor, PER_EDITOR, PUT(), versionOf(), PER_MEMBER, POST(), PER_EDITOR, POST() (+6 more)

### Community 153 - "Item"
Cohesion: 0.14
Nodes (3): Room, Presence, Item

### Community 154 - "run.ts"
Cohesion: 0.20
Nodes (7): admin, childEnv, client, database, fresh, migrations, target

### Community 155 - "Curating the paintings (2026-11-07)"
Cohesion: 0.12
Nodes (15): hang(), 1. The registry and the table, 2. The studio's Location picker, 3. The rooms draw what is placed, 4. Credits, 5. Retiring self-serve artists, Building it, Curating the paintings (2026-11-07) (+7 more)

### Community 156 - "hit.ts"
Cohesion: 0.17
Nodes (12): CoinWall, createHiddenCoin(), Spot, AlphaMap, alphaMapFor(), alphaMaps, buildAlphaMap(), isPaintedAt() (+4 more)

### Community 157 - "Walkthrough.tsx"
Cohesion: 0.15
Nodes (19): BACKDROP_STYLE, MoreArrow(), NavArrow(), Props, SLIDE, Walkthrough(), XIcon(), decodedFrames (+11 more)

### Community 158 - "pond/room.ts"
Cohesion: 0.11
Nodes (23): createPondRoom(), approach(), busy(), finishWalk(), goTo(), leave(), move(), nearest() (+15 more)

### Community 159 - "Message"
Cohesion: 0.21
Nodes (11): BugReportsPage(), dateFormat, dynamic, summary(), dateFormat, dynamic, GuestBoardPage(), SignIn() (+3 more)

### Community 160 - "player-card.ts"
Cohesion: 0.09
Nodes (16): createPlayerCard(), hide(), onPointerDown(), Door, doorOf(), PlayerCard, wallpaperOf(), cozyLevel (+8 more)

### Community 161 - "domain/guestboard.ts"
Cohesion: 0.23
Nodes (11): GET(), decodeCursor(), encodeCursor(), GuestNoteInput, GuestNoteRejected, listGuestNotes(), PER_VISITOR, toDto() (+3 more)

### Community 162 - "writeLocal"
Cohesion: 0.33
Nodes (10): unlockEverything(), saveIfHigher(), AdminTools(), restartInCloset(), turnOff(), turnOn(), unlock(), startOverInCloset() (+2 more)

### Community 163 - "import-home-assets.mjs"
Cohesion: 0.06
Nodes (28): BASEBOARD, CURTAIN, drop, EXPECTED, file(), manifest, manifestPath, masters (+20 more)

### Community 164 - "db.ts"
Cohesion: 0.09
Nodes (24): CONTENT_TYPES, GET(), PUT(), addPondPhoto(), AddPondPhotoResult, isJpeg(), POND_PHOTO_LIMIT, PondPhoto (+16 more)

### Community 165 - "CrowdPreview.tsx"
Cohesion: 0.25
Nodes (9): CrowdPreviewPage(), CrowdPreview(), draw(), KINDS, Stats, Window, loadKind(), clearRigLayer() (+1 more)

### Community 166 - "createRemoteVisitors"
Cohesion: 0.24
Nodes (9): createRemoteVisitors(), ensureLayer(), hideSprites(), load(), placeOwn(), show(), showProp(), sprite() (+1 more)

### Community 168 - "app/page.tsx"
Cohesion: 0.29
Nodes (8): [BRAND_OWNER, ...BRAND_REST], CurrentlyShowing(), Decor(), dynamic, LandingPage(), openAccountCreation(), LandingAccount(), E2E-016 — Landing artist list repeats an artist and uses duplicate React keys

### Community 169 - "empty"
Cohesion: 0.47
Nodes (6): POST(), POST(), POST(), checkPasswordRateLimit(), empty(), clearMemberCookie()

### Community 170 - "Medium"
Cohesion: 0.22
Nodes (9): onClick(), 10. Long names run off the name sign, 11. The rooms API skips the stale-tab member check, 12. The bunny is dragged along while you pan in Decorate, 6. Failed saves are nearly invisible, and nothing retries, 7. Two tabs editing the same room overwrite each other, 8. The drawer's card row can't be scrolled on touch screens, 9. Decorating can't be done with the keyboard (+1 more)

### Community 171 - "layout.ts"
Cohesion: 0.17
Nodes (13): cafeAfterIndex(), comingSoonWidth(), computeLayout(), clear(), placeCafe(), cutRooms(), DoorSpan, HALL_DOOR_FOOT (+5 more)

### Community 172 - "xdog.ts"
Cohesion: 0.39
Nodes (5): blur(), kernel(), XDOG_DEFAULTS, xdogInk(), XdogOptions

### Community 173 - "src/types.ts"
Cohesion: 0.11
Nodes (22): ArtistPage(), dynamic, generateMetadata(), GET(), GET(), FollowForm(), SlotRuntime, getArtistPage() (+14 more)

### Community 175 - "frame-clock.test.ts"
Cohesion: 0.38
Nodes (5): MAX_CATCH_UP_SECONDS, MAX_STEP_SECONDS, movementSteps(), RESTING_TICK_MS, shouldTick()

### Community 176 - "Local end-to-end stress test — 2026-11-06"
Cohesion: 0.15
Nodes (13): 13. Pages that redirect or don't exist answer 200, 14. Error codes reveal which room slugs exist, 15. The name sign slides under the top-right buttons in Decorate, 16. Level-up celebrations can be farmed, 17. No hint of where things are after panning away, 18. Too many items is only discovered by the server, 19. Development-only: page payloads include the full room row, Checked and fine (+5 more)

### Community 177 - "visits.ts"
Cohesion: 0.06
Nodes (46): state(), PER_VISITOR, POST(), dynamic, format(), grade(), METRICS, PAGES (+38 more)

### Community 178 - "master"
Cohesion: 0.28
Nodes (9): closedWaist(), goldOutfits(), image(), master(), placed(), rig(), slimGlb(), write() (+1 more)

### Community 179 - "createPlacementLayer"
Cohesion: 0.27
Nodes (9): aspectOf(), createPlacementLayer(), drawOutline(), dropGhosts(), dropHelper(), extrasFor(), silhouette(), sizeOf() (+1 more)

### Community 180 - "Local end-to-end stress test — 2026-11-06"
Cohesion: 0.22
Nodes (7): Environment and coverage, Follow-up coverage, Issue index, Local end-to-end stress test — 2026-11-06, Measured load, Passing checks and interpretation limits, Test data and cleanup

### Community 181 - "messages.ts"
Cohesion: 0.36
Nodes (6): checkMessage(), INVISIBLE, MESSAGE_MAX, MessageCheck, normalizeMessage(), hasProfanity()

### Community 182 - "schedule.test.ts"
Cohesion: 0.10
Nodes (17): NPC_WALK_SPEED, RESIDENT_IDS, ROOM_KINDS, ROOMS, NpcRoom, ROOM_DOORS, SCHEDULE_SEED, SLOT_MS (+9 more)

### Community 183 - "Storyline (draft, saved 2026-11-17)"
Cohesion: 0.15
Nodes (12): Arc (soft, no fail state), Built so far, How it ties to what exists, Locked (2026-11-21, the owner), Next tasks (when picked up), Open questions, Premise, Revision (2026-11-21, the owner) (+4 more)

### Community 184 - "createCharacter"
Cohesion: 0.38
Nodes (6): createCharacter(), contextLost(), loadFallbackWalk(), loseRig(), setFrame(), Angler()

### Community 185 - "bake-pond-path.mjs"
Cohesion: 0.21
Nodes (7): blank(), manifest, manifestPath, ORIGINAL_SOURCE, originalPath(), root, softened()

### Community 186 - "personal/room.ts"
Cohesion: 0.07
Nodes (31): createPersonalRoom(), light(), shade(), showArrangement(), signFilter(), DOOR_SIGN, gloomFor(), lightOf() (+23 more)

### Community 190 - "createPixelRatioGovernor"
Cohesion: 0.33
Nodes (7): createPixelRatioGovernor(), reset(), stepTo(), PIXEL_RATIO_STEPS, pixelRatioSteps(), Renderer, governor()

### Community 191 - "SyncStore"
Cohesion: 0.14
Nodes (8): encodeStored(), parseStored(), readStored(), writeStored(), SlotState, SyncStore, SlotDef, upgrade()

### Community 192 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, db:schema, deploy:backend, dev, dev:presence, dev:web, dev:worker (+6 more)

### Community 193 - "Monets Lily Pond: exploration, UX and multiplayer QA"
Cohesion: 0.29
Nodes (6): Browser and interaction coverage, Changes made from the walkthrough, Monets Lily Pond: exploration, UX and multiplayer QA, Multiplayer and load, Practical limits, Regression checks and cleanup

### Community 195 - "opening.ts"
Cohesion: 0.43
Nodes (5): COLD_DOOR_HOLD_MS, hallIsReady(), Opening, OPENING_MAX_WAIT_MS, at()

### Community 196 - "createRoomPassage"
Cohesion: 0.60
Nodes (3): coverFloorTransition(), createRoomPassage(), fixture()

### Community 197 - "paintedCostume"
Cohesion: 0.33
Nodes (5): paintedCostume(), floralOutfits(), turned(), Fitting clothes to other characters, Headpieces

### Community 198 - "journal.ts"
Cohesion: 0.10
Nodes (22): SONG, POND_SIGN_NAME, gradeLabel(), JOURNAL_FAMILIES, JOURNAL_GRADES, JOURNAL_SIZE, journalCatch, journalFamily (+14 more)

### Community 199 - "handlers.ts"
Cohesion: 0.06
Nodes (66): loop(), sleep(), sweepStale(), DrainResult, handler(), repairFrames(), confirmedFollowers(), createInquiry() (+58 more)

### Community 200 - "playwright"
Cohesion: 0.40
Nodes (3): [, width, height], playwright@^1.63.0, playwright

### Community 201 - "ticket/route.ts"
Cohesion: 0.11
Nodes (30): PER_MEMBER, PUT(), PER_IP, POST(), presenceUrl(), Code, How it plays, Other visitors (+22 more)

### Community 202 - "rig.ts"
Cohesion: 0.12
Nodes (27): Layer, setCostumeVisibility(), follow(), canvasToModel(), createRenderer(), createRigLayer(), disposeRigLayer(), Frame (+19 more)

### Community 204 - "walk"
Cohesion: 0.18
Nodes (12): walk(), 1. What is in this bundle, 3. The rig, 4. Suggested plan, 5. Blender-side work still to do (needs Blender; the author has it with an MCP bridge), 6. Open questions for the author, Handoff: move the Tiny Museum bunny from sprite frames to a rig, Approved v4 bunny in the hall (+4 more)

### Community 205 - "nearby.ts"
Cohesion: 0.18
Nodes (5): Nearby, NearbyReach, RoomSpan, reach, strip

### Community 206 - "createReveal"
Cohesion: 0.50
Nodes (3): PlaceInfo, createReveal(), compose()

### Community 208 - "BunnyArtist.tsx"
Cohesion: 0.50
Nodes (4): BunnyArtist(), BunnyMood, Pencil(), POSES

### Community 209 - "react"
Cohesion: 0.06
Nodes (34): config, SECURITY_HEADERS, bethEllen, inspiratiq, metadata, notoSans, RootLayout(), sniglet (+26 more)

### Community 210 - "lib/slots/index.ts"
Cohesion: 0.11
Nodes (15): PresencePreviewPage(), KeepOnOtherDevices(), PresencePreview(), WalkAlone(), NameError, useVisitorName(), VisitorName, Probe() (+7 more)

### Community 213 - "RigPreview.tsx"
Cohesion: 0.13
Nodes (21): RigPreviewPage(), NEXT, PROPS, RigPreview(), draw(), cache, queue, render() (+13 more)

### Community 216 - "npc-sheet.cjs"
Cohesion: 0.31
Nodes (8): CFG, closeEye(), eraseMouth(), inpaint(), sample(), sharp, [src, out, cfgPath], warp()

### Community 225 - "painting-open"
Cohesion: 0.50
Nodes (4): file, kilobytes, seconds, painting-open

### Community 230 - "icon-basket"
Cohesion: 0.67
Nodes (3): icon-basket, file, vector

## Knowledge Gaps
- **5 isolated node(s):** `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1691 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **29 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `RevealCard.tsx` to `AtelierKeeps.tsx`, `SketchGuess.tsx`, `DoorEditor`, `builtUrl`, `BugReportSheet.tsx`, `AssetImage`, `machine.ts`, `Museum.tsx`, `Test Fakes and Helpers`, `DecorDrawer.tsx`, `room-events.ts`, `PersonalRoom.tsx`, `ClosetView.tsx`, `tables.ts`, `useBackgroundMusic.ts`, `pond-api.ts`, `Walkthrough.tsx`, `Web Package Dependencies`, `risk.ts`, `writeLocal`, `CrowdPreview.tsx`, `app/page.tsx`, `currentMember`, `actions.ts`, `Water.tsx`, `pond-format.ts`, `GuestBoard.tsx`, `LandingFx`, `journal.ts`, `react`, `lib/slots/index.ts`, `RigPreview.tsx`, `npc-layer.ts`, `paintings/page.tsx`, `pond/room.ts`, `FishingView.tsx`, `PondPanels.tsx`, `ClosetView.tsx`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **What connects `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json` to the rest of the system?**
  _5 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `AtelierKeeps.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09254901960784313 - nodes in this community are weakly interconnected._
- **Why does `useSound()` connect `RevealCard.tsx` to `AtelierKeeps.tsx`, `SketchGuess.tsx`, `BugReportSheet.tsx`, `AssetImage`, `machine.ts`, `Museum.tsx`, `DecorDrawer.tsx`, `room-events.ts`, `PersonalRoom.tsx`, `ClosetView.tsx`, `tables.ts`, `pond-api.ts`, `Walkthrough.tsx`, `risk.ts`, `src/types.ts`, `pond-format.ts`, `GuestBoard.tsx`, `journal.ts`, `react`, `npc-layer.ts`, `museum/layout.tsx`, `pond/room.ts`, `PondPanels.tsx`, `ClosetView.tsx`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Should `themes.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05584415584415584 - nodes in this community are weakly interconnected._
- **Why does `three` connect `hall/room.ts` to `scene/assets.ts`, `config.ts`, `scene.ts`, `cozy.ts`, `room-events.ts`, `ambience.ts`, `hit.ts`, `pond/room.ts`, `Web Package Dependencies`, `stage.ts`, `DecorController`, `atelier.ts`, `paintedCostume`, `scene/ambience.ts`, `rig.ts`, `pond/art.ts`, `RigPreview.tsx`, `npc-layer.ts`, `pond/room.ts`, `hang-tag.ts`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Should `SketchGuess.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09759759759759759 - nodes in this community are weakly interconnected._