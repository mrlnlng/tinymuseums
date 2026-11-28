# Graph Report - tiny-museum  (2026-11-19)

## Corpus Check
- 539 files · ~326,978 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 95 file(s) not represented in the graph (top: .avif 52, .glb 34, .css 4)

## Summary
- 4855 nodes · 12575 edges · 221 communities (191 shown, 30 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 248 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `07a2354d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- stage.ts
- Walker
- SketchGuess.tsx
- themes.ts
- (hall)/page.tsx
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
- features/economy/index.ts
- room-events.ts
- schedule.ts
- ref_node_assert
- amplify/package.json
- PersonalRoom.tsx
- prepare-models.mjs
- Traversal
- core/package.json
- wardrobe.ts
- Placement
- requireArtist
- LeaderboardPanel
- ambience.ts
- core/src/index.ts
- Web Package Dependencies
- Gamifying Tiny Museum — genre direction & engagement research
- atelier.ts
- remote-visitors.ts
- risk.ts
- amplify/tsconfig.json
- 5. Customization menu — what other people are doing
- wallet.ts
- handlers.ts
- Web TSConfig
- Root Package Manifest
- actions.ts
- npc-layer.ts
- import-fishing-assets.mjs
- Base TSConfig
- Amplify Build Spec
- sketchguess/lib/api.ts
- a/[slug]/page.tsx
- slots/store.ts
- editor.ts
- Water.tsx
- Worker Package Manifest
- Public Asset Manifest
- SlotDef
- wander.test.ts
- compose-atelier.mjs
- lib/presence.ts
- pond-format.ts
- react
- economy/store.ts
- pond-boards.ts
- room.ts
- minimap.ts
- personal/room.ts
- domain/guestboard.ts
- Sound Effect Assets
- art-cache.ts
- Custom HTTP Headers
- Sharp Layer Package
- names.ts
- scene/ambience.ts
- layout.ts
- RigPreview.tsx
- env.ts
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
- names.ts
- Bug Reports SQL Schema
- Vitals SQL Schema
- json
- ClosetView.tsx
- pond/room.ts
- query
- Run-Once Schema
- gallery/page.tsx
- FishingView.tsx
- ticket.ts
- bug-reports.ts
- reveal.ts
- next
- graftCostume
- pondgame/lib/api.ts
- worker/tsconfig.json
- core/tsconfig.json
- Atelier: the dressing mirror, and show-don't-tell keeping
- How to Design for Failures — ByteByteGo Newsletter
- Worker instructions — DSH headless agents
- Backend
- protocol.ts
- Costume gallery doorway
- useBackgroundMusic.ts
- Fishing forest: painted asset pass
- audio/README.md
- .claude/CLAUDE.md
- The Costume Atelier
- Confirmed issues
- rig.ts
- Curating the paintings (2026-11-07)
- guestboard/route.ts
- presence/tsconfig.json
- catalog.ts
- tsconfig.test.json
- app/layout.tsx
- drawingOn
- peers.ts
- domain/sketch.ts
- bug-reports.ts
- npc-layer.ts
- SoundProvider.tsx
- room-places.ts
- Conn
- app/page.tsx
- createRemoteVisitors
- FilesystemStorage
- The Moonlit Pond — design
- Pond rework
- createStage
- Orchestration contract — you plan, DSH workers execute
- tables.ts
- infra/jobs.ts
- wallet/body.ts
- pond-state.ts
- tab-turn.ts
- AtelierRoom
- visits/page.tsx
- performance/page.tsx
- Your Room: a room you can freely furnish
- Walkthrough.tsx
- createPondRoom
- useSoundEffects.ts
- Medium
- LandingFx
- import-hall-assets.mjs
- painting-open
- CrowdPreview.tsx
- Multiplayer ("other visitors") — plan v2 (Cloudflare)
- Lobby
- assetUrl
- confirm/page.tsx
- icon-basket
- publish.ts
- visits.ts
- shopkeeper.ts
- bunny-left
- claim.ts
- bunny-right
- DecorDrawer.tsx
- Wardrobe
- icon-home
- createPersonalRoom
- Approved v4 bunny in the hall
- ticket
- schedule.test.ts
- Storyline (draft, saved 2026-11-17)
- PondTicker.tsx
- hall/room.ts
- Low
- locations.ts
- draw.py
- ensureEpoch
- BountyPanel.tsx
- CodesSection.tsx
- perf.ts
- Monets Lily Pond: exploration, UX and multiplayer QA
- Rig
- createRigState
- master
- pond-api.ts
- AccountSheet.tsx
- vitals.ts
- Atelier: the dressing mirror, and show-don't-tell keeping
- xdog.ts
- Cafe
- npcs/README.md
- Other visitors
- nearby.ts
- media/storage.ts
- rooms.ts
- ArtCache
- Minimap
- PondRoom.tsx
- createCozyBackdrop
- next
- HallArranger.tsx
- VitalsReporter.tsx
- darknessAt
- share.ts
- BunnyArtist.tsx
- Sitting
- CozyBackdrop
- LiveReflection

## God Nodes (most connected - your core abstractions)
1. `react` - 80 edges
2. `json()` - 72 edges
3. `query()` - 68 edges
4. `PersonalRoom()` - 67 edges
5. `hit()` - 58 edges
6. `limited()` - 52 edges
7. `three` - 47 edges
8. `next` - 44 edges
9. `Traversal` - 44 edges
10. `SyncStore` - 41 edges

## Surprising Connections (you probably didn't know these)
- `Code` --references--> `followOutfit()`  [INFERRED]
  docs/costume-atelier.md → apps/web/src/features/hall/scene/wardrobe.ts
- `Rendering and movement` --references--> `walk()`  [INFERRED]
  docs/bunny-rig-integration.md → apps/web/src/features/landing/cat.ts
- `5.1 Emotes (v1)` --references--> `ScreenChrome()`  [INFERRED]
  docs/multiplayer-plan.md → apps/web/src/shared/components/ScreenChrome.tsx
- `E2E-009 — Room mutations ignore stale account identity` --references--> `memberFromRequest()`  [INFERRED]
  docs/testing/local-e2e-stress-2026-11-06.md → apps/web/src/shared/lib/member-route.ts
- `Where things stand` --references--> `sealEpoch()`  [INFERRED]
  docs/curation-plan.md → packages/core/src/domain/epoch.ts

## Import Cycles
- None detected.

## Communities (221 total, 30 thin omitted)

### Community 0 - "stage.ts"
Cohesion: 0.03
Nodes (50): coverFloorTransition(), CameraRig, createPixelRatioGovernor(), PIXEL_RATIO_STEPS, createRoomPassage(), fixture(), JUMP_KEYS, Pose (+42 more)

### Community 1 - "Walker"
Cohesion: 0.21
Nodes (3): FloorPoint, WalkArea, Walker

### Community 2 - "SketchGuess.tsx"
Cohesion: 0.12
Nodes (29): bestKeyFor(), BURST, clueUrl(), openingPlan(), Phase, pickAtRandom(), prepareSketchGame(), readDifficulty() (+21 more)

### Community 3 - "themes.ts"
Cohesion: 0.06
Nodes (38): Catalogue, Data model (core), 1. Items placed against a zone edge fail to save, and the whole draft reverts, 2. One owned item can be placed many times, 3. Any save rejection throws away all unsaved work, 4. Changes made just before leaving are lost, 5. Fish trophies can be claimed without playing, High (+30 more)

### Community 4 - "(hall)/page.tsx"
Cohesion: 0.32
Nodes (8): Loading(), dynamic, Hall(), MuseumPage(), DENSITY_MEDIA, HallPreload(), HallSkeleton(), MediaPreconnect()

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
Cohesion: 0.06
Nodes (52): AssetManifest, assetUrl(), bitmapTexture(), blankImage(), CAFE_CAT_FRAMES, CharacterSprites, CompressedLoader, elementTexture() (+44 more)

### Community 9 - "SyncStore"
Cohesion: 0.17
Nodes (6): encodeStored(), parseStored(), readStored(), writeStored(), SyncStore, upgrade()

### Community 10 - "machine.ts"
Cohesion: 0.10
Nodes (46): CAST_ERRORS, coarsePointer(), FishingView(), initialEasyReel(), isTyping(), LOST, Toast, vibrate() (+38 more)

### Community 11 - "Museum.tsx"
Cohesion: 0.10
Nodes (32): motion@^13.1.1, Loading(), AtelierLoading(), CoinFound, ColorRecall, GameDesktop, GuestBoard, HallArranger (+24 more)

### Community 12 - "Test Fakes and Helpers"
Cohesion: 0.11
Nodes (28): deferredFetch(), deviceSlot, FakeEvents, FakeStorage, fixture, fixtureB, fixtureRegistry, fixtureRegistryBoth (+20 more)

### Community 13 - "scene.ts"
Cohesion: 0.04
Nodes (31): MuseumProps, disposeDisplayTexture(), HELM_PEDESTAL_FILE, loadDisplayTexture(), prefersAvif(), HiddenCoin, createNotes(), createPedestal() (+23 more)

### Community 14 - "cozy.ts"
Cohesion: 0.08
Nodes (20): ATELIER_PROPS, AtelierImage, cozyTheme, disposeCozyArt(), DRAWN, EYE, FINISH_TILES, FISH (+12 more)

### Community 15 - "features/economy/index.ts"
Cohesion: 0.11
Nodes (24): MuseumLayout(), openAccount(), CoinToast(), Toast, Purse(), Stamp(), WalletProvider(), useWallet() (+16 more)

### Community 16 - "room-events.ts"
Cohesion: 0.19
Nodes (25): ChatButton(), REFUSED, joinRoom(), emit(), getPeople(), isInRoom(), isMuted(), muted (+17 more)

### Community 17 - "schedule.ts"
Cohesion: 0.08
Nodes (54): addDwellEmotes(), addEmote(), addGap(), addStand(), addWalk(), along(), buildRoomTable(), buildStayPlan() (+46 more)

### Community 18 - "ref_node_assert"
Cohesion: 0.12
Nodes (29): defineSlot(), docBytes(), SLOTS, byAtThenKey(), encoded(), latest, mapOf(), maxNumber() (+21 more)

### Community 19 - "amplify/package.json"
Cohesion: 0.08
Nodes (26): amplifyDir, backend, everyMinutes, mediaBucket, missing, repoRoot, REQUIRED, setting() (+18 more)

### Community 20 - "PersonalRoom.tsx"
Cohesion: 0.08
Nodes (64): errorReason(), Offer, overDrawer(), PersonalRoom(), canPlaceNew(), carriedTo(), carryEnd(), carryMove() (+56 more)

### Community 21 - "prepare-models.mjs"
Cohesion: 0.10
Nodes (21): BODIES, bruce, BRUCE_FIT, BRUCE_PLACE, bunny, CARDIGAN_TIE, CROWN, CROWN_MIDDLE (+13 more)

### Community 22 - "Traversal"
Cohesion: 0.11
Nodes (5): JumpPose, clamp(), fixture(), jump(), Traversal

### Community 23 - "core/package.json"
Cohesion: 0.06
Nodes (40): dependencies, @aws-sdk/client-s3@^3.1121.0, @aws-sdk/s3-request-presigner@^3.1121.0, bcryptjs@^2.4.3, obscenity@^0.4.6, pg@^8.13.1, sharp@^0.33.5, thumbhash@^0.1.1 (+32 more)

### Community 24 - "wardrobe.ts"
Cohesion: 0.07
Nodes (49): AtelierPage(), dynamic, metadata, allowedCharacter(), OwnedSnapshot, owns(), walletReady(), getWalletSnapshot() (+41 more)

### Community 25 - "Placement"
Cohesion: 0.05
Nodes (11): Carry, Job, PersonalRoomProps, DecorController, HallRoomData, PersonalRoomOptions, GhostOptions, PlacementLayer (+3 more)

### Community 26 - "requireArtist"
Cohesion: 0.26
Nodes (13): AnalyticsPage(), dynamic, hangAction(), movePieceAction(), unhangAction(), FloorControls(), move(), unhang() (+5 more)

### Community 27 - "LeaderboardPanel"
Cohesion: 0.27
Nodes (10): formatCountdown(), formatOdds(), nextMondayUtc(), useCountdown(), useNow(), BoardRow(), LeaderboardPanel(), medalClass() (+2 more)

### Community 28 - "ambience.ts"
Cohesion: 0.12
Nodes (29): blade(), bloom(), BLOOMS, createPondAmbience(), update(), fishTexture(), frond(), FRONT_ROWS (+21 more)

### Community 29 - "core/src/index.ts"
Cohesion: 0.05
Nodes (107): addBait(), bountyCatches(), BountyCatchRow, bountyViews(), buyPondBait(), castPond(), chainPondBait(), claimPondBounty() (+99 more)

### Community 30 - "Web Package Dependencies"
Cohesion: 0.08
Nodes (32): dependencies, embla-carousel-react@^8.6.0, next@^15.0.3, react@^19.0.0, react-dom@^19.0.0, swr@^2.5.1, three@^0.169.0, thumbhash@^0.1.1 (+24 more)

### Community 31 - "Gamifying Tiny Museum — genre direction & engagement research"
Cohesion: 0.10
Nodes (19): 0.1 The core experience, 0.2 Systems that make gamification cheap to build, 0.3 Constraints that shape any recommendation, 0. What the game is today (the deep dive), 1.1 The landscape (seven candidates, with verdicts), 1.2 Recommendation: a **cozy gallery life-sim** — "the gallery you live in", 1.3 The five design pillars the genre implies, 1. Genre direction (+11 more)

### Community 32 - "atelier.ts"
Cohesion: 0.06
Nodes (40): AtelierArt, AtelierImage, BuiltRoom, Cardigan, CARDIGAN_NAMES, Control, refresh(), disposeAtelierArt() (+32 more)

### Community 33 - "remote-visitors.ts"
Cohesion: 0.05
Nodes (40): Attachment, Carried, CarriedState, createCarried(), Character, Perch, Pose, centerYFor() (+32 more)

### Community 34 - "risk.ts"
Cohesion: 0.12
Nodes (31): Hud(), HudProps, HudWagerChip, WagerPicker(), chooseTier(), WagerPickerProps, CastOptions, PondStateView (+23 more)

### Community 35 - "amplify/tsconfig.json"
Cohesion: 0.20
Nodes (9): compilerOptions, module, moduleResolution, noUnusedLocals, noUnusedParameters, exclude, extends, include (+1 more)

### Community 36 - "5. Customization menu — what other people are doing"
Cohesion: 0.12
Nodes (16): 1. The target: what "Claude Opus 5.5" actually means, 2. Where your harness stands today (live config I read), 3. The honest gap model, 4. Quality levers, ranked by leverage, 5. Customization menu — what other people are doing, 6. Recommended starting kit for *your* profile, 7. What I can apply for you right now (needs your go-ahead), A. Prompt & persona (most common quality customizations) (+8 more)

### Community 37 - "wallet.ts"
Cohesion: 0.07
Nodes (49): GET(), grantPearls(), member(), now, piece(), randomId(), today, exportMember() (+41 more)

### Community 38 - "handlers.ts"
Cohesion: 0.10
Nodes (32): confirmedFollowers(), handleDerivatives(), handleNotifyFollowers(), handleRenderDisplay(), handleSealEpoch(), renderPieceFrame(), renderPieceSketch(), runJob() (+24 more)

### Community 39 - "Web TSConfig"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 40 - "Root Package Manifest"
Cohesion: 0.06
Nodes (36): [, width, height], description, devDependencies, concurrently@^9.1.0, esbuild@^0.24.0, ktx2-encoder@^0.6.0, maxrects-packer@^2.7.3, playwright@^1.63.0 (+28 more)

### Community 41 - "actions.ts"
Cohesion: 0.15
Nodes (24): BugReportsPage(), dateFormat, dynamic, summary(), back(), deleteGuestNoteAction(), deletePieceAction(), discardLocationAction() (+16 more)

### Community 42 - "npc-layer.ts"
Cohesion: 0.14
Nodes (19): BY_ID, CAST, castMember(), FRAME, IDLE, idleCel(), NPC_WALK_SPEED, NpcCharacter (+11 more)

### Community 43 - "import-fishing-assets.mjs"
Cohesion: 0.09
Nodes (13): CANVAS, clear, FONT, FRAME, heights, layer(), layout, lossless (+5 more)

### Community 44 - "Base TSConfig"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, lib, module, moduleResolution (+9 more)

### Community 45 - "Amplify Build Spec"
Cohesion: 0.12
Nodes (16): applications, appRoot, backend, frontend, baseDirectory, files, phases, commands (+8 more)

### Community 46 - "sketchguess/lib/api.ts"
Cohesion: 0.23
Nodes (13): sameOriginUrl(), PreparedGame, decodeImage(), fetchBitmap(), fetchRound(), guarded(), LoadedRound, loadInk() (+5 more)

### Community 47 - "a/[slug]/page.tsx"
Cohesion: 0.31
Nodes (6): ArtistPage(), dynamic, generateMetadata(), GET(), FollowForm(), getArtistPage()

### Community 48 - "slots/store.ts"
Cohesion: 0.14
Nodes (17): ANON_PREFIX, anonKey(), deviceKey(), isMemberSlotKey(), listKeys(), MEMBER_KEY, memberKey(), memberPrefix() (+9 more)

### Community 49 - "editor.ts"
Cohesion: 0.15
Nodes (19): roomEditor, PER_EDITOR, PUT(), versionOf(), PER_EDITOR, POST(), PER_MEMBER, POST() (+11 more)

### Community 50 - "Water.tsx"
Cohesion: 0.08
Nodes (37): AmbientShadow, box(), BUCKET, bunnyBox(), easeOut(), Glint, LEFT_STYLE, lineColour() (+29 more)

### Community 51 - "Worker Package Manifest"
Cohesion: 0.14
Nodes (14): dependencies, @tiny/core@*, exports, ./lambda, @tiny/core, main, name, private (+6 more)

### Community 52 - "Public Asset Manifest"
Cohesion: 0.12
Nodes (15): artworks, bunny, size, floor, size, fonts, icon-no-photos, size (+7 more)

### Community 53 - "SlotDef"
Cohesion: 0.18
Nodes (3): FakeServer, SlotState, SlotDef

### Community 54 - "wander.test.ts"
Cohesion: 0.16
Nodes (11): Job, Place, WalkState, BASE_JOB, context(), L_GROUND, mulberry32(), room() (+3 more)

### Community 55 - "compose-atelier.mjs"
Cohesion: 0.12
Nodes (10): body, dressLayer, dressWidth, floralWidth, hanger, MANNEQUIN_CANVAS, mask, root (+2 more)

### Community 56 - "lib/presence.ts"
Cohesion: 0.09
Nodes (21): Entry, Connect, fetchTicket, HEARTBEAT_MS, HIDDEN_LIMIT_MS, RETRY_MS, sameLook(), samePose() (+13 more)

### Community 57 - "pond-format.ts"
Cohesion: 0.11
Nodes (31): PondDex, catchLabel(), EXCHANGE_DAILY_STAMPS, EXCHANGE_PEARLS_PER_STAMP, FISH_ART, fishArt(), formatPercent(), formatShortSizeCm() (+23 more)

### Community 58 - "react"
Cohesion: 0.26
Nodes (10): openBugReport(), fitWidth(), HelpGuide(), HelpGuideProps, POINTER_STEPS, TOUCH_STEPS, SoundToggle(), SettingsMenu() (+2 more)

### Community 59 - "economy/store.ts"
Cohesion: 0.07
Nodes (66): serverSnapshot, useEarnEvents(), BuiltClaim, EarnSource, tzOffsetNow(), buy(), BuyOutcome, cappedTracked (+58 more)

### Community 60 - "pond-boards.ts"
Cohesion: 0.15
Nodes (22): compare(), DexRow, displayName(), FeedRow, getPondFeed(), getPondLeaderboard(), NameRow, PondBoardMe (+14 more)

### Community 61 - "room.ts"
Cohesion: 0.12
Nodes (32): attachmentOf(), admitted(), Attachment, farewell(), GHOST_MS, HELLO_TIMEOUT_MS, holdsOf(), MAX_WAITING_PER_IP (+24 more)

### Community 62 - "minimap.ts"
Cohesion: 0.08
Nodes (35): place(), ATELIER_DOOR, createMinimap(), draw(), drawRoom(), floors(), follow(), sketchOf() (+27 more)

### Community 63 - "personal/room.ts"
Cohesion: 0.11
Nodes (14): CafeLink, GuestBoardNotes, Placards, toScreen(), writeStyle(), createPersonalRoom(), light(), shade() (+6 more)

### Community 64 - "domain/guestboard.ts"
Cohesion: 0.10
Nodes (30): BoardScreen(), BoardScreenProps, ComposeScreen(), ComposeScreenProps, blankDraft(), GuestBoard(), GuestBoardProps, View (+22 more)

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

### Community 69 - "names.ts"
Cohesion: 0.19
Nodes (18): PER_MEMBER, PUT(), Code, 3.2 Chosen names (members), chooseName(), memberName, nameOf(), rerollName() (+10 more)

### Community 70 - "scene/ambience.ts"
Cohesion: 0.13
Nodes (13): BULBS, createHallAmbience(), finish(), glowTexture(), HallAmbience, mulberry(), painted(), vignetteTexture() (+5 more)

### Community 71 - "layout.ts"
Cohesion: 0.19
Nodes (8): cafeAfterIndex(), computeLayout(), cutRooms(), HallRoomKind, HallRoomSpan, hasPedestal(), Span, Rooms as the one building block (decided 2026-11-06)

### Community 72 - "RigPreview.tsx"
Cohesion: 0.27
Nodes (10): RigPreviewPage(), NEXT, PROPS, RigPreview(), draw(), approach(), GROUNDED, rigFacing() (+2 more)

### Community 73 - "env.ts"
Cohesion: 0.14
Nodes (12): SCHEMA_DIR, BRAND, isProduction(), presenceSecret(), repoRoot, required(), sessionSecret(), setting() (+4 more)

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
Cohesion: 0.18
Nodes (18): ArtByRoom, blank(), colorAt(), disposePondArt(), EDGE_BAND, EDGE_BANDS, EDGE_OVERLAP, edgeTexture() (+10 more)

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
Cohesion: 0.20
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

### Community 89 - "names.ts"
Cohesion: 0.31
Nodes (7): checkMessage(), INVISIBLE, MESSAGE_MAX, MessageCheck, normalizeMessage(), hasProfanity(), matcher

### Community 93 - "json"
Cohesion: 0.06
Nodes (90): ALLOWED, PER_VISITOR, POST(), POST(), POST(), POST(), GET(), GLOBAL (+82 more)

### Community 94 - "ClosetView.tsx"
Cohesion: 0.09
Nodes (28): ClosetView(), onKeyDown(), LISTS, PLACE, PODIUM_SRC, Props, Slot, SPOTLIGHT_SRC (+20 more)

### Community 95 - "pond/room.ts"
Cohesion: 0.10
Nodes (32): water, depthAtLift(), FAR_LIFT, FAR_SCALE, liftAt(), pathHalfWidth(), pathX(), PondPath (+24 more)

### Community 96 - "query"
Cohesion: 0.06
Nodes (64): GET(), registerAction(), registry, started(), CatchExtra, clearCatches(), COLUMNS, grantPearls() (+56 more)

### Community 104 - "gallery/page.tsx"
Cohesion: 0.18
Nodes (15): dynamic, GalleryPage(), dynamic, LocationsPage(), PlacePicker(), PlacePickerProps, Phase, PHASE_LABEL (+7 more)

### Community 105 - "FishingView.tsx"
Cohesion: 0.13
Nodes (14): CONFETTI_COLORS, ConfettiPiece, makeConfetti(), RevealCard(), TIER_MS, TIER_SFX, useCountUp(), chainOffer (+6 more)

### Community 106 - "ticket.ts"
Cohesion: 0.14
Nodes (18): fetch(), Env, parseRoom(), decoder, encoder, fromBase64Url(), HmacKey, isOwn() (+10 more)

### Community 107 - "bug-reports.ts"
Cohesion: 0.12
Nodes (23): GET(), BugContext, BugReport, BugReportDto, BugReportRejected, BugRow, CONTEXT_KEYS, EVERYONE (+15 more)

### Community 108 - "reveal.ts"
Cohesion: 0.17
Nodes (9): PlaceInfo, InkMap, planGame(), ROUND_SPREAD, createReveal(), compose(), PENCIL, SketchReveal (+1 more)

### Community 109 - "next"
Cohesion: 0.20
Nodes (11): config, SECURITY_HEADERS, dateFormat, dynamic, GuestBoardPage(), dynamic, StudioHome(), Register() (+3 more)

### Community 110 - "graftCostume"
Cohesion: 0.27
Nodes (14): canvasFit(), compose(), graftCostume(), copyAccessor(), copyMaterial(), copyMesh(), copyTexture(), copyView() (+6 more)

### Community 111 - "pondgame/lib/api.ts"
Cohesion: 0.33
Nodes (14): buyPondBait(), castPond(), chainPondBait(), errorOf(), fetchPondState(), isRecord(), memberId(), PondCastReply (+6 more)

### Community 112 - "worker/tsconfig.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 113 - "core/tsconfig.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 114 - "Atelier: the dressing mirror, and show-don't-tell keeping"
Cohesion: 0.13
Nodes (14): Atelier: the dressing mirror, and show-don't-tell keeping, Build order, Built (2026-11-20), Decisions (2026-11-19), Follow-ups (2026-11-20), Goal, In the room, Keeping (+6 more)

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

### Community 120 - "useBackgroundMusic.ts"
Cohesion: 0.17
Nodes (10): BackgroundMusic, clampVolume(), isDocumentHidden(), Options, useBackgroundMusic(), VISIBILITY_EVENTS, isRouted(), setGainLevel() (+2 more)

### Community 121 - "Fishing forest: painted asset pass"
Cohesion: 0.10
Nodes (18): Assets, Bruce's collection refresh (2026-11-08), Fishing forest illustrations, Made by hand (not touched by the script), Main hall v2 (2026-11-10), Monets Lily Pond (2026-11-08), 1. Forest doorway, 2. Woodland noticeboard (+10 more)

### Community 124 - "The Costume Atelier"
Cohesion: 0.14
Nodes (13): Adding a character, Adding a costume, Art not supplied as files, Bruce's Chronicles, Checked against the mocks (2026-11-07), Code, Costume fit review, Floral collection (+5 more)

### Community 125 - "Confirmed issues"
Cohesion: 0.11
Nodes (18): Confirmed issues, E2E-002 — Valid edge placement rejected through floating-point precision, E2E-003 — One owned prop can be placed multiple times, E2E-004 — Reload before autosave silently loses the latest placement, E2E-005 — Failed save and failed Done have no visible mobile explanation, E2E-006 — Restoring connectivity does not retry a failed draft save, E2E-007 — Keyboard activation cannot place drawer items, E2E-008 — Creating an account from My Room leaves the signed-in user on the sign-in prompt (+10 more)

### Community 126 - "rig.ts"
Cohesion: 0.13
Nodes (25): Layer, setCostumeVisibility(), follow(), canvasToModel(), disposeRigLayer(), Frame, layerTemplates, loadRig() (+17 more)

### Community 127 - "Curating the paintings (2026-11-07)"
Cohesion: 0.13
Nodes (14): 1. The registry and the table, 2. The studio's Location picker, 3. The rooms draw what is placed, 4. Credits, 5. Retiring self-serve artists, Building it, Curating the paintings (2026-11-07), Decided (+6 more)

### Community 128 - "guestboard/route.ts"
Cohesion: 0.26
Nodes (10): POST(), POST(), rateLimitedResponse(), rejectedResponse(), BugReportRateLimited, postBugReport(), enforceLimits(), GuestNoteRateLimited (+2 more)

### Community 129 - "presence/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, types, exclude, extends, include, ../../tsconfig.base.json

### Community 130 - "catalog.ts"
Cohesion: 0.13
Nodes (23): confirmClean(), shopFinishIds(), shopPropIds(), The closet: where every room starts (2026-11-17), ownershipFor(), CatalogItem, CatalogKind, FREE_CHARACTERS (+15 more)

### Community 131 - "tsconfig.test.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 132 - "app/layout.tsx"
Cohesion: 0.15
Nodes (14): bethEllen, inspiratiq, metadata, notoSans, RootLayout(), sniglet, viewport, SoundProvider() (+6 more)

### Community 133 - "drawingOn"
Cohesion: 0.20
Nodes (12): atticWindowCanvas(), bareBulbCanvas(), boardsCanvas(), cobwebCanvas(), cozyFinishImageUrl(), creamCanvas(), drawingOn(), dustCanvas() (+4 more)

### Community 134 - "peers.ts"
Cohesion: 0.14
Nodes (7): INTERPOLATION_DELAY_MS, PEER_TIMEOUT_MS, PeerTable, positionAt(), Sample, look, Peer

### Community 135 - "domain/sketch.ts"
Cohesion: 0.09
Nodes (34): listPieces(), pieceImageUrl(), PieceRow, toPieceDto(), EpochRow, deletePiece(), GalleryPiece, GalleryRow (+26 more)

### Community 136 - "bug-reports.ts"
Cohesion: 0.20
Nodes (15): BugReportHost(), BugReportSheet, BugReportSheet(), send(), Status, collectContext(), inAppBrowser(), onOpenBugReport() (+7 more)

### Community 137 - "npc-layer.ts"
Cohesion: 0.19
Nodes (19): createNpcLayer(), createResidentView(), createView(), departedRecently(), draw(), fadeOut(), glyphWidth(), hideAll() (+11 more)

### Community 138 - "SoundProvider.tsx"
Cohesion: 0.21
Nodes (7): StageOptions, RoomSound, SoundContext, SoundState, EffectName, STATIC_BASE, staticUrl()

### Community 139 - "room-places.ts"
Cohesion: 0.14
Nodes (18): HallLayout, NpcGround, atelierRoomInfo(), atelierX(), copy(), FurniturePlacement, hallCache, hallRoomInfo() (+10 more)

### Community 140 - "Conn"
Cohesion: 0.31
Nodes (4): connectWebSocket(), SocketHandlers, Conn, message()

### Community 141 - "app/page.tsx"
Cohesion: 0.18
Nodes (12): [BRAND_OWNER, ...BRAND_REST], CurrentlyShowing(), Decor(), dynamic, LandingPage(), coin, CoinFound(), CoinFoundProps (+4 more)

### Community 142 - "createRemoteVisitors"
Cohesion: 0.21
Nodes (10): createRenderer(), createRigLayer(), createRemoteVisitors(), ensureLayer(), load(), placeOwn(), show(), showProp() (+2 more)

### Community 144 - "The Moonlit Pond — design"
Cohesion: 0.09
Nodes (22): Art the pond needs from the artist, Build contract (decided 2026-11-07), Build phases, Collection and goals, Done, Done, Guardrails, Leaderboards (+14 more)

### Community 145 - "Pond rework"
Cohesion: 0.18
Nodes (10): Baits, Client, Decisions, Done, Notes, Pond rework, Server, Species (+2 more)

### Community 146 - "createStage"
Cohesion: 0.15
Nodes (22): boundedCameraX(), createNearby(), createStage(), closeEntry(), enter(), initialize(), aim(), drawFrame() (+14 more)

### Community 147 - "Orchestration contract — you plan, DSH workers execute"
Cohesion: 0.29
Nodes (6): Briefing a worker, Budget hygiene, graphify, Orchestration contract — you plan, DSH workers execute, The worker, When not to delegate

### Community 148 - "tables.ts"
Cohesion: 0.09
Nodes (41): BaitTray(), BaitTrayProps, PondGameProps, RevealCardProps, PondCatch, CatchView, debugSpecies(), debugTokens() (+33 more)

### Community 149 - "infra/jobs.ts"
Cohesion: 0.23
Nodes (15): loop(), shutdown(), sleep(), sweepStale(), DrainResult, handler(), repairFrames(), repairUnframed() (+7 more)

### Community 150 - "wallet/body.ts"
Cohesion: 0.22
Nodes (13): PER_MEMBER, POST(), baitIdOf(), integerOffset(), isRecord(), itemIdOf(), MAX_CLAIM_BATCH, MAX_WALLET_BODY_BYTES (+5 more)

### Community 151 - "pond-state.ts"
Cohesion: 0.25
Nodes (14): PondStateView, PondTier, ensurePondStateStarted(), getPondStateSnapshot(), GUEST, listeners, LOADING, PondStateSnapshot (+6 more)

### Community 152 - "tab-turn.ts"
Cohesion: 0.16
Nodes (5): createTabTurn(), TabTurn, tab(), TurnEnv, TurnMessage

### Community 154 - "visits/page.tsx"
Cohesion: 0.27
Nodes (9): amount(), duration(), dynamic, LANDMARKS, PAGES, RANGES, share(), VisitsPage() (+1 more)

### Community 155 - "performance/page.tsx"
Cohesion: 0.27
Nodes (9): dynamic, format(), grade(), METRICS, PAGES, PerformancePage(), RANGES, summarizeVitals() (+1 more)

### Community 156 - "Your Room: a room you can freely furnish"
Cohesion: 0.20
Nodes (9): Admin mode (gamma), Decisions (2026-11-17, with the user), Editor (web, `features/rooms/decorate/*`, `PersonalRoom.tsx`), Room look (web, `features/rooms/themes/cozy.ts`, `features/rooms/personal/room.ts`), Scale, Testing locally, What other games do (research, 2026-11-17), Work plan (+1 more)

### Community 157 - "Walkthrough.tsx"
Cohesion: 0.08
Nodes (31): BACKDROP_STYLE, MoreArrow(), NavArrow(), Props, SLIDE, Walkthrough(), XIcon(), decodedFrames (+23 more)

### Community 158 - "createPondRoom"
Cohesion: 0.32
Nodes (13): createPondRoom(), approach(), busy(), finishWalk(), goTo(), leave(), move(), nearest() (+5 more)

### Community 159 - "useSoundEffects.ts"
Cohesion: 0.18
Nodes (17): EFFECTS, EffectSpec, FOOTSTEPS, SoundEffects, useSoundEffects(), gestured(), OPTIONS, applyMix() (+9 more)

### Community 160 - "Medium"
Cohesion: 0.22
Nodes (9): onClick(), 10. Long names run off the name sign, 11. The rooms API skips the stale-tab member check, 12. The bunny is dragged along while you pan in Decorate, 6. Failed saves are nearly invisible, and nothing retries, 7. Two tabs editing the same room overwrite each other, 8. The drawer's card row can't be scrolled on touch screens, 9. Decorating can't be done with the keyboard (+1 more)

### Community 161 - "LandingFx"
Cohesion: 0.13
Nodes (19): between(), CAT, Edge, EDGES, runLandingCat(), choosePeeker(), peek(), walk() (+11 more)

### Community 162 - "import-hall-assets.mjs"
Cohesion: 0.03
Nodes (45): socket(), target, BASEBOARD, CURTAIN, drop, EXPECTED, file(), manifest (+37 more)

### Community 163 - "painting-open"
Cohesion: 0.50
Nodes (4): file, kilobytes, seconds, painting-open

### Community 164 - "CrowdPreview.tsx"
Cohesion: 0.33
Nodes (7): CrowdPreviewPage(), CrowdPreview(), draw(), KINDS, Stats, Window, clearRigLayer()

### Community 165 - "Multiplayer ("other visitors") — plan v2 (Cloudflare)"
Cohesion: 0.10
Nodes (20): 0. Summary, 10. Decisions, 1. Product contract changes (approved 2026-10-31), 2. What already exists that this builds on, 3.1 Generated names (everyone has one), 3. Names, 4. Transport: Cloudflare Durable Objects, 5.1 Emotes (v1) (+12 more)

### Community 167 - "assetUrl"
Cohesion: 0.19
Nodes (16): canvasTexture(), ceilingTexture(), cozyPropImageUrl(), fishTexture(), floorTexture(), floorWearCanvas(), loadCozyArt(), loadImage() (+8 more)

### Community 168 - "confirm/page.tsx"
Cohesion: 0.33
Nodes (7): ConfirmFollow(), dynamic, dynamic, Unsubscribe(), FollowNotice(), confirmFollow(), unsubscribe()

### Community 169 - "icon-basket"
Cohesion: 0.67
Nodes (3): icon-basket, file, vector

### Community 170 - "publish.ts"
Cohesion: 0.32
Nodes (7): publishAction(), MAX_STANDS, evaluatePublishBar(), publishArtist(), PublishCheck, PublishReport, republishArtist()

### Community 171 - "visits.ts"
Cohesion: 0.16
Nodes (19): state(), flush(), visibleMs(), VisitState, count(), currentSalts(), DEVICES, loadSalts() (+11 more)

### Community 172 - "shopkeeper.ts"
Cohesion: 0.25
Nodes (7): RigPiece, COATS, createShopkeeper(), GREETINGS, OUTFIT, recolourFur(), SHOPKEEPER_NAME

### Community 174 - "claim.ts"
Cohesion: 0.12
Nodes (25): CARRY_CAP, carryAdd(), CarryEntry, carryPrune(), carryRemove(), chunk(), buildClaim(), ClaimRequest (+17 more)

### Community 176 - "DecorDrawer.tsx"
Cohesion: 0.12
Nodes (18): stampLabel(), DecorDrawer, DecorDrawerProps, SharingState, SLOT_LABELS, Tab, TABS, categoryOf() (+10 more)

### Community 179 - "createPersonalRoom"
Cohesion: 0.27
Nodes (9): aspectOf(), createPlacementLayer(), drawOutline(), dropGhosts(), dropHelper(), extrasFor(), silhouette(), sizeOf() (+1 more)

### Community 180 - "Approved v4 bunny in the hall"
Cohesion: 0.29
Nodes (5): Approved v4 bunny in the hall, Assets, Existing interactions and fallback, Local review and checks, Rendering and movement

### Community 182 - "schedule.test.ts"
Cohesion: 0.09
Nodes (25): RESIDENT_IDS, FloorSpot, JOBS, PlaceKind, ROOM_KINDS, ROOMS, PlaceInput, NpcRoom (+17 more)

### Community 183 - "Storyline (draft, saved 2026-11-17)"
Cohesion: 0.18
Nodes (10): Arc (soft, no fail state), Built so far, How it ties to what exists, Mystery hook, Next tasks (when picked up), Open questions, Premise, Seed (the owner's words) (+2 more)

### Community 184 - "PondTicker.tsx"
Cohesion: 0.43
Nodes (7): fetchPondFeed(), PondFeedItem, formatSizeCm(), isGolden(), PondTicker(), load(), PondTickerProps

### Community 185 - "hall/room.ts"
Cohesion: 0.05
Nodes (58): Assets, Scenery, CUTS, disposeBoards(), Mark, plane(), ROPE_CUTS, ropeSlices() (+50 more)

### Community 186 - "Low"
Cohesion: 0.09
Nodes (20): 13. Pages that redirect or don't exist answer 200, 14. Error codes reveal which room slugs exist, 15. The name sign slides under the top-right buttons in Decorate, 16. Level-up celebrations can be farmed, 17. No hint of where things are after panning away, 18. Too many items is only discovered by the server, 19. Development-only: page payloads include the full room row, Checked and fine (+12 more)

### Community 187 - "locations.ts"
Cohesion: 0.25
Nodes (20): publishLocationAction(), discardLocation(), hasUnpublished(), locationStates(), nudgeInRow(), OWNER, placePainting(), PlaceResult (+12 more)

### Community 189 - "ensureEpoch"
Cohesion: 0.23
Nodes (14): GET(), intParam(), GET(), sketchPool, unavailable(), EMPTY, firstSlice(), memo (+6 more)

### Community 190 - "BountyPanel.tsx"
Cohesion: 0.18
Nodes (20): refreshWalletNow(), GLYPHS, PearlIcon(), POND_CRIMSON, PondIcon(), PondIconName, fetchPondBounties(), formatInteger() (+12 more)

### Community 191 - "CodesSection.tsx"
Cohesion: 0.39
Nodes (7): createCodeAction(), deleteCodeAction(), CodeRow, CodesSection(), create(), remove(), revokeQrToken()

### Community 192 - "perf.ts"
Cohesion: 0.22
Nodes (4): createPerfMeter(), isEnabled(), PerfMeter, PerfSnapshot

### Community 193 - "Monets Lily Pond: exploration, UX and multiplayer QA"
Cohesion: 0.29
Nodes (6): Browser and interaction coverage, Changes made from the walkthrough, Monets Lily Pond: exploration, UX and multiplayer QA, Multiplayer and load, Practical limits, Regression checks and cleanup

### Community 195 - "createRigState"
Cohesion: 0.21
Nodes (12): createCharacter(), contextLost(), loadKind(), loseRig(), setFrame(), cache, queue, render() (+4 more)

### Community 196 - "master"
Cohesion: 0.32
Nodes (7): paintedCostume(), floralOutfits(), goldOutfits(), master(), placed(), Fitting clothes to other characters, Headpieces

### Community 197 - "pond-api.ts"
Cohesion: 0.17
Nodes (24): buyPondBait(), claimPondBounty(), errorOf(), exchangePondPearls(), fetchPondDex(), fetchPondLeaderboard(), fetchPondState(), isRecord() (+16 more)

### Community 198 - "AccountSheet.tsx"
Cohesion: 0.06
Nodes (34): PresencePreviewPage(), AccountHost(), AccountSheet, AccountSheet(), continueAnyway(), doSignOut(), runDelete(), runName() (+26 more)

### Community 199 - "vitals.ts"
Cohesion: 0.36
Nodes (6): DEVICES, METRICS, normalizePage(), parseVitalsReport(), RATINGS, VitalRow

### Community 200 - "Atelier: the dressing mirror, and show-don't-tell keeping"
Cohesion: 0.08
Nodes (10): CARD, createHangTag(), HangTag, HangTagStyle, HOLE, KNOT, Presence, What goes, and what replaces it (+2 more)

### Community 201 - "xdog.ts"
Cohesion: 0.39
Nodes (5): blur(), kernel(), XDOG_DEFAULTS, xdogInk(), XdogOptions

### Community 204 - "Other visitors"
Cohesion: 0.29
Nodes (6): How it plays, Other visitors, Privacy, Running it in production, Running it locally, Staying consistent

### Community 205 - "nearby.ts"
Cohesion: 0.18
Nodes (5): Nearby, NearbyReach, RoomSpan, reach, strip

### Community 206 - "media/storage.ts"
Cohesion: 0.11
Nodes (17): CONTENT_TYPES, GET(), PUT(), ACCEPTED, createAssetFromUpload(), MAX_UPLOAD_BYTES, presignUpload(), registerUpload() (+9 more)

### Community 207 - "rooms.ts"
Cohesion: 0.12
Nodes (24): dynamic, HomePage(), HomeSignIn(), allowedOrigin(), isSameOriginMutation(), LOOPBACK, currentEpoch(), sealEpoch() (+16 more)

### Community 210 - "PondRoom.tsx"
Cohesion: 0.11
Nodes (20): Loading(), metadata, PondPage(), PondGame(), POND_NAME, PondLoading(), BOARD_TABS, PondOverlayKind (+12 more)

### Community 211 - "createCozyBackdrop"
Cohesion: 0.23
Nodes (13): alphaCanvas(), ceilingGeometry(), createCozyBackdrop(), clearGlows(), glow(), paintShade(), placeGlows(), placeSides() (+5 more)

### Community 212 - "next"
Cohesion: 0.18
Nodes (15): GET(), PaintingRow, POST(), UPLOADS_PER_ARTIST, POST(), UPLOADS_PER_ARTIST, dynamic, RoomPage() (+7 more)

### Community 213 - "HallArranger.tsx"
Cohesion: 0.21
Nodes (10): loadHallArranger(), MinigameFrame(), MinigameFrameProps, HallArranger(), HallArrangerProps, Painting, currentHallOrder(), hallPlacements() (+2 more)

### Community 214 - "VitalsReporter.tsx"
Cohesion: 0.29
Nodes (8): firstPainting(), flush(), Metric, queue, REPORTED, VitalsReporter(), FIRST_PAINTING_MARK, MUSEUM_START_MARK

### Community 215 - "darknessAt"
Cohesion: 0.39
Nodes (6): CEILING, darknessAt(), pool(), RoomLight, smooth(), dirty

### Community 216 - "share.ts"
Cohesion: 0.33
Nodes (5): ShareOutcome, shareResult(), ShareSummary, shareText(), base

### Community 217 - "BunnyArtist.tsx"
Cohesion: 0.50
Nodes (4): BunnyArtist(), BunnyMood, Pencil(), POSES

## Knowledge Gaps
- **5 isolated node(s):** `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1565 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **30 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `stage.ts`, `SketchGuess.tsx`, `(hall)/page.tsx`, `round.ts`, `app/layout.tsx`, `bug-reports.ts`, `machine.ts`, `Museum.tsx`, `SoundProvider.tsx`, `app/page.tsx`, `Test Fakes and Helpers`, `features/economy/index.ts`, `room-events.ts`, `PersonalRoom.tsx`, `tables.ts`, `pond-state.ts`, `wardrobe.ts`, `requireArtist`, `LeaderboardPanel`, `Walkthrough.tsx`, `Web Package Dependencies`, `useSoundEffects.ts`, `LandingFx`, `risk.ts`, `CrowdPreview.tsx`, `a/[slug]/page.tsx`, `DecorDrawer.tsx`, `Water.tsx`, `PondTicker.tsx`, `pond-format.ts`, `economy/store.ts`, `BountyPanel.tsx`, `CodesSection.tsx`, `domain/guestboard.ts`, `pond-api.ts`, `AccountSheet.tsx`, `RigPreview.tsx`, `PondRoom.tsx`, `HallArranger.tsx`, `VitalsReporter.tsx`, `ClosetView.tsx`, `gallery/page.tsx`, `FishingView.tsx`, `useBackgroundMusic.ts`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._
- **What connects `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json` to the rest of the system?**
  _5 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `stage.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.03324216284451925 - nodes in this community are weakly interconnected._
- **Why does `three` connect `remote-visitors.ts` to `atelier.ts`, `stage.ts`, `perf.ts`, `master`, `scene/ambience.ts`, `scene/assets.ts`, `Atelier: the dressing mirror, and show-don't-tell keeping`, `npc-layer.ts`, `scene.ts`, `cozy.ts`, `pond/art.ts`, `wardrobe.ts`, `hall/room.ts`, `rig.ts`, `ambience.ts`, `Web Package Dependencies`, `pond/room.ts`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Should `SketchGuess.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11742424242424243 - nodes in this community are weakly interconnected._
- **Why does `defaultStore()` connect `AccountSheet.tsx` to `stage.ts`, `remote-visitors.ts`, `pond-api.ts`, `SyncStore`, `pondgame/lib/api.ts`, `room-events.ts`, `rooms.ts`, `createStage`, `slots/store.ts`, `PersonalRoom.tsx`, `pond-state.ts`, `wardrobe.ts`, `hall/room.ts`, `economy/store.ts`, `createPondRoom`, `pond/room.ts`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Should `themes.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05605499735589635 - nodes in this community are weakly interconnected._