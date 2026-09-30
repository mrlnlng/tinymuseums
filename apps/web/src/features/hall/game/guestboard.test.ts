import assert from 'node:assert/strict'
import { test } from 'node:test'
import type Phaser from 'phaser'
import { CONFIG } from '../scene/config.ts'
import { PPU } from './view.ts'
import type { GameAssets, GameFrame, GameScenery } from './assets.ts'
import type { GuestBoard as ThreeGuestBoard } from '../scene/guestboard.ts'
import { createGuestBoard, guestBoardGeometry } from './guestboard.ts'

function close(actual: number, expected: number, message: string): void {
  assert.ok(Math.abs(actual - expected) <= 1e-9, `${message}: ${actual} vs ${expected}`)
}

test('guestBoardGeometry matches the Three.js arithmetic', () => {
  const x = 10
  const geometry = guestBoardGeometry(x, { board: 1.5, sitArea: 0.8, plaque: 2 })
  const { board, sign, signText, sitArea, seat } = CONFIG.guestBoard

  const [boardPlane, sign0, sign1, sign2, sitPlane] = geometry.planes
  assert.equal(geometry.planes.length, 5)

  close(boardPlane.x, x + board.dx, 'board x')
  close(boardPlane.y, board.centerY, 'board y')
  close(boardPlane.width, board.width, 'board width')
  close(boardPlane.height, board.width / 1.5, 'board height')
  close(boardPlane.z, board.z, 'board z')
  assert.equal(boardPlane.texture, 'guestBoard')

  const natural = sign.height * 2
  const end = (0.28 - 0) * natural
  const middle = Math.max((0.72 - 0.28) * natural, sign.width - 2 * end)
  const total = 2 * end + middle
  const widths = [end, middle, end]

  let cursor = x + sign.dx - total / 2
  for (const [i, plane] of [sign0, sign1, sign2].entries()) {
    close(plane.x, cursor + widths[i] / 2, `sign${i} x`)
    close(plane.y, sign.centerY, `sign${i} y`)
    close(plane.width, widths[i], `sign${i} width`)
    close(plane.height, sign.height, `sign${i} height`)
    close(plane.z, sign.z, `sign${i} z`)
    assert.equal(plane.texture, 'plaque')
    assert.deepEqual(plane.slice, [[0, 0.28], [0.28, 0.72], [0.72, 1]][i])
    cursor += widths[i]
  }

  close(sitPlane.x, x + sitArea.dx, 'sit x')
  close(sitPlane.y, sitArea.centerY, 'sit y')
  close(sitPlane.width, sitArea.height * 0.8, 'sit width')
  close(sitPlane.height, sitArea.height, 'sit height')
  close(sitPlane.z, sitArea.z, 'sit z')
  assert.equal(sitPlane.texture, 'sitArea')

  assert.deepEqual(geometry.mark, { x: x + board.dx, y: board.centerY, width: board.width })
  assert.deepEqual(geometry.signMark, {
    x: x + signText.dx,
    y: signText.centerY,
    width: signText.width,
  })
  assert.deepEqual(geometry.seat, { x: x + seat.dx, y: seat.centerY, height: seat.height })
})

interface FakeImage {
  x: number
  y: number
  key: string
  frame: string | undefined
  width: number
  height: number
  depth: number
  flipX: boolean
  destroyed: boolean
  setDisplaySize(width: number, height: number): FakeImage
  setDepth(depth: number): FakeImage
  destroy(): void
}

const CUT = {
  sourceIndex: 0,
  cutX: 0,
  cutY: 0,
  cutWidth: 100,
  cutHeight: 100,
  source: { image: {} },
}

function fakeScene(): { scene: Phaser.Scene; images: FakeImage[] } {
  const images: FakeImage[] = []
  const texture = {
    has: () => false,
    add: () => undefined,
  }
  const scene = {
    add: {
      image(x: number, y: number, key: string, frame?: string): FakeImage {
        const image: FakeImage = {
          x,
          y,
          key,
          frame,
          width: 0,
          height: 0,
          depth: 0,
          flipX: false,
          destroyed: false,
          setDisplaySize(width: number, height: number): FakeImage {
            image.width = width
            image.height = height
            return image
          },
          setDepth(depth: number): FakeImage {
            image.depth = depth
            return image
          },
          destroy(): void {
            image.destroyed = true
          },
        }
        images.push(image)
        return image
      },
    },
    textures: {
      getFrame: () => CUT,
      get: () => texture,
    },
  }
  return { scene: scene as unknown as Phaser.Scene, images }
}

const FRAMES: Record<string, GameFrame> = {
  plaque: { key: 'atlas-entrance-0', frame: 'plaque', aspect: 2 },
  'guestboard/board-hall': { key: 'atlas-scenery-0', frame: 'guestboard/board-hall', aspect: 1.5 },
  'guestboard/sit-area': { key: 'atlas-scenery-0', frame: 'guestboard/sit-area', aspect: 0.8 },
}

function fakeAssets(): GameAssets {
  return { frameOf: (file: string) => FRAMES[file] } as unknown as GameAssets
}

function fakeScenery(): GameScenery {
  return { frameOf: (file: string) => FRAMES[file] } as unknown as GameScenery
}

function pointAt(u: number, v: number): { x: number; y: number } {
  const { sitArea } = CONFIG.guestBoard
  const left = 10.072 - (sitArea.height * 0.8) / 2
  const bottom = sitArea.centerY - sitArea.height / 2
  return { x: left + u * sitArea.height * 0.8, y: bottom + v * sitArea.height }
}

test('createGuestBoard draws the same planes, marks and hit tests without a browser', () => {
  const { scene, images } = fakeScene()
  const board = createGuestBoard(scene, fakeAssets(), fakeScenery(), 10)

  const compatible: ThreeGuestBoard = board
  assert.equal(compatible.x, 10)

  assert.equal(images.length, 5)
  assert.deepEqual(images.map((image) => image.key), [
    'atlas-scenery-0',
    'atlas-entrance-0',
    'atlas-entrance-0',
    'atlas-entrance-0',
    'atlas-scenery-0',
  ])
  assert.deepEqual(images.map((image) => image.depth), [0.3, 0.2, 0.2, 0.2, 0.35])
  close(images[0].x, 10 * PPU, 'board image x')
  close(images[0].y, -CONFIG.guestBoard.board.centerY * PPU, 'board image y')
  close(images[0].width, CONFIG.guestBoard.board.width * PPU, 'board image width')
  close(images[4].x, (10 + CONFIG.guestBoard.sitArea.dx) * PPU, 'sit image x')

  assert.deepEqual(board.mark, { x: 10, y: 1.93, width: 3 })
  assert.deepEqual(board.signMark, { x: 9.973, y: 3.47, width: 1.515 })
  assert.deepEqual(board.seat, { x: 8.881, y: 0.893, height: 1.455 })

  assert.equal(board.hitTestAt({ x: 10, y: 1.93 }), true)
  assert.equal(board.hitTestAt({ x: 13.1, y: 1.93 }), false)

  assert.equal(board.hitTestBeanbagAt(pointAt(0.2, 0.3), false), true)
  assert.equal(board.hitTestBeanbagAt(pointAt(0.2, 0.7), false), false)
  assert.equal(board.hitTestBeanbagAt(pointAt(0.2, 0.7), true), true)
  assert.equal(board.hitTestBeanbagAt(pointAt(0.2, 0.9), true), false)
  assert.equal(board.hitTestBeanbagAt(pointAt(0.5, 0.3), false), false)

  assert.equal(board.hitTestDesktopAt(pointAt(0.7, 0.5)), true)
  assert.equal(board.hitTestDesktopAt(pointAt(0.7, 0.7)), false)
  assert.equal(board.hitTestDesktopAt(pointAt(0.5, 0.5)), false)

  board.dispose()
  assert.equal(images.filter((image) => image.destroyed).length, 5)
})
