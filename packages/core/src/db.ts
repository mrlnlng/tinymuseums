import pg from 'pg'
import { env } from './env.ts'

/**
 * Postgres access. One pool per process.
 *
 * Deliberately plain SQL rather than an ORM: the interesting parts of this
 * schema are keyset cursors, array columns, and SKIP LOCKED job claims, all of
 * which read better as SQL and all of which move to RDS unchanged.
 */

// Return bigint as a number. Safe here — these are ids and counts, nowhere
// near 2^53 — and it keeps epoch ids from arriving as strings.
pg.types.setTypeParser(20, (value) => Number(value))

let pool: pg.Pool | null = null

export function getPool(): pg.Pool {
  if (!pool) {
    pool = new pg.Pool({ connectionString: env.databaseUrl, max: 10 })
    pool.on('error', (error) => {
      console.error('[db] idle client error', error)
    })
  }
  return pool
}

export async function query<T extends pg.QueryResultRow = pg.QueryResultRow>(
  text: string,
  params: unknown[] = [],
): Promise<T[]> {
  const result = await getPool().query<T>(text, params)
  return result.rows
}

export async function queryOne<T extends pg.QueryResultRow = pg.QueryResultRow>(
  text: string,
  params: unknown[] = [],
): Promise<T | null> {
  const rows = await query<T>(text, params)
  return rows[0] ?? null
}

/** Runs fn inside a transaction, rolling back on any throw. */
export async function transaction<T>(fn: (client: pg.PoolClient) => Promise<T>): Promise<T> {
  const client = await getPool().connect()
  try {
    await client.query('begin')
    const result = await fn(client)
    await client.query('commit')
    return result
  } catch (error) {
    await client.query('rollback')
    throw error
  } finally {
    client.release()
  }
}

export async function closePool(): Promise<void> {
  await pool?.end()
  pool = null
}
