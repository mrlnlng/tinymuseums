import { createHash } from 'node:crypto'
import { hashPassword, newToken, verifyPassword } from './auth.ts'
import { query, queryOne, transaction } from '../infra/db.ts'
import { SLOTS, docBytes, slotDef, upgrade, type SlotDef } from '../slots/index.ts'

const SESSION_DAYS = 180

// Real bcrypt cost-11 hash: signIn runs the same compare for unknown emails.
const DUMMY_HASH = '$2a$11$1x9yZBLst3sVkTM/tnhhVO4nJG2/S5HWmUpw6wZbgcGqbP3VXgtv.'

export interface Member {
  id: string
  email: string
}

export type Started = { member: Member; token: string; expiresAt: Date }

export function canonicalEmail(raw: string): string {
  return raw.trim().toLowerCase()
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

function validPassword(password: string): boolean {
  return (
    password.length >= 8 &&
    password.length <= 128 &&
    new TextEncoder().encode(password).length <= 72
  )
}

export function validCredentials(email: string, password: string): boolean {
  const canonical = canonicalEmail(email)
  return canonical.length <= 254 && canonical.includes('@') && validPassword(password)
}

async function purgeExpiredSessions(): Promise<void> {
  await query(`delete from member_sessions where expires_at <= now()`)
}

async function startSession(member: Member): Promise<Started> {
  const token = newToken()
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000)
  await query(`insert into member_sessions (token_hash, member_id, expires_at) values ($1, $2, $3)`, [
    hashToken(token),
    member.id,
    expiresAt,
  ])
  return { member, token, expiresAt }
}

export async function signUp(
  email: string,
  password: string,
): Promise<Started | { error: 'invalid' | 'email_taken' }> {
  const canonical = canonicalEmail(email)
  if (!validCredentials(canonical, password)) return { error: 'invalid' }

  const row = await queryOne<{ id: string }>(
    `insert into members (email, password_hash) values ($1, $2)
     on conflict (email) do nothing
     returning id`,
    [canonical, await hashPassword(password)],
  )
  if (!row) return { error: 'email_taken' }

  await purgeExpiredSessions()
  return startSession({ id: row.id, email: canonical })
}

export async function signIn(email: string, password: string): Promise<Started | null> {
  const canonical = canonicalEmail(email)
  const member = await queryOne<{ id: string; email: string; password_hash: string }>(
    `select id, email, password_hash from members where email = $1`,
    [canonical],
  )
  await purgeExpiredSessions()
  const ok = await verifyPassword(password, member ? member.password_hash : DUMMY_HASH)
  if (!member || !ok) return null
  return startSession({ id: member.id, email: member.email })
}

export async function memberForSession(
  token: string | undefined,
): Promise<{ member: Member; expiresAt: Date; renewed: boolean } | null> {
  if (!token) return null
  // One statement: slide expires_at and last_seen_at together when fewer than 90 days
  // remain. Data-modifying CTEs share one snapshot, so RETURNING carries the slid
  // expiry out and the main select reads the pre-slide values.
  const row = await queryOne<{ id: string; email: string; expiresAt: Date; renewed: boolean }>(
    `with sess as (
       select member_id, expires_at, (expires_at < now() + interval '90 days') as renew
         from member_sessions
        where token_hash = $1 and expires_at > now()
     ), slid as (
       update member_sessions s
          set expires_at = now() + interval '180 days'
         from sess
        where s.token_hash = $1 and sess.renew
        returning s.expires_at
     ), seen as (
       update members m
          set last_seen_at = now()
         from sess
        where m.id = sess.member_id and sess.renew
     )
     select m.id, m.email,
            coalesce((select expires_at from slid), sess.expires_at) as "expiresAt",
            sess.renew as renewed
       from sess
       join members m on m.id = sess.member_id`,
    [hashToken(token)],
  )
  if (!row) return null
  return { member: { id: row.id, email: row.email }, expiresAt: row.expiresAt, renewed: row.renewed }
}

export async function signOut(token: string): Promise<void> {
  await query(`delete from member_sessions where token_hash = $1`, [hashToken(token)])
}

export async function changePassword(
  memberId: string,
  keepToken: string,
  current: string,
  next: string,
): Promise<boolean> {
  const member = await queryOne<{ password_hash: string }>(
    `select password_hash from members where id = $1`,
    [memberId],
  )
  if (!member || !(await verifyPassword(current, member.password_hash)) || !validPassword(next)) {
    return false
  }
  await transaction(async (client) => {
    await client.query(`update members set password_hash = $1 where id = $2`, [
      await hashPassword(next),
      memberId,
    ])
    await client.query(`delete from member_sessions where member_id = $1 and token_hash <> $2`, [
      memberId,
      hashToken(keepToken),
    ])
  })
  return true
}

export async function deleteMember(memberId: string, password: string): Promise<boolean> {
  const member = await queryOne<{ password_hash: string }>(
    `select password_hash from members where id = $1`,
    [memberId],
  )
  if (!member || !(await verifyPassword(password, member.password_hash))) return false
  // sessions and slots go with the member via on delete cascade
  await query(`delete from members where id = $1`, [memberId])
  return true
}

export async function readSlots(
  memberId: string,
): Promise<Record<string, { version: number; doc: unknown }>> {
  const rows = await query<{ slot: string; version: number; doc: unknown }>(
    `select slot, version, doc from member_slots where member_id = $1`,
    [memberId],
  )
  const slots: Record<string, { version: number; doc: unknown }> = {}
  for (const row of rows) slots[row.slot] = { version: row.version, doc: row.doc }
  return slots
}

export async function exportMember(memberId: string): Promise<{
  email: string
  createdAt: string
  slots: Record<string, { version: number; doc: unknown; updatedAt: string }>
}> {
  const member = await queryOne<{ email: string; created_at: Date }>(
    `select email, created_at from members where id = $1`,
    [memberId],
  )
  if (!member) throw new Error(`no member with id ${memberId}`)
  const rows = await query<{ slot: string; version: number; doc: unknown; updated_at: Date }>(
    `select slot, version, doc, updated_at from member_slots where member_id = $1`,
    [memberId],
  )
  const slots: Record<string, { version: number; doc: unknown; updatedAt: string }> = {}
  for (const row of rows) {
    slots[row.slot] = { version: row.version, doc: row.doc, updatedAt: row.updated_at.toISOString() }
  }
  return { email: member.email, createdAt: member.created_at.toISOString(), slots }
}

export type MergeResult =
  | { ok: true; version: number; doc: unknown }
  | { ok: false; error: 'unknown_slot' | 'invalid' | 'too_large' | 'version_ahead' }

export async function mergeSlot(
  memberId: string,
  name: string,
  version: number,
  incoming: unknown,
  registry: Record<string, SlotDef<unknown>> = SLOTS,
): Promise<MergeResult> {
  const def = slotDef(name, registry)
  if (!def) return { ok: false, error: 'unknown_slot' }
  if (version > def.version) return { ok: false, error: 'version_ahead' }
  if (docBytes(incoming) > def.maxBytes) return { ok: false, error: 'too_large' }
  const incomingDoc = upgrade(def, version, incoming)
  if (incomingDoc === null) return { ok: false, error: 'invalid' }

  return transaction<MergeResult>(async (client) => {
    await client.query(
      `insert into member_slots (member_id, slot, version, doc) values ($1, $2, $3, $4::jsonb)
       on conflict (member_id, slot) do nothing`,
      [memberId, name, def.version, JSON.stringify(def.empty())],
    )
    // The row now always exists, so the lock below is real.
    const current = await client.query<{ version: number; doc: unknown }>(
      `select version, doc from member_slots
        where member_id = $1 and slot = $2
        for update`,
      [memberId, name],
    )
    if (!current.rows[0]) return { ok: false, error: 'invalid' }
    const stored = upgrade(def, current.rows[0].version, current.rows[0].doc)
    // A stored doc that no longer upgrades is left untouched; the row is not overwritten.
    if (stored === null) return { ok: false, error: 'invalid' }
    const merged = def.merge(stored, incomingDoc)
    await client.query(
      `update member_slots set version = $3, doc = $4::jsonb, updated_at = now()
        where member_id = $1 and slot = $2`,
      [memberId, name, def.version, JSON.stringify(merged)],
    )
    return { ok: true, version: def.version, doc: merged }
  })
}
