# Graph Report - tiny-museum  (2026-11-23)

## Corpus Check
- 572 files · ~350,522 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 106 file(s) not represented in the graph (top: .avif 56, .glb 38, .css 7)

## Summary
- 5121 nodes · 13292 edges · 238 communities (203 shown, 35 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 263 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `671c0ef9`
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
- layout.ts
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
- ticket/route.ts
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
- confirm/page.tsx
- stage.ts
- import-fishing-assets.mjs
- Base TSConfig
- Amplify Build Spec
- sketchguess/lib/api.ts
- actions.ts
- react
- LandingFx
- Water.tsx
- Worker Package Manifest
- Public Asset Manifest
- lib/assets.ts
- atelier.ts
- compose-atelier.mjs
- editor.ts
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
- slots/store.ts
- scene/ambience.ts
- Confirmed issues
- session.ts
- Placement
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
- createNpcLayer
- ClosetView.tsx
- pond/room.ts
- query
- Run-Once Schema
- atelier/room.ts
- FishingView.tsx
- AtelierRoom
- Rig
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
- next
- wander.test.ts
- MirrorView
- AccountSheet.tsx
- presence/tsconfig.json
- wallet.ts
- tsconfig.test.json
- rooms.ts
- BunnyArtist.tsx
- peers.ts
- run.ts
- ReadScreen.tsx
- npc-layer.ts
- pond/room.ts
- room-places.ts
- bug-report.ts
- overlay.ts
- LeaderboardPanel.tsx
- hit.ts
- The Moonlit Pond — design
- Pond rework
- initialize
- Orchestration contract — you plan, DSH workers execute
- tables.ts
- lib/presence.ts
- useBackgroundMusic.ts
- defaultStore
- SlotDef
- pond-boards.ts
- Walker
- hang-tag.ts
- loadCozyArt
- Walkthrough.tsx
- createPondRoom
- db-tests/pond.test.ts
- createPlacementLayer
- Atelier: the dressing mirror, and show-don't-tell keeping
- darknessAt
- wallet/body.ts
- dependencies
- Multiplayer ("other visitors") — plan v2 (Cloudflare)
- Lobby
- createCozyBackdrop
- db.ts
- CrowdPreview.tsx
- exports
- PondPanels.tsx
- ticket.ts
- a/[slug]/page.tsx
- Local end-to-end stress test — 2026-11-06
- PondTicker.tsx
- useSound
- visits.ts
- drawingOn
- visits/page.tsx
- vitals.ts
- BountyPanel.tsx
- schedule.test.ts
- Storyline (draft, saved 2026-11-17)
- Low
- bake-pond-path.mjs
- personal/room.ts
- themes.ts
- draw.py
- Conn
- createPixelRatioGovernor
- SyncStore
- VitalsReporter.tsx
- Monets Lily Pond: exploration, UX and multiplayer QA
- createMinimap
- .webSocketMessage
- AccountSheet
- scripts
- useSoundEffects.ts
- handlers.ts
- createCharacter
- names.ts
- rig.ts
- npcs/README.md
- createRemoteVisitors
- nearby.ts
- Wardrobe
- opening.ts
- createHallRoom
- app/layout.tsx
- useMember
- CozyBackdrop
- GuestBoard
- plan.ts
- Open rooms and the tip jar (design, 2026-11-21)
- BountyPanel.tsx
- npc-sheet.cjs
- Cafe
- master
- doors.sql
- flick.ts
- Minimap
- ArtCache
- playwright
- painting-open
- Notes
- Other visitors
- paintedCostume
- focus.ts
- icon-basket
- TreeSparkles
- LiveReflection
- bunny-left
- bunny-right
- icon-home
- ticket
- esbuild

## God Nodes (most connected - your core abstractions)
1. `react` - 83 edges
2. `json()` - 72 edges
3. `query()` - 71 edges
4. `PersonalRoom()` - 67 edges
5. `hit()` - 58 edges
6. `limited()` - 52 edges
7. `three` - 49 edges
8. `Traversal` - 48 edges
9. `next` - 47 edges
10. `createHallRoom()` - 47 edges

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

## Communities (238 total, 35 thin omitted)

### Community 0 - "AtelierKeeps.tsx"
Cohesion: 0.12
Nodes (24): Toast, Purse(), Stamp(), useWallet(), STAMP_ASPECT, STAMP_SVG, STAMP_URL, stampLabel() (+16 more)

### Community 1 - "locations.ts"
Cohesion: 0.21
Nodes (24): discardLocation(), hangableOnly(), hasUnpublished(), inUse(), locationStates(), nudgeInRow(), OWNER, placePainting() (+16 more)

### Community 2 - "SketchGuess.tsx"
Cohesion: 0.10
Nodes (32): bestKeyFor(), BURST, clueUrl(), openingPlan(), Phase, pickAtRandom(), PreparedGame, prepareSketchGame() (+24 more)

### Community 3 - "DoorEditor.tsx"
Cohesion: 0.05
Nodes (71): GET(), intParam(), GET(), sketchPool, unavailable(), DoorsPage(), dynamic, hallPaintings() (+63 more)

### Community 4 - "app/page.tsx"
Cohesion: 0.22
Nodes (11): dynamic, Hall(), MuseumPage(), [BRAND_OWNER, ...BRAND_REST], CurrentlyShowing(), Decor(), dynamic, LandingPage() (+3 more)

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
Cohesion: 0.09
Nodes (41): AssetManifest, assetUrl(), bitmapTexture(), blankImage(), CAFE_CAT_FRAMES, CompressedLoader, elementTexture(), ENTRANCE_FILES (+33 more)

### Community 9 - "layout.ts"
Cohesion: 0.14
Nodes (13): cafeAfterIndex(), computeLayout(), clear(), placeCafe(), cutRooms(), DoorSpan, HALL_DOOR_FOOT, HallRoomKind (+5 more)

### Community 10 - "machine.ts"
Cohesion: 0.12
Nodes (35): CastMeter(), ReelMeter(), armCast(), BITE_WINDOW, biteGap(), CHARGE_PERIOD, chargePower(), createFishingState() (+27 more)

### Community 11 - "Museum.tsx"
Cohesion: 0.13
Nodes (25): Loading(), PinnedNotes(), AtelierLoading(), CoinFound, ColorRecall, GameDesktop, GuestBoard, HallArranger (+17 more)

### Community 12 - "Test Fakes and Helpers"
Cohesion: 0.12
Nodes (27): deferredFetch(), deviceSlot, FakeEvents, FakeStorage, fixture, fixtureB, fixtureRegistry, fixtureRegistryBoth (+19 more)

### Community 13 - "scene.ts"
Cohesion: 0.05
Nodes (29): MuseumProps, disposeDisplayTexture(), prefersAvif(), HiddenCoin, createNotes(), createPedestal(), Pedestal, PedestalVoice (+21 more)

### Community 14 - "cozy.ts"
Cohesion: 0.09
Nodes (18): ATELIER_PROPS, AtelierImage, disposeCozyArt(), DRAWN, EYE, FINISH_TILES, FISH, HOME_PROPS (+10 more)

### Community 15 - "logic.ts"
Cohesion: 0.07
Nodes (40): DecorDrawer, DecorDrawerProps, SLOT_LABELS, Tab, TABS, HallArranger(), HallArrangerProps, Painting (+32 more)

### Community 16 - "room-events.ts"
Cohesion: 0.19
Nodes (25): ChatButton(), REFUSED, joinRoom(), emit(), getPeople(), isInRoom(), isMuted(), muted (+17 more)

### Community 17 - "schedule.ts"
Cohesion: 0.07
Nodes (55): addDwellEmotes(), addEmote(), addGap(), addStand(), addWalk(), along(), buildRoomTable(), buildStayPlan() (+47 more)

### Community 18 - "ref_node_assert"
Cohesion: 0.14
Nodes (24): defineSlot(), byAtThenKey(), encoded(), latest, mapOf(), maxNumber(), put(), record() (+16 more)

### Community 19 - "amplify/package.json"
Cohesion: 0.08
Nodes (26): amplifyDir, backend, everyMinutes, mediaBucket, missing, repoRoot, REQUIRED, setting() (+18 more)

### Community 20 - "PersonalRoom.tsx"
Cohesion: 0.09
Nodes (48): errorReason(), Offer, overDrawer(), PersonalRoom(), canPlaceNew(), carriedTo(), carryEnd(), carryMove() (+40 more)

### Community 21 - "prepare-models.mjs"
Cohesion: 0.07
Nodes (29): alongArm(), ARMS, armTurn(), BODIES, bruce, BRUCE_FIT, BRUCE_PLACE, BRUCE_SLEEVES (+21 more)

### Community 22 - "Traversal"
Cohesion: 0.08
Nodes (12): JumpPose, clamp(), JUMP_KEYS, fixture(), jump(), Traversal, MAX_CATCH_UP_SECONDS, MAX_STEP_SECONDS (+4 more)

### Community 23 - "core/package.json"
Cohesion: 0.16
Nodes (13): devDependencies, @types/bcryptjs@^2.4.6, @types/pg@^8.11.10, main, name, private, scripts, typecheck (+5 more)

### Community 24 - "hitForVisitor"
Cohesion: 0.11
Nodes (31): POST(), ALLOWED, PER_VISITOR, POST(), POST(), POST(), GLOBAL, PER_IP (+23 more)

### Community 25 - "ticket/route.ts"
Cohesion: 0.10
Nodes (32): GET(), GET(), GET(), GET(), PER_MEMBER, GET(), PER_MEMBER, GET() (+24 more)

### Community 26 - "media/storage.ts"
Cohesion: 0.10
Nodes (16): PUT(), ACCEPTED, createAssetFromUpload(), MAX_UPLOAD_BYTES, presignUpload(), registerUpload(), UploadRejected, S3Storage (+8 more)

### Community 27 - "pond-api.ts"
Cohesion: 0.26
Nodes (18): buyPondBait(), claimPondBounty(), errorOf(), exchangePondPearls(), fetchPondBounties(), fetchPondDex(), fetchPondLeaderboard(), fetchPondState() (+10 more)

### Community 28 - "ambience.ts"
Cohesion: 0.12
Nodes (29): blade(), bloom(), BLOOMS, createPondAmbience(), update(), fishTexture(), frond(), FRONT_ROWS (+21 more)

### Community 29 - "core/src/index.ts"
Cohesion: 0.05
Nodes (117): MergeResult, addBait(), PondBoardMe, PondBoardRow, PondFeedItem, Rep, bountyCatches(), BountyCatchRow (+109 more)

### Community 30 - "Web Package Dependencies"
Cohesion: 0.07
Nodes (36): dependencies, embla-carousel-react@^8.6.0, motion@^13.1.1, next@^15.0.3, react@^19.0.0, react-dom@^19.0.0, swr@^2.5.1, three@^0.169.0 (+28 more)

### Community 31 - "Gamifying Tiny Museum — genre direction & engagement research"
Cohesion: 0.10
Nodes (19): 0.1 The core experience, 0.2 Systems that make gamification cheap to build, 0.3 Constraints that shape any recommendation, 0. What the game is today (the deep dive), 1.1 The landscape (seven candidates, with verdicts), 1.2 Recommendation: a **cozy gallery life-sim** — "the gallery you live in", 1.3 The five design pillars the genre implies, 1. Genre direction (+11 more)

### Community 32 - "museum/layout.tsx"
Cohesion: 0.33
Nodes (7): MuseumLayout(), CoinToast(), WalletProvider(), setMuseumDoors(), MuseumDoors(), MuseumStage(), publishedDoors()

### Community 33 - "remote-visitors.ts"
Cohesion: 0.07
Nodes (49): Assets, Scenery, CUTS, disposeBoards(), Mark, plane(), ROPE_CUTS, ropeSlices() (+41 more)

### Community 34 - "risk.ts"
Cohesion: 0.12
Nodes (33): Hud(), HudProps, HudWagerChip, WagerPicker(), chooseTier(), WagerPickerProps, CastOptions, PondStateView (+25 more)

### Community 35 - "amplify/tsconfig.json"
Cohesion: 0.20
Nodes (9): compilerOptions, module, moduleResolution, noUnusedLocals, noUnusedParameters, exclude, extends, include (+1 more)

### Community 36 - "5. Customization menu — what other people are doing"
Cohesion: 0.12
Nodes (16): 1. The target: what "Claude Opus 5.5" actually means, 2. Where your harness stands today (live config I read), 3. The honest gap model, 4. Quality levers, ranked by leverage, 5. Customization menu — what other people are doing, 6. Recommended starting kit for *your* profile, 7. What I can apply for you right now (needs your go-ahead), A. Prompt & persona (most common quality customizations) (+8 more)

### Community 37 - "stage.ts"
Cohesion: 0.04
Nodes (33): Attachment, Carried, CarriedState, createCarried(), Character, Perch, Pose, createHelm() (+25 more)

### Community 38 - "domain/sketch.ts"
Cohesion: 0.07
Nodes (44): listPieces(), pieceImageUrl(), PieceRow, toPieceDto(), GalleryRow, getSketchRound(), planSketchRound(), SKETCH_CHOICES (+36 more)

### Community 39 - "Web TSConfig"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 40 - "Root Package Manifest"
Cohesion: 0.14
Nodes (17): description, devDependencies, concurrently@^9.1.0, ktx2-encoder@^0.6.0, maxrects-packer@^2.7.3, @types/node@^22.9.0, typescript@^5.6.3, typescript (+9 more)

### Community 41 - "confirm/page.tsx"
Cohesion: 0.33
Nodes (7): ConfirmFollow(), dynamic, dynamic, Unsubscribe(), FollowNotice(), confirmFollow(), unsubscribe()

### Community 42 - "stage.ts"
Cohesion: 0.03
Nodes (40): coverFloorTransition(), CharacterSprites, CameraRig, createRoomPassage(), fixture(), Room, createPerfMeter(), isEnabled() (+32 more)

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
Cohesion: 0.21
Nodes (11): sameOriginUrl(), decodeImage(), fetchBitmap(), fetchRound(), guarded(), InkMap, loadInk(), loadRound() (+3 more)

### Community 47 - "actions.ts"
Cohesion: 0.05
Nodes (74): BugReportsPage(), dateFormat, dynamic, summary(), dateFormat, dynamic, GuestBoardPage(), dynamic (+66 more)

### Community 48 - "react"
Cohesion: 0.19
Nodes (12): openBugReport(), fitWidth(), HelpGuide(), HelpGuideProps, POINTER_STEPS, TOUCH_STEPS, MinigameFrameProps, SoundToggle() (+4 more)

### Community 49 - "LandingFx"
Cohesion: 0.15
Nodes (14): between(), CAT, Edge, EDGES, runLandingCat(), choosePeeker(), peek(), glowSprite() (+6 more)

### Community 50 - "Water.tsx"
Cohesion: 0.07
Nodes (39): AmbientShadow, box(), BUCKET, bunnyBox(), easeOut(), Glint, LEFT_STYLE, lineColour() (+31 more)

### Community 51 - "Worker Package Manifest"
Cohesion: 0.14
Nodes (14): dependencies, @tiny/core@*, exports, ./lambda, @tiny/core, main, name, private (+6 more)

### Community 52 - "Public Asset Manifest"
Cohesion: 0.12
Nodes (15): artworks, bunny, size, floor, size, fonts, icon-no-photos, size (+7 more)

### Community 53 - "lib/assets.ts"
Cohesion: 0.12
Nodes (21): Loading(), DENSITY_MEDIA, HallPreload(), HallSkeleton(), AtelierImage, PICTURE, assetCssVariables(), assetVariant() (+13 more)

### Community 54 - "atelier.ts"
Cohesion: 0.07
Nodes (31): AtelierDoor, AtelierImage, BuiltRoom, Cardigan, CARDIGAN_NAMES, Control, refresh(), isCardigan() (+23 more)

### Community 55 - "compose-atelier.mjs"
Cohesion: 0.12
Nodes (10): body, dressLayer, dressWidth, floralWidth, hanger, MANNEQUIN_CANVAS, mask, root (+2 more)

### Community 56 - "editor.ts"
Cohesion: 0.19
Nodes (15): roomEditor, PER_EDITOR, PUT(), versionOf(), PER_MEMBER, POST(), PER_EDITOR, POST() (+7 more)

### Community 57 - "pond-format.ts"
Cohesion: 0.13
Nodes (25): PondDex, EXCHANGE_DAILY_STAMPS, EXCHANGE_PEARLS_PER_STAMP, FISH_ART, formatPercent(), formatShortSizeCm(), ODDS_BAIT, POND_BAIT (+17 more)

### Community 58 - "pond/art.ts"
Cohesion: 0.40
Nodes (10): colorAt(), decoded(), disposePondArt(), edgeTexture(), imageOf(), loadPondArt(), loadTexture(), sizeOf() (+2 more)

### Community 59 - "economy/store.ts"
Cohesion: 0.09
Nodes (49): CARRY_CAP, carryAdd(), CarryEntry, carryPrune(), carryRemove(), chunk(), ClaimRequest, tzOffsetNow() (+41 more)

### Community 60 - "RigPreview.tsx"
Cohesion: 0.13
Nodes (21): RigPreviewPage(), NEXT, PROPS, RigPreview(), draw(), cache, queue, render() (+13 more)

### Community 61 - "room.ts"
Cohesion: 0.13
Nodes (28): socket(), admitted(), Attachment, farewell(), GHOST_MS, HELLO_TIMEOUT_MS, holdsOf(), homeOf() (+20 more)

### Community 62 - "minimap.ts"
Cohesion: 0.11
Nodes (23): follow(), doorPoint(), FALLBACK_TINT, FloorSketch, ICONS, MAP_PLACES, MAP_SCALE, MapPlace (+15 more)

### Community 63 - "tab-turn.ts"
Cohesion: 0.10
Nodes (7): createTabTurn(), TabTurn, tab(), TurnEnv, TurnMessage, boundedCameraX(), valid

### Community 64 - "domain/guestboard.ts"
Cohesion: 0.11
Nodes (27): GET(), BoardScreen(), ComposeScreen(), ComposeScreenProps, blankDraft(), GuestBoard(), GuestBoardProps, View (+19 more)

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

### Community 69 - "slots/store.ts"
Cohesion: 0.14
Nodes (16): ANON_PREFIX, anonKey(), deviceKey(), isMemberSlotKey(), listKeys(), MEMBER_KEY, memberKey(), memberPrefix() (+8 more)

### Community 70 - "scene/ambience.ts"
Cohesion: 0.13
Nodes (13): BULBS, createHallAmbience(), finish(), glowTexture(), HallAmbience, mulberry(), painted(), vignetteTexture() (+5 more)

### Community 71 - "Confirmed issues"
Cohesion: 0.11
Nodes (19): Confirmed issues, E2E-001 — Alternate local origin breaks artwork fallback URLs, E2E-002 — Valid edge placement rejected through floating-point precision, E2E-003 — One owned prop can be placed multiple times, E2E-004 — Reload before autosave silently loses the latest placement, E2E-005 — Failed save and failed Done have no visible mobile explanation, E2E-006 — Restoring connectivity does not retry a failed draft save, E2E-007 — Keyboard activation cannot place drawer items (+11 more)

### Community 72 - "session.ts"
Cohesion: 0.12
Nodes (25): GET(), PaintingRow, POST(), UPLOADS_PER_ARTIST, POST(), UPLOADS_PER_ARTIST, AnalyticsPage(), dynamic (+17 more)

### Community 73 - "Placement"
Cohesion: 0.05
Nodes (17): Carry, Job, PersonalRoomProps, centerYFor(), createDecorController(), canvasRect(), targetRise(), toScreen() (+9 more)

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
Cohesion: 0.16
Nodes (15): createPresence(), drop(), heartbeat(), maybeSend(), onPageHide(), receive(), scheduleRetry(), send() (+7 more)

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
Cohesion: 0.03
Nodes (45): bodyTextures, COATS, { json, bin }, manifest, maps, target, BASEBOARD, CURTAIN (+37 more)

### Community 93 - "createNpcLayer"
Cohesion: 0.19
Nodes (19): createNpcLayer(), createResidentView(), createView(), departedRecently(), draw(), fadeOut(), glyphWidth(), hideAll() (+11 more)

### Community 94 - "ClosetView.tsx"
Cohesion: 0.18
Nodes (14): ClosetView(), onKeyDown(), LISTS, PLACE, PODIUM_SRC, Slot, SPOTLIGHT_SRC, trapTab() (+6 more)

### Community 95 - "pond/room.ts"
Cohesion: 0.14
Nodes (23): water, depthAtLift(), FAR_LIFT, FAR_SCALE, liftAt(), pathHalfWidth(), pathX(), PondPath (+15 more)

### Community 96 - "query"
Cohesion: 0.07
Nodes (58): GET(), shutdown(), 3.2 Chosen names (members), registry, started(), artist(), member(), piece() (+50 more)

### Community 104 - "atelier/room.ts"
Cohesion: 0.09
Nodes (42): AtelierPage(), dynamic, metadata, allowedCharacter(), OwnedSnapshot, owns(), walletReady(), getWalletSnapshot() (+34 more)

### Community 105 - "FishingView.tsx"
Cohesion: 0.12
Nodes (14): CONFETTI_COLORS, ConfettiPiece, makeConfetti(), RevealCard(), TIER_MS, TIER_SFX, useCountUp(), AudioContextClass (+6 more)

### Community 106 - "AtelierRoom"
Cohesion: 0.07
Nodes (10): AtelierRoom, createWardrobe(), enqueue(), reflect(), Options, bow, dress, navy (+2 more)

### Community 108 - "Your Room: a room you can freely furnish"
Cohesion: 0.10
Nodes (15): PlacementTheme, Admin mode (gamma), Catalogue, Data model (core), Decisions (2026-11-17, with the user), Room look (web, `features/rooms/themes/cozy.ts`, `features/rooms/personal/room.ts`), Scale, Testing locally (+7 more)

### Community 109 - "json"
Cohesion: 0.10
Nodes (52): POST(), PER_MEMBER, PUT(), POST(), GLOBAL, PER_IP, POST(), POST() (+44 more)

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
Cohesion: 0.16
Nodes (18): serverSnapshot, useEarnEvents(), buildClaim(), BuiltClaim, EarnDetail, EarnSource, GameSource, newRunId() (+10 more)

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
Nodes (21): fetch(), Env, isHome(), isItem(), isName(), isPid(), isSeq(), MAX_HOLDS (+13 more)

### Community 119 - "Costume gallery doorway"
Cohesion: 0.50
Nodes (3): Costume gallery doorway, Curtain colour edit, Prompt

### Community 121 - "Fishing forest: painted asset pass"
Cohesion: 0.10
Nodes (18): Assets, Bruce's collection refresh (2026-11-08), Fishing forest illustrations, Made by hand (not touched by the script), Main hall v2 (2026-11-10), Monets Lily Pond (2026-11-08), 1. Forest doorway, 2. Woodland noticeboard (+10 more)

### Community 124 - "The Costume Atelier"
Cohesion: 0.14
Nodes (13): Adding a character, Adding a costume, Art not supplied as files, Bruce's Chronicles, Checked against the mocks (2026-11-07), Code, Costume fit review, Floral collection (+5 more)

### Community 125 - "next"
Cohesion: 0.06
Nodes (33): config, SECURITY_HEADERS, Loading(), metadata, PondPage(), loadGameDesktop(), revealFloorTransition(), GameDesktop() (+25 more)

### Community 126 - "wander.test.ts"
Cohesion: 0.15
Nodes (10): NpcRoomInfo, NpcFrame, StayContext, BASE_JOB, context(), L_GROUND, mulberry32(), room() (+2 more)

### Community 127 - "MirrorView"
Cohesion: 0.17
Nodes (14): Props, Wheel(), onPointerUp(), MIRROR_SRC, MirrorView(), move(), onKeyDown(), onPointerUp() (+6 more)

### Community 128 - "AccountSheet.tsx"
Cohesion: 0.19
Nodes (12): PresencePreviewPage(), NAME_ERRORS, Pending, View, PresencePreview(), WalkAlone(), announceNameChange(), NameError (+4 more)

### Community 129 - "presence/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, types, exclude, extends, include, ../../tsconfig.base.json

### Community 130 - "wallet.ts"
Cohesion: 0.06
Nodes (59): grantPearls(), member(), now, piece(), randomId(), today, hangPiece(), movePiece() (+51 more)

### Community 131 - "tsconfig.test.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 132 - "rooms.ts"
Cohesion: 0.09
Nodes (32): dynamic, HomePage(), dynamic, RoomPage(), COPY, HomeSignIn(), RoomNoticeProps, 1. Items placed against a zone edge fail to save, and the whole draft reverts (+24 more)

### Community 133 - "BunnyArtist.tsx"
Cohesion: 0.13
Nodes (16): walk(), BunnyArtist(), BunnyMood, Pencil(), POSES, 1. What is in this bundle, 3. The rig, 4. Suggested plan (+8 more)

### Community 134 - "peers.ts"
Cohesion: 0.14
Nodes (7): INTERPOLATION_DELAY_MS, PEER_TIMEOUT_MS, PeerTable, positionAt(), Sample, look, Peer

### Community 135 - "run.ts"
Cohesion: 0.17
Nodes (9): admin, childEnv, client, database, fresh, migrations, target, pg@^8.13.1 (+1 more)

### Community 136 - "ReadScreen.tsx"
Cohesion: 0.14
Nodes (17): BoardScreenProps, PinnedNotesProps, ReadScreen(), ReadScreenProps, messageLength(), StickyNote(), StickyNoteProps, NOTE_PLACES (+9 more)

### Community 137 - "npc-layer.ts"
Cohesion: 0.11
Nodes (27): GuideTalk(), createDoorGuides(), HallGuide, PROJECTED, BY_ID, castMember(), FRAME, IDLE (+19 more)

### Community 138 - "pond/room.ts"
Cohesion: 0.11
Nodes (13): EDGE_BAND, EDGE_BANDS, EDGE_OVERLAP, FLOOR, MOVE_KEYS, PlaneOptions, POND_ITEMS, POND_SPOTS (+5 more)

### Community 139 - "room-places.ts"
Cohesion: 0.15
Nodes (18): HallLayout, NpcGround, atelierRoomInfo(), atelierX(), copy(), FurniturePlacement, hallCache, hallRoomInfo() (+10 more)

### Community 140 - "bug-report.ts"
Cohesion: 0.11
Nodes (28): BugReportHost(), BugReportSheet, BugReportSheet(), send(), Status, collectContext(), inAppBrowser(), onOpenBugReport() (+20 more)

### Community 141 - "overlay.ts"
Cohesion: 0.10
Nodes (13): CafeLink, GuestBoardNotes, Placards, toScreen(), writeStyle(), createSitting(), hop(), raise() (+5 more)

### Community 142 - "LeaderboardPanel.tsx"
Cohesion: 0.23
Nodes (15): PondBoardId, PondBoardPeriod, PondBoardRow, PondLeaderboard, fishArt(), formatInteger(), formatOdds(), nextMondayUtc() (+7 more)

### Community 143 - "hit.ts"
Cohesion: 0.17
Nodes (12): CoinWall, createHiddenCoin(), Spot, AlphaMap, alphaMapFor(), alphaMaps, buildAlphaMap(), isPaintedAt() (+4 more)

### Community 144 - "The Moonlit Pond — design"
Cohesion: 0.09
Nodes (22): Art the pond needs from the artist, Build contract (decided 2026-11-07), Build phases, Collection and goals, Done, Done, Guardrails, Leaderboards (+14 more)

### Community 145 - "Pond rework"
Cohesion: 0.18
Nodes (10): Baits, Client, Decisions, Done, Notes, Pond rework, Server, Species (+2 more)

### Community 146 - "initialize"
Cohesion: 0.19
Nodes (19): createStage(), closeEntry(), enter(), initialize(), aim(), drawFrame(), handleClick(), handlePointerDown() (+11 more)

### Community 147 - "Orchestration contract — you plan, DSH workers execute"
Cohesion: 0.29
Nodes (6): Briefing a worker, Budget hygiene, graphify, Orchestration contract — you plan, DSH workers execute, The worker, When not to delegate

### Community 148 - "tables.ts"
Cohesion: 0.09
Nodes (40): FrameShape, BaitTray(), BaitTrayProps, RevealCardProps, PondCatch, CatchView, debugSpecies(), debugVariant() (+32 more)

### Community 149 - "lib/presence.ts"
Cohesion: 0.10
Nodes (20): Outcome, Entry, Connect, fetchTicket, HEARTBEAT_MS, HIDDEN_LIMIT_MS, RETRY_MS, SAY_GAP_MS (+12 more)

### Community 150 - "useBackgroundMusic.ts"
Cohesion: 0.17
Nodes (10): BackgroundMusic, clampVolume(), isDocumentHidden(), Options, useBackgroundMusic(), VISIBILITY_EVENTS, isRouted(), setGainLevel() (+2 more)

### Community 151 - "defaultStore"
Cohesion: 0.25
Nodes (14): PondStateView, PondTier, ensurePondStateStarted(), getPondStateSnapshot(), GUEST, listeners, LOADING, PondStateSnapshot (+6 more)

### Community 152 - "SlotDef"
Cohesion: 0.15
Nodes (5): FakeServer, SlotState, serverSnapshot(), serverSnapshots, SlotDef

### Community 153 - "pond-boards.ts"
Cohesion: 0.13
Nodes (21): BOARDS, GET(), oneOf(), PER_VISITOR, PERIODS, compare(), DexRow, displayName() (+13 more)

### Community 154 - "Walker"
Cohesion: 0.19
Nodes (3): FloorPoint, WalkArea, Walker

### Community 155 - "hang-tag.ts"
Cohesion: 0.12
Nodes (8): CARD, createHangTag(), HangTag, HangTagStyle, HOLE, KNOT, What goes, and what replaces it, Refusal

### Community 156 - "loadCozyArt"
Cohesion: 0.20
Nodes (14): canvasTexture(), ceilingTexture(), fishTexture(), floorTexture(), floorWearCanvas(), loadCozyArt(), loadImage(), loadTexture() (+6 more)

### Community 157 - "Walkthrough.tsx"
Cohesion: 0.15
Nodes (19): BACKDROP_STYLE, MoreArrow(), NavArrow(), Props, SLIDE, Walkthrough(), XIcon(), decodedFrames (+11 more)

### Community 158 - "createPondRoom"
Cohesion: 0.32
Nodes (13): createPondRoom(), approach(), busy(), finishWalk(), goTo(), leave(), move(), nearest() (+5 more)

### Community 159 - "db-tests/pond.test.ts"
Cohesion: 0.16
Nodes (10): CatchExtra, clearCatches(), COLUMNS, grantPearls(), insertCatch(), member(), namedMember(), randomId() (+2 more)

### Community 160 - "createPlacementLayer"
Cohesion: 0.31
Nodes (8): aspectOf(), createPlacementLayer(), drawOutline(), dropGhosts(), dropHelper(), extrasFor(), silhouette(), sizeOf()

### Community 161 - "Atelier: the dressing mirror, and show-don't-tell keeping"
Cohesion: 0.13
Nodes (14): Atelier: the dressing mirror, and show-don't-tell keeping, Build order, Built (2026-11-20), Decisions (2026-11-19), Follow-ups (2026-11-20), Goal, In the room, Keeping (+6 more)

### Community 162 - "darknessAt"
Cohesion: 0.39
Nodes (6): CEILING, darknessAt(), pool(), RoomLight, smooth(), dirty

### Community 163 - "wallet/body.ts"
Cohesion: 0.31
Nodes (10): baitIdOf(), integerOffset(), isRecord(), itemIdOf(), MAX_CLAIM_BATCH, ParsedWalletClaim, parseWalletClaim(), routeBanned() (+2 more)

### Community 164 - "dependencies"
Cohesion: 0.15
Nodes (13): dependencies, @aws-sdk/client-s3@^3.1121.0, @aws-sdk/s3-request-presigner@^3.1121.0, bcryptjs@^2.4.3, obscenity@^0.4.6, sharp@^0.33.5, thumbhash@^0.1.1, sharp (+5 more)

### Community 165 - "Multiplayer ("other visitors") — plan v2 (Cloudflare)"
Cohesion: 0.10
Nodes (20): 0. Summary, 10. Decisions, 1. Product contract changes (approved 2026-10-31), 2. What already exists that this builds on, 3.1 Generated names (everyone has one), 3. Names, 4. Transport: Cloudflare Durable Objects, 5.1 Emotes (v1) (+12 more)

### Community 167 - "createCozyBackdrop"
Cohesion: 0.23
Nodes (13): alphaCanvas(), ceilingGeometry(), createCozyBackdrop(), clearGlows(), glow(), paintShade(), placeGlows(), placeSides() (+5 more)

### Community 168 - "db.ts"
Cohesion: 0.09
Nodes (27): CONTENT_TYPES, GET(), currentEpoch(), EpochRow, SliceRow, deletePiece(), GalleryPiece, MAX_STANDS (+19 more)

### Community 169 - "CrowdPreview.tsx"
Cohesion: 0.33
Nodes (7): CrowdPreviewPage(), CrowdPreview(), draw(), KINDS, Stats, Window, clearRigLayer()

### Community 170 - "exports"
Cohesion: 0.15
Nodes (13): exports, ./brand, ./bugs, ./economy, ./guestboard, ./presence, ./presence/messages, ./presence/wire (+5 more)

### Community 171 - "PondPanels.tsx"
Cohesion: 0.24
Nodes (8): FishmongerPanel(), BOARD_TABS, PondOverlayKind, PondPanels(), signIn(), PondPanelsProps, SUBTITLES, TITLES

### Community 172 - "ticket.ts"
Cohesion: 0.23
Nodes (12): decoder, encoder, fromBase64Url(), HmacKey, isOwn(), isTicket(), keyFor(), keys (+4 more)

### Community 173 - "a/[slug]/page.tsx"
Cohesion: 0.31
Nodes (6): ArtistPage(), dynamic, generateMetadata(), GET(), FollowForm(), getArtistPage()

### Community 174 - "Local end-to-end stress test — 2026-11-06"
Cohesion: 0.20
Nodes (8): Environment and coverage, Fix status (2026-11-06), Follow-up coverage, Issue index, Local end-to-end stress test — 2026-11-06, Measured load, Passing checks and interpretation limits, Test data and cleanup

### Community 175 - "PondTicker.tsx"
Cohesion: 0.29
Nodes (11): fetchPondFeed(), PondFeedItem, catchLabel(), formatSizeCm(), speciesFor(), speciesName(), speciesTier(), isGolden() (+3 more)

### Community 176 - "useSound"
Cohesion: 0.14
Nodes (23): ColorRecall(), ColorRecallProps, Phase, readBest(), showMs(), ensureStarted(), memberChanged(), publish() (+15 more)

### Community 177 - "visits.ts"
Cohesion: 0.17
Nodes (18): state(), flush(), visibleMs(), VisitState, count(), currentSalts(), DEVICES, loadSalts() (+10 more)

### Community 178 - "drawingOn"
Cohesion: 0.20
Nodes (12): atticWindowCanvas(), bareBulbCanvas(), boardsCanvas(), cobwebCanvas(), cozyFinishImageUrl(), creamCanvas(), drawingOn(), dustCanvas() (+4 more)

### Community 179 - "visits/page.tsx"
Cohesion: 0.27
Nodes (9): amount(), duration(), dynamic, LANDMARKS, PAGES, RANGES, share(), VisitsPage() (+1 more)

### Community 180 - "vitals.ts"
Cohesion: 0.16
Nodes (15): dynamic, format(), grade(), METRICS, PAGES, PerformancePage(), RANGES, DEVICES (+7 more)

### Community 181 - "BountyPanel.tsx"
Cohesion: 0.22
Nodes (15): refreshWalletNow(), PondBounties, formatCountdown(), nextUtcMidnight(), utcDayLabel(), setPondState(), useCountdown(), useNow() (+7 more)

### Community 182 - "schedule.test.ts"
Cohesion: 0.08
Nodes (28): FloorSpot, Job, JOBS, Place, PlaceKind, ROOM_KINDS, ROOMS, PlaceInput (+20 more)

### Community 183 - "Storyline (draft, saved 2026-11-17)"
Cohesion: 0.15
Nodes (12): Arc (soft, no fail state), Built so far, How it ties to what exists, Locked (2026-11-21, the owner), Next tasks (when picked up), Open questions, Premise, Revision (2026-11-21, the owner) (+4 more)

### Community 184 - "Low"
Cohesion: 0.10
Nodes (20): 10. Long names run off the name sign, 11. The rooms API skips the stale-tab member check, 12. The bunny is dragged along while you pan in Decorate, 13. Pages that redirect or don't exist answer 200, 14. Error codes reveal which room slugs exist, 15. The name sign slides under the top-right buttons in Decorate, 16. Level-up celebrations can be farmed, 17. No hint of where things are after panning away (+12 more)

### Community 185 - "bake-pond-path.mjs"
Cohesion: 0.21
Nodes (7): blank(), manifest, manifestPath, ORIGINAL_SOURCE, originalPath(), root, softened()

### Community 186 - "personal/room.ts"
Cohesion: 0.09
Nodes (25): AtelierArt, disposeAtelierArt(), GALLERY_DOOR, INSET_DOOR_Z, loadGalleryDoor(), loadGalleryPillar(), loadImage(), pending (+17 more)

### Community 187 - "themes.ts"
Cohesion: 0.06
Nodes (34): confirmClean(), Door, doorOf(), PlayerCard, wallpaperOf(), cozyLevel, ownsAll, ownsNone (+26 more)

### Community 189 - "Conn"
Cohesion: 0.31
Nodes (4): connectWebSocket(), SocketHandlers, Conn, message()

### Community 190 - "createPixelRatioGovernor"
Cohesion: 0.33
Nodes (7): createPixelRatioGovernor(), reset(), stepTo(), PIXEL_RATIO_STEPS, pixelRatioSteps(), Renderer, governor()

### Community 191 - "SyncStore"
Cohesion: 0.16
Nodes (7): encodeStored(), parseStored(), readStored(), removeStored(), writeStored(), SyncStore, upgrade()

### Community 192 - "VitalsReporter.tsx"
Cohesion: 0.29
Nodes (8): firstPainting(), flush(), Metric, queue, REPORTED, VitalsReporter(), FIRST_PAINTING_MARK, MUSEUM_START_MARK

### Community 193 - "Monets Lily Pond: exploration, UX and multiplayer QA"
Cohesion: 0.29
Nodes (6): Browser and interaction coverage, Changes made from the walkthrough, Monets Lily Pond: exploration, UX and multiplayer QA, Multiplayer and load, Practical limits, Regression checks and cleanup

### Community 194 - "createMinimap"
Cohesion: 0.36
Nodes (8): createMinimap(), draw(), drawRoom(), floors(), sketchOf(), readCollapsed(), svg(), writeCollapsed()

### Community 195 - ".webSocketMessage"
Cohesion: 0.44
Nodes (3): attachmentOf(), Room, sendTo()

### Community 196 - "AccountSheet"
Cohesion: 0.29
Nodes (9): AccountSheet(), continueAnyway(), doSignOut(), runDelete(), runName(), submit(), submitDelete(), submitName() (+1 more)

### Community 197 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, db:schema, deploy:backend, dev, dev:presence, dev:web, dev:worker (+6 more)

### Community 198 - "useSoundEffects.ts"
Cohesion: 0.18
Nodes (17): EFFECTS, EffectSpec, FOOTSTEPS, SoundEffects, useSoundEffects(), gestured(), OPTIONS, applyMix() (+9 more)

### Community 199 - "handlers.ts"
Cohesion: 0.10
Nodes (35): loop(), sleep(), sweepStale(), DrainResult, handler(), repairFrames(), confirmedFollowers(), sealEpoch() (+27 more)

### Community 200 - "createCharacter"
Cohesion: 0.28
Nodes (8): createCharacter(), contextLost(), loadFallbackWalk(), loadKind(), loseRig(), setFrame(), Angler(), layer()

### Community 201 - "names.ts"
Cohesion: 0.15
Nodes (17): Code, checkMessage(), INVISIBLE, MESSAGE_MAX, MessageCheck, normalizeMessage(), ADJECTIVES, checkDisplayName() (+9 more)

### Community 202 - "rig.ts"
Cohesion: 0.12
Nodes (27): Layer, setCostumeVisibility(), follow(), canvasToModel(), createRenderer(), createRigLayer(), disposeRigLayer(), Frame (+19 more)

### Community 204 - "createRemoteVisitors"
Cohesion: 0.17
Nodes (14): writeHidden(), createPlayerCard(), hide(), onPointerDown(), bubbleFor(), createRemoteVisitors(), ensureLayer(), hideSprites() (+6 more)

### Community 205 - "nearby.ts"
Cohesion: 0.18
Nodes (6): createNearby(), Nearby, NearbyReach, RoomSpan, reach, strip

### Community 207 - "opening.ts"
Cohesion: 0.43
Nodes (5): COLD_DOOR_HOLD_MS, hallIsReady(), Opening, OPENING_MAX_WAIT_MS, at()

### Community 208 - "createHallRoom"
Cohesion: 0.16
Nodes (21): earn(), maybeInvite(), writeSession(), createHallRoom(), buildRoom(), buildRoomContents(), cafeRoom(), tap() (+13 more)

### Community 209 - "app/layout.tsx"
Cohesion: 0.17
Nodes (12): bethEllen, inspiratiq, metadata, notoSans, RootLayout(), sniglet, viewport, SoundProvider() (+4 more)

### Community 210 - "useMember"
Cohesion: 0.13
Nodes (9): AccountHost(), AccountSheet, KeepOnOtherDevices(), AccountMode, onOpenAccount(), openAccount(), openAccountCreation(), Probe() (+1 more)

### Community 213 - "plan.ts"
Cohesion: 0.31
Nodes (6): PlaceInfo, planGame(), ROUND_SPREAD, createReveal(), compose(), shuffle()

### Community 214 - "Open rooms and the tip jar (design, 2026-11-21)"
Cohesion: 0.22
Nodes (8): cozyWorth(), Built (2026-11-21), Decisions, How it works, Numbers (first pass, to tune), Open questions, Open rooms and the tip jar (design, 2026-11-21), Story hooks

### Community 215 - "BountyPanel.tsx"
Cohesion: 0.31
Nodes (6): GLYPHS, PearlIcon(), POND_CRIMSON, PondIconName, PondHud(), PondHudProps

### Community 216 - "npc-sheet.cjs"
Cohesion: 0.31
Nodes (8): CFG, closeEye(), eraseMouth(), inpaint(), sample(), sharp, [src, out, cfgPath], warp()

### Community 218 - "master"
Cohesion: 0.28
Nodes (9): closedWaist(), goldOutfits(), image(), master(), placed(), rig(), slimGlb(), write() (+1 more)

### Community 221 - "flick.ts"
Cohesion: 0.53
Nodes (4): FLICK, flickDirection(), isUpwardFlick(), handlePointerUp()

### Community 224 - "playwright"
Cohesion: 0.40
Nodes (3): [, width, height], playwright@^1.63.0, playwright

### Community 225 - "painting-open"
Cohesion: 0.50
Nodes (4): file, kilobytes, seconds, painting-open

### Community 227 - "Other visitors"
Cohesion: 0.29
Nodes (6): How it plays, Other visitors, Privacy, Running it in production, Running it locally, Staying consistent

### Community 228 - "paintedCostume"
Cohesion: 0.33
Nodes (5): paintedCostume(), floralOutfits(), turned(), Fitting clothes to other characters, Headpieces

### Community 230 - "icon-basket"
Cohesion: 0.67
Nodes (3): icon-basket, file, vector

## Knowledge Gaps
- **5 isolated node(s):** `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1660 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **35 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `AccountSheet.tsx`, `AtelierKeeps.tsx`, `SketchGuess.tsx`, `DoorEditor.tsx`, `app/page.tsx`, `rooms.ts`, `ReadScreen.tsx`, `npc-layer.ts`, `Museum.tsx`, `bug-report.ts`, `Test Fakes and Helpers`, `LeaderboardPanel.tsx`, `logic.ts`, `room-events.ts`, `PersonalRoom.tsx`, `tables.ts`, `useBackgroundMusic.ts`, `defaultStore`, `SlotDef`, `Walkthrough.tsx`, `Web Package Dependencies`, `museum/layout.tsx`, `risk.ts`, `CrowdPreview.tsx`, `PondPanels.tsx`, `a/[slug]/page.tsx`, `PondTicker.tsx`, `useSound`, `LandingFx`, `Water.tsx`, `actions.ts`, `BountyPanel.tsx`, `pond-format.ts`, `RigPreview.tsx`, `domain/guestboard.ts`, `VitalsReporter.tsx`, `useSoundEffects.ts`, `app/layout.tsx`, `useMember`, `BountyPanel.tsx`, `ClosetView.tsx`, `atelier/room.ts`, `FishingView.tsx`, `FishingView.tsx`, `features/economy/index.ts`, `next`, `MirrorView`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._
- **What connects `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json` to the rest of the system?**
  _5 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `AtelierKeeps.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12310606060606061 - nodes in this community are weakly interconnected._
- **Why does `three` connect `remote-visitors.ts` to `scene/assets.ts`, `npc-layer.ts`, `pond/room.ts`, `scene.ts`, `cozy.ts`, `hit.ts`, `hang-tag.ts`, `ambience.ts`, `Web Package Dependencies`, `stage.ts`, `stage.ts`, `atelier.ts`, `pond/art.ts`, `personal/room.ts`, `RigPreview.tsx`, `scene/ambience.ts`, `Placement`, `rig.ts`, `stone-path-bake.ts`, `paintedCostume`, `atelier/room.ts`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Should `SketchGuess.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10317460317460317 - nodes in this community are weakly interconnected._
- **Why does `assetUrl()` connect `pond/art.ts` to `remote-visitors.ts`, `DoorEditor.tsx`, `scene/assets.ts`, `npc-layer.ts`, `atelier/room.ts`, `createCharacter`, `FishingView.tsx`, `LeaderboardPanel.tsx`, `PondTicker.tsx`, `cozy.ts`, `logic.ts`, `Water.tsx`, `drawingOn`, `loadCozyArt`, `lib/assets.ts`, `pond-format.ts`, `RigPreview.tsx`, `createNpcLayer`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Should `DoorEditor.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.051490514905149054 - nodes in this community are weakly interconnected._