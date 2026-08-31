/* Local Postgres: embedded-postgres runs the real binaries as the current user on the same port as docker-compose, so DATABASE_URL is identical either way. Runs in the foreground; Ctrl-C stops it cleanly. */

import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import EmbeddedPostgres from 'embedded-postgres'

const DATA_DIR = resolve('./.data/pgdata')
const PORT = 5433
const DATABASE = 'tiny_museum'

const postgres = new EmbeddedPostgres({
  databaseDir: DATA_DIR,
  user: 'tiny',
  password: 'tiny',
  port: PORT,
  persistent: true,
})

const firstRun = !existsSync(DATA_DIR)
if (firstRun) {
  console.log('[db] initialising a new cluster in .data/pgdata')
  await postgres.initialise()
}

await postgres.start()

try {
  await postgres.createDatabase(DATABASE)
  console.log(`[db] created database ${DATABASE}`)
} catch {
  // Already there from a previous run.
}

console.log(`[db] postgres ready on port ${PORT} — leave this running`)

let stopping = false
async function shutdown(): Promise<void> {
  if (stopping) return
  stopping = true
  console.log('\n[db] stopping')
  await postgres.stop()
  process.exit(0)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)

// Hold the process open.
await new Promise<void>(() => {})
