-- The hall hangs individual works now: one painting per slot.
--
-- A display is still the artist's arrangement (which works they hang, via
-- hung_piece_ids on `displays`), but the composite the hall shows is no longer
-- one flattened collage per artist — each hanging piece is rendered and shown
-- on its own wall. So a slot references a piece, and the piece carries its own
-- flattened, per-piece framed image.

drop table if exists epoch_slots;
create table epoch_slots (
  epoch_id bigint not null references museum_epochs(id) on delete cascade,
  index    int not null,
  piece_id uuid not null references pieces(id) on delete cascade,
  primary key (epoch_id, index),
  unique (epoch_id, piece_id)
);

-- Each piece gets its own framed, flattened image for the hall, keyed by a
-- version just like a display's collage, so a republish writes a new object
-- rather than mutating one a CDN may already be serving.
alter table pieces add column if not exists flattened_key text;
alter table pieces add column if not exists flattened_width int;
alter table pieces add column if not exists flattened_height int;
alter table pieces add column if not exists flattened_version int not null default 0;
