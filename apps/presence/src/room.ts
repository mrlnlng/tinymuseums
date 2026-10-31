import { DurableObject } from 'cloudflare:workers'
import { PROTOCOL_VERSION, ROOM_CAPACITY, parseClientMessage, verifyTicket, type ServerMessage } from '@tiny/core/presence/wire'
import { SWEEP_MS, admitted, farewell, holdsOf, newAttachment, onMessage, peerOf, roomFull, stale, tooManyWaiting, type Attachment } from './room-logic.ts'

export interface Env {
  ROOM: DurableObjectNamespace<Room>
  PRESENCE_SECRET: string
  ALLOWED_ORIGINS: string
}

const attachmentOf = (socket: WebSocket) => socket.deserializeAttachment() as Attachment

const sendTo = (socket: WebSocket, message: ServerMessage | string) => {
  try {
    socket.send(typeof message === 'string' ? message : JSON.stringify(message))
  } catch {}
}

/** One room instance. Uses the Hibernation API, so an idle room is not billed. */
export class Room extends DurableObject<Env> {
  async fetch(request: Request): Promise<Response> {
    const room = request.headers.get('X-Room') ?? ''
    const ip = request.headers.get('CF-Connecting-IP') ?? ''
    const [client, server] = Object.values(new WebSocketPair())
    const everyone = this.inRoom().map(attachmentOf)
    if (roomFull(everyone, ROOM_CAPACITY) || tooManyWaiting(everyone, ip)) {
      server.accept()
      sendTo(server, { t: 'full' })
      server.close(1013, 'full')
      return new Response(null, { status: 101, webSocket: client })
    }
    this.ctx.acceptWebSocket(server)
    server.serializeAttachment(newAttachment(room, Date.now(), ip))
    if ((await this.ctx.storage.getAlarm()) === null) await this.ctx.storage.setAlarm(Date.now() + SWEEP_MS)
    return new Response(null, { status: 101, webSocket: client })
  }

  async webSocketMessage(socket: WebSocket, data: string | ArrayBuffer): Promise<void> {
    const attachment = attachmentOf(socket)
    if (attachment.gone) return
    const message = parseClientMessage(typeof data === 'string' ? data : null)

    if (!attachment.pid) {
      const ticket = message?.t === 'hello' && message.v === PROTOCOL_VERSION ? await verifyTicket(message.ticket, this.env.PRESENCE_SECRET) : null
      const admittedAs = admitted(attachment, ticket)
      if (!admittedAs) {
        sendTo(socket, { t: 'denied' })
        this.close(socket, attachment, 1008, 'denied')
        return
      }
      // Checked after the await above and before anything else awaits, so two tickets verified
      // at once cannot both take the last place. A reconnecting tab replaces its own place.
      const elsewhere = this.others(socket).map(attachmentOf).filter((other) => other.pid !== admittedAs.pid)
      if (roomFull(elsewhere, ROOM_CAPACITY)) {
        sendTo(socket, { t: 'full' })
        this.close(socket, attachment, 1013, 'full')
        return
      }
      // The same tab reconnecting: the new socket takes over, holds and all, without a leave.
      const holds = new Set(admittedAs.holds)
      for (const twin of this.others(socket)) {
        const old = attachmentOf(twin)
        if (old.pid !== admittedAs.pid || old.gone) continue
        for (const item of old.holds) holds.add(item)
        twin.serializeAttachment({ ...old, gone: true, holds: [] })
        try {
          twin.close(4001, 'replaced')
        } catch {}
      }
      const joined = { ...admittedAs, holds: [...holds], heardAt: Date.now() }
      socket.serializeAttachment(joined)
      const others = this.others(socket).map(attachmentOf)
      const peers = others.map(peerOf).filter((peer) => peer !== null)
      sendTo(socket, { t: 'welcome', pid: joined.pid!, peers, holds: holdsOf([...others, joined]) })
      return
    }

    const outcome = onMessage(attachment, message, Date.now(), this.others(socket).map(attachmentOf))
    socket.serializeAttachment(outcome.attachment)
    if (outcome.send) {
      const { to, message: reply } = outcome.send
      if (to === 'self') sendTo(socket, reply)
      else this.broadcast(reply, to === 'others' ? socket : null)
    }
    if (outcome.close) this.close(socket, outcome.attachment, outcome.close.code, outcome.close.reason)
  }

  async webSocketClose(socket: WebSocket): Promise<void> {
    this.close(socket, attachmentOf(socket))
  }

  async webSocketError(socket: WebSocket): Promise<void> {
    this.close(socket, attachmentOf(socket))
  }

  /** Every 10 s while anyone is connected: closes ghosts and sockets that never said hello. */
  async alarm(): Promise<void> {
    const now = Date.now()
    for (const socket of this.ctx.getWebSockets()) {
      const attachment = attachmentOf(socket)
      if (!attachment.gone && stale(attachment, now)) this.close(socket, attachment, 1001, 'gone quiet')
    }
    if (this.ctx.getWebSockets().some((socket) => !attachmentOf(socket).gone)) await this.ctx.storage.setAlarm(now + SWEEP_MS)
  }

  private inRoom(): WebSocket[] {
    return this.ctx.getWebSockets().filter((socket) => !attachmentOf(socket).gone)
  }

  private others(socket: WebSocket): WebSocket[] {
    return this.inRoom().filter((other) => other !== socket)
  }

  private broadcast(message: ServerMessage, except: WebSocket | null): void {
    const text = JSON.stringify(message)
    for (const socket of this.inRoom()) if (socket !== except && attachmentOf(socket).pid) sendTo(socket, text)
  }

  /** Marks the socket gone first, so whichever close path runs second announces nothing. */
  private close(socket: WebSocket, attachment: Attachment, code?: number, reason?: string): void {
    if (attachment.gone) return
    try {
      socket.serializeAttachment({ ...attachment, gone: true })
    } catch {}
    if (code !== undefined) {
      try {
        socket.close(code, reason)
      } catch {}
    }
    for (const message of farewell(attachment)) this.broadcast(message, socket)
  }
}
