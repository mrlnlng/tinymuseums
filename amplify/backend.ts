import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { defineBackend } from '@aws-amplify/backend'
import { Duration } from 'aws-cdk-lib'
import { Rule, Schedule } from 'aws-cdk-lib/aws-events'
import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets'
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam'
import { Architecture, Code, LayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'

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
  throw new Error(
    'Could not find the repository root from ' +
      `${process.cwd()}. Run ampx from the repository root.`,
  )
}

function setting(name: string, fallback: string): string {
  const value = process.env[name]
  return value === undefined || value === '' ? fallback : value
}

const repoRoot = findRepoRoot()
const amplifyDir = join(repoRoot, 'amplify')

const backend = defineBackend({})
const stack = backend.createStack('tiny-museum-worker')

const REQUIRED = ['DATABASE_URL', 'SESSION_SECRET'] as const

const missing = REQUIRED.filter((name) => !setting(name, ''))
if (missing.length > 0) {
  console.warn(
    `[backend] ${missing.join(' and ')} not set in the build environment, so ` +
      'the worker will fail on its first invocation. Set them as branch ' +
      'environment variables in the Amplify console.',
  )
}

const sharpLayerDir = join(amplifyDir, 'layers', 'sharp')
if (!existsSync(join(sharpLayerDir, 'nodejs', 'node_modules', 'sharp'))) {
  throw new Error(
    `The sharp layer has not been installed at ${sharpLayerDir}/nodejs/node_modules. ` +
      'Run: npm install --prefix amplify/layers/sharp/nodejs --omit=dev --cpu=x64 --os=linux',
  )
}

const sharpLayer = new LayerVersion(stack, 'SharpLayer', {
  code: Code.fromAsset(sharpLayerDir),
  compatibleRuntimes: [Runtime.NODEJS_20_X],
  compatibleArchitectures: [Architecture.X86_64],
  description: 'sharp, built for linux/x64 — excluded from the function bundle.',
})

const worker = new NodejsFunction(stack, 'Worker', {
  entry: join(amplifyDir, 'functions', 'worker', 'handler.ts'),
  handler: 'handler',
  runtime: Runtime.NODEJS_20_X,
  architecture: Architecture.X86_64,
  timeout: Duration.seconds(120),
  memorySize: 2048,
  layers: [sharpLayer],
  projectRoot: repoRoot,
  depsLockFilePath: join(repoRoot, 'package-lock.json'),
  bundling: {
    target: 'node20',
    sourceMap: true,
    // sharp's native binary comes from the linux/x64 layer rather than the bundle.
    externalModules: ['sharp', 'pg-native'],
    commandHooks: {
      beforeBundling: () => [],
      beforeInstall: () => [],
      afterBundling: (inputDir: string, outputDir: string) => [
        `mkdir -p ${outputDir}/core-assets`,
        `cp -r ${inputDir}/packages/core/assets/. ${outputDir}/core-assets/`,
      ],
    },
  },
  environment: {
    NODE_ENV: 'production',
    DATABASE_URL: setting('DATABASE_URL', ''),
    SESSION_SECRET: setting('SESSION_SECRET', ''),
    CORE_ASSETS_DIR: '/var/task/core-assets',
    STORAGE_DRIVER: setting('STORAGE_DRIVER', 's3'),
    S3_BUCKET: setting('S3_BUCKET', ''),
    MEDIA_BASE_URL: setting('MEDIA_BASE_URL', ''),
    PUBLIC_BASE_URL: setting('PUBLIC_BASE_URL', ''),
    MAIL_TRANSPORT: setting('MAIL_TRANSPORT', 'console'),
    EPOCH_INTERVAL_MINUTES: setting('EPOCH_INTERVAL_MINUTES', '60'),
    HALL_OWNER_EMAIL: setting('HALL_OWNER_EMAIL', ''),
    NODE_OPTIONS: '--enable-source-maps',
  },
})

const mediaBucket = setting('S3_BUCKET', '')
if (mediaBucket) {
  worker.addToRolePolicy(
    new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ['s3:GetObject', 's3:PutObject', 's3:DeleteObject'],
      resources: [`arn:aws:s3:::${mediaBucket}/*`],
    }),
  )
  worker.addToRolePolicy(
    new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ['s3:ListBucket'],
      resources: [`arn:aws:s3:::${mediaBucket}`],
    }),
  )
} else {
  console.warn(
    '[backend] S3_BUCKET is not set, so the worker has no object storage ' +
      'permissions. Set it in the Amplify console and redeploy before ' +
      'switching STORAGE_DRIVER to s3.',
  )
}

const everyMinutes = Number(setting('WORKER_SCHEDULE_MINUTES', '1'))

new Rule(stack, 'WorkerSchedule', {
  schedule: Schedule.rate(Duration.minutes(everyMinutes)),
  targets: [new LambdaFunction(worker)],
  description: 'Drains the Tiny Museum job queue.',
})
