# Graph Report - tiny-museum  (2026-11-11)

## Corpus Check
- 495 files · ~272,102 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 82 file(s) not represented in the graph (top: .avif 39, .glb 34, .css 4)

## Summary
- 4337 nodes · 11199 edges · 200 communities (173 shown, 27 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 209 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `288620bf`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- themes.ts
- walk.ts
- SketchGuess.tsx
- rooms.ts
- rules.ts
- round.ts
- floor.ts
- Core Asset Manifest
- scene/assets.ts
- SyncStore
- machine.ts
- PondRoom.tsx
- Test Fakes and Helpers
- scene.ts
- cozy.ts
- actions.ts
- room-events.ts
- RoomContents
- ref_node_assert
- amplify/package.json
- lib/assets.ts
- prepare-models.mjs
- stage.ts
- core/package.json
- member-route.ts
- atelier/room.ts
- DecorController
- Museum.tsx
- ambience.ts
- core/src/index.ts
- Web Package Dependencies
- Gamifying Tiny Museum — genre direction & engagement research
- atelier.ts
- lib/slots/index.ts
- risk.ts
- amplify/tsconfig.json
- 5. Customization menu — what other people are doing
- wallet.ts
- usePondState
- Web TSConfig
- Root Package Manifest
- bug-reports.ts
- PondTicker.tsx
- import-fishing-assets.mjs
- Base TSConfig
- Amplify Build Spec
- features/economy/index.ts
- guestboard/route.ts
- FakeServer
- handlers.ts
- Water.tsx
- Worker Package Manifest
- Public Asset Manifest
- wardrobe.ts
- createAtelierRoom
- compose-atelier.mjs
- layout.ts
- pond-format.ts
- react
- economy/store.ts
- backend.ts
- room.ts
- minimap.ts
- Low
- Handoff: move the Tiny Museum bunny from sprite frames to a rig
- Sound Effect Assets
- names.ts
- Custom HTTP Headers
- Sharp Layer Package
- currentMember
- scene/ambience.ts
- wallet/body.ts
- BunnyArtist.tsx
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
- outbox.test.ts
- presence/package.json
- Rig
- Asset pipeline: fast loading without losing sharpness
- Guest Board SQL Schema
- Landscape Frame Asset
- collage.ts
- Bug Reports SQL Schema
- Vitals SQL Schema
- json
- db-tests/pond.test.ts
- pond/room.ts
- ticket/route.ts
- Run-Once Schema
- FishingView.tsx
- FishingView.tsx
- ticket.ts
- Medium
- performance/page.tsx
- personal/room.ts
- graftCostume
- pondgame/lib/api.ts
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
- query
- lib/presence.ts
- Item
- PlacementLayer
- jobs.ts
- hall/room.ts
- domain/sketch.ts
- presence.test.ts
- sketchguess/lib/api.ts
- visits.ts
- writeStyle
- The Moonlit Pond — design
- Pond rework
- env.ts
- Orchestration contract — you plan, DSH workers execute
- tables.ts
- remote-visitors.ts
- createHallRoom
- pond-state.ts
- hit.ts
- Other visitors
- FilesystemStorage
- lib/slots/index.ts
- logic.ts
- Walkthrough.tsx
- createPondRoom
- PlacementTheme
- 4. Transport: Cloudflare Durable Objects
- media/sketch.ts
- CoinToast.tsx
- painting-open
- tab-turn.ts
- Multiplayer ("other visitors") — plan v2 (Cloudflare)
- editor.ts
- exports
- query
- icon-basket
- plan.ts
- share.ts
- BountyPanel.tsx
- bunny-left
- env
- bunny-right
- PersonalRoom.tsx
- CrowdPreview.tsx
- icon-home
- setCostumeVisibility
- confirm/page.tsx
- ticket
- createRemoteVisitors
- PerfMeter
- focus.ts
- shopkeeper.ts
- dependencies
- S3Storage
- Cafe
- TreeSparkles
- ticket/route.ts
- useSoundEffects.ts
- loadKind
- Monets Lily Pond: exploration, UX and multiplayer QA
- HelmShare
- s3-storage.ts
- pond-api.ts
- media/storage.ts
- Lobby
- createStage

## God Nodes (most connected - your core abstractions)
1. `react` - 76 edges
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
- `5.1 Emotes (v1)` --references--> `ScreenChrome()`  [INFERRED]
  docs/multiplayer-plan.md → apps/web/src/shared/components/ScreenChrome.tsx
- `E2E-009 — Room mutations ignore stale account identity` --references--> `memberFromRequest()`  [INFERRED]
  docs/testing/local-e2e-stress-2026-11-06.md → apps/web/src/shared/lib/member-route.ts
- `19. Development-only: page payloads include the full room row` --references--> `getRoom()`  [INFERRED]
  docs/personal-room-issues.md → packages/core/src/domain/rooms.ts
- `Done` --references--> `useBait()`  [INFERRED]
  docs/pond-rework.md → packages/core/src/domain/wallet.ts

## Import Cycles
- None detected.

## Communities (200 total, 27 thin omitted)

### Community 0 - "themes.ts"
Cohesion: 0.09
Nodes (25): COLLECTIONS, 1. Items placed against a zone edge fail to save, and the whole draft reverts, GAMES, isRecord(), parsePlacements(), placementOf(), PlacementOwnership, ownsAll (+17 more)

### Community 1 - "walk.ts"
Cohesion: 0.13
Nodes (13): FloorPoint, WalkArea, water, depthAtLift(), DEPTH_SPAN, depthOf(), MAX_DEPTH, PICTURE (+5 more)

### Community 2 - "SketchGuess.tsx"
Cohesion: 0.14
Nodes (25): bestKeyFor(), BURST, clueUrl(), openingPlan(), Phase, pickAtRandom(), prepareSketchGame(), readDifficulty() (+17 more)

### Community 3 - "rooms.ts"
Cohesion: 0.09
Nodes (44): dynamic, HomePage(), COPY, HomeSignIn(), RoomNoticeProps, publishLocationAction(), artist(), member() (+36 more)

### Community 4 - "rules.ts"
Cohesion: 0.15
Nodes (18): localDay(), at(), EXCHANGE_DAILY_STAMPS, EXCHANGE_PEARLS_PER_STAMP, exchangeClaimKey(), GAME_DAILY_CAP, GameId, GAMES (+10 more)

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
Nodes (48): AssetManifest, assetUrl(), bitmapTexture(), blankImage(), CAFE_CAT_FRAMES, CharacterSprites, CompressedLoader, elementTexture() (+40 more)

### Community 9 - "SyncStore"
Cohesion: 0.12
Nodes (19): ANON_PREFIX, anonKey(), deviceKey(), encodeStored(), isMemberSlotKey(), listKeys(), MEMBER_KEY, memberKey() (+11 more)

### Community 10 - "machine.ts"
Cohesion: 0.11
Nodes (35): CastMeter(), ReelMeter(), armCast(), BITE_WINDOW, biteGap(), CHARGE_PERIOD, chargePower(), createReelState() (+27 more)

### Community 11 - "PondRoom.tsx"
Cohesion: 0.12
Nodes (21): Loading(), metadata, PondPage(), revealFloorTransition(), POND_NAME, PondLoading(), BOARD_TABS, PondOverlayKind (+13 more)

### Community 12 - "Test Fakes and Helpers"
Cohesion: 0.12
Nodes (27): deferredFetch(), deviceSlot, FakeEvents, FakeStorage, fixture, fixtureB, fixtureRegistry, fixtureRegistryBoth (+19 more)

### Community 13 - "scene.ts"
Cohesion: 0.04
Nodes (28): disposeDisplayTexture(), HELM_PEDESTAL_FILE, prefersAvif(), HiddenCoin, Helm, createNotes(), createPedestal(), Notes (+20 more)

### Community 14 - "cozy.ts"
Cohesion: 0.17
Nodes (20): ATELIER_PROPS, AtelierImage, canvasTexture(), CozyBackdrop, cozyPropImageUrl(), drawingOn(), FISH, fishTexture() (+12 more)

### Community 15 - "actions.ts"
Cohesion: 0.05
Nodes (88): config, SECURITY_HEADERS, GET(), PaintingRow, POST(), UPLOADS_PER_ARTIST, dynamic, RoomPage() (+80 more)

### Community 16 - "room-events.ts"
Cohesion: 0.18
Nodes (27): ChatButton(), REFUSED, joinRoom(), STANDING, announceNameChange(), emit(), getPeople(), isInRoom() (+19 more)

### Community 17 - "RoomContents"
Cohesion: 0.08
Nodes (17): Pose, RoomContents, prop(), Decisions (2026-11-05), Design for Phases 5–7 (2026-11-05), Follow-ups after Phases 4–7, Model (`apps/web/src/features/rooms/types.ts`), Personal room polish (2026-11-05) (+9 more)

### Community 18 - "ref_node_assert"
Cohesion: 0.10
Nodes (34): bow, dress, navy, valid, defineSlot(), docBytes(), SLOTS, byAtThenKey() (+26 more)

### Community 19 - "amplify/package.json"
Cohesion: 0.17
Nodes (14): devDependencies, @aws-amplify/backend@^1.14.0, @aws-amplify/backend-cli@^1.6.0, aws-cdk-lib@^2.180.0, constructs@^10.3.0, name, private, scripts (+6 more)

### Community 20 - "lib/assets.ts"
Cohesion: 0.10
Nodes (29): GET(), intParam(), Loading(), dynamic, Hall(), MuseumPage(), [BRAND_OWNER, ...BRAND_REST], CurrentlyShowing() (+21 more)

### Community 21 - "prepare-models.mjs"
Cohesion: 0.10
Nodes (26): paintedCostume(), BODIES, bruce, BRUCE_FIT, BRUCE_PLACE, bunny, CARDIGAN_TIE, CROWN (+18 more)

### Community 22 - "stage.ts"
Cohesion: 0.03
Nodes (46): coverFloorTransition(), CameraRig, Carried, Character, Look, Matcha, Viewport, createPixelRatioGovernor() (+38 more)

### Community 23 - "core/package.json"
Cohesion: 0.16
Nodes (13): devDependencies, @types/bcryptjs@^2.4.6, @types/pg@^8.11.10, main, name, private, scripts, typecheck (+5 more)

### Community 24 - "member-route.ts"
Cohesion: 0.17
Nodes (20): GET(), GET(), PER_MEMBER, GET(), PER_MEMBER, GET(), PER_MEMBER, PER_MEMBER (+12 more)

### Community 25 - "atelier/room.ts"
Cohesion: 0.13
Nodes (16): earn(), emit(), emitEarned(), maybeInvite(), writeSession(), createWardrobe(), enqueue(), reflect() (+8 more)

### Community 27 - "Museum.tsx"
Cohesion: 0.11
Nodes (29): Loading(), AtelierLoading(), CoinFound, ColorRecall, GameDesktop, GuestBoard, HallArranger, HelpGuide (+21 more)

### Community 28 - "ambience.ts"
Cohesion: 0.13
Nodes (30): blade(), bloom(), BLOOMS, createPondAmbience(), update(), fishTexture(), frond(), FRONT_ROWS (+22 more)

### Community 29 - "core/src/index.ts"
Cohesion: 0.05
Nodes (115): addBait(), baitOf(), PondBoardMe, PondBoardRow, PondFeedItem, Rep, bountyCatches(), BountyCatchRow (+107 more)

### Community 30 - "Web Package Dependencies"
Cohesion: 0.07
Nodes (33): dependencies, embla-carousel-react@^8.6.0, motion@^13.1.1, next@^15.0.3, react@^19.0.0, react-dom@^19.0.0, swr@^2.5.1, three@^0.169.0 (+25 more)

### Community 31 - "Gamifying Tiny Museum — genre direction & engagement research"
Cohesion: 0.10
Nodes (19): 0.1 The core experience, 0.2 Systems that make gamification cheap to build, 0.3 Constraints that shape any recommendation, 0. What the game is today (the deep dive), 1.1 The landscape (seven candidates, with verdicts), 1.2 Recommendation: a **cozy gallery life-sim** — "the gallery you live in", 1.3 The five design pillars the genre implies, 1. Genre direction (+11 more)

### Community 32 - "atelier.ts"
Cohesion: 0.04
Nodes (49): AtelierActions, AtelierArt, AtelierImage, AtelierRoom, BuiltRoom, Cardigan, CARDIGAN_NAMES, CHARACTER_NAMES (+41 more)

### Community 33 - "lib/slots/index.ts"
Cohesion: 0.10
Nodes (8): StorageLike, StoredSlot, EventTargetLike, MemberInfo, SlotHandle, SyncEnv, serverSnapshot(), serverSnapshots

### Community 34 - "risk.ts"
Cohesion: 0.16
Nodes (25): Hud(), HudProps, HudWagerChip, WagerPicker(), chooseTier(), WagerPickerProps, chainChipLabel(), clampWagerStake() (+17 more)

### Community 35 - "amplify/tsconfig.json"
Cohesion: 0.20
Nodes (9): compilerOptions, module, moduleResolution, noUnusedLocals, noUnusedParameters, exclude, extends, include (+1 more)

### Community 36 - "5. Customization menu — what other people are doing"
Cohesion: 0.12
Nodes (16): 1. The target: what "Claude Opus 5.5" actually means, 2. Where your harness stands today (live config I read), 3. The honest gap model, 4. Quality levers, ranked by leverage, 5. Customization menu — what other people are doing, 6. Recommended starting kit for *your* profile, 7. What I can apply for you right now (needs your go-ahead), A. Prompt & persona (most common quality customizations) (+8 more)

### Community 37 - "wallet.ts"
Cohesion: 0.08
Nodes (38): grantPearls(), member(), now, piece(), randomId(), today, applyClaim(), baitCounts() (+30 more)

### Community 38 - "usePondState"
Cohesion: 0.24
Nodes (9): GLYPHS, PearlIcon(), POND_CRIMSON, PondIconName, getPondStateSnapshot(), subscribePondState(), usePondState(), PondHud() (+1 more)

### Community 39 - "Web TSConfig"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 40 - "Root Package Manifest"
Cohesion: 0.07
Nodes (35): description, devDependencies, concurrently@^9.1.0, esbuild@^0.24.0, ktx2-encoder@^0.6.0, maxrects-packer@^2.7.3, playwright@^1.63.0, @types/node@^22.9.0 (+27 more)

### Community 41 - "bug-reports.ts"
Cohesion: 0.11
Nodes (27): BugReportHost(), BugReportSheet, BugReportSheet(), send(), Status, collectContext(), inAppBrowser(), onOpenBugReport() (+19 more)

### Community 42 - "PondTicker.tsx"
Cohesion: 0.29
Nodes (11): fetchPondFeed(), PondFeedItem, catchLabel(), formatSizeCm(), speciesFor(), speciesName(), speciesTier(), isGolden() (+3 more)

### Community 43 - "import-fishing-assets.mjs"
Cohesion: 0.10
Nodes (12): CANVAS, clear, FONT, FRAME, heights, layout, lossless, manifest (+4 more)

### Community 44 - "Base TSConfig"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, lib, module, moduleResolution (+9 more)

### Community 45 - "Amplify Build Spec"
Cohesion: 0.12
Nodes (16): applications, appRoot, backend, frontend, baseDirectory, files, phases, commands (+8 more)

### Community 46 - "features/economy/index.ts"
Cohesion: 0.18
Nodes (19): serverSnapshot, useEarnEvents(), useWallet(), buildClaim(), BuiltClaim, EarnDetail, EarnSource, GameSource (+11 more)

### Community 47 - "guestboard/route.ts"
Cohesion: 0.26
Nodes (10): POST(), POST(), rateLimitedResponse(), rejectedResponse(), BugReportRateLimited, postBugReport(), enforceLimits(), GuestNoteRateLimited (+2 more)

### Community 48 - "FakeServer"
Cohesion: 0.18
Nodes (3): FakeServer, SlotState, SlotDef

### Community 49 - "handlers.ts"
Cohesion: 0.16
Nodes (20): Where things stand, confirmedFollowers(), sealEpoch(), handleDerivatives(), handleNotifyFollowers(), handleRenderDisplay(), handleSealEpoch(), renderPieceFrame() (+12 more)

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
Cohesion: 0.12
Nodes (32): AtelierPage(), dynamic, metadata, allowedCharacter(), OwnedSnapshot, owns(), walletReady(), Atelier() (+24 more)

### Community 54 - "createAtelierRoom"
Cohesion: 0.26
Nodes (20): aspectOf(), createAtelierRoom(), buildCollection(), form(), buildEntrance(), buildRoom(), picture(), place() (+12 more)

### Community 55 - "compose-atelier.mjs"
Cohesion: 0.14
Nodes (9): body, dressLayer, dressWidth, floralWidth, MANNEQUIN_CANVAS, mask, root, sourceSize (+1 more)

### Community 56 - "layout.ts"
Cohesion: 0.21
Nodes (9): cafeAfterIndex(), comingSoonWidth(), computeLayout(), cutRooms(), HallLayout, HallRoomKind, HallRoomSpan, hasPedestal() (+1 more)

### Community 57 - "pond-format.ts"
Cohesion: 0.13
Nodes (26): fetchPondDex(), EXCHANGE_DAILY_STAMPS, EXCHANGE_PEARLS_PER_STAMP, FISH_ART, fishArt(), formatPercent(), formatShortSizeCm(), ODDS_BAIT (+18 more)

### Community 58 - "react"
Cohesion: 0.11
Nodes (25): ColorRecall(), ColorRecallProps, Phase, readBest(), ColorRound, showMs(), openBugReport(), fitWidth() (+17 more)

### Community 59 - "economy/store.ts"
Cohesion: 0.10
Nodes (45): CARRY_CAP, carryAdd(), CarryEntry, carryPrune(), carryRemove(), chunk(), ClaimRequest, tzOffsetNow() (+37 more)

### Community 60 - "backend.ts"
Cohesion: 0.15
Nodes (12): amplifyDir, backend, everyMinutes, mediaBucket, missing, repoRoot, REQUIRED, setting() (+4 more)

### Community 61 - "room.ts"
Cohesion: 0.11
Nodes (34): attachmentOf(), socket(), Env, admitted(), Attachment, farewell(), GHOST_MS, HELLO_TIMEOUT_MS (+26 more)

### Community 62 - "minimap.ts"
Cohesion: 0.07
Nodes (38): place(), EXITS, isDoor(), linkedDoor(), LINKS, ATELIER_DOOR, createMinimap(), draw() (+30 more)

### Community 63 - "Low"
Cohesion: 0.10
Nodes (18): 13. Pages that redirect or don't exist answer 200, 14. Error codes reveal which room slugs exist, 15. The name sign slides under the top-right buttons in Decorate, 16. Level-up celebrations can be farmed, 17. No hint of where things are after panning away, 18. Too many items is only discovered by the server, 19. Development-only: page payloads include the full room row, 2. One owned item can be placed many times (+10 more)

### Community 64 - "Handoff: move the Tiny Museum bunny from sprite frames to a rig"
Cohesion: 0.15
Nodes (11): 1. What is in this bundle, 2. How the game draws the bunny today (read from the repo, not run), 3. The rig, 5. Blender-side work still to do (needs Blender; the author has it with an MCP bridge), 6. Open questions for the author, Handoff: move the Tiny Museum bunny from sprite frames to a rig, Approved v4 bunny in the hall, Assets (+3 more)

### Community 65 - "Sound Effect Assets"
Cohesion: 0.22
Nodes (9): file, kilobytes, seconds, file, kilobytes, seconds, soundEffects, click (+1 more)

### Community 66 - "names.ts"
Cohesion: 0.13
Nodes (15): VisitorName, checkMessage(), INVISIBLE, MESSAGE_MAX, MessageCheck, normalizeMessage(), ADJECTIVES, NAME_LIMITS (+7 more)

### Community 67 - "Custom HTTP Headers"
Cohesion: 0.25
Nodes (7): applications, appRoot, customHeaders, headers, pattern, key, value

### Community 68 - "Sharp Layer Package"
Cohesion: 0.33
Nodes (6): dependencies, sharp@^0.33.5, description, sharp, name, private

### Community 69 - "currentMember"
Cohesion: 0.15
Nodes (21): GLOBAL, PER_IP, POST(), GLOBAL, PER_IP, POST(), GET(), PER_VISITOR (+13 more)

### Community 70 - "scene/ambience.ts"
Cohesion: 0.13
Nodes (13): BULBS, createHallAmbience(), finish(), glowTexture(), HallAmbience, mulberry(), painted(), vignetteTexture() (+5 more)

### Community 71 - "wallet/body.ts"
Cohesion: 0.15
Nodes (20): PER_MEMBER, POST(), baitIdOf(), integerOffset(), isRecord(), itemIdOf(), MAX_CLAIM_BATCH, MAX_WALLET_BODY_BYTES (+12 more)

### Community 72 - "BunnyArtist.tsx"
Cohesion: 0.40
Nodes (5): BunnyArtist(), BunnyMood, Pencil(), POSES, 4. Suggested plan

### Community 73 - "import-landing-assets.mjs"
Cohesion: 0.14
Nodes (8): CAT, drop, EXPECTED, manifest, manifestPath, masters, root, target

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
Cohesion: 0.21
Nodes (17): ArtByRoom, blank(), colorAt(), disposePondArt(), edgeTexture(), imageOf(), loadPondArt(), loadTexture() (+9 more)

### Community 80 - "createPresence"
Cohesion: 0.19
Nodes (13): createPresence(), drop(), heartbeat(), maybeSend(), onPageHide(), receive(), scheduleRetry(), send() (+5 more)

### Community 81 - "members"
Cohesion: 0.12
Nodes (25): coin_claims, coin_claims_daily, wallet_bait, wallet_items, wallets, member_sessions, member_sessions_member, member_slots (+17 more)

### Community 82 - "Frame Window Asset"
Cohesion: 0.50
Nodes (4): frame, size, window, windowAspect

### Community 83 - "outbox.test.ts"
Cohesion: 0.29
Nodes (10): OUTBOX_CAP, outboxAdd(), OutboxEntry, outboxFail(), outboxRemove(), RETRY_BASE_MS, RETRY_MAX_MS, retryDelay() (+2 more)

### Community 84 - "presence/package.json"
Cohesion: 0.14
Nodes (16): dependencies, @tiny/core@*, devDependencies, @cloudflare/workers-types@5.20261016.1, wrangler@4.151.1, @tiny/core, name, private (+8 more)

### Community 85 - "Rig"
Cohesion: 0.25
Nodes (3): RigState, Rig, Shown

### Community 86 - "Asset pipeline: fast loading without losing sharpness"
Cohesion: 0.22
Nodes (8): Asset pipeline: fast loading without losing sharpness, Character rigs and the Costume Atelier, Completed, Ground rules, Phase 1: fingerprinted files at 2x and 3x, Phase 2: texture atlases for the hall sprites, Phase 3: KTX2 (Basis Universal), built and switched off, Phase 4: ThumbHash placeholders for paintings

### Community 87 - "Guest Board SQL Schema"
Cohesion: 0.67
Nodes (3): guest_notes, guest_notes_visible, rate_limits

### Community 88 - "Landscape Frame Asset"
Cohesion: 0.67
Nodes (3): frameLandscape, size, window

### Community 89 - "collage.ts"
Cohesion: 0.11
Nodes (25): listPieces(), pieceImageUrl(), PieceRow, toPieceDto(), GalleryRow, SketchPieceRow, DisplayPieceRow, FRAME_FORMAT (+17 more)

### Community 93 - "json"
Cohesion: 0.16
Nodes (30): POST(), PER_MEMBER, PUT(), POST(), POST(), PER_MEMBER, PUT(), PER_MEMBER (+22 more)

### Community 94 - "db-tests/pond.test.ts"
Cohesion: 0.16
Nodes (18): compare(), DexRow, displayName(), FeedRow, getPondDex(), getPondFeed(), getPondLeaderboard(), NameRow (+10 more)

### Community 95 - "pond/room.ts"
Cohesion: 0.09
Nodes (29): FrameShape, EDGE_BAND, EDGE_BANDS, EDGE_OVERLAP, FAR_LIFT, FAR_SCALE, liftAt(), pathHalfWidth() (+21 more)

### Community 96 - "ticket/route.ts"
Cohesion: 0.13
Nodes (34): Code, 3.2 Chosen names (members), registry, started(), hashPassword(), newToken(), uniqueSlug(), verifyPassword() (+26 more)

### Community 104 - "FishingView.tsx"
Cohesion: 0.19
Nodes (17): CAST_ERRORS, coarsePointer(), FishingView(), initialEasyReel(), isTyping(), LOST, PondGameProps, Toast (+9 more)

### Community 105 - "FishingView.tsx"
Cohesion: 0.13
Nodes (14): CONFETTI_COLORS, ConfettiPiece, makeConfetti(), RevealCard(), TIER_MS, TIER_SFX, useCountUp(), chainOffer (+6 more)

### Community 106 - "ticket.ts"
Cohesion: 0.16
Nodes (17): fetch(), parseRoom(), decoder, encoder, fromBase64Url(), HmacKey, isOwn(), isTicket() (+9 more)

### Community 107 - "Medium"
Cohesion: 0.22
Nodes (9): onClick(), 10. Long names run off the name sign, 11. The rooms API skips the stale-tab member check, 12. The bunny is dragged along while you pan in Decorate, 6. Failed saves are nearly invisible, and nothing retries, 7. Two tabs editing the same room overwrite each other, 8. The drawer's card row can't be scrolled on touch screens, 9. Decorating can't be done with the keyboard (+1 more)

### Community 108 - "performance/page.tsx"
Cohesion: 0.27
Nodes (9): dynamic, format(), grade(), METRICS, PAGES, PerformancePage(), RANGES, summarizeVitals() (+1 more)

### Community 109 - "personal/room.ts"
Cohesion: 0.13
Nodes (15): cozyLevel, cozyWorth(), createPersonalRoom(), showLevel(), DOOR_SIGN, NAME_SIGN, PersonalRoomOptions, aspectOf() (+7 more)

### Community 110 - "graftCostume"
Cohesion: 0.27
Nodes (14): canvasFit(), compose(), graftCostume(), copyAccessor(), copyMaterial(), copyMesh(), copyTexture(), copyView() (+6 more)

### Community 111 - "pondgame/lib/api.ts"
Cohesion: 0.14
Nodes (28): RevealCardProps, buyPondBait(), CastOptions, castPond(), chainPondBait(), errorOf(), fetchPondState(), isRecord() (+20 more)

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
Cohesion: 0.35
Nodes (12): isItem(), isName(), isPid(), isSeq(), MAX_MESSAGE_BYTES, parseClientMessage(), parseLook(), parseMotion() (+4 more)

### Community 119 - "Costume gallery doorway"
Cohesion: 0.50
Nodes (3): Costume gallery doorway, Curtain colour edit, Prompt

### Community 120 - "pond-api.ts"
Cohesion: 0.24
Nodes (16): fetchPondLeaderboard(), formatInteger(), formatOdds(), nextMondayUtc(), setPondState(), claim(), BaitShop(), buy() (+8 more)

### Community 121 - "Fishing forest: painted asset pass"
Cohesion: 0.10
Nodes (18): Assets, Bruce's collection refresh (2026-11-08), Fishing forest illustrations, Made by hand (not touched by the script), Main hall v2 (2026-11-10), Monets Lily Pond (2026-11-08), 1. Forest doorway, 2. Woodland noticeboard (+10 more)

### Community 124 - "The Costume Atelier"
Cohesion: 0.12
Nodes (15): Adding a character, Adding a costume, Art not supplied as files, Bruce's Chronicles, Checked against the mocks (2026-11-07), Code, Costume fit review, Fitting clothes to other characters (+7 more)

### Community 125 - "Confirmed issues"
Cohesion: 0.08
Nodes (25): Confirmed issues, E2E-002 — Valid edge placement rejected through floating-point precision, E2E-003 — One owned prop can be placed multiple times, E2E-004 — Reload before autosave silently loses the latest placement, E2E-005 — Failed save and failed Done have no visible mobile explanation, E2E-006 — Restoring connectivity does not retry a failed draft save, E2E-007 — Keyboard activation cannot place drawer items, E2E-008 — Creating an account from My Room leaves the signed-in user on the sign-in prompt (+17 more)

### Community 126 - "rig.ts"
Cohesion: 0.16
Nodes (21): canvasToModel(), disposeRigLayer(), Frame, layerTemplates, loadRig(), dispose(), poseJump(), rotateInPlane() (+13 more)

### Community 127 - "Curating the paintings (2026-11-07)"
Cohesion: 0.14
Nodes (13): 1. The registry and the table, 2. The studio's Location picker, 3. The rooms draw what is placed, 4. Credits, 5. Retiring self-serve artists, Building it, Curating the paintings (2026-11-07), Decided (+5 more)

### Community 128 - "domain/guestboard.ts"
Cohesion: 0.06
Nodes (47): GET(), BoardScreen(), BoardScreenProps, ComposeScreen(), ComposeScreenProps, blankDraft(), GuestBoard(), GuestBoardProps (+39 more)

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
Cohesion: 0.08
Nodes (25): bethEllen, inspiratiq, metadata, notoSans, RootLayout(), sniglet, viewport, StageOptions (+17 more)

### Community 133 - "query"
Cohesion: 0.08
Nodes (33): publishAction(), CatchExtra, clearCatches(), COLUMNS, grantPearls(), insertCatch(), member(), namedMember() (+25 more)

### Community 134 - "lib/presence.ts"
Cohesion: 0.07
Nodes (24): PresencePreviewPage(), PresencePreview(), Entry, INTERPOLATION_DELAY_MS, PEER_TIMEOUT_MS, PeerTable, positionAt(), RemoteVisitor (+16 more)

### Community 135 - "Item"
Cohesion: 0.12
Nodes (4): Room, Presence, Item, Refusal

### Community 136 - "PlacementLayer"
Cohesion: 0.13
Nodes (4): Carry, PersonalRoomProps, PlacementLayer, Placement

### Community 137 - "jobs.ts"
Cohesion: 0.23
Nodes (16): loop(), shutdown(), sleep(), sweepStale(), DrainResult, handler(), repairFrames(), repairUnframed() (+8 more)

### Community 138 - "hall/room.ts"
Cohesion: 0.06
Nodes (54): Assets, Scenery, CUTS, disposeBoards(), Mark, plane(), ROPE_CUTS, ropeSlices() (+46 more)

### Community 139 - "domain/sketch.ts"
Cohesion: 0.26
Nodes (11): GET(), sketchPool, unavailable(), epochById(), getSketchPool(), getSketchRound(), planSketchRound(), SKETCH_CHOICES (+3 more)

### Community 140 - "presence.test.ts"
Cohesion: 0.13
Nodes (13): Connect, connectWebSocket(), HEARTBEAT_MS, HIDDEN_LIMIT_MS, SocketHandlers, Clock, Conn, flush() (+5 more)

### Community 141 - "sketchguess/lib/api.ts"
Cohesion: 0.23
Nodes (13): sameOriginUrl(), PreparedGame, decodeImage(), fetchBitmap(), fetchRound(), guarded(), LoadedRound, loadInk() (+5 more)

### Community 142 - "visits.ts"
Cohesion: 0.08
Nodes (38): PER_VISITOR, POST(), amount(), duration(), dynamic, LANDMARKS, PAGES, RANGES (+30 more)

### Community 143 - "writeStyle"
Cohesion: 0.12
Nodes (8): CafeLink, GuestBoardNotes, Placards, toScreen(), writeStyle(), createSitting(), hop(), raise()

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
Nodes (32): BaitTray(), BaitTrayProps, debugSpecies(), debugVariant(), GuestRollOptions, guestTreasure(), rollGuest(), BAIT (+24 more)

### Community 149 - "remote-visitors.ts"
Cohesion: 0.10
Nodes (22): RigPreviewPage(), NEXT, PROPS, RigPreview(), draw(), Attachment, createCharacter(), Perch (+14 more)

### Community 150 - "createHallRoom"
Cohesion: 0.16
Nodes (19): centerYFor(), createDecorController(), canvasRect(), targetRise(), toScreen(), createHallRoom(), buildRoom(), cafeRoom() (+11 more)

### Community 151 - "pond-state.ts"
Cohesion: 0.29
Nodes (12): fetchPondState(), PondStateView, PondTier, ensurePondStateStarted(), GUEST, listeners, LOADING, PondStateSnapshot (+4 more)

### Community 152 - "hit.ts"
Cohesion: 0.17
Nodes (12): CoinWall, createHiddenCoin(), Spot, AlphaMap, alphaMapFor(), alphaMaps, buildAlphaMap(), isPaintedAt() (+4 more)

### Community 153 - "Other visitors"
Cohesion: 0.29
Nodes (6): How it plays, Other visitors, Privacy, Running it in production, Running it locally, Staying consistent

### Community 155 - "lib/slots/index.ts"
Cohesion: 0.08
Nodes (23): AccountHost(), AccountSheet, AccountSheet(), continueAnyway(), doSignOut(), runDelete(), runName(), submit() (+15 more)

### Community 156 - "logic.ts"
Cohesion: 0.09
Nodes (25): loadHallArranger(), DecorDrawer, DecorDrawerProps, HallArranger(), HallArrangerProps, HallRoomData, Painting, categoryOf() (+17 more)

### Community 157 - "Walkthrough.tsx"
Cohesion: 0.14
Nodes (20): BACKDROP_STYLE, MoreArrow(), NavArrow(), Props, SLIDE, Walkthrough(), XIcon(), decodedFrames (+12 more)

### Community 158 - "createPondRoom"
Cohesion: 0.32
Nodes (13): createPondRoom(), approach(), busy(), finishWalk(), goTo(), leave(), move(), nearest() (+5 more)

### Community 160 - "4. Transport: Cloudflare Durable Objects"
Cohesion: 0.25
Nodes (8): 4. Transport: Cloudflare Durable Objects, Decision (2026-10-31), Deploying, Identity cannot be forged, Local development and tests, Rooms and capacity, Shape of `apps/presence` (about 200 lines), main()

### Community 161 - "media/sketch.ts"
Cohesion: 0.18
Nodes (12): renderSketch(), SKETCH_COLOR_WIDTH, SKETCH_DETAIL_WIDTH, SKETCH_VERSION, SKETCH_WIDTH, SketchOutput, blur(), kernel() (+4 more)

### Community 162 - "CoinToast.tsx"
Cohesion: 0.14
Nodes (14): MuseumLayout(), CoinToast(), Toast, Purse(), Stamp(), WalletProvider(), STAMP_ASPECT, STAMP_SVG (+6 more)

### Community 163 - "painting-open"
Cohesion: 0.50
Nodes (4): file, kilobytes, seconds, painting-open

### Community 164 - "tab-turn.ts"
Cohesion: 0.16
Nodes (5): createTabTurn(), TabTurn, tab(), TurnEnv, TurnMessage

### Community 165 - "Multiplayer ("other visitors") — plan v2 (Cloudflare)"
Cohesion: 0.14
Nodes (13): 0. Summary, 10. Decisions, 1. Product contract changes (approved 2026-10-31), 2. What already exists that this builds on, 3.1 Generated names (everyone has one), 3. Names, 5.1 Emotes (v1), 5. Protocol (`packages/core/src/presence/protocol.ts`) (+5 more)

### Community 166 - "editor.ts"
Cohesion: 0.29
Nodes (11): roomEditor, PER_EDITOR, PUT(), versionOf(), PER_EDITOR, POST(), PER_MEMBER, POST() (+3 more)

### Community 167 - "exports"
Cohesion: 0.15
Nodes (13): exports, ./brand, ./bugs, ./economy, ./guestboard, ./presence, ./presence/messages, ./presence/wire (+5 more)

### Community 168 - "query"
Cohesion: 0.09
Nodes (28): ArtistPage(), dynamic, generateMetadata(), GET(), ALLOWED, POST(), POST(), POST() (+20 more)

### Community 169 - "icon-basket"
Cohesion: 0.67
Nodes (3): icon-basket, file, vector

### Community 170 - "plan.ts"
Cohesion: 0.17
Nodes (9): PlaceInfo, InkMap, planGame(), ROUND_SPREAD, createReveal(), compose(), PENCIL, SketchReveal (+1 more)

### Community 171 - "share.ts"
Cohesion: 0.33
Nodes (5): ShareOutcome, shareResult(), ShareSummary, shareText(), base

### Community 172 - "BountyPanel.tsx"
Cohesion: 0.29
Nodes (10): fetchPondBounties(), memberId(), PondBounties, formatCountdown(), nextUtcMidnight(), utcDayLabel(), useCountdown(), useNow() (+2 more)

### Community 174 - "env"
Cohesion: 0.33
Nodes (4): ONCE, PER_MEMBER, env, RateLimitResult

### Community 176 - "PersonalRoom.tsx"
Cohesion: 0.13
Nodes (24): errorReason(), overDrawer(), PersonalRoom(), canPlaceNew(), carryEnd(), carryMove(), onCardKey(), onCardPointerDown() (+16 more)

### Community 177 - "CrowdPreview.tsx"
Cohesion: 0.24
Nodes (10): CrowdPreviewPage(), CrowdPreview(), draw(), KINDS, Stats, Window, clearRigLayer(), createRenderer() (+2 more)

### Community 179 - "setCostumeVisibility"
Cohesion: 0.50
Nodes (3): Layer, setCostumeVisibility(), setCostume()

### Community 180 - "confirm/page.tsx"
Cohesion: 0.33
Nodes (7): ConfirmFollow(), dynamic, dynamic, Unsubscribe(), FollowNotice(), confirmFollow(), unsubscribe()

### Community 182 - "createRemoteVisitors"
Cohesion: 0.24
Nodes (8): createRemoteVisitors(), ensureLayer(), load(), placeOwn(), show(), showProp(), sprite(), insideScreen()

### Community 185 - "shopkeeper.ts"
Cohesion: 0.25
Nodes (7): RigPiece, COATS, createShopkeeper(), GREETINGS, OUTFIT, recolourFur(), SHOPKEEPER_NAME

### Community 186 - "dependencies"
Cohesion: 0.22
Nodes (9): dependencies, bcryptjs@^2.4.3, obscenity@^0.4.6, sharp@^0.33.5, thumbhash@^0.1.1, sharp, thumbhash, bcryptjs (+1 more)

### Community 190 - "ticket/route.ts"
Cohesion: 0.26
Nodes (10): GET(), GET(), PER_IP, POST(), presenceUrl(), memberFromRequest(), memberName, exportWallet() (+2 more)

### Community 191 - "useSoundEffects.ts"
Cohesion: 0.11
Nodes (27): BackgroundMusic, clampVolume(), isDocumentHidden(), Options, useBackgroundMusic(), VISIBILITY_EVENTS, EFFECTS, EffectSpec (+19 more)

### Community 192 - "loadKind"
Cohesion: 0.67
Nodes (3): contextLost(), loadKind(), loseRig()

### Community 193 - "Monets Lily Pond: exploration, UX and multiplayer QA"
Cohesion: 0.29
Nodes (6): Browser and interaction coverage, Changes made from the walkthrough, Monets Lily Pond: exploration, UX and multiplayer QA, Multiplayer and load, Practical limits, Regression checks and cleanup

### Community 196 - "s3-storage.ts"
Cohesion: 0.33
Nodes (5): @aws-sdk/client-s3@^3.1121.0, @aws-sdk/s3-request-presigner@^3.1121.0, S3StorageOptions, @aws-sdk/client-s3, @aws-sdk/s3-request-presigner

### Community 197 - "pond-api.ts"
Cohesion: 0.19
Nodes (18): buyPondBait(), claimPondBounty(), errorOf(), exchangePondPearls(), isRecord(), isStateView(), mutationHeaders(), PondBoardId (+10 more)

### Community 199 - "media/storage.ts"
Cohesion: 0.17
Nodes (17): CONTENT_TYPES, GET(), POST(), UPLOADS_PER_ARTIST, PUT(), ACCEPTED, createAssetFromUpload(), MAX_UPLOAD_BYTES (+9 more)

### Community 215 - "createStage"
Cohesion: 0.06
Nodes (36): ArtCache, ArtCacheOptions, createArtCache(), drop(), expireLater(), hold(), HeldArt, LoadResult (+28 more)

## Knowledge Gaps
- **5 isolated node(s):** `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1383 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **27 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `domain/guestboard.ts`, `SketchGuess.tsx`, `rooms.ts`, `app/layout.tsx`, `lib/presence.ts`, `PondRoom.tsx`, `Test Fakes and Helpers`, `visits.ts`, `actions.ts`, `room-events.ts`, `lib/assets.ts`, `remote-visitors.ts`, `tables.ts`, `stage.ts`, `Museum.tsx`, `lib/slots/index.ts`, `Walkthrough.tsx`, `Web Package Dependencies`, `logic.ts`, `lib/slots/index.ts`, `CoinToast.tsx`, `risk.ts`, `usePondState`, `query`, `bug-reports.ts`, `PondTicker.tsx`, `BountyPanel.tsx`, `features/economy/index.ts`, `PersonalRoom.tsx`, `CrowdPreview.tsx`, `Water.tsx`, `wardrobe.ts`, `pond-format.ts`, `useSoundEffects.ts`, `names.ts`, `FishingView.tsx`, `FishingView.tsx`, `pond-api.ts`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **What connects `../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json` to the rest of the system?**
  _5 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `themes.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08558558558558559 - nodes in this community are weakly interconnected._
- **Why does `three` connect `hall/room.ts` to `atelier.ts`, `scene/ambience.ts`, `scene/assets.ts`, `scene.ts`, `cozy.ts`, `pond/art.ts`, `room-events.ts`, `remote-visitors.ts`, `stage.ts`, `prepare-models.mjs`, `hit.ts`, `rig.ts`, `ambience.ts`, `Web Package Dependencies`, `pond/room.ts`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **Should `walk.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12561576354679804 - nodes in this community are weakly interconnected._
- **Why does `PeerTable` connect `lib/presence.ts` to `createPresence`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Should `SketchGuess.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1396011396011396 - nodes in this community are weakly interconnected._