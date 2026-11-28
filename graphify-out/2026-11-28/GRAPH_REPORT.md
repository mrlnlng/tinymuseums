# Graph Report - tiny-museum  (2026-11-28)

## Corpus Check
- 612 files · ~376,970 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 118 file(s) not represented in the graph (top: .avif 60, .glb 46, .css 7)

## Summary
- 5458 nodes · 14465 edges · 228 communities (197 shown, 31 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 280 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `59baff3a`
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
- remote-visitors.ts
- amplify/package.json
- AtelierHooks
- prepare-models.mjs
- progress.ts
- core/package.json
- domain/guestboard.ts
- handlers.ts
- mutation-guard.ts
- writeStyle
- ambience.ts
- core/src/index.ts
- Web Package Dependencies
- Gamifying Tiny Museum — genre direction & engagement research
- DoorEditor
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
- lib/slots/index.ts
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
- ticket/route.ts
- economy/store.ts
- FishingView.tsx
- room.ts
- minimap.ts
- AtelierKeeps.tsx
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
- stage.ts
- snapshot.ts
- atelier/room.ts
- actions.ts
- Run-Once Schema
- lib/assets.ts
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
- hall/room.ts
- Costume gallery doorway
- env.ts
- Fishing forest: painted asset pass
- Audio
- .claude/CLAUDE.md
- The Costume Atelier
- messages.ts
- chat-history.ts
- Walkthrough.tsx
- sketchguess/lib/api.ts
- presence/tsconfig.json
- FishTier
- tsconfig.test.json
- lib/presence.ts
- MirrorView.tsx
- session.ts
- .webSocketMessage
- import-hall-assets.mjs
- Multiplayer ("other visitors") — plan v2 (Cloudflare)
- DoorEditor.tsx
- room-places.ts
- react
- Open rooms and the tip jar (design, 2026-11-21)
- ref_node_assert
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
- layout.ts
- run.ts
- AccountSheet.tsx
- Walker
- wander.test.ts
- tab-turn.ts
- Curating the paintings (2026-11-07)
- catalog.ts
- rooms/art.ts
- outbox.test.ts
- join-room.ts
- FilesystemStorage
- writeLocal
- readJsonBody
- ticket.ts
- plan.ts
- rooms/index.ts
- Low
- Atelier: the dressing mirror, and show-don't-tell keeping
- createPlacementLayer
- studio/layout.tsx
- a/[slug]/page.tsx
- ref_node_assert
- AccountSheet
- visits.ts
- Item
- protocol.ts
- Your Room: a room you can freely furnish
- Approved v4 bunny in the hall
- schedule.test.ts
- Storyline (draft, saved 2026-11-17)
- backdrop.ts
- bake-pond-path.mjs
- Local end-to-end stress test — 2026-11-06
- createPondRoom
- draw.py
- doors/page.tsx
- earn
- slots/store.ts
- scripts
- Monets Lily Pond: exploration, UX and multiplayer QA
- walk
- names.ts
- Low
- sizes.test.ts
- PondPanels.tsx
- opening.ts
- share.ts
- Medium
- atelier.ts
- npcs/README.md
- Wardrobe
- Cafe
- Other visitors
- queryOne
- createDecorController
- react
- Clock
- petals.ts
- PlayerCard
- Lobby
- PondRulesProps
- Handoff: move the Tiny Museum bunny from sprite frames to a rig
- npc-sheet.cjs
- focus.ts
- HelmShare
- doors.sql
- TreeSparkles
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
- `1. What is in this bundle` --references--> `walk()`  [INFERRED]
  docs/bunny-rig-author-handoff.md → apps/web/src/features/landing/cat.ts
- `3. The rig` --references--> `walk()`  [INFERRED]
  docs/bunny-rig-author-handoff.md → apps/web/src/features/landing/cat.ts
- `Rendering and movement` --references--> `walk()`  [INFERRED]
  docs/bunny-rig-integration.md → apps/web/src/features/landing/cat.ts
- `5.1 Emotes (v1)` --references--> `ScreenChrome()`  [INFERRED]
  docs/multiplayer-plan.md → apps/web/src/shared/components/ScreenChrome.tsx

## Import Cycles
- None detected.

## Communities (228 total, 31 thin omitted)

### Community 0 - "stage.ts"
Cohesion: 0.03
Nodes (50): Viewport, JOBS, NpcRoomInfo, FLAT, NpcFrame, NpcView, PROJECTED, ResidentView (+42 more)

### Community 1 - "Traversal"
Cohesion: 0.11
Nodes (4): clamp(), fixture(), jump(), Traversal

### Community 2 - "SketchGuess.tsx"
Cohesion: 0.13
Nodes (26): BunnyMood, bestKeyFor(), BURST, clueUrl(), openingPlan(), Phase, pickAtRandom(), prepareSketchGame() (+18 more)

### Community 3 - "src/rooms/doors.ts"
Cohesion: 0.14
Nodes (21): DoorsRow, parsed(), saveDoorsDraft(), addPassage(), checkDoors(), DEFAULT_DOORS, DOOR_ASPECT, DOOR_GAP (+13 more)

### Community 4 - "assetUrl"
Cohesion: 0.13
Nodes (24): ArtByRoom, colorAt(), decoded(), disposePondArt(), EDGE_BAND, EDGE_BANDS, EDGE_OVERLAP, edgeTexture() (+16 more)

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
Cohesion: 0.06
Nodes (52): AssetManifest, assetUrl(), bitmapTexture(), blankImage(), CAFE_CAT_FRAMES, CompressedLoader, elementTexture(), ENTRANCE_FILES (+44 more)

### Community 9 - "pond-api.ts"
Cohesion: 0.09
Nodes (41): AlbumPanel(), remove(), CameraView, openCamera(), keep(), JOURNAL_SIZE, buyPondBait(), claimPondBounty() (+33 more)

### Community 10 - "machine.ts"
Cohesion: 0.12
Nodes (37): FishingView(), CastMeter(), ReelMeter(), armCast(), BITE_WINDOW, biteGap(), CHARGE_PERIOD, chargePower() (+29 more)

### Community 11 - "personal/room.ts"
Cohesion: 0.07
Nodes (31): createPersonalRoom(), light(), shade(), showArrangement(), signFilter(), DOOR_SIGN, gloomFor(), lightOf() (+23 more)

### Community 12 - "Test Fakes and Helpers"
Cohesion: 0.12
Nodes (27): deferredFetch(), deviceSlot, FakeEvents, FakeStorage, fixture, fixtureB, fixtureRegistry, fixtureRegistryBoth (+19 more)

### Community 13 - "scene.ts"
Cohesion: 0.04
Nodes (33): MuseumProps, disposeDisplayTexture(), HELM_PEDESTAL_FILE, prefersAvif(), HiddenCoin, Helm, createNotes(), createPedestal() (+25 more)

### Community 14 - "cozy.ts"
Cohesion: 0.07
Nodes (47): alphaCanvas(), ATELIER_PROPS, AtelierImage, atticWindowCanvas(), bareBulbCanvas(), boardsCanvas(), canvasTexture(), ceilingTexture() (+39 more)

### Community 15 - "logic.ts"
Cohesion: 0.10
Nodes (47): errorReason(), overDrawer(), PersonalRoom(), canPlaceNew(), carriedTo(), carryEnd(), carryMove(), cleanNow() (+39 more)

### Community 16 - "room-events.ts"
Cohesion: 0.19
Nodes (25): ChatButton(), REFUSED, getChatHistory(), getPeople(), hasRoom(), history, isChatMuted(), isInRoom() (+17 more)

### Community 17 - "schedule.ts"
Cohesion: 0.07
Nodes (56): addDwellEmotes(), addEmote(), addGap(), addStand(), addWalk(), along(), buildRoomTable(), buildStayPlan() (+48 more)

### Community 18 - "remote-visitors.ts"
Cohesion: 0.05
Nodes (23): CharacterSprites, Attachment, Carried, Character, Perch, Pose, Matcha, writeHidden() (+15 more)

### Community 19 - "amplify/package.json"
Cohesion: 0.08
Nodes (26): amplifyDir, backend, everyMinutes, mediaBucket, missing, repoRoot, REQUIRED, setting() (+18 more)

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
Cohesion: 0.11
Nodes (32): ALLOWED, PER_VISITOR, POST(), POST(), GLOBAL, PER_IP, POST(), GLOBAL (+24 more)

### Community 25 - "handlers.ts"
Cohesion: 0.04
Nodes (96): CONTENT_TYPES, GET(), PUT(), loop(), sleep(), sweepStale(), DrainResult, handler() (+88 more)

### Community 26 - "mutation-guard.ts"
Cohesion: 0.67
Nodes (3): allowedOrigin(), isSameOriginMutation(), LOOPBACK

### Community 27 - "writeStyle"
Cohesion: 0.24
Nodes (4): GuestBoardNotes, Placards, toScreen(), writeStyle()

### Community 28 - "ambience.ts"
Cohesion: 0.12
Nodes (32): blade(), bloom(), BLOOMS, createPondAmbience(), update(), fishTexture(), frond(), FRONT_ROWS (+24 more)

### Community 29 - "core/src/index.ts"
Cohesion: 0.03
Nodes (166): GET(), CatchExtra, clearCatches(), COLUMNS, grantPearls(), insertCatch(), member(), namedMember() (+158 more)

### Community 30 - "Web Package Dependencies"
Cohesion: 0.07
Nodes (35): dependencies, embla-carousel-react@^8.6.0, motion@^13.1.1, next@^15.0.3, react@^19.0.0, react-dom@^19.0.0, swr@^2.5.1, three@^0.169.0 (+27 more)

### Community 31 - "Gamifying Tiny Museum — genre direction & engagement research"
Cohesion: 0.10
Nodes (19): 0.1 The core experience, 0.2 Systems that make gamification cheap to build, 0.3 Constraints that shape any recommendation, 0. What the game is today (the deep dive), 1.1 The landscape (seven candidates, with verdicts), 1.2 Recommendation: a **cozy gallery life-sim** — "the gallery you live in", 1.3 The five design pillars the genre implies, 1. Genre direction (+11 more)

### Community 32 - "DoorEditor"
Cohesion: 0.18
Nodes (19): hallDoorSpan(), saveDoorsAction(), DoorEditor(), add(), apply(), commitSlide(), nudge(), pick() (+11 more)

### Community 33 - "DecorDrawer.tsx"
Cohesion: 0.07
Nodes (42): Door, doorOf(), wallpaperOf(), DecorDrawer, DecorDrawerProps, SLOT_LABELS, Tab, TABS (+34 more)

### Community 34 - "risk.ts"
Cohesion: 0.12
Nodes (31): BaitTray(), Hud(), HudProps, HudWagerChip, WagerPicker(), chooseTier(), stepStake(), WagerPickerProps (+23 more)

### Community 35 - "amplify/tsconfig.json"
Cohesion: 0.20
Nodes (9): compilerOptions, module, moduleResolution, noUnusedLocals, noUnusedParameters, exclude, extends, include (+1 more)

### Community 36 - "5. Customization menu — what other people are doing"
Cohesion: 0.12
Nodes (16): 1. The target: what "Claude Opus 5.5" actually means, 2. Where your harness stands today (live config I read), 3. The honest gap model, 4. Quality levers, ranked by leverage, 5. Customization menu — what other people are doing, 6. Recommended starting kit for *your* profile, 7. What I can apply for you right now (needs your go-ahead), A. Prompt & persona (most common quality customizations) (+8 more)

### Community 37 - "rooms.ts"
Cohesion: 0.07
Nodes (60): The closet: where every room starts (2026-11-17), artist(), member(), piece(), randomId(), discardLocation(), hangableOnly(), hasUnpublished() (+52 more)

### Community 38 - "wallet.ts"
Cohesion: 0.06
Nodes (48): snapshot(), shutdown(), Checked against the mocks (2026-11-07), grantPearls(), member(), now, piece(), randomId() (+40 more)

### Community 39 - "Web TSConfig"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 40 - "Root Package Manifest"
Cohesion: 0.10
Nodes (22): [, width, height], description, devDependencies, concurrently@^9.1.0, esbuild@^0.24.0, ktx2-encoder@^0.6.0, maxrects-packer@^2.7.3, playwright@^1.63.0 (+14 more)

### Community 41 - "pond-api.ts"
Cohesion: 0.06
Nodes (75): refreshWalletNow(), fetchPondFeed(), fetchPondState(), PondBounties, PondFeedItem, PondStateView, catchLabel(), EXCHANGE_DAILY_STAMPS (+67 more)

### Community 42 - "npc-layer.ts"
Cohesion: 0.10
Nodes (34): createDoorGuides(), HallGuide, PROJECTED, BY_ID, CAST, castMember(), FRAME, IDLE (+26 more)

### Community 43 - "lib/slots/index.ts"
Cohesion: 0.13
Nodes (6): KeepOnOtherDevices(), Probe(), StoredSlot, EventTargetLike, MemberInfo, useMember

### Community 44 - "Base TSConfig"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, lib, module, moduleResolution (+9 more)

### Community 45 - "Amplify Build Spec"
Cohesion: 0.12
Nodes (16): applications, appRoot, backend, frontend, baseDirectory, files, phases, commands (+8 more)

### Community 46 - "createAtelierRoom"
Cohesion: 0.29
Nodes (16): aspectOf(), createAtelierRoom(), buildCollection(), form(), buildEntrance(), buildMirror(), buildRoom(), buildWardrobe() (+8 more)

### Community 47 - "AtelierKeeps.tsx"
Cohesion: 0.14
Nodes (21): CoinToast(), Toast, Purse(), Stamp(), WalletProvider(), serverSnapshot, useEarnEvents(), useWallet() (+13 more)

### Community 48 - "Placement"
Cohesion: 0.04
Nodes (17): Carry, Job, PersonalRoomProps, DecorController, DecorLive, ScreenBox, HallRoomData, GhostOptions (+9 more)

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
Nodes (29): water, depthAtLift(), FAR_LIFT, FAR_SCALE, PondPath, PROP_DEPTH, path, FOREST_GATE (+21 more)

### Community 54 - "claim.ts"
Cohesion: 0.33
Nodes (7): buildClaim(), BuiltClaim, EarnDetail, GameSource, newRunId(), now, SecretFeature

### Community 55 - "compose-atelier.mjs"
Cohesion: 0.12
Nodes (10): body, dressLayer, dressWidth, floralWidth, hanger, MANNEQUIN_CANVAS, mask, root (+2 more)

### Community 56 - "AtelierRoom"
Cohesion: 0.09
Nodes (3): AtelierRoom, Options, SlotHandle

### Community 57 - "import-hall-assets.mjs"
Cohesion: 0.10
Nodes (17): file(), DOOR, DOOR_BACKDROP, drop, FURNITURE, manifest, manifestPath, masters (+9 more)

### Community 58 - "ticket/route.ts"
Cohesion: 0.11
Nodes (39): Code, 3.2 Chosen names (members), registry, started(), artistForSession(), AuthedArtist, createSession(), hashPassword() (+31 more)

### Community 59 - "economy/store.ts"
Cohesion: 0.15
Nodes (28): CARRY_CAP, carryAdd(), CarryEntry, carryPrune(), carryRemove(), chunk(), ClaimRequest, tzOffsetNow() (+20 more)

### Community 60 - "FishingView.tsx"
Cohesion: 0.12
Nodes (22): CAST_ERRORS, coarsePointer(), initialEasyReel(), isTyping(), LOST, Toast, vibrate(), CastPrompt (+14 more)

### Community 61 - "room.ts"
Cohesion: 0.14
Nodes (28): admitted(), Attachment, farewell(), GHOST_MS, HELLO_TIMEOUT_MS, holdsOf(), homeOf(), MAX_WAITING_PER_IP (+20 more)

### Community 62 - "minimap.ts"
Cohesion: 0.06
Nodes (42): place(), museumDoors(), EXITS, isDoor(), linkedDoor(), ROOM_PATH, createMinimap(), draw() (+34 more)

### Community 63 - "AtelierKeeps.tsx"
Cohesion: 0.25
Nodes (15): openAccount(), buy(), AtelierKeeps(), flash(), keep(), onKey(), press(), release() (+7 more)

### Community 64 - "domain/guestboard.ts"
Cohesion: 0.07
Nodes (41): POST(), GET(), POST(), StickyNoteProps, rateLimitedResponse(), rejectedResponse(), MAX_BUG_CONTACT, MAX_BUG_ERRORS (+33 more)

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
Cohesion: 0.16
Nodes (7): encodeStored(), parseStored(), readStored(), removeStored(), writeStored(), SyncStore, upgrade()

### Community 70 - "wire.ts"
Cohesion: 0.12
Nodes (10): Entry, INTERPOLATION_DELAY_MS, PEER_TIMEOUT_MS, PeerTable, positionAt(), Sample, look, Self (+2 more)

### Community 71 - "LandingFx"
Cohesion: 0.22
Nodes (10): glowSprite(), LandingFx(), onClick(), onVisibility(), psst(), spawnMist(), tick(), Mist (+2 more)

### Community 72 - "Confirmed issues"
Cohesion: 0.11
Nodes (18): Confirmed issues, E2E-002 — Valid edge placement rejected through floating-point precision, E2E-003 — One owned prop can be placed multiple times, E2E-004 — Reload before autosave silently loses the latest placement, E2E-005 — Failed save and failed Done have no visible mobile explanation, E2E-006 — Restoring connectivity does not retry a failed draft save, E2E-007 — Keyboard activation cannot place drawer items, E2E-008 — Creating an account from My Room leaves the signed-in user on the sign-in prompt (+10 more)

### Community 73 - "epoch.ts"
Cohesion: 0.22
Nodes (14): GET(), intParam(), GET(), sketchPool, unavailable(), EMPTY, firstSlice(), memo (+6 more)

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

### Community 85 - "wallet/body.ts"
Cohesion: 0.14
Nodes (20): PER_MEMBER, PER_MEMBER, POST(), catchIdOf(), isRecord(), MAX_POND_BODY_BYTES, pearlsOf(), PER_MEMBER (+12 more)

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
Cohesion: 0.13
Nodes (27): ClosetView(), close(), onKeyDown(), shuffle(), tapMiddle(), wearAt(), LISTS, PLACE (+19 more)

### Community 93 - "stage.ts"
Cohesion: 0.04
Nodes (56): coverFloorTransition(), CameraRig, createPixelRatioGovernor(), reset(), stepTo(), PIXEL_RATIO_STEPS, pixelRatioSteps(), Renderer (+48 more)

### Community 94 - "snapshot.ts"
Cohesion: 0.23
Nodes (15): snap(), composeJpeg(), copyCanvas(), grabLayers(), Layer, loadImage(), paint(), px() (+7 more)

### Community 95 - "atelier/room.ts"
Cohesion: 0.08
Nodes (49): AtelierPage(), dynamic, metadata, allowedCharacter(), OwnedSnapshot, owns(), walletReady(), Atelier() (+41 more)

### Community 96 - "actions.ts"
Cohesion: 0.05
Nodes (87): AnalyticsPage(), dynamic, BugReportsPage(), dateFormat, dynamic, summary(), dateFormat, dynamic (+79 more)

### Community 104 - "lib/assets.ts"
Cohesion: 0.10
Nodes (28): Loading(), dynamic, Hall(), MuseumPage(), [BRAND_OWNER, ...BRAND_REST], CurrentlyShowing(), Decor(), dynamic (+20 more)

### Community 105 - "RevealCard.tsx"
Cohesion: 0.11
Nodes (17): CONFETTI_COLORS, ConfettiPiece, makeConfetti(), RevealCard(), TIER_MS, useCountUp(), LostReason, chainOffer (+9 more)

### Community 106 - "rules.ts"
Cohesion: 0.15
Nodes (18): localDay(), at(), EXCHANGE_DAILY_STAMPS, EXCHANGE_PEARLS_PER_STAMP, exchangeClaimKey(), GAME_DAILY_CAP, GameId, GAMES (+10 more)

### Community 107 - "pondgame/lib/api.ts"
Cohesion: 0.26
Nodes (19): buyPondBait(), buyPondNet(), castPond(), chainPondBait(), errorOf(), fetchPondState(), isRecord(), memberId() (+11 more)

### Community 108 - "GuestBoard.tsx"
Cohesion: 0.10
Nodes (30): BoardScreen(), BoardScreenProps, ComposeScreen(), ComposeScreenProps, blankDraft(), GuestBoard(), GuestBoardProps, View (+22 more)

### Community 109 - "json"
Cohesion: 0.10
Nodes (52): POST(), PER_MEMBER, PUT(), POST(), POST(), PER_MEMBER, PUT(), POST() (+44 more)

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
Cohesion: 0.04
Nodes (68): CrowdPreviewPage(), RigPreviewPage(), CrowdPreview(), draw(), KINDS, Stats, Window, NEXT (+60 more)

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
Nodes (73): Assets, Scenery, CUTS, disposeBoards(), Mark, plane(), ROPE_CUTS, ropeSlices() (+65 more)

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
Cohesion: 0.36
Nodes (6): checkMessage(), INVISIBLE, MESSAGE_MAX, MessageCheck, normalizeMessage(), hasProfanity()

### Community 126 - "chat-history.ts"
Cohesion: 0.19
Nodes (13): appendChatMessage(), CHAT_HISTORY_LIMIT, CHAT_HISTORY_WINDOW_MS, chatHistoryKey(), ChatMessage, ChatStorage, isMessage(), memory (+5 more)

### Community 127 - "Walkthrough.tsx"
Cohesion: 0.10
Nodes (28): BACKDROP_STYLE, MoreArrow(), NavArrow(), Props, SLIDE, Walkthrough(), XIcon(), decodedFrames (+20 more)

### Community 128 - "sketchguess/lib/api.ts"
Cohesion: 0.15
Nodes (16): sameOriginUrl(), PreparedGame, decodeImage(), fetchBitmap(), fetchRound(), guarded(), InkMap, LoadedRound (+8 more)

### Community 129 - "presence/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, types, exclude, extends, include, ../../tsconfig.base.json

### Community 130 - "FishTier"
Cohesion: 0.15
Nodes (16): PondGameProps, PondGame(), RevealCardProps, CastOptions, PondCatch, PondStateView, PondWagerView, CatchView (+8 more)

### Community 131 - "tsconfig.test.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 132 - "lib/presence.ts"
Cohesion: 0.10
Nodes (22): Outcome, Connect, connectWebSocket(), fetchTicket, HEARTBEAT_MS, HIDDEN_LIMIT_MS, RETRY_MS, sameLook() (+14 more)

### Community 133 - "MirrorView.tsx"
Cohesion: 0.15
Nodes (16): Wheel(), onPointerUp(), trapTab(), MIRROR_SRC, MirrorView(), close(), move(), onKeyDown() (+8 more)

### Community 134 - "session.ts"
Cohesion: 0.10
Nodes (32): GET(), GET(), readCapped(), READS, UPLOADS, roomEditor, GET(), PaintingRow (+24 more)

### Community 135 - ".webSocketMessage"
Cohesion: 0.44
Nodes (3): attachmentOf(), Room, sendTo()

### Community 136 - "import-hall-assets.mjs"
Cohesion: 0.13
Nodes (11): BASEBOARD, CURTAIN, drop, EXPECTED, manifest, manifestPath, masters, root (+3 more)

### Community 137 - "Multiplayer ("other visitors") — plan v2 (Cloudflare)"
Cohesion: 0.10
Nodes (20): 0. Summary, 10. Decisions, 1. Product contract changes (approved 2026-10-31), 2. What already exists that this builds on, 3.1 Generated names (everyone has one), 3. Names, 4. Transport: Cloudflare Durable Objects, 5.1 Emotes (v1) (+12 more)

### Community 138 - "DoorEditor.tsx"
Cohesion: 0.15
Nodes (15): doorArtUrl(), loadDoorArt(), loadRoomDoorArt(), pending, ENTRANCE, firstLines(), PIXELS, REASONS (+7 more)

### Community 139 - "room-places.ts"
Cohesion: 0.14
Nodes (19): NpcGround, PlaceKind, atelierRoomInfo(), atelierX(), copy(), FurniturePlacement, hallCache, hallRoomInfo() (+11 more)

### Community 140 - "react"
Cohesion: 0.09
Nodes (38): BugReportSheet(), Status, GuideTalk(), MinigameFrameProps, onOpenCamera(), AlbumOverlay(), Gadgets(), ToolIcon() (+30 more)

### Community 141 - "Open rooms and the tip jar (design, 2026-11-21)"
Cohesion: 0.29
Nodes (6): Built (2026-11-21), Decisions, Numbers (first pass, to tune), Open questions, Open rooms and the tip jar (design, 2026-11-21), Story hooks

### Community 142 - "ref_node_assert"
Cohesion: 0.18
Nodes (7): fixture(), valid, blur(), kernel(), XDOG_DEFAULTS, xdogInk(), XdogOptions

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
Cohesion: 0.06
Nodes (46): Loading(), ColorRecall(), ColorRecallProps, Phase, readBest(), AtelierLoading(), coin, CoinFound() (+38 more)

### Community 147 - "Orchestration contract — you plan, DSH workers execute"
Cohesion: 0.29
Nodes (6): Briefing a worker, Budget hygiene, graphify, Orchestration contract — you plan, DSH workers execute, The worker, When not to delegate

### Community 148 - "tables.ts"
Cohesion: 0.10
Nodes (33): BaitTrayProps, debugSpecies(), debugTokens(), debugVariant(), GuestRollOptions, guestTreasure(), rollGuest(), BAIT (+25 more)

### Community 149 - "Tiny Museum v1 · Curator Letters"
Cohesion: 0.17
Nodes (11): Letter 0 · Clean up your room, Letter 1 · Place your first decoration, Letter 2 · Visit the first gallery, Letter 3 · Play a mini-game, Letter 4 · Unlock an outfit or character, Letter 5 · Find the seasonal items, Letter 6 · Unlock the daily calendar, Letter 7 · The cliffhanger and email signup (+3 more)

### Community 150 - "useBackgroundMusic.ts"
Cohesion: 0.11
Nodes (27): BackgroundMusic, clampVolume(), isDocumentHidden(), Options, useBackgroundMusic(), VISIBILITY_EVENTS, EFFECTS, EffectSpec (+19 more)

### Community 151 - "ticket/route.ts"
Cohesion: 0.21
Nodes (12): GET(), GET(), PER_IP, POST(), presenceUrl(), memberFromRequest(), memberName, canView() (+4 more)

### Community 152 - "SlotDef"
Cohesion: 0.15
Nodes (5): FakeServer, SlotState, serverSnapshot(), serverSnapshots, SlotDef

### Community 153 - "layout.ts"
Cohesion: 0.15
Nodes (13): cafeAfterIndex(), computeLayout(), clear(), placeCafe(), cutRooms(), DoorSpan, HALL_DOOR_FOOT, HallLayout (+5 more)

### Community 154 - "run.ts"
Cohesion: 0.20
Nodes (7): admin, childEnv, client, database, fresh, migrations, target

### Community 155 - "AccountSheet.tsx"
Cohesion: 0.18
Nodes (13): PresencePreviewPage(), NAME_ERRORS, Pending, View, PresencePreview(), Props, WalkAlone(), announceNameChange() (+5 more)

### Community 156 - "Walker"
Cohesion: 0.19
Nodes (3): FloorPoint, WalkArea, Walker

### Community 157 - "wander.test.ts"
Cohesion: 0.16
Nodes (11): Job, Place, WalkState, BASE_JOB, context(), L_GROUND, mulberry32(), room() (+3 more)

### Community 158 - "tab-turn.ts"
Cohesion: 0.16
Nodes (5): createTabTurn(), TabTurn, tab(), TurnEnv, TurnMessage

### Community 159 - "Curating the paintings (2026-11-07)"
Cohesion: 0.12
Nodes (15): hang(), 1. The registry and the table, 2. The studio's Location picker, 3. The rooms draw what is placed, 4. Credits, 5. Retiring self-serve artists, Building it, Curating the paintings (2026-11-07) (+7 more)

### Community 160 - "catalog.ts"
Cohesion: 0.09
Nodes (24): CatalogItem, CatalogKind, FREE_CHARACTERS, ITEMS, ItemSlot, expected, slots, ownsAll (+16 more)

### Community 161 - "rooms/art.ts"
Cohesion: 0.17
Nodes (12): AtelierArt, disposeAtelierArt(), loadGalleryDoor(), loadGalleryPillar(), loadImage(), AtelierArtwork, PersonalArt, ROOM_ART (+4 more)

### Community 162 - "outbox.test.ts"
Cohesion: 0.20
Nodes (16): OUTBOX_CAP, outboxAdd(), outboxDue(), OutboxEntry, outboxFail(), outboxRemove(), RETRY_BASE_MS, RETRY_MAX_MS (+8 more)

### Community 163 - "join-room.ts"
Cohesion: 0.32
Nodes (13): joinRoom(), STANDING, emit(), leaveRoom(), onNameChange(), onSayRequest(), openChat(), recordMessage() (+5 more)

### Community 165 - "writeLocal"
Cohesion: 0.20
Nodes (19): ensureStarted(), memberChanged(), publish(), readSession(), refreshWallet(), setBalance(), syncMember(), undoAdminUnlock() (+11 more)

### Community 166 - "readJsonBody"
Cohesion: 0.24
Nodes (9): PER_EDITOR, PUT(), versionOf(), PER_MEMBER, POST(), PER_EDITOR, POST(), JsonBody (+1 more)

### Community 167 - "ticket.ts"
Cohesion: 0.23
Nodes (12): decoder, encoder, fromBase64Url(), HmacKey, isOwn(), isTicket(), keyFor(), keys (+4 more)

### Community 168 - "plan.ts"
Cohesion: 0.31
Nodes (6): PlaceInfo, planGame(), ROUND_SPREAD, createReveal(), compose(), shuffle()

### Community 169 - "rooms/index.ts"
Cohesion: 0.31
Nodes (6): MuseumLayout(), setMuseumDoors(), MuseumDoors(), MuseumStage(), publishedDoors(), MuseumDoor

### Community 170 - "Low"
Cohesion: 0.18
Nodes (11): 1. Items placed against a zone edge fail to save, and the whole draft reverts, 2. One owned item can be placed many times, 3. Any save rejection throws away all unsaved work, 4. Changes made just before leaving are lost, 5. Fish trophies can be claimed without playing, Checked and fine, High, Not covered by this pass (+3 more)

### Community 171 - "Atelier: the dressing mirror, and show-don't-tell keeping"
Cohesion: 0.13
Nodes (14): Atelier: the dressing mirror, and show-don't-tell keeping, Build order, Built (2026-11-20), Decisions (2026-11-19), Follow-ups (2026-11-20), Goal, In the room, Keeping (+6 more)

### Community 172 - "createPlacementLayer"
Cohesion: 0.21
Nodes (11): aspectOf(), createPlacementLayer(), applyGlow(), drawOutline(), dropGhosts(), dropHelper(), extrasFor(), silhouette() (+3 more)

### Community 173 - "studio/layout.tsx"
Cohesion: 0.33
Nodes (7): StudioLayout(), Badge(), Icon(), ICONS, StudioNav(), countOpenBugReports(), doorsState

### Community 174 - "a/[slug]/page.tsx"
Cohesion: 0.25
Nodes (7): ArtistPage(), dynamic, generateMetadata(), GET(), FollowForm(), BRAND, getArtistPage()

### Community 175 - "ref_node_assert"
Cohesion: 0.11
Nodes (31): defineSlot(), docBytes(), SLOTS, byAtThenKey(), encoded(), latest, mapOf(), maxNumber() (+23 more)

### Community 176 - "AccountSheet"
Cohesion: 0.29
Nodes (9): AccountSheet(), continueAnyway(), doSignOut(), runDelete(), runName(), submit(), submitDelete(), submitName() (+1 more)

### Community 177 - "visits.ts"
Cohesion: 0.07
Nodes (42): state(), dynamic, format(), grade(), METRICS, PAGES, PerformancePage(), RANGES (+34 more)

### Community 179 - "protocol.ts"
Cohesion: 0.17
Nodes (20): fetch(), Env, isHome(), isItem(), isName(), isPid(), isSeq(), MAX_HOLDS (+12 more)

### Community 180 - "Your Room: a room you can freely furnish"
Cohesion: 0.20
Nodes (9): Admin mode (gamma), Decisions (2026-11-17, with the user), Editor (web, `features/rooms/decorate/*`, `PersonalRoom.tsx`), Room look (web, `features/rooms/themes/cozy.ts`, `features/rooms/personal/room.ts`), Scale, Testing locally, What other games do (research, 2026-11-17), Work plan (+1 more)

### Community 181 - "Approved v4 bunny in the hall"
Cohesion: 0.29
Nodes (5): Approved v4 bunny in the hall, Assets, Existing interactions and fallback, Local review and checks, Rendering and movement

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
Cohesion: 0.30
Nodes (14): pathX(), createPondRoom(), approach(), busy(), finishWalk(), goTo(), leave(), move() (+6 more)

### Community 189 - "doors/page.tsx"
Cohesion: 0.28
Nodes (7): DoorsPage(), dynamic, hallPaintings(), GuideTalk, HallPainting, DoorGuide, doorRoom

### Community 190 - "earn"
Cohesion: 0.33
Nodes (9): earn(), emit(), emitEarned(), maybeInvite(), writeSession(), tap(), tap(), tap() (+1 more)

### Community 191 - "slots/store.ts"
Cohesion: 0.18
Nodes (14): ANON_PREFIX, anonKey(), deviceKey(), isMemberSlotKey(), listKeys(), MEMBER_KEY, memberKey(), memberPrefix() (+6 more)

### Community 192 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, db:schema, deploy:backend, dev, dev:presence, dev:web, dev:worker (+6 more)

### Community 193 - "Monets Lily Pond: exploration, UX and multiplayer QA"
Cohesion: 0.29
Nodes (6): Browser and interaction coverage, Changes made from the walkthrough, Monets Lily Pond: exploration, UX and multiplayer QA, Multiplayer and load, Practical limits, Regression checks and cleanup

### Community 194 - "walk"
Cohesion: 0.33
Nodes (8): between(), CAT, Edge, EDGES, runLandingCat(), choosePeeker(), peek(), walk()

### Community 195 - "names.ts"
Cohesion: 0.36
Nodes (7): ADJECTIVES, NAME_LIMITS, NAME_SEEDS, NameCheck, NOUNS, randomSeed(), RESERVED

### Community 196 - "Low"
Cohesion: 0.25
Nodes (8): 13. Pages that redirect or don't exist answer 200, 14. Error codes reveal which room slugs exist, 15. The name sign slides under the top-right buttons in Decorate, 16. Level-up celebrations can be farmed, 17. No hint of where things are after panning away, 18. Too many items is only discovered by the server, 19. Development-only: page payloads include the full room row, Low

### Community 197 - "sizes.test.ts"
Cohesion: 0.36
Nodes (6): FULL_ROOM_WIDTH, nextRoomSize(), ROOM_SIZES, RoomSize, sizedTheme(), owns

### Community 198 - "PondPanels.tsx"
Cohesion: 0.10
Nodes (21): Loading(), metadata, PondPage(), Minigame, POND_NAME, POND_SIGN_NAME, PondLoading(), BOARD_TABS (+13 more)

### Community 199 - "opening.ts"
Cohesion: 0.43
Nodes (5): COLD_DOOR_HOLD_MS, hallIsReady(), Opening, OPENING_MAX_WAIT_MS, at()

### Community 200 - "share.ts"
Cohesion: 0.33
Nodes (5): ShareOutcome, shareResult(), ShareSummary, shareText(), base

### Community 201 - "Medium"
Cohesion: 0.25
Nodes (8): 10. Long names run off the name sign, 11. The rooms API skips the stale-tab member check, 12. The bunny is dragged along while you pan in Decorate, 6. Failed saves are nearly invisible, and nothing retries, 7. Two tabs editing the same room overwrite each other, 8. The drawer's card row can't be scrolled on touch screens, 9. Decorating can't be done with the keyboard, Medium

### Community 202 - "atelier.ts"
Cohesion: 0.07
Nodes (32): AtelierDoor, AtelierImage, BuiltRoom, Cardigan, CARDIGAN_NAMES, Control, refresh(), hungWork() (+24 more)

### Community 206 - "Other visitors"
Cohesion: 0.29
Nodes (6): How it plays, Other visitors, Privacy, Running it in production, Running it locally, Staying consistent

### Community 207 - "queryOne"
Cohesion: 0.11
Nodes (20): ConfirmFollow(), dynamic, dynamic, Unsubscribe(), GET(), FollowNotice(), AnalyticsSummary, confirmFollow() (+12 more)

### Community 208 - "createDecorController"
Cohesion: 0.47
Nodes (5): centerYFor(), createDecorController(), canvasRect(), targetRise(), toScreen()

### Community 209 - "react"
Cohesion: 0.04
Nodes (54): config, SECURITY_HEADERS, bethEllen, inspiratiq, metadata, notoSans, RootLayout(), sniglet (+46 more)

### Community 211 - "petals.ts"
Cohesion: 0.24
Nodes (6): createDoorPetals(), DoorPetals, mulberry(), Petal, petalTexture(), PondDoor

### Community 215 - "Handoff: move the Tiny Museum bunny from sprite frames to a rig"
Cohesion: 0.40
Nodes (5): 1. What is in this bundle, 3. The rig, 5. Blender-side work still to do (needs Blender; the author has it with an MCP bridge), 6. Open questions for the author, Handoff: move the Tiny Museum bunny from sprite frames to a rig

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
- **31 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `stage.ts`, `SketchGuess.tsx`, `MirrorView.tsx`, `session.ts`, `pond-api.ts`, `DoorEditor.tsx`, `Test Fakes and Helpers`, `logic.ts`, `room-events.ts`, `Museum.tsx`, `tables.ts`, `progress.ts`, `useBackgroundMusic.ts`, `SlotDef`, `AccountSheet.tsx`, `Web Package Dependencies`, `DecorDrawer.tsx`, `risk.ts`, `writeLocal`, `pond-api.ts`, `lib/slots/index.ts`, `AtelierKeeps.tsx`, `Water.tsx`, `FishingView.tsx`, `AtelierKeeps.tsx`, `PondPanels.tsx`, `LandingFx`, `react`, `ClosetView.tsx`, `atelier/room.ts`, `actions.ts`, `lib/assets.ts`, `RevealCard.tsx`, `GuestBoard.tsx`, `rig.ts`, `Walkthrough.tsx`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._
- **What connects `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json` to the rest of the system?**
  _5 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `stage.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.030199039121482498 - nodes in this community are weakly interconnected._
- **Why does `useSound()` connect `react` to `stage.ts`, `SketchGuess.tsx`, `MirrorView.tsx`, `pond-api.ts`, `machine.ts`, `logic.ts`, `room-events.ts`, `Museum.tsx`, `tables.ts`, `progress.ts`, `AccountSheet.tsx`, `DecorDrawer.tsx`, `risk.ts`, `pond-api.ts`, `rooms/index.ts`, `a/[slug]/page.tsx`, `AtelierKeeps.tsx`, `AccountSheet`, `FishingView.tsx`, `AtelierKeeps.tsx`, `PondPanels.tsx`, `LandingFx`, `react`, `ClosetView.tsx`, `atelier/room.ts`, `GuestBoard.tsx`, `Walkthrough.tsx`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Should `Traversal` be split into smaller, more focused modules?**
  _Cohesion score 0.10606060606060606 - nodes in this community are weakly interconnected._
- **Why does `three` connect `hall/room.ts` to `stage.ts`, `assetUrl`, `scene/assets.ts`, `scene.ts`, `cozy.ts`, `hang-tag.ts`, `remote-visitors.ts`, `prepare-models.mjs`, `ambience.ts`, `Web Package Dependencies`, `rooms/art.ts`, `join-room.ts`, `npc-layer.ts`, `Placement`, `walk.ts`, `backdrop.ts`, `atelier.ts`, `petals.ts`, `stage.ts`, `atelier/room.ts`, `rig.ts`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Should `SketchGuess.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13227513227513227 - nodes in this community are weakly interconnected._