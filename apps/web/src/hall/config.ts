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

  /**
   * The height every wall hangs from.
   *
   * A common top edge rather than a common centre: templates differ in canvas
   * height, and centring them left the plaques beneath stepping up and down
   * along the hall. The number leaves room above for the artist's name — the
   * frustum reaches about 4.97 at the standard view height.
   */
  displayTopY: 4.42,

  /** Space between a wall's top edge and the name above it. */
  displayTitleGap: 0.3,

  display: {
    /**
     * How much bigger a wall hangs than its canvas says.
     *
     * The server composites a display at the size its layout template chose,
     * and those sizes were picked to fit several walls on screen at once. One
     * wall at a time reads better, so it is drawn larger here rather than
     * re-composited — the flattened image and its region map are in canvas
     * coordinates, and scaling the mesh leaves both untouched.
     *
     * Bounded by the room, not by taste. Hung from displayTopY a 3.2-high
     * canvas at this scale spans 1.54 to 4.42, so the frame finishes well short
     * of the floor and leaves room for both the plaque and the rope beneath it.
     * The mockups draw a single work about as tall as a 2.5-unit frame, and a
     * canvas this size puts the single template's frame at 2.53 — so the walls
     * read like the mock instead of towering over the hall.
     */
    scale: 0.9,
  },

  /**
   * The per-painting planes.
   *
   * The hall hangs one painting per wall now: the server renders each work to
   * its own framed image (portrait or landscape, whichever its proportions
   * need), and the client hangs that image as a single plane from the common
   * top edge, `displayTopY`, sized to the plane's own `canvas`. Because works
   * are framed to about the same on-screen size whatever their orientation,
   * the row of paintings stays level. `gap` is the left/right spacing between
   * adjacent planes, where the pedestals stand.
   */
  piece: {
    gap: 4.0,
    /**
     * How wide the rope under each painting spans. Wider than the painting
     * itself, so it reads as a barrier across the screen — the mockups run the
     * posts out past the art toward the edges of the composition, not snug
     * under the frame. The posts keep their drawn width and the swag stretches.
     */
    ropeWidth: 3.4,
  },

  /**
   * The wall label.
   *
   * `gap` is the drop from the wall's lower edge to the top of the plaque, so
   * it hangs directly beneath the painting rather than at a fixed height. `z`
   * puts it behind the rope, which crosses in front of it.
   */
  plaque: {
    /* Widened: at 0.95 it read as a token beside a wall several units across. */
    width: 1.6,
    gap: 0.09,
    /*
     * Kept in front of the rope.
     *
     * The label's text is not part of the scene — it is DOM in a layer above
     * the canvas, which is what makes it selectable and readable by a screen
     * reader. That layer is always in front, so the words can never be pushed
     * behind a rope no matter where the plaque sprite sits. The rope now hangs
     * below the art as a barrier, but the plaque still draws over it so the
     * sentence never reads across a pink swag on a wall where the two are close.
     */
    z: 0.6,
    /*
     * The artist's name above the wall is sized from its own width, not from
     * the plaque's. They were tied together, so making the plaque bigger made
     * the name bigger with it, which was not the intent.
     */
    titleWidth: 1.8,
  },
  /**
   * The rope, at its drawn size.
   *
   * It was briefly widened to span the wall, which made it tower over the hall
   * — its own proportions turn a screen-width rope into something over three
   * units tall, taller than the wall it stands in front of. Kept to the mock's
   * scale it reads as a barrier rather than a sculpture, and does not compete
   * with the art.
   *
   * `centerY` is half the height so the posts' bases sit on the same floor line
   * as the pedestals — the sprite is centred on its position, so standing it on
   * the floor means giving back half its own rise. At that height the swag sags
   * below the plaque, so the rope crosses the wall and not the label.
   */
  rope: { height: 1.0, centerY: 0.5, z: 0.5 },
  /*
   * Pedestals.
   *
   * The replacement assets are drawn taller than the ones they replace (about
   * 1:2 rather than square), so the same height number made them read as
   * posts. centerY moves with the height to keep the base standing on the same
   * floor line rather than sinking into it: the sprite is centred on its
   * position, so half of any growth has to be given back.
   */
  pedestal: {
    height: 2.4,
    centerY: 0.955,
    z: 0.3,
    /** Share of gaps that hold one. The rest are left as open floor. */
    frequency: 0.55,
  },

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

  /**
   * Walking distance between one display's edge and the next.
   *
   * Widened along with the displays: the point of a hall is that you walk
   * along it, and walls close enough to see two at once removed the walking.
   */
  statueSpan: 5.4,

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
