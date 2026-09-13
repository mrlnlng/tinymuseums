-- Applied on every deploy: every statement must be safe to re-run.

create table if not exists guest_notes (
  id          uuid primary key default gen_random_uuid(),
  author_name text not null check (author_name <> ''),
  message     text not null check (message <> ''),
  color       text not null,
  -- Millisecond precision, so the page cursor round-trips through a JS Date exactly.
  created_at  timestamptz not null default date_trunc('milliseconds', now()),
  hidden_at   timestamptz
);

create index if not exists guest_notes_visible on guest_notes (created_at desc, id desc)
  where hidden_at is null;

create table if not exists rate_limits (
  bucket       text primary key,
  window_start timestamptz not null,
  hits         int not null
);
