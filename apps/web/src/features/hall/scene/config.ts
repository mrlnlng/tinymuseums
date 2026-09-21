export const CONFIG = {
  world: {
    viewHeight: 6.4,
    minVisibleWidth: 3.6,
    floorTopRatio: 0.7766,
  },

  displayBottomY: 0.608,
  displayTitleGap: 0.07,

  piece: { gap: 1.2, scale: 1.28 },

  plaque: { width: 0.86, gap: 0.05, z: 0.4, titleWidth: 2.02 },

  rope: { height: 1.27, centerY: 0.47, z: 0.5 },

  pedestal: {
    height: 1.55,
    centerY: 0.6,
    z: 0.3,
    frequency: 0.55,
    notes: { width: 0.92, offsetX: 0.46, offsetY: 0.74, rise: 0.42, z: 0.06, seconds: 3.2 },
  },

  character: {
    height: 1.36,
    centerY: 0.12,
    z: 0.7,
    cyclesPerUnit: 0.9,
    bob: 0.018,
    followStartDistance: 0.7,
    followStopDistance: 0.05,
    arriveSeconds: 0.5,
    maxTrailDistance: 4.8,
  },

  move: {
    accel: 9,
    maxSpeed: 2.4,
    maxScrollSpeed: 7.0,
    damping: 7.0,
    wheelFactor: 0.4,
  },

  lobby: {
    length: 4.9,
    startX: 0,
    introWalk: 1.9,
    door: { x: -0.09, centerY: 1.165, height: 2.81, z: 0.2 },
    sign: { x: 0.165, centerY: 3.007, width: 1.977, height: 0.427, z: 0.2 },
    post: { x: 1.19, top: 0.904, foot: -0.266, width: 1.2, z: 0.5 },
    booth: { x: 2.39, centerY: 1.56, height: 3.467, z: 0.4 },
    helpButton: { dy: -0.215, width: 1.06, height: 0.35 },
  },

  giftShop: {
    length: 2.25,
    counter: { dx: 0, centerY: 1.16, height: 2.8, z: 0.4 },
    note: { dx: 0.042, centerY: 3.654, width: 2.617, height: 1.28, z: 0.2 },
    sign: { dx: -0.048, centerY: 2.664, width: 1.993, height: 0.43, z: 0.2 },
    button: { dx: -0.05, centerY: 2.152, width: 1.327, height: 0.31 },
    noteText: { dx: -0.002, centerY: 3.662, width: 2.0 },
    signText: { dx: -0.075, centerY: 2.684, width: 1.515 },
  },

  cafe: {
    length: 6.8,
    counter: { dx: 0, centerY: 0.77, height: 2.3, z: 0.4 },
    sign: { dx: 0, centerY: 2.75, width: 2.6, z: 0.3 },
    poster: { dx: -0.75, centerY: 1.9, height: 1.1, z: 0.3 },
    menu: { dx: 0.95, centerY: 1.95, height: 1.0, z: 0.3 },
    thanks: { dx: 2.45, centerY: 2.4, height: 1.1, z: 0.3 },
    cat: { dx: 0.55, feetY: 0.4, height: 1.7, z: 0.3 },
    catFrameMs: 200,
  },

  guestBoard: {
    length: 3.9,
    board: { dx: 0, centerY: 2.05, width: 3.0, z: 0.3 },
  },

  helm: {
    worn: {
      facing: 'left' as const,
      width: 446,
      walk: { x: 262, y: 106, rotation: 0 },
      idle: { x: 243.8, y: 79.8, rotation: -9.2 },
    },
    stand: { x: 370, y: 357, width: 400, drawing: [821, 1299] },
  },

  matcha: {
    held: {
      facing: 'right' as const,
      width: 136,
      walk: { x: 399, y: 291, rotation: 14 },
      idle: { x: 360, y: 215, rotation: 14 },
    },
    menuColumn: { u: [0.08, 0.5], v: [0.12, 0.86] },
    menuWidth: 0.22,
  },

  carry: {
    flightSeconds: 0.75,
    arcLift: 0.16,
    spin: 1,
  },

  coin: {
    width: 0.3,
    frame: { peek: 0.55, heightRatio: 0.35, margin: [0.063, 0.093], z: -0.05 },
    rope: { inset: 0.05, y: -0.04, z: 0.45, width: 0.26 },
    pedestal: { dx: 0.2, y: 0.02, z: 0.25 },
    wiggleEverySeconds: 3.2,
    vanishSeconds: 0.35,
  },

  statue: { minDwellMs: 180 },
  loading: { prefetchAheadUnits: 16, sliceSize: 6 },
  virtualization: { mountRadiusUnits: 9, loadRadiusUnits: 15 },
}

export function centerYFor(frustumHeight: number): number {
  return frustumHeight * (CONFIG.world.floorTopRatio - 0.5)
}
