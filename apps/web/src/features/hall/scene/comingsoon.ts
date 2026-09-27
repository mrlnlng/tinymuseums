import * as THREE from 'three'
import type { Scenery } from './assets'
import { disposeBoards, plane, type Mark } from './board'
import { CONFIG } from './config'
import { comingSoonWidth } from './layout'

export interface ComingSoon {
  noteMark: Mark
  dispose(): void
}

export function createComingSoon(scene: THREE.Scene, scenery: Scenery, x: number): ComingSoon {
  const { note } = CONFIG.comingSoon
  const width = comingSoonWidth()
  const height = width / scenery.aspect.comingSoon
  const group = new THREE.Group()

  group.add(plane(width, height, scenery.textures.comingSoon, x, CONFIG.displayBottomY + height / 2, 0))
  scene.add(group)

  return {
    noteMark: { x: x + note.dx, y: note.centerY, width: note.width },
    dispose() {
      disposeBoards(scene, group)
    },
  }
}
