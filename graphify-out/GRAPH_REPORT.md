# Graph Report - tiny-museum  (2026-11-27)

## Corpus Check
- 605 files · ~369,582 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 110 file(s) not represented in the graph (top: .avif 60, .glb 38, .css 7)

## Summary
- 5403 nodes · 14227 edges · 227 communities (195 shown, 32 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 278 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f72dd35b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- features/economy/index.ts
- pond-api.ts
- SketchGuess.tsx
- DoorEditor
- pond/art.ts
- round.ts
- floor.ts
- Core Asset Manifest
- scene/assets.ts
- session.ts
- machine.ts
- Museum.tsx
- Test Fakes and Helpers
- scene.ts
- cozy.ts
- logic.ts
- join-room.ts
- schedule.ts
- src/slots/index.ts
- amplify/package.json
- Walkthrough.tsx
- prepare-models.mjs
- progress.ts
- core/package.json
- hitForVisitor
- handlers.ts
- currentMember
- env.ts
- ambience.ts
- core/src/index.ts
- Web Package Dependencies
- Gamifying Tiny Museum — genre direction & engagement research
- Item
- DecorDrawer.tsx
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
- actions.ts
- DecorController
- import-fishing-assets.mjs
- Water.tsx
- Worker Package Manifest
- Public Asset Manifest
- layout.ts
- claim.ts
- compose-atelier.mjs
- AtelierRoom
- PondPanels.tsx
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
- infra/jobs.ts
- wire.ts
- icons.tsx
- Confirmed issues
- DoorEditor
- Visits SQL Schema
- Bunny Walk Sprites
- Room Mockup Settings
- Service Worker Caching
- HallCallbacks
- ticket.ts
- createPresence
- members
- Frame Window Asset
- wander.ts
- presence/package.json
- createAtelierRoom
- Asset pipeline: fast loading without losing sharpness
- Guest Board SQL Schema
- Landscape Frame Asset
- npc-layer.ts
- Bug Reports SQL Schema
- Vitals SQL Schema
- app/page.tsx
- snapshot.ts
- pond/room.ts
- actions.ts
- Run-Once Schema
- pond/room.ts
- FishingView.tsx
- slots/store.ts
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
- domain/sketch.ts
- Fishing forest: painted asset pass
- Audio
- .claude/CLAUDE.md
- The Costume Atelier
- spots.ts
- writeLocal
- createStage
- sketchguess/lib/api.ts
- presence/tsconfig.json
- wallet.ts
- tsconfig.test.json
- lib/presence.ts
- performance/page.tsx
- dependencies
- .webSocketMessage
- perf.ts
- Multiplayer ("other visitors") — plan v2 (Cloudflare)
- Conn
- room-places.ts
- bug-reports.ts
- earn
- master
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
- doors/page.tsx
- run.ts
- Carried
- Walker
- ArtCache
- paintedCostume
- Curating the paintings (2026-11-07)
- placements.ts
- Building it
- AtelierActions
- import-hall-assets.mjs
- db.ts
- Lobby
- roomKit
- a/[slug]/page.tsx
- wander.test.ts
- outbox.test.ts
- Low
- Atelier: the dressing mirror, and show-don't-tell keeping
- bugs/page.tsx
- audience.ts
- playwright
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
- requireArtist
- createPondRoom
- draw.py
- features/rooms/doors.ts
- createPixelRatioGovernor
- SyncStore
- scripts
- Monets Lily Pond: exploration, UX and multiplayer QA
- PaintingEditor.tsx
- exports
- analyticsFor
- boundedCameraX
- RevealCard.tsx
- query
- personal/room.ts
- names.ts
- atelier.ts
- npcs/README.md
- hang-tag.ts
- nearby.ts
- HallArrangerProps
- members.ts
- residentsAt
- app/layout.tsx
- player-card.ts
- petals.ts
- pond-photos.ts
- esbuild
- npc-sheet.cjs
- queryOne
- doors.sql
- AccountSheet
- rooms.ts
- painting-open
- icon-basket
- Notes
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
- `Checked against the mocks (2026-11-07)` --references--> `view()`  [INFERRED]
  docs/costume-atelier.md → packages/core/src/domain/pond-photos.ts

## Import Cycles
- None detected.

## Communities (227 total, 32 thin omitted)

### Community 0 - "features/economy/index.ts"
Cohesion: 0.10
Nodes (31): MuseumLayout(), openAccount(), CoinToast(), Toast, Purse(), Stamp(), WalletProvider(), serverSnapshot (+23 more)

### Community 1 - "pond-api.ts"
Cohesion: 0.14
Nodes (30): AlbumPanel(), remove(), CameraView, openCamera(), keep(), buyPondBait(), claimPondBounty(), deletePondPhoto() (+22 more)

### Community 2 - "SketchGuess.tsx"
Cohesion: 0.07
Nodes (41): bestKeyFor(), BURST, clueUrl(), openingPlan(), Phase, pickAtRandom(), PreparedGame, prepareSketchGame() (+33 more)

### Community 3 - "DoorEditor"
Cohesion: 0.10
Nodes (31): doorDefs(), buildRoom(), ENTRANCE, guideX(), linesOf(), PIXELS, REASONS, addPassage() (+23 more)

### Community 4 - "pond/art.ts"
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
Cohesion: 0.06
Nodes (55): AssetManifest, assetUrl(), bitmapTexture(), blankImage(), CAFE_CAT_FRAMES, CharacterSprites, CompressedLoader, elementTexture() (+47 more)

### Community 9 - "session.ts"
Cohesion: 0.09
Nodes (27): config, SECURITY_HEADERS, GET(), PaintingRow, POST(), UPLOADS_PER_ARTIST, POST(), UPLOADS_PER_ARTIST (+19 more)

### Community 10 - "machine.ts"
Cohesion: 0.12
Nodes (37): FishingView(), CastMeter(), ReelMeter(), armCast(), BITE_WINDOW, biteGap(), CHARGE_PERIOD, chargePower() (+29 more)

### Community 11 - "Museum.tsx"
Cohesion: 0.10
Nodes (30): Loading(), preloadFrames(), AtelierLoading(), CoinFound, ColorRecall, GameDesktop, GuestBoard, HallArranger (+22 more)

### Community 12 - "Test Fakes and Helpers"
Cohesion: 0.12
Nodes (26): deferredFetch(), deviceSlot, FakeEvents, FakeStorage, fixture, fixtureB, fixtureRegistry, fixtureRegistryBoth (+18 more)

### Community 13 - "scene.ts"
Cohesion: 0.04
Nodes (31): disposeDisplayTexture(), HELM_PEDESTAL_FILE, prefersAvif(), HiddenCoin, HallLayout, createNotes(), createPedestal(), Pedestal (+23 more)

### Community 14 - "cozy.ts"
Cohesion: 0.06
Nodes (58): alphaCanvas(), ATELIER_PROPS, AtelierImage, atticWindowCanvas(), bareBulbCanvas(), boardsCanvas(), canvasTexture(), ceilingGeometry() (+50 more)

### Community 15 - "logic.ts"
Cohesion: 0.07
Nodes (69): errorReason(), Offer, overDrawer(), PersonalRoom(), canPlaceNew(), carriedTo(), carryEnd(), carryMove() (+61 more)

### Community 16 - "join-room.ts"
Cohesion: 0.06
Nodes (55): ChatButton(), REFUSED, appendChatMessage(), CHAT_HISTORY_LIMIT, CHAT_HISTORY_WINDOW_MS, chatHistoryKey(), ChatMessage, ChatStorage (+47 more)

### Community 17 - "schedule.ts"
Cohesion: 0.08
Nodes (45): addDwellEmotes(), addEmote(), addStand(), addWalk(), buildRoomTable(), canReturn(), chooseMeeting(), chooseNext() (+37 more)

### Community 18 - "src/slots/index.ts"
Cohesion: 0.10
Nodes (24): PresencePreviewPage(), PresencePreview(), Props, WalkAlone(), announceNameChange(), NameError, useVisitorName(), VisitorName (+16 more)

### Community 19 - "amplify/package.json"
Cohesion: 0.08
Nodes (26): amplifyDir, backend, everyMinutes, mediaBucket, missing, repoRoot, REQUIRED, setting() (+18 more)

### Community 20 - "Walkthrough.tsx"
Cohesion: 0.08
Nodes (33): BACKDROP_STYLE, MoreArrow(), NavArrow(), Props, SLIDE, Walkthrough(), XIcon(), decodedFrames (+25 more)

### Community 21 - "prepare-models.mjs"
Cohesion: 0.07
Nodes (29): alongArm(), ARMS, armTurn(), BODIES, bruce, BRUCE_FIT, BRUCE_PLACE, BRUCE_SLEEVES (+21 more)

### Community 22 - "progress.ts"
Cohesion: 0.09
Nodes (51): latestLetter(), LetterMailbox(), open(), openNext(), LetterMailboxProps, QuestLine(), SERVER_PROGRESS, openCuratorLetter() (+43 more)

### Community 23 - "core/package.json"
Cohesion: 0.16
Nodes (13): devDependencies, @types/bcryptjs@^2.4.6, @types/pg@^8.11.10, main, name, private, scripts, typecheck (+5 more)

### Community 24 - "hitForVisitor"
Cohesion: 0.14
Nodes (25): ALLOWED, PER_VISITOR, POST(), POST(), GLOBAL, PER_IP, POST(), POST() (+17 more)

### Community 25 - "handlers.ts"
Cohesion: 0.09
Nodes (34): confirmedFollowers(), sealEpoch(), GalleryRow, SketchPieceRow, DisplayPieceRow, handleDerivatives(), handleNotifyFollowers(), handleRenderDisplay() (+26 more)

### Community 26 - "currentMember"
Cohesion: 0.12
Nodes (28): GET(), GET(), GET(), GET(), PER_MEMBER, PER_IP, POST(), presenceUrl() (+20 more)

### Community 27 - "env.ts"
Cohesion: 0.36
Nodes (6): isProduction(), presenceSecret(), repoRoot, required(), sessionSecret(), setting()

### Community 28 - "ambience.ts"
Cohesion: 0.12
Nodes (29): blade(), bloom(), BLOOMS, createPondAmbience(), update(), fishTexture(), frond(), FRONT_ROWS (+21 more)

### Community 29 - "core/src/index.ts"
Cohesion: 0.04
Nodes (132): GET(), GET(), PER_MEMBER, CatchExtra, COLUMNS, insertCatch(), member(), namedMember() (+124 more)

### Community 30 - "Web Package Dependencies"
Cohesion: 0.10
Nodes (27): dependencies, embla-carousel-react@^8.6.0, motion@^13.1.1, next@^15.0.3, react@^19.0.0, react-dom@^19.0.0, swr@^2.5.1, three@^0.169.0 (+19 more)

### Community 31 - "Gamifying Tiny Museum — genre direction & engagement research"
Cohesion: 0.10
Nodes (19): 0.1 The core experience, 0.2 Systems that make gamification cheap to build, 0.3 Constraints that shape any recommendation, 0. What the game is today (the deep dive), 1.1 The landscape (seven candidates, with verdicts), 1.2 Recommendation: a **cozy gallery life-sim** — "the gallery you live in", 1.3 The five design pillars the genre implies, 1. Genre direction (+11 more)

### Community 32 - "Item"
Cohesion: 0.14
Nodes (3): Room, Presence, Item

### Community 33 - "DecorDrawer.tsx"
Cohesion: 0.12
Nodes (19): DecorDrawer, DecorDrawerProps, SLOT_LABELS, Tab, TABS, categoryOf(), DrawerCategory, FINISH_SLOTS (+11 more)

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
Cohesion: 0.19
Nodes (26): AtelierPage(), dynamic, metadata, discardLocation(), hangableOnly(), hasUnpublished(), inUse(), locationStates() (+18 more)

### Community 38 - "DecorController"
Cohesion: 0.08
Nodes (4): Job, DecorController, HighlightArea, WorkKind

### Community 39 - "Web TSConfig"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 40 - "Root Package Manifest"
Cohesion: 0.14
Nodes (17): description, devDependencies, concurrently@^9.1.0, ktx2-encoder@^0.6.0, maxrects-packer@^2.7.3, @types/node@^22.9.0, typescript@^5.6.3, typescript (+9 more)

### Community 41 - "pond-format.ts"
Cohesion: 0.06
Nodes (62): refreshWalletNow(), fetchPondFeed(), PondBoardId, PondBoardPeriod, PondBoardRow, PondBounties, PondFeedItem, PondLeaderboard (+54 more)

### Community 42 - "hall/room.ts"
Cohesion: 0.03
Nodes (77): Assets, Scenery, CUTS, disposeBoards(), Mark, plane(), ROPE_CUTS, ropeSlices() (+69 more)

### Community 43 - "(hall)/page.tsx"
Cohesion: 0.23
Nodes (11): Loading(), dynamic, Hall(), MuseumPage(), DENSITY_MEDIA, HallPreload(), HallSkeleton(), EMPTY (+3 more)

### Community 44 - "Base TSConfig"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, lib, module, moduleResolution (+9 more)

### Community 45 - "Amplify Build Spec"
Cohesion: 0.12
Nodes (16): applications, appRoot, backend, frontend, baseDirectory, files, phases, commands (+8 more)

### Community 46 - "rooms/types.ts"
Cohesion: 0.02
Nodes (63): coverFloorTransition(), CameraRig, Character, JumpPose, createRoomPassage(), fixture(), hop(), clamp() (+55 more)

### Community 47 - "actions.ts"
Cohesion: 0.15
Nodes (28): dateFormat, dynamic, GuestBoardPage(), back(), deleteGuestNoteAction(), deletePieceAction(), discardDoorsAction(), discardLocationAction() (+20 more)

### Community 48 - "DecorController"
Cohesion: 0.05
Nodes (19): Carry, PersonalRoomProps, HallRoomData, CozyBackdrop, GhostOptions, PlacementLayer, PlacementTheme, Admin mode (gamma) (+11 more)

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

### Community 53 - "layout.ts"
Cohesion: 0.17
Nodes (14): cafeAfterIndex(), computeLayout(), clear(), placeCafe(), cutRooms(), DoorSpan, HALL_DOOR_FOOT, hallDoorSpan() (+6 more)

### Community 54 - "claim.ts"
Cohesion: 0.17
Nodes (18): CARRY_CAP, carryAdd(), CarryEntry, carryPrune(), carryRemove(), chunk(), buildClaim(), ClaimRequest (+10 more)

### Community 55 - "compose-atelier.mjs"
Cohesion: 0.12
Nodes (10): body, dressLayer, dressWidth, floralWidth, hanger, MANNEQUIN_CANVAS, mask, root (+2 more)

### Community 57 - "PondPanels.tsx"
Cohesion: 0.07
Nodes (41): Loading(), metadata, PondPage(), revealFloorTransition(), POND_NAME, POND_SIGN_NAME, PondStateView, PondTier (+33 more)

### Community 58 - "pond-boards.ts"
Cohesion: 0.13
Nodes (21): BOARDS, GET(), oneOf(), PER_VISITOR, PERIODS, compare(), DexRow, displayName() (+13 more)

### Community 59 - "economy/store.ts"
Cohesion: 0.13
Nodes (32): BuiltClaim, buy(), BuyOutcome, cappedTracked, EMPTY_BAIT, EMPTY_TODAY, ensureStarted(), eventListeners (+24 more)

### Community 60 - "FishingView.tsx"
Cohesion: 0.13
Nodes (21): CAST_ERRORS, coarsePointer(), initialEasyReel(), isTyping(), LOST, Toast, vibrate(), CastPrompt (+13 more)

### Community 61 - "room.ts"
Cohesion: 0.14
Nodes (29): admitted(), Attachment, farewell(), GHOST_MS, HELLO_TIMEOUT_MS, holdsOf(), homeOf(), MAX_WAITING_PER_IP (+21 more)

### Community 62 - "minimap.ts"
Cohesion: 0.07
Nodes (34): createMinimap(), draw(), drawRoom(), floors(), follow(), sketchOf(), doorPoint(), FALLBACK_TINT (+26 more)

### Community 63 - "react"
Cohesion: 0.08
Nodes (48): ColorRecall(), ColorRecallProps, Phase, readBest(), ColorRound, showMs(), BugReportHost(), BugReportSheet (+40 more)

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

### Community 69 - "infra/jobs.ts"
Cohesion: 0.22
Nodes (16): loop(), shutdown(), sleep(), sweepStale(), DrainResult, handler(), repairFrames(), repairUnframed() (+8 more)

### Community 70 - "wire.ts"
Cohesion: 0.14
Nodes (7): INTERPOLATION_DELAY_MS, PEER_TIMEOUT_MS, PeerTable, positionAt(), Sample, look, Peer

### Community 71 - "icons.tsx"
Cohesion: 0.24
Nodes (9): BaitTray(), BaitTrayProps, GuestRollOptions, BAIT, BaitId, GLYPHS, PearlIcon(), POND_CRIMSON (+1 more)

### Community 72 - "Confirmed issues"
Cohesion: 0.11
Nodes (18): Confirmed issues, E2E-002 — Valid edge placement rejected through floating-point precision, E2E-003 — One owned prop can be placed multiple times, E2E-004 — Reload before autosave silently loses the latest placement, E2E-005 — Failed save and failed Done have no visible mobile explanation, E2E-006 — Restoring connectivity does not retry a failed draft save, E2E-007 — Keyboard activation cannot place drawer items, E2E-008 — Creating an account from My Room leaves the signed-in user on the sign-in prompt (+10 more)

### Community 73 - "DoorEditor"
Cohesion: 0.20
Nodes (17): saveDoorsAction(), DoorEditor(), add(), apply(), commitSlide(), nudge(), pick(), pointerDown() (+9 more)

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

### Community 79 - "ticket.ts"
Cohesion: 0.22
Nodes (13): isCatalogItem(), decoder, encoder, fromBase64Url(), HmacKey, isOwn(), isTicket(), keyFor() (+5 more)

### Community 80 - "createPresence"
Cohesion: 0.16
Nodes (15): createPresence(), drop(), heartbeat(), maybeSend(), onPageHide(), receive(), scheduleRetry(), send() (+7 more)

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
Cohesion: 0.44
Nodes (15): aspectOf(), createAtelierRoom(), buildCollection(), form(), buildEntrance(), buildMirror(), buildRoom(), buildWardrobe() (+7 more)

### Community 86 - "Asset pipeline: fast loading without losing sharpness"
Cohesion: 0.22
Nodes (8): Asset pipeline: fast loading without losing sharpness, Character rigs and the Costume Atelier, Completed, Ground rules, Phase 1: fingerprinted files at 2x and 3x, Phase 2: texture atlases for the hall sprites, Phase 3: KTX2 (Basis Universal), built and switched off, Phase 4: ThumbHash placeholders for paintings

### Community 87 - "Guest Board SQL Schema"
Cohesion: 0.67
Nodes (3): guest_notes, guest_notes_visible, rate_limits

### Community 88 - "Landscape Frame Asset"
Cohesion: 0.67
Nodes (3): frameLandscape, size, window

### Community 89 - "npc-layer.ts"
Cohesion: 0.19
Nodes (19): createNpcLayer(), createResidentView(), createView(), departedRecently(), draw(), fadeOut(), glyphWidth(), hideAll() (+11 more)

### Community 93 - "app/page.tsx"
Cohesion: 0.29
Nodes (8): [BRAND_OWNER, ...BRAND_REST], CurrentlyShowing(), Decor(), dynamic, LandingPage(), openAccountCreation(), LandingAccount(), MediaPreconnect()

### Community 94 - "snapshot.ts"
Cohesion: 0.23
Nodes (15): snap(), composeJpeg(), copyCanvas(), grabLayers(), Layer, loadImage(), paint(), px() (+7 more)

### Community 95 - "pond/room.ts"
Cohesion: 0.11
Nodes (26): depthAtLift(), FAR_LIFT, FAR_SCALE, liftAt(), pathHalfWidth(), PondPath, PROP_DEPTH, scaleAt() (+18 more)

### Community 96 - "actions.ts"
Cohesion: 0.14
Nodes (23): dynamic, HangPage(), dynamic, StudioHome(), dynamic, PaintingsPage(), SignIn(), AtelierFrame() (+15 more)

### Community 104 - "pond/room.ts"
Cohesion: 0.08
Nodes (45): allowedCharacter(), OwnedSnapshot, owns(), walletReady(), getWalletSnapshot(), Atelier(), leave(), Look (+37 more)

### Community 105 - "FishingView.tsx"
Cohesion: 0.11
Nodes (17): CONFETTI_COLORS, ConfettiPiece, makeConfetti(), RevealCard(), TIER_MS, useCountUp(), LostReason, chainOffer (+9 more)

### Community 106 - "slots/store.ts"
Cohesion: 0.08
Nodes (22): KeepOnOtherDevices(), withAccountInvite(), Probe(), ANON_PREFIX, anonKey(), deviceKey(), isMemberSlotKey(), listKeys() (+14 more)

### Community 107 - "ClosetView.tsx"
Cohesion: 0.08
Nodes (34): ClosetView(), close(), onKeyDown(), LISTS, PLACE, PODIUM_SRC, Props, Slot (+26 more)

### Community 108 - "npc-layer.ts"
Cohesion: 0.09
Nodes (33): createDoorGuides(), HallGuide, PROJECTED, BY_ID, CAST, castMember(), FRAME, IDLE (+25 more)

### Community 109 - "json"
Cohesion: 0.07
Nodes (73): POST(), PER_MEMBER, PUT(), POST(), GLOBAL, PER_IP, POST(), POST() (+65 more)

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
Nodes (83): CrowdPreviewPage(), RigPreviewPage(), CrowdPreview(), draw(), KINDS, Stats, Window, NEXT (+75 more)

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
Cohesion: 0.16
Nodes (20): cleanNow(), confirmClean(), tidyWithBroom(), CatalogItem, CatalogKind, FREE_CHARACTERS, ITEMS, ItemSlot (+12 more)

### Community 119 - "Costume gallery doorway"
Cohesion: 0.50
Nodes (3): Costume gallery doorway, Curtain colour edit, Prompt

### Community 120 - "domain/sketch.ts"
Cohesion: 0.09
Nodes (29): listPieces(), pieceImageUrl(), PieceRow, toPieceDto(), planSketchRound(), SKETCH_CHOICES, SketchCandidate, SketchRoundPlan (+21 more)

### Community 121 - "Fishing forest: painted asset pass"
Cohesion: 0.10
Nodes (18): Assets, Bruce's collection refresh (2026-11-08), Fishing forest illustrations, Made by hand (not touched by the script), Main hall v2 (2026-11-10), Monets Lily Pond (2026-11-08), 1. Forest doorway, 2. Woodland noticeboard (+10 more)

### Community 122 - "Audio"
Cohesion: 0.50
Nodes (3): Audio, Pond, personal room and MP3 player music, UI effects (`ui/`)

### Community 124 - "The Costume Atelier"
Cohesion: 0.14
Nodes (13): Adding a character, Adding a costume, Art not supplied as files, Bruce's Chronicles, Checked against the mocks (2026-11-07), Code, Costume fit review, Floral collection (+5 more)

### Community 125 - "spots.ts"
Cohesion: 0.22
Nodes (9): COLLECTIONS, ATELIER_SPOTS, FRAME_ASPECT, LOCATIONS, LocationSpec, spotPlacementId(), SpotSpec, ownsAll (+1 more)

### Community 126 - "writeLocal"
Cohesion: 0.32
Nodes (11): undoAdminUnlock(), unlockEverything(), saveIfHigher(), AdminTools(), restartInCloset(), turnOff(), turnOn(), unlock() (+3 more)

### Community 127 - "createStage"
Cohesion: 0.28
Nodes (11): FLICK, flickDirection(), isUpwardFlick(), createNearby(), createStage(), closeEntry(), enter(), handlePointerUp() (+3 more)

### Community 128 - "sketchguess/lib/api.ts"
Cohesion: 0.30
Nodes (10): sameOriginUrl(), decodeImage(), fetchBitmap(), fetchRound(), guarded(), loadInk(), loadRound(), warmImage() (+2 more)

### Community 129 - "presence/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, types, exclude, extends, include, ../../tsconfig.base.json

### Community 130 - "wallet.ts"
Cohesion: 0.06
Nodes (49): GET(), grantPearls(), member(), now, piece(), randomId(), today, baitOf() (+41 more)

### Community 131 - "tsconfig.test.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 132 - "lib/presence.ts"
Cohesion: 0.09
Nodes (20): Entry, Connect, fetchTicket, HEARTBEAT_MS, HIDDEN_LIMIT_MS, RETRY_MS, SAY_GAP_MS, Self (+12 more)

### Community 133 - "performance/page.tsx"
Cohesion: 0.31
Nodes (8): dynamic, format(), grade(), METRICS, PAGES, PerformancePage(), RANGES, summarizeVitals()

### Community 134 - "dependencies"
Cohesion: 0.15
Nodes (13): dependencies, @aws-sdk/client-s3@^3.1121.0, @aws-sdk/s3-request-presigner@^3.1121.0, bcryptjs@^2.4.3, obscenity@^0.4.6, sharp@^0.33.5, thumbhash@^0.1.1, sharp (+5 more)

### Community 135 - ".webSocketMessage"
Cohesion: 0.44
Nodes (3): attachmentOf(), Room, sendTo()

### Community 136 - "perf.ts"
Cohesion: 0.22
Nodes (5): createPerfMeter(), snapshot(), isEnabled(), PerfMeter, PerfSnapshot

### Community 137 - "Multiplayer ("other visitors") — plan v2 (Cloudflare)"
Cohesion: 0.11
Nodes (17): 0. Summary, 10. Decisions, 1. Product contract changes (approved 2026-10-31), 2. What already exists that this builds on, 4. Transport: Cloudflare Durable Objects, 5.1 Emotes (v1), 5. Protocol (`packages/core/src/presence/protocol.ts`), 8.1 Expected cost (+9 more)

### Community 138 - "Conn"
Cohesion: 0.27
Nodes (5): send(), connectWebSocket(), SocketHandlers, Conn, message()

### Community 139 - "room-places.ts"
Cohesion: 0.14
Nodes (22): PlaceKind, atelierRoomInfo(), atelierX(), copy(), FurniturePlacement, hallCache, hallRoomInfo(), onGround() (+14 more)

### Community 140 - "bug-reports.ts"
Cohesion: 0.08
Nodes (36): POST(), GET(), POST(), rateLimitedResponse(), rejectedResponse(), MAX_BUG_CONTACT, MAX_BUG_ERRORS, MAX_BUG_MESSAGE (+28 more)

### Community 141 - "earn"
Cohesion: 0.29
Nodes (10): earn(), emit(), emitEarned(), maybeInvite(), writeSession(), tap(), enterDoor(), tap() (+2 more)

### Community 142 - "master"
Cohesion: 0.28
Nodes (9): closedWaist(), goldOutfits(), image(), master(), placed(), rig(), slimGlb(), write() (+1 more)

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
Cohesion: 0.19
Nodes (15): initialize(), aim(), drawFrame(), handleClick(), handlePointerDown(), handlePointerMove(), isResting(), prefetchNearDoors() (+7 more)

### Community 147 - "Orchestration contract — you plan, DSH workers execute"
Cohesion: 0.29
Nodes (6): Briefing a worker, Budget hygiene, graphify, Orchestration contract — you plan, DSH workers execute, The worker, When not to delegate

### Community 148 - "tables.ts"
Cohesion: 0.09
Nodes (37): PondGameProps, PondGame(), RevealCardProps, PondCatch, CatchView, debugSpecies(), debugTokens(), debugVariant() (+29 more)

### Community 149 - "Tiny Museum v1 · Curator Letters"
Cohesion: 0.17
Nodes (11): Letter 0 · Clean up your room, Letter 1 · Place your first decoration, Letter 2 · Visit the first gallery, Letter 3 · Play a mini-game, Letter 4 · Unlock an outfit or character, Letter 5 · Find the seasonal items, Letter 6 · Unlock the daily calendar, Letter 7 · The cliffhanger and email signup (+3 more)

### Community 150 - "useBackgroundMusic.ts"
Cohesion: 0.08
Nodes (31): StageOptions, RoomSound, SoundState, BackgroundMusic, clampVolume(), isDocumentHidden(), Options, useBackgroundMusic() (+23 more)

### Community 153 - "doors/page.tsx"
Cohesion: 0.19
Nodes (12): DoorsPage(), dynamic, hallPaintings(), GuideTalk, HallPainting, DoorsRow, doorsState, parsed() (+4 more)

### Community 154 - "run.ts"
Cohesion: 0.17
Nodes (9): admin, childEnv, client, database, fresh, migrations, target, pg@^8.13.1 (+1 more)

### Community 156 - "Walker"
Cohesion: 0.14
Nodes (5): NpcGround, PondPlaceData, FloorPoint, WalkArea, Walker

### Community 158 - "paintedCostume"
Cohesion: 0.33
Nodes (5): paintedCostume(), floralOutfits(), turned(), Fitting clothes to other characters, Headpieces

### Community 159 - "Curating the paintings (2026-11-07)"
Cohesion: 0.20
Nodes (9): hang(), Curating the paintings (2026-11-07), Decided, How it is built, Testing, The fashion area's spots, The idea, The model (+1 more)

### Community 160 - "placements.ts"
Cohesion: 0.07
Nodes (30): Catalogue, Data model (core), 1. Items placed against a zone edge fail to save, and the whole draft reverts, 2. One owned item can be placed many times, 3. Any save rejection throws away all unsaved work, 4. Changes made just before leaving are lost, 5. Fish trophies can be claimed without playing, High (+22 more)

### Community 161 - "Building it"
Cohesion: 0.33
Nodes (6): 1. The registry and the table, 2. The studio's Location picker, 3. The rooms draw what is placed, 4. Credits, 5. Retiring self-serve artists, Building it

### Community 163 - "import-hall-assets.mjs"
Cohesion: 0.03
Nodes (46): socket(), bodyTextures, COATS, { json, bin }, manifest, maps, target, BASEBOARD (+38 more)

### Community 164 - "db.ts"
Cohesion: 0.11
Nodes (17): CONTENT_TYPES, GET(), PUT(), ACCEPTED, createAssetFromUpload(), MAX_UPLOAD_BYTES, presignUpload(), registerUpload() (+9 more)

### Community 167 - "a/[slug]/page.tsx"
Cohesion: 0.33
Nodes (6): ArtistPage(), dynamic, generateMetadata(), GET(), FollowForm(), getArtistPage()

### Community 168 - "wander.test.ts"
Cohesion: 0.16
Nodes (11): Job, Place, WalkState, BASE_JOB, context(), L_GROUND, mulberry32(), room() (+3 more)

### Community 169 - "outbox.test.ts"
Cohesion: 0.27
Nodes (12): OUTBOX_CAP, outboxAdd(), outboxDue(), OutboxEntry, outboxFail(), outboxRemove(), RETRY_BASE_MS, RETRY_MAX_MS (+4 more)

### Community 170 - "Low"
Cohesion: 0.15
Nodes (13): 13. Pages that redirect or don't exist answer 200, 14. Error codes reveal which room slugs exist, 15. The name sign slides under the top-right buttons in Decorate, 16. Level-up celebrations can be farmed, 17. No hint of where things are after panning away, 18. Too many items is only discovered by the server, 19. Development-only: page payloads include the full room row, Checked and fine (+5 more)

### Community 171 - "Atelier: the dressing mirror, and show-don't-tell keeping"
Cohesion: 0.13
Nodes (14): Atelier: the dressing mirror, and show-don't-tell keeping, Build order, Built (2026-11-20), Decisions (2026-11-19), Follow-ups (2026-11-20), Goal, In the room, Keeping (+6 more)

### Community 172 - "bugs/page.tsx"
Cohesion: 0.47
Nodes (5): BugReportsPage(), dateFormat, dynamic, summary(), listBugReports()

### Community 173 - "audience.ts"
Cohesion: 0.12
Nodes (19): ConfirmFollow(), dynamic, dynamic, Unsubscribe(), FollowNotice(), BRAND, AnalyticsSummary, confirmFollow() (+11 more)

### Community 174 - "playwright"
Cohesion: 0.40
Nodes (3): [, width, height], playwright@^1.63.0, playwright

### Community 175 - "ref_node_assert"
Cohesion: 0.13
Nodes (19): STAMP_SVG, shape, fixtureRegistry, valid, byAtThenKey(), mapOf(), maxNumber(), put() (+11 more)

### Community 176 - "Medium"
Cohesion: 0.25
Nodes (8): 10. Long names run off the name sign, 11. The rooms API skips the stale-tab member check, 12. The bunny is dragged along while you pan in Decorate, 6. Failed saves are nearly invisible, and nothing retries, 7. Two tabs editing the same room overwrite each other, 8. The drawer's card row can't be scrolled on touch screens, 9. Decorating can't be done with the keyboard, Medium

### Community 177 - "visits.ts"
Cohesion: 0.11
Nodes (27): state(), amount(), duration(), dynamic, LANDMARKS, PAGES, RANGES, share() (+19 more)

### Community 178 - "walk"
Cohesion: 0.12
Nodes (18): between(), CAT, Edge, EDGES, runLandingCat(), choosePeeker(), peek(), walk() (+10 more)

### Community 179 - "protocol.ts"
Cohesion: 0.16
Nodes (21): fetch(), Env, isHome(), isItem(), isName(), isPid(), isSeq(), MAX_HOLDS (+13 more)

### Community 180 - "Local end-to-end stress test — 2026-11-06"
Cohesion: 0.22
Nodes (7): Environment and coverage, Follow-up coverage, Issue index, Local end-to-end stress test — 2026-11-06, Measured load, Passing checks and interpretation limits, Test data and cleanup

### Community 181 - "LandingFx"
Cohesion: 0.22
Nodes (10): glowSprite(), LandingFx(), onClick(), onVisibility(), psst(), spawnMist(), tick(), Mist (+2 more)

### Community 182 - "schedule.test.ts"
Cohesion: 0.08
Nodes (22): RESIDENT_IDS, FloorSpot, ROOM_KINDS, ROOMS, NpcRoom, Phase, ResidentState, ROOM_DOORS (+14 more)

### Community 183 - "Storyline (draft, saved 2026-11-17)"
Cohesion: 0.15
Nodes (12): Arc (soft, no fail state), Built so far, How it ties to what exists, Locked (2026-11-21, the owner), Next tasks (when picked up), Open questions, Premise, Revision (2026-11-21, the owner) (+4 more)

### Community 184 - "backdrop.ts"
Cohesion: 0.11
Nodes (19): shape(), createHallAmbience(), finish(), glowTexture(), HallAmbience, mulberry(), painted(), vignetteTexture() (+11 more)

### Community 185 - "bake-pond-path.mjs"
Cohesion: 0.21
Nodes (7): blank(), manifest, manifestPath, ORIGINAL_SOURCE, originalPath(), root, softened()

### Community 186 - "requireArtist"
Cohesion: 0.33
Nodes (8): createCodeAction(), deleteCodeAction(), CodeRow, CodesSection(), create(), remove(), ensureQrToken(), revokeQrToken()

### Community 187 - "createPondRoom"
Cohesion: 0.30
Nodes (14): pathX(), createPondRoom(), approach(), busy(), finishWalk(), goTo(), leave(), move() (+6 more)

### Community 189 - "features/rooms/doors.ts"
Cohesion: 0.17
Nodes (15): guides(), doorArtUrl(), loadDoorArt(), loadRoomDoorArt(), pending, doorsOf(), museumDoors(), setMuseumDoors() (+7 more)

### Community 190 - "createPixelRatioGovernor"
Cohesion: 0.33
Nodes (7): createPixelRatioGovernor(), reset(), stepTo(), PIXEL_RATIO_STEPS, pixelRatioSteps(), Renderer, governor()

### Community 191 - "SyncStore"
Cohesion: 0.13
Nodes (10): encodeStored(), parseStored(), readStored(), removeStored(), writeStored(), deepEq(), SlotState, SyncStore (+2 more)

### Community 192 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, db:schema, deploy:backend, dev, dev:presence, dev:web, dev:worker (+6 more)

### Community 193 - "Monets Lily Pond: exploration, UX and multiplayer QA"
Cohesion: 0.29
Nodes (6): Browser and interaction coverage, Changes made from the walkthrough, Monets Lily Pond: exploration, UX and multiplayer QA, Multiplayer and load, Practical limits, Regression checks and cleanup

### Community 194 - "PaintingEditor.tsx"
Cohesion: 0.28
Nodes (7): EditedPainting, isLink(), PaintingEditor(), upload(), Phase, PHASE_LABEL, sha256Hex()

### Community 195 - "exports"
Cohesion: 0.15
Nodes (13): exports, ./brand, ./bugs, ./economy, ./guestboard, ./presence, ./presence/messages, ./presence/wire (+5 more)

### Community 196 - "analyticsFor"
Cohesion: 0.67
Nodes (3): AnalyticsPage(), dynamic, analyticsFor()

### Community 198 - "RevealCard.tsx"
Cohesion: 0.08
Nodes (26): KeepsakeFound(), USE_HINT, PondMusic(), SONG, catchArt(), gradeLabel(), JOURNAL_FAMILIES, JOURNAL_GRADES (+18 more)

### Community 199 - "query"
Cohesion: 0.13
Nodes (22): clearCatches(), grantPearls(), setState(), deletePiece(), GalleryPiece, hangPiece(), MAX_STANDS, movePiece() (+14 more)

### Community 200 - "personal/room.ts"
Cohesion: 0.07
Nodes (33): PersonalArt, createDecorController(), canvasRect(), targetRise(), toScreen(), createPersonalRoom(), light(), shade() (+25 more)

### Community 201 - "names.ts"
Cohesion: 0.16
Nodes (16): checkMessage(), INVISIBLE, MESSAGE_MAX, MessageCheck, normalizeMessage(), ADJECTIVES, checkDisplayName(), NAME_LIMITS (+8 more)

### Community 202 - "atelier.ts"
Cohesion: 0.04
Nodes (56): AtelierArt, AtelierDoor, AtelierImage, BuiltRoom, Cardigan, CARDIGAN_NAMES, ClothingItem, Control (+48 more)

### Community 204 - "hang-tag.ts"
Cohesion: 0.14
Nodes (7): CARD, createHangTag(), HangTag, HangTagStyle, HOLE, KNOT, What goes, and what replaces it

### Community 205 - "nearby.ts"
Cohesion: 0.18
Nodes (5): Nearby, NearbyReach, RoomSpan, reach, strip

### Community 207 - "members.ts"
Cohesion: 0.08
Nodes (39): submit(), Code, How it plays, Other visitors, 3.1 Generated names (everyone has one), 3.2 Chosen names (members), 3. Names, Privacy (+31 more)

### Community 208 - "residentsAt"
Cohesion: 0.27
Nodes (11): addGap(), along(), buildStayPlan(), clamp(), doorX(), posMod(), residentsAt(), roomAtBlock() (+3 more)

### Community 209 - "app/layout.tsx"
Cohesion: 0.07
Nodes (30): bethEllen, inspiratiq, metadata, notoSans, RootLayout(), sniglet, viewport, AccountHost() (+22 more)

### Community 210 - "player-card.ts"
Cohesion: 0.09
Nodes (16): createPlayerCard(), hide(), onPointerDown(), Door, doorOf(), PlayerCard, wallpaperOf(), cozyLevel (+8 more)

### Community 211 - "petals.ts"
Cohesion: 0.24
Nodes (6): createDoorPetals(), DoorPetals, mulberry(), Petal, petalTexture(), PondDoor

### Community 212 - "pond-photos.ts"
Cohesion: 0.33
Nodes (8): addPondPhoto(), AddPondPhotoResult, isJpeg(), listPondPhotos(), POND_PHOTO_LIMIT, PondPhoto, view(), pondKeepsakeItem()

### Community 216 - "npc-sheet.cjs"
Cohesion: 0.31
Nodes (8): CFG, closeEye(), eraseMouth(), inpaint(), sample(), sharp, [src, out, cfgPath], warp()

### Community 217 - "queryOne"
Cohesion: 0.15
Nodes (21): GET(), intParam(), GET(), sketchPool, unavailable(), MuseumProps, SlotRuntime, HallRoomOptions (+13 more)

### Community 221 - "AccountSheet"
Cohesion: 0.39
Nodes (7): AccountSheet(), continueAnyway(), doSignOut(), runDelete(), runName(), submitDelete(), submitName()

### Community 224 - "rooms.ts"
Cohesion: 0.07
Nodes (41): roomEditor, PER_EDITOR, PUT(), versionOf(), PER_MEMBER, POST(), PER_EDITOR, POST() (+33 more)

### Community 225 - "painting-open"
Cohesion: 0.50
Nodes (4): file, kilobytes, seconds, painting-open

### Community 230 - "icon-basket"
Cohesion: 0.67
Nodes (3): icon-basket, file, vector

## Knowledge Gaps
- **5 isolated node(s):** `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1734 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **32 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `features/economy/index.ts`, `pond-api.ts`, `SketchGuess.tsx`, `DoorEditor`, `Museum.tsx`, `Test Fakes and Helpers`, `logic.ts`, `join-room.ts`, `src/slots/index.ts`, `Walkthrough.tsx`, `progress.ts`, `useBackgroundMusic.ts`, `Web Package Dependencies`, `DecorDrawer.tsx`, `risk.ts`, `pond-format.ts`, `(hall)/page.tsx`, `rooms/types.ts`, `Water.tsx`, `LandingFx`, `PondPanels.tsx`, `requireArtist`, `FishingView.tsx`, `domain/guestboard.ts`, `PaintingEditor.tsx`, `RevealCard.tsx`, `icons.tsx`, `app/layout.tsx`, `app/page.tsx`, `actions.ts`, `pond/room.ts`, `FishingView.tsx`, `slots/store.ts`, `ClosetView.tsx`, `rig.ts`, `writeLocal`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **What connects `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json` to the rest of the system?**
  _5 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `features/economy/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10404040404040404 - nodes in this community are weakly interconnected._
- **Why does `useSound()` connect `react` to `features/economy/index.ts`, `pond-api.ts`, `SketchGuess.tsx`, `machine.ts`, `Museum.tsx`, `logic.ts`, `join-room.ts`, `Walkthrough.tsx`, `progress.ts`, `DecorDrawer.tsx`, `risk.ts`, `a/[slug]/page.tsx`, `pond-format.ts`, `rooms/types.ts`, `LandingFx`, `PondPanels.tsx`, `FishingView.tsx`, `domain/guestboard.ts`, `RevealCard.tsx`, `icons.tsx`, `app/layout.tsx`, `AccountSheet`, `pond/room.ts`, `ClosetView.tsx`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Should `pond-api.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1443850267379679 - nodes in this community are weakly interconnected._
- **Why does `three` connect `hall/room.ts` to `pond/art.ts`, `scene/assets.ts`, `perf.ts`, `atelier.ts`, `npc-layer.ts`, `hang-tag.ts`, `scene.ts`, `rooms/types.ts`, `join-room.ts`, `cozy.ts`, `rig.ts`, `petals.ts`, `backdrop.ts`, `paintedCostume`, `ambience.ts`, `Web Package Dependencies`, `pond/room.ts`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Should `SketchGuess.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07239819004524888 - nodes in this community are weakly interconnected._