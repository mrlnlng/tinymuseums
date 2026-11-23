# Graph Report - tiny-museum  (2026-11-22)

## Corpus Check
- 565 files · ~346,009 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 106 file(s) not represented in the graph (top: .avif 56, .glb 38, .css 7)

## Summary
- 5067 nodes · 13095 edges · 219 communities (184 shown, 35 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 257 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b113344d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- AtelierKeeps.tsx
- Walker
- SketchGuess.tsx
- src/rooms/doors.ts
- builtUrl
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
- DecorDrawer.tsx
- room-events.ts
- schedule.ts
- ref_node_assert
- amplify/package.json
- PersonalRoom.tsx
- prepare-models.mjs
- Traversal
- core/package.json
- media/storage.ts
- DecorController
- react
- pond-api.ts
- ambience.ts
- core/src/index.ts
- Web Package Dependencies
- Gamifying Tiny Museum — genre direction & engagement research
- PersonalRoom.tsx
- remote-visitors.ts
- risk.ts
- amplify/tsconfig.json
- 5. Customization menu — what other people are doing
- paintings/page.tsx
- queryOne
- Web TSConfig
- Root Package Manifest
- hitForVisitor
- PerfMeter
- import-fishing-assets.mjs
- Base TSConfig
- Amplify Build Spec
- sketchguess/lib/api.ts
- actions.ts
- handlers.ts
- BunnyArtist.tsx
- Water.tsx
- Worker Package Manifest
- Public Asset Manifest
- createPersonalRoom
- atelier.ts
- compose-atelier.mjs
- AssetImage
- pond-format.ts
- pond/art.ts
- economy/store.ts
- bug-reports.ts
- room.ts
- minimap.ts
- wander.test.ts
- domain/guestboard.ts
- Sound Effect Assets
- art-cache.ts
- Custom HTTP Headers
- Sharp Layer Package
- stage.ts
- scene/ambience.ts
- Confirmed issues
- AtelierKeeps.tsx
- session.ts
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
- wardrobe.ts
- FishingView.tsx
- AtelierRoom
- npc-layer.ts
- Placement
- json
- graftCostume
- pondgame/lib/api.ts
- worker/tsconfig.json
- core/tsconfig.json
- wallet/body.ts
- How to Design for Failures — ByteByteGo Newsletter
- Worker instructions — DSH headless agents
- Backend
- protocol.ts
- Costume gallery doorway
- outbox.test.ts
- Fishing forest: painted asset pass
- audio/README.md
- .claude/CLAUDE.md
- The Costume Atelier
- revealFloorTransition
- rig.ts
- hit.ts
- studio/page.tsx
- presence/tsconfig.json
- wallet.ts
- tsconfig.test.json
- app/layout.tsx
- dependencies
- peers.ts
- run.ts
- walk
- npc-layer.ts
- exports
- room-places.ts
- bug-report.ts
- createHallRoom
- LeaderboardPanel.tsx
- env.ts
- The Moonlit Pond — design
- Pond rework
- createStage
- Orchestration contract — you plan, DSH workers execute
- tables.ts
- lib/presence.ts
- HallArranger.tsx
- pond-state.ts
- SlotDef
- createMinimap
- epoch.ts
- hang-tag.ts
- FilesystemStorage
- Walkthrough.tsx
- createPondRoom
- wardrobe.test.ts
- createPlacementLayer
- Atelier: the dressing mirror, and show-don't-tell keeping
- tab-turn.ts
- painting-open
- npc-sheet.cjs
- Multiplayer ("other visitors") — plan v2 (Cloudflare)
- Lobby
- assetUrl
- DoorRef
- icon-basket
- LandingFx
- 4. Transport: Cloudflare Durable Objects
- Pedestal
- bunny-left
- Local end-to-end stress test — 2026-11-06
- bunny-right
- ColorRecall.tsx
- visits.ts
- icon-home
- reveal.ts
- createStage
- ticket
- schedule.test.ts
- Storyline (draft, saved 2026-11-17)
- Low
- bake-pond-path.mjs
- a/[slug]/page.tsx
- themes.ts
- draw.py
- themes.ts
- Medium
- slots/store.ts
- BountyPanel.tsx
- Monets Lily Pond: exploration, UX and multiplayer QA
- bugs/page.tsx
- Personal room: stress-test issues
- ArtCache
- PondCallbacks
- useSoundEffects.ts
- domain/sketch.ts
- Item
- messages.ts
- confirm/page.tsx
- npcs/README.md
- Minimap
- nearby.ts
- catalog.ts
- master
- AccountSheet.tsx
- GuestBoard.tsx
- master
- player-card.ts
- Wardrobe
- Cafe
- TreeSparkles
- doors.sql
- Notes
- HelmShare

## God Nodes (most connected - your core abstractions)
1. `react` - 82 edges
2. `json()` - 72 edges
3. `query()` - 71 edges
4. `PersonalRoom()` - 67 edges
5. `hit()` - 58 edges
6. `limited()` - 52 edges
7. `three` - 49 edges
8. `next` - 47 edges
9. `Traversal` - 46 edges
10. `createHallRoom()` - 43 edges

## Surprising Connections (you probably didn't know these)
- `1. What is in this bundle` --references--> `walk()`  [INFERRED]
  docs/bunny-rig-author-handoff.md → apps/web/src/features/landing/cat.ts
- `3. The rig` --references--> `walk()`  [INFERRED]
  docs/bunny-rig-author-handoff.md → apps/web/src/features/landing/cat.ts
- `Rendering and movement` --references--> `walk()`  [INFERRED]
  docs/bunny-rig-integration.md → apps/web/src/features/landing/cat.ts
- `5.1 Emotes (v1)` --references--> `ScreenChrome()`  [INFERRED]
  docs/multiplayer-plan.md → apps/web/src/shared/components/ScreenChrome.tsx
- `E2E-009 — Room mutations ignore stale account identity` --references--> `memberFromRequest()`  [INFERRED]
  docs/testing/local-e2e-stress-2026-11-06.md → apps/web/src/shared/lib/member-route.ts

## Import Cycles
- None detected.

## Communities (219 total, 35 thin omitted)

### Community 0 - "AtelierKeeps.tsx"
Cohesion: 0.10
Nodes (29): CoinToast(), Toast, Purse(), Stamp(), WalletProvider(), serverSnapshot, useEarnEvents(), useWallet() (+21 more)

### Community 1 - "Walker"
Cohesion: 0.19
Nodes (3): FloorPoint, WalkArea, Walker

### Community 2 - "SketchGuess.tsx"
Cohesion: 0.09
Nodes (37): bestKeyFor(), BURST, clueUrl(), openingPlan(), Phase, pickAtRandom(), PreparedGame, prepareSketchGame() (+29 more)

### Community 3 - "src/rooms/doors.ts"
Cohesion: 0.07
Nodes (54): DoorsPage(), dynamic, doorArtUrl(), loadDoorArt(), loadRoomDoorArt(), pending, saveDoorsAction(), DoorEditor() (+46 more)

### Community 4 - "builtUrl"
Cohesion: 0.15
Nodes (18): Loading(), dynamic, Hall(), MuseumPage(), [BRAND_OWNER, ...BRAND_REST], CurrentlyShowing(), Decor(), dynamic (+10 more)

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
Cohesion: 0.05
Nodes (61): MIRROR_SRC, Props, AssetManifest, assetUrl(), bitmapTexture(), blankImage(), CAFE_CAT_FRAMES, CompressedLoader (+53 more)

### Community 9 - "SyncStore"
Cohesion: 0.13
Nodes (9): encodeStored(), parseStored(), readStored(), writeStored(), deepEq(), SlotState, SyncStore, SlotDef (+1 more)

### Community 10 - "machine.ts"
Cohesion: 0.10
Nodes (48): CAST_ERRORS, coarsePointer(), FishingView(), initialEasyReel(), isTyping(), LOST, Toast, vibrate() (+40 more)

### Community 11 - "Museum.tsx"
Cohesion: 0.14
Nodes (23): coin, CoinFoundProps, CoinFound, ColorRecall, GameDesktop, GuestBoard, HallArranger, HelpGuide (+15 more)

### Community 12 - "Test Fakes and Helpers"
Cohesion: 0.09
Nodes (30): boundedCameraX(), deferredFetch(), deviceSlot, FakeEvents, FakeStorage, fixture, fixtureB, fixtureRegistry (+22 more)

### Community 13 - "scene.ts"
Cohesion: 0.04
Nodes (35): disposeDisplayTexture(), prefersAvif(), HiddenCoin, cafeAfterIndex(), computeLayout(), clear(), placeCafe(), cutRooms() (+27 more)

### Community 14 - "cozy.ts"
Cohesion: 0.07
Nodes (47): alphaCanvas(), ATELIER_PROPS, AtelierImage, atticWindowCanvas(), bareBulbCanvas(), boardsCanvas(), canvasTexture(), ceilingTexture() (+39 more)

### Community 15 - "DecorDrawer.tsx"
Cohesion: 0.13
Nodes (18): DecorDrawer, DecorDrawerProps, SLOT_LABELS, Tab, TABS, categoryOf(), DrawerCategory, FINISH_SLOTS (+10 more)

### Community 16 - "room-events.ts"
Cohesion: 0.18
Nodes (27): ChatButton(), REFUSED, joinRoom(), STANDING, announceNameChange(), emit(), getPeople(), isInRoom() (+19 more)

### Community 17 - "schedule.ts"
Cohesion: 0.07
Nodes (55): addDwellEmotes(), addEmote(), addGap(), addStand(), addWalk(), along(), buildRoomTable(), buildStayPlan() (+47 more)

### Community 18 - "ref_node_assert"
Cohesion: 0.11
Nodes (32): mergeSlot(), defineSlot(), docBytes(), slotDef(), SLOTS, byAtThenKey(), encoded(), latest (+24 more)

### Community 19 - "amplify/package.json"
Cohesion: 0.08
Nodes (26): amplifyDir, backend, everyMinutes, mediaBucket, missing, repoRoot, REQUIRED, setting() (+18 more)

### Community 20 - "PersonalRoom.tsx"
Cohesion: 0.08
Nodes (57): errorReason(), overDrawer(), PersonalRoom(), canPlaceNew(), carriedTo(), carryEnd(), carryMove(), finishJob() (+49 more)

### Community 21 - "prepare-models.mjs"
Cohesion: 0.07
Nodes (29): alongArm(), ARMS, armTurn(), BODIES, bruce, BRUCE_FIT, BRUCE_PLACE, BRUCE_SLEEVES (+21 more)

### Community 22 - "Traversal"
Cohesion: 0.08
Nodes (12): centerYFor(), JumpPose, clamp(), fixture(), jump(), Traversal, createDecorController(), canvasRect() (+4 more)

### Community 23 - "core/package.json"
Cohesion: 0.16
Nodes (13): devDependencies, @types/bcryptjs@^2.4.6, @types/pg@^8.11.10, main, name, private, scripts, typecheck (+5 more)

### Community 24 - "media/storage.ts"
Cohesion: 0.11
Nodes (17): CONTENT_TYPES, GET(), PUT(), ACCEPTED, createAssetFromUpload(), MAX_UPLOAD_BYTES, presignUpload(), registerUpload() (+9 more)

### Community 25 - "DecorController"
Cohesion: 0.06
Nodes (12): PersonalArt, DecorController, DOOR_SIGN, gloomFor(), lightOf(), NAME_SIGN, OPEN_SIGN, PersonalRoomOptions (+4 more)

### Community 26 - "react"
Cohesion: 0.10
Nodes (23): openAccount(), openAccountCreation(), openBugReport(), fitWidth(), HelpGuide(), HelpGuideProps, POINTER_STEPS, TOUCH_STEPS (+15 more)

### Community 27 - "pond-api.ts"
Cohesion: 0.20
Nodes (18): buyPondBait(), claimPondBounty(), errorOf(), exchangePondPearls(), fetchPondLeaderboard(), isRecord(), isStateView(), mutationHeaders() (+10 more)

### Community 28 - "ambience.ts"
Cohesion: 0.12
Nodes (29): blade(), bloom(), BLOOMS, createPondAmbience(), update(), fishTexture(), frond(), FRONT_ROWS (+21 more)

### Community 29 - "core/src/index.ts"
Cohesion: 0.04
Nodes (140): CatchExtra, COLUMNS, insertCatch(), member(), namedMember(), randomId(), StatePatch, hangPiece() (+132 more)

### Community 30 - "Web Package Dependencies"
Cohesion: 0.07
Nodes (35): dependencies, embla-carousel-react@^8.6.0, motion@^13.1.1, next@^15.0.3, react@^19.0.0, react-dom@^19.0.0, swr@^2.5.1, three@^0.169.0 (+27 more)

### Community 31 - "Gamifying Tiny Museum — genre direction & engagement research"
Cohesion: 0.10
Nodes (19): 0.1 The core experience, 0.2 Systems that make gamification cheap to build, 0.3 Constraints that shape any recommendation, 0. What the game is today (the deep dive), 1.1 The landscape (seven candidates, with verdicts), 1.2 Recommendation: a **cozy gallery life-sim** — "the gallery you live in", 1.3 The five design pillars the genre implies, 1. Genre direction (+11 more)

### Community 32 - "PersonalRoom.tsx"
Cohesion: 0.07
Nodes (38): config, SECURITY_HEADERS, MuseumLayout(), metadata, PondPage(), Job, Offer, Puff (+30 more)

### Community 33 - "remote-visitors.ts"
Cohesion: 0.06
Nodes (58): Assets, Scenery, CUTS, disposeBoards(), Mark, plane(), ROPE_CUTS, ropeSlices() (+50 more)

### Community 34 - "risk.ts"
Cohesion: 0.13
Nodes (30): Hud(), HudProps, HudWagerChip, WagerPicker(), chooseTier(), WagerPickerProps, chainChipLabel(), clampWagerStake() (+22 more)

### Community 35 - "amplify/tsconfig.json"
Cohesion: 0.20
Nodes (9): compilerOptions, module, moduleResolution, noUnusedLocals, noUnusedParameters, exclude, extends, include (+1 more)

### Community 36 - "5. Customization menu — what other people are doing"
Cohesion: 0.12
Nodes (16): 1. The target: what "Claude Opus 5.5" actually means, 2. Where your harness stands today (live config I read), 3. The honest gap model, 4. Quality levers, ranked by leverage, 5. Customization menu — what other people are doing, 6. Recommended starting kit for *your* profile, 7. What I can apply for you right now (needs your go-ahead), A. Prompt & persona (most common quality customizations) (+8 more)

### Community 37 - "paintings/page.tsx"
Cohesion: 0.12
Nodes (21): dynamic, PaintingsPage(), createCodeAction(), deleteCodeAction(), CodeRow, CodesSection(), create(), remove() (+13 more)

### Community 38 - "queryOne"
Cohesion: 0.15
Nodes (17): GET(), AnalyticsSummary, confirmedFollowers(), createInquiry(), follow(), recordEvent(), ResolvedToken, resolveQrToken() (+9 more)

### Community 39 - "Web TSConfig"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 40 - "Root Package Manifest"
Cohesion: 0.06
Nodes (36): [, width, height], description, devDependencies, concurrently@^9.1.0, esbuild@^0.24.0, ktx2-encoder@^0.6.0, maxrects-packer@^2.7.3, playwright@^1.63.0 (+28 more)

### Community 41 - "hitForVisitor"
Cohesion: 0.12
Nodes (28): POST(), ALLOWED, PER_VISITOR, POST(), POST(), POST(), POST(), GET() (+20 more)

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
Cohesion: 0.30
Nodes (10): sameOriginUrl(), decodeImage(), fetchBitmap(), fetchRound(), guarded(), loadInk(), loadRound(), warmImage() (+2 more)

### Community 47 - "actions.ts"
Cohesion: 0.12
Nodes (39): back(), deleteGuestNoteAction(), deletePieceAction(), discardDoorsAction(), discardLocationAction(), isThrottled(), nudgeInRowAction(), PLACE_ERRORS (+31 more)

### Community 48 - "handlers.ts"
Cohesion: 0.10
Nodes (27): sealEpoch(), handleDerivatives(), handleRenderDisplay(), handleSealEpoch(), renderPieceFrame(), renderPieceSketch(), Job, FRAME_FORMAT (+19 more)

### Community 49 - "BunnyArtist.tsx"
Cohesion: 0.17
Nodes (10): 1. What is in this bundle, 3. The rig, 5. Blender-side work still to do (needs Blender; the author has it with an MCP bridge), 6. Open questions for the author, Handoff: move the Tiny Museum bunny from sprite frames to a rig, Approved v4 bunny in the hall, Assets, Existing interactions and fallback (+2 more)

### Community 50 - "Water.tsx"
Cohesion: 0.07
Nodes (38): AmbientShadow, box(), BUCKET, bunnyBox(), easeOut(), Glint, LEFT_STYLE, lineColour() (+30 more)

### Community 51 - "Worker Package Manifest"
Cohesion: 0.14
Nodes (14): dependencies, @tiny/core@*, exports, ./lambda, @tiny/core, main, name, private (+6 more)

### Community 52 - "Public Asset Manifest"
Cohesion: 0.12
Nodes (15): artworks, bunny, size, floor, size, fonts, icon-no-photos, size (+7 more)

### Community 53 - "createPersonalRoom"
Cohesion: 0.09
Nodes (23): createPersonalRoom(), light(), shade(), showArrangement(), signFilter(), ceilingGeometry(), CozyBackdrop, createCozyBackdrop() (+15 more)

### Community 54 - "atelier.ts"
Cohesion: 0.05
Nodes (40): AtelierArt, AtelierDoor, AtelierImage, BuiltRoom, Cardigan, CARDIGAN_NAMES, Control, disposeAtelierArt() (+32 more)

### Community 55 - "compose-atelier.mjs"
Cohesion: 0.12
Nodes (10): body, dressLayer, dressWidth, floralWidth, hanger, MANNEQUIN_CANVAS, mask, root (+2 more)

### Community 56 - "AssetImage"
Cohesion: 0.14
Nodes (18): BoardScreen(), BoardScreenProps, PinnedNotes(), PinnedNotesProps, ReadScreenProps, messageLength(), StickyNote(), NOTE_PLACES (+10 more)

### Community 57 - "pond-format.ts"
Cohesion: 0.12
Nodes (28): fetchPondDex(), memberId(), PondDex, EXCHANGE_DAILY_STAMPS, EXCHANGE_PEARLS_PER_STAMP, FISH_ART, fishArt(), formatPercent() (+20 more)

### Community 58 - "pond/art.ts"
Cohesion: 0.23
Nodes (14): ArtByRoom, colorAt(), decoded(), disposePondArt(), EDGE_BAND, EDGE_BANDS, EDGE_OVERLAP, edgeTexture() (+6 more)

### Community 59 - "economy/store.ts"
Cohesion: 0.12
Nodes (37): CARRY_CAP, carryAdd(), CarryEntry, carryPrune(), carryRemove(), chunk(), tzOffsetNow(), outboxDue() (+29 more)

### Community 60 - "bug-reports.ts"
Cohesion: 0.13
Nodes (18): allowedOrigin(), isSameOriginMutation(), LOOPBACK, BugReport, BugReportDto, BugReportRateLimited, BugReportRejected, BugRow (+10 more)

### Community 61 - "room.ts"
Cohesion: 0.12
Nodes (32): attachmentOf(), admitted(), Attachment, farewell(), GHOST_MS, HELLO_TIMEOUT_MS, holdsOf(), homeOf() (+24 more)

### Community 62 - "minimap.ts"
Cohesion: 0.09
Nodes (25): follow(), doorPoint(), FALLBACK_TINT, FloorSketch, ICONS, MAP_PLACES, MAP_SCALE, MapPlace (+17 more)

### Community 63 - "wander.test.ts"
Cohesion: 0.12
Nodes (17): FloorSpot, Job, Place, Phase, ResidentState, Run, WalkPath, WalkState (+9 more)

### Community 64 - "domain/guestboard.ts"
Cohesion: 0.12
Nodes (23): GET(), ComposeScreenProps, StickyNoteProps, NoteDraft, useKeyboardLift(), decodeCursor(), encodeCursor(), enforceLimits() (+15 more)

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

### Community 69 - "stage.ts"
Cohesion: 0.03
Nodes (51): coverFloorTransition(), CharacterSprites, CameraRig, Carried, Character, Matcha, Viewport, createPixelRatioGovernor() (+43 more)

### Community 70 - "scene/ambience.ts"
Cohesion: 0.13
Nodes (13): BULBS, createHallAmbience(), finish(), glowTexture(), HallAmbience, mulberry(), painted(), vignetteTexture() (+5 more)

### Community 71 - "Confirmed issues"
Cohesion: 0.12
Nodes (17): Confirmed issues, E2E-002 — Valid edge placement rejected through floating-point precision, E2E-003 — One owned prop can be placed multiple times, E2E-004 — Reload before autosave silently loses the latest placement, E2E-005 — Failed save and failed Done have no visible mobile explanation, E2E-006 — Restoring connectivity does not retry a failed draft save, E2E-007 — Keyboard activation cannot place drawer items, E2E-008 — Creating an account from My Room leaves the signed-in user on the sign-in prompt (+9 more)

### Community 72 - "AtelierKeeps.tsx"
Cohesion: 0.28
Nodes (12): AtelierKeeps(), flash(), keep(), onKey(), press(), release(), labelOf(), nameOf() (+4 more)

### Community 73 - "session.ts"
Cohesion: 0.11
Nodes (26): GET(), PaintingRow, GET(), POST(), UPLOADS_PER_ARTIST, POST(), UPLOADS_PER_ARTIST, dynamic (+18 more)

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
Cohesion: 0.17
Nodes (14): createPresence(), drop(), heartbeat(), maybeSend(), onPageHide(), receive(), scheduleRetry(), send() (+6 more)

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
Cohesion: 0.09
Nodes (35): aspectOf(), AtelierActions, createAtelierRoom(), buildCollection(), form(), hang(), buildEntrance(), buildMirror() (+27 more)

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
Cohesion: 0.03
Nodes (46): socket(), bodyTextures, COATS, { json, bin }, manifest, maps, target, BASEBOARD (+38 more)

### Community 93 - "infra/jobs.ts"
Cohesion: 0.24
Nodes (16): loop(), shutdown(), sleep(), sweepStale(), DrainResult, handler(), repairFrames(), repairUnframed() (+8 more)

### Community 94 - "ClosetView.tsx"
Cohesion: 0.10
Nodes (26): ClosetView(), onKeyDown(), LISTS, PLACE, PODIUM_SRC, Props, Slot, SPOTLIGHT_SRC (+18 more)

### Community 95 - "pond/room.ts"
Cohesion: 0.10
Nodes (26): FrameShape, FAR_LIFT, FAR_SCALE, liftAt(), pathHalfWidth(), pathX(), PondPath, scaleAt() (+18 more)

### Community 96 - "members.ts"
Cohesion: 0.07
Nodes (56): GET(), PER_MEMBER, PUT(), PER_IP, POST(), presenceUrl(), Code, How it plays (+48 more)

### Community 104 - "wardrobe.ts"
Cohesion: 0.11
Nodes (33): AtelierPage(), dynamic, metadata, allowedCharacter(), OwnedSnapshot, owns(), walletReady(), Atelier() (+25 more)

### Community 105 - "FishingView.tsx"
Cohesion: 0.11
Nodes (17): CONFETTI_COLORS, ConfettiPiece, makeConfetti(), RevealCard(), RevealCardProps, TIER_MS, TIER_SFX, useCountUp() (+9 more)

### Community 107 - "npc-layer.ts"
Cohesion: 0.15
Nodes (18): BY_ID, CAST, FRAME, IDLE, idleCel(), NPC_WALK_SPEED, NpcCharacter, WANDERER_IDS (+10 more)

### Community 108 - "Placement"
Cohesion: 0.06
Nodes (17): Carry, PersonalRoomProps, HallRoomData, GhostOptions, PlacementLayer, PlacementTheme, Admin mode (gamma), Decisions (2026-11-17, with the user) (+9 more)

### Community 109 - "json"
Cohesion: 0.07
Nodes (80): POST(), POST(), GET(), GLOBAL, PER_IP, POST(), POST(), GLOBAL (+72 more)

### Community 110 - "graftCostume"
Cohesion: 0.27
Nodes (14): canvasFit(), compose(), graftCostume(), copyAccessor(), copyMaterial(), copyMesh(), copyTexture(), copyView() (+6 more)

### Community 111 - "pondgame/lib/api.ts"
Cohesion: 0.17
Nodes (22): PondGameProps, PondGame(), buyPondBait(), CastOptions, castPond(), chainPondBait(), errorOf(), fetchPondState() (+14 more)

### Community 112 - "worker/tsconfig.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 113 - "core/tsconfig.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 114 - "wallet/body.ts"
Cohesion: 0.36
Nodes (9): baitIdOf(), integerOffset(), isRecord(), itemIdOf(), MAX_CLAIM_BATCH, ParsedWalletClaim, parseWalletClaim(), routeBanned() (+1 more)

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
Cohesion: 0.10
Nodes (34): fetch(), Env, isCatalogItem(), isHome(), isItem(), isName(), isPid(), isSeq() (+26 more)

### Community 119 - "Costume gallery doorway"
Cohesion: 0.50
Nodes (3): Costume gallery doorway, Curtain colour edit, Prompt

### Community 120 - "outbox.test.ts"
Cohesion: 0.29
Nodes (11): ClaimRequest, OUTBOX_CAP, outboxAdd(), OutboxEntry, outboxFail(), outboxRemove(), RETRY_BASE_MS, RETRY_MAX_MS (+3 more)

### Community 121 - "Fishing forest: painted asset pass"
Cohesion: 0.10
Nodes (18): Assets, Bruce's collection refresh (2026-11-08), Fishing forest illustrations, Made by hand (not touched by the script), Main hall v2 (2026-11-10), Monets Lily Pond (2026-11-08), 1. Forest doorway, 2. Woodland noticeboard (+10 more)

### Community 124 - "The Costume Atelier"
Cohesion: 0.13
Nodes (14): Adding a character, Adding a costume, Art not supplied as files, Bruce's Chronicles, Checked against the mocks (2026-11-07), Costume fit review, Fitting clothes to other characters, Floral collection (+6 more)

### Community 125 - "revealFloorTransition"
Cohesion: 0.17
Nodes (12): Loading(), Loading(), AtelierLoading(), loadGameDesktop(), revealFloorTransition(), GameDesktop(), GameDesktopProps, Minigame (+4 more)

### Community 126 - "rig.ts"
Cohesion: 0.03
Nodes (96): CrowdPreviewPage(), RigPreviewPage(), getWalletSnapshot(), CrowdPreview(), draw(), KINDS, Stats, Window (+88 more)

### Community 127 - "hit.ts"
Cohesion: 0.17
Nodes (12): CoinWall, createHiddenCoin(), Spot, AlphaMap, alphaMapFor(), alphaMaps, buildAlphaMap(), isPaintedAt() (+4 more)

### Community 128 - "studio/page.tsx"
Cohesion: 0.13
Nodes (22): AnalyticsPage(), dynamic, dateFormat, dynamic, GuestBoardPage(), dynamic, HangPage(), dynamic (+14 more)

### Community 129 - "presence/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, types, exclude, extends, include, ../../tsconfig.base.json

### Community 130 - "wallet.ts"
Cohesion: 0.07
Nodes (46): grantPearls(), member(), now, piece(), randomId(), today, baitOf(), applyClaim() (+38 more)

### Community 131 - "tsconfig.test.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 132 - "app/layout.tsx"
Cohesion: 0.08
Nodes (29): bethEllen, inspiratiq, metadata, notoSans, RootLayout(), sniglet, viewport, AccountHost() (+21 more)

### Community 133 - "dependencies"
Cohesion: 0.15
Nodes (13): dependencies, @aws-sdk/client-s3@^3.1121.0, @aws-sdk/s3-request-presigner@^3.1121.0, bcryptjs@^2.4.3, obscenity@^0.4.6, sharp@^0.33.5, thumbhash@^0.1.1, sharp (+5 more)

### Community 134 - "peers.ts"
Cohesion: 0.12
Nodes (10): Entry, INTERPOLATION_DELAY_MS, PEER_TIMEOUT_MS, PeerTable, positionAt(), Sample, look, Self (+2 more)

### Community 135 - "run.ts"
Cohesion: 0.17
Nodes (9): admin, childEnv, client, database, fresh, migrations, target, pg@^8.13.1 (+1 more)

### Community 136 - "walk"
Cohesion: 0.33
Nodes (8): between(), CAT, Edge, EDGES, runLandingCat(), choosePeeker(), peek(), walk()

### Community 137 - "npc-layer.ts"
Cohesion: 0.18
Nodes (21): castMember(), createNpcLayer(), createResidentView(), createView(), departedRecently(), draw(), fadeOut(), glyphWidth() (+13 more)

### Community 138 - "exports"
Cohesion: 0.15
Nodes (13): exports, ./brand, ./bugs, ./economy, ./guestboard, ./presence, ./presence/messages, ./presence/wire (+5 more)

### Community 139 - "room-places.ts"
Cohesion: 0.14
Nodes (25): atelierRoomInfo(), atelierX(), copy(), FurniturePlacement, hallCache, hallRoomInfo(), onGround(), PERSONAL_FURNITURE (+17 more)

### Community 140 - "bug-report.ts"
Cohesion: 0.20
Nodes (15): BugReportHost(), BugReportSheet, BugReportSheet(), send(), Status, collectContext(), inAppBrowser(), onOpenBugReport() (+7 more)

### Community 141 - "createHallRoom"
Cohesion: 0.09
Nodes (21): CafeLink, GuestBoardNotes, Placards, toScreen(), writeStyle(), createSitting(), createHallRoom(), buildRoom() (+13 more)

### Community 142 - "LeaderboardPanel.tsx"
Cohesion: 0.29
Nodes (12): formatCountdown(), formatOdds(), nextMondayUtc(), useCountdown(), useNow(), BoardRow(), BOARDS, LeaderboardPanel() (+4 more)

### Community 143 - "env.ts"
Cohesion: 0.21
Nodes (9): getPool(), poolConfig(), sslFor(), isProduction(), presenceSecret(), required(), sessionSecret(), setting() (+1 more)

### Community 144 - "The Moonlit Pond — design"
Cohesion: 0.09
Nodes (22): Art the pond needs from the artist, Build contract (decided 2026-11-07), Build phases, Collection and goals, Done, Done, Guardrails, Leaderboards (+14 more)

### Community 145 - "Pond rework"
Cohesion: 0.18
Nodes (10): Baits, Client, Decisions, Done, Notes, Pond rework, Server, Species (+2 more)

### Community 146 - "createStage"
Cohesion: 0.26
Nodes (12): initialize(), aim(), drawFrame(), handleClick(), handlePointerDown(), handlePointerMove(), renderFrame(), showCharacter() (+4 more)

### Community 147 - "Orchestration contract — you plan, DSH workers execute"
Cohesion: 0.29
Nodes (6): Briefing a worker, Budget hygiene, graphify, Orchestration contract — you plan, DSH workers execute, The worker, When not to delegate

### Community 148 - "tables.ts"
Cohesion: 0.10
Nodes (35): BaitTray(), BaitTrayProps, CatchWagerView, debugSpecies(), debugVariant(), GuestRoll, GuestRollOptions, guestTreasure() (+27 more)

### Community 149 - "lib/presence.ts"
Cohesion: 0.09
Nodes (20): Connect, connectWebSocket(), fetchTicket, HEARTBEAT_MS, HIDDEN_LIMIT_MS, RETRY_MS, SAY_GAP_MS, Socket (+12 more)

### Community 150 - "HallArranger.tsx"
Cohesion: 0.21
Nodes (10): loadHallArranger(), MinigameFrame(), MinigameFrameProps, HallArranger(), HallArrangerProps, Painting, currentHallOrder(), hallPlacements() (+2 more)

### Community 151 - "pond-state.ts"
Cohesion: 0.24
Nodes (15): fetchPondState(), PondStateView, PondTier, ensurePondStateStarted(), getPondStateSnapshot(), GUEST, listeners, LOADING (+7 more)

### Community 153 - "createMinimap"
Cohesion: 0.31
Nodes (9): place(), createMinimap(), draw(), drawRoom(), floors(), sketchOf(), readCollapsed(), svg() (+1 more)

### Community 154 - "epoch.ts"
Cohesion: 0.13
Nodes (24): GET(), intParam(), GET(), sketchPool, unavailable(), hallPaintings(), MuseumProps, EMPTY (+16 more)

### Community 155 - "hang-tag.ts"
Cohesion: 0.12
Nodes (8): CARD, createHangTag(), HangTag, HangTagStyle, HOLE, KNOT, What goes, and what replaces it, Refusal

### Community 157 - "Walkthrough.tsx"
Cohesion: 0.16
Nodes (18): BACKDROP_STYLE, MoreArrow(), NavArrow(), Props, SLIDE, Walkthrough(), XIcon(), decodedFrames (+10 more)

### Community 158 - "createPondRoom"
Cohesion: 0.32
Nodes (13): createPondRoom(), approach(), busy(), finishWalk(), goTo(), leave(), move(), nearest() (+5 more)

### Community 159 - "wardrobe.test.ts"
Cohesion: 0.22
Nodes (5): Options, bow, dress, navy, SlotHandle

### Community 160 - "createPlacementLayer"
Cohesion: 0.31
Nodes (8): aspectOf(), createPlacementLayer(), drawOutline(), dropGhosts(), dropHelper(), extrasFor(), silhouette(), sizeOf()

### Community 161 - "Atelier: the dressing mirror, and show-don't-tell keeping"
Cohesion: 0.13
Nodes (14): Atelier: the dressing mirror, and show-don't-tell keeping, Build order, Built (2026-11-20), Decisions (2026-11-19), Follow-ups (2026-11-20), Goal, In the room, Keeping (+6 more)

### Community 162 - "tab-turn.ts"
Cohesion: 0.16
Nodes (5): createTabTurn(), TabTurn, tab(), TurnEnv, TurnMessage

### Community 163 - "painting-open"
Cohesion: 0.50
Nodes (4): file, kilobytes, seconds, painting-open

### Community 164 - "npc-sheet.cjs"
Cohesion: 0.31
Nodes (8): CFG, closeEye(), eraseMouth(), inpaint(), sample(), sharp, [src, out, cfgPath], warp()

### Community 165 - "Multiplayer ("other visitors") — plan v2 (Cloudflare)"
Cohesion: 0.15
Nodes (12): 0. Summary, 10. Decisions, 1. Product contract changes (approved 2026-10-31), 2. What already exists that this builds on, 3.1 Generated names (everyone has one), 3. Names, 5.1 Emotes (v1), 5. Protocol (`packages/core/src/presence/protocol.ts`) (+4 more)

### Community 167 - "assetUrl"
Cohesion: 0.29
Nodes (11): fetchPondFeed(), PondFeedItem, catchLabel(), formatSizeCm(), speciesFor(), speciesName(), speciesTier(), isGolden() (+3 more)

### Community 169 - "icon-basket"
Cohesion: 0.67
Nodes (3): icon-basket, file, vector

### Community 170 - "LandingFx"
Cohesion: 0.32
Nodes (5): glowSprite(), LandingFx(), onVisibility(), tick(), Mote

### Community 171 - "4. Transport: Cloudflare Durable Objects"
Cohesion: 0.25
Nodes (8): 4. Transport: Cloudflare Durable Objects, Decision (2026-10-31), Deploying, Identity cannot be forged, Local development and tests, Rooms and capacity, Shape of `apps/presence` (about 200 lines), main()

### Community 172 - "Pedestal"
Cohesion: 0.14
Nodes (4): Helm, createNotes(), createPedestal(), Pedestal

### Community 174 - "Local end-to-end stress test — 2026-11-06"
Cohesion: 0.29
Nodes (7): Environment and coverage, Follow-up coverage, Issue index, Local end-to-end stress test — 2026-11-06, Measured load, Passing checks and interpretation limits, Test data and cleanup

### Community 176 - "ColorRecall.tsx"
Cohesion: 0.24
Nodes (15): buy(), ensureStarted(), isBuyReply(), memberChanged(), publish(), readSession(), undoAdminUnlock(), unlockEverything() (+7 more)

### Community 177 - "visits.ts"
Cohesion: 0.06
Nodes (46): state(), PER_VISITOR, POST(), dynamic, format(), grade(), METRICS, PAGES (+38 more)

### Community 179 - "reveal.ts"
Cohesion: 0.23
Nodes (7): InkMap, planGame(), ROUND_SPREAD, createReveal(), PENCIL, SketchReveal, shuffle()

### Community 180 - "createStage"
Cohesion: 0.28
Nodes (11): FLICK, flickDirection(), isUpwardFlick(), createNearby(), createStage(), closeEntry(), enter(), handlePointerUp() (+3 more)

### Community 182 - "schedule.test.ts"
Cohesion: 0.08
Nodes (20): RESIDENT_IDS, JOBS, NpcGround, PlaceKind, ROOM_KINDS, ROOMS, PlaceInput, NpcRoom (+12 more)

### Community 183 - "Storyline (draft, saved 2026-11-17)"
Cohesion: 0.15
Nodes (12): Arc (soft, no fail state), Built so far, How it ties to what exists, Locked (2026-11-21, the owner), Next tasks (when picked up), Open questions, Premise, Revision (2026-11-21, the owner) (+4 more)

### Community 184 - "Low"
Cohesion: 0.25
Nodes (8): 13. Pages that redirect or don't exist answer 200, 14. Error codes reveal which room slugs exist, 15. The name sign slides under the top-right buttons in Decorate, 16. Level-up celebrations can be farmed, 17. No hint of where things are after panning away, 18. Too many items is only discovered by the server, 19. Development-only: page payloads include the full room row, Low

### Community 185 - "bake-pond-path.mjs"
Cohesion: 0.21
Nodes (7): blank(), manifest, manifestPath, ORIGINAL_SOURCE, originalPath(), root, softened()

### Community 186 - "a/[slug]/page.tsx"
Cohesion: 0.31
Nodes (6): ArtistPage(), dynamic, generateMetadata(), GET(), FollowForm(), getArtistPage()

### Community 187 - "themes.ts"
Cohesion: 0.05
Nodes (46): Catalogue, Data model (core), 1. Items placed against a zone edge fail to save, and the whole draft reverts, 2. One owned item can be placed many times, 3. Any save rejection throws away all unsaved work, 4. Changes made just before leaving are lost, 5. Fish trophies can be claimed without playing, High (+38 more)

### Community 189 - "themes.ts"
Cohesion: 0.15
Nodes (29): discardLocation(), hasUnpublished(), inUse(), locationStates(), nudgeInRow(), OWNER, placePainting(), PlaceResult (+21 more)

### Community 190 - "Medium"
Cohesion: 0.22
Nodes (9): onClick(), 10. Long names run off the name sign, 11. The rooms API skips the stale-tab member check, 12. The bunny is dragged along while you pan in Decorate, 6. Failed saves are nearly invisible, and nothing retries, 7. Two tabs editing the same room overwrite each other, 8. The drawer's card row can't be scrolled on touch screens, 9. Decorating can't be done with the keyboard (+1 more)

### Community 191 - "slots/store.ts"
Cohesion: 0.15
Nodes (18): ANON_PREFIX, anonKey(), deviceKey(), isMemberSlotKey(), listKeys(), MEMBER_KEY, memberKey(), memberPrefix() (+10 more)

### Community 192 - "BountyPanel.tsx"
Cohesion: 0.21
Nodes (18): refreshWalletNow(), PearlIcon(), fetchPondBounties(), PondBounties, formatInteger(), nextUtcMidnight(), utcDayLabel(), setPondState() (+10 more)

### Community 193 - "Monets Lily Pond: exploration, UX and multiplayer QA"
Cohesion: 0.29
Nodes (6): Browser and interaction coverage, Changes made from the walkthrough, Monets Lily Pond: exploration, UX and multiplayer QA, Multiplayer and load, Practical limits, Regression checks and cleanup

### Community 194 - "bugs/page.tsx"
Cohesion: 0.38
Nodes (6): BugReportsPage(), dateFormat, dynamic, summary(), BugContext, listBugReports()

### Community 195 - "Personal room: stress-test issues"
Cohesion: 0.29
Nodes (5): Checked and fine, Not covered by this pass, Personal room: stress-test issues, Status (2026-11-06), Test data left in the local database

### Community 198 - "useSoundEffects.ts"
Cohesion: 0.11
Nodes (27): BackgroundMusic, clampVolume(), isDocumentHidden(), Options, useBackgroundMusic(), VISIBILITY_EVENTS, EFFECTS, EffectSpec (+19 more)

### Community 199 - "domain/sketch.ts"
Cohesion: 0.08
Nodes (36): listPieces(), pieceImageUrl(), PieceRow, toPieceDto(), GalleryPiece, GalleryRow, toPiece(), planSketchRound() (+28 more)

### Community 200 - "Item"
Cohesion: 0.15
Nodes (3): Room, Presence, Item

### Community 201 - "messages.ts"
Cohesion: 0.36
Nodes (6): checkMessage(), INVISIBLE, MESSAGE_MAX, MessageCheck, normalizeMessage(), hasProfanity()

### Community 202 - "confirm/page.tsx"
Cohesion: 0.33
Nodes (7): ConfirmFollow(), dynamic, dynamic, Unsubscribe(), FollowNotice(), confirmFollow(), unsubscribe()

### Community 205 - "nearby.ts"
Cohesion: 0.18
Nodes (5): Nearby, NearbyReach, RoomSpan, reach, strip

### Community 207 - "catalog.ts"
Cohesion: 0.19
Nodes (17): confirmClean(), CatalogItem, CatalogKind, FREE_CHARACTERS, ITEMS, ItemSlot, expected, slots (+9 more)

### Community 208 - "master"
Cohesion: 0.40
Nodes (5): image(), rig(), slimGlb(), write(), The bunny rig

### Community 210 - "AccountSheet.tsx"
Cohesion: 0.07
Nodes (24): PresencePreviewPage(), AccountSheet(), continueAnyway(), doSignOut(), runDelete(), runName(), submit(), submitDelete() (+16 more)

### Community 211 - "GuestBoard.tsx"
Cohesion: 0.16
Nodes (18): earn(), maybeInvite(), writeSession(), ComposeScreen(), blankDraft(), GuestBoard(), GuestBoardProps, View (+10 more)

### Community 213 - "master"
Cohesion: 0.32
Nodes (7): paintedCostume(), closedWaist(), floralOutfits(), goldOutfits(), master(), placed(), turned()

### Community 214 - "player-card.ts"
Cohesion: 0.09
Nodes (17): createPlayerCard(), hide(), onPointerDown(), Door, doorOf(), PlayerCard, wallpaperOf(), cozyLevel (+9 more)

## Knowledge Gaps
- **5 isolated node(s):** `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1647 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **35 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `AtelierKeeps.tsx`, `studio/page.tsx`, `SketchGuess.tsx`, `src/rooms/doors.ts`, `app/layout.tsx`, `builtUrl`, `round.ts`, `scene/assets.ts`, `machine.ts`, `Museum.tsx`, `bug-report.ts`, `Test Fakes and Helpers`, `LeaderboardPanel.tsx`, `DecorDrawer.tsx`, `room-events.ts`, `tables.ts`, `HallArranger.tsx`, `pond-state.ts`, `Walkthrough.tsx`, `Web Package Dependencies`, `PersonalRoom.tsx`, `risk.ts`, `paintings/page.tsx`, `assetUrl`, `LandingFx`, `ColorRecall.tsx`, `Water.tsx`, `AssetImage`, `pond-format.ts`, `a/[slug]/page.tsx`, `slots/store.ts`, `domain/guestboard.ts`, `BountyPanel.tsx`, `useSoundEffects.ts`, `AtelierKeeps.tsx`, `AccountSheet.tsx`, `GuestBoard.tsx`, `ClosetView.tsx`, `FishingView.tsx`, `revealFloorTransition`, `rig.ts`?**
  _High betweenness centrality (0.103) - this node is a cross-community bridge._
- **What connects `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json` to the rest of the system?**
  _5 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `AtelierKeeps.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10104529616724739 - nodes in this community are weakly interconnected._
- **Why does `three` connect `remote-visitors.ts` to `stage.ts`, `scene/ambience.ts`, `scene/assets.ts`, `npc-layer.ts`, `scene.ts`, `cozy.ts`, `stone-path-bake.ts`, `room-events.ts`, `pond/room.ts`, `master`, `atelier.ts`, `Web Package Dependencies`, `Traversal`, `pond/art.ts`, `hang-tag.ts`, `ambience.ts`, `rig.ts`, `hit.ts`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Should `SketchGuess.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08562367864693446 - nodes in this community are weakly interconnected._
- **Why does `defaultStore()` connect `slots/store.ts` to `SyncStore`, `createHallRoom`, `room-events.ts`, `createStage`, `PersonalRoom.tsx`, `pond-state.ts`, `react`, `pond-api.ts`, `createPondRoom`, `PersonalRoom.tsx`, `remote-visitors.ts`, `ColorRecall.tsx`, `createStage`, `atelier.ts`, `pond-format.ts`, `economy/store.ts`, `stage.ts`, `session.ts`, `AccountSheet.tsx`, `pond/room.ts`, `wardrobe.ts`, `pondgame/lib/api.ts`, `rig.ts`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Should `src/rooms/doors.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07139079851930195 - nodes in this community are weakly interconnected._