# Graph Report - tiny-museum  (2026-11-05)

## Corpus Check
- 392 files · ~170,661 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 64 file(s) not represented in the graph (top: .avif 32, .glb 25, .css 3)

## Summary
- 3107 nodes · 7946 edges · 154 communities (130 shown, 24 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 150 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1fc72c1d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- builtUrl
- slots/store.ts
- SketchGuess.tsx
- actions.ts
- economy/store.ts
- domain/sketch.ts
- floor.ts
- Core Asset Manifest
- scene/assets.ts
- SyncStore
- rig.ts
- hitForVisitor
- Test Fakes and Helpers
- scene.ts
- cozy.ts
- jobs.ts
- stage.ts
- overlay.ts
- ref_node_assert
- Amplify Backend Config
- Item
- prepare-models.mjs
- SoundProvider.tsx
- core/package.json
- domain/guestboard.ts
- bug-report.ts
- Placement
- Museum.tsx
- wardrobe.test.ts
- scene.ts
- Web Package Dependencies
- Gamifying Tiny Museum — genre direction & engagement research
- wardrobe.ts
- confirm/page.tsx
- join-room.ts
- amplify/tsconfig.json
- 5. Customization menu — what other people are doing
- query
- core/src/index.ts
- Web TSConfig
- Root Package Manifest
- exports
- useSoundEffects.ts
- peers.ts
- Base TSConfig
- Amplify Build Spec
- Walkthrough.tsx
- Multiplayer ("other visitors") — plan v2 (Cloudflare)
- Fake Sync Server
- collage.ts
- placements.ts
- Worker Package Manifest
- Public Asset Manifest
- media/storage.ts
- handlers.ts
- compose-atelier.mjs
- messages.ts
- world.ts
- dependencies
- epoch.ts
- PondGame.tsx
- room.ts
- json
- ticket/route.ts
- Handoff: move the Tiny Museum bunny from sprite frames to a rig
- Sound Effect Assets
- react
- Custom HTTP Headers
- Sharp Layer Package
- HallArranger.tsx
- visits.ts
- rules.ts
- round.ts
- Tasks
- Visits SQL Schema
- Bunny Walk Sprites
- Room Mockup Settings
- Service Worker Caching
- HallCallbacks
- Lobby Scene Object
- createPresence
- members
- Frame Window Asset
- Painting Open Sound
- presence/package.json
- api.ts
- Asset pipeline: fast loading without losing sharpness
- Guest Board SQL Schema
- Landscape Frame Asset
- Basket Icon Asset
- Bug Reports SQL Schema
- Vitals SQL Schema
- Bunny Left Sprite
- Bunny Right Sprite
- Home Icon Asset
- Ticket Asset
- Run-Once Schema
- react
- PersonalRoom.tsx
- ticket.ts
- motion
- app/layout.tsx
- Conn
- FilesystemStorage
- members.ts
- worker/tsconfig.json
- core/tsconfig.json
- Tiny Museum
- How to Design for Failures — ByteByteGo Newsletter
- Worker instructions — DSH headless agents
- Backend
- protocol.ts
- Costume gallery doorway
- fishing.ts
- Assets
- audio/README.md
- .claude/CLAUDE.md
- personalRoomFor
- run.ts
- atelier.ts
- ensureEpoch
- features/economy/index.ts
- presence/tsconfig.json
- ReadScreen.tsx
- tsconfig.test.json
- GuestBoard
- Notes
- hall/room.ts
- AccountSheet.tsx
- .webSocketMessage
- remote-visitors.ts
- tab-turn.ts
- rooms.ts
- Cafe
- audience.ts
- join-room.ts
- DecorTray.tsx
- reveal.ts
- floor.test.ts
- VitalsReporter.tsx
- MinigameFrame
- hit
- ColorRecall.tsx
- 4. Transport: Cloudflare Durable Objects
- lib/presence.ts
- Other visitors
- createDecorController

## God Nodes (most connected - your core abstractions)
1. `query()` - 61 edges
2. `react` - 54 edges
3. `json()` - 45 edges
4. `next` - 41 edges
5. `SyncStore` - 41 edges
6. `three` - 36 edges
7. `hit()` - 35 edges
8. `queryOne()` - 34 edges
9. `createHallRoom()` - 33 edges
10. `HallScene` - 31 edges

## Surprising Connections (you probably didn't know these)
- `Code` --references--> `followOutfit()`  [INFERRED]
  docs/costume-atelier.md → apps/web/src/features/hall/scene/wardrobe.ts
- `7. Client module layout` --references--> `renderFrame()`  [INFERRED]
  docs/multiplayer-plan.md → apps/web/src/features/rooms/stage.ts
- `5.1 Emotes (v1)` --references--> `ScreenChrome()`  [INFERRED]
  docs/multiplayer-plan.md → apps/web/src/shared/components/ScreenChrome.tsx
- `2. How the game draws the bunny today (read from the repo, not run)` --references--> `loadScenery()`  [INFERRED]
  docs/bunny-rig-author-handoff.md → apps/web/src/features/hall/scene/assets.ts
- `Code` --references--> `createRigLayer()`  [INFERRED]
  docs/multiplayer.md → apps/web/src/features/hall/scene/rig.ts

## Import Cycles
- None detected.

## Communities (154 total, 24 thin omitted)

### Community 0 - "builtUrl"
Cohesion: 0.16
Nodes (19): Loading(), dynamic, Hall(), MuseumPage(), CurrentlyShowing(), dynamic, GUIDELINES, LandingPage() (+11 more)

### Community 1 - "slots/store.ts"
Cohesion: 0.14
Nodes (16): ANON_PREFIX, anonKey(), deviceKey(), isMemberSlotKey(), listKeys(), MEMBER_KEY, memberKey(), memberPrefix() (+8 more)

### Community 2 - "SketchGuess.tsx"
Cohesion: 0.08
Nodes (39): BunnyArtist(), BunnyMood, Pencil(), POSES, bestKeyFor(), BURST, clueUrl(), openingPlan() (+31 more)

### Community 3 - "actions.ts"
Cohesion: 0.05
Nodes (76): config, SECURITY_HEADERS, AnalyticsPage(), dynamic, BugReportsPage(), dateFormat, dynamic, summary() (+68 more)

### Community 4 - "economy/store.ts"
Cohesion: 0.07
Nodes (63): CARRY_CAP, carryAdd(), CarryEntry, carryPrune(), carryRemove(), chunk(), ClaimRequest, tzOffsetNow() (+55 more)

### Community 5 - "domain/sketch.ts"
Cohesion: 0.09
Nodes (30): listPieces(), pieceImageUrl(), PieceRow, toPieceDto(), getSketchRound(), planSketchRound(), SKETCH_CHOICES, SketchCandidate (+22 more)

### Community 6 - "floor.ts"
Cohesion: 0.21
Nodes (25): clone(), closestOnSegment(), contains(), cross(), crossVec(), DepthView, distanceSq(), dot() (+17 more)

### Community 7 - "Core Asset Manifest"
Cohesion: 0.05
Nodes (41): artworks, audio, file, megabytes, seconds, sourceName, startedAt, bunny (+33 more)

### Community 8 - "scene/assets.ts"
Cohesion: 0.07
Nodes (48): AssetManifest, assetUrl(), bitmapTexture(), blankImage(), CAFE_CAT_FRAMES, CompressedLoader, elementTexture(), ENTRANCE_FILES (+40 more)

### Community 9 - "SyncStore"
Cohesion: 0.16
Nodes (7): encodeStored(), parseStored(), readStored(), removeStored(), writeStored(), SyncStore, upgrade()

### Community 10 - "rig.ts"
Cohesion: 0.05
Nodes (59): CrowdPreviewPage(), RigPreviewPage(), CrowdPreview(), draw(), KINDS, Stats, Window, NEXT (+51 more)

### Community 11 - "hitForVisitor"
Cohesion: 0.16
Nodes (18): ALLOWED, POST(), POST(), GLOBAL, PER_IP, POST(), POST(), POST() (+10 more)

### Community 12 - "Test Fakes and Helpers"
Cohesion: 0.12
Nodes (27): deferredFetch(), deviceSlot, FakeEvents, FakeStorage, fixture, fixtureB, fixtureRegistry, fixtureRegistryBoth (+19 more)

### Community 13 - "scene.ts"
Cohesion: 0.10
Nodes (5): HiddenCoin, HallScene, markFirstPainting(), retryDelayMs(), wallSize()

### Community 14 - "cozy.ts"
Cohesion: 0.11
Nodes (21): createPersonalRoom(), PersonalArt, ATELIER_PROPS, AtelierImage, CozyArt, CozyBackdrop, cozyPropImageUrl(), cozyTheme (+13 more)

### Community 15 - "jobs.ts"
Cohesion: 0.23
Nodes (16): loop(), shutdown(), sleep(), sweepStale(), DrainResult, handler(), repairFrames(), repairUnframed() (+8 more)

### Community 16 - "stage.ts"
Cohesion: 0.04
Nodes (45): coverFloorTransition(), revealFloorTransition(), CharacterSprites, CameraRig, createPixelRatioGovernor(), PIXEL_RATIO_STEPS, createRoomPassage(), fixture() (+37 more)

### Community 17 - "overlay.ts"
Cohesion: 0.08
Nodes (10): ComingSoonNote, FunZoneSign, GiftShopSigns, GuestBoardNotes, LobbySigns, Placards, placeLabel(), toScreen() (+2 more)

### Community 18 - "ref_node_assert"
Cohesion: 0.09
Nodes (35): SlotState, mergeSlot(), fixtureRegistry, valid, defineSlot(), docBytes(), SlotDef, slotDef() (+27 more)

### Community 19 - "Amplify Backend Config"
Cohesion: 0.08
Nodes (26): amplifyDir, backend, everyMinutes, mediaBucket, missing, repoRoot, REQUIRED, setting() (+18 more)

### Community 20 - "Item"
Cohesion: 0.15
Nodes (3): Presence, Item, Refusal

### Community 21 - "prepare-models.mjs"
Cohesion: 0.07
Nodes (43): canvasFit(), compose(), graftCostume(), copyAccessor(), copyMaterial(), copyMesh(), copyTexture(), copyView() (+35 more)

### Community 22 - "SoundProvider.tsx"
Cohesion: 0.21
Nodes (7): StageOptions, RoomSound, SoundContext, SoundState, EffectName, STATIC_BASE, staticUrl()

### Community 23 - "core/package.json"
Cohesion: 0.16
Nodes (13): devDependencies, @types/bcryptjs@^2.4.6, @types/pg@^8.11.10, main, name, private, scripts, typecheck (+5 more)

### Community 24 - "domain/guestboard.ts"
Cohesion: 0.09
Nodes (33): POST(), GET(), POST(), rateLimitedResponse(), rejectedResponse(), BugContext, BugReport, BugReportDto (+25 more)

### Community 25 - "bug-report.ts"
Cohesion: 0.20
Nodes (15): BugReportHost(), BugReportSheet, BugReportSheet(), send(), Status, collectContext(), inAppBrowser(), onOpenBugReport() (+7 more)

### Community 26 - "Placement"
Cohesion: 0.13
Nodes (4): DecorController, PersonalRoomOptions, PlacementLayer, Placement

### Community 27 - "Museum.tsx"
Cohesion: 0.13
Nodes (26): motion@^13.1.1, Loading(), AtelierLoading(), CoinFound, ColorRecall, GameDesktop, GuestBoard, HallArranger (+18 more)

### Community 28 - "wardrobe.test.ts"
Cohesion: 0.09
Nodes (9): AtelierRoom, createWardrobe(), enqueue(), reflect(), bow, dress, navy, setup() (+1 more)

### Community 29 - "scene.ts"
Cohesion: 0.07
Nodes (24): disposeDisplayTexture(), HELM_PEDESTAL_FILE, prefersAvif(), createHiddenCoin(), AlphaMap, alphaMapFor(), alphaMaps, buildAlphaMap() (+16 more)

### Community 30 - "Web Package Dependencies"
Cohesion: 0.08
Nodes (32): dependencies, embla-carousel-react@^8.6.0, next@^15.0.3, react@^19.0.0, react-dom@^19.0.0, swr@^2.5.1, three@^0.169.0, thumbhash@^0.1.1 (+24 more)

### Community 31 - "Gamifying Tiny Museum — genre direction & engagement research"
Cohesion: 0.10
Nodes (19): 0.1 The core experience, 0.2 Systems that make gamification cheap to build, 0.3 Constraints that shape any recommendation, 0. What the game is today (the deep dive), 1.1 The landscape (seven candidates, with verdicts), 1.2 Recommendation: a **cozy gallery life-sim** — "the gallery you live in", 1.3 The five design pillars the genre implies, 1. Genre direction (+11 more)

### Community 32 - "wardrobe.ts"
Cohesion: 0.07
Nodes (47): AtelierPage(), metadata, allowedCharacter(), OwnedSnapshot, owns(), walletReady(), Atelier(), leave() (+39 more)

### Community 33 - "confirm/page.tsx"
Cohesion: 0.33
Nodes (7): ConfirmFollow(), dynamic, dynamic, Unsubscribe(), FollowNotice(), confirmFollow(), unsubscribe()

### Community 34 - "join-room.ts"
Cohesion: 0.20
Nodes (22): ChatButton(), REFUSED, announceNameChange(), emit(), getPeople(), isInRoom(), muted, on() (+14 more)

### Community 35 - "amplify/tsconfig.json"
Cohesion: 0.20
Nodes (9): compilerOptions, module, moduleResolution, noUnusedLocals, noUnusedParameters, exclude, extends, include (+1 more)

### Community 36 - "5. Customization menu — what other people are doing"
Cohesion: 0.12
Nodes (16): 1. The target: what "Claude Opus 5.5" actually means, 2. Where your harness stands today (live config I read), 3. The honest gap model, 4. Quality levers, ranked by leverage, 5. Customization menu — what other people are doing, 6. Recommended starting kit for *your* profile, 7. What I can apply for you right now (needs your go-ahead), A. Prompt & persona (most common quality customizations) (+8 more)

### Community 37 - "query"
Cohesion: 0.17
Nodes (17): revokeQrToken(), deletePiece(), GalleryPiece, MAX_STANDS, evaluatePublishBar(), publishArtist(), PublishCheck, PublishReport (+9 more)

### Community 38 - "core/src/index.ts"
Cohesion: 0.09
Nodes (43): member(), now, piece(), randomId(), today, BRAND, applyClaim(), buy() (+35 more)

### Community 39 - "Web TSConfig"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 40 - "Root Package Manifest"
Cohesion: 0.07
Nodes (35): description, devDependencies, concurrently@^9.1.0, esbuild@^0.24.0, ktx2-encoder@^0.6.0, maxrects-packer@^2.7.3, playwright@^1.63.0, @types/node@^22.9.0 (+27 more)

### Community 41 - "exports"
Cohesion: 0.15
Nodes (13): exports, ./brand, ./bugs, ./economy, ./guestboard, ./presence, ./presence/messages, ./presence/wire (+5 more)

### Community 42 - "useSoundEffects.ts"
Cohesion: 0.13
Nodes (18): EFFECTS, EffectSpec, FOOTSTEPS, SoundEffects, useSoundEffects(), gestured(), OPTIONS, applyMix() (+10 more)

### Community 43 - "peers.ts"
Cohesion: 0.09
Nodes (12): Entry, INTERPOLATION_DELAY_MS, PEER_TIMEOUT_MS, PeerTable, positionAt(), RemoteVisitor, Sample, look (+4 more)

### Community 44 - "Base TSConfig"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, lib, module, moduleResolution (+9 more)

### Community 45 - "Amplify Build Spec"
Cohesion: 0.12
Nodes (16): applications, appRoot, backend, frontend, baseDirectory, files, phases, commands (+8 more)

### Community 46 - "Walkthrough.tsx"
Cohesion: 0.15
Nodes (19): MoreArrow(), NavArrow(), Props, SLIDE, Walkthrough(), XIcon(), decodedFrames, frameFor() (+11 more)

### Community 47 - "Multiplayer ("other visitors") — plan v2 (Cloudflare)"
Cohesion: 0.14
Nodes (13): 0. Summary, 10. Decisions, 1. Product contract changes (approved 2026-10-31), 2. What already exists that this builds on, 3.1 Generated names (everyone has one), 3. Names, 5.1 Emotes (v1), 5. Protocol (`packages/core/src/presence/protocol.ts`) (+5 more)

### Community 49 - "collage.ts"
Cohesion: 0.26
Nodes (7): SCHEMA_DIR, isProduction(), presenceSecret(), repoRoot, required(), sessionSecret(), setting()

### Community 50 - "placements.ts"
Cohesion: 0.13
Nodes (14): Design for Phases 5–7 (2026-11-05), GAMES, isRecord(), placementOf(), PlacementOwnership, ownsAll, ownsNone, validatePlacements() (+6 more)

### Community 51 - "Worker Package Manifest"
Cohesion: 0.14
Nodes (14): dependencies, @tiny/core@*, exports, ./lambda, @tiny/core, main, name, private (+6 more)

### Community 52 - "Public Asset Manifest"
Cohesion: 0.12
Nodes (15): artworks, bunny, size, floor, size, fonts, icon-no-photos, size (+7 more)

### Community 53 - "media/storage.ts"
Cohesion: 0.10
Nodes (19): CONTENT_TYPES, GET(), PUT(), ACCEPTED, createAssetFromUpload(), MAX_UPLOAD_BYTES, presignUpload(), registerUpload() (+11 more)

### Community 54 - "handlers.ts"
Cohesion: 0.10
Nodes (31): confirmedFollowers(), GalleryRow, SketchPieceRow, DisplayPieceRow, handleNotifyFollowers(), handleRenderDisplay(), renderPieceFrame(), renderPieceSketch() (+23 more)

### Community 55 - "compose-atelier.mjs"
Cohesion: 0.17
Nodes (7): body, dressLayer, MANNEQUIN_CANVAS, mask, root, sourceSize, torso

### Community 56 - "messages.ts"
Cohesion: 0.31
Nodes (7): checkMessage(), INVISIBLE, MESSAGE_MAX, MessageCheck, normalizeMessage(), hasProfanity(), matcher

### Community 57 - "world.ts"
Cohesion: 0.15
Nodes (22): CAST_INTO, CAST_REACH, castSpot(), clampInput(), closestOnPondEdge(), createPondWorld(), distance(), ellipsePoint() (+14 more)

### Community 58 - "dependencies"
Cohesion: 0.17
Nodes (12): dependencies, @aws-sdk/client-s3@^3.1121.0, @aws-sdk/s3-request-presigner@^3.1121.0, bcryptjs@^2.4.3, obscenity@^0.4.6, sharp@^0.33.5, thumbhash@^0.1.1, sharp (+4 more)

### Community 59 - "epoch.ts"
Cohesion: 0.22
Nodes (10): SlotRuntime, EpochRow, sealEpoch(), SliceRow, handleSealEpoch(), FRAME_AVIF_SINCE, framePxPerUnit(), orderedPaintings() (+2 more)

### Community 60 - "PondGame.tsx"
Cohesion: 0.15
Nodes (22): loadPondGame(), drawBobber(), drawPlayer(), drawReed(), drawRock(), drawScene(), ellipse(), loadSprite() (+14 more)

### Community 61 - "room.ts"
Cohesion: 0.14
Nodes (26): admitted(), Attachment, farewell(), GHOST_MS, HELLO_TIMEOUT_MS, holdsOf(), MAX_WAITING_PER_IP, newAttachment() (+18 more)

### Community 62 - "json"
Cohesion: 0.17
Nodes (27): POST(), GET(), POST(), GET(), POST(), PER_MEMBER, PUT(), GET() (+19 more)

### Community 63 - "ticket/route.ts"
Cohesion: 0.15
Nodes (24): PER_MEMBER, PUT(), PER_IP, POST(), presenceUrl(), limited(), Code, 3.2 Chosen names (members) (+16 more)

### Community 64 - "Handoff: move the Tiny Museum bunny from sprite frames to a rig"
Cohesion: 0.17
Nodes (10): 1. What is in this bundle, 3. The rig, 5. Blender-side work still to do (needs Blender; the author has it with an MCP bridge), 6. Open questions for the author, Handoff: move the Tiny Museum bunny from sprite frames to a rig, Approved v4 bunny in the hall, Assets, Existing interactions and fallback (+2 more)

### Community 65 - "Sound Effect Assets"
Cohesion: 0.22
Nodes (9): file, kilobytes, seconds, file, kilobytes, seconds, soundEffects, click (+1 more)

### Community 66 - "react"
Cohesion: 0.20
Nodes (11): openBugReport(), fitWidth(), HelpGuide(), HelpGuideProps, POINTER_STEPS, TOUCH_STEPS, MinigameFrameProps, SoundToggle() (+3 more)

### Community 67 - "Custom HTTP Headers"
Cohesion: 0.25
Nodes (7): applications, appRoot, customHeaders, headers, pattern, key, value

### Community 68 - "Sharp Layer Package"
Cohesion: 0.33
Nodes (6): dependencies, sharp@^0.33.5, description, sharp, name, private

### Community 69 - "HallArranger.tsx"
Cohesion: 0.29
Nodes (4): loadHallArranger(), HallArrangerProps, HallRoomData, Painting

### Community 70 - "visits.ts"
Cohesion: 0.09
Nodes (33): state(), amount(), duration(), dynamic, LANDMARKS, PAGES, RANGES, share() (+25 more)

### Community 71 - "rules.ts"
Cohesion: 0.19
Nodes (14): localDay(), at(), GAME_DAILY_CAP, GameId, GAMES, includes(), isRecord(), offsetOf() (+6 more)

### Community 72 - "round.ts"
Cohesion: 0.16
Nodes (27): deltaE(), GAMUT_EPSILON, hexToOklab(), inGamut(), linearRgbToOklab(), linearToSrgb(), Oklab, oklabToLinearRgb() (+19 more)

### Community 73 - "Tasks"
Cohesion: 0.20
Nodes (9): Decisions (2026-11-05), Follow-ups after Phases 4–7, Phase 2: hall on the stage, Phase 3: one persistent stage, Phase 6: decorating mode, Phase 7: personal rooms, Rooms, Tasks (+1 more)

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
Cohesion: 0.19
Nodes (13): createPresence(), drop(), heartbeat(), maybeSend(), onPageHide(), receive(), scheduleRetry(), send() (+5 more)

### Community 81 - "members"
Cohesion: 0.24
Nodes (10): coin_claims, coin_claims_daily, wallet_items, wallets, member_sessions, member_sessions_member, member_slots, members (+2 more)

### Community 82 - "Frame Window Asset"
Cohesion: 0.50
Nodes (4): frame, size, window, windowAspect

### Community 83 - "Painting Open Sound"
Cohesion: 0.50
Nodes (4): file, kilobytes, seconds, painting-open

### Community 84 - "presence/package.json"
Cohesion: 0.14
Nodes (16): dependencies, @tiny/core@*, devDependencies, @cloudflare/workers-types@5.20261016.1, wrangler@4.151.1, @tiny/core, name, private (+8 more)

### Community 85 - "api.ts"
Cohesion: 0.40
Nodes (8): sameOriginUrl(), decodeImage(), fetchBitmap(), fetchRound(), guarded(), loadInk(), loadRound(), warmImage()

### Community 86 - "Asset pipeline: fast loading without losing sharpness"
Cohesion: 0.22
Nodes (8): Asset pipeline: fast loading without losing sharpness, Character rigs and the Costume Atelier, Completed, Ground rules, Phase 1: fingerprinted files at 2x and 3x, Phase 2: texture atlases for the hall sprites, Phase 3: KTX2 (Basis Universal), built and switched off, Phase 4: ThumbHash placeholders for paintings

### Community 87 - "Guest Board SQL Schema"
Cohesion: 0.67
Nodes (3): guest_notes, guest_notes_visible, rate_limits

### Community 88 - "Landscape Frame Asset"
Cohesion: 0.67
Nodes (3): frameLandscape, size, window

### Community 89 - "Basket Icon Asset"
Cohesion: 0.67
Nodes (3): icon-basket, file, vector

### Community 104 - "react"
Cohesion: 0.08
Nodes (24): PresencePreviewPage(), AccountHost(), AccountSheet, Mode, NAME_ERRORS, Pending, View, KeepOnOtherDevices() (+16 more)

### Community 105 - "PersonalRoom.tsx"
Cohesion: 0.14
Nodes (24): Drag, overTray(), PersonalRoom(), capture(), onSurfaceMove(), onSurfaceUp(), startTileDrag(), PersonalRoomProps (+16 more)

### Community 106 - "ticket.ts"
Cohesion: 0.14
Nodes (18): fetch(), Env, parseRoom(), decoder, encoder, fromBase64Url(), HmacKey, isOwn() (+10 more)

### Community 107 - "motion"
Cohesion: 0.31
Nodes (6): ArtistPage(), dynamic, generateMetadata(), GET(), FollowForm(), getArtistPage()

### Community 108 - "app/layout.tsx"
Cohesion: 0.17
Nodes (13): bethEllen, inspiratiq, metadata, notoSans, RootLayout(), sniglet, viewport, SoundProvider() (+5 more)

### Community 109 - "Conn"
Cohesion: 0.35
Nodes (3): connectWebSocket(), SocketHandlers, Conn

### Community 111 - "members.ts"
Cohesion: 0.17
Nodes (23): GLOBAL, PER_IP, POST(), registry, started(), hashPassword(), verifyPassword(), canonicalEmail() (+15 more)

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
Cohesion: 0.35
Nodes (12): isItem(), isName(), isPid(), isSeq(), MAX_MESSAGE_BYTES, parseClientMessage(), parseLook(), parseMotion() (+4 more)

### Community 119 - "Costume gallery doorway"
Cohesion: 0.50
Nodes (3): Costume gallery doorway, Curtain colour edit, Prompt

### Community 120 - "fishing.ts"
Cohesion: 0.20
Nodes (18): PondGame(), BITE_SECONDS, cast(), CAST_SECONDS, createFishingState(), EscapeReason, FISH, FISH_WEIGHT_TOTAL (+10 more)

### Community 124 - "personalRoomFor"
Cohesion: 0.43
Nodes (5): dynamic, HomePage(), HomeSignIn(), personalRoomFor(), starterPlacements()

### Community 125 - "run.ts"
Cohesion: 0.17
Nodes (9): admin, childEnv, client, database, fresh, migrations, target, pg@^8.13.1 (+1 more)

### Community 126 - "atelier.ts"
Cohesion: 0.14
Nodes (21): aspectOf(), AtelierActions, createAtelierRoom(), control(), form(), picture(), place(), priceTag() (+13 more)

### Community 127 - "ensureEpoch"
Cohesion: 0.42
Nodes (8): GET(), GET(), sketchPool, unavailable(), ensureEpoch(), epochById(), getHallSlice(), getSketchPool()

### Community 128 - "features/economy/index.ts"
Cohesion: 0.10
Nodes (30): MuseumLayout(), CoinToast(), Toast, Purse(), WalletProvider(), serverSnapshot, useEarnEvents(), useWallet() (+22 more)

### Community 129 - "presence/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, types, exclude, extends, include, ../../tsconfig.base.json

### Community 130 - "ReadScreen.tsx"
Cohesion: 0.11
Nodes (29): BoardScreen(), BoardScreenProps, ComposeScreen(), ComposeScreenProps, blankDraft(), GuestBoard(), GuestBoardProps, View (+21 more)

### Community 131 - "tsconfig.test.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 134 - "hall/room.ts"
Cohesion: 0.09
Nodes (50): Assets, Scenery, Backdrop, createBackdrop(), CUTS, disposeBoards(), Mark, plane() (+42 more)

### Community 136 - "AccountSheet.tsx"
Cohesion: 0.29
Nodes (9): AccountSheet(), continueAnyway(), doSignOut(), runDelete(), runName(), submit(), submitDelete(), submitName() (+1 more)

### Community 137 - ".webSocketMessage"
Cohesion: 0.40
Nodes (4): attachmentOf(), roomFull(), Room, sendTo()

### Community 139 - "remote-visitors.ts"
Cohesion: 0.05
Nodes (26): Attachment, Carried, CarriedState, createCarried(), Character, Look, Perch, Pose (+18 more)

### Community 140 - "tab-turn.ts"
Cohesion: 0.16
Nodes (5): createTabTurn(), TabTurn, tab(), TurnEnv, TurnMessage

### Community 142 - "rooms.ts"
Cohesion: 0.08
Nodes (44): GET(), PaintingRow, PER_EDITOR, PUT(), PER_EDITOR, POST(), PER_MEMBER, POST() (+36 more)

### Community 145 - "audience.ts"
Cohesion: 0.12
Nodes (22): GET(), analyticsFor(), AnalyticsSummary, createInquiry(), ensureQrToken(), follow(), recordEvent(), ResolvedToken (+14 more)

### Community 146 - "join-room.ts"
Cohesion: 0.13
Nodes (11): joinRoom(), Options, Pose, Room, STANDING, isMuted(), onNameChange(), onSayRequest() (+3 more)

### Community 147 - "DecorTray.tsx"
Cohesion: 0.29
Nodes (5): buy(), DecorTray(), keep(), DecorTrayProps, propLabel()

### Community 149 - "reveal.ts"
Cohesion: 0.21
Nodes (7): InkMap, planGame(), ROUND_SPREAD, createReveal(), PENCIL, SketchReveal, shuffle()

### Community 151 - "floor.test.ts"
Cohesion: 0.24
Nodes (7): depthAtY(), depthBounds(), AREA, cross(), hasLineOfSight(), properCrossing(), WalkArea

### Community 152 - "VitalsReporter.tsx"
Cohesion: 0.29
Nodes (8): firstPainting(), flush(), Metric, queue, REPORTED, VitalsReporter(), FIRST_PAINTING_MARK, MUSEUM_START_MARK

### Community 156 - "MinigameFrame"
Cohesion: 0.33
Nodes (7): loadGameDesktop(), GameDesktop(), GameDesktopProps, MinigameFrame(), Minigame, MinigameId, MINIGAMES

### Community 157 - "hit"
Cohesion: 0.16
Nodes (19): POST(), UPLOADS_PER_ARTIST, integerOffset(), isRecord(), itemIdOf(), MAX_CLAIM_BATCH, MAX_WALLET_BODY_BYTES, ParsedWalletClaim (+11 more)

### Community 159 - "ColorRecall.tsx"
Cohesion: 0.16
Nodes (19): ColorRecall(), ColorRecallProps, Phase, readBest(), ColorRound, loadColorRecall(), saveIfHigher(), useSound() (+11 more)

### Community 160 - "4. Transport: Cloudflare Durable Objects"
Cohesion: 0.25
Nodes (8): 4. Transport: Cloudflare Durable Objects, Decision (2026-10-31), Deploying, Identity cannot be forged, Local development and tests, Rooms and capacity, Shape of `apps/presence` (about 200 lines), main()

### Community 161 - "lib/presence.ts"
Cohesion: 0.09
Nodes (20): Outcome, Connect, fetchTicket, HEARTBEAT_MS, HIDDEN_LIMIT_MS, RETRY_MS, sameLook(), samePose() (+12 more)

### Community 165 - "Other visitors"
Cohesion: 0.29
Nodes (6): How it plays, Other visitors, Privacy, Running it in production, Running it locally, Staying consistent

### Community 171 - "createDecorController"
Cohesion: 0.67
Nodes (4): createDecorController(), canvasRect(), worldPixel(), cozyZoneAnchor()

## Knowledge Gaps
- **5 isolated node(s):** `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 951 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **24 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `builtUrl`, `features/economy/index.ts`, `ReadScreen.tsx`, `SketchGuess.tsx`, `actions.ts`, `rig.ts`, `Test Fakes and Helpers`, `stage.ts`, `DecorTray.tsx`, `SoundProvider.tsx`, `VitalsReporter.tsx`, `bug-report.ts`, `Museum.tsx`, `Web Package Dependencies`, `ColorRecall.tsx`, `wardrobe.ts`, `join-room.ts`, `useSoundEffects.ts`, `Walkthrough.tsx`, `PondGame.tsx`, `react`, `HallArranger.tsx`, `PersonalRoom.tsx`, `motion`, `app/layout.tsx`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **What connects `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json` to the rest of the system?**
  _5 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `slots/store.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.14 - nodes in this community are weakly interconnected._
- **Why does `three` connect `hall/room.ts` to `wardrobe.ts`, `scene/assets.ts`, `rig.ts`, `remote-visitors.ts`, `cozy.ts`, `stage.ts`, `join-room.ts`, `prepare-models.mjs`, `scene.ts`, `Web Package Dependencies`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Should `SketchGuess.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07922705314009662 - nodes in this community are weakly interconnected._
- **Why does `next` connect `actions.ts` to `builtUrl`, `rig.ts`, `rooms.ts`, `audience.ts`, `SoundProvider.tsx`, `VitalsReporter.tsx`, `bug-report.ts`, `Museum.tsx`, `Web Package Dependencies`, `wardrobe.ts`, `confirm/page.tsx`, `json`, `react`, `visits.ts`, `react`, `PersonalRoom.tsx`, `motion`, `app/layout.tsx`, `personalRoomFor`, `ensureEpoch`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Should `actions.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.053235653235653234 - nodes in this community are weakly interconnected._