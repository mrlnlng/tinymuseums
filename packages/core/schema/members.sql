-- Applied on every deploy: every statement must be safe to re-run.

create extension if not exists citext;

create table if not exists members (
  id           uuid primary key default gen_random_uuid(),
  email        citext not null unique,
  password_hash     text not null,                 -- bcrypt, cost 11
  email_verified_at timestamptz,                   -- always null until §13
  created_at   timestamptz not null default now(),
  last_seen_at timestamptz not null default now()   -- updated only when a session slides
);

create table if not exists member_sessions (
  token_hash  text primary key,                    -- sha256(token); raw never stored
  member_id   uuid not null references members(id) on delete cascade,
  created_at  timestamptz not null default now(),
  expires_at  timestamptz not null
);
create index if not exists member_sessions_member on member_sessions (member_id);

create table if not exists member_slots (
  member_id   uuid not null references members(id) on delete cascade,
  slot        text not null,
  version     integer not null check (version > 0),
  doc         jsonb not null check (jsonb_typeof(doc) = 'object'),
  updated_at  timestamptz not null default now(),
  primary key (member_id, slot),
  check (octet_length(doc::text) <= 131072)         -- backstop only; the real cap is in code (§4)
);
