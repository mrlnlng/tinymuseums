import assert from 'node:assert/strict'
import { test } from 'node:test'
import { CONFIG } from '../scene/config.ts'
import { catFrameAt, lobbyGeometry, type LobbyAssets, type LobbyFrame } from './lobby.ts'

const DOOR: LobbyFrame = { key: 'atlas', frame: 'door', aspect: 0.75 }
const PLAQUE: LobbyFrame = { key: 'atlas', frame: 'plaque', aspect: 2 }
const BOOTH: LobbyFrame = { key: 'atlas', frame: 'help-center', aspect: 0.8 }
const CAT: LobbyFrame = { key: 'atlas', frame: 'help/cat-1', aspect: 1.25 }

const assets: LobbyAssets = {
  aspect: { door: DOOR.aspect, plaque: PLAQUE.aspect, helpCenter: BOOTH.aspect },
  helpCat: [CAT],
  frameOf(fileOrStem) {
    if (fileOrStem === 'door.png') return DOOR
    if (fileOrStem === 'plaque.png') return PLAQUE
    if (fileOrStem === 'help-center.png') return BOOTH
    throw new Error(fileOrStem)
  },
}

function close(actual: number, expected: number, message: string): void {
  assert.ok(Math.abs(actual - expected) <= 1e-12, `${message}: ${actual} vs ${expected}`)
}

test('catFrameAt steps at catFrameMs and wraps', () => {
  assert.equal(catFrameAt(0, 6, 1000), 0)
  assert.equal(catFrameAt(0.999, 6, 1000), 0)
  assert.equal(catFrameAt(1, 6, 1000), 1)
  assert.equal(catFrameAt(5.5, 6, 1000), 5)
  assert.equal(catFrameAt(6, 6, 1000), 0)
  assert.equal(catFrameAt(7.25, 6, 1000), 1)
  assert.equal(catFrameAt(0.13, 6, 130), 1)
  assert.equal(catFrameAt(0.39, 6, 130), 3)
})

test('lobbyGeometry marks mirror the Three arithmetic', () => {
  const { sign, post } = CONFIG.lobby
  const { marks } = lobbyGeometry(assets)
  const postHeight = post.top - post.foot
  const perUnit = post.width / 240

  assert.deepEqual(marks.sign, { x: sign.x, y: sign.centerY, width: sign.width * 0.76 })
  close(marks.direction.x, post.x + (120 - 120) * perUnit, 'direction.x')
  close(marks.direction.y, post.top - 88 * (postHeight / 233), 'direction.y')
  close(marks.direction.width, 190 * perUnit, 'direction.width')
})

test('lobbyGeometry planes carry the Three positions, sizes, depths and frames', () => {
  const { door, sign, post, booth, cat } = CONFIG.lobby
  const { planes } = lobbyGeometry(assets)
  const byName = new Map(planes.map((plane) => [plane.name, plane]))
  const postHeight = post.top - post.foot

  assert.deepEqual(
    planes.map((plane) => plane.name),
    ['door', 'sign-0', 'sign-1', 'sign-2', 'post', 'booth', 'cat'],
  )

  const doorPlane = byName.get('door')!
  assert.deepEqual(
    [doorPlane.x, doorPlane.y, doorPlane.z, doorPlane.width, doorPlane.height],
    [door.x, door.centerY, door.z, door.height * DOOR.aspect, door.height],
  )
  assert.deepEqual([doorPlane.key, doorPlane.frame], [DOOR.key, DOOR.frame])

  const postPlane = byName.get('post')!
  assert.deepEqual(
    [postPlane.x, postPlane.y, postPlane.z, postPlane.width, postPlane.height],
    [post.x, post.foot + postHeight / 2, post.z, post.width, postHeight],
  )
  assert.equal(postPlane.frame, '__BASE')

  const boothPlane = byName.get('booth')!
  assert.deepEqual(
    [boothPlane.x, boothPlane.y, boothPlane.z, boothPlane.width, boothPlane.height],
    [booth.x, booth.centerY, booth.z, booth.height * BOOTH.aspect, booth.height],
  )

  const catPlane = byName.get('cat')!
  assert.deepEqual(
    [catPlane.x, catPlane.y, catPlane.z, catPlane.width, catPlane.height],
    [booth.x + cat.dx, cat.centerY, cat.z, cat.height * CAT.aspect, cat.height],
  )

  const cuts = [0, 0.28, 0.72, 1]
  const natural = sign.height * PLAQUE.aspect
  const ends = [(cuts[1] - cuts[0]) * natural, (cuts[3] - cuts[2]) * natural]
  const middle = Math.max((cuts[2] - cuts[1]) * natural, sign.width - ends[0] - ends[1])
  const widths = [ends[0], middle, ends[1]]
  const total = widths[0] + widths[1] + widths[2]
  let cursor = sign.x - total / 2
  for (let i = 0; i < 3; i++) {
    const slice = byName.get(`sign-${i}`)!
    close(slice.width, widths[i], `sign width ${i}`)
    close(slice.x, cursor + widths[i] / 2, `sign x ${i}`)
    assert.equal(slice.height, sign.height)
    assert.equal(slice.y, sign.centerY)
    assert.equal(slice.z, sign.z)
    assert.equal(slice.frame, `plaque~${cuts[i]}~${cuts[i + 1]}`)
    cursor += widths[i]
  }
})
