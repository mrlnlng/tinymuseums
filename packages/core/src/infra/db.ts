import { rootCertificates } from 'node:tls'
import pg from 'pg'
import { env } from './env.ts'
import { RDS_CA_BUNDLE } from './rds-ca.ts'

/* Postgres access, one pool per process. Plain SQL rather than an ORM: keyset cursors, array columns and SKIP LOCKED read better as SQL. */

// bigint comes back as a string by default; these are ids and counts, nowhere
// near 2^53, so parse them as numbers and keep epoch ids from arriving as
// strings.
pg.types.setTypeParser(20, (value) => Number(value))

let pool: pg.Pool | null = null

/* Connection settings, with TLS decided here rather than by the URL: RDS certs are signed by a CA not in Node's trust store, and pg lets the connection string silently override explicit ssl options. Verification stays on unless explicitly waived — this database answers on the public internet. */
function poolConfig(): pg.PoolConfig {
  const url = new URL(env.databaseUrl)
  const mode = url.searchParams.get('sslmode')
  url.searchParams.delete('sslmode')

  return {
    connectionString: url.toString(),
    ssl: sslFor(mode),
    max: 10,
  }
}

function sslFor(mode: string | null): pg.PoolConfig['ssl'] {
  // No mode at all is the local cluster over loopback, where TLS buys nothing.
  if (mode === null || mode === 'disable') return false

  // Encrypted but unverified. Available deliberately, never the default.
  if (mode === 'no-verify') return { rejectUnauthorized: false }

  // Amazon's CAs in addition to the public roots, so a provider with an
  // ordinary publicly trusted certificate still validates.
  return { ca: [...rootCertificates, RDS_CA_BUNDLE] }
}

export function getPool(): pg.Pool {
  if (!pool) {
    pool = new pg.Pool(poolConfig())
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
