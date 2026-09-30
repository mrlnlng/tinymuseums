import assert from 'node:assert/strict'
import { test } from 'node:test'
import type Phaser from 'phaser'
import { CONFIG } from '../scene/config.ts'
import type { Projector } from '../scene/projector.ts'
import type { Attachment } from '../scene/carried.ts'
import type { GameAssets } from './assets.ts'
import { PPU, toPhaser } from './view.ts'
import { createSpriteCharacter } from './character.ts'

function close(actual: number, expected: number, message: string): void {
  assert.ok(Math.abs(actual - expected) <= 1e-9, `${message}: ${actual} vs ${expected}`)
}

function image(src: string, width: number, height: number): HTMLImageElement {
  return { src, naturalWidth: width, naturalHeight: height } as HTMLImageElement
}

interface FakeSprite {
  texture: string
  x: number
  y: number
  width: number
  height: number
  depth: number
  destroyed: boolean
  setOrigin(x: number, y: number): FakeSprite
  setDepth(depth: number): FakeSprite
  setTexture(key: string): FakeSprite
  setPosition(x: number, y: number): FakeSprite
  setDisplaySize(width: number, height: number): FakeSprite
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
    texture: '',
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    depth: 0,
    destroyed: false,
    setOrigin: () => sprite,
    setDepth(depth) {
      sprite.depth = depth
      return sprite
    },
    setTexture(key) {
      sprite.texture = key
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
    getBounds: () => ({
      x: sprite.x - sprite.width / 2,
      y: sprite.y - sprite.height / 2,
      width: sprite.width,
      height: sprite.height,
    }),
    destroy() {
      sprite.destroyed = true
    },
  }
  const scene = {
    add: {
      image: (_x: number, _y: number, key: string) => {
        sprite.texture = key
        return sprite
      },
    },
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
    toWorld() {
      return { x: 0, y: 0 }
    },
  }
}

function idleAssets(): GameAssets {
  return {
    bunnyIdle: { left: image('idle-left', 100, 150), right: image('idle-right', 100, 150) },
    walk: { left: [], right: [image('walk-1', 100, 150), image('walk-2', 100, 150)] },
  } as unknown as GameAssets
}

const attachment: Attachment = {
  facing: 'right',
  width: 200,
  walk: { x: 40, y: 100, rotation: 3 },
  idle: { x: 30, y: 110, rotation: -2 },
  sit: { x: 50, y: 120, rotation: 5, width: 60, flip: -1 },
}

test('createSpriteCharacter places, animates and reports the DOM arithmetic', () => {
  const { scene, sprite } = fakeScene()
  const assets = idleAssets()
  const character = createSpriteCharacter(scene, assets)
  const projector = fakeProjector()

  assert.equal(sprite.texture, 'idle-right')
  assert.equal(sprite.depth, CONFIG.character.z)
  assert.equal(character.idleImage, assets.bunnyIdle.right)

  character.update(0.5, 0, 0, projector)

  const heightPx = (CONFIG.character.height / projector.viewHeight) * projector.viewport.height
  const scale = heightPx / 150
  const position = toPhaser(0, CONFIG.character.centerY)
  close(sprite.x, position.x, 'sprite x')
  close(sprite.y, position.y, 'sprite y')
  close(sprite.height, CONFIG.character.height * PPU, 'sprite display height')
  close(sprite.width, CONFIG.character.height * PPU * (100 / 150), 'sprite display width')

  const out = character.attach(attachment, { x: 0, y: 0, width: 0, rotation: 0, flip: 0 })
  close(out.x, 200 + (attachment.idle.x - 50) * scale, 'idle attach x')
  close(out.y, 308 + (attachment.idle.y - 75) * scale, 'idle attach y')
  close(out.width, attachment.width * scale, 'idle attach width')
  close(out.rotation, attachment.idle.rotation, 'idle attach rotation')

  const rect = character.bunny()
  close(rect.x + rect.width / 2, 200, 'bunny centre x')
  close(rect.width, sprite.width, 'bunny width')
  close(rect.height, sprite.height, 'bunny height')
  assert.equal(rect.src, 'idle-right')
})

test('walk frames arrive later and the perch image becomes a texture', () => {
  const { scene, sprite, textures, removed } = fakeScene()
  const assets = idleAssets()
  const character = createSpriteCharacter(scene, assets)

  character.update(1, 0, -2, fakeProjector())
  assert.equal(sprite.texture, 'idle-left')

  assets.walk.left.push(image('walk-left-1', 100, 150))
  character.update(0, 0, -2, fakeProjector())
  assert.equal(sprite.texture, 'walk-left-1')

  const sit = image('sit-helm', 120, 160)
  character.perch({ image: sit, x: 1, y: 2, height: 3, seated: true })
  character.update(0.5, 0, 0, fakeProjector())
  assert.equal(sprite.texture, 'sit-helm')
  assert.equal(character.idleImage, assets.bunnyIdle.left)

  const out = character.attach(attachment, { x: 0, y: 0, width: 0, rotation: 0, flip: 0 })
  const seatedScale = ((3 / 6.4) * 640) / 160
  close(out.x, 300 + (50 - 60) * seatedScale, 'seated x')
  close(out.width, attachment.sit.width * seatedScale, 'seated width')
  close(out.rotation, attachment.sit.rotation, 'seated rotation')
  assert.equal(out.flip, attachment.sit.flip)

  assert.ok(textures.has('sit-helm'))
  character.dispose()
  assert.equal(sprite.destroyed, true)
  assert.ok(removed.includes('idle-right'))
  assert.ok(removed.includes('sit-helm'))
  assert.deepEqual([...textures], [])
})
