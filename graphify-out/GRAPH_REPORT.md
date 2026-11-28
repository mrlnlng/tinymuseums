# Graph Report - tiny-museum  (2026-11-27)

## Corpus Check
- 605 files · ~369,780 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 110 file(s) not represented in the graph (top: .avif 60, .glb 38, .css 7)

## Summary
- 5404 nodes · 14235 edges · 210 communities (184 shown, 26 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 278 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5d5ab25c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- features/economy/index.ts
- Traversal
- SketchGuess.tsx
- DoorEditor.tsx
- pond/art.ts
- round.ts
- floor.ts
- Core Asset Manifest
- scene/assets.ts
- currentMember
- machine.ts
- PersonalRoom.tsx
- Test Fakes and Helpers
- scene.ts
- cozy.ts
- logic.ts
- join-room.ts
- schedule.ts
- lib/slots/index.ts
- amplify/package.json
- lib/assets.ts
- prepare-models.mjs
- progress.ts
- core/package.json
- hitForVisitor
- handlers.ts
- memberFromRequest
- env.ts
- ambience.ts
- core/src/index.ts
- Web Package Dependencies
- Gamifying Tiny Museum — genre direction & engagement research
- Item
- logic.ts
- risk.ts
- amplify/tsconfig.json
- 5. Customization menu — what other people are doing
- rooms.ts
- DecorController
- Web TSConfig
- Root Package Manifest
- pond-format.ts
- hall/room.ts
- (hall)/page.tsx
- Base TSConfig
- Amplify Build Spec
- rooms/types.ts
- LetterMailbox.tsx
- DecorController
- import-fishing-assets.mjs
- Water.tsx
- Worker Package Manifest
- Public Asset Manifest
- rooms/art.ts
- features/economy/index.ts
- compose-atelier.mjs
- AtelierRoom
- import-hall-assets.mjs
- pond-boards.ts
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
- placeLabel
- Confirmed issues
- hit.ts
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
- admin/route.ts
- Bug Reports SQL Schema
- Vitals SQL Schema
- createMinimap
- snapshot.ts
- pond/room.ts
- actions.ts
- Run-Once Schema
- pond/room.ts
- FishingView.tsx
- atelier/room.ts
- ClosetView.tsx
- npc-layer.ts
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
- epoch.ts
- Fishing forest: painted asset pass
- Audio
- .claude/CLAUDE.md
- The Costume Atelier
- messages.ts
- createPlacementLayer
- flick.ts
- sketchguess/lib/api.ts
- presence/tsconfig.json
- rules.ts
- tsconfig.test.json
- lib/presence.ts
- Your Room: a room you can freely furnish
- dependencies
- .webSocketMessage
- cat.ts
- Multiplayer ("other visitors") — plan v2 (Cloudflare)
- Conn
- room-places.ts
- bug-reports.ts
- museum/layout.tsx
- opening.ts
- scripts
- The Moonlit Pond — design
- Pond rework
- createStage
- Orchestration contract — you plan, DSH workers execute
- tables.ts
- Tiny Museum v1 · Curator Letters
- useBackgroundMusic.ts
- FilesystemStorage
- SlotDef
- Other visitors
- run.ts
- three
- Walker
- ArtCache
- Personal room: stress-test issues
- Curating the paintings (2026-11-07)
- placements.ts
- Cafe
- Sitting
- import-home-assets.mjs
- db.ts
- Lobby
- mutation-guard.ts
- wander.test.ts
- outbox.test.ts
- Low
- Atelier: the dressing mirror, and show-don't-tell keeping
- confirm/page.tsx
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
- createPondRoom
- draw.py
- createPixelRatioGovernor
- SyncStore
- scripts
- Monets Lily Pond: exploration, UX and multiplayer QA
- exports
- RevealCard.tsx
- personal/room.ts
- names.ts
- atelier.ts
- npcs/README.md
- nearby.ts
- query
- app/layout.tsx
- player-card.ts
- petals.ts
- npc-sheet.cjs
- doors.sql
- editor.ts
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

## Communities (210 total, 26 thin omitted)

### Community 0 - "features/economy/index.ts"
Cohesion: 0.10
Nodes (26): openAccount(), openAccountCreation(), CoinToast(), Toast, Purse(), Stamp(), useWallet(), STAMP_ASPECT (+18 more)

### Community 1 - "Traversal"
Cohesion: 0.08
Nodes (11): JumpPose, clamp(), fixture(), jump(), Traversal, MAX_CATCH_UP_SECONDS, MAX_STEP_SECONDS, movementSteps() (+3 more)

### Community 2 - "SketchGuess.tsx"
Cohesion: 0.07
Nodes (44): BunnyArtist(), BunnyMood, Pencil(), POSES, bestKeyFor(), BURST, clueUrl(), openingPlan() (+36 more)

### Community 3 - "DoorEditor.tsx"
Cohesion: 0.06
Nodes (63): DoorsPage(), dynamic, hallPaintings(), hallDoorSpan(), doorArtUrl(), loadDoorArt(), loadRoomDoorArt(), pending (+55 more)

### Community 4 - "pond/art.ts"
Cohesion: 0.13
Nodes (24): ArtByRoom, colorAt(), decoded(), disposePondArt(), EDGE_BAND, EDGE_BANDS, EDGE_OVERLAP, edgeTexture() (+16 more)

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
Nodes (47): sameOriginUrl(), AssetManifest, assetUrl(), bitmapTexture(), blankImage(), CAFE_CAT_FRAMES, CharacterSprites, CompressedLoader (+39 more)

### Community 9 - "currentMember"
Cohesion: 0.09
Nodes (34): GET(), BOARDS, GET(), oneOf(), PER_VISITOR, PERIODS, GET(), readCapped() (+26 more)

### Community 10 - "machine.ts"
Cohesion: 0.12
Nodes (34): CastMeter(), ReelMeter(), armCast(), BITE_WINDOW, biteGap(), CHARGE_PERIOD, chargePower(), createReelState() (+26 more)

### Community 11 - "PersonalRoom.tsx"
Cohesion: 0.04
Nodes (60): config, SECURITY_HEADERS, Loading(), Loading(), metadata, PondPage(), CHANGE_SOUND, AtelierLoading() (+52 more)

### Community 12 - "Test Fakes and Helpers"
Cohesion: 0.12
Nodes (27): deferredFetch(), deviceSlot, FakeEvents, FakeStorage, fixture, fixtureB, fixtureRegistry, fixtureRegistryBoth (+19 more)

### Community 13 - "scene.ts"
Cohesion: 0.05
Nodes (29): MuseumProps, disposeDisplayTexture(), prefersAvif(), HiddenCoin, createNotes(), createPedestal(), Pedestal, PedestalVoice (+21 more)

### Community 14 - "cozy.ts"
Cohesion: 0.07
Nodes (45): alphaCanvas(), ATELIER_PROPS, AtelierImage, atticWindowCanvas(), bareBulbCanvas(), boardsCanvas(), canvasTexture(), ceilingTexture() (+37 more)

### Community 15 - "logic.ts"
Cohesion: 0.10
Nodes (42): errorReason(), overDrawer(), PersonalRoom(), canPlaceNew(), carriedTo(), carryEnd(), carryMove(), finishJob() (+34 more)

### Community 16 - "join-room.ts"
Cohesion: 0.05
Nodes (67): ChatButton(), REFUSED, appendChatMessage(), CHAT_HISTORY_LIMIT, CHAT_HISTORY_WINDOW_MS, chatHistoryKey(), ChatMessage, ChatStorage (+59 more)

### Community 17 - "schedule.ts"
Cohesion: 0.07
Nodes (55): addDwellEmotes(), addEmote(), addGap(), addStand(), addWalk(), along(), buildRoomTable(), buildStayPlan() (+47 more)

### Community 18 - "lib/slots/index.ts"
Cohesion: 0.07
Nodes (24): PresencePreviewPage(), AccountSheet(), continueAnyway(), doSignOut(), runDelete(), runName(), submit(), submitDelete() (+16 more)

### Community 19 - "amplify/package.json"
Cohesion: 0.08
Nodes (26): amplifyDir, backend, everyMinutes, mediaBucket, missing, repoRoot, REQUIRED, setting() (+18 more)

### Community 20 - "lib/assets.ts"
Cohesion: 0.10
Nodes (25): BACKDROP_STYLE, MoreArrow(), NavArrow(), Props, SLIDE, Walkthrough(), XIcon(), decodedFrames (+17 more)

### Community 21 - "prepare-models.mjs"
Cohesion: 0.06
Nodes (41): paintedCostume(), alongArm(), ARMS, armTurn(), BODIES, bruce, BRUCE_FIT, BRUCE_PLACE (+33 more)

### Community 22 - "progress.ts"
Cohesion: 0.17
Nodes (28): isLetterId(), letterById(), cache, conditionCount(), conditionMet(), COUNTED, currentLetter(), emptyProgress() (+20 more)

### Community 23 - "core/package.json"
Cohesion: 0.16
Nodes (13): devDependencies, @types/bcryptjs@^2.4.6, @types/pg@^8.11.10, main, name, private, scripts, typecheck (+5 more)

### Community 24 - "hitForVisitor"
Cohesion: 0.12
Nodes (30): ALLOWED, PER_VISITOR, POST(), POST(), GLOBAL, PER_IP, POST(), POST() (+22 more)

### Community 25 - "handlers.ts"
Cohesion: 0.06
Nodes (56): loop(), sleep(), sweepStale(), DrainResult, handler(), repairFrames(), BRAND, AnalyticsSummary (+48 more)

### Community 26 - "memberFromRequest"
Cohesion: 0.48
Nodes (5): GET(), GET(), memberFromRequest(), readSlots(), exportWallet()

### Community 27 - "env.ts"
Cohesion: 0.43
Nodes (5): isProduction(), presenceSecret(), required(), sessionSecret(), setting()

### Community 28 - "ambience.ts"
Cohesion: 0.12
Nodes (29): blade(), bloom(), BLOOMS, createPondAmbience(), update(), fishTexture(), frond(), FRONT_ROWS (+21 more)

### Community 29 - "core/src/index.ts"
Cohesion: 0.04
Nodes (134): GET(), insertCatch(), hangPiece(), movePiece(), unhangPiece(), addBait(), baitOf(), bountyCatches() (+126 more)

### Community 30 - "Web Package Dependencies"
Cohesion: 0.10
Nodes (27): dependencies, embla-carousel-react@^8.6.0, motion@^13.1.1, next@^15.0.3, react@^19.0.0, react-dom@^19.0.0, swr@^2.5.1, three@^0.169.0 (+19 more)

### Community 31 - "Gamifying Tiny Museum — genre direction & engagement research"
Cohesion: 0.10
Nodes (19): 0.1 The core experience, 0.2 Systems that make gamification cheap to build, 0.3 Constraints that shape any recommendation, 0. What the game is today (the deep dive), 1.1 The landscape (seven candidates, with verdicts), 1.2 Recommendation: a **cozy gallery life-sim** — "the gallery you live in", 1.3 The five design pillars the genre implies, 1. Genre direction (+11 more)

### Community 32 - "Item"
Cohesion: 0.14
Nodes (3): Room, Presence, Item

### Community 33 - "logic.ts"
Cohesion: 0.07
Nodes (45): loadHallArranger(), DecorDrawer, DecorDrawerProps, SLOT_LABELS, Tab, TABS, HallArranger(), HallArrangerProps (+37 more)

### Community 34 - "risk.ts"
Cohesion: 0.12
Nodes (30): HudWagerChip, WagerPicker(), chooseTier(), stepStake(), WagerPickerProps, CastOptions, PondStateView, PondWagerView (+22 more)

### Community 35 - "amplify/tsconfig.json"
Cohesion: 0.20
Nodes (9): compilerOptions, module, moduleResolution, noUnusedLocals, noUnusedParameters, exclude, extends, include (+1 more)

### Community 36 - "5. Customization menu — what other people are doing"
Cohesion: 0.12
Nodes (16): 1. The target: what "Claude Opus 5.5" actually means, 2. Where your harness stands today (live config I read), 3. The honest gap model, 4. Quality levers, ranked by leverage, 5. Customization menu — what other people are doing, 6. Recommended starting kit for *your* profile, 7. What I can apply for you right now (needs your go-ahead), A. Prompt & persona (most common quality customizations) (+8 more)

### Community 37 - "rooms.ts"
Cohesion: 0.10
Nodes (47): publishAllAction(), publishLocationAction(), artist(), member(), piece(), randomId(), sealEpoch(), discardLocation() (+39 more)

### Community 39 - "Web TSConfig"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 40 - "Root Package Manifest"
Cohesion: 0.10
Nodes (22): [, width, height], description, devDependencies, concurrently@^9.1.0, esbuild@^0.24.0, ktx2-encoder@^0.6.0, maxrects-packer@^2.7.3, playwright@^1.63.0 (+14 more)

### Community 41 - "pond-format.ts"
Cohesion: 0.04
Nodes (118): refreshWalletNow(), Hud(), HudProps, keep(), GLYPHS, PearlIcon(), POND_CRIMSON, PondIcon() (+110 more)

### Community 42 - "hall/room.ts"
Cohesion: 0.05
Nodes (59): Assets, Scenery, CUTS, disposeBoards(), Mark, plane(), ROPE_CUTS, ropeSlices() (+51 more)

### Community 43 - "(hall)/page.tsx"
Cohesion: 0.17
Nodes (17): Loading(), dynamic, Hall(), MuseumPage(), [BRAND_OWNER, ...BRAND_REST], CurrentlyShowing(), Decor(), dynamic (+9 more)

### Community 44 - "Base TSConfig"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, lib, module, moduleResolution (+9 more)

### Community 45 - "Amplify Build Spec"
Cohesion: 0.12
Nodes (16): applications, appRoot, backend, frontend, baseDirectory, files, phases, commands (+8 more)

### Community 46 - "rooms/types.ts"
Cohesion: 0.03
Nodes (50): coverFloorTransition(), CameraRig, Viewport, createRoomPassage(), fixture(), Options, Pose, VisitorScenery (+42 more)

### Community 47 - "LetterMailbox.tsx"
Cohesion: 0.13
Nodes (23): latestLetter(), LetterMailbox(), open(), openNext(), LetterMailboxProps, QuestLine(), SERVER_PROGRESS, openCuratorLetter() (+15 more)

### Community 48 - "DecorController"
Cohesion: 0.07
Nodes (9): Carry, PersonalRoomProps, CozyBackdrop, GhostOptions, PlacementLayer, PlacementTheme, The closet: where every room starts (2026-11-17), Phase 5: themes, zones and arrangements (+1 more)

### Community 49 - "import-fishing-assets.mjs"
Cohesion: 0.10
Nodes (12): CANVAS, clear, FONT, FRAME, heights, layout, lossless, manifest (+4 more)

### Community 50 - "Water.tsx"
Cohesion: 0.07
Nodes (39): AmbientShadow, box(), BUCKET, bunnyBox(), easeOut(), Glint, LEFT_STYLE, lineColour() (+31 more)

### Community 51 - "Worker Package Manifest"
Cohesion: 0.14
Nodes (14): dependencies, @tiny/core@*, exports, ./lambda, @tiny/core, main, name, private (+6 more)

### Community 52 - "Public Asset Manifest"
Cohesion: 0.12
Nodes (15): artworks, bunny, size, floor, size, fonts, icon-no-photos, size (+7 more)

### Community 53 - "rooms/art.ts"
Cohesion: 0.08
Nodes (26): AtelierArt, disposeAtelierArt(), INSET_DOOR_Z, loadGalleryDoor(), loadGalleryPillar(), loadGalleryPillow(), loadImage(), pending (+18 more)

### Community 54 - "features/economy/index.ts"
Cohesion: 0.18
Nodes (16): serverSnapshot, useEarnEvents(), buildClaim(), BuiltClaim, EarnDetail, EarnSource, GameSource, newRunId() (+8 more)

### Community 55 - "compose-atelier.mjs"
Cohesion: 0.12
Nodes (10): body, dressLayer, dressWidth, floralWidth, hanger, MANNEQUIN_CANVAS, mask, root (+2 more)

### Community 56 - "AtelierRoom"
Cohesion: 0.06
Nodes (7): Props, Props, AtelierRoom, ClothingItem, CharacterKind, Wardrobe, AtelierHooks

### Community 57 - "import-hall-assets.mjs"
Cohesion: 0.09
Nodes (17): BASEBOARD, CURTAIN, drop, EXPECTED, file(), manifest, manifestPath, masters (+9 more)

### Community 58 - "pond-boards.ts"
Cohesion: 0.12
Nodes (26): compare(), DexRow, displayName(), FeedRow, getPondDex(), getPondFeed(), getPondLeaderboard(), NameRow (+18 more)

### Community 59 - "economy/store.ts"
Cohesion: 0.10
Nodes (48): carryPrune(), tzOffsetNow(), outboxDue(), buy(), cappedTracked, claimCarryOver(), earn(), emit() (+40 more)

### Community 60 - "FishingView.tsx"
Cohesion: 0.14
Nodes (25): CAST_ERRORS, coarsePointer(), FishingView(), initialEasyReel(), isTyping(), LOST, Toast, vibrate() (+17 more)

### Community 61 - "room.ts"
Cohesion: 0.14
Nodes (29): admitted(), Attachment, farewell(), GHOST_MS, HELLO_TIMEOUT_MS, holdsOf(), homeOf(), MAX_WAITING_PER_IP (+21 more)

### Community 62 - "minimap.ts"
Cohesion: 0.09
Nodes (26): follow(), doorPoint(), FALLBACK_TINT, FloorSketch, ICONS, MAP_PLACES, MAP_SCALE, MapPlace (+18 more)

### Community 63 - "react"
Cohesion: 0.06
Nodes (56): AccountHost(), AccountSheet, NAME_ERRORS, Pending, View, AccountMode, onOpenAccount(), BugReportHost() (+48 more)

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

### Community 69 - "wallet/body.ts"
Cohesion: 0.20
Nodes (15): baitIdOf(), integerOffset(), isRecord(), itemIdOf(), MAX_CLAIM_BATCH, MAX_WALLET_BODY_BYTES, ParsedWalletClaim, parseWalletClaim() (+7 more)

### Community 70 - "wire.ts"
Cohesion: 0.14
Nodes (7): INTERPOLATION_DELAY_MS, PEER_TIMEOUT_MS, PeerTable, positionAt(), Sample, look, Peer

### Community 71 - "placeLabel"
Cohesion: 0.15
Nodes (6): GiftShopSigns, GuestBoardNotes, Placards, placeLabel(), toScreen(), writeStyle()

### Community 72 - "Confirmed issues"
Cohesion: 0.11
Nodes (18): Confirmed issues, E2E-002 — Valid edge placement rejected through floating-point precision, E2E-003 — One owned prop can be placed multiple times, E2E-004 — Reload before autosave silently loses the latest placement, E2E-005 — Failed save and failed Done have no visible mobile explanation, E2E-006 — Restoring connectivity does not retry a failed draft save, E2E-007 — Keyboard activation cannot place drawer items, E2E-008 — Creating an account from My Room leaves the signed-in user on the sign-in prompt (+10 more)

### Community 73 - "hit.ts"
Cohesion: 0.17
Nodes (12): CoinWall, createHiddenCoin(), Spot, AlphaMap, alphaMapFor(), alphaMaps, buildAlphaMap(), isPaintedAt() (+4 more)

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
Cohesion: 0.19
Nodes (13): createPresence(), drop(), heartbeat(), maybeSend(), onPageHide(), receive(), scheduleRetry(), send() (+5 more)

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
Cohesion: 0.29
Nodes (16): aspectOf(), createAtelierRoom(), buildCollection(), form(), buildEntrance(), buildMirror(), buildRoom(), buildWardrobe() (+8 more)

### Community 86 - "Asset pipeline: fast loading without losing sharpness"
Cohesion: 0.22
Nodes (8): Asset pipeline: fast loading without losing sharpness, Character rigs and the Costume Atelier, Completed, Ground rules, Phase 1: fingerprinted files at 2x and 3x, Phase 2: texture atlases for the hall sprites, Phase 3: KTX2 (Basis Universal), built and switched off, Phase 4: ThumbHash placeholders for paintings

### Community 87 - "Guest Board SQL Schema"
Cohesion: 0.67
Nodes (3): guest_notes, guest_notes_visible, rate_limits

### Community 88 - "Landscape Frame Asset"
Cohesion: 0.67
Nodes (3): frameLandscape, size, window

### Community 89 - "admin/route.ts"
Cohesion: 0.31
Nodes (8): PER_MEMBER, ADMIN_MODE, ADMIN_STAMPS, buy(), lockWallet(), undoAdminUnlock(), unlockEverything(), walletOf()

### Community 93 - "createMinimap"
Cohesion: 0.31
Nodes (9): place(), createMinimap(), draw(), drawRoom(), floors(), sketchOf(), readCollapsed(), svg() (+1 more)

### Community 94 - "snapshot.ts"
Cohesion: 0.23
Nodes (15): snap(), composeJpeg(), copyCanvas(), grabLayers(), Layer, loadImage(), paint(), px() (+7 more)

### Community 95 - "pond/room.ts"
Cohesion: 0.09
Nodes (35): SPECIES, water, depthAtLift(), FAR_LIFT, FAR_SCALE, liftAt(), pathHalfWidth(), pathX() (+27 more)

### Community 96 - "actions.ts"
Cohesion: 0.05
Nodes (88): AnalyticsPage(), dynamic, BugReportsPage(), dateFormat, dynamic, summary(), dateFormat, dynamic (+80 more)

### Community 104 - "pond/room.ts"
Cohesion: 0.09
Nodes (29): allowedCharacter(), OwnedSnapshot, owns(), Look, HEADPIECES, OUTFITS, positionOf(), KeepStamp (+21 more)

### Community 105 - "FishingView.tsx"
Cohesion: 0.11
Nodes (17): CONFETTI_COLORS, ConfettiPiece, makeConfetti(), RevealCard(), TIER_MS, useCountUp(), LostReason, chainOffer (+9 more)

### Community 106 - "atelier/room.ts"
Cohesion: 0.09
Nodes (33): AtelierPage(), dynamic, metadata, walletReady(), getWalletSnapshot(), subscribeWallet(), Atelier(), leave() (+25 more)

### Community 107 - "ClosetView.tsx"
Cohesion: 0.07
Nodes (35): ColorRecall(), ColorRecallProps, Phase, readBest(), ColorRound, showMs(), pictureOf(), ClosetView() (+27 more)

### Community 108 - "npc-layer.ts"
Cohesion: 0.09
Nodes (43): HallGuide, PROJECTED, BY_ID, CAST, castMember(), FRAME, IDLE, idleCel() (+35 more)

### Community 109 - "json"
Cohesion: 0.10
Nodes (54): POST(), PER_MEMBER, PUT(), POST(), GLOBAL, PER_IP, POST(), POST() (+46 more)

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

### Community 118 - "catalog.ts"
Cohesion: 0.15
Nodes (19): cleanNow(), confirmClean(), tidyWithBroom(), CatalogItem, CatalogKind, FREE_CHARACTERS, isBuyable(), ITEMS (+11 more)

### Community 119 - "Costume gallery doorway"
Cohesion: 0.50
Nodes (3): Costume gallery doorway, Curtain colour edit, Prompt

### Community 120 - "epoch.ts"
Cohesion: 0.05
Nodes (60): ArtistPage(), dynamic, generateMetadata(), GET(), GET(), intParam(), GET(), sketchPool (+52 more)

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

### Community 126 - "createPlacementLayer"
Cohesion: 0.31
Nodes (8): aspectOf(), createPlacementLayer(), drawOutline(), dropGhosts(), dropHelper(), extrasFor(), silhouette(), sizeOf()

### Community 127 - "flick.ts"
Cohesion: 0.53
Nodes (4): FLICK, flickDirection(), isUpwardFlick(), handlePointerUp()

### Community 128 - "sketchguess/lib/api.ts"
Cohesion: 0.16
Nodes (13): PlaceInfo, decodeImage(), fetchBitmap(), fetchRound(), guarded(), InkMap, loadInk(), loadRound() (+5 more)

### Community 129 - "presence/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, types, exclude, extends, include, ../../tsconfig.base.json

### Community 130 - "rules.ts"
Cohesion: 0.15
Nodes (18): localDay(), at(), EXCHANGE_DAILY_STAMPS, EXCHANGE_PEARLS_PER_STAMP, exchangeClaimKey(), GAME_DAILY_CAP, GameId, GAMES (+10 more)

### Community 131 - "tsconfig.test.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 132 - "lib/presence.ts"
Cohesion: 0.09
Nodes (21): Entry, Connect, fetchTicket, HEARTBEAT_MS, HIDDEN_LIMIT_MS, RETRY_MS, sameLook(), samePose() (+13 more)

### Community 133 - "Your Room: a room you can freely furnish"
Cohesion: 0.22
Nodes (8): Admin mode (gamma), Decisions (2026-11-17, with the user), Room look (web, `features/rooms/themes/cozy.ts`, `features/rooms/personal/room.ts`), Scale, Testing locally, What other games do (research, 2026-11-17), Work plan, Your Room: a room you can freely furnish

### Community 134 - "dependencies"
Cohesion: 0.15
Nodes (13): dependencies, @aws-sdk/client-s3@^3.1121.0, @aws-sdk/s3-request-presigner@^3.1121.0, bcryptjs@^2.4.3, obscenity@^0.4.6, sharp@^0.33.5, thumbhash@^0.1.1, sharp (+5 more)

### Community 135 - ".webSocketMessage"
Cohesion: 0.44
Nodes (3): attachmentOf(), Room, sendTo()

### Community 136 - "cat.ts"
Cohesion: 0.32
Nodes (7): between(), CAT, Edge, EDGES, runLandingCat(), choosePeeker(), peek()

### Community 137 - "Multiplayer ("other visitors") — plan v2 (Cloudflare)"
Cohesion: 0.10
Nodes (20): 0. Summary, 10. Decisions, 1. Product contract changes (approved 2026-10-31), 2. What already exists that this builds on, 3.1 Generated names (everyone has one), 3. Names, 4. Transport: Cloudflare Durable Objects, 5.1 Emotes (v1) (+12 more)

### Community 138 - "Conn"
Cohesion: 0.31
Nodes (4): connectWebSocket(), SocketHandlers, Conn, message()

### Community 139 - "room-places.ts"
Cohesion: 0.22
Nodes (16): HallLayout, atelierRoomInfo(), atelierX(), copy(), FurniturePlacement, hallCache, hallRoomInfo(), onGround() (+8 more)

### Community 140 - "bug-reports.ts"
Cohesion: 0.07
Nodes (42): POST(), GET(), POST(), StickyNoteProps, rateLimitedResponse(), rejectedResponse(), MAX_BUG_CONTACT, MAX_BUG_ERRORS (+34 more)

### Community 141 - "museum/layout.tsx"
Cohesion: 0.48
Nodes (5): MuseumLayout(), WalletProvider(), MuseumDoors(), MuseumStage(), publishedDoors()

### Community 142 - "opening.ts"
Cohesion: 0.43
Nodes (5): COLD_DOOR_HOLD_MS, hallIsReady(), Opening, OPENING_MAX_WAIT_MS, at()

### Community 143 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, assets:models, assets:pond-path, assets:shopkeeper, build, dev, start, typecheck

### Community 144 - "The Moonlit Pond — design"
Cohesion: 0.09
Nodes (22): Art the pond needs from the artist, Build contract (decided 2026-11-07), Build phases, Collection and goals, Done, Done, Guardrails, Leaderboards (+14 more)

### Community 145 - "Pond rework"
Cohesion: 0.18
Nodes (10): Baits, Client, Decisions, Done, Notes, Pond rework, Server, Species (+2 more)

### Community 146 - "createStage"
Cohesion: 0.13
Nodes (24): boundedCameraX(), isDoor(), linkedDoor(), createStage(), closeEntry(), enter(), initialize(), aim() (+16 more)

### Community 147 - "Orchestration contract — you plan, DSH workers execute"
Cohesion: 0.29
Nodes (6): Briefing a worker, Budget hygiene, graphify, Orchestration contract — you plan, DSH workers execute, The worker, When not to delegate

### Community 148 - "tables.ts"
Cohesion: 0.09
Nodes (39): BaitTrayProps, PondGameProps, RevealCardProps, PondCatch, CatchView, debugSpecies(), debugVariant(), GuestRoll (+31 more)

### Community 149 - "Tiny Museum v1 · Curator Letters"
Cohesion: 0.17
Nodes (11): Letter 0 · Clean up your room, Letter 1 · Place your first decoration, Letter 2 · Visit the first gallery, Letter 3 · Play a mini-game, Letter 4 · Unlock an outfit or character, Letter 5 · Find the seasonal items, Letter 6 · Unlock the daily calendar, Letter 7 · The cliffhanger and email signup (+3 more)

### Community 150 - "useBackgroundMusic.ts"
Cohesion: 0.11
Nodes (27): BackgroundMusic, clampVolume(), isDocumentHidden(), Options, useBackgroundMusic(), VISIBILITY_EVENTS, EFFECTS, EffectSpec (+19 more)

### Community 152 - "SlotDef"
Cohesion: 0.18
Nodes (3): FakeServer, SlotState, SlotDef

### Community 153 - "Other visitors"
Cohesion: 0.29
Nodes (6): How it plays, Other visitors, Privacy, Running it in production, Running it locally, Staying consistent

### Community 154 - "run.ts"
Cohesion: 0.17
Nodes (9): admin, childEnv, client, database, fresh, migrations, target, pg@^8.13.1 (+1 more)

### Community 155 - "three"
Cohesion: 0.05
Nodes (27): Carried, CarriedState, createCarried(), Character, centerYFor(), CONFIG, createHelm(), Helm (+19 more)

### Community 156 - "Walker"
Cohesion: 0.17
Nodes (4): PondPlaceData, FloorPoint, WalkArea, Walker

### Community 158 - "Personal room: stress-test issues"
Cohesion: 0.29
Nodes (5): Checked and fine, Not covered by this pass, Personal room: stress-test issues, Status (2026-11-06), Test data left in the local database

### Community 159 - "Curating the paintings (2026-11-07)"
Cohesion: 0.12
Nodes (15): hang(), 1. The registry and the table, 2. The studio's Location picker, 3. The rooms draw what is placed, 4. Credits, 5. Retiring self-serve artists, Building it, Curating the paintings (2026-11-07) (+7 more)

### Community 160 - "placements.ts"
Cohesion: 0.06
Nodes (38): Catalogue, Data model (core), 1. Items placed against a zone edge fail to save, and the whole draft reverts, 2. One owned item can be placed many times, 3. Any save rejection throws away all unsaved work, 4. Changes made just before leaving are lost, 5. Fish trophies can be claimed without playing, High (+30 more)

### Community 163 - "import-home-assets.mjs"
Cohesion: 0.06
Nodes (20): bodyTextures, COATS, { json, bin }, manifest, maps, target, DOOR, DOOR_BACKDROP (+12 more)

### Community 164 - "db.ts"
Cohesion: 0.08
Nodes (26): CONTENT_TYPES, GET(), PUT(), snapshot(), Checked against the mocks (2026-11-07), addPondPhoto(), AddPondPhotoResult, isJpeg() (+18 more)

### Community 166 - "mutation-guard.ts"
Cohesion: 0.67
Nodes (3): allowedOrigin(), isSameOriginMutation(), LOOPBACK

### Community 168 - "wander.test.ts"
Cohesion: 0.16
Nodes (11): Job, Place, WalkState, BASE_JOB, context(), L_GROUND, mulberry32(), room() (+3 more)

### Community 169 - "outbox.test.ts"
Cohesion: 0.18
Nodes (16): CARRY_CAP, carryAdd(), CarryEntry, carryRemove(), chunk(), ClaimRequest, OUTBOX_CAP, outboxAdd() (+8 more)

### Community 170 - "Low"
Cohesion: 0.25
Nodes (8): 13. Pages that redirect or don't exist answer 200, 14. Error codes reveal which room slugs exist, 15. The name sign slides under the top-right buttons in Decorate, 16. Level-up celebrations can be farmed, 17. No hint of where things are after panning away, 18. Too many items is only discovered by the server, 19. Development-only: page payloads include the full room row, Low

### Community 171 - "Atelier: the dressing mirror, and show-don't-tell keeping"
Cohesion: 0.06
Nodes (22): CARD, createHangTag(), HangTag, HangTagStyle, HOLE, KNOT, Atelier: the dressing mirror, and show-don't-tell keeping, Build order (+14 more)

### Community 173 - "confirm/page.tsx"
Cohesion: 0.33
Nodes (7): ConfirmFollow(), dynamic, dynamic, Unsubscribe(), FollowNotice(), confirmFollow(), unsubscribe()

### Community 175 - "ref_node_assert"
Cohesion: 0.11
Nodes (29): shape, defineSlot(), docBytes(), SLOTS, byAtThenKey(), encoded(), latest, mapOf() (+21 more)

### Community 176 - "Medium"
Cohesion: 0.29
Nodes (7): 10. Long names run off the name sign, 11. The rooms API skips the stale-tab member check, 12. The bunny is dragged along while you pan in Decorate, 6. Failed saves are nearly invisible, and nothing retries, 7. Two tabs editing the same room overwrite each other, 8. The drawer's card row can't be scrolled on touch screens, Medium

### Community 177 - "visits.ts"
Cohesion: 0.06
Nodes (43): state(), dynamic, format(), grade(), METRICS, PAGES, PerformancePage(), RANGES (+35 more)

### Community 178 - "walk"
Cohesion: 0.16
Nodes (13): walk(), 1. What is in this bundle, 2. How the game draws the bunny today (read from the repo, not run), 3. The rig, 4. Suggested plan, 5. Blender-side work still to do (needs Blender; the author has it with an MCP bridge), 6. Open questions for the author, Handoff: move the Tiny Museum bunny from sprite frames to a rig (+5 more)

### Community 179 - "protocol.ts"
Cohesion: 0.11
Nodes (32): fetch(), Env, isHome(), isItem(), isName(), isPid(), isSeq(), MAX_HOLDS (+24 more)

### Community 180 - "Local end-to-end stress test — 2026-11-06"
Cohesion: 0.29
Nodes (7): Environment and coverage, Follow-up coverage, Issue index, Local end-to-end stress test — 2026-11-06, Measured load, Passing checks and interpretation limits, Test data and cleanup

### Community 181 - "LandingFx"
Cohesion: 0.18
Nodes (12): glowSprite(), LandingFx(), onClick(), onVisibility(), psst(), spawnMist(), tick(), Mist (+4 more)

### Community 182 - "schedule.test.ts"
Cohesion: 0.07
Nodes (26): RESIDENT_IDS, FloorSpot, JOBS, NpcGround, PlaceKind, ROOM_KINDS, ROOMS, PlaceInput (+18 more)

### Community 183 - "Storyline (draft, saved 2026-11-17)"
Cohesion: 0.15
Nodes (12): Arc (soft, no fail state), Built so far, How it ties to what exists, Locked (2026-11-21, the owner), Next tasks (when picked up), Open questions, Premise, Revision (2026-11-21, the owner) (+4 more)

### Community 184 - "backdrop.ts"
Cohesion: 0.11
Nodes (19): shape(), createHallAmbience(), finish(), glowTexture(), HallAmbience, mulberry(), painted(), vignetteTexture() (+11 more)

### Community 185 - "bake-pond-path.mjs"
Cohesion: 0.21
Nodes (7): blank(), manifest, manifestPath, ORIGINAL_SOURCE, originalPath(), root, softened()

### Community 187 - "createPondRoom"
Cohesion: 0.32
Nodes (13): createPondRoom(), approach(), busy(), finishWalk(), goTo(), leave(), move(), nearest() (+5 more)

### Community 190 - "createPixelRatioGovernor"
Cohesion: 0.33
Nodes (7): createPixelRatioGovernor(), reset(), stepTo(), PIXEL_RATIO_STEPS, pixelRatioSteps(), Renderer, governor()

### Community 191 - "SyncStore"
Cohesion: 0.10
Nodes (23): ANON_PREFIX, anonKey(), deviceKey(), encodeStored(), isMemberSlotKey(), listKeys(), MEMBER_KEY, memberKey() (+15 more)

### Community 192 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, db:schema, deploy:backend, dev, dev:presence, dev:web, dev:worker (+6 more)

### Community 193 - "Monets Lily Pond: exploration, UX and multiplayer QA"
Cohesion: 0.29
Nodes (6): Browser and interaction coverage, Changes made from the walkthrough, Monets Lily Pond: exploration, UX and multiplayer QA, Multiplayer and load, Practical limits, Regression checks and cleanup

### Community 195 - "exports"
Cohesion: 0.15
Nodes (13): exports, ./brand, ./bugs, ./economy, ./guestboard, ./presence, ./presence/messages, ./presence/wire (+5 more)

### Community 198 - "RevealCard.tsx"
Cohesion: 0.09
Nodes (23): PondMusic(), SONG, catchArt(), gradeLabel(), JOURNAL_FAMILIES, JOURNAL_GRADES, JOURNAL_SIZE, journalCatch (+15 more)

### Community 200 - "personal/room.ts"
Cohesion: 0.09
Nodes (32): PersonalArt, isRemovedProceduralFish(), createPersonalRoom(), light(), shade(), showArrangement(), signFilter(), DOOR_SIGN (+24 more)

### Community 201 - "names.ts"
Cohesion: 0.26
Nodes (10): ADJECTIVES, NAME_LIMITS, NAME_SEEDS, NameCheck, normalizeDisplayName(), NOUNS, randomSeed(), RESERVED (+2 more)

### Community 202 - "atelier.ts"
Cohesion: 0.06
Nodes (31): AtelierActions, AtelierDoor, AtelierImage, BuiltRoom, Cardigan, CARDIGAN_NAMES, Control, refresh() (+23 more)

### Community 205 - "nearby.ts"
Cohesion: 0.18
Nodes (6): createNearby(), Nearby, NearbyReach, RoomSpan, reach, strip

### Community 207 - "query"
Cohesion: 0.06
Nodes (67): shutdown(), Code, 3.2 Chosen names (members), registry, started(), CatchExtra, clearCatches(), COLUMNS (+59 more)

### Community 209 - "app/layout.tsx"
Cohesion: 0.08
Nodes (26): bethEllen, inspiratiq, metadata, notoSans, RootLayout(), sniglet, viewport, hasSound() (+18 more)

### Community 210 - "player-card.ts"
Cohesion: 0.11
Nodes (13): Door, doorOf(), PlayerCard, wallpaperOf(), cozyLevel, cozyWorth(), Built (2026-11-21), Decisions (+5 more)

### Community 211 - "petals.ts"
Cohesion: 0.24
Nodes (6): createDoorPetals(), DoorPetals, mulberry(), Petal, petalTexture(), PondDoor

### Community 216 - "npc-sheet.cjs"
Cohesion: 0.31
Nodes (8): CFG, closeEye(), eraseMouth(), inpaint(), sample(), sharp, [src, out, cfgPath], warp()

### Community 224 - "editor.ts"
Cohesion: 0.21
Nodes (13): roomEditor, PER_EDITOR, PUT(), versionOf(), PER_MEMBER, POST(), PER_EDITOR, POST() (+5 more)

### Community 225 - "painting-open"
Cohesion: 0.50
Nodes (4): file, kilobytes, seconds, painting-open

### Community 230 - "icon-basket"
Cohesion: 0.67
Nodes (3): icon-basket, file, vector

## Knowledge Gaps
- **5 isolated node(s):** `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1734 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **26 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `features/economy/index.ts`, `SketchGuess.tsx`, `DoorEditor.tsx`, `PersonalRoom.tsx`, `Test Fakes and Helpers`, `join-room.ts`, `lib/slots/index.ts`, `lib/assets.ts`, `useBackgroundMusic.ts`, `Web Package Dependencies`, `logic.ts`, `risk.ts`, `pond-format.ts`, `(hall)/page.tsx`, `LetterMailbox.tsx`, `Water.tsx`, `LandingFx`, `features/economy/index.ts`, `economy/store.ts`, `FishingView.tsx`, `domain/guestboard.ts`, `RevealCard.tsx`, `app/layout.tsx`, `actions.ts`, `FishingView.tsx`, `atelier/room.ts`, `ClosetView.tsx`, `rig.ts`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **What connects `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json` to the rest of the system?**
  _5 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `features/economy/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10256410256410256 - nodes in this community are weakly interconnected._
- **Why does `useSound()` connect `react` to `features/economy/index.ts`, `SketchGuess.tsx`, `PersonalRoom.tsx`, `museum/layout.tsx`, `logic.ts`, `join-room.ts`, `lib/slots/index.ts`, `lib/assets.ts`, `logic.ts`, `risk.ts`, `pond-format.ts`, `LetterMailbox.tsx`, `LandingFx`, `FishingView.tsx`, `domain/guestboard.ts`, `RevealCard.tsx`, `atelier/room.ts`, `ClosetView.tsx`, `epoch.ts`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **Should `Traversal` be split into smaller, more focused modules?**
  _Cohesion score 0.08130081300813008 - nodes in this community are weakly interconnected._
- **Why does `three` connect `three` to `pond/art.ts`, `scene/assets.ts`, `scene.ts`, `cozy.ts`, `join-room.ts`, `prepare-models.mjs`, `ambience.ts`, `Web Package Dependencies`, `hall/room.ts`, `Atelier: the dressing mirror, and show-don't-tell keeping`, `rooms/types.ts`, `rooms/art.ts`, `backdrop.ts`, `hit.ts`, `atelier.ts`, `petals.ts`, `pond/room.ts`, `atelier/room.ts`, `npc-layer.ts`, `rig.ts`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Should `SketchGuess.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0726764500349406 - nodes in this community are weakly interconnected._