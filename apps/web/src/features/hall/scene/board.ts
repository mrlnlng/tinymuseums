import * as THREE from 'three'

/*  The two things the hall's scenery is built out of: a textured quad, and a
    painted board stretched wider than it was drawn.

    Both ends of the hall need the second one — the visitor centre hangs a board
    over its door and the gift shop hangs one over its counter, and plaque.png
    is drawn at half the width either of them wants. */

/*  A world-space rectangle that a piece of overlay text is written inside —
    the paper on a note, the field on a board. The scenery modules hand these
    out and the overlay projects them onto the screen every frame. */
export interface Mark {
  x: number
  y: number
  width: number
}

/** A textured quad in the hall's flat world. Everything here is one of these. */
export function plane(
  width: number,
  height: number,
  map: THREE.Texture,
  x: number,
  y: number,
  z: number,
): THREE.Mesh {
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(width, height),
    new THREE.MeshBasicMaterial({ map, transparent: true }),
  )
  mesh.position.set(x, y, z)
  return mesh
}

/*  Where the cuts fall in plaque.png: inside the board's plain field, clear of
    the painted ends and of the pegs in their corners. */
const CUTS = [0, 0.28, 0.72, 1] as const

/*  A board at whatever width is asked for, without the drawing being stretched
    to reach it: the sprite is cut into three vertical slices and only the
    middle one grows, so the painted ends keep the proportions they were drawn
    at and only the plain field between them gets longer. The rope on every wall
    is built the same way, for the same reason.

    A width the sprite already covers at this height is left alone — the three
    slices simply add back up to the drawing, so the same call handles a board
    that needs no stretching at all. */
export function stretchedBoard(
  texture: THREE.Texture,
  aspect: number,
  x: number,
  y: number,
  z: number,
  width: number,
  height: number,
): THREE.Group {
  const group = new THREE.Group()

  const natural = height * aspect
  const ends = [(CUTS[1] - CUTS[0]) * natural, (CUTS[3] - CUTS[2]) * natural]
  const middle = Math.max((CUTS[2] - CUTS[1]) * natural, width - ends[0] - ends[1])
  const widths = [ends[0], middle, ends[1]]
  const total = widths[0] + widths[1] + widths[2]

  let cursor = x - total / 2
  for (let i = 0; i < 3; i++) {
    const slice = texture.clone()
    slice.repeat.set(CUTS[i + 1] - CUTS[i], 1)
    slice.offset.set(CUTS[i], 0)
    // Cloned per board, because the crop depends on the width: freed with it.
    slice.userData.ownedByBoard = true
    slice.needsUpdate = true
    group.add(plane(widths[i], height, slice, cursor + widths[i] / 2, y, z))
    cursor += widths[i]
  }

  return group
}

/*  Gives back a group built here. The shared scenery textures belong to the
    loader and are left alone; the sliced boards and any drawing made on the
    spot are marked as ours and go with the group. */
export function disposeBoards(scene: THREE.Scene, group: THREE.Group): void {
  scene.remove(group)
  group.traverse((obj) => {
    if (!(obj instanceof THREE.Mesh)) return
    obj.geometry.dispose()
    const material = obj.material as THREE.MeshBasicMaterial
    if (material.map?.userData.ownedByBoard) material.map.dispose()
    material.dispose()
  })
}
