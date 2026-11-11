import { ATELIER_END_X, ENTRANCE } from './atelier-layout.ts'

export const CONFIG = {
  world: {
    viewHeight: 6.4,
    minVisibleWidth: 3.6,
    floorTopRatio: 0.7766,
  },

  wallpaper: { stripePairWidth: 0.62 },
  wall: { tileWidth: 1.8, color: '#741633' },
  baseboard: { height: 0.17, z: -0.45 },
  // The valance hangs from the top of the view; on short views it shrinks so it stays above clearY.
  curtain: { height: 1.25, minHeight: 0.85, clearY: 4.1, z: -0.3, bandColor: '#622331', parallax: 0.08, shadow: { opacity: 0.3, drop: 0.07 } },
  // A soft beam from above the view down onto each painting; drawn behind the frame, over the valance.
  spotlight: { topY: 6.2, topWidth: 0.55, spread: 1.15, reach: 0.55, opacity: 0.34, z: -0.2, halo: 0.11, pool: 0.08, nearMargin: 1.3 },

  ambience: {
    bulbs: {
      capacity: 512,
      diameter: 0.1,
      // Halo and pool diameters are multiples of a bulb's and the valance's height.
      halo: { diameter: 2.4, base: 0.26, color: '#ffdea0', z: -0.28 },
      pool: { diameter: 1.15, base: 0.05, color: '#ffbe78', z: -0.27 },
      twinkle: { minSpeed: 0.3, maxSpeed: 0.6 },
    },
    dust: {
      count: 14,
      minSize: 0.02,
      maxSize: 0.05,
      minBrightness: 0.06,
      maxBrightness: 0.22,
      minY: 0.4,
      margin: 1,
      rise: 0.03,
      wander: 0.04,
      z: -0.24,
      color: '#ffe6c0',
      life: { minSeconds: 5, maxSeconds: 11 },
    },
    puff: {
      blobs: 4,
      capacity: 18,
      offset: 0.3,
      speedMin: 0.9,
      speedMax: 2.2,
      rise: 0.14,
      startSize: 0.1,
      endSize: 0.26,
      seconds: 0.5,
      startOpacity: 0.38,
      z: -0.35,
      color: '#f0d6be',
    },
    vignette: { scale: 1.04, z: 8, renderOrder: 999 },
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
    maxSpeed: 2.4,
    maxScrollSpeed: 7.0,
    damping: 7.0,
    wheelFactor: 0.4,
    keyWalkSpeed: 3.4,
    keyAccel: 40,
    // The share of the view kept clear ahead of a bunny walked with the keys.
    lookAhead: 0.3,
  },

  jump: {
    height: 0.55,
    gravity: 22,
    // A short crouch before leaving the floor, and the squash on landing.
    crouchSeconds: 0.07,
    landSeconds: 0.22,
    squash: 0.14,
    stretch: 0.1,
    landSquash: 0.16,
    combo: { count: 4, heightMultiplier: 1.35, speedMultiplier: 1.15, windowSeconds: 1.1 },
  },

  lobby: {
    length: 6.75,
    minX: -3.6,
    startX: 0,
    introWalk: 1.9,
    door: { x: -0.09, centerY: 1.165, height: 2.81, z: 0.2 },
    sign: { x: 0.165, centerY: 3.007, width: 1.977, height: 0.427, z: 0.2 },
    post: { x: 6.1, top: 0.904, foot: -0.266, width: 1.2, z: 0.5 },
    booth: { x: 4.39, centerY: 1.56, height: 3.467, z: 0.4 },
    tree: { x: 2.02, centerY: 1.2, height: 2.7, z: 0.3 },
    treeLights: {
      topperGlow: 0.45,
      topperMinOpacity: 0.22,
      topperMaxOpacity: 0.34,
    },
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
        otter: { bone: 'head', x: 830, y: 500, width: 1180, rotation: 10 },
        bruce: { bone: 'head', x: 840, y: 470, width: 1400, rotation: 0 },
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
        otter: { bone: 'arm_R', x: 1420, y: 1370, width: 330, rotation: 14 },
        bruce: { bone: 'arm_R', x: 1430, y: 1500, width: 330, rotation: 14 },
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

  // The fashion area is laid out in the mocks' pixels (7.png's), then mapped to world units
  // around the room entrance. Its rooms are in atelier-layout.ts.
  atelier: {
    mock: { unit: 198, originX: 297, floorY: 628, floorWorld: -0.25 },
    ceiling: 4.97,
    max: (ATELIER_END_X - 297) / 198,
    wall: { left: -10, right: 40, tile: 2.2 },
    carpet: { height: 1.25 },
    curtains: { left: -40, width: 520, z: 0.5 },
    // Swags along the ceiling to a drape closing the far end, mirrored, its right edge on the
    // screen's edge when the camera reaches the end. widestHalf is half the widest view it
    // allows for; the swags run that far. Sized and hung as in bruce_mock_scene.png: edge to
    // edge, each room's starting 195 px in from its left wall.
    curtainSwags: { width: 574, overlap: 14, top: -349, startX: ENTRANCE.endX + 195, z: 0.49 },
    curtainDrape: { width: 455, widestHalf: 6.5, z: 0.5 },
    // The entrance, as in 7.png.
    title: { x: 330, y: 147, width: 390 },
    shelf: { x: 330, y: 207, width: 424, z: 0.2 },
    plaque: { x: 320, y: 317, width: 380 },
    cabinet: { x: 330, y: 566, width: 463, z: 0.25 },
    jewelryBox: { x: 285, y: 403, width: 172, z: 0.27 },
    perfume: { x: 430, y: 398, width: 129, z: 0.27 },
    portraitWink: { x: 651, y: 204, width: 153, z: 0.2 },
    portraitBunny: { x: 650, y: 339, width: 110, z: 0.2 },
    ribbon: { x: 650, y: 415, width: 64, z: 0.21 },
    // Accessories with no room of their own, one in each of the cabinet's compartments.
    cabinetPieces: [
      { id: 'blue-cap', image: 'blueCap', x: 236, y: 598, width: 130, rotation: -0.12, compartment: { x: 236, y: 569, width: 175, height: 145 } },
      { id: 'daisy-clip', image: 'daisyClip', x: 443, y: 606, width: 85, rotation: -0.15, compartment: { x: 443, y: 569, width: 175, height: 145 } },
    ],
    // Shared by every collection room.
    broom: { dx: 77, y: 522, width: 115, z: 0.42 },
    fishBag: { dx: -3, y: 352, width: 93, z: 0.36 },
    // Bruce's booth only. Sized and raised as in bruce_mock_scene.png, so the flowers hug the
    // platform and hide the shadow under it.
    bush: { dx: -11, y: 627, width: 371, z: 0.4 },
    column: { bottomY: 680, height: 225, z: 0.3 },
    mannequin: { feetY: 610, height: 450, z: 0.35, canvas: { padX: 62, padTop: 45, form: [173, 525] } },
    platformBlue: { y: 632, width: 276, z: 0.32 },
    spotlight: { height: 692, z: 0.05 },
  },

  statue: { minDwellMs: 180 },
  loading: { prefetchAheadUnits: 16, sliceSize: 6 },
  virtualization: { mountRadiusUnits: 9, loadRadiusUnits: 15 },
  // The hall is a row of rooms joined wall to wall; a gallery room holds paintings up to this width.
  galleryRoom: { maxWidth: 16 },
}

export function centerYFor(frustumHeight: number): number {
  return frustumHeight * (CONFIG.world.floorTopRatio - 0.5)
}
