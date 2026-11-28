# Graph Report - tiny-museum  (2026-11-27)

## Corpus Check
- 610 files · ~373,248 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 118 file(s) not represented in the graph (top: .avif 60, .glb 46, .css 7)

## Summary
- 5424 nodes · 14301 edges · 215 communities (190 shown, 25 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 278 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `990cb25c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- rooms/types.ts
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
- Walkthrough.tsx
- Test Fakes and Helpers
- scene.ts
- cozy.ts
- logic.ts
- room-events.ts
- schedule.ts
- AtelierKeeps.tsx
- amplify/package.json
- chat-history.ts
- prepare-models.mjs
- progress.ts
- core/package.json
- domain/guestboard.ts
- handlers.ts
- pond-boards.ts
- next
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
- three
- (hall)/page.tsx
- Base TSConfig
- Amplify Build Spec
- defaultStore
- AtelierKeeps.tsx
- Placement
- import-fishing-assets.mjs
- Water.tsx
- Worker Package Manifest
- Public Asset Manifest
- walk.ts
- claim.ts
- compose-atelier.mjs
- AtelierRoom
- import-hall-assets.mjs
- member-route.ts
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
- ref_sharp
- createPresence
- members
- Frame Window Asset
- wander.ts
- presence/package.json
- join-room.ts
- Asset pipeline: fast loading without losing sharpness
- Guest Board SQL Schema
- Landscape Frame Asset
- ClosetView.tsx
- Bug Reports SQL Schema
- Vitals SQL Schema
- stage.ts
- snapshot.ts
- pond/room.ts
- actions.ts
- Run-Once Schema
- createNpcLayer
- RevealCard.tsx
- lib/slots/index.ts
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
- hall/room.ts
- Costume gallery doorway
- tab-turn.ts
- Fishing forest: painted asset pass
- Audio
- .claude/CLAUDE.md
- The Costume Atelier
- names.ts
- paintings/page.tsx
- reveal.ts
- sketchguess/lib/api.ts
- presence/tsconfig.json
- import-landing-assets.mjs
- tsconfig.test.json
- lib/presence.ts
- writeStyle
- session.ts
- .webSocketMessage
- import-hall-assets.mjs
- Multiplayer ("other visitors") — plan v2 (Cloudflare)
- useVisitorName.ts
- room-places.ts
- FishdexPanel.tsx
- Open rooms and the tip jar (design, 2026-11-21)
- CoinToast.tsx
- hang-tag.ts
- The Moonlit Pond — design
- Pond rework
- CameraRig
- Orchestration contract — you plan, DSH workers execute
- tables.ts
- Tiny Museum v1 · Curator Letters
- useBackgroundMusic.ts
- studio/layout.tsx
- SlotDef
- layout.ts
- ref_node_fs
- lib/slots/index.ts
- Walker
- writeLocal
- query
- Curating the paintings (2026-11-07)
- placements.ts
- AccountSheet
- VitalsReporter.tsx
- CodesSection.tsx
- getStorage
- Your Room: a room you can freely furnish
- editor.ts
- createPlacementLayer
- wander.test.ts
- audience.ts
- Low
- Atelier: the dressing mirror, and show-don't-tell keeping
- domain/guestboard.ts
- admin/route.ts
- PondRulesProps
- ref_node_assert
- HallArrangerProps
- visits.ts
- protocol.ts
- Local end-to-end stress test — 2026-11-06
- LandingFx
- schedule.test.ts
- Storyline (draft, saved 2026-11-17)
- backdrop.ts
- bake-pond-path.mjs
- pond/room.ts
- draw.py
- createPixelRatioGovernor
- SyncStore
- scripts
- Monets Lily Pond: exploration, UX and multiplayer QA
- opening.ts
- SketchGuess
- catalog.ts
- pond-state.ts
- personal/room.ts
- atelier.ts
- npcs/README.md
- query
- next
- plan.ts
- createHallRoom
- bugs/page.tsx
- Other visitors
- Wardrobe
- npc-sheet.cjs
- doors.sql
- painting-open
- focus.ts
- icon-basket
- bunny-left
- bunny-right
- icon-home
- ticket

## God Nodes (most connected - your core abstractions)
1. `react` - 94 edges
2. `useSound()` - 88 edges
3. `json()` - 77 edges
4. `PersonalRoom()` - 72 edges
5. `query()` - 72 edges
6. `hit()` - 63 edges
7. `limited()` - 57 edges
8. `FishingView()` - 50 edges
9. `three` - 49 edges
10. `next` - 48 edges

## Surprising Connections (you probably didn't know these)
- `5.1 Emotes (v1)` --references--> `ScreenChrome()`  [INFERRED]
  docs/multiplayer-plan.md → apps/web/src/shared/components/ScreenChrome.tsx
- `E2E-009 — Room mutations ignore stale account identity` --references--> `memberFromRequest()`  [INFERRED]
  docs/testing/local-e2e-stress-2026-11-06.md → apps/web/src/shared/lib/member-route.ts
- `Where things stand` --references--> `sealEpoch()`  [INFERRED]
  docs/curation-plan.md → packages/core/src/domain/epoch.ts
- `19. Development-only: page payloads include the full room row` --references--> `getRoom()`  [INFERRED]
  docs/personal-room-issues.md → packages/core/src/domain/rooms.ts
- `Server` --references--> `readPondTicket()`  [INFERRED]
  docs/pond-rework.md → packages/core/src/economy/pond.ts

## Import Cycles
- None detected.

## Communities (215 total, 25 thin omitted)

### Community 0 - "rooms/types.ts"
Cohesion: 0.05
Nodes (23): Pose, RoomOptions, Entry, StageOptions, Arrival, Floor, Frame, Interaction (+15 more)

### Community 1 - "Traversal"
Cohesion: 0.08
Nodes (10): clamp(), fixture(), jump(), Traversal, MAX_CATCH_UP_SECONDS, MAX_STEP_SECONDS, movementSteps(), RESTING_TICK_MS (+2 more)

### Community 2 - "SketchGuess.tsx"
Cohesion: 0.14
Nodes (23): BunnyMood, bestKeyFor(), BURST, clueUrl(), Phase, pickAtRandom(), readDifficulty(), readMode() (+15 more)

### Community 3 - "src/rooms/doors.ts"
Cohesion: 0.06
Nodes (63): DoorsPage(), dynamic, hallPaintings(), hallDoorSpan(), hallDoorSpans(), doorArtUrl(), loadDoorArt(), loadRoomDoorArt() (+55 more)

### Community 4 - "assetUrl"
Cohesion: 0.14
Nodes (22): colorAt(), decoded(), disposePondArt(), EDGE_BAND, EDGE_BANDS, EDGE_OVERLAP, edgeTexture(), imageOf() (+14 more)

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
Cohesion: 0.07
Nodes (50): AssetManifest, assetUrl(), bitmapTexture(), blankImage(), CAFE_CAT_FRAMES, CharacterSprites, CompressedLoader, elementTexture() (+42 more)

### Community 9 - "pond-api.ts"
Cohesion: 0.14
Nodes (30): AlbumPanel(), remove(), CameraView, openCamera(), keep(), buyPondBait(), claimPondBounty(), deletePondPhoto() (+22 more)

### Community 10 - "machine.ts"
Cohesion: 0.12
Nodes (36): CastMeter(), ReelMeter(), armCast(), BITE_WINDOW, biteGap(), CHARGE_PERIOD, chargePower(), createFishingState() (+28 more)

### Community 11 - "Walkthrough.tsx"
Cohesion: 0.15
Nodes (19): BACKDROP_STYLE, MoreArrow(), NavArrow(), Props, SLIDE, Walkthrough(), XIcon(), decodedFrames (+11 more)

### Community 12 - "Test Fakes and Helpers"
Cohesion: 0.10
Nodes (28): deferredFetch(), deviceSlot, FakeEvents, FakeStorage, fixture, fixtureB, fixtureRegistry, fixtureRegistryBoth (+20 more)

### Community 13 - "scene.ts"
Cohesion: 0.04
Nodes (36): Assets, disposeDisplayTexture(), prefersAvif(), CoinWall, createHiddenCoin(), HiddenCoin, Spot, createGiftShop() (+28 more)

### Community 14 - "cozy.ts"
Cohesion: 0.06
Nodes (57): alphaCanvas(), ATELIER_PROPS, AtelierImage, atticWindowCanvas(), bareBulbCanvas(), boardsCanvas(), canvasTexture(), ceilingGeometry() (+49 more)

### Community 15 - "logic.ts"
Cohesion: 0.07
Nodes (66): errorReason(), overDrawer(), PersonalRoom(), canPlaceNew(), carriedTo(), carryEnd(), carryMove(), messAt() (+58 more)

### Community 16 - "room-events.ts"
Cohesion: 0.16
Nodes (27): ChatButton(), REFUSED, Props, WalkAlone(), getChatHistory(), getPeople(), hasRoom(), history (+19 more)

### Community 17 - "schedule.ts"
Cohesion: 0.07
Nodes (55): addDwellEmotes(), addEmote(), addGap(), addStand(), addWalk(), along(), buildRoomTable(), buildStayPlan() (+47 more)

### Community 18 - "AtelierKeeps.tsx"
Cohesion: 0.15
Nodes (19): CoinToast(), Toast, Purse(), Stamp(), WalletProvider(), serverSnapshot, useEarnEvents(), useWallet() (+11 more)

### Community 19 - "amplify/package.json"
Cohesion: 0.08
Nodes (26): amplifyDir, backend, everyMinutes, mediaBucket, missing, repoRoot, REQUIRED, setting() (+18 more)

### Community 20 - "chat-history.ts"
Cohesion: 0.19
Nodes (13): appendChatMessage(), CHAT_HISTORY_LIMIT, CHAT_HISTORY_WINDOW_MS, chatHistoryKey(), ChatMessage, ChatStorage, isMessage(), memory (+5 more)

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
Cohesion: 0.13
Nodes (27): ALLOWED, PER_VISITOR, POST(), POST(), GLOBAL, PER_IP, POST(), GLOBAL (+19 more)

### Community 25 - "handlers.ts"
Cohesion: 0.05
Nodes (61): listPieces(), pieceImageUrl(), PieceRow, toPieceDto(), confirmedFollowers(), GalleryRow, planSketchRound(), SKETCH_CHOICES (+53 more)

### Community 26 - "pond-boards.ts"
Cohesion: 0.16
Nodes (18): compare(), DexRow, displayName(), FeedRow, getPondDex(), getPondFeed(), getPondLeaderboard(), NameRow (+10 more)

### Community 27 - "next"
Cohesion: 0.06
Nodes (29): config, SECURITY_HEADERS, Loading(), metadata, PondPage(), Minigame, POND_NAME, POND_SIGN_NAME (+21 more)

### Community 28 - "ambience.ts"
Cohesion: 0.12
Nodes (29): blade(), bloom(), BLOOMS, createPondAmbience(), update(), fishTexture(), frond(), FRONT_ROWS (+21 more)

### Community 29 - "core/src/index.ts"
Cohesion: 0.05
Nodes (123): GET(), addBait(), PondBoardMe, PondBoardRow, PondFeedItem, Rep, bountyCatches(), BountyCatchRow (+115 more)

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
Cohesion: 0.08
Nodes (24): Door, doorOf(), PlayerCard, wallpaperOf(), DecorDrawer, DecorDrawerProps, SLOT_LABELS, Tab (+16 more)

### Community 34 - "risk.ts"
Cohesion: 0.12
Nodes (32): Hud(), HudProps, HudWagerChip, WagerPicker(), chooseTier(), stepStake(), WagerPickerProps, CastOptions (+24 more)

### Community 35 - "amplify/tsconfig.json"
Cohesion: 0.20
Nodes (9): compilerOptions, module, moduleResolution, noUnusedLocals, noUnusedParameters, exclude, extends, include (+1 more)

### Community 36 - "5. Customization menu — what other people are doing"
Cohesion: 0.12
Nodes (16): 1. The target: what "Claude Opus 5.5" actually means, 2. Where your harness stands today (live config I read), 3. The honest gap model, 4. Quality levers, ranked by leverage, 5. Customization menu — what other people are doing, 6. Recommended starting kit for *your* profile, 7. What I can apply for you right now (needs your go-ahead), A. Prompt & persona (most common quality customizations) (+8 more)

### Community 37 - "locations.ts"
Cohesion: 0.13
Nodes (32): COLLECTIONS, discardLocation(), hangableOnly(), hasUnpublished(), inUse(), locationStates(), nudgeInRow(), OWNER (+24 more)

### Community 38 - "wallet.ts"
Cohesion: 0.07
Nodes (47): grantPearls(), member(), now, piece(), randomId(), today, baitOf(), applyClaim() (+39 more)

### Community 39 - "Web TSConfig"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 40 - "Root Package Manifest"
Cohesion: 0.12
Nodes (20): description, devDependencies, concurrently@^9.1.0, esbuild@^0.24.0, ktx2-encoder@^0.6.0, maxrects-packer@^2.7.3, playwright@^1.63.0, @types/node@^22.9.0 (+12 more)

### Community 41 - "pond-api.ts"
Cohesion: 0.06
Nodes (69): refreshWalletNow(), gradeLabel(), journalCatch, journalFamily, fetchPondFeed(), PondBoardId, PondBoardPeriod, PondBoardRow (+61 more)

### Community 42 - "three"
Cohesion: 0.05
Nodes (32): Attachment, Carried, CarriedState, createCarried(), Character, Perch, Pose, CONFIG (+24 more)

### Community 43 - "(hall)/page.tsx"
Cohesion: 0.05
Nodes (65): Loading(), dynamic, Hall(), MuseumPage(), [BRAND_OWNER, ...BRAND_REST], CurrentlyShowing(), Decor(), dynamic (+57 more)

### Community 44 - "Base TSConfig"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, lib, module, moduleResolution (+9 more)

### Community 45 - "Amplify Build Spec"
Cohesion: 0.12
Nodes (16): applications, appRoot, backend, frontend, baseDirectory, files, phases, commands (+8 more)

### Community 46 - "defaultStore"
Cohesion: 0.18
Nodes (14): dynamic, HomePage(), ensureStarted(), memberChanged(), publish(), readSession(), refreshWallet(), setBalance() (+6 more)

### Community 47 - "AtelierKeeps.tsx"
Cohesion: 0.25
Nodes (15): openAccount(), buy(), AtelierKeeps(), flash(), keep(), onKey(), press(), release() (+7 more)

### Community 48 - "Placement"
Cohesion: 0.08
Nodes (9): Carry, PersonalRoomProps, DecorLive, HallRoomData, GhostOptions, PlacementLayer, PlacementTheme, The closet: where every room starts (2026-11-17) (+1 more)

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

### Community 53 - "walk.ts"
Cohesion: 0.14
Nodes (23): water, depthAtLift(), FAR_LIFT, FAR_SCALE, liftAt(), pathHalfWidth(), pathX(), PondPath (+15 more)

### Community 54 - "claim.ts"
Cohesion: 0.29
Nodes (8): buildClaim(), BuiltClaim, EarnDetail, GameSource, newRunId(), now, SecretFeature, SourceId

### Community 55 - "compose-atelier.mjs"
Cohesion: 0.12
Nodes (10): body, dressLayer, dressWidth, floralWidth, hanger, MANNEQUIN_CANVAS, mask, root (+2 more)

### Community 57 - "import-hall-assets.mjs"
Cohesion: 0.10
Nodes (17): file(), DOOR, DOOR_BACKDROP, drop, FURNITURE, manifest, manifestPath, masters (+9 more)

### Community 58 - "member-route.ts"
Cohesion: 0.09
Nodes (37): GET(), GET(), GET(), GET(), PER_MEMBER, BOARDS, GET(), oneOf() (+29 more)

### Community 59 - "economy/store.ts"
Cohesion: 0.13
Nodes (29): CARRY_CAP, carryAdd(), CarryEntry, carryPrune(), carryRemove(), chunk(), ClaimRequest, tzOffsetNow() (+21 more)

### Community 60 - "FishingView.tsx"
Cohesion: 0.13
Nodes (26): CAST_ERRORS, coarsePointer(), FishingView(), initialEasyReel(), isTyping(), LOST, PondGameProps, Toast (+18 more)

### Community 61 - "room.ts"
Cohesion: 0.12
Nodes (31): fetch(), Env, admitted(), Attachment, farewell(), GHOST_MS, HELLO_TIMEOUT_MS, holdsOf() (+23 more)

### Community 62 - "minimap.ts"
Cohesion: 0.07
Nodes (35): place(), createMinimap(), draw(), drawRoom(), floors(), follow(), sketchOf(), doorPoint() (+27 more)

### Community 63 - "react"
Cohesion: 0.08
Nodes (42): NAME_ERRORS, Pending, View, BugReportSheet(), Status, GuideTalk(), fitWidth(), HelpGuide() (+34 more)

### Community 64 - "GuestBoard.tsx"
Cohesion: 0.11
Nodes (26): BoardScreen(), BoardScreenProps, ComposeScreen(), ComposeScreenProps, blankDraft(), GuestBoard(), GuestBoardProps, View (+18 more)

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

### Community 69 - "wallet/body.ts"
Cohesion: 0.22
Nodes (13): PER_MEMBER, POST(), baitIdOf(), integerOffset(), isRecord(), itemIdOf(), MAX_CLAIM_BATCH, MAX_WALLET_BODY_BYTES (+5 more)

### Community 70 - "wire.ts"
Cohesion: 0.13
Nodes (10): Entry, INTERPOLATION_DELAY_MS, PEER_TIMEOUT_MS, PeerTable, positionAt(), RemoteVisitor, Sample, look (+2 more)

### Community 71 - "npc-layer.ts"
Cohesion: 0.13
Nodes (22): HallGuide, PROJECTED, BY_ID, CAST, FRAME, IDLE, idleCel(), NPC_WALK_SPEED (+14 more)

### Community 72 - "Confirmed issues"
Cohesion: 0.11
Nodes (18): Confirmed issues, E2E-002 — Valid edge placement rejected through floating-point precision, E2E-003 — One owned prop can be placed multiple times, E2E-004 — Reload before autosave silently loses the latest placement, E2E-005 — Failed save and failed Done have no visible mobile explanation, E2E-006 — Restoring connectivity does not retry a failed draft save, E2E-007 — Keyboard activation cannot place drawer items, E2E-008 — Creating an account from My Room leaves the signed-in user on the sign-in prompt (+10 more)

### Community 73 - "epoch.ts"
Cohesion: 0.15
Nodes (21): GET(), intParam(), GET(), sketchPool, unavailable(), MuseumProps, EMPTY, firstSlice() (+13 more)

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

### Community 79 - "ref_sharp"
Cohesion: 0.11
Nodes (7): bodyTextures, COATS, { json, bin }, manifest, maps, target, manifest

### Community 80 - "createPresence"
Cohesion: 0.15
Nodes (16): createPresence(), drop(), heartbeat(), maybeSend(), onPageHide(), receive(), scheduleRetry(), send() (+8 more)

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

### Community 85 - "join-room.ts"
Cohesion: 0.27
Nodes (15): joinRoom(), Options, STANDING, emit(), isChatMuted(), isMuted(), leaveRoom(), openChat() (+7 more)

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
Nodes (28): ClosetView(), close(), onKeyDown(), shuffle(), tapMiddle(), wearAt(), LISTS, PLACE (+20 more)

### Community 93 - "stage.ts"
Cohesion: 0.05
Nodes (42): RoomArt, boundedCameraX(), FLICK, flickDirection(), isUpwardFlick(), shouldTick(), createNearby(), Nearby (+34 more)

### Community 94 - "snapshot.ts"
Cohesion: 0.19
Nodes (16): snap(), composeJpeg(), copyCanvas(), Grab, grabLayers(), Layer, loadImage(), paint() (+8 more)

### Community 95 - "pond/room.ts"
Cohesion: 0.07
Nodes (52): AtelierPage(), dynamic, metadata, Work, allowedCharacter(), OwnedSnapshot, owns(), walletReady() (+44 more)

### Community 96 - "actions.ts"
Cohesion: 0.12
Nodes (33): dynamic, back(), deleteGuestNoteAction(), discardDoorsAction(), discardLocationAction(), nudgeInRowAction(), PLACE_ERRORS, placePaintingAction() (+25 more)

### Community 104 - "createNpcLayer"
Cohesion: 0.19
Nodes (19): createNpcLayer(), createResidentView(), createView(), departedRecently(), draw(), fadeOut(), glyphWidth(), hideAll() (+11 more)

### Community 105 - "RevealCard.tsx"
Cohesion: 0.10
Nodes (20): CONFETTI_COLORS, ConfettiPiece, makeConfetti(), RevealCard(), RevealCardProps, TIER_MS, useCountUp(), CatchView (+12 more)

### Community 106 - "lib/slots/index.ts"
Cohesion: 0.19
Nodes (14): ANON_PREFIX, anonKey(), deviceKey(), isMemberSlotKey(), listKeys(), MEMBER_KEY, memberKey(), memberPrefix() (+6 more)

### Community 107 - "MirrorView.tsx"
Cohesion: 0.13
Nodes (21): onPointerUp(), trapTab(), MIRROR_SRC, MirrorView(), close(), move(), onKeyDown(), onPointerUp() (+13 more)

### Community 108 - "claim.ts"
Cohesion: 0.20
Nodes (16): OUTBOX_CAP, outboxAdd(), outboxDue(), OutboxEntry, outboxFail(), outboxRemove(), RETRY_BASE_MS, RETRY_MAX_MS (+8 more)

### Community 109 - "json"
Cohesion: 0.11
Nodes (46): POST(), PER_MEMBER, PUT(), POST(), POST(), PER_MEMBER, PUT(), PER_MEMBER (+38 more)

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

### Community 114 - "rig.ts"
Cohesion: 0.04
Nodes (77): CrowdPreviewPage(), RigPreviewPage(), CrowdPreview(), draw(), KINDS, Stats, Window, NEXT (+69 more)

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
Cohesion: 0.04
Nodes (59): Scenery, AtelierArt, disposeAtelierArt(), CUTS, disposeBoards(), Mark, ROPE_CUTS, ropeSlices() (+51 more)

### Community 119 - "Costume gallery doorway"
Cohesion: 0.50
Nodes (3): Costume gallery doorway, Curtain colour edit, Prompt

### Community 120 - "tab-turn.ts"
Cohesion: 0.16
Nodes (5): createTabTurn(), TabTurn, tab(), TurnEnv, TurnMessage

### Community 121 - "Fishing forest: painted asset pass"
Cohesion: 0.10
Nodes (18): Assets, Bruce's collection refresh (2026-11-08), Fishing forest illustrations, Made by hand (not touched by the script), Main hall v2 (2026-11-10), Monets Lily Pond (2026-11-08), 1. Forest doorway, 2. Woodland noticeboard (+10 more)

### Community 122 - "Audio"
Cohesion: 0.50
Nodes (3): Audio, Pond, personal room and MP3 player music, UI effects (`ui/`)

### Community 124 - "The Costume Atelier"
Cohesion: 0.14
Nodes (13): Adding a character, Adding a costume, Art not supplied as files, Bruce's Chronicles, Costume fit review, Fitting clothes to other characters, Floral collection, Headpieces (+5 more)

### Community 125 - "names.ts"
Cohesion: 0.16
Nodes (15): checkMessage(), INVISIBLE, MESSAGE_MAX, MessageCheck, normalizeMessage(), ADJECTIVES, NAME_LIMITS, NAME_SEEDS (+7 more)

### Community 126 - "paintings/page.tsx"
Cohesion: 0.11
Nodes (27): dateFormat, dynamic, GuestBoardPage(), HangPage(), dynamic, StudioHome(), dynamic, PaintingsPage() (+19 more)

### Community 127 - "reveal.ts"
Cohesion: 0.20
Nodes (6): PlaceInfo, InkMap, createReveal(), compose(), PENCIL, SketchReveal

### Community 128 - "sketchguess/lib/api.ts"
Cohesion: 0.23
Nodes (13): sameOriginUrl(), PreparedGame, decodeImage(), fetchBitmap(), fetchRound(), guarded(), LoadedRound, loadInk() (+5 more)

### Community 129 - "presence/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, types, exclude, extends, include, ../../tsconfig.base.json

### Community 130 - "import-landing-assets.mjs"
Cohesion: 0.13
Nodes (9): socket(), CAT, drop, EXPECTED, manifest, manifestPath, masters, root (+1 more)

### Community 131 - "tsconfig.test.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 132 - "lib/presence.ts"
Cohesion: 0.09
Nodes (21): Outcome, send(), Connect, connectWebSocket(), fetchTicket, HEARTBEAT_MS, HIDDEN_LIMIT_MS, RETRY_MS (+13 more)

### Community 133 - "writeStyle"
Cohesion: 0.12
Nodes (9): CafeMarks, CafeLink, GuestBoardNotes, Placards, toScreen(), writeStyle(), createSitting(), hop() (+1 more)

### Community 134 - "session.ts"
Cohesion: 0.19
Nodes (16): GET(), PaintingRow, POST(), UPLOADS_PER_ARTIST, POST(), UPLOADS_PER_ARTIST, dynamic, RoomPage() (+8 more)

### Community 135 - ".webSocketMessage"
Cohesion: 0.44
Nodes (3): attachmentOf(), Room, sendTo()

### Community 136 - "import-hall-assets.mjs"
Cohesion: 0.13
Nodes (11): BASEBOARD, CURTAIN, drop, EXPECTED, manifest, manifestPath, masters, root (+3 more)

### Community 137 - "Multiplayer ("other visitors") — plan v2 (Cloudflare)"
Cohesion: 0.10
Nodes (19): 0. Summary, 10. Decisions, 1. Product contract changes (approved 2026-10-31), 2. What already exists that this builds on, 3.1 Generated names (everyone has one), 3. Names, 4. Transport: Cloudflare Durable Objects, 5.1 Emotes (v1) (+11 more)

### Community 138 - "useVisitorName.ts"
Cohesion: 0.27
Nodes (8): PresencePreviewPage(), PresencePreview(), announceNameChange(), NameError, useVisitorName(), VisitorName, useSlot(), presence

### Community 139 - "room-places.ts"
Cohesion: 0.15
Nodes (18): HallLayout, NpcGround, atelierRoomInfo(), atelierX(), copy(), FurniturePlacement, hallCache, hallRoomInfo() (+10 more)

### Community 140 - "FishdexPanel.tsx"
Cohesion: 0.23
Nodes (9): JOURNAL_FAMILIES, JOURNAL_GRADES, JOURNAL_SIZE, PondDex, FishdexPanel(), FishdexPanelProps, FishJournal(), FishJournalProps (+1 more)

### Community 141 - "Open rooms and the tip jar (design, 2026-11-21)"
Cohesion: 0.22
Nodes (8): cozyWorth(), Built (2026-11-21), Decisions, How it works, Numbers (first pass, to tune), Open questions, Open rooms and the tip jar (design, 2026-11-21), Story hooks

### Community 142 - "CoinToast.tsx"
Cohesion: 0.43
Nodes (5): MuseumLayout(), setMuseumDoors(), MuseumDoors(), MuseumStage(), publishedDoors()

### Community 143 - "hang-tag.ts"
Cohesion: 0.12
Nodes (8): CARD, createHangTag(), HangTag, HangTagStyle, HOLE, KNOT, What goes, and what replaces it, Refusal

### Community 144 - "The Moonlit Pond — design"
Cohesion: 0.09
Nodes (22): Art the pond needs from the artist, Build contract (decided 2026-11-07), Build phases, Collection and goals, Done, Done, Guardrails, Leaderboards (+14 more)

### Community 145 - "Pond rework"
Cohesion: 0.18
Nodes (10): Baits, Client, Decisions, Done, Notes, Pond rework, Server, Species (+2 more)

### Community 146 - "CameraRig"
Cohesion: 0.16
Nodes (9): Loading(), AtelierLoading(), coverFloorTransition(), revealFloorTransition(), CameraRig, createRoomPassage(), fixture(), Runtime (+1 more)

### Community 147 - "Orchestration contract — you plan, DSH workers execute"
Cohesion: 0.29
Nodes (6): Briefing a worker, Budget hygiene, graphify, Orchestration contract — you plan, DSH workers execute, The worker, When not to delegate

### Community 148 - "tables.ts"
Cohesion: 0.10
Nodes (35): FrameShape, BaitTrayProps, debugSpecies(), debugVariant(), GuestRoll, GuestRollOptions, guestTreasure(), rollGuest() (+27 more)

### Community 149 - "Tiny Museum v1 · Curator Letters"
Cohesion: 0.17
Nodes (11): Letter 0 · Clean up your room, Letter 1 · Place your first decoration, Letter 2 · Visit the first gallery, Letter 3 · Play a mini-game, Letter 4 · Unlock an outfit or character, Letter 5 · Find the seasonal items, Letter 6 · Unlock the daily calendar, Letter 7 · The cliffhanger and email signup (+3 more)

### Community 150 - "useBackgroundMusic.ts"
Cohesion: 0.11
Nodes (27): BackgroundMusic, clampVolume(), isDocumentHidden(), Options, useBackgroundMusic(), VISIBILITY_EVENTS, EFFECTS, EffectSpec (+19 more)

### Community 151 - "studio/layout.tsx"
Cohesion: 0.33
Nodes (7): StudioLayout(), Badge(), Icon(), ICONS, StudioNav(), countOpenBugReports(), doorsState

### Community 152 - "SlotDef"
Cohesion: 0.14
Nodes (6): FakeServer, SlotState, serverSnapshot(), serverSnapshots, SlotDef, slotDef()

### Community 153 - "layout.ts"
Cohesion: 0.13
Nodes (14): cafeAfterIndex(), computeLayout(), clear(), placeCafe(), cutRooms(), DoorSpan, HALL_DOOR_FOOT, HallRoomKind (+6 more)

### Community 154 - "ref_node_fs"
Cohesion: 0.10
Nodes (13): acct, [out, ...steps], acct, signInTab, [, width, height], admin, childEnv, client (+5 more)

### Community 155 - "lib/slots/index.ts"
Cohesion: 0.10
Nodes (8): KeepOnOtherDevices(), Options, Probe(), StoredSlot, EventTargetLike, MemberInfo, SlotHandle, useMember

### Community 156 - "Walker"
Cohesion: 0.19
Nodes (3): FloorPoint, WalkArea, Walker

### Community 157 - "writeLocal"
Cohesion: 0.18
Nodes (19): ColorRecall(), ColorRecallProps, Phase, readBest(), ColorRound, showMs(), isBuyReply(), undoAdminUnlock() (+11 more)

### Community 158 - "query"
Cohesion: 0.07
Nodes (44): loop(), shutdown(), sleep(), sweepStale(), DrainResult, handler(), repairFrames(), main() (+36 more)

### Community 159 - "Curating the paintings (2026-11-07)"
Cohesion: 0.12
Nodes (15): hang(), 1. The registry and the table, 2. The studio's Location picker, 3. The rooms draw what is placed, 4. Credits, 5. Retiring self-serve artists, Building it, Curating the paintings (2026-11-07) (+7 more)

### Community 160 - "placements.ts"
Cohesion: 0.05
Nodes (61): cleanNow(), Catalogue, Data model (core), 1. Items placed against a zone edge fail to save, and the whole draft reverts, 2. One owned item can be placed many times, 3. Any save rejection throws away all unsaved work, 4. Changes made just before leaving are lost, 5. Fish trophies can be claimed without playing (+53 more)

### Community 161 - "AccountSheet"
Cohesion: 0.29
Nodes (9): AccountSheet(), continueAnyway(), doSignOut(), runDelete(), runName(), submit(), submitDelete(), submitName() (+1 more)

### Community 162 - "VitalsReporter.tsx"
Cohesion: 0.29
Nodes (8): firstPainting(), flush(), Metric, queue, REPORTED, VitalsReporter(), FIRST_PAINTING_MARK, MUSEUM_START_MARK

### Community 163 - "CodesSection.tsx"
Cohesion: 0.33
Nodes (8): createCodeAction(), deleteCodeAction(), CodeRow, CodesSection(), create(), remove(), ensureQrToken(), revokeQrToken()

### Community 164 - "getStorage"
Cohesion: 0.07
Nodes (27): CONTENT_TYPES, GET(), PUT(), snapshot(), Checked against the mocks (2026-11-07), addPondPhoto(), AddPondPhotoResult, isJpeg() (+19 more)

### Community 165 - "Your Room: a room you can freely furnish"
Cohesion: 0.22
Nodes (8): Admin mode (gamma), Decisions (2026-11-17, with the user), Room look (web, `features/rooms/themes/cozy.ts`, `features/rooms/personal/room.ts`), Scale, Testing locally, What other games do (research, 2026-11-17), Work plan, Your Room: a room you can freely furnish

### Community 166 - "editor.ts"
Cohesion: 0.28
Nodes (10): roomEditor, PER_EDITOR, PUT(), versionOf(), PER_MEMBER, POST(), PER_EDITOR, POST() (+2 more)

### Community 167 - "createPlacementLayer"
Cohesion: 0.13
Nodes (18): aspectOf(), createPlacementLayer(), applyGlow(), drawOutline(), dropGhosts(), dropHelper(), extrasFor(), silhouette() (+10 more)

### Community 168 - "wander.test.ts"
Cohesion: 0.16
Nodes (11): Job, Place, WalkState, BASE_JOB, context(), L_GROUND, mulberry32(), room() (+3 more)

### Community 169 - "audience.ts"
Cohesion: 0.08
Nodes (29): ArtistPage(), dynamic, generateMetadata(), GET(), ConfirmFollow(), dynamic, dynamic, Unsubscribe() (+21 more)

### Community 170 - "Low"
Cohesion: 0.15
Nodes (13): 13. Pages that redirect or don't exist answer 200, 14. Error codes reveal which room slugs exist, 15. The name sign slides under the top-right buttons in Decorate, 16. Level-up celebrations can be farmed, 17. No hint of where things are after panning away, 18. Too many items is only discovered by the server, 19. Development-only: page payloads include the full room row, Checked and fine (+5 more)

### Community 171 - "Atelier: the dressing mirror, and show-don't-tell keeping"
Cohesion: 0.13
Nodes (14): Atelier: the dressing mirror, and show-don't-tell keeping, Build order, Built (2026-11-20), Decisions (2026-11-19), Follow-ups (2026-11-20), Goal, In the room, Keeping (+6 more)

### Community 172 - "domain/guestboard.ts"
Cohesion: 0.08
Nodes (36): POST(), GET(), POST(), rateLimitedResponse(), rejectedResponse(), MAX_BUG_CONTACT, MAX_BUG_ERRORS, MAX_BUG_MESSAGE (+28 more)

### Community 173 - "admin/route.ts"
Cohesion: 0.43
Nodes (4): PER_MEMBER, PER_MEMBER, ADMIN_MODE, ADMIN_STAMPS

### Community 175 - "ref_node_assert"
Cohesion: 0.12
Nodes (30): defineSlot(), docBytes(), SLOTS, byAtThenKey(), encoded(), latest, mapOf(), maxNumber() (+22 more)

### Community 177 - "visits.ts"
Cohesion: 0.07
Nodes (42): state(), dynamic, format(), grade(), METRICS, PAGES, PerformancePage(), RANGES (+34 more)

### Community 179 - "protocol.ts"
Cohesion: 0.25
Nodes (15): isItem(), isName(), isPid(), isSeq(), MAX_HOLDS, MAX_INSTANCE, MAX_MESSAGE_BYTES, parseClientMessage() (+7 more)

### Community 180 - "Local end-to-end stress test — 2026-11-06"
Cohesion: 0.22
Nodes (7): Environment and coverage, Follow-up coverage, Issue index, Local end-to-end stress test — 2026-11-06, Measured load, Passing checks and interpretation limits, Test data and cleanup

### Community 181 - "LandingFx"
Cohesion: 0.06
Nodes (36): between(), CAT, Edge, EDGES, runLandingCat(), choosePeeker(), peek(), walk() (+28 more)

### Community 182 - "schedule.test.ts"
Cohesion: 0.08
Nodes (25): RESIDENT_IDS, FloorSpot, JOBS, PlaceKind, ROOM_KINDS, ROOMS, PlaceInput, NpcRoom (+17 more)

### Community 183 - "Storyline (draft, saved 2026-11-17)"
Cohesion: 0.15
Nodes (12): Arc (soft, no fail state), Built so far, How it ties to what exists, Locked (2026-11-21, the owner), Next tasks (when picked up), Open questions, Premise, Revision (2026-11-21, the owner) (+4 more)

### Community 184 - "backdrop.ts"
Cohesion: 0.11
Nodes (20): shape(), createHallAmbience(), finish(), glowTexture(), HallAmbience, mulberry(), painted(), vignetteTexture() (+12 more)

### Community 185 - "bake-pond-path.mjs"
Cohesion: 0.21
Nodes (7): blank(), manifest, manifestPath, ORIGINAL_SOURCE, originalPath(), root, softened()

### Community 187 - "pond/room.ts"
Cohesion: 0.11
Nodes (23): createPondRoom(), approach(), busy(), finishWalk(), goTo(), leave(), move(), nearest() (+15 more)

### Community 190 - "createPixelRatioGovernor"
Cohesion: 0.33
Nodes (7): createPixelRatioGovernor(), reset(), stepTo(), PIXEL_RATIO_STEPS, pixelRatioSteps(), Renderer, governor()

### Community 191 - "SyncStore"
Cohesion: 0.17
Nodes (6): encodeStored(), parseStored(), readStored(), writeStored(), SyncStore, upgrade()

### Community 192 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, db:schema, deploy:backend, dev, dev:presence, dev:web, dev:worker (+6 more)

### Community 193 - "Monets Lily Pond: exploration, UX and multiplayer QA"
Cohesion: 0.29
Nodes (6): Browser and interaction coverage, Changes made from the walkthrough, Monets Lily Pond: exploration, UX and multiplayer QA, Multiplayer and load, Practical limits, Regression checks and cleanup

### Community 194 - "opening.ts"
Cohesion: 0.43
Nodes (5): COLD_DOOR_HOLD_MS, hallIsReady(), Opening, OPENING_MAX_WAIT_MS, at()

### Community 196 - "SketchGuess"
Cohesion: 0.33
Nodes (5): ShareOutcome, shareResult(), ShareSummary, shareText(), base

### Community 197 - "catalog.ts"
Cohesion: 0.12
Nodes (23): CatalogItem, CatalogKind, FREE_CHARACTERS, isCatalogItem(), ITEMS, ItemSlot, expected, slots (+15 more)

### Community 198 - "pond-state.ts"
Cohesion: 0.09
Nodes (30): BaitTray(), GLYPHS, PearlIcon(), POND_CRIMSON, PondIcon(), PondIconName, PondStateView, PondTier (+22 more)

### Community 200 - "personal/room.ts"
Cohesion: 0.04
Nodes (34): Job, finishJob(), later(), centerYFor(), reportQuestEvent(), createDecorController(), canvasRect(), targetRise() (+26 more)

### Community 202 - "atelier.ts"
Cohesion: 0.06
Nodes (49): aspectOf(), AtelierActions, AtelierDoor, AtelierImage, BuiltRoom, Cardigan, CARDIGAN_NAMES, Control (+41 more)

### Community 207 - "query"
Cohesion: 0.08
Nodes (50): Code, 3.2 Chosen names (members), registry, started(), CatchExtra, clearCatches(), COLUMNS, grantPearls() (+42 more)

### Community 209 - "next"
Cohesion: 0.07
Nodes (35): bethEllen, inspiratiq, metadata, notoSans, RootLayout(), sniglet, viewport, AccountHost() (+27 more)

### Community 210 - "plan.ts"
Cohesion: 0.39
Nodes (6): openingPlan(), prepareSketchGame(), planGame(), randomRound(), ROUND_SPREAD, shuffle()

### Community 211 - "createHallRoom"
Cohesion: 0.15
Nodes (22): earn(), emit(), emitEarned(), maybeInvite(), writeSession(), createHallRoom(), buildRoomContents(), cafeRoom() (+14 more)

### Community 212 - "bugs/page.tsx"
Cohesion: 0.38
Nodes (6): BugReportsPage(), dateFormat, dynamic, summary(), BugContext, listBugReports()

### Community 213 - "Other visitors"
Cohesion: 0.29
Nodes (6): How it plays, Other visitors, Privacy, Running it in production, Running it locally, Staying consistent

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

- **Why does `react` connect `react` to `SketchGuess.tsx`, `src/rooms/doors.ts`, `pond-api.ts`, `useVisitorName.ts`, `Walkthrough.tsx`, `FishdexPanel.tsx`, `Test Fakes and Helpers`, `logic.ts`, `room-events.ts`, `AtelierKeeps.tsx`, `CameraRig`, `progress.ts`, `useBackgroundMusic.ts`, `SlotDef`, `lib/slots/index.ts`, `next`, `writeLocal`, `Web Package Dependencies`, `DecorDrawer.tsx`, `risk.ts`, `CodesSection.tsx`, `VitalsReporter.tsx`, `pond-api.ts`, `(hall)/page.tsx`, `defaultStore`, `AtelierKeeps.tsx`, `Water.tsx`, `LandingFx`, `FishingView.tsx`, `GuestBoard.tsx`, `pond-state.ts`, `next`, `ClosetView.tsx`, `pond/room.ts`, `actions.ts`, `RevealCard.tsx`, `MirrorView.tsx`, `rig.ts`, `paintings/page.tsx`?**
  _High betweenness centrality (0.082) - this node is a cross-community bridge._
- **What connects `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json` to the rest of the system?**
  _5 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `rooms/types.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.052244897959183675 - nodes in this community are weakly interconnected._
- **Why does `three` connect `three` to `rooms/types.ts`, `assetUrl`, `scene/assets.ts`, `scene.ts`, `cozy.ts`, `hang-tag.ts`, `prepare-models.mjs`, `ambience.ts`, `Web Package Dependencies`, `backdrop.ts`, `pond/room.ts`, `npc-layer.ts`, `personal/room.ts`, `atelier.ts`, `join-room.ts`, `stage.ts`, `pond/room.ts`, `MirrorView.tsx`, `rig.ts`, `hall/room.ts`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Should `Traversal` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._
- **Why does `defaultStore()` connect `defaultStore` to `pond-api.ts`, `useVisitorName.ts`, `logic.ts`, `progress.ts`, `SlotDef`, `lib/slots/index.ts`, `writeLocal`, `pond/room.ts`, `economy/store.ts`, `SyncStore`, `pond-state.ts`, `createHallRoom`, `join-room.ts`, `stage.ts`, `pond/room.ts`, `lib/slots/index.ts`, `pondgame/lib/api.ts`, `rig.ts`, `hall/room.ts`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Should `SketchGuess.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14333333333333334 - nodes in this community are weakly interconnected._