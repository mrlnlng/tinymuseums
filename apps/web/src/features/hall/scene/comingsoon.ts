import * as THREE from 'three'
import type { Assets, Scenery } from './assets'
import { disposeBoards, plane, ropeSlices, type Mark } from './board'
import { CONFIG } from './config'
import { comingSoonWidth } from './layout'

export interface ComingSoon {
  noteMark: Mark
  dispose(): void
}

export function createComingSoon(scene: THREE.Scene, assets: Assets, scenery: Scenery, x: number): ComingSoon {
  const { note } = CONFIG.comingSoon
  const width = comingSoonWidth()
  const height = width / scenery.aspect.comingSoon
  const group = new THREE.Group()
  group.position.x = x

  group.add(plane(width, height, scenery.textures.comingSoon, 0, CONFIG.displayBottomY + height / 2, 0))
  for (const slice of ropeSlices(assets.textures.rope, assets.aspect.rope, width, 'ownedByBoard')) {
    group.add(slice)
  }
  scene.add(group)

  return {
    noteMark: { x: x + note.dx, y: note.centerY, width: note.width },
    dispose() {
      disposeBoards(scene, group)
    },
  }
}
