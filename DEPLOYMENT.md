# Deployment status — Amplify

Working notes for getting Inspiratiq's Tiny Museum onto AWS Amplify. Companion
to `PROJECT.md`, which covers the product and the codebase; this file covers
only the deployment and is meant to be picked up cold.

**Identifiers.** The Amplify app id (`d1wkk955zsue1z`, region `us-east-2`) is in
here because it is already elsewhere in this repository. The AWS account number
and the RDS endpoint are written as `<account-id>` and `<db-host>`: this
repository is public, and an internet-facing database hostname is not something
to publish. Substitute them from the console when running the commands.

---

## 1. Where this stands

The site builds, deploys, and runs server-side rendering end to end, database
routes included. The scheduled worker runs against the same database in the
same account.

The one blocker was Amplify not passing branch environment variables into the
Next.js SSR compute. Fixed by baking them into `.env.production` at build time;
see §4.

## 2. Verified working

| Piece | State | How it was confirmed |
|---|---|---|
| Build spec (`amplify.yml`) | ✅ | Full command sequence run in a clean worktree |
| Root lockfile / `npm ci` | ✅ | `npm ci` exits 0 from a fresh clone |
| Monorepo detection | ✅ | `AMPLIFY_MONOREPO_APP_ROOT=apps/web` |
| Platform `WEB_COMPUTE` | ✅ | `get-app` reports it; `server: AmazonS3` gone from responses |
| Service role | ✅ | `AmplifyBackendDeployRole` attached |
| CDK bootstrap | ✅ | `us-east-2` in the app owner's account |
| RDS instance | ✅ | Publicly reachable, TLS, migration applied |
| TLS verification | ✅ | RDS CA bundle embedded; verified against all `sslmode` values |
| Gen 2 worker | ✅ | Deployed, invoking every minute, no errors |
| SSR executing | ✅ | Non-database routes render correctly |
| **Database routes** | ✅ | Fixed — env vars baked into `.env.production` at build time |

## 3. Evidence

_Historical — the pre-fix probing that localised the failure to the web tier's
database access. Resolved in §4._

External probing of `https://main.d1wkk955zsue1z.amplifyapp.com`:

| Route | Result | Touches DB |
|---|---|---|
| `/` | 500 | yes |
| `/api/hall?...` | 500 | yes |
| `/studio/sign-in` | 200 | no |
| `/definitely-not-real-xyz` | 404 page | no |
| `/api/events` | 405 (correct — POST only) | no |

Module loading, routing and rendering are therefore all fine. The failure is
specific to database access from the web tier.

Meanwhile the worker — same account, same Lambda service, same connection
string, same `db.ts` — logs clean invocations. So Lambda-to-RDS connectivity,
TLS, credentials and the security group are all proven good.

## 4. Resolved — env vars baked into `.env.production`

Amplify does not pass branch environment variables into the Next.js SSR compute
— a server component does not receive the build's variables at runtime,
deliberately, so secrets are not exposed to it. See
[AWS: Making environment variables accessible to server-side runtimes](https://docs.aws.amazon.com/amplify/latest/userguide/ssr-environment-variables.html).

The fix in `amplify.yml` bakes the branch variables into
`apps/web/.env.production` before `next build`, and Next.js loads that file into
the SSR process at startup. Confirmed working: `/api/health` reported every
`present.*` as `true` and `database.reachable` as `true`, and `/` and
`/api/hall` now serve.

The temporary `/api/health` route used to diagnose this has been removed.

**Caveat worth naming.** Baking `DATABASE_URL` into `.env.production` puts a
credential into the deployment artifact, which the AWS docs warn against. The
longer-term fix is the SSR compute IAM role plus secret retrieval at runtime
(see the "Using IAM roles" note in the doc above).

Also still worth enabling: Amplify console → Hosting → Monitoring → CloudWatch
logs for SSR. The log group `/aws/amplify/d1wkk955zsue1z` does not currently
exist, which is why no server exception has ever been readable.

## 5. Remaining work

1. **Object storage.** Create the S3 bucket and CloudFront distribution. Set
   `STORAGE_DRIVER=s3`, `S3_BUCKET`, and point `MEDIA_BASE_URL` at the
   distribution. `amplify/backend.ts` grants the worker Get/Put/Delete on the
   bucket as soon as `S3_BUCKET` is set at build time.
2. **Seed, from a developer machine.** The `artwork-*` files are gitignored as
   proprietary and exist only locally.

       DATABASE_URL='...' STORAGE_DRIVER=s3 S3_BUCKET=... MEDIA_BASE_URL='...' \
         npm run db:seed

   Order matters. Seeding before the bucket exists writes media to the local
   disk while the production database records keys pointing at it, and the only
   repair is to seed again from scratch.
3. The worker takes over: sealing epochs and compositing collages on its
   one-minute schedule.
4. `www.tinymuseums.com` has no DNS record — only the apex is configured.
5. Security, carried forward from §7: the database is open to `0.0.0.0/0`.

## 6. Commands worth keeping

    # worker logs
    aws logs tail /aws/lambda/amplify-d1wkk955zsue1z-main-branch--Worker11F36D0F-TXsWvcdlvHYJ \
      --region us-east-2 --since 15m --format short

    # app configuration
    aws amplify get-app --app-id d1wkk955zsue1z --region us-east-2 \
      --query 'app.{platform:platform,role:iamServiceRoleArn}'

    # variable names only, no values
    aws amplify get-branch --app-id d1wkk955zsue1z --region us-east-2 \
      --branch-name main --query 'branch.environmentVariables' | grep -o '"[A-Z_]*"'

    # run the landing page's server work locally against production, exactly as
    # deployed - NODE_ENV=production disables every dev fallback in env.ts
    DATABASE_URL='...' NODE_ENV=production MEDIA_BASE_URL='...' PUBLIC_BASE_URL='...' \
    SESSION_SECRET='...' node --experimental-strip-types -e "
      const { ensureEpoch, closePool } = await import('./packages/core/src/index.ts');
      console.log(await ensureEpoch()); await closePool();"

## 7. Things that cost time — do not relearn these

**A Next.js error digest is not an error identity.** It is
`hash(message + stack)`. Change the code around a throw and the digest changes
while the error does not. This was read as "the environment changed" when only
the stack had, and it misdirected two rounds of debugging.

**Amplify runs every build phase in one shell.** A bare `cd ../..` in `preBuild`
is still in effect during `build`. Wrap each in a subshell.

**`@aws-amplify/backend` cannot produce an `npm ci`-clean lockfile.** It pulls in
`@aws-amplify/data-construct`, which ships bundled dependencies; `npm install`
writes a lock that `npm ci` then rejects. Reproduced from clean on npm 10 and
11. Hence `amplify/` is not a workspace member and installs separately. `esbuild`
stays in the root because CDK bundles by shelling out to
`npx --no-install esbuild` from the directory `ampx` runs in.

**`ampx` must be invoked through npm.** It reads `npm_config_user_agent` and
refuses to start when unset, so calling the binary by path fails.

**The account id in an Amplify build error may not be yours.** With no service
role attached, builds run in an AWS-owned account — the role name
`AemiliaControlPlaneLambda-CodeBuildRole` is the tell. Attaching a service role
is what moves the build into the owner's account.

**`ssm:GetParameters` conflates "absent" with "denied".** A name the caller
cannot read comes back under `InvalidParameters`, identically to one that was
never set — including when the block is a missing `kms:Decrypt` for a
SecureString. Never report that condition as "missing".

**`sslmode=require` means full verification in this `pg` version**, not merely
"encrypt". Against RDS it fails without the Amazon CA, which is why the bundle
is embedded in `packages/core/src/rds-ca.ts`.

**`pg` lets the connection string override explicit options.** Internally
`Object.assign({}, config, parse(connectionString))`, so an `ssl` passed
alongside a URL carrying `sslmode` is silently discarded. `db.ts` therefore
strips `sslmode` from the URL and decides TLS itself.

**A bare `VAR=value` line is not exported.** Setting variables on one line and
running the command on the next means the command does not see them — a
migration appeared to succeed against production while actually hitting the
local database.

**Shell cwd persists between commands.** More than one verification has silently
run in the wrong directory. Anchor to the repo root.
