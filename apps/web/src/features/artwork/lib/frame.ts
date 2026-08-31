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
