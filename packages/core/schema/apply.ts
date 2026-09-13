/* Applies the schema this repository owns, on every deploy: each .sql file beside this one, in filename order. Run from the Amplify build (amplify.yml) and locally with `npm run db:schema`.
 *
 * There is deliberately no ledger of what has run. Production was not built from db/migrations — that folder and its runner are local-only tooling — so there is no trustworthy record to consult, and a ledger that disagreed with the real database would be worse than none. Instead every file must be idempotent: `create table if not exists`, `create index if not exists`, `alter table ... add column if not exists`. Additive changes only; anything destructive is done by hand, deliberately.
 *
 * Bundled with esbuild before it runs (see the db:schema script) because the build image's Node cannot run TypeScript directly, and bundling lets this reuse db.ts — its RDS certificate handling included — rather than keep a second copy. */

import { readFile, readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { closePool, transaction } from '../src/infra/db.ts'
import { repoRoot } from '../src/infra/env.ts'

const SCHEMA_DIR = join(repoRoot, 'packages/core/schema')

// Any constant will do; it only has to be the same for every build, so two
// deploys running at once apply the schema one after the other.
const LOCK_KEY = 7_311_824

async function main(): Promise<void> {
  // env.ts falls back to the local database when DATABASE_URL is unset. Fine
  // for development, but a build missing the variable must fail loudly rather
  // than report success against nothing. (Locally, env.ts has loaded .env by now.)
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set; refusing to guess which database to change.')
  }

  const files = (await readdir(SCHEMA_DIR)).filter((f) => f.endsWith('.sql')).sort()

  for (const filename of files) {
    const sql = await readFile(join(SCHEMA_DIR, filename), 'utf8')
    // One transaction per file: a failure halfway leaves that file's changes out entirely.
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
