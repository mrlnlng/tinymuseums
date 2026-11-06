# Tiny Museum

A virtual gallery hall. Artists claim a wall, hang their work, and get QR codes that lead
visitors straight to it. Visitors walk the hall as the bunny, open a work to see it up close,
and can leave a note on the guest board at the end.

## Running locally

```bash
npm install
npm run setup                                     # .env from .env.example
docker compose up -d                              # Postgres 16 on :5433
node --experimental-strip-types --env-file=.env scripts/migrate.ts   # base schema
npm run db:schema                                 # deploy-applied schema
npm run dev                                       # web on :3000 and worker
```

`scripts/` and `db/` are gitignored local tooling (migrations, seeding), so they exist only in a
checkout that has them. The base schema lives in `db/migrations`; `npm run db:schema` only layers
the idempotent `packages/core/schema` files on top. With the tooling present,
`node --experimental-strip-types --env-file=.env scripts/seed.ts` adds sample artists.
`scripts/db.ts` is an alternative to Docker that needs `embedded-postgres`, which is not a
project dependency: run `npm install --no-save embedded-postgres` first if you want it.

Seeded artists sign in at `/studio/sign-in` with `<slug>@example.com` and the password
`tinymuseum`. Any Postgres works; the app only reads `DATABASE_URL`.

## Layout

```
packages/core     domain logic, database, storage, jobs and media, shared by web and worker
  schema/         idempotent SQL applied on every deploy
apps/web          Next.js pages, route handlers, and the WebGL hall
apps/worker       job queue worker (long-running locally, a scheduled Lambda in AWS)
amplify/          CDK backend for the worker Lambda and its sharp layer
```

## Deployment

Amplify Hosting builds from `amplify.yml`:

- The backend phase deploys the worker Lambda (`amplify/backend.ts`). Set the branch variable
  `SKIP_BACKEND_DEPLOY=true` to ship only the web app.
- The frontend phase runs `npm run db:schema` against the branch's `DATABASE_URL`, then
  builds the web app. A failed schema step stops the build, leaving the previous release live.

Branch variables: `DATABASE_URL`, `SESSION_SECRET`, `PUBLIC_BASE_URL`, `MEDIA_BASE_URL`,
`STORAGE_DRIVER`, `S3_BUCKET`, `AWS_REGION`, `MAIL_TRANSPORT`,
`HALL_OWNER_EMAIL`.

## Known gaps

- **No production mail transport.** Only `console` and `file` exist, so follow confirmations
  and inquiries are not delivered in production until an SES mailer is added to
  `packages/core/src/infra/mail.ts`.
- **One pool per server process.** `db.ts` opens a `pg.Pool` per instance, which can exhaust
  database connections under many concurrent serverless instances. RDS Proxy fixes it
  without code changes.
- **One hall per environment**, owned by `HALL_OWNER_EMAIL`.
- **Commerce is modelled but inert** (`price_cents`, `availability`, `edition_*`).
