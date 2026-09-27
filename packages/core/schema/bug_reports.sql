-- Applied on every deploy: every statement must be safe to re-run.

create table if not exists bug_reports (
  id          uuid primary key default gen_random_uuid(),
  message     text not null check (message <> ''),
  contact     text,
  page        text not null,
  context     jsonb not null default '{}',
  created_at  timestamptz not null default now(),
  resolved_at timestamptz
);

create index if not exists bug_reports_by_status on bug_reports ((resolved_at is null), created_at desc);
