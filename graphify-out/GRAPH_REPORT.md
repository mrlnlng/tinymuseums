# Graph Report - tiny-museum  (2026-11-19)

## Corpus Check
- 526 files · ~316,626 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 95 file(s) not represented in the graph (top: .avif 52, .glb 34, .css 4)

## Summary
- 4741 nodes · 12245 edges · 221 communities (189 shown, 32 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 247 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `af052d94`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- stage.ts
- walk.ts
- SketchGuess.tsx
- themes.ts
- Rig
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
- ArrangeControls.tsx
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
- catalog.ts
- LeaderboardPanel.tsx
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
- RigPreview.tsx
- createCozyBackdrop
- import-fishing-assets.mjs
- Base TSConfig
- Amplify Build Spec
- sketchguess/lib/api.ts
- audience.ts
- slots/store.ts
- actions.ts
- Water.tsx
- Worker Package Manifest
- Public Asset Manifest
- SlotDef
- wander.test.ts
- compose-atelier.mjs
- lib/presence.ts
- pond-format.ts
- pond-boards.ts
- economy/store.ts
- links.ts
- room.ts
- minimap.ts
- personal/room.ts
- domain/guestboard.ts
- Sound Effect Assets
- initialize
- Custom HTTP Headers
- Sharp Layer Package
- json
- scene/ambience.ts
- BountyPanel.tsx
- wallet/body.ts
- createCharacter
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
- hit
- createRemoteVisitors
- pond/room.ts
- query
- Run-Once Schema
- nearby.ts
- FishingView.tsx
- ticket.ts
- import-hall-assets.mjs
- reveal.ts
- createMinimap
- graftCostume
- pondgame/lib/api.ts
- worker/tsconfig.json
- core/tsconfig.json
- CrowdPreview.tsx
- How to Design for Failures — ByteByteGo Newsletter
- Worker instructions — DSH headless agents
- Backend
- protocol.ts
- Costume gallery doorway
- art-cache.ts
- Fishing forest: painted asset pass
- audio/README.md
- .claude/CLAUDE.md
- The Costume Atelier
- Confirmed issues
- rig.ts
- Curating the paintings (2026-11-07)
- hitForVisitor
- presence/tsconfig.json
- env.ts
- tsconfig.test.json
- app/layout.tsx
- ColorRecall.tsx
- peers.ts
- ref_node_assert
- bug-reports.ts
- npc-layer.ts
- writeStyle
- personal/room.ts
- Conn
- names.ts
- domain/guestboard.ts
- Local end-to-end stress test — 2026-11-06
- The Moonlit Pond — design
- Pond rework
- rooms/art.ts
- Orchestration contract — you plan, DSH workers execute
- tables.ts
- db.ts
- Medium
- pond-state.ts
- Cafe
- CharacterKind
- next
- rules.ts
- PerfMeter
- Walkthrough.tsx
- createPondRoom
- useSoundEffects.ts
- BunnyArtist.tsx
- walk
- editor.ts
- painting-open
- DecorController
- Multiplayer ("other visitors") — plan v2 (Cloudflare)
- Lobby
- run.ts
- Tiny Museum
- icon-basket
- member-route.ts
- visits.ts
- lib/assets.ts
- bunny-left
- Sitting
- bunny-right
- features/economy/index.ts
- currentArtist
- icon-home
- createPersonalRoom
- Your Room: a room you can freely furnish
- ticket
- schedule.test.ts
- Storyline (draft, saved 2026-11-17)
- bug-reports.ts
- hall/room.ts
- Low
- gallery/page.tsx
- draw.py
- ensureEpoch
- tab-turn.ts
- import-landing-assets.mjs
- session.ts
- Monets Lily Pond: exploration, UX and multiplayer QA
- loadCozyArt
- performance/page.tsx
- import-home-assets.mjs
- pond-api.ts
- lib/slots/index.ts
- drawingOn
- hang-tag.ts
- readMemberBody
- validatePlacements
- npcs/README.md
- Other visitors
- guestboard/route.ts
- FilesystemStorage
- rooms.ts
- visits/page.tsx
- LandingFx
- PondRoom.tsx
- darknessAt
- CodesSection.tsx
- custom-room.test.ts
- CozyBackdrop
- Notes
- focus.ts
- BuiltRoom
- EventTargetLike
- Item
- share.ts

## God Nodes (most connected - your core abstractions)
1. `react` - 77 edges
2. `json()` - 72 edges
3. `query()` - 68 edges
4. `PersonalRoom()` - 67 edges
5. `hit()` - 58 edges
6. `limited()` - 52 edges
7. `three` - 46 edges
8. `next` - 44 edges
9. `Traversal` - 44 edges
10. `SyncStore` - 41 edges

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

## Communities (221 total, 32 thin omitted)

### Community 0 - "stage.ts"
Cohesion: 0.03
Nodes (46): coverFloorTransition(), CharacterSprites, CameraRig, createPixelRatioGovernor(), PIXEL_RATIO_STEPS, createRoomPassage(), fixture(), Pose (+38 more)

### Community 1 - "walk.ts"
Cohesion: 0.12
Nodes (14): FloorPoint, WalkArea, water, depthAtLift(), PROP_DEPTH, DEPTH_SPAN, depthOf(), MAX_DEPTH (+6 more)

### Community 2 - "SketchGuess.tsx"
Cohesion: 0.14
Nodes (25): bestKeyFor(), BURST, clueUrl(), openingPlan(), Phase, pickAtRandom(), prepareSketchGame(), readDifficulty() (+17 more)

### Community 3 - "themes.ts"
Cohesion: 0.13
Nodes (18): Catalogue, Data model (core), ownershipFor(), GAMES, isRecord(), placementOf(), FULL_ROOM_WIDTH, nextRoomSize() (+10 more)

### Community 4 - "Rig"
Cohesion: 0.25
Nodes (3): RigState, Rig, Shown

### Community 5 - "round.ts"
Cohesion: 0.15
Nodes (27): deltaE(), GAMUT_EPSILON, hexToOklab(), inGamut(), linearRgbToOklab(), linearToSrgb(), Oklab, oklabToLinearRgb() (+19 more)

### Community 6 - "floor.ts"
Cohesion: 0.13
Nodes (34): clone(), closestOnSegment(), contains(), cross(), crossVec(), depthAtY(), depthBounds(), depthT() (+26 more)

### Community 7 - "Core Asset Manifest"
Cohesion: 0.05
Nodes (41): artworks, audio, file, megabytes, seconds, sourceName, startedAt, bunny (+33 more)

### Community 8 - "scene/assets.ts"
Cohesion: 0.07
Nodes (49): AssetManifest, assetUrl(), bitmapTexture(), blankImage(), CAFE_CAT_FRAMES, CompressedLoader, elementTexture(), ENTRANCE_FILES (+41 more)

### Community 9 - "SyncStore"
Cohesion: 0.17
Nodes (3): parseStored(), deepEq(), SyncStore

### Community 10 - "machine.ts"
Cohesion: 0.10
Nodes (48): CAST_ERRORS, coarsePointer(), FishingView(), initialEasyReel(), isTyping(), LOST, Toast, vibrate() (+40 more)

### Community 11 - "Museum.tsx"
Cohesion: 0.10
Nodes (30): coin, CoinFound(), CoinFoundProps, CoinFound, ColorRecall, GameDesktop, GuestBoard, HallArranger (+22 more)

### Community 12 - "Test Fakes and Helpers"
Cohesion: 0.12
Nodes (27): deferredFetch(), deviceSlot, FakeEvents, FakeStorage, fixture, fixtureB, fixtureRegistry, fixtureRegistryBoth (+19 more)

### Community 13 - "scene.ts"
Cohesion: 0.05
Nodes (24): disposeDisplayTexture(), prefersAvif(), HiddenCoin, createNotes(), createPedestal(), Pedestal, PedestalVoice, placeholderTexture() (+16 more)

### Community 14 - "cozy.ts"
Cohesion: 0.08
Nodes (20): ATELIER_PROPS, AtelierImage, cozyTheme, disposeCozyArt(), DRAWN, EYE, FINISH_TILES, FISH (+12 more)

### Community 15 - "ArrangeControls.tsx"
Cohesion: 0.40
Nodes (9): hangAction(), movePieceAction(), unhangAction(), FloorControls(), move(), unhang(), formFor(), StorageControls() (+1 more)

### Community 16 - "room-events.ts"
Cohesion: 0.19
Nodes (25): ChatButton(), REFUSED, joinRoom(), emit(), getPeople(), isInRoom(), isMuted(), muted (+17 more)

### Community 17 - "schedule.ts"
Cohesion: 0.08
Nodes (49): addDwellEmotes(), addEmote(), addGap(), addStand(), addWalk(), buildRoomTable(), buildStayPlan(), canReturn() (+41 more)

### Community 18 - "ref_node_assert"
Cohesion: 0.12
Nodes (30): defineSlot(), docBytes(), SLOTS, upgrade(), byAtThenKey(), encoded(), latest, mapOf() (+22 more)

### Community 19 - "amplify/package.json"
Cohesion: 0.08
Nodes (26): amplifyDir, backend, everyMinutes, mediaBucket, missing, repoRoot, REQUIRED, setting() (+18 more)

### Community 20 - "PersonalRoom.tsx"
Cohesion: 0.06
Nodes (73): errorReason(), Job, Offer, overDrawer(), PersonalRoom(), canPlaceNew(), carriedTo(), carryEnd() (+65 more)

### Community 21 - "prepare-models.mjs"
Cohesion: 0.10
Nodes (26): paintedCostume(), BODIES, bruce, BRUCE_FIT, BRUCE_PLACE, bunny, CARDIGAN_TIE, CROWN (+18 more)

### Community 22 - "Traversal"
Cohesion: 0.11
Nodes (5): JumpPose, clamp(), fixture(), jump(), Traversal

### Community 23 - "core/package.json"
Cohesion: 0.06
Nodes (40): dependencies, @aws-sdk/client-s3@^3.1121.0, @aws-sdk/s3-request-presigner@^3.1121.0, bcryptjs@^2.4.3, obscenity@^0.4.6, pg@^8.13.1, sharp@^0.33.5, thumbhash@^0.1.1 (+32 more)

### Community 24 - "wardrobe.ts"
Cohesion: 0.07
Nodes (46): AtelierPage(), dynamic, metadata, allowedCharacter(), OwnedSnapshot, owns(), walletReady(), getWalletSnapshot() (+38 more)

### Community 25 - "Placement"
Cohesion: 0.10
Nodes (7): Carry, PersonalRoomProps, HallRoomData, PersonalRoomOptions, GhostOptions, PlacementLayer, Placement

### Community 26 - "catalog.ts"
Cohesion: 0.16
Nodes (21): confirmClean(), CatalogItem, CatalogKind, FREE_CHARACTERS, isBuyable(), isCatalogItem(), ITEMS, ItemSlot (+13 more)

### Community 27 - "LeaderboardPanel.tsx"
Cohesion: 0.25
Nodes (14): PondBoardId, PondBoardPeriod, PondBoardRow, PondLeaderboard, formatInteger(), formatOdds(), nextMondayUtc(), BoardRow() (+6 more)

### Community 28 - "ambience.ts"
Cohesion: 0.12
Nodes (29): blade(), bloom(), BLOOMS, createPondAmbience(), update(), fishTexture(), frond(), FRONT_ROWS (+21 more)

### Community 29 - "core/src/index.ts"
Cohesion: 0.05
Nodes (113): addBait(), PondBoardMe, PondBoardRow, PondFeedItem, Rep, bountyCatches(), BountyCatchRow, bountyViews() (+105 more)

### Community 30 - "Web Package Dependencies"
Cohesion: 0.07
Nodes (33): dependencies, embla-carousel-react@^8.6.0, motion@^13.1.1, next@^15.0.3, react@^19.0.0, react-dom@^19.0.0, swr@^2.5.1, three@^0.169.0 (+25 more)

### Community 31 - "Gamifying Tiny Museum — genre direction & engagement research"
Cohesion: 0.10
Nodes (19): 0.1 The core experience, 0.2 Systems that make gamification cheap to build, 0.3 Constraints that shape any recommendation, 0. What the game is today (the deep dive), 1.1 The landscape (seven candidates, with verdicts), 1.2 Recommendation: a **cozy gallery life-sim** — "the gallery you live in", 1.3 The five design pillars the genre implies, 1. Genre direction (+11 more)

### Community 32 - "atelier.ts"
Cohesion: 0.07
Nodes (33): AtelierImage, Cardigan, CARDIGAN_NAMES, CHARACTER_NAMES, Control, refresh(), disposeAtelierArt(), HANGABLE (+25 more)

### Community 33 - "remote-visitors.ts"
Cohesion: 0.06
Nodes (36): Attachment, Carried, CarriedState, createCarried(), Character, Perch, Pose, centerYFor() (+28 more)

### Community 34 - "risk.ts"
Cohesion: 0.15
Nodes (28): Hud(), HudProps, HudWagerChip, WagerPicker(), chooseTier(), WagerPickerProps, CatchWagerView, chainChipLabel() (+20 more)

### Community 35 - "amplify/tsconfig.json"
Cohesion: 0.20
Nodes (9): compilerOptions, module, moduleResolution, noUnusedLocals, noUnusedParameters, exclude, extends, include (+1 more)

### Community 36 - "5. Customization menu — what other people are doing"
Cohesion: 0.12
Nodes (16): 1. The target: what "Claude Opus 5.5" actually means, 2. Where your harness stands today (live config I read), 3. The honest gap model, 4. Quality levers, ranked by leverage, 5. Customization menu — what other people are doing, 6. Recommended starting kit for *your* profile, 7. What I can apply for you right now (needs your go-ahead), A. Prompt & persona (most common quality customizations) (+8 more)

### Community 37 - "wallet.ts"
Cohesion: 0.10
Nodes (31): grantPearls(), member(), now, piece(), randomId(), today, baitOf(), applyClaim() (+23 more)

### Community 38 - "handlers.ts"
Cohesion: 0.04
Nodes (75): CONTENT_TYPES, GET(), PUT(), listPieces(), pieceImageUrl(), PieceRow, toPieceDto(), EpochRow (+67 more)

### Community 39 - "Web TSConfig"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 40 - "Root Package Manifest"
Cohesion: 0.06
Nodes (36): [, width, height], description, devDependencies, concurrently@^9.1.0, esbuild@^0.24.0, ktx2-encoder@^0.6.0, maxrects-packer@^2.7.3, playwright@^1.63.0 (+28 more)

### Community 41 - "RigPreview.tsx"
Cohesion: 0.21
Nodes (13): RigPreviewPage(), NEXT, PROPS, RigPreview(), draw(), approach(), createRigState(), GROUNDED (+5 more)

### Community 42 - "createCozyBackdrop"
Cohesion: 0.23
Nodes (13): alphaCanvas(), ceilingGeometry(), createCozyBackdrop(), clearGlows(), glow(), paintShade(), placeGlows(), placeSides() (+5 more)

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

### Community 47 - "audience.ts"
Cohesion: 0.07
Nodes (32): ArtistPage(), dynamic, generateMetadata(), GET(), ConfirmFollow(), dynamic, dynamic, Unsubscribe() (+24 more)

### Community 48 - "slots/store.ts"
Cohesion: 0.13
Nodes (20): ANON_PREFIX, anonKey(), deviceKey(), encodeStored(), isMemberSlotKey(), listKeys(), MEMBER_KEY, memberKey() (+12 more)

### Community 49 - "actions.ts"
Cohesion: 0.21
Nodes (22): dynamic, LocationsPage(), back(), deleteGuestNoteAction(), deletePieceAction(), discardLocationAction(), isThrottled(), nudgeInRowAction() (+14 more)

### Community 50 - "Water.tsx"
Cohesion: 0.08
Nodes (37): AmbientShadow, box(), BUCKET, bunnyBox(), easeOut(), Glint, LEFT_STYLE, lineColour() (+29 more)

### Community 51 - "Worker Package Manifest"
Cohesion: 0.14
Nodes (14): dependencies, @tiny/core@*, exports, ./lambda, @tiny/core, main, name, private (+6 more)

### Community 52 - "Public Asset Manifest"
Cohesion: 0.12
Nodes (15): artworks, bunny, size, floor, size, fonts, icon-no-photos, size (+7 more)

### Community 54 - "wander.test.ts"
Cohesion: 0.17
Nodes (13): Job, NpcRoomInfo, Place, NpcFrame, StayContext, WalkState, BASE_JOB, context() (+5 more)

### Community 55 - "compose-atelier.mjs"
Cohesion: 0.12
Nodes (10): body, dressLayer, dressWidth, floralWidth, hanger, MANNEQUIN_CANVAS, mask, root (+2 more)

### Community 56 - "lib/presence.ts"
Cohesion: 0.09
Nodes (20): PresencePreviewPage(), PresencePreview(), Connect, fetchTicket, HEARTBEAT_MS, HIDDEN_LIMIT_MS, RETRY_MS, sameLook() (+12 more)

### Community 57 - "pond-format.ts"
Cohesion: 0.10
Nodes (36): fetchPondDex(), fetchPondFeed(), PondDex, PondFeedItem, catchLabel(), EXCHANGE_DAILY_STAMPS, EXCHANGE_PEARLS_PER_STAMP, FISH_ART (+28 more)

### Community 58 - "pond-boards.ts"
Cohesion: 0.09
Nodes (28): CatchExtra, clearCatches(), COLUMNS, grantPearls(), insertCatch(), member(), namedMember(), randomId() (+20 more)

### Community 59 - "economy/store.ts"
Cohesion: 0.07
Nodes (71): CARRY_CAP, carryAdd(), CarryEntry, carryPrune(), carryRemove(), chunk(), buildClaim(), BuiltClaim (+63 more)

### Community 60 - "links.ts"
Cohesion: 0.13
Nodes (13): EXITS, hrefFor(), isDoor(), linkedDoor(), LINKS, ActiveRoom, RoomOptions, StageContext (+5 more)

### Community 61 - "room.ts"
Cohesion: 0.12
Nodes (30): attachmentOf(), admitted(), Attachment, farewell(), GHOST_MS, HELLO_TIMEOUT_MS, holdsOf(), MAX_WAITING_PER_IP (+22 more)

### Community 62 - "minimap.ts"
Cohesion: 0.08
Nodes (25): ATELIER_DOOR, follow(), doorPoint(), FALLBACK_TINT, FloorSketch, ICONS, MAP_PLACES, MAP_SCALE (+17 more)

### Community 63 - "personal/room.ts"
Cohesion: 0.10
Nodes (15): CafeLink, GuestBoardNotes, Placards, toScreen(), writeStyle(), createPersonalRoom(), light(), shade() (+7 more)

### Community 64 - "domain/guestboard.ts"
Cohesion: 0.10
Nodes (30): BoardScreen(), BoardScreenProps, ComposeScreen(), ComposeScreenProps, blankDraft(), GuestBoard(), GuestBoardProps, View (+22 more)

### Community 65 - "Sound Effect Assets"
Cohesion: 0.22
Nodes (9): file, kilobytes, seconds, file, kilobytes, seconds, soundEffects, click (+1 more)

### Community 66 - "initialize"
Cohesion: 0.14
Nodes (24): Loading(), AtelierLoading(), revealFloorTransition(), boundedCameraX(), createNearby(), createStage(), closeEntry(), enter() (+16 more)

### Community 67 - "Custom HTTP Headers"
Cohesion: 0.25
Nodes (7): applications, appRoot, customHeaders, headers, pattern, key, value

### Community 68 - "Sharp Layer Package"
Cohesion: 0.33
Nodes (6): dependencies, sharp@^0.33.5, description, sharp, name, private

### Community 69 - "json"
Cohesion: 0.14
Nodes (23): GET(), GET(), GET(), GET(), PER_MEMBER, GET(), PER_MEMBER, BOARDS (+15 more)

### Community 70 - "scene/ambience.ts"
Cohesion: 0.13
Nodes (13): BULBS, createHallAmbience(), finish(), glowTexture(), HallAmbience, mulberry(), painted(), vignetteTexture() (+5 more)

### Community 71 - "BountyPanel.tsx"
Cohesion: 0.16
Nodes (17): GLYPHS, PearlIcon(), POND_CRIMSON, PondIconName, claimPondBounty(), fetchPondBounties(), PondBounties, formatCountdown() (+9 more)

### Community 72 - "wallet/body.ts"
Cohesion: 0.16
Nodes (17): PER_MEMBER, POST(), baitIdOf(), integerOffset(), isRecord(), itemIdOf(), MAX_CLAIM_BATCH, MAX_WALLET_BODY_BYTES (+9 more)

### Community 73 - "createCharacter"
Cohesion: 0.47
Nodes (5): createCharacter(), contextLost(), loadKind(), loseRig(), setFrame()

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
Cohesion: 0.17
Nodes (20): ArtByRoom, blank(), colorAt(), disposePondArt(), EDGE_BAND, EDGE_BANDS, EDGE_OVERLAP, edgeTexture() (+12 more)

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
Cohesion: 0.21
Nodes (23): beginNext(), beginWork(), between(), blockedAt(), chooseStop(), clamp(), doorsIn(), Emote (+15 more)

### Community 84 - "presence/package.json"
Cohesion: 0.14
Nodes (16): dependencies, @tiny/core@*, devDependencies, @cloudflare/workers-types@5.20261016.1, wrangler@4.151.1, @tiny/core, name, private (+8 more)

### Community 85 - "createAtelierRoom"
Cohesion: 0.32
Nodes (20): aspectOf(), createAtelierRoom(), buildCollection(), form(), buildEntrance(), buildRoom(), buildWardrobe(), picture() (+12 more)

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

### Community 93 - "hit"
Cohesion: 0.12
Nodes (31): PER_MEMBER, PUT(), PER_MEMBER, POST(), catchIdOf(), isRecord(), MAX_POND_BODY_BYTES, pearlsOf() (+23 more)

### Community 94 - "createRemoteVisitors"
Cohesion: 0.21
Nodes (9): createRenderer(), createRigLayer(), createRemoteVisitors(), ensureLayer(), load(), placeOwn(), show(), showProp() (+1 more)

### Community 95 - "pond/room.ts"
Cohesion: 0.12
Nodes (23): FAR_LIFT, FAR_SCALE, liftAt(), pathHalfWidth(), pathX(), PondPath, scaleAt(), path (+15 more)

### Community 96 - "query"
Cohesion: 0.08
Nodes (52): registry, started(), analyticsFor(), revokeQrToken(), artistForSession(), AuthedArtist, destroySession(), hashPassword() (+44 more)

### Community 104 - "nearby.ts"
Cohesion: 0.18
Nodes (5): Nearby, NearbyReach, RoomSpan, reach, strip

### Community 105 - "FishingView.tsx"
Cohesion: 0.11
Nodes (16): CONFETTI_COLORS, ConfettiPiece, makeConfetti(), RevealCard(), TIER_MS, TIER_SFX, useCountUp(), chainOffer (+8 more)

### Community 106 - "ticket.ts"
Cohesion: 0.13
Nodes (19): fetch(), Env, parseRoom(), validRoomBase(), decoder, encoder, fromBase64Url(), HmacKey (+11 more)

### Community 107 - "import-hall-assets.mjs"
Cohesion: 0.13
Nodes (11): BASEBOARD, CURTAIN, drop, EXPECTED, manifest, manifestPath, masters, root (+3 more)

### Community 108 - "reveal.ts"
Cohesion: 0.17
Nodes (9): PlaceInfo, InkMap, planGame(), ROUND_SPREAD, createReveal(), compose(), PENCIL, SketchReveal (+1 more)

### Community 109 - "createMinimap"
Cohesion: 0.31
Nodes (9): place(), createMinimap(), draw(), drawRoom(), floors(), sketchOf(), readCollapsed(), svg() (+1 more)

### Community 110 - "graftCostume"
Cohesion: 0.27
Nodes (14): canvasFit(), compose(), graftCostume(), copyAccessor(), copyMaterial(), copyMesh(), copyTexture(), copyView() (+6 more)

### Community 111 - "pondgame/lib/api.ts"
Cohesion: 0.25
Nodes (17): buyPondBait(), CastOptions, castPond(), chainPondBait(), errorOf(), fetchPondState(), isRecord(), memberId() (+9 more)

### Community 112 - "worker/tsconfig.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 113 - "core/tsconfig.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 114 - "CrowdPreview.tsx"
Cohesion: 0.29
Nodes (8): CrowdPreviewPage(), CrowdPreview(), draw(), KINDS, Stats, Window, clearRigLayer(), layer()

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
Cohesion: 0.25
Nodes (15): ClientMessage, isItem(), isName(), isPid(), isSeq(), MAX_HOLDS, MAX_INSTANCE, MAX_MESSAGE_BYTES (+7 more)

### Community 119 - "Costume gallery doorway"
Cohesion: 0.50
Nodes (3): Costume gallery doorway, Curtain colour edit, Prompt

### Community 120 - "art-cache.ts"
Cohesion: 0.13
Nodes (10): ArtCache, ArtCacheOptions, createArtCache(), drop(), expireLater(), hold(), HeldArt, LoadResult (+2 more)

### Community 121 - "Fishing forest: painted asset pass"
Cohesion: 0.10
Nodes (18): Assets, Bruce's collection refresh (2026-11-08), Fishing forest illustrations, Made by hand (not touched by the script), Main hall v2 (2026-11-10), Monets Lily Pond (2026-11-08), 1. Forest doorway, 2. Woodland noticeboard (+10 more)

### Community 124 - "The Costume Atelier"
Cohesion: 0.12
Nodes (15): Adding a character, Adding a costume, Art not supplied as files, Bruce's Chronicles, Checked against the mocks (2026-11-07), Code, Costume fit review, Fitting clothes to other characters (+7 more)

### Community 125 - "Confirmed issues"
Cohesion: 0.11
Nodes (18): Confirmed issues, E2E-002 — Valid edge placement rejected through floating-point precision, E2E-003 — One owned prop can be placed multiple times, E2E-004 — Reload before autosave silently loses the latest placement, E2E-005 — Failed save and failed Done have no visible mobile explanation, E2E-006 — Restoring connectivity does not retry a failed draft save, E2E-007 — Keyboard activation cannot place drawer items, E2E-008 — Creating an account from My Room leaves the signed-in user on the sign-in prompt (+10 more)

### Community 126 - "rig.ts"
Cohesion: 0.13
Nodes (25): Layer, setCostumeVisibility(), canvasToModel(), disposeRigLayer(), Frame, layerTemplates, loadRig(), dispose() (+17 more)

### Community 127 - "Curating the paintings (2026-11-07)"
Cohesion: 0.13
Nodes (14): 1. The registry and the table, 2. The studio's Location picker, 3. The rooms draw what is placed, 4. Credits, 5. Retiring self-serve artists, Building it, Curating the paintings (2026-11-07), Decided (+6 more)

### Community 128 - "hitForVisitor"
Cohesion: 0.16
Nodes (21): ALLOWED, PER_VISITOR, POST(), POST(), GLOBAL, PER_IP, POST(), GLOBAL (+13 more)

### Community 129 - "presence/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, types, exclude, extends, include, ../../tsconfig.base.json

### Community 130 - "env.ts"
Cohesion: 0.27
Nodes (7): SCHEMA_DIR, isProduction(), presenceSecret(), repoRoot, required(), sessionSecret(), setting()

### Community 131 - "tsconfig.test.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 132 - "app/layout.tsx"
Cohesion: 0.12
Nodes (17): bethEllen, inspiratiq, metadata, notoSans, RootLayout(), sniglet, viewport, SoundProvider() (+9 more)

### Community 133 - "ColorRecall.tsx"
Cohesion: 0.20
Nodes (16): ColorRecall(), ColorRecallProps, Phase, readBest(), showMs(), loadColorRecall(), MinigameFrame(), saveIfHigher() (+8 more)

### Community 134 - "peers.ts"
Cohesion: 0.10
Nodes (11): Entry, INTERPOLATION_DELAY_MS, PEER_TIMEOUT_MS, PeerTable, positionAt(), RemoteVisitor, Sample, look (+3 more)

### Community 135 - "ref_node_assert"
Cohesion: 0.11
Nodes (13): blur(), kernel(), XDOG_DEFAULTS, xdogInk(), XdogOptions, ownsAll, ownsNone, ATELIER_SPOTS (+5 more)

### Community 136 - "bug-reports.ts"
Cohesion: 0.20
Nodes (15): BugReportHost(), BugReportSheet, BugReportSheet(), send(), Status, collectContext(), inAppBrowser(), onOpenBugReport() (+7 more)

### Community 137 - "npc-layer.ts"
Cohesion: 0.11
Nodes (33): BY_ID, CAST, castMember(), FRAME, IDLE, idleCel(), NPC_WALK_SPEED, NpcCharacter (+25 more)

### Community 138 - "writeStyle"
Cohesion: 0.13
Nodes (16): createHelm(), createSitting(), hop(), createHallRoom(), buildRoom(), cafeRoom(), raise(), entranceRoom() (+8 more)

### Community 139 - "personal/room.ts"
Cohesion: 0.10
Nodes (24): cafeAfterIndex(), computeLayout(), cutRooms(), HallLayout, HallRoomKind, HallRoomSpan, hasPedestal(), Span (+16 more)

### Community 140 - "Conn"
Cohesion: 0.31
Nodes (4): connectWebSocket(), SocketHandlers, Conn, message()

### Community 141 - "names.ts"
Cohesion: 0.15
Nodes (19): announceNameChange(), NameError, useVisitorName(), VisitorName, Code, 3.2 Chosen names (members), chooseName(), nameOf() (+11 more)

### Community 142 - "domain/guestboard.ts"
Cohesion: 0.16
Nodes (17): GET(), decodeCursor(), encodeCursor(), enforceLimits(), GuestNoteInput, GuestNoteRateLimited, GuestNoteRejected, listGuestNotes() (+9 more)

### Community 143 - "Local end-to-end stress test — 2026-11-06"
Cohesion: 0.22
Nodes (7): Environment and coverage, Follow-up coverage, Issue index, Local end-to-end stress test — 2026-11-06, Measured load, Passing checks and interpretation limits, Test data and cleanup

### Community 144 - "The Moonlit Pond — design"
Cohesion: 0.09
Nodes (22): Art the pond needs from the artist, Build contract (decided 2026-11-07), Build phases, Collection and goals, Done, Done, Guardrails, Leaderboards (+14 more)

### Community 145 - "Pond rework"
Cohesion: 0.18
Nodes (10): Baits, Client, Decisions, Done, Notes, Pond rework, Server, Species (+2 more)

### Community 146 - "rooms/art.ts"
Cohesion: 0.19
Nodes (10): AtelierArt, loadGalleryDoor(), loadGalleryPillar(), loadImage(), AtelierArtwork, PersonalArt, ROOM_ART, RoomArt (+2 more)

### Community 147 - "Orchestration contract — you plan, DSH workers execute"
Cohesion: 0.29
Nodes (6): Briefing a worker, Budget hygiene, graphify, Orchestration contract — you plan, DSH workers execute, The worker, When not to delegate

### Community 148 - "tables.ts"
Cohesion: 0.09
Nodes (40): BaitTray(), BaitTrayProps, PondGameProps, PondGame(), RevealCardProps, PondCatch, CatchView, debugSpecies() (+32 more)

### Community 149 - "db.ts"
Cohesion: 0.22
Nodes (17): loop(), shutdown(), sleep(), sweepStale(), DrainResult, handler(), repairFrames(), repairUnframed() (+9 more)

### Community 150 - "Medium"
Cohesion: 0.22
Nodes (9): onClick(), 10. Long names run off the name sign, 11. The rooms API skips the stale-tab member check, 12. The bunny is dragged along while you pan in Decorate, 6. Failed saves are nearly invisible, and nothing retries, 7. Two tabs editing the same room overwrite each other, 8. The drawer's card row can't be scrolled on touch screens, 9. Decorating can't be done with the keyboard (+1 more)

### Community 151 - "pond-state.ts"
Cohesion: 0.25
Nodes (14): PondStateView, PondTier, ensurePondStateStarted(), getPondStateSnapshot(), GUEST, listeners, LOADING, PondStateSnapshot (+6 more)

### Community 153 - "CharacterKind"
Cohesion: 0.10
Nodes (5): AtelierActions, AtelierRoom, Display, CollectionRoom, CharacterKind

### Community 154 - "next"
Cohesion: 0.16
Nodes (15): config, SECURITY_HEADERS, BugReportsPage(), dateFormat, dynamic, summary(), dateFormat, dynamic (+7 more)

### Community 155 - "rules.ts"
Cohesion: 0.16
Nodes (17): localDay(), at(), EXCHANGE_DAILY_STAMPS, EXCHANGE_PEARLS_PER_STAMP, exchangeClaimKey(), GAME_DAILY_CAP, GameId, GAMES (+9 more)

### Community 157 - "Walkthrough.tsx"
Cohesion: 0.12
Nodes (23): BACKDROP_STYLE, MoreArrow(), NavArrow(), Props, SLIDE, Walkthrough(), XIcon(), decodedFrames (+15 more)

### Community 158 - "createPondRoom"
Cohesion: 0.32
Nodes (13): createPondRoom(), approach(), busy(), finishWalk(), goTo(), leave(), move(), nearest() (+5 more)

### Community 159 - "useSoundEffects.ts"
Cohesion: 0.11
Nodes (27): BackgroundMusic, clampVolume(), isDocumentHidden(), Options, useBackgroundMusic(), VISIBILITY_EVENTS, EFFECTS, EffectSpec (+19 more)

### Community 160 - "BunnyArtist.tsx"
Cohesion: 0.50
Nodes (4): BunnyArtist(), BunnyMood, Pencil(), POSES

### Community 161 - "walk"
Cohesion: 0.12
Nodes (19): between(), CAT, Edge, EDGES, runLandingCat(), choosePeeker(), peek(), walk() (+11 more)

### Community 162 - "editor.ts"
Cohesion: 0.20
Nodes (14): roomEditor, PER_EDITOR, PUT(), versionOf(), PER_EDITOR, POST(), PER_MEMBER, POST() (+6 more)

### Community 163 - "painting-open"
Cohesion: 0.50
Nodes (4): file, kilobytes, seconds, painting-open

### Community 165 - "Multiplayer ("other visitors") — plan v2 (Cloudflare)"
Cohesion: 0.09
Nodes (21): 0. Summary, 10. Decisions, 1. Product contract changes (approved 2026-10-31), 2. What already exists that this builds on, 3.1 Generated names (everyone has one), 3. Names, 4. Transport: Cloudflare Durable Objects, 5.1 Emotes (v1) (+13 more)

### Community 167 - "run.ts"
Cohesion: 0.20
Nodes (7): admin, childEnv, client, database, fresh, migrations, target

### Community 168 - "Tiny Museum"
Cohesion: 0.29
Nodes (6): file(), Deployment, Known gaps, Layout, Running locally, Tiny Museum

### Community 169 - "icon-basket"
Cohesion: 0.67
Nodes (3): icon-basket, file, vector

### Community 170 - "member-route.ts"
Cohesion: 0.22
Nodes (13): POST(), POST(), POST(), checkPasswordRateLimit(), empty(), MemberRequest, clearMemberCookie(), MEMBER_COOKIE (+5 more)

### Community 171 - "visits.ts"
Cohesion: 0.10
Nodes (28): state(), VisitTracker(), isPublicPage(), flush(), startVisit(), visibleMs(), VisitState, count() (+20 more)

### Community 172 - "lib/assets.ts"
Cohesion: 0.10
Nodes (29): Loading(), dynamic, Hall(), MuseumPage(), [BRAND_OWNER, ...BRAND_REST], CurrentlyShowing(), Decor(), dynamic (+21 more)

### Community 176 - "features/economy/index.ts"
Cohesion: 0.06
Nodes (44): MuseumLayout(), CoinToast(), Toast, Purse(), Stamp(), WalletProvider(), serverSnapshot, useEarnEvents() (+36 more)

### Community 177 - "currentArtist"
Cohesion: 0.20
Nodes (14): GET(), PaintingRow, GET(), POST(), UPLOADS_PER_ARTIST, dynamic, RoomPage(), StudioLayout() (+6 more)

### Community 179 - "createPersonalRoom"
Cohesion: 0.27
Nodes (9): aspectOf(), createPlacementLayer(), drawOutline(), dropGhosts(), dropHelper(), extrasFor(), silhouette(), sizeOf() (+1 more)

### Community 180 - "Your Room: a room you can freely furnish"
Cohesion: 0.12
Nodes (11): PlacementTheme, Admin mode (gamma), Decisions (2026-11-17, with the user), Editor (web, `features/rooms/decorate/*`, `PersonalRoom.tsx`), Room look (web, `features/rooms/themes/cozy.ts`, `features/rooms/personal/room.ts`), Scale, Testing locally, The closet: where every room starts (2026-11-17) (+3 more)

### Community 182 - "schedule.test.ts"
Cohesion: 0.12
Nodes (18): RESIDENT_IDS, JOBS, PlaceKind, ROOM_KINDS, ROOMS, PlaceInput, NpcRoom, ResidentState (+10 more)

### Community 183 - "Storyline (draft, saved 2026-11-17)"
Cohesion: 0.18
Nodes (10): Arc (soft, no fail state), Built so far, How it ties to what exists, Mystery hook, Next tasks (when picked up), Open questions, Premise, Seed (the owner's words) (+2 more)

### Community 184 - "bug-reports.ts"
Cohesion: 0.27
Nodes (10): BugReport, BugReportDto, BugReportRejected, BugRow, CONTEXT_KEYS, EVERYONE, normalizeBugPage(), parseBugReport() (+2 more)

### Community 185 - "hall/room.ts"
Cohesion: 0.06
Nodes (47): Assets, Scenery, CUTS, disposeBoards(), Mark, plane(), ROPE_CUTS, ropeSlices() (+39 more)

### Community 186 - "Low"
Cohesion: 0.15
Nodes (13): 13. Pages that redirect or don't exist answer 200, 14. Error codes reveal which room slugs exist, 15. The name sign slides under the top-right buttons in Decorate, 16. Level-up celebrations can be farmed, 17. No hint of where things are after panning away, 18. Too many items is only discovered by the server, 19. Development-only: page payloads include the full room row, Checked and fine (+5 more)

### Community 187 - "gallery/page.tsx"
Cohesion: 0.20
Nodes (13): dynamic, GalleryPage(), PlacePicker(), PlacePickerProps, Phase, PHASE_LABEL, sha256Hex(), UploadWork() (+5 more)

### Community 189 - "ensureEpoch"
Cohesion: 0.21
Nodes (15): GET(), intParam(), GET(), sketchPool, unavailable(), EMPTY, firstSlice(), memo (+7 more)

### Community 190 - "tab-turn.ts"
Cohesion: 0.16
Nodes (5): createTabTurn(), TabTurn, tab(), TurnEnv, TurnMessage

### Community 191 - "import-landing-assets.mjs"
Cohesion: 0.12
Nodes (10): socket(), target, CAT, drop, EXPECTED, manifest, manifestPath, masters (+2 more)

### Community 192 - "session.ts"
Cohesion: 0.20
Nodes (11): AnalyticsPage(), dynamic, dynamic, StudioHome(), publishAction(), signOutAction(), unpublishAction(), clearSessionCookie() (+3 more)

### Community 193 - "Monets Lily Pond: exploration, UX and multiplayer QA"
Cohesion: 0.29
Nodes (6): Browser and interaction coverage, Changes made from the walkthrough, Monets Lily Pond: exploration, UX and multiplayer QA, Multiplayer and load, Practical limits, Regression checks and cleanup

### Community 194 - "loadCozyArt"
Cohesion: 0.20
Nodes (14): canvasTexture(), ceilingTexture(), fishTexture(), floorTexture(), floorWearCanvas(), loadCozyArt(), loadImage(), loadTexture() (+6 more)

### Community 195 - "performance/page.tsx"
Cohesion: 0.31
Nodes (8): dynamic, format(), grade(), METRICS, PAGES, PerformancePage(), RANGES, summarizeVitals()

### Community 196 - "import-home-assets.mjs"
Cohesion: 0.14
Nodes (11): DOOR, DOOR_BACKDROP, drop, FURNITURE, manifest, manifestPath, masters, ORNATE_PAPER (+3 more)

### Community 197 - "pond-api.ts"
Cohesion: 0.17
Nodes (23): refreshWalletNow(), buyPondBait(), errorOf(), exchangePondPearls(), fetchPondLeaderboard(), fetchPondState(), isRecord(), isStateView() (+15 more)

### Community 198 - "lib/slots/index.ts"
Cohesion: 0.06
Nodes (40): AccountHost(), AccountSheet, AccountSheet(), continueAnyway(), doSignOut(), runDelete(), runName(), submit() (+32 more)

### Community 199 - "drawingOn"
Cohesion: 0.18
Nodes (13): atticWindowCanvas(), bareBulbCanvas(), boardsCanvas(), cobwebCanvas(), cozyFinishImageUrl(), creamCanvas(), drawingOn(), dustCanvas() (+5 more)

### Community 200 - "hang-tag.ts"
Cohesion: 0.17
Nodes (6): CARD, createHangTag(), HangTag, HangTagStyle, HOLE, KNOT

### Community 201 - "readMemberBody"
Cohesion: 0.36
Nodes (8): PER_MEMBER, PUT(), PER_IP, POST(), presenceUrl(), readMemberBody(), memberName, validSeed()

### Community 202 - "validatePlacements"
Cohesion: 0.24
Nodes (8): 1. Items placed against a zone edge fail to save, and the whole draft reverts, 2. One owned item can be placed many times, 3. Any save rejection throws away all unsaved work, 4. Changes made just before leaving are lost, 5. Fish trophies can be claimed without playing, High, PlacementOwnership, validatePlacements()

### Community 204 - "Other visitors"
Cohesion: 0.29
Nodes (6): How it plays, Other visitors, Privacy, Running it in production, Running it locally, Staying consistent

### Community 205 - "guestboard/route.ts"
Cohesion: 0.42
Nodes (6): POST(), POST(), rateLimitedResponse(), rejectedResponse(), BugReportRateLimited, postBugReport()

### Community 207 - "rooms.ts"
Cohesion: 0.10
Nodes (42): artist(), member(), piece(), randomId(), sealEpoch(), discardLocation(), hasUnpublished(), nudgeInRow() (+34 more)

### Community 208 - "visits/page.tsx"
Cohesion: 0.27
Nodes (9): amount(), duration(), dynamic, LANDMARKS, PAGES, RANGES, share(), VisitsPage() (+1 more)

### Community 209 - "LandingFx"
Cohesion: 0.28
Nodes (6): glowSprite(), LandingFx(), onVisibility(), tick(), Mote, sprite()

### Community 210 - "PondRoom.tsx"
Cohesion: 0.09
Nodes (24): Loading(), metadata, PondPage(), POND_NAME, FishmongerPanel(), PondLoading(), BOARD_TABS, PondOverlayKind (+16 more)

### Community 211 - "darknessAt"
Cohesion: 0.39
Nodes (6): CEILING, darknessAt(), pool(), RoomLight, smooth(), dirty

### Community 212 - "CodesSection.tsx"
Cohesion: 0.48
Nodes (6): createCodeAction(), deleteCodeAction(), CodeRow, CodesSection(), create(), remove()

### Community 219 - "Item"
Cohesion: 0.19
Nodes (3): Presence, Item, Refusal

### Community 221 - "share.ts"
Cohesion: 0.33
Nodes (5): ShareOutcome, shareResult(), ShareSummary, shareText(), base

## Knowledge Gaps
- **5 isolated node(s):** `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1513 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **32 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `lib/slots/index.ts` to `SketchGuess.tsx`, `app/layout.tsx`, `ColorRecall.tsx`, `bug-reports.ts`, `machine.ts`, `Museum.tsx`, `Test Fakes and Helpers`, `names.ts`, `ArrangeControls.tsx`, `room-events.ts`, `PersonalRoom.tsx`, `tables.ts`, `pond-state.ts`, `wardrobe.ts`, `LeaderboardPanel.tsx`, `Walkthrough.tsx`, `Web Package Dependencies`, `useSoundEffects.ts`, `risk.ts`, `RigPreview.tsx`, `visits.ts`, `lib/assets.ts`, `audience.ts`, `features/economy/index.ts`, `Water.tsx`, `lib/presence.ts`, `pond-format.ts`, `gallery/page.tsx`, `links.ts`, `domain/guestboard.ts`, `initialize`, `BountyPanel.tsx`, `LandingFx`, `PondRoom.tsx`, `CodesSection.tsx`, `FishingView.tsx`, `CrowdPreview.tsx`?**
  _High betweenness centrality (0.089) - this node is a cross-community bridge._
- **What connects `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json` to the rest of the system?**
  _5 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `stage.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.03321123321123321 - nodes in this community are weakly interconnected._
- **Why does `three` connect `remote-visitors.ts` to `atelier.ts`, `stage.ts`, `scene/ambience.ts`, `scene/assets.ts`, `hang-tag.ts`, `npc-layer.ts`, `scene.ts`, `cozy.ts`, `pond/art.ts`, `rooms/art.ts`, `prepare-models.mjs`, `hall/room.ts`, `rig.ts`, `ambience.ts`, `Web Package Dependencies`, `pond/room.ts`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Should `walk.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12183908045977011 - nodes in this community are weakly interconnected._
- **Why does `defaultStore()` connect `lib/slots/index.ts` to `stage.ts`, `remote-visitors.ts`, `initialize`, `pond-api.ts`, `ColorRecall.tsx`, `SyncStore`, `writeStyle`, `pondgame/lib/api.ts`, `room-events.ts`, `currentArtist`, `slots/store.ts`, `PersonalRoom.tsx`, `pond-state.ts`, `wardrobe.ts`, `hall/room.ts`, `economy/store.ts`, `createPondRoom`, `pond/room.ts`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Should `SketchGuess.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1396011396011396 - nodes in this community are weakly interconnected._