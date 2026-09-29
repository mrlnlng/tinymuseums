-- Applied on every deploy: every statement must be safe to re-run.

create table if not exists visit_salts (
  day  date primary key,
  salt text not null
);

create table if not exists visits (
  id            uuid primary key,
  recorded_at   timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  day           date not null,
  visitor       text not null,
  page          text not null,
  device        text not null,
  duration_ms   integer not null default 0,
  interactions  integer not null default 0,
  paintings     integer not null default 0,
  furthest_rank smallint not null default 0,
  features      jsonb not null default '{}'::jsonb
);

create table if not exists visit_period_salts (
  period date primary key,
  salt   text not null
);

alter table visits add column if not exists period_visitor text;

create index if not exists visits_recorded_at on visits (recorded_at);
create index if not exists visits_day_visitor on visits (day, visitor);
