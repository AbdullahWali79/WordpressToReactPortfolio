-- Helper: check if current user is admin
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  );
$$;

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.pages enable row level security;
alter table public.portfolio_projects enable row level security;
alter table public.categories enable row level security;
alter table public.tags enable row level security;
alter table public.post_tags enable row level security;
alter table public.settings enable row level security;
alter table public.media_items enable row level security;
alter table public.audit_logs enable row level security;

-- PROFILES
drop policy if exists "profiles_select_self_or_admin" on public.profiles;
create policy "profiles_select_self_or_admin"
on public.profiles
for select
using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles_update_self_or_admin" on public.profiles;
create policy "profiles_update_self_or_admin"
on public.profiles
for update
using (auth.uid() = id or public.is_admin())
with check (auth.uid() = id or public.is_admin());

drop policy if exists "profiles_insert_admin_only" on public.profiles;
create policy "profiles_insert_admin_only"
on public.profiles
for insert
with check (public.is_admin());

-- POSTS
drop policy if exists "posts_public_select_published" on public.posts;
create policy "posts_public_select_published"
on public.posts
for select
using (status = 'published' or public.is_admin());

drop policy if exists "posts_admin_insert" on public.posts;
create policy "posts_admin_insert"
on public.posts
for insert
with check (public.is_admin());

drop policy if exists "posts_admin_update" on public.posts;
create policy "posts_admin_update"
on public.posts
for update
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "posts_admin_delete" on public.posts;
create policy "posts_admin_delete"
on public.posts
for delete
using (public.is_admin());

-- PAGES
drop policy if exists "pages_public_select_published" on public.pages;
create policy "pages_public_select_published"
on public.pages
for select
using (status = 'published' or public.is_admin());

drop policy if exists "pages_admin_insert" on public.pages;
create policy "pages_admin_insert"
on public.pages
for insert
with check (public.is_admin());

drop policy if exists "pages_admin_update" on public.pages;
create policy "pages_admin_update"
on public.pages
for update
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "pages_admin_delete" on public.pages;
create policy "pages_admin_delete"
on public.pages
for delete
using (public.is_admin());

-- PORTFOLIO
drop policy if exists "portfolio_public_select_published" on public.portfolio_projects;
create policy "portfolio_public_select_published"
on public.portfolio_projects
for select
using (status = 'published' or public.is_admin());

drop policy if exists "portfolio_admin_insert" on public.portfolio_projects;
create policy "portfolio_admin_insert"
on public.portfolio_projects
for insert
with check (public.is_admin());

drop policy if exists "portfolio_admin_update" on public.portfolio_projects;
create policy "portfolio_admin_update"
on public.portfolio_projects
for update
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "portfolio_admin_delete" on public.portfolio_projects;
create policy "portfolio_admin_delete"
on public.portfolio_projects
for delete
using (public.is_admin());

-- CATEGORIES
drop policy if exists "categories_public_select" on public.categories;
create policy "categories_public_select"
on public.categories
for select
using (true);

drop policy if exists "categories_admin_manage" on public.categories;
create policy "categories_admin_manage"
on public.categories
for all
using (public.is_admin())
with check (public.is_admin());

-- TAGS
drop policy if exists "tags_public_select" on public.tags;
create policy "tags_public_select"
on public.tags
for select
using (true);

drop policy if exists "tags_admin_manage" on public.tags;
create policy "tags_admin_manage"
on public.tags
for all
using (public.is_admin())
with check (public.is_admin());

-- POST_TAGS
drop policy if exists "post_tags_public_select" on public.post_tags;
create policy "post_tags_public_select"
on public.post_tags
for select
using (true);

drop policy if exists "post_tags_admin_manage" on public.post_tags;
create policy "post_tags_admin_manage"
on public.post_tags
for all
using (public.is_admin())
with check (public.is_admin());

-- SETTINGS
drop policy if exists "settings_public_select" on public.settings;
create policy "settings_public_select"
on public.settings
for select
using (true);

drop policy if exists "settings_admin_manage" on public.settings;
create policy "settings_admin_manage"
on public.settings
for all
using (public.is_admin())
with check (public.is_admin());

-- MEDIA ITEMS
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

-- AUDIT LOGS
drop policy if exists "audit_logs_admin_select" on public.audit_logs;
create policy "audit_logs_admin_select"
on public.audit_logs
for select
using (public.is_admin());

drop policy if exists "audit_logs_admin_insert" on public.audit_logs;
create policy "audit_logs_admin_insert"
on public.audit_logs
for insert
with check (public.is_admin());

drop policy if exists "audit_logs_admin_delete" on public.audit_logs;
create policy "audit_logs_admin_delete"
on public.audit_logs
for delete
using (public.is_admin());
