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
  displayTopY: 4.42,
  displayTitleGap: 0.3,

  piece: { gap: 4.0, ropeWidth: 3.4 },

  /** `gap` is the drop from the wall's lower edge; `z` puts it in front of the rope. */
  plaque: { width: 1.6, gap: 0.09, z: 0.6, titleWidth: 1.8 },

  rope: { height: 1.0, centerY: 0.5, z: 0.5 },

  /** `frequency` is the share of gaps holding one; the rest are open floor. */
  pedestal: { height: 2.4, centerY: 0.955, z: 0.3, frequency: 0.55 },

  character: {
    height: 1.55,
    /** Below the floor line: the floor is a receding plane in the art. */
    centerY: 0.26,
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
