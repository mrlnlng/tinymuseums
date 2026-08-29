/**
 * Applies db/migrations/*.sql in filename order, once each.
 *
 * Plain SQL files rather than a migration framework: the schema is the part of
 * this system most likely to be read by someone who is not in this codebase,
 * and it should be readable without learning a DSL first.
 */

import { readFile, readdir } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { closePool, query, transaction } from '../packages/core/src/db.ts'

const MIGRATIONS_DIR = resolve('./db/migrations')

async function waitForDatabase(attempts = 20): Promise<void> {
  for (let i = 0; i < attempts; i++) {
    try {
      await query('select 1')
      return
    } catch (error) {
      if (i === attempts - 1) throw error
      if (i === 0) console.log('[migrate] waiting for postgres...')
      await new Promise((r) => setTimeout(r, 750))
    }
  }
}

await waitForDatabase()

await query(`
  create table if not exists schema_migrations (
    filename   text primary key,
    applied_at timestamptz not null default now()
  )
`)

const applied = new Set(
  (await query<{ filename: string }>('select filename from schema_migrations')).map(
    (r) => r.filename,
  ),
)

const files = (await readdir(MIGRATIONS_DIR)).filter((f) => f.endsWith('.sql')).sort()

let count = 0
for (const filename of files) {
  if (applied.has(filename)) continue

  const sql = await readFile(join(MIGRATIONS_DIR, filename), 'utf8')
  // Each migration is one transaction: a failure halfway leaves nothing behind.
  await transaction(async (client) => {
    await client.query(sql)
    await client.query('insert into schema_migrations (filename) values ($1)', [filename])
  })
  console.log(`[migrate] applied ${filename}`)
  count++
}

console.log(count === 0 ? '[migrate] already up to date' : `[migrate] applied ${count} migration(s)`)
await closePool()
