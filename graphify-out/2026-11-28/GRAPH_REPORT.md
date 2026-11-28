# Graph Report - tiny-museum  (2026-11-28)

## Corpus Check
- 611 files · ~376,585 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 118 file(s) not represented in the graph (top: .avif 60, .glb 46, .css 7)

## Summary
- 5456 nodes · 14459 edges · 222 communities (197 shown, 25 thin omitted)
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
- DoorEditor.tsx
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
- three
- amplify/package.json
- AtelierHooks
- prepare-models.mjs
- progress.ts
- core/package.json
- domain/guestboard.ts
- handlers.ts
- member-route.ts
- createPersonalRoom
- ambience.ts
- core/src/index.ts
- Web Package Dependencies
- Gamifying Tiny Museum — genre direction & engagement research
- rig.ts
- DecorDrawer.tsx
- risk.ts
- amplify/tsconfig.json
- 5. Customization menu — what other people are doing
- rooms.ts
- wallet.ts
- Web TSConfig
- Root Package Manifest
- pond-api.ts
- npc-layer.ts
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
- useSound
- domain/guestboard.ts
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
- wallet/body.ts
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
- lib/assets.ts
- RevealCard.tsx
- rules.ts
- nearby.ts
- GuestBoard.tsx
- json
- graftCostume
- createRemoteVisitors
- worker/tsconfig.json
- core/tsconfig.json
- RigPreview.tsx
- How to Design for Failures — ByteByteGo Newsletter
- Worker instructions — DSH headless agents
- Backend
- lobby.ts
- Costume gallery doorway
- env.ts
- Fishing forest: painted asset pass
- Audio
- .claude/CLAUDE.md
- The Costume Atelier
- messages.ts
- Angler.tsx
- Walkthrough.tsx
- sketchguess/lib/api.ts
- presence/tsconfig.json
- ReadScreen.tsx
- tsconfig.test.json
- lib/presence.ts
- MirrorView.tsx
- session.ts
- .webSocketMessage
- import-hall-assets.mjs
- Multiplayer ("other visitors") — plan v2 (Cloudflare)
- perf.ts
- room-places.ts
- journal.ts
- player-card.ts
- backend.ts
- hang-tag.ts
- The Moonlit Pond — design
- Pond rework
- Museum.tsx
- Orchestration contract — you plan, DSH workers execute
- tables.ts
- Tiny Museum v1 · Curator Letters
- useBackgroundMusic.ts
- ticket/route.ts
- SlotDef
- rooms/art.ts
- run.ts
- lib/slots/index.ts
- Walker
- Conn
- infra/jobs.ts
- Curating the paintings (2026-11-07)
- catalog.ts
- frame.ts
- outbox.test.ts
- photos/route.ts
- getStorage
- writeLocal
- hit.ts
- PondPanels.tsx
- reveal.ts
- HallArranger.tsx
- Low
- Atelier: the dressing mirror, and show-don't-tell keeping
- createPlacementLayer
- performance/page.tsx
- a/[slug]/page.tsx
- ref_node_assert
- AccountSheet
- visits.ts
- admin/route.ts
- protocol.ts
- Your Room: a room you can freely furnish
- BunnyArtist.tsx
- schedule.test.ts
- Storyline (draft, saved 2026-11-17)
- backdrop.ts
- bake-pond-path.mjs
- Local end-to-end stress test — 2026-11-06
- createPondRoom
- draw.py
- (hall)/page.tsx
- createPixelRatioGovernor
- lib/slots/index.ts
- scripts
- Monets Lily Pond: exploration, UX and multiplayer QA
- ref_node_assert
- createMinimap
- scripts
- bake-shopkeeper.mjs
- Atelier.tsx
- reel-report.ts
- personal/room.ts
- Medium
- atelier.ts
- npcs/README.md
- Wardrobe
- Cafe
- Other visitors
- queryOne
- ArtCache
- react
- flick.ts
- hall/room.ts
- Sitting
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

## Communities (222 total, 25 thin omitted)

### Community 0 - "stage.ts"
Cohesion: 0.03
Nodes (49): coverFloorTransition(), CharacterSprites, CameraRig, createRoomPassage(), fixture(), NpcRoomInfo, Options, Pose (+41 more)

### Community 1 - "Traversal"
Cohesion: 0.08
Nodes (10): JumpPose, clamp(), fixture(), jump(), Traversal, MAX_CATCH_UP_SECONDS, MAX_STEP_SECONDS, movementSteps() (+2 more)

### Community 2 - "SketchGuess.tsx"
Cohesion: 0.10
Nodes (32): bestKeyFor(), BURST, clueUrl(), openingPlan(), Phase, pickAtRandom(), prepareSketchGame(), readDifficulty() (+24 more)

### Community 3 - "DoorEditor.tsx"
Cohesion: 0.07
Nodes (58): hallDoorSpan(), GuideTalk, saveDoorsAction(), DoorEditor(), add(), apply(), commitSlide(), nudge() (+50 more)

### Community 4 - "assetUrl"
Cohesion: 0.14
Nodes (22): ArtByRoom, colorAt(), decoded(), disposePondArt(), EDGE_BAND, EDGE_BANDS, EDGE_OVERLAP, edgeTexture() (+14 more)

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
Cohesion: 0.09
Nodes (40): AssetManifest, assetUrl(), bitmapTexture(), blankImage(), CAFE_CAT_FRAMES, CompressedLoader, elementTexture(), ENTRANCE_FILES (+32 more)

### Community 9 - "pond-api.ts"
Cohesion: 0.07
Nodes (57): refreshWalletNow(), GLYPHS, PearlIcon(), POND_CRIMSON, PondIconName, buyPondBait(), claimPondBounty(), errorOf() (+49 more)

### Community 10 - "machine.ts"
Cohesion: 0.11
Nodes (36): CastMeter(), ReelMeter(), armCast(), BITE_WINDOW, biteGap(), CHARGE_PERIOD, chargePower(), createFishingState() (+28 more)

### Community 11 - "personal/room.ts"
Cohesion: 0.08
Nodes (22): createDecorController(), canvasRect(), targetRise(), toScreen(), isRemovedProceduralFish(), light(), showArrangement(), DOOR_SIGN (+14 more)

### Community 12 - "Test Fakes and Helpers"
Cohesion: 0.11
Nodes (27): deferredFetch(), deviceSlot, FakeEvents, FakeStorage, fixture, fixtureB, fixtureRegistry, fixtureRegistryBoth (+19 more)

### Community 13 - "scene.ts"
Cohesion: 0.04
Nodes (33): disposeDisplayTexture(), prefersAvif(), HiddenCoin, createNotes(), createPedestal(), Notes, Pedestal, PedestalVoice (+25 more)

### Community 14 - "cozy.ts"
Cohesion: 0.06
Nodes (58): alphaCanvas(), ATELIER_PROPS, AtelierImage, atticWindowCanvas(), bareBulbCanvas(), boardsCanvas(), canvasTexture(), ceilingGeometry() (+50 more)

### Community 15 - "logic.ts"
Cohesion: 0.09
Nodes (51): errorReason(), overDrawer(), PersonalRoom(), canPlaceNew(), carriedTo(), carryEnd(), carryMove(), messAt() (+43 more)

### Community 16 - "room-events.ts"
Cohesion: 0.06
Nodes (58): ChatButton(), REFUSED, Props, WalkAlone(), appendChatMessage(), CHAT_HISTORY_LIMIT, CHAT_HISTORY_WINDOW_MS, chatHistoryKey() (+50 more)

### Community 17 - "schedule.ts"
Cohesion: 0.07
Nodes (56): addDwellEmotes(), addEmote(), addGap(), addStand(), addWalk(), along(), buildRoomTable(), buildStayPlan() (+48 more)

### Community 18 - "three"
Cohesion: 0.05
Nodes (31): Scenery, CafeMarks, Attachment, Carried, CarriedState, createCarried(), Character, Perch (+23 more)

### Community 19 - "amplify/package.json"
Cohesion: 0.17
Nodes (14): devDependencies, @aws-amplify/backend@^1.14.0, @aws-amplify/backend-cli@^1.6.0, aws-cdk-lib@^2.180.0, constructs@^10.3.0, name, private, scripts (+6 more)

### Community 20 - "AtelierHooks"
Cohesion: 0.18
Nodes (3): Work, AtelierActions, AtelierHooks

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
Cohesion: 0.12
Nodes (27): POST(), ALLOWED, PER_VISITOR, POST(), POST(), POST(), POST(), GET() (+19 more)

### Community 25 - "handlers.ts"
Cohesion: 0.04
Nodes (69): listPieces(), pieceImageUrl(), PieceRow, toPieceDto(), confirmedFollowers(), EpochRow, SliceRow, GalleryRow (+61 more)

### Community 26 - "member-route.ts"
Cohesion: 0.11
Nodes (28): POST(), GET(), POST(), GET(), GLOBAL, PER_IP, POST(), POST() (+20 more)

### Community 27 - "createPersonalRoom"
Cohesion: 0.09
Nodes (13): createCafe(), CafeLink, FunZoneSign, GiftShopSigns, GuestBoardNotes, Placards, placeLabel(), toScreen() (+5 more)

### Community 28 - "ambience.ts"
Cohesion: 0.12
Nodes (29): blade(), bloom(), BLOOMS, createPondAmbience(), update(), fishTexture(), frond(), FRONT_ROWS (+21 more)

### Community 29 - "core/src/index.ts"
Cohesion: 0.04
Nodes (161): GET(), CatchExtra, COLUMNS, insertCatch(), StatePatch, addBait(), baitOf(), compare() (+153 more)

### Community 30 - "Web Package Dependencies"
Cohesion: 0.10
Nodes (27): dependencies, embla-carousel-react@^8.6.0, motion@^13.1.1, next@^15.0.3, react@^19.0.0, react-dom@^19.0.0, swr@^2.5.1, three@^0.169.0 (+19 more)

### Community 31 - "Gamifying Tiny Museum — genre direction & engagement research"
Cohesion: 0.10
Nodes (19): 0.1 The core experience, 0.2 Systems that make gamification cheap to build, 0.3 Constraints that shape any recommendation, 0. What the game is today (the deep dive), 1.1 The landscape (seven candidates, with verdicts), 1.2 Recommendation: a **cozy gallery life-sim** — "the gallery you live in", 1.3 The five design pillars the genre implies, 1. Genre direction (+11 more)

### Community 32 - "rig.ts"
Cohesion: 0.12
Nodes (26): Layer, setCostumeVisibility(), follow(), canvasToModel(), createRenderer(), disposeRigLayer(), Frame, loadRig() (+18 more)

### Community 33 - "DecorDrawer.tsx"
Cohesion: 0.09
Nodes (30): useWallet(), DecorDrawer, DecorDrawerProps, SLOT_LABELS, Tab, TABS, categoryOf(), DrawerCategory (+22 more)

### Community 34 - "risk.ts"
Cohesion: 0.12
Nodes (33): Hud(), HudProps, HudWagerChip, WagerPicker(), chooseTier(), stepStake(), WagerPickerProps, CastOptions (+25 more)

### Community 35 - "amplify/tsconfig.json"
Cohesion: 0.20
Nodes (9): compilerOptions, module, moduleResolution, noUnusedLocals, noUnusedParameters, exclude, extends, include (+1 more)

### Community 36 - "5. Customization menu — what other people are doing"
Cohesion: 0.12
Nodes (16): 1. The target: what "Claude Opus 5.5" actually means, 2. Where your harness stands today (live config I read), 3. The honest gap model, 4. Quality levers, ranked by leverage, 5. Customization menu — what other people are doing, 6. Recommended starting kit for *your* profile, 7. What I can apply for you right now (needs your go-ahead), A. Prompt & persona (most common quality customizations) (+8 more)

### Community 37 - "rooms.ts"
Cohesion: 0.06
Nodes (65): AtelierPage(), dynamic, metadata, The closet: where every room starts (2026-11-17), artist(), member(), piece(), randomId() (+57 more)

### Community 38 - "wallet.ts"
Cohesion: 0.07
Nodes (33): grantPearls(), member(), now, piece(), randomId(), today, BugReport, BugReportDto (+25 more)

### Community 39 - "Web TSConfig"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 40 - "Root Package Manifest"
Cohesion: 0.13
Nodes (19): description, devDependencies, concurrently@^9.1.0, esbuild@^0.24.0, ktx2-encoder@^0.6.0, maxrects-packer@^2.7.3, @types/node@^22.9.0, typescript@^5.6.3 (+11 more)

### Community 41 - "pond-api.ts"
Cohesion: 0.08
Nodes (48): gradeLabel(), fetchPondFeed(), PondFeedItem, catchLabel(), EXCHANGE_DAILY_STAMPS, EXCHANGE_PEARLS_PER_STAMP, fishArt(), formatCountdown() (+40 more)

### Community 42 - "npc-layer.ts"
Cohesion: 0.09
Nodes (44): GuideTalk(), createDoorGuides(), HallGuide, PROJECTED, BY_ID, CAST, castMember(), FRAME (+36 more)

### Community 43 - "app/page.tsx"
Cohesion: 0.19
Nodes (12): [BRAND_OWNER, ...BRAND_REST], CurrentlyShowing(), Decor(), dynamic, LandingPage(), openAccountCreation(), coin, CoinFound() (+4 more)

### Community 44 - "Base TSConfig"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, lib, module, moduleResolution (+9 more)

### Community 45 - "Amplify Build Spec"
Cohesion: 0.12
Nodes (16): applications, appRoot, backend, frontend, baseDirectory, files, phases, commands (+8 more)

### Community 46 - "createAtelierRoom"
Cohesion: 0.27
Nodes (18): aspectOf(), createAtelierRoom(), buildCollection(), form(), buildEntrance(), buildMirror(), buildRoom(), buildWardrobe() (+10 more)

### Community 47 - "AtelierKeeps.tsx"
Cohesion: 0.12
Nodes (23): CoinToast(), Toast, Purse(), Stamp(), WalletProvider(), STAMP_ASPECT, STAMP_SVG, STAMP_URL (+15 more)

### Community 48 - "Placement"
Cohesion: 0.09
Nodes (7): Carry, PersonalRoomProps, DecorLive, GhostOptions, PlacementLayer, PlacementTheme, Placement

### Community 49 - "import-fishing-assets.mjs"
Cohesion: 0.10
Nodes (12): CANVAS, clear, FONT, FRAME, heights, layout, lossless, manifest (+4 more)

### Community 50 - "Water.tsx"
Cohesion: 0.07
Nodes (49): AmbientShadow, box(), BUCKET, BUCKET_SPOTS, bunnyBox(), easeOut(), Glint, LEFT_STYLE (+41 more)

### Community 51 - "Worker Package Manifest"
Cohesion: 0.14
Nodes (14): dependencies, @tiny/core@*, exports, ./lambda, @tiny/core, main, name, private (+6 more)

### Community 52 - "Public Asset Manifest"
Cohesion: 0.12
Nodes (15): artworks, bunny, size, floor, size, fonts, icon-no-photos, size (+7 more)

### Community 53 - "walk.ts"
Cohesion: 0.09
Nodes (33): water, depthAtLift(), FAR_LIFT, FAR_SCALE, liftAt(), pathHalfWidth(), pathX(), PondPath (+25 more)

### Community 54 - "features/economy/index.ts"
Cohesion: 0.19
Nodes (16): serverSnapshot, useEarnEvents(), buildClaim(), BuiltClaim, EarnDetail, EarnSource, GameSource, newRunId() (+8 more)

### Community 55 - "compose-atelier.mjs"
Cohesion: 0.12
Nodes (10): body, dressLayer, dressWidth, floralWidth, hanger, MANNEQUIN_CANVAS, mask, root (+2 more)

### Community 57 - "import-hall-assets.mjs"
Cohesion: 0.14
Nodes (11): DOOR, DOOR_BACKDROP, drop, FURNITURE, manifest, manifestPath, masters, ORNATE_PAPER (+3 more)

### Community 58 - "ticket/route.ts"
Cohesion: 0.09
Nodes (45): submit(), Code, 3.2 Chosen names (members), email(), registry, started(), artistForSession(), AuthedArtist (+37 more)

### Community 59 - "economy/store.ts"
Cohesion: 0.12
Nodes (38): CARRY_CAP, carryAdd(), CarryEntry, carryPrune(), carryRemove(), chunk(), ClaimRequest, tzOffsetNow() (+30 more)

### Community 60 - "FishingView.tsx"
Cohesion: 0.13
Nodes (35): CAST_ERRORS, coarsePointer(), FishingView(), initialEasyReel(), isTyping(), LOST, PondGameProps, Toast (+27 more)

### Community 61 - "room.ts"
Cohesion: 0.13
Nodes (31): admitted(), Attachment, farewell(), GHOST_MS, HELLO_TIMEOUT_MS, holdsOf(), homeOf(), MAX_WAITING_PER_IP (+23 more)

### Community 62 - "minimap.ts"
Cohesion: 0.08
Nodes (27): follow(), doorPoint(), FALLBACK_TINT, FloorSketch, ICONS, MAP_PLACES, MAP_SCALE, MapPlace (+19 more)

### Community 63 - "useSound"
Cohesion: 0.08
Nodes (36): BugReportHost(), BugReportSheet, BugReportSheet(), Status, collectContext(), inAppBrowser(), onOpenBugReport(), recentErrors (+28 more)

### Community 64 - "domain/guestboard.ts"
Cohesion: 0.14
Nodes (20): GET(), StickyNoteProps, decodeCursor(), encodeCursor(), enforceLimits(), GuestNoteInput, GuestNoteRateLimited, GuestNoteRejected (+12 more)

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

### Community 69 - "SyncStore"
Cohesion: 0.13
Nodes (14): anonKey(), deviceKey(), encodeStored(), isMemberSlotKey(), listKeys(), memberKey(), memberPrefix(), parseStored() (+6 more)

### Community 70 - "wire.ts"
Cohesion: 0.11
Nodes (10): fetch(), Env, INTERPOLATION_DELAY_MS, PEER_TIMEOUT_MS, PeerTable, positionAt(), Sample, look (+2 more)

### Community 71 - "LandingFx"
Cohesion: 0.14
Nodes (17): between(), CAT, Edge, EDGES, runLandingCat(), choosePeeker(), peek(), glowSprite() (+9 more)

### Community 72 - "Confirmed issues"
Cohesion: 0.11
Nodes (18): Confirmed issues, E2E-002 — Valid edge placement rejected through floating-point precision, E2E-003 — One owned prop can be placed multiple times, E2E-004 — Reload before autosave silently loses the latest placement, E2E-005 — Failed save and failed Done have no visible mobile explanation, E2E-006 — Restoring connectivity does not retry a failed draft save, E2E-007 — Keyboard activation cannot place drawer items, E2E-008 — Creating an account from My Room leaves the signed-in user on the sign-in prompt (+10 more)

### Community 73 - "epoch.ts"
Cohesion: 0.12
Nodes (24): GET(), intParam(), GET(), sketchPool, unavailable(), DoorsPage(), dynamic, hallPaintings() (+16 more)

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
Cohesion: 0.12
Nodes (10): socket(), target, CAT, drop, EXPECTED, manifest, manifestPath, masters (+2 more)

### Community 80 - "createPresence"
Cohesion: 0.19
Nodes (13): createPresence(), drop(), heartbeat(), maybeSend(), onPageHide(), receive(), scheduleRetry(), send() (+5 more)

### Community 81 - "members"
Cohesion: 0.11
Nodes (28): coin_claims, coin_claims_daily, wallet_bait, wallet_items, wallets, member_sessions, member_sessions_member, member_slots (+20 more)

### Community 82 - "Frame Window Asset"
Cohesion: 0.50
Nodes (4): frame, size, window, windowAspect

### Community 83 - "wander.ts"
Cohesion: 0.10
Nodes (39): Job, Place, WalkState, along(), beginNext(), beginWork(), between(), blockedAt() (+31 more)

### Community 84 - "presence/package.json"
Cohesion: 0.14
Nodes (16): dependencies, @tiny/core@*, devDependencies, @cloudflare/workers-types@5.20261016.1, wrangler@4.151.1, @tiny/core, name, private (+8 more)

### Community 85 - "wallet/body.ts"
Cohesion: 0.17
Nodes (17): PER_MEMBER, POST(), baitIdOf(), integerOffset(), isRecord(), itemIdOf(), MAX_CLAIM_BATCH, MAX_WALLET_BODY_BYTES (+9 more)

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
Cohesion: 0.11
Nodes (28): ClosetView(), shuffle(), tapMiddle(), wearAt(), LISTS, PLACE, PODIUM_SRC, Props (+20 more)

### Community 93 - "createStage"
Cohesion: 0.13
Nodes (25): boundedCameraX(), shouldTick(), isDoor(), linkedDoor(), createNearby(), createStage(), closeEntry(), enter() (+17 more)

### Community 94 - "snapshot.ts"
Cohesion: 0.23
Nodes (15): snap(), composeJpeg(), copyCanvas(), grabLayers(), Layer, loadImage(), paint(), px() (+7 more)

### Community 95 - "wardrobe.ts"
Cohesion: 0.14
Nodes (26): allowedCharacter(), OwnedSnapshot, owns(), walletReady(), Atelier(), leave(), Look, keepStamps() (+18 more)

### Community 96 - "actions.ts"
Cohesion: 0.05
Nodes (79): AnalyticsPage(), dynamic, BugReportsPage(), dateFormat, dynamic, summary(), dateFormat, dynamic (+71 more)

### Community 104 - "lib/assets.ts"
Cohesion: 0.13
Nodes (18): roomWork(), AtelierImage, PICTURE, doorArtUrl(), loadDoorArt(), loadRoomDoorArt(), pending, assetCssVariables() (+10 more)

### Community 105 - "RevealCard.tsx"
Cohesion: 0.11
Nodes (18): CONFETTI_COLORS, ConfettiPiece, makeConfetti(), RevealCard(), RevealCardProps, TIER_MS, useCountUp(), LostReason (+10 more)

### Community 106 - "rules.ts"
Cohesion: 0.15
Nodes (18): localDay(), at(), EXCHANGE_DAILY_STAMPS, EXCHANGE_PEARLS_PER_STAMP, exchangeClaimKey(), GAME_DAILY_CAP, GameId, GAMES (+10 more)

### Community 107 - "nearby.ts"
Cohesion: 0.18
Nodes (5): Nearby, NearbyReach, RoomSpan, reach, strip

### Community 108 - "GuestBoard.tsx"
Cohesion: 0.20
Nodes (13): ComposeScreen(), ComposeScreenProps, blankDraft(), GuestBoard(), GuestBoardProps, View, fetchPage(), NoteDraft (+5 more)

### Community 109 - "json"
Cohesion: 0.11
Nodes (42): PER_MEMBER, PUT(), PER_MEMBER, POST(), catchIdOf(), isRecord(), MAX_POND_BODY_BYTES, pearlsOf() (+34 more)

### Community 110 - "graftCostume"
Cohesion: 0.27
Nodes (14): canvasFit(), compose(), graftCostume(), copyAccessor(), copyMaterial(), copyMesh(), copyTexture(), copyView() (+6 more)

### Community 111 - "createRemoteVisitors"
Cohesion: 0.16
Nodes (15): writeHidden(), createRigLayer(), createPlayerCard(), hide(), onPointerDown(), bubbleFor(), createRemoteVisitors(), ensureLayer() (+7 more)

### Community 112 - "worker/tsconfig.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 113 - "core/tsconfig.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 114 - "RigPreview.tsx"
Cohesion: 0.08
Nodes (34): CrowdPreviewPage(), RigPreviewPage(), CrowdPreview(), draw(), KINDS, Stats, Window, NEXT (+26 more)

### Community 115 - "How to Design for Failures — ByteByteGo Newsletter"
Cohesion: 0.40
Nodes (4): How to Design for Failures — ByteByteGo Newsletter, Preview, What the article covers, Where the paywall starts

### Community 116 - "Worker instructions — DSH headless agents"
Cohesion: 0.40
Nodes (4): graphify-first codebase navigation, Keep the graph current, Product and design direction, Worker instructions — DSH headless agents

### Community 117 - "Backend"
Cohesion: 0.50
Nodes (3): AWS prerequisites, Backend, Deploying by hand

### Community 118 - "lobby.ts"
Cohesion: 0.07
Nodes (31): Assets, CUTS, disposeBoards(), Mark, ROPE_CUTS, ropeSlices(), sliceOf(), stretchedBoard() (+23 more)

### Community 119 - "Costume gallery doorway"
Cohesion: 0.50
Nodes (3): Costume gallery doorway, Curtain colour edit, Prompt

### Community 120 - "env.ts"
Cohesion: 0.14
Nodes (8): manifest, SCHEMA_DIR, isProduction(), presenceSecret(), repoRoot, required(), sessionSecret(), setting()

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

### Community 126 - "Angler.tsx"
Cohesion: 0.13
Nodes (10): setFrame(), RigState, Rig, FITS, Angler(), Box, currentLook(), GRIP (+2 more)

### Community 127 - "Walkthrough.tsx"
Cohesion: 0.20
Nodes (14): BACKDROP_STYLE, MoreArrow(), NavArrow(), Props, SLIDE, Walkthrough(), XIcon(), frameFor() (+6 more)

### Community 128 - "sketchguess/lib/api.ts"
Cohesion: 0.23
Nodes (13): sameOriginUrl(), PreparedGame, decodeImage(), fetchBitmap(), fetchRound(), guarded(), LoadedRound, loadInk() (+5 more)

### Community 129 - "presence/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, types, exclude, extends, include, ../../tsconfig.base.json

### Community 130 - "ReadScreen.tsx"
Cohesion: 0.23
Nodes (11): BoardScreen(), BoardScreenProps, PinnedNotes(), PinnedNotesProps, ReadScreen(), ReadScreenProps, messageLength(), StickyNote() (+3 more)

### Community 131 - "tsconfig.test.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 132 - "lib/presence.ts"
Cohesion: 0.07
Nodes (23): Entry, RemoteVisitor, Connect, fetchTicket, HEARTBEAT_MS, HIDDEN_LIMIT_MS, Presence, RETRY_MS (+15 more)

### Community 133 - "MirrorView.tsx"
Cohesion: 0.18
Nodes (15): close(), onKeyDown(), trapTab(), MIRROR_SRC, MirrorView(), close(), move(), onKeyDown() (+7 more)

### Community 134 - "session.ts"
Cohesion: 0.12
Nodes (26): roomEditor, GET(), PaintingRow, PER_EDITOR, PUT(), versionOf(), PER_MEMBER, POST() (+18 more)

### Community 135 - ".webSocketMessage"
Cohesion: 0.44
Nodes (3): attachmentOf(), Room, sendTo()

### Community 136 - "import-hall-assets.mjs"
Cohesion: 0.09
Nodes (17): BASEBOARD, CURTAIN, drop, EXPECTED, file(), manifest, manifestPath, masters (+9 more)

### Community 137 - "Multiplayer ("other visitors") — plan v2 (Cloudflare)"
Cohesion: 0.10
Nodes (20): 0. Summary, 10. Decisions, 1. Product contract changes (approved 2026-10-31), 2. What already exists that this builds on, 3.1 Generated names (everyone has one), 3. Names, 4. Transport: Cloudflare Durable Objects, 5.1 Emotes (v1) (+12 more)

### Community 138 - "perf.ts"
Cohesion: 0.18
Nodes (7): createPerfMeter(), snapshot(), isEnabled(), PerfMeter, PerfSnapshot, Checked against the mocks (2026-11-07), view()

### Community 139 - "room-places.ts"
Cohesion: 0.14
Nodes (20): HallLayout, NpcGround, PlaceKind, atelierRoomInfo(), atelierX(), copy(), FurniturePlacement, hallCache (+12 more)

### Community 140 - "journal.ts"
Cohesion: 0.09
Nodes (26): KeepsakeFound(), USE_HINT, SONG, SpecialFound(), POND_SIGN_NAME, catchArt(), JOURNAL_FAMILIES, JOURNAL_GRADES (+18 more)

### Community 141 - "player-card.ts"
Cohesion: 0.11
Nodes (13): Door, doorOf(), PlayerCard, wallpaperOf(), cozyLevel, cozyWorth(), Built (2026-11-21), Decisions (+5 more)

### Community 142 - "backend.ts"
Cohesion: 0.15
Nodes (12): amplifyDir, backend, everyMinutes, mediaBucket, missing, repoRoot, REQUIRED, setting() (+4 more)

### Community 143 - "hang-tag.ts"
Cohesion: 0.12
Nodes (8): CARD, createHangTag(), HangTag, HangTagStyle, HOLE, KNOT, What goes, and what replaces it, Refusal

### Community 144 - "The Moonlit Pond — design"
Cohesion: 0.09
Nodes (22): Art the pond needs from the artist, Build contract (decided 2026-11-07), Build phases, Collection and goals, Done, Done, Guardrails, Leaderboards (+14 more)

### Community 145 - "Pond rework"
Cohesion: 0.18
Nodes (10): Baits, Client, Decisions, Done, Notes, Pond rework, Server, Species (+2 more)

### Community 146 - "Museum.tsx"
Cohesion: 0.08
Nodes (35): CoinFound, ColorRecall, GameDesktop, GuestBoard, HallArranger, HelpGuide, loadCoinFound(), loadGameDesktop() (+27 more)

### Community 147 - "Orchestration contract — you plan, DSH workers execute"
Cohesion: 0.29
Nodes (6): Briefing a worker, Budget hygiene, graphify, Orchestration contract — you plan, DSH workers execute, The worker, When not to delegate

### Community 148 - "tables.ts"
Cohesion: 0.09
Nodes (41): BaitTray(), BaitTrayProps, PondCatch, PondCatchReply, CatchView, debugSpecies(), debugTokens(), debugVariant() (+33 more)

### Community 149 - "Tiny Museum v1 · Curator Letters"
Cohesion: 0.17
Nodes (11): Letter 0 · Clean up your room, Letter 1 · Place your first decoration, Letter 2 · Visit the first gallery, Letter 3 · Play a mini-game, Letter 4 · Unlock an outfit or character, Letter 5 · Find the seasonal items, Letter 6 · Unlock the daily calendar, Letter 7 · The cliffhanger and email signup (+3 more)

### Community 150 - "useBackgroundMusic.ts"
Cohesion: 0.11
Nodes (27): BackgroundMusic, clampVolume(), isDocumentHidden(), Options, useBackgroundMusic(), VISIBILITY_EVENTS, EFFECTS, EffectSpec (+19 more)

### Community 151 - "ticket/route.ts"
Cohesion: 0.26
Nodes (11): PER_MEMBER, PUT(), PER_IP, POST(), presenceUrl(), memberName, canView(), homeSlugOf() (+3 more)

### Community 152 - "SlotDef"
Cohesion: 0.20
Nodes (3): FakeServer, SlotState, SlotDef

### Community 153 - "rooms/art.ts"
Cohesion: 0.08
Nodes (28): AtelierArt, disposeAtelierArt(), INSET_DOOR_Z, loadGalleryDoor(), loadGalleryPillar(), loadGalleryPillow(), loadImage(), pending (+20 more)

### Community 154 - "run.ts"
Cohesion: 0.20
Nodes (7): admin, childEnv, client, database, fresh, migrations, target

### Community 155 - "lib/slots/index.ts"
Cohesion: 0.10
Nodes (14): PresencePreviewPage(), KeepOnOtherDevices(), PresencePreview(), announceNameChange(), NameError, useVisitorName(), VisitorName, Probe() (+6 more)

### Community 156 - "Walker"
Cohesion: 0.19
Nodes (3): FloorPoint, WalkArea, Walker

### Community 157 - "Conn"
Cohesion: 0.27
Nodes (5): send(), connectWebSocket(), SocketHandlers, Conn, message()

### Community 158 - "infra/jobs.ts"
Cohesion: 0.09
Nodes (40): loop(), shutdown(), sleep(), sweepStale(), DrainResult, handler(), repairFrames(), clearCatches() (+32 more)

### Community 159 - "Curating the paintings (2026-11-07)"
Cohesion: 0.12
Nodes (15): hang(), 1. The registry and the table, 2. The studio's Location picker, 3. The rooms draw what is placed, 4. Credits, 5. Retiring self-serve artists, Building it, Curating the paintings (2026-11-07) (+7 more)

### Community 160 - "catalog.ts"
Cohesion: 0.07
Nodes (34): cleanNow(), Catalogue, Data model (core), CatalogItem, CatalogKind, FREE_CHARACTERS, ITEMS, ItemSlot (+26 more)

### Community 161 - "frame.ts"
Cohesion: 0.22
Nodes (11): decodedFrames, FrameShape, LANDSCAPE, PORTRAIT, preloadFrames(), shape(), SPECIES, AssetName (+3 more)

### Community 162 - "outbox.test.ts"
Cohesion: 0.18
Nodes (18): OUTBOX_CAP, outboxAdd(), outboxDue(), OutboxEntry, outboxFail(), outboxRemove(), RETRY_BASE_MS, RETRY_MAX_MS (+10 more)

### Community 163 - "photos/route.ts"
Cohesion: 0.38
Nodes (6): GET(), POST(), readCapped(), READS, UPLOADS, listPondPhotos()

### Community 164 - "getStorage"
Cohesion: 0.09
Nodes (22): CONTENT_TYPES, GET(), PUT(), addPondPhoto(), AddPondPhotoResult, isJpeg(), POND_PHOTO_LIMIT, POND_PHOTO_MAX_BYTES (+14 more)

### Community 165 - "writeLocal"
Cohesion: 0.16
Nodes (21): ColorRecall(), ColorRecallProps, Phase, readBest(), ColorRound, showMs(), undoAdminUnlock(), unlockEverything() (+13 more)

### Community 166 - "hit.ts"
Cohesion: 0.21
Nodes (10): createHiddenCoin(), AlphaMap, alphaMapFor(), alphaMaps, buildAlphaMap(), isPaintedAt(), registerSpriteMask(), spread() (+2 more)

### Community 167 - "PondPanels.tsx"
Cohesion: 0.21
Nodes (9): BOARD_TABS, PondOverlayKind, PondPanels(), close(), signIn(), startFishing(), PondPanelsProps, SUBTITLES (+1 more)

### Community 168 - "reveal.ts"
Cohesion: 0.23
Nodes (7): InkMap, planGame(), ROUND_SPREAD, createReveal(), PENCIL, SketchReveal, shuffle()

### Community 169 - "HallArranger.tsx"
Cohesion: 0.25
Nodes (8): HallArranger(), HallArrangerProps, HallRoomData, Painting, currentHallOrder(), hallPlacements(), paintingOrder(), reasonLabel()

### Community 170 - "Low"
Cohesion: 0.11
Nodes (19): 13. Pages that redirect or don't exist answer 200, 14. Error codes reveal which room slugs exist, 15. The name sign slides under the top-right buttons in Decorate, 16. Level-up celebrations can be farmed, 17. No hint of where things are after panning away, 18. Too many items is only discovered by the server, 19. Development-only: page payloads include the full room row, 1. Items placed against a zone edge fail to save, and the whole draft reverts (+11 more)

### Community 171 - "Atelier: the dressing mirror, and show-don't-tell keeping"
Cohesion: 0.13
Nodes (14): Atelier: the dressing mirror, and show-don't-tell keeping, Build order, Built (2026-11-20), Decisions (2026-11-19), Follow-ups (2026-11-20), Goal, In the room, Keeping (+6 more)

### Community 172 - "createPlacementLayer"
Cohesion: 0.24
Nodes (10): aspectOf(), createPlacementLayer(), applyGlow(), drawOutline(), dropGhosts(), dropHelper(), extrasFor(), silhouette() (+2 more)

### Community 173 - "performance/page.tsx"
Cohesion: 0.27
Nodes (9): dynamic, format(), grade(), METRICS, PAGES, PerformancePage(), RANGES, summarizeVitals() (+1 more)

### Community 174 - "a/[slug]/page.tsx"
Cohesion: 0.31
Nodes (6): ArtistPage(), dynamic, generateMetadata(), GET(), FollowForm(), getArtistPage()

### Community 175 - "ref_node_assert"
Cohesion: 0.11
Nodes (32): defineSlot(), docBytes(), SLOTS, byAtThenKey(), encoded(), latest, mapOf(), maxNumber() (+24 more)

### Community 176 - "AccountSheet"
Cohesion: 0.39
Nodes (7): AccountSheet(), continueAnyway(), doSignOut(), runDelete(), runName(), submitDelete(), submitName()

### Community 177 - "visits.ts"
Cohesion: 0.08
Nodes (37): state(), PER_VISITOR, POST(), amount(), duration(), dynamic, LANDMARKS, PAGES (+29 more)

### Community 178 - "admin/route.ts"
Cohesion: 0.31
Nodes (8): PER_MEMBER, ADMIN_MODE, ADMIN_STAMPS, buy(), lockWallet(), undoAdminUnlock(), unlockEverything(), walletOf()

### Community 179 - "protocol.ts"
Cohesion: 0.12
Nodes (30): isCatalogItem(), isHome(), isItem(), isName(), isPid(), isSeq(), MAX_MESSAGE_BYTES, parseClientMessage() (+22 more)

### Community 180 - "Your Room: a room you can freely furnish"
Cohesion: 0.22
Nodes (8): Admin mode (gamma), Decisions (2026-11-17, with the user), Room look (web, `features/rooms/themes/cozy.ts`, `features/rooms/personal/room.ts`), Scale, Testing locally, What other games do (research, 2026-11-17), Work plan, Your Room: a room you can freely furnish

### Community 181 - "BunnyArtist.tsx"
Cohesion: 0.12
Nodes (17): walk(), BunnyArtist(), BunnyMood, Pencil(), POSES, 1. What is in this bundle, 2. How the game draws the bunny today (read from the repo, not run), 3. The rig (+9 more)

### Community 182 - "schedule.test.ts"
Cohesion: 0.08
Nodes (23): RESIDENT_IDS, FloorSpot, JOBS, ROOM_KINDS, ROOMS, NpcRoom, Phase, ResidentState (+15 more)

### Community 183 - "Storyline (draft, saved 2026-11-17)"
Cohesion: 0.15
Nodes (12): Arc (soft, no fail state), Built so far, How it ties to what exists, Locked (2026-11-21, the owner), Next tasks (when picked up), Open questions, Premise, Revision (2026-11-21, the owner) (+4 more)

### Community 184 - "backdrop.ts"
Cohesion: 0.15
Nodes (13): createHallAmbience(), finish(), glowTexture(), HallAmbience, mulberry(), painted(), vignetteTexture(), Backdrop (+5 more)

### Community 185 - "bake-pond-path.mjs"
Cohesion: 0.14
Nodes (10): [, width, height], blank(), manifest, manifestPath, ORIGINAL_SOURCE, originalPath(), root, softened() (+2 more)

### Community 186 - "Local end-to-end stress test — 2026-11-06"
Cohesion: 0.22
Nodes (7): Environment and coverage, Follow-up coverage, Issue index, Local end-to-end stress test — 2026-11-06, Measured load, Passing checks and interpretation limits, Test data and cleanup

### Community 187 - "createPondRoom"
Cohesion: 0.32
Nodes (13): createPondRoom(), approach(), busy(), finishWalk(), goTo(), leave(), move(), nearest() (+5 more)

### Community 189 - "(hall)/page.tsx"
Cohesion: 0.27
Nodes (10): Loading(), dynamic, Hall(), MuseumPage(), DENSITY_MEDIA, HallPreload(), HallSkeleton(), MediaPreconnect() (+2 more)

### Community 190 - "createPixelRatioGovernor"
Cohesion: 0.33
Nodes (7): createPixelRatioGovernor(), reset(), stepTo(), PIXEL_RATIO_STEPS, pixelRatioSteps(), Renderer, governor()

### Community 191 - "lib/slots/index.ts"
Cohesion: 0.09
Nodes (16): bow, cardigan, dress, ANON_PREFIX, MEMBER_KEY, StorageLike, StoredSlot, deepEq() (+8 more)

### Community 192 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, db:schema, deploy:backend, dev, dev:presence, dev:web, dev:worker (+6 more)

### Community 193 - "Monets Lily Pond: exploration, UX and multiplayer QA"
Cohesion: 0.29
Nodes (6): Browser and interaction coverage, Changes made from the walkthrough, Monets Lily Pond: exploration, UX and multiplayer QA, Multiplayer and load, Practical limits, Regression checks and cleanup

### Community 194 - "ref_node_assert"
Cohesion: 0.39
Nodes (6): garlandRibbon(), at(), GarlandShape, Ribbon, sag(), shape

### Community 195 - "createMinimap"
Cohesion: 0.31
Nodes (9): place(), createMinimap(), draw(), drawRoom(), floors(), sketchOf(), readCollapsed(), svg() (+1 more)

### Community 196 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, assets:models, assets:pond-path, assets:shopkeeper, build, dev, start, typecheck

### Community 197 - "bake-shopkeeper.mjs"
Cohesion: 0.25
Nodes (5): bodyTextures, COATS, { json, bin }, manifest, maps

### Community 198 - "Atelier.tsx"
Cohesion: 0.08
Nodes (28): Loading(), MuseumLayout(), Loading(), metadata, PondPage(), CHANGE_SOUND, AtelierLoading(), revealFloorTransition() (+20 more)

### Community 199 - "reel-report.ts"
Cohesion: 0.48
Nodes (5): landedRetryDelay(), MAX_REPORT_RETRIES, MIN_REPORT_MS, ReelFailure, reportDelay()

### Community 200 - "personal/room.ts"
Cohesion: 0.08
Nodes (4): Job, DecorController, HighlightArea, WorkKind

### Community 201 - "Medium"
Cohesion: 0.25
Nodes (8): 10. Long names run off the name sign, 11. The rooms API skips the stale-tab member check, 12. The bunny is dragged along while you pan in Decorate, 6. Failed saves are nearly invisible, and nothing retries, 7. Two tabs editing the same room overwrite each other, 8. The drawer's card row can't be scrolled on touch screens, 9. Decorating can't be done with the keyboard, Medium

### Community 202 - "atelier.ts"
Cohesion: 0.07
Nodes (33): AtelierDoor, AtelierImage, BuiltRoom, Cardigan, CARDIGAN_NAMES, CHARACTER_NAMES, Control, refresh() (+25 more)

### Community 206 - "Other visitors"
Cohesion: 0.29
Nodes (6): How it plays, Other visitors, Privacy, Running it in production, Running it locally, Staying consistent

### Community 207 - "queryOne"
Cohesion: 0.10
Nodes (23): ConfirmFollow(), dynamic, dynamic, Unsubscribe(), GET(), FollowNotice(), BRAND, AnalyticsSummary (+15 more)

### Community 209 - "react"
Cohesion: 0.06
Nodes (45): config, SECURITY_HEADERS, bethEllen, inspiratiq, metadata, notoSans, RootLayout(), sniglet (+37 more)

### Community 210 - "flick.ts"
Cohesion: 0.53
Nodes (4): FLICK, flickDirection(), isUpwardFlick(), handlePointerUp()

### Community 211 - "hall/room.ts"
Cohesion: 0.06
Nodes (48): getWalletSnapshot(), MuseumProps, GALLERY_DOOR, createHelm(), createLobbyPillar(), createLiveReflection(), GlassRect, LiveReflection (+40 more)

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
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1734 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **25 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `ReadScreen.tsx`, `SketchGuess.tsx`, `DoorEditor.tsx`, `MirrorView.tsx`, `pond-api.ts`, `journal.ts`, `Test Fakes and Helpers`, `logic.ts`, `room-events.ts`, `Museum.tsx`, `tables.ts`, `progress.ts`, `useBackgroundMusic.ts`, `lib/slots/index.ts`, `Web Package Dependencies`, `DecorDrawer.tsx`, `risk.ts`, `writeLocal`, `PondPanels.tsx`, `pond-api.ts`, `HallArranger.tsx`, `app/page.tsx`, `a/[slug]/page.tsx`, `AtelierKeeps.tsx`, `Water.tsx`, `features/economy/index.ts`, `FishingView.tsx`, `(hall)/page.tsx`, `useSound`, `lib/slots/index.ts`, `Atelier.tsx`, `LandingFx`, `ClosetView.tsx`, `actions.ts`, `RevealCard.tsx`, `GuestBoard.tsx`, `RigPreview.tsx`, `Angler.tsx`, `Walkthrough.tsx`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **What connects `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json` to the rest of the system?**
  _5 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `stage.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.030927835051546393 - nodes in this community are weakly interconnected._
- **Why does `defaultStore()` connect `lib/slots/index.ts` to `stage.ts`, `writeLocal`, `session.ts`, `SyncStore`, `pond-api.ts`, `lib/slots/index.ts`, `createPondRoom`, `logic.ts`, `room-events.ts`, `react`, `hall/room.ts`, `walk.ts`, `progress.ts`, `economy/store.ts`, `FishingView.tsx`, `createStage`, `Angler.tsx`, `useSound`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **Should `Traversal` be split into smaller, more focused modules?**
  _Cohesion score 0.08292682926829269 - nodes in this community are weakly interconnected._
- **Why does `three` connect `three` to `stage.ts`, `assetUrl`, `scene/assets.ts`, `perf.ts`, `scene.ts`, `cozy.ts`, `hang-tag.ts`, `room-events.ts`, `prepare-models.mjs`, `rooms/art.ts`, `ambience.ts`, `Web Package Dependencies`, `rig.ts`, `hit.ts`, `npc-layer.ts`, `walk.ts`, `backdrop.ts`, `atelier.ts`, `hall/room.ts`, `RigPreview.tsx`, `lobby.ts`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Should `SketchGuess.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09815078236130868 - nodes in this community are weakly interconnected._