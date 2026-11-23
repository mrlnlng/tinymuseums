# Graph Report - tiny-museum  (2026-11-22)

## Corpus Check
- 565 files · ~346,553 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 106 file(s) not represented in the graph (top: .avif 56, .glb 38, .css 7)

## Summary
- 5070 nodes · 13122 edges · 235 communities (199 shown, 36 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 259 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5a7ecef5`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- AtelierKeeps.tsx
- Walker
- SketchGuess.tsx
- src/rooms/doors.ts
- builtUrl
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
- DecorController
- react
- pond-api.ts
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
- queryOne
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
- createCozyBackdrop
- atelier.ts
- compose-atelier.mjs
- BunnyArtist.tsx
- pond-format.ts
- pond/art.ts
- economy/store.ts
- mutation-guard.ts
- room.ts
- minimap.ts
- wander.test.ts
- domain/guestboard.ts
- Sound Effect Assets
- art-cache.ts
- Custom HTTP Headers
- Sharp Layer Package
- stage.ts
- scene/ambience.ts
- Confirmed issues
- rooms.ts
- session.ts
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
- npc-layer.ts
- Placement
- json
- graftCostume
- pondgame/lib/api.ts
- worker/tsconfig.json
- core/tsconfig.json
- wallet/body.ts
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
- next
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
- createHallRoom
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
- assetUrl
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
- guestboard/route.ts
- icon-basket
- DoorEditor
- Curating the paintings (2026-11-07)
- Pedestal
- bunny-left
- Local end-to-end stress test — 2026-11-06
- bunny-right
- ColorRecall.tsx
- visits.ts
- icon-home
- reveal.ts
- createStage
- ticket
- schedule.test.ts
- Storyline (draft, saved 2026-11-17)
- Low
- bake-pond-path.mjs
- a/[slug]/page.tsx
- themes.ts
- draw.py
- themes.ts
- import-landing-assets.mjs
- slots/store.ts
- BountyPanel.tsx
- Monets Lily Pond: exploration, UX and multiplayer QA
- rooms/art.ts
- createRigState
- ArtCache
- scripts
- useSoundEffects.ts
- domain/sketch.ts
- ticket.ts
- messages.ts
- RigPreview.tsx
- npcs/README.md
- createRemoteVisitors
- nearby.ts
- shopkeeper.ts
- catalog.ts
- gallery.ts
- .webSocketMessage
- AccountSheet.tsx
- CrowdPreview.tsx
- ref_node_assert
- performance/page.tsx
- player-card.ts
- icons.tsx
- createPersonalRoom
- Cafe
- TreeSparkles
- doors.sql
- Notes
- xdog.ts
- links.ts
- HelmShare
- plan.ts
- share.ts
- Other visitors
- flick.ts
- CozyBackdrop
- s3-storage.ts
- Sitting
- focus.ts
- LiveReflection
- boundedCameraX

## God Nodes (most connected - your core abstractions)
1. `react` - 82 edges
2. `json()` - 72 edges
3. `query()` - 71 edges
4. `PersonalRoom()` - 67 edges
5. `hit()` - 58 edges
6. `limited()` - 52 edges
7. `three` - 49 edges
8. `next` - 47 edges
9. `Traversal` - 46 edges
10. `createHallRoom()` - 44 edges

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

## Communities (235 total, 36 thin omitted)

### Community 0 - "AtelierKeeps.tsx"
Cohesion: 0.12
Nodes (22): openAccount(), openAccountCreation(), CoinToast(), Toast, Purse(), Stamp(), STAMP_ASPECT, STAMP_URL (+14 more)

### Community 2 - "SketchGuess.tsx"
Cohesion: 0.15
Nodes (24): bestKeyFor(), BURST, clueUrl(), Phase, pickAtRandom(), readDifficulty(), readMode(), saveIfHigher() (+16 more)

### Community 3 - "src/rooms/doors.ts"
Cohesion: 0.10
Nodes (31): hallDoorSpan(), ENTRANCE, HallPainting, PIXELS, REASONS, DoorsRow, parsed(), saveDoorsDraft() (+23 more)

### Community 4 - "builtUrl"
Cohesion: 0.09
Nodes (29): Loading(), dynamic, Hall(), MuseumPage(), [BRAND_OWNER, ...BRAND_REST], CurrentlyShowing(), Decor(), dynamic (+21 more)

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
Nodes (42): AssetManifest, assetUrl(), bitmapTexture(), blankImage(), CAFE_CAT_FRAMES, CompressedLoader, elementTexture(), ENTRANCE_FILES (+34 more)

### Community 9 - "SyncStore"
Cohesion: 0.17
Nodes (4): parseStored(), readStored(), deepEq(), SyncStore

### Community 10 - "machine.ts"
Cohesion: 0.12
Nodes (35): CastMeter(), ReelMeter(), armCast(), BITE_WINDOW, biteGap(), CHARGE_PERIOD, chargePower(), createFishingState() (+27 more)

### Community 11 - "Museum.tsx"
Cohesion: 0.10
Nodes (33): motion@^13.1.1, Loading(), AtelierLoading(), CoinFound, ColorRecall, GameDesktop, GuestBoard, HallArranger (+25 more)

### Community 12 - "Test Fakes and Helpers"
Cohesion: 0.12
Nodes (27): deferredFetch(), deviceSlot, FakeEvents, FakeStorage, fixture, fixtureB, fixtureRegistry, fixtureRegistryBoth (+19 more)

### Community 13 - "scene.ts"
Cohesion: 0.06
Nodes (22): disposeDisplayTexture(), prefersAvif(), HiddenCoin, PedestalVoice, placeholderTexture(), hallDoorSpans(), HallScene, markFirstPainting() (+14 more)

### Community 14 - "cozy.ts"
Cohesion: 0.08
Nodes (29): ATELIER_PROPS, AtelierImage, atticWindowCanvas(), bareBulbCanvas(), boardsCanvas(), cobwebCanvas(), cozyFinishImageUrl(), creamCanvas() (+21 more)

### Community 15 - "DecorDrawer.tsx"
Cohesion: 0.10
Nodes (28): DecorDrawer, DecorDrawerProps, SLOT_LABELS, Tab, TABS, categoryOf(), DrawerCategory, FINISH_NAMES (+20 more)

### Community 16 - "room-events.ts"
Cohesion: 0.10
Nodes (30): ChatButton(), REFUSED, joinRoom(), emit(), getPeople(), isInRoom(), isMuted(), muted (+22 more)

### Community 17 - "schedule.ts"
Cohesion: 0.07
Nodes (55): addDwellEmotes(), addEmote(), addGap(), addStand(), addWalk(), along(), buildRoomTable(), buildStayPlan() (+47 more)

### Community 18 - "ref_node_assert"
Cohesion: 0.12
Nodes (29): defineSlot(), docBytes(), SLOTS, upgrade(), byAtThenKey(), encoded(), latest, mapOf() (+21 more)

### Community 19 - "amplify/package.json"
Cohesion: 0.08
Nodes (26): amplifyDir, backend, everyMinutes, mediaBucket, missing, repoRoot, REQUIRED, setting() (+18 more)

### Community 20 - "PersonalRoom.tsx"
Cohesion: 0.09
Nodes (53): errorReason(), Offer, overDrawer(), PersonalRoom(), canPlaceNew(), carriedTo(), carryEnd(), carryMove() (+45 more)

### Community 21 - "prepare-models.mjs"
Cohesion: 0.06
Nodes (43): paintedCostume(), alongArm(), ARMS, armTurn(), BODIES, bruce, BRUCE_FIT, BRUCE_PLACE (+35 more)

### Community 22 - "Traversal"
Cohesion: 0.08
Nodes (10): coverFloorTransition(), JumpPose, createRoomPassage(), fixture(), clamp(), JUMP_KEYS, fixture(), jump() (+2 more)

### Community 23 - "core/package.json"
Cohesion: 0.16
Nodes (13): devDependencies, @types/bcryptjs@^2.4.6, @types/pg@^8.11.10, main, name, private, scripts, typecheck (+5 more)

### Community 24 - "media/storage.ts"
Cohesion: 0.09
Nodes (17): CONTENT_TYPES, GET(), PUT(), ACCEPTED, createAssetFromUpload(), MAX_UPLOAD_BYTES, presignUpload(), registerUpload() (+9 more)

### Community 25 - "DecorController"
Cohesion: 0.07
Nodes (5): Job, DecorController, GhostOptions, HighlightArea, WorkKind

### Community 26 - "react"
Cohesion: 0.10
Nodes (26): ColorRecall(), ColorRecallProps, Phase, readBest(), ColorRound, showMs(), openBugReport(), fitWidth() (+18 more)

### Community 27 - "pond-api.ts"
Cohesion: 0.18
Nodes (25): refreshWalletNow(), buyPondBait(), claimPondBounty(), errorOf(), exchangePondPearls(), fetchPondBounties(), fetchPondDex(), fetchPondLeaderboard() (+17 more)

### Community 28 - "ambience.ts"
Cohesion: 0.12
Nodes (29): blade(), bloom(), BLOOMS, createPondAmbience(), update(), fishTexture(), frond(), FRONT_ROWS (+21 more)

### Community 29 - "core/src/index.ts"
Cohesion: 0.05
Nodes (121): CatchExtra, COLUMNS, insertCatch(), member(), namedMember(), randomId(), StatePatch, addBait() (+113 more)

### Community 30 - "Web Package Dependencies"
Cohesion: 0.07
Nodes (34): dependencies, embla-carousel-react@^8.6.0, next@^15.0.3, react@^19.0.0, react-dom@^19.0.0, swr@^2.5.1, three@^0.169.0, thumbhash@^0.1.1 (+26 more)

### Community 31 - "Gamifying Tiny Museum — genre direction & engagement research"
Cohesion: 0.10
Nodes (19): 0.1 The core experience, 0.2 Systems that make gamification cheap to build, 0.3 Constraints that shape any recommendation, 0. What the game is today (the deep dive), 1.1 The landscape (seven candidates, with verdicts), 1.2 Recommendation: a **cozy gallery life-sim** — "the gallery you live in", 1.3 The five design pillars the genre implies, 1. Genre direction (+11 more)

### Community 32 - "features/rooms/doors.ts"
Cohesion: 0.23
Nodes (10): MuseumLayout(), WalletProvider(), doorDefs(), setMuseumDoors(), MuseumDoors(), MuseumStage(), roomLabel(), publishedDoors() (+2 more)

### Community 33 - "remote-visitors.ts"
Cohesion: 0.08
Nodes (48): Assets, Scenery, CUTS, disposeBoards(), Mark, plane(), ROPE_CUTS, ropeSlices() (+40 more)

### Community 34 - "risk.ts"
Cohesion: 0.12
Nodes (32): Hud(), HudProps, HudWagerChip, WagerPicker(), chooseTier(), WagerPickerProps, CastOptions, PondStateView (+24 more)

### Community 35 - "amplify/tsconfig.json"
Cohesion: 0.20
Nodes (9): compilerOptions, module, moduleResolution, noUnusedLocals, noUnusedParameters, exclude, extends, include (+1 more)

### Community 36 - "5. Customization menu — what other people are doing"
Cohesion: 0.12
Nodes (16): 1. The target: what "Claude Opus 5.5" actually means, 2. Where your harness stands today (live config I read), 3. The honest gap model, 4. Quality levers, ranked by leverage, 5. Customization menu — what other people are doing, 6. Recommended starting kit for *your* profile, 7. What I can apply for you right now (needs your go-ahead), A. Prompt & persona (most common quality customizations) (+8 more)

### Community 37 - "remote-visitors.ts"
Cohesion: 0.05
Nodes (26): CharacterSprites, Attachment, Carried, CarriedState, Character, Perch, Pose, centerYFor() (+18 more)

### Community 38 - "queryOne"
Cohesion: 0.09
Nodes (24): ConfirmFollow(), dynamic, dynamic, Unsubscribe(), AnalyticsPage(), dynamic, FollowNotice(), BRAND (+16 more)

### Community 39 - "Web TSConfig"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 40 - "Root Package Manifest"
Cohesion: 0.10
Nodes (22): [, width, height], description, devDependencies, concurrently@^9.1.0, esbuild@^0.24.0, ktx2-encoder@^0.6.0, maxrects-packer@^2.7.3, playwright@^1.63.0 (+14 more)

### Community 41 - "hitForVisitor"
Cohesion: 0.08
Nodes (44): ALLOWED, PER_VISITOR, POST(), POST(), GLOBAL, PER_IP, POST(), GLOBAL (+36 more)

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
Cohesion: 0.23
Nodes (13): sameOriginUrl(), PreparedGame, decodeImage(), fetchBitmap(), fetchRound(), guarded(), LoadedRound, loadInk() (+5 more)

### Community 47 - "actions.ts"
Cohesion: 0.11
Nodes (43): back(), createCodeAction(), deleteCodeAction(), deleteGuestNoteAction(), deletePieceAction(), discardDoorsAction(), discardLocationAction(), nudgeInRowAction() (+35 more)

### Community 48 - "handlers.ts"
Cohesion: 0.10
Nodes (32): confirmedFollowers(), sealEpoch(), handleDerivatives(), handleNotifyFollowers(), handleRenderDisplay(), handleSealEpoch(), renderPieceFrame(), renderPieceSketch() (+24 more)

### Community 49 - "LandingFx"
Cohesion: 0.07
Nodes (32): between(), CAT, Edge, EDGES, runLandingCat(), choosePeeker(), peek(), walk() (+24 more)

### Community 50 - "Water.tsx"
Cohesion: 0.07
Nodes (39): AmbientShadow, box(), BUCKET, bunnyBox(), easeOut(), Glint, LEFT_STYLE, lineColour() (+31 more)

### Community 51 - "Worker Package Manifest"
Cohesion: 0.14
Nodes (14): dependencies, @tiny/core@*, exports, ./lambda, @tiny/core, main, name, private (+6 more)

### Community 52 - "Public Asset Manifest"
Cohesion: 0.12
Nodes (15): artworks, bunny, size, floor, size, fonts, icon-no-photos, size (+7 more)

### Community 53 - "createCozyBackdrop"
Cohesion: 0.23
Nodes (13): alphaCanvas(), ceilingGeometry(), createCozyBackdrop(), clearGlows(), glow(), paintShade(), placeGlows(), placeSides() (+5 more)

### Community 54 - "atelier.ts"
Cohesion: 0.05
Nodes (34): AtelierActions, AtelierDoor, AtelierImage, BuiltRoom, Cardigan, CARDIGAN_NAMES, ClothingItem, Control (+26 more)

### Community 55 - "compose-atelier.mjs"
Cohesion: 0.12
Nodes (10): body, dressLayer, dressWidth, floralWidth, hanger, MANNEQUIN_CANVAS, mask, root (+2 more)

### Community 56 - "BunnyArtist.tsx"
Cohesion: 0.40
Nodes (5): BunnyArtist(), BunnyMood, Pencil(), POSES, 4. Suggested plan

### Community 57 - "pond-format.ts"
Cohesion: 0.13
Nodes (25): PondDex, EXCHANGE_DAILY_STAMPS, EXCHANGE_PEARLS_PER_STAMP, FISH_ART, fishArt(), formatPercent(), formatShortSizeCm(), ODDS_BAIT (+17 more)

### Community 58 - "pond/art.ts"
Cohesion: 0.25
Nodes (13): ArtByRoom, colorAt(), decoded(), EDGE_BAND, EDGE_BANDS, EDGE_OVERLAP, edgeTexture(), imageOf() (+5 more)

### Community 59 - "economy/store.ts"
Cohesion: 0.07
Nodes (62): CARRY_CAP, carryAdd(), CarryEntry, carryPrune(), carryRemove(), chunk(), buildClaim(), BuiltClaim (+54 more)

### Community 60 - "mutation-guard.ts"
Cohesion: 0.67
Nodes (3): allowedOrigin(), isSameOriginMutation(), LOOPBACK

### Community 61 - "room.ts"
Cohesion: 0.14
Nodes (29): admitted(), Attachment, farewell(), GHOST_MS, HELLO_TIMEOUT_MS, holdsOf(), homeOf(), MAX_WAITING_PER_IP (+21 more)

### Community 62 - "minimap.ts"
Cohesion: 0.08
Nodes (34): place(), createMinimap(), draw(), drawRoom(), floors(), follow(), sketchOf(), doorPoint() (+26 more)

### Community 63 - "wander.test.ts"
Cohesion: 0.12
Nodes (17): FloorSpot, Job, Place, Phase, ResidentState, Run, WalkPath, WalkState (+9 more)

### Community 64 - "domain/guestboard.ts"
Cohesion: 0.07
Nodes (46): GET(), shape(), BoardScreen(), BoardScreenProps, ComposeScreen(), ComposeScreenProps, blankDraft(), GuestBoard() (+38 more)

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

### Community 69 - "stage.ts"
Cohesion: 0.04
Nodes (31): CameraRig, Viewport, createPixelRatioGovernor(), PIXEL_RATIO_STEPS, Options, Pose, Room, STANDING (+23 more)

### Community 70 - "scene/ambience.ts"
Cohesion: 0.13
Nodes (13): BULBS, createHallAmbience(), finish(), glowTexture(), HallAmbience, mulberry(), painted(), vignetteTexture() (+5 more)

### Community 71 - "Confirmed issues"
Cohesion: 0.12
Nodes (17): Confirmed issues, E2E-002 — Valid edge placement rejected through floating-point precision, E2E-003 — One owned prop can be placed multiple times, E2E-004 — Reload before autosave silently loses the latest placement, E2E-005 — Failed save and failed Done have no visible mobile explanation, E2E-006 — Restoring connectivity does not retry a failed draft save, E2E-007 — Keyboard activation cannot place drawer items, E2E-008 — Creating an account from My Room leaves the signed-in user on the sign-in prompt (+9 more)

### Community 72 - "rooms.ts"
Cohesion: 0.11
Nodes (28): dynamic, HomePage(), HomeSignIn(), artist(), member(), piece(), randomId(), ownershipFor() (+20 more)

### Community 73 - "session.ts"
Cohesion: 0.15
Nodes (19): GET(), PaintingRow, POST(), UPLOADS_PER_ARTIST, POST(), UPLOADS_PER_ARTIST, dynamic, RoomPage() (+11 more)

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
Cohesion: 0.16
Nodes (15): createPresence(), drop(), heartbeat(), maybeSend(), onPageHide(), receive(), scheduleRetry(), send() (+7 more)

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
Cohesion: 0.07
Nodes (19): bodyTextures, COATS, { json, bin }, manifest, maps, target, BASEBOARD, CURTAIN (+11 more)

### Community 93 - "infra/jobs.ts"
Cohesion: 0.22
Nodes (16): loop(), shutdown(), sleep(), sweepStale(), DrainResult, handler(), repairFrames(), repairUnframed() (+8 more)

### Community 94 - "ClosetView.tsx"
Cohesion: 0.08
Nodes (31): ClosetView(), onKeyDown(), LISTS, PLACE, PODIUM_SRC, Props, Slot, SPOTLIGHT_SRC (+23 more)

### Community 95 - "pond/room.ts"
Cohesion: 0.12
Nodes (25): depthAtLift(), FAR_LIFT, FAR_SCALE, liftAt(), pathHalfWidth(), PondPath, PROP_DEPTH, scaleAt() (+17 more)

### Community 96 - "members.ts"
Cohesion: 0.09
Nodes (48): GET(), PER_MEMBER, PUT(), PER_IP, POST(), presenceUrl(), Code, 3.2 Chosen names (members) (+40 more)

### Community 104 - "wardrobe.ts"
Cohesion: 0.08
Nodes (50): AtelierPage(), dynamic, metadata, allowedCharacter(), OwnedSnapshot, owns(), walletReady(), getWalletSnapshot() (+42 more)

### Community 105 - "FishingView.tsx"
Cohesion: 0.12
Nodes (15): CONFETTI_COLORS, ConfettiPiece, makeConfetti(), RevealCard(), TIER_MS, TIER_SFX, useCountUp(), chainOffer (+7 more)

### Community 107 - "npc-layer.ts"
Cohesion: 0.15
Nodes (18): BY_ID, CAST, FRAME, IDLE, idleCel(), NPC_WALK_SPEED, NpcCharacter, WANDERER_IDS (+10 more)

### Community 108 - "Placement"
Cohesion: 0.06
Nodes (19): Carry, PersonalRoomProps, PlacementLayer, PlacementTheme, Admin mode (gamma), Catalogue, Data model (core), Decisions (2026-11-17, with the user) (+11 more)

### Community 109 - "json"
Cohesion: 0.08
Nodes (71): POST(), POST(), GET(), POST(), PER_MEMBER, PUT(), GET(), PER_MEMBER (+63 more)

### Community 110 - "graftCostume"
Cohesion: 0.27
Nodes (14): canvasFit(), compose(), graftCostume(), copyAccessor(), copyMaterial(), copyMesh(), copyTexture(), copyView() (+6 more)

### Community 111 - "pondgame/lib/api.ts"
Cohesion: 0.15
Nodes (28): CAST_ERRORS, coarsePointer(), FishingView(), initialEasyReel(), isTyping(), LOST, PondGameProps, Toast (+20 more)

### Community 112 - "worker/tsconfig.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 113 - "core/tsconfig.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 114 - "wallet/body.ts"
Cohesion: 0.24
Nodes (12): PER_MEMBER, POST(), baitIdOf(), integerOffset(), isRecord(), itemIdOf(), MAX_CLAIM_BATCH, MAX_WALLET_BODY_BYTES (+4 more)

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
Cohesion: 0.16
Nodes (21): fetch(), Env, isHome(), isItem(), isName(), isPid(), isSeq(), MAX_HOLDS (+13 more)

### Community 119 - "Costume gallery doorway"
Cohesion: 0.50
Nodes (3): Costume gallery doorway, Curtain colour edit, Prompt

### Community 120 - "layout.ts"
Cohesion: 0.08
Nodes (25): cafeAfterIndex(), comingSoonWidth(), computeLayout(), clear(), placeCafe(), cutRooms(), DoorSpan, HALL_DOOR_FOOT (+17 more)

### Community 121 - "Fishing forest: painted asset pass"
Cohesion: 0.10
Nodes (18): Assets, Bruce's collection refresh (2026-11-08), Fishing forest illustrations, Made by hand (not touched by the script), Main hall v2 (2026-11-10), Monets Lily Pond (2026-11-08), 1. Forest doorway, 2. Woodland noticeboard (+10 more)

### Community 124 - "The Costume Atelier"
Cohesion: 0.14
Nodes (13): Adding a character, Adding a costume, Art not supplied as files, Bruce's Chronicles, Checked against the mocks (2026-11-07), Code, Costume fit review, Floral collection (+5 more)

### Community 125 - "PondRoom.tsx"
Cohesion: 0.11
Nodes (19): Loading(), metadata, PondPage(), POND_NAME, PondLoading(), BOARD_TABS, PondOverlayKind, PondPanels() (+11 more)

### Community 126 - "rig.ts"
Cohesion: 0.12
Nodes (25): Layer, setCostumeVisibility(), follow(), canvasToModel(), disposeRigLayer(), Frame, loadRig(), dispose() (+17 more)

### Community 127 - "hit.ts"
Cohesion: 0.18
Nodes (11): CoinWall, createHiddenCoin(), Spot, AlphaMap, alphaMapFor(), alphaMaps, buildAlphaMap(), isPaintedAt() (+3 more)

### Community 128 - "next"
Cohesion: 0.07
Nodes (40): config, SECURITY_HEADERS, BugReportsPage(), dateFormat, dynamic, summary(), dateFormat, dynamic (+32 more)

### Community 129 - "presence/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, types, exclude, extends, include, ../../tsconfig.base.json

### Community 130 - "wallet.ts"
Cohesion: 0.07
Nodes (47): PER_MEMBER, POST(), grantPearls(), member(), now, piece(), randomId(), today (+39 more)

### Community 131 - "tsconfig.test.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 132 - "app/layout.tsx"
Cohesion: 0.11
Nodes (19): bethEllen, inspiratiq, metadata, notoSans, RootLayout(), sniglet, viewport, ServiceWorker() (+11 more)

### Community 133 - "dependencies"
Cohesion: 0.22
Nodes (9): dependencies, bcryptjs@^2.4.3, obscenity@^0.4.6, sharp@^0.33.5, thumbhash@^0.1.1, sharp, thumbhash, bcryptjs (+1 more)

### Community 134 - "peers.ts"
Cohesion: 0.08
Nodes (19): PresencePreviewPage(), PresencePreview(), Entry, INTERPOLATION_DELAY_MS, PEER_TIMEOUT_MS, PeerTable, positionAt(), RemoteVisitor (+11 more)

### Community 135 - "run.ts"
Cohesion: 0.17
Nodes (9): admin, childEnv, client, database, fresh, migrations, target, pg@^8.13.1 (+1 more)

### Community 136 - "createHallRoom"
Cohesion: 0.11
Nodes (18): createCarried(), createHelm(), createMatcha(), LobbySigns, createHallRoom(), buildRoom(), buildRoomContents(), cafeRoom() (+10 more)

### Community 137 - "npc-layer.ts"
Cohesion: 0.18
Nodes (21): castMember(), createNpcLayer(), createResidentView(), createView(), departedRecently(), draw(), fadeOut(), glyphWidth() (+13 more)

### Community 138 - "exports"
Cohesion: 0.15
Nodes (13): exports, ./brand, ./bugs, ./economy, ./guestboard, ./presence, ./presence/messages, ./presence/wire (+5 more)

### Community 139 - "room-places.ts"
Cohesion: 0.14
Nodes (24): HallLayout, atelierRoomInfo(), atelierX(), copy(), FurniturePlacement, hallCache, hallRoomInfo(), onGround() (+16 more)

### Community 140 - "bug-report.ts"
Cohesion: 0.11
Nodes (27): BugReportHost(), BugReportSheet, BugReportSheet(), send(), Status, collectContext(), inAppBrowser(), onOpenBugReport() (+19 more)

### Community 141 - "createHallRoom"
Cohesion: 0.09
Nodes (8): CafeLink, FunZoneSign, GuestBoardNotes, Placards, toScreen(), createSitting(), hop(), raise()

### Community 142 - "LeaderboardPanel.tsx"
Cohesion: 0.25
Nodes (14): PondBoardId, PondBoardPeriod, PondBoardRow, PondLeaderboard, formatInteger(), formatOdds(), nextMondayUtc(), BoardRow() (+6 more)

### Community 143 - "env.ts"
Cohesion: 0.18
Nodes (11): getPool(), poolConfig(), sslFor(), env, isProduction(), presenceSecret(), required(), sessionSecret() (+3 more)

### Community 144 - "The Moonlit Pond — design"
Cohesion: 0.09
Nodes (22): Art the pond needs from the artist, Build contract (decided 2026-11-07), Build phases, Collection and goals, Done, Done, Guardrails, Leaderboards (+14 more)

### Community 145 - "Pond rework"
Cohesion: 0.18
Nodes (10): Baits, Client, Decisions, Done, Notes, Pond rework, Server, Species (+2 more)

### Community 146 - "createStage"
Cohesion: 0.20
Nodes (14): initialize(), aim(), drawFrame(), handleClick(), handlePointerDown(), handlePointerMove(), prefetchNearDoors(), renderFrame() (+6 more)

### Community 147 - "Orchestration contract — you plan, DSH workers execute"
Cohesion: 0.29
Nodes (6): Briefing a worker, Budget hygiene, graphify, Orchestration contract — you plan, DSH workers execute, The worker, When not to delegate

### Community 148 - "tables.ts"
Cohesion: 0.09
Nodes (38): BaitTray(), BaitTrayProps, RevealCardProps, PondCatch, CatchView, debugSpecies(), debugVariant(), GuestRoll (+30 more)

### Community 149 - "lib/presence.ts"
Cohesion: 0.13
Nodes (13): Connect, connectWebSocket(), HEARTBEAT_MS, HIDDEN_LIMIT_MS, SocketHandlers, Clock, Conn, flush() (+5 more)

### Community 150 - "HallArranger.tsx"
Cohesion: 0.25
Nodes (8): HallArranger(), HallArrangerProps, HallRoomData, Painting, currentHallOrder(), hallPlacements(), paintingOrder(), reasonLabel()

### Community 151 - "pond-state.ts"
Cohesion: 0.25
Nodes (14): PondStateView, PondTier, ensurePondStateStarted(), getPondStateSnapshot(), GUEST, listeners, LOADING, PondStateSnapshot (+6 more)

### Community 153 - "pond-boards.ts"
Cohesion: 0.13
Nodes (20): BOARDS, oneOf(), PER_VISITOR, PERIODS, compare(), DexRow, displayName(), FeedRow (+12 more)

### Community 154 - "epoch.ts"
Cohesion: 0.17
Nodes (19): GET(), intParam(), GET(), sketchPool, unavailable(), DoorsPage(), dynamic, hallPaintings() (+11 more)

### Community 155 - "hang-tag.ts"
Cohesion: 0.09
Nodes (10): CARD, createHangTag(), HangTag, HangTagStyle, HOLE, KNOT, Presence, What goes, and what replaces it (+2 more)

### Community 156 - "assetUrl"
Cohesion: 0.16
Nodes (21): doorArtUrl(), loadDoorArt(), loadRoomDoorArt(), pending, canvasTexture(), ceilingTexture(), cozyPropImageUrl(), fishTexture() (+13 more)

### Community 157 - "Walkthrough.tsx"
Cohesion: 0.13
Nodes (22): BACKDROP_STYLE, MoreArrow(), NavArrow(), Props, SLIDE, Walkthrough(), XIcon(), decodedFrames (+14 more)

### Community 158 - "createPondRoom"
Cohesion: 0.30
Nodes (14): pathX(), createPondRoom(), approach(), busy(), finishWalk(), goTo(), leave(), move() (+6 more)

### Community 159 - "import-home-assets.mjs"
Cohesion: 0.10
Nodes (17): file(), DOOR, DOOR_BACKDROP, drop, FURNITURE, manifest, manifestPath, masters (+9 more)

### Community 160 - "createPlacementLayer"
Cohesion: 0.31
Nodes (8): aspectOf(), createPlacementLayer(), drawOutline(), dropGhosts(), dropHelper(), extrasFor(), silhouette(), sizeOf()

### Community 161 - "Atelier: the dressing mirror, and show-don't-tell keeping"
Cohesion: 0.13
Nodes (14): Atelier: the dressing mirror, and show-don't-tell keeping, Build order, Built (2026-11-20), Decisions (2026-11-19), Follow-ups (2026-11-20), Goal, In the room, Keeping (+6 more)

### Community 162 - "personal/room.ts"
Cohesion: 0.14
Nodes (16): PersonalArt, DOOR_SIGN, gloomFor(), lightOf(), NAME_SIGN, OPEN_SIGN, PersonalRoomOptions, CozyArt (+8 more)

### Community 163 - "painting-open"
Cohesion: 0.50
Nodes (4): file, kilobytes, seconds, painting-open

### Community 164 - "ref_sharp"
Cohesion: 0.13
Nodes (9): manifest, CFG, closeEye(), eraseMouth(), inpaint(), sample(), sharp, [src, out, cfgPath] (+1 more)

### Community 165 - "Multiplayer ("other visitors") — plan v2 (Cloudflare)"
Cohesion: 0.10
Nodes (20): 0. Summary, 10. Decisions, 1. Product contract changes (approved 2026-10-31), 2. What already exists that this builds on, 3.1 Generated names (everyone has one), 3. Names, 4. Transport: Cloudflare Durable Objects, 5.1 Emotes (v1) (+12 more)

### Community 167 - "assetUrl"
Cohesion: 0.29
Nodes (11): fetchPondFeed(), PondFeedItem, catchLabel(), formatSizeCm(), speciesFor(), speciesName(), speciesTier(), isGolden() (+3 more)

### Community 168 - "guestboard/route.ts"
Cohesion: 0.22
Nodes (12): POST(), POST(), rateLimitedResponse(), rejectedResponse(), BugReportRateLimited, postBugReport(), enforceLimits(), GuestNoteRateLimited (+4 more)

### Community 169 - "icon-basket"
Cohesion: 0.67
Nodes (3): icon-basket, file, vector

### Community 170 - "DoorEditor"
Cohesion: 0.24
Nodes (15): saveDoorsAction(), DoorEditor(), add(), apply(), commitSlide(), nudge(), pick(), pointerDown() (+7 more)

### Community 171 - "Curating the paintings (2026-11-07)"
Cohesion: 0.12
Nodes (15): hang(), 1. The registry and the table, 2. The studio's Location picker, 3. The rooms draw what is placed, 4. Credits, 5. Retiring self-serve artists, Building it, Curating the paintings (2026-11-07) (+7 more)

### Community 172 - "Pedestal"
Cohesion: 0.14
Nodes (4): Helm, createNotes(), createPedestal(), Pedestal

### Community 174 - "Local end-to-end stress test — 2026-11-06"
Cohesion: 0.22
Nodes (7): Environment and coverage, Follow-up coverage, Issue index, Local end-to-end stress test — 2026-11-06, Measured load, Passing checks and interpretation limits, Test data and cleanup

### Community 176 - "ColorRecall.tsx"
Cohesion: 0.14
Nodes (26): serverSnapshot, useEarnEvents(), useWallet(), EarnSource, GameSource, buy(), BuyOutcome, EarnedEvent (+18 more)

### Community 177 - "visits.ts"
Cohesion: 0.12
Nodes (25): state(), amount(), duration(), dynamic, LANDMARKS, PAGES, RANGES, share() (+17 more)

### Community 179 - "reveal.ts"
Cohesion: 0.20
Nodes (6): PlaceInfo, InkMap, createReveal(), compose(), PENCIL, SketchReveal

### Community 180 - "createStage"
Cohesion: 0.52
Nodes (7): createNearby(), createStage(), closeEntry(), enter(), isCurrent(), isQuiet(), open()

### Community 182 - "schedule.test.ts"
Cohesion: 0.08
Nodes (20): RESIDENT_IDS, JOBS, NpcGround, PlaceKind, ROOM_KINDS, ROOMS, PlaceInput, NpcRoom (+12 more)

### Community 183 - "Storyline (draft, saved 2026-11-17)"
Cohesion: 0.15
Nodes (12): Arc (soft, no fail state), Built so far, How it ties to what exists, Locked (2026-11-21, the owner), Next tasks (when picked up), Open questions, Premise, Revision (2026-11-21, the owner) (+4 more)

### Community 184 - "Low"
Cohesion: 0.15
Nodes (13): 13. Pages that redirect or don't exist answer 200, 14. Error codes reveal which room slugs exist, 15. The name sign slides under the top-right buttons in Decorate, 16. Level-up celebrations can be farmed, 17. No hint of where things are after panning away, 18. Too many items is only discovered by the server, 19. Development-only: page payloads include the full room row, Checked and fine (+5 more)

### Community 185 - "bake-pond-path.mjs"
Cohesion: 0.21
Nodes (7): blank(), manifest, manifestPath, ORIGINAL_SOURCE, originalPath(), root, softened()

### Community 186 - "a/[slug]/page.tsx"
Cohesion: 0.31
Nodes (6): ArtistPage(), dynamic, generateMetadata(), GET(), FollowForm(), getArtistPage()

### Community 187 - "themes.ts"
Cohesion: 0.07
Nodes (27): 1. Items placed against a zone edge fail to save, and the whole draft reverts, 2. One owned item can be placed many times, 3. Any save rejection throws away all unsaved work, 4. Changes made just before leaving are lost, 5. Fish trophies can be claimed without playing, High, ownsAll, ownsNone (+19 more)

### Community 189 - "themes.ts"
Cohesion: 0.26
Nodes (20): discardLocation(), hasUnpublished(), inUse(), locationStates(), nudgeInRow(), OWNER, placePainting(), PlaceResult (+12 more)

### Community 190 - "import-landing-assets.mjs"
Cohesion: 0.13
Nodes (9): socket(), CAT, drop, EXPECTED, manifest, manifestPath, masters, root (+1 more)

### Community 191 - "slots/store.ts"
Cohesion: 0.11
Nodes (20): ANON_PREFIX, anonKey(), deviceKey(), encodeStored(), isMemberSlotKey(), listKeys(), MEMBER_KEY, memberKey() (+12 more)

### Community 192 - "BountyPanel.tsx"
Cohesion: 0.30
Nodes (10): PondBounties, formatCountdown(), nextUtcMidnight(), utcDayLabel(), setPondState(), useCountdown(), useNow(), BountyPanel() (+2 more)

### Community 193 - "Monets Lily Pond: exploration, UX and multiplayer QA"
Cohesion: 0.29
Nodes (6): Browser and interaction coverage, Changes made from the walkthrough, Monets Lily Pond: exploration, UX and multiplayer QA, Multiplayer and load, Practical limits, Regression checks and cleanup

### Community 194 - "rooms/art.ts"
Cohesion: 0.17
Nodes (12): AtelierArt, disposeAtelierArt(), loadGalleryDoor(), loadGalleryPillar(), loadImage(), AtelierArtwork, HallArt, ROOM_ART (+4 more)

### Community 195 - "createRigState"
Cohesion: 0.21
Nodes (12): createCharacter(), contextLost(), loadFallbackWalk(), loseRig(), setFrame(), cache, queue, render() (+4 more)

### Community 197 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, db:schema, deploy:backend, dev, dev:presence, dev:web, dev:worker (+6 more)

### Community 198 - "useSoundEffects.ts"
Cohesion: 0.08
Nodes (35): StageOptions, RoomSound, SoundContext, SoundProvider(), SoundState, BackgroundMusic, clampVolume(), isDocumentHidden() (+27 more)

### Community 199 - "domain/sketch.ts"
Cohesion: 0.11
Nodes (28): listPieces(), pieceImageUrl(), PieceRow, toPieceDto(), GalleryRow, toPiece(), planSketchRound(), SKETCH_CHOICES (+20 more)

### Community 200 - "ticket.ts"
Cohesion: 0.22
Nodes (13): isCatalogItem(), decoder, encoder, fromBase64Url(), HmacKey, isOwn(), isTicket(), keyFor() (+5 more)

### Community 201 - "messages.ts"
Cohesion: 0.36
Nodes (6): checkMessage(), INVISIBLE, MESSAGE_MAX, MessageCheck, normalizeMessage(), hasProfanity()

### Community 202 - "RigPreview.tsx"
Cohesion: 0.27
Nodes (10): RigPreviewPage(), NEXT, PROPS, RigPreview(), draw(), approach(), GROUNDED, rigFacing() (+2 more)

### Community 204 - "createRemoteVisitors"
Cohesion: 0.21
Nodes (11): createRenderer(), createRigLayer(), createRemoteVisitors(), ensureLayer(), hideSprites(), load(), placeOwn(), show() (+3 more)

### Community 205 - "nearby.ts"
Cohesion: 0.18
Nodes (5): Nearby, NearbyReach, RoomSpan, reach, strip

### Community 206 - "shopkeeper.ts"
Cohesion: 0.15
Nodes (5): Rig, RigPiece, createShopkeeper(), GREETINGS, OUTFIT

### Community 207 - "catalog.ts"
Cohesion: 0.18
Nodes (18): confirmClean(), CatalogItem, CatalogKind, FREE_CHARACTERS, ITEMS, ItemSlot, STARTER_PROPS, expected (+10 more)

### Community 208 - "gallery.ts"
Cohesion: 0.24
Nodes (11): deletePiece(), GalleryPiece, hangPiece(), MAX_STANDS, movePiece(), unhangPiece(), evaluatePublishBar(), PublishCheck (+3 more)

### Community 209 - ".webSocketMessage"
Cohesion: 0.44
Nodes (3): attachmentOf(), Room, sendTo()

### Community 210 - "AccountSheet.tsx"
Cohesion: 0.06
Nodes (33): AccountHost(), AccountSheet, AccountSheet(), continueAnyway(), doSignOut(), runDelete(), runName(), submit() (+25 more)

### Community 211 - "CrowdPreview.tsx"
Cohesion: 0.25
Nodes (9): CrowdPreviewPage(), CrowdPreview(), draw(), KINDS, Stats, Window, loadKind(), clearRigLayer() (+1 more)

### Community 213 - "performance/page.tsx"
Cohesion: 0.31
Nodes (8): dynamic, format(), grade(), METRICS, PAGES, PerformancePage(), RANGES, summarizeVitals()

### Community 214 - "player-card.ts"
Cohesion: 0.09
Nodes (17): createPlayerCard(), hide(), onPointerDown(), Door, doorOf(), PlayerCard, wallpaperOf(), cozyLevel (+9 more)

### Community 215 - "icons.tsx"
Cohesion: 0.31
Nodes (6): GLYPHS, PearlIcon(), POND_CRIMSON, PondIconName, PondHud(), PondHudProps

### Community 216 - "createPersonalRoom"
Cohesion: 0.39
Nodes (7): placeLabel(), writeStyle(), createPersonalRoom(), light(), shade(), showArrangement(), signFilter()

### Community 222 - "xdog.ts"
Cohesion: 0.39
Nodes (5): blur(), kernel(), XDOG_DEFAULTS, xdogInk(), XdogOptions

### Community 223 - "links.ts"
Cohesion: 0.43
Nodes (6): museumDoors(), EXITS, isDoor(), linkedDoor(), ROOM_PATH, doorTarget()

### Community 225 - "plan.ts"
Cohesion: 0.43
Nodes (5): openingPlan(), prepareSketchGame(), planGame(), randomRound(), ROUND_SPREAD

### Community 226 - "share.ts"
Cohesion: 0.33
Nodes (5): ShareOutcome, shareResult(), ShareSummary, shareText(), base

### Community 227 - "Other visitors"
Cohesion: 0.29
Nodes (6): How it plays, Other visitors, Privacy, Running it in production, Running it locally, Staying consistent

### Community 228 - "flick.ts"
Cohesion: 0.53
Nodes (4): FLICK, flickDirection(), isUpwardFlick(), handlePointerUp()

### Community 230 - "s3-storage.ts"
Cohesion: 0.33
Nodes (5): @aws-sdk/client-s3@^3.1121.0, @aws-sdk/s3-request-presigner@^3.1121.0, S3StorageOptions, @aws-sdk/client-s3, @aws-sdk/s3-request-presigner

## Knowledge Gaps
- **5 isolated node(s):** `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1647 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **36 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `AtelierKeeps.tsx`, `next`, `SketchGuess.tsx`, `src/rooms/doors.ts`, `builtUrl`, `app/layout.tsx`, `peers.ts`, `Museum.tsx`, `bug-report.ts`, `Test Fakes and Helpers`, `LeaderboardPanel.tsx`, `DecorDrawer.tsx`, `room-events.ts`, `PersonalRoom.tsx`, `tables.ts`, `HallArranger.tsx`, `pond-state.ts`, `Walkthrough.tsx`, `Web Package Dependencies`, `risk.ts`, `assetUrl`, `actions.ts`, `ColorRecall.tsx`, `LandingFx`, `Water.tsx`, `pond-format.ts`, `a/[slug]/page.tsx`, `domain/guestboard.ts`, `BountyPanel.tsx`, `useSoundEffects.ts`, `RigPreview.tsx`, `AccountSheet.tsx`, `CrowdPreview.tsx`, `icons.tsx`, `ClosetView.tsx`, `wardrobe.ts`, `FishingView.tsx`, `pondgame/lib/api.ts`, `PondRoom.tsx`?**
  _High betweenness centrality (0.096) - this node is a cross-community bridge._
- **What connects `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json` to the rest of the system?**
  _5 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `AtelierKeeps.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12299465240641712 - nodes in this community are weakly interconnected._
- **Why does `three` connect `remote-visitors.ts` to `scene/assets.ts`, `scene.ts`, `cozy.ts`, `prepare-models.mjs`, `hang-tag.ts`, `ambience.ts`, `Web Package Dependencies`, `remote-visitors.ts`, `perf.ts`, `atelier.ts`, `pond/art.ts`, `rooms/art.ts`, `createRigState`, `stage.ts`, `scene/ambience.ts`, `stone-path-bake.ts`, `pond/room.ts`, `wardrobe.ts`, `npc-layer.ts`, `rig.ts`, `hit.ts`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **Should `SketchGuess.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1476923076923077 - nodes in this community are weakly interconnected._
- **Why does `defaultStore()` connect `AccountSheet.tsx` to `remote-visitors.ts`, `slots/store.ts`, `stage.ts`, `wardrobe.ts`, `pond-api.ts`, `createHallRoom`, `rooms.ts`, `SyncStore`, `pondgame/lib/api.ts`, `ColorRecall.tsx`, `room-events.ts`, `createStage`, `PersonalRoom.tsx`, `createStage`, `pond-state.ts`, `economy/store.ts`, `createPondRoom`, `pond/room.ts`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Should `src/rooms/doors.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10252100840336134 - nodes in this community are weakly interconnected._