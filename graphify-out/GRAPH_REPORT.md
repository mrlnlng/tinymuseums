# Graph Report - tiny-museum  (2026-11-28)

## Corpus Check
- 613 files · ~377,265 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 118 file(s) not represented in the graph (top: .avif 60, .glb 46, .css 7)

## Summary
- 5460 nodes · 14467 edges · 224 communities (200 shown, 24 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 280 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2341ab0b`
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
- three
- amplify/package.json
- atelier/room.ts
- prepare-models.mjs
- progress.ts
- core/package.json
- domain/guestboard.ts
- handlers.ts
- app/layout.tsx
- domain/sketch.ts
- ambience.ts
- core/src/index.ts
- Web Package Dependencies
- Gamifying Tiny Museum — genre direction & engagement research
- DoorEditor.tsx
- DecorDrawer.tsx
- risk.ts
- amplify/tsconfig.json
- 5. Customization menu — what other people are doing
- locations.ts
- wallet.ts
- Web TSConfig
- Root Package Manifest
- pond-api.ts
- npc-layer.ts
- actions.ts
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
- claim.ts
- compose-atelier.mjs
- AtelierRoom
- import-hall-assets.mjs
- query
- economy/store.ts
- FishingView.tsx
- room.ts
- minimap.ts
- getStorage
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
- npc-layer.ts
- Asset pipeline: fast loading without losing sharpness
- Guest Board SQL Schema
- Landscape Frame Asset
- ClosetView.tsx
- Bug Reports SQL Schema
- Vitals SQL Schema
- initialize
- snapshot.ts
- wardrobe.ts
- paintings/page.tsx
- Run-Once Schema
- (hall)/page.tsx
- RevealCard.tsx
- rules.ts
- pondgame/lib/api.ts
- GuestBoard.tsx
- json
- graftCostume
- createRemoteVisitors
- worker/tsconfig.json
- core/tsconfig.json
- rig.ts
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
- HangBoard.tsx
- Walkthrough.tsx
- sketchguess/lib/api.ts
- presence/tsconfig.json
- LeaderboardPanel.tsx
- tsconfig.test.json
- lib/presence.ts
- writeLocal
- rooms.ts
- .webSocketMessage
- import-hall-assets.mjs
- Multiplayer ("other visitors") — plan v2 (Cloudflare)
- infra/jobs.ts
- room-places.ts
- react
- player-card.ts
- xdog.ts
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
- hit.ts
- run.ts
- lib/slots/index.ts
- Walker
- wander.test.ts
- pond/room.ts
- Curating the paintings (2026-11-07)
- themes.ts
- links.ts
- outbox.test.ts
- createHallRoom
- FilesystemStorage
- writeLocal
- CrowdPreview.tsx
- createRigState
- RigPreview.tsx
- rooms/index.ts
- createStage
- Atelier: the dressing mirror, and show-don't-tell keeping
- createPlacementLayer
- app/page.tsx
- a/[slug]/page.tsx
- ref_node_assert
- AccountSheet
- visits.ts
- Item
- protocol.ts
- Your Room: a room you can freely furnish
- nearby.ts
- schedule.test.ts
- Storyline (draft, saved 2026-11-17)
- hall/room.ts
- bake-pond-path.mjs
- Local end-to-end stress test — 2026-11-06
- createPondRoom
- draw.py
- pond-photos.ts
- residentsAt
- slots/store.ts
- scripts
- Monets Lily Pond: exploration, UX and multiplayer QA
- walk
- createPixelRatioGovernor
- Low
- createCharacter
- PondRoom.tsx
- ref_node_assert
- catalog.ts
- Medium
- atelier.ts
- npcs/README.md
- mail.ts
- scripts
- Other visitors
- confirm/page.tsx
- frame-clock.test.ts
- next
- Clock
- Rig
- ArtCache
- BunnyArtist.tsx
- PondPanels.tsx
- npc-sheet.cjs
- doors.sql
- painting-open
- icon-basket
- bunny-left
- bunny-right
- icon-home
- ticket

## God Nodes (most connected - your core abstractions)
1. `react` - 95 edges
2. `useSound()` - 88 edges
3. `json()` - 81 edges
4. `PersonalRoom()` - 72 edges
5. `query()` - 72 edges
6. `hit()` - 67 edges
7. `limited()` - 61 edges
8. `FishingView()` - 53 edges
9. `three` - 49 edges
10. `next` - 48 edges

## Surprising Connections (you probably didn't know these)
- `Code` --references--> `followOutfit()`  [INFERRED]
  docs/costume-atelier.md → apps/web/src/features/hall/scene/wardrobe.ts
- `5.1 Emotes (v1)` --references--> `ScreenChrome()`  [INFERRED]
  docs/multiplayer-plan.md → apps/web/src/shared/components/ScreenChrome.tsx
- `E2E-009 — Room mutations ignore stale account identity` --references--> `memberFromRequest()`  [INFERRED]
  docs/testing/local-e2e-stress-2026-11-06.md → apps/web/src/shared/lib/member-route.ts
- `19. Development-only: page payloads include the full room row` --references--> `getRoom()`  [INFERRED]
  docs/personal-room-issues.md → packages/core/src/domain/rooms.ts
- `Catalogue` --references--> `personalRoomFor()`  [INFERRED]
  docs/custom-room.md → packages/core/src/domain/rooms.ts

## Import Cycles
- None detected.

## Communities (224 total, 24 thin omitted)

### Community 0 - "stage.ts"
Cohesion: 0.03
Nodes (58): coverFloorTransition(), CharacterSprites, CameraRig, createRoomPassage(), fixture(), Options, Pose, VisitorScenery (+50 more)

### Community 1 - "Traversal"
Cohesion: 0.11
Nodes (4): clamp(), fixture(), jump(), Traversal

### Community 2 - "SketchGuess.tsx"
Cohesion: 0.07
Nodes (42): earn(), maybeInvite(), writeSession(), tap(), tap(), tap(), bestKeyFor(), BURST (+34 more)

### Community 3 - "src/rooms/doors.ts"
Cohesion: 0.11
Nodes (27): DoorsRow, doorsState, parsed(), saveDoorsDraft(), addPassage(), checkDoors(), DEFAULT_DOORS, DOOR_ASPECT (+19 more)

### Community 4 - "assetUrl"
Cohesion: 0.10
Nodes (26): AtelierArt, disposeAtelierArt(), GiftShopSigns, ArtByRoom, AtelierArtwork, HallArt, PersonalArt, ROOM_ART (+18 more)

### Community 5 - "round.ts"
Cohesion: 0.15
Nodes (28): deltaE(), GAMUT_EPSILON, hexToOklab(), inGamut(), linearRgbToOklab(), linearToSrgb(), Oklab, oklabToLinearRgb() (+20 more)

### Community 6 - "floor.ts"
Cohesion: 0.13
Nodes (34): clone(), closestOnSegment(), contains(), cross(), crossVec(), depthAtY(), depthBounds(), depthT() (+26 more)

### Community 7 - "Core Asset Manifest"
Cohesion: 0.05
Nodes (41): artworks, audio, file, megabytes, seconds, sourceName, startedAt, bunny (+33 more)

### Community 8 - "scene/assets.ts"
Cohesion: 0.09
Nodes (42): AssetManifest, assetUrl(), bitmapTexture(), blankImage(), CAFE_CAT_FRAMES, CompressedLoader, elementTexture(), ENTRANCE_FILES (+34 more)

### Community 9 - "pond-api.ts"
Cohesion: 0.14
Nodes (30): AlbumPanel(), remove(), CameraView, openCamera(), keep(), buyPondBait(), claimPondBounty(), deletePondPhoto() (+22 more)

### Community 10 - "machine.ts"
Cohesion: 0.12
Nodes (36): CastMeter(), ReelMeter(), armCast(), BITE_WINDOW, biteGap(), CHARGE_PERIOD, chargePower(), createFishingState() (+28 more)

### Community 11 - "personal/room.ts"
Cohesion: 0.11
Nodes (18): ceilingGeometry(), CozyBackdrop, createCozyBackdrop(), clearGlows(), glow(), paintShade(), placeGlows(), placeSides() (+10 more)

### Community 12 - "Test Fakes and Helpers"
Cohesion: 0.11
Nodes (27): deferredFetch(), deviceSlot, FakeEvents, FakeStorage, fixture, fixtureB, fixtureRegistry, fixtureRegistryBoth (+19 more)

### Community 13 - "scene.ts"
Cohesion: 0.04
Nodes (33): disposeDisplayTexture(), HELM_PEDESTAL_FILE, prefersAvif(), HiddenCoin, createGiftShop(), createNotes(), createPedestal(), Notes (+25 more)

### Community 14 - "cozy.ts"
Cohesion: 0.07
Nodes (49): alphaCanvas(), ATELIER_PROPS, AtelierImage, atticWindowCanvas(), bareBulbCanvas(), boardsCanvas(), canvasTexture(), ceilingTexture() (+41 more)

### Community 15 - "logic.ts"
Cohesion: 0.08
Nodes (60): buy(), Carry, errorReason(), overDrawer(), PersonalRoom(), canPlaceNew(), carriedTo(), carryEnd() (+52 more)

### Community 16 - "room-events.ts"
Cohesion: 0.06
Nodes (56): ChatButton(), REFUSED, appendChatMessage(), CHAT_HISTORY_LIMIT, CHAT_HISTORY_WINDOW_MS, chatHistoryKey(), ChatMessage, ChatStorage (+48 more)

### Community 17 - "schedule.ts"
Cohesion: 0.08
Nodes (45): addDwellEmotes(), addEmote(), addStand(), addWalk(), buildRoomTable(), canReturn(), chooseMeeting(), chooseNext() (+37 more)

### Community 18 - "three"
Cohesion: 0.04
Nodes (46): Scenery, CUTS, Mark, ROPE_CUTS, ropeSlices(), sliceOf(), stretchedBoard(), CafeMarks (+38 more)

### Community 19 - "amplify/package.json"
Cohesion: 0.08
Nodes (26): amplifyDir, backend, everyMinutes, mediaBucket, missing, repoRoot, REQUIRED, setting() (+18 more)

### Community 20 - "atelier/room.ts"
Cohesion: 0.08
Nodes (24): AtelierPage(), dynamic, metadata, Work, subscribeWallet(), CHANGE_SOUND, Walkthrough, Props (+16 more)

### Community 21 - "prepare-models.mjs"
Cohesion: 0.09
Nodes (28): paintedCostume(), BODIES, bruce, BRUCE_FIT, BRUCE_PLACE, bunny, CARDIGAN, closedWaist() (+20 more)

### Community 22 - "progress.ts"
Cohesion: 0.09
Nodes (51): latestLetter(), LetterMailbox(), open(), openNext(), LetterMailboxProps, QuestLine(), SERVER_PROGRESS, openCuratorLetter() (+43 more)

### Community 23 - "core/package.json"
Cohesion: 0.06
Nodes (39): dependencies, @aws-sdk/client-s3@^3.1121.0, @aws-sdk/s3-request-presigner@^3.1121.0, bcryptjs@^2.4.3, obscenity@^0.4.6, sharp@^0.33.5, thumbhash@^0.1.1, devDependencies (+31 more)

### Community 24 - "domain/guestboard.ts"
Cohesion: 0.14
Nodes (23): ALLOWED, PER_VISITOR, POST(), POST(), POST(), GET(), PER_VISITOR, BOARDS (+15 more)

### Community 25 - "handlers.ts"
Cohesion: 0.08
Nodes (32): Where things stand, Phase 5: themes, zones and arrangements, confirmedFollowers(), sealEpoch(), handleDerivatives(), handleNotifyFollowers(), handleRenderDisplay(), handleSealEpoch() (+24 more)

### Community 26 - "app/layout.tsx"
Cohesion: 0.09
Nodes (26): bethEllen, inspiratiq, metadata, notoSans, RootLayout(), sniglet, viewport, AccountHost() (+18 more)

### Community 27 - "domain/sketch.ts"
Cohesion: 0.10
Nodes (28): listPieces(), pieceImageUrl(), PieceRow, toPieceDto(), GalleryRow, planSketchRound(), SKETCH_CHOICES, SketchCandidate (+20 more)

### Community 28 - "ambience.ts"
Cohesion: 0.12
Nodes (29): blade(), bloom(), BLOOMS, createPondAmbience(), update(), fishTexture(), frond(), FRONT_ROWS (+21 more)

### Community 29 - "core/src/index.ts"
Cohesion: 0.04
Nodes (153): GET(), addBait(), compare(), DexRow, displayName(), FeedRow, getPondDex(), getPondLeaderboard() (+145 more)

### Community 30 - "Web Package Dependencies"
Cohesion: 0.10
Nodes (27): dependencies, embla-carousel-react@^8.6.0, motion@^13.1.1, next@^15.0.3, react@^19.0.0, react-dom@^19.0.0, swr@^2.5.1, three@^0.169.0 (+19 more)

### Community 31 - "Gamifying Tiny Museum — genre direction & engagement research"
Cohesion: 0.10
Nodes (19): 0.1 The core experience, 0.2 Systems that make gamification cheap to build, 0.3 Constraints that shape any recommendation, 0. What the game is today (the deep dive), 1.1 The landscape (seven candidates, with verdicts), 1.2 Recommendation: a **cozy gallery life-sim** — "the gallery you live in", 1.3 The five design pillars the genre implies, 1. Genre direction (+11 more)

### Community 32 - "DoorEditor.tsx"
Cohesion: 0.09
Nodes (37): DoorsPage(), dynamic, hallPaintings(), hallDoorSpan(), CAST, doorArtUrl(), loadDoorArt(), loadRoomDoorArt() (+29 more)

### Community 33 - "DecorDrawer.tsx"
Cohesion: 0.07
Nodes (41): useWallet(), DecorDrawer, DecorDrawerProps, SLOT_LABELS, Tab, TABS, HallArranger(), HallArrangerProps (+33 more)

### Community 34 - "risk.ts"
Cohesion: 0.09
Nodes (40): BaitTray(), Hud(), HudProps, HudWagerChip, WagerPicker(), chooseTier(), stepStake(), WagerPickerProps (+32 more)

### Community 35 - "amplify/tsconfig.json"
Cohesion: 0.20
Nodes (9): compilerOptions, module, moduleResolution, noUnusedLocals, noUnusedParameters, exclude, extends, include (+1 more)

### Community 36 - "5. Customization menu — what other people are doing"
Cohesion: 0.12
Nodes (16): 1. The target: what "Claude Opus 5.5" actually means, 2. Where your harness stands today (live config I read), 3. The honest gap model, 4. Quality levers, ranked by leverage, 5. Customization menu — what other people are doing, 6. Recommended starting kit for *your* profile, 7. What I can apply for you right now (needs your go-ahead), A. Prompt & persona (most common quality customizations) (+8 more)

### Community 37 - "locations.ts"
Cohesion: 0.13
Nodes (31): discardLocationAction(), discardLocation(), hangableOnly(), hasUnpublished(), inUse(), nudgeInRow(), OWNER, placePainting() (+23 more)

### Community 38 - "wallet.ts"
Cohesion: 0.11
Nodes (31): WalletSnapshot, grantPearls(), member(), now, piece(), randomId(), today, baitOf() (+23 more)

### Community 39 - "Web TSConfig"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 40 - "Root Package Manifest"
Cohesion: 0.10
Nodes (22): [, width, height], description, devDependencies, concurrently@^9.1.0, esbuild@^0.24.0, ktx2-encoder@^0.6.0, maxrects-packer@^2.7.3, playwright@^1.63.0 (+14 more)

### Community 41 - "pond-api.ts"
Cohesion: 0.09
Nodes (42): refreshWalletNow(), PondBounties, EXCHANGE_DAILY_STAMPS, EXCHANGE_PEARLS_PER_STAMP, fishArt(), formatCountdown(), formatInteger(), formatPercent() (+34 more)

### Community 42 - "npc-layer.ts"
Cohesion: 0.19
Nodes (19): createNpcLayer(), createResidentView(), createView(), departedRecently(), draw(), fadeOut(), glyphWidth(), hideAll() (+11 more)

### Community 43 - "actions.ts"
Cohesion: 0.12
Nodes (30): BugReportsPage(), dateFormat, dynamic, summary(), dateFormat, dynamic, GuestBoardPage(), back() (+22 more)

### Community 44 - "Base TSConfig"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, lib, module, moduleResolution (+9 more)

### Community 45 - "Amplify Build Spec"
Cohesion: 0.12
Nodes (16): applications, appRoot, backend, frontend, baseDirectory, files, phases, commands (+8 more)

### Community 46 - "createAtelierRoom"
Cohesion: 0.21
Nodes (18): aspectOf(), AtelierActions, createAtelierRoom(), buildCollection(), form(), buildEntrance(), buildMirror(), buildRoom() (+10 more)

### Community 47 - "AtelierKeeps.tsx"
Cohesion: 0.12
Nodes (24): Purse(), Stamp(), serverSnapshot, useEarnEvents(), STAMP_ASPECT, STAMP_SVG, STAMP_URL, stampLabel() (+16 more)

### Community 48 - "Placement"
Cohesion: 0.04
Nodes (24): Job, centerYFor(), createDecorController(), canvasRect(), targetRise(), toScreen(), DecorController, DecorLive (+16 more)

### Community 49 - "import-fishing-assets.mjs"
Cohesion: 0.10
Nodes (12): CANVAS, clear, FONT, FRAME, heights, layout, lossless, manifest (+4 more)

### Community 50 - "Water.tsx"
Cohesion: 0.07
Nodes (49): AmbientShadow, box(), BUCKET, BUCKET_SPOTS, bunnyBox(), easeOut(), FAR_LEFT_STYLES, Glint (+41 more)

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

### Community 56 - "AtelierRoom"
Cohesion: 0.07
Nodes (11): AtelierRoom, createWardrobe(), enqueue(), reflect(), Options, bow, cardigan, dress (+3 more)

### Community 57 - "import-hall-assets.mjs"
Cohesion: 0.14
Nodes (11): DOOR, DOOR_BACKDROP, drop, FURNITURE, manifest, manifestPath, masters, ORNATE_PAPER (+3 more)

### Community 58 - "query"
Cohesion: 0.05
Nodes (76): GET(), allowedOrigin(), isSameOriginMutation(), LOOPBACK, registry, started(), CatchExtra, clearCatches() (+68 more)

### Community 59 - "economy/store.ts"
Cohesion: 0.12
Nodes (32): CARRY_CAP, carryAdd(), CarryEntry, carryPrune(), carryRemove(), chunk(), ClaimRequest, EarnSource (+24 more)

### Community 60 - "FishingView.tsx"
Cohesion: 0.12
Nodes (26): CAST_ERRORS, coarsePointer(), FishingView(), initialEasyReel(), isTyping(), LOST, PondGameProps, Toast (+18 more)

### Community 61 - "room.ts"
Cohesion: 0.15
Nodes (28): admitted(), Attachment, farewell(), GHOST_MS, HELLO_TIMEOUT_MS, holdsOf(), homeOf(), MAX_WAITING_PER_IP (+20 more)

### Community 62 - "minimap.ts"
Cohesion: 0.07
Nodes (35): place(), createMinimap(), draw(), drawRoom(), floors(), follow(), sketchOf(), doorPoint() (+27 more)

### Community 63 - "getStorage"
Cohesion: 0.11
Nodes (17): CONTENT_TYPES, GET(), PUT(), ACCEPTED, createAssetFromUpload(), MAX_UPLOAD_BYTES, presignUpload(), registerUpload() (+9 more)

### Community 64 - "domain/guestboard.ts"
Cohesion: 0.08
Nodes (36): POST(), GET(), POST(), rateLimitedResponse(), rejectedResponse(), MAX_BUG_CONTACT, MAX_BUG_ERRORS, MAX_BUG_MESSAGE (+28 more)

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
Cohesion: 0.18
Nodes (6): encodeStored(), parseStored(), readStored(), writeStored(), SyncStore, upgrade()

### Community 70 - "wire.ts"
Cohesion: 0.10
Nodes (13): fetch(), Env, Entry, INTERPOLATION_DELAY_MS, PEER_TIMEOUT_MS, PeerTable, positionAt(), Sample (+5 more)

### Community 71 - "LandingFx"
Cohesion: 0.22
Nodes (10): glowSprite(), LandingFx(), onClick(), onVisibility(), psst(), spawnMist(), tick(), Mist (+2 more)

### Community 72 - "Confirmed issues"
Cohesion: 0.12
Nodes (17): Confirmed issues, E2E-002 — Valid edge placement rejected through floating-point precision, E2E-003 — One owned prop can be placed multiple times, E2E-004 — Reload before autosave silently loses the latest placement, E2E-005 — Failed save and failed Done have no visible mobile explanation, E2E-006 — Restoring connectivity does not retry a failed draft save, E2E-007 — Keyboard activation cannot place drawer items, E2E-008 — Creating an account from My Room leaves the signed-in user on the sign-in prompt (+9 more)

### Community 73 - "epoch.ts"
Cohesion: 0.25
Nodes (13): GET(), intParam(), GET(), sketchPool, unavailable(), EMPTY, firstSlice(), memo (+5 more)

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
Cohesion: 0.17
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

### Community 85 - "npc-layer.ts"
Cohesion: 0.14
Nodes (22): createDoorGuides(), HallGuide, PROJECTED, BY_ID, castMember(), FRAME, IDLE, idleCel() (+14 more)

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
Cohesion: 0.09
Nodes (37): ClosetView(), close(), onKeyDown(), shuffle(), tapMiddle(), wearAt(), LISTS, PLACE (+29 more)

### Community 93 - "initialize"
Cohesion: 0.19
Nodes (14): boundedCameraX(), initialize(), aim(), drawFrame(), handleClick(), handlePointerDown(), handlePointerMove(), isResting() (+6 more)

### Community 94 - "snapshot.ts"
Cohesion: 0.23
Nodes (15): snap(), composeJpeg(), copyCanvas(), grabLayers(), Layer, loadImage(), paint(), px() (+7 more)

### Community 95 - "wardrobe.ts"
Cohesion: 0.13
Nodes (29): allowedCharacter(), OwnedSnapshot, owns(), walletReady(), getWalletSnapshot(), Atelier(), leave(), Look (+21 more)

### Community 96 - "paintings/page.tsx"
Cohesion: 0.13
Nodes (28): AnalyticsPage(), dynamic, dynamic, HangPage(), dynamic, StudioHome(), dynamic, PaintingsPage() (+20 more)

### Community 104 - "(hall)/page.tsx"
Cohesion: 0.30
Nodes (9): Loading(), dynamic, Hall(), MuseumPage(), DENSITY_MEDIA, HallPreload(), HallSkeleton(), LARGE_ASSET_MEDIA (+1 more)

### Community 105 - "RevealCard.tsx"
Cohesion: 0.10
Nodes (19): CONFETTI_COLORS, ConfettiPiece, makeConfetti(), RevealCard(), RevealCardProps, TIER_MS, useCountUp(), CatchView (+11 more)

### Community 106 - "rules.ts"
Cohesion: 0.16
Nodes (17): localDay(), at(), EXCHANGE_DAILY_STAMPS, EXCHANGE_PEARLS_PER_STAMP, exchangeClaimKey(), GAME_DAILY_CAP, GameId, GAMES (+9 more)

### Community 107 - "pondgame/lib/api.ts"
Cohesion: 0.26
Nodes (19): buyPondBait(), buyPondNet(), castPond(), chainPondBait(), errorOf(), fetchPondState(), isRecord(), memberId() (+11 more)

### Community 108 - "GuestBoard.tsx"
Cohesion: 0.10
Nodes (31): BoardScreen(), BoardScreenProps, ComposeScreen(), ComposeScreenProps, blankDraft(), GuestBoard(), GuestBoardProps, View (+23 more)

### Community 109 - "json"
Cohesion: 0.05
Nodes (102): POST(), PER_MEMBER, PUT(), POST(), GET(), GLOBAL, PER_IP, POST() (+94 more)

### Community 110 - "graftCostume"
Cohesion: 0.27
Nodes (14): canvasFit(), compose(), graftCostume(), copyAccessor(), copyMaterial(), copyMesh(), copyTexture(), copyView() (+6 more)

### Community 111 - "createRemoteVisitors"
Cohesion: 0.17
Nodes (12): createPlayerCard(), hide(), onPointerDown(), createRemoteVisitors(), ensureLayer(), hideSprites(), load(), placeOwn() (+4 more)

### Community 112 - "worker/tsconfig.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 113 - "core/tsconfig.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 114 - "rig.ts"
Cohesion: 0.13
Nodes (22): Layer, setCostumeVisibility(), follow(), canvasToModel(), Frame, loadRig(), dispose(), poseJump() (+14 more)

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
Cohesion: 0.05
Nodes (33): disposeBoards(), createCafe(), createGalleryDoor(), GALLERY_DOOR, createGuestBoard(), pickPainted(), createLobby(), createTreeSparkles() (+25 more)

### Community 119 - "Costume gallery doorway"
Cohesion: 0.50
Nodes (3): Costume gallery doorway, Curtain colour edit, Prompt

### Community 120 - "env.ts"
Cohesion: 0.09
Nodes (14): bodyTextures, COATS, { json, bin }, manifest, maps, target, manifest, SCHEMA_DIR (+6 more)

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

### Community 126 - "HangBoard.tsx"
Cohesion: 0.13
Nodes (19): nudgeInRowAction(), placePaintingAction(), updatePieceAction(), AtelierFrame(), Frame(), form(), HangBoard(), dropAt() (+11 more)

### Community 127 - "Walkthrough.tsx"
Cohesion: 0.14
Nodes (21): BACKDROP_STYLE, MoreArrow(), NavArrow(), Props, SLIDE, Walkthrough(), XIcon(), decodedFrames (+13 more)

### Community 128 - "sketchguess/lib/api.ts"
Cohesion: 0.11
Nodes (20): sameOriginUrl(), PlaceInfo, PreparedGame, decodeImage(), fetchBitmap(), fetchRound(), guarded(), InkMap (+12 more)

### Community 129 - "presence/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, types, exclude, extends, include, ../../tsconfig.base.json

### Community 130 - "LeaderboardPanel.tsx"
Cohesion: 0.15
Nodes (22): fetchPondFeed(), PondBoardId, PondBoardPeriod, PondBoardRow, PondFeedItem, PondLeaderboard, catchLabel(), formatOdds() (+14 more)

### Community 131 - "tsconfig.test.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 132 - "lib/presence.ts"
Cohesion: 0.10
Nodes (21): Outcome, send(), Connect, connectWebSocket(), fetchTicket, HEARTBEAT_MS, HIDDEN_LIMIT_MS, RETRY_MS (+13 more)

### Community 133 - "writeLocal"
Cohesion: 0.16
Nodes (13): saveIfHigher(), BackgroundMusic, clampVolume(), isDocumentHidden(), Options, useBackgroundMusic(), VISIBILITY_EVENTS, isRouted() (+5 more)

### Community 134 - "rooms.ts"
Cohesion: 0.07
Nodes (46): GET(), PaintingRow, GET(), POST(), UPLOADS_PER_ARTIST, POST(), UPLOADS_PER_ARTIST, dynamic (+38 more)

### Community 135 - ".webSocketMessage"
Cohesion: 0.44
Nodes (3): attachmentOf(), Room, sendTo()

### Community 136 - "import-hall-assets.mjs"
Cohesion: 0.09
Nodes (17): BASEBOARD, CURTAIN, drop, EXPECTED, file(), manifest, manifestPath, masters (+9 more)

### Community 137 - "Multiplayer ("other visitors") — plan v2 (Cloudflare)"
Cohesion: 0.10
Nodes (19): 0. Summary, 10. Decisions, 1. Product contract changes (approved 2026-10-31), 2. What already exists that this builds on, 3.1 Generated names (everyone has one), 3. Names, 4. Transport: Cloudflare Durable Objects, 5.1 Emotes (v1) (+11 more)

### Community 138 - "infra/jobs.ts"
Cohesion: 0.25
Nodes (15): loop(), shutdown(), sleep(), sweepStale(), DrainResult, handler(), repairFrames(), repairUnframed() (+7 more)

### Community 139 - "room-places.ts"
Cohesion: 0.14
Nodes (19): NpcGround, PlaceKind, atelierRoomInfo(), atelierX(), copy(), FurniturePlacement, hallCache, hallRoomInfo() (+11 more)

### Community 140 - "react"
Cohesion: 0.08
Nodes (42): NAME_ERRORS, Pending, View, ColorRecall(), ColorRecallProps, Phase, readBest(), coin (+34 more)

### Community 141 - "player-card.ts"
Cohesion: 0.11
Nodes (13): Door, doorOf(), PlayerCard, wallpaperOf(), cozyLevel, cozyWorth(), Built (2026-11-21), Decisions (+5 more)

### Community 142 - "xdog.ts"
Cohesion: 0.39
Nodes (5): blur(), kernel(), XDOG_DEFAULTS, xdogInk(), XdogOptions

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
Cohesion: 0.11
Nodes (30): Loading(), AtelierLoading(), CoinFound, ColorRecall, GameDesktop, GuestBoard, HallArranger, HelpGuide (+22 more)

### Community 147 - "Orchestration contract — you plan, DSH workers execute"
Cohesion: 0.29
Nodes (6): Briefing a worker, Budget hygiene, graphify, Orchestration contract — you plan, DSH workers execute, The worker, When not to delegate

### Community 148 - "tables.ts"
Cohesion: 0.10
Nodes (34): BaitTrayProps, PondCatch, debugSpecies(), debugTokens(), debugVariant(), GuestRoll, GuestRollOptions, guestTreasure() (+26 more)

### Community 149 - "Tiny Museum v1 · Curator Letters"
Cohesion: 0.17
Nodes (11): Letter 0 · Clean up your room, Letter 1 · Place your first decoration, Letter 2 · Visit the first gallery, Letter 3 · Play a mini-game, Letter 4 · Unlock an outfit or character, Letter 5 · Find the seasonal items, Letter 6 · Unlock the daily calendar, Letter 7 · The cliffhanger and email signup (+3 more)

### Community 150 - "useBackgroundMusic.ts"
Cohesion: 0.18
Nodes (17): EFFECTS, EffectSpec, FOOTSTEPS, SoundEffects, useSoundEffects(), gestured(), OPTIONS, applyMix() (+9 more)

### Community 151 - "ticket/route.ts"
Cohesion: 0.13
Nodes (26): GET(), PER_IP, POST(), presenceUrl(), Code, 3.2 Chosen names (members), chooseName(), exportMember() (+18 more)

### Community 152 - "SlotDef"
Cohesion: 0.21
Nodes (3): FakeServer, SlotState, SlotDef

### Community 153 - "hit.ts"
Cohesion: 0.17
Nodes (13): Assets, CoinWall, createHiddenCoin(), Spot, AlphaMap, alphaMapFor(), alphaMaps, buildAlphaMap() (+5 more)

### Community 154 - "run.ts"
Cohesion: 0.20
Nodes (7): admin, childEnv, client, database, fresh, migrations, target

### Community 155 - "lib/slots/index.ts"
Cohesion: 0.08
Nodes (21): PresencePreviewPage(), KeepOnOtherDevices(), restampChanged(), PresencePreview(), Props, WalkAlone(), announceNameChange(), NameError (+13 more)

### Community 156 - "Walker"
Cohesion: 0.19
Nodes (3): FloorPoint, WalkArea, Walker

### Community 157 - "wander.test.ts"
Cohesion: 0.16
Nodes (11): Job, Place, WalkState, BASE_JOB, context(), L_GROUND, mulberry32(), room() (+3 more)

### Community 158 - "pond/room.ts"
Cohesion: 0.13
Nodes (10): FLOOR, MOVE_KEYS, PlaneOptions, POND_ITEMS, POND_SPOTS, PondControl, projected, SCENE_WIDTH (+2 more)

### Community 159 - "Curating the paintings (2026-11-07)"
Cohesion: 0.13
Nodes (14): hang(), 1. The registry and the table, 2. The studio's Location picker, 3. The rooms draw what is placed, 4. Credits, 5. Retiring self-serve artists, Building it, Curating the paintings (2026-11-07) (+6 more)

### Community 160 - "themes.ts"
Cohesion: 0.07
Nodes (31): Catalogue, Data model (core), 1. Items placed against a zone edge fail to save, and the whole draft reverts, 2. One owned item can be placed many times, 3. Any save rejection throws away all unsaved work, 4. Changes made just before leaving are lost, 5. Fish trophies can be claimed without playing, High (+23 more)

### Community 161 - "links.ts"
Cohesion: 0.17
Nodes (9): guides(), museumDoors(), EXITS, isDoor(), linkedDoor(), ROOM_PATH, StageHandlers, DoorRef (+1 more)

### Community 162 - "outbox.test.ts"
Cohesion: 0.20
Nodes (16): OUTBOX_CAP, outboxAdd(), outboxDue(), OutboxEntry, outboxFail(), outboxRemove(), RETRY_BASE_MS, RETRY_MAX_MS (+8 more)

### Community 163 - "createHallRoom"
Cohesion: 0.21
Nodes (14): createHallRoom(), buildRoom(), buildRoomContents(), cafeRoom(), enterDoor(), galleryRoom(), giftShopRoom(), joined() (+6 more)

### Community 165 - "writeLocal"
Cohesion: 0.22
Nodes (15): ensureStarted(), memberChanged(), publish(), readSession(), refreshWallet(), setBalance(), syncMember(), undoAdminUnlock() (+7 more)

### Community 166 - "CrowdPreview.tsx"
Cohesion: 0.22
Nodes (12): CrowdPreviewPage(), CrowdPreview(), draw(), KINDS, Stats, Window, clearRigLayer(), createRenderer() (+4 more)

### Community 167 - "createRigState"
Cohesion: 0.19
Nodes (11): cache, queue, render(), snapshotLook(), trim(), createRigState(), RigPiece, createShopkeeper() (+3 more)

### Community 168 - "RigPreview.tsx"
Cohesion: 0.27
Nodes (10): RigPreviewPage(), NEXT, PROPS, RigPreview(), draw(), approach(), GROUNDED, rigFacing() (+2 more)

### Community 169 - "rooms/index.ts"
Cohesion: 0.24
Nodes (8): MuseumLayout(), CoinToast(), Toast, WalletProvider(), setMuseumDoors(), MuseumDoors(), MuseumStage(), publishedDoors()

### Community 170 - "createStage"
Cohesion: 0.28
Nodes (11): FLICK, flickDirection(), isUpwardFlick(), createNearby(), createStage(), closeEntry(), enter(), handlePointerUp() (+3 more)

### Community 171 - "Atelier: the dressing mirror, and show-don't-tell keeping"
Cohesion: 0.13
Nodes (14): Atelier: the dressing mirror, and show-don't-tell keeping, Build order, Built (2026-11-20), Decisions (2026-11-19), Follow-ups (2026-11-20), Goal, In the room, Keeping (+6 more)

### Community 172 - "createPlacementLayer"
Cohesion: 0.24
Nodes (10): aspectOf(), createPlacementLayer(), applyGlow(), drawOutline(), dropGhosts(), dropHelper(), extrasFor(), silhouette() (+2 more)

### Community 173 - "app/page.tsx"
Cohesion: 0.26
Nodes (9): [BRAND_OWNER, ...BRAND_REST], CurrentlyShowing(), Decor(), dynamic, LandingPage(), openAccountCreation(), LandingAccount(), MediaPreconnect() (+1 more)

### Community 174 - "a/[slug]/page.tsx"
Cohesion: 0.33
Nodes (6): ArtistPage(), dynamic, generateMetadata(), GET(), FollowForm(), getArtistPage()

### Community 175 - "ref_node_assert"
Cohesion: 0.12
Nodes (30): defineSlot(), docBytes(), SLOTS, byAtThenKey(), encoded(), latest, mapOf(), maxNumber() (+22 more)

### Community 176 - "AccountSheet"
Cohesion: 0.29
Nodes (9): AccountSheet(), continueAnyway(), doSignOut(), runDelete(), runName(), submit(), submitDelete(), submitName() (+1 more)

### Community 177 - "visits.ts"
Cohesion: 0.06
Nodes (46): state(), PER_VISITOR, POST(), dynamic, format(), grade(), METRICS, PAGES (+38 more)

### Community 178 - "Item"
Cohesion: 0.14
Nodes (3): Room, Presence, Item

### Community 179 - "protocol.ts"
Cohesion: 0.12
Nodes (31): isCatalogItem(), isHome(), isItem(), isName(), isPid(), isSeq(), MAX_HOLDS, MAX_MESSAGE_BYTES (+23 more)

### Community 180 - "Your Room: a room you can freely furnish"
Cohesion: 0.12
Nodes (11): PlacementTheme, Admin mode (gamma), Decisions (2026-11-17, with the user), Editor (web, `features/rooms/decorate/*`, `PersonalRoom.tsx`), Room look (web, `features/rooms/themes/cozy.ts`, `features/rooms/personal/room.ts`), Scale, Testing locally, The closet: where every room starts (2026-11-17) (+3 more)

### Community 181 - "nearby.ts"
Cohesion: 0.18
Nodes (5): Nearby, NearbyReach, RoomSpan, reach, strip

### Community 182 - "schedule.test.ts"
Cohesion: 0.08
Nodes (22): RESIDENT_IDS, FloorSpot, ROOM_KINDS, ROOMS, NpcRoom, Phase, ResidentState, ROOM_DOORS (+14 more)

### Community 183 - "Storyline (draft, saved 2026-11-17)"
Cohesion: 0.15
Nodes (12): Arc (soft, no fail state), Built so far, How it ties to what exists, Locked (2026-11-21, the owner), Next tasks (when picked up), Open questions, Premise, Revision (2026-11-21, the owner) (+4 more)

### Community 184 - "hall/room.ts"
Cohesion: 0.05
Nodes (35): createHallAmbience(), finish(), glowTexture(), HallAmbience, mulberry(), painted(), vignetteTexture(), Backdrop (+27 more)

### Community 185 - "bake-pond-path.mjs"
Cohesion: 0.21
Nodes (7): blank(), manifest, manifestPath, ORIGINAL_SOURCE, originalPath(), root, softened()

### Community 186 - "Local end-to-end stress test — 2026-11-06"
Cohesion: 0.22
Nodes (7): Environment and coverage, Follow-up coverage, Issue index, Local end-to-end stress test — 2026-11-06, Measured load, Passing checks and interpretation limits, Test data and cleanup

### Community 187 - "createPondRoom"
Cohesion: 0.32
Nodes (13): createPondRoom(), approach(), busy(), finishWalk(), goTo(), leave(), move(), nearest() (+5 more)

### Community 189 - "pond-photos.ts"
Cohesion: 0.21
Nodes (11): snapshot(), Checked against the mocks (2026-11-07), addPondPhoto(), AddPondPhotoResult, deletePondPhoto(), isJpeg(), listPondPhotos(), POND_PHOTO_LIMIT (+3 more)

### Community 190 - "residentsAt"
Cohesion: 0.27
Nodes (11): addGap(), along(), buildStayPlan(), clamp(), doorX(), posMod(), residentsAt(), roomAtBlock() (+3 more)

### Community 191 - "slots/store.ts"
Cohesion: 0.13
Nodes (17): ANON_PREFIX, anonKey(), deviceKey(), isMemberSlotKey(), listKeys(), MEMBER_KEY, memberKey(), memberPrefix() (+9 more)

### Community 192 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, db:schema, deploy:backend, dev, dev:presence, dev:web, dev:worker (+6 more)

### Community 193 - "Monets Lily Pond: exploration, UX and multiplayer QA"
Cohesion: 0.29
Nodes (6): Browser and interaction coverage, Changes made from the walkthrough, Monets Lily Pond: exploration, UX and multiplayer QA, Multiplayer and load, Practical limits, Regression checks and cleanup

### Community 194 - "walk"
Cohesion: 0.12
Nodes (19): between(), CAT, Edge, EDGES, runLandingCat(), choosePeeker(), peek(), walk() (+11 more)

### Community 195 - "createPixelRatioGovernor"
Cohesion: 0.33
Nodes (7): createPixelRatioGovernor(), reset(), stepTo(), PIXEL_RATIO_STEPS, pixelRatioSteps(), Renderer, governor()

### Community 196 - "Low"
Cohesion: 0.15
Nodes (13): 13. Pages that redirect or don't exist answer 200, 14. Error codes reveal which room slugs exist, 15. The name sign slides under the top-right buttons in Decorate, 16. Level-up celebrations can be farmed, 17. No hint of where things are after panning away, 18. Too many items is only discovered by the server, 19. Development-only: page payloads include the full room row, Checked and fine (+5 more)

### Community 197 - "createCharacter"
Cohesion: 0.28
Nodes (8): createCharacter(), contextLost(), loadFallbackWalk(), loadKind(), loseRig(), setFrame(), Angler(), layer()

### Community 198 - "PondRoom.tsx"
Cohesion: 0.08
Nodes (35): Loading(), metadata, PondPage(), loadGameDesktop(), revealFloorTransition(), GameDesktop(), GameDesktopProps, Minigame (+27 more)

### Community 199 - "ref_node_assert"
Cohesion: 0.13
Nodes (13): shape(), garlandRibbon(), at(), GarlandShape, Ribbon, sag(), shape, COLD_DOOR_HOLD_MS (+5 more)

### Community 200 - "catalog.ts"
Cohesion: 0.31
Nodes (7): CatalogItem, CatalogKind, FREE_CHARACTERS, ITEMS, ItemSlot, expected, slots

### Community 201 - "Medium"
Cohesion: 0.25
Nodes (8): 10. Long names run off the name sign, 11. The rooms API skips the stale-tab member check, 12. The bunny is dragged along while you pan in Decorate, 6. Failed saves are nearly invisible, and nothing retries, 7. Two tabs editing the same room overwrite each other, 8. The drawer's card row can't be scrolled on touch screens, 9. Decorating can't be done with the keyboard, Medium

### Community 202 - "atelier.ts"
Cohesion: 0.05
Nodes (54): MIRROR_SRC, AtelierDoor, AtelierImage, BuiltRoom, Cardigan, CARDIGAN_NAMES, CHARACTER_NAMES, Control (+46 more)

### Community 204 - "mail.ts"
Cohesion: 0.33
Nodes (5): ConsoleMailer, FileMailer, getMailer(), Mailer, Message

### Community 205 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, assets:models, assets:pond-path, assets:shopkeeper, build, dev, start, typecheck

### Community 206 - "Other visitors"
Cohesion: 0.29
Nodes (6): How it plays, Other visitors, Privacy, Running it in production, Running it locally, Staying consistent

### Community 207 - "confirm/page.tsx"
Cohesion: 0.33
Nodes (7): ConfirmFollow(), dynamic, dynamic, Unsubscribe(), FollowNotice(), confirmFollow(), unsubscribe()

### Community 208 - "frame-clock.test.ts"
Cohesion: 0.36
Nodes (6): MAX_CATCH_UP_SECONDS, MAX_STEP_SECONDS, movementSteps(), RESTING_TICK_MS, shouldTick(), walker()

### Community 209 - "next"
Cohesion: 0.08
Nodes (28): config, SECURITY_HEADERS, BugReportHost(), BugReportSheet, BugReportSheet(), Status, collectContext(), inAppBrowser() (+20 more)

### Community 213 - "BunnyArtist.tsx"
Cohesion: 0.50
Nodes (4): BunnyArtist(), BunnyMood, Pencil(), POSES

### Community 214 - "PondPanels.tsx"
Cohesion: 0.08
Nodes (26): openAccount(), gradeLabel(), JOURNAL_FAMILIES, JOURNAL_GRADES, JOURNAL_SIZE, journalCatch, journalFamily, KeepsakeId (+18 more)

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
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1736 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **24 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `LeaderboardPanel.tsx`, `SketchGuess.tsx`, `writeLocal`, `pond-api.ts`, `Test Fakes and Helpers`, `logic.ts`, `room-events.ts`, `Museum.tsx`, `atelier/room.ts`, `tables.ts`, `progress.ts`, `useBackgroundMusic.ts`, `app/layout.tsx`, `lib/slots/index.ts`, `Web Package Dependencies`, `DoorEditor.tsx`, `DecorDrawer.tsx`, `risk.ts`, `CrowdPreview.tsx`, `RigPreview.tsx`, `rooms/index.ts`, `pond-api.ts`, `app/page.tsx`, `AtelierKeeps.tsx`, `Water.tsx`, `FishingView.tsx`, `PondRoom.tsx`, `LandingFx`, `atelier.ts`, `next`, `PondPanels.tsx`, `ClosetView.tsx`, `wardrobe.ts`, `paintings/page.tsx`, `(hall)/page.tsx`, `RevealCard.tsx`, `GuestBoard.tsx`, `HangBoard.tsx`, `Walkthrough.tsx`?**
  _High betweenness centrality (0.082) - this node is a cross-community bridge._
- **What connects `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json` to the rest of the system?**
  _5 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `stage.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.02839173405211141 - nodes in this community are weakly interconnected._
- **Why does `three` connect `three` to `stage.ts`, `assetUrl`, `scene/assets.ts`, `scene.ts`, `cozy.ts`, `hang-tag.ts`, `room-events.ts`, `atelier/room.ts`, `prepare-models.mjs`, `hit.ts`, `ambience.ts`, `pond/room.ts`, `Web Package Dependencies`, `createRigState`, `Placement`, `hall/room.ts`, `atelier.ts`, `npc-layer.ts`, `rig.ts`, `lobby.ts`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Should `Traversal` be split into smaller, more focused modules?**
  _Cohesion score 0.10685483870967742 - nodes in this community are weakly interconnected._
- **Why does `useSound()` connect `react` to `LeaderboardPanel.tsx`, `SketchGuess.tsx`, `pond-api.ts`, `logic.ts`, `room-events.ts`, `Museum.tsx`, `atelier/room.ts`, `tables.ts`, `progress.ts`, `app/layout.tsx`, `DecorDrawer.tsx`, `risk.ts`, `rooms/index.ts`, `pond-api.ts`, `a/[slug]/page.tsx`, `AtelierKeeps.tsx`, `AccountSheet`, `FishingView.tsx`, `LandingFx`, `atelier.ts`, `next`, `PondPanels.tsx`, `ClosetView.tsx`, `wardrobe.ts`, `GuestBoard.tsx`, `Walkthrough.tsx`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Should `SketchGuess.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07450980392156863 - nodes in this community are weakly interconnected._