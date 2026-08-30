import manifest from '../../public/assets/manifest.json'

/**
 * Frame geometry, read from the generated manifest rather than typed out.
 *
 * These numbers were hardcoded once and went stale the moment the art was
 * replaced: the enlarged view kept the previous asset's aspect ratio and
 * window height, so the artwork sat visibly wrong inside the frame. Importing
 * the manifest means regenerating the assets updates the layout too.
 */

const [x, y, w, h] = manifest.frame.window as [number, number, number, number]
const [frameWidth, frameHeight] = manifest.frame.size as [number, number]

/** Where the artwork sits inside the frame, as CSS percentages. */
export const FRAME_WINDOW = {
  left: `${(x * 100).toFixed(3)}%`,
  top: `${(y * 100).toFixed(3)}%`,
  width: `${(w * 100).toFixed(3)}%`,
  height: `${(h * 100).toFixed(3)}%`,
}

/** The frame image's own aspect, for sizing the box it is drawn in. */
export const FRAME_ASPECT = `${frameWidth} / ${frameHeight}`

/**
 * The same ratio as a bare number, for CSS math.
 *
 * `aspect-ratio` alone cannot size a box to fit *both* axes of its parent — it
 * needs one dimension to derive the other. Exposing the ratio as a custom
 * property lets the stylesheet compute the largest height that also fits the
 * available width.
 */
export const FRAME_RATIO = frameWidth / frameHeight

// ------------------------------------------------------------ orientation

const [lx, ly, lw, lh] = manifest.frameLandscape.window as [number, number, number, number]
const [landscapeWidth, landscapeHeight] = manifest.frameLandscape.size as [number, number]

/** The same frame turned a quarter-turn, for work wider than it is tall. */
export const FRAME_WINDOW_LANDSCAPE = {
  left: `${(lx * 100).toFixed(3)}%`,
  top: `${(ly * 100).toFixed(3)}%`,
  width: `${(lw * 100).toFixed(3)}%`,
  height: `${(lh * 100).toFixed(3)}%`,
}

export interface FrameShape {
  src: string
  window: typeof FRAME_WINDOW
  /** The frame image's aspect, as a bare number for CSS math. */
  ratio: number
}

const PORTRAIT: FrameShape = {
  src: '/assets/frame.png',
  window: FRAME_WINDOW,
  ratio: FRAME_RATIO,
}

const LANDSCAPE: FrameShape = {
  src: '/assets/frame-landscape.png',
  window: FRAME_WINDOW_LANDSCAPE,
  ratio: landscapeWidth / landscapeHeight,
}

/**
 * Which way up the frame hangs.
 *
 * Chosen by comparing the artwork's own width against its height, so a
 * landscape painting gets a landscape frame instead of being letterboxed into
 * a portrait one — the window is `cover`, so the mismatch was cropping the
 * sides off wide work rather than merely looking wrong.
 *
 * An unknown aspect (nothing measured yet) keeps the portrait frame, which is
 * the shape most of the collection is.
 */
export function frameFor(aspect: number | null): FrameShape {
  return aspect !== null && aspect > 1 ? LANDSCAPE : PORTRAIT
}
