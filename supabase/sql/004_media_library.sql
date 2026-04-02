-- Media library migration for an existing project.
-- Run this in Supabase SQL Editor after the original schema/RLS scripts.

create table if not exists public.media_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  media_type text not null check (media_type in ('image', 'video')),
  source_url text not null,
  thumbnail_url text,
  alt_text text,
  provider text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists media_items_set_updated_at on public.media_items;
create trigger media_items_set_updated_at before update on public.media_items
for each row execute function public.set_updated_at();

create index if not exists idx_media_items_type_created_at on public.media_items(media_type, created_at desc);

alter table public.media_items enable row level security;

drop policy if exists "media_items_admin_select" on public.media_items;
create policy "media_items_admin_select"
on public.media_items
for select
using (public.is_admin());

drop policy if exists "media_items_admin_manage" on public.media_items;
create policy "media_items_admin_manage"
on public.media_items
for all
using (public.is_admin())
with check (public.is_admin());
