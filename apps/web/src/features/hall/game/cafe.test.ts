import assert from 'node:assert/strict'
import { test } from 'node:test'
import { CONFIG } from '../scene/config.ts'
import type { GameFrame } from './assets.ts'
import { cafeCatFrame, cafeGeometry, type CafeScenery } from './cafe.ts'

const ASPECT = {
  cafeFront: 1.75,
  cafeSign: 1.2,
  cafeMenu: 1.5,
  cafePoster: 0.8,
  cafeThanks: 1.1,
}

const CAT_ASPECT = 0.75

function frame(name: string, aspect: number): GameFrame {
  return { key: 'atlas-scenery-0', frame: name, aspect }
}

const scenery: CafeScenery = {
  aspect: ASPECT,
  frameOf: (file) => frame(file.replace(/\.(png|svg)$/, ''), ASPECT.cafeFront),
  cafeCat: [1, 2, 3, 4].map((n) => frame(`cafe/cat-${n}`, CAT_ASPECT)),
}

test('cafeGeometry copies the Three arithmetic for every plane and the poster mark', () => {
  const x = 10
  const geometry = cafeGeometry(scenery, x)
  const { counter, sign, menu, poster, thanks, cat } = CONFIG.cafe
  const counterWidth = counter.height * ASPECT.cafeFront

  assert.equal(geometry.counterWidth, counterWidth)
  assert.deepEqual(geometry.planes.counter, {
    key: 'atlas-scenery-0',
    frame: 'cafe/front',
    width: counterWidth,
    height: counter.height,
    x: x + counter.dx,
    y: counter.centerY,
    z: counter.z,
  })
  assert.deepEqual(geometry.planes.sign, {
    key: 'atlas-scenery-0',
    frame: 'cafe/sign-removebg',
    width: sign.width,
    height: sign.width / ASPECT.cafeSign,
    x: x + sign.dx,
    y: sign.centerY,
    z: sign.z,
  })
  assert.deepEqual(geometry.planes.menu, {
    key: 'atlas-scenery-0',
    frame: 'cafe/menu',
    width: menu.height * ASPECT.cafeMenu,
    height: menu.height,
    x: x + menu.dx,
    y: menu.centerY,
    z: menu.z,
  })
  assert.deepEqual(geometry.planes.poster, {
    key: 'atlas-scenery-0',
    frame: 'cafe/buy-matcha',
    width: poster.height * ASPECT.cafePoster,
    height: poster.height,
    x: x + poster.dx,
    y: poster.centerY,
    z: poster.z,
  })
  assert.deepEqual(geometry.planes.thanks, {
    key: 'atlas-scenery-0',
    frame: 'cafe/thanks-board',
    width: thanks.height * ASPECT.cafeThanks,
    height: thanks.height,
    x: x + thanks.dx,
    y: thanks.centerY,
    z: thanks.z,
  })
  assert.deepEqual(geometry.planes.cat, {
    key: 'atlas-scenery-0',
    frame: 'cafe/cat-1',
    width: cat.height * CAT_ASPECT,
    height: cat.height,
    x: x + cat.dx,
    y: cat.feetY + cat.height / 2,
    z: cat.z,
  })
  assert.deepEqual(geometry.marks, {
    poster: {
      x: x + poster.dx,
      y: poster.centerY,
      width: poster.height * ASPECT.cafePoster,
      height: poster.height,
    },
  })
})

test('cafeCatFrame advances on the catFrameMs grid and wraps', () => {
  assert.equal(cafeCatFrame(0, 200, 4), 0)
  assert.equal(cafeCatFrame(0.199, 200, 4), 0)
  assert.equal(cafeCatFrame(0.2, 200, 4), 1)
  assert.equal(cafeCatFrame(0.599, 200, 4), 2)
  assert.equal(cafeCatFrame(0.8, 200, 4), 0)
  assert.equal(cafeCatFrame(1.0, 200, 4), 1)
  assert.equal(cafeCatFrame(0.129, 130, 6), 0)
  assert.equal(cafeCatFrame(0.13, 130, 6), 1)
  assert.equal(cafeCatFrame(0.79, 130, 6), 0)
  assert.equal(cafeCatFrame(1.0, 130, 6), 1)
})
