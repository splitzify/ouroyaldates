-- Run this in Supabase SQL Editor if you already ran migration.sql
-- Adds new columns for time, creator name, and last-editor tracking

alter table date_plans add column if not exists planned_time text;
alter table date_plans add column if not exists creator_name text;
alter table date_plans add column if not exists updated_by_name text;
