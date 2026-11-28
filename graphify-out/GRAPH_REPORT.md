# Graph Report - tiny-museum  (2026-11-27)

## Corpus Check
- 609 files · ~371,842 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 118 file(s) not represented in the graph (top: .avif 60, .glb 46, .css 7)

## Summary
- 5415 nodes · 14286 edges · 230 communities (194 shown, 36 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 277 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `89f3d195`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- join-room.ts
- Traversal
- SketchGuess.tsx
- src/rooms/doors.ts
- pond/art.ts
- round.ts
- floor.ts
- Core Asset Manifest
- scene/assets.ts
- session.ts
- machine.ts
- Museum.tsx
- Test Fakes and Helpers
- scene.ts
- cozy.ts
- logic.ts
- join-room.ts
- schedule.ts
- AtelierKeeps.tsx
- amplify/package.json
- ref_node_assert
- prepare-models.mjs
- progress.ts
- core/package.json
- pond-boards.ts
- handlers.ts
- rooms.ts
- PondRoom.tsx
- ambience.ts
- core/src/index.ts
- Web Package Dependencies
- Gamifying Tiny Museum — genre direction & engagement research
- Item
- logic.ts
- risk.ts
- amplify/tsconfig.json
- 5. Customization menu — what other people are doing
- locations.ts
- wallet.ts
- Web TSConfig
- Root Package Manifest
- pond-api.ts
- hall/room.ts
- (hall)/page.tsx
- Base TSConfig
- Amplify Build Spec
- rooms/types.ts
- xdog.ts
- Placement
- import-fishing-assets.mjs
- Water.tsx
- Worker Package Manifest
- Public Asset Manifest
- layout.ts
- features/economy/index.ts
- compose-atelier.mjs
- AtelierRoom
- import-hall-assets.mjs
- slots/store.ts
- economy/store.ts
- FishingView.tsx
- room.ts
- minimap.ts
- react
- domain/guestboard.ts
- Sound Effect Assets
- art-cache.ts
- Custom HTTP Headers
- Sharp Layer Package
- wallet/body.ts
- wire.ts
- npc-layer.ts
- Confirmed issues
- epoch.ts
- Visits SQL Schema
- Bunny Walk Sprites
- Room Mockup Settings
- Service Worker Caching
- HallCallbacks
- import-landing-assets.mjs
- createPresence
- members
- Frame Window Asset
- wander.ts
- presence/package.json
- createAtelierRoom
- Asset pipeline: fast loading without losing sharpness
- Guest Board SQL Schema
- Landscape Frame Asset
- ClosetView.tsx
- Bug Reports SQL Schema
- Vitals SQL Schema
- DoorEditor
- snapshot.ts
- pond/room.ts
- actions.ts
- Run-Once Schema
- Atelier.tsx
- RevealCard.tsx
- wardrobe.ts
- MirrorView.tsx
- claim.ts
- json
- graftCostume
- pondgame/lib/api.ts
- worker/tsconfig.json
- core/tsconfig.json
- rig.ts
- How to Design for Failures — ByteByteGo Newsletter
- Worker instructions — DSH headless agents
- Backend
- catalog.ts
- Costume gallery doorway
- domain/sketch.ts
- Fishing forest: painted asset pass
- Audio
- .claude/CLAUDE.md
- The Costume Atelier
- messages.ts
- Tasks
- createStage
- sketchguess/lib/api.ts
- presence/tsconfig.json
- rules.ts
- tsconfig.test.json
- lib/presence.ts
- paintings/page.tsx
- next
- .webSocketMessage
- cat.ts
- Multiplayer ("other visitors") — plan v2 (Cloudflare)
- Conn
- room-places.ts
- bug-reports.ts
- studio/page.tsx
- features/rooms/doors.ts
- hang-tag.ts
- The Moonlit Pond — design
- Pond rework
- createStage
- Orchestration contract — you plan, DSH workers execute
- tables.ts
- Tiny Museum v1 · Curator Letters
- useBackgroundMusic.ts
- FilesystemStorage
- SlotDef
- vitals.ts
- run.ts
- HelmShare
- Walker
- BugReportSheet.tsx
- worker/src/index.ts
- Curating the paintings (2026-11-07)
- placements.ts
- Message
- a/[slug]/page.tsx
- import-home-assets.mjs
- getStorage
- Lobby
- defaultStore
- playwright
- wander.test.ts
- mail.ts
- Low
- Atelier: the dressing mirror, and show-don't-tell keeping
- wardrobe.test.ts
- confirm/page.tsx
- PerfMeter
- ref_node_assert
- Medium
- visits.ts
- walk
- protocol.ts
- Local end-to-end stress test — 2026-11-06
- LandingFx
- schedule.test.ts
- Storyline (draft, saved 2026-11-17)
- backdrop.ts
- bake-pond-path.mjs
- pond-photos.ts
- createPondRoom
- draw.py
- visits/page.tsx
- createPixelRatioGovernor
- SyncStore
- scripts
- Monets Lily Pond: exploration, UX and multiplayer QA
- S3Storage
- CodesSection.tsx
- env.ts
- DoorRef
- pond-format.ts
- Wardrobe
- personal/room.ts
- 4. Transport: Cloudflare Durable Objects
- atelier.ts
- npcs/README.md
- doorsOf
- nearby.ts
- AtelierActions
- query
- ArtCache
- app/layout.tsx
- Open rooms and the tip jar (design, 2026-11-21)
- createHallRoom
- doorRoom
- roomKit
- TreeSparkles
- Building it
- npc-sheet.cjs
- PondRulesProps
- Minimap
- doors.sql
- presence/src/index.ts
- Notes
- boundedCameraX
- painting-open
- icon-basket
- bunny-left
- bunny-right
- icon-home
- ticket

## God Nodes (most connected - your core abstractions)
1. `react` - 93 edges
2. `useSound()` - 88 edges
3. `json()` - 77 edges
4. `PersonalRoom()` - 75 edges
5. `query()` - 72 edges
6. `hit()` - 63 edges
7. `limited()` - 57 edges
8. `FishingView()` - 50 edges
9. `three` - 49 edges
10. `next` - 48 edges

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

## Communities (230 total, 36 thin omitted)

### Community 0 - "join-room.ts"
Cohesion: 0.06
Nodes (28): getWalletSnapshot(), Attachment, Carried, CarriedState, Character, Look, Perch, Pose (+20 more)

### Community 1 - "Traversal"
Cohesion: 0.08
Nodes (11): JumpPose, clamp(), fixture(), jump(), Traversal, MAX_CATCH_UP_SECONDS, MAX_STEP_SECONDS, movementSteps() (+3 more)

### Community 2 - "SketchGuess.tsx"
Cohesion: 0.07
Nodes (42): PlaceInfo, BunnyArtist(), BunnyMood, Pencil(), POSES, bestKeyFor(), BURST, clueUrl() (+34 more)

### Community 3 - "src/rooms/doors.ts"
Cohesion: 0.10
Nodes (33): hallDoorSpan(), ENTRANCE, guideX(), linesOf(), PIXELS, REASONS, DoorsRow, parsed() (+25 more)

### Community 4 - "pond/art.ts"
Cohesion: 0.14
Nodes (22): ArtByRoom, colorAt(), decoded(), disposePondArt(), EDGE_BAND, EDGE_BANDS, EDGE_OVERLAP, edgeTexture() (+14 more)

### Community 5 - "round.ts"
Cohesion: 0.15
Nodes (28): deltaE(), GAMUT_EPSILON, hexToOklab(), inGamut(), linearRgbToOklab(), linearToSrgb(), Oklab, oklabToLinearRgb() (+20 more)

### Community 6 - "floor.ts"
Cohesion: 0.13
Nodes (34): clone(), closestOnSegment(), contains(), cross(), crossVec(), depthAtY(), depthBounds(), depthT() (+26 more)

### Community 7 - "Core Asset Manifest"
Cohesion: 0.05
Nodes (41): artworks, audio, file, megabytes, seconds, sourceName, startedAt, bunny (+33 more)

### Community 8 - "scene/assets.ts"
Cohesion: 0.06
Nodes (53): AssetManifest, assetUrl(), bitmapTexture(), blankImage(), CAFE_CAT_FRAMES, CompressedLoader, elementTexture(), ENTRANCE_FILES (+45 more)

### Community 9 - "session.ts"
Cohesion: 0.16
Nodes (17): GET(), PaintingRow, POST(), UPLOADS_PER_ARTIST, dynamic, HomePage(), dynamic, RoomPage() (+9 more)

### Community 10 - "machine.ts"
Cohesion: 0.12
Nodes (37): FishingView(), CastMeter(), ReelMeter(), armCast(), BITE_WINDOW, biteGap(), CHARGE_PERIOD, chargePower() (+29 more)

### Community 11 - "Museum.tsx"
Cohesion: 0.09
Nodes (35): Loading(), ColorRecall(), ColorRecallProps, Phase, readBest(), AtelierLoading(), CoinFound, ColorRecall (+27 more)

### Community 12 - "Test Fakes and Helpers"
Cohesion: 0.12
Nodes (27): deferredFetch(), deviceSlot, FakeEvents, FakeStorage, fixture, fixtureB, fixtureRegistry, fixtureRegistryBoth (+19 more)

### Community 13 - "scene.ts"
Cohesion: 0.04
Nodes (30): MuseumProps, disposeDisplayTexture(), prefersAvif(), HiddenCoin, Helm, createNotes(), createPedestal(), Pedestal (+22 more)

### Community 14 - "cozy.ts"
Cohesion: 0.06
Nodes (58): alphaCanvas(), ATELIER_PROPS, AtelierImage, atticWindowCanvas(), bareBulbCanvas(), boardsCanvas(), canvasTexture(), ceilingGeometry() (+50 more)

### Community 15 - "logic.ts"
Cohesion: 0.08
Nodes (56): errorReason(), Job, Offer, overDrawer(), PersonalRoom(), canPlaceNew(), carriedTo(), carryEnd() (+48 more)

### Community 16 - "join-room.ts"
Cohesion: 0.06
Nodes (55): ChatButton(), REFUSED, appendChatMessage(), CHAT_HISTORY_LIMIT, CHAT_HISTORY_WINDOW_MS, chatHistoryKey(), ChatMessage, ChatStorage (+47 more)

### Community 17 - "schedule.ts"
Cohesion: 0.07
Nodes (55): addDwellEmotes(), addEmote(), addGap(), addStand(), addWalk(), along(), buildRoomTable(), buildStayPlan() (+47 more)

### Community 18 - "AtelierKeeps.tsx"
Cohesion: 0.05
Nodes (46): PresencePreviewPage(), AccountHost(), AccountSheet, AccountSheet(), continueAnyway(), doSignOut(), runDelete(), runName() (+38 more)

### Community 19 - "amplify/package.json"
Cohesion: 0.08
Nodes (26): amplifyDir, backend, everyMinutes, mediaBucket, missing, repoRoot, REQUIRED, setting() (+18 more)

### Community 20 - "ref_node_assert"
Cohesion: 0.15
Nodes (9): shape(), hangGarland(), garlandRibbon(), at(), GarlandShape, Ribbon, sag(), shape (+1 more)

### Community 21 - "prepare-models.mjs"
Cohesion: 0.09
Nodes (28): paintedCostume(), BODIES, bruce, BRUCE_FIT, BRUCE_PLACE, bunny, CARDIGAN, closedWaist() (+20 more)

### Community 22 - "progress.ts"
Cohesion: 0.06
Nodes (71): BACKDROP_STYLE, MoreArrow(), NavArrow(), Props, SLIDE, Walkthrough(), XIcon(), decodedFrames (+63 more)

### Community 23 - "core/package.json"
Cohesion: 0.06
Nodes (40): dependencies, @aws-sdk/client-s3@^3.1121.0, @aws-sdk/s3-request-presigner@^3.1121.0, bcryptjs@^2.4.3, obscenity@^0.4.6, pg@^8.13.1, sharp@^0.33.5, thumbhash@^0.1.1 (+32 more)

### Community 24 - "pond-boards.ts"
Cohesion: 0.07
Nodes (45): ALLOWED, PER_VISITOR, POST(), POST(), POST(), GET(), PER_VISITOR, BOARDS (+37 more)

### Community 25 - "handlers.ts"
Cohesion: 0.11
Nodes (26): handleDerivatives(), handleRenderDisplay(), handleSealEpoch(), renderPieceFrame(), renderPieceSketch(), Job, FRAME_FORMAT, FRAME_VERSION (+18 more)

### Community 26 - "rooms.ts"
Cohesion: 0.12
Nodes (26): artist(), member(), piece(), randomId(), personalRoomFor(), publish(), restartInCloset(), RoomAccess (+18 more)

### Community 27 - "PondRoom.tsx"
Cohesion: 0.06
Nodes (40): Loading(), metadata, PondPage(), Minigame, MINIGAMES, PondGame(), GLYPHS, PearlIcon() (+32 more)

### Community 28 - "ambience.ts"
Cohesion: 0.12
Nodes (29): blade(), bloom(), BLOOMS, createPondAmbience(), update(), fishTexture(), frond(), FRONT_ROWS (+21 more)

### Community 29 - "core/src/index.ts"
Cohesion: 0.04
Nodes (129): GET(), CatchExtra, COLUMNS, insertCatch(), member(), namedMember(), randomId(), StatePatch (+121 more)

### Community 30 - "Web Package Dependencies"
Cohesion: 0.07
Nodes (35): dependencies, embla-carousel-react@^8.6.0, motion@^13.1.1, next@^15.0.3, react@^19.0.0, react-dom@^19.0.0, swr@^2.5.1, three@^0.169.0 (+27 more)

### Community 31 - "Gamifying Tiny Museum — genre direction & engagement research"
Cohesion: 0.10
Nodes (19): 0.1 The core experience, 0.2 Systems that make gamification cheap to build, 0.3 Constraints that shape any recommendation, 0. What the game is today (the deep dive), 1.1 The landscape (seven candidates, with verdicts), 1.2 Recommendation: a **cozy gallery life-sim** — "the gallery you live in", 1.3 The five design pillars the genre implies, 1. Genre direction (+11 more)

### Community 32 - "Item"
Cohesion: 0.14
Nodes (3): Room, Presence, Item

### Community 33 - "logic.ts"
Cohesion: 0.07
Nodes (43): stampLabel(), DecorDrawer, DecorDrawerProps, SLOT_LABELS, Tab, TABS, HallArranger(), HallArrangerProps (+35 more)

### Community 34 - "risk.ts"
Cohesion: 0.12
Nodes (33): Hud(), HudProps, HudWagerChip, WagerPicker(), chooseTier(), stepStake(), WagerPickerProps, CastOptions (+25 more)

### Community 35 - "amplify/tsconfig.json"
Cohesion: 0.20
Nodes (9): compilerOptions, module, moduleResolution, noUnusedLocals, noUnusedParameters, exclude, extends, include (+1 more)

### Community 36 - "5. Customization menu — what other people are doing"
Cohesion: 0.12
Nodes (16): 1. The target: what "Claude Opus 5.5" actually means, 2. Where your harness stands today (live config I read), 3. The honest gap model, 4. Quality levers, ranked by leverage, 5. Customization menu — what other people are doing, 6. Recommended starting kit for *your* profile, 7. What I can apply for you right now (needs your go-ahead), A. Prompt & persona (most common quality customizations) (+8 more)

### Community 37 - "locations.ts"
Cohesion: 0.14
Nodes (31): discardLocation(), hangableOnly(), hasUnpublished(), inUse(), locationStates(), nudgeInRow(), OWNER, placePainting() (+23 more)

### Community 38 - "wallet.ts"
Cohesion: 0.07
Nodes (48): member(), now, piece(), randomId(), today, GalleryPiece, hangPiece(), MAX_STANDS (+40 more)

### Community 39 - "Web TSConfig"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 40 - "Root Package Manifest"
Cohesion: 0.13
Nodes (19): description, devDependencies, concurrently@^9.1.0, esbuild@^0.24.0, ktx2-encoder@^0.6.0, maxrects-packer@^2.7.3, @types/node@^22.9.0, typescript@^5.6.3 (+11 more)

### Community 41 - "pond-api.ts"
Cohesion: 0.14
Nodes (30): AlbumPanel(), remove(), CameraView, openCamera(), keep(), buyPondBait(), claimPondBounty(), deletePondPhoto() (+22 more)

### Community 42 - "hall/room.ts"
Cohesion: 0.04
Nodes (62): Assets, Scenery, CUTS, disposeBoards(), Mark, plane(), ROPE_CUTS, ropeSlices() (+54 more)

### Community 43 - "(hall)/page.tsx"
Cohesion: 0.10
Nodes (30): Loading(), dynamic, Hall(), MuseumPage(), [BRAND_OWNER, ...BRAND_REST], CurrentlyShowing(), Decor(), dynamic (+22 more)

### Community 44 - "Base TSConfig"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, lib, module, moduleResolution (+9 more)

### Community 45 - "Amplify Build Spec"
Cohesion: 0.12
Nodes (16): applications, appRoot, backend, frontend, baseDirectory, files, phases, commands (+8 more)

### Community 46 - "rooms/types.ts"
Cohesion: 0.04
Nodes (35): coverFloorTransition(), CharacterSprites, CameraRig, createRoomPassage(), fixture(), Pose, RoomOptions, createPerfMeter() (+27 more)

### Community 47 - "xdog.ts"
Cohesion: 0.31
Nodes (7): renderSketch(), blur(), kernel(), toGray(), XDOG_DEFAULTS, xdogInk(), XdogOptions

### Community 48 - "Placement"
Cohesion: 0.04
Nodes (21): Carry, PersonalRoomProps, DecorController, GhostOptions, HighlightArea, PlacementLayer, PlacementTheme, Admin mode (gamma) (+13 more)

### Community 49 - "import-fishing-assets.mjs"
Cohesion: 0.10
Nodes (12): CANVAS, clear, FONT, FRAME, heights, layout, lossless, manifest (+4 more)

### Community 50 - "Water.tsx"
Cohesion: 0.07
Nodes (38): AmbientShadow, box(), BUCKET, bunnyBox(), easeOut(), Glint, LEFT_STYLE, lineColour() (+30 more)

### Community 51 - "Worker Package Manifest"
Cohesion: 0.14
Nodes (14): dependencies, @tiny/core@*, exports, ./lambda, @tiny/core, main, name, private (+6 more)

### Community 52 - "Public Asset Manifest"
Cohesion: 0.12
Nodes (15): artworks, bunny, size, floor, size, fonts, icon-no-photos, size (+7 more)

### Community 53 - "layout.ts"
Cohesion: 0.17
Nodes (13): cafeAfterIndex(), computeLayout(), clear(), placeCafe(), cutRooms(), DoorSpan, HALL_DOOR_FOOT, HallRoomKind (+5 more)

### Community 54 - "features/economy/index.ts"
Cohesion: 0.14
Nodes (19): CoinToast(), Toast, Purse(), Stamp(), WalletProvider(), serverSnapshot, useEarnEvents(), useWallet() (+11 more)

### Community 55 - "compose-atelier.mjs"
Cohesion: 0.12
Nodes (10): body, dressLayer, dressWidth, floralWidth, hanger, MANNEQUIN_CANVAS, mask, root (+2 more)

### Community 57 - "import-hall-assets.mjs"
Cohesion: 0.13
Nodes (11): BASEBOARD, CURTAIN, drop, EXPECTED, manifest, manifestPath, masters, root (+3 more)

### Community 58 - "slots/store.ts"
Cohesion: 0.13
Nodes (17): ANON_PREFIX, anonKey(), deviceKey(), isMemberSlotKey(), listKeys(), MEMBER_KEY, memberKey(), memberPrefix() (+9 more)

### Community 59 - "economy/store.ts"
Cohesion: 0.10
Nodes (44): CARRY_CAP, carryAdd(), CarryEntry, carryPrune(), carryRemove(), chunk(), tzOffsetNow(), outboxDue() (+36 more)

### Community 60 - "FishingView.tsx"
Cohesion: 0.13
Nodes (21): CAST_ERRORS, coarsePointer(), initialEasyReel(), isTyping(), LOST, Toast, vibrate(), CastPrompt (+13 more)

### Community 61 - "room.ts"
Cohesion: 0.14
Nodes (29): admitted(), Attachment, farewell(), GHOST_MS, HELLO_TIMEOUT_MS, holdsOf(), homeOf(), MAX_WAITING_PER_IP (+21 more)

### Community 62 - "minimap.ts"
Cohesion: 0.08
Nodes (35): place(), createMinimap(), draw(), drawRoom(), floors(), follow(), sketchOf(), doorPoint() (+27 more)

### Community 63 - "react"
Cohesion: 0.06
Nodes (54): BugReportSheet(), openBugReport(), fitWidth(), HelpGuide(), HelpGuideProps, POINTER_STEPS, TOUCH_STEPS, MinigameFrameProps (+46 more)

### Community 64 - "domain/guestboard.ts"
Cohesion: 0.09
Nodes (35): BoardScreen(), BoardScreenProps, ComposeScreen(), ComposeScreenProps, blankDraft(), GuestBoard(), GuestBoardProps, View (+27 more)

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

### Community 69 - "wallet/body.ts"
Cohesion: 0.36
Nodes (9): baitIdOf(), integerOffset(), isRecord(), itemIdOf(), MAX_CLAIM_BATCH, ParsedWalletClaim, parseWalletClaim(), routeBanned() (+1 more)

### Community 70 - "wire.ts"
Cohesion: 0.14
Nodes (7): INTERPOLATION_DELAY_MS, PEER_TIMEOUT_MS, PeerTable, positionAt(), Sample, look, Peer

### Community 71 - "npc-layer.ts"
Cohesion: 0.09
Nodes (42): GuideTalk(), createDoorGuides(), HallGuide, PROJECTED, BY_ID, CAST, castMember(), FRAME (+34 more)

### Community 72 - "Confirmed issues"
Cohesion: 0.11
Nodes (18): Confirmed issues, E2E-002 — Valid edge placement rejected through floating-point precision, E2E-003 — One owned prop can be placed multiple times, E2E-004 — Reload before autosave silently loses the latest placement, E2E-005 — Failed save and failed Done have no visible mobile explanation, E2E-006 — Restoring connectivity does not retry a failed draft save, E2E-007 — Keyboard activation cannot place drawer items, E2E-008 — Creating an account from My Room leaves the signed-in user on the sign-in prompt (+10 more)

### Community 73 - "epoch.ts"
Cohesion: 0.22
Nodes (15): GET(), intParam(), GET(), sketchPool, unavailable(), currentEpoch(), ensureEpoch(), epochById() (+7 more)

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

### Community 79 - "import-landing-assets.mjs"
Cohesion: 0.13
Nodes (9): socket(), CAT, drop, EXPECTED, manifest, manifestPath, masters, root (+1 more)

### Community 80 - "createPresence"
Cohesion: 0.16
Nodes (14): createPresence(), drop(), heartbeat(), maybeSend(), onPageHide(), receive(), scheduleRetry(), send() (+6 more)

### Community 81 - "members"
Cohesion: 0.11
Nodes (28): coin_claims, coin_claims_daily, wallet_bait, wallet_items, wallets, member_sessions, member_sessions_member, member_slots (+20 more)

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
Cohesion: 0.44
Nodes (15): aspectOf(), createAtelierRoom(), buildCollection(), form(), buildEntrance(), buildMirror(), buildRoom(), buildWardrobe() (+7 more)

### Community 86 - "Asset pipeline: fast loading without losing sharpness"
Cohesion: 0.22
Nodes (8): Asset pipeline: fast loading without losing sharpness, Character rigs and the Costume Atelier, Completed, Ground rules, Phase 1: fingerprinted files at 2x and 3x, Phase 2: texture atlases for the hall sprites, Phase 3: KTX2 (Basis Universal), built and switched off, Phase 4: ThumbHash placeholders for paintings

### Community 87 - "Guest Board SQL Schema"
Cohesion: 0.67
Nodes (3): guest_notes, guest_notes_visible, rate_limits

### Community 88 - "Landscape Frame Asset"
Cohesion: 0.67
Nodes (3): frameLandscape, size, window

### Community 89 - "ClosetView.tsx"
Cohesion: 0.14
Nodes (26): ClosetView(), close(), onKeyDown(), shuffle(), tapMiddle(), wearAt(), LISTS, PLACE (+18 more)

### Community 93 - "DoorEditor"
Cohesion: 0.22
Nodes (16): DoorEditor(), add(), apply(), commitSlide(), nudge(), pick(), pointerDown(), pointerUp() (+8 more)

### Community 94 - "snapshot.ts"
Cohesion: 0.23
Nodes (15): snap(), composeJpeg(), copyCanvas(), grabLayers(), Layer, loadImage(), paint(), px() (+7 more)

### Community 95 - "pond/room.ts"
Cohesion: 0.10
Nodes (25): FAR_LIFT, FAR_SCALE, liftAt(), pathHalfWidth(), pathX(), PondPath, PROP_DEPTH, scaleAt() (+17 more)

### Community 96 - "actions.ts"
Cohesion: 0.11
Nodes (38): dynamic, back(), deleteGuestNoteAction(), deletePieceAction(), discardDoorsAction(), discardLocationAction(), isThrottled(), PLACE_ERRORS (+30 more)

### Community 104 - "Atelier.tsx"
Cohesion: 0.16
Nodes (19): AtelierPage(), dynamic, metadata, ArtistCard(), Atelier(), leave(), CHANGE_SOUND, sync() (+11 more)

### Community 105 - "RevealCard.tsx"
Cohesion: 0.11
Nodes (17): CONFETTI_COLORS, ConfettiPiece, makeConfetti(), RevealCard(), TIER_MS, useCountUp(), LostReason, chainOffer (+9 more)

### Community 106 - "wardrobe.ts"
Cohesion: 0.16
Nodes (18): allowedCharacter(), OwnedSnapshot, owns(), walletReady(), keepStamps(), StampState, kiki, otter (+10 more)

### Community 107 - "MirrorView.tsx"
Cohesion: 0.16
Nodes (14): Wheel(), onPointerUp(), trapTab(), MIRROR_SRC, MirrorView(), close(), move(), onKeyDown() (+6 more)

### Community 108 - "claim.ts"
Cohesion: 0.16
Nodes (19): buildClaim(), BuiltClaim, ClaimRequest, EarnDetail, GameSource, newRunId(), now, OUTBOX_CAP (+11 more)

### Community 109 - "json"
Cohesion: 0.06
Nodes (98): POST(), PER_MEMBER, PUT(), POST(), GET(), GLOBAL, PER_IP, POST() (+90 more)

### Community 110 - "graftCostume"
Cohesion: 0.27
Nodes (14): canvasFit(), compose(), graftCostume(), copyAccessor(), copyMaterial(), copyMesh(), copyTexture(), copyView() (+6 more)

### Community 111 - "pondgame/lib/api.ts"
Cohesion: 0.18
Nodes (23): PondGameProps, RevealCardProps, buyPondBait(), castPond(), chainPondBait(), errorOf(), fetchPondState(), isRecord() (+15 more)

### Community 112 - "worker/tsconfig.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 113 - "core/tsconfig.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 114 - "rig.ts"
Cohesion: 0.04
Nodes (80): CrowdPreviewPage(), RigPreviewPage(), CrowdPreview(), draw(), KINDS, Stats, Window, NEXT (+72 more)

### Community 115 - "How to Design for Failures — ByteByteGo Newsletter"
Cohesion: 0.40
Nodes (4): How to Design for Failures — ByteByteGo Newsletter, Preview, What the article covers, Where the paywall starts

### Community 116 - "Worker instructions — DSH headless agents"
Cohesion: 0.40
Nodes (4): graphify-first codebase navigation, Keep the graph current, Product and design direction, Worker instructions — DSH headless agents

### Community 117 - "Backend"
Cohesion: 0.50
Nodes (3): AWS prerequisites, Backend, Deploying by hand

### Community 118 - "catalog.ts"
Cohesion: 0.16
Nodes (18): cleanNow(), confirmClean(), tidyWithBroom(), CatalogItem, CatalogKind, FREE_CHARACTERS, ITEMS, ItemSlot (+10 more)

### Community 119 - "Costume gallery doorway"
Cohesion: 0.50
Nodes (3): Costume gallery doorway, Curtain colour edit, Prompt

### Community 120 - "domain/sketch.ts"
Cohesion: 0.11
Nodes (25): listPieces(), pieceImageUrl(), PieceRow, toPieceDto(), GalleryRow, planSketchRound(), SKETCH_CHOICES, SketchCandidate (+17 more)

### Community 121 - "Fishing forest: painted asset pass"
Cohesion: 0.10
Nodes (18): Assets, Bruce's collection refresh (2026-11-08), Fishing forest illustrations, Made by hand (not touched by the script), Main hall v2 (2026-11-10), Monets Lily Pond (2026-11-08), 1. Forest doorway, 2. Woodland noticeboard (+10 more)

### Community 122 - "Audio"
Cohesion: 0.50
Nodes (3): Audio, Pond, personal room and MP3 player music, UI effects (`ui/`)

### Community 124 - "The Costume Atelier"
Cohesion: 0.13
Nodes (14): Adding a character, Adding a costume, Art not supplied as files, Bruce's Chronicles, Code, Costume fit review, Fitting clothes to other characters, Floral collection (+6 more)

### Community 125 - "messages.ts"
Cohesion: 0.36
Nodes (6): checkMessage(), INVISIBLE, MESSAGE_MAX, MessageCheck, normalizeMessage(), hasProfanity()

### Community 126 - "Tasks"
Cohesion: 0.11
Nodes (19): aspectOf(), createPlacementLayer(), drawOutline(), dropGhosts(), dropHelper(), extrasFor(), silhouette(), sizeOf() (+11 more)

### Community 127 - "createStage"
Cohesion: 0.28
Nodes (11): FLICK, flickDirection(), isUpwardFlick(), createNearby(), createStage(), closeEntry(), enter(), handlePointerUp() (+3 more)

### Community 128 - "sketchguess/lib/api.ts"
Cohesion: 0.15
Nodes (16): sameOriginUrl(), PreparedGame, decodeImage(), fetchBitmap(), fetchRound(), guarded(), InkMap, LoadedRound (+8 more)

### Community 129 - "presence/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, types, exclude, extends, include, ../../tsconfig.base.json

### Community 130 - "rules.ts"
Cohesion: 0.16
Nodes (17): localDay(), at(), EXCHANGE_DAILY_STAMPS, EXCHANGE_PEARLS_PER_STAMP, exchangeClaimKey(), GAME_DAILY_CAP, GameId, GAMES (+9 more)

### Community 131 - "tsconfig.test.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 132 - "lib/presence.ts"
Cohesion: 0.09
Nodes (22): Outcome, Entry, Connect, fetchTicket, HEARTBEAT_MS, HIDDEN_LIMIT_MS, RETRY_MS, sameLook() (+14 more)

### Community 133 - "paintings/page.tsx"
Cohesion: 0.16
Nodes (15): dynamic, PaintingsPage(), updatePieceAction(), EditedPainting, isLink(), PaintingEditor(), upload(), Phase (+7 more)

### Community 134 - "next"
Cohesion: 0.16
Nodes (10): config, SECURITY_HEADERS, StudioLayout(), Badge(), Icon(), ICONS, StudioNav(), countOpenBugReports() (+2 more)

### Community 135 - ".webSocketMessage"
Cohesion: 0.44
Nodes (3): attachmentOf(), Room, sendTo()

### Community 136 - "cat.ts"
Cohesion: 0.32
Nodes (7): between(), CAT, Edge, EDGES, runLandingCat(), choosePeeker(), peek()

### Community 137 - "Multiplayer ("other visitors") — plan v2 (Cloudflare)"
Cohesion: 0.15
Nodes (12): 0. Summary, 10. Decisions, 1. Product contract changes (approved 2026-10-31), 2. What already exists that this builds on, 3.1 Generated names (everyone has one), 3. Names, 5.1 Emotes (v1), 5. Protocol (`packages/core/src/presence/protocol.ts`) (+4 more)

### Community 138 - "Conn"
Cohesion: 0.27
Nodes (5): send(), connectWebSocket(), SocketHandlers, Conn, message()

### Community 139 - "room-places.ts"
Cohesion: 0.13
Nodes (26): HallLayout, atelierRoomInfo(), atelierX(), copy(), FurniturePlacement, hallCache, hallRoomInfo(), onGround() (+18 more)

### Community 140 - "bug-reports.ts"
Cohesion: 0.09
Nodes (33): POST(), GET(), POST(), rateLimitedResponse(), rejectedResponse(), BugReport, BugReportDto, BugReportRateLimited (+25 more)

### Community 141 - "studio/page.tsx"
Cohesion: 0.22
Nodes (14): HangPage(), dynamic, StudioHome(), nudgeInRowAction(), AtelierFrame(), Frame(), form(), HangBoard() (+6 more)

### Community 142 - "features/rooms/doors.ts"
Cohesion: 0.20
Nodes (12): MuseumLayout(), museumDoors(), setMuseumDoors(), EXITS, isDoor(), linkedDoor(), ROOM_PATH, MuseumDoors() (+4 more)

### Community 143 - "hang-tag.ts"
Cohesion: 0.14
Nodes (7): CARD, createHangTag(), HangTag, HangTagStyle, HOLE, KNOT, What goes, and what replaces it

### Community 144 - "The Moonlit Pond — design"
Cohesion: 0.09
Nodes (22): Art the pond needs from the artist, Build contract (decided 2026-11-07), Build phases, Collection and goals, Done, Done, Guardrails, Leaderboards (+14 more)

### Community 145 - "Pond rework"
Cohesion: 0.18
Nodes (10): Baits, Client, Decisions, Done, Notes, Pond rework, Server, Species (+2 more)

### Community 146 - "createStage"
Cohesion: 0.19
Nodes (15): initialize(), aim(), drawFrame(), handleClick(), handlePointerDown(), handlePointerMove(), isResting(), prefetchNearDoors() (+7 more)

### Community 147 - "Orchestration contract — you plan, DSH workers execute"
Cohesion: 0.29
Nodes (6): Briefing a worker, Budget hygiene, graphify, Orchestration contract — you plan, DSH workers execute, The worker, When not to delegate

### Community 148 - "tables.ts"
Cohesion: 0.09
Nodes (35): FrameShape, BaitTray(), BaitTrayProps, debugSpecies(), debugTokens(), debugVariant(), GuestRollOptions, guestTreasure() (+27 more)

### Community 149 - "Tiny Museum v1 · Curator Letters"
Cohesion: 0.17
Nodes (11): Letter 0 · Clean up your room, Letter 1 · Place your first decoration, Letter 2 · Visit the first gallery, Letter 3 · Play a mini-game, Letter 4 · Unlock an outfit or character, Letter 5 · Find the seasonal items, Letter 6 · Unlock the daily calendar, Letter 7 · The cliffhanger and email signup (+3 more)

### Community 150 - "useBackgroundMusic.ts"
Cohesion: 0.11
Nodes (27): BackgroundMusic, clampVolume(), isDocumentHidden(), Options, useBackgroundMusic(), VISIBILITY_EVENTS, EFFECTS, EffectSpec (+19 more)

### Community 152 - "SlotDef"
Cohesion: 0.14
Nodes (5): FakeServer, SlotState, serverSnapshot(), serverSnapshots, SlotDef

### Community 153 - "vitals.ts"
Cohesion: 0.16
Nodes (15): dynamic, format(), grade(), METRICS, PAGES, PerformancePage(), RANGES, DEVICES (+7 more)

### Community 154 - "run.ts"
Cohesion: 0.20
Nodes (7): admin, childEnv, client, database, fresh, migrations, target

### Community 157 - "BugReportSheet.tsx"
Cohesion: 0.23
Nodes (13): BugReportHost(), BugReportSheet, Status, collectContext(), inAppBrowser(), onOpenBugReport(), recentErrors, referrerHost() (+5 more)

### Community 158 - "worker/src/index.ts"
Cohesion: 0.28
Nodes (13): loop(), shutdown(), sleep(), sweepStale(), DrainResult, handler(), repairFrames(), repairUnframed() (+5 more)

### Community 159 - "Curating the paintings (2026-11-07)"
Cohesion: 0.20
Nodes (9): hang(), Curating the paintings (2026-11-07), Decided, How it is built, Testing, The fashion area's spots, The idea, The model (+1 more)

### Community 160 - "placements.ts"
Cohesion: 0.06
Nodes (29): createPlayerCard(), hide(), onPointerDown(), Door, doorOf(), PlayerCard, wallpaperOf(), cozyLevel (+21 more)

### Community 161 - "Message"
Cohesion: 0.21
Nodes (11): BugReportsPage(), dateFormat, dynamic, summary(), dateFormat, dynamic, GuestBoardPage(), SignIn() (+3 more)

### Community 162 - "a/[slug]/page.tsx"
Cohesion: 0.33
Nodes (6): ArtistPage(), dynamic, generateMetadata(), GET(), FollowForm(), getArtistPage()

### Community 163 - "import-home-assets.mjs"
Cohesion: 0.10
Nodes (17): file(), DOOR, DOOR_BACKDROP, drop, FURNITURE, manifest, manifestPath, masters (+9 more)

### Community 164 - "getStorage"
Cohesion: 0.15
Nodes (19): CONTENT_TYPES, GET(), POST(), UPLOADS_PER_ARTIST, PUT(), isHttpUrl(), ACCEPTED, createAssetFromUpload() (+11 more)

### Community 166 - "defaultStore"
Cohesion: 0.22
Nodes (17): buy(), ensureStarted(), isBuyReply(), memberChanged(), publish(), readSession(), undoAdminUnlock(), unlockEverything() (+9 more)

### Community 167 - "playwright"
Cohesion: 0.14
Nodes (9): [out, ...clicks], opener, [out, ...steps], kinds, order, [out, costume, phase = '0', kindsArg = 'bunny,cat,otter,bruce'], [, width, height], playwright@^1.63.0 (+1 more)

### Community 168 - "wander.test.ts"
Cohesion: 0.15
Nodes (10): NpcRoomInfo, NpcFrame, StayContext, BASE_JOB, context(), L_GROUND, mulberry32(), room() (+2 more)

### Community 169 - "mail.ts"
Cohesion: 0.19
Nodes (10): BRAND, confirmedFollowers(), handleNotifyFollowers(), ConsoleMailer, FileMailer, followConfirmation(), getMailer(), Mailer (+2 more)

### Community 170 - "Low"
Cohesion: 0.25
Nodes (8): 13. Pages that redirect or don't exist answer 200, 14. Error codes reveal which room slugs exist, 15. The name sign slides under the top-right buttons in Decorate, 16. Level-up celebrations can be farmed, 17. No hint of where things are after panning away, 18. Too many items is only discovered by the server, 19. Development-only: page payloads include the full room row, Low

### Community 171 - "Atelier: the dressing mirror, and show-don't-tell keeping"
Cohesion: 0.13
Nodes (14): Atelier: the dressing mirror, and show-don't-tell keeping, Build order, Built (2026-11-20), Decisions (2026-11-19), Follow-ups (2026-11-20), Goal, In the room, Keeping (+6 more)

### Community 172 - "wardrobe.test.ts"
Cohesion: 0.18
Nodes (9): createWardrobe(), enqueue(), reflect(), Options, bow, cardigan, dress, setup() (+1 more)

### Community 173 - "confirm/page.tsx"
Cohesion: 0.33
Nodes (7): ConfirmFollow(), dynamic, dynamic, Unsubscribe(), FollowNotice(), confirmFollow(), unsubscribe()

### Community 175 - "ref_node_assert"
Cohesion: 0.11
Nodes (31): defineSlot(), docBytes(), SLOTS, byAtThenKey(), encoded(), latest, mapOf(), maxNumber() (+23 more)

### Community 176 - "Medium"
Cohesion: 0.17
Nodes (12): 10. Long names run off the name sign, 11. The rooms API skips the stale-tab member check, 12. The bunny is dragged along while you pan in Decorate, 6. Failed saves are nearly invisible, and nothing retries, 7. Two tabs editing the same room overwrite each other, 8. The drawer's card row can't be scrolled on touch screens, Checked and fine, Medium (+4 more)

### Community 177 - "visits.ts"
Cohesion: 0.14
Nodes (23): state(), PER_VISITOR, POST(), flush(), startVisit(), visibleMs(), VisitState, count() (+15 more)

### Community 178 - "walk"
Cohesion: 0.16
Nodes (13): walk(), 1. What is in this bundle, 2. How the game draws the bunny today (read from the repo, not run), 3. The rig, 4. Suggested plan, 5. Blender-side work still to do (needs Blender; the author has it with an MCP bridge), 6. Open questions for the author, Handoff: move the Tiny Museum bunny from sprite frames to a rig (+5 more)

### Community 179 - "protocol.ts"
Cohesion: 0.12
Nodes (30): isCatalogItem(), isHome(), isItem(), isName(), isPid(), isSeq(), MAX_MESSAGE_BYTES, parseClientMessage() (+22 more)

### Community 180 - "Local end-to-end stress test — 2026-11-06"
Cohesion: 0.22
Nodes (7): Environment and coverage, Follow-up coverage, Issue index, Local end-to-end stress test — 2026-11-06, Measured load, Passing checks and interpretation limits, Test data and cleanup

### Community 181 - "LandingFx"
Cohesion: 0.20
Nodes (11): glowSprite(), LandingFx(), onClick(), onVisibility(), psst(), spawnMist(), tick(), Mist (+3 more)

### Community 182 - "schedule.test.ts"
Cohesion: 0.07
Nodes (30): RESIDENT_IDS, FloorSpot, Job, JOBS, NpcGround, Place, PlaceKind, ROOM_KINDS (+22 more)

### Community 183 - "Storyline (draft, saved 2026-11-17)"
Cohesion: 0.15
Nodes (12): Arc (soft, no fail state), Built so far, How it ties to what exists, Locked (2026-11-21, the owner), Next tasks (when picked up), Open questions, Premise, Revision (2026-11-21, the owner) (+4 more)

### Community 184 - "backdrop.ts"
Cohesion: 0.16
Nodes (12): createHallAmbience(), finish(), glowTexture(), HallAmbience, mulberry(), painted(), vignetteTexture(), Backdrop (+4 more)

### Community 185 - "bake-pond-path.mjs"
Cohesion: 0.21
Nodes (7): blank(), manifest, manifestPath, ORIGINAL_SOURCE, originalPath(), root, softened()

### Community 186 - "pond-photos.ts"
Cohesion: 0.24
Nodes (10): snapshot(), Checked against the mocks (2026-11-07), addPondPhoto(), AddPondPhotoResult, isJpeg(), listPondPhotos(), POND_PHOTO_LIMIT, POND_PHOTO_MAX_BYTES (+2 more)

### Community 187 - "createPondRoom"
Cohesion: 0.32
Nodes (13): createPondRoom(), approach(), busy(), finishWalk(), goTo(), leave(), move(), nearest() (+5 more)

### Community 189 - "visits/page.tsx"
Cohesion: 0.29
Nodes (9): amount(), duration(), dynamic, LANDMARKS, PAGES, RANGES, share(), VisitsPage() (+1 more)

### Community 190 - "createPixelRatioGovernor"
Cohesion: 0.33
Nodes (7): createPixelRatioGovernor(), reset(), stepTo(), PIXEL_RATIO_STEPS, pixelRatioSteps(), Renderer, governor()

### Community 191 - "SyncStore"
Cohesion: 0.17
Nodes (7): encodeStored(), parseStored(), readStored(), removeStored(), writeStored(), SyncStore, upgrade()

### Community 192 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, db:schema, deploy:backend, dev, dev:presence, dev:web, dev:worker (+6 more)

### Community 193 - "Monets Lily Pond: exploration, UX and multiplayer QA"
Cohesion: 0.29
Nodes (6): Browser and interaction coverage, Changes made from the walkthrough, Monets Lily Pond: exploration, UX and multiplayer QA, Multiplayer and load, Practical limits, Regression checks and cleanup

### Community 195 - "CodesSection.tsx"
Cohesion: 0.33
Nodes (8): createCodeAction(), deleteCodeAction(), CodeRow, CodesSection(), create(), remove(), ensureQrToken(), revokeQrToken()

### Community 196 - "env.ts"
Cohesion: 0.09
Nodes (14): bodyTextures, COATS, { json, bin }, manifest, maps, target, manifest, SCHEMA_DIR (+6 more)

### Community 198 - "pond-format.ts"
Cohesion: 0.06
Nodes (63): refreshWalletNow(), fetchPondFeed(), PondBoardId, PondBoardPeriod, PondBoardRow, PondBounties, PondFeedItem, PondLeaderboard (+55 more)

### Community 199 - "Wardrobe"
Cohesion: 0.22
Nodes (4): Props, ClothingItem, Layers, Wardrobe

### Community 200 - "personal/room.ts"
Cohesion: 0.09
Nodes (21): PersonalArt, createPersonalRoom(), light(), shade(), showArrangement(), signFilter(), DOOR_SIGN, gloomFor() (+13 more)

### Community 201 - "4. Transport: Cloudflare Durable Objects"
Cohesion: 0.25
Nodes (8): 4. Transport: Cloudflare Durable Objects, Decision (2026-10-31), Deploying, Identity cannot be forged, Local development and tests, Rooms and capacity, Shape of `apps/presence` (about 200 lines), main()

### Community 202 - "atelier.ts"
Cohesion: 0.05
Nodes (48): AtelierArt, AtelierDoor, AtelierImage, BuiltRoom, Cardigan, CARDIGAN_NAMES, Control, refresh() (+40 more)

### Community 204 - "doorsOf"
Cohesion: 0.47
Nodes (5): doorArtUrl(), loadDoorArt(), loadRoomDoorArt(), pending, DoorStyle

### Community 205 - "nearby.ts"
Cohesion: 0.18
Nodes (5): Nearby, NearbyReach, RoomSpan, reach, strip

### Community 207 - "query"
Cohesion: 0.07
Nodes (59): GET(), PER_IP, POST(), presenceUrl(), Code, How it plays, Other visitors, 3.2 Chosen names (members) (+51 more)

### Community 209 - "app/layout.tsx"
Cohesion: 0.09
Nodes (23): bethEllen, inspiratiq, metadata, notoSans, RootLayout(), sniglet, viewport, hasSound() (+15 more)

### Community 210 - "Open rooms and the tip jar (design, 2026-11-21)"
Cohesion: 0.29
Nodes (6): Built (2026-11-21), Decisions, Numbers (first pass, to tune), Open questions, Open rooms and the tip jar (design, 2026-11-21), Story hooks

### Community 211 - "createHallRoom"
Cohesion: 0.09
Nodes (27): createDoorPetals(), DoorPetals, mulberry(), Petal, petalTexture(), PondDoor, doorDefs(), doorsOf() (+19 more)

### Community 212 - "doorRoom"
Cohesion: 0.28
Nodes (7): DoorsPage(), dynamic, hallPaintings(), GuideTalk, HallPainting, DoorGuide, doorRoom

### Community 215 - "Building it"
Cohesion: 0.33
Nodes (6): 1. The registry and the table, 2. The studio's Location picker, 3. The rooms draw what is placed, 4. Credits, 5. Retiring self-serve artists, Building it

### Community 216 - "npc-sheet.cjs"
Cohesion: 0.31
Nodes (8): CFG, closeEye(), eraseMouth(), inpaint(), sample(), sharp, [src, out, cfgPath], warp()

### Community 221 - "presence/src/index.ts"
Cohesion: 0.67
Nodes (3): fetch(), Env, parseRoom()

### Community 225 - "painting-open"
Cohesion: 0.50
Nodes (4): file, kilobytes, seconds, painting-open

### Community 230 - "icon-basket"
Cohesion: 0.67
Nodes (3): icon-basket, file, vector

## Knowledge Gaps
- **5 isolated node(s):** `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1730 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **36 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `join-room.ts`, `SketchGuess.tsx`, `src/rooms/doors.ts`, `paintings/page.tsx`, `session.ts`, `Museum.tsx`, `Test Fakes and Helpers`, `studio/page.tsx`, `logic.ts`, `join-room.ts`, `AtelierKeeps.tsx`, `tables.ts`, `progress.ts`, `useBackgroundMusic.ts`, `SlotDef`, `PondRoom.tsx`, `BugReportSheet.tsx`, `Web Package Dependencies`, `logic.ts`, `risk.ts`, `defaultStore`, `pond-api.ts`, `(hall)/page.tsx`, `Water.tsx`, `LandingFx`, `features/economy/index.ts`, `slots/store.ts`, `FishingView.tsx`, `domain/guestboard.ts`, `CodesSection.tsx`, `pond-format.ts`, `app/layout.tsx`, `ClosetView.tsx`, `Atelier.tsx`, `RevealCard.tsx`, `MirrorView.tsx`, `rig.ts`?**
  _High betweenness centrality (0.086) - this node is a cross-community bridge._
- **What connects `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json` to the rest of the system?**
  _5 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `join-room.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.058823529411764705 - nodes in this community are weakly interconnected._
- **Why does `three` connect `hall/room.ts` to `join-room.ts`, `pond/art.ts`, `npc-layer.ts`, `scene/assets.ts`, `atelier.ts`, `scene.ts`, `rooms/types.ts`, `hang-tag.ts`, `cozy.ts`, `rig.ts`, `createHallRoom`, `prepare-models.mjs`, `backdrop.ts`, `ambience.ts`, `Web Package Dependencies`, `pond/room.ts`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Should `Traversal` be split into smaller, more focused modules?**
  _Cohesion score 0.08130081300813008 - nodes in this community are weakly interconnected._
- **Why does `useSound()` connect `react` to `SketchGuess.tsx`, `machine.ts`, `Museum.tsx`, `features/rooms/doors.ts`, `logic.ts`, `join-room.ts`, `AtelierKeeps.tsx`, `tables.ts`, `progress.ts`, `PondRoom.tsx`, `BugReportSheet.tsx`, `logic.ts`, `a/[slug]/page.tsx`, `risk.ts`, `pond-api.ts`, `LandingFx`, `features/economy/index.ts`, `FishingView.tsx`, `domain/guestboard.ts`, `pond-format.ts`, `npc-layer.ts`, `ClosetView.tsx`, `Atelier.tsx`, `MirrorView.tsx`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Should `SketchGuess.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07239819004524888 - nodes in this community are weakly interconnected._