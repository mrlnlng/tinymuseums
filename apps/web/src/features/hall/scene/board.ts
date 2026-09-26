import * as THREE from 'three'

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
    const slice = texture.clone()
    slice.repeat.set(CUTS[i + 1] - CUTS[i], 1)
    slice.offset.set(CUTS[i], 0)
    slice.userData.ownedByBoard = true
    slice.needsUpdate = true
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
