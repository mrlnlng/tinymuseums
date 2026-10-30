/* Database integration tests: recreates a throwaway database, applies db/migrations and the idempotent schema (twice), then runs packages/core/db-tests against it. */

import { spawnSync } from 'node:child_process'
import { readFile, readdir } from 'node:fs/promises'
import pg from 'pg'

const url = process.env.TEST_DATABASE_URL
if (!url) {
  console.error(
    '[test:db] TEST_DATABASE_URL is not set. Point it at a throwaway database, e.g.\n' +
      '  TEST_DATABASE_URL=postgres://tiny:tiny@localhost:5433/tiny_museum_test npm run test:db',
  )
  process.exit(1)
}

const target = new URL(url)
const database = decodeURIComponent(target.pathname.slice(1))
if (!/test/i.test(database)) {
  console.error(`[test:db] refusing to recreate "${database}": its name must contain "test".`)
  process.exit(1)
}

const admin = new URL(url)
admin.pathname = '/postgres'
const client = new pg.Client({ connectionString: admin.toString() })
await client.connect()
await client.query(`drop database if exists "${database}" with (force)`)
await client.query(`create database "${database}"`)
await client.end()
console.log(`[test:db] recreated ${database}`)

const fresh = new pg.Client({ connectionString: url })
await fresh.connect()
const migrations = (await readdir('db/migrations')).filter((f) => f.endsWith('.sql')).sort()
for (const file of migrations) {
  await fresh.query(await readFile(`db/migrations/${file}`, 'utf8'))
  console.log(`[test:db] applied ${file}`)
}
await fresh.end()

const childEnv = { ...process.env, DATABASE_URL: url }

function run(label: string, command: string, args: string[]): void {
  console.log(`[test:db] ${label}`)
  const result = spawnSync(command, args, { stdio: 'inherit', env: childEnv })
  if (result.status !== 0) process.exit(result.status ?? 1)
}

run('schema (first pass)', 'npm', ['run', '--silent', 'db:schema'])
run('schema (second pass, idempotence)', 'npm', ['run', '--silent', 'db:schema'])
run('tests', 'node', ['--test', '--test-concurrency=1', 'packages/core/db-tests/**/*.test.ts'])
