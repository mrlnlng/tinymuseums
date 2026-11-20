# Atelier: the dressing mirror, and show-don't-tell keeping

Status: revised after three independent reviews (usability and mobile, code feasibility,
critic), 2026-11-19. Builds on option B, `output/character-showcase/mock-b-mirror.png`.

## Goal

A first-time visitor who reads nothing can see every character, become one, and keep it.
Costumes work the same way. The atelier draws no price tags and no text buttons.

This is **phase 1** of a site-wide rule. Other places that still draw prices or text buttons are
listed at the end for later phases.

## Rules

1. **Show, don't tell.** Anything the scene, an animation or an icon can show is not written.
2. **No text buttons.** Controls are things in the scene (mirror, wardrobe, a costume, the door)
   or icons. Screen readers still get full `aria-label`s, because that text is never drawn.
3. **No UI chrome in the walkable room** (house rule). Cues are glints, glows and motion.
4. **Mobile first.** Designed at 390x744 portrait first, then desktop. Hit areas are at least
   44 px, and nothing depends on hover.
5. **Try before you keep.** Anyone can wear anything in the atelier, as now. Keeping costs
   stamps. Unkept things go back when you leave, and the fallback character is the bunny, as
   now (`ownedLook`).

## What goes, and what replaces it

| Today | Code | Replacement |
|---|---|---|
| Price tags on garments, cabinet pieces, tutu, hibiscus, Bruce's portrait | `atelier.ts` `priceTag` / `HangTag` | Removed. Kept things get a small gold seal (below). Cost shows when you keep. |
| Wink and bunny portraits with ribbon at the entrance | `config.ts` `portraitWink`, `portraitBunny`, `ribbon`; `buildEntrance` | Removed from the atelier only. The images stay, because the landing page and cozy theme use them. The mirror stands here. |
| "Back to museum" text sign | `atelier.ts` `.atelier-exit` | Text removed. An unlabelled button stays over the door for keyboard and screen-reader users (`aria-label="To the hall"`). The door's lights show it's the exit. |
| Keep bar: "Keep X · N stamps", "N more stamps to keep", "Members can keep pieces" | `AtelierKeeps.tsx` | Keep stamps beside the visitor (below). |
| "Kept!", "Not enough stamps yet", "Couldn't keep that" | `AtelierKeeps.tsx` `say()` | Animations on the stamp and purse. |
| "X doesn't fit Y yet" | `showMisfit`, `onMisfit` | Deleted. This can't happen today, because every character fits every costume. |
| Hall note after leaving with unkept pieces | `Museum.tsx` `unkeptNote` | Shown at the door instead: the pieces float back as you leave. |
| Bruce's portrait: tap to become Bruce | `Display`, `hitTestDisplay`, `onCharacter` | Decoration only, removed in the same step the mirror ships. The mirror is the one place to change character. |

## The mirror

### In the room

- The unused `mirror.png` stands between the cabinet and the wardrobe (new
  `CONFIG.atelier.mirror`). The layout test that measures against `portraitWink` now measures
  the mirror.
- **It reflects you.** The glass shows a flipped, slightly blue-tinted snapshot of your current
  look (character and costume). It's taken from the live character and refreshed whenever your
  outfit changes. Because it moves with you, it reads as a mirror.
- **It glints** (the existing glint, same as the wardrobe) until you first open it in a session,
  then it stops. This is a steadier cue than a one-time ripple, and veterans aren't nagged.
- **Four gems in its crest**, one per character. The gem for who you are now is lit, and gems for
  characters you've kept carry a tiny gold seal. That shows how many characters there are and
  which are yours.
- **Only a tap on the glass opens it.** Taps on the frame don't, so you don't open it by accident
  while walking past.

### The close-up

- Full-screen over the dimmed room (`aria-modal`, the room set inert, focus trapped,
  `100dvh`, safe-area insets). It stops the room's walking and taps by itself: the stage goes
  quiet while a modal is open.
- **One character fills the glass.** The neighbours peek in at both edges, faded, and a soft
  chevron glints on each side.
  - Move between characters by swiping (`touch-action: pan-y`, pointer capture, ignoring the
    outer 20 px so the phone's back-swipe still works), by tapping a chevron, or with the arrow
    keys.
  - Tapping a peeking neighbour does nothing, so a near-miss never changes your character.
  - The crest gems follow along.
- **Each reflection is the real character**, wearing your current costume. Each one is drawn
  once with the existing rig loader into an offscreen canvas when the close-up opens, then
  cached. The landing art is a fallback only.
- **Tap the reflection to become them.** The close-up closes, then you change in the room with
  the existing sparkle.
  - On the first open in a session, a ghost hand taps the reflection once.
  - The close-up only calls back into the room after its dialog has gone. While the dialog is
    open the room is "quiet" and ignores the call.
- **Close** with the ✕ icon, a tap on the dimmed room, or Escape. There's no back-gesture
  close, because the router would fight it.
- Kept characters show their gold seal on the gem. Characters you haven't kept look the same
  otherwise: you can become any of them, then keep the ones you like.

Considered and kept in reserve: showing all four in a 2x2 grid instead of swiping. It's easier
to scan but less of a mirror. Switch to it if testing shows people don't swipe.

## Keeping

**One keep stamp per unkept thing, floating beside the visitor.** It follows them around the
room the same way the other in-scene controls follow the camera. This keeps the stamp next to
what it keeps, not in a corner. At most three show (character, costume, headpiece), stacked.
Each one buys only its own piece, so a purchase can't half-succeed.

- **Appears** with a small bounce when you put on something you haven't kept. The piece on you
  shimmers in step with its stamp.
  - The first time this happens, a ghost hand presses and holds the stamp once.
- **The cost is on the stamp before you commit.** The stamp shows the stamp glyph and a number,
  in the same visual language as the purse (glyph plus number). It isn't a tag hanging in the
  room: it appears only beside the thing you're wearing, at the moment you could keep it.
  Research (below) found that hiding the cost until the player commits causes frustration and
  distrust.
- **Press and hold to keep.** Holding fills a ring around the stamp, and the purse counts down
  in step, so you see the stamps leave.
  - Letting go early cancels it, so a stray tap never spends stamps.
  - When the ring closes, the stamp thunks onto the piece, the shimmer flashes gold, and the
    stamp leaves.
  - The hold is shown, never written: the stamp breathes (a slow pulse of its ring) while it
    waits, and on a quick tap the ring flicks a quarter round and springs back. The first time,
    a ghost hand holds it.
- **Not enough stamps:** the stamp is drawn muted, with its ring already filled to
  `balance / price`. Held, it won't fill further, and the purse gives a short shake. That shows
  how far off you are.

Research behind this (2026-11-19):

- Players complain when a shop doesn't show what something costs, and developers fix it by
  making the price more prominent
  ([itch.io devlog](https://marcomeijer.itch.io/crystalrealms/devlog/742186/weekly-devlog-9-new-shop-ui)).
- Press-and-hold confirmation works against accidental purchases. Google Play replaced one-tap
  buying with slide-to-buy for that reason
  ([Android Authority](https://www.androidauthority.com/google-play-slide-to-buy-3567924)).
  But Marvel Snap's hold, with no visible hint, frustrated players
  ([Steam discussion](https://steamcommunity.com/app/1997040/discussions/0/4351121630177324504)).
  So the hold needs a visible cue, as above.
- Hiding the real cost is a recognised dark pattern ("currency confusion", "hidden costs")
  ([PocketGamer.biz](https://www.pocketgamer.biz/currency-confusion-reduces-player-trust-f2p-edd-coates),
  [vzbv](https://www.vzbv.de/en/game-over-how-gaming-providers-manipulate-users)). Showing the
  number up front avoids it.
- Showing "can't afford" by changing how the price looks is a common convention
  ([Roblox UI guide](https://create.roblox.com/docs/production/game-design/ui-ux-design)).
- **Not a member:** the stamp has a padlock (this wins over every other state). A tap opens
  the existing account sheet.
- **Network failure:** the stamp shakes and stays. Nothing is spent. Buying is idempotent on the
  server, so trying again is safe.
- **Wallet still loading:** no stamps show, as now.
- **Screen readers:** e.g. "Keep the otter, 250 stamps, press and hold". Results are announced in
  a polite live region.
- All of this comes from one pure, tested function: (look, wallet) → a list of stamps, each in
  one state: ready (with price), short (with progress), or locked.

## Leaving

- **The door is the exit.** Its fairy lights pulse slowly so you can see it from across the room,
  and brighten when you're close. No new art is needed. (Parting the curtains would need the door
  split into layers, so that's not in this plan.)
- **Unkept pieces go back, visibly.** At the door, each unkept piece lifts off you and floats
  home: to the wardrobe, the cabinet, or Bruce's cushion. An unkept character melts back into the
  mirror and you're the bunny again.
  - This takes about 600 ms and is skipped with reduced motion.
  - It wraps both places the room calls `ctx.leave`.
- **The home icon** leaves straight away, without the animation. The hall and the pond already
  draw only kept pieces, so what you see stays correct.

## Mobile and access checks

- Every in-room control's hit area is 44 px or larger.
- The stamps sit beside the visitor, clear of the top-right icons.
- The close-up fits both portrait and landscape, sized by height in landscape.
- Reduced motion: no glint pulse, no ghost hand, no float-back. Changes use cross-fades instead.
- Every state also differs in shape, not just colour: ring, padlock, seal. Contrast is checked
  against the red wall.
- Verify at 390x744 (injected CSS) and at 1280x800, covering every stamp state and every
  character.

## Build order

Each step ships on its own, and no step leaves a character unreachable.

1. **Remove:**
   - All price tags.
   - The entrance portraits and ribbon.
   - `showMisfit` and `onMisfit`.
   - The exit sign's text (its button stays, unlabelled).
   - Update the layout tests.
2. **Mirror and close-up together:**
   - Config, the glass snapshot, the crest gems and the glint.
   - `MirrorView.tsx`, with its carousel logic as a pure, tested function.
   - A new seam, `createAtelierRoomDef(spots, { onMirror, becomeRef })`, where `becomeRef` calls
     the wardrobe's `tapDisplay`.
   - In the same step, retire Bruce's portrait tap, `Display` and `hitTestDisplay`.
3. **Keep stamps:**
   - Replace `AtelierKeeps.tsx`.
   - The stamp-state function, with tests.
   - Press and hold, and the gold seals on kept pieces.
4. **Leaving:**
   - The door's light cue.
   - The float-back animation on both `ctx.leave` paths.
   - Remove the hall's note.
5. **Verify** in the browser at phone and desktop sizes, plus typecheck and tests.

## Decisions (2026-11-19)

- **Scope:** atelier now. The other places listed below come later, each with its own plan.
- **Price only when selected:** no price shows anywhere in the room or the mirror until the
  player selects (puts on) something they haven't kept. Then its keep stamp appears beside them
  with the stamp symbol and the number. Taking it off hides the stamp and its price again.
  Press and hold to keep (see the research above).
- **Plaque:** keep the paragraph. It's museum signage, not instructions.

## Built (2026-11-20)

All four steps are built and checked in the browser at 1280x800 and 390x744. A throwaway local
member, deleted afterwards, was used to cover the locked, short, ready, holding and kept states.

Where the build differs from the plan above:

- **The stamp shows what it keeps.** Each keep stamp holds a small picture of its piece (the
  hanger art, the headpiece, or the character's portrait). This replaces the shimmer on the worn
  piece, which the rig can't single out.
- **First-time hints.**
  - In the mirror: a soft ripple on the reflection, not a hand.
  - On the stamp: a ring closing in.
- **The door** glows (a breathing light over the arch, brighter up close). It has no
  curtain-parting animation, which would need new art.
- **The close-up** sets `aria-modal` and traps focus. It doesn't set the room behind it inert.
- **Reflections** are the real characters, rendered one at a time into a cached image
  (`scene/reflection.ts`).
- **The mirror art** is only 190x474, so the close-up enlarges it and it looks a little soft. A
  larger source would fix this.

Code map:

| File | What it holds |
|---|---|
| `scene/mirror.ts` | Swipe logic (tested) |
| `scene/keep-stamps.ts` | Stamp states (tested) |
| `scene/piece-art.ts` | Piece pictures |
| `components/MirrorView.tsx` | The close-up |
| `components/AtelierKeeps.tsx` | Keep stamps and purse |
| `scene/atelier.ts` | The in-room mirror, seals, door glow, float-home |
| `rooms/atelier/room.ts` | The door-exit path |

## Follow-ups (2026-11-20)

- **Live reflection:** the mirror reflects the visitor live (`scene/mirror-reflection.ts`). Its
  image stands as far behind the glass as the visitor stands in front of the wall, and copies
  walking, jumping and somersaults.
- **The closet:** tapping the wardrobe opens a character-creator closet
  (`components/ClosetView.tsx`, `scene/closet.ts`). The visitor stands live on the blue podium
  under a spotlight. Below are two icon tabs (outfits, headpieces) and a curved wheel of every
  piece, including "nothing". The piece in the middle of the wheel is the one worn. Swipe the
  wheel or tap a piece beside the middle to turn it; a dice button picks a random outfit. This
  combines mocks A and C from `output/closet-mocks/`.
  - A price shows only on the chosen piece if it isn't kept; kept pieces show the seal.
  - ✓ puts the choice on, and the keep stamps then appear beside the visitor. ✕ puts everything
    back.
  - The in-room rail of hangers is gone.

## Later phases (not this plan)

Other places that still draw prices or text buttons:

- the personal room's hang tags (`PersonalRoom.tsx`)
- the decor drawer (`DecorDrawer.tsx`)
- the pond's fishmonger (`FishmongerPanel.tsx`, `pond-format.ts`)
- the hall's "Arrange hall" button (`Museum.tsx`)
- the account sheet

Each gets its own plan.
