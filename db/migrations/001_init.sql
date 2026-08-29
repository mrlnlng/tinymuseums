-- Tiny Museum initial schema.
--
-- Shapes follow the high-level design: an artist owns exactly one display,
-- the museum's order is a sealed epoch of slots, and takedown is a read-time
-- suppression check that deliberately bypasses epoch immutability.

create extension if not exists citext;
create extension if not exists pgcrypto;

-- ---------------------------------------------------------------- identity

create table artists (
  id            uuid primary key default gen_random_uuid(),
  slug          citext not null unique,
  display_name  text not null,
  statement     text not null default '',
  email         citext not null unique,
  password_hash text not null,
  status        text not null default 'draft'
                  check (status in ('draft', 'live', 'suspended')),
  created_at    timestamptz not null default now(),
  published_at  timestamptz
);

create table sessions (
  token      text primary key,
  artist_id  uuid not null references artists(id) on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null
);

create index sessions_artist on sessions(artist_id);

-- ---------------------------------------------------------------- media

-- An uploaded original plus the derivative ladder the worker generates.
create table assets (
  id           uuid primary key default gen_random_uuid(),
  artist_id    uuid not null references artists(id) on delete cascade,
  storage_key  text not null,
  mime         text not null,
  bytes        bigint not null,
  width        int,
  height       int,
  status       text not null default 'pending'
                 check (status in ('pending', 'ready', 'failed')),
  derivatives  jsonb not null default '[]'::jsonb,
  error        text,
  created_at   timestamptz not null default now()
);

create index assets_artist on assets(artist_id);

-- ---------------------------------------------------------------- works

create table pieces (
  id          uuid primary key default gen_random_uuid(),
  artist_id   uuid not null references artists(id) on delete cascade,
  asset_id    uuid references assets(id) on delete set null,
  title       text not null,
  description text not null default '',
  medium      text not null default '',
  year        int,
  dimensions  text,
  order_index int not null default 0,

  -- Commerce seam. Inert until Stripe exists, but modelled now so checkout
  -- lands as an additive feature rather than a schema migration.
  price_cents    int,
  currency       char(3),
  availability   text not null default 'not_for_sale'
                   check (availability in ('not_for_sale', 'available', 'sold')),
  edition_size   int,
  edition_number int,

  created_at  timestamptz not null default now()
);

create index pieces_artist_order on pieces(artist_id, order_index);

-- ---------------------------------------------------------------- display

-- One per artist, enforced by the unique constraint on artist_id.
create table displays (
  id               uuid primary key default gen_random_uuid(),
  artist_id        uuid not null unique references artists(id) on delete cascade,
  layout           text not null default 'single',
  hung_piece_ids   uuid[] not null default '{}',
  -- Placements the layout produced, in normalised canvas coordinates.
  composition      jsonb not null default '[]'::jsonb,
  -- Shipped to the client beside the flattened image, for hit testing.
  region_map       jsonb not null default '[]'::jsonb,
  flattened_key    text,
  flattened_width  int,
  flattened_height int,
  version          int not null default 0,
  rendered_at      timestamptz,
  updated_at       timestamptz not null default now()
);

-- ---------------------------------------------------------------- ordering

-- A sealed, deterministic ordering of published displays. Cursors are scoped
-- to one, so a walk stays coherent even as artists publish and unpublish.
create table museum_epochs (
  id            bigserial primary key,
  seed          bigint not null,
  display_count int not null,
  sealed_at     timestamptz not null default now(),
  -- Grace window: earlier epochs stay resolvable so visitors mid-walk do not
  -- hit a dead end at the next pedestal.
  expires_at    timestamptz not null
);

create table epoch_slots (
  epoch_id  bigint not null references museum_epochs(id) on delete cascade,
  index     int not null,
  artist_id uuid not null references artists(id) on delete cascade,
  primary key (epoch_id, index),
  unique (epoch_id, artist_id)
);

-- ---------------------------------------------------------------- qr codes

-- Its own table rather than encoding the artist slug, so a printed run can be
-- revoked and each placement's scans counted separately.
create table qr_tokens (
  id         uuid primary key default gen_random_uuid(),
  token      text not null unique,
  artist_id  uuid not null references artists(id) on delete cascade,
  placement  text not null default 'default',
  created_at timestamptz not null default now(),
  revoked_at timestamptz
);

create index qr_tokens_artist on qr_tokens(artist_id);

-- ---------------------------------------------------------------- audience

create table follows (
  id                uuid primary key default gen_random_uuid(),
  artist_id         uuid not null references artists(id) on delete cascade,
  email             citext not null,
  confirmed_at      timestamptz,
  confirm_token     text not null,
  unsubscribe_token text not null,
  created_at        timestamptz not null default now(),
  unique (artist_id, email)
);

create table inquiries (
  id         uuid primary key default gen_random_uuid(),
  piece_id   uuid not null references pieces(id) on delete cascade,
  from_email citext not null,
  message    text not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------- safety

-- Consulted when a hall slice is hydrated, outside the epoch cache, so a
-- takedown is immediate even though epoch slices are immutable by design.
create table suppressions (
  subject_type text not null check (subject_type in ('artist', 'piece')),
  subject_id   uuid not null,
  reason       text not null default '',
  created_at   timestamptz not null default now(),
  primary key (subject_type, subject_id)
);

-- ---------------------------------------------------------------- analytics

create table events (
  kind       text not null check (kind in ('display_view', 'piece_view', 'scan', 'inquiry')),
  artist_id  uuid references artists(id) on delete cascade,
  piece_id   uuid references pieces(id) on delete set null,
  placement  text,
  created_at timestamptz not null default now(),
  id         bigserial primary key
);

create index events_artist_kind on events(artist_id, kind, created_at desc);

-- ---------------------------------------------------------------- jobs

-- Stands in for SQS. Claimed with FOR UPDATE SKIP LOCKED so the swap to a real
-- queue does not change how handlers are written.
create table jobs (
  id         bigserial primary key,
  kind       text not null,
  payload    jsonb not null default '{}'::jsonb,
  status     text not null default 'pending'
               check (status in ('pending', 'running', 'done', 'failed')),
  attempts   int not null default 0,
  run_after  timestamptz not null default now(),
  locked_at  timestamptz,
  last_error text,
  created_at timestamptz not null default now()
);

create index jobs_claim on jobs(status, run_after) where status = 'pending';
