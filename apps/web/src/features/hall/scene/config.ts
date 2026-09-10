/*  World constants for the hall, in world units. The floor line is y = 0. Values came from the mockups; comments cover only the numbers that are not self-evident from their names. */
export const CONFIG = {
  world: {
    /** Ortho frustum height. Everything is sized against this. */
    viewHeight: 6.4,
    /*  Phones are taller than 9:16; below this width the view zooms out vertically instead of cropping the corridor to one wall. */
    minVisibleWidth: 3.6,
    floorTopRatio: 0.7766,
  },

  /*  Walls hang from a common *bottom* edge, which is what makes their plaques
      line up along the hall: the plaque hangs off the painting's lower edge, so
      a common top edge lined up the tops and left every plaque at a different
      height — a landscape work, being much shorter than a portrait one, ended
      up a metre off the ground with its label floating beside the portrait
      above it. Hung from below, a landscape work stands at the same height as
      everything else and its plaque joins the row.

      The number is where a portrait wall's lower edge already sat under the old
      top-hung arrangement (4.32 less a 2.9 x 1.28 wall), so the hall's usual
      case is unchanged and only the wide ones have come down to meet it. */
  displayBottomY: 0.608,
  /*  The drop from the wall's top edge to the title's *lower* edge: the title is hung from its baseline upward, so a long one grows into the headroom instead of being cut. Small, because the title belongs to the painting, not to the top of the screen. */
  displayTitleGap: 0.07,

  /*  `scale` enlarges the server's framed image on the wall without re-rendering
      it. `gap` is deliberately short: at four units the next wall was a screen and
      a half away and the hall read as a corridor of empty plaster, where at this
      distance its outer edge is just past the frame you are standing at and a
      nudge brings it in. The rope takes the painting's own width, so there is no
      third number here to drift out of agreement with the other two. */
  piece: { gap: 1.2, scale: 1.28 },

  /*  `gap` is the drop from the wall's lower edge; `z` puts it *behind* the
      rope, which is where every mockup has it — the rope is furniture standing
      on the floor and the plaque is on the wall behind it. Small, because it is
      a label: the artist's page carries the description in full.

      `titleWidth` is the band a title wraps inside, and it is narrower than the
      wall it hangs over for one reason: the home and sound buttons float in the
      screen's top-right corner, in the same band the title occupies, and the
      title is centred on a painting that is itself centred. At 3.6 world units
      to the screen's width, those buttons begin 1.09 out from the centre, so a
      band of 2.02 keeps a title's longest line clear of them by a comfortable
      margin. A title too long for the band wraps and grows upward into the
      empty wall, which costs nothing; running underneath a button costs the
      words. The enlarged view keeps its own title clear the same way. */
  plaque: { width: 0.86, gap: 0.05, z: 0.4, titleWidth: 2.02 },

  /*  Height and centre are measured off the mockup rather than chosen: the posts' feet land at y = -0.16, a little past the floor line, because the floor is a receding plane and something standing on it meets the line in front of it, not on it. At this height the sprite's own width is also the width the mockup draws it at. */
  rope: { height: 1.27, centerY: 0.47, z: 0.5 },

  /*  `frequency` is the share of gaps holding one; the rest are open floor.
      Shorter and standing lower than it was, because the gap it stands in is
      now a fraction of what it was: a pedestal drawn at its old height would
      be wider than the space between two paintings and reach up the wall past
      the bottom of both. */
  pedestal: {
    height: 1.55,
    centerY: 0.6,
    z: 0.3,
    frequency: 0.55,
    /*  The puff of notes a tapped pedestal gives off. Offsets are measured
        from the pedestal's centre: `offsetY` puts the notes level with the
        object standing on top (the sprite's own top edge is at +0.775) and
        `offsetX` sets them off to one side of it, so the owl is not hidden
        behind the sound it is making. `seconds` is the length of the whole
        fade, chosen against the sound effects it accompanies — the harp runs
        about three and a half seconds and the owl about three. */
    notes: { width: 0.92, offsetX: 0.46, offsetY: 0.74, rise: 0.42, z: 0.06, seconds: 3.2 },
  },

  character: {
    /*  Smaller and standing further down the floor than it once was: the walls grew, and at its old size the visitor stood head-and-ears over the plaque of whatever it had walked up to. */
    height: 1.36,
    /** Below the floor line: the floor is a receding plane in the art. */
    centerY: 0.12,
    z: 0.7,
    /** Cycles per unit travelled — distance, not time, stops foot-sliding. */
    cyclesPerUnit: 0.9,
    bob: 0.018,
    /*  Two thresholds, not one, so it does not twitch in and out of its walk cycle on every nudge. */
    followStartDistance: 0.7,
    followStopDistance: 0.05,
    arriveSeconds: 0.5,
    /*  The leash — about one and a third screens, so a hard flick never strands the bunny off-screen for long. */
    maxTrailDistance: 4.8,
  },

  move: {
    accel: 9,
    /** The bunny's own pace — the ceiling on how fast the character moves. */
    maxSpeed: 2.4,
    /** The view may outrun it: that is what makes it a character, not a cursor. */
    maxScrollSpeed: 7.0,
    damping: 7.0,
    /** Wheel deltas run large, so they are scaled below 1:1. */
    wheelFactor: 0.4,
  },

  /*  The visitor centre, at the head of the hall. Positions were measured off
      mockups 1 and 2 with the camera parked at x = 0, which is exactly the
      framing mockup 1 draws: the door a little left of centre, its sign over
      it, the way-finder to its right and the help booth running off the right
      edge. `length` is where the exhibition starts; everything before it is
      the visitor centre.

      It is the booth's own right-hand edge (centred at 2.39, and 3.695 out to
      the edge of what its sprite actually draws) plus `piece.gap`, so the
      first painting follows the visitor centre at the spacing one painting
      follows another. It used to stand a further screen and a half out, on the
      argument that arriving at the art should read as a threshold — but a
      threshold you cross in silence is just a wait, and the visitor who has
      pressed on past the help booth has already decided to go and look at the
      paintings. The far end of the hall gave up the same stretch of empty
      plaster for the same reason; see `giftShop`. */
  lobby: {
    length: 4.9,
    /** Where the camera parks on arrival. Also the hall's left end. */
    startX: 0,
    /*  The bunny still walks on from off the left edge, as it does in the
        hall — far enough to be off a 9:16 screen (1.8 units of it) at the
        start, so it walks in rather than appearing. */
    introWalk: 1.9,
    /** Standing a little below the floor line, as everything on it does. */
    door: { x: -0.09, centerY: 1.165, height: 2.81, z: 0.2 },
    /*  Wider than plaque.png is drawn, so the board is cut into three and only
        its middle stretches — the same treatment the rope gets. */
    sign: { x: 0.165, centerY: 3.007, width: 1.977, height: 0.427, z: 0.2 },
    /** The way-finder. Drawn rather than photographed: the pack has no art for it. */
    post: { x: 1.19, top: 0.904, foot: -0.266, width: 1.2, z: 0.5 },
    booth: { x: 2.39, centerY: 1.56, height: 3.467, z: 0.4 },
    /** The pill on the booth's counter, measured off the drawing behind it. */
    helpButton: { dy: -0.215, width: 1.06, height: 0.35 },
  },

  /*  The gift shop, at the far end of the hall: the visitor centre's opposite
      number, and the last thing on the walk. Positions were measured off
      mockup 10 with the camera parked at the hall's right-hand end, which is
      exactly the framing that mockup draws — the counter centred on the screen
      with the note, the board and the pill stacked up the wall above it.

      `length` is the distance from whatever the shop stands behind — the last
      painting, or the cafe when the cafe is the last room before it — to where
      the camera parks. Almost all of it is the counter's own half-width: the
      drawing is 3.59 wide at this height, so 1.79 of the number below is spent
      before the counter's left edge is reached, and only the remainder is
      empty wall.

      That remainder is now under half of `piece.gap`, tighter than the spacing
      between two paintings, which is deliberate. This end of the hall is not a
      corridor: the shop is the thing the walk has been leading to, and the last
      painting handing straight over to it is what makes it read as the end
      rather than as one more room along. The visitor centre gave up its own
      stretch of empty plaster for a related reason; see `lobby`. */
  giftShop: {
    length: 2.25,
    /*  The counter and its shelves. Its sprite has a good deal of clear space
        above the shelves, so the plane reaches most of the way up the screen
        while the drawing inside it stands on the floor. */
    counter: { dx: 0, centerY: 1.16, height: 2.8, z: 0.4 },
    /*  The note that closes the exhibition. plaque.png at very nearly the
        proportions it was drawn at, so unlike the board below it this one is a
        single plane rather than three slices. */
    note: { dx: 0.042, centerY: 3.654, width: 2.617, height: 1.28, z: 0.2 },
    /*  The shop's own board. The same size as the one over the visitor
        centre's door, and built the same way. */
    sign: { dx: -0.048, centerY: 2.664, width: 1.993, height: 0.43, z: 0.2 },
    /** The pill under the board — the one control at this end of the hall. */
    button: { dx: -0.05, centerY: 2.152, width: 1.327, height: 0.31 },
    /*  The writing sits on the paper, and the paper is up and to the left of
        each sprite's own middle, because both drawings carry their shadow down
        and to the right. Both marks are measured off the words in the mockup
        rather than off the boards they are written on. */
    noteText: { dx: -0.002, centerY: 3.662, width: 2.0 },
    signText: { dx: -0.075, centerY: 2.684, width: 1.515 },
  },

  /*  The museum cafe — a rest stop along the walk, not a terminus: it sits
      between the tenth painting and the eleventh when the hall has more than
      ten works, and after the last painting (with the gift shop past it) when
      it has ten or fewer. `length` is the corridor the cafe occupies between
      two walls, and the composition is centred in it the way the visitor
      centre and gift shop anchor their own rooms. Positions below are v1,
      measured off Marlene's art rather than a mockup, and want an eyeball pass
      in a browser. */
  cafe: {
    length: 6.8,
    /*  The counter front, floor-anchored like the gift shop's counter. Its
        lower edge sits below the floor line — the sprite's bottom corners are
        transparent, so the drawing's own base is what meets the floor. */
    counter: { dx: 0, centerY: 0.77, height: 2.3, z: 0.4 },
    /*  The hanging sign, its own art (painted lettering, no alpha) — the
        shop's board, hung above the counter in the empty wall above the
        drawing, wide enough to cover the two boards beneath it. */
    sign: { dx: 0, centerY: 2.75, width: 2.6, z: 0.3 },
    /*  The two boards hang as a matching pair directly beneath the sign, one
        either side of the register. The "buy us a coffee" poster leads: it is a
        touch larger than the menu, and hangs a fraction lower so its top edge
        lines up with the menu's, sitting pulled toward the middle so the pair
        is closer together while still keeping a clear gap. */
    poster: { dx: -0.75, centerY: 1.9, height: 1.1, z: 0.3 },
    menu: { dx: 0.95, centerY: 1.95, height: 1.0, z: 0.3 },
    /*  The waving cat behind the counter — the cafe's cashier, standing to the
        *right* of the register (its plane sits behind the counter's, so the
        counter drawing hides everything below the desk line and only the head
        and shoulders show). Raised a touch so the waving hand clears the
        desk. Slightly larger than the visitor — the character stands 1.36
        tall; this is 1.7. */
    cat: { dx: 0.55, feetY: 0.4, height: 1.7, z: 0.3 },
    catFrameMs: 200,
  },

  /*  A floor on how long a pedestal holds before the wall behind it appears, so
      the loading cue is a beat rather than a flicker. Short: it is a floor on
      the *wait*, and every millisecond of it is a millisecond the visitor spends
      looking at a pedestal in front of a painting that has already arrived. */
  statue: { minDwellMs: 180 },
  /*  How far ahead the next slice of the hall is asked for, and how much of it
      comes at a time. Both up: at a walking pace of 7 units a second, nine units
      of runway is a second and a bit — about what one request takes on a phone —
      so the ask now goes out two walls earlier, and brings back enough to cover
      the walk while it does. */
  loading: { prefetchAheadUnits: 16, sliceSize: 6 },
  /*  Two radii, because downloading a painting and hanging it cost different
      things. `mountRadiusUnits` is the video-memory budget: how far either side
      of the camera a wall is kept as geometry and an uploaded texture. Nine
      units is a little over two walls each side of the one on screen.

      `loadRadiusUnits` is the network budget, and it is much larger because it
      is free until the image arrives. At the old arrangement a painting's
      download did not begin until it was already within two walls of the
      camera, which at a hard scroll is under a second — so the visitor
      overtook the download and walked up to a pedestal. Starting the fetch two
      and a half screens further out gives it that second back, and the decoded
      texture is only uploaded to the GPU when the wall is actually mounted. */
  virtualization: { mountRadiusUnits: 9, loadRadiusUnits: 26 },
}

/*  Vertical centre of the camera for a frustum height — read the height so the floor line stays put as the frustum grows on tall screens. */
export function centerYFor(frustumHeight: number): number {
  return frustumHeight * (CONFIG.world.floorTopRatio - 0.5)
}
