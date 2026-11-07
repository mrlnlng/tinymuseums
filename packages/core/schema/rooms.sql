-- Applied on every deploy: every statement must be safe to re-run.

create table if not exists rooms (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  theme           text not null,
  kind            text not null check (kind in ('shared', 'personal')),
  owner_member_id uuid references members(id) on delete cascade,
  visibility      text not null default 'private' check (visibility in ('private', 'link')),
  share_token     text unique,
  draft           jsonb not null default '[]',
  published       jsonb not null default '[]',
  published_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  check ((kind = 'personal') = (owner_member_id is not null))
);

-- Bumped on every draft save, so two editors cannot silently overwrite each other.
alter table rooms add column if not exists draft_version integer not null default 0;

create unique index if not exists rooms_personal_owner
  on rooms (owner_member_id)
  where kind = 'personal';

insert into rooms (slug, theme, kind)
values ('hall', 'hall', 'shared')
on conflict (slug) do nothing;

-- The fashion area's frames, placed from the studio (rooms/spots.ts).
insert into rooms (slug, theme, kind)
values ('atelier', 'atelier', 'shared')
on conflict (slug) do nothing;
