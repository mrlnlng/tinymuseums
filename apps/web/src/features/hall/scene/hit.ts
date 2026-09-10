import * as THREE from 'three'

/*  Picking in a hall built out of transparent quads.

    Every sprite in this scene is a rectangle with a drawing inside it and a
    good deal of nothing around the drawing — a pedestal is a narrow column in
    a rectangle half again as wide, and the cafe cat is drawn standing in the
    middle of its own. Ray-testing those rectangles is enough to open a
    painting, where the drawing fills its frame, but it is not enough for
    anything the visitor is meant to aim at: the corner of a pedestal's
    rectangle is bare wall, and a tap there is a tap on the wall.

    So a hit is only a hit where the drawing is actually painted. The ray gives
    a rectangle and a point inside it; this reads the alpha the artist drew at
    that point and takes the nearest quad that is not see-through there — which
    also settles overlap for free. The cat stands behind the counter, and the
    counter is opaque where it covers her, so a tap on the counter picks the
    counter and stops. */

/*  A downsampled copy of a drawing's alpha, since the question is only ever
    "is there ink here". A quarter-size grid is far finer than a fingertip and
    costs a few kilobytes per drawing. Kept per image rather than per mesh:
    the five pedestal drawings are shared by every pedestal in the hall. */
const MAX_SIDE = 128

/*  How far the ink is allowed to reach, in grid cells.

    Without this the lyre is almost untappable, and for a reason worth naming:
    it is drawn as an open frame strung with strings a pixel or two wide, so
    most of what reads as "the harp" is the gaps between them. Aiming at the
    middle of it and being told nothing is there is the drawing being taken
    literally when the visitor was aiming at the shape.

    So the ink is spread by a couple of cells before it is asked about, which
    closes the gaps between the strings and leaves a hair of forgiveness around
    every outline. Small on purpose: a cell is about a hundredth of a world
    unit, so this is a few pixels, not a widened target — the bare wall beside
    a pedestal stays bare wall. */
const REACH = 3

interface AlphaMap {
  width: number
  height: number
  data: Uint8Array
}

const alphaMaps = new WeakMap<TexImageSource, AlphaMap | null>()

/*  Anything below this is treated as bare. The art is drawn with soft edges,
    so a threshold rather than a test for zero keeps the very faint outer
    pixels of an antialiased edge from counting as something to tap. */
const OPAQUE_ALPHA = 32

function alphaMapFor(image: TexImageSource): AlphaMap | null {
  const cached = alphaMaps.get(image)
  if (cached !== undefined) return cached

  const map = buildAlphaMap(image)
  alphaMaps.set(image, map)
  return map
}

function buildAlphaMap(image: TexImageSource): AlphaMap | null {
  const source = image as HTMLImageElement
  const sourceWidth = source.naturalWidth ?? source.width
  const sourceHeight = source.naturalHeight ?? source.height
  if (!sourceWidth || !sourceHeight) return null

  const scale = Math.min(1, MAX_SIDE / Math.max(sourceWidth, sourceHeight))
  const width = Math.max(1, Math.round(sourceWidth * scale))
  const height = Math.max(1, Math.round(sourceHeight * scale))

  try {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return null
    ctx.drawImage(source, 0, 0, width, height)

    const { data: rgba } = ctx.getImageData(0, 0, width, height)
    const data = new Uint8Array(width * height)
    for (let i = 0; i < data.length; i++) data[i] = rgba[i * 4 + 3]
    return { width, height, data: spread(data, width, height) }
  } catch {
    // A drawing from another origin taints the canvas and cannot be read
    // back. Nothing in the hall is, but a caller should not be told a lie.
    return null
  }
}

/*  Lets every cell take the strongest alpha within `REACH` of it. Done as two
    passes of a one-dimensional maximum, across and then down, which gives the
    same answer as a square window for a fraction of the reads. */
function spread(source: Uint8Array, width: number, height: number): Uint8Array {
  const across = new Uint8Array(source.length)
  for (let y = 0; y < height; y++) {
    const row = y * width
    for (let x = 0; x < width; x++) {
      let strongest = 0
      const from = Math.max(0, x - REACH)
      const to = Math.min(width - 1, x + REACH)
      for (let k = from; k <= to; k++) strongest = Math.max(strongest, source[row + k])
      across[row + x] = strongest
    }
  }

  const down = new Uint8Array(source.length)
  for (let y = 0; y < height; y++) {
    const from = Math.max(0, y - REACH)
    const to = Math.min(height - 1, y + REACH)
    for (let x = 0; x < width; x++) {
      let strongest = 0
      for (let k = from; k <= to; k++) strongest = Math.max(strongest, across[k * width + x])
      down[y * width + x] = strongest
    }
  }
  return down
}

/*  Whether the drawing on this mesh is painted at the point the ray struck.
    A mesh with no readable drawing answers yes, so picking degrades to the
    plain rectangle rather than becoming untappable. */
function isPaintedAt(hit: THREE.Intersection): boolean {
  if (!hit.uv) return true

  const material = (hit.object as THREE.Mesh).material as THREE.MeshBasicMaterial
  const image = material.map?.image as TexImageSource | undefined
  if (!image) return true

  const map = alphaMapFor(image)
  if (!map) return true

  /*  A plane's V runs up from its lower edge and a bitmap's rows run down from
      its top, so one is the other flipped. */
  const x = Math.min(map.width - 1, Math.max(0, Math.floor(hit.uv.x * map.width)))
  const y = Math.min(map.height - 1, Math.max(0, Math.floor((1 - hit.uv.y) * map.height)))
  return map.data[y * map.width + x] >= OPAQUE_ALPHA
}

/*  The nearest mesh the ray strikes where its drawing is actually painted.
    Candidates are given in no particular order; the raycaster sorts them by
    distance, and the first one with ink at the point of contact wins. */
export function pickPainted(
  raycaster: THREE.Raycaster,
  meshes: readonly THREE.Object3D[],
): THREE.Intersection | null {
  if (meshes.length === 0) return null
  for (const hit of raycaster.intersectObjects(meshes as THREE.Object3D[], false)) {
    if (isPaintedAt(hit)) return hit
  }
  return null
}
