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
