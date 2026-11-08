-- Applied on every deploy: every statement must be safe to re-run.

create table if not exists pond_catches (
  id        uuid primary key default gen_random_uuid(),
  member_id uuid not null references members(id) on delete cascade,
  species   text not null,
  tier      text not null,
  variant   text not null default 'normal',
  size_cm   double precision not null check (size_cm > 0),
  pearls    integer not null check (pearls >= 0),
  odds      double precision not null check (odds >= 0 and odds <= 1),
  week      text not null,
  at        timestamptz not null default now(),
  chained   boolean not null default false,
  score     integer,
  trophy    boolean not null default false
);
-- Additive columns for boards and the feed; old rows keep pearls as their streak-free score.
alter table pond_catches add column if not exists score integer;
alter table pond_catches add column if not exists trophy boolean not null default false;
update pond_catches set score = pearls where score is null;
create index if not exists pond_catches_week_size on pond_catches (week, size_cm desc);
create index if not exists pond_catches_week_pearls on pond_catches (week, pearls desc);
create index if not exists pond_catches_week_score on pond_catches (week, score desc);
create index if not exists pond_catches_score on pond_catches (score desc);
create index if not exists pond_catches_week_odds on pond_catches (week, odds asc);
create index if not exists pond_catches_size on pond_catches (size_cm desc);
create index if not exists pond_catches_odds on pond_catches (odds asc);
create index if not exists pond_catches_at on pond_catches (at desc);
create index if not exists pond_catches_feed on pond_catches (at desc)
  where tier in ('rare', 'legendary') or variant <> 'normal';
create index if not exists pond_catches_member_at on pond_catches (member_id, at desc);
create index if not exists pond_catches_member_species on pond_catches (member_id, species, variant);

create table if not exists pond_state (
  member_id     uuid primary key references members(id) on delete cascade,
  pearls        integer not null default 0 check (pearls >= 0),
  streak        integer not null default 0 check (streak >= 0),
  pity          integer not null default 0 check (pity >= 0),
  lucky         integer not null default 0 check (lucky >= 0),
  chain_level   integer not null default 0 check (chain_level between 0 and 2),
  chain_pot     integer not null default 0 check (chain_pot >= 0),
  chain_catch   uuid,
  wagered_day   date,
  wagered_today integer not null default 0 check (wagered_today >= 0),
  updated_at    timestamptz not null default now()
);

create table if not exists pond_bounty_claims (
  member_id uuid not null references members(id) on delete cascade,
  day       date not null,
  bounty_id text not null,
  at        timestamptz not null default now(),
  primary key (member_id, day, bounty_id)
);
