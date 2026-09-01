/*  World constants for the hall, in world units. The floor line is y = 0. Values came from the mockups; comments cover only the numbers that are not self-evident from their names. */
export const CONFIG = {
  world: {
    /** Ortho frustum height. Everything is sized against this. */
    viewHeight: 6.4,
    /*  Phones are taller than 9:16; below this width the view zooms out vertically instead of cropping the corridor to one wall. */
    minVisibleWidth: 3.6,
    floorTopRatio: 0.7766,
  },

  /** Walls hang from a common top edge, so their plaques line up along the hall. */
  displayTopY: 4.49,
  /*  The drop from the wall's top edge to the title's *lower* edge: the title is hung from its baseline upward, so a long one grows into the headroom instead of being cut. Small, because the title belongs to the painting, not to the top of the screen. */
  displayTitleGap: 0.07,

  /** `scale` enlarges the server's framed image on the wall without re-rendering it; the layout spaces the walls at the same scale, so the hall stays evenly spaced. */
  piece: { gap: 4.0, ropeWidth: 3.4, scale: 1.10 },

  /*  `gap` is the drop from the wall's lower edge; `z` puts it in front of the rope.

      `titleWidth` is the band a title wraps inside, and it is narrower than the
      wall it hangs over for one reason: the home and sound buttons float in the
      screen's top-right corner, in the same band the title occupies, and the
      title is centred on a painting that is itself centred. At 3.6 world units
      to the screen's width, those buttons begin 1.09 out from the centre, so a
      band of 2.02 keeps a title's longest line clear of them by a comfortable
      margin. A title too long for the band wraps and grows upward into the
      empty wall, which costs nothing; running underneath a button costs the
      words. The enlarged view keeps its own title clear the same way. */
  plaque: { width: 1.2, gap: 0.06, z: 0.6, titleWidth: 2.02 },

  /*  Height and centre are measured off the mockup rather than chosen: the posts' feet land at y = -0.16, a little past the floor line, because the floor is a receding plane and something standing on it meets the line in front of it, not on it. At this height the sprite's own width is also the width the mockup draws it at. */
  rope: { height: 1.27, centerY: 0.47, z: 0.5 },

  /** `frequency` is the share of gaps holding one; the rest are open floor. */
  pedestal: { height: 2.4, centerY: 0.955, z: 0.3, frequency: 0.55 },

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

  statue: { minDwellMs: 700 },
  loading: { prefetchAheadUnits: 9, sliceSize: 4 },
  virtualization: { mountRadiusUnits: 14 },
}

/*  Vertical centre of the camera for a frustum height — read the height so the floor line stays put as the frustum grows on tall screens. */
export function centerYFor(frustumHeight: number): number {
  return frustumHeight * (CONFIG.world.floorTopRatio - 0.5)
}
