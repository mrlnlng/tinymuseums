import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  EASY_REEL_NOTE,
  HOOK_TUTORIAL_COPY,
  hookTutorialNeeded,
  idleHint,
  idlePrompt,
} from './copy.ts'

test('the first cast keeps its invitation; every later one asks to cast again', () => {
  assert.deepEqual(idlePrompt(true, 'first'), { label: 'Cast', sub: 'Tap to start' })
  assert.deepEqual(idlePrompt(true, 'again'), { label: 'Cast again', sub: 'Tap to cast again' })
  assert.deepEqual(idlePrompt(true, 'caught'), { label: 'Keep fishing', sub: 'Tap to cast again' })

  for (const stage of ['again', 'caught'] as const) {
    const prompt = idlePrompt(true, stage)
    assert.ok(!prompt.sub.includes('Tap to start'), prompt.sub)
    assert.ok(`${prompt.label} ${prompt.sub}`.toLowerCase().includes('cast'), prompt.sub)
  }

  assert.deepEqual(idlePrompt(false, 'first'), { label: 'Cast', sub: 'Hold to charge' })
  assert.deepEqual(idlePrompt(false, 'again'), { label: 'Cast again', sub: 'Hold to cast again' })
  assert.equal(idleHint(true, 'first'), 'Tap anywhere to cast')
  assert.equal(idleHint(true, 'again'), 'Tap anywhere to cast again')
})

test('the first-hook tip is shown once and then remembered', () => {
  assert.equal(hookTutorialNeeded(null), true)
  assert.equal(hookTutorialNeeded(''), true)
  assert.equal(hookTutorialNeeded('1'), false)
  assert.match(HOOK_TUTORIAL_COPY.toLowerCase(), /green zone/)
})

test('the easy reel note explains the green zone in plain words', () => {
  assert.match(EASY_REEL_NOTE, /green zone/i)
  assert.match(EASY_REEL_NOTE, /easier/i)
  assert.ok(!/safe band|gentler runs/i.test(EASY_REEL_NOTE))
})
