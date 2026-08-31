# Tiny Museum

A virtual gallery hall. Artists claim a wall, hang their work, and get a QR code that
leads a stranger straight to it. Visitors walk the hall as the bunny, stop at what catches
them, and look at one work at a time.

Everything runs locally. The only thing left to hook up is AWS.

## Running it

The web and worker live in this repo; the local Postgres runner, migrations and seed scripts
are deliberately kept **off** it (`scripts/` and `db/` are gitignored local tooling — production
deploys never use them). On this machine:

```bash
npm install
npm run setup                            # copies .env.example to .env
node --experimental-strip-types scripts/db.ts          # terminal 1 — Postgres on :5433
node --experimental-strip-types --env-file=.env scripts/migrate.ts   # terminal 2 — schema
node --experimental-strip-types --env-file=.env scripts/seed-testing2.ts  # optional seed
npm run dev                              # web on :3000, worker alongside
```

Then open <http://localhost:3000>. The seeded testing artist signs in at `/studio/sign-in`
with `testing2@example.com` and the password `tinymuseum`.

Any Postgres will do — `DATABASE_URL` is all the app reads; `scripts/db.ts` just runs
`embedded-postgres` (the real binaries, as your user) against `.data/pgdata`.

## What works end to end

**Visitors**

- The hall renders in WebGL, walked with arrow keys, drag, or scroll.
- Stands stream in from `/api/hall` as you approach them, and unmount behind you — **one
  painting per stand**, in each artist's gallery order.
- Pedestals stand between displays and hold while the next payload is in flight.
- Tapping a work opens it full size with the artist's description, and steps through their
  whole body of work.
- Following an artist takes an email, confirms it, and nothing else.
- Asking about a work emails the artist directly. No checkout, no commission.

**Artists**

- Register, sign in, upload works in the Gallery — image, title, description, optional shop link.
- Every upload hangs automatically on its own stand; the Gallery arranges stands 1–30 (▲▼,
  hang/unhang), and the museum walks in that exact order.
- A publish bar that must be cleared before a wall can hang.
- QR codes per placement, with scans attributed to each; codes can be removed (revoked).
- A dashboard: wall views, works looked at, enquiries, followers, scans by placement.

**The system**

- Uploads are stored and queued; the worker validates, strips EXIF, and builds a
  derivative ladder with sharp.
- Each arranged work gets its own framed image (portrait or landscape to match), rendered by
  the worker and served immutably.
- Epochs seal on a schedule (and on publish or rearrange), so new uploads join the hall.
- Takedown is immediate, bypassing epoch snapshots via a read-time suppression check.

## Shape

```
packages/core        domain logic, shared by web and worker
  env.ts             config; also finds the repo root and anchors relative paths
  db.ts              pg pool, plain SQL
  storage.ts         Storage interface + FilesystemStorage   <- the S3 seam
  jobs.ts            DB-backed queue, FOR UPDATE SKIP LOCKED <- the SQS seam
  images.ts          derivative ladder (sharp)
  collage.ts         per-work framed renders (sharp)
  gallery.ts         stands 1..30: arrange, hang/unhang, delete
  epoch.ts           sealing, slices, cursor stability
  publish.ts         the publish bar
  handlers.ts        job handlers, so seeding runs the same pipeline
apps/web             Next.js: SSR pages, route handlers, the hall renderer
apps/worker          the polling loop and nothing else
db/migrations        plain SQL
scripts              db, migrate, seed (local-only tooling)
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
- **Arrange is ▲▼, not drag-and-place.** The 1–30 stand list reorders with up/down buttons
  (deliberately: keyboard-friendly, mobile-safe). A drag-and-drop composer is a possible
  upgrade, not a rewrite.
- **The hall is one owner per environment** (`HALL_OWNER_EMAIL`). A per-artist
  `/{artist}/museum` route is the planned replacement.
- **Server actions were not exercised by the smoke tests.** Every page, API route, and the
  whole pipeline were; sign-in, upload, arrange and publish were checked by rendering and
  by running the pipeline directly, not by driving the forms.
- **Commerce is modelled, not built.** `price_cents`, `currency`, `availability`,
  `edition_*` exist and are inert. Stripe lands additively.
