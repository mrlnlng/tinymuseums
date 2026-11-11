# Graph Report - tiny-museum  (2026-10-31)

## Corpus Check
- 315 files · ~128,728 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 59 file(s) not represented in the graph (top: .avif 32, .glb 22, .example 1)

## Summary
- 2437 nodes · 5941 edges · 142 communities (114 shown, 28 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 113 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d9867ce4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- member-route.ts
- store.ts
- SketchGuess.tsx
- useHallScene.ts
- remote-visitors.ts
- visits.ts
- domain/guestboard.ts
- Core Asset Manifest
- scene/assets.ts
- Sync Store Persistence
- rig.ts
- actions.ts
- Test Fakes and Helpers
- scene.ts
- useAtelierScene.ts
- api.ts
- buildScene
- SoundProvider.tsx
- src/slots/index.ts
- Amplify Backend Config
- Walkthrough.tsx
- prepare-models.mjs
- worker/src/index.ts
- core/package.json
- domain/guestboard.ts
- Atelier Wardrobe Model
- handlers.ts
- Museum Lazy Overlays
- lib/slots/index.ts
- bugs/page.tsx
- Web Package Dependencies
- reveal.ts
- lib/assets.ts
- audience.ts
- join-room.ts
- amplify/tsconfig.json
- 5. Customization menu — what other people are doing
- Traversal
- core/src/index.ts
- Web TSConfig
- Root Package Manifest
- scene.ts
- gallery/page.tsx
- peers.ts
- Base TSConfig
- Amplify Build Spec
- Worker Loop and Lambda
- SketchGuess
- Fake Sync Server
- env.ts
- exports
- Worker Package Manifest
- Public Asset Manifest
- media/storage.ts
- types.ts
- compose-atelier.mjs
- collage.ts
- domain/guestboard.ts
- [slug]/page.tsx
- performance/page.tsx
- next
- room.ts
- AccountSheet.tsx
- PinnedNotes.tsx
- Handoff: move the Tiny Museum bunny from sprite frames to a rig
- Sound Effect Assets
- react
- Custom HTTP Headers
- Sharp Layer Package
- Multiplayer ("other visitors") — plan v2 (Cloudflare)
- app/layout.tsx
- Other visitors
- useSoundEffects.ts
- AssetImage
- Visits SQL Schema
- Bunny Walk Sprites
- Room Mockup Settings
- Service Worker Caching
- museum/page.tsx
- Lobby Scene Object
- createPresence
- Members SQL Schema
- Frame Window Asset
- Painting Open Sound
- presence/package.json
- Floating Notes Effect
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
- lib/presence.ts
- Item
- ticket.ts
- .webSocketMessage
- graftCostume
- Conn
- 4. Transport: Cloudflare Durable Objects
- The Costume Atelier
- worker/tsconfig.json
- core/tsconfig.json
- Tiny Museum
- How to Design for Failures — ByteByteGo Newsletter
- Worker instructions — DSH headless agents
- Backend
- protocol.ts
- Costume gallery doorway
- Clock
- Assets
- audio/README.md
- .claude/CLAUDE.md
- AccountSheet
- run.ts
- SoundProvider.tsx
- S3Storage
- dependencies
- presence/tsconfig.json
- Storage
- tsconfig.test.json
- VitalsReporter.tsx
- scripts
- xdog.ts
- Cafe
- BunnyArtist.tsx
- Orchestration contract — you plan, DSH workers execute
- focus.ts
- Sitting
- SketchReveal
- HelmShare

## God Nodes (most connected - your core abstractions)
1. `query()` - 54 edges
2. `react` - 46 edges
3. `buildScene()` - 43 edges
4. `SyncStore` - 41 edges
5. `next` - 37 edges
6. `three` - 33 edges
7. `HallScene` - 32 edges
8. `useHallScene()` - 31 edges
9. `queryOne()` - 30 edges
10. `CONFIG` - 26 edges

## Surprising Connections (you probably didn't know these)
- `Code` --references--> `followOutfit()`  [INFERRED]
  docs/costume-atelier.md → apps/web/src/features/hall/scene/wardrobe.ts
- `Fitting clothes to other characters` --references--> `graftCostume()`  [INFERRED]
  docs/costume-atelier.md → apps/web/tooling/graft-costume.mjs
- `2. How the game draws the bunny today (read from the repo, not run)` --references--> `loadScenery()`  [INFERRED]
  docs/bunny-rig-author-handoff.md → apps/web/src/features/hall/scene/assets.ts
- `The worker` --references--> `text()`  [INFERRED]
  CLAUDE.md → apps/web/src/features/hall/scene/atelier.ts
- `Code` --references--> `createRigLayer()`  [INFERRED]
  docs/multiplayer.md → apps/web/src/features/hall/scene/rig.ts

## Import Cycles
- None detected.

## Communities (142 total, 28 thin omitted)

### Community 0 - "member-route.ts"
Cohesion: 0.08
Nodes (61): POST(), POST(), GET(), POST(), POST(), GET(), PER_MEMBER, PUT() (+53 more)

### Community 1 - "store.ts"
Cohesion: 0.19
Nodes (13): ANON_PREFIX, anonKey(), deviceKey(), isMemberSlotKey(), listKeys(), MEMBER_KEY, memberKey(), memberPrefix() (+5 more)

### Community 2 - "SketchGuess.tsx"
Cohesion: 0.17
Nodes (19): BURST, Phase, readDifficulty(), readMode(), saveIfHigher(), SketchGuessProps, DIFFICULTIES, Difficulty (+11 more)

### Community 3 - "useHallScene.ts"
Cohesion: 0.09
Nodes (42): HallHosts, TAP_SLOP_PX, Assets, Scenery, Backdrop, CUTS, disposeBoards(), Mark (+34 more)

### Community 4 - "remote-visitors.ts"
Cohesion: 0.05
Nodes (32): AtelierRoom, ClothingItem, Attachment, Carried, CarriedState, Character, Look, Perch (+24 more)

### Community 5 - "visits.ts"
Cohesion: 0.09
Nodes (33): state(), amount(), duration(), dynamic, LANDMARKS, PAGES, RANGES, share() (+25 more)

### Community 6 - "domain/guestboard.ts"
Cohesion: 0.19
Nodes (16): BugReportHost(), BugReportSheet, BugReportSheet(), send(), Status, collectContext(), inAppBrowser(), onOpenBugReport() (+8 more)

### Community 7 - "Core Asset Manifest"
Cohesion: 0.05
Nodes (41): artworks, audio, file, megabytes, seconds, sourceName, startedAt, bunny (+33 more)

### Community 8 - "scene/assets.ts"
Cohesion: 0.07
Nodes (48): AssetManifest, assetUrl(), bitmapTexture(), blankImage(), CAFE_CAT_FRAMES, CompressedLoader, elementTexture(), ENTRANCE_FILES (+40 more)

### Community 9 - "Sync Store Persistence"
Cohesion: 0.16
Nodes (7): encodeStored(), parseStored(), readStored(), removeStored(), writeStored(), SyncStore, upgrade()

### Community 10 - "rig.ts"
Cohesion: 0.06
Nodes (55): CrowdPreviewPage(), RigPreviewPage(), CrowdPreview(), draw(), KINDS, Stats, Window, NEXT (+47 more)

### Community 11 - "actions.ts"
Cohesion: 0.11
Nodes (43): POST(), UPLOADS_PER_ARTIST, AnalyticsPage(), dynamic, StudioLayout(), dynamic, StudioHome(), back() (+35 more)

### Community 12 - "Test Fakes and Helpers"
Cohesion: 0.11
Nodes (28): deferredFetch(), deviceSlot, FakeEvents, FakeStorage, fixture, fixtureB, fixtureRegistry, fixtureRegistryBoth (+20 more)

### Community 13 - "scene.ts"
Cohesion: 0.10
Nodes (4): HiddenCoin, HallScene, markFirstPainting(), wallSize()

### Community 14 - "useAtelierScene.ts"
Cohesion: 0.06
Nodes (46): AtelierHosts, Options, sparkle(), SPARKLE_TINTS, TAP_SLOP_PX, useAtelierScene(), build(), aim() (+38 more)

### Community 15 - "api.ts"
Cohesion: 0.28
Nodes (11): sameOriginUrl(), PreparedGame, decodeImage(), fetchBitmap(), fetchRound(), guarded(), LoadedRound, loadInk() (+3 more)

### Community 16 - "buildScene"
Cohesion: 0.07
Nodes (10): CafeLink, ComingSoonNote, FunZoneSign, GiftShopSigns, GuestBoardNotes, LobbySigns, Placards, placeLabel() (+2 more)

### Community 17 - "SoundProvider.tsx"
Cohesion: 0.16
Nodes (12): BackgroundMusic, clampVolume(), isDocumentHidden(), Options, useBackgroundMusic(), VISIBILITY_EVENTS, isRouted(), isSameOrigin() (+4 more)

### Community 18 - "src/slots/index.ts"
Cohesion: 0.11
Nodes (32): WalkAlone(), defineSlot(), docBytes(), slotDef(), SLOTS, byAtThenKey(), encoded(), latest (+24 more)

### Community 19 - "Amplify Backend Config"
Cohesion: 0.08
Nodes (26): amplifyDir, backend, everyMinutes, mediaBucket, missing, repoRoot, REQUIRED, setting() (+18 more)

### Community 20 - "Walkthrough.tsx"
Cohesion: 0.13
Nodes (22): MoreArrow(), NavArrow(), Props, SLIDE, Walkthrough(), XIcon(), decodedFrames, frameFor() (+14 more)

### Community 21 - "prepare-models.mjs"
Cohesion: 0.16
Nodes (15): paintedCostume(), atelier, bunny, floralOutfits(), image(), manifest, master(), models (+7 more)

### Community 22 - "worker/src/index.ts"
Cohesion: 0.27
Nodes (13): loop(), shutdown(), sleep(), sweepStale(), DrainResult, handler(), repairFrames(), repairUnframed() (+5 more)

### Community 23 - "core/package.json"
Cohesion: 0.16
Nodes (13): devDependencies, @types/bcryptjs@^2.4.6, @types/pg@^8.11.10, main, name, private, scripts, typecheck (+5 more)

### Community 24 - "domain/guestboard.ts"
Cohesion: 0.13
Nodes (23): BoardScreen(), ComposeScreen(), ComposeScreenProps, blankDraft(), GuestBoard(), GuestBoardProps, View, ReadScreen() (+15 more)

### Community 25 - "Atelier Wardrobe Model"
Cohesion: 0.14
Nodes (24): aspectOf(), AtelierActions, AtelierImage, Cardigan, CARDIGAN_ART, CARDIGAN_NAMES, CHARACTER_NAMES, createAtelierRoom() (+16 more)

### Community 26 - "handlers.ts"
Cohesion: 0.19
Nodes (19): confirmedFollowers(), handleDerivatives(), handleNotifyFollowers(), handleRenderDisplay(), handleSealEpoch(), renderPieceFrame(), renderPieceSketch(), runJob() (+11 more)

### Community 27 - "Museum Lazy Overlays"
Cohesion: 0.18
Nodes (19): PinnedNotes(), CoinFound, GuestBoard, HelpGuide, loadCoinFound(), loadGuestBoard(), loadHelpGuide(), loadSketchGuess() (+11 more)

### Community 28 - "lib/slots/index.ts"
Cohesion: 0.09
Nodes (12): KeepOnOtherDevices(), Probe(), StoredSlot, defaultEnv(), defaultStore(), EventTargetLike, MemberInfo, SlotHandle (+4 more)

### Community 29 - "bugs/page.tsx"
Cohesion: 0.17
Nodes (14): BugReportsPage(), dateFormat, dynamic, summary(), dateFormat, dynamic, GuestBoardPage(), Register() (+6 more)

### Community 30 - "Web Package Dependencies"
Cohesion: 0.10
Nodes (26): dependencies, embla-carousel-react@^8.6.0, next@^15.0.3, react@^19.0.0, react-dom@^19.0.0, swr@^2.5.1, three@^0.169.0, thumbhash@^0.1.1 (+18 more)

### Community 31 - "reveal.ts"
Cohesion: 0.22
Nodes (9): openingPlan(), prepareSketchGame(), InkMap, planGame(), randomRound(), ROUND_SPREAD, createReveal(), PENCIL (+1 more)

### Community 32 - "lib/assets.ts"
Cohesion: 0.15
Nodes (20): Loading(), DENSITY_MEDIA, HallPreload(), HallSkeleton(), loadCompressed(), loadSheets(), assetCssVariables(), assetEntry (+12 more)

### Community 33 - "audience.ts"
Cohesion: 0.13
Nodes (20): ALLOWED, POST(), ConfirmFollow(), dynamic, dynamic, Unsubscribe(), GET(), FollowNotice() (+12 more)

### Community 34 - "join-room.ts"
Cohesion: 0.06
Nodes (50): ChatButton(), REFUSED, joinRoom(), Pose, STANDING, announceNameChange(), emit(), getPeople() (+42 more)

### Community 35 - "amplify/tsconfig.json"
Cohesion: 0.20
Nodes (9): compilerOptions, module, moduleResolution, noUnusedLocals, noUnusedParameters, exclude, extends, include (+1 more)

### Community 36 - "5. Customization menu — what other people are doing"
Cohesion: 0.12
Nodes (16): 1. The target: what "Claude Opus 5.5" actually means, 2. Where your harness stands today (live config I read), 3. The honest gap model, 4. Quality levers, ranked by leverage, 5. Customization menu — what other people are doing, 6. Recommended starting kit for *your* profile, 7. What I can apply for you right now (needs your go-ahead), A. Prompt & persona (most common quality customizations) (+8 more)

### Community 38 - "core/src/index.ts"
Cohesion: 0.15
Nodes (34): Code, 3.2 Chosen names (members), registry, started(), AuthedArtist, hashPassword(), newToken(), uniqueSlug() (+26 more)

### Community 39 - "Web TSConfig"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 40 - "Root Package Manifest"
Cohesion: 0.07
Nodes (35): description, devDependencies, concurrently@^9.1.0, esbuild@^0.24.0, ktx2-encoder@^0.6.0, maxrects-packer@^2.7.3, playwright@^1.63.0, @types/node@^22.9.0 (+27 more)

### Community 41 - "scene.ts"
Cohesion: 0.09
Nodes (20): disposeDisplayTexture(), HELM_PEDESTAL_FILE, loadDisplayTexture(), prefersAvif(), cafeAfterIndex(), comingSoonWidth(), computeLayout(), HallLayout (+12 more)

### Community 42 - "gallery/page.tsx"
Cohesion: 0.17
Nodes (20): dynamic, GalleryPage(), createCodeAction(), deleteCodeAction(), hangAction(), movePieceAction(), unhangAction(), FloorControls() (+12 more)

### Community 43 - "peers.ts"
Cohesion: 0.14
Nodes (7): INTERPOLATION_DELAY_MS, PEER_TIMEOUT_MS, PeerTable, positionAt(), Sample, look, Peer

### Community 44 - "Base TSConfig"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, lib, module, moduleResolution (+9 more)

### Community 45 - "Amplify Build Spec"
Cohesion: 0.12
Nodes (16): applications, appRoot, backend, frontend, baseDirectory, files, phases, commands (+8 more)

### Community 46 - "Worker Loop and Lambda"
Cohesion: 0.11
Nodes (28): GET(), GET(), sketchPool, unavailable(), currentEpoch(), ensureEpoch(), epochById(), getHallSlice() (+20 more)

### Community 47 - "SketchGuess"
Cohesion: 0.18
Nodes (11): bestKeyFor(), clueUrl(), pickAtRandom(), SketchGuess(), StarBurst(), Stars(), ShareOutcome, shareResult() (+3 more)

### Community 48 - "Fake Sync Server"
Cohesion: 0.20
Nodes (3): FakeServer, SlotState, SlotDef

### Community 49 - "env.ts"
Cohesion: 0.11
Nodes (15): SCHEMA_DIR, BRAND, env, isProduction(), presenceSecret(), repoRoot, required(), sessionSecret() (+7 more)

### Community 50 - "exports"
Cohesion: 0.18
Nodes (11): exports, ./brand, ./bugs, ./guestboard, ./presence, ./presence/messages, ./presence/wire, ./random (+3 more)

### Community 51 - "Worker Package Manifest"
Cohesion: 0.14
Nodes (14): dependencies, @tiny/core@*, exports, ./lambda, @tiny/core, main, name, private (+6 more)

### Community 52 - "Public Asset Manifest"
Cohesion: 0.12
Nodes (15): artworks, bunny, size, floor, size, fonts, icon-no-photos, size (+7 more)

### Community 53 - "media/storage.ts"
Cohesion: 0.18
Nodes (16): CONTENT_TYPES, GET(), POST(), UPLOADS_PER_ARTIST, PUT(), ACCEPTED, createAssetFromUpload(), MAX_UPLOAD_BYTES (+8 more)

### Community 54 - "types.ts"
Cohesion: 0.11
Nodes (26): listPieces(), pieceImageUrl(), PieceRow, toPieceDto(), EpochRow, GalleryRow, planSketchRound(), SKETCH_CHOICES (+18 more)

### Community 55 - "compose-atelier.mjs"
Cohesion: 0.17
Nodes (7): body, dressLayer, MANNEQUIN_CANVAS, mask, root, sourceSize, torso

### Community 56 - "collage.ts"
Cohesion: 0.22
Nodes (10): FRAME_AVIF_SINCE, FRAME_FORMAT, FRAME_VERSION, FrameManifest, FrameSpec, loadFrameAssets(), loadPieceFrames(), PX_PER_UNIT (+2 more)

### Community 57 - "domain/guestboard.ts"
Cohesion: 0.12
Nodes (23): BugReport, BugReportDto, BugReportRejected, BugRow, CONTEXT_KEYS, EVERYONE, normalizeBugPage(), parseBugReport() (+15 more)

### Community 58 - "[slug]/page.tsx"
Cohesion: 0.31
Nodes (6): ArtistPage(), dynamic, generateMetadata(), GET(), FollowForm(), getArtistPage()

### Community 59 - "performance/page.tsx"
Cohesion: 0.27
Nodes (9): dynamic, format(), grade(), METRICS, PAGES, PerformancePage(), RANGES, summarizeVitals() (+1 more)

### Community 60 - "next"
Cohesion: 0.15
Nodes (14): config, SECURITY_HEADERS, motion@^13.1.1, Loading(), AtelierPage(), metadata, Atelier(), AtelierLoading() (+6 more)

### Community 61 - "room.ts"
Cohesion: 0.15
Nodes (27): admitted(), Attachment, farewell(), GHOST_MS, HELLO_TIMEOUT_MS, holdsOf(), MAX_WAITING_PER_IP, newAttachment() (+19 more)

### Community 62 - "AccountSheet.tsx"
Cohesion: 0.27
Nodes (8): AccountHost(), AccountSheet, Mode, NAME_ERRORS, Pending, View, onOpenAccount(), NameError

### Community 63 - "PinnedNotes.tsx"
Cohesion: 0.33
Nodes (6): BoardScreenProps, PinnedNotesProps, ReadScreenProps, NOTE_PLACES, NotePlace, GuestNoteDto

### Community 64 - "Handoff: move the Tiny Museum bunny from sprite frames to a rig"
Cohesion: 0.15
Nodes (11): 1. What is in this bundle, 2. How the game draws the bunny today (read from the repo, not run), 3. The rig, 5. Blender-side work still to do (needs Blender; the author has it with an MCP bridge), 6. Open questions for the author, Handoff: move the Tiny Museum bunny from sprite frames to a rig, Approved v4 bunny in the hall, Assets (+3 more)

### Community 65 - "Sound Effect Assets"
Cohesion: 0.22
Nodes (9): file, kilobytes, seconds, file, kilobytes, seconds, soundEffects, click (+1 more)

### Community 66 - "react"
Cohesion: 0.24
Nodes (10): openAccount(), openBugReport(), fitWidth(), HelpGuide(), HelpGuideProps, STEPS, SoundToggle(), SettingsMenu() (+2 more)

### Community 67 - "Custom HTTP Headers"
Cohesion: 0.25
Nodes (7): applications, appRoot, customHeaders, headers, pattern, key, value

### Community 68 - "Sharp Layer Package"
Cohesion: 0.33
Nodes (6): dependencies, sharp@^0.33.5, description, sharp, name, private

### Community 69 - "Multiplayer ("other visitors") — plan v2 (Cloudflare)"
Cohesion: 0.14
Nodes (14): ScreenChrome(), 0. Summary, 10. Decisions, 1. Product contract changes (approved 2026-10-31), 2. What already exists that this builds on, 3.1 Generated names (everyone has one), 3. Names, 5.1 Emotes (v1) (+6 more)

### Community 70 - "app/layout.tsx"
Cohesion: 0.18
Nodes (12): bethEllen, inspiratiq, metadata, notoSans, RootLayout(), sniglet, viewport, SoundProvider() (+4 more)

### Community 71 - "Other visitors"
Cohesion: 0.29
Nodes (6): How it plays, Other visitors, Privacy, Running it in production, Running it locally, Staying consistent

### Community 72 - "useSoundEffects.ts"
Cohesion: 0.19
Nodes (15): EFFECTS, EffectSpec, FOOTSTEPS, SoundEffects, useSoundEffects(), gestured(), OPTIONS, applyMix() (+7 more)

### Community 73 - "AssetImage"
Cohesion: 0.36
Nodes (5): coin, CoinFound(), CoinFoundProps, AssetImage(), ImgProps

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

### Community 78 - "museum/page.tsx"
Cohesion: 0.24
Nodes (11): dynamic, Hall(), MuseumPage(), CurrentlyShowing(), dynamic, GUIDELINES, LandingPage(), EMPTY (+3 more)

### Community 80 - "createPresence"
Cohesion: 0.19
Nodes (13): createPresence(), drop(), heartbeat(), maybeSend(), onPageHide(), receive(), scheduleRetry(), send() (+5 more)

### Community 81 - "Members SQL Schema"
Cohesion: 0.70
Nodes (4): member_sessions, member_sessions_member, member_slots, members

### Community 82 - "Frame Window Asset"
Cohesion: 0.50
Nodes (4): frame, size, window, windowAspect

### Community 83 - "Painting Open Sound"
Cohesion: 0.50
Nodes (4): file, kilobytes, seconds, painting-open

### Community 84 - "presence/package.json"
Cohesion: 0.14
Nodes (16): dependencies, @tiny/core@*, devDependencies, @cloudflare/workers-types@5.20261016.1, wrangler@4.151.1, @tiny/core, name, private (+8 more)

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

### Community 104 - "lib/presence.ts"
Cohesion: 0.08
Nodes (22): PresencePreviewPage(), PresencePreview(), Entry, RemoteVisitor, Connect, fetchTicket, HEARTBEAT_MS, HIDDEN_LIMIT_MS (+14 more)

### Community 105 - "Item"
Cohesion: 0.16
Nodes (4): Room, Presence, Item, Refusal

### Community 106 - "ticket.ts"
Cohesion: 0.15
Nodes (16): fetch(), Env, parseRoom(), decoder, encoder, fromBase64Url(), HmacKey, isTicket() (+8 more)

### Community 107 - ".webSocketMessage"
Cohesion: 0.44
Nodes (3): attachmentOf(), Room, sendTo()

### Community 108 - "graftCostume"
Cohesion: 0.27
Nodes (14): canvasFit(), compose(), graftCostume(), copyAccessor(), copyMaterial(), copyMesh(), copyTexture(), copyView() (+6 more)

### Community 109 - "Conn"
Cohesion: 0.35
Nodes (3): connectWebSocket(), SocketHandlers, Conn

### Community 110 - "4. Transport: Cloudflare Durable Objects"
Cohesion: 0.25
Nodes (8): 4. Transport: Cloudflare Durable Objects, Decision (2026-10-31), Deploying, Identity cannot be forged, Local development and tests, Rooms and capacity, Shape of `apps/presence` (about 200 lines), main()

### Community 111 - "The Costume Atelier"
Cohesion: 0.17
Nodes (11): Adding a character, Adding a costume, Art not supplied as files, Code, Costume fit review, Fitting clothes to other characters, Floral collection, How it plays (+3 more)

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
Cohesion: 0.50
Nodes (3): graphify-first codebase navigation, Keep the graph current, Worker instructions — DSH headless agents

### Community 117 - "Backend"
Cohesion: 0.50
Nodes (3): AWS prerequisites, Backend, Deploying by hand

### Community 118 - "protocol.ts"
Cohesion: 0.25
Nodes (15): isItem(), isName(), isPid(), isSeq(), MAX_HOLDS, MAX_INSTANCE, MAX_MESSAGE_BYTES, parseClientMessage() (+7 more)

### Community 119 - "Costume gallery doorway"
Cohesion: 0.50
Nodes (3): Costume gallery doorway, Curtain colour edit, Prompt

### Community 124 - "AccountSheet"
Cohesion: 0.29
Nodes (9): AccountSheet(), continueAnyway(), doSignOut(), runDelete(), runName(), submit(), submitDelete(), submitName() (+1 more)

### Community 125 - "run.ts"
Cohesion: 0.17
Nodes (9): admin, childEnv, client, database, fresh, migrations, target, pg@^8.13.1 (+1 more)

### Community 126 - "SoundProvider.tsx"
Cohesion: 0.38
Nodes (5): SoundContext, SoundState, EffectName, STATIC_BASE, staticUrl()

### Community 128 - "dependencies"
Cohesion: 0.15
Nodes (13): dependencies, @aws-sdk/client-s3@^3.1121.0, @aws-sdk/s3-request-presigner@^3.1121.0, bcryptjs@^2.4.3, obscenity@^0.4.6, sharp@^0.33.5, thumbhash@^0.1.1, sharp (+5 more)

### Community 129 - "presence/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, types, exclude, extends, include, ../../tsconfig.base.json

### Community 131 - "tsconfig.test.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 132 - "VitalsReporter.tsx"
Cohesion: 0.29
Nodes (8): firstPainting(), flush(), Metric, queue, REPORTED, VitalsReporter(), FIRST_PAINTING_MARK, MUSEUM_START_MARK

### Community 133 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, assets:models, build, dev, start, typecheck

### Community 134 - "xdog.ts"
Cohesion: 0.27
Nodes (7): renderSketch(), blur(), kernel(), toGray(), XDOG_DEFAULTS, xdogInk(), XdogOptions

### Community 136 - "BunnyArtist.tsx"
Cohesion: 0.40
Nodes (5): BunnyArtist(), BunnyMood, Pencil(), POSES, 4. Suggested plan

### Community 137 - "Orchestration contract — you plan, DSH workers execute"
Cohesion: 0.29
Nodes (6): Briefing a worker, Budget hygiene, graphify, Orchestration contract — you plan, DSH workers execute, The worker, When not to delegate

## Knowledge Gaps
- **5 isolated node(s):** `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 780 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **28 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `SketchGuess.tsx`, `useHallScene.ts`, `VitalsReporter.tsx`, `domain/guestboard.ts`, `rig.ts`, `Test Fakes and Helpers`, `useAtelierScene.ts`, `SoundProvider.tsx`, `Walkthrough.tsx`, `domain/guestboard.ts`, `Museum Lazy Overlays`, `lib/slots/index.ts`, `Web Package Dependencies`, `join-room.ts`, `gallery/page.tsx`, `[slug]/page.tsx`, `next`, `AccountSheet.tsx`, `app/layout.tsx`, `useSoundEffects.ts`, `AssetImage`, `museum/page.tsx`, `lib/presence.ts`, `SoundProvider.tsx`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `buildScene()` (e.g. with `enterAtelier()` and `handleClick()`) actually correct?**
  _`buildScene()` has 5 INFERRED edges - model-reasoned connections that need verification._
- **What connects `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json` to the rest of the system?**
  _5 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `member-route.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0774281805745554 - nodes in this community are weakly interconnected._
- **Why does `Item` connect `Item` to `join-room.ts`, `useHallScene.ts`, `lib/presence.ts`, `protocol.ts`, `room.ts`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Should `useHallScene.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0937766410912191 - nodes in this community are weakly interconnected._
- **Why does `three` connect `useHallScene.ts` to `join-room.ts`, `remote-visitors.ts`, `scene/assets.ts`, `scene.ts`, `rig.ts`, `useAtelierScene.ts`, `prepare-models.mjs`, `Atelier Wardrobe Model`, `Web Package Dependencies`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._