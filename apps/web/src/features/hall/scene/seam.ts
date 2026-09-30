import * as THREE from 'three'
import type { Cafe } from './cafe'
import type { GuestBoard } from './guestboard'
import type { Lobby } from './lobby'
import type { WorldPoint } from './hit'
import type { Projector } from './projector'
import type { HallScene, PieceHit } from './scene'

export interface SeamResult {
  world: WorldPoint
  mismatches: string[]
}

export interface SeamDeps {
  canvas: HTMLCanvasElement
  camera: THREE.Camera
  projector: () => Projector
  hall: HallScene
  lobby: Lobby
  cafe: () => Cafe | null
  guestBoard: () => GuestBoard | null
}

declare global {
  interface Window {
    __hallSeam?: (clientX: number, clientY: number) => SeamResult
    __hallSeamWorld?: (clientX: number, clientY: number) => WorldPoint
  }
}

function describePainting(hit: PieceHit | null): string {
  return hit ? `${hit.mounted.index}:${hit.pieceId}` : 'null'
}

export function installSeam(deps: SeamDeps): () => void {
  const raycaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2()

  function rayAt(clientX: number, clientY: number): THREE.Raycaster {
    const rect = deps.canvas.getBoundingClientRect()
    pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1
    pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1
    raycaster.setFromCamera(pointer, deps.camera)
    return raycaster
  }

  function worldAt(clientX: number, clientY: number): WorldPoint {
    const rect = deps.canvas.getBoundingClientRect()
    return deps.projector().toWorld(clientX - rect.left, clientY - rect.top)
  }

  function evaluate(clientX: number, clientY: number): SeamResult {
    const ray = rayAt(clientX, clientY)
    const world = worldAt(clientX, clientY)
    const at = `${clientX},${clientY}`
    const mismatches: string[] = []

    const expect = (name: string, rayValue: boolean, worldValue: boolean): void => {
      if (rayValue !== worldValue) mismatches.push(`${name} ray=${rayValue} world=${worldValue} @ ${at}`)
    }

    expect('door', deps.lobby.hitTestDoor(ray), deps.lobby.hitTestDoorAt(world))
    expect('lobby-cat', deps.lobby.hitTestCat(ray), deps.lobby.hitTestCatAt(world))

    const rayPainting = deps.hall.hitTest(ray)
    const worldPainting = deps.hall.hitTestAt(world)
    if (
      (rayPainting === null) !== (worldPainting === null) ||
      (rayPainting !== null &&
        worldPainting !== null &&
        (rayPainting.mounted.index !== worldPainting.mounted.index || rayPainting.pieceId !== worldPainting.pieceId))
    ) {
      mismatches.push(`painting ray=${describePainting(rayPainting)} world=${describePainting(worldPainting)} @ ${at}`)
    }

    const rayPedestal = deps.hall.hitTestPedestal(ray)
    const worldPedestal = deps.hall.hitTestPedestalAt(world)
    if (rayPedestal !== worldPedestal) {
      mismatches.push(`pedestal ray=${rayPedestal?.index ?? 'null'} world=${worldPedestal?.index ?? 'null'} @ ${at}`)
    }

    expect('coin', deps.hall.hitTestCoinRay(ray), deps.hall.hitTestCoinAt(world))

    const cafe = deps.cafe()
    if (cafe) {
      expect('cafe-cat', cafe.hitTestCat(ray), cafe.hitTestCatAt(world))
      expect('cafe-matcha', cafe.hitTestMatcha(ray), cafe.hitTestMatchaAt(world))
    }

    const guestBoard = deps.guestBoard()
    if (guestBoard) {
      expect('guest-board', guestBoard.hitTest(ray), guestBoard.hitTestAt(world))
      expect('beanbag-free', guestBoard.hitTestBeanbag(ray, false), guestBoard.hitTestBeanbagAt(world, false))
      expect('beanbag-occupied', guestBoard.hitTestBeanbag(ray, true), guestBoard.hitTestBeanbagAt(world, true))
      expect('desktop', guestBoard.hitTestDesktop(ray), guestBoard.hitTestDesktopAt(world))
    }

    return { world, mismatches }
  }

  window.__hallSeam = evaluate
  window.__hallSeamWorld = worldAt

  return () => {
    delete window.__hallSeam
    delete window.__hallSeamWorld
  }
}
