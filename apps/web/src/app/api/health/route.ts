import { NextResponse } from 'next/server'
import { query } from '@tiny/core'

/**
 * A temporary window into what the deployed runtime actually has.
 *
 * Next.js replaces a server error with an opaque digest, and a digest is a
 * hash of the message *and the stack*, so it changes whenever the code around
 * the error changes — which makes it useless for telling whether a problem is
 * the same one as last time. This route answers the only question that
 * matters: does the SSR runtime hold the configuration it was given, and can
 * it reach the database?
 *
 * Deliberately unauthenticated. The obvious guard is a token, but the token
 * would have to arrive as an environment variable, and whether environment
 * variables arrive is precisely what is in doubt. So it reports presence and
 * never values, and scrubs anything credential-shaped out of error text.
 *
 * DELETE THIS ROUTE once the deployment is understood.
 */

export const dynamic = 'force-dynamic'

/** Names the app needs. Reported as present or absent — never their contents. */
const EXPECTED = [
  'DATABASE_URL',
  'SESSION_SECRET',
  'MEDIA_BASE_URL',
  'PUBLIC_BASE_URL',
  'STORAGE_DRIVER',
  'S3_BUCKET',
  'AMPLIFY_MONOREPO_APP_ROOT',
] as const

/** Keeps hosts, users and passwords out of the response. */
function scrub(text: string): string {
  return text
    .replace(/postgres(ql)?:\/\/[^\s"']*/gi, 'postgres://<redacted>')
    .replace(/[\w.-]+\.rds\.amazonaws\.com/gi, '<db-host>')
}

export async function GET(): Promise<NextResponse> {
  const present: Record<string, boolean> = {}
  for (const name of EXPECTED) {
    present[name] = Boolean(process.env[name])
  }

  let database: Record<string, unknown>
  try {
    const [row] = await query<{ now: string }>('select now()::text as now')
    database = { reachable: true, serverTime: row?.now ?? null }
  } catch (error) {
    const e = error as Error & { code?: string }
    database = {
      reachable: false,
      name: e.name,
      code: e.code ?? null,
      message: scrub(e.message ?? String(error)),
    }
  }

  return NextResponse.json(
    {
      nodeEnv: process.env.NODE_ENV ?? null,
      cwd: process.cwd(),
      // A runtime that received nothing at all looks very different from one
      // that received everything except the variable in question.
      environmentVariableCount: Object.keys(process.env).length,
      present,
      database,
    },
    { headers: { 'cache-control': 'no-store' } },
  )
}
