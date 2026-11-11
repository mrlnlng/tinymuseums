# Graph Report - tiny-museum  (2026-11-11)

## Corpus Check
- 495 files · ~271,860 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 78 file(s) not represented in the graph (top: .avif 39, .glb 30, .css 4)

## Summary
- 4332 nodes · 11198 edges · 201 communities (175 shown, 26 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 200 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4f44c309`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- gallery.ts
- walk.ts
- SketchGuess.tsx
- rooms.ts
- jobs.ts
- round.ts
- floor.ts
- Core Asset Manifest
- scene/assets.ts
- SyncStore
- machine.ts
- PondPanels.tsx
- Test Fakes and Helpers
- scene.ts
- cozy.ts
- actions.ts
- room-events.ts
- useBackgroundMusic.ts
- ref_node_assert
- amplify/package.json
- app/page.tsx
- prepare-models.mjs
- Traversal
- core/package.json
- art-cache.ts
- themes.ts
- DecorController
- react
- ambience.ts
- core/src/index.ts
- Web Package Dependencies
- Gamifying Tiny Museum — genre direction & engagement research
- atelier.ts
- slots/store.ts
- risk.ts
- amplify/tsconfig.json
- 5. Customization menu — what other people are doing
- wallet.ts
- BountyPanel.tsx
- Web TSConfig
- Root Package Manifest
- bug-reports.ts
- PondTicker.tsx
- import-fishing-assets.mjs
- Base TSConfig
- Amplify Build Spec
- CharacterKind
- hitForVisitor
- FakeServer
- handlers.ts
- Water.tsx
- Worker Package Manifest
- Public Asset Manifest
- wardrobe.ts
- tab-turn.ts
- compose-atelier.mjs
- layout.ts
- pond-format.ts
- AccountSheet.tsx
- economy/store.ts
- backend.ts
- room.ts
- minimap.ts
- logic.ts
- Handoff: move the Tiny Museum bunny from sprite frames to a rig
- Sound Effect Assets
- createAtelierRoom
- Custom HTTP Headers
- Sharp Layer Package
- bug-reports.ts
- createHallRoom
- GuestBoard.tsx
- ReadScreen.tsx
- import-landing-assets.mjs
- Visits SQL Schema
- Bunny Walk Sprites
- Room Mockup Settings
- Service Worker Caching
- HallCallbacks
- pond/art.ts
- createPresence
- members
- Frame Window Asset
- .webSocketMessage
- presence/package.json
- outbox.test.ts
- Asset pipeline: fast loading without losing sharpness
- Guest Board SQL Schema
- Landscape Frame Asset
- nearby.ts
- Bug Reports SQL Schema
- Vitals SQL Schema
- json
- db-tests/pond.test.ts
- pond/room.ts
- ticket/route.ts
- Run-Once Schema
- createStage
- FishingView.tsx
- ticket.ts
- join-room.ts
- dependencies
- exports
- graftCostume
- FishingView.tsx
- worker/tsconfig.json
- core/tsconfig.json
- import-hall-assets.mjs
- How to Design for Failures — ByteByteGo Newsletter
- Worker instructions — DSH headless agents
- Backend
- protocol.ts
- Costume gallery doorway
- pond-api.ts
- Fishing forest: painted asset pass
- audio/README.md
- .claude/CLAUDE.md
- The Costume Atelier
- Confirmed issues
- rig.ts
- Curating the paintings (2026-11-07)
- domain/guestboard.ts
- presence/tsconfig.json
- run.ts
- tsconfig.test.json
- app/layout.tsx
- messages.ts
- lib/presence.ts
- Item
- PlacementLayer
- RoomContents
- three
- epoch.ts
- lib/presence.ts
- sketchguess/lib/api.ts
- visits.ts
- placeLabel
- The Moonlit Pond — design
- Pond rework
- env.ts
- Orchestration contract — you plan, DSH workers execute
- tables.ts
- confirm/page.tsx
- createRoomPassage
- pond-state.ts
- perf.ts
- Other visitors
- FilesystemStorage
- useVisitorName.ts
- performance/page.tsx
- Walkthrough.tsx
- createPondRoom
- createPlacementLayer
- High
- domain/sketch.ts
- CoinToast.tsx
- painting-open
- share.ts
- Multiplayer ("other visitors") — plan v2 (Cloudflare)
- RemoteVisitors
- HallAmbience
- audience.ts
- icon-basket
- plan.ts
- Sitting
- Character
- bunny-left
- AccountSheet
- bunny-right
- createDecorController
- HelmShare
- icon-home
- ticket
- HallForeground
- createCharacter
- media/storage.ts
- Cafe
- themes.ts
- useSoundEffects.ts
- Monets Lily Pond: exploration, UX and multiplayer QA
- createRemoteVisitors
- RigPreview.tsx
- pond-api.ts
- rooms.ts
- visits/page.tsx
- lobby.ts
- BountyPanel.tsx
- CrowdPreview.tsx
- remote-visitors.ts
- shopkeeper.ts
- VitalsReporter.tsx
- 4. Transport: Cloudflare Durable Objects
- stage.ts
- ArtCache

## God Nodes (most connected - your core abstractions)
1. `react` - 75 edges
2. `json()` - 69 edges
3. `query()` - 68 edges
4. `hit()` - 55 edges
5. `limited()` - 49 edges
6. `three` - 45 edges
7. `next` - 44 edges
8. `Traversal` - 44 edges
9. `SyncStore` - 41 edges
10. `FishingView()` - 39 edges

## Surprising Connections (you probably didn't know these)
- `Code` --references--> `followOutfit()`  [INFERRED]
  docs/costume-atelier.md → apps/web/src/features/hall/scene/wardrobe.ts
- `E2E-009 — Room mutations ignore stale account identity` --references--> `memberFromRequest()`  [INFERRED]
  docs/testing/local-e2e-stress-2026-11-06.md → apps/web/src/shared/lib/member-route.ts
- `Fitting clothes to other characters` --references--> `graftCostume()`  [INFERRED]
  docs/costume-atelier.md → apps/web/tooling/graft-costume.mjs
- `Where things stand` --references--> `sealEpoch()`  [INFERRED]
  docs/curation-plan.md → packages/core/src/domain/epoch.ts
- `19. Development-only: page payloads include the full room row` --references--> `getRoom()`  [INFERRED]
  docs/personal-room-issues.md → packages/core/src/domain/rooms.ts

## Import Cycles
- None detected.

## Communities (201 total, 26 thin omitted)

### Community 0 - "gallery.ts"
Cohesion: 0.27
Nodes (12): hangAction(), movePieceAction(), unhangAction(), FloorControls(), move(), unhang(), formFor(), StorageControls() (+4 more)

### Community 1 - "walk.ts"
Cohesion: 0.12
Nodes (13): FloorPoint, WalkArea, water, POND_LANDMARKS, DEPTH_SPAN, depthOf(), MAX_DEPTH, PICTURE (+5 more)

### Community 2 - "SketchGuess.tsx"
Cohesion: 0.12
Nodes (27): bestKeyFor(), BURST, clueUrl(), openingPlan(), Phase, pickAtRandom(), prepareSketchGame(), readDifficulty() (+19 more)

### Community 3 - "rooms.ts"
Cohesion: 0.16
Nodes (28): publishLocationAction(), artist(), member(), piece(), randomId(), sealEpoch(), discardLocation(), hasUnpublished() (+20 more)

### Community 4 - "jobs.ts"
Cohesion: 0.15
Nodes (20): loop(), shutdown(), sleep(), sweepStale(), DrainResult, handler(), repairFrames(), repairUnframed() (+12 more)

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
Nodes (55): Loading(), DENSITY_MEDIA, HallPreload(), HallSkeleton(), AssetManifest, assetUrl(), bitmapTexture(), blankImage() (+47 more)

### Community 9 - "SyncStore"
Cohesion: 0.16
Nodes (8): encodeStored(), listKeys(), parseStored(), readStored(), removeStored(), writeStored(), SyncStore, upgrade()

### Community 10 - "machine.ts"
Cohesion: 0.12
Nodes (35): CastMeter(), ReelMeter(), armCast(), BITE_WINDOW, biteGap(), CHARGE_PERIOD, chargePower(), createFishingState() (+27 more)

### Community 11 - "PondPanels.tsx"
Cohesion: 0.24
Nodes (8): FishmongerPanel(), BOARD_TABS, PondOverlayKind, PondPanels(), signIn(), PondPanelsProps, SUBTITLES, TITLES

### Community 12 - "Test Fakes and Helpers"
Cohesion: 0.10
Nodes (29): STAMP_SVG, deferredFetch(), deviceSlot, FakeEvents, FakeStorage, fixture, fixtureB, fixtureRegistry (+21 more)

### Community 13 - "scene.ts"
Cohesion: 0.04
Nodes (37): MuseumProps, disposeDisplayTexture(), HELM_PEDESTAL_FILE, prefersAvif(), HiddenCoin, createNotes(), createPedestal(), Notes (+29 more)

### Community 14 - "cozy.ts"
Cohesion: 0.16
Nodes (20): ATELIER_PROPS, AtelierImage, canvasTexture(), CozyBackdrop, disposeCozyArt(), drawingOn(), FISH, fishTexture() (+12 more)

### Community 15 - "actions.ts"
Cohesion: 0.06
Nodes (76): AnalyticsPage(), dynamic, BugReportsPage(), dateFormat, dynamic, summary(), dynamic, GalleryPage() (+68 more)

### Community 16 - "room-events.ts"
Cohesion: 0.24
Nodes (17): ChatButton(), REFUSED, getPeople(), isInRoom(), isMuted(), muted, on(), onInRoomChange() (+9 more)

### Community 17 - "useBackgroundMusic.ts"
Cohesion: 0.15
Nodes (14): saveIfHigher(), SoundProvider(), BackgroundMusic, clampVolume(), isDocumentHidden(), Options, useBackgroundMusic(), VISIBILITY_EVENTS (+6 more)

### Community 18 - "ref_node_assert"
Cohesion: 0.12
Nodes (29): defineSlot(), docBytes(), SLOTS, byAtThenKey(), encoded(), latest, mapOf(), maxNumber() (+21 more)

### Community 19 - "amplify/package.json"
Cohesion: 0.17
Nodes (14): devDependencies, @aws-amplify/backend@^1.14.0, @aws-amplify/backend-cli@^1.6.0, aws-cdk-lib@^2.180.0, constructs@^10.3.0, name, private, scripts (+6 more)

### Community 20 - "app/page.tsx"
Cohesion: 0.19
Nodes (12): dynamic, Hall(), MuseumPage(), [BRAND_OWNER, ...BRAND_REST], CurrentlyShowing(), Decor(), dynamic, LandingPage() (+4 more)

### Community 21 - "prepare-models.mjs"
Cohesion: 0.15
Nodes (18): paintedCostume(), atelier, bunny, floralOutfits(), goldOutfits(), HEADPIECES, image(), manifest (+10 more)

### Community 22 - "Traversal"
Cohesion: 0.11
Nodes (4): clamp(), fixture(), jump(), Traversal

### Community 23 - "core/package.json"
Cohesion: 0.16
Nodes (13): devDependencies, @types/bcryptjs@^2.4.6, @types/pg@^8.11.10, main, name, private, scripts, typecheck (+5 more)

### Community 24 - "art-cache.ts"
Cohesion: 0.21
Nodes (9): ArtCacheOptions, createArtCache(), drop(), expireLater(), hold(), HeldArt, LoadResult, Slot (+1 more)

### Community 25 - "themes.ts"
Cohesion: 0.15
Nodes (13): GAMES, isRecord(), parsePlacements(), placementOf(), ownsAll, ownsNone, COZY_FLOOR_PROPS, COZY_TROPHIES (+5 more)

### Community 27 - "react"
Cohesion: 0.06
Nodes (47): config, SECURITY_HEADERS, Loading(), AtelierPage(), dynamic, metadata, Loading(), metadata (+39 more)

### Community 28 - "ambience.ts"
Cohesion: 0.13
Nodes (30): blade(), bloom(), BLOOMS, createPondAmbience(), update(), fishTexture(), frond(), FRONT_ROWS (+22 more)

### Community 29 - "core/src/index.ts"
Cohesion: 0.05
Nodes (124): CatchExtra, COLUMNS, insertCatch(), member(), namedMember(), randomId(), StatePatch, addBait() (+116 more)

### Community 30 - "Web Package Dependencies"
Cohesion: 0.07
Nodes (33): dependencies, embla-carousel-react@^8.6.0, motion@^13.1.1, next@^15.0.3, react@^19.0.0, react-dom@^19.0.0, swr@^2.5.1, three@^0.169.0 (+25 more)

### Community 31 - "Gamifying Tiny Museum — genre direction & engagement research"
Cohesion: 0.10
Nodes (19): 0.1 The core experience, 0.2 Systems that make gamification cheap to build, 0.3 Constraints that shape any recommendation, 0. What the game is today (the deep dive), 1.1 The landscape (seven candidates, with verdicts), 1.2 Recommendation: a **cozy gallery life-sim** — "the gallery you live in", 1.3 The five design pillars the genre implies, 1. Genre direction (+11 more)

### Community 32 - "atelier.ts"
Cohesion: 0.05
Nodes (46): AtelierArt, AtelierImage, BuiltRoom, Cardigan, CARDIGAN_NAMES, Control, refresh(), disposeAtelierArt() (+38 more)

### Community 33 - "slots/store.ts"
Cohesion: 0.08
Nodes (20): KeepOnOtherDevices(), Probe(), ANON_PREFIX, anonKey(), deviceKey(), isMemberSlotKey(), MEMBER_KEY, memberKey() (+12 more)

### Community 34 - "risk.ts"
Cohesion: 0.12
Nodes (32): Hud(), HudProps, HudWagerChip, WagerPicker(), chooseTier(), WagerPickerProps, CastOptions, PondStateView (+24 more)

### Community 35 - "amplify/tsconfig.json"
Cohesion: 0.20
Nodes (9): compilerOptions, module, moduleResolution, noUnusedLocals, noUnusedParameters, exclude, extends, include (+1 more)

### Community 36 - "5. Customization menu — what other people are doing"
Cohesion: 0.12
Nodes (16): 1. The target: what "Claude Opus 5.5" actually means, 2. Where your harness stands today (live config I read), 3. The honest gap model, 4. Quality levers, ranked by leverage, 5. Customization menu — what other people are doing, 6. Recommended starting kit for *your* profile, 7. What I can apply for you right now (needs your go-ahead), A. Prompt & persona (most common quality customizations) (+8 more)

### Community 37 - "wallet.ts"
Cohesion: 0.05
Nodes (58): grantPearls(), member(), now, piece(), randomId(), today, applyClaim(), baitCounts() (+50 more)

### Community 38 - "BountyPanel.tsx"
Cohesion: 0.22
Nodes (15): refreshWalletNow(), PondBounties, formatCountdown(), nextUtcMidnight(), utcDayLabel(), setPondState(), useCountdown(), useNow() (+7 more)

### Community 39 - "Web TSConfig"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 40 - "Root Package Manifest"
Cohesion: 0.07
Nodes (35): description, devDependencies, concurrently@^9.1.0, esbuild@^0.24.0, ktx2-encoder@^0.6.0, maxrects-packer@^2.7.3, playwright@^1.63.0, @types/node@^22.9.0 (+27 more)

### Community 41 - "bug-reports.ts"
Cohesion: 0.20
Nodes (15): BugReportHost(), BugReportSheet, BugReportSheet(), send(), Status, collectContext(), inAppBrowser(), onOpenBugReport() (+7 more)

### Community 42 - "PondTicker.tsx"
Cohesion: 0.29
Nodes (11): fetchPondFeed(), PondFeedItem, catchLabel(), formatSizeCm(), speciesFor(), speciesName(), speciesTier(), isGolden() (+3 more)

### Community 43 - "import-fishing-assets.mjs"
Cohesion: 0.10
Nodes (13): CANVAS, clear, FONT, FRAME, heights, layer(), layout, lossless (+5 more)

### Community 44 - "Base TSConfig"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, lib, module, moduleResolution (+9 more)

### Community 45 - "Amplify Build Spec"
Cohesion: 0.12
Nodes (16): applications, appRoot, backend, frontend, baseDirectory, files, phases, commands (+8 more)

### Community 46 - "CharacterKind"
Cohesion: 0.15
Nodes (4): AtelierRoom, Display, CharacterKind, Options

### Community 47 - "hitForVisitor"
Cohesion: 0.11
Nodes (28): POST(), ALLOWED, POST(), POST(), POST(), POST(), GET(), PER_VISITOR (+20 more)

### Community 48 - "FakeServer"
Cohesion: 0.14
Nodes (5): FakeServer, SlotState, serverSnapshot(), serverSnapshots, SlotDef

### Community 49 - "handlers.ts"
Cohesion: 0.10
Nodes (30): confirmedFollowers(), handleDerivatives(), handleNotifyFollowers(), handleRenderDisplay(), handleSealEpoch(), renderPieceFrame(), renderPieceSketch(), runJob() (+22 more)

### Community 50 - "Water.tsx"
Cohesion: 0.07
Nodes (38): AmbientShadow, box(), BUCKET, bunnyBox(), easeOut(), Glint, LEFT_STYLE, lineColour() (+30 more)

### Community 51 - "Worker Package Manifest"
Cohesion: 0.14
Nodes (14): dependencies, @tiny/core@*, exports, ./lambda, @tiny/core, main, name, private (+6 more)

### Community 52 - "Public Asset Manifest"
Cohesion: 0.12
Nodes (15): artworks, bunny, size, floor, size, fonts, icon-no-photos, size (+7 more)

### Community 53 - "wardrobe.ts"
Cohesion: 0.07
Nodes (44): Purse(), allowedCharacter(), OwnedSnapshot, owns(), walletReady(), stampLabel(), Atelier(), leave() (+36 more)

### Community 54 - "tab-turn.ts"
Cohesion: 0.16
Nodes (5): createTabTurn(), TabTurn, tab(), TurnEnv, TurnMessage

### Community 55 - "compose-atelier.mjs"
Cohesion: 0.14
Nodes (9): body, dressLayer, dressWidth, floralWidth, MANNEQUIN_CANVAS, mask, root, sourceSize (+1 more)

### Community 56 - "layout.ts"
Cohesion: 0.17
Nodes (10): cafeAfterIndex(), comingSoonWidth(), computeLayout(), cutRooms(), HallLayout, HallRoomKind, HallRoomSpan, hasPedestal() (+2 more)

### Community 57 - "pond-format.ts"
Cohesion: 0.13
Nodes (25): PondDex, EXCHANGE_DAILY_STAMPS, EXCHANGE_PEARLS_PER_STAMP, FISH_ART, formatPercent(), formatShortSizeCm(), ODDS_BAIT, POND_BAIT (+17 more)

### Community 58 - "AccountSheet.tsx"
Cohesion: 0.07
Nodes (37): AccountHost(), AccountSheet, NAME_ERRORS, Pending, View, AccountMode, onOpenAccount(), openAccount() (+29 more)

### Community 59 - "economy/store.ts"
Cohesion: 0.07
Nodes (75): serverSnapshot, useEarnEvents(), useWallet(), CARRY_CAP, carryAdd(), CarryEntry, carryPrune(), carryRemove() (+67 more)

### Community 60 - "backend.ts"
Cohesion: 0.15
Nodes (12): amplifyDir, backend, everyMinutes, mediaBucket, missing, repoRoot, REQUIRED, setting() (+4 more)

### Community 61 - "room.ts"
Cohesion: 0.14
Nodes (28): admitted(), Attachment, farewell(), GHOST_MS, HELLO_TIMEOUT_MS, holdsOf(), MAX_WAITING_PER_IP, newAttachment() (+20 more)

### Community 62 - "minimap.ts"
Cohesion: 0.08
Nodes (33): place(), ATELIER_DOOR, createMinimap(), draw(), drawRoom(), floors(), follow(), sketchOf() (+25 more)

### Community 63 - "logic.ts"
Cohesion: 0.06
Nodes (55): errorReason(), overDrawer(), PersonalRoom(), canPlaceNew(), carryEnd(), carryMove(), onCardKey(), onCardPointerDown() (+47 more)

### Community 64 - "Handoff: move the Tiny Museum bunny from sprite frames to a rig"
Cohesion: 0.12
Nodes (15): BunnyArtist(), BunnyMood, Pencil(), POSES, 1. What is in this bundle, 3. The rig, 4. Suggested plan, 5. Blender-side work still to do (needs Blender; the author has it with an MCP bridge) (+7 more)

### Community 65 - "Sound Effect Assets"
Cohesion: 0.22
Nodes (9): file, kilobytes, seconds, file, kilobytes, seconds, soundEffects, click (+1 more)

### Community 66 - "createAtelierRoom"
Cohesion: 0.24
Nodes (19): aspectOf(), AtelierActions, createAtelierRoom(), buildCollection(), form(), buildEntrance(), buildRoom(), picture() (+11 more)

### Community 67 - "Custom HTTP Headers"
Cohesion: 0.25
Nodes (7): applications, appRoot, customHeaders, headers, pattern, key, value

### Community 68 - "Sharp Layer Package"
Cohesion: 0.33
Nodes (6): dependencies, sharp@^0.33.5, description, sharp, name, private

### Community 69 - "bug-reports.ts"
Cohesion: 0.22
Nodes (12): BugReport, BugReportDto, BugReportRejected, BugRow, CONTEXT_KEYS, EVERYONE, normalizeBugPage(), parseBugReport() (+4 more)

### Community 70 - "createHallRoom"
Cohesion: 0.14
Nodes (17): Backdrop, createBackdrop(), floorShadeTexture(), painted(), wallShadeTexture(), createHallRoom(), buildRoom(), cafeRoom() (+9 more)

### Community 71 - "GuestBoard.tsx"
Cohesion: 0.22
Nodes (12): ComposeScreen(), ComposeScreenProps, blankDraft(), GuestBoard(), GuestBoardProps, View, fetchPage(), NoteDraft (+4 more)

### Community 72 - "ReadScreen.tsx"
Cohesion: 0.16
Nodes (17): shape(), BoardScreen(), BoardScreenProps, PinnedNotes(), PinnedNotesProps, ReadScreen(), ReadScreenProps, StickyNote() (+9 more)

### Community 73 - "import-landing-assets.mjs"
Cohesion: 0.13
Nodes (9): socket(), CAT, drop, EXPECTED, manifest, manifestPath, masters, root (+1 more)

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
Cohesion: 0.17
Nodes (14): createPresence(), drop(), heartbeat(), maybeSend(), onPageHide(), receive(), scheduleRetry(), send() (+6 more)

### Community 81 - "members"
Cohesion: 0.12
Nodes (25): coin_claims, coin_claims_daily, wallet_bait, wallet_items, wallets, member_sessions, member_sessions_member, member_slots (+17 more)

### Community 82 - "Frame Window Asset"
Cohesion: 0.50
Nodes (4): frame, size, window, windowAspect

### Community 83 - ".webSocketMessage"
Cohesion: 0.44
Nodes (3): attachmentOf(), Room, sendTo()

### Community 84 - "presence/package.json"
Cohesion: 0.14
Nodes (16): dependencies, @tiny/core@*, devDependencies, @cloudflare/workers-types@5.20261016.1, wrangler@4.151.1, @tiny/core, name, private (+8 more)

### Community 85 - "outbox.test.ts"
Cohesion: 0.29
Nodes (10): OUTBOX_CAP, outboxAdd(), OutboxEntry, outboxFail(), outboxRemove(), RETRY_BASE_MS, RETRY_MAX_MS, retryDelay() (+2 more)

### Community 86 - "Asset pipeline: fast loading without losing sharpness"
Cohesion: 0.22
Nodes (8): Asset pipeline: fast loading without losing sharpness, Character rigs and the Costume Atelier, Completed, Ground rules, Phase 1: fingerprinted files at 2x and 3x, Phase 2: texture atlases for the hall sprites, Phase 3: KTX2 (Basis Universal), built and switched off, Phase 4: ThumbHash placeholders for paintings

### Community 87 - "Guest Board SQL Schema"
Cohesion: 0.67
Nodes (3): guest_notes, guest_notes_visible, rate_limits

### Community 88 - "Landscape Frame Asset"
Cohesion: 0.67
Nodes (3): frameLandscape, size, window

### Community 89 - "nearby.ts"
Cohesion: 0.18
Nodes (5): Nearby, NearbyReach, RoomSpan, reach, strip

### Community 93 - "json"
Cohesion: 0.06
Nodes (87): POST(), PER_MEMBER, PUT(), POST(), GET(), GLOBAL, PER_IP, POST() (+79 more)

### Community 94 - "db-tests/pond.test.ts"
Cohesion: 0.13
Nodes (21): BOARDS, GET(), oneOf(), PER_VISITOR, PERIODS, compare(), DexRow, displayName() (+13 more)

### Community 95 - "pond/room.ts"
Cohesion: 0.11
Nodes (24): depthAtLift(), FAR_LIFT, FAR_SCALE, liftAt(), pathHalfWidth(), pathX(), PondPath, scaleAt() (+16 more)

### Community 96 - "ticket/route.ts"
Cohesion: 0.08
Nodes (48): GET(), GET(), PER_IP, POST(), presenceUrl(), memberFromRequest(), Code, 3.1 Generated names (everyone has one) (+40 more)

### Community 104 - "createStage"
Cohesion: 0.15
Nodes (22): boundedCameraX(), createNearby(), createStage(), closeEntry(), enter(), initialize(), aim(), drawFrame() (+14 more)

### Community 105 - "FishingView.tsx"
Cohesion: 0.12
Nodes (16): CONFETTI_COLORS, ConfettiPiece, makeConfetti(), RevealCard(), RevealCardProps, TIER_MS, TIER_SFX, useCountUp() (+8 more)

### Community 106 - "ticket.ts"
Cohesion: 0.23
Nodes (12): decoder, encoder, fromBase64Url(), HmacKey, isOwn(), isTicket(), keyFor(), keys (+4 more)

### Community 107 - "join-room.ts"
Cohesion: 0.29
Nodes (12): joinRoom(), Options, STANDING, emit(), onNameChange(), onSayRequest(), openChat(), reportSay() (+4 more)

### Community 108 - "dependencies"
Cohesion: 0.15
Nodes (13): dependencies, @aws-sdk/client-s3@^3.1121.0, @aws-sdk/s3-request-presigner@^3.1121.0, bcryptjs@^2.4.3, obscenity@^0.4.6, sharp@^0.33.5, thumbhash@^0.1.1, sharp (+5 more)

### Community 109 - "exports"
Cohesion: 0.15
Nodes (13): exports, ./brand, ./bugs, ./economy, ./guestboard, ./presence, ./presence/messages, ./presence/wire (+5 more)

### Community 110 - "graftCostume"
Cohesion: 0.27
Nodes (14): canvasFit(), compose(), graftCostume(), copyAccessor(), copyMaterial(), copyMesh(), copyTexture(), copyView() (+6 more)

### Community 111 - "FishingView.tsx"
Cohesion: 0.13
Nodes (31): BaitTray(), BaitTrayProps, CAST_ERRORS, coarsePointer(), FishingView(), initialEasyReel(), isTyping(), LOST (+23 more)

### Community 112 - "worker/tsconfig.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 113 - "core/tsconfig.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 114 - "import-hall-assets.mjs"
Cohesion: 0.10
Nodes (16): BASEBOARD, CURTAIN, drop, EXPECTED, file(), manifest, manifestPath, masters (+8 more)

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
Cohesion: 0.18
Nodes (19): fetch(), Env, isItem(), isName(), isPid(), isSeq(), MAX_HOLDS, MAX_MESSAGE_BYTES (+11 more)

### Community 119 - "Costume gallery doorway"
Cohesion: 0.50
Nodes (3): Costume gallery doorway, Curtain colour edit, Prompt

### Community 120 - "pond-api.ts"
Cohesion: 0.23
Nodes (15): PondBoardId, PondBoardPeriod, PondBoardRow, PondLeaderboard, fishArt(), formatInteger(), formatOdds(), nextMondayUtc() (+7 more)

### Community 121 - "Fishing forest: painted asset pass"
Cohesion: 0.10
Nodes (18): Assets, Bruce's collection refresh (2026-11-08), Fishing forest illustrations, Made by hand (not touched by the script), Main hall v2 (2026-11-10), Monets Lily Pond (2026-11-08), 1. Forest doorway, 2. Woodland noticeboard (+10 more)

### Community 124 - "The Costume Atelier"
Cohesion: 0.13
Nodes (14): Adding a character, Adding a costume, Art not supplied as files, Bruce's Chronicles, Checked against the mocks (2026-11-07), Code, Costume fit review, Fitting clothes to other characters (+6 more)

### Community 125 - "Confirmed issues"
Cohesion: 0.04
Nodes (46): 10. Long names run off the name sign, 11. The rooms API skips the stale-tab member check, 12. The bunny is dragged along while you pan in Decorate, 13. Pages that redirect or don't exist answer 200, 14. Error codes reveal which room slugs exist, 15. The name sign slides under the top-right buttons in Decorate, 16. Level-up celebrations can be farmed, 17. No hint of where things are after panning away (+38 more)

### Community 126 - "rig.ts"
Cohesion: 0.13
Nodes (24): Layer, setCostumeVisibility(), canvasToModel(), disposeRigLayer(), Frame, layerTemplates, loadRig(), dispose() (+16 more)

### Community 127 - "Curating the paintings (2026-11-07)"
Cohesion: 0.13
Nodes (14): 1. The registry and the table, 2. The studio's Location picker, 3. The rooms draw what is placed, 4. Credits, 5. Retiring self-serve artists, Building it, Curating the paintings (2026-11-07), Decided (+6 more)

### Community 128 - "domain/guestboard.ts"
Cohesion: 0.15
Nodes (17): GET(), messageLength(), StickyNoteProps, decodeCursor(), encodeCursor(), GuestNoteInput, GuestNoteRejected, listGuestNotes() (+9 more)

### Community 129 - "presence/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, types, exclude, extends, include, ../../tsconfig.base.json

### Community 130 - "run.ts"
Cohesion: 0.17
Nodes (9): admin, childEnv, client, database, fresh, migrations, target, pg@^8.13.1 (+1 more)

### Community 131 - "tsconfig.test.json"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, ../../tsconfig.base.json

### Community 132 - "app/layout.tsx"
Cohesion: 0.16
Nodes (12): bethEllen, inspiratiq, metadata, notoSans, RootLayout(), sniglet, viewport, ServiceWorker() (+4 more)

### Community 133 - "messages.ts"
Cohesion: 0.31
Nodes (7): checkMessage(), INVISIBLE, MESSAGE_MAX, MessageCheck, normalizeMessage(), hasProfanity(), matcher

### Community 134 - "lib/presence.ts"
Cohesion: 0.08
Nodes (21): PresencePreviewPage(), PresencePreview(), Entry, INTERPOLATION_DELAY_MS, PEER_TIMEOUT_MS, PeerTable, positionAt(), RemoteVisitor (+13 more)

### Community 135 - "Item"
Cohesion: 0.13
Nodes (4): Room, Presence, Item, Refusal

### Community 136 - "PlacementLayer"
Cohesion: 0.13
Nodes (5): Carry, PersonalRoomProps, DecorLive, PlacementLayer, Placement

### Community 137 - "RoomContents"
Cohesion: 0.08
Nodes (17): Pose, RoomContents, prop(), Decisions (2026-11-05), Design for Phases 5–7 (2026-11-05), Follow-ups after Phases 4–7, Model (`apps/web/src/features/rooms/types.ts`), Personal room polish (2026-11-05) (+9 more)

### Community 138 - "three"
Cohesion: 0.08
Nodes (45): BULBS, createHallAmbience(), finish(), glowTexture(), mulberry(), painted(), vignetteTexture(), Assets (+37 more)

### Community 139 - "epoch.ts"
Cohesion: 0.23
Nodes (13): GET(), intParam(), GET(), sketchPool, unavailable(), EMPTY, firstSlice(), memo (+5 more)

### Community 140 - "lib/presence.ts"
Cohesion: 0.13
Nodes (13): Connect, connectWebSocket(), HEARTBEAT_MS, HIDDEN_LIMIT_MS, SocketHandlers, Clock, Conn, flush() (+5 more)

### Community 141 - "sketchguess/lib/api.ts"
Cohesion: 0.15
Nodes (16): sameOriginUrl(), PreparedGame, decodeImage(), fetchBitmap(), fetchRound(), guarded(), InkMap, LoadedRound (+8 more)

### Community 142 - "visits.ts"
Cohesion: 0.17
Nodes (18): state(), flush(), visibleMs(), VisitState, count(), currentSalts(), DEVICES, loadSalts() (+10 more)

### Community 143 - "placeLabel"
Cohesion: 0.07
Nodes (13): LobbyMarks, CafeLink, ComingSoonNote, FunZoneSign, GiftShopSigns, GuestBoardNotes, LobbySigns, Placards (+5 more)

### Community 144 - "The Moonlit Pond — design"
Cohesion: 0.09
Nodes (22): Art the pond needs from the artist, Build contract (decided 2026-11-07), Build phases, Collection and goals, Done, Done, Guardrails, Leaderboards (+14 more)

### Community 145 - "Pond rework"
Cohesion: 0.18
Nodes (10): Baits, Client, Decisions, Done, Notes, Pond rework, Server, Species (+2 more)

### Community 146 - "env.ts"
Cohesion: 0.22
Nodes (8): target, SCHEMA_DIR, isProduction(), presenceSecret(), repoRoot, required(), sessionSecret(), setting()

### Community 147 - "Orchestration contract — you plan, DSH workers execute"
Cohesion: 0.29
Nodes (6): Briefing a worker, Budget hygiene, graphify, Orchestration contract — you plan, DSH workers execute, The worker, When not to delegate

### Community 148 - "tables.ts"
Cohesion: 0.10
Nodes (37): FrameShape, PondCatch, CatchView, debugSpecies(), debugVariant(), GuestRoll, guestTreasure(), rollGuest() (+29 more)

### Community 149 - "confirm/page.tsx"
Cohesion: 0.33
Nodes (7): ConfirmFollow(), dynamic, dynamic, Unsubscribe(), FollowNotice(), confirmFollow(), unsubscribe()

### Community 150 - "createRoomPassage"
Cohesion: 0.27
Nodes (6): coverFloorTransition(), createPixelRatioGovernor(), PIXEL_RATIO_STEPS, createRoomPassage(), fixture(), Runtime

### Community 151 - "pond-state.ts"
Cohesion: 0.25
Nodes (14): PondStateView, PondTier, ensurePondStateStarted(), getPondStateSnapshot(), GUEST, listeners, LOADING, PondStateSnapshot (+6 more)

### Community 152 - "perf.ts"
Cohesion: 0.22
Nodes (4): createPerfMeter(), isEnabled(), PerfMeter, PerfSnapshot

### Community 153 - "Other visitors"
Cohesion: 0.29
Nodes (6): How it plays, Other visitors, Privacy, Running it in production, Running it locally, Staying consistent

### Community 155 - "useVisitorName.ts"
Cohesion: 0.29
Nodes (5): announceNameChange(), NameError, useVisitorName(), VisitorName, NameCheck

### Community 156 - "performance/page.tsx"
Cohesion: 0.16
Nodes (15): dynamic, format(), grade(), METRICS, PAGES, PerformancePage(), RANGES, DEVICES (+7 more)

### Community 157 - "Walkthrough.tsx"
Cohesion: 0.15
Nodes (19): BACKDROP_STYLE, MoreArrow(), NavArrow(), Props, SLIDE, Walkthrough(), XIcon(), decodedFrames (+11 more)

### Community 158 - "createPondRoom"
Cohesion: 0.32
Nodes (13): createPondRoom(), approach(), busy(), finishWalk(), goTo(), leave(), move(), nearest() (+5 more)

### Community 159 - "createPlacementLayer"
Cohesion: 0.18
Nodes (8): aspectOf(), createPlacementLayer(), drawOutline(), dropHelper(), sizeOf(), PlacementTheme, Phase 5: themes, zones and arrangements, ThemeSpec

### Community 160 - "High"
Cohesion: 0.24
Nodes (8): 1. Items placed against a zone edge fail to save, and the whole draft reverts, 2. One owned item can be placed many times, 3. Any save rejection throws away all unsaved work, 4. Changes made just before leaving are lost, 5. Fish trophies can be claimed without playing, High, PlacementOwnership, validatePlacements()

### Community 161 - "domain/sketch.ts"
Cohesion: 0.08
Nodes (34): listPieces(), pieceImageUrl(), PieceRow, toPieceDto(), EpochRow, GalleryRow, planSketchRound(), SKETCH_CHOICES (+26 more)

### Community 162 - "CoinToast.tsx"
Cohesion: 0.18
Nodes (9): MuseumLayout(), CoinToast(), Toast, Stamp(), WalletProvider(), STAMP_ASPECT, STAMP_URL, EconomyEvent (+1 more)

### Community 163 - "painting-open"
Cohesion: 0.50
Nodes (4): file, kilobytes, seconds, painting-open

### Community 164 - "share.ts"
Cohesion: 0.33
Nodes (5): ShareOutcome, shareResult(), ShareSummary, shareText(), base

### Community 165 - "Multiplayer ("other visitors") — plan v2 (Cloudflare)"
Cohesion: 0.17
Nodes (11): ScreenChrome(), 0. Summary, 10. Decisions, 1. Product contract changes (approved 2026-10-31), 2. What already exists that this builds on, 5.1 Emotes (v1), 5. Protocol (`packages/core/src/presence/protocol.ts`), 8.1 Expected cost (+3 more)

### Community 168 - "audience.ts"
Cohesion: 0.11
Nodes (20): ArtistPage(), dynamic, generateMetadata(), GET(), GET(), FollowForm(), getArtistPage(), AnalyticsSummary (+12 more)

### Community 169 - "icon-basket"
Cohesion: 0.67
Nodes (3): icon-basket, file, vector

### Community 170 - "plan.ts"
Cohesion: 0.31
Nodes (6): PlaceInfo, planGame(), ROUND_SPREAD, createReveal(), compose(), shuffle()

### Community 172 - "Character"
Cohesion: 0.08
Nodes (6): Carried, Character, Helm, Matcha, hop(), 2. How the game draws the bunny today (read from the repo, not run)

### Community 174 - "AccountSheet"
Cohesion: 0.29
Nodes (9): AccountSheet(), continueAnyway(), doSignOut(), runDelete(), runName(), submit(), submitDelete(), submitName() (+1 more)

### Community 176 - "createDecorController"
Cohesion: 0.67
Nodes (4): createDecorController(), canvasRect(), targetRise(), toScreen()

### Community 186 - "createCharacter"
Cohesion: 0.38
Nodes (6): createCharacter(), contextLost(), loadKind(), loseRig(), setFrame(), Angler()

### Community 187 - "media/storage.ts"
Cohesion: 0.09
Nodes (24): CONTENT_TYPES, GET(), PUT(), getHallSlice(), SliceRow, deletePiece(), GalleryPiece, MAX_STANDS (+16 more)

### Community 190 - "themes.ts"
Cohesion: 0.22
Nodes (9): COLLECTIONS, ATELIER_SPOTS, FRAME_ASPECT, LOCATIONS, LocationSpec, spotPlacementId(), SpotSpec, ownsAll (+1 more)

### Community 191 - "useSoundEffects.ts"
Cohesion: 0.18
Nodes (17): EFFECTS, EffectSpec, FOOTSTEPS, SoundEffects, useSoundEffects(), gestured(), OPTIONS, applyMix() (+9 more)

### Community 193 - "Monets Lily Pond: exploration, UX and multiplayer QA"
Cohesion: 0.29
Nodes (6): Browser and interaction coverage, Changes made from the walkthrough, Monets Lily Pond: exploration, UX and multiplayer QA, Multiplayer and load, Practical limits, Regression checks and cleanup

### Community 194 - "createRemoteVisitors"
Cohesion: 0.25
Nodes (8): createRenderer(), createRigLayer(), createRemoteVisitors(), ensureLayer(), load(), show(), showProp(), sprite()

### Community 195 - "RigPreview.tsx"
Cohesion: 0.22
Nodes (14): RigPreviewPage(), NEXT, PROPS, RigPreview(), draw(), Perch, Pose, approach() (+6 more)

### Community 197 - "pond-api.ts"
Cohesion: 0.26
Nodes (18): buyPondBait(), claimPondBounty(), errorOf(), exchangePondPearls(), fetchPondBounties(), fetchPondDex(), fetchPondLeaderboard(), fetchPondState() (+10 more)

### Community 199 - "rooms.ts"
Cohesion: 0.09
Nodes (34): GET(), PaintingRow, GET(), POST(), UPLOADS_PER_ARTIST, POST(), UPLOADS_PER_ARTIST, dynamic (+26 more)

### Community 200 - "visits/page.tsx"
Cohesion: 0.25
Nodes (10): amount(), duration(), dynamic, LANDMARKS, PAGES, RANGES, share(), VisitsPage() (+2 more)

### Community 202 - "lobby.ts"
Cohesion: 0.08
Nodes (25): CoinWall, createHiddenCoin(), Spot, AlphaMap, alphaMapFor(), alphaMaps, buildAlphaMap(), isPaintedAt() (+17 more)

### Community 205 - "BountyPanel.tsx"
Cohesion: 0.31
Nodes (6): GLYPHS, PearlIcon(), POND_CRIMSON, PondIconName, PondHud(), PondHudProps

### Community 207 - "CrowdPreview.tsx"
Cohesion: 0.33
Nodes (7): CrowdPreviewPage(), CrowdPreview(), draw(), KINDS, Stats, Window, clearRigLayer()

### Community 209 - "remote-visitors.ts"
Cohesion: 0.11
Nodes (11): Attachment, RigState, Rig, RigAttachment, placeOwn(), FLAT, insideScreen(), MAX_SHOWN (+3 more)

### Community 210 - "shopkeeper.ts"
Cohesion: 0.25
Nodes (7): RigPiece, COATS, createShopkeeper(), GREETINGS, OUTFIT, recolourFur(), SHOPKEEPER_NAME

### Community 211 - "VitalsReporter.tsx"
Cohesion: 0.31
Nodes (7): firstPainting(), flush(), Metric, queue, REPORTED, FIRST_PAINTING_MARK, MUSEUM_START_MARK

### Community 212 - "4. Transport: Cloudflare Durable Objects"
Cohesion: 0.25
Nodes (8): 4. Transport: Cloudflare Durable Objects, Decision (2026-10-31), Deploying, Identity cannot be forged, Local development and tests, Rooms and capacity, Shape of `apps/presence` (about 200 lines), main()

### Community 215 - "stage.ts"
Cohesion: 0.05
Nodes (33): CharacterSprites, CameraRig, ROOM_ART, RoomArt, EXITS, isDoor(), linkedDoor(), LINKS (+25 more)

## Knowledge Gaps
- **5 isolated node(s):** `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1376 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **26 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `gallery.ts`, `SketchGuess.tsx`, `app/layout.tsx`, `lib/presence.ts`, `PondPanels.tsx`, `Test Fakes and Helpers`, `actions.ts`, `room-events.ts`, `useBackgroundMusic.ts`, `app/page.tsx`, `pond-state.ts`, `useVisitorName.ts`, `Walkthrough.tsx`, `Web Package Dependencies`, `slots/store.ts`, `CoinToast.tsx`, `risk.ts`, `BountyPanel.tsx`, `audience.ts`, `bug-reports.ts`, `PondTicker.tsx`, `FakeServer`, `Water.tsx`, `wardrobe.ts`, `pond-format.ts`, `AccountSheet.tsx`, `economy/store.ts`, `logic.ts`, `useSoundEffects.ts`, `RigPreview.tsx`, `GuestBoard.tsx`, `ReadScreen.tsx`, `BountyPanel.tsx`, `CrowdPreview.tsx`, `VitalsReporter.tsx`, `stage.ts`, `FishingView.tsx`, `FishingView.tsx`, `pond-api.ts`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **What connects `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json` to the rest of the system?**
  _5 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `walk.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1206896551724138 - nodes in this community are weakly interconnected._
- **Why does `three` connect `three` to `atelier.ts`, `RigPreview.tsx`, `createHallRoom`, `scene/assets.ts`, `lobby.ts`, `join-room.ts`, `scene.ts`, `cozy.ts`, `pond/art.ts`, `remote-visitors.ts`, `prepare-models.mjs`, `createRoomPassage`, `stage.ts`, `perf.ts`, `rig.ts`, `ambience.ts`, `Web Package Dependencies`, `pond/room.ts`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Should `SketchGuess.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12043010752688173 - nodes in this community are weakly interconnected._
- **Why does `query()` connect `actions.ts` to `domain/guestboard.ts`, `rooms.ts`, `jobs.ts`, `epoch.ts`, `visits.ts`, `confirm/page.tsx`, `performance/page.tsx`, `core/src/index.ts`, `domain/sketch.ts`, `wallet.ts`, `audience.ts`, `hitForVisitor`, `handlers.ts`, `media/storage.ts`, `bug-reports.ts`, `rooms.ts`, `visits/page.tsx`, `json`, `db-tests/pond.test.ts`, `ticket/route.ts`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Should `jobs.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.14814814814814814 - nodes in this community are weakly interconnected._