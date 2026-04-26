-- Run this in Supabase SQL Editor to add the 'pending' status
-- Adds a new value to the plan_status enum

alter type plan_status add value if not exists 'pending' before 'planned';
