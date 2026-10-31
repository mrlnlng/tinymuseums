import assert from 'node:assert/strict'
import { test } from 'node:test'
import { isRouted, routeThroughGain, setGainLevel } from './output.ts'

test('routing a faded media element restores native volume and leaves gain in control', () => {
  let sources = 0
  let fail = false
  const gains: { gain: { value: number }; connect(): void }[] = []
  class Context {
    state = 'running'
    destination = {}
    createGain() {
      const gain = { gain: { value: 1 }, connect() {} }
      gains.push(gain)
      return gain
    }
    createMediaElementSource() {
      if (fail) throw new Error('Media routing unavailable')
      sources++
      return { connect() {} }
    }
  }
  const oldWindow = Object.getOwnPropertyDescriptor(globalThis, 'window')
  const oldDocument = Object.getOwnPropertyDescriptor(globalThis, 'document')
  Object.defineProperty(globalThis, 'window', { configurable: true, value: { AudioContext: Context, location: { origin: 'http://localhost:3000', href: 'http://localhost:3000/' } } })
  Object.defineProperty(globalThis, 'document', { configurable: true, value: { addEventListener() {} } })
  try {
    const audio = { src: 'http://localhost:3000/audio/atelier.mp3', volume: 0 } as HTMLMediaElement
    assert.equal(routeThroughGain(audio, 0.38), true)
    assert.equal(audio.volume, 1, 'a playing element must not remain silently attenuated')
    assert.equal(isRouted(audio), true)
    assert.equal(gains[1].gain.value, 0.38)
    setGainLevel(0.45)
    assert.equal(gains[0].gain.value, 0.45)
    assert.equal(audio.volume, 1)

    audio.volume = 0
    assert.equal(routeThroughGain(audio, 0.38), true)
    assert.equal(audio.volume, 1)
    assert.equal(sources, 1, 'an existing media source must not be created twice')

    fail = true
    const fallback = { src: audio.src, volume: 0.12 } as HTMLMediaElement
    assert.equal(routeThroughGain(fallback, 0.38), false)
    assert.equal(fallback.volume, 0.12, 'failed routing retains the native volume mix')
  } finally {
    if (oldWindow) Object.defineProperty(globalThis, 'window', oldWindow)
    else Reflect.deleteProperty(globalThis, 'window')
    if (oldDocument) Object.defineProperty(globalThis, 'document', oldDocument)
    else Reflect.deleteProperty(globalThis, 'document')
  }
})
