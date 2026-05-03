-- Run this once in Supabase SQL Editor.
-- Project: malaysia-ge16-quiz

create table if not exists public.submissions (
  id           bigserial primary key,
  created_at   timestamptz not null default now(),
  source       text not null check (source in ('gps','ip')),
  ip           text,
  country      text,
  state        text,
  state_code   text,
  city         text,
  lat          double precision,
  lng          double precision,
  lang         text,
  answers      jsonb not null,
  winner       text not null,
  percent      jsonb not null,
  submission_id text,
  ua           text
);

create index if not exists submissions_state_idx     on public.submissions (state);
create index if not exists submissions_winner_idx    on public.submissions (winner);
create index if not exists submissions_created_idx   on public.submissions (created_at desc);
create index if not exists submissions_source_idx    on public.submissions (source);

-- Lock the table down: only the service role (used by our edge function) may touch it.
alter table public.submissions enable row level security;

-- No anon insert/select policies = anonymous clients cannot read or write directly.
-- The edge function uses SUPABASE_SERVICE_ROLE_KEY which bypasses RLS.

-- Convenience view for quick aggregate queries.
create or replace view public.submissions_by_state as
select
  state,
  count(*)                                       as total,
  count(*) filter (where winner = 'ph')          as ph,
  count(*) filter (where winner = 'bn')          as bn,
  count(*) filter (where winner = 'pn')          as pn,
  count(*) filter (where source = 'gps')         as gps_source,
  count(*) filter (where source = 'ip')          as ip_source
from public.submissions
where state is not null
group by state
order by total desc;
