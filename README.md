# Tiny Museum

A virtual gallery hall. Artists claim a wall, hang their work, and get a QR code that
leads a stranger straight to it. Visitors walk the hall as the bunny, stop at what catches
them, and look at one work at a time.

Everything runs locally. The only thing left to hook up is AWS.

## Running it

```bash
npm install
npm run setup          # copies .env.example to .env

npm run db             # terminal 1 — Postgres, leave running
npm run db:migrate     # terminal 2
npm run db:seed        # 8 artists, 34 works, fully published
npm run dev            # web on :3000, worker alongside
```

Then open <http://localhost:3000>. Seeded artists sign in at `/studio/sign-in` with
`<slug>@example.com` and the password `tinymuseum` — for example `wen-li@example.com`.

`npm run db:reset` wipes the database and media and starts over.

### A note on Postgres

`docker-compose.yml` is the intended way to run the database and works unchanged if you
have Docker. This machine did not, and installing it needs root, so `npm run db` uses
`embedded-postgres`: the real Postgres binaries, run as your user, on the same port.
`DATABASE_URL` is identical either way and nothing in the app can tell the difference.

## What works end to end

**Visitors**

- The hall renders in WebGL, walked with arrow keys, drag, or scroll.
- Displays stream in from `/api/hall` as you approach them, and unmount behind you.
- Pedestals stand between displays and hold while the next payload is in flight.
- Tapping a work opens it full size with the artist's description, and steps through their
  whole body of work.
- Following an artist takes an email, confirms it, and nothing else.
- Asking about a work emails the artist directly. No checkout, no commission.

**Artists**

- Register, sign in, upload works with metadata.
- Choose a layout template and tick what hangs; the server composites it.
- A publish bar that must be cleared before a wall can hang.
- QR codes per placement, with scans attributed to each.
- A dashboard: wall views, works looked at, enquiries, followers, scans by placement.

**The system**

- Uploads are stored and queued; the worker validates, strips EXIF, and builds a
  derivative ladder with sharp.
- The compositor flattens hung works into one image per display plus a region map.
- Epochs seal on a schedule, rotating who stands near the entrance.
- Takedown is immediate, bypassing epoch snapshots via a read-time suppression check.

## Shape

```
packages/core        domain logic, shared by web and worker
  env.ts             config; also finds the repo root and anchors relative paths
  db.ts              pg pool, plain SQL
  storage.ts         Storage interface + FilesystemStorage   <- the S3 seam
  jobs.ts            DB-backed queue, FOR UPDATE SKIP LOCKED <- the SQS seam
  images.ts          derivative ladder (sharp)
  collage.ts         flattens a display to one image + region map
  layouts.ts         layout templates -> placements
  epoch.ts           sealing, slices, cursor stability
  publish.ts         the publish bar
  handlers.ts        job handlers, so seeding runs the same pipeline
apps/web             Next.js: SSR pages, route handlers, the hall renderer
apps/worker          the polling loop and nothing else
db/migrations        plain SQL
scripts              db, migrate, seed, prep_assets.py
```

## Deploying to Amplify

The plan is Amplify Hosting for the Next.js app (which carries the API with it, since the
route handlers *are* the backend), plus Amplify Gen 2 for auth, storage, and functions.
Postgres stays — the epoch model, keyset cursors, array columns, `SKIP LOCKED` job claims
and the aggregate analytics queries are all relational, and none of them port to DynamoDB
without a redesign.

| Local | AWS | Where |
| --- | --- | --- |
| `FilesystemStorage` | S3 | `STORAGE_DRIVER=s3` + `S3_BUCKET`. `S3Storage` is written |
| `/api/media/[...key]` | CloudFront | `MEDIA_BASE_URL`; the route becomes unused |
| `/api/uploads/local` | S3 presigned PUT | Already presigned locally; the route becomes unused |
| Worker polling loop | Gen 2 scheduled function | `apps/worker/src/lambda.ts` is written; handlers untouched |
| `ConsoleMailer` | SES | `packages/core/src/mail.ts` |
| Sessions in Postgres | Cognito | `artistForSession` in `packages/core/src/auth.ts` |
| `embedded-postgres` | RDS / Aurora | `DATABASE_URL` |

Objects are content-addressed or version-keyed and served `immutable`, so the caching
behaviour developed against here is what CloudFront will give.

### Still to settle before the first deploy

- **Can Amplify Hosting's SSR compute reach a VPC?** If not, a private RDS instance is
  unreachable from pages and route handlers. Aurora Serverless v2's Data API (HTTP, no VPC)
  closes it, and would change `db.ts` and nothing else. Verify against current AWS docs.
- **Connection pooling.** `db.ts` opens a `pg.Pool` per process, which is right for a
  long-lived server and wrong across many serverless instances. RDS Proxy or the Data API.
- **`amplify.yml` is unverified.** Written from the monorepo build spec, never run.
- **Gen 2 backend definitions are not written.** Scaffold them with
  `npm create amplify@latest` rather than hand-writing them — guessing at the current
  `defineFunction` / `defineStorage` API surface produces config that looks right and
  is not.

## Known gaps

- **Seed artwork is procedural.** The asset set contains one real painting; everything
  else is a generated colour field. Good enough to judge layout and pacing, useless for
  judging colour.
- **One work or several?** Layout templates go up to four works per wall. The original
  mockups show exactly one. Both work; the product decision is still open.
- **No drag-and-place composer.** Templates produce the same `Placement[]` a composer
  would write, so it is an upgrade rather than a rewrite — but it is the largest piece of
  artist-facing UI still missing.
- **Server actions were not exercised by the smoke tests.** Every page, API route, and the
  whole pipeline were; sign-in, upload, arrange and publish were checked by rendering and
  by running the pipeline directly, not by driving the forms.
- **Commerce is modelled, not built.** `price_cents`, `currency`, `availability`,
  `edition_*` exist and are inert. Stripe lands additively.
