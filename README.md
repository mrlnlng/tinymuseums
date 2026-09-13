# Tiny Museum

A virtual gallery hall. Artists claim a wall, hang their work, and get QR codes that lead
visitors straight to it. Visitors walk the hall as the bunny, open a work to see it up close,
and can leave a note on the guest board at the end.

## Running locally

`scripts/` and `db/` are gitignored local tooling (Postgres runner, migrations, seeding).

```bash
npm install
npm run setup                                                        # .env from .env.example
node --experimental-strip-types scripts/db.ts                        # Postgres on :5433
node --experimental-strip-types --env-file=.env scripts/migrate.ts   # base schema
npm run db:schema                                                    # deploy-applied schema
node --experimental-strip-types --env-file=.env scripts/seed.ts      # optional seed data
npm run dev                                                          # web on :3000 and worker
```

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
`STORAGE_DRIVER`, `S3_BUCKET`, `AWS_REGION`, `MAIL_TRANSPORT`, `EPOCH_INTERVAL_MINUTES`,
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
