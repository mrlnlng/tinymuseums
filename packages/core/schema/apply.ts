import { readFile, readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { closePool, transaction } from '../src/infra/db.ts'
import { repoRoot } from '../src/infra/env.ts'

const SCHEMA_DIR = join(repoRoot, 'packages/core/schema')

// Serialises concurrent deploys; any constant shared by every build works.
const LOCK_KEY = 7_311_824

async function main(): Promise<void> {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set; refusing to guess which database to change.')
  }

  const files = (await readdir(SCHEMA_DIR)).filter((f) => f.endsWith('.sql')).sort()
  // economy.sql references members(id), so it runs right after members.sql and before zz_once.sql.
  const economy = files.filter((filename) => filename === 'economy.sql')
  const ordered = files.filter((filename) => filename !== 'economy.sql')
  const afterMembers = ordered.indexOf('members.sql') + 1
  ordered.splice(afterMembers > 0 ? afterMembers : ordered.length, 0, ...economy)

  for (const filename of ordered) {
    const sql = await readFile(join(SCHEMA_DIR, filename), 'utf8')
    await transaction(async (client) => {
      await client.query('select pg_advisory_xact_lock($1)', [LOCK_KEY])
      await client.query(sql)
    })
    console.log(`[schema] applied ${filename}`)
  }
}

main()
  .catch((error: unknown) => {
    console.error('[schema] failed:', error)
    process.exitCode = 1
  })
  .finally(() => closePool())
