import assert from 'node:assert/strict'
import { test } from 'node:test'
import type Phaser from 'phaser'
import { CONFIG } from '../scene/config.ts'
import type { Attachment } from '../scene/carried.ts'
import type { Character, Pose } from '../scene/character.ts'
import type { Projector } from '../scene/projector.ts'
import { createCarriedSprite, type HomePoint } from './carried.ts'
import { toPhaser, PPU } from './view.ts'

function close(actual: number, expected: number, message: string): void {
  assert.ok(Math.abs(actual - expected) <= 1e-6, `${message}: ${actual} vs ${expected}`)
}

function image(src: string, width: number, height: number): HTMLImageElement {
  return { src, naturalWidth: width, naturalHeight: height } as HTMLImageElement
}

interface FakeSprite {
  x: number
  y: number
  width: number
  height: number
  angle: number
  flipX: boolean
  visible: boolean
  depth: number
  destroyed: boolean
  setOrigin(x: number, y: number): FakeSprite
  setDepth(depth: number): FakeSprite
  setVisible(visible: boolean): FakeSprite
  setPosition(x: number, y: number): FakeSprite
  setDisplaySize(width: number, height: number): FakeSprite
  setAngle(angle: number): FakeSprite
  setFlipX(flip: boolean): FakeSprite
  getBounds(): { x: number; y: number; width: number; height: number }
  destroy(): void
}

function fakeScene(): {
  scene: Phaser.Scene
  sprite: FakeSprite
  textures: Set<string>
  removed: string[]
} {
  const textures = new Set<string>()
  const removed: string[] = []
  const sprite: FakeSprite = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    angle: 0,
    flipX: false,
    visible: true,
    depth: 0,
    destroyed: false,
    setOrigin: () => sprite,
    setDepth(depth) {
      sprite.depth = depth
      return sprite
    },
    setVisible(visible) {
      sprite.visible = visible
      return sprite
    },
    setPosition(x, y) {
      sprite.x = x
      sprite.y = y
      return sprite
    },
    setDisplaySize(width, height) {
      sprite.width = width
      sprite.height = height
      return sprite
    },
    setAngle(angle) {
      sprite.angle = angle
      return sprite
    },
    setFlipX(flip) {
      sprite.flipX = flip
      return sprite
    },
    getBounds() {
      const rad = (sprite.angle * Math.PI) / 180
      const c = Math.abs(Math.cos(rad))
      const s = Math.abs(Math.sin(rad))
      const width = sprite.width * c + sprite.height * s
      const height = sprite.width * s + sprite.height * c
      return { x: sprite.x - width / 2, y: sprite.y - height / 2, width, height }
    },
    destroy() {
      sprite.destroyed = true
    },
  }
  const scene = {
    add: { image: () => sprite },
    textures: {
      exists: (key: string) => textures.has(key),
      addImage: (key: string) => {
        textures.add(key)
        return {}
      },
      remove: (key: string) => {
        textures.delete(key)
        removed.push(key)
      },
    },
  } as unknown as Phaser.Scene
  return { scene, sprite, textures, removed }
}

function fakeProjector(cameraX = 0, centerY = 0): Projector {
  const viewWidth = 4
  const viewHeight = 6.4
  const width = 400
  const height = 640
  return {
    viewWidth,
    viewHeight,
    pxPerUnit: width / viewWidth,
    viewport: { width, height, left: 0, top: 0 },
    toScreen(x, y) {
      return {
        x: width * (0.5 + (x - cameraX) / viewWidth),
        y: height * (0.5 - (y - centerY) / viewHeight),
      }
    },
    toWorld(screenX, screenY) {
      return {
        x: cameraX + (screenX / width - 0.5) * viewWidth,
        y: centerY - (screenY / height - 0.5) * viewHeight,
      }
    },
  }
}

function fakeCharacter(pose: Pose): Character {
  return {
    attach: (_attachment: Attachment, out: Pose) => {
      out.x = pose.x
      out.y = pose.y
      out.width = pose.width
      out.rotation = pose.rotation
      out.flip = pose.flip
      return out
    },
  } as unknown as Character
}

const attachment: Attachment = {
  facing: 'left',
  width: 50,
  walk: { x: 0, y: 0, rotation: 0 },
  idle: { x: 0, y: 0, rotation: -9.2 },
  sit: { x: 0, y: 0, rotation: 0, width: 40, flip: -1 },
}

function flightPose(from: Pose, to: Pose, progress: number, viewportHeight: number): Pose {
  const { arcLift, spin } = CONFIG.carry
  const t = progress < 0.5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2
  const u = 1 - t
  const controlX = (from.x + to.x) / 2
  const controlY = Math.min(from.y, to.y) - 2 * arcLift * viewportHeight
  return {
    x: u * u * from.x + 2 * u * t * controlX + t * t * to.x,
    y: u * u * from.y + 2 * u * t * controlY + t * t * to.y,
    width: from.width + (to.width - from.width) * t,
    flip: t < 0.5 ? from.flip : to.flip,
    rotation: from.rotation + (to.rotation - from.rotation) * t + (to.x >= from.x ? 1 : -1) * spin * 360 * t,
  }
}

test('createCarriedSprite flies, holds and returns on the DOM arithmetic', () => {
  const { scene, sprite, textures, removed } = fakeScene()
  const projector = fakeProjector()
  const home = (out: HomePoint): number => {
    out.x = 1
    out.y = 0.5
    out.z = 0
    return 2
  }
  const carried = createCarriedSprite(scene, 'helm', image('helm.png', 100, 150), attachment, home)

  assert.equal(carried.state, 'away')
  assert.equal(sprite.visible, false)
  assert.equal(sprite.depth, CONFIG.character.z + 0.01)
  assert.ok(textures.has('helm.png'))

  const onBunny: Pose = { x: 200, y: 308, width: 50, rotation: -9.2, flip: -1 }
  const character = fakeCharacter(onBunny)

  carried.take()
  assert.equal(carried.state, 'to-bunny')
  assert.equal(sprite.visible, true)

  carried.update(0, character, projector)
  const atHomeScreen = projector.toScreen(1, 0.5)
  const atHomeWidth = (2 * projector.viewport.height) / projector.viewHeight
  const homePose: Pose = { x: atHomeScreen.x, y: atHomeScreen.y, width: atHomeWidth, rotation: 0, flip: 1 }
  const start = carried.stats()
  close(start.x, homePose.x - homePose.width / 2, 'home start x')
  close(start.y, homePose.y - (homePose.width * 1.5) / 2, 'home start y')
  close(start.width, homePose.width, 'home start width')
  assert.equal(start.visible, true)
  assert.equal(start.rotation, 0)

  carried.update(CONFIG.carry.flightSeconds / 2, character, projector)
  const mid = flightPose(homePose, onBunny, 0.5, projector.viewport.height)
  const midPoint = projector.toWorld(mid.x, mid.y)
  const midPosition = toPhaser(midPoint.x, midPoint.y)
  const midWidth = (mid.width / projector.pxPerUnit) * PPU
  close(sprite.x, midPosition.x, 'mid sprite x')
  close(sprite.y, midPosition.y, 'mid sprite y')
  close(sprite.width, midWidth, 'mid sprite width')
  close(sprite.height, midWidth * 1.5, 'mid sprite height')
  close(sprite.angle, mid.rotation * mid.flip, 'mid angle')
  assert.equal(sprite.flipX, true)
  assert.equal(carried.state, 'to-bunny')

  carried.update(CONFIG.carry.flightSeconds / 2, character, projector)
  assert.equal(carried.state, 'held')
  carried.update(0, character, projector)

  const point = projector.toWorld(onBunny.x, onBunny.y)
  const position = toPhaser(point.x, point.y)
  const displayWidth = (onBunny.width / projector.pxPerUnit) * PPU
  close(sprite.x, position.x, 'held sprite x')
  close(sprite.y, position.y, 'held sprite y')
  close(sprite.width, displayWidth, 'held sprite width')
  close(sprite.height, displayWidth * 1.5, 'held sprite height')
  close(sprite.angle, onBunny.rotation * onBunny.flip, 'held angle')
  assert.equal(sprite.flipX, true)

  const held = carried.stats()
  assert.equal(held.state, 'held')
  assert.equal(held.name, 'helm')
  assert.equal(held.rotation, -9.2)
  assert.equal(held.flip, -1)
  assert.equal(held.visible, true)

  carried.conceal(true)
  assert.equal(carried.stats().visible, false)
  carried.conceal(false)
  assert.equal(carried.stats().visible, true)

  carried.giveBack()
  assert.equal(carried.state, 'back')
  const returned = carried.update(CONFIG.carry.flightSeconds * 2, character, projector)
  assert.equal(returned, true)
  assert.equal(carried.state, 'away')
  assert.equal(sprite.visible, false)

  carried.dispose()
  assert.equal(sprite.destroyed, true)
  assert.ok(removed.includes('helm.png'))
  assert.deepEqual([...textures], [])
})
