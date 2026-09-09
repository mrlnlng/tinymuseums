import manifest from '../../../../public/assets/manifest.json'

/*  Frame geometry, read from the generated manifest — hardcoding these went stale the moment the art was replaced, and regenerating the assets now updates the layout with them. */

export interface FrameShape {
  src: string
  /** Where the artwork sits inside the frame, as CSS percentages. */
  window: { left: string; top: string; width: string; height: string }
  /** The frame's aspect as a bare number, for CSS to size against both axes. */
  ratio: number
}

function shape(src: string, size: number[], window: number[]): FrameShape {
  const [x, y, w, h] = window
  const percent = (value: number) => `${(value * 100).toFixed(3)}%`
  return {
    src,
    window: { left: percent(x), top: percent(y), width: percent(w), height: percent(h) },
    ratio: size[0] / size[1],
  }
}

const PORTRAIT = shape('/assets/frame.png', manifest.frame.size, manifest.frame.window)
const LANDSCAPE = shape(
  '/assets/frame-landscape.png',
  manifest.frameLandscape.size,
  manifest.frameLandscape.window,
)

/* A landscape work in a portrait frame is cropped down the sides, so which way up the frame hangs matters; an unmeasured piece gets the portrait frame, the shape most of the collection is. */
export function frameFor(aspect: number | null): FrameShape {
  return aspect !== null && aspect > 1 ? LANDSCAPE : PORTRAIT
}

/*  Pulls both ornaments into the browser's cache ahead of anyone asking for
    one. They are the heaviest thing the enlarged view draws and the first thing
    it needs, and until they arrive a tapped painting is an empty rectangle —
    but nothing in the hall itself uses them, because the hall's paintings come
    from the server with the frame already rendered in. So they can be fetched
    quietly the moment the hall is standing, in the seconds before anybody has
    chosen a work, and by the time one is tapped the frame is already there.

    Both orientations, not the likely one: which is needed depends on the work
    tapped, and guessing wrong costs exactly what this is meant to avoid. Safe
    to call repeatedly — after the first time the browser answers from cache. */
export function preloadFrames(): void {
  if (typeof window === 'undefined') return
  for (const shape of [PORTRAIT, LANDSCAPE]) {
    const image = new Image()
    // Behind the hall's own textures: those are on screen, this is insurance.
    image.fetchPriority = 'low'
    image.decoding = 'async'
    image.onload = () => markFrameReady(shape.src)
    image.src = shape.src
  }
}

/*  Which ornaments the browser has actually finished with. The enlarged view
    hangs the artwork and the frame as two separate elements, and they are not
    the same weight: the ornament is a 420KB PNG and a work's own image is
    nearer a hundred, so on a first visit the painting arrives first and hangs
    on the wall unframed for a few frames before the frame catches up. Waiting
    for the ornament is what stops that, and this is where the answer lives
    because it belongs to the two shapes rather than to any one work.

    A Set of two strings rather than anything cleverer, because there are two
    ornaments in the museum and both are permanently cached the moment either
    has been seen. Seeded by the preload above, so by the time anybody taps a
    painting the answer is usually already yes and nothing is held back at
    all. */
const decodedFrames = new Set<string>()

export function isFrameReady(src: string): boolean {
  return decodedFrames.has(src)
}

export function markFrameReady(src: string): void {
  decodedFrames.add(src)
}
