import assert from 'node:assert/strict'
import { test } from 'node:test'
import { setCostumeVisibility } from './costume-visibility.ts'

test('equipping a bow never hides an unnamed eye, and removing the dress restores its chest bow', () => {
  const eye = { visible: true, userData: {} }
  const chestBow = { visible: true, userData: {} }
  const bow = { visible: false, userData: { part: 'bow', hides: '' } }
  const dress = { visible: false, userData: { part: 'body', hides: ' bowtie, , ' } }
  const costumes = new Map([['kiki', [bow, dress]]])
  const hidden = new Set<typeof eye>()
  const find = (name: string) => name === '' ? eye : name === 'bowtie' ? chestBow : undefined
  setCostumeVisibility(costumes, hidden, find, null, 'kiki')
  assert.equal(eye.visible, true)
  assert.equal(chestBow.visible, true)
  setCostumeVisibility(costumes, hidden, find, 'kiki', 'kiki')
  assert.equal(eye.visible, true)
  assert.equal(chestBow.visible, false)
  setCostumeVisibility(costumes, hidden, find, null, null)
  assert.equal(eye.visible, true)
  assert.equal(chestBow.visible, true)
})
