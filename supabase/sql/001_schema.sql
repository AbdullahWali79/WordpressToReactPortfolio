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

-- Media library (URL-only)
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

drop trigger if exists media_items_set_updated_at on public.media_items;
create trigger media_items_set_updated_at before update on public.media_items
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
create index if not exists idx_media_items_type_created_at on public.media_items(media_type, created_at desc);

-- Text search indexes (simple GIN)
create index if not exists idx_posts_search on public.posts using gin (to_tsvector('english', coalesce(title, '') || ' ' || coalesce(excerpt, '') || ' ' || coalesce(content, '')));
create index if not exists idx_pages_search on public.pages using gin (to_tsvector('english', coalesce(title, '') || ' ' || coalesce(content, '')));
create index if not exists idx_portfolio_search on public.portfolio_projects using gin (to_tsvector('english', coalesce(title, '') || ' ' || coalesce(short_description, '') || ' ' || coalesce(full_description, '')));
