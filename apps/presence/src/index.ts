import { parseRoom } from '@tiny/core/presence/wire'
import type { Env } from './room.ts'

export { Room } from './room.ts'

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    const match = /^\/room\/([^/]+)$/.exec(url.pathname)
    if (!match || !parseRoom(match[1])) return new Response('Not found', { status: 404 })
    if (request.headers.get('Upgrade')?.toLowerCase() !== 'websocket') return new Response('Expected a WebSocket', { status: 426 })
    const origin = request.headers.get('Origin')
    if (!origin || !env.ALLOWED_ORIGINS.split(',').includes(origin)) return new Response('Forbidden', { status: 403 })

    const room = env.ROOM.get(env.ROOM.idFromName(match[1]))
    const headers = new Headers(request.headers)
    headers.set('X-Room', match[1])
    return room.fetch(new Request(request, { headers }))
  },
} satisfies ExportedHandler<Env>
