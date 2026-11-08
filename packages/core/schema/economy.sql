-- Applied on every deploy: every statement must be safe to re-run.

create table if not exists wallets (
  member_id  uuid primary key references members(id) on delete cascade,
  balance    integer not null default 0 check (balance >= 0),
  created_at timestamptz not null default now()
);

create table if not exists coin_claims (
  member_id  uuid not null references members(id) on delete cascade,
  claim_key  text not null,
  source     text not null,
  day        date,
  amount     integer not null check (amount > 0),
  at         timestamptz not null default now(),
  primary key (member_id, claim_key)
);
create index if not exists coin_claims_daily on coin_claims (member_id, source, day);

create table if not exists wallet_items (
  member_id  uuid not null references members(id) on delete cascade,
  item_id    text not null,
  price      integer not null check (price >= 0),
  at         timestamptz not null default now(),
  primary key (member_id, item_id)
);

create table if not exists wallet_bait (
  member_id  uuid not null references members(id) on delete cascade,
  bait_id    text not null,
  count      integer not null check (count >= 0),
  primary key (member_id, bait_id)
);
