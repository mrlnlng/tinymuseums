import * as THREE from 'three'
import type { Assets } from './assets'
import { disposeBoards, plane, stretchedBoard, type Mark } from './board'
import { CONFIG } from './config'

/*  The visitor centre: the first thing at the head of the hall, and the only
    part of it that is scenery rather than art. The door the visitor came in
    by (and can leave by), the board hung over it, a way-finder pointing at the
    exhibition, and the help booth.

    It is built once and never unmounted. The hall virtualises walls because
    there is no limit to how many there are; there is exactly one visitor
    centre, and four planes are cheaper to leave standing than to manage. */

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
  texture.userData.ownedByBoard = true
  return texture
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

  // The board over it, drawn half as wide again as plaque.png and so built
  // from three slices of it — see `stretchedBoard`.
  group.add(
    stretchedBoard(
      assets.textures.plaque,
      assets.aspect.plaque,
      sign.x,
      sign.centerY,
      sign.z,
      sign.width,
      sign.height,
    ),
  )

  // --- the way-finder ------------------------------------------------------
  const postHeight = post.top - post.foot
  const postTexture = svgTexture(POST_SVG)
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
      // The shared scenery textures belong to the loader; the sliced board and
      // the drawn signpost belong to this, and are marked as such.
      disposeBoards(scene, group)
    },
  }
}
