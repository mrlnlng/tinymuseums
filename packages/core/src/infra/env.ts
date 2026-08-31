import { existsSync, readFileSync } from 'node:fs'
import { dirname, isAbsolute, join, resolve } from 'node:path'

/* Configuration, read once: repo-root-anchored paths, no production fallbacks for secrets, and getters so a missing variable fails where it is used. */

function findRepoRoot(): string {
  let dir = process.cwd()
  for (let i = 0; i < 8; i++) {
    const manifest = join(dir, 'package.json')
    if (existsSync(manifest)) {
      try {
        const parsed = JSON.parse(readFileSync(manifest, 'utf8')) as { workspaces?: unknown }
        if (parsed.workspaces) return dir
      } catch {
        // Unreadable package.json: keep walking.
      }
    }
    const parent = dirname(dir)
    if (parent === dir) break
    dir = parent
  }
  return process.cwd()
}

export const repoRoot = findRepoRoot()

// One .env at the root serves every process. Next loads its own before this
// runs; the worker and scripts get it here. Never loaded in production — real
// deployments inject real variables.
if (process.env.NODE_ENV !== 'production' && !process.env.DATABASE_URL) {
  const envFile = join(repoRoot, '.env')
  if (existsSync(envFile)) {
    try {
      process.loadEnvFile(envFile)
    } catch {
      // Malformed .env: fall through to the defaults below.
    }
  }
}

function isProduction(): boolean {
  return process.env.NODE_ENV === 'production'
}

/** Values that are safe to default anywhere — nothing sensitive. */
function setting(name: string, fallback: string): string {
  const value = process.env[name]
  return value === undefined || value === '' ? fallback : value
}

/* Must be supplied in production; the dev fallback is refused once NODE_ENV is production. */
function required(name: string, devFallback?: string): string {
  const value = process.env[name]
  if (value !== undefined && value !== '') return value

  if (isProduction() || devFallback === undefined) {
    throw new Error(
      `Missing required environment variable ${name}. ` +
        'It has no production default, deliberately.',
    )
  }
  return devFallback
}

/** The published dev value. Refused in production even if set explicitly. */
const DEV_SESSION_SECRET = 'dev-only-change-me-0123456789abcdef'

function sessionSecret(): string {
  const value = required('SESSION_SECRET', DEV_SESSION_SECRET)

  if (isProduction()) {
    if (value === DEV_SESSION_SECRET) {
      throw new Error(
        'SESSION_SECRET is still the development value, which is published in this ' +
          'repository. Generate one: openssl rand -hex 32',
      )
    }
    if (value.length < 32) {
      throw new Error('SESSION_SECRET is too short; use at least 32 characters.')
    }
  }
  return value
}

/** Relative paths are anchored to the repo root, never the process's cwd. */
function fromRoot(value: string): string {
  return isAbsolute(value) ? value : resolve(repoRoot, value)
}

export const env = {
  get databaseUrl(): string {
    return required('DATABASE_URL', 'postgres://tiny:tiny@localhost:5433/tiny_museum')
  },

  /** "filesystem" locally, "s3" once a bucket exists. Nothing else changes. */
  get storageDriver(): 'filesystem' | 's3' {
    return setting('STORAGE_DRIVER', 'filesystem') as 'filesystem' | 's3'
  },

  /** Local directory standing in for the S3 media bucket. */
  get storageDir(): string {
    return fromRoot(setting('STORAGE_DIR', './.data/media'))
  },

  get s3Bucket(): string {
    // Only actually needed when the S3 driver is selected.
    return env.storageDriver === 's3' ? required('S3_BUCKET') : setting('S3_BUCKET', '')
  },

  get awsRegion(): string {
    return setting('AWS_REGION', 'us-east-1')
  },

  /** Local route standing in for the CloudFront distribution. */
  get mediaBaseUrl(): string {
    return required('MEDIA_BASE_URL', 'http://localhost:3000/api/media')
  },

  get sessionSecret(): string {
    return sessionSecret()
  },

  /** Used in QR links and outbound email, so a wrong value is user-visible. */
  get publicBaseUrl(): string {
    return required('PUBLIC_BASE_URL', 'http://localhost:3000')
  },

  get mailTransport(): 'console' | 'file' {
    return setting('MAIL_TRANSPORT', 'console') as 'console' | 'file'
  },

  get epochIntervalMinutes(): number {
    return Number(setting('EPOCH_INTERVAL_MINUTES', '60'))
  },
}
