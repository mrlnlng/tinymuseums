-- Applied on every deploy: every statement must be safe to re-run.

-- A ~25 byte ThumbHash of the framed painting, drawn while the full frame loads.
alter table pieces add column if not exists flattened_thumbhash text;
