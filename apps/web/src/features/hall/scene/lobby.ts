import * as THREE from 'three'
import type { Assets } from './assets'
import { CONFIG } from './config'

/*  The visitor centre: the first thing at the head of the hall, and the only
    part of it that is scenery rather than art. The door the visitor came in
    by (and can leave by), the board hung over it, a way-finder pointing at the
    exhibition, and the help booth.

    It is built once and never unmounted. The hall virtualises walls because
    there is no limit to how many there are; there is exactly one visitor
    centre, and four planes are cheaper to leave standing than to manage. */

/** A world-space rectangle a piece of overlay text is written inside. */
export interface Mark {
  x: number
  y: number
  width: number
}

export interface LobbyMarks {
  /** The board over the door. */
  sign: Mark
  /** The way-finder's panel. */
  direction: Mark
  /** The pill on the booth's counter. */
  help: Mark & { height: number }
}

export interface Lobby {
  marks: LobbyMarks
  /** True when the ray lands on the door — the way back to the entrance. */
  hitTestDoor(raycaster: THREE.Raycaster): boolean
  dispose(): void
}

/*  The way-finder, drawn rather than photographed: the art pack has a door and
    a booth but no signpost, so this is one, in the museum's own hand — a dark
    outline, painted wood, and a board that leans a degree off true because
    nothing here is drawn with a ruler. The text on it is not in here; it is
    real DOM, like every other word in the hall.

    Sized in a 240x233 box, which is the world rectangle it fills, so a
    position in here converts to world units by one scale factor. */
const POST_BOX = { width: 240, height: 233 }
const POST_PANEL = { x: 120, y: 88, width: 190 }

const POST_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 233">
  <g fill="#c06a12" stroke="#5d3218" stroke-width="6" stroke-linejoin="round">
    <path d="M105 2h30l4 229h-38z"/>
    <g transform="rotate(-1.6 120 88)">
      <path d="M12 16h216a9 9 0 0 1 9 9v118a9 9 0 0 1-9 9H12a9 9 0 0 1-9-9V25a9 9 0 0 1 9-9z"/>
      <path d="M23 29h194a5 5 0 0 1 5 5v100a5 5 0 0 1-5 5H23a5 5 0 0 1-5-5V34a5 5 0 0 1 5-5z" fill="#fae3c0" stroke-width="0"/>
      <g fill="#5d3218" stroke-width="0">
        <circle cx="32" cy="43" r="4.5"/><circle cx="208" cy="43" r="4.5"/>
        <circle cx="32" cy="125" r="4.5"/><circle cx="208" cy="125" r="4.5"/>
      </g>
    </g>
  </g>
</svg>`

function svgTexture(svg: string): THREE.Texture {
  const texture = new THREE.TextureLoader().load(
    `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`,
  )
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  return texture
}

function plane(
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

export function createLobby(scene: THREE.Scene, assets: Assets): Lobby {
  const { door, sign, post, booth, helpButton } = CONFIG.lobby
  const group = new THREE.Group()

  // --- the door ------------------------------------------------------------
  const doorMesh = plane(
    door.height * assets.aspect.door,
    door.height,
    assets.textures.door,
    door.x,
    door.centerY,
    door.z,
  )
  group.add(doorMesh)

  /*  The board over it. It is drawn half as wide again as plaque.png, so it is
      cut into three and only the middle stretches: the cuts fall inside the
      board's plain field, which keeps the painted ends — and the pegs in their
      corners — at the proportions they were drawn at. The rope on every wall
      is built the same way, for the same reason. */
  const CUTS = [0, 0.28, 0.72, 1] as const
  const natural = sign.height * assets.aspect.plaque
  const ends = [(CUTS[1] - CUTS[0]) * natural, (CUTS[3] - CUTS[2]) * natural]
  const middle = Math.max((CUTS[2] - CUTS[1]) * natural, sign.width - ends[0] - ends[1])
  const widths = [ends[0], middle, ends[1]]
  const total = widths[0] + widths[1] + widths[2]

  let cursor = sign.x - total / 2
  for (let i = 0; i < 3; i++) {
    const slice = assets.textures.plaque.clone()
    slice.repeat.set(CUTS[i + 1] - CUTS[i], 1)
    slice.offset.set(CUTS[i], 0)
    slice.userData.ownedByLobby = true
    slice.needsUpdate = true
    group.add(
      plane(widths[i], sign.height, slice, cursor + widths[i] / 2, sign.centerY, sign.z),
    )
    cursor += widths[i]
  }

  // --- the way-finder ------------------------------------------------------
  const postHeight = post.top - post.foot
  const postTexture = svgTexture(POST_SVG)
  postTexture.userData.ownedByLobby = true
  const postMesh = plane(
    post.width,
    postHeight,
    postTexture,
    post.x,
    post.foot + postHeight / 2,
    post.z,
  )
  group.add(postMesh)

  // --- the help booth ------------------------------------------------------
  group.add(
    plane(
      booth.height * assets.aspect.helpCenter,
      booth.height,
      assets.textures.helpCenter,
      booth.x,
      booth.centerY,
      booth.z,
    ),
  )

  scene.add(group)

  // The way-finder's panel, converted out of the box the SVG was drawn in.
  const perUnit = post.width / POST_BOX.width
  const marks: LobbyMarks = {
    sign: { x: sign.x, y: sign.centerY, width: sign.width * 0.76 },
    direction: {
      x: post.x + (POST_PANEL.x - POST_BOX.width / 2) * perUnit,
      y: post.top - POST_PANEL.y * (postHeight / POST_BOX.height),
      width: POST_PANEL.width * perUnit,
    },
    help: {
      x: booth.x,
      y: booth.centerY + helpButton.dy,
      width: helpButton.width,
      height: helpButton.height,
    },
  }

  return {
    marks,

    hitTestDoor(raycaster) {
      return raycaster.intersectObject(doorMesh, false).length > 0
    },

    dispose() {
      scene.remove(group)
      group.traverse((obj) => {
        if (!(obj instanceof THREE.Mesh)) return
        obj.geometry.dispose()
        const material = obj.material as THREE.MeshBasicMaterial
        // The shared scenery textures belong to the loader; the sliced board
        // and the drawn signpost belong to this.
        if (material.map?.userData.ownedByLobby) material.map.dispose()
        material.dispose()
      })
    },
  }
}
