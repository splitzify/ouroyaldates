-- Run this in Supabase SQL Editor to enable web push notifications.
-- Stores one row per device that has subscribed.

create table if not exists push_subscriptions (
  endpoint     text primary key,
  p256dh       text not null,
  auth         text not null,
  user_id      uuid references auth.users(id) on delete cascade,
  display_name text,
  created_at   timestamptz not null default now()
);

alter table push_subscriptions enable row level security;

-- Allow any authenticated user to manage subscriptions (2-person private app).
drop policy if exists "Authenticated users can manage push subscriptions"
  on push_subscriptions;

create policy "Authenticated users can manage push subscriptions"
  on push_subscriptions for all
  to authenticated
  using (true)
  with check (true);
