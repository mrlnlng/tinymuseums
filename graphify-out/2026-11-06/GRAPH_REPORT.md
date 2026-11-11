# Graph Report - tiny-museum  (2026-11-06)

## Corpus Check
- 405 files · ~192,112 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 73 file(s) not represented in the graph (top: .glb 33, .avif 32, .css 3)

## Summary
- 3346 nodes · 8428 edges · 168 communities (140 shown, 28 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 168 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `beef1601`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- stage.ts
- AtelierRoom
- SketchGuess.tsx
- query
- economy/store.ts
- collage.ts
- floor.ts
- Core Asset Manifest
- scene/assets.ts
- SyncStore
- rig.ts
- audience.ts
- Test Fakes and Helpers
- scene.ts
- cozy.ts
- jobs.ts
- join-room.ts
- slots/store.ts
- ref_node_assert
- amplify/package.json
- Atelier.tsx
- prepare-models.mjs
- Traversal
- core/package.json
- art-cache.ts
- bug-report.ts
- Placement
- Museum.tsx
- overlay.ts
- AssetImage
- Web Package Dependencies
- Gamifying Tiny Museum — genre direction & engagement research
- handlers.ts
- Placement
- S3Storage
- amplify/tsconfig.json
- 5. Customization menu — what other people are doing
- names.ts
- core/src/index.ts
- Web TSConfig
- Root Package Manifest
- initialize
- useSoundEffects.ts
- peers.ts
- Base TSConfig
- Amplify Build Spec
- createSitting
- Multiplayer ("other visitors") — plan v2 (Cloudflare)
- Fake Sync Server
- graftCostume
- themes.ts
- Worker Package Manifest
- Public Asset Manifest
- media/storage.ts
- carry.test.ts
- compose-atelier.mjs
- messages.ts
- world.ts
- pond.ts
- outbox.test.ts
- PondGame.tsx
- room.ts
- nearby.ts
- reveal.ts
- Handoff: move the Tiny Museum bunny from sprite frames to a rig
- Sound Effect Assets
- react
- Custom HTTP Headers
- Sharp Layer Package
- (hall)/page.tsx
- visits.ts
- json
- The Costume Atelier
- hit.ts
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
- .webSocketMessage
- PersonalRoom
- ticket.ts
- VitalsReporter.tsx
- member-route.ts
- Conn
- useSound
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
- db.ts
- DecorDrawer.tsx
- atelier.ts
- 4. Transport: Cloudflare Durable Objects
- claim.ts
- presence/tsconfig.json
- GuestBoard.tsx
- tsconfig.test.json
- app/layout.tsx
- domain/sketch.ts
- createHallRoom
- personal/room.ts
- Confirmed issues
- GameDesktop.tsx
- confirm/page.tsx
- hall/room.ts
- body.ts
- createStage
- FilesystemStorage
- layout.ts
- presence.test.ts
- DecorDrawer
- bug-reports.ts
- AccountSheet
- Cafe
- ArtCache
- PerfMeter
- floor.test.ts
- run.ts
- createHallRoom
- wardrobe.test.ts
- useMember
- BunnyArtist.tsx
- frame.ts
- presence/src/index.ts
- a/[slug]/page.tsx
- Sitting
- lib/presence.ts
- lib/assets.ts
- focus.ts
- Other visitors
- SketchGuess
- share.ts
- xdog.ts

## God Nodes (most connected - your core abstractions)
1. `query()` - 60 edges
2. `react` - 56 edges
3. `json()` - 49 edges
4. `next` - 42 edges
5. `SyncStore` - 41 edges
6. `Traversal` - 40 edges
7. `PersonalRoom()` - 39 edges
8. `three` - 38 edges
9. `hit()` - 37 edges
10. `createHallRoom()` - 36 edges

## Surprising Connections (you probably didn't know these)
- `4. Suggested plan` --references--> `BunnyArtist()`  [INFERRED]
  docs/bunny-rig-author-handoff.md → apps/web/src/features/sketchguess/components/BunnyArtist.tsx
- `5.1 Emotes (v1)` --references--> `ScreenChrome()`  [INFERRED]
  docs/multiplayer-plan.md → apps/web/src/shared/components/ScreenChrome.tsx
- `E2E-009 — Room mutations ignore stale account identity` --references--> `memberFromRequest()`  [INFERRED]
  docs/testing/local-e2e-stress-2026-11-06.md → apps/web/src/shared/lib/member-route.ts
- `Fitting clothes to other characters` --references--> `graftCostume()`  [INFERRED]
  docs/costume-atelier.md → apps/web/tooling/graft-costume.mjs
- `19. Development-only: page payloads include the full room row` --references--> `getRoom()`  [INFERRED]
  docs/personal-room-issues.md → packages/core/src/domain/rooms.ts

## Import Cycles
- None detected.

## Communities (168 total, 28 thin omitted)

### Community 0 - "stage.ts"
Cohesion: 0.03
Nodes (67): coverFloorTransition(), CharacterSprites, AtelierArt, disposeAtelierArt(), CameraRig, Look, createPixelRatioGovernor(), PIXEL_RATIO_STEPS (+59 more)

### Community 1 - "AtelierRoom"
Cohesion: 0.10
Nodes (7): AtelierRoom, ClothingItem, CharacterKind, Options, Wardrobe, SPARKLE_TINTS, outfit

### Community 2 - "SketchGuess.tsx"
Cohesion: 0.19
Nodes (16): BURST, Phase, readDifficulty(), readMode(), SketchGuessProps, DIFFICULTIES, Difficulty, isDifficulty() (+8 more)

### Community 3 - "query"
Cohesion: 0.06
Nodes (75): POST(), UPLOADS_PER_ARTIST, AnalyticsPage(), dynamic, BugReportsPage(), dateFormat, dynamic, summary() (+67 more)

### Community 4 - "economy/store.ts"
Cohesion: 0.11
Nodes (34): MuseumLayout(), CoinToast(), Toast, WalletProvider(), serverSnapshot, useEarnEvents(), EarnSource, buy() (+26 more)

### Community 5 - "collage.ts"
Cohesion: 0.15
Nodes (19): handleDerivatives(), handleSealEpoch(), FRAME_AVIF_SINCE, FRAME_FORMAT, FRAME_VERSION, FrameManifest, FrameSpec, loadFrameAssets() (+11 more)

### Community 6 - "floor.ts"
Cohesion: 0.21
Nodes (25): clone(), closestOnSegment(), contains(), cross(), crossVec(), DepthView, distanceSq(), dot() (+17 more)

### Community 7 - "Core Asset Manifest"
Cohesion: 0.05
Nodes (41): artworks, audio, file, megabytes, seconds, sourceName, startedAt, bunny (+33 more)

### Community 8 - "scene/assets.ts"
Cohesion: 0.08
Nodes (45): sameOriginUrl(), AssetManifest, assetUrl(), bitmapTexture(), blankImage(), CAFE_CAT_FRAMES, CompressedLoader, elementTexture() (+37 more)

### Community 9 - "SyncStore"
Cohesion: 0.15
Nodes (7): encodeStored(), parseStored(), readStored(), writeStored(), deepEq(), SyncStore, upgrade()

### Community 10 - "rig.ts"
Cohesion: 0.06
Nodes (58): CrowdPreviewPage(), RigPreviewPage(), CrowdPreview(), draw(), KINDS, Stats, Window, NEXT (+50 more)

### Community 11 - "audience.ts"
Cohesion: 0.21
Nodes (12): ALLOWED, POST(), GET(), AnalyticsSummary, createInquiry(), EventKind, follow(), recordEvent() (+4 more)

### Community 12 - "Test Fakes and Helpers"
Cohesion: 0.12
Nodes (27): deferredFetch(), deviceSlot, FakeEvents, FakeStorage, fixture, fixtureB, fixtureRegistry, fixtureRegistryBoth (+19 more)

### Community 13 - "scene.ts"
Cohesion: 0.06
Nodes (18): disposeDisplayTexture(), prefersAvif(), HiddenCoin, createNotes(), createPedestal(), Notes, Pedestal, PedestalVoice (+10 more)

### Community 14 - "cozy.ts"
Cohesion: 0.18
Nodes (17): ATELIER_PROPS, AtelierImage, canvasTexture(), CozyBackdrop, cozyPropImageUrl(), drawingOn(), FISH, fishTexture() (+9 more)

### Community 15 - "jobs.ts"
Cohesion: 0.23
Nodes (16): loop(), shutdown(), sleep(), sweepStale(), DrainResult, handler(), repairFrames(), repairUnframed() (+8 more)

### Community 16 - "join-room.ts"
Cohesion: 0.19
Nodes (25): ChatButton(), REFUSED, joinRoom(), emit(), getPeople(), isInRoom(), isMuted(), muted (+17 more)

### Community 17 - "slots/store.ts"
Cohesion: 0.13
Nodes (19): ANON_PREFIX, anonKey(), deviceKey(), isMemberSlotKey(), listKeys(), MEMBER_KEY, memberKey(), memberPrefix() (+11 more)

### Community 18 - "ref_node_assert"
Cohesion: 0.05
Nodes (60): deltaE(), GAMUT_EPSILON, hexToOklab(), inGamut(), linearRgbToOklab(), linearToSrgb(), Oklab, oklabToLinearRgb() (+52 more)

### Community 19 - "amplify/package.json"
Cohesion: 0.08
Nodes (26): amplifyDir, backend, everyMinutes, mediaBucket, missing, repoRoot, REQUIRED, setting() (+18 more)

### Community 20 - "Atelier.tsx"
Cohesion: 0.14
Nodes (29): AtelierPage(), metadata, florinLabel(), allowedCharacter(), OwnedSnapshot, owns(), walletReady(), Atelier() (+21 more)

### Community 21 - "prepare-models.mjs"
Cohesion: 0.14
Nodes (18): paintedCostume(), atelier, bunny, floralOutfits(), goldOutfits(), HEADPIECES, image(), manifest (+10 more)

### Community 22 - "Traversal"
Cohesion: 0.11
Nodes (3): JumpPose, clamp(), Traversal

### Community 23 - "core/package.json"
Cohesion: 0.06
Nodes (40): dependencies, @aws-sdk/client-s3@^3.1121.0, @aws-sdk/s3-request-presigner@^3.1121.0, bcryptjs@^2.4.3, obscenity@^0.4.6, pg@^8.13.1, sharp@^0.33.5, thumbhash@^0.1.1 (+32 more)

### Community 24 - "art-cache.ts"
Cohesion: 0.21
Nodes (9): ArtCacheOptions, createArtCache(), drop(), expireLater(), hold(), HeldArt, LoadResult, Slot (+1 more)

### Community 25 - "bug-report.ts"
Cohesion: 0.19
Nodes (15): BugReportHost(), BugReportSheet, BugReportSheet(), Status, collectContext(), inAppBrowser(), onOpenBugReport(), recentErrors (+7 more)

### Community 27 - "Museum.tsx"
Cohesion: 0.09
Nodes (33): Loading(), AtelierLoading(), CoinFound, ColorRecall, GameDesktop, GuestBoard, HallArranger, HelpGuide (+25 more)

### Community 28 - "overlay.ts"
Cohesion: 0.08
Nodes (9): CafeLink, ComingSoonNote, GiftShopSigns, GuestBoardNotes, LobbySigns, Placards, placeLabel(), toScreen() (+1 more)

### Community 29 - "AssetImage"
Cohesion: 0.11
Nodes (25): Purse(), BoardScreen(), BoardScreenProps, ComposeScreen(), blankDraft(), GuestBoard(), GuestBoardProps, View (+17 more)

### Community 30 - "Web Package Dependencies"
Cohesion: 0.07
Nodes (33): dependencies, embla-carousel-react@^8.6.0, motion@^13.1.1, next@^15.0.3, react@^19.0.0, react-dom@^19.0.0, swr@^2.5.1, three@^0.169.0 (+25 more)

### Community 31 - "Gamifying Tiny Museum — genre direction & engagement research"
Cohesion: 0.10
Nodes (19): 0.1 The core experience, 0.2 Systems that make gamification cheap to build, 0.3 Constraints that shape any recommendation, 0. What the game is today (the deep dive), 1.1 The landscape (seven candidates, with verdicts), 1.2 Recommendation: a **cozy gallery life-sim** — "the gallery you live in", 1.3 The five design pillars the genre implies, 1. Genre direction (+11 more)

### Community 32 - "handlers.ts"
Cohesion: 0.18
Nodes (13): confirmedFollowers(), handleNotifyFollowers(), handleRenderDisplay(), renderPieceFrame(), renderPieceSketch(), ConsoleMailer, FileMailer, getMailer() (+5 more)

### Community 33 - "Placement"
Cohesion: 0.12
Nodes (5): Carry, PersonalRoomProps, HallRoomData, PlacementLayer, Placement

### Community 35 - "amplify/tsconfig.json"
Cohesion: 0.20
Nodes (9): compilerOptions, module, moduleResolution, noUnusedLocals, noUnusedParameters, exclude, extends, include (+1 more)

### Community 36 - "5. Customization menu — what other people are doing"
Cohesion: 0.12
Nodes (16): 1. The target: what "Claude Opus 5.5" actually means, 2. Where your harness stands today (live config I read), 3. The honest gap model, 4. Quality levers, ranked by leverage, 5. Customization menu — what other people are doing, 6. Recommended starting kit for *your* profile, 7. What I can apply for you right now (needs your go-ahead), A. Prompt & persona (most common quality customizations) (+8 more)

### Community 37 - "names.ts"
Cohesion: 0.15
Nodes (16): Mode, NAME_ERRORS, Pending, View, announceNameChange(), NameError, useVisitorName(), VisitorName (+8 more)

### Community 38 - "core/src/index.ts"
Cohesion: 0.09
Nodes (43): refreshPriceTags(), member(), now, piece(), randomId(), today, applyClaim(), buy() (+35 more)

### Community 39 - "Web TSConfig"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 40 - "Root Package Manifest"
Cohesion: 0.07
Nodes (35): description, devDependencies, concurrently@^9.1.0, esbuild@^0.24.0, ktx2-encoder@^0.6.0, maxrects-packer@^2.7.3, playwright@^1.63.0, @types/node@^22.9.0 (+27 more)

### Community 41 - "initialize"
Cohesion: 0.20
Nodes (15): isDoor(), linkedDoor(), initialize(), aim(), drawFrame(), handleClick(), handlePointerDown(), handlePointerMove() (+7 more)

### Community 42 - "useSoundEffects.ts"
Cohesion: 0.10
Nodes (31): SoundContext, SoundProvider(), SoundState, BackgroundMusic, clampVolume(), isDocumentHidden(), Options, useBackgroundMusic() (+23 more)

### Community 43 - "peers.ts"
Cohesion: 0.14
Nodes (7): INTERPOLATION_DELAY_MS, PEER_TIMEOUT_MS, PeerTable, positionAt(), Sample, look, Peer

### Community 44 - "Base TSConfig"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, lib, module, moduleResolution (+9 more)

### Community 45 - "Amplify Build Spec"
Cohesion: 0.12
Nodes (16): applications, appRoot, backend, frontend, baseDirectory, files, phases, commands (+8 more)

### Community 47 - "Multiplayer ("other visitors") — plan v2 (Cloudflare)"
Cohesion: 0.15
Nodes (12): 0. Summary, 10. Decisions, 1. Product contract changes (approved 2026-10-31), 2. What already exists that this builds on, 3.1 Generated names (everyone has one), 3. Names, 5.1 Emotes (v1), 5. Protocol (`packages/core/src/presence/protocol.ts`) (+4 more)

### Community 48 - "Fake Sync Server"
Cohesion: 0.20
Nodes (3): FakeServer, SlotState, SlotDef

### Community 49 - "graftCostume"
Cohesion: 0.27
Nodes (14): canvasFit(), compose(), graftCostume(), copyAccessor(), copyMaterial(), copyMesh(), copyTexture(), copyView() (+6 more)

### Community 50 - "themes.ts"
Cohesion: 0.08
Nodes (23): PlacementTheme, 1. Items placed against a zone edge fail to save, and the whole draft reverts, 2. One owned item can be placed many times, 3. Any save rejection throws away all unsaved work, 4. Changes made just before leaving are lost, 5. Fish trophies can be claimed without playing, High, Design for Phases 5–7 (2026-11-05) (+15 more)

### Community 51 - "Worker Package Manifest"
Cohesion: 0.14
Nodes (14): dependencies, @tiny/core@*, exports, ./lambda, @tiny/core, main, name, private (+6 more)

### Community 52 - "Public Asset Manifest"
Cohesion: 0.12
Nodes (15): artworks, bunny, size, floor, size, fonts, icon-no-photos, size (+7 more)

### Community 53 - "media/storage.ts"
Cohesion: 0.17
Nodes (16): CONTENT_TYPES, GET(), PUT(), ACCEPTED, createAssetFromUpload(), MAX_UPLOAD_BYTES, presignUpload(), registerUpload() (+8 more)

### Community 54 - "carry.test.ts"
Cohesion: 0.29
Nodes (11): CARRY_CAP, carryAdd(), CarryEntry, carryPrune(), carryRemove(), chunk(), ClaimRequest, tzOffsetNow() (+3 more)

### Community 55 - "compose-atelier.mjs"
Cohesion: 0.17
Nodes (7): body, dressLayer, MANNEQUIN_CANVAS, mask, root, sourceSize, torso

### Community 56 - "messages.ts"
Cohesion: 0.31
Nodes (7): checkMessage(), INVISIBLE, MESSAGE_MAX, MessageCheck, normalizeMessage(), hasProfanity(), matcher

### Community 57 - "world.ts"
Cohesion: 0.15
Nodes (22): CAST_INTO, CAST_REACH, castSpot(), clampInput(), closestOnPondEdge(), createPondWorld(), distance(), ellipsePoint() (+14 more)

### Community 58 - "pond.ts"
Cohesion: 0.29
Nodes (10): issuePondTicket(), POND_FISH, POND_MAX_REEL_MS, POND_MIN_REEL_MS, pondFishFor(), PondFishId, readPondTicket(), sign() (+2 more)

### Community 59 - "outbox.test.ts"
Cohesion: 0.13
Nodes (25): OUTBOX_CAP, outboxAdd(), outboxDue(), OutboxEntry, outboxFail(), outboxRemove(), RETRY_BASE_MS, RETRY_MAX_MS (+17 more)

### Community 60 - "PondGame.tsx"
Cohesion: 0.16
Nodes (21): drawBobber(), drawPlayer(), drawReed(), drawRock(), drawScene(), ellipse(), loadSprite(), PondGameProps (+13 more)

### Community 61 - "room.ts"
Cohesion: 0.14
Nodes (28): admitted(), Attachment, farewell(), GHOST_MS, HELLO_TIMEOUT_MS, holdsOf(), MAX_WAITING_PER_IP, newAttachment() (+20 more)

### Community 62 - "nearby.ts"
Cohesion: 0.18
Nodes (5): Nearby, NearbyReach, RoomSpan, reach, strip

### Community 63 - "reveal.ts"
Cohesion: 0.21
Nodes (7): InkMap, planGame(), ROUND_SPREAD, createReveal(), PENCIL, SketchReveal, shuffle()

### Community 64 - "Handoff: move the Tiny Museum bunny from sprite frames to a rig"
Cohesion: 0.14
Nodes (12): 1. What is in this bundle, 2. How the game draws the bunny today (read from the repo, not run), 3. The rig, 4. Suggested plan, 5. Blender-side work still to do (needs Blender; the author has it with an MCP bridge), 6. Open questions for the author, Handoff: move the Tiny Museum bunny from sprite frames to a rig, Approved v4 bunny in the hall (+4 more)

### Community 65 - "Sound Effect Assets"
Cohesion: 0.22
Nodes (9): file, kilobytes, seconds, file, kilobytes, seconds, soundEffects, click (+1 more)

### Community 66 - "react"
Cohesion: 0.13
Nodes (17): config, SECURITY_HEADERS, openAccount(), openBugReport(), fitWidth(), HelpGuide(), HelpGuideProps, POINTER_STEPS (+9 more)

### Community 67 - "Custom HTTP Headers"
Cohesion: 0.25
Nodes (7): applications, appRoot, customHeaders, headers, pattern, key, value

### Community 68 - "Sharp Layer Package"
Cohesion: 0.33
Nodes (6): dependencies, sharp@^0.33.5, description, sharp, name, private

### Community 69 - "(hall)/page.tsx"
Cohesion: 0.21
Nodes (12): dynamic, Hall(), MuseumPage(), CurrentlyShowing(), dynamic, GUIDELINES, LandingPage(), EMPTY (+4 more)

### Community 70 - "visits.ts"
Cohesion: 0.06
Nodes (47): state(), PER_VISITOR, POST(), dynamic, format(), grade(), METRICS, PAGES (+39 more)

### Community 71 - "json"
Cohesion: 0.10
Nodes (48): POST(), POST(), PER_MEMBER, PUT(), POST(), GLOBAL, PER_IP, POST() (+40 more)

### Community 72 - "The Costume Atelier"
Cohesion: 0.17
Nodes (11): Adding a character, Adding a costume, Art not supplied as files, Bruce's Chronicles, Costume fit review, Fitting clothes to other characters, Floral collection, How it plays (+3 more)

### Community 73 - "hit.ts"
Cohesion: 0.19
Nodes (10): CoinWall, createHiddenCoin(), Spot, AlphaMap, alphaMapFor(), alphaMaps, buildAlphaMap(), isPaintedAt() (+2 more)

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
Cohesion: 0.33
Nodes (10): PreparedGame, decodeImage(), fetchBitmap(), fetchRound(), guarded(), LoadedRound, loadInk(), loadRound() (+2 more)

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

### Community 104 - ".webSocketMessage"
Cohesion: 0.40
Nodes (4): attachmentOf(), roomFull(), Room, sendTo()

### Community 105 - "PersonalRoom"
Cohesion: 0.15
Nodes (23): errorReason(), overDrawer(), PersonalRoom(), canPlaceNew(), carryEnd(), carryMove(), focusPlaced(), onCardKey() (+15 more)

### Community 106 - "ticket.ts"
Cohesion: 0.17
Nodes (16): validRoomBase(), decoder, encoder, fromBase64Url(), HmacKey, isOwn(), isTicket(), keyFor() (+8 more)

### Community 107 - "VitalsReporter.tsx"
Cohesion: 0.29
Nodes (8): firstPainting(), flush(), Metric, queue, REPORTED, VitalsReporter(), FIRST_PAINTING_MARK, MUSEUM_START_MARK

### Community 108 - "member-route.ts"
Cohesion: 0.06
Nodes (61): GET(), GET(), roomEditor, PER_MEMBER, POST(), GET(), PaintingRow, PER_EDITOR (+53 more)

### Community 109 - "Conn"
Cohesion: 0.31
Nodes (4): send(), connectWebSocket(), SocketHandlers, Conn

### Community 110 - "useSound"
Cohesion: 0.23
Nodes (12): ColorRecall(), ColorRecallProps, Phase, readBest(), ColorRound, showMs(), loadColorRecall(), readSeen() (+4 more)

### Community 111 - "members.ts"
Cohesion: 0.13
Nodes (31): GET(), Code, 3.2 Chosen names (members), registry, started(), hashPassword(), verifyPassword(), canonicalEmail() (+23 more)

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
Cohesion: 0.19
Nodes (19): castLine(), PondGame(), BITE_SECONDS, cast(), CAST_SECONDS, createFishingState(), EscapeReason, FISH (+11 more)

### Community 124 - "db.ts"
Cohesion: 0.07
Nodes (41): GET(), intParam(), GET(), sketchPool, unavailable(), Deploying, main(), SCHEMA_DIR (+33 more)

### Community 125 - "DecorDrawer.tsx"
Cohesion: 0.17
Nodes (10): useWallet(), DecorDrawer, DecorDrawerProps, SharingState, Tab, TABS, categoryOf(), DrawerCategory (+2 more)

### Community 126 - "atelier.ts"
Cohesion: 0.09
Nodes (33): aspectOf(), AtelierActions, AtelierImage, Cardigan, CARDIGAN_ART, CARDIGAN_NAMES, CHARACTER_NAMES, createAtelierRoom() (+25 more)

### Community 127 - "4. Transport: Cloudflare Durable Objects"
Cohesion: 0.33
Nodes (6): 4. Transport: Cloudflare Durable Objects, Decision (2026-10-31), Identity cannot be forged, Local development and tests, Rooms and capacity, Shape of `apps/presence` (about 200 lines)

### Community 128 - "claim.ts"
Cohesion: 0.12
Nodes (22): buildClaim(), BuiltClaim, EarnDetail, GameSource, newRunId(), now, localDay(), at() (+14 more)

### Community 129 - "presence/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, types, exclude, extends, include, ../../tsconfig.base.json

### Community 130 - "GuestBoard.tsx"
Cohesion: 0.14
Nodes (19): GET(), ComposeScreenProps, messageLength(), StickyNoteProps, NoteDraft, useKeyboardLift(), decodeCursor(), encodeCursor() (+11 more)

### Community 131 - "tsconfig.test.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 132 - "app/layout.tsx"
Cohesion: 0.16
Nodes (14): bethEllen, inspiratiq, metadata, notoSans, RootLayout(), sniglet, viewport, AccountHost() (+6 more)

### Community 133 - "domain/sketch.ts"
Cohesion: 0.11
Nodes (27): listPieces(), pieceImageUrl(), PieceRow, toPieceDto(), EpochRow, GalleryRow, SKETCH_CHOICES, SketchCandidate (+19 more)

### Community 134 - "createHallRoom"
Cohesion: 0.10
Nodes (34): Assets, CUTS, disposeBoards(), Mark, plane(), ROPE_CUTS, ropeSlices(), sliceOf() (+26 more)

### Community 135 - "personal/room.ts"
Cohesion: 0.12
Nodes (17): PersonalArt, cozyLevel, cozyWorth(), createPersonalRoom(), showLevel(), DOOR_SIGN, NAME_SIGN, PersonalRoomOptions (+9 more)

### Community 136 - "Confirmed issues"
Cohesion: 0.04
Nodes (46): 10. Long names run off the name sign, 11. The rooms API skips the stale-tab member check, 12. The bunny is dragged along while you pan in Decorate, 13. Pages that redirect or don't exist answer 200, 14. Error codes reveal which room slugs exist, 15. The name sign slides under the top-right buttons in Decorate, 16. Level-up celebrations can be farmed, 17. No hint of where things are after panning away (+38 more)

### Community 137 - "GameDesktop.tsx"
Cohesion: 0.36
Nodes (6): loadGameDesktop(), GameDesktop(), GameDesktopProps, Minigame, MinigameId, MINIGAMES

### Community 138 - "confirm/page.tsx"
Cohesion: 0.33
Nodes (7): ConfirmFollow(), dynamic, dynamic, Unsubscribe(), FollowNotice(), confirmFollow(), unsubscribe()

### Community 139 - "hall/room.ts"
Cohesion: 0.06
Nodes (34): Scenery, Backdrop, createBackdrop(), CafeMarks, Attachment, Carried, CarriedState, createCarried() (+26 more)

### Community 140 - "body.ts"
Cohesion: 0.40
Nodes (8): integerOffset(), isRecord(), itemIdOf(), MAX_CLAIM_BATCH, ParsedWalletClaim, parseWalletClaim(), routeBanned(), tzOffsetOf()

### Community 141 - "createStage"
Cohesion: 0.52
Nodes (7): createNearby(), createStage(), closeEntry(), enter(), isCurrent(), isQuiet(), open()

### Community 143 - "layout.ts"
Cohesion: 0.21
Nodes (9): cafeAfterIndex(), comingSoonWidth(), computeLayout(), cutRooms(), HallLayout, HallRoomKind, HallRoomSpan, hasPedestal() (+1 more)

### Community 144 - "presence.test.ts"
Cohesion: 0.18
Nodes (9): Connect, HEARTBEAT_MS, HIDDEN_LIMIT_MS, Clock, flush(), look, MemoryRooms, visitor() (+1 more)

### Community 145 - "DecorDrawer"
Cohesion: 0.13
Nodes (19): MinigameFrame(), MinigameFrameProps, HallArranger(), HallArrangerProps, Painting, currentHallOrder(), hallPlacements(), LEVELS (+11 more)

### Community 146 - "bug-reports.ts"
Cohesion: 0.12
Nodes (23): POST(), POST(), rateLimitedResponse(), rejectedResponse(), JsonBody, readJsonBody(), BugReport, BugReportDto (+15 more)

### Community 147 - "AccountSheet"
Cohesion: 0.29
Nodes (9): AccountSheet(), continueAnyway(), doSignOut(), runDelete(), runName(), submit(), submitDelete(), submitName() (+1 more)

### Community 151 - "floor.test.ts"
Cohesion: 0.24
Nodes (7): depthAtY(), depthBounds(), AREA, cross(), hasLineOfSight(), properCrossing(), WalkArea

### Community 152 - "run.ts"
Cohesion: 0.20
Nodes (7): admin, childEnv, client, database, fresh, migrations, target

### Community 153 - "createHallRoom"
Cohesion: 0.17
Nodes (21): earn(), emit(), emitEarned(), maybeInvite(), writeSession(), createHallRoom(), buildRoom(), cafeRoom() (+13 more)

### Community 154 - "wardrobe.test.ts"
Cohesion: 0.15
Nodes (11): createWardrobe(), enqueue(), reflect(), followOutfit(), sync(), bow, dress, navy (+3 more)

### Community 155 - "useMember"
Cohesion: 0.18
Nodes (3): KeepOnOtherDevices(), Probe(), useMember

### Community 156 - "BunnyArtist.tsx"
Cohesion: 0.50
Nodes (4): BunnyArtist(), BunnyMood, Pencil(), POSES

### Community 157 - "frame.ts"
Cohesion: 0.14
Nodes (21): MoreArrow(), NavArrow(), Props, SLIDE, Walkthrough(), XIcon(), decodedFrames, frameFor() (+13 more)

### Community 158 - "presence/src/index.ts"
Cohesion: 0.67
Nodes (3): fetch(), Env, parseRoom()

### Community 159 - "a/[slug]/page.tsx"
Cohesion: 0.31
Nodes (6): ArtistPage(), dynamic, generateMetadata(), GET(), FollowForm(), getArtistPage()

### Community 161 - "lib/presence.ts"
Cohesion: 0.07
Nodes (19): PresencePreviewPage(), PresencePreview(), Entry, RemoteVisitor, fetchTicket, Presence, RETRY_MS, sameLook() (+11 more)

### Community 163 - "lib/assets.ts"
Cohesion: 0.14
Nodes (20): Loading(), DENSITY_MEDIA, HallPreload(), HallSkeleton(), assetCssVariables(), assetEntry, assetUrl(), assetVariant() (+12 more)

### Community 165 - "Other visitors"
Cohesion: 0.29
Nodes (6): How it plays, Other visitors, Privacy, Running it in production, Running it locally, Staying consistent

### Community 166 - "SketchGuess"
Cohesion: 0.25
Nodes (9): bestKeyFor(), clueUrl(), openingPlan(), pickAtRandom(), prepareSketchGame(), SketchGuess(), StarBurst(), Stars() (+1 more)

### Community 167 - "share.ts"
Cohesion: 0.33
Nodes (5): ShareOutcome, shareResult(), ShareSummary, shareText(), base

### Community 168 - "xdog.ts"
Cohesion: 0.39
Nodes (5): blur(), kernel(), XDOG_DEFAULTS, xdogInk(), XdogOptions

## Knowledge Gaps
- **5 isolated node(s):** `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1064 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **28 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `stage.ts`, `GuestBoard.tsx`, `SketchGuess.tsx`, `app/layout.tsx`, `economy/store.ts`, `query`, `rig.ts`, `Test Fakes and Helpers`, `join-room.ts`, `DecorDrawer`, `slots/store.ts`, `Atelier.tsx`, `bug-report.ts`, `Museum.tsx`, `AssetImage`, `frame.ts`, `Web Package Dependencies`, `a/[slug]/page.tsx`, `lib/presence.ts`, `names.ts`, `useSoundEffects.ts`, `PondGame.tsx`, `(hall)/page.tsx`, `PersonalRoom`, `VitalsReporter.tsx`, `useSound`, `DecorDrawer.tsx`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **What connects `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json` to the rest of the system?**
  _5 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `stage.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.028393452122265683 - nodes in this community are weakly interconnected._
- **Why does `three` connect `hall/room.ts` to `stage.ts`, `createHallRoom`, `scene/assets.ts`, `hit.ts`, `rig.ts`, `scene.ts`, `cozy.ts`, `prepare-models.mjs`, `Web Package Dependencies`, `atelier.ts`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **Should `AtelierRoom` be split into smaller, more focused modules?**
  _Cohesion score 0.10144927536231885 - nodes in this community are weakly interconnected._
- **Why does `Traversal` connect `Traversal` to `stage.ts`, `initialize`, `hall/room.ts`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Should `query` be split into smaller, more focused modules?**
  _Cohesion score 0.06117353308364544 - nodes in this community are weakly interconnected._