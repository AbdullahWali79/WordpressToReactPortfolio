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
