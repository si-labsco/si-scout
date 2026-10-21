-- Tables for the Si-Labs scout. Each row stores the full City / Venture object (data/ventures.ts) as JSON.
-- The app seeds them with the sample data on first read if they are empty.

create table if not exists cities (
  id text primary key,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists ventures (
  id text primary key,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Only the server (service role key) reads and writes these tables.
alter table cities enable row level security;
alter table ventures enable row level security;
