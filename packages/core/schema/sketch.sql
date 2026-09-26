-- Applied on every deploy: every statement must be safe to re-run.

alter table pieces add column if not exists sketch_key text;
alter table pieces add column if not exists sketch_width int;
alter table pieces add column if not exists sketch_height int;
alter table pieces add column if not exists sketch_version int not null default 0;
