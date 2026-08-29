/**
 * World constants for the hall renderer.
 *
 * Positions were derived from the Tiny Museum mockups — the floor line, the
 * frame height, the pedestal footing — and the display canvas sizes come from
 * the server, since the layout template decides how wide a display is.
 */

export const CONFIG = {
  world: {
    /** Ortho frustum height. The whole scene is sized against this. */
    viewHeight: 6.4,
    /**
     * The hall never shows less than this much world horizontally.
     *
     * Phones are far taller than 9:16 — 19.5:9 and 20:9 are ordinary — and at
     * those aspects a height-driven frustum leaves barely more than one
     * display's width on screen. When that happens the view zooms out
     * vertically instead, so a display always has room to breathe.
     */
    minVisibleWidth: 3.6,
    /** Where wall meets floor, measured from the empty-room mockup. */
    floorTopRatio: 0.7766,
  },

  /** Vertical centre of the hung frames. */
  displayCenterY: 2.55,

  plaque: { width: 0.95, centerY: 0.8 },
  rope: { height: 1.33, centerY: 0.44, z: 0.5 },
  pedestal: { height: 1.32, centerY: 0.41, z: 0.3 },

  character: {
    height: 1.55,
    /** Feet sit below the floor line: the floor is a receding plane in the art. */
    centerY: 0.26,
    z: 0.7,
    /**
     * Full walk cycles per world unit travelled. Driving the cycle off
     * distance rather than time is what keeps the feet from sliding: the
     * bunny takes the same number of steps per metre at any speed.
     */
    cyclesPerUnit: 0.9,
    /** A little vertical float on top of the drawn cycle. */
    bob: 0.018,

    /*
     * How the bunny follows the view.
     *
     * Two thresholds rather than one, so it does not twitch in and out of its
     * walk cycle on every small nudge: it sets off once it is this far behind,
     * and keeps going until it has properly arrived.
     */
    followStartDistance: 0.7,
    followStopDistance: 0.05,
    /**
     * Seconds to close the remaining gap, capped at `move.maxSpeed`. It eases
     * into the destination instead of stopping dead, but never moves faster
     * than a walk — the whole point is that it reads as walking.
     */
    arriveSeconds: 0.5,
    /**
     * The leash: the bunny is never further behind the view than this.
     *
     * Without it, a fast scroll across several displays strands the character
     * off-screen for many seconds while it walks the whole way. With it, a
     * hard flick still leaves it behind and still has it arrive on foot — it
     * just never falls so far back that it stops feeling connected to you.
     *
     * 4.8u is about one and a third phone screens, so a leashed bunny is just
     * out of sight and about two seconds' walk from the middle.
     */
    maxTrailDistance: 4.8,
  },

  /** Walking distance between one display's edge and the next. */
  statueSpan: 2.9,

  move: {
    accel: 9,
    /**
     * The bunny's walking pace — the ceiling on how fast the character ever
     * moves, however hard the hall is flicked.
     */
    maxSpeed: 2.4,
    /**
     * How fast the *view* may scroll. Deliberately faster than walking: a
     * flick throws the hall along and leaves the bunny to catch up on foot,
     * which is what makes it read as a character rather than a cursor.
     */
    maxScrollSpeed: 7.0,
    damping: 7.0,
    /**
     * Wheel movement relative to 1:1. Drag tracks the wall exactly; wheel
     * deltas are much larger per unit of intent, so they are scaled down.
     */
    wheelFactor: 0.4,
  },

  snap: { enabled: false, strength: 5.0, engageBelowSpeed: 0.85 },

  /**
   * Floor duration for the pedestal transition even on a warm cache, so it
   * reads as sculpture rather than a flicker.
   */
  statue: { minDwellMs: 700 },

  loading: {
    /** Fetch the next slice once the visitor is within this many units. */
    prefetchAheadUnits: 9,
    /** How many displays to ask the API for at a time. */
    sliceSize: 4,
  },

  virtualization: {
    /** Displays outside this radius are unmounted and their textures freed. */
    mountRadiusUnits: 14,
  },
}

/**
 * Vertical centre of the camera for a given frustum height.
 *
 * Takes the height rather than reading the config, because the frustum grows
 * on tall screens to preserve horizontal room — the floor line has to stay put
 * at whatever height is actually in use.
 */
export function centerYFor(frustumHeight: number): number {
  return frustumHeight * (CONFIG.world.floorTopRatio - 0.5)
}
