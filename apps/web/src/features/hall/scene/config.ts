export const CONFIG = {
  world: {
    viewHeight: 6.4,
    minVisibleWidth: 3.6,
    floorTopRatio: 0.7766,
  },

  wallpaper: { stripePairWidth: 0.62 },

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
    length: 4.75,
    startX: 0,
    introWalk: 1.9,
    door: { x: -0.09, centerY: 1.165, height: 2.81, z: 0.2 },
    sign: { x: 0.165, centerY: 3.007, width: 1.977, height: 0.427, z: 0.2 },
    post: { x: 4.1, top: 0.904, foot: -0.266, width: 1.2, z: 0.5 },
    booth: { x: 2.39, centerY: 1.56, height: 3.467, z: 0.4 },
    cat: { dx: 0, centerY: 1.165, height: 1.27, z: 0.35 },
    catFrameMs: 130,
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

  comingSoon: {
    canvas: { w: 2.0525, h: 2.9 },
    note: { dx: -0.015, centerY: 2.618, width: 0.72 },
  },

  // lead/trail: the wall reserved before and after the origin the art hangs from.
  cafe: {
    lead: 3.4,
    trail: 3.4,
    counter: { dx: 0, centerY: 0.77, height: 2.3, z: 0.4 },
    sign: { dx: 0, centerY: 2.75, width: 2.6, z: 0.3 },
    poster: { dx: -0.75, centerY: 1.9, height: 1.1, z: 0.3 },
    menu: { dx: 0.95, centerY: 1.95, height: 1.0, z: 0.3 },
    thanks: { dx: 2.45, centerY: 2.4, height: 1.1, z: 0.3 },
    cat: { dx: 0.55, feetY: 0.4, height: 1.7, z: 0.3 },
    catFrameMs: 200,
  },

  guestBoard: {
    lead: 1.775,
    trail: 2.8,
    board: { dx: 0, centerY: 1.93, width: 3.0, z: 0.3 },
    sign: { dx: 0, centerY: 3.45, width: 1.993, height: 0.43, z: 0.2 },
    signText: { dx: -0.027, centerY: 3.47, width: 1.515 },
    sitArea: {
      dx: 0.072,
      centerY: 0.893,
      height: 2.47,
      z: 0.35,
      beanbag: { u: [0, 0.44], v: [0.029, 0.608], occupiedTop: 0.804 },
      // The computer spans u 0.607-0.793, v 0.367-0.669; padded to a comfortable tap target.
      desktop: { u: [0.6, 0.8], v: [0.355, 0.68] },
    },
    seat: { dx: -1.119, centerY: 0.893, height: 1.455 },
  },

  sit: {
    hopSeconds: 0.45,
    hopLift: 0.35,
    idleSeconds: 10,
    nearDistance: 13.5,
  },

  helm: {
    worn: {
      rig: {
        bunny: { bone: 'head', x: 830, y: 470, width: 1450, rotation: 0 },
        cat: { bone: 'head', x: 790, y: 600, width: 1250, rotation: 0 },
      },
      facing: 'left' as const,
      width: 446,
      walk: { x: 262, y: 106, rotation: 0 },
      idle: { x: 243.8, y: 79.8, rotation: -9.2 },
      sit: { x: 208, y: 216, rotation: 0, width: 420, flip: -1 },
    },
    stand: { x: 370, y: 357, width: 400, drawing: [821, 1299] },
  },

  matcha: {
    held: {
      rig: {
        bunny: { bone: 'arm_R', x: 1400, y: 1400, width: 360, rotation: 14 },
        cat: { bone: 'arm_R', x: 1430, y: 1250, width: 330, rotation: 14 },
      },
      facing: 'right' as const,
      width: 136,
      walk: { x: 399, y: 291, rotation: 14 },
      idle: { x: 360, y: 215, rotation: 14 },
      sit: { x: 455, y: 405, rotation: 10, width: 146, flip: 1 },
    },
    cup: { u: [0.594, 0.668], v: [0.452, 0.633], center: [0.631, 0.536], width: 0.274 },
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

  // Both floors draw the same flight: steps of `rise` by `run`, taken two hops at a time.
  stairs: {
    rise: 0.36,
    run: 0.5,
    // The lobby's newel post stands just left of the door; the flight rises leftwards from it.
    lobbyFoot: -1.4,
    // How far from the foot the character stands before the first hop.
    clear: 0.38,
    z: 0.1,
    // The camera follows a hop up or down by this share of the climb.
    cameraRise: 0.6,
    hopSeconds: 0.4,
    hopLift: 0.22,
    dipSeconds: 0.3,
  },

  // The room is laid out in the mocks' pixels (7.png, with 8.png continuing it 630 px further
  // right and 9.png 1553 px further), then mapped to world units around the stairwell.
  atelier: {
    mock: { unit: 198, originX: 297, floorY: 628, floorWorld: -0.25 },
    ceiling: 4.97,
    max: 12.3,
    clearX: 0.2,
    // The landing's right edge, where the carpet begins; the stairwell opens to its left.
    stairwell: { right: -1.0, width: 4, z: 0.12 },
    wall: { left: -7, right: 15, tile: 2.2 },
    carpet: { height: 1.25 },
    exit: { x: -100, y: 400, width: 268 },
    curtains: { left: -40, width: 520, z: 0.5 },
    title: { x: 330, y: 147, width: 390 },
    shelf: { x: 330, y: 207, width: 424, z: 0.2 },
    plaque: { x: 320, y: 317, width: 380 },
    cabinet: { x: 335, y: 550, width: 440, z: 0.25 },
    jewelryBox: { x: 297, y: 403, width: 150, z: 0.27 },
    perfume: { x: 435, y: 405, width: 110, z: 0.27 },
    portraitWink: { x: 651, y: 204, width: 153, z: 0.2 },
    portraitBunny: { x: 650, y: 339, width: 110, z: 0.2 },
    ribbon: { x: 650, y: 407, width: 64, z: 0.21 },
    collection: { x: 1170, y: 132, width: 170 },
    // The character the visitor can become hangs here; it shows whichever one they are not.
    portrait: { x: 1173, y: 246, width: 107, z: 0.2 },
    featured: { x: 910, costume: 'kiki' },
    broom: { x: 987, y: 522, width: 115, z: 0.42 },
    bowPillar: { x: 1192, pillow: { y: 445, width: 210 }, bow: { x: 1185, y: 377, width: 160 } },
    painting: { x: 1487, y: 344, width: 381, z: 0.2 },
    // Spare forms further along: one spotlit on its platform, one standing on the carpet.
    forms: [{ x: 1830, feetY: 610, platform: true }, { x: 2653, feetY: 685, platform: false }],
    redPillar: { x: 2083, pillow: { y: 440, width: 210 } },
    mirror: { x: 2393, y: 332, width: 190, z: 0.2 },
    column: { bottomY: 680, height: 225, z: 0.3 },
    mannequin: { feetY: 610, height: 450, z: 0.35, canvas: { padX: 45, padTop: 45, form: [173, 525] } },
    platform: { y: 640, width: 330, z: 0.32 },
    spotlight: { height: 4.6, z: 0.05 },
  },

  statue: { minDwellMs: 180 },
  loading: { prefetchAheadUnits: 16, sliceSize: 6 },
  virtualization: { mountRadiusUnits: 9, loadRadiusUnits: 15 },
}

export function centerYFor(frustumHeight: number): number {
  return frustumHeight * (CONFIG.world.floorTopRatio - 0.5)
}
