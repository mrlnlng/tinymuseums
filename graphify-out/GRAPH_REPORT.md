# Graph Report - tiny-museum  (2026-11-24)

## Corpus Check
- 574 files · ~351,445 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 107 file(s) not represented in the graph (top: .avif 57, .glb 38, .css 7)

## Summary
- 5128 nodes · 13309 edges · 226 communities (192 shown, 34 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 264 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4d336fbc`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- features/economy/index.ts
- locations.ts
- SketchGuess.tsx
- src/rooms/doors.ts
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
- ticket/route.ts
- media/storage.ts
- pond-api.ts
- ambience.ts
- core/src/index.ts
- Web Package Dependencies
- Gamifying Tiny Museum — genre direction & engagement research
- AssetImage
- remote-visitors.ts
- risk.ts
- amplify/tsconfig.json
- 5. Customization menu — what other people are doing
- stage.ts
- domain/sketch.ts
- Web TSConfig
- Root Package Manifest
- confirm/page.tsx
- PerfMeter
- import-fishing-assets.mjs
- Base TSConfig
- Amplify Build Spec
- epoch.ts
- actions.ts
- Placement
- env.ts
- Water.tsx
- Worker Package Manifest
- Public Asset Manifest
- features/rooms/doors.ts
- atelier.ts
- compose-atelier.mjs
- catalog.ts
- pond-format.ts
- rules.ts
- economy/store.ts
- sketchguess/lib/api.ts
- room.ts
- minimap.ts
- slots/store.ts
- domain/guestboard.ts
- Sound Effect Assets
- art-cache.ts
- Custom HTTP Headers
- Sharp Layer Package
- ColorRecall.tsx
- scene/ambience.ts
- DoorEditor
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
- import-home-assets.mjs
- Bug Reports SQL Schema
- Vitals SQL Schema
- createNpcLayer
- Curating the paintings (2026-11-07)
- pond/room.ts
- Other visitors
- Run-Once Schema
- atelier/room.ts
- FishingView.tsx
- AtelierRoom
- hang-tag.ts
- layout.ts
- json
- graftCostume
- pondgame/lib/api.ts
- worker/tsconfig.json
- core/tsconfig.json
- DoorEditor.tsx
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
- ClosetView.tsx
- import-landing-assets.mjs
- presence/tsconfig.json
- wallet.ts
- tsconfig.test.json
- rooms.ts
- BunnyArtist.tsx
- peers.ts
- run.ts
- loadCozyArt
- backend.ts
- builtUrl
- room-places.ts
- bug-reports.ts
- AccountSheet.tsx
- LeaderboardPanel.tsx
- drawingOn
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
- stone-path-bake.ts
- import-hall-assets.mjs
- FilesystemStorage
- Walkthrough.tsx
- createPondRoom
- garlandRibbon
- createPlacementLayer
- Atelier: the dressing mirror, and show-don't-tell keeping
- darknessAt
- PaintingEditor.tsx
- bake-shopkeeper.mjs
- Multiplayer ("other visitors") — plan v2 (Cloudflare)
- Lobby
- createCozyBackdrop
- gallery.ts
- revealFloorTransition
- ktx2-atlases.mjs
- HallArranger.tsx
- ticket.ts
- a/[slug]/page.tsx
- frame-clock.test.ts
- PondTicker.tsx
- react
- visits.ts
- master
- visits/page.tsx
- vitals.ts
- FishingView.tsx
- schedule.test.ts
- Storyline (draft, saved 2026-11-17)
- Confirmed issues
- bake-pond-path.mjs
- personal/room.ts
- themes.ts
- draw.py
- 4. Transport: Cloudflare Durable Objects
- createPixelRatioGovernor
- SyncStore
- VitalsReporter.tsx
- Monets Lily Pond: exploration, UX and multiplayer QA
- PlayerCard
- .webSocketMessage
- AccountSheet
- scripts
- SoundProvider.tsx
- handlers.ts
- Context
- messages.ts
- lib/assets.ts
- npcs/README.md
- ArtCache
- nearby.ts
- Wardrobe
- createSitting
- createHallRoom
- app/layout.tsx
- lib/slots/index.ts
- CozyBackdrop
- Sitting
- rig
- Open rooms and the tip jar (design, 2026-11-21)
- ref_sharp
- Cafe
- doors.sql
- createStage
- painting-open
- icon-basket
- bunny-left
- bunny-right
- icon-home
- ticket

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
- `5.1 Emotes (v1)` --references--> `ScreenChrome()`  [INFERRED]
  docs/multiplayer-plan.md → apps/web/src/shared/components/ScreenChrome.tsx
- `E2E-009 — Room mutations ignore stale account identity` --references--> `memberFromRequest()`  [INFERRED]
  docs/testing/local-e2e-stress-2026-11-06.md → apps/web/src/shared/lib/member-route.ts
- `Where things stand` --references--> `sealEpoch()`  [INFERRED]
  docs/curation-plan.md → packages/core/src/domain/epoch.ts
- `19. Development-only: page payloads include the full room row` --references--> `getRoom()`  [INFERRED]
  docs/personal-room-issues.md → packages/core/src/domain/rooms.ts
- `Catalogue` --references--> `personalRoomFor()`  [INFERRED]
  docs/custom-room.md → packages/core/src/domain/rooms.ts

## Import Cycles
- None detected.

## Communities (226 total, 34 thin omitted)

### Community 0 - "features/economy/index.ts"
Cohesion: 0.08
Nodes (40): MuseumLayout(), openAccount(), CoinToast(), Toast, Purse(), Stamp(), WalletProvider(), serverSnapshot (+32 more)

### Community 1 - "locations.ts"
Cohesion: 0.14
Nodes (28): publishLocationAction(), discardLocation(), hangableOnly(), hasUnpublished(), inUse(), locationStates(), nudgeInRow(), OWNER (+20 more)

### Community 2 - "SketchGuess.tsx"
Cohesion: 0.09
Nodes (36): bestKeyFor(), BURST, clueUrl(), openingPlan(), Phase, pickAtRandom(), prepareSketchGame(), readDifficulty() (+28 more)

### Community 3 - "src/rooms/doors.ts"
Cohesion: 0.15
Nodes (22): DoorsRow, doorsState, parsed(), saveDoorsDraft(), addPassage(), checkDoors(), DEFAULT_DOORS, DOOR_ASPECT (+14 more)

### Community 4 - "app/page.tsx"
Cohesion: 0.17
Nodes (13): [BRAND_OWNER, ...BRAND_REST], CurrentlyShowing(), Decor(), dynamic, LandingPage(), LandingAccount(), glowSprite(), LandingFx() (+5 more)

### Community 5 - "round.ts"
Cohesion: 0.15
Nodes (27): deltaE(), GAMUT_EPSILON, hexToOklab(), inGamut(), linearRgbToOklab(), linearToSrgb(), Oklab, oklabToLinearRgb() (+19 more)

### Community 6 - "floor.ts"
Cohesion: 0.09
Nodes (34): clone(), closestOnSegment(), cross(), crossVec(), depthAtY(), depthBounds(), depthT(), DepthView (+26 more)

### Community 7 - "Core Asset Manifest"
Cohesion: 0.05
Nodes (41): artworks, audio, file, megabytes, seconds, sourceName, startedAt, bunny (+33 more)

### Community 8 - "scene/assets.ts"
Cohesion: 0.06
Nodes (51): AssetManifest, assetUrl(), bitmapTexture(), blankImage(), CAFE_CAT_FRAMES, CompressedLoader, elementTexture(), ENTRANCE_FILES (+43 more)

### Community 9 - "RoomContents"
Cohesion: 0.05
Nodes (23): Pose, Room, RoomOptions, Entry, Stage, Arrival, JoinedContents, RoomContents (+15 more)

### Community 10 - "machine.ts"
Cohesion: 0.11
Nodes (35): CastMeter(), ReelMeter(), armCast(), BITE_WINDOW, biteGap(), CHARGE_PERIOD, chargePower(), createReelState() (+27 more)

### Community 11 - "Museum.tsx"
Cohesion: 0.07
Nodes (37): CoinFound, ColorRecall, GameDesktop, GuestBoard, HallArranger, HelpGuide, loadCoinFound(), loadColorRecall() (+29 more)

### Community 12 - "Test Fakes and Helpers"
Cohesion: 0.09
Nodes (29): deferredFetch(), deviceSlot, FakeEvents, FakeStorage, fixture, fixtureB, fixtureRegistry, fixtureRegistryBoth (+21 more)

### Community 13 - "scene.ts"
Cohesion: 0.04
Nodes (34): disposeDisplayTexture(), HELM_PEDESTAL_FILE, prefersAvif(), HiddenCoin, createNotes(), createPedestal(), Notes, Pedestal (+26 more)

### Community 14 - "cozy.ts"
Cohesion: 0.08
Nodes (18): ATELIER_PROPS, AtelierImage, DRAWN, EYE, FINISH_TILES, FISH, HighlightArea, HOME_PROPS (+10 more)

### Community 15 - "logic.ts"
Cohesion: 0.07
Nodes (41): Door, doorOf(), wallpaperOf(), DecorDrawer, DecorDrawerProps, SLOT_LABELS, Tab, TABS (+33 more)

### Community 16 - "room-events.ts"
Cohesion: 0.10
Nodes (30): ChatButton(), REFUSED, joinRoom(), emit(), getPeople(), isInRoom(), isMuted(), muted (+22 more)

### Community 17 - "schedule.ts"
Cohesion: 0.07
Nodes (56): addDwellEmotes(), addEmote(), addGap(), addStand(), addWalk(), along(), buildRoomTable(), buildStayPlan() (+48 more)

### Community 18 - "ref_node_assert"
Cohesion: 0.12
Nodes (30): defineSlot(), docBytes(), SLOTS, byAtThenKey(), encoded(), latest, mapOf(), maxNumber() (+22 more)

### Community 19 - "amplify/package.json"
Cohesion: 0.17
Nodes (14): devDependencies, @aws-amplify/backend@^1.14.0, @aws-amplify/backend-cli@^1.6.0, aws-cdk-lib@^2.180.0, constructs@^10.3.0, name, private, scripts (+6 more)

### Community 20 - "PersonalRoom.tsx"
Cohesion: 0.09
Nodes (53): errorReason(), Offer, overDrawer(), PersonalRoom(), canPlaceNew(), carriedTo(), carryEnd(), carryMove() (+45 more)

### Community 21 - "prepare-models.mjs"
Cohesion: 0.07
Nodes (29): alongArm(), ARMS, armTurn(), BODIES, bruce, BRUCE_FIT, BRUCE_PLACE, BRUCE_SLEEVES (+21 more)

### Community 22 - "Traversal"
Cohesion: 0.09
Nodes (9): coverFloorTransition(), JumpPose, createRoomPassage(), fixture(), clamp(), fixture(), jump(), Traversal (+1 more)

### Community 23 - "core/package.json"
Cohesion: 0.06
Nodes (40): dependencies, @aws-sdk/client-s3@^3.1121.0, @aws-sdk/s3-request-presigner@^3.1121.0, bcryptjs@^2.4.3, obscenity@^0.4.6, pg@^8.13.1, sharp@^0.33.5, thumbhash@^0.1.1 (+32 more)

### Community 24 - "hitForVisitor"
Cohesion: 0.07
Nodes (48): POST(), ALLOWED, PER_VISITOR, POST(), POST(), POST(), POST(), GET() (+40 more)

### Community 25 - "ticket/route.ts"
Cohesion: 0.14
Nodes (26): GET(), PER_MEMBER, PUT(), PER_IP, POST(), presenceUrl(), Code, 3.2 Chosen names (members) (+18 more)

### Community 26 - "media/storage.ts"
Cohesion: 0.11
Nodes (17): CONTENT_TYPES, GET(), PUT(), ACCEPTED, createAssetFromUpload(), MAX_UPLOAD_BYTES, presignUpload(), registerUpload() (+9 more)

### Community 27 - "pond-api.ts"
Cohesion: 0.26
Nodes (18): buyPondBait(), claimPondBounty(), errorOf(), exchangePondPearls(), fetchPondBounties(), fetchPondDex(), fetchPondLeaderboard(), fetchPondState() (+10 more)

### Community 28 - "ambience.ts"
Cohesion: 0.12
Nodes (29): blade(), bloom(), BLOOMS, createPondAmbience(), update(), fishTexture(), frond(), FRONT_ROWS (+21 more)

### Community 29 - "core/src/index.ts"
Cohesion: 0.05
Nodes (115): CatchExtra, COLUMNS, insertCatch(), member(), namedMember(), randomId(), StatePatch, addBait() (+107 more)

### Community 30 - "Web Package Dependencies"
Cohesion: 0.07
Nodes (34): dependencies, embla-carousel-react@^8.6.0, next@^15.0.3, react@^19.0.0, react-dom@^19.0.0, swr@^2.5.1, three@^0.169.0, thumbhash@^0.1.1 (+26 more)

### Community 31 - "Gamifying Tiny Museum — genre direction & engagement research"
Cohesion: 0.10
Nodes (19): 0.1 The core experience, 0.2 Systems that make gamification cheap to build, 0.3 Constraints that shape any recommendation, 0. What the game is today (the deep dive), 1.1 The landscape (seven candidates, with verdicts), 1.2 Recommendation: a **cozy gallery life-sim** — "the gallery you live in", 1.3 The five design pillars the genre implies, 1. Genre direction (+11 more)

### Community 32 - "AssetImage"
Cohesion: 0.10
Nodes (25): motion@^13.1.1, BoardScreen(), BoardScreenProps, PinnedNotes(), PinnedNotesProps, ReadScreen(), ReadScreenProps, messageLength() (+17 more)

### Community 33 - "remote-visitors.ts"
Cohesion: 0.05
Nodes (50): Assets, Scenery, CUTS, disposeBoards(), Mark, plane(), ROPE_CUTS, ropeSlices() (+42 more)

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
Cohesion: 0.04
Nodes (60): CharacterSprites, CameraRig, Attachment, Carried, CarriedState, createCarried(), Character, Perch (+52 more)

### Community 38 - "domain/sketch.ts"
Cohesion: 0.09
Nodes (27): listPieces(), pieceImageUrl(), toPieceDto(), toPiece(), planSketchRound(), SKETCH_CHOICES, SketchCandidate, SketchRoundPlan (+19 more)

### Community 39 - "Web TSConfig"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 40 - "Root Package Manifest"
Cohesion: 0.10
Nodes (22): [, width, height], description, devDependencies, concurrently@^9.1.0, esbuild@^0.24.0, ktx2-encoder@^0.6.0, maxrects-packer@^2.7.3, playwright@^1.63.0 (+14 more)

### Community 41 - "confirm/page.tsx"
Cohesion: 0.33
Nodes (7): ConfirmFollow(), dynamic, dynamic, Unsubscribe(), FollowNotice(), confirmFollow(), unsubscribe()

### Community 43 - "import-fishing-assets.mjs"
Cohesion: 0.10
Nodes (12): CANVAS, clear, FONT, FRAME, heights, layout, lossless, manifest (+4 more)

### Community 44 - "Base TSConfig"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, lib, module, moduleResolution (+9 more)

### Community 45 - "Amplify Build Spec"
Cohesion: 0.12
Nodes (16): applications, appRoot, backend, frontend, baseDirectory, files, phases, commands (+8 more)

### Community 46 - "epoch.ts"
Cohesion: 0.12
Nodes (25): GET(), intParam(), GET(), sketchPool, unavailable(), DoorsPage(), dynamic, hallPaintings() (+17 more)

### Community 47 - "actions.ts"
Cohesion: 0.06
Nodes (70): AnalyticsPage(), dynamic, BugReportsPage(), dateFormat, dynamic, summary(), dateFormat, dynamic (+62 more)

### Community 48 - "Placement"
Cohesion: 0.06
Nodes (16): Carry, PersonalRoomProps, GhostOptions, PlacementLayer, PlacementTheme, Admin mode (gamma), Decisions (2026-11-17, with the user), Room look (web, `features/rooms/themes/cozy.ts`, `features/rooms/personal/room.ts`) (+8 more)

### Community 49 - "env.ts"
Cohesion: 0.22
Nodes (8): target, SCHEMA_DIR, isProduction(), presenceSecret(), repoRoot, required(), sessionSecret(), setting()

### Community 50 - "Water.tsx"
Cohesion: 0.07
Nodes (39): AmbientShadow, box(), BUCKET, bunnyBox(), easeOut(), Glint, LEFT_STYLE, lineColour() (+31 more)

### Community 51 - "Worker Package Manifest"
Cohesion: 0.14
Nodes (14): dependencies, @tiny/core@*, exports, ./lambda, @tiny/core, main, name, private (+6 more)

### Community 52 - "Public Asset Manifest"
Cohesion: 0.12
Nodes (15): artworks, bunny, size, floor, size, fonts, icon-no-photos, size (+7 more)

### Community 53 - "features/rooms/doors.ts"
Cohesion: 0.19
Nodes (13): doorArtUrl(), loadDoorArt(), loadRoomDoorArt(), pending, doorDefs(), doorsOf(), setMuseumDoors(), GuideTalk (+5 more)

### Community 54 - "atelier.ts"
Cohesion: 0.07
Nodes (32): AtelierDoor, AtelierImage, BuiltRoom, Cardigan, CARDIGAN_NAMES, Control, refresh(), isCardigan() (+24 more)

### Community 55 - "compose-atelier.mjs"
Cohesion: 0.12
Nodes (10): body, dressLayer, dressWidth, floralWidth, hanger, MANNEQUIN_CANVAS, mask, root (+2 more)

### Community 56 - "catalog.ts"
Cohesion: 0.21
Nodes (13): ownershipFor(), CatalogItem, CatalogKind, FREE_CHARACTERS, isCatalogItem(), ITEMS, ItemSlot, priceOf() (+5 more)

### Community 57 - "pond-format.ts"
Cohesion: 0.12
Nodes (26): PondDex, EXCHANGE_DAILY_STAMPS, EXCHANGE_PEARLS_PER_STAMP, FISH_ART, formatPercent(), formatShortSizeCm(), ODDS_BAIT, POND_BAIT (+18 more)

### Community 58 - "rules.ts"
Cohesion: 0.16
Nodes (17): localDay(), at(), EXCHANGE_DAILY_STAMPS, EXCHANGE_PEARLS_PER_STAMP, exchangeClaimKey(), GAME_DAILY_CAP, GameId, GAMES (+9 more)

### Community 59 - "economy/store.ts"
Cohesion: 0.07
Nodes (64): CARRY_CAP, carryAdd(), CarryEntry, carryPrune(), carryRemove(), chunk(), buildClaim(), BuiltClaim (+56 more)

### Community 60 - "sketchguess/lib/api.ts"
Cohesion: 0.15
Nodes (16): sameOriginUrl(), PreparedGame, decodeImage(), fetchBitmap(), fetchRound(), guarded(), InkMap, LoadedRound (+8 more)

### Community 61 - "room.ts"
Cohesion: 0.15
Nodes (27): admitted(), Attachment, farewell(), GHOST_MS, HELLO_TIMEOUT_MS, holdsOf(), homeOf(), MAX_WAITING_PER_IP (+19 more)

### Community 62 - "minimap.ts"
Cohesion: 0.07
Nodes (34): createMinimap(), draw(), drawRoom(), floors(), follow(), sketchOf(), doorPoint(), FALLBACK_TINT (+26 more)

### Community 63 - "slots/store.ts"
Cohesion: 0.18
Nodes (14): ANON_PREFIX, anonKey(), deviceKey(), isMemberSlotKey(), listKeys(), MEMBER_KEY, memberKey(), memberPrefix() (+6 more)

### Community 64 - "domain/guestboard.ts"
Cohesion: 0.10
Nodes (29): GET(), ComposeScreen(), ComposeScreenProps, blankDraft(), GuestBoard(), GuestBoardProps, View, StickyNoteProps (+21 more)

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

### Community 69 - "ColorRecall.tsx"
Cohesion: 0.22
Nodes (16): ColorRecall(), ColorRecallProps, Phase, readBest(), showMs(), undoAdminUnlock(), unlockEverything(), saveIfHigher() (+8 more)

### Community 70 - "scene/ambience.ts"
Cohesion: 0.14
Nodes (13): createHallAmbience(), finish(), glowTexture(), HallAmbience, mulberry(), painted(), vignetteTexture(), Backdrop (+5 more)

### Community 71 - "DoorEditor"
Cohesion: 0.22
Nodes (16): saveDoorsAction(), DoorEditor(), add(), apply(), commitSlide(), nudge(), pick(), pointerDown() (+8 more)

### Community 72 - "Confirmed issues"
Cohesion: 0.12
Nodes (17): Confirmed issues, E2E-002 — Valid edge placement rejected through floating-point precision, E2E-003 — One owned prop can be placed multiple times, E2E-004 — Reload before autosave silently loses the latest placement, E2E-005 — Failed save and failed Done have no visible mobile explanation, E2E-006 — Restoring connectivity does not retry a failed draft save, E2E-007 — Keyboard activation cannot place drawer items, E2E-008 — Creating an account from My Room leaves the signed-in user on the sign-in prompt (+9 more)

### Community 73 - "Placement"
Cohesion: 0.09
Nodes (3): Job, DecorController, WorkKind

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
Cohesion: 0.25
Nodes (13): ArtByRoom, colorAt(), decoded(), EDGE_BAND, EDGE_BANDS, EDGE_OVERLAP, edgeTexture(), imageOf() (+5 more)

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

### Community 89 - "import-home-assets.mjs"
Cohesion: 0.14
Nodes (11): DOOR, DOOR_BACKDROP, drop, FURNITURE, manifest, manifestPath, masters, ORNATE_PAPER (+3 more)

### Community 93 - "createNpcLayer"
Cohesion: 0.19
Nodes (20): idleCel(), createNpcLayer(), createResidentView(), createView(), departedRecently(), draw(), fadeOut(), glyphWidth() (+12 more)

### Community 94 - "Curating the paintings (2026-11-07)"
Cohesion: 0.12
Nodes (15): hang(), 1. The registry and the table, 2. The studio's Location picker, 3. The rooms draw what is placed, 4. Credits, 5. Retiring self-serve artists, Building it, Curating the paintings (2026-11-07) (+7 more)

### Community 95 - "pond/room.ts"
Cohesion: 0.11
Nodes (26): FAR_LIFT, FAR_SCALE, liftAt(), pathHalfWidth(), pathX(), PondPath, PROP_DEPTH, scaleAt() (+18 more)

### Community 96 - "Other visitors"
Cohesion: 0.29
Nodes (6): How it plays, Other visitors, Privacy, Running it in production, Running it locally, Staying consistent

### Community 104 - "atelier/room.ts"
Cohesion: 0.07
Nodes (48): AtelierPage(), dynamic, metadata, allowedCharacter(), OwnedSnapshot, owns(), walletReady(), Atelier() (+40 more)

### Community 105 - "FishingView.tsx"
Cohesion: 0.11
Nodes (17): CONFETTI_COLORS, ConfettiPiece, makeConfetti(), RevealCard(), RevealCardProps, TIER_MS, TIER_SFX, useCountUp() (+9 more)

### Community 106 - "AtelierRoom"
Cohesion: 0.10
Nodes (3): AtelierRoom, Options, SlotHandle

### Community 107 - "hang-tag.ts"
Cohesion: 0.12
Nodes (8): CARD, createHangTag(), HangTag, HangTagStyle, HOLE, KNOT, What goes, and what replaces it, Refusal

### Community 108 - "layout.ts"
Cohesion: 0.17
Nodes (13): cafeAfterIndex(), computeLayout(), clear(), placeCafe(), cutRooms(), DoorSpan, HALL_DOOR_FOOT, HallRoomKind (+5 more)

### Community 109 - "json"
Cohesion: 0.07
Nodes (74): POST(), POST(), GET(), GLOBAL, PER_IP, POST(), POST(), GLOBAL (+66 more)

### Community 110 - "graftCostume"
Cohesion: 0.27
Nodes (14): canvasFit(), compose(), graftCostume(), copyAccessor(), copyMaterial(), copyMesh(), copyTexture(), copyView() (+6 more)

### Community 111 - "pondgame/lib/api.ts"
Cohesion: 0.28
Nodes (16): buyPondBait(), castPond(), chainPondBait(), errorOf(), fetchPondState(), isRecord(), memberId(), PondCastReply (+8 more)

### Community 112 - "worker/tsconfig.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 113 - "core/tsconfig.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 114 - "DoorEditor.tsx"
Cohesion: 0.16
Nodes (14): hallDoorSpan(), ENTRANCE, firstLines(), guideX(), PIXELS, REASONS, roomLabel(), DOOR_ROOMS (+6 more)

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
Cohesion: 0.17
Nodes (20): fetch(), Env, isHome(), isItem(), isName(), isPid(), isSeq(), MAX_HOLDS (+12 more)

### Community 119 - "Costume gallery doorway"
Cohesion: 0.50
Nodes (3): Costume gallery doorway, Curtain colour edit, Prompt

### Community 121 - "Fishing forest: painted asset pass"
Cohesion: 0.10
Nodes (18): Assets, Bruce's collection refresh (2026-11-08), Fishing forest illustrations, Made by hand (not touched by the script), Main hall v2 (2026-11-10), Monets Lily Pond (2026-11-08), 1. Forest doorway, 2. Woodland noticeboard (+10 more)

### Community 124 - "The Costume Atelier"
Cohesion: 0.13
Nodes (14): Adding a character, Adding a costume, Art not supplied as files, Bruce's Chronicles, Checked against the mocks (2026-11-07), Costume fit review, Fitting clothes to other characters, Floral collection (+6 more)

### Community 125 - "PondRoom.tsx"
Cohesion: 0.09
Nodes (24): Loading(), metadata, PondPage(), POND_NAME, getPondStateSnapshot(), subscribePondState(), usePondState(), PondHud() (+16 more)

### Community 126 - "wander.test.ts"
Cohesion: 0.12
Nodes (16): FloorSpot, Job, Place, Phase, ResidentState, WalkPath, WalkState, BASE_JOB (+8 more)

### Community 127 - "ClosetView.tsx"
Cohesion: 0.09
Nodes (30): ClosetView(), onKeyDown(), LISTS, PLACE, PODIUM_SRC, Props, Slot, SPOTLIGHT_SRC (+22 more)

### Community 128 - "import-landing-assets.mjs"
Cohesion: 0.13
Nodes (9): socket(), CAT, drop, EXPECTED, manifest, manifestPath, masters, root (+1 more)

### Community 129 - "presence/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, types, exclude, extends, include, ../../tsconfig.base.json

### Community 130 - "wallet.ts"
Cohesion: 0.06
Nodes (67): signOutAction(), clearSessionCookie(), registry, started(), artist(), member(), piece(), randomId() (+59 more)

### Community 131 - "tsconfig.test.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 132 - "rooms.ts"
Cohesion: 0.05
Nodes (61): config, SECURITY_HEADERS, roomEditor, GET(), PaintingRow, PER_EDITOR, PUT(), versionOf() (+53 more)

### Community 133 - "BunnyArtist.tsx"
Cohesion: 0.11
Nodes (20): between(), CAT, Edge, EDGES, runLandingCat(), choosePeeker(), peek(), walk() (+12 more)

### Community 134 - "peers.ts"
Cohesion: 0.11
Nodes (13): PresencePreviewPage(), PresencePreview(), Entry, INTERPOLATION_DELAY_MS, PEER_TIMEOUT_MS, PeerTable, positionAt(), RemoteVisitor (+5 more)

### Community 135 - "run.ts"
Cohesion: 0.20
Nodes (7): admin, childEnv, client, database, fresh, migrations, target

### Community 136 - "loadCozyArt"
Cohesion: 0.19
Nodes (15): canvasTexture(), ceilingTexture(), cozyPropImageUrl(), fishTexture(), floorTexture(), floorWearCanvas(), loadCozyArt(), loadImage() (+7 more)

### Community 137 - "backend.ts"
Cohesion: 0.15
Nodes (12): amplifyDir, backend, everyMinutes, mediaBucket, missing, repoRoot, REQUIRED, setting() (+4 more)

### Community 138 - "builtUrl"
Cohesion: 0.30
Nodes (11): Loading(), dynamic, Hall(), MuseumPage(), DENSITY_MEDIA, HallPreload(), HallSkeleton(), atlasSheets() (+3 more)

### Community 139 - "room-places.ts"
Cohesion: 0.14
Nodes (26): HallLayout, atelierRoomInfo(), atelierX(), copy(), FurniturePlacement, hallCache, hallRoomInfo(), onGround() (+18 more)

### Community 140 - "bug-reports.ts"
Cohesion: 0.11
Nodes (27): BugReportHost(), BugReportSheet, BugReportSheet(), send(), Status, collectContext(), inAppBrowser(), onOpenBugReport() (+19 more)

### Community 141 - "AccountSheet.tsx"
Cohesion: 0.23
Nodes (9): AccountHost(), AccountSheet, NAME_ERRORS, Pending, View, AccountMode, onOpenAccount(), openAccountCreation() (+1 more)

### Community 142 - "LeaderboardPanel.tsx"
Cohesion: 0.12
Nodes (31): refreshWalletNow(), PearlIcon(), PondBoardId, PondBoardPeriod, PondBoardRow, PondBounties, PondLeaderboard, fishArt() (+23 more)

### Community 143 - "drawingOn"
Cohesion: 0.20
Nodes (12): atticWindowCanvas(), bareBulbCanvas(), boardsCanvas(), cobwebCanvas(), cozyFinishImageUrl(), creamCanvas(), drawingOn(), dustCanvas() (+4 more)

### Community 144 - "The Moonlit Pond — design"
Cohesion: 0.09
Nodes (22): Art the pond needs from the artist, Build contract (decided 2026-11-07), Build phases, Collection and goals, Done, Done, Guardrails, Leaderboards (+14 more)

### Community 145 - "Pond rework"
Cohesion: 0.18
Nodes (10): Baits, Client, Decisions, Done, Notes, Pond rework, Server, Species (+2 more)

### Community 146 - "initialize"
Cohesion: 0.19
Nodes (14): boundedCameraX(), initialize(), aim(), drawFrame(), handleClick(), handlePointerDown(), handlePointerMove(), isResting() (+6 more)

### Community 147 - "Orchestration contract — you plan, DSH workers execute"
Cohesion: 0.29
Nodes (6): Briefing a worker, Budget hygiene, graphify, Orchestration contract — you plan, DSH workers execute, The worker, When not to delegate

### Community 148 - "tables.ts"
Cohesion: 0.11
Nodes (32): FrameShape, debugSpecies(), debugVariant(), GuestRoll, guestTreasure(), rollGuest(), BAIT, BAIT_BY_ID (+24 more)

### Community 149 - "lib/presence.ts"
Cohesion: 0.08
Nodes (24): Outcome, Connect, connectWebSocket(), fetchTicket, HEARTBEAT_MS, HIDDEN_LIMIT_MS, RETRY_MS, sameLook() (+16 more)

### Community 150 - "useBackgroundMusic.ts"
Cohesion: 0.12
Nodes (27): SoundProvider(), BackgroundMusic, clampVolume(), isDocumentHidden(), Options, useBackgroundMusic(), VISIBILITY_EVENTS, EFFECTS (+19 more)

### Community 151 - "defaultStore"
Cohesion: 0.32
Nodes (11): PondStateView, PondTier, ensurePondStateStarted(), GUEST, listeners, LOADING, PondStateSnapshot, publish() (+3 more)

### Community 152 - "SlotDef"
Cohesion: 0.20
Nodes (3): FakeServer, SlotState, SlotDef

### Community 153 - "pond-boards.ts"
Cohesion: 0.11
Nodes (28): BOARDS, GET(), oneOf(), PER_VISITOR, PERIODS, compare(), DexRow, displayName() (+20 more)

### Community 154 - "stone-path-bake.ts"
Cohesion: 0.31
Nodes (8): bakeStonePath(), blank(), softened(), STONE_LIGHT, STONE_SHADE, TUFT, warmUp(), yieldToMain()

### Community 155 - "import-hall-assets.mjs"
Cohesion: 0.09
Nodes (17): BASEBOARD, CURTAIN, drop, EXPECTED, file(), manifest, manifestPath, masters (+9 more)

### Community 157 - "Walkthrough.tsx"
Cohesion: 0.15
Nodes (19): BACKDROP_STYLE, MoreArrow(), NavArrow(), Props, SLIDE, Walkthrough(), XIcon(), decodedFrames (+11 more)

### Community 158 - "createPondRoom"
Cohesion: 0.32
Nodes (13): createPondRoom(), approach(), busy(), finishWalk(), goTo(), leave(), move(), nearest() (+5 more)

### Community 159 - "garlandRibbon"
Cohesion: 0.33
Nodes (7): shape(), garlandRibbon(), at(), GarlandShape, Ribbon, sag(), shape

### Community 160 - "createPlacementLayer"
Cohesion: 0.31
Nodes (8): aspectOf(), createPlacementLayer(), drawOutline(), dropGhosts(), dropHelper(), extrasFor(), silhouette(), sizeOf()

### Community 161 - "Atelier: the dressing mirror, and show-don't-tell keeping"
Cohesion: 0.13
Nodes (14): Atelier: the dressing mirror, and show-don't-tell keeping, Build order, Built (2026-11-20), Decisions (2026-11-19), Follow-ups (2026-11-20), Goal, In the room, Keeping (+6 more)

### Community 162 - "darknessAt"
Cohesion: 0.39
Nodes (6): CEILING, darknessAt(), pool(), RoomLight, smooth(), dirty

### Community 163 - "PaintingEditor.tsx"
Cohesion: 0.28
Nodes (7): EditedPainting, isLink(), PaintingEditor(), upload(), Phase, PHASE_LABEL, sha256Hex()

### Community 164 - "bake-shopkeeper.mjs"
Cohesion: 0.25
Nodes (5): bodyTextures, COATS, { json, bin }, manifest, maps

### Community 165 - "Multiplayer ("other visitors") — plan v2 (Cloudflare)"
Cohesion: 0.17
Nodes (11): 0. Summary, 10. Decisions, 1. Product contract changes (approved 2026-10-31), 2. What already exists that this builds on, 3.1 Generated names (everyone has one), 3. Names, 5.1 Emotes (v1), 5. Protocol (`packages/core/src/presence/protocol.ts`) (+3 more)

### Community 167 - "createCozyBackdrop"
Cohesion: 0.23
Nodes (13): alphaCanvas(), ceilingGeometry(), createCozyBackdrop(), clearGlows(), glow(), paintShade(), placeGlows(), placeSides() (+5 more)

### Community 168 - "gallery.ts"
Cohesion: 0.24
Nodes (12): deletePiece(), GalleryPiece, hangPiece(), MAX_STANDS, movePiece(), unhangPiece(), evaluatePublishBar(), publishArtist() (+4 more)

### Community 169 - "revealFloorTransition"
Cohesion: 0.70
Nodes (3): Loading(), AtelierLoading(), revealFloorTransition()

### Community 171 - "HallArranger.tsx"
Cohesion: 0.27
Nodes (7): loadHallArranger(), HallArranger(), HallArrangerProps, HallRoomData, Painting, hallPlacements(), reasonLabel()

### Community 172 - "ticket.ts"
Cohesion: 0.23
Nodes (12): decoder, encoder, fromBase64Url(), HmacKey, isOwn(), isTicket(), keyFor(), keys (+4 more)

### Community 173 - "a/[slug]/page.tsx"
Cohesion: 0.31
Nodes (6): ArtistPage(), dynamic, generateMetadata(), GET(), FollowForm(), getArtistPage()

### Community 174 - "frame-clock.test.ts"
Cohesion: 0.38
Nodes (5): MAX_CATCH_UP_SECONDS, MAX_STEP_SECONDS, movementSteps(), RESTING_TICK_MS, shouldTick()

### Community 175 - "PondTicker.tsx"
Cohesion: 0.29
Nodes (11): fetchPondFeed(), PondFeedItem, catchLabel(), formatSizeCm(), speciesFor(), speciesName(), speciesTier(), isGolden() (+3 more)

### Community 176 - "react"
Cohesion: 0.12
Nodes (21): openBugReport(), GuideTalk(), fitWidth(), HelpGuide(), HelpGuideProps, POINTER_STEPS, TOUCH_STEPS, loadGameDesktop() (+13 more)

### Community 177 - "visits.ts"
Cohesion: 0.18
Nodes (17): state(), flush(), visibleMs(), VisitState, count(), currentSalts(), DEVICES, loadSalts() (+9 more)

### Community 178 - "master"
Cohesion: 0.32
Nodes (7): paintedCostume(), closedWaist(), floralOutfits(), goldOutfits(), master(), placed(), turned()

### Community 179 - "visits/page.tsx"
Cohesion: 0.27
Nodes (9): amount(), duration(), dynamic, LANDMARKS, PAGES, RANGES, share(), VisitsPage() (+1 more)

### Community 180 - "vitals.ts"
Cohesion: 0.16
Nodes (15): dynamic, format(), grade(), METRICS, PAGES, PerformancePage(), RANGES, DEVICES (+7 more)

### Community 181 - "FishingView.tsx"
Cohesion: 0.14
Nodes (22): BaitTray(), BaitTrayProps, CAST_ERRORS, coarsePointer(), FishingView(), initialEasyReel(), isTyping(), LOST (+14 more)

### Community 182 - "schedule.test.ts"
Cohesion: 0.07
Nodes (26): BY_ID, CAST, NPC_WALK_SPEED, NpcCharacter, RESIDENT_IDS, WANDERER_IDS, JOBS, NpcGround (+18 more)

### Community 183 - "Storyline (draft, saved 2026-11-17)"
Cohesion: 0.15
Nodes (12): Arc (soft, no fail state), Built so far, How it ties to what exists, Locked (2026-11-21, the owner), Next tasks (when picked up), Open questions, Premise, Revision (2026-11-21, the owner) (+4 more)

### Community 184 - "Confirmed issues"
Cohesion: 0.06
Nodes (29): onClick(), 10. Long names run off the name sign, 11. The rooms API skips the stale-tab member check, 12. The bunny is dragged along while you pan in Decorate, 13. Pages that redirect or don't exist answer 200, 14. Error codes reveal which room slugs exist, 15. The name sign slides under the top-right buttons in Decorate, 16. Level-up celebrations can be farmed (+21 more)

### Community 185 - "bake-pond-path.mjs"
Cohesion: 0.21
Nodes (7): blank(), manifest, manifestPath, ORIGINAL_SOURCE, originalPath(), root, softened()

### Community 186 - "personal/room.ts"
Cohesion: 0.06
Nodes (31): AtelierArt, disposeAtelierArt(), INSET_DOOR_Z, loadGalleryDoor(), loadGalleryPillar(), loadImage(), pending, GuestBoardNotes (+23 more)

### Community 187 - "themes.ts"
Cohesion: 0.06
Nodes (33): Catalogue, Data model (core), 1. Items placed against a zone edge fail to save, and the whole draft reverts, 2. One owned item can be placed many times, 3. Any save rejection throws away all unsaved work, 4. Changes made just before leaving are lost, 5. Fish trophies can be claimed without playing, High (+25 more)

### Community 189 - "4. Transport: Cloudflare Durable Objects"
Cohesion: 0.25
Nodes (8): 4. Transport: Cloudflare Durable Objects, Decision (2026-10-31), Deploying, Identity cannot be forged, Local development and tests, Rooms and capacity, Shape of `apps/presence` (about 200 lines), main()

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

### Community 195 - ".webSocketMessage"
Cohesion: 0.44
Nodes (3): attachmentOf(), Room, sendTo()

### Community 196 - "AccountSheet"
Cohesion: 0.29
Nodes (9): AccountSheet(), continueAnyway(), doSignOut(), runDelete(), runName(), submit(), submitDelete(), submitName() (+1 more)

### Community 197 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, db:schema, deploy:backend, dev, dev:presence, dev:web, dev:worker (+6 more)

### Community 198 - "SoundProvider.tsx"
Cohesion: 0.21
Nodes (7): StageOptions, RoomSound, SoundContext, SoundState, EffectName, STATIC_BASE, staticUrl()

### Community 199 - "handlers.ts"
Cohesion: 0.07
Nodes (53): loop(), shutdown(), sleep(), sweepStale(), DrainResult, handler(), repairFrames(), clearCatches() (+45 more)

### Community 201 - "messages.ts"
Cohesion: 0.36
Nodes (6): checkMessage(), INVISIBLE, MESSAGE_MAX, MessageCheck, normalizeMessage(), hasProfanity()

### Community 202 - "lib/assets.ts"
Cohesion: 0.03
Nodes (94): CrowdPreviewPage(), RigPreviewPage(), CrowdPreview(), draw(), KINDS, Stats, Window, NEXT (+86 more)

### Community 205 - "nearby.ts"
Cohesion: 0.18
Nodes (6): createNearby(), Nearby, NearbyReach, RoomSpan, reach, strip

### Community 208 - "createHallRoom"
Cohesion: 0.18
Nodes (19): earn(), createHallRoom(), buildRoom(), buildRoomContents(), cafeRoom(), tap(), enterDoor(), entranceRoom() (+11 more)

### Community 209 - "app/layout.tsx"
Cohesion: 0.15
Nodes (13): bethEllen, inspiratiq, metadata, notoSans, RootLayout(), sniglet, viewport, ServiceWorker() (+5 more)

### Community 210 - "lib/slots/index.ts"
Cohesion: 0.08
Nodes (16): KeepOnOtherDevices(), WalkAlone(), announceNameChange(), useVisitorName(), VisitorName, Probe(), StoredSlot, EventTargetLike (+8 more)

### Community 213 - "rig"
Cohesion: 0.40
Nodes (5): image(), rig(), slimGlb(), write(), The bunny rig

### Community 214 - "Open rooms and the tip jar (design, 2026-11-21)"
Cohesion: 0.29
Nodes (6): Built (2026-11-21), Decisions, Numbers (first pass, to tune), Open questions, Open rooms and the tip jar (design, 2026-11-21), Story hooks

### Community 216 - "ref_sharp"
Cohesion: 0.27
Nodes (8): CFG, closeEye(), eraseMouth(), inpaint(), sample(), sharp, [src, out, cfgPath], warp()

### Community 221 - "createStage"
Cohesion: 0.30
Nodes (10): FLICK, flickDirection(), isUpwardFlick(), createStage(), closeEntry(), enter(), handlePointerUp(), isCurrent() (+2 more)

### Community 225 - "painting-open"
Cohesion: 0.50
Nodes (4): file, kilobytes, seconds, painting-open

### Community 230 - "icon-basket"
Cohesion: 0.67
Nodes (3): icon-basket, file, vector

## Knowledge Gaps
- **5 isolated node(s):** `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1661 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **34 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `features/economy/index.ts`, `SketchGuess.tsx`, `app/page.tsx`, `rooms.ts`, `peers.ts`, `builtUrl`, `Museum.tsx`, `bug-reports.ts`, `AccountSheet.tsx`, `LeaderboardPanel.tsx`, `logic.ts`, `room-events.ts`, `Test Fakes and Helpers`, `PersonalRoom.tsx`, `useBackgroundMusic.ts`, `Walkthrough.tsx`, `Web Package Dependencies`, `AssetImage`, `risk.ts`, `PaintingEditor.tsx`, `revealFloorTransition`, `HallArranger.tsx`, `a/[slug]/page.tsx`, `PondTicker.tsx`, `actions.ts`, `Water.tsx`, `FishingView.tsx`, `pond-format.ts`, `domain/guestboard.ts`, `VitalsReporter.tsx`, `ColorRecall.tsx`, `SoundProvider.tsx`, `lib/assets.ts`, `app/layout.tsx`, `lib/slots/index.ts`, `atelier/room.ts`, `FishingView.tsx`, `DoorEditor.tsx`, `PondRoom.tsx`, `ClosetView.tsx`?**
  _High betweenness centrality (0.091) - this node is a cross-community bridge._
- **What connects `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json` to the rest of the system?**
  _5 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `features/economy/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08245981830887492 - nodes in this community are weakly interconnected._
- **Why does `three` connect `stage.ts` to `remote-visitors.ts`, `scene/ambience.ts`, `stone-path-bake.ts`, `scene/assets.ts`, `atelier/room.ts`, `lib/assets.ts`, `hang-tag.ts`, `scene.ts`, `cozy.ts`, `pond/art.ts`, `master`, `atelier.ts`, `personal/room.ts`, `ambience.ts`, `Web Package Dependencies`, `pond/room.ts`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Should `locations.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1431451612903226 - nodes in this community are weakly interconnected._
- **Why does `assetUrl()` connect `lib/assets.ts` to `scene/assets.ts`, `loadCozyArt`, `builtUrl`, `LeaderboardPanel.tsx`, `cozy.ts`, `drawingOn`, `remote-visitors.ts`, `stage.ts`, `PondTicker.tsx`, `react`, `Water.tsx`, `features/rooms/doors.ts`, `pond-format.ts`, `DoorEditor`, `pond/art.ts`, `createNpcLayer`, `atelier/room.ts`, `FishingView.tsx`, `DoorEditor.tsx`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Should `SketchGuess.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08879492600422834 - nodes in this community are weakly interconnected._