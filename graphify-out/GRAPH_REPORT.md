# Graph Report - tiny-museum  (2026-11-23)

## Corpus Check
- 567 files · ~348,185 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 106 file(s) not represented in the graph (top: .avif 56, .glb 38, .css 7)

## Summary
- 5089 nodes · 13218 edges · 232 communities (202 shown, 30 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 259 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7f818e46`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- features/economy/index.ts
- walk.ts
- SketchGuess.tsx
- DoorEditor.tsx
- builtUrl
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
- DecorDrawer.tsx
- room-events.ts
- schedule.ts
- ref_node_assert
- amplify/package.json
- PersonalRoom.tsx
- prepare-models.mjs
- Traversal
- core/package.json
- media/storage.ts
- Placement
- react
- formatInteger
- ambience.ts
- core/src/index.ts
- Web Package Dependencies
- Gamifying Tiny Museum — genre direction & engagement research
- features/rooms/doors.ts
- remote-visitors.ts
- risk.ts
- amplify/tsconfig.json
- 5. Customization menu — what other people are doing
- remote-visitors.ts
- confirm/page.tsx
- Web TSConfig
- Root Package Manifest
- hitForVisitor
- perf.ts
- import-fishing-assets.mjs
- Base TSConfig
- Amplify Build Spec
- sketchguess/lib/api.ts
- actions.ts
- handlers.ts
- LandingFx
- Water.tsx
- Worker Package Manifest
- Public Asset Manifest
- rules.ts
- atelier.ts
- compose-atelier.mjs
- BunnyArtist.tsx
- pond-format.ts
- app/page.tsx
- economy/store.ts
- mutation-guard.ts
- room.ts
- minimap.ts
- tab-turn.ts
- domain/guestboard.ts
- Sound Effect Assets
- art-cache.ts
- Custom HTTP Headers
- Sharp Layer Package
- stage.ts
- scene/ambience.ts
- Confirmed issues
- rooms.ts
- domain/doors.ts
- Visits SQL Schema
- Bunny Walk Sprites
- Room Mockup Settings
- Service Worker Caching
- HallCallbacks
- stone-path-bake.ts
- createPresence
- members
- Frame Window Asset
- wander.ts
- presence/package.json
- createAtelierRoom
- Asset pipeline: fast loading without losing sharpness
- Guest Board SQL Schema
- Landscape Frame Asset
- import-hall-assets.mjs
- Bug Reports SQL Schema
- Vitals SQL Schema
- infra/jobs.ts
- ClosetView.tsx
- pond/room.ts
- members.ts
- Run-Once Schema
- wardrobe.ts
- FishingView.tsx
- AtelierRoom
- useBackgroundMusic.ts
- Your Room: a room you can freely furnish
- json
- graftCostume
- pondgame/lib/api.ts
- worker/tsconfig.json
- core/tsconfig.json
- Storage
- How to Design for Failures — ByteByteGo Newsletter
- Worker instructions — DSH headless agents
- Backend
- protocol.ts
- Costume gallery doorway
- layout.ts
- Fishing forest: painted asset pass
- audio/README.md
- .claude/CLAUDE.md
- The Costume Atelier
- PondRoom.tsx
- rig.ts
- hit.ts
- queryOne
- presence/tsconfig.json
- wallet.ts
- tsconfig.test.json
- app/layout.tsx
- dependencies
- peers.ts
- run.ts
- createHallRoom
- npc-layer.ts
- exports
- room-places.ts
- bug-report.ts
- overlay.ts
- LeaderboardPanel.tsx
- env.ts
- The Moonlit Pond — design
- Pond rework
- createStage
- Orchestration contract — you plan, DSH workers execute
- tables.ts
- lib/presence.ts
- HallArranger.tsx
- pond-state.ts
- SlotDef
- pond-boards.ts
- epoch.ts
- hang-tag.ts
- outbox.test.ts
- Walkthrough.tsx
- createPondRoom
- import-home-assets.mjs
- createPlacementLayer
- Atelier: the dressing mirror, and show-don't-tell keeping
- personal/room.ts
- painting-open
- ref_sharp
- Multiplayer ("other visitors") — plan v2 (Cloudflare)
- Lobby
- assetUrl
- bug-reports.ts
- icon-basket
- backend.ts
- Curating the paintings (2026-11-07)
- pedestal.ts
- bunny-left
- Local end-to-end stress test — 2026-11-06
- bunny-right
- useSound
- visits.ts
- icon-home
- doors/page.tsx
- walk
- ticket
- schedule.test.ts
- Storyline (draft, saved 2026-11-17)
- Low
- bake-pond-path.mjs
- a/[slug]/page.tsx
- themes.ts
- draw.py
- traversal.ts
- import-landing-assets.mjs
- SyncStore
- BountyPanel.tsx
- Monets Lily Pond: exploration, UX and multiplayer QA
- hang-tag.ts
- CameraRig
- AccountSheet
- scripts
- useSoundEffects.ts
- domain/sketch.ts
- ticket/route.ts
- messages.ts
- RigPreview.tsx
- npcs/README.md
- remote-visitors.ts
- nearby.ts
- usePondState
- catalog.ts
- gallery.ts
- VitalsReporter.tsx
- AccountSheet.tsx
- FilesystemStorage
- Medium
- vitals.ts
- player-card.ts
- icons.tsx
- npc-sheet.cjs
- Cafe
- master
- doors.sql
- SoundProvider.tsx
- xdog.ts
- links.ts
- 4. Transport: Cloudflare Durable Objects
- Wardrobe
- Personal room: stress-test issues
- Other visitors
- paintedCostume
- next.config.ts
- AtelierHooks
- LiveReflection

## God Nodes (most connected - your core abstractions)
1. `react` - 83 edges
2. `json()` - 72 edges
3. `query()` - 71 edges
4. `PersonalRoom()` - 67 edges
5. `hit()` - 58 edges
6. `limited()` - 52 edges
7. `three` - 50 edges
8. `next` - 47 edges
9. `Traversal` - 46 edges
10. `createHallRoom()` - 46 edges

## Surprising Connections (you probably didn't know these)
- `Code` --references--> `followOutfit()`  [INFERRED]
  docs/costume-atelier.md → apps/web/src/features/hall/scene/wardrobe.ts
- `E2E-009 — Room mutations ignore stale account identity` --references--> `memberFromRequest()`  [INFERRED]
  docs/testing/local-e2e-stress-2026-11-06.md → apps/web/src/shared/lib/member-route.ts
- `19. Development-only: page payloads include the full room row` --references--> `getRoom()`  [INFERRED]
  docs/personal-room-issues.md → packages/core/src/domain/rooms.ts
- `Catalogue` --references--> `personalRoomFor()`  [INFERRED]
  docs/custom-room.md → packages/core/src/domain/rooms.ts
- `Server` --references--> `readPondTicket()`  [INFERRED]
  docs/pond-rework.md → packages/core/src/economy/pond.ts

## Import Cycles
- None detected.

## Communities (232 total, 30 thin omitted)

### Community 0 - "features/economy/index.ts"
Cohesion: 0.10
Nodes (28): CoinToast(), Toast, Purse(), Stamp(), WalletProvider(), serverSnapshot, useEarnEvents(), buildClaim() (+20 more)

### Community 1 - "walk.ts"
Cohesion: 0.13
Nodes (12): FloorPoint, WalkArea, water, depthAtLift(), PROP_DEPTH, MAX_DEPTH, PICTURE, pondFloor() (+4 more)

### Community 2 - "SketchGuess.tsx"
Cohesion: 0.08
Nodes (38): PlaceInfo, bestKeyFor(), BURST, clueUrl(), openingPlan(), Phase, pickAtRandom(), prepareSketchGame() (+30 more)

### Community 3 - "DoorEditor.tsx"
Cohesion: 0.07
Nodes (50): CAST, GuideTalk, DoorEditor(), add(), apply(), commitSlide(), nudge(), pick() (+42 more)

### Community 4 - "builtUrl"
Cohesion: 0.11
Nodes (25): Loading(), DENSITY_MEDIA, HallPreload(), HallSkeleton(), AtelierImage, PICTURE, doorArtUrl(), loadDoorArt() (+17 more)

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
Nodes (40): AssetManifest, assetUrl(), bitmapTexture(), blankImage(), CAFE_CAT_FRAMES, CharacterSprites, CompressedLoader, elementTexture() (+32 more)

### Community 9 - "RoomContents"
Cohesion: 0.09
Nodes (14): Pose, RoomContents, Decisions (2026-11-05), Follow-ups after Phases 4–7, Model (`apps/web/src/features/rooms/types.ts`), Personal room polish (2026-11-05), Phase 2: hall on the stage, Phase 3: one persistent stage (+6 more)

### Community 10 - "machine.ts"
Cohesion: 0.09
Nodes (51): CAST_ERRORS, coarsePointer(), FishingView(), initialEasyReel(), isTyping(), LOST, PondGameProps, Toast (+43 more)

### Community 11 - "Museum.tsx"
Cohesion: 0.12
Nodes (28): motion@^13.1.1, Loading(), AtelierLoading(), coin, CoinFound(), CoinFoundProps, CoinFound, ColorRecall (+20 more)

### Community 12 - "Test Fakes and Helpers"
Cohesion: 0.12
Nodes (27): deferredFetch(), deviceSlot, FakeEvents, FakeStorage, fixture, fixtureB, fixtureRegistry, fixtureRegistryBoth (+19 more)

### Community 13 - "scene.ts"
Cohesion: 0.06
Nodes (24): MuseumProps, disposeDisplayTexture(), prefersAvif(), HiddenCoin, hallDoorSpan(), placeholderTexture(), hallDoorSpans(), HallScene (+16 more)

### Community 14 - "cozy.ts"
Cohesion: 0.06
Nodes (57): alphaCanvas(), ATELIER_PROPS, AtelierImage, atticWindowCanvas(), bareBulbCanvas(), boardsCanvas(), canvasTexture(), ceilingGeometry() (+49 more)

### Community 15 - "DecorDrawer.tsx"
Cohesion: 0.13
Nodes (16): DecorDrawer, DecorDrawerProps, SLOT_LABELS, Tab, TABS, DrawerCategory, FINISH_SLOTS, finishLabel() (+8 more)

### Community 16 - "room-events.ts"
Cohesion: 0.17
Nodes (29): ChatButton(), REFUSED, joinRoom(), Options, STANDING, announceNameChange(), emit(), getPeople() (+21 more)

### Community 17 - "schedule.ts"
Cohesion: 0.07
Nodes (55): addDwellEmotes(), addEmote(), addGap(), addStand(), addWalk(), along(), buildRoomTable(), buildStayPlan() (+47 more)

### Community 18 - "ref_node_assert"
Cohesion: 0.10
Nodes (29): valid, validSeed(), defineSlot(), docBytes(), SLOTS, byAtThenKey(), encoded(), latest (+21 more)

### Community 19 - "amplify/package.json"
Cohesion: 0.17
Nodes (14): devDependencies, @aws-amplify/backend@^1.14.0, @aws-amplify/backend-cli@^1.6.0, aws-cdk-lib@^2.180.0, constructs@^10.3.0, name, private, scripts (+6 more)

### Community 20 - "PersonalRoom.tsx"
Cohesion: 0.08
Nodes (63): errorReason(), Offer, overDrawer(), PersonalRoom(), canPlaceNew(), carriedTo(), carryEnd(), carryMove() (+55 more)

### Community 21 - "prepare-models.mjs"
Cohesion: 0.07
Nodes (29): alongArm(), ARMS, armTurn(), BODIES, bruce, BRUCE_FIT, BRUCE_PLACE, BRUCE_SLEEVES (+21 more)

### Community 22 - "Traversal"
Cohesion: 0.10
Nodes (5): JumpPose, clamp(), fixture(), jump(), Traversal

### Community 23 - "core/package.json"
Cohesion: 0.16
Nodes (13): devDependencies, @types/bcryptjs@^2.4.6, @types/pg@^8.11.10, main, name, private, scripts, typecheck (+5 more)

### Community 24 - "media/storage.ts"
Cohesion: 0.19
Nodes (16): CONTENT_TYPES, GET(), PUT(), ACCEPTED, createAssetFromUpload(), MAX_UPLOAD_BYTES, presignUpload(), registerUpload() (+8 more)

### Community 25 - "Placement"
Cohesion: 0.04
Nodes (17): Carry, Job, PersonalRoomProps, createDecorController(), canvasRect(), targetRise(), toScreen(), DecorController (+9 more)

### Community 26 - "react"
Cohesion: 0.16
Nodes (15): openBugReport(), fitWidth(), HelpGuide(), HelpGuideProps, POINTER_STEPS, TOUCH_STEPS, loadGameDesktop(), GameDesktop() (+7 more)

### Community 27 - "formatInteger"
Cohesion: 0.28
Nodes (17): refreshWalletNow(), buyPondBait(), claimPondBounty(), errorOf(), exchangePondPearls(), isRecord(), isStateView(), mutationHeaders() (+9 more)

### Community 28 - "ambience.ts"
Cohesion: 0.12
Nodes (29): blade(), bloom(), BLOOMS, createPondAmbience(), update(), fishTexture(), frond(), FRONT_ROWS (+21 more)

### Community 29 - "core/src/index.ts"
Cohesion: 0.05
Nodes (124): CatchExtra, clearCatches(), COLUMNS, grantPearls(), insertCatch(), member(), namedMember(), randomId() (+116 more)

### Community 30 - "Web Package Dependencies"
Cohesion: 0.07
Nodes (34): dependencies, embla-carousel-react@^8.6.0, next@^15.0.3, react@^19.0.0, react-dom@^19.0.0, swr@^2.5.1, three@^0.169.0, thumbhash@^0.1.1 (+26 more)

### Community 31 - "Gamifying Tiny Museum — genre direction & engagement research"
Cohesion: 0.10
Nodes (19): 0.1 The core experience, 0.2 Systems that make gamification cheap to build, 0.3 Constraints that shape any recommendation, 0. What the game is today (the deep dive), 1.1 The landscape (seven candidates, with verdicts), 1.2 Recommendation: a **cozy gallery life-sim** — "the gallery you live in", 1.3 The five design pillars the genre implies, 1. Genre direction (+11 more)

### Community 32 - "features/rooms/doors.ts"
Cohesion: 0.43
Nodes (5): MuseumLayout(), setMuseumDoors(), MuseumDoors(), MuseumStage(), publishedDoors()

### Community 33 - "remote-visitors.ts"
Cohesion: 0.11
Nodes (37): Assets, Scenery, CUTS, disposeBoards(), plane(), ROPE_CUTS, ropeSlices(), sliceOf() (+29 more)

### Community 34 - "risk.ts"
Cohesion: 0.13
Nodes (31): Hud(), HudProps, HudWagerChip, WagerPicker(), chooseTier(), WagerPickerProps, CastOptions, PondStateView (+23 more)

### Community 35 - "amplify/tsconfig.json"
Cohesion: 0.20
Nodes (9): compilerOptions, module, moduleResolution, noUnusedLocals, noUnusedParameters, exclude, extends, include (+1 more)

### Community 36 - "5. Customization menu — what other people are doing"
Cohesion: 0.12
Nodes (16): 1. The target: what "Claude Opus 5.5" actually means, 2. Where your harness stands today (live config I read), 3. The honest gap model, 4. Quality levers, ranked by leverage, 5. Customization menu — what other people are doing, 6. Recommended starting kit for *your* profile, 7. What I can apply for you right now (needs your go-ahead), A. Prompt & persona (most common quality customizations) (+8 more)

### Community 37 - "remote-visitors.ts"
Cohesion: 0.06
Nodes (21): Attachment, Carried, CarriedState, createCarried(), Character, Perch, Pose, centerYFor() (+13 more)

### Community 38 - "confirm/page.tsx"
Cohesion: 0.33
Nodes (7): ConfirmFollow(), dynamic, dynamic, Unsubscribe(), FollowNotice(), confirmFollow(), unsubscribe()

### Community 39 - "Web TSConfig"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 40 - "Root Package Manifest"
Cohesion: 0.10
Nodes (22): [, width, height], description, devDependencies, concurrently@^9.1.0, esbuild@^0.24.0, ktx2-encoder@^0.6.0, maxrects-packer@^2.7.3, playwright@^1.63.0 (+14 more)

### Community 41 - "hitForVisitor"
Cohesion: 0.10
Nodes (30): ALLOWED, PER_VISITOR, POST(), POST(), POST(), PER_VISITOR, POST(), GET() (+22 more)

### Community 42 - "perf.ts"
Cohesion: 0.22
Nodes (4): createPerfMeter(), isEnabled(), PerfMeter, PerfSnapshot

### Community 43 - "import-fishing-assets.mjs"
Cohesion: 0.10
Nodes (12): CANVAS, clear, FONT, FRAME, heights, layout, lossless, manifest (+4 more)

### Community 44 - "Base TSConfig"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, lib, module, moduleResolution (+9 more)

### Community 45 - "Amplify Build Spec"
Cohesion: 0.12
Nodes (16): applications, appRoot, backend, frontend, baseDirectory, files, phases, commands (+8 more)

### Community 46 - "sketchguess/lib/api.ts"
Cohesion: 0.15
Nodes (16): sameOriginUrl(), PreparedGame, decodeImage(), fetchBitmap(), fetchRound(), guarded(), InkMap, LoadedRound (+8 more)

### Community 47 - "actions.ts"
Cohesion: 0.07
Nodes (57): dateFormat, dynamic, GuestBoardPage(), dynamic, PaintingsPage(), back(), createCodeAction(), deleteCodeAction() (+49 more)

### Community 48 - "handlers.ts"
Cohesion: 0.11
Nodes (30): Where things stand, Design for Phases 5–7 (2026-11-05), sealEpoch(), handleDerivatives(), handleNotifyFollowers(), handleRenderDisplay(), handleSealEpoch(), renderPieceFrame() (+22 more)

### Community 49 - "LandingFx"
Cohesion: 0.17
Nodes (12): between(), CAT, Edge, EDGES, runLandingCat(), choosePeeker(), peek(), glowSprite() (+4 more)

### Community 50 - "Water.tsx"
Cohesion: 0.07
Nodes (38): AmbientShadow, box(), BUCKET, bunnyBox(), easeOut(), Glint, LEFT_STYLE, lineColour() (+30 more)

### Community 51 - "Worker Package Manifest"
Cohesion: 0.14
Nodes (14): dependencies, @tiny/core@*, exports, ./lambda, @tiny/core, main, name, private (+6 more)

### Community 52 - "Public Asset Manifest"
Cohesion: 0.12
Nodes (15): artworks, bunny, size, floor, size, fonts, icon-no-photos, size (+7 more)

### Community 53 - "rules.ts"
Cohesion: 0.15
Nodes (18): localDay(), at(), EXCHANGE_DAILY_STAMPS, EXCHANGE_PEARLS_PER_STAMP, exchangeClaimKey(), GAME_DAILY_CAP, GameId, GAMES (+10 more)

### Community 54 - "atelier.ts"
Cohesion: 0.05
Nodes (41): AtelierActions, AtelierArt, AtelierDoor, AtelierImage, BuiltRoom, Cardigan, CARDIGAN_NAMES, Control (+33 more)

### Community 55 - "compose-atelier.mjs"
Cohesion: 0.12
Nodes (10): body, dressLayer, dressWidth, floralWidth, hanger, MANNEQUIN_CANVAS, mask, root (+2 more)

### Community 56 - "BunnyArtist.tsx"
Cohesion: 0.50
Nodes (4): BunnyArtist(), BunnyMood, Pencil(), POSES

### Community 57 - "pond-format.ts"
Cohesion: 0.13
Nodes (27): fetchPondDex(), PondDex, EXCHANGE_DAILY_STAMPS, EXCHANGE_PEARLS_PER_STAMP, FISH_ART, fishArt(), formatPercent(), formatShortSizeCm() (+19 more)

### Community 58 - "app/page.tsx"
Cohesion: 0.21
Nodes (13): dynamic, Hall(), MuseumPage(), [BRAND_OWNER, ...BRAND_REST], CurrentlyShowing(), Decor(), dynamic, LandingPage() (+5 more)

### Community 59 - "economy/store.ts"
Cohesion: 0.09
Nodes (50): CARRY_CAP, carryAdd(), CarryEntry, carryPrune(), carryRemove(), chunk(), ClaimRequest, buy() (+42 more)

### Community 60 - "mutation-guard.ts"
Cohesion: 0.67
Nodes (3): allowedOrigin(), isSameOriginMutation(), LOOPBACK

### Community 61 - "room.ts"
Cohesion: 0.12
Nodes (32): attachmentOf(), admitted(), Attachment, farewell(), GHOST_MS, HELLO_TIMEOUT_MS, holdsOf(), homeOf() (+24 more)

### Community 62 - "minimap.ts"
Cohesion: 0.07
Nodes (35): place(), createMinimap(), draw(), drawRoom(), floors(), follow(), sketchOf(), doorPoint() (+27 more)

### Community 63 - "tab-turn.ts"
Cohesion: 0.16
Nodes (5): createTabTurn(), TabTurn, tab(), TurnEnv, TurnMessage

### Community 64 - "domain/guestboard.ts"
Cohesion: 0.09
Nodes (35): BoardScreen(), BoardScreenProps, ComposeScreen(), ComposeScreenProps, blankDraft(), GuestBoard(), GuestBoardProps, View (+27 more)

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

### Community 69 - "stage.ts"
Cohesion: 0.06
Nodes (24): RoomArt, ActiveRoom, RoomOptions, StageContext, StageContextValue, Entry, JOINED_REACH, Stage (+16 more)

### Community 70 - "scene/ambience.ts"
Cohesion: 0.13
Nodes (13): BULBS, createHallAmbience(), finish(), glowTexture(), HallAmbience, mulberry(), painted(), vignetteTexture() (+5 more)

### Community 71 - "Confirmed issues"
Cohesion: 0.11
Nodes (18): Confirmed issues, E2E-002 — Valid edge placement rejected through floating-point precision, E2E-003 — One owned prop can be placed multiple times, E2E-004 — Reload before autosave silently loses the latest placement, E2E-005 — Failed save and failed Done have no visible mobile explanation, E2E-006 — Restoring connectivity does not retry a failed draft save, E2E-007 — Keyboard activation cannot place drawer items, E2E-008 — Creating an account from My Room leaves the signed-in user on the sign-in prompt (+10 more)

### Community 72 - "rooms.ts"
Cohesion: 0.07
Nodes (56): GET(), PaintingRow, GET(), POST(), UPLOADS_PER_ARTIST, POST(), UPLOADS_PER_ARTIST, dynamic (+48 more)

### Community 73 - "domain/doors.ts"
Cohesion: 0.23
Nodes (10): StudioLayout(), Badge(), Icon(), ICONS, StudioNav(), countOpenBugReports(), DoorsRow, doorsState (+2 more)

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

### Community 79 - "stone-path-bake.ts"
Cohesion: 0.31
Nodes (8): bakeStonePath(), blank(), softened(), STONE_LIGHT, STONE_SHADE, TUFT, warmUp(), yieldToMain()

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
Cohesion: 0.10
Nodes (38): NpcRoomInfo, NpcFrame, StayContext, along(), beginNext(), beginWork(), between(), blockedAt() (+30 more)

### Community 84 - "presence/package.json"
Cohesion: 0.14
Nodes (16): dependencies, @tiny/core@*, devDependencies, @cloudflare/workers-types@5.20261016.1, wrangler@4.151.1, @tiny/core, name, private (+8 more)

### Community 85 - "createAtelierRoom"
Cohesion: 0.31
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

### Community 89 - "import-hall-assets.mjs"
Cohesion: 0.09
Nodes (17): BASEBOARD, CURTAIN, drop, EXPECTED, file(), manifest, manifestPath, masters (+9 more)

### Community 93 - "infra/jobs.ts"
Cohesion: 0.31
Nodes (13): loop(), sleep(), sweepStale(), DrainResult, handler(), repairFrames(), repairUnframed(), runJob() (+5 more)

### Community 94 - "ClosetView.tsx"
Cohesion: 0.09
Nodes (31): ClosetView(), onKeyDown(), LISTS, PLACE, PODIUM_SRC, Props, Slot, SPOTLIGHT_SRC (+23 more)

### Community 95 - "pond/room.ts"
Cohesion: 0.09
Nodes (36): ArtByRoom, colorAt(), decoded(), EDGE_BAND, EDGE_BANDS, EDGE_OVERLAP, edgeTexture(), imageOf() (+28 more)

### Community 96 - "members.ts"
Cohesion: 0.07
Nodes (58): POST(), PER_MEMBER, PUT(), POST(), POST(), GLOBAL, PER_IP, POST() (+50 more)

### Community 104 - "wardrobe.ts"
Cohesion: 0.10
Nodes (42): AtelierPage(), dynamic, metadata, useWallet(), allowedCharacter(), OwnedSnapshot, owns(), walletReady() (+34 more)

### Community 105 - "FishingView.tsx"
Cohesion: 0.13
Nodes (14): CONFETTI_COLORS, ConfettiPiece, makeConfetti(), RevealCard(), RevealCardProps, TIER_MS, TIER_SFX, useCountUp() (+6 more)

### Community 106 - "AtelierRoom"
Cohesion: 0.08
Nodes (11): AtelierRoom, createWardrobe(), enqueue(), reflect(), Options, bow, dress, navy (+3 more)

### Community 107 - "useBackgroundMusic.ts"
Cohesion: 0.17
Nodes (10): BackgroundMusic, clampVolume(), isDocumentHidden(), Options, useBackgroundMusic(), VISIBILITY_EVENTS, isRouted(), setGainLevel() (+2 more)

### Community 108 - "Your Room: a room you can freely furnish"
Cohesion: 0.22
Nodes (8): Admin mode (gamma), Decisions (2026-11-17, with the user), Room look (web, `features/rooms/themes/cozy.ts`, `features/rooms/personal/room.ts`), Scale, Testing locally, What other games do (research, 2026-11-17), Work plan, Your Room: a room you can freely furnish

### Community 109 - "json"
Cohesion: 0.07
Nodes (77): GET(), GLOBAL, PER_IP, POST(), PER_MEMBER, PUT(), GET(), PER_MEMBER (+69 more)

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
Cohesion: 0.11
Nodes (32): fetch(), Env, isHome(), isItem(), isName(), isPid(), isSeq(), MAX_HOLDS (+24 more)

### Community 119 - "Costume gallery doorway"
Cohesion: 0.50
Nodes (3): Costume gallery doorway, Curtain colour edit, Prompt

### Community 120 - "layout.ts"
Cohesion: 0.15
Nodes (13): cafeAfterIndex(), computeLayout(), clear(), placeCafe(), cutRooms(), DoorSpan, HALL_DOOR_FOOT, HallLayout (+5 more)

### Community 121 - "Fishing forest: painted asset pass"
Cohesion: 0.10
Nodes (18): Assets, Bruce's collection refresh (2026-11-08), Fishing forest illustrations, Made by hand (not touched by the script), Main hall v2 (2026-11-10), Monets Lily Pond (2026-11-08), 1. Forest doorway, 2. Woodland noticeboard (+10 more)

### Community 124 - "The Costume Atelier"
Cohesion: 0.14
Nodes (13): Adding a character, Adding a costume, Art not supplied as files, Bruce's Chronicles, Checked against the mocks (2026-11-07), Code, Costume fit review, Floral collection (+5 more)

### Community 125 - "PondRoom.tsx"
Cohesion: 0.11
Nodes (19): metadata, PondPage(), PondGame(), POND_NAME, BOARD_TABS, PondOverlayKind, PondPanels(), signIn() (+11 more)

### Community 126 - "rig.ts"
Cohesion: 0.11
Nodes (27): setFrame(), Layer, setCostumeVisibility(), follow(), canvasToModel(), Frame, loadRig(), dispose() (+19 more)

### Community 127 - "hit.ts"
Cohesion: 0.17
Nodes (12): CoinWall, createHiddenCoin(), Spot, AlphaMap, alphaMapFor(), alphaMaps, buildAlphaMap(), isPaintedAt() (+4 more)

### Community 128 - "queryOne"
Cohesion: 0.16
Nodes (20): AnalyticsPage(), dynamic, dynamic, HangPage(), dynamic, StudioHome(), nudgeInRowAction(), AtelierFrame() (+12 more)

### Community 129 - "presence/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, types, exclude, extends, include, ../../tsconfig.base.json

### Community 130 - "wallet.ts"
Cohesion: 0.09
Nodes (32): shutdown(), member(), now, piece(), randomId(), today, baitOf(), applyClaim() (+24 more)

### Community 131 - "tsconfig.test.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 132 - "app/layout.tsx"
Cohesion: 0.18
Nodes (11): bethEllen, inspiratiq, metadata, notoSans, RootLayout(), sniglet, viewport, SoundProvider() (+3 more)

### Community 133 - "dependencies"
Cohesion: 0.15
Nodes (13): dependencies, @aws-sdk/client-s3@^3.1121.0, @aws-sdk/s3-request-presigner@^3.1121.0, bcryptjs@^2.4.3, obscenity@^0.4.6, sharp@^0.33.5, thumbhash@^0.1.1, sharp (+5 more)

### Community 134 - "peers.ts"
Cohesion: 0.14
Nodes (7): INTERPOLATION_DELAY_MS, PEER_TIMEOUT_MS, PeerTable, positionAt(), Sample, look, Peer

### Community 135 - "run.ts"
Cohesion: 0.17
Nodes (9): admin, childEnv, client, database, fresh, migrations, target, pg@^8.13.1 (+1 more)

### Community 136 - "createHallRoom"
Cohesion: 0.14
Nodes (18): createSitting(), hop(), createHallRoom(), buildRoom(), buildRoomContents(), cafeRoom(), raise(), enterDoor() (+10 more)

### Community 137 - "npc-layer.ts"
Cohesion: 0.09
Nodes (43): GuideTalk(), createDoorGuides(), HallGuide, PROJECTED, BY_ID, castMember(), FRAME, IDLE (+35 more)

### Community 138 - "exports"
Cohesion: 0.15
Nodes (13): exports, ./brand, ./bugs, ./economy, ./guestboard, ./presence, ./presence/messages, ./presence/wire (+5 more)

### Community 139 - "room-places.ts"
Cohesion: 0.16
Nodes (17): NpcGround, atelierRoomInfo(), atelierX(), copy(), FurniturePlacement, hallCache, hallRoomInfo(), onGround() (+9 more)

### Community 140 - "bug-report.ts"
Cohesion: 0.20
Nodes (15): BugReportHost(), BugReportSheet, BugReportSheet(), send(), Status, collectContext(), inAppBrowser(), onOpenBugReport() (+7 more)

### Community 141 - "overlay.ts"
Cohesion: 0.07
Nodes (18): Mark, CafeMarks, GiftShopMarks, GuestBoard, LobbyMarks, CafeLink, ComingSoonNote, FunZoneSign (+10 more)

### Community 142 - "LeaderboardPanel.tsx"
Cohesion: 0.17
Nodes (19): fetchPondLeaderboard(), PondBoardId, PondBoardPeriod, PondBoardRow, PondBounty, PondBountyClaim, PondDexCell, PondExchangeResult (+11 more)

### Community 143 - "env.ts"
Cohesion: 0.27
Nodes (7): SCHEMA_DIR, isProduction(), presenceSecret(), repoRoot, required(), sessionSecret(), setting()

### Community 144 - "The Moonlit Pond — design"
Cohesion: 0.09
Nodes (22): Art the pond needs from the artist, Build contract (decided 2026-11-07), Build phases, Collection and goals, Done, Done, Guardrails, Leaderboards (+14 more)

### Community 145 - "Pond rework"
Cohesion: 0.18
Nodes (10): Baits, Client, Decisions, Done, Notes, Pond rework, Server, Species (+2 more)

### Community 146 - "createStage"
Cohesion: 0.12
Nodes (25): boundedCameraX(), FLICK, flickDirection(), isUpwardFlick(), createStage(), closeEntry(), enter(), initialize() (+17 more)

### Community 147 - "Orchestration contract — you plan, DSH workers execute"
Cohesion: 0.29
Nodes (6): Briefing a worker, Budget hygiene, graphify, Orchestration contract — you plan, DSH workers execute, The worker, When not to delegate

### Community 148 - "tables.ts"
Cohesion: 0.11
Nodes (33): PondCatch, CatchView, debugSpecies(), debugVariant(), GuestRoll, rollGuest(), BAIT, BAIT_BY_ID (+25 more)

### Community 149 - "lib/presence.ts"
Cohesion: 0.07
Nodes (26): Entry, Connect, connectWebSocket(), fetchTicket, HEARTBEAT_MS, HIDDEN_LIMIT_MS, RETRY_MS, sameLook() (+18 more)

### Community 150 - "HallArranger.tsx"
Cohesion: 0.23
Nodes (9): loadHallArranger(), HallArranger(), HallArrangerProps, HallRoomData, Painting, currentHallOrder(), hallPlacements(), paintingOrder() (+1 more)

### Community 151 - "pond-state.ts"
Cohesion: 0.29
Nodes (12): fetchPondState(), PondStateView, PondTier, ensurePondStateStarted(), GUEST, listeners, LOADING, PondStateSnapshot (+4 more)

### Community 153 - "pond-boards.ts"
Cohesion: 0.11
Nodes (24): GET(), PER_VISITOR, BOARDS, oneOf(), PER_VISITOR, PERIODS, compare(), DexRow (+16 more)

### Community 154 - "epoch.ts"
Cohesion: 0.20
Nodes (16): GET(), intParam(), GET(), sketchPool, unavailable(), hallPaintings(), currentEpoch(), ensureEpoch() (+8 more)

### Community 155 - "hang-tag.ts"
Cohesion: 0.12
Nodes (5): Room, Presence, What goes, and what replaces it, Item, Refusal

### Community 156 - "outbox.test.ts"
Cohesion: 0.27
Nodes (12): OUTBOX_CAP, outboxAdd(), outboxDue(), OutboxEntry, outboxFail(), outboxRemove(), RETRY_BASE_MS, RETRY_MAX_MS (+4 more)

### Community 157 - "Walkthrough.tsx"
Cohesion: 0.13
Nodes (21): BACKDROP_STYLE, MoreArrow(), NavArrow(), Props, SLIDE, Walkthrough(), XIcon(), decodedFrames (+13 more)

### Community 158 - "createPondRoom"
Cohesion: 0.32
Nodes (13): createPondRoom(), approach(), busy(), finishWalk(), goTo(), leave(), move(), nearest() (+5 more)

### Community 159 - "import-home-assets.mjs"
Cohesion: 0.14
Nodes (11): DOOR, DOOR_BACKDROP, drop, FURNITURE, manifest, manifestPath, masters, ORNATE_PAPER (+3 more)

### Community 160 - "createPlacementLayer"
Cohesion: 0.27
Nodes (9): aspectOf(), createPlacementLayer(), drawOutline(), dropGhosts(), dropHelper(), extrasFor(), silhouette(), sizeOf() (+1 more)

### Community 161 - "Atelier: the dressing mirror, and show-don't-tell keeping"
Cohesion: 0.13
Nodes (14): Atelier: the dressing mirror, and show-don't-tell keeping, Build order, Built (2026-11-20), Decisions (2026-11-19), Follow-ups (2026-11-20), Goal, In the room, Keeping (+6 more)

### Community 162 - "personal/room.ts"
Cohesion: 0.08
Nodes (22): PersonalArt, createPersonalRoom(), light(), shade(), showArrangement(), signFilter(), DOOR_SIGN, gloomFor() (+14 more)

### Community 163 - "painting-open"
Cohesion: 0.50
Nodes (4): file, kilobytes, seconds, painting-open

### Community 164 - "ref_sharp"
Cohesion: 0.11
Nodes (7): bodyTextures, COATS, { json, bin }, manifest, maps, target, manifest

### Community 165 - "Multiplayer ("other visitors") — plan v2 (Cloudflare)"
Cohesion: 0.17
Nodes (11): ScreenChrome(), 0. Summary, 10. Decisions, 1. Product contract changes (approved 2026-10-31), 2. What already exists that this builds on, 5.1 Emotes (v1), 5. Protocol (`packages/core/src/presence/protocol.ts`), 8.1 Expected cost (+3 more)

### Community 167 - "assetUrl"
Cohesion: 0.29
Nodes (11): fetchPondFeed(), PondFeedItem, catchLabel(), formatSizeCm(), speciesFor(), speciesName(), speciesTier(), isGolden() (+3 more)

### Community 168 - "bug-reports.ts"
Cohesion: 0.09
Nodes (29): POST(), GET(), POST(), rateLimitedResponse(), rejectedResponse(), BugReport, BugReportDto, BugReportRateLimited (+21 more)

### Community 169 - "icon-basket"
Cohesion: 0.67
Nodes (3): icon-basket, file, vector

### Community 170 - "backend.ts"
Cohesion: 0.15
Nodes (12): amplifyDir, backend, everyMinutes, mediaBucket, missing, repoRoot, REQUIRED, setting() (+4 more)

### Community 171 - "Curating the paintings (2026-11-07)"
Cohesion: 0.13
Nodes (14): hang(), 1. The registry and the table, 2. The studio's Location picker, 3. The rooms draw what is placed, 4. Credits, 5. Retiring self-serve artists, Building it, Curating the paintings (2026-11-07) (+6 more)

### Community 172 - "pedestal.ts"
Cohesion: 0.12
Nodes (7): HELM_PEDESTAL_FILE, createNotes(), createPedestal(), Notes, Pedestal, PedestalVoice, VOICES

### Community 174 - "Local end-to-end stress test — 2026-11-06"
Cohesion: 0.29
Nodes (7): Environment and coverage, Follow-up coverage, Issue index, Local end-to-end stress test — 2026-11-06, Measured load, Passing checks and interpretation limits, Test data and cleanup

### Community 176 - "useSound"
Cohesion: 0.14
Nodes (22): ColorRecall(), ColorRecallProps, Phase, readBest(), ColorRound, showMs(), undoAdminUnlock(), loadColorRecall() (+14 more)

### Community 177 - "visits.ts"
Cohesion: 0.10
Nodes (32): state(), PER_VISITOR, POST(), amount(), duration(), dynamic, LANDMARKS, PAGES (+24 more)

### Community 179 - "doors/page.tsx"
Cohesion: 0.23
Nodes (10): BugReportsPage(), dateFormat, dynamic, summary(), DoorsPage(), dynamic, SignIn(), Message() (+2 more)

### Community 180 - "walk"
Cohesion: 0.18
Nodes (12): walk(), 1. What is in this bundle, 3. The rig, 4. Suggested plan, 5. Blender-side work still to do (needs Blender; the author has it with an MCP bridge), 6. Open questions for the author, Handoff: move the Tiny Museum bunny from sprite frames to a rig, Approved v4 bunny in the hall (+4 more)

### Community 182 - "schedule.test.ts"
Cohesion: 0.08
Nodes (29): RESIDENT_IDS, FloorSpot, Job, JOBS, Place, PlaceKind, ROOM_KINDS, ROOMS (+21 more)

### Community 183 - "Storyline (draft, saved 2026-11-17)"
Cohesion: 0.15
Nodes (12): Arc (soft, no fail state), Built so far, How it ties to what exists, Locked (2026-11-21, the owner), Next tasks (when picked up), Open questions, Premise, Revision (2026-11-21, the owner) (+4 more)

### Community 184 - "Low"
Cohesion: 0.25
Nodes (8): 13. Pages that redirect or don't exist answer 200, 14. Error codes reveal which room slugs exist, 15. The name sign slides under the top-right buttons in Decorate, 16. Level-up celebrations can be farmed, 17. No hint of where things are after panning away, 18. Too many items is only discovered by the server, 19. Development-only: page payloads include the full room row, Low

### Community 185 - "bake-pond-path.mjs"
Cohesion: 0.21
Nodes (7): blank(), manifest, manifestPath, ORIGINAL_SOURCE, originalPath(), root, softened()

### Community 186 - "a/[slug]/page.tsx"
Cohesion: 0.31
Nodes (6): ArtistPage(), dynamic, generateMetadata(), GET(), FollowForm(), getArtistPage()

### Community 187 - "themes.ts"
Cohesion: 0.05
Nodes (41): COLLECTIONS, Catalogue, Data model (core), 1. Items placed against a zone edge fail to save, and the whole draft reverts, 2. One owned item can be placed many times, 3. Any save rejection throws away all unsaved work, 4. Changes made just before leaving are lost, 5. Fish trophies can be claimed without playing (+33 more)

### Community 189 - "traversal.ts"
Cohesion: 0.27
Nodes (7): Loading(), coverFloorTransition(), revealFloorTransition(), createRoomPassage(), fixture(), JUMP_KEYS, PondLoading()

### Community 190 - "import-landing-assets.mjs"
Cohesion: 0.13
Nodes (9): socket(), CAT, drop, EXPECTED, manifest, manifestPath, masters, root (+1 more)

### Community 191 - "SyncStore"
Cohesion: 0.08
Nodes (28): ANON_PREFIX, anonKey(), deviceKey(), encodeStored(), isMemberSlotKey(), listKeys(), MEMBER_KEY, memberKey() (+20 more)

### Community 192 - "BountyPanel.tsx"
Cohesion: 0.36
Nodes (8): PondBounties, formatCountdown(), nextUtcMidnight(), utcDayLabel(), useCountdown(), useNow(), BountyPanel(), dayLabel()

### Community 193 - "Monets Lily Pond: exploration, UX and multiplayer QA"
Cohesion: 0.29
Nodes (6): Browser and interaction coverage, Changes made from the walkthrough, Monets Lily Pond: exploration, UX and multiplayer QA, Multiplayer and load, Practical limits, Regression checks and cleanup

### Community 194 - "hang-tag.ts"
Cohesion: 0.17
Nodes (6): CARD, createHangTag(), HangTag, HangTagStyle, HOLE, KNOT

### Community 195 - "CameraRig"
Cohesion: 0.20
Nodes (5): CameraRig, createPixelRatioGovernor(), PIXEL_RATIO_STEPS, Runtime, Phase 1: stage + atelier

### Community 196 - "AccountSheet"
Cohesion: 0.29
Nodes (9): AccountSheet(), continueAnyway(), doSignOut(), runDelete(), runName(), submit(), submitDelete(), submitName() (+1 more)

### Community 197 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, db:schema, deploy:backend, dev, dev:presence, dev:web, dev:worker (+6 more)

### Community 198 - "useSoundEffects.ts"
Cohesion: 0.18
Nodes (17): EFFECTS, EffectSpec, FOOTSTEPS, SoundEffects, useSoundEffects(), gestured(), OPTIONS, applyMix() (+9 more)

### Community 199 - "domain/sketch.ts"
Cohesion: 0.11
Nodes (25): listPieces(), pieceImageUrl(), PieceRow, toPieceDto(), GalleryRow, planSketchRound(), SKETCH_CHOICES, SketchCandidate (+17 more)

### Community 200 - "ticket/route.ts"
Cohesion: 0.33
Nodes (8): GET(), PER_IP, POST(), presenceUrl(), homeSlugOf(), exportWallet(), isCatalogItem(), validRoomBase()

### Community 201 - "messages.ts"
Cohesion: 0.31
Nodes (6): checkMessage(), INVISIBLE, MESSAGE_MAX, MessageCheck, normalizeMessage(), hasProfanity()

### Community 202 - "RigPreview.tsx"
Cohesion: 0.09
Nodes (32): CrowdPreviewPage(), RigPreviewPage(), CrowdPreview(), draw(), KINDS, Stats, Window, NEXT (+24 more)

### Community 204 - "remote-visitors.ts"
Cohesion: 0.07
Nodes (24): writeHidden(), createRenderer(), createRigLayer(), RigState, Rig, RemoteVisitor, createPlayerCard(), hide() (+16 more)

### Community 205 - "nearby.ts"
Cohesion: 0.18
Nodes (6): createNearby(), Nearby, NearbyReach, RoomSpan, reach, strip

### Community 206 - "usePondState"
Cohesion: 0.33
Nodes (7): fetchPondBounties(), memberId(), getPondStateSnapshot(), subscribePondState(), usePondState(), PondHud(), PondHudProps

### Community 207 - "catalog.ts"
Cohesion: 0.19
Nodes (17): confirmClean(), CatalogItem, CatalogKind, FREE_CHARACTERS, ITEMS, ItemSlot, expected, slots (+9 more)

### Community 208 - "gallery.ts"
Cohesion: 0.21
Nodes (16): grantPearls(), deletePiece(), GalleryPiece, hangPiece(), MAX_STANDS, movePiece(), unhangPiece(), evaluatePublishBar() (+8 more)

### Community 209 - "VitalsReporter.tsx"
Cohesion: 0.29
Nodes (8): firstPainting(), flush(), Metric, queue, REPORTED, VitalsReporter(), FIRST_PAINTING_MARK, MUSEUM_START_MARK

### Community 210 - "AccountSheet.tsx"
Cohesion: 0.07
Nodes (35): PresencePreviewPage(), AccountHost(), AccountSheet, NAME_ERRORS, Pending, View, KeepOnOtherDevices(), AccountMode (+27 more)

### Community 212 - "Medium"
Cohesion: 0.22
Nodes (9): onClick(), 10. Long names run off the name sign, 11. The rooms API skips the stale-tab member check, 12. The bunny is dragged along while you pan in Decorate, 6. Failed saves are nearly invisible, and nothing retries, 7. Two tabs editing the same room overwrite each other, 8. The drawer's card row can't be scrolled on touch screens, 9. Decorating can't be done with the keyboard (+1 more)

### Community 213 - "vitals.ts"
Cohesion: 0.16
Nodes (15): dynamic, format(), grade(), METRICS, PAGES, PerformancePage(), RANGES, DEVICES (+7 more)

### Community 214 - "player-card.ts"
Cohesion: 0.11
Nodes (13): Door, doorOf(), PlayerCard, wallpaperOf(), cozyLevel, cozyWorth(), Built (2026-11-21), Decisions (+5 more)

### Community 215 - "icons.tsx"
Cohesion: 0.27
Nodes (8): BaitTray(), BaitTrayProps, GuestRollOptions, BaitId, GLYPHS, PearlIcon(), POND_CRIMSON, PondIconName

### Community 216 - "npc-sheet.cjs"
Cohesion: 0.31
Nodes (8): CFG, closeEye(), eraseMouth(), inpaint(), sample(), sharp, [src, out, cfgPath], warp()

### Community 218 - "master"
Cohesion: 0.28
Nodes (9): closedWaist(), goldOutfits(), image(), master(), placed(), rig(), slimGlb(), write() (+1 more)

### Community 221 - "SoundProvider.tsx"
Cohesion: 0.32
Nodes (5): SoundContext, SoundState, EffectName, STATIC_BASE, staticUrl()

### Community 222 - "xdog.ts"
Cohesion: 0.27
Nodes (7): renderSketch(), blur(), kernel(), toGray(), XDOG_DEFAULTS, xdogInk(), XdogOptions

### Community 223 - "links.ts"
Cohesion: 0.36
Nodes (7): guides(), museumDoors(), EXITS, isDoor(), linkedDoor(), ROOM_PATH, doorTarget()

### Community 224 - "4. Transport: Cloudflare Durable Objects"
Cohesion: 0.25
Nodes (8): 4. Transport: Cloudflare Durable Objects, Decision (2026-10-31), Deploying, Identity cannot be forged, Local development and tests, Rooms and capacity, Shape of `apps/presence` (about 200 lines), main()

### Community 226 - "Personal room: stress-test issues"
Cohesion: 0.29
Nodes (5): Checked and fine, Not covered by this pass, Personal room: stress-test issues, Status (2026-11-06), Test data left in the local database

### Community 227 - "Other visitors"
Cohesion: 0.29
Nodes (6): How it plays, Other visitors, Privacy, Running it in production, Running it locally, Staying consistent

### Community 228 - "paintedCostume"
Cohesion: 0.33
Nodes (5): paintedCostume(), floralOutfits(), turned(), Fitting clothes to other characters, Headpieces

## Knowledge Gaps
- **5 isolated node(s):** `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1651 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **30 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `AccountSheet.tsx` to `features/economy/index.ts`, `queryOne`, `SketchGuess.tsx`, `DoorEditor.tsx`, `app/layout.tsx`, `npc-layer.ts`, `machine.ts`, `Museum.tsx`, `bug-report.ts`, `Test Fakes and Helpers`, `LeaderboardPanel.tsx`, `DecorDrawer.tsx`, `room-events.ts`, `PersonalRoom.tsx`, `HallArranger.tsx`, `react`, `Walkthrough.tsx`, `Web Package Dependencies`, `risk.ts`, `assetUrl`, `actions.ts`, `useSound`, `LandingFx`, `Water.tsx`, `pond-format.ts`, `app/page.tsx`, `a/[slug]/page.tsx`, `traversal.ts`, `SyncStore`, `domain/guestboard.ts`, `BountyPanel.tsx`, `stage.ts`, `useSoundEffects.ts`, `RigPreview.tsx`, `usePondState`, `VitalsReporter.tsx`, `icons.tsx`, `SoundProvider.tsx`, `ClosetView.tsx`, `wardrobe.ts`, `FishingView.tsx`, `useBackgroundMusic.ts`, `PondRoom.tsx`?**
  _High betweenness centrality (0.093) - this node is a cross-community bridge._
- **What connects `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json` to the rest of the system?**
  _5 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `features/economy/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Why does `three` connect `remote-visitors.ts` to `scene/assets.ts`, `npc-layer.ts`, `overlay.ts`, `scene.ts`, `cozy.ts`, `room-events.ts`, `Placement`, `ambience.ts`, `Web Package Dependencies`, `remote-visitors.ts`, `perf.ts`, `pedestal.ts`, `atelier.ts`, `hang-tag.ts`, `CameraRig`, `stage.ts`, `scene/ambience.ts`, `RigPreview.tsx`, `remote-visitors.ts`, `stone-path-bake.ts`, `pond/room.ts`, `paintedCostume`, `wardrobe.ts`, `rig.ts`, `hit.ts`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **Should `walk.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13227513227513227 - nodes in this community are weakly interconnected._
- **Why does `Placement` connect `Placement` to `personal/room.ts`, `rooms.ts`, `cozy.ts`, `DecorDrawer.tsx`, `catalog.ts`, `PersonalRoom.tsx`, `HallArranger.tsx`, `player-card.ts`, `themes.ts`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Should `SketchGuess.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08048103607770583 - nodes in this community are weakly interconnected._