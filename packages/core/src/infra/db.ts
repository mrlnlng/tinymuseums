import { rootCertificates } from 'node:tls'
import pg from 'pg'
import { env } from './env.ts'
import { RDS_CA_BUNDLE } from './rds-ca.ts'

// int8 arrives as a string by default; ids and counts here stay far below 2^53.
pg.types.setTypeParser(20, (value) => Number(value))

let pool: pg.Pool | null = null

function poolConfig(): pg.PoolConfig {
  const url = new URL(env.databaseUrl)
  // pg lets sslmode in the URL override the ssl option, so TLS is decided here instead.
  const mode = url.searchParams.get('sslmode')
  url.searchParams.delete('sslmode')

  return {
    connectionString: url.toString(),
    ssl: sslFor(mode),
    max: 10,
  }
}

function sslFor(mode: string | null): pg.PoolConfig['ssl'] {
  if (mode === null || mode === 'disable') return false

  if (mode === 'no-verify') return { rejectUnauthorized: false }

  // RDS certificates chain to an Amazon CA that is not in Node's trust store.
  return { ca: [...rootCertificates, RDS_CA_BUNDLE] }
}

function getPool(): pg.Pool {
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
