-- The guest board: sticky notes any visitor can leave, shared with everyone.
--
-- Applied on every deploy by apply.ts, so every statement must be safe to run
-- again against a database that already has it.
--
-- Visitors have no accounts, so a note carries only what it shows — a name, a
-- message and a colour. Where a note sits on the board is decided by the client
-- when it lays the board out, not stored, so the board can be redesigned
-- without rewriting rows.
--
-- The length limits and the colour palette are enforced in
-- packages/core/src/domain/guestboard.ts rather than here, so changing either
-- is a code change and not a schema change. The schema only refuses what can
-- never be valid: an empty note.
--
-- Takedown is a timestamp, like qr_tokens.revoked_at: a hidden note stops being
-- served but stays on record.

create table if not exists guest_notes (
  id          uuid primary key default gen_random_uuid(),
  author_name text not null check (author_name <> ''),
  message     text not null check (message <> ''),
  color       text not null,
  -- Millisecond precision to match a JavaScript Date, so the page cursor, which
  -- round-trips through one, compares exactly against the column.
  created_at  timestamptz not null default date_trunc('milliseconds', now()),
  hidden_at   timestamptz
);

-- Serves the board newest-first with a keyset cursor on (created_at, id), and
-- only ever covers visible notes.
create index if not exists guest_notes_visible on guest_notes (created_at desc, id desc)
  where hidden_at is null;

-- Fixed-window request counters, one row per bucket. The window resets in
-- place, so the table grows with distinct buckets (roughly, distinct visitors
-- who post), not with requests. Generic on purpose: any future endpoint can
-- limit itself under its own bucket prefix.
create table if not exists rate_limits (
  bucket       text primary key,
  window_start timestamptz not null,
  hits         int not null
);
