-- Applied on every deploy: every statement must be safe to re-run.

create table if not exists vitals (
  id          bigint generated always as identity primary key,
  recorded_at timestamptz not null default now(),
  page        text not null,
  metric      text not null,
  value       double precision not null,
  rating      text,
  device      text not null,
  connection  text
);

create index if not exists vitals_recorded_at on vitals (recorded_at);
