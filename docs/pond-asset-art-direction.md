# Fishing forest: painted asset pass

Generated with the built-in `image_gen` tool, one asset at a time. The existing
pond, lily, fish, bunny and fashion-door files are reference material and remain
unchanged. Each new PNG is retained as a source; the game uses an alpha-preserving
WebP export. Screen reviews are saved in `output/pond-art-review/`.

## Art direction

Match the fashion doorway's rounded construction and warm, uneven brown outlines.
Use the pond painting's blue-green leaves, moss greens and small pink flowers.
Shapes stay readable at game scale, with restrained gouache texture and shading.
No vector stand-ins, realistic rendering, backgrounds baked into sprites or tiny
invented text. Lettering is accessible DOM text placed over blank painted signs.

## 1. Forest doorway

Source: `apps/web/public/assets/pond/forest-door.png`.
Runtime: `apps/web/public/assets/pond/forest-door.webp`.

References: `atelier/gallery-door-red.png`, `pond/scene.png`, `bunny.png`.

Prompt:

> Use case: style-transfer. Asset type: one production game sprite, a forest/fishing doorway, transparent PNG cutout. Reference 1 is the EXISTING fashion doorway: preserve its tall rounded arch silhouette, thick warm dark-brown hand-drawn outlines, flat front-facing orthographic construction and simple friendly illustrated readability. Re-theme that doorway for the fishing forest seen in reference 2. Reference 3 shows the game's exact friendly uneven outline and soft painted fill language. Draw ONLY a complete freestanding doorway asset, not a scene or mockup. Replace the pink bow, coat hanger and red curtains with an arch made of warm honey-brown woodland timber, a modest cream crest bearing one simple fish-and-leaf symbol, mossy green trim and a few broad rounded teal leaves with tiny soft pink flowers. The opening is deep navy, with two or three little cream firefly sparkles; it remains an inviting doorway, not a closed gate. Use the pond's blue-green foliage accents and warm cream from the fashion door; gently textured gouache fills, big clean shapes, slight handmade irregularity, very restrained shading, soft dry-brush texture, warm brown outlines. No ornamental overload, no realistic woodgrain, no 3D rendering, no gradients like polished mobile-game art, no thin vector geometry, no words or typography. Front elevation, single isolated asset centered, entire arched top and both feet visible with transparent padding; transparent pixels outside the sprite, navy opaque inside the doorway. Match the existing game's authored illustration, not a new art style.

In-scene review: compared with the original fashion entrance on mobile. Moved the
sprite behind the visitor, fitted the whole arch inside the mobile crop, and kept
its scale close to the existing doorway. Verified that clicking it returns to the
museum before proceeding to the noticeboard.

## 2. Woodland noticeboard

Source: `apps/web/public/assets/pond/forest-noticeboard.png`.
Runtime: `apps/web/public/assets/pond/forest-noticeboard.webp`.

References: the new forest doorway, the original pond painting and the bunny.

Prompt:

> Use case: style-transfer. Asset type: one production transparent game sprite, a freestanding woodland fishing noticeboard. Reference 1 is the approved forest doorway from this game and defines the exact art direction: chunky warm dark-brown handmade outlines, simple honey-colored timber, cream paper, broad teal leaves, mossy lime greens, tiny soft pink flowers, gentle painted gouache texture. Reference 2 is the unchanged pond environment; reference 3 is the game's bunny and defines the friendly uneven linework and simple forms. Draw one noticeboard to belong immediately to the right of that doorway. Front elevation, not isometric: a friendly slightly irregular timber board on two sturdy wooden legs, a modest mossy top rail, one small leaf-and-pink-flower sprig at a corner. A cream blank header plaque sits across the top of the board. Below are three distinct cream paper notices held by simple colored pins; the papers contain only a few broad hand-drawn marks and one tiny fish sketch and one little trophy motif, no actual words. Let the board read as a useful community noticeboard at small game size. Keep construction and details simple and intentional, same brown line weight and brush softness as the doorway, restrained shading and no photoreal wood grain. Composition: the complete single object centered, approximately portrait 4:5 proportions, both wooden feet fully visible, small transparent padding all around. Transparent background outside the prop, no scenery, no characters, no background rectangle, no watermark, no typography. This must look painted for the existing game, not like a vector UI icon, a mobile-game 3D render, or a different illustrator's style.

In-scene review: placed immediately right of the gate, with its feet on the same
ground and its header written directly on the blank painted plaque. Checked the
scale beside the visitor on desktop and mobile, and opened the existing bounties
and records panel from the sprite. Removed the redundant direction cue when the
board is already fully visible.

## 3. Fisherman and bait basket

Source: `apps/web/public/assets/pond/forest-fisherman.png`.
Runtime: `apps/web/public/assets/pond/forest-fisherman.webp`.

References: the forest door, original bunny, existing otter portrait and pond.

Prompt:

> Use case: style-transfer. Asset type: one production transparent game sprite, a friendly otter fisherman NPC with their bait basket. Reference 1 is this game's new forest doorway and sets the warm brown outline, honey wood, cream, blue-green and moss palette and soft gouache texture. Reference 2 is the playable bunny: MATCH its large rounded head, tiny rounded body and paws, very simple friendly facial features, warm uneven brown outlines and softly painted fills. Reference 3 is the game's existing brown otter portrait; keep that family of round brown ears, tan muzzle and rosy cheeks, while creating a distinct adult fisherman. Reference 4 is the original pond painting that this sprite must sit in. Draw a kind round brown otter angler standing on the RIGHT side of the cutout, facing slightly left toward a visitor, with a gentle smile and simple dark eyes with little cream highlights. Give them a soft denim-blue bucket hat with a tiny cream fish patch, a cream shirt and simple muted teal fishing overalls. A short wooden fishing rod rests behind the right shoulder, fully inside the frame. A generously readable honey-brown woven bait basket stands on the ground to the LEFT of the otter; a cream paper bait packet and one small pink-lidded worm tin peek out. One paw rests by the basket, the other makes a small welcoming gesture. The otter's feet and basket bottom share one baseline, and both are fully visible. Keep the otter's body cute and simple like the bunny, not anatomically realistic; the basket is a supporting prop, not a counter or a stall. A little otter tail may peek out at the right. Same handmade illustrated line weight, soft restrained gouache texture and big readable shapes as the references. Single isolated character-and-basket cutout, approximately square to slightly landscape composition, transparent padding all around. Actual transparent background, no ground patch, no scenery, no sign, no lettering, no watermark. No photoreal fur, no 3D rendering, no vector geometric substitute, no busy equipment, no elaborate patterns, no giant fishing pole.

In-scene review: placed right of the noticeboard. Framed the visitor beside the
otter and basket on phones; the wide entrance view includes all three stops.
Checked the character against the bunny at 390px and 320px widths. On short
screens, moved direction signs above the characters to avoid covering faces.
The character opens the existing bait shop with a brief greeting. A browser
fixture purchase also verified that stock and the pearl purse refresh immediately;
this fixed a stale display without changing prices or purchase rules.

## 4. Fishing journal nook

Source: `apps/web/public/assets/pond/forest-journal.png`.
Runtime: `apps/web/public/assets/pond/forest-journal.webp`.

References: the forest doorway and noticeboard, original pond painting and bunny.

Prompt:

> Use case: style-transfer. Asset type: one production transparent game sprite, a fishing-journal reading nook made from a mossy woodland stump. Reference 1 is the game's forest doorway and reference 2 is its noticeboard: MATCH their warm irregular dark-brown outlines, honey timber, cream parchment, broad blue-green leaves, moss greens, small pink flowers, simple shapes and restrained soft gouache texture. Reference 3 is the untouched pond environment where this object will live; reference 4 is the playable bunny, for scale and friendly illustrative style. Draw one low, broad, friendly tree stump used as a little outdoor reading table. An oversized open field journal rests on the cut top, with a muted teal cover, thick cream pages, a soft pink ribbon bookmark hanging down. One page contains a simple blue fish sketch with a couple of broad note marks; the other has a few simple drawn lines, no readable text. A small warm brass lantern sits beside the book, clearly secondary to it. The front of the stump has a modest blank cream wooden plaque, wide enough for a two-word label that the game will add. Add just a little moss and one broad teal-leaf sprig with a tiny pink flower at the foot, to connect it to the door and board. Keep the nook compact and low, appropriate beside a little bunny; it is not a house, kiosk, tall podium, or library. Front-facing game prop with just enough of the stump top visible to read the open book, not an isometric scene. Warm, calm, useful, lovingly hand-painted, same line weight and texture as the references. Complete object centered and isolated with its bottom and all edges visible, small transparent padding. Genuine transparent background, no ground rectangle, no scenery, no characters, no typography, no watermark, no photoreal bark, no polished 3D rendering, no thin vector geometry, no clutter. Lantern light stays a simple warm painted accent rather than a large opaque glow.

In-scene review: a low stump with an open field book and small lantern, placed in
the grove just beyond the water. The visitor stands beside it, and the live label
sits on its painted cream plaque. Checked desktop and mobile composition and
verified that it opens the existing fish collection. Transparency was preserved
in the runtime export; the original pond remains a separate, unchanged asset.

## Final integration checks

- Rendered all four assets as transparent world sprites behind the visitor.
- Checked each asset in the scene before starting the next illustration.
- Checked the complete entrance and route at 1440×1000, 390×844, 320×568 and 844×390.
- Adjusted mobile character framing, short-screen direction signs and landscape
  plaque lettering after inspecting the rendered screenshots.
- Exercised every prop, noticeboard keyboard tabs, modal focus return, charging a
  cast, returning to the pond, and the gate's return to the museum.
- Verified an authenticated purchase with isolated browser fixtures: shrimp stock
  changed from 5 to 10 and pearls from 120 to 100. No live account was mutated.
- Web typecheck and the 26 existing fishing tests passed. Refreshed the code graph
  with `graphify update .`.

The `05-*` images in `output/pond-art-review/` show the final combined interface;
`01-*` through `04-*` preserve the individual asset review stages.

## 5. Current revision: original otter, bait stall and quiet exploration

This revision supersedes the generated fisherman and the floating labels described
above. The NPC now uses the supplied **otter rig** through the existing rig renderer:
its face, proportions, pink star, paws and idle animation are the original character.
A separate fishing apron follows the chest attachment; the player's wardrobe is
unaffected. The apron and fish badge distinguish the resident shopkeeper.

New source assets and runtime exports:

- `apps/web/public/assets/pond/forest-noticeboard-wood.png` / `.webp`
- `apps/web/public/assets/pond/forest-bait-shop.png` / `.webp`
- `apps/web/public/assets/pond/fishing-apron.png` / `.webp`

All three were made with the **built-in image_gen tool**, using transparent
backgrounds. Original tool outputs are retained in Codex's generated-images folder;
selected PNGs are copied into the project. Runtime WebPs preserve alpha; the apron
export trims transparent margins so its chest attachment can be sized accurately.
No otter artwork was generated or redrawn.

Final prompt set:

### Wooden noticeboard header

Reference: the previous `forest-noticeboard.png`.

> Edit this exact transparent game asset. Preserve the entire noticeboard silhouette, papers, pins, legs, moss, flower, color, gouache texture and hand drawn brown outlines exactly. Change ONLY the blank pale cream header plaque at the top into a blank honey-brown wooden sign with subtle warm wood grain and brown border, suitable for dark brown text added later. Same scalloped shape and exact placement. No text or letters. Preserve transparent background. Do not redesign anything else.

Placed and inspected before drawing the stall. The original Sniglet lettering stays
on the physical header; no floating caption is used. Desktop and phone review
confirmed the wood texture, contrast and lettering fit.

### Bait shop

References: the wooden noticeboard, forest door and original pond painting.

> Create ONE transparent cutout game asset: a small cozy woodland fishing BAIT SHOP stall. Match the first two reference props exactly: softly irregular thick chocolate brown outlines, simple flat handpainted gouache texture, honey wood, muted teal, moss and a few pink flowers. The third reference is its existing game environment, do not redraw it. Front view, flat 2D, no perspective distortion. A compact wooden stall with a muted teal scalloped canvas awning, two wooden support posts, a little honey wood counter with 3 recognizable bait jars: pink worms, red berries, tiny shrimp. A small wooden hanging fish-shaped emblem on right post identifies fishing. Small moss tufts at feet. No characters or animals anywhere: existing character will stand next to it on its LEFT, so keep left edge open and uncluttered. No bait basket. No text, no letters, no UI. Do not add a large building or elaborate scenery. Entire stall fits tightly in a roughly square silhouette, on transparent background; crisp alpha, no backdrop, no cast shadow outside the feet.

Placed and inspected with the original otter before generating the apron. Adjusted
layering so the visitor passes in front of the shopkeeper; the otter stands to the
left of the counter. The jars and fish emblem identify the shop without a HUD label.

### Fishing apron

References: an in-app capture of the supplied otter and the selected bait shop.

> Create a single clothing-only sprite for the EXACT otter in reference 1. Do NOT draw or change any otter, body, face, paws, tail, or character. Output ONLY one small fishing shopkeepers apron, floating alone on transparent background, ready to overlay on that character. Warm muted teal cotton bib apron, small thin neck loop at top, short rounded hem at bottom, one cream fish-shaped badge on upper bib and a little rounded pocket containing the tip of a tiny red fishing float. Simple chunky handpainted irregular dark chocolate outline matching the otter, flat fills with very subtle texture matching this game. Front facing, compact rounded silhouette, narrower bib shoulders and gently wider skirt, overall apron width about 80% of its height. No ties sticking far out, no hands, no text, no extra accessories outside the apron, no background or drop shadow. Leave only a small transparent margin. Must stay readable as a small costume at 45 pixels high in-game.

Placed on the chest attachment and inspected in the game; widened the initial fit
from 500 to 580 authoring pixels so the bib reads as clothing at phone scale. The
fish badge and float remain visible, and the original face, star and paws are clear.

### Interaction review

Removed the arrival heading, movement instructions, direction pills, persistent
fishing button and floating object captions. Guests encounter account prompts in
the activity panels; members retain a noninteractive pearl balance. Only the
noticeboard's physical sign keeps permanent lettering.

Pointer input goes through the room's tap/drag recognition, so dragging from a
stall, noticeboard or ripple explores the forest without opening a panel. Native
DOM buttons retain keyboard and assistive-technology activation. Ripples sit
farther into the water to stay clear of the visitor, and occupied spots still use
the existing claim rules. The fishing state machine and economy are unchanged.

Sequential visual captures and final viewport checks are saved under
`output/pond-art-review/06-*` (desktop, phone, small phone and landscape).

Final review: brought the otter closer to the counter rather than constraining
camera movement. `06-final-shop-mobile.png` records the selected composition.
Validated desktop 1440×1000, phone 390×844, small phone 320×568 and landscape
844×390: world taps, dragging from the stall, noticeboard tabs, bait shop, water
ripples, cast charging, journal and return from fishing. The forest gate also
returns correctly with reduced motion. A mocked member verified bounty claiming,
reward-dot refresh, tapping the actual otter, buying bait, immediate stock and
pearl updates, and keyboard focus restoration; no live account was changed.
Web typecheck and all 26 existing fishing unit tests passed. Ran
`graphify update .` after the final code changes.
