-- Run this in your Supabase SQL Editor

-- Create status enum
create type plan_status as enum ('wishlist', 'planned', 'done');

-- Create date_plans table
create table date_plans (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  planned_date date,
  planned_time text,
  status plan_status not null default 'wishlist',
  created_by uuid references auth.users(id) on delete cascade not null,
  creator_name text,
  updated_by_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Create locations table
create table locations (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid references date_plans(id) on delete cascade not null,
  name text not null,
  url text not null,
  platform text not null default 'other',
  notes text,
  sort_order int not null default 0
);

-- Enable Row Level Security
alter table date_plans enable row level security;
alter table locations enable row level security;

-- Allow all authenticated users to read and write everything
-- (safe for a 2-person private app)
create policy "Authenticated users can do everything with plans"
  on date_plans for all
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated users can do everything with locations"
  on locations for all
  to authenticated
  using (true)
  with check (true);

-- Auto-update updated_at on date_plans changes
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger date_plans_updated_at
  before update on date_plans
  for each row execute function update_updated_at();

-- Enable Realtime for both tables
alter publication supabase_realtime add table date_plans;
alter publication supabase_realtime add table locations;
