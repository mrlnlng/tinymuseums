import assert from 'node:assert/strict'
import { test } from 'node:test'
import { CONFIG } from './config.ts'
import { comingSoonWidth, computeLayout } from './layout.ts'

test('the wall run starts after the lobby', () => {
  const widths = [0.9, 1.3, 0.6]
  const layout = computeLayout(widths)
  assert.equal(layout.centerX.length, widths.length)
  assert.equal(layout.known, widths.length)
  assert.equal(layout.centerX[0], CONFIG.lobby.length + widths[0] / 2)
})

test('display centres strictly increase', () => {
  const widths = [0.9, 1.3, 0.6, 2.2, 1.1]
  for (const complete of [false, true]) {
    const { centerX } = computeLayout(widths, complete)
    for (let i = 1; i < centerX.length; i++) {
      assert.ok(centerX[i] > centerX[i - 1], `index ${i}`)
    }
  }
})

test('the same input gives the same layout', () => {
  const widths = [1.1, 0.7, 1.9]
  assert.deepEqual(computeLayout(widths), computeLayout(widths))
  assert.deepEqual(computeLayout(widths, true), computeLayout(widths, true))
})

test('totalLength clears the last display', () => {
  const widths = [1.1, 0.7, 1.9]
  const layout = computeLayout(widths)
  const last = widths.length - 1
  const end = layout.centerX[last] + widths[last] / 2
  assert.ok(layout.totalLength > end)
  assert.ok(Math.abs(layout.totalLength - (end + CONFIG.piece.gap)) < 1e-9)
  const expected =
    CONFIG.lobby.length +
    widths.reduce((a, b) => a + b, 0) +
    widths.length * CONFIG.piece.gap
  assert.ok(Math.abs(layout.totalLength - expected) < 1e-9)
})

test('an incomplete hall has no landmarks', () => {
  const layout = computeLayout([1, 2, 3])
  assert.equal(layout.giftShopX, null)
  assert.equal(layout.cafeX, null)
  assert.equal(layout.guestBoardX, null)
  assert.equal(layout.comingSoonX, null)
})

test('no displays leaves just the lobby', () => {
  const layout = computeLayout([])
  assert.deepEqual(layout.centerX, [])
  assert.deepEqual(layout.pedestalX, [])
  assert.equal(layout.known, 0)
  assert.equal(layout.totalLength, CONFIG.lobby.length + CONFIG.piece.gap)
  assert.equal(layout.giftShopX, null)
  assert.equal(layout.cafeX, null)
  assert.equal(layout.guestBoardX, null)
  assert.equal(layout.comingSoonX, null)
})

test('a complete hall with no displays puts the coming-soon wall after the lobby', () => {
  const layout = computeLayout([], true)
  assert.equal(layout.known, 0)
  assert.deepEqual(layout.centerX, [])
  assert.equal(layout.comingSoonX, CONFIG.lobby.length + comingSoonWidth() / 2)
  assert.notEqual(layout.cafeX, null)
  assert.notEqual(layout.guestBoardX, null)
  assert.notEqual(layout.giftShopX, null)
  assert.equal(layout.totalLength, layout.giftShopX)
})

test('comingSoonWidth is the scaled coming-soon canvas', () => {
  assert.equal(comingSoonWidth(), CONFIG.comingSoon.canvas.w * CONFIG.piece.scale)
})

test('the guest board follows the cafe', () => {
  const layout = computeLayout([1, 2, 3], true)
  assert.equal(
    layout.guestBoardX,
    layout.cafeX! + CONFIG.cafe.trail + CONFIG.guestBoard.lead,
  )
})

test('the gift shop ends the hall', () => {
  const layout = computeLayout([1, 2, 3], true)
  assert.equal(
    layout.giftShopX,
    layout.guestBoardX! + CONFIG.guestBoard.trail + CONFIG.giftShop.length,
  )
  assert.equal(layout.totalLength, layout.giftShopX)
})

test('landmarks follow every display and the coming-soon wall', () => {
  const widths = [1, 2, 3]
  const cw = comingSoonWidth()
  const cursor =
    CONFIG.lobby.length +
    widths.reduce((a, b) => a + b, 0) +
    widths.length * CONFIG.piece.gap +
    cw
  const cafeX = cursor + CONFIG.cafe.lead
  const guestBoardX = cafeX + CONFIG.cafe.trail + CONFIG.guestBoard.lead
  const giftShopX = guestBoardX + CONFIG.guestBoard.trail + CONFIG.giftShop.length
  const layout = computeLayout(widths, true)
  assert.equal(layout.known, widths.length)
  assert.ok(Math.abs(layout.comingSoonX! - (cursor - cw / 2)) < 1e-9)
  assert.ok(Math.abs(layout.cafeX! - cafeX) < 1e-9)
  assert.ok(Math.abs(layout.guestBoardX! - guestBoardX) < 1e-9)
  assert.ok(Math.abs(layout.giftShopX! - giftShopX) < 1e-9)
  assert.equal(layout.totalLength, layout.giftShopX)
})

test('the cafe follows the coming-soon wall until the tenth display', () => {
  const nine = Array.from({ length: 9 }, () => 1)
  const ten = Array.from({ length: 10 }, () => 1)
  const a = computeLayout(nine, true)
  const b = computeLayout(ten, true)
  assert.ok(a.cafeX! > a.comingSoonX!)
  assert.ok(b.cafeX! < b.comingSoonX!)
})

test('a complete hall with more than ten displays pins the cafe to the tenth wall', () => {
  const first = Array.from({ length: 10 }, () => 1)
  const ten = computeLayout(first, true)
  const eleven = computeLayout([...first, 5], true)
  assert.equal(ten.centerX.length, 10)
  assert.equal(eleven.centerX.length, 11)
  assert.equal(ten.cafeX, eleven.cafeX)
  assert.notEqual(ten.giftShopX, eleven.giftShopX)
})

test('an incomplete hall with more than ten displays still places the cafe', () => {
  const first = Array.from({ length: 10 }, () => 1)
  const eleven = computeLayout([...first, 3])
  const tenComplete = computeLayout(first, true)
  assert.equal(eleven.centerX.length, 11)
  assert.notEqual(eleven.cafeX, null)
  assert.notEqual(eleven.guestBoardX, null)
  assert.equal(eleven.giftShopX, null)
  assert.equal(eleven.comingSoonX, null)
  assert.equal(eleven.cafeX, tenComplete.cafeX)
})
