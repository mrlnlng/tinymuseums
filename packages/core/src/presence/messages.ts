import { hasProfanity } from './profanity.ts'

export const MESSAGE_MAX = 100

export type MessageCheck = { ok: true; text: string } | { ok: false; reason: 'empty' | 'long' | 'contact' | 'blocked' }

// Web addresses, with or without a scheme, and emails.
const LINK = /(https?:\/\/|www\.|@|\b[a-z0-9-]+\.(com|net|org|io|app|gg|co|me|ly|xyz|tv|link|dev|art|info|biz|uk|us|ca|de|ru|cn|site|online|shop)\b)/i
// Seven or more digits, allowing the spaces, dots and dashes phone numbers are written with.
const PHONE = /\d(?:[\s.()-]*\d){6,}/

// Control characters, zero-width marks and direction overrides, which could disguise a message.
const INVISIBLE = new RegExp('[\\u0000-\\u001f\\u007f-\\u009f\\u200b-\\u200f\\u2028-\\u202e\\u2066-\\u2069]', 'g')

export function normalizeMessage(raw: string): string {
  return raw.normalize('NFKC').replace(INVISIBLE, ' ').trim().replace(/\s+/gu, ' ')
}

/** The same check in the browser, for an instant answer, and in the room, which decides. */
export function checkMessage(raw: string): MessageCheck {
  const text = normalizeMessage(raw)
  if (text.length === 0) return { ok: false, reason: 'empty' }
  if ([...text].length > MESSAGE_MAX) return { ok: false, reason: 'long' }
  if (LINK.test(text) || PHONE.test(text)) return { ok: false, reason: 'contact' }
  if (hasProfanity(text)) return { ok: false, reason: 'blocked' }
  return { ok: true, text }
}
