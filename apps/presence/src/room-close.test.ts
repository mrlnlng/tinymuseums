import assert from 'node:assert/strict'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { build } from 'esbuild'
import { newAttachment } from './room-logic.ts'

// Exercise the actual Durable Object close callback under Node, with only the
// Cloudflare base class replaced. The room logic and broadcasts are the real code.
const bundle = await build({
  entryPoints: [fileURLToPath(new URL('./room.ts', import.meta.url))],
  bundle: true, write: false, platform: 'node', format: 'esm',
  plugins: [{
    name: 'durable-object-test-host',
    setup(builder) {
      builder.onResolve({ filter: /^cloudflare:workers$/ }, () => ({ path: 'workers', namespace: 'test-host' }))
      builder.onLoad({ filter: /.*/, namespace: 'test-host' }, () => ({
        contents: 'export class DurableObject { constructor(ctx, env) { this.ctx = ctx; this.env = env } }',
      }))
    },
  }],
})
const { Room } = await import(`data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text).toString('base64')}`)

function socket(pid: string, holding = false) {
  let attachment = { ...newAttachment('pond-s0', 0, 'test'), pid, holds: holding ? ['pond-spot-2' as const] : [] }
  const replies: unknown[] = []
  const closes: { code: number; reason: string }[] = []
  return {
    replies, closes,
    deserializeAttachment: () => attachment,
    serializeAttachment: (next: typeof attachment) => { attachment = next },
    send: (text: string) => replies.push(JSON.parse(text)),
    close: (code: number, reason: string) => closes.push({ code, reason }),
  }
}

test('a departing visitor receives a close reply and releases its spot exactly once', async () => {
  const leaving = socket('pidAAAA01000', true)
  const staying = socket('pidBBBB01000')
  const room = new Room({ getWebSockets: () => [leaving, staying] }, {})
  await room.webSocketClose(leaving, 1000, 'bye')
  assert.deepEqual(leaving.closes, [{ code: 1000, reason: 'bye' }])
  assert.deepEqual(staying.replies, [
    { t: 'leave', pid: 'pidAAAA01000' },
    { t: 'held', item: 'pond-spot-2', pid: null },
  ])
  await room.webSocketClose(leaving, 1000, 'bye')
  assert.equal(leaving.closes.length, 1)
  assert.equal(staying.replies.length, 2)
})

test('an abnormal browser close is acknowledged with a sendable close code', async () => {
  const leaving = socket('pidAAAA01001')
  const room = new Room({ getWebSockets: () => [leaving] }, {})
  await room.webSocketClose(leaving, 1006, '')
  assert.equal(leaving.closes[0].code, 1000)
})
