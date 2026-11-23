-- Applied on every deploy: every statement must be safe to re-run.
-- The museum's doors as one document (rooms/doors.ts); null means the doors as the museum was built.
create table if not exists museum_doors (
  id         smallint primary key default 1 check (id = 1),
  draft      jsonb,
  published  jsonb,
  updated_at timestamptz not null default now()
);

insert into museum_doors (id) values (1) on conflict (id) do nothing;
