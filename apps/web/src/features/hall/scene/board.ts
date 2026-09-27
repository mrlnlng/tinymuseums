import * as THREE from 'three'
import { CONFIG } from './config'

export interface Mark {
  x: number
  y: number
  width: number
}

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

// A horizontal slice of a texture that may itself be a region of an atlas.
export function sliceOf(texture: THREE.Texture, from: number, to: number): THREE.Texture {
  const slice = texture.clone()
  slice.repeat.set((to - from) * texture.repeat.x, texture.repeat.y)
  slice.offset.set(texture.offset.x + from * texture.repeat.x, texture.offset.y)
  slice.needsUpdate = true
  return slice
}

const CUTS = [0, 0.28, 0.72, 1] as const

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
    const slice = sliceOf(texture, CUTS[i], CUTS[i + 1])
    slice.userData.ownedByBoard = true
    group.add(plane(widths[i], height, slice, cursor + widths[i] / 2, y, z))
    cursor += widths[i]
  }

  return group
}

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

const ROPE_CUTS = [0, 0.24, 0.78, 1] as const

export function ropeSlices(
  texture: THREE.Texture,
  aspect: number,
  span: number,
  owner: 'ownedByDisplay' | 'ownedByBoard',
): THREE.Mesh[] {
  const { height, centerY, z } = CONFIG.rope
  const naturalWidth = height * aspect
  const ends = [
    (ROPE_CUTS[1] - ROPE_CUTS[0]) * naturalWidth,
    (ROPE_CUTS[3] - ROPE_CUTS[2]) * naturalWidth,
  ]
  const middle = Math.max((ROPE_CUTS[2] - ROPE_CUTS[1]) * naturalWidth, span - ends[0] - ends[1])
  const widths = [ends[0], middle, ends[1]]

  let cursorX = -(widths[0] + widths[1] + widths[2]) / 2
  return widths.map((sliceWidth, i) => {
    const map = sliceOf(texture, ROPE_CUTS[i], ROPE_CUTS[i + 1])
    map.userData[owner] = true
    const slice = new THREE.Mesh(
      new THREE.PlaneGeometry(sliceWidth, height),
      new THREE.MeshBasicMaterial({ map, transparent: true, opacity: 1 }),
    )
    slice.position.set(cursorX + sliceWidth / 2, centerY, z)
    cursorX += sliceWidth
    return slice
  })
}
