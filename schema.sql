-- ============================================================
-- the firefly jar — database schema
-- Run this in Supabase: Dashboard → SQL Editor → New query → Run
-- ============================================================

create table if not exists public.fireflies (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references auth.users(id) on delete cascade not null,
  memory_text  text not null check (char_length(memory_text) <= 600),
  color        text not null default '#e7bd6c',
  memory_date  date not null,          -- the date it should light up (past = glows immediately)
  created_on   date not null default current_date,
  opened       boolean not null default false,
  notified     boolean not null default false,  -- has the "it lit up" email been sent
  pos_x        numeric not null,
  pos_y        numeric not null,
  drift_x      numeric not null,
  drift_y      numeric not null,
  duration     numeric not null,
  delay        numeric not null,
  photos       text[] not null default '{}',
  created_at   timestamptz not null default now()
);

-- If the table already exists from an earlier version of this schema, run:
-- alter table public.fireflies add column if not exists photos text[] not null default '{}';

-- Row Level Security: everyone can only ever see/change their own jar
alter table public.fireflies enable row level security;

create policy "select own fireflies"
  on public.fireflies for select
  using (auth.uid() = user_id);

create policy "insert own fireflies"
  on public.fireflies for insert
  with check (auth.uid() = user_id);

create policy "update own fireflies"
  on public.fireflies for update
  using (auth.uid() = user_id);

create policy "delete own fireflies"
  on public.fireflies for delete
  using (auth.uid() = user_id);

-- Helpful index for the daily "which fireflies just lit up" scan
create index if not exists fireflies_notify_idx
  on public.fireflies (memory_date, notified)
  where notified = false;

-- ============================================================
-- storage bucket for memory photos
-- ============================================================
insert into storage.buckets (id, name, public)
values ('firefly-photos', 'firefly-photos', true)
on conflict (id) do nothing;

-- files are stored under `${user_id}/...`, so folder name doubles as ownership check
create policy "read own or public firefly photos"
  on storage.objects for select
  using (bucket_id = 'firefly-photos');

create policy "upload own firefly photos"
  on storage.objects for insert
  with check (bucket_id = 'firefly-photos' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "delete own firefly photos"
  on storage.objects for delete
  using (bucket_id = 'firefly-photos' and (storage.foldername(name))[1] = auth.uid()::text);
