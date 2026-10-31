// Web Crypto only, so the Next route (Node) signs and the Cloudflare room verifies with one code path.

export interface Ticket {
  /** Random per tab; never a member id. */
  pid: string
  name: string
  /** Room base, e.g. "hall-e12" or "atelier". */
  room: string
  /** Expiry, ms since the epoch. */
  exp: number
}

export const TICKET_TTL_MS = 10 * 60 * 1000

const encoder = new TextEncoder()
const decoder = new TextDecoder()

function toBase64Url(bytes: Uint8Array): string {
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromBase64Url(text: string): Uint8Array<ArrayBuffer> | null {
  if (!/^[A-Za-z0-9_-]*$/.test(text)) return null
  try {
    const binary = atob(text.replace(/-/g, '+').replace(/_/g, '/'))
    return Uint8Array.from(binary, (char) => char.charCodeAt(0))
  } catch {
    return null
  }
}

type HmacKey = ReturnType<typeof crypto.subtle.importKey>

const keys = new Map<string, HmacKey>()

function keyFor(secret: string): HmacKey {
  let key = keys.get(secret)
  if (!key) {
    key = crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify'])
    keys.set(secret, key)
  }
  return key
}

export async function signTicket(ticket: Ticket, secret: string): Promise<string> {
  const body = toBase64Url(encoder.encode(JSON.stringify(ticket)))
  const signature = await crypto.subtle.sign('HMAC', await keyFor(secret), encoder.encode(body))
  return `${body}.${toBase64Url(new Uint8Array(signature))}`
}

function isTicket(value: unknown): value is Ticket {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  const t = value as Record<string, unknown>
  return (
    Object.keys(t).length === 4 &&
    typeof t.pid === 'string' && /^[A-Za-z0-9_-]{8,32}$/.test(t.pid) &&
    typeof t.name === 'string' && t.name.length > 0 && t.name.length <= 40 &&
    typeof t.room === 'string' && t.room.length <= 40 &&
    typeof t.exp === 'number' && Number.isSafeInteger(t.exp)
  )
}

export async function verifyTicket(token: string, secret: string, now = Date.now()): Promise<Ticket | null> {
  if (token.length > 1024) return null
  const [body, signature, extra] = token.split('.')
  if (!body || !signature || extra !== undefined) return null
  const signatureBytes = fromBase64Url(signature)
  const bodyBytes = fromBase64Url(body)
  if (!signatureBytes || !bodyBytes) return null
  const valid = await crypto.subtle.verify('HMAC', await keyFor(secret), signatureBytes, encoder.encode(body))
  if (!valid) return null
  let ticket: unknown
  try {
    ticket = JSON.parse(decoder.decode(bodyBytes))
  } catch {
    return null
  }
  return isTicket(ticket) && ticket.exp > now ? ticket : null
}
