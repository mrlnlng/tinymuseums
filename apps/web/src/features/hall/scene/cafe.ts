import * as THREE from 'three'
import type { Assets } from './assets'
import { disposeBoards, plane, type Mark } from './board'
import { pickPainted } from './hit'
import { CONFIG } from './config'

/*  The museum cafe — a rest stop along the walk, where the visitor can pause
    between paintings. Unlike the visitor centre and the gift shop it is not a
    terminus: it stands mid-hall past the tenth painting (or past the last one
    when the hall is shorter), and the exhibition continues on the other side
    of it. Like the shop it is scenery rather than art: the counter with its
    painted front, the hanging sign, the menu board, the poster that links out
    to the artist's coffee fund — and the waving cat on the counter, four
    frames playing the way the artist's GIF played.

    It is built the same way the gift shop is: not with the rest of the scene,
    but the first frame the layout can say where it goes — the hall arrives a
    slice at a time, and until enough of it has landed there is no tenth
    painting (or no last painting) for the cafe to stand past. */

export interface CafeMarks {
  /*  The rectangle the "buy us a coffee" poster occupies — the room's one
      control. */
  poster: Mark & { height: number }
}

export interface Cafe {
  /** Where the room is centred; everything in it is measured against this. */
  x: number
  marks: CafeMarks
  /** Whether a tap landed on the cat herself, who says hello when it does. */
  hitTestCat(raycaster: THREE.Raycaster): boolean
  /** Advances the waving cat, at the pace its frames were drawn at. */
  update(dt: number, cameraX: number): void
  dispose(): void
}

export function createCafe(scene: THREE.Scene, assets: Assets, x: number): Cafe {
  const { counter, sign, menu, poster, cat, catFrameMs } = CONFIG.cafe
  const group = new THREE.Group()

  // --- the counter front ----------------------------------------------------
  const counterMesh = plane(
    counter.height * assets.aspect.cafeFront,
    counter.height,
    assets.textures.cafeFront,
    x + counter.dx,
    counter.centerY,
    counter.z,
  )
  group.add(counterMesh)

  // --- the hanging sign -----------------------------------------------------
  /*  The sign is the artist's own painted board (no alpha), so unlike the
      museum's boards it is hung as the single plane it was drawn as, at a
      width of its own choosing. */
  group.add(
    plane(
      sign.width,
      sign.width / assets.aspect.cafeSign,
      assets.textures.cafeSign,
      x + sign.dx,
      sign.centerY,
      sign.z,
    ),
  )

  // --- the menu board -------------------------------------------------------
  group.add(
    plane(
      menu.height * assets.aspect.cafeMenu,
      menu.height,
      assets.textures.cafeMenu,
      x + menu.dx,
      menu.centerY,
      menu.z,
    ),
  )

  // --- the "buy us a coffee" poster -----------------------------------------
  group.add(
    plane(
      poster.height * assets.aspect.cafePoster,
      poster.height,
      assets.textures.cafePoster,
      x + poster.dx,
      poster.centerY,
      poster.z,
    ),
  )

  // --- the waving cat -------------------------------------------------------
  /*  A mesh of its own rather than one more plane in the group's static list:
      its material's map is swapped as the frames play. The four textures belong
      to the loader, so disposal gives back only the geometry and material. */
  const catFrames = assets.cafeCat.map((s) => s.texture)
  const catAspect = assets.cafeCat[0]?.aspect ?? 1
  const catMesh = plane(
    cat.height * catAspect,
    cat.height,
    catFrames[0],
    x + cat.dx,
    cat.feetY + cat.height / 2,
    cat.z,
  )
  const catMaterial = catMesh.material as THREE.MeshBasicMaterial
  group.add(catMesh)

  scene.add(group)

  let catElapsed = 0
  let catFrame = 0

  return {
    x,

    /*  The counter is offered to the pick alongside the cat, and it stands in
        front of her: everything below the desk line is drawn on the cat's
        sprite but covered by the counter's, so a tap down there picks the
        counter and the cat stays quiet. Only her head and the waving paw,
        which is all the visitor can actually see, say hello. */
    hitTestCat(raycaster: THREE.Raycaster): boolean {
      return pickPainted(raycaster, [counterMesh, catMesh])?.object === catMesh
    },

    marks: {
      poster: {
        x: x + poster.dx,
        y: poster.centerY,
        width: poster.height * assets.aspect.cafePoster,
        height: poster.height,
      },
    },

    update(dt, cameraX) {
      /*  The frames only matter once the visitor is close enough to see them,
          and the cafe is a room the visitor may spend most of a visit far
          from. The gate is generous — the swap itself is cheap; the point is
          not to spin the animation of a room that is off-screen. */
      const far = Math.abs(cameraX - x) > CONFIG.virtualization.mountRadiusUnits + 2
      if (far || catFrames.length === 0) return

      catElapsed += dt
      const next = Math.floor(catElapsed / (catFrameMs / 1000)) % catFrames.length
      if (next !== catFrame) {
        catFrame = next
        catMaterial.map = catFrames[catFrame]
      }
    },

    dispose() {
      // The counter's shared texture belongs to the loader; the cat's frames do
      // too. Only the geometry and materials go with the group.
      disposeBoards(scene, group)
    },
  }
}
