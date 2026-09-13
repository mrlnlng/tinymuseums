import { existsSync, readFileSync } from 'node:fs'
import { dirname, isAbsolute, join, resolve } from 'node:path'

function findRepoRoot(): string {
  let dir = process.cwd()
  for (let i = 0; i < 8; i++) {
    const manifest = join(dir, 'package.json')
    if (existsSync(manifest)) {
      try {
        const parsed = JSON.parse(readFileSync(manifest, 'utf8')) as { workspaces?: unknown }
        if (parsed.workspaces) return dir
      } catch {}
    }
    const parent = dirname(dir)
    if (parent === dir) break
    dir = parent
  }
  return process.cwd()
}

export const repoRoot = findRepoRoot()

if (process.env.NODE_ENV !== 'production' && !process.env.DATABASE_URL) {
  const envFile = join(repoRoot, '.env')
  if (existsSync(envFile)) {
    try {
      process.loadEnvFile(envFile)
    } catch {}
  }
}

function isProduction(): boolean {
  return process.env.NODE_ENV === 'production'
}

function setting(name: string, fallback: string): string {
  const value = process.env[name]
  return value === undefined || value === '' ? fallback : value
}

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

function fromRoot(value: string): string {
  return isAbsolute(value) ? value : resolve(repoRoot, value)
}

export const env = {
  get databaseUrl(): string {
    return required('DATABASE_URL', 'postgres://tiny:tiny@localhost:5433/tiny_museum')
  },

  get storageDriver(): 'filesystem' | 's3' {
    return setting('STORAGE_DRIVER', 'filesystem') as 'filesystem' | 's3'
  },

  get storageDir(): string {
    return fromRoot(setting('STORAGE_DIR', './.data/media'))
  },

  get s3Bucket(): string {
    return env.storageDriver === 's3' ? required('S3_BUCKET') : setting('S3_BUCKET', '')
  },

  get awsRegion(): string {
    return setting('AWS_REGION', 'us-east-1')
  },

  get mediaBaseUrl(): string {
    return required('MEDIA_BASE_URL', 'http://localhost:3000/api/media')
  },

  get sessionSecret(): string {
    return sessionSecret()
  },

  get publicBaseUrl(): string {
    return required('PUBLIC_BASE_URL', 'http://localhost:3000')
  },

  get mailTransport(): 'console' | 'file' {
    return setting('MAIL_TRANSPORT', 'console') as 'console' | 'file'
  },

  get epochIntervalMinutes(): number {
    return Number(setting('EPOCH_INTERVAL_MINUTES', '60'))
  },

  get hallOwnerEmail(): string {
    return setting('HALL_OWNER_EMAIL', '')
  },
}
