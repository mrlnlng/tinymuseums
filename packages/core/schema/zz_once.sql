-- Applied on every deploy after the other files; each step runs once and is then recorded.

create table if not exists schema_once (
  name       text primary key,
  applied_at timestamptz not null default now()
);

-- Start the Performance and Visitors metrics from zero. Followers and enquiry messages are kept.
do $$
begin
  if not exists (select 1 from schema_once where name = 'reset-metrics-2026-09-26') then
    if to_regclass('public.vitals') is not null then
      truncate vitals;
    end if;
    if to_regclass('public.events') is not null then
      truncate events;
    end if;
    insert into schema_once (name) values ('reset-metrics-2026-09-26');
  end if;
end
$$;
