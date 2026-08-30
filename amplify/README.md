# Backend

The Amplify Gen 2 backend: one scheduled function that drains the job queue.
See `backend.ts`.

## Why this directory has its own package.json

It is deliberately **not** an npm workspace member, and its dependencies are
installed separately from the rest of the repo.

`@aws-amplify/backend` pulls in `@aws-amplify/data-construct`, which ships
**bundled dependencies** — a subtree that lives inside the published tarball
rather than being resolved by npm. npm cannot represent that subtree in a
lockfile it will later accept: `npm install` writes a lock, and `npm ci` then
rejects that same lock with

    npm error Missing: @aws-cdk/toolkit-lib@1.19.0 from lock file

This reproduces from a completely clean install, on both npm 10 and npm 11, so
it is the dependency graph rather than stale local state.

Keeping these packages here means the root lockfile stays `npm ci`-clean, which
is what the web build depends on. The cost is that this directory installs with
`npm install` rather than `npm ci` — its `package-lock.json` is committed and
npm still honours it, but do not switch that command over: it will fail.

`esbuild` is the one exception that stays in the root. CDK bundles Lambda code
by shelling out to `npx --no-install esbuild` from the directory `ampx` runs in,
which is the repo root, so it has to resolve there.

## Deploying

Amplify Hosting runs this from `amplify.yml`. To deploy by hand, from the repo
root:

    npm ci
    npm install --prefix amplify
    npm run layer:sharp
    npm run deploy:backend -- --branch main --app-id <app-id>

Note the last line goes through `npm run` rather than calling the binary. ampx
reads `npm_config_user_agent` to work out which package manager invoked it and
refuses to start when it is unset:

    AmplifyError [NoPackageManagerError]: npm_config_user_agent environment
    variable is undefined

Only npm sets that variable, so `./amplify/node_modules/.bin/ampx ...` fails
even though the path is correct. The script also has to run from the repo root:
ampx resolves `amplify/backend.ts` relative to the current directory.

## Prerequisites in AWS

The backend deploy needs two things that live in the account, not the repo.
Without them `ampx pipeline-deploy` fails *after* a successful synth:

    [BootstrapDetectionError] Unable to detect CDK bootstrap stack due to
    permission issues.
    ... is not authorized to perform: ssm:GetParameter on resource:
    arn:aws:ssm:us-east-2:...:parameter/cdk-bootstrap/hnb659fds/version

1. **A service role on the Amplify app.** This is the one that matters, and it
   is worth reading the error carefully before acting on it. The account id in
   it is *not* the account the app belongs to, and the role name says why:
   `AemiliaControlPlaneLambda-CodeBuildRole-...` — Aemilia is Amplify's
   internal service name. With no service role attached, builds run under
   Amplify's managed infrastructure in an AWS-owned account, so CDK goes
   looking for a bootstrap stack there. That account cannot be bootstrapped and
   should not be.

   Attaching a service role is what makes the build run in your own account
   instead. Create a role Amplify can assume, give it the managed policy
   `AmplifyBackendDeployFullAccess`, and set it in the console under App
   settings.

2. **A bootstrapped region — in your account, not the one in the error.** CDK
   keeps its bootstrap version in SSM and reads it before doing anything. Once
   per account/region:

       npx cdk bootstrap aws://<your-account-id>/<app-region>

   The region is the one the Amplify app runs in, which the SSM ARN in the
   error does report correctly even when the account does not.

## Shipping the frontend without the backend

A failed backend phase blocks the frontend with it. Set the branch variable
`SKIP_BACKEND_DEPLOY=true` to deploy the web app on its own, and remove it once
the two prerequisites above are in place.

