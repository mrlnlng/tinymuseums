# Graph Report - tiny-museum  (2026-11-23)

## Corpus Check
- 567 files · ~348,398 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 106 file(s) not represented in the graph (top: .avif 56, .glb 38, .css 7)

## Summary
- 5092 nodes · 13228 edges · 230 communities (201 shown, 29 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 259 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `bd5dd3b6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- AtelierKeeps.tsx
- locations.ts
- SketchGuess.tsx
- DoorEditor.tsx
- app/page.tsx
- round.ts
- floor.ts
- Core Asset Manifest
- scene/assets.ts
- RoomContents
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
- Placement
- media/storage.ts
- pond-api.ts
- ambience.ts
- core/src/index.ts
- Web Package Dependencies
- Gamifying Tiny Museum — genre direction & engagement research
- museum/layout.tsx
- remote-visitors.ts
- risk.ts
- amplify/tsconfig.json
- 5. Customization menu — what other people are doing
- stage.ts
- domain/sketch.ts
- Web TSConfig
- Root Package Manifest
- audience.ts
- stage.ts
- import-fishing-assets.mjs
- Base TSConfig
- Amplify Build Spec
- sketchguess/lib/api.ts
- actions.ts
- useEscapeKey
- LandingFx
- Water.tsx
- Worker Package Manifest
- Public Asset Manifest
- rules.ts
- atelier.ts
- compose-atelier.mjs
- rooms.ts
- pond-format.ts
- pond/art.ts
- economy/store.ts
- RigPreview.tsx
- room.ts
- minimap.ts
- tab-turn.ts
- domain/guestboard.ts
- Sound Effect Assets
- art-cache.ts
- Custom HTTP Headers
- Sharp Layer Package
- links.ts
- scene/ambience.ts
- Confirmed issues
- session.ts
- DecorController
- Visits SQL Schema
- Bunny Walk Sprites
- Room Mockup Settings
- Service Worker Caching
- HallCallbacks
- stone-path-bake.ts
- createPresence
- members
- Frame Window Asset
- wander.ts
- presence/package.json
- createAtelierRoom
- Asset pipeline: fast loading without losing sharpness
- Guest Board SQL Schema
- Landscape Frame Asset
- import-hall-assets.mjs
- Bug Reports SQL Schema
- Vitals SQL Schema
- infra/jobs.ts
- ClosetView.tsx
- pond/room.ts
- members.ts
- Run-Once Schema
- hall/room.ts
- FishingView.tsx
- AtelierRoom
- remote-visitors.ts
- Your Room: a room you can freely furnish
- json
- graftCostume
- FishingView.tsx
- worker/tsconfig.json
- core/tsconfig.json
- features/economy/index.ts
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
- wander.test.ts
- MirrorView
- queryOne
- presence/tsconfig.json
- wallet.ts
- tsconfig.test.json
- react
- itemIdFor
- peers.ts
- run.ts
- ReadScreen.tsx
- npc-layer.ts
- GuestBoard.tsx
- room-places.ts
- bug-report.ts
- overlay.ts
- LeaderboardPanel.tsx
- env.ts
- The Moonlit Pond — design
- Pond rework
- initialize
- Orchestration contract — you plan, DSH workers execute
- tables.ts
- lib/presence.ts
- bug-reports.ts
- defaultStore
- FakeServer
- pond-boards.ts
- epoch.ts
- hang-tag.ts
- outbox.test.ts
- Walkthrough.tsx
- createPondRoom
- import-home-assets.mjs
- createPlacementLayer
- Atelier: the dressing mirror, and show-don't-tell keeping
- darknessAt
- AssetImage
- bake-shopkeeper.mjs
- Multiplayer ("other visitors") — plan v2 (Cloudflare)
- Lobby
- createCozyBackdrop
- gallery.ts
- CrowdPreview.tsx
- backend.ts
- PondPanels.tsx
- xdog.ts
- a/[slug]/page.tsx
- Local end-to-end stress test — 2026-11-06
- frame.ts
- useSound
- visits.ts
- .update
- Tasks
- performance/page.tsx
- formatInteger
- schedule.test.ts
- Storyline (draft, saved 2026-11-17)
- Low
- bake-pond-path.mjs
- personal/room.ts
- themes.ts
- draw.py
- Conn
- import-landing-assets.mjs
- SyncStore
- scripts
- Monets Lily Pond: exploration, UX and multiplayer QA
- createStage
- .webSocketMessage
- AccountSheet
- scripts
- useSoundEffects.ts
- handlers.ts
- createCharacter
- ticket/route.ts
- rig.ts
- npcs/README.md
- createRemoteVisitors
- nearby.ts
- paintings/page.tsx
- catalog.ts
- earn
- app/layout.tsx
- lib/slots/index.ts
- FilesystemStorage
- messages.ts
- plan.ts
- Open rooms and the tip jar (design, 2026-11-21)
- BountyPanel.tsx
- npc-sheet.cjs
- Cafe
- master
- doors.sql
- flick.ts
- PlayerCard
- ArtCache
- PerfMeter
- jump
- Rooms
- Other visitors
- paintedCostume
- boundedCameraX

## God Nodes (most connected - your core abstractions)
1. `react` - 83 edges
2. `json()` - 72 edges
3. `query()` - 71 edges
4. `PersonalRoom()` - 67 edges
5. `hit()` - 58 edges
6. `limited()` - 52 edges
7. `three` - 50 edges
8. `next` - 47 edges
9. `Traversal` - 46 edges
10. `createHallRoom()` - 46 edges

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

## Communities (230 total, 29 thin omitted)

### Community 0 - "AtelierKeeps.tsx"
Cohesion: 0.12
Nodes (23): CoinToast(), Toast, Purse(), Stamp(), WalletProvider(), STAMP_ASPECT, STAMP_SVG, STAMP_URL (+15 more)

### Community 1 - "locations.ts"
Cohesion: 0.13
Nodes (33): COLLECTIONS, publishLocationAction(), discardLocation(), hangableOnly(), hasUnpublished(), inUse(), locationStates(), nudgeInRow() (+25 more)

### Community 2 - "SketchGuess.tsx"
Cohesion: 0.09
Nodes (36): BunnyArtist(), BunnyMood, Pencil(), POSES, bestKeyFor(), BURST, clueUrl(), openingPlan() (+28 more)

### Community 3 - "DoorEditor.tsx"
Cohesion: 0.07
Nodes (53): CAST, saveDoorsAction(), DoorEditor(), add(), apply(), commitSlide(), nudge(), pick() (+45 more)

### Community 4 - "app/page.tsx"
Cohesion: 0.17
Nodes (15): dynamic, Hall(), MuseumPage(), [BRAND_OWNER, ...BRAND_REST], CurrentlyShowing(), Decor(), dynamic, LandingPage() (+7 more)

### Community 5 - "round.ts"
Cohesion: 0.16
Nodes (26): deltaE(), GAMUT_EPSILON, hexToOklab(), inGamut(), linearRgbToOklab(), linearToSrgb(), Oklab, oklabToLinearRgb() (+18 more)

### Community 6 - "floor.ts"
Cohesion: 0.09
Nodes (35): clone(), closestOnSegment(), cross(), crossVec(), depthAtY(), depthBounds(), depthT(), DepthView (+27 more)

### Community 7 - "Core Asset Manifest"
Cohesion: 0.05
Nodes (41): artworks, audio, file, megabytes, seconds, sourceName, startedAt, bunny (+33 more)

### Community 8 - "scene/assets.ts"
Cohesion: 0.06
Nodes (57): DENSITY_MEDIA, HallPreload(), AssetManifest, assetUrl(), bitmapTexture(), blankImage(), CAFE_CAT_FRAMES, CompressedLoader (+49 more)

### Community 9 - "RoomContents"
Cohesion: 0.16
Nodes (4): Pose, RoomContents, Model (`apps/web/src/features/rooms/types.ts`), Phase 2: hall on the stage

### Community 10 - "machine.ts"
Cohesion: 0.12
Nodes (35): CastMeter(), ReelMeter(), armCast(), BITE_WINDOW, biteGap(), CHARGE_PERIOD, chargePower(), createFishingState() (+27 more)

### Community 11 - "Museum.tsx"
Cohesion: 0.11
Nodes (33): Loading(), AtelierPage(), dynamic, metadata, Loading(), useWallet(), Atelier(), leave() (+25 more)

### Community 12 - "Test Fakes and Helpers"
Cohesion: 0.08
Nodes (32): loadedMember, loadingMember, look, nonMember, deferredFetch(), deviceSlot, FakeEvents, FakeStorage (+24 more)

### Community 13 - "scene.ts"
Cohesion: 0.04
Nodes (42): disposeDisplayTexture(), HELM_PEDESTAL_FILE, prefersAvif(), HiddenCoin, cafeAfterIndex(), computeLayout(), clear(), placeCafe() (+34 more)

### Community 14 - "cozy.ts"
Cohesion: 0.07
Nodes (44): ATELIER_PROPS, AtelierImage, atticWindowCanvas(), bareBulbCanvas(), boardsCanvas(), canvasTexture(), ceilingTexture(), cobwebCanvas() (+36 more)

### Community 15 - "logic.ts"
Cohesion: 0.07
Nodes (42): Door, doorOf(), wallpaperOf(), DecorDrawer, DecorDrawerProps, SLOT_LABELS, Tab, TABS (+34 more)

### Community 16 - "room-events.ts"
Cohesion: 0.17
Nodes (28): ChatButton(), REFUSED, joinRoom(), Options, STANDING, emit(), getPeople(), isInRoom() (+20 more)

### Community 17 - "schedule.ts"
Cohesion: 0.07
Nodes (55): addDwellEmotes(), addEmote(), addGap(), addStand(), addWalk(), along(), buildRoomTable(), buildStayPlan() (+47 more)

### Community 18 - "ref_node_assert"
Cohesion: 0.12
Nodes (28): defineSlot(), docBytes(), SLOTS, byAtThenKey(), encoded(), latest, mapOf(), maxNumber() (+20 more)

### Community 19 - "amplify/package.json"
Cohesion: 0.17
Nodes (14): devDependencies, @aws-amplify/backend@^1.14.0, @aws-amplify/backend-cli@^1.6.0, aws-cdk-lib@^2.180.0, constructs@^10.3.0, name, private, scripts (+6 more)

### Community 20 - "PersonalRoom.tsx"
Cohesion: 0.09
Nodes (50): errorReason(), Job, Offer, overDrawer(), PersonalRoom(), canPlaceNew(), carriedTo(), carryEnd() (+42 more)

### Community 21 - "prepare-models.mjs"
Cohesion: 0.07
Nodes (29): alongArm(), ARMS, armTurn(), BODIES, bruce, BRUCE_FIT, BRUCE_PLACE, BRUCE_SLEEVES (+21 more)

### Community 23 - "core/package.json"
Cohesion: 0.06
Nodes (40): dependencies, @aws-sdk/client-s3@^3.1121.0, @aws-sdk/s3-request-presigner@^3.1121.0, bcryptjs@^2.4.3, obscenity@^0.4.6, pg@^8.13.1, sharp@^0.33.5, thumbhash@^0.1.1 (+32 more)

### Community 24 - "hitForVisitor"
Cohesion: 0.07
Nodes (44): POST(), ALLOWED, PER_VISITOR, POST(), POST(), POST(), POST(), GET() (+36 more)

### Community 25 - "Placement"
Cohesion: 0.09
Nodes (9): Carry, PersonalRoomProps, DecorLive, GhostOptions, PlacementLayer, PlacementTheme, The closet: where every room starts (2026-11-17), Placement (+1 more)

### Community 26 - "media/storage.ts"
Cohesion: 0.11
Nodes (17): CONTENT_TYPES, GET(), PUT(), ACCEPTED, createAssetFromUpload(), MAX_UPLOAD_BYTES, presignUpload(), registerUpload() (+9 more)

### Community 27 - "pond-api.ts"
Cohesion: 0.19
Nodes (21): buyPondBait(), claimPondBounty(), errorOf(), exchangePondPearls(), fetchPondFeed(), fetchPondLeaderboard(), isRecord(), isStateView() (+13 more)

### Community 28 - "ambience.ts"
Cohesion: 0.12
Nodes (29): blade(), bloom(), BLOOMS, createPondAmbience(), update(), fishTexture(), frond(), FRONT_ROWS (+21 more)

### Community 29 - "core/src/index.ts"
Cohesion: 0.05
Nodes (114): addBait(), PondBoardMe, PondBoardRow, PondFeedItem, Rep, bountyCatches(), BountyCatchRow, bountyViews() (+106 more)

### Community 30 - "Web Package Dependencies"
Cohesion: 0.10
Nodes (27): dependencies, embla-carousel-react@^8.6.0, motion@^13.1.1, next@^15.0.3, react@^19.0.0, react-dom@^19.0.0, swr@^2.5.1, three@^0.169.0 (+19 more)

### Community 31 - "Gamifying Tiny Museum — genre direction & engagement research"
Cohesion: 0.10
Nodes (19): 0.1 The core experience, 0.2 Systems that make gamification cheap to build, 0.3 Constraints that shape any recommendation, 0. What the game is today (the deep dive), 1.1 The landscape (seven candidates, with verdicts), 1.2 Recommendation: a **cozy gallery life-sim** — "the gallery you live in", 1.3 The five design pillars the genre implies, 1. Genre direction (+11 more)

### Community 32 - "museum/layout.tsx"
Cohesion: 0.43
Nodes (5): MuseumLayout(), setMuseumDoors(), MuseumDoors(), MuseumStage(), publishedDoors()

### Community 33 - "remote-visitors.ts"
Cohesion: 0.06
Nodes (50): Assets, CUTS, disposeBoards(), Mark, plane(), ROPE_CUTS, ropeSlices(), sliceOf() (+42 more)

### Community 34 - "risk.ts"
Cohesion: 0.12
Nodes (31): Hud(), HudProps, HudWagerChip, WagerPicker(), chooseTier(), WagerPickerProps, CastOptions, PondStateView (+23 more)

### Community 35 - "amplify/tsconfig.json"
Cohesion: 0.20
Nodes (9): compilerOptions, module, moduleResolution, noUnusedLocals, noUnusedParameters, exclude, extends, include (+1 more)

### Community 36 - "5. Customization menu — what other people are doing"
Cohesion: 0.12
Nodes (16): 1. The target: what "Claude Opus 5.5" actually means, 2. Where your harness stands today (live config I read), 3. The honest gap model, 4. Quality levers, ranked by leverage, 5. Customization menu — what other people are doing, 6. Recommended starting kit for *your* profile, 7. What I can apply for you right now (needs your go-ahead), A. Prompt & persona (most common quality customizations) (+8 more)

### Community 37 - "stage.ts"
Cohesion: 0.05
Nodes (33): Scenery, Attachment, Carried, CarriedState, createCarried(), Character, Perch, Pose (+25 more)

### Community 38 - "domain/sketch.ts"
Cohesion: 0.12
Nodes (25): listPieces(), pieceImageUrl(), PieceRow, toPieceDto(), GalleryRow, getSketchRound(), planSketchRound(), SKETCH_CHOICES (+17 more)

### Community 39 - "Web TSConfig"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 40 - "Root Package Manifest"
Cohesion: 0.13
Nodes (19): description, devDependencies, concurrently@^9.1.0, esbuild@^0.24.0, ktx2-encoder@^0.6.0, maxrects-packer@^2.7.3, @types/node@^22.9.0, typescript@^5.6.3 (+11 more)

### Community 41 - "audience.ts"
Cohesion: 0.13
Nodes (17): ConfirmFollow(), dynamic, dynamic, Unsubscribe(), FollowNotice(), AnalyticsSummary, confirmFollow(), follow() (+9 more)

### Community 42 - "stage.ts"
Cohesion: 0.05
Nodes (31): coverFloorTransition(), CharacterSprites, CameraRig, createPixelRatioGovernor(), PIXEL_RATIO_STEPS, createRoomPassage(), fixture(), createPerfMeter() (+23 more)

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
Cohesion: 0.15
Nodes (16): sameOriginUrl(), PreparedGame, decodeImage(), fetchBitmap(), fetchRound(), guarded(), InkMap, LoadedRound (+8 more)

### Community 47 - "actions.ts"
Cohesion: 0.11
Nodes (33): BugReportsPage(), dateFormat, dynamic, summary(), dateFormat, dynamic, GuestBoardPage(), back() (+25 more)

### Community 48 - "useEscapeKey"
Cohesion: 0.10
Nodes (22): openBugReport(), fitWidth(), HelpGuide(), HelpGuideProps, POINTER_STEPS, TOUCH_STEPS, loadGameDesktop(), loadHallArranger() (+14 more)

### Community 49 - "LandingFx"
Cohesion: 0.09
Nodes (24): between(), CAT, Edge, EDGES, runLandingCat(), choosePeeker(), peek(), walk() (+16 more)

### Community 50 - "Water.tsx"
Cohesion: 0.07
Nodes (39): AmbientShadow, box(), BUCKET, bunnyBox(), easeOut(), Glint, LEFT_STYLE, lineColour() (+31 more)

### Community 51 - "Worker Package Manifest"
Cohesion: 0.14
Nodes (14): dependencies, @tiny/core@*, exports, ./lambda, @tiny/core, main, name, private (+6 more)

### Community 52 - "Public Asset Manifest"
Cohesion: 0.07
Nodes (26): artworks, bunny, bunny-left, size, bunny-right, size, size, floor (+18 more)

### Community 53 - "rules.ts"
Cohesion: 0.15
Nodes (18): localDay(), at(), EXCHANGE_DAILY_STAMPS, EXCHANGE_PEARLS_PER_STAMP, exchangeClaimKey(), GAME_DAILY_CAP, GameId, GAMES (+10 more)

### Community 54 - "atelier.ts"
Cohesion: 0.05
Nodes (39): MIRROR_SRC, Props, AtelierDoor, AtelierImage, BuiltRoom, Cardigan, CARDIGAN_NAMES, CHARACTER_NAMES (+31 more)

### Community 55 - "compose-atelier.mjs"
Cohesion: 0.12
Nodes (10): body, dressLayer, dressWidth, floralWidth, hanger, MANNEQUIN_CANVAS, mask, root (+2 more)

### Community 56 - "rooms.ts"
Cohesion: 0.07
Nodes (39): roomEditor, PER_EDITOR, PUT(), versionOf(), PER_MEMBER, POST(), PER_EDITOR, POST() (+31 more)

### Community 57 - "pond-format.ts"
Cohesion: 0.11
Nodes (31): fetchPondDex(), PondDex, catchLabel(), EXCHANGE_DAILY_STAMPS, EXCHANGE_PEARLS_PER_STAMP, FISH_ART, fishArt(), formatPercent() (+23 more)

### Community 58 - "pond/art.ts"
Cohesion: 0.23
Nodes (14): ArtByRoom, colorAt(), decoded(), disposePondArt(), EDGE_BAND, EDGE_BANDS, EDGE_OVERLAP, edgeTexture() (+6 more)

### Community 59 - "economy/store.ts"
Cohesion: 0.12
Nodes (38): CARRY_CAP, carryAdd(), CarryEntry, carryPrune(), carryRemove(), chunk(), tzOffsetNow(), cappedTracked (+30 more)

### Community 60 - "RigPreview.tsx"
Cohesion: 0.14
Nodes (20): RigPreviewPage(), NEXT, PROPS, RigPreview(), draw(), cache, queue, render() (+12 more)

### Community 61 - "room.ts"
Cohesion: 0.13
Nodes (29): Env, admitted(), Attachment, farewell(), GHOST_MS, HELLO_TIMEOUT_MS, holdsOf(), homeOf() (+21 more)

### Community 62 - "minimap.ts"
Cohesion: 0.07
Nodes (35): place(), createMinimap(), draw(), drawRoom(), floors(), follow(), sketchOf(), doorPoint() (+27 more)

### Community 63 - "tab-turn.ts"
Cohesion: 0.16
Nodes (5): createTabTurn(), TabTurn, tab(), TurnEnv, TurnMessage

### Community 64 - "domain/guestboard.ts"
Cohesion: 0.16
Nodes (17): GET(), ComposeScreenProps, StickyNoteProps, NoteDraft, useKeyboardLift(), decodeCursor(), encodeCursor(), GuestNoteInput (+9 more)

### Community 65 - "Sound Effect Assets"
Cohesion: 0.15
Nodes (13): file, kilobytes, seconds, file, kilobytes, seconds, file, kilobytes (+5 more)

### Community 66 - "art-cache.ts"
Cohesion: 0.21
Nodes (9): ArtCacheOptions, createArtCache(), drop(), expireLater(), hold(), HeldArt, LoadResult, Slot (+1 more)

### Community 67 - "Custom HTTP Headers"
Cohesion: 0.25
Nodes (7): applications, appRoot, customHeaders, headers, pattern, key, value

### Community 68 - "Sharp Layer Package"
Cohesion: 0.33
Nodes (6): dependencies, sharp@^0.33.5, description, sharp, name, private

### Community 69 - "links.ts"
Cohesion: 0.16
Nodes (9): museumDoors(), EXITS, isDoor(), linkedDoor(), ROOM_PATH, RoomOptions, StageHandlers, DoorRef (+1 more)

### Community 70 - "scene/ambience.ts"
Cohesion: 0.13
Nodes (13): BULBS, createHallAmbience(), finish(), glowTexture(), HallAmbience, mulberry(), painted(), vignetteTexture() (+5 more)

### Community 71 - "Confirmed issues"
Cohesion: 0.12
Nodes (17): Confirmed issues, E2E-002 — Valid edge placement rejected through floating-point precision, E2E-003 — One owned prop can be placed multiple times, E2E-004 — Reload before autosave silently loses the latest placement, E2E-005 — Failed save and failed Done have no visible mobile explanation, E2E-006 — Restoring connectivity does not retry a failed draft save, E2E-007 — Keyboard activation cannot place drawer items, E2E-008 — Creating an account from My Room leaves the signed-in user on the sign-in prompt (+9 more)

### Community 72 - "session.ts"
Cohesion: 0.13
Nodes (23): GET(), PaintingRow, POST(), UPLOADS_PER_ARTIST, POST(), UPLOADS_PER_ARTIST, AnalyticsPage(), dynamic (+15 more)

### Community 73 - "DecorController"
Cohesion: 0.08
Nodes (3): DecorController, PersonalRoomOptions, HighlightArea

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

### Community 79 - "stone-path-bake.ts"
Cohesion: 0.31
Nodes (8): bakeStonePath(), blank(), softened(), STONE_LIGHT, STONE_SHADE, TUFT, warmUp(), yieldToMain()

### Community 80 - "createPresence"
Cohesion: 0.19
Nodes (13): createPresence(), drop(), heartbeat(), maybeSend(), onPageHide(), receive(), scheduleRetry(), send() (+5 more)

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

### Community 89 - "import-hall-assets.mjs"
Cohesion: 0.09
Nodes (17): BASEBOARD, CURTAIN, drop, EXPECTED, file(), manifest, manifestPath, masters (+9 more)

### Community 93 - "infra/jobs.ts"
Cohesion: 0.23
Nodes (15): loop(), shutdown(), sleep(), sweepStale(), DrainResult, handler(), repairFrames(), repairUnframed() (+7 more)

### Community 94 - "ClosetView.tsx"
Cohesion: 0.20
Nodes (13): ClosetView(), onKeyDown(), LISTS, PLACE, PODIUM_SRC, Props, Slot, SPOTLIGHT_SRC (+5 more)

### Community 95 - "pond/room.ts"
Cohesion: 0.10
Nodes (27): FAR_LIFT, FAR_SCALE, liftAt(), pathHalfWidth(), pathX(), PondPath, PROP_DEPTH, scaleAt() (+19 more)

### Community 96 - "members.ts"
Cohesion: 0.08
Nodes (47): registry, started(), CatchExtra, clearCatches(), COLUMNS, grantPearls(), insertCatch(), member() (+39 more)

### Community 104 - "hall/room.ts"
Cohesion: 0.07
Nodes (52): getWalletSnapshot(), subscribeWallet(), Look, createLiveReflection(), GlassRect, LiveReflection, CARDIGANS, COSTUMES (+44 more)

### Community 105 - "FishingView.tsx"
Cohesion: 0.12
Nodes (15): CONFETTI_COLORS, ConfettiPiece, makeConfetti(), RevealCard(), TIER_MS, TIER_SFX, useCountUp(), chainOffer (+7 more)

### Community 107 - "remote-visitors.ts"
Cohesion: 0.11
Nodes (10): RigState, Rig, RemoteVisitor, bubbleFor(), FLAT, MAX_SHOWN, Prop, RemoteVisitors (+2 more)

### Community 108 - "Your Room: a room you can freely furnish"
Cohesion: 0.22
Nodes (8): Admin mode (gamma), Decisions (2026-11-17, with the user), Room look (web, `features/rooms/themes/cozy.ts`, `features/rooms/personal/room.ts`), Scale, Testing locally, What other games do (research, 2026-11-17), Work plan, Your Room: a room you can freely furnish

### Community 109 - "json"
Cohesion: 0.07
Nodes (80): POST(), PER_MEMBER, PUT(), POST(), GET(), GLOBAL, PER_IP, POST() (+72 more)

### Community 110 - "graftCostume"
Cohesion: 0.27
Nodes (14): canvasFit(), compose(), graftCostume(), copyAccessor(), copyMaterial(), copyMesh(), copyTexture(), copyView() (+6 more)

### Community 111 - "FishingView.tsx"
Cohesion: 0.15
Nodes (28): CAST_ERRORS, coarsePointer(), FishingView(), initialEasyReel(), isTyping(), LOST, PondGameProps, Toast (+20 more)

### Community 112 - "worker/tsconfig.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 113 - "core/tsconfig.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 114 - "features/economy/index.ts"
Cohesion: 0.20
Nodes (15): serverSnapshot, useEarnEvents(), buildClaim(), BuiltClaim, EarnDetail, EarnSource, GameSource, newRunId() (+7 more)

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
Nodes (31): fetch(), isHome(), isItem(), isName(), isPid(), isSeq(), MAX_MESSAGE_BYTES, parseClientMessage() (+23 more)

### Community 119 - "Costume gallery doorway"
Cohesion: 0.50
Nodes (3): Costume gallery doorway, Curtain colour edit, Prompt

### Community 120 - "Item"
Cohesion: 0.15
Nodes (3): Room, Presence, Item

### Community 121 - "Fishing forest: painted asset pass"
Cohesion: 0.10
Nodes (18): Assets, Bruce's collection refresh (2026-11-08), Fishing forest illustrations, Made by hand (not touched by the script), Main hall v2 (2026-11-10), Monets Lily Pond (2026-11-08), 1. Forest doorway, 2. Woodland noticeboard (+10 more)

### Community 124 - "The Costume Atelier"
Cohesion: 0.14
Nodes (13): Adding a character, Adding a costume, Art not supplied as files, Bruce's Chronicles, Checked against the mocks (2026-11-07), Code, Costume fit review, Floral collection (+5 more)

### Community 125 - "PondRoom.tsx"
Cohesion: 0.19
Nodes (11): Loading(), metadata, PondPage(), revealFloorTransition(), POND_NAME, PondLoading(), PondFishing(), PondGame (+3 more)

### Community 126 - "wander.test.ts"
Cohesion: 0.12
Nodes (17): FloorSpot, Job, Place, Phase, ResidentState, Run, WalkPath, WalkState (+9 more)

### Community 127 - "MirrorView"
Cohesion: 0.20
Nodes (10): Wheel(), onPointerUp(), MirrorView(), move(), onKeyDown(), onPointerUp(), kindAt(), MIRROR_KINDS (+2 more)

### Community 128 - "queryOne"
Cohesion: 0.18
Nodes (17): dynamic, HangPage(), dynamic, StudioHome(), SignIn(), nudgeInRowAction(), AtelierFrame(), Frame() (+9 more)

### Community 129 - "presence/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, types, exclude, extends, include, ../../tsconfig.base.json

### Community 130 - "wallet.ts"
Cohesion: 0.10
Nodes (30): grantPearls(), member(), now, piece(), randomId(), today, baitOf(), applyClaim() (+22 more)

### Community 131 - "tsconfig.test.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 132 - "react"
Cohesion: 0.11
Nodes (16): config, SECURITY_HEADERS, dynamic, RoomPage(), ActiveRoom, StageContext, StageContextValue, COPY (+8 more)

### Community 133 - "itemIdFor"
Cohesion: 0.30
Nodes (10): allowedCharacter(), OwnedSnapshot, owns(), walletReady(), keepStamps(), StampState, kiki, otter (+2 more)

### Community 134 - "peers.ts"
Cohesion: 0.14
Nodes (7): INTERPOLATION_DELAY_MS, PEER_TIMEOUT_MS, PeerTable, positionAt(), Sample, look, Peer

### Community 135 - "run.ts"
Cohesion: 0.20
Nodes (7): admin, childEnv, client, database, fresh, migrations, target

### Community 136 - "ReadScreen.tsx"
Cohesion: 0.25
Nodes (10): BoardScreen(), BoardScreenProps, PinnedNotes(), PinnedNotesProps, ReadScreenProps, messageLength(), StickyNote(), NOTE_PLACES (+2 more)

### Community 137 - "npc-layer.ts"
Cohesion: 0.09
Nodes (43): GuideTalk(), createDoorGuides(), HallGuide, PROJECTED, BY_ID, castMember(), FRAME, IDLE (+35 more)

### Community 138 - "GuestBoard.tsx"
Cohesion: 0.23
Nodes (11): ComposeScreen(), blankDraft(), GuestBoard(), GuestBoardProps, View, ReadScreen(), fetchPage(), Options (+3 more)

### Community 139 - "room-places.ts"
Cohesion: 0.14
Nodes (24): atelierRoomInfo(), atelierX(), copy(), FurniturePlacement, hallCache, hallRoomInfo(), onGround(), PERSONAL_FURNITURE (+16 more)

### Community 140 - "bug-report.ts"
Cohesion: 0.20
Nodes (15): BugReportHost(), BugReportSheet, BugReportSheet(), send(), Status, collectContext(), inAppBrowser(), onOpenBugReport() (+7 more)

### Community 141 - "overlay.ts"
Cohesion: 0.07
Nodes (15): CafeLink, ComingSoonNote, FunZoneSign, GiftShopSigns, GuestBoardNotes, LobbySigns, Placards, placeLabel() (+7 more)

### Community 142 - "LeaderboardPanel.tsx"
Cohesion: 0.20
Nodes (16): PondBoardId, PondBoardPeriod, PondBoardRow, PondLeaderboard, formatCountdown(), formatOdds(), nextMondayUtc(), useCountdown() (+8 more)

### Community 143 - "env.ts"
Cohesion: 0.14
Nodes (8): manifest, SCHEMA_DIR, isProduction(), presenceSecret(), repoRoot, required(), sessionSecret(), setting()

### Community 144 - "The Moonlit Pond — design"
Cohesion: 0.09
Nodes (22): Art the pond needs from the artist, Build contract (decided 2026-11-07), Build phases, Collection and goals, Done, Done, Guardrails, Leaderboards (+14 more)

### Community 145 - "Pond rework"
Cohesion: 0.18
Nodes (10): Baits, Client, Decisions, Done, Notes, Pond rework, Server, Species (+2 more)

### Community 146 - "initialize"
Cohesion: 0.20
Nodes (14): initialize(), aim(), drawFrame(), handleClick(), handlePointerDown(), handlePointerMove(), prefetchNearDoors(), renderFrame() (+6 more)

### Community 147 - "Orchestration contract — you plan, DSH workers execute"
Cohesion: 0.29
Nodes (6): Briefing a worker, Budget hygiene, graphify, Orchestration contract — you plan, DSH workers execute, The worker, When not to delegate

### Community 148 - "tables.ts"
Cohesion: 0.09
Nodes (39): BaitTray(), BaitTrayProps, RevealCardProps, PondCatch, CatchView, debugSpecies(), debugVariant(), GuestRoll (+31 more)

### Community 149 - "lib/presence.ts"
Cohesion: 0.09
Nodes (22): Entry, Connect, fetchTicket, HEARTBEAT_MS, HIDDEN_LIMIT_MS, RETRY_MS, sameLook(), samePose() (+14 more)

### Community 150 - "bug-reports.ts"
Cohesion: 0.24
Nodes (11): BugReport, BugReportDto, BugReportRejected, BugRow, CONTEXT_KEYS, EVERYONE, normalizeBugPage(), parseBugReport() (+3 more)

### Community 151 - "defaultStore"
Cohesion: 0.24
Nodes (15): fetchPondState(), PondStateView, PondTier, ensurePondStateStarted(), getPondStateSnapshot(), GUEST, listeners, LOADING (+7 more)

### Community 153 - "pond-boards.ts"
Cohesion: 0.13
Nodes (22): BOARDS, GET(), oneOf(), PER_VISITOR, PERIODS, compare(), DexRow, displayName() (+14 more)

### Community 154 - "epoch.ts"
Cohesion: 0.15
Nodes (21): GET(), intParam(), GET(), sketchPool, unavailable(), DoorsPage(), dynamic, hallPaintings() (+13 more)

### Community 155 - "hang-tag.ts"
Cohesion: 0.12
Nodes (8): CARD, createHangTag(), HangTag, HangTagStyle, HOLE, KNOT, What goes, and what replaces it, Refusal

### Community 156 - "outbox.test.ts"
Cohesion: 0.26
Nodes (13): ClaimRequest, OUTBOX_CAP, outboxAdd(), outboxDue(), OutboxEntry, outboxFail(), outboxRemove(), RETRY_BASE_MS (+5 more)

### Community 157 - "Walkthrough.tsx"
Cohesion: 0.22
Nodes (13): BACKDROP_STYLE, MoreArrow(), NavArrow(), Props, SLIDE, Walkthrough(), XIcon(), frameFor() (+5 more)

### Community 158 - "createPondRoom"
Cohesion: 0.32
Nodes (13): createPondRoom(), approach(), busy(), finishWalk(), goTo(), leave(), move(), nearest() (+5 more)

### Community 159 - "import-home-assets.mjs"
Cohesion: 0.14
Nodes (11): DOOR, DOOR_BACKDROP, drop, FURNITURE, manifest, manifestPath, masters, ORNATE_PAPER (+3 more)

### Community 160 - "createPlacementLayer"
Cohesion: 0.31
Nodes (8): aspectOf(), createPlacementLayer(), drawOutline(), dropGhosts(), dropHelper(), extrasFor(), silhouette(), sizeOf()

### Community 161 - "Atelier: the dressing mirror, and show-don't-tell keeping"
Cohesion: 0.13
Nodes (14): Atelier: the dressing mirror, and show-don't-tell keeping, Build order, Built (2026-11-20), Decisions (2026-11-19), Follow-ups (2026-11-20), Goal, In the room, Keeping (+6 more)

### Community 162 - "darknessAt"
Cohesion: 0.19
Nodes (7): CozyBackdrop, CEILING, darknessAt(), pool(), RoomLight, smooth(), dirty

### Community 163 - "AssetImage"
Cohesion: 0.22
Nodes (8): coin, CoinFound(), CoinFoundProps, AssetImage(), ImgProps, ScreenChrome(), SettingsMenu(), 9. Phases

### Community 164 - "bake-shopkeeper.mjs"
Cohesion: 0.25
Nodes (5): bodyTextures, COATS, { json, bin }, manifest, maps

### Community 165 - "Multiplayer ("other visitors") — plan v2 (Cloudflare)"
Cohesion: 0.10
Nodes (19): 0. Summary, 10. Decisions, 1. Product contract changes (approved 2026-10-31), 2. What already exists that this builds on, 3.1 Generated names (everyone has one), 3. Names, 4. Transport: Cloudflare Durable Objects, 5.1 Emotes (v1) (+11 more)

### Community 167 - "createCozyBackdrop"
Cohesion: 0.23
Nodes (13): alphaCanvas(), ceilingGeometry(), createCozyBackdrop(), clearGlows(), glow(), paintShade(), placeGlows(), placeSides() (+5 more)

### Community 168 - "gallery.ts"
Cohesion: 0.26
Nodes (11): deletePiece(), GalleryPiece, hangPiece(), MAX_STANDS, movePiece(), unhangPiece(), evaluatePublishBar(), publishArtist() (+3 more)

### Community 169 - "CrowdPreview.tsx"
Cohesion: 0.25
Nodes (9): CrowdPreviewPage(), CrowdPreview(), draw(), KINDS, Stats, Window, loadKind(), clearRigLayer() (+1 more)

### Community 170 - "backend.ts"
Cohesion: 0.15
Nodes (12): amplifyDir, backend, everyMinutes, mediaBucket, missing, repoRoot, REQUIRED, setting() (+4 more)

### Community 171 - "PondPanels.tsx"
Cohesion: 0.22
Nodes (9): PondIcon(), BOARD_TABS, PondOverlayKind, PondPanels(), signIn(), PondPanelsProps, SUBTITLES, TITLES (+1 more)

### Community 172 - "xdog.ts"
Cohesion: 0.27
Nodes (7): renderSketch(), blur(), kernel(), toGray(), XDOG_DEFAULTS, xdogInk(), XdogOptions

### Community 173 - "a/[slug]/page.tsx"
Cohesion: 0.31
Nodes (6): ArtistPage(), dynamic, generateMetadata(), GET(), FollowForm(), getArtistPage()

### Community 174 - "Local end-to-end stress test — 2026-11-06"
Cohesion: 0.22
Nodes (7): Environment and coverage, Follow-up coverage, Issue index, Local end-to-end stress test — 2026-11-06, Measured load, Passing checks and interpretation limits, Test data and cleanup

### Community 175 - "frame.ts"
Cohesion: 0.27
Nodes (8): decodedFrames, FrameShape, LANDSCAPE, PORTRAIT, preloadFrames(), shape(), preloadImage(), supportsAvif()

### Community 176 - "useSound"
Cohesion: 0.19
Nodes (18): ColorRecall(), ColorRecallProps, Phase, readBest(), ColorRound, showMs(), undoAdminUnlock(), unlockEverything() (+10 more)

### Community 177 - "visits.ts"
Cohesion: 0.10
Nodes (29): state(), amount(), duration(), dynamic, LANDMARKS, PAGES, RANGES, share() (+21 more)

### Community 179 - "Tasks"
Cohesion: 0.20
Nodes (8): Design for Phases 5–7 (2026-11-05), Follow-ups after Phases 4–7, Personal room polish (2026-11-05), Phase 3: one persistent stage, Phase 6: decorating mode, Phase 7: personal rooms, Stress-test fixes (2026-11-06), Tasks

### Community 180 - "performance/page.tsx"
Cohesion: 0.31
Nodes (8): dynamic, format(), grade(), METRICS, PAGES, PerformancePage(), RANGES, summarizeVitals()

### Community 181 - "formatInteger"
Cohesion: 0.50
Nodes (9): refreshWalletNow(), formatInteger(), setPondState(), claim(), BaitShop(), buy(), Exchange(), exchange() (+1 more)

### Community 182 - "schedule.test.ts"
Cohesion: 0.08
Nodes (23): RESIDENT_IDS, JOBS, NpcGround, NpcRoomInfo, PlaceKind, NpcFrame, ROOM_KINDS, ROOMS (+15 more)

### Community 183 - "Storyline (draft, saved 2026-11-17)"
Cohesion: 0.15
Nodes (12): Arc (soft, no fail state), Built so far, How it ties to what exists, Locked (2026-11-21, the owner), Next tasks (when picked up), Open questions, Premise, Revision (2026-11-21, the owner) (+4 more)

### Community 184 - "Low"
Cohesion: 0.09
Nodes (22): onClick(), 10. Long names run off the name sign, 11. The rooms API skips the stale-tab member check, 12. The bunny is dragged along while you pan in Decorate, 13. Pages that redirect or don't exist answer 200, 14. Error codes reveal which room slugs exist, 15. The name sign slides under the top-right buttons in Decorate, 16. Level-up celebrations can be farmed (+14 more)

### Community 185 - "bake-pond-path.mjs"
Cohesion: 0.14
Nodes (10): [, width, height], blank(), manifest, manifestPath, ORIGINAL_SOURCE, originalPath(), root, softened() (+2 more)

### Community 186 - "personal/room.ts"
Cohesion: 0.10
Nodes (24): AtelierArt, disposeAtelierArt(), GALLERY_DOOR, INSET_DOOR_Z, loadGalleryDoor(), loadGalleryPillar(), loadImage(), pending (+16 more)

### Community 187 - "themes.ts"
Cohesion: 0.07
Nodes (30): Catalogue, Data model (core), 1. Items placed against a zone edge fail to save, and the whole draft reverts, 2. One owned item can be placed many times, 3. Any save rejection throws away all unsaved work, 4. Changes made just before leaving are lost, 5. Fish trophies can be claimed without playing, High (+22 more)

### Community 189 - "Conn"
Cohesion: 0.31
Nodes (4): connectWebSocket(), SocketHandlers, Conn, message()

### Community 190 - "import-landing-assets.mjs"
Cohesion: 0.12
Nodes (10): socket(), target, CAT, drop, EXPECTED, manifest, manifestPath, masters (+2 more)

### Community 191 - "SyncStore"
Cohesion: 0.10
Nodes (22): ANON_PREFIX, anonKey(), deviceKey(), encodeStored(), isMemberSlotKey(), listKeys(), MEMBER_KEY, memberKey() (+14 more)

### Community 192 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, assets:models, assets:pond-path, assets:shopkeeper, build, dev, start, typecheck

### Community 193 - "Monets Lily Pond: exploration, UX and multiplayer QA"
Cohesion: 0.29
Nodes (6): Browser and interaction coverage, Changes made from the walkthrough, Monets Lily Pond: exploration, UX and multiplayer QA, Multiplayer and load, Practical limits, Regression checks and cleanup

### Community 194 - "createStage"
Cohesion: 0.52
Nodes (7): createNearby(), createStage(), closeEntry(), enter(), isCurrent(), isQuiet(), open()

### Community 195 - ".webSocketMessage"
Cohesion: 0.40
Nodes (4): attachmentOf(), roomFull(), Room, sendTo()

### Community 196 - "AccountSheet"
Cohesion: 0.29
Nodes (9): AccountSheet(), continueAnyway(), doSignOut(), runDelete(), runName(), submit(), submitDelete(), submitName() (+1 more)

### Community 197 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, db:schema, deploy:backend, dev, dev:presence, dev:web, dev:worker (+6 more)

### Community 198 - "useSoundEffects.ts"
Cohesion: 0.10
Nodes (28): SoundProvider(), BackgroundMusic, clampVolume(), isDocumentHidden(), Options, useBackgroundMusic(), VISIBILITY_EVENTS, EFFECTS (+20 more)

### Community 199 - "handlers.ts"
Cohesion: 0.10
Nodes (32): Phase 5: themes, zones and arrangements, confirmedFollowers(), sealEpoch(), handleDerivatives(), handleNotifyFollowers(), handleRenderDisplay(), handleSealEpoch(), renderPieceFrame() (+24 more)

### Community 200 - "createCharacter"
Cohesion: 0.38
Nodes (6): createCharacter(), contextLost(), loadFallbackWalk(), loseRig(), setFrame(), Angler()

### Community 201 - "ticket/route.ts"
Cohesion: 0.13
Nodes (25): GET(), PER_IP, POST(), presenceUrl(), Code, 3.2 Chosen names (members), chooseName(), exportMember() (+17 more)

### Community 202 - "rig.ts"
Cohesion: 0.12
Nodes (26): Layer, setCostumeVisibility(), follow(), canvasToModel(), createRenderer(), disposeRigLayer(), Frame, loadRig() (+18 more)

### Community 204 - "createRemoteVisitors"
Cohesion: 0.18
Nodes (14): writeHidden(), createRigLayer(), createPlayerCard(), hide(), onPointerDown(), createRemoteVisitors(), ensureLayer(), hideSprites() (+6 more)

### Community 205 - "nearby.ts"
Cohesion: 0.18
Nodes (5): Nearby, NearbyReach, RoomSpan, reach, strip

### Community 206 - "paintings/page.tsx"
Cohesion: 0.12
Nodes (21): dynamic, PaintingsPage(), createCodeAction(), deleteCodeAction(), CodeRow, CodesSection(), create(), remove() (+13 more)

### Community 207 - "catalog.ts"
Cohesion: 0.19
Nodes (17): confirmClean(), CatalogItem, CatalogKind, FREE_CHARACTERS, ITEMS, ItemSlot, expected, slots (+9 more)

### Community 208 - "earn"
Cohesion: 0.33
Nodes (9): earn(), emit(), emitEarned(), maybeInvite(), writeSession(), tap(), tap(), tap() (+1 more)

### Community 209 - "app/layout.tsx"
Cohesion: 0.13
Nodes (16): bethEllen, inspiratiq, metadata, notoSans, RootLayout(), sniglet, viewport, ServiceWorker() (+8 more)

### Community 210 - "lib/slots/index.ts"
Cohesion: 0.06
Nodes (30): PresencePreviewPage(), AccountHost(), AccountSheet, NAME_ERRORS, Pending, View, KeepOnOtherDevices(), AccountMode (+22 more)

### Community 212 - "messages.ts"
Cohesion: 0.43
Nodes (5): checkMessage(), INVISIBLE, MESSAGE_MAX, MessageCheck, normalizeMessage()

### Community 213 - "plan.ts"
Cohesion: 0.31
Nodes (6): PlaceInfo, planGame(), ROUND_SPREAD, createReveal(), compose(), shuffle()

### Community 214 - "Open rooms and the tip jar (design, 2026-11-21)"
Cohesion: 0.29
Nodes (6): Built (2026-11-21), Decisions, Numbers (first pass, to tune), Open questions, Open rooms and the tip jar (design, 2026-11-21), Story hooks

### Community 215 - "BountyPanel.tsx"
Cohesion: 0.20
Nodes (13): GLYPHS, PearlIcon(), POND_CRIMSON, PondIconName, fetchPondBounties(), memberId(), PondBounties, nextUtcMidnight() (+5 more)

### Community 216 - "npc-sheet.cjs"
Cohesion: 0.31
Nodes (8): CFG, closeEye(), eraseMouth(), inpaint(), sample(), sharp, [src, out, cfgPath], warp()

### Community 218 - "master"
Cohesion: 0.28
Nodes (9): closedWaist(), goldOutfits(), image(), master(), placed(), rig(), slimGlb(), write() (+1 more)

### Community 221 - "flick.ts"
Cohesion: 0.53
Nodes (4): FLICK, flickDirection(), isUpwardFlick(), handlePointerUp()

### Community 226 - "Rooms"
Cohesion: 0.50
Nodes (3): Decisions (2026-11-05), Rooms, Themes and arrangements (decided 2026-11-05)

### Community 227 - "Other visitors"
Cohesion: 0.29
Nodes (6): How it plays, Other visitors, Privacy, Running it in production, Running it locally, Staying consistent

### Community 228 - "paintedCostume"
Cohesion: 0.33
Nodes (5): paintedCostume(), floralOutfits(), turned(), Fitting clothes to other characters, Headpieces

## Knowledge Gaps
- **5 isolated node(s):** `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1651 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **29 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `AtelierKeeps.tsx`, `queryOne`, `SketchGuess.tsx`, `DoorEditor.tsx`, `app/page.tsx`, `ReadScreen.tsx`, `npc-layer.ts`, `GuestBoard.tsx`, `Museum.tsx`, `bug-report.ts`, `Test Fakes and Helpers`, `LeaderboardPanel.tsx`, `logic.ts`, `room-events.ts`, `PersonalRoom.tsx`, `tables.ts`, `defaultStore`, `pond-api.ts`, `Walkthrough.tsx`, `Web Package Dependencies`, `risk.ts`, `AssetImage`, `CrowdPreview.tsx`, `PondPanels.tsx`, `a/[slug]/page.tsx`, `useSound`, `useEscapeKey`, `LandingFx`, `Water.tsx`, `visits.ts`, `atelier.ts`, `pond-format.ts`, `RigPreview.tsx`, `domain/guestboard.ts`, `useSoundEffects.ts`, `paintings/page.tsx`, `app/layout.tsx`, `lib/slots/index.ts`, `BountyPanel.tsx`, `ClosetView.tsx`, `hall/room.ts`, `FishingView.tsx`, `FishingView.tsx`, `features/economy/index.ts`, `PondRoom.tsx`?**
  _High betweenness centrality (0.091) - this node is a cross-community bridge._
- **What connects `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json` to the rest of the system?**
  _5 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `AtelierKeeps.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12310606060606061 - nodes in this community are weakly interconnected._
- **Why does `three` connect `stage.ts` to `scene/assets.ts`, `npc-layer.ts`, `scene.ts`, `cozy.ts`, `room-events.ts`, `hang-tag.ts`, `ambience.ts`, `Web Package Dependencies`, `remote-visitors.ts`, `stage.ts`, `atelier.ts`, `pond/art.ts`, `personal/room.ts`, `RigPreview.tsx`, `scene/ambience.ts`, `rig.ts`, `stone-path-bake.ts`, `pond/room.ts`, `paintedCostume`, `hall/room.ts`, `remote-visitors.ts`?**
  _High betweenness centrality (0.063) - this node is a cross-community bridge._
- **Should `locations.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12944523470839261 - nodes in this community are weakly interconnected._
- **Why does `defaultStore()` connect `lib/slots/index.ts` to `SyncStore`, `createStage`, `react`, `hall/room.ts`, `economy/store.ts`, `stage.ts`, `FishingView.tsx`, `room-events.ts`, `useSound`, `initialize`, `PersonalRoom.tsx`, `BountyPanel.tsx`, `defaultStore`, `pond-api.ts`, `createPondRoom`, `pond/room.ts`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Should `SketchGuess.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08637873754152824 - nodes in this community are weakly interconnected._