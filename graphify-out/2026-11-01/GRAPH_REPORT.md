# Graph Report - tiny-museum  (2026-11-01)

## Corpus Check
- 354 files · ~147,358 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 64 file(s) not represented in the graph (top: .avif 32, .glb 25, .css 3)

## Summary
- 2723 nodes · 6875 edges · 144 communities (115 shown, 29 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 125 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `000f8f37`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- member-route.ts
- ColorRecall.tsx
- SketchGuess.tsx
- useHallScene.ts
- economy/store.ts
- visits.ts
- rules.ts
- Core Asset Manifest
- scene/assets.ts
- Sync Store Persistence
- rig.ts
- gallery/page.tsx
- Test Fakes and Helpers
- HallScene
- useAtelierScene.ts
- actions.ts
- Placards
- domain/guestboard.ts
- src/slots/index.ts
- Amplify Backend Config
- Walkthrough.tsx
- prepare-models.mjs
- db.ts
- core/package.json
- ReadScreen.tsx
- createAtelierRoom
- features/economy/index.ts
- Museum Lazy Overlays
- loadAssets
- hit.ts
- Web Package Dependencies
- Gamifying Tiny Museum — genre direction & engagement research
- bug-reports.ts
- confirm/page.tsx
- room-events.ts
- amplify/tsconfig.json
- 5. Customization menu — what other people are doing
- domain/sketch.ts
- core/src/index.ts
- Web TSConfig
- Root Package Manifest
- GuestBoard.tsx
- useBackgroundMusic.ts
- peers.ts
- Base TSConfig
- Amplify Build Spec
- epoch.ts
- next
- Fake Sync Server
- lib/assets.ts
- exports
- Worker Package Manifest
- Public Asset Manifest
- media/storage.ts
- handlers.ts
- compose-atelier.mjs
- names.ts
- atelier.ts
- Traversal
- AtelierRoom
- AtelierKeeps.tsx
- room.ts
- frame.ts
- track
- Handoff: move the Tiny Museum bunny from sprite frames to a rig
- Sound Effect Assets
- react
- Custom HTTP Headers
- Sharp Layer Package
- builtUrl
- app/layout.tsx
- ComposeScreen.tsx
- round.ts
- reveal.ts
- Visits SQL Schema
- Bunny Walk Sprites
- Room Mockup Settings
- Service Worker Caching
- S3Storage
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
- lib/presence.ts
- Item
- ticket.ts
- .webSocketMessage
- graftCostume
- Conn
- s3-storage.ts
- The Costume Atelier
- worker/tsconfig.json
- core/tsconfig.json
- Tiny Museum
- How to Design for Failures — ByteByteGo Newsletter
- Worker instructions — DSH headless agents
- Backend
- protocol.ts
- Costume gallery doorway
- Carried
- Assets
- audio/README.md
- .claude/CLAUDE.md
- CameraRig
- run.ts
- GuestBoard
- RemoteVisitors
- dependencies
- presence/tsconfig.json
- lib/slots/index.ts
- tsconfig.test.json
- HelmShare
- Cafe
- Orchestration contract — you plan, DSH workers execute
- outbox.test.ts
- useHallScene.ts
- catalog.ts
- wardrobe.ts
- pedestal.ts
- FilesystemStorage
- ensureStarted
- AssetImage
- Sitting

## God Nodes (most connected - your core abstractions)
1. `query()` - 57 edges
2. `react` - 51 edges
3. `buildScene()` - 44 edges
4. `SyncStore` - 41 edges
5. `next` - 37 edges
6. `useHallScene()` - 34 edges
7. `three` - 33 edges
8. `HallScene` - 32 edges
9. `queryOne()` - 32 edges
10. `createAtelierRoom()` - 31 edges

## Surprising Connections (you probably didn't know these)
- `Code` --references--> `followOutfit()`  [INFERRED]
  docs/costume-atelier.md → apps/web/src/features/hall/scene/wardrobe.ts
- `Fitting clothes to other characters` --references--> `graftCostume()`  [INFERRED]
  docs/costume-atelier.md → apps/web/tooling/graft-costume.mjs
- `5. Protocol (`packages/core/src/presence/protocol.ts`)` --references--> `leave()`  [INFERRED]
  docs/multiplayer-plan.md → apps/web/src/features/hall/components/Atelier.tsx
- `2. How the game draws the bunny today (read from the repo, not run)` --references--> `loadScenery()`  [INFERRED]
  docs/bunny-rig-author-handoff.md → apps/web/src/features/hall/scene/assets.ts
- `The worker` --references--> `text()`  [INFERRED]
  CLAUDE.md → apps/web/src/features/hall/scene/atelier.ts

## Import Cycles
- None detected.

## Communities (144 total, 29 thin omitted)

### Community 0 - "member-route.ts"
Cohesion: 0.06
Nodes (83): POST(), POST(), POST(), POST(), GET(), PER_MEMBER, PUT(), POST() (+75 more)

### Community 1 - "ColorRecall.tsx"
Cohesion: 0.17
Nodes (17): ColorRecall(), ColorRecallProps, Phase, readBest(), ColorRound, showMs(), loadColorRecall(), saveIfHigher() (+9 more)

### Community 2 - "SketchGuess.tsx"
Cohesion: 0.10
Nodes (32): bestKeyFor(), BURST, clueUrl(), openingPlan(), Phase, pickAtRandom(), prepareSketchGame(), readDifficulty() (+24 more)

### Community 3 - "useHallScene.ts"
Cohesion: 0.06
Nodes (50): HallHosts, takenStands(), TAP_SLOP_PX, useHallScene(), buildScene(), fetchNextSlice(), openingReady(), recordDisplayView() (+42 more)

### Community 4 - "economy/store.ts"
Cohesion: 0.16
Nodes (26): CARRY_CAP, carryAdd(), CarryEntry, carryPrune(), carryRemove(), chunk(), ClaimRequest, tzOffsetNow() (+18 more)

### Community 5 - "visits.ts"
Cohesion: 0.11
Nodes (26): state(), amount(), duration(), dynamic, LANDMARKS, PAGES, RANGES, share() (+18 more)

### Community 6 - "rules.ts"
Cohesion: 0.18
Nodes (15): localDay(), at(), GAME_DAILY_CAP, GameId, GAMES, includes(), isRecord(), offsetOf() (+7 more)

### Community 7 - "Core Asset Manifest"
Cohesion: 0.05
Nodes (41): artworks, audio, file, megabytes, seconds, sourceName, startedAt, bunny (+33 more)

### Community 8 - "scene/assets.ts"
Cohesion: 0.09
Nodes (25): sameOriginUrl(), AssetManifest, bitmapTexture(), blankImage(), CAFE_CAT_FRAMES, CharacterSprites, CompressedLoader, elementTexture() (+17 more)

### Community 9 - "Sync Store Persistence"
Cohesion: 0.11
Nodes (20): ANON_PREFIX, anonKey(), deviceKey(), encodeStored(), isMemberSlotKey(), listKeys(), MEMBER_KEY, memberKey() (+12 more)

### Community 10 - "rig.ts"
Cohesion: 0.05
Nodes (63): CrowdPreviewPage(), RigPreviewPage(), CrowdPreview(), draw(), KINDS, Stats, Window, NEXT (+55 more)

### Community 11 - "gallery/page.tsx"
Cohesion: 0.15
Nodes (24): AnalyticsPage(), dynamic, dynamic, GalleryPage(), createCodeAction(), deleteCodeAction(), hangAction(), movePieceAction() (+16 more)

### Community 12 - "Test Fakes and Helpers"
Cohesion: 0.10
Nodes (29): fixture(), deferredFetch(), deviceSlot, FakeEvents, FakeStorage, fixture, fixtureB, fixtureRegistry (+21 more)

### Community 13 - "HallScene"
Cohesion: 0.07
Nodes (17): disposeDisplayTexture(), prefersAvif(), HiddenCoin, cafeAfterIndex(), comingSoonWidth(), computeLayout(), HallLayout, hasPedestal() (+9 more)

### Community 14 - "useAtelierScene.ts"
Cohesion: 0.12
Nodes (23): AtelierHosts, Options, sparkle(), SPARKLE_TINTS, TAP_SLOP_PX, useAtelierScene(), build(), aim() (+15 more)

### Community 15 - "actions.ts"
Cohesion: 0.09
Nodes (52): back(), deleteGuestNoteAction(), deletePieceAction(), isThrottled(), publishAction(), registerAction(), setBugReportResolvedAction(), signInAction() (+44 more)

### Community 16 - "Placards"
Cohesion: 0.23
Nodes (4): GuestBoardNotes, Placards, toScreen(), writeStyle()

### Community 17 - "domain/guestboard.ts"
Cohesion: 0.19
Nodes (14): GET(), decodeCursor(), encodeCursor(), enforceLimits(), GuestNoteInput, GuestNoteRateLimited, GuestNoteRejected, listGuestNotes() (+6 more)

### Community 18 - "src/slots/index.ts"
Cohesion: 0.12
Nodes (29): defineSlot(), docBytes(), SLOTS, byAtThenKey(), encoded(), latest, mapOf(), maxNumber() (+21 more)

### Community 19 - "Amplify Backend Config"
Cohesion: 0.08
Nodes (26): amplifyDir, backend, everyMinutes, mediaBucket, missing, repoRoot, REQUIRED, setting() (+18 more)

### Community 20 - "Walkthrough.tsx"
Cohesion: 0.24
Nodes (12): MoreArrow(), NavArrow(), Props, SLIDE, Walkthrough(), XIcon(), frameFor(), isFrameReady() (+4 more)

### Community 21 - "prepare-models.mjs"
Cohesion: 0.15
Nodes (18): paintedCostume(), atelier, bunny, floralOutfits(), goldOutfits(), HEADPIECES, image(), manifest (+10 more)

### Community 22 - "db.ts"
Cohesion: 0.10
Nodes (32): loop(), shutdown(), sleep(), sweepStale(), DrainResult, handler(), repairFrames(), deletePiece() (+24 more)

### Community 23 - "core/package.json"
Cohesion: 0.16
Nodes (13): devDependencies, @types/bcryptjs@^2.4.6, @types/pg@^8.11.10, main, name, private, scripts, typecheck (+5 more)

### Community 24 - "ReadScreen.tsx"
Cohesion: 0.21
Nodes (11): BoardScreenProps, PinnedNotesProps, ReadScreenProps, messageLength(), StickyNote(), StickyNoteProps, NOTE_PLACES, NotePlace (+3 more)

### Community 25 - "createAtelierRoom"
Cohesion: 0.24
Nodes (14): aspectOf(), AtelierActions, createAtelierRoom(), control(), form(), picture(), place(), priceTag() (+6 more)

### Community 26 - "features/economy/index.ts"
Cohesion: 0.14
Nodes (20): Toast, serverSnapshot, useEarnEvents(), buildClaim(), BuiltClaim, EarnDetail, EarnSource, florinLabel() (+12 more)

### Community 27 - "Museum Lazy Overlays"
Cohesion: 0.10
Nodes (30): Loading(), AtelierLoading(), coin, CoinFound(), CoinFoundProps, CoinFound, ColorRecall, GameDesktop (+22 more)

### Community 28 - "loadAssets"
Cohesion: 0.21
Nodes (17): assetUrl(), inSheets(), loadAssets(), loadCharacterSprites(), loadCompressed(), loadMasks(), loadRetrying(), loadScenery() (+9 more)

### Community 29 - "hit.ts"
Cohesion: 0.19
Nodes (11): CoinWall, createHiddenCoin(), Spot, AlphaMap, alphaMapFor(), alphaMaps, buildAlphaMap(), isPaintedAt() (+3 more)

### Community 30 - "Web Package Dependencies"
Cohesion: 0.07
Nodes (33): dependencies, embla-carousel-react@^8.6.0, motion@^13.1.1, next@^15.0.3, react@^19.0.0, react-dom@^19.0.0, swr@^2.5.1, three@^0.169.0 (+25 more)

### Community 31 - "Gamifying Tiny Museum — genre direction & engagement research"
Cohesion: 0.10
Nodes (19): 0.1 The core experience, 0.2 Systems that make gamification cheap to build, 0.3 Constraints that shape any recommendation, 0. What the game is today (the deep dive), 1.1 The landscape (seven candidates, with verdicts), 1.2 Recommendation: a **cozy gallery life-sim** — "the gallery you live in", 1.3 The five design pillars the genre implies, 1. Genre direction (+11 more)

### Community 32 - "bug-reports.ts"
Cohesion: 0.08
Nodes (35): AccountSheet(), continueAnyway(), doSignOut(), runDelete(), runName(), submit(), submitDelete(), submitName() (+27 more)

### Community 33 - "confirm/page.tsx"
Cohesion: 0.33
Nodes (7): ConfirmFollow(), dynamic, dynamic, Unsubscribe(), FollowNotice(), confirmFollow(), unsubscribe()

### Community 34 - "room-events.ts"
Cohesion: 0.05
Nodes (50): ChatButton(), REFUSED, joinRoom(), emit(), getPeople(), isInRoom(), isMuted(), muted (+42 more)

### Community 35 - "amplify/tsconfig.json"
Cohesion: 0.20
Nodes (9): compilerOptions, module, moduleResolution, noUnusedLocals, noUnusedParameters, exclude, extends, include (+1 more)

### Community 36 - "5. Customization menu — what other people are doing"
Cohesion: 0.12
Nodes (16): 1. The target: what "Claude Opus 5.5" actually means, 2. Where your harness stands today (live config I read), 3. The honest gap model, 4. Quality levers, ranked by leverage, 5. Customization menu — what other people are doing, 6. Recommended starting kit for *your* profile, 7. What I can apply for you right now (needs your go-ahead), A. Prompt & persona (most common quality customizations) (+8 more)

### Community 37 - "domain/sketch.ts"
Cohesion: 0.09
Nodes (30): listPieces(), pieceImageUrl(), PieceRow, toPieceDto(), GalleryRow, planSketchRound(), SKETCH_CHOICES, SketchCandidate (+22 more)

### Community 38 - "core/src/index.ts"
Cohesion: 0.08
Nodes (39): ArtistPage(), dynamic, generateMetadata(), GET(), ALLOWED, POST(), GET(), FollowForm() (+31 more)

### Community 39 - "Web TSConfig"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 40 - "Root Package Manifest"
Cohesion: 0.07
Nodes (35): description, devDependencies, concurrently@^9.1.0, esbuild@^0.24.0, ktx2-encoder@^0.6.0, maxrects-packer@^2.7.3, playwright@^1.63.0, @types/node@^22.9.0 (+27 more)

### Community 41 - "GuestBoard.tsx"
Cohesion: 0.23
Nodes (11): ComposeScreen(), blankDraft(), GuestBoard(), GuestBoardProps, View, ReadScreen(), fetchPage(), Options (+3 more)

### Community 42 - "useBackgroundMusic.ts"
Cohesion: 0.12
Nodes (20): EFFECTS, EffectSpec, FOOTSTEPS, SoundEffects, useSoundEffects(), gestured(), OPTIONS, applyMix() (+12 more)

### Community 43 - "peers.ts"
Cohesion: 0.11
Nodes (13): PresencePreviewPage(), PresencePreview(), Entry, INTERPOLATION_DELAY_MS, PEER_TIMEOUT_MS, PeerTable, positionAt(), RemoteVisitor (+5 more)

### Community 44 - "Base TSConfig"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, lib, module, moduleResolution (+9 more)

### Community 45 - "Amplify Build Spec"
Cohesion: 0.12
Nodes (16): applications, appRoot, backend, frontend, baseDirectory, files, phases, commands (+8 more)

### Community 46 - "epoch.ts"
Cohesion: 0.11
Nodes (26): GET(), GET(), sketchPool, unavailable(), dynamic, Hall(), MuseumPage(), CurrentlyShowing() (+18 more)

### Community 47 - "next"
Cohesion: 0.08
Nodes (35): config, SECURITY_HEADERS, BugReportsPage(), dateFormat, dynamic, summary(), dateFormat, dynamic (+27 more)

### Community 48 - "Fake Sync Server"
Cohesion: 0.18
Nodes (3): FakeServer, SlotState, SlotDef

### Community 49 - "lib/assets.ts"
Cohesion: 0.16
Nodes (11): assetCssVariables(), assetEntry, assetVariant(), AtlasGroup, AtlasSheet, BuiltImage, CSS_IMAGES, cssVariableName() (+3 more)

### Community 50 - "exports"
Cohesion: 0.17
Nodes (12): exports, ./brand, ./bugs, ./economy, ./guestboard, ./presence, ./presence/messages, ./presence/wire (+4 more)

### Community 51 - "Worker Package Manifest"
Cohesion: 0.14
Nodes (14): dependencies, @tiny/core@*, exports, ./lambda, @tiny/core, main, name, private (+6 more)

### Community 52 - "Public Asset Manifest"
Cohesion: 0.12
Nodes (15): artworks, bunny, size, floor, size, fonts, icon-no-photos, size (+7 more)

### Community 53 - "media/storage.ts"
Cohesion: 0.08
Nodes (33): CONTENT_TYPES, GET(), POST(), UPLOADS_PER_ARTIST, POST(), UPLOADS_PER_ARTIST, PUT(), currentArtist() (+25 more)

### Community 54 - "handlers.ts"
Cohesion: 0.07
Nodes (43): AnalyticsSummary, confirmedFollowers(), createInquiry(), follow(), ResolvedToken, sealEpoch(), handleDerivatives(), handleNotifyFollowers() (+35 more)

### Community 55 - "compose-atelier.mjs"
Cohesion: 0.17
Nodes (7): body, dressLayer, MANNEQUIN_CANVAS, mask, root, sourceSize, torso

### Community 56 - "names.ts"
Cohesion: 0.11
Nodes (22): Code, How it plays, Other visitors, Privacy, Running it in production, Running it locally, Staying consistent, checkMessage() (+14 more)

### Community 57 - "atelier.ts"
Cohesion: 0.20
Nodes (11): AtelierImage, Cardigan, CARDIGAN_ART, CARDIGAN_NAMES, CHARACTER_NAMES, cardiganItem(), isCardigan(), itemName() (+3 more)

### Community 60 - "AtelierKeeps.tsx"
Cohesion: 0.23
Nodes (16): AtelierPage(), metadata, Purse(), useWallet(), allowedCharacter(), owns(), walletReady(), Atelier() (+8 more)

### Community 61 - "room.ts"
Cohesion: 0.14
Nodes (28): admitted(), Attachment, farewell(), GHOST_MS, HELLO_TIMEOUT_MS, holdsOf(), MAX_WAITING_PER_IP, newAttachment() (+20 more)

### Community 62 - "frame.ts"
Cohesion: 0.25
Nodes (9): decodedFrames, FrameShape, LANDSCAPE, PORTRAIT, preloadFrames(), shape(), AssetName, preloadImage() (+1 more)

### Community 63 - "track"
Cohesion: 0.25
Nodes (11): earn(), emit(), emitEarned(), maybeInvite(), writeSession(), renderFrame(), aim(), enterAtelier() (+3 more)

### Community 64 - "Handoff: move the Tiny Museum bunny from sprite frames to a rig"
Cohesion: 0.15
Nodes (11): 1. What is in this bundle, 2. How the game draws the bunny today (read from the repo, not run), 3. The rig, 5. Blender-side work still to do (needs Blender; the author has it with an MCP bridge), 6. Open questions for the author, Handoff: move the Tiny Museum bunny from sprite frames to a rig, Approved v4 bunny in the hall, Assets (+3 more)

### Community 65 - "Sound Effect Assets"
Cohesion: 0.22
Nodes (9): file, kilobytes, seconds, file, kilobytes, seconds, soundEffects, click (+1 more)

### Community 66 - "react"
Cohesion: 0.15
Nodes (16): openBugReport(), fitWidth(), HelpGuide(), HelpGuideProps, STEPS, loadGameDesktop(), GameDesktop(), GameDesktopProps (+8 more)

### Community 67 - "Custom HTTP Headers"
Cohesion: 0.25
Nodes (7): applications, appRoot, customHeaders, headers, pattern, key, value

### Community 68 - "Sharp Layer Package"
Cohesion: 0.33
Nodes (6): dependencies, sharp@^0.33.5, description, sharp, name, private

### Community 69 - "builtUrl"
Cohesion: 0.38
Nodes (8): Loading(), DENSITY_MEDIA, HallPreload(), HallSkeleton(), prepareKtx2(), builtUrl(), ktx2TranscoderPath(), pictureSources

### Community 70 - "app/layout.tsx"
Cohesion: 0.11
Nodes (22): bethEllen, inspiratiq, metadata, notoSans, RootLayout(), sniglet, viewport, SoundContext (+14 more)

### Community 71 - "ComposeScreen.tsx"
Cohesion: 0.33
Nodes (6): ComposeScreenProps, NoteDraft, useKeyboardLift(), GUEST_NOTE_COLORS, MAX_GUEST_MESSAGE, MAX_GUEST_NAME

### Community 72 - "round.ts"
Cohesion: 0.16
Nodes (26): deltaE(), GAMUT_EPSILON, hexToOklab(), inGamut(), linearRgbToOklab(), linearToSrgb(), Oklab, oklabToLinearRgb() (+18 more)

### Community 73 - "reveal.ts"
Cohesion: 0.21
Nodes (7): InkMap, planGame(), ROUND_SPREAD, createReveal(), PENCIL, SketchReveal, shuffle()

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
Cohesion: 0.33
Nodes (8): coin_claims, coin_claims_daily, wallet_items, wallets, member_sessions, member_sessions_member, member_slots, members

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

### Community 104 - "lib/presence.ts"
Cohesion: 0.09
Nodes (18): Connect, fetchTicket, HEARTBEAT_MS, HIDDEN_LIMIT_MS, RETRY_MS, sameLook(), samePose(), SAY_GAP_MS (+10 more)

### Community 105 - "Item"
Cohesion: 0.15
Nodes (4): Room, Presence, Item, Refusal

### Community 106 - "ticket.ts"
Cohesion: 0.14
Nodes (18): fetch(), Env, parseRoom(), decoder, encoder, fromBase64Url(), HmacKey, isOwn() (+10 more)

### Community 107 - ".webSocketMessage"
Cohesion: 0.40
Nodes (4): attachmentOf(), roomFull(), Room, sendTo()

### Community 108 - "graftCostume"
Cohesion: 0.27
Nodes (14): canvasFit(), compose(), graftCostume(), copyAccessor(), copyMaterial(), copyMesh(), copyTexture(), copyView() (+6 more)

### Community 109 - "Conn"
Cohesion: 0.35
Nodes (3): connectWebSocket(), SocketHandlers, Conn

### Community 110 - "s3-storage.ts"
Cohesion: 0.25
Nodes (6): @aws-sdk/client-s3@^3.1121.0, @aws-sdk/s3-request-presigner@^3.1121.0, S3StorageOptions, PresignedUpload, @aws-sdk/client-s3, @aws-sdk/s3-request-presigner

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

### Community 125 - "run.ts"
Cohesion: 0.20
Nodes (7): admin, childEnv, client, database, fresh, migrations, target

### Community 128 - "dependencies"
Cohesion: 0.20
Nodes (10): dependencies, bcryptjs@^2.4.3, obscenity@^0.4.6, pg@^8.13.1, sharp@^0.33.5, thumbhash@^0.1.1, sharp, thumbhash (+2 more)

### Community 129 - "presence/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, types, exclude, extends, include, ../../tsconfig.base.json

### Community 130 - "lib/slots/index.ts"
Cohesion: 0.07
Nodes (27): AccountHost(), AccountSheet, Mode, NAME_ERRORS, Pending, View, KeepOnOtherDevices(), onOpenAccount() (+19 more)

### Community 131 - "tsconfig.test.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 137 - "Orchestration contract — you plan, DSH workers execute"
Cohesion: 0.29
Nodes (6): Briefing a worker, Budget hygiene, graphify, Orchestration contract — you plan, DSH workers execute, The worker, When not to delegate

### Community 138 - "outbox.test.ts"
Cohesion: 0.20
Nodes (16): OUTBOX_CAP, outboxAdd(), outboxDue(), OutboxEntry, outboxFail(), outboxRemove(), RETRY_BASE_MS, RETRY_MAX_MS (+8 more)

### Community 139 - "useHallScene.ts"
Cohesion: 0.09
Nodes (29): Assets, Scenery, Backdrop, Mark, CafeMarks, CarriedState, createCarried(), Character (+21 more)

### Community 142 - "catalog.ts"
Cohesion: 0.26
Nodes (10): refreshPriceTags(), CatalogItem, CatalogKind, FREE_CHARACTERS, isCatalogItem(), ITEMS, ItemSlot, priceOf() (+2 more)

### Community 143 - "wardrobe.ts"
Cohesion: 0.11
Nodes (14): OwnedSnapshot, ClothingItem, loadedMember, loadingMember, look, nonMember, CARDIGANS, COSTUMES (+6 more)

### Community 145 - "pedestal.ts"
Cohesion: 0.10
Nodes (7): Helm, createNotes(), createPedestal(), Notes, Pedestal, PedestalVoice, VOICES

### Community 158 - "ensureStarted"
Cohesion: 0.22
Nodes (12): MuseumLayout(), CoinToast(), WalletProvider(), buy(), ensureStarted(), memberChanged(), onOnline(), publish() (+4 more)

### Community 160 - "AssetImage"
Cohesion: 0.26
Nodes (9): BoardScreen(), PinnedNotes(), BunnyArtist(), BunnyMood, Pencil(), POSES, AssetImage(), ImgProps (+1 more)

## Knowledge Gaps
- **5 isolated node(s):** `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 845 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **29 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `lib/slots/index.ts` to `ColorRecall.tsx`, `SketchGuess.tsx`, `useHallScene.ts`, `rig.ts`, `gallery/page.tsx`, `Test Fakes and Helpers`, `useAtelierScene.ts`, `Walkthrough.tsx`, `ReadScreen.tsx`, `features/economy/index.ts`, `Museum Lazy Overlays`, `ensureStarted`, `Web Package Dependencies`, `bug-reports.ts`, `room-events.ts`, `core/src/index.ts`, `GuestBoard.tsx`, `useBackgroundMusic.ts`, `peers.ts`, `epoch.ts`, `AtelierKeeps.tsx`, `react`, `app/layout.tsx`, `ComposeScreen.tsx`?**
  _High betweenness centrality (0.089) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `buildScene()` (e.g. with `enterAtelier()` and `handleClick()`) actually correct?**
  _`buildScene()` has 5 INFERRED edges - model-reasoned connections that need verification._
- **What connects `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json` to the rest of the system?**
  _5 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `member-route.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.056750572082379866 - nodes in this community are weakly interconnected._
- **Why does `three` connect `useHallScene.ts` to `useHallScene.ts`, `builtUrl`, `scene/assets.ts`, `rig.ts`, `HallScene`, `useAtelierScene.ts`, `pedestal.ts`, `prepare-models.mjs`, `atelier.ts`, `hit.ts`, `Web Package Dependencies`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Should `SketchGuess.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09815078236130868 - nodes in this community are weakly interconnected._
- **Why does `next` connect `next` to `bug-reports.ts`, `confirm/page.tsx`, `lib/slots/index.ts`, `room-events.ts`, `react`, `visits.ts`, `core/src/index.ts`, `app/layout.tsx`, `member-route.ts`, `rig.ts`, `peers.ts`, `gallery/page.tsx`, `epoch.ts`, `actions.ts`, `Museum Lazy Overlays`, `AtelierKeeps.tsx`, `Web Package Dependencies`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._