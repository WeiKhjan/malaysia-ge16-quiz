-- Run once in Neon SQL Editor (Vercel Storage → your Neon DB → Open in Neon → SQL Editor).

create table if not exists submissions (
  id            bigserial primary key,
  created_at    timestamptz not null default now(),
  source        text not null check (source in ('gps','ip')),
  ip            text,
  country       text,
  state         text,
  state_code    text,
  city          text,
  lat           double precision,
  lng           double precision,
  lang          text,
  answers       jsonb not null,
  winner        text not null,
  percent       jsonb not null,
  submission_id text,
  ua            text
);

create index if not exists submissions_state_idx   on submissions (state);
create index if not exists submissions_winner_idx  on submissions (winner);
create index if not exists submissions_created_idx on submissions (created_at desc);
create index if not exists submissions_source_idx  on submissions (source);

-- Convenience view for quick aggregates by state.
create or replace view submissions_by_state as
select
  state,
  count(*)                                       as total,
  count(*) filter (where winner = 'ph')          as ph,
  count(*) filter (where winner = 'bn')          as bn,
  count(*) filter (where winner = 'pn')          as pn,
  count(*) filter (where source = 'gps')         as gps_source,
  count(*) filter (where source = 'ip')          as ip_source
from submissions
where state is not null
group by state
order by total desc;
