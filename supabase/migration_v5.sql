-- Run this in Supabase SQL Editor.
-- Adds royal-quest fields to date_plans.

alter table date_plans add column if not exists objective   text;
alter table date_plans add column if not exists side_quests jsonb not null default '[]'::jsonb;
alter table date_plans add column if not exists trinkets    jsonb not null default '[]'::jsonb;
