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
  },

  /** Walking distance between one display's edge and the next. */
  statueSpan: 2.9,

  camera: {
    /** Small: at phone aspect only ~3.6 world units are visible. */
    followDeadzone: 0.5,
    followLerp: 4.4,
  },

  move: {
    accel: 9,
    maxSpeed: 2.4,
    damping: 7.0,
    dragScale: 0.011,
    wheelScale: 0.0034,
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

export function viewCenterY(): number {
  return CONFIG.world.viewHeight * (CONFIG.world.floorTopRatio - 0.5)
}
