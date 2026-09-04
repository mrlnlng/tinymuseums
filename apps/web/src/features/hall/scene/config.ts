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
  pedestal: { height: 1.55, centerY: 0.6, z: 0.3, frequency: 0.55 },

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
      the visitor centre, and the gap between the booth and the first wall is
      about the gap between two walls, so arriving at the art reads as a
      threshold rather than as the next thing along. */
  lobby: {
    length: 6.6,
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
