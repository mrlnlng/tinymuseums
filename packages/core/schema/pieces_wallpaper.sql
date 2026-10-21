-- Applied on every deploy: every statement must be safe to re-run.

alter table pieces add column if not exists wallpaper_url text;
