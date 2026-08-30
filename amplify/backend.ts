import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { defineBackend } from '@aws-amplify/backend'
import { Duration } from 'aws-cdk-lib'
import { Rule, Schedule } from 'aws-cdk-lib/aws-events'
import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets'
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam'
import { Architecture, Code, LayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'

/**
 * The backend: one scheduled function that drains the job queue.
 *
 * The web tier is deployed by Amplify Hosting from the same repository and is
 * not described here. This exists because Hosting has nowhere to run work that
 * is not a request — sealing epochs, compositing collages, generating
 * derivatives, sending follower mail.
 *
 * Written as plain CDK inside `createStack` rather than with `defineFunction`
 * for one reason: sharp. It ships a native binary, and `defineFunction` gives
 * no control over bundling, so the binary would either be missing at runtime
 * or bundled for the wrong platform. Here the module is marked external and
 * supplied by a layer built for linux/x64 during the backend build.
 */

/** The repo root, found the same way packages/core does it, from the cwd. */
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
  throw new Error(
    'Could not find the repository root from ' +
      `${process.cwd()}. Run ampx from the repository root.`,
  )
}

/** Non-secret configuration, read at synth time from the Amplify build environment. */
function setting(name: string, fallback: string): string {
  const value = process.env[name]
  return value === undefined || value === '' ? fallback : value
}

const repoRoot = findRepoRoot()
const amplifyDir = join(repoRoot, 'amplify')

const backend = defineBackend({})
const stack = backend.createStack('tiny-museum-worker')

// --- where the branch's secrets live ---

// Amplify publishes a branch's secrets to SSM under this path; the build
// environment names the app and branch. The function reads them at runtime
// rather than having them baked into its configuration.
const appId = setting('AWS_APP_ID', '')
const branch = setting('AWS_BRANCH', 'main')
if (!appId) {
  throw new Error(
    'AWS_APP_ID is not set. It is provided by the Amplify build environment; ' +
      'when running `ampx sandbox` locally, set it to the Amplify app id.',
  )
}
const secretsPath = `/amplify/${appId}/${branch}/`

// --- sharp, as a layer ---

// The staging directory is populated by `npm install` in the backend build
// phase (see amplify.yml). Failing here beats failing at runtime with a
// "Could not load the sharp module" that says nothing about why.
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

// --- the function ---

const worker = new NodejsFunction(stack, 'Worker', {
  entry: join(amplifyDir, 'functions', 'worker', 'handler.ts'),
  handler: 'handler',
  runtime: Runtime.NODEJS_20_X,
  architecture: Architecture.X86_64,
  // The handler's own budget is 50s; this leaves room to return cleanly.
  timeout: Duration.seconds(60),
  // Compositing a full display collage is the memory-hungry step. Lambda
  // scales CPU with memory, so this buys speed as much as headroom.
  memorySize: 2048,
  layers: [sharpLayer],
  projectRoot: repoRoot,
  depsLockFilePath: join(repoRoot, 'package-lock.json'),
  bundling: {
    target: 'node20',
    sourceMap: true,
    // sharp comes from the layer. pg-native is an optional dependency pg only
    // requires inside a try/catch, and nothing here uses it.
    externalModules: ['sharp', 'pg-native'],
    commandHooks: {
      beforeBundling: () => [],
      beforeInstall: () => [],
      // The collage compositor reads frame.png and manifest.json at runtime.
      // esbuild bundles modules, not data, so they have to be carried across
      // by hand; CORE_ASSETS_DIR below tells core where they landed.
      afterBundling: (inputDir: string, outputDir: string) => [
        `mkdir -p ${outputDir}/core-assets`,
        `cp ${inputDir}/packages/core/assets/frame.png ${outputDir}/core-assets/`,
        `cp ${inputDir}/packages/core/assets/manifest.json ${outputDir}/core-assets/`,
      ],
    },
  },
  environment: {
    NODE_ENV: 'production',
    SECRETS_SSM_PATH: secretsPath,
    // Where afterBundling put frame.png and manifest.json. /var/task is the
    // Lambda package root, which is what the bundling output directory becomes.
    CORE_ASSETS_DIR: '/var/task/core-assets',
    STORAGE_DRIVER: setting('STORAGE_DRIVER', 's3'),
    S3_BUCKET: setting('S3_BUCKET', ''),
    MEDIA_BASE_URL: setting('MEDIA_BASE_URL', ''),
    PUBLIC_BASE_URL: setting('PUBLIC_BASE_URL', ''),
    MAIL_TRANSPORT: setting('MAIL_TRANSPORT', 'console'),
    EPOCH_INTERVAL_MINUTES: setting('EPOCH_INTERVAL_MINUTES', '60'),
    NODE_OPTIONS: '--enable-source-maps',
  },
})

// --- permissions ---

worker.addToRolePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ['ssm:GetParameters', 'ssm:GetParametersByPath'],
    resources: [
      `arn:aws:ssm:${stack.region}:${stack.account}:parameter${secretsPath}*`,
      // GetParametersByPath is authorised against the path itself, without the
      // trailing wildcard, so both forms of the ARN have to be allowed.
      `arn:aws:ssm:${stack.region}:${stack.account}:parameter${secretsPath.replace(/\/$/, '')}`,
    ],
  }),
)

// Amplify stores secrets as SecureStrings, so reading one with WithDecryption
// also needs the key that encrypted it. Without this the call does not fail
// loudly — GetParameters reports anything it cannot decrypt as an *invalid
// parameter*, which is indistinguishable from one that was never set.
//
// The resource is a wildcard because the AWS-managed aws/ssm key has no ARN
// known at synth time; the condition is what narrows it, restricting this to
// decryption performed on Parameter Store's behalf in this region.
worker.addToRolePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ['kms:Decrypt'],
    resources: ['*'],
    conditions: {
      StringEquals: { 'kms:ViaService': `ssm.${stack.region}.amazonaws.com` },
    },
  }),
)

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
  // Not fatal: the worker is useful before the media bucket exists, and a
  // deploy that fails here would block the whole backend on one missing name.
  console.warn(
    '[backend] S3_BUCKET is not set, so the worker has no object storage ' +
      'permissions. Set it in the Amplify console and redeploy before ' +
      'switching STORAGE_DRIVER to s3.',
  )
}

// --- the schedule ---

// One minute, not the epoch interval: this drains the whole queue, and an
// artist who has just uploaded a piece should not wait an hour to see it
// processed. Sealing keeps its own, much slower cadence inside the queue.
const everyMinutes = Number(setting('WORKER_SCHEDULE_MINUTES', '1'))

new Rule(stack, 'WorkerSchedule', {
  schedule: Schedule.rate(Duration.minutes(everyMinutes)),
  targets: [new LambdaFunction(worker)],
  description: 'Drains the Tiny Museum job queue.',
})
