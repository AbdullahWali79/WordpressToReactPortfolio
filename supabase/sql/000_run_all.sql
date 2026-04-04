-- RUN THIS FILE IN SUPABASE SQL EDITOR (TOP TO BOTTOM)
-- ----------------------------------------------------

-- SECTION 1: SCHEMA
-- Enable required extensions
create extension if not exists pgcrypto;

-- Enums
do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type public.user_role as enum ('admin', 'editor', 'author');
  end if;

  if not exists (select 1 from pg_type where typname = 'content_status') then
    create type public.content_status as enum ('draft', 'published');
  end if;
end $$;

-- Shared utility function for updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text unique,
  role public.user_role not null default 'author',
  created_at timestamptz not null default now()
);

-- Categories
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  created_at timestamptz not null default now()
);

-- Tags
create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  created_at timestamptz not null default now()
);

-- Posts
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  excerpt text,
  content text not null,
  featured_image_url text,
  image_alt text,
  category_id uuid references public.categories(id) on delete set null,
  status public.content_status not null default 'draft',
  author_id uuid references public.profiles(id) on delete set null,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  seo_title text,
  meta_description text,
  focus_keyword text,
  canonical_url text,
  og_title text,
  og_description text,
  og_image_url text,
  schema_type text default 'BlogPosting',
  robots text not null default 'index,follow',
  seo_score integer not null default 0 check (seo_score >= 0 and seo_score <= 100)
);

-- Dynamic Pages
create table if not exists public.pages (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  content text not null,
  featured_image_url text,
  image_alt text,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  seo_title text,
  meta_description text,
  focus_keyword text,
  canonical_url text,
  og_title text,
  og_description text,
  og_image_url text,
  schema_type text default 'WebPage',
  robots text not null default 'index,follow',
  seo_score integer not null default 0 check (seo_score >= 0 and seo_score <= 100)
);

-- Portfolio Projects
create table if not exists public.portfolio_projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  short_description text,
  full_description text not null,
  technologies text[] not null default '{}',
  project_url text,
  github_url text,
  featured_image_url text,
  image_alt text,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  seo_title text,
  meta_description text,
  focus_keyword text,
  canonical_url text,
  og_title text,
  og_description text,
  og_image_url text,
  schema_type text default 'CreativeWork',
  robots text not null default 'index,follow',
  seo_score integer not null default 0 check (seo_score >= 0 and seo_score <= 100)
);

-- Post tags pivot
create table if not exists public.post_tags (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  unique (post_id, tag_id)
);

-- Site settings singleton
create table if not exists public.settings (
  id uuid primary key default gen_random_uuid(),
  site_name text not null default 'Custom CMS',
  site_description text,
  logo_url text,
  favicon_url text,
  default_seo_title text,
  default_meta_description text,
  default_og_image_url text,
  contact_email text,
  phone_number text,
  address text,
  social_links jsonb not null default '{}'::jsonb,
  footer_text text,
  homepage_hero_content text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Audit logs
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  action_type text not null,
  entity_type text not null,
  entity_id uuid,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Trigger for updated_at
drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at before update on public.posts
for each row execute function public.set_updated_at();

drop trigger if exists pages_set_updated_at on public.pages;
create trigger pages_set_updated_at before update on public.pages
for each row execute function public.set_updated_at();

drop trigger if exists portfolio_set_updated_at on public.portfolio_projects;
create trigger portfolio_set_updated_at before update on public.portfolio_projects
for each row execute function public.set_updated_at();

drop trigger if exists settings_set_updated_at on public.settings;
create trigger settings_set_updated_at before update on public.settings
for each row execute function public.set_updated_at();

-- Profile creation on auth signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    'author'
  )
  on conflict (id) do update
    set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Useful indexes
create index if not exists idx_posts_status_published_at on public.posts(status, published_at desc);
create index if not exists idx_posts_category on public.posts(category_id);
create index if not exists idx_posts_author on public.posts(author_id);
create index if not exists idx_pages_status on public.pages(status);
create index if not exists idx_pages_slug on public.pages(slug);
create index if not exists idx_portfolio_status on public.portfolio_projects(status);
create index if not exists idx_portfolio_slug on public.portfolio_projects(slug);
create index if not exists idx_post_tags_post_id on public.post_tags(post_id);
create index if not exists idx_post_tags_tag_id on public.post_tags(tag_id);
create index if not exists idx_audit_logs_created_at on public.audit_logs(created_at desc);

-- Text search indexes (simple GIN)
create index if not exists idx_posts_search on public.posts using gin (to_tsvector('english', coalesce(title, '') || ' ' || coalesce(excerpt, '') || ' ' || coalesce(content, '')));
create index if not exists idx_pages_search on public.pages using gin (to_tsvector('english', coalesce(title, '') || ' ' || coalesce(content, '')));
create index if not exists idx_portfolio_search on public.portfolio_projects using gin (to_tsvector('english', coalesce(title, '') || ' ' || coalesce(short_description, '') || ' ' || coalesce(full_description, '')));

-- SECTION 2: RLS POLICIES
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

-- SECTION 3: SEED DATA
-- Seed categories
insert into public.categories (name, slug)
values
  ('Engineering', 'engineering'),
  ('SEO', 'seo'),
  ('Case Studies', 'case-studies')
on conflict (slug) do nothing;

-- Seed tags
insert into public.tags (name, slug)
values
  ('Next.js', 'nextjs'),
  ('Supabase', 'supabase'),
  ('Performance', 'performance'),
  ('Architecture', 'architecture')
on conflict (slug) do nothing;

-- Seed settings (singleton style)
insert into public.settings (
  site_name,
  site_description,
  default_seo_title,
  default_meta_description,
  footer_text,
  contact_email,
  social_links,
  homepage_hero_content
)
values (
  'Custom CMS Portfolio',
  'A secure and SEO-focused custom CMS website.',
  'Custom CMS Portfolio | Modern SEO-first website',
  'Portfolio + blog platform with hidden CMS routes, structured SEO, and fast rendering.',
  '© 2026 Custom CMS Portfolio',
  'hello@example.com',
  '{"x":"https://x.com/yourname","github":"https://github.com/yourname"}'::jsonb,
  'Publish blog posts, case studies, and dynamic pages from one secure CMS.'
)
on conflict do nothing;

-- Optional: promote an existing auth user to admin after signup.
-- Replace `admin@example.com` with your real admin account email.
update public.profiles
set role = 'admin'
where email = 'admin@example.com';

-- Optional sample content.
do $$
declare
  seo_category uuid;
  first_post uuid;
begin
  select id into seo_category from public.categories where slug = 'seo' limit 1;

  insert into public.posts (
    title, slug, excerpt, content, category_id, status, seo_title, meta_description, focus_keyword,
    canonical_url, og_title, og_description, schema_type, robots, seo_score, published_at
  )
  values (
    'How We Built a Hidden CMS Path Securely',
    'hidden-cms-path-security',
    'A practical walkthrough for securing custom CMS routes.',
    '<p>Security starts with layered controls, not obscurity.</p><h2>Route Protection</h2><p>Use middleware, role checks, and server validation.</p><p><a href="/blog">See related posts</a></p>',
    seo_category,
    'published',
    'How We Built a Hidden CMS Path Securely',
    'A practical guide for protecting hidden CMS routes with middleware and role checks.',
    'hidden cms path',
    'https://example.com/blog/hidden-cms-path-security',
    'How We Built a Hidden CMS Path Securely',
    'A practical walkthrough for securing custom CMS routes.',
    'BlogPosting',
    'index,follow',
    82,
    now()
  )
  on conflict (slug) do nothing
  returning id into first_post;

  insert into public.pages (
    title, slug, content, status, seo_title, meta_description, schema_type, robots, seo_score
  )
  values (
    'About Our CMS',
    'about-our-cms',
    '<p>This page was created from the custom CMS pages module.</p>',
    'published',
    'About Our CMS',
    'Learn how this custom CMS is structured.',
    'AboutPage',
    'index,follow',
    75
  )
  on conflict (slug) do nothing;

  insert into public.portfolio_projects (
    title, slug, short_description, full_description, technologies, status, seo_title, meta_description,
    schema_type, robots, seo_score
  )
  values (
    'SEO Automation Dashboard',
    'seo-automation-dashboard',
    'Dashboard with content scoring and optimization workflows.',
    '<p>A modern dashboard for SEO workflows.</p><h2>Outcome</h2><p>Faster publishing with quality checks.</p>',
    array['Next.js', 'Supabase', 'Tailwind'],
    'published',
    'SEO Automation Dashboard',
    'Project showcase for a modern SEO dashboard.',
    'CreativeWork',
    'index,follow',
    79
  )
  on conflict (slug) do nothing;

  if first_post is not null then
    insert into public.post_tags (post_id, tag_id)
    select first_post, t.id
    from public.tags t
    where t.slug in ('nextjs', 'supabase')
    on conflict do nothing;
  end if;
end $$;

-- SECTION 4: SET YOUR ADMIN EMAIL
-- Replace with your actual admin login email
update public.profiles set role = 'admin' where email = 'abdullahwale@gmail.com';
