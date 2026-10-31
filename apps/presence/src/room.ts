import { DurableObject } from 'cloudflare:workers'
import { PROTOCOL_VERSION, ROOM_CAPACITY, parseClientMessage, verifyTicket, type ServerMessage } from '@tiny/core/presence/wire'
import { HELLO_TIMEOUT_MS, admitted, newAttachment, onMessage, peerOf, type Attachment } from './room-logic.ts'

export interface Env {
  ROOM: DurableObjectNamespace<Room>
  PRESENCE_SECRET: string
  ALLOWED_ORIGINS: string
}

const send = (socket: WebSocket, message: ServerMessage) => {
  try {
    socket.send(JSON.stringify(message))
  } catch {}
}

/** One room instance. Uses the Hibernation API, so an idle room is not billed. */
export class Room extends DurableObject<Env> {
  async fetch(request: Request): Promise<Response> {
    const room = request.headers.get('X-Room') ?? ''
    const [client, server] = Object.values(new WebSocketPair())
    if (this.ctx.getWebSockets().length >= ROOM_CAPACITY) {
      server.accept()
      send(server, { t: 'full' })
      server.close(1013, 'full')
      return new Response(null, { status: 101, webSocket: client })
    }
    this.ctx.acceptWebSocket(server)
    server.serializeAttachment(newAttachment(room, Date.now()))
    if ((await this.ctx.storage.getAlarm()) === null) await this.ctx.storage.setAlarm(Date.now() + HELLO_TIMEOUT_MS)
    return new Response(null, { status: 101, webSocket: client })
  }

  async webSocketMessage(socket: WebSocket, data: string | ArrayBuffer): Promise<void> {
    const attachment = socket.deserializeAttachment() as Attachment
    const message = parseClientMessage(typeof data === 'string' ? data : null)

    if (!attachment.pid) {
      const ticket = message?.t === 'hello' && message.v === PROTOCOL_VERSION ? await verifyTicket(message.ticket, this.env.PRESENCE_SECRET) : null
      const admittedAs = admitted(attachment, ticket)
      if (!admittedAs) {
        send(socket, { t: 'denied' })
        socket.close(1008, 'denied')
        return
      }
      socket.serializeAttachment(admittedAs)
      const peers = this.others(socket)
        .map((other) => peerOf(other.deserializeAttachment() as Attachment))
        .filter((peer) => peer !== null)
      send(socket, { t: 'welcome', pid: admittedAs.pid!, peers })
      return
    }

    const outcome = onMessage(attachment, message, Date.now())
    socket.serializeAttachment(outcome.attachment)
    if (outcome.kind === 'broadcast') {
      const text = JSON.stringify(outcome.message)
      for (const other of this.others(socket)) {
        if ((other.deserializeAttachment() as Attachment).pid) {
          try {
            other.send(text)
          } catch {}
        }
      }
    } else if (outcome.kind === 'close') {
      socket.close(outcome.code, outcome.reason)
      this.departed(socket, outcome.attachment)
    }
  }

  async webSocketClose(socket: WebSocket): Promise<void> {
    this.departed(socket, socket.deserializeAttachment() as Attachment)
  }

  async webSocketError(socket: WebSocket): Promise<void> {
    this.departed(socket, socket.deserializeAttachment() as Attachment)
  }

  /** Closes sockets that never said hello. */
  async alarm(): Promise<void> {
    const now = Date.now()
    let waiting = false
    for (const socket of this.ctx.getWebSockets()) {
      const attachment = socket.deserializeAttachment() as Attachment
      if (attachment.pid) continue
      if (now - attachment.joinedAt >= HELLO_TIMEOUT_MS) socket.close(1008, 'hello timeout')
      else waiting = true
    }
    if (waiting) await this.ctx.storage.setAlarm(now + HELLO_TIMEOUT_MS)
  }

  private others(socket: WebSocket): WebSocket[] {
    return this.ctx.getWebSockets().filter((other) => other !== socket)
  }

  private departed(socket: WebSocket, attachment: Attachment): void {
    if (!attachment.pid) return
    const text = JSON.stringify({ t: 'leave', pid: attachment.pid } satisfies ServerMessage)
    for (const other of this.others(socket)) {
      try {
        other.send(text)
      } catch {}
    }
  }
}
