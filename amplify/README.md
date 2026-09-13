# Backend

`backend.ts` deploys the job queue worker as a scheduled Lambda, with `sharp` supplied by a
linux/x64 layer.

This directory is not an npm workspace member. `@aws-amplify/data-construct` ships bundled
dependencies that `npm ci` rejects from the lockfile, so it installs with `npm install`, keeping
the root lockfile `npm ci`-clean.

## Deploying by hand

From the repo root:

```bash
npm ci
npm install --prefix amplify
npm run layer:sharp
npm run deploy:backend -- --branch main --app-id <app-id>
```

Use `npm run`: `ampx` refuses to start without `npm_config_user_agent`, which only npm sets.

## AWS prerequisites

1. **A service role on the Amplify app** with `AmplifyBackendDeployFullAccess`. Without one,
   builds run in an AWS-owned account and fail with a CDK `BootstrapDetectionError`.
2. **A bootstrapped region** in your account: `npx cdk bootstrap aws://<account-id>/<region>`.

Until both exist, set the branch variable `SKIP_BACKEND_DEPLOY=true` to deploy the web app alone.
