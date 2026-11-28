# Graph Report - tiny-museum  (2026-11-28)

## Corpus Check
- 617 files · ~377,822 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 118 file(s) not represented in the graph (top: .avif 60, .glb 46, .css 7)

## Summary
- 5469 nodes · 14473 edges · 222 communities (194 shown, 28 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 280 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `990cb25c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- stage.ts
- Traversal
- SketchGuess.tsx
- src/rooms/doors.ts
- assetUrl
- round.ts
- floor.ts
- Core Asset Manifest
- scene/assets.ts
- pond-api.ts
- machine.ts
- personal/room.ts
- Test Fakes and Helpers
- scene.ts
- cozy.ts
- logic.ts
- room-events.ts
- schedule.ts
- domain/sketch.ts
- amplify/package.json
- atelier/room.ts
- prepare-models.mjs
- progress.ts
- core/package.json
- domain/guestboard.ts
- handlers.ts
- catalog.ts
- museum/layout.tsx
- ambience.ts
- core/src/index.ts
- Web Package Dependencies
- Gamifying Tiny Museum — genre direction & engagement research
- Item
- DecorDrawer.tsx
- risk.ts
- amplify/tsconfig.json
- 5. Customization menu — what other people are doing
- locations.ts
- wallet.ts
- Web TSConfig
- Root Package Manifest
- pond-api.ts
- lib/assets.ts
- app/page.tsx
- Base TSConfig
- Amplify Build Spec
- createAtelierRoom
- AtelierKeeps.tsx
- Placement
- import-fishing-assets.mjs
- Water.tsx
- Worker Package Manifest
- Public Asset Manifest
- walk.ts
- features/economy/index.ts
- compose-atelier.mjs
- AtelierRoom
- import-hall-assets.mjs
- ticket/route.ts
- economy/store.ts
- FishingView.tsx
- room.ts
- minimap.ts
- react
- GuestBoard.tsx
- Sound Effect Assets
- art-cache.ts
- Custom HTTP Headers
- Sharp Layer Package
- SyncStore
- wire.ts
- LandingFx
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
- pond-boards.ts
- Asset pipeline: fast loading without losing sharpness
- Guest Board SQL Schema
- Landscape Frame Asset
- ClosetView.tsx
- Bug Reports SQL Schema
- Vitals SQL Schema
- createStage
- snapshot.ts
- wardrobe.ts
- actions.ts
- Run-Once Schema
- createNpcLayer
- RevealCard.tsx
- RoomContents
- nearby.ts
- rooms/art.ts
- json
- graftCostume
- pondgame/lib/api.ts
- worker/tsconfig.json
- core/tsconfig.json
- rig.ts
- How to Design for Failures — ByteByteGo Newsletter
- Worker instructions — DSH headless agents
- Backend
- hall/room.ts
- Costume gallery doorway
- env.ts
- Fishing forest: painted asset pass
- Audio
- .claude/CLAUDE.md
- The Costume Atelier
- messages.ts
- paintings/page.tsx
- xdog.ts
- sketchguess/lib/api.ts
- presence/tsconfig.json
- next
- tsconfig.test.json
- lib/presence.ts
- MirrorView.tsx
- session.ts
- .webSocketMessage
- import-hall-assets.mjs
- Multiplayer ("other visitors") — plan v2 (Cloudflare)
- PerfMeter
- room-places.ts
- journal.ts
- player-card.ts
- DoorEditor
- hang-tag.ts
- The Moonlit Pond — design
- Pond rework
- Museum.tsx
- Orchestration contract — you plan, DSH workers execute
- tables.ts
- Tiny Museum v1 · Curator Letters
- useBackgroundMusic.ts
- ref_node_fs
- SlotDef
- layout.ts
- run.ts
- lib/slots/index.ts
- Walker
- Conn
- infra/jobs.ts
- Curating the paintings (2026-11-07)
- placements.ts
- Lobby
- outbox.test.ts
- pond-photos.ts
- getStorage
- writeLocal
- residentsAt
- icons.tsx
- wander.test.ts
- confirm/page.tsx
- Low
- Atelier: the dressing mirror, and show-don't-tell keeping
- db.ts
- performance/page.tsx
- EventTargetLike
- ref_node_assert
- AccountSheet
- visits.ts
- DoorEditor.tsx
- protocol.ts
- Your Room: a room you can freely furnish
- walk
- schedule.test.ts
- Storyline (draft, saved 2026-11-17)
- backdrop.ts
- bake-pond-path.mjs
- Local end-to-end stress test — 2026-11-06
- createPondRoom
- draw.py
- HallSkeleton.tsx
- createPixelRatioGovernor
- slots/store.ts
- scripts
- Monets Lily Pond: exploration, UX and multiplayer QA
- ref_node_assert
- roomKit
- frame-clock.test.ts
- bake-shopkeeper.mjs
- PondPanels.tsx
- ktx2-atlases.mjs
- personal/room.ts
- Medium
- atelier.ts
- npcs/README.md
- Wardrobe
- Approved v4 bunny in the hall
- Other visitors
- queryOne
- createRoomPassage
- app/layout.tsx
- AtelierActions
- createHallRoom
- Minimap
- npc-sheet.cjs
- doors.sql
- painting-open
- icon-basket
- bunny-left
- bunny-right
- icon-home
- ticket

## God Nodes (most connected - your core abstractions)
1. `react` - 94 edges
2. `useSound()` - 88 edges
3. `json()` - 81 edges
4. `PersonalRoom()` - 72 edges
5. `query()` - 72 edges
6. `hit()` - 67 edges
7. `limited()` - 61 edges
8. `FishingView()` - 52 edges
9. `three` - 49 edges
10. `next` - 48 edges

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

## Communities (222 total, 28 thin omitted)

### Community 0 - "stage.ts"
Cohesion: 0.03
Nodes (47): CharacterSprites, CameraRig, Carried, Character, Helm, Matcha, Viewport, guides() (+39 more)

### Community 1 - "Traversal"
Cohesion: 0.11
Nodes (4): clamp(), fixture(), jump(), Traversal

### Community 2 - "SketchGuess.tsx"
Cohesion: 0.08
Nodes (40): PlaceInfo, bestKeyFor(), BURST, clueUrl(), openingPlan(), Phase, pickAtRandom(), prepareSketchGame() (+32 more)

### Community 3 - "src/rooms/doors.ts"
Cohesion: 0.13
Nodes (23): addPassage(), checkDoors(), DEFAULT_DOORS, DOOR_ASPECT, DOOR_GAP, DOOR_ROOMS, DOOR_STYLES, doorName() (+15 more)

### Community 4 - "assetUrl"
Cohesion: 0.13
Nodes (23): ArtByRoom, colorAt(), decoded(), disposePondArt(), EDGE_BAND, EDGE_BANDS, EDGE_OVERLAP, edgeTexture() (+15 more)

### Community 5 - "round.ts"
Cohesion: 0.16
Nodes (26): deltaE(), GAMUT_EPSILON, hexToOklab(), inGamut(), linearRgbToOklab(), linearToSrgb(), Oklab, oklabToLinearRgb() (+18 more)

### Community 6 - "floor.ts"
Cohesion: 0.13
Nodes (34): clone(), closestOnSegment(), contains(), cross(), crossVec(), depthAtY(), depthBounds(), depthT() (+26 more)

### Community 7 - "Core Asset Manifest"
Cohesion: 0.05
Nodes (41): artworks, audio, file, megabytes, seconds, sourceName, startedAt, bunny (+33 more)

### Community 8 - "scene/assets.ts"
Cohesion: 0.06
Nodes (52): AssetManifest, assetUrl(), bitmapTexture(), blankImage(), CAFE_CAT_FRAMES, CompressedLoader, elementTexture(), ENTRANCE_FILES (+44 more)

### Community 9 - "pond-api.ts"
Cohesion: 0.08
Nodes (55): refreshWalletNow(), buyPondBait(), claimPondBounty(), errorOf(), exchangePondPearls(), fetchPondBounties(), fetchPondPhotos(), fetchPondSpecial() (+47 more)

### Community 10 - "machine.ts"
Cohesion: 0.12
Nodes (37): FishingView(), CastMeter(), ReelMeter(), armCast(), BITE_WINDOW, biteGap(), CHARGE_PERIOD, chargePower() (+29 more)

### Community 11 - "personal/room.ts"
Cohesion: 0.07
Nodes (31): createPersonalRoom(), light(), shade(), showArrangement(), signFilter(), DOOR_SIGN, gloomFor(), lightOf() (+23 more)

### Community 12 - "Test Fakes and Helpers"
Cohesion: 0.12
Nodes (26): deferredFetch(), deviceSlot, FakeEvents, FakeStorage, fixture, fixtureB, fixtureRegistry, fixtureRegistryBoth (+18 more)

### Community 13 - "scene.ts"
Cohesion: 0.04
Nodes (32): MuseumProps, disposeDisplayTexture(), HELM_PEDESTAL_FILE, prefersAvif(), HiddenCoin, createNotes(), createPedestal(), Notes (+24 more)

### Community 14 - "cozy.ts"
Cohesion: 0.06
Nodes (58): alphaCanvas(), aspectOf(), ATELIER_PROPS, AtelierImage, atticWindowCanvas(), bareBulbCanvas(), boardsCanvas(), canvasTexture() (+50 more)

### Community 15 - "logic.ts"
Cohesion: 0.07
Nodes (70): errorReason(), overDrawer(), PersonalRoom(), canPlaceNew(), carriedTo(), carryEnd(), carryMove(), finishJob() (+62 more)

### Community 16 - "room-events.ts"
Cohesion: 0.06
Nodes (56): ChatButton(), REFUSED, appendChatMessage(), CHAT_HISTORY_LIMIT, CHAT_HISTORY_WINDOW_MS, chatHistoryKey(), ChatMessage, ChatStorage (+48 more)

### Community 17 - "schedule.ts"
Cohesion: 0.08
Nodes (45): addDwellEmotes(), addEmote(), addStand(), addWalk(), buildRoomTable(), canReturn(), chooseMeeting(), chooseNext() (+37 more)

### Community 18 - "domain/sketch.ts"
Cohesion: 0.11
Nodes (25): listPieces(), pieceImageUrl(), PieceRow, toPieceDto(), EpochRow, GalleryRow, planSketchRound(), SKETCH_CHOICES (+17 more)

### Community 19 - "amplify/package.json"
Cohesion: 0.08
Nodes (26): amplifyDir, backend, everyMinutes, mediaBucket, missing, repoRoot, REQUIRED, setting() (+18 more)

### Community 20 - "atelier/room.ts"
Cohesion: 0.11
Nodes (29): AtelierPage(), dynamic, metadata, Work, useWallet(), getWalletSnapshot(), Atelier(), leave() (+21 more)

### Community 21 - "prepare-models.mjs"
Cohesion: 0.09
Nodes (28): paintedCostume(), BODIES, bruce, BRUCE_FIT, BRUCE_PLACE, bunny, CARDIGAN, closedWaist() (+20 more)

### Community 22 - "progress.ts"
Cohesion: 0.09
Nodes (51): latestLetter(), LetterMailbox(), open(), openNext(), LetterMailboxProps, QuestLine(), SERVER_PROGRESS, openCuratorLetter() (+43 more)

### Community 23 - "core/package.json"
Cohesion: 0.06
Nodes (40): dependencies, @aws-sdk/client-s3@^3.1121.0, @aws-sdk/s3-request-presigner@^3.1121.0, bcryptjs@^2.4.3, obscenity@^0.4.6, pg@^8.13.1, sharp@^0.33.5, thumbhash@^0.1.1 (+32 more)

### Community 24 - "domain/guestboard.ts"
Cohesion: 0.10
Nodes (33): POST(), ALLOWED, PER_VISITOR, POST(), POST(), POST(), POST(), GET() (+25 more)

### Community 25 - "handlers.ts"
Cohesion: 0.10
Nodes (32): confirmedFollowers(), handleDerivatives(), handleNotifyFollowers(), handleRenderDisplay(), handleSealEpoch(), renderPieceFrame(), renderPieceSketch(), runJob() (+24 more)

### Community 26 - "catalog.ts"
Cohesion: 0.19
Nodes (17): cleanNow(), CatalogItem, CatalogKind, FREE_CHARACTERS, ITEMS, ItemSlot, expected, slots (+9 more)

### Community 27 - "museum/layout.tsx"
Cohesion: 0.36
Nodes (6): MuseumLayout(), WalletProvider(), setMuseumDoors(), MuseumDoors(), MuseumStage(), publishedDoors()

### Community 28 - "ambience.ts"
Cohesion: 0.12
Nodes (29): blade(), bloom(), BLOOMS, createPondAmbience(), update(), fishTexture(), frond(), FRONT_ROWS (+21 more)

### Community 29 - "core/src/index.ts"
Cohesion: 0.04
Nodes (139): GET(), CatchExtra, COLUMNS, insertCatch(), member(), namedMember(), randomId(), StatePatch (+131 more)

### Community 30 - "Web Package Dependencies"
Cohesion: 0.07
Nodes (35): dependencies, embla-carousel-react@^8.6.0, motion@^13.1.1, next@^15.0.3, react@^19.0.0, react-dom@^19.0.0, swr@^2.5.1, three@^0.169.0 (+27 more)

### Community 31 - "Gamifying Tiny Museum — genre direction & engagement research"
Cohesion: 0.10
Nodes (19): 0.1 The core experience, 0.2 Systems that make gamification cheap to build, 0.3 Constraints that shape any recommendation, 0. What the game is today (the deep dive), 1.1 The landscape (seven candidates, with verdicts), 1.2 Recommendation: a **cozy gallery life-sim** — "the gallery you live in", 1.3 The five design pillars the genre implies, 1. Genre direction (+11 more)

### Community 32 - "Item"
Cohesion: 0.14
Nodes (3): Room, Presence, Item

### Community 33 - "DecorDrawer.tsx"
Cohesion: 0.13
Nodes (18): DecorDrawer, DecorDrawerProps, SLOT_LABELS, Tab, TABS, categoryOf(), DrawerCategory, FINISH_SLOTS (+10 more)

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
Nodes (47): member(), now, piece(), randomId(), today, baitOf(), applyClaim(), baitCounts() (+39 more)

### Community 39 - "Web TSConfig"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 40 - "Root Package Manifest"
Cohesion: 0.12
Nodes (20): description, devDependencies, concurrently@^9.1.0, esbuild@^0.24.0, ktx2-encoder@^0.6.0, maxrects-packer@^2.7.3, playwright@^1.63.0, @types/node@^22.9.0 (+12 more)

### Community 41 - "pond-api.ts"
Cohesion: 0.08
Nodes (49): POND_NET_COST, fetchPondFeed(), fetchPondLeaderboard(), PondFeedItem, catchLabel(), EXCHANGE_DAILY_STAMPS, EXCHANGE_PEARLS_PER_STAMP, fishArt() (+41 more)

### Community 42 - "lib/assets.ts"
Cohesion: 0.07
Nodes (45): roomWork(), createDoorGuides(), HallGuide, PROJECTED, AtelierImage, PICTURE, BY_ID, castMember() (+37 more)

### Community 43 - "app/page.tsx"
Cohesion: 0.19
Nodes (14): dynamic, Hall(), MuseumPage(), [BRAND_OWNER, ...BRAND_REST], CurrentlyShowing(), Decor(), dynamic, LandingPage() (+6 more)

### Community 44 - "Base TSConfig"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, lib, module, moduleResolution (+9 more)

### Community 45 - "Amplify Build Spec"
Cohesion: 0.12
Nodes (16): applications, appRoot, backend, frontend, baseDirectory, files, phases, commands (+8 more)

### Community 46 - "createAtelierRoom"
Cohesion: 0.44
Nodes (15): aspectOf(), createAtelierRoom(), buildCollection(), form(), buildEntrance(), buildMirror(), buildRoom(), buildWardrobe() (+7 more)

### Community 47 - "AtelierKeeps.tsx"
Cohesion: 0.14
Nodes (20): CoinToast(), Toast, Purse(), Stamp(), STAMP_ASPECT, STAMP_SVG, STAMP_URL, stampLabel() (+12 more)

### Community 48 - "Placement"
Cohesion: 0.09
Nodes (7): Carry, PersonalRoomProps, GhostOptions, PlacementLayer, PlacementTheme, The closet: where every room starts (2026-11-17), Placement

### Community 49 - "import-fishing-assets.mjs"
Cohesion: 0.10
Nodes (12): CANVAS, clear, FONT, FRAME, heights, layout, lossless, manifest (+4 more)

### Community 50 - "Water.tsx"
Cohesion: 0.07
Nodes (48): AmbientShadow, box(), BUCKET, BUCKET_SPOTS, bunnyBox(), easeOut(), Glint, LEFT_STYLE (+40 more)

### Community 51 - "Worker Package Manifest"
Cohesion: 0.14
Nodes (14): dependencies, @tiny/core@*, exports, ./lambda, @tiny/core, main, name, private (+6 more)

### Community 52 - "Public Asset Manifest"
Cohesion: 0.12
Nodes (15): artworks, bunny, size, floor, size, fonts, icon-no-photos, size (+7 more)

### Community 53 - "walk.ts"
Cohesion: 0.09
Nodes (35): FrameShape, water, depthAtLift(), FAR_LIFT, FAR_SCALE, liftAt(), pathHalfWidth(), pathX() (+27 more)

### Community 54 - "features/economy/index.ts"
Cohesion: 0.12
Nodes (28): serverSnapshot, useEarnEvents(), CARRY_CAP, carryAdd(), CarryEntry, carryPrune(), carryRemove(), chunk() (+20 more)

### Community 55 - "compose-atelier.mjs"
Cohesion: 0.12
Nodes (10): body, dressLayer, dressWidth, floralWidth, hanger, MANNEQUIN_CANVAS, mask, root (+2 more)

### Community 56 - "AtelierRoom"
Cohesion: 0.07
Nodes (8): AtelierRoom, Options, bow, cardigan, dress, SlotHandle, isTopPiece(), outfit

### Community 57 - "import-hall-assets.mjs"
Cohesion: 0.09
Nodes (18): target, file(), DOOR, DOOR_BACKDROP, drop, FURNITURE, manifest, manifestPath (+10 more)

### Community 58 - "ticket/route.ts"
Cohesion: 0.08
Nodes (50): GET(), GET(), PER_IP, POST(), presenceUrl(), Code, 3.2 Chosen names (members), registry (+42 more)

### Community 59 - "economy/store.ts"
Cohesion: 0.11
Nodes (41): outboxDue(), buy(), cappedTracked, earn(), emit(), emitEarned(), EMPTY_BAIT, EMPTY_TODAY (+33 more)

### Community 60 - "FishingView.tsx"
Cohesion: 0.11
Nodes (24): CAST_ERRORS, coarsePointer(), initialEasyReel(), isTyping(), LOST, PondGameProps, Toast, vibrate() (+16 more)

### Community 61 - "room.ts"
Cohesion: 0.13
Nodes (29): socket(), admitted(), Attachment, farewell(), GHOST_MS, HELLO_TIMEOUT_MS, holdsOf(), homeOf() (+21 more)

### Community 62 - "minimap.ts"
Cohesion: 0.08
Nodes (34): place(), createMinimap(), draw(), drawRoom(), floors(), follow(), sketchOf(), doorPoint() (+26 more)

### Community 63 - "react"
Cohesion: 0.05
Nodes (62): BugReportHost(), BugReportSheet, BugReportSheet(), Status, collectContext(), inAppBrowser(), onOpenBugReport(), openBugReport() (+54 more)

### Community 64 - "GuestBoard.tsx"
Cohesion: 0.07
Nodes (48): GET(), BoardScreen(), BoardScreenProps, ComposeScreen(), ComposeScreenProps, blankDraft(), GuestBoard(), GuestBoardProps (+40 more)

### Community 65 - "Sound Effect Assets"
Cohesion: 0.22
Nodes (9): file, kilobytes, seconds, file, kilobytes, seconds, soundEffects, click (+1 more)

### Community 66 - "art-cache.ts"
Cohesion: 0.13
Nodes (10): ArtCache, ArtCacheOptions, createArtCache(), drop(), expireLater(), hold(), HeldArt, LoadResult (+2 more)

### Community 67 - "Custom HTTP Headers"
Cohesion: 0.25
Nodes (7): applications, appRoot, customHeaders, headers, pattern, key, value

### Community 68 - "Sharp Layer Package"
Cohesion: 0.33
Nodes (6): dependencies, sharp@^0.33.5, description, sharp, name, private

### Community 69 - "SyncStore"
Cohesion: 0.18
Nodes (3): parseStored(), SyncStore, upgrade()

### Community 70 - "wire.ts"
Cohesion: 0.09
Nodes (12): Entry, INTERPOLATION_DELAY_MS, PEER_TIMEOUT_MS, PeerTable, positionAt(), RemoteVisitor, Sample, look (+4 more)

### Community 71 - "LandingFx"
Cohesion: 0.22
Nodes (10): glowSprite(), LandingFx(), onClick(), onVisibility(), psst(), spawnMist(), tick(), Mist (+2 more)

### Community 72 - "Confirmed issues"
Cohesion: 0.11
Nodes (18): Confirmed issues, E2E-002 — Valid edge placement rejected through floating-point precision, E2E-003 — One owned prop can be placed multiple times, E2E-004 — Reload before autosave silently loses the latest placement, E2E-005 — Failed save and failed Done have no visible mobile explanation, E2E-006 — Restoring connectivity does not retry a failed draft save, E2E-007 — Keyboard activation cannot place drawer items, E2E-008 — Creating an account from My Room leaves the signed-in user on the sign-in prompt (+10 more)

### Community 73 - "epoch.ts"
Cohesion: 0.20
Nodes (16): GET(), intParam(), GET(), sketchPool, unavailable(), DoorsPage(), dynamic, hallPaintings() (+8 more)

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
Cohesion: 0.18
Nodes (8): CAT, drop, EXPECTED, manifest, manifestPath, masters, root, target

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

### Community 85 - "pond-boards.ts"
Cohesion: 0.11
Nodes (29): BOARDS, GET(), oneOf(), PER_VISITOR, PERIODS, compare(), DexRow, displayName() (+21 more)

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
Cohesion: 0.12
Nodes (29): ClosetView(), close(), onKeyDown(), shuffle(), tapMiddle(), wearAt(), LISTS, PLACE (+21 more)

### Community 93 - "createStage"
Cohesion: 0.12
Nodes (27): boundedCameraX(), FLICK, flickDirection(), isUpwardFlick(), createNearby(), createStage(), closeEntry(), enter() (+19 more)

### Community 94 - "snapshot.ts"
Cohesion: 0.23
Nodes (15): snap(), composeJpeg(), copyCanvas(), grabLayers(), Layer, loadImage(), paint(), px() (+7 more)

### Community 95 - "wardrobe.ts"
Cohesion: 0.17
Nodes (17): allowedCharacter(), OwnedSnapshot, owns(), walletReady(), keepStamps(), StampState, kiki, otter (+9 more)

### Community 96 - "actions.ts"
Cohesion: 0.07
Nodes (65): AnalyticsPage(), dynamic, BugReportsPage(), dateFormat, dynamic, summary(), dateFormat, dynamic (+57 more)

### Community 104 - "createNpcLayer"
Cohesion: 0.19
Nodes (19): createNpcLayer(), createResidentView(), createView(), departedRecently(), draw(), fadeOut(), glyphWidth(), hideAll() (+11 more)

### Community 105 - "RevealCard.tsx"
Cohesion: 0.11
Nodes (19): CONFETTI_COLORS, ConfettiPiece, makeConfetti(), RevealCard(), RevealCardProps, TIER_MS, useCountUp(), CatchView (+11 more)

### Community 106 - "RoomContents"
Cohesion: 0.08
Nodes (15): Pose, RoomContents, Decisions (2026-11-05), Follow-ups after Phases 4–7, Model (`apps/web/src/features/rooms/types.ts`), Personal room polish (2026-11-05), Phase 1: stage + atelier, Phase 2: hall on the stage (+7 more)

### Community 107 - "nearby.ts"
Cohesion: 0.18
Nodes (5): Nearby, NearbyReach, RoomSpan, reach, strip

### Community 108 - "rooms/art.ts"
Cohesion: 0.24
Nodes (8): AtelierArt, disposeAtelierArt(), AtelierArtwork, PersonalArt, ROOM_ART, RoomArt, DoorArt, CozyArt

### Community 109 - "json"
Cohesion: 0.05
Nodes (104): POST(), PER_MEMBER, PUT(), POST(), GET(), GLOBAL, PER_IP, POST() (+96 more)

### Community 110 - "graftCostume"
Cohesion: 0.27
Nodes (14): canvasFit(), compose(), graftCostume(), copyAccessor(), copyMaterial(), copyMesh(), copyTexture(), copyView() (+6 more)

### Community 111 - "pondgame/lib/api.ts"
Cohesion: 0.26
Nodes (19): buyPondBait(), buyPondNet(), castPond(), chainPondBait(), errorOf(), fetchPondState(), isRecord(), memberId() (+11 more)

### Community 112 - "worker/tsconfig.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 113 - "core/tsconfig.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 114 - "rig.ts"
Cohesion: 0.04
Nodes (92): CrowdPreviewPage(), RigPreviewPage(), CrowdPreview(), draw(), KINDS, Stats, Window, NEXT (+84 more)

### Community 115 - "How to Design for Failures — ByteByteGo Newsletter"
Cohesion: 0.40
Nodes (4): How to Design for Failures — ByteByteGo Newsletter, Preview, What the article covers, Where the paywall starts

### Community 116 - "Worker instructions — DSH headless agents"
Cohesion: 0.40
Nodes (4): graphify-first codebase navigation, Keep the graph current, Product and design direction, Worker instructions — DSH headless agents

### Community 117 - "Backend"
Cohesion: 0.50
Nodes (3): AWS prerequisites, Backend, Deploying by hand

### Community 118 - "hall/room.ts"
Cohesion: 0.05
Nodes (60): Assets, Scenery, CUTS, disposeBoards(), Mark, plane(), ROPE_CUTS, ropeSlices() (+52 more)

### Community 119 - "Costume gallery doorway"
Cohesion: 0.50
Nodes (3): Costume gallery doorway, Curtain colour edit, Prompt

### Community 120 - "env.ts"
Cohesion: 0.27
Nodes (7): SCHEMA_DIR, isProduction(), presenceSecret(), repoRoot, required(), sessionSecret(), setting()

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
Cohesion: 0.31
Nodes (6): checkMessage(), INVISIBLE, MESSAGE_MAX, MessageCheck, normalizeMessage(), hasProfanity()

### Community 126 - "paintings/page.tsx"
Cohesion: 0.12
Nodes (21): dynamic, PaintingsPage(), createCodeAction(), deleteCodeAction(), CodeRow, CodesSection(), create(), remove() (+13 more)

### Community 127 - "xdog.ts"
Cohesion: 0.39
Nodes (5): blur(), kernel(), XDOG_DEFAULTS, xdogInk(), XdogOptions

### Community 128 - "sketchguess/lib/api.ts"
Cohesion: 0.15
Nodes (16): sameOriginUrl(), PreparedGame, decodeImage(), fetchBitmap(), fetchRound(), guarded(), InkMap, LoadedRound (+8 more)

### Community 129 - "presence/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, types, exclude, extends, include, ../../tsconfig.base.json

### Community 130 - "next"
Cohesion: 0.10
Nodes (18): config, SECURITY_HEADERS, StudioLayout(), amount(), duration(), dynamic, LANDMARKS, PAGES (+10 more)

### Community 131 - "tsconfig.test.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 132 - "lib/presence.ts"
Cohesion: 0.09
Nodes (20): Outcome, Connect, fetchTicket, HEARTBEAT_MS, HIDDEN_LIMIT_MS, RETRY_MS, sameLook(), samePose() (+12 more)

### Community 133 - "MirrorView.tsx"
Cohesion: 0.15
Nodes (15): Wheel(), onPointerUp(), trapTab(), MIRROR_SRC, MirrorView(), close(), move(), onKeyDown() (+7 more)

### Community 134 - "session.ts"
Cohesion: 0.17
Nodes (16): GET(), PaintingRow, GET(), POST(), UPLOADS_PER_ARTIST, POST(), UPLOADS_PER_ARTIST, dynamic (+8 more)

### Community 135 - ".webSocketMessage"
Cohesion: 0.28
Nodes (6): fetch(), attachmentOf(), Env, Room, sendTo(), parseRoom()

### Community 136 - "import-hall-assets.mjs"
Cohesion: 0.13
Nodes (11): BASEBOARD, CURTAIN, drop, EXPECTED, manifest, manifestPath, masters, root (+3 more)

### Community 137 - "Multiplayer ("other visitors") — plan v2 (Cloudflare)"
Cohesion: 0.10
Nodes (19): 0. Summary, 10. Decisions, 1. Product contract changes (approved 2026-10-31), 2. What already exists that this builds on, 3.1 Generated names (everyone has one), 3. Names, 4. Transport: Cloudflare Durable Objects, 5.1 Emotes (v1) (+11 more)

### Community 139 - "room-places.ts"
Cohesion: 0.14
Nodes (20): HallLayout, NpcGround, PlaceKind, atelierRoomInfo(), atelierX(), copy(), FurniturePlacement, hallCache (+12 more)

### Community 140 - "journal.ts"
Cohesion: 0.09
Nodes (24): PondMusic(), SONG, POND_SIGN_NAME, catchArt(), gradeLabel(), JOURNAL_FAMILIES, JOURNAL_GRADES, JOURNAL_SIZE (+16 more)

### Community 141 - "player-card.ts"
Cohesion: 0.09
Nodes (16): createPlayerCard(), hide(), onPointerDown(), Door, doorOf(), PlayerCard, wallpaperOf(), cozyLevel (+8 more)

### Community 142 - "DoorEditor"
Cohesion: 0.20
Nodes (17): DoorEditor(), add(), apply(), commitSlide(), nudge(), pick(), pointerDown(), pointerUp() (+9 more)

### Community 143 - "hang-tag.ts"
Cohesion: 0.14
Nodes (7): CARD, createHangTag(), HangTag, HangTagStyle, HOLE, KNOT, What goes, and what replaces it

### Community 144 - "The Moonlit Pond — design"
Cohesion: 0.09
Nodes (22): Art the pond needs from the artist, Build contract (decided 2026-11-07), Build phases, Collection and goals, Done, Done, Guardrails, Leaderboards (+14 more)

### Community 145 - "Pond rework"
Cohesion: 0.18
Nodes (10): Baits, Client, Decisions, Done, Notes, Pond rework, Server, Species (+2 more)

### Community 146 - "Museum.tsx"
Cohesion: 0.06
Nodes (56): Loading(), BACKDROP_STYLE, MoreArrow(), NavArrow(), Props, SLIDE, Walkthrough(), XIcon() (+48 more)

### Community 147 - "Orchestration contract — you plan, DSH workers execute"
Cohesion: 0.29
Nodes (6): Briefing a worker, Budget hygiene, graphify, Orchestration contract — you plan, DSH workers execute, The worker, When not to delegate

### Community 148 - "tables.ts"
Cohesion: 0.11
Nodes (32): PondCatch, debugSpecies(), debugTokens(), debugVariant(), GuestRoll, guestTreasure(), rollGuest(), BAIT_BY_ID (+24 more)

### Community 149 - "Tiny Museum v1 · Curator Letters"
Cohesion: 0.17
Nodes (11): Letter 0 · Clean up your room, Letter 1 · Place your first decoration, Letter 2 · Visit the first gallery, Letter 3 · Play a mini-game, Letter 4 · Unlock an outfit or character, Letter 5 · Find the seasonal items, Letter 6 · Unlock the daily calendar, Letter 7 · The cliffhanger and email signup (+3 more)

### Community 150 - "useBackgroundMusic.ts"
Cohesion: 0.11
Nodes (27): BackgroundMusic, clampVolume(), isDocumentHidden(), Options, useBackgroundMusic(), VISIBILITY_EVENTS, EFFECTS, EffectSpec (+19 more)

### Community 151 - "ref_node_fs"
Cohesion: 0.12
Nodes (9): btn, t0, acct, [out, ...steps], acct, signInTab, sizes, [, width, height] (+1 more)

### Community 153 - "layout.ts"
Cohesion: 0.13
Nodes (14): cafeAfterIndex(), computeLayout(), clear(), placeCafe(), cutRooms(), DoorSpan, HALL_DOOR_FOOT, HallRoomKind (+6 more)

### Community 154 - "run.ts"
Cohesion: 0.20
Nodes (7): admin, childEnv, client, database, fresh, migrations, target

### Community 155 - "lib/slots/index.ts"
Cohesion: 0.09
Nodes (20): PresencePreviewPage(), NAME_ERRORS, Pending, View, KeepOnOtherDevices(), PresencePreview(), Props, WalkAlone() (+12 more)

### Community 156 - "Walker"
Cohesion: 0.19
Nodes (3): FloorPoint, WalkArea, Walker

### Community 157 - "Conn"
Cohesion: 0.27
Nodes (5): send(), connectWebSocket(), SocketHandlers, Conn, message()

### Community 158 - "infra/jobs.ts"
Cohesion: 0.11
Nodes (31): loop(), shutdown(), sleep(), sweepStale(), DrainResult, handler(), repairFrames(), clearCatches() (+23 more)

### Community 159 - "Curating the paintings (2026-11-07)"
Cohesion: 0.12
Nodes (15): hang(), 1. The registry and the table, 2. The studio's Location picker, 3. The rooms draw what is placed, 4. Credits, 5. Retiring self-serve artists, Building it, Curating the paintings (2026-11-07) (+7 more)

### Community 160 - "placements.ts"
Cohesion: 0.05
Nodes (54): Catalogue, Data model (core), 1. Items placed against a zone edge fail to save, and the whole draft reverts, 2. One owned item can be placed many times, 3. Any save rejection throws away all unsaved work, 4. Changes made just before leaving are lost, 5. Fish trophies can be claimed without playing, High (+46 more)

### Community 162 - "outbox.test.ts"
Cohesion: 0.29
Nodes (10): OUTBOX_CAP, outboxAdd(), OutboxEntry, outboxFail(), outboxRemove(), RETRY_BASE_MS, RETRY_MAX_MS, retryDelay() (+2 more)

### Community 163 - "pond-photos.ts"
Cohesion: 0.21
Nodes (11): snapshot(), Checked against the mocks (2026-11-07), addPondPhoto(), AddPondPhotoResult, deletePondPhoto(), isJpeg(), listPondPhotos(), POND_PHOTO_LIMIT (+3 more)

### Community 164 - "getStorage"
Cohesion: 0.09
Nodes (18): CONTENT_TYPES, GET(), PUT(), ACCEPTED, createAssetFromUpload(), MAX_UPLOAD_BYTES, presignUpload(), registerUpload() (+10 more)

### Community 165 - "writeLocal"
Cohesion: 0.36
Nodes (9): undoAdminUnlock(), unlockEverything(), AdminTools(), restartInCloset(), turnOff(), turnOn(), unlock(), startOverInCloset() (+1 more)

### Community 166 - "residentsAt"
Cohesion: 0.27
Nodes (11): addGap(), along(), buildStayPlan(), clamp(), doorX(), posMod(), residentsAt(), roomAtBlock() (+3 more)

### Community 167 - "icons.tsx"
Cohesion: 0.24
Nodes (9): BaitTray(), BaitTrayProps, GuestRollOptions, BAIT, BaitId, GLYPHS, PearlIcon(), POND_CRIMSON (+1 more)

### Community 168 - "wander.test.ts"
Cohesion: 0.16
Nodes (11): Job, Place, WalkState, BASE_JOB, context(), L_GROUND, mulberry32(), room() (+3 more)

### Community 169 - "confirm/page.tsx"
Cohesion: 0.33
Nodes (7): ConfirmFollow(), dynamic, dynamic, Unsubscribe(), FollowNotice(), confirmFollow(), unsubscribe()

### Community 170 - "Low"
Cohesion: 0.15
Nodes (13): 13. Pages that redirect or don't exist answer 200, 14. Error codes reveal which room slugs exist, 15. The name sign slides under the top-right buttons in Decorate, 16. Level-up celebrations can be farmed, 17. No hint of where things are after panning away, 18. Too many items is only discovered by the server, 19. Development-only: page payloads include the full room row, Checked and fine (+5 more)

### Community 171 - "Atelier: the dressing mirror, and show-don't-tell keeping"
Cohesion: 0.13
Nodes (14): Atelier: the dressing mirror, and show-don't-tell keeping, Build order, Built (2026-11-20), Decisions (2026-11-19), Follow-ups (2026-11-20), Goal, In the room, Keeping (+6 more)

### Community 172 - "db.ts"
Cohesion: 0.11
Nodes (20): BugContext, BugReport, BugReportDto, BugReportRejected, BugRow, CONTEXT_KEYS, EVERYONE, normalizeBugPage() (+12 more)

### Community 173 - "performance/page.tsx"
Cohesion: 0.27
Nodes (9): dynamic, format(), grade(), METRICS, PAGES, PerformancePage(), RANGES, summarizeVitals() (+1 more)

### Community 175 - "ref_node_assert"
Cohesion: 0.11
Nodes (29): defineSlot(), docBytes(), SLOTS, byAtThenKey(), encoded(), latest, mapOf(), maxNumber() (+21 more)

### Community 176 - "AccountSheet"
Cohesion: 0.29
Nodes (9): AccountSheet(), continueAnyway(), doSignOut(), runDelete(), runName(), submit(), submitDelete(), submitName() (+1 more)

### Community 177 - "visits.ts"
Cohesion: 0.10
Nodes (27): state(), VisitTracker(), flush(), startVisit(), visibleMs(), VisitState, count(), currentSalts() (+19 more)

### Community 178 - "DoorEditor.tsx"
Cohesion: 0.24
Nodes (9): hallDoorSpan(), CAST, ENTRANCE, guideX(), PIXELS, REASONS, doorWidth(), MAX_DOOR_SCALE (+1 more)

### Community 179 - "protocol.ts"
Cohesion: 0.12
Nodes (29): isHome(), isItem(), isName(), isPid(), isSeq(), MAX_HOLDS, MAX_MESSAGE_BYTES, parseClientMessage() (+21 more)

### Community 180 - "Your Room: a room you can freely furnish"
Cohesion: 0.20
Nodes (9): Admin mode (gamma), Decisions (2026-11-17, with the user), Editor (web, `features/rooms/decorate/*`, `PersonalRoom.tsx`), Room look (web, `features/rooms/themes/cozy.ts`, `features/rooms/personal/room.ts`), Scale, Testing locally, What other games do (research, 2026-11-17), Work plan (+1 more)

### Community 181 - "walk"
Cohesion: 0.18
Nodes (14): between(), CAT, Edge, EDGES, runLandingCat(), choosePeeker(), peek(), walk() (+6 more)

### Community 182 - "schedule.test.ts"
Cohesion: 0.08
Nodes (22): RESIDENT_IDS, FloorSpot, ROOM_KINDS, ROOMS, NpcRoom, Phase, ResidentState, ROOM_DOORS (+14 more)

### Community 183 - "Storyline (draft, saved 2026-11-17)"
Cohesion: 0.15
Nodes (12): Arc (soft, no fail state), Built so far, How it ties to what exists, Locked (2026-11-21, the owner), Next tasks (when picked up), Open questions, Premise, Revision (2026-11-21, the owner) (+4 more)

### Community 184 - "backdrop.ts"
Cohesion: 0.15
Nodes (13): createHallAmbience(), finish(), glowTexture(), HallAmbience, mulberry(), painted(), vignetteTexture(), Backdrop (+5 more)

### Community 185 - "bake-pond-path.mjs"
Cohesion: 0.21
Nodes (7): blank(), manifest, manifestPath, ORIGINAL_SOURCE, originalPath(), root, softened()

### Community 186 - "Local end-to-end stress test — 2026-11-06"
Cohesion: 0.22
Nodes (7): Environment and coverage, Follow-up coverage, Issue index, Local end-to-end stress test — 2026-11-06, Measured load, Passing checks and interpretation limits, Test data and cleanup

### Community 187 - "createPondRoom"
Cohesion: 0.32
Nodes (13): createPondRoom(), approach(), busy(), finishWalk(), goTo(), leave(), move(), nearest() (+5 more)

### Community 189 - "HallSkeleton.tsx"
Cohesion: 0.39
Nodes (6): Loading(), DENSITY_MEDIA, HallPreload(), HallSkeleton(), ktx2TranscoderPath(), LARGE_ASSET_MEDIA

### Community 190 - "createPixelRatioGovernor"
Cohesion: 0.33
Nodes (7): createPixelRatioGovernor(), reset(), stepTo(), PIXEL_RATIO_STEPS, pixelRatioSteps(), Renderer, governor()

### Community 191 - "slots/store.ts"
Cohesion: 0.13
Nodes (19): ANON_PREFIX, anonKey(), deviceKey(), encodeStored(), isMemberSlotKey(), listKeys(), MEMBER_KEY, memberKey() (+11 more)

### Community 192 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, db:schema, deploy:backend, dev, dev:presence, dev:web, dev:worker (+6 more)

### Community 193 - "Monets Lily Pond: exploration, UX and multiplayer QA"
Cohesion: 0.29
Nodes (6): Browser and interaction coverage, Changes made from the walkthrough, Monets Lily Pond: exploration, UX and multiplayer QA, Multiplayer and load, Practical limits, Regression checks and cleanup

### Community 194 - "ref_node_assert"
Cohesion: 0.22
Nodes (7): shape(), garlandRibbon(), at(), GarlandShape, Ribbon, sag(), shape

### Community 195 - "roomKit"
Cohesion: 0.25
Nodes (4): roomKit(), refresh(), isCardigan(), itemName()

### Community 196 - "frame-clock.test.ts"
Cohesion: 0.36
Nodes (6): MAX_CATCH_UP_SECONDS, MAX_STEP_SECONDS, movementSteps(), RESTING_TICK_MS, shouldTick(), walker()

### Community 197 - "bake-shopkeeper.mjs"
Cohesion: 0.25
Nodes (5): bodyTextures, COATS, { json, bin }, manifest, maps

### Community 198 - "PondPanels.tsx"
Cohesion: 0.11
Nodes (21): Loading(), metadata, PondPage(), POND_NAME, PondLoading(), BOARD_TABS, PondOverlayKind, PondPanels() (+13 more)

### Community 200 - "personal/room.ts"
Cohesion: 0.08
Nodes (4): Job, DecorController, HighlightArea, WorkKind

### Community 201 - "Medium"
Cohesion: 0.25
Nodes (8): 10. Long names run off the name sign, 11. The rooms API skips the stale-tab member check, 12. The bunny is dragged along while you pan in Decorate, 6. Failed saves are nearly invisible, and nothing retries, 7. Two tabs editing the same room overwrite each other, 8. The drawer's card row can't be scrolled on touch screens, 9. Decorating can't be done with the keyboard, Medium

### Community 202 - "atelier.ts"
Cohesion: 0.05
Nodes (39): AtelierDoor, AtelierImage, BuiltRoom, Cardigan, CARDIGAN_NAMES, Control, hungWork(), ArtistCredit (+31 more)

### Community 205 - "Approved v4 bunny in the hall"
Cohesion: 0.29
Nodes (5): Approved v4 bunny in the hall, Assets, Existing interactions and fallback, Local review and checks, Rendering and movement

### Community 206 - "Other visitors"
Cohesion: 0.29
Nodes (6): How it plays, Other visitors, Privacy, Running it in production, Running it locally, Staying consistent

### Community 207 - "queryOne"
Cohesion: 0.10
Nodes (23): ArtistPage(), dynamic, generateMetadata(), GET(), GET(), FollowForm(), getArtistPage(), AnalyticsSummary (+15 more)

### Community 208 - "createRoomPassage"
Cohesion: 0.60
Nodes (3): coverFloorTransition(), createRoomPassage(), fixture()

### Community 209 - "app/layout.tsx"
Cohesion: 0.07
Nodes (31): bethEllen, inspiratiq, metadata, notoSans, RootLayout(), sniglet, viewport, AccountHost() (+23 more)

### Community 211 - "createHallRoom"
Cohesion: 0.07
Nodes (28): createDoorPetals(), DoorPetals, mulberry(), Petal, petalTexture(), PondDoor, createSitting(), hop() (+20 more)

### Community 216 - "npc-sheet.cjs"
Cohesion: 0.31
Nodes (8): CFG, closeEye(), eraseMouth(), inpaint(), sample(), sharp, [src, out, cfgPath], warp()

### Community 225 - "painting-open"
Cohesion: 0.50
Nodes (4): file, kilobytes, seconds, painting-open

### Community 230 - "icon-basket"
Cohesion: 0.67
Nodes (3): icon-basket, file, vector

## Knowledge Gaps
- **5 isolated node(s):** `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1743 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **28 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `stage.ts`, `SketchGuess.tsx`, `MirrorView.tsx`, `pond-api.ts`, `journal.ts`, `Test Fakes and Helpers`, `logic.ts`, `room-events.ts`, `Museum.tsx`, `atelier/room.ts`, `progress.ts`, `useBackgroundMusic.ts`, `museum/layout.tsx`, `lib/slots/index.ts`, `Web Package Dependencies`, `DecorDrawer.tsx`, `risk.ts`, `writeLocal`, `icons.tsx`, `pond-api.ts`, `app/page.tsx`, `AtelierKeeps.tsx`, `visits.ts`, `Water.tsx`, `DoorEditor.tsx`, `features/economy/index.ts`, `FishingView.tsx`, `GuestBoard.tsx`, `PondPanels.tsx`, `LandingFx`, `app/layout.tsx`, `ClosetView.tsx`, `actions.ts`, `RevealCard.tsx`, `rig.ts`, `paintings/page.tsx`?**
  _High betweenness centrality (0.083) - this node is a cross-community bridge._
- **What connects `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json` to the rest of the system?**
  _5 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `stage.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.030707070707070707 - nodes in this community are weakly interconnected._
- **Why does `useSound()` connect `react` to `stage.ts`, `SketchGuess.tsx`, `MirrorView.tsx`, `pond-api.ts`, `machine.ts`, `journal.ts`, `logic.ts`, `room-events.ts`, `Museum.tsx`, `atelier/room.ts`, `progress.ts`, `lib/slots/index.ts`, `museum/layout.tsx`, `DecorDrawer.tsx`, `risk.ts`, `icons.tsx`, `pond-api.ts`, `AtelierKeeps.tsx`, `AccountSheet`, `FishingView.tsx`, `GuestBoard.tsx`, `PondPanels.tsx`, `LandingFx`, `queryOne`, `app/layout.tsx`, `ClosetView.tsx`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Should `Traversal` be split into smaller, more focused modules?**
  _Cohesion score 0.10685483870967742 - nodes in this community are weakly interconnected._
- **Why does `three` connect `hall/room.ts` to `stage.ts`, `assetUrl`, `scene/assets.ts`, `atelier.ts`, `lib/assets.ts`, `rooms/art.ts`, `scene.ts`, `cozy.ts`, `hang-tag.ts`, `room-events.ts`, `rig.ts`, `createHallRoom`, `atelier/room.ts`, `walk.ts`, `prepare-models.mjs`, `backdrop.ts`, `ambience.ts`, `Web Package Dependencies`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Should `SketchGuess.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07908163265306123 - nodes in this community are weakly interconnected._