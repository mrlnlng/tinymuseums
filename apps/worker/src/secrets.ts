import { GetParametersCommand, SSMClient } from '@aws-sdk/client-ssm'

/**
 * Secrets, fetched at runtime rather than baked into the function.
 *
 * Amplify stores a branch's secrets as SSM SecureString parameters under
 * /amplify/<app-id>/<branch>/. They are deliberately NOT copied into the
 * Lambda's environment at deploy time: environment variables are readable by
 * anyone with lambda:GetFunctionConfiguration and are printed in plain text by
 * the console, so a database password put there is a password published to
 * every reader of the account.
 *
 * Values are written into process.env because packages/core/src/env.ts reads
 * process.env through getters at the point of use, never at import. Setting
 * them here, before the first call into core, is therefore enough — nothing
 * downstream needs to know secrets arrived late.
 */

/** Everything env.ts refuses to default in production. */
const SECRET_NAMES = ['DATABASE_URL', 'SESSION_SECRET'] as const

const client = new SSMClient({})

let loaded = false

export async function loadSecrets(): Promise<void> {
  if (loaded) return

  // Anything already in the environment is taken as given. That is what makes
  // this entry point runnable outside AWS — with a local .env it never
  // reaches for SSM at all — and it lets a deployment inject values directly
  // if it would rather not use Amplify's secret store.
  const missing = SECRET_NAMES.filter((name) => !process.env[name])
  if (missing.length === 0) {
    loaded = true
    return
  }

  const prefix = process.env.SECRETS_SSM_PATH
  if (!prefix) {
    throw new Error(
      `Missing ${missing.join(', ')} and SECRETS_SSM_PATH is not set, so there is ` +
        'nowhere to read them from. The CDK stack in amplify/backend.ts sets it; ' +
        'locally, put the values in .env.',
    )
  }

  const response = await client.send(
    new GetParametersCommand({
      Names: missing.map((name) => `${prefix}${name}`),
      WithDecryption: true,
    }),
  )

  if (response.InvalidParameters?.length) {
    throw new Error(
      `Missing Amplify secret(s): ${response.InvalidParameters.join(', ')}. ` +
        'Set each one in the Amplify console under Hosting → Secrets, ' +
        'or with `npx ampx sandbox secret set <NAME>`.',
    )
  }

  for (const parameter of response.Parameters ?? []) {
    const name = parameter.Name?.slice(prefix.length)
    if (name && parameter.Value) process.env[name] = parameter.Value
  }

  // Set last, so a partial or failed fetch is retried on the next invocation
  // rather than cached as success for the life of the container.
  loaded = true
}
